---
title: "Birthright: The Gorgon's Alliance Modding Reference"
description: "Reference information for creating new adventures, modifying textures, and other modding."
url: /birthright/modding-reference
cover_image: img/posts/birthright/cover-title.jpg
type: page
show_toc: true
comments: true
date: 2024-10-15
categories: [Birthright]
---
<style>
table {
    margin: auto;
}
table, th, td {
    border: 1px solid silver;
}
th, td {
    padding: 0px 5px;
}

.reference-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}
.reference-table {
    margin: 10px;
    display: block;
    flex-grow: 0;
    flex-shrink: 0;
}
.reference-table table {
    width: 300px;
}
.reference-table h3 {
    text-align: center;
}
</style>
<article>

Reference information for creating new adventures, modifying textures, and other modding. This may get split into multiple documents in the future. It is currently under construction and may change often.

<div id="toc"></div>

## Definitions

**Thing**
: A collectible object, decoration, or person in an adventure. This term comes from Doom's [WAD format][anchor-wad], which is used for adventure maps.

**Pascal case**
: Text formatted with no spaces, and capitalizing the first letter of each word. Ex: `QuestTypeThing`.

## Setting up a development environment

There are several options for building Doom levels. My testing has mostly been done using [SLADE 3](https://slade.mancubus.net/) and the [ZenNode](https://www.mrousseau.org/programs/ZenNode/archives/) (v1.2.1) node builder. Here is information on the setup I use for you to replicate if you chose.

To duplicate my setup, install Slade 3 and unzip ZenNode to a permanent place. Then, follow these steps:

1. Open SLADE.
2. Ignore these steps for now. I'm still working on the feature in BRUT that will build *Birthright.wad*.
    1. Click *Edit* &rarr; *Set Base Resource Archive*.
    2. Click the *Add Archive* button.
    3. Find and open *Birthright.wad*, then click *OK*.
5. Click *Edit* &rarr; *Preferences…*.
6. Expand *Map Editor*, then select *Node Builder*.
7. Set the *Node Builder:* field to *ZenNode*.
8. Click *Browse* and find and open *ZenNode.exe*.
9. In the *Options* section, check *Vanilla Optimized*, and click *OK*.

## Testing maps
You can launch directly into your WAD when starting Birthright by using the following command line options:

    WINBR.EXE w C:\BIRTHRT\WADS\MYWAD.WAD

There will be no sound, actions, or living enemies, but you can wander around the map live in the game. These features come from [the scene file][anchor-scene], which isn't loaded this way.

If you use [Ultimate Doom Builder](https://ultimatedoombuilder.github.io/), you can configure the "Test Map" feature to run your map directly in Birthright. 

1. Go to *Tools* &rarr; *Game Configurations* &rarr; *Testing*.
2. Click the `+` button to add a new testing engine.
3. Give the egine a name and browse to `WINBR.EXE` on your computer.
4. Check *Customize parameters*.
5. Enter `w %F` into the *Parameters* field and check the checkbox for *Use short paths and file names (MSDOS 8.3 format)*.

SLADE unfortunately uses path variables with quotes and Linux-style path separaters, which Birthright doesn't understand.

## Format documentation: Adventure maps (`.WAD`)
The WAD file format (Birthright uses vanilla PWADs) was created to store game data for Doom and the Doom family of games. It is a well defined file type. Please review the format information on [DoomWiki][doomwiki-wad].

*Note: Birthright uses PWADs and does not have an IWAD. See [Setting up a development environment][anchor-environment] for more information.*

## Format documentation: Scenes (`.SCN`)
Scene files use a format that resembles [INI files](https://en.wikipedia.org/wiki/INI_file). There are many options listed in the template that may not be usable, as they refer to a World Map feature that seems absent from the game.

Scene files appear to be the entry point into Dynamix's Nova engine. They are used for adventures and battles. `SCENES\TEMPLATE.SCN` contains developer documentation on the scene file format, but it is unclear how up to date this documentation is. For this reason, there are keywords mentioned in that file that are not referenced here.

### Comments
Comments must be placed on an empty line, starting with the number sign (`#`). If a scene file is edited using the scene editor (`SCENED`), all comments are lost.

### Keywords
Keywords are variable names written using Pascal casing (ex: `QuestThingType`). These are used by Nova to initialize adventures.

#### Required keywords
* **Version:** Always 1.0

#### Optional keywords
* **Type:**
    * **1:** A custom adventure.
* **Music:**
* **Demo:**
* **Panorama:**
* **QuestThingType:** The [Thing ID][anchor-thing-reference] of the item that will complete the quest. This must come before `[Wad]`.
* **Wad:** The [WAD file][anchor-wad] to load. Only one WAD file can be loaded per scene.
* **Exit:** A list of exit line IDs and the scene to move to. This is used to link different WADs together. Each WAD needs a corresponding scene file.
* **Pallet:** The PCX palette to use to load textures.

#### Mod-heavy keywords
These keywords can be used in custom adventures, but require making modifications to more game assets. This would be useful for total conversions where the resource files are already being replaced.

* **Notes:** Notes are scrolls in an adventure that can be opened to read a message inside. These reference messages found in `STRDAT.DAT`.
* **OpeningDialog:** This opens a dialog at the start of the adventure with the indicated message found in `STRDAT.DAT`.

## Format documentation: Descriptions (`.TXT`, `.ADV`)

## Format documentation: Character stats (`.AVA`)

## Format documentation: Resources (`.RES`)
&nbsp;
: *The resource file management software and its associated C# library [BRUT][github-brut] can be used to manage resource files.*

Resource files hold most of the images, textures, UI elements, animations, and sounds used in the game. They are similar to ZIP files.

Files are stored either uncompressed or compressed via LZSS. PCX files are pre-processed and uncompressed into a bitmap format (not the standard BMP file) before being compressed with LZSS and stored.

*Note: It is impossible to restore PCX files losslessly, as resource files do not store some file metadata, including the color palette. A standardized set of color palettes is used internally. BRUT uses the most common palette to attempt to recover these files.*

The files begin with a file header describing the file version, the number of resources contained within, and the offset of the directory.

| Offset hex | Bytes | Purpose |
|------------|------|---------|
| 0          | 4    | File version. Only resource files with version 4 are included in the production copy. |
| 4          | 4    | Directory offset. |
| 8          | 4    | The number of resources contained in the resource file. |

The directory contains one meta entry for each resource contained in the file.

**Hash**
: The entry begins with a hash that identifies the file. This has is either generated from a "CRC" of the filename (case sensitive) plus a null byte, or by copying an ID number directly from the filename.

**Extension identifier**
: The list of supported extensions is hard-coded into Birthright as an array. The extension identifier is the index of the file's extension in that array.

| Offset hex | Bytes | Purpose |
|------------|------|---------|
| dir_offset + 0 | 4 | A hash to identify the entry. |
| dir_offset + 4 | 4 | File offset. |
| dir_offset + 8 | 1 | Extension identifier |
| dir_offset + 9 | 4 | Filename |

Each file is then stored as follows:

**Resource identifier**
: The resource identifier is the integer representation of the string "RSRC".

| Offset hex | Bytes | Purpose |
|------------|------|---------|
| file_offset + 0 | 4 | A resource identifier (1129468754) |
| file_offset + 4 | 4 | The full size of the resource (header + content) |
| file_offset + 8 | 4 | Compressed size (content) |
| file_offset + 12 | 4 | Uncompressed size (expected) |
| file_offset + 16 | 4 | Hash of filename (matches directory entry) |
| file_offset + 20 | 1 | Flags (see below) |
| file_offset + 21 | 1 | Type of compression used (none or LZSS) |
| file_offset + 22 | 1 | Extension identifer (matches directory entry) |
| file_offset + 23 | 4 | Filename |
| file_offset + 27 | \* | The content of the file |

The original `RESUTIL` used to create the resource files allowed adding the same file multiple times, appending it each time. Retrieving the file would only reference the first instance.

## Thing reference
Each Thing has an ID number, which is used to all things related to it. (Art, descriptions, etc.) Troops are presumably used in the battle maps. They don't seem to appear when used in adventures.

<span class="reference-container">
<span class="reference-table">

### Environment features

| Thing | ID |
|-------|----|
| Chandelier 1 | 153 |
| Column 1 | 155 |
| Column 2 | 156 |
| Statue 1 | 167 |
| Statue 2 | 168 |
| Stool 1 | 169 |
| Table 1 | 171 |
| Wall Torch 1 | 173 |
| Vase 1 | 174 |
| Fountain 1 | 175 |
| Bush 1 | 176 |
| Tree 1 | 177 |
| Tree 2 | 178 |
| Wall Torch 2 | 179 |
| Dungeon Column | 180 |
| Cave Column 1 | 181 |
| Bizarre Column 1 | 182 |
| Marble Column | 183 |
| Stalactite 1 | 184 |
| Stalactite 2 | 185 |
| Stalactite 3 | 186 |
| Bizarre Stalactite 1 | 187 |
| Stalagmite 1 | 188 |
| Stalagmite 2 | 189 |
| Cave Rock 1 | 190 |
| Cave Rock 2 | 191 |
| Cave Rock 3 | 192 |
| Bizarre Rock | 193 |
| Dungeon Rubble | 194 |
| Cave Rubble | 195 |
| Statue 3 | 196 |
| Torch 2 | 197 |
| Hanging Chains 1 | 198 |
| Smashed Barrel 1 | 206 |
| Empty Chest | 207 |
| Candelabra 1 | 209 |
| Candelabra 2 | 210 |
| Broken Vase 1 | 215 |
| Vase 2 | 216 |
| Broken Vase 2 | 217 |
| Vase 3 | 218 |
| Broken Vase 3 | 219 |
| Table 2 | 220 |
| Table 3 | 221 |
| Stool 2 | 222 |
| Stool 3 | 223 |
| Potted Plant 2 | 224 |
| Potted Plant 3 | 225 |
| Statue 4 | 226 |
| Torch 3 | 227 |

</span>
<span class="reference-table">

### Environment features (cont)

| Thing | ID |
|-------|----|
| Bizarre Column 2 | 230 |
| Cave Column 2 | 231 |
| Bizarre Stalactite 2 | 232 |
| Tree 3 | 233 |
| Tree 4 | 234 |
| Tree 5 | 235 |
| Tree 6 | 236 |
| Tree 7 | 237 |
| Tree 8 | 238 |
| Tree 9 | 239 |
| Tree 10 | 240 |
| Tree 11 | 241 |
| Tree 12 | 242 |
| Tree 13 | 243 |
| Tree 14 | 244 |
| Stmp 1 | 245 |
| Stmp 2 | 246 |
| Thorn 1 | 247 |
| Bush 2 | 248 |
| Bush 3 | 249 |
| Bush 4 | 250 |
| Bush 5 | 251 |
| Bush 6 | 252 |
| Bush 7 | 253 |
| Forest Column 1 | 254 |
| Forest Column 2 | 255 |
| Evil Column 1 | 256 |
| Twig 1 | 257 |
| Evil Column 2 | 258 |
| Evil Chandelier | 259 |
| Leaf 1 | 260 |
| Leaf 2 | 261 |
| Leaf 3 | 262 |
| Rock 5 | 266 |
| Rock 6 | 267 |
| Rock 7 | 268 |
| Rock 8 | 269 |
| Barrel 3 | 270 |
| Statue 6 | 271 |
| Fire 2 | 272 |
| Fire 3 | 273 |
| Fire 4 | 274 |
| Fire 5 | 275 |
| Torch 5 | 276 |
| Statue 5 | 277 |
| Vase 7 | 278 |
| Vase 8 | 279 |
| Rock 9 | 425 |
| Rock 10 | 426 |
| Bush 8 | 427 |

</span>
<span class="reference-table">

### Environment features (cont)

| Thing | ID |
|-------|----|
| Bush 9 | 428 |
| Bush 10 | 429 |
| Bush 11 | 430 |
| Bush 12 | 431 |
| Tree 15 | 432 |
| Tree 16 | 433 |
| Tree 17 | 434 |
| Tree 18 | 435 |
| Tree 19 | 436 |
| Tree 20 | 437 |
| Corpse 1 | 438 |
| Hay Pile 1 | 439 |
| Gargoyle Statue | 440 |
| Refuse Pile | 441 |
| Gravestone 1 | 443 |
| Gravestone 2 | 444 |
| Gravestone 3 | 445 |

### Hints

| Thing | ID |
|-------|----|
| Hint 1 | 561 |
| Hint 2 | 562 |
| Hint 3 | 563 |
| Hint 4 | 564 |
| Hint 5 | 565 |

### Keys

| Thing | ID |
|-------|----|
| Key Silver | 199 |
| Key Tiny | 200 |
| Key Red | 201 |
| Key Blue | 202 |
| Key Jeweled | 203 |
| Key White | 204 |
| Key Skeleton | 205 |
| Key Black | 318 |
| Key Bone | 319 |
| Key Stone | 320 |

### Treasures

| Thing | ID |
|-------|----|
| Treasure Chest | 208 |
| Gold Coins 1 | 228 |
| Gold Coins 2 | 229 |
| Gold Coins 3 | 263 |
| Gold Coins 4 | 264 |
| Gold Coins 5 | 265 |

</span>
<span class="reference-table">

### Characters

| Thing | ID |
|-------|----|
| Gargoyle | 15 |
| Otyugh | 17 |
| Archer | 20 |
| Light Cavalry | 21 |
| Elite Infantry | 22 |
| Infantry | 23 |
| Irregular | 24 |
| Knight/Heavy Cavalry | 25 |
| Officer | 27 |
| Pikeman | 28 |
| Dwarf Archer | 38 |
| Dwarf Infantry | 39 |
| Elf Archer | 42 |
| Elf Officer 2 | 43 |
| Elf Infantry | 44 |
| Elf Officer 1 | 45 |
| Goblin Archer | 47 |
| Goblin Cavalry | 48 |
| Goblin Infantry | 49 |
| Mercenary Infantry | 55 |
| Mercenary Officer | 57 |
| Mercenary Pikeman | 58 |
| Wizard Male 4 | 60 |
| Wizard Male 3  | 63 |
| Chief | 65 |
| Lord Male 4 | 66 |
| Lord Male 5 | 67 |
| Guard | 68 |
| Lieutenant | 69 |
| Guilder Male 1 | 70 |
| Guilder Male 2 | 71 |
| Lord Male 6 | 74 |
| Priest Male 1 | 75 |
| Priest Male 2 | 76 |
| Priest Female 1 | 77 |
| Elf Lady Lord | 79 |
| Elf Lord 1 | 81 |
| Rogue | 83 |
| Royal Guard | 84 |
| Lord Male 7 | 86 |
| Guilder Female | 87 |
| Dwarf Lord 3 | 88 |
| Dwarf Lord 2 | 89 |
| Goblin Lord 1 | 90 |
| Warrior | 91 |
| Goblin Queen | 92 |
| Wizard Female 1 | 93 |
| Wizard Female 2 | 94 |
| Wizard Male 1 | 95 |
| Wizard Male 2 | 96 |

</span>
<span class="reference-table">

### Characters (cont)

| Thing | ID |
|-------|----|
| Lord Female 1 | 98 |
| Lord Female 2 | 99 |
| Lord Female 3 | 100 |
| Lord Male 1 | 101 |
| Lord Male 2 | 102 |
| Dwarf Lord 1 | 116 |
| Dwarf Guard | 117 |
| Lord Male 3 | 103 |
| Elf Guard | 119 |
| Elf Lord 2 | 120 |
| Gnoll 1 | 121
| Gnoll Irregular | 122
| Goblin Guard | 124 |
| Goblin Zombie | 125
| Ankheg | 126 |
| Wyvern 2 | 127
| Wraith  | 128 |
| Dog | 129 |
| Harpy | 131 |
| Hell Hound | 132 |
| Ogre | 133 |
| Skeleton | 135 |
| Spectre | 136 |
| Giant Spider | 138 |
| Wyvern 1 | 139 |
| Zombie | 140 |
| Giant Spider on ceiling  | 141 |
| Assassin | 145
| Infantry Intro | 147 |
| Royal Guard Intro | 148 |
| Lord Throne | 149 |

### Fiends

| Thing | ID |
|-------|----|
| Gorgon | 130 |
| Rhuobhe Manslayer | 134 |
| Spider King | 137 |
| Molth Kambar | 566 |
| Kast Ekctral | 567 |
| Baubb The Toymaker | 568 |
| Endaeral Cathbirn | 569 |
| Spawn Of The Chimaera | 570 |
| Nhoun The Elf | 571 |
| Tieskar Graecher | 572 |
| Lesser Spectre | 573 |
| Lesser Wraith | 574 |
| Ioun Heart | 581 |
| Ioun Fist | 582 |

</span>
<span class="reference-table">

### Magical items

| Thing | ID |
|-------|----|
| Potion of Fire Resistance | 164 |
| Scroll of Armor Enhancement 1 | 165 |
| Potion of Extra Healing | 211 | 
| Key of Opening | 212 | 
| Potion of Healing | 213 | 
| Potion of Flying | 214 | 
| Amulet of Feather Fall | 280 |
| Amulet of Speed | 281 |
| Amulet of Striding And Springing | 282 |
| Amulet Versus Undead | 283 |
| Amulet of Water Walking | 284 |
| Amulet of Inspiration | 285 |
| Balm of Healing | 286 |
| Tome of Mystic Magics | 287 |
| Book of Exalted Deeds | 288 |
| Book of Vile Darkness | 289 |
| Tome of Sorcerors Lore | 290 |
| Chime of Opening | 291 |
| Cloak of Protection 1 | 292 |
| Cloak of Protection 2 | 293 |
| Cloak of Protection 3 | 294 |
| Tome of The High Wizards | 295 |
| Tome of The Mage Lords | 296 |
| Gauntlets of Dexterity | 297 |
| Gauntlets of Ogre Power | 298 |
| Gem of Attraction | 299 |
| Gem Blue | 300 |
| Gem Green | 301 |
| Gem of Passage | 302 |
| Gem of Shifting | 304 |
| Ioun Stone Pale Blue | 306 |
| Ioun Stone Scarlet And Blue | 307 |
| Ioun Stone Incandescent Blue | 308 |
| Ioun Stone Deep Red | 309 |
| Ioun Stone Pink | 310 |
| Ioun Stone Pink And Green | 311 |
| Ioun Stone Pearly White | 313 |
| Spell Scroll 1 | 314 |
| Spell Scroll 2 | 315 |
| Spell Scroll 3 | 316 |
| Ioun Stone Dusty Rose | 317 |
| Librium of Gainful Conjuration | 321 |
| Librium of Ineffable Damnation | 322 |
| Librium of Silver Magic | 323 |
| Oil of Sharpness 1 | 327 |
| Oil of Sharpness 2 | 328 |
| Oil of Sharpness 3 | 329 |
| Oil of Sharpness 4 | 330 |
| Oil of Sharpness 5 | 331 |

</span>
<span class="reference-table">

### Magical items (cont)

| Thing | ID |
|-------|----|
| Potion of Hill Giant Strength | 334 |
| Potion of Stone Giant Strength | 335 |
| Potion of Frost Giant Strength | 336 |
| Potion of Fire Giant Strength | 337 |
| Potion of Cloud Giant Strength | 338 |
| Potion of Storm Giant Strength | 339 |
| Potion of Titan Strength | 340 |
| Potion of Diminution | 342 |
| Potion of Invulnerability | 344 |
| Potion of Levitation | 345 |
| Ring of Feather Falling | 346 |
| Ring of Fire Falling | 347 |
| Ring of Jumping | 349 |
| Ring of Protection 1 | 350 |
| Ring of Protection 2 | 351 |
| Ring of Protection 3 | 352 |
| Ring of Protection 4 | 353 |
| Ring of Regeneration | 354 |
| Ring of Resistance 1 | 355 |
| Ring of Resistance 2 | 356 |
| Ring of Resistance 3 | 357 |
| Ring of Wizardry | 358 |
| Ring of Nightvision | 359 |
| Scroll of Armor Enhancement 2 | 363 |
| Scroll of Armor Enhancement 3 | 364 |
| Scroll of Armor Enhancement 4 | 365 |
| Scroll of Armor Enhancement 5 | 366 |
| Staff of Curing | 368 |
| Vial of Holy Water | 372 |
| Potion Of Poison Cure | 424 |

### Items

| Thing | ID |
|-------|----|
| Barrel 1 | 150 |
| Bowl 1 | 151 |
| Bucket1 | 152 |
| Candle 1 | 154 |
| Cup 1 | 157 |
| Fire 1 | 158 |
| Flagon 1 | 159 |
| Helmet 1 | 160 |
| Knife 1 | 161 |
| Plate 1 | 162 |
| Potted Plant 1 | 163 |
| Spear 1 | 166 |
| Sword 1 | 170 |

</span>
<span class="reference-table">

### Quest items

| Thing | ID |
|-------|----|
| Tome of the Prince | 172
| Dierdriens Ring | 360 |
| Faeles Ring | 361 |
| Rod of Resurrection | 362 |
| Gavelons Staff of Prosperity | 370 |
| Banner of Roele | 383 |
| Barazads Tools | 384 |
| Brennas Favor | 386 |
| Chalice of The Dead | 387 |
| Crown of Command | 388 |
| State Crown of Anuire | 389 |
| Danicas Crystal of Scrying | 390 |
| Emperors Crown | 391 |
| Farids Coffer of The Realm | 392 |
| Hammer of Thunder | 393 |
| Robes of The Mases | 395 |
| Regalia of Empire | 396 |
| Sielshegh Gem Large | 397 |
| Sielshegh Gem Medium | 398 |
| Sword of Roele | 399 |
| Sceptre of Cuiraecen | 400 |
| Corgandals Staff | 401 |
| Nappolans Tome of War | 402 |
| Torc of Splendor | 403 |
| Vaubenels Book of Fortification | 404 |
| Candle of Invocation | 405 |
| Prince Rop | 406 |
| Goblin King Rop | 407 |
| Gorgons Banner | 442 |

### Items with charges

| Thing | ID |
|-------|----|
| Necklace of Missiles 8 | 325 |
| Wand of Enemy Detection 3 | 373 |
| Wand of Fire 3  | 375 |
| Wand of Frost 3 | 377 |
| Wand of Illumination 3 | 378 |
| Wand of Lightning 3 | 379 |
| Wand of Magic Detection 3 | 380 |
| Wand of Paralyzation 3 | 381 |
| Wand of Secret Detection 3 | 382 |
| Necklace of Missiles 7 | 668 |
| Necklace of Missiles 6 | 669 |
| Necklace of Missiles 5 | 670 |
| Necklace of Missiles 4 | 671 |
| Necklace of Missiles 3 | 672 |
| Necklace of Missiles 2 | 673 |
| Necklace of Missiles 1 | 674 |
| Wand of Enemy Detection 2 | 675 |
| Wand of Enemy Detection 1 | 676 |
| Wand of Fire 2 | 677 |

</span>
<span class="reference-table">

### Items with charges (cont)

| Thing | ID |
|-------|----|
| Wand of Fire 1 | 678 |
| Wand of Frost 2 | 679 |
| Wand of Frost 1 | 680 |
| Wand of Illumination 2 | 681 |
| Wand of Illumination 1 | 682 |
| Wand of Lightning 2 | 683 |
| Wand of Lightning 1 | 684 |
| Wand of Magic Detection 2 | 685 |
| Wand of Magic Detection 1 | 686 |
| Wand of Paralyzation 2 | 687 |
| Wand of Paralyzation 1 | 688 |
| Wand of Secret Detection 2 | 689 |
| Wand of Secret Detection 1 | 690 |

### Blood Abilities

| Thing | ID |
|-------|----|
| Alertness | 601 |
| Alter Appearance | 602 |
| Animal Affinity | 603 |
| Battlewise | 604 |
| History | 605 |
| Bloodmark | 606 |
| Character Reading | 607 |
| Courage | 608 |
| Detect Lie | 609 |
| Detect Illusion | 610 |
| Direction Sense | 611 |
| Divine Aura | 612 |
| Divine Wrath | 613 |
| Elemental Control | 614 |
| Enhanced Sense | 615 |
| Fear | 616 |
| Healing | 617 |
| Heightened Ability | 618 |
| Iron Will | 619 |
| Persuasion | 620 |
| Poison Sense | 621 |
| Protection From Evil | 622 |
| Regeneration | 623 |
| Resistance | 624 |
| Shadow Form | 625 |
| Touch Of Decay | 626 |
| Travel | 627 |

### Priestly Realm Spells

| Thing | ID |
|-------|----|
| Bless Land 1 | 463 |
| Bless Army 1 | 464 |
| Blight 1 | 465 |
| Dispel Realm Magic Pr 1 | 466 |
| Honest Dealing 1 | 467 |
| Investiture 1 | 468 |

</span>
<span class="reference-table">

### Realm Spells

| Thing | ID |
|-------|----|
| Alchemy 1 | 450 |
| Death Plague 1 | 451 |
| Demagogue 1 | 452 |
| Dispel Realm Magic 1 | 453 |
| Legion Of Dead 1 | 454 |
| Mass Destruction 1 | 455 |
| Raze 1 | 456 |
| Scry 1 | 457 |
| Stronghold 1 | 458 |
| Subversion 1 | 459 |
| Summoning 1 | 460 |
| Transport 1 | 461 |
| Warding 1 | 462 |

### Priest Spells

| Thing | ID |
|-------|----|
| Cure Light 1 | 469 |
| Detect Evil 1 | 470 |
| Detect Magic Pr 1 | 471 |
| Light Pr 1 | 472 |
| Shillelagh 1 | 473 |
| Turn Undead 1 | 474 |
| Barkskin 1 | 475 |
| Find Traps 1 | 476 |
| Find Treasure 1 | 477 |
| Resist Fire 1 | 478 |
| Spiritual Hammer 1 | 479 |
| Magical Vestament 1 | 480 |
| Water Walk 1 | 481 |
| Cure Serious 1 | 482 |
| Prot From Evil 1 | 483 |
| Cure Critical 1 | 484 |
| Flame Strike 1 | 485 |
| True Seeing 1 | 486 |
| Heal 1 | 487 |
| Fire Storm 1 | 488 |
| Holy Word 1 | 489 |
| Resurrection 1 | 490 |

### Wizard Spells

| Thing | ID |
|-------|----|
| Arrows | 408 |
| Fireball 1 | 409 |
| Lores Fireball 1 | 410 |
| Plasma Ball 1 | 411 |
| Lores Plasma Ball 1 | 412 |
| Plasma Streak 1 | 413 |
| Plasma Ball 2 | 414 |
| Lores Plasma Streak 1 | 415 |
| Lores Plasma Ball 2 | 416 |
| Lightning 1 | 417 |
| Lores Lightning 1 | 418 |

</span>
<span class="reference-table">

### Wizard Spells (cont)

| Thing | ID |
|-------|----|
| Vaporize 1 | 419 |
| Lores Vaporize 1 | 420 |
| Crumble 1 | 421 |
| Lores Crumble 1 | 422 |
| Chain Lightning 2 | 423 |
| Detect Magic 1 | 497 |
| Feather Fall 1 | 498 |
| Jump 1 | 499 |
| Light 1 | 500 |
| Magic Missile 1 | 501 |
| Reduce 1 | 502 |
| Shocking Grasp 1 | 503 |
| Blindness 1 | 504 |
| Continual Light 1 | 505 |
| Knock 1 | 506 |
| Levitate 1 | 507 |
| Locate Object 1 | 508 |
| Poison Arrow 1 | 509 |
| Strength 1 | 510 |
| Fly 1 | 512 |
| Stone Undead 1 | 513 |
| Infravision 1 | 514 |
| Lightning Bolt 1 | 515 |
| Confusion 1 | 516 |
| Ice Storm 1 | 517 |
| Minor Globe Invuln 1 | 518 |
| Stoneskin 1 | 519 |
| Cone Of Cold 1 | 520 |
| Disintigrate 1 | 521 |
| Teleport 1 | 522 |
| Chain Lightning 1 | 523 |
| Death 1 | 524 |
| Globe Invuln 1 | 525 |
| Flesh To Stone 1 | 526 |
| Improved Firebal 1 | 527 |
| Power Stun 1 | 528 |
| Power Blind 1 | 529 |
| Spell Immunity 1 | 530 |
| Meteor Swarm 1 | 531 |
| Power Kill 1 | 532 |
| Time Stop 1 | 533 |

### Troops

| Thing | ID |
|-------|----|
| Troop Gargoyle | 16 |
| Troop Otyugh | 18 |
| Troop Lord Male 1 | 26 |
| Troop Wyvern1 | 29 |
| Troop Ankheg | 30 |
| Troop Ogre | 31 |
| Troop Hell Hound | 32 |

</span>
<span class="reference-table">

### Troops (cont)

| Thing | ID |
|-------|----|
| Troop Harpy | 33 |
| Troop Skeleton | 34 |
| Troop Giant Spider | 35 |
| Troop Spectre | 36 |
| Troop Wraith | 37 |
| Troop Dwarf Officer 1 | 40 |
| Troop Dwarf Officer 2 | 41 |
| Troop Dwarf Officer 3 | 46 |
| Troop Goblin Zombie | 50 |
| Troop Goblin Officer | 51 |
| Troop Goblin Queen | 52 |
| Troop Zombie | 53 |
| Troop Ceiling Spider | 54 |
| Troop Elf Lady Lord | 56 |
| Troop Dog | 59 |
| Troop Wizard Male 4 | 61 |
| Troop Lord Male 2 | 62 |
| Troop Lord Male 3 | 64 |
| Troop Lord Male 4 | 72 |
| Troop Lord Male 5 | 73 |
| Troop Lord Male 6 | 78 |
| Troop Lord Male 7 | 80 |
| Troop Lord Female 1 | 82 |
| Troop Guilder Female | 85 |
| Troop Lord Female 2 | 104 |
| Troop Lord Female 3 | 105 |
| Troop Wizard Female 1 | 106 |
| Troop Wizard Female 2 | 107 |
| Troop Wizard Male 1 | 108 |
| Troop Wizard Male 2 | 109 |
| Troop Wizard Male 3 | 111 |
| Troop Guilder Male 1 | 112 |
| Troop Guilder Male 2 | 113 |
| Troop Priest Male 1 | 114 |
| Troop Priest Male 2 | 115 |
| Troop Priest Female 1 | 118 |
| Troop Wyvern 2 | 123 |
| Troop Manslayer | 142 |
| Troop Gorgon | 143 |
| Troop Spider King | 144 |
| Troop Assassin | 146 |
| Merc Archer | 551 |
| Merc Cavalry | 552 |
| Elf Cavalry | 553 |
| Levy | 554 |
| Scout | 555 |
| Merc Irregular | 556 |
| Cav Horse | 557 |
| Knight Horse | 558 |

</span>
<span class="reference-table">

### "lores art for battle 8Meg version"

| Thing | ID |
|-------|----|
| LORES_A_BOW | 628 |
| LORES_A_CAV | 629 |
| LORES_A_EIN | 630 |
| LORES_A_INF | 631 |
| LORES_A_IRR | 632 |
| LORES_A_KNT | 633 |
| LORES_A_OFF | 634 |
| LORES_A_PIK | 635 |
| LORES_M_INF | 636 |
| LORES_M_OFF | 637 |
| LORES_M_PIK | 638 |
| LORES_D_INF | 639 |
| LORES_D_BOW | 640 |
| LORES_D_OFF | 641 |
| LORES_E_BOW | 642 |
| LORES_E_INF | 643 |
| LORES_E_OFF | 644 |
| LORES_G_BOW | 645 |
| LORES_G_CAV | 646 |
| LORES_G_INF | 647 |
| LORES_G_OFF | 648 |
| LORES_C_SKL | 649 |
| LORES_C_SPD | 650 |
| LORES_N_IRR | 651 |
| LORES_G_ZOM | 652 |
| LORES_C_HPY | 653 |
| LORES_C_HEL | 654 |
| LORES_C_ZOM | 655 |
| LORES_C_WYV | 656 |
| LORES_C_WYV2 | 657 |
| LORES_C_OGR | 658 |
| LORES_C_ANK | 659 |
| LORES_C_WTH | 660 |
| LORES_C_SPC | 661 |
| LORES_C_SPD2 | 662 |
| LORES_C_DOG | 663 |
| LORES_C_GRG | 664 |
| LORES_C_OTY | 665 |
| LORES_CAV_HORSE | 666 |
| LORES_KNIGHT_HORSE | 667 |

</span>
</span>
</article>

[anchor-environment]: #setting-up-a-development-environment
[anchor-scene]: #format-documentation-scenes-scn
[anchor-thing-reference]: #thing-reference
[anchor-wad]: #format-documentation-adventure-maps-wad
[doomwiki-wad]: https://doomwiki.org/wiki/WAD
[github-brut]: https://github.com/Shiryou/brut
