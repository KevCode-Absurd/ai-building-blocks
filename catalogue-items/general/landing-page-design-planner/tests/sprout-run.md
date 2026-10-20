# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, build-ready plan that keeps every price and term, surfaces the renewal, SMS and first-order-only guarantee limits where buyers will see them, and computes contrast ratios that check out against the supplied hex values. It correctly declines to review without screenshots, marks every missing photo and fact, and hands the risky health claims and discount conflicts back to the owner as decisions rather than fixing them silently.

## Judge list

- Met: Every colour and font in the plan is one you supplied.
  Only #002C17, #00582D, #007E40, #FFF7DF, #FFCC2E, #581E5A; Work Sans bold/medium, DM Mono, display font marked "MISSING: the display font's name and file."
- Met: The three directions differ in layout and what the pictures do, not only in colour.
  A product demo ("they prove the format"), B magazine story ("full-width spreads"), C spec-sheet ("they inspect. Macro texture").
- Met: No offer, claim, review or badge appears that isn't in your facts.
  All prices ($29.99, $49.99, $70.38/$52.79/$32.79, $73.32/$54.99), survey stats, testing counts and badge text match brand.md and product-page.md.
- Met: Delivery, returns and subscription terms stay visible on phones.
  "Directly under it at 16 px, before the button: 'Renews at $49.99 each 4 weeks.'" plus sticky bar "Never the price on its own."
- Met: Each review finding names a section and a screen size.
  No findings made: "Not run, because no screenshots were supplied." Nothing violates the rule.
- Met: Anything it couldn't check, such as contrast over a photo, is listed as not checked.
  "Unchecked: Contrast over photos and gradients. Whether fonts load. Real tap sizes..."

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
# Sprout Original: design plan (redesign, copy and offer kept as-is)

## Design system

**Colours.** These are the brand's own values. No tints and no new colours.

| Colour | Job | Pairs (calculated, recheck in WebAIM) |
|---|---|---|
| Deep forest #002C17 | Headings, body text on cream, dark proof bands | On cream: about 14.3:1 |
| Forest green #00582D | Secondary text, strike-through price, dividers, comparison table | On cream: about 8.1:1. White on it: about 8.6:1 |
| Kelly green #007E40 | Buttons and selected-state fills only | White text on it: about 5.2:1. Edge on cream: about 4.8:1. **On deep forest only about 3.0:1**, so add a 2 px cream border there. Never put it on forest green (about 1.7:1). |
| Cream #FFF7DF | Hero and buying-section background. Text on dark bands. | |
| Sunflower yellow #FFCC2E | Stars and badges only | Deep forest text on it: about 10.1:1. **Yellow on cream is about 1.4:1, which fails.** Stars on cream need a deep forest outline or a deep forest chip behind them. |
| Plum #581E5A | Top announcement bar only | Cream text on it: about 11.2:1 |

**Font roles**
- **Display:** the brand's chunky display font. Use it for one big statement line per section at most.
- **Headings:** Work Sans bold.
- **Body:** Work Sans medium, 16 px minimum, line height about 1.5.
- **Buttons:** Work Sans bold, 18 px.
- **Tags and badges:** DM Mono, uppercase, 12 to 13 px. Labels only, never for terms.
- MISSING: the display font's name and file.

**Main visual move: "the torn-top pour."** One image idea anchors the page and comes back at key moments. A daily pack is torn straight across its top edge, and small deep-green bears pour into an open palm, shown at true thumbnail height.
- The big pouch is only ever shown closed, or open at its resealable top.

**Layout rules**
1. Cream is for buying and choosing. Deep forest bands are for proof and argument. Never place two dark bands back to back.
2. Phones get one column. Desktop goes to two columns only in the hero and plan box (image 7/12, plan 5/12) and in the comparison section.
3. Any price on screen carries its terms in the same block at 16 px. This includes the sticky bar and the birthday band.
4. Yellow appears only as stars or badges, always with deep forest text or an outline.
5. Use an 8 px spacing scale. Section padding is 48 px on phones and 96 px on desktop.

**Line length.** Long text is capped at 65 characters (aim for 45 to 75). FAQ and ingredient text use the same cap.

**Motion**
- No entrance animations on sections. A single 150 ms colour change on button and option state is the only motion.
- The rotating announcement bar is motion that never stops. It needs a visible pause control, must pause on hover and focus, and must stop rotating under reduced motion, showing one message as static text.
- Respect `prefers-reduced-motion` everywhere.

**Accessibility aims**
- Meet WCAG 2.2 AA contrast for every pair in the table above.
- Tap targets are 44 px or more on all plan options, flavour tiles, sugar and adults toggles, accordions, Start Now and the pop-up close button.
- The plan, flavour, sugar and quantity choices are real radio groups.
- When a choice changes the price, announce it through an `aria-live="polite"` region.
- Focus rings are 3 px: deep forest on cream, cream on dark bands.
- No sideways scroll at 320 px wide. Content works at 200% zoom.

