// Browser test v4 — uses the new reusable BrowserBridge
// Boots CENTOS fully and walks through the interactive prompts.
import { createBrowserBridge } from '../core/browser-bridge';
import * as path from 'path';

async function main() {
    console.log('=== Browser Bridge Test v4 ===\n');
    const bridge = await createBrowserBridge();

    // Log raw output bytes as they arrive
    bridge.onOutput((code: number) => {
        if (code >= 32 && code < 127) process.stdout.write(String.fromCharCode(code));
        else if (code === 13 || code === 10) process.stdout.write('\n');
        else process.stdout.write(`<${code.toString(16)}>`);
    });

    await bridge.start();

    const diskPath = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');
    await bridge.boot(diskPath);

    // Verify mount state
    const state = await bridge._page.evaluate(`
        (() => {
            const u1 = window.io_dsk2 && window.io_dsk2.units && window.io_dsk2.units[1];
            if (!u1) return 'NO DSK2 unit 1';
            if (!u1.image) return 'unit1.image = null';
            return 'unit1.image: type=' + u1.image.type + ' stride=' + u1.image.stride + ' len=' + (u1.image.data ? u1.image.data.length : '?');
        })()
    `);
    console.log('[Verify]', state);

    // Wait for D= prompt then send H1
    if (!(await bridge.waitForOutput('D=', 15000))) {
        console.log('\n[FAIL] No D= prompt');
        await bridge.stop();
        process.exit(1);
    }
    console.log('\n[OK] D= prompt seen — sending H1');
    await bridge.sendText('H1');

    // Wait for MAX DISK prompt
    if (!(await bridge.waitForOutput('SYSTEM DISK', 30000))) {
        console.log('\n[FAIL] No MAX DISK prompt. Output so far:');
        console.log(bridge.output());
        await bridge.stop();
        process.exit(1);
    }
    console.log('\n[OK] MAX DISK prompt seen — sending Enter');
    await bridge.sendText('\r');

    // Wait for date prompt (format MMDDYY)
    if (!(await bridge.waitForOutput('MMDDYY', 15000))) {
        console.log('\n[FAIL] No date prompt. Output so far:');
        console.log(bridge.output());
        await bridge.stop();
        process.exit(1);
    }
    console.log('\n[OK] Date prompt seen — sending date 081226');
    await bridge.sendText('081226');
    await new Promise(r => setTimeout(r, 1500));
    await bridge.sendText('\r');

    // Wait for time prompt (format HHMMSS)
    if (!(await bridge.waitForOutput('HHMMSS', 15000))) {
        console.log('\n[FAIL] No time prompt. Output so far:');
        console.log(bridge.output());
        await bridge.stop();
        process.exit(1);
    }
    console.log('\n[OK] Time prompt seen — sending time 120000');
    await bridge.sendText('120000');
    await new Promise(r => setTimeout(r, 1500));
    await bridge.sendText('\r');

    // Wait for CRT0 READY (fully booted)
    if (!(await bridge.waitForOutput('CRT0 READY', 30000))) {
        console.log('\n[FAIL] No CRT0 READY. Output so far:');
        console.log(bridge.output());
        await bridge.stop();
        process.exit(1);
    }
    console.log('\n[OK] *** CRT0 READY — CENTOS fully booted! ***');
    console.log('\n--- Final output ---');
    console.log(bridge.output());

    await bridge.stop();
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
