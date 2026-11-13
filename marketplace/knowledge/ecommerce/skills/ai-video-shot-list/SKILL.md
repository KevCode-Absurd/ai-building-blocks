---
name: ai-video-shot-list
description: "A scene-by-scene plan for a multi-clip AI-made video ad that keeps the product, any person and the look identical in every clip. Locks four cards before any generation (product, person, style, voice) and pastes them word for word into every prompt, builds a scene table where each clip has one action, an approved still first frame and in and out continuity notes, chains clips from last frame to first frame where action continues, and films or composites the real product for the hero shot. The person is a consenting real model or a fictional character made once, never a stranger's photo, and is labelled and never speaks as a customer. Spend is capped and approved. Use for product lifestyle ads, multi-scene stories or any AI ad whose clips drift."
---

# Shot list for an AI-made video ad

**You get:** one scene-by-scene plan for an AI-made video ad: four locked cards (product, person, style, voice), a scene table with a first-frame prompt and a motion prompt per clip, continuity rules, a spend cap, and a review log, ready to generate in any image and video tool.

## When to use

- The store wants a video ad made with AI across several scenes or clips.
- A past AI ad drifted: the product, face, clothes or light changed between clips.
- A lifestyle or story ad is needed without a location shoot.
- Several AI ads should share one consistent world or character.

## Not for

- Phone-footage style creator ads made with AI: use `ai-creator-style-video-ad`, which has its own presenter and slot map.
- Batches of short talking openers: use `ai-presenter-video-openers`.
- Animated explainers of how a product works: use `mechanism-explainer-video-ad`.
- Single motion clips from product photos: use `photos-to-motion-clips`.

## What you need

Required:

1. **A locked script** with scene beats (`creator-video-script`, `write-tiktok-ad-scripts` or the brief from `write-one-page-creative-brief`).
2. **Product reference pack:** 4 to 6 real photos (front, back, side, label close-up, in hand for scale) of the product that ships today, plus its size.
3. **Approved claims list** (`product-claims-profile`).
4. **Person, if any:** a model who signed consent for AI use of their likeness for this ad, these platforms and this term; or approval to create a fictional character.
5. **Tools and budget:** the image and video tools the client uses, and a spend cap.
6. **Gross profit per order** from `store-meta-math`.

Optional: the brand moodboard (`brand-moodboard-for-shoots`) and two reference ads the client admires.

Access: read only. Generating spends credits: the client approves the cap first. Uploading finished ads is draft access with the client's yes.

## Before you start: the gates

1. **Money.** Gross profit per order is known from delivered costs [MEA-0037]. Generation spend, retries and editing are production cost against the ad [MCR-0023]. Set the cap so the ad can still earn back its cost at the store's break-even.
2. **Real footage first?** If a phone shoot of the real product would take less time than generating it, shoot it (`plan-ugc-shoot-at-home`). AI suits scenes that are costly to film, not ones that are easy.
3. **Likeness consent.** No photo of a stranger, influencer or customer as a person reference. A real person only with signed consent; otherwise a fictional character created once. Fail: no person in the ad.
4. **Honest role.** An AI person is a presenter or character, labelled, and never claims to have used the product or speaks as a customer [MCR-6045].
5. **Disclosure.** Realistic generated people and scenes need the platform's AI disclosure [MCR-6064]; Meta may label the ad when it detects AI signals or the uploader discloses [MCR-6063].

## Steps

### 1. Write the four locked cards

Each card is a short paragraph pasted word for word into every prompt that needs it. Changing a word changes the result.

- **Product card:** name, exact shape, size against a hand, colours by name and hex from real photos, material and finish, label text letter by letter, parts count, and "matches the reference photos exactly".
- **Person card:** age range, build, skin tone, hair, face shape, one or two marks of identity, outfit per scene. Use the approved reference image in every clip that shows them.
- **Style card:** camera feel (phone handheld or steady tripod), lens look (wide or normal), light source and direction, time of day, colour feel, texture (clean or slightly grainy), and what to avoid (glossy plastic skin, cinematic grading when the ad should feel real).
- **Voice card,** if anyone speaks: from `voiceover-script-and-voice-pick`.

### 2. Build the scene table

