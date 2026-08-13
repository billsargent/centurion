# Centurion CPU-6 Emulator — Project Documentation

This folder holds hard-won knowledge about the Centurion emulator, the Telnet
server, and how to boot CENTOS. Read these before touching the code — many
hours of debugging are summarized here.

## Files

| File | What it covers |
|---|---|
| [`DISCOVERIES.md`](./DISCOVERIES.md) | Key findings & gotchas (stride bug, sense switches, DMA, MUX) |
| [`BOOTING-CENTOS.md`](./BOOTING-CENTOS.md) | The verified procedure to boot CENTOS |
| [`CENTOS-COMMANDS.md`](./CENTOS-COMMANDS.md) | CENTOS command reference (from the OS's built-in help) |
| [`CPL-REFERENCE.md`](./CPL-REFERENCE.md) | CPL programming language quick reference |
| [`APLIB-REFERENCE.md`](./APLIB-REFERENCE.md) | APLIB application subroutine library reference |
| [`DEBUG-REFERENCE.md`](./DEBUG-REFERENCE.md) | DEBUG runtime debugger reference |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | How the codebase fits together |
| [`DEBUGGING-JOURNAL.md`](./DEBUGGING-JOURNAL.md) | Chronological debugging history & dead-ends |

## TL;DR — the one thing that matters most

**`CENTOS_12.IMG` and `CENTOS_13.IMG` are 6,651,904 bytes = Hawk disks with
`stride: 512`, NOT `stride: 400`.**

Everything in the server originally mounted them with `stride: 400`, which
misaligns every sector after the first and makes CENTOS crash/loop. The
browser UI auto-detects stride from file size and that is why it always worked
in the browser while the Node.js core never did.

```js
// Correct mount:
const stride = file.length === 6651904 ? 512 : file.length === 5196800 ? 400 : 512;
dsk2.units[1].image = { type: 'hawk', stride, backing_data: buf, protect: false, data: new Uint8Array(buf) };
```

## Current status (2026-08-12)

- ✅ Headless Chromium (Puppeteer) **fully boots CENTOS to `CRT0 READY`**.
- ✅ **Telnet end-to-end verified**: `browser-server.ts` exposes the browser MUX
  on `telnet localhost 2324`; the user drives the interactive boot
  (`H1` → `MAX DISK` → date `MMDDYY` → time `HHMMSS` → `CRT0 READY`).
- ✅ **Native Centurion CRT terminal**: `server/src/terminal/crt.ts` emulates
  the Centurion CRT protocol (cursor addressing, attributes, clear/erase,
  insert/delete, status message) headlessly and renders to ANSI over Telnet.
  Verified: full boot to `CRT0 READY` and formatted `.STA` status display
  (`server-e2e-test.js`, `crt-unit-test.ts`, `terminal-clean-test.ts`,
  `os-console.ts`).
- ✅ **Git repo**: the tree is under version control (see `git log`). Disk
  images are gitignored (see `server/disks/README.md`).
- 🔶 The in-process Node.js core (`server.ts`) now **reads the disk correctly**
  (stride 512 + sense 10 + DMA hack removed) and gets past the old `0x7FE8`
  loop, but **stalls at PC `0xA07F`** (loader jumps to unloaded zero memory)
  right after reading sector `0x4CC`. Not yet root-caused.

### Run it

```bash
cd server
npx ts-node src/browser-server.ts   # then: telnet localhost 2324
```

Run the automated end-to-end test:

```bash
cd server
npx ts-node src/tests/telnet-e2e-test.ts
```

## License & attribution

This repository is a **modified/derived work** of the CenRE emulator and is
distributed under the **CenRE License** (see [`LICENSE.txt`](../LICENSE.txt)
and [`NOTICE.md`](../NOTICE.md) at the repo root).

- **Emulator core & browser UI** (`src/`, `js/`, `cen.html`, `cen-server.html`,
  `main.css`, `shared/`) — derived from **CenRE, Copyright (c) 2023 Meisaka
  Yukara**.
- **Server & docs** (`server/`, this folder) — original additions in this
  repository.

Per the CenRE license, this modified version is plainly marked as such and is
not represented as the original software.
