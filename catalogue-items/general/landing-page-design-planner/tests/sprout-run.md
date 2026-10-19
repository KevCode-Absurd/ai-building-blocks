# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 6 met. Invented facts: 0.

A thorough, honest design plan: three truly different directions, all terms pushed next to the button, every price and quote taken straight from the page, and the page's known copy problems flagged rather than papered over. The only slip is specifying white button text when white isn't a supplied brand colour, which contradicts its own "no other colours" rule.

## Fix

In Step 2, add: "Text on buttons and dark sections uses the brand's lightest supplied colour (e.g. its cream), not white or black, unless the brand file lists those neutrals."

## Judge list

- Not met: Every colour and font in the plan is one you supplied.
  "Button: Start Now (kelly, white text...)" and "White on kelly ≈ 5.2:1": white is not in the supplied palette, yet brief says "No other fonts or colours."
- Met: The three directions differ in layout and what the pictures do, not only in colour.
  A "product demonstration" (pack replaces shaker), B "magazine story" (lifestyle + pull quotes), C "spec sheet" (macro inspection shots).
- Met: No offer, claim, review or badge appears that isn't in your facts.
  Survey numbers carry "of surveyed users"; pull quotes marked "MISSING: exact review text"; "ADD NOTHING: no new offers, prices, percentages, claims, ratings or reviews."
- Met: Delivery, returns and subscription terms stay visible on phones.
  "Visible under the button at 14-16px, not small print: 'Renews at $49.99 each 4 weeks. Cancel anytime.'" plus SMS sentence and first-order guarantee limit.
- Met: Each review finding names a section and a screen size.
  "Not applicable. No built page or screenshots were supplied." No findings made, so nothing unlabelled.
- Met: Anything it couldn't check, such as contrast over a photo, is listed as not checked.
  "Contrast over photos and gradients. This needs a visual check. The hex pairs above are calculated only." plus overflow, fonts, zoom, checkout.

## What went in

```text
Brand look (sprout/brand.md): forest green #00582D, deep forest
#002C17 (headings, dark sections), cream #FFF7DF (hero background),
kelly green #007E40 (buttons), sunflower yellow #FFCC2E (stars,
badges), plum #581E5A (top banner). Work Sans bold headings, Work Sans
medium body, DM Mono small uppercase tags, a chunky display font for
big lines. Photos: bright, sunny, pouch on a soft 2-colour gradient,
gummies poured into a hand. Pack torn straight across the top only.

The page: our main product page for Sprout Original, copy and offer
as now (sprout/product-page.md). Buyer: people who quit powders.
Scope: redesign. Keep every price, term and the guarantee wording.
No screenshots yet.

[attached: sprout/brand.md, sprout/product-page.md]
```

## What came out

