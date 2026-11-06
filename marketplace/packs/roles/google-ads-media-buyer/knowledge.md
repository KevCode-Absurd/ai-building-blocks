# Google Ads media buyer: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. Google changes Google Ads often, so every platform fact below says when it was true. Re-check the items in section 10 before relying on them.

## 1. What this role is for

A small business hires a Google Ads media buyer to win customers from people who are already looking: searching for the product, comparing prices on Shopping, or watching YouTube in the right market. The buyer sets up the campaigns, makes sure conversions are counted correctly, chooses how Google bids, removes wasted spend, writes and tests ads, and tells the owner in plain words what each pound or dollar is doing.

Who hires it: local service firms that live on calls and bookings, online shops with a product feed, B2B and lead-gen firms with long sales cycles, and agencies that need a specialist.

What good work looks like:

- **Conversion tracking you can trust.** Only the actions that matter are primary goals, each counted once, with values, enhanced conversions and consent mode in place, and offline outcomes sent back for lead businesses [21][22][23][24].
- **The right campaign mix for the business.** Search for demand you can name, Shopping or Performance Max for a product feed, Demand Gen for finding new people on YouTube and Discover, and nothing that overlaps for no reason [8][26][28].
- **Bidding that fits the data.** Smart Bidding chosen for the volume and goal the account actually has, with targets set from recent performance [11][12].
- **Clean traffic.** Search terms reviewed on a schedule, negatives managed, brand and non-brand kept apart in reporting [5][6][7].
- **Ads that earn their place.** Several responsive search ads per ad group with distinct, relevant headlines, and landing pages that match [15][16][17].
- **Honest reporting.** Results reconciled with the CRM or shop; brand search judged with care, because much of it would have arrived anyway [29].

How the role is judged: by profitable customers or qualified leads, by the share of spend that reaches the right searches, by stability, and by trust. A good buyer changes budgets, bid targets and live campaigns only within the access and limits the client has granted, gets a fresh yes for anything outside them, and keeps a dated change log.

## 2. The canon

These are the ideas experienced buyers lean on, summarised in my own words and credited.

**Google's Ad Rank, *Ad Rank: Definition* [18].** Whether an ad shows, and where, depends on the bid, the quality of the ad and landing page, minimum thresholds, how competitive the auction is, the context of the search, and the expected impact of assets. Ad Rank is worked out twice in each auction, once for eligibility and once for position. A better ad can beat a higher bid and sometimes pay less. Quality Score (1 to 10) is a diagnostic summary of expected CTR, ad relevance and landing page experience, not an input to the auction and not a goal in itself [17].

**Hal Varian, "Position auctions" (*International Journal of Industrial Organization*, 2007).** Varian, an economist at Google, modelled the search ad auction as a game and found that its equilibrium described the prices seen in Google's auction reasonably well. The practical lesson: you pay for position against the people just below you, so the auction rewards relevance and punishes overbidding on terms you cannot win profitably.

**Tom Blake, Chris Nosko and Steven Tadelis, "Consumer Heterogeneity and Paid Search Effectiveness" (NBER, 2014) [29].** eBay switched off brand keyword ads in a large experiment and saw no measurable short-term loss; non-brand ads mostly moved new and infrequent shoppers, while frequent buyers took most of the spend. The experimental return was a fraction of what normal reporting suggested. Every Google buyer should treat brand search ROAS with suspicion and test it where possible.

**Ron Kohavi, Diane Tang and Ya Xu, *Trustworthy Online Controlled Experiments* (Cambridge University Press, 2020).** Decide the metric and stopping rule first, split fairly, do not stop early on a good day, and distrust surprising wins. Google Ads experiments make splitting easy; reading them well still needs this discipline.

**Les Binet and Peter Field, *The Long and the Short of It* (IPA, 2013).** Brand building and sales activation work on different timescales; budgets that chase short-term metrics alone erode growth. Search mostly harvests demand that brand work and word of mouth created, so a buyer should not claim all of it.

**Google's Meridian (open-source marketing mix model, highlighted in 2025) [10].** A way to estimate channel effects over months without relying on clicks, for businesses spending across several channels.

## 3. How the work is done now

### 3.1 Search: keywords, match types and AI Max (as of November 2026)

