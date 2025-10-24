---
title: "Fixing Community Adventures in Birthright"
comments: true
date: 2025-10-24 12:59:58 -0700
tags: [BRUT, BirP]
categories: [Birthright]
series: ["rebuilding-birthright-the-gorgons-alliance"]
---

The more I work in various programming projects, the more I see that the majority of issues are resolved with hours of debugging resulting in one- or two-line changes. I have fixed [the bug that brought me back to compiling Birthright][kw-advbug] last month. Around this time last year, I was hard at work documenting how to create and play community[^1] adventures in Birthright when I noticed a very disheartening issue: picking up the quest item in any community adventure would crash the game to desktop. I was able to rule out mistakes in my community adventures by copying a built-in adventure directly and just renaming all the files to turn it into a "community" adventure. The crash still happened just the same.

Knowing that the built-in levels were hard-coded into the game, I figured there must be some information that these hard-coded levels have that is missing in the community adventures, and I was right. There are two places in the code that define information related to built-in and community adventures:

* `PLACES.CPP`: Defines place names used for adventures and also likely other things.
* `CHARSEL.CPP`: Defines the filename of each built-in adventure, along with it's difficulty level, availability, associated realm, and the index of the place name in `PLACES.CPP`.
* (There's also a list of level filenames that matches them directly with their place names in `CHARTEXT.CPP`, but that's been commented out.)

As you might expect, community adventures don't have a place name. The index in `CHARSEL.CPP` is simply set to `-1`, which isn't a proper index. When a player clicks on the quest goal item while playing, the game displays a scroll congratulating them for finding the goal and letting them know they can leave the place they're in. Since the game mentions the place name in this message, it caused custom adventures to try to look up the place name using the invalid index, which caused the crash.

The simplest solution would be to simply check for the places index of `-1` and insert something like "this adventure" instead, but that doesn't work with the various translations of the game. I took a look at the French and German translations, and there just weren't any existing strings that would work grammatically in all situations. I considered just leaving the field empty, but that also sticks out and could make the sentence confusing. For now, I've decided to simply insert the adventure's filename in order to resolve the bug. This is a decent workaround for now because there's precedent for it in the game already. It does this in the adventure selection screen.

Ultimately, I'd like to re-size the `place_names` array and add a custom field to the `SCN` file format so level designers can add their own names, falling back to the filename if the designer forgets to add the field.

Now that custom adventures are working properly, I'm going to split my time between [BRUT][github-brut] and the patch until BRUT is "done." My current goals for BRUT are:

* Implement LZSS compression (decompression is already implemented) so that it is a complete `resutil` replacement.
* Add DOOM IWAD generator using game textures and "things" (BIRTHRT.WAD) to make level creation easier in Doom level makers.

---

On an unrelated note, I've been considering trying to find a good IDE[^2] to use. Up to now, I've been just working in [Notepad++][notepad], but there are some IDE features I miss. Specifically, finding and moving to code definitions and references. This always requires using "Find in Files" and looking through potentially hundreds of results.

Unfortunately, Birtright is written in pre-ISO standard C++.[^3] The closest standard would be C++98, which came out (you guessed it) in 1998. Visual Studio stopped supporting C++98 in Visual Studio 2010, so using a modern version of Visual Studio shows me a bunch of non-existent errors. I found and installed a copy of Visual Studio 2010, but it's filled with features we don't need and it doesn't integrate properly with the WATCOM compiler we're using.

After a bit of searching, I narrowed it down to three alternatives:

* NetBeans
* Eclipse
* Code::Blocks

NetBeans and Eclipse are good options, but neither supports C++ out of the box. They require plugins and it's not clear from a quick review whether they support C++98. Code::Blocks was the main IDE I used back in 2005/2006 when I last messed with C++. It is specifically for C/C++, supports C++98, has a portable version, has the right configuration options to support the WATCOM compiler and our Makefile, and it's familiar enough to be useful.

So, I've created a Code::Blocks project file (`.CBP`) and will be using that for most of my development. The nice thing is that this gives me a fair amount of flexibility without having to either write commands directly on the command line or create batch files.

---

My next focus is the [random adventure crashes that several people have reported][github-advcrash]. From what I've gathered, this happens mainly when the game has been played for a while; especially after playing multiple adventures. Sadly, I don't have the kind of free time to game that I used to, so I haven't been able to reproduce this bug myself. Instead, I've put a [debug build on ModDB][moddb-debug], and I'm hoping that a couple of people that have discussed it in the past can reproduce it for me and provide the errors. If I can at least track down where in the code the problem is, I hope I can figure out a reliable way to reproduce the issue and fix it.

With that said, I've also been playing with the WATCOM debugger. After chasing my own tail for about an hour and realizing my build script was renaming the executable and causing the debugger not to find the symbol information, I finally got it to display the code and stop at some test breakpoints. I have a sense that the commandline version works better than the GUI version.

Hopefully, my next post will contain some good news about this adventure crash bug.


[^1]: Up until now, I've been calling these "custom adventures" for lack of a better term. I've been trying to come up with a better term for them and have finally settled on Community Adventures. It still doesn't feel quite right, but it's good enough for now.
[^2]: Integrated Development Environment. A fancy code editor with a bunch of features good for development.
[^3]: C++ was standardized by ISO in 1998. Before that, compilers tended to have a lot of their own interpretations and extensions, making it difficult to move your code to a new compiler and just have things work.

[github-advcrash]: https://github.com/Shiryou/BirP/issues/4
[github-brut]: https://github.com/Shiryou/brut
[kw-advbug]: {{< ref "2025-09-30-birthright-new-beginning.md" >}} "Rebuilding Birthright: A New Beginning"
[moddb-debug]: https://www.moddb.com/mods/birthright-preservation-patch/downloads/debug-build
[notepad]: https://notepad-plus-plus.org