Split the script into clips, each with one action. Clip length follows the tool's limit and the action; 3 to 8 seconds is a practical range (practitioner default). For each clip write: scene number, shot size, camera move (one), the action, any spoken line (short), product state (closed, open, in hand), and continuity notes: what must match the clip before (in) and the clip after (out). The first clip's first frame shows the topic, not scenery [ORG-0017].

### 3. Make first frames as stills

For each clip, generate a still first frame from the cards and references. Review stills against the product photos and the person reference before any video is made. Stills are cheaper to redo than clips. The client approves the set of stills before video generation starts.

### 4. Write motion prompts from approved stills

Each motion prompt: "Animate from the approved first frame." Then camera move, the single action, what stays still, light unchanged, length, end state, and the keep-out list (no new text, no new objects, no change to the product or face). Paste the product and person cards in full.

### 5. Chain where action continues

When one clip's action flows into the next, use the last frame of the approved clip as the first frame of the next. When the scene changes, start fresh from a new approved still. Keep light direction and time of day the same unless the script moves time on.

### 6. Keep the product real where it counts

For the hero product shot (the close-up the buyer studies), film the real product on a phone or composite the real product photo into the generated scene. Generated packaging text drifts; real footage does not. Every clip still passes `keep-product-accurate-in-ai-media`.

### 7. Generate within the cap

2 to 4 takes per clip. Log tool, prompt version, take, cost and verdict. Stop at the cap and report what is left undone rather than going over.

### 8. Review for continuity

Line up all approved clips in order and check: same face, hair and outfit per scene; same product shape, colour and label; same light direction; hands with five fingers that hold things properly; nothing appearing or vanishing between cuts. One clip that breaks continuity is regenerated from its still, not patched with more prompts.

### 9. Assemble and label

Edit in any editor. Add captions and text (`captions-and-text-for-sound-off`), sound (`music-and-sound-for-ads`), and an on-screen line such as "AI-generated presenter" where a realistic person appears. Turn on each platform's AI disclosure setting where it exists.

India and US notes: in India, set scenes in homes, streets and clothing the buyer recognises; generic Western settings read as foreign stock. Prices, MRP and offers are added as real text from the live page, never generated. In the US, an AI person must not appear to give a testimonial or results [MCR-6045].

## Checks before you hand it over

- All four cards exist and were pasted unchanged into every prompt.
- Every clip has one action and an approved still first frame.
- The person reference has signed consent, or the character is fictional and created once.
- No AI person claims use or results; an on-screen label is planned.
- The hero product shot is real footage or a real photo composite.
- Every clip passed the product accuracy check.
- Spend is within the approved cap, logged per clip.
- Continuity review passed across the full sequence.

## Output

**One-screen summary:** ad, scenes, clips, tools, spend against cap, what is real footage versus generated, disclosure plan, open issues.

**Locked cards:** Product card, Person card, Style card, Voice card (each as a pasteable paragraph).

**Scene table:**

| Clip | Seconds | Shot size | Camera move | Action | Line | Product state | In (must match) | Out (hands to) | First frame (still ID) | Motion prompt version | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|

**Generation log:** Clip, Take, Tool, Prompt version, Cost, Accuracy pass, Continuity pass, Verdict.

**Consent record:** Person or character, Source, Consent document, Platforms, Term.

## Common mistakes

- **Describing the product fresh in each prompt.** It changes every time. Step 1 locks the cards.
- **Going straight to video.** Step 3 approves cheap stills first.
- **A stranger's photo as the presenter.** Gate 3 requires consent or a fictional character.
- **Two actions in one clip.** Step 2 keeps one action per clip.
- **Generated packaging close-ups.** Step 6 uses the real product.
- **Spending past the plan.** Step 7 stops at the cap.

## Sources

- MCR-0023: gross profit per ad after production cost.
- MCR-6045: no testimonials by people who do not exist.
- MCR-6063: Meta's AI info label and self-disclosure.
- MCR-6064: which synthetic content needs disclosure.
- MEA-0037: gross margin uses delivered cost.
- ORG-0017: first frame shows the topic.

What makes this skill ours: four cards are locked and pasted unchanged into every prompt; every clip starts from an approved still so spend goes only on frames the client has seen; the hero product shot is always real footage or a real photo composite; and person references need signed consent, with no AI presenter ever posing as a customer.
