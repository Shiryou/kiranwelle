---
title: "You Know What They Say About Assumptions…"
date: 2024-09-02
series: ["Modding Birthright: The Gorgon's Alliance"]
---

Today I learned that not only am I much closer to a working decompression algorithm than I thought, but also made a very bad assumption when starting this project. One which I could have avoided with a little more preparation.

Why I start a project from scratch or start working on something at work, I take a little bit of time to plan things out ahead of time. I make sure I understand the scope of the work as fully as I can before I write any code. This project started much more informally and with less of a concrete plan, so I left myself hyperfocus on my first milestone: listing and extracting files from the existing `.RES` files included with the Birthright CD. This is where the problem starts.

While I knew that `RESUTIL` does some processing of PCX files, I assumed that getting a file out of the `.RES` file was a reversal of the process to get the file into it in the first place (aside from the rotation option). This was wrong. Adding a PCX file to a `.RES` file involves:

1. Decompressing the file from a PCX file into a bitmap
2. Rotating the image (if that option is selected)
3. Compressing the file using LZSS

In comparison, adding an `.FLC` or `.WAV` file on needs step 3. Since I was mostly interested in working with templates, don't know anything about the `.FLC` format, and the `.WAV` files are mostly uncompressed, my testing was mostly done with `BUYMORE.PCX` in `INTRO.RES`.

Extracting a `.PCX` file is the same as extracing either of the other two formats: Decompress the file using LZSS and write it to disk. Ignoring rotation would probably have been fine, since `BUYMORE.PCX` likely didn't need any rotating, but not recompressing the bitmap into a PCX file leaves us with a drastically different file than what we started with.

It took finally setting up DOXBox on my development VM and playing with the pre-compiled `RESUTIL.EXE` in the source archive and several hours being kept away from my PC for my brain to make the connection with the drastic change in file size and look through the rest of `RESUTIL.C` to find what's different.

Finally, I understand what's happening and I can approach this project more wisely. I was disappointed that extracting files might not work how I wanted, but after thinking about it some, modding the game would likely mostly involve adding new files and overwriting existing ones. I don't expect too many people will want to edit the existing files. Still, I have to rewrite the PCX to bitmap conversion anyway, so I may just write a reversal function because I'm curious about the contents of the `.RES` files myself.

Now that I finally have some example files extracted from `INTRO.RES`, I can focus on comparing apples-to-apples and figure out what's really wrong with my decompression code. It definitely is much more on-point than I thought in my last post. I think the biggest issue may be in the calculation of the back-address and run length.
