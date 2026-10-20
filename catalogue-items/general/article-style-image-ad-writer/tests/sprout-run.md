# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, honest comparison ad that sticks to the five approved facts, keeps the powder unbranded and under 20 words on the image. It correctly tells the owner the current product page won't pay off the headline and lists exactly what a matching page needs, including the renewal price and first-order-only guarantee.

## Judge list

- Met: The headline names no brand and reads like an editor wrote it, not a slogan.
  "Greens powder vs. one greens gummy pack": no brand, a plain comparison framing about the thing, not a tagline.
- Met: The image headline, the first line of the main text and the top of your page make the same claim.
  Image, first line ("here's what fits in one daily pack") and sub-headline align; page mismatch honestly flagged: "Page check: the claim fails."
- Met: Nothing suggests independent reporting. No publication name, byline, expert or 'as seen in' that isn't real.
  Brief forbids "lab coats, mastheads, newspaper logos, seals or star ratings"; no byline or source invented.
- Met: Every figure and outside name in the ad is in your brand facts. No competitor is named or shown.
  60+, 21, 6 g, 70 pesticides, 4 heavy metals all from input; powder shown as "plain, unbranded scoop".
- Met: The image has 20 words or fewer. Count them.
  "Word count: 19, or 20 if '&' counts as a word." Recount confirms 19/20.

## What went in

```text
Selling idea: compare a greens powder with a greens gummy, for
people who quit powders. How much they know: comparing solutions.

Brand facts:
- 1 pack a day, eaten from the pack. No water, no mixing, no shaker.
- Per pack: 60+ ingredients, 21 vitamins & minerals, 6 g prebiotic
  fiber
- 2025 study: 12 weeks, randomized, placebo-controlled, 120 adults.
  Blood vitamin C +40.1%, folate +20.5%. Approved: "Clinically
  tested for nutrient absorption"
- Third-party tested for 70 pesticides and 4 heavy metals
- Buyer doubt: "A gummy can't hold enough to replace my powder."
- Don't use: the "$1.26 vs $3.60" price comparison (dated)

Landing page (product page, first screen, top to bottom):
discount announcement bar, product photos, title "Sprout Superfood
Gummies", "60+ potent ingredients to revive whole body vitality in
great tasting gummies.", rating 4.8/5.0 (100,000). A section called
"Us vs. Them" sits far down the page.

[attached: sprout/product-page.md]
```

## What came out

