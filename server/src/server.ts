// ============================================================
// Centurion CPU-6 Emulator Server
//
// Main entry point: starts the Telnet listeners, WebSocket
// server, and emulation core. Connects all the pieces together.
//
// Usage:
//   npm run build
//   npm start
//
// Telnet ports:
//   2323 - Control Panel (registers, LEDs, front panel status)
//   2324 - Terminal 0 (CRT 0)
//   2325 - Terminal 1 (CRT 1)
//   2326 - Disk Manager
//
// WebSocket:
//   42646 - Browser UI connection
// ============================================================

import { CoreEmulator } from './core/emulator';
import { ControlPanelSession } from './ports/control-panel';
import { TelnetTerminal } from './ports/terminal';
import { DiskManagerSession, ManagedDisk } from './ports/disk-manager';
import { EmuWebSocketServer } from './ws-server';
import { createTelnetServer, TelnetSession } from './telnet/server';
import {
    ServerConfig, DEFAULT_CONFIG, ICCPU,
    CharDevice, DiskImage,
} from '../../shared/interfaces';

// ---- Server State ----

const config: ServerConfig = { ...DEFAULT_CONFIG };
const emulator = new CoreEmulator();
// Reset to a known boot state: enables the RTC guard for the early ROM/WIPL
// phase and sets sense switches to 10 (S2 OpSys + S4 R/F) for CENTOS.
// Without this the ROM boot gets disturbed by the RTC and never prints D=.
emulator.reset();
// Auto-start emulation so `npm start` → telnet port 2324 just works (the
// MUX tap replays the boot output to clients that connect after D=).
// The console `r` command is still available and is idempotent.
emulator.start();

// Active Telnet sessions
const controlPanelSessions: ControlPanelSession[] = [];
const terminalSessions: TelnetTerminal[] = [];

// ------------------------------------------------------------------
// MUX output capture for Terminal 0 / Terminal 1.
//
// The ROM prints its boot prompts (D=, WELCOME, …) ONCE and then waits
// for input. If no telnet client is connected yet, those bytes are lost
// (the MUX has no bound device to deliver them to). Following the proven
// browser-bridge pattern, we hook `write_data` from the start, keep a
// history buffer, and replay it to any terminal that connects later.
// Live output is forwarded to all connected terminal listeners; input
// still flows the other way (terminal → MUX) via `term.bind_dev(muxPort)`.
// NOTE: we do NOT do `muxPort.bind_dev(term)` — that would double-deliver
// output (once via this hook, once via the MUX's internal line forwarding).
// ------------------------------------------------------------------
interface MuxTap {
    history: number[];
    listeners: TelnetTerminal[];
}
const muxTaps: (MuxTap | null)[] = [];
{
    const mux = (global as any).window?.io_mux;
    if (mux?.muxports) {
        for (let i = 0; i < 2; i++) {
            const port = mux.muxports[i];
            if (!port) { muxTaps.push(null); continue; }
            const tap: MuxTap = { history: [], listeners: [] };
            muxTaps.push(tap);
            const origWD = port.write_data.bind(port);
            port.write_data = (v: number) => {
                const c = v & 0x7F;
                tap.history.push(c);
                for (const t of tap.listeners) t.receive(c);
                return origWD(v);
            };
        }
    } else {
        muxTaps.push(null, null);
    }
}
function attachTerminal(portIndex: number, term: TelnetTerminal): void {
    const tap = muxTaps[portIndex];
    if (tap) {
        tap.listeners.push(term);
        // Replay anything the ROM printed before this client connected
        for (const c of tap.history) term.receive(c);
    }
}

// ---- WebSocket Server (for browser UI) ----

const wsServer = new EmuWebSocketServer(
    config.websocket.port,
    emulator.cpu,
    emulator.serialDevices,
    {
        onStep: (dbg: boolean) => {
            emulator.step(dbg);
            updateControlPanels();
        },
        onStepN: (count: number) => {
            for (let i = 0; i < count; i++) {
                emulator.step(false);
            }
            updateControlPanels();
        },
        onGetState: () => {
            wsServer.broadcastState();
        },
        onReset: () => {
            emulator.reset();
            updateControlPanels();
        },
    }
);

// ---- Control Panel Update ----

function updateControlPanels(): void {
    for (const session of controlPanelSessions) {
        session.markDirty();
    }
}

// ---- Telnet: Control Panel (port 2323) ----

createTelnetServer(
    config.telnet.controlPanel,
    (session: TelnetSession) => {
        const cp = new ControlPanelSession(emulator.cpu, null, session, emulator);
        controlPanelSessions.push(cp);

        session.onClose = () => {
            const idx = controlPanelSessions.indexOf(cp);
            if (idx >= 0) controlPanelSessions.splice(idx, 1);
        };
    },
    'ControlPanel'
);

// ---- Telnet: Terminal 0 (port 2324) ----

