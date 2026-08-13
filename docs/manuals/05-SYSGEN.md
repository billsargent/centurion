# SYSGEN System Generation Utility (05_SYSGEN)

> **Source:** CENTURION CPU-6 SYSGEN Utility, OS 7.1C release, 1984. Centurion Computer Corporation.
>
> **Note:** This is an OCR-derived, light-cleaned transcription for search and
> reading. The PDF is the authoritative page-exact source; treat any ambiguity
> against the scan. Page markers appear as invisible `<!-- page n -->` comments.

---

<!-- page 1 -->
wente (2 OSSP po. LTERMT Release 8403 - I'arch, 1984
l. €sys DoS 7.1C Release Date 2/13/84
8LOAD Release Date 2/10/84
S Release Date 2/01/84
P Release Date 2/10/84
VT Release Date 12/1/83
? Release Date 1/11/84
The operating system has been modified for more and better use of transient
memory through the use of shared files. A problem with the clock being
slow has been resolved, and problems with auxiliary (remote) printers have
been resolved.
WARNING
This is a major enhancement of the operating system which required changes
in many of the supporting modules. As a result, it is not carpatible with
previous releases of the S, P, CVT and ? libraries, nor zre the 7,0D and
earlier versions compatible with the new release of these libraries. Conse-
quently you must retain the previous versions until all customers are upgraded
to the 7.1C system.
To assure that you have both versions, the previous versions are included
in this release with "xxxx70" added to distinguish them from the current
ones.
2, SYSGEN
A new system generation utility (XS@MAIN), which is invoked by the SYSGEN
jobstream in the P library, has been written which is easier and more
efficient to use. In order to use the 7.1C release, the new utility
must be used., All existing configurations must be regenned before imple-
menting the new opsys.
Note: See SYSGEN documentation for instructions on installation of
the 7.1C operating system. The release pack includes skeleton
configerations (1 partition, 1 CRT, 1 printer, disk drive) for
Hawk (@OSNHAWK) and CMD (@OSNCMD) installations.
<!-- page 2 -->
SYSGEN UTILITY INSTALLATION FPrilRiiIRES
iser lanual Saction 1
Effective with release of the 7.1 operating system, systems FIST be configured
sith the now utility P.SYSGEIN. Configurations generated with P.OSCON will not
work. Also, P.OSOON LSt continue to be used for operating systems prior to
7.1'
It is suggested that before installation the installer should become thoroughly
familiar with the new utility.
These procedures are necessary only on the first implementation of the new system.
Installation of all future releases will simply be a copy of the €SYS and @LOAD
files and reboot.
It is also suggested that the old system disk be backed up prior to installation.
Specific procedures suggested are:
1. Mount the transmittal pack (or other pack containing the new system) on
disk unit zero.
2. Boot system in usual way with old operating system.
3. Configure your system into a new file on the transmittal pack with P.SYSGEN.
4. Set R/F switch to out position.
5. Depress SELECT button. If a "D=" PROM is installed, answer BO (0O for
QD system).
6. After the message, LOS 7.nn  -  c, respond to the NAME= prompt with the name
of the file from step 3, to the DISK= prompt with the disk on which that
file resides, and the QUDE= prompt with KEJLIHE.
7. After the message, DOS 7.1 - n, set the system disk to @ and respond to
subsequent prompts as usual.
8. Copy €SYS, €1L0AD, S and any other system files to your usual system disk.
9. Delete E€QSN the copy the new configuration into a new @OSN on the system
disk.
186. Set R/F switch to in position and reboot in usual way.
1.1-1
<!-- page 3 -->
Ucer Manual Section 1
The ZSZ!AIN system utility provides the user with a safe and simple method of
gznerating and maintaining custam operating system configurations for the Centurion
VI. Used in conjunction with the generation/loading procedures, generating
cperating systems becomes relatively easy. The system generation utility allows
users with little technical expertise to generate confiqurations with confidence,
yet is versatile enough for the most sophisticated uses. Most parameters are
generated automatically from the code for the particular device configured.
System checks prohibit entry of invalid parameters. A summary of the entire
configuration and detail of each component is easily displayed.
IDIE: The utility is written to use the function keys on the Viewpoint 68
to control many of the operational features. If a configquration is
generated from a console without this capability, Control-B, the corres-
ponding number, and KEWLINE produces the same results. See Section
III for a listing of these functions.
thkkkkk
CaXCEPT
Akkkkhk
The concept of this utility is to display the attributes of each component of
the confiquration on one of seven screens. Independent attributes - those which
reflect a change in the configuration - are entered or edited by moving the
cursor to the field for that attribute, then entering the new value or code.
Dependent attributes - those which are dependent upon an independent attribute
- include both default values which may be changed and absolute values which
may not be changed. Fields for absolute dependent attributes are field protected;
the cursor may not be moved to these fields.
The cursor may be moved by using the right, left, up and down arrows. Also,
the tab key will move the cursor to the first position in the next unprotected
field. Shift-tab (Viewpoint 60) will move the cursor back to the first position
of the preceding unprotected field.
An attempt to move the cursor forward out of an independent attribute field
with the arrow or tab keys, without entering a value or code, will generate
an error message. An improper code will also generate an error message.
Function keys (see Section III) are used to exit a screen, to move to a different
section of multi-section screens, and to delete entries.
' CThL- A
Brek ) BS rom b -1 Dot ,M)%LF TH3 C,TYL\\;
Conwtes Cre-C Bk b E9)
- CTRLEE
S
<!-- page 4 -->
LrsIIN UTILITY INSTALLATION PROCEDURES Jzer Manual
Section I
At least one partition, one disk drive and one console must be configured. N error message will display if the END OF FROGRAM option is selected without this minimum configuration.
32cause procedures are essentially the same far creating and editing a configuration, 1 single section covers this process.
1.1-3
<!-- page 5 -->
Jser Manual Section II1
JPERATION
1. The utility is called by entering:
P.SYSGEN
The CRT displays:
EJER OLFIGIRATION LIBRARY FAME (R "REILIRE" FOR RO LIBRARY
Enter:
library containing the desired configuration table
if configuration table is a discrete file.
The CRT displays:
Enter:
fncoe The C-type filename which will contain the configuration
data set §O.5/L)
The CRT displays:
Enter: g
d the disk unit number for the configuration set file
If the file exists but is not a 'C' type file, an error message will display
and the utility will terminate. The CRT may display: (if not, go to Step
6)
FILE fnz - e ROT FOUND ON DISKd
DO YOU KART TO CREATE THIS FILE? (Y/N)
2.1-1
-3
<!-- page 6 -->
User HKanual Section 11
Enter one of the following:
Y to initialize frame on disk d. Go to step 6.
N to return to step 2. -
6. The CRT will display the Main Menu (Figure 1) if the configuration exists.
Select the desired option from this menu. If the configuration is being
initialized, the System Constants screen will be displayed. Go to step 7.
SYSTEM CQNSTANTS khkkkkkkhkkhkkkik
7. The SYSTEM CONSTATYS screen (Figure 2) displays with the current values
for system disk, time out value, power line freguency, sector holds per
partition, and multiple processors. If the configuration is being initialized,
the default values for these parameters are shown.
These values may be edited by positioning the cursor to the field and entering
new values. "
The screen also shows the number of devices configured. If the configuration
is being initialized, these will all be zero.
When the system constants have been set as desired, depress the F4 function
key. The utility will return to the main menu (step 6! or to the PARTITIONS
screen (step 8) if the configuration is being initialized.
PARTITICNS
8. The PARTITIONS screen (Figure 3) displays the partition number, priority,
disk defaults, number of job parameters, and maximum number of logical
wmits for each partition.
To add a partition, move the cursor to the first blank line, enter the
partition number, then HEEWLIKE. Default values for the partition will
be entered by the utility.
To delete a partition, position the cursor on the line for that partition,
then depress the PS5 function key. The partition is deleted and the message
\*s24+ DFELETED  \*\*\*" will appear on the line.
2.1-2
-l
<!-- page 7 -->
SGEN UTILITY
er Manual
Section II1
To edit a partition, position the cursor to the field and enter the new
value.
partitions may be entered in any seguence although normally they will be
entered sequentially. They will be sorted into numerical sequence by the
utility.
When partition values have been set as desired, depress the F4 function
key. The utility will return to the main menu (step 6) or to the HIX DEVICES
SCREEN (Step 9) if the configuration is being initialized.
UX DEVICES
EkkkR Rk kkkk
;. The KUX DEVICES or IOLTIPLEXOR screen (Figure 4) displays the device type,
description, name, address, and MCB for the device. Security code, ISR
number and buffer length may be shown if applicable for the device and
if used. Type, description and name for any auxiliary printers are also
shown.
;
To add a device, enter the applicable code from Section I1I, then REWLINE.
Devices should be added in the sequence by which they will be plugged into
the mux boards.
To delete a partition, position the cursor on the line for that device,
then depress the F5 function key. The device is deleted and the message,
wassx DFLETED \*\*\*\*" will appear on the line.
'To edit a device, position the cursor to the field and enter the new value.
When the mux devices values have been set as desired, depress the P4 function
key. The utility will return to the main menu (step 6) or to the DISK
LRIVES screen (step 19) if the configuration is being initialized.
2.1-3
<!-- page 8 -->
papu - 
ooty L SR B2 S AP VIR ) A R  
", xr Yrnual Soction I
 - 
