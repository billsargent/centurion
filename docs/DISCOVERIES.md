# Discoveries & Gotchas

Curated list of findings. Each one cost real debugging time — respect them.

---

## 1. Disk stride: 512, not 400 (THE root cause of CENTOS boot failure)

**Fact:** `CENTOS_12.IMG` and `CENTOS_13.IMG` are both **6,651,904 bytes**.

The browser UI (`js/cen.js` ~line 14950) auto-detects disk format by exact file
size against this table:

| File size | Kind | stride |
|---|---|---|
| 6,651,904 | hawk | **512** |
| 5,196,800 | hawk | 400 |
| 32,524,800 | finch | FINCH_TRACK |
| 28,072,000 | finch | FINCH_TRACK |
| 35,932,160 | finch | 512 |

So `CENTOS_*.IMG` → **stride 512**. The server code hardcoded `stride: 400`
everywhere, which makes the DSK2 controller read every sector from the wrong
file offset:

```js
// dma_step() in js/cen.js
const fileaddr = this.sel_address * unitdata.stride;  // sector * stride
```

- With stride 400, sector 1 is read from byte 400 instead of byte 512 → the
  WIPL loader code past the first sector is garbage → CPU executes junk at
  `0x675` and loops forever.
- With stride 512, sector 1 is read from byte 512 → correct → CENTOS boots.

**How DSK2 handles stride > 400:** each sector's *data* is still 400 bytes
(`sect_remain = 400` hardcoded). The extra 112 bytes hold metadata: bytes
400–401 = CRC, byte 402 = info flag (`0x43` = has CRC, `0x41` = forced addr
error, `0x46` = format error).

### Correct mount pattern

```js
const stride = file.length === 6651904 ? 512 : file.length === 5196800 ? 400 : 512;
```

---

## 2. Sense switches for CENTOS

Switches are **1-based** in this emulator: S1=1, S2=2, S3=4, S4=8.

CENTOS needs **sense = 10** = S2(OpSys)=2 + S4(R/F)=8.

The front-panel buttons in `cen.html`:
- `fp_r` (R/F) — **TOGGLES** `sense_switch ^= 8` (S4)
- `fp_l` (OPSYS) — **SETS** `sense_switch |= 2` (S2)

The sense-switch buttons (`btn_ss1..btn_ss4`) map to bits 1/2/4/8 and TOGGLE:
- `btn_ss1` = S1 (bit 1)
- `btn_ss2` = S2 (bit 2) — OpSys
- `btn_ss3` = S3 (bit 4)
- `btn_ss4` = S4 (bit 8) — R/F

⚠️ `fp_r` and the `btn_ss*` buttons are **toggles**, not setters. If a saved
browser config already has a bit set, clicking it turns it *off*. When
automating, either use a fresh browser profile (sense starts 0) or check each
button's `active` class before clicking.

**S1 = diagnostic boot selector.** The boot ROM's very first instruction
(physical `0x3FC00`, logical `0xFC00`) is `BS1` (branch on sense switch 1):
- **S1 ON → `JMP 0x8001`** → jumps to the diag ROM at `0x8000`.
- **S1 OFF → normal boot** (loads the WIPL / OS).
Empirically confirmed: with sense=1 or 11 (S1 on) the core never prints `D=`
(no OS boot); with sense=10 (S1 off) CENTOS boots.

| Bit | Switch | Meaning |
|---|---|---|
| 1 | S1 | **Diagnostic boot** (ON → diag ROM at 0x8000) |
| 2 | S2 | OpSys (CENTOS boot) |
| 4 | S3 | ? |
| 8 | S4 | R/F |

**Booting diag** additionally requires the diag ROMs to be installed
(`in_diagins.checked` → `setupmemory()` installs diag1-4 at 0x8000-0x9FFF) and
the Diag Select DIPs (D8/D4/D2/D1) latched via the diag-run button. The
in-process server core keeps `diagins` OFF (so CENTOS boots), so diag boot is
only available in the browser UI (`cen.html`).

For CENTOS: **S2 + S4 = 10**. (Earlier notes said 12 — that was wrong; 12 is
S3+S4, missing OpSys.)

---

## 3. Run button: `b_run`, NOT `vc_run`

In `cen.html`:
- `b_run` → `run_control(0)` → starts the emulator loop (`setInterval(run_core, 20)`).
- `vc_run` → the **microcode debugger** single-step, NOT the emulator loop.

Automating the browser must click `b_run`. Also `b_r7` = 100k speed.

---

## 4. MUX terminal input/output

- Input: `window.io_mux.muxports[0].receive(charCode)`.
- Output: hook `window.io_mux.muxports[0].write_data` — it's called with the
  7-bit char for each byte the ROM/OS writes to the terminal.
- Wait for `read_busy === false` before sending each input char (ROM is
  single-buffered).
- Card-level register writes (`MUX:W:0B E0`) are **unimplemented** and ignored
  identically in browser and Node.js — harmless noise, not a bug.

---

## 5. DMA termination

The CPU ends a disk DMA when its **`workaddr == 0xffff`** (`mco.dma_end = true`
in `hsstep`, `js/cen.js` ~line 5067). `dma_control.read()/write()` increment
`workaddr` per byte (when `count_up`). The DSK2 `dma_step()` then stops at the
next sector boundary.

The browser's first CENTOS read is 14 sectors (`DSK Read S:0000/000D DMA: 5600`).

⚠️ The AMD loader patch that stops DMA after sector 20
(`if ((this.sel_address & 255) > 20) … return`) is a **debug hack** and is
probably wrong for real boots. 14 sectors fits, but don't rely on it.

---

## 6. DSK2 register map

DSK2 lives at `0x3F140–0x3F14F`. `writebyte(addr, value)`:
- addr 0 = unit select
- addr 1 = cylinder high
- addr 2 = cylinder low / sector
- addr 8 = **command register** (READ=0, WRITE=1, SEEK=2, SEEKTZ/rtz=3, VERIFY=4, FORMAT=5)

Status readback (addr 4 = stat hi): busy (0x01), format err (0x10), addr err
(0x20), verify fail (0x40), time err (0x80).
Status (addr 5 = stat lo): seek_done (0x01), ready (0x10), oncyl (0x20), wp (0x80).

Seek completes when `tickbusy()` decrements `busy_time` (SEEK=40) to 0, then
sets `seek_done = true`. The DSK2 `run(increment)` decrements `busy_time` by
**one** per call regardless of `increment`.

---

## 7. Memory map

- RAM: `0x00000–0x3EFFF`
- I/O: `0x3F000–0x3FFFF`
- Bootstrap ROM: `0x3FC00` (1024 bytes)
- DSK2: `0x3F140`
- MUX: `0x3F200–0x3F20F` (ports 0–3)

---

## 8. WebGL "CONTEXT_LOST_WEBGL"

Seen in the user's browser console. It is a **tab-focus artifact**, not an
emulator fault. The emulator's terminal is rendered on an OffscreenCanvas;
WebGL is only for the optional 3D front panel. Safe to ignore.
