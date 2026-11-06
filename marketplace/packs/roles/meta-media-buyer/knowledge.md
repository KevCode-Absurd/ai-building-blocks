# Meta ads media buyer: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. Meta changes its products often, so every platform fact below says when it was true. Re-check the items in section 10 before relying on them.

## 1. What this role is for

A small business hires a Meta ads media buyer to turn ad spend on Facebook, Instagram, Messenger, Threads and Audience Network into customers at a cost the business can afford. The buyer plans the campaigns, keeps the tracking honest, feeds the system good creative, reads the results, and tells the owner plainly what is working, what is not and what to change next.

Who hires it: online shops selling on Shopify or similar, local service firms that want calls and bookings, lead-gen businesses (finance, property, education, B2B), app makers, and agencies that need a second pair of hands.

What good work looks like:

- **Measurement first.** The pixel and Conversions API send the right events, once, with value and enough customer data to match [15][16][17]. A campaign optimised on broken data learns the wrong thing.
- **The real goal, with its value.** Campaigns optimise for what the business wants (a sale, a qualified lead), not the nearest easy count, and send back what each conversion is worth [4].
- **Simple structure.** Few campaigns and ad sets, each with enough budget to get through learning [1][12].
- **A steady supply of different creative.** On Meta today, creative does much of the targeting work. The buyer plans concepts, not just new colours [4][5][6].
- **Disciplined tests.** One question per test, a split audience, a budget and a stop date set in advance [21][28].
- **Honest reporting.** Platform-reported results are a starting point. The buyer checks them against the shop or CRM and, when spend justifies it, runs a lift test to see what the ads actually caused [4][22][27].

How the role is judged: by business results (new customers, cost per acquisition against margin, revenue against total spend, qualified leads), by how stable those results are, and by trust. A good buyer acts only within the access and limits the client has granted, gets a fresh yes for anything outside them, keeps a dated change log, and says when the data cannot answer a question.

## 2. The canon

These are the ideas experienced buyers lean on. Each is summarised in my own words and credited.

**Meta's auction model, *About ad auctions* [3].** Every chance to show an ad triggers an auction. The winner is the ad with the highest total value, which Meta describes as a mix of the advertiser's bid, the estimated chance the person takes the action, and ad quality. Because two of the three parts are about relevance, a better ad can beat a bigger bid. Everything else in this file follows from that.

**Brett Gordon, Florian Zettelmeyer, Neha Bhargava and Dan Chapsky, "A Comparison of Approaches to Advertising Measurement" (*Marketing Science*, 2019) [27].** The authors compared 15 large randomised experiments at Facebook with the non-experimental methods marketers usually use. The common methods often failed to reproduce the true effect, even with rich user data. The lesson for buyers: attribution reports describe what happened near an ad, not what the ad caused. When the stakes are high, randomise.

**Ron Kohavi, Diane Tang and Ya Xu, *Trustworthy Online Controlled Experiments* (Cambridge University Press, 2020) [28].** The working manual for A/B tests. Decide the main metric and the stopping rule before starting, check that the split is fair, avoid peeking and stopping early on a lucky day, and distrust results that look too good. Most creative tests in ad accounts break at least one of these rules.

**Les Binet and Peter Field, *The Long and the Short of It* (IPA, 2013) [29].** From the IPA effectiveness databank, the best long-run results came from roughly 60% brand building and 40% sales activation; the 2018 follow-up found 62:38. Short-term metrics pull budgets toward activation. On Meta that looks like retargeting that reports cheaply but mostly harvests existing demand. The ratio is an average, not a rule.

**Byron Sharp, *How Brands Grow* (Oxford University Press, 2010).** Growth comes mostly from reaching more buyers, including light and new ones, and being easy to think of and buy. On Meta this argues for broad reach and distinctive creative over narrow interest audiences.

**Eugene Schwartz, *Breakthrough Advertising* (1966).** Prospects sit at different levels of awareness, and each level needs a different opening. Creatives written for several levels give Meta's system real choices.

**Meta Marketing Science, Robyn [8].** Meta's open-source marketing mix modelling package. It models carryover and diminishing returns and suggests budget splits, for businesses that need a view beyond clicks.

## 3. How the work is done now

### 3.1 How delivery works (as of October 2026)

Meta describes delivery as a pipeline [4][5][6]. A retrieval system, Andromeda, narrows tens of millions of eligible ads to a few thousand per person (Meta engineering, December 2024 [6]). Ranking models (GEM, Lattice, sequence learning) predict how likely that person is to act on each ad [5], and the auction picks the winner on total value [3]. Meta's October 2026 explainer adds that ad quality covers what happens after the click too, informed by feedback and customer surveys about purchases, delays and surprise charges [4]. Shipping, support and checkout are part of ad performance.

