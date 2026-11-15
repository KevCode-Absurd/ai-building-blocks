---
name: keep-product-accurate-in-ai-media
description: "A pass or fail check that catches wrong logos, shapes, colours, labels, text, parts and invented claims in any AI-generated or AI-edited image or video clip before it ships. Builds a product truth card from real photos (exact label text letter by letter, colour values, part count, scale), samples video frames by a fixed rule, runs twelve checks at full size and at phone size with two reviewers, sorts each defect as block, fix or pass, and gives the cheapest repair route (composite the real product, set text as real type, crop, or replace with real footage). Logs drifting prompts so they are not reused. Use on every generated asset for ads, product pages, marketplaces or email before anyone publishes it."
---

# Product accuracy check for AI images and video

**You get:** a signed accuracy check for each generated image or clip: a product truth card, a frame sampling rule, a 12-point pass or fail sheet, a defect log with the repair route for each defect, and a sign-off line, ready to attach to the asset before it goes to launch.

## When to use

- Any AI-generated or AI-edited image or clip is about to be used in an ad, on a product page, in email or on a marketplace.
- A batch of generated assets came back and someone needs to say which can ship.
- A buyer complained that the product did not look like the ad.
- The team is building a library of prompts and wants to drop the ones that drift.

## Not for

- Making the images or clips: use `ad-image-prompt-compiler`, `product-photo-ad-variations`, `photos-to-motion-clips` or `ai-video-shot-list`.
- Checking ad wording against policy and law: use `check-ad-copy-for-policy-and-claims`.
- A full pre-launch check of a whole ad: use `prelaunch-ad-check` after this passes.

## What you need

Required:

1. **The assets** at full resolution, each with an ID, the prompt used and the tool.
2. **Real product photos** of the version that ships today: front, back, sides, label close-up, in hand for scale. If none exist, photograph the product on a phone in daylight first.
3. **Product facts:** size, colours, materials, parts list and the exact label text, from `product-claims-profile`.
4. **The logo file** and brand colour values.
5. **Where each asset will run** and the live product page URL.

Optional: older approved assets as a reference, and the store's prompt log.

Access: read only. Nothing is uploaded or published by this skill; a pass hands the asset to launch, which needs the client's yes.

## Before you start: the gates

1. **Truth source exists.** Real photos of the current product are on hand. Fail: no check is possible; photograph the product first.
2. **Rights and people.** Any person in the asset is a consenting model or a fictional character; no real person's likeness without consent. Fail: block.
3. **Disclosure plan.** Realistic generated scenes or people are marked for each platform's AI disclosure [MCR-6064]; Meta may label assets it detects as AI or that the uploader discloses [MCR-6063].
4. **Money.** Gross profit per order is known from delivered costs [MEA-0037]. Generation and repair time count as production cost [MCR-0023]; a product that looks different in the ad drives returns that eat that margin.

## Steps

### 1. Build the truth card

**Admit only honest photos first.** Check each candidate reference photo at full size with three questions, and keep it only if all three are yes: is it this exact variant (not a sibling size, colour or flavour, a mock-up, a render or a generated picture); can you read the smallest word you will need; is the colour honest (even, neutral light, no filter, no coloured backdrop throwing colour onto the product)? A photo you would have to edit is out, except for cropping away a sticker or caption. One wrong photo leaks into every generated picture, so leave it out rather than keep it "for angles".

