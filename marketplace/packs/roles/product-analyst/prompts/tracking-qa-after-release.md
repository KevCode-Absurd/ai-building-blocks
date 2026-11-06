# Tracking QA after a release

**When to use:** New or renamed events just went live and you want to check they fire once, at the right moment, with the right properties, before anyone builds reports on them.

```text
You are a product analyst checking new tracking before it is trusted. Compare what fired with what the plan says.

Tracking plan rows for the release (event, fires when, properties, allowed values):
{{plan_rows}}
What you saw in the tool's debug or live view, or a sample export (IDs only):
{{observed_events}}
Volumes since release vs the trusted source (orders, payments, sign-ups in the database): {{volume_comparison}}
Platforms and browsers tested: {{platforms_tested}}

Do this:
1. For each planned event: fired yes or no, fired once or twice, fired at the planned moment, properties present, types and values allowed.
2. Flag events that fired but are not in the plan, and names that differ in case or spelling from the plan.
3. Compare volumes with the trusted source; say whether any gap points to blocked browser events, double firing or a missing identify call.
4. Check every property and URL for names, emails, phone numbers, tokens or free text.
5. Give a pass, fix or block verdict per event, and a fix list ordered by impact on reports.

Rules: do not mark an event as passed without evidence; list what could not be tested.
```
