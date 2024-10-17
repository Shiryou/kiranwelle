---
title: "Decomp-depression"
date: 2024-08-19
categories: [Birthright]
series: ["Modding Birthright: The Gorgon's Alliance"]
---

I've spent two or three days working on the [Birthright Resource Utility (BRUt)][github-brut] and have managed to implement displaying the file index and exporting uncompressed files. Unfortunately, I've run into a bit of a problem with extracting compressed files.

For context, the resource files on the Birthright CD contain a total of 9427 files, of which 125 files (1.3%) are uncompressed. This leaves 98.7% of files unextractable. This makes the tool effectively useless.

After extracting the uncompressed `.WAV` files in `WAVE.RES`, I got to hear some sound effects I had never heard outside of the game before, so that was fun. If I implement adding and removing files, this might still be somewhat useful for modding. I'm not happy with that as an alternative, though. If I absolutely can't get the compression algorith to work, I'll use that as a fallback.

As I mentioned in [my previous post]({{< ref "2024-08-14-foray-into-modding-birthright.md" >}} "A Foray Into Modding Birthright"), the resource files use a compression algorithm called [LZSS][lzss]. This algorithm has been around for decades, so I was hoping I could use existing tools to decompress the files.

Sadly, I've been having trouble finding good quality libraries that support LZSS. I decided to try [AuroraLib][github-auroralib], but it requires setting some configuration variables that I was unable to get to work properly. WinRAR appears to use LZSS in version 3 and provides a DLL and licensing for decompression, but requires paying for compression.

I could probably try several less well-known libraries, but there's a chance I'll spend a lot of time and effort only to find out Synergistic Software had a bug in their algorithm or did something non-standard. I already ran into unexpected behavior in their [filename hashing algorithm][github-brut-hash][^1].

With all that said, I'm currently leaning towards rewriting the compression and decompression algorithms in C# by hand. Since these were written in Assembly Language, which I haven't used in a decade, this might take me longer than I was hoping to spend on the basic functionality.

In the process, I may discover the right configuration for AuroraLib to work properly. Either way, I think it's a worthwhile endeavor if I ended up with working code in the end.


[^1]: The `HashCRC` function hashes the filename to use as an index. It adds a `NULL` byte to the end of the filename because of an index overflow bug. I haven't done thorough testing, so I can only assume it's consistently `NULL`. I'll do more thorough testing later on.

[github-brut]: https://github.com/Shiryou/brut
[github-brut-hash]: https://github.com/Shiryou/brut/blob/main/brut-lib/HashCalculator.cs
[github-auroralib]: https://github.com/Venomalia/AuroraLib.Compression
[lzss]: https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Storer%E2%80%93Szymanski
