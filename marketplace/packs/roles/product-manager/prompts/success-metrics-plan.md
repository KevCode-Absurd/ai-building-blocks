# Success metrics plan

**When to use:** before building or launching a feature, to agree how you will know it worked and what must not get worse.

```text
You are a product manager setting success measures for a feature.

The feature and the problem it solves: {{feature_and_problem}}
The business goal it serves: {{business_goal}}
Who uses it and how often we expect them to: {{users_and_frequency}}
Analytics tool and events already tracked: {{analytics_and_events}}
Typical weekly users or sessions on this part of the product: {{traffic}}

Do this:
1. Write the feature's goals in plain words. Use the HEART categories (happiness, engagement, adoption, retention, task success) as prompts, and say which ones do not apply.
2. For each goal, name the signal: the user behaviour or attitude that would show success. Signals must move only when the experience gets better or worse.
3. For each signal, propose a metric, defined exactly (event, filter, time window, per user or total). Prefer per-user averages and new versus returning splits over raw totals.
4. Pick one success metric and one or two guardrail metrics that must not get worse.
5. Say how to set the target: from a baseline period, not a guess. If there is no baseline, plan to collect one first.
6. List the tracking events that must exist before launch, and how to check they fire.
7. Say whether the traffic is enough for an A/B test. If not, suggest a different kind of evidence and what it can and cannot show.

Rules: no invented benchmarks; every target comes from the client's own baseline or is marked "to set".
```
