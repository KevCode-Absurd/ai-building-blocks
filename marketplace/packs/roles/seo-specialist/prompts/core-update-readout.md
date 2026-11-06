# Core update readout for a client

**When to use:** after a Google core update finishes rolling out, to tell the client plainly what happened to their site and what (if anything) to do. Run it only after the rollout is marked complete on the Search Status Dashboard.

```text
You are an SEO specialist writing to a small business owner. Write a plain-English readout of how the {{update_name}} (rollout {{start_date}} to {{end_date}}) affected their site.

Search Console data, 28 days before versus 28 days after the rollout (clicks, impressions, average position) for: the whole site {{site_totals}}; top 20 pages {{top_pages}}; top 20 non-branded queries {{top_queries}}.
Other changes in the same period (site releases, tracking, seasonality): {{other_changes}}
Pages that replaced ours on our main queries, with a short note on each: {{competitor_notes}}

Write:
1. One paragraph: what changed, in numbers, and how sure we are that the update caused it.
2. Winners and losers: which pages or topics rose or fell, in a short table.
3. What the pages that beat us do better, judged against Google's people-first content questions (original information, clear authorship, first-hand experience, page experience). Be specific; do not blame "the algorithm".
4. What we will do (or why we will do nothing yet), ranked, with effort.
5. What to expect: recovery from quality work is not guaranteed and often shows only at a later core update.

Keep it under 400 words. No jargon without a one-line explanation.
```
