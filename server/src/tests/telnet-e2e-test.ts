// End-to-end test: headless browser + Telnet terminal + full CENTOS boot.
// Starts the bridge, boots to D=, then connects a raw TCP socket as a
// "Telnet" client and drives the interactive boot to CRT0 READY.
import { createBrowserBridge, BrowserBridge } from '../core/browser-bridge';
import { TelnetTerminal } from '../ports/terminal';
import { createTelnetServer, TelnetSession } from '../telnet/server';
import { CharDevice } from '../../../shared/interfaces';
import * as path from 'path';
import * as net from 'net';

const DISK_PATH = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');
const PORT = 2345; // test-only port

class BrowserMuxAdapter implements CharDevice {
    emu_linked = true;
    rts = true;
    name = 'BrowserMUX';
    read_busy = false;
    constructor(private bridge: BrowserBridge) {}
    receive(c: number): void { this.bridge.sendChar(c).catch(e => console.warn('[MUX] send fail', e.message)); }
    can_receive(): boolean { return true; }
    check_send(): void {}
    get_dev(): CharDevice | undefined { return undefined; }
    bind_dev(_dev: CharDevice | undefined): void {}
    set_cts(_value: boolean): void {}
}

// Strip Telnet IAC + ANSI escapes to get readable text for assertions
function readable(chunks: Buffer[]): string {
    let s = Buffer.concat(chunks).toString('latin1');
    s = s.replace(/\xff[\xfb-\xfe]./g, '');        // IAC WILL/WONT/DO/DONT opt
    s = s.replace(/\xff\xfa[\s\S]*?\xff\xf0/g, ''); // IAC SB ... IAC SE
    s = s.replace(/\xff/g, '');                     // stray IAC
    s = s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '');   // ANSI CSI
    s = s.replace(/\x1b[()][A-Za-z0-9]/g, '');      // ANSI charset
    s = s.replace(/\x1b/g, '');
    s = s.replace(/[\x00-\x1f]/g, '');              // control chars (incl. <tags> keep hex text)
    return s;
}

async function main() {
    console.log('=== Telnet E2E Test ===\n');

    const bridge = await createBrowserBridge();
    await bridge.start();
    await bridge.boot(DISK_PATH);
    console.log('[OK] Booted to D= prompt');

    const terminals: TelnetTerminal[] = [];
    const history: number[] = [];
    bridge.onOutput(code => {
        history.push(code);
        for (const t of terminals) t.receive(code);
    });

    createTelnetServer(PORT, (session: TelnetSession) => {
        const term = new TelnetTerminal(session);
        term.bind_dev(new BrowserMuxAdapter(bridge));
        terminals.push(term);
        for (const c of history) term.receive(c);
    }, 'E2E');

    // Give the emulator time to print D=
    await new Promise(r => setTimeout(r, 4000));

    // Connect a raw TCP "telnet" client
    const chunks: Buffer[] = [];
    const sock = net.connect(PORT, '127.0.0.1');
    sock.on('data', d => chunks.push(d));
    await new Promise<void>((res, rej) => {
        sock.once('connect', () => res());
        sock.once('error', rej);
    });
    console.log('[OK] TCP connected');

    const waitFor = async (substr: string, timeoutMs: number): Promise<boolean> => {
        const t0 = Date.now();
        while (readable(chunks).indexOf(substr) < 0) {
            if (Date.now() - t0 > timeoutMs) return false;
            await new Promise(r => setTimeout(r, 250));
        }
        return true;
    };

    // 1. D= prompt
    if (!(await waitFor('D=', 15000))) { fail('D= prompt', chunks); }
    console.log('[OK] D= prompt received');

    // 2. H1 → MAX DISK
    sock.write('H1\r');
    if (!(await waitFor('MAX DISK', 30000))) { fail('MAX DISK prompt', chunks); }
    console.log('[OK] MAX DISK prompt received');

    // 3. Enter → date prompt
    sock.write('\r');
    if (!(await waitFor('MMDDYY', 15000))) { fail('date prompt', chunks); }
    console.log('[OK] Date prompt received');

    // 4. Date → time prompt
    sock.write('081226\r');
    if (!(await waitFor('HHMMSS', 15000))) { fail('time prompt', chunks); }
    console.log('[OK] Time prompt received');

    // 5. Time → CRT0 READY
    sock.write('120000\r');
    if (!(await waitFor('CRT0 READY', 30000))) { fail('CRT0 READY', chunks); }
    console.log('[OK] *** CRT0 READY — full boot via Telnet verified! ***\n');

    console.log('--- Readable transcript ---');
    console.log(readable(chunks).slice(0, 2000));

    sock.destroy();
    await bridge.stop();
    process.exit(0);
}

function fail(what: string, chunks: Buffer[]): never {
    console.error(`[FAIL] Timed out waiting for: ${what}`);
    console.error('--- Transcript so far ---');
    console.error(readable(chunks).slice(0, 3000));
    process.exit(1);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
