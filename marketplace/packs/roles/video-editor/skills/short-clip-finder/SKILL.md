---
name: short-clip-finder
description: Finds the moments in a long recording that work as short vertical clips, and plans each one - working name, in and out points, length, hook text from the speaker's own words, on-screen text, aspect ratio and reframe notes, platform and music clearance. Checks clips stand alone, keep meaning, fit each platform's current limits and safe zones, and will not be blocked by a copyright claim. Use when a podcast, webinar, interview or talk needs to become Shorts, Reels or similar. Platform rules as checked on 6 Nov 2026.
---

# Short clip finder

A good clip makes sense to someone who never saw the full video, gets to the point in the first seconds, and ends on a complete thought. It also uses only words the speaker said, in the order they meant them. This skill finds those moments and writes a plan an editor can cut from.

## When to use

- A long recording needs a set of short vertical clips.
- The client has a clip count and platforms in mind and wants the strongest picks.
- Clips were posted before and the client wants better picks next time, using their own analytics.

## What you need

- The timed transcript with speaker names (or the tightened EDL from the edit-decision-list-from-transcript skill).
- Shot notes: cameras, framing (single shots or wide two-shot), B-roll.
- Platforms, clip count, target lengths, caption and brand style.
- Music in the source or planned for the clips, and its licence.
- Past clip analytics (retention, average view duration), if any.
- **Access I have.** Planning is level 1. Cutting draft clips in a connected tool is level 2. Uploading approved clips to the agreed channels and dates is level 3 within the client's limits.

## Steps

1. **Read for standalone moments.** Look for a clear claim, a story with an ending, a surprising number the speaker can back up, a strong answer to a common question, a funny or human moment. Each must make sense without anything before it, or with only a few seconds of setup.
2. **Set in and out points.** Start where the thought starts; often a few seconds before the best line. End on a complete sentence, not mid-breath. Give the length in seconds.
3. **Write the hook text.** The first line on screen, from words the speaker actually said. Reordering whole sentences is allowed only if flagged; never stitch half-sentences into a new claim.
4. **Write on-screen text.** Short, readable in the time it is up. Place it inside the vertical safe zone: Meta's Reels ad spec keeps 14% at the top, 35% at the bottom and 6% at each side clear (checked 6 Nov 2026).
5. **Plan the reframe.** For 9:16, note who is in frame for each part. A wide two-shot with speakers far apart will not crop well; cut between single shots, use a split layout, or mark "[check picture]". Premiere's Auto Reframe and Descript's reframing can do a first pass.
6. **Check platform limits.** As of 6 Nov 2026: YouTube Shorts up to 3 minutes, square or vertical; Shorts over 1 minute with an active copyright claim are blocked worldwide; Instagram Reels ads up to 15 minutes, 9:16, 1440 x 2560 recommended; Reels posted through Instagram's API from 3 seconds to 15 minutes and up to 300 MB. TikTok uploads (as of 7 Nov 2026): MP4 or WebM, at least 720 x 1280, under 10 GB, up to 30 minutes on TikTok's English help page; check the client's account, as some versions show 10 minutes.
7. **Clear the music.** For each clip, name every song in the source and every track planned. Is it licensed for this platform and for business use? YouTube Audio Library tracks are safe on YouTube but not a clearance elsewhere; Shorts audio library songs are mostly limited to 90 seconds in a Short. If not cleared, mute, replace or cut the section.
8. **Rank the clips.** Put the strongest first, with one line on why. If the client has past analytics, say which past openings held viewers and use them as evidence; otherwise say the ranking is judgement.
9. **Check every number.** In and out exist in the transcript; length equals out minus in; quotes are word for word.

## Checks

- Each clip stands alone and ends on a complete thought.
- Hook and on-screen text use only the speaker's words.
- No clip changes meaning; any reordering is flagged.
- Lengths fit each platform's current limit, with the date checked.
- Text sits inside the safe zone.
- Every track is cleared or marked for replacement.

## Output format

1. **Clip table:** working name, in, out, length (s), hook text, on-screen text, ratio, platform, music status.
2. **Reframe notes** per clip.
3. **Flags:** meaning risks, music to replace, "[check picture]" items.
4. **Ranking** with a one-line reason each.
5. **Action log** for any level 2 or 3 work.

## Example of good output (short)

*Illustrative structure, not a real show: a business podcast. Copy the shape, never the content: every fact comes from the client's own context. Episode 38, 25 fps, two cameras (A: Mia single, B: guest Ravi single). Planned from the transcript; picture not seen. Platforms: YouTube Shorts and Instagram Reels.*

| Name | In | Out | Length | Hook text | Ratio | Music |
|---|---|---|---|---|---|---|
| "The invoice trick" | 00:12:04:00 | 00:12:51:00 | 47 s | "We got paid in 9 days instead of 40." | 9:16 | None in source; cleared |
| "Hiring too early" | 00:21:30:00 | 00:22:44:00 | 74 s | "Our first hire nearly sank us." | 9:16 | Intro sting at 00:21:30 is the show's own; cleared |
| "Ravi's worst client" | 00:33:10:00 | 00:34:02:00 | 52 s | "He paid us in gift cards." | 9:16 | Background song 00:33:40-00:33:55, no licence: mute |

**Flags:** "Hiring too early" runs 74 s, so as a Short it is over 1 minute: any unresolved claim would block it, so it must have no uncleared audio. "The invoice trick" quotes a figure: check Ravi can back up "9 days". Reframe: both cameras are singles, so cut between A and B; at 00:22:10 to 00:22:20 they talk over each other, so stay on camera B for Ravi [check picture].
