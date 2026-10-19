# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, usable plan: it keeps every brand colour, font, price and term, moves the SMS condition and first-order guarantee limit next to the button, and flags the page's risky claims and discount conflicts instead of fixing them silently. The contrast ratios all check out against the supplied hexes, and every unknown (photos, display font name, ad promise, third-column label) is marked MISSING rather than guessed.

## Judge list

- Met: Every colour and font in the plan is one you supplied
  Colours table lists only the six brand hexes; type is Work Sans Bold/Medium, DM Mono, and "[brand display font]" marked MISSING. White appears only as default text on kelly/plum.
- Met: The three directions differ in layout and what the pictures do, not only in colour
  A "tear-and-pour photo... plan box immediately beneath"; B "half-used tub and shaker beside one Sprout pouch"; C "Macro crop... 60+ / 21 / 6 g".
- Met: No offer, claim, review or badge appears that isn't in your facts
  Build brief: "Add no offers, claims, ratings, reviews, badges or images not listed"; all prices, stats and badges match product-page.md.
- Met: Delivery, returns and subscription terms stay visible on phones
  "MUST STAY VISIBLE ON PHONE: $29.99 first box; renews at $49.99 each 4 weeks; SMS-discount condition; guarantee is first order only; one-time price $66.65."
- Met: Each review finding names a section and a screen size
  No built page; copy flags table has Section and Screen size columns, e.g. "1 | All | 'Promotes mental clarity + energy'...".
- Met: Anything it couldn't check is listed as not checked
  "Unchecked items: Contrast of text over the gallery photos and gradients... Display font loading... Real cart, subscription and SMS-discount behaviour..."

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
# Sprout Original product page: design plan (redesign, powder-quitter buyer)

`MISSING: the ad's promise and creative that sends traffic here.` The plan keeps the powder-quitter story in the first screen. Swap the hero image and tag to match the real ad once it's known.
`MISSING: product photos.` Every image below is a labelled slot, not a generated stand-in.
`MISSING: name and file of the chunky display font.`
`MISSING: Low Sugar vs. Sugar-Free panel content` and `the number in the "don't meet daily nutrient intake" stat`.

---

## Design system

**Colours (brand values only, contrast worked from the hex codes)**

| Colour | Job | Contrast notes |
|---|---|---|
| Cream #FFF7DF | Hero and buy-box background, light sections | Deep forest text on cream is 14.3:1 |
| Deep forest #002C17 | Headings, body text on light backgrounds, dark proof sections | Yellow on deep forest is 10.1:1 |
| Forest green #00582D | Secondary headings, selected-plan border, icon strokes | 8.1:1 on cream; white on it is 8.6:1 |
| Kelly green #007E40 | Buttons and selected states only | White text is 5.2:1. Edge against cream is 4.8:1. Never put deep-forest text on kelly (3.0:1). |
| Sunflower #FFCC2E | Stars, the "MOST POPULAR" badge, numeric highlights on dark sections | Only 1.4:1 on cream. On cream, stars need the numeric rating beside them in deep forest, and the badge needs deep-forest text inside it. |
| Plum #581E5A | Announcement bar only | White on plum is 12.0:1; yellow on plum is 8.0:1 |

**Font roles**
- Display font: big statement lines and the stat numbers (60+, 21, 6 g, 95%). Never used for body text or terms.
- Work Sans Bold: H1, H2 and button labels.
- Work Sans Medium: body text, plan rows and terms.
- DM Mono uppercase: small tags, source labels, badges. Tags are at least 12 px and never carry essential terms.

**Main visual move: "the torn-top pour"**
- Every key image shows a daily pack torn straight across the top edge, with deep-green bears pouring into a palm.
- The setting is a soft 2-colour gradient built from cream with a forest or yellow tint.
- In the hero, the pour visually leads down to the plan box.
- The big pouch is only ever shown closed or open at its resealable top.

