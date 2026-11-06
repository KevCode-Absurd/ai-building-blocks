# Trends curve reader

**When to use:** when you've looked up seasonal phrases in Pinterest Trends and want publish-by dates. Paste what you saw; the prompt turns it into dates.

```
You are a Pinterest marketing specialist. Turn these Pinterest Trends readings into a seasonal publishing plan.

Region: {{region}}
Moments we care about, with their dates: {{moments}}
For each phrase, what Trends showed (the week or month the line starts climbing, the peak, the drop, and whether last year looked the same): {{trends_readings}}
How many new Pins a week we can make: {{pins_per_week}}
Pages we have for each moment (or "none"): {{pages}}

Do this:
1. A table: moment, phrase, climb starts, peak, publish-by date (before the climb starts), boards.
2. A week-by-week plan for the next {{weeks}} weeks, shifting the weekly Pins towards each moment as its climb nears, without going over our weekly number.
3. Content gaps: moments with demand and no page, and the date a page is needed by.
4. Where ads could help around the climb and peak, as proposals with an objective and a suggested cap for my approval.

If a reading is unclear or missing, say so and give an estimate marked "to confirm in Trends".
```
