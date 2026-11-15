# Growth plan for the quarter, with a monthly check

One goal with a date, for example lift conversion 15% in 60 days, turned into a dated plan of ranked plays you signed off, each play opened as a job on the board, then checked every month against the warehouse with a keep, change or stop call.

**Starts from:** The end of store setup, the start of a new quarter, or you naming a new goal. The plan runs about 90 days, with checks at roughly day 30, day 60 and quarter end.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Goal and where we start | Malcolm (malcolm-ecommerce-growth) | intake.md | intake-complete | no | read |
| 2 | Can we trust the numbers? | Radek (radek-unit-economics) | trust-gate.md, trust-numbers.json | trust-numbers, trust-review | no | read |
| 3 | Cash and capacity we can use | Hemant (hemant-store-finance) | preconditions.md | preconditions-review | no | read |
| 4 | Offer plays | Brendan (brendan-offers) | offers.md | offers-review | no | draft |
| 5 | Bigger bets | Barnaby (barnaby-wild-bets) | bets.md | bets-review | no | draft |
| 6 | The dated plan | Malcolm (malcolm-ecommerce-growth) | plan.md, plan.json, plan-numbers.json | plan-numbers, plan-review, plan-readability | yes | draft |
| 7 | Open the jobs on the board | Margaret (margaret-job-orchestrator) | jobs.md | jobs-match-plan | no | draft |
| 8 | Day 30 check | Malcolm (malcolm-ecommerce-growth) | checks/month-1.md, checks/month-1-numbers.json | month-numbers, month-review | yes | read |
| 9 | Day 60 check | Malcolm (malcolm-ecommerce-growth) | checks/month-2.md, checks/month-2-numbers.json | month-numbers, month-review | yes | read |
| 10 | Quarter end: what we learned | Malcolm (malcolm-ecommerce-growth) | quarter-review.md, quarter-numbers.json | quarter-numbers, quarter-review-check | yes | draft |

## Stage by stage

### 1. Goal and where we start

Writes the goal as one number with a date and a baseline from the warehouse, for example conversion rate 1.8% over the last 28 days, target 2.07% by a named day. Reads the Org context, your goals and limits, past lessons and the ledger, and notes what changed recently (a sale, a stockout, a new product). Lists which tools are connected and at which level. A goal with no baseline in the data becomes a question, not a guess.

- **Needs:** context/org-context/ (customers, offers, claims); context/goals.json and context/limits.json; context/learnings.md and context/ledger.md; warehouse views daily_blended, shop_orders_daily and creative_performance (last 90 days); your goal, in your words
- **Makes:** intake.md
- **Checks:** intake-complete (the goal is one number with a date and a baseline from a named source, and missing facts are listed as answered questions, not guesses)
- **Done when:** intake.md states the goal number, its baseline with dates and source, the target date, what changed recently, the access table and any answered questions.

### 2. Can we trust the numbers?

Before any play is ranked, confirms gross profit per purchase and the break-even ad cost per first order from current costs, and checks that shop orders, GA4 and the ad platforms still agree. Gives a verdict: pass, pass with caveats, or fail. On fail, fixing the numbers is the first play and nothing else is ranked.

- **Needs:** intake.md; warehouse views shop_orders_daily and daily_blended; product cost, fee and returns data
- **Makes:** trust-gate.md, trust-numbers.json
- **Checks:** trust-numbers (gross profit per purchase and break-even recompute from their inputs); trust-review (revenue and orders come from the shop, every cost has a source, and the verdict follows the match)
- **Done when:** trust-gate.md gives gross profit per purchase, break-even cost per first order, the tracking match for the last 28 days, and the verdict with its reason.

### 3. Cash and capacity we can use

States how much cash the team can put into ads, stock and tests this quarter without going below your cash floor, month by month, and how many extra orders and tickets the team can handle (from the fulfilment notes in the ledger). A play that breaks either limit waits, however good it looks.

- **Needs:** context/limits.json; the latest cash forecast from monthly numbers; fulfilment capacity notes in context/ledger.md
- **Makes:** preconditions.md
- **Checks:** preconditions-review (the spend room keeps the cash floor in every month and the capacity figure names its source)
- **Done when:** preconditions.md gives the spend room for each month of the quarter and the extra order capacity, each with its source.

### 4. Offer plays

Proposes up to three offers that add value before they cut margin, such as a kit, a bundle, a guarantee or a free shipping line, built from what buyers already pair and what they doubt. Each offer shows profit per order at each discount level, the stock and cash it needs, and the wording with no false was-prices or fake timers. Offers below the profit floor are dropped.

- **Needs:** trust-gate.md; preconditions.md; context/org-context/ customers and claims; orders and discount history, last 12 months
- **Makes:** offers.md
- **Checks:** offers-review (every offer stays above the profit floor at each discount level, uses no false was-price or fake timer, and fits stock and cash)
- **Done when:** offers.md has each offer with its margin math, the test that would prove it (one change, one main number, run length, stop rule), and the consumer pricing rules checked for each market.

### 5. Bigger bets

Lists bold ideas (a new market, format, channel or partnership) and scores each on upside, cost to test, cash at risk and time to learn, with gross profit per purchase setting what upside means. Shapes the top one or two into small tests with a capped budget, a fixed end date, a go number and a kill rule.

