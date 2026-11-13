---
name: first-frame-design
description: "Design the first frame of a store's static or video ad so it stops the right buyer. Picks a visual pattern (text on colour, product close-up, in-hand, in use, split screen, comparison, problem scene, real customer photo, illustration) from the concept's awareness stage, the proof the store holds and the product type; mocks up two or three candidate frames with the real product photo; checks each at actual phone size for legibility, contrast, safe zones and whether the product and brand can be named in one second; then writes a full spec for the winner (composition, background, overlay text, lighting, palette, sizes). Works with any design tool, an image generator for backgrounds only, or a phone and a plain wall. Read access only."
---

# First frame design for an online store

**You get:** a frame spec for the chosen first-frame pattern at 4:5 and 9:16, a candidate check table, mock-up files and a short phone-shoot path, ready for a designer or editor.

## When to use

- A new concept needs its first frame locked before production.
- A video has a strong body but a weak opening, and the visual is the suspect.
- A designer keeps getting vague briefs ("make it pop").
- Statics in the account all look alike and the team wants a different look.
- Before a sale, to design the offer frame.

## Not for

- The words of the opener: use `ad-opener-writer`.
- Producing the finished ad images in every size: use `store-meta-ad-images`.
- Clean product photography: use `store-meta-product-photos`.
- Choosing the concept itself: use `proof-scored-ad-ideas` or `weekly-creative-sprint`.

## What you need

Required:

1. **The concept brief:** product, buyer, angle, awareness stage, destination page, opener line if written.
2. **Real product images:** cut-out on white plus in-use photos, at least 1080 px on the short side.
3. **Brand look:** colours (hex codes), fonts, logo files, from `store-meta-brand-dna`.
4. **Placements:** Feed (4:5 or 1:1) and Reels and Stories (9:16).

Optional: the account's current first frames (thumbnails of live ads) so the new one looks different; customer photos with permission; the proof bank.

Missing 2: stop; never let a generator draw the product. Missing 3: read colours from the live site and mark them "from site".

**Access:** level 1 (read). Mock-ups stay internal; uploading to Ads Manager needs level 2 or 3 and a yes.

## Before you start: the gates

1. **Money.** *Pass:* the product has gross profit per purchase and target cost per purchase from `store-meta-math`. *Fail:* design, but do not ship to a test until the money line exists.
2. **Truth.** *Pass:* any number, rating or claim on the frame is on claims allowed and matches the live page today. *Fail:* remove it from the frame.
3. **Product fidelity.** *Pass:* the product on the frame is a real photo of the real product. *Fail:* stop.
4. **Capacity.** *Pass:* the team can make the chosen pattern this week (a designer, a phone shoot, or a creator). *Fail:* choose the fastest pattern that fits.

## Steps

### 1. Decide what the frame must do

- **Clear or curious.** A static frame must be fully clear or deliberately curious; the middle fails [MCR-0019]. Clear frames go to the product page; curious ones need a page that explains [MCR-0024].
- **One stage.** Match the frame to the concept's single awareness stage [MCR-0056]. A product-aware image with problem-aware words fails both.
- **Show the topic.** The frame should show the thing being done (cooking, lifting, cleaning), not unrelated footage [ORG-0017]. Deliberate surprises are allowed only if the next second connects.

### 2. Shortlist patterns

| Pattern | Best for | Needs |
|---|---|---|
| Bold text on brand colour | One sharp line is the whole idea; fast to make | A strong opener line |
| Product on white with a text bar | Smoke-testing an angle cheaply [MCR-0075] | A clean cut-out |
| Extreme close-up | Texture, detail, a feature you can see | Macro photo |
| In-hand | Size, feel, real-life scale | Phone and a hand |
| In use, mid-action | Showing it working | A shoot or creator clip |
| Split screen | Two states or two options | Honest, matched photos |
| Comparison table | Buyers who are already comparing | A provable, current fact |
| Problem scene | Buyers who know the problem, not the product | Situation, not a condition |
| Real customer photo or review card | Proof-led ads | Permission, name and source shown [LPG-0037] |
| Illustration | Sensitive topics where photos would be graphic [MCR-0020] | Policy check still applies |

Pick three that fit step 1 and differ from the account's current first frames. A new background colour on an old layout is not a new frame [MCR-0022]. Treat any look that is already everywhere in the category as past its peak [MCR-0062].

