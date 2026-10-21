# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, buildable plan: every number traces to the fact sheet, the bars are to scale, frame maths add up, and the renewal price now sits with the $29.99 as the store rule demands. The owner gets a ready Remotion theme and scene list, with honest MISSING lines for the unseen cutout, fonts and narration rather than guesses.

## Judge list

- Met: Stopped for approval after product card, theme and storyboard, or marked (approve) when asked to run in one go
  User said "Go ahead with what I've given you"; run marks "Product card (stage 1) (approve)", "(stage 3) (approve)", "Storyboard (stage 4) (approve)".
- Met: No word, number, chart or product asked of a video model
  "Background prompts: none." and "<Product/> renders the cutout untouched"; bars computed in code.
- Met: Every on-screen number matches the fact sheet with its source in the text table
  Text table sources every line (Label, 2025 study, Offer terms); "prebiotic" flagged `MISSING` rather than asserted.
- Met: Bars drawn from their numbers, to scale from one zero line
  "Placebo bar ... 1 × 160 = 160 px", "Vitamin C bar ... 2.7 × 160 = 432 px", both grown from zero line at y 1180.
- Met: Text holds for full hold time, inside safe area, product cutout same in every shot
  Holds 54/45/60/54/126/84/93 f match script seconds; "All words fall inside x 96–984 and y 269–1248"; product fixed at 540/1200/520 px.

## What went in

```text
Script (from "Make your numbers and offer clear in a graphic ad",
20 s, 9:16):
LOOK CARD  Frame: 9:16, 96 px side margins at 1080 wide. Colour
jobs: cream #FFF7DF background; forest #00582D and deep forest
#002C17 for shapes and text; sunflower #FFCC2E highlight, one thing
per shot. Type: Work Sans bold 96 px, Work Sans medium 48 px, DM
Mono 28 px uppercase. Motion: rise in with ease out, drop out with
ease in, 0.4 s each.
FACT SHEET  60+ ingredients, 21 vitamins & minerals, 6g fiber =
label. Vitamin C 2.7x placebo = 2025 study, 12 weeks, 120 adults.
$29.99 first order with text sign-up; renews at $49.99 every 4
weeks, cancel anytime = offer terms.
SHOTS  1 "What's in one pack?" 1.8 s | 2 "60+ ingredients" 1.5 s |
3 "21 vitamins & minerals" 2.0 s | 4 "6 g prebiotic fiber" 1.8 s |
5 bars, "Vitamin C: 2.7x placebo" + "2025 study, 12 weeks, 120
adults" 4.2 s | 6 "$29.99 first order" + "with text sign-up" 2.8 s
| 7 "Then $49.99 every 4 weeks" + "Cancel anytime" 3.1 s
Cast note: the pouch carries it; clear, friendly narrator.
Cutout attached (front). Route: code. Backgrounds: none.
```

## What came out

