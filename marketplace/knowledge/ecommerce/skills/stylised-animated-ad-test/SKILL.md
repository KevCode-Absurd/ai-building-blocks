---
name: stylised-animated-ad-test
description: "Test a stylised animated ad format (clay stop-motion look, a printed comic page filmed on a desk, or the product itself as a talking character) the cheap way: one scene first, the full ad only if that scene beats the store's current format. Gives a five-part scene arc, a locked style card per format, image and image-to-video prompts for any tool, a manual path, and stitching and sound steps. The real product stays exact at the reveal in every style, claims come from the facts file, and the format is judged on cost per purchase and gross profit per ad after production cost. A capped wild bet that never outranks proven ads."
---

# Stylised animated ad formats, tested one scene first

**You get:** a one-scene test of a clay, comic or talking-product ad format, with a scene table, style card, prompt cards, a stage 1 result against the current format, and a money table.

Novel formats stand out in the feed, and most of them lose money. This skill treats clay, comic-page and talking-product ads as a bet: spend a little to learn whether the format stops the right people, build the full ad only if it does, and keep it only if it earns more gross profit than the format it replaces.

## When to use

- The account's ads look alike and the store wants a visual format rivals are not using.
- The product or brand has a playful side that suits animation.
- A sensitive problem should be shown without real bodies or graphic images.
- An idea or script exists and needs a production package for one of these formats.

## Not for

- Explaining a mechanism in 3D: use `mechanism-explainer-video-ad`.
- Real-looking presenters: use `ai-creator-style-video-ad`.
- Catalogue product photos: use `store-meta-product-photos`.
- Standard static ads: use `store-meta-ad-images`.

## What you need

**Required**

- Product SKU, the idea or script, buyer group, tone, and goal (sales unless stated).
- Product reference images; brand colours and type.
- Facts file with sources and dates.
- The baseline: the store's best current format with spend, purchases and cost per purchase (Meta export, 30 to 60 days, ad set level).
- Gross profit per purchase and target cost per purchase.

**Optional**

- A proven ad body to splice a test scene onto; reviews CSV for customer phrases; existing prop or character sheets.

**Access.** Level 1, read. Tools, illustrators or animators need a yes and a cap. Paused upload needs level 2 and a yes.

## Before you start: the gates

1. **Money known.** Gross profit per purchase and target cost per purchase exist. Fail: run `store-meta-math`.
2. **Baseline exists.** A current format has a known cost per purchase. Fail: build a baseline with `store-meta-concepts` first.
3. **Bet is capped.** Stage 1 and stage 2 costs are written and fit a cap the owner accepts as a possible loss. Fail: stage 1 only.
4. **Tone fits.** The owner confirms humour or a cartoon look will not undercut trust in this category. Fail: stop.
5. **Tracking.** Meta purchases within about 20% of Shopify paid-social orders over 30 days (practitioner default, test it). Fail: read from Shopify with a UTM per ad.

## Steps

### 1. Pick one format

| Format | Strength | Product rule |
|---|---|---|
| Clay stop-motion look | Warm, handmade, stands out among glossy ads | The world is clay; the reveal shows the real product photo or footage, never a clay copy |
| Printed comic page on a desk | Panels control the story beats; reads with sound off | Desk, paper and hands photoreal, panels flat ink; the finale pushes through into real product footage |
| Talking product | A character with a voice and a face | Shape, colour and label stay exact; eyes and mouth are an add-on |

Say why, and name the runner-up. Take visual ideas from outside the category, never another brand's characters or script [MCR-0055]. For sensitive problems a cartoon look avoids graphic images and is cheap to vary per angle, but claim and personal-attribute rules still apply [MCR-0020]. Describe styles in plain words, not by naming a studio or artist.

### 2. Write five to eight scenes on one arc

| Part | Scenes | Job |
|---|---|---|
| Hook | 1 to 2 | The buyer's problem, no product yet; must filter for buyers [MCR-0026] |
| Sharpen | 1 to 3 | A visual metaphor makes the hidden cause visible |
| Fix | 1 to 2 | The product arrives and answers the problem |
| Proof | 1 | A sourced fact or a real review |
| Ask | 1 | One action, the offer, matching the page |

Per scene: line or caption, the single idea, exactly what the viewer sees ("buried under oversized clay bills", not "looks stressed"), one emotion, length (3 to 8 seconds), claim source. Benefits before features [MCR-0077]. No "it's not X, it's Y" lines [MCR-0016]. Fictional drama about a real feature is fine; a fake feature, price or discount is not.

### 3. Lock the style card

**Clay:** everything in the world sculpted from matte plasticine with tidy tool marks, soft rounded shapes, tabletop diorama scale, soft studio light with a rim light, one exaggerated detail per scene; problem scenes in muted colours, fix and proof scenes warm. Translate water, glass, sky and fire into clay forms. A fixed negative line: no fingerprints, no crude sculpting, no photoreal or glossy plastic, no 2D.

**Comic page:** a photoreal artist's desk with named props (markers, pencils, steel ruler, coffee mug, loose sketches); the page in flat ink outlines, cel shading, halftone dots on aged paper, a muted two-colour palette; one accent colour held back until after the product beat; captions and bubbles of five words or fewer. Restate the split (photoreal desk, ink panels) in every prompt.

