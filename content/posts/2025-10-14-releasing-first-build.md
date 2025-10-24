---
title: "Releasing Our First Build"
comments: true
date: 2025-10-14 17:05:00 -0700
categories: [Birthright]
tags: [BirP]
series: ["rebuilding-birthright-the-gorgons-alliance"]
---

## The No CD Fix

When I briefly looked at removing the CD requirement before my last post, it seemed fairly straight forward until I noticed there was a `InstallationType` variable that changed a bit of behavior in a few places. I figured this could be a source of issues if the CD were suddenly no longer available. To explain why, let's cover a bit of video game history. If you're not interested, feel free to skip to the next section.

In the 90s, when CD media was still relatively new for video games, [some games][pcgw-redbook] used the [CD Digital Audio][wiki-cdda] (CD-DA) format for music. Between 1980 and 2000, several formats were developed by media player companies in a collection called [Rainbow Books][wiki-rainbow]. Each specification was named after a color and represented a specific kind of CD media (CD-DA, CD-ROM, CD-I, CD-R/CD-RW, Photo CD, VCD, etc). The specification for CD-DA was the Red Book. This is the same format used by record companies when music CDs became popular. This meant you could stick your PC game into a CD player and listen to the music from the game.

Since this music information was not stored in files in the CD filesystem, this meant the files can't just be copied from the CD to your computer. The game looks for the CD and plays track 1 or 2 instead of looking for `1.WAV` or `2.WAV`. If you've ever ripped your games to CD images to be able to play them without having to lug your CDs around, you may have also seen the software tell you it can't generate an ISO file and needs to use the Cue/Bin format instead. The `.cue` file or "cue sheet" is what handles this CD-DA data and tells your computer which track is where in the data stream and what metadata is associated with it.

The Birthright source code includes `REDBOOK.C` and `REDBOOK.H`, which also contain most of the references to the `InstallationType` variable. This threw me off and made me think the issue was more complicated than it really is. After looking at it more closely, most of the functions in that file start with the same comment: `not used in birthright I`. The only function that seems to be used is `LoadMusicFromCD`, which just seems to copy `.WAV` files around.[^1] Yay!

## Versioning

The remainder of the changes for the "no CD fix" were pretty minor. I compiled the Windows version of the game and it seems to run well so far. I haven't had time for extensive testing, but I've had a few people say they would be willing to beta test. Before we can get the game to them, we need to package everything and add some instructions. I've created a small README.txt file with instructions, which mostly mirror [the ones I've written before][kw-install].

To make it easier for people to check for updates, report bugs, and communicate effectively during beta testing, it would be good to have a way to tell one build apart from another. This is generally done with versioning. Since we're enhancing the original game, I think it makes sense to continue the original versioning scheme, meaning the first full release will be Patch 1.5.

For small releases, hot fixes, and beta testing builds, I want to also use patch versioning (similar to the [Semantic Versioning][semver] standard). To illustrate, many software have a version number like 1.5.256.

* 1 is the **major** version: This changes if we break how the game works, like changing how the game handles assets or adventures, forcing us to replace some of the original files. I assume the intent for Birthright would have been that Birthright II would have been 2.0. I don't expect this to change.
* 5 is the **minor** version: This changes as we introduce new features.
* 256 is the **patch** version: This changes every time there is a bug fix.

Some developers also add on another version:

* The **build** version: This changes every time the game is compiled from different source code (i.e. for every commit). This allows us to directly identify which commit a person is experiencing issues with so we can address the specific changes in that commit.

This 4 number format is what we'll be using, which is perfect because the [Portable Executable][wiki-portex] format that Windows uses has versions separated into 4 numbers. This works perfectly with standard Semantic Versioning in most cases.

Why do I bring this up? Because the developers shot me in the foot here. Synergistic decided to define the version for patch 1.4 as "1.0.0.4." This makes using patch versions a little difficult since I can't put anything after the 4. I could keep incrementing the 4 spot, but that sounds crazy and doesn't give the version numbers any meaning.

Anyway, I'm going to shift that 4 to the left two places and continue from there, making the version number of the No CD Fix beta 1.4.0.1. Essentially, if the 4th digit is 0, then it's a release build. Otherwise, it's a beta or test build.

## Where to publish

Now that we've resolved that, we have to figure out how to get the builds to people. GitHub is the obvious choice since we already have [a repository there][github-birp], but you can't add releases without tying them to a commit, and I'm not making those public yet. I added [Birthright on ModDB][moddb-birthrt], so that's the next most logical place to put it.

I've created a mod page for the [Birthright Preservation Patch][moddb-birp] and added the file there. All future releases will go to the same place and I'll be sure to link them in all of the relevant places. I sitll haven't figured out why the DOS version is missing it's fonts, so this is a Windows-only release.


[^1]: We'll take a closer look at `LoadMusicFromCD` later. It copies the background music file from the `music` folder to the root folder when starting an adventure. This is likely a caching technique to avoid constantly reading from the CD, but it's no longer necessary. The code is a bit confusing, so it'll take a while to really understand what it's doing. While it's not ideal, writing a small file to disk every half hour is the least of our worries. For backwards compatibility purposes, we should probably just leave it alone.
[^2]: A patch version is a part of the [Semantic Versioning][semver] standard.

[github-birp]: https://github.com/Shiryou/BirP
[kw-install]: {{< ref "../birthright.html" >}} "Installing Birthright: The Gorgon's Alliance on Windows 10 & 11"
[moddb-birp]: https://www.moddb.com/mods/birthright-preservation-patch
[moddb-birthrt]: https://www.moddb.com/games/birthright-the-gorgons-alliance
[pcgw-redbook]: https://www.pcgamingwiki.com/wiki/List_of_games_that_use_Red_Book_CD_audio
[semver]: https://semver.org/
[wiki-cdda]: https://en.wikipedia.org/wiki/Compact_Disc_Digital_Audio
[wiki-portex]: https://en.wikipedia.org/wiki/Portable_Executable
[wiki-rainbow]: https://en.wikipedia.org/wiki/Rainbow_Books
