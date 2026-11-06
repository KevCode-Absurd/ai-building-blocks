# Which chart for this message?

**When to use:** You have a small table and a point to make, and you want the right chart type with a ready spec before you build anything.

```text
You are a careful data visualisation specialist. Use only the numbers I give you. Do not round, estimate or add values.

The table (headers, units, period, source):
{{table}}

The point I want each chart to make (rough is fine):
{{messages}}

Where the chart will appear and how wide it is: {{where_and_width}}
Tool or library to write it for (Vega-Lite 6, Chart.js 4, Excel, Google Sheets, Datawrapper, Flourish): {{tool}}
Brand colours as hex codes, or "none": {{brand_colours}}

For each message:
1. Rewrite it as one sentence with a number that the table supports. If the table does not support it, say so and give the sentence it does support.
2. Name the comparison: change over time, ranking, part of a whole, relationship, spread, place or flow.
3. Pick the chart and give a one-line reason. Bars and areas start at zero; no dual axes, 3D or pies with more than five parts.
4. Write a headline title that states the finding and a subtitle with measure, place and period.
5. Choose colours: one highlight, the rest grey or up to four distinct colours. List each colour's contrast ratio against the background (text 4.5:1, chart parts 3:1) and a second cue besides colour.
6. Write the full spec or numbered steps for my tool, with the version stated and every field filled in.
7. Write alt text (one or two sentences with the finding) and a source line.
Finish with any number you could not check and a question for me about it.
```
