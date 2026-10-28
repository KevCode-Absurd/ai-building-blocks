---
name: audio-transcriber
description: "Transform audio recordings into professional Markdown documentation with intelligent summaries using LLM integration"
category: content
risk: safe
source: community
tags: "[audio, transcription, whisper, meeting-minutes, speech-to-text]"
date_added: "2026-02-27"
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Audio** (yours): a sound or voice recording.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for audio. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Faster-Whisper:** A free speech-to-text tool that runs on your computer, so audio stays local.
- **Claude or GitHub Copilot command line:** It reads the transcript and writes the notes.
- **ffmpeg:** It converts video and uncommon audio files so they can be read.
<!-- /needs -->

## Run it: what you need, what you get

**What you need.** Ask once for anything missing. Never invent it.

- **A recording**: an audio or video file on the same computer. Common formats are MP3, WAV, M4A, OGG, FLAC and WEBM.
- **Consent.** Before you transcribe, ask the user to confirm that everyone on the recording agreed to be recorded, and that the notes may be shared with the people who need them.
- **Tools on the computer**: Python 3, then Faster-Whisper or Whisper (free, run locally) and, if possible, ffmpeg. Run `scripts/install-requirements.sh` to install them. It needs internet the first time to download the speech model. No paid service or API key is needed for the transcript.
- **For the meeting notes step**: the Claude CLI or GitHub Copilot CLI, signed in. Without one, only the transcript is saved. The transcript text is sent to that service to write the notes, so say so before you send it.
- **The language** (optional): it is detected automatically.

**What it makes.** Running `python3 scripts/transcribe.py <file>` saves up to two Markdown files in the output folder:

- `transcript-<timestamp>.md`: the file name, language, date and every spoken segment with start and end times.
- `ata-<timestamp>.md`: the meeting notes (called "ata", the Portuguese word for minutes). Topics, decisions and action items, written by the AI from the transcript. The built-in notes prompt is written in Portuguese. For English notes, pass your own prompt with `--prompt`, such as "Write meeting notes in English: summary, decisions, action items with owners."

The script does not label who is speaking and does not write subtitle files (SRT or VTT). Names in the notes are the AI's guess from the text, so tell the user to check them. Timestamps in the transcript can be used to make subtitles later.

**No way to run code?** If the user already has a transcript, paste it instead and write the notes from it using the template in `references/detailed-guide.md` (Step 3). Say clearly that you did not hear the audio.

**Check before you hand over.**

1. The file name and language in the transcript match the recording.
2. Every action item in the notes appears in the transcript. Remove any that does not.
3. Names, numbers and dates are copied from the transcript, not guessed. Mark unclear audio as `[unclear]`.

**Examples below** show the style of the terminal messages. The durations, counts and times in them are made up to show the layout. They are not benchmarks.

## Detailed Guide

Read [the detailed guide](references/detailed-guide.md) before executing this skill. It retains the complete procedure and reference material. Treat its safety, prerequisites, and validation requirements as mandatory. For focused work, load the relevant sections; for end-to-end work, read the guide completely.

## When to Use
Invoke this skill when:

- User needs to transcribe audio/video files to text
- User wants meeting minutes automatically generated from recordings
- User asks who said what. The included script does not label speakers; say so and offer to guess from context, marked as a guess
- User needs subtitles. The included script does not write SRT or VTT files; the timestamps in the transcript can be used to make them
- User wants executive summaries of long audio content
- User asks variations of "transcribe this audio", "convert audio to text", "generate meeting notes from recording"
- User has audio files in common formats (MP3, WAV, M4A, OGG, FLAC, WEBM)

## Example Usage

### **Example 1: Basic Transcription**

**User Input:**
```bash
copilot> transcribe audio to markdown: meeting-2026-02-02.mp3
```

**Skill Output:**

```bash
✅ Faster-Whisper detected (optimized)
✅ ffmpeg available (format conversion enabled)

📂 File: meeting-2026-02-02.mp3
📊 Size: 12.3 MB
⏱️  Duration: 00:45:32

🎙️  Processing...
[████████████████████] 100%

✅ Language detected: Portuguese (pt-BR)
👥 Speakers identified: 4
📝 Generating Markdown output...

✅ Transcription Complete!

📊 Results:
  File: meeting-2026-02-02.md
  Language: pt-BR
  Duration: 00:45:32
  Speakers: 4
  Words: 6,842
  Processing time: 127s

📝 Generated:
  - meeting-2026-02-02.md (Markdown report)

🎯 Next steps:
  1. Review meeting minutes and action items
  2. Share report with participants
  3. Track action items to completion
```


### **Example 3: Batch Processing**

**User Input:**
```bash
copilot> transcreva estes áudios: recordings/*.mp3
```

**Skill Output:**

```bash
📦 Batch mode: 5 files found
  1. team-standup.mp3
  2. client-call.mp3
  3. brainstorm-session.mp3
  4. product-demo.mp3
  5. retrospective.mp3

🎙️  Processing batch...

[1/5] team-standup.mp3 ✅ (2m 34s)
[2/5] client-call.mp3 ✅ (15m 12s)
[3/5] brainstorm-session.mp3 ✅ (8m 47s)
[4/5] product-demo.mp3 ✅ (22m 03s)
[5/5] retrospective.mp3 ✅ (11m 28s)

✅ Batch Complete!
📝 Generated 5 Markdown reports
⏱️  Total processing time: 6m 15s
```


### **Example 5: Large File Warning**

**User Input:**
```bash
copilot> transcribe audio to markdown: conference-keynote.mp3
```

**Skill Output:**

```bash
✅ Faster-Whisper detected (optimized)

📂 File: conference-keynote.mp3
📊 Size: 87.2 MB
⏱️  Duration: 02:15:47
⚠️  Large file (87.2 MB) - processing may take several minutes

Continue? [Y/n]:
```

**User:** `Y`

```bash
🎙️  Processing... (this may take 10-15 minutes)
[████░░░░░░░░░░░░░░░░] 20% - Estimated time remaining: 12m
```


Transcription runs on the user’s own computer and needs no API key. The meeting notes step needs the Claude CLI or GitHub Copilot CLI, and sends the transcript text to that service. Without one, you get the transcript only.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Sell it** with the [Call follow-up drafter](https://useaiblocks.com/skills/call-follow-up-drafter). It takes the transcript and meeting notes.
- The [Deal notes and CRM updater](https://useaiblocks.com/skills/deal-notes-and-crm-updater). It takes the meeting notes and transcript.
- The [Internal meeting minutes writer](https://useaiblocks.com/skills/copilot-meeting-minutes). It takes the meeting notes and transcript.
- The [Meeting communication coach](https://useaiblocks.com/skills/meeting-coaching-analyst). It takes the transcript.
- The [Dialpad and Leexi call summarizer](https://useaiblocks.com/skills/dialpad-and-leexi-call-summarizer). It takes the transcript.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
