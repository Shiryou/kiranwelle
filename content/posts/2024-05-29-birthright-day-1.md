---
title: "Rebuilding Birthright - Day 1 & 2"
date: 2024-05-29
series: ["Rebuilding Birthright: The Gorgon's Alliance"]
---


### Day 1

The first day involved mostly figuring out which dependencies were needed where and how to get them installed. You can read about that [here]({{< ref "2024-05-28-birthright.md" >}} "Compiling Birthright: The Gorgon's Alliance").

We're going to take advantage of the developer's (theoretical) wisdom in building their own project and use their `make` command, `MAKE.BAT dos`:

>     Building RELEASE NOVA.EXE for DOS
>     makefile(795): Error(F46): Illegal character value 1aH in file
>     Error(E02): Make execution terminated
>     'grep' is not recognized as an internal or external command, operable program or batch file.

There seems to be some corruption in the Makefile. Removing last character in `Makefile` resolves the issue.

Running `MAKE.BAT dos` again, we get an error dialog:

> **Unsupported 16-Bit Application**
> 
> The program or feature "\??\C:\Birthrt\strmake.exe" cannot start or run due to incompatibity with 64-bit versions of Windows. Please contact the software vendor to ask if a 64-bit Windows compatible version is available.

Closing the dialog kept the script running. I left it for about 15 minutes. In the unlikely event that it wasn't frozen and was just a long process, I let it run while I had dinner with my family. After dinner, I promptly forgot about the project and inadvertently let it run overnight. In the morning, it was still in the same place, so I terminated the script.

>     Building RELEASE NOVA.EXE for DOS
>     Could Not Find C:\Birthrt\dosobjsr\version.obj
>     Error(E14): Cannot execute (strmake): Exec format error
>     Error(E42): Last command making (strdat.dat) returned a bad status
>     Error(E02): Make execution terminated
>     Terminate batch job (Y/N)? y

### Day 2

I ran `MAKE.BAT WIN95` and just `MAKE.BAT` to test

>     Building RELEASE NOVA95.EXE for WIN95
>     Could Not Find C:\Birthrt\winobjsr\version.obj
>     Error(E42): Last command making (winobjsr\main.obj) returned a bad status
>     Error(E02): Make execution terminated
>     'grep' is not recognized as an internal or external command, operable program or batch file.

<br>

>     ERROR: Invalid argument/option - 'Press'.
>     Type "CHOICE /?" for usage.
>     Building RELEASE NOVA95.EXE for WIN95
>     Could Not Find C:\Birthrt\winobjsr\version.obj
>     Error(E42): Last command making (winobjsr\main.obj) returned a bad status
>     Error(E02): Make execution terminated
>     'grep' is not recognized as an internal or external command, operable program or batch file.

At this point, `MAKE.BAT DOS` seemed to clear a hurdle, didn't have the popup dialog, and returned.

>     Building RELEASE NOVA.EXE for DOS
>     Could Not Find C:\Birthrt\dosobjsr\version.obj
>     Error(E42): Last command making (dosobjsr\main.obj) returned a bad status
>     Error(E02): Make execution terminated
>     'grep' is not recognized as an internal or external command, operable program or batch file.

Deleting `DOSOBJSR/strmake.obj` brings the dialog back, and running `MAKE.BAT WIN95` first makes it go away.

The `error.log` file also had a line asking whether `strdat.dat` should be deleting, which likely led to the pause in the script. Attempting to answer it as it ran didn't seem to work, but deleting both `BIRTHRT\strdata.dat` and `SIERRA\strdata.dat` resolved the problem.

---

At this point, we start running into actual compilation errors.

`strmake.cpp` has a warning about boolean expression assignment, which we'll ignore for now. I generally like to remove warnings, but for now I want to focus on hard errors.

`itemtype.hxx` has function declarations for various spells. Some spells are grouped by the character class, and these contain some duplicated declarations, which we'll comment out.

>     (713,73): Error! E907: redeclaration of member function 'ItemEffects::Regenerate' not allowed definition: 'long ItemEffects::Regenerate( long, long, long )'
>     (778,81): Error! E907: redeclaration of member function 'ItemEffects::Shrink' not allowed definition: 'long ItemEffects::Shrink( long, long, long )'
>     (782,73): Error! E907: redeclaration of member function 'ItemEffects::Levitate' not allowed definition: 'long ItemEffects::Levitate( long, long, long )'
>     (817,73): Error! E907: redeclaration of member function 'ItemEffects::ResistFire' not allowed definition: 'long ItemEffects::ResistFire( long, long, long )'
>     (820,73): Error! E907: redeclaration of member function 'ItemEffects::WaterWalk' not allowed definition: 'long ItemEffects::WaterWalk( long, long, long )'
>     (823,73): Error! E907: redeclaration of member function 'ItemEffects::MapShowAll' not allowed definition: 'long ItemEffects::MapShowAll( long, long, long )'
>     (835,65): Error! E907: redeclaration of member function 'ItemEffects::BADetectIllusion' not allowed definition: 'long ItemEffects::BADetectIllusion( long, long, long )'

---

Next, we have two errors complaining about a function redeclaration.

>     File: system.h
>       included from main.cpp(34)
>     (257,44): Error! E867: conflict with a previous using-decl 'printf'
>       definition: 'int watcall printf( char const *, ... )'
>     File: main.cpp
>     (1277,1): Error! E867: conflict with a previous using-decl 'printf'
>       definition: 'int watcall printf( char const *, ... )'

In order to hide debug messages on the release build of the game, the developers decided to override the `printf`, which the compiler is not too happy about.

We bypass this error by renaming the new `printf` function function to `false_printf` and adding the following just before `#include "system.h"`:

>     #if defined(_RELEASE)
>     // for the release version, we don't want any printf's
>     #define printf false_printf
>     int	false_printf( const char *__format, ... );
>     #endif

Then, in `SYSTEM.H` and `RESUTIL\SYSTEM.H`, we replace the declaration for printf with the same `#define`

>     - int	printf( const char *__format, ... );
>     + #define printf false_printf

The two errors went away and I continued squashing minor issues for about two hours, thinking the issue was solved. Sadly, these errors would come up several times until one popped up in one of Watcom's header files. At that point, I figured it must be a bad approach. Let's sleep on it and come back tomorrow.

---

There were some other minor issues that needed ironing out, but those are mostly small errors that likely came out of changes in the standard over time. I won't bore anyone with them here. They're available in the commit history if anyone is curious.

At this point, I'm up to 101 successfully built .obj files, so we're off to a good start. We also have 545 "No newline at end of file" errors.


---