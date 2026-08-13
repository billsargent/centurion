# Centurion Programming Language — CPL (02_CPL)

> **Source:** CENTURION CPU-5/CPU-6, Centurion Programming Language (CPL), December 1981, includes 6/15/83 revisions. Centurion Computer Corporation. Copyright 1983.
>
> **Note:** This is an OCR-derived, light-cleaned transcription for search and
> reading. The PDF is the authoritative page-exact source; treat any ambiguity
> against the scan. Page markers appear as invisible `<!-- page n -->` comments.

---
## Contents

- [Chapter One: INTRODUCTION](#chapter-one-introduction)
- [Chapter Two: CPL CONCEPTS](#chapter-two-cpl-concepts)
- [Chapter Three: PROGRAM CONTROL](#chapter-three-program-control)
- [Chapter Four: COMPILER DIRECTIVES](#chapter-four-compiler-directives)
- [Chapter Five: PROGRAM LINKAGE](#chapter-five-program-linkage)
- [Chapter Six: RESERVING MEMORY](#chapter-six-reserving-memory)
- [Chapter Seven: CPL ASSIGNMENT STATEMENTS](#chapter-seven-cpl-assignment-statements)
- [Chapter Eight: FUNCTIONS](#chapter-eight-functions)
- [Chapter Nine: TRANSFER OF CONTROL](#chapter-nine-transfer-of-control)
- [Chapter Ten: FILE DEFINITION AND CONTROL](#chapter-ten-file-definition-and-control)
- [Chapter Eleven: FORMATTED INPUT/OUTPUT](#chapter-eleven-formatted-inputoutput)
- [Chapter Eleve:](#chapter-eleve)
- [Chapter Twelve: BINARY INPUT/OUTPUT](#chapter-twelve-binary-inputoutput)
- [Chapter Thirteen: SPANNED: SECTOR INPUT/OQUTPUT](#chapter-thirteen-spanned-sector-inputoqutput)
- [Chapter Fourteen: MISCELLANEOUS COMMANDS](#chapter-fourteen-miscellaneous-commands)

<!-- page 1 -->
CENTURION
December 1981
Includes 6/15/83 Revisions
1788 Jay Ell Drive
Richardson, Texas 75881
Copyright 1983 by Centurion Computer Corporation. All rights
'reserved. No part of this publication may be reproduced, stored
in an information retrieval system, or transmitted in any form
or by any means without prior written permission by Centurion
Computer Corporation.
<!-- page 2 (front-matter table of contents, omitted) -->
<!-- page 3 (front-matter table of contents, omitted) -->
<!-- page 4 (front-matter table of contents, omitted) -->
<!-- page 5 (front-matter table of contents, omitted) -->
<!-- page 6 (front-matter table of contents, omitted) -->
<!-- page 7 (front-matter table of contents, omitted) -->
<!-- page 8 (front-matter table of contents, omitted) -->
<!-- page 9 (front-matter table of contents, omitted) -->
<!-- page 10 (front-matter table of contents, omitted) -->
<!-- page 11 (front-matter table of contents, omitted) -->
<!-- page 12 (front-matter table of contents, omitted) -->
<!-- page 13 (front-matter table of contents, omitted) -->
<!-- page 14 -->
REFERENCE TABLE
READY REFERENCE
Command Page Number Command Page Number
ABS. ... .l VIII-2 IFSTRING-DO  wee.  IX-22
ADRLST cc.ou  XIv-19 IFSTRING-DO-ELSE  IX-23
BUFFER  ceeean VIi-7 IFSTRING-DO-ELSE DO  IX-23
CALL. .t iininnennnn... IX-9 IFSTRING - DO - Null - ELSE.. IX-24
CLOSE. . iviiinnnunnnn.. X-7 IFSTRING-ELSE  IX-21
0 o Iv-7 IFSTRING-ELSE-DO  IX-22
CPL .ttt e iin T I-1 IFSTRING-Null-ELSE  IX-24
CURB  nnnnn... XIv=-2 INCR. .ttt it e iiieiean, VII-7
CURP... nann. XIv=-2 INCREMENT  VIi-7
CURS  ... XIV-3 INTEGER ovvun  VIi-2
CURSOR ovuun... XIV=-2 LDATE. . i i i XIv-12
DECODE vuuu... XI-15 LEN. .. i e VIII-3
DECR. ...t  nian... VII-7 LOAD. .. ettt i XIV-6
DECREMENT ouu  VII-7 LOOP  et e et e IX-4
DEFINE.. ..., VIi-6 LOOP WHILE  IX-6
DIRECT ... .viiinunun.. Iv-3 2 VIII-4
DUMP. ... ittt XIV-5 MIN ou.. e VIII-S
EJECT oiivuun.n. IV-5 MOD  nnnnn... VIII-6
ENCODE iivuu  XI-17 NOTE oivu  see. XI-19
END. ittt iiieei, III1-9 OPEN  ... X-6
END DO...ovvvnnnnnnnn.. IX-27 ORIGIN oivivnunn... XIV-9
ENDFILE. .. nnn... X-8 PAGE EJECT  IV-5
END LOOP. . innnnnn... IX-8 POINT o ninnn... XI-20
ENDREC. . ... nnnnn.. XII-2 PRINT OFF vuu... IV-4
ENTRY  .. III-6 PRINT OFF,COM  Iv-4
ENTRYPOINT...ivvenn  V-3 PRINT ON ovu  IV-4
EQUATE. ...   XIV-10 PUTR  e et e st XIII-4
EXTERNAL  eee V=2 C READ. .. iii e XI-9
FILE. .. ittt X-2 READB civiun.. .. XII-4
FORMAT. ... ...ivvinnnn.. XI-2 RECORD...ovennnnnn... XII--2
FREE.   ..., XII1-7 RESET...uiveunun... e vean X-12
FRER c.iviuu... se. XIII-S RETRIEVE viuunu... IX-12
GETR. ittt i it ie e, XIII-3 RETURN  ceeean IX-11
GO TO. i iinnnnnn... eee  IX-3 RETURN TO..veueenvn  IX-11
GTIME. i iieenenennnn. XIv-11 REWIND..vvieieennnnn.. X-9
HOLD  ... ... . ... XII-7 ROUND  ... .. ..., VIII-7
D IX-15 SDATE. . ie it nnunn... XIiv-12
IF-DO. ..t   ... IX-16 o VI-3
IF-DO-ELSE cou  IX-17 SETFORM  X-10
IF-DO-ELSE DO...vuvuun.. IX-17 SGN ... ittt it iiieann, VIII-8
IF-DO-Null-ELSE  IX-18 SKIP. .. i iieennunnn.. X-11
IF-ELSE..ieinnnennnn... IX-15 SPACE. ... iiinnnnnnn.. IV-6
IF-ELSE DO  /ee. IX-16 STOP. .t  nnnnnn... II1-7
IF-Null-ELSE v.v  IX-18 STRING vvveennnn.. VI-4
IF(X) et iiie s ieeieun IX-19 SUBROUTINE. ...0vuu.o  IX--10
S IX-21 SYSTEM  ceesae ceeeaan II1-2
IFS-DO0. . iit nnnn... IX-22 TABLE  Ch e et VIi-8
IFS-DO-ELSE. .. enn... IX-23 TBLGET . ettt et v i eennnnn. XIvV-16
IFS-DO-ELSE DO...vuv  IX-23 TBLPUT . ettt it e e ennnn XIVv-17
IFS-DO-Null-ELSE  IX-24 TITLE. ottt eeeann Iv-2
IFS-ELSE  Ceesaenn IX-21 WRITE  ... XI-11
IFS-ELSE DO v  IX-22 WRITEB. . i eeinenennnnnn XII-16
IFSTRING u... IX-21 WRITEN 0uu  XI-13
<!-- page 15 -->
ABS
(VIII.1)
ADRLST
(XIV.11)
BUFFER
(VI.5)
CALL
(IX.6)
CLOSE
(X.3)
COPY
(IV.6)
CPL
(IV.2)
CURB
(XIV.1)
CURP
(XIV.1)
CURS
(XIV.1)
CURSOR
(XIV.1)
DECODE
(XI.5)
DECR
(VII.3)
DECREMENT
(VII.3)
REFERENCE TABLE
CPL COMMANDS
ABS (arg)
BUFFER label (n) [,label (n)},
label (n),l...]
```
CALL subroutine [(name, name, /..)]
CLOSE file [,file, file, ...]
```

COPY label [SYSn)
CPL
CURB (file, number)
CURP (file, column, line)
CURS (file, number, string)
CURSOR (file, line, column)
DECODE (string, format) variable,
variable, ...
DECR integer [,n]
DECREMENT integer [,n]
i3
<!-- page 16 -->
DEFINE
(VI.4)
DIRECT
(IV.2)
DUMP
(XIV.2)
EJECT
(IV.4)
ENCODE
(XI.6)
END
(III.4)
END DO
(IX.12)
ENDFILE
(X.4)
END LOOP
(IX.5)
ENDREC
(XII.1)
ENTRY
(III1.2)
ENTRYPOINT
(V.2)
EQUATE
(XIV.5)
EXTERNAL
(V.1)
CpPU-5/CPU-6
CPL
REFERENCE TAB!
CPL COMMANDS
DEFINE label:'string' [,label:'string'',
label:'string', ...]
DIRECT
EJECT
ENCODE (string, format) variable,
variable, ...
END
END DO
ENDFILE file [,file, file, ...]
END LOOP
```
ENDREC
ENTRY
ENTRYPOINT label [,label, label, ...]
EQUATE label, expression
```

EXTERNAL label [,label, label, ...]
iii
<!-- page 17 -->
FILE
(X.1)
FORMAT
(XI.1)
FREE
(XII.4)
FRER
(XIII.3)
GETR
(XIII.1)
GO TO (Conditional)
(IX.2)
GO TO (Unconditional)
(IX.2)
CGTIME (Integer)
(XIV.6)
GTIME (String)
(XIV.6)
HLDR
(XIII.3)
HOLD
(XII.4)
IF
(IX.10)
IF-DO
(IX.10)
IF-DO-ELSE
(IX.10)
CpPL
REFERENCE TABLE
CPL COMMANDS
FILE file: SYSccc, [access], [CLASS=n],
[BUFFER=n, buffer)], TRECSIZ=n], [KEY=
integer], [FILTYP=c], [LSR=routine]
FORMAT format: specification,
specification, ...
FREE (file)
```
CALL FRER (file)
CALL GETR (file, record)
```

GO TC (label, label, ...) ON expres-
sion
GO TO label
GTIME (INTEGER, integer)
GTIME (STRING, string)
CALL HLDR (file)
HOLD (file)
IF (value operator value)
action
IF (value operator value) DO
actions
END DO
IF (value operator value) DO
actions
END DO
ELSE action
iv
<!-- page 18 -->
IF-DO-ELSE DO
(IX.10)
IF-DO-Null-ELSE
(IX.10)
IF-ELSE
(IX.10)
IF-ELSE DO
(IX.10)
IF-Null-ELSE
(IX.10)
IF(x)
(IX.10)
IFSTRING
or
IFS
(IX.11)
IFSTRING-DO
or
IFS-DOC
(IX.11)
IFSTRING-DO-ELSE
or
IFS-DO-ELSE
(IX.11)
IF (value operator
actions
END DO
ELSE DO
actions
END DO
IF (value operator
actions
END DO
ELSE
IF (value operator
ELSE action
IF (value operator
ELSE DO
actions
END DO
IF (value operator
ELSE
IF (value)
IFSTRING (string operator
IFSTRING (string operator
actions
END DO
IFSTRING (string operator
actions
END DO
ELSE action
action
value)
value)
value)
value)
value)
CPL
REFERENCE TAB
CPL COMMANDS
DG
DO
action
action
action
string) action
string) DO
string) DO
<!-- page 19 -->
IFSTRING-DO-ELSE DO
or
IFS-DO-ELSE DO
(IX.11)
IFSTRING-DO-Null-ELSE
or
IFS-DO-Null-ELSE
(IX.11)
IFSTRING-ELSE
or
IFS-ELSE
(IX.11)
IFSTRING-ELSE DO
or
IFS-ELSE DO
(IX.11)
IFSTRING-Null-ELSE
or
IFS-Null-ELSE
{(IX.11)
INCR
(VII.3)
INCREMENT
(VII.3)
INTEGER
(VI.1)
LDATE
(XIV.7)
LEN
(VIII.2)
LOAD
(XIV.3)
Vi
CPL
REFERENCE TABLE
CPL COMMANDS
IFSTRING (string operator string) DO
actions
END DO
actions
END DO
IFSTRING (string operator string) DO
actions
END DO
ELSE
IFSTRING (string operator string) actio
ELSE action
IFSTRING (string operator string) actio
ELSE DO
actions
END DO
IFSTRING (string operator string) actio:
ELSE
INCR integer [,n)
INCREMENT integer [,n]
INTEGER label [,label, label, oo
LDATE (form) [,label]
LEN (arg)
LOAD (mask, label, option) [ {(name,
name, ...)]
<!-- page 20 -->
CPL
REFERENCE TABLE
CPL COMMANDS
LOOP - LOOP j (a, b, c)
(IX.3)
LOOP WHILE - LOOP WHILE (value operator value)
(IX.4)
MAX - MAX (argl, arg2, ...)
(VIII.3)
MIN - MIN (argl, arg2, ...)
(VIII.4)
MOD - MOD (argl, arg2)
(VIII.S)
NOTE - NOTE (file, integer)
(XI.7)
OPEN - OPEN access file
(X.2) or
OPEN access (file, ...) {,access
( ile, ...} ,...]
ORIGIN - ORIGIN address
(XIV.4)
PAGE EJECT - PAGE EJECT
(IV.4) '
POINT - POINT (file, integer)
(XI.8)
PRINT OFF - PRINT OFF
(IV.3)
PRINT OFF,COM - PRINT OFF [,COM]
(IV.3)
PRINT ON - PRINT ON
(IV.3)
PUTR - CALL PUTR (file, record)
(XIII.2)
<!-- page 21 -->
```
.. Revision 03/15/83 vii
READ
```

(XI.2)
READB
(XII.2)
RECORD
(XII.1)
RESET
(X.12)
RETRIEVE
(IX.9)
RETURN
(IX.8)
RETURN TO
(IX.8)
REWIND.
(X.5)
REWRITE
(XI.9)
ROUND
(VIII.6)
SDATE
(XIV.7)
SET
(VI.2)
SETFORM (CPU-6)
(X.6)
SGN
(VIII.7)
SKIP
(X.11)
CPL
REFERENCE TABLE
CPL COMMANDS
READ (file, format) variable,
variable, ...
READB (file, record)
RECORD record (n)
RESET file [,file,file,...]
RETRIEVE (type, location
[,location, ...))
RETURN
RETURN/ TO label
REWIND file [,file, file, ...]
REWRITE (file, format) variable,
variable,
ROUND (argl, arg2)
SDATE (form, label)
SET label : n [,label:n, label:n,
SETFORM (file [,n] { ,HOLD] [,FREE])
SGN (arg)
SKIP (file,n)
vii Revision 03/15/83
<!-- page 22 -->
SPACE
(IV.5)
STOP
(ITI.3)
STRING
(VI.3)
SUBROUTINE
(IX.7)
SYSTEM (CPU-5)
(III.1)
SYSTEM (CPU-6)
(III.1l)
TABLE (Integer)
(VI.6)
TABLE (String)
(VI.6)
TBLGET
(XIV.9)
TBLPUT
(XIV.10)
TITLE
(IV.1l)
WRITE
(XI.3)
WRITEB
(XII.3)
CpPL
REFERENCE TABLE
CcpPL COMMANDS
SPACE n
```
STOP [code]
STRING label (n) {[,label (n)
```

label (n), ...]
SUBROUTINE label
```
SYSTEM {name] [(parameters)]
SYSTEM [name] [(parameters)]
TABLE name (n) {,name (n), name
```

name (n), ...]
TABLE name (len,n) [,name (len,n),
name (len,n) ...]
TBLGET table (integer)
TBLPUT table (integer) [:'string']
[:value]
```
TITLE 'title'
WRITE (file, format) variable,
```

variable, ...
WRITEB (file, record)
<!-- page 23 -->
WRITEN
(XI.4)
WRITN
(XI.4)
NOTE:
CPL
REFERENCE TABLE
CPL COMMANDS
- WRITEN (file, format) variable,
variable, ...
- WRITN (file, format) variable,
variable, ...
CPL commands must be included on one line. Those commands
which are included  n more than one line in this reference
reference chart are listed in such a manner for purposes
of documentation only.
<!-- page 24 -->
REFERENCE TABLE
CPL COMMANDS - FORMATTING CONVENTIONS
The following conventions are followed in the format of &
command.
1.
LoVl .
[Wal
6.
el
A CPL command may be from 1 to 300 characters in
length. However, the text editor will truncate
lines at 132 characters.
Capital letters indicate the actual words/phrases to
be entered into the computer.
Lower case letters indicate the variatle portions of
& conmand.
NCTE: Unless otherwise specified, a lower case "p"
represents a numeric literal; a lower case
"c" represents an alphanumeric character.
Brackets [ ] indicate optional words or phrases.
When punctuation is shown as peart of a CPL commans,
it is & reguirenment.
A lire of CPL is deblanked as it is compiled witr
indivicdual fields being separated by spaces and/cr
commas.
NOTE: Inclusion of space(s) is opticrneal and is cone
only for textual clarification.
Items within a CPL command are not assignec to
specific columns.
If special characters (l.e. Gquotation marks, egua.
signs, parentheses, etc.) are used in the comrmand
format, they must be included in the actual command.
(@) T  - 
X1
<!-- page 25 -->
REFERENCE TABLE
CPL NAMING CONVENTIONS - LABELS, INTEGERS and STRINGS
rt o The following guidelines must be followed in &ssigning names
labels, integers and strings. :
NOTE: Where punctuation is a part of a CPL corrand
format, it is a requirement.
l. A label name may be from 1 to 255 characters in
length. : '
2. The initial (character of a label may be a "2", ver
or any alphabeticel character. The remaining char-
acters may be alphanumeric, "?" or "@".
NOTE: While the 1initial character in a label may
not be a blank, any of the remaining char-
acters may contain a blenk.
3. The initial (character of a 4-byte integer may be
any alphabetical character. The remaining cheracters
nay be alphanumeric, "?" or "g".
I "ne initial character of a 6-byte integer is a "?",
The remaining characters may be alphanumeric, "?" or
" ""
e".
5. The initial character of a CPL operating syster
label is "gv. Although the system will accegp:
programmer sypplied labels beginning with "g", usage
may result in multiply defined 1labels within a
single program.
€. Labels must not begin with the characters of 2 CFL
command. (SETUP would be an illegal label name since
it incorporates the term SET, a CPL command worc.)
The program will not compile with labels of thic
sort and a syntax error will result.
7. The final (character in a program label must Le
followed by a colon (:).
X1l
<!-- page 26 -->
REFERENCE TABLE
CPL SYMBOLS
The following symbols are used in CPL programming.
NOTE: Where  punctuation is part of a CPL command
format, it is a requirement.
+ the plus sign is wused to indicate (a) the adcg-
ition operation or (b) concatenstion iIn string
operations.
- the negative sign is used to indicate the subtrac-
tion operation.
\* the asterisk is used to indicate the multiplication
operation.
/ the slash is used to indicate the division
operation.
= the ecual sign is used to indicate the substitution
operation.
() parentheses are used in arithmetic expressions to
indicate a mathenmaticel grouping.
. the period is wused to delimit the operator in all
forms of 1IF, IFSTRING/1FS and LOCP WHILE commancs.
For additional information see IF (IX.10) and
the colon is used (a) following the lebel in a SE
(VI.2) or DEFINE (VI.4q) Statement to separat
the label name from the assigned wvalue or (b
following a file name in & FILE (X.1) statenrer
to serparate that name from the keywords whic
follow (c) following the label in a FORMAT (XI.2)
Statement to separate that label from the fiel
specifications which follow or (d) following th
final character in a Program label (Labels, IX.1).
' the comma is used to separate multiple labels or
values in a CPL statement.
X111
<!-- page 27 -->
cpL
REFERENCE TABLL
SYMBOLS
the reverse slash allows multiple statements to be
coded on the same line (Reverse Slash, IV.9).
the single gquote is used as a delimiter for a
string.( Literal, II.1; Expression, Il.3; TITLE,
Iv.1; DEFINE, VI.4; String Assignement State-
ment, VII.2)
the double gquotation mark is used to indicate an
expression contains a string literal. (Expression,
I1.3.1; String Assignment Statement, VII.2)
an initial question mark indicates a 6-byte
integer.
an initial @ generally 1indicates an operating
system label.
the semicolon functions as the comment character.
It allows commentary and blank 1lines to be added
to the source listing. (Comment Line, IV.7)
the hyphen functions as the continuation character.
It allows a line of CPL code to be divided between
two or more records of the source file; that 1is,
one line of (code (can be entered on two lines.
(Continuation Line, IV.R)
<!-- page 28 -->
{0 .
REFERENCE TABLE
Operators for Integer and String Comparisons -
a. JEOQ.
b. .NE.
c. .LT.
d. .LE.
e. .GT.
f. .GE.
NCTE:
STATUS
ané out
STATUS.
- equal to
- not equal to
- less than
- less than or equal to
- greater than
- greater than or equal to
Before any comparison takes place in e
string, tre iling blanks are dropped and lower
Case characters are converted to upper cacse.
An "H" placed before the operators listed
above (i.e. .HEQ., .HNE., .HLT., .HLE., .HGT.
or .HGE.) may be usegd- only with string com-
parisons. Use of this type of operator does
not (cause trailing blanks to be dropped
and/or lower case characters to be convertesd
to upper case.
- During program execution, CPL checks input
put. The result of each check is Stored 1in
Since results are stored with each check of
170, the wvalue of STATUS changes with each CPL
operati
EJECT -
on.
This form feed character causes top-cf-fornm
when sent to a Printer; it causes the screen to ke
cleared when sent to the CRT (édditionally, it sends
the cursor to home position). EJECT is usually used
with WRITE or MSG (an external routine).
VTAB - This vertical tab character causes a printer
to space to a predetermined position set by the ver-
tical Format Unit.
NOTE: Not all Centurion printers are equilipped with
VFU; the VTAB option is not operational in
these instances.
XV
<!-- page 29 -->
cpL
REFERENCE TABLE
ABBREVIATIONS/
GENERAL TERMS
5. BEEP - This character is used to (create a sound
when output by some CRTs/printers.
<!-- page 30 -->
. Revision 03/15/83 Xvi1
There is no basic difference between a CPU-5 program and a CpU-
pProgram.
running
REFERENCE TABLE
CPL
However, while it is possible to compile for & CPpU-
on a CPU-6 system, compiling for a CPU-6 while runnin W
n
on a CPU-5 system is not allowed.
1.
(VS] .
invoked by S.CPL or S.SCPL.
invoked by P.CPL or P.SCPL.
For additiona; information see Introduction (I.2).
For additional information see Introduction (1.2).
type, LL=n, EXP=A, EXP=B, EXP=C, EXP=0C
CPU-€ - SYSTEM comrand parameters are -
type, LL=n, EXP=A, EXP=B, EXP=C, EXP=D, STACK=nnn
For additional information see SYSTEM (III.)1)
CPL).
For additional information see DIRECT/CPL (IV.2).
cessing.
compiler.
For additional information see COPY (1IV.6).
XVl
<!-- page 31 -->
cpL
REFERENCE TARLE
COMPATIBILITY
: utility through processing of an "A" Type
copy library or a "D" Type private library.
SPU-6 - COPY member processing handled by the com-
piler through  processing of an "A Type
copy library only.
Note: For CPU-S5/CPU-6 compatibility use
discrete Type "A" files.
For additional information see COPY (IV.6).
gram to the next.
one program to the next.
For additional information see INTEGER (VI.1).
stored. .
performed to be stored in B@REM (4-byte
integer) or ?@REM (6- or 8-byte integer).
For additional 1information see Integer Assignment
Statement (VII.1l).
CPU-S - does not provide partition protection.
For additional 1information see String Assignment
Statement (VII.2).
CPU-S5 - 1illegal use of RETURN, CALL or GO TO com-
mands may result in eventual destruction of
a pregram.
Xviii
<!-- page 32 -->
10.
11.
12.
13.
15.
{cont.)
CPL
REFERENCE TAELE
COMPATIBILITY
mands may result in a program abort.
For additional information see KRETURN/RETURN TC
(IX.8).
For additional information see FILE (X.1)
CPU--6 - (contains no sector pointers.
For adcitional information see FILE (X.1)
nter error.
faster than random-sganned; random-sgenned
file doesn't waste disk space, but is
slower than randor.
may or may not be buffered; rancdom-sparnesd
. waste disk space, but requires a larze
buffer.
For additional information see FILE (X.1).
Type "B" or Type "C" files.
40 C.
For additional information see FILE (X.1)
393 bytes - Type "A" and Type "B" files
<!-- page 33 -->
15.
16.
17.
18.
CpL
REFERENCE TABLE
COMPATIEBILITY
(cont.)
395 bytes - Type "C", random
Type "C", 4- and 6-byte indexed
2048 bytes - Type "C", random-spanned
Type "C", VSI
CPU-A - maxinum file record size is -
398 bytes - Type "A" and Type "B" files
400 bytes - Type "C", random
Type "C", 4- and 6-byte indexed
2048 bytes - Type "C", random-spanned
Type "I", VSI
For additional information see FILE (X.1l).
file is open for input or output. It will
allow either input or output at any time
after the opening no matter how the file
was opened.
opened the file; only that type of access
may be wused to open the file.
For additional information see QOPEN (X.2).
CPU-S5 - does not allow the SETFORM command.
CpPU-6 - allows the SETFORM command.
For additional information see SETFORM (X.6).
be used with Type "C" random-spanned or VSI
files.
with Type "C" random-spanned or Type "I"
VST files.
For additional information see READB (XII.l), WRITEB
<!-- page 34 -->
. Revision 03/15/83
19,
20.
21.
22.
CpPL
REFERENCE TAELE
COMPATIBILITY
result in errors when used with Type "C"
random-spanned or VSI files. Use GETR/PUTR
and HOLDR/FRER in this instance.
result in errors when used with Type "C"
random-spanned or Type "I" VSI files. Ho w-
ever, to insure CPU-5 compatibility, wuse
GETR/PUTR and HOLDR/FRER.
For additional information see READB (X11.2),
WRITEB (XII.3), HOLD/FREE (XII.4), GETR (XIT1.1),
HOLC/FREE table is equal to 6 times the
number of partitions on the system.
erated.
For acdditional information see HOLD/FREE (XII. ).
provided.
CPU-€ - operating systen
tion adjustment.
For additional information see
and -- stores system time as
For additional information see
XX1
pProvides automatic parti-
LOAD (XIV.3).
1/20,0CC of a seconc
1/10 of a second.
GTIME (XIvV.6).
<!-- page 35 -->
CPL
REFERENCE TABLE
COMPATIBILITY
I   B REEBEEEN RE SRR EERERE R R ERE SRR RS RS REES REEREESESSERISESEERS]
WARNING
IZEE R R RS E RS EER REE R ER SRR RS R R R R R R R R R R EREESEEERNSSERERIEESERE;
The latest version of CPL (12/81l) contains important differences
from earlier versions. These differences include:
1. Offsets - offsets must be in brackets to indicate assem-
bler expressions. For example:
CALL SUBR ([VARI+OFFSET], VAR2)
Data fields =- data field 1locations 1in IF and assign-
ment statements have changed  positions. Therefore, Iin
any program containing assembler code which stores data
in an IF or assignment statement during execution, it may
be necessary to modify assembler offsets.
Program Labels - program . labels which begin with the
same (characters as new CPLII keywords will no longer be
legal. These keywords include ADRLST, CURSOR, ENDDO,
ENDLOOP, EQUATE, LOOP, LOOPWHILE, ORIGIN, RETRIEVE.
EXP=A, EXP=B, EXP=C, EXP=D - both the o0ld CPL and new
CPLII complier are accessible at the present time. Pro-
grams using EXP=A or EXP=B are handled by the old CPL
compiler; additionally, if the EXP option 1is not used
as part of the SYSTEM statement, the program is handled
by the old CPL compiler.
Programs compiled by the CPLII compiler must specify
EXp=C (CPU-S5 (code or CPU-5 code with CPU-5 compatible
offsets) or EXP=D (CPU-6 code) in the SYSTEM statement.
NOTE: CPL will be supported until January 1, 1984, to
allow for (conversion of existing programs. All
new programs, however, should be handled by CPLII
using EXP=C or EXP=D.
. Revision 03/15/83
- XX11
<!-- page 36 -->
PAGE
0000
011D
011D
011D
011D
O11D
11D
011D
011D
011D
011D
Clivu
011D
0110
011D
011D
O13B
1B
GapF
04C3
ac3
0474
0478
04678
Qs78
0678
0673
04783
D67C
0&E0
o684
o438
&89
N&39
O4ED
UL58
04°C
OAED
[AY-Y-D
[S2SY-D)
OC4A1l
[eT Y0t
[e2-Y-BY
06BC
06BC
osBC
O6BC
068
046C8
046D0
1 ERRORS (o]
cpPL
SAMPLE PROGRAM
ASSM 6.04 11/17/81 10:08:14 MASTER FILE UPDATE
 SYSTEM(EXP=D)
L3
@1 NOTES:
L3
.'.000'00'0'..0".00.00.0.00.0.0.0.00.000000..00000000000000"
'y PROGRAM L INKAGE
```
.(..00'.'.0' QC..000.00.0000..'0.0.0.0.00'.0'09000..0ON
.t
```

 \#EXTERNAL GETK.GETR.PUTR
L3
0:OQOQQQQCOOC.QO'QO..0000000000000"0.0000000060009000.0000'0-
L 3] FILES
```
.Il'000000000.000.000000.00000.00000000000000000000000.00000r
.
```

eFILE CRT!SYSIPT
```
.y
 FILE MASTER:SYSO,IND.CLASS/2,KEYaMKEY
```

 SET MKEY: 0
.t
oF1LE TRANS:SYSI.RND.CLQSS-Z.RECSIZ-19.KEY-TKEY.BUFFER-AO0.0
 SET TKEY: O
L 31
B 0000000008000 0000000 0080080000003 0000000000800000000000s
```
.y RECORDS
.'00'0.00"0.0.00000.0'0'0.'00'0...000000000"000000000000000
.y
```

eRECORD MREC(12)
```
  INTEGER MCLASS
  INTEGER SALES
```

e INTEGER INDEX
\*ENDREC
'y
\#RECORD TREC(19)
```
  STRING PRODUCT(10)
  INTEGER TCLASS
  INTEGER QUANTITY
```

SENDREC
.
I'0000000000000000000000000'000000000000000000000000000000000
L4 LOGIC
'( 00.0.0000..000.0 00'00.000000000000.0.0006..000000o
[ 2] :
SENTRY
.
e INITIALIZATION
ey
 OPEN 10 (CRT.MASTER. TRANS)
Y
 °MSG e- "MASTER RECORD UPDATED" "
/TBLPUT MSG(1)
XX11i
<!-- page 37 -->
PAGE
0o4D8
Q&EQ
O&4ESB
OLFO
O&FS
O&F8
0709
071%
071F
Q749
074C
074C
0736
0740
07&0
0740
0740
07&6
0771
0778
0786
n760
07 8
O7E3
O07EA
O7F |
Q7% F
Cs5e
Ccald
0219
0233
0333
035B
0643
Uaés
[SL Y
o131
Vil
[PERa ]
OS(E
Cesl
[VE-TIY
Oael
U3el
Ve
Ox/y
QavT
0s)-3
o83
0873
oe98
2 ERROKS o]
CPL
Sample Progranm
ASSM 6.04 11/17/61 310:08:114 MASTER FILE UPLDATE
\*'MSC' =" "NO UPDATE - CLASS NOT EQUAL- "
eTELPUY MSG(2)
\*°MSC e "NQ IJFDATE = INDEX NOT EQuUAL'"
eTBLPUT MSG (3)
L}
eLOOP MCLASS(1.9)
SWAITE(CRT,FO!) "ENTER CURKRENT PRICE FOR CLASS ,MCLAS
eREADICRT.FO2)PRICE
SFRICE(MCLASS)=PRICE
 END LOOP
LX)
\*WRITE(CRT.FO!1)"ENTER INLEX FOR THIS UPDATE
 READ(CRT.FO2)TINDEX
ot
o) UPDATING
e
\*READB (TRANS.TREC)
oLOUP WHILE (TCLASS.GT.O)
e CALL GCETK(MASTER.PKODUCT)
e IF (STATUS) GO TO ELCOP
  CALL GETR(MASTER.MREL)
IF (STATUS) GO TO ELOOP
IF (TINDEX,EQ.INDEX) IF (MCLAZS,.EC.TCLASS) DO
SALES SALES+\* (QUANTITY PRICE (MCLALS) )
CALL GCETR (MASTER.PRODUCT)
IF (STATUS) GO TO ERAUK
CALL PUTR(MASTER,.MKEL)
IF (STATUS) GO TO ERROR
CALL ME33ACE ()
COUNTes COUNT+1
END DO
ELSE CALL MESSAGE(2)
  ELSE CALL MESSAGE (3)
eERROR1
  WRITE(CRT.FOZ)I ERROUR ON UPDATING FRUDUCT: FRODUCT
\*ELOOP:
 INCR TKEY
eREALB( TRANS, TREC)
\*END LODP
L
et TERMINATION
.
\*ONE 1 .
  WHRITE(CRT.FOZ) UPLATE COMFLETED: . TVEY-1. TRANSACTIUN RECJRDS READ "
  WRITE(CRT.FO4)I)COUUNT, "MASTER KECCKDS UFDATED"
eSTOP .
.
[ 21 QQO'C."'".0"000..00'0.0..0'0"0"'0.'0'..".00.'000QO0.0000'00"."
o} SUBEROUTINES
@ 0000000000000 0000 000000 R ININREtEreletiacceitteseeerIIeetessctecseotonce
v)
6
&
&
60
0
0
00
XXiv
<!-- page 38 -->
PAGE
0898
o8s8
0ees
08B1
0EBS
08C2
03C3
o8Cs
03C3
08C3
08C3
03C3
oBCA
o8lE
( 1-16]
OBEE
QeF2
OeF 2
0718
oys7
OvE?
OSEF
0973
UYSs
O&ED
CAED
3 . ERRORS
0643
(] ASSH 6.
L 21
04 11/17/81 10108:14
 SUBROUTINE MESSAGE
eRETRIEVE (NUMBER.S)
eTBLGET MSG(S)
\*WRITE(CRT.FO1)MSGC
\*RETURN
L 21
CPL
Sample Program
B B PP et 0 00000000000 00000000 00000l teTtIeeErsetssesesesstcsesstosne
FORMATS anND STORACE
et .00'..".'..."0..'.'.."'.0..0'.' 'Q'..O.." 00.'.'000000'."00
ot
eFORMAT
eFOKMAT
oF ORMAT
oFURMAT
\*FORMAT
LA
FO1:1C29.N4
FO2:N4
FO3:C17.x2.D4a.x2,C24
FO4A:X19,N4,X2,022
FOSi1C28.C10
eTAELE FRICE(8)
\*TABLE mM3G(27.81)
et
 INTEGER TINLEX.S
\*SET COUNT: O
'Y
SEND
PRINT ON
END e:e
XAV Revision 03/15/83
<!-- page 39 -->
CPL
## Chapter One: INTRODUCTION
I.1 CPL
CPL (Centurion Programming Language) is an English-orientated,
complex computer language. While CPL bears similarities to
COBOL, FORTRAN and PLl, it is a unique language with distinct
I.2 CPL Jobstreams
The CPL compiler is invoked by one of the following:
run on the CPU-6 for the CPU-6
run on the CpPU-6 for the CPU-4,
CPU-5 or MICRO PLUS
run on the CPU-5 or MICRO PLUS for
the CPU-5 or MICRO PLUS
1. P.CPL/P.SCPL
2. P.CPL5/P.SCPL5S
3. S.CPL/S.SCPL
P.CPL (P.CPL5 or S.CPL), which 1links from source through
relocatable to executable, compiles a main program; P.SCPL
(P.SCPL5 or S.SCPL), which terminates after the compiler process
leaving a relocatable file, compiles a subroutine.
The structure of the P.CPL/P.SCPL jobstrean (CPU-6) is outlined
in the following:
(P.CPL] [P.SCPL] file d prt [LIB] [XREF]
file - name of the source file without
the leading "Z";
Note: The Jjobstream generates the
initial "z"; it should not
be added by the programmer.
The jobstream also generates
an initial "X" to indicate
an executable file and an
initial "R" to indicate &
relocatable file.
d - number of the disk which contains
the file;
prt - name of the device (ie., printer,
spooler, CRT or DUMMY) to be util-
ized during printing.
<!-- page 40 -->
CPL
### Introduction
Note: If DUMMY 1is specified, no
' hard-copy program listing
will be generated after a
compile. However, run-time on
the compiler will be much
faster than that generated by
any print device.
The keyword LST may also be used
causing the jobstream to use file
@LST#I ON #S. Listings generated
by LST are placed into a Type "A"
file which may be sent to a
printer by the XLST utility.
Note: If errors exist within a pro-
gram, the LST option results
in the PSCAN utility scanning
the listing for errors. Addi-
tionally, LST causes an auto-
matic transfer to text upon
exit from PSCAN.
LIB - optional keyword which indicates
the presence of a copy library;
XREF - optional keyword which indicates
that a cross-reference table will
be output listing program labels,
locations and a 1listing of all
program references.
Note: If XREF 1is not stated, a
sorted reference of all pro-
gram labels will be output at
the end of a compile.
I.3 CPL Processing
The CPL compiler is a single-pass facility. As such it operates
by reading one line of source file (i.e. Type "A" (file) and
generating that line in assembler /code. This process is
repeated for each 1line wuntil the (compilation process is
complete.
<!-- page 41 -->
CPL
### Introduction
NOTE: This single-pass feature results in limited
error detection. Syntax errors in the CPL
command, undefined labels and and multiply-
defined labels are among those errors de-
tectable by CPL. Illegal use of data items
is not detected.
An option which may occur at this point in the processing of CPL
is the addition of copy libraries to the compiler. While any
number of copy libraries may exist, only a maximum of 13 may be
included at one time.
After compilation, the source file is read by assembler program
XASSM and converted into binary instructions which are passed to
the 1linker. During this process a listing of this program is
output to the device specified in the CPL jobstream.
External subroutines may also be joined to the program at this
time. The wutility program XLINK performs this function by
linking sections of code stored outside the program in
subroutine libraries (i.e. OSLIB and APLIB) to the main program.
Subroutine libraries function as a means to reduce program size.
NOTE: APLIB routines are called directly by the
programmer with a CALL statement. OSLIB rou-
tines are (called indirectly with the CALL
being generated by the compiler.
I.4 CPL Execution
Two JCL commands (.USE and .RUN) are wused 1in the execution
process. .USE assigns the device or file to a logical unit.
Once assigned, the device/file may be accessed eilther by a
program or by the operating system.
.RUN passes control of a partition to an executable file. This
sets the step flag and prevents the partition from being stopped
from outside while the program is running. In addition, this
step flag also causes end-of-step processing at the termination
of the program. For additional information on .USE and .RUN see
the Job Control Language Manual.
<!-- page 42 -->
CPL
## Chapter Two: CPL CONCEPTS
### OVERVIEW
Only certain types of data may be used in a computer program.
Literals, variables and expressions are all means of structuring
data for use in a CPL program.
<!-- page 43 -->
Literal
IT.1 Literal
II.1.1 Usage
A literal is a quantity which remains constant throughout the
execution of a program. A literal may be used in place of a
variable name or expression.
NOTE: For further information on the specific use
of literals, consult individual command for-
mats.
Literal types include 1) string 1literals and 2) integer
literals.
String Literal
A string literal is an ASCII character string enclosed by single
quotation marks ( ' ).
Note: To represent 'a single gquotation mark within
a character string, two single gquotation
marks are used. For example, the display
TWO 'TOO! would result from 'TWO ''TOO''"!
being entered.
Integer Literal
An integer literal is a sequence of digits which may be preceded
by a leading positive (+) or negative (=) sign. Quotation marks
and decimal notation are not allowed.
The size of the integer literals is determined by its value.
      Integer Literal Positive Range Negative Range
l-byte integer +127 -128
literal
4-byte integer +128 -129
literal to to
+2,147,483,647 -2,147,483,648
6-byte integer +2,147,483,648 -2,147,483,649
literal ' to to
+140,737,488,355,327 -140,737,488,355,328
<!-- page 44 -->
Note:
CPL
Literal
Commas are included 1in this 1instance only
for purposes of /clarification. The only
punctuation marks allowed are leading "+"
or "-" signs.
A 1- or 4-byte literal may be stored as a 6-byte literal by
adding an initial "?"; addition of "?" does not alter value.
For example, a literal 0 (zero) would generate a l-byte literal.
A literal 20 (zero) would generate a 6-byte literal containing 0
(zero) .
Note: A 4- or 6-byte literal or string literal is
stored in the object prograem one time only
regardless of the number of times it may be
referenced. One-byte literals are stored in-
line and do not require such optimization.
<!-- page 45 -->
Variable
I1.2 Variable
IT.2.1 Usage
A variable is the label of a data area whose wvalue may change
during the execution of a program. A variable may be used in
place of a literal or expression. Variable names begin with an
alphabetical character or a "?"; the remaining characters in the
name can be alphanumeric, "?" or "@".
Variable types include 1) string wvariables and 2) integer
variables.
String Variable
A string variable is the name of a non-numeric gquantity made up
of ASCII characters.
Integer Variable
An integer variable is the name of a numeric quantity.
I1-4
<!-- page 46 -->
Expression
I1.3 Expression
IT.3.1 Usage
An expression allows multiple operations to be combined within a
single statement. In most instances an expression may be used
in place of a literal or variable.
Expression types include 1) string expressions, 2) integer
expressions and 3) assembler expressions.
String Expression )
A string expression is a string variable name or group of string
variable names combined by the concatenation operator (+).
Note: String expressions are allowed only in
string assignment statements.
If a string literal is present in an expression, that expression
must be in double quotation marks ("). If string variables only
are present in the expression, that expression must be in single
guotation marks ('). An example of an expression containing a
string literal would be:
"A + 'LIT'"
whereas an expression containing only string variables would be:
'A + B!
Integer Expressicn
An integer expression may be composed of 1) variable names, 2)
integer literals, (3) the addition, subtraction, multiplication
or division operators, (4) parenthetical expressions (to a
maximum of 16 levels) and 5) built-in functions (i.e. ABS, LEN,
MAX, MIN, MOD, ROUND, SGN).
Note: Integer expressions are evaluated from left-
to-right except where altered by parentheses
and/or by built-in functions. Integer
math is performed in all instances; no re-
mainders are carried nor are decimals pro-
cessed.
<!-- page 47 -->
CPL
Expression
Assembler Expression
An assembler expression is any sequence of symbols which |is
passed unmodified to the assembler. Binary and hexidecimal
expressions are allowed; for example, [X'FF83'] is treated as &
literal expression.
Note: Assembler expressions must be enclosed in
brackets ([]) unless otherwise specified.
I1-6
<!-- page 48 -->
CPL
## Chapter Three: PROGRAM CONTROL
### OVERVIEW
Certain commands control the set up of a program in addition to
entry and exit. Code generated by these commands is mandatory
and generally must occur in predetermined positions within the
program.
NOTE: The .commands included in Chapter Three are
the only mandatory CPL commands. Every other
statement in CPL is optional.
ITII-1
<!-- page 49 -->
SYSTEM
I1I.1 SYSTEM
III.1.1 Usage
The SYSTEM command marks the beginning of a CPL program or
subprogram. In addition to starting the program, SYSTEM defines
the CPL program or subprogram, generates the overhead data areas
that CPL uses (i.e. working storage) and sets up the default
names.
NOTE: SYSTEM is a declarative command and must not
occur within the logic section of the pro-
gram.
The SYSTEM command is normally the first statement in a CPL
program or subprogram. Every CPL program/subprogram must
contain a SYSTEM statement; however, only one statement per
program/subprogram is allowed.
Only CPL commands which directly affect the assembler, and 'do
not generate object (code, may precede SYSTEM. These commands
include TITLE, PRINT ON/PRINT OFF,COM/PRINT OFF, DIRECT, CFPL,
COPY, SPACE, and PAGE EJECT/EJECT. TITLE, however, is normally
the only statement to precede SYSTEM.
A SYSTEM command which contains the MAIN keyword adds 13 bytes
to the length of a program; additional bytes are added equal to
the amount included in the line length section (i.e. LL=n). A
SYSTEM command which contains the SUBPGM keyword adds does not
add to program length.
II1.1.2 Command Format
The format of the SYSTEM command differs between the CPU-5/CPU-6
systems. Refer to the appropriate command format and the
explanation included in this section before implementing SYSTEM.
SYSTEM [name] [([(parameters)]
NOTE: Parameters for the CPU-5 SYSTEM command
include type, LL=n, EXP=A, EXP=B, EXP=C,
EXP=D.
IT1I-2
<!-- page 50 -->
CPL
SYSTEM
SYSTEM [name] [(parameters)]
NOTE: Parameters for the CPU-6 SYSTEM command
include: type, LL=n, EXP=A, EXP=B, EXP=C,
EXP=D, STACK=nnn.
name - external name of the program/sub-
program;
type - keyword MAIN or SUBPGM;
n - maximum number of (haracters to be
stored in the progtam line buffer;
A - uses OPSYS service calls and in-
sures compatibility with CPU-5
source code (CPL compiler);
B - generates CPU-6 assembler code
(CPL compiler);
C - uses OPSYS service calls and in-
sures compatibility with CPU-5S
source code (CPLII compiler);
D - generates CPU-6 assembler code
(CPLII compiler);
nnn - number of bytes in the stack.
If any of the optional forms other than "name" are 1included,
they must be enclosed in parentheses. If more than one optional
form 1is included within the SYSTEM command, commas must be used
to separate the entries contained within the parentheses. For
example:
SYSTEM MOD (SUBPGM, EXP=A)
Program Name
A program "name" should be specified; however, 1if none 1is
present, @CPL is the default. \*
Note: Although a default name is provided, a name
should be specified to avoid multiple re-
locatable or executable  programs named
@CPL. Also, it is important to note that
the SYSTEM "name" does not need to be the
the same as the JCL filename for the
source program. The SYSTEM "name" 1is an
internal, logical 1label for the program.
<!-- page 51 -->
CPL
SYSTEM
Program Type
Program "type" may be either MAIN or SUBPGM. MAIN, which is the
default, indicates a main program. I1f specified, the SYSTEM
command defines the program line buffer, provides the external
name of the program and creates ZERO and STATUS with initial
values of zero (0).
Note: Execution of a MAIN program begins with an
ENTRY command. For additional information
see ENTRY (III.2).
If the keyword SUBPGM is used, one of two subprogram types (i.e.
an overlay program or an external subroutine) is specified.
SUBPGM generates an external reference to ZERO and STATUS, but
does not define them.
Note: Since a subprogram contains no ENTRY
commands, execution begins at the SYSTEM
statement. A subprogram may be loaded
by the CPL LOAD command or linked into
a program from a binary library file. For
additional information see LOAD (XIV.3).
Program Line Buffer
LL=n sets up the program line buffer wused for formatted
input/output. Default 1line buffer size 1is 132 characters;
output/input greater than 132 will be truncated at 122.
However, the line buffer may be set larger or smaller to
accomodate individual needs.
Note: It may be necessary to state LL=n with those
printers which operate on compressed print
capabilities and with formatted output to a
Type "A" file.
Expansion C/ Expansion D
The Expansion C (EXP=C) and Expansion D (EXP=D) options are used
with the CPU-6 SYSTEM command. EXP=C generates assembler code
so that label or data offsets will be the same for both CPU-5
and CPU-6. This guarantees source code compatibility between
the 5 and 6 operating systems.
EXP=D generates assembler code without guaranteeing
compatibility between 1labels or data offsets. If a program
<!-- page 52 -->
CPL
SYSTEM
Expansion C/Expansion D (cont.)
contains embedded assembler, it may not be source code
compatible with the CPU-5 when EXP=D is used. However, an EXP=D
program will operate 50% to 90% faster than an EXP=C program.
The EXP=C and EXP=D options may also be used with the CPU-5
SYSTEM command. On the CPU-5, however, EXP=C and EXP=D will
compile identically.
In all cases, EXP=C or EXP=D indicate use of the most current
CPLII (compiler. EXP=A and EXP=B are obsolete and are supported
only for purposes of compatibility with existing CPL programs.
EXP=C and EXP=D should always be used for new development.
Note: EXP=A is the default if no option is given.
STACK
The "stack" option is operative only with the (CPU-6 SYSTEM
command. STACK=nnn defines the size of the stack; 140 is the
default.
The ENTRY command sets up the stack pointer on both the CPU-5
and CPU-6 systems. On the CPU-6 this stack area is at the lower
end of the partition (i.e. the front of the program). Its size
is defined by the STACK=nnn option on the SYSTEM command.
On the CPU-5 the stack area is at the high end of the partition
and grows towards the end of the program. Consequently its size
depends wupon the size of the partition and the size of the
program. For additional information see ENTRY (III.2).
Note: The ENTRY command sets the stack pointer for
both CPU-5 and CPU-6 systems.
I71.1.3 Cautions
1. Neither ZERO nor STATUS should be used for
temporary storage. If ZERO 1is assigned any
other wvalue but 0, the wvalue of STATUS may be
affected.
<!-- page 53 -->
ENTRY
I11.2 ENTRY
III.2.1 Usage
The ENTRY command indicates the master program starting point.
It also sets up communication between the program and operating
system.
NOTE: For information on how the ENTRY command is
used to establish "stack" area, refer to
section III.l.2 (STACK) of the SYSTEM com-
mand.
ENTRY may appear anywhere in the program; the statement
immediately following the command ' word, however, must be
executable. Additional code may precede the ENTRY command in
the source program as long as control is properly transferred
between sections of the program.
NOTE: The JCL .RUN command passes control to the
ENTRY statement. Program execution begins
with the next statement following ENTRY.
The ENTRY command is required within a MAIN program; it may be
used only once. The ENTRY command may not be used within a
SUBPGM. The starting point of a SUBPGM 1is the statement
immediately following the SYSTEM statement. For additional
information on MAIN and SUBPGM, see SYSTEM (III.l.2, Program
Type) .
The ENTRY command adds 27 bytes to the length of a program.
I171.2.2 Command Format
<!-- page 54 -->
STOP
III.3 STOP
III.3.1 Usage
The STOP command terminates the CPL program and 1indicates a
return to JCL. STOP returns control to the operating system for
end-of-step processing. The value of the Completion Code (CC)
may also be set by STOP.
NOTE: STOP is an executable command and must occur
within the 1logic section of the program.
There is no limit on the number which may be
used within a given program.
If a literal is used for the code, the STOP command adds 4 bytes
to a program. If an expression is used, the number of Dbytes
added to the program variles according to the complexity of the
expression.
Program Logical Units
End-of-job processing turns of f the step flag before checking
all files assigned to Program Logical Units. Those files with
PASS parameters remain assigned; those files with DELT
parameters are deleted. All other Logical uUnit Blocks are
released and control is returned to SYSRDR.
III.3.2 Command Format
STOP [code]
code - integer variable, integer literal
or integer expression whose value
is to be assigned to the parameter
CC.
Completion Code
The integer parameter Completion Code (CC) has a range from 0 to
555, Standard CC values include:
0 Normal termination
1-16 values set by STAT (an APLIB subroutine)
100 I1/0 or program-controlled error
I1I-7
<!-- page 55 -->
CPL
STOP
Note: If the integer variable, integer literal or
expression is not within the 0-255 range,
binary truncation will occur.
If a value of less than 0 is specified by the STOP command, the
Completion Code remains unchanged. If no value is specified,
the Completion Code remains unchanged.
<!-- page 56 -->
END
I11.4 END
1I1.4.1 Usage
The END command marks the end of a CPL program. It also defines
the character strings EJECT, VTAB and BEEP.
END is a directive to the compiler indicating the end of the
compilation process. Every CPL program must contain an END
which must be the last statement in the program.
NOTE: A syntax error will be generated if the END
statement is omitted.
END also generates an wexecution record" which indicates that
the program 1is completely 1loaded and that execution should
begin. The command also specifies the address of the ENTRY
statement. If any storage areas were created by the compiler
for subtotals in integer expressions, these areas are defined as
part of the code generated by the END statement. Additionally,
areas for all literals and remainders are defined.
EJECT - Top-of-Form Command
EJECT is defined as a l-character string variable containing the
ASCII form feed character (hexadecimal 8C). This form feed
character causes top-of-form when sent to a printer; it causes
the screen to be cleared when sent to the CRT and places the
cursor at home position. EJECT is generally used with the WRITE
command or with MSG, an external subroutine.
VTAB - Vertical Tab Control
VTAE is defined as a l-character string variable containing the
ASCII wvertical tab character (hexadecimal 8B). This vertical
tab character causes a printer to sSpace to a predetermined
position. This position is set by the printer's Vertical Format
Unit.
Note: Not all Centurion printers are equipped with
V.F.U. The VTAB option is not operational in
these instances.
BEEP - Bell Character
BEEP is defined as a l-character string variable containing the
ASCII bell (character (hexadecimal 87). This character 1is used
to create a sound by some CRTS/printers.
<!-- page 57 -->
CPU--5/CPU-6
CPL
END
I11.4.2 Command Format
END
I1I.4.3 Cautions
1. The END command, unlike the STOP command, will
not terminate program execution. END is used to
indicate termination of the compiler process.
For additional information see STOP (III.3).
2. When EJECT 1is used to generate a form feed, it
must be the only item on a line. Data follow-
ing EJECT in this instance will be lost.
I11-10
<!-- page 58 -->
CpPU-5/CPU-6
CPL
## Chapter Four: COMPILER DIRECTIVES
### OVERVIEW
Compiler directives are not part of the CPL progream. They are
commands to the compiler and generate no code.
Iv-1
<!-- page 59 -->
TITLE
Iv.l TITLE
Iv.l.1 Usage
The TITLE command-is used to print a title (or  phrase) at the
top of each page of the program listing.
The command issues a form-feed to the output 1listing before
printing the title. This title is then printed at the top of
every page until another TITLE command is found. If the first
statement is not a TITLE command, a default title composed of
blanks is used.
Although TITLE is usually the first command in a  /rogram, the
command may appear anywhere in the program as many times as
needed. In lengthy programs additional TITLE commands may be
included to indicate subsections of the program.
Iv.l.2 Command Format
TITLE 'title!'
title - information (contained 1in a 1-7 
character string which is to
appear at the top of each page.
Iv.1l.3 Cautions
1. TITLE does not place a title on the report gen-
erated by the program. It is used to place a
title on a source listing.
Iv-2
<!-- page 60 -->
DIRECT/CPL
Iv.2 DIRECT/CPL
Iv.2.1 Usage
The DIRECT command indicates that subsequent commands in & CPL
program will be in assembly language. The CPL command indicates
a return to CPL language.
DIRECT
DIRECT sets a flag in the (compiler which causes subsequent
commands to be passed directly to the compiler in assembler
source code. While these commands are not translated, they are
read by the compiler.
Note: The DIRECT :ommand also generates a PRINT
ON command. For additional information see
PRINT ON/PRINT OFF, COM/PRINT OFF (IV.3).
CPL .
The CPL command turns off the flag in the compiler set by DIRECT
and the compiler resumes operation.
Note: The CPL command also generates a PRINT OFF,
COM command. For additional information see
PRINT ON/PRINT OFF, COM/PRINT OFF (IV.3).
IV.2.2 Command Format
- DIRECT
or
CPL
IV.2.3 Cautions
1. When programming in assembly language on the
surrounding program but all partitions on the
system.
2. Assembler (coding may be added to a CPL progran
using the DIRECT/CPL option. Inclusion of
assembly 1language 1is not a recommended pro-
cedure, however.
3. ESP 1is an obsolete predecessor of the CPL com-
mand. While it 1is no 1longer used, it may be
referenced in some programs.
IvV-3
<!-- page 61 -->
PRINT ON/
PRINT OFF,COM/
PRINT OFF
Iv.3 PRINT ON/PRINT OFF,COM/PRINT OFF
IvV.3.1 Usage
The PRINT ON command notifies the (compiler to display the
generated assembler statement; the PRINT OFF, COM command allows
the printing of CPL statements only (i.e. the normal print
situation); the PRINT OFF command results in compilation with
nothing being printed.
NOTE: CPL commands appear in the compiler listing
preceded by an asterisk (\*).
There is no limit to the number of times PRINT ON/PRINT OFF,
COM/PRINT OFF may be used. These commands may occur anywhere in
the program, as many times as needed.
Iv.3.2 Command Format
PRINT ON
or
PRINT OFF [,COM]
IV.3.3 Cautions
1. An average of ten or more lines of assembly
language is generated for each CPL command. The
use of PRINT ON can cause the compiler listing
to be extremely lengthy.
Iv-4
<!-- page 62 -->
PAGE EJECT/
EJECT
Iv.4 PAGE EJECT/EJECT
Iv.4.1 Usage
The PAGE EJECT/EJECT command causes the compiler to issue a
top-of-form command to the device/file to which the source
listing 1is being output. PAGE EJECT/EJECT affects program
listings only and is not a method to cause page ejection during
program execution. For additional information on page ejection
during program execution see WRITE (XI.3).
Iv.4.2 Command Format
PAGE EJECT
or
EJECT
<!-- page 63 (front-matter table of contents, omitted) -->
<!-- page 64 -->
Iv.6 COPY
Iv.6.1 Usage
The COPY command allows specific portions of code to
COPY
be joined
into a source program from a file outside that program. The
specified code is inserted into the program during
at the location of the COPY statement.
NOTE: On the CPU-5 copy member processing
exclusively by CLPRP, a separate
is done
utility
program. Execution of CLPRP is built into
the jobstreams S.CPL/S.SCPL. On the CPU-6
copy member processing 1is done by the CPL
compiler.
IV.6.2 Command Format
COPY label [SY/YSn]
label - name assigned to that portion of
the library to be joined
source program;
to the
Note: The label must be 6 charac-
ters in length and may be
composed of any ASCII char-
acter. Trailing blanks are
allowed; however, the first
character of the 1label may
not be a blank.
SYSn - specified 1logical wunit number to
which the library is assigned.
Subfile
If a subfile is used, it may be assigned to any 1logical  unit
from SYS2 through SY/S15;  SYS2 is the default. Multiple copy
libraries may be assigned by using more than one of the logical
units mentioned above.
Note: If more than one copy library is included
in a program, it must be preassigned before
initiating P.CPL. Additionally, SYSn must be
included. If only one copy library is in-
cluded, SYS2 1is the default; SYSn need not
be included.
Iv-7
<!-- page 65 -->
IV.6.3
CPL
COPY
### Cautions
1. I1f COPY statements are part of an application,
the appropriate copy libraries must be avail-
able.
A COPY statement 1is wused for file layouts,
record layouts and small subroutines only.
To insure CPU-5/CPU-6 compatibility when using
COPY statements, use a discrete Type "A" file.
Iv 1 [o4]
<!-- page 66 -->
Comment Line
IVv.7 Comment Line
Iv.7.1 Usage
The semicolon (;) functions as the comment character. Inclusion
of ":" as the first non-blank (character on a 1line allows 14
commentary and blank 1lines to be added to the source listing.
Comments are output to the listing by the compiler, but are not
translated.
The maximum size of a comment line depends upon the line in
which 1t occurs. When ";" occurs after a CPL command, output
will begin with column 38 on the compiled listing. If the first
non-blank character on a line is a comment character, that 1line
will be printed verbatim.
Comments do not add to the size of a program.
Iv.7.2 Command Format
; [comment]
or
[label:] [lstatement] ; [comment]
or
[label:] ; [comment]
comment - text which will be output to the
listing;
label - name assigned to any CPL state-
ment;
statement - any CPL command.
Iv-9
<!-- page 67 -->
Continuation
Line
Iv.8 Continuation Line
Iv.8.1 Usage
The hyphen (-) functions as the continuation character.
Generally used with string data, inclusion of a "-" as the last
item on a line of CPL code allows that 1line to be divided
between two or more records of the source file.
When the CPL compiler reads from the source file, it transfers
deblanked data into a 300 byte buffer area. If a "-" (followed
by carriage return or comment character) 1is encountered, the
next record from the source will be wused as input to this
buffer.
This transfer process continues until a normeal terminator (i.e.
a carriage return or comment character not preceded by a hyphen)
is found or the 300 byte buffer area is filled. There is no
limit on the number of continuation lines used within a program,
as long as the 300 character maximum is not exceeded.
NOTE: This 1limit does not include comments or
blanks unless the blanks are included in a
character string.
IvV-10
<!-- page 68 -->
Reverse
Slash
IV.9 Reverse Slash
Iv.9.1 Usage
The reverse slash (\\) allows multiple CPL statements to be coded
on the same source code line by inserting a "\\ " between those
statements.
Iv.9.2 Cautions
1. ELSE must always be the first item on a line.
It may never be used within a multiple state-
ment unless it is the first item on the line.
Iv-11
<!-- page 69 -->
CpPU-5/CPU-6
CPL
## Chapter Five: PROGRAM LINKAGE
### OVERVIEW
Commonly used routines are often stored in a 1linker library.
These external routines may be linked to other programs; key
factors in this linkage process are "externals" and
"entrypoints".
An external is an address in one program or external routine
which is to be linked to another program. An entrypoint is an
address logically in one program/external routine, but
accessible from another program/external routine which has
defined it as an external. .
As long as they follow the SYSTEM statement, EXTERNAL and
ENTRYPOINT commands may be located anywhere in a CPL program.
Anything in CPL which has a label (i.e. data area, subroutine,
1/0 buffer, etc.) may be an external or entrypoint and there is
no limit to the number that may be added to a program. Since
both commands are actually compiler directives, they are not
executable commands and do not reserve memory.
NOTE: While EXTERNAL/ENTRYPOINT commands may be
located at any point in the CPL program,
readability is 1improved by grouping the
commands.
Linkage of external routines to another program is accomplished
by the linker-edit process. The utility program XLINK, run by
CPL jobstreams S.CPL (CPU-5) or P.CPL (CPU-6), is utilized for
this process.
<!-- page 70 -->
V.l
V.l.l
EXTERNAL
### Usage
EXTERNAL
The EXTERNAL command notifies the compiler that labels
within a program are defined as labels outside that program.
An EXTERNAL command does not increase program length.
1. The
Vel.2 Command Format
EXTERNAL label [,label, label...]
label - name of the external routine or
entrypoint within an external
routine.
Note: Although the label may be
1-255% characters in 1length,
the linkage editor uses only
the first 6. An EXTERNAL
label may contain more than
6 characters, but these first
6 must be unique.
Vel.o2 Cautions
linkage editor will not 1link the label
specified in an external command unless:
a.
" b.
Co.
the name of the label containing the entry-
point is specified as an external;
both the header and entrypoint are re-
ferenced within the program;
the "name" on the SYSTEM statement (i.e.
the external name of the program) is both
externalized and referenced.
Note: This last  provision is wvalid only
when a SYSTEM statement containing
the MAIN keyword is to be linked to
subroutines/subprograms.
For additional information see ENTRYPOINT (V.2)
used
<!-- page 71 -->
ENTRYPOINT
V.2 ENTRYPOINT
V.2.1 Usage
The ENTRYPOINT command notifies the compiler that 1labels which
may be wused as externals in other routines have been defined
within the program.
The program name on the SYSTEM statement Is automatically an
entrypoint and does not have to be declared as such.
NOTE: @CPL 1is the default 1if program name is not
specified 1in a SYSTEM statement. If label
names are not specified, the default will
generate a variety of relocatable modules
labeled ENTRYPOINT @CPL; this produces un-
certain results 1in the assignment of ex-
ternals and entrypoints. For additional in-
formation see SYSTEM (III.1l).
An ENTRYPOINT command does not increase program length.
V.2.2 Command Format
ENTRYPOINT label [,label, label...]
label - specifies an address that may be
referenced by an external program.
Note: Although the 1label may be
1-255 (characters 1in length,
the linkage editor uses only
the first 6. An EXTERNAL
label may contain more than 6
characters but these first
6 must be unique.
V.2.3 Cautions
l. The 1linkage weditor will not 1link the label
specified in an ENTRYPOINT command unless:
a. the name of the label containing the entry-
peint is specified as an external;
b. both the header and entrypoint are re-
ferenced within the program;
<!-- page 72 -->
CpL
ENTRYPOINT
c. the "name" on the SYSTEM statement (i.e.
the external name of the program) is both
externalized and referenced.
Note: This last provision is wvalid only
when a SYSTEM statement containing
the MAIN keyword is to be 1linked to
subroutines/subprograms.
For additional information see EXTERNAL (V.1)
<!-- page 73 -->
CPL
## Chapter Six: RESERVING MEMORY
### OVERVIEW
An executable program occupies a block of system memory when
that program is loaded. This block of memory contains
statements which reserve data areas such as buffers, tables,
integer strings and character strings. The executable form of
program commands 1is also stored in this memory block.
Space must be reserved for all the areas 'mentioned above.
Initial values may be assigned to integers and strings or a
specific number of bytes may be reserved without assigning
initial value.
vi-1 °
<!-- page 74 -->
INTEGER
Vi.l1 INTEGER
VIi.l.1 Usage
The INTEGER command reserves an area of memory for a 4- or
6-byte integer wvariable. The command may also be used to pass
data from one overlay to another. INTEGER, however, does not
initialize the wvariable; it only reserves storage space and
assigns a name.
NOTE: INTEGER may be used on the CPU-5 to pass
data from one program to the next since the
partition stays in the same menory.
The INTEGER command may be located anywhere in a program so long
as it follows SYSTEM. A program may contain as many INTEGER
statements as necessary.
NOTE: While INTEGER statements may occur at any point
in a CPL program, it is best to locate them in
one area separated from the logic section of a
programe.
Each INTEGER command increases program length. A 4-byte integer
increases the program by 4 bytes; a 6-byte integer increases the
program by 6 bytes.
vi.l.2 Command Format
INTEGER label [,label, label, ...)
label - name to be assigned to an integer
variable.
The difference between a 4- or 6-byte integer is based on the
name assigned to it. Integer names beginning with a "?", are
treated as 6-byte integers. 1Integer names beginning with any
other alphanumeric character are treated as 4-byte integers.
vIi.1l.3 Cautions
1. whatever is in memory when a program loads is
the value of the 1integer. INTEGER does not
automatically (clear a memory area to zero (0).
vi-2
<!-- page 75 -->
SET
VI.2 SET
VI.2.1 Usage
The SET command reserves an area of memory for a 4- or €-byte
integer. SET also assigns an initial value to the specified
integer.
The SET command may be located anywhere in a program so long as
it follows SYSTEM. A program may contain as many SET statements
as necessary.
NOTE: While SET statements may occur at any point
in a CPL program, it is best to locate them
in one area separated from the logic section
of a program.
Each SET command increases program length. A 4-byte integer
increases the program by 4 bytes; a 6-byte integer increases the
program by 6 bytes.
VIi.2.2 Command Format
SET label : n [,label:n, label:n, ...]
label - name assigned to the integer;
n - initial literal wvalue.
Note: The value assigned to a label
in a  SET statement must be a
numeric value; expressions
are not allowed. This wvalue
may be changed at any time
during program execution.
The difference between a 4- or 6-byte integer is based on the
name assigned to it. Integer names beginning with a "?2", are
treated as 6-byte integers. Integer names beginning with any
other alphanumeric character are treated as 4-byte integers.
vIi.2.3 Cautions
l. Unlike INTEGER, the SET command does not allow a
value to be left in memory from one overlay to
the next. For additional information see INTEGER
(Vvi.l).
<!-- page 76 -->
STRING
VI.3 STRING
VI.3.1 Usage
The STRING command reserves an area of memory for (character
strings of a specified 1length. STRING does not assign a
specific initial value.
The STRING command may be located anywhere in a program so long
as it follows SYSTEM. A program may contain as many STRING
statements as necessary.
NOTE: While STRING statements may occur at any
point in a CPL program, 't is best to locate
them in one area separated from the logic
section of a program.
variable Length Strings
All strings in CPL are "variable length strings" /consisting of
characters terminated by one byte of binary zero (i.e. the
string terminator). A string may be defined according to its
"memory length" (i.e. the maximum number of characters assigned
to a string) or according to its "true length" (i.e. the actual
number of character used up to the string terminator). CPL
utilizes "true length" by outputting the actual number of
characters used, regardless of the size of the assigned memory
length.
Each STRING statement increases program length by the toteal
number of characters in a string, plus an additional 1 byte for
the terminator of each string.
VI.3.2 Command Format
STRING label (n) [,label (n), label (n), ...]
label - name of the character string to be
reserved;
(n) - number of character in the charac-
ter string.
Note: A null string of zero char-
acters may be established.
It is used to (clear other
strings and output blank
lines.
<!-- page 77 -->
CPL
STRING
vi.3.3 Cautions
1. The length of a string is not checked before a
new value is assignéd. If the new value exceeds
the length at which the string was established,
the string will be extended into the next area
of memory.
5. Whatever is in memory when a program loads is
the value of the string. STRING dces not auto-
matically clear a memory area to 0 (zero).
<!-- page 78 -->
DEFINE
VIi.4 DEFINE
VIi.4.1 Usage
The DEFINE command reserves an area of memory for a character
string. The command also assigns an initial wvalue to that
character string.
The DEFINE command may be located anywhere in a program so long
as it follows SYSTEM. A program may contain as many DEFINE
statements as necessary.
NOTE: While DEFINE statements may occur at any
point in a CPL program, it is best to locate
them 1in one area separated from the logic
section of a program.
Each DEFINE command increases program length by the total length
of all strings, plus an additional l-byte for the terminator of
each string.
vIi.4.2 Command Format
DEFINE label:'string' [,label:'string', label:
label - name of the character string to be
defined; )
'string' - initial wvalue to be assigned to
the label.
211 alphabetical characters in the string are output as upper
case letters. Spaces and special characters are allowed.
Single quotation marks are not permitted, however, since they
are used as a delimiter for the string. For additional
information on the use of guotation marks within a string, see
vi.4.3 Cautions
1. The length of a string is not checked before a
new value is assigned. If the new value exceeds
the length at which the string was established,
the string will be extended into the next area
of memory.
<!-- page 79 -->
BUFFER
VI.5 BUFFER
VI.5.1 Usage
The BUFFER command reserves an area of memory to be used as a
temporary holding area during input or output. An area defined
by a BUFFER statement can only be used as an I1/0 buffer; it must
not be used as a string by the program.
The BUFFER command may be located anywhere in a program So long
as it follows SYSTEM. A program may contain as many BUFFER
Statements as necessarye.
NOTE: While BUFFER statements may occur at any
point in a CPL program, it is best to locate
them 1in one area separated from the logic
section of a program.
The minimum byte size for a disk file buffer is 1 sector (400
bytes) . Two bytes added to the beginning of the buffer contain
the buffer length; a binary zero terminator adds an additional
byte.
VI.5.2 Command Format
BUFFER label (n) [,label (n), label (n), ...]
label -- name assigned to the area of
memory to be reserved;
n - number of bytes in the buffer.
Note: Although a 1larger or smaller
buffer size may be used, "n"
should always be stated and
equal 400.
VIi-7
<!-- page 80 -->
TABLE
VI.6 TABLE
VI.6.1 Usage
The TABLE command reserves an area of memory for a table. It
establishes a work area through which information is passed to
and from a table.
The TABLE command may be located anywhere in a program so long
as it follows SYSTEM. A program may contain as many TABLE
Statements as necessary.
NOTE: While TABLE statements may occur at any
point in a CPL program, it is best to locate
them 1in one area separated from the logic
section of a program.
Program length of a table composed of 4-byte integers is (n + 1)
\* 4+ 2; program length of a 6-byte integer table is (n + 1) \* 6
+ 2; program length of a table composed of strings is n + len +
3
VIi.6.2 Command Format
Integer Table
TABLE name (n) [,name (n), name (N), (+
name - area through which an entire table
of integers is accessed;
n - total number of integers in a
table.
String Table
TABLE name (len,n) [,name (len,n), name (len,n)...]
name - area through which an entire table
of strings is accessed;
len - length of a string in the table;
n - total number of characters 1in a
table. L\*rv'
vVIi-8
<!-- page 81 -->
CPL
TABLE
The difference between a 4- or 6-byte table name composed of
integers is based on the name assigned to it. A name beginning
with a "?", is treated as a table of 6-byte integers. A  name
beginning with any other alphanumeric character is treated as a
table of 4-byte integers. For additional information on tables
see Subscripted Variables (XIV.8), TBLGET (XIV.9), and TBLPUT
(XIvV.TI0V .
Vi.6.3 Cautions
1. Whatever is in memory when a program loads is
the value of the table. A table will normally
need to be initialized prior to execution.
vIi-9
<!-- page 82 -->
CPL
## Chapter Seven: CPL ASSIGNMENT STATEMENTS
### OVERVIEW
Utilizing the equal sign (=) as a substitution command,
assignment statements are used to insert the wvalue of an
expression into a wvariable. The target of the substitution
command may be an integer, multiple integers or a string.
VIii-1
<!-- page 83 -->
Integer
Assignment
Statement
VII.1 Integer Assignment Statement
VII.l.1 Usage
An integer assignment statement is used to change the value of
an integer during execution of a CPL program. Any complexity of
expression 1is allowed with CPL evaluating the expression and
storing it in the variable name.
Program size depends wupon the complexity of the integer
assignment statement. To determine program size, the following
should be noted:
Mathematical Processing
Mathematical operations are performed from left to right. If
parentheses are present, resolution of the equation begins with
the innermost pair and moves outward.
If the first character inside a left-hand parenthesis is a minus
(=), the remaining characters of the operand must be numeric.
Similarily, 1if the first character after the last equal sign is
a minus (-), the remaining characters of the next operand must
be numeric.
If more than one integer is to be assigned a new value by a
single integer assignment statement, no operators other than the
equal sign (=) may be used to the left of the last equal sign.
If an integer variable appears on both sides of the equal sign,
the equation 1is (calculated using the current value of the
integer variable. The value of the equation is then stored in
that integer variable.
On the CPU-6 system, the remainder of the last division
performed is saved. If the divisor of that division is a 4-byte
integer, then the remainder 1is a 4-byte integer and that
remainder is stored in @REM. If the divisor is a 6- or 8-byte
integer, the remainder is a 6-byte integer stored in ?@REM.
V -2
<!-- page 84 -->
CPL
Integer
Assignment
Statement
VIiI.1l.2 Command Format
[...variable =] variable = expression
variable - name of the integer wvariable
(defined in a CPL INTEGER or SET
statement) to be assigned a new
value;
Note: There is no limit to the num-
ber of variables that may be
included to the left of the
equal sign (=). Additionally,
the wvariable may be sub-
scripted. For additional
information see Subscripted
Variables (XIV.8).
expression - name of an expression made up of
integers, literals, and/or opera-
tors.
The target of an integer assignment statement may be a 4- or
6-byte integer variable.
The "expression" in an integer assignment statement may be
composed of 1) variable names, 2) integer literals, 3) the
addition, subtraction, multiplication or division operators, 4)
parenthetical expressions (to a maximum of 16 levels) and 5)
built-in functions (i.e. ABS, LEN, MAX, MIN, MOD, ROUND, SGN).
NOTE: Integer math 1is performed in all instances;
no remainders are carried, nor are decimals
processed.
<!-- page 85 -->
CPL
Integer
Assignment
Statement
STATUS
When working with an integer assignment statement, STATUS=0
indicates no overflow/underflow; STATUS=2 indicates
overflow/underflow.
Note: Division by 0 is considered a STATUS=2.
If STATUS=2 occurs, nothing has been stored in the specified
integer variab'e and its contents remain unchanged. STATUS=2 may
be caused by tae expression becoming too large to process during
evaluation or by the expression becoming to large to store in
the specified integer after processing.
VIIi-4
<!-- page 86 -->
String
Assignment
Statement
VII.2 String Assignment Statement
VvIiI.2.1 Usage
A string assignment statement is used to change the value of a
character string during execution of a CPL program.
String assignment statements increase the size of a program by 7
bytes. An additional 2 bytes must be added for each variable or
literal present on the right side of the equation.
VIiI.2.2 Command Format
'string' = 'value a'
or
'string' = "value Db"
string - name of the string wvariable (de-
fined in a CPL STRING or DEFINE
statement) to which a new value is
to be assigned;
'value a' - name of string or variable separ-
ated by the plus sign (+);
"value b" - name of string, variable and/or
literal(s) separated by the plus
sign (+).
Note: The  plus sign (+) indicates
string concatenation.
vIii.2.3 Cautions
1. The length of a string 1is not checked before a
new value is assigned during string concatena-
tion. If a new value exceeds the length at
which the string was established in the STRING
or DEFINE statement, the string will extend into
the next area of memory. For additional infor-
mation see STRING (VI.3) and DEFINE (VI.4).
2. The CPU-6 system provides partition protection
and keeps the program from reading or writing
outside the partition. The CPU-5 system, how=-
<!-- page 87 -->
CPL
String
Assignment
Statement
(cont.)
ever, offers no such protection. An undetected
overflow on the CPU-5 can destroy the partition
and eventually disrupt the OPSYS.
If the same string variable is included on both
sides of an equation, it must be the first item
in the string equation.
String concatenation does not allow multiple
equates. Only one equal sign (=) may appear in
each string equation.
The string equation must be enclosed in either
single (') or double (") quotation marks. If
quotation marks are omitted, the operating
system assumes both terms to be integers. For
additional information see Literal (II.1l) and
Expression (II1.3).
<!-- page 88 -->
INCREMENT
(INCR)/
DECREMENT
(DECR)
VII.3 INCREMENT/DECREMENT
VII.3.1 Usage
The INCREMENT (INCR) command increases the value of a specified
integer; DECREMENT (DECR) decreases the value of a specified
integer.
Either command 1increases program size by 15 bytes. This
increase is constant if either 4- or 6-byte integers are used or
if the abbreviated form of the commands are used.
VI1.3.2 Command Format
INCR[EMENT] integer [,n]
or
DECR[EMENT]) integer [,n]
integer - name of a variable (defined in a
CPL INTEGER or SET statement)
whose value is to be changed;
n - literal to be added or subtracted.
Note: A literal specifying the num-
ber to be added or subtracted
may be part of the command
format. The default wvalue
is 1.
VIIi-7
<!-- page 89 -->
CPL
## Chapter Eight: FUNCTIONS
### OVERVIEW
Built-in functions are subroutines which may be used in place of
an integer variable in an integer expression. A built-in
function reference consists of the function-name followed by a
left parenthesis, one or more arguments and a right parenthesis.
Each argument may be an integer expression (containing built-in
functions.
V -1
<!-- page 90 (front-matter table of contents, omitted) -->
<!-- page 91 -->
LEN
VIII.?2 LEN
VIII.2.1l Usage
The LEN command returns the true length of data contained in
string (in characters or bytes), not including the terminator.
An example of the LEN command would be:
Each LEN command adds 8 bytes to program length.
VIII.2.2 Comr-nd Format
LEN (arg)
arg - string variable name.
a
<!-- page 92 -->
VIII.3 MAX
VIII.3.1 Usage
The MAX command returns the highest value in a specified set.
An example of the MAX command would be:
A = MAX (A, B, é + D)
Each MAX command adds 1 byte to program
additional 10 bytes per "argn". '
VIII.3.2 Command Format
MAX (argl, arg2, ./..)
argn - integer expression
literal.
VIII-A4
MAX
length, plus
variable or
an
<!-- page 93 -->
MIN
VIII.A4 MIN
VIII.4.1 Usage
The MIN command returns the lowest value in a specified set.
An example of the MIN command would be:
IF (MIN (A\*B,C).GT.10) GO TO NEXT
Each MIN command adds 1 byte to program length, plus
additional 10 bytes per "argn".
VIII.4.2 Command Format
MIN (argl, arg2, /..)
"argn" - integer expression wvariable or
literal.
an
<!-- page 94 -->
MOD
VIII.S MOD
VIII.S5.1 Usage
The MOD command returns the remainder after a division operation
in integer math.
An example of the MOD command would be:
A = MOD (B+1,C)
Each MOD command adds 20 bytes to program length.
VII1.5.2 Command Format
MOD (argl, arg2)
argl - integer expression wvariable or
literal to be divided by arg2;
arg2 - integer, expression variable or
literal to be divided into argl.
<!-- page 95 -->
ROUND
VIII. 6 ROUND
VIII.6.1 Usage
The ROUND command eliminates the designated number of decimal
places by dividing "argl" by 1l0\*\*arg2. This rounding process
is performed by truncation of the low order decimal places. If
the highest order digit truncated was 5 or greater, then the
lowest remaining digit is increased by 1. For example:
A=ROUND (123456,2) = 1235
or
A=ROUND (1234,1) = 123
Each ROUND command adds 20 bytes to program length.
VIII.6.2 Command Format
ROUND (argl, arg2)
argl - expression to be rounded;
arg2 - expression representing the
number of decimal places to
be eliminated.
VIII.6.3 Cautions
1. The "rounding" which occurs with ROUND is not
similar to that involved in truncation or with
other forms of rounding.
VilIl-7 Revision 03/15/83
<!-- page 96 -->
SGN
VIII.? SGN
VIII.7.1 Usage
The SGN command is wused to determine the sign of the
expression/literal. When SGN is used, a value of +1, 0 or -1 is
returned depending upon whether the value of the
expression/literal is positive, zero or negative.
An example of the SGN command would be:
IF (SGN (A-B+C).EQ.1l) D=0
VIII.7.2 Command Format
SGN (arg)
arg - integer expression sariable or
literals.
<!-- page 97 -->
CPL
## Chapter Nine: TRANSFER OF CONTROL
### OVERVIEW
The operating system normally executes CpPL commands in
sequential order. There are times, however, when this is not
desirable and it is necessary to transfer control from one
section of a program to another.
Program control can generally be transferred only between points
which have previously been identified by a program label.
Program labels weither identify a paragraph of code (i.e. label
followed by a colon) or identify the beginning of a subroutine
(i.e. label preceded by a SUBROUTINE command). In the case of
the various IF commands, program control may be transferred
within the IF statement without benefit of labels.
NOTE: A label may be the sole item on a line of
CPL. 1Inclusion of labels in this manner is
a means of organizing a program and increas-
ing readability.
A subroutine is an isolated section of (code wused repeatedly
within the same program. It may also be an external subroutine
which is located outside the program and linked to it after
assembly.
<!-- page 98 -->
Labels
IX.1 Labels
IX.1.1 Usage
Program labels (or program connection points) provide a means of
transferring control between various portions of a program.
The compiler creates program labels which begin with "@". These
program labels should not be used by the CPL programmer.
IX. 1.2 Command Format
label:
label - program label, 1-255 characters in
length.
Label Name Formation
Rules governing the formation of label names are as follows:
l. The initial (character in a program label must be an
alphabetical character, "2" or "@".
Note: An initial "?" indicates a 6-byte integer
name; an initial "@"  usually indicates a
label generated by the compiler.
2. The remaining characters in the label may be alpha-
numeric, "?" or "g".
3. The final character in the 1label must be followed
by a colon (:).
IX.1.3 Cautions
1. A label name may not begin with the characters
of a CPL command. The label SETUP: would be
illegal since it incorporates the SET command.
<!-- page 99 -->
GO TO
IX.2 GO TO
IX.2.1 Usage
The GO TO command specifies a label within the program to which
control will be transferred. The specified label may be located
within or outside of a program. When a GO TO occurs, the logic
flow will proceed to the specified label. Execution begins
either with the statement on that 1label or, 1if the label
contains no statement, with the statement following that label.
The GO TO command may be conditional or wunconditional. In a
conditional GO TO an expression is evaluated and, depending upon
the value of the expression, 1is transferred to one of the
specified labels.
NOTE: If the value of the specified expression is
1 at the time the statement 1is executed,
control will be transferred to the first of
the 1labels. 1If the value is 2, the second
label will be used, etc. If the value of
the &expression 1is negative, zero (0) or
greater than the total number of labels, ex-
ecution will (continue with the next seg-
uential statement.
In an unconditional GO TO program control is transferred to a
specified label and no evaluation takes place.
The number of bytes added to program length by a conditional GO
TO depends upon the complexity of the expression contained
within the command format. An unconditional GO TO adds 3 bytes
to program length.
IX.2.2 Command Format
Conditional GO TO
GO TO (label, label, ...) ON expressicn
Unconditional 99 29
GO TO label
label - program label to which control is
to be transferred;
expression - an integer expression.
<!-- page 100 -->
LOQOP
IX.3 LOOP
IX.3.1 Usage
The LOOP command permits multiple executions of a group
statements.
The LOOP command adds 17 bytes to program length.
IX.3.2 Command Format
LOOP j (a, b, c)
J - 4-byte integer or literally-sub-
scripted 4-byte table name; '
a - 1- or 4-byte literal, 4-byte in-
teger or a literally-subscripted
4-byte table name;
b - 1- or 4-byte 1literal, 4-byte in-
teger or a literally-subscripted
4-byte table name;
C - 1l- or 4-byte 1literal, 4-byte in-
teger or a 1literally-subscrigted
4-byte table name.
The LOOP command functions in the following manner:
1. The "3" value is set egual to the "a" value.
2. The body of the LOOP is executed repeatedly.
Note: The "body" 1is the group of CPL statements
immediately following the LOOP statement
with END LOOP being the last statement in
the body.
3. After each execution, "j" 1is incremented by the
value of "c" and compared to the value of "b".
4. When "j" is greater than/equal to "b", the loop is
terminated by END LOOP. For additional information
see END LCOP (IX.5).
5. Execution resumes with the statement following END
LOOP.
I1X-4
of
<!-- page 101 -->
CPL
LOOP
IX.3.3 Cautions
1. Although the procedure is not recommended,
a GO TO may be used to exit a LOOP statement.
For additional information see GO TO (IX.2).
2. LOOP and LOOP WHILE may be embedded to 16
levels within a CPL program; however for proper
processing; each LOOP/LOOP WHILE command must
be terminated with its own END LOOP. Failure
to include an END LOOP will produce unpredic-
table program results.
<!-- page 102 -->
LOOP WHILE
IX.4 LOOP WHILE
IX.4.1 Usage
The LOOP WHILE command allows for repeated execution of a group
of statements as long as a specified comparison 1is true.
The number of bytes added tc program length by the LOOP WHILE
command depends upon the complexity of the expressions contalned
within the command format.
IX.4.2 Command Format
LOOP WHILE (value operator value)
value - integer, 1literal or integer ex-
pression;
operator - condition of the comparison (i.e.
```
.EQ.., .NE., .LT., .LE., .GT. or
.GE.) .
```

Note: Periods are regquired punctua-
tion and no space is allowed
between period and operator.
The LOOP WHILE command functions in the following manner:
l. The body of LOOP WHILE is executed repeatedly.
Note: The "body" 1is the group c f CPL statements
immediately following the LOOP WHILE state-
ment with END LOOP being the last statement
in the body.
2. After each execution, the two wvalues are compared
according to the specified operator.
3. When the specified comparison is false, the loop is
terminated by END LOOP. For additional information
see END LOOP (IX.5).
4. Execution resumes with the statement following END
LOOP.
IX.4.3 Cautions
1. Although the procedure is not recommended, &
GO TO may be used to enter/exit a LOOP WHILE.
For additional information see GO TO (IX.2).
<!-- page 103 -->
CPL
```
LOOP WHILE
LOOP and LOCP WHILE may be embedded to 16
```

levels within a CPL program; however for
proper processing, each LOOP/LOOP WHILE command
must terminate with its own END LOOP. Failure
to include an END LOOP will produce unpredic-
table program results.
<!-- page 104 -->
END LOOP
IX.5 END LOOP
IX.5.1 Usage
The END LOOP command terminates the body of the LOOP or LOOP
WHILE command and indicates that all specified comparisons are
concluded.
NOTE: The "body" of the command 1is the group of
statements immediately following LOOP or
```
LOOP WHILE. For additional information see
LOOP (IX.3) and LOOP WHILE (IX.4).
```

The END LOOP command adds 3 bytes to program length.
IX.5.2 Command Format
END LOOP
IX.5.3 Cautions
1. LOOP and LOOP WHILE may be embedded to 16
level within a CPL program; however for proper
processing, each LOOP/LOOP WHILE command must
terminate with its own END LOOP. Failure to in-
clude an END LOOP will produce unpredictable
program results.
<!-- page 105 -->
CALL
IX.6 CALL
IX.6.1 Usage
The CALL command transfers control to a subroutine which may
located within or outside the program.
NOTE: 1If 1located outside the program, the sub-
routine must be declared in an EXTERNAL
statement. Additionally, if parameters are
passed in a CALL statement, they must be re-
trieved. For additional information see
EXTERNAL (V.1l) and RETRIEVE (IX.9).
CALL adis 3 bytes to a program. Each parameter passed to
subroutine adds an additional 2 bytes.
IX.6.2 Command Format
CALL subroutine [(name, name, /..)]
subroutine - label identifying the subroutine
to which control is to be passed;
name - parameter (s) to be passed;
Note: If an offset is desired, the
name plus the number of bytes
to be added or subtracted
must be included in brackets.
For example: [name + n] or
[name - nj.
IX.6.3 Cautions
1. The system does not differentiate between the
subroutine name identified in the CALL state-
ment and the program label (i.e. illegal label
usage). Therefore, the subroutine name should
not be used with a GO TO statement since this
does not store the proper address for the
return. For additional information see GO TOC
(IX.2).
be
the
<!-- page 106 -->
SUBROUTINE
IX.7 SUBROUTINE
IX.7.1 Usage
The SUBROUTINE command sets the beginning of a subroutine
contained within the CPL program. 1In addition, a subroutine may
be located within an external module. Such a subroutine, which
may be called by a main program, 1is considered an external
subroutine.
NOTE: In this instance, the subroutine label would
need to be referenced by ENTRYPCINT and ex-
ternalized by the main program. For add--
itional information see EXTERNAL (V.1l) and
ENTRYPOINT (V.2).
SUBROUTINE defines the label to which control may be transferred
by a CALL command. The logic path of the subroutine must begin
with the point at which the routine 1is entered and must
terminate with a RETURN /RETURN TO statement. For additional
information see CALL (IX.6) and RETURN /RETURN TO (IX.8).
NOTE: A subroutine is fully recursive and may call
itself.
A SUBROUTINE command is used to increase readibility in program
documentation. It does not generate code and does not add to
program length.
IX.7.2 Command Format
SUBROUTINE label
label -.name of the subroutine within the
CPL program.
Name Formation
Rules govering the formation of subroutine names are as follows:
l. The initial character in a subroutine name must be
an alphabetical character, "2?2" or "@".
Note: An initial "@" usually indicates a label gen-
erated by the compiler.
2. The remaining (characters in the name may be alpha-
numeric, "?2" or "@".
<!-- page 107 -->
RETURN/
RETURN TO
IX.8 RETURN/RETURN TO
IX.8.1 Usage
The RETURN command returns control to the statement following
the CALL statement of the subroutine. The RETURN TO command
allows a subroutine to return to a point in the program other
than to the CALL statement which initiated the subroutine.
Multiple RETURN commands may exist within a subroutine; however,
all exits from the subroutine must be through a RETURN command.
In addition, one subroutine may call another with RETURN
transferring control to the point from which the last subroutine
was called.
The RETURN command adds 1 byte to program length; the RETURN TO
command adds 4 bytes to program length.
IX.8.2 Command Format
RETURN [TO label]
label -  point in the  program to which
control is to be transferred.
IX.8.3 Cautions
1. Control may be transferred to a completely
random address if the RETURN command is ordered
from within the main routine rather than from a
subroutine.
2. A GO T0 should not be used to return a sub-
routine to a main program. Use of GO TO rather
than CALL alters the "program stack" and may
result in eventual destruction of the program
(CPU-5) or a program abort (CPU-6). For add-
itional information see GO TO (IX.2) and CALL
(IX.6).
<!-- page 108 -->
RETRIEVE
IX.9 RETRIEVE
IX.9.1 Usage
The RETRIEVE command is used to retrieve parameters (i.e. data)
out of the CALL argument list. For additional information see
CALL (IX.6).
One RETRIEVE statement must be used for each parameter passed;
the statements must be in the same order in which the parameters
are passed.
The number of bytes the RETRIEVE command adds to program length
is determined by which keyword 1{is used. For additional
information see Type Designation (IX.9.2) below.
IX.9.2 Command Format
RETRIEVE (type, location [,location, ...])
type - keyword identifying data being re-
trieved;
Note: Type 1includes FILE, FORMAT,
CONTROL, EXT, NUMBER, NUM4S8,
STRING and ADDRESS.
location - label within subroutine where par-
meter is to be placed.
Type Designation
l. FILE - the parameter being passed 1is a label
which represents the address of a CPL FILE statement. The
label of the statement into which the parameter is inserted
is the "location". The statement may be READ, WRITE,
REWRITE, READB, WRITEB, WRITEN/WRITN, CURP, CURS or CURB.
The address will always be inserted into the first file name
within the statement.
Note: This form is used with 1/0 operations.
The file keyword adds 2 bytes to the length of the program,
plus an additional 3 bytes for each location.
2. FORMAT - the parameter being passed is a 1label
which represents the address of a FORMAT statement. The
label of the statement into which the parameter is being in-
serted is the "location". The statement may be READ, WRITE,
<!-- page 109 -->
CPL
RETRIEVE
2. (cont.)
REWRITE, WRITEN/WRITN, DECODE or ENCODE. The address then
becomes the FORMAT within the statement.
The FORMAT keyword adds 2 bytes to the length of the
program, plus an additional 3 bytes for each location.
3. CONTROL - the parameter being passed 1is a label
which represents the address of a CPL FILE statement. The
label of the statement into which the parameter is being
passed is the "location". The statement may be HOLD, FREE,
OPEN, CLOSE or REWIND. The address will always b: inserted
into the first file name within the statement.
Note: This form is used with control operations.
The CONTROL keyword adds 2 bytes to the length of the
program, plus an additional 3 bytes for each location.
4. EXT - any 2-byte parameter may be passed to the sub-
routine. The label of the statement into which the
parameter 1is being inserted 1is the "location". The
Statement may be ENDFILE, CURSOR or CALL.
Note: In the case of ENDFILE and CURSOR, the
address becomes the file name within the
statement; with CALL it becomes the first
parameter in the 1list.
Each EXT keyword adds 2 bytes to the length of the program,
plus and additional 3 bytes for each location.
5. NUMBER - the parameter being passed 1is either:
A. the address of a 4-byte integer which con-
tains the positive or negative value to be
passed.
B. a 1 or 4-byte positive 1literal value.
"Location"" is the name of the integer which
will receive the value.
The NUMBER keyword adds 9 bytes to the length of the
program, plus and additional 5 bytes for each location.
IX -13 Revision 03/15/83
<!-- page 110 -->
CPL
RETRIEVE
6. NUM48 - the parameter Dbeing passed 1is either:
A. the address of a 6-byte integer which con-
tains the positive or negative value to be
passed.
B. a 1 to 6-byte positive literal value.
"Location" is the name of the integer which
will receive the value.
The NUM48 keyword adds 9 bytes to the length of the
program, plus an additional 5 bytes for each lo.ation.
7. STRING - the parameter being passed is a label which
represents the address of a value. The value may be a
string variable or a string literal. The name of the
string variable into which the value is being inserted is
the "location".
The STRING keyword adds 2 bytes to the length of the
program, plus an additional 10 bytes for each location.
8. ADDRESS - any 2-byte parameter may be passed to the
subroutine. . The value of the parameter is stored in the 2
bytes beginning at "location".
The ADDRESS keyword adds 2 bytes to the length of the
program, plus an additional 3 bytes for each location.
Note: The ADDRESS keyword 1s used when assSembler
code is contained within the subroutine.
IX.9.3. Cautions
1. RETRIEVE may only be used in a subroutine and
not in a main routine. For additional informa-
tion see CALL (IX.6).
IX-14 Revision 03/15/83
<!-- page 111 -->
1F
IX.10 IF
IX.10.1 Usage
The IF command will perform a function provided a specified
comparison is true. For example:
IF (A.EQ.B) D = 100
1f the specified condition is true, the remainder of the 1line
following the right parenthesis is executed.
If the specified condition is false, the program will continue
with the next sequential statement.
NOTE: If a CALL is specified within an 1F state-
ment, program execution (upon return from
the subroutine) continues with the statement
following IF (or ELSE or END DO in the case
of more complex IF statements).
If a GO TO is specified within an IF state-
ment, program control is transferred to that
label; there is not necessarily a return to
the initiating 1F statement.
The number of bytes added to a program by an IF statement
depends upon the complexity of the expression(s) contained
within the command format. Each ELSE adds an additional 3 bytes
to program length.
IF-ELSE
An optional form of the IF command -incorporates ELSE followed by
a statement. For example:
IF (A.LT.C) X = 0 ELSE X = 1
If the specified condition in an 1IF statement containing the
ELSE option is true, the remainder of the line following the
right parenthesis is executed. Program execution continues with
the statement following ELSE.
If the specified condition in an 1IF statement is false, the
remainder of the line containing ELSE is executed.
<!-- page 112 -->
CPL
IF
IF-ELSE DO
An optional form of the IF command incorporates ELSE DO. 'For
example:
IF (A.GT.B) A =D
ELSE DO
A =2C
END DO
If the specified condition in an 1IF statement containing the
ELSE DO option is true, the remainder of the line following the
right parenthesis is executed. Program execution continues with
the statement following END DO. For additional information see
END DO (IX.12).
If the specified condition in an IF statement containing the
ELSE DO option is false, execution continues with the statement
following ELSE DO.
IF-DO
The IF-DO option provides for the execution of a group of
statements if, and only if, a certain condition is true. For
example:
IF (K.LT.L) DO
```
WRITE (CRT, E0O0) 'DONE'
STOP  
```

END DO
The group of statements to be executed is terminated by an END
DO statement (IX.12).
If the specified condition in an IF statement containing the DO
option is TRUE, the group of statements following IF-DO is
executed.
If the specified condition in an IF statement containing the DO
option is FALSE, execution (continues with the statement
following END DO (IX.12).
<!-- page 113 -->
CPL
IF
IF-DO-ELSE
An optional form of the IF-DO command incorporates ELSE followed
by a statement. For example:
IF (D.EQ.F) DO
A =B
END DO
ELSE A = 0
If the specified condition in an IF-DO statement containing the
ELSE option 1is true, execution continues from the statement
following IF-DO to the END DO (IX.12). Control 1is then
transferred to the statement following the ELSE statement.
1f the specified condition in an IF-DO statement containing the
ELSE option 1is false, the remainder of the line containing the
ELSE is executed.
IF-DO-ELSE DO
An optional form of the IF-DO command incorporates ELSE-DO. 'For
example:
IF (D.EQ.F) DO
A =B
END DO
ELSE DO
A =C
END DO
If the specified condition in an IF-DO statement containing the
ELSE-DO option 1is true, execution continues from the statement
following IF-DO to the END DU associated with that IF-DO.
Control 1is then transferred to the statement following the END
DO (IX.l1l2) associated with the ELSE DO.
If the specified condition in an IF-DO statement containing the
ELSE-DO option is false, execution continues with the statement
following ELSE-DO.
<!-- page 114 -->
CPL
1F
IF-Null-ELSE
An optional form of the IF command incorporates null ELSE. The
null ELSE option does not contain a statement. For example:
IF (A.EQ.B) X = 0
ELSE
If the specified condition in an IF statement (containing the
null ELSE option is true, the remainder of the line following
the right parenthesis is executed.
If the specified condition in an IF statement containing the
null ELSE option is false, execution continues with the line
below the ELSE statement.
Note: The null ELSE form only has meaning in a
"nested" (or complex) IF statement.
IF-DO-Null-ELSE
An optional form of the IF-DO command incorporates a null ELSE.
The null ELSE option does not contain a statement. For example:
IF (E.GT.F) DO
A =B
END DO
ELSE
1f the specified condition in an IF-DO statement containing the
null ELSE option is true, execution continues from the statement
following IF-DO to the END DO (IX.12). Control is then
transferred to the statement following ELSE.
If the specified condition in an IF-DO statement containing the
null ELSE option 1is false, execution /continues with the
statement following ELSE.
Note: The null ELSE form only has meaning 1in a
"nested" (or complex) IF statement.
<!-- page 115 -->
CPL
1F
IF (x)
A1l of the preceding IF forms may be used with the IF(x) form
utilizing the specifications previously cited.
IF(x) is modification of the IF command. The IF(x) form 1is
equivalent to IF(x.NE.O) and eliminates the need to code the
operator and the wvalue contained in the body of the |IF
statement.
Note: IF(x) is valid only when x is a 4-byte in-
teger variable.
IX.10.2 Command Format
IF
TF (value operator value) action
IF-ELSE
IF (value operator value) action
ELSE action
IF-ELSE DO
IF (value operator value) action
ELSE DO
actions
END DO
IF-DO
IF (value operator value) DO
actions
END DO
IF-DO--ELSE
IF (value operator value) DO
actions
END DO
ELSE action
1F-DO-ELSE DO
IF (value operator value) DO
actions
END DO
ELSE DO
actions
END DO
<!-- page 116 -->
CPL
IF
IF-Null-ELSE
IF (value operator value) action
ELSE
IF-DO-Null-ELSE
TF {vélue operator value) DO
actions
END DO
ELSE
IF(x)
IF (value) action
value - 4- or 6-byte integer wvariable,
literal or integer expression;
Note: In the 1IF(x) form, "value"
must be a 4-byte integer var-
iable.
operator - condition of the comparison (i.e.
```
.EQ., .NE., .LT., .LE., .GT., or
.GE.) ;
```

Note: Periods are required punct-
uation and no space 1is
allowed between period and
operator.
action - any executable CPL statement(s) on
a single line;
Note: The reverse slash (\\) may be
used if multiple statements
are to be coded on the
same line. For additional in-
formation see Reverse Slash,
(IV.9).
actions - any executable CPL statement(s) on
one or more lines.
IX.10.3 Cautions
l. The "action" portion of an ELSE may not be an
IF or IFSTRING command. For additional infor-
mation see Command Format, IX.10.2.
<!-- page 117 -->
IFSTRING/
IFS
IX.11 IFSTRING/IFS
IX.11l.1 Usage
The IFSTRING/IFS command will perform a function provided a
specified comparison is true. For example:
NOTE: 1IFS 1is the abbreviated form of IFSTKING.
Usage does not increase or decrease program
length.
If the specified condition is true, the remainder of the line
following the right parenthesis is executed.
If the specified condition is false, the program will /continue
with the next sequential statement.
NOTE: 1If a CALL is specified within an IFSTRING/
IFS statement, program execution (upon re-
turn from the subroutine) continues with the
statement following IFSTRING/IFS (or ELSE or
END DO in the case of more complex IFSTRING/
IFS statements).
If a GO TO is specified within an IFSTRING/
IFS, program control is transferred to that
label; there is not necessarily a return to
the initiating IEFSTRING/IFS statement.
The IFSTRING/IFS command adds 10 bytes to the length of a
program. Each ELSE adds an additional 3 bytes to program
length.
IFSTRING-ELSE
Zn optional form of the IF command incorporates ELSE followed by
a statement. For example:
ELSE X = 1
) 1] o
If the specified condition in an IFSTRING statement cortaining
the ELSE option is true, the remainder of the line followlng the
right parenthesis is executed. Program execution continues with
the statement following ELSE.
<!-- page 118 -->
CPL
1f the specified condition in an IFSTRING statement is false,
the remainder of the line containing ELSE is executed.
IFSTRING-ELSE DO
An optional form of the IFSTRING command incorporates ELSE DO.
For example:
ELSE DO
A =2C
END DO
) ] (@)
If the specified condition in an IFSTRING statement containing
the ELSE DO option is true, the remainder of the line following
the right parenthesis is executed. Program execution continues
with the statement following END DO. For additional information
see END DC (IX.1l2).
If the specified condition in an IFSTRING statement containing
the ELSE DO option 1is false, execution /continues with the
statement following ELSE DO.
IFSTRING-DO
The IFSTRING-DO option provides for the execution of a group of
statements if, and only if, a certain condition is true. For
example:
```
WRITE (CRT, F0O0) 'DONE'
STOP O
```

END DO
The group of statements to be executed is terminated by an END
DO statement (IX.1l2).
I1f the specified condition in an IFSTRING statement containing
the DO option is true, the group of statements following IF-DO
is executed.
If the specified condition in an IFSTRING statement containing
the DO option is false, execution continues with the statement
following END DO (IX.12).
<!-- page 119 -->
CPL
IFSTRING-DO-ELSE
An optional form of the IFSTRING-DO command incorporates ELSE
followed by a statement. For example:
IFSTRING (S.EQ.T) DO
A =B
END DO
ELSE A = 0
If the specified condition in an IFSTRING-DO statement
containing the ELSE option is true, execution continues from the
statement following IFSTRING-DO to the END DO (IX.12). Control
is transferred to the statement following the ELSE statement.
If the specified condition of an IFSTRING-DO statement
containing the  ELSE option is false, the remainder of the line
containing the ELSE is executed.
IFSTRING-DO-ELSE DO
An optional form of the IFSTRING-DO command incorporates
ELSE-DO. For example:
IFSTRING (S.EQ.T) DO
A = B
ELSE DO
A=C
If the specified condition in an IFSTRING-DO statement
containing the ELSE-DO option is true, execution continues from
the statement following IFSTRING-DO to the END DO (IX.12)
associated with that IFSTRING-DO. Control is then transferred
to the statement following the END DO asscociated with the ELSE
DO.
If the specified condition of an IFSTRING-DO cnntaining the
ELSE-DO option is false, execution continues with the statement
following ELSE-DO.
<!-- page 120 -->
CPL
IFSTRING-Null-ELSE
An optional form of the IFSTRING command incorporates a null
ELSE. The null ELSE option does not contain a statement. For
example:
ELSE
If the specified condition in an IFSTRING statement containing
the null ELSE option 1is true, the remainder of the line
following the right parenthesis is executed.
If the specified condition in an IFSTRING statement containing
the null ELSE option is false, execution continues with the line
following the ELSE statement. :
Note: The null ELSE form only has meaning in a
"nested" (or complex IF) statement.
IFSTRING-DO-Null-ELSE
An optlonal form of the IFSTRING-DO command incorporates a null
ELSE. The null ELSE option does not contain & statement. For
example:
A =B
END DO
ELSE
If the specified (condition in a null IFSTRING-DO statement
containing the null ELSE option is true, execution continues
from the statement following IFSTRING-DO to the END DO (IX.1l2).
Control is then transferred to the statement following the ELSE.
If the specified (condition in an IFSTRING-DO statement
.containing the null ELSE option is false, execution continues
with the statement following ELSE.
Note: The null ELSE form only has meaning in a
"nested" (or complex) IFSTRING statement.
<!-- page 121 -->
IX.11.2 Command Format
IFSTRING
IFSTRING-ELSE
ELSE action
IFSTRING-ELSE DO
ELSE DO
actions
END DO
IFSTRING-DO
actions
END DO
IFSTRING-DO-ELSE
actions
END DO
ELSE action
IFSTRING-DO-ELSE
actions
END DO
ELSE DO
actions
END DO
DO
IFSTRING-Null-ELSE
IFSTRING
ELSE
(string
IFSTRING-DO-Null-
ELSE
TFSTRING
actions
END DO
ELSE
(string operator
string)
string)
string)
string)
string)
string)
string)
string)
CpL
action
action
action
DO
Do
action
<!-- page 122 -->
CPL
NOTE: IFS may replace IFSTRING 1in each of the
commands listed previously.
string - name of a string wvariable, string
literal or string expression pre-
viously defined in a CPL STRING
(VI.3) or DEFINE (V1.4) statement;
operator - condition of the comparison;
Note: Although .EQ. and .NE. are
normally the operators em-
ployed in an IFSTRING/IFS
comparison, .LE., .LT., .GE.
and .GT. may also be used.
A string comparison may use
```
/HEQ., .HNE., .HLE., .HLT,
.HGE. or .HGT. With these
```

operators trailing blanks are
not dropped and lower case
characters are not converted
to upper case.
action - any executable CPL statement(s) on
a single line;
Note: The reverse slash (\\) may be
used if multiple statements
are to be coded on the
same line. For additional in-
formation see Reverse Slash,
(IV.9).
actions - any executable CPL statement(s) on
one or more lines.
IX.11.3 Cautions
l. The "action" portion of an ELSE may not be an
IFSTRING or IF command. For additional infor-
mation see Command Format, IX.1ll.2.
<!-- page 123 (front-matter table of contents, omitted) -->
<!-- page 124 -->
CPL
## Chapter Ten: FILE DEFINITION AND CONTROL
### OVERVIEW
All forms of program input and output in CPL are controlled
through the System and Program Logical Units. No physical
device control is allowed or necessary with CPL.
<!-- page 125 -->
FILE
X.1 FILE
X.1l.1 Usage
The FILE command assigns labels to all System and Program
Logical Units wused within the program and reserves space
used by the operating system to communicate with the
device/file. FILE also establishes a Record Control Block
(RCB) in memory. This command can only be wused with
expansion D.
The FILE statement is the link between the logical unit, the
CPL program and the device/file. Considered a piece of data
rather than logic, FILE (and additional CPL statements)
enables the program to perform I/0. '
A FILE command normally adds 30 bytes to a program. If FILE
ls used in conjunction with a spanned-sector file, 46 bytes
are added to a program. For additional information on
spanned-sector files see Chapter 13 - SPANNED-SECTOR I/0.
X.1.2 Command Format
FILE file: SYSccc, [access], [CLASS=n], [BUFFER=n,
buffer], [RECSIZ=n], [KEY=integer]), [FILTYP=c],
[(LSR=routine], [BLOCKING=n]
file - name by which the device/file will
be known inside the program;
ccc - suffix of a System Logical Unit or
the number of a Program Logical
Unit;
access - keyword SEQUENTIAL (SEQ), RANDOM
buffer - name of a buffer (defined in a CPL
BUFFER statement);
integer - name of a 4-byte integer which
contains the 1location of the re-
cord to be accessed;
routine - number of the Logical Service
Routine or the name of a non-
resident routine.
In actual use the FILE statement does not extend beyond one
line. All data beyond "FILE", ""file name", ":" and "SYSccc"
1s optional and may appear in any order. Commas are
required to separate optional fields, however.
<!-- page 126 -->
CPL
FILE
Keyword Designation
1. S5YSccc - the first keyword after the colon specifies
the logical wunit to which the internal file name is
assigned. SYS units include the following: SYSRDR, SYSLOG
SYSLST, SYSIPT, SYS000, SYS001l, etc. Tape files (cannot be
assigned to SYSRDR or SYSIPT. All other SYS assignments are
valid for tape files.
2. Access - keywords SEQUENTIAL (SEQ), RANDOM (RND) and
INDEXED (IND) are used for access. SEQUENTIAL (SEQ) is used
for Type "A" or Type "B" files, a CRT, a printer, a spooler,
or tape; RANDOM (RND) is wused for Type "C" files; and
INDEXED (IND) is wused for (anned-sector files. If no
keyword is given, access defaults to SEQ. However, access
should always be specified for internal documentation
purposes.
3. CLASS=n - keyword insures that only a specific type
of device or file may be assigned to the specified logical
unit. The allowable values are:
CLASS=0 console device only
CLASS=1 device independent, unbuffered
CLASS=2 buffered disk file only
CLASS=4 tape files
I[f CLASS=n is not specified, CLASS=0 is the default.
Note: A mismatch between the assigned file and the
specified class will abort the program when
the file is opened.
4. BUFFER=n, label - keyword specifies an area of mem-
ory for file input/output. Whenever a sector of a specified
file is accessed, it is read into\_the temporary holding area
created by the buffer.
The BUFFER= keyword is followed by two data items separated
by a comma. The first item 1is the size (in bytes) of the
buffer reserved for the file; minimum buffer length for disk
files is 400 bytes. The second item is the name of the buf-
fer to be used in the FILE statement. This label name must
be defined in a CPL BUFFER statement. The name of a buffer
may also be represented by an asterisk (\*). When BUFFER=n, \*
is used, the compiler automatically generates a label name
and no BUFFER statement is necessary.
Revisjon 03/15/83
<!-- page 127 -->
CPL
FILE
Note: All Type "B" files must be buffered. A buf-
fer must also be included with all CLASS=2
designations. This keyword is not valid with
tape files.
5. RECSIZ=n - keyword establishes a true record length
for Type "C" random-access files. It may also be used to
establish a maximum record length for Type "A" and Type "B"
sequential files. While the actual records may be shorter
than the space reserved for them, no record may exceed the
established maximum length.
Note: Statement of RECSIZ=n is optional for all
sequential (Type "A" or Type "B") files.
RECSIZ=n 1is required for all random (Type
"C") and indexed (spanned-sector/VSI) files.
There is no default for RECSIZ=n on Type "A",
"B" and "C" files (CPU-5). Default for Type
"I" files is 400 (CPU-6). For blocked tape
files, RECSIZ is used to calculate the buf-
fer size. If it is not stated, RECSIZ de-
faults to 512. For wunblocked tape files,
RECSIZ is not used.
6. KEY=label - keyword specifies the name of the 4-byte
integer which is the key to the file when reading or writing
a Type "C" random access file.
Note: A key must always be specified for a random
or indexed file; a sequential file does not
contain a key. This keyword is not used with
tape files.
7. FILTYP=c - although FILTYP=c is not normally stated,
the keyword specifies whether a Type "A", "B", or "C" file is
being used. If the keyword is omitted (and the file 1is
sequential), a Type "A" file is assumed; if the keyword 1is
omitted and the file is random or indexed, a Type "C" file is
assumed.
Note: If Type "B" is required, FILTYP=B must be
stated. This keyword 1is not used with tape
files.
X-4 Revision 03/15/83
<!-- page 128 -->
CPL
FILE
8. LSR=routine - although the compiler usually calcu-
lates the correct Logical Service Routine, the keyword
specifies the routine performed in processing the file. The
following is a list for standard system LSR routines.
0 Type "A" unbuffered device or file
1 Type "A" buffered file
2 Type "C" random unbuffered file
3 Type "C" random buffered file
4 Type "B" buffered file
5 Relative sector 1/0
8 Tape files
Note: LSR=5 1is never calculated by the compiler
and must always be stated when used.
Optionally, a Logical Service Routine other than a standard
system routine may be used. In this case LSR=label would be
assigned by the programmer; "label" would state the name of
the non-resident routine.
9. BLOCKING=n - number of logical records in a tape
If the number of records is not stated, BLOCKING defaults to
1. Blocked tape files are accessed through a buffer with size
= (RECSIZ x BLOCKING) bytes. BLOCKING=n is used only with
tape files (CLASS=4).
X.1.3 Caution
Failure to initialize a Type "C" indexed file
through RECSIZ=n or GETK, NEWK, DELK will cause the
record length to retain the default value of zero.
X=-5 Revision 03/15/83
<!-- page 129 -->
 8/ST1/€0
uoTSTAR]
2g-X
(y-nd)
Jisve
1uvus
duvms
J15ve
LHYwS
lyvus
140)
1uvus
yos
1ovyax
OVLIMIX
ovLmX
[ 19-ndD}
Disve
14vws
[9
ndD)
Disve
1HOS
t9-nd))
)isvae
S31L1112L0
401
```
/isn
/N
```

15219
AS0IAX
(9-nd3)
Lyos
1805
140(
SNOYIMNN
SNOYINNN
d4s0l
Lownan
fLavws
aduoax
2MON
: \_\_""m
INON
NN
1M1
HAX
INtuex
INTWX
IMON
INOR
INON
INON
INON
LNy
XN
PR
RN
1nox
Jaami
a0
N0
w130
\*MIN
ATy
L3umIN
INON
INON
M104
1N10d
INON
saNtLnoy
wasn
o
w130
Aoy
3208
3108
It
Adbdd
3-0dDT
QINT
430
[37)
384
S3IX
$3A
3344/010M
S3A
ow
on
on
w4
Hisn
Wiva/uaIu
/OM
($-ndd}
/G70H
vi/arom
```
/INd
/0
```

IL1umIn
aNImay
ON1
M3y
HOSHND
4y
"
:uw."
a2
humm
INON
INON
INON
INON
INON
INON
INON
ERIPL
T
asnd
1/1334s
aNIM3IY
SuNnd
N3llum
dun)
(9-nd))
AL
PVTY
K TTTFET]
03/1n0Iv
fIvmoitdo
IYNOI2d0
IYNO
) 240
a3iyinhay
TYNO
1140
IYNOT
140
oN
widine
visn
(5
ndo)
IYNOI
L0
(9
nan
ealtun
]
walium
9341um
tuind)
uing
LEFS
T
L EFEETY
LEITETY
LEISET]
9ILium
Iltum
QILium
Lnarno
121um
[
FRETY
/wing
Jllum
eavay
eaviy
eavau
[ETE
LT
9139
eaviy
A0v3y
J(9-ndd)
aaviy
eavay
eaviy
avay
eavin
andni
ovay
wavId
[T
]
aviy
Lmaana4sc
§
0Intiag
00y
ool
(9-ndd)
oo
(9-nd2)
00w
eroz
Fy-ndd)
onr
(9-0d3)
R61
(9-ndd)
86
321A30
11533y
D1av0
wisn
eror
15-ndD)
56t
1$-ndd)
(6t
Rror
By-nds)
g6t
(6-ndD)
(&
t5-ndD)
(61
1301
s3It
§
aimtaag
on
ON
OoN
N
on
UK
on
G3A
3K
34
LER]
/iIsn
YA
o1s
L
T]
[
IT]
ant
aN)
Ny
ONN
any
aNy
[ xIH
0k
03s
SSIDDV
3dvy
/s7
33
1w
ty-ndd)
S
neo
.
ILAGL90
1NdS
UNY)
fang!
ERIK]
114
3)1A30
3dil
"Dd
15A
tsa
fiant
paa-v)
(aN1
J1A0-9)
ERIR]
g
A,
adiy
/,
adAy
ERANG
3114
ERIR]
o
14
WD,
adAy
LD,
oadAy
Wb,
edAy
Y,
adAy
D
Ay
3,
adAy
<!-- page 130 -->
FILE STATEMENTS
TYPE STATEMENT
CRT FILE name: SYSccc, - Used by CRT only; Class=0 (also the
default)
PRINTER/ FILE name: SYSccc, CLASS=]1 - includes CRT, printer, spooler
SPOOLER DUMMY, BLIND and Type "A" file.
DEVICE FILE name: SYSccc, CLASS=1 - includes CRT, printer, spooler,
INDEPENDENT DUMMY, BLIND and Type "A" file.
TYPE "A" FILE name: SYSccc, CLASS=1 - includes CRT, printer, spooler,
UNBUFFERED DUMMY, BLIND and Type "A" file.
FILE
TYPE "A" FILE name: SYSccc, CLASS=2, BUFFER=400, label
BUFFERED
TYPE "B" FILE name: SYSccc, CLASS=2, BUFFER=400, label, FILTYP=B
BUFFERED
TYPE "C" FILE name: SYSccc, RND, CLASS=1, RECSIZ=n, KEY=integer
RANDOM
UNBUFFERED
TYPE "C" FILE name: SYSccc, RND, CLASS=2, RECSIZ=n, KEY=integer
RANDOM- BUFFER=400, label
BUFFERED
NOTE: All remaining Type "C" buffered/unbuffered
files are structured like the two cited
above. Buffered files are CLASS=2 (with a
buffer statement); unbuffered files are
CLASS=1 (no buffer statement).
TYPE "C" FILE name: SYSccc, IND, CLASS=1(2), RECSIZ=n, KEY=integer,
RANDOM- BUFFER=400, label
SPANNDED
(CPU-5) NOTE: A BUFFER=n statement may or may not be
present depending on CLASS.
X-5b Revision 03/15/83
<!-- page 131 -->
TYPE STATEMENT
TYPE "C" : FILE name: SYSccc, RND, CLASs=1(2]), RECSIZ=n, KEY=integer
4-BYTE :
INDEXED : NOTE: A BUFFER=n Statement may or may not be
present depending on CLASS.
TYPE "C" : FILE name: SYSccc, RND, CLASS=1[2], RECSIZ=n, KEY=integer
6-BYTE :
INDEXED
TYPE "C" : FILE name: SYSccc, IND, CLASS=1[2], (RECSIZ=n], KEY=integer
VSI :
(CPU-5) :
TYPE "C" : FILE name: SYSccc, SPANNED [SPN], CLASS=2, RECSIZ=n,
RANDOM- : KEY=integer
SPANNED :
(CPU-6) : NOTE: BUFFER=n cannot be stated since it is
: generated automatically by RECSIZ=n.
TYPE "I" : FILE name: SYSccc, IND, CLASS=2, RECSIZ=n, KEY=integer
VSI :
(CPU-6) - : NOTE: BUFFER=n cannot be stated since it 1is
: generated automatically by RECSIZ=n.
RELATIVE : FILE name: SYSccc, RND, CLASS=1, RECSIZ=400, KEY=integer,
SECTOR : FILTYP=t, LSR=5
1/0 :
PROGRAMMER : FILE name: SYSccc LSR=label
WRITTEN :
LSR : NOTE: Since the programmer 'creates this logical
: Service Routine (LSR) the body of the
: statement is 1left to the discretion of
: the programmer and the needs of the LSR.
TAPE : FILE name: SYSccc, SEQ, CLASS=4
UNBLOCKED :
TAPE : FILE name: SYSccc, SEQ, CLASS=4, RECSIZ=n,
BLOCKED : BLOCKING=n
X-5  Revision 03/15/83
<!-- page 132 -->
OPEN
X2 OPEN
X.2.1 Usage
The OPEN command allows a CPL program to access a file. 1In the
case of a buffered file, OPEN causes the first sector of that
file to be read into the buffer area.
The command compares the parameter(s) specified 1in the FILE
statement to those of the actual file assigned to the
appropriate logical unit. A mismatch in the comparison causes
an abort at program execution time.
OPEN, as a piece of 1logic, may be located anywiere in the
program so long as it follows SYSTEM. As many OPEN statements
as needed may be used.
Each OPEN command adds 4 bytes to a program, plus an additional
3 bytes per file to be opened.
Xe2.2 Command Format
OPEN access file
or
OPEN access (file, ...) [,access (file, /.eo) ;o..]
access - INPUT, OUTPUT or 1I0;
file - label of a file (defined in a CPL
FILE statement) to be opened.
Note: Multiple file names may be
specified for each type of
access. They must be enclosed
in parentheses and separated
by commas. Commas may also be
used to separate multiple
types of access on a single
line.
X.2.3 Cautions
1. No file may be accessed until it is opened.
2. On a CPU-5 system, a file may either be opened
for INPUT and written to immediately or opened
for OUTPUT and read immediately.  On a CPU-6
system this is not allowed.
3. Any indexed file (i.e. 4-byte, 6-byte or VS5I)
must always be opened with access type IO0O.
<!-- page 133 -->
CLOSE
X.3 CLOSE
X.3.1 Usage
The CLOSE command prohibits further access to a file within a
CPL program. The command 1is generally wused to prevent
jeapordizing data by accessing a file unintentionally.
NOTE: Usage of CLOSE is optional. The STOP command
should be wused when program termination is
required. At that time end-of-step process-
ing automatically closes all open files. For
additional information see STOP (III.3).
A CLOSE command adds 6 bytes ..o a program for each file to be
closed.
Xe3.2 Command Format
CLOSE file [,file, file, ...]
file - label of file (defined 1in a CPL
FILE statment) to be closed.
X.3.3 Cautions
1. If a file is assigned a buffer, the contents of
that
when
for this purpose.
see ENDFILE
2. End-of-file
written to
closed.
For additional
3. All files
full program overlay.
see LOAD
automatically written out
ENDFILE must be used
additional information
buffer are not
the file is closed.
For
(X.5) .
records are not automatically
sequential files when the file |is
ENDFILE must be used for this purpose.
information see ENDFILE (X.9).
must be (closed prior to executing a
For additional informa-
(XIV.3).
<!-- page 134 -->
ENDFILE
X.4 ENDFILE
X.4.1 Usage
The ENDFILE command writes an end-of-file marker for a specified
se?uential (i.e. Type "A" or Type "B") file. I1f the file is
buffered, the command writes the last buffer into the file.
An end-of-file marker is meaningful only when files are accessed
sequentially. The principal function of the ENDFILE command 1is
to insure that a buffer containing new data is written back to a
disk file before a program is terminated. For additional
information also see WRITE (XI1.2).
ENDFILE adds 5 bytes to a program for each file listed 1in the
ENDFILE command.
X.4.2 Command Format
ENDFILE file [,file, file, ...]
file - label of a file (defined in a CPL
FILE statement) to which the end-
of-file marker is to be written.
X.d4.3 Cautions
1. Normally the ENDFILE command 1is only used to
terminate output to a sequential file. If |used
with seguential input files, ENDFILE will
truncate that file after the last record which
was read. '
For a summary of ENDFILE usage, consult the
following:
(1) Use of ENDFILE is optional for devices and
is ignored.
(2) Use of ENDFILE is optional for "A" and "R"
Type files (input).
(3) Use of ENDFILE 1is required for "A" and "bB"
Type files (output).
(4) Use of ENDFILE 1is 1illegal for all other
forms.
<!-- page 135 -->
X.5 REWIND
X.5.1 Usage
The REWIND command allows the first record of a sequential
(i.e. Type "A" or Type "B") to be
reopens a sequential file and resets
record in the file. On input, if the
sector of that file is read into the
NOTE:
devices; however, in
be ignored.
REWIND adds 6 bytes to a program for
REWIND may not be used
files or indexed files.
REWIND
file
accessed. REWIND basically
the address of the /current
file is buffered, the first
appropriate buffer.
with random "C" Type
It may be used with
this case REWIND would
each file rewound.
(defined 1in a CPL
to be rewound.
Xe5.2 Command Format
REWIND file {,file, file, ...]
file - label of file
FILE statement)
X.5.3 Cautions
1. 7The contents
are not written out
of the buffer in a buffered file
before the file is rewound
and the first sector read into the buffer.
additional information see ENDFILE
For
(X.4).
<!-- page 136 -->
SETFORM
X.6 SETFORM
X.6.1 Usage
The SETFORM command is only valid on the CPU-6 system. This
command will allow the form number and/or HOLD/FREE status
of a job going to spooler to be modified.
NOTE: If multiple SETFORM commands are used, the
last SETFORM issued prior to CLOSE will be
the one that will affect the spooler.
X.6.2 Command Format
[ ,HOLD]
SETFORM (file [,] [n] [,FREE])
file - name of file to be set;
n - form number, if omitted,
the current form number
will be unchanged;
NOTE: Valid form numbers are
0 thru 32,767.
HOLD - causes the job to be held
within the spooler;
FREE - causes the job to be freed
(or released to the printer).
NOTE: FREE is assumed, if no
options is specified.
X.6.3 Examples
SETFORM (PRT,, FREE); form# unchanged , FREE
SETFORM (PRT) ; form# unchanged , FREE
SETFORM (PRT, 18) ; form#=18 , FREE
SETFORM (PRT, HOLD) ; form# unchanged, HOLD
SETFORM (PRT,18,HOLD); form#=18, HOLD
NOTE: The first and second examples will yield the
results, the second example is merely a sim-
pler method.
X-10 Revision 03/15/83
<!-- page 137 -->
SKIP
X.7 SKIP
X.7.1 Usage
The SKIP command advances the tape by the number of records
specified when the command 1is entered. This command is used
only with tape files (CLASS=4) and can be used only with
expansion D.
The SKIP command adds six bytes to a program.
X.7.2 Command Format
SKIP (file,n)
file - label of a file (defined in
a CPL statement) in which records
are to be skipped;
n - the number of records to skip
Revised 3/15/83
<!-- page 138 (front-matter table of contents, omitted) -->
<!-- page 139 -->
CPL
## Chapter Eleven: FORMATTED INPUT/OUTPUT
### OVERVIEW
Formatted Input/Qutput, which differentiates between binary
(integer) data and character data, is used in transferring ASCII
data. Since numeric ASCII data must be converted to binary
before arithmetic can be performed, formatted I/0 commands are
generally used on all buffered/unbuffered Type "A" files,
printers and console devices.
<!-- page 140 -->
FORMAT
XI.1 FORMAT
XI.1l.1 Usage
The FORMAT command reserves a string in memory. This string is
read to determine the form data will take when converted by a
READ, WRITE, WRITEN/WRITN, REWRITE, ENCODE or DECODE command
and may be considered a type of record layout. Since formats
are not assigned on a one-to-one basis to individual statements,
the same format may be used many times within the same program.
All input or output between a CPL program and an ASCII device or
Type "A" file requires the use of field specifications set up in
FORMAT statements. Input commands convert ASCII characters from
a device/file (READ) or from a character string (DECODE) into
one of the following:
Character String(s) - "C" Field Specification'
4-Byte Integer(s) - "N" Field Specification
6-Byte Integer (s) - "D" Field Specification
No Input - "X" Field Specification
Output commands (i.e. WRITE, WRITEN/WRITN, REWRITE, ENCODE)
reverse the process outlined 1in the  preceding section.
Therefore, if a 6-byte integer is to be converted into character
form, a "D" Field Specification must be used on output.
Accordingly, a "N" Field Specification must be used to convert a
4-byte integer to character form, a "C" Field Specification must
be wused to copy character for -character and a "X" Field
Specification must be used to insert blanks 1into the output
string.
As a piece of data, FORMAT statements may occur anywhere in a
program following SYSTEM. As many FORMAT statements as are
necessary may be used within a CPL program.
NOTE: For purposes of readibility it is suggested
that all FORMAT statements be located in one
section of the program.
Each FORMAT command adds 1 byte to program length. An
additional 3 bytes is added for each format specification in the
list.
<!-- page 141 -->
CPL '
FORMAT
XI.1l.2 Command Format
FORMAT format: specification, specification, ...
format - label to be associated with field
specifications following the colon
()3 specifications - characters "N", "D", "C" or "X"
followed by the 4-byte integer or
literal representing the number of
characters in the field.
Note: If a 4-byte integer is used,
it must be enclosed in par-
entheses.
The FORMAT statement must be associated with a READ, WRITE,
WRITEN/WRITN, REWRITE, ENCODE or DECODE command for I/C to
occur. In the following "C" field specification, the READ and
FORMAT statements are used to create a record layout.
FORMAT FRED: C6, C(LEN), Cl0
The label (i.e. FRED) assigned to the "format" section of the
READ statement must be the same as that assigned to the FORMAT
statement; additionally, each variable 1in the READ statement
(i.e. STR1l, STR2, STR3) is associated with a specification in
the FORMAT statement (i.e. C6, C(LEN), ClO0).
NOTE: Each label in the list of the specified 1/0
is expected to have a field specification in
the assigned format. If the number of labels
in the 1list exceeds the number of field
specifications, those specifications are re-
peated. If the number of field specifica-
tions exceeds the number of labels, the ex-
cess specifications are ignored.
"N", "D", "C" and "X" field specifications may be combined,
separated by commas and/or spaces. This combination process
allows several typrs of information to be stored in a single
record or string before being input into a list of strings
and/or integers. During output a 1list of strings and/or
integers may be combined into a single record or string.
<!-- page 142 -->
CPL
FORMAT
NOTE: 1If a record is too long for the specifiec
line length, truncation of data begins with
the first specification to exceed the limit
(not with the first character to exceed the
limit). The remainder of the line following
the truncation would remain blank.
"N" and "D" Field Specification (Input)
"N" or "D" is followed by the number of (characters from the
source device/file/string to be converted to the binary integer
format.
Note: A "N" field specification 1is used with 4-
byte integers; a "D" field specification is
used with 6-byte integers.
The source is read from left to right until the specified number
of ASCII numeric (characters (or the end of the record as
indicated by the ASCII carriage return symbol) is reached. If
thie number of characters in the source exceeds the number in the
field specification, the low order digits will be truncated.
A positive (+) or negative (-) sign may either precede or follow
the input string. If no sign is specified, the integer will be
assumed to be positive. The number of characters specified must
include one (character for the sign; if a trailing sign is
truncated, the integer will be converted as postive.
The following conversions would take  place under a "N4"
specification:
String Integer
-12345 T1234
+12345 123
12345+ 1234
-12345 -123
12345- 1234
While leading blanks are allowed, trailing blanks brought from
the input record/string wunder the specified format will not
allow the conversion to take place and the target integer will
retin its original value. STATUS will be set to 2 indicating a
a format error.
<!-- page 143 -->
CpPU-5/CPU-6
CPL
FORMAT
A decimal point in the field specification does not cause a
decimal point to to included 1in the converted integer. It
merely insures that if a decimal point is found in the source
string, exactly that number of decimal places are output. If
the string contains a decimal point, but fewer than the
specified number of , zeroes will be added. If the string
contains too many places places the extra places will Dbe
truncated.
Note: The number before the decimal point speci-
fies the total number of characters (includ-
ing decimal points and signs) which will be
read.
The following conversions would take place under a "NS5.2"
specification:
String Integer
T IZ3
1.2 120
1.234 123
1. 100
123- -123
123.45 12340
-123.45 -12300
"N" and "D" Field Specifications (Qutput)
YN 3T "DV is followed by the number of ASCII numeric characters
the target string is to contain. The target string is filled
from right to left. If the number is negative, the "-" sign
will normally be output last at the far left end of the string.
If the number is positive , the "+" is omitted. No blanks are
output during this process. If the field is too small for all
digits to be output, the high-order digits are truncated.
The length of the data stored in the string 1is dependent wupon
the field specification, not on the size of the source integer.
The string must be large enough to contain the length of the
field specified. A right-hand sign is obtained by including a
"\_" to the right of the "N" or "D" character in the field
specification. Although a left-hand sign is assumed, it may be
indicated by a negative sign to the left of the "N" or "D".
<!-- page 144 -->
In the following examples the integer shown 1s
CpL
F ORMAT
encoded into @
g-character string which originally contained the characters
XXXXXX:
Integer Field Specification String
123- N6 -XX123
-12345 N-6 12345-
Note: A ""X" is output only with the ENCODE
command; with all other commands nx"
becomes a space.
If the output string is to contain a decimal P
of decimal Fplaces preceded by the decimal po
for in the field specification.
included when decimals are used,
the second position to the right.
oint,
int must be called
1f a right-hand sign is to be
decimal places are counted from
the number
Assuming a pre-blanked string, the following examples
illustrates the conversion process:
Integer Field Specification string
-12345 N10.3 - 12.345
-12345 N-10.3 12.345-
12345 N-10.3 12.345
12345 N5.3 2.345
-12345 N-5.3 .345-
-12345 N5.3 -.345
Note: In the last two examples, the sign 1is
retained even though the first two
characters are truncated.
ncn Field Specification
T (character) field specifications make a literal
transposition of ASCII data from source target. This
transposition occurs when data is being both input and ocutput.
Character data is stored from
number of characters or the end of the record,
ASCII carriage return symbol, is reached.
left to right unt il the specified
indicated by the
<!-- page 145 -->
CPL
## Chapter Eleve:
FORMAT
If the terminator is reached before all characters called for in
the field specification have been used, the difference will be
made up with blanks. If the string is longer than the field
specification, the remaining characters in the target field will
be unchanged. Also, blanks are provided on output to make up the
difference between a string and a longer field specification.
In the following examples, the data shown is encoded 1into a
6-character string which originally contained the characters
XXXXXX:
Source Field Specificati n String
ABC Co ABC
ABCDEF ) C4 ABCDXX
Note: A "X" is output only with the ENCODE
command; with all other commands "X"
becomes a space.
"X" Field Specification
The "X" Field Specification during input (causes the specified
number of (characters to be read or decoded; these characters,
however, are not transferred to memory. During output, blank
characters are generated which may be inserted between other
output.
Note: "X" Field Specifications are used almost ex-
clusively in combination with other speci-
fications.
XI.1.3 Cautions
1. The total 1length of the record specified in a
FORMAT statement must be less than that of the
system line buffer. Fields which exceed this
length are lost.
Note: The length of the system line buffer is
normally 132 characters.
2. Any attempt to input or output a non-numeric
character under a numeric field specification
will result in a format error.
<!-- page 146 -->
CPL
FORMAT
Leading blank(s) may precede a numeric string
being converted to an integer. Trailing blanks,
are not permitted, however.
If a format error should occur while a list of
labels is being processed, subsequent labels
in the list will not be converted and will re-
tain their current values.
<!-- page 147 -->
READ
XI.2 READ
XI.2.1 Usage
The READ command - or "formatted" read statement - transfers
ASCII data from a device/file to one or more integers or
strings. Each READ command accesses an entire record,
terminated by an ASCII carriage return character. The next READ
command accesses the next sequential record of the device/file.
NOTE: READ is an executable command and should be
located within the 1logic section of the
program.
Each READ statement adds 9 bytes to the length of a program. An
additional 2 bytes is added for each integer or string in the
list.
XI.2.2 Command Format
READ (file, format) variable, variable, ...
file - label of the device/file (defined
in a CPL FILE statement) from
which the record is to be read;
format - label of a CPL FORMAT statement;
variable - name(s) of the string wvariable,
integer variable or literally-sub-
scripted table-name in which data
is to be stored.
Data read by the READ command may be stored in character or in
binary integer form depending on the format used. For additional
information see FORMAT (XI.l).
Sectors
The sector containing the record to be read 1is copied from a
disk into a buffer. If no specified buffer is assigned to the
file, the system buffer is used. Individual records are then
read sequentially from this buffer. For additional information
see FILE (X.1l).
STATUS
The value of STATUS is affected by each R:uZAD command. STATUS
values include 0 (Normal Completion), 1 (End-of-File) and 2 (I1/0
Error or Format Error).
<!-- page 148 -->
X1.2.3
CpPL
READ
Note: For additional information on the causes of
format errors during a READ statement, see
FORMAT (IX.1)
### Cautions
l. STATUS shc..1 be checked after each READ com-
mand fror :z disk file. STATUS is set to 1 only
by that RL-D command which encounters an end-
of-file mark; subsequent READ commands return
STATUS to O.
2. A READ should not be performed after a WRITE
since READ does not write a completed sector
back to disk. The changes made by the WRITE
command inside the buffer are not transferred
to the disk before the READ command brings in
the next sector. REWRITE should be used when
it is necessary to change a record in the
middle of a Type "A" file.
X1-10
<!-- page 149 -->
WRITE
XI.3 WRITE
XI.3.1 Usage
The WRITE command - or the ""formatted" write statement -
outputs data stored in one or more integers or strings to a
specified ASCII device/file. Each WRITE command outputs one
record which is terminated by an ASCII carriage return
character.
NOTE: WRITE is an executable command and should be
located within the logic section of a
. program.
Each WRITE command adds 9 bytes to the length of the
program. An additional 2 bytes is added for each integer,
string or literal in the list. Arithmetic expressions also
add 5 bytes to the program plus an additional 5§ bytes for
each variable or literal in the expression.
XI.3.2 Command Format
WRITE (file, format) variable, variable,
file - label of the device/file (defined
in a CPL FILE statement) into
which the data is to be written:
format - label of a CPL FORMAT statement;
variable - name of the string variable, .
literal or expression and/or in-
teger variable, literal or expres-
sion.
NOTE: An integer literal or integer variable must
use an "N" or "D" field specification
depending on the type of the integer. An in-
teger expression must use a "D" field speci-
fication. A string must use a "C" field
specification. For additional information
see FORMAT (XI.1l).
Sectors
If no specific buffer is assigned to a file, the system
buffer is used. For additional information see FILE (X.1).
At the end of each record the WRITE command outputs an
end-of-sector mark to insure the integrity of the data. A
subseguent WRITE command in the same sector converts the
end-of-sector mark to a carriage return character indicating
an end-of-record. When the buffer no longer has enough room
for the next record, the sector is copied to disk.
XI-11 Revision 03/15/83
<!-- page 150 -->
CPL
```
WRITE
STATUS
```

The value of STATUS is affected by each WRITE command. Possible
STATUS values are 0 (Normal Completion), 2 (I/O Error or Format
Error) and 3 (End-of-Medium on Qutput).
Nete: In the case of a Type "A" file which ex-
pands automatically, end-of-medium is an in-
dication that the disk 1is full. For addi-
tional information see FORMAT (XI.l).
XI.3.3 Cautions
l. A entire buffer of data must be written before
that data will be transferred back to disk.
Therefore, writing to a disk file should be
followed by an ENDFILE command. For additional
information see ENDFILE (X.5).
2. Literals in the range of -127 to +127 used in a
WRITE statement will generate a 4-byte literal.
<!-- page 151 -->
WRITEN/WRITN
XI.4 WRITEN/WRITN
XI1.4.1 Usage
The WRITEN/WRITN command is used to transfer ASCII data stored
in one or more integers or strings to a console-type device
without including a carriage return at the end of the line.
Except for the fact that no carriage return is output and that
the cursor is positioned immediately following the data output,
WRITEN/WRITN functions identically to WRITE.
NOTE: WRITEN/WRITN are executable commands and
should be located within the logic section
of the program.
Each WRITEN/WRITN command adds 9 bytes to the length of the
program. An additional two bytes is added for each integer or
string in the list. Arithmetic expressions add 6 bytes to the
program. '
XI.4.2 Command Format
WRITEN (file, format) variable, variable,
or
WRITN (file, format) variable, variable,
file - label of the console-type device
(defined 1in a CPL FILE statement)
to which data is to be written;
format - label of a CPL FORMAT statement;
variable - name(s) of the string variable,
literal or expression and/or in-
teger variable, literal or expres-
sion.
NOTE: An integer literal or integer variable must
use an "N" or "D" field specification
depending on the type of the integer. An in-
teger expression must use a "D" field speci-
fication. A string must use a "C" field
specification. For additional information
see FORMAT (XI.1l).
STATUS
The value of STATUS is affected by each WRITEN/WRITN command.
Possible STATUS values are 0 (Normal Completion, 2 (I/O Error or
Format Error) and 3 (End-of-Medium on Output).
X1-13 Revision 03/15/83
<!-- page 152 (front-matter table of contents, omitted) -->
<!-- page 153 -->
DECODE
XI.5 DECODE
XI.5.1 Usage
The DECODE command is used to transfer ASCII string data from
a source string to one or more strings or integers or to translate
ASCII numerics into binary.
NOTE: DECODE is an executable command and should
be located within the logic section of the
program.
Functioning to a large extent like the READ command, DECODE
performs no I/0 and takes its data from a character string stored
in memory. If the string is less than 132 characters in length,
trailing spaces are added to form a 132 character input record.
For additional information see READ (XI.2).
Each DECODE command adds 9 bytes to the length of a program.
An additional 2 bytes is added for each integer or string in
the list.
XI.5.2 Command Format
DECODE (string, format) variable, variable, ...
string - label of an ASCII character string
(defined in a CPL STRING statement)
from which data is to be read;
Note: If an offset is desired,
the string label plus the
number of bytes to be added/sub-
tracted must be included
in brackets. For example,
njl.
format - 1label of a CPL FORMAT statement;
variable- name(s) of the string variable; integer
variable or literally-subscripted table-name
in which data is to be stored.
STATUS
The value of STATUS is affected by each DECODE command. STATUS
values include O (Normal Completion) and 2 (Format Error).
Revised 6/15/83
<!-- page 154 -->
CPL
DECODE
XI.5.3 Cautions
l. Since spaces are added to the end of the
source string, care must be taken in decoding
under a numeric  N" or "D" field specification.
If a space is encountered to the right of the
number during the conversion process, the con-
version will not take place. For additional
information see FORMAT (XI.1l).
XI1-16
<!-- page 155 -->
ENCODE
XI.6 ENCODE
XI1.6.1 Usage
The ENCODE command transfers data stored in character string(s)
or integer(s) and/or calculated from arithmetic expressions.,
to a single character string.
NOTE: ENCODE is an executable command and should
be located within the logic section of the
program.
Functioning to a large extent like the WRITE command, ENCODE
performs no 1/0 and retains the terminator of the original target
string ignoring any terminators supplied in the source strings
or integers. This allows designated integers (rather than blanks)
to be expressed in character form while retairing dollar signs,
commas and/or other characters present in the target string.
The ENCODE command treats numeric and character data differently
in some instances. Under a "N" field specification, the string
is filled from right to left within the limits of the field
specification. Under a "C" field specification, the string
is filled from left to right. Blanks are used to fill out field
lengths in character conversions. Leading zeroes, however,
will not be added to numeric strings when integers are converted.
Thus, if the numeric string does not fill all specified places,
the leftmost characters will retain their original value. For
additional information see FORMAT (XI.1l).
Each ENCODE command adds 9 bytes to the length of the program.
An additional 2 bytes is added for each integer or string in
the list. Arithmetic expressions add 6 bytes to the program.
X1.6.2 Command Format
ENCODE (string, format) variable, variable, ...
string - label of ASCII character string (defined
in a CPL STRING or DEFINE statement)
into which data is to be written;
XI1-17
Revised 6/15/83
<!-- page 156 -->
STATUS
CPL
ENCODE
Note: If an offset is desired,
the string plus the number
of bytes to be added or subtracted
must be included in brackets.
For example, [string + n]
or [string - nJj.
format - label of a CPL FORMAT statement;
variable- name(s) of the string variable, literal
or expression and/or integer variable,
literal or expression from which data
is to be used.
The value of STATUS is affected by each ENCODE command. STATUS
values include O (Normal Completion) and 2 (Format Error).
X1.6.3 Cautions
1. Strings are not cleared when set up by a STRING
statement. Random values found in that area
of memory are retained in-the bytes of that string
not written over by the ENCODE command.
ENCODE does not add terminators during the transfer
of data. Indeed, terminators may be lost during
the process.
When data in a string takes up fewer characters
than the number called for in the STRING statement
a terminator is used to separate the valid data
from the random values which fill out the string.
The terminator may be lost if a group of characters
longer than the existing valid data is encoded
into the string. This may result in the appearance
of random values at the end of the string.
Revised 6/15/83
<!-- page 157 -->
NOTE
XI.7 NOTE
XI.7.1 Usage
The NOTE command allows the location of a specific record within
a Type "A" or Type "B  file to be stored in an fnteger. Used
wit POINT, the command allows a limited form of random access
to be performed on a sequential file.
NOTE may be located anywhere in a program so long as it follows
SYSTEM. A program may contain as many NOTE statements as
necessarye.
Each NOTE command adds 8 bytes to the length of the program.
xI.7.2 Command Format
NOTE (file, integer)
file - label of the Type "A" or Type "B"
file (defined in a CPL FILE state-
ment) containing the record whose
address is to be noted;
integer - label of the 4-byte integer (re-
served in a CPL INTEGER or SET
to be stored.
The operating system keeps track of the sector address and
displacement of the 1last record read or written. NOTE causes
the location of this previous record to be stored in the
specified 4-byte integer. Therefore, it must follow the READ or
READB command which accesses the desired record.
XI1.7.3 Cautions
1. Use WRITE with NOTE and POINT commands when
records being rewritten are of the same length;
use REWRITE when records are being written to
Type "A" files and are of unequal length. For
additional information see POINT (XI.8) and
<!-- page 158 -->
POINT
XI.8 POINT
XI.8.1 Usage
The POINT command is used in conjunction with NOTE to locate a
specific record within a sequential Type "A" or Type "B" file.
POINT positions the file at the beginning of the record
specified by a previous NOTE.
POINT may be located anywhere in a program so long as it follows
SYSTEM. A program may contain as many POINT statements as
necessary. :
When used with a Type "A" file, REWRITE may be used to change a
record in place. READ may also be used with NOTE and POINT to
access a Type "A" file. When NOTE and POINT are used with a Type
"B" file, READB and WRITEB may be used to access the file. tor
additional information see REWRITE (XI.9), READ (XI.2), Note
Each POINT command adds 8 bytes to the length of a program.
XI.8.2 Command Format
POINT (file, integer)
file - label of the Type "A" or Type "b"
file (defined in a CPL FILE state-
ment) containing the record to be
located;
integer - label of the 4-byte integer (re-
served in a CPL INTEGER or SET
statement) containing the location
of the desired record.
Note: This integer must be set by
the NOTE command. It contains
the sector address and offset
(i.e. number of bytes pre-
ceding the record) in that
sector.
XI.8.3 Cautions
1. Use WRITE with NOTE and POINT commands when
record being rewritten is of the same length;
use REWRITE when records being written to Type
"A\* files are of unegual length. For additional
information see NOTE (XI.7) and REWRITE (XI.9).
<!-- page 159 -->
REWRITE
XI.9 REWRITE
XI.9.1 Usage
The REWRITE command allows a record in a Type "A" file to be
updated in place. Each time a REWRITE command is completed, the
sector containing that record is written back to the disk. This
action prevents a subseqguent READ command from overlaying the
buffer in which the new data is stored.
NOTE and POINT must be used to locate the record to be written.
Once the record has been located and the file positioned at the
beginning of that record, the specified data will be written
into the exact same space occupied by the record to be replaced.
NOTE: This action means that a record longer than
the original will be truncated; a record
shorter than the original will be padded
with blanks.
Each REWRITE command adds 9 bytes to the length of a program. An
additional 2 bytes is added for each integer or string in the
list. Arithmetic expressions add 6 bytes to the program.
XI.9%.2 Command Format
REWRITE (file, format) variable
file - label of the device/file (defined
in a CPL FILE statement)into which
the data is to be written;
format - label of a CPL FORMAT statement
which contains output field speci-
fications;
variable - name(s) of the string variable,
literal or expression and/or in-
teger variable, literal or expres-
sion.
STATUS
The value of STATUS is affected by each REWRITE command .
Possible STATUS values are 0 (Normal Completion), 2 (I/0 Error
or Format Error) and 3 (End-of-Medium).
<!-- page 160 -->
CPL
REWRITE
XI.9.3 Cautions
1. REWRITE is normally used 1in conjuction with
the NOTE and POINT commands. For additional
information see NOTE (XI.7) and POINT (XI.8).
<!-- page 161 -->
CPL
## Chapter Twelve: BINARY INPUT/OUTPUT
OVEKVIEW
Binary Input/Output - unlike Formatted Input/Qutput - makes a
byte-for-byte transfer of data without differentiating between
binary and character data.
Binary I1/0 is primarily used with Type "B" or Type "C" disk
files. Type "B" files are similar to Type "A" files and orerate
in almost an identical manner. 1In a Type ""C" file the location
of the next record to be read is stored in an integer identified
as the KEY for the file. This integer may be set directly by
the program by eguating it with a 1literal or with another
integer. It may also be calculated through a subroutine (e.g.
GETK). For additional information see FILE (X.1l).
Type "C" files are divided 1into spanned-sector files and
discrete-sector files. Spanned-sector files are defined with
the keyword IND in a FILE statement. Since these files may not
be accessed with =either a READE or WRITEB statement, special
external subroutines must be used in these instances.
Spanned-sector files are wuseful in that they provide program
flexibility and economy of disk space. For additional
information see Chapter 13 - SPANNED-SECTOR 1/0 and the APLIB
Reference Manual.
Discrete-sector files are defined with the RND keyword in a FILE
statement. They may be accessed with either a READB or WRITED
Sstatement. Discrete-sector files are useful in that they provide
program simplicity, as well as reduce the size of the progranm.
The Logical Service Routine (LSR) for Type "B" files accesses
records sequentially, keeping track of the proper address in
memory. For additional information see FILE (X.1).
The Logical Service Routine for Type "C" discrete-sector files
uses a Kkey to determine the location of the record to be read.
This key may either be set directly with a literal or integer or
it may be calculated within the program based some other plece
of information usually known as the argument.
<!-- page 162 -->
RECOKD/
ENDREC
XII.1 RECORD/ENDREC
XII.1.1 Usage
The RECORD and ENDREC commands are used to reserve a binary
record with RECORD defining the beginning address of a memory
area and ENDREC defining the ending address.
NOTE: This memory area contains an entire record
from a file with individually defined fields.
The RECORD statement is generally followed by INTEGER, STRING,
DEFINE, SET or TABLE statement(s). Tiese combine with RECOkKD
and ENDREC to describe a record layout. For additional
information see INTEGER (VI.l), SET (VI.2), STRING DELFINE (VI.4)
and TABLE (VI.6).
Since RECORD is not associated with any given piece of 1I/0, it
may be used by multiple I/0 statements. As a piece of data,
RECORD/ENDREC statements may occur anywhere in a program
following SYSTEM. As many RECORD/ENLCREC statements as are
necessary may be used within a CPL program.
Each RECORD/ENDREC command increases the size of the program.
RECORKD adds 4 bytes to the program, while ENDREC adds 1 kyte.
In addition, the size of the program is increased by the record
length (i.e. the number enclosed in parentheses in the command
format).
XII.1.2 Command lormat
RECORD record (n)
LI
ENDREC
record - label of the record area;
n - literal wvalue representing the
size of the record area.
A record area must be used whenever Type "B" or Type "C" files
input or output data. This record area may be divided into
integers and character strings with INTEGER, SET, STRING, DEFINE
and TABLE statements following the RECORD statement.
XI1I-2
<!-- page 163 -->
CpPU-5/CPU-6
CPL
```
RECORD/
ENDREC
```

NOTE: Memory will be reserved for each integer and
string beginning with the lowest address in
the data area of the record.
The length of a record in a Type "B" file is determined by the
associated record statement. Therefore, different records (and
different record lengths) may be used with a single Type "B"
file.
In a Type "C" file each record occupies the amount of space
specified by the RECSIZ= keyword in the FILE statement for that
file. This occurs even if the assigned record area may be
smaller. For additional information see FILE (X.1).
XI1I.l1.3 Cautions
1. If the 1integers and strings specified within
the record is less than the total record
length, the remaining bytes will be reused by
the operating system.
2. An extra byte must be added to the length of
each string when calculating a total record
length. This allows for the terminator.
3. The CLREC subroutine may be used before data
is first written into a record area. This re-
moves random values from the unused portions of
the record. For additional information see the
APLIB Reference Manual (CLREC).
<!-- page 164 -->
READRB
XII.2 READB
XIIl.2.1 Usage
The READB command - or "unformatted" read statement - makes a
byte-for-byte transfer of data from a device/file to a record
area in memory. The READB command is used with Type "B" or Type
ner files.
Each KEADB command adds 7 bytes to the program.
XII.2.2 Command Format
READB (file, record)
file - label of a file (defined in a CPL
FILE statement) from which a re-
cord is read;
record -- label of the record (defined in a
CPL RECORD statement) into which
data is read.
Note: The format of the record area
specifies the number of bytes
to be read through the RECORD
statement, as well as the
assignment of data to inte-
gers and strings within that
record.
STATUS
The value of STATUS is affected by each READB command. Possible
STATUS values are 0 (Normal Completion), 1 (End-of-File on
Input - Type "B" files only or Key Out of Range - Type "C" files
only) and 2 (1/0 Error - Type "B" and Type "C" files or Invalid
Key - Type "C" files only).
XII1.2.3 Cautions
l. READB should not be used with Type ""C"
spanned-sector files.  Since the record 1length
in such files may exceed a single sector, use
the external subroutine GETR with Type "C"
spanned-sector files. For additional inform-
ation on spanned-sector 1/0, see Chapter
3 - SPANNED-SECTOR 1/0 and the APLIB Reference
Manual (GETR) .
XI1I-4
<!-- page 165 -->
CPL
READB
The specified number of bytes give in the
RECORD statement will be read by READB; no
error checking is performed.
For CPU-5 compatibility READB should not be
used after using GETK/NEWK, instead use GETR.
<!-- page 166 -->
WRITEB
XII.3 WRITEB
XII.3.1 Usage
The WRITEB command - or "unformatted" write statement - makes a
byte-for-byte transfer of data from a record in memory to a
device/file. For additional information see RECORD/ENDREC
(XII.1).
Each WRITEB command adds 7 bytes to the program.
XII.3.2 Command Format
WRITEB (file, record)
file - label of a file (defined in a CPL
FILE statement) to which a record
is written;
record - label of the record area (defined)
in a CPL RECORD statement) from
which data is written.
STATUS
The wvalue of STATUS 1is affected by each WRITEB command.
. Possible STATUS values are 0 (Normal Completion), 2 (I/0 Error -
Type "B" and Type "C" files) AND "B" file or Invalid Key - Type
"c" file).
Note: An attempt to write to a record number
higher than the maximum number of records
in the file will result in a STATUS of 3.
XII.3.3 Cautions
l. WRITEB should not be used with Type ncH
spanned-sector files. Since the record length
in such files may exceed a single sector,
use the external subroutines PUTR with Type
"C" spanned-sector files.
For additional 1information on spanned-sector
files, see Chapter 13 - SPANNED-SECTOR I1/0 and
the APLIB REFERENCE MANUAL (PUTR) .
2. For CPU-5 compability WRITEB should not be used
after using GETR/NEWK, instead use PUTR.
<!-- page 167 -->
HOLD/
FREE
XII.4 HOLD/FREE
XII.4.1 Usage
The HOLD command sets a flag in a shared, discrete-sector Type
wcw file. This flag indicates that a record in the file is being
accessed and that the sector containing that record should not
be accessed by another partition. The FREE command turns off
the flag set by HOLD.
The location of the next racord to be accessed in a Type "cH
file 1is stored in memory. Although this is similar to the
procedure followed by Type "A" and Type ng" files, the record
number in a Type "C" file may be changed directly by the
program. If the program does not change the number of the
record to be .accessed, it will remain the same no matter the
number of times it is read or written. The sector containing
"i; next record to Dbe accessed 1is noted in a table in the
operating system when the HOLD command 1s glven.
JOTE: On the CPU-5, the maximum number of entries
: in the table 1is egual to 6 times the number
of partitions on the system. However, an
individual  partition may use more than  
holds at a given time. On the CPU-6, there
is a "sector hold table" within the system
of a finite size and tne maximum number of
entries is system generated.
fEach HOLD and FREE command adds 6 bytes to the program.
XI1.4.2 Command Format
HQLD (file)
or
FREE (file)
file - label of a file (defined in a CPL
FILE statement) from which a sec-
tor is to be held or freed.
STATUS
The value of STATUS is affected by each HOLD commangd. Possible
STATUS values after execution of a HOLD command are 0 (hHold
XI1I1I-7
<!-- page 168 -->
STATUS (cont.)
CPL
HOLD/FREE
Sucessful), 1 (Required Sector Held by Another Partition) or 2
(Record Outside of File or Invalid Key). The HOLD command has
an effect only on another HOLD. The value of STATUS after
execution of a FREE command is always zero (0) .
XI1.4.3 Cautions
l. In order for HOLD to be effective, it must be
used by all partitions with
change the file. In addition,
the ability to
it must be used
with the STATUS check mentioned above. The HOLD
command does not prevent access to a sector by
another partition.
2. On the CPU-5, HOLD/FREE may be used only with
discrete-sector Type "C" files. On the CPU-6 '
HOLD/FREE may be used both with discrete-sector
and spanned-sector Type "C" files.
3. For CPU-5 compatibility HOLD/FREE should not be
used after using NEWK/GETK, instead use HLDR/
FRER.
XII-8g Revision 9/15/82
<!-- page 169 -->
CPL
## Chapter Thirteen: SPANNED: SECTOR INPUT/OQUTPUT
### OVERVIEW
No CPL commands exist for the processing of Type "cH
spanned-sector files on the CPU-5. Special external subroutines
located in APLIB must be used instead. While input and output
functions performed by the operating system are limited by
sector boundaries, these special subroutines perform their own
I/0 through I0C, a common subroutine.
NOTE: Use of these subroutines on the CPU-6 is
optional. However, to insure CPU-5/CPU-6
compatability, they should be used.
These subroutines are able to access records greater than a
sector in length by using the extra bytes appended to the Record
Control Block of a Type "C" spanned-sector file. Because the
records may cross sector boundaries, the subroutines are also
able to divide a record between two or more sectors. This
utilizes otherwise wasted space at the end of a sector.
NOTE: For additional information on the creation
of Record Control Blocks see FILE (X.1l.1).
Indexing routines are used on both the CPU-5 and CPU-6 to locate
specific information. A file is prepared for these routines by
the system utility VRINT. VRINT creates an indexing area at the
beginning of the file. This indexing area is divided into index
records which point to records in the prime data area of the
file,
NOTE: The VRINT utility is utilized on the CPU-5
system only.
Indexing routines employ an algorithm to convert the argument
into the relative key of a record within the index area. Only
integers and strings may be used as arguments; literals are not
permitted.
<!-- page 170 -->
CPL
### OVERVIEW
NOTE: 1Integers are used if the argument is a 4- or
6-byte integer; strings are used if the
argument is between 7 and 35 alpha-numeric
characters in length.
Synonyms are different arguments which produce the same results.
For this reason, each index record contains an index pointer
which 1links all synonyms which are the product of a given
algorithm. If the algorithm yields the relative key of an index
record which cioes not have an identical argument, the chain of
index records is read until the proper argument is located or
read until it is determined that the record does not exist.
The subroutines GETK, NEWK, DELK and NEXK are used by the
program . to communicate with the indexing area. For additional
information see the APLIB Reference Manual (GETK, NEWK, and
DELK,).
GETK - sets the Key integer of the file to the relative
key for the specified argument.
NEWK - creates a new index record for a specified argu-
ment by reserving space for that record in the data area of
the file. Since NEWK does not check for the prior existence
of a record with the given argument, GETK must be performed
first,
DELK - sets the prime data pointer in the index record
to zero. This makes the index record available to the NEWK
subroutine and - removes the record from the chain of
Synonyms.
NEXK - used only on the CPU-6 system, NEXK searches
forward in the key area for the next valid
key. It sets the key integer to that key and
the argument variable to the argument for that
key.
NOTE: 1) No order of keys is guaranteed and the
order that results 1is unpredictable.
2) If no additional keys exist, NEXK sets
STATUS=1.
<!-- page 171 -->
GETR
XIII.1 GETR
XIII.l.1l Usage
The GETR subroutine is used to transfer a record from a Type "C"
spanned-sector file to a record area in memory.
NOTE: The APLIB GETR subroutine corresponds to the
CPL READB command. Since it is an APLIB sub-
routine, it must be externalized. For addi-
tional information see EXTERNAL (V.1l).
GETR may be used by both the CPU-5 and CPU-6
systems.
The complex of subroutines which includes GETR - along with the
externals called by this routine - takes up approximately 950
bytes on the CPU-5.
XIII.1.2 Command Format
CALL GETR (file, record)
file - label of the Type "C" spanned-
sector file (defined in a CPL FILE
statement) to be read;
record - label of the record area into
which the record is to be read.
NOTE: The CALL in CALL GETR is the CPL CALL
command word. For additional information see
CALL (IX.6).
Relative Key
The relative record number (i.e. relative key) must be given in
the key integer assigned to the file.
STATUS
The value of STATUS is affected by each GETR subroutine /call.
Possible STATUS values include 0 (Normal Completion), 1 (Record
Not Found) and 2 (I/0 Error or Invalid Key).
<!-- page 172 -->
PUTR
XIII.2 PUTR
XIII.2.1 Usage
The PUTR subroutine transfers a record from a record area Iin
memory to a Type "C" spanned-sector file.
NOTE: The APLIB PUTR subroutine corresponds to the
CPL WRITEB command. Since it is an APLIB
subroutine, it must be externalized. For
additional information see EXTERNAL (V.l).
PUTR may be used by both the CPU-5 and CPU-6
systems.
The complex of subroutines which includes PUTR - along with the
externals called by this subroutine - takes up approximately 950
bytes on the CPU-5.
XII1.2.2 Command Format
CALL PUTR (file, record)
file - label of the Type /YC" spanned-
sector file (defined in a CPL FILE
statement) to which the record is
to be written;
record - label of the record area from
which the record is to be read.
NOTE: The CALL in CALL PUTR 1is the CPL CALL
command word. For additional information see
CALL (IX.6).
Relative Key
The relative key must be given in the key integer assigned to
the file.
STATUS
The value of STATUS is affected by each PUTR subroutine call.
Possible STATUS values include 0 (Normal Completion), 2 (I/O
Error or Invalid Key) and 3 (End-of-Medium on OQutput).
<!-- page 173 -->
HLDR/FRER
XIII.3 HLDR/FRER
XIII.3.1 Usage
The HLDR subroutine is used to notify a program attempting to
hold a record that that record is already being held. The FRER
subroutine cancels that hold. Both HLDR and FRER are designed
to deal with records that may cross sector boundaries.
NOTE: The APLIB HLDR and FRER subroutines cor-
respond to the CPL HOLD and FREE commands.
HLDR/FRER may be used by both the CPU-5 and
XI111.3.2 Command Format
CALL HLDR (file)
or
CALL FRER (file)
file - label of the file containing the
sector(s) to be held.
NOTE: The CALL in CALL HLDR and CALL FRER is the
CPL CALL command word. For additional infor-
mation see CALL (IX.6).
All sectors containing any part of the record will be held by
the HLDR command. A separate entry is made for each sector in
the table of held sectors in the operating system. This causes
the HLDR subroutine to fill a table more quickly than the HOLD
command.
STATUS
The value of STATUS after a call to HLDR are (Hold Successful),
1 (Required Sector Held by Another Partition) or 2 (Record
Qutside of File or Invalid Key). The value of STATUS after a
call to FRER is always equal to 0 (Hold Successful).
<!-- page 174 -->
CPL
## Chapter Fourteen: MISCELLANEOUS COMMANDS
XIv-1
<!-- page 175 -->
CURP/
CURSOR/
CURB/
CURS
XIVv.1 CURP/CURSOR/CURB/CURS
XIVv.1l.1 Usage
The CURP, CURSOR, CURB and CURS commands are used to manipulate
the display on the screen of a console device. Each command
allows communication between the Operator and the software.
Each CURP, CURSOR and CURS command adds 8 bytes to a program;
each CRUB commands adds 6 bytes.
CURP
The CURP (cursor position) command determines the point at which
the input/output of the next character will be displayed. CURP
has no effect on data already displayed. Subsequent keyboard
entries or program output will overlay existing data, however.
CURSOR
The CURSOR command is used to specify where a CRT cursor is to
be placed. Although similar to the CURP command, CURSOR differs
in the following ways:
1. The line (vertical) position is specified first.
2. The line (vertical) and column (horizontal)
positions on a CRT begin with 0O, not 1.
3. The 1line and column positions may be specified
integer expressions. For example:
4. The column position is optional; if omitted
there is a default to 0.
CURB
The CURB (cursor blank) command blanks a specified number of
characters beginning with the present location of the cursor.
CURB returns the /cursor to its original position after output
of the blank character(s).
XIv-2 Revision 03/15/83
<!-- page 176 -->
CpPL
CURB/CURSOR
CURB/CURS
CURS
The CURS (cursor substitute) command allows the program to
display a character other than a blank. 1In all other respects
it functions in the same manner as CURB.
XIV.l1.2 Command Format
CURP (file, column, line)
or
CURSOR (file, line, column)
or
CURB (file, number)
or
CURS (file, number, string)
file - label of the device (defined in a
CPL FILE statement) where cursor
manipulation will take place;
column - 4-byte integer or literal (or in-
teger expression if dealing with
the CURSOR command) where the cur-
sor will be placed;
Note: The CURP command utilizes a
column range of 1-80; CURSOR
utilizes a range of 0-79.
line - 4-byte integer or literal (or in-
teger expression if dealing with
the CURSOR command) where the cur-
sor will be placed;
Note: The CURP command utilizes a
line range of 1-24; CURSOR
utilizes a range of 0-23.
number - 4-byte integer or literal designa-
ing the number of spaces to be
filled;
Note: CURB fills designated spaces
with blanks; CURS fills de-
signated spaces with the
specified character.
string - label of a l-character string con-
taining a character to be dis-
played by the CURS commangd.
XIv-3
<!-- page 177 -->
CPL
CURP/CURSOR
CURB/CURS
XIV.l1.3 Cautions
1.
2.
CURP, CURSOR, CURB and CURS may be used on CRT-
type devices only.
CLASS=0 1is wused for CURP, CURSOR, CURB and
CURS.
Note: CLASS=0 is also the default.
XIVv-4
<!-- page 178 -->
DUMP
XIV.2 DUMP
XIv.2.1 Usage
The DUMP command is used to display the contents of the "A",
wg , mx , my", 6 "z" and "S" registers, the contents of the stack
and the contents or a specified area of memory.
All displays are in hexidecimal notation. The memory dump is
accompanied by an ASCII translation on the right side of the
screen. The first line displays the contents of the registers
and the first 18 bytes of the "S" stack. After the display is
completed, control is returned to the next command following the
DUMP command.
NOTE: The display will be terminated with an
asterisk if more than 18 bytes are stored in
the stack.
The DUMP command may be located anywhere in a program so long as
it follows SYSTEM. A program may contain as many DUMP
statements as necessary.
Each DUMP command adds 8 bytes to a program.
XIV.2.2 Command Format
addressl - specifies the address at which the
memory dump begins;
the memory dump ends.
XIV.2.3 Cautions
1. DUMP is to be used in program testing only; it
should not be included in released software.
2. Only the simplest form of an offset label (i.e.
a label plus a literal) may be used with the
DUMP command.
Note: Integers, variables, integer expres-
sions, etc. may not be substituted for
labels.
XIiv-5
<!-- page 179 -->
LOAD
XIv.3 LOAD
XIv.3.1 Usage
The LOAD command allows one program to load another during
execution. The second program may be loaded 1) at the same
address as the first program, overlaying it completely, 2)
above the first program and used like a subroutine or 3) at any
point within the first program, overlaying the remainder of that
program.
NOTE: A full overlay must be a main program. All
files must be closed prior to performinrg a
full overlay; however, no end-of-step pro-
processing is performed. A partial overlay
must be a subprogram. This subprogram is
used like a subroutine. It is not necessary
to close the file involved unless a FILE
statement is being overlain.
Each LOAD command adds 11 bytes to the program. An additional 2
bytes are added to program length for each item in the parameter
list.
XIV.3.2 Command Format
LOAD (mask, label, option) [(name, name, cee)]
mask - label of string (defined in a CPL
DEFINE statement) used to locate
the program to be loaded;
label - location within the program at
which the second program is to be
loaded;
Note: If an offset is desired, the
name plus the number of bytes
to be added or subtracted must
be included in brackets. For
example, [label + n] or
[label - n].
option - specifies where control is to be
passed;
name - parameter to be passed to the
overlay.
Note: This parameter functions in a
manner similar to the "name"
in a CALL statement (IX.6.2).
<!-- page 180 -->
CPL
LOAD
Mask
The mask contains the JCL name to be used for the full or
partial overlay. The mask may contain the full name of the
program to be called. 1If the overlay program has characters in
common with the original .RUN file name, spaces may be used to
represent these common characters. If the mask is less than 6
characters (CPU-5) or 10 characters (CPU-6), the unused
characters of the mask are not masked by the .RUN filename.
Note: In a library file the mask 1is compared to
the subfile name. An overlay for a library
file must be a subfile 1in the same library
as the .RUN file name.
Label
If a fdll overlay is specified, a literal 0 should be wused for
the 1label field. If the second program 1is to be loaded
immediately above the calling program, HICORE should be
specified.
HICORE, which is defined for every program, 1is a subroutine
containing nothing but the label itself. It is composed of the
address of the last byte of the program, plus 1. The 1link
jobstream 1is designed so that HICORE will be linked last; this
provides a label at the very end of the program.
Note: HICORE remains constant throughout a parti-
cular program. This allows multiple over-
lays to be loaded with each overlay replac-
ing the previous one.
Option
Possible options include:
0 - full overlay
1 - subroutine partial overlay
Note: This allows the subroutine to be loaded and
control to be passed immediately to the sub-
routine.
<!-- page 181 -->
CPL
LOAD
Options (cont.)
2 - partial overlay
Note: This allows the subroutine to be locaded only
and control returned to the loading program.
After loading, the entry address is located
in the "B" register.
When option 1 or 2 is used, the parameter name(s) may be listed
in parentheses. The overlay may then access this name(s) with a
RETRIEVE statement(s). For additional information see RETRIEVE
(IX.9).
Note: An overlay 1is a subprogram on the CPU-5
system, which must be linked by using S.SCPL
rather than S.CPL. On a CPU-6, P.SCPL rather
than P.CPL must be used.
STATUS
The value of STATUS is affected by each LOAD command. STATUS
values include 0 (Overlay Loaded) or 4 (Overlay not Found) .
XIV.3.3 Cautlions
1. 1If programs are loaded at a label other than O
or HICORE, necessary code could be overlain by
the second program.
2. The CPU-5 does not provide automatic partition
growth or shrinkage. If a partition is not made
large enough initially, an ABORT 4 will result
when attempting a LOAD. Since the operating
system on the CPU-6 provides automatic par-
tition adjustment, it is not necessary to moni-
tor partition size.
Note: Maximum partition size on the CPU-6 1is
32K.
<!-- page 182 -->
XIV.4
XIv.4.1
The ORIGIN command is used to change the location counter during
compilation. ORIGIN is useful in redefining data areas within a
program.
XIv.4.2
XIv.4.3
ORIGIN
ORIGIN
### Usage
NOTE: Any piece of information in a program may be
overlain by another piece of information by
using ORIGIN. 1In this respect ORIGIN is the
equivalent of the assembler directive ORG.
For additional information on ORG, see the
Assembler Language Manual.
### Command Format
ORIGIN address
address - name of a program label, a data
area or an assembler expression.
Note: The 1location counter is set
to the 2-byte wvalue of the
address.
### Cautions
l. When overlaying reéords, the 1last record de-
fined should be as long as the 1longest record
overlain.
2. Only the initial values - if any exist - in the
final overlaying record should be (considered
valid. At program load time any initial values
in the overlain record will be destroyed by
any initial values in the overlaying record.
XIv-9
<!-- page 183 -->
EQUATE
XIV.5 EQUATE
XIv.5.1 Usage
The EQUATE command is used to assign a label to a specific
location. EQUATE equates an expression to a label. Anytime
that label were used in a CPL program, the value of that
expression would be used.
The following sequence of statements would allow an integer
variable to be accessed either as a 4-byte (VAL) or 6-byte
(?VAL) integer variable.
SET ?VAL:0
EQUATE VAL, [?VAL + 2]
XIV.5.2 Command Format
EQUATE label, expression
label - name to be assigned to a specific
location;
expression - address.
Note: Only one EQUATE per name is
allowed.
<!-- page 184 -->
XIV.6
XIV.6.1
GTIME
### Usage
GTIME
The GTIME Command allows a CPL program to access the system time
(if a clock exists) and store it in an integer/string.
use of GTIME is in the calculation of elapsed time.
The GTIME command adds 5 bytes to program length if
is used;
XIV.6.2
XIV.6.3
Primary
NOTE: The CPU-4 system stores the integer form of
GTIME in 1/20,000 seconds of the day since
00:00:00. This 1integer must be divided by
20,000 to derive an even number of seconds.
The CPU-5/CPU-6 system stores the integer
form of the command in 1/10 seconds; must be
divided by 10 for seconds.
9 bytes are added if a string is used.
### Command Format
GTIME (INTEGER, integer)
or
GTIME (STRING, string)
an integer
integer - label of an integer (defined in a
CPL INTEGER or SET statement) in
which the system time (either in
1/20,000 seconds for the CPU-4 or
1/10 seconds for the CPU-5/CPU-6)
is to be stored;
string - label of a (character string (de-
fined in a CPL DEFINE or
statement) in which the
STRING
system
time (hh:mm:ss) is to be stored.
### Cautions
1. The string wused to contain the STRING form of
the time must be 8 characters in length.
XIvV-11
<!-- page 185 -->
LDATE/
SDATE
Xiv.7 LDATE/SDATE
XIV.7.1 Usage
The LDATE command is used to load a date into the "A" register.
That date may then be stored either in integer or string form by
SDATE.
To determine how each command (and keyword) affect program size,
consult the following:
Command Size in Bytes
LDATE (INTEGER, X) 3
LDATE (STRING, X) 6
LDATE (WORD, X) 3
LDATE (FILE, X) 6
LDATE (CURRENT) 3
LDATE (GRIN, X) 6
SDATE (INTEGER, X) 8
SDATE (FILE, X) 6
XIv.7.2 'Command Format
LDATE (form) [,label]
or
SDATE (form, label)
form - type of date (indicated by the
keywords STRING, INTEGER, WORD,
CURRENT, FILE, GRIN) to be 1loaded
or stored;
label - name of an integer, string or
file.
Note: A "label 1is not wused with
the keyword CURRENT.
XIvV-12
<!-- page 186 -->
CPL
LDATE/
SDATE
Keyword Designation
1.  STRING 1indicates that the date to be transferred is
in 6-character or 8-character form with optional leading
zeroes included. Input may be in the form mm/dd/yy or may
have any non-numeric character(s) separating the components
of the date. When used with SDATE, the date is output as
mm/dd/yy.
The 1label used with the STRING keyword must specify a
character string defined in a CPL STRING or DEFINE sta.ement.
2. INTEGER indicates that the date to be transferred is
in the form of number of days since December 31, 1899. (For
example, January 1, 1900 = 1l.)
Note: INTEGER is useful in computing elapsed days.
The 1label used with INTEGER must specify a 4-byte integer
defined in a CPL INTEGER or SET statement.
3. WORD functions in the same manner as INTEGER except
it allows the integer form of a date to be stored in 2 bytes
instead of 4.
Note: This option 1is seldom wused since the date
may not be manipulated in this form. In
addition, offset labels must be used if this
shorter form is to be used efficiently.
4. CURRENT is used only with the LDATE command. LDATE
(CURRENT) (causes the current system date to be loaded.
It may then by output by SDATE in any form desired.
The CURRENT command requires no label.
5. FILE indicates that a date is to be transferred to
or from the directory entry for a specified file.
The label used with FILE must specify a file defined in a
in a CPL FILE statement.
XIv-13
<!-- page 187 -->
CPU--5/CPU-6
CPL
LDATE/
SDATE
6. GRIN indicates that the date is to be transferred in
Gregorian Integer Form (i.e. mmddyy).
Note: GRIN is useful in computing elapsed months
and years.
The label used with GRIN must specify a 4-byte integer de-
fined in a CPL INTEGER or SET statement.
STATUS
With LDATE the value of STATUS is either 0 (Normal Completion)
or 2 (Zero or other 1invalid date). With SDATE the value of
STATUS is affected only if 0 or another invalid date is stored.
In this case STATUS is set to 2. Otherwise, it remains unchanged
(i.e. retains the value from LDATE).
Note: An invalid date (causes a target integer to
be set to 0 or a target string to be set to
blanks.
XIVv.7.3 Cautions
1. SDATE must immediately follow LDATE. Since the
"A" register is wused to hold the date, any
command executed between LDATE and SDATE 1is
likely to change the contents of this register.
The only exceptions are the unconditinal GO TO
(IX.2), CALL (IX.6) and RETURN (IX.8).
 -  - 
i LR AT
, = S A
l : Sl Al
) 33
L/ . Lb'v )
o o
S 7-Aif') XIV-14
<!-- page 188 -->
Subscripted
Variables
XIv.8 Subscripted Variables
Xiv.8.1] Usage
Elements in an integer table may be accessed by means of
subscripted wvariables. The table name is subscripted with an
integer literal (i.e. 1literally-subscripted) or an integer
expression.
Changing a table element by means of a subscripted variable does
not change the value of the work area. For example, the
following input: '
```
FORMAT FOl:N2
TABLE A(2)
```

A=1
A(l)=2
A(2)=3
WRITE (CRT, FO01l) A, A(l), A(2)
will display -
NOTE: A(0) will not access the work area in table
. IlAll.
In integer assignment statements use of 1literally subscripted
variables does not add to program length. Use of integer
expressions as subsrcipts adds 5 bytes to the 1length of a
program for each variable or 1literal contained 1in the
expression.
Subscripted variables have replaced the TBLGET/TBLPUT (commands
in some systems. However, those programs employing TBLGET or
TBLPUT may continue to wuse those forms. For additional
information see TBLGET (XIV.9) and TBLPUT (XIV.1l0).
<!-- page 189 -->
TBLGET
XIV.9 TBLGET
XIV.9.1 Usage
The TBLGET command transfers an entry from a string table to the
work area assigned to that table. It may also be used with
integer tables. Once that transfer is complete, that entry may
be used like any other string or integer.
The compiler handles the TBLGET external subroutine like a CPL
command. The size of the external subroutine is added to the
program size when it is referenced within the program.
If the table-name is literally subscripted, the TBLGET command
adds 7 bytes to the 1length of a program. Otherwise, the
increase in length depends upon the complexity of the subscript.
XIv.9.2 Command Format
TBLGET table (integer)
table - name of a work area assigned to a
table in a CPL TABLE statement;
integer - name of an integer or variable
which specifies the number of the
table entry to be accessed.
XIv.9.3 Cautions
1. Table handling routines require a service call
each time a table entry is accessed. When a
table must be searched an entry at a time, the
operation of the program is slowed considerably.
2. Since no range checking is performed when a
table is accessed, an entry outside the bounds
of the table should not be accessed.
3. Although TBLGET is still operational for in-
teger tables, subscripted wvariable integers
provide a more efficient means of handling
tables. For additional information see
Subscripted Variables (XIV.8).
<!-- page 190 -->
TBLPUT
XIv.1l0 TBLPUT
XIVv.1l0.1 Usage
The TBLPUT command transfers the contents of the work area
assigned to a table to a specified position within that table.
The compiler handles the TBLPUT external subroutine like a CPL
command . The size of the external subroutine is added to the
program size when it is referenced within a program.
If a literal integer value is specified, the program size Iis
increased by the 1length of the integer, plus 18 bytes. If an
integer expression is used to specify the wvalue or as the
subscript for the table-name, the increase in program size
depends on the complexity of the expression.
XIV.10.2 Command Format
TBLPUT table (integer) [: 'string'] or [:value]
table - name of a work area assigned to a
table in a CPL TABLE statement;
integer - name of an integer or wvariable
which specifies the number of the
table entry 1into which the con-
tents of the work area are to be
transferred;
string - initial value being assigned to
the specified entry in a string
table;
value - initial value being assigned to
the specified entry in an integer
table.
Information resident in the work area at the time the command
is given will be transferred to the specified entry. A new
value may be assigned to this area before the transfer, if a
colon (:) and a character string in single Qquotes (') or a
numeric value follow the command.
XIV.10.3 Cautions
1. Table handling routines require a service call
each time a table entry is accessed. When a
table must be searched an entry at a time, the
operation of the program is slowed considerably.
XIv-17
<!-- page 191 -->
CPL
TBLPUT
Since no range (checking 1is performed when a
table is accessed, an entry outside the bounds
of the table should not be accessed.
Although TBLPUT 1is still operational for in-
teger tables, subscripted variables provide a
more efficient means of handling integer
tables. For additional information see Sub-
scripted vVariables (XIV.8).
XIv-18
<!-- page 192 -->
ADRLST
XIiv.1ll ADRLST
XIv.1l1l.1l Usage
The ADRLST command allows a list of addresses to be coded. The
object (code generated for each address in the list is the 2
bytes of storage containing that address.
NOTE: If a 1l-byte literal is wused in place of an
is generated rather than an address.
ADRLST is primarily used by assembler routines. As a piece of
data, the command should not be located in the logic section of
a CPL program.
XIv.11.2 Command Format
address - term used to designate a data item
or a program label.
Xiv-19
<!-- page 193 -->
A
\*p" file - see file, Type "A"
ABS - 1I-5, VII-3, VIII-2 (command)
access - X-2/%X=-3 (keyword)
addition operation (+) - 11-5, VII-3, VII-S
XIv-6, XI-9
ADRLST - XIV-19 (command)
algorithm = XIII-1
APLIB - I-3, XI1I-1, XIII-3, XIII-4, XIII-S
argument - XII-1
g - Ix-2, IX-10
@cpL - II1I-3, V-3
@REM - VII-2
ASCII data - see data, ASCII
assembler - 1-2/1-3, I11-2/11I-5, Iv-3/
Iv-4, Ix-14, XIV-19
assembler expression - see expression,
assignment statement - vIii-1
B
BEEP - III-9
pinary data - see data, binary )
pinary library file - see file, binary
library
plank lines - IV-6, IV-9
plank spaces - 1V-7, iv-10, IX-26, XI-4/
brackets - 1I1-6, IX-9, XI-15, xI-18, XIv-6
buffer - IV-10, VI-1, X-2/X-4, X-6, X=7,
Xx-8, X-9, X-10, XI-7, xI-9, XI-11l/
XI-12, XI-21
BUFFER - VI-7 (command), X-2/%X-4
BUFFER=n - X-2/X-4
buffer, program line - III-4
o
CALL - I-3, 1IX-9 (command), 1IX-10, IX-11, IX-12/1%-14, Ix-1%, IX-21, XIIlI-3, XIv-6, XIv-14
character data - see data, character
character string - see string, character CLASS=n - X-2/X-3
CLOSE - IX-13, X-8 (command), X-1l CLPRP - 1IV-7
CLREC =- XI1I-3
colon - IX-1, IX-2, X-2, XI-3 comma - 1I-3, III-3, X-2, X-6, XI-17 comment line - IV-9 (definition)
CPL
INDEX
compiler - I-1/1-3, 11:1-9, 1iv-1i/1v-11, v-1/
v-3, Ix-2, 1X-10
Completion Code (CC) - 111-7/111-8
concatenation - II-5S
conditional GO TO - see GO TO, conditional
continuation line - IV-10 (definition)
CONTROL - IX-12/1IX-13
COoPY - I11-2, IV-7 (command)
copy library - see library, CopYy
counter, location - XIV-9
CPL - 1-1 (definition), II1I-2, IV-3 (com-
mand)
cross reference table - see table, cross
CRT - I-1
CURB - IX-12, XIv-2/XIV-4, (command)
CURP - IX-12, XIV-2/XIV-4, (command)
CURRENT - XIV-12/XIV=13
CURS - IX-12, XIV-2/XIV-4 (command)
cursor - XIV-2/XIV-4
CURSOR - IX-13, XIV-2/XIV-4 (command)
D
XI=-15%
data, binary - 1-3, XI-1, XI-15, XII-l
data, character - XI-1, XI-17, Xx11-1, XIV-S
decimal - II-5, VII-3, VIII-7, XI-5/XI1-8
decimal point - XI-5
DECODE - IX-13, XI-2/XI-3, XI-15 (command)
DECREMENT/DECR - VII-7 (command)
DEFINE - VI-6 (command) VII-S, I1X-26,
DELT - III-7
DIRECT - III-2, IV-3 (command)
discrete file - see file, discrete
division operaticen (/) - [II-5, VIiI-3,
VIlIi-6
DUMMY - I-1/I-2
DUMP - XIV-5 (command)
E
EJECT - IlI1-2, 1I1-9/111-10, IV-5 (command)
ENCODE - IX-13, XI-2/XI-3, XI-17 (command)
END - II1I-9 (command)
ENDFILE - IX-13, X-B, X-9 (command) END LOOP - 1IX-4/IX-S5, 1IX-6/1X-7, IX-8
({command)
<!-- page 194 -->
ENDREC - XI1-2 (command)
end-of-medium - XI-12
end-of-record - XI-11
end-of-sector mark - XI-11
ENTRY - 1II1-4, I1I-5, 111-6 (command)
entrypoint - v-1 (definition), V-2/V-4
ENTRYPOINT - V-1/V-4, V-3 (command), IX-10
equal sign (=) - VII-1, V -2
EQUATE - X1IV-10 ({command)
error, format - see formaet error
error, syntax - See syntax error
ESP - IV=3
execution record - see record, execution
EXP=A - I111-2/111-5
EXP=B - I111-2/11I-5
viIl-2, Vvill-B, Ix-3, XIVv-loO
expression, arithmetic - XI-17
expression, assembler - I11-5/11-6, XIV-9
expression, binary - II-6
expression, hexidecimal - 11-6
expression, integer - II-5 (definition),
vViii-1, 1X-20, XI-11, XxI-13, XI-18, X1-21, XIv-15
expression, string - 1I-5 (definition),
external - V-1 (definition),
XIII-3, XIII-4
EXTERNAL -- VI-1/VI-4, V-2 (command), IX-9
v-2/vV-4,
external routines - see routines, external
exterral routines - see subroutines, external
F
Field Specification, sce - XI1-2/X1-8, XI-11,
X113 Xt . X1-2/X1-8, XI-16 Field Specification, \*D - -8, -
Field Sgecification, "N  - X1-2/X1-8, X1-11,
xI-13, XI-16, XI-17
Field Specification, \*x \* - XI-2/X1-8
FILE - IX-12/Ix-13 (keyword) , X-2 (command).,
X-6, X-8, X-9, X-10, XI-9, XI-11, XI-13,
X11-4, XII-6, XII-7. X111-3, XII1I-4,
Xiv-3, XIv-6, XIV-12/XIV-13 (keyword)
file, binary library - 111-4
file, discrete sector - XII-1, XII-7/X1I-8
file, indexed - X-3/X-4, X-7, X-10
file, random - X-3/X-4, X-10
file, sequential - X-3/X-4, X-9, X-10
file, source - 1-2/1-3
file, VSI - X-4, X-7
XxI11-6, XII-8, XIII-1, XI111-3, XI1II-4
file, Type "A" - 1-2, 111-4, IvV-8, X-3/X-5,
CpL
INDEX
file, Type \*B" - X-3/X-5, X-9, X-10, XI-19,
file, Type "C" - X-3/X-5, X-10, XII-1,
Xx11I-1, XII1-3, XIIIl-4
file, Type "I" - X-4
FILTYP=c - X-2, X-4
flag, step - I-3
FORMAT - IX-12/1%X-13 (keyword), XI-2 (com=
x1-18, X1-21
format error - IX-7
formatted READ statement - see READ state-
ment, formatted
FREE =- I1X-13, X-11, XII-7 (command),
XI1I1I1-5
FRER =- XIII-5 (command)
functions, built-in - vii-3, VII1-1/VIII-8
G
GETR - XII-4, XI1II-3 (command)
GO TO - IX-3 (command), IX-5, IX-6, IX-9,
GO TO, conditional - IX-2
GC TO, unconditional - IX-2, XIv-14
GTIME - XIV-1ll (command)
H
header - V-2/ V-3
LREQ - 1IX-26
hexadecimal notation - III-9, XIiv-5
.HGE - 1X--26
HICORE - XIV=-7/XIV-8
HLDR - XIII-5 (command)
.HLE - 1X-26
.HNE = IX-26
hyphen (-) = I1V-10
1
IF - IX-1, IX-15 (command)
1F-DO - IX-16
IF-DO-ELSE - IX-17
IF-DO-ELSE DO - IX-17
IF-DO-Null-ELSE - IXx-18
<!-- page 195 -->
IF-ELSE - IX-15
IF-ELSE DO - IX-16
IF-Null-ELSE - IX-18 .
IFSTRING/IFS - IX-21 (command)
IFSTRING-DO-ELSE - IX-23
IFSTRING-DO-ELSE DO - IX-23
IFSTRING-ELSE - IX=21
IFSTRING-ELSE DO - IX-22
IFSTRING-Null-ELSE - IX-24
IF({x) = IX-19
INCREMENT/INCR = VII-7 (command)
initial value - see value, initial
index pointer - see pointer, index
index record - see record, index
indexing routine - see routine, indexing
INPUT - X-6
integer - VI-3, VI-8, vii-1/v1l-4, VII-7,
XIVv-17
INTEGER - VI-2 (command), VI-3, VII-3,
XIV-14 (keyword)
Integer Assignment Statement - V11-2/V1I-4
(definition)
integer expression - see expression, integer
integer, key - XIII-2
integer literal - see literal, integer
integer string - see string, integer
integer variable - see variable, integer
10 - X-6
1/0, binary - XxIl-1
1/0, formatted - XI-1l (definition)
I0C - XIIl-1
J
JcL - 1-3, 111-3, 111-7
jobstream - I-1, I-3
K
KEY - XII-2
KEY - integer - x-2, X-4
key integer - seé integer, key
key, relative - XIII-3, XIII-4
L
label - I1-3, 1I1I11-3, 111-5, V-2/vV-3, VI-3,
Xiv-12
CpL
INDEX
LDATE - XIV-12 (command)
LEN - 1I-S, VII-3, VIII-3 (commanc)
letters, lower case - see lowercase
letters, upper case - See uppercase
L1 - I-1/I-2
library, copy - I-3, IV-7/IV-8
library, subroutine - I-3
linkage editor - V-2/V-3
linker library - V-1
listing, program - IV-5, IV-6
listing, source - IV-2, IV-5
XIiv=-19
LL=n - 111-2/111-4
LOAD - 111-4, XIV-6 (command)
Logical Service Routine (LSR) - X-2, X-4/
X-5, XII-1
logical unit - see unit, logical
Logical Unit Block - 1II-7
LOOP - IX-4 (command), IX-7, Ix-8
LOOP WHILE - IX-5, IX-6 (command), IX-8
lowercase - IX-26
LST - 1-2
M
MAIN - III-2/111-3, II1-6, V-2, V-4
mask - XIV=7
MAX - II-5, VII-3, VIII-4 (command)
memory - VI-1/VI-9, X1-2, XI-1%, XII-1,
XI1-3, XI1-4, XII-6, XI1I-7, XII1I=-3,
XIVv-5
MIN - I1I-%, VII-3, VIII-S (command)
minus - see negative
MOD - II-5, VI1I-3, VIII-6 (command)
MSG - 111-9
multiplication operation (\*) - II-5, VII-3
N
negative sign (=) - 11-2, VII-2, XI-4/X1-8
\*nested  IF - see complex 1F
NEWK - X-5, XI11-2
NOTE - XI-19 (command), XI-20, XI-21/X1-22
NUMBER - IX-12/1X-13
numeric string - see string, numeric
<!-- page 196 -->
0
XIv-5, XIv-6
OPEN - IX-13, X-6 (command)
ORG - XIV-9
ORICIN - X1V-9
opsYs - 11I-3, VII-6
osliB - I-3
QUTPUT - X-6
overhead data areas - see working storage
overlay - VI-2, X-8, XIv-6/XIv-8, XIV-9
P
PAGE EJECT - I1I11-2, IV-5 (command)
parameter - IX-12/1X-14, X-6
XIv-8
partition -- 1-3, I1I11-%5, Iv-3, VI-2, VII-%/
vIil-6, XI1-7/x11-8
FASS - II1-7
P.CPL (P.CPLS) - 1-1, 1V-7, V-1, XIV-8
PCINT - XI-19, XI1-2C (cemmand), XI1-21/Xx1-22
positive sign (+) - 1I-2, X1-4/XI1-B
FRINT OFF - I1I-2, 1V-4 (command)
PRINT CFF, COM - I11-2, IV-3, IV-4 (command)
PRINT ON - 111-2, 1V-3, IV-4 (command)
printer - 1-}
prograrm connection point - IXx-3
program label - see label
program line buffer - see buffer, program
line
program listing - see listing, program
Progrem Llogical Units - IIl-7, X-1, X-2
Fregram, main - I1-1, 1-3, XIVv-6
program, source - 1V-7
program, stack - IxX-11
PSCAN - 1-2
P.sCPL (P.SCTPLS) - I-1, XIv-B
PUTR - X11-6, XI111-4 (commangd)
2 (inftial) - 11-3, 11-4, VI-2, VI1-13,
?8REM -- VII-2
Quotation mark, double - Il1-%, VI1-S/VIl-6
Quotatjion mark, single - I1I1-2, 11-5%, VI- ,
VII-S5/VII- 
CPL
INDEX
R
"R  prefix - I-1
READ - IX-12, XI-2/XI-3, XI-9 (command),
read statement, formatted - XI-9
read statement, unformatted - XII- 
(command), XIII-3
RECORD - XII-2 (command), XII-4/XII-5,
XI1-3, XII-4, XII-6, XIl1-7, XIlI-1/
XIII-5, XIV-9
Record Control Block (RCB) - X-2, XIII-1
record, execution - I1II-9
relative key - see key, relative
RETRIEVE - IX-12 (command), XIV-8
RETURN - IX-10, IX-11 (command), XIV-1l4
RETURN TO - IX--10, IX-1ll (command)
Reverse sSlash () - IVv-1l1 (definition),
IX-20, IX-26
REWIND - IX-13, X-9 {command)
XI-20, XI-21 (command)
ROUND - II-5, VII-3, VIII-7 (command)
rounding - VIII-7
routine, external - V-1
routine, indexing - XIII-1
.RUN - I-3, II1I-6, XIV-7
S
S.CPL - I-1, IV-7, V-1, XIV-8
XII--6, XII-7/XII1-8, XIII-1l, XIII-5
semicolon (;) - IV-9
SET - VI-3 (command), VII-3, XI-19, XI1-2,
XIv-11
SETFORM - X-11 (command)
SEQUENTIAL (SEQ) - X-2/X-3
SDATE - XIV-12 (command)
SGN - II1-5, VII-3, VIII-8 (command)
SKIP - X-11
source listing - see listing, source
Source program - see program, Source SPACE - III-2, IV-6 (command)
spooler - I-1
S.sCpPL - 1-1, IV-7, XIV-8
stack - X1v-5
STACK -- I1I-3, III-5, 111-6
STAT - 1I11-7
STATUS - I1I1-4/111-5, vii-4, XI-9/XI-10,
XI1-4, XI1-6, X1I1-7/X11-8, X111-3,
XIII-4, XIII-5, XIV-8, XIV-14
<!-- page 197 -->
STOP - I111-7 (definition), I1I-10
XI-9, xI1-11, XI-13, XI-1l5, XII-4,
string, character - VI-1, VI-4, VI-6,
string, integer - VI-1l
STRING - VI-4 (command), VII-S5, 1Ix-12,
(keyword)
String Assignment Statement - I1I-5, VII-S
(definition)
string concatenation - VII-6
string expression - see expression, string
string literal - see literal, string
string variable - see variable, string
subfile - IV-7
SUBPGM - III-3/II1-4, IlI-6
subprogram - III-2/III-3, XIV-6
subscripted wvariable - VI-9, XIV-15 (de-
fination)
subroutine - I-1, VIII-l1, IX-1, 1IX-9,
IX-11, XIII-3, X1II-4, XIII-5, XIV-5/
XI1v-8
SUBROUTINE - IX-1, IX-10 (command)
subroutine, external - I-1, IX-10, XII-],
XII-4, XII-6, XIII-1, XIV-16, XIV-17
subroutine library - see library, subroutine
subtotal - JII1-9
sutrtraction operation (-) - II-5, VII-3
syncnyms - XIII-2
SY3cce - X-2/X=3
SYSTEM - 111-2/111-S5 (command), V-1/V-4,
vi-2, VI-3, VI-4, V-6, VI-7, VI-8,
system time - see time, system
System Logical Unit - X-1, X-2, X-8
T
XIv-17
table, cross reference - I1-2
table-name, literally subscripted - IX-4,
XI-9, XI-15, XIv-16
table, sector hold - XII-7, XIII-S
TABLE - VI-8 (command), XIll-2, XIvV-16,
xXIiv-17
TBLGET -- VI-9, XIV-1lS, XIV-16 (command)
TBLPUT - VI-9, XIV-15, XIV-17 (command)
terminator - XI-18
time, system - XIV-11
TITLE - 111-2, 1V-2 (command)
truncation - I1I11-8, VIII-7, X-9, XI-4/
X1-8, XxI-21
CPL
INDEX
u
.unconditi{onal GO TO - see GO TO, uncon-
unit, logical - IvV-7
uppercase - VI-6
.USE - I-3
\\'
variable - 11-1, 11-4 (definitiony, II-5, Vii-1l, VI1-2/VII-3, XIV-16, XIv-17
variable, {nteger - II-4 (definition), Vvi- ,
XI-9, XI-ll, XI"IJ' XI°15o XI-18/
variable length string - VI-4
variable, string - II-4 (definition), vil- , IX-14, IX-26, XI-9, XI-11l, XI-113, XI-1S, XI-18, XI1-21
variable, subscripted - see subscripted
Vertical Format Unit - III-9
VTAB - 111-9
L]
working storage area - III-2
WRITE - III-9, IX-12/Ix-13, XI-2/xI-3, XI-10, XI-11 (command), XI-17, XxI-19,
write statement, formatted - XI-)1}
write statement, unformatted - XIIl-6
(command)
(command)
XYZ
\*X" prefix - I-1
XASSM - I-3
XLINK - I-3, V-1
XLST - I-2
XREF - I-1/1-2
\*Z° prefix - 1-1}
