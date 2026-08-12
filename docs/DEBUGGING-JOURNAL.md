# Debugging Journal

Chronological record of the CENTOS boot debugging saga. Kept so we don't
re-tread these paths. Newest findings first.

---

## 2026-08-12 — Terminal adapter: hide Centurion control bytes ✅

The telnet terminal showed Centurion control bytes as literal `<0C>`, `<1B><1C>`,
`<08>`, `<07>`, `<14>` tags. These are **CRT screen-control commands**, not text:
- `0x0C` form feed = clear screen
- `0x1B 0x1C` ESC+FS = 2-byte escape introducer (cursor/attribute)
- `0x08` BS = backspace (OS clearing fields)
- `0x07` BEL, `0x14` DC4 (aux), `0x1A` SUB (cursor up)

Fix (`server/src/ports/terminal.ts` `receive()`): control bytes are now consumed
silently — `0x0C` maps to an ANSI clear-screen, `0x08` to a real backspace,
`0x1B` enters a small ESC-consumption state (command byte, plus an arg byte for
`0x10` DLE / `0x30 '0'` attr), the rest are suppressed. Text passes through
unchanged. Verified with `server/src/tests/terminal-clean-test.ts` (full boot
byte stream → all text present, no `<hex>` tags, exit 0).

---

## 2026-08-12 — Audio spam: "BiquadFilterNode is not defined" ✅

**Symptom:** server console repeatedly logged `[AMD] Uncaught: BiquadFilterNode
is not defined` (many per second).

**Cause:** the VT100 terminal's **BEL (bell, 0x07)** handler in cen.js calls
`wa_setup()` whenever `check_sound.checked` is truthy. The polyfill black-hole
Proxy made `document.getElementById('ck_sound').checked` **truthy** (same bug
class as `diagins`), and `wa_setup()` does `new BiquadFilterNode(...)` /
`new GainNode(...)` / `new OscillatorNode(...)` — none of which existed in the
polyfill. The throw left `wa` undefined, so every subsequent BEL re-threw.

**Fix (`server/src/core/polyfills.ts`):**
- Added the Web Audio node classes to the black-hole list (`BiquadFilterNode`,
  `GainNode`, `OscillatorNode`, `AudioParam`, `AudioBufferSourceNode`, etc.) so
  `wa_setup()` completes without throwing even if it runs.
- The document stub now returns a real `{ checked: false }` for **`ck_sound`**
  too (generalized `checkboxOff` used by both `diagins` and `ck_sound`), so the
  core never attempts audio at all.

**Verified:** `server/src/tests/audio-polyfill-test.ts` — all node classes
defined, a `wa_setup()`-equivalent completes, `ck_sound.checked === false`,
`diagins.checked === false`.

**Lesson (again):** the black-hole Proxy's truthiness silently flips DOM
checkbox flags. `diagins` broke memory (0x7000 shift); `ck_sound` caused audio
spam. Any `document.getElementById(...).checked` read must return a real
boolean in the stub.

---

## 2026-08-12 — Disk-manager mount bug: Hawk stride hard-coded 400 → "stuck at 507" ✅

**Symptom:** user mounts CENTOS_13 via the Disk Manager (2326), sets S2+S4,
runs, and the CPU halts at PC `0x0506` (control-panel shows `ADDRESS: 00507`,
`OP:00:00` = HALT). No OS boot.

