---
title: "Birthright Preservation Patch"
description: "The Birthright Preservation Patch is an enhancement for Birthright: The Gorgon's Alliance. Its primary goal is to address bugs within the game while also enhancing existing features for a better overall experience."
url: birthright/patch/
type: page
show_toc: true
comments: true
date: 2025-12-03
categories: [Birthright]
series: ["birthright-the-gorgons-alliance-support"]
---

The **Birthright Preservation Patch** is an enhancement patch for Birthright: The Gorgon's Alliance, addressing bugs and improving usability of the game and the associated Character Editor utility.

Development is currently focusing on bugs reported to the project's [issue tracker](https://github.com/Shiryou/BirP/issues). Feel free to report bugs or request new features here or on the ModDB page. I try to keep track of them as well as I can.

## Installation

An installer is in the works that will install the patch for you and (optionally) also the game and patch 1.4. That will be announced on ModDB and in the <a href="/series/rebuilding-birthright-the-gorgons-alliance.html">Rebuilding Birthright: The Gorgon's Alliance</a> series once it's ready.

1. <a href="/birthright/#installing">Install the game</a>, if you haven't already.
1. Download the zip archive from ModDB ([see below](#download)).
2. Extract the contents of the zip archive to your game directory.
3. Add the following lines to the end of `BRSETUP.CFG` to remove the CD requirement.
    ```
    [CD_BYPASS]
    1
    ```

## Download

<iframe width="600" height="180" style="display: block; margin: auto;" src="https://www.moddb.com/mods/birthright-preservation-patch/downloads/birthrt-preservation-patch-1404/widget" frameborder="0"></iframe>

## Changelog

### Changed

- Allow calling all files form game directory instead of CD. ([#2](https://github.com/Shiryou/BirP/issues/2))  
  (All files must be copied from the CD to the game directory before launching with this option.)
- Replace timestamps with build numbers for more reproducible builds. ([#7](https://github.com/Shiryou/BirP/issues/7))

### Fixed

- Custom adventures no longer crash the game when picking up the quest goal item. ([#3](https://github.com/Shiryou/BirP/issues/3))
