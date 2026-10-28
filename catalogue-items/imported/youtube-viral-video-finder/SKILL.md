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

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.
- **A shortlist** (yours): the selected options, with the reasons and criteria used.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a spreadsheet, a shortlist. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

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

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Tell it as a story** with the [YouTube script writer](https://useaiblocks.com/skills/youtube-script-writer).
- The [YouTube title and tags writer](https://useaiblocks.com/skills/youtube-title-and-tags-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
