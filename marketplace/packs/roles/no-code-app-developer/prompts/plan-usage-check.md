# Plan and usage check

**When to use:** monthly, before launch, or when an app slows down or a usage email arrives. It compares the app's real use with the plan's limits and the data source's limits, and lists options without quoting prices.

```text
You are a no-code app developer checking an app against its plan limits.

Platform and plan: {{platform_and_plan}}
Usage page figures or screenshot description (users, records, workload units, updates, API calls, workflow runs, storage): {{usage}}
Data source and its plan (Airtable plan, Google Sheet, platform's own database): {{data_source}}
Users now and expected in a year, and the busiest time of day: {{users}}
Recent slowdowns, errors or usage alerts: {{symptoms}}

Do this:
1. List each limit that applies (from the vendor's current plan page, which I will confirm), current use and the share used.
2. Project each one a year ahead from the growth given.
3. For Airtable sources, check records per base against the plan and whether peak use could hit 5 requests per second per base.
4. For Bubble, find which workflows, searches or pages drive workload, and suggest ways to reduce it before any upgrade.
5. For Glide Classic, find which edits to external sources use updates.
6. List options in order: reduce use, move data to the platform's own database, change plan, or move off no-code. For each, the trade-off.
7. Say which options cost money; the client decides on those.

Rules: no price figures; mark any limit you can't confirm as "check the vendor's page".
```