### 3. Set the rules every candidate follows

- **Product and brand readable in the first frame or the next second.** Attention that does not attach to the brand is wasted (practitioner default, test it).
- **Text:** 5 to 8 words on the frame [ORG-0016], one idea, plain words.
- **Premium products:** keep the product out of rough phone footage; let rough footage set the scene and show the product cleanly [MCR-0010].
- **Words carry most of a hook** for direct-response video, so the frame supports the line rather than fighting it [MCR-0063].

### 4. Mock up two or three frames

Make each candidate at 1080 x 1350 and 1080 x 1920 in any tool: Canva, Figma, a phone photo editor, or an image generator for the background only, with the real product photo placed on top. Never generate or alter the product, a person presented as a customer, or a result.

### 5. Check at phone size

For each candidate, on an actual phone or a 375 px wide preview:

| Check | Pass rule |
|---|---|
| One-second read | A person who has not seen it names the product and the point after one second |
| Text size | The smallest text is readable at arm's length on the phone (practitioner default, test it) |
| Contrast | Text against background at least 4.5:1 (WCAG AA), checked with any free contrast checker |
| Safe zones (9:16) | No text, logo or price in the top 14% or bottom 35% of the frame (practitioner default; confirm in the Ads Manager placement preview) |
| Squint test | Blur the frame; the product and the main line still stand out |
| Sound off | The frame makes sense without audio |
| Matches the page | Product, colour, price and offer match the landing page today |

Drop any candidate that fails one-second read, contrast or truth. Pick the best of the rest; name the runner-up.

### 6. Write the spec

For the winner: pattern, composition (where the product sits, where text sits, grid), background (colour hex or setting), overlay text (exact words, font, weight, size in px at 1080 wide), lighting (soft or hard, direction, time of day for shoots), palette (hex codes), product image file used, sizes needed, and the next-second frame for video. Add a phone-shoot path: a plain wall, window light, the product in hand.

### 7. Plan the test

Test frames against the same body and words, one variable at a time. Read on store cost per purchase at 3x target, using link CTR only as an early signal (practitioner default, test it).

## Checks before you hand it over

1. At least two candidates were mocked up and checked at phone size.
2. The winner passed one-second read, contrast 4.5:1 and safe zones in both sizes.
3. The product is a real photo of the real product.
4. Every number or claim on the frame is on claims allowed and matches the page today.
5. The frame text is 8 words or fewer.
6. The winner differs from the account's live first frames by pattern, not just colour.
7. The spec is complete enough that a designer can build it without asking.

## Output

1. **One-screen summary:** the chosen pattern, why it beat the runner-up, the test to run.
2. **Candidate check table:** Candidate, Pattern, One-second read, Contrast ratio, Safe zone, Squint, Matches page, Result.
3. **Frame spec** for the winner with every field in step 6, for 4:5 and 9:16.
4. **Mock-up files** named `frame-<concept>-<pattern>-<size>.png`.
5. **Phone-shoot path** in five lines.

## Common mistakes

- **Frames tested on a laptop.** Step 5 checks at phone size.
- **Text in the Reels button area.** Step 5 checks safe zones in 9:16.
- **A frame that is half clear and half curious.** Step 1 forces a choice.
- **AI-drawn products.** The fidelity gate stops it.
- **Calling a colour swap a new frame.** Step 2 requires a new pattern.
- **Claims on the frame that the page does not show.** The truth gate removes them.

## Sources

- LPG-0037: show reviewer name and source.
- MCR-0010: keep premium products out of rough footage.
- MCR-0019: statics must be clear or curious.
- MCR-0020: illustration for sensitive topics, policy still applies.
- MCR-0022: colour or pose is not a new ad.
- MCR-0024: curious statics need an explaining page.
- MCR-0056: one awareness stage per ad.
- MCR-0062: formats decline once widely copied.
- MCR-0063: words carry most of a video hook.
- MCR-0075: product on white with a text bar to test angles.
- ORG-0016: 5 to 8 words of hook text.
- ORG-0017: show the topic in the first frame.

What makes this skill ours: two or three frames are mocked up and checked at real phone size for a one-second read, contrast and safe zones before one is chosen; the product is always a real photo and every number on the frame must match the live page today; and the pattern is picked from the concept's awareness stage and the store's proof, with a gross profit gate before any test.
