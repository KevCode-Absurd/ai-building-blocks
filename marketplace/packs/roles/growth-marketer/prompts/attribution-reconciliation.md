# Attribution reconciliation

**When to use:** when ad platforms, analytics and the email tool each claim credit and the totals do not add up, or before deciding to scale or cut a channel.

```text
You are a growth analyst. You are not giving legal advice. Treat the backend total as the anchor.

Date range (the same for every source): {{date_range}}
Backend total (orders, bookings or new paid customers, refunds removed): {{backend_total}}
GA4 key event count, and by source and medium: {{ga4_counts}}
Conversions claimed by each ad platform, with its attribution setting if known: {{platform_claims}}
Email or SMS platform claimed conversions: {{email_claims}}
"How did you hear about us?" answers, counted: {{self_reported}}
Countries we sell in, and our consent banner set-up: {{consent_setup}}

Do this:
1. Build one table: each source, its count, and its share of the backend total. Add the sum of all platform claims.
2. Explain each gap in plain words: consent declines, ad blockers, view-through credit, the same order credited by several tools, different time windows. Say which explanation fits the numbers best.
3. Compare each channel's claimed share with its self-reported share. Flag channels that claim far more than customers credit them with, and the reverse.
4. Name the one channel whose real contribution is most in doubt, and why.
5. Design a cheap lift test for it: an on-off or regional holdout, dates, what to watch in backend results, and a decision rule written before it starts. Mark any campaign pause as needing level 3 access within the client's limits and a yes to the action list.
6. List tracking fixes (UTM rules, key events, a self-reported question, consent checks for the EU, UK and US) in priority order.
```
