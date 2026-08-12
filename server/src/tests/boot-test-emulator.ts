// Boot test using the REAL CoreEmulator (the actual server core, not the
// debug harness). This validates whether the in-process Node.js core boots
// CENTOS now that stride=512, sense=10, and the DMA hack are fixed.
import { CoreEmulator } from '../core/emulator';

function termStr(bytes: number[]): string {
    return bytes.map(b => b & 0x7F).map(c =>
        c >= 32 && c < 127 ? String.fromCharCode(c) : `<${c.toString(16)}>`
    ).join('');
}

function waitReadBusy(port: any): Promise<void> {
    return new Promise(resolve => {
        const chk = () => { if (!port.read_busy) resolve(); else setTimeout(chk, 25); };
        chk();
    });
}

async function main() {
    console.log('=== CoreEmulator Boot Test ===\n');
    const emulator = new CoreEmulator();
    emulator.reset();

    const g = global as any;
    const mux = g.window?.io_mux;
    if (!mux?.muxports?.[0]) { console.error('[FAIL] No MUX port 0'); process.exit(1); }

    const port0 = mux.muxports[0];
    const muxOutput: number[] = [];
    let sawEquals = false;

    // Capture MUX output by hooking write_data directly (proven approach —
    // the browser test uses this and captures all bytes regardless of baud timing).
    const origWD = port0.write_data.bind(port0);
    port0.write_data = (v: number) => {
        muxOutput.push(v & 0x7F);
        if ((v & 0x7F) === 0x3D) sawEquals = true;
        return origWD(v);
    };

    emulator.start();
    console.log('[OK] Emulator started (CoreEmulator loop)');

    // Diagnostic: record DMA destination (CPU memaddr/physaddr) per sector from
    // the very start (to catch the ROM's WIPL read + early sector reads).
    const dsk2 = g.window?.io_dsk2;
    const rawCPU = g.window?.__preCPU || g.window?.cpu;
    const bpl = g.window?.bpl;
    const origDma = dsk2.dma_step.bind(dsk2);
    let dmaLog: { s: number, pa: number, ma: number }[] = [];
    dsk2.dma_step = (ctrl: any) => {
        const prevBase = dsk2.sect_base;
        const r = origDma(ctrl);
        if (prevBase !== dsk2.sect_base) {
            dmaLog.push({ s: dsk2.sel_address, pa: rawCPU?.physaddr ?? 0, ma: rawCPU?.memaddr ?? 0 });
        }
        return r;
    };

    // Wait for D= prompt
    const t0 = Date.now();
    while (!sawEquals && Date.now() - t0 < 20000) {
        await new Promise(r => setTimeout(r, 200));
    }
    if (!sawEquals) { console.error('[FAIL] No D= prompt'); emulator.stop(); process.exit(1); }
    console.log('[OK] D= prompt seen — sending H1');

    for (const ch of 'H1') {
        await waitReadBusy(port0);
        port0.receive(ch.charCodeAt(0));
        await new Promise(r => setTimeout(r, 150));
    }
    console.log('[OK] H1 sent — waiting for CENTOS to load...');

    const diag = setInterval(() => {
        console.log(`  [diag] PC=0x${(rawCPU?.pc ?? 0).toString(16).padStart(4, '0')} lvl=${rawCPU?.level} dsk2.busy=${dsk2?.busy} cmd=${dsk2?.command} sel=0x${(dsk2?.sel_address ?? 0).toString(16).padStart(4, '0')} muxBytes=${muxOutput.length}`);
    }, 3000);

    await new Promise(r => setTimeout(r, 30000));
    clearInterval(diag);

    console.log('\n=== First 25 DMA destinations ===');
    for (const e of dmaLog.slice(0, 25)) {
        console.log(`  sec 0x${e.s.toString(16)} -> phys 0x${e.pa.toString(16).padStart(4, '0')} mem 0x${e.ma.toString(16).padStart(4, '0')}`);
    }
    console.log('\n=== DMA destinations 0x470-0x4CC ===');
    for (const e of dmaLog.filter(e => e.s >= 0x470 && e.s <= 0x4cc)) {
        console.log(`  sec 0x${e.s.toString(16)} -> phys 0x${e.pa.toString(16).padStart(4, '0')} mem 0x${e.ma.toString(16).padStart(4, '0')}`);
    }

    // Dump state at stall point
    console.log('\n=== Stall-point state ===');
    console.log(`CPU: pc=0x${(rawCPU?.pc ?? 0).toString(16)} lvl=${rawCPU?.level} physaddr=0x${(rawCPU?.physaddr ?? 0).toString(16)} memaddr=0x${(rawCPU?.memaddr ?? 0).toString(16)} workaddr=0x${(rawCPU?.workaddr ?? 0).toString(16)}`);
    console.log(`CPU: pgaddr7=0x${(rawCPU?.pgaddr7 ?? 0).toString(16)} pta=0x${(rawCPU?.pta ?? 0).toString(16)} map=${rawCPU?.map}`);
    if (rawCPU?.pgram) {
        let pg = '';
        for (let i = 0; i < 32; i++) pg += (rawCPU.pgram[i] ?? 0).toString(16).padStart(2, '0') + ' ';
        console.log('pgram[0..31]: ' + pg.trim());
    }
    try {
        console.log(`DSK2 reg4(stat hi)=0x${dsk2.readbyte(4).toString(16)} reg5(stat lo)=0x${dsk2.readbyte(5).toString(16)}`);
    } catch (e: any) { console.log('DSK2 read err', e.message); }
    if (bpl) {
        const dump = (label: string, start: number, len: number) => {
            console.log(`Memory ${label} 0x${start.toString(16)}-0x${(start + len).toString(16)}:`);
            let hex = '';
            for (let a = start; a < start + len; a++) hex += bpl.readbyte(a).toString(16).padStart(2, '0') + ' ';
            console.log('  ' + hex);
        };
        dump('A060', 0xA060, 0x60);
        dump('7FD0 (loader SEEK/READ)', 0x7FD0, 0x30);
        dump('E1E0 (LOS string)', 0xE1E0, 0x40);
        dump('E000 (print-LOS code?)', 0xE000, 0x40);

        // Scan all RAM for the bit7-encoded "LOS 7.1 - E" string (sector 0x4C7)
        const losNeedle = [0xCC, 0xCF, 0xD3, 0xA0, 0xB7, 0xAE, 0xB1, 0xA0, 0xAD, 0xA0, 0xC5];
        let losHits: number[] = [];
        for (let a = 0; a <= 0x3EFFF - losNeedle.length; a++) {
            let m = true;
            for (let i = 0; i < losNeedle.length; i++) {
                if (bpl.readbyte(a + i) !== losNeedle[i]) { m = false; break; }
            }
            if (m) losHits.push(a);
        }
        console.log(`'LOS 7.1 - E' (bit7) found at RAM: ${losHits.length ? losHits.map(x => '0x' + x.toString(16)).join(', ') : 'NOWHERE'}`);
    }

    console.log('\n=== MUX output ===');
    const text = termStr(muxOutput);
    console.log(text);

    if (text.includes('MAX DISK') || text.includes('WELCOME')) {
        console.log('\n[PASS] CENTOS booted (WELCOME/MAX DISK seen)');
    } else {
        console.log('\n[FAIL] No boot output — still stuck');
    }

    emulator.stop();
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
