# APLIB Application Library Reference

**APLIB** is the CPU-6 application subroutine library — a `Type E` file of
reusable subroutines you link into CPL programs. Compiled from the **CPU6
Programmer's Manual, Vol. 3** (`CPU6 Programmer Manual/03_APLIB_ocr.pdf`, 118
pp., Centurion Computer Corp ©1983; committed to this repo).

## How APLIB works

A subroutine is added to your program at link time when you (a) name it in an
`EXTERNAL` statement and (b) `CALL` it somewhere in the CPL source. Some
subroutines also expose **entrypoints** (usable only if the main subroutine was
referenced and called).

> ⚠️ Some routines are marked "**WARNING: THIS SUBROUTINE IS FOR SUPPORT**" —
> they exist for existing CPU-4/5 applications. Don't use them for new
> development unless you need CPU-4/5 compatibility.

## Typical pattern (indexed file)

```
EXTERNAL CGET, GETK, GETR, STAT, NEWK, CLREC, PUTR

CALL CGET (M05,F01,CUST)        ; prompt: "enter customer number"
CALL GETK (MASTER,CUST)         ; is it on file?
CALL STAT (1)                   ; check the access
CALL GETR (MASTER,MSTREC)       ; read the record
...
CALL NEWK (MASTER,CUST)         ; create a new index entry
CALL CLREC (MSTREC)             ; prepare the record area
CALL PUTR (MASTER,MSTREC)       ; write the record to the file
CALL STAT (1)                   ; check the access
```

## Subroutines by section

### File access (indexed files)

| CALL | Purpose |
|---|---|
| `CALL DOTUSE (A, B, C, D)` | Assign a file or device to a unit from within the program (like the `.USE` JCL command). |
| `CALL GETK (file-name, variable-name)` | Find & read an index record by key (4- or 6-byte integer, or 7–35 char string). **Modern replacement** for GETKEY/?GKEY. |
| `CALL NEWK (file-name, variable-name)` | Write a record into the index area (create new index entry). Replaces NEWKEY/?NKEY. |
| `CALL NEXK (file-name, variable-name)` | Retrieve the next index record (sequential key access). |
| `CALL DELK (file-name, variable-name)` | Find and free a data record (delete its index entry). |
| `CALL GETKEY (file-name, integer-name)` | Indexed read with a 4-byte key (CPU-4/5 compat). |
| `CALL NEWKEY (file-name, integer-name)` | Indexed write with a 4-byte key (CPU-4/5 compat). |
| `CALL ?GKEY (file-name, integer-name)` | Indexed read with a 6-byte key. |
| `CALL ?NKEY (file-name, integer-name)` | Indexed write with a 6-byte key. |
| `CALL STAT (n)` | Check `STATUS` after an I/O call; on error, print a message, set the completion code and stop. |
| `CALL IOERR` | Error-handling entrypoint (provided by STAT). |

### Console I/O

| CALL | Purpose |
|---|---|
| `CALL CGET (string-name, format-name, variable-name)` | Read from the console with a prompt message (`CALL CGET ('enter 1 for file 1…', F01, option)`). |
| `CALL ?NGET (string-name, integer-name)` | Numeric console input (6-byte integer). |
| `CALL NGET (string-name, integer-name)` | Numeric console input (4-byte integer). |
| `CALL YNGET (string-name)` | Yes/no console input. |
| `CALL MSG (string-name)` | Display a message on the console. |
| `CALL MSGN (string-name)` | Display a message followed by a newline. |
| `CALL LFEED (file-name, number)` | Line feed(s). |
| `CALL CLREOL (H, V)` | Clear to end of line. |
| `CALL CLREOP (H, V)` | Clear to end of page. |

### File I/O (records)

| CALL | Purpose |
|---|---|
| `CALL GETR (file-name, record-name)` | Read a record into the record area. |
| `CALL PUTR (file-name, record-name)` | Write the record area to the file. |
| `CALL HLDR (file-name)` | Hold a record so it isn't overlaid. |
| `CALL FRER (file-name)` | Free a held record. |

### Data manipulation

