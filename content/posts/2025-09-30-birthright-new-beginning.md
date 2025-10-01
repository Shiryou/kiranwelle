---
title: "Rebuilding Birthright: A New Beginning"
comments: true
date: 2025-09-30
categories: [Birthright]
series: ["Rebuilding Birthright: The Gorgon's Alliance"]
---

Somehow, it's been over a year since we started [Rebuilding Birthright][kw-rebuild]. In that time, I've almost finished [BRUT][github-brut], the Birthright Resource Utility for viewing, modifying, and extracting files from Birthright's resource files. I've also done enough research to put together the beginnings of a [Birthright Modding Reference][kw-modref] for creating custom adventures.

Unfortunately, I've run into a bug. The game crashes when picking up the quest item (the item that marks the adventure complete) in custom adventures. If you overwrite a built-in adventure with the same information, it works perfectly. It's still usable, and some people may take advantage of it, but it leaves a lot to be desired and makes downloading custom adventures less enjoyable.

Therefore, we're back to the original goal, which is to rebuild the game from the source leak and try to fix some bugs. To that end, I have an exciting update: **The game compiles!**

---

My [previous post][kw-defunct] in this series is now obsolete until I decide to upgrade to newer versions of DirectX, Windows SDK, or C++. I've updated the project's prerequisites, but let's follow up on a few points from that post before we proceed.

As verification, I compared the official releases with some of the assets in the codebase. The code includes the fixes included in patch 1.4, and there may have been a small amount of additional work done after the patch was released.

I'll be removing any assets included in the official releases to minimize potential copyright issues as much as possible. If we reach the point of community patches, they should require the user to already own the game. Replacing executables and linked libraries has been done by other projects, and not touching anything related to intellectual properties is going to reduce the chance of legal trouble in the future.

In the process of resetting the repository, I came to a few realizations: The "file corruption" at the end of some of the Makefiles turned out to be caused by a [substitute character][wiki-subcharacter]. This character was used as an end-of-file marker in older operating systems, but has become much less common now. This anachronism caused Windows not to recognize it and throw an error in the Makefiles, and also caused the "No newline at end of file" errors. Now that we're using Watcom 10.6, this no longer appears to be an issue.

---

A few weeks ago, someone opened an [issue][github-bug] on the BRUT repository asking to look into an infamous bug causing random crashes in adventures and linked me to [an open issue on juanitogan/rbxit][github-rbxit], which is a project I kept track of closely back when I still spent most weekends gaming. I had a good discussion with juanitogan on that issue and picked his brain about getting DOS and early Windows games working.

One important realization that emerged from this is that I was using the wrong version of the DirectX SDK. At the time, the DirectX 9 April 2009 SDK was the earliest one I had found, and I figured it might be sufficient with some work. The DirectX 2 SDK also didn't work, but juanitogan pointed out that patch 1.4 updated the game to DirectX 5. Another person also noticed that a log file listed Watcom 10.6 as the compiler.

After experimenting with various combinations of environment variables for some time, I finally managed to compile the game in a Windows 95 virtual machine, which is necessary to compile the DOS version. The Windows 95 version of the game compiles fine on Windows 11. If you're interested in the nitty-gritty of troubleshooting this, I recommend reading through the GitHub issue on the rbxit repository.

---

Now that we have the game compiling, we have two options: attempt binary compatibility or proceed with bug fixes.

We can continue the quest for a binary-compatible compilation (i.e., the executable built from source matches the executable in Patch 1.4 exactly on a binary level). Compilers are generally deterministic, but we already know this is impossible for Birthright because the build process embeds a timestamp into the executable and `strdat.dat` to ensure both are the same version at runtime. I identified what this looks like, so we can filter it out and match everything else.

Depending on your view, attempting binary compatibility can sound like a waste of time. Who cares if the applications are identical? Well, if we know they're the same, we also know the code is the same and that the bugs are the same. We can be relatively sure that any bugs in new builds that aren't in Patch 1.4 are the result of our development work and not changes made by the developers after Patch 1.4 was released. Debugging in C++ is not easy, and certainly wasn't easy in 1996. Many of the conventions and language updates we take for granted today weren't available back then. I'm a big proponent of game preservation, so getting a binary-compatible compile would also be a win in that regard.

Our other option is to accept that the game builds and appears (at first glance) to run as expected and move on to fixing bugs. We could revisit binary compatibility as a digital archeology side project at some time in the future. There's a part of me that really wants to take this route because I have a lot of things I want to implement by the 30th anniversary of the game's release on July 31, 2027. That is a long time away, but I also don't have the free time that I used to have.

My instinct is to take a month to clean up unnecessary files in the codebase, commit it to a new Git repository, and attempt to revert any potential changes in the source to achieve a binary-compatible build. If I'm not able to meet that goal by the end of October, I'll move on to new development.

I've set up a GitHub repository for what I'm calling the [Birthright Preservation (BirP) Patch][github-birp], where anyone can discuss the patch and report issues. However, for now, the code will remain closed-source. I plan to release one or two versions before posting the code online and welcoming contributions from others. Please drop by if you're interested and share your thoughts on potential priorities.

[github-birp]: https://github.com/Shiryou/BirP
[github-brut]: https://github.com/Shiryou/brut
[github-bug]: https://github.com/Shiryou/brut/issues/3
[github-rbxit]: https://github.com/juanitogan/rbxit/issues/13
[kw-defunct]: {{< ref "2024-05-29-birthright-day-1.md" >}} "Rebuilding Birthright: Misdirection"
[kw-modref]: {{< ref "../birthright-modding-reference.md" >}} "Birthright Modding Reference"
[kw-rebuild]: {{< ref "2024-05-28-birthright.md" >}} "Rebuilding Birthright: The Gorgon's Alliance"
[wiki-subcharacter]: https://en.wikipedia.org/wiki/Substitute_character