```text
## 1. Script check, canvas and product card

**Script check (stage 0)**

| Check | Result |
|---|---|
| Every on-screen number has a source | Pass. 60+, 21 and 6 g come from the label. 2.7x, 2025, 12 weeks and 120 adults come from the study. $29.99, $49.99 and 4 weeks come from the offer terms. |
| Label words match | **Flag.** Shot 4 says "6 g prebiotic fiber", but the fact sheet says "6g fiber". "Prebiotic" is not on the fact sheet. Shot text is kept as written. `MISSING: confirm the label says "prebiotic"`. If it doesn't, the line becomes "6 g fiber". |
| Chart to scale from zero | Pass as planned. Bars grow from one shared zero line, and the Vitamin C bar is 2.7 × the placebo bar. `MISSING: what the study measured`. Bars are relative, with placebo = 1. |
| Full price terms wherever the price is | **Fail, fixed here.** Shot 6 shows $29.99 without the renewal price, and the store rule wants both in one shot. Added a small line to shot 6: "Renews at $49.99 every 4 weeks · Cancel anytime". Added a small line to shot 7 (the end card): "$29.99 first order with text sign-up". Both use only offer-terms words. **(approve)** |
| One fact, one moving thing per shot | Pass. |
| Narration | `MISSING: narration lines`. The script has no narration column. Proposed: each shot reads its own on-screen words (stage 4), with no new facts. **(approve)** |
| Length | Hold times total 17.2 s. Holds plus moves come to **21.6 s**, which is 1.6 s over the 20 s target (see edit list). |

**Canvas**
- Size and rate: 1080 × 1920, 30 fps, 648 frames.
- Background: flat cream #FFF7DF.
- Safe area for words: x 96–984. The look card's 96 px margin is stricter than the 6% (65 px) minimum.
- Vertical safe area: y 269–1248, keeping the top 14% (269 px) and the bottom 35% (672 px) clear.

**Product card (stage 1) (approve)**
- **Avatar:** the pouch, front cutout `pouch-front.png`, in shots 1–4, 6 and 7. It is not in shot 5, so the chart has the room. It returns to the same place in shot 6. Side and top views are not needed.
- **Place when anchoring:** centred at x 540, bottom edge at y 1200, height 520 px, width by its own aspect. `MISSING: cutout pixel size`.
- **One soft shadow:** an ellipse under the base, #002C17 at 18% opacity, 40 px blur, 24 px down.
- **Narrator:** clear and friendly. Mid-range voice, even pace, warm but not salesy, plain US English. The voice is designed from this description and never cloned.
- **Never changes:**
  - The pouch's shape, colours and printing. It is the supplied cutout and is never redrawn.
  - Sunflower #FFCC2E only ever marks one thing per shot.
  - No people, no hands and no filmed scenes.
- `MISSING: product cutout`. The file is not visible in this chat. Until it is attached, the product layer is a labelled empty layer, and the label check (stage 3) is pending.

## 2. Test frames for the cutout (stage 2)

Render these as stills of the cutout on cream, with nothing redrawn. Use `npx remotion still --frame=40`. **(pick: A by default)**

| Frame | Height | Shadow | Crop |
|---|---|---|---|
| A | 520 px | 18%, blur 40, y +24 | full pouch |
| B | 520 px | 28%, blur 24, y +12 (tighter, firmer) | full pouch |
| C | 600 px, bottom at y 1200 | 18%, blur 40, y +24 | full pouch |
| D | 520 px | none | full pouch |

## 3. Product sheet, look card and lock lines (stage 3) (approve)

**Product sheet**
- **Front cutout:** `pouch-front.png`. `MISSING: file`.
- **Label lines to check word for word against the photo:**
  - "60+ ingredients"
  - "21 vitamins & minerals"
  - "6g fiber" or "6 g prebiotic fiber"
- **Status:** pending until the file is visible.

**Look card as set sheet**
- **Colour jobs:**
  - Background: cream #FFF7DF.
  - Main text and zero line: deep forest #002C17.
  - Second lines, small lines and placebo bar: forest #00582D.
  - Highlight: sunflower #FFCC2E, one thing per shot. It is used as a marker block behind deep forest text, because sunflower text on cream is too faint.
- **Type:**
  - Main line: Work Sans Bold 96 / 104.
  - Label: Work Sans Medium 48 / 58.
  - Small line: DM Mono 28 / 36, uppercase, +1 px tracking. Regular weight is assumed.
  - `MISSING: font files`. Fallback: the same families loaded from Google Fonts via `@remotion/google-fonts`. Flagged.
- **Motion:**
  - Entrances rise 40 px into place with a fade, 0.4 s (12 f), ease out.
  - Exits drop 40 px with a fade, 0.2 s (6 f), ease in. The look card's 0.4 s exit is outside this planner's 0.2–0.3 s rule, so 0.2 s is used. **(approve)**
  - Nothing moves at an even linear speed, and text is fully still while it is read.

**Lock lines: `src/theme.ts`**
```ts
import {Easing, staticFile} from 'remotion';
export const theme = {
  canvas: {width: 1080, height: 1920, fps: 30},
  safe: {top: 269, bottom: 1248, left: 96, right: 984},
  color: {cream: '#FFF7DF', forest: '#00582D', deep: '#002C17', sun: '#FFCC2E'},
  type: {
    main:  {fontFamily: 'Work Sans', fontWeight: 700, fontSize: 96, lineHeight: '104px'},
    label: {fontFamily: 'Work Sans', fontWeight: 500, fontSize: 48, lineHeight: '58px'},
    small: {fontFamily: 'DM Mono', fontWeight: 400, fontSize: 28, lineHeight: '36px',
            textTransform: 'uppercase', letterSpacing: 1},
  },
  layout: {mainTop: 300, labelTop: 532, smallTop: 614, sourceTop: 532},
  marker: {padX: 16, padY: 8, color: '#FFCC2E'},
  motion: {
    inFrames: 12, outFrames: 6, risePx: 40,
    easeOut: Easing.bezier(0.33, 1, 0.68, 1),
    easeIn:  Easing.bezier(0.32, 0, 0.67, 0),
  },
  product: {src: staticFile('pouch-front.png'), centerX: 540, bottom: 1200, height: 520,
            shadow: {color: '#002C17', opacity: 0.18, blur: 40, offsetY: 24}},
  chart: {zeroY: 1180, zeroStroke: 4, barWidth: 260, placeboX: 220, vitcX: 600,
          placeboValue: 1, vitcValue: 2.7, unitPx: 160}, // height = value × unitPx
};
```

## 4. Storyboard (stage 4) (approve)

- **Style frames:** one still per shot, rendered at the listed hold frame.
- **Shared layers:**
  - Background: flat cream, no video.
  - Text group: left-aligned at x 96, top y 300. Line breaks only; the words are not changed.
  - "Group" means every text line in a shot moves as one thing, along with its marker.
  - The small line is static for the whole shot and cuts on with the shot. It never moves.

**Shot 1 · f0–71 (0.00–2.40 s) · style frame f40**
- **Layers, back to front:**
  - Cream.
  - Product: static from f0 at its anchor place, so the first frame works as a thumbnail.
  - Main text, deep forest: "What's in / one pack?". Sunflower marker behind "one pack?".
- **Moves:**
  - Group y +40→0, opacity 0→1, f0–11, ease out.
  - Hold f12–65 (54 f = 1.8 s).
  - Drop out f66–71, ease in.
- **Narration:** "What's in one pack?"

**Shot 2 · f72–134 (2.40–4.50 s) · style frame f110**
- **Layers:**
  - Cream.
  - Product: same place, static.
  - Main text "60+ / ingredients". Marker behind "60+".
- **Moves:** in f72–83, hold f84–128 (45 f), out f129–134.
- **Narration:** "Sixty-plus ingredients."

**Shot 3 · f135–212 (4.50–7.10 s) · style frame f180**
- **Layers:**
  - Cream.
  - Product: static.
  - Main text "21 vitamins / & minerals". Marker behind "21".
- **Moves:** in f135–146, hold f147–206 (60 f), out f207–212.
- **Narration:** "Twenty-one vitamins and minerals."

**Shot 4 · f213–284 (7.10–9.50 s) · style frame f250**
- **Layers:**
  - Cream.
  - Product: static.
  - Main text "6 g prebiotic / fiber". Marker behind "6 g". `MISSING: "prebiotic" label check`.
- **Moves:** in f213–224, hold f225–278 (54 f), out f279–284.
- **Narration:** "Six grams of prebiotic fiber."

**Shot 5 · f285–440 (9.50–14.70 s) · style frame f380**
- **Layers:**
  - Cream. No product.
  - Zero line: deep forest, 4 px, x 220–860 at y 1180, static.
  - Placebo bar: forest, x 220–480, final height 1 × 160 = **160 px** (top y 1020).
  - Vitamin C bar: sunflower with a 3 px deep forest outline, x 600–860, final height 2.7 × 160 = **432 px** (top y 748). This bar is the shot's one highlight.
  - Bar labels, DM Mono, forest, centred under each bar at y 1200: "Placebo" and "Vitamin C". These are added and not in the shot table. **(approve)**
  - Main text "Vitamin C: / 2.7x placebo", deep forest, no marker.
  - Small line at y 532: "2025 study, 12 weeks, 120 adults", static for the whole shot.
- **Moves:**
  - Both bars grow from height 0 to final height off the zero line, f285–296, ease out. This counts as one move.
  - Main text rises f297–308.
  - Hold f309–434 (126 f = 4.2 s).
  - Group drops out f435–440: bars, labels and text together.
- **Narration:** "Vitamin C: two point seven times placebo."

**Shot 6 · f441–542 (14.70–18.10 s) · style frame f500**
- **Layers:**
  - Cream.
  - Product: back at the same place, static.
  - Main text "$29.99 / first order". Marker behind "$29.99".
  - Label, forest Medium 48: "with text sign-up".
  - Small line at y 614: "Renews at $49.99 every 4 weeks · Cancel anytime" (790 px wide, fits). Added. **(approve)**
- **Moves:** group in f441–452, hold f453–536 (84 f = 2.8 s), out f537–542.
- **Narration:** "Twenty-nine ninety-nine for your first order, with text sign-up."

**Shot 7 · f543–647 (18.10–21.60 s), end card · style frame f600**
- **Layers:**
  - Cream.
  - Product: static.
  - Main text "Then $49.99 / every 4 weeks". Marker behind "$49.99".
  - Label: "Cancel anytime".
  - Small line at y 614: "$29.99 first order with text sign-up". Added. **(approve)**
- **Moves:** group in f543–554, then hold f555–647 (93 f = 3.1 s) to the end, with no exit.
- **Narration:** "Then forty-nine ninety-nine every four weeks. Cancel anytime."

**Continuity check**
- The product never moves. It is in the same place in shots 1–4, 6 and 7, and leaves and returns on cuts.
- Each shot has one highlight.
- All words fall inside x 96–984 and y 269–1248. The lowest words are the bar labels, ending at y 1228.
- Each proposed narration line fits inside its shot at a normal pace. The longest is shot 6, about 3.0 s inside 3.4 s.

## 5. Build (stage 5)

**Render note:** I can't render stills or video in this chat. Run the build in Claude Code with Remotion and render with `npx remotion render`.

**Remotion scene list** (`src/Ad.tsx`, one `<Sequence>` per shot, all reading `theme.ts`)

| Scene | from | durationInFrames | Components |
|---|---|---|---|
| Shot1 | 0 | 72 | `<Bg/>` `<Product/>` `<TextGroup lines={["What's in","one pack?"]} marker="one pack?" in={0} out={66}/>` |
| Shot2 | 72 | 63 | `<Bg/>` `<Product/>` `<TextGroup lines={["60+","ingredients"]} marker="60+" in={0} out={57}/>` |
| Shot3 | 135 | 78 | `<Bg/>` `<Product/>` `<TextGroup lines={["21 vitamins","& minerals"]} marker="21" in={0} out={72}/>` |
| Shot4 | 213 | 72 | `<Bg/>` `<Product/>` `<TextGroup lines={["6 g prebiotic","fiber"]} marker="6 g" in={0} out={66}/>` |
| Shot5 | 285 | 156 | `<Bg/>` `<BarChart values={[1, 2.7]} labels={["Placebo","Vitamin C"]} highlight={1} grow={0} out={150}/>` `<TextGroup lines={["Vitamin C:","2.7x placebo"]} in={12} out={150}/>` `<SmallLine top={532} text="2025 study, 12 weeks, 120 adults"/>` |
| Shot6 | 441 | 102 | `<Bg/>` `<Product/>` `<TextGroup lines={["$29.99","first order"]} label="with text sign-up" marker="$29.99" in={0} out={96}/>` `<SmallLine top={614} text="Renews at $49.99 every 4 weeks · Cancel anytime"/>` |
| Shot7 | 543 | 105 | `<Bg/>` `<Product/>` `<TextGroup lines={["Then $49.99","every 4 weeks"]} label="Cancel anytime" marker="$49.99" in={0} out={null}/>` `<SmallLine top={614} text="$29.99 first order with text sign-up"/>` |

**Build rules**
- All words are typed strings, never images.
- Uppercase comes from `textTransform`, so the strings stay exactly as written.
- Bar height is computed as `value × theme.chart.unitPx`, grown with `interpolate(frame, [0, 12], [0, height], {easing: easeOut})` from `zeroY`.
- `<Product/>` renders the cutout untouched, with only position, size and shadow applied. Until the file is attached, it shows a labelled box: `MISSING: product cutout`.

**Background prompts:** none.

## 6. Edit list

- **Voice:** record the seven proposed narration lines first. Place each at its shot's start frame plus about 6 f. `MISSING: narration approval and voice recording`.
- **Music:** light, bright bed under the voice, about −18 dB below narration. `MISSING: music track`.
- **End card:** shot 7 carries the full offer.
  - `MISSING: logo vector`. The pouch stands in.
  - `MISSING: sign-up instruction`, meaning what to text and to where. It is not added because it is not in the terms.
  - `MISSING: confirm offer terms are current on render day`.
- **Preview:** render at half scale, check it, then render the final.
- **Length:** 21.6 s against a 20 s target. To hit 20 s, the script would need shorter holds. Holds are not cut here.

**Text layer table**

| Shot | Exact text | Start–end (s) | Source |
|---|---|---|---|
| 1 | What's in one pack? | 0.00–2.40 | — (no figure) |
| 2 | 60+ ingredients | 2.40–4.50 | Label |
| 3 | 21 vitamins & minerals | 4.50–7.10 | Label |
| 4 | 6 g prebiotic fiber | 7.10–9.50 | Label ("6g fiber"); `MISSING: "prebiotic"` |
| 5 | Vitamin C: 2.7x placebo | 9.90–14.70 | 2025 study |
| 5 | 2025 study, 12 weeks, 120 adults | 9.50–14.70 | 2025 study |
| 5 | Placebo / Vitamin C (bar labels, added) | 9.50–14.70 | 2025 study |
| 6 | $29.99 first order | 14.70–18.10 | Offer terms |
| 6 | with text sign-up | 14.70–18.10 | Offer terms |
| 6 | Renews at $49.99 every 4 weeks · Cancel anytime (added) | 14.70–18.10 | Offer terms |
| 7 | Then $49.99 every 4 weeks | 18.10–21.60 | Offer terms |
| 7 | Cancel anytime | 18.10–21.60 | Offer terms |
| 7 | $29.99 first order with text sign-up (added) | 18.10–21.60 | Offer terms |

**MISSING**
- `MISSING: product cutout file` (not visible in this chat) and its pixel size
- `MISSING: label check, "prebiotic"`
- `MISSING: what the Vitamin C study measured`, and who ran it
- `MISSING: font files` (Google Fonts fallback in use)
- `MISSING: logo vector`
- `MISSING: narration approval, voice recording, music`
- `MISSING: sign-up instruction`, and confirmation the offer terms are current

## 7. Checks missed

- **Text layers match the shot table exactly:** four added layers are not in the original table: the two bar labels and the offer small lines in shots 6 and 7. Approve them into the table to close this.
- **Product cutout unchanged in every shot:** this can't be verified yet because the cutout file isn't visible in this chat. The layer is a labelled placeholder until it's attached.
```
