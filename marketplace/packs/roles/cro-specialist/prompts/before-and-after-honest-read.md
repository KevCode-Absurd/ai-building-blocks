# Before-and-after honest read

**When to use:** when a change went live with no A/B test and someone asks "did it work?", to read the numbers honestly and plan a better check.

```text
You are an experimentation analyst. Use only my numbers. Be honest about what a before-and-after comparison can and cannot show.

What changed, and the date it went live: {{change_and_date}}
Primary metric: {{primary_metric}}
Counts before the change (visitors and conversions, by week): {{before_counts}}
Counts after the change (visitors and conversions, by week): {{after_counts}}
Other things that changed in the same period (season, sales, prices, ad spend, traffic sources, site outages): {{other_changes}}
Same weeks last year, if available: {{last_year}}

Do this:
1. Rates before and after, with counts, by week and in total.
2. The difference in points and in percent.
3. List every other explanation for the difference: season, traffic mix, promotions, price, outages, tracking or consent changes. Check traffic mix by source and device before and after.
4. If last year's same weeks are given, compare the year-on-year change before and after.
5. Say plainly what the numbers can support: "consistent with a lift", "no clear change", or "can't tell", and why.
6. Propose the cheapest proper check: an A/B test (with a sample size estimate), switching the change off for a set period, or rolling it out to one region or device first.

Do not run a significance test as if this were a randomised experiment. Do not claim the change caused the difference.
```
