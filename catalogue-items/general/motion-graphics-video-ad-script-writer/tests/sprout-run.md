# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A tight, buildable 20-second plan that uses only the approved counts, the study figures and the full offer terms, with holds and timing that add up correctly. It flags the missing photo, placebo figure and shipping/guarantee terms honestly rather than guessing, so the owner can hand it straight to the build step once those are supplied.

## Judge list

- Met: Every number on screen is on the fact sheet, with a source.
  Fact sheet F1–F10 covers 60+, 21, 6g, 40.1%, 2.7x, 2025/12 weeks/120 adults, $29.99, $49.99; placebo height F8 "never shown as a number".
- Met: Each chart starts at zero and its bars match their numbers.
  "Two bars stand on one baseline from zero: Sprout (height 40.1) and placebo (height ≈14.85, scaled from F8)"; 40.1 ÷ 2.7 = 14.85.
- Met: Each shot has one fact and one on-screen line of about 30 characters or fewer.
  Longest main line "21 vitamins & minerals (22)"; shot 6's F5 is the required source line, shot 8's extra lines are mandated price terms.
- Met: The look card names your real colours and fonts, with one highlight colour.
  "Cream #FFF7DF… Forest green #00582D… Highlight: Sunflower yellow #FFCC2E"; Work Sans Bold/Medium, DM Mono.
- Met: The full price terms appear wherever the price does.
  Shot 8: "$29.99" with "WITH TEXT SIGN-UP" / "RENEWS AT $49.99 EACH 4 WEEKS" / "CANCEL ANYTIME"; price appears nowhere else.

## What went in

```text
Idea: what's in one pack, and proof it's absorbed.
Buyer: knows Sprout, maybe from a store shelf. Worried gummies
are just sweets.
Colours: cream #FFF7DF, forest green #00582D, deep forest #002C17,
kelly green #007E40, sunflower yellow #FFCC2E.
Fonts: Work Sans bold (headings), Work Sans medium (body), DM Mono
(small uppercase tags).
Product: Sprout pouch (glossy deep green, yellow wordmark), clean
photo on file.
Approved: "60+ ingredients, 21 vitamins & minerals, and 6g fiber"
in 1 pack. "Clinically tested for nutrient absorption": 2025 study,
12 weeks, 120 adults, vitamin C +40.1% (2.7x placebo).
Offer: $29.99 first order with text sign-up. "Renews at $49.99
each 4 weeks. Cancel anytime."
Video, 20 seconds, tall.
```

## What came out