Meta's advice in that post: choose the outcome you actually want, send each conversion's value, pick how results are measured, adopt Advantage+ as a whole, give the system more creative variety, and test incrementality [4].

### 3.2 Campaign setup and Advantage+ (as of November 2026)

Campaigns are built on objectives such as Sales, Leads and App promotion. For Sales, App and Leads, Meta's current setup puts a campaign into an Advantage+ state when three levers are on: a campaign-level budget (Advantage+ campaign budget), Advantage+ audience in at least one ad set, and Advantage+ placements in every ad set [7]. Meta's Advantage+ sales page adds Advantage+ destination to the list for its most advanced optimisation [9]. Unlike the older Advantage+ shopping campaigns, these campaigns can hold more than one ad set [7].

Dated changes worth knowing:

- Meta began moving sales and app campaigns to this streamlined setup in 2025. In the Marketing API, the legacy Advantage+ shopping (ASC) and app (AAC) campaign types can no longer be created from version 25.0 onward, and migrating a legacy campaign puts it back into learning [7].
- The old "existing customer budget cap" is gone. Meta's suggested replacement is two ad sets, one that includes and one that excludes an existing-customer audience, each with its own spend limits [7].
- Advantage+ leads campaigns became available globally on 30 October 2025, and one campaign can now collect leads through both a website and an instant form [10].
- Special Ad Category campaigns may lose some Advantage+ audience features [7].

Meta's own figures claim lower costs for these setups (for example, a 20% lower average cost per result for Advantage+ sales campaigns [9], and 14% lower cost per lead for Advantage+ leads [10]). These are Meta's numbers, not independent tests. Treat them as a reason to test, not as a forecast.

### 3.3 The learning phase (as of November 2026)

A new or significantly edited ad set enters learning while the system works out how to deliver it. Meta says ad sets usually leave learning after about 50 results in the week after the last significant edit; results in learning are less stable and often cost more [1]. If an ad set cannot get there, Ads Manager shows **Learning limited** [1].

Significant edits include any change to targeting, creative or optimisation event, adding a new ad, changing the bid strategy, and pausing for seven days or more. Budget, bid, cost goal and ROAS goal changes count only if they are large; Meta's example treats a jump from 100 to 1,000 USD as likely to reset learning and 100 to 101 USD as not [2]. With a campaign budget, changing the campaign budget or bid strategy can push several ad sets back into learning at once [2].

Simple arithmetic follows from the 50-result guide: to expect about 50 results a week, an ad set needs roughly 50 times its cost per result in weekly spend, which is about seven times the cost per result per day. If the budget cannot support that, combine ad sets or optimise for an earlier event that happens more often (for example, add to cart instead of purchase), knowing it is a weaker signal.

### 3.4 Structure and consolidation (as of November 2026)

Meta's own guidance is to run fewer ads and ad sets: when too many run at once, each delivers less, fewer leave learning, and more budget is spent before optimisation works [12]. Its fixes: combine ad sets with the same goal, report on segments with breakdowns instead of separate ad sets, combine small geographies, use Advantage+ placements instead of one ad set per placement, and put several languages in one ad set [12]. One ad can carry up to ten creative assets [12]. In practice, a common small-account setup is one prospecting sales or leads campaign, sometimes a separate testing campaign, and an existing-customer split only where the business can show it adds value.

### 3.5 Creative as targeting (as of November 2026)

With broad audiences, the creative itself tells the system who an ad is for. Andromeda exists partly to handle a fast-growing pool of creative and to match the right version to each person [5][6], and Meta's October 2026 advice is to supply more creative variety [4]. In practice "variety" means different concepts: a different person, problem, promise, proof or format, not the same image with a new headline. Ten near-copies give the system one idea to test; five distinct concepts give it five.

Advantage+ creative can generate or adjust images, video, text, music and translations, and some enhancements are on by default [14]. Ads made or heavily changed with Meta's generative tools may carry an AI info label, and regulated verticals and Special Ad Categories may not get all generative features [14]. Check enhancements before launch; brand-sensitive clients often want some switched off.

Creative fatigue has a defined status in Ads Manager. For eligible ad sets with one creative, Meta shows **Creative limited** when cost per result is above your past ads but below double, and **Creative fatigue** when it reaches double or more, counting recent exposures of the same image or video across campaigns from the same Page [13]. Meta's suggested fixes are a materially different new ad, a wider audience or Advantage+ creative, and it notes that keeping the original running can still help [13].

### 3.6 Budgets and bid strategies (as of November 2026)

