# Launch signed-off creative on Snapchat

Signed-off vertical videos or images become Snapchat ads with matching headlines, tracked links, age floors set for the product, and a budget and cap you approved, built paused, switched on only with your yes, then read at day 7 and turned into a lesson.

**Starts from:** A signed-off job from the video ad process (final/final-9x16.mp4) or the image ad process (9:16 files). It keeps the same folder, so the script, files and reviews travel with it.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Headline and call to action | Kelsey (kelsey-snapchat-ads) | snapchat/ad-copy.md, snapchat/utm.md | copy-lint, copy-review, compliance-review | no | draft |
| 2 | Signal check, structure and budget | Kelsey (kelsey-snapchat-ads) | snapchat/structure.md | tracking-review, structure-review | no | read |
| 3 | Ad pack for approval | Kelsey (kelsey-snapchat-ads) | snapchat/ad-pack.md | pack-complete | yes | draft |
| 4 | Build the ads paused | Kelsey (kelsey-snapchat-ads) | snapchat/build-record.md | none | yes, the plan | publish |
| 5 | Go live | Kelsey (kelsey-snapchat-ads) | snapchat/launch-record.md | none | yes, the plan | publish |
| 6 | Check after launch | Kelsey (kelsey-snapchat-ads) | snapchat/verify.md, register.json | launch-verify | no | read |
| 7 | Day 7 readout | Jared (jared-performance-marketing) | snapchat/results/readout.md | numbers-check, readout-review | no | read |
| 8 | Act on the call | Kelsey (kelsey-snapchat-ads) | snapchat/results/act.md | none | yes, the plan | publish |
| 9 | Write down what we learned | Callum (callum-reporting) | snapchat/results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Headline and call to action

Writes the brand name line, headline and call to action for each signed-off creative, built from its script or concept, plus the tracked link for each ad. Gives two or three versions per creative inside the limits Ads Manager shows.

