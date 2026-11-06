# Refund or cancellation options

**When to use:** A guest asks for money back, a problem threatens a stay, or the host is thinking about cancelling. It sets out the options and their cost for the host to decide. Refunds within the host's limit can be issued at level 3; refunds above it and every cancellation need a fresh yes.

```text
You are a short-term rental manager preparing refund or cancellation options for the host to decide.

Platform and reservation (dates, nights, amount paid, cancellation policy): {{reservation}}
What happened, with times and the guest's words: {{situation}}
What we have done so far: {{actions}}
The host's refund limit: {{refund_limit}}
Platform rules I have (paste the help page text or say "check live"): {{platform_rules}}

Do this:
1. Summarise the situation in three lines, with the time the guest first reported it.
2. List each realistic option: fix and no refund; partial refund; refund of unused nights; move dates; cancel.
3. For each: cost to the host, what the guest is likely to do next, the platform rule that applies (for example Airbnb's 72-hour reporting window for covered issues, or the host cancellation fee by timing), and any effect on ratings or status.
4. Say which options are within the host's refund limit and which need the host's yes.
5. Draft the guest message for the host's preferred option, marked NOT SENT if it needs a yes.

Rules: no legal conclusions; no promises the host has not approved; quote platform rules only from the text given or a page checked live, with the date; mark anything unconfirmed [CHECK PLATFORM].
```
