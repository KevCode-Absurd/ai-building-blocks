# Marketing analyst: what the role knows

Checked 6 November 2026. Every platform fact carries its date and a source number [n] from `sources.json`. Platforms change often, so the facts in section 10 are re-checked every 30 days. This is analytics practice, not legal advice: consent and privacy rules are flagged and pointed to official guidance, never ruled on.

## 1. What this role is for

**Who hires me.** Online shops, service firms and software teams spending on two to five channels. The person asking is usually the owner, a marketing lead or an agency's client contact. Common starting points: GA4 shows page views but no sales; every ad platform claims the same sale; the agency's report and GA4 disagree; nobody has time to read the dashboards.

**The three jobs.**
1. **Measurement.** Make sure the actions that matter (purchases, booked calls, forms, sign-ups) are recorded once, named one way, and tagged with where the visit came from.
2. **Attribution and incrementality.** Explain how each tool hands out credit, why the totals disagree, and which number to use for which decision. Where a channel's value is in doubt, design a test that measures what it added, then read it honestly.
3. **Reporting.** One short report, with each number defined once, that says what moved, the likely reason and what to do next.

**What good work looks like.**
- A tracking plan a developer can build from without a meeting, with a test for every event.
- Totals that reconcile to the backend (orders, bookings, billing), with the gap explained.
- Every claim labelled as one of three things: counted, credited by a model, or measured by a test.
- Recommendations sized to the evidence: "likely" when cause is not proven, a range instead of a point.

**How the work is judged.** Do the numbers tie out? Did a budget, channel or creative decision change because of the work? Did a test reach a clear keep, cut or retest call? Does the owner understand the report without a call?

**What I never do.** Promise a return on ad spend. Collect names, emails or phone numbers in analytics. Track people across sites without their agreement. Give legal advice on cookies or consent. Change settings beyond the access level the client granted.

## 2. The canon

Each idea is summarised in my own words and credited. None of these authors has reviewed or endorsed AI Blocks.

**Randall Lewis and Justin Rao, "The Unfavorable Economics of Measuring the Returns to Advertising" (*Quarterly Journal of Economics*, 2015) [22].** Across 25 large field experiments with US retailers and brokerages, individual sales were so noisy next to the cost of the ads that even huge tests gave wide answers. A coefficient of variation of about 10 in individual sales was common, informative tests could need more than 10 million person-weeks, and the median confidence interval on return was over 100 percentage points wide. The lesson for a small business: a test sized by hope will not settle a question. Plan for big, clear effects, test at the geo level, or accept a wide range.

**Brett Gordon, Robert Moakler and Florian Zettelmeyer, "Close Enough?" (2022) [23].** Using 663 randomised experiments at Facebook (now Meta) and more than 5,000 user features, they tried to recover each experiment's lift with two flexible observational methods. Neither came close reliably: median true lifts of 29%, 18% and 5% (upper, middle and lower funnel) were estimated at 83%, 58% and 24% by one method and 173%, 176% and 64% by the other. Rich data and machine learning do not turn correlation into cause.

**David Chan, Yuan Yuan, Jim Koehler and Deepak Kumar, search ads pause studies (Google, 2011) [19].** Over 400 studies watched organic clicks while advertisers paused search ads. On average, 89% of paid clicks were not replaced by organic clicks. Read it as Google's own modelled average across verticals, from 2011. It does not tell you what your brand-name ads add.

**Jon Vaver and Jim Koehler, geo experiments (Google, 2011) [20].** Split non-overlapping regions at random into test and control, change advertising only in the test regions, and compare. Simple to explain, and it works when users cannot be split.

**Kay Brodersen and colleagues, CausalImpact (*Annals of Applied Statistics*, 2015) [21].** When you cannot randomise, build the "what would have happened" line from control time series that the change did not touch, then compare it with what happened. The method and its R package are the standard way to read a single market or a before-and-after change with an honest range.

**Synthetic control and GeoLift [28].** A synthetic control builds a weighted mix of untreated regions that tracks the test region before the change. Meta Open Source publishes GeoLift, an R package that uses synthetic control methods to choose test markets with power calculations and to read the lift.

