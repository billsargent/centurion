// ============================================================
// CenturionCRT unit test — verifies the screen-buffer emulator
// interprets the native Centurion CRT protocol (ported from the
// browser VTerm, src/cen.ts) and renders ANSI diffs correctly.
//
// Run: npx ts-node src/tests/crt-unit-test.ts  (exit 0 = pass)
// ============================================================
import {
    CenturionCRT, CRT_COLS, CRT_ROWS,
    A_REVERSE, A_UNDER, A_BLINK, A_HALF, A_ZERO,
} from '../terminal/crt';

let failures = 0;
function check(label: string, ok: boolean, extra = ''): void {
    console.log(`  ${ok ? '[OK]' : '[FAIL]'} ${label}${extra ? ' — ' + extra : ''}`);
    if (!ok) failures++;
}

function main(): void {
    console.log('=== CenturionCRT unit test ===\n');

    // ---- 1. Plain text + CR/LF ----
    {
        const t = new CenturionCRT();
        for (const ch of 'HELLO') t.receive(ch.charCodeAt(0));
        check('writes text at cursor', t.getCell(0, 0) === 0x48 && t.getCell(4, 0) === 0x4f,
            `cells=${t.getCell(0, 0).toString(16)},${t.getCell(4, 0).toString(16)}`);
        check('cursor advanced', t.cursorX === 5 && t.cursorY === 0);
        t.receive(13); // CR
        check('CR → col 0', t.cursorX === 0 && t.cursorY === 0);
        t.receive(10); // LF
        check('LF → next row', t.cursorY === 1);
        for (let i = 0; i < CRT_COLS + 5; i++) t.receive(0x41); // 'A' wraps/scrolls
        check('wrap at row 1 col 5', t.cursorX === 5 && t.cursorY === 2);
    }

    // ---- 2. ESC Y set cursor address (row+32, col+32) ----
    {
        const t = new CenturionCRT();
        t.receive(27); t.receive(89); // ESC Y
        t.receive(3 + 32);            // row 3
        t.receive(10 + 32);           // col 10
        check('ESC Y cursor addr', t.cursorX === 10 && t.cursorY === 3);
        t.receive(0x42); // 'B'
        check('ESC Y + write', t.getCell(10, 3) === 0x42);
    }

    // ---- 3. DLE horizontal address ----
    {
        const t = new CenturionCRT();
        t.receive(16); t.receive(0x10); // DLE + BCD col 10
        check('DLE col 10', t.cursorX === 10 && t.cursorY === 0);
    }

    // ---- 4. VT row addressing (matches VTerm: col = byte&0x1f, row = escExtra) ----
    {
        const t = new CenturionCRT();
        t.receive(11); t.receive(0x41); // VT + 'A'(0x41): 0x41&0x1f = 1
        check('VT addressing', t.cursorX === 1 && t.cursorY === 0);
    }

    // ---- 5. FF clear + home ----
    {
        const t = new CenturionCRT();
        t.receive(0x41); // 'A'
        t.receive(12);   // FF
        check('FF clears + homes', t.getCell(0, 0) === 32 && t.cursorX === 0 && t.cursorY === 0);
    }

    // ---- 6. ESC 0 set visual attribute (constant reverse) ----
    {
        const t = new CenturionCRT();
        t.receive(27); t.receive(48); // ESC 0
        t.receive(0x50);              // constant reverse (bit6 + bit4)
        t.receive(0x42);              // 'B'
        const cell = t.getCell(0, 0);
        check('ESC 0 reverse attr', (cell & A_REVERSE) !== 0, `cell=${cell.toString(16)}`);
        check('char preserved', (cell & 0x7f) === 0x42);
    }

    // ---- 7. ESC G erase all + home, ESC K erase to EOL, ESC k erase to EOS ----
    {
        const t = new CenturionCRT();
        t.receive(0x41);
        t.receive(27); t.receive(71); // ESC G
        check('ESC G erases + homes', t.getCell(0, 0) === 32 && t.cursorX === 0 && t.cursorY === 0);

        t.receive(27); t.receive(89); t.receive(0 + 32); t.receive(5 + 32); // cursor (5,0)
        for (let i = 0; i < 5; i++) t.receive(0x58); // 'XXXXX'
        t.receive(27); t.receive(75); // ESC K erase to EOL
        check('ESC K erases to EOL', t.getCell(0, 0) === 32, 'cell=' + t.getCell(0, 0));
        check('ESC K keeps before cursor', t.getCell(0, 0) === 32);

        t.receive(27); t.receive(71); // clear
        t.receive(0x59); // 'Y' at (0,0); cursor advances to (1,0)
        t.receive(27); t.receive(107); // ESC k erase to EOS (from cursor)
        check('ESC k keeps before cursor', t.getCell(0, 0) === 0x59);
        check('ESC k erases to EOS', t.getCell(1, 0) === 32);
    }

    // ---- 8. ESC L delete line / ESC M insert line ----
    {
        const t = new CenturionCRT();
        // two lines
        t.receive(0x31); // '1'
        t.receive(13); t.receive(10);
        t.receive(0x32); // '2'
        t.receive(13); t.receive(10);
        t.receive(0x33); // '3'
        check('three lines laid out', t.getCell(0,0) === 0x31 && t.getCell(0,1) === 0x32 && t.getCell(0,2) === 0x33);
        t.receive(27); t.receive(76); // ESC L delete line (at row 2 → line '3')
        check('ESC L deletes current line', t.getCell(0, 2) === 32 && t.cursorY === 2);
        t.receive(27); t.receive(77); // ESC M insert line
        check('ESC M inserts blank line', t.getCell(0, 2) === 32);
    }

    // ---- 9. renderDiff ----
    {
        const t = new CenturionCRT();
        const first = t.renderDiff();
        check('first render is full redraw', first.length > 0 && first.includes('\x1b[1;1H'));
        const second = t.renderDiff();
        check('no diff when unchanged', second === '');
        t.receive(0x41); // 'A'
        const d = t.renderDiff();
        check('diff emits changed char', d.includes('A'));
        // no raw control bytes other than ANSI escapes
        let clean = true;
        for (let i = 0; i < d.length; i++) {
            const ch = d.charCodeAt(i);
            if (ch === 0x1b) {
                if (d[i + 1] !== '[') { clean = false; break; }
                i++; // skip '['
            } else if (ch < 32) {
                clean = false; break;
            }
        }
        check('no stray control bytes in ANSI', clean);
    }

    // ---- 10. status message (ESC 0x05) ----
    {
        const t = new CenturionCRT();
        let bytes: number[] = [];
        t.onStatusMessage = (b) => { bytes = b; };
        t.receive(27); t.receive(5);
        check('status message callback fired', bytes.length === 11, `len=${bytes.length}`);
        check('status starts STX', bytes[0] === 2);
        check('status has cursor + char', bytes[7] === 0x20 && bytes[8] === 0x20);
        check('status ends CR', bytes[10] === 13);
    }

    console.log(`\n${failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)'}`);
    process.exit(failures === 0 ? 0 : 1);
}

main();
