// ============================================================
// Telnet server - RFC 854 minimal implementation
// Handles TCP connections, Telnet IAC negotiation, and
// dispatches to port-specific session handlers.
// ============================================================

import * as net from 'net';
import { CSI, cursorHide, cursorShow, clearScreen, cursorHome, ansiReset } from './ansi';

// Telnet protocol constants
const IAC  = 255; // Interpret As Command
const WILL = 251;
const WONT = 252;
const DO   = 253;
const DONT = 254;
const SB   = 250;
const SE   = 240;

// Telnet options
const OPT_ECHO        = 1;
const OPT_SUPPRESS_GA = 3;
const OPT_TERMTYPE    = 24;
const OPT_NAWS        = 31; // Negotiate About Window Size
const OPT_LINEMODE    = 34;

export interface TelnetSession {
    socket: net.Socket;
    termType: string;
    cols: number;
    rows: number;
    write(data: string | Buffer): void;
    writeln(data: string): void;
    close(): void;
    onKey: (key: string, currentBuffer: string) => void;
    onClose?: () => void;
}

export type SessionFactory = (session: TelnetSession) => void;

class TelnetSessionImpl implements TelnetSession {
    socket: net.Socket;
    termType: string = 'unknown';
    cols: number = 80;
    rows: number = 24;
    private buffer: string = '';

    constructor(socket: net.Socket) {
        this.socket = socket;
        this.socket.on('data', (data: Buffer) => this.handleData(data));
        this.socket.on('close', () => this.handleClose());
        this.socket.on('error', (err: Error) => {
            console.error(`Telnet session error: ${err.message}`);
        });
    }

    write(data: string | Buffer): void {
        if (!this.socket.writable) return;
        this.socket.write(data);
    }

    writeln(data: string): void {
        this.write(data + '\r\n');
    }

    close(): void {
        if (!this.socket.destroyed) {
            this.socket.end();
        }
    }

    private sendNegotiation(cmd: number, opt: number): void {
        const buf = Buffer.from([IAC, cmd, opt]);
        this.socket.write(buf);
    }

    private handleNegotiation(cmd: number, opt: number): void {
        switch (cmd) {
            case WILL:
                // Client wants to use this option
                if (opt === OPT_ECHO || opt === OPT_SUPPRESS_GA) {
                    this.sendNegotiation(DO, opt);
                } else if (opt === OPT_TERMTYPE || opt === OPT_NAWS) {
                    this.sendNegotiation(DO, opt);
                } else {
                    this.sendNegotiation(DONT, opt);
                }
                break;
            case WONT:
                this.sendNegotiation(DONT, opt);
                break;
            case DO:
                // Client wants us to use this option
                if (opt === OPT_ECHO) {
                    this.sendNegotiation(WILL, opt);
                } else if (opt === OPT_SUPPRESS_GA) {
                    this.sendNegotiation(WILL, opt);
                } else {
                    this.sendNegotiation(WONT, opt);
                }
                break;
            case DONT:
                this.sendNegotiation(WONT, opt);
                break;
        }
    }

    private handleSubnegotiation(opt: number, data: Buffer): void {
        if (opt === OPT_TERMTYPE && data[0] === 1) {
            // TERMTYPE SEND response
            this.termType = data.slice(1).toString('ascii').toLowerCase();
        } else if (opt === OPT_NAWS) {
            // Window size: cols (2 bytes), rows (2 bytes)
            if (data.length >= 4) {
                this.cols = (data[0] << 8) | data[1];
                this.rows = (data[2] << 8) | data[3];
            }
        }
    }

    private handleData(data: Buffer): void {
        let i = 0;
        while (i < data.length) {
            const b = data[i++];
            if (b === IAC && i < data.length) {
                const cmd = data[i++];
                if (cmd === IAC) {
                    // Escaped IAC byte
                    this.buffer += String.fromCharCode(IAC);
                } else if (cmd === SB) {
                    // Subnegotiation - extract option and data until IAC SE
                    if (i >= data.length) break;
                    const opt = data[i++];
                    const subStart = i;
                    while (i < data.length - 1) {
                        if (data[i] === IAC && data[i + 1] === SE) {
                            break;
                        }
                        i++;
                    }
                    const subData = data.slice(subStart, i);
                    i += 2; // skip IAC SE
                    this.handleSubnegotiation(opt, subData);
                } else if (cmd === WILL || cmd === WONT || cmd === DO || cmd === DONT) {
                    if (i < data.length) {
                        this.handleNegotiation(cmd, data[i++]);
                    }
                }
                // Other IAC commands like NOP, AYT, etc. are ignored
            } else if (b === 127 || b === 8) {
                // Backspace
                this.handleKey('\x7f');
            } else if (b === 13) {
                // CR - handle as Enter. Skip following LF to avoid double-CR.
                this.handleKey('\r');
                // Peek ahead: if next byte is LF, skip it
                if (i < data.length && data[i] === 10) {
                    i++; // consume LF
                }
            } else if (b === 10) {
                // LF alone
                this.handleKey('\n');
            } else if (b >= 32 || b === 9 || b === 27) {
                // Printable, tab, escape
                this.handleKey(String.fromCharCode(b));
            }
        }
    }

    private handleKey(key: string): void {
        this.onKey(key, this.buffer);
    }

    /** Override this in session handlers */
    onKey(key: string, currentBuffer: string): void {
        // Default: echo back and accumulate
        if (key === '\r') {
            this.writeln(this.buffer);
            this.buffer = '';
        } else if (key === '\x7f' || key === '\b') {
            if (this.buffer.length > 0) {
                this.buffer = this.buffer.slice(0, -1);
                this.write('\b \b');
            }
        } else {
            this.buffer += key;
            this.write(key);
        }
    }

    private handleClose(): void {
        // Will be overridden by close handler
    }

    get onClose(): (() => void) | undefined {
        return this._onClose;
    }

    set onClose(handler: (() => void) | undefined) {
        this._onClose = handler;
    }

    private _onClose?: () => void;
}

/**
 * Create a Telnet server on the given port.
 * Each connection gets a session created by the factory.
 */
export function createTelnetServer(
    port: number,
    factory: SessionFactory,
    label: string
): net.Server {
    const server = net.createServer((socket: net.Socket) => {
        const session = new TelnetSessionImpl(socket);

        console.log(`[${label}] Telnet connection from ${socket.remoteAddress}:${socket.remotePort}`);

        // Send initial welcome and initialize terminal
        session.write(clearScreen() + cursorHome() + cursorHide());

        // Negotiate echo (we'll echo locally, client shouldn't)
        session.write(Buffer.from([IAC, WILL, OPT_ECHO]));
        session.write(Buffer.from([IAC, WILL, OPT_SUPPRESS_GA]));

        // Request terminal type and window size
        session.write(Buffer.from([IAC, DO, OPT_TERMTYPE]));
        session.write(Buffer.from([IAC, DO, OPT_NAWS]));

        // Give the client a moment to negotiate, then start
        setTimeout(() => {
            factory(session);
        }, 100);

        socket.on('close', () => {
            console.log(`[${label}] Telnet session closed`);
            if (session.onClose) session.onClose();
        });

        socket.on('error', (err: Error) => {
            console.error(`[${label}] Socket error: ${err.message}`);
        });
    });

    server.listen(port, () => {
        console.log(`[${label}] Telnet server listening on port ${port}`);
    });

    server.on('error', (err: Error) => {
        console.error(`[${label}] Server error: ${err.message}`);
    });

    return server;
}
