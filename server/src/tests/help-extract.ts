// ============================================================
// Help extraction — decode the built-in CENTOS HELP file (a JCL
// script stored on the disk with strings bit-7 set). Dumps a
// readable version of the full help so we can build a command
// reference doc.
//
// Run: npx ts-node src/tests/help-extract.ts
// ============================================================
import * as fs from 'fs';
import * as path from 'path';

const DISK = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');
const buf = fs.readFileSync(DISK);

function bit7(s: string): Buffer {
    return Buffer.from([...s].map(ch => (ch.charCodeAt(0) & 0x7f) | 0x80));
}

function findFirst(needle: Buffer): number {
    return buf.indexOf(needle);
}

/** Decode a range: bit-7 stripped, CR/LF -> newline, other control -> ' ' */
function decode(off: number, len: number): string {
    let out = '';
    for (let i = 0; i < len; i++) {
        if (off + i >= buf.length) break;
        const b = buf[off + i] & 0x7f;
        if (b === 0x0a || b === 0x0d) out += '\n';
        else if (b >= 32 && b < 127) out += String.fromCharCode(b);
        else out += ' ';
    }
    return out;
}

// Full help region (HELP JCL script) — spans ~0x1CE100..0x1CF000
const startOff = 0x1cdf00;
const endOff = 0x1cf000;
console.log('===== CENTOS HELP FILE (decoded) =====');
console.log(decode(startOff, endOff - startOff));
console.log('===== STATUS DISPLAY template =====');
const sdOff = findFirst(bit7('STATUS DISPLAY REV 7.13'));
if (sdOff >= 0) console.log(decode(sdOff - 32, 1200));