**Yuxue Jin, Yueqing Wang, Yunting Sun, David Chan and Jim Koehler, Bayesian media mix models (Google, 2017) [24].** Advertising works with a delay (carryover) and with diminishing returns (shape). They model both and use Bayesian priors so earlier knowledge can inform the estimate. Two warnings from the paper: with small samples the priors drive the answer and can bias it, and the "best" budget split is itself very uncertain.

**The open-source mix models.** Google's Meridian [25][26], Meta's Robyn [27] and PyMC Labs' PyMC-Marketing [29] put these ideas into free tools (details in 3.6).

**Reading list (credited, no figures quoted from them).** Avinash Kaushik, *Web Analytics 2.0* (2009). Simon Broadbent, who introduced "adstock" (1979). Alberto Abadie and colleagues on synthetic control. Lloyd Shapley's value from game theory (1953), behind many credit-sharing models. Ron Kohavi, Diane Tang and Ya Xu, *Trustworthy Online Controlled Experiments* (2020). Cole Nussbaumer Knaflic, *Storytelling with Data* (2015).

## 3. How the work is done now

### 3.1 The GA4 model (as of November 2026)

- **Events and key events.** Everything in GA4 is an event. Events that matter to the business are marked as **key events**; a Google Ads conversion is created from a key event and shared back to Analytics [4].
- **Consent control.** From 15 June 2026, Consent Mode (in Google Ads) is the single control for whether the Analytics tag collects Google Ads cookies and identifiers; before that date, Google signals also played a part [4]. Keep this date in mind when comparing periods across it.
- **Retention.** Standard properties keep user- and event-level data for 2 or 14 months. The setting affects explorations and funnel reports, not the standard aggregated reports [10]. Set 14 months on day one.
- **Raw data.** The BigQuery export sends raw, unsampled events. Standard properties have a daily export limit of 1 million events; the streaming export is best-effort; daily tables can still change for up to two days, so attribution work should use the daily tables [11]. The free BigQuery sandbox works for small sites; beyond its limits Google charges [11].
- **Dashboards.** Looker Studio was renamed **Data Studio** on 11 April 2026, with a free edition and a paid Data Studio Pro; existing reports moved over with no action [18].

### 3.2 The tracking plan

A tracking plan is a table: event name, what triggers it, parameters with example values, where it fires (platform setting, Google Tag Manager, site code or server), whether it is a key event, who builds it, and how to test it.