createTelnetServer(
    config.telnet.terminal0,
    (session: TelnetSession) => {
        const term = new TelnetTerminal(session);
        term.name = 'TelnetTerm0';
        terminalSessions.push(term);
        emulator.serialDevices.push(term);

        session.onClose = () => {
            const idx = terminalSessions.indexOf(term);
            if (idx >= 0) terminalSessions.splice(idx, 1);
            const sidx = emulator.serialDevices.indexOf(term);
            if (sidx >= 0) emulator.serialDevices.splice(sidx, 1);
            const tap = muxTaps[0];
            if (tap) {
                const li = tap.listeners.indexOf(term);
                if (li >= 0) tap.listeners.splice(li, 1);
            }
        };

        // Output: via the MUX tap (history + live), see MuxTap above.
        // Input: Terminal → MUX port 0.
        const mux = (global as any).window?.io_mux;
        if (mux?.muxports?.[0]) {
            term.bind_dev(mux.muxports[0]);
            attachTerminal(0, term);
            console.log('[Term0] Bound to MUX port 0 (tap + input)');
        }
        console.log('[Term0] Telnet terminal connected');
    },
    'Terminal0'
);

// ---- Telnet: Terminal 1 (port 2325) ----

createTelnetServer(
    config.telnet.terminal1,
    (session: TelnetSession) => {
        const term = new TelnetTerminal(session);
        term.name = 'TelnetTerm1';
        terminalSessions.push(term);
        emulator.serialDevices.push(term);

        session.onClose = () => {
            const idx = terminalSessions.indexOf(term);
            if (idx >= 0) terminalSessions.splice(idx, 1);
            const sidx = emulator.serialDevices.indexOf(term);
            if (sidx >= 0) emulator.serialDevices.splice(sidx, 1);
            const tap = muxTaps[1];
            if (tap) {
                const li = tap.listeners.indexOf(term);
                if (li >= 0) tap.listeners.splice(li, 1);
            }
        };

        // Output: via the MUX tap (history + live). Input: Terminal → MUX port 1.
        const mux1 = (global as any).window?.io_mux;
        if (mux1?.muxports?.[1]) {
            term.bind_dev(mux1.muxports[1]);
            attachTerminal(1, term);
            console.log('[Term1] Bound to MUX port 1 (tap + input)');
        }
        console.log('[Term1] Telnet terminal connected');
    },
    'Terminal1'
);

// ---- Telnet: Disk Manager (port 2326) ----

createTelnetServer(
    config.telnet.diskManager,
    (session: TelnetSession) => {
        const rawUnits = emulator.getAllDiskUnits();
        const diskUnits: ManagedDisk[] = rawUnits.map(u => ({
            container: u.container,
            image: u.image,
            label: u.label,
            type: u.type,
            unitIndex: u.unitIndex,
        }));
        new DiskManagerSession(diskUnits, session, './disks');
    },
    'DiskManager'
);

// ---- State broadcast timer ----

setInterval(() => {
    if (emulator.isRunning) {
        wsServer.broadcastState();
    }
}, 200); // 5 Hz state updates to browser

// ---- Console commands (for the server process itself) ----

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'CEN> ',
});

console.log('');
console.log('╔══════════════════════════════════════════════════╗');
console.log('║     CENTURION CPU-6 EMULATOR SERVER v0.22        ║');
console.log('╠══════════════════════════════════════════════════╣');
console.log('║  Telnet:                                          ║');
console.log(`║    Control Panel : port ${String(config.telnet.controlPanel).padStart(5)}                    ║`);
console.log(`║    Terminal 0    : port ${String(config.telnet.terminal0).padStart(5)}                    ║`);
console.log(`║    Terminal 1    : port ${String(config.telnet.terminal1).padStart(5)}                    ║`);
console.log(`║    Disk Manager  : port ${String(config.telnet.diskManager).padStart(5)}                    ║`);
console.log('║                                                  ║');
console.log('║  WebSocket (Browser):                             ║');
console.log(`║    port ${String(config.websocket.port).padStart(5)}                                 ║`);
console.log('╠══════════════════════════════════════════════════╣');
console.log('║  Commands: s(tep) r(un) h(alt) q(uit)            ║');
console.log('╚══════════════════════════════════════════════════╝');
console.log('');

rl.prompt();

rl.on('line', (line: string) => {
    const cmd = line.trim().toLowerCase();

    switch (cmd) {
        case 's':
        case 'step':
            emulator.step(true);
            updateControlPanels();
            wsServer.broadcastState();
            console.log(`  PC: ${(emulator.cpu.pc || 0).toString(16).toUpperCase().padStart(4, '0')}`);
            break;

        case 'r':
        case 'run':
            emulator.start();
            console.log('  Emulation running...');
            break;

        case 'h':
        case 'halt':
            emulator.stop();
            console.log('  Emulation halted.');
            updateControlPanels();
            wsServer.broadcastState();
            break;

        case 'reset':
            emulator.reset();
            updateControlPanels();
            wsServer.broadcastState();
            console.log('  CPU reset.');
            break;

        case 'q':
        case 'quit':
        case 'exit':
            console.log('  Shutting down...');
            emulator.stop();
            rl.close();
            process.exit(0);
            break;

        case 'help':
        case '?':
            console.log('  Commands:');
            console.log('    s, step   - Single step the CPU');
            console.log('    r, run    - Start continuous emulation');
            console.log('    h, halt   - Halt emulation');
            console.log('    reset     - Reset CPU');
            console.log('    q, quit   - Shutdown server');
            break;

        default:
            if (cmd) console.log(`  Unknown command: ${cmd}`);
            break;
    }

    rl.prompt();
});

rl.on('close', () => {
    console.log('Goodbye.');
});

// ---- Graceful shutdown ----

process.on('SIGINT', () => {
    console.log('\n  Shutting down...');
    emulator.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    emulator.stop();
    process.exit(0);
});
