# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, fully usable batch: every cost-per-purchase figure checks out against the CSV, every claim sits on the brand's approved list, and the arguments trace to three-plus reviews or a winning ad. The owner gets four distinct, on-brand concepts with prompts, layouts and an honest MISSING list; the only soft spot is Ad 3's near-empty picture, which leans entirely on the quote.

## Judge list

- Met: Every insight marked USED has three buyers, or one buyer and a past ad that beat your cost per sale.
  "Quit powder for grit and the shaker: reviews 3, 4 and 6"; "Regularity...: reviews 7, 8, 9, 10 and 11, and T1 beat the account."
- Met: No two ads share both an ad type and a reason.
  Old way/new way·A1, The moment·A2, Their words·A3, Product alone·A4 — four distinct types and arguments.
- Met: Cover the headline. You can still tell what each picture is about.
  Ad 1 split tub/shaker vs pouch and gummies; Ad 2 pouch and handful by the door; Ad 4 pouch plus gummies. Ad 3 is weakest (cream field, small pouch) but per Their-words skeleton.
- Met: Each headline is 7 words or fewer, and the counts are shown.
  "Quit the chalky shaker. Keep the greens." (7 words); quotes 12/10/8 within the 12-word quote allowance; counts in every concept and set table.
- Met: Cover the logo. The colours, shapes and type should still say it's your brand.
  "brand's own colours, Work Sans, the deep-green bear gummies and the glossy green pouch shape"; shared look lists #00582D, #FFF7DF, #FFCC2E.
- Met: The picture never shows a result your facts don't state.
  "No result pictured. No body change, no timeline, no number without a source." Ad 1 compares objects only.

## What went in

```text
Brand file: Sprout, daily greens gummies (pasted below: facts,
fine and risky claims, voice, colours, show-it-right rules).
Buyer research: all 20 reviews from reviews.md (pasted below).
Past results: ad-results.csv, 9 ads, 14 to 42 days (practice
numbers, pasted below).
Photos we have: the adult pouch on a soft green gradient (front)
and gummies in a hand. That's all.
Batch: 4 ads, 4:5 and 9:16.

[attached: sprout/brand.md, sprout/reviews.md, sprout/ad-results.csv]
```

## What came out