**Talking product:** eyes, brows, mouth and small limbs that show one clear feeling, a setting that fits it, light that matches (warm for pride, cold for neglect), and visible wear if the story needs it. A 3D animated feature-film look, described generically.

### 4. Write scene prompts

Per scene: an image prompt (style card, subject, foreground, middle, background, focal point, framing, the product reference unchanged) and a motion prompt (what moves and how, one camera move, how the clip ends to set up the next, style continuity). Clay moves in snappy stop-motion steps, not smooth glides. Comic scenes open with a quick low flyover across the desk, slow into the panel, and end on a page-turn wipe by a photoreal hand. Talking product: a 10-second line in the product's voice, three to five sentences, one register (rant, warning, confession, deadpan fact), ending on a line that lands and leads into the ask.

Make shared assets first: a master page or set still, and a prop or character sheet reused in every scene. Tool-neutral: the same cards work in any image and video model.

**Manual paths:** clay with real modelling clay and a phone stop-motion app; comic drawn by an illustrator, printed and filmed on a real desk; talking product by an animator adding a face to real product footage.

### 5. Stage 1: one scene, cheaply

Build only the hook scene (5 to 8 seconds) and test it either spliced onto a proven body beside the current opener, or as a single still (comic panel, clay frame) beside the current static. One cheap asset, one change [MCR-0075]. A pass needs hook rate or link CTR at or above the baseline and an add-to-cart rate not below it (practitioner default, test it), on no more than 1 times target cost per purchase of spend unless the owner raises the cap. Stage it like the store's other wild bets: small first, against a control, expanding only if it wins [WLD-0007].

### 6. Stage 2: the full ad, if stage 1 passed

Generate every scene from the style card and check each against the product reference and the facts file. Then stitch:

1. Order scenes; trim to end frames; comic clips cut on the page-turn wipe, others on short dissolves.
2. Sound: soft foley for clay; paper and room sounds for comic, music only from the payoff; the character voice for talking product. Narration is recorded in the edit, not generated in-scene.
3. Re-set any garbled lettering in post with a comic font.
4. End on the real product and the offer, matching the page. Export 9:16 and 4:5; set the platform AI label where asked.

### 7. Judge on money, not novelty

Own ad set beside the baseline; judge at 3 times target cost per purchase [ADC-0039], at ad set level. Gross profit per ad = purchases x gross profit per purchase, minus spend, minus production cost. A format that costs four times as much to make must earn that back first [MCR-0023]. Keep it only if cost per purchase is at or under target and gross profit per ad beats the baseline.

### 8. Scale a winner by changing one thing

A new style on the same message is not a new concept; swap buyer group, angle or offer [MCR-0022], keeping versions distinct so Meta does not group them [MCR-0078]. Expect the edge to fade as the style spreads [MCR-0062].

## Checks before you hand it over

1. The baseline and its cost per purchase are stated.
2. Stage costs and the loss cap are written and agreed.
3. The real product appears exact at the reveal in every style.
4. Every line, caption and bubble maps to the facts file.
5. Stage 2 was built only after stage 1 passed its rule.
6. Gross profit per ad includes production cost.
7. Nothing is live without a yes.

## Output

1. **One-screen summary:** format and why, stage reached, cost so far, verdict against the baseline.
2. **Scene table:** scene, part, idea, what the viewer sees, emotion, line, length, source.
3. **Style card, shared assets and scene prompt cards** (image, motion, end frame, manual path).
4. **Stage 1 result:** asset, spend, hook rate or CTR, add-to-cart rate, baseline, pass or fail.
5. **Stitch and sound steps** and **money table** (spend, purchases, cost per purchase, gross profit, production cost, gross profit per ad).

## Common mistakes

- **Building the full film first.** Step 5 tests one scene.
- **The product turned into clay or a cartoon.** Steps 1 and 6 keep it exact.
- **A character with nothing to sell.** Step 4 ends the monologue on the ask.
- **Forgetting production cost.** Step 7 subtracts it.
- **A new style mistaken for a new concept.** Step 8 changes buyer, angle or offer.
- **A novelty outranking a proven ad.** Gate 2 and step 7 hold it to the baseline.

## Sources

- [MCR-0055]: borrow formats from outside the niche.
- [MCR-0020]: illustration for sensitive problems, rules apply.
- [MCR-0026]: hooks must filter for buyers.
- [MCR-0077]: benefits before features; reveal later.
- [MCR-0016]: ban "it's not X, it's Y" lines.
- [MCR-0075]: smoke-test with one cheap asset.
- [WLD-0007]: stage wild bets against a control.
- [ADC-0039]: judge after 3x target cost per purchase.
- [MCR-0023]: compare formats by gross profit after production.
- [MCR-0022]: scale by swapping persona, angle or offer.
- [MCR-0078]: near-duplicates share one entity.
- [MCR-0062]: formats fade once widely copied.

What makes this skill ours: each format is a capped bet that cannot outrank the proven baseline; one scene is tested before a full film; the verdict is gross profit per ad after production cost; and the real product stays exact at the reveal whatever the style.
