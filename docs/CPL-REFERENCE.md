# CPL Quick Reference (Centurion Programming Language)

A condensed reference for **CPL** — the Centurion Programming Language for
CPU-5/CPU-6. Compiled from the **CPU6 Programmer's Manual, Vol. 2** (`CPU6
Programmer Manual/02_CPL_ocr.pdf`, 197 pp., Centurion Computer Corp ©1983),
which lives locally in this repo but is **not** committed to git (large
copyrighted scans). Re-extract text with the `pypdf` recipe in
[`CENTOS-COMMANDS.md`](./CENTOS-COMMANDS.md).

For how to create, compile and run CPL programs on the emulator, see the
"Compiling & running CPL" section of [`CENTOS-COMMANDS.md`](./CENTOS-COMMANDS.md).

## Program structure

A CPL source file is a list of statements (one line each, up to 300 chars;
the editor truncates at 132). The typical skeleton:

```
TITLE 'My Program'                    ; optional program title
SYSTEM MYPROG (MAIN,EXP=D)            ; declare the program (see below)
FILE CRT:SYSIPT,CLASS=0,SEQ           ; assign the console to logical CRT
DEFINE M00:'HELLO WORLD!'             ; named string constant
FORMAT F00:C132                       ; named output format
RECORD R1(20)                         ; optional record layout
  INTEGER A
  STRING NAME(10)
ENDREC
ENTRY                                 ; main entry
ENTRYPOINT CRT                        ; what the OS can call/transfer to
  OPEN IO CRT
  WRITE (CRT,F00)M00                  ; write a variable to the CRT
  STOP 0                              ; exit with completion code 0
