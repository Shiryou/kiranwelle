---
title: "Optimizing Our Build Process"
comments: true
date: 2025-10-17 22:00:00 -0700
categories: [Birthright]
series: ["Rebuilding Birthright: The Gorgon's Alliance"]
---

Now that we've released our first build, I've done some thinking about improvements we can make to the build process and the builds themselves to make them more useful to not only me, but also anyone downloading and using them. During [my conversation with juanitogan][github-rbxit], we touched on binary reproducibility. In theory, compiling source code should be deterministic. This means that the compilation process will produce the same output for the same input; every time.

Before we get into how true this is, let's talk about why this is important. I spoke about reproducibility [before][kw-newbeg] (although at the time I didn't know the industry standard terminology). I mentioned that reproducibility gives us a sense of security that we're working on the correct version of the code. This isn't only important for verifying our starting point, but also for building trust and ensuring security. [Recent news about supply chain attacks][cybernews] on popular package managers show us that trust is hard to earn but easy to lose and one slip-up by someone you don't even know can leave your work compromised and spreading viruses to others.

During my previous investigation into reproducibility, I discovered that Birthright: The Gorgon's Alliance embeds the build timestamp into each build and also `strdat.dat`. I ran into some errors loading `strdat.dat` while compiling and copying builds around for testing, which made me think that the timestamps were being compared. It turns out, that's not the case. I'm not sure what what caused my original errors, as I've been unable to reproduce them, but I was able to find all of the timestamps in the code and replace them with the current version number as described [in my previous post][kw-first]. After a lot of tinkering and cursing, I was able to set this version number in one place and have it referenced everywhere else, which means I'm less likely to forget to update something.

After comparing DOS builds generated at different times of day, I was able to confirm that those builds are now reproducible on the same system. Unfortunately, the same can't be said for the Windows builds. In researching the [Portable Executable][wiki-portex] that Windows uses, it turns out that Microsoft is not only aware of the problem, but is also moving to reproducible builds.

> One of the fields in the Portable Executable (PE) header is called TimeDateStamp. It’s a 32-bit value representing the time the file was created, in the form of seconds since January 1, 1970 UTC. But starting in Windows 10, those timestamps are all nonsense. If you look at the timestamps of various files, you’ll see that they appear to be random numbers, completely unrelated to any timestamp. What’s going on?
> 
> One of the changes to the Windows engineering system begun in Windows 10 is the move toward reproducible builds. This means that if you start with the exact same source code, then you should finish with the exact same binary code.
> 
> &mdash; Raymond Chen, 
> *The Old New Thing: [Why are the module timestamps in Windows 10 so nonsensical?][oldnewthing]*

This is great news for the industry and security, but unfortunately it doesn't help us. We're stuck using a compiler that actually inputs the timestamp into the Portable Executable format's `TimeDateStamp` field. As far as I can tell, there's no way to change that. Maybe this is something we can revisit if we get to the point of deprecating the DOS version and moving to newer build tools. My current goal is to fix some specific bugs in both versions if possible. Once I've run out of bugs to fix, I may start looking at modernizing the game. Still, the non-reproducible code is minor and very identifiable, so we're still in a good place.

Either way, I think replacing the timestamps with version numbers is an improvement. The date itself isn't particularly useful unless you're logging all of your builds, while version numbers can be tied to Git tags or commits relatively easily and allow us to regenerate debugging information that can help track down bugs.

---

Another issue I previously ran into is being unable to build for DOS because the build process also builds and then uses `strmake.exe` to build `strdat.dat`. Since it is compiling for DOS, the executable isn't compatible with modern version of Windows, leaving me to build for DOS on a Windows 95 virtual machine.

`strmake.exe` compiles just fine on modern Windows when you're compiling the PE file, so I took a closer look at the `Makefile` and was able to decouple the two build steps. Now we're able to compile all three files perfectly well in modern Windows by running the 3 compilations in successive steps:

    wmake OS=WIN95 DEBUG=OFF clean_all
    wmake OS=DOS DEBUG=OFF SOUND=ON RELEASE=ON
    wmake OS=WIN95 DEBUG=OFF SOUND=ON RELEASE=ON
    wmake OS=WIN95 DEBUG=OFF SOUND=ON RELEASE=ON strdat.dat

Just to verify, I ran the compilation in Windows 95 and Windows 11, and the results are binarily identical, meaning the same should be true for the PE build (aside from the timestamp issues mentioned above). Using this, I could easily set up a GitHub Actions workflow to automatically generate nightly builds, which would be very convenient!

That's three (admittedly small) goals completed in just a couple of weeks. This gives me some confidence that I can actually produce something worthwhile. Of course, now come the more challenging problems, so you may not hear much from me for a while.


[cybernews]: https://cybernews.com/security/hundreds-npm-packages-compromised-in-ongoing-attack/
[github-rbxit]: https://github.com/juanitogan/rbxit/issues/13
[kw-first]: {{< ref "2025-10-14-releasing-first-build.md" >}} "Releasing Our First Build"
[kw-newbeg]: {{< ref "2025-09-30-birthright-new-beginning.md" >}} "Rebuilding Birthright: A New Beginning"
[oldnewthing]: https://devblogs.microsoft.com/oldnewthing/20180103-00/?p=97705
[wiki-portex]: https://en.wikipedia.org/wiki/Portable_Executable
[windows95_ddk]: https://winworldpc.com/product/windows-sdk-ddk/windows-95-ddk
