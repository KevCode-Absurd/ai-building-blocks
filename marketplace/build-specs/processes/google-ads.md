# Google Ads campaign, from plan to first lesson

A Search, Shopping or Performance Max campaign built on proven tracking and a clean product feed, with ads and assets you signed off, a budget and end date you approved, built paused, switched on only with your yes, then read at day 3, 7 and 14 and turned into a lesson.

**Starts from:** A growth plan task, you asking for Google Ads, a new product or market, or a signed-off job from the image ad or video ad process when its images or video should also run in Performance Max or Demand Gen. A creative job keeps its folder, so its final files feed the assets stage.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Raymond (raymond-google-ads) | google/intake.md | intake-complete | no | read |
| 2 | Prove conversion tracking first | Raymond (raymond-google-ads) | google/tracking.md | tracking-review | no | read |
| 3 | Check the Merchant Center feed | Raymond (raymond-google-ads) | google/feed-check.md, google/feed-fixes.md | feed-review | no | read |
| 4 | Campaign plan | Raymond (raymond-google-ads) | google/plan.md, google/keywords.csv, google/negatives.csv | plan-review, margin-check | no | draft |
| 5 | Ads and assets | Kofi (kofi-ad-copy) | google/ad-copy.md, google/assets.md, google/utm.md | copy-lint, copy-review, compliance-review | no | draft |
| 6 | Launch pack for your approval | Raymond (raymond-google-ads) | google/launch-pack.md | pack-complete | yes | draft |
| 7 | Build the campaigns paused | Raymond (raymond-google-ads) | google/build-record.md | none | yes, the plan | publish |
| 8 | Go live | Raymond (raymond-google-ads) | google/launch-record.md | none | yes, the plan | publish |
| 9 | Check after launch | Raymond (raymond-google-ads) | google/verify.md, register.json | launch-verify | no | read |
| 10 | Day 3: early read | Raymond (raymond-google-ads) | google/results/day-3.md | none | no | read |
| 11 | Day 7: first week and search terms | Raymond (raymond-google-ads) | google/results/day-7.md, google/results/search-terms.md | numbers-day-7, readout-review | no | read |
| 12 | Day 14 readout | Jared (jared-performance-marketing) | google/results/day-14.md | numbers-day-14, readout-review | no | read |
| 13 | Act on the call | Raymond (raymond-google-ads) | google/results/act.md | none | yes, the plan | publish |
| 14 | Write down what we learned | Callum (callum-reporting) | google/results/learning.md | learning-review | no | draft |

## Stage by stage

### 1. Gather what we know

Collects the facts before any plan: who the buyer is and what they type into Google, the gap we are solving (new demand, competitors taking your brand searches, products with no Shopping presence), the offer and margin, what past campaigns taught us, and where each number comes from. Lists the access that exists today for Google Ads, Merchant Center, Tag Manager and Analytics, and at which level. Anything missing becomes a question for you.

- **Needs:** context/org-context/ (customers, voice, claims, do's and don'ts); context/goals.json; context/limits.json; context/learnings.md; warehouse views ads_daily and shop_orders_daily (last 90 days), or a Google Ads export if the account is not connected; the task that started this job
- **Makes:** google/intake.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, the access level for each Google tool is written down, and missing facts are listed as answered questions, not guesses)
- **Done when:** intake.md names the buyer, the gap, the offer, the break-even cost per sale, the markets and languages, the brand terms, the access level for each Google tool, and the answered questions.

### 2. Prove conversion tracking first

Checks that only real business results (purchases, with values) are primary goals, each is counted once, enhanced conversions are on, and consent mode works for visitors who need it. Compares Google's conversions with shop orders for the same days and asks you to place one real test order. If tracking is broken it stops here and writes the fix for your developer, because a campaign that learns from bad data spends money learning the wrong thing.

- **Needs:** google/intake.md; Google Ads goals summary (read); Tag Manager container (read) or the shop's Google app settings; warehouse view shop_orders_daily
- **Makes:** google/tracking.md
- **Checks:** tracking-review (only purchases with values are primary, each is counted once, the test order was recorded, and the gap to shop orders is stated with dates)
- **Done when:** tracking.md lists each conversion action with primary or secondary, source, count setting and value, the test order result, and the gap between Google conversions and shop orders, with PASS or the fix.

### 3. Check the Merchant Center feed

For Shopping or Performance Max, reads Merchant Center before anything else: account issues, disapproved or limited products, and whether price and stock match the site for the products that sell most. Uses Google's Merchant API MCP server read tools if you connected it (Google lists it as Alpha), or a diagnostics export. Feed fixes become a list for you or your shop app; this stage changes nothing. For a Search-only campaign it records that the feed does not apply.

- **Needs:** google/intake.md; Merchant Center (read) or its diagnostics export; warehouse view products (prices and stock)
- **Makes:** google/feed-check.md, google/feed-fixes.md
- **Checks:** feed-review (the feed problems match Merchant Center for the stated date, top sellers are covered, and every fix names who makes it in the shop or feed app)
- **Done when:** feed-check.md gives the number of approved, limited and disapproved products, the top sellers with problems, and each fix with who makes it, or says the campaign is Search only.

