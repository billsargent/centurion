# Centurion CPU-6 Emulator

An emulator for the **Centurion CPU-6** computer, with a Telnet/WebSocket
server that runs the CPU-6, loads **Hawk** and **Finch** disk packs and disk
images, and drives its native **Centurion CRT** terminals.

Built on the [CenRE](LICENSE.txt) browser emulator (Meisaka Yukara, ©2023) and
wrapped in a headless Node.js core — no browser required.

## Highlights

- **Disk packs & disk images** — mount Hawk (`.IMG`) and Finch (`.FFI`) disk
  packs and images into drives via the disk manager (2326) or the browser UI;
  format and stride are auto-detected from the file.
- **Native terminal emulation** — the server speaks the Centurion CRT protocol
  (cursor addressing, attributes, protected fields, insert/delete), so
  formatted OS screens (`.STA`, editors, forms) render correctly.
- **Telnet + WebSocket server** — control panel (2323), terminals (2324/2325),
  disk manager (2326), and a rich browser frontend (`cen.html`).
- **Documentation** — the reference set in [`docs/`](docs/README.md) covers
  booting, CENTOS commands, CPL, the APLIB library, and the DEBUG utility.

## Quick start

```bash
cd server
npm install
npm run build
npm start
```

Then connect and load a disk:

- **Disk manager** — `telnet localhost 2326`: `[L]` load a disk image into a
  drive, `[N]` create a new blank disk, `[E]` export, `[I]` info, or `[0-7]`
  quick-mount from `server/disks/`.
- **Control panel** — `telnet localhost 2323`: front-panel registers, LEDs,
  and run/halt/step control.
- **Terminal** — `telnet localhost 2324`: CRT 0, the native Centurion CRT.

Drop your own disk images (Hawk `.IMG` / Finch `.FFI`) into `server/disks/`.
If you have an OS disk image, [`docs/BOOTING-CENTOS.md`](docs/BOOTING-CENTOS.md)
documents the full boot procedure.

## Ports & services

| Port | Service | Protocol | What it's for |
|---|---|---|---|
| 2323 | Control panel / console | Telnet | Front-panel registers, LEDs, run/halt/step control |
| 2324 | Terminal 0 (CRT 0) | Telnet | Native Centurion CRT terminal |
| 2325 | Terminal 1 (CRT 1) | Telnet | Second CRT terminal |
| 2326 | Disk manager | Telnet | Load/create/export disk images |
| 42646 | Browser UI | WebSocket | Rich frontend (open `cen.html` → Remote, or `cen-server.html`) |

The server console (`npm start` terminal) accepts `r`(un) `h`(alt) `s`(tep)
`q`(uit) and `reset`.

## Documentation

| Doc | Covers |
|---|---|
| [`docs/BOOTING-CENTOS.md`](docs/BOOTING-CENTOS.md) | Booting CENTOS step by step (requires your own OS disk image) |
| [`docs/CENTOS-COMMANDS.md`](docs/CENTOS-COMMANDS.md) | CENTOS command reference |
| [`docs/CPL-REFERENCE.md`](docs/CPL-REFERENCE.md) | CPL programming language |
| [`docs/APLIB-REFERENCE.md`](docs/APLIB-REFERENCE.md) | APLIB application library |
| [`docs/DEBUG-REFERENCE.md`](docs/DEBUG-REFERENCE.md) | DEBUG runtime debugger |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Codebase architecture |
| [`docs/HARNESS.md`](docs/HARNESS.md) | Driving the OS programmatically |

## Included data

- **Disk images** — `FINCH2.BIN` and `TORI.FFI` data disk packs are committed
  under `server/disks/` (see `server/disks/README.md`). Add your own Hawk
  (`.IMG`) or Finch (`.FFI`) disk images to that folder to load them.
- **CPU6 Programmer's Manual** — the OCR'd full manuals (`01_UTILITY` …
  `05_SYSGEN` + cover) are committed under `CPU6 Programmer Manual/`. The raw
  pre-OCR scans in `Original Scans/` are excluded (redundant, ~160 MB).

## License & attribution

This is a modified/derived work of **CenRE** (Copyright © 2023 Meisaka Yukara)
and is distributed under the **CenRE License** — see [`LICENSE.txt`](LICENSE.txt)
and [`NOTICE.md`](NOTICE.md).
