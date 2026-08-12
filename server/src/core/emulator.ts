// ============================================================
// Core Emulator Bridge
//
// This module initializes the Centurion CPU-6 emulation core
// in a Node.js context. It provides the ICCPU interface and
// all hardware devices needed by the Telnet and WebSocket layers.
//
// Uses tryLoadRealCPU() to attempt loading the real MCCPU from
// the compiled browser emulator (js/cen.js) via DOM polyfills.
// Falls back to StubCPU if the real core can't be loaded.
// ============================================================

import {
    ICCPU, BreakFunction, DMADevice, DMAControl,
    DiskImage, DiskContainer,
    CharDevice, MemAccess, IOAccess, Run,
    MemStatus, FINCH_TRACK, FINCH_PLAT,
} from '../../../shared/interfaces';

import * as fs from 'fs';
import * as path from 'path';

// Lazy import of real CPU bridge to avoid loading polyfills at import time
let loadRealCPU: (() => ICCPU) | null = null;
let isRealCPULoaded: (() => boolean) | null = null;

// ============================================================
// Utility functions (mirrored from cen.ts)
// ============================================================

export function hex(value: number, digits: number = 4): string {
    let s = (value >>> 0).toString(16).toUpperCase();
    while (s.length < digits) s = '0' + s;
    if (s.length > digits) s = s.substring(s.length - digits);
    return s;
}

// ============================================================
// Stub CPU (placeholder until real MCCPU is extracted)
// ============================================================

class StubCPU implements ICCPU {
    can_step = true;

    // State
    private _level = 0;
    private _map = 0;
    private _pc = 0x100;
    private _physaddr = 0x100;
    private _cc = 0;
    private _parity = 0;
    private _memfault = 0;
    private _regfile = new Uint8Array(256);
    private _pagetb = new Uint8Array(256);
    private _workaddr = 0;
    private _result = 0;
    private _rir = 0;
    private _rdr = 0;
    private _swap = 0;
    private _alu_flag = 0;
    private _busctl = 0;
    private _sysctl = 0;
    private _pgram = 0;
    private _memdata_in = 0;
    private _memdata_out = 0;
    private _seq_out = 0;
    private _datapath = 0;
    private _dma_status = 0;
    private _micro_op0 = 0;
    private _micro_op1 = 0;
    private _seq_p = 0;
    private _seq_h = 0;
    private _seq_sp = 0;
    private _seq_sf = [0, 0, 0, 0];
    private _alu_q = 0;
    private _alu_r = new Uint8Array(16);

    // Sequencer state for microcode display
    private _s0_output = 0;
    private _s1_output = 0;
    private _s2_output = 0;
    private _s0_p = 0;
    private _s1_p = 0;
    private _s2_p = 0;
    private _s0_h = 0;
    private _s1_h = 0;
    private _s2_h = 0;
    private _s0_sp = 0;
    private _s1_sp = 0;
    private _s2_sp = 0;
    private _s0_sf = [0, 0, 0, 0];
    private _s1_sf = [0, 0, 0, 0];
    private _s2_sf = [0, 0, 0, 0];
    private _alu_reg = new Uint8Array(16);
    private _alu_regq = 0;

    // Breakpoints
    private vmbreak = new Uint8Array(65536);
    private break_list: (BreakFunction | null)[] = [
        () => false, // 0: null
        (kind, addr, phys) => { console.log(`BRK: ${hex(addr)}`); return true; }, // 1: default
    ];

