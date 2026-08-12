// Browser memory dump at the "LOS" boot point, to compare the loader's
// memory layout against the in-process CoreEmulator (which stalls at 0xA07F).
import { createBrowserBridge } from '../core/browser-bridge';
import * as path from 'path';

async function main() {
    console.log('=== Browser RAM dump at LOS point ===\n');
    const bridge = await createBrowserBridge();
    await bridge.start();

    const diskPath = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');
    await bridge.boot(diskPath);

    // Send H1 and wait for the LOS sign-on (loader is executing)
    await bridge.waitForOutput('D=', 15000);

    // Install the DMA hook BEFORE sending H1 so we catch the loader's sector reads
    const page = bridge._page;
    await page.evaluate(`
        (() => {
            if (window.__dmaHooked) return;
            window.__dmaHooked = true;
            window.__dmaLog = [];
            const dsk2 = window.io_dsk2;
            const sim = window.sim;
            const orig = dsk2.dma_step.bind(dsk2);
            dsk2.dma_step = function (ctrl) {
                const prevBase = this.sect_base;
                const r = orig(ctrl);
                if (prevBase !== this.sect_base) {
                    // new sector started this call; physaddr advanced ~1 byte
                    window.__dmaLog.push({ s: this.sel_address, pa: sim.physaddr, ma: sim.memaddr });
                }
                return r;
            };
        })()
    `);
    console.log('[OK] DMA hook installed');

    await bridge.sendText('H1');
    console.log('[OK] H1 sent — waiting for LOS...');
    if (!(await bridge.waitForOutput('LOS', 30000))) {
        console.log('[FAIL] LOS not reached. Output so far:');
        console.log(bridge.output());
        await bridge.stop();
        process.exit(1);
    }
    console.log('[OK] LOS reached — dumping memory');

    // Wait until LOS and the DMA log has grown past sector 0x470, then dump
    const dump = await page.evaluate(`
        (async () => {
            const bpl = window.bpl;
            const read = (a) => bpl.readbyte(a);
            const hex = (start, len) => {
                let s = '';
                for (let a = start; a < start + len; a++) s += read(a).toString(16).padStart(2, '0') + ' ';
                return s;
            };
            // wait for DMA log to reach >= 0x0470 with some entries
            let t0 = Date.now();
            while (Date.now() - t0 < 25000) {
                const log = window.__dmaLog || [];
                if (log.some(e => e.s >= 0x0470)) break;
                await new Promise(r => setTimeout(r, 200));
            }
            const needle = [0xCC,0xCF,0xD3,0xA0,0xB7,0xAE,0xB1,0xA0,0xAD,0xA0,0xC5];
            let hits = [];
            for (let a = 0; a <= 0x3EFFF - needle.length; a++) {
                let m = true;
                for (let i = 0; i < needle.length; i++) { if (read(a+i) !== needle[i]) { m = false; break; } }
                if (m) hits.push('0x' + a.toString(16));
            }
            return JSON.stringify({
                losHits: hits,
                a07f: hex(0xA07F, 8),
                a060: hex(0xA060, 0x40),
                e000: hex(0xE000, 0x40),
                e1e0: hex(0xE1E0, 0x40),
                f000: hex(0x7FD0, 0x30),
                dma: (window.__dmaLog || []).slice(0, 250),
            });
        })()
    `);
    const d = JSON.parse(dump);
    console.log(`LOS string at: ${d.losHits.length ? d.losHits.join(', ') : 'NOWHERE'}`);
    console.log(`0xA07F: ${d.a07f.trim()}`);
    console.log(`0xA060: ${d.a060.trim()}`);
    console.log(`0xE000: ${d.e000.trim()}`);
    console.log(`0xE1E0: ${d.e1e0.trim()}`);
    console.log(`0x7FD0: ${d.f000.trim()}`);
    console.log('\nFirst 20 DMA destinations:');
    for (const e of d.dma.slice(0, 20)) {
        console.log(`  sec 0x${e.s.toString(16)} -> phys 0x${e.pa.toString(16).padStart(4, '0')} (mem 0x${e.ma.toString(16).padStart(4, '0')})`);
    }
    console.log('\nDMA destinations 0x460-0x4CC (sample):');
    const hi = d.dma.filter((e: any) => e.s >= 0x460 && e.s <= 0x4cc);
    for (const e of hi.slice(0, 30)) {
        console.log(`  sec 0x${e.s.toString(16)} -> phys 0x${e.pa.toString(16).padStart(4, '0')} (mem 0x${e.ma.toString(16).padStart(4, '0')})`);
    }

    await bridge.stop();
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
