# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, usable plan: the offer block carries the real renewal price and SMS condition, every text line is sourced to the product page or the fine-to-repeat list, and it correctly says it can't see the photos or the reviews. Minor rough edges only: the Ad 1 prompt has a confusing 'Twenty-eight… set as 28' instruction and the 9:16 prompts lean on '[Ad 3 text, exact]' shorthand rather than being self-contained.

## Judge list

- Met: The offer block is identical on every ad, and the word count shown matches.
  "Subs Now Start at $29.99" (5) / "Renews at $49.99 each 4 weeks." (6) / "Promotional SMS discount reserved for new customers only." (8) = 19; all prompts use "[offer block, exact]".
- Met: No headline or support line repeats a price or offer date from the block.
  Headlines/supports: "Same Sprout.", "28 daily packs. One pack a day.", "30-Day Money-Back Guarantee", "60+ ingredients..."; no price outside the block.
- Met: Any saving compares with a price you really charged.
  NOT ADDED: "Strikethrough ~~$66.65~~ $29.99: $66.65 is the one-time price charged today, not an earlier subscription price."
- Met: Nothing says "ends soon" or "limited" unless your offer has a real date or count.
  "so the third ad shows what's included, and no ad says 'ends', 'last chance' or 'limited'."
- Met: The review on the safety-net ad is word for word, and an unverified reviewer is flagged.
  "Review: none (MISSING)"; safety-net ad uses plan-box and FAQ words only, no generated face.
- Met: Each 9:16 is described as its own layout, not "same as 4:5, cropped".
  Ad 2: "No text in the top 274 px or the bottom 640 px. Kicker at y≈340... pouch photo fills the bottom third"; Ads 4 and 6 likewise.

## What went in

```text
Offer (product page, word for word):
"Same Sprout. New Lower Price. Subs Now Start at $29.99."
Under the button: "Renews at $49.99 each 4 weeks."
Footer: "Offer assumes customer has received and uses promotional
SMS discount reserved for new customers only."
Plan box: "Pause Or Cancel Any Time. 30-Day Money-Back Guarantee."
FAQ: "This policy applies only to your initial purchase."
End: none ("Not just for a week but indefinitely"). Limit: none.

Product: Sprout Original (Adults), Low Sugar, 28 daily packs.
Photos on file: the pouch on a soft green gradient; gummies poured
into a hand.
Reviews: all 20 (pasted). Product facts: brand file, fine-to-repeat.
Brand look: forest green #00582D, warm cream #FFF7DF, sunflower
yellow #FFCC2E, plum #581E5A. Work Sans bold.

[attached: sprout/brand.md, sprout/product-page.md]
```

## What came out

