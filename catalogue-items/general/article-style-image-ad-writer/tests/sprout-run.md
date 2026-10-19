# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, honest comparison ad that uses only approved facts, correctly refuses the dated price comparison, and tells the owner plainly that the current product page's first screen doesn't pay off the headline. The page-fix notes and MISSING lines (especially powder contents and %DV per vitamin) are useful and the self-score of 80 is accurate.

## Judge list

- Met: The headline names no brand and reads like an editor wrote it, not a slogan.
  "What one greens gummy pack holds": no brand, a what-was-found line, not a tagline.
- Met: The image headline, the first line of the main text and the top of your page make the same claim.
  Ad and first line match ("One daily pack ... holds 60+ ingredients"); page mismatch honestly flagged: "Claim: fails ... send the ad to a page built for it."
- Met: Nothing suggests independent reporting. No publication name, byline, expert or "as seen in" that isn't real and yours to use.
  "no masthead, no newspaper-style logo, no byline and no lab imagery"; main text names Sprout plainly.
- Met: Every figure and outside name in the ad is in your brand facts. No competitor is named or shown.
  60+, 21, 6 g, 2025/12 weeks/120 adults, 70 pesticides, 4 heavy metals all on file; powder is a kind, "unbranded line drawing".
- Met: The image has 20 words or fewer. Count them.
  6+1+4+1+4+4 = 20 words, counted and stated: "Word count: 20, counting numbers and '&' as words."

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
I can't draw the picture in this chat because no image tool is connected, so I'll write the prompt and explain at the end how to make it.

**On the image**
- Headline: "What one greens gummy pack holds"
- Supporting line: none. The two columns do that job.

**Main text**

One daily pack of Sprout greens gummies holds 60+ ingredients, 21 vitamins & minerals and 6 g of prebiotic fiber.

People who have stopped using greens powder often doubt that a gummy can hold enough to replace it. The pack's contents are the answer the brand puts forward.

A greens powder is scooped, mixed into water and shaken, and then the shaker gets washed. Sprout is one pack a day, eaten straight from the pack, with no water, no mixing and no shaker.

Sprout is clinically tested for nutrient absorption, in a 2025 randomized, placebo-controlled study of 120 adults over 12 weeks. Each lot is third-party tested for 70 pesticides and 4 heavy metals.

Tap to see the full ingredient list and how a gummy pack compares with a powder, side by side.

**Headline under the image**
What's in one greens gummy pack, next to a scoop of powder

**Image brief**
- **Layout:** A square two-column comparison card on a plain light background, set in clean sans-serif type. It has no masthead, no newspaper-style logo, no byline and no lab imagery.
  - The headline runs across the top in large type.
  - Left column: header "Powder", with a simple unbranded line drawing of a scoop, a glass of water and a shaker bottle.
  - Right column: header "Gummy", with the two content lines.
- **What's shown:** The real Sprout pouch photo, small, in the bottom-right corner. Use the pack as photographed and don't restyle it or change its label. No rival product or brand appears.
- **Exact words:**
  - "What one greens gummy pack holds"
  - "Powder"
  - "Needs water, mixing, shaker"
  - "Gummy"
  - "21 vitamins & minerals"
  - "6 g prebiotic fiber"
- **Word count:** 20, counting numbers and "&" as words.
- **Image prompt:** "Square social ad, flat comparison card, off-white background, crisp dark sans-serif type. Top: large headline 'What one greens gummy pack holds'. Two columns divided by a thin line. Left column header 'Powder', below it a minimal line drawing of a measuring scoop, a glass of water and a plain shaker bottle, caption 'Needs water, mixing, shaker'. Right column header 'Gummy', below it two lines: '21 vitamins & minerals' and '6 g prebiotic fiber'. Small product pouch photo in the bottom-right corner, unaltered. No logos, no people, no extra text."

**Notes**

*Page sections the destination must cover. List only; don't write them.*
1. **First screen:** the same claim, what one pack holds (60+ ingredients, 21 vitamins & minerals, 6 g prebiotic fiber), next to the powder routine.
2. **Powder vs. gummy comparison:** how each is taken and what is in each pack. Leave out the dated "$1.26 vs $3.60" figures and the unlabeled ~$35 column.
3. **Full ingredient and vitamin list.** Make the count read "21" everywhere. The ingredients panel currently says "over 20".
4. **The 2025 study:**
   - Its design.
   - What it measured: blood vitamin C +40.1% and folate +20.5%, framed as two vitamins measured.
   - A real source link in place of "Source".
