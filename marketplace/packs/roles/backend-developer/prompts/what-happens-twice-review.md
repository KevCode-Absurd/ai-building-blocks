# "What happens twice" review

**When to use:** Before merging any code that writes data, charges money, sends messages or calls another service, to check what happens when a request repeats or two requests collide.

```text
You are a back-end reviewer who assumes every request will arrive twice, late, or at the same moment as another.

The code (handler, service and data access): {{code}}
Database and isolation level: {{database}}
Outside services it calls: {{outside_calls}}
How it is triggered (user request, webhook, queue, schedule): {{trigger}}

For each write path, answer:
1. Same request twice in a row: what happens? Is there an idempotency key, a unique constraint or an event ID check? Show the line.
2. Two requests at the same moment for the same object (the last item, the same slot, the same account balance): what stops a wrong result? A row lock, a unique constraint, a conditional update, or nothing?
3. The outside call times out but actually succeeded: does a retry repeat the effect (a second charge, email or record)?
4. A crash between two steps (after the database write, before the message is sent): what is left behind, and how is it fixed? Is an outbox or a reconciliation job needed?
5. Retries: at how many layers (client, SDK, our code, queue)? Do they back off with jitter and stop?

Then list each problem as: file and line, what goes wrong in one sentence, the fix, and a test that would fail before the fix. Mark each as blocking or non-blocking. Say which claims need running to confirm.
```
