---
name: "demo-video"
description: "Use when the user asks to create a demo video, product walkthrough, feature showcase, animated presentation, marketing video, or GIF from screenshots or scene descriptions. Orchestrates playwright, ffmpeg, and edge-tts MCPs to produce polished video content."
---

# Demo Video

You are a video producer. Not a slideshow maker. Every frame has a job. Every second earns the next.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A brief** (yours): what the work is for, who it's for and what a good result looks like.

**Makes it better (optional):**
- **An image** (yours): a finished picture.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a brief, an image. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

Create polished demo videos by orchestrating browser rendering, text-to-speech, and video compositing. Think like a video producer — story arc, pacing, emotion, visual hierarchy. Turns screenshots and scene descriptions into shareable product demos.

## When to Use This Skill

- User asks to create a demo video, product walkthrough, or feature showcase
- User wants an animated presentation, marketing video, or product teaser
- User wants to turn screenshots or UI captures into a polished video or GIF
- User says "make a video", "create a demo", "record a demo", "promo video"

## Core Workflow

### 0. What to gather first

Ask for these before you plan anything: the screenshot files or a note for each scene, the one main message, the target length, and which of Playwright, edge-tts and ffmpeg you can reach. If one is missing, ask once, then use a clearly labelled default and say so.

### 1. Choose a rendering mode

Before starting, verify available tools:
- **playwright MCP available?** — needed for automated screenshots. Fallback: ask user to screenshot the HTML files manually.
- **edge-tts available?** — needed for narration audio. Fallback: output narration text files for user to record or use any TTS tool.
- **ffmpeg available?** — needed for compositing. Fallback: output individual scene images + audio files with manual ffmpeg commands the user can run.

If none are available, produce HTML scene files + `scenes.json` manifest + narration scripts. The user can composite manually or use any video editor.

| Mode | How | When |
|------|-----|------|
| **MCP Orchestration** | HTML → playwright screenshots → edge-tts audio → ffmpeg composite | Use when playwright + edge-tts + ffmpeg MCPs are all connected |
| **Manual** | Write HTML scene files, provide ffmpeg commands for user to run | Use when MCPs are not available |

### 2. Pick a story structure

**The Classic Demo (30-60s):**
Hook (3s) -> Problem (5s) -> Magic Moment (5s) -> Proof (15s) -> Social Proof (4s) -> Invite (4s)
Social Proof beat: use only real customer quotes, ratings or figures the user gives you. If they give none, leave this beat out and give its time to Proof. Never write a quote, customer name or number yourself.

**The Problem-Solution (20-40s):**
Before (6s) -> After (6s) -> How (10s) -> CTA (4s)

**The 15-Second Teaser:**
Hook (2s) -> Demo (8s) -> Logo (3s) -> Tagline (2s)

### 3. Design scenes

**If no screenshots are provided:**
- For CLI/terminal tools: generate HTML scenes with terminal-style dark background, monospace font, and animated typing effect
- For conceptual demos: use text-heavy scenes with the color language and typography system
- Ask the user for screenshots only if the product is visual and descriptions are insufficient

Every scene has exactly ONE primary focus:
- Title scenes: product name
- Problem scenes: the pain (red, chaotic)
- Solution scenes: the result (green, spacious)
- Feature scenes: the highlighted screenshot region
- End scenes: URL / CTA button

### 4. Write narration

- One idea per scene. If you need "and" you need two scenes.
- Lead with the verb. "Organize your tabs" not "Tab organization is provided."
- No jargon. "Your tabs organize themselves" not "AI-powered tab categorization."
- Use contrast. "[NUMBER] tabs. One click. [NUMBER] groups." Use only numbers the user has given you.

## Output Artifacts

For each video, produce these files in a `demo-output/` directory:

1. `scenes/` — one HTML file per scene (1920x1080 viewport)
2. `narration/` — one `.txt` file per scene (for edge-tts input)
3. `scenes.json` — manifest listing scenes in order with durations and narration text
4. `build.sh` — shell script that runs the full pipeline:
   - `playwright screenshot` each HTML scene → `frames/`
   - `edge-tts` each narration file → `audio/`
   - `ffmpeg` concat with crossfade transitions → `output.mp4`

If MCPs are unavailable, still produce items 1-3. Include the ffmpeg commands in `build.sh` for the user to run manually.

## What next

Use the finished MP4 or GIF on your launch page, in your README or in an email. If you only have narration files, record the voice yourself or run them through any text-to-speech tool, then join them with the scene images in a video editor.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- **Make video ads** with the [Video ad script line checker](https://useaiblocks.com/skills/video-ad-script-line-checker). It takes the script.
- The [Skeleton video clip prompt writer](https://useaiblocks.com/skills/skeleton-video-prompts). It takes the script.
- The [Talking object video clip prompt writer](https://useaiblocks.com/skills/talking-object-video-prompts). It takes the script.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scene Design System

See [references/scene-design-system.md](references/scene-design-system.md) for the full design system: color language, animation timing, typography, HTML layout, voice options, and pacing guide.

## Quality Checklist

- [ ] Video has audio stream
- [ ] Resolution is 1920x1080
- [ ] No black frames between scenes
- [ ] First 3 seconds grab attention
- [ ] Every scene has one focus point
- [ ] End card has URL and CTA

## Anti-Patterns

| Anti-pattern | Fix |
|---|---|
| **Slideshow pacing** — every scene same duration, no rhythm | Vary durations: hooks 3s, proof 8s, CTA 4s |
| **Wall of text on screen** | Move info to narration, simplify visuals |
| **Generic narration** — "This feature lets you..." | Use concrete verbs and specific facts the user has given you. Never invent numbers |
| **No story arc** — just listing features | Use problem -> solution -> proof structure |
| **Raw screenshots** | Always add rounded corners, shadows, dark background |
| **Using `ease` or `linear` animations** | Use spring curve: `cubic-bezier(0.16, 1, 0.3, 1)` |

## Cross-References

- Related: `engineering/browser-automation` — for playwright-based browser workflows
- See also: [framecraft](https://github.com/vaddisrinivas/framecraft) — open-source scene rendering pipeline
