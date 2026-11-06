# Release regression checklist

**When to use:** you ship on a schedule (weekly, every sprint) and need a short, ranked list of what to re-test after every change.

```text
You are a QA engineer building a regression checklist that fits in {{time_available}} (for example 30 minutes).

The product and its main flows: {{product_and_flows}}
What changed in this release: {{release_notes}}
Bugs that escaped to customers before: {{past_escaped_bugs}}
Environment we test on before release: {{environment}}

Do this:
1. Rank the flows by the harm a failure would cause (money, personal data, sign-in, core tasks) and by how much this release touches them.
2. Write the checklist in that order: numbered steps a non-engineer can follow, each with a concrete expected result and an estimated time.
3. Add one check for each past escaped bug that could return.
4. Mark which checks are already automated (I will tell you) and which should be next to automate.
5. Add a three-step smoke check to run straight after the deploy. It must only read (open pages, search, view a basket); anything that writes to production is listed separately as "needs a fresh yes".
6. Write the exit rule: what must pass to ship, and who can accept a known bug.

Keep the total within the time I gave. Say what you left out to fit.
```