Meta offers four main strategies [11]:

- **Highest volume (or highest value when optimising for value):** spends the budget to get the most results. No cost control; costs rise as cheap opportunities run out.
- **Cost per result goal (cost cap):** aims to keep the average cost near your number. Meta says adherence is not guaranteed and the budget may not fully spend.
- **Bid cap:** a ceiling on what you bid in each auction. Needs more hands-on management and may under-spend; the bid is not the cost you will see.
- **ROAS goal:** a minimum return when optimising for value. It needs purchase values passed back, and a floor set too high leads to under-delivery.

Meta notes that some iOS 14.5+ campaigns with cost cap or ROAS goal must run at least three days [11]. Bid strategy changes restart learning [2].

### 3.7 Signals: pixel, Conversions API and event quality (as of November 2026)

Meta recommends a redundant setup: send the same key events from the browser (pixel) and the server (Conversions API), because the server catches events the browser misses [15]. Then:

- **Deduplicate.** Give the browser and server copies the same event name and the same event ID; Meta keeps one when they arrive within 48 hours [17]. The fallback method using fbp or external_id only works when the browser event arrives first, and duplicates from the same source are not removed [17].
- **Coverage.** Meta asks for an event coverage ratio of about 75% of Conversions API events to pixel events [15].
- **Match quality.** Event match quality is scored out of 10 in Events Manager for web events, and only matched events count for attribution and optimisation [16]. Sending more hashed customer details (email, phone, name, plus IP address, user agent and click IDs) raises it [16]. Get lawful consent before sharing customer data [15].
- **Freshness.** Send events in real time or close to it [15].
- **Required fields.** Website server events need action_source, event_source_url and client_user_agent [16].

Aggregated Event Measurement (AEM), Meta's protocol for measuring conversions from people on iOS 14 and later, has been simplified for web. As shown on Meta's help page on 6 November 2026, advertisers no longer rank eight events per domain, no longer need value sets for value optimisation, no longer have an AEM tab to configure, and no longer need domain verification for event setup (it may still be needed for other reasons) [18]. Conversions API events may still be processed under AEM limits [18].

For lead businesses, Conversions API for CRM sends later stages (qualified lead, sale) back to Meta. As of 30 October 2025, Meta removed the minimum monthly lead volume, simplified setup in Events Manager, and added Zapier and Salesforce routes [10].

### 3.8 Attribution and measurement (as of November 2026)

Meta now offers three attribution models at ad set level: **standard**, **incremental** (optimises for conversions a model predicts were caused by the ad) and **custom** (uses your own attribution logic) [19][20]. Under standard attribution the windows listed are 1-day or 7-day click, 1-day view, and 1-day engage-through, where engage-through covers non-link clicks and, for video, a 5-second play [19]. Results from different models cannot be compared in one table [19].

To learn what ads caused, use experiments:

- **A/B tests** split the audience so no one sees both versions, and should start from a written hypothesis with equal budgets [21]. Meta advises against "testing" by switching ad sets on and off [21].
- **Conversion Lift** holds out a random control group. Its metrics include incremental conversions, a 90% credible interval, cost per incremental conversion (spend divided by incremental conversions) and incrementality share (incremental divided by exposed conversions) [22].
- **Marketing mix modelling** (for example Robyn [8]) gives a channel-level view over months.

### 3.9 Special Ad Categories and policy (as of November 2026)

Ads about housing, employment, financial products and services, and social issues, elections or politics must declare a Special Ad Category [23]. Financial products and services replaced the older credit category and became required for US-based or US-facing financial ads in January 2025 [23]. For housing, employment and financial ads, Meta fixes age at 18 to 65+, blocks gender targeting, requires a radius of at least 15 miles or 25 km (US and Canada) or 15 km (Europe) around a chosen point, blocks location exclusion and ZIP targeting, limits detailed targeting and removes lookalikes [23]. Political and issue ads require authorisation and, since 6 October 2025, are no longer allowed in the EU [23]. This file gives practice, not legal advice; when a client's category is unclear, the client should check with a qualified adviser.

Every ad is reviewed against Meta's Advertising Standards, usually within 24 hours, and appeals go through Account Quality [24]. Advertiser behaviour, not just single ads, can lead to account restrictions [24].

### 3.10 AI agents and Meta ads (as of November 2026)

On 29 April 2026 Meta launched Meta ads AI connectors in open beta: an official ads MCP server and command line tool that connect an AI assistant to an ad account [25]. The server covers reporting, drafts of campaigns and ads, catalogues, signal diagnostics, A/B tests and lift studies, and activity logs [26]. Since 16 July 2026, anyone with full control of a business portfolio can set rules that block AI agents from, for example, creating campaigns or editing budgets above a set amount [25][26]. For a client relationship, those rules are a practical way to hold an agent to the access level and limits the client chose.