**Cause:** `server/src/ports/disk-manager.ts` `mountExisting()` hard-coded
`stride = 400` for Hawk disks. CENTOS_12/13 are 6,651,904 bytes = **stride 512**
(the bug we fixed everywhere else, but this path was missed). Mounting via the
disk manager misaligned every sector past the first → WIPL loaded enough to run
but the OS read failed → HALT at `0x0506` (a HALT in the WIPL's disk routine).

**Also fixed (display):** the Disk Manager showed every drive "empty" even
after auto-mount, because `tryGetRealDisks()`'s stub `set_disk` forwarded to
the real unit without storing locally, and `server.ts` mapped `image: null`.
Now the stub stores the image, `getAllDiskUnits()` returns it, and `server.ts`
passes it through. The manager shows what's actually mounted (incl. auto-mount).

**Fix (disk-manager.ts):** size-detect Hawk stride like everywhere else
(`6651904 → 512`, `5196800 → 400`, else 512).

**Result:** after rebuild + restart, auto-mount is CENTOS_13 stride 512, the
Disk Manager shows it, and CENTOS boots (verified `disk-mount-fix-test.ts`).

---

## 2026-08-12 — `npm start` verified end-to-end: server boots to CRT0 READY ✅

After the `diagins` fix, `npm run build && npm start` now fully works:
the in-process server boots CENTOS to **`CRT0 READY`** over Telnet port 2324
(verified with `server/src/tests/server-e2e-test.ts`, which spawns the real
`node dist/server/src/server.js`, connects a raw TCP client, and drives
`D= → H1 → MAX DISK → date → time → CRT0 READY`).

Two more fixes were needed on the way (both in `server/src/server.ts`):

1. **No `reset()` at startup** — the server constructed `CoreEmulator` but never
   called `reset()`, so the RTC guard stayed off and the ROM boot got disturbed
   (no `D=` prompt). Fixed: `emulator.reset()` after construction (sets
   `__rtcGuard` + sense=10), plus `emulator.start()` to auto-run so `npm start`
   just works (the console `r` command remains, idempotent).

2. **Lost boot output before the terminal connects** — the ROM prints `D=` once
   then waits; if no telnet client is attached yet, the byte is dropped (the
   MUX only forwards to a bound device at that moment). The browser bridge
   avoided this by keeping a history + live listeners; `server.ts` bound the
   terminal directly to `muxports[N]` and lost pre-connect output. Fixed with a
   **MUX tap**: hook `muxports[N].write_data` at module load, buffer into a
   `history`, forward live to `listeners`, and replay history to each terminal
   on connect. (Do NOT also do `muxPort.bind_dev(term)` or output double-delivers.)

Also fixed a pre-existing build break: `src/tests/browser-test.ts` used a stale
`BrowserBridge` API (`onOutput(text)`/`sendKey`) — updated to the current
`onOutput(code)`/`sendText`/sense=10 API so `tsc` passes.

---

## 2026-08-12 — ROOT CAUSE FOUND: `diagins` checkbox polyfill — in-process core now boots ✅

**Symptom:** in-process core stalled at PC `0xA07F` (loader jumped to zeroed
memory) while the browser booted fine.

**How found:** disassembled the WIPL (`server/src/tests/loader-disasm.ts`, uses
the emulator's own `CPU6` disassembler + `server/src/core/loader-disasm.ts`
tooling). The WIPL's **memory-size probe** at `0x016F-0x0183` determines the
"top of memory" X:

```
016f: LD #0x1000, A        ; X = Y = 0x1000
0172: XFR A, X
0173: XFR A, Y
0174: LD [X], AL           ; save mem[X]
0175: LD #-1, BL           ; BL = 0xFF
0177: ST BL, [X]           ; write 0xFF to mem[X]
0178: LD [X], BL           ; read back
0179: BZ → done            ; if readback==0, memory ends here → X is top
017b: ST AL, [X]           ; restore
017c: ADD Y, X             ; X += 0x1000
017e: LD #0xF000, A
0181: SUB X, A
0183: BNZ → 0x0174         ; until X == 0xF000
```

From X, the WIPL derives the loader's DMA scratch base:
```
0185: ST X, [0x033D]
0188: XFR X, B
018a: ADD #0xFD55, B       ; [0x04A0] = X - 0x2AB   ← DMA dest base
0191: ADD #0xFE70, B       ; [0x04A2] = X - 0x43B
0198: ADD #0xFE70, B       ; S = X - 0x5CB (stack)
019e: LD #0xFEE5, B
01a1: ADD X, B             ; [0x02B6] = X - 0x11B
```

| | probe top X | [0x04A0] = DMA base |
|---|---|---|
| Browser | 0xF000 | 0xED55 (→ dest 0xED56) |
| Core (before fix) | 0x8000 | 0x7D55 (→ dest 0x7D56) |

The **0x7000 difference = 0xF000 − 0x8000**, exactly the observed offset.

**Cause:** `setupmemory()` in cen.js has:
```js
if (in_diagins.checked) {           // "diag ROMs" checkbox
    bpl.clearmemory(0x8000, 0x4000);
    bpl.configmemory(0x8000, diag1, 2048); ...  // replaces RAM with ROMs
}
```
`in_diagins = document.getElementById('diagins')`. In the polyfill, the
"black hole" Proxy returned a **truthy value** for `.checked`, so the core
installed read-only diag ROMs over RAM at `0x8000-0xBFFF`. The WIPL probe
then saw no writable RAM above `0x8000` → top = 0x8000 → base 0x7D55. In a
real browser the checkbox defaults to unchecked (`false`), so RAM stayed put.

**Fix:** `server/src/core/polyfills.ts` — provide a real `document` stub whose
`getElementById('diagins')` returns `{ checked: false, ... }`. (Verified:
`server/src/tests/memprobe-test.ts` now reaches top `0xF000`, `[0x04A0]=0xED55`.)

**Result:** `boot-test-emulator.ts` (real `CoreEmulator`, in-process, no
Chromium) now boots CENTOS fully:
```
D=H1 → LOS 7.1 - E → WELCOME TO THE CENTURION! → DOS 7.1 - E
MAX DISK# (M)= 1, SYSTEM DISK (S)= 1      [PASS]
```
DMA destinations now match the browser exactly (`0xED56` for 0x470-0x4CC).
The 0xA07F stall is gone. The in-process core no longer needs Chromium.

**Lesson:** when polyfilling a DOM checkbox, remember `.checked` must be a real
`boolean` — a truthy Proxy silently flips feature flags like "install diag
ROMs". This is the kind of bug that only shows up 90% of the way into a boot
because it shifts a memory base by exactly one power-of-two-minus-chunk.

---

## 2026-08-12 — ROOT CAUSE FOUND: stride 512 vs 400 ✅

**Symptom:** CENTOS booted fine in the interactive browser but crashed/looped
in the Node.js core (and initially in headless tests).

**Cause:** `CENTOS_12.IMG` / `CENTOS_13.IMG` are **6,651,904 bytes** = Hawk
disks with **stride 512**. Every server mount point used `stride: 400`, so the
DSK2 read sector *N* from file offset `N*400` instead of `N*512`. The first
sector loaded, but every subsequent sector was misaligned → the WIPL loader
code past byte 400 was garbage → CPU hit junk at `0x675` and looped.

**Why the browser worked:** its drag-drop handler auto-detects stride by exact
file size (`6651904 → 512`, `5196800 → 400`). Our programmatic mounts bypassed
that detection.

**Fix:** detect stride from file size everywhere:
```js
const stride = file.length === 6651904 ? 512 : file.length === 5196800 ? 400 : 512;
```

**Result:** headless browser boots CENTOS to `MAX DISK# (M)= 1, SYSTEM DISK (S)= 1`.

---

## 2026-08-12 — Full boot to CRT0 READY ✅ (headless browser)

Wired the reusable `BrowserBridge` and walked the whole interactive boot:

- `H1` → `WELCOME` → `MAX DISK# (M)= 1, SYSTEM DISK (S)= 1`
- `CR` → `ENTER NEW SYSTEM DATE: MMDDYY`
- `081226` + `CR` → `ENTER SYSTEM TIME: HHMMSS`
- `120000` + `CR` → **`CRT0 READY`**

Two gotchas fixed along the way:
1. The sense-switch button IDs are `ss1..ss4` (NOT `btn_ss1..btn_ss4` — those
   are the JS variable names). Using the wrong IDs silently left sense=0 and
   the ROM never loaded CENTOS after `H1`.
2. Date/time fields do NOT auto-advance on the 6th digit — each needs a
   trailing CR.

---

## 2026-08-12 — In-process core: major progress, then new stall at 0xA07F

Ported the browser's proven fixes into the in-process Node.js core:

1. stride 512 (size-detect) — already applied to `emulator.ts`/`amd-loader`.
2. sense 10 (S2+S4) — corrected in `emulator.ts` reset() and `amd-loader`.
3. Removed the debug "abort DMA after sector 20" patch from `amd-loader.ts`.
4. Fixed `cpu-real.ts` path resolution (ts-node vs compiled dist) — it was
   resolving `js/cen.js` wrong under ts-node and silently falling back to
   `StubCPU`.

**Result:** `CoreEmulator` (the real server core) now reads the disk correctly —
DSK2 sector sequence matches the browser exactly (0x0000→14 sectors→0x000E→
0x0010→0x0030→0x0470→0x0471→…→0x04CC). This is PAST the original stuck loop
at `0x7FE8`.

**New stall:** after reading sector 0x4CC, the loader jumps to PC `0xA07F`
(level 15) and loops there. Memory dump shows `0xA060-0xA0BF` is **all zeros**
— the loader jumped to unloaded memory (the browser instead prints
`LOS 7.1 - E` and re-reads sector 0x000F). DSK2 status at stall: reg4=0x00
(idle, no error), reg5=0x30 (ready, on-cyl, seek_done=0 — correct after a READ).
RTC guard is NOT the cause (same stall with it disabled).

### ROOT CAUSE (narrowed): DMA scratch-buffer address is 0x7000 too low

Instrumented `dsk2.dma_step` to log the DMA destination (`memaddr`/`physaddr`)
at each sector start:

| Sectors | Browser DMA dest | CoreEmulator DMA dest |
|---|---|---|
| ROM WIPL read (0x1–0xD) | (same base, ~0x0101…) | 0x0291→0x1551 (increments by 400) |
| loader single reads (0xE, 0x10, 0x30) | ~0xED56 | 0x7D56 |
| loader big read (0x470–0x4CC) | **0xED56** | **0x7D56** |

Both are identity-mapped (`physaddr == memaddr`; pgaddr7=0 at stall). So the
loader's **scratch buffer** (it reads each sector into a fixed buffer, then
relocates) is at **0xED56 in the browser vs 0x7D56 in the core — a 14-page /
0x7000 offset**. This shifts every relocated address, so the loader code lands
at 0xA07F+ (browser) vs 0x7FD0 (core), and the core jumps into unloaded (zero)
memory.

