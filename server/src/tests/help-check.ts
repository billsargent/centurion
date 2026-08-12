// Quick check: connect to Control Panel (2323), press h, dump the help text.
import { TelnetHarness } from '../telnet/harness';

async function main() {
    const h = await TelnetHarness.launch({ spawnTimeout: 30000 });
    // The harness connects to 2324 by default; open a second socket to 2323.
    const net = await import('net');
    const chunks: Buffer[] = [];
    const sock = net.connect(2323, '127.0.0.1');
    sock.on('data', (d: Buffer) => chunks.push(d));
    await new Promise<void>((res, rej) => { sock.once('connect', () => res()); sock.once('error', rej); });
    await new Promise(r => setTimeout(r, 500));
    sock.write('h');
    await new Promise(r => setTimeout(r, 1200));

    const strip = (s: string) => s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '').replace(/\x1b/g, '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
    const txt = strip(Buffer.concat(chunks).toString('latin1'));

    console.log('=== CONTROL PANEL HELP ===\n');
    console.log(txt);
    const checks = ['SENSE SWITCHES', 'OPSYS', 'R/F', 'BOOT DEFAULT INTO THE OS', 'BOOT DIAG', 'S1 ON -> jumps to diag', 'CRT0 READY', '0x8000', '2324', '2326'];
    console.log('\n=== Checks ===');
    for (const c of checks) {
        console.log(`${txt.includes(c) ? '[OK]' : '[MISSING]'} ${c}`);
    }
    sock.destroy();
    await h.close();
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err.message); process.exit(1); });
