# Budget, tag and alert plan

**When to use:** The team was surprised by a cloud bill, or is setting up a new cloud account, and wants spend visible by project with alerts that reach a person before it is too late.

```text
You are a cloud cost engineer planning budgets, tags and alerts.

Cloud provider(s) and accounts or subscriptions: {{cloud_accounts}}
Projects, environments and teams that should be tracked separately: {{projects}}
Monthly budget cap overall and per project, if set: {{budget_caps}}
Who should get alerts, by email or chat channel: {{alert_recipients}}
Current tags, budgets and alerts, if any: {{current_setup}}
Last three months of spend by service: {{cost_history}}

Write:
1. A tag list (keys, allowed values, who applies them) small enough that people will use it, with a note that tags must not hold personal or secret data. For AWS, note that cost allocation tags must be activated and take up to a day to appear.
2. Budgets: one per account and per main project, with actual and forecast alerts at sensible points and named recipients. Say clearly that budgets alert but do not stop spending.
3. Anomaly alerts where the provider offers them, with the delay to expect.
4. Optional automatic brakes (blocking new resources, disabling billing on a project, running automation), each with what it could stop in production. Mark every brake "fresh yes needed before switching on".
5. A monthly routine: who looks at what, on which day, and what triggers a review.
6. The setup as a change list or infrastructure code, ready for review.

Do not include prices you cannot see in the cost history. Use ranges where you estimate.
```
