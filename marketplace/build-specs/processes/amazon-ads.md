# Amazon Sponsored Products launch, with weekly search term work

Sponsored Products campaigns for a product, built on its break-even ACOS and a rule card you approved (budget, end date, highest ACOS, stop rules), built paused, switched on only with your yes, then read weekly, with harvested keywords, negatives and bid changes coming to you as exact plans, and a day 30 call.

**Starts from:** A product going live on Amazon (often right after the Amazon listing process), a live product with no ads, or a rebuild of a messy account. A listing job keeps its folder when it hands over.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Junaid (junaid-amazon-ads) | ads/intake.md | intake-complete | no | read |
| 2 | Break-even ACOS | Junaid (junaid-amazon-ads) | ads/break-even.md | margin-check | no | draft |
| 3 | Is the listing ready for ads? | Garrett (garrett-amazon) | ads/listing-gate.md | none | no | read |
| 4 | Campaign plan and rule card | Junaid (junaid-amazon-ads) | ads/plan.md, ads/rule-card.md | plan-review | no | draft |
| 5 | Keyword and bid plan | Junaid (junaid-amazon-ads) | ads/keywords.csv, ads/negatives.csv, ads/bids.md | keyword-review, bid-numbers | no | draft |
| 6 | Launch pack for your approval | Junaid (junaid-amazon-ads) | ads/ad-pack.md | pack-complete | yes | draft |
| 7 | Build the campaigns paused | Junaid (junaid-amazon-ads) | ads/build-record.md | none | yes, the plan | publish |
| 8 | Go live | Junaid (junaid-amazon-ads) | ads/launch-record.md | none | yes, the plan | publish |
| 9 | Check after launch | Junaid (junaid-amazon-ads) | ads/verify.md, register.json | launch-verify | no | read |
| 10 | Week 1: alarms only | Junaid (junaid-amazon-ads) | ads/results/week-1.md | none | no | read |
| 11 | Week 2: search term readout | Junaid (junaid-amazon-ads) | ads/results/harvest.md, ads/results/harvest.csv, ads/results/negatives.csv | harvest-numbers, harvest-review | no | draft |
| 12 | Apply the changes you approve | Junaid (junaid-amazon-ads) | ads/results/act.md | none | yes, the plan | publish |
| 13 | Day 30 call | Jared (jared-performance-marketing) | ads/results/readout.md | readout-numbers, readout-review | no | read |
| 14 | Write down what we learned | Callum (callum-reporting) | ads/results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Gather what we know

Collects the facts first: the product and its buyers, price, landed cost and Amazon fees, the stores, Brand Registry status, any running campaigns and their last 60 days of search term, targeting and placement reports, total sales by child ASIN, and anyone else changing the account (an agency, a rules tool, auto-applied recommendations). Writes down the access level and limits for Amazon Ads. Gaps become questions for you.

- **Needs:** context/org-context/ (customers, claims, do's and don'ts); context/goals.json; context/limits.json; context/learnings.md; Amazon Ads reports (read) or their downloads, and the Seller Central Business Report; the task that started this job
- **Makes:** ads/intake.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, the access level and limits are written down, and missing facts are listed as answered questions, not guesses)
- **Done when:** intake.md names the product, stores, costs and fees with their source, Brand Registry status, current campaigns, the access level and limits, and the answered questions.

### 2. Break-even ACOS

Works out profit before ads and the break-even ACOS for each product from your real price, landed cost and every Amazon fee. If profit before ads is thin, it says so before any spend is planned.

- **Needs:** ads/intake.md; your cost sheet and fee report
- **Makes:** ads/break-even.md
- **Checks:** margin-check (break-even ACOS comes from the real price, landed cost and every Amazon fee, with the working shown)
- **Done when:** break-even.md gives each product's price, costs, fees, profit before ads and break-even ACOS, with the working and dates.

### 3. Is the listing ready for ads?

Checks the product is in stock, can win the Featured Offer, and has a complete detail page with honest review routes planned (Request a Review and Vine only, never paid reviews). Ads on a listing that cannot convert only buy expensive lessons, so a failed gate stops the job and names the fix.

- **Needs:** ads/intake.md; Seller Central listing and inventory (read)
- **Makes:** ads/listing-gate.md
- **Done when:** listing-gate.md says ready or not ready for each product, with stock cover, Featured Offer status and the listing gaps.

