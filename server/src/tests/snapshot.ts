// Snapshot the running server: Terminal 0 (2324), Control Panel (2323),
// Disk Manager (2326). Read-only — sends no keys.
import * as net from 'net';

const PORTS: [number, string][] = [[2324, 'Terminal 0'], [2323, 'Control Panel'], [2326, 'Disk Manager']];

function strip(s: string): string {
    s = s.replace(/\xff[\xfb-\xfe]./g, '').replace(/\xff/g, '');
    s = s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '');
    s = s.replace(/\x1b/g, '');
    s = s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
    return s;
}

async function readPort(port: number, label: string, ms: number): Promise<string> {
    return new Promise((resolve) => {
        const chunks: Buffer[] = [];
        const sock = net.connect(port, '127.0.0.1');
        sock.on('data', (d: Buffer) => chunks.push(d));
        sock.on('error', (e: any) => resolve(`<connect error: ${e.message}>`));
        sock.on('connect', () => {
            setTimeout(() => {
                sock.destroy();
                resolve(strip(Buffer.concat(chunks).toString('latin1')));
            }, ms);
        });
    });
}

async function main() {
    console.log('=== Running server snapshot ===\n');
    for (const [port, label] of PORTS) {
        const text = await readPort(port, label, 1200);
        console.log(`───── ${label} (port ${port}) ─────`);
        console.log(text.length ? text : '(no output)');
        console.log('');
    }
    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err.message); process.exit(1); });
