---
name: clip-captions-srt
description: Writes accurate, readable caption files for a full video or for each short clip - SRT (or WebVTT when positioning matters) with times relative to the clip's in point, lines of at most 42 characters, two lines at most, reading speed set for the audience, speaker names and important sounds, and clean line breaks. Checks the format each tool and platform accepts (YouTube, Premiere, Resolve, CapCut, Descript) and where burned-in captions sit in a vertical frame. Use when clips or a long video need captions, or when existing captions are late, too fast or wrong. Standards as checked on 6 Nov 2026.
---

# Clip captions (SRT)

Captions are for people who cannot hear the audio and for the many who watch with the sound off. WCAG 2.2 asks for captions on prerecorded video, naming speakers and including sounds needed to understand it. They must match what was said, appear in time, and stay up long enough to read. A clip's caption file must also start at zero, not at the clip's place in the long recording.

## When to use

- Each short clip needs its own caption file.
- A full video needs captions for YouTube or a website.
- Captions exist but run fast, lag, break lines badly or have source times in a clip file.

## What you need

- The final audio's timed transcript (not the draft script), with speaker names.
- Each clip's in and out points (from the short-clip-finder skill or the client).
- The audience (adults, children, learners) and language.
- The tool or platform the file goes to, and whether captions are closed (a file) or open (burned in).
- **Access I have.** Writing files is level 1. Adding captions to a draft in a connected tool or to a private upload is level 2. Adding captions to a live video is level 3 within the client's limits.

## Steps

1. **Start from the final audio.** If the transcript came from the draft script or an auto tool, correct it against the final cut: names, numbers, product terms.
2. **Set the reading speed for the audience.** For adult viewers, Netflix's English guide allows up to 20 characters per second (17 for children). For learning content, the DCMP Captioning Key sets lower maximums of 130 to 160 words per minute by level. Write the chosen rate at the top.
3. **Split into captions.** At most two lines, at most 42 characters per line (Netflix). Break after punctuation and before conjunctions and prepositions; keep a first and last name together; prefer the bottom line longer.
4. **Time each caption.** In when the words start, out when they end or the next caption starts. If a caption cannot be read at the chosen speed, split it or hold it a little longer into a pause. If words must be edited to fit, keep the meaning; quotes, well-known speakers and lyrics stay word for word (DCMP).
5. **Name speakers and sounds.** When the speaker is unclear, name them. Include sounds that matter, such as [laughter] or [phone rings]. For two speakers in one caption, Netflix uses a hyphen at the start of each speaker's line.
6. **Make times clip-relative.** For each clip, subtract the clip's in point from every time. The first caption starts at or after 00:00:00,000; the last ends at or before the clip's length.
7. **Write the file in the right format.** SRT: number, then start --> end with a comma before milliseconds (00:00:02,600), then the text, then a blank line. YouTube accepts SRT as plain UTF-8 with no styling. WebVTT: starts with WEBVTT, uses a full stop before milliseconds, and supports positioning; use it when captions must move away from on-screen text. Check the tool: Resolve imports SRT, TTML and others and exports SRT, VTT or TTML; CapCut's web captions accept an uploaded SRT; Descript exports SRT; Premiere generates captions with Speech to Text.
8. **Burned-in captions.** Keep them inside the vertical safe zone: Meta's Reels ad spec keeps 14% top, 35% bottom and 6% each side clear (checked 6 Nov 2026). Check contrast over moving footage; the video producer kit covers contrast and safe areas in depth.
9. **Validate.** Numbers run in order; no overlaps; every time is inside the clip; no line over 42 characters; no caption faster than the chosen rate; file saved as UTF-8.

## Checks

- Text matches the final audio, word for word except flagged edits that keep meaning.
- Two lines at most, 42 characters per line at most.
- Reading speed within the chosen rate.
- Clip files start at zero and end inside the clip.
- Format matches the destination (SRT comma, VTT full stop and header).
- Speakers and important sounds included.

## Output format

1. **Header:** clip name, length, rate chosen, format.
2. **The caption file** in a code block.
3. **Validation notes:** longest line, fastest caption, any edited words.
4. **Where it goes:** upload or import steps for the client's tool, and the access level used.

## Example of good output (short)

*Illustrative structure, not a real show: a business podcast. Copy the shape, never the content: every fact comes from the client's own context. Clip "The invoice trick", source in point 00:12:04,000, length 47 s. Adult audience, 20 characters per second maximum. SRT for YouTube Shorts.*

```
1
00:00:00,000 --> 00:00:02,600
We got paid in 9 days instead of 40.

2
00:00:02,600 --> 00:00:06,900
The trick was one line on the invoice.

3
00:00:06,900 --> 00:00:10,400
-[Mia] What did it say?
-[Ravi] "Paid within 10 days: 2% off."
```

**Validation:** longest line 38 characters (captions 2 and 3). Fastest caption: caption 3, 61 characters in 3.5 s, about 17 characters per second, under the 20 limit. Caption 3 uses the two-speaker hyphen style. Source times were 00:12:04,000 to 00:12:14,400; all shifted by 12:04.

**Where it goes:** at level 2, upload to the private Short in YouTube Studio as an SRT for English; not published.
