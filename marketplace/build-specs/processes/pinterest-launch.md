# Launch signed-off creative on Pinterest

Signed-off images or videos become Pinterest ads with keyword-led Pin titles and descriptions, tracked links and a budget and cap you approved, built paused, switched on only with your yes, then read at day 7 and day 21 and turned into a lesson.

**Starts from:** A signed-off job from the image ad process (best for Pinterest, which favours tall images) or the video ad process. It keeps the same folder, so the concepts, files and reviews travel with it.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Pin titles, descriptions and keywords | Marnie (marnie-pinterest-ads) | pinterest/pin-copy.md, pinterest/keywords.csv, pinterest/utm.md | copy-lint, compliance-review | no | draft |
| 2 | Setup check, structure and budget | Marnie (marnie-pinterest-ads) | pinterest/structure.md | tracking-review, structure-review | no | read |
| 3 | Ad pack for approval | Marnie (marnie-pinterest-ads) | pinterest/ad-pack.md | pack-complete | yes | draft |
| 4 | Build the campaign paused | Marnie (marnie-pinterest-ads) | pinterest/build-record.md | none | yes, the plan | publish |
| 5 | Go live | Marnie (marnie-pinterest-ads) | pinterest/launch-record.md | none | yes, the plan | publish |
| 6 | Check after launch | Marnie (marnie-pinterest-ads) | pinterest/verify.md, register.json | launch-verify | no | read |
| 7 | Day 7: is it delivering? | Marnie (marnie-pinterest-ads) | pinterest/results/day-7.md | none | no | read |
| 8 | Day 21 readout | Jared (jared-performance-marketing) | pinterest/results/readout.md | numbers-check, readout-review | no | read |
| 9 | Write down what we learned | Callum (callum-reporting) | pinterest/results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Pin titles, descriptions and keywords

Writes the Pin title and description for each signed-off creative from the words people search on Pinterest when they plan (from the keyword and board map), not from ad slogans. Picks the ad group keywords and negatives, and the tracked link for each Pin to the matching product or collection page.

- **Needs:** final/ and final/review.md from the creative job; concepts.md or script.md; context/org-context/ voice and claims; context/learnings.md
- **Makes:** pinterest/pin-copy.md, pinterest/keywords.csv, pinterest/utm.md
- **Checks:** copy-lint (the copy checker exits 0 (no banned words, no made-up stats, no keyword stuffing flags)); compliance-review (no Pinterest ad policy problems, no unproven claims, no restricted wording, and the AI disclosure answer from the creative review is carried over)
- **Done when:** Each creative has its title, description and tracked link, the keyword list has its negatives, and every claim is proven.

### 2. Setup check, structure and budget

Checks the pieces Pinterest ads depend on: the claimed website, the Pinterest tag with checkout events carrying currency and order value, the API for Conversions if you use it, and catalog health for product ads. If tracking fails it stops and writes the developer steps. Then sets the campaign objective, ad groups, targeting, daily budget, end date and the decision rule, inside your money limits.

- **Needs:** pinterest/pin-copy.md; context/limits.json; warehouse views ads_daily and shop_orders_daily; Pinterest Ads Manager conversions page (read)
- **Makes:** pinterest/structure.md
- **Checks:** tracking-review (checkout events fire with currency and value, server events are deduplicated by event id if used, and the gap to shop orders is stated with dates); structure-review (the budget and dates are inside your limits, the objective fits the goal, and the decision rule was written before launch)
- **Done when:** structure.md gives the setup check result, the objective, ad groups, daily budget in whole units, end date and decision rule, each with its reason, inside your limits.

### 3. Ad pack for approval

Puts each Pin's file, title, description, link and keywords, plus the structure, budget and dates, on one page in the job folder.

- **Needs:** final/; pinterest/pin-copy.md; pinterest/keywords.csv; pinterest/structure.md
- **Makes:** pinterest/ad-pack.md
- **Checks:** pack-complete (every Pin in the pack has a file, copy, link, keywords, budget and dates, and nothing is missing from the signed-off creative job)
- **Done when:** ad-pack.md shows each Pin with its file, copy, link, keywords, budget and dates.
- **You sign off:** You check the pack. Reply yes with the code to send exactly this to the build step. A new campaign and its cap always need this yes.

### 4. Build the campaign paused

