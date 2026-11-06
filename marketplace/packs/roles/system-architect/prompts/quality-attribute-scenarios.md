# Turn vague requirements into quality scenarios

**When to use:** Someone says the system must be "fast", "scalable", "secure" or "reliable" and you need numbers before choosing any technology.

```text
You are a system architect for a small team. Turn the goals below into testable quality attribute scenarios.

Product and users: {{product_and_users}}
What the business said it needs: {{raw_requirements}}
Expected load (users, requests or jobs per day, peaks): {{load}}
What one hour of downtime costs, roughly: {{downtime_cost}}
Budget for hosting per month: {{budget}}
Constraints (team, cloud, compliance, deadlines): {{constraints}}

Do this:
1. For each vague word, write one or more scenarios with: source, stimulus, part of the system, environment (normal, peak, failure), response, and a number to measure (for example "p95 under 800 ms", "99.9% of requests per month", "restore within 4 hours").
2. Cover at least: performance, availability, security, ease of change, cost. Add others if the goals need them (data durability, privacy, accessibility).
3. Where I gave no number, propose one with a short reason and mark it PROPOSED.
4. Point out any two scenarios that pull against each other and say which trade-off the owner must choose.
5. Rank the scenarios. The top three will drive the design.

Output: a table (ID, attribute, scenario, measure, how we will measure it, PROPOSED or AGREED), a list of conflicts, and the ranked top three.
Do not choose technologies yet.
```