- **Names.** Event names are case sensitive, must start with a letter and may use only letters, numbers and underscores; some names and prefixes are reserved [1]. Event names and parameter names are limited to 40 characters, parameter values to 100 (with longer limits for page title, referrer and location), and an event can carry 25 parameters [2]. A key event whose name is over 40 characters is not reported as a key event [2]. My convention: lowercase snake_case.
- **Recommended events first.** Google lists recommended events for online sales (view_item, add_to_cart, begin_checkout, purchase, refund and others) and for lead generation (generate_lead, qualify_lead, working_lead, disqualify_lead, close_convert_lead, close_unconvert_lead) [3]. A purchase needs a unique transaction_id (it guards against duplicates), a value that excludes shipping and tax, a three-letter currency code whenever value is set, and an items array [3]. Use custom names only when nothing fits.
- **Lead businesses.** The lead events let a service firm follow a lead from form fill to closed deal [3]. The later stages usually live in the CRM, so plan how they get back into analytics or into the report.
- **No personal data.** I never put names, emails, phone numbers or free text that might hold them into event parameters, page URLs or UTM values.
- **Testing.** Every event gets a test line: the action to take, where to look (GA4 DebugView, Tag Assistant or the platform's test tool) and what should appear, once.

### 3.3 Campaign tags and channel grouping

- **UTM rules.** Always set utm_source, utm_medium and utm_campaign; Google also recommends utm_id and utm_source_platform. Values are case sensitive, so "Google" and "google" are different sources; Google recommends lowercase. Missing values show as "(not set)" [5]. utm_creative_format and utm_marketing_tactic are accepted but not currently reported [5].
- **Medium decides the channel.** GA4's default channel group sorts traffic by rules on source and medium. Paid channels need a medium matching the pattern `^(.*cp.*|ppc|retargeting|paid.*)$`; Email matches "email", "e-mail", "e_mail" or "e mail" in source or medium; Referral is medium "referral", "app" or "link"; Affiliates is medium "affiliate"; anything that matches nothing lands in **Unassigned** [6]. So "utm_medium=facebook" is a bug: it fits no channel.
- **AI assistants.** GA4's default channel group includes an AI Assistant channel for traffic from listed assistant sites (medium "ai-assistant"); Google's own AI Overviews and AI Mode are excluded from it [6].
- **Payment and login domains.** Visits back from a payment provider can steal credit for a sale. List them as unwanted referrals (up to 50 per web stream, Editor role needed); GA4 already ignores your own domains and properly linked cross-domain visits [7].

### 3.4 Attribution: who gets credit

- **GA4 models.** GA4 offers data-driven attribution, paid and organic last click, and Google paid channels last click. First click, linear, time decay and position-based were removed in November 2023 [8]. Google describes data-driven attribution as comparing the key event rate of people exposed to an ad with similar people who were not, and giving credit by the change each touch makes [8]. All models ignore direct visits unless the whole path is direct [8].
- **Settings that move the numbers.** Changing the reporting model rewrites history as well as the future. The lookback window is 30 days by default for first visits and first opens (7 is the other choice) and 90 days for other key events (30 or 60 are the other choices); window changes apply only going forward [9]. GA4 reports default to paid and organic channels, Google Ads reports to Google paid channels [9].
- **Why Google Ads and GA4 disagree.** Google lists the causes: Google Ads reports conversions on the date of the ad interaction, not the date of the sale; data takes 24 to 48 hours to sync, longer after big changes; conversions can arrive up to 90 days after a click; lookback windows and count settings (every or one) differ; primary and secondary actions; modelled cross-device conversions; view-through conversions kept out of the main column; invalid traffic removed later; and Google Ads counting only its own interactions [15].
- **Every platform marks its own homework.** Each ad platform credits conversions under its own attribution setting, often including people who only saw an ad. Add the platforms together and the total is usually higher than the real number of orders. The backend total is the one that must reconcile.
- **Blended numbers for the total budget.** Marketing efficiency ratio (MER), revenue from the backend divided by total marketing spend, does not depend on any tool's credit rules. It answers "is marketing as a whole paying?", not "which channel?".
- **Ask the customer.** A "How did you hear about us?" question at checkout or booking catches word of mouth, podcasts and AI assistants that click tracking misses. Treat it as a separate signal, not a correction factor.

**Which number for which decision.** Total budget: backend revenue and MER. Split between channels: GA4 model-based credit as a starting point, corrected by lift tests where money is at stake. Creative and audience choices inside one platform: that platform's own reports, because the comparison is like for like. Keep or cut a channel: a test.

### 3.5 Incrementality: what a channel added

Attribution shares credit among touches; incrementality asks what would have happened without the ad. Correlation-based methods can be far off, even with rich data [23]. Methods, from simplest to hardest:

1. **Geo holdout.** Pause or cut a channel in some regions and keep it running in matched others; compare the change in the test regions with the change in control regions over the same weeks [20]. Randomise which regions are held out when you can.
2. **Synthetic control.** When few regions exist, weight several untreated regions to track the test region before the change, then read the gap during the test [28].
3. **Platform lift studies.** Google Ads Conversion Lift splits people (user-based) or regions (geography-based) into treatment and control and reports incremental conversions, incremental return and cost per incremental action; it is not available for every account [16]. Meta's ads MCP server includes tools to create conversion lift studies and read their results [17]. The platform runs the test, so read the method notes and keep the backend check.
4. **Time-series counterfactual.** For a change you could not randomise, such as a TV burst or a price change, CausalImpact estimates the "without" line from control series the change did not affect [21].

**The power problem.** Sales are noisy and ad effects are small, which makes tests expensive [22]. Before launching, write down the smallest lift worth knowing, check the weekly noise in past sales for the chosen regions, and say plainly if the test can only catch a large effect.

### 3.6 Media mix models

A media mix model (MMM) explains weekly sales with spend or exposure by channel, plus price, promotions, seasonality and trend, allowing for carryover and diminishing returns [24].

- **Robyn (Meta, open source) [27].** Its analyst guide asks for at least two years of weekly data (four to five years if only monthly), suggests about one input variable per ten observations, prefers exposure metrics (impressions) over spend, and uses geometric or Weibull adstock with Hill saturation, ridge regression and a search that balances fit against business sense. It gives starting ranges for geometric adstock: TV 0.3 to 0.8, outdoor, print and radio 0.1 to 0.4, digital 0 to 0.3. The analyst, not the software, picks the final model, and Robyn recommends calibrating with lift tests [27].
- **Meridian (Google, open source) [25][26].** A Bayesian model built for causal estimates, able to use region-level data and reach and frequency, with controls such as search query volume for brand interest. Experiment results can be turned into ROI priors with its calibration tools [26]. Google warns that the model's "without" case is zero spend, so a test that only cut spend does not map directly, and asks you to compare prior and posterior to see whether the data or the prior is talking [26].
- **PyMC-Marketing (PyMC Labs, Apache-2.0) [29].** A Python library with MMM (adstock, saturation, lift-test calibration, budget optimisation) and customer lifetime value models.

**Who needs one.** Most small businesses do not have two years of weekly data with enough variation in spend. For them, a clean weekly scorecard plus a lift test on the biggest doubtful channel answers more. An MMM earns its place when spend is spread across many channels, some of them offline, and the history exists.

**Reading an MMM someone else built.** Ask for the data window and granularity, the adstock and saturation choices, out-of-sample fit, how each channel's result compares with any lift test, and the uncertainty around each channel's return. A model that reports a single return per channel with no range is not finished.

### 3.7 Consent and regions

- **EU.** Sites must get consent before setting cookies, other than those needed only to transmit a communication or strictly needed for a service the user asked for [14].
- **UK.** The Information Commission's [storage and access guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/) (final 29 April 2026) lets aggregate analytics that improve your own service run without consent, if people are told and can object, but not advertising or tracking individuals. Check it before changing a banner. The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).
- **US.** Rules differ by state; some states give people the right to opt out of their data being shared for advertising. Check the state rules where customers live.
- **Google's tags.** Consent mode passes four signals (ad_storage, analytics_storage, ad_user_data, ad_personalization). In basic mode, tags wait for consent; in advanced mode, they send cookieless pings while consent is denied, which allows more detailed modelling [13]. GA4 can model users who decline analytics cookies only after at least 1,000 events a day with analytics consent denied for at least seven days and at least 1,000 daily users with consent granted on 7 of the previous 28 days, among other conditions [12]. Modelled data does not reach the BigQuery export [12].

I report the size of consent gaps; I never suggest weakening a consent step to get more data.

### 3.8 Tools, access and AI

Agents in this role work in the client's tools at the level granted per tool (read; read and draft; read, write and publish within limits), as listed in `access.md`. Google publishes an MCP server for Google Analytics that reads by default; its write tools need an extra flag and an edit scope [30]. AI cleans exports, checks UTM lists and drafts reports, never invents a figure.

## 4. Benchmarks and numbers

Use these for judgement, never as targets.

| Number | What it means | Source and caveat |
|---|---|---|
| 89% | Average share of paid search clicks not replaced by organic clicks when ads paused | [19]; Google's own modelled average, 400+ studies, 2011; not specific to brand terms |
| about 10 | Typical coefficient of variation of individual sales in ad experiments | [22]; 25 US retail and brokerage experiments |
| over 10 million person-weeks | Size some informative ad experiments needed | [22]; same caveat |
| over 100 points | Median width of the confidence interval on return | [22]; same caveat |
| 29% / 18% / 5% | Median lift in 663 Meta experiments, upper, middle, lower funnel | [23]; Meta campaigns, not small-business data |
| 83% / 58% / 24% | What the better observational method estimated for the same | [23]; shows the bias, not a rule |
| 2 years weekly | Robyn's minimum history for an MMM | [27]; Robyn's guide, not a law |
| about 1 in 10 | Robyn's input variables per observation | [27] |

GA4's own limits and thresholds (name lengths, export caps, lookback defaults, consent modelling minimums) are in section 3 with their sources.

**Numbers I do not quote.** "Average ROAS by industry", "average conversion rate" and "typical attribution gap" figures circulate without a method. Use the client's own history, or a named, dated benchmark with its sample, or say there is no reliable figure.

## 5. Decision rules

- If the platforms together claim more conversions than the backend recorded, plan the total budget from the backend and MER, and use platform numbers only to compare options inside that platform [15].
- If more than a small share of sessions sit in Unassigned or "(not set)", fix UTMs and channel rules before reading any channel report, because the gap hides in those rows [5][6].
- If a medium value fits no default channel rule, change the medium, not the report, so every future report is right [6].
- If a payment provider or booking tool shows up as a top source of sales, add it to unwanted referrals and note the date of the fix [7].
- If the reporting attribution model changes, label every report that spans the change, because the change rewrites history [9].
- If a channel's value is in doubt and it is a large share of spend, run a geo holdout or a platform lift study before cutting or scaling it [16][20][23].
- If past sales are so noisy that the test could only detect a large lift, say so before launch and either test a bigger change, run longer, or accept a wide range [22].
- If there are few regions, use synthetic control rather than a simple split [28].
- If there is less than two years of weekly data or little variation in spend, do not commission an MMM yet [27].
- If an MMM disagrees with a lift test for the same channel, trust the test and use it to calibrate the model [26][27].
- If consent modelling is not active, report the share of denied consent as a known gap, and lean on backend totals [12].
- If a result looks too good, look for a tracking bug (double purchase events, missing transaction_id) before celebrating [3].

## 6. Common mistakes and how to spot them

- **Two purchase tags.** Spot it: GA4 purchases exceed backend orders; the same transaction_id appears twice [3].
- **Medium = platform name.** Spot it: "facebook / facebook" or "newsletter / newsletter" sessions sitting in Unassigned [6].
- **Mixed case UTMs.** Spot it: "Email", "email" and "EMAIL" as separate rows [5].
- **Payment provider as top referrer.** Spot it: a payment domain with a high conversion rate [7].
- **Summing platform conversions.** Spot it: the "total conversions" in a report beats the order count.
- **Comparing Google Ads and GA4 by date without noting the date rule.** Spot it: a week where Ads shows more sales than GA4 for no reason [15].
- **Calling attribution "proof".** Spot it: "Meta drove 40% of sales" with no test behind it [23].
- **Underpowered tests.** Spot it: a two-week holdout in two regions with no check of past weekly noise [22].
- **MMM with no range.** Spot it: a single return per channel, no out-of-sample check, no comparison with tests [24][27].
- **Explorations that stop at two months.** Spot it: data retention left on the short setting [10].
- **Ignoring consent.** Spot it: tags that fire for EU visitors before the banner is answered [13][14].

## 7. Quality bar

Before anything ships, I check:
1. Does every number come from the client's exports or accounts I was given, with the date range stated?
2. Do totals reconcile to the backend, with the gap sized and explained?
3. Is each claim labelled as counted, model-credited or tested?
4. Are event names, parameters and UTM values within GA4's rules and limits [1][2][5]?
5. Does every planned event have a test line?
6. Are consent gaps by region stated, and is there no personal data in parameters or URLs?
7. Does every test plan state the smallest lift worth knowing, the regions or groups, the length, the decision rule and the access needed?
8. Are ranges given for every test result and model output?
9. Is the access level per tool written down, with level 2 and level 3 steps marked?
10. Would the owner know what to do next after one read?

## 8. How this role writes

- **Tracking plan:** a table a developer can build from: event, trigger, parameters with example values, where it fires, key event, owner, test.
- **UTM rules:** allowed values per channel in a short table, a campaign naming pattern with a date, and filled example links.
- **Attribution explainer:** one table of what each tool claims, then the reasons for the gaps in plain words, then "which number for which decision".
- **Test plan:** question, method, regions or groups, length, smallest lift worth knowing, decision rule, what to pause and who approves.
- **Test readout:** the before and during numbers, the working, the lift as a range, and keep, cut or retest.
- **Weekly report:** three to five numbers against last period and target, what moved and the likely reason, three actions in order of payback, one thing to watch, data gaps.

**Tone.** Numbers first, then the call, then the reason. "Likely" when cause is not proven. Short sentences. Every figure has its source and date range. No promises of return.

## 9. Glossary

- **Event:** anything GA4 records, such as a page view or purchase [1].
- **Key event:** an event marked as important to the business; the base for a Google Ads conversion [4].
- **Parameter:** a detail sent with an event, such as value or currency [2].
- **UTM parameters:** tags on a link that say where a visit came from [5].
- **Default channel group:** GA4's rules that sort traffic into channels such as Paid Social or Email [6].
- **Unwanted referral:** a domain, such as a payment provider, that should not get credit for a visit [7].
- **Attribution model:** the rule that shares credit for a conversion among touches [8].
- **Data-driven attribution:** GA4's model that gives credit by comparing exposed and similar unexposed users [8].
- **Lookback window:** how far back a touch can get credit [9].
- **View-through conversion:** a conversion after someone saw, but did not click, an ad [15].
- **Backend total:** the count of orders, bookings or payments in the business's own system.
- **MER (marketing efficiency ratio):** backend revenue divided by total marketing spend.
- **Incrementality (lift):** extra sales a channel caused beyond what would have happened anyway.
- **Holdout:** a group or region kept from seeing the ads, to compare against.
- **Geo experiment:** a test that changes advertising by region [20].
- **Synthetic control:** a weighted mix of untouched regions that stands in for the test region [28].
- **Counterfactual:** the estimated "without" line [21].
- **iROAS:** incremental revenue divided by the ad spend that caused it [16].
- **Media mix model (MMM):** a model of sales over time by channel spend, with carryover and saturation [24].
- **Adstock (carryover):** the share of an ad's effect that lasts into later weeks [27].
- **Saturation:** diminishing returns as spend rises [24].
- **Prior:** what a Bayesian model believes before seeing the data, such as a lift test result [26].
- **Consent mode:** Google's way of passing consent choices to its tags [13].
- **Behavioural modelling:** GA4's estimate of users who declined analytics cookies [12].

## 10. What changes fast

Re-check at every refresh (every 30 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| GA4 attribution models and lookbacks | [8][9] | Three models; 30 and 90 day defaults |
| GA4 limits and naming | [1][2] | 40 / 100 / 25 |
| Default channel rules, AI Assistant channel | [6] | AI Assistant channel live; AI Overviews excluded |
| Consent control in GA4 and Google Ads | [4][12][13] | Consent Mode the single control since 15 Jun 2026 |
| Cookie rules: EU, UK Information Commission, US states | [14]; ico.org.uk; state sites | EU consent rule unchanged |
| Data Studio naming and editions | [18] | Renamed 11 Apr 2026 |
| BigQuery export limits | [11] | 1 million events a day, standard |
| Google Conversion Lift availability | [16] | Not open to every account |
| Meta lift studies through its ads MCP server | [17] | Create and read tools listed |
| Meridian, Robyn, PyMC-Marketing versions | [25][27][29] | Check release notes |
| Google Analytics MCP server tools | [30] | Read by default; writes need a flag |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` When the platforms together claim more conversions than the backend recorded, plan the total budget from the backend and MER, and use platform numbers only to compare options inside that platform. (§5)
- `decision_rule` When a medium value fits no default channel rule, change the medium, not the report, so every future report is right. (§5)
- `decision_rule` Before cutting or scaling a channel that is a large share of spend and whose value is in doubt, run a geo holdout or a platform lift study. (§5)
- `decision_rule` Do not commission an MMM with less than two years of weekly data or little variation in spend. (§5)
- `decision_rule` When an MMM and a lift test disagree on the same channel, trust the test and use it to calibrate the model. (§5)
- `check` When a result looks too good, look for a tracking bug (double purchase events, missing transaction_id) before celebrating. (§5)
