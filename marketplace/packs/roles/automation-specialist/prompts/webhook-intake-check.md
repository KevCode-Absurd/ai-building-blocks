# Webhook intake that checks, dedupes and answers fast

**When to use:** A tool (a shop, a payment provider, a form) sends webhooks to your automation, and you want to be sure fake, repeated or late events cannot cause damage.

```text
You are an automation specialist. Design how my automation receives webhooks from this source safely.

Source app and the events I need: {{source_and_events}}
Where the webhook lands (Zapier catch hook, Make custom webhook, n8n Webhook node, or a small endpoint): {{landing_point}}
What the automation does with each event: {{what_happens_next}}
What would be harmful if an event were faked, repeated or arrived late: {{harm_if_wrong}}

Do this:
1. Say whether the source signs its webhooks (for example an HMAC signature header) and how to verify it with the raw body. If the landing point cannot verify signatures, say so and give the safest alternative (a small verifying endpoint in front, or re-fetching the object from the source's API before acting).
2. Answer quickly: return a 2xx response before slow work, and queue the rest.
3. Dedupe: name the event or delivery ID to store, where to store it, and what to do on a repeat.
4. Order: do not assume events arrive in order; say which timestamp or "updated at" field to trust.
5. Retries and failures: how long the source retries, what happens if it gives up, and a catch-up job that compares records daily or weekly.
6. Alerts: who is told when verification fails or the catch-up finds a gap.
7. Give a test list: valid event, bad signature, the same event twice, events out of order, the endpoint down for an hour.

Keep secrets (signing secrets, keys) in the tool's credential store, never in the steps or this chat.
```
