---
name: photos-to-motion-clips
description: "Short motion clips (3 to 6 seconds) made from the store's existing product photos, for ad b-roll, openers and product page galleries. Picks the photos that animate well, sorts each planned move by risk (camera move only, the scene moves, or the product itself moves), gives a free no-generator path with keyframed zoom and parallax, and writes one tool-neutral image-to-video prompt per clip that pins the product's shape, label and colour. Every clip passes a frame-by-frame accuracy check against the original photo before use, generation spend is capped and approved, and realistic generated scenes carry the platform's AI label. Use when the store has good photos but little video, or needs b-roll fast."
---

# Motion clips from product photos

**You get:** 6 to 10 short motion clips planned from the store's own product photos: a photo pick sheet, a move plan sorted by risk, one prompt per clip that works in any image-to-video tool (plus a free manual path), and an accuracy log, ready to use as ad b-roll, openers or product page video.

## When to use

- The store has good product photos but little or no video.
- An ad edit needs b-roll or a moving opener and there is no time to shoot.
- The product page gallery would gain from a short moving clip.
- A static ad that works needs a light-motion version for Reels or Stories.

## Not for

- Full AI-made ads with people and dialogue: use `ai-video-shot-list` or `ai-creator-style-video-ad`.
- Still image variations: use `product-photo-ad-variations`.
- Satisfying wordless openers built from the product's world: use `wordless-video-openers`.
- The detailed accuracy check on its own: use `keep-product-accurate-in-ai-media` (this skill runs it on every clip).

## What you need

Required:

1. **Product photos** the store owns or has a licence to use in ads, at least 1080 px on the short side. Supplier photos often lack ad rights; ask.
2. **The real product or its truth card** (shape, colours, label text, parts) from `product-claims-profile`.
3. **Where clips will run:** ads, product page, organic posts, and their sizes.
4. **A generation budget** the client approves (credits or money), or a choice of the free path only.
5. **Gross profit per order** from `store-meta-math`.

Optional: a brand moodboard and the store's past winning ads.

Access: read only for photos and pages. Uploading clips to the store or ad account is draft access (level 2) with the client's yes. Spending credits on a paid tool needs the client's yes and a cap.

## Before you start: the gates

1. **Money.** Gross profit per order is known from delivered costs [MEA-0037]. Generation spend and editing time are production cost charged to the ads that use the clips [MCR-0023].
2. **Rights.** The store can use each photo in paid ads. Fail: drop the photo.
3. **The photo matches what ships.** Same packaging, colour and label as today. Fail: drop it; a clip of old packaging misleads.
4. **Disclosure plan.** A camera move or light change on a real photo is a minor edit. A realistic scene that never happened (the product in a generated kitchen, poured liquid that was never filmed) is synthetic and should be labelled where the platform asks [MCR-6064]. Meta may add an AI label when it detects AI signals or when the uploader discloses [MCR-6063]. Plan the ad so it still works with a label.

## Steps

### 1. Pick the photos

Keep photos that are sharp, evenly lit, with the product whole and unobstructed, the label readable, and a clear light direction. Reject photos with text, stickers, watermarks or app frames on them: generators turn overlays into objects. Reject busy backgrounds; they warp when animated. Prefer one clean product shot, one in-hand shot and one in-use shot.

### 2. Plan each move by risk

| Risk | Move | Product accuracy risk | Default path |
|---|---|---|---|
| Low | Camera only: slow push in, slow pull out, small slide, gentle parallax | Very low | Free manual path |
| Medium | Scene moves, product still: steam, light sweep, shadow from a window, fabric or leaves moving, water ripple behind | Medium | Generator, product pinned |
| High | Product moves: lid opens, liquid pours, item rotates, a hand picks it up | High: labels and shapes drift | Film real footage instead, or generate and expect rejects |

Choose low and medium moves first. A short, honest movement shown in the first frame beats a dramatic one that deforms the product [ORG-0017].

### 3. Make low-risk clips by hand (free path)

In any editor that supports keyframes (most free phone and desktop editors do):

- Push in: scale from 100% to about 110% over 4 seconds, eased.
- Parallax: cut the product out onto its own layer (free background removers exist), then move the background layer slightly more than the product.
- Light sweep: a soft white gradient layer moving across at low opacity.

These clips cannot change the product, so they skip most of the accuracy risk.

### 4. Write the generator prompts

Use one structure for every tool. Fill each part in plain words:

