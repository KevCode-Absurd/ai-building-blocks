---
name: product-photo-ad-variations
description: "Turn one real product photo into three to six ad image variations, with text and style edits and a correctly built version for every placement the store runs: square, portrait, story and landscape across Meta, TikTok, Pinterest and Google. Works three ways: a free manual path in any editor, an AI scene with the real product placed in, or ready-to-paste prompts for a chat image tool. The product is never redrawn, text is set as real type, and every file passes a fidelity check against the real photo and a letter-by-letter spelling check before delivery. Use when a store has one good product photo and needs ads for several platforms, when an image must be resized without losing the product or the headline, or when a chat tool's output needs checking."
---

# Ad image variations from one product photo

**You get:** three to six ad image variations from one product photo, built for every placement the store runs, in one folder per placement, with an asset manifest, an edit log and copyable prompts where needed.

One real photo, several ads, every platform size, and nothing in any file that is not true to the product.

## When to use

- The store has one good product photo and needs a set of ad images this week.
- A winning image must be rebuilt for other platforms and sizes.
- The owner made images in a chat tool and wants them checked and resized.
- Headlines or backgrounds need quick edits across a set of files.

## Not for

- Meta-only images built from approved concepts: use `store-meta-ad-images`.
- New product photography (studio, in use, scale): use `store-meta-product-photos`.
- Deciding which format to make: use `proven-static-formats`.
- A text-free photo library and montage video: use `product-photo-pack-and-montage`.

## What you need

**Required**

- One clean, real photo of the exact product variant, at least 1000 px on the short side (practitioner default), plus the logo file.
- Brand colours (hex) and fonts, or the store URL to read them from. `store-meta-brand-dna` captures them; otherwise read colours from the site's buttons and header and fonts from the page.
- The copy for each variation: headline, support line, proof line, offer line, each with its proof table row.
- The placements the store runs, by platform.

**Optional**

- An image tool the store already uses.
- Earlier images that worked, to keep the look.

**When something is missing.** Photo under 1000 px or blurred: ask for a better one before starting. No copy: write none; send the owner to `store-meta-concepts`. No placements: assume Meta 4:5 and 9:16.

**Access.** Read only. Paid image tools may charge per image; the owner picks the tool and approves spend. Uploading files to an ad account needs the owner's yes.

## Before you start: the gates

1. **Gross profit per purchase known and stock live.** Variations go to products the store profits on and can ship; a product with less cover than its reorder time should not be pushed [ADC-0023]. Fail: stop for that product.
2. **AI allowed for this product.** If buyers judge colour, texture or fit, AI may make the background only, never the product. `store-meta-product-photos` decides. Fail: manual path only.
3. **Capacity.** Someone checks every file at full size. Fail: make fewer variations.
4. **Tracking.** Not needed to make images. Needed later to say which variation sold; name files so each can be traced to its ad ID.

## Steps

### 1. Plan three to six variations that differ in structure

Each variation uses a different structure: product hero with one line, product in a scene, product with callouts, comparison, review card with a real review, offer card. A new background colour or pose alone is not a new ad [MCR-0022], and near-identical images can be served as one [MCR-0078]. For a cheap angle test, one product-on-white image with a bold text bar per value proposition works well [MCR-0075].

### 2. Choose the production path per variation

| Path | How | Use when |
|---|---|---|
| A. Manual | Free background removal, brand background, real type in Canva free, Figma free or Photopea | Always possible; required when AI is not allowed |
| B. AI scene, real product | Generate the scene with no product and no text, then place the real product cutout with a matching shadow | A lifestyle setting adds meaning |
| C. Chat image tool | Upload the real photo and paste a prompt from `ad-image-prompt-compiler`; ask for no text | The owner works in a chat tool |

On paths B and C, the model never draws text longer than a few words and never draws reviews, ratings, prices or people presented as customers. Type goes on afterwards.

### 3. Set the type and proof

- Headline, support line, price and CTA as real type in the brand font.
- Reviews with a name and source; press logos with the outlet's quote [LPG-0037].
- Discounts as the bigger number, money saved or percent off [OFF-0017].
- Each static clear in 3 to 4 seconds or a deliberate curiosity gap pointed at a page that explains [MCR-0024].
- Prices exactly as the site shows them (tax included in the UK, EU and Australia; before sales tax in the US); a pay-on-delivery badge only where that option is live.

### 4. Edit by layer, not by regenerating

- **Text edits** (headline, price, typo): change the type layer. Never regenerate an image to fix a word.
- **Style edits** (background, lighting, colour): change the background or scene layer only; the product layer stays the original pixels.
- Every edit saves a new version with a suffix (`-v2`) and a note of what changed.

