// ============================================================
// CenturionCRT — screen-buffer emulation of the Centurion CRT
// terminal protocol.
//
// This is a headless port of the browser VTerm class from
// `src/cen.ts` (CenRE by Meisaka Yukara — see LICENSE.txt and
// NOTICE.md at the repo root). It keeps only cell state (no
// canvas/WebGL); `TelnetTerminal` feeds MUX bytes into
// `receive()` and renders the resulting screen to ANSI via
// `renderDiff()`.
//
// Protocol reference (from src/cen.ts VTerm.receive()):
//   - Display: 80x24 text cells + a 25th status row.
//   - 16-bit cell: bits 0-6 char; 8 half; 9 blink; 10 zero
//     (blank); 12 reverse; 13 underline.
//   - Control codes: NUL ignore, SOH/HT home-bottom, ACK cursor
//     fwd, BEL, BS/NAK back, LF line down (scroll), VT +row addr,
//     FF clear+home, CR col 0, DLE +col addr, DC2/DC4 aux, SUB up,
//     ESC escape.
//   - ESC commands: '0' set vis attr, '1'/'2' line draw on/off,
//     '3'/'4' transparent, 'A' aux baud, 'E'/'e' del char, 'F'/'f'
//     ins char, 'L' del line, 'M' ins line, 'G' erase all+home,
//     'K' erase to EOL, 'O' back tab, 'R' forms mode, 'X'/'x' aux
//     print, 'Y' set cursor addr (row+32 col+32), 'Z' show ctrl,
//     'k' erase to EOS, 's' reset, 0x05 transmit status message.
// ============================================================

import { CSI, cursorPos } from '../telnet/ansi';

export const CRT_COLS = 80;
export const CRT_ROWS = 24;      // text rows (0..23)
export const CRT_ROWB = 23;      // bottom text row
export const CRT_COLUMNR = CRT_COLS - 1; // last column (79)
export const CRT_STATUS = 24;    // status line row (terminal-internal)
export const CRT_MAIN = CRT_COLS * CRT_ROWS;      // main screen cells
export const CRT_CELLS = CRT_COLS * (CRT_ROWS + 1); // incl. status row

// 16-bit cell attribute bits (from src/cen.ts render_cell / VATTR)
export const A_HALF    = 0x0100; // half intensity  (VATTR bit 0 << 8)
export const A_BLINK   = 0x0200; // blink           (VATTR bit 1 << 8)
export const A_ZERO    = 0x0400; // zero (blank)    (VATTR bit 2 << 8)
export const A_REVERSE = 0x1000; // reverse fg/bg   (VATTR bit 4 << 8)
export const A_UNDER   = 0x2000; // underline       (VATTR bit 5 << 8)

const CHAR_MASK = 0x7f;

const INS_NONE = 0;
const INS_CHAR_LINE = 1;
const INS_CHAR_SCREEN = 2;

enum EscMode {
    NORMAL = 0,
    ESC = 1,     // ESC seen; next byte is a command
    SEL_ROW = 2, // ESC Y: waiting for row byte (ESC Y row col)
    SEL_COL = 3, // ESC Y: waiting for col byte
    VTAB = 4,    // VT: waiting for row address byte
    VATTR = 5,   // ESC 0: waiting for attribute byte
    HADDR = 6,   // DLE: waiting for horizontal address byte
}

export interface CenturionCRTOptions {
    /** Also render the 25th (status) row. Default false. */
    renderStatusLine?: boolean;
}

export class CenturionCRT {
    /** 80x25 cell buffer (24 text rows + status row). */
    buffer = new Uint16Array(CRT_CELLS);
    cursorX = 0;
    cursorY = 0;
    charAttr = 0;
    lineDraw = false;
    showCtrl = false;
    charEdit = INS_NONE;
    rts = true;

    /**
     * Called when the host asks the terminal for its status
     * (ESC 0x05 "transmit status message"). The handler should
     * send the returned bytes back to the host (MUX input).
     */
    onStatusMessage: ((bytes: number[]) => void) | undefined;

    private escMode = EscMode.NORMAL;
    private escExtra = 0;
    private statusCode: number[] = [];
    private lastBuffer: Uint16Array | null = null;

