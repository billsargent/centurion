// ============================================================
// OS Console — scriptable driver for the booted Centurion OS.
//
// Uses TelnetHarness to spawn the server (or attach to a running
// one), boot CENTOS to CRT0 READY, then run commands against the
// OS and dump the transcript.
//
// Usage:
//   npm run build   # first
//   npx ts-node src/tests/os-console.ts                     # boot + .STA demo
//   npx ts-node src/tests/os-console.ts --cmd ".STA"        # boot + run a command
//   npx ts-node src/tests/os-console.ts --cmd ".STA" --date 081226 --time 120000
//   npx ts-node src/tests/os-console.ts --connect           # attach to running server
//   npx ts-node src/tests/os-console.ts --no-spawn --cmd "x" # attach, skip boot? (see below)
// ============================================================
import { TelnetHarness } from '../telnet/harness';

function arg(name: string): string | undefined {
    const i = process.argv.indexOf(name);
    return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : undefined;
}
function flag(name: string): boolean {
    return process.argv.includes(name);
}

async function main() {
    const cmd = arg('--cmd') ?? '.STA';
    const date = arg('--date') ?? '010180';
    const time = arg('--time') ?? '120000';
    const connectOnly = flag('--connect');
    const noBoot = flag('--no-boot');
    const bootTimeout = parseInt(arg('--timeout') ?? '90000', 10);

    console.log('=== OS Console ===\n');

    const h = connectOnly
        ? await TelnetHarness.connect(2324, '127.0.0.1')
        : await TelnetHarness.launch({ spawnTimeout: 30000 });

    try {
        if (!noBoot) {
            console.log('[..] Booting CENTOS...');
            await h.boot({ date, time, timeout: bootTimeout });
            console.log('[OK] CRT0 READY');
        } else {
            console.log('[..] Skipping boot (--no-boot)');
        }

        // Small settle, then run the requested command
        await h.sleep(500);
        console.log(`[..] Sending command: ${cmd}`);
        h.sendLine(cmd);

        // Wait a few seconds for the OS to respond, then dump
        await h.sleep(4000);
        console.log('\n--- Transcript ---');
        console.log(h.transcript.slice(-8000));
    } finally {
        await h.close();
    }

    process.exit(0);
}

main().catch(err => { console.error('FAIL:', err.message); process.exit(1); });
