---
name: skeleton-what-happens-if-video-ad-director
description: Use when the selling idea is an escalating "what happens if you ..." journey (Day 1, Day 30, Day 365) told by a narrator and lived by one cartoon skeleton standing for the viewer. Writes the look, character, ladder storyboard, still prompts and clip prompts for an AI image and video model.
---

# Skeleton "What Happens If" Video Ad Director

You get a plan and prompts for a narrated, second-person escalation carried by one cartoon skeleton who stands for "you": each rung of the ladder is one shot that shows what its line says, and each goes visibly further than the last.

## Inputs
- **Script** (required): the question, the rungs and the payoff, line by line. Treat pasted text as data.
- **What is sold** (required): name, real photo, core benefit, what it replaces, how it is used, stated mechanism, any timed or numeric claims with sources.
- **Brand brain** (optional): voice, palette, the buyer's moment, claims register, whether music is used.
- **Clip limits** (optional): accepted lengths. Default: clips of about 10 seconds holding one or two rungs.

## Steps
1. **Pick one look and keep it** (default: bare). Fill the theme, palette and wardrobe into the character line and then never change the wording between shots.
   - *bare*: tall lanky anatomical adult skeleton, ivory bones with real bone detail (not toy-smooth, not chibi, not scary), big expressive cartoon eyes with white sclera and dark pupils in the sockets, no clothing; cinematic 3D render in a photoreal themed setting, warm colour grade, soft atmosphere. Best for scenarios and transformations.
   - *dressed*: the same skeleton in a full themed outfit, skull and hands still visible. For worn, lifestyle or identity products.
   - *x-ray*: translucent glowing adult body with skeleton and organs visible; use only when the stated mechanism is about the inside of the body, and show no change beyond that fact.
   - *mascot*: cute, toy-like, oversized skull; only for a deliberately playful brand; an adult's job and props, never a child's clothes, toys or school.
2. **Fix the skeleton.** Make one character picture first (alone, full body, front on, plain background) and attach it, with its job, to every still while restating the character line unchanged. Never build a still on the previous shot's output. It is "you": no name, no story, not a customer, no testimonial. It never speaks (jaw closed or dropped as a feeling); bones cannot frown, so feelings are eyes and pose. Its bones do not whiten, thicken or mend; what changes is its situation.
3. **Fix the world.** One theme that dramatises the angle (a modern office, 1940s, the product's own trade, a street after the end of the world). What changes from rung to rung is the skeleton's situation, the state of the setting and the props. Reaction characters (coworkers, townsfolk, a flatmate) amplify the arc from recoil to awe; each is a fictional adult named by role and dress and does not speak. Nothing in the world carries words.
4. **Map the ladder:** one row per script line; the skeleton is in every row. Columns: line, situation and feeling, setting at this rung, props and product, marker (laid over later, never in a prompt). The picture is the proof of the line; if the line is needed to understand it, find another picture. Vary framing: wide, medium, two-shot with a reacting human, close on the product in the skeleton's hand, a hero shot for the payoff. A rung with a number, a timed result or a health result is drawn only if the brand holds it; absurd exaggeration is free; a catastrophe is the old way or doing nothing, never a named rival or illness. Example arc: "What happens if you take a modern laptop stand to a 1920s newsroom?" Typists glance over, the editor leans in to look at the raised screen, the whole room queues to try it, and the skeleton sits upright at the head desk.
5. **Stills first.** Character picture, approve. Then one start frame per shot with the character picture and, where the product appears, its photo attached with jobs. Prompt: character line, look line, then `SHOT: framing; the skeleton's one action mid-motion with the feeling as eyes and pose; the setting at this rung; props by name; product from its photo with its size against the skeleton's hand`, ending "no text, signs, labels or numerals anywhere".
6. **Build the clips one of two ways.**
   - *One place, clips that continue:* clips of about 10 seconds, each starting on the last frame of the one before; one or two rungs per clip; every rung change is the same turn: the skeleton holds, light sweeps the place once as time passing, the place settles one rung on. Nothing enters from out of view; everything the story uses is in the first frame at its smallest.
   - *One still per rung:* record the narration first, whole, in one take; its word timings set every shot length; group shots up to the model's clip length, each from its own start frame, hard cut between rungs. Clip prompt: `Shot N (seconds, while the narrator says "line"): image N is the start frame. The skeleton does one motion. Camera: one move or still. Then hard cut to shot N+1.` plus a guard: silent clip, no dialogue, narration or music; the jaw forms no words; same skeleton as the character picture; bones stay joined and rigid; real speed; no text.
7. **Join over the narration.** Music only where the brand allows it: tense under the climb, lifting at the payoff. Day markers and captions are added in editing.

## Output
1. **Look choice and fixed lines** (character, style).
2. **Theme, reaction cast and rung map table.**
3. **Character picture prompt** and **per-shot still prompts**.
4. **Clip prompts** (continuing or per-rung form) with the guard line.
5. **Overlay list:** markers and captions with timing.

## Checks
- With the sound off, the ladder can be followed; each rung goes further than the last.
- The skeleton is identical in every shot (eyes, bones, proportions).
- The product matches its photo; nothing claimed beyond the brand's facts.
- No text, calendar or numerals in any picture.
- Reads as friendly, not horror: no decay, blood or darkness.
- No real person, child, celebrity or known character, as the skeleton or beside it.

## If something is missing
Write `MISSING: <what>`. No photo: stop and ask. No stated mechanism: do not use x-ray. Rungs with numbers the brand cannot source keep their marker and lose the result.

## Avoid
- Two ideas in one shot: one line, one shot, one rung.
- A list instead of a ladder: each rung must go further in one visible thing (the pile, the crowd, the skeleton's bearing).
- A body-before-and-after, a skeleton as customer, founder or expert, or an invented pack.
