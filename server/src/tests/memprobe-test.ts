// ============================================================
// Memory-probe test
//
// The WIPL's memory-size probe (0x016F-0x0183) determines the
// "top of memory" X, from which it derives the loader's DMA
// scratch base ([0x04A0] = X - 0x2AB, [0x04A2] = X - 0x43B).
// Browser: X = 0xF000 → base 0xED55 (DMA dest 0xED56 ✓).
// Core: DMA dest 0x7D56 implies X ≈ 0x8000 — the probe thinks
// RAM ends at 0x8000. This test reproduces the probe directly
// on the core's backplane to find where it diverges.
// ============================================================
import { CoreEmulator } from '../core/emulator';

function probe(bpl: any, x: number): { rb: number, orig: number } {
    const orig = bpl.readbyte(x) & 0xFF;
    bpl.writebyte(x, 0xFF);
    const rb = bpl.readbyte(x) & 0xFF;
    bpl.writebyte(x, orig);
    return { rb, orig };
}

async function main() {
    console.log('=== Memory-probe test (reproduces WIPL 0x016F-0x0183) ===\n');
    const emulator = new CoreEmulator();
    emulator.reset();

    const g = global as any;
    const bpl = g.window?.bpl;
    if (!bpl) { console.error('[FAIL] no bpl'); process.exit(1); }

    // Replicate the WIPL probe exactly:
    //   X starts 0x1000, Y = 0x1000
    //   loop: AL=[X]; BL=0xFF; [X]=BL; BL=[X]; if BL==0 exit(X)
    //         [X]=AL; X+=Y; if (X-0xF000)!=0 loop
    let X = 0x1000;
    const Y = 0x1000;
    const seen: { x: number, rb: number, orig: number }[] = [];
    while (true) {
        const { rb, orig } = probe(bpl, X);
        seen.push({ x: X, rb, orig });
        if (rb === 0) { console.log(`  probe STOPPED at X=0x${X.toString(16)} (wrote FF, read back ${rb})`); break; }
        X = (X + Y) & 0xFFFF;
        if (((X - 0xF000) & 0xFFFF) === 0) { console.log(`  probe reached X=0x${X.toString(16)} (top)`); break; }
    }

    console.log('\n  Probe summary (first 20):');
    for (const s of seen.slice(0, 20)) {
        console.log(`    0x${s.x.toString(16).padStart(4, '0')}: wrote FF -> read 0x${s.rb.toString(2).padStart(8, '0')}b (orig 0x${s.orig.toString(16)})`);
    }

    // What base does X imply?
    const top = X;
    const a04a0 = (top - 0x2AB) & 0xFFFF;
    const a04a2 = (top - 0x43B) & 0xFFFF;
    console.log(`\n  Implied: X=0x${top.toString(16)} [0x04A0]=0x${a04a0.toString(16)} [0x04A2]=0x${a04a2.toString(16)}`);

    // Also probe through the CPU's memory interface if available
    const mcsim = g.window?.__preCPU || g.window?.cpu;
    if (mcsim?.writebyte) {
        console.log('\n  CPU-interface probe at 0x8000:');
        const orig = mcsim.readbyte(0x8000);
        mcsim.writebyte(0x8000, 0xFF);
        const rb = mcsim.readbyte(0x8000);
        mcsim.writebyte(0x8000, orig);
        console.log(`    wrote FF -> read 0x${rb.toString(16)} (orig 0x${orig.toString(16)})`);
    }

    emulator.stop();
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
