# Booting CENTOS

The verified procedure to boot CENTOS on the CPU-6 emulator (Emu 0.22).
This matches what works in the interactive browser, the headless-browser test,
**and now the in-process `CoreEmulator`** (no Chromium needed — fixed by
correctly polyfilling the `diagins` checkbox, see DEBUGGING-JOURNAL.md).

## Prerequisites

- Disk image: `CENTOS_13.IMG` (or `CENTOS_12.IMG`) — 6,651,904 bytes, **stride 512**.
- Mount it on **DSK2 unit 1** (`io_dsk2.units[1]`).

## Steps (interactive browser)

1. Click **R/F** (`fp_r`) — toggles S4 on (sense bit 8).
2. Click **OpSys** (`fp_l`) — sets S2 on (sense bit 2). (Final sense = 10)
3. Click **100k** (`b_r7`) at the top.
4. Click **RUN/STOP** (`b_run`).
5. Terminal shows `D=` — type `H1` (H then 1). No CR needed.
6. Wait — the ROM reads 14 sectors (WIPL), then:

```
WELCOME TO THE CENTURION!
DOS 7.1 - E
MAX DISK# (M)= 1, SYSTEM DISK (S)= 1
```

7. Hit **Enter**.
8. It prints `PREVIOUS SYSTEM DATE: 08/23/84` then
   `ENTER NEW SYSTEM DATE: MMDDYY` — type the date as **6 digits MMDDYY**
   (e.g. `081226`) followed by **Enter**.
9. It prompts `ENTER SYSTEM TIME: HHMMSS` — type the time as **6 digits
   HHMMSS** (e.g. `120000`) followed by **Enter**.
10. It prints **`CRT0 READY`** — you are fully in the OS.
11. Type `.STA` for a status screen.

### Exact verified transcript (headless, CENTOS_13.IMG)

```
D=H1
LOS 7.1 - E
WELCOME TO THE CENTURION!
DOS 7.1 - E
MAX DISK# (M)= 1, SYSTEM DISK (S)= 1
PREVIOUS SYSTEM DATE: 08/23/84
ENTER NEW SYSTEM DATE: MMDDYY
081226
ENTER SYSTEM TIME: HHMMSS
120000
CRT0 READY
```

Key detail: the `MMDDYY` / `HHMMSS` fields are **6 digits each, terminated by
CR** (they do not auto-advance on the 6th digit).

## Booting diagnostics (diag)

S1 is the boot-mode selector. The boot ROM's first instruction is
`BS1` at `0xFC00`: **S1 ON → `JMP 0x8001` (diag ROM); S1 OFF → normal OS boot.**

To boot diag you additionally need the diag ROMs installed, which the browser
UI (`cen.html`) provides:
1. Check **"Diag ROMs Installed"** (re-runs `setupmemory()`, installing the
   diag ROMs at `0x8000-0x9FFF`).
2. Set the **Diag Select** DIPs (`D8/D4/D2/D1`) and press the diag-run (▼) button
   to latch them into the diag board.
3. Turn **S1 ON** (sense bit 1).
4. Press **RUN**.

The in-process server core keeps diag ROMs **disabled** (that's what lets
CENTOS boot — the diag ROMs would relocate the OS loader), so diag boot is
only available in the browser UI. See `DISCOVERIES.md` §2 for the full sense
switch table.

## Automated / headless equivalent

In headless Chromium (Puppeteer), the same steps translate to:

```js
// 1. Mount disk (stride 512!)
window.io_dsk2.units[1].image = {
  type: 'hawk', filename: 'CENTOS_13.IMG', stride: 512,
  backing_data: bytes.buffer, protect: false, data: new Uint8Array(bytes.buffer),
};

// 2. Sense switches via the real buttons (or set directly)
document.getElementById('fp_r').click();   // R/F  → S4 (bit 8)
document.getElementById('fp_l').click();   // OpSys → S2 (bit 2)
// final sense = 10 (S2 + S4)
document.getElementById('b_r7').click();   // 100k
document.getElementById('b_run').click();  // RUN/STOP

// 3. Wait for D=, then send H, 1 one char at a time (wait for !read_busy)
window.io_mux.muxports[0].receive(0x48);  // 'H'
window.io_mux.muxports[0].receive(0x31);  // '1'
```

## Expected DSK2 command sequence (sanity check)

```
SEEKTZ unit=1                 ← ROM (PC 0xFCA6) recalibrate to track 0
READ   unit=1  (14 sectors)   ← ROM loads WIPL loader
SEEKTZ unit=1                 ← WIPL (PC 0x15C)
SEEK + READ × many            ← CENTOS loader reads OS sectors
  ...  "WELCOME TO THE CENTURION!"
  ...  "MAX DISK# (M)= 1, SYSTEM DISK (S)= 1"
```

If the loader instead loops on `SEEK`/`READ` at PC `0x7FE8`/`0x7FBD` and never
prints `WELCOME`, see the Node.js core notes in
[`DEBUGGING-JOURNAL.md`](./DEBUGGING-JOURNAL.md).

## Diagnostic mode (for contrast)

Diagnostic mode boots with S1 set (sense 11 = S1+S2+S4, or other combos). It
does NOT boot CENTOS — it is the hardware self-test. Don't confuse S1 (diag)
with S2 (OpSys).