Keywords still matter, but matching is broad by design. Broad match (the default) can show ads on searches related to the keyword and may use signals such as the person's recent searches and the landing page; phrase match covers searches that include the keyword's meaning; exact match covers searches with the same meaning or intent [1]. Google says it is critical to pair broad match with Smart Bidding [1].

**AI Max for Search** is not a new campaign type but a set of features switched on inside a Search campaign [2]. It adds search term matching (broad match plus keywordless matching, which can be switched off per ad group), text customisation (Google writes extra headlines and descriptions from your site and ads), final URL expansion (Google picks the landing page), locations of interest, brand inclusions and exclusions, and URL inclusions and exclusions [2]. The search terms report shows an "AI Max" match type and where each match came from [2]. Google warns that AI Max does little in a budget-limited campaign, and that tracking templates using lpurl can break on dynamic landing pages [2]. Brand exclusions for Search began moving into AI Max settings on 27 May 2025 [4], and AI Max opened to all advertisers globally on 10 September 2025, still labelled beta [3].

**Search terms and negatives.** The search terms report shows the real searches that triggered ads; terms with too little volume are withheld for privacy [5]. Negative keywords come in broad, phrase and exact, and unlike positive keywords they do not match close variants: a negative "flowers" will not block "red flower" [6]. Account-level negatives apply to Search and Shopping inventory, including Performance Max [6][7].

**Responsive search ads.** Up to 15 headlines of 30 characters and 4 descriptions of 90 characters; Google mixes them, so each must make sense alone [15]. Google recommends at least two RSAs per ad group rated Good or Excellent [15][16]. Pinning reduces combinations and is not recommended for most advertisers [15][16]. Ad Strength measures variety and keyword use; it is not used in Ad Rank, Quality Score or auction wins [16]. Google's internal data (August 2025) linked moving from Poor to Excellent Ad Strength with about 15% more clicks and conversions on average [15]; treat it as Google's figure, not a guarantee.

### 3.2 Performance Max (as of November 2026)

Performance Max runs one campaign across Search, Shopping, YouTube, Display, Discover, Gmail and Maps toward a conversion goal [8]. You give it asset groups (images, videos, text, logos around a theme), audience signals (hints, not limits), search themes (which have the same priority as phrase and broad keywords), and, for retail, a product feed [8]. Final URL expansion lets Google choose landing pages [8].

Controls added through 2025 [10]: full search terms reporting, asset-level impressions, clicks and cost, channel performance reporting with return columns, campaign-level negative keywords (up to 10,000, Search and Shopping inventory only [7]), search themes raised from 25 to 50 per asset group, device and demographic targeting, and customer acquisition and retention goals. Brand exclusions in Performance Max cover Search, Shopping and YouTube search inventory, with an option to keep Shopping ads on excluded-brand searches [4].

The **channel performance report** (Performance Max and Demand Gen) shows how each channel contributes to goals and flags channels that are not eligible [9]. A channel with no spend and no issue is usually a channel the bidder judged less profitable at that moment, not a fault [9].

### 3.3 Demand Gen (as of November 2026)

Demand Gen reaches people on YouTube (including Shorts), Discover, Gmail, Maps and, increasingly, the Display Network, with image, video and carousel ads, lookalike segments built from your own lists, and conversion or value bidding [26]. Google recommends a daily budget of at least ten times the target CPA when using Target CPA [26]. Google Display campaigns are moving into Demand Gen: a voluntary migration tool arrived in June 2026, with automatic migration to follow [26]. Treat Demand Gen as the place to find new customers, judged on cost per new customer and assisted results rather than last-click alone.

### 3.4 Shopping and Merchant Center (as of November 2026)

Shopping ads use Merchant Center product data, not keywords [28]. The feed is the targeting: titles, descriptions, categories, GTINs and images decide which searches a product can show for. Required attributes include id, title (up to 150 characters), description (up to 5,000), link, image link, availability, price and, for new products, brand; GTIN is strongly recommended when it exists [27]. Price and availability must match the landing page and checkout [27]. From 31 January 2027, product images must be at least 500 by 500 pixels [27]. Performance Max with a feed and Standard Shopping can both serve product ads; choose deliberately and avoid overlap you cannot explain.

### 3.5 Smart Bidding (as of November 2026)

