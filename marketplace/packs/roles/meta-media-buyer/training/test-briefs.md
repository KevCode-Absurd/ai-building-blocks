# Test briefs: adversarial rounds for a Meta media buyer

Each brief is hard on purpose. The coach gives the brief to the trainee agent and to a plain AI, then scores both against "A great answer must".

## 1. The ROAS that is too good

A skincare shop says Meta shows a ROAS of 6.2 last month on 18,000 USD spend, but shop revenue only rose 8% and the owner "doesn't feel it". They want to double the budget. Export attached shows most purchases credited to 1-day view, and the retargeting ad set has the highest ROAS.

**A great answer must:**
- Refuse to recommend doubling until the numbers are checked, and say why.
- Break results down by attribution window and flag the view-through share.
- Reconcile Meta purchases with shop orders and check for double counting.
- Question retargeting's incrementality and propose a Conversion Lift or hold-out test.
- Give a staged plan the client can approve, not a yes or no.

## 2. Thin brief, big hopes

"We're a new coffee subscription. 3,000 USD a month for Meta. Want 500 subscribers in month one. Go."

**A great answer must:**
- Ask for price, margin, churn and target cost per subscriber before planning.
- Show the maths: 3,000 USD for 500 subscribers means 6 USD each, and explain whether that is realistic given the data to come.
- Explain the learning phase and why one campaign with a few ad sets suits this budget.
- Insist on proving tracking before launch.
- Set honest expectations without inventing benchmark numbers.

## 3. The client who wants twelve ad sets

A furniture store wants separate ad sets for 12 interests, 3 age bands and each placement "so we can see what works", on 2,500 USD a month.

**A great answer must:**
- Explain fragmentation and the roughly 50-results-a-week learning threshold, with the client's own numbers.
- Offer breakdowns in reporting as the way to see segments.
- Propose a consolidated structure and a proper A/B test for the one question that matters most.
- Stay respectful and give the client the final say.

## 4. The mortgage broker

A mortgage broker in Texas wants to target first-time buyers aged 25 to 35 within 5 miles of their office, with the headline "Behind on rent? Own a home instead."

**A great answer must:**
- Identify that a Special Ad Category applies (financial products and services at least; check Meta's current definitions for whether housing also applies) and what it changes: no age or gender targeting, minimum 15-mile radius, no lookalikes, limited detailed targeting.
- Flag the headline as asserting a personal attribute and rewrite it.
- Adjust the plan to work within the rules (creative that speaks to first-time buyers rather than targeting them).
- Say this is practice guidance and suggest the client confirm compliance with a qualified adviser.

## 5. The midnight crash

On a Tuesday, cost per purchase doubles and purchases drop by half. The client is panicking and wants everything paused. The activity log shows a new checkout app was installed on Monday.

**A great answer must:**
- Check tracking first: events in Events Manager versus shop orders since Monday.
- Spot that the checkout change may have broken the purchase event or the event ID.
- Advise against pausing campaigns based on broken data, and explain why pausing can also restart learning.
- Give a fix and test plan and a clear message to the client.

## 6. Leads that never pick up the phone

A home-solar installer gets 300 leads a month at 22 USD each from instant forms, but sales says fewer than 5% are reachable. The owner wants cheaper leads.

**A great answer must:**
- Reframe the goal from cheaper leads to cheaper qualified leads or sales.
- Propose CRM feedback through Conversions API for CRM and optimising for a later stage.
- Suggest form changes (higher-intent form, SMS phone verification, qualifying questions) and expect cost per lead to rise.
- Define how success will be measured (cost per qualified lead or per sale).

## 7. An AI agent with the keys

The client has connected the Meta ads MCP server to their AI assistant and wants the agent to "optimise budgets automatically every night".

**A great answer must:**
- Explain the risk of unattended budget changes (learning resets, overspend, no review).
- Agree the access level and written limits first: which campaigns, a budget cap, the biggest nightly change, which kinds of change, and an end date.
- Recommend ads MCP server rules in Business Suite settings that match those limits: block campaign creation and cap budget edits.
- Show the action list once and get a yes before the first live change, then log every change and report it each morning.
- Ask again before anything outside the limits, and stop on a spend spike, rejected ads or a tracking break.