    // Accessors
    get level() { return this._level; }
    get map() { return this._map; }
    get pc() { return this._pc; }
    get physaddr() { return this._physaddr; }
    get at_boundry() { return true; }
    get cc() { return this._cc; }
    get parity() { return this._parity; }
    get memfault() { return this._memfault; }
    get regfile() { return this._regfile; }
    get pagetb() { return this._pagetb; }
    get workaddr() { return this._workaddr; }
    get result() { return this._result; }
    get rir() { return this._rir; }
    get rdr() { return this._rdr; }
    get swap() { return this._swap; }
    get alu_flag() { return this._alu_flag; }
    get busctl() { return this._busctl; }
    get sysctl() { return this._sysctl; }
    get pgram() { return this._pgram; }
    get memdata_in() { return this._memdata_in; }
    get memdata_out() { return this._memdata_out; }
    get seq_out() { return this._seq_out; }
    get datapath() { return this._datapath; }
    get dma_status() { return this._dma_status; }
    get micro_op0() { return this._micro_op0; }
    get micro_op1() { return this._micro_op1; }
    get seq_p() { return this._seq_p; }
    get seq_h() { return this._seq_h; }
    get seq_sp() { return this._seq_sp; }
    get seq_sf() { return this._seq_sf; }
    get alu_q() { return this._alu_q; }
    get alu_r() { return this._alu_r; }
    get memaddr() { return this._pc; }
    get s0_output() { return this._s0_output; }
    get s1_output() { return this._s1_output; }
    get s2_output() { return this._s2_output; }
    get s0_p() { return this._s0_p; }
    get s1_p() { return this._s1_p; }
    get s2_p() { return this._s2_p; }
    get s0_h() { return this._s0_h; }
    get s1_h() { return this._s1_h; }
    get s2_h() { return this._s2_h; }
    get s0_sp() { return this._s0_sp; }
    get s1_sp() { return this._s1_sp; }
    get s2_sp() { return this._s2_sp; }
    get s0_sf() { return this._s0_sf; }
    get s1_sf() { return this._s1_sf; }
    get s2_sf() { return this._s2_sf; }
    get alu_reg() { return this._alu_reg; }
    get alu_regq() { return this._alu_regq; }

    step(dbg: boolean): void {
        // TODO: Replace with real MCCPU.step() when core is extracted
        this._pc = (this._pc + 1) & 0xFFFF;
        this._physaddr = this._pc;
    }

    showstate(in_halt: boolean): void {
        // Handled by Telnet control panel
    }

    reset(): void {
        this._pc = 0x100;
        this._physaddr = 0x100;
        this._level = 0;
        this._cc = 0;
        this._busctl = 0;
        this._sysctl = 0;
        console.log('[Core] CPU Reset');
    }

    set_pc(va: number): void {
        this._pc = va & 0xFFFF;
        this._physaddr = va & 0xFFFF;
    }

    add_virtual_break(address: number, f: BreakFunction | null | number): number {
        let i: number;
        if (typeof f === 'number') {
            i = f;
            if (i < 1 || i > 255) throw new Error('Invalid breakpoint');
        } else if (typeof f === 'function') {
            i = this.break_list.indexOf(f);
            if (i === -1) {
                i = this.break_list.indexOf(null, 1);
                if (i === -1) i = this.break_list.length;
                this.break_list[i] = f;
            }
        } else {
            i = 1; // default
        }
        this.vmbreak[address] = i;
        return i;
    }

    remove_break(f: BreakFunction | null | number): void {
        if (typeof f === 'number' && f > 1 && f < 256) {
            this.break_list[f] = null;
        }
    }

    remove_break_at(address: number): void {
        this.vmbreak[address] = 0;
    }

    change_virtual_break(old_f: BreakFunction | null | number, new_f: BreakFunction): void {
        let i: number;
        if (typeof old_f === 'number') i = old_f;
        else i = this.break_list.indexOf(old_f);
        if (i > 0) this.break_list[i] = new_f;
    }

    dma_register(device: DMADevice): void {
        console.log(`[Core] DMA device registered: mask=${device.dma_mask}`);
    }

    dma_int(dev: DMADevice, en: boolean): void {
        // Stub
    }

    dma_request(): void {
        // TODO: Wire to real DMA controller
    }
}

// ============================================================
// Stub Memory
// ============================================================

class Memory implements MemAccess {
    private ram: Uint8Array;

    constructor(sizeKB: number) {
        this.ram = new Uint8Array(sizeKB * 1024);
    }

    readmeta(address: number): number {
        return 0;
    }

    writemeta(address: number, value: number): void {}

    readbyte(address: number): number {
        if (address < this.ram.length) return this.ram[address];
        return 0xFF;
    }

    writebyte(address: number, value: number): void {
        if (address < this.ram.length) this.ram[address] = value;
    }

