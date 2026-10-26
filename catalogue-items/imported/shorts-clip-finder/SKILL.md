---
name: yt-shorts
description: >-
  Find the Shorts hiding inside a long video and write them, using the
  transcript to pick self-contained moments. Use for "cut this into shorts",
  "clip this", "repurpose this video", "what should I clip".
---

# yt-shorts

A Short cut out of a long video is not a clip of the best moment. It is a moment that **survives
without the video around it**, which is a much smaller set.

## Before you pick

- You need a transcript with timecodes. If the user has only a video link and you cannot read it, ask them to paste the transcript. On YouTube they can open the video, tap "...more", and choose "Show transcript". Never guess what is said in a video you cannot read.
- Ask once for the audience or channel topic and the clip length they want (default 20 to 55 seconds). If the user does not answer, carry on and mark the audience MISSING.
- This skill is for talk-led videos where the words carry the moment. If the video is under about 5 minutes, or the best moments depend on what is on screen, say so and suggest a human editor. A live stream with no transcript cannot be used.

## Picking

Read the transcript and find spans of 20-55 seconds where all three are true:

1. It opens on a complete thought. If the first sentence needs the previous minute, it is not a Short.
2. There is a turn in it - a claim, then something that complicates or proves it.
3. It ends on a line, not a trail-off.

Rank the candidates and show the user the top five with their timecodes and first line, so they can
reject one without reading the whole transcript.

## Writing each one

- **A NEW first line.** The long video's line assumes context this viewer does not have. Write the
  replacement. Check it yourself: a stranger with no context should understand it and want the next
  sentence. Do not run any script; the original hook scorer is not included here.
- **On-screen text for the first two seconds**, different words from the spoken line.
- **A loop point**: what the last line sets up so the first line answers it.
- Vertical framing note - what gets cropped out of a 16:9 frame and whether that matters.

## The result

For each of the five clips, give a card in this layout, ranked best first:

```
Clip <n>: <start timecode> to <end timecode> (<seconds> seconds)
Why it stands alone: <one line>
New first line: <text>
On-screen text (first 2 seconds): <text, different words from the spoken line>
Loop point: <last line, and how it sets up the first line>
Crop note: <what 9:16 cuts out of the 16:9 frame, and whether it matters>
```

If fewer than five moments meet all three tests, give fewer and say so. Never stretch a weak moment to fill the list. Use only timecodes that appear in the transcript.

## The gate

Nothing here publishes. This skill writes and you publish. Every output ends in a block the user
copies, and the last line of every run is the question: **ship it, or change it?**
