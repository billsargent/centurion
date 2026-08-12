// ============================================================
// Real CPU Bridge
// Loads the compiled cen.js (browser emulator) into Node.js
// using DOM polyfills, extracts the MCCPU instance, and wraps
// it as ICCPU for the server.
// ============================================================

import { installPolyfills } from './polyfills';
import { loadAMDModule } from './amd-loader';
import { ICCPU, BreakFunction, DMADevice } from '../../../shared/interfaces';
import * as path from 'path';
import * as fs from 'fs';

// Polyfills must be installed before any browser code runs
installPolyfills();

let realCPU: ICCPU | null = null;
let loaded = false;

/**
 * Load the real MCCPU from the compiled browser emulator.
 * This must be called before accessing `getCPU()`.
 */
export function loadRealCPU(): ICCPU {
    if (loaded && realCPU) return realCPU;

    console.log('[Bridge] Loading compiled cen.js...');

    // Determine path to js/cen.js relative to server root.
    // Try both ts-node (server/src/core) and compiled (server/dist/server/src/core) layouts.
    const candidates = [
        path.resolve(__dirname, '..', '..', '..', 'js', 'cen.js'),            // ts-node
        path.resolve(__dirname, '..', '..', '..', '..', '..', 'js', 'cen.js'), // compiled dist
    ];
    const cenJsPath = candidates.find(p => fs.existsSync(p)) || candidates[0];
    console.log(`[Bridge] Loading from: ${cenJsPath}`);

    try {
        loadAMDModule(cenJsPath);
    } catch (err) {
        console.error('[Bridge] Failed to load cen.js:', err);
        throw err;
    }

    // After cen.js loads, it sets window.cpu = mcsim
    const g = global as any;
    const mcsim = g.window?.cpu;

    if (!mcsim) {
        throw new Error(
            '[Bridge] cen.js loaded but window.cpu is not set.\n' +
            'This likely means cen.js encountered errors during initialization.\n' +
            'Check the console output above for any errors from the polyfilled browser APIs.'
        );
    }

    // Wrap MCCPU to implement the ICCPU interface expected by the server
    realCPU = wrapMCCPU(mcsim);
    loaded = true;

    console.log('[Bridge] Real MCCPU loaded and wrapped successfully.');
    return realCPU;
}

/**
 * Check if the real CPU has been loaded.
 */
export function isRealCPULoaded(): boolean {
    return loaded && realCPU !== null;
}

/**
 * Get the real CPU instance. Must call loadRealCPU() first.
 */
export function getCPU(): ICCPU {
    if (!realCPU) {
        throw new Error('Real CPU not loaded. Call loadRealCPU() first.');
    }
    return realCPU;
}

/**
 * Get the backplane and device instances from the loaded cen.js globals.
 */
export function getRealDevices(): {
    backplane: any;
    dsk2: any;
    finch: any;
    mux: any;
} {
    const g = global as any;
    return {
        backplane: g.window?.bpl,
        dsk2: g.window?.io_dsk2,
        finch: g.window?.io_ffc,
        mux: g.window?.io_mux,
    };
}

/**
 * Wrap the raw MCCPU object to satisfy our ICCPU interface.
 * The MCCPU class in cen.ts already has most of the same interface,
 * but we need to ensure all accessors are present.
 */