    constructor(private opts: CenturionCRTOptions = {}) {
        this.buffer.fill(32); // blank screen
    }

    reset(): void {
        this.buffer.fill(32);
        this.cursorX = 0;
        this.cursorY = 0;
        this.charAttr = 0;
        this.lineDraw = false;
        this.showCtrl = false;
        this.charEdit = INS_NONE;
        this.escMode = EscMode.NORMAL;
        this.escExtra = 0;
        this.lastBuffer = null;
    }

    getCell(col: number, row: number): number {
        if (col < 0 || col >= CRT_COLS) return 0;
        if (row < 0 || row > CRT_STATUS) return 0;
        return this.buffer[row * CRT_COLS + col];
    }

    // ---- internal helpers (ported from VTerm) ----

    private setCell(vca: number, val: number): void {
        this.buffer[vca] = val & 0x7fff;
    }

    private setCursor(col: number, row: number): void {
        if (col < 0) col = 0; else if (col >= CRT_COLS) col = CRT_COLUMNR;
        if (row < 0) row = 0; else if (row >= CRT_ROWS) row = CRT_ROWB;
        this.cursorX = col;
        this.cursorY = row;
    }

    private scroll(): void {
        for (let r = 1; r < CRT_ROWS; r++) {
            const dst = (r - 1) * CRT_COLS;
            const src = r * CRT_COLS;
            for (let c = 0; c < CRT_COLS; c++) this.buffer[dst + c] = this.buffer[src + c];
        }
        const end = CRT_ROWB * CRT_COLS;
        for (let c = 0; c < CRT_COLS; c++) this.buffer[end + c] = 32;
    }

    private advanceLine(): void {
        if (this.cursorY === CRT_ROWB) this.scroll();
        else this.setCursor(this.cursorX, this.cursorY + 1);
    }

    private advanceCursor(): void {
        if (this.cursorX === CRT_COLUMNR) {
            if (this.cursorY === CRT_ROWB) {
                this.setCursor(0, this.cursorY);
                this.scroll();
            } else {
                this.setCursor(0, this.cursorY + 1);
            }
        } else {
            this.setCursor(this.cursorX + 1, this.cursorY);
        }
    }

    private clearScreen(): void {
        for (let q = 0; q < CRT_MAIN; q++) this.setCell(q, 32);
        this.setCursor(0, 0);
    }

    // ---- status message (ESC 0x05) ----

    makeStatus(): void {
        const s = this.statusCode;
        s.length = 0;
        // STX, mode1, sw1, sw2, sw3, err1, err2, curX+0x20, curY+0x20,
        // char under cursor (bit-7 set), CR — mirrors VTerm.make_status()
        s.push(2, 0x50, 0x6b, 0x64, 0x58, 0x40, 0x40);
        s.push(this.cursorX + 0x20, this.cursorY + 0x20);
        s.push(this.buffer[this.cursorY * CRT_COLS + this.cursorX] & CHAR_MASK);
        s.push(13);
    }

    // ---- byte stream entry point (from MUX) ----

