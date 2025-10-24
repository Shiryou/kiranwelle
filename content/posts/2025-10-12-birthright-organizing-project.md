---
title: "Rebuilding Birthright: Organizing the Project"
comments: true
date: 2025-10-12 14:01:00 -0700
categories: [Birthright]
tags: [BirP]
series: ["rebuilding-birthright-the-gorgons-alliance"]
---

Now that we've compiled Birthright: The Gorgon's Alliance, it's time to get everything of consequence into version control so we can manage and update the code effectively. Based on some of the batch files included in the source leak, it seems likely that Synergistic saved changes in ZIP files. While that was potentially a reasonable approach at the time, based on the tools available, it's definitely not a good idea today. It would make it very difficult to work well with multiple contributors. [Concurrent Versions System (CVS)][wiki-cvs] was popular and freely available, so I would be surprised if they didn't have **some** kind of proper version control. Maybe something about their workflow made this difficult to use. I didn't start using version control until Subversion in the early 2000s, so I have very little knowledge of the standards in the 90s.

We'll be using [Git][git] because I have the most experience with it and it has a high market share, meaning others are likely to know it, too. I've set up [a repository on GitHub][github-birp], but for now it will only host a README and the release downloads. Once I've released a version or two, I may release the rest of the source, depending on how it's received. I don't want to put myself in potential legal trouble over something no one uses. There has been some interest in various places ([Birthright.net][br-modding], [GitHub][github-rbxit], and [Discord][discord]), but I don't want to get ahead of myself.

---

Before we can commit the necessary files to version control, we have to decide what the important stuff is. Currently, we're only interested in rebuilding `WINBR.EXE`. [We've discovered already][kw-newbeg] that the build process also rebuilds `strdat.dat`, which includes all of the text in the game (we'll explore that in a post about translations in the future).

After extensive testing, I think I've figured out the minimum set of files needed for the game to compile correctly. We'll need the `DOSOBJSD`, `DOSOBJSR`, `WINOBJSD`, and `WINOBJSR` directories, as the compile doesn't create them and they're used in the build process to store `.obj` files.

We also need the `RES` folder, which contains the cursors and icons embedded into the game. Since these are graphical assets, I will not be including them here. If I make my code public in the future, you'll need to either download the source leak or create your own versions of these.

Code-wise, we need `PCSYS`, `RESUTIL`, `SOLAUDIO` (the Sierra On-Line Audio library), and `WINSYS`. We'll also be including all `*.asm`, `*.c`, `*.cpp`, `*.h`, `*.hxx`, `*.hpp`, `*.dlg`, `*.inc`, and `*.rc` files. Obviously, we'll need the `Makefile`, but I won't be including the batch files that manage `WMAKE`.

I'll be excluding `.obj` files and `.lib` files as they're intermediate files, but will provide a separate download for any related to assembly code. The assembly code shouldn't be changing, and compiling it won't be part of this unless we really need to fix a bug in it. If that happens, we'll address this issue again.

We now have 530 files in the Git repository, and we can move on to removing the CD requirements. This will be a bit more complicated than it looks, especially if we don't want to break any existing installations from the Sierra installer. We'll explore that in the next post.

[br-modding]: http://www.birthright.net/forums/showthread.php?28766-Modding-Birthright-Gorgon-s-Alliance-Adventures
[discord]: https://discord.gg/9pjZKFx
[git]: https://git-scm.com/
[github-birp]: https://github.com/Shiryou/BirP
[github-rbxit]: https://github.com/juanitogan/rbxit/issues/13
[kw-newbeg]: {{< ref "2025-09-30-birthright-new-beginning.md" >}} "Rebuilding Birthright: A New Beginning"
[wiki-cvs]: https://en.wikipedia.org/wiki/Concurrent_Versions_System