```text
I can't make pictures in this chat, so you get the plan and a prompt for each ad. How to turn those into pictures is at the end.

## Offer block (role: `offer`, the same on all 6 ads)

| Line | Text | Words | Source |
|---|---|---|---|
| 1 | Subs Now Start at $29.99 | 5 | Product page, birthday section |
| 2 | Renews at $49.99 each 4 weeks. | 6 | Product page, under the button |
| 3 | Promotional SMS discount reserved for new customers only. | 8 | Product page footer (shortened from "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only.") |

Total: 19 words. This is the only place a price or offer date appears.

- **Type:** Work Sans bold.
- **Price ad:** set large as the main line, with line 3 at 40% of line 1's size.
- **Safety-net and what's-included ads:** small, at the foot of the safe area.

**MISSING:**
- **review:** You mentioned 20 reviews, but none reached me. Only the two files came through. The safety-net ad uses the policy's own words alone. I did not use the persona quotes in brand.md, because they have no published credit.
- **photo:** I received descriptions only, not the files, so I couldn't check these:
  - **Pouch photo:** that it is Low Sugar (no white Sugar-Free burst), the big pouch is not torn, "28 Daily Packs" is readable, and there are no tie-in characters or partner marks.
  - **Hand photo:** that the gummies are deep-green Original bears (not lemon slices or stars), and that any daily pack shown is torn straight across its top edge.
- **earlier price:** "New Lower Price" implies an earlier subscription price. Neither the price nor when it was charged is on file.
- **end date:** There is none, and the offer is "indefinitely". So the third ad shows what's included, and no ad says "ends", "last chance" or "limited".

**NOT ADDED:**
- **"New Lower Price":** It is a saving claim with no earlier price on file.
- **Strikethrough "~~$66.65~~ $29.99":** $66.65 is the one-time price charged today, not an earlier subscription price.
- **52%, 55%, "up to 55%", 49%, 58%, 61%:** These numbers contradict each other across the site and ads.
- **$1.07/day:** It applies to the first box only, and it would be a second price outside the offer block.
- **"Limited Time Sale" bar and the tie-in flavour:** The offer has no end date, and tie-in marks can't be shown.
- **4 free gifts:** They appear in ads only, and which gifts changes.
- **Free shipping:** The site gives two versions ("free shipping on your first order" in the bar, "Free Shipping Today" in the plan box). Confirm the wording, then add it as a line in the offer block if you want it.
- **Star ratings and "1M+ Customers":** There are four conflicting ratings, and the customer count is unverified.
- **"DISCOUNT AUTO-APPLIED":** It contradicts the SMS requirement in the footer. The landing page should match the ad's line 3 before launch.
- **Benefit claims beyond the fine-to-repeat list:** These include energy, immunity, clarity and "revive whole body vitality".

## Sprout Original (Adults), Low Sugar, 28 daily packs

**Set size:** 3 ways × 2 sizes × 1 variant = 6 ads.

**Third way:** There is no real end date or limit ("Not just for a week but indefinitely"), so the reason-to-start-now ad becomes **what's included**.

**Photos:** Only two exist. The safety-net ad is type-led, with a cut-out of the pouch photo, so each way still has its own main picture.

### Ad 1: Real price, 4:5 (1080×1350)
- **Layout:** The offer block fills the left two-thirds, stacked top to bottom, with a short sunflower underline under "$29.99". The pouch photo sits in a rounded panel in the bottom-right third.
- **Ground:** Warm cream #FFF7DF.
- **Text:** Forest green #00582D. Underline in sunflower #FFCC2E.
- **Photo:** The pouch on the soft green gradient, used as-is inside the panel.
- **Text elements:**
  - Kicker: "Same Sprout." (product page, birthday section)
  - `offer` block, large (above)
  - Support: "28 daily packs. One pack a day." (product page FAQ and Directions: "28 daily packs per pouch", "Grab a single pack daily")
- **Prompt:** "Feed ad 4:5, warm cream #FFF7DF background. Left two-thirds: large bold Work Sans text in forest green #00582D, exactly: 'Same Sprout.' (small), then 'Subs Now Start at $29.99' (largest, short sunflower-yellow #FFCC2E underline under the price), 'Renews at $49.99 each 4 weeks.', 'Promotional SMS discount reserved for new customers only.' (smaller), then 'Twenty-eight daily packs. One pack a day.' set as '28 daily packs. One pack a day.' Bottom right: the attached pouch photo in a rounded-corner panel, unaltered. No other text, no numbers, no badges."

### Ad 2: Real price, 9:16 (1080×1920)
- **Layout:** No text in the top 274 px or the bottom 640 px.
  - Kicker at y≈340.
  - Offer block centred and stacked large in the band from y≈420 to y≈1050.
  - Support line at y≈1150.
  - The pouch photo fills the bottom third, from y≈1280 down, as the picture only.
- **Ground:** Cream #FFF7DF, flowing into the photo's green gradient at the bottom.
- **Text:** Forest green #00582D.
- **Photo:** The pouch on the soft green gradient.
- **Text elements:** Same as Ad 1. Kicker, `offer` block (large) and support line, with the same sources.
- **Prompt:** "Story ad 9:16, cream #FFF7DF top fading into the attached pouch photo, which fills the bottom third. All text centred between 15% and 66% of the height, forest green #00582D bold Work Sans: [same four text items as Ad 1, exact]. Nothing in the top 15% or the bottom third except the photo."

### Ad 3: Safety net, 4:5
- **Layout:**
  - Centred, type-led.
  - A big sunflower disc in the top third reads "30-DAY", in plum.
  - The headline sits under it.
  - Two terms lines follow.
  - A small pouch cut-out sits bottom right.
  - The offer block is small at the foot, left-aligned.
- **Ground:** Plum #581E5A.
- **Text:** Cream #FFF7DF. Disc in sunflower #FFCC2E with plum text.
- **Photo:** The pouch, cut out from the pouch photo.
- **Text elements:**
  - Headline: "30-Day Money-Back Guarantee" (plan box)
  - Limit line: "This policy applies only to your initial purchase." (product page FAQ)
  - Support: "Pause Or Cancel Any Time." (plan box; exact words, promising nothing beyond them)
  - `offer` block, small at the foot
  - Review: none (MISSING)
- **Prompt:** "Feed ad 4:5, solid plum #581E5A background. Top third: sunflower #FFCC2E circle with '30-DAY' in plum bold Work Sans. Below, cream #FFF7DF bold Work Sans, exactly: '30-Day Money-Back Guarantee' (large), 'This policy applies only to your initial purchase.', 'Pause Or Cancel Any Time.'. Bottom right: the pouch cut out from the attached photo, unaltered, untorn. Foot, small cream text, exactly: 'Subs Now Start at $29.99' / 'Renews at $49.99 each 4 weeks.' / 'Promotional SMS discount reserved for new customers only.' No other text, no stars, no faces."

### Ad 4: Safety net, 9:16
- **Layout:**
  - Disc at y≈320–620.
  - Headline at y≈680.
  - Terms lines at y≈820–940.
  - Small offer block at y≈1100–1250, at the foot of the safe band.
  - The pouch cut-out sits low in the bottom third, at y≈1400–1800, as the picture only.
  - No text above y≈274.
- **Ground:** Plum #581E5A.
- **Text:** Cream #FFF7DF. Disc in sunflower #FFCC2E.
- **Photo:** The pouch cut-out.
- **Text elements:** Same as Ad 3, with the same sources.
- **Prompt:** "Story ad 9:16, plum #581E5A. [Ad 3 text, exact], all text between 15% and 66% of the height; pouch cut-out in the bottom third with no text over it."

### Ad 5: What's included, 4:5
- **Layout:**
  - The hand photo is full-bleed across the top 60%.
  - Below it, a forest-green band holds the headline, with the numbers in sunflower.
  - Two support lines follow.
  - The offer block is small at the foot.
- **Ground:** Forest green #00582D.
- **Text:** Cream #FFF7DF. Numbers in sunflower #FFCC2E.
- **Photo:** The gummies poured into a hand.
- **Text elements:**
  - Headline: "60+ ingredients, 21 vitamins & minerals, and 6g fiber" (brand.md fine-to-repeat)
  - Support 1: "In 1 pack. 28 daily packs. Rip. Tip. Enjoy." ("in 1 pack" from fine-to-repeat; 28 packs from the FAQ; "Rip. Tip. Enjoy." is a brand line)
  - Support 2: "Third-party tested for 70 pesticides, 4 heavy metals." (fine-to-repeat)
  - `offer` block, small at the foot
- **Prompt:** "Feed ad 4:5. Top 60%: the attached photo of green gummies poured into a hand, unaltered. Bottom 40%: forest green #00582D band, bold Work Sans cream #FFF7DF with numbers in sunflower #FFCC2E, exactly: '60+ ingredients, 21 vitamins & minerals, and 6g fiber' / 'In 1 pack. 28 daily packs. Rip. Tip. Enjoy.' / 'Third-party tested for 70 pesticides, 4 heavy metals.' Foot, small cream: [offer block, exact]. No other text."

### Ad 6: What's included, 9:16
- **Layout:**
  - A forest-green band at y≈274–700 holds the headline.
  - The hand photo runs from y≈700 down through the bottom third.
  - The support lines and the small offer block sit on a forest-green panel at y≈980–1270, overlaid on the upper part of the photo.
  - No text below y≈1280 or above y≈274.
- **Ground:** Forest green #00582D.
- **Text:** Cream #FFF7DF. Numbers in sunflower #FFCC2E.
- **Photo:** The gummies poured into a hand.
- **Text elements:** Same as Ad 5, with the same sources.
- **Prompt:** "Story ad 9:16, forest green #00582D. [Ad 5 text, exact], all text between 15% and 66% of the height; the hand photo fills the lower half with no text in the bottom third."

## Contact-sheet test (three 4:5 ads at stamp size)

**Pass.** Each one reads at a glance:
- **Ad 1:** cream with a big number and a pouch, so it's the price ad.
- **Ad 3:** plum with a yellow "30" disc, so it's the guarantee ad.
- **Ad 5:** forest green with a hand full of gummies, so it's the what-you-get ad.

## When the offer changes

- **Price, renewal or who qualifies changes:** Edit only the offer block and re-render all 6.
- **Guarantee or cancel wording changes:** Edit only the two terms lines on Ads 3 and 4.
- **A real end date appears:** Swap Ads 5 and 6 for a start-now pair.

**CHECKS MISSED:** none

**To finish the pictures:**
- **ChatGPT (GPT Image) or Gemini (Nano Banana):** Paste each prompt into a chat and attach the real photo. You can also paste this whole skill there to write and render in one go. Free plans have tight daily limits.
- **Higgsfield:** Paste each prompt into its image tool, or connect Higgsfield to Claude.
- **Claude Code:** Save an `OPENAI_API_KEY` (platform.openai.com/api-keys) or a `GEMINI_API_KEY` (aistudio.google.com/apikey), and I can send each prompt to that API and save the files. Each picture is billed by OpenAI or Google.

After rendering, check every digit against the offer block. In Meta Ads Manager, turn on the safe zone guardrail for both 9:16 ads.

What next? You could check the set before it goes live with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), plan what to test with the [Image ad gap finder](https://useaiblocks.com/skills/image-ad-gap-finder), or score your prompts with the [Old vs new ad prompt scorer](https://useaiblocks.com/skills/old-vs-new-ad-prompt-scorer). Or type your own.
```
