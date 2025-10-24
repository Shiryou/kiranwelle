---
title: "Creating Custom Adventures for Birthright: The Gorgon's Alliance"
date: 2024-10-07
categories: [Birthright]
tags: [BRUT]
series: ["modding-birthright-the-gorgons-alliance"]
---

Implementing LZSS compression in [BRUT][github-brut] is still on my task list. I've written out a first draft of the algorithm, which is giving me some trouble. I hope to get that implemented soon. Since I've been staring at assembly language far too much, I decided to dig deeper into what we know about Birthright's adventures, especially how they're defined, referenced, and loaded. In the future, I'll build a reference page to make finding some of the technical information necessary for proper level building easier.

Let's start with the most significant question up front:

## Can we create custom adventures and play them in Birthright?

Yes! Birthright allows a total of 50 adventures to be loaded. The default adventure list, containing 26 adventures, is hard-coded. These hard-coded adventures are the only ones that can be tied to a location in the game. There is then room to add 24 custom adventures. These adventures appear by default on the Adventure action screen when you start a "Full Game," regardless of difficulty.

For a custom adventure to work, you only need four files:

* `SCENES\ADVENTR.SCN`: The scene file, which defines the quest objective, the WAD file to load, and some other options
* `WADS\ADVENTR.WAD`: The adventure, including the map, items, enemies, etc.
* `TEXT\ADVENTR.TXT`: The description for the adventure screen
* `UI\ADVSCN\ADVENTR.PCX`: The title image for the adventure screen (alternatively, you can add the file to `TEXTURES.RES`)

All files should be no longer than eight characters, plus the extension. This is an old DOS limitation that lives on in WINBR.

Custom adventures will appear on the Adventures screen in a Full Game (regardless of difficulty). Your adventure will get its name from the WAD filename and will not have a suggested level.

![image](/img/posts/modding_birthright/birthrt-custom-adventure.png)

### Scenes

"Scene" files (`.SCN`) are Birthright's entry into custom adventures, including the WAD filename, quest goal "thing," background music, and sky box. User adventures are `.SCN` files containing the lines:

    [Type]
    1

The scene file is the only part of a custom adventure that doesn't need to have the same name as the rest of the files. The only use I can see for this is to re-use an adventure with a different quest item or sky box.

### WADs

[WAD][doomwiki-wad] (technically PWAD in this case) is a data file format originally defined for use in the Doom game engine. Birthright uses an engine called Nova that uses the same file format for storing levels. In Doom, resources like textures are loaded from internal WADs, whereas Nova loads them from `TEXTURES.RES`. This means that many Doom level editors can't display Birthright's textures properly.

![image](/img/posts/modding_birthright/slade-textures.png)

If there is enough interest in creating custom adventures, we can submit patches to the popular Doom level editors to add support for Birthright's textures.

The (in DOOM WAD terms) "Things"&mdash;enemies, decorative items, treasure, etc.&mdash;are referenced only by numbers. These numbers come from hard-coded definitions, so adding new enemies, spells, or items is impossible. The list of available Things is in [`THINGTYP.H`][github-things].

![image](/img/posts/modding_birthright/slade-things.png)

### Descriptions

The `.TXT` files contain text for the adventure description in the Adventure and Advisors screens, including some customization for font styles, as below. Italics are an option in the code, but they don't seem to do anything. Word wrap gave me the most trouble and seemed a bit wonky.

    ^F02^W304^F02Font testing F00. ^F04Font testing F04. ^F05Font testing F05. ^F09Font testing F09. ^F16Font testing F16.
    ^F02^W400^F02^T0T Tran^T1sluc^T2ent ^T3text^T4 T. ^T0^UUnderlined text U.^U ^BBold text B. ^B^IItalicized text I.^I
    ^C001Color testing C001. ^C031Color testing C031. ^C064Color testing C064. ^C120Color testing C120. ^C136Color testing C136. ^C188Color testing C188.
    ^F02^C001Testing word wrap at a specific width in pixels. The quick brown fox jumps over the lazy dog. Testing text length W304.
    ^W325Testing word wrap at a specific width in pixels. Testing text W325.
    ^W250Testing word wrap at a specific width in pixels W250.

![image](/img/posts/modding_birthright/birthrt-custom-text.png) 

### Title Image

The title image is a 432 x 233 pixel PCX image either stored in `TEXTURES.RES` or `UI\ADVSCN` with a filename corresponding to the adventure name. If you intend to share your adventure with others, you should put your title image into `UI\ADVSCN`, so it is easy to put the entire adventure into a file archive and extract it to the right location without affecting anything else.

![image](/img/posts/modding_birthright/userpic.png)

## Battle Maps

While unrelated to adventures, Birthright's maps for battles are also WAD files. You can load them into an adventure and take a stroll around. They might be useful for getting comfortable modding, as they already define some terrain you can build on top of.

![image](/img/posts/modding_birthright/birthrt-battlemap-adventure.png)

Battle map `.SCN` filenames are hard-coded, and there are 4 maps per terrain type. For example, `BATLM0.SCN` is the first mountain battle map.

The four categories are:

* W = Woods
* P = Plains
* M = Mountains
* S = Swamp

[doomwiki-wad]: https://doomwiki.org/wiki/WAD
[github-brut]: https://github.com/Shiryou/brut
[github-things]: https://gist.github.com/Shiryou/d6e4d9889777a192998cfba0866bcddf