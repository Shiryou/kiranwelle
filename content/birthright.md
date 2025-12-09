---
title: "Installing Birthright: The Gorgon's Alliance on Windows 10 & 11"
description: "Getting Birthright: The Gorgon's Alliance running in Windows 10 & 11 is surprisingly easy. Even multiplayer play is possible."
cover_image: img/posts/birthright/cover-title.jpg
url: birthright/
type: page
show_toc: true
comments: true
date: 2020-02-20
categories: [Birthright]
series: ["birthright-the-gorgons-alliance-support"]
---

<article>

![](/img/posts/birthright/cover-middlebw.jpg)

One of the things I find most interesting about desktop support is trying to support legacy hardware and software. Not only does it provide an opportunity to learn more about the history of computing, but it also tends to provide some interesting compatibility challenges. The place where I run into this most often and that I think gets the most words written about it on the Internet is in getting old games running on modern hardware and operating systems. Surprisingly, Windows 10 & 11 still support a wide array of classic games that one might expect would never run. That includes the title I'm writing about today: *Birthright: The Gorgon's Alliance*.

<div id="toc"></div>
<a id="installing"></a>

## Installing the game

Getting the game running in Windows 10 & 11 is surprisingly easy. You only need a few things to get started:

* A Birthright: The Gorgon's Alliance CD or an ISO image of the CD. (These can sometimes be found on eBay. Sadly, the game is no longer sold on any digital storefronts.)
* [Patch 1.4](http://www.birthright.net/forums/downloads.php?do=file&id=93) to update the game to the latest version. (Also available from [Sierra Help Pages](https://web.archive.org/web/20170626004704/https://sierrahelp.com/Patches-Updates/Patches-Updates-Games/BirthrightUpdates.html), referred to as Birthright Windows '95 Update 1.0.4.)
* [7-zip](https://www.7-zip.org/download.html) to extract the game files from the 1.4 patch.
* [Birthright Preservation Patch]({{< ref "birthright-patch.md" >}}) (optional) to get quality of life improvements for the game
* [Scenario Editor](http://www.birthright.net/forums/downloads.php?do=file&id=94) (optional) to mod the game.
* [Character Editor](http://www.birthright.net/forums/downloads.php?do=file&id=91) (optional) to mod the game. (Also available from [Sierra Help Pages](https://web.archive.org/web/20170626031633/http://www.sierrahelp.com/Games/BirthrightHelp.html) and the Birthright Preservation Patch.)
* [ipxwrapper](https://github.com/solemnwarning/ipxwrapper/releases) (optional) for multiplayer.

![](/img/posts/birthright/cd.png)

1. Insert the CD into the CD-ROM drive or mount the ISO image of the CD by double-clicking it.

![](/img/posts/birthright/birthrt.png)

2. Create a folder named BIRTHRT in the root of the C drive.

![](/img/posts/birthright/copy.png)

3. Copy all the files from the CD to the BIRTHRT folder.

![](/img/posts/birthright/extract.png)

4. Extract the contents of the patch and, if desired, the Scenario Editor and Character Editor.

![](/img/posts/birthright/patch.png)

5. patch.exe is an installer file that will not run on Windows 10 or 11. Instead, use 7-zip to extract all the files from the executable.

![](/img/posts/birthright/patch_warn.png)

6. You'll likely see a warning that the file could not be opened as a [PE] archive and was opened as a [zip] archive instead. This is fine and doesn't require any action.

![](/img/posts/birthright/move.png)

7. Move the resulting files from the last two steps to the BIRTHRT folder.

![](/img/posts/birthright/logo.png)

8. Double-click WINBR.EXE to start the game.

![](/img/posts/birthright/editors.png)

9. If you included them in the setup, you can also double-click `CHARED.EXE` or `SCENED95.EXE` to start the Character Editor or Scenario Editor, respectively.
10. If desired, extract the Birthright Preservation Patch into the BIRTHRT folder to remove the requirement to have the CD inserted/mounted.

## Multiplayer

Since the game is based on a Dungeons &amp; Dragons setting&mdash;a decidedly multiplayer experience&mdash;you might be tempted to think that it is fun to play the game with other people. Unfortunately, I've not been able to find anyone to play with, so I can't confirm. If you would like to try it out for yourself, here is how you can get this working on Windows 10

Birthright's multiplayer component is only available in the Windows version of the game, and not in the DOS version. It also doesn't allow you to play military battles as you would in a single-player game. Instead, it uses quick AI battles. All players will take their turns simultaneously and the NPC domains will get their turns once all players complete their turns.

Since Sierra's servers are no longer active, the only option you have available is playing within your Local Area Network. It is theoretically possible to play using a VPN connection, but there have been complaints about excessive lag on simple LAN connections, so this may not be feasible. The lag on LAN caused some issues starting a multiplayer game occasionally, so I suggest saving often in case the players get disconnected.

1. Extract the contents of the latest ipxwrapper release archive into the BIRTHRT folder.
2. Double-click the `directplay-win32.reg` or `directplay-win64.reg` file, depending on [your system architecture](https://support.microsoft.com/en-us/office/determine-whether-your-computer-is-running-a-32-bit-version-or-64-bit-version-of-the-windows-operating-system-aac162a1-0cb3-46f2-888f-2f22897396ce).

![](/img/posts/birthright/multcommon1.png)

3. Run `WINBR.EXE` and select the *Multiplayer* option in the main menu.

![](/img/posts/birthright/multcommon2.png)

4. Select *Local Area Network or Modem* and click *Done*.
![](/img/posts/birthright/multcommon3.png)

5. In the *Windows Features* dialog that comes up, select *Install this feature* to install **DirectPlay**. This window may open in the background behind your game, making it look like your game just froze. It may also take some time to install.

![](/img/posts/birthright/multcommon4.png)

6. Click the *Close* button.
![](/img/posts/birthright/multcommon5.png)

7. In the *Windows Security Alert* dialog, select which networks the game should be allowed to communicate on and then click *Allow Access*.  
This is for the `WINBR.EXE` executable. You'll see another for Windows' DirectPlay feature later.

<ol><ol>

**On the host computer:**

</ol></ol>

![](/img/posts/birthright/multhost1.png)

1. On the *Multiplayer* screen, enter your name, select *IPX*, and click *Create*. **Note:** If IPX is not an option, this means that ipxwrapper was not properly setup.

![](/img/posts/birthright/multhost2.png)

2. Give the game a meaningful name, select the number of players that will be in the game (including yourself), and click *Host*

![](/img/posts/birthright/multcommon6.png)

3. In the *Windows Security Alert* dialog, select which networks the game should be allowed to communicate on and then click *Allow Access*. This is for Windows' DirectPlay feature. You'll see another for Windows' DirectPlay feature later.

![](/img/posts/birthright/multhost3.png)

4. Wait for the other players to join the game.

![](/img/posts/birthright/multhost4.png)

5. When all players have joined, select the game options.

<ol><ol>

**On the joining computer(s):**  

</ol></ol>

![](/img/posts/birthright/multplayer1.png)

1. On the *Multiplayer* screen, enter your name, select *IPX*, and click *Join*. **Note:** If IPX is not an option, this means that ipxwrapper was not properly setup.


![](/img/posts/birthright/multcommon6.png)

2. In the *Windows Security Alert* dialog, select which networks the game should be allowed to communicate on and then click *Allow Access*. This is for Windows' DirectPlay feature. You'll see another for Windows' DirectPlay feature later.

![](/img/posts/birthright/multplayer2.png)

3. The game host should provide you with the name of the game. It may take a few moments for the game to list the available games. Once it appears, select the game and click *Join*

![](/img/posts/birthright/multplayer3.png)

4. Once all players have joined and the host configures the game settings, you should be presented with the domain selection screen.

<a id="learning"></a>

## History

*Birthright: The Gorgon's Alliance* is a PC game released for both Windows and MS-DOS in 1997.  It was developed by Synergistic Software, a division of Sierra On-Line, who also developed the Hellfire expansion for Blizzard's Diablo the same year.

The game is an adaptation of the Birthright campaign setting for the Advanced Dungeons and Dragons line. In the campaign setting, players can become rulers of nations imbued with some of the divine power released when their gods fought a great battle and were destroyed.

The PC game is split into three sections, which can be played separately or as part of a larger game. Realm play allows the player to control a nation and the political and economic interests thereof. In Adventure play, the player takes a group of adventurers into dungeons, castles, and dense forests to find items of power or to battle powerful foes. In Battle play, the player can arrange his troops on a real-time battlefield and test his strategy against the computer.

Although I can no longer find references to its planned sequels, any hope of more of the Birthright setting in videogame form was lost when the game was not able to please fans.

<a id="modding"></a>

## Modding the Game

Aside from the official Scenario Editor and Character Editor, one can modify Birthright's assets using the [Birthright Resource Utility (BRUT)](https://github.com/Shiryou/brut). This tool is still in active development.

Thanks to some digging by [Birthright.net](http://www.birthright.net/) users kasrkraw and InVivoSomnium, there is [some information available](http://www.birthright.net/forums/showthread.php?28766-Modding-Birthright-Gorgon-s-Alliance-Adventures&highlight=modding) on the modified Doom WADs that Birthright uses to run its adventures.

I'm still doing research and testing, but am posting new information in my [Modding Birthright: The Gorgon's Alliance]({{< ref "series/modding-birthright-the-gorgons-alliance/_index.md" >}}) series and [the reference page]({{< ref "birthright-modding-reference.md" >}}).

<a id="compiling"></a>

## Compiling the game

In 2018, Al Lowe, the creator of another of my favorite Sierra games ([*Torin's Passage*](https://www.mobygames.com/game/torins-passage)), [sold his archive of old Sierra "junk"](https://www.pcgamer.com/leisure-suit-larry-creator-al-lowe-is-selling-his-archive-including-sierra-source-code/). This junk included diskettes containing old Sierra source code. A year later, the code for *Birthright: The Gorgon's Alliance* appeared [on the Internet Archive](https://archive.org/details/birthrt_source).

The necessary libraries and packages are:

* [Watcom 10.6](https://winworldpc.com/product/watcom-c-c/106) - The C++ compiler (including the `wmake` utility) used to compile the source. Make sure to run `setenvironment.bat` to add the necessary include files.
* [Microsoft DirectX 5.0 SDK](https://archive.org/details/idx5sdk) - The latest version of the DirectX SDK that seems to include `dplay.h`.
* [Windows 95 DDK](https://winworldpc.com/product/windows-sdk-ddk/windows-95-ddk) - This SDK containes some necessary include files.

It's not necessary to install the two SDKs. You can simply extract the include directories and add them to Watcom's `INCLUDE` environment variable.

## Troubleshooting

###### failed writing initial conditions file

![](/img/posts/birthright/initial_cond.png)

When I first started testing this setup on a different PC, I ran into an error message after the intro cinematic saying "failed writing initial conditions file". This was caused by the fact that I transferred the files from the CD to my computer using TeraCopy, which marked the files as read-only. To solve this:

1. Select all the files in the BIRTHRT folder.
2. Right-click the selected files and click *Properties*.

![](/img/posts/birthright/read_only.png)

3. Uncheck the *Read-only* option and click *OK*.
4. Select *Apply changes to the selected items, subfolders and files* and click *OK*.

###### Please insert your Birthright CD

![](/img/posts/birthright/no_cd.png)

If you have your CD inserted, but you see the error message "Please insert your Birthright CD. Click Cancel to exit.", it likely means that the drive letter of the CD has changed. To fix this:

![](/img/posts/birthright/cfg_file.png)

1. Open the file `BRSETUP.CFG` in any text editor.
1. Change the letter beneath the text `[CD]` to the drive letter of the CD.

If you have any corrections or helpful tips, please leave them in the comments below.

<a id="more"></a>

## More from me on Birthright

If you're interested in more information from me on Birthright: The Gorgon's Alliance, especially technical analysis, please check out the blog series below:

* [Rebuilding Birthright: The Gorgon's Alliance]({{< ref "series/rebuilding-birthright-the-gorgons-alliance/_index.md" >}})
* [Modding Birthright: The Gorgon's Alliance]({{< ref "series/modding-birthright-the-gorgons-alliance/_index.md" >}})

</article>