END
```

- `SYSTEM [name] [(parameters)]` — declares the program. Parameters seen in
  examples: `MAIN`, `EXP=D` (export data?), etc. The `@` prefix marks a
  system/OS label (`@SYSTEM`, `@EXTERNAL` in the sample listing).
- Labels end with a colon `:`.
- Statements are deblanked at compile time; fields separated by spaces/commas.
  A reverse slash `\` lets you put multiple statements on one line.

## Data & naming

| Kind | Rule |
|---|---|
| Label | 1–255 chars; starts with `Z`, `@`, or alphabetic; rest alphanumeric/`?`/`@`; ends with `:`. Must not begin with a CPL command word. |
| 4-byte integer | Starts with an alphabetic char. |
| 6-byte integer | Starts with `?`. |
| String variable | `STRING name(n)` — n characters. |
| System (OS) label | Starts with `@`. |
| Constants | `DEFINE name:'string'`; numeric literals are plain numbers. |

Types & storage:
- `INTEGER name [,name …]` — 4-byte integer variable.
- `STRING name(n) [,name(n) …]` — string variable of length n.
- `TABLE name(n) [,name(n) …]` — integer table; `TABLE name(len,n)` — 2-D.
- `BUFFER name(n)` — I/O buffer area.
- `EQUATE name, expression` — compile-time equate.
- `RECORD name(n)` … `ENDREC` — describe a logical record (fields declared
  inside as INTEGER/STRING).

## Symbols / operators

`+` add/concatenate · `-` subtract · `*` multiply · `/` divide · `=` assign ·
`( )` grouping · `.` delimits operators · `:` after labels/names · `,`
separates items · `\` multiple statements/line · `'…'` string delimiter ·
`"…"` quoted phrase.

Comparison operators (used in `IF`, `IFSTRING`/`IFS`, `LOOP WHILE`):
`.EQ.` (equal) · `.NE.` (not equal) · `.LT.` (less than) · `.LE.` (≤) ·
`.GT.` (greater) · `.GE.` (≥). An `H` prefix variant (e.g. `.HEQ.`) also
exists.

## Command reference (by category)

**Program control**
- `SYSTEM [name] [(params)]` — program declaration.
- `ENTRY` — main entry point.
- `ENTRYPOINT label` — declare callable entry.
- `EXTERNAL label` — declare a label defined in another program.
- `SUBROUTINE label` / `CALL subroutine [(args)]` / `RETURN` / `RETURN TO` —
  subroutines.
- `STOP [code]` — terminate with completion code (`<0` behaves specially).
- `END` — end of program.
- `GO TO label` / `GO TO (label,…) ON expression` — branching.
- `IF (value op value) action` with `DO … END DO`, `ELSE`, `NULL` variants.
- `IFSTRING`/`IFS (string op string)` — string comparison branch.
- `LOOP` … `END LOOP`, `LOOP WHILE (cond)` … `END LOOP` — loops.

**Compiler directives**
- `TITLE 'title'` · `DIRECT` / `CPL` (language mode) · `EJECT` / `PAGE EJECT`
  (top of form) · `SPACE n` (blank lines) · `PRINT ON` / `PRINT OFF[,COM]`
  (list the source) · `COPY label [SYSn]` (include another file).

**Assignment & arithmetic**
- `name = expression` · `INCR integer [,n]` / `INCREMENT` · `DECR integer [,n]`
  / `DECREMENT` · `EQUATE name, expression`.

**Functions**
`ABS(arg)` · `LEN(string)` · `MAX` · `MIN` · `MOD` · `ROUND` · `SGN`.

**File & record I/O**
- `FILE name: SYSccc, [access], [CLASS=n], [BUFFER=n], [TRECSIZ=n],
  [KEY=integer], [FILTYP=c], [LSR=routine]` — declare a file (access: `SEQ`,
  `IND`, `RND`, …).
- `FORMAT name: spec,…` — output format (e.g. `C132`).
- `OPEN` / `CLOSE` / `ENDFILE` / `REWIND` / `RESET` / `SKIP` / `SETFORM`.
- `READ (file, format) var,…` · `WRITE (file, format) var,…` ·
  `WRITEN`/`WRITN (file, format) var,…` · `WRITEB (file, record)` ·
  `READB (file, record)` · `REWRITE`.
- Record access: `RECORD name(n)`…`ENDREC`, `GETR (file, record)`,
  `PUTR (file, record)`, `FRER (file)` (free record), `HLDR (file)` (hold),
  `FREE (file)`, `HOLD (file)`, `POINT (file, integer)`, `NOTE (file, integer)`.
- Encoding: `ENCODE (string, format) var,…` · `DECODE (string, format) var,…`.

**Cursor / string / misc**
- `CURB (file, number)` · `CURP (file, column, line)` ·
  `CURS (file, number, string)` · `CURSOR (file, line, column)` — CRT cursor.
- `ADRLST (address,…)` · `DUMP (addr1, addr2)` · `LOAD` · `ORIGIN` ·
  `RETRIEVE`.
- Date/time: `SDATE (string)` · `LDATE (integer)` · `GTIME (STRING,…)` /
  `GTIME (INTEGER,…)`.
- Tables: `TBLGET table (integer)` · `TBLPUT table (integer) [:'string']
  [:value]`.

> The `monarch.js` language definition (`src/monarch.ts`) lists the CPL
> command words used for editor highlighting: ABS, END, LEN, MAX, MIN, MOD,
> SET, SGN (commands) and CALL, CURB, CURP, CURS, DECR, DUMP, ELSE, FILE,
> FREE, FRER, GETR, HLDR, HOLD, INCR, LOAD, LOOP, NOTE, OPEN, PUTR, READ,
> SKIP, STOP (keywords).

## Example (from the OS's built-in help)

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

Compile it (source file `ZHELLO` on drive #, drop the Z for the compiler) and
run:

```
P.CPL HELLO # CRT0
.RUN XHELLO #
```

## Source

- Manual: `CPU6 Programmer Manual/02_CPL_ocr.pdf` (local only, not in git).
- OS built-in help + compile/run commands: [`CENTOS-COMMANDS.md`](./CENTOS-COMMANDS.md).
