---
name: yt-viral
description: >-
  Find what is actually working in the user's niche on YouTube and rank it
  by how far each video beat its own channel, then name the formula. Use for
  "what's working right now", "find viral videos in my niche", "why did this
  blow up", competitor research, or a swipe file.
---

# yt-viral

Raw view counts rank channel size, not ideas. This ranks by **multiple over each channel's own
median**, which is the only version of the question that is about the video.

```bash
python3 swipe.py collected.json --min 2.0
```

## Collecting the input

You need at least **four videos per channel** or a median means nothing, and the tool will skip the
channel and tell you it did. **Default: a list the user copies by hand** from each channel's public video page.

If an earlier video search gave a shortlist, use its channels as the ones to collect.

Only if the user wants it faster, and accepts the risk, use yt-dlp. Say this first, in plain words: "yt-dlp reads YouTube automatically, which may breach YouTube's terms of service." Then `yt-dlp --flat-playlist -J` against a channel URL lists the videos. Keep the requests few and slow.

```json
[{"channel":"...","title":"...","views":412000,"url":"...","duration":613}]
```

**Public listings only.** Never use a logged-in session or the user's own account credentials. Copy view counts exactly as shown. Never invent a title, view count or channel.

## Reading the output

The multiple is the signal. The formula line is a judgement about the TITLE. The 21-formula list (`hooks.json`) is not bundled with this item, so the tool prints "Unclassified" for every title. In that case name the pattern yourself in plain words, such as a number, a question or a before-and-after. It is a guess about the title, not a claim about why the video worked, and you should say so when you present it.

What to hand back: the top five with their multiples, the formula each used, and the ONE structural
thing they share. Then the harder line - which of those the user could actually make this week, in
their voice, with what they have.

## The gate

Nothing here publishes. This skill writes and you publish. Every output ends in a block the user
copies, and the last line of every run is the question: **ship it, or change it?**

Next: take the video you chose into a script with `youtube-script-writer`, or sharpen its title with `youtube-title-and-tags-writer`.