Not a page-table bug, not memory size (setupmemory is identical: 128K+124K),
not the RTC guard. The 0x7000 offset originates in the loader's own base /
high-memory computation (needs loader disassembly to pin down).

**Likely source of the base values:** `sector 0x30` contains what looks like a
**relocation/segment table** (`00 0f 80 00`, `00 1f 80 00`, `03 ff 80 00`,
`00 7f 80 00` with page markers `00/10/30/50/70` then `ff ff ff`). The loader
reads this table and relocates code chunks accordingly; interpreting it with a
different base yields the 0x7000-shifted layout. Sector 0x10 holds strings
(`SOFTERM`, `@SLOD0`, `@SDIR0`, `@SUAL0`).

### Tools built for this
- `server/src/tests/disk-search.ts` — find strings/constants in the IMG
  (strings are stored bit-7 set; "LOS 7.1 - E" is in sector 0x4C7).
- `server/src/tests/browser-dump.ts` — dump browser RAM + DMA destinations.
- `server/src/tests/boot-test-emulator.ts` — CoreEmulator PC/DSK2/memory/DMA dump.

---

## Before root cause — headless browser partially booted

With stride 400, the headless browser (using the *real* `b_run` button) showed:
- ROM echoed `D=H1` correctly (MUX works).
- DSK2 issued `SEEKTZ` + `READ` (14 sectors = 5600 bytes @ stride 400).
- Then a second `SEEKTZ` and… nothing. The WIPL was loaded but its code past
  the first 400 bytes was wrong, so it never printed `WELCOME`.

