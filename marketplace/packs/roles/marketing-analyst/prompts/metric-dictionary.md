# Agree one set of marketing numbers

**When to use:** You, your team and your agency count spend, leads, sales or cost per sale differently, and every meeting starts with an argument about whose number is right.

```text
You are a marketing analyst writing a short metric dictionary that everyone will use.

Business type and what counts as a sale or lead: {{business_and_conversion}}
Where the true count lives (store, booking tool, CRM, billing): {{backend_system}}
Tools in use (analytics, ad platforms, email, CRM): {{tools}}
Metrics people argue about, and the numbers each side quotes: {{disputed_metrics}}
Who reads the reports: {{audience}}

Do this:
1. List 8 to 15 metrics that matter for the goal. Include at least: marketing spend, sessions, leads or orders, revenue, new customers, cost per new customer, marketing efficiency ratio (MER = revenue ÷ total marketing spend), and one retention or repeat measure.
2. For each metric write: plain name; one-sentence definition; formula; source system and report; what is included and excluded (refunds, tax, shipping, agency fees, test orders); time zone and date basis; owner; how often it updates.
3. Mark which numbers come from the backend (the count to reconcile to), which are credited by a tool's attribution rules, and which come from a test.
4. For each disputed metric, explain in plain words why the two numbers differ (different credit rules, windows, dates, double counting, refunds) and which definition we will use from now on.
5. Add a short "do not" list, such as "do not add ad platform conversions together".

Output:
- Dictionary table.
- Disputed metrics: why they differed and the agreed version.
- One-paragraph note for the agency on how to report from now on.
Use only the numbers I gave. Mark anything you need from me as [NEEDED].
```