Shows you a build plan, then on your yes creates the Pins, campaign, ad groups and ads exactly as in the pack, with the campaign status set to paused so nothing spends, and reads them back. Pinterest's own MCP server is announced but open only to a small group of alpha partners, so there is no official Pinterest connector in Claude yet. The build needs a Pinterest API tool on your host. Without one, this stage has no plan: Marnie gives you a build sheet, you build it paused in Ads Manager, and she reads it back.

- **Needs:** pinterest/ad-pack.md (signed off); Pinterest API at level 2 or 3 on your host, or you in Ads Manager
- **Makes:** pinterest/build-record.md
- **Goes live:** Through the Pinterest API v5 with the ads:write and pins:write permissions: Pin, campaign, ad group and ad create steps with campaign status PAUSED set in every plan. Without an API tool, you build it paused in Ads Manager from the build sheet. No money is spent at this stage.
- **Done when:** build-record.md lists every object with its id and paused status, read back, matching the pack.

### 5. Go live

Shows you the go-live plan: the exact campaign to switch on, the daily spend, the end date and the cap. On your yes it switches that campaign on, and only that. If you built it in Ads Manager, you can switch it on yourself and this stage records the time.

- **Needs:** pinterest/build-record.md
- **Makes:** pinterest/launch-record.md
- **Goes live:** Through the Pinterest API v5: one campaign update step setting status ACTIVE on the exact campaign id. Money starts to be spent from this step.
- **Done when:** The campaign reads back as active, and launch-record.md lists the ids, budget, dates and time.

### 6. Check after launch

One day after go-live, reads every ad back: Pinterest's review result (Pinterest says review can take up to 24 hours), delivery, spend against the cap and checkout events arriving. Records each ad id against its creative in the creative register. It adds its ads to register.json and never replaces lines another channel wrote.

- **Needs:** pinterest/launch-record.md; Pinterest Ads Manager (read)
- **Makes:** pinterest/verify.md, register.json
- **Checks:** launch-verify (what is live matches the approved plans exactly, and every rejection has a cause and a fix)
- **Done when:** Every ad is approved or its rejection has a cause and a fix, and register.json maps each Pinterest ad id to its creative and job.

### 7. Day 7: is it delivering?

Reads impressions, outbound clicks, saves and spend against plan. Makes no scale or cut call yet, because Pinterest buyers often buy days or weeks after they save. Drafts a pause plan only for an ad clearly spending with no clicks.

- **Needs:** register.json; warehouse view ads_daily
- **Makes:** pinterest/results/day-7.md
- **Done when:** day-7.md lists each ad's delivery and early signals against plan and any draft fix with its reason.

### 8. Day 21 readout

Reads the result against the decision rule written before launch: keep, change or stop, quoting the deciding number, its date range and attribution window, and the gap between Pinterest's purchases and shop orders from Pinterest.

- **Needs:** warehouse views ads_daily and shop_orders_daily; pinterest/structure.md; context/goals.json
- **Makes:** pinterest/results/readout.md
- **Checks:** numbers-check (every rate and total in the readout recomputes from its own inputs); readout-review (each number matches the warehouse for the stated dates, and the call follows the rule written before launch)
- **Done when:** readout.md gives one call per ad group with the deciding number, the rule it met, and the gap to shop orders.

### 9. Write down what we learned

Adds a dated lesson to context/learnings.md: which concepts, keywords and formats worked on Pinterest, how sure we are, and what to test next. Any change the readout calls for goes to you as a new plan. Lessons from too little spend are marked as hunches.

- **Needs:** pinterest/results/readout.md; register.json; context/learnings.md
- **Makes:** pinterest/results/learning.md
- **Checks:** learning-review (the lesson is supported by its evidence, its confidence fits the spend and sample, and a brief writer can use it)
- **Done when:** learning.md holds one lesson with its evidence and a confidence level, and the same lesson is appended to context/learnings.md.

## Where you step in

- **Ad pack for approval:** You check the pack. Reply yes with the code to send exactly this to the build step. A new campaign and its cap always need this yes.
- **Build the campaign paused:** approve the exact plan of live changes
- **Go live:** approve the exact plan of live changes

## How we judge it

- Main number: the one you set in context/goals.json, asked first (for most stores, cost per purchase or return on ad spend, judged over at least two weeks because Pinterest buyers plan ahead).
- Pin numbers: outbound click rate, saves and cost per outbound click for each creative.
- Clean launch: what is live matches the approved pack exactly, and every ad passed Pinterest's review or a rejection was handled within a day.
