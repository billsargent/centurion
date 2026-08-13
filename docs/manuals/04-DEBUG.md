# DEBUG Utility — CPU-6 (Full Manual)

> **Source:** `CPU6 Programmer Manual/04_DEBUG_ocr.pdf` — CENTURION CPU-6,
> Dealer Support Manual, DEBUG UTILITY, November 29, 1979. Centurion Computer
> Corporation, Richardson, Texas. Copyright © 1979 Centurion Computer
> Corporation. All rights reserved.
>
> **Note:** This is an OCR-derived, light-cleaned transcription for search and
> reading. The PDF is the authoritative page-exact source; treat any ambiguity
> against the scan.

---

## Table of Contents

- Introduction
- Commands
  - `Oxxxx` Set Offset
  - `Gxxxx,yyyy,zzzz` GoTo
  - `Qxxx` Quit
  - `H(expr)` Hexadecimal/Decimal Calculator
  - `Fxxxx,yyyy,zz` Fill
  - `Dxxxx,yyyy` Dump
  - `(N)xxxx` Display/Modify (N)-byte integer
  - `Mxxxx` Display/Modify Memory
  - `R` Display/Modify Register (`V`,`A`,`B`,`X`,`Y`,`Z`,`S`,`C`, or `P`)
- Cautions/Notes

---

## Introduction

The **DEBUG** utility is designed to aid in the debugging of CPL and assembly
language programs for the CPU6. The major difference between the old **BUG**
and the new **DEBUG** is that the new DEBUG utility is limited in access to the
partition memory in which it is running, and will **not** impact other active
partitions. The utility resides in an `E`-type file named `@DEBUG`, which must
be resident on the system disk to be used.

The utility operates by being called in the `.RUN` statement of the program to
be debugged. If the keyword `(DBUG)` is found, a special transient loads first
the main program with the added offset factor specified (if any), and then
loads the DEBUG program. Control is then transferred to the DEBUG program,
which contains the main program entry address in the **`P` register**.

## Usage

The DEBUG utility is evoked by the use of the keyword `(DBUG)` or `(DBUG,X)`
in the `.RUN` statement for the program. If `X` is specified, an offset factor
of from 1 to 9 kilo-bytes is added between the end of the program and its
associated externals (HICORE), and the beginning of the DEBUG utility.

**Example:**

```
.RUN XABC (DBUG, 4)
```

When control is passed to the DEBUG utility, memory may be examined or
modified in either hexadecimal or decimal notation, and breakpoints (traps)
may be set.

## Commands

### `Oxxxx` — Set Offset

Usually the offset value (not to be confused with the offset factor discussed
previously) is set at the beginning of the partition, `X'8000'`, by the
utility. This is not changed unless it is necessary to debug an external
subroutine or overlay, since these are assembled separately and have their own
offset values. When it is used, the offset specified by `xxxx` will be added to
all memory addresses entered.

### `Gxxxx,yyyy,zzzz` — GoTo

This command has several forms. It is basically a transfer-of-control command
which, depending on the form, can restart the program either at the entry
point, or at various points in the program. The possible forms are:

| Form | Effect |
|---|---|
| `G` | Restart (continue) the program from the last trap. |
| `Gxxxx` | Start program execution at hexadecimal address `xxxx`. |
| `G,yyyy` | Restart program at the entry point, and set one trap at hexadecimal address `yyyy`. |
| `G,yyyy,zzzz` | Restart program at the entry point, and set two traps at hexadecimal addresses `yyyy` and `zzzz`. |
| `Gxxxx,yyyy` | Start program at hexadecimal address `xxxx`, and set one trap at hexadecimal address `yyyy`. |
| `Gxxxx,yyyy,zzzz` | Start program execution at hexadecimal address `xxxx`, and set two traps at hexadecimal addresses `yyyy` and `zzzz`. |

**Notes on traps:** a trap is set by placing the assembly language instruction
`JSR/ DEBUG` in a specified location, and saving the program instruction(s) at
that location. All traps are automatically cleared when control is passed to
the DEBUG monitor. The instruction(s) at the trap location are restored in
memory, but have **not** yet been executed.

