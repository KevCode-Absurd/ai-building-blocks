# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, usable ad that opens on the powder-quitter's own experience and answers the 'not enough' doubt with two exact label facts, with correct character counts (118 and 31). The notes are thorough and honest about what was left out and why, and every gap (landing page, how the pack opens, sugar content) is marked MISSING rather than guessed.

## Judge list

- Met: First line names something this buyer feels or has done, not the product name
  "Quit greens powder over the taste and the shaker?" opens on the buyer's own experience; product name never appears.
- Met: A fact backs every claim (two lines checked against the product page)
  "21 vitamins and minerals, 6 g prebiotic fiber" and "small handful of green gummy bears" both sit in the run input and the page Directions.
- Met: Nothing says fix, best, clinically proven or an unbackable result
  Copy is "6 g prebiotic fiber. No shaker."; notes confirm "No energy, immunity, weight or 'fix' wording appears."
- Met: Image shows the product used the real way (pack torn across the top)
  "A hand holds one daily pack, already open"; tear direction not in the file it was sent, flagged "MISSING: How the pack is opened".
- Met: Could not be any brand in the category
  "One daily gummy pack: 21 vitamins and minerals, 6 g prebiotic fiber" ties the line to this product's specific dose and format.

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
AD COPY: Facebook image ad (main text under 125, headline under 40)

MAIN TEXT (118)
Quit greens powder over the taste and the shaker? One daily gummy pack: 21 vitamins and minerals, 6 g prebiotic fiber.

HEADLINE (31)
6 g prebiotic fiber. No shaker.

IMAGE
A hand holds one daily pack, already open, with the small handful of green gummy bears inside. The full pouch sits next to it, labelled as holding 28 individual packs. This matches the page's own directions: "Grab a single pack daily and enjoy the small handful of green gummy bears inside."

- **What to leave out:** no glowing skin, no energy or "after" shots, no measured results, no overlaid percentages beyond the two facts in the text.
- **Optional:** an empty, clean shaker bottle set aside in the background, to show the switch.
- **What to avoid in the optional shot:** no rival brand, no comparison claim.
- **Label:** if the real Supplement Facts panel is legible in a real photo, it can be shown. Don't recreate it.
- **Footage:** this is an illustration. There is no proof footage. Use a real product photo, not a generated scene.

NOTES
Reason chosen:   This buyer liked what the powder did but hated the taste and the shaker. Their doubt is that a gummy can't hold enough. A concrete count (21 vitamins and minerals) and a concrete dose (6 g prebiotic fiber) answer "enough" directly. Fiber is also tied to the one allowed benefit, "supports digestion and gut health."

Fact behind it:  "1 daily pack = 60+ ingredients, 21 vitamins and minerals, 6 g prebiotic fiber, in a small handful of gummies" (your product facts, from the product and science pages). The gummy format and pack use come from the product page's Directions.

Conditions kept:
- "Daily pack" is kept, so the count is per pack, not per gummy.
- "Vitamins and minerals" is kept together, never shortened to "21 vitamins."
- The ad does not say it replaces a powder or matches one nutrient for nutrient. No equivalence is proven.
- No energy, immunity, weight or "fix" wording appears.

Not used:
- **"About 100% of daily value for vitamins":** it's strong, but minerals are only about 25%. It doesn't fit in 125 characters without the mineral limit, and leaving that limit out would overstate "enough."
- **60+ ingredients:** a big number that doesn't prove "enough." The page also says "over 20" vitamins and minerals in the ingredients panel, which conflicts with 21.
- **The 12-week study (vitamin C up 40.1%, folate up 20.5%):** it measures absorption of 2 vitamins only. Too narrow and too technical for a first ad to this buyer.
- **Cost per serving ($1.26 vs $3.60 for powders):** the comparison has no source. $1.07/day applies to the first box only, and renewal is $49.99 ($1.78/day).
- **Discounts:** 52%, 55%, 61%, 49% and 58% all appear in different places. Each needs the SMS sign-up, and none is consistent.
- **Guarantee:** it covers the first order only.
- **Ratings:** four different figures are shown (4.8, 4.75, 4.74, 4.0).
- **Survey figures (67% digestion, 52% energized):** self-reported, and energy is not allowed.
- **Vegan, pectin base, Low Sugar or Sugar-Free:** true, but they don't answer "enough."

MISSING:
- Landing page: no destination or page was given to match the next step.
- How the pack is opened (tear notch or otherwise).
- The Supplement Facts panel confirming 21 vitamins and minerals and 6 g fiber per pack. The page says "over 20."
- A nutrient-by-nutrient comparison with a typical greens powder, which would let the ad say more about "enough."
- Sugar and sugar-alcohol content per pack for each sugar level. The Sugar-Free panel was not captured, and sugar alcohols can upset the stomach of a gut-focused buyer.
- Real product photography or proof footage.

CHECKS MISSED    none

Next, do you want to run this through the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), write the matching landing page with the [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer), or something else you'd like to type?
```
