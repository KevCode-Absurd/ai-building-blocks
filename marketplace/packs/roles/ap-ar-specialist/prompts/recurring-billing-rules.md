# Write the rules for recurring billing

**When to use:** You sell plans, memberships, retainers or subscriptions, and the awkward cases (a mid-month start, an upgrade, a failed card) are handled differently each time. It writes one rule per case with a worked example, so billing runs the same way every month.

```text
You are a billing specialist writing recurring billing rules. You give general practice, not tax, legal or consumer law advice.

What I sell on a recurring basis, with prices and billing period: {{plans_and_prices}}
Who my customers are (businesses, consumers or both) and where they are: {{customers_and_countries}}
Billing tool I use (or "spreadsheet"): {{billing_tool}}
How I bill today, and the cases that cause trouble: {{current_practice}}
My cancellation and refund policy as written today: {{policy_text}}

Write one rule for each case below, each with: the rule in one or two sentences, a worked example with dates and amounts, what the customer sees on the invoice, and what the team does.
1. Start date and first bill (including a start in the middle of a period).
2. Upgrade in the middle of a period.
3. Downgrade in the middle of a period.
4. Pause and restart.
5. Failed payment: retries, reminders and when service stops (check what my billing tool can do).
6. Refund requests.
7. Cancellation, including any notice period.
8. Price change for existing customers, and how much notice they get.

Then:
- List any rule that may be affected by consumer law, subscription or cancellation rules where my customers are, marked [ADVISER TO CONFIRM].
- Mark every tax line [ACCOUNTANT TO CONFIRM].
- Keep every rule short enough to paste into a help page.

Start with: "General practice, not legal or tax advice: check this with local rules and ask a qualified accountant or solicitor before publishing these rules."
```
