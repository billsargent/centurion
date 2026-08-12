// Diagnostic: search the CENTOS disk image for known strings to map
// which sectors contain the loader's sign-on code.
import * as fs from 'fs';
import * as path from 'path';

const DISK = path.resolve(__dirname, '..', '..', 'disks', 'CENTOS_13.IMG');
const buf = fs.readFileSync(DISK);
console.log(`Disk size: ${buf.length} bytes (0x${buf.length.toString(16)})`);

// Dump the first loader sectors the WIPL reads (0xE, 0x10, 0x30) to inspect
// the relocation table / base values.
for (const sec of [0x000E, 0x0010, 0x0030]) {
    const off = sec * 512;
    console.log(`\nSector 0x${sec.toString(16)} @ file 0x${off.toString(16)} (first 96 data bytes):`);
    let hex = '';
    for (let i = 0; i < 96; i++) hex += buf[off + i].toString(16).padStart(2, '0') + ' ';
    console.log('  ' + hex);
    // printable view
    let txt = '';
    for (let i = 0; i < 96; i++) { const c = buf[off + i] & 0x7f; txt += (c >= 32 && c < 127) ? String.fromCharCode(c) : '.'; }
    console.log('  ' + txt);
}
const consts = [
    { name: '0xED56 LE', bytes: [0x56, 0xED] },
    { name: '0x7D56 LE', bytes: [0x56, 0x7D] },
    { name: '0xED56 BE', bytes: [0xED, 0x56] },
    { name: '0x7D56 BE', bytes: [0x7D, 0x56] },
];
for (const c of consts) {
    const needle = Buffer.from(c.bytes);
    let idx = 0, count = 0;
    while (true) {
        idx = buf.indexOf(needle, idx);
        if (idx < 0) break;
        const sector = Math.floor(idx / 512);
        const inSec = idx % 512;
        if (count < 20) {
            console.log(`"${c.name}" @ file 0x${idx.toString(16)} = sector 0x${sector.toString(16)}, data+0x${inSec.toString(16)}`);
        }
        count++;
        idx += 1;
    }
    console.log(`  -> total ${count} hits`);
}

// stride 512; each sector's data is 400 bytes at file offset sector*512
const STRIDE = 512;
const DATA_LEN = 400;

// Build search needles: plain, bit7-set (attribute bit), and both-case
function variants(s: string): Buffer[] {
    const out: Buffer[] = [];
    out.push(Buffer.from(s, 'ascii'));
    out.push(Buffer.from(s.toUpperCase(), 'ascii'));
    out.push(Buffer.from(s.toLowerCase(), 'ascii'));
    // bit 7 set on each char
    out.push(Buffer.from([...s].map(ch => (ch.charCodeAt(0) & 0x7f) | 0x80)));
    return out;
}

const targets = [
    'LOS 7.1 - E', 'WELCOME TO THE CENTURION', 'MAX DISK', 'SYSTEM DISK',
    'DOS 7.1', 'CRT0', 'LOS 7', 'WELCOME', 'CENTURION', 'H1', 'D=',
];

for (const t of targets) {
    const needles = variants(t);
    let any = false;
    for (const needle of needles) {
        let idx = 0;
        while (true) {
            idx = buf.indexOf(needle, idx);
            if (idx < 0) break;
            any = true;
            const sector = Math.floor(idx / STRIDE);
            const inSector = idx % STRIDE;
            const where = inSector < DATA_LEN ? `data+0x${inSector.toString(16)}` : `(post-data +0x${(inSector - DATA_LEN).toString(16)})`;
            const tag = needle.length > 0 && (needle[0] & 0x80) ? '[bit7]' : '';
            console.log(`"${t}" ${tag} @ file 0x${idx.toString(16)} = sector 0x${sector.toString(16)} (${sector}), ${where}`);
            idx += 1;
        }
    }
    if (!any) console.log(`"${t}" — NOT FOUND`);
}
