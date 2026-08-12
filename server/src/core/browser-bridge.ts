// ============================================================
// Headless Browser Bridge
//
// Launches the actual cen.html in headless Chromium, boots
// CENTOS, and provides bidirectional MUX terminal access for
// the Telnet layer. This is the PROVEN emulation engine path.
//
// Verified boot sequence (see ../docs/BOOTING-CENTOS.md):
//   mount disk (stride 512) → sense S2(OpSys)=2 + S4(R/F)=8 → 10
//   → 100k speed → RUN → send 'H','1'
// ============================================================

import puppeteer, { Browser, Page } from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

export interface BrowserBridge {
    /** Launch Chromium and load cen.html */
    start(): Promise<void>;
    /** Close the browser */
    stop(): Promise<void>;
    /** Mount a disk image on DSK2 unit 1 (stride auto-detected) */
    mountDisk(imagePath: string): Promise<void>;
    /** Set sense switches (1=S1, 2=S2/OpSys, 4=S3, 8=S4/R/F) */
    setSenseSwitches(value: number): Promise<void>;
    /** Click the real Run/Stop button and set 100k speed */
    clickRun(): Promise<void>;
    /** Boot CENTOS: mount + sense + run (does NOT send H1) */
    boot(imagePath: string): Promise<void>;
    /** Send one raw char code to MUX port 0 (waits for read_busy) */
    sendChar(code: number): Promise<void>;
    /** Internal: single un-queued char send (used by sendChar) */
    _sendChar(code: number): Promise<void>;
    /** Send a string char-by-char */
    sendText(text: string): Promise<void>;
    /** Register a callback for raw terminal output bytes (7-bit) */
    onOutput(cb: (code: number) => void): void;
    /** Wait until accumulated output contains a substring */
    waitForOutput(substr: string, timeoutMs?: number): Promise<boolean>;
    /** Get accumulated printable output so far */
    output(): string;
    /** Access the Puppeteer page for debugging */
    _page: any;
}