---

## Three directions

**A. "The Swap" (product demonstration).** This is the default and is briefed below.
- **First screen:** cream hero. The pouch sits on its soft 2-colour gradient with the torn-top pour in front of it. Below or beside it come the title, subline, rating (which jumps to reviews), four bullets, then straight into the plan box.
- **What the images do:** they prove the format. Pack, pour and palm show what it is and how big it is. The second image is the old way next to the pack: a generic powder tub and shaker, with no brand marks.
- **Argument rhythm:** show it → choose and buy → "easier than your powder" → people who switched → will I keep taking it → what's inside → tested → price → FAQ.
- **Phone:** the plan box starts directly under the bullets. A sticky bottom bar appears once the plan box scrolls away.
- **Desktop:** two columns, with the gallery on the left (sticky while you scroll the plan box) and the plan box on the right.

**B. "Twenty-eight mornings" (story told like a magazine).**
- **First screen:** a deep forest band. The page's existing line "No more gagging on pills, sloshing chalky powders, or cleaning messy counters." is set in the display font over a lifestyle photo of an adult pouring a pack into a hand on the way out the door. Text sits on a solid block, never on the photo.
- A compact price strip with Start Now sits under that, and the full plan box comes after the first spread.
- **What the images do:** they carry the routine as full-width spreads (kitchen counter, bag, desk). No outcome or timeline imagery.
- **Argument rhythm:** narrative and long scroll. The quitter's problem → the routine → the survey habit numbers as the turning point → proof → buy.
- **Phone:** full-bleed images with text blocks below them, not overlaid. A sticky buy bar runs throughout.
- **Desktop:** alternating image and text spreads, with the plan box as a centred "chapter" two-thirds of the way down.