The four main strategies [11][12]:

- **Maximize conversions** and **Maximize conversion value** spend the whole budget to get the most conversions or value, with no target.
- **Target CPA** aims for an average cost per conversion. Individual conversions will cost more or less; set too low, it skips clicks that would have converted [11]. Google suggests a target from the last 30 days' average, and recommends judging performance over at least 30 conversions [11].
- **Target ROAS** aims for an average conversion value per unit of spend (value divided by cost). It needs conversion values, and Google lists minimums such as 15 conversions in 30 days for Search and Shopping [12]. A higher target narrows traffic; changes take one to two conversion cycles to settle [12].

Dated changes:

- From June 2026, "Maximize conversions with a target CPA" and "Maximize conversion value with a target ROAS" are simply called Target CPA and Target ROAS; behaviour is unchanged [11].
- **From 17 August 2026**, budget-limited Target CPA and Target ROAS campaigns deliver closer to the target you set, even if they were beating it before. Google's example: a 10 USD target that was achieving 5 USD now delivers nearer 10 USD [13]. It affects Search, Shopping, Performance Max, Demand Gen, Display, Hotel and Travel, not App or video reach and view campaigns [13]. Google will not change targets for you [13]. If a budget-limited campaign was beating its target, either lower the target to recent performance, raise the budget carefully, or switch to Maximize conversions or value, and allow one to two conversion cycles before judging [13].
- **Smart Bidding Exploration** (opt-in) lets Target ROAS bid on more searches within existing keywords and products at a slightly lower ROAS; Google advises against it for heavily budget-constrained campaigns and suggests turning it on at least six weeks before a peak season [14].

### 3.6 Conversion tracking (as of November 2026)

- **Goals and actions.** Primary conversion actions fill the Conversions column and drive bidding; secondary actions are observe-only, shown in All conversions [24]. Changing which actions are primary can put Smart Bidding into learning for up to seven days [24]. Google Analytics conversions imported into Google Ads start as secondary [24].
- **Attribution.** First click, linear, time decay and position-based models are no longer supported; DDA (Google's default attribution model, built from the account's own conversion paths) and last click remain, and the chosen model affects bidding [25].
- **Enhanced conversions** send hashed (SHA-256) first-party data such as email with conversions, to match more conversions to signed-in Google users [21]. There is a web version for online sales and a leads version for sales that close offline [21].
- **Offline outcomes.** Google now treats enhanced conversions for leads as the main route for offline sales, set up through the Google tag and Data Manager [23]. As stated on Google's help page in November 2026: from April 2026 Google accepts user-provided data from tags, Data Manager and API connections together, web and leads settings are being merged into one switch, and from 15 June 2026 offline conversion and enhanced conversions for leads uploads moved to the Data Manager API and were blocked in the Google Ads API [23]. Keep sending GCLIDs with offline conversions where you have them [23].
- **Consent mode** passes the user's choices to Google tags through four signals: ad_storage, analytics_storage, ad_user_data and ad_personalization [22]. In basic mode, tags wait for consent; in advanced mode, tags load and send cookieless pings while consent is denied, which supports more detailed modelling [22]. The advertiser is responsible for getting consent [22]. In regions that require consent, missing consent signals can limit measurement and audiences; whether the client's banner meets local law is a question for the client's legal adviser.

### 3.7 Budgets and experiments (as of November 2026)

A campaign's daily budget is an average: Google can spend up to twice it on a given day, but caps the monthly charge at 30.4 times the daily figure [19]. For Target ROAS, Google says to be comfortable with spend reaching twice the daily budget on some days [12].

Custom experiments split a campaign's traffic (50/50 is recommended) between the original and a trial version for Search, Display, Demand Gen and Video [20]. The split controls auction eligibility, not equal spend, and Google suggests letting the trial arm settle for 7 to 14 days [20]. Use experiments for bid strategy changes, AI Max, landing pages and broad match, rather than switching settings on the live campaign and comparing before with after.

## 4. Benchmarks and numbers

Use these to frame a conversation, never as a target.

