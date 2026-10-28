---
name: analog-occultism
description: >-
  Use this skill to create subject-neutral still images in an analog occultism
  / industrial CRT noir aesthetic: near-monochrome archival technical atmosphere,
  severe low-key lighting, tactile signal degradation, industrial geometry, and
  quiet unresolved tension. Use for portraits, products, environments, interfaces,
  diagrams, abstract forms, and stills. Do not use for colorful cyberpunk,
  vaporwave, glossy advertising, conventional horror, or clean digital renders.
license: MIT
compatibility: >-
  Compatible with image-generation tools. Video is out of scope in this copy.
metadata:
  tags: analog-occultism, industrial-crt-noir, archival, retro-futurist, image-generation, video-generation
  source: user-provided aesthetic brief
---

# Analog Occultism / Industrial CRT Noir

Apply a cross-media visual language, not a subject, character, brand, or story. The
creative premise is: **advanced systems seen through an obsolete recording medium**.
The result should feel like a mysterious technical artifact recovered from a
forgotten research archive: intelligent, secretive, uncanny, severe, tactile, and
quietly beautiful.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **An image** (yours): a finished picture.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, an image. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Core Workflow

1. **Identify the subject and its essential identity.** Preserve the subject's
   recognizable structure, but treat it as evidence, artifact, specimen, icon, or
   component of a larger system rather than a casual commercial presentation.
2. **Choose one dominant practical source.** Prefer a screen, projector, narrow
   overhead fixture, hard backlight, small industrial light, or source just outside
   frame. Let it reveal selected surfaces while most of the space falls into black.
3. **Build the frame around depth and obstruction.** Use a square, portrait, or tight
   crop by default; central or slightly off-center placement; tunnel perspective,
   receding grids, corridors, cables, grilles, foreground obstruction, and a single
   luminous rectangle or focal object.
4. **Apply the shared visual grammar.** Use near-monochrome tonality, crushed blacks,
   blown ivory highlights, sparse midtones, tactile age, geometric framing, and
   controlled imperfection. Color is absent or limited to a subtle cold green,
   blue-gray, desaturated amber, or signal-error cast.
5. **Choose the capture layer explicitly.** There are two related but different looks:
   **CRT-display view** shows an image on a square monochrome tube; **analog-camera
   documentary view** shows a real-world object or scene recorded by a period analog
   video camera. Do not let the second collapse into the first. For documentary view,
   state that the subject is physically present in a real location and that the camera
   is photographing it directly, with practical lens behavior, imperfect focus,
   exposure, depth of field, reflections, and incidental set detail. The CRT or signal
   is the camera and recording chain, not the subject's entire reality.
6. **Make the recording medium the subject of the image.** The result must read as
   a low-fidelity monochrome CRT capture or a photograph of one, not a clean digital
   scene with scanline overlays. Start from a small, soft, interlaced raster: visible
   scanline structure, phosphor bloom, coarse noise, sync wobble, barrel distortion,
   clipped whites, crushed blacks, ghosting, focus falloff, dust, scratches, and
   uneven exposure. Let detail disappear. Signal damage should reduce fidelity while
   preserving the essential subject.
7. **Add signal treatment as physical evidence, not decoration.** Use restrained CRT
   scanlines, interlacing, film grain, dust, scratches, halation, phosphor bloom,
   soft focus, edge smearing, vignette, slight barrel distortion, ghosting, minor
   chromatic misregistration, and uneven exposure. Keep the subject legible.
8. **Check the result against the consistency rules.** Reject outputs that become
   bright, evenly exposed, colorful, glossy, busy, generic glitch art, or polished CGI.

## Prompt Pattern

Use the subject-neutral shorthand, then add only the details the specific asset needs:

