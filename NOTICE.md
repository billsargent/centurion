# NOTICE — Licensing & Attribution

## Project

**Centurion CPU-6 Emulator + Telnet/WebSocket server** ("Emu 0.22").

This repository is a **modified and extended version** of the CenRE (Centurion
RE) emulator. It is distributed under the **CenRE License** — see
[`LICENSE.txt`](./LICENSE.txt), which is included unmodified and must remain
with any redistribution of this software.

> Per CenRE License condition 4, this tree is **plainly marked as a modified /
> derived work** and must **not** be misrepresented as the original CenRE
> software.

## Copyright & origin

- The **CenRE emulator core and browser UI** — `src/cen.ts`, `js/cen.js`,
  `js/cen.js.map`, `src/monarch.ts`, `js/monarch.js`, `js/monarch.js.map`,
  `cen.html`, `cen-server.html`, `main.css`, `seq.svg`, and the shared
  `CharDevice`/emulator interfaces in `shared/` — are derived from **CenRE
  ("Centurion RE"), Copyright (c) 2023 Meisaka Yukara**, licensed under the
  CenRE License (`LICENSE.txt`).
- The **server components** — `server/` (Node.js Telnet/WebSocket server,
  in-process emulation core, runtime patches, test harnesses) and `docs/` —
  are additional original work added to this repository.

No claim is made to have written the original CenRE software, and nothing here
implies endorsement by the copyright holder (CenRE License condition 5).

## Third-party components

| File | Component | License |
|---|---|---|
| `js/require.js` | RequireJS 2.3.6 (AMD loader) | MIT or BSD-3-Clause |
| `js/monarch.js` | Monarch/assembler language definition (part of CenRE) | CenRE License |

## Runtime patches (modified code)

`server/src/core/amd-loader.ts` loads the compiled `js/cen.js` and applies
string-level runtime patches (sense switches, polyfills, exposing internal
APIs). These are modifications of the original CenRE build and are made
explicit here for license transparency. The browser UI (`cen.html`) is the
unpatched build.

## Contact

If any attribution above is incomplete or incorrect, please open an issue in
this repository so it can be corrected.