| CALL | Purpose |
|---|---|
| `CALL ?EDIT (integer-name, string-1, string-2)` | Convert a 6-byte integer to a (formatted) string. |
| `CALL EDIT (integer-name, string-1, string-2)` | Convert a 4-byte integer to a (formatted) string. |
| `CALL CLREC (record-name)` | Clear/initialize a record data area. |
| `CALL MVFILE (file-1, file-2)` | Move a file definition (re-assign a file's SYS unit). |
| `CALL MVREC (record-1, record-2)` | Copy data between record areas. |
| `CALL UC (string-name)` | Convert a string to upper case. |
| `CALL LC (string-name)` | Convert a string to lower case. |
| `CALL BLTRUN (string-name)` | Blank-truncate a string. |
| `CALL STRLEN (string-name, integer-name)` | Length of a string. |
| `CALL FILL (string-1, number, string-2)` | Fill/format a string. |
| `CALL NOSIGN (string-name)` | Strip a sign character. |

### Interjob communication / system blocks

| CALL | Purpose |
|---|---|
| `CALL GJP (parameter-number, string-name)` | Get a job parameter. |
| `CALL PJP (number, string-name)` | Set a job parameter. |
| `CALL GETJP (parameter-number, string-name)` / `CALL PUTJP (number, string-name)` | Job-parameter access variants. |
| `CALL GUPSI (integer-name)` / `CALL PUPSI (number)` | Get/put partition status info. |
| `CALL VOLNAM (file-name, string-name)` | Get the volume name of a file's unit. |
| `CALL GETTIB (length, offset, result)` | Read data from the partition's Task Information Block (TIB). |
| `CALL PUTTIB (length, offset, result)` | Modify data in the TIB. |
| `CALL GETPUB (file, length, offset, result)` | Read data from a file's Physical Unit Block (PUB). |
| `CALL PUTPUB (file, length, offset, result)` | Store data into the PUB. |

### Communications (XMIT/RECV module)

Re-entrant buffering/transmit-receive subroutines; maximum record size is
**400 bytes**. A protocol is up to your program.

| CALL | Purpose |
|---|---|
| `CALL OPCOM (file, sta)` | Initialize buffers for an async port. `sta`: 0 = OK, 16 = wrong file type, 17 = illegal open, 18 = no memory. |
| `CALL GETCOM (file, rec, com, sta)` | Receive a record. |
| `CALL PUTCOM (file, rec, com, sta)` | Transmit a record. |
| `CALL WAITC …` | Wait for communications. |
| `CALL ENDCOM (file, sta, op)` | Close the communications port. |

## STATUS & completion codes

`STATUS` is set by I/O subroutines; check it with `CALL STAT (n)`:

| STATUS | Meaning |
|---|---|
| 0 | OK — no error. |
| 1 / 2 | I/O error. |
| 3 | End-of-medium (EOM) on output (file needs expanding / disk full). |

`STAT` behavior on error:
- `n=1` (READB, or WRITEB that shouldn't hit EOM): any nonzero STATUS → abort, CC 100.
- `n=2` or `n=file-name` (WRITEB that may hit EOM): STATUS 1/2 → CC 100; STATUS 3 → CC = **PLU+1** (PLU = the SYS number the file is on).
- It prints `*** I/O ERROR SYSnn ADDRESS=aaaa STATUS=s ***` (or the EOM variant) on the console.

Completion-code interpretation for the jobstream:
- **CC 1–99** — a file used by the program needs expanding: `.REORG` the disk or shrink the file's FSI; the value indicates which file.
- **CC 100** — an I/O (or other) error during an I/O operation: terminate the jobstream.

## Notes / cautions

- Every subroutine used needs `EXTERNAL name` in the CPL program; some also
  require `ENTRYPOINT CRT` (e.g. `STAT`).
- TIB/PUB have protected areas: writing to them aborts with
  `ABORT 21 – ILLEGAL SYSTEM BLOCK ACCESS ATTEMPTED`.
- Subroutines that don't find a record usually set `STATUS=2`; read the
  individual section before relying on a specific code.

## Source

- Manual: `CPU6 Programmer Manual/03_APLIB_ocr.pdf` (committed to this repo).
- Calling these from CPL: [`CPL-REFERENCE.md`](./CPL-REFERENCE.md).
- Debugging your programs: [`DEBUG-REFERENCE.md`](./DEBUG-REFERENCE.md).
