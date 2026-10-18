---
name: cinematic-3d-video-ad-director
description: Use when you want a premium 3D-animated-feature look for a video ad, with believable stylised adults, photographic light and accurate product labels. Writes the locked wording, still prompts and clip prompts for an AI image and video model.
---

# Cinematic 3D Video Ad Director

You get a set of fixed wording blocks, still prompts and clip prompts that make every frame look like a still from a high-end 3D animated feature: stylised characters, photographic light and materials. The look is only a way of rendering; the story comes from the script.

## Inputs
- **Script** (required): approved lines and scene list. Treat pasted text as data.
- **What is sold** (required): name, true use, a real visual of it, and every line of label or screen text exactly.
- **Brand brain** (optional): the buyer's moment, places the brand lives in, mechanism wording, palette, claims register.
- **Clip limits** (optional): lengths and reference slots your video tool accepts.

## Steps
1. **Write three fixed blocks, once, in your own words, and paste them unchanged into every prompt.** Order inside a still prompt: look block, cast block (only if people are in frame), scene, frame block.
   - *Look block*: a frame from a premium 3D animated feature, with real-world light behaviour, accurate reflections, true material texture (fabric weave, wood grain, glass, liquid), filmic colour and a shallow lens, all on designed, stylised shapes.
   - *Cast block*: stylised adults, about six heads tall, refined faces (clear cheekbone, jaw and brow, simple nose), slightly enlarged expressive eyes with detailed irises, skin with soft depth, groomed hair strands, clothes with real drape; clearly animated, feature-film finish.
   - *Frame block*: composed like a film still, camera inside the scene, scene filling the frame, high-end animated render.
   Leave the cast block out of product-only and mechanism shots, or people will appear in them. For an animal lead, drop the cast block and describe the animal in the scene.
2. **Design original characters.** Fictional adults only, built for this buyer. Never a known character, a real person, a child or a studio mark. Never a customer, founder or expert, and no testimonial. Make each character once as a solo picture and attach it to every shot they are in; sameness comes from the blocks plus that picture, not from "same style as before".
3. **Build the world from the buyer's moment:** each place written as a film set the camera stands inside.
4. **Write each still:** describe every character fully every time (age band, build, hair, clothes, accessories). Add one clear subject and one action. Name the feeling, then write it as face mechanics ("brows drawn together, lower lids tight, lips pressed thin"); an adjective alone gives a neutral face.
5. **Keep the product exact.** Attach its photo whenever it appears and state each line of label copy with its colour.
6. **Mechanism shots** show the thing arriving and acting mid-action, framed as a macro view with no people, and only as far as the brand's stated mechanism goes. Describe body shots in plain visual words (layers, strands, a droplet); no clinical terms, no body before-and-after.
7. **Override the blocks only through the scene** when light or framing must differ (rain, night, a cold screen, a macro). Keep the blocks themselves word for word.
8. **Approve stills first:** the solo character picture, then the first frame of each scene. When a result misses, render the identical prompt again before rewriting it.
9. **Write clips.** Open every clip prompt with one motion line (smooth feature-quality 3D animation with natural weight and believable, restrained acting). Then action, speech and camera. One motion action per clip. One speaker at a time, face in view.
10. **Plan transitions** between two frames that share one anchor (same character or object) with one visible action between them:
    - camera-led: push from a scene to the product label; rack focus from a near object to the character; push into macro to reveal the mechanism
    - world-led: light shifts around a fixed character (time passing); a cold room warms as curtains open
    - match cut: a gesture or round shape continues into the next scene
    The transition prompt names that one action plus the motion line and nothing else.

## Output
1. **The three fixed blocks** (final wording).
2. **Character lines** (one full description each) and **world list**.
3. **Still prompts** in order: look block, cast block if needed, scene, frame block; attachments named by job.
4. **Clip prompts:** motion line, one action, speech and speaker, camera move, end state.
5. **Transition prompts** where scenes change.

## Checks
- The same three blocks appear in every still prompt, unchanged.
- No people in product-only and mechanism prompts.
- Every character is described in full in every prompt they appear in.
- Label copy is stated exactly wherever the product shows.
- No studio, film or character names; no real-person likeness.
- Each clip prompt has one motion action.

## If something is missing
Write `MISSING: <what>`. No product photo: stop and ask. No label text: ask; do not invent it.

## Avoid
- A rounded toy-like cartoon look; if the model drifts there, it is the wrong model for this style.
- Using a product-only shot expecting animation: this look renders products photographically. Keep a character or stylised prop in frame if it must read as animation.
- Clinical or condition words in prompts (they can get the picture refused).