export async function createBrowserBridge(): Promise<BrowserBridge> {
    const listeners: Array<(code: number) => void> = [];
    let outputLog = '';
    let page: Page | null = null;
    let browser: Browser | null = null;
    const pageHolder = { page: null as Page | null };
    let sendChain: Promise<void> = Promise.resolve();

    const bridge: BrowserBridge = {
        get _page() { return pageHolder.page; },

        async start() {
            // __dirname is server/src/core (ts-node) or server/dist/server/src/core (compiled)
            const candidates = [
                path.resolve(__dirname, '..', '..', '..', 'cen.html'),
                path.resolve(__dirname, '..', '..', '..', '..', '..', 'cen.html'),
            ];
            const htmlPath = candidates.find(p => fs.existsSync(p)) || candidates[0];
            console.log('[Browser] Launching headless Chromium...');
            console.log(`[Browser] Loading: ${htmlPath}`);

            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--use-gl=swiftshader',      // Software WebGL
                    '--disable-gpu-sandbox',
                    '--disable-web-security',
                    '--allow-file-access-from-files',
                ],
            });

            page = await browser.newPage();
            pageHolder.page = page;

            // Expose a raw-byte output function the page can call
            await page.exposeFunction('__muxByte', (code: number) => {
                if (code >= 32 && code < 127) outputLog += String.fromCharCode(code);
                for (const cb of listeners) cb(code);
            });

            // Forward disk/mux console noise for debugging
            page.on('console', (msg: any) => {
                const t = msg.text();
                if (t.startsWith('DSK') || t.indexOf('MUX') >= 0) {
                    console.log('  [B]', t.substring(0, 140));
                }
            });

            await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

            // Wait for the MUX device, then hook write_data (proven output path)
            await page.evaluate(`
                new Promise((resolve, reject) => {
                    const t0 = Date.now();
                    const chk = () => {
                        const mp = window.io_mux && window.io_mux.muxports && window.io_mux.muxports[0];
                        if (mp && mp.write_data) {
                            const orig = mp.write_data.bind(mp);
                            mp.write_data = function (v) {
                                window.__muxByte(v & 0x7F);
                                return orig(v);
                            };
                            resolve(true);
                        } else if (Date.now() - t0 > 30000) {
                            reject(new Error('MUX not available'));
                        } else {
                            setTimeout(chk, 200);
                        }
                    };
                    chk();
                });
            `);

            console.log('[Browser] Headless browser ready');
        },

        async stop() {
            if (page) { await page.close().catch(() => {}); page = null; }
            if (browser) { await browser.close().catch(() => {}); browser = null; }
            console.log('[Browser] Stopped');
        },

        async mountDisk(imagePath: string) {
            if (!page) throw new Error('browser not started');
            const buf = fs.readFileSync(imagePath);
            const base64 = buf.toString('base64');
            const fname = path.basename(imagePath);
            await page.evaluate(`
                const b64 = "${base64}";
                if (window.io_dsk2 && window.io_dsk2.units && window.io_dsk2.units[1]) {
                    const binary = atob(b64);
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                    const ab = bytes.buffer;
                    const stride = binary.length === 6651904 ? 512 : binary.length === 5196800 ? 400 : 512;
                    window.io_dsk2.units[1].image = {
                        type: 'hawk', filename: "${fname}", stride: stride,
                        backing_data: ab, protect: false, data: new Uint8Array(ab),
                    };
                }
            `);
            console.log(`[Browser] Mounted ${fname} on DSK2 unit 1`);
        },

        async setSenseSwitches(value: number) {
            if (!page) throw new Error('browser not started');
            // Front-panel sense buttons have IDs ss1..ss4 (S1=1, S2=2, S3=4, S4=8).
            // They TOGGLE, so check the 'active' class to converge to the wanted state.
            await page.evaluate(`
                const want = ${value & 15};
                const bits = [[1, 'ss1'], [2, 'ss2'], [4, 'ss3'], [8, 'ss4']];
                for (const [bit, id] of bits) {
                    const el = document.getElementById(id);
                    if (!el) continue;
                    const on = el.classList.contains('active');
                    if (on !== ((want & bit) !== 0)) el.click();
                }
            `);
            console.log(`[Browser] Sense switches set to ${value & 15}`);
        },

        async clickRun() {
            if (!page) throw new Error('browser not started');
            await page.evaluate(`
                const r7 = document.getElementById('b_r7');   // 100k speed
                if (r7) r7.click();
                const run = document.getElementById('b_run'); // RUN/STOP (real emulator loop)
                if (run) run.click();
            `);
            console.log('[Browser] RUN clicked (100k)');
        },

        async boot(imagePath: string) {
            await this.mountDisk(imagePath);
            await this.setSenseSwitches(10);   // S2(OpSys)=2 + S4(R/F)=8
            await this.clickRun();
        },

        async sendChar(code: number) {
            if (!page) throw new Error('browser not started');
            // Serialize all sends so characters always arrive in order.
            const op = sendChain.then(() => this._sendChar(code));
            sendChain = op.catch(() => {});
            await op;
        },

        async _sendChar(code: number) {
            if (!page) return;
            // Wait for the MUX input buffer to be free, then deliver the char
            await page.evaluate(`
                new Promise((resolve) => {
                    const chk = () => {
                        const mp = window.io_mux && window.io_mux.muxports && window.io_mux.muxports[0];
                        if (mp && !mp.read_busy) { mp.receive(${code & 0x7F}); resolve(true); }
                        else setTimeout(chk, 50);
                    };
                    chk();
                });
            `);
        },

        async sendText(text: string) {
            for (const ch of text) await this.sendChar(ch.charCodeAt(0));
        },

        onOutput(cb: (code: number) => void) {
            listeners.push(cb);
        },

        async waitForOutput(substr: string, timeoutMs = 30000): Promise<boolean> {
            const t0 = Date.now();
            while (outputLog.indexOf(substr) < 0) {
                if (Date.now() - t0 > timeoutMs) return false;
                await new Promise(r => setTimeout(r, 200));
            }
            return true;
        },

        output() {
            return outputLog;
        },
    };
    return bridge;
}
