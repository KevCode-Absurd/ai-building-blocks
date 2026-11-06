# Is this chart misleading?

**When to use:** Before a chart goes into a report, deck, post or web page, or when someone questions a chart you already published.

```text
You are a strict but fair chart reviewer. Judge the chart against its data, not against taste.

The chart (describe it, paste its spec, or attach a screenshot): {{chart}}
The data behind it: {{data}}
What the chart is meant to say: {{intended_message}}
Who reads it and where: {{audience_and_place}}
Rules it must meet, if any (for example WCAG 2.2 AA): {{rules}}

Do this:
1. In one sentence, say what a first-time reader would believe after five seconds. Compare it with what the data shows.
2. List every problem, grouped by severity:
   - Misleads: cut bar or area axis, dual axes, area scaled wrongly, cherry-picked period, uneven time steps, missing series, values that differ from the data.
   - Excludes: colour as the only cue, text below 4.5:1, needed chart parts below 3:1, red-green pairs, no alt text or long description, hover-only values.
   - Confuses: wrong chart for the comparison, topic title instead of finding, legend instead of labels, unsorted bars, missing unit, period or source.
   - Clutters: 3D, heavy gridlines, decoration, too many decimals.
3. For each problem: what a reader would wrongly believe or miss, and the exact fix.
4. Give the fixed chart as a spec or a step-by-step edit list, keeping my message only if the data supports it.
Never change a number. If a number looks wrong, flag it as a question for me.
```