```text
## Design system

**Page type:** a persuasion page (product, proof, buying decision). The skill applies.

**Colours (brand values only, no additions)**

| Colour | Job | Contrast notes (calculated, approximate) |
|---|---|---|
| Cream #FFF7DF | Hero and light section backgrounds | — |
| Deep forest #002C17 | Headings, body text on cream, dark sections | Deep forest on cream ≈ 14:1 |
| Forest green #00582D | Secondary panels (plan box frame, comparison column), secondary text on cream | Cream or white on forest ≈ 8:1 |
| Kelly green #007E40 | Main button fill and selected-option outline only | White on kelly ≈ 5.2:1 (passes normal text). Kelly edge on cream ≈ 4.8:1 (passes 3:1) |
| Sunflower yellow #FFCC2E | Stars, badges, small highlights. Only on dark backgrounds or with deep forest text | Deep forest on yellow ≈ 10:1. **Yellow on cream ≈ 1.4:1 fails.** Stars on cream need a deep forest outline, or a deep forest chip behind them |
| Plum #581E5A | Top announcement bar only | White on plum ≈ 12:1, yellow on plum ≈ 8:1 |

**Font roles**
- Headings: Work Sans Bold.
- Body: Work Sans Medium, 16 px minimum (17 to 18 px for long text on desktop), line height about 1.5.
- Buttons: Work Sans Bold, 18 px, sentence case ("Start Now").
- Tags, badges, small labels (MOST POPULAR, DISCOUNT AUTO-APPLIED, section eyebrows): DM Mono uppercase, minimum 12 px, letter-spacing +0.04em.
- Big statement lines (one per section at most): the brand's chunky display font.
- `MISSING: name and font file of the chunky display font.` If the file is not already in the theme, fall back to Work Sans Bold. No new font download.

**Main visual move:** the torn daily pack. Every key section is anchored by a pack torn straight across its top edge, with green bears pouring into a palm or bowl. The image reads as "this replaces the shaker." The big pouch appears only closed, or opened at its resealable top.

**Layout rules**
1. Phone first, single column. Each section answers one buyer question and has at most one display-font line.
2. Price, variant choices and terms always travel together. They are never split by an image or a section break.
3. Proof sits next to the claim it backs. Survey numbers sit beside "stick with it." Testing numbers sit beside "what's inside."
4. Cards repeat only for alike items: review cards and flavour tiles. Arguments get their own layouts.
5. Dark deep-forest sections alternate with cream, at most two dark sections in a row. Plum appears only in the top bar.

**Line length:** 45 to 75 characters for long text (max-width about 34em on desktop). Shorter lines on phones are fine.

**Motion**
- One entrance effect only: the hero gummy pour, played once.
- No looping animation.
- `prefers-reduced-motion` shows the static image.
- The rotating announcement bar needs a visible pause control, or should show one static message. Auto-rotation without a pause fails WCAG 2.2.2.

**Accessibility aims**
- WCAG 2.2 AA contrast: 4.5:1 for normal text, 3:1 for large text, button edges and icons.
- Tap targets of about 44 px on plan options, sugar level, adults count, flavour tiles, accordions and the main button. 24 px is the floor elsewhere.
- Visible focus ring: 3 px kelly or deep forest outline, with a cream gap on dark sections.
- Reading and keyboard order matches visual order.
- Accordions and toggles carry state attributes (`aria-expanded`, `aria-pressed`/radio).
- Works at 200% zoom and at 320 px wide.

**Copy and offer problems the design can't solve (decisions for you, not changed here)**
- `MISSING: one discount figure.` On one visit the bar says 52%, the badge says "up to 55%" and the pop-up says 55%. The ad that sent the visitor says 61%. This plan puts only the plan-box badge and prices in the first screen, and treats the bar line as a separate decision.
- `MISSING: which rating to show, with its source.` The header says 4.8 (100,000). The widget says 4.75 (109,639). The reviews page says 4.74 (118,002). Whichever is chosen gets a source label.
- "DISCOUNT AUTO-APPLIED" conflicts with the footer: "Offer assumes customer has received and uses promotional SMS discount…". The design moves the existing footer sentence up beside $29.99 and keeps the wording. Fixing the contradiction itself is a copy decision.
- The subtitle "revive whole body vitality" and the bullets "Promotes mental clarity + energy" and "Supports immunity + stress relief" are unsupported, per the brand file. The design keeps them at bullet size and never promotes them into display type. Replacing them needs compliance review.
- `MISSING: "21" vs "over 20" vitamins and minerals.` Direction C should not set this number large until it is resolved.
- `MISSING: the "[number missing]" nutrient-intake stat and the real source links behind "Source".`
- `MISSING: label of the third Us vs. Them column (~$35).` The $1.26 vs $3.60 comparison is dated and should be rechecked before use.
- Pop-up timing is page behaviour, so it is unchanged here. Flag it: on phones a "Sign Up for 55% Off" pop-up over the plan box hides the terms.

---

## Three directions

### A. "The Switch" (product demonstration)
- **First screen:**
  - Cream hero with the deep green pouch, closed and upright.
  - A torn daily pack pouring bears into a palm.
  - Title and rating below.
  - The plan box starts inside the first phone screen, at minimum the badge and the Subscribe & Save price line.
- **What the images do:** they show the swap. Pack in hand replaces shaker and tub. One side-by-side "old way" image (tub, shaker, gritty counter) sits next to the "Why Sprout?" No Mess line.
- **Argument rhythm:** see it, buy it, see why it beats the powder, then proof you'll stick with it, then what's inside, then FAQ. Short and decision-first.
- **Phone:** stacked. After the main button scrolls away, a sticky bottom bar shows: "$29.99 first box · renews at $49.99 each 4 weeks" plus Start Now.
- **Desktop:** two columns above the fold. Gallery on the left (about 55%), title, rating, bullets and plan box on the right, sticky within the hero.

### B. "Quitter's Diary" (magazine story)
- **First screen:**
  - A full-width lifestyle photo of an everyday adult at home, mid-pour.
  - A large pull quote from a real powder-quitter review in display type.
  - Title and rating below.
  - The plan box comes after one short story block on phones.
- **What the images do:** they carry the mood of a real day: kitchen counter, bag, commute. Each image pairs with one real review quote.
- **Argument rhythm:** a narrative arc. "I quit everything" leads to the switch, then sticking with it (survey numbers), then what's inside, then the buy.
- **Phone:** editorial single column with alternating cream and deep forest bands. The sticky buy bar appears from the first scroll.
- **Desktop:** asymmetric magazine grid, quote left with photo right, flipping each section. The plan box is repeated as a full module mid-page and at the end.
- **Needs:** `MISSING: exact review text, reviewer name/initial and source for each pull quote.` Without real quotes this direction can't be built.

### C. "What's in the Pack" (close look at details)
- **First screen:**
  - A macro shot of a torn pack and bears on a forest-to-deep-forest gradient.
  - DM Mono tags for "60+ ingredients", "6 g fiber" and "Vegan · pectin base".
  - The "View Nutrition Label" link is promoted to a visible button.
  - The plan box follows directly.
- **What the images do:** they inspect. Bear texture and scale (thumbnail height, next to a fingertip), the pack's flat format, ingredient close-ups, the nutrition label.
- **Argument rhythm:** facts first, then testing (70 / 4 / 16 / 9), then the clinical study kept to absorption, then "and it's easy to keep" (survey), then buy.
- **Phone:** label-like stacked spec rows with an expandable full ingredient list.
- **Desktop:** a "spec sheet" layout. Product macro fixed on the left, scrolling spec rows on the right.
- **Risk:** this direction leans hardest on numbers, so the 21 vs "over 20" conflict must be fixed first.

---

## Section plan (Direction A order; B and C reuse the same sections, reordered)

| # | Section | Buyer question | Phone layout | Desktop change | Image |
|---|---|---|---|---|---|
| 1 | Announcement bar (plum) | "Is there a deal?" | One static line or a rotator with a pause button, 44 px high | Same | None |
| 2 | Hero: gallery, title, under-title, rating | "Is this the thing from the ad?" | Gallery about 45% of viewport height with swipe dots (44 px targets). Title in Work Sans Bold 28 px, rating with source label below | Two columns, gallery left | `[SLOT: pouch, closed, front, soft 2-colour gradient]`, `[SLOT: daily pack torn across top, bears into palm]`, `[SLOT: nutrition label]` |
| 3 | Bullets | "What does it do?" | 4 bullets at body size, no icons that imply results | Right column | None |
| 4 | Buying block: flavour, sugar level, adults count, plan box, Start Now, terms | "What do I pay, now and later?" | All in one module. Option tiles 44 px. Subscribe & Save and One Time Purchase at equal visual weight (no greyed-out styling). Under the $29.99, visible at body size: "Renews at $49.99 each 4 weeks. Cancel anytime." and the existing SMS-offer sentence. Next to the guarantee line: the existing FAQ wording "This policy applies only to your initial purchase." | Right column, sticky within the hero | Flavour tiles: product colour swatch and flavour description only. No tie-in characters or partner marks |
| 5 | Sticky buy bar | "Where's the button?" | Bottom bar: first-box price, renewal price, Start Now (48 px). Appears once #4 scrolls away | Hidden; the column stays sticky | None |
| 6 | Why Sprout? (moved out of the accordion) | "Why is this better than my powder?" | Display line from existing copy ("No more gagging on pills, sloshing chalky powders, or cleaning messy counters."), then 4 short blocks (Comprehensive, Delicious, Portable, No Mess) | 2×2 grid allowed (alike items) | `[SLOT: old way: tub + shaker + mess]` beside `[SLOT: torn pack in hand]` |
| 7 | Review cards: Vs Powders and Taste themes (moved up from the bottom) | "Did other powder quitters actually switch?" | Horizontal swipe of real cards, 85% width each, rating source shown | 3-up row | None, or reviewer photo only if supplied with the review |
| 8 | Snackable, Packable, Tested (survey) | "Will I stick with it?" | Deep forest band, three stacked numbers (95% / 67% / 52%), each with "of surveyed users" and "3,000+ customers after 3 months" | Three columns | None |
| 9 | Us vs. Them | "Is it worth the price?" | Simple 2–3 column table, Sprout column in forest | Same, wider | None. Flag: dated figures, third column label `MISSING` |
| 10 | Quality You Can Trust | "Is it safe and clean?" | 70 / 4 / 16 / 9 as stacked spec rows, lab test date, NSF/GMP/FDA-registered facilities text | 4-up row | `[SLOT: lot test or certificate image, only if a real document is supplied]` |
| 11 | Modern Living / Science | "Why do I need this?" | Hold until the missing stat and sources exist. Otherwise keep it short with the study kept to absorption | Same | None |
| 12 | What's inside (ingredients, low sugar vs sugar-free, directions, benefits accordions) | "What exactly am I eating? Will it upset my stomach?" | Accordions, 44 px headers. Nutrition label link visible outside the accordion | Two columns: label image plus accordions | `[SLOT: nutrition label]`. `MISSING: Low Sugar vs. Sugar-Free panel content` |
| 13 | Find Your Flavor | "Which one do I pick?" | 2×2 tiles (alike items) with flavour descriptions only | 4-up | `[SLOT: pouch per flavour, front]` |
| 14 | Birthday price cut | "Will the price go up?" | One cream band, existing copy | Same | None |
| 15 | Athlete quote | "Who else uses it?" | Quote with "paid spokesperson" disclosure at body size, not small print | Quote with photo | `[SLOT: athlete photo, only if licensed]` |
| 16 | FAQ | "Any last worries?" | Accordions in the existing order. The guarantee and limited-flavour-revert answers stay worded as now | Single column, 34em max | None |
| 17 | Full reviews widget | "Show me everything." | As now | As now | None |
| 18 | Footer | Legal | FDA line plus SMS-offer sentence (the latter also shown at #4) | Same | None |

---

## Build brief (Direction A: "The Switch")

```
JOB: Main product page for Sprout Original (Adults) greens gummies. Buyer: adults
who quit greens powders/pills. Show the real product in the first screen, make the
buying choice and all terms clear, then prove it beats the powder routine.

