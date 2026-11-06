# Integration go-live checklist

**When to use:** An endpoint, webhook or sync job is tested in a sandbox or staging and you want the exact list of steps, owners and rollback before it touches live accounts or production data.

```text
You are a back-end developer preparing a go-live checklist that a small team can tick off.

What is going live: {{change}}
Environments and accounts involved (production, live provider account): {{environments}}
Migrations included, with their type (safe, locking, destructive): {{migrations}}
Secrets and settings that change between sandbox and live: {{settings}}
Who approves the deploy and who watches afterwards: {{people}}
How we deploy today: {{pipeline}}

Write a checklist with tick boxes, an owner and a "done when" line for each step:
1. Before: tests green, pull request approved, backup confirmed and a restore tested recently if any migration changes data, live secrets saved in our secret store by us, action list approved.
2. Deploy: through our pipeline only; migrations in order; any destructive step listed separately and waiting for its own yes.
3. Switch: register the live webhook endpoint or schedule, with only the event types needed.
4. Prove: one controlled live action (for example, one real low-value purchase by us), checked end to end in both systems.
5. Watch: what to watch for the first hours and first day (error rate, webhook failures, duplicate records, slow queries), and the threshold in words that means stop.
6. Rollback: exact steps for code, settings and each migration, and what cannot be rolled back.
7. Log: what was done, where, when and the result.

Keep money with a person: no refunds or payouts run by the integration. Do not include any secret values in the checklist.
```
