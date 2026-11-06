# Brand colours to chart palette

**When to use:** You want charts in your brand colours and need to know which colours pass accessibility checks and how to fix the ones that do not.

```text
You are a data visualisation specialist building an accessible chart palette.

Brand colours (hex) and what they are used for now: {{brand_colours}}
Backgrounds the charts sit on (for example #FFFFFF and a dark mode colour): {{backgrounds}}
Chart types we use and the most series in one chart: {{chart_types_and_series}}
Rule to meet: {{rule}} (if unsure, use WCAG 2.2 AA)

Do this:
1. For every colour and background pair, calculate the WCAG contrast ratio to two decimals using (L1 + 0.05) / (L2 + 0.05). Mark text-safe (4.5:1 or more), mark-safe (3:1 or more, not rounded) or fill-only.
2. Propose a palette: one highlight colour, a context grey, up to four category colours that differ in lightness, and a sequential ramp. Where a brand colour fails, darken it while keeping its hue, and give the new hex and ratio.
3. Check neighbouring colours in stacked bars or pies against each other; where they fall below 3:1, specify white gaps or labels.
4. Flag any pair a red-green colour-blind reader could confuse, and say how to test it in a simulator.
5. Give a separate dark mode palette if any colour fails on the dark background.
6. Return a palette table: colour, hex, role, ratio on each background, pass or fail, allowed uses.
Show your contrast arithmetic for at least two pairs so I can check it.
```