Aikkkkbhhkk ik
DISK DRIVES
1 . The DISK DRIVES screen (figure 5) displays ihe disk type, descripiion,
nane, address and code of each disk diive.
To add a disk, enter the disk code (sce Section III). Default values for
the disk will be entered by the utility.
To delete a disk, position the cursor on the line for that disk, then é=press
the PS5 function key. The cursor must be position=d on the line containing
the disk type. (Additional lines, without the disk type, will be created
for all disk drives involving multiple platters.) The disk is deleted
and the message "\*\*\*\* DELETED #4%%" yil]l appear on all lines related
to that drive.
To edit a disk, position the cursor to the field and enter the now value.
Disks may be entered in any sequence. When they are sorted znd displayed,
they will be displayed in ADDRESS sequence, which normally will not be
in disk number sequence. '
When the disk values have been set as desired, depress the F4 function
key. The utility will return to the main menu (step 6).
PRINTERS/SPOOLERS
11. The PHIKTERS/SPOCLERS screen must be entered from the main menu. The screen
displays the printer type, description, name and address for parallel printers
only. Mux-driven printers are displayed on the IIX DVICES screen. The
screen displays the spooler name, disk and spool file name for spoolers.
To add a printer, enter the printer type code (see Section I). The default
values for the printer will be entered by the vtility.
To delete a printer, position the cursor on the line for that printer,
then depress the F5 function key. The printer is deleted and the message
maxts+ DELETED %\*\*\*" yill appear on the line.
To edit a printer, position the cursor to the field and enter the new value.
2.1-4
<!-- page 9 -->
User Manual
Saction 1I
To move to the spooler section of the screen, depress the F1 function key.
To add a spooler, enter any non-blank character and FZZZLIIE Default values
of the spooler will be entered by the utility.
To delete a spooler, position the cursor on the line for that spooler and
depress the F5 function key. The spooler is deleted and the message ihakaded
DELETED #\*\*\*\*' will appear on the line.
To edit a spooler, position the cursor to the field and enter the new value.
To return to the printer section of the screen, depress the Fl function
key.
When the printer and spooler values have been set as desired, depress the
F4 function key. The utility will return to the main menu (step 6).
TAPE/BISYNC/SPECIAL
12. The TAPE/BISYNC/SPECIAL UNITS screen displays the tape type, description,
name and address for tape units; the BISYNC type and name for BISYNC units;
and the name, address, select code, driver name, initialization routine
name and pub size for special units. This screen can be entered only from
the main menu.
To add a tape unit, enter the tape type code (see Section I1). Default
values for the tape unit will be entered by the utility.
To delete a tape unit, position the cursor on the line for that unit, then
depress the F5 function key. The tape unit is deleted and the message
raas  DELETED #\*\*\*\*" will appear on the lire.
To edit a tape unit, position the cursor to the field and enter the new
value.
To move to another section of the screen, depress the F1 function key once
to move to the BISYNC unit, enter  B  for BISYNC type, then EEALINE. The
default name will be entered by the utility.
To delete a BISYNC unit, position the cursor on the line for the unit,
then depress the F5 function key. The unit is deleted and the message,
"t+:% DFLETED \*\*\*\*" will appear on the line.
2.1-5
<!-- page 10 -->
SGEN UTILITY
;r Manual
Soction 11
To edit the BISYNC unit, position the cursor to the name field and enter
the desired name. Only the name may be edited. There may be only one
BISYNC wunit on a system.
To move to another section of the screen, depress the P1 function key once
to move to the special units section and twice to move to the tape units
section.
To add a special unit, enter any non-blank character for the name, then
LELINE. Default values for the special unit are entered by the utility.
A driver name must be entered.
To delete a special unit, position the cursor on the line for that unit,
then depress the F5 function key. The unit is deleted and the message
soasd DELETED \*\*\*\*" will appear on the screen.
To edit a special unit, position the cursor to the field and enter the
new value.
To move tO a different section of the screen, Gepress the F1 function key
once to move to the tape section and twice to move to the BISYNC section.
When values have been set as desired, depress the P4 function key. The
utility will return to the main menu (step 6). '
SAIUTATICN MESSAGES
13. The SALUTATION HMESSAGES screen may be entered only from the main menu.
This screen displays the salutation messages. Up to fifteen lines of messages
my be entered, but no intervening blank lines are permitted. If MmO salutation
messages have been composed, the screen will be blank except for the screen
heading itself.
To add, edit or delete messages, enter/edit the desired text on the screen.
When the messages have been set as desired, depress the F4 function key.
The utility will return to the main menu (step 6).
MOTE: Although blank lines may not be entered in the create mode, they
may be established in the edit mode by blanking the characters
in a previously entered line.
2.1-6
<!-- page 11 -->
):-GEN UTILITY INITIALIZATIC: 22D EDITING
User Manual Section 11
tARE AR ARk Rk R kAL
14. Selection of the EiD GF FrOGRAM option (option 9) from the menu will cause
15.
16.
17.
the configquration to be written out to the file. The configuration will
only be written out if it is valid. If the utility is exited with @G,
the configuration will be unchanged. An error message will display if
the configuration does not include at least one partition, one disk drive,
and one console.
The CRT displays:
IDYWWALISI'HB(I"IBE(INPIGURATICNFHE? (Y/N)
Enter:
Y If you want a listing of the configuration. Go to Step
16.
ROTE: If you only want a listing of an existing configuration,
you may enter P.SYSGEN PRINT when invoking the utility.
The utility will then go directly from Step 4 to Step 16,
bypassing the configuration steps.
N If you do not want a listing.
The CRT displays:
ESTER FRILT DEVICE KaME
Enter the full name (PRTn) of the print device. The listing is printed
on the device specified.
The CRT finally displays:
.USE CRIn FOR SYSDR
2.1-7
<!-- page 12 -->
SYSGEN UTILITY FUNCTION KEYS & DEVICE CODES
Jser Manual Section 1I1
FUNCTION KEYS KD DzVICE QODES
FUNCTION KEYS
Fl1 Causes the cursor to advance to the next section of a multi-section
screen, or to the next page if a sCreen overflows.
F2 Operates similarly to the Fl key.
F4 Causes an exit from a scCreen either to the main menu or to the next
sequential screen.
FS Causes the line on which the cursor is positioned to be deleted.
\*kkdkkhhhkk
MUX DEVICES
OONSCLES  (CRTs)
. € Control Data
2 Hazeltine
{6€] Hazel tine/KOMPOZ
C4 LA36
S Adds 926
6 Adis 580
. C1 Adds 528
C8 Regent 108
C9 Regent 40
C18 Viewpoint Al
C11 Viewpoint 60 \*'?W
Cl2 Viewpoint color
P4 Diablo
P5 Okidata
P6 M200
P7] LA-36 (No keyboard)
3.11
<!-- page 13 -->
LEGEN UTILITY
ooar HManual
FURNCTION KEYS & DEVICE CODES
Section III
FIXTILIARY FIILIOTRS
RRERURDE
Not Used
Not Used
TI 810
Diablo
Not Used
M200
Not Used
DISK DRIVES
 RRIRRRERE D14