**Layout rules**
1. Phone uses one column. Desktop uses 12 columns, with the buy box in the right 5 columns. The buy box stays sticky until the end of section 2.
2. Light (cream) and dark (deep forest) sections alternate. There are never two dark sections in a row.
3. Every number in the display font carries a DM Mono source label directly under it, for example "OF SURVEYED USERS · 3,000+ CUSTOMERS".
4. Cards are used only for items that really are alike: flavour tiles and review cards. Arguments get full-width sections.
5. Price, renewal, discount condition and guarantee limit always sit together, both in the buy box and in the phone sticky bar.

**Line length:** 45–75 characters on desktop, with a max text width of about 65ch. Short lines on phones are fine.

**Body text:** 16 px on phone, 18 px on desktop, line height 1.5. Terms are 16 px and never shrunk below body size.

**Motion**
- Only state changes animate: plan selection, accordions and the sticky bar appearing. Each is a 150–200 ms fade or slide.
- No scroll entrance effects.
- The announcement bar rotation pauses on hover and focus, and has a visible pause button.
- With `prefers-reduced-motion`, the bar shows one static message and all transitions are off.

**Accessibility aims**
- WCAG 2.2 AA contrast: 4.5:1 for normal text, 3:1 for large text and controls.
- Tap targets of at least 44 px on the plan rows, selectors, Start Now, accordions and the pop-up close button.
- A visible focus ring in forest green, 2 px with an offset.
- Logical DOM order: the buy box comes in the DOM right after the title and rating, even on desktop.
- Works at 200% zoom with no horizontal scroll at 320 px.
- Every gallery image has alt text naming the variant (Original, Low Sugar or Sugar-Free).

---

## Three directions

