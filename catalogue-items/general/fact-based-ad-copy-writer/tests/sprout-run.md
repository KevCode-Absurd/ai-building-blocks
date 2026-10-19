# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-sonnet-5-5. Judge list: 2 of 5 met. Invented facts: 2.

The copy is factually careful and keeps the "about" qualifiers, with sensible MISSING notes. But it opens on a spec list rather than the buyer's doubt, the image skips the torn-top detail, and the lines could belong to any gummy brand.

## Fix

In step 4, require the first line to open on the buyer's doubt or experience (e.g. the powder they quit) with the fact as the answer; in step 5, require the image to show the pack torn straight across its top edge.

## Judge list

- Not met: First line names something this buyer feels or has done, not the product name
  Main text opens "One daily pack of gummies: 21 vitamins and minerals..." and never names the powder quitter's doubt or experience.
- Met: Every claim traces to a fact; two lines checkable against product page
  21 vitamins/minerals, about 100% DV vitamins, about 25% minerals, 6 g prebiotic fiber all in the inputs; "No shaker" backed by page.
- Met: Nothing says fix, best, clinically proven or an unbacked result
  No such words in the main text or headline; the study and result claims were left out.
- Not met: Image shows product used the real way (pack torn across the top)
  "one opened daily pack with the small handful of gummies in an open palm" never says torn straight across the top edge.
- Not met: Not generic: could not be any brand in the category
  Main text is a vitamin and fiber list; the headline "No shaker. One pack of gummies a day." fits any gummy brand.

## Invented

- number: Main text (119 characters) (Actual length is roughly 120 characters, so the count is close and may be slightly off; minor.)
- other: Button: Shop Now (leads to sprout.example/products/sprout) (Destination URL assumed; page is the Adults product page, but the run input never named a landing page.)

## Safety

- The image note suggests the nutrition label beside the pack so the full facts are visible, yet "about 100% DV vitamins" in the main text sits close to a claim about quantity that is not compared against any powder, which could read as answering the doubt "replace my powder" without proof.

## What went in

```text
Product facts (from the product page and science page):
- 1 daily pack = 60+ ingredients, 21 vitamins and minerals,
  6 g prebiotic fiber, in a small handful of gummies
- About 100% of daily value for vitamins, about 25% for minerals
- Vegan, pectin base. Low Sugar or Sugar-Free
- Study: 12 weeks, 120 adults, blood vitamin C up 40.1%,
  folate up 20.5% vs placebo (absorption only)
- Allowed: "supports digestion and gut health"
- Not allowed: "fix", weight loss, energy or immunity results

Buyer: people who quit greens powders because of the taste and
the shaker. Doubt: "A gummy can't hold enough to replace my powder."

Format: Facebook image ad. Main text under 125 characters,
headline under 40.

[attached: sprout/product-page.md]
```

## What came out

```text
**Main text (119 characters)**
One daily pack of gummies: 21 vitamins and minerals (about 100% DV vitamins, about 25% minerals) + 6 g prebiotic fiber.

**Headline (37 characters)**
No shaker. One pack of gummies a day.

**Button:** Shop Now (leads to sprout.example/products/sprout)

---

**Image note**
Use a real photo, not a generated scene. Show one opened daily pack with the small handful of gummies in an open palm. Put the pouch or the nutrition label beside it so the full facts are visible, including the roughly 25% of daily value for minerals. There is no shaker, glass or powder in the shot.

Do not show a side-by-side "dose vs. a powder" comparison, energy or glow, or any before/after. The facts support none of these. The picture makes the same promise as the words: this is what one daily pack holds, and it is gummies you eat from the pack.

MISSING: confirmation that a real photo of one pack in hand exists. The page gallery was inferred from file names, not seen.

---

**Notes**

- **Buyer in one line:** They quit greens powders because of the taste and the shaker, and they doubt a few gummies can hold enough. Sprout gives them a measured daily pack they eat straight from the sachet, with nothing to mix and nothing to clean.

- **Reason chosen:** Answer the "can't hold enough" doubt directly, with what one pack contains.

- **Facts behind it and their source** (product facts provided, matching the product page):
  - 1 daily pack contains 21 vitamins and minerals.
  - It gives about 100% of daily value for vitamins and about 25% for minerals.
  - It contains 6 g prebiotic fiber.
  - It comes as "a small handful of gummies."
  - The headline's "one pack a day" and "no shaker" rest on the Directions: "Grab a single pack daily" from a pouch of 28 individual packs. They also rest on the page's "No more ... sloshing chalky powders."

- **Conditions kept:**
  - "About" stays on both percentages.
  - The minerals figure (about 25%) is shown next to the vitamins figure, not hidden. This buyer's doubt is about quantity, so dropping it would mislead.

- **Strong facts left out, and why:**
  - **"60+ ingredients":** This is a big number with no amounts per ingredient. It doesn't prove there is "enough," which is the buyer's doubt.
  - **The 12-week study** (blood vitamin C up 40.1%, folate up 20.5% vs placebo): It measures absorption of 2 vitamins only. It doesn't answer "how much is in it," and in an ad it would read as a broader result claim.
  - **"Supports digestion and gut health":** This claim is allowed. It was left out to keep within 125 characters and to stay on the quantity doubt. It's a good candidate for a second variant.
  - **Taste:** The page asserts good taste, but the latest reviews include "the taste is off." Saying "tastes great" would be a boast, not a checked fact.
  - **Prices, discounts and guarantee:**
    - The page shows conflicting discounts (52%, up to 55%, 55%, 61%, 49%, 58%).
    - The $29.99 price depends on an SMS sign-up, which only the footer reveals.
    - The plan renews at $49.99.
    - The guarantee covers the first order only.
    - Any offer line under 125 characters would drop one of these terms, so no offer is mentioned.
  - **Energy, immunity, "mental clarity," "replace your powder":** These are not allowed or not supported. Nothing in the facts compares Sprout's amounts with a powder's.

- **Things to fix or confirm before running:**
  - MISSING: whether the vitamin count is "21" or "over 20." The page uses both, and the ad uses 21 from the product facts.
  - MISSING: content of the Low Sugar vs. Sugar-Free panel, including any sugar-alcohol warning. The ad avoids the sugar options, but gut-focused buyers who land on the page may pick Sugar-Free without that warning.
  - MISSING: share of mobile visitors and what fits on the first phone screen. On the landing page the plan box and button likely sit below the fold.
  - MISSING: whether Subscribe & Save is preselected. "Shop Now" leads to a page that probably defaults to a subscription, which this powder-quitting buyer may already be wary of.

---

**Score: 5 / 5 checks passed = 100**

| Check | Result |
|---|---|
| Every selling line traces to a fact given | Pass |
| No "unique", "best" or result claim without proof | Pass |
| Numbers keep exact wording and conditions | Pass ("about" kept on both; minerals shown) |
| Picture and words make the same promise | Pass (real pack-in-palm photo with label, no result imagery) |
| Says only as much as this buyer is ready for | Pass (they know the category and the powder problem; the ad answers their stated doubt and makes no new promises) |

No checks missed. The score measures the copy against its own checks, not how the ad will perform.
```