    loadBinary(data: Uint8Array, offset: number = 0): void {
        for (let i = 0; i < data.length && (offset + i) < this.ram.length; i++) {
            this.ram[offset + i] = data[i];
        }
    }

    get data(): Uint8Array { return this.ram; }
}

// ============================================================
// Stub Disk Controller
// ============================================================

class StubDiskUnit implements DiskContainer {
    image: DiskImage | null = null;

    set_disk(image: DiskImage | null): void {
        this.image = image;
        console.log(`[Disk] Unit mounted: ${image?.filename || 'ejected'}`);
    }
}

class StubDiskController {
    units: StubDiskUnit[] = [];
    type: 'dsk2' | 'finch';

    constructor(type: 'dsk2' | 'finch', numUnits: number) {
        this.type = type;
        for (let i = 0; i < numUnits; i++) {
            this.units.push(new StubDiskUnit());
        }
    }
}

// ============================================================
// Emulator Core Manager
// ============================================================

export interface CoreEmulatorState {
    cpu: ICCPU;
    memory: Memory;
    diskControllers: StubDiskController[];
    serialDevices: CharDevice[];
    isRunning: boolean;
    runRate: number;
}

export class CoreEmulator {
    cpu: ICCPU;
    memory: Memory;
    diskControllers: StubDiskController[];
    serialDevices: CharDevice[] = [];
    private runInterval: NodeJS.Timeout | null = null;
    private _isRunning = false;
    private _runRate = 50000; // High-speed batch mode (>10000 triggers hsstep)
    private _stepCallback: (() => void) | null = null;
    private _stateCallback: (() => void) | null = null;

    constructor() {
        console.log('[Core] Initializing Centurion CPU-6 Emulator...');

        // Try to load the real MCCPU from the browser emulator
        this.cpu = this.tryLoadRealCPU();

        // Create main memory (64KB for starters)
        this.memory = new Memory(64);

        // Try to use real disk controllers from cen.js
        this.diskControllers = this.tryGetRealDisks();

        // Auto-mount CENTOS_13.IMG on DSK2 unit 1
        this.autoMountDisk();

        console.log('[Core] Emulator initialized.');
    }

    private autoMountDisk(): void {
        // __dirname is server/dist/server/src/core in compiled output,
        // but server/src/core in ts-node. Try multiple paths.
        const candidates = [
            path.resolve(__dirname, '..', '..', '..', '..', 'disks', 'CENTOS_13.IMG'),
            path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG'),
        ];
        let diskPath = candidates.find(p => fs.existsSync(p)) || candidates[0];
        
        if (!fs.existsSync(diskPath)) {
            console.log(`[Core] Disk not found at: ${diskPath}`);
            return;
        }
        try {
            const diskBuffer = fs.readFileSync(diskPath);
            const arrayBuf = diskBuffer.buffer.slice(diskBuffer.byteOffset, diskBuffer.byteOffset + diskBuffer.length);
            // Hawk disk stride depends on image size: 6651904 → 512, 5196800 → 400
            const stride = diskBuffer.length === 6651904 ? 512 : diskBuffer.length === 5196800 ? 400 : 512;
            const diskImage: DiskImage = {
                type: 'hawk', filename: 'CENTOS_13.IMG', stride,
                backing_data: arrayBuf, protect: false, data: new Uint8Array(arrayBuf),
            };

            // Mount on DSK2 unit 1 (Hawk disk)
            const g = global as any;
            const dsk2 = g.window?.io_dsk2;
            if (dsk2?.units?.[1]) {
                dsk2.units[1].image = diskImage;
                // Reflect in the management stub so the disk manager shows it
                const stub = this.diskControllers.find(c => c.type === 'dsk2');
                if (stub && stub.units[1]) stub.units[1].image = diskImage;
                console.log(`[Core] ✓ Auto-mounted CENTOS_13.IMG on DSK2 Unit 1 (stride ${stride})`);
            } else {
                console.log('[Core] DSK2 Unit 1 not available for auto-mount');
            }
        } catch (err: any) {
            console.warn('[Core] Auto-mount failed:', err.message);
        }
    }