Bawk ,2-platter
Pertec, 4-platter
Pertec, 3-platter
Falcon, 2-platter
Falcon, l-platter
Floppy, single-sided, old
Floppy, double-sided, old
CMD 96-megabyte (6-platter)
CMD 64-megabyte (4-platter)
CMD 32-megabyte (2-platter)
Finch
Wren
Floppy, single-sided, new
Floppy, double-sided, new
PARALLEL, FRILZIERS
P18
P11
P12
P13
P14
P15
Pl6
P17
Centronics
Data Printer
DC 9322
ODEC
B309/B680 Upper Case Only
B309,/B600 Upper Case/lower case
DC 93xx Upper Case Only
C(DC 93xx Upper Case/lower case
3.1-2
<!-- page 14 -->
+UNCTION KEYS & DEVICE CODES
SYSGEN UTILITY
User Manual
Section II1
TAPE TNITS
w1  Streamer
y2 Mag Tape
BISYNC
)
B BISYNC
3.1-3
<!-- page 15 -->
5YGGEN UTILTIY
User Manual
et
SYSTEM CCNSTANTS
Time Out Value
Sactor Eolds
per Partiticn
xshkkkkEkk
CARTITIONS
Priority
pisk Defaults
EXH./Z\\.':'\_D[I"IC:J Of SYSGEN OPTICNS
Section V
Range: g-65535. This is the number of seconds of
inictivity that will pass pefore the system will sign-off
partitions. Entries of 8 or 65535 will cause the word
\*1XLE" to appear in the field and the sign-off feature
is disabled.
Range: 0-127. The sector hold table detemines the
number of file "holds" that may be active on the system
at any one time. The total is equal to the product
of this entry times the number of partitions configured.
Range: 9-127
The system parameters p, L, T and W are available for
use at the programmer's discretion. A possible structure
is L for libraries, T for temporary filess w for work
files. D (or DD) is the familiar default disk parameter.
Range B-255: Howevel, only perameters  -9 may be referenced
through JCL. Others must be referenced with the APLIB
subroutines GELJP and PUTJP.
Range B8-255: These are the programmel logical units,
SySmn.
5.1-1
<!-- page 16 -->
.AIN UTILTIY EXPLANATION OF SYSGEN CPTIGRIS
car Fanual Section V
JLTIPLEXOR
(32 &2 234 2 &1
23dreas Add.ess refers to the ports on the MUX boards. On the first HUX, addresses are: F20@, F282, F204, and
F206; on the second: F218, F212, F214, F216; on the
third: F220, F222, F224, F226: etc.
B This value controls the parity and baud rate at which
the device will operate. Valid entries are:
PARITY ))) NONE EVEN 009)
Baud Rate
6089 - 5 -
Eecurity Code Range 1-6 alphanumeric characters. This is the security
code to sign on a console.
ISR Ruzber Interrupt service routines (ISR) are specially written
routines which are used for special types of multiplexor
driver devices. At present, there are no Centurion
supported ISRs.
Euffer Length Range @-2048; P will be unbuffered.
[SK DRIVES
Code Range  -65535; 180 is no code.
5.1-2
<!-- page 17 -->
CENTURION
USER MANUAL
June 14, 1982
Includes 12/88/83 Revisions
17808 Jay Ell Drive
Richardson, Texas 75081
Copyright 1983 by Centurion Computer Corporation. All rights
reserved. No part of this publication may be reproduced, stored
in an information retrieval system, or transmitted in any form
or by any means without prior written permission by Centurion
Computer Corporation.
<!-- page 18 (front-matter table of contents, omitted) -->
<!-- page 19 -->
SYSGEN UTILITY
User Manual
Installation Procedures
Richardson, Texas Printed in USA
<!-- page 20 -->
Sysgen for the Centurion VI 1is a major step towards
versatility and support of Centurion systems. However, the
new loader and operating system is incompatible with the old
loader and IPL method. It 1is suggested that before
installation, the installer should become thoroughly
familiar with the SYSGEN documentation and the following
installation procedures. These procedures are necessary
only on the first implementation of the new system.
Installation of all future releases will simply be a copy of
the @35YS file and re-boot. It is also suggested that the
old system disk be backed-up previous to installation.
1. Mount SYSGEN release pack on disk unit zero.
2. Set R/F switch to removable (button out).
3. Depress LOAD OPSYS. If a "D=" PROM 1is installed,
answer HO.
4, The release system will now IPL. The new IPL. method
requires a few more seconds to complete so please be
patient.
5. After the messages:
DOS 6.2 - A
MAX DISK = n SYSTEM DISK = O
Depress NEWLINE and complete IPL as usual.
6. After the IPL is complete, set the security code for
the fixed disk if necessary.
7. Delete the following files from the fixed disk if
present:
A. 6JXLIB
B. @TXLIB
C. @PDLIB
D. @BASIC
E. XSPOOL
8. Create the system €SYS file with:
<!-- page 21 -->
.NEW €SYS ON 1 'L' 32T,FSI=32T
SYSGEN Utility Installation Procedures
9. Copy €3YS from 0 to 1 with:
S.COP @85YS 0 1
10. Copy €LOAD from 0 to 1 with:
S.COPN @LOAD 0 1
11. Write new IPL track with:
WIPLT 1
12. Create a configuration data set for your in-house
machine with P.OSCON. 1If desired, this can be done by
copying €0SN from O to 1 and using P.OSCON to modify
60SN on 1 to match the desired configuration.
Otherwise, a new configuration set can be created with
P.OSCON.
13. Load the configuration created in previous step with
LOAD OPSYS if named @0SN, or with SELECT if other
filename.
4. Create configuration data sets for all Centurion VI
customers.
15. Repeat steps 1 through 11 at each customer site. Then
copy the appropriate configuration set to the
customer's system disk and re-boot.
Future system releases will be simple to install. Just copy
the file @3YS from the release pack to the system disk and re-boot. No re-gen or re-configuration is necessary until
the hardware configuration of the customer's machine
changes.
Please note that there is also new $S,P,?,CVT 1libraries on
the SYSGEN release pack. These also should be installed by
normal methods but are not required for the conversion to
the SYSGEN system.
As usual, if assistance 1is required, feel free to call
Centurion Software Support for additional information or
problem resolution.
<!-- page 22 -->
SYSGEN UTILITY
User Manual
### Introduction
Richardson, Texas Printed in USA
<!-- page 23 -->
### Introduction
The XOSCON system utility provides the user with a safe and
simple method of generating and maintaining custom operating
system configurations for the Centurion VI. Used in con-
junction with the new generation/loading procedures,
generating operating systems becomes a relatively easy
process. The system generation utility allows users with
little technical expertise to generate configurations with
confidence, yet is versatile enough for the most
sophisticated uses.
Most of the parameters solicited by XOSCON may be defaulted.
That 1s, by simply entering "NEWLINE", XOSCON will
substitute an appropriate value which may be changed if
desired. For most uses, defaulting is recommended.
However, if the user wishes to enter his own values, minimum
and maximum values are given throughout this manual.
For all physical devices, XOSCON will allow the setting of
the controller address and select code. However, it is
highly suggested the defaults (answer "NEWLINE") be used as
XOSCON will correctly assign controller addresses at
validation time. When one becomes familiar with Centurion
controller addresses, this ability to modify addresses can
be useful, but extreme caution must be used.
The operation portion of this manual is divided into two
sections: Initialization and Editing. The initialization
section is intended as a step-by-step tutorial, while the
editing section is designed as a reference guide.
<!-- page 24 -->
SYSGEN UTILITY
User Manual
Initialization
Richardson, Texas Printed in USA
<!-- page 25 -->
SECTION II
INITIALIZATION
1. The SYSGEN utility is called by entering:
P.OSCON
2a. CRT displays:
ENTER CONFIGURATION DATA SET LIBRARY OR "NEWLINE"
Enter:
aaaaaaaaaa library containing the
desired configuration table
NEWLINE if configuration table is a
discrete file
2b. CRT displays:
Enter:
fname a binary file name which may or may not
already exist which will contain the final
configuration data set
3. CRT displays:
Enter:
d the disk unit number of the configuration
set file name
I1-1
<!-- page 26 -->
SYSGEN Utility Initialization
4. CRT may display: (if not, go to SECTION III- EDITING)
FILE fname NOT FOUND ON DISKAd
DO YOU WISH TO CREATE? (Y/N)
Enter one of the following:
Y to initialize name on disk d. Go to step
5.
N initialization of fname will not be done.
Go to step 2.
If the configuration data set, assigned to SYSl, is
empty or 1invalid, XOSCON will solicit the initial
configuration.
5. CRT displays:
Enter one of the following:
0-32 number of the system disk
NEWLINE system defaults to disk 1
6. CRT displays:
ENTER CONSOLE TIME LOCK (IN SECONDS)
Enter one of the following:
0-65534 the amount of time of inactivity that
will pass before the system will sign-
off partitions
NEWLINE system defaults to no time lock
II1-2
<!-- page 27 -->
SYSGEN Utility Initialization
7. CRT displays:
Enter one of the following:
0-79 the maximum "SYS" number
newline system defaults to 15
This is used to specify the frequency of the power being
input to the computer. This is necessary for the clock on
the CPU to keep proper time. U.S. standard 1is 60 cycles
per second (Hertz) while most European countries use 50
Hertz.
8. CRT displays:
ENTER POWER LINE FREQUENCY IN HERTZ (CYCLES PER SECOND)
Enter one of the following:
1-120 Note: O is an invalid option
NEWLINE Default=60
I1-3
<!-- page 28 -->
SYSGEN Utility Initialization
The sector hold table determines the number of file "holds"
that may be active on the system at any one time. For
example, 1f there are 2 sector holds per partition in a 5
partition system, then 2 x 5 or 10 "holds" may be active at
any one time by the application programs.
9. CRT displays:
Enter one of the following:
0-127 Note: if O is entered, "holds" cannot be
done
NEWLINE Default = 4
10. XOSCON will then clear the CRT screen and solicit
salutation messages by displaying:
Enter one of the following:
n+l to enter a new line. Go to step ll.
1-2 to re - -enter an existing line. Go to step
11.
99 to end processing. Go to step 12.
11. CRT displays:
Enter 1-80 characters of text followed by "NEWLINE".
This text will appear on the screen when the system
IPL's. Generally, the salutation message(s) describe
information about the system such as CPU type, number
of partitions, disk types, printer types, etc. Go to
step 10.
I1-4
<!-- page 29 -->
SYSGEN Utility Initialization
PARTITION Pn
ENTER PRIORITY
Enter one of the following:
0-127 prio;ipy required for displayed
NEWLINE system defaults to priority O
13. CRT displays:
Enter one of the following:
0-32 disk unit number to be default disk for
partition Pn
NEWLINE system defaults to disk 1
14. CRT displays:
Enter one of  he following:
0-10 the number of Job control language
parameters for partition Pn
NEWLINE system defaults to 10.
<!-- page 30 -->
SYSGEN Utility Initialization
15. CRT displays:
Enter one of the following:
O-n the maximum job control language ""SYS\*
number, where 'n' is the system maximum
logical unit number entered in step 7.
NEWLINE system defaults to 15
l6. CRT displays:
ARE ALL PARTITIONS DEFINED?
Enter one of the following:
Y if all system partitions have been
defined. Go to step 17
N if more partitions must be defined. Go
to step 12.
17. CRT displays:
DISKn
ENTﬁR DISK UNIT NAME
Enter one of the following:
dname any 1-6 character name
NEWLINE system defaults to DISKn
I1-6
<!-- page 31 -->
SYSGEN Utility Initialization
18. CRT displays:
Enter one of the following:
O-FFEO a hexidecimal memory location. The
memory location through which the disk
controller board is accessed is depen-
dent on the disk type.
NEWLINE system defaults to [TBR] 'to be resolved'
at configuration validation time.
19. CRT displays:
Enter one of the following:
0-127 select code used to distinguish multiple
units with the same controller address.
The code used is dependent on the disk
type.
NEWLINE system defaults to [TBR] 'to be resolved'
at configuration validation time.
NOTE: If the controller address was en-
tered at step 18, the select code
must be entered.
ENTER TYPE
Enter one of the following:
Pertec disk drive
single Hawk/Falcon/Pertec fixed disk
dual Falcon fixed disks
single-sided flexible disk
dual-sided flexible disk
CMD/SMD/MMD fixed disk
Winchester (Finch)
NEWLINE system defaults to type 'H'
ZTOgunmmo
I1-7
<!-- page 32 -->
SYSGEN Utility Initialization
21.
22.
23.
CRT displays:
Enter one of the following:
0-32 unit number of the disk volume
NEWLINE system defaults to 'n' where 'n' is the
number of disk units defined presently
minus one.
The unit number is used to identify the disk volume.
For example, in Job Control Language the statement:
.USE file ON 4 FOR SYSn
d is the disk unit number.
CRT displays:
Enter one of the following:
0-65534 disk security code
NEWLINE system defaults to code 100-NO CODE
CRT displays:
ARE ALL DISKS'DEFINED?
Enter one of the following:
Y if all disks have been defined. Go to
step 24.
N if more disks must be defined. Go to
step 17.
<!-- page 33 -->
SYSGEN Utility
Initialization
Enter one of the following:
name
NEWLINE
a 1-6 character console unit name
system defaults to CRTn
Enter one of the following:
O-FFEO
NEWLINE
a hexidecimal memory location. The
memory location is the address in which
the multiplexer board is accessed by the
operating system.
system defaults to {TBR] 'to be
resolved' at configuration wvalidation
time
Enter one of the following:
0-127
NEWLINE
select code used to distinguish multiple
units with the same controller address
system defaults to [TBR] 'to be
resolved' at configuration validation
time
NOTE: If +the controller address was
entered at step 25, the select
code must be entered.
I1-9
<!-- page 34 -->
SYSGEN Utility Initialization
Enter one of the following:
0-48 unit number used to identify the console
NEWLINE system defaults to the number of console
units defined minus one.
Enter one of the following:
XXXXXX a 1-6 alphanumeric code
NEWLINE system defaults to no code
Enter one of the following:
0-127 number of lines the CRT will support
NEWLINE system defaults to 24
30. CRT displays:
Enter one of the following:
predriver for CDC console
predriver for ADDS 520/580
predriver for ADDS 920
predriver for ADDS R40/R100
predriver for LA-36
predriver for Hazeltine
predriver for Hazeltine (with KOMPOZ
underlining)
NGV
WO
NEWLINE system defaults to predriver 1 (an ADDS
520/580)
Predrivers make CRT models Centurion compatible.
<!-- page 35 -->
SYSGEN Utility Initialization
31.
32.
32a.
33.
CRT displays:
ENTER MULTIPLEXER CONTROL BYTE (MCB)
Enter one of the following:
p-255 the parity and baud rate ast which the console will
operate. The standard values are:
Parity: None Even 0dd
Baud Rate:
) 600 - 5 -
NEWLINE system defaults to 197 (Centurion standard: 9688 baud,
even parity)
CRT displays: ENTER ISR
Enter one of the following:
8-190 ISR for CRTn
NEWLINE system defaults to no ISR
Interrupt service routines (ISR) are specially written routines
which are used for special types of multiplexer driver devices.
At present, there are no Centurion supported 1ISRs.
CRT displays:
Enter CRT buffer size
Enter one of the following:
1-129 this number will be rounded up to a multiple of 8 and
will be the size of the CRT type-a-head buffer.
NEWLINE for no CRT buffer.
CRT displays:
ARE ALL CONSOLES DEFINED?
Enter one of the following:
Y if all consoles have been initialized. Go to step 34,
N If more consoles must be defined. Go to step 24,
<!-- page 36 -->
SYSGEN Utility Initialization
34. CRT displays:
Enter one of the following:
Y to initialize printers. Go to step 35.
N if no printers are to be defined. Go to
step 41.
35. CRT displays:
PRTn
Enter one of the following:
name a 1-6 character alphanumeric printer
unit name
NEWLINE system defaults to PRTn
36. CRT displays:
Enter one of the following:
O-FFEOQ a hexidecimal memory location. The
controller address is the memory
location through which the printer
controller board will access the
printer. The address varies according
to printer type.
NEWLINE system defaults to [TBR] 'to be
resolved' at configuration wvalidation
time.
<!-- page 37 -->
SYSGEN Utility Initialization
37.
38.
39.
CRT displays:
Enter one of the following:
8-127 select code used to distinguish multiple
units
NEWLINE system defaults to [TBR] 'to be resolved'
at configuration validation time
NOTE: If the controller address was entered at step
36, the select code must be entered.
CRT displays:
ENTER TYPE
Enter one of the following
0 type 9: Dumb Centronics (old)
1 type 1: Data printer
2 type 2: CDC 9322
3 type 3: CDC 9315-17-18
CDC 9386
4 type 4: ODEC data 100
5 type 5: CDC 9316-17-18 (upper/lower case)
6 type 6: TI810
7 type 7: Dataproducts B388/B680 Upper case
only
8 type 8: Dataproducts B3008/B608 Upper/lower
case
9 " type 9: Diablo
R remote printer
H remote printer with Hazeltine CRT
D remote Diablo printer
A Okidata Printer
NEWLINE system defaults to type 4
CRT displays: (if not, go to step 49)
Type 'R' or 'H' or 'D' was selected at step 38. Enter
the console unit to which the remote printer will be connected.
The console will be displayed as the controller address.
System default is CRTO.
I11-13
Revised 6/15/83
<!-- page 38 -->
SYSGEN Utility Initialization
40. CRT displays:
ARE ALL PRINTERS DEFINED?
Enter one of the following:
Y if printers have been defined. Go to
step 41.
N if more printers must be initialized.
Go to step 35.
41. CRT displays:
ARE ANY SPOOCLERS REQUIRED?
Enter one of the  ollowing:
Y to initialize spoolers. Go to step 42.
N if no spoolers needed. Go to step 46.
PRTQ
Enter one of the folllowing:
name a 1-6 character spooler name
NEWLINE system defaults to PRTQ and to PRTOn
43. CRT displays:
Enter one of the following:
name a 1-21 character file name
NEWLINE system defaults to @spool, and @SPOOLn
I1-14
<!-- page 39 -->
SYSGEN Utility Initialization
44. CRT displays:
Enter:
0-32 disk number on which the spool file will
reside
NEWLINE system defaults to specified system disk
45. CRT displays:
ARE ALL SPOOLERS DEFINED?
Enter one of the following:
Y if spoolers have all Dbeen initialized.
Go to step 46.
N if more spoolers must be defined. Go to
step 42
46. CRT displays:
ARE ANY SPECIAL UNITS REQUIRED?
Enter one of the following:
Y to initialize a non-Centurion supported
device. GO to step 47. .
N if no special units are required. Go to
step 54.
47. CRT displays:
' UNITn
Enter one of the following:
name a 1-6 character unit name
NEWLINE system defaults to UNITn
I1-15
<!-- page 40 -->
SYSGEN Utility Initialization
48. CRT displays:
Enter one of the following:
O-FFEO a hexidecimal memory location
NEWLINE system defaults to F0O0O
49. CRT displays:
Enter one of the following:
0-127 select code of the special unit to
distinguish between multiple units
NEWLINE system defaults to O
50. CRT displays:
Enter a 1-21 character filename of the program to be
used as the physical I1/0 driver for the special unit.
There is no default.
CAUTION: it is the user's responsibility to supply the
correct device driver routine.
51. CRT displays:
Enter the 1-21 character filename of the program which
will initialize special wunit UNITn. Default is no
initialization.
Enter one of the following:
0-127 PUB size in operating system
NEWLINE DEFAULT = 24
<!-- page 41 -->
SYSGEN Utility Initialization
53. CRT displays:
ARE ALL SPECIAL UNITS DEFINED?
Enter one of the following:
Y if all necessary special units have been
initialized. Go to step 54.
N if more units must be defined. Go to
step 47.
54, 1Initialization of the SYSGEN utility 1is complete.
Proceed to Section III-EDITING.
I1-17
<!-- page 42 -->
SYSGEN UTILITY
Usér Manual
Editing
Richardson, Texas Printed in USA
<!-- page 43 -->
SECTION III
EDITING
After initialization or if the configuration data set is val-
id, XOSCON displays the SYSGEN menu.
1. CRT displays:
XOSCON-SYSTEM-CONFIGURATION UTILITY
(01) DESK CABINET YES/NO
(03) CONSOLE TIME LOCK IN SECONDS n/NONE
(04) MAXIMUM LOGICAL UNIT NUMBER (SYS) n
(05) POWER LINE FREQUENCY IN HERTZ n
(06) SECTOR HOLDS PER PARTITION n
(07) SALUTATION MESSAGES n
(08) PARTITIONS n
(09) DISK VOLUMES n
(10) CONSOLES n
(11) PRINTERS n
(12) SPOOLERS n
(13) COMMUNICATIONS LINES n
(14) TAPE UNITS n
(15) SPECIAL UNITS n
(98) VALIDATE/WRITE CONFIGURATION
(99) END PROCESSING
Enter one of the following:
1 to determine which Centurion model the.
configuration is to be used with. Go to
step 2.
2 to enter system disk number. Go to step
3.
3 to enter time lock. Go to step 4.
4 to maximum locial unit number. Go to
step 5.
5 to enter power line frequency that will
be supplied to the computer. Go to step
54.
6 to enter the number of sector holds per
partition. Go to step 55.
I11-1
<!-- page 44 -->
7 to display/enter salutation messages.
Go to step 6.
8 to display partition parameters. Go to
step 8.
9 to display disk parameters. GO to Step
14.
10 to display console parameters. Go to step
22.
11 to display printer parameters. Go to
step 33.
12 to display spooler parameters. Go to
step 39.
13 to display communications lines. Go to
step 58.
14 to display parameters of special units.
Go to step 44.
15 to validate configuration. Go to step
53. )
29 to terminate. Go to step 56.
IS THIS CONFIGURATION FOR A DESK CABINET MODEL?
Enter one of the following:
Y or + if for desk cabinet model
N or - if not for desk cabinet model
Return to step 1.
I11-2 Revision 9/15/82
<!-- page 45 -->
SYSGEN Utility Editing
SYSTEM DISK
3. CRT displays:
Enter one of the following:
0-n where 'n' = number of disk volumes
NEWLINE DEFAULT = 1
Return to step 1.
4. CRT displays:
ENTER CONSOLE TIME LOCK (IN SECONDS)
Enter one of the following:
0-65534
NEWLINE
the amount of time of inactivity that
will pass before the system will sign-
off partitions
DEFAULT = no console time lock
Return to step 1.
5. CRT displays:
ENTER MAXIMUM LOGICAL UNIT NUMBER (SYS#)
Enter one of the following:
0-79
NEWLINE
Return to step
the maximum "SYS" number
DEFAULT = 15
1.
<!-- page 46 -->
SYSGEN Utility Editing
6. Screen is cleared and the salutation messages, if any
are displayed. CRT then displays:
Enter one of the following:
1-n to re-enter an existing 1line. Go to
step 7.
n+l to enter a new line. Go to step 7.
99 end processing. Return to step 1.
/. CRT displays:
Enter 1-80 characters of text followed by "NEWLINE"
The salutation message(s) will be displayed.
Return to step 6.
8. CRT displays:
Enter one of the following:
0-(n) to edit an existing partition, where 'n
is the number of partitions presently
defined minus one. Go to step 9.
NEWLINE DEFAULT = O
99 to create a new partition. (See
Initialization}).
IT1-4
<!-- page 47 -->
SYSGEN Utility
9. CRT displays:
PARTITION Pn
(02) DEFAULT DISK
(03) NUMBER OF JOB PARAMETERS
(04) MAXIMUM LOGICAL UNIT NUMBER
(91) DELETE PARTITION
Enter one of the following:
1 to change partition
step 10.
priority.
Editing
o
e
o B
e
Go to
2 to change partition default disk. Go to
step 11.
3 to change number of job parameters for
partition. Go to step 12.
4 to change maximum logical
Go to step 13.
91 to delete partition
step 1.
displayed.
number.
Go to
929 to terminate. Return to step 1.
10. CRT displays:
ENTER PRIORITY
Enter one of the following:
0-127 priority for displayed partition.
NEWLINE DEFAULT = 0
Return to step 9.
11. Crt displays:
Enter one of the following:
0-32 disk unit number to be default disk for
displayed partition
NEWLINE DEFAULT = currently defined system disk
I1I-5
<!-- page 48 -->
SYSGEN Utility
Editing
Enter one of the following:
0-10
NEWLINE
number of job control
parameters for displayed partition
DEFAULT = 10
Return to step 9.
13. CRT displays:
Enter one of the following:
O-n
NEWLINE
Return to step 9.
14. CRT displays:
Enter one of the following:
dname
NEW
where 'n' is the maximum logical
number of the system
DEFAULT = 15
"NEW" IF NEW DISK
a valid existing disk unit name. Go
step 15.
to create a new disk volume.
Initialization)
I11-6
unit
to
(See
<!-- page 49 -->
SYSGEN Utility Editing
15. CRT displays:
(01) DISK UNIT NAME dname
(02) CONTROLLER ADDRESS hhhh/[TBR]
(03) SELECT CODE n/L[TBR]
(04) TYPE t
(05) UNIT NUMBER n
(06) DEFAULT CODE n
(91) DELETE DISK VOLUME
Enter one of the following:
1 to change disk unit name. Go to step
16.
2 tc change controller address. Go to
step 17.
3 to change select code. Go to step 18.
4 to change disk type. Go to step 19.
5 to change disk unit number. GO to step
20.
6 to change disk security code. Go to
. step 21.
21 to delete disk unit displayed. Go to
step 1.
99 to terminate. Return to step 1.
16. CRT displays:
DISKn
Enter one of the following:
dname
NEWLINE
Return to step 15.
DEFAULT =
a 1-6 character unit name
DISKn
I11I-7
<!-- page 50 -->
SYSGEN Utility Editing
17.
18.
19.
CRT displays:
Enter one of the following:
O-FFEO a hexidecimal memory location
NEWLINE DEFAULT = [TBR] 'to be resolved' by
XOSCON at configuration validation time
Return to step 15.
CRT displays:
Enter one of the following:
0-127 code used to distinguish multiple units
with the same controller address
NEWLINE DEFAULT = [TBR] 'to be resolved' by
XOSCON at configuration validation time
Return to step 15.
CRT displays:
-ENTER TYPE
Enter one of the following:
p Pertec disk drive
H single Hawk/Falcon/Pertec fixed disk
F dual Falcon fixed disks
S single-sided flexible disk
D dual-sided flexible disk
C CMD/SMD/MMD fixed disk
W Winchester (Finch)
NEWLINE DEFAULT = H
Return to step 15.
II1-8
<!-- page 51 -->
SYSGEN Utility
Enter one of the following:
0-32 unit number of the disk volume
NEWLINE DEFAULT = n+l, where 'n' is the
of disk units presently defined.
Return to step 15.
Enter one of the following:
0-65534 disk security code
NEWLINE DEFAULT = 100 (no security code)
Return to step 15.
CONSOLES
ENTER CONSOLE NAME OR "NEW" IF NEW CONSOLE
Enter one of the following:
cname a valid existing CRT name. GO toO
23.
NEW to create a new console unit.
Initialization).
III1I-9
Editing
number
step
(See
<!-- page 52 -->
SYSGEN Utility
CRT displays:
(01) CONSOLE NAME
(02) CONTROLLER ADDRESS
(03) SELECT CODE
(0O4) UNIT NUMBER
(05) SECURITY CODE
(06) SCREEN SIZE
(07) PREDRIVER
(08) MCB
(09) ISR
(91) DELETE CONSOLE
Editing
cname
hhhh/[{TBR]
n/[TBR]
n
code /NONE
n
n
n
n/NONE
Enter one of the following:
1 to change console unit name. Go to step
24.
2 to change controller address. Go
step 25.
3 to change select code. Go to step 26.
4 to change console unit number. Go
step 27.
5 to change security code. Go to step 28.
6 to change console screen size. Go
step 29.
7 to change console predriver number.
to step 30.
8 to change console multiplexer control
byte. Go to step 31.
9 to change console interrupt service
routine. Go to step
91 to delete console displayed. Return
step 1.
99 to terminate. Return to step 1
ITI-10
<!-- page 53 -->
SYSGEN Utility Editing
24.
25,
26.
CRT displays:
Enter one of the following:
cname a 1-6 character console unit name
NEWLINE DEFAULT = CRTn
Return to step 23.
CRT displays:
Enter one of the following:
O-FFEO a hexidecimal memory location
NEWLINE DEFAULT = [TBR] 'to be resolwed' by
XOSCON at configuration validation time
Return to step 23.
CRT displays:
Enter one of the following:
0-127 code used to distinguish multiple wunits
with the same controller address
NEWLINE DEFAULT = [TBR] 'to be resolved' by
XOSCON at configuration validation time
Return to step 23
<!-- page 54 -->
SYSGEN Utility Editing
27.
28.
29.
30.
CRT displays:
Enter one of the following:
0-48 number to identify console unit
NEWLINE DEFAULT = n+l, where 'n' is the number
of console units presently defined minus
one.
Return to step 23.
CRT displays:
Enter one of the following:
code a 1-6 alphanumeric code
NEWLINE DEFAULT = no code
Return to step 23.
CRT displays:
Enter one of the following:
0-127 number of lines the CRT will support
NEWLINE DEFAULT = 24
Return to step 23.
CRT displays:
Enter one of the following:
0---6 predriver number for CRT displayed
NEWLINE DEFAULT = 1
Return to step 23
<!-- page 55 -->
SYSGEN Utility Editing
31. CRT displays:
ENTER MULTIPLEXER CONTROL BYTE (MCB)
Enter one of the following:
\#-255 parity/baud rate at wich the console unit will operate.
The standard MCB values are:
Parity: None Even 0dd
Baud Rate:
) 600 - 5 -
NEWLINE Default = 197 - Return to step 23.
Enter one of the following:
8-190 interrupt service routine for CRTn
NEWLINE Default = no ISR
Return to step 23.
PRINTERS
33. CRT displays:
ENTER PRINTER NAME OR "NEW" IF NEW PRINTER
Enter one of the following:
pname a valid existing printer. Go to step 34.
NEW to create a new printer. (See initialization).
<!-- page 56 -->
SYSGEN Utility Editing
34. CRT displays:
(01) PRINTER NAME pname
(02) CONTROLLER ADDRESS hhhh/[TBR]
(03) SELECT CODE n/[TBR]
(04) TYPE c
(91) DELETE PRINTER ENTER PARAMETER NUMBER OR 99
IF FINISHED
Enter one of the following:
1 to change printer name. Go to step 35.
2 to change controller address. Go to step 36.
3 to change select code. Go to ster 37.
4 to change printer type. Go to step 38.
91 to delete printer displayed. Return to step 1.
99 to terminate. Return to step 1.
35. CRT displays:
PRTn
Enter one of the following:
pname a 1-6 character alphanumeric unit name
NEWLINE DEFAULT = PRTn
Return to step 34.
36. CRT displays:
Enter one of the following:
O=FFEO a hexidecimal address
NEWLINE DEFAULT = [TBR] 'to be resolved' by XOXCON
at configuration validation time
Return to sten 34.
I11-14
<!-- page 57 -->
SYSGEN Utility Editing
37.
38.
CAUTION: Except for types 6, 9, R, H, and D, only 4 print- eérs are physically able to be in use at any one point in time, XOSCON will only resolve the first four printers correctiy. All printers follow- ing that will be resolved with the fourth print- er's address. If more than four printers are to be generated, the user should enter his own con-
troller address.
CRT displays:
Enter one of the following:
0-127 code used to distinguish multiple units
with same controller address
NEWLINE DEFAULT = [TBR] 'to be resolved' by
XOSCON at configuration validation time
Return to step 34.
CRT displays:
ENTER TYPE
Enter one of the following:
0 type O: Dumb Centronics
1 type 1l: Data printer
2 type 2: CDC 9322
3 type 3: CDC 9316-17-18 (U.C)
CDC 9386
4 type 4: ODEC Data 100
5 type 5: CDC 9316-17-18 (U.C./L.C.)
9) type 6: TI810
7 type 7: Dataproducts B300/B600 Upper
case only
8 type 8: Dataproducts B300/B600 Upper/
lower case
9 type 9: Diablo
R remote printer
H remote Diablo with Hazeltine CRT
D remote Diablo printer
A type A: Okidata Printer
NEWLINE DEFAULT = type 4
I11-15
<!-- page 58 -->
SYSGEN Utility Editing
39. CRT displays:
ENTER SPOOLER NAME OR "NEW" IF NEW SPOOLER
Enter one of the following:
sname a valid existing spooler. Go to step
40.
NEW to create new spooler. (See Initial-
ization).
49. CRT displays:
(01) SPOOLER sname
(02) SPOOL FILE filename
(03) DISK VOLUME FOR SPOOL FILE n
(91) DELETE SPOOLER
Enter one of the following:
1 to change spooler name. Go to step 41.
2 to change spool file name. Go to step
42.
3 to change disk number for spooler. Go
to step 43.
91 to delete spooler displayed. Return to
step 1.
99 to terminate. Return to step 1.
I1I-16
<!-- page 59 -->
SYSGEN Utility Editing
41. CRT displays:
Enter one of the following:
sname a 1-6 character name
NEWLINE DEFAULT = PRTQn
Return to step 40.
Enter one of the following:
sname a 1-21 character file name
NEWLINE DEFAULT = @SPOOLnN
Return to step 40.
43. CRT displays:
Enter one of the following:
0-32 disk number where spool file will be
NEWLINE DEFAULT = specified system disk
Return to step 40.
44. CRT displays:
ENTER SPECIAL UNIT NAME OR "NEW" IF NEW UNIT
Enter one of the following:
uname a valid existing special unit.
NEW to create a new special  unit
Initialization).
I11-17
(sec
<!-- page 60 -->
45
SYSGEN Utility Editing
CRT displays:
(01) SPECIAL UNIT uname
(02) CONTROLLER ADDRESS hhhh
(03) SELECT CODE n
(04) DRIVER ROUTINE NAME filename
(05) INITIALIZATION ROUTINE NAME filename
(06) PHYSICAL UNIT BLOCK SIZE n
(91) DELETE SPECIAL UNIT
Enter one of the following:
1 to change special unit name. GO to step
46.
2 to change controller address. Go to
step 47.
3 to change select code. Go to step 48.
4 to change driver routine name. Go to
step 49.
5 to change initialization routine name.
Go to step 50.
6 to change size of PUB.
91 to delete special
Return to step 1.
Go to step 51.
unit displayed.
99 to terminate. Return to step 1.
I1I-18
<!-- page 61 -->
SYSGEN Utility
46.
47.
48.
49.
50.
0-127 code used to distinguish multiple units with the same controller address
NEWLINE DEFAULT = 0
Return to step 45.
CRT displays:
ENTER' DRIVER ROUTINE NAME
Enter a 1-21 character file name to be used as the driver for the special unit. Return to step 45.
CRT displays:
Enter a 1-21 character file name which will initialize
CRT displays:
Editing
Enter one of the following:
uname
NEWLINE
a 1-6 character unit name
DEFAULT = UNITn
Return to step 45.
CRT displays:
Enter one of the following:
O-FFFF
NEWLINE
a hexidecimal address
DEFAULT = F000
Return to step 45.
CRT displays:
Enter one of the following:
the special unit. Return to step 45.
II1I-19
<!-- page 62 -->
SYSGEN Utility Editing
56. CRT displays:
END XOSCON
```
/ DO YOU WANT A LISTING OF THE CONFIGURATION SET?
/ s B
```

ENTER: S e
Y ST If you wish to print a liééing of
your cgnfigugag{o§3§ablg;
N If you do(noﬁ wish a li§Fing
57. CRT displays: (if you answered yes§ to prdduce a
listing)
ENTER PRINT DEVICE NAME:
Enter:
PRTn
SYSO and SYS2 are cleared, and program terminates.
CAUTION: 1If the configuration has not .been validated
: and written to '- the configuration data set,
the current configuration data will be lost.
I11-22
<!-- page 63 -->
SYSGEN Utility Editing
58. CRT displays:
ENTER LINE NAME OR "NEW"/@QGRQQR@
Enter one of Eﬂé féliéélﬁg:
NAME a 1-6 character line name
NEW. . ..a 1-6 character line name
Note: "NEWLINE will not default name.
59. CRT displéyé:' (if "NEW" was entered)
ENTER LINE NAME/@eeéeee
Enter the following:
a 1-6 character comﬂdhibagidns line name
60. CRT displays:
ENTER CONTROLLER ADDRESS/Q@RQRQEQRQ
Enter oné of the following:
0-FFEQ ,;A;hexidecimal memory location.
-- . The memory location is the address
in which the multiplexer board is
accessed by the operating system.
NEWLINE System defaults to TBR to be-
resolved at configuration validation
time.
<!-- page 64 -->
SYSGEN Utility
61. CRT displays:
ENTER SELECT  CODE/Q@@Q@e- .1
Enter one of the followiag:.. & -
0-12
Editing
-Select code. used\_to:distinguish multiple
'units w1th the same.controller address.
. System. defaults - -TBR to be resolved
R at confkguratlon -validation time.
Note: 1If the controller address :was. -
entered in previous step,
select code.
A here.
62. CRT displays: v ,,. '
the
must , berentered
. .
ENTER MULTIPLEXER CONTROL BYTE"ﬁMCB)/######
Enter one of the following: e
71
. . NEWLINE
63. CRT displays:
300 baud
1200 pbaud
2400 baud
4800 baud
2600 baud.
5 -
8 data
8 data
8 data
8 data
8:data
- ENTER SECURITY CODE/@@@@ee
Enter one of the following:
XXXXXX
NEWLINE
a 1-6 alphanumeric code
bits
bits
bits
bits
bits
. system-defaults \_to 'I97'
7 data bits, odd parity
avern.
even
even
even
even
parity
parity
parity
parity
parity
- 9600 baud
system defaults to no code
<!-- page 65 -->
SYSGEN Utility " Editing
64 . CRT Displays:
ENTER LINE NAME OR: NEW/@e@@ee- -
o -
Enter one of the following:- (- -:
-LNAME - -.a wvalidg- ex1st1ng Llne name. Go
oL . -to next -step. o
- NEW-- & to- create a new communlcatlons
SR -line+--{See: Inltlallzatlon)
s A to A 65. CRT dlsplays.asszk;: ::-.;j-i-- .
(M)Jimamms.;uﬁn.gu".xmmﬁ
(02) CONTROLLER ADDRESS   hhhh/ TBR (03) SELECT CODE   n/ TBR P (04) MCB  civvviivnnnenae n == 707
(05) SECURITY CODE   code/none,-
-(91) DELETE LINE .. - .. B one
ENTER PARAMETER NUMBER OR 99 IF FINISHED//#
Enter-one-of the following:' :
o le e TTcichahge:line name. Go to step 66.
L2 .- "To'change5cohtroller address. Go to step 67.
3. - : Tochange -select codé. Go té&step 68.
(4 = "To changeimultipléxéf addresé? Go to step 69.
5., . . "-To chapgeAsécurfﬁj;déde.:7é6'Eo step 70.
91 AT;.Aeiete iigé aigplayed. Return to step 1
of editing. SR
99 To terminate. - /Retdfﬁ"t0"sté§}1"of editing.
<!-- page 66 -->
SYSGEN Utility
66.
67.
68.
CRT displays: -
ENTER LINE NAME/@@QRQRQ@Q@ .
Enter one of the following: - -
LNAME a 1-6 character line
NEWLINE default to LINE
Return to step 64.
CRT displays:
Editing
-name
ENTER CONTROLLER ADDRESS/@@@.
Enter one of the folloﬁ{hg:
O-FFEOQ a hexidecimal memofy
NEWLINE default= TBR to be resolved.by - .
location. \_.
XOSCON at configuration validation
time
Return to step 64.
CRT displays:
ENTER SELECT CODE/######%
Enter one of the following:
0-127 Code used to distinguish multiple
lines with the same controller address.
NEWLINE default= TBR to be resolved by XOSCON
at configuration validation time
Return to step 64.
<!-- page 67 -->
SYSGEN Utility .- Editing
69. CRT displays:
ENTER MULTIPLEXER CONTROL BYTE/######
Enter one of the following:
Same chgrt as in sté§-62::
Return to s ep 64. |
70. CRT displays:
ENTER SECURITY CODE/@QRQRQRGQ
Enter one of the follpwi@g; .
CODE a 1 - 6'alphanumeric code' Tal W o L -
NEWLINE ..default=no code
Return to-stepeeé.iv
111-27 Revision 9/15/82
