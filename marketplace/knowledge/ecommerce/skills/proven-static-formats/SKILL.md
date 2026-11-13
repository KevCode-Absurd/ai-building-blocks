---
name: proven-static-formats
description: "Make statics from twelve proven e-commerce ad formats, built on the store's real product: product hero, problem scene, callout diagram, comparison, review card, review wall, native post, founder note, objection answer, offer card, bundle math and how-it-works steps. Picks the format from gaps in the store's own ad mix, not preference, and allows a format only when the store has the proof it needs. Same-day mode gives one ad fully specified (layout, copy, visual, free production path); batch mode rebuilds several at 4:5 and 9:16 with a review deck and up to two revision rounds. Outside ads are used only for structure, never their words or art, and every format is graded on the store's own account afterwards."
---

# Proven static formats on the store's own product

**You get:** a static ad built from one of twelve proven formats on the store's real product, with an ad spec or review deck, files at 1080 x 1350 and 1080 x 1920, and a gap table showing why that format.

Twelve structures that keep working in e-commerce, chosen by what the account is missing and built only with proof the store owns.

## When to use

- A static is needed today and there is no designer.
- The account runs the same two or three formats and needs something different.
- The team found ads from other brands it likes and wants that structure on its own product, legally.
- The store wants to know which formats actually earn for it.

## Not for

- New angles and copy for a concept: use `store-meta-concepts`.
- A bespoke visual idea that no format covers: use `static-ad-visual-idea`.
- Premium cold-audience statics with a custom base image: use `layered-static-production`.
- A full month of creative: use `monthly-ad-batch-sprint`.

## What you need

**Required**

- Real product photos (clean front shot plus any in-use shots), logo file, brand fonts and hex colours.
- The live product page URL, price and current offer.
- The proof table: reviews export (CSV: rating, body, reviewer name, date, photo URL), lab or spec documents, press links, each dated. `store-meta-brand-dna` builds it.
- Meta Ads Manager export, last 90 days, ad level: ad name, ad ID, ad set, spend, impressions, frequency, purchases, cost per purchase, attribution setting; plus thumbnails or files.

**Optional**

- Reference ads the owner likes, from the Meta Ad Library (free) or elsewhere.
- Target cost per purchase per product (from `store-meta-math`).

**When something is missing.** No ads export (new account): skip the gap scan and start with product hero, review card and offer card, the three that need the least history. No reviews export: review formats are not allowed. No offer: offer and bundle formats are not allowed.

**Access.** Read only. Files are delivered to the owner. Uploading as paused ads needs draft access and the owner's yes; launching needs a separate yes.

## Before you start: the gates

1. **Gross profit per purchase known** for the product. Offer and bundle formats also need break-even recomputed at that discount [OFF-0016]. Fail: drop offer and bundle formats.
2. **Cash and capacity.** The number of new ads fits the test budget at about 3 times target cost per purchase per concept [ADC-0039], and the team can build them. Fail: same-day mode, one ad.
3. **Tracking.** Ads Manager purchases within about 20% of store orders for the same dates (practitioner default, test it). Fail: do the gap scan on counts and spend only, and grade new ads on store orders by discount code or UTM.
4. **Stock and price live.** The product is in stock at the price the ad will show. Fail: stop for that product.

## Steps

### 1. Know the twelve formats and what each needs

| # | Format | Structure | Proof it needs | Best for | Effort |
|---|---|---|---|---|---|
| 1 | Product hero | Big real product, one benefit line | None beyond the product | Product-aware, retargeting | Low |
| 2 | Problem scene | The problem moment, product as a small inset | A real problem buyers name in reviews | Problem-aware cold | Medium |
| 3 | Callout diagram | Product centre, 3 or 4 labelled features | Spec sheet | Solution-aware | Low |
| 4 | Comparison | Product vs "the usual way", 3 to 5 rows | Substantiated, current facts | Solution-aware | Low |
| 5 | Review card | One real review, name, source, rating | Reviews export with permission | Warm, cold skeptics | Low |
| 6 | Review wall | 3 to 6 real reviews or customer photos | Reviews with photos and permission | Warm | Medium |
| 7 | Native post | Looks like a post or note, message first | One true, specific claim | Cold | Low |
| 8 | Founder note | Real founder photo, one quote | Real founder story | Cold and warm | Medium |
| 9 | Objection answer | One objection, one answer, one proof | Survey or support data on the objection | Bottom funnel | Low |
| 10 | Offer card | Price, offer, guarantee | Live offer, break-even done | Most-aware | Low |
| 11 | Bundle math | Units, price per unit, saving | Live bundle, break-even done | Most-aware | Low |
| 12 | How-it-works steps | 1, 2, 3 use or mechanism | Instructions or mechanism source | Problem and solution-aware | Medium |

Rules: a format without its proof is not allowed; pick a different one. Never use an AI-made person as a customer, reviewer or founder. Comparisons name "the usual way" unless a claim about a named rival is provable [MCR-0043]. A founder ad does not need the founder on camera; a quote or the founder's evidence works [MCR-0005].

### 2. Scan the account's own mix for gaps

1. Tag each ad from the last 90 days with its format number (step 1 list), its awareness stage and its concept, using fixed tags [MCR-0051].
2. Per format: number of ads, share of spend, store-side purchases, cost per purchase. A format "has been tested" only after 3 times target cost per purchase of spend [ADC-0039].
3. Flag problems: one concept taking about 80% of spend [ADC-0061]; cold ad sets with ad frequency above about 2 [MCR-0040]; no ads at all in cold, problem-aware stages on a broad account trying to grow (most volume belongs there on broad accounts [MCR-0057]; small stores under their warm demand can start lower in the funnel).
4. A **gap** is a format the store has proof for, that fills a flagged problem, and that was never tested or tested on too little spend.

