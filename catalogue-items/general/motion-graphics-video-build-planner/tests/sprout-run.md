# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

The run correctly refused to build because shot 6 shows the $29.99 price without the renewal terms, the exit timing breaks the motion rules and the shot table is missing columns, and it listed every gap as MISSING without inventing anything. Three of its six objections are stricter than the skill requires (the 2.7x ratio is exactly how the skill says to size a bar, the brand's own science page is the study source, and 'prebiotic' is on Sprout's label), so the owner can push back on those while fixing the real ones.

## Judge list

- Met: It stopped for your OK after the product card, the theme and the storyboard.
  Not reached: "Script check (stage 0): FAILED, build stopped". Stage 0 stop is mandated by the skill, no approval was skipped.
- Met: No word, number, chart or product is asked of a video model.
  Nothing was built or prompted; input said "Backgrounds: none" and the run requested no generation.
- Met: Every number on screen matches the fact sheet, with its source in the text table.
  No text table yet; stage 0 checked numbers: "The $29.99 and $49.99 figures and their terms are on the fact sheet."
- Met: Bars are drawn from their numbers, to scale from one zero line.
  Not reached; run asked for "placebo figure, both sourced, so the shot 5 bars can be drawn from numbers on one zero line."
- Met: Text holds still for its full hold time and sits inside the safe area, and the product cutout looks the same in every shot.
  Not reached; run did check margins: "The 96 px side margins (8.9%) are wider than the 6% minimum."

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
## 1. Script check (stage 0): FAILED, build stopped

The script goes back to the script skill. Nothing below has been fixed here.

| # | Shot | Check | Problem |
|---|---|---|---|
| 1 | 4 | Every on-screen number and claim is on the fact sheet | The on-screen text says "6 g prebiotic fiber." The fact sheet says "6g fiber = label." The word "prebiotic" has no source. |
| 2 | 5 | Every chart is to scale from zero, with both figures sourced | The fact sheet gives only a ratio, "2.7x placebo." It does not say what was measured or give a stated figure for the placebo bar. A two-bar comparison needs both figures on the fact sheet with sources. |
| 3 | 5 | Every fact has a source | "2025 study, 12 weeks, 120 adults" describes the study but does not identify it: no authors, title, journal or link. The claim can't be traced. |
| 4 | 6 | Full price terms sit wherever the price does | Shot 6 shows "$29.99 first order" without the renewal price or "cancel anytime." Those only appear in shot 7. The store rule requires the renewal price in the same shot as the first-order price. |
| 5 | All | Each shot has one fact and one moving thing | The shot table has no narration, picture-and-move or build-note columns. This check can't be run, and narration can't be timed to the holds. |
| 6 | All | Look card motion rules | "Drop out with ease in, 0.4 s" is longer than the 0.2 to 0.3 s allowed for exits. This needs confirming or correcting before the look card is locked in stage 3. |

These checks passed:
- Shots 2 and 3 match the label.
- The 96 px side margins (8.9%) are wider than the 6% minimum.
- The $29.99 and $49.99 figures and their terms are on the fact sheet.

The canvas will be set and the product card written (stage 1) once a corrected script passes this check.

## MISSING

- MISSING: a source for "prebiotic" on shot 4, or on-screen text that matches the label line "6g fiber."
- MISSING: the measured Vitamin C outcome and the placebo figure, both sourced, so the shot 5 bars can be drawn from numbers on one zero line.
- MISSING: an identifiable citation for the 2025 study (authors or title, and where it was published).
- MISSING: the renewal price and "cancel anytime" in shot 6, alongside "$29.99 first order."
- MISSING: the narration, picture-and-move and build-note columns for shots 1 to 7.
- MISSING: confirmation of the exit duration (0.2 to 0.3 s ease in).
- MISSING: Work Sans and DM Mono font files. If they aren't supplied, the fallback will be the Google Fonts releases of Work Sans and DM Mono, and this will be flagged in the build.
- MISSING: the full live offer terms text for the end card.
- MISSING (optional): the logo as a vector file.
```