```text
[SUBJECT] shown as a low-fidelity monochrome CRT screen capture, rendered as analog
occultism / industrial CRT noir: visibly soft interlaced raster, coarse phosphor
structure, horizontal scanlines, sync wobble, barrel distortion, ghosting, uneven
tracking, crushed blacks, clipped ivory highlights, one luminous practical source,
claustrophobic geometry, archival technical atmosphere, tactile signal degradation,
quiet unresolved tension, controlled imperfection. It must look like an old recording
of a CRT, not a clean digital image with a scanline filter.

The recording defects are structural and unavoidable: low-resolution broadcast image,
soft focus, horizontal line structure, phosphor persistence trails, unstable vertical
hold, slight horizontal tearing, uneven brightness across the tube, black crush hiding
fine detail, white blooming around the screen, dirty glass, dust, and imperfect analog
capture. Do not render a sharp modern digital photograph and then add cosmetic lines.
```

Describe concrete objects, spatial relationships, and the information the viewer must
understand. Do not rely on mood words alone. If typography is necessary, use original
archival-technical labels, all-caps system annotations, monospaced text, framed
emblems, diagrams, readouts, indexes, or specimen-card structures. Keep text sparse;
models may render small annotations imperfectly.

For detailed still-image prompt blocks, reference-based generation, and negative
prompt guidance, read `references/image-prompting.md`, which is in this folder. If a user supplies a visual
reference, use the actual reference in the image tool; a text description is not a
substitute for the pixels.

## Video Direction (out of scope)

This item covers still images only. Do not write video prompts, and do not use FFmpeg or any other skill or tool for video. If the user wants a video, tell them this item cannot do it and that they need a video tool with its own guide.

## Shared Consistency Rules

Each asset should contain most of these ten signals:

1. near-monochrome tonality;
2. one dominant luminous source;
3. severe black-and-white contrast;
4. strong negative space;
5. tactile analog or archival texture;
6. geometric or industrial framing;
7. hidden technical depth;
8. quiet, unresolved tension;
9. controlled imperfection;
10. a discovered artifact quality rather than fresh manufacture.

The subject can change. The visual grammar cannot.

## Avoid

- **Screen-capture fidelity:** when the brief calls for CRT or recovered footage, name
  the raster defects explicitly: low resolution, soft focus, visible scanlines,
  interlacing, phosphor persistence, sync wobble, tracking errors, barrel distortion,
  clipped whites, crushed blacks, ghost trails, and dropped detail. A clean image with
  a decorative scanline overlay is a failure, not a pass.

Do not default to colorful cyberpunk, vaporwave, broad RGB neon, teal-and-orange
cinema grading, clean SaaS minimalism, glossy product advertising, high-key studio
photography, generic hacker imagery, excessive digital corruption, random interface
clutter, cartoon horror, jump scares, gore, conventional horror iconography, or
perfectly polished CGI. Do not use nostalgic retro props merely as decoration.
Effects must never become more noticeable than the subject.

## Reference and QA Boundaries

- Use reference images to preserve identity, composition, or a visual anchor, but do
  not promise pixel-exact style transfer from an edit model.
- For people and creatures, inspect anatomy before judging style. Clearly visible
  hands, limbs, cables, straps, and connected objects must have plausible geometry.
- For typography and diagrams, verify every visible label, relationship, arrow, and
  hierarchy. Never invent technical data because the aesthetic suggests annotations.
- After one or two materially different failed generations, stop and report the
  model limitation or change the shot. Do not hide a failed subject behind more
  darkness or degradation.

## When Not to Use

Use another aesthetic skill for a named brand's locked visual identity, a specific
site's cover rules, colorful cyberdelic work, or any video. This skill defines
a visual language for still images only. It does not replace your image tool's own guide.

## Completion

The skill is complete when the still or shot preserves the subject, expresses the
shared visual grammar, passes the relevant image or frame-level checks, and has an
explicit note of any unresolved model limitation or sampling boundary.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Multi-provider image maker](https://useaiblocks.com/skills/multi-provider-image-maker). It takes the image prompt.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