1. **Start frame:** "Use the uploaded photo as the first frame."
2. **Product lock:** "The [product] stays exactly as in the photo: same shape, proportions, colours, label text and logo. It does not move, bend, melt or change."
3. **Camera:** one move only, with speed: "slow push in over the whole clip."
4. **Scene motion:** what else moves: "soft steam rises from the cup behind it."
5. **Light:** "Light stays from the left as in the photo."
6. **Length and end:** "5 seconds, ends on the product centred and still."
7. **Keep out:** "No new text, no new objects, no people, no hands."

One action per clip. Longer prompts with several events produce more drift. Set the aspect ratio to match the photo, then re-frame in the editor; asking the tool to extend the frame invents product edges.

### 5. Generate within the cap

Run 2 to 4 takes per clip. Stop at the approved cap. Log each take with its prompt, tool and cost. Keep the prompts that worked in the store's prompt log (`ad-image-prompt-compiler` keeps one).

### 6. Check every take

Compare first, middle and last frames with the original photo at full size and at phone size:

- Shape and proportions the same?
- Label text identical, letter by letter, and logo unchanged?
- Colours match under the same screen?
- No new parts, text, badges or objects?
- Physics plausible (steam rises, shadows follow light)?

Any fail on product, label, logo or colour rejects the take. Run the full check in `keep-product-accurate-in-ai-media` before anything ships.

### 7. Repair rather than regenerate

For camera-only and scene-motion clips where the product drifted, put the original product cut-out back on top of the moving background in the editor. The product is then the real photo in every frame. Re-check edges and shadows.

### 8. Export for each use

- **Ads and Reels:** 9:16 at 1080 x 1920 and 4:5 at 1080 x 1350, 3 to 6 seconds, loopable if used as an opener.
- **Product page:** short, muted, small file; follow `image-and-video-speed-pass` so the clip does not slow the page.
- Name each clip with photo ID, move and version.

### 9. Judge the clips

Clips are inputs, so judge the ads that use them: store cost per purchase against break-even and gross profit per ad after production cost [MCR-0023]. A clip that wins attention but not purchases is b-roll, not an opener. Rough native statics can beat expensive video in some accounts, so keep testing the static the clip came from [MCR-0060].

Market notes: never let a generator draw a price, label price or offer; add these as real text from the live page. In every market, a clip showing a product in a home setting should look like the homes the buyer recognises in their own country; generic stock kitchens from somewhere else read as foreign stock.

## Checks before you hand it over

- Every source photo has ad rights and shows the product that ships today.
- Each clip's risk level is recorded, and high-risk moves were filmed or flagged.
- Every take passed the frame check on shape, label, logo and colour.
- No generated text, price, badge or rating appears in any clip.
- Spend stayed inside the approved cap, with cost logged per clip.
- Realistic generated scenes are marked for an AI label where the platform asks.
- Product page clips meet the speed rules.

## Output

**One-screen summary:** clips made, free path versus generator count, total spend against cap, clips rejected and why, where each clip goes.

**Photo pick sheet:** Photo ID, Source, Ad rights (Y or N), Matches current product (Y or N), Use or reject, Reason.

**Clip plan and prompt log:**

| Clip | Photo ID | Move | Risk | Path (manual or tool) | Prompt | Takes | Cost | Status |
|---|---|---|---|---|---|---|---|---|

**Accuracy log:** Clip, Take, Frames checked, Shape, Label, Logo, Colour, New elements, Verdict, Repair used.

**Export list:** Clip name, Size, Length, Destination, AI label needed (Y or N).

## Common mistakes

- **Animating the product itself.** Labels melt and shapes drift. Step 2 starts with camera and scene moves.
- **Photos with text on them.** Overlays turn into objects. Step 1 rejects them.
- **Many events in one prompt.** Step 4 keeps one action per clip.
- **Shipping the first take.** Step 6 checks first, middle and last frames.
- **Regenerating forever.** Step 7 composites the real product back in.
- **Spending with no cap.** Gate 1 and step 5 cap and log spend.

## Sources

- MCR-0023: gross profit per ad after production cost.
- MCR-0060: rough statics can beat costly video.
- MCR-6063: Meta's AI info label and self-disclosure.
- MCR-6064: which synthetic content needs disclosure.
- MEA-0037: gross margin uses delivered cost.
- ORG-0017: first frame shows the topic.

What makes this skill ours: each move is graded by how likely it is to damage the product before any credit is spent; low-risk clips are made free by hand with no generator; drifted takes are repaired by putting the real product cut-out back on top; and prices, label prices and offers are never drawn by a model.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Never let a generator draw an MRP; add it as real text. Home-setting clips should look like Indian homes the buyer recognises; generic Western kitchens read as foreign stock.
