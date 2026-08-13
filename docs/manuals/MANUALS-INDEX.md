# CPU6 Programmer's Manual — Markdown Archive

Full transcriptions of the **Centurion CPU-6** manuals as Markdown, so the text
is searchable and readable directly on GitHub. The original OCR'd scans remain
the authoritative page-exact source in `CPU6 Programmer Manual/` (repo root).

## Volumes

| Vol. | Manual | Markdown | PDF (source) | Pages | Covers |
|---|---|---|---|---|---|
| 01 | System Utility Programs | [`01-UTILITY.md`](./01-UTILITY.md) | `01_UTILITY_ocr.pdf` | 136 | COPUT, conversion utilities (COPSC…COP6SC, PCVT, ALOCS), DSORT, FILMV, RINT, VCOPY, @REORG, SELREST, XMIT/RECV, KTEST, tape/Finch |
| 02 | Centurion Programming Language (CPL) | [`02-CPL.md`](./02-CPL.md) | `02_CPL_ocr.pdf` | 197 | CPL language, program control, compiler directives, memory, assignment, functions, file I/O |
| 03 | APLIB Application Library | [`03-APLIB.md`](./03-APLIB.md) | `03_APLIB_ocr.pdf` | 118 | Reusable subroutines: file access, console/file I/O, data manipulation, interjob comms, XMIT/RECV |
| 04 | DEBUG Utility | [`04-DEBUG.md`](./04-DEBUG.md) | `04_DEBUG_ocr.pdf` | 10 | Runtime debugger for CPL/assembly |
| 05 | SYSGEN | [`05-SYSGEN.md`](./05-SYSGEN.md) | `05_SYSGEN_ocr.pdf` | 67 | OS 7.1C system generation/installation |

## Reading notes

- **Page markers** appear as invisible `<!-- page n -->` comments (one per PDF
  page) — handy for cross-referencing against the scans.
- **Search** works across all of these files from GitHub's code search (the
  PDFs themselves are *not* searchable in the repo UI).
- **OCR caveat:** these are OCR-derived transcriptions with a light automatic
  cleanup (mojibake and Markdown-breaking characters removed). Word-level OCR
  errors can still occur — when in doubt, check the corresponding PDF.
- The five **quick references** in this folder's parent (`docs/`), built from
  these manuals, are the cleaner, hand-checked summaries:
  - [`CENTOS-COMMANDS.md`](../CENTOS-COMMANDS.md)
  - [`CPL-REFERENCE.md`](../CPL-REFERENCE.md)
  - [`APLIB-REFERENCE.md`](../APLIB-REFERENCE.md)
  - [`DEBUG-REFERENCE.md`](../DEBUG-REFERENCE.md)

## Regenerating

The Markdown is generated from the OCR PDFs with `make-manual-md.py` at the
repo root (gitignored). See its usage comment at the top.

---

*Copyright © 1979/1983 Centurion Computer Corporation. Reproduced here as part
of this emulator's reference set; the quick references above are original
summaries written for this project.*