### 4. Campaign plan and rule card

Writes the structure: an automatic campaign, manual exact and phrase campaigns on core terms, and product targeting on close rivals, named by the account's pattern. Writes the rule card for each product: total launch budget, daily budget, end date, the highest ACOS you accept during launch, the bidding strategy and any top-of-search adjustment, and the exit and stop conditions, all inside your limits.

- **Needs:** ads/break-even.md; ads/listing-gate.md (ready); context/limits.json
- **Makes:** ads/plan.md, ads/rule-card.md
- **Checks:** plan-review (the structure fits the product and budget, budgets and dates are inside your limits, and the rule card was written before launch)
- **Done when:** plan.md lists each campaign with its type, targeting and daily budget in whole units, and rule-card.md gives each product's budget, end date, ACOS ceiling, exit and stop rules.

### 5. Keyword and bid plan

Lists the keywords for each manual campaign with match type and starting bid, the product targets, and the negatives that keep campaigns from bidding against each other, with the source of each keyword (search data, rival listings, Amazon's suggestions, marked as estimates) and the reason for each bid against break-even.

- **Needs:** ads/plan.md; ads/rule-card.md; term-map.csv from the listing job, if there is one
- **Makes:** ads/keywords.csv, ads/negatives.csv, ads/bids.md
- **Checks:** keyword-review (every keyword is relevant to the listing, campaigns do not compete for the same terms, and estimates are marked as estimates); bid-numbers (every bid and break-even figure recomputes from its own inputs)
- **Done when:** Every keyword and target has a match type, a bid and a source, and every bid is at or under the bid the break-even ACOS allows, or the reason is stated.

### 6. Launch pack for your approval

Puts the launch on one page: each campaign, its keywords, targets, negatives and bids, the daily budgets, the total launch budget, the end date and the rule card. Says what you will see each week and what will come to you as a plan.

- **Needs:** ads/plan.md; ads/rule-card.md; ads/keywords.csv; ads/negatives.csv; ads/bids.md
- **Makes:** ads/ad-pack.md
- **Checks:** pack-complete (every campaign, keyword, target, bid, budget and date in the pack matches the plan files, and the rule card is attached)
- **Done when:** ad-pack.md shows every campaign, keyword, target, bid, budget and date with the rule card on one page.
- **You sign off:** You read the pack. Reply yes with the code to send exactly this to the build step. Switching launch spend on is a separate yes at go-live.

### 7. Build the campaigns paused

Shows you a build plan, then on your yes creates the campaigns, ad groups, product ads, keywords, targets and negatives exactly as in the pack, with every campaign paused so nothing spends, and reads them back. The Amazon Ads MCP server (in open beta, which Amazon announced for partners with active Amazon Ads API credentials) can also delete campaigns and see billing, so its delete tools are set to Blocked and billing is never used. Without an API tool or the MCP server, this stage has no plan: Junaid gives you a bulk file, you upload it in the Amazon Ads console with campaigns paused, and he reads it back.

- **Needs:** ads/ad-pack.md (signed off); Amazon Ads at level 2 or 3: the Amazon Ads MCP server, an Ads API tool on your host, or you with a bulk file
- **Makes:** ads/build-record.md
- **Goes live:** Through the Amazon Ads API (Sponsored Products version 3: campaigns, ad groups, product ads, keywords, targets and negative keywords) or the Amazon Ads MCP server, with every campaign state PAUSED in the plan. The exact MCP tool names come from your tool list. No money is spent at this stage.
- **Done when:** build-record.md lists every object with its id and paused state, read back, matching the pack.

### 8. Go live

Shows you the go-live plan: the exact campaigns to switch on, the total new daily budget, the end date and the rule card. On your yes it switches those campaigns on, and only those. If you uploaded a bulk file, you can switch them on yourself and this stage records the time.

- **Needs:** ads/build-record.md
- **Makes:** ads/launch-record.md
- **Goes live:** Through the Amazon Ads API or MCP server: one update step setting state ENABLED on the exact campaign ids. Money starts to be spent from this step.
- **Done when:** The campaigns read back as enabled, and launch-record.md lists their ids, budgets, end date and time live.

### 9. Check after launch

One day after go-live, reads every campaign back: impressions starting, ads not stopped for policy, the product still in stock and holding the Featured Offer, and no campaign out of budget before midday. Records each campaign id in the register. It adds its ads to register.json and never replaces lines another channel wrote.

- **Needs:** ads/launch-record.md; Amazon Ads (read)
- **Makes:** ads/verify.md, register.json
- **Checks:** launch-verify (what is live matches the signed-off pack exactly, and every problem has a cause and a fix)
- **Done when:** Every campaign is delivering or its problem has a cause and a fix, and register.json maps each campaign id to its product and job.

### 10. Week 1: alarms only

Reads spend pace, impressions, clicks and orders, and looks for alarms first: no impressions, out of budget early, a spend spike, a policy stop. Adds no negatives on thin data; Amazon suggests letting the automatic campaign run about two weeks before building on it.

- **Needs:** register.json; Amazon Ads search term and campaign reports (read)
- **Makes:** ads/results/week-1.md
- **Done when:** week-1.md lists each campaign's pace and any alarm with what was done about it.

### 11. Week 2: search term readout

Reads the search term report by product against break-even ACOS. Converting terms at or under target ACOS move to exact match; terms with at least 20 clicks and no orders, or clearly wrong for the product, become negatives; bids move by the rule card. Writes each change as a numbered line with its evidence, marked inside your limits or needs your yes.

- **Needs:** Amazon Ads search term, targeting and placement reports (read); ads/rule-card.md; ads/break-even.md
- **Makes:** ads/results/harvest.md, ads/results/harvest.csv, ads/results/negatives.csv
- **Checks:** harvest-numbers (every ACOS, rate and total in the harvest recomputes from its own inputs); harvest-review (each move follows the agreed rules, no negative blocks a term the listing needs, and no negative added in the last two weeks is touched again)
- **Done when:** harvest.md gives each proposed keyword, negative and bid change with clicks, orders, spend, ACOS and dates.

### 12. Apply the changes you approve

Shows you the change plan from the harvest: the exact keywords to add, negatives to add and bids to change, each within your step limit. On your yes it makes exactly those changes and reads them back. Each week's harvest repeats this with a new plan.

- **Needs:** ads/results/harvest.md; context/limits.json
- **Makes:** ads/results/act.md
- **Goes live:** Through the Amazon Ads API or MCP server: negative keyword creates, keyword creates and bid updates within your step limit, or pauses. Never archives or deletes, never switches on budget rules.
- **Done when:** act.md records each change, the plan code that covered it, and what was read back after.

### 13. Day 30 call

Reads the first 30 days against the rule card: move to growth, extend (with a new yes and budget), fix the listing or price, or stop, quoting ACOS, TACOS and profit after ads per product for the stated dates.

- **Needs:** Amazon Ads reports and the Business Report (read); ads/rule-card.md; context/goals.json
- **Makes:** ads/results/readout.md
- **Checks:** readout-numbers (every rate and total in the readout recomputes from its own inputs); readout-review (each number matches the Amazon Ads and Business Report data for the stated dates, and the call follows the rule card)
- **Done when:** readout.md gives one call per product with the deciding number and the rule it met.

### 14. Write down what we learned

Adds a dated lesson to context/learnings.md: which keyword sources, bids and structures paid back for this kind of product, how sure we are, and what to try on the next launch.

- **Needs:** ads/results/readout.md; ads/results/harvest.md; context/learnings.md
- **Makes:** ads/results/learning.md
- **Checks:** learning-review (the lesson is supported by its evidence, its confidence fits the spend and sample, and the next launch plan can use it)
- **Done when:** learning.md holds one lesson with its evidence and a confidence level, and the same lesson is appended to context/learnings.md.

## Where you step in

- **Launch pack for your approval:** You read the pack. Reply yes with the code to send exactly this to the build step. Switching launch spend on is a separate yes at go-live.
- **Build the campaigns paused:** approve the exact plan of live changes
- **Go live:** approve the exact plan of live changes
- **Apply the changes you approve:** approve the exact plan of live changes

## How we judge it

- Main number: the one you set in context/goals.json, asked first (for most sellers, profit after ad spend per product, read as ACOS against break-even ACOS and as TACOS, ad spend over total sales).
- Guardrails: the launch ACOS ceiling on the rule card, and spend inside the daily and monthly caps.
- Clean launch: what is live matches the approved pack exactly, and every negative and bid change traces to a plan you approved.
