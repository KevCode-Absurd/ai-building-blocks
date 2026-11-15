# Watch results, decide, and learn

Every launched creative is read at day 1, day 3 and day 7 from the warehouse, gets a scale, hold or cut call using the rule you set before launch, and leaves a dated lesson that the next brief must read.

**Starts from:** A launched job from the Meta launch process (or another channel's launch). Same folder, same creative register entry.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Day 1: is it delivering? | Lindsey (lindsey-meta-media-buyer) | results/day-1.md | none | no | read |
| 2 | Day 3: early read | Lindsey (lindsey-meta-media-buyer) | results/day-3.md | none | no | read |
| 3 | Day 7 readout | Jared (jared-performance-marketing) | results/readout.md | numbers-check, readout-review | no | read |
| 4 | Act on the call | Lindsey (lindsey-meta-media-buyer) | results/act.md | none | yes, the plan | publish |
| 5 | Write down what we learned | Callum (callum-reporting) | results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Day 1: is it delivering?

One day after go-live, checks from the warehouse and the connector that every ad passed review and is spending at the planned pace, with no errors. It does not judge results yet; one day of data is noise.

- **Needs:** register.json; warehouse view ads_daily; launch-record.md
- **Makes:** results/day-1.md
- **Done when:** day-1.md lists each ad's review status, spend against plan and any error with its fix.

### 2. Day 3: early read

Gives an early read on hook rate, click-through rate and cost per result against the account's own history. Changes nothing while ad sets are still learning, unless an ad is clearly burning money with no results, in which case it drafts a pause plan for you.

- **Needs:** warehouse views ads_daily and creative_performance
- **Makes:** results/day-3.md
- **Done when:** day-3.md compares each ad with the account's history and says whether anything needs action before day 7.

### 3. Day 7 readout

Reads the result against the decision rule written before launch: scale, hold or cut, quoting the deciding number, its date range and attribution setting. Checks the numbers against shop orders, so a tracking fault is not mistaken for a winner.

- **Needs:** warehouse views creative_performance and shop_orders_daily; context/goals.json; context/experiments.md
- **Makes:** results/readout.md
- **Checks:** numbers-check (every rate and total in the readout recomputes from its own inputs); readout-review (each number matches the warehouse for the stated dates, and the call follows the rule written before launch)
- **Done when:** readout.md gives one call per ad with the deciding number, the rule it met, and the gap between Meta's purchases and shop orders.

### 4. Act on the call

For scale or cut calls, shows you a plan: the budget step (no bigger than your limit) or the pause. On your yes it makes the change and reads it back. A hold call needs no plan; it sets the next check date instead.

- **Needs:** results/readout.md; context/limits.json
- **Makes:** results/act.md
- **Goes live:** Through the Meta ads connector: budget changes within your step limit, or pauses. Never deletes.
- **Done when:** act.md records the call, the plan code if there was one, and what was read back after the change.

### 5. Write down what we learned

Updates the creative register with the final numbers and adds a dated lesson to context/learnings.md: what was tested (angle, hook, format, person, length), what happened, how sure we are, and what to test next. Lessons from too little spend are marked as hunches, not rules. The next intake for any creative must read these.

- **Needs:** results/readout.md; register.json; context/learnings.md
- **Makes:** results/learning.md
- **Checks:** learning-review (the lesson is supported by its evidence, its confidence fits the spend and sample, and it is written so a brief writer can use it)
- **Done when:** learning.md holds one lesson with its evidence (number of ads, spend, dates, metric change) and a confidence level, and the same lesson is appended to context/learnings.md.

## Where you step in

- **Act on the call:** approve the exact plan of live changes

## How we judge it

- Main number from context/goals.json, judged only after the minimum spend and days you set.
- Guardrails from context/goals.json (for example cost per purchase and refund rate).
- Learning quality: the share of new briefs whose winning concept matched a lesson in context/learnings.md.
