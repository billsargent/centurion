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

## What's not in this repo

- **Disk images** (`server/disks/*.IMG` etc.) are gitignored — see
  `server/disks/README.md`. Restore them from a backup to run.
- **The CPU6 Programmer's Manual scans** are large copyrighted PDFs kept
  locally (see `docs/CENTOS-COMMANDS.md` for how to re-extract text).

## License & attribution

This is a modified/derived work of **CenRE** (Copyright © 2023 Meisaka Yukara)
and is distributed under the **CenRE License** — see [`LICENSE.txt`](LICENSE.txt)
and [`NOTICE.md`](NOTICE.md).