    private tryGetRealDisks(): StubDiskController[] {
        try {
            const bridge = require('./cpu-real');
            const devices = bridge.getRealDevices();
            
            const controllers: StubDiskController[] = [];
            
            // Real DSK2 has 2 units
            if (devices.dsk2) {
                const dsk2Ctl = new StubDiskController('dsk2', 2);
                // Patch the units to point to real DSK2 units
                for (let i = 0; i < 2; i++) {
                    if (devices.dsk2.units && devices.dsk2.units[i]) {
                        (dsk2Ctl as any)._realUnit = devices.dsk2.units[i];
                        dsk2Ctl.units[i].set_disk = (img: DiskImage | null) => {
                            // store locally so the disk manager reflects reality
                            dsk2Ctl.units[i].image = img;
                            devices.dsk2.units[i].image = img;
                            console.log(`[Disk] DSK2 Unit ${i} mounted: ${img?.filename || 'ejected'}`);
                        };
                    }
                }
                controllers.push(dsk2Ctl);
                console.log('[Core] ✓ Real DSK2 controller wired');
            } else {
                controllers.push(new StubDiskController('dsk2', 2));
                console.log('[Core] Using stub DSK2');
            }

            // Real Finch has 1 unit
            if (devices.finch) {
                const finchCtl = new StubDiskController('finch', 1);
                if (devices.finch.unit_1) {
                    (finchCtl as any)._realUnit = devices.finch.unit_1;
                    finchCtl.units[0].set_disk = (img: DiskImage | null) => {
                        finchCtl.units[0].image = img;
                        devices.finch.unit_1.set_disk(img);
                        console.log(`[Disk] Finch mounted: ${img?.filename || 'ejected'}`);
                    };
                }
                controllers.push(finchCtl);
                console.log('[Core] ✓ Real Finch controller wired');
            } else {
                controllers.push(new StubDiskController('finch', 1));
                console.log('[Core] Using stub Finch');
            }

            return controllers;
        } catch {
            return [
                new StubDiskController('dsk2', 2),
                new StubDiskController('finch', 1),
            ];
        }
    }

    private tryLoadRealCPU(): ICCPU {
        try {
            // Dynamic require to avoid polyfills being loaded at module parse time
            const bridge = require('./cpu-real');
            loadRealCPU = bridge.loadRealCPU;
            isRealCPULoaded = bridge.isRealCPULoaded;

            const cpu = loadRealCPU!();
            console.log('[Core] ✓ Real MCCPU loaded from cen.js');
            return cpu;
        } catch (err: any) {
            console.warn('[Core] Could not load real MCCPU:', err.message);
            console.warn('[Core] Falling back to StubCPU (emulation will not execute real instructions)');
            console.warn('[Core] To fix: ensure js/cen.js is compiled and accessible');
            return new StubCPU();
        }
    }

    get isRunning(): boolean { return this._isRunning; }

    get runRate(): number { return this._runRate; }
    set runRate(rate: number) { this._runRate = rate; }

    onStep(callback: () => void): void {
        this._stepCallback = callback;
    }

    onStateChange(callback: () => void): void {
        this._stateCallback = callback;
    }

    private tickHardware(): void {
        const g = global as any;
        // Match browser's run_hw_steps(100) — only run_hw devices, NOT run_hshw
        const hwList: any[] = g.window?.__runHW;
        if (hwList) {
            for (const dev of hwList) {
                if (dev && typeof dev.run === 'function') {
                    try { dev.run(100); } catch {}
                }
            }
        } else {
            if (g.window?.io_dsk2?.run) try { g.window.io_dsk2.run(100); } catch {}
            if (g.window?.io_ffc?.run) try { g.window.io_ffc.run(100); } catch {}
        }
    }

    step(dbg: boolean = false): void {
        // pulse run_once so the CPU executes
        const g = global as any;
        if (g.window?.__runOnce !== undefined) g.window.__runOnce = true;
        const hwListStep: any[] = g.window?.__runHW || [];
        for (const hw of hwListStep) { try { hw.run(1); } catch {} }
        this.cpu.step(dbg);
        if (this._stepCallback) this._stepCallback();
        if (this._stateCallback) this._stateCallback();
    }

