// Verify the terminal adapter hides Centurion control bytes while keeping text.
// Captures the real MUX byte stream from an in-process boot, feeds it through
// TelnetTerminal.receive() with a mock session, and checks the rendered output.
import { CoreEmulator } from '../core/emulator';
import { TelnetTerminal } from '../ports/terminal';

class MockSession {
    chunks: string[] = [];
    cols = 80;
    rows = 24;
    onKey: (key: string, buf: string) => void = () => {};
    onClose: (() => void) | undefined;
    write(data: string | Buffer): void { this.chunks.push(typeof data === 'string' ? data : data.toString('latin1')); }
    writeln(data: string): void { this.chunks.push(data + '\r\n'); }
    close(): void {}
    get text(): string {
        let s = this.chunks.join('');
        s = s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '').replace(/\x1b/g, '').replace(/[\x00-\x1f]/g, '');
        return s;
    }
}

async function main() {
    console.log('=== Terminal adapter clean-display verification ===\n');

    // 1. Boot in-process and capture the raw MUX byte stream
    const emulator = new CoreEmulator();
    emulator.reset();
    const g = global as any;
    const port0 = g.window?.io_mux?.muxports?.[0];
    const raw: number[] = [];
    if (port0) {
        const orig = port0.write_data.bind(port0);
        port0.write_data = (v: number) => { raw.push(v & 0x7F); return orig(v); };
    }
    const waitReadBusy = () => new Promise<void>(res => {
        const chk = () => { if (!port0.read_busy) res(); else setTimeout(chk, 25); };
        chk();
    });
    const send = async (s: string) => { for (const ch of s) { await waitReadBusy(); port0.receive(ch.charCodeAt(0)); await new Promise(r => setTimeout(r, 120)); } };

    emulator.start();
    // Wait for D= then drive the full boot
    const t0 = Date.now();
    while (!raw.some(b => b === 0x3D) && Date.now() - t0 < 20000) await new Promise(r => setTimeout(r, 200));
    await send('H1');
    while (Buffer.from(raw).toString('latin1').indexOf('MAX DISK') < 0 && Date.now() - t0 < 60000) await new Promise(r => setTimeout(r, 200));
    await send('\r010180\r120000\r');
    while (Buffer.from(raw).toString('latin1').indexOf('CRT0 READY') < 0 && Date.now() - t0 < 60000) await new Promise(r => setTimeout(r, 200));
    emulator.stop();
    console.log(`[OK] Captured ${raw.length} raw MUX bytes (full boot)`);

    // 2. Feed them through the TelnetTerminal
    const sess = new MockSession();
    const term = new TelnetTerminal(sess as any);
    for (const b of raw) term.receive(b);

    // 3. Assertions
    const text = sess.text;
    const checks: [string, boolean][] = [
        ['D=', text.includes('D=')],
        ['LOS 7.1 - E', text.includes('LOS 7.1 - E')],
        ['WELCOME TO THE CENTURION', text.includes('WELCOME TO THE CENTURION')],
        ['MAX DISK', text.includes('MAX DISK')],
        ['CRT0 READY', text.includes('CRT0 READY')],
    ];
    console.log('\n[text content]');
    let allGood = true;
    for (const [label, ok] of checks) {
        console.log(`  ${ok ? '[OK]' : '[FAIL]'} contains "${label}"`);
        if (!ok) allGood = false;
    }

    // 4. No <hex> control tags should remain
    const tagRe = /<[0-9A-Fa-f]{2}>/;
    const hasTags = tagRe.test(text);
    console.log(`\n[control tags] ${hasTags ? '[FAIL] still showing <hex> tags' : '[OK] no <hex> tags in output'}`);
    if (hasTags) {
        const m = text.match(tagRe);
        console.log(`  first tag: ${m?.[0]}`);
        allGood = false;
    }

    console.log('\n--- Rendered (clean) output ---');
    console.log(text.slice(0, 1200));

    process.exit(allGood ? 0 : 1);
}

main().catch(err => { console.error('FAIL:', err.message); process.exit(1); });
