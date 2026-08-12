// Headless browser test v3 — uses ACTUAL browser buttons (b_run, fp_rf, fp_load)
import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
    console.log('=== Headless Browser Test v3 ===\n');
    
    const b = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--use-gl=swiftshader', '--allow-file-access-from-files'],
    });
    const p = await b.newPage();
    
    // Log browser console
    p.on('console', (msg: any) => console.log('  [B]', msg.text().substring(0, 200)));
    p.on('pageerror', (err: any) => console.log('  [ERR]', err.message.substring(0, 200)));
    
    const hp = path.resolve(__dirname, '..', '..', '..', 'cen.html');
    console.log(`Loading: ${hp}`);
    await p.goto('file://' + hp, { waitUntil: 'load', timeout: 30000 });
    
    // Read disk image
    const diskPath = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');
    const b64 = fs.readFileSync(diskPath).toString('base64');
    
    // Expose output callback
    let allOutput = '';
    await p.exposeFunction('__telnetOut', (txt: string) => {
        allOutput += txt;
        process.stdout.write(txt);
    });
    
    // Hook MUX, mount disk, click actual buttons
    await p.evaluate(`
        const diskB64 = "${b64}";
        let attempts = 0;
        const hook = setInterval(() => {
            attempts++;
            const mp = window.io_mux && window.io_mux.muxports && window.io_mux.muxports[0];
            if (!mp || !mp.write_data) {
                if (attempts > 40) { clearInterval(hook); console.log('Timeout'); }
                return;
            }
            clearInterval(hook);
            
            // Hook MUX write_data to capture output
            const origWD = mp.write_data.bind(mp);
            mp.write_data = function(v) {
                const ch = v & 0x7F;
                window.__telnetOut(ch >= 32 && ch < 127 ? String.fromCharCode(ch) : '<' + ch.toString(16) + '>');
                return origWD(v);
            };
            
            // Enable DSK2 transfer logging
            if (window.io_dsk2) {
                window.io_dsk2.stat_log_transfers = true;
                console.log('DSK2 logging enabled');
            }
            
            // Hook DSK2 command writes to log commands
            const origDskWrite = window.io_dsk2.writebyte.bind(window.io_dsk2);
            window.io_dsk2.writebyte = function(addr, val) {
                if (addr === 8) {
                    const names = ['READ','WRITE','SEEK','SEEKTZ','VERIFY','FORMAT','FPREMIT'];
                    console.log('DSK2 CMD ' + (names[val & 7] || val) + ' unit=' + window.io_dsk2.sel_unit);
                }
                return origDskWrite(addr, val);
            };
            
            // Mount disk on DSK2 unit 1
            const binary = atob(diskB64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            window.io_dsk2.units[1].image = {
                type: 'hawk', filename: 'CENTOS_13.IMG', stride: 512,
                backing_data: bytes.buffer, protect: false, data: new Uint8Array(bytes.buffer),
            };
            console.log('Disk mounted');
            
            // Click R/F button (fp_r → sense_switch ^= 8)
            const rfBtn = document.getElementById('fp_r');
            if (rfBtn) { rfBtn.click(); console.log('Clicked R/F'); }
            else { console.log('fp_r button missing'); }
            
            // Click OPSYS button (fp_load → sense_switch |= 2)
            const loadBtn = document.getElementById('fp_l');
            if (loadBtn) { loadBtn.click(); console.log('Clicked OPSYS'); }
            else { console.log('fp_l button missing'); }
            
            // Set speed to 100k (b_r7 = 100000)
            const rateBtn = document.getElementById('b_r7');
            if (rateBtn) { rateBtn.click(); console.log('Set 100k'); }
            
            // Click the ACTUAL Run/Stop button (b_run)
            const runBtn = document.getElementById('b_run');
            if (runBtn) { runBtn.click(); console.log('Clicked Run/Stop'); }
            else { console.log('b_run button missing'); }
        }, 500);
    `);
    
    console.log('Waiting for D= prompt...');
    await new Promise(r => setTimeout(r, 5000));
    
    // Send H1 one char at a time (H and 1 only — CR may not be needed)
    const inputChars = [72, 49]; // H, 1 — try without CR first
    for (const ch of inputChars) {
        await p.evaluate(`
            new Promise((resolve) => {
                const check = () => {
                    const mp = window.io_mux && window.io_mux.muxports && window.io_mux.muxports[0];
                    if (mp && !mp.read_busy) resolve(true);
                    else setTimeout(check, 100);
                };
                check();
            });
        `);
        await p.evaluate(`window.io_mux.muxports[0].receive(${ch});`);
        console.log('  sent char', ch);
        await new Promise(r => setTimeout(r, 300));
    }
    console.log('Sent H1');
    
    console.log('Waiting for CENTOS to boot...');
    await new Promise(r => setTimeout(r, 25000));
    
    console.log('\n\n=== Output captured ===');
    console.log(allOutput.substring(0, 2000));
    
    await b.close();
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