    start(): void {
        if (this._isRunning) return;
        this._isRunning = true;

        const rate = this._runRate;
        const useHS = rate > 10000;
        const g = global as any;
        // Use the raw MCCPU stored by AMD loader for hsstep (wrapper lacks these)
        const rawCPU: any = g.window?.__preCPU || g.window?.cpu;

        console.log(`[Core] Starting emulation at ${rate}/tick (${useHS ? 'fast batch' : 'regular'})`);

        this.runInterval = setInterval(() => {
            if (!this._isRunning) return;

            // Tick MUX TX first (matching browser: run_core calls mux_hw[i].run_tx() at start)
            const mux = g.window?.io_mux;
            if (mux?.muxports) {
                for (const port of mux.muxports) {
                    if (port?.run_tx) try { port.run_tx(); } catch {}
                }
            }

            if (useHS && rawCPU && rawCPU.hspre) {
                // High-speed batch mode (matching browser run_core exactly)
                const hsr = Math.floor(rate / 100);
                rawCPU.hspre();
                for (let i = 0; i < hsr && this._isRunning; i++) {
                    if (g.window?.__runOnce) g.window.__runOnce = true;
                    // Tick hardware BEFORE hsstep (browser: run_hw_steps(100) before hsstep loop)
                    this.tickHardware();
                    for (let ql = 0; ql < 20; ql++) {
                        rawCPU.hsstep(); rawCPU.hsstep(); rawCPU.hsstep();
                        rawCPU.hsstep(); rawCPU.hsstep();
                    }
                }
                rawCPU.hsend();
            } else {
                // Regular step-by-step (browser: run_hw_steps(1) before each step)
                for (let i = 0; i < rate && this._isRunning; i++) {
                    if (g.window?.__runOnce) g.window.__runOnce = true;
                    this.tickHardware();  // BEFORE step (matching browser)
                    this.cpu.step(false);
                }
            }

            // After run loop: Finch display step (matching browser: main_ffc.step(true))
            const ffc = g.window?.io_ffc || g.window?.main_ffc;
            if (ffc?.step) try { ffc.step(true); } catch {}

            if (this._stateCallback) this._stateCallback();
        }, 20);
    }

    stop(): void {
        this._isRunning = false;
        if (this.runInterval) {
            clearInterval(this.runInterval);
            this.runInterval = null;
        }
        console.log('[Core] Emulation stopped');
    }

    reset(): void {
        this.cpu.reset();
        // Guard RTC from firing during early boot (PC < 0x0600)
        const g = global as any;
        if (g.window) g.window.__rtcGuard = true;
        // Default sense switches: S2(OpSys)=2, S4(R/F)=8 → 10 for CENTOS mode
        if (g.window?.__senseSwitch !== undefined) g.window.__senseSwitch = 10;
        console.log('[Core] Emulator reset');
    }

    /** Call once OS has booted past early init to re-enable RTC */
    releaseRTC(): void {
        const g = global as any;
        if (g.window) g.window.__rtcGuard = false;
    }

    getState(): CoreEmulatorState {
        return {
            cpu: this.cpu,
            memory: this.memory,
            diskControllers: this.diskControllers,
            serialDevices: this.serialDevices,
            isRunning: this._isRunning,
            runRate: this._runRate,
        };
    }

    /** Load a binary file into memory */
    loadBinary(data: Uint8Array, address: number = 0x100): void {
        this.memory.loadBinary(data, address);
        console.log(`[Core] Loaded ${data.length} bytes at 0x${hex(address)}`);
    }

    /** Get all disk units for management */
    getAllDiskUnits(): { container: DiskContainer; image: DiskImage | null; label: string; type: 'dsk2' | 'finch'; unitIndex: number }[] {
        const result: { container: DiskContainer; image: DiskImage | null; label: string; type: 'dsk2' | 'finch'; unitIndex: number }[] = [];
        for (const ctl of this.diskControllers) {
            for (let i = 0; i < ctl.units.length; i++) {
                result.push({
                    container: ctl.units[i],
                    image: ctl.units[i].image,
                    label: `${ctl.type.toUpperCase()} Unit ${i}`,
                    type: ctl.type,
                    unitIndex: i,
                });
            }
        }
        return result;
    }
}
