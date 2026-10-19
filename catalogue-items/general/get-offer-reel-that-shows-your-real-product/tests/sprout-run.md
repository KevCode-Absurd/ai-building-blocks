# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 1 of 5 met. Invented facts: 0.

The run did exactly what the skill demands at this point: a careful brief and product card with no invented facts, full offer terms kept intact, and a hard stop for approval. But it never reached the storyboard, build or review log, so four of the five judge criteria cannot be shown met, and it over-marked MISSING for facts (claim sources, never-show rules, label text) that sit in Sprout's own brand file.

## Fix

In Stage 0, add: "Before writing MISSING, pull claim sources, the never-show list and product rules from the brand file; mark MISSING only for what the files and input truly lack." Also note in Stage 1 that the daily pack, not the big pouch, is the thing torn (brand's Show-it-right rule).

## Judge list

- Met: Stopped for approval on product card, sheets and storyboard; built nothing before APPROVED
  "Approval 1 of 3: Please reply APPROVED to this product card... Stage 2 ... does not start until then." Nothing was built.
- Not met: Product on screen in first frame, identifiable by 2 seconds muted
  Only planned: "Opening, done by 2 s, with the pouch in the first frame". No storyboard or render exists yet.
- Not met: Every storyboard word has a source; full price terms on screen
  No storyboard. Brief has a sources table but marks label and study sources MISSING though brand.md has them.
- Not met: Something new every 2 to 4 seconds; end card 2 seconds or less
  No shot list or beat grid produced; run ended at approval 1.
- Not met: Review log shows three or more rounds, every score 8 or more
  No Stage 5, no review log, no renders.

## What went in

```text
Purpose: a "reasons" reel for Sprout, 15 to 20 seconds.
Shapes: 9:16 and 4:5. Music: made in code. Voice: none.
Photos on file: the pouch on a soft gradient; an adult pouring
gummies into a hand.
Approved words and claims:
- "Rip. Tip. Enjoy."
- Title: "Sprout Superfood Gummies"
- "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack
- No water, no mixing, no shaker
- 2025 study, 12 weeks, 120 adults: vitamin C +40.1% (2.7x placebo)
Offer: $29.99 first order with the text sign-up discount. "Renews
at $49.99 each 4 weeks." Button text: "Start Now".
Colours: cream #FFF7DF, deep forest #002C17, sunflower #FFCC2E.
Fonts: Work Sans bold and medium, DM Mono.
```

## What came out

```text
# File 1: Filled brief, Sprout "reasons" reel

| Field | Entry |
|---|---|
| Brand / product | Sprout Superfood Gummies (variant, flavour and pack size: see Q1) |
| Reel's job | "Reasons" reel. Up to three brand facts, each paired with the photo that shows it, then the offer. |
| Length | 15 to 20 s (working target: 18 s) |
| Shapes | 9:16 (1080×1920) as the main shape, then 4:5 (1080×1350) |
| Frame rate / output | 30 fps, H.264, yuv420p, AAC, fast-start |
| Music | Written in code, with a beat grid measured from the render |
| Voice | None |
| Placement / audience | Assumed: paid social feed, watched muted, adults (see Q8) |
| Reference video | None given. Rhythm will come from the beat grid only. |
| Colours | Cream `#FFF7DF` (ground), deep forest `#002C17` (type and ink), sunflower `#FFCC2E` (proposed single accent, see Q6) |
| Fonts | Work Sans Bold (display), Work Sans Medium (text), DM Mono (figures and terms). Font files needed: see Q5. |
| Logo | `MISSING: logo file` |
| Photos on file | (a) Pouch on a soft gradient. (b) Adult pouring gummies into a hand. |
| Never-show list | `MISSING: never-show list` |

**Approved words as supplied. Proposed on-screen order, to be confirmed in Q2:**

1. Opening, done by 2 s, with the pouch in the first frame: "Sprout Superfood Gummies"
2. Reason 1: "60+ ingredients, 21 vitamins & minerals, and 6g fiber" + "in 1 pack"
3. Reason 2: "No water, no mixing, no shaker"
4. Reason 2 tag: "Rip. Tip. Enjoy."
5. Proof: "2025 study, 12 weeks, 120 adults: vitamin C +40.1% (2.7x placebo)"
6. End card: "$29.99 first order with the text sign-up discount" / "Renews at $49.99 each 4 weeks." / button "Start Now"

**Claims and their sources:**

| Claim | Source |
|---|---|
| 60+ ingredients, 21 vitamins & minerals, 6g fiber, in 1 pack | `MISSING: source (label or supplement facts panel)` |
| No water, no mixing, no shaker | Product format. Please confirm that this is approved as a brand fact. |
| 2025 study: 12 weeks, 120 adults, vitamin C +40.1%, 2.7x placebo | `MISSING: study citation` and `MISSING: exact measure` (for example, whether +40.1% is a blood vitamin C level). The words will stay exactly as given unless you supply replacements. |
| $29.99 first order / renews at $49.99 each 4 weeks | `MISSING: offer dates and full terms` as stated on the live offer |

**Questions. Please answer all of them in one reply:**

1. **Variant.** Which exact flavour and pack is in the pouch photo? Is "1 pack" a single daily pouch? Please type out the words printed on the front label so they can be locked.
2. **Word order.** Confirm or change the order above. Can "Rip. Tip. Enjoy." pair with the pour shot? Or should it be the opening line, with the title second?
3. **Photos.**
   - `MISSING: pouch front on a clean, flat background`. The soft gradient makes clean cut-out edges harder. If no other version exists, I will cut out the gradient shot and show you the edges at approval 2.
   - `MISSING: unpacked shot (gummies out of the pouch)` for Reason 1. Without it, Reason 1 runs on the pouch front.
   - The pour shot will cover both the `hand` and `use` jobs unless you have more photos.
4. **Offer.** Are "$29.99 first order with the text sign-up discount" and "Renews at $49.99 each 4 weeks." the exact on-screen wording? What dates does the offer run? Is there any further terms line that must appear?
5. **Font files.** Please send the Work Sans Bold, Work Sans Medium and DM Mono files you use. Otherwise, confirm that the Google Fonts (OFL) versions match.
6. **Accent.** Sunflower is proposed as the only accent, used on one key word or on the second phrase. Forest and cream are base colours. Confirm.
7. **Guarantee.** Is there guarantee wording to include? It is optional, and nothing will be added without it.
8. **Placement.** Which platforms, and is any audience to be avoided?
9. **End card.** Is "Start Now" the full call to action, or does it need a URL or a handle?

# File 2: Product card, Sprout Superfood Gummies

**Exact variant:** `MISSING: flavour / pack size` (see Q1). The pouch appears exactly as shown in photo (a).

**Photo jobs:**

| Job | File | Use in reel |
|---|---|---|
| `front` | (a) Pouch on soft gradient. A clean-background version is requested. | Opening hero, Reason 1 (unless an unpacked shot arrives), proof shot, end card |
| `unpacked` | `MISSING` | Reason 1 (what's inside) |
| `hand` | (b) Pouring gummies into a hand | Reason 2 |
| `use` | (b), same file | Reason 2 / "Rip. Tip. Enjoy." |

**What never changes:**

- **Proportions:** the pouch is shown at its photographed aspect ratio and only ever scales as a whole. It is never stretched, warped, retouched or recoloured.
- **Label words:** reproduced only as printed in photo (a). `MISSING: transcription of front-label text` for the lock list. No on-screen type ever crosses the label.
- **Colours:** the pouch keeps its photographed colours. Brand colours apply to the set and type only, never to the pack.
- **How it opens:** by tearing ("Rip"), then the gummies are tipped out ("Tip"), as in photo (b). This is to be confirmed. Opening is never animated or redrawn, and is only shown through the real pour photo.
- **Gummies:** shown only as they appear in photo (b), or in an unpacked photo if one is supplied. They are never generated or duplicated.
- **Shadow:** a soft contact shadow is added in the film, not baked into the photos.

**Approval 1 of 3:** Please reply APPROVED to this product card, along with your answers to Q1 to Q9. Stage 2 (photo picks and project folder) does not start until then.
```
