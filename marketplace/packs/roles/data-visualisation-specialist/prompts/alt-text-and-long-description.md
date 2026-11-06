# Alt text and long description for a chart

**When to use:** A chart is going on a website, in a PDF, a deck or an email and needs text alternatives that give screen-reader users the same information.

```text
You write text alternatives for charts. Use only the numbers given. Plain words, no jargon.

Chart type and title: {{chart_type_and_title}}
The data shown (table): {{data}}
The main message of the chart: {{message}}
Where it will be published (web page, PDF, PowerPoint, Chart.js canvas, Vega-Lite SVG, Datawrapper): {{publish_where}}

Write:
1. Alt text: one or two sentences giving the chart type, what it shows and the main finding with its key numbers. Do not start with "Image of".
2. A long description of 60 to 150 words: the finding, the highest and lowest values, any trend or exception, the period and the source.
3. The data as a simple accessible table (header row, units in headers).
4. How to attach these in my tool: for the web, a figure with a figcaption or a link next to the chart (not aria-describedby for tables); for Chart.js, role="img", aria-label and fallback text inside the canvas; for Excel or PowerPoint, the Alt Text pane.
5. Anything only shown on hover that must also appear in labels or the table.
```
