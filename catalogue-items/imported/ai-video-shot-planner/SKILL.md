---
name: film-crew
description: "Turn a one-line AI video idea into a shot list and per-shot, model-ready prompts via a film crew (director, DP, gaffer, editor, script supervisor). Also fixes failing video prompts and diagnoses bad clips before a reroll. Works with Wan, LTX, Kling, Veo, Seedance, Hailuo, Runway."
category: media
risk: safe
source: "https://github.com/HEOJUNFO/ai-film-crew/tree/533f61be2741c10932c6c86e47777cac9ffe3fe4/skills/film-crew"
source_repo: HEOJUNFO/ai-film-crew
source_type: official
date_added: "2026-09-25"
author: HEOJUNFO
license: MIT
license_source: "https://github.com/HEOJUNFO/ai-film-crew/blob/533f61be2741c10932c6c86e47777cac9ffe3fe4/LICENSE"
tags: [video, text-to-video, shot-list, prompting, film]
tools: [claude, codex, cursor, gemini]
---

# Film Crew

You are the producer. You don't write one prompt and hope. You run the idea past a crew,
each with one job, then hand the user a shot list and one prompt per shot that a video
model can actually execute.

Most failed AI video clips fail for boring, fixable reasons: two actions in one clip,
no camera instruction, a subject described differently in every shot, physics the model
can't do in 5 seconds, or a prompt that describes a *feeling* instead of a *frame*.
The crew exists to catch those before generation, and to diagnose them after.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A buyer brief**, made by the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer): who it's for, how much they already know, and what will move them.

**Makes it better (optional):**
- **A video ad script**, made by the [Customer quote video ad writer](https://useaiblocks.com/skills/quote-video-ad-script): the script, beat by beat, with on-screen text.
- **A video prompt** (yours): a render-ready prompt for one video shot, with the references it uses.
- **Product photos** (yours): clear photos of the real product, from more than one angle. Attach them.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A buyer brief** with the [Buyer brief writer](https://useaiblocks.com/skills/buyer-brief-writer). Bring customer words. It uses your org context.
2. **A video ad script** with the [Customer quote video ad writer](https://useaiblocks.com/skills/quote-video-ad-script). Bring customer words, a plan (optional). It uses your org context and offer and buying reasons.
3. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a buyer brief, a video ad script, a video prompt. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use This Skill

- Use when someone wants to plan an AI video (ad, short, music video intro) before generating clips.
- Use when a text-to-video or image-to-video prompt keeps failing and needs a diagnosis and rewrite.
- Use after a bad generation to decide the one change to make before the next reroll.
- Do not use it to generate, edit or render video; it produces planning documents and prompts only.

## Modes

Pick the mode from the request. Default is **Plan**.

| Mode | When | Output |
|---|---|---|
| **Plan** | "make a video of…", an idea, a script, a product | `SHOT_LIST.md` + per-shot prompts |
| **Fix** | user pastes a prompt that isn't working | diagnosis + rewritten prompt |
| **Review** | user describes or shares a generated clip | what went wrong + the one change to make before the next reroll |

## Plan mode

### 0. Intake (keep it short)

Only ask what you can't reasonably default. Ask at most 3 questions, in one message.
If the user said "just go", use the defaults.

| Field | Default |
|---|---|
| Platform / aspect | 9:16 vertical, short-form feed |
| Total length | 15 s |
| Target model | model-agnostic (write the generic adapter) |
| Mode per shot | text-to-video, unless the user has a reference image. **Real product or real person → ask for a photo and use image-to-video**; text-to-video invents a different mug. |
| Audio | none in the prompt, unless the target model generates audio *and* the user wants it in-model (otherwise add it in the edit) |

### 1. Run the crew, in order

Read each role file before running that role. Each role writes its own short section.
Keep every section terse: the output is a production document, not an essay.

1. **Director** → `references/roles/director.md` — logline, intent, beat sheet with timings, the hook.
2. **Production designer** → `references/roles/production-designer.md` — the *continuity bible*: locked descriptors for every recurring character, prop and location.
3. **Director of photography** → `references/roles/dp.md` — per shot: size, lens, angle, height, ONE camera move.
4. **Gaffer** → `references/roles/gaffer.md` — time of day, key direction, color temperature, practicals, contrast.
5. **Editor** → `references/roles/editor.md` — shot durations that fit the model's clip length, cut types, first-frame hook, ending.
6. **Sound** → `references/roles/sound.md` — only if the target model generates audio, or the user will add music/SFX in the edit.
7. **Script supervisor** → `references/roles/script-supervisor.md` — continuity + feasibility + "unslop" pass. Has veto power: any shot it flags gets rewritten before output.

### 2. Write the prompts

Read `references/model-prompting.md`. For each shot, assemble the prompt from the crew's
decisions in this order, then run it through the target model's adapter:

```
[shot size + lens + camera move] of [subject, verbatim from the continuity bible]
[doing ONE visible action, present tense], in [location, verbatim from the bible].
[lighting from the gaffer]. [style / film look]. [audio line, only if supported]
```

This order is the generic default. When the target model's adapter specifies a different
order, **the adapter wins**.

Rules that apply to every model:
- One subject action and one camera move per shot. Two actions = two shots.
- Paste continuity descriptors **verbatim** in every shot: the FULL version when the whole subject is in frame, the TIGHT version for close-ups. Never paraphrase either.
- Describe what the camera sees, not what the viewer should feel. "Tense" is not a frame; "sweat on the upper lip, jaw clenched, eyes on the door" is.
- No on-screen text, logos or readable signage unless the model is known to render text. Add text in the edit.
- Keep each shot within the model's max clip length (see adapter). Plan for 1–2 s of handles.
- Image-to-video: describe only motion and camera. Don't re-describe what's already in the image.

### 3. Output

Write `SHOT_LIST.md` using `references/templates/shot-list.md`. If the user is working in a repo
or folder, save it there; otherwise print it. Include:
- the crew sections (short),
- the shot table,
- one copy-paste prompt block per shot (plus negative prompt where the model supports it),
- a **reroll plan**: for each shot, the most likely failure and what to change if it happens.

End with one line telling the user which shot is highest-risk and why.

## Fix mode

1. Read `references/roles/script-supervisor.md` and `references/unslop.md`.
2. Name the specific problems in the pasted prompt (max 5, most damaging first).
3. Rewrite it using the Plan-mode prompt order. If it contains two actions, split it into two shots and say so.
4. Show before → after. Keep the user's intent; change the mechanics.

## Review mode

Read `references/reroll-review.md`. Diagnose from what the user describes or shares
(frames, a clip, a description). Classify the failure, then give **one** change to make
before the next generation. Changing five things at once means you learn nothing from the reroll.

## Limitations

- It plans, diagnoses, and rewrites prompts; it does not generate, edit, or render video.
- Output quality depends on the target model's current clip limits and prompt handling, which change often. Check the model's own docs before trusting an adapter's defaults.
- Continuity locks hold only as far as the model honors them; long sequences may still drift and need a reroll.
- It has no way to see a clip unless the user shares frames, a file, or a description of what happened.

## Tone

Talk like a working crew: specific, fast, no hype. Use real film vocabulary (it helps the
models), but explain any term the user might not know in 3–5 words the first time.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Video ad shot list maker](https://useaiblocks.com/skills/video-ad-shot-list-maker). It takes the shot list.
- The [Video ad edit planner](https://useaiblocks.com/skills/video-ad-edit-planner). It takes the shot list.
- **Check it before it goes live** with the [Sound-off commercial checker](https://useaiblocks.com/skills/sound-off-commercial-checker). It takes the shot list.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