## 4. Benchmarks and numbers

Use these to frame a conversation, never as a target. Your client's margin, price and market matter far more.

- **LocaliQ, Facebook Advertising Benchmarks for 2026 (page updated 23 September 2026) [30].** All-industry averages: traffic campaigns 1.93% CTR and 0.60 USD CPC; lead campaigns 2.70% CTR, 1.80 USD CPC, 8.54% conversion rate and 27.39 USD cost per lead. Caveats: these come from LocaliQ's own sample, the page does not fully describe its method, the figures are US dollars, and industry ranges are wide.
- **Meta's own claims** (Advantage+ sales 20% lower cost per result [9]; Advantage+ leads 14% lower cost per lead and 10% lower cost per qualified lead [10]). Meta-reported averages, not independent.
- **Platform thresholds worth remembering:** about 50 results a week to leave learning [1]; a pause of seven days or more counts as a significant edit [2]; dedup window 48 hours [17]; event coverage target about 75% [15]; event match quality out of 10 [16]; fatigue status at double the usual cost per result [13]; up to ten creative assets in one ad [12]; ad review usually within 24 hours [24].

I found no Meta guidance that sets a "good" frequency, CPM or CTR. Judge them against the same account's history and against cost per result.

## 5. Decision rules

- **If** tracking is broken or double-counting, **fix it before changing anything else**, because every other decision depends on the numbers [15][17].
- **If** an ad set cannot reach about 50 results a week, **combine ad sets or optimise for an earlier, more frequent event**, because it will stay unstable in learning [1][12].
- **If** an ad set is in learning, **wait for about 50 results or a full week before judging it**, because early results are not a reliable guide [1].
- **If** you need to change budget on a working ad set, **make moderate steps and batch other edits together**, because large jumps can restart learning [2].
- **If** cost per result rises while frequency climbs and the status shows Creative limited or Creative fatigue, **brief a materially different concept**, because the audience has seen this one too often [13].
- **If** costs rise but frequency is flat and CPM jumped, **look at the market first (season, competition, auction pressure)**, because new creative will not fix an auction-wide price rise.
- **If** CTR is healthy but conversion rate is poor, **check the landing page, offer and checkout**, because the ad is doing its job and the post-click experience also feeds ad quality [4].
- **If** you sell many products with different margins, **pass real values and consider value optimisation or a ROAS goal**, because the system can only chase what you tell it is worth [4][11].
- **If** the client needs a firm cost ceiling, **use a cost per result goal or bid cap and accept lower volume**, because caps trade scale for control and can under-spend [11].
- **If** retargeting or existing-customer ad sets report the best ROAS, **test incrementality before shifting budget to them**, because they often claim sales that would have happened anyway [22][27].
- **If** monthly spend is large enough to measure a lift with confidence, **run a Conversion Lift study at least once a year or after a big strategy change**, because observational reports can mislead [22][27].
- **If** the ad touches housing, jobs, credit or other finance, or politics, **set the Special Ad Category before building audiences**, because the rules limit targeting and wrong setup gets ads rejected [23].
- **If** a client wants to "test" by switching ad sets on and off, **propose a proper A/B test**, because toggling overlaps audiences and gives unreliable answers [21].
- **If** you connect an AI agent to the account, **set ads MCP server rules that match the access level the client grants: block campaign creation and budget edits at levels 1 and 2, and cap budget edits at level 3**, because the server can act, not just read [26].

## 6. Common mistakes and how to spot them

- **Double-counted purchases.** Platform purchases exceed shop orders, or Events Manager shows browser and server copies that are not being merged. Check event IDs and the deduplication view [17].
- **Optimising for a proxy.** Campaigns optimise for link clicks or landing page views while the owner wants sales. Look at the performance goal on each ad set [4].
- **Fragmented structure.** Many ad sets with small budgets and Learning limited labels. Count ad sets per campaign and check delivery status [1][12].
- **Endless tinkering.** The activity log shows edits every day or two and ad sets keep re-entering learning [2].
- **Creative sameness.** The "new" ads share the same opening, person and promise. Group live ads by concept and count the groups.
- **Judging ads in hours.** Ads paused before a few thousand impressions or a day's cycle. Check how long losers ran.
- **Reading view-through as proof.** Most reported conversions come from 1-day view. Break down results by attribution window [19].
- **Retargeting glow.** Warm ad sets show high ROAS but total sales do not move when they pause. Ask for a lift test [22].
- **Mixed attribution models.** Ad sets on standard and incremental models compared in one table [19].
- **Special Ad Category missed.** A mortgage broker or recruiter runs normal targeting until ads are rejected [23].
- **Generative enhancements left on by default** that change brand look or claims. Review Advantage+ creative settings [14].

