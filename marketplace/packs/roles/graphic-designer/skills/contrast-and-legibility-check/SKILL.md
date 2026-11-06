---
name: contrast-and-legibility-check
description: Checks a design, palette or brand kit for colour contrast, colour-only meaning, type size for the reading distance, line length and safe areas, then gives exact fixes. Uses WCAG 2.2 contrast ratios (4.5:1 normal text, 3:1 large text and graphics) as the yardstick for screens and as a guide for print and signs, flags red-green and colour-only cues, and checks signs against the US ADA sign rules where they apply. Use before any piece is printed or posted, when a brand palette is being chosen, or when readers say they cannot read something.
---

# Contrast and legibility check

People skip what they cannot read. This check finds the text that is too faint, too small, too long or hidden behind the app's buttons, and gives a fix for each one. It works on a finished design, a draft, a palette or a brand kit.

## When to use

- Before any flyer, poster, menu, sign or social graphic is printed or posted.
- When choosing or reviewing brand colours.
- When customers say a menu, sign or post is hard to read.
- When a client's online shop must meet accessibility rules (for example under the European Accessibility Act, which applies from 28 June 2025 to e-commerce among other services); this check covers the graphics, not the whole site, and is not a legal assessment.

## What you need

- The design (a share link, an exported PDF or PNG, or screenshots), or the palette as hex values.
- Where it is seen, from how far, and in what light (shop window, dim bar, phone outdoors).
- The fonts and sizes used.
- **Access I have.** This check needs level 1 only: reading the design or files. Applying fixes inside the tool needs level 2 (in a draft copy) or level 3 (on the shared design, within the client's limits).

## Steps

1. **List every text and background pair.** Include buttons, labels, prices, small print, text over photos and the logo. For text over a photo, sample the busiest and lightest areas behind the words.
2. **Measure each pair** with a contrast checker (such as WebAIM's) and record the exact ratio. Do not round: 4.49:1 fails 4.5:1.
3. **Apply the thresholds (WCAG 2.2):**
   - Normal text: at least 4.5:1 (level AA); 7:1 for AAA.
   - Large text (at least 18 pt, or 14 pt bold): at least 3:1 (AA); 4.5:1 for AAA.
   - Icons, chart lines, form fields and other graphics needed to understand the content: at least 3:1 against what is next to them.
   - Exempt: logos and brand names in a logo, purely decorative items, and photos where colour is the content. Brand guidelines do not exempt other text.
   For print and signs, use the same numbers as a guide and confirm with a full-size proof in the real light.
4. **Check colour-only meaning.** Anything shown only by colour (red for spicy, green for vegan, a chart split by red and green lines) needs a second cue: a symbol, a label, a pattern or a position. About 1 in 12 men have a colour vision deficiency, most often red-green.
5. **Check type size for the distance.** Handheld print: body text in the 10 to 12 point range is a common guide; for readers with sight loss, the UK government treats 16 point and above as large print. Posters and signs: print one line at full size and read it from the real distance. For regulated US signs, check visual character heights against the ADA table (5/8 inch minimum at 40 to 70 inches high when read from under 6 feet, plus 1/8 inch per foot beyond that), light-on-dark or dark-on-light characters, a non-glare finish, and no italic, script or decorative letters.
6. **Check line length and spacing.** Body lines of about 45 to 90 characters; 50 to 65 for large print; line spacing around 120 to 145% of the type size.
7. **Check safe areas.** Print: nothing important in the printer's trim zone. Social: words and logo clear of the app's controls (for Stories ads, Meta asks for about 14% top, 35% bottom and 6% at each side to be kept clear).
8. **Write a fix for each failure.** Give the exact change: a darker hex value that passes, a larger size, a solid panel behind the text, a symbol added to the key. Re-measure the fix and record the new ratio.
9. **Rank the fixes.** First, anything that stops someone reading safety, price, allergen or direction information. Then the main message. Then the rest.
10. **Apply fixes only at the right level.** Level 1: hand over the fix list. Level 2: apply fixes in a draft copy and say where it is. Level 3: apply them to the shared design within the client's limits, after confirming the list, and log each change.

## Checks

- Every pair measured, with the exact ratio recorded.
- Thresholds applied correctly for normal text, large text and graphics.
- Exemptions used only for logos, decoration and photos.
- No information carried by colour alone.
- Type sizes checked for the real distance, with a full-size proof for print.
- Each fix re-measured.
- Signs that carry legal duties referred to the venue or a qualified installer.

## Output format

1. **Summary:** pass or fix, with the number of failures by severity.
2. **Contrast table:** element, foreground hex, background hex, ratio, size, required ratio, pass or fail, fix, new ratio.
3. **Colour-only cues found,** each with a fix.
4. **Size, line length and safe-area findings,** each with a fix.
5. **Fixes in priority order.**
6. **Access and log:** the level used and any changes made.

## Example of good output (short)

*Copper Kettle Tearoom is a made-up business used only to show the format: a table menu, read at arm's length in warm, dim light. Access I have: level 1 (exported PDF).*

**Summary:** fix needed. Three failures: one that affects allergen information, two in the main menu.

| Element | Text | Background | Ratio | Needs | Result | Fix |
|---|---|---|---|---|---|---|
| Allergen note | #9E9E9E light grey | #FFF8E7 cream | 2.53:1 | 4.5:1 | Fail | Use the dark brown #4A2C1A (11.90:1) |
| Dish names | #4A2C1A dark brown | #FFF8E7 cream | 11.90:1 | 4.5:1 | Pass | None |
| Vegan marker | Green dot only | Cream | n/a | Second cue | Fail | Add "VG" beside the dot and to the key |
| Prices | #C8663B terracotta | #FFF8E7 cream | 3.66:1 | 4.5:1 | Fail | Darken to #9A4A26 (5.87:1) |

**Size:** body text is in the usual handheld range; the allergen note is smaller than the body text and should match it.

**Priority:** 1) allergen note, 2) vegan marker, 3) prices.
