// ============================================================
// Telnet Harness — reusable client for driving the emulated
// Centurion OS (CENTOS) over Telnet.
//
// I (the agent) use this to connect to the in-process server
// (`npm start`, Terminal 0 = port 2324), boot CENTOS, and then
// interact with the OS: send commands, wait for prompts, capture
// transcript. It handles the RFC 854 negotiation the server
// performs (WILL ECHO / SUPPRESS_GA, DO TERMTYPE / NAWS) and can
// spawn the server itself if it isn't already running.
//
// Usage:
//   const h = await TelnetHarness.launch();      // spawn server + connect
//   await h.boot();                              // D= → H1 → date → time → CRT0 READY
//   await h.sendLine('.STA');                    // run a command
//   await h.waitFor('SOME PROMPT', 10000);
//   console.log(h.transcript);
//   await h.close();
// ============================================================
import * as net from 'net';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';

// ---- Telnet protocol constants ----
const IAC = 255;
const DONT = 254, DO = 253, WONT = 252, WILL = 251, SB = 250, SE = 240;
const OPT_ECHO = 1, OPT_SUPPRESS_GA = 3, OPT_TERMTYPE = 24, OPT_NAWS = 31;
const OPT_LINEMODE = 34;

export interface LaunchOptions {
    port?: number;
    host?: string;
    /** Spawn the npm-start server (requires `npm run build` first). Default true. */
    spawn?: boolean;
    /** Wait for the banner before connecting. Default true. */
    waitForServer?: boolean;
    /** Spawn timeout ms. */
    spawnTimeout?: number;
}

export interface BootOptions {
    /** MMDDYY, e.g. '081226'. Default '010180'. */
    date?: string;
    /** HHMMSS, e.g. '120000'. Default '120000'. */
    time?: string;
    /** Overall boot timeout ms. Default 90000. */
    timeout?: number;
}

/**
 * A raw telnet client that:
 *  - performs the IAC negotiation the server expects,
 *  - strips control/telnet sequences from the captured transcript,
 *  - exposes send/waitFor/readUntil primitives.
 */
export class TelnetHarness {
    port: number;
    host: string;
    private sock: net.Socket | null = null;
    private proc: ChildProcess | null = null;
    private rawChunks: Buffer[] = [];
    private _transcript: string = '';
    private _negotiated = false;

    constructor(port = 2324, host = '127.0.0.1') {
        this.port = port;
        this.host = host;
    }

    // ----------------------------------------------------------
    // Lifecycle
    // ----------------------------------------------------------

    /**
     * Spawn the compiled server (`npm start` equivalent) and connect to
     * Terminal 0. Requires `npm run build` to have been run first.
     */
    static async launch(opts: LaunchOptions = {}): Promise<TelnetHarness> {
        const port = opts.port ?? 2324;
        const host = opts.host ?? '127.0.0.1';
        const h = new TelnetHarness(port, host);

        if (opts.spawn !== false) {
            // Resolve compiled server.js for both harness layouts:
            //  - compiled: dist/server/src/telnet/../server.js
            //  - ts-node : src/telnet/../../../dist/server/src/server.js
            const candidates = [
                path.resolve(__dirname, '..', 'server.js'),
                path.resolve(__dirname, '..', '..', '..', 'dist', 'server', 'src', 'server.js'),
            ];
            const serverJs = candidates.find(p => fs.existsSync(p)) || candidates[0];
            if (!fs.existsSync(serverJs)) {
                throw new Error(
                    `Compiled server not found (tried ${candidates.join(', ')})\n` +
                    'Run `npm run build` first (npm start path requires dist/).'
                );
            }
            const proc = spawn('node', [serverJs], { stdio: ['pipe', 'pipe', 'pipe'] });
            h.proc = proc;
            let log = '';
            proc.stdout?.on('data', (d: Buffer) => { log += d.toString(); });
            proc.stderr?.on('data', (d: Buffer) => { log += d.toString(); });
            proc.on('exit', (code) => { if (h.sock) { /* server died */ } });

            if (opts.waitForServer !== false) {
                const t0 = Date.now();
                const timeout = opts.spawnTimeout ?? 30000;
                while (log.indexOf('EMULATOR SERVER') < 0) {
                    if (Date.now() - t0 > timeout) {
                        proc.kill();
                        throw new Error('Server did not reach banner:\n' + log.slice(0, 2000));
                    }
                    await TelnetHarness.sleep(200);
                }
            }
            // Emulation auto-starts in server.ts; give the ROM a moment to boot.
            await TelnetHarness.sleep(1000);
        }

        await h.connect();
        return h;
    }

