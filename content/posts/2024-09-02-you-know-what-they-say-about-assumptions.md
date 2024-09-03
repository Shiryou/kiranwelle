---
title: "You Know What They Say About Assumptions…"
date: 2024-09-02
series: ["Modding Birthright: The Gorgon's Alliance"]
---

Today, I learned that I am not only much closer to a working decompression algorithm than I thought, but I also made a very bad assumption when starting this project—one that I could have avoided with a little more preparation.

When I start a project from scratch or start working on something at work, I plan things out beforehand. I make sure I understand the scope of the work as fully as I can before I write any code. This project started much more informally and with less of a concrete plan, so I let myself hyperfocus on my first milestone: listing and extracting files from the existing `.RES` files included with the Birthright CD. This is where the problem starts.

While I knew that `RESUTIL` does some processing of PCX files, I assumed that getting a file out of the `.RES` file was a reversal of the process to get the file into it in the first place (aside from the rotation option). This was wrong. Adding a PCX file to a `.RES` file involves:

1. Decompressing the file from a PCX file into a bitmap
2. Rotating the image (if that option is selected)
3. Compressing the file using LZSS

In comparison, adding an `.FLC` or `.WAV` file only needs step 3. Since I was mostly interested in working with templates, don't know anything about the `.FLC` format, and the `.WAV` files are mostly uncompressed, my testing was mostly done with `BUYMORE.PCX` in `INTRO.RES`.

Extracting a `.PCX` file is the same as extracting the other two formats: Decompress the file using LZSS and write it to disk. Ignoring rotation would probably have been fine since `BUYMORE.PCX` likely didn't need any rotating, but not recompressing the bitmap into a PCX file leaves us with a drastically different file than what we started with.

It took finally setting up DOXBox on my development VM, playing with the pre-compiled `RESUTIL.EXE` in the source archive, and several hours being kept away from my PC for my brain to make the connection with the drastic change in file size and look through the rest of `RESUTIL.C` to find what's different.

Finally, I understand what's happening and can approach this project more wisely. I was disappointed that extracting files might not work how I wanted, but after thinking about it, modding the game would mainly involve adding new files and overwriting existing ones. Few people will want to view the existing files. Still, I have to rewrite the PCX to bitmap conversion anyway, so I may write a reversal function because I'm curious about the contents of the `.RES` files.

Now that I finally have some example files extracted from `INTRO.RES`, I can focus on comparing apples to apples and figuring out what's really wrong with my decompression code. It is definitely much more on-point than I thought in my last post. I think the biggest issue may be in the calculation of the back address and run length.