| | **A. "Rip. Tip. Done." (product demonstration)** | **B. "Shelf to sachet" (magazine story)** | **C. "What's in the pack" (close look and how it's made)** |
|---|---|---|---|
| **First screen** | Gallery led by a tear-and-pour photo with title, rating and plan box immediately beneath. Existing Why Sprout line as a DM Mono tag: "NO MORE GAGGING ON PILLS, SLOSHING CHALKY POWDERS…" | Full-width cream spread: a half-used tub and shaker (no brand marks) beside one Sprout pouch. Title and rating overlap the image edge; buy box follows. | Macro crop of deep-green bears pouring from a torn pack. The 3 numbers sit beside it: 60+ / 21 / 6 g. Buy box below. |
| **What images do** | Show the ritual: tear, pour, eat, with no mixing. The images prove the format, not satisfaction. | Contrast the old routine with the new one, told as a before/after life scene with everyday adults at home. | Show the object and its making: gummy texture, pack size in a palm, the label link, testing panel imagery. |
| **Argument rhythm** | Show → buy → why it replaces the powder → people who switched → cost → tested → FAQ. Short, fast, buy-first. | Problem (the shelf) → the switch → readers' stories → buy → proof. Longer, story-led, buy box repeated mid-page. | Inside → tested → studied → buy → stick-with-it survey → reviews. Detail-led, for doubters of "a gummy can't hold enough." |
| **Phone** | Sticky bottom bar after the plan box scrolls away. Gallery is 1:1. | Spread crops to a vertical 4:5 with the tub left and pouch right. Sticky bar from section 2. | Numbers stack under the macro image. The buy box arrives later, so the sticky bar appears from the first screen. |
| **Desktop** | Gallery in 7 columns, sticky buy box in 5. | Edge-to-edge spreads; buy box sits as a full-width band mid-page. | Two-column detail rows with image and fact, alternating sides. |
| **Fits the buyer because** | Answers "will I actually stick with this?" by showing how little effort it takes. | Mirrors the review line "the one thing I've been able to stick to." | Answers the "can a gummy replace my powder" doubt. |

---

## Section plan (direction A order)

Copy is unchanged; existing blocks are reordered.

| # | Section | Buyer question | Phone layout → desktop | Image |
|---|---|---|---|---|
| 0 | Announcement bar (plum) | "Is there a deal?" | One line with pause button and 4 rotating messages. Same on desktop, centred. | None |
| 1 | Gallery + title + rating + bullets | "Is this the thing from the ad?" | 1:1 gallery with swipe and dots, then title, under-title, rating, 4 bullets. "Clinically tested for nutrient absorption" links to section 6. Desktop: gallery in 7 columns, the rest in 5. | Slots: (1) torn-top pour into a palm, (2) Original pouch front, Low Sugar, (3) Sugar-Free pouch with white burst, (4) pack beside a hand for scale, (5) "View Nutrition Label" image |
| 2 | Buy box | "What do I pay, now and later, and what's the catch?" | Selectors stacked: flavour tiles, sugar level, adults 1/2. Plan rows are full-width 56 px radios. Start Now is full width. Terms sit directly under the button (see build brief). Desktop: sticky in the right 5 columns. | Flavour tile thumbnails (slots) |
| 2a | Phone sticky bar | Same as 2 | Bottom bar showing the plan price, "Renews at $49.99 each 4 weeks", and Start Now (48 px). It appears once section 2 leaves view. Desktop: not used, because the buy box is sticky. | None |
| 3 | Why Sprout? (accordion content shown open) | "Why switch from my powder?" | Four short blocks stacked: Comprehensive, Delicious, Portable, No Mess. Desktop: 2×2 grid, which is fine because these are 4 parallel reasons. | Slot: tub, shaker and pill bottles (no marks) versus one torn pack |
| 4 | Join 1,000,000+ (Vs Powders reviews first) | "Did other powder quitters stick with it?" | Horizontal-scroll review cards with the Vs Powders theme first, then Taste, Value, Convenience. Desktop: 3-card row with arrows. | `MISSING: review text and photos.` Use the existing cards only. |
| 5 | Snackable, Packable, Tested (survey) | "Do people keep taking it?" | Dark section: 95% / 80% / 67% / 52% stacked in the display font, each with "OF SURVEYED USERS" plus "Survey of 3,000+ customers after 3 months". Desktop: 4 across. | None |
| 6 | Science & Certifications + Quality You Can Trust | "Is it real and is it clean?" | Study block: 2025, 12 weeks, 120 adults, vitamin C +40.1%, folate +20.5%. Then the test counts 70 / 4 / 16 / 9 and "Tested by [lab] in SEP 2026". Then NSF, GMP and FDA-registered facilities. Desktop: 2 columns. | Slot: lab or lot-testing photo only if the brand has one. No certificate imagery unless real. |
| 7 | Us vs. Them | "Is it actually cheaper?" | 3-column cost table that scrolls inside its own box at 320 px. Desktop: full table. | `MISSING: third column label.` |
| 8 | Birthday price cut | "Will this price last?" | Dark band with the display-font line. Desktop: centred. | Slot: pouch with a yellow badge |
| 9 | Athlete quote | "Who else uses it?" | Quote, name, photo, with the paid-spokesperson note at body size directly under the name. | Slot: athlete photo (brand-supplied only) |
| 10 | Modern Living Leaves Our Bodies Deficient | "Do I even need this?" | Stats stacked with source links. Hold the first stat until its number is supplied. | None |
| 11 | Find Your Flavor | "Other flavours or kids?" | 2×2 tiles, the same on desktop in a row of 4. | Pouch slots. Tie-ins use the flavour description only, with no characters or marks. |
| 12 | Accordions: Ingredients & Allergies, Low Sugar vs. Sugar-Free, Directions, Benefits | "What's in it? Which sugar level?" | 44 px+ accordion rows, closed by default. Desktop: same, max width 65ch. | None |
| 13 | FAQ (Any last questions?) | "Limited flavour, delivery, returns?" | Accordions. The returns answer opens with the existing first-order wording. | None |
| 14 | Real Customer Reviews widget | "What do all reviewers say?" | Widget as is, labelled "4.75 stars, 109,639 reviews" with its source. | None |
| 15 | Footer | – | FDA line and the SMS small print, both kept. | None |

**Copy flags for the owner.** The design places these but doesn't fix them; changing them is a copy or scope decision.

| Section | Screen size | Flag |
|---|---|---|
| 1 | All | "Promotes mental clarity + energy", "Supports immunity + stress relief" and "revive whole body vitality" aren't backed by the study. The study proof link goes only beside the absorption bullet. |
| 0, 2 and pop-up | All | The discount figures 52%, "up to 55%" and 55% conflict on one visit. |
| 1 | All | The header rating "4.8/5.0 (100,000)" differs from the widget's 4.75 from 109,639. |
| 7 | All | The $1.26 vs $3.60 price comparison is dated and needs a recheck. |

---

## Build brief (direction A)

```
PAGE JOB: Product page for Sprout Original (Adults) gummies, 28 daily packs.
Buyer: adults who quit greens powders and pill stacks and want one habit that
lasts. Show the tear-and-pour ritual first, then a clear buying decision with
all real terms beside the button. Use only the copy, prices and terms below.
Add no offers, claims, ratings, reviews, badges or images not listed.

DESIGN SYSTEM
Colours: cream #FFF7DF (hero, buy box, light sections); deep forest #002C17
(headings, body text, dark sections); forest #00582D (secondary headings,
selected-plan border, focus ring); kelly #007E40 (buttons and selected states,
white text only); sunflower #FFCC2E (stars, badges; deep-forest text inside;
never as text on cream); plum #581E5A (announcement bar, white text).
Type: [brand display font] for big lines and stat numbers; Work Sans Bold for
H1/H2/buttons; Work Sans Medium for body 16px phone / 18px desktop, line
height 1.5; DM Mono uppercase 12px+ for tags and source labels. Max text
width 65ch.
Motion: 150–200ms fades on plan select and accordions only. Announcement
rotation has a pause button; static under prefers-reduced-motion. No scroll
animations.
Accessibility: AA contrast; 44px tap targets on plan rows, selectors, buttons,
accordions, pop-up close; visible focus; no horizontal scroll at 320px; works
at 200% zoom.

SECTIONS IN ORDER (phone layout)
0 Announcement bar, plum, one line, rotating: "VIP program is live! Save up to
  $80, get limited flavors, and VIP access" / "NEW! [tie-in flavour]. Grab it
  before it's gone." / "Limited Time Sale. Save 52% + free shipping on your
  first order" / "FREE SHIPPING + 30-DAY GUARANTEE".
1 Gallery 1:1 swipe. Then H1 "Sprout Superfood Gummies"; "60+ potent
  ingredients to revive whole body vitality in great tasting gummies."; rating
  "4.8/5.0 (100,000), 1M+ Customers" (yellow stars + number in deep forest);
  bullets: Promotes mental clarity + energy / Supports immunity + stress relief
  / Supports digestion and gut health / Clinically tested for nutrient
  absorption (links to section 6). "View Nutrition Label" link.
2 Buy box. Flavour tiles: Original "Where fresh strawberries meets clean
  greens." / "Brand New" [tie-in flavour]. Sugar level: Low Sugar / Sugar-Free.
  "How many Adults? Buy More. Save More." 1 / 2. Badge "MOST POPULAR: GET UP
  TO 55% OFF". Plan rows (full width radios):
  - Subscribe & Save (default): 28 packs each 4 weeks. ~~$66.65~~ $29.99.
    $1.07/day. Free Shipping Today. Pause Or Cancel Any Time. 30-Day
    Money-Back Guarantee.
  - One Time Purchase: 28 packs delivered once. $66.65. $2.38/day. No Free
    Shipping. No First Order Discount.
  Button "Start Now", full width, kelly. Directly under, at 16px, in this
  order: "DISCOUNT AUTO-APPLIED." / "Renews at $49.99 each 4 weeks. Cancel
  anytime." / "Offer assumes customer has received and uses promotional SMS
  discount reserved for new customers only." / "30-day guarantee on your first
  order. This policy applies only to your initial purchase." / "Less than 1%
  of customers use our Money-Back Guarantee. Clinically and 3rd party tested.
  HSA/FSA eligible with [third-party service]."
2a Phone sticky bar once section 2 scrolls away: selected price + "Renews at
  $49.99 each 4 weeks" + "Start Now". Desktop: buy box sticky instead.
3 Why Sprout? shown open: Comprehensive / Delicious / Portable / No Mess, No
  Stress (existing text). Image: tub + shaker + pill bottles, no brand marks,
  beside one torn pack.
4 "Join 1,000,000+ Others Filling Nutrition Gaps": existing review cards,
  Vs Powders theme first, then Taste, Value, Convenience. Horizontal scroll.
5 Dark section "Snackable, Packable, Tested": 95% take it at least 4–6x a week
  (80% daily); 67% better, more regular digestion; 52% feel more energized.
  Label each "OF SURVEYED USERS · SURVEY OF 3,000+ CUSTOMERS AFTER 3 MONTHS".
6 Study: 2025, 12 weeks, randomized, double-blind, placebo-controlled, 120
  healthy adults 23–59; blood vitamin C +40.1% (2.7x placebo), folate +20.5%
  (2.9x placebo). "Quality You Can Trust": tested for 70 pesticides, 4 heavy
  metals, 16 contaminants, 9 microbial contaminants. "Tested by [outside lab]
  in SEP 2026." NSF, GMP and FDA-registered facilities.
7 "Us vs. Them. Not overhyped or overpriced." Sprout $1.26 / greens powders
  $3.60 / [third column ~$35, label missing]. Table scrolls in its own box.
8 Dark band: "Same Sprout. New Lower Price. Subs Now Start at $29.99." + "It's
  our birthday, and we're lowering prices. Not just for a week but
  indefinitely. Happy Birthday to us!"
9 Athlete quote with the paid-spokesperson note at body size under his name.
10 "Modern Living Leaves Our Bodies Deficient" with source links (hold first
  stat until its number is supplied).
11 "Find Your Flavor" 2x2 tiles: Original Adults, tie-in Adults, Original
  Kids, tie-in Kids. Flavour description only; no characters, no partner marks.
12 Accordions: Ingredients & Allergies; Low Sugar vs. Sugar-Free; Directions;
  Benefits (existing text).
13 FAQ accordions (existing questions and answers, unchanged).
14 Reviews widget: "4.75 stars, 109,639 reviews".
15 Footer: FDA line; SMS offer small print.
Pop-up "Sign Up for 55% Off": appears after the buy box is seen, never over
  the button on phone, close button labelled "Close" with a 44px target.

IMAGES: real brand photos only, in labelled slots until supplied. Daily pack
torn straight across the top edge only. Gummies pour from the torn top into a
palm. Big pouch never torn; only open at the resealable top. Bright, sunny,
soft 2-colour gradient from cream. Alt text names the variant.

MUST STAY VISIBLE ON PHONE: $29.99 first box; renews at $49.99 each 4 weeks;
SMS-discount condition; guarantee is first order only; one-time price $66.65.
```

---

## Review

Not applicable: no built page or screenshots were supplied.

Unchecked items:
- Contrast of text over the gallery photos and gradients (needs a visual check once photos exist).
- Display font loading.
- Real cart, subscription and SMS-discount behaviour (needs a test inside the store).
- Announcement bar and pop-up timing.
- Analytics.
- Phone first-screen fill, because no screenshots exist.

---

## Score

**Plan: 6 / 6 × 100 = 100**
- All colours and fonts come from the brand: passed. The display font is the brand's own, but its name is missing.
- Three directions differ in layout and in what the images do: passed.
- No new offer, claim or proof was created: passed. Existing wording is only moved, and the conflicts are flagged for the owner.
- Essential terms stay visible on phones: passed, through the buy box and sticky bar.
- Flags name their section and screen size: passed.
- Unchecked items are listed: passed.

**Built page:** not scored, because no page was supplied.
```