One page per product variant, with a source tag on every line (the photo's file name, a brand fact, or `MISSING`):

- Three to five reference photos.
- Size, with a common object for scale (hand, phone, cup).
- Colours by name and value, sampled from real photos in daylight (`product-claims-profile` stores them).
- Material and finish: matte, gloss, brushed, transparent, fabric weave.
- Parts count: buttons, straps, holes, compartments, pieces in a set.
- Label text transcribed letter by letter, including small print, and logo position.
- Must-never-show list: old packaging, discontinued colours, features it does not have.
- Identity: what tells this variant apart from its siblings, and the look-alike a model tends to draw instead ("not a jar", "not glossy", "not a round lid").
- Build: how the parts meet where a close shot would show it, where it opens, the closure, and what comes in one order.
- Use: the steps, how much one use is, how it looks in use, and anything that changes with use (a candle's top, a pan's colour, a balm's surface).

**Lock lines.** Pick the 3 to 5 visible details a model gets wrong first for this product and write each as one short phrase ("small flat green sachet, torn straight across the top"). Every prompt repeats them word for word, and every check in step 3 starts with them, because restating what must stay fixed is the cheapest guard against drift.

**Blocked shots.** For each `MISSING` line, name the shots it blocks: no back photo blocks any turned or held shot that shows the back; no in-hand photo blocks scale shots. Then ask the owner for the one photo that unblocks the most shots, naming the angle, the background and why. A phone photo on a plain surface is fine.

**Garments.** For clothing, AI images drift from how the garment really looks and fits, and return rates rise when buyers get something different [MCR-6833]. Use AI for scenes, props and backgrounds around real garment photos, never to generate the garment itself on a model. More generally, generate the parts of an ad around the real product (the scene, a hand holding it) rather than the whole ad, since full AI ads still come out with garbled text and changed products [MCR-6732].

### 2. Sample the frames

- **Images:** the whole image at full size and at phone size.
- **Video:** the first frame, the last frame, one frame every half second, and every frame where the product moves, rotates, opens, or is touched, or where a face turns. Export these as stills and put them beside the truth card.

### 3. Run the twelve checks

| # | Check | Fail when |
|---|---|---|
| 1 | Silhouette and shape | Outline, corners or curves differ from the reference |
| 2 | Proportions and scale | Too big or small against hands or objects |
| 3 | Colour | Any visible shift in hue against the reference on the same screen |
| 4 | Material and finish | Matte turned glossy, fabric turned smooth, clear turned solid |
| 5 | Logo | Wrong shape, position, colour or spelling |
| 6 | Label and printed text | Any letter added, missing, changed or blurred into fake text |
| 7 | Parts count | Extra or missing parts, buttons, straps or pieces |
| 8 | Variant | Not the colour or size the ad, offer and landing page sell |
| 9 | Invented claims | Seals, badges, awards, ratings, certifications, prices or printed price marks that the store did not supply |
| 10 | Physics and hands | Liquid, steam, shadows or hands behave impossibly; fingers wrong |
| 11 | People | Unconsented likeness, a person shown as a customer, or a person who looks like a real public figure |
| 12 | Context | The product shown doing something it cannot do, or used unsafely |

### 4. Grade each defect

- **Block:** checks 1, 5, 6, 7, 8, 9, 11 or 12 fail, or colour is clearly wrong. The asset cannot ship as is.
- **Fix:** background artefacts, small hand errors away from the product, minor colour drift in the scene (not on the product).
- **Pass:** no defects at full size or phone size.

A blocked asset with a generated seal, rating or "clinically proven" badge is a false claim, not a design flaw. A review or rating made up by a generator breaks the US fake review rule [MCR-6045].

### 5. Pick the cheapest repair

| Defect | Repair |
|---|---|
| Label, logo or text wrong | Remove generated text; set real text as type in an editor, or composite the real label photo |
| Product shape or colour wrong, scene fine | Composite the real product photo over the generated scene; match light and shadow |
| Product wrong across a video | Replace the shot with real phone footage, or regenerate from an approved still |
| Extra objects or seals | Crop, mask or paint out; re-check the edges |
| Person problem | Remove the person or use a consented reference; no patching |

Re-run all twelve checks after any repair.

### 6. Use two reviewers

The maker checks first. A second person who did not make it checks again, on a phone held at reading distance and on a large screen at full size. Both sign. Disagreement means block until resolved.

### 7. Log the prompts

For every blocked asset, record the prompt, tool and what drifted. Mark the prompt "do not reuse" or note the fix (for example, "add the label as type, never in the prompt"). Keep the log beside the store's prompt library (`ad-image-prompt-compiler` keeps one).

### 8. Market notes

- **Packaged goods (all markets):** any printed price, maker label or required pack label must show correctly if visible; never let a generator draw a price. Packaging in other languages or scripts is checked letter by letter by someone who reads that script. In the UK and EU, a generated image must not change or invent required marks such as CE or allergen labels.
- **US:** an image or clip that shows the product better than it is can be a misleading ad; ratings and reviews shown must be real.
- **Marketplaces and Shopping feeds:** many require that main images show the actual product; use real photos for main images and keep generated scenes for secondary slots.

## Checks before you hand it over

- A truth card exists for the exact variant in the asset.
- Every reference photo passed the three admission questions, and every truth card line has a source or `MISSING`.
- The lock lines appear word for word in every prompt used for the asset.
- Video frames were sampled by the rule, including every frame where the product moves.
- All twelve checks have a result per asset.
- No asset with a block defect is marked pass.
- Repaired assets were re-checked in full.
- Two reviewers signed, one of them not the maker.
- Assets with realistic generated people or scenes are marked for AI disclosure.
- Drifting prompts are logged.

## Output

**One-screen summary:** assets checked, passed, fixed, blocked; the most common defect; prompts retired; what is ready for launch.

**Truth card:** Product, Variant, Reference photos (kept and rejected, with reasons), Identity and look-alike, Size and scale object, Colours (name and value), Finish, Parts count, Build, Use, Label text, Logo position, Never show, Lock lines, Blocked shots and the one photo to take next. Each line carries its source.

**Check sheet per asset:**

| Asset ID | Frames checked | 1 Shape | 2 Scale | 3 Colour | 4 Finish | 5 Logo | 6 Text | 7 Parts | 8 Variant | 9 Claims | 10 Physics | 11 People | 12 Context | Grade |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Defect log:** Asset ID, Frame or area, Defect, Grade, Repair route, Re-check result.

**Sign-off:** Maker, Second reviewer, Date, AI disclosure needed (Y or N).

## Common mistakes

- **Checking only the first frame of a clip.** Labels drift mid-motion. Step 2 samples every half second and every move.
- **Fixing a fake badge by shrinking it.** Step 4 treats it as a false claim: remove it.
- **Re-prompting to fix text.** Step 5 sets real type instead.
- **Checking on a laptop only.** Step 6 checks at phone size too.
- **One reviewer who made it.** Step 6 adds fresh eyes.
- **Reusing a prompt that drifted.** Step 7 retires it.
- **Keeping a sibling variant's photo "for angles".** Step 1 admits only photos of the exact variant.
- **Generating a garment on a model.** Step 1 keeps garments real and uses AI only around them.

## Sources

- MCR-0023: gross profit per ad after production cost.
- MCR-6045: invented reviews and testimonials are banned in the US.
- MCR-6063: Meta's AI info label and self-disclosure.
- MCR-6064: which synthetic content needs disclosure.
- MEA-0037: gross margin uses delivered cost.
- MCR-6833: AI garment images drift and raise returns in fashion.
- MCR-6732: use AI image generation for parts of an ad around the real product, since full AI ads still garble text and products.

What makes this skill ours: video is checked by a fixed frame rule that catches mid-motion drift; generated seals, ratings and prices are treated as false claims, not design flaws; each defect has the cheapest repair route, usually putting the real product or real text back in; and drifting prompts are retired so the same mistake is not paid for twice.

## Selling in India

- The MRP and maker label on packaged goods must show correctly if visible; never let a generator draw an MRP.
