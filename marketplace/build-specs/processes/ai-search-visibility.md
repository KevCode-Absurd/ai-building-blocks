# AI answer visibility, measured and fixed

A measured answer to how often AI assistants name, link and describe your store correctly for the questions your buyers ask, sampled the same way each time through official APIs, with the site, structured data and product feed checks behind it, a ranked fix plan you choose from, and a re-sample a month later.

**Starts from:** A growth plan task, a monthly search review, you hearing that an AI assistant recommends a competitor, or the month after the last visibility check.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Gather what we know | Rustam (rustam-ai-answers) | intake.md | intake-complete | no | read |
| 2 | Frozen prompt set and cost | Rustam (rustam-ai-answers) | prompt-set.json, cost-estimate.json | prompt-review | yes | draft |
| 3 | Sample the answers through official APIs | Rustam (rustam-ai-answers) | runs/raw.jsonl, spend.json | spend-within-budget, run-log-check | no | draft |
| 4 | Code the answers and count | Rustam (rustam-ai-answers) | coded.csv, baseline.md, numbers.json | baseline-numbers, coding-review | no | draft |
| 5 | Site, structured data and feed checks | Rustam (rustam-ai-answers) | site-checks.md | tech-review | no | read |
| 6 | Ranked fix plan for you to choose from | Rustam (rustam-ai-answers) | fix-plan.md | fix-review | yes | draft |
| 7 | Re-sample after a month | Rustam (rustam-ai-answers) | results/resample-30.md, spend.json | spend-within-budget, resample-numbers, resample-review | no | draft |

## Stage by stage

### 1. Gather what we know

Collects the brand's true facts (name and variants, what it sells, to whom, where, price range, policies), three to five named competitors, and real buyer questions from Search Console queries phrased as questions, site search, support tickets and reviews. It writes down which engines matter in your market and what we can reach: API keys for OpenAI, Google Gemini and Perplexity held in the host's secret store, Search Console, Bing Webmaster Tools, GA4 through the Analytics MCP, and the Shopify connector to read pages and product data. Gaps become questions for you.

- **Needs:** context/org-context/ (brand facts, customers, claims, competitors); context/goals.json; context/learnings.md; the last baseline from this process, if there is one; the task that started this job
- **Makes:** intake.md
- **Checks:** intake-complete (every heading in intake.md is filled from a named source, brand facts carry their source, and missing facts are listed as answered questions, not guesses)
- **Done when:** intake.md lists the true brand facts with sources, the competitors, the question sources, the engines and location to test, the access we have, and the questions you answered.

### 2. Frozen prompt set and cost

Writes 30 to 60 questions the way a real buyer would type them, tagged by buying stage (problem, category, comparison, brand), with about one in ten about the brand itself to test accuracy. Fixes the engines, models, settings, location and runs per question (at least three), and freezes the wording so later rounds compare like with like. Estimates the API cost for the baseline and one re-sample, with the price source and date for each engine.

