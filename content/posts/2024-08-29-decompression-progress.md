---
title: "Decompression Progress"
date: 2024-08-29
series: ["Modding Birthright: The Gorgon's Alliance"]
---

I've made far less progress than I was hoping. Part of the delay is just being busy with life. The algorithm isn't really **that** complicated. There are some technical things about assembly language that I've had to relearn, like how the [EFLAGS](https://en.wikipedia.org/wiki/FLAGS_register) register works with bitshifting. (Specifically, the carry flag (CF) is relevant to this algorithm.) I also watched [a great lecture](https://www.youtube.com/watch?v=VDXBnmr8AY0) on LZSS to understand the basics of what the algorithm was likely to do.

After going through the algorithm over and over and adjusting little things here and there to ensure everything matches, I realized this morning that I may have made more progress than I realized. The algorithm crashed very early on in the file due to a badly calculated array index that I haven't pinned down yet.

At first I thought the output I get before the crash was nonsense. Yesterday, I realized that the file I had been using to test, and several others, are included in uncompressed form in the source code archive. I was initially focused on the very beginning of the file, but when I finally looked a bit further, I noticed that there was actually a bit of consistent data.

![image](/img/posts/modding_birthright/decompression-progress.png)

Hopefully, this means I'm on the right track and will have something useful soon. It's still possible that this is a fluke and it's random data that just looks right. Wish me luck!