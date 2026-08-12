# Architecture

How the project is laid out and how the pieces fit together.

## Top-level layout

```
c:\VS Projects\Emu 0.22\
├── cen.html            ← browser UI (buttons, terminals, disk picker)
├── cen-15/18/19/20.html ← older emulator versions
├── cen-server.html     ← browser UI that auto-connects to the server
├── main.css            ← UI styles
├── js/
│   ├── cen.js          ← COMPILED emulator (ground-truth engine, ~15k lines)
│   ├── cen-15..20.js   ← compiled older versions
│   ├── monarch.js      ← Monaco editor (assembler)
│   └── require.js      ← AMD loader used by the emulator
├── src/
│   ├── cen.ts          ← TypeScript SOURCE of the emulator
│   └── monarch.ts
├── server/             ← Node.js Telnet/WebSocket server
│   ├── src/
│   │   ├── server.ts         ← entry point (in-process core path)
│   │   ├── browser-server.ts ← entry point (headless-browser + Telnet) ★
│   │   ├── ws-server.ts
│   │   ├── core/       ← emulation core & bridges
│   │   │   ├── browser-bridge.ts  ← headless Chromium bridge (PROVEN) ★
│   │   │   ├── emulator.ts        ← in-process core wrapper
│   │   │   └── amd-loader.ts      ← loads js/cen.js via eval
│   │   ├── ports/      ← Telnet ports (terminal, control panel, disk mgr)
│   │   ├── telnet/     ← RFC 854 implementation
│   │   └── tests/      ← boot tests, browser tests, telnet-e2e-test.ts ★
│   └── disks/          ← CENTOS_12.IMG, CENTOS_13.IMG
├── shared/             ← shared interfaces (ICCPU, DiskImage, CharDevice, …)
└── docs/               ← THIS documentation
```

## Two ways to run the emulation

### A. In-process Node.js core (`server/src/core/`) — ✅ RECOMMENDED, no Chromium

This is the path `npm start` uses. It boots CENTOS fully to `CRT0 READY` over
Telnet (see `tests/server-e2e-test.ts`) and requires no browser at all.

`amd-loader.ts` reads `js/cen.js` as text, applies string `.replace()` patches,
and `eval()`s it inside a DOM-polyfill sandbox. This gives Node direct access
to `window.cpu` (MCCPU), `window.io_dsk2`, `window.io_mux`, etc.

Key patches (see `amd-loader.ts`):
- `let sense_switch = 0` → `let sense_switch = 10` (S2+S4)
- exposes `window.__runHW` (the `run_hw[]` array)
- exposes `window.__preCPU` (the `mcsetup()` result)
- exposes `window.__cpu6` / `window.__CPU6class` (the CPU6 disassembler, for
  loader-disasm tooling)
- RTC guard for early boot

`emulator.ts` (`CoreEmulator`) drives it with a `setInterval(…, 20)` loop that
mirrors the browser's `run_core`:
- high-speed mode: `hspre()` → `[run_hw_steps(100) + 100×hsstep] × hsr` → `hsend()`

`ports/terminal.ts` binds a Telnet terminal to the MUX as a `CharDevice`.

**Polyfill gotcha (fixed 2026-08-12):** the DOM "black hole" Proxy returned a
*truthy* value for any checkbox `.checked`. In `setupmemory()` this enabled the
`in_diagins` ("diag ROMs") path, which replaced RAM at `0x8000-0xBFFF` with
read-only ROMs. The WIPL memory probe then concluded top-of-RAM = 0x8000 and
put the loader scratch buffer at `0x7D56` instead of `0xED56` — a 0x7000 shift
that made the loader jump into zeroed memory at `0xA07F`. Fixed in
`polyfills.ts` by giving `document.getElementById('diagins')` a real
`{ checked: false }`. The in-process core now boots CENTOS fully (no Chromium).

### B. Headless browser (was RECOMMENDED, `core/browser-bridge.ts`)

Launch real `cen.html` in Puppeteer/headless Chromium, click the actual buttons,
mount the disk on `io_dsk2.units[1]`, hook `muxports[0].write_data` for output,
and call `muxports[0].receive()` for input.

**Proven to boot CENTOS fully to `CRT0 READY`** (see `tests/telnet-e2e-test.ts`).

`browser-server.ts` is the Telnet entry point that uses this engine: it boots the
emulator to `D=`, then bridges a Telnet terminal (port 2324) to the browser MUX
via a `CharDevice` adapter (`BrowserMuxAdapter`).

## Interfaces (`shared/interfaces.ts`)

- `ICCPU` — CPU (step/reset/registers).
- `DiskImage` / `DiskContainer` — `{ type, stride, backing_data, protect, data }`.
- `CharDevice` — what a terminal binds to for `receive`/`can_receive`.
- `DMADevice` / `DMAControl` — DMA source interface.

## Telnet ports

| Port | Purpose |
|---|---|
| 2323 | Front-panel control |
| 2324 | Terminal 0 (CRT 0) |
| 2325 | Terminal 1 (CRT 1) |
| 2326 | Disk manager |
| 42646 | WebSocket browser UI |

## Build & run

```bash
cd server
npm install
npm run build        # tsc
npm start            # starts server — boots CENTOS automatically to D=, then CRT0 READY
```

After `npm start`, telnet to **port 2324** (Terminal 0):
- The server auto-starts emulation and the ROM prints `D=` (replayed to any
  client that connects late via the MUX tap).
- Type `H1`, then answer the date/time prompts → `CRT0 READY`.
- The server console also accepts `r`(un) `h`(alt) `s`(tep) `q`(uit) `reset`.

Run a single boot test with:

```bash
cd server
npx ts-node src/tests/browser-test-v4.ts    # headless browser boot test
npx ts-node src/tests/boot-test-emulator.ts # in-process core boot to MAX DISK
node dist/server/src/tests/server-e2e-test.js  # spawns npm-start server → CRT0 READY (needs build)
```

To **drive the OS after it boots** (run commands like `.STA`, navigate), use the
telnet harness — see [HARNESS.md](./HARNESS.md) and
`server/src/tests/os-console.ts`:
