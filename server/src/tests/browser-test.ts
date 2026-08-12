// Quick test of the headless browser approach
import { createBrowserBridge } from '../core/browser-bridge';
import * as path from 'path';

async function main() {
    console.log('=== Headless Browser Test ===\n');
    
    const bridge = await createBrowserBridge();
    
    // Capture output
    let output = '';
    bridge.onOutput((code: number) => {
        const ch = String.fromCharCode(code & 0x7F);
        output += ch;
        process.stdout.write(ch);
    });
    
    // Start browser
    await bridge.start();
    
    // Capture console messages from the browser
    const ppage = (bridge as any)._page;
    if (ppage) {
        ppage.on('console', (msg: any) => console.log('[Browser Console]', msg.type(), msg.text()));
        ppage.on('pageerror', (err: any) => console.log('[Browser Error]', err.message));
    }
    
    // Mount disk
    const diskPath = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');
    await bridge.mountDisk(diskPath);
    
    // Set sense switches: S2(OpSys=2) + S4(R/F=8) = 10
    await bridge.setSenseSwitches(10);
    
    // Click Run
    await bridge.clickRun();
    
    // Wait for D= prompt
    await new Promise(r => setTimeout(r, 3000));
    
    // Type H1 (no CR needed per the ROM)
    console.log('\n>>> Typing H1...');
    await bridge.sendText('H1');
    
    // Wait for output
    await new Promise(r => setTimeout(r, 15000));
    
    console.log('\n\n=== Output captured ===');
    console.log(output.substring(0, 500));
    
    await bridge.stop();
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
