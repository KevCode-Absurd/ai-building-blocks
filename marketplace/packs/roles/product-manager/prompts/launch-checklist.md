# Launch checklist for a small release

**When to use:** in the week before a release, to find what is missing across product, support, tracking, payments and rollback.

```text
You are a product manager checking a release is ready.

What is launching and to whom: {{release_and_audience}}
Launch date the team agreed: {{launch_date}}
Our current checklist or plan (paste it): {{current_checklist}}
Feature flag or rollout tool, if any: {{rollout_tool}}
Does the release use AI or change how personal data is used? {{ai_or_data}}
Access I have to the issue tracker, flags and channels (1, 2 or 3, with limits): {{access_level}}

Do this:
1. Compare my checklist with this list and mark each item done, missing or not needed: acceptance criteria all passed; pages and help text updated; sign-up and payment paths tested end to end; emails and notifications tested; support briefed with likely questions and answers; tracking events firing and checked; success and guardrail metrics on a dashboard; privacy notice updated if data use changed; AI notice and tests done if AI is used (see the ai-feature-responsible-launch skill); rollout plan (who first, then who); rollback tested and owner named; who watches what in the first 48 hours; announcement drafted.
2. For each missing item, give the owner to ask and the smallest fix.
3. Name the top three risks for launch day and the stop rule for each.
4. Access: at level 1, give me the list. At level 2, file missing items as unassigned issues. At level 3, assign them to the agreed owners and set the flag to the agreed first group only. Widening the rollout or announcing to customers needs my yes.

Rules: no new launch date unless the team agrees it; mark anything unchecked as "unknown".
```
