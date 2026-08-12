# OS Control Harness (Telnet)

A reusable client I use to **connect to the running Centurion OS and drive it**
— boot CENTOS, send commands, wait for prompts, capture transcripts. Use this
whenever you need to do something inside the OS rather than just booting it.

## Files

- `server/src/telnet/harness.ts` — `TelnetHarness` class (the reusable client).
- `server/src/tests/os-console.ts` — scriptable CLI on top of the harness.

## Quick start

```bash
cd server
npm run build                                   # harness spawns the compiled server
npx ts-node src/tests/os-console.ts --cmd ".STA"   # boot → CRT0 READY → run .STA
```

Output includes the boot transcript and the command's response (e.g. the
`STATUS DISPLAY REV 7.13` screen with RAM/volume/job table).

### CLI options (`os-console.ts`)

| Flag | Meaning |
|---|---|
| `--cmd "<command>"` | Command to run after boot (default `.STA`) |
| `--date MMDDYY` | Boot date (default `010180`) |
| `--time HHMMSS` | Boot time (default `120000`) |
| `--timeout ms` | Boot timeout (default 90000) |
| `--connect` | Attach to an **already-running** server (do not spawn one) |
| `--no-boot` | Skip the boot sequence (attach to a booted OS) |

## Using the harness programmatically

```ts
import { TelnetHarness } from '../telnet/harness';

const h = await TelnetHarness.launch();   // spawns npm-start server + connects
await h.boot();                            // D= → H1 → date → time → CRT0 READY
h.sendLine('.STA');                        // run a command (CR appended)
await h.waitFor('STATUS DISPLAY', 10000);  // wait for a prompt / output
console.log(h.transcript);                 // readable transcript (ANSI stripped)
await h.close();
```

Key API:
- `TelnetHarness.launch({port, host, spawn, spawnTimeout})` — spawn + connect.
- `TelnetHarness.connect(port, host)` — attach to a running server.
- `boot({date, time, timeout})` — drive the interactive boot to `CRT0 READY`.
- `send(text)` / `sendLine(text)` / `key('enter'|'escape'|'up'|…)`.
- `waitFor(substr, timeoutMs)` → `Promise<boolean>`.
- `readUntil(substr, timeoutMs)` → new text captured while waiting.
- `transcript` / `readable()` — ANSI/control-stripped output.
- `close()` — disconnect **and kill the spawned server** (use in `finally`).

## Notes / gotchas

- Requires `npm run build` first (spawns `dist/server/src/server.js`).
- The server auto-starts emulation and auto-mounts `CENTOS_13.IMG` (stride 512,
  sense=10, RTC guard set by `server.ts`'s `emulator.reset()`).
- If a run fails, ALWAYS call `h.close()` (or kill node) — otherwise the
  spawned server keeps port 2324 and later runs connect to a stale instance.
- The terminal is a **native Centurion CRT emulator** (`server/src/terminal/
  crt.ts`), not VT100 — formatted screens (`.STA`, forms, menus) use the
  Centurion cursor-addressing protocol and render correctly over Telnet.
  `transcript`/`readable()` strip the ANSI the emulator emits.
- The harness resolves the compiled server for the `server/dist/` layout (works
  from both ts-node and compiled contexts).
- Output arrives in bursts; screen clears (`FF`/`ESC G`) are rendered as screen
  diffs, and backspace echoes appear during date/time entry.
- `H1` needs **no** trailing CR; date/time fields each need a trailing CR and
  do not auto-advance.

## Example: STATUS DISPLAY (`.STA`)

Captured from a real run:
```
STATUS DISPLAY REV 7.13    SYSTEM DATE: 01/01/80
TOTAL SYSTEM RAM 256K   MAXIMUM TRANSIENT SIZE 18K
OPSYS SIZE 36K   TRANSIENT USED 0.300K   PARTITION SIZES 6K
TRANSIENT USED 14.990%   TRANSIENT ALLOCATED 2K
MEMORY AVAILABLE 212K
  # NAME    DATE   TYPE / SIZE / FLAGS  NUM DEVICE BUF PRI SIZ NAME FLAGS
  0 SOFTERM 01/01/80 HAWK/PERTEC STLWD  1 CRT0 128 6K R
```