### 4. Campaign plan

Chooses the campaign mix and says why: brand Search reported apart, non-brand Search by buyer intent, and Shopping or Performance Max for products, with one of them owning product traffic and brand exclusions set if brand Search runs. Writes keywords (exact and phrase on proven terms first), an account negatives list, the bid strategy that fits the data the account has, the daily budget, the end date, and the decision rule for day 14. States every setting Google may switch on by default (AI Max, final URL expansion, text customisation, search partners) and the choice for each.

- **Needs:** google/intake.md; google/tracking.md (PASS); google/feed-check.md; context/limits.json; context/experiments.md
- **Makes:** google/plan.md, google/keywords.csv, google/negatives.csv
- **Checks:** plan-review (the campaign mix fits the data and budget, one campaign owns product traffic, budgets and dates are inside your limits, every default setting has a stated choice, and the decision rule was written before launch); margin-check (the break-even cost per sale and target return come from your real margins after fees, shipping and returns, with the working shown)
- **Done when:** plan.md gives each campaign's type, goal, locations, languages, networks, bid strategy, daily budget in whole units, end date, the default settings and the choice for each, and the written decision rule, all inside your limits.

### 5. Ads and assets

Writes responsive search ads for each ad group (up to 15 headlines of 30 characters and 4 descriptions of 90, with paths of 15), sitelinks and callouts, and the text assets for each Performance Max asset group, built from the buyer's own search words and the proof we hold. Picks images and video from signed-off creative jobs, and lists any gap (for example no vertical video) instead of inventing one. Adds the tracked link for each ad.

