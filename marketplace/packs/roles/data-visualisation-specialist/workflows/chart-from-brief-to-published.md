# Chart from brief to published

**Trigger:** A request for one or more charts, an infographic or a results deck: "make a chart of this", "we need the annual report charts", "turn this into slides". Usually two to six charts, finished in a day or two of back and forth.

## Steps

1. **Agree access and limits (level 1).** Ask which access level the client grants for each tool (spreadsheet, chart tool, design tool, slides, website or code repository) and the limits: which folders, pages or decks, who may see the result, until when. Write it down as "Access I have". Ask whether any numbers are confidential, since free Flourish charts are public once published.
2. **Collect the brief (level 1).** The table, the message for each chart, the reader and where it will appear, brand colours and any rule to meet (for example WCAG 2.2 AA). Use the `which-chart-for-this-message` prompt if the brief is thin.
3. **Check the numbers (level 1).** Totals add up, percentages share a base, units and periods are stated. Questions go back to the client before any design work.
4. **Pick and spec each chart (level 1).** Use the `chart-pick-and-spec` skill: message, comparison, chart type and reason, titles, colours, the full spec, alt text and source line.
5. **Set colour and text alternatives (level 1).** Use the `accessible-chart-colour-and-text` skill for the palette, contrast ratios, second cues and the long description or table. For an infographic or deck, use the `infographic-and-data-deck-layout` skill for the layout sheet or outline.
6. **Self-review (level 1).** Run the `chart-review-and-fix` skill on your own drafts: honesty, access, clarity, clutter. Check each value against the table, in greyscale and in a colour-vision simulator.
7. **Build drafts (level 2).** Build the charts unpublished in Datawrapper or Flourish, as draft Canva designs or Figma frames, in a copy of the deck or workbook, or as a pull request with Vega-Lite or Chart.js code. *Approval: the client reviews the drafts and the chart cards.*
8. **Publish (level 3).** After the client's yes on the list (which charts, where, what they replace, who sees them), publish or embed them, replace the charts in the live file, or merge the approved code through the client's pipeline. Making a private chart public, overwriting a chart others embed, or posting to a new page needs a fresh yes. *Approval: yes on the action list before the first live change.*
9. **Check live (level 1).** Open each published chart: values match the table, alt text and long description are present, embeds load on mobile, links work.
10. **Report.** One page: what was made, where it lives, the chart cards, contrast ratios, and every action taken from the log.

## Outputs

- Chart cards with complete specs or build steps
- Palette table with contrast ratios
- Alt text, long descriptions and data tables
- Draft charts, designs or a pull request (level 2)
- Published charts or updated files, with links (level 3)
- Action log and a one-page handover

## Needs the client's approval

The access level and limits for each tool; any change to a number or message; the drafts before anything goes live; the action list before the first live change at level 3; and a fresh yes before making a private chart public, overwriting a chart or template others use, or publishing to a new page or audience. The client can lower the access level at any time. Posting to social accounts is a separate grant.