5. **Third-party testing:** 70 pesticides and 4 heavy metals, with the lab and date as shown.
6. **Reviews from people who left powder.** Use the "Vs Powders" cards, as the review platform shows them.
7. **Low Sugar vs. Sugar-Free:** include any sugar-alcohol note. Gut-focused buyers are a core audience.
8. **Offer, stated plainly:**
   - One discount figure.
   - That $29.99 needs the SMS sign-up.
   - The $49.99 renewal and its $1.78/day, shown as clearly as $1.07/day.
   - The one-time option, shown without slanted labels.
9. **Guarantee:** state in the plan box that it covers the first order only.

*Page check*
- **Claim: fails.** The current first screen does not match the ad. It opens with a discount bar and "revive whole body vitality". The comparison ("Us vs. Them") sits far down the page, and it uses the price comparison you've ruled out. On a phone the plan box likely falls below the first screen **(inferred)**.
  - Fix: send the ad to a page built for it, whose first screen states "What one greens gummy pack holds" with the contents and the powder contrast.
  - Second-best fix: move a rebuilt powder-vs-gummy section to the top, with no discount banner above it.
- **Label:** the product page is not laid out like an article, so no label is needed there. If the new destination is built in an article style, put "Advertisement" in front of or just above its headline. "Promoted" or "Presented by" alone isn't clear enough.
- **Rating:** the ad uses no rating. If the page shows one, use the figure the review widget shows (4.75 from 109,639). Don't use the header's 4.8 from 100,000.

*Claims left out for lack of proof or approval*
- "Revive whole body vitality", "Supports immunity + stress relief", "Promotes mental clarity + energy". The study measured only two vitamins in the blood.
- That a gummy matches a powder nutritionally. There are no facts on file about powder contents.
- "Replaces handfuls of health products" and "replace a big shelf in your medicine cabinet".
- The 61% digestive-issues statistic (no real source) and the nutrient-gap statistic (number missing).
- Survey figures: 67% better digestion, 52% more energized.
- The price comparison, which is dated and ruled out.
- The study's +40.1% and +20.5% figures in the ad itself. They're on file, but the approved wording is "Clinically tested for nutrient absorption", so they belong on the page with context.

*Missing*
- MISSING: facts on file about what a typical greens powder serving contains, so the comparison can only contrast the routine, not the contents.
- MISSING: % of daily value per vitamin per pack. This is the strongest answer to "can't hold enough".
- MISSING: the study's publication or citation for the page.
- MISSING: text of the Low Sugar vs. Sugar-Free panel.
- MISSING: verbatim "Vs Powders" review quotes as the platform shows them. The buyer doubt is from your brief, but no review text was captured.
- MISSING: phone share and the phone first-screen layout for the destination page.

**Score**

4 / 5 checks passed = 80 / 100

| Check | Result |
|---|---|
| The headline has no brand name and isn't a tagline | Passed |
| One claim runs from the image headline to the top of the page | **Missed** |
| No invented source, person, study or date, and nothing posing as journalism | Passed |
| Every figure and outside name is in the brand facts; no competitor is named | Passed |
| The image has 20 words or fewer | Passed (20) |

Why the claim check is missed: the ad, image and under-image headline hold one claim. The current product page's first screen makes a different one ("revive whole body vitality") under a discount bar. This can't be fixed in the ad. It passes once the ad points to the rebuilt first screen described above.

**Making the picture**
- **ChatGPT or Gemini:** paste the image prompt above into a chat and ask for the picture. ChatGPT uses GPT Image and Gemini uses Nano Banana. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make it too.
- **Higgsfield:** paste the prompt into its image tool, or connect Higgsfield to Claude so Claude makes it there.
- **Claude Code:** save an OpenAI or Google key as `OPENAI_API_KEY` or `GEMINI_API_KEY` and the prompt can be sent to that image API and the file saved. Get keys at platform.openai.com/api-keys (OpenAI) or aistudio.google.com/apikey (Google). OpenAI or Google bills each picture.
```
