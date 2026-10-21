# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A tight, buildable 20-second plan that uses only the approved numbers and offer terms, draws the chart honestly from the 2.7x ratio, and keeps the renewal price next to the first-order price. It correctly refuses to describe the unattached photo and lists real gaps (pack definition, sugar, placebo figure) as MISSING instead of guessing.

## Judge list

- Met: Every number on screen is on the fact sheet, with a source.
  Fact sheet lists 60+, 21, 6g, 2025/12 weeks/120 adults, +40.1%, 2.7x, $29.99/$49.99/4 weeks, each sourced to the brief's approved claims.
- Met: Each chart starts at zero and its bars match their numbers.
  "The Sprout bar is 600px tall and stands for +40.1%. The placebo bar is 600 ÷ 2.7 = 222px"; bars "grow from zero".
- Met: Every shot has one fact and one on-screen line of about 30 characters or fewer.
  Main lines run 8 to 22 characters, e.g. "21 vitamins & minerals (22)"; label and small lines are the allowed secondary type.
- Met: The look card names your real colours and fonts, with one highlight colour.
  Cream #FFF7DF background, deep forest/forest/kelly green shapes, "Highlight: sunflower yellow #FFCC2E"; Work Sans Bold/Medium, DM Mono.
- Met: The full price terms appear wherever the price does.
  Shot 8: "First order $29.99 / with text sign-up / RENEWS AT $49.99 EACH 4 WEEKS. · CANCEL ANYTIME."

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
Good fit. The buyer already knows Sprout from the shelf and doubts what's in it. Showing the contents and the study numbers answers that doubt directly.

## 2. Look card
- **Frame:** Tall, 1080×1920 (9:16). Side margins are 80px. The app covers three areas, so no words go in them: the top 250px, the bottom 420px and the right 140px (past x = 940). The pouch sits lower left, at about x 120–540 and y 860–1480. Headlines go in the upper band, at about y 280–760. The stack and the chart go in the right column, at about x 600–920 and y 860–1480.
- **Colour jobs:**
  - Background: cream #FFF7DF across the full frame.
  - Text and shapes: deep forest #002C17 for headlines and the chart baseline, forest green #00582D for labels and the small line.
  - Second shape colour: kelly green #007E40, used for earlier stack items and the placebo bar.
  - Highlight: sunflower yellow #FFCC2E, used only for the one thing each shot is about. It sits behind the number as a pill or forms the Sprout bar. Text on it is deep forest, never yellow text on cream.
- **Type:**
  - Main line: Work Sans Bold, about 96px.
  - Label: Work Sans Medium, about 44px.
  - Small line for sources and terms: DM Mono, uppercase, about 28px.
- **Product:** The real Sprout pouch photo, cut out to its exact outline. It keeps its gloss, its deep green and its yellow wordmark, with one soft shadow below. It is never redrawn or retyped. *(Cutout depends on the photo, see MISSING.)*
- **Motion:**
  - Way in, for the whole ad: rise 40px and fade in, ease out, 0.4s.
  - Way out, for the whole ad: fade out and rise 20px, ease in, 0.3s.
  - Numbers snap in with the same ease out.
  - Bars grow from the baseline, ease out, 0.5s.

## 3. Fact sheet
| Fact | Source |
|---|---|
| 60+ ingredients in 1 pack | Brand-approved claim (your brief) |
| 21 vitamins & minerals in 1 pack | Brand-approved claim |
| 6g fiber in 1 pack | Brand-approved claim |
| "Clinically tested for nutrient absorption" | Brand-approved claim |
| Study: 2025, 12 weeks, 120 adults | Brand-approved claim, study details |
| Vitamin C +40.1% | 2025 study, as approved |
| 2.7x placebo | 2025 study, as approved |
| First order $29.99 with text sign-up. Renews at $49.99 each 4 weeks. Cancel anytime. | Brand offer terms, kept together |

**Chart scale:** The Sprout bar is 600px tall and stands for +40.1%. The placebo bar is 600 ÷ 2.7 = 222px. Its height comes from the sourced ratio. No placebo number is shown.

