# CENTOS Command Reference

A practical command reference for CENTOS (the Centurion OS, "DOS 7.1 - E") as
run in this emulator. Compiled from the **OS's own built-in help** (the HELP
JCL script stored on the boot disk — extract it with
`server/src/tests/help-extract.ts`) and from live probing over Telnet
(`server/src/telnet/harness.ts`). The OS help text itself refers you to the
*CPU6 Programmer's Manual* for the full details; this page is the subset that
matters for driving the emulator.

> The reference manuals lived in `CenturionComputer/`, which was moved out of
> this repo. When you have it back, `docs/` should be extended with the manual
> contents.

## Getting help inside the OS

| Input | What it does |
|---|---|
| `.HELP?` (or `?`) | Runs the built-in **HELP** JCL script: an intro, basic JCL commands, the CED editor, and a CPL example. Pages pause on `PRESS NEWLINE TO CONTINUE` and clear the screen between sections. |
| `.COMMAND` | CPL introduction ("CPL is the preferred method of programming on the Centurion"). |

⚠️ In the emulator the help trigger is state-sensitive (the job stream can be
left in a bad state after other commands). The deterministic way to read the
full help text is `npx ts-node src/tests/help-extract.ts` (decodes it straight
off `CENTOS_13.IMG`).

## Boot sequence

See [`BOOTING-CENTOS.md`](./BOOTING-CENTOS.md) for the full procedure. Short
form:

1. `D=` prompt → type `H1` (no CR).
2. Answer `ENTER NEW SYSTEM DATE: MMDDYY` and `ENTER SYSTEM TIME: HHMMSS`
   (6 digits each, then CR).
3. Prompt becomes `CRT0 READY`. You're in.

## JCL commands (from the built-in help)

Commands are typed at the `CRT0 READY` prompt. Dot-prefixed commands are JCL
(Job Control Language) control statements.

| Command | Meaning (from OS help / probing) |
|---|---|
| `.STA` | **Status display** — RAM size, transient usage, volume/job table (`STATUS DISPLAY REV 7.13`). |
| `.DIR <unit>` | Directory listing of the disk on `<unit>` (e.g. `.DIR 2` = floppy). |
| `.RUN S.XEJECT` | Run a transient — `S.XEJECT` clears the screen. |
| `.NEW <file> <unit> 'A' <size>` | Create a new file, e.g. `.NEW FILE 2 'A' 1S` = 1-sector **ASCII** file. |
| `.DEL <file> <unit>` | Delete a file ("please don't delete system files"). |
| `.LOG` | Log (system log display). |
| `.JOB <name> ABORT=CANCEL` | Job-stream control (the HELP file itself is `.JOB HELP ABORT=CANCEL`). |
| `.USE ...` | Device / SYSRDR assignment (`.USE CRT0 FOR SYSRDR` reassigns the system reader). |
| `.NOLOG` / `.NOTIME` | Suppress log / timestamp on the screen. |
| `@<name>` | Run a transient by name (e.g. `@SCRE0`); errors with `JX13-FILE NOT FOUND` if absent. |

## Editor — CED (Centurion Editor, by Ren)

```
S.CED MYFILE 2 CRT0        # start CED on MYFILE, drive 2, CRT0
# press NEWLINE for no library; press Y to create a new file
```

CED main-menu shortcuts:

| Key | Meaning |
|---|---|
| `Q` | Quit |
| `P` | Print (prompts for begin/end line range) |
| `C` | Change (prompts for line number to change) |
| `D` | Delete (prompts for begin/end line range) |
| `A` | Append (add lines after the last line) |
| `I` | Insert (prompts for line number to insert before) |

## Compiling & running CPL

CPL (Centurion Programming Language) compiles to machine code and produces an
`.EXE`.

```
# 1. Create the source with CED; name it with a leading Z (e.g. ZHELLO)
# 2. One-time: create the transient work file
.NEW @SCRE0 ON # 'E' 1T      # only needs doing once
# 3. Compile (drop the Z — the compiler re-adds it):
P.CPL HELLO # CRT0            # # = drive the ZHELLO source is on
# 4. Run the result:
.RUN XHELLO #                 # # = drive the EXE was saved on
```

The OS help's example program:

```
TITLE 'HELLORLD! IN CPL ON A CENTURION'
SYSTEM ZHELLORLD (MAIN,EXP=D)
FILE CRT:SYSIPT,CLASS=0,SEQ
DEFINE M00:'HELLORLD!'
FORMAT F00:C132
ENTRYPOINT CRT
ENTRY
OPEN IO CRT
WRITE (CRT,F00)M00
STOP 0
END
```

