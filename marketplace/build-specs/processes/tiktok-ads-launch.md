# Launch signed-off video on TikTok

Signed-off vertical videos become TikTok ads with matching ad text, tracked links, the AI disclosure set where it applies, and a budget and cap you approved, built switched off, turned on only with your yes, then read at day 3 and day 7 and turned into a lesson.

**Starts from:** A signed-off job from the video ad process whose final cut is 9:16 (final/final-9x16.mp4), or a signed-off creator video with the creator's written agreement. It keeps the same folder, so the script, files and reviews travel with it. Image-only jobs do not come here.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Ad text for each video | Zara (zara-tiktok-ads) | tiktok/ad-copy.md, tiktok/utm.md | copy-lint, copy-review, compliance-review | no | draft |
| 2 | Tracking check, structure and budget | Zara (zara-tiktok-ads) | tiktok/structure.md | tracking-review, structure-review | no | read |
| 3 | Ad pack for approval | Lerato (lerato-creative-producer) | tiktok/ad-pack.md | pack-complete | yes | draft |
| 4 | Build the ads switched off | Zara (zara-tiktok-ads) | tiktok/build-record.md | none | yes, the plan | publish |
| 5 | Go live | Zara (zara-tiktok-ads) | tiktok/launch-record.md | none | yes, the plan | publish |
| 6 | Check after launch | Zara (zara-tiktok-ads) | tiktok/verify.md, register.json | launch-verify | no | read |
| 7 | Day 3: early read | Zara (zara-tiktok-ads) | tiktok/results/day-3.md | none | no | read |
| 8 | Day 7 readout | Jared (jared-performance-marketing) | tiktok/results/readout.md | numbers-check, readout-review | no | read |
| 9 | Act on the call | Zara (zara-tiktok-ads) | tiktok/results/act.md | none | yes, the plan | publish |
| 10 | Write down what we learned | Callum (callum-reporting) | tiktok/results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Ad text for each video

Writes the ad text and call to action for each signed-off video, in the way people talk on TikTok, built from its script, its hook and what past ads taught us. Gives two or three versions per video inside the length TikTok shows in Ads Manager, the tracked link (UTMs) for each ad, and the AI-generated content answer copied from the video's review, so the disclosure label is switched on where the video needs it.

- **Needs:** final/final-9x16.mp4 and final/review.md from the video ad job; script.md; context/org-context/ voice and claims; context/learnings.md
- **Makes:** tiktok/ad-copy.md, tiktok/utm.md
- **Checks:** copy-lint (the copy checker exits 0 (no banned words, no made-up stats, reading level in range)); copy-review (the text carries the video's one message, sounds native to TikTok, and stays in the brand voice); compliance-review (no TikTok ad policy problems, no unproven claims, no restricted wording for the category, the AI disclosure answer is recorded, and any creator post is disclosed as an ad)
- **Done when:** Each video has its text versions, one tracked link and its AI disclosure answer, and every claim is proven.

### 2. Tracking check, structure and budget

Checks the TikTok Pixel and Events API first: purchases firing once with values, deduplicated by event id, and only after consent where your banner asks for it. If tracking fails it stops and writes the fix for your developer. Then decides Smart+ or a manual campaign, the test of three to five named hooks, the daily budget, the end date, the spend cap and the kill rules (no calls before the agreed spend or days), using the account's history and your money limits.

- **Needs:** tiktok/ad-copy.md; context/limits.json; warehouse views ads_daily and shop_orders_daily; Events Manager diagnostics (read); context/experiments.md
- **Makes:** tiktok/structure.md
- **Checks:** tracking-review (purchases fire once with values, deduplication by event id works, consent is respected, and the gap to shop orders is stated with dates); structure-review (budgets are inside your limits, the test can reach the agreed spend per hook before any kill call, and the kill rules were written before launch)
- **Done when:** structure.md gives the tracking result, the campaign type, the hooks under test, the daily budget in whole units, the end date, the cap and the kill rules, each with its reason, inside your limits.

### 3. Ad pack for approval

Puts the videos, ad text, links, AI disclosure answers and the structure into one ad pack page in the job folder, copied to your shared Drive folder if you connected one. Any creator video shown as a Spark Ad is listed with the creator's agreement and the fee you approved and paid. If you work with a client, this is the pack they approve.

- **Needs:** final/final-9x16.mp4; tiktok/ad-copy.md; tiktok/utm.md; tiktok/structure.md
- **Makes:** tiktok/ad-pack.md
- **Checks:** pack-complete (every ad in the pack has a video, text, link, AI disclosure, budget and dates, and nothing is missing from the signed-off video job)
- **Done when:** ad-pack.md shows each ad with its video, text, link, AI disclosure, budget and dates on one page.
- **You sign off:** You (or your client, through you) check the pack. Reply yes with the code to send it to the build step. A chat thumbs-up alone does not count; the yes must come from you in Claude, or on the approval page when hosted.

### 4. Build the ads switched off

Shows you a build plan, then on your yes uploads the videos and creates the campaign, ad groups and ads exactly as in the pack, with every create step set to switched off, so nothing spends. TikTok's own default is switched on, so the plan always sets it. Every name carries the job tag. Then reads each object back and records its id.

- **Needs:** tiktok/ad-pack.md (signed off); TikTok for Business connector at level 2 or 3
- **Makes:** tiktok/build-record.md
- **Goes live:** Through TikTok's official TikTok for Business MCP server (listed in Claude's connector directory) or the TikTok Business API: video uploads, then campaign, ad group and ad create steps with operation_status DISABLE, and the AI-generated content label on the ads that need it. The exact tool names come from your tool list. No money is spent at this stage.
- **Done when:** Every step of the build plan ran once and was read back as switched off, and build-record.md lists each object's id.

