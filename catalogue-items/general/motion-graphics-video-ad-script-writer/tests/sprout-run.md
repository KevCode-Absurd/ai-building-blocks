# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A clean, buildable 20-second script that uses only the approved facts, scales the one chart honestly and keeps the renewal terms glued to the $29.99 price. Several MISSING items (study detail, serving, guarantee) are actually in the brand file, so the owner can fill them quickly, but nothing was guessed or overstated.

## Judge list

- Met: Every number on screen is on the fact sheet, with a source.
  60+, 21, 6g, 2025/12 weeks/120 adults, 40.1%, 2.7x, $29.99, $49.99 all listed with 'Brand approved claim' or 'Brand offer' sources.
- Met: Each chart starts at zero and its bars match their numbers.
  "Two bars on one forest-green baseline, both starting from zero... Sprout 40.1, placebo 14.85" (40.1 ÷ 2.7).
- Met: Every shot has one fact and one on-screen line of about 30 characters or fewer.
  Main lines run 8 to 29 characters; shot 8's 46-char line is the terms small line the skill allows.
- Met: The look card names your real colours and fonts, with one highlight colour.
  "Highlight: sunflower yellow #FFCC2E, used for the one thing each shot is about"; Work Sans Bold/Medium, DM Mono named.
- Met: The full price terms appear wherever the price does.
  Shot 8: "$29.99 first order", "With text sign-up", "RENEWS AT $49.99 EACH 4 WEEKS. CANCEL ANYTIME." said and shown.

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
**Fit:** A graphic ad suits this buyer. They already know Sprout and want specifics. "What's in one pack" plus a measured absorption result answers "it's just sweets" with numbers rather than a story.

**Look card**
- **Frame:** Tall 9:16 at 1080×1920. Side margins are 80 px. The top 250 px, bottom 420 px and right 140 px are app UI zones and hold no words. All text sits in the left-centre column, and the pouch sits centre-right.
- **Colour jobs:**
  - Background: cream #FFF7DF in every shot.
  - Shapes and text: deep forest #002C17 for text, and forest green #00582D for pills, the bar outline and the baseline.
  - Secondary: kelly green #007E40 for the placebo bar only.
  - Highlight: sunflower yellow #FFCC2E, used for the one thing each shot is about. It is used only as a fill behind deep-forest text, never as yellow text on cream.
- **Type:**
  - Main line: Work Sans Bold, about 96 px.
  - Label: Work Sans Medium, about 48 px.
  - Small line for sources and terms: DM Mono uppercase, about 28 px.
- **Product:** The real Sprout pouch photo, cut out. Its glossy deep green and yellow wordmark stay exactly as photographed. It has one soft shadow below and sits at the same size and position in every shot. It is never redrawn as an icon.
- **Motion:**
  - In: rise 60 px and fade in, ease out, 0.4 s.
  - Out: fade and rise 40 px, ease in, 0.3 s.
  - Count-ups take 0.5 s. Bars grow from zero in 0.5 s, ease out.

**Fact sheet**

| Fact | Source |
|---|---|
| 1 pack | Brand approved claim |
| 60+ ingredients (in 1 pack) | Brand approved claim |
| 21 vitamins & minerals (in 1 pack) | Brand approved claim |
| 6g fiber (in 1 pack) | Brand approved claim |
| "Clinically tested for nutrient absorption" | Brand approved claim, 2025 study |
| Study: 2025, 12 weeks, 120 adults | Brand, 2025 study |
| Vitamin C +40.1% | Brand, 2025 study |
| 2.7x placebo | Brand, 2025 study |
| Placebo bar height = 40.1 ÷ 2.7 ≈ 14.9% | Derived from the two study figures. Used only to scale the bar and never printed. |
| $29.99 first order with text sign-up. Renews at $49.99 each 4 weeks. Cancel anytime. | Brand offer, full terms kept together |

**Shot table**

