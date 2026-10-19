# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, honest plan that uses only the three fine-to-repeat facts, flags the 21 vs 20+ count mix-up, drops the fourth label to meet the glance rule, and stops correctly for the missing logo, typeface and photos. The owner gets a buildable Look-inside ad plan that borrows only the layout and makes no claim Sprout can't back.

## Judge list

- Met: Every spot marked keep has a named source you can check.
  Labels 1-3 cite "Product page, science page"; label 2 adds "Confirm the printed panel says 21 before export." Logo keep is blocked by MISSING.
- Met: Nothing from the reference survives except the layout.
  "Reference's own labels and claims | Not seen | Left behind entirely"; background switched to "#FFF7DF instead of the reference's colour".
- Met: Every line of copy has a label and a source, quotes match word for word.
  Copy table labels each line "Our line" or "Fact" with "Product page; science page"; no customer quotes used.
- Met: Brand name isn't typed; plan places logo or says missing.
  "Logo | Real Sprout logo file | MISSING: logo"; no copy line contains the brand name.
- Met: Headline 7 words or fewer, no more than 3 other things.
  "The headline is 6 words. With 3 labels, that is the headline plus 3 things to read."
- Met: Verdict follows the rule.
  "Main spot: passes... under half, so this is still the same ad... Type switch: none." Change count omits the background (3 of 9, not 2) but conclusion holds.

## What went in

```text
Brand file: Sprout, daily greens gummies (pasted below: facts,
fine and risky claims, colours, Work Sans, voice, show-it-right
rules).
Photos: the pouch on a soft gradient and gummies poured into a
hand exist. Not attached.
Logo: not attached.

Reference (I can only describe it): another brand's ad. Their
product sits dead centre on a flat colour. Four thin lines run out
to four short labels, two on each side. Short headline across the
top, logo small at the bottom.

Direction: "Use this to show what's in one daily pack, for people
who quit greens powders."
Sizes: 4:5 and 9:16.

[attached: sprout/brand.md]
```

## What came out

