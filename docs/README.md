# Centurion CPU-6 Emulator — Project Documentation

This folder holds hard-won knowledge about the Centurion emulator, the Telnet
server, and how to boot CENTOS. Read these before touching the code — many
hours of debugging are summarized here.

## Files

| File | What it covers |
|---|---|
| [`DISCOVERIES.md`](./DISCOVERIES.md) | Key findings & gotchas (stride bug, sense switches, DMA, MUX) |
| [`BOOTING-CENTOS.md`](./BOOTING-CENTOS.md) | The verified procedure to boot CENTOS |
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
