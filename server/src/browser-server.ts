// ============================================================
// Centurion CPU-6 — Headless Browser Emulator Server
//
// Runs the emulation in headless Chromium (the PROVEN engine
// path) and exposes the MUX terminal over Telnet.
//
// The server boots the emulator to the D= prompt, then hands
// the terminal to the Telnet user, who drives the CENTOS boot
// interactively: H1 → MAX DISK → date → time → CRT0 READY.
//
// Usage:
//   npx ts-node src/browser-server.ts
//   telnet localhost 2324
// ============================================================

import { createBrowserBridge, BrowserBridge } from './core/browser-bridge';
import { TelnetTerminal } from './ports/terminal';
import { createTelnetServer, TelnetSession } from './telnet/server';
import { CharDevice } from '../../shared/interfaces';
import * as path from 'path';
import * as fs from 'fs';

const DISK_PATH = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');
const TERMINAL_PORT = 2324;

// Adapter that presents the headless-browser MUX as a CharDevice so the
// TelnetTerminal's input path (flushInput) can deliver keystrokes to it.
class BrowserMuxAdapter implements CharDevice {
    emu_linked = true;
    rts = true;
    name = 'BrowserMUX';
    read_busy = false; // bridge.sendChar waits for the real read_busy internally

    constructor(private bridge: BrowserBridge) {}

    receive(c: number): void {
        // Fire-and-forget: bridge queues/wait for the browser MUX to be free
        this.bridge.sendChar(c).catch(err => console.warn('[MUX] send failed:', err.message));
    }
    can_receive(): boolean { return true; }
    check_send(): void {}
    get_dev(): CharDevice | undefined { return undefined; }
    bind_dev(_dev: CharDevice | undefined): void {}
    set_cts(_value: boolean): void {}
}

async function main() {
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║   CENTURION CPU-6 — HEADLESS BROWSER SERVER      ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');

    if (!fs.existsSync(DISK_PATH)) {
        console.error(`[FATAL] Disk image not found: ${DISK_PATH}`);
        process.exit(1);
    }

    // 1. Launch the browser emulator and boot to the D= prompt
    const bridge = await createBrowserBridge();
    await bridge.start();
    await bridge.boot(DISK_PATH); // mount + sense=10 + RUN (no H1 yet)

    const terminals: TelnetTerminal[] = [];
    const outputHistory: number[] = [];

    // 2. Capture MUX output; broadcast to terminals and keep a replay buffer
    bridge.onOutput((code: number) => {
        outputHistory.push(code);
        for (const t of terminals) t.receive(code);
    });

    // 3. Telnet terminal on port 2324
    createTelnetServer(
        TERMINAL_PORT,
        (session: TelnetSession) => {
            const term = new TelnetTerminal(session);
            term.name = 'BrowserTerm0';
            terminals.push(term);

            // Bind the browser MUX adapter so keystrokes reach the emulator
            term.bind_dev(new BrowserMuxAdapter(bridge));

            // Replay buffered output so late connectors see the D= prompt
            for (const code of outputHistory) term.receive(code);

            session.onClose = () => {
                const i = terminals.indexOf(term);
                if (i >= 0) terminals.splice(i, 1);
            };

            console.log(`[Term0] Telnet terminal connected (${terminals.length} active)`);
        },
        'Terminal0'
    );

    console.log('');
    console.log('The emulator is running. Connect with:');
    console.log(`    telnet localhost ${TERMINAL_PORT}`);
    console.log('');
    console.log('You should see the D= prompt — type H1 to boot CENTOS,');
    console.log('then answer the MAX DISK / date / time prompts.');
    console.log('');
    console.log('Server commands: q = quit');
    console.log('');

    // 4. Console control
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'CEN> ',
    });
    rl.prompt();
    rl.on('line', (line: string) => {
        const cmd = line.trim().toLowerCase();
        if (cmd === 'q' || cmd === 'quit' || cmd === 'exit') {
            console.log('Shutting down...');
            bridge.stop().then(() => process.exit(0));
        } else {
            console.log('Commands: q = quit');
            rl.prompt();
        }
    });
}

main().catch(err => {
    console.error('FAIL:', err);
    process.exit(1);
});
