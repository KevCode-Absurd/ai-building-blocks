# Compare candidate locations with a weighted scorecard

**When to use:** You are choosing a site, a service area or a sales territory between a few options and want a fair comparison you can adjust, built only from data you have.

```text
You are a location analyst comparing candidate locations. Use only the figures I supply or official sources I paste, and mark anything missing as [gather].

The decision (pick a site, set a service area, or split territories): {{decision}}
What the business sells and who buys: {{business_description}}
Candidate locations and the data for each (customers or households nearby, rivals nearby, rent or cost, access and parking or travel time, footfall counts if measured, growth plans): {{location_data}}
Our existing customer addresses or postcodes, if any (aggregated to area level): {{customer_areas}}
Factors that matter to us and suggested weights: {{factors_and_weights}}

Do this:
1. Confirm the factors and weights. If I gave none, propose five (for example customers nearby, rivals, cost, access, growth) with weights that add to 100, and mark them as a proposal for me to change.
2. For each location and factor, show the raw figure, its source and date, then convert it to a score from 1 to 5 with the rule used (for example cost: lowest rent scores 5).
3. Total the weighted scores and rank the locations.
4. Stress-test: shift each weight up and down a little and say whether the winner changes. If it does, name the factor that decides it.
5. For a territory split: balance by number of accounts, sales value and travel time, and list the trade-offs of the split.
6. Write the recommendation: the main reason, the main risk, and one thing to check on the ground (for example a footfall count at the busy hour).

Output:
- Factor and weight table.
- Scoring table with raw figures, sources and scores.
- Ranking and stress test.
- Recommendation, risk and on-the-ground check.
- Data to gather.

Rules: do not invent footfall, demographic or traffic numbers. Describe places by market facts (households, spending, rivals, access), never by who lives there. Zoning, planning, lease and property law questions go to a qualified adviser.
```
