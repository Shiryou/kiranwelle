---
title: "A Foray Into Modding Birthright"
date: 2024-08-06
series: ["Modding Birthright: The Gorgon's Alliance"]
---

For several years there has been [a thread on the Birthright.net forums][brnet-modding] talking about modding Birthright: The Gorgon's Alliance. The posts have been few and far between, but there does seem to be some interest into adding new adventures to the game.

The work that's been done there has discovered that Birthright adventures are pieced together through a combination of resource files (`.RES`) in the `RESFILES` directory, descriptions in the `TEXT` directory, and level information in the `WADS` directory.

The description files appear to be normal text files with some control characters thrown in. The WADS are the same format as those used by Doom, with one user importing a Birthright adventure map into Doom and vice versa. The main mystery was the resource files, with WAD editors being [relatively easy to find][wad-editors].

Thanks to some invetigating of the source code by another user, and confirmed by my own digging, resource files are fairly simple. The format is similar to a Zip archive with multiple compressed files concatenated back-to-back, followed by an index in the back of the file. The file header contains the file's format version (currently at 4 in the source code), the location of the index, and the number of files contained in the archive. Files appear to be compressed using the [Lempel–Ziv–Storer–Szymanski (LZSS algorithm)][lzss].

Managing resource files is currently a bit difficult. The original executable used by the developers to build and edit the files, `resutil.exe`, was included in the Birthright source code, but only runs in DOS. The source code for that executable is included, but requires building C and assembly code, which requires setting up a bunch of different tools on modern operating systems just to get a command line utility runnnig again.

Since the assembly code only does the LZSS encoding/decoding, and the C code documents the file format relatively well, I've decided to build a new tool in C# that will hopefully allow modders to create new levels for the game in an easy to use graphical interface.

The initial milestones are listed below:

* Read `.RES` files and support exporting files: This will help to figure out what is in the files and what they're used for.
* Write `.RES` files: If the resource files are relevant to modding, as expected, this will allow making changes and replacing the existing files.
* Quality of Life: Ensure the project is in a good state if people want to contribute, ensure errors are handled reasonably, etc.
* Build a graphical interface that will make all of this easy.

I've never been very good at C, and I'm relatively new to C#, so this should be a fun adventure.

You can follow the current progress, or download the source code, [on GitHub][brut-github].

[brnet-modding]: http://www.birthright.net/forums/showthread.php?28766-Modding-Birthright-Gorgon-s-Alliance-Adventures
[brut-github]: https://github.com/Shiryou/brut
[lzss]: https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Storer%E2%80%93Szymanski
[wad-editors]: https://doomwiki.org/wiki/Editing_utility#WAD_editors
