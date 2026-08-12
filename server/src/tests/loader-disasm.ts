// ============================================================
// Loader Disassembler
//
// Disassembles the CENTOS boot loader using the emulator's own
// CPU6 disassembler (extracted from cen.js via the AMD loader).
//
// Phase 1 (no boot): disassemble the WIPL and early loader
//   directly from the disk image (mapped to their RAM addresses).
// Phase 2 (boot): disassemble the RELOCATED loader code from
//   RAM at the stall point (requires ~30s boot).
//
// Disk layout: Hawk format, stride 512. DSK2 transfers 400 data
//   bytes/sector, so RAM[base + n*400 + i] = img[(sec+n)*512 + i].
// ============================================================
import { installPolyfills } from '../core/polyfills';
import { loadAMDModule } from '../core/amd-loader';
import * as path from 'path';
import * as fs from 'fs';

const IMG_PATH = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_12.IMG');
const STRIDE = 512;   // Hawk
const DATA = 400;     // bytes transferred per sector by DSK2

// ------------------------------------------------------------------
// Disk-backed MemAccess view: maps a run of sectors onto a RAM base.
// readmeta() returns the byte (data bytes only), 0xFF outside range.
// ------------------------------------------------------------------
function sectorView(img: Buffer, sectorStart: number, sectorCount: number, baseAddr: number) {
    return {
        readmeta(a: number) {
            const rel = a - baseAddr;
            if (rel < 0) return 0xFF;
            const n = Math.floor(rel / DATA);
            const off = rel % DATA;
            if (n >= sectorCount) return 0xFF;
            return img[(sectorStart + n) * STRIDE + off] ?? 0xFF;
        },
        readbyte(a: number) { return this.readmeta(a); },
    };
}

// Identity page table so phys() == logical address
function identityPages() {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    return p;
}

let cpu6class: any;

function disasmRange(cpu6: any, start: number, count: number, label: string) {
    console.log(`\n--- ${label} (0x${start.toString(16)} .. 0x${(start + count).toString(16)}) ---`);
    let a = start;
    const end = start + count;
    let lines = 0;
    while (a < end && lines < 4000) {
        const ret: any = {};
        try {
            cpu6.disassembly(a, ret);
        } catch (e: any) {
            console.log(`  ${a.toString(16).padStart(4, '0')}: <disasm error ${e?.message ?? e}>`);
            break;
        }
        const hb = (ret.hb ?? '').padEnd(20);
        console.log(`  ${a.toString(16).padStart(4, '0')}: ${hb} ${ret.ins} ${ret.par}`);
        const l = ret.l ?? 1;
        a += l > 0 ? l : 1;
        lines++;
    }
}

function hexdump(buf: Buffer, label: string, cols = 16) {
    console.log(`\n--- ${label} ---`);
    for (let i = 0; i < buf.length; i += cols) {
        const chunk = buf.subarray(i, i + cols);
        const hex = Array.from(chunk).map(b => b.toString(16).padStart(2, '0')).join(' ');
        const asc = Array.from(chunk).map(b => (b >= 0x20 && b < 0x7f) ? String.fromCharCode(b) : '.').join('');
        console.log(`  ${i.toString(16).padStart(4, '0')}: ${hex.padEnd(cols * 3)}  ${asc}`);
    }
}

async function main() {
    const args = process.argv.slice(2);
    const doBoot = args.includes('--boot');
    const sectorRange = args.filter(a => /^0x/.test(a)).map(a => parseInt(a, 16));

    console.log('=== Loader Disassembler ===');
    installPolyfills();

    // Locate cen.js like cpu-real.ts
    const candidates = [
        path.resolve(__dirname, '..', '..', '..', 'js', 'cen.js'),
        path.resolve(__dirname, '..', '..', '..', '..', '..', 'js', 'cen.js'),
    ];
    const cenJsPath = candidates.find(p => fs.existsSync(p)) || candidates[0];
    console.log(`Loading cen.js from: ${cenJsPath}`);
    loadAMDModule(cenJsPath);

    const g = global as any;
    cpu6class = g.window?.__CPU6class;
    if (!cpu6class) {
        console.error('[FAIL] window.__CPU6class not exposed — did amd-loader patch apply?');
        process.exit(1);
    }
    console.log('[OK] CPU6 class extracted');

    const img = fs.readFileSync(IMG_PATH);
    console.log(`[OK] Disk: ${IMG_PATH} (${img.length} bytes, stride ${STRIDE})`);

    // ------------------------------------------------------------------
    // Phase 1: WIPL — sectors 0x00-0x0D loaded at RAM 0x0100
    // ------------------------------------------------------------------
    const wipl = sectorView(img, 0x00, 0x0E, 0x0100);
    const cpu6 = new cpu6class(wipl, identityPages());
    disasmRange(cpu6, 0x0100, 0x15E0, 'WIPL (sectors 0x00-0x0D @ 0x0100)');

    // ------------------------------------------------------------------
    // Early loader sectors: 0x0E, 0x10, 0x30 (hexdump for now)
    // ------------------------------------------------------------------
    for (const sec of [0x0E, 0x10, 0x30]) {
        const start = sec * STRIDE;
        hexdump(img.subarray(start, start + 400), `Sector 0x${sec.toString(16)} (raw)`);
    }

    // ------------------------------------------------------------------
    // Sector 0x30's relocation table — dump a few entries as words
    // ------------------------------------------------------------------
    console.log('\n--- Sector 0x30: first 64 words (relocation table?) ---');
    const s30 = img.subarray(0x30 * STRIDE, 0x30 * STRIDE + 400);
    for (let i = 0; i < 128; i += 2) {
        const w = s30[i] | (s30[i + 1] << 8);
        console.log(`  +${i.toString(16).padStart(3, '0')}: ${w.toString(16).padStart(4, '0')}  [${s30[i].toString(16)} ${s30[i + 1].toString(16)}]`);
    }

    if (doBoot) {
        console.log('\n[Phase 2] --boot requested, but boot disassembly lives in boot-disasm.ts');
    }

    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
