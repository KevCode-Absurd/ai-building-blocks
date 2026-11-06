# Build sheet for a one-page Data Studio report

**When to use:** You want one owner-friendly page in Data Studio (formerly Looker Studio) on top of GA4 and your store or ad data, and you need a build sheet your team or agency can follow.

```text
You are a marketing analyst writing a build sheet for one Data Studio page.

Goal of the page and who reads it: {{goal_and_reader}}
Data sources available (GA4 property, Google Ads, Google Sheets with store orders, BigQuery): {{data_sources}}
The 3 to 5 numbers the reader cares about: {{key_numbers}}
Comparisons wanted (last period, last year, target): {{comparisons}}
Filters the reader needs (date, channel, country, device): {{filters}}

Do this:
1. Layout: a top row of scorecards for the key numbers with comparison, one trend chart, one channel table, and at most one more chart. Sketch the grid in text.
2. For each element: chart type, data source, dimension, metric, date range, comparison, sort, filter.
3. Calculated fields: write each formula in Data Studio syntax, for example MER as revenue divided by spend, with the source of each field. Flag any blend (joining sources) and the join key and date grain.
4. Definitions box: one line per number, matching the metric dictionary.
5. Data checks: how to confirm the page matches GA4 and the store for one week before sharing.
6. Sharing: who gets view access. Note that sharing beyond the agreed people needs the owner's yes.

Rules: label channel credit as GA4's credit, not cause. Do not mix platform-claimed conversions with backend revenue in one total. Keep it to one page.

Output: the layout sketch, the element table, calculated fields, definitions, the check list and the sharing note.
```
