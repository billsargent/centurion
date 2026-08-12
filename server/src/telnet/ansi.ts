// ============================================================
// ANSI escape code helpers for Telnet terminal rendering
// ============================================================

export const CSI = '\x1b[';

export enum Color {
    BLACK   = 0,  RED      = 1,  GREEN    = 2,  YELLOW   = 3,
    BLUE    = 4,  MAGENTA  = 5,  CYAN     = 6,  WHITE    = 7,
    BRIGHT_BLACK  = 8,  BRIGHT_RED    = 9,  BRIGHT_GREEN  = 10,
    BRIGHT_YELLOW = 11, BRIGHT_BLUE   = 12, BRIGHT_MAGENTA = 13,
    BRIGHT_CYAN   = 14, BRIGHT_WHITE  = 15,
}

export function cursorHome(): string { return `${CSI}H`; }
export function cursorPos(row: number, col: number): string { return `${CSI}${row};${col}H`; }
export function cursorUp(n: number = 1): string { return `${CSI}${n}A`; }
export function cursorDown(n: number = 1): string { return `${CSI}${n}B`; }
export function cursorForward(n: number = 1): string { return `${CSI}${n}C`; }
export function cursorBack(n: number = 1): string { return `${CSI}${n}D`; }
export function cursorSave(): string { return '\x1b[s'; }
export function cursorRestore(): string { return '\x1b[u'; }
export function cursorHide(): string { return `${CSI}?25l`; }
export function cursorShow(): string { return `${CSI}?25h`; }

export function clearScreen(): string { return `${CSI}2J`; }
export function clearLine(): string { return `${CSI}2K`; }
export function clearToEnd(): string { return `${CSI}0J`; }
export function clearToEndLine(): string { return `${CSI}0K`; }

export function fg(color: Color): string { return `${CSI}38;5;${color}m`; }
export function bg(color: Color): string { return `${CSI}48;5;${color}m`; }
export function ansiReset(): string { return `${CSI}0m`; }
export function bold(): string { return `${CSI}1m`; }
export function dim(): string { return `${CSI}2m`; }
export function underline(): string { return `${CSI}4m`; }
export function blink(): string { return `${CSI}5m`; }
export function reverse(): string { return `${CSI}7m`; }

/** Set scrolling region */
export function scrollRegion(top: number, bottom: number): string {
    return `${CSI}${top};${bottom}r`;
}

/** Enable line wrapping */
export function lineWrap(): string { return `${CSI}?7h`; }
/** Disable line wrapping */
export function noLineWrap(): string { return `${CSI}?7l`; }

// ---- Compound helpers ----

/** Draw a horizontal line across the terminal */
export function hLine(y: number, x: number, width: number, char: string = '─'): string {
    return cursorPos(y, x) + char.repeat(width);
}

/** Draw a box */
export function drawBox(
    y: number, x: number, height: number, width: number,
    title?: string
): string {
    let out = '';
    // Top border
    out += cursorPos(y, x) + '┌' + '─'.repeat(width - 2) + '┐';
    if (title) {
        out += cursorPos(y, x + 2) + ' ' + title + ' ';
    }
    // Sides
    for (let i = 1; i < height - 1; i++) {
        out += cursorPos(y + i, x) + '│';
        out += cursorPos(y + i, x + width - 1) + '│';
    }
    // Bottom
    out += cursorPos(y + height - 1, x) + '└' + '─'.repeat(width - 2) + '┘';
    return out;
}

/** LED-style indicator: bright color if on, dim if off */
export function led(on: boolean, color: Color, label: string): string {
    return (on ? fg(color) + bold() : dim() + fg(Color.BRIGHT_BLACK)) +
        label + ansiReset();
}

/** Multi-level LED (for front panel address/data activity) */
export function ledLevel(activity: number, max: number, label: string): string {
    if (activity > max * 0.75) return bold() + fg(Color.BRIGHT_RED) + label + ansiReset();
    if (activity > max * 0.5)  return fg(Color.RED) + label + ansiReset();
    if (activity > max * 0.25) return fg(Color.YELLOW) + label + ansiReset();
    return dim() + fg(Color.BRIGHT_BLACK) + label + ansiReset();
}

/** Convert a hex number to padded string */
export function hex4(v: number): string {
    return (v & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

export function hex2(v: number): string {
    return (v & 0xFF).toString(16).toUpperCase().padStart(2, '0');
}

export function hex1(v: number): string {
    return (v & 0xF).toString(16).toUpperCase();
}

export function hex5(v: number): string {
    return (v & 0xFFFFF).toString(16).toUpperCase().padStart(5, '0');
}

/** Format a 16-bit value as binary with bits separated */
export function bin16(v: number, group: number = 4): string {
    let s = '';
    for (let i = 15; i >= 0; i--) {
        s += (v & (1 << i)) ? '1' : '0';
        if (i % group === 0 && i > 0) s += ' ';
    }
    return s;
}
