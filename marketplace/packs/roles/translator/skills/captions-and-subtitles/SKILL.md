---
name: captions-and-subtitles
description: Makes valid SRT and WebVTT caption files from a transcript or auto-captions, and translates subtitles into another language while keeping the timings. Splits text into readable cues, breaks lines at natural points, adds speaker labels and sound tags, condenses translated lines to fit line-length and reading-speed limits, and checks timing, overlaps and file format. Use when a business needs captions for video, wants messy auto-captions cleaned up, or needs subtitles in a second language for YouTube, a website player, a course platform or social video.
---

# Captions and subtitles

Subtitles are text read against the clock. This skill makes caption files that are valid, readable at speed and true to what was said, and turns them into a second language without losing the timing.

## When to use

- A transcript or script needs an SRT or VTT file.
- Auto-captions from YouTube, a video editor or a meeting tool need names, terms and punctuation fixed.
- Subtitles must be translated into another language with the same timings.
- Short social videos need word groups for burned-in captions.

Not for: transcribing audio you cannot supply as text, legal or court transcripts, or certified translations.

## What you need

- **Transcript or caption file,** with timestamps if available, and the video or its duration.
- **Speakers' names,** and a glossary for names, products and terms.
- **Target platform** (YouTube, website player, course platform, a distributor's spec) and its limits.
- **Line style:** maximum characters per line and lines per cue, or permission to use common defaults.
- **For translation:** target language and country, tone, and whether on-screen text needs subtitles too.
- **Access level:** making files needs level 1. Uploading subtitles as drafts in YouTube Studio or a course platform needs level 2. Publishing them needs level 3 (in YouTube Studio the Subtitle editor role covers this and nothing else).

## Steps

1. **Check the timing source.** If the file has timestamps, treat them as the truth. If not, estimate from speaking pace, say so at the top of the delivery, and mark the file for a timing check in a player or a tool such as Subtitle Edit.
2. **Agree the limits.** Use the client's platform spec. Where there is none, a widely used public reference is Netflix's English guide: up to 42 characters per line, two lines, and reading speed up to 20 characters per second for adults (17 for children), with each subtitle shown between five-sixths of a second and seven seconds. Other languages and platforms set their own numbers.
3. **Split into cues.** One thought per cue. Do not carry a sentence across a shot change if you can avoid it.
4. **Break lines at natural points:** after punctuation, before conjunctions and prepositions, never between an article and its noun or between a first and last name. Prefer a bottom-heavy two-line shape when the language allows it.
5. **Label speakers and sounds.** A dash or name when the speaker changes and is not visible; sound tags such as [music] or [laughs] for captions for deaf and hard-of-hearing viewers. In VTT, voice spans use the form <v Name>.
6. **Fix names and terms** from the glossary. Keep the speaker's words; remove filler only if the brief allows it.
7. **Translate subtitles (if asked).** Translate meaning, then condense to fit the same cue's time and length: cut repetition, filler and what the picture already shows, never facts, numbers or negations. Keep each cue's in and out times. Adapt units and cultural references as in the translate-and-localise-content skill. Translate on-screen text that matters to the story as a separate cue, if the brief asks.
8. **Write the file.**
   - SRT: numbered cues, times as HH:MM:SS,mmm --> HH:MM:SS,mmm, a blank line between cues, plain UTF-8 text. YouTube supports only basic SRT with no styling.
   - VTT: the file starts with WEBVTT, times as HH:MM:SS.mmm (hours optional), optional cue settings after the times.
9. **Validate.** Cues in order, no overlaps, no cue shorter or longer than the limits, no line over the character limit, reading speed within the limit, last cue ends near the end of the speech.
10. **Deliver or upload.** At level 2, upload as a draft. At level 3, publish on the named videos only, log each upload and report it.

## Checks

- File opens in a player or editor without errors.
- Every cue meets the agreed line length, line count, duration and reading speed, or is listed as an exception.
- Times are in order with no overlaps.
- Names and terms match the glossary.
- Translated cues keep facts, numbers and negations; nothing invented.
- Uncertain words are listed for the client to confirm.

## Output format

1. **Header note:** source of timings (given or estimated), limits used, language and locale.
2. **The file** (SRT or VTT) in one code block or as an attachment.
3. **Exceptions list:** cues over a limit, and why.
4. **Uncertain words and names** with timestamps.
5. **For translations:** a review table of cue number, source, target and note.

## Example of good output (short)

*Illustrative structure, not a real business: a letting agent's two-minute explainer video for tenants, subtitled in English and Polish. Copy the shape, never the content: every fact comes from the client's own context.*

```
1
00:00:01,200 --> 00:00:04,100
Moving in? Here's what happens
on your first day.

2
00:00:04,300 --> 00:00:07,900
First, we check the meter readings
with you, room by room.
```

**Polish review table (extract):**

| Cue | Source | Target (pl-PL) | Note |
|---|---|---|---|
| 1 | Moving in? Here's what happens / on your first day. | Wprowadzasz się? Oto, co się dzieje / pierwszego dnia. | Fits 42 characters per line; about 18 characters per second. |
| 2 | First, we check the meter readings / with you, room by room. | Najpierw razem spisujemy stany liczników / w każdym pomieszczeniu. | "With you" condensed into "razem" (together) to stay within reading speed. |

**Uncertain:** 00:01:12, the caretaker's first name sounds like "Gosia"; please confirm spelling.
