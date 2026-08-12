// ============================================================
// Telnet Terminal Adapter
// Implements CharDevice for a Telnet session, providing a
// Centurion CRT terminal that connects to the MUX/serial
// subsystem of the emulated Centurion.
//
// Incoming Telnet keystrokes are mapped to Centurion terminal
// codes; emulated output bytes are fed through the CenturionCRT
// screen-buffer emulator (src/terminal/crt.ts), which renders
// the CRT screen to ANSI escape sequences.
// ============================================================

import { TelnetSession } from '../telnet/server';
import { CharDevice } from '../../../shared/interfaces';
import {
    Color, fg, ansiReset, bold,
    clearScreen, cursorHome, cursorShow,
} from '../telnet/ansi';
import { CenturionCRT } from '../terminal/crt';

export class TelnetTerminal implements CharDevice {
    emu_linked = true;
    rts = true;

    private session: TelnetSession;
    private muxDev: CharDevice | undefined;
    private inputBuf: number[] = [];
    private inputInterval: NodeJS.Timeout | null = null;

    /** Screen-buffer emulation of the Centurion CRT. */
    private crt = new CenturionCRT();

    /** Set when receive() produced output that has not been flushed yet. */
    private outputDirty = false;

    name: string = 'TelnetTerm';

    constructor(session: TelnetSession) {
        this.session = session;

        // Override key handler
        session.onKey = (key: string, buf: string) => {
            this.handleInput(key);
        };

        session.onClose = () => {
            this.stop();
        };

        // When the OS asks the terminal for its status (ESC 0x05), send the
        // status message back into the MUX input stream.
        this.crt.onStatusMessage = (bytes: number[]) => {
            for (const b of bytes) this.inputBuf.push(b & 127);
            this.flushInput();
        };

        this.start();
        this.clearScreen();
        this.showBanner();
    }

    private showBanner(): void {
        const w = this.session.cols || 80;
        const pad = (s: string) => s.padStart(Math.floor((w + s.length) / 2)).padEnd(w);
        this.session.writeln('');
        this.session.writeln(bold() + fg(Color.BRIGHT_CYAN) + pad('╔══════════════════════════════════╗') + ansiReset());
        this.session.writeln(bold() + fg(Color.BRIGHT_CYAN) + pad('║   CENTURION CPU-6  TERMINAL 0   ║') + ansiReset());
        this.session.writeln(bold() + fg(Color.BRIGHT_CYAN) + pad('║     Serial CRT Emulation        ║') + ansiReset());
        this.session.writeln(bold() + fg(Color.BRIGHT_CYAN) + pad('╚══════════════════════════════════╝') + ansiReset());
        this.session.writeln('');
        this.session.writeln(fg(Color.BRIGHT_BLACK) + 'Waiting for CPU to boot...' + ansiReset());
        this.session.writeln(fg(Color.BRIGHT_BLACK) + 'Ensure OpSys (S2) and R/F (S4) are ON in the Control Panel.' + ansiReset());
        this.session.writeln('');
    }

    private start(): void {
        this.inputInterval = setInterval(() => {
            this.flushInput();
            this.flushOutput();
        }, 20); // 50Hz input processing + screen flush
    }

    private stop(): void {
        if (this.inputInterval) {
            clearInterval(this.inputInterval);
            this.inputInterval = null;
        }
    }

    private handleInput(key: string): void {
        // Map common keystrokes to Centurion terminal codes
        let codes: number[] | null = null;

        switch (key) {
            case '\r':
            case '\n':
                codes = [13];
                break;
            case '\x7f': // Backspace / DEL
                codes = [8];
                break;
            case '\t':
                codes = [9];
                break;
            case '\x1b':
                codes = [27];
                break;
            case '\x1b[A': case '\x1bOA': codes = [26]; break; // Up
            case '\x1b[B': case '\x1bOB': codes = [10]; break; // Down
            case '\x1b[C': case '\x1bOC': codes = [6];  break; // Right
            case '\x1b[D': case '\x1bOD': codes = [21]; break; // Left
            default:
                if (key.length === 1) {
                    codes = [key.charCodeAt(0)];
                }
                break;
        }

        if (codes) {
            for (const c of codes) {
                this.inputBuf.push(c & 127);
            }
            this.flushInput();
        }
    }

    private muxConfigured = false; // True once ROM has written to MUX

    private flushInput(): void {
        // Don't send input until MUX is configured (ROM has booted far enough)
        if (!this.muxConfigured) return;
        // Send one char at a time to MUX to avoid overrun.
        const muxPort = this.get_dev() as any;
        if (!muxPort || this.inputBuf.length === 0) return;
        if (!muxPort.read_busy) {
            const ch = this.inputBuf.shift()!;
            muxPort.receive(ch);
        }
    }

    // ---- CharDevice implementation ----

    receive(c: number): void {
        // First MUX output means ROM has configured the MUX
        this.muxConfigured = true;

        // Feed the byte through the CRT screen-buffer emulator; the diff is
        // rendered to the Telnet client on the next flush tick.
        this.crt.receive(c);
        this.outputDirty = true;
    }

    can_receive(): boolean {
        return this.session !== undefined;
    }

    check_send(): void {
        // Nothing buffered to send to emulated system
        // Input goes the other way (from telnet → emulator)
    }

    get_dev(): CharDevice | undefined {
        return this.muxDev;
    }

    bind_dev(dev: CharDevice | undefined): void {
        this.muxDev = dev;
        if (dev) {
            dev.set_cts(this.rts);
        }
    }

    set_cts(value: boolean): void {
        // CTS changed - not much to do for Telnet
    }

    // ---- Screen management ----

    private clearScreen(): void {
        this.session.write(clearScreen() + cursorHome() + cursorShow());
    }

    /**
     * Immediately render any pending CRT output to the Telnet client.
     * Normally called on the 20ms tick; exposed for tests.
     */
    flush(): void {
        this.flushOutput();
    }

    private flushOutput(): void {
        if (!this.outputDirty) return;
        this.outputDirty = false;
        const diff = this.crt.renderDiff();
        if (diff) this.session.write(diff);
    }

    // ---- Public access to input buffer for emulator polling ----

    get pendingInput(): number[] {
        return this.inputBuf;
    }

    readInput(): number {
        if (this.inputBuf.length > 0) {
            return this.inputBuf.shift()!;
        }
        return -1;
    }

    hasInput(): boolean {
        return this.inputBuf.length > 0;
    }

    /** Get pending input without removing */
    peekInput(): number | null {
        return this.inputBuf.length > 0 ? this.inputBuf[0] : null;
    }
}