DESIGN SYSTEM
Colours: cream #FFF7DF (hero/light bg), deep forest #002C17 (headings, body text,
dark sections), forest #00582D (panels, plan box frame), kelly #007E40 (main button
fill, selected option outline only), sunflower #FFCC2E (stars/badges, only on dark
bg or with deep forest text; never yellow on cream), plum #581E5A (top bar only).
Fonts: Work Sans Bold headings; Work Sans Medium body 16px+, line-height 1.5;
DM Mono uppercase tags 12px+; brand chunky display font for at most one line per
section (fallback Work Sans Bold if no file). No other fonts or colours.
Visual move: daily pack torn straight across its top edge, green bears pouring into
a palm. Big pouch only closed or opened at its resealable top.
Long text max ~34em. One play-once hero entrance; respect prefers-reduced-motion;
announcement rotator needs a pause button. Tap targets ~44px on all buying controls
and accordions. Visible focus rings. Works at 320px and 200% zoom.

SECTIONS (phone layout first)
1. Plum announcement bar: one static line or rotator with pause.
2. Hero: gallery (pouch closed on soft 2-colour gradient; torn pack into palm;
   nutrition label), title "Sprout Superfood Gummies", under-title as is, rating
   with its source named.
3. Four bullets as written, body size.
4. Buying block, one module: Select Flavor (Original "Where fresh strawberries
   meets clean greens."; tie-in tile = flavour description only, no characters or
   partner marks), Select Sugar Level (Low Sugar / Sugar-Free), How many Adults?
   (1 / 2, "Buy More. Save More."), badge "MOST POPULAR: GET UP TO 55% OFF".
   Subscribe & Save: 28 packs each 4 weeks, $66.65 struck, $29.99, $1.07/day, Free
   Shipping Today, Pause Or Cancel Any Time, 30-Day Money-Back Guarantee.
   One Time Purchase: 28 packs delivered once, $66.65, $2.38/day, No Free Shipping,
   No First Order Discount. Equal visual weight for both options.
   Button: Start Now (kelly, white text, full width, 48px+).
   Visible under the button at 14-16px, not small print:
   "Renews at $49.99 each 4 weeks. Cancel anytime."
   "Offer assumes customer has received and uses promotional SMS discount reserved
   for new customers only."
   Beside the guarantee: "This policy applies only to your initial purchase."
   Then: DISCOUNT AUTO-APPLIED, "Less than 1% of customers use our Money-Back
   Guarantee.", "Clinically and 3rd party tested.", HSA/FSA eligible line.
