---
name: chart-pick-and-spec
description: Picks the right chart for each message in a client's numbers and writes it in full as a runnable Vega-Lite 6 spec, a Chart.js 4 config or numbered Excel and Google Sheets steps, with a headline title that states the finding, honest axes, an accessible palette with contrast ratios, alt text, a long description and a source line. Works from pasted summary tables at access level 1; drafts unpublished charts or a pull request at level 2; publishes or updates live charts only at level 3 within the client's limits. Use it when someone says "make a chart of this", "which chart should I use", or needs charts for a report, web page, app or deck.
---

# Chart pick and spec

## When to use

- A client has a table of numbers and one or more points they want to make.
- A web app or site needs a chart written in Vega-Lite or Chart.js.
- A report or deck needs charts built in Excel or Google Sheets.
- Someone asks "which chart should I use for this?"

Not for: finding the answer in raw data (a data analyst's job), live dashboards with filters and refresh schedules (a BI analyst's job), or the final illustrated artwork (a designer builds it from my spec).

## What you need

1. The summary table: headers, units, period, source. Personal details replaced by IDs.
2. The message for each chart, even a rough one ("we grew in the north").
3. Where the chart will live (web page, app, slide, print, social post) and the width it gets.
4. The tool or library: Vega-Lite, Chart.js, Excel, Sheets, Datawrapper, Flourish. If code, the version in use.
5. Brand colours as hex codes, if any.
6. Access: level 1 to read what you paste. Level 2 to build unpublished charts in your chart tool or open a pull request. Level 3 to publish or replace live charts, after you confirm the list.

## Steps

### 1. Write the message as a sentence

Turn each rough point into one sentence with a number: "Bookings in the north rose 34% between March and September." If two points fight for one chart, split it. If the data cannot support the sentence, say so and suggest the sentence it does support.

### 2. Name the comparison

Sort each message by the relationship behind it: change over time, ranking, part of a whole, relationship between two measures, spread, place or flow (the FT Visual Vocabulary groups). The comparison picks the chart, not the look.

### 3. Pick the chart and give one reason

- Time: line chart. Several series over time: lines, not clustered bars.
- Ranking or size: bar chart sorted by value, unless the categories have a natural order.
- Part of a whole: stacked bar, or a pie only with five or fewer parts, a meaningful total and one part that clearly dominates.
- Relationship: scatter plot, labelling only the points that matter.
- Spread: histogram, box plot or dot plot, with the count of observations.
- Three or fewer exact numbers: a table or a big number with its comparison.

If a bar axis would need to start above zero to show the change, switch to a dot plot or a line, or show the change itself as bars, labelled as change.

### 4. Shape the data

Pick only the columns the chart needs. Sort, filter and total where needed, and write down every calculation (sums, percentages, indexes) so the client can check it. Use only the numbers provided. If a value is missing, leave the gap visible and say so.

### 5. Choose colour

- One series: one colour.
- One series is the point: that series in a strong colour, the rest in grey, the strong line thicker.
- Categories: up to four distinct colours; more than that becomes small multiples or direct labels on grey.
- Ordered values: a sequential palette; values either side of a midpoint: diverging.
- Without brand colours, start from the UK Analysis Function palette: #12436D, #28A197, #801650, #F46A25.

Check every colour against the background: text 4.5:1 (3:1 if large), chart parts 3:1. List the ratios. Add a second cue (labels, markers, dash styles) so colour is never the only way to tell series apart.

### 6. Write titles, labels and notes

- Headline title states the finding. Subtitle states the measure, place and period.
- Axis titles with units; thousands separators; no more than about ten light gridlines.
- Label lines and bars directly; drop the legend where you can.
- Source and caveats under the chart.

### 7. Write the spec in full

- **Vega-Lite:** `$schema` set to `https://vega.github.io/schema/vega-lite/v6.json`, inline `data.values`, `mark`, and `encoding` with a `type` on every field (`quantitative`, `temporal`, `nominal`, `ordinal`). Set `scale.zero` explicitly for bars. Set colours in `scale.range`. Add a `description` channel or rely on the generated ARIA labels, and still write page alt text.
- **Chart.js:** a complete config with `type`, `data` and `options`; `beginAtZero: true` on value axes for bars; the canvas element written with `role="img"`, an `aria-label` and real fallback text.
- **Excel or Sheets:** numbered steps naming the exact range, chart type, axis settings, colours and where to type the alt text.
- State the library and version at the top.

### 8. Write the text alternative

Short alt text (one or two sentences) that names the chart and gives the finding. A long description below the chart with the key numbers, or the data table itself, in the page body or a `figure` with a `figcaption`.

### 9. Hand over or publish

At level 1, send the chart card and spec. At level 2, build it unpublished in the client's tool or open a pull request. At level 3, after the client confirms the list of charts and where each goes, publish, then check the live version against the table and log what was done.

## Checks

- Every value in the spec, labels and alt text matches the table; any sum is shown.
- The chart type matches the comparison, with a one-line reason.
- Bars and areas start at zero; no dual axes, 3D or rainbow colours.
- Contrast ratios listed and passing; colour is never the only cue.
- The spec runs as written: no placeholders left, fields typed, version stated.
- Alt text gives the finding; long description or table provided.
- Nothing published beyond the access level and limits granted.

## Output format

For each chart, a chart card:
1. Message (one sentence)
2. Comparison and chart type, with the reason
3. Data used and any calculations
4. Title and subtitle
5. Colours with hex codes and contrast ratios
6. The spec in a code block, with library and version
7. Alt text and long description
8. Source line and caveats

## Example of good output (short)

*Made-up business for illustration: "Fernhill Community Pantry", visits by quarter.*

> **Message:** Visits rose every quarter in 2026, from 1,240 to 1,910.
> **Comparison:** change over time. **Chart:** line, because four points in order show the climb best.
> **Title:** "Pantry visits rose every quarter in 2026". **Subtitle:** "Visits per quarter, Fernhill Community Pantry, Jan to Dec 2026".
> **Colour:** #12436D on white, about 10:1 against the background.
>
> ```json
> {
>   "$schema": "https://vega.github.io/schema/vega-lite/v6.json",
>   "title": {"text": "Pantry visits rose every quarter in 2026", "subtitle": "Visits per quarter, Jan to Dec 2026"},
>   "data": {"values": [
>     {"quarter": "Q1", "visits": 1240}, {"quarter": "Q2", "visits": 1385},
>     {"quarter": "Q3", "visits": 1602}, {"quarter": "Q4", "visits": 1910}]},
>   "mark": {"type": "line", "point": true, "color": "#12436D", "strokeWidth": 3},
>   "encoding": {
>     "x": {"field": "quarter", "type": "ordinal", "title": "Quarter"},
>     "y": {"field": "visits", "type": "quantitative", "title": "Visits", "scale": {"zero": true}}
>   }
> }
> ```
>
> **Alt text:** "Line chart: pantry visits rose each quarter of 2026, from 1,240 in Q1 to 1,910 in Q4. Data table below."
> **Source:** Fernhill visit log, exported 5 January 2027.