- **Needs:** trust-gate.md; preconditions.md; context/learnings.md
- **Makes:** bets.md
- **Checks:** bets-review (each test's cash at risk is capped inside the spend room, and each has an end date, a go number and a kill rule)
- **Done when:** bets.md scores each idea on the four measures and gives the top bets a budget cap, end date, go number and kill rule inside the spend room.

### 6. The dated plan

Ranks every candidate play from offers, bets and the team leads (paid ads, creative, landing pages, email, retention) by gross profit it can add, cash needed, team hours and days to a readable result. Writes one page: the goal, the baseline, the plays in order, and for each play its owner agent, the process it runs as (for example image-ad, video-ad or a landing page job), its start date, pass mark, stop rule and budget by month inside your limits. The checks at day 30, day 60 and quarter end are on the plan with their dates.

- **Needs:** intake.md; trust-gate.md; preconditions.md; offers.md; bets.md
- **Makes:** plan.md, plan.json, plan-numbers.json
- **Checks:** plan-numbers (the monthly budget totals add up and the target recomputes from the baseline); plan-review (the ranking follows gross profit, cash, hours and days to a result, each play has a pass mark and stop rule, and the budget fits your limits); plan-readability (the readability checker exits 0)
- **Done when:** plan.md and plan.json list the same plays, each with owner, process, start date, pass mark, stop rule and monthly budget, and the budget total sits inside the spend room in preconditions.md.
- **You sign off:** You read the plan: the plays, their order, dates, pass marks and budget by month. Reply yes with the code to approve it, or say what to drop or move. Your yes approves the plan only. Every job it opens still asks you to sign off its creative, and every spend, send or publish still needs its own yes.

### 7. Open the jobs on the board

Turns each task in the signed-off plan into a job on the board with node agent/board.mjs new <process> "<title>", and writes each one a spec sheet: the job, the deliverable, who it is for, the inputs, the deadline and acceptance tests that can pass or fail. Each job names this plan as its source, so results flow back to the monthly check. Jobs due later are put on the schedule for their start date.

- **Needs:** plan.json (signed off); processes/ (the processes this store runs)
- **Makes:** jobs.md
- **Checks:** jobs-match-plan (every plan task has exactly one job with a spec sheet whose acceptance tests match the play's pass mark)
- **Done when:** jobs.md lists every task in plan.json with its job id, process, owner agent, start date and spec sheet, and none is missing or added.

### 8. Day 30 check

Reads the warehouse and each job's results (readouts, the creative register, lessons) and compares every play with its pass mark: keep, change or stop, quoting the deciding number, its dates and its source. Shows cash and capacity left, and the goal number against its path to the target. A play judged before its minimum spend and days is marked too early, not a loss.

- **Needs:** plan.json and jobs.md; warehouse views daily_blended, shop_orders_daily and creative_performance; results files of each job, and context/learnings.md; context/goals.json
- **Makes:** checks/month-1.md, checks/month-1-numbers.json
- **Checks:** month-numbers (every rate and total in the check recomputes, and each keep, change or stop label matches its number); month-review (each deciding number matches the warehouse for the stated dates, and each call follows the pass mark written in the plan)
- **Done when:** month-1.md gives one call per play with the deciding number and the rule it met, the goal against target, and cash and capacity left.
- **You sign off:** You read the calls. Reply yes with the code to accept them. Stop calls close their jobs, and change calls go to the orchestrator as new briefs, each needing your sign-offs as usual.

### 9. Day 60 check

The same check one month later: every play against its pass mark with keep, change or stop, and the goal against the target date. If the main play failed its stop mark, says whether to start the backup play and what it needs.

- **Needs:** checks/month-1.md; warehouse views daily_blended, shop_orders_daily and creative_performance; results files of each job
- **Makes:** checks/month-2.md, checks/month-2-numbers.json
- **Checks:** month-numbers (every rate and total in the check recomputes, and each keep, change or stop label matches its number); month-review (each deciding number matches the warehouse for the stated dates, and each call follows the pass mark written in the plan)
- **Done when:** month-2.md gives one call per play with its deciding number, and says whether the goal is on track for its date.
- **You sign off:** You read the calls. Reply yes with the code to accept them.

### 10. Quarter end: what we learned

Writes the quarter review: the goal against the target, what passed, what failed, what was stopped and why, and the money each play made or cost. Adds the dated lessons to context/learnings.md, with plays from too little spend marked as hunches. Ends with the question for next quarter, which becomes the next growth plan's goal.

- **Needs:** plan.md and every month check; warehouse views; context/learnings.md
- **Makes:** quarter-review.md, quarter-numbers.json
- **Checks:** quarter-numbers (the money each play made or cost and the goal result recompute from their inputs); quarter-review-check (each lesson is backed by its evidence, its confidence fits the spend, and next quarter's question follows from what was learned)
- **Done when:** quarter-review.md has the result for the goal and every play with its evidence, the lessons are appended to context/learnings.md, and next quarter's question is written.
- **You sign off:** You read the review and next quarter's question. Reply yes with the code to close the quarter. A new growth plan starts from your next goal.

## Where you step in

- **The dated plan:** You read the plan: the plays, their order, dates, pass marks and budget by month. Reply yes with the code to approve it, or say what to drop or move. Your yes approves the plan only. Every job it opens still asks you to sign off its creative, and every spend, send or publish still needs its own yes.
- **Day 30 check:** You read the calls. Reply yes with the code to accept them. Stop calls close their jobs, and change calls go to the orchestrator as new briefs, each needing your sign-offs as usual.
- **Day 60 check:** You read the calls. Reply yes with the code to accept them.
- **Quarter end: what we learned:** You read the review and next quarter's question. Reply yes with the code to close the quarter. A new growth plan starts from your next goal.

## How we judge it

- Main number from context/goals.json, against the dated target in the plan, judged only after the minimum spend and days you set.
- Guardrails from context/goals.json (for example cost per purchase and refund rate) held for every play.
- Plan health: the share of plays that met their pass mark, and the share of tasks started by their planned date.