## 7. Quality bar

Before shipping a plan, a change list or a report, an expert checks:

1. Events: the main conversion fires once per action, with value and currency, from browser and server, deduplicated, with event match quality reviewed [15][16][17].
2. Goal: each ad set optimises for the business outcome or the closest event with enough volume [1][4].
3. Structure: every ad set can plausibly reach about 50 results a week, or there is a stated reason why not [1].
4. Creative: at least three distinct concepts live, each tagged by concept, format and awareness level.
5. Settings: placements, Advantage+ creative enhancements, attribution model and Special Ad Category are deliberate choices, written down [14][19][23].
6. Numbers reconcile: platform results compared with the shop, CRM or analytics for the same dates, with the gap explained.
7. Every change has a reason, an expected effect, a date to review it, and either the client's yes or a place inside the limits they set for level 3. Every live change is in the change log.
8. Claims in ads are true and allowed under Meta's Advertising Standards [24].

## 8. How this role writes

Deliverables are short and decision-led: the owner knows what to approve within five lines.

- **Weekly note:** spend, results, cost per result and return against target, what changed and why, proposals, what I need. Tables over paragraphs; dates and attribution setting stated.
- **Audit:** findings ranked by money at stake, each with evidence (a screenshot or export row), the fix, the effort and the risk.
- **Test plan:** hypothesis, variable, cells, budget per cell, length, main metric, what result means "ship it".
- **Change request:** a numbered list the client can answer "yes 1, 3; no 2". Nothing on it changes until they answer. At level 3 it holds only the changes outside the agreed limits.
- **Creative brief:** concept, audience awareness level, hook for the first three seconds, proof, offer, formats and placements, must-not-say list.

Tone: plain, specific, calm. Say "I don't know yet" and what would tell us. Never promise results. Name the attribution window every time a result is quoted.

## 9. Glossary

- **Ad set:** the level that holds budget (unless campaign budget is on), audience, placements and optimisation event.
- **Advantage+:** Meta's automation suite; a Sales, App or Leads campaign is "Advantage+ on" when campaign budget, audience and placements levers are on [7].
- **AEM:** Aggregated Event Measurement, Meta's privacy protocol for iOS 14+ conversion measurement [18].
- **Andromeda:** Meta's ad retrieval system that shortlists ads per person [6].
- **Attribution window:** the time after a click, view or engagement in which a conversion is credited to an ad [19].
- **Bid cap:** a maximum bid per auction [11].
- **CAPI:** Conversions API, the server-to-server route for sending events to Meta [15].
- **Concept:** one distinct creative idea (person, problem, promise, proof, format); variations sit under it.
- **Conversion Lift:** a randomised test with a hold-out group that measures incremental results [22].
- **Cost per result goal:** Meta's current name for a cost cap [11].
- **CPM:** cost per 1,000 impressions.
- **Creative fatigue:** a delivery status shown when an ad's cost per result has doubled versus your past ads because people have seen it too often [13].
- **CTR:** click-through rate; Meta reports link CTR separately from all clicks.
- **Deduplication:** keeping one copy when the same event arrives from browser and server [17].
- **EMQ:** event match quality, a score out of 10 for how well server events match Meta accounts [16].
- **Frequency:** average times each person saw your ad in the period.
- **Incrementality:** results that would not have happened without the ads [20][22].
- **Learning phase:** the period after launch or a significant edit when delivery is still being worked out [1].
- **MMM:** marketing mix modelling, a statistical model of sales against spend by channel over time [8].
- **ROAS:** return on ad spend, conversion value divided by spend.
- **Significant edit:** a change that sends an ad set back into learning [2].
- **Special Ad Category:** a required label for housing, employment, financial and political ads that limits targeting [23].

## 10. What changes fast

Re-check at every refresh (this kit reviews every 14 days):

- Advantage+ levers and objectives covered [7][9][10].
- Learning phase threshold and significant edits [1][2].
- Attribution models and windows [19][20].
- AEM rules [18]; Conversions API guidance, coverage and EMQ [15][16].
- Special Ad Category rules [23].
- Ads MCP server features and agent rules (beta) [25][26].
- Bid strategy names [11].
- LocaliQ benchmarks, updated yearly [30].
- Meta's delivery explainers [4].

Where to check: Meta Business Help Centre, Meta for Developers docs and changelog, Meta for Business news, and the Transparency Center.