function wrapMCCPU(raw: any): ICCPU {
    // MCCPU already implements most of ICCPU natively.
    // We just need to ensure missing accessors are bridged.

    // Add missing accessors if they don't exist directly on raw
    const cpu: ICCPU = {
        can_step: raw.can_step ?? true,

        step: (dbg: boolean) => raw.step(dbg),
        showstate: (_in_halt: boolean) => {
            // State display is handled by the Telnet control panel
            // No DOM rendering needed
            raw.showstate?.(_in_halt);
        },
        reset: () => raw.reset(),

        // Accessors - bridge directly from raw MCCPU
        get level() { return raw.level ?? 0; },
        get map() { return raw.map ?? 0; },
        get pc() { return raw.pc ?? raw.physaddr ?? 0; },
        get physaddr() { return raw.physaddr ?? 0; },
        get at_boundry() { return raw.at_boundry ?? true; },
        get cc() { return raw.cc ?? 0; },
        get parity() { return raw.parity ?? 0; },
        get memfault() { return raw.memfault ?? 0; },
        get memaddr() { return raw.memaddr ?? raw.physaddr ?? 0; },

        get regfile() { return raw.regfile ?? raw.registers?.[raw.level ?? 0]?.bytes ?? new Uint8Array(256); },
        get pagetb() { return raw.page_ram ?? new Uint8Array(256); },

        get workaddr() { return (global as any).workaddr ?? 0; },
        get result() { return (global as any).result ?? 0; },
        get rir() { return (global as any).rir ?? 0; },
        get rdr() { return (global as any).rdr ?? 0; },
        get swap() { return (global as any).swap ?? 0; },
        get alu_flag() { return (global as any).alu_flag ?? 0; },
        get busctl() { return (global as any).busctl ?? 0; },
        get sysctl() { return (global as any).sysctl ?? 0; },
        get pgram() { return (global as any).pgram ?? 0; },
        get memdata_in() { return (global as any).memdata_in ?? 0; },
        get memdata_out() { return (global as any).memdata_out ?? 0; },
        get seq_out() { return (global as any).s2?.output ?? 0; },
        get datapath() { return (global as any).datapath ?? 0; },
        get dma_status() { return 0; },
        get micro_op0() { return 0; },
        get micro_op1() { return 0; },
        get seq_p() { return (global as any).mcpc ?? 0; },
        get seq_h() { return 0; },
        get seq_sp() { return (global as any).s0?.sp ?? 0; },
        get seq_sf() {
            const g = global as any;
            return [
                g.s2?.sf[g.s2?.sp ?? 0] ?? 0,
                g.s2?.sf[(g.s2?.sp ?? 0 + 1) & 3] ?? 0,
                g.s2?.sf[(g.s2?.sp ?? 0 + 2) & 3] ?? 0,
                g.s2?.sf[(g.s2?.sp ?? 0 + 3) & 3] ?? 0,
            ];
        },
        get alu_q() { return (global as any).aluc?.regq ?? 0; },
        get alu_r() { return (global as any).aluc?.reg ?? new Uint8Array(16); },

        // Sequencer display registers
        get s0_output() { return (global as any).s0?.output ?? 0; },
        get s1_output() { return (global as any).s1?.output ?? 0; },
        get s2_output() { return (global as any).s2?.output ?? 0; },
        get s0_p() { return (global as any).s0?.p ?? 0; },
        get s1_p() { return (global as any).s1?.p ?? 0; },
        get s2_p() { return (global as any).s2?.p ?? 0; },
        get s0_h() { return (global as any).s0?.h ?? 0; },
        get s1_h() { return (global as any).s1?.h ?? 0; },
        get s2_h() { return (global as any).s2?.h ?? 0; },
        get s0_sp() { return (global as any).s0?.sp ?? 0; },
        get s1_sp() { return (global as any).s1?.sp ?? 0; },
        get s2_sp() { return (global as any).s2?.sp ?? 0; },
        get s0_sf() { return (global as any).s0?.sf ?? [0, 0, 0, 0]; },
        get s1_sf() { return (global as any).s1?.sf ?? [0, 0, 0, 0]; },
        get s2_sf() { return (global as any).s2?.sf ?? [0, 0, 0, 0]; },
        get alu_reg() { return (global as any).aluc?.reg ?? new Uint8Array(16); },
        get alu_regq() { return (global as any).aluc?.regq ?? 0; },

        // Breakpoints
        add_virtual_break: (addr: number, f: BreakFunction | null | number) =>
            raw.add_virtual_break?.(addr, f) ?? 1,
        remove_break: (f: BreakFunction | null | number) =>
            raw.remove_break?.(f),
        remove_break_at: (addr: number) =>
            raw.remove_break_at?.(addr),
        change_virtual_break: (old_f: BreakFunction | null | number, new_f: BreakFunction) =>
            raw.change_virtual_break?.(old_f, new_f),

        // DMA
        dma_register: (dev: DMADevice) => raw.dma_register?.(dev),
        dma_int: (dev: DMADevice, en: boolean) => raw.dma_int?.(dev, en),
        dma_request: () => raw.dma_request?.(),
        set_pc: (va: number) => raw.set_pc?.(va),
    };

    return cpu;
}