    /** Connect to an already-running server. */
    static async connect(port = 2324, host = '127.0.0.1'): Promise<TelnetHarness> {
        const h = new TelnetHarness(port, host);
        await h.connect();
        return h;
    }

    private connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            const sock = net.connect(this.port, this.host);
            this.sock = sock;
            sock.on('data', (d: Buffer) => this.handleData(d));
            sock.on('error', reject);
            sock.once('connect', () => resolve());
        });
    }

    async close(): Promise<void> {
        if (this.sock && !this.sock.destroyed) this.sock.destroy();
        this.sock = null;
        if (this.proc) {
            this.proc.kill();
            this.proc = null;
        }
    }

    get isOpen(): boolean { return !!this.sock && !this.sock.destroyed; }

    // ----------------------------------------------------------
    // Sending
    // ----------------------------------------------------------

    /** Send raw text (no CR). */
    send(text: string): void {
        if (!this.sock || this.sock.destroyed) throw new Error('Telnet harness not connected');
        this.sock.write(Buffer.from(text, 'latin1'));
    }

    /** Send text followed by CR (Enter). */
    sendLine(text = ''): void {
        this.send(text + '\r');
    }

    /** Send a single key / control code. */
    key(name: string): void {
        switch (name) {
            case 'enter': case 'cr': case '\r': this.send('\r'); break;
            case 'escape': case 'esc': this.send('\x1b'); break;
            case 'backspace': case 'bs': this.send('\x7f'); break;
            case 'tab': this.send('\t'); break;
            case 'up': this.send('\x1b[A'); break;
            case 'down': this.send('\x1b[B'); break;
            case 'right': this.send('\x1b[C'); break;
            case 'left': this.send('\x1b[D'); break;
            default: this.send(name);
        }
    }

    // ----------------------------------------------------------
    // Reading
    // ----------------------------------------------------------

    /** Readable transcript with telnet/ANSI/control bytes stripped. */
    get transcript(): string { return this._transcript; }

    /** Full readable output so far. */
    readable(): string { return this._transcript; }

    /**
     * Resolve true once `substr` appears in the transcript (case-sensitive),
     * false on timeout.
     */
    async waitFor(substr: string, timeoutMs = 15000): Promise<boolean> {
        const t0 = Date.now();
        while (this._transcript.indexOf(substr) < 0) {
            if (Date.now() - t0 > timeoutMs) return false;
            await TelnetHarness.sleep(150);
        }
        return true;
    }

    /** Like waitFor but returns the new text captured while waiting. */
    async readUntil(substr: string, timeoutMs = 15000): Promise<string> {
        const startLen = this._transcript.length;
        const ok = await this.waitFor(substr, timeoutMs);
        return this._transcript.slice(startLen);
    }

    /** Wait a fixed time. */
    static sleep(ms: number): Promise<void> {
        return new Promise(r => setTimeout(r, ms));
    }
    sleep(ms: number): Promise<void> { return TelnetHarness.sleep(ms); }

    // ----------------------------------------------------------
    // Boot sequence
    // ----------------------------------------------------------

    /**
     * Drive the interactive boot: D= → H1 → MAX DISK → date → time → CRT0 READY.
     * Assumes the emulator is running and the disk is auto-mounted (server does both).
     */
    async boot(opts: BootOptions = {}): Promise<void> {
        const date = opts.date ?? '010180';
        const time = opts.time ?? '120000';
        const timeout = opts.timeout ?? 90000;

        if (!(await this.waitFor('D=', timeout))) {
            throw new Error(`Boot failed: no D= prompt. Transcript:\n${this.transcript}`);
        }
        this.send('H1'); // ROM reads WIPL after H1 (no CR needed)
        if (!(await this.waitFor('MAX DISK', timeout))) {
            throw new Error(`Boot failed: no MAX DISK prompt. Transcript:\n${this.transcript}`);
        }
        this.sendLine(''); // Enter
        if (!(await this.waitFor('MMDDYY', timeout))) {
            throw new Error(`Boot failed: no date prompt. Transcript:\n${this.transcript}`);
        }
        this.sendLine(date);
        if (!(await this.waitFor('HHMMSS', timeout))) {
            throw new Error(`Boot failed: no time prompt. Transcript:\n${this.transcript}`);
        }
        this.sendLine(time);
        if (!(await this.waitFor('CRT0 READY', timeout))) {
            throw new Error(`Boot failed: no CRT0 READY. Transcript:\n${this.transcript}`);
        }
    }

    // ----------------------------------------------------------
    // Telnet protocol handling
    // ----------------------------------------------------------

    private handleData(data: Buffer): void {
        let i = 0;
        while (i < data.length) {
            const b = data[i++];
            if (b === IAC) {
                if (i >= data.length) break;
                const cmd = data[i++];
                if (cmd === IAC) {
                    this._transcript += '\x00'; // escaped IAC (rare); keep as NUL marker
                } else if (cmd === SB) {
                    if (i >= data.length) break;
                    const opt = data[i++];
                    const subStart = i;
                    while (i < data.length - 1 && !(data[i] === IAC && data[i + 1] === SE)) i++;
                    const sub = data.slice(subStart, i);
                    i += 2; // skip IAC SE
                    this.handleSubnegotiation(opt, sub);
                } else if (cmd === WILL) {
                    if (i >= data.length) break;
                    const opt = data[i++];
                    // Client → server option: accept the useful ones
                    if (opt === OPT_ECHO || opt === OPT_SUPPRESS_GA || opt === OPT_TERMTYPE || opt === OPT_NAWS) {
                        this.write([IAC, DO, opt]);
                    } else {
                        this.write([IAC, DONT, opt]);
                    }
                } else if (cmd === WONT) {
                    if (i >= data.length) break;
                    this.write([IAC, DONT, data[i++]]);
                } else if (cmd === DO) {
                    if (i >= data.length) break;
                    const opt = data[i++];
                    if (opt === OPT_ECHO || opt === OPT_SUPPRESS_GA) {
                        this.write([IAC, WILL, opt]);
                    } else if (opt === OPT_TERMTYPE || opt === OPT_NAWS) {
                        this.write([IAC, WILL, opt]);
                        if (opt === OPT_TERMTYPE) {
                            // Server will send SB TERMTYPE SEND next; respond there.
                        }
                    } else {
                        this.write([IAC, WONT, opt]);
                    }
                } else if (cmd === DONT) {
                    if (i >= data.length) break;
                    this.write([IAC, WONT, data[i++]]);
                }
                // Other IAC commands (NOP, AYT, …) ignored
            } else {
                // Regular byte → transcript
                this._transcript += String.fromCharCode(b);
            }
        }
        this._transcript = this.clean(this._transcript);
    }

    private handleSubnegotiation(opt: number, sub: Buffer): void {
        if (opt === OPT_TERMTYPE && sub[0] === 1) {
            // TERMTYPE SEND → advertise "xterm"
            const payload = Buffer.concat([
                Buffer.from([IAC, SB, OPT_TERMTYPE, 0]),
                Buffer.from('xterm', 'ascii'),
                Buffer.from([IAC, SE]),
            ]);
            this.sock?.write(payload);
        } else if (opt === OPT_NAWS && sub.length >= 4) {
            // window size echoed back to us — ignore, we already sent ours
        }
    }

    private write(bytes: number[]): void {
        if (this.sock && !this.sock.destroyed) this.sock.write(Buffer.from(bytes));
    }

    /** Strip ANSI escapes, control bytes, and telnet artifacts from text. */
    private clean(s: string): string {
        s = s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '');   // ANSI CSI
        s = s.replace(/\x1b[()][A-Za-z0-9]/g, '');       // ANSI charset
        s = s.replace(/\x1b/g, '');
        s = s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, ''); // control bytes (keep CR/LF)
        return s;
    }
}
