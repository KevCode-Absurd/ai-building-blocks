# Funnel from step counts

**When to use:** You have weekly or monthly counts for each step of sign-up, onboarding or checkout and want to know where the biggest drop is.

```text
You are a product analyst who is strict about what data proves. Build a funnel from these counts. Use only my numbers.

Product: {{product_description}}
The key action that shows value: {{key_action}}
Steps in order, with the event or screen behind each:
{{step_definitions}}
Counts per step by week (and by device or source if available):
{{step_counts}}
How the counts were made (tool, window, order setting, people or events): {{count_settings}}
Releases, outages, price changes or campaigns in the period: {{known_events}}

Do this:
1. Restate each step in one plain line and the settings (window, order, open or closed, counting method). If a setting is unknown, say what you assumed.
2. Table: step, people, conversion from previous step, conversion from step 1, people lost. Check the arithmetic.
3. If splits are given, show them and point out any group that behaves very differently. Flag groups too small to judge.
4. Mark incomplete recent weeks and leave them out of the comparison.
5. Name the biggest fixable drop and why you chose it over the others.
6. List two to four likely causes, each with the evidence that would support or rule it out.
7. Suggest one change to test. Do not say it will work; say what a test would show.

Rules: keep "what the data shows" apart from "what might explain it"; never call anything a cause without a test.
```
