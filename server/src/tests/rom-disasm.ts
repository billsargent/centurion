// ============================================================
// Boot ROM disassembler — disassembles the 512-byte boot ROM
// (bpl_rom_fc at physical 0x3FC00, mapped to logical 0xFC00) so
// we can see how it decides diag boot vs OS boot.
// ============================================================
import { installPolyfills } from '../core/polyfills';
import { loadAMDModule } from '../core/amd-loader';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
    const startArg = process.argv[2] ? parseInt(process.argv[2], 16) : 0xFC00;
    const countArg = process.argv[3] ? parseInt(process.argv[3], 16) : 0x200;

    installPolyfills();
    const candidates = [
        path.resolve(__dirname, '..', '..', '..', 'js', 'cen.js'),
        path.resolve(__dirname, '..', '..', '..', '..', '..', 'js', 'cen.js'),
    ];
    const cenJsPath = candidates.find(p => fs.existsSync(p)) || candidates[0];
    loadAMDModule(cenJsPath);

    const g = global as any;
    const CPU6class = g.window?.__CPU6class;
    const bpl = g.window?.bpl;
    if (!CPU6class || !bpl) { console.error('[FAIL] no CPU6class/bpl'); process.exit(1); }

    // Identity page table so logical == physical; disassemble the ROM in place.
    const pages = new Uint8Array(256);
    for (let i = 0; i < 256; i++) pages[i] = i;
    const cpu6 = new CPU6class(bpl, pages);

    const base = 0x3FC00; // boot ROM physical
    const start = startArg === 0xFC00 ? base : startArg;
    console.log(`=== Boot ROM disassembly (phys 0x${base.toString(16)}) 0x${start.toString(16)}..0x${(start + countArg).toString(16)} ===`);

    console.log('\nRaw ROM bytes:');
    let hex = '';
    for (let a = base; a < base + 0x200; a++) hex += bpl.readbyte(a).toString(16).padStart(2, '0') + ' ';
    for (let i = 0; i < hex.length; i += 96) console.log('  ' + hex.slice(i, i + 96));

    let a = start;
    const end = start + countArg;
    let lines = 0;
    while (a < end && lines < 2000) {
        const ret: any = {};
        try { cpu6.disassembly(a, ret); } catch (e: any) { console.log(`  ${a.toString(16).padStart(4,'0')}: <err ${e?.message}>`); break; }
        const hb = (ret.hb ?? '').padEnd(20);
        console.log(`  ${a.toString(16).padStart(4, '0')}: ${hb} ${ret.ins} ${ret.par}`);
        const l = ret.l ?? 1;
        a += l > 0 ? l : 1;
        lines++;
    }
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err.message); process.exit(1); });
