---
name: accessible-chart-colour-and-text
description: Turns a client's brand colours into a chart palette that passes WCAG 2.2 AA (4.5:1 text, 3:1 for chart parts, colour never the only cue), checks it for colour-blind readers, greyscale and dark mode, and writes the text alternatives every chart needs (alt text with the finding, a long description or data table, and the ARIA set-up for Vega-Lite SVG and Chart.js canvas charts). Works from hex codes and chart files at access level 1; updates themes, templates or chart files as drafts at level 2; changes live shared themes only at level 3 with a fresh yes for anything others already use. Use it for a report or website chart style, an accessibility fix, or any chart going on a public page.
---

# Accessible chart colour and text

## When to use

- A client wants charts "in our brand colours" and the brand colours are pale or clash.
- A public website, council report or EU e-commerce page needs charts that meet WCAG 2.2 AA.
- An accessibility audit flagged charts.
- A report or app needs one chart palette and alt text pattern everyone can reuse.
- Charts must work in dark mode as well as light.

## What you need

1. Brand colours as hex codes, and the background colours used (white, off-white, dark mode).
2. The chart types in use and the most series any chart has.
3. Two or three sample charts, with their data.
4. The rule to meet, if one applies (for example WCAG 2.2 AA for a UK public sector site).
5. Access: level 1 to read files and colours. Level 2 to update a copy of the theme, template or chart code. Level 3 to change the live shared theme or template, after a yes on the list; anything others already use needs a fresh yes.

## Steps

### 1. Measure every brand colour

For each colour, compute the WCAG contrast ratio against every background it will sit on. The ratio is (L1 + 0.05) / (L2 + 0.05), with L1 the relative luminance of the lighter colour; use a contrast checker and record the figure to two decimals. Sort colours into:
- **Text-safe:** 4.5:1 or more (labels, annotations, axis text).
- **Mark-safe:** 3:1 or more (lines, bars, slices, points). The 3:1 is not rounded: 2.99:1 fails.
- **Fill-only:** below 3:1. Usable for large areas only when the shape is also outlined or labelled, or for decoration.

### 2. Build the palette

- **Highlight colour:** the strongest brand colour that is mark-safe; used for the series that carries the message.
- **Context colour:** a grey for everything else. A pale grey below 3:1 works only when the highlight is the point and the grey series are not needed to read the message; make the highlight line thicker.
- **Categories:** up to four mark-safe colours that differ in lightness as well as hue. If a brand colour fails, darken it (keep the hue, lower the lightness) until it passes, and note the new hex code.
- **Ordered values:** a single-hue sequential ramp, light to dark; for values either side of a midpoint, a diverging pair with a neutral centre. Only the darker steps will pass 3:1 on white, so pair the chart with values in text or a table.
- **Continuous scales:** viridis or cividis rather than a rainbow.
- With no usable brand colours, start from the UK Analysis Function palette (#12436D, #28A197, #801650, #F46A25).

### 3. Check neighbours, not just the background

WCAG 1.4.11 asks for 3:1 against adjacent colours. In stacked bars and pies, neighbouring segments rarely reach 3:1 with each other. Fixes: a white gap or border between segments (each segment then meets white), labels with values on each segment, or fewer segments.

### 4. Add a second cue

Colour may never be the only way to tell things apart (1.4.1). Use at least one of: direct labels, different markers, dash styles, patterns or textures, position (small multiples), or text values. Never let "red is bad, green is good" carry meaning on its own.

### 5. Test like a reader

- View each sample chart in greyscale: is the order and the highlight still clear?
- Run it through a colour-vision simulator for red-blindness and green-blindness separately.
- Check thin lines and small points closely; small coloured marks are harder to tell apart.
- Repeat on the dark background. Dark brand colours that pass on white usually fail on dark, so dark mode often needs its own palette.

### 6. Write the text alternatives

For each chart:
- **Alt text (one or two sentences):** chart type, what it shows and the main finding with its numbers. Not "Chart of sales".
- **Long description:** the key numbers in words, or the data table itself, visible to everyone on the page; on the web, place it in a `figure` with a `figcaption`, or link to it next to the chart. Do not put tables in `aria-describedby`, which reads them as one flat paragraph.
- **No hover-only meaning:** anything in tooltips also appears in labels or the table.

### 7. Wire it up in the tool

- **Vega-Lite (SVG):** marks get generated ARIA labels by default; set the `description` encoding channel for clearer ones, and turn off `aria` for purely decorative marks. Page alt text and the long description are still needed.
- **Chart.js (canvas):** `<canvas role="img" aria-label="...">` with real fallback text inside the canvas tags.
- **Excel and PowerPoint:** type the alt text in the Alt Text pane; mark decorative shapes as decorative.
- **Datawrapper, Flourish, Canva:** fill in the tool's alt text or description field where it has one, and put the long description in the page or document body.

### 8. Write the palette sheet and apply it

One page: each colour with hex code, role, contrast ratios on each background, which chart types it may be used in, and the alt text pattern. At level 2, update a copy of the theme or template. At level 3, after the client's yes, apply it to the live theme, then spot-check five charts.

## Checks

- Every colour has measured ratios on every background it uses.
- Every mark needed to read a chart is 3:1 or has a label or value in text.
- All text is 4.5:1, or 3:1 if at least 18 point or 14 point bold.
- Each chart has a second cue besides colour.
- Greyscale, colour-vision simulation and dark mode were checked and noted.
- Each chart has alt text with the finding and a long description or table.
- Shared themes others already use were changed only with a fresh yes.

## Output format

1. Palette table: colour, hex, role, ratio on each background, pass or fail, allowed uses.
2. Changes to brand colours (old hex, new hex, why).
3. Rules for segments, highlights and dark mode.
4. Alt text and long description pattern, with one worked example.
5. Tool set-up notes (Vega-Lite, Chart.js, Office, chart tool).

## Example of good output (short)

*Made-up business for illustration: "Saltmarsh Cycles", brand green #3FB27F, navy #1D2B53, coral #FF7A59, charts on white and on a #121212 dark mode.*

> | Colour | Hex | On white | On #121212 | Role |
> |---|---|---|---|---|
> | Navy | #1D2B53 | 13.79:1 | 1.36:1 | Light mode highlight series and text |
> | Brand green | #3FB27F | 2.66:1 (fails) | 7.03:1 | Dark mode highlight only |
> | Green, darkened | #1E8A5E | 4.33:1 | 4.33:1 | Second series in both modes |
> | Coral | #FF7A59 | 2.57:1 (fails) | 7.30:1 | Dark mode annotations only |
>
> **Rule:** on white, navy and darkened green, with white 1 px gaps between stacked segments and direct labels; brand green and coral never share a chart (1.04:1 against each other).
>
> **Alt text pattern:** "[Chart type]: [what changed or ranks first], from [value] to [value], [period]. Table below."
