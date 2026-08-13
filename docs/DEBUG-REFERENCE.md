# DEBUG Utility Reference

The **DEBUG** utility for CPU-6 — a partition-scoped debugger for CPL and
assembly-language programs. Compiled from the **CPU6 Programmer's Manual, Vol.
4** (`CPU6 Programmer Manual/04_DEBUG_ocr.pdf`, 10 pp., Centurion Computer Corp
©1979; local only, not committed to git).

## Invoking DEBUG

DEBUG lives in an `E`-type file named `@DEBUG` on the system disk. You ask for
it in the `.RUN` statement of the program to debug:

```
.RUN X<prog> (DBUG)        # debug with no offset
.RUN X<prog> (DBUG, n)     # n = 1..9 KB offset factor
```

Example from the manual: `.RUN XABC (DBUG, 4)`.

With `(DBUG)`, a special transient loads the main program (plus an offset
factor `n` if given, inserted between the program's externals/HICORE and the
DEBUG utility), then loads DEBUG. Control transfers to DEBUG with the **main
program's entry address in the `P` register**.

Unlike the older BUG utility, DEBUG is limited to the memory of the partition
it runs in — it doesn't affect other active partitions.

## Commands

Addresses are entered in **hexadecimal** unless noted.

| Command | Name | Meaning |
|---|---|---|
| `Oxxxx` | Set Offset | Add `xxxx` to every address entered. Default offset is `X'8000'` (start of partition); change it only to debug an external subroutine/overlay that was assembled with its own offset. |
| `G` | GoTo / restart | Transfer control. Several forms (below). |
| `Qxxx` | Quit | Execute a CPL `STOP`. If `xxx` (decimal) is given it becomes the completion code; otherwise the code is unchanged. |
| `H(expr)` | Hex/Dec Calculator | Evaluate `+ - / *` left to right, in hex or decimal; result shown in **decimal**. |
| `Fxxxx,yyyy,zz` | Fill | Fill memory `xxxx`..`yyyy` with value `zz` (hex or decimal). |
| `Dxxxx,yyyy` | Dump | Dump memory `xxxx`..`yyyy` to `SYSLOG` in the standard dump format. |
| `(N)xxxx` | Display/Modify integer | Display the 2-, 4- or 6-byte integer at `xxxx` (N = 2/4/6). Shown in decimal. Modify by entering a new value (hex if prefixed with `X`, else decimal); no value = unchanged. |
| `Mxxxx` | Display/Modify Memory | Show the byte at `xxxx`; enter a new hex value to change it. Terminators: **space** shows the next byte for edit, **comma** opens the next byte without displaying, **NEWLINE** exits. |
| `R` | Display/Modify Registers | Show/modify partition registers `V A B X Y Z S C P` in hex. Terminators behave like `M`. The `V` register is the **indicator register**: hex `FLMV` (Fault, Link, Minus, Value/zero); e.g. `0110` = Link + Minus set, Fault + Value clear. |

### `G` (GoTo) forms

| Form | Effect |
|---|---|
| `G` | Continue program from the last trap. |
| `Gxxxx` | Start execution at hex address `xxxx`. |
| `G,yyyy` | Restart at the program entry, set one trap at `yyyy`. |
| `G,yyyy,zzzz` | Restart at entry, set traps at `yyyy` and `zzzz`. |
| `Gxxxx,yyyy` | Start at `xxxx`, set one trap at `yyyy`. |
| `Gxxxx,yyyy,zzzz` | Start at `xxxx`, set traps at `yyyy` and `zzzz`. |

### Traps (breakpoints)

A trap is a `JSR/ DEBUG` assembly instruction placed at the target address
(the original instruction(s) there are saved and restored when DEBUG regains
control — the restored instruction has **not** yet executed). `JSR/ DEBUG` is
3 bytes, so:

- Don't place traps within 3 bytes of each other.
- Don't place a trap less than 3 bytes before a label that may be executed
  before the trap.
- Don't place a trap less than 3 bytes before the current GOTO address.
- Always begin traps on an instruction boundary.

## Cautions / notes

- No internal error messages — **invalid commands are silently ignored**.
- The only system message you may see is `AB-33 PROGRAM MALFUNCTION`.
- DEBUG can't damage other partitions or files except those directly
  referenced by the program being debugged.

## Related

- Invoke a program to debug at the OS prompt: see [`CENTOS-COMMANDS.md`](./CENTOS-COMMANDS.md).
- Writing programs to debug: see [`CPL-REFERENCE.md`](./CPL-REFERENCE.md) and
  [`APLIB-REFERENCE.md`](./APLIB-REFERENCE.md).
