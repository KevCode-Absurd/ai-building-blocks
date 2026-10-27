---
name: md2video-audio
description: "Convert Markdown documents into narrated MP4 videos with synchronized visuals and voice narration."
category: media
risk: safe
source: community
source_repo: 70v-Yoyo/md2video-audio-skill
source_type: community
date_added: "2026-09-12"
author: 70v-Yoyo
tags: [markdown, video, audio, text-to-speech, marp, presentation]
tools: [claude, cursor, gemini]
license: "Apache-2.0"
license_source: "https://github.com/70v-Yoyo/md2video-audio-skill/blob/main/LICENSE"
---

# Md2video-audio

## Overview

`md2video-audio` converts a Markdown document into a narrated MP4 video by transforming the source into synchronized presentation visuals and spoken narration.

The workflow preserves the original file and generates separate presentation, narration, and video outputs.

- `source_repo: 70v-Yoyo/md2video-audio-skill`
- `source_type: community`

## Before you run this

**Source and credit.** The skill is by 70v-Yoyo (70v-Yoyo/md2video-audio-skill, Apache-2.0 in the original repo), shared in the sickn33/agentic-awesome-skills collection (content under CC BY 4.0). Keep the credit with any copy you share.

**The video scripts are not in this folder.** Steps 5 and 6 call `ai-2md2marp2av.py`, `md2marp2av.py` and `md2video.py`. Get them from the original repo above before you run those steps. Do not write or guess a script of your own and present it as the original.

**Two ways to run it.**

1. **Full run** needs a computer where your AI can run code and save files, with Python, Marp (the slide tool), a video tool such as ffmpeg, and the Edge-TTS speech package, plus the three scripts. Check each is installed before you start, and ask before installing anything.
2. **Slides and script only** works in any chat AI. Do Steps 2 to 4 and stop. You get the cleaned Markdown, the slide Markdown and the narration Markdown. The person can then render the slides with Marp and read the narration with any speech tool.

**Privacy.** Edge-TTS sends the narration text over the internet to an online speech service. Do not use the full run on confidential documents. Offer the slides-and-script route, or a speech tool that runs offline, instead.

**What to ask for first.** The Markdown document, and optionally a Marp style. If the document is missing, ask once and stop. Never invent content that is not in the document.

**What to hand back.** In this order: the cleaned Markdown (new file), the presentation Markdown (new file), the narration Markdown (new file, same slide count as the presentation), then the MP4 if you ran the full workflow. Say which files you made and which step you stopped at. Keep the original file unchanged.

## When to Use This Skill

- Use when converting Markdown tutorials, reports, or presentations into narrated videos.
- Use when creating presentation-style videos.
- Use when the user asks for Markdown-to-video, narrated slides, or audio-video generation.

## When Not to Use This Skill

- The document is confidential. Edge-TTS sends the text to an online speech service, so stop after Step 4 (slides and script only).
- The user wants a product demo from screenshots. Use the product demo video maker.
- The user only wants text read aloud as audio. Use the multilingual narrator.
- The user needs a PowerPoint deck for a talk. Use the storyboard to PowerPoint deck builder.

## How It Works

### Step 1: Check Environment

Verify required local dependencies before running the workflow. Do not install, remove, or modify dependencies without user confirmation.

### Step 2: Prepare the Markdown

Keep the original file unchanged.

Create a new Markdown file (name it `<original>-prepared.md`) with improved sectioning, formatting, and natural transitions while preserving the original meaning. Put one main idea under each heading, and add a one-sentence transition between sections that need one. Do not add facts that are not in the original.

### Step 3: Generate Presentation Markdown

Convert the prepared document into Marp-compatible slides.

- Separate slides with `---`.
- Prevent content overflow: keep each slide to about 8 lines of text or 6 table rows.
- Split oversized tables, code blocks, or sections into numbered slides (for example "Title (1 of 2)") when necessary.
- Ask the user to choose a Marp style when required.

### Step 4: Generate Narration

Create a narration Markdown file aligned one-to-one with the presentation slides.

Remove visual-only characters that should not be spoken and verify that slide separators remain synchronized.

### Step 5: Generate Video

Run the provided video-generation script with the presentation and narration files:

```
python ai-2md2marp2av.py presentation.md narration.md
```

The script renders Marp slides, generates speech with Edge-TTS, and combines them into an MP4 video.

Ask the user to complete any interactive input required by the script.

### Step 6: Fallback

If the primary workflow fails, try the included fallback scripts in order:

```
python md2marp2av.py
```

Then:

```
python md2video.py
```

## Next steps

Check that the presentation and narration files have the same number of slides. Watch the MP4 once from start to end before sharing it. For a product demo use the product demo video maker, and for audio only use the multilingual narrator.

## Examples

### Example 1: Convert a Tutorial

```
/md2video-audio tutorial.md
```

Produces presentation Markdown, narration Markdown, and a narrated MP4 video.

### Example 2: Convert a Work Report

```
/md2video-audio project-review.md
```

Use the generated slides and narration to create a presentation-style report video.

## Best Practices

- ✅ Preserve the original Markdown file.
- ✅ Keep presentation and narration slide counts synchronized.
- ✅ Split slides that exceed safe layout limits.
- ✅ Confirm before installing dependencies or running interactive actions.
- ❌ Do not overwrite the source document.
- ❌ Do not silently install, remove, or modify system dependencies.

## Limitations

- Requires the local runtime and dependencies used by the included scripts.
- Complex Markdown layouts may require manual adjustment.
- Edge-TTS availability depends on the local network and runtime environment.
- Stop and ask for clarification when required files, permissions, or user choices are missing.

## Security & Safety Notes

- Run scripts only in a local or authorized environment.
- Confirm with the user before installing dependencies or making environment changes.
- Generated files should be written as new files rather than replacing source content.
- Do not execute interactive or destructive commands without explicit user confirmation.

## Common Pitfalls

- **Problem:** Presentation and narration contain different slide counts.
  **Solution:** Verify the number of `---` separators and realign the narration.
- **Problem:** Slide content overflows the Marp layout.
  **Solution:** Split the content into smaller logical sections before rendering.
- **Problem:** Video generation fails because dependencies are unavailable.
  **Solution:** Verify the environment first, then use the fallback scripts if appropriate.