- **LocaliQ, Search Advertising Benchmarks for 2026 (page updated 1 June 2026) [30].** All-industry search averages: 5.42 USD cost per click, 6.64% click-through rate, 8.18% conversion rate, 66.69 USD cost per lead. Caveats: LocaliQ's own sample, method not fully described on the page, US dollars, wide spread by industry (for example 131.63 USD per lead for attorneys and legal services against 26.84 USD for arts and entertainment).
- **Google's own figures:** Ad Strength from Poor to Excellent, about 15% more clicks and conversions; a second RSA in an ad group, about 6.6% more conversions (internal data, August 2025) [15]. Smart Bidding Exploration results are also Google internal data [14]. Useful as reasons to test, not forecasts.
- **Platform thresholds worth remembering:** daily spend up to 2 times budget, monthly cap 30.4 times [19]; Target ROAS minimum 15 conversions in 30 days for Search and Shopping [12]; judge Target CPA on 30 or more conversions [11]; Demand Gen Target CPA budget at least 10 times target [26]; up to 10,000 negatives per Performance Max campaign [10]; up to 50 search themes per asset group [10]; experiments settle in 7 to 14 days [20]; primary goal changes can mean up to 7 days of learning [24].

## 5. Decision rules

- **If** conversion tracking counts anything other than the real outcome as primary (page views, clicks to call that last 2 seconds, duplicate purchase tags), **fix goals before touching bids**, because Smart Bidding chases whatever you call a conversion [24].
- **If** a lead business closes sales offline, **set up enhanced conversions for leads and send qualified and won stages back**, because bidding on raw form fills buys cheap, poor leads [23].
- **If** a campaign has fewer than about 15 conversions a month, **use Maximize conversions (or clicks for a new account) rather than Target ROAS**, because target strategies need data to work [12].
- **If** a budget-limited Target CPA or ROAS campaign was beating its target before 17 August 2026, **reset the target to recent performance or move to Maximize conversions or value**, because the bidder now spends toward the stated target [13].
- **If** you use broad match or AI Max, **use Smart Bidding, strong negatives and weekly search term reviews**, because loose matching without them buys irrelevant traffic [1][2][6].
- **If** a search term is clearly irrelevant, **add a negative at the narrowest level that solves it (exact first)**, because broad negatives can block good traffic and do not catch variants [6].
- **If** brand searches dominate reported conversions, **report brand and non-brand separately and test brand spend**, because much brand traffic would have come anyway [29].
- **If** Performance Max and brand Search both run, **apply brand exclusions in Performance Max or accept and report the overlap**, because otherwise Performance Max can take credit for brand searches [4].
- **If** a Performance Max channel shows no spend and no issue, **leave it unless the business needs that channel**, because the bidder is choosing better returns elsewhere [9].
- **If** Shopping impressions are low for products you stock, **fix the feed (titles, GTINs, categories, images, price match) before raising bids**, because the feed decides eligibility [27][28].
- **If** you want to change bid strategy, try AI Max or switch match types, **run a custom experiment**, because before-and-after comparisons mix in seasonality [20].
- **If** spend is capped by budget and returns are well above target, **propose a budget increase with a forecast**, because a budget-limited campaign cannot buy its profitable traffic [2][13].
- **If** Quality Score components show Below average landing page experience, **fix page speed, relevance and message match**, because it reflects the click experience, not just the ad [17].

## 6. Common mistakes and how to spot them

- **Too many primary conversions.** Goals list page views, scroll depth or all form starts as primary [24].
- **Double-counted purchases.** Google Ads conversions exceed shop orders; two tags or a GA4 import and a Google Ads tag both primary for the same purchase.
- **Brand propping up the account.** Blended ROAS looks fine but non-brand is unprofitable. Split by brand terms.
- **No search term reviews.** Search terms report full of informational or job-seeker queries ("free", "jobs", "how to") [5].
- **Negative lists blocking good traffic.** Broad negatives like "cheap" on a discount retailer.
- **Targets set from hope, not history.** A Target ROAS far above the past 30 days, followed by "Limited" spend [11][12].
- **Constant target changes.** The change history shows target edits every few days; results never settle [12].
- **Pinned everything.** RSAs with every headline pinned, Ad Strength Poor [15][16].
- **Feed neglected.** Disapproved products, missing GTINs, price mismatches [27].
- **Ignoring consent.** EEA or UK traffic with no consent mode, and conversion counts falling after a banner change [22].
- **Judging experiments in the first week** before the trial arm settles [20].

