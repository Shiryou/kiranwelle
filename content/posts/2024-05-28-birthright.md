---
title: "Rebuilding Birthright: The Gorgon's Alliance"
date: 2024-05-28
series: ["Rebuilding Birthright: The Gorgon's Alliance"]
---

## What?

For the last few years, I've been hosting and updating [instructions for installing][kw-brinstall] a game called Birthright: The Gorgon's Alliance. Birthright came out in 1997 and was published by Sierra On-Line, which dominated the PC game market at the time. The game was a PC adaptation of the fantasy world Birthright. Birthright was a campaign setting for Dungeons & Dragons, meaning it provided a world, lore, and some extra rules and creatures for players to roleplay in. The Gorgon's Alliance had middling reviews and didn't sell well outside of D&D players, but reviewers saw it had some charm.

## Why?

I spent a lot of my childhood playing The Gorgon's Alliance, though I never got around to the pen and paper game until much later in life. Through my interest in the world and lore, I found my way to [Birthright.net][birthrightnet], which was keeping the D&D setting alive despite it being dropped as an official product. There I shared my dream of building a sequel to the game eventually.

## How?

I was also a follower of Al Lowe, who was an early developer for Sierra On-Line and created one of my other favorite games, Torin's Passage. [He announced in 2018][polygon-allowe] that he had found and was auctioning off backup disks he had created during his time there. "I backed everything up because I knew Sierra didn’t."

These disks included not only the source code for his Leisure Suit Larry games, but also [the source code for Birthright: The Gorgon's Alliance][birthrt_source], which found its way to the Internet Archive a year later.

## Dependencies

As you might expect from video game source code, there are some library dependencies to resolve. I discovered these on [a previous try at building the source about 3 years ago][birghrightnet_previous] that went nowhere.

* [Source and audio files][birthrt_source]
* [Open Watcom 1.9][openwatcom]
* [DirectX SDK April 2005][directx_sdk]
* [Windows 95 DDK][windows95_ddk]

### Open Watcom 1.9

We'll be using the `MAKE.BAT` command included with the source to leverage the (theoretical) wisdom of the developers in building. Running this gives us:

>     'wmake' is not recognized as an internal or external command, operable program or batch file.
>     'grep' is not recognized as an internal or external command, operable program or batch file.

So we need `wmake` and `grep`. `wmake` is an easy one. Download and install Open Watcom 1.9. I did a full installation. `grep` is only used to filter the error log, so we'll replace it with `findstr`.

The installer should offer to modify your system environment variables for you. If it doesn't or you chose to skip that, you'll need to add the binaries to your `PATH` variable and create an `INCLUDE` variable containing the paths to various header files.

In my case, this turned out so:

>     > set path
>     Path=C:\WATCOM\BINNT;C:\WATCOM\BINW;C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;C:\Windows\System32\OpenSSH\;C:\Program Files\Git\cmd;C:\Program Files\TortoiseGit\bin
>     PATHEXT=.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC

<br>

>     > set include
>     INCLUDE=C:\WATCOM\H;C:\WATCOM\H\NT;C:\WATCOM\H\NT\DIRECTX;C:\WATCOM\H\NT\DDK

### DirectX SDK April 2005

Looking at `error.log`, we see

>     File: winsys\PNetMod.hxx
>       included from winsys\FileXfer.hxx(6)
>       included from winsys\GMulPlay.hxx(30)
>       included from winsys\mulplay.hxx(22)
>       included from main.cpp(73)
>     (91,10): Error! E059: unable to open 'DPlay.h'

`DPlay.h` is the header file for DirectPlay from old versions of the DirectX SDK. As you can see in [the modern installation instruction][kw-brinstall], DirectPlay is required to play the game. The best solution for this error is to install the DirectX SDK from April 2005.

The installer pretends to install fine, but the files are nowhere to be found. That's fine, because we only really need the header files. These are saved to `%LOCALAPPDATA%\Temp\Include`, so I created `C:\DirectXSDK` and move the files in there. This also gets added to the `INCLUDES` environment variable.

### Windows 95 SDK/DDK

Looking at `error.log`, we see

>     .\winsys\mciutil.c(13): Error! E1055: Unable to open 'digitalv.h'

[According to Microsoft][digitalv_h], `digitalv.h` is part of "Windows Multimedia." The file is included in the 16-bit header files of the Windows 95 SDK. Much like the DirectX SDK, this doesn't want to install properly on modern systems, but since we only need the header files, we can copy them directly from the ISO file.

I copied both the `INC16` and `INC32` folders to C:\Win95DDK and added them to my `PATH` variable. You're welcome to throw all of these things into a single directory if you chose, but I think keeping things separated makes it easier to find and debug issues.

[birghrightnet_previous]: http://www.birthright.net/forums/showthread.php?28960-Any-tech-savvy-peeps-here-interested-in-the-Birthright-PC-game-source-code&p=92991&viewfull=1#post92991
[birthrightnet]: http://www.birthright.net/
[birthrt_source]: https://archive.org/details/birthrt_source
[digitalv_h]: https://learn.microsoft.com/en-us/windows/win32/api/digitalv/
[directx_sdk]: https://archive.org/details/dxsdk_apr2005
[kw-brinstall]: {{< ref "birthright.html" >}} "Installing Birthright: The Gorgon's Alliance on Windows 10"
[openwatcom]: http://openwatcom.org/ftp/install/
[polygon-allowe]: https://www.polygon.com/2018/12/1/18121018/leisure-suit-larry-source-code-ebay-for-sale-al-lowe-sierra-on-line
[windows95_ddk]: https://winworldpc.com/product/windows-sdk-ddk/windows-95-ddk