    receive(c: number): void {
        c = c & 127;
        const currow = this.cursorY * CRT_COLS;
        const vca = currow + this.cursorX;

        // ---- inside an ESC / addressing sequence ----
        if (this.escMode > EscMode.NORMAL) {
            const lastMode = this.escMode;
            this.escMode = EscMode.NORMAL;
            switch (lastMode) {
                case EscMode.SEL_ROW:
                    this.escExtra = c - 32;
                    this.escMode = EscMode.SEL_COL;
                    return;
                case EscMode.SEL_COL:
                    c -= 32;
                    if (c < CRT_COLS && this.escExtra < CRT_ROWS) this.setCursor(c, this.escExtra);
                    return;
                case EscMode.VTAB:
                    c = c & 0x1f;
                    if (c < CRT_COLS) this.setCursor(c, this.escExtra);
                    return;
                case EscMode.VATTR: {
                    // attribute field bits: 0 1 u r m z b h
                    //   h=half b=blink z=zero(blank) r=reverse u=underline m=prot
                    // Constant field types (bit6 set, mode clear) update char_attr.
                    if ((c & 0x48) === 0x40) {
                        this.charAttr = (c & 0x37) << 8;
                    }
                    return;
                }
                case EscMode.HADDR:
                    c = c & 0x7f;
                    c = ((c >> 4) * 10) + (c & 0x0f);
                    if (c >= CRT_COLS) c -= CRT_COLS;
                    this.setCursor(c, this.cursorY);
                    return;
            }

            // ---- ESC command dispatch ----
            switch (c) {
                case 5: // transmit status message
                    this.makeStatus();
                    if (this.onStatusMessage) this.onStatusMessage(this.statusCode.slice());
                    return;
                case 48: // '0' set visual attribute
                    this.escMode = EscMode.VATTR;
                    return;
                case 49: // '1' begin line drawing
                    this.lineDraw = true;
                    return;
                case 50: // '2' end line drawing
                    this.lineDraw = false;
                    return;
                case 51: case 52: // '3'/'4' transparent begin/end (unimpl)
                    return;
                case 65: // 'A' set aux port baud (unimpl)
                    return;
                case 69: // 'E' delete char inline
                    for (let q = this.cursorX; q < CRT_COLUMNR; q++) this.setCell(currow + q, this.buffer[currow + q + 1]);
                    this.setCell(currow + CRT_COLUMNR, 0x20);
                    return;
                case 101: // 'e' delete char from page
                    for (let q = vca; q < CRT_MAIN - 1; q++) this.setCell(q, this.buffer[q + 1]);
                    this.setCell(CRT_MAIN - 1, 0x20);
                    return;
                case 70: // 'F' insert char inline (toggle)
                    this.charEdit = this.charEdit === INS_NONE ? INS_CHAR_LINE : INS_NONE;
                    return;
                case 102: // 'f' insert char screen (toggle)
                    this.charEdit = this.charEdit === INS_NONE ? INS_CHAR_SCREEN : INS_NONE;
                    return;
                case 76: // 'L' delete line
                    for (let q = currow; q < CRT_MAIN - CRT_COLS; q++) this.setCell(q, this.buffer[q + CRT_COLS]);
                    for (let q = CRT_MAIN - CRT_COLS; q < CRT_MAIN; q++) this.setCell(q, 0x20);
                    this.setCursor(0, this.cursorY);
                    return;
                case 77: // 'M' insert line
                    for (let q = CRT_MAIN - 1; q >= currow + CRT_COLS; q--) this.setCell(q, this.buffer[q - CRT_COLS]);
                    for (let q = currow; q < currow + CRT_COLS; q++) this.setCell(q, 0x20);
                    this.setCursor(0, this.cursorY);
                    return;
                case 71: // 'G' erase all unprotected data + home
                    for (let q = 0; q < CRT_MAIN; q++) this.setCell(q, 32);
                    this.setCursor(0, 0);
                    return;
                case 75: // 'K' erase unprotected cursor->EOL
                    for (let q = this.cursorX; q < CRT_COLS; q++) this.setCell(currow + q, 32);
                    return;
                case 79: // 'O' back tab (unimpl)
                    return;
                case 82: // 'R' enter forms mode (unimpl)
                    return;
                case 88: case 120: // 'X'/'x' print data to aux (unimpl)
                    return;
                case 89: // 'Y' set cursor address (row+32, col+32)
                    this.escMode = EscMode.SEL_ROW;
                    return;
                case 90: // 'Z' show next control code
                    this.showCtrl = true;
                    return;
                case 107: // 'k' erase unprotected cursor->end of screen
                    for (let q = vca; q < CRT_MAIN; q++) this.setCell(q, 32);
                    return;
                case 115: // 's' reset (conversational mode)
                    this.charEdit = INS_NONE;
                    this.lineDraw = false;
                    return;
                default:
                    return;
            }
        }

        // ---- plain control codes ----
        if (this.showCtrl) {
            this.showCtrl = false;
        } else if (c < 32) {
            switch (c) {
                case 0: return; // NUL
                case 1: this.setCursor(0, CRT_ROWB); break; // SOH home-bottom
                case 6: this.advanceCursor(); return; // ACK cursor forward
                case 7: return; // BEL
                case 8: case 21: // BS / NAK cursor back
                    if (this.cursorX > 0) this.setCursor(this.cursorX - 1, this.cursorY);
                    else if (this.cursorY > 0) this.setCursor(CRT_COLUMNR, this.cursorY - 1);
                    else this.setCursor(CRT_COLUMNR, CRT_ROWB);
                    break;
                case 9: this.setCursor(0, CRT_ROWB); break; // HT home-bottom
                case 10: this.advanceLine(); return; // LF
                case 11: this.escMode = EscMode.VTAB; return; // VT + row address
                case 12: this.clearScreen(); return; // FF clear + home
                case 13: this.setCursor(0, this.cursorY); break; // CR
                case 16: this.escMode = EscMode.HADDR; return; // DLE + col address
                case 18: case 20: return; // DC2/DC4 aux (unimpl)
                case 26: // SUB cursor up
                    if (this.cursorY === 0) this.setCursor(this.cursorX, CRT_ROWB);
                    else this.setCursor(this.cursorX, this.cursorY - 1);
                    break;
                case 27: this.escMode = EscMode.ESC; return; // ESC
                default: return;
            }
            return;
        }

        // ---- printable character ----
        let v = c;
        if (this.lineDraw && c >= 64 && c < 108) {
            v = c + 64;
            v = (v & 0xfc) | (this.charAttr & 0xfc00) | ((v << 8) & 0x300);
        } else {
            v = c | this.charAttr;
        }
        if (this.charEdit === INS_CHAR_LINE) {
            for (let q = currow + CRT_COLUMNR; q > vca; q--) this.setCell(q, this.buffer[q - 1]);
        } else if (this.charEdit === INS_CHAR_SCREEN) {
            for (let q = CRT_MAIN - 1; q > vca; q--) this.setCell(q, this.buffer[q - 1]);
        }
        this.setCell(vca, v);
        this.advanceCursor();
    }

    // ---- ANSI rendering ----

    /**
     * Return the ANSI escape stream for cells that changed since the last
     * call (a full-screen redraw on the first call). Returns '' if nothing
     * changed. Rows 0..23 are the OS screen; row 24 (status) is only
     * rendered when `renderStatusLine` is enabled.
     */
    renderDiff(): string {
        const first = this.lastBuffer === null;
        const rows = this.opts.renderStatusLine ? CRT_ROWS + 1 : CRT_ROWS;
        let out = '';

        for (let row = 0; row < rows; row++) {
            const base = row * CRT_COLS;

            // Skip rows with no changes.
            let rowChanged = first;
            if (!rowChanged) {
                for (let col = 0; col < CRT_COLS; col++) {
                    if (this.lastBuffer![base + col] !== this.buffer[base + col]) {
                        rowChanged = true;
                        break;
                    }
                }
            }
            if (!rowChanged) continue;

            // Re-emit the whole row. Emitting full rows (rather than only the
            // changed cells) keeps stripped transcripts coherent — pre-existing
            // spaces between newly written text are preserved, so consumers
            // like waitFor('MAX DISK') and text checks still work.
            out += cursorPos(row + 1, 1);
            let curSgr = '';
            for (let col = 0; col < CRT_COLS; col++) {
                const cell = this.buffer[base + col];
                const sgr = this.sgrFor(cell);
                if (sgr !== curSgr) {
                    out += sgr;
                    curSgr = sgr;
                }
                out += this.charOf(cell);
            }
        }

        if (first) this.lastBuffer = new Uint16Array(CRT_CELLS);
        this.lastBuffer!.set(this.buffer);
        return out;
    }

    private charOf(cell: number): string {
        if (cell & A_ZERO) return ' ';
        const ch = cell & CHAR_MASK;
        if (ch < 32 || ch === 127) return ' ';
        return String.fromCharCode(ch);
    }

    private sgrFor(cell: number): string {
        if (cell & A_ZERO) return `${CSI}0m`;
        const attrs: string[] = [];
        if (cell & A_REVERSE) attrs.push('7');
        if (cell & A_UNDER) attrs.push('4');
        if (cell & A_BLINK) attrs.push('5');
        if (cell & A_HALF) attrs.push('2');
        if (attrs.length === 0) return `${CSI}0m`;
        return `${CSI}0;${attrs.join(';')}m`;
    }
}