## 7. Quality bar

Before shipping a plan, change list or report, an expert checks:

1. Primary conversions are only real outcomes, counted once, with values; enhanced conversions and consent mode are on where relevant [21][22][24].
2. Each campaign's bid strategy fits its conversion volume and the target comes from recent data [11][12].
3. Budget-limited target campaigns have been reviewed against the August 2026 change [13].
4. Search terms reviewed within the last two weeks; negatives documented by level [5][6].
5. Brand and non-brand reported apart; Performance Max brand overlap understood [4][29].
6. Each ad group has two or more RSAs with distinct headlines; landing pages match the search [15][17].
7. Feed errors and price or availability mismatches are fixed before scaling Shopping [27].
8. Every change has a reason, an expected effect, a review date, a way to undo it, and either the client's yes or a place inside the limits they set for level 3. Every live change is in the change log.

## 8. How this role writes

- **Weekly note:** the answer first (on track, watch, act); a table of spend, conversions, cost per conversion or ROAS, impression share and lost impression share, split by campaign and brand versus non-brand; what changed and why; up to three proposed changes.
- **Audit:** findings ranked by money at stake, each with evidence (export rows, screenshots) and the fix.
- **Search term review:** add as keyword, add as negative (with level and match type), watch; with spend and conversions for each.
- **Change request:** numbered items the client can approve one by one. At level 3 it holds only the changes outside the agreed limits.
- **Experiment plan:** hypothesis, change, split, length, main metric, decision rule.

Tone: plain, precise, never promising results. Always name the conversion action and attribution model behind a number.

## 9. Glossary

- **Ad Rank:** the auction score that decides if and where an ad shows [18].
- **Ad Strength:** a rating of RSA variety and relevance; not used in the auction [16].
- **AI Max for Search:** a set of matching and creative features inside Search campaigns [2].
- **Asset group:** a bundle of creative and signals inside Performance Max [8].
- **Audience signal:** a hint about who converts, given to Performance Max [8].
- **Brand exclusion:** a list that stops a campaign serving on chosen brand searches [4].
- **Conversion cycle:** the usual time from click to conversion for the business.
- **DDA:** Google's default attribution model, which splits credit using your account's own conversion paths [25].
- **Demand Gen:** a campaign type for YouTube, Discover, Gmail, Maps and Display [26].
- **Enhanced conversions:** hashed first-party data sent with conversions to improve matching [21].
- **GCLID:** the Google click ID added to ad clicks, used to tie offline sales back to clicks [23].
- **Impression share:** impressions received divided by impressions you were eligible for; "lost (budget)" and "lost (rank)" show why you missed the rest.
- **Match type:** broad, phrase or exact; controls how closely searches must match a keyword [1].
- **Merchant Center:** Google's tool that holds product data for Shopping and Performance Max [27].
- **Negative keyword:** a term that stops ads showing on searches containing it [6].
- **Primary conversion action:** a conversion used for bidding and the Conversions column [24].
- **Quality Score:** a 1 to 10 keyword diagnostic [17].
- **RSA:** responsive search ad [15].
- **Search term:** the actual words someone searched [5].
- **Search theme:** a keyword-like hint for Performance Max [8].
- **Smart Bidding:** Google's auction-time bidding for conversions or value [11][12].
- **Target CPA / Target ROAS:** bid strategies aiming at an average cost per conversion or return on spend [11][12].

## 10. What changes fast

Re-check at each refresh (this kit is set to review every 30 days; the August 2026 bidding change and Data Manager migration show why):

- AI Max features, status and reporting [2][3].
- Performance Max controls and limits (negatives, search themes, channel reporting) [7][9][10].
- Bid strategy names and behaviour, especially the August 2026 budget-limited change [11][13].
- Conversion upload routes and dates (Data Manager, enhanced conversions for leads) [23].
- Consent mode requirements [22].
- Demand Gen and the Display migration [26].
- Merchant Center specification changes, including the January 2027 image rule [27].
- Benchmarks: LocaliQ updates yearly [30].

Where to check: Google Ads Help (the announcements and "Highlights" pages), the Google Ads and Commerce blog, Merchant Center Help, and the Google tag platform developer docs.
