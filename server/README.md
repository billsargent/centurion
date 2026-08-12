# Centurion CPU-6 Emulator Server

## Overview

This is the **hybrid Telnet/WebSocket server** for the Centurion CPU-6 emulator.
It runs the emulation core in Node.js and exposes:

| Service | Port | Protocol | Description |
|---|---|---|---|
| Control Panel | 2323 | Telnet | Front panel registers, LEDs, run/halt status |
| Terminal 0 | 2324 | Telnet | CRT 0 — native Centurion CRT terminal |
| Terminal 1 | 2325 | Telnet | CRT 1 — native Centurion CRT terminal |
| Disk Manager | 2326 | Telnet | Disk image load/create/export |
| Browser UI | 42646 | WebSocket | Rich browser frontend (connect `cen.html`) |

## Quick Start

```bash
cd server
npm install
npm run build
npm start
```

Then connect:
- **Telnet**: `telnet localhost 2323` (control panel) or `telnet localhost 2324` (terminal)
- **Browser**: Open `../cen.html`, click the **Remote** button (or open `../cen-server.html` for auto-connect)

## Architecture

```
┌─────────────────────────────────────────────┐
│              Node.js Server                  │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐ │
│  │ Telnet   │  │ Telnet   │  │ Telnet    │ │ │
│  │ :2323    │  │ :2324/5  │  │ :2326     │ │ │
│  │ Control  │  │ Terminals│  │ Disk Mgr  │ │ │
│  │ Panel    │  │          │  │           │ │ │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘ │
│       │              │              │        │
│  ┌────┴──────────────┴──────────────┴─────┐ │
│  │         Core Emulator                   │ │
│  │   CPU · Memory · DSK2 · Finch · MUX    │ │
│  └──────────────────┬─────────────────────┘ │
│                     │                        │
│  ┌──────────────────┴─────────────────────┐ │
│  │     WebSocket Server :42646             │ │
│  │     (Browser UI protocol)               │ │
│  └──────────────────┬─────────────────────┘ │
└─────────────────────┼───────────────────────┘
                      │
              ┌───────┴────────┐
              │  Browser UI     │
              │  (cen.html)     │
              │  Optional rich  │
              │  monitoring     │
              └────────────────┘
```

## Server Console Commands

When running the server, use these commands:

```
CEN> s       — Single step the CPU
CEN> r       — Run continuous emulation
CEN> h       — Halt emulation
CEN> reset   — Reset CPU
CEN> q       — Quit server
```

## Status

**The Telnet/WebSocket infrastructure is complete.** The CPU core is currently
a stub. To enable full emulation, extract the `MCCPU`, `Backplane`, and device
classes from `src/cen.ts` into the `server/src/core/` directory.

### What Needs Extraction (from `src/cen.ts`)

| Component | Lines | Dependencies |
|---|---|---|
| `MCCPU` (ICCPU) | 4067-4140 | `Backplane`, microcode engine |
| `Backplane` (MemAccess) | 3644-3840 | Memory devices, IOAccess |
| `SysMem`, `ROM512`, `ROM2k`, `RAM2k` | 8758-8830 | None (pure) |
| `DSK2`, `DSK2Unit` | 7039-7424 | `DiskImage`, DMA |
| `FinchFloppyControl`, `FinchUnit` | 7478-8184 | `DiskImage`, DMA, Run |
| `MUXPort`, `MMIOMux` | 8464-8700 | `CharDevice` |
| Microcode engine (`step`, `hsstep`, etc.) | 4200-5440 | ALU, Sequencer |
| `ALU8`, `Sequencer`, `Sequencer8X02` | Before 4200 | None (pure) |

The extracted core should implement the interfaces in `../../shared/interfaces.ts`.

## Telnet Protocol Notes

The Telnet server implements minimal RFC 854 negotiation:
- WILL/WONT/DO/DONT for ECHO, SUPPRESS_GO_AHEAD
- Terminal type detection (DO TERMTYPE)
- Window size detection (DO NAWS)

VT100 escape codes are used for the control panel and terminal rendering.
See `src/telnet/ansi.ts` for the ANSI helpers.