### 3. Pick the format

Rank gaps by: fills the biggest flagged problem first, then lowest effort, then lowest production cost. Statics cost about a quarter of video, which matters most when returns are thin [MCR-0023]. One recommendation. Add a second format only when it fills a different gap and the budget funds both reads.

### 4. Use outside ads for structure only

Study competitors one or two sizes bigger and the ads they have run longest, but treat long-running as a hint, not proof: some are evergreen retargeting ads [MCR-0034]. Formats from outside the niche are often fresher [MCR-0055]. Record only structure: zones, order of reading, kind of proof, type sizes. Never reuse another brand's words, photos, illustrations, characters or distinctive look. If the store cannot make a reference ad's claim, keep the structure and use a claim from the proof table.

### 5. Same-day mode: specify one ad fully

- **Layout:** the family from `static-ad-layout-blueprint`, with zones in pixels for 4:5 (1080 x 1350) and, if needed, 9:16 (1080 x 1920) inside Reels safe zones.
- **Copy:** headline, support line, proof line, CTA, each with its character count. Clear or deliberately curious, never in between [MCR-0024]; curious ones go to a page that explains [MCR-0019].
- **Visual:** the real product photo file; background colour hex.
- **Proof:** the proof table row and its date. Reviews show a name and source [LPG-0037]. Discounts show the bigger number, money or percent [OFF-0017].
- **Production path:** a free editor (Canva free, Figma free, Photopea), the steps in order, about 30 to 60 minutes.

India: price inclusive of taxes as the site shows it; a cash-on-delivery badge only where COD is live.

### 6. Batch mode: rebuild several and review

1. Plan 4 to 8 ads, each a different format or concept; no two share format, concept and offer.
2. Build 4:5 and 9:16 as separate layouts, never a stretch.
3. Render each, view at full size and at phone size, and fix before anyone sees it.
4. Run every file through `prelaunch-ad-check`.
5. Deliver a review deck: one page or PDF with each ad at both sizes, its format, concept, claim sources, and a box for the owner's notes. Any free tool works; Figma is optional.
6. Revision rounds: up to two. A fault that survives two rounds needs a new approach or a question to the owner.

### 7. Grade formats on the store's own account

Launch only with the owner's yes. Then, per format, read at 3 times target cost per purchase on store-side purchases. Keep a `format-scorecard.csv`: format, ads launched, spend, store-side purchases, cost per purchase, gross profit per ad, hit rate. Hit rate is ads that spent more than 5% of the campaign budget at target cost per purchase, divided by ads launched; about 5% is normal in accounts launching dozens of ads a month, and noise below that [ADC-0017]. Next time, the gap scan weighs formats by their scorecard.

## Checks before you hand it over

1. The chosen format fills a named gap from the account scan, or the new-account default is stated.
2. Every format used has its required proof, with source and date.
3. No AI-made person appears as a customer, reviewer or founder.
4. No words, photos or art were taken from another brand's ad.
5. Price, offer and stock match the live page today; offers have break-even recomputed.
6. Both sizes are separate layouts inside their safe zones, viewed at full and phone size.
7. Every file passed `prelaunch-ad-check`.
8. Nothing was uploaded or launched without the owner's yes.

## Output

1. **One-screen summary:** the format chosen, the gap it fills, any second format and its gap, and the read date.
2. **Gap table:** format, ads, share of spend, store-side purchases, cost per purchase, tested (yes or no), proof available (yes or no), gap (yes or no).
3. **Ad spec** (same-day) or **review deck** (batch): per ad, format, concept, layout zones, copy with counts, proof rows, files at 1080 x 1350 and 1080 x 1920.
4. **`format-scorecard.csv`**, updated after the read.
5. **Proof used:** each claim with its source. A claim without proof is cut, not listed.

## Common mistakes

- **Picking the format the team likes.** Steps 2 and 3 pick from the account's gaps.
- **A review wall with stock or AI faces.** Step 1 allows real customers only.
- **Copying a competitor ad too closely.** Step 4 keeps structure and drops their words and art.
- **A bundle ad that loses money.** Gate 1 recomputes break-even.
- **Stretching 4:5 into 9:16.** Step 6 builds each size separately.
- **Judging formats on Ads Manager ROAS alone.** Step 7 grades on store-side purchases and gross profit per ad.

## Sources

- [OFF-0016]: recompute break-even for every offer.
- [ADC-0039]: judge after 3 times target cost per purchase.
- [MCR-0043]: one objection per ad; provable comparisons.
- [MCR-0005]: founder ads without the founder on camera.
- [MCR-0051]: tag every ad on the same fields.
- [ADC-0061]: one concept near 80% of spend is a risk.
- [MCR-0040]: cold ad frequency above 2 signals fatigue.
- [MCR-0057]: most broad-account volume in unaware and problem-aware ads.
- [MCR-0023]: statics cost about a quarter of video; gross profit per ad.
- [MCR-0034]: study bigger brands' longest-running ads, with care.
- [MCR-0055]: borrow formats from outside the niche.
- [MCR-0024]: a static is clear or a deliberate curiosity gap.
- [MCR-0019]: curiosity statics need a page that explains.
- [LPG-0037]: named reviews and press quotes.
- [OFF-0017]: show the discount as the bigger number.
- [ADC-0017]: creative hit rate, about 5% is normal.

What makes this skill ours: formats chosen from a scan of the store's own ad mix rather than taste; a proof requirement per format that blocks fake reviews and unpriced offers; outside ads used for structure only; a format scorecard graded on store-side purchases and hit rate, so the next pick is better.
