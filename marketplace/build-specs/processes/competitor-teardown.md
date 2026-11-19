# Competitor marketing teardown, from public evidence to agent briefs

One rival's marketing taken apart from public evidence: the growth engine, offers and prices, Meta and Google ads, site, retention, search and positioning, in a cited report in the rival's look, plus one paste-ready brief for each of your agents on what to take and where to win.

**Starts from:** You naming a competitor ("reverse engineer this brand", "what is X doing"), a launch into a category with a known leader, or a monthly re-run to see what changed. Sizing a whole market goes to Shannon instead.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Scope the teardown | Hattie (hattie-competitor-teardown) | scope.md | none | no | read |
| 2 | Collect the public evidence | Hattie (hattie-competitor-teardown) | evidence.json, evidence.md | none | no | read |
| 3 | Sample the Meta ads | Hattie (hattie-competitor-teardown) | meta-1.json | none | no | read |
| 4 | Write the report and the briefs | Hattie (hattie-competitor-teardown) | report.md | evidence-check, fact-review | no | draft |
| 5 | Render the page and hand over the briefs | Hattie (hattie-competitor-teardown) | report.html, handoffs/ | handoff-review | yes | draft |

## Stage by stage

### 1. Scope the teardown

Ask first: personalized to your brand, or general? Then confirm the competitor's store link, the main market and any lane you care about most, in one message. For personalized, read your Org context and collect your own store so every brief fits your products, prices, voice and customers.

- **Needs:** context/org-context/; The competitor's store link and your brief
- **Makes:** scope.md
- **Done when:** The mode, competitor, market, focus and your store context are written down, with defaults stated.

### 2. Collect the public evidence

Run tools/teardown-collect.mjs on the store: catalogue and price ladder, offers, subscriptions, product pages, pixels and apps, sitemaps, Google Ads Transparency, autocomplete, YouTube, the Wayback Machine and Trustpilot. It follows robots.txt; anything blocked becomes an unknown, never a workaround.

- **Needs:** scope.md
- **Makes:** evidence.json, evidence.md
- **Stops and asks when:** The store refuses the collector everywhere, so there is too little public evidence for a teardown (missing input)
- **Done when:** The evidence bundle exists with a scorecard, a lane map and a list of unknowns.

### 3. Sample the Meta ads

Pull a Meta Ad Library sample through your official Meta connector in the fixed order in tools/TEARDOWN.md (brand page per country, hero-product and offer words, stopped ads, partner pages) and add it to the evidence. With no connector, the Meta lane is listed as unknown.

- **Needs:** evidence.json; Your Meta connector (ads_library_search) or your own Ad Library export
- **Makes:** meta-1.json
- **Done when:** The ads are in the evidence with start dates, or the Meta lane is recorded as unknown with the reason.

### 4. Write the report and the briefs

Find the engine and the loop first, then write each lane with every claim cited, inferences labelled and unknowns listed. End with 10 ranked moves and one brief per agent in the lanes that matter, written for the owner's own products in personalized mode or with {placeholders} in general mode. Never put revenue or ad spend down as fact, and never tell an agent to copy the rival's words or images.

- **Needs:** evidence.json
- **Makes:** report.md
- **Checks:** evidence-check (Every citation resolves, claims are cited, no money or quotes are invented and every brief names a real agent.); fact-review (Three numbers re-derived from the evidence match the report, and inferences and unknowns are labelled as such.)
- **Done when:** tools/teardown-report.mjs check passes and the report names the engine in one sentence.

### 5. Render the page and hand over the briefs

Render the report as one page in the competitor's look and split the briefs into one file per agent. Lead with the verdict and the three moves to make this month, then offer to start any brief with its agent.

- **Needs:** report.md
- **Makes:** report.html, handoffs/
- **Checks:** handoff-review (Each brief goes to the right agent for its lane and can be started tomorrow without copying the rival.)
- **Done when:** The page opens at phone width and every brief file names its agent, a number and a deadline.
- **You sign off:** you read the verdict and pick which briefs to start

## Where you step in

- **Render the page and hand over the briefs:** you read the verdict and pick which briefs to start

## How we judge it

- Every claim in the report cites an evidence item, and every unknown is listed with a link to check it.
- Each brief names a real agent, a deliverable with a number and a deadline, and the evidence to read.
