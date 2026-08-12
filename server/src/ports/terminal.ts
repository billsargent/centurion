// ============================================================
// Telnet Terminal Adapter
// Implements CharDevice for a Telnet session, providing
// a VT100-compatible terminal that connects to the MUX/serial
// subsystem of the emulated Centurion.
//
// Maps incoming Telnet keystrokes to the emulated terminal and
// converts emulated terminal output to ANSI escape sequences.
// ============================================================

import { TelnetSession } from '../telnet/server';
import { CharDevice } from '../../../shared/interfaces';
import {
    CSI, Color, fg, bg, ansiReset, bold, blink, reverse, dim,
    cursorPos, cursorHome, clearScreen, clearLine, clearToEnd,
    cursorHide, cursorShow,
} from '../telnet/ansi';

// VT100 character attribute mapping
// Centurion CRTs use a 16-bit character cell:
//   bits 0-7: character
//   bit 8-10: foreground color (0-7)
//   bit 11-13: background color (0-7)
//   bit 14: blink
//   bit 15: underline (or reverse, depending on mode)

const FG_COLORS: Color[] = [
    Color.BLACK, Color.RED, Color.GREEN, Color.YELLOW,
    Color.BLUE, Color.MAGENTA, Color.CYAN, Color.WHITE,
];

const BG_COLORS: Color[] = [
    Color.BLACK, Color.BRIGHT_BLACK, Color.BRIGHT_BLACK, Color.BRIGHT_BLACK,
    Color.BRIGHT_BLACK, Color.BRIGHT_BLACK, Color.BRIGHT_BLACK, Color.WHITE,
];

export class TelnetTerminal implements CharDevice {
    emu_linked = true;
    rts = true;

    private session: TelnetSession;
    private muxDev: CharDevice | undefined;
    private inputBuf: number[] = [];
    private inputInterval: NodeJS.Timeout | null = null;
    private lastBuffer = new Uint16Array(80 * 25);
    private dirty = true;
    private cursorX = 0;
    private cursorY = 0;

    // VT100 state
    private escMode: number = 0;
    private escParam: number = 0;
    private escParams: number[] = [];
    private escBuf: string = '';

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
        }, 20); // 50Hz input processing
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

    /** bytes still to consume inside a Centurion ESC sequence (0 = normal) */
    private escRemain = 0;

    receive(c: number): void {
        // First MUX output means ROM has configured the MUX
        this.muxConfigured = true;

        // Centurion ESC sequence: 0x1B ESC introduces a control command. The
        // command byte follows; a few commands (0x10 DLE = set horizontal
        // address, 0x30 '0' = set visual attribute) take one more arg byte.
        // We consume these silently — they are screen-control, not text.
        if (this.escRemain > 0) {
            this.escRemain--;
            if (this.escRemain === 0 && (c === 0x10 || c === 0x30)) {
                this.escRemain = 1; // consume the argument byte next
            }
            return;
        }

        switch (c) {
            case 0x0C: // form feed: clear screen
                this.session.write(clearScreen() + cursorHome());
                return;
            case 0x0D: // CR
            case 0x0A: // LF
                this.session.write('\r\n');
                return;
            case 0x08: // backspace (OS clearing a field)
                this.session.write('\b \b');
                return;
            case 0x07: // BEL — no sound in the in-process core
            case 0x12: // DC2
            case 0x14: // DC4 (aux port control)
            case 0x1A: // SUB (cursor up — we're line-oriented)
                return;
            case 0x1B: // ESC: begin consuming the sequence
                this.escRemain = 1;
                return;
            default:
                if (c >= 32 && c < 127) {
                    this.session.write(String.fromCharCode(c));
                }
                // all other control bytes: suppressed (no <hex> tags)
                return;
        }
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
        this.session.write(clearScreen() + cursorHome() + cursorHide());
        this.cursorX = 0;
        this.cursorY = 0;
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
