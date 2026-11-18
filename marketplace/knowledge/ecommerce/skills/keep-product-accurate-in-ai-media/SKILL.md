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
2. **Real product photos** with exact source paths, hashes, dimensions and any merchant evidence linking them to the variant: front, back, sides, label close-up, in hand for scale as available. Use the supplied view for what it actually shows; missing views block only the shots or claims that need them. A filename or visual resemblance does not confirm a current SKU.
3. **Product facts:** size, colours, materials, parts list and the exact label text, from `product-claims-profile`.
4. **The logo file** and brand colour values.
5. **Where each asset will run** and the live product page URL.

Optional: older approved assets as a reference, and the store's prompt log.

Access: read only. Nothing is uploaded or published by this skill; a pass hands the asset to launch, which needs the client's yes.

## Before you start: the gates

1. **Truth source exists.** A real source photograph is on hand for the view being checked. No photograph blocks visual comparison; make the capture brief instead. Missing current-SKU mapping blocks that SKU claim or release, not a private layout that explicitly preserves the supplied source.
2. **Rights and people.** Any person in the asset is a consenting model or a fictional character; no real person's likeness without consent. Fail: block.
3. **Disclosure plan.** Realistic generated scenes or people are marked for each platform's AI disclosure [MCR-6064]; Meta may label assets it detects as AI or that the uploader discloses [MCR-6063].
4. **Tool and cost boundary.** Respect the authorized tools and spending limit. Use the host's authorized image tools and their instructions, including the installed imagegen skill where available. If the user requires native subscription tools, keep that restriction; do not switch to a paid API when forbidden. Profit data can inform production priorities but is not required to check fidelity or deliver a local source-preserving layout.

## Steps

### 1. Build the truth card

**Admit evidence for the feature it can establish.** Inspect each reference at full size: what links it to this variant, which details are readable, and whether lighting permits colour assessment. Reject sibling variants, mock-ups and generated pictures as product-truth references. Preserve a supplied real photograph even if SKU mapping, fine detail or colour calibration is absent; label those limits and use it only for the visible appearance and source-preserving layouts it supports. Do not claim a current SKU, physical colour or public-use rights from appearance alone.

