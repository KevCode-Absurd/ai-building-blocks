# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run correctly refused to build from a script that puts the $29.99 price in a different shot from the $49.99 renewal and lacks narration, moves and build notes, and it listed every problem with no invented facts. The owner gets a precise send-back list and clear MISSING lines, though the 6g versus 6 g nitpick is more pedantic than useful.

## Judge list

- Met: It stopped for your OK after the product card, the theme and the storyboard.
  "Script check (stage 0): FAILED, build stopped" — it halted at stage 0 as the skill requires, advancing past no approval gate.
- Met: No word, number, chart or product is asked of a video model.
  "can't render frames or clips. That doesn't block a code build with no backgrounds." No video-model prompts written.
- Met: Every number on screen matches the fact sheet, with its source in the text table.
  No text built; it checked each number against the fact sheet and flagged "'Prebiotic' isn't on it" and the 6g/6 g mismatch.
- Met: Bars are drawn from their numbers, to scale from one zero line.
  No bars built; it flagged "the bar measure is undefined" and asked for both values so bars can be drawn from a shared zero line.
- Met: Text holds still for its full hold time and sits inside the safe area, and the product cutout looks the same in every shot.
  Nothing built yet; it checked "96 px (8.9%) sit inside the 6% safe edge" and asked for the cutout file.

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
No video or image tool is connected here, so I'll write the build plan and prompts but can't render frames or clips. That doesn't block a code build with no backgrounds.

## 1. Script check (stage 0): FAILED, build stopped

The script must go back to the motion graphics script skill before stage 1 can start. I haven't fixed anything here.

**Failures:**

1. **Shot 6: price shown without its full terms.** "$29.99 first order" appears without "renews at $49.99 every 4 weeks, cancel anytime". The full price terms must sit wherever the price does, and the store rule puts the renewal price in the same shot as the first-order price. Shot 6 needs the renewal line, or shots 6 and 7 need to merge.
2. **Shot 4: a word on screen isn't on the fact sheet.** The fact sheet says "6g fiber = label". "Prebiotic" isn't on it. The script needs to either add "prebiotic" to the fact sheet with the label as its source or drop the word. The number also needs one written form ("6g" on the sheet, "6 g" on screen) so the text layer matches the label exactly.
3. **The shot table is incomplete.** Every shot is missing four columns: narration, picture and move, on-screen text split into lines, and build note. Without them I can't confirm that each shot has one fact and one moving thing, that narration ends inside its shot, or what the shot 1 picture is.
4. **Shot 5: the bar measure is undefined.** "Vitamin C 2.7x placebo" doesn't say what was measured (for example, the rise in blood level). The script must name the measure so the chart labels and both bar values can be drawn to scale from a shared zero line. The study source also needs a name or citation beyond "2025 study, 12 weeks, 120 adults".
5. **The timing doesn't add up.** The hold times total 17.2 s against a 20 s runtime. The script should say whether the remaining 2.8 s is transitions or an end card. The end card with the full offer isn't specified.
6. **Exit timing conflicts with the motion rules.** The look card sets exits at 0.4 s with ease in, but the build rule is 0.2 to 0.3 s. The script should confirm 0.3 s exits or accept the conflict.

**Passed:**
- 60+ ingredients and 21 vitamins & minerals are on the fact sheet, sourced to the label.
- The colour jobs give one highlight per shot.
- The side margins of 96 px (8.9%) sit inside the 6% safe edge.

## MISSING

- `MISSING: product cutout file`. No image came through with the message, so please attach the pouch front with the background removed.
- `MISSING: font files (Work Sans Bold, Work Sans Medium, DM Mono)`. The fallback is the Google Fonts releases of the same families, flagged until the brand files are supplied.
- `MISSING: logo as a vector file` (optional, for the end card).
- `MISSING: full shot table columns (narration, picture and move, build note)`. This goes back to the script skill.

Once the revised script and the cutout file arrive, I'll set the canvas (1080 × 1920, 30 fps, safe area) and write the product card for approval 1.
```