The trap instruction (`JSR/ DEBUG`) requires three bytes, thus:

- Traps should not be placed within 3 bytes of one another.
- A trap should not be placed less than 3 bytes before a label that may be
  executed before the trap.
- A trap should not be placed less than 3 bytes before the current GOTO
  address.
- Traps should always begin on an instruction boundary.

### `Qxxx` — Quit

The Quit command causes a CPL `STOP` command to be executed. The completion
code will be set to the decimal value entered; if a value is not entered, the
completion code will remain unchanged.

### `H(expr)` — Hex/Decimal Calculator

This command is used to perform calculations in either hexadecimal or
decimal. Legal functions are addition (`+`), subtraction (`-`), division
(`/`), and multiplication (`*`). Functions are evaluated from left to right,
and results will be displayed in decimal notation.

### `Fxxxx,yyyy,zz` — Fill

The FILL command fills the memory locations from the offset hexadecimal
address `xxxx` through `yyyy` with the hexadecimal or decimal value of `zz`.

### `Dxxxx,yyyy` — Dump

The DUMP command dumps the contents of memory for offset hexadecimal address
`xxxx` through `yyyy` to the device assigned to `SYSLOG`. The dump is
displayed using the standard dump format, and is handled by the dump
transient.

### `(N)xxxx` — Display/Modify (N)-byte integer

The integer display command, where `(N)` represents a **6-, 4-, or 2-byte**
integer, displays in decimal the integer that begins at offset hexadecimal
address `xxxx`. Once the integer has been displayed, it may be modified by
entering the new value in hexadecimal notation (beginning with an `X`), or in
decimal. If no value is entered, the displayed value will remain unchanged.

### `Mxxxx` — Display/Modify Memory

The memory display/modify command displays one hexadecimal byte at the offset
hexadecimal address `xxxx`. When the address is displayed, the contents of the
memory location may be modified by entering a new hexadecimal value, or left
unchanged by entering a terminator (either a space, comma, or NEWLINE). Each
terminator has a slightly different function:

- **Space** — displays the contents of the *next* memory location, allowing
  modification.
- **Comma** — opens the *next* memory location for modification *without*
  displaying the present contents.
- **NEWLINE** — terminates the memory display/modify function.

Successive commas cause the memory locations to be opened without changing the
prior locations' contents.

### `R` — Display/Modify Register

The Register command allows the display and modification of partition
registers. When one of the characters `V`, `A`, `B`, `X`, `Y`, `Z`, `S`, `C`,
or `P` is entered, the current value of that register, in hexadecimal
notation, is displayed. The contents of this register may then be modified by
the entry of a new hexadecimal value, or left unchanged by entering a
terminator (space, comma, or NEWLINE).

- **Space** — displays the contents of the next register in the sequence
  (`A`,`B`,`X`,`Y`,`Z`,`C`,`P`) for modification.
- **Comma** — opens the next register for modification without displaying it.
- Successive commas open consecutive registers without changing the values of
  previous registers.

The register display/modification function is terminated either after the `P`
register has been displayed/modified, or by a NEWLINE.

> **NOTE:** the `V` register is the **indicator register** that stores the
> status of flags set previously in the program. These flags are the Fault,
> Link, Minus, and Value (also known as zero) and are represented as a
> hexadecimal value. All digits in the hexadecimal are set initially to 0; if
> a flag is set in the program, the value of that flag becomes 1. With the
> hexadecimal set up in the form of **FLMV** (Fault, Link, Minus, Value), the
> hexadecimal `0110` indicates that the Link and Minus flags are set and the
> Fault and Value are not.

## Cautions

The DEBUG utility is set up in a manner to prevent it from impacting other
partitions, or from damaging any files except for those files being directly
referenced in the program. There are **no internal error messages**; invalid
commands are ignored. The only possible system error message that could be
referenced is the **AB-33 Program Malfunction**.

---

*OCR-cleaned transcription of `04_DEBUG_ocr.pdf`. See [`MANUALS-INDEX.md`](./MANUALS-INDEX.md).*