### 5. Build every placement as its own layout

| Platform and placement | Size (px) |
|---|---|
| Meta feed | 1080 x 1350 (4:5) and 1080 x 1080 (1:1) |
| Meta Stories and Reels, TikTok | 1080 x 1920 (9:16) |
| Pinterest | 1000 x 1500 (2:3) |
| Google Demand Gen and Performance Max | 1200 x 628 (1.91:1), 1200 x 1200 (1:1), 960 x 1200 (4:5) |
| Landscape video cover or display | 1920 x 1080 (16:9) |

Check each platform's current spec on the day. Rules:

- Re-lay each size; do not stretch, squash or let the platform auto-crop, which can crop story assets into feed [ADC-0065].
- Extending a background to a new ratio is fine; the product must stay the original photo, never extended or redrawn.
- On 9:16, keep readable items out of roughly the top 14%, bottom 35% and side 6% (Meta Reels guidance), and clear of TikTok's right-side buttons and caption band.
- Landscape usually needs a new arrangement (product left, text right), not a crop of the portrait.

### 6. Run the checker before delivery

**Fidelity.** Place each output's product region beside the real photo at 3 times magnification and compare label, logo, colour, shape, proportions and any small text on the pack. Automated help (free): crop the product region and compare it to the reference with a perceptual hash or SSIM in Python, and an average colour difference; any output that scores well below the manual-path files gets a close look (practitioner default, test it). A fail on any feature means redo; never deliver "close enough".

**Spelling.** Read every word on every file with OCR (Tesseract is free) or a vision model, and compare it character by character with the approved copy, including prices and currency signs. Any difference fails. Then read each file once by eye; OCR misses stylised type.

**Placement.** Overlay each 9:16 file with the safe-zone guide and confirm nothing readable sits in the bands.

**Claims.** Every number, rating and offer matches its proof row and the live page today.

Then run each file through `prelaunch-ad-check`.

### 7. Name and deliver

File names: `<sku>_<variation>_<placement>_<width>x<height>_v<n>.png`. AI-made scenes are labelled in the manifest so the store can follow each platform's AI disclosure rules. AI images are cheap per file [MCR-0037]; the checking time is the real cost, so count it.

## Checks before you hand it over

1. Three to six variations, each a different structure.
2. The product in every file is the original photo, passing the side-by-side fidelity check.
3. Every word matches the approved copy character by character, confirmed by OCR and by eye.
4. Every placement is its own layout at the listed size, with no readable item in a safe-zone band.
5. Every claim, price and offer matches its proof row and the live page today.
6. No AI-made person appears as a customer and no review was generated.
7. Every edit is a saved version with a note.
8. Nothing was uploaded to an ad account without the owner's yes.

## Output

1. **One-screen summary:** variations made, the one to test first and why, placements covered, any product that failed fidelity.
2. **Asset manifest:** file name, SKU, variation, structure, placement, width x height, path (A, B or C), AI scene (yes or no), fidelity pass, spelling pass, safe-zone pass, price capture date.
3. **The files**, in one folder per placement.
4. **Chat-tool prompts** (path C) in copyable blocks with the reference photo named.
5. **Edit log:** file, version, change.
6. **Claims and offers:** only those the brief or proof file gives; anything else is left out.

## Common mistakes

- **Letting a model redraw or extend the product.** Steps 2 and 5 keep the original pixels.
- **Fixing a typo by regenerating.** Step 4 edits the type layer.
- **Garbled text no one read.** Step 6 compares every character.
- **Five colour swaps called five ads.** Step 1 requires different structures.
- **A story file auto-cropped into feed.** Step 5 builds each size.
- **A generated review bubble.** Step 2 keeps reviews out of generation.

## Sources

- [ADC-0023]: tie ads to stock against reorder time.
- [MCR-0022]: a colour or pose change is not a new ad.
- [MCR-0078]: near-duplicates share one delivery entity.
- [MCR-0075]: product-on-white plus a text bar to test value propositions.
- [LPG-0037]: named reviews and press quotes.
- [OFF-0017]: show the discount as the bigger number.
- [MCR-0024]: a static is clear or a deliberate curiosity gap.
- [ADC-0065]: automatic formats can crop story assets into feed.
- [MCR-0037]: AI creatives cost a few dollars each.

Platform documentation: Meta, TikTok, Pinterest and Google Ads image specifications; Meta Reels safe-zone guidance; platform AI disclosure rules.

What makes this skill ours: the product is always the original photo, checked side by side at magnification and by a free automated comparison; every word is checked character by character against approved copy; every platform size is its own layout; images go only to products the store profits on and can ship.
