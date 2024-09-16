---
title: "The Case of the Missing PCX Palettes"
date: 2024-09-15
series: ["Modding Birthright: The Gorgon's Alliance"]
---

The BRUT project is now nearing feature parity with the original RESUTIL application, which feels fantastic. So far, the changes made by BRUT are identical to those made by RESUTIL on a binary level. The only missing feature is LZSS compression. As the test below demonstrates, overriding resources without LZSS compression is still possible.

<video controls autoplay loop muted>
  <source src="https://raw.githubusercontent.com/Shiryou/kiranwelle/master/assets/img/posts/modding_birthright/birthright-altered-intro.mp4" type="video/mp4">
</video>

The video is a little choppy, but that really shouldn't be related to the compression since the game would need to decompress the images to display them anyway. It's more likely a side effect of the screen recording software requiring a lot of CPU cycles. (Note, there's no sound in the video because it wasn't part of what I wanted to demonstrate.)

## Next Steps

My next goal with BRUT has been improving RESUTIL and making it easy to use. Some features I want to implement include, in no particular order:

* Removing files (included, but commented out, in RESUTIL)
* Replacing files in place (adding a file multiple times adds it to the end of the file over and over)
* Extracting PCX files in the original PCX format
* Building a graphical interface.

I had been talking with someone about C# interfaces anyway, so I decided to look into that first. I want to support all the same functions as the command line interface, with some quality-of-life features like a file viewer that allows users to see or hear the images and audio without extracting them.

Since previewing the PCX bitmaps and extracting the PCX files back to their original format require understanding the representation of both the PCX and bitmap formats, I decided to tackle this as soon as I had a semi-functional interface.

## Paletteless

PCX was a relatively common image format in the DOS days but has been mostly obsolete for 30 or so years outside of supporting old software like Birthright. Like many formats, PCX has undergone a few revisions, the most recent being version 5, released in 1991. This is the version used by Birthright. All the PCX files I've seen contain the same top 12 bytes.

PCX files can also store various types of color data. Anyone who played games when Birthright was new likely knows the difference between 16-color, 256-color, and 24-bit "true" color images, as that was part of the progression of graphics in the early video game industry.

The PCX format supports all of these by using palettes. A palette in image graphics lists colors defined by their red/green/blue (RGB) values. PCX stores each pixel as the location in the palette of the color it represents. The palette is in the header in images with less than 256 colors. Otherwise, it's at the end of the pixel data.

Unless you decide to store a standardized palette, the current palette is vital to represent the image properly. Despite this, RESUTIL completely ignores the palette during decompression and stores the pixel/index data alone.

Thanks to my newfound comfort with dealing with binary data, I decided to iterate through all of the PCX files I could find in my Birthright files and collect the 42 palettes. The data in them isn't relevant to this blog post, so I'm showing only an ID value for them below:

|    ID   | Count |   ID    | Count |   ID    | Count |
|:-------:|:-----:|:-------:|:-----:|:-------:|:-----:|
| 68dd0ab | 19    | 0e1665e | 8     | e15e9cc | 105   |
| 000b99f | 1     | 178230b | 4     | dcc9ada | 92    |
| 6da9c0e | 280   | 87e05be | 60    | 759b2c1 | 16    |
| b347dfd | 105   | 4ba3c3c | 20    | 43a9941 | 82    |
| cae0179 | 165   | 9c981cc | 57    | 0374e01 | 36    |
| 8118db6 | 60    | 105c0f8 | 11    | f391658 | 20    |
| d088229 | 2     | 2625f80 | 19    | 8d25927 | 41    |
| ffc0ba1 | 2     | 6c8d179 | 12    | 379e53e | 8     |
| beb608c | 3     | 047e46c | 5     | b31f664 | 28    |
| c242e11 | 2     | ef33239 | 19    | f6a63fc | 29    |
| bb8c38c | 3     | 95ba2ed | 1     | 4849d09 | 7     |
| eaf9331 | 1     | 84dbbeb | 11    | 21f36a6 | 1     |
| 09fe43d | 1     | da08ad0 | 1     | da8d83b | 1     |
| 8980b77 | 1     | bb03653 | 1     | df0ec42 | 50    |

As you can see, there is a decent distribution of files using various palettes. Without spending time carefully examining each one, it's difficult to say if these palettes differ drastically or only slightly, but I think it's clear that this could be a problem. Still, major differences should be fairly obvious while playing the game. The fact that no one seems to have noticed anything too out of place implies that this is resolved somehow.

After digging into the source, I think this may be handled by a `remap_table` and a `shading_table`. These load information from `.SHD` files that contain data that could easily be palettes. If that's the case, getting any of this working *properly* will be challenging without including the `.SHD` files.

I'm going to focus on features where I'm less likely to waste my time. Hopefully, I'll be able to revisit this in the future and resolve it.