## 4. Shot table
| # | Fact | Narration | Picture and move | On-screen text (characters) | Hold | Build note |
|---|---|---|---|---|---|---|
| 1 | One pack (the subject) | "Just sweets? Look inside one pack." | The pouch cutout arrives lower left and settles. The headline arrives above. | What's in one pack? (19) | 2.0s | Live text. The pouch is the real photo layer and stays on screen for the whole ad. |
| 2 | 60+ ingredients | "Sixty-plus ingredients." | The first stack item arrives in the right column. "60+" sits big on a yellow pill. Pouch holds. | 60+ ingredients (15) | 1.6s | Live text. Pill shape in code. |
| 3 | 21 vitamins & minerals | "Twenty-one vitamins and minerals." | The second item joins below. The yellow pill moves to "21". Item 1 turns to kelly green. | 21 vitamins & minerals (22) | 2.0s | Live text. Earlier item stays put. |
| 4 | 6g fiber | "And six grams of fiber." | The third item joins below. The yellow pill moves to "6g". The others turn to kelly green. | 6g fiber (8) | 1.4s | Live text. |
| 5 | Clinically tested | "Clinically tested for nutrient absorption." | The stack leaves (way out). The headline arrives with its label beneath. The source small line arrives at the bottom of the text band. Pouch holds. | Clinically tested (17) / label: for nutrient absorption (23) / small: 2025 STUDY, 12 WEEKS (20) · 120 ADULTS (10) | 2.4s | Live text. The small line stays through shot 7. |
| 6 | Vitamin C +40.1% | "Vitamin C: up forty point one percent." | A deep forest baseline is drawn in the right column. The yellow Sprout bar grows from zero to 600px. "+40.1%" counts up above it and holds. | Vitamin C: +40.1% (17) | 2.2s | Bar height is set in code (600px). The count-up ends on 40.1 exactly. |
| 7 | 2.7x placebo | "Two point seven times placebo." | The kelly green placebo bar grows from zero to 222px, left of the Sprout bar, on the same baseline. The Sprout bar holds. | 2.7x placebo (12) / bar labels: Placebo · Sprout | 2.0s | Bar height is 222px (600 ÷ 2.7). No placebo number. |
| 8 | Offer and full terms | "First order: twenty-nine ninety-nine with text sign-up. Renews at forty-nine ninety-nine each four weeks. Cancel anytime." | The chart leaves. The price, label and terms arrive together under the headline. After that, nothing moves. The pouch holds as the close. | First order $29.99 (18) / label: with text sign-up (17) / small: RENEWS AT $49.99 EACH 4 WEEKS. (30) · CANCEL ANYTIME. (15) | 6.4s | Live text. The terms are word-for-word as approved and stay on screen the whole shot. |

**Total:** 20.0s.

## 5. Notes
- **Inferred:** The layout positions and type sizes are my choices. The terms are set in uppercase DM Mono to match the brand's tag style, but the wording is unchanged.
- **Placebo bar:** Its height comes from "2.7x placebo." The placebo figure itself isn't in the brief, so no number is shown on that bar.
- **Terms line:** "RENEWS AT $49.99 EACH 4 WEEKS." carries two numbers. It is kept whole so the terms read exactly as approved.
- **Left out:** "Steps of use" and the guarantee. Neither was supplied.
- MISSING: the product photo itself. It's "on file" but not attached, so the cutout can't be planned or checked yet.
- MISSING: what "1 pack" is (number of gummies or servings, and whether it's a daily pack). The narration says "one pack" only.
- MISSING: what the +40.1% measured (for example, blood vitamin C levels against the starting point), and who ran or published the study.
- MISSING: the placebo result as a number.
- MISSING: sugar per pack. This is the buyer's main worry, and right now the ad answers it only indirectly, through the fiber and ingredient counts.
- MISSING: shipping and guarantee terms, if they should appear in the close.

## 6. Cast note
- **The avatar:** The Sprout pouch is the avatar. It needs one front-view cutout with a legible wordmark. It's the pack this buyer has already seen on the shelf, so recognising it does the trust-building.
- **Narrator:** Warm, plain-spoken and unhurried, like a friend reading the label to you. Confident, never salesy.
- **Never changes:** the pouch's outline, its gloss and green, its yellow wordmark and printing, and yellow's single job as the highlight for each shot's one fact.

## 7. Checks missed
- "The product is the real photo" is unconfirmed until the pouch photo is attached and the cutout is checked against it.

Next, would you like to check it before it goes live with the [Meta ads compliance checker](https://useaiblocks.com/skills/meta-ads-compliance-checker), tighten the voiceover with the [Ad script read-aloud editor](https://useaiblocks.com/skills/ad-script-read-aloud-editor), or turn it into image ads with the [Image ad remake planner](https://useaiblocks.com/skills/image-ad-remake-planner)? Or tell me something else.
```