| # | fact | narration | picture and move | on-screen text (characters) | hold | build note |
|---|---|---|---|---|---|---|
| 1 | 1 pack | "What's in one Sprout pack?" | Pouch cutout eases in centre-right and settles. The line arrives on a yellow pill. | "What's in one Sprout pack?" (26) | 2.2 s | Live text. The pouch is a photo layer with a fixed position from here to the end. |
| 2 | 60+ ingredients | "Over sixty ingredients," | First item of the stack beside the pouch. "60+" counts up and holds on a yellow pill. | "60+ ingredients" (15) | 1.5 s | Live text and a live counter. Only the new pill moves. |
| 3 | 21 vitamins & minerals | "twenty-one vitamins and minerals," | Second pill joins below the first. Yellow moves to the new pill, and the first turns forest green and holds. | "21 vitamins & minerals" (22) | 2.0 s | Live text. The stack keeps its earlier items. |
| 4 | 6g fiber | "and six grams of fiber." | Third pill joins the stack. Yellow moves to it, and the others hold. | "6g fiber" (8) | 1.3 s | Live text. "6g" is set exactly, with no space. |
| 5 | Clinically tested for nutrient absorption | "Clinically tested for nutrient absorption." | The stack leaves (ease in). The claim arrives on a yellow pill. The small line appears beneath it. | "Clinically tested: absorption" (29). Small: "2025 STUDY · 12 WEEKS · 120 ADULTS" | 2.5 s | Live text. The small line stays through shot 7. |
| 6 | Vitamin C +40.1% | "Vitamin C, up 40.1 percent." | Two bars on one forest-green baseline, both starting from zero. The Sprout bar (yellow, deep-forest outline) grows to 40.1. The placebo bar (kelly) grows to 1/2.7 of that height. The labels are "Sprout" and "Placebo", with no placebo number. | "Vitamin C +40.1%" (16) | 2.5 s | Draw the bars in code from the data: Sprout 40.1, placebo 14.85. No video model for the chart. The pouch holds. |
| 7 | 2.7x placebo | "That's 2.7 times placebo." | The bars hold still. A yellow bracket draws between the bar tops, and the "2.7x" label snaps in. | "2.7x placebo" (12) | 2.0 s | Live text. Only the bracket and label move. The source line stays on. |
| 8 | Price and full terms | "Get your first order for $29.99 when you sign up by text. Renews at $49.99 every four weeks. Cancel anytime." | The chart leaves. The pouch holds with the offer lines arriving once, then nothing moves. | "$29.99 first order" (18). Label: "With text sign-up" (17). Small: "RENEWS AT $49.99 EACH 4 WEEKS. CANCEL ANYTIME." (46) | 6.0 s | All live text. The price is never shown without the renewal line. The logo is set on top, not generated. |

Total: 20.0 s

**Notes**
- **Inferred:**
  - The safe-zone sizes, type sizes, motion timings and colour roles are inferred. The colours and fonts themselves are the brand's.
  - Yellow is kept as a fill rather than as text, for contrast on cream.
- **Derived and not printed:** The placebo bar height (≈14.9%) is calculated from +40.1% and 2.7x so the chart is to scale. No placebo figure appears on screen because none was supplied.
- **Not claimed:**
  - The product format (gummies) and anything about sugar are not claimed, because neither was in the approved facts.
  - "Not just sweets" is not said outright. The ad answers it through the facts instead.
- MISSING: study citation (who ran it, published or not, and what was measured, e.g. blood vitamin C levels) to strengthen the source line.
- MISSING: placebo result as its own figure.
- MISSING: what "1 pack" is (daily serving? count?) and serving directions. The steps-of-use shot was left out for this reason.
- MISSING: sugar per pack. This is the most direct answer to the "just sweets" worry, and it would be worth a shot if it is sourced.
- MISSING: shipping terms and guarantee, to confirm whether $29.99 includes shipping.
- MISSING: text sign-up mechanics (keyword or number) for the end card.
- MISSING: banned claims list.

**Cast note**
- **Product as the avatar:** The Sprout pouch is the avatar. Use the clean photo on file, cut out, front view only, with the label sharp enough to read. A shopper who has seen it on a shelf should recognise it instantly.
- **Voice:** The narrator is warm, clear and matter-of-fact, like a knowledgeable friend reading the label. Brisk, never hype.
- **Never changes:**
  - The pouch's shape, gloss, deep green and yellow wordmark are never redrawn or re-lettered.
  - Sunflower yellow does one job only: marking the single fact each shot is about.
```
