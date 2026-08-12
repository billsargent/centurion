// Verify the audio polyfill fix:
//  1. BiquadFilterNode / GainNode / OscillatorNode are defined (no throw).
//  2. document.getElementById('ck_sound').checked === false (BEL path stays quiet).
//  3. Simulate the VT100 BEL path via the emulated terminal if reachable.
import { installPolyfills } from '../core/polyfills';
import { loadAMDModule } from '../core/amd-loader';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
    console.log('=== Audio polyfill verification ===\n');
    installPolyfills();
    const g = global as any;
    const candidates = [
        path.resolve(__dirname, '..', '..', '..', 'js', 'cen.js'),
        path.resolve(__dirname, '..', '..', '..', '..', '..', 'js', 'cen.js'),
    ];
    const cenJsPath = candidates.find(p => fs.existsSync(p)) || candidates[0];
    loadAMDModule(cenJsPath);

    // 1. Web Audio node classes defined?
    for (const k of ['BiquadFilterNode', 'GainNode', 'OscillatorNode', 'AudioContext', 'AudioParam']) {
        console.log(`${g[k] !== undefined ? '[OK]' : '[MISSING]'} ${k} is defined`);
    }
    // 2. Constructing them must not throw
    try {
        const ctx = new g.AudioContext();
        const filter = new g.BiquadFilterNode(ctx, { type: 'bandpass' });
        const gain = new g.GainNode(ctx, { gain: 0 });
        const osc = new g.OscillatorNode(ctx, { frequency: 3200 });
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.connect(filter);
        osc.start();
        console.log('[OK] wa_setup() equivalent completes without throwing');
    } catch (e: any) {
        console.log(`[FAIL] audio construction threw: ${e.message}`);
    }

    // 3. ck_sound checkbox reads false (BEL path won't call wa_setup)
    const ck = g.document.getElementById('ck_sound');
    console.log(`[${ck?.checked === false ? 'OK' : 'FAIL'}] document.getElementById('ck_sound').checked === ${ck?.checked}`);

    // 4. diagins still false
    const diag = g.document.getElementById('diagins');
    console.log(`[${diag?.checked === false ? 'OK' : 'FAIL'}] document.getElementById('diagins').checked === ${diag?.checked}`);

    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err.message); process.exit(1); });