```text
I can't make images in this chat, so each ad comes back as a picture prompt plus a layout. How to finish them is at the end.

## SOURCES

| Source | What it gave | Used for |
|---|---|---|
| `sprout/brand.md` (captured Sept to Oct 2026, updated 2026-10-18) | Product facts, fine and risky claims, voice, colours, type, show-it-right rules, buyers | Every claim, number and look rule |
| `sprout/reviews.md` (20 public reviews, Sept to Oct 2026) | Buyers' words, word for word, with source type | Buyer sheets, insight counts, the quote in Ad 3 |
| `sprout/ad-results.csv` (10 rows, 9 ads, 14 to 42 days, **practice numbers**) | Cost per purchase per ad | The "1 buyer + beat the account" test |
| Photo: adult pouch, front, soft green gradient | Product view **front** | Ads 1, 2, 3, 4 |
| Photo: gummies in a hand | Product view **in hand** | Ads 1, 2, 4 |

**Account cost per purchase:** $21,500 spend ÷ 623 purchases = **$34.51**.

| Ad | Cost per purchase | Beat $34.51? |
|---|---|---|
| T1 Hot girl tummy | $21.21 | Yes |
| P1 days 1-21 | $26.79 | Yes, then fatigued |
| H1 One step never skip | $29.55 | Yes |
| K1 Fiber kids | $34.92 | No, just above |
| F1 Fiber question | $39.13 | No |
| W1 Muscle weight loss | $39.13 | No |
| S1 Trusted by 1M | $42.11 | No |
| P2 Dont pay full price | $50.00 | No |
| P1 days 22-42 | $76.92 | No |
| R1 Runner | $100.00 | No |

All of these have 20 or more purchases except R1, which has 10 and is noise.

## BUYER SHEET

**Rule:** an insight is **used** if 3 or more reviews say it, or if 1 review says it and an ad on that argument beat $34.51. Anything less is a **hunch** and stays out of copy.

### 1. The quitter who wants to stick (about 40%)

- **Wants:** one habit that lasts.
  - "[Sprout] has been the one thing I've been able to stick to." (review 1)
  - "It's wild I WANT to take [Sprout] and don't forget." (review 2)
- **Tried, and why it let them down:** greens powders were gritty, chalky and expensive, and the shaker needed cleaning.
  - "definitely gritty/chalky", "$94 a month" (review 3)
  - "choking on [a big-name greens powder]" (review 4)
  - "not having to clean a shaker bottle or extra dishes" (review 6)
- **Moment that makes them look:** the busy morning, when the routine gets dropped.
  - "So easy to grab and eat on my way to the billion things I have to do" (review 15)
- **Their phrases:**
  - "tastes like fruit snacks I ate as a kid" (review 12)
  - "The convenience and taste are huge! Like mixed berries!" (review 6)
  - "They taste good!" (review 14)
- **Doubts:**
  - "A gummy can't hold enough to replace my powder" (brand file)
  - "They are expensive" (retailer)
  - Taste can be acquired: "tasted terrible, but after the third day…" (review 18)
- **Used:**
  - Habit and sticking with it: reviews 1, 2, 5 and 15, and H1 beat the account.
  - Quit powder for grit and the shaker: reviews 3, 4 and 6.
  - Tastes like a treat: reviews 6, 12, 14 and 16.
- **Hunch:**
  - Replaced a stack of pill bottles: review 5 only.
  - Energy: reviews 13 and 14, which is 2, and the claim is risky.

### 2. The gut-fix seeker (about 25%)

- **Wants:** to feel normal.
- **Tried:** fiber powders and probiotics (brand file).
- **Their phrases:**
  - "My bowel movements are normal for the 1st time in 15 years!" (review 7)
  - "The prebiotics do their job, but not aggressively" (review 8)
  - "the solution to my problems with regularity" (review 9)
  - "Feel lighter, less bloated" (review 10)
- **Doubts:**
  - "Will this upset my stomach more?" (brand file)
  - "The sugar free [Sprout] worked too well." (review site)
- **Used:**
  - Regularity and digestion: reviews 7, 8, 9, 10 and 11, and T1 beat the account. Copy stays at "supports".
- **Hunch:**
  - Bloating as a product claim: only review 10 says it. T1 won, but its word "fix" is a risky claim.
  - GLP-1: reviews 11 and 14, which is 2. Drug-adjacent, so it stays out.

### 3. The busy parent (about 25%)

- **Their phrases:**
  - "They think it's a treat." (review 16)
  - "my kids love them too!" (review 17)
- **Doubts:**
  - "Is this just candy?" (brand file)
  - "I hate subscriptions because I feel like they are a trap" (review 17)
- **Hunch:**
  - Kids love it: only 2 reviews, and K1 ($34.92) did not beat the account.
- MISSING: product view, Kids pouch.

### 4. The price doubter (share unknown)

- **Doubts:**
  - "Which discount is real?" (brand file)
  - "Will the price jump after the first order?" (brand file)
- **Hunch for strangers:**
  - P1 beat the account for 21 days, then fatigued to $76.92.
  - The live discounts conflict: 49%, 52%, 55%, 58% and 61% are all running.

## REASONS TO BUY, with the cuts

| # | Buyer \| problem \| what only Sprout does \| proof | Verdict |
|---|---|---|---|
| A1 | Quitter \| quit greens powder: gritty, chalky, shaker to clean \| 60+ ingredients, 21 vitamins and minerals and 6 g fiber in one daily pack of gummy bears, with no water, mixing or shaker \| reviews 3, 4, 6; product page | **Keep** |
| A2 | Quitter \| supplements don't stick \| one daily pack you rip open and eat on the way out \| reviews 1, 2, 15; H1 $29.55; "80% of surveyed users" take it daily (brand survey, 3,000+) | **Keep**. A generic "you'll stick to it" fails the rival test, so the survey number is the fact only Sprout has |
| A3 | Gut seeker \| irregular digestion \| 6 g prebiotic fiber per pack, "supports digestion and gut health" \| reviews 7, 8, 9, 10; T1 $21.21 | **Keep**. Told as one buyer's story, never as a promise |
| A4 | Quitter \| greens taste like a chore \| strawberry and sweet-greens gummy bears on a pectin base, no synthetic sweeteners or dyes \| reviews 6, 12, 14, 16 | **Keep**. Flag: reviews 18 and 19 disagree on taste |
| A5 | Gut seeker \| bloating \| "Fix the Hot Girl Tummy" | **Cut**. No proof on file for bloating relief, and "fix" is risky. The good result is carried by A3 at "supports" |
| A6 | Quitter \| a shelf of pill bottles \| one pack replaces them | **Cut**. Hunch (review 5 only), and "replaces" is not on file |
| A7 | Parent \| picky kids fight greens \| Kids packs, 6 gummies, methylfolate | **Cut**. Hunch (2 reviews, K1 did not beat the account), and no Kids pouch photo |
| A8 | Price doubter \| too expensive \| $49.99 every 4 weeks ($1.78 a day) | **Cut**. It is a "Why now?" type, the limit is 1 in 5 and 1 of 4 breaks it, and the discount figures conflict |
| A9 | Quitter \| a gummy can't hold enough \| 12-week RCT: vitamin C +40.1%, folate +20.5% | **Cut** as its own ad: the doubt appears in no review. Held as backup proof |
| A10 | Runner \| forgets nutrition | **Cut**. No buyer research, and R1 cost $100 a purchase |
| A11 | Weight loss \| keep muscle while losing weight | **Cut**. No evidence on file |
| A12 | Energy and focus | **Cut**. Hunch (2 reviews), and the study did not test energy |

**STOP 1 (approve). Picks: A1, A2, A3, A4.** These are the 4 arguments that have used insights and proof on file. Swap any of them later.

## THE SET ON THE MAP

| Ad | Code | Question | Argument |
|---|---|---|---|
| 1 | Old way, new way · Designed · New | Is it for me? | A1 powder quitter |
| 2 | The moment · Lo-fi · New | Is it for me? | A2 the one I don't skip |
| 3 | Their words · Designed · New | Can I believe it? | A3 gut, review 7 |
| 4 | Product alone · Camera · New | What is it? | A4 taste |

Batch counts:
- "What is it?" and "Is it for me?": 3 of 4. They carry the batch.
- "Can I believe it?": 1 of 4. It supports.
- "Why now?": 0 of 4, under the 1-in-5 limit.
- 4 types and 3 dresses. No two ads share a code and an argument.

**Shared look for all 4 ads**

- **Colours:**
  - Forest #00582D
  - Deep forest #002C17
  - Cream #FFF7DF
  - Kelly #007E40
  - Sunflower #FFCC2E
- **Type:**
  - Headlines in Work Sans Bold.
  - Support lines in Work Sans Medium.
  - Tags and footnotes in DM Mono uppercase.
  - Nothing smaller than 30 px.
- **Sizes:**
  - 4:5 is 1080×1350.
  - 9:16 is 1080×1920. Keep words and logo out of about the top 270 px and the bottom 670 px, and confirm against Meta's safe-zone overlay.
- **Show-it-right:**
  - The big pouch is shown only closed, front on. It is never torn.
  - No daily pack (sachet) appears, because there is no photo of it.
  - No partner or cartoon marks.

## CONCEPTS

### Ad 1: Old way, new way · Designed · New (A1)

- **Picture:** a split frame.
  - Left, the old way, on a muted grey-green counter:
    - an unbranded half-used tub of green powder with its lid off
    - a clouded plastic shaker with clumpy green sludge in the lid
    - spilled powder dust
  - Right, on warm cream:
    - the real Sprout pouch, front, closed and upright
    - in front of it, a hand holding a small handful of deep-green matte gummy bears
  - Both sides share soft daylight from the upper left.
- **Product photos:** front, and in hand.
- **Layout:**
  - A split skeleton.
  - The headline runs across the top band in deep forest on cream.
  - A small DM Mono tag sits over each side.
  - The support line sits under the right side.
- **Headline options:**
  - "Your greens, minus the chalky shaker." (6 words)
  - "Greens without the gritty shaker." (5 words)
  - "Quit the chalky shaker. Keep the greens." (7 words)
- **Side tags:**
  - Left: "SCOOP. SHAKE. SCRUB." (traces to review 6)
  - Right: "RIP. TIP. ENJOY." (brand line)
- **Support line:** "60+ ingredients, 21 vitamins & minerals and 6 g fiber in one daily pack. No water. No mixing."
- **What a stranger reads:** headline plus 3 more things (2 tags and the support line).
- **Who it isn't for:** people who never used powder can see this isn't aimed at them.

### Ad 2: The moment · Lo-fi · New (A2)

- **Picture:** a phone-made photo, slightly high angle, natural window light, 7:30 a.m. feel.
  - A kitchen counter by the door with:
    - keys and a takeaway coffee cup
    - a tote bag strap in the frame
    - the Sprout pouch standing closed at the right edge
  - In the foreground, a hand holding the small handful of green gummy bears, mid-grab.
  - Slight grain, a touch of motion blur on the bag.
  - No app screen and no interface.
- **Product photos:** in hand (hero), front (on the counter).
- **Layout:**
  - Full bleed.
  - A cream rounded card in the lower third, inside the safe zone.
  - The headline sits in the card in deep forest.
  - The footnote sits in DM Mono under the support line.
- **Headline options:**
  - "The one supplement I don't skip." (6 words; traces to review 1 and H1)
  - "Grab. Eat. Out the door." (5 words; traces to review 15)
  - "Daily greens you'll actually want." (5 words; traces to review 2)
- **Support line:** "80% of surveyed users take it daily.*"
- **Footnote:** "*SPROUT SURVEY OF 3,000+ CUSTOMERS"
- **What a stranger reads:** headline plus 2 more things.

### Ad 3: Their words · Designed · New (A3)

- **Picture:** a flat warm-cream field (#FFF7DF) with a faint forest-green bear shape tone-on-tone, low left.
  - Small, in the lower-right corner: the real pouch, front, with a soft contact shadow.
  - No face, no stars, no person.
- **Product photo:** front.
- **Layout:**
  - Big type.
  - The quote fills the upper two-thirds in deep forest, with a sunflower quote mark.
  - The source line goes under the quote.
  - Then the support line, then the disclaimer.
- **Headline options**, all real quotes word for word:
  - "My bowel movements are normal for the 1st time in 15 years!" (12 words; brand site, review 7)
  - "[Sprout] have been the solution to my problems with regularity." (10 words; retailer, review 9). Shown with "Sprout" in place of the bracket.
  - "The prebiotics do their job, but not aggressively" (8 words; brand site, review 8)
- **Source line:** "VERIFIED? MISSING. A SPROUT CUSTOMER, REVIEW ON SPROUT'S WEBSITE"
  - Shortened on the final art to: "SPROUT CUSTOMER · BRAND-SITE REVIEW"
- **Support line:** "6 g prebiotic fiber per pack. Supports digestion and gut health."
- **Disclaimer:** "One customer's experience. Results vary." (DM Mono, 30 px)
- **What a stranger reads:** quote plus 3 more things.

### Ad 4: Product alone · Camera · New (A4)

- **Picture:** studio shot of the real pouch, front, closed and upright, on a soft 2-colour gradient.
  - The gradient runs cream at the top to light forest green at the bottom.
  - A hand enters from the lower right, holding a small handful of deep-green matte gummy bears in front of the pouch.
  - Bright, sunny, candy-like. One soft key light from the upper left, shared by the pouch and the hand, with a soft floor shadow.
- **Product photos:** front, and in hand.
- **Layout:**
  - A stack: headline at the top in deep forest, the product big in the middle, the support line under it.
  - A sunflower DM Mono tag sits over the headline.
- **Headline options:**
  - "Your greens. Now in gummy bears." (6 words)
  - "Greens that taste like a treat." (6 words; brand line, reviews 12 and 16)
  - "Daily greens you eat, not chug." (6 words)
- **Tag:** "STRAWBERRY + SWEET GREENS"
- **Support line:** "Vegan. Pectin base. No synthetic dyes or sweeteners."
- **What a stranger reads:** headline plus 2 more things.

**STOP 2 (approve).** Concepts approved as above. The first picture of each dress (Designed: Ad 1, Lo-fi: Ad 2, Camera: Ad 4) should be checked once, before the rest are made.

## PICTURE PROMPTS

All prompts share these rules:
- Attach `front.jpg` (the pouch) and `in-hand.jpg` (the gummies in a hand) as references.
- Keep the pouch's exact shape, colours and yellow wordmark from the reference. Do not invent fine print.
- No added text or logos anywhere in the image.

**Ad 1, 4:5:** "Split-frame product photograph, 4:5.
- Left half: a muted grey-green kitchen counter with an unbranded, label-free plastic tub of green powder, lid off, half used, beside a cloudy plastic shaker bottle with clumpy green sludge stuck in the lid, a dusting of spilled green powder.
- Right half: a warm cream (#FFF7DF) surface with the exact Sprout pouch from reference front.jpg, closed, upright, front facing. In front of it, the hand from in-hand.jpg holding a small handful of small opaque matte deep-green gummy bears.
- Both halves share soft daylight from the upper left with matching soft shadows.
- Leave the top 22% as calm, plain space and a clean strip under the right-hand product.
- Bright, crisp, not clinical. No text, no labels, no brand marks on the tub or shaker."

**Ad 1, 9:16:** same scene, stacked top and bottom instead of side by side.
- Old way in the upper half, Sprout in the lower half.
- Calm space from y≈270 to y≈520 for the headline.
- Keep the products clear of the bottom 670 px.

**Ad 2, 4:5:** "Casual smartphone photo, slight high angle, natural window light, early morning, slight grain.
- A kitchen counter near a front door with keys, a plain unbranded takeaway coffee cup and a tote bag strap.
- The exact Sprout pouch from front.jpg standing closed at the right edge.
- In the foreground, the hand from in-hand.jpg mid-grab, holding a small handful of matte deep-green gummy bears. Faint motion blur on the bag.
- Lower third kept uncluttered for a text card.
- Real, unstaged, no phone interface, no screen, no text."

**Ad 2, 9:16:** same scene, taller crop.
- The hand sits at the centre.
- The uncluttered area runs from y≈1000 to y≈1250, above the bottom safe zone.

**Ad 3, 4:5:** "Flat warm cream background (#FFF7DF) with a very faint tone-on-tone forest-green gummy-bear silhouette in the lower left. The exact Sprout pouch from front.jpg, small, in the lower-right corner, closed, front facing, with a soft contact shadow. Upper two-thirds empty and calm. No people, no faces, no stars, no text."

**Ad 3, 9:16:** same, with these changes:
- The pouch sits at the lower right, kept above y≈1250.
- The calm area runs from y≈300 to y≈1150.

**Ad 4, 4:5:** "Bright studio product shot.
- The exact Sprout pouch from front.jpg, closed, upright, front facing, centred, on a soft 2-colour gradient from warm cream at the top to light forest green at the bottom.
- The hand from in-hand.jpg enters from the lower right, holding a small handful of small opaque matte deep-green gummy bears just in front of the pouch.
- One soft key light from the upper left on both pouch and hand, with a soft floor shadow.
- Sunny, candy-like, not clinical. Calm space in the top 20% and below the product. No text."

**Ad 4, 9:16:** same scene, with these changes:
- The product is centred between y≈450 and y≈1200.
- Calm space from y≈270 to y≈430 for the headline.

## THE SET

| File | Code | Buyer | Argument | Headline words |
|---|---|---|---|---|
| sprout-new-01-oldnew-4x5 / -9x16 | Old way, new way · Designed · New | Quitter | A1 powder quitter | 6 / 5 / 7 |
| sprout-new-02-moment-4x5 / -9x16 | The moment · Lo-fi · New | Quitter | A2 the one I don't skip | 6 / 5 / 5 |
| sprout-new-03-words-4x5 / -9x16 | Their words · Designed · New | Gut seeker | A3 gut, review 7 | 12 / 10 / 8 (quotes) |
| sprout-new-04-product-4x5 / -9x16 | Product alone · Camera · New | Quitter | A4 taste | 6 / 6 / 6 |

## CHECK RECORD

The pictures have not been made, so this checks the prompts and layouts. Run it again on each finished picture at full size.

### Glance rules

| Rule | Result |
|---|---|
| Headline length | Every headline is 7 words or fewer. The Ad 3 quotes run 8 to 12 words, inside the 12-word limit for real quotes. |
| Things to read | Headline plus 3 at most. Ads 1 and 3 have 3; Ads 2 and 4 have 2. |
| Smallest type | 30 px (footnotes and tags). |
| Contrast | Deep forest on cream is about 15:1. Sunflower on forest is about 5.7:1. Cream on forest is about 8:1. All pass. |
| 9:16 safe zone | Words and logo are kept out of the top 270 px and the bottom 670 px. Confirm with Meta's overlay. |

### Honesty and product rules

- **Product shown in every ad, from real views only.** Every ad uses only the front and in-hand views. No sachet, no torn pouch, no Kids pouch and no Sugar-Free pouch is shown.
- **Light matched.** Ads 1, 2 and 4 put the hand and the pouch under one shared light.
- **No result pictured.** No body change, no timeline, no number without a source.
- **Ad 1's old way is unbranded.** The tub and shaker carry no labels.
- **Ad 3's quote:**
  - It is word for word.
  - It names its source and carries the line "One customer's experience. Results vary."
  - It has no face and no stars, because star ratings were not captured.
- **Claims are all on the fine list:**
  - "60+ ingredients, 21 vitamins & minerals, 6 g fiber"
  - "Supports digestion and gut health"
  - "80% of surveyed users" with the survey named
  - Vegan, pectin base, free from synthetic dyes and sweeteners
- **None of the risky claims appear.** No "fix", no energy, no weight loss, no GLP-1, no "4.8 stars".
- **Flags for review:**
  - Taste: reviews 18 and 19 disagree, so "taste like a treat" is subjective. It is the brand's own line.
  - FDA line: the ads carry "supports digestion" without it. Check with the Meta ads compliance checker.

### Brand recognition with the logo covered

Each ad still carries the brand's own colours, Work Sans, the deep-green bear gummies and the glossy green pouch shape. This passes.

### Batch checks

| Check | Result |
|---|---|
| Codes and arguments | 4 codes and 4 arguments, none repeated |
| "Why now?" | 0 of 4 |
| Spread | 4 types and 3 dresses. The batch is under 6, so the minimum doesn't apply, but it is met anyway. |
| Used insights | Each has 3 or more reviews, or 1 review plus a result. Hunches stay out of copy. |

### After launch

- Read results by type and by argument once each group has about 20 purchases. A smaller gap is noise.
- Watch Ad 2 against H1 ($29.55) and Ad 3 against T1 ($21.21).
- Record what you learn in the brand file.

## MISSING

- MISSING: product view. A daily pack (sachet) torn straight across the top, with gummies pouring into a palm. This is the brand's signature shot.
- MISSING: product view. The Kids pouch. This blocks the parent argument.
- MISSING: product view. The Sugar-Free pouch, a limited-flavour pouch, and gummies scattered loose.
- MISSING: product view. A real person using it, in a real setting.
- MISSING: proof. Star ratings for individual quotes, and whether review 7 is from a verified purchase.
- MISSING: proof. Grams of sugar per pack. This is needed for any "is it candy?" ad.
- MISSING: proof. The date of the 3,000+ customer survey and how it was run.
- MISSING: brand look. Font files for Work Sans, DM Mono and the display font, and the logo as a file.
- MISSING: buyer research. Real results data. The CSV is practice numbers.

**To finish the pictures:**
- **ChatGPT or Gemini:** paste each prompt with both photos attached and ask for the picture. ChatGPT uses GPT Image; Gemini uses Nano Banana. Or paste this whole skill there so it writes the prompt and makes the picture in one go. Free plans have tight daily limits. Codex on a paid ChatGPT plan can make them too.
- **Higgsfield:** paste each prompt into its image tool, or connect Higgsfield to Claude so Claude makes them there.
- **Claude Code:** save `OPENAI_API_KEY` (from platform.openai.com/api-keys) or `GEMINI_API_KEY` (from aistudio.google.com/apikey), and I can send the prompts and save the files. Each picture is billed.
- **Then set real type in Figma** using the layouts above.

Next, would you like to check these before they go live with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), plan what to test with the [Image ad gap finder](https://useaiblocks.com/skills/image-ad-gap-finder), or set up AI to work for you with the [Old vs new ad prompt scorer](https://useaiblocks.com/skills/old-vs-new-ad-prompt-scorer)? Each takes these image ads. Or type your own.
```
