---
name: chart-review-and-fix
description: Reviews existing charts, infographics or results slides for problems that mislead, exclude or confuse readers (cut bar axes, dual axes, pie charts with too many slices, rainbow or red-green colours, colour-only meaning, low contrast, topic titles, missing source or alt text), ranks each problem by severity, explains the effect in plain words and gives the fixed version as a spec or exact edit list. Reads screenshots, files or chart code at access level 1; builds fixed copies at level 2; replaces live charts only at level 3 within the client's limits. Use it when someone asks "is this chart OK?", "why does nobody get this chart?" or before a report, deck or page goes out.
---

# Chart review and fix

## When to use

- A report, deck, web page or app has charts and is about to go out.
- Readers keep misreading a chart, or a board member asked "is that axis right?"
- A client inherited a set of charts and wants them made consistent and accessible.
- Someone suspects a chart oversells a result.

## What you need

1. The charts: screenshots, the file (Excel, Sheets, PowerPoint, Canva, Datawrapper, Flourish) or the chart code.
2. The data behind each chart, or at least the numbers shown.
3. What each chart is meant to say, if the client knows.
4. Where it appears and who reads it.
5. Any house style or accessibility rule it must meet (for example WCAG 2.2 AA).
6. Access: level 1 to read. Level 2 to build fixed copies in the client's tool or a pull request. Level 3 to replace the live charts, after the client confirms the list.

## Steps

### 1. Read the chart as a first-time reader

Before looking at the data, write down in one sentence what the chart seems to say, and how long that took. Then read the data. A gap between the two is the first finding.

### 2. Check honesty (severity: misleads)

- Bar or area axis that does not start at zero on a linear scale.
- Two y-axes with different units, where the lines' crossing or closeness suggests a link.
- Icons, bubbles or shapes scaled in both width and height by the value, so area overstates it.
- Cherry-picked periods: a start date chosen to show growth that a longer series would not.
- Uneven intervals on a time axis drawn as if even.
- Missing series or categories the reader would expect, with no note.
- Percentages that do not add up, or a base that changes between bars without saying so.
- Values on the chart that differ from the data.

### 3. Check access (severity: excludes)

- Colour is the only way to tell series or states apart (fails WCAG 1.4.1).
- Text below 4.5:1 contrast, or 3:1 for large text (fails 1.4.3).
- Lines, bars or slices needed to read the chart below 3:1 against neighbours or background, with no labels or values shown as text (fails 1.4.11).
- Red and green of similar lightness used for "bad" and "good".
- No alt text, or alt text that only names the chart type; no long description or table.
- Values available only on hover.
- A Chart.js canvas with no role, label or fallback text.

Measure each contrast pair with a checker and record the ratios. Look at the chart in greyscale and in a colour-vision simulator.

### 4. Check clarity (severity: confuses)

- Wrong chart for the comparison: clustered bars for a long time series, a pie with more than five parts or near-equal slices, a line joining unordered categories.
- Topic titles ("Revenue by region") instead of the finding.
- Legends that force colour matching where direct labels would fit.
- Unsorted bars where there is no natural order.
- Missing units, period, source or base size.
- More than four colours, or a rainbow or jet colour scale on continuous data.

### 5. Check clutter (severity: clutters)

- 3D, shadows, gradients, background images, heavy borders.
- Dark or dense gridlines; more than about ten.
- Too many decimal places; tick labels at angles.
- Data labels on every point when only one matters.

### 6. Rank and explain

List problems from most to least severe: misleads, excludes, confuses, clutters. For each, say in one sentence what a reader would wrongly believe or miss. Avoid design vocabulary in the explanation; show the effect.

### 7. Fix

For each chart, give the fixed version: a full Vega-Lite or Chart.js spec, or an exact edit list for the tool ("Format axis > Bounds > Minimum: 0"). Keep the client's message if the data supports it; if it does not, say what the data does support and title the fixed chart with that.

### 8. Apply (level 2 or 3)

At level 2, build fixed copies next to the originals and label them. At level 3, after the client confirms the list of charts to replace and where, swap them in, check each live chart against the data and log the changes. Charts embedded by others, or shared templates, need a separate yes before they are overwritten.

## Checks

- Every problem has a severity, an effect in plain words and a fix.
- Every contrast claim has a measured ratio.
- Fixed charts were re-checked against the data, in greyscale and in a colour-vision simulator.
- No fix changes a number; if a number was wrong, it is flagged for the data owner rather than corrected silently.
- Nothing was replaced live without level 3 and the client's yes on the list.

## Output format

1. One-line verdict per chart (ship, fix first, or rebuild).
2. Review table: chart, problem, severity, effect on the reader, fix.
3. Contrast table: pair, ratio, pass or fail.
4. Fixed specs or edit lists, chart by chart.
5. Questions for the data owner, if any number looked wrong.

## Example of good output (short)

*Illustrative structure, not a real business: a letting agency charting tenant satisfaction by branch. Copy the shape, never the content: every fact comes from the client's own context.*

> **Verdict:** fix before the board pack goes out.
>
> | Problem | Severity | What a reader would believe | Fix |
> |---|---|---|---|
> | Bar axis starts at 80% | Misleads | Kingsway (86%) looks three times better than Eastgate (82%); the gap is 4 points | Axis from 0, or a dot plot with the 4-point gap labelled |
> | Red bar for the lowest branch, green for the highest | Excludes | Red-green colour-blind readers cannot tell which is which | One blue for all bars, the lowest labelled in text |
> | Title "Satisfaction by branch" | Confuses | No takeaway | "All five branches score between 82% and 86%" |
> | Seven-colour legend | Confuses | Readers match colours to names | Direct labels on bars, sorted high to low |
>
> **Contrast:** #12436D bars on white 10.25:1, pass. Old green #2CA02C on white 3.40:1, pass for 1.4.11, but against the red #D62728 only 1.48:1.
>
> **Alt text for the fixed chart:** "Bar chart: tenant satisfaction ranges from 82% at Eastgate to 86% at Kingsway across five branches. Table below."