This is what led to inspecting the disk size and finding the stride bug.

---

## Earlier — Node.js core booted to 0x675 then looped

The in-process AMD-loader core with stride 400:
- MUX timing bug fixed (see below) → ROM echoed `D=H1`.
- `SEEKTZ` (ROM) → `READ` → `SEEKTZ` (WIPL at `0x15C`) → then looped at `0x675`
  with **no** further DSK2 commands. Sector 1 (containing `0x675`) was garbage
  due to the stride bug.

With stride 512 (2026-08-12) the Node core gets much further — ROM READ of 14
sectors, WIPL runs, loader issues `SEEK`/`READ` pairs — but **still loops** at
PC `0x7FE8`/`0x7FBD` re-reading the same sector and never prints `WELCOME`.
Not yet root-caused. Suspects:
- DMA termination/`dma_end` timing in the custom `hsstep` loop of the test
  (the test harness's loop does **not** call `hspre`/`hsend` inside the loop
  and ticks `run(1)` once per 50 `hsstep`s, unlike `emulator.ts` which mirrors
  the browser exactly).
- The DMA-after-sector-20 patch in `amd-loader.ts`.

---

## MUX timing bug (FIXED)

**Symptom:** input sent before the MUX was configured produced `ERROR`.

**Cause:** MUX `_bit_len` was 5 before `write_control` ran; `MUX_MASKS[5]` is
`undefined` → input stored as `0x00`.

**Fix:** `ports/terminal.ts` gained a `muxConfigured` flag — set true on first
MUX output, and input is gated until then.

---

## Sense switch confusion (FIXED)

Initially used S1=1 (diagnostic) → that boots the hardware self-test, not
CENTOS. Switches are **1-based**: S1=1, S2/OpSys=2, S3=4, S4/R/F=8.

Correct CENTOS setting is **S2(OpSys)=2 + S4(R/F)=8 = 10**.

(Earlier we believed it was 12 — wrong; 12 is S3+S4, missing OpSys. Corrected
after the headless browser booted with `fp_r`→8 + `fp_l`→2 = 10.)

Also learned `fp_r` (R/F button) is a **toggle** (`sense ^= 8`), so clicking it
on a config that already has sense bit 8 set *disables* S4.

---

## Wrong run button (FIXED)

Automation initially clicked `vc_run` — that's the microcode debugger, not the
emulator loop. The real Run/Stop button is **`b_run`**, which calls
`run_control(0)` → `setInterval(run_core, 20)`.

---

## WebGL CONTEXT_LOST_WEBGL (NON-ISSUE)

User saw `WebGL: CONTEXT_LOST_WEBGL` in the console. It's a tab-focus artifact;
the terminal is on an OffscreenCanvas. Ignore.

---

## Useful debug artifacts

- `server/src/tests/browser-test-v3.ts` — headless boot test that mounts the
  disk, clicks real buttons, logs DSK2 commands, sends `H1`, captures MUX output.
- `server/src/tests/boot-test-v13.ts` — in-process core I/O trace (DSK2/MUX/ROM).
- Earlier versions `boot-test-v10…v14`, `boot-trace`, `boot-sweep`,
  `browser-test`, `browser-test-v2` — historical, mostly superseded.
