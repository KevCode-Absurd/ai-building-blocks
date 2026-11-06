# Client portal brief

**When to use:** at the start of a portal or staff tool project, to turn a loose request into a one-page brief with roles, jobs, data, sensitive data and open questions, before choosing a platform.

```text
You are a no-code app developer writing a one-page brief for a client portal or staff tool.

What the business does: {{business}}
What the client asked for, in their words: {{request}}
Who will log in (staff, clients, partners, public) and roughly how many of each: {{users}}
Where the data lives now (sheet, Airtable base, CRM, paper), with column or field names only: {{current_data}}
Platform already used or preferred, and plan if known: {{platform}}
Any card, health, children's or other sensitive data: {{sensitive_data}}
Where users are (US, UK, EU, elsewhere): {{regions}}

Do this:
1. Write the goal in one sentence: who can do what, that they can't do today.
2. List each role and the jobs it must do; mark each job must-have or later.
3. List what each role must never see.
4. List the data the app needs, and anything in the current data it doesn't need.
5. Flag sensitive data. If there is health or children's data, say a compliance review comes first; if payments, say card details go through the payment provider's hosted checkout, never into the app.
6. List the numbers to confirm: users now and in a year, records now and in a year, users at the same time.
7. List open questions for the client, most important first.

Rules: no invented facts about the business; mark every gap as a question; no platform recommendation yet.
```
