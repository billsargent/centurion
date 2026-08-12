// Headless browser test v2 — mounts disk, hooks MUX, types H1
import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
    console.log('=== Headless Browser Test v2 ===\n');
    
    const b = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--use-gl=swiftshader', '--allow-file-access-from-files'],
    });
    const p = await b.newPage();
    
    // Log browser console
    p.on('console', (msg: any) => console.log('  [BROWSER]', msg.text().substring(0, 200)));
    
    const hp = path.resolve(__dirname, '..', '..', '..', 'cen.html');
    console.log(`Loading: ${hp}`);
    await p.goto('file://' + hp, { waitUntil: 'load', timeout: 30000 });
    
    // Set sense switches
    await p.evaluate('window.__senseSwitch = 12');
    
    // Read and mount disk
    const diskPath = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');
    const b64 = fs.readFileSync(diskPath).toString('base64');
    
    // Expose output callback
    let allOutput = '';
    await p.exposeFunction('__telnetOut', (txt: string) => {
        allOutput += txt;
        process.stdout.write(txt);
    });
    
    // Hook MUX, mount disk, click Run — all in one evaluate (string form)
    await p.evaluate(`
        window.__senseSwitch = 12;
        const diskB64 = "${b64}";
        let attempts = 0;
        const hook = setInterval(() => {
            attempts++;
            if (!window.io_mux || !window.io_mux.muxports || !window.io_dsk2) {
                if (attempts > 20) { clearInterval(hook); console.log('Timeout waiting for io_mux'); }
                return;
            }
            const mp = window.io_mux.muxports[0];
            if (!mp || !mp.line) {
                if (attempts > 20) { clearInterval(hook); console.log('Timeout waiting for MUX line'); }
                return;
            }
            clearInterval(hook);
            console.log('Hook installed on write_data');
            
            // Hook MUX write_data (more direct than line.receive)
            const origWD = mp.write_data.bind(mp);
            mp.write_data = function(v) {
                const ch = v & 0x7F;
                window.__telnetOut(ch >= 32 && ch < 127 ? String.fromCharCode(ch) : '<' + ch.toString(16) + '>');
                return origWD(v);
            };
            
            // Mount disk on DSK2 unit 1
            const binary = atob(diskB64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            window.io_dsk2.units[1].image = {
                type: 'hawk', filename: 'CENTOS_13.IMG', stride: 400,
                backing_data: bytes.buffer, protect: false, data: new Uint8Array(bytes.buffer),
            };
            console.log('Disk mounted');
            
            // Click Run button
            const btn = document.getElementById('vc_run');
            if (btn) { btn.click(); console.log('Clicked Run'); }
            else { console.log('vc_run button not found!'); }
        }, 500);
    `);
    
    console.log('Waiting for D= prompt and sending input directly to MUX...');
    // Wait a few seconds for ROM to boot, then send H1 directly to MUX port
    await new Promise(r => setTimeout(r, 4000));
    
    // Send keypresses directly to MUX port 0
    await p.evaluate(`
        const mp = window.io_mux && window.io_mux.muxports && window.io_mux.muxports[0];
        if (mp) {
            console.log('Sending H to MUX, read_busy=' + mp.read_busy);
            mp.receive(72);  // H
            mp.receive(49);  // 1
            mp.receive(13);  // CR
            console.log('Sent H1\\r to MUX');
        } else {
            console.log('MUX port not available!');
        }
    `);
    
    console.log('Waiting for CENTOS to boot...');
    await new Promise(r => setTimeout(r, 20000));
    
    console.log('\n\n=== Output captured ===');
    console.log(allOutput.substring(0, 1000));
    
    await b.close();
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
