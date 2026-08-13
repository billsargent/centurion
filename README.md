# Centurion CPU-6 Emulator

An emulator for the **Centurion CPU-6** computer, with a Telnet/WebSocket
server that boots the **CENTOS** operating system and drives its native
**Centurion CRT** terminals.

Built on the [CenRE](LICENSE.txt) browser emulator (Meisaka Yukara, ©2023) and
wrapped in a headless Node.js core — no browser required.

## Highlights

- **Full CENTOS boot** — `D=` → `H1` → date/time → `CRT0 READY`, over plain
  Telnet (no Chromium).
- **Native terminal emulation** — the server speaks the Centurion CRT protocol
  (cursor addressing, attributes, protected fields, insert/delete), so
  formatted OS screens (`.STA`, editors, forms) render correctly.
- **Telnet + WebSocket server** — terminal (2324), control panel (2323), disk
  manager (2326), and a rich browser frontend (`cen.html`).
- **Documentation** — the reference set in [`docs/`](docs/README.md) covers
  booting, CENTOS commands, CPL, the APLIB library, and the DEBUG utility.

## Quick start

```bash
cd server
npm install
npm run build
npm start
```

Then: `telnet localhost 2324` → `H1` → set date/time → `CRT0 READY`.

See [`docs/BOOTING-CENTOS.md`](docs/BOOTING-CENTOS.md) for the full procedure.

## Ports & services

| Port | Service | Protocol | What it's for |
|---|---|---|---|
| 2323 | Control panel / console | Telnet | Front-panel registers, LEDs, run/halt/step control |
| 2324 | Terminal 0 (CRT 0) | Telnet | The main CENTOS terminal (native Centurion CRT) |
| 2325 | Terminal 1 (CRT 1) | Telnet | Second CRT terminal |
| 2326 | Disk manager | Telnet | Load/create/export disk images |
| 42646 | Browser UI | WebSocket | Rich frontend (open `cen.html` → Remote, or `cen-server.html`) |

The server console (`npm start` terminal) accepts `r`(un) `h`(alt) `s`(tep)
`q`(uit) and `reset`.

## Documentation

| Doc | Covers |
|---|---|
| [`docs/BOOTING-CENTOS.md`](docs/BOOTING-CENTOS.md) | Booting CENTOS step by step |
| [`docs/CENTOS-COMMANDS.md`](docs/CENTOS-COMMANDS.md) | CENTOS command reference |
| [`docs/CPL-REFERENCE.md`](docs/CPL-REFERENCE.md) | CPL programming language |
| [`docs/APLIB-REFERENCE.md`](docs/APLIB-REFERENCE.md) | APLIB application library |
| [`docs/DEBUG-REFERENCE.md`](docs/DEBUG-REFERENCE.md) | DEBUG runtime debugger |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Codebase architecture |
| [`docs/HARNESS.md`](docs/HARNESS.md) | Driving the OS programmatically |

## Included data

- **Disk images** — `CENTOS_12/13.IMG` (boot) plus `FINCH2.BIN`/`TORI.FFI`
  data disks are committed under `server/disks/` so a clone boots out of the
  box (see `server/disks/README.md`).
- **CPU6 Programmer's Manual** — the OCR'd full manuals (`01_UTILITY` …
  `05_SYSGEN` + cover) are committed under `CPU6 Programmer Manual/`. The raw
  pre-OCR scans in `Original Scans/` are excluded (redundant, ~160 MB).

## License & attribution

This is a modified/derived work of **CenRE** (Copyright © 2023 Meisaka Yukara)
and is distributed under the **CenRE License** — see [`LICENSE.txt`](LICENSE.txt)
and [`NOTICE.md`](NOTICE.md).
