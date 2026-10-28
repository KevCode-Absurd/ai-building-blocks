---
name: yt-audit
description: >-
  Audit a YouTube channel end to end - packaging, consistency, the first
  fifteen seconds, and what to fix first. Use for "audit my channel", "why
  isn't my channel growing", "review my videos", or a pasted channel URL.
---

# yt-audit

An audit that lists twenty problems is a way of avoiding the one that matters. This ends in ONE fix.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A video link** (yours): the link to the video, playlist, channel or post.

**Makes it better (optional):**
- **A shortlist**, made by the [Competitor ad swipe file builder](https://useaiblocks.com/skills/competitor-ad-swipe-file-builder): the best few picked from a bigger set, with reasons.
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.
- **A transcript** (yours): the words from a recording, written out, with who said what.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A shortlist** with the [Competitor ad swipe file builder](https://useaiblocks.com/skills/competitor-ad-swipe-file-builder). Bring reference ads, competitors (optional). It uses your brand brain.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a video link, a shortlist, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude, ChatGPT or Gemini with image upload:** It needs to see your thumbnails at small size. Paste transcripts if your AI cannot read video.
- **Your retention export from YouTube Studio:** It lets the audit check where viewers leave, not just how your packaging looks.
<!-- /needs -->

## What you need first

- Required: a channel link, or three of the user's own videos. Also the last ten titles, in order, and the thumbnails.
- Optional: a retention export from YouTube Studio, a voice profile, past scripts.
- If an earlier step gave a shortlist of the channel's recent uploads, use it for the last ten titles and their dates.
- If the channel has fewer than three public videos, stop and say there is not enough to audit yet. Do not guess.
- If something required is missing, ask for it once. If the user cannot supply it, write MISSING next to that check and carry on with the rest. Never invent a number, a title or a result.

## Before you write

1. Read `~/.claude/youtube/voice.md` if it exists and you can read files. That is the user's voice profile: how they talk
   on camera, the words they never use, who they are talking to, what they will not claim. If it
   does not exist (or you are in a chat with no file access), ask for **three of their own videos** or their transcripts, read them, infer the voice,
   and write the file if you can, or show it in the reply if you cannot. A script in the wrong voice is worse than no script, because they have to
   read it out loud.
2. Never invent a number, a result or a source. If a figure would strengthen it and you do not have
   one, ask for it or write the line without it.

## What to look at, in this order

1. **The last ten titles, as a set.** Read them as a list, the way the channel page shows them. Do
   they promise different things? Run them through `../yt-package/title.py` if that script is in your folder. If not, check each title by hand for length (does it get cut off in the feed?) and for the promise it makes. A channel where every
   title is the same shape has a format problem, not a title problem.
2. **The thumbnails, at feed size.** Shrink them. What survives? If three of them are unreadable at
   that size, that is the fix and nothing else matters yet. If you cannot see images, ask the user to upload them or say so and mark this check MISSING.
3. **The first fifteen seconds of the three most recent.** Transcribe them and score with
   `../yt-script/hookscore.py` if that script is in your folder. If not, ask the user to paste the opening lines (YouTube's own transcript works), then judge each by hand: does it say what the video gives the viewer within fifteen seconds, or does it start with a greeting or a story with no promise? This is where most channels lose.
4. **Upload rhythm.** Not frequency - CONSISTENCY. Six videos in one week and then nothing for a
   month is worse than one a fortnight forever.
5. **The retention shape**, if they can export it. Use `/yt-retention` if it is installed, or read the export directly. If there is no export, write "Retention: not checked" and move on.

## What to hand back

Use these headings, in this order:

1. **The one fix** - the single biggest fix, named, with what to do this week.
2. **What is already working** - three things that are already working, so they do not break them. Be specific; "your energy is
   good" is not an observation. Each one points to a real title, thumbnail or opening.
3. **What NOT to do yet** - one or two things, and why.
4. **Ship it, or change it?** - the closing question.

Never open an audit with praise you do not mean, and never end one with a list of twenty things.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [YouTube upload planner](https://useaiblocks.com/skills/youtube-upload-planner). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## The gate

Nothing here publishes. This skill writes and you publish. Every output ends in a block the user
copies, and the last line of every run is the question: **ship it, or change it?**