## Common JX errors (observed)

| Code | Meaning |
|---|---|
| `JX 0-CTL STMNT ERROR` | Bad/unknown control statement (a `.command` it doesn't accept). |
| `JX 6-ILLEGAL PHYSICAL UNIT` | Wrong/absent disk unit (e.g. `.DIR` with no disk mounted). |
| `JX13-FILE NOT FOUND` | Transient/file not present. |
| `JX14-FILE TYPE ERROR` | File exists but wrong type (e.g. not ASCII). |
| `JX21-INVALID FILE NAME` | Bad filename. |

## System utility programs

The **CPU6 System Utility Programs** manual (`CPU6 Programmer Manual/`, Vol. 1)
documents the standard utilities. They are run with the usual JCL assignments
(`.USE`/`.NEW`/`.RUN`). Typical invocation:

```
.USE <input file> ON <unit> FOR SYS000 SHAR
.NEW <output file> ON <unit> '<type>' <size>
.USE <output file> ON <unit> FOR SYS001
.RUN X<utility>
```

| Utility | Purpose |
|---|---|
| `XCOPUT` | Copy disk files (SYS000 → SYS001), with record/sector counts on SYSLOG. |
| `XCOPSC` / `XCOPCS` | Copy/convert "A","B","E" files between CPU5 and CPU6. |
| `XCOPCSC` / `XCOPISC` / `XCOP4SC` / `XCOP6SC` | Convert CPU5 "C"-type files (random/spanned, VSI indexed, 4- and 6-byte indexed) to CPU6. |
| `XPCVT` | Generate a JCL jobstream to convert an entire CPU5 disk to CPU6. |
| `XALOCS` | Access/allocate CPU5-formatted disks from a CPU6 system. |
| `XDSORT` | Sort and merge disk-file contents. |
| `XFILMV` | Move files. |
| `XRINT` / `?RINT` | Print/report utility. |
| `XSMCB`, `XTRACE`, `XTRACT` | System maintenance / trace utilities. |
| `XVCOPY` | Volume copy. |
| `XWTAG` / `?WTAG` | Write tags (labels). |
| IBM FORMAT DISKETTE | Format IBM-format diskettes. |
| `@REORG` | Reorganize a file/volume. |
| `XSELREST` | Select/restore files. |
| `XXMIT` / `RECV` | File transfer between systems (purchaseable add-on). |
| `XXNEW` | Create new files. |
| `BISYNC` | Bisync communications (purchaseable add-on). |
| `XKTEST` | Display/make limited changes to VSI indexed files. |
| Streamer Tape / Finch | Tape and Finch-system utilities. |

## Manuals & further reading

- **`CPU6 Programmer Manual/`** (repo root, committed) — OCR'd full manuals:
  01 UTILITY (system utilities), 02 CPL, 03 APLIB (application library),
  04 DEBUG, 05 SYSGEN. Re-extract text with `pypdf`
  (`python -m pip install pypdf`), e.g.:
  ```py
  from pypdf import PdfReader
  for i, p in enumerate(PdfReader("CPU6 Programmer Manual/01_UTILITY_ocr.pdf").pages):
      print(f"=== PAGE {i+1} ===\n{p.extract_text() or ''}")
  ```
- The OS's built-in help is extracted from the boot disk by
  `server/src/tests/help-extract.ts`.
- There is **no dedicated CPU6 Operating System / JCL command manual** in the
  current set — the core command reference is the built-in help above plus the
  JCL usage documented throughout the utility manual.

## `.STA` screen layout (for reference)

```
STATUS DISPLAY REV 7.13    SYSTEM DATE: 01/01/80
TOTAL SYSTEM RAM 256K   MAXIMUM TRANSIENT SIZE 18K
OPSYS SIZE 36K   TRANSIENT USED 0.300K   PARTITION SIZES 6K
TRANSIENT USED 14.990%   TRANSIENT ALLOCATED 2K
MEMORY AVAILABLE 212K
V O L U M E    D I S K    P A R T I T I O N   J O B
  # NAME    DATE   TYPE / SIZE / FLAGS  NUM DEVICE BUF PRI SIZ NAME FLAGS
  0 SOFTERM 01/01/80 HAWK/PERTEC STLWD  1 CRT0 128 6K R
```

(The exact rows depend on the boot date and mounted disks.)