5. Sticky phone bar once the button scrolls away: "$29.99 first box · renews at
   $49.99 each 4 weeks" + Start Now.
6. Why Sprout? as written; display line "No more gagging on pills, sloshing chalky
   powders, or cleaning messy counters." Images: old-way tub/shaker vs torn pack.
7. Real review cards (Vs Powders, Taste) as swipe row, source named.
8. Survey band (deep forest): 95% take it at least 4-6x/week (80% daily), 67%
   better, more regular digestion, 52% feel more energized. Each "of surveyed
   users", survey of 3,000+ customers after 3 months.
9. Us vs. Them as written ($1.26 / $3.60 / ~$35, third label TBC).
10. Quality: 70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial
    contaminants; "Tested by [outside lab] in SEP 2026."; NSF, GMP and
    FDA-registered facilities.
11. Modern Living section: only once the missing stat and sources are supplied.
12. Accordions: Ingredients & Allergies, Low Sugar vs. Sugar-Free, Science &
    Certifications, Directions, Benefits. Nutrition label link outside them.
13. Find Your Flavor: 4 tiles, flavour descriptions only.
14. Birthday price cut, copy as written.
15. Athlete quote with paid-spokesperson disclosure at body size.
16. FAQ as written (limited flavour reverts; ships within 24 hours, arrives 3-5
    days on average; "Sachet is a fancy word for our gummy pack."; returns: "a
    simple 30-day guarantee on your first order ... This policy applies only to
    your initial purchase.").
17. Full reviews widget. 18. Footer with FDA line and SMS-offer sentence.

IMAGES: real product photos only; leave labelled slots where files are missing.
No generated people as reviewers, no generated certificates.
ADD NOTHING: no new offers, prices, percentages, claims, ratings or reviews.
```

---

## Review

Not applicable. No built page or screenshots were supplied.

**Unchecked until a build or screenshots exist:**
- Phone, in-between and desktop rendering.
- Overflow at 320 px.
- Font loading, including the display font.
- Contrast over photos and gradients. This needs a visual check. The hex pairs above are calculated only.
- Real tap-target sizes, focus order and visible focus.
- 200% zoom and reduced-motion behaviour.
- Pop-up timing and whether it covers the plan box.
- Default plan selection (marked inferred on the source page).
- Cart, SMS-discount and checkout behaviour. These need a test inside the store; a local preview won't show them.
- Page speed and analytics.

**Missing inputs:**
- `MISSING: product photo files by view (front, detail, in use, scale)`
- `MISSING: option-picker state designs`
- `MISSING: share of phone visitors`
- `MISSING: the ad(s) sending traffic, to match the first-screen promise`
```