```text
I can't make pictures in this chat, so you'll get the image brief to finish elsewhere (steps at the end).

## On the image
- **Headline:** "Greens powder vs. one greens gummy pack"
- **Supporting line:** none. The two columns carry it.

## Main text
Greens powder vs. a greens gummy: here's what fits in one daily pack.

A greens powder is a scoop stirred or shaken into water, often in a shaker bottle. Sprout Superfood Gummies come as one pack a day, eaten straight from the pack. There's no water, no mixing and no shaker.

The usual doubt from people moving off powders is that a gummy can't hold enough. Each Sprout pack lists 60+ ingredients, 21 vitamins and minerals, and 6 g of prebiotic fiber.

Sprout is clinically tested for nutrient absorption. It is also third-party tested for 70 pesticides and 4 heavy metals.

Tap to see the full per-pack ingredient list and how the two formats compare side by side.

## Headline under the image
Greens powder vs. greens gummy: what's in one pack

## Image brief
- **Layout:** a two-column comparison card on a plain light background. The headline runs across the top as the column headers, with "Greens powder" over the left column, "vs." in the middle and "One greens gummy pack" over the right column. A thin divider separates the columns.
- **What's shown:**
  - **Left column:** a plain, unbranded scoop, a glass of water and a shaker bottle. Do not show any real powder brand or label.
  - **Right column:** the three facts as a short stacked list.
  - **Product:** the real Sprout Original pouch or a single pack, from the brand's own photo, small in the bottom-right corner. Do not restyle the pack or change its label.
  - **Not allowed:** no lab coats, mastheads, newspaper logos, seals or star ratings.
- **Exact words:**
  - "Greens powder"
  - "vs."
  - "One greens gummy pack"
  - "Scoop, water, shaker"
  - "60+ ingredients"
  - "21 vitamins & minerals"
  - "6 g prebiotic fiber"
- **Word count:** 19, or 20 if "&" counts as a word.
- **Type:** set all words as real type in Figma over the image or photo. Do not generate the words inside the picture.
- **Prompt for the picture only (no text):** "Clean two-column product comparison layout, soft light background, left side a plain unbranded measuring scoop of green powder beside a glass of water and a plain shaker bottle, right side empty space for a text list, small area bottom-right left clear for a product photo, flat even lighting, minimal, no text, no logos."

## Notes
**Sections the page must cover, in this order:**
1. **First screen:** the same claim as the ad. Show the powder vs. gummy pack comparison and the three per-pack facts (60+ ingredients, 21 vitamins & minerals, 6 g prebiotic fiber).
2. **How it's taken:** one pack a day, eaten from the pack, with no water, mixing or shaker.
3. **The "is it enough?" answer:** the full per-pack ingredient and nutrition label, visible without opening an accordion.
4. **The study, described honestly:** 12 weeks, randomized, placebo-controlled, 120 adults. Blood vitamin C rose 40.1% and folate rose 20.5%. Say plainly that these are the two nutrients it measured.
5. **Testing:** 70 pesticides and 4 heavy metals, by a third party.
6. **Reviews from people who switched from powders:** the "Vs Powders" review theme, moved up from the bottom of the page. Use one rating, with its platform named.
7. **Offer, stated plainly:**
   - The first-box price and the $49.99 renewal, side by side.
   - Any condition, such as the text-message sign-up, next to the price.
   - The guarantee, labelled as first order only.

**Page check: the claim fails.**
- The first screen shows a discount bar, then "revive whole body vitality", then a rating. Nothing there mentions powders, the pack contents or the comparison.
- "Us vs. Them" sits far down the page and leads with the dated price comparison you said not to use.
- **Fix:** send the ad to a page built for it, or to a version of the product page that opens on a rewritten, price-free powder vs. gummy comparison. Drop or quiet the discount bar on that version, because a deal-led first screen breaks the explanation the ad promised.

**Page check: the label passes for now.**
- The product page isn't laid out like an article, so it doesn't need an "Advertisement" label.
- If you build an article-style page for this ad, put "Advertisement" just above its headline.

**Claims left out for lack of proof or by your rule:**
- **"$1.26 vs $3.60":** the dated price comparison you ruled out.
- **"Replaces handfuls of health products" and "replace your powder":** no proof that the two are equal.
- **"Revive whole body vitality", immunity, stress relief and mental clarity:** the study only measured vitamin C and folate.
- **Survey figures (67% digestion, 52% energy):** customer self-reports, not in the facts you gave.
- **Every discount percentage:** six conflicting figures, and leading with a deal weakens this format.
- **Star ratings and "1M+ customers":** four different ratings across sources.

**Fix on the page:** the vitamin count says "21" in one place and "over 20" in another. Make it 21 everywhere.

**MISSING:**
- **MISSING: brand look.** Colours, fonts and the exact pack photo file.
- **MISSING: facts on greens powders' contents per serving.** The comparison stays on how each is taken, not on what's in a powder.
- **MISSING: customer words from powder quitters.** The main text is written from the product and the one doubt you gave (inferred).
- **MISSING: a landing page whose first screen pays off this headline.**
- **MISSING: rating source.** The platform behind the rating, and which of the four figures is current.
- **MISSING: whether the counts hold for both versions.** Check that 60+ ingredients, 21 vitamins & minerals and 6 g prebiotic fiber apply to both Low Sugar and Sugar-Free.

## CHECKS MISSED
- **One claim from the image headline to the top of the page:** fails. The product page's first screen leads with a discount and "vitality", not the powder vs. gummy comparison. This can't be fixed in the ad. It needs the page change above.

---

**To make the picture:**
- **ChatGPT or Gemini:** paste the prompt above and ask for the image. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude.
- **Claude Code:** with `OPENAI_API_KEY` or `GEMINI_API_KEY` saved, I can send the prompt to that API and save the file. OpenAI or Google bills each picture.
- **Then:** set the seven text lines as real type in Figma and drop in the real pack photo.

**Next?** You could check this ad before it goes live with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), or build a page that opens on this comparison with the [Ad-matched landing page writer](https://useaiblocks.com/skills/ad-matched-landing-page-writer). You can also type your own next step.
```
