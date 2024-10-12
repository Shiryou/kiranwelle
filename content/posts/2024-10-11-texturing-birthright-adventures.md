---
title: "Texturing Birthright adventure maps in Doom map editors"
date: 2024-10-11
series: ["Modding Birthright: The Gorgon's Alliance"]
---

<style>
    div#imgcomp {
        margin: auto;
        width: fit-content;
    }
    article.post img {
        display: inline;
        height: 300px;
        margin: auto;
    }
</style>

In [my last post][kw-custom-adventures], I mentioned that the main Doom map editors don't have any way of loading Birthright textures. This can be fixed by creating a PWAD with all of the textures from `TEXTURES.RES`. As I shared in [The Case of the Missing PCX Palettes][kw-missing-palettes], we're able to submit PCX files to Birthright's resource files, but we're not able to get them back out in their original state. A lot of information is lost when RESUTIL or [BRUT][github-brut] convert the PCX files into Birthright's internal bitmap format. Mainly, the color palette.

I discussed trying to use one of the more common palettes as the default and that's now implemented in my development build. Even if the palette isn't 100% accurate, it seems that often the images themselves still come out identical to the original images from the source archive. While the textures from `TEXTURES.RES` aren't included in the source archive, the colors look correct after exporting all the PCX files using BRUT.

Image Magick gives an error for each file and the colors didn't turn out right when converting to PNG, but GIMP is able to read them perfectly. Sadly, Image Magick is the library I was planning to use in the BRUT GUI, so that's a roadblock I'll have to find a way around.

## How does this help us with making custom adventures in Doom map editors?

I've mostly worked with [SLADE 3][slade] and [Ultimate Doom Builder][udb], which allow us to load resources via a variety of formats. While Birthright's resource files aren't one of them, we can import the textures we got via BRUT into a PWAD file and use that as the resource instead. Below are examples of the same location in the caves beneath Malentor's Tower with a very simple PWAD loaded in both of those editors. (Quite a lighting difference!)

<div id="imgcomp">

[![image](/img/posts/modding_birthright/slade-retexturing.png)](/img/posts/modding_birthright/slade-retexturing.png)[![image](/img/posts/modding_birthright/udb-retexturing.png)](/img/posts/modding_birthright/udb-retexturing.png)

</div>

I wasn't able to load the PCX images, possibly for a similar reason to Image Magick, but the [Batch Image Manipulation Plugin][gimp-bimp] for GIMP was able to convert everything to PNG. From there, I was able to load the textures properly into the PWAD file.

Once I have the rotation code completed, I'll temporarily upload a PWAD containing all of the adventure textures so that editing adventures is more pleasant. This will be a holdover until I can have BRUT generate the PWAD, since I want to avoid hosting those textures longterm.

At that point, I'll have to find some time to actually play through and explore each adventure to find any interesting notes (like teleports and text scrolls) to put together a modding reference page.

[gimp-bimp]: http://alessandrofrancesconi.it/projects/bimp/
[github-brut]: https://github.com/Shiryou/brut
[kw-custom-adventures]: {{< ref "posts/2024-10-07-creating-custom-adventures-birthright.md" >}} "Creating Custom Adventures for Birthright: The Gorgon's Alliance"
[kw-missing-palettes]: {{< ref "posts/2024-09-15-case-missing-pcx-palettes.md" >}} "The Case of the Missing PCX Palettes"
[slade]: https://slade.mancubus.net/
[udb]: https://ultimatedoombuilder.github.io/