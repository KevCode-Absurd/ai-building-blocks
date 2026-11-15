# First week with your agent team: store setup

By the end of the first week your team has a checked Org context, tracking you can trust against shop orders, your own goals and money limits written into owner-held files, a daily data pipeline that matches your shop and ad account, and a store and security check with fixes ranked, so every later job starts from facts.

**Starts from:** A new store folder, built with the BUILD-STORE steps, and your answers to the first questions (store, what you sell, main number, money limits, how you run it).

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | What we have on day one | Margaret (margaret-job-orchestrator) | intake.md, access-table.md | intake-complete | no | read |
| 2 | Capture your brand from the site | Philippa (philippa-brand) | org-capture.md | capture-review | no | read |
| 3 | Who buys and why, from your own customers | Funmilayo (funmilayo-customer-research) | customers.md | customer-review | no | read |
| 4 | Org context, checked and signed off | Philippa (philippa-brand) | org-summary.md | org-context-check, claims-review, summary-readability | yes | draft |
| 5 | Tracking health check against shop orders | Emre (emre-tracking) | tracking-audit.md, tracking-numbers.json | tracking-numbers, tracking-review | no | read |
| 6 | Tracking fixes, ready for you to switch on | Emre (emre-tracking) | tracking-fixes.md | fixes-review | yes | draft |
| 7 | What one order really earns | Radek (radek-unit-economics) | unit-economics.md, unit-numbers.json | unit-numbers, unit-review | no | read |
| 8 | Your goals, in your own numbers | Malcolm (malcolm-ecommerce-growth) | goals.md, goals-draft.json | goals-review | yes, the plan | publish |
| 9 | Your money limits | Hemant (hemant-store-finance) | cash-view.md, limits-draft.json, limits-numbers.json | limits-numbers, limits-review | yes, the plan | publish |
| 10 | Daily data pipeline, set up and checked | Callum (callum-reporting) | warehouse-check.md, metric-definitions.md | warehouse-review | no | draft |
| 11 | Store basics check | Facundo (facundo-store-setup) | store-check.md | store-review | no | read |
| 12 | Security check: store and agents | Ilona (ilona-bot-security) | security-check.md | security-review | yes | draft |
| 13 | End of week one | Margaret (margaret-job-orchestrator) | setup-record.md | setup-complete | yes | read |
| 14 | Tracking recheck after a week | Emre (emre-tracking) | tracking-recheck.md | recheck-review | no | read |

## Stage by stage

### 1. What we have on day one

Reads your answers to the first questions, any Org context you already have, and the agent's own tool list to see which connectors are really there and at which level. Writes the week's plan: which stage runs on which day, who does it, and what each one needs from you (a sign-in, an export, a test order). Nothing is guessed: a missing answer becomes one short question.

- **Needs:** context/org-context/ (if you already have an Org context folder); your answers to the BUILD-STORE first questions; the agent's own tool list (the only true list of connected tools); context/access.md (if it exists)
- **Makes:** intake.md, access-table.md
- **Checks:** intake-complete (every tool in access-table.md was seen in the tool list or marked not connected, and every missing answer is a question, not a guess)
- **Done when:** intake.md lists the store, markets, currency, chosen processes and the day for each stage, and access-table.md lists each tool with its level (none, read, draft, publish) and the stage that needs it.

### 2. Capture your brand from the site

Runs the Org context builder skill (catalogue-items/general/website-brand-brain-builder) on your site: captures your own lines, live offers, prices, shipping and returns word for word, your look, and 3 to 5 competitors, each fact as a record with its source, date and status. Sorts in any brand material you already have. Where the site and your material disagree, both are kept and marked disputed until you settle it. If an Org context exists, it is updated in place, never replaced.

- **Needs:** context/org-context/ (existing folder, if any); your website address; brand material you already have (style guide, product sheets, past ads), each labelled with when you got it
- **Makes:** org-capture.md
- **Checks:** capture-review (every price, offer and policy line is copied word for word with its page and date, and disputed facts are kept both ways)
- **Done when:** org-capture.md lists every page read with its date, every page that would not load, the competitors found, and each disputed fact, and context/org-context/ holds offers, facts, look and voice records with a source, date and status on every line.

### 3. Who buys and why, from your own customers

Reads 6 to 12 months of orders, reviews, support tickets and any survey answers. Codes each review and ticket by problem, trigger, doubt, result and the words used, and counts the themes. Builds 2 to 4 buyer records from first-time, repeat and high-profit buyers, each with real quotes and counts, and a bank of customer words. Anything thin is marked as needing more evidence. It never contacts customers.

- **Needs:** context/org-context/ (from the capture stage); shop orders and customers (connector at level 1, or an export); review export or a paste of the reviews page; support tickets or help desk export, if you have one
- **Makes:** customers.md
- **Checks:** customer-review (each buyer record rests on counted themes and real quotes with sources, and no quote is invented)
- **Done when:** customers.md holds 2 to 4 buyer records, each line tied to a count or a quoted source, and the same records are written into context/org-context/foundation/customers.md and why-they-buy.md.

### 4. Org context, checked and signed off

Writes the eight sections of the Org context from the records: brand DNA, customers, voice, how the brand speaks to customers, design, markets, claims allowed and banned, and do's and don'ts. Every claim is marked approved, pending or banned, with its proof. Then asks you at most five questions, one at a time, about what the sources cannot say, such as proof for the top claims or who may appear in content. Shows you a one-page fact sheet to correct.

- **Needs:** org-capture.md; customers.md; context/org-context/
- **Makes:** org-summary.md
- **Checks:** org-context-check (the score and gap list are copied into org-summary.md, and every gap the first jobs need has a MISSING line naming who can answer); claims-review (every claim is marked approved, pending or banned, approved claims name their proof, and no pending claim is written as fact); summary-readability (the readability checker exits 0)
- **Done when:** org-summary.md shows the fact sheet, the score from the Org context check, each disputed fact and each gap as a MISSING line with who can answer, and every section file exists or says what is missing.
- **You sign off:** You read the fact sheet: name, what you sell, main offers and prices, buyers, main colour and the claims list. Correct anything wrong. Reply yes with the code when it is right. Every later intake reads this folder, so a wrong fact here spreads.

### 5. Tracking health check against shop orders

Builds a day-by-day table of shop orders and revenue against the purchases and value each ad platform and GA4 report, for the last 14 to 30 days. Shop orders are the truth. Any gap over about 10% gets a named cause: double counts, missing purchases, wrong values, poor match quality or consent. Then traces one real test order that you place yourself, from the browser event to the server event, checking both carry the same event id. Writes a fix list ranked by money at stake.

- **Needs:** shop orders with refunds and cancellations, last 30 days; Meta Events Manager, Google Ads conversions and GA4 (level 1, or exports); the list of apps and tags that fire events; one test order placed by you, with its order number
- **Makes:** tracking-audit.md, tracking-numbers.json
- **Checks:** tracking-numbers (every gap and total in the audit recomputes from its own inputs); tracking-review (shop orders are the base for every match, each gap over about 10% has a cause, and the test order trace shows both events with one event id)
- **Done when:** tracking-audit.md has the daily match table for each platform, the cause of every gap over about 10%, the test order trace, and a fix list in order of money at stake.

### 6. Tracking fixes, ready for you to switch on

Prepares each fix with a before and after: an unpublished Tag Manager workspace, app settings saved for review, or click-by-click steps for Events Manager and the shop's customer events. No official connector in this kit can publish tracking changes, so you (or your developer) switch each fix on, and the agent checks the result. Consent and cookie wording is checked for each market you sell in.

- **Needs:** tracking-audit.md; context/org-context/ markets
- **Makes:** tracking-fixes.md
- **Checks:** fixes-review (each fix maps to a gap in the audit, has a before and after, an undo step and a check, and nothing goes live without you)
- **Done when:** tracking-fixes.md gives each fix its before and after, the exact place to make it, how to undo it, and how it will be checked.
- **You sign off:** You read the fix list. Reply yes with the code to approve it. Then you make each change where the steps say, and tell the agent when each one is done so it can check it.

### 7. What one order really earns

Works out gross profit per purchase: order value minus product cost, shipping both ways, payment fees, discounts, failed deliveries and returns, split by product and channel. From that it gives the break-even ad cost for a first order. Every input names its source, and any estimate is marked, because no goal or ranking may rest on an estimate you have not approved. Ends with a trust verdict: pass, pass with caveats, or fail.

- **Needs:** shop orders, refunds and product costs, last 90 days; shipping and payment fee exports; tracking-audit.md
- **Makes:** unit-economics.md, unit-numbers.json
- **Checks:** unit-numbers (gross profit per purchase and break-even cost recompute from their inputs, and no total mixes two periods); unit-review (every cost line has a source, estimates are marked, and the trust verdict follows from the tracking audit)
- **Done when:** unit-economics.md gives gross profit per purchase and break-even cost per first order by product and channel, each input with its source, and the trust verdict with its reason.

### 8. Your goals, in your own numbers

Asks you, one question at a time: your main number (for example return on ad spend over 7 days, or profit per order), second numbers you care about (for example video hook rate or repeat rate), guardrails that must not break (for example cost per purchase under a set amount, refund rate), the minimum spend and days before any result is judged, and how sure a result must be before scaling. Shows each target next to the break-even from the unit economics, so a target that loses money is visible. Then proposes context/goals.json as a file plan.

- **Needs:** unit-economics.md; your answers
- **Makes:** goals.md, goals-draft.json
- **Checks:** goals-review (each target is shown against break-even, the guardrails and judging rules are set, and goals-draft.json says exactly what goals.md says)
- **Goes live:** No outside connector. One file plan (node agent/actions.mjs propose-file context/goals.json) that writes context/goals.json only when you reply yes with its code. The gate blocks any other edit to this file.
- **Done when:** goals.md explains each number in plain words, goals-draft.json matches it exactly, and the file plan was approved by you and wrote context/goals.json.

### 9. Your money limits

Builds a quick cash view from payouts, stock payments, ad spend and other costs, agrees your cash floor with you, and works out what the team can put into ads, stock and tests without going below it. Then drafts context/limits.json with you: the ad accounts, currency, most new ad spend a day, biggest budget rise in one step (we suggest 20%), monthly cap, generation budget per creative job, your AI disclosure choice and the end date. It never moves money.

- **Needs:** bank, payout and stock order exports (level 1, or exports); goals-draft.json; your cash floor
- **Makes:** cash-view.md, limits-draft.json, limits-numbers.json
- **Checks:** limits-numbers (the safe spend recomputes from the cash view and the floor you set); limits-review (the daily cap, monthly cap and generation budget fit inside the safe spend, the step limit is set, and every amount is in whole units of one currency)
- **Goes live:** No outside connector. One file plan (node agent/actions.mjs propose-file context/limits.json) that writes context/limits.json only when you reply yes with its code. After that, every spending plan is checked against it in code.
- **Done when:** cash-view.md shows the cash floor and the safe spend for the month, limits-draft.json has every field filled in whole currency units, and the file plan was approved by you and wrote context/limits.json.

### 10. Daily data pipeline, set up and checked

Sets up the warehouse the agents read instead of asking each platform every time: the Meta sync with a read-only token, the shop sync for orders, revenue, refunds and new customers by day, the creative register and the views. You paste each token into your host's secret store yourself; the agent never sees or prints it. Writes one set of metric definitions (MER, cost per new customer, contribution margin) so every report counts the same way. Then checks yesterday against the platforms.

- **Needs:** the Meta access guide, Way 2, steps 1 to 5 (read-only token); your shop's access guide (read-only token); unit-economics.md (cost and fee lines)
- **Makes:** warehouse-check.md, metric-definitions.md
- **Checks:** warehouse-review (yesterday's spend and orders match the platforms, tokens are read-only and stored only in the secret store, and the metric definitions match the unit economics)
- **Done when:** warehouse-check.md shows the sync checks passed, a 90-day first pull, and yesterday's spend and orders in the warehouse next to Ads Manager and the shop's own report, matching within a few cents and exactly on orders.

### 11. Store basics check

Checks the basics from the store admin, the product export and the app list: domain, payments, checkout, shipping zones, taxes, policies and contact details, then markets, currencies and duties for each country you sell in. Maps the catalogue (types, variants, tags, collections) and lists each app with what it does and whether it earns its place. Each item is pass or fail with the fix.

- **Needs:** store admin at level 1 (or screenshots and exports); product export and app list; context/org-context/ markets
- **Makes:** store-check.md
- **Checks:** store-review (every basic, market and app has a pass or fail read from the store itself, and each fail has a fix and an owner)
- **Done when:** store-check.md has a pass or fail for every basic, every market and every app, with the fix and the person who makes it.

### 12. Security check: store and agents

Checks staff accounts and what each can do, two-step sign-in, old accounts, apps and theme scripts, fraud settings and bot traffic over the last 90 days. Then checks the agent setup itself: every write tool set to Needs approval and every delete tool to Blocked in Claude, tokens only in the secret store, each agent's tool list no wider than its stages, and no session that both reads outside email and holds a send or spend tool. Prepares each fix with its undo step.

- **Needs:** staff accounts, login history and app list (level 1); context/access.md and agent/tools.json; store-check.md
- **Makes:** security-check.md
- **Checks:** security-review (findings are ranked by risk, each fix has an undo step, and the agent-setup items were checked in the real settings, not assumed)
- **Done when:** security-check.md ranks every finding by risk, with the fix, the undo step, who makes it, and the agent-setup items marked pass or fail.
- **You sign off:** You read the fixes ranked by risk. Reply yes with the code to accept the list. You make the account changes yourself (removing staff or turning on two-step sign-in); the agent never removes an account or deletes data.

### 13. End of week one

Checks every stage of the week against its done test, with evidence, and writes what the store should remember into context/MEMORY.md: store numbers, gates, access levels and open gaps. Lists what is still waiting for you, such as a tracking fix not yet switched on or a MISSING fact. Then hands the folder to the growth plan.

- **Needs:** every file this job made; context/goals.json and context/limits.json
- **Makes:** setup-record.md
- **Checks:** setup-complete (every stage has evidence of its done test, open items are listed with their owner, and goals and limits are the versions you approved)
- **Done when:** setup-record.md marks every stage pass or open, with its evidence, and context/MEMORY.md holds the store numbers and gates.
- **You sign off:** You read the one-page record of the week. Reply yes with the code to close setup and start the growth plan.

### 14. Tracking recheck after a week

Seven days after the fixes went live, runs the same day-by-day match of shop orders against each platform again, now from the warehouse. Says for each fix whether the gap closed. A gap that did not close goes back on the fix list with its cause.

- **Needs:** tracking-fixes.md; warehouse views shop_orders_daily and ads_daily; GA4 and Google Ads conversions (level 1)
- **Makes:** tracking-recheck.md
- **Checks:** recheck-review (before and after cover the same number of days from the same sources, and each open gap has a cause)
- **Done when:** tracking-recheck.md shows the gap before and after each fix for the same number of days, and lists any fix still open.

## Where you step in

- **Org context, checked and signed off:** You read the fact sheet: name, what you sell, main offers and prices, buyers, main colour and the claims list. Correct anything wrong. Reply yes with the code when it is right. Every later intake reads this folder, so a wrong fact here spreads.
- **Tracking fixes, ready for you to switch on:** You read the fix list. Reply yes with the code to approve it. Then you make each change where the steps say, and tell the agent when each one is done so it can check it.
- **Your goals, in your own numbers:** approve the exact plan of live changes
- **Your money limits:** approve the exact plan of live changes
- **Security check: store and agents:** You read the fixes ranked by risk. Reply yes with the code to accept the list. You make the account changes yourself (removing staff or turning on two-step sign-in); the agent never removes an account or deletes data.
- **End of week one:** You read the one-page record of the week. Reply yes with the code to close setup and start the growth plan.

## Then

When the last stage is done, the work moves to **growth-plan** with the same folder.

## How we judge it

- Org context: the score from the Org context check for the first jobs you chose, and the number of MISSING lines left open, each with who can answer.
- Tracking: for each ad platform, the gap between its purchases and shop orders over the last 14 to 30 days, with a named cause for any gap over about 10%.
- Data: yesterday's spend in the warehouse matches Ads Manager, and yesterday's orders match the shop's own report.
- Time: every stage done within seven days of starting, except the tracking recheck, which reads one more week of data.