- **Needs:** final/ and final/review.md from the creative job; script.md or image-copy.md; context/org-context/ voice and claims; context/learnings.md
- **Makes:** snapchat/ad-copy.md, snapchat/utm.md
- **Checks:** copy-lint (the copy checker exits 0 (no banned words, no made-up stats, reading level in range)); copy-review (the headline carries the creative's one message, reads in a second, and stays in the brand voice); compliance-review (no Snap ad policy problems, no unproven claims, the age floor fits the product in every country and state reached, and the AI disclosure answer is recorded)
- **Done when:** Each creative has its headline versions, call to action and one tracked link, and every claim is proven.

### 2. Signal check, structure and budget

Checks the Snap Pixel and Conversions API first (purchases once, same event id and order id on both, matching keys hashed), and catalog readiness if Dynamic Ads run. If a check fails it stops and writes the developer spec. Then sets the objective, ad sets, age floors by country and state for the product, daily budget, end date, cap and kill rules (none in the first days, or on days still waiting for late conversions). Snap's API lists a 20 USD minimum campaign daily budget and a minimum of 5 units for each ad set's daily budget.

- **Needs:** snapchat/ad-copy.md; context/limits.json; warehouse views ads_daily and shop_orders_daily; Snap Events Manager diagnostics (read)
- **Makes:** snapchat/structure.md
- **Checks:** tracking-review (purchases fire once on Pixel and Conversions API with the same event id, matching keys are hashed, and the gap to shop orders is stated with dates); structure-review (budgets meet Snap's minimums and stay inside your limits, the kill rules were written before launch, and age floors are set)
- **Done when:** structure.md gives the signal check result, objective, ad sets, age floors, daily budget in whole units, end date, cap and kill rules, each with its reason, inside your limits.

### 3. Ad pack for approval

Puts each ad's file, headline, call to action, link and age floor, plus the structure, budget and dates, on one page in the job folder. Any creator post run as an ad is listed with its Paid Partnership tag and the fee you approved and paid.

- **Needs:** final/; snapchat/ad-copy.md; snapchat/utm.md; snapchat/structure.md
- **Makes:** snapchat/ad-pack.md
- **Checks:** pack-complete (every ad in the pack has a file, copy, link, age floor, budget and dates, and nothing is missing from the signed-off creative job)
- **Done when:** ad-pack.md shows each ad with its file, copy, link, age floor, budget and dates.
- **You sign off:** You check the pack. Reply yes with the code to send exactly this to the build step.

### 4. Build the ads paused

Shows you a build plan, then on your yes uploads the media and creates the campaign, ad sets, creatives and ads exactly as in the pack, with status paused so nothing spends, and reads them back. Snap's own Ads MCP server is read-only in this release, so in Claude it can only read the build back. The build needs a Snap Marketing API tool on your host. Without one, this stage has no plan: Kelsey gives you a build sheet, you build it paused in Ads Manager, and she reads it back.

- **Needs:** snapchat/ad-pack.md (signed off); Snap Marketing API at level 2 or 3 on your host, or you in Ads Manager
- **Makes:** snapchat/build-record.md
- **Goes live:** Through the Snap Marketing API (an OAuth app with the snapchat-marketing-api scope): media upload, then campaign, ad squad, creative and ad create steps with status PAUSED set in every plan, because Snap's examples create ACTIVE objects. No money is spent at this stage.
- **Done when:** build-record.md lists every object with its id and paused status, read back, matching the pack.

### 5. Go live

Shows you the go-live plan: the exact campaign, ad sets and ads to switch on, the daily spend, the start and end dates and the cap. It aims to switch on at least a day before the start date so review can finish. On your yes it switches on those objects, and only those. If you built in Ads Manager, you can switch them on yourself and this stage records the time.

- **Needs:** snapchat/build-record.md
- **Makes:** snapchat/launch-record.md
- **Goes live:** Through the Snap Marketing API: update steps setting status ACTIVE on the exact object ids in the plan. Money starts to be spent from this step.
- **Done when:** The objects read back as active or in review, and launch-record.md lists their ids, budgets, dates and time.

### 6. Check after launch

One day after go-live, reads every ad back through Snap's read-only Ads MCP server or an export: review result, delivery, spend against the cap, purchases arriving and any error. Records each ad id against its creative in the creative register. It adds its ads to register.json and never replaces lines another channel wrote.

- **Needs:** snapchat/launch-record.md; Snapchat Ads MCP server or Ads Manager (read)
- **Makes:** snapchat/verify.md, register.json
- **Checks:** launch-verify (what is live matches the approved plans exactly, and every rejection has a cause and a fix)
- **Done when:** Every ad is approved or its rejection has a cause and a fix, and register.json maps each Snap ad id to its creative and job.

### 7. Day 7 readout

Reads the result against the kill rules and decision rule written before launch: scale, hold or cut for each concept, quoting the deciding number, its date range and attribution window, and the gap between Snap's purchases and shop orders. Leaves out days still waiting for late conversions.

- **Needs:** warehouse views ads_daily and shop_orders_daily; snapchat/structure.md; context/goals.json
- **Makes:** snapchat/results/readout.md
- **Checks:** numbers-check (every rate and total in the readout recomputes from its own inputs); readout-review (each number matches the warehouse for the stated dates, late-conversion days are left out, and the call follows the rule written before launch)
- **Done when:** readout.md gives one call per ad with the deciding number, the rule it met, and the gap to shop orders.

### 8. Act on the call

For scale or cut calls, shows you a plan: the budget step (no bigger than your limit) or the pause. On your yes it makes the change and reads it back. A hold call needs no plan.

- **Needs:** snapchat/results/readout.md; context/limits.json
- **Makes:** snapchat/results/act.md
- **Goes live:** Through the Snap Marketing API: budget changes within your step limit, or status PAUSED. Never deletes.
- **Done when:** act.md records the call, the plan code if there was one, and what was read back after the change.

### 9. Write down what we learned

Adds a dated lesson to context/learnings.md: which concepts, hooks and formats worked on Snapchat, how sure we are, and what to test next. Lessons from too little spend are marked as hunches.

- **Needs:** snapchat/results/readout.md; register.json; context/learnings.md
- **Makes:** snapchat/results/learning.md
- **Checks:** learning-review (the lesson is supported by its evidence, its confidence fits the spend and sample, and a brief writer can use it)
- **Done when:** learning.md holds one lesson with its evidence and a confidence level, and the same lesson is appended to context/learnings.md.

## Where you step in

- **Ad pack for approval:** You check the pack. Reply yes with the code to send exactly this to the build step.
- **Build the ads paused:** approve the exact plan of live changes
- **Go live:** approve the exact plan of live changes
- **Act on the call:** approve the exact plan of live changes

## How we judge it

- Main number: the one you set in context/goals.json, asked first (for most stores, cost per purchase or return on ad spend over 7 days, checked against shop orders).
- Snap numbers: swipe-up rate, engaged views and cost per purchase for each concept.
- Clean launch: what is live matches the approved pack exactly, with the age floor set, and every ad passed Snap's review or a rejection was handled within a day.