```text
## 1. Fit
A graphic ad fits this buyer: they already know Sprout from the shelf, and their doubt is a specific one ("just sweets"). Hard counts, a charted study and plain terms answer it better than a story would.

## 2. Look card
- **Frame:** Tall 9:16, 1080×1920. Outer margin 80 px. Keep these areas free of words: the top 250 px, the bottom 380 px (caption and buttons) and the right 120 px (app icons). All text sits in the central column above the pouch.
- **Colour jobs:**
  - **Background:** Cream #FFF7DF across most of the frame.
  - **Brand shapes:** Forest green #00582D for stack cards, the Sprout bar and the price panel. Kelly green #007E40 for secondary shapes and the placebo bar.
  - **Type:** Deep forest #002C17 for all type.
  - **Highlight:** Sunflower yellow #FFCC2E is kept for the one thing each shot is about. It appears as a chip or underline behind that word or number, never as yellow text on cream, which would be hard to read.
- **Type:**
  - **Main line:** Work Sans Bold, about 96 px.
  - **Label:** Work Sans Medium, about 44 px.
  - **Small line:** DM Mono uppercase, about 26 px, for the study source and offer terms.
- **Product:**
  - The real photo of the Sprout pouch, cut out true to its shape. Keep the glossy deep-green finish, the reflections and the yellow wordmark exactly as printed.
  - Add one soft shadow below it.
  - Place it lower-left of centre, about 40% of frame height, and keep it in that spot from shot 1 to the end.
  - Never redraw it as an icon or reset the wordmark in another font.
- **Motion:**
  - **In:** Rise 40 px and fade in, ease-out, 0.4 s.
  - **Out:** Fade out and drop 20 px, ease-in, 0.3 s.
  - **Numbers:** Snap into place with the same ease-out.
  - **Bars:** Grow from the baseline over 0.5 s, ease-out.

## 3. Fact sheet
| # | Fact | Source |
|---|---|---|
| F1 | 60+ ingredients in 1 pack | Brand approved claim |
| F2 | 21 vitamins & minerals in 1 pack | Brand approved claim |
| F3 | 6g fiber in 1 pack | Brand approved claim |
| F4 | "Clinically tested for nutrient absorption" | Brand approved claim, based on the 2025 study |
| F5 | 2025 study, 12 weeks, 120 adults | Brand approved claim (study details) |
| F6 | Vitamin C +40.1% | 2025 study, as approved |
| F7 | 2.7x placebo | 2025 study, as approved |
| F8 | Placebo bar height ≈ 14.9% | Derived from 40.1 ÷ 2.7. Used only to draw the bar; never shown as a number |
| F9 | $29.99 first order, with text sign-up | Brand offer |
| F10 | "Renews at $49.99 each 4 weeks. Cancel anytime." | Brand offer terms, always shown with F9 |

## 4. Shot table
| # | Fact | Narration | Picture and move | On-screen text (characters) | Hold | Build note |
|---|---|---|---|---|---|---|
| 1 | Product: Sprout pouch | "Just sweets? Here's one Sprout pack." | The pouch arrives into its anchor spot and settles with its shadow. A yellow chip sits behind "sweets?" | Just sweets? (12) | 2.2 s | Editor or code: pouch cutout plus live text. Video model: cream background only, with pouch and text placed on top. |
| 2 | F1 | "Over 60 ingredients," | The first stack card (forest green) slides in beside the pouch. "60+" counts up, then holds, on a yellow chip. | 60+ ingredients (15) | 1.8 s | Live text. Count-up is a code animation, not generated. |
| 3 | F2 | "21 vitamins and minerals," | A second card joins under the first and "21" snaps in on the chip. The first card stays still and loses its chip. | 21 vitamins & minerals (22) | 2.1 s | Live text. Model: plain green card shapes only, with no text in them. |
| 4 | F3 | "and 6 grams of fiber." | A third card joins and "6g" snaps in on the chip. The other two cards hold still. | 6g fiber (8) | 1.8 s | Live text. |
| 5 | F4 | "Clinically tested for nutrient absorption." | The stack leaves together (the one exit move). The main line arrives with the label "nutrient absorption" below it in Work Sans Medium. A yellow underline sits under "Clinically". | Clinically tested (17) | 2.3 s | Live text. Don't paraphrase the claim in the narration. |
| 6 | F5, F6 | "Over 12 weeks, vitamin C was up 40.1 percent—" | Two bars stand on one baseline from zero: Sprout (forest green, height 40.1) and placebo (kelly, height ≈14.85, scaled from F8). Both grow from zero. Only the Sprout bar gets the yellow "+40.1%" chip. The small line reads: "2025 STUDY · 12 WEEKS · 120 ADULTS · VS PLACEBO". | Vitamin C +40.1% (16) | 3.2 s | Build the bars in code from these values. Never use a model for the bars. The placebo bar carries a "PLACEBO" tag, with no number. |
| 7 | F7 | "2.7 times placebo." | The bars hold still. A bracket joins the two bar tops and "2.7x" snaps in on the chip. The source line stays. | 2.7x placebo (12) | 1.8 s | Live text. The bracket is a code shape. |
| 8 | F9, F10 | "Text to sign up: first order $29.99. Renews at $49.99 each 4 weeks. Cancel anytime." | The pouch sits with the offer panel. "$29.99" sits on a yellow chip. The small lines read: "WITH TEXT SIGN-UP" / "RENEWS AT $49.99 EACH 4 WEEKS" / "CANCEL ANYTIME". Nothing moves while the terms are read. | $29.99 first order (18); small lines 17 / 29 / 14 | 4.8 s | All text live. Add the logo as a file, not generated. Terms are set word for word as approved. |

Total: 20.0 s. Each hold is at least the line's characters ÷ 15 + 0.5 s.

## 5. Notes
**Content choices**
- **Ingredient stack:** No ingredient names were given, so the "what's inside" stack shows the three approved counts rather than named ingredients.
- **Placebo bar:** The bar height is derived from the rounded "2.7x" (≈14.9%). It is drawn to scale but carries no number, because no placebo figure was supplied. Confirm the exact figure and redraw the bar if it differs.
- **Study wording:** The narration keeps to "vitamin C was up 40.1 percent". It doesn't say what was measured, because the brief doesn't say.
- **Frame:** The no-text zones are standard tall-feed areas, inferred because no platform was named. The colours and fonts come from the brand, so the look card is not marked "inferred".
- **Pace:** Narration runs at about 3 words per second. It is brisk but clear, and the offer shot needs the full 4.8 s.

**MISSING:**
- **Product photo:** The photo file itself was described as "on file" but not attached. The cutout can't be planned, and the label can't be checked for sharpness, until it is supplied.
- **Placebo figure:** The exact placebo % change from the 2025 study.
- **What the 40.1% measures:** For example blood vitamin C level, and from what baseline.
- **Study citation:** Who ran or funded it, and whether it was published, for the source line.
- **One pack:** What "one pack" is, for example a day's serving and how many gummies.
- **Renewal shipment:** What each 4-week renewal ships.
- **Shipping and guarantee:** Shipping cost and the guarantee terms. The store add-on asks for both at the close.
- **Text sign-up:** The sign-up keyword and number, if it should be shown or said.

## 6. Cast note
- **Product:** It needs one front-view cutout of the Sprout pouch with the label sharp. It is the same pouch this buyer has seen on the shelf, so recognising it does the reassuring before any number lands.
- **Voice:** A warm, plain-spoken adult voice. Matter-of-fact, a little brisk, never salesy. Like a friend reading you the label.
- **Never change:** The pouch's shape, gloss and yellow wordmark printing. Sunflower yellow's single job of marking the one thing each shot is about.

## 7. Score
**83 / 100** (5 of 6 checks passed: 5 ÷ 6 × 100 = 83)

- **Missed, "Every chart is drawn to scale from zero":** The placebo bar's height comes from the rounded 2.7x ratio, not a sourced placebo figure. It passes once the exact placebo % is supplied.
```