One page per product variant, with a source tag on every line (the photo's file name, a brand fact, or `MISSING`):

- Three to five reference photos.
- Size, with a common object for scale (hand, phone, cup).
- Colours by observed name and sampled image value, with calibration limits; a hex sample from an uncalibrated photograph does not establish physical product colour (`product-claims-profile` stores verified facts separately).
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

- **Images:** the whole image at native size, matched source/output crops of the critical features, and the final composition at phone size. For jewellery inspect outer/inner silhouette, perspective, settings/prongs/bezel thickness, connectors, visible stone count and arrangement, facet boundaries, metal edges and finish. Mark hidden or blurred features uncheckable; do not infer total count from a partial view. A phone view or broadly similar outline cannot establish fine-feature fidelity.
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

- **Block:** any product-identity check fails, including altered fine settings/facets, material, finish, proportions, label, logo, count or colour; also block invented claims or unsafe/unconsented context. The asset cannot ship as is or count as a finished product-preserving private-review variant. Mark observed changes **fail**, and missing/unclear evidence **blocked**; these are different findings.
- **Fix:** background artefacts, small hand errors away from the product, minor colour drift in the scene (not on the product).
- **Pass:** the inspected features match at full size, critical detail crops and phone size, with no unresolved required fidelity check. Record scope; this is not proof of SKU, rights, physical colour or channel acceptance. If no independent reviewer is available, say SAME-CONTEXT and leave independent review pending without withholding useful local source-preserving work.

A blocked asset with a generated seal, rating or "clinically proven" badge is a false claim, not a design flaw. A review or rating made up by a generator breaks the US fake review rule [MCR-6045].

### 5. Pick the cheapest repair

| Defect | Repair |
|---|---|
| Label, logo or text wrong | Remove generated text; set real text as type in an editor, or composite the real label photo |
| Product shape, settings, facets or colour wrong, scene fine | Exclude the drifted version from finished deliverables; compose with the untouched source and re-check. If a faithful cutout is unavailable under the allowed tools, put the full original photo in an editable layout panel |
| Product wrong across a video | Replace the shot with real phone footage, or regenerate from an approved still |
| Extra objects or seals | Crop, mask or paint out; re-check the edges |
| Person problem | Remove the person or use a consented reference; no patching |

Re-run all twelve checks after any repair.

An instruction to preserve pixels does not guarantee that a generative editor will do so, even for a crop-only edit. Do not spend repeated attempts disguising the same drift as a new private draft. Keep failed generations only as separate rejected evidence if useful. Lead the handoff with the actual source-preserving artifacts and exact unmet shots, not disclaimers beside changed products. A separate product-free generated background can be useful where permitted, but never generate a new product angle, worn scale, macro detail or material evidence. Capture those photographs for real. Keep source assets untouched in editable HTML/SVG/layout files, preserve aspect ratio, and report display scaling and effective source resolution. Extra output pixels are not extra captured detail.

### 6. Use two reviewers

The maker checks first. When available, a second person who did not make it checks again, on a phone held at reading distance and on a large screen at full size. Record both reviewers; disagreement means block until resolved. When independent review is unavailable, mark it pending and identify the actual maker review as SAME-CONTEXT. Complete useful private source-preserving layouts without inventing a sign-off or calling them cleared for commercial release.

### 7. Log the prompts

For every blocked asset, record the prompt, tool and what drifted. Mark the prompt "do not reuse" or note the fix (for example, "add the label as type, never in the prompt"). Keep the log beside the store's prompt library (`ad-image-prompt-compiler` keeps one).

### 8. Market notes

- **Packaged goods (all markets):** any printed price, maker label or required pack label must show correctly if visible; never let a generator draw a price. Packaging in other languages or scripts is checked letter by letter by someone who reads that script. In the UK and EU, a generated image must not change or invent required marks such as CE or allergen labels.
- **US:** an image or clip that shows the product better than it is can be a misleading ad; ratings and reviews shown must be real.
- **Marketplaces and Shopping feeds:** many require that main images show the actual product; use real photos for main images and keep generated scenes for secondary slots.

## Checks before you hand it over

- A truth card exists for the exact variant in the asset.
- Every reference's supported features and limits are recorded, and every truth card line has a source or `MISSING`.
- The lock lines appear word for word in every prompt used for the asset.
- Video frames were sampled by the rule, including every frame where the product moves.
- All twelve checks have a result per asset.
- No asset with a block defect is marked pass.
- Repaired assets were re-checked in full.
- Reviewer identity and independence are recorded; an unavailable second reviewer remains pending, never fabricated.
- Assets with realistic generated people or scenes are marked for AI disclosure.
- Drifting prompts are logged.

## Output

**One-screen summary:** assets checked, passed, fixed, blocked; the most common defect; prompts retired; what is ready for launch.

**Truth card:** Product, Variant, Reference photos (kept and rejected, with reasons), Identity and look-alike, Size and scale object, Colours (name and value), Finish, Parts count, Build, Use, Label text, Logo position, Never show, Lock lines, Blocked shots and the one photo to take next. Each line carries its source.

**Check sheet per asset:**

| Asset ID | Frames checked | 1 Shape | 2 Scale | 3 Colour | 4 Finish | 5 Logo | 6 Text | 7 Parts | 8 Variant | 9 Claims | 10 Physics | 11 People | 12 Context | Grade |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Defect log:** Asset ID, Frame or area, Defect, Grade, Repair route, Re-check result.

**Fidelity evidence and delivery:** exact source/output paths and SHA-256, compared region, observed feature, pass/fail/blocked and final disposition. Finished source-preserving layouts and any permitted exports are separate from rejected attempts. Give a remaining-shot brief mapping each unsupported buyer question to the real angle/detail, lighting/colour target, required resolution and merchant fact or rights evidence needed. Honest missing evidence is not a reason to substitute generated product features.

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