- **Needs:** intake.md; the last prompt set, if there is one (reuse it unchanged where possible)
- **Makes:** prompt-set.json, cost-estimate.json
- **Checks:** prompt-review (the questions read like real buyers, come from named sources, cover every buying stage, are not leading, and keep last round's wording where a comparison is planned)
- **Costs money:** Sets the API sampling budget for the baseline and the re-sample a month later. Nothing is sampled until you approve it.
- **Done when:** prompt-set.json holds every question with its stage tag, the engines, models, settings and run count, and cost-estimate.json gives a total with the price source and date for each engine.
- **You sign off:** You read the questions, the engines and the cost estimate. Reply yes with the code to approve the set and the budget as written. Sampling stops if it would go over.

### 3. Sample the answers through official APIs

Runs every question the planned number of times on each engine through its official API only: OpenAI with web search, Gemini with Google Search grounding, and Perplexity Sonar. It never scrapes Google Search or drives a logged-in chat app, because automated scraping of Google breaks its spam policies. Each run logs the date, model, settings, the full answer and every cited address. API answers can differ from what a signed-in shopper sees, and the report says so. This runs in a live session, not a scheduled run, because it spends from the approved budget.

- **Needs:** prompt-set.json (approved); cost-estimate.json; API keys in the host's secret store
- **Makes:** runs/raw.jsonl, spend.json
- **Checks:** spend-within-budget (money spent on API sampling (spend.json) is at or under the approved estimate (cost-estimate.json)); run-log-check (every question, engine and run in the plan is in raw.jsonl with date, model and settings, and no row came from scraping or a signed-in app)
- **Costs money:** only inside the budget you approved at prompt-set; it stops before going over.
- **Done when:** raw.jsonl has one row per question, engine and run with date, model, answer and citations, and spend.json records the cost of each engine's calls.

### 4. Code the answers and count

Codes every answer: is the store named, is its site linked or cited, its place in any list, which rivals are named, which sites are cited, the tone, and any wrong fact about the store. Then counts mention share, citation share, rival shares and accuracy by engine and by buying stage, always with run counts, and lists the sites the engines cite most. Adds the platform numbers: Search Console's AI Overview and AI Mode impressions (impressions only), Bing's AI performance report, and AI assistant sessions and orders in GA4.

- **Needs:** runs/raw.jsonl; intake.md (true brand facts); Search Console, Bing Webmaster Tools and GA4 reads for the same weeks
- **Makes:** coded.csv, baseline.md, numbers.json
- **Checks:** baseline-numbers (every share recomputes from its run counts in numbers.json); coding-review (a spot check of at least one in ten coded rows matches the raw answers, and every wrong fact is checked against the true brand facts)
- **Done when:** baseline.md gives each share with its run count by engine and stage, the top cited sites by type, every wrong fact with the engine that said it, and the platform numbers with their limits stated.

### 5. Site, structured data and feed checks

Checks what stands between the store and the answers. Can the AI search crawlers reach the site, and does robots.txt match your choices? Does structured data for Product, Offer, merchant listing and Organization on the key pages match what the page shows? Are the facts the engines need in page text, not only in images or tabs? Are the product feeds healthy in Google Merchant Center and, if you take part, the OpenAI and Perplexity merchant programmes? Google says no special file is needed for its AI features, and llms.txt is only a community proposal, so neither is treated as a fix on its own.

- **Needs:** baseline.md; Shopify connector or CLI (read): theme structured data and product data; Merchant Center diagnostics (read or export); the store's robots.txt and key pages
- **Makes:** site-checks.md
- **Checks:** tech-review (structured data findings match the theme code and the visible page, and each fix can be made in the theme or the product data as written)
- **Done when:** site-checks.md lists, for each key page and feed, what passed and what failed, with the evidence and the fix.

### 6. Ranked fix plan for you to choose from

Sorts every gap by type: crawler access, wrong facts, missing content, missing third-party mentions, or questions where no brand is named. Ranks fixes by the value of the questions affected, the likely effect and the effort, with access and fact errors first because they are cheap and block the rest. Each fix names the job that would do it: titles, copy and structured data go to a search changes job, a new page goes to a landing page job, and third-party sources go on an outreach list that nobody contacts without your yes. Changes to robots.txt or bot rules need their own yes. No fix uses fake reviews, planted posts or hidden text.

- **Needs:** baseline.md; site-checks.md
- **Makes:** fix-plan.md
- **Checks:** fix-review (each fix ties to a measured gap, the order puts access and fact errors first, each names the job that does it, and none uses fake reviews, planted posts or hidden text)
- **Done when:** fix-plan.md lists each fix with its gap type, the questions it affects, effort, the job that does it and how we will measure it, and marks the ones you chose.
- **You sign off:** You pick which fixes to start. Reply yes with the code to start the jobs as listed, or name the ones to drop. Each job then asks for your yes on its own exact changes.

### 7. Re-sample after a month

A month later, runs the same frozen questions on the same engines, models and settings, inside the budget you approved. If a model was retired, it says which replaced it, because that alone can move the numbers. It flags only changes bigger than normal noise: as a rule of thumb, more than about 10 points on 30 or more runs, or the same direction twice. It links each change to fixes that went live in the month. The scheduled run only reminds you this is due; the calls run in a live session. The next month starts a new job with its own estimate and yes.

- **Needs:** prompt-set.json; baseline.md; fix-plan.md; cost-estimate.json
- **Makes:** results/resample-30.md, spend.json
- **Checks:** spend-within-budget (money spent on API sampling (spend.json) is at or under the approved estimate (cost-estimate.json)); resample-numbers (every share and change recomputes from its run counts); resample-review (the same prompts, engines and settings were used as the baseline or each difference is stated, and only moves beyond the noise rule are called changes)
- **Costs money:** only inside the budget you approved at prompt-set; it stops before going over.
- **Done when:** resample-30.md gives each share now against the baseline with run counts, marks which moves are beyond noise, names model changes, and a dated lesson is appended to context/learnings.md.

## Where you step in

- **Frozen prompt set and cost:** You read the questions, the engines and the cost estimate. Reply yes with the code to approve the set and the budget as written. Sampling stops if it would go over.
- **Ranked fix plan for you to choose from:** You pick which fixes to start. Reply yes with the code to start the jobs as listed, or name the ones to drop. Each job then asks for your yes on its own exact changes.

## How we judge it

- Main number from context/goals.json first. For this work it is usually mention share: the share of sampled answers that name the store, by engine, with run counts.
- Citation share (answers that link to the store's site), accuracy (brand answers with no wrong facts), and the top rival's share on the same basis.
- Real-world side: AI Overview and AI Mode impressions from Search Console, AI assistant sessions and orders in GA4.
- Cost: money spent on API sampling, against the estimate you approved.
