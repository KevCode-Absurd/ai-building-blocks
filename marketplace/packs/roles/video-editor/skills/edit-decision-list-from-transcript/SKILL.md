---
name: edit-decision-list-from-transcript
description: Turns a timed transcript and shot notes into an edit decision list - every keep, cut and tighten with in and out timecodes and a reason - to bring a long recording (podcast, webinar, interview, talk) to a target length without changing what anyone meant. Marks pauses, false starts, repeats and off-topic runs, plans cover for jump cuts, flags meaning risks, and hands the list over in the client's tool (Descript, Premiere, Resolve or CapCut). Use when a recording needs tightening, before clips are chosen, or when an editor needs a cut list to follow.
---

# Edit decision list from a transcript

An edit decision list (EDL) is the editor's plan: what stays, what goes, and why, at exact timecodes. Built from a timed transcript, it lets anyone cut the video without guessing. The first rule is that an edit may shorten what someone said, never change it; the UK broadcast code puts it as representing contributions fairly (Ofcom rule 7.6), and it is good practice for any business video.

## When to use

- A long recording needs to come down to a target length.
- An editor or the client needs a cut list to follow in their tool.
- Before choosing short clips, so clips come from the tightened version.

## What you need

- A timed transcript: an SRT or VTT file, or a transcript export with timestamps, with speaker names. No timestamps, no plan: ask for a timed export first.
- The source frame rate and duration, and whether the project uses drop-frame timecode at 29.97 fps.
- Shot notes: cameras and angles, B-roll available.
- Goal, platform and target length.
- The editing tool the client uses.
- **Access I have.** Planning is level 1. Building a draft composition or sequence in a connected tool (for example through Descript's connector) is level 2, in a project named "DRAFT". Overwriting or deleting original recordings needs the client's fresh yes even at level 3.

## Steps

1. **Say how you are working.** At the top, write "Planned from the transcript and shot notes" if you have not seen the picture, and the frame rate used.
2. **Read once for structure.** Mark intro, main points, stories, questions and answers, and the close. Note the moment the video should start (often after the warm-up) and end.
3. **Read again for trims.** Mark false starts, repeated phrases, filler, long pauses (gaps between timestamps), crosstalk, technical breaks and off-topic runs.
4. **Choose the cuts.** For each section decide keep, cut or tighten. A tighten keeps the section but removes named words or pauses inside it.
5. **Guard meaning.** Never cut a "not", "never", "unless", "but" or condition so a sentence flips. Never join two answers into a claim nobody made. Keep the setup a point needs. Mark any cut that could change meaning "[meaning risk]" and leave the call to the client.
6. **Plan cover for jumps.** Each cut inside a single shot leaves a jump. Note the cover: second angle, punch-in, B-roll from the shot notes, or a deliberate jump cut if the style allows. If the cover footage does not exist, write "[needs: ...]".
7. **Check the total.** Add the kept durations. If over the target, find the next weakest section; if under, restore the best trims.
8. **Write timecodes the tool can use.** Use HH:MM:SS:FF in the list and state the frame rate. Check every in and out point exists in the transcript and every out is after its in.
9. **Hand over in the client's tool.** Descript: offer to apply it in a draft at level 2, or to export an EDL or XML timeline for Premiere or Resolve. Premiere or Resolve: the editor follows the list or imports an exchange file. CapCut: CapCut cannot import another editor's project, so write the kept sections as in and out points the client marks with I and O.
10. **List questions** for the client: meaning risks, missing cover, anything that needs a look at the picture.

## Checks

- Every timecode exists in the transcript; every length equals out minus in.
- The kept total matches the target, within the client's tolerance.
- No cut flips meaning; risky cuts are flagged, not hidden.
- Every jump cut has a planned cover or is marked.
- The plan says whether the picture was seen.

## Output format

1. **Header:** source, frame rate, original length, target, "planned from transcript" note.
2. **EDL table:** number, in, out, action (keep, cut, tighten), reason, cover.
3. **Totals:** kept length versus target.
4. **Meaning risks** and **[needs: ...]** list.
5. **Tool handover** steps.
6. **Action log** if any level 2 work was done.

## Example of good output (short)

*Northgate Bookkeeping is a made-up firm used only to show the format. Webinar, 52:10, 25 fps, two speakers (Dana, Joe), one camera plus screen share. Target 20:00. Planned from the transcript; picture not seen.*

| # | In | Out | Action | Reason | Cover |
|---|---|---|---|---|---|
| 1 | 00:00:00:00 | 00:03:12:00 | Cut | Waiting for attendees, sound checks | |
| 2 | 00:03:12:00 | 00:05:40:10 | Keep | Dana's intro and the promise of the session | |
| 3 | 00:05:40:10 | 00:06:05:00 | Cut | Joe restarts the slide deck | |
| 4 | 00:06:05:00 | 00:14:22:15 | Tighten | Keep the three steps; remove two "um, so" restarts at 00:08:10 and 00:11:47 | Screen share over each cut |
| 5 | 00:31:38:00 | 00:32:20:00 | Keep | Joe's best line at 00:31:42 needs the four seconds before it to make sense | |

**Meaning risk:** at 00:27:03 Dana says "I'd never recommend this without a monthly check." Cutting to "recommend this" flips her meaning. Keep the full sentence.

**Handover:** client edits in Descript. With level 2 access I will apply rows 1 to 5 in a composition named "DRAFT - Webinar 20 min" and export a Premiere XML for their freelancer.
