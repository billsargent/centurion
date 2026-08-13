# APLIB Application Library (03_APLIB)

> **Source:** CENTURION CPU-6, APLIB Application Library, July 31, 1977, includes 9/15/83 revisions. Centurion Computer Corporation. Copyright 1983.
>
> **Note:** This is an OCR-derived, light-cleaned transcription for search and
> reading. The PDF is the authoritative page-exact source; treat any ambiguity
> against the scan. Page markers appear as invisible `<!-- page n -->` comments.

---
## Contents

- [DOTUSE](#dotuse)
- [GETK](#getk)
- [NEWK](#newk)
- [NEXK](#nexk)
- [DELK](#delk)
- [?NKEY](#nkey)
- [IOERR](#ioerr)
- [STAT](#stat)
- [CGET](#cget)
- [NGET](#nget)
- [YNGET](#ynget)
- [MSG](#msg)
- [MSGN](#msgn)
- [LFEED](#lfeed)
- [CLREOL](#clreol)
- [CLREOP](#clreop)
- [GETR](#getr)
- [PUTR](#putr)
- [FRER](#frer)
- [CLREC](#clrec)
- [EDIT](#edit)
- [MVFILE](#mvfile)
- [MVREC](#mvrec)
- [UC](#uc)
- [by](#by)
- [LC](#lc)
- [BLTRUN](#bltrun)
- [STRLEN](#strlen)
- [FILL](#fill)
- [NOSIGN](#nosign)
- [GJP](#gjp)
- [PJP](#pjp)
- [PUTJP](#putjp)
- [PUPSI](#pupsi)
- [VOLNAM](#volnam)
- [GETTIB](#gettib)
- [PUTPUB](#putpub)
- [OopCoOM](#oopcoom)
- [GETCOM](#getcom)
- [PUTCOM](#putcom)
- [WAITC](#waitc)
- [ENDCOM](#endcom)

<!-- page 1 -->
CENTUR-ON
APLIB APPLICATION
July 31, 1977
Includes 9/15/83 Revisions
1780 Jay El1l1 Drive
Richardson, Texas 75881
Copyright 1983 by Centurion Computer Corporation. All rights reserved. No part of this publication may be reproduced, stored in an information retrieval System, or transmitted in any form or by any means without prior written permission by Centurion Computer Corporation.
<!-- page 2 -->
SECTION
### Introduction
File
Data
Data
Data.
Access
DOTUSE
GETK
NEWK
NEXK
DELK
GETKEY
NEWKEY
?GKEY
?NKEY
IOERR
STAT
Input/Output (Console)
CGET
?NGET
NGET
YNGET 1= Y €S &8 =AQO
MSG
MSGN
LFEED
CLREOL
CLREOP
Input/Output (File)
GETR
PUTR
HLDR
FRER
Manipultion
?EDIT
CLREC
EDIT
MVFILE
MVREC
ucC
LC
BLTRUN
STRLEN
FILL (S/RINC, \*, CHR)
NOSIGN
PAGE
Revised 9/15/83
<!-- page 3 -->
SECTION PAGE
Interjob Communication
GJP 75
PJP 78
GETJP 80
PUTJP 83
GUPSI 85
PUPSI 87
VOLNAM 89
GETTIB 91
PUTTIB 93
GETPUR 95
PUTPUB 97
XMIT/RECV - Communications Module
Overview 29
OPCOM 100
GETCOM 101
PUTCOM 103
WAITC 105
ENDCOM 107
IT
<!-- page 4 -->
APLIB REFERENCE
### INTRODUCTION
The APLIB (APplication LIBrary) is a Type E file containing the
executable form of subroutines that are useful in application
programming. APLIB subroutines are combined with the executable
form of a CPL program to produce the final program. A subroutine
must be specified as an external and then called (with a CPL CALL
statement) before the Linkage Editor adds it to the program at
the end of compilation.
Some subroutines provide entrypoints that may also be used in a
CPL program. The entrypoints are only available, however, if the
main subroutine has been referenced and called somewhere in the
program.
Each subroutine is described independently. These have been
grouped into instructional sections by function:
File Access
These subroutines enable the writing and reading of
data to and from indexed files. They differ primarily
in the size of the key or argument that can be used to
access records. Also 1included 1is a subroutine that
checks the success of an access. Some of these
subroutines, marked by the warning at p the top of the
page, are support for existing CPU 4/5 applications and
should not be wused for the development of new
applications unless these are to be compatable with the
Data Input/Output (Console)
These subroutines enable the writing and reading of
data to and from /console devices assigned to the
partition in which the program is running.
Data Input/Output (File)
These subroutines enable the writing and reading of
data to and from indexed files.
Data Manipulation
These subroutines enable the manipulation of data
within the partition in which the program is running.
Interjob Communication
These subroutines enable the writing and reading of
partition parameters so that different jobstreams and
programs may communicate.
<!-- page 5 -->
In these different sections will be found a number of subroutines
which are headed with the following warning:
WARNING!! THIS SUBROUTINE IS FOR SUPPORT
OF EXISTING APPLICATIONS. NOT FOR USE
IN NEW DEVELOPMENT!
There are also a few subroutines with specialized warnings about
their limited use in new CPU 4/5-compatable development.
The following terms are used in this reference:
file-name defined in a CPL FILE statement
format-name defined in a CPL FORMAT statement
integer - -name defined in a CPL SET or INTEGER
number numeric value, including an integer-name
Oor numeric constant
record-name defined in a CPL RECORD statement
string-name defined in a CPL DEFINE or STRING
variable-name includes string-name or integer-name
<!-- page 6 -->
\* \*
## DOTUSE
\* \*
1. General Form
Call DOTUSE (A, B, C, D)
Where
A = String containing device/file name to be
assigned or literal zero if the device/
file is to be released.
B = Disk number where the file is located or
-1 if a device is to be assigned.
C = File name where the file is to be assigned
(used for the sys number only)
D = Assignment option
) = No Shar, No Pass
1 = No Shar, Pass
2 = Shar, No Pass
3 = Shar, Pass
2, Effect
The DOTUSE subroutine will assign a file or device to a
specified program logical unit (but not a system logical
unit) for use within the CPL program. This subroutine
will also release a device or file if parameter "A" is
a literal zero.
Upon exit, status will reflect the success of the operation.
Status of @ indicates successful assignment/release.
Status of 1 indicates file/device assigned elsewhere.
Status of 2 indicates the file is not on the specified
disk.
VIi- 2a
Revised 6/15/83
<!-- page 7 -->
MANUAL -
3.
APLIB \*DOTUSE\*
### Purpose
The DOTUSE subroutine allows the CPL programmer greater
flexibility by allowing a dynamic file assignment or release
("on the fly"); this assignment or release can be based
upon an operator input or program decision.
Par ameters
A. Parameter "A" is the name of the file or device to
be assigned or released, the file name must be within
a CPL string.
Parameter "B: is the disk number (-1 for a device)
of the file to be assigned. This may be either a
four byte integer or a literal.
Parameter "C" is defined as the name on a CPL file
statement.
Parameter "D" is the assignment option and may be
either a four byte integer or a literal. The possible
values are:
= No Shar, No Pass
= No Shar, Pass
Shar, No Pass
w
N
=
=
]
= Shar, Pass
Externals and Entrypoints
An external statement in the CPL program must contain the
following:
EXTERNAL DOTUSE
The DOTUSE subroutine has no entrypoints.
Vi- 2b
Revised 6/15/83
<!-- page 8 -->
MANUAL - APLIB \*DOTUSE\*
6. Caution
A. Status must be checked after each use of DOTUSE.
Failure to do so may cause program aborts.
B. System Logical Units connot be assigned or released
with this subroutine.
Example of Use
external dotuse
-
'
;
file infile: sys@, class=2, sequential
open input file
call cget ('enter 1 for file 1, 2 for file 2',  081,option) .
if (option .eg. 1) 'filename'='fileone'
else 'filename' = 'filetwo'
call dotuse (filename, dsknum, infile,9)
éormat fegl: nBl
set dsknum:9, option:@
string filename (18)
Vi- 2c
Revised 6/15/83
<!-- page 9 -->
NOTE:
\* \*
## GETK
\* - \*
### General Form
CALL GETK (file-name, variable-name)
where
file-name specifies the file that should be
searched for a record, and
variable-name specifies the key, or search
argument,
### Effect
The GETK subroutine attempts to find an index record with
the indicated argument in the specified file.
a. STATUS reflects the success of the search:
VALUE OF
STATUS MEANING
0 Record was found
1 Record was not found
2 I/0 error occurred during access, or
argument was invalid
b. If the record is found (STATUS=0), the relative key for
the data record is stored in the key integer for the
specified file. (The key integer is associated with
the file in a CPL FILE statement). Any data
input/output operation using the file will then access
that data record.
The value of the key integer is only changed by another
GETK, NEWK, or DELK call, or by a CPL equate statement.
### Purpose
The GETK subroutine enables a CPL program to use a four-or
six-byte integer or a 7- to 35-character string to access a
data record in a Type I file.
<!-- page 10 -->
The GETK subroutine is designed to replace the GETKEY,
?GETKEY, and AGKEY subroutines.
4, Parameters
a. File-name is defined in a CPL FILE statement as a Class
2, indexed (IND) file.
b. Variable-name specifies an argument for a record that
may be 1in the specified file. The length of the
argument depends on the key length specified for the
file when it was initialized with the .NEW Job Control
Statement, as follows:
KEYLEN VARIABLE-NAME MAY BE
4 An integer-name defined as a four-byte
integer in a CPL SET or INTEGER
statement.
6 An integer-name defined as a six-byte
integer in a CPL SET or INTEGER
statement,
35 A string-name defined as a 7-35
character string in a CPL STRING
statement. The string must contain only
ASCII characters and spaces. While
stored in the index record as specified,
each string argument is left-justified
and converted to uppercase for
processing by the GETK subroutine.
Thus, the arguments of 'ABC ' and
abc' are equivalent, while the strings
'A BC' and 'AB C' are not.
The GETK subroutine rejects as invalid (STATUS=2) any
argument that does not fit these specifications.
" See the section on NEWK for an example.
5. Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
GETK
The GETK subroutine has no entrypoints.
VIi-4
<!-- page 11 -->
6.
### Cautions
a. Data I/O0 for any file which 1is accessed with the
NEWK/GETK subroutines may be performed by the
PUTR/GETR/HLDR/FRER subroutines. These subroutines
also allow CPU 5 compatability.
The CPL I/0 statements READB, WRITEB, HOLD, FREE may be
used with an indexed file.
b. If the GETK subroutine does not find a record with the
key specified, one may be (created by the NEWK
subroutine.
See also:
In this manual:
NEWK NEWKEY GETKEY ?NKEY ?GKEY
<!-- page 12 -->
NOTE:
\* \*
## NEWK
\* \*
### General Form
CALL NEWK (file-name, variable-name)
where
file-name specifies the file to which a data
record will be added, and
variable-name speci"ies the key, or argument
### Effect
The NEWK subroutine writes a record in the index area and
reserves a record 1in the data area of the specified file.
The index record contains the argument and the relative Kkey
(pointer) of the associated data record.
STATUS reflects the success of the creation attempt:
VALUE OF
STATUS MEANING
0 Index record written; data record
1 No room in file for either record
2 I/0 error occurred during access, or
argument was invalid
4 Index (chain pointer 1is invalid or
damaged
The common routines HASH and IOC are linked only once even
though more than one subroutine using them is called by
the program.
3. Purpose
The NEWK subroutine enables a CPL program to use a four- oOr
six-byte integer or a 7-35 character string as an argument
and add a data record to an indexed Type I file.
The NEWK subroutine is designed to replace the NEWKEY, ?NKEY,
and ANKEY subroutines.
<!-- page 13 -->
4'
### Parameters
a.
b.
File name 1s defined in CPL FILE statement as a Class
2, indexed (IND) file.
vVariable-name specifies the argument for the record
that is being added to the specified file. The length
of the argument depends on the key length specified
for the file when it was initialized with the .NEW
Job Control Statement, as follows:
KEYLEN VARIABLE-NAME MAY BE
4 An interger-name defined as a four-byte
integer in a CPL SET or INTEGER
statement.
6 An integer-name defined as a six-byte
integer in a CPL SET or INTEGER
statement.
7-35 A string-name defined as a 7-35
character string in a CPL STRING
statement. The string must contain only
ASCII characters and spaces. While each
string argument is right-justified and
converted to uppercase for processing by
the NEWK subroutine. Thus, the
arguments 'ABC ' and ! abc' are
equivalent, while the strings 'A BC' and
'AB C' are not.
The NEW subroutine rejects as invalid (STATUS=2) any
argument that does not fit these specifications.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
NEWK
The NEWK subroutine has no entrypoints.
### Cautions
ae. For CPU-5 compatibility any file which 1is accessed
with the NEWK/GETK subroutines should also use PUTR/
GETR/HLDR/FRER subroutines instead of READB/WRITEB/
HOLD/FREE.
vVIi-7 Revision 9/15/82
<!-- page 14 -->
The CPL I/0 statements READB, WRITEB, HOLD, and FREE
may be used with an indexed file.
If STATUS=4 at the end of the NEWK subroutine, the data
file is damaged. It should be rebuilt immediately.
The NEWK subroutine does not check for the indicated
argument in the specified file before processing the
key. Therefore, the GETK subroutine should be called
with the same parameters before NEWK is used.
For example:
FILE MASTER: SYS0,CLASS=2,IND,KEY=MSTKEY
SET MSTKEY:0
RECORD MSTREC (395)
AlO:
```
CALL CGET (MO05,F01,CUST) ; ENTER CUSTOMER NUMBER
CALL GETK (MASTER,CUST) ; ON FILE?
GO TO (A20,IOERR) ON STATUS
CALL GETR (MASTER,MSTREC) ; READ RECORD
CALL STAT(l) ; CHECK ON ACCESS
```

A20:
```
CALL NEWK (MASTER,CUST) ; CREATE NEW INDEX
GO TO (NOROOM,IOERR) ON STATUS
CALL CLREC (MSTREC) ; PREPARE FOR NEW DATA
```

A50:
```
CALL PUTR (MASTER,MSTREC). ; PUT DATA INTO FILE
CALL STAT(l) ; CHECK ON ACCESS
GO TO AlQ0 ; GO GET ANOTHER
```

SET CUST:0
```
DEFINE M0OS5:'ENTER CUSTOMER NUMBER!
FORMAT FO1l:N6
```

where
MASTER is the file-name,
<!-- page 15 -->
CusT is the argument, i.e., the name of a
four-byte integer and,
MSTKEY is the key integer for the file MASTER.
7. See also:
In this manual:
GETK NEWKEY GETKEY ?GKEY ?NKEY
VIi-9
<!-- page 16 -->
\* \*
## NEXK
\* \*
### General Form
CALL NEXK (file-name, variable-name)
where
file-name - specifies the file that should be
searched for a record;
variable-name - specifies the argument.
### Effect
The NEXK subroutine attempts to retrieve the next index record.
A. STATUS reflects the success of the search:
VALUE OF
STATUS MEANING
0 Next record was found.
1 End of index (nothing changed).
2 I1/0 error occurred during access.
B. If the next record is found (STATUS=0), the relative key for the data record is stored in the key integer for the specified file (i.e. the key integer is associated with the file in a CPL FILE statement). Any data input/ output operation using the file will then access that data record. Also, the variable-name will be set to the argument .
NOTE: The value of the key integer is only changed
by another GETK, NEWK or DELK call;: it is
also changed by a CPL "equate" statement.
### Purpose
The NEXK subroutine enables a CPL program to access the next key in the index and set the variable-n.me to the argument value.
NOTE: The keys within te index are not in sorted sequence;
neither are then in sequence of original entry.
VI-9a
<!-- page 17 -->
4.
### Parameters
A. File-name is defined in a CPL FILE statement as a Class
2, indexed (IND) file.
B. Variable-name specifies an argument for a record that may
be in the specified file. The length of the argument de-
pends on the key length specified for the file when it was
initialized with the .NEW Job Control Statement as follows:
KEYLEN VARIABLE-NAME MAY BE
4 An integer-name defined as a four-byte
integer in a CPL SET or INTEGER state-
ment .
6 An integer-name defined as a six-byte
integer in a CPL SET or INTEGER state-
ment.
7 - 35 A string-name defined as a 7-35 char-
acter string in a CPL STRING statement.
The string must contain only ASCII char-
acters and spaces. While stored in the
index record as specified, each string
argument is left-justified and converted
uppercase for processing by the GETK sub-
routine. Thus, the arguments of 'ABC'
and ''abc' are equivalent, while the
strings 'A BC' and 'AB C' are not.
Externals and Entrypoints
An external statement in CPL program must contain the follow-
ing entry:
NEXK
The NEXK subroutine has no entrypoints
### Cautions
A. Data I/O for any file which is accessed with the NEXK/
NEWK/GETK subroutines may be performed by the PUTR/GETR/
HLDR/FRER subroutines. These subroutines also allow
The CPL I/O statemets READB, WRITEB, HOLD, FREE may be
used with an indexed file.
VI-9b
<!-- page 18 -->
B. When the NEXK subroutine runs out of records, status will
be set to value of 1; neither the key or the argument will
be changed.
To sequentially process an entire file, pre-set the key
to a value of 1. The first NEXK will return the first key
and argument.
D. If the key is set to 0, the values returned by NEXK are
unpredictable.
7. See also in this manual:
NEWK NEWKEY GETKEY ?NKEY ?GKEY
VI-9c
<!-- page 19 -->
\* \*
## DELK
\* \*
1. General Form
CALL DELK (file-name, variable-name)
where
file-name specifies the file that should be
searched for a record, and
variable-name specifies the key, or search
argument.
2. Effect
The DELK subroutine attempts to  ind an index record with
the indicated argument in the specified file.
a. STATUS reflects the success of the search:
VALUE OF
STATUS MEANING
0 Record was found
l Record was not found
2 I/0 error occurred during access, or
argument was invalid
4 Index chain pointer is invalid or
damaged
b. If the index record is found (STATUS=0), the relative
key (pointer) in it 1is set to zero, releasing the
referenced data record for use with the NEWK
subroutine; the index record is also removed from the
index chain.
NOTE: The common routines HASH and IOC are linked only once even
though more than one subroutine using them is called by
the program.
3. Purpose
The DELK subroutine enables a CPL program to free a data
VIi-10
<!-- page 20 -->
record for use with another argument.
Parameters z
a.
b.
File-name is defined in a CPL FILE statement as a Class
2, indexed {(IND) file.
Variable-name may be an integer-name defined as a four-
or six-byte integer in a CPL SET or INTEGER statement,
or a string-name defined as a 7-35 character string in
a CPL STRING statement. See sections on NEWK and GETK
for detailed requirements for this parameter.
For example:
FILE MASTER: SYS0,CLASS=2,IND,KEY=MSTKEY
SET MSTKEY:O0
```
RECORD MSTREC (135)
CALL
CALL
```

CGET (M05,F01,CUST) ; ENTER CUSTOMER NUMBER
GETK (MASTER,CUST) ; ON FILE?
```
GO TO (A20,I0OERR) ON STATUS
CALL GETR (MASTER,MSTREC) ; READ RECORD
CALL STAT(l) ; CHECK ON ACCESS
```

A20:
AS0:
```
WRITE (CRT,F02) CUSNAM
WRITE (CRT,F02) M12
WRITE (CRT,F03) M13
WRITEN (CRT,F03) M14
CALL
```

GOTO
H
A60:
CALL
GOTO
CGET (NULL,F01,0PTION) ; WHAT TO DO?
(B10,A60,A10) ON OPTION
DELK (MASTER,CUST) ; GET RID OF HIM AND FREE RECORD
Al0
<!-- page 21 -->
SET CUST:0
DEFINE M0S5:'ENTER CUSTOMER NUMBER '
## DELK
```
DEFINE M12:'ENTER OPTION: 1 CHANGE FIELD ON THIS DISPLAY'
DEFINE M13:'2 DELETE THIS CUSTOMER 
DEFINE M14:'9 FINISHED WITH THIS CUSTOMER'
FORMAT F01:N6
FORMAT F02:C79
FORMAT F03:X16C50
```

where
MASTER is the file-name, and
CUST is the argument, i.e., the name
byte integer.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must
following entry:
DELK
The DELK subroutine has no entrypoints.
### Cautions
The DELK subroutine is designed to operate only
files (NEWK and GETK are used for file access).
See also:
of a four-
contain the
on indexed
FRER
<!-- page 22 -->
\* \*
\*  GETKEY \* \* S \*
WARNING!! THIS SUBROUTINE IS FOR SUPPORT
OF EXISTING APPLICATIONS. NOT FOR USE
IN NEW DEVELOPMENT! !
1. General Form
CALL GETKEY (file-name, integer-name)
where
Zile-name specifies the file that should be
searched for a record, and '
integer-name specifies the four-byte key, or
search argument
2. Effect
The GETKEY subroutine attempts to f ind an index record with
the indicated argument in the specified file.
a. STATUS reflects the success of the search:
VALUE OF
STATUS MEANING
0 Record was found
1 Record was not found
2 I/0 error occurred during access
b. If the record is found (STATUS=0), the relative key for
the data record is stored in the key integer for the
specified file. (The key integer is associated with
the file in a CPL FILE statement). Any read or write
statement using the file will then access that data
record.
If the record was not found, the key integer contains a
0 or -1.
NOTE: The value of the key integer is only changed by another
GETKEY or NEWKEY call, or by a CPL egquate statement,.
<!-- page 23 -->
3.
### Purpose
.he GETKEY subroutine enables a CPL program to use a four-
byte integer to access a data record in a Type C file.
### Parameters
a. File-name is defined in a CPL FILE statement as a Class
2, indexed (IND) file.
b. Integer-name is defined as a four-byte integer in a CPL
SET or INTEGER statement.
See the section on NEWKEY for an example.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
GETKEY
The GETKEY subroutine provides the following entrypoint:
NEWKEY
### Cautions
a. The GETKEY subroutine is designed to operate only on
Type C files that have been initialized with the system
utility XRINT.
b. If the GETKEY subroutine does not find a record with
the Kkey specified, one may be created by the NEWKEY
subroutine.
See also:
In this manual:
NEWK GETK ?NKEY ?GKEY NEWKEY
In the System Utilities Reference:
XRINT XWTAG
<!-- page 24 -->
\* \*
\* NEWKEY  \* \* z \*
WARNING!! THIS SUBROUTINE IS FOR SUPPORT
OF EXISTING APPLICATIONS. NOT FOR USE
IN NEW DEVELOPMENT!
### General Form
CALL NEWKEY (file-name, integer - -name)
where
file-name specifies the file to waich a data
record will be added, and
integer-name specifies the four-byte key, or
argument,
### Effect
The NEWKEY subroutine writes a record in the index area and
reserves a record in the data area of the specified file.
The index record contains the argument and the relative Kkey
(pointer) of the associated data record.
STATUS reflects the success of the creation attempt:
VALUE OF
STATUS MEANING
0 Index record written; data record reserved
1 No room in file for either record
2 I/0 error occurred during access
### Purpose
The NEWKEY subroutine enables a CPL program to use a four- - 
byte integer as a key and add a data record to a Type C
file.
<!-- page 25 -->
4,
NOTE:
### Parameters
a.
bl
File-name is defined in a CPL FILE statement as a Class
2, random (RND) file.
Integer-name is defined as a four-byte integer in a CPL
SET or INTEGER statement.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entries:
GETKEY
NEWKEY
The NEWKEY subroutine has no entrypo nts.
### Cautions
a. The NEWKEY subroutine is designed to operate only on
Type C files that have been initialized with the system
utility XRINT.
The NEWKEY subroutine does not check for the 1indicated
key in the specified file before processing the key.
Therefore, the GETKEY subroutine should be called with
the same parameters before NEWKEY is used.
The GETKEY subroutine must be called somewhere in the CPL
program so that the Linker Utility will add it (and the
entrypoint NEWKEY) to the program.
For example:
FILE MASTER: SYS0,CLASS=2,RND,RECSIZ=395,KEY=MSTKEY
SET MSTKEY:O0
RECORD MSTREC(395)
AlOQ:
```
CALL CGET (MO5,F01,CUST) ; ENTER CUSTOMER NUMBER
CALL GETKEY (MASTER,CUST) ; ON FILE?
GO TO (A20,I0ERR) ON STATUS
```

READB (MASTER,MSTREC) ; READ RECORD
CALL STAT(1l) ; CHECK ON ACCESS
<!-- page 26 -->
H
A20:
```
CALL NEWKEY (MASTER,CUST) ; CREATE NEW INDEX
GO TO (NOROOM,IOERR) ON STATUS °
CALL CLREC (MSTREC) ; PREPARE FOR NEW DATA
```

AS0:
WRITEB (MASTER,MSTREC) ; PUT DATA INTO FILE
```
CALL STAT(1l) ; CHECK ON ACCESS
GO TO AlQ0 ; GO GET ANOTHER
```

SET CUST:O0
```
DEFINE M05:'ENTER CUSTOMER NUMBER'
FORMAT F01l:N6
```

where
MASTER is the file-name,
CUSsT is the four-byte integer-name, and
MSTKEY is the key integer for the file MASTER.
See also:
In this manual:
GETK NEWK GETKEY ?GKEY ?NKEY
In the Systems Utilities Reference:
XRINT XWTAG
vi-17
<!-- page 27 -->
\* \*
\* ?GKEY \* \* \*
WARNING!! THIS SUBROUTINE IS FOR SUPPORT
OF EXISTING APPLICATIONS. NOT FOR USE IN
NEW DEVELOPMENT!
### General Form
CALL ?GKEY (file-name, integer-name)
where file-name specifies the file that should be
searched for a record, and
integer-name specifies the six-byte key, or search
argument.
### Effect
The ?GKEY subroutine attempts to find an index record with
the indicated argument in the specified file.
a. STATUS reflects the success of the search:
VALUE OF
STATUS MEANING
0 Record was found
1 Record was not found
2 I/0 error occurred during access
If the record is found (STATUS=0), the relative key
(pointer) for the data record 1is stored in the key
integer for the specified file. (The key integer 1is
associated with the file in a CPL FILE statement.) Any
read or write statement using the file will then access
that data record. NOTE: The value of the key integer
is only changed by another ?2GKEY (call or by a CPL
equate statement,
If the record as not found, the key integer contains a
0 or -1.
VIi-18
<!-- page 28 -->
### Purpose
The ?GKEY subroutine enables a CPL program to use a six-byte
integer to access a data record in a Type C file. B
### Parameters
a. File-name is defined in a CPL FILE statement as a Class
2, random (RND) file.
b. Integer-name is defined as a six-byte integer in a CPL
SET or INTEGER statement, i.e., the name begins with a
question mark (?).
See the section on ?NKEY for an example.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
'following entry:
?GKEY
The ?GKEY subroutine provides the following entrypoint:
?NKEY
### Cautions
a. The ?GKEY subroutine is designed to operated only on
Type C files that have been initialized with the system
utility X?RINT.
b. If the ?GKEY subroutine does not find a record with the
key specified, one may be (created by the ?NKEY
subroutine.
See also:
In this manual:
NEWK GETK ?NKEY GETKEY NEWKEY
In the System Utilities Reference:
<!-- page 29 -->
\* \*
## ?NKEY
\* \*
WARNING!! THIS SUBROUTINE IS FOR SUPPORT
OF EXISTING APPLICATIONS. NOT FOR USE
IN NEW DEVELOPMENT!
1. General Form
CALL ?NKEY (file-name, integer-name)
where
file-name spz:cifies the file that should be
searched for a record, and
integer-name specifies the six-byte key, or search
argument.
2. Effect
The ?NKEY subroutine writes a record in the index area and
reserves a record 1in the data area of the specified file.
The index record contains the argument and the relative Kkey
(pointer) of the associated data record.
STATUS reflects the success of the creation attempt:
VALUE OF
STATUS MEANING
0 Index record written; data record
1 No room in file for the index record
2 I/0 error occurred during access
3. Purpose
The ?NKEY subroutine enables a CPL program to use a six-byte
integer as a key and add a data record to a Type / file.
<!-- page 30 -->
4. Parameters
a. File-name is defined in a CPL FILE statement as a Class
2, random (RND) file. B
b. Integer-name is defined as a six-byte integer in a CPL
SET or INTEGER statement, i.e., the name begins with a
guestion mark (?).
Externals and Entrypoints
An External statement in the CPL program must contain the
following entries:
2GKEY
?NKEY
The ?NKEY subroutine has no entrypoints,
### Cautions
a. The ?NKEY is designed to operate only on Type C files
that have been initialized with the system utility
X?RINT.
b. The ?NKEY subroutine does not check for the indicated
key in the specified file before processing the key.
Therefore, the ?GKEY subroutine should be called with
the same parameters before ?NKEY is used.
NOTE: The ?GKEY subroutine must be called somewhere in the
CPL program so that the Linker Utility will add it to the
program.
For example:
FILE MASTER: SYS0,CLASS=2,RND,RECSIZ=395,KEY=MSTKEY
SET MSTKEY: 0
RECORD MSTREC(395)
AlQ
```
CALL CGEf (MO5,F01,?2CUST) ENTER CUSTOMER NUMBER
CALL ?GKEY (MASTER,?CUST) ; ON FILE?
GO TO (A20,IO0OERR) ON STATUS
```

READB (MASTER,MSTREC) ; READ RECORD
CALL STAT(l) ; CHECK ON ACCESS
o
-e
VIi-21
<!-- page 31 -->
CENTURICN DEALER SUPPORT MANUAL - APLIB
i
A20
```
CALL ?NKEY (MASTER,?CUST) ; CREATE NEW INDEX
GO TO (NOROOM,IOERR) ON STATUS
CALL CLREC (MSTREC) ; PREPARE FOR NEW DATA
```

A50
WRITEB (MASTER,MSTREC) ; PUT DATA INTO FILE
```
CALL STAT(1l) ; CHECK ON ACCESS
GO TO Al0 ; GO GET ANOTHER
```

SET ?2CUST:0
```
DEFINE MO05:'ENTER CUSTOMER NUMBER'
FORMAT F01:D6
```

## ?NKEY
where
MASTER is the file-name,
2CUST is the six-byte integer-name, and
MSTKEY is the key integer for the file MASTER.
See also:
In this reference:
NEWK GETK ?GKEY GETKEY NEWKEY
In the System Utilities Reference:
X?RINT X?WTAG
<!-- page 32 -->
\* \*
## IOERR
\* \_ \*
### General Form
GOTO (label, IOERR) ON STATUS
IF (STATUS.EQ.2)CALL IOERR
where
label is the beginning of a routine in the CPL
program that should be used when STATUS = 1.
### Effect
The IOERR entrypoint of the STAT routine terminates a CPL program with the following message if STATUS is not equal to
zero when it is referenced:
\*\*\*%x\*x T/0 ERROR SYS99 ADDRESS=aaaa STATUS=s '\*\*\*x\*x
where aaaa is one of the following:
- an unrelated address within the DOS Supervisor if
IOERR is referenced in a CPL GOTO statement
- the approximate address (within 10 bytes on an
assembled 1listing of the program) of the CPL
statement that called the IOERR entrypoint
and
S 1s the value of STATUS that caused the abort.
Completion Code is set to 100 before the program is stopped.
### Purpose
The IOERR entrypoint provides a simple method of testing STATUS and terminating a program when further processing
might damage data.
<!-- page 33 -->
4. Parameters
IOERR is used as a label in a CPL CALL, IF, IFSTRING, or
GOTO statement.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entries:
STAT
IOERR
The CPL program must contain the following statement:
ENTRYPOINT CRT
### Cautions
a. The jobstream that executes the CPL program should
include a check on the Completion Code (#C) immediately
following the J.RUN JCL statement. If #C = 100, the
program was aborted by means of IOERR and the jobstream
should also terminate immediately.
The STAT subroutine must be called at least once by the
CPL program before the Linker Utility will add it and
the IOERR entrypoint to the program.
See also:
STAT
<!-- page 34 -->
\* \*
## STAT
\* \*
### General Form
CALL STAT(n)
where
n specifies the type of status check the subroutine
should perform.
### Effect
The STAT subroutine checks the wvalue of STATUS. If
STATUS=0, control 1is returned to the calling CPL program.
If STATUS is not equal to zero, the STAT subroutine:
a. Terminates the CPL program
b. Sets the Completion Code as follows:
STATUS CC
n=1 1 100
' 2 100
3 100
n=2 1 100
2 100
3 PLU+1
n=file- 1 100
name 2 100
3 PLU+1
where PLU is the number of the Programmer Logical Unit
(SYS number) to which the file was assigned,
and
file-name specifies a disk file.
<!-- page 35 -->
c. Displays one of the following messages on the console
device assigned to the partition in which the CPL
program is running:
1. STATUS=3
\*x\*\*%x EOM ON OUTPUT SYSnn ADDRESS=aaaa STATUS=s \*\*\*\*%
\*\*\*%x\* T/0 ERROR SYSnn ADDRESS=aaaa STATUS=s \*\*\*\*x%
where nn is the number of the Programmer Logical Unit
to which the file was assigned,
aaaa is the address (on a source listing produced
by the assembler) of the statement following
the CALL STAT statement that causec the
abort, and
s is the value of STATUS that caused the abort.
### Purpose
The STAT subroutine provides a simple method of analyzing
STATUS after an I/O routine, If an error is discovered, the
subroutine displays information about that error on the
console device.
### Parameters
a. The values of 1 and 2 should be used for n following
CPL READB and WRITEB statements for Type B and C files,
as follows: '
1. n should equal 1 if a READB or if a WRITEB that
should not encounter end-of-medium (EOM) has been
executed, i.e., any non-zero STATUS should cause a
complete abort of the program.
2. n should equal 2 if a WRITEB that might encounter
EOM has been executed, i.e., if STATUS equals 3,
the file needs to expanded, but the disk is  full.
b. A file-name should be specified as the parameter
(n=file) if:
1. The file is a Type A file
<!-- page 36 -->
2. The subroutine call cannot immediately follow a
CPL WRITEB statement and EOM may have been
encountered.
See sections on ?NKEY, NEWK,
Externals and Entrypoints
An EXTERNAL statement in the
following entry:
STAT
The CPL program must contain
ENTRYPOINT CRT
The STAT subroutine provides
IOERR
### Cautions
The jobstream which executes
a check on the Completion
the .RUN JCL statement.
and NEWKEY for examples.
CPL program must contain the
the following 'statement:
the following entrypoint:
the CPL program should include
Code (#C) immediately following
a. If #C=1-99, one of the files used by the program needs
to be expanded (the value of #C indicates which file):
the disk needs to be .REORG'd or the file's FSI needs
to be made smaller.
b. If #C=100, an I/O or other error has occurred during an
I/0 operation: the Jjobstream should be terminated
immediately.
See also:
IOERR
VIi-27
<!-- page 37 -->
Gener
where
Effec
a.
b.
\* \*
## CGET
\* \*
al Form
CALL CGET (string-name, format-name, variable-name)
string-name specifies a message,
format-name specifies the type of data to be
entered, and
variable-name specifies the string or integer that
should receive the data.
t
The message is displayed on the console device assigned
to the partition in which the CPL program is running.
The subroutine adds to the message a space, a slash
(/), and:
1. At-signs (@) if a C-type format was specified
2. Number-signs (#) if a N- or D-type format was
The number of signs displayed after the slash depends
on the number of characters specified by the format,
e.g., an N6 format causes this display:
VATI222
The subroutine accepts any data entered from the
console device and sets STATUS to indicate if the data
fit the format specified, as follows:
1. STATUS=0: data c-nformed to format specified and
was moved to specified variable
<!-- page 38 -->
2. STATUS=2: data was either the wrong type, e.gq.
letters entered for numeric format, or
longer than the number of characters
specified; value of the wvariable is
### Purpose
The CGET subroutine displays a prompting message to the ope-
rator and returns properly-formatted data to the CPL pro-
gram.
### Parameters
a. String-name may be either a string of chara-ters
defined in a CPL DEFINE statement or a null scring
defined in a CPL STRING statement.
b. Format-name is defined in a CPL FORMAT statement. If
the format includes multiple fields, the CGET subrou-
tine uses only the first field specification.
c. Variable-name may be the name of a string defined in a
CPL STRING statement or the name of an integer defined
in a CPL SET or INTEGER statement.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
CGET
The following statement must be in the CPL program:
ENTRYPOINT CRT
The CGET subroutine has no entrypoints.
### Cautions
a. STATUS should be checked immediately after the subrou-
tine (call to insure that the proper data was entered
and moved to the specified variable.
<!-- page 39 -->
7.
b. The format field specification must agree with the
receiving variable, i.e., an integer variable requires
an N- or D-type format specification.
Even though a numeric format and an integer variable
are specified, the subroutine will not reject
alphabetic data. However, since the subroutine cannot
write alphabetic data into an integer, it will not
attempt to do so, leaving the value of the integer
unchanged, 1i.e., the integer contains the value it had
before the subroutine call. Of course, STATUS 1is set
to 2.
See also:
YNGET
<!-- page 40 -->
\* \*
\* ?NGET \* \* z \*
WARNING!! THIS SUBROUTINE IS FOR SUPPORT
OF EXISTING APPLICATIONS. NOT FOR USE
IN NEW DEVELOPMENT!
### General Form
CALL ?NGET (string-name, integer-name)
where
string-name specifies a message, and
integer-name specifies the six-byte integer that
should receive the input data.
### Effect
a. The message is displayed on the console device assigned
to the partition in which the CPL program is running.
b. The subroutine accepts a string of numeric characters
from the (console device and places their value in the
specified six-byte integer. Only the ASCII digits 0-9
are accepted; decimal points are ignored; all other
characters are rejected (the message is redisplayed).
### Purpose
The ?NGET subroutine displays a prompting message to the
operator and returns properly-formatted data to the CPL
program,
### Parameters
a. String-name identifies a string of (characters defined
in a CPL DEFINE statement or a null string defined in a
CPL STRING statement.
b. Integer-name is defined as a six-byte integer in a CPL
SET or INTEGER statement, i.e., the name begins with a
question mark (?).
<!-- page 41 -->
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain
following entry:
?NGET
The following statement must be in the CPL program:
ENTRYPOINT CRT
The ?NGET subroutine has no entrypoints.
### Cautions
The ?NGET subroutine is no longer considered standard.
CGET subroutine is now used to gather numeric data.
See also:
CGET
the
The
<!-- page 42 -->
\* \*
## NGET
\* - \*
WARNING!! THIS SUBROUTINE IS FOR SUPPORT
OF EXISTING APPLICATIONS. NOT FOR USE
IN NEW DEVELOPMENT!
### General Form
CALL NGET (string-name, integer-name)
where
string-name specifies a message, and
integer-name specifies the four-byte integer that
should receive the input data.
### Effect
a. The message is displayed on the console device assigned
to the partition in which the CPL program is running.
b. The subroutine accepts a string of numeric characters
from the (console device and places their value in the
specified four-byte integer. Only ASCII digits 0-9 dre
accepted; decimal points are ignored; all other
characters are rejected (the message is redisplayed).
### Purpose
The NGET subroutine displays a prompting message to\* the
operator and returns properly-formatted data to the CPL
program.
### Parameters
a. String-name identifies a string of characters defined
in a CPL DEFINE statement or a null string defined in a
CPL STRING statement.
b. Integer-name is defined as a four-byte integer in a CPL
SET or INTEGER statement.
<!-- page 43 -->
5. Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain
following entry:
NGET
The following statement must be in the CPL program:
ENTRYPOINT CRT
The NGET subroutine has no entrypoints.
### Cautions
The NGET subroutine is no longer considered standard.
CGET subroutine is now used to ga:her numeric data.
See also:
CGET
the
The
<!-- page 44 -->
\* \*
## YNGET
\* : \*
### General Form
CALL YNGET (string-name)
where
string-name specifies a message.
### Effect
a. The message is displayed on the console device assigned
to the partition in which the CPL program is running.
b. The subroutine adds a space, a slash (/), and an aste-
risk (\*) at the end of the message.
C. The subroutine accepts either an affirmative or a nega-
tive answer and sets STATUS as follows:
Affirmative: (character / (followed by NEWLINE)
character plus (+) (followed by NEWLINE)
plus bar (+)
Negative: character N (followed by NEWLINE)
character minus (-) (followed by NEWLINE)
minus bar (-) OO
O
Characters other than those specified are rejected:
the device beeps, the entered character(s) are erased,
and the asterisk 1is redisplayed with the cursor
underneath it.
### Purpose
The YNGET subroutine displays a prompting message to the
operator and returns a yes (Y) or no (N) indicator in STATUS
to the CPL program.
<!-- page 45 -->
4. Parameters
String-name is defined in a CPL DEFINE statement.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain
following entry:
YNGET
The following statement must be in the CPL program:
ENTRYPOINT CRT
The YNGET subroutine has no entrypoints.
See also:
CGET
the
<!-- page 46 -->
khkkkkkhkdxks:i s kk
\* \*
## MSG
\* \*
### General Form
CALL MSG (string-name)
where
string-name - specifies a message
### Effect
The MSG subrou\*ine causes the specified message to be displayed
on the console device assigned to the partition in which
the CPL program is running. The cursor is left at the
first position of the line below the message.
If a null string is specified as a parameter, the subroutine
will output a blank. The cursor is left at the first position
of the line below the message.
### Purpose
The MSG subroutine displays messages to guide and inform
operators without requiring input from them.
### Parameters
String-name is defined as:
a. A string of characters (a message) in a CPL DEFINE
b. A data variable in a CPL STRING statement
c. A null string in a CPL STRING statement
Externals and Entry points
An EXTERNAL statement in the CPL program must contain the
following entry:
MSG
vI-37 Revised 9/15/83
<!-- page 47 -->
The following statement must be in the CPL program:
ENTRYPOINT CRT
The MSG subroutine provides the following entrypoints:
F90
NOTE: F90 is defined in a FORMAT statement as C79.
6.
7.
### Cautions
All messages displayed via the MSG subroutine are limited to
79 characters in length by the format F90.
See also:
CGET YNGET
<!-- page 48 -->
\* \*
## MSGN
\* \*
### General Form
CALL MSGN (string-name)
string-name - specifies a message
### Effect
The MSGN subroutine causes the specified message tc be
displayed on the console device assigned to the partition
in which the CPL program is running. However, the subroutine
does not issue a cursor return/line feed command sequence
after the message is displayed; the cursor remains to the
right of the last character displayed.
If a null string is specified as a parameter, the subroutine
will output a blank. The cursor will remain to the right
of the blank that was just displayed.
### Purpose
The MSGN subroutine displays messages to guide and inform
operators without requiring input from them.
### Parameters
a. A string of characters (a message) in a CPL DEFINE
b. A data variable in a CPL STRING statement
c. A null string in a CPL STRING statement
VI-39 Revised 9/15/83
<!-- page 49 -->
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
MSGN
The following statement must be in the CPL program:
ENTRYPOINT CRT
The MSGN subroutine has no entrypoints.
### Cautions
All messages displayed via the MSGN subroutine are limited
to 79 characters in length.
See also:
CGET YNGET
<!-- page 50 -->
\* \*
## LFEED
\* - \*
### General Form
CALL LFEED (file-name, number)
where
file-name specifies an output device such as a
printer or CRT, and
npumber specifies the number of null lines to be
output.
### Effect
The LFEED subroutine causes the specified device to output
null lines, thereby advancing its output medium the number
of lines indicated. For instance, a printer will advance
the paper the number of lines, while a CRT will move the
cursor down the screen the number of lines.
### Purpose
The LFEED subroutine allows a CPL program to effect spacing
in its output with economical use of partition memory.
### Parameters
a. File-name is the name of an output device defined in a
CPL FILE statement.
b. Number may be either a numeric constant or an integer-
name defined in a CPL SET or INTEGER statement.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
LFEED
VIi-41
<!-- page 51 -->
I0TE:
7.
The LFEED subroutine has no entrypoints.
### Cautions
The LFEED subroutine uses a format named F90. This format
may be provided:
d.
b.
By the program in a CPL DEFINE statement with a C-type
field specification at least one character long.
As an entrypoint in the MSG subroutine. An EXTERNAL
statement in the CPL program must then contain the
following entries:
MSG
The MSG subroutine must be called at least once by the CPL
program before it and the F90 entrypoint are incorporated
into the program by the Linker Utility.
See also:
MSG
<!-- page 52 -->
\* \*
## CLREOL
\* \*
### General Form
Call CLREOL (H,V)
where
H is a horizontal screen position
V is a vertical screen position
### Effect
The CLREOL subroutine causes the cursor to be positioned
at the specified coordinates and clear from that position
to the end of the line. When CLREOL finishes the cursor
is returned to the specified position.
### Purpose
To clear variable data from CRT screen without disturbing
fixed data.
### Parameters
"H" and "V" may be either a positive literal value or the name of a four byte integer containing the value.
Externals and Entry Points.
An external statement in the CPL program must contain the
following entries:
External CLREOL
Entry point CRT
### Cautions
This routine may not function on some older model CRT's
(prior to Adds Regent 48)/
See also:
CLREOP
vi-42a Revised 9/15/83
<!-- page 53 -->
\* \*
## CLREOP
\* \*
### General Form
Call CLREOP (H,V)
Where
H is a horizontal screen position
V is a vertical screen position
### Effect
The CLREOP subroutine causes the cursor to be positioned
at the specified coordinates and clears from that position
to the end of the screen. When CLREOP finishes the cursor
is returned to the specified posittion.
### Purpose
To clear variable data from CRT screen without disturbing
fixed data, such as column headers or program name.
### Parameters
"H" and "V" may be either a positive literal value or the
name of a four byte integer containing the value.
Externals and Entry Points
An external statement in the CPL program must contain the
following entries:
External CLREOP
Entry point CRT
### Cautions
This routine may not function on some older model CRT's
(prior to Adds Regent 40)
See also:
CLREOL
Vi-42b Revised 9/15/83
<!-- page 54 -->
Akt hkkkkkkdhhhkkkx
\* \*
## GETR
\* \*
1. General Form
CALL GETR (file-name, record-name)
where
file-name specifies the file (containing the
data that should be read, and
record-name specifies the area within the
partition where the data should be
stored.
2. Effect
The GETR subroutine provides compatability with CPU 5
programs.
STATUS reflects the success of the operation:
VALUE OF
STATUS MEANING
0 Record read and data moved successfully
1 Record indicated by key integer was outside
file boundaries. No data transfer occurred.
2 I/0 error occurred during access; data in
record area is unspecified.
3. Purpose'
The GETR subroutine provides linkage to CPL READB
statements.
4, Parameters
a. File-name is defined in a CPL FILE statement as a Class
2, indexed (IND) or spanned (SPN) file. A record size
<!-- page 55 -->
must also be specified in the statement.
b. Record-name is defined in a CPL RECORD statement.
record may contain up to 2047 bytes.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain
following entry:
GETR
The GETR subroutine provides the following entrypoint:
PUTR
### Cautions
The
the
a. The number of bytes transferred by the GETR subroutine
is determined by the smaller of the record sizes
defined in the:
1. The CPL RECORD statement
2. The CPL FILE statement
3. The RECSIZ specified in the .NEW JCL statement.
b. The CPL HOLD and FREE statements may be wused with
file that is read by the GETR subroutine.
See also:
In this manual:
FRER
VIi-44
<!-- page 56 -->
\* \*
## PUTR
\* \*
1. General Form :
CALL PUTR (file-name, record-name)
where
file-name specifies the file into which data
should be written, and
record-name specifies the area within the
partition where the data is stored.
2. Effect
The PUTR subroutine provides compatability with CPU 5 CPL
programs. STATUS reflects the success of the operation:
VALUE OF
STATUS MEANING
0 Record written and data moved successfully
2 I/0 error occurred during access; data in
file record area is unspecified.
3 Record indicated by key integer was outside
file boundaries and file was unable to
expand. No data transfer occurred.
3. Purpose
The PUTR subroutine provides 1linkage to CPL WRITEB statements.
NOTE: The PUTR subroutine may be used to write data into a
spanned Type C file.
<!-- page 57 -->
### Parameters
a. File-name is defined in a CPL FILE statement as a Class
2, indexed or spanned file. A record size must also be
specified in the statement.
b. Record-name is defined in a CPL RECORD statement. The
record may contain up to 2047 bytes.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entries:
GETR
PUTR
The PUTR subroutine provides the following entrypoint:
PUTR
### Cautions
a. The number of bytes transferred by the PUTR subroutine
is determined by the smaller of the record sizes
defined in the:
1. The CPL RECORD statement
2. The CPL FILE statement
3. The RECSIZ specified in the .NEW JCL statement.
b. The CPL HOLD and FREE statements may be wused with a
file that is read by the PUTR subroutine.
c. PUTR will force an automatic expansion of the file if
the key indicated a record beyond file boundaries.
See also:
In this manual:
FRER
<!-- page 58 -->
In the CENTURION PROGRAMMING LANGUAGE manual:
WRITEB
## PUTR
<!-- page 59 -->
\*
\* HLDR
\*
\*
\*
\*
WARNING!! THIS SUBROUTINE IS FOR SUPPORT
OF CPU 5-COMPATABLE APPLICATIONS. NOT
FOR USE IN DEVELOPMENT OF NEW NON-CPU 5
COMPATABLE PROGRAMS!
### General Form
CALL HLDR (file-name)
whe-e
file-name specifies the file /containing the
record that must be held for
exclusive access.
### Effect
The HLDR subroutine provides compatablility with CPU 5 CPL
programs. STATUS reflects the success of the operation:
VALUE OF
STATUS MEANING
0 Sector (s) were free and are now held for the
program's partition.
1 Sector (s) were already held by another
partition.
### Purpose
The HLDR subroutine provides linkage to CPL HOLD statements.
### Parameters
File-name is defined in a CPL FILE statement as a Class
indexed or spanned file,
2,
<!-- page 60 -->
5. Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry: 3
HLDR
The HLDR subroutine provides the following entrypoint:
FRER
### Cautions
a. The HLDR subroutine may be used only with Type I
indexed files and uninitialized spanned files that are
accessed with GETR and PUTR subroutines. HLDF is
compatible with the CPL READB and WRITEB statements.
b. A HLDR executed on the same record twice without a FRER
will result in an ABORT 14 - Invalid Sector Hold/Free.
See also:
In this manual:
FRER
In the CENTURION PROGRAMMING LANGUAGE manual:
HOLD
<!-- page 61 -->
\* \*
## FRER
\* \*
WARNING!! THIS SUBROUTINE IS FOR SUPPORT
OF CPU 5-COMPATABLE APPLICATIONS. NOT
FOR USE IN DEVELOPMENT OF NEW NON-CPU 5
COMPATABLE PROGRAMS!
### General Form
CALL FRER (file-name)
where
file-name specifies the file containing the
record that should be released from
exclusive access.
### Effect
The FRER subroutine provides compatability with the CPL FREE
statements. once even though more than one subroutine using
it is called by the program.
### Purpose
The FRER subroutine provides linkage with the CPU 5 CPL
programs.
### Parameters
File-name is defined in a CPL FILE statement as a Class 2,
indexed file.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entries:
HLDR
FRER
VI-5C
<!-- page 62 -->
6' Cautions
a. The FRER subroutine may be used only with Type I
indexed files and spanned files that are acce&sed with
GETR and PUTR subroutines.
b. The HLDR subroutine must be called at least once before
the Linker Utility will add it and the FRER subroutine
to the program.
c. The FRER subroutine is also compatible with the CPL
READB and WRITEB statements.
d. A FRER of a record not held previously with a HLDR
statement will cause an ABORT 14 - Invalid Sector
Hold/Free.
See also:
In this manual:
HLDR
In the CENTURION PROGRAMMING LANGUAGE manual:
FREE
VIi-51
<!-- page 63 -->
1.
\* \*
\* ?EDIT \* \* \*
### General Form
CALL ?EDIT (integer-name, string-name-1l, string-name-2)
where
integer-name specifies the six-byte integer to be
edited,
string-name-1 specifies the string that should
receive the result of the edit, and
string-name-2 specifies the mask that should be
used by the subroutine to edit the
integer.
### Effect
The ?EDIT subroutine converts a six-byte integer to a
string, applying character editing (dollar signs, leading
zeroes, commas, etc.) as specified by a mask.
Before editing, the subroutine fills the target string with
the fill (character specified in the mask (see "Parameters"
below).
In the edit phase, the subroutine encodes the individual po-
sitions in the target string, moving from right to left,
using digits from the source integer in the indicated digit
positions; special characters assume the same relative posi-
tions they have in the mask. The encoding stops when the
last digit of the integer has been used.
After editing, the subroutine compares the number of digits
encoded from the integer with the number of significant di-
gits specified in the mask. If the actual number of digits
is less than the number specified, the remaining significant
positions are filled with zeroes.
Finally, the floating character specified in the mask 1is
encoded 1into the target string in the position to the left
of the most significant digit in the string.
<!-- page 64 -->
### Purpose
The ?EDIT subroutine enables CPL programs to output numbers
in a finished, or formatted, form.
### Parameters
d. Integer-name is defined as a six-byte integer in a CPL
SET or INTEGER statement, i.e., the name begins with a
question mark (?).
String-name-1 is defined in a CPL STRING statement.
The size of the target string is determined as follows:
Number of digit position indicators in mask
+ number of special characters in the mask
+ 1
See example below.
String-name-2 is defined in a CPL DEFINE statement.
This mask is constructed as follows:
### General Form
"Xy @EHEHEHT
where x is the pre-edit fill character,
is the post-edit floating character,
is the significance indicator, and
is the digit position indicator. =
The mask may also contain special characters, that is,
characters other than @ or #. A special character is
encoded into the target string in the position
indicated if it is surrounded by digits from the inte-
ger.
The position of the significance indicator (@) in the
mask string indicates the number of significant digits
in the integer being edited. The digit  positions to
the right of the at-sign are considered to be signifi-
cant, that is, numbers will always be written into
those positions, even if they are zeroes. The posi-
tions to the left of the indicator contain numbers only
when they are supplied by the integer; otherwise, they
are left blank.
<!-- page 65 -->
NOTE:
Fo
Special characters to the right of digit indicators should
be preceded by another at-sign, or they may not be be
edited into the target string. If a plus (+) or a minus
(=) is specified in the rightmost position of the mask,
the subroutine will substitute a space in that position if
the edited integer 1is positive, but it will use the
specified sign regardless of type if the integer is
negative.
Examples:
Date: YO0 QE#/HE/%4'
Social Security: 'O Q###-##-#%#%'
Negative money: ' (#,###, ##@%.%4Q)"'
Protected check: '"\*S,##4,4#4Q#.44%"'
r example, the mask:
DEFINE MASK:'OS###, ###C.##"'
requires a target string 11 characters long.
When the integer 123456 is edited wusing this mask, the
resulting target string is:
0 $1,234.56
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
?EDIT
The ?EDIT subroutine has no entrypoints.
### Cautions
a. The ?EDIT subroutine does not handle signs automati-
cally. The CPL program must distinguish between posi-
tive and negative numbers and provide sign indicators
in different masks.
<!-- page 66 -->
b. After the  ?2EDIT subroutine has been executed, the
target string contains the fill character followed by
the edited 1integer (see example above). If the fill
character should not be printed with the number, the
string should be referenced as follows:
string-name+l
For example:
```
CALL MSG (TARGET+1)
WRITE (PRT,F0l) TARGET+1
```

c. The ?EDIT subroutine is capable of editing six-byte in-
tegers only. Four-byte integers are edited by the EDIT
subroutine.
7. See also:
EDIT
<!-- page 67 -->
\* \*
## CLREC
\* \*
### General Form
CALL CLREC (record-name)
where
record-name specifies the data record area to be
cleared.
### Effect
The CLREC subroutine initializes the record specified, i.e.,
binary zeroes are written into every byte of the record
storage area 1in the partition in which the CPL program is
running.
### Purpose
The CLREC subroutine clears a data record area so that it is
ready to receive data and be written onto disk for the first
time.
### Parameters
Record-name is defined in a CPL RECORD statement.
See the examples in ?NKEY, NEWK, and NEWKEY.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
CLREC
### Cautions
The CLREC subroutine will initialize any record specified in
the CALL statement, including one containing valid data.
<!-- page 68 -->
1.
\* \*
## EDIT
\* - \*
### General Form
CALL EDIT (integer-name, string-name-1l, string-name-2)
where
integer - -name specifies the four-byte integer to be
edited,
string-name-1 specifies the string that should
receive the result of the edit, and
string-name-2 specifies the mask that should be
used by the subroutine to edit the
integer.
### Effect
The EDIT subroutine converts a four-byte integer to a
string, applying character editing (dollar signs, leading
zeroes, commas, etc.) as specified by a mask.
Before editing, the subroutine fills the target string with
the fill character specified in the mask (see "Parameters"
below) .
In the edit phase, the subroutine encodes the individual po-
sitions in the target string, moving from right to 1left,
using digits from the source integer in the indicated digit
positions; special characters assume the same relative posi-
tions they have in the mask. The encoding stops when the
last digit of the integer has been used.
After editing, the subroutine compares the number of digits
encoded from the integer with the number of significant di-
gits specified in the mask. If the actual number of digits
is less than the number specified, the remaining significant
positions are filled with zeroes.
Finally, the floating character specified in the mask 1is
encoded 1into the target string in the position to the left
of the most significant digit in the string.
<!-- page 69 -->
### Purpose
The EDIT subroutine enables CPL programs to output numbers
in a finished, or formatted, form.
### Parameters
a. Integer-name is defined as a four-byte integer in a CPL
SET or INTEGER statement.
String-name-1 is defined in a CPL STRING statement.
The size of the target string is determined as follows:
Number of digit position indicators in mask
+ number   special characters in the mask
+ 1
See example below.
String-name-2 is defined in a CPL DEFINE statement.
This mask is constructed as follows:
### General Form
'xy@é#dsHs'
where x is the pre-edit fill character,
is the post-edit floating character,
is the significance indicator, and
is the digit position indicator. 3
The mask may also contain special characters, that 1is,
characters other than @ or #. A special character is
encoded into the target string in the position
indicated if it is surrounded by digits from the inte-
ger.
The position of the significance indicator (@) in the
mask string indicates the number of significant digits
in the integer being edited. The digit positions to
the right of the at-sign are considered to be signifi-
cant, that is, numbers will always be written into
those positions, even 1if they are zeroes. The posi-
tions to the left of the indicator contain numbers only
when they are supplied ky the integer; otherwise, they
are left blank.
<!-- page 70 -->
NOTE: Special characters to the right of digit indicators should
be preceded by another at-sign, or they may not be be
edited into the target string. If a plus (+) or a minus
(-) is specified in the rightmost position of the mask,
the subroutine will substitute a space in that position if
the edited integer 1is positive, but it will use the
specified sign regardless of type if the 1integer |is
negative,
Examples:
Date: 'O Q##/H4/44)
Social Security: '0 Q###-##-#%44"
Negative money: ' (#,##4,#4Q%.4%@)"'
Protected check: '\*S$,##4#,##Q%4.44#'
For example, the mask:
DEFINE MASK:'OS###,###Q.#4%"
regquires a target string 11 characters long.
When the integer 123456 1s edited wusing this mask, the
resulting target string is:
0 $1,234.56
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
EDIT
The EDIT subroutine has no entrypoints.
### Cautions
a. The EDIT subroutine does not handle signs automati-
cally. The CPL program must distinguish between posi-
tive and negative numbers and provide sign indicators
in different masks.
<!-- page 71 -->
7.
b. After the EDIT subroutine has been executed, the target
string contains the  fill (character followed by the
edited integer (see example above). If the fill
character should not be printed with the number, the
string should be referenced as follows:
string-name+l
For example:
```
CALL MSG (TARGET+1)
WRITE (PRT,F01l) TARGET+1
```

c. The EDIT subroutine is capable of editing four-byte in-
tegers only. Four-byte integers are edited by the EDIT
subroutine.
See also:
?EDIT
<!-- page 72 -->
\* \*
## MVFILE
\* \*
### General Form
CALL MVFPILE (file-name-1, file-name=-2)
where
file-name-1 specifies the source file definition,
and
file-name-2 specifies the target file definition.
### Effect
The MVFILE subroutine moves the source file definition, set
by a CPL FILE statement, into the target file definition,
i.e., the file specified by file-name-2 assumes the
Programmer Logical Unit and characteristics of file-name-1l.
### Purpose
The MVFILE subroutine enables a CPL program to change files,
particularly output devices, easily on operator selection.
### Parameters
a. File-name-1 is defined in a CPL FILE statement.
b. File-name-2 is defined in a CPL FILE statement.
Externals and .Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
MVFILE
The MVFILE subroutine has no entrypoints.
VIi-61
<!-- page 73 -->
### Cautions
a.
b'
The MVFILE subroutine must be used before the file-2 is
opened.
Once the file definition has been moved, file-2 may not
be the target of the MVFILE subroutine wuntil it has
been closed.
The MVFILE subroutine will not work if -either file
specified has been defined as an indexed file (IND).
If the target area is smaller, subsequent data areas
will be destroyed.
<!-- page 74 -->
\* \*
## MVREC
\* : \*
### General Form
CALL MVREC (record-name-1, record-name-2)
where
record-name=1 specifies the source record area, and
record-name-2 specifies the target record area.
### Effect
The MVREC subroutine moves the data stored in the source
record area into the target record area. The transfer takes
place in the portion of main memory allocated to the
partition in which the CPL program is running.
EFFECT ON PROGRAM SIZE: 45 bytes
### Purpose
The MVREC subroutine enables a CPL program to move entire
data records.
### Parameters
a. Record-name-1 is defined in a CPL RECORD statement.
b. Record-name-2 is defined in a CPL RECORD statement.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
MVREC
The MVREC subroutine has no entrypoints.
<!-- page 75 -->
6. Cautions
The target record area may not be smaller (in bytes) that
the source record area; however, it may be larger.
<!-- page 76 -->
\* \*
## UC
## by
### General Form
CALL UC (string-name)
where
string - -name specifies the characters that shoula
be converted.
### Effect
The UC subroutine converts the specified string from
lowercase ASCII characters to uppercase ASCII characters.
### Purpose
The UC subroutine enables a CPL program to ensure that a
string is in uppercase.
### Parameters
String-name is defined in a CPL STRING statement.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
ucC
The UC subroutine has no entrypoints.
### Cautions
The UC subroutine 1is normally not necessary since the
operating system performs string comparisons as if all
strings were in upper case.
See also:
uc
<!-- page 77 -->
\* \*
## LC
\* \*
### General Form
CALL LC (string-name)
where
string-name is the name of a CPL string
containing the characters to be
converted.
### Effect
The LC subroutine converts the specified string from
uppercase or mixed upper/lower case ASCII characters, to
lowercase ASCII characters.
### Purpose
The LC subroutine allows CPL character strings to be
converted to lowercase, for special display effects.
### Parameters
character-string is declared in a CPL DEFINE or STRING
statement.
Externals
An EXTERNAL statement in the CPL program must contain the
following entry:
LC
The LC subroutine has no entrypoints.
<!-- page 78 -->
6. Cautions
The LC subroutine will not give predictable results if
attemped on an integer, B
7. See Also:
uc
<!-- page 79 -->
\* \*
## BLTRUN
\* \*
### General Form
CALL BLTRUN (string-name)
where
string-name is the character string to be
operated upon.
### Effect
The subroutine removes trailing blanks from a CPL character
string.
BLTRUN is a pre-requisite for accurately determining the
number of significant characters 1in the string, by the
removal of trailing blanks.
### Parameters
String-name is declared in a CPL STRING or DEFINE statement.
Externals
An EXTERNAL statement in the CPL program must contain the
following entry:
BLTRUN
The subroutine BLTRUN has no entrypoints.
See also:
STRLEN
NOSIGHN
VIi-68
<!-- page 80 -->
\* \*
## STRLEN
\* - \*
kkkdkkkkkkkkkk k&
### General Form
CALL STRLEN (string-name, integer-name)
where
string-name is the name of the CPL character
string to be evaluated and
integer-name is the name of a CPL integer to
receive the result of the evaluation.
### Effect
The STRLEN subroutine counts the number of characters in a
character string, and places that number in the integer.
### Purpose
The STRLEN subroutine may be used to determine string length
for use in the variable field specifications of the CPL
FORMAT statement.
### Parameters
string-name is declared in a CPL DEFINE or STRING statement
integer-name is declared in a CPL INTEGER or SET statement
Externals
An EXTERNAL statement in the CPL program must contain the
following entry:
STRLEN
The subroutine STRLEN has no entrypoints.
<!-- page 81 -->
### Cautions
The STRLEN subroutine considers spaces, plus-signs, and
minus-signs to be legitimate characters. To determine the
number of characters in a string, excluding trailing blanks
and/or sign characters, subroutines NOSIGN and BLTRUN should
be used before subroutine STRLEN.
See also:
BLTRUN
NOSIGN
VI-T70
<!-- page 82 -->
l.
\* \*
## FILL
\* - \*
### General Form
CALL FILL (string-name-1, number, string-name-2)
where
string-name-1 is the name of a CPL string to be
filled with a specified character,
number is either a 1litasral or a 4-byte
integer specifying the number of
characters to be placed in the target
string, and
string-name-2 is the name of a CPL string which
declares the fill character.
### Effect
The FILL subroutine places the specified number of fill
characters in the target string. '
### Purpose
The FILL subroutine may be used to clear character strings
by filling with blanks, or to move a variable number of
characters into a string for printing horizontal bar-graphs.
### Parameters
string-name-1 1is declared in a CPL DEFINE or STRING
number is either a literal or a 4-byte integer declared in a
CPL INTEGER or SET statement
string-name-2 is declared in a CPL DEFINE or STRING
Vi-71
<!-- page 83 -->
5. Externals
An EXTERNAL statement in the CPL program must contain the
following entry:
FILL
The FILL subroutine has no entrypoints.
### Cautions
If there is more than one character defined in the string-
name for the f fill character, the system will use only the
first character in the string for the fill character.
See also:
BLTRUN
STRLEN
VIi-72
<!-- page 84 -->
\* \*
## NOSIGN
\* \*
### General Form
CALL NOSIGN (string-name)
where
string-name is the name of a CPL string to be
checked for trailing sign characters.
### Effect
If the last non-blank character in the character string is
either a plus-sign (+) or minus-sign (-), the NOSIGN
subroutine replaces that trailing sign with a blank. If the
last non-blank (character in the string 1is not a sign
character, the subroutine has no effect on the string.
### Purpose
The NOSIGN subroutine is used to remove trailing signs fron
strings which may have been entered and terminated by the
use of plus-return or minus-return instead of NEWLINE.
### Parameters
string-name is declared in a CPL DEFINE or STRING statement.
Externals
An EXTERNAL statement in the CPL program must contain the
following entry:
NOSIGN
The NOSIGN subroutine has no entrypoints.
VIi-73
<!-- page 85 -->
6. Cautions
a. Since any trailing sign characters will be replaced
with a space, truncation of trailing blanks, subroutine
BLTRUN, should not be done until subroutine NOSIGN has
been run on the character string.
Subroutine NOSIGN will only check the 1last non-blank
character 1in a string for plus-sign or minus-sign. No
other sign character within the string will be
affected.
7. See Also:
BLTRUN
STRLEN
<!-- page 86 -->
l.
NOTE:
\* \*
## GJP
\* \*
WARNING!! THIS SUBROUTINE IS FOR SUPPORT
OF CPU 5-COMPATABLE APPLICATIONS. NOT
FOR USE IN DEVELOPMENT OF NEW NON-CPU 5
COMPATABLE PROGRAMS!
### General Form
CALL GJP (parameter-number, string-name)
where
parameter-number specifies a Job Control parameter,
and
string-name specifies the string that should
receive the wvalue of the specified
parameter.
### Effect
The GJP subroutine moves the value of the Job Control Para-
meter whose number is specified into the string indicated by
string-name.
### Purpose
The GJP subroutine allows communication between Jjobstreams
and CPL programs via the Job Control Parameters.
Job Control Parameters are exclusive to the partiticn
being used.
### Parameters
a. Parameter-number may be either a numeric constant or an
integer-name defined in a CPL SET or INTEGER statement.
b. 'String - name is defined as a six-character string in a
CPL STRING statement,
<!-- page 87 -->
NOTE:
NOTE:
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
GJP
The GJP subroutine has no entrypoints.
### Cautions
a. Job Control Parameters are maintained as ten-character
strings but only the first 6 will be moved. The CPL
string named in the subroutine call must be at least
six characters long.
The CPL strir3j should be -equated to one of the
following values before the GJP subroutine is called:
1. ! ' (six spaces) if the value moved into the
string will be treated as a string.
2. '000000' (six zeroes) if the value moved into the
string will be decoded into an integer before
being used.
The CPL DECODE statement may not move data from a left-
justified string (see below) to an integer properly.
The justification of the characters within the Job
Control parameter is determined by the manner in which
the value was established:
1. If the value was set by a JCL .SETA statement, the
parameter string is right-justified.
2. If the value was set by a JCL .SETC, .JOB, or
.PARM statement, the parameter string is left-
justified.
3. If the value was set when the jobstream was called
up, the parameter string is left-justified.
A parameter may be right-justified in a jobstream with the
following JCL statement:
.SETA p = #p
where p is the parameter number.
<!-- page 88 -->
7. See also:
PJP PUPSI GUPSI GETJP PUTJP -
VIi-77
<!-- page 89 -->
\* \*
## PJP
\* \*
WARNING!! THIS SUBROUTINE IS FOR USE
SUPPORT OF CPU 5-COMPATABLE
APPLICATIONS. NOT FOR USE IN NEW NON-CPU
5 COMPATABLE PROGRAMS!
### General Form
CALL PJP (number, string-name)
where
number specifies the Job Control parameter
that should receive the data, and
string-name specifies the data that should be
moved.,
### Effect
The PJP subroutine moves the value of the specified string
into the Job Control parameter indicated by number.
### Purpose
The PJP subroutine allows communication between Jjobstreams
and CPL programs via the Job Control Parameters. NOTE: The
Job Control Parameters are exclusive to the partition being
used.
### Parameters
a. Number may be an integer-name defined in a CPL SET or
INTEGER statement or a numeric constant.
b. String-name is defined as a six-character string in a
CPL STRING statement.
VIi-78
<!-- page 90 -->
Externals and Entrypoints
An EXTERNAL statement in the CPL program must comtain the
following entry:
PJP
The PJP subroutine has no entrypoints.
### Cautions
The CPL string named in the subroutine call must be at least
six characters long.
See also:
VIi-79
<!-- page 91 -->
ll
NOTE:
\* \*
\* GETJP \* \* \*
### General Form
CALL GETJP (parameter-number, string-name)
where
parameter-number specifies a Job Control parameter,
and
string-name specifies the string that should
receive the wvalue of the specified
parameter.
### Effect
The GETJP subroutine moves the value of the Job Control Pa-
rameter whose number is specified into the string indicated
by string - -name.
### Purpose
The GETJP subroutine allows communication between jobstreams
and CPL programs via the Job Control Parameters,
Job Control Parameters are exclusive to the partition
being used.
### Parameters
a. Parameter-number may be either a numeric constant or an
integer-name defined in a CPL SET or INTEGER statement.
b. String-name is defined as a ten-character string in a
CPL STRING statement.
<!-- page 92 -->
5.
NOTE:
NOTE:
Ex
An
fo
Th
Ca
a.
d.
ternals and Entrypoints
EXTERNAL statement in the CPL program must contain the
llowing entry: E
GETJP
e GETJP subroutine has no entrypoints.
utions
Job Control Parameters are maintained as ten-character
strings. Therefore, the CPL string named in the
subroutine call must be at least ten characters long.
The CPL string should be equated to one of the
following values before the GETJP subroutine is called:
1. ! ' (ten spaces) if the value moved into
the string will be treated as a string.
2. '0000000000"' (ten zeroes) if the value moved into
the string will be decoded into an integer before
being used.
The CPL DECODE statement may not move data from a left-
Justified string (see below) to an integer properly.
The justification of the characters 'within the Job
Control parameter is determined by the manner in which
the value was established:
1. If the value was set by a JCL .SETA statement, the
parameter string is right-justified.
2. If the value was set by a JCL .SETC, .JOB, or
.PARM statement, the parameter string is left-
justified.
3. If the value was set when the jobstream was called
up, the parameter string is left-justified.
A parameter may be right-justified in a jobstream with the
following JCL statement:
.SETA p = #p
where p is the parameter number.
This subroutine may not be used on CPU 5-compatable
VIi-81
<!-- page 93 -->
programs if it 1s to be expected to access right-
justified strings.
7. See also:
PJP PUPSI GUPSI PUTJP GJPp
<!-- page 94 -->
\* \*
## PUTJP
\* ( \*
### General Form
CALL PUTJP (number, string-name)
where
number specifies the Job Control  pararmeter
that should receive the data, and
string-name specifies the data that should be
moved.
### Effect
The PUTJP subroutine moves the value of the specified string
into the Job Control parameter indicated by number.
### Purpose
The PUTJP subroutine allows communication between jobstreams
and CPL programs via the Job Control Parameters. NOTE: The
Job Control Parameters are exclusive to the partition being
used.
### Parameters
a. Number may be an integer-name defined in a CPL SET or
INTEGER statement or a numeric constant.
b. String-name is defined as a ten-character string in a
"CPL STRING statement.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
PUTJP
The PUTJP subroutine has no entrypoints.
<!-- page 95 -->
6. Cautions
Job Control Parameters are maintained as ten-character
strings. Therefore, the CPL string named in the subroutine
call must be at least ten characters long.
7. See also:
<!-- page 96 -->
\* \*
\* GUPSI \* \* : \*
### General Form
CALL GUPSI (integer-name)
where
integer-name specifies the integer that should
receive the value of UPSI.
### Effect
The GUPSI subroutine moves the value of the User Pro-
grammable Switch 1Indicator (UPSI) into the specified inte-
ger.
### Purpose
The GUPSI subroutine allows communication between jobstreams
and CPL programs via UPSI. NOTE: The value of UPSI is ex-
clusive to the partition being used.
### Parameters
Integer-name is defined as a four-byte integer in a CPL SET
or INTEGER statement.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
GUPSI
The GUPSI subroutine has no entrypoints.
### Cautions
UPSI is an one-byte integer and therefore cannot contain
values greater than 255 or less than 0.
<!-- page 97 -->
7.
See also:
\* GUPSI
PUTJP
\*
<!-- page 98 -->
NOTE:
\* \*
## PUPSI
\* 3 \*
### General Form
CALL PUPSI (number)
where
number specifies the data that should be
moved.
### Effect
The PUPSI subroutine moves the value of number into the User
Programmable Switch Indicator (UPSI).
### Purpose
The PUPSI subroutine allows communication between jobstreams
anad CPL programs via UPSI.
The value of UPSI is exclusive to the partition being
used.
### Parameters
Number may be either an integer-name defined in a CPL SET or
INTEGER statement or a numeric constant.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
PUPSI
The PUPSI subroutine has no entrypoints.
### Cautions
UPSI is an seven-bit integer and therefore cannot contain
values greater than 255 or less than 0.
<!-- page 99 -->
7. See also:
GETJP
\* PUPSI
PUTJP
\*
<!-- page 100 -->
\* \*
## VOLNAM
\* : \*
### General Form
CALL VOLNAM (file-name, string-name)
where
file-name specifies the file for which the disk
volume name is required, and
string-name is the string-name that 1is to receive
the volume name.
### Effect
This subroutine obtains the volume name of the disk where
the file specified 1is located, and puts it in a character
string.
### Purpose
This subroutine is useful in such applications as report
generators as a method of naming the disk that files are
located on.
### Parameters
a. File-name is defined in a CPL FILE statement.
b. String-name is defined in a CPL STRING or DEFINE
statement.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
VOLNAM
The VOLNAM subroutine has no entrypoints.
<!-- page 101 -->
6. Cautions
a. The resultant string must be at least ten characters in length.
b. The volume name will be left-justified and space-filled
to ten characters.
VI-S0
<!-- page 102 -->
1.
\* \*
## GETTIB
\* - \*
### General Form
CALL GETTIB (length,offset,result)
where
length is the number of bytes to obtain from the
Task Information Block (TIB),
offset is the number of bytes from the beginning of
the TIB to where the requested data is stored
in the TIB, and
result is the location where the data is to be
stored, depending on what information is
requested.
### Effect
The GETTIB subroutine locates and moves data from the Task
Information Block (TIB) for the executing partition, and
stores the data for recall.
### Purpose
The GETTIB subroutine is used to get and store current
partition parameters; such as UPSI, default disk of the
partition, highest memory address in the partition, etc.
### Parameters
Both length and offset may be literals or the names of 4-
byte integers.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
GETTIB
<!-- page 103 -->
The GETTIB subroutine has no entrypoints.
### Cautions
Some portions of the TIB are protected. If an attempt is
made to get these portions of the TIB, an ABORT 21 - ILLEGAL
SYSTEM BLOCK ACCESS ATTEMPTED will be generated.
See also:
PUTTIB
<!-- page 104 -->
\* \*
\*  PUTTIB  \* \* \*
### General Form
CALL PUTTIB (length,offset,result)
where
length is the number of bytes to be put in the Task
Information Block (TIB),
offset is the number of bytes from the beginning of
the TIB to where the requested data is to be
stored in the TIB, and
result is the location where the data was stored,
depending on what information is reguested.
### Effect
The PUTTIB subroutine locates and moves data to the Task Information Block (TIB) for the executing partition, from where the data was stored. :
### Purpose
The PUTTIB subroutine is wused to modify information on current partition parameters in the TIB.
### Parameters
Both length and offset may be literals or the names of 4- byte integers.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the following entry:
PUTTIB
The PUTTIB statement has no entrypoints.
<!-- page 105 -->
### Cautions
a. Some portions of the TIB are protected. 1If an attempt
is made to store into these portions of the TIB, an ABORT 21 - ILLEGAL SYSTEM BLOCK ACCESS ATTEMPTED will
be generated.
b. Although some TIB values may be accessed with GETTIB, these may be protected from modification. If
modification is attempted, the result will be an ABORT
21.
See also:
GETTIB
<!-- page 106 -->
1.
\* \*
\*  GETPUB \* \* 2 %\*
### General Form
CALL GETPUB (file,length,offset,result)
where
file is the file with which the Physical Unit
Block (PUB) is associated,
length is the number of bytes containing requested
data from the PUB,
offset is the number of bytes from the beginning of
the PUB to where the requested data is stored
in the PUB, and
result is the location where the data 1is to be
stored, depending on what information is
requested.
### Effect
The GETPUB subroutine locates and moves data from the
Physical Unit Block (PUB) for the indicated file, and stores
the data for recall.
### Purpose
The GETPUB subroutine is used to locate and store
information on the physical units associated with a file.
### Parameters
Both length and offset may be literals or the names of 4-
byte integers.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
GETPUB
<!-- page 107 -->
The GETPUB subroutine has no entrypoints.
### Cautions
Some portions of the PUB are protected. If an attempt is
made to get these portions of the PUB, an ABORT 21 - ILLEGAL
SYSTEM BLOCK ACCESS ATTEMPTED will be generated.
See also:
PUTPUB
<!-- page 108 -->
1.
\* \*
## PUTPUB
\* \*
### General Form
CALL PUTPUB (File,length,offset,result)
where
file is the file to which the devices are
assigned,
length is the number of bytes to be put in the
Physical Unit Block (PUB),
of fset is the number of bytes from the beginning of
the PUB to where the requested data is to be
stored in the PUB, and
result is the location where the data was stored,
depending on what information was requested.
### Effect
The PUTPUB subroutine locates and moves data to the Physical
Unit Block (PUB) on the devices assigned to the file, from
where the data was stored.
### Purpose
The PUTPUB subroutine is used to recall and put information
on physical units assigned to the file, into the PUB.
### Parameters
Both length and offset may be literals or the names of 4 -
byte integers.
Externals and Entrypoints
An EXTERNAL statement in the CPL program must contain the
following entry:
PUTPUB
VIi-97
<!-- page 109 -->
The PUTPUB subroutine has no entrypoints.
### Cautions
a. Some portions of the PUB are protected. 1If an attempt
is made to store into these portions of the PUB, an
ABORT 21 -- ILLEGAL SYSTEM BLOCK ACCESS ATTEMPTED will
be generated.
b. Although some PUB values may be accessed by a GETPUB,
these may be protected from modification. If these are
accessed, an ABORT 21 will occur.
See also:
GETP'B
<!-- page 110 -->
Communications Module
APLIB Application
March 15, 1983
<!-- page 111 -->
COMMUNICATIONS MODULE
### OVERVIEW
The communications modules are independent modules which act as communications buffers; they also manage transmission/reception. A protocol, should the user decide to use one, must be defined and controlled by the utility or application program utilizing the communications modules. There is a set of CPL-compatible re-entrant subroutines (communications interface modules) implemented that perform the data buffering. The maximum transmission record size is 400 bytes.
Thus, by utilizing the communications modules, any application can perform data transmission and reception with any protocol desired. However, if the application is to interface with the XMIT/RECV utilities, it must honor the protocol.
The P.APLIB6 subroutines and their "call" formats are described independently on the following pages.
<!-- page 112 -->
1.
\* \*
## OopCoOM
\* \*
### General Form
CALL OPCOM (file, sta)
where
file - name (address) of the RCB or CPL FILE state-
ment assigned to the asynchronous communications
port;
sta - name (address) of a four-byte integer to re- ceive the open status when complete. Upon re- turn, it contains one of the following values:
0 - open successful;
16 - file is of incorrect type for communications;
17 - illegal open;
18 - no memory available. There is not enough par- tition memory available to generate another buffer. The partition is at or close to the 32K maximum.
### Effect
No actual data transmission or reception is performed. How- ever, once completed, transmission or receptions can begin im- mediately and reception will begin if necessary.
### Purpose
The OPCOM routine initializes buffers and parameters for a particular asynchronous port.
VI-100
<!-- page 113 -->
1. General Form
d dk dekdkokok ok ok kdkdkhk
\* \*
## GETCOM
\* \*
ddekdkd dekkokkdkkkkk
CALL GETCOM (file, rec, com, sta)
where
file -
rec -
com -
sta -
name (address) of th- RCB or CPL FILE state-
ment ;
name (address) of the CPL record area to re-
ceive the data. The first two bytes of the re-
cord should contain the record length;
name (address) of a four-byte integer to re-
ceive the communications flag. The communica-
tions flag is a four-bit value (0-15) that is
transmitted/received as as the uppermost four
bits of the transmission length. This value is
ignored by the communications modules and its
use, if any, is determined by the program or
programs involved. For example, typical uses
would be for protocol commands (as with XMIT/
/RECV). This value is also used by WAITC to
acknowledge a successful transmission of a re-
cord to the transmission file; it is - usually
set to zero. If it is set to -1, then no acknow-
ledgement will be transmitted.
name (address) of a four-byte integer that will
contain the status of the communications "read".
It will contain one of the following values:
negative - reception not yet completed:
8 - port is not open or is of the wrong
type;
22 - port is busy.
VI-101
<!-- page 114 -->
2. Effect
It returns immediately to the program whether a record is
available in the receive buffer or not. It is the program's
responsibility to monitor the "sta" for completion of the "read" and to use the WAITC routine to allow completion.
3. Purpose
The GETCOM routine performs a "read" of the communicatons port.
4. See also:
WAITC
VI-102
<!-- page 115 -->
\* \*
## PUTCOM
\* \*
1. General
CALL PUTCOM (file, rec, com, sta)
where
file - name (address) of the RCB or CPL FILE state-
ment ;
rec - name (address) of the CPL record area to re-
ceive the data. The first two bytes of the
record should contain the record length;
com - name (address) of a four-byte integer to re-
ceive the communications flag. The communica-
flag is a four-bit value (0-15) that is trans-
mitted/received as the uppermost four bits of
the transmission length. This value is ignored
by the communications module and its use, if
any, is determined by the program or programs
involved. For example, typical uses would be
for protocol commands (as with XMIT/RECV). This
value is also used by WAITC to acknowledge a
successful transmission file; it is usually sét
zero (0). 1If it is set to -1, then no acknow-
ledgement will be transmitted.
sta - name (address) of a four-byte integer that will
contain the status of the communications "read".
It will contain one of the following values:
Negative - transmission not complete;
0 - transmission not complete;
5 - line not opened:;
6 - no response;
7 - output time out;
8 - line not opened;
22 - line busy.
VI-103
<!-- page 116 -->
2. Effect
The "call" parameters have the same meanings as with the GETCOM routine. Upon return, "sta" is set to the value of the third byte in ACK and will contain one of the values listed under "sta'.
### Purpose
The PUTCOM routine performs a "write" to the communications
port and then reads a three-byte ACK back unless EOM is set to -1.
VI-104
<!-- page 117 -->
1.
\* \*
## WAITC
\* \*
### General Form
CALL WAITC
where
sta - contains the following values:
-1 - reception is not complete:
O - reception completed with no errors:
5 - device (line) not opened or assigned;
6 - time out;
19 - protocol error;
20 - check sum error;
23 - port is inactive.
### Effect
The WAITC automatically returns if none of the input requests
have been completed. This allows the programmer to use only
-one input buffer for multiple input ports. It also provides
the minimum turnaround time for receiving the next record
which may be on its way. There are no "call" arguments. It
is the responsibility of the program to check the various
"sta" variables to determine which, if any, GETCOM requests
have been completed.
### Purpose
The WAITC routine is used to complete any outstanding GETCOM
requests. Its use is required and it should be used fre-
quently if reception is occurring on multiple ports.
See also:
GETCOM
VI-105
<!-- page 118 -->
\* \*
## ENDCOM
\* \*
### General Form
CALL ENDCOM (file, sta, op)
where
file - name (address) of the RCB or CPL FILEEstate- - 
ment ;
sta - name (address) of a four-byte integer to re- ceive the ENDCOM status. Upon return, it will contain one of the following values:
O - ENDCOM successful;
8 - port not opened or of the wrong type;
22 - line busy or active;
Op - a literal zero/nonzero option flag. 1If
zero, the asynchronous port is to remain
assigned. If non-zero, it is to be released.
NOTE: An ENDCOM status of 22 indicates that data is still awaiting reception and any cutstanding GETCOM calls calls must be completed before closing of the port. This condition should clear once the WAITC call had completed.
### Effect
No actual data transmission or reception is performed. Op- tionally, the ENDCOM also releases (unassigns) the asychro- nous port.
'Purpose
The ENDCOM routine is used to close the communications port. This basically entails releasing buffers and other communi- cations module resources so that the resources can be used by other future OPCOM "calls".
See also:
GETCOM
WAITC
VI-107
