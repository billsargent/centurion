// ============================================================
// Server E2E test — validates the REAL `npm start` path.
//
// Spawns `node dist/server/src/server.js` (the compiled entry
// point, exactly what `npm run start` runs), sends `r` to its
// console to start emulation, then connects a raw TCP client to
// Terminal 0 (port 2324) and drives the full CENTOS boot:
//   D= → H1 → MAX DISK → date → time → CRT0 READY
//
// Requires: `npm run build` first (uses dist/).
// ============================================================
import * as path from 'path';
import * as net from 'net';
import { spawn, ChildProcess } from 'child_process';

const SERVER_JS = path.resolve(__dirname, '..', 'server.js');
const PORT = 2324;
const HOST = '127.0.0.1';

function readable(chunks: Buffer[]): string {
    let s = Buffer.concat(chunks).toString('latin1');
    s = s.replace(/\xff[\xfb-\xfe]./g, '');         // IAC WILL/WONT/DO/DONT
    s = s.replace(/\xff\xfa[\s\S]*?\xff\xf0/g, ''); // IAC SB .. IAC SE
    s = s.replace(/\xff/g, '');
    s = s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '');   // ANSI CSI
    s = s.replace(/\x1b[()][A-Za-z0-9]/g, '');
    s = s.replace(/\x1b/g, '');
    s = s.replace(/[\x00-\x1f]/g, '');
    return s;
}

async function main() {
    console.log('=== Server E2E (npm start path) ===\n');
    console.log(`Server: ${SERVER_JS}`);

    const proc: ChildProcess = spawn('node', [SERVER_JS], { stdio: ['pipe', 'pipe', 'pipe'] });
    let serverLog = '';
    proc.stdout!.on('data', d => { serverLog += d.toString(); });
    proc.stderr!.on('data', d => { serverLog += d.toString(); });

    // Wait for the server banner / bind
    const t0 = Date.now();
    while (serverLog.indexOf('EMULATOR SERVER') < 0) {
        if (Date.now() - t0 > 20000) {
            console.error('[FAIL] Server did not start');
            console.error(serverLog.slice(0, 2000));
            proc.kill(); process.exit(1);
        }
        await new Promise(r => setTimeout(r, 200));
    }
    console.log('[OK] Server banner seen — starting emulation (r)');
    proc.stdin!.write('r\n');

    // Connect Telnet client to Terminal 0
    const chunks: Buffer[] = [];
    const sock = net.connect(PORT, HOST);
    sock.on('data', d => chunks.push(d));
    await new Promise<void>((res, rej) => {
        sock.once('connect', () => res());
        sock.once('error', rej);
    });
    console.log('[OK] Connected to Terminal 0\n');

    const waitFor = async (substr: string, timeoutMs: number): Promise<boolean> => {
        const s0 = Date.now();
        while (readable(chunks).indexOf(substr) < 0) {
            if (Date.now() - s0 > timeoutMs) return false;
            await new Promise(r => setTimeout(r, 250));
        }
        return true;
    };
    const fail = (what: string): never => {
        console.error(`[FAIL] Timed out waiting for: ${what}`);
        console.error('--- Server log ---\n' + serverLog.slice(0, 3000));
        console.error('--- Transcript ---\n' + readable(chunks).slice(0, 3000));
        sock.destroy(); proc.kill(); process.exit(1);
    };

    // 1. D= prompt
    if (!(await waitFor('D=', 30000))) fail('D= prompt');
    console.log('[OK] D= prompt');
    await new Promise(r => setTimeout(r, 1500));

    // 2. H1 → MAX DISK
    sock.write('H1');
    if (!(await waitFor('MAX DISK', 40000))) fail('MAX DISK prompt');
    console.log('[OK] MAX DISK prompt');

    // 3. Enter → date prompt
    sock.write('\r');
    if (!(await waitFor('MMDDYY', 20000))) fail('date prompt');
    console.log('[OK] Date prompt');

    // 4. Date → time prompt
    sock.write('081226\r');
    if (!(await waitFor('HHMMSS', 20000))) fail('time prompt');
    console.log('[OK] Time prompt');

    // 5. Time → CRT0 READY
    sock.write('120000\r');
    if (!(await waitFor('CRT0 READY', 40000))) fail('CRT0 READY');
    console.log('[OK] *** CRT0 READY — full boot via npm start verified! ***\n');

    console.log('--- Transcript ---');
    console.log(readable(chunks).slice(0, 2000));

    sock.destroy();
    proc.kill();
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