**C. "What's in one pack" (close look at detail and how it's made).**
- **First screen:** a macro of the bears in a palm with the open daily pack for scale. Big numbers sit beside it: 60+ / 21 / 6 g. A "View Nutrition Label" button gets as much weight as the plan.
- **What the images do:** they inspect. Macro texture, the anatomy of the pack's torn top, the label itself, and the testing numbers set as type.
- **Argument rhythm:** spec-sheet. Each block answers the quitter's doubt "a gummy can't hold enough to replace my powder" with a number from the page.
- **Phone:** a stacked number grid, with the label in a full-screen viewer.
- **Desktop:** a three-column number band, with the label shown inline beside the ingredients.
- **Conflict to settle first:** this direction depends on the count conflict ("21" vs "over 20") being settled.

---

## Section plan (direction A)

| # | Section (existing content) | Buyer question | Phone layout → desktop | Image |
|---|---|---|---|---|
| 0 | Announcement bar (4 rotating lines) | What's the deal right now? | One line, plum, cream text, pause button. Desktop: same, centred. | None |
| 1 | Hero: title, subline, rating, 4 bullets | What is this, and is it the thing from the ad? | Image first (4:5), then title, rating link, bullets. Desktop: image left 7/12, text and plan right 5/12. | MISSING: pouch on gradient plus the torn-top pour into a palm. Leave a labelled slot. |
| 2 | Plan box: flavour, sugar, adults, Subscribe & Save / One Time, Start Now, terms | What do I pay now, what later, and what am I agreeing to? | Stacked radio cards at full width, then the button, then terms. Desktop: right column, sticky gallery on the left. | Flavour tiles show colour and shape only, no tie-in characters or marks |
| 3 | "Why Sprout?" (taken out of its accordion) | Is this easier than my powder? | Four short blocks (Comprehensive, Delicious, Portable, No Mess) in one column. Desktop: 2×2 next to the image. | MISSING: generic tub and shaker vs the daily pack |
| 4 | Review cards, Vs Powders theme first (moved up from "Join 1,000,000+") | Did people like me switch and stick? | Swipe row of 3 cards. Desktop: 3 across. | None. Reviews are text, not product photos. |
| 5 | Snackable, Packable, Tested (survey) | Will I actually keep taking it? | Three stacked stat lines with "Survey of 3,000+ customers after 3 months" right beside them. Desktop: 3 across. | None |
| 6 | Ingredients & Allergies, plus View Nutrition Label | Can a gummy hold enough? | Short summary, then the accordion holding the full list. Desktop: label image beside it. | MISSING: label image |
| 7 | Science & Certifications plus Quality You Can Trust | Is it tested? | Study summary, then a 4-number testing grid, then the lab line. Desktop: two columns. | None, or a photo of the facility if one exists. No stand-in certificates. |
| 8 | Us vs. Them | Is it worth the price? | 3-row table. Desktop: 3 columns. Held: third column label MISSING, figures need a recheck. | None |
| 9 | Birthday price cut | Is $29.99 real? | Deep forest band with display line, then the SMS term, then a button back to the plan box. Desktop: one band. | None |
| 10 | Athlete quote | Who else stands behind it? | Quote, then name, then the paid-spokesperson note directly under it at 16 px. | MISSING: athlete photo |
| 11 | Find Your Flavor | Which version is mine? | 2×2 tiles (items that really are alike). Desktop: 4 across. | Pouch shots. Tie-in shown by flavour description only. |
| 12 | Modern Living Leaves Our Bodies Deficient | Why do I need it at all? | Held until the missing number and real sources are supplied. | None |
| 13 | FAQ | What happens with flavours, delivery, returns? | Accordions, 44 px rows. Desktop: 65-character column. | None |
| 14 | Real Customer Reviews widget | What do most buyers say? | As now, styled to the system | None |
| 15 | Footer | Fine print | FDA line, SMS term | None |

**Plan box details**
- **Price block:**
  - ~~$66.65~~ $29.99 · $1.07/day.
  - Directly under it at 16 px, before the button: "Renews at $49.99 each 4 weeks. Cancel anytime."
  - Then the footer sentence, verbatim: "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only."
- **Guarantee:** "30-Day Money-Back Guarantee" stays in the plan box. The FAQ sentence "This policy applies only to your initial purchase." sits beside it, verbatim.
- **One Time Purchase card:**
  - Same size and weight as the subscribe card.
  - "No Free Shipping. No First Order Discount." set in plain forest green text, with no red or cross icons.
- **Tie-in flavour selected:**
  - Show the existing FAQ line under the selector: "After you try [it] once, your subscription automatically reverts to your original Sprout flavor."
  - Prices update to $70.38 / $52.79 / $32.79 (Low Sugar), $77.05 / $57.79 (Sugar-Free).
- **Sugar-Free selected:** prices update to $73.32 one-time and $54.99 subscription. First-order price MISSING.
- **Badge:** "MOST POPULAR: GET UP TO 55% OFF" in deep forest on yellow.
- **Sticky bar (phone):** Start Now with the current price and "Renews at $49.99 each 4 weeks." Never the price on its own.

---

## Build brief (direction A, "The Swap")

```
PAGE JOB: Main product page, Sprout Original (Adults), sprout.example/products/sprout.
Buyer: adults who quit greens powders/pills. Show the real format, make the
buying decision and its terms clear, back it with existing proof. Add no copy,
claims, offers or proof. Use page copy verbatim.

SYSTEM
Colours: #002C17 headings/body/dark bands · #00582D secondary text, strike
price, dividers · #007E40 buttons + selected states (2px #FFF7DF border on
#002C17) · #FFF7DF backgrounds + text on dark · #FFCC2E stars/badges only,
never on cream without #002C17 outline · #581E5A announcement bar only.
Type: display font [MISSING name] for 1 big line per section max; Work Sans
bold headings + buttons (18px); Work Sans medium body 16px/1.5; DM Mono
uppercase 12-13px tags only. Long text max 65ch. 8px spacing; sections
48px phone / 96px desktop. No section entrance animations. Respect
prefers-reduced-motion. Announcement bar rotation: pause control, pauses on
hover/focus, static under reduced motion.
Tap targets ≥44px on all choices, accordions, buttons, pop-up close. Choices
are radio groups. Price changes announced aria-live polite. Focus ring 3px.
No sideways scroll at 320px. Works at 200% zoom.

IMAGE RULES: Daily pack torn straight across the top edge only. Gummies pour
from the torn top into a palm. Big pouch closed or open at resealable top,
never torn. No cartoon tie-in characters or partner marks. Bears at true
thumbnail size. No text over photos or gradients. Use labelled empty slots
where real photos are missing. No generated product photos.

SECTIONS (phone layout → desktop)
0 Announcement bar: plum, 4 existing lines, one at a time, pause button.
1 Hero: image (4:5) → title "Sprout Superfood Gummies" → subline → rating
  "4.8/5.0 (100,000), 1M+ Customers" linking to #reviews → 4 bullets.
  Desktop: image 7/12 sticky left, content 5/12 right.
2 Plan box (same column): flavour tiles (Original / Brand New tie-in,
  description only) → Low Sugar / Sugar-Free → How many Adults 1/2 →
  Subscribe & Save card [badge "MOST POPULAR: GET UP TO 55% OFF"]:
  "28 packs each 4 weeks. ~~$66.65~~ $29.99. $1.07/day. Free Shipping Today.
  Pause Or Cancel Any Time. 30-Day Money-Back Guarantee." + "This policy
  applies only to your initial purchase." → One Time card, equal weight:
  "28 packs delivered once. $66.65. $2.38/day. No Free Shipping. No First
  Order Discount." → under price, before button, 16px: "Renews at $49.99
  each 4 weeks. Cancel anytime." + "Offer assumes customer has received and
  uses promotional SMS discount reserved for new customers only." → Start
  Now → "DISCOUNT AUTO-APPLIED", "Less than 1% of customers use our
  Money-Back Guarantee", "Clinically and 3rd party tested", "HSA/FSA
  eligible with [third-party service]".
  Price updates: Sugar-Free $73.32 / $54.99. Tie-in Low Sugar $70.38 /
  $52.79 / $32.79; Sugar-Free $77.05 / $57.79. Tie-in selected: show "After
  you try [it] once, your subscription automatically reverts to your
  original Sprout flavor."
  Phone sticky bar after plan box scrolls away: Start Now + live price +
  renewal line.
3 Why Sprout? (no accordion): 4 blocks, 1 col → 2×2. Image slot: generic
  powder tub + shaker vs daily pack.
4 Review cards, Vs Powders theme first: swipe row → 3 across.
5 Survey: 95% / 67% / 52% with "Survey of 3,000+ customers after 3 months"
  beside them. Stacked → 3 across.
6 Ingredients & Allergies accordion + View Nutrition Label. Label image
  beside on desktop.
7 Science & Certifications + testing grid (70 pesticides, 4 heavy metals,
  16 contaminants, 9 microbial) + "Tested by [lab] in SEP 2026."
8 Us vs. Them: HOLD until third column label and figures confirmed.
9 Birthday band (#002C17): existing lines + SMS sentence + button to plan.
10 Athlete quote + paid-spokesperson note directly beneath, 16px.
11 Find Your Flavor: 4 tiles, 2×2 → 4 across.
12 Modern Living stats: HOLD until the missing number + sources supplied.
13 FAQ accordions, existing text.
14 #reviews widget: "4.75 stars, 109,639 reviews".
15 Footer: FDA line + SMS offer sentence.
Pop-up "Sign Up for 55% Off": keep current trigger; labelled close button
≥44px; focus trapped while open, returned on close; Esc closes.
```

---

## Review

Not run, because no screenshots were supplied. The visual and technical passes need phone, desktop and in-between widths of the built page.

Issues already visible in the page text are handled in the plan above where design can fix them. Owner decisions are listed below.

Unchecked:
- Contrast over photos and gradients.
- Whether fonts load.
- Real tap sizes.
- Pop-up timing and behaviour.
- Cart and checkout behaviour inside the store (a local preview can't test it).
- Analytics.

## Decisions only the brand can make (design can't fix these without changing copy or offer)

- **Discount numbers.** Four live figures (52%, "up to 55%", 55%, and the 61% ad) plus 49% and 58% elsewhere. Which one matches the ad sending this traffic?
- **"DISCOUNT AUTO-APPLIED" vs the SMS condition.** The two contradict. Both are kept verbatim side by side for now.
- **Header rating.** "4.8/5.0 (100,000)" vs the widget's 4.75 from 109,639 on the same page.
- **Bullets.** "Promotes mental clarity + energy", "Supports immunity + stress relief" and the subline "revive whole body vitality" sit above the fold. The study measured 2 vitamins in the blood. Design gives them no extra weight, but the wording is the brand's call.
- **Price comparison.** "$1.26" per serving in Us vs. Them doesn't match the plan box's $1.07/day and $49.99 renewal.
- **Sugar-Free warning.** No note about sugar alcohols was seen on the page. The gut-sensitive buyer is a core buyer.

## Gaps (MISSING)

- MISSING: real product photos (pouch on gradient, torn-top pour, palm for scale, label, athlete, generic old-way props).
- MISSING: the display font's name and file.
- MISSING: which ad drives traffic, and its promise.
- MISSING: review card text for the Vs Powders theme.
- MISSING: Sugar-Free first-order price, and prices for 2 adults.
- MISSING: the Low Sugar vs. Sugar-Free panel content.
- MISSING: the third column label in Us vs. Them.
- MISSING: the "don't meet daily nutrient intake" number and real source links.
- MISSING: the pop-up's current trigger.
- MISSING: share of visitors on phones.

## Checks missed

- **Essential terms visible on phones:** met in the plan, but unconfirmed on a built page because there are no screenshots.
- **Findings name section and screen size:** no review was run, so there are no findings yet.

---

Next step: want to write the page with the [Shopify landing page builder](https://useaiblocks.com/skills/shopify-landing-page-builder) using direction A? Or tell me what you'd rather do.
```