### 5. Go live

Shows you the go-live plan: the exact campaign, ad groups and ads to switch on, the total new daily spend, the end date and the cap. On your yes it switches them on, and only those.

- **Needs:** tiktok/build-record.md; TikTok for Business connector at level 3
- **Makes:** tiktok/launch-record.md
- **Goes live:** Through the TikTok for Business connector or the Business API: status update steps to ENABLE on the exact object ids in the plan. Money starts to be spent from this step.
- **Done when:** The objects read back as switched on or in review, and launch-record.md lists their ids, budgets, dates and the time.

### 6. Check after launch

One day after go-live, reads every ad back: TikTok's review result (TikTok says review takes about 24 hours), delivery, spend against the cap, Pixel purchases arriving, and any error. Records each ad id against its video in the creative register, so results flow back to the right script and hook. It adds its ads to register.json and never replaces lines another channel wrote.

- **Needs:** tiktok/launch-record.md; TikTok for Business connector (read)
- **Makes:** tiktok/verify.md, register.json
- **Checks:** launch-verify (what is live matches the approved plans exactly, and every rejection has a cause and a fix)
- **Done when:** Every ad is approved or its rejection has a cause and a fix, and register.json maps each TikTok ad id to its video and job.

### 7. Day 3: early read

Gives an early read on view rates, watch time, click-through rate and cost per result for each hook, against the account's own history. Makes no kill-rule call before the agreed spend or days. If an ad is clearly burning money with no results, it drafts a pause plan for you.

- **Needs:** register.json; warehouse view ads_daily
- **Makes:** tiktok/results/day-3.md
- **Done when:** day-3.md compares each hook with the account's history and says whether anything needs action before day 7.

### 8. Day 7 readout

Reads the result against the kill rules and decision rule written before launch: scale, hold or cut for each hook, quoting the deciding number, its date range and attribution setting, and the gap between TikTok's purchases and shop orders.

- **Needs:** warehouse views ads_daily and shop_orders_daily; tiktok/structure.md; context/goals.json
- **Makes:** tiktok/results/readout.md
- **Checks:** numbers-check (every rate and total in the readout recomputes from its own inputs); readout-review (each number matches the warehouse for the stated dates, and the call follows the rule written before launch)
- **Done when:** readout.md gives one call per ad with the deciding number, the rule it met, and the gap to shop orders.

### 9. Act on the call

For scale or cut calls, shows you a plan: the budget step (no bigger than your limit) or the pause. On your yes it makes the change and reads it back. A hold call needs no plan; it sets the next check date instead.

- **Needs:** tiktok/results/readout.md; context/limits.json
- **Makes:** tiktok/results/act.md
- **Goes live:** Through the TikTok for Business connector or the Business API: budget changes within your step limit, or status DISABLE to pause. Never deletes.
- **Done when:** act.md records the call, the plan code if there was one, and what was read back after the change.

### 10. Write down what we learned

Updates the creative register with the final numbers and adds a dated lesson to context/learnings.md: which hook, person, length and format won on TikTok, how sure we are, and what to test next. Lessons from too little spend are marked as hunches. The next video brief must read it.

- **Needs:** tiktok/results/readout.md; register.json; context/learnings.md
- **Makes:** tiktok/results/learning.md
- **Checks:** learning-review (the lesson is supported by its evidence, its confidence fits the spend and sample, and a brief writer can use it)
- **Done when:** learning.md holds one lesson with its evidence (number of ads, spend, dates, metric change) and a confidence level, and the same lesson is appended to context/learnings.md.

## Where you step in

- **Ad pack for approval:** You (or your client, through you) check the pack. Reply yes with the code to send it to the build step. A chat thumbs-up alone does not count; the yes must come from you in Claude, or on the approval page when hosted.
- **Build the ads switched off:** approve the exact plan of live changes
- **Go live:** approve the exact plan of live changes
- **Act on the call:** approve the exact plan of live changes

## How we judge it

- Main number: the one you set in context/goals.json, asked first (for most stores, cost per purchase or return on ad spend over 7 days, checked against shop orders).
- Video numbers: 2-second and 6-second view rates, average watch time, and click-through rate for each hook.
- Clean launch: what is live matches the approved pack exactly, and every ad passed TikTok's review or a rejection was handled within a day.