```text
# Sprout · Centre-and-labels reference → "What's in one daily pack"

## 1. Kit check

| Item | Status |
|---|---|
| Brand facts | On hand (sprout/brand.md, updated 2026-10-18) |
| Logo file | **MISSING: logo.** Not attached. Nothing is built without it. |
| Typefaces | **MISSING: typeface.** Confirm Work Sans (Bold, Medium) is installed. The brand's chunky display font is not named, so this plan uses only Work Sans. |
| Photo: gummies poured into a hand | **MISSING: photo.** It exists but is not attached, so it counts as absent. This is the planned centre image. |
| Photo: pouch on soft gradient | **MISSING: photo.** It exists but is not attached. Fallback only. |
| Photo: daily pack torn at the top, gummies spilling | **MISSING: photo.** Not on file. This would be the most exact centre image if one exists. |
| Way to make images | Not needed for the main picture. The background is a flat colour set in HTML, so only a cut-out of the real hand photo is needed. |
| Live offer | Not used. This is not an offer ad. |

## 2. Reading the reference

- **Source:** the owner's description only. No image was seen. Nothing below describes details beyond that description.
- **Code (reference):** Look inside · Designed · audience unknown from the description.
- **Skeleton:** Centre and labels.
- **Eye path (inferred from the described layout):**
  1. The product, dead centre.
  2. The headline across the top.
  3. The four labels.
  4. The logo, small at the bottom.
- **Share of frame (estimated from the description, not measured):** picture about 35–40%, words about 15%, space about 45–50%.
- **The one move:** a single product isolated on flat colour, with thin lines tying each short fact to the thing itself. The contents feel physically inside the product.
- **Main spot:** the labels. They carry the point, and the product is their anchor.

## 3. Spot test

| Spot | What it claims | Proof needed | Proof on hand | Verdict |
|---|---|---|---|---|
| Flat background | Nothing | n/a | n/a | **Change:** use Sprout cream #FFF7DF instead of the reference's colour. |
| Product, dead centre | "This is the product, and the labels are its contents" | A real photo of the exact variant at a usable angle | Hand-with-gummies photo exists but is not attached; no open daily-pack photo | **Change:** show one pack's worth of green Original bears in a palm, not a packaged product. The forearm enters from the bottom edge, with the palm at centre. The labels describe one pack, so a 28-pack pouch in the centre would mismatch the unit. If the hand shot won't cut out cleanly, use a torn-top daily pack photo (MISSING). |
| Headline across top | Sets the unit and the reason to care | Room for ≤7 words | Brand voice and the old-way enemy on file | **Keep** the position, with new words. The headline must name "one daily pack" so the labels read per pack, not per gummy. |
| Label 1 | "60+ ingredients" | Source | Product page, science page (fine-to-repeat list) | **Keep**, with new words. |
| Label 2 | "21 vitamins & minerals" | One figure, one source | Product and science pages say 21. The home page and ingredients panel say "20+" / "over 20". | **Keep, with a flag.** 21 is consistent with "20+" and is on the fine list. Confirm the printed panel says 21 before export. |
| Label 3 | "6 g prebiotic fiber" | Source | Product page, science page | **Keep**, with new words. |
| Label 4 | n/a | n/a | n/a | **Drop.** A headline plus 4 labels is 5 things to read, which breaks the "headline + max 3" glance rule. A fourth fact (greens list, methylfolate) would also need its own proof line. |
| Thin leader lines | Nothing | n/a | n/a | **Keep:** 3 lines, 3 px, deep forest #002C17. |
| Logo, small at bottom | The brand | The real mark as a file | None attached | **Keep**, as Sprout's real logo file. Blocked by MISSING: logo. |

## 4. Verdict

- **Main spot:** passes. All three labels are on-file facts.
- **Structural changes:** 2 of 9 spots (product treatment, label count 4→3). The rest keep their place and take Sprout's own words and colours. That is under half, so this is still the same ad.
- **Type switch:** none. It stays a Look inside ad under "What is it?".
- **Audience:** set to New, because the direction targets people who quit greens powders and may not know Sprout.
- **New code:** Look inside · Designed · New.

## 5. Plan

**Direction (word for word):** "Use this to show what's in one daily pack, for people who quit greens powders."

**Product variant:** Sprout Original (Adults), "Fresh & Sweet". Small opaque deep-green bears, no limited-flavour shapes. Low Sugar unless the owner says otherwise.

**Doubt it answers:** "A gummy can't hold enough to replace my powder." The ad shows what's in the pack and does not claim it replaces anything.

**Eye path (planned):** handful of green bears → headline → 60+ → 21 → 6 g → logo.

### Zones, 4:5 (1080 × 1350)

| Zone | Top–bottom | Content |
|---|---|---|
| Headline | 6–20% | 2 lines, centred, Work Sans Bold ~88 px, #002C17 |
| Picture + labels | 22–86% | Palm with gummies centred. Forearm enters from bottom-centre and crops at the frame edge. Labels zig-zag: L1 left-upper, L2 right-middle, L3 left-lower. |
| Logo | 88–95% | Bottom-right, about 180 px wide, clear of the forearm |
| Background | full frame | Flat #FFF7DF |

### Zones, 9:16 (1080 × 1920), composed on its own

Words are kept between 14% (269 px) and 65% (1248 px).

| Zone | Top–bottom | Content |
|---|---|---|
| Top cover band | 0–14% | Cream only |
| Headline | 16–25% | Same 2 lines, ~92 px |
| Picture + labels | 27–58% | Palm centred, same zig-zag labels, slightly tighter |
| Logo | 59–64% | Bottom-right of the safe area |
| Bottom cover band | 65–100% | Forearm runs down out of the frame. Picture only, no words. |

### Copy, in reading order

| # | Line | Words | Set as | Label | Source |
|---|---|---|---|---|---|
| 1 | One daily pack. | 3 | Headline line 1 | **Our line** | n/a |
| 2 | No chalky shaker. | 3 | Headline line 2 | **Our line** | Names the old way, unbranded (brand file: "chalky powders") |
| 3 | 60+ / ingredients | 2 | "60+" Bold 64 px, "ingredients" Medium 34 px | **Fact** | Product page; science page |
| 4 | 21 / vitamins & minerals | 4 | "21" Bold 64 px, words Medium 34 px | **Fact** | Product page; science page (confirm against printed panel) |
| 5 | 6 g / prebiotic fiber | 3 | "6 g" Bold 64 px, words Medium 34 px | **Fact** | Product page; science page |

- The headline is 6 words. With 3 labels, that is the headline plus 3 things to read.
- There are no conditions to place, since there is no offer, guarantee or rating.
- All type is ≥34 px except the logo.
- Contrast: #002C17 on #FFF7DF is well above 7:1.

### Claims table

| Line | Label | Source | Keep / cut |
|---|---|---|---|
| One daily pack. No chalky shaker. | Our line | n/a | Keep. Says nothing about results. |
| 60+ ingredients | Fact | Product page | Keep |
| 21 vitamins & minerals | Fact | Product/science page | Keep. Flag the "20+" mix-up and confirm the panel. |
| 6 g prebiotic fiber | Fact | Product/science page | Keep. No "supports gut health" line is added, so no FDA disclaimer is needed on the image. |
| "Each gummy delivers 100%…" | n/a | Science page (wrong unit) | **Cut.** The facts are per pack. |
| "60+ potent ingredients to revive…" | n/a | Product page (unsupported) | **Cut** |
| "Replaces your greens powder" or any equivalence | n/a | None | **Cut**, never written. |
| Reference's own labels and claims | n/a | Not seen | Left behind entirely |

### Assets table

| Slot | Source | Status |
|---|---|---|
| Background | Flat #FFF7DF set in HTML | Ready |
| Palm with green bears (centre) | Real photo: "gummies poured into a hand", cut out at 2× | **MISSING: photo** |
| Fallback centre: daily pack torn straight across the top, bears spilling into a palm | Real photo | **MISSING: photo** (not on file) |
| Leader lines | Drawn in HTML, #002C17 | Ready |
| Headline and labels | Work Sans Bold / Medium | **MISSING: typeface** (confirm installed) |
| Logo | Real Sprout logo file | **MISSING: logo** |
| Generated imagery | None planned | n/a |

### Risks

1. **Unit:** the headline must say "One daily pack" so no one reads the labels as per gummy.
2. **Count:** 21 vs "20+" on the brand's own pages. Confirm the printed panel.
3. **Handful size:** the photo must show about one pack's worth (about 20 g, "a small handful"). If it shows more, the labels mislead. Confirm with the owner, or crop to fewer bears without altering them.
4. **Variant facts:** confirm 60+ / 21 / 6 g are identical for Low Sugar and Sugar-Free if a Sugar-Free photo is used.
5. **Photo rights:** confirm the hand photo is the brand's own and cleared for ads. It shows a hand only, with no face.
6. **Cut-out quality:** a floating hand can look odd, so the forearm stays attached to the bottom edge in both sizes.
7. **Show it right:** if the daily-pack fallback is used, it must be torn straight across the top edge only. The big pouch is never shown torn.

### Revision log

- v0: plan written. Reference read from the owner's description. Label count cut from 4 to 3 (glance rule). Centre changed from packaged product to a palm of bears (unit match). No type switch.

**Stop: this plan needs the owner's approval.** Build, export checks and the review deck follow once approved and the logo, typeface and photos are supplied.
```