- **Needs:** google/plan.md; google/keywords.csv; context/org-context/ voice and claims; context/learnings.md; final/ and review.md from a signed-off image ad or video ad job, if Performance Max runs
- **Makes:** google/ad-copy.md, google/assets.md, google/utm.md
- **Checks:** copy-lint (the copy checker exits 0 (no banned words, no made-up stats, every field inside Google's limits)); copy-review (headlines use the buyer's own search words, each ad group's ads match its keywords and landing page, and the voice matches the Org context); compliance-review (no Google Ads policy problems, no unproven claims, no restricted wording for the product category, and no trademark use without the right to it)
- **Done when:** Every ad group has two or more ads, every asset group has its text, images and logo listed, every line is inside Google's limits, and every claim is marked with its proof.

### 6. Launch pack for your approval

Puts the whole launch on one page: each campaign with its type, budget, end date, bid strategy, locations, networks and default settings, the keywords and negatives, every ad and asset, the tracked links, the decision rule, and what you will see at day 3, 7 and 14. Says plainly that Google may spend up to twice the daily budget on a single day but no more than 30.4 times it in a month. Bidding on competitor names, AI Max and final URL expansion are listed as separate yes or no lines.

- **Needs:** google/plan.md; google/keywords.csv; google/negatives.csv; google/ad-copy.md; google/assets.md; google/utm.md
- **Makes:** google/launch-pack.md
- **Checks:** pack-complete (every campaign, ad group, ad and asset in the pack has its budget, dates, settings, link and proof, and nothing differs from the plan and copy files)
- **Done when:** launch-pack.md shows every campaign, ad group, ad, asset, budget, date and setting on one page, with the separate lines for competitor terms, AI Max and final URL expansion answered.
- **You sign off:** You read the pack. Reply yes with the code to send exactly this to the build step, or say what to change. The code stops working if any file changes. A yes here does not switch anything on; that is a separate yes at go-live.

### 7. Build the campaigns paused

Shows you the build plan, then on your yes creates the budget, campaigns, ad groups, keywords, negatives, ads and assets exactly as signed off, with every campaign set to paused, so nothing spends. Every name carries the job tag so later reads can find them. Then reads everything back and checks it against the pack. Google's own Google Ads MCP server cannot create campaigns, budgets, ads or bids (it reads, and creates assets and labels only), so the build needs a Google Ads API tool on your host. Without one, this stage has no plan: Raymond gives you a Google Ads Editor import file, you import it and post it as paused, and he reads it back.

- **Needs:** google/launch-pack.md (signed off); Google Ads at level 2 or 3: an API tool on your host, or Google Ads Editor on your computer
- **Makes:** google/build-record.md
- **Goes live:** Through the Google Ads API under your own Google Cloud project's sign-in (scope adwords): GoogleAdsService mutate steps that create the budget, campaign, ad groups, keywords, negatives, ads and assets, with the campaign status set to PAUSED in the plan, because the API turns a campaign on if the status is left out. Without an API tool, you post the Editor file yourself as paused. No money is spent at this stage.
- **Done when:** build-record.md lists every created object with its id and status PAUSED, read back from the account, and the readback matches the pack line by line.

### 8. Go live

Shows you the go-live plan: the exact campaigns to switch on, the total new daily budget, the end date and the default settings as built. On your yes it switches those campaigns on, and only those. If you posted from Ads Editor, you can switch them on yourself in Google Ads instead, and this stage records the time.

- **Needs:** google/build-record.md; Google Ads at level 3 through an API tool, or you in Google Ads
- **Makes:** google/launch-record.md
- **Goes live:** Through the Google Ads API: one mutate step that sets status ENABLED on the exact campaign resource names in the plan, and nothing else. Money starts to be spent from this step.
- **Done when:** The campaigns read back as enabled, and launch-record.md lists their ids, budgets, end dates and the time they went live.

### 9. Check after launch

One day after go-live, reads every campaign back: ad review status (Google reviews most ads within one business day), spend starting against the plan, conversions recording, and the account's change history, so any change nobody approved shows up. Records each campaign and ad id in the register so results flow back to the right ads and creative. It adds its ads to register.json and never replaces lines another channel wrote.

- **Needs:** google/launch-record.md; Google Ads (read), through the Google Ads MCP server or an export
- **Makes:** google/verify.md, register.json
- **Checks:** launch-verify (what is live matches the signed-off pack exactly, change history shows no unapproved change, and every disapproval has a cause and a fix)
- **Done when:** Every ad is approved or its disapproval has a cause and a fix, spend and conversions are recording, and register.json maps each id to its ad copy and creative job.

### 10. Day 3: early read

Reads impressions, clicks, cost and the first search terms against plan. Changes nothing while the bid strategy is learning, unless a search term is clearly wrong for the store or a campaign is spending with no clicks, in which case it drafts a small fix plan for you.

- **Needs:** register.json; warehouse view ads_daily; search terms report (read)
- **Makes:** google/results/day-3.md
- **Done when:** day-3.md lists each campaign's spend against plan, its bid strategy status, and any draft fix with its reason.

### 11. Day 7: first week and search terms

Reads the first week brand and non-brand apart, checks Google's conversions against shop orders, and sorts the search terms (including Performance Max terms) into new negatives, new keywords and a watch list. Proposes at most three to five changes, spaced so one cause can be read at a time.

- **Needs:** warehouse views ads_daily and shop_orders_daily; search terms report (read); context/goals.json
- **Makes:** google/results/day-7.md, google/results/search-terms.md
- **Checks:** numbers-day-7 (every rate and total in the day 7 read recomputes from its own inputs); readout-review (each number matches the warehouse for the stated dates, brand and non-brand are apart, and the call follows the rule written before launch)
- **Done when:** day-7.md gives the week's numbers with their dates and attribution setting, the gap to shop orders, and a numbered change list marked inside your limits or needs your yes.

### 12. Day 14 readout

Reads the result against the decision rule written in the plan: scale, hold or cut, quoting the deciding number, its date range and attribution setting, and the gap between Google's purchases and shop orders, so a tracking fault is not mistaken for a winner.

- **Needs:** warehouse views ads_daily and shop_orders_daily; google/plan.md (decision rule); context/goals.json
- **Makes:** google/results/day-14.md
- **Checks:** numbers-day-14 (every rate and total in the readout recomputes from its own inputs); readout-review (each number matches the warehouse for the stated dates, brand and non-brand are apart, and the call follows the rule written before launch)
- **Done when:** day-14.md gives one call per campaign with the deciding number, the rule it met, and the gap to shop orders.

### 13. Act on the call

For the agreed changes, shows you a plan: the negatives to add, a budget step no bigger than your limit, or a pause. On your yes it makes exactly those changes and reads them back. A hold call needs no plan; it sets the next check date instead.

- **Needs:** google/results/day-7.md; google/results/day-14.md; context/limits.json
- **Makes:** google/results/act.md
- **Goes live:** Through the Google Ads API: negative keyword adds, budget changes within your step limit, or campaign pauses. Never deletes, never applies Google's recommendations, never changes conversion goals.
- **Done when:** act.md records each change, the plan code that covered it, and what was read back after.

### 14. Write down what we learned

Adds a dated lesson to context/learnings.md: what was tested (campaign type, keywords, message, assets), what happened, how sure we are, and what to try next. Lessons from too little spend are marked as hunches, not rules. The next Google Ads intake and the next creative brief must read it.

- **Needs:** google/results/day-14.md; register.json; context/learnings.md
- **Makes:** google/results/learning.md
- **Checks:** learning-review (the lesson is supported by its evidence, its confidence fits the spend and sample, and a plan or brief writer can use it)
- **Done when:** learning.md holds one lesson with its evidence (spend, dates, conversions, the metric change) and a confidence level, and the same lesson is appended to context/learnings.md.

## Where you step in

- **Launch pack for your approval:** You read the pack. Reply yes with the code to send exactly this to the build step, or say what to change. The code stops working if any file changes. A yes here does not switch anything on; that is a separate yes at go-live.
- **Build the campaigns paused:** approve the exact plan of live changes
- **Go live:** approve the exact plan of live changes
- **Act on the call:** approve the exact plan of live changes

## How we judge it

- Main number: the one you set in context/goals.json, asked first (for most stores, return on ad spend or cost per purchase over 14 days, checked against shop orders).
- Guardrails from context/goals.json, for example cost per purchase and the share of spend on brand searches.
- Clean build: the live campaigns match the signed-off pack exactly (names, budgets, end date, locations, networks, bid strategy, status), and every ad passed Google's review or a disapproval was handled within a day.
