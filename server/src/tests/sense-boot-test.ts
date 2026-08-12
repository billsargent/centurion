// Confirm the boot ROM's first instruction: BS1 → diag (jump 0x8001) vs OS boot.
// Runs the in-process core with a given sense value and reports where the CPU ends up.
import { CoreEmulator } from '../core/emulator';

async function run(sense: number, seconds: number): Promise<string> {
    const emulator = new CoreEmulator();
    emulator.reset();
    const g = global as any;
    if (g.window?.__senseSwitch !== undefined) g.window.__senseSwitch = sense;
    const raw = g.window?.__preCPU || g.window?.cpu;

    const mux = g.window?.io_mux;
    let muxBytes: number[] = [];
    if (mux?.muxports?.[0]) {
        const p0 = mux.muxports[0];
        const orig = p0.write_data.bind(p0);
        p0.write_data = (v: number) => { muxBytes.push(v & 0x7F); return orig(v); };
    }

    emulator.start();
    const t0 = Date.now();
    let lastPC = 0;
    let minPC = 0xFFFF, maxPC = 0;
    while (Date.now() - t0 < seconds * 1000) {
        await new Promise(r => setTimeout(r, 200));
        const pc = raw?.pc ?? 0;
        lastPC = pc;
        if (pc < minPC) minPC = pc;
        if (pc > maxPC) maxPC = pc;
    }
    emulator.stop();

    const txt = (b: number) => (b >= 32 && b < 127) ? String.fromCharCode(b) : `<${b.toString(16)}>`;
    const out = muxBytes.map(txt).join('');
    return `sense=${sense}: lastPC=0x${lastPC.toString(16)}  min=0x${minPC.toString(16)}  max=0x${maxPC.toString(16)}  mux="${out.slice(0, 80)}"`;
}

async function main() {
    console.log('=== Sense boot selector test (BS1 at 0xFC00 → diag 0x8001) ===\n');
    console.log('S1 OFF (sense=10, OS):');
    console.log('  ' + await run(10, 12));
    console.log('\nS1 ON  (sense=1, diag?):');
    console.log('  ' + await run(1, 8));
    console.log('\nS1+S2+S4 (sense=11):');
    console.log('  ' + await run(11, 8));
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err.message); process.exit(1); });
