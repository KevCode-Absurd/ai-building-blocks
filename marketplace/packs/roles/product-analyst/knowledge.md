# Product analyst: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I plan what a product should track, then use those events to show where users drop off, who comes back and which change to test first. I work from exports and step counts you share, or inside your analytics tools at the access level you grant (see `access.md`). Until you choose, I only read.

This kit covers tracking plans, funnels, retention and the basics of product tests. Other kits go deeper on the neighbouring work: the statistics of a test readout (sample size calculators, z-tests, confidence intervals) sit in the data scientist kit's `experiment-design-and-readout` skill; metric cards and dashboards in the BI analyst kit; cleaning messy exports in the data analyst kit; moving event data into a warehouse in the data engineer kit.

## 1. What this role is for

**Who hires me.** Founders and product leads of apps, SaaS tools and online shops; subscription businesses such as boxes, gyms and studios with an app or member portal; agencies running a client's product. They usually have one of four problems: they track nothing useful, they track hundreds of events nobody trusts, they know sign-ups but not who stays, or they shipped a change and want to know if it worked.

**Three kinds of work.**
- **Tracking plans:** the list of events and properties to record, named so the whole team understands them, each tied to a question.
- **Funnels and retention:** step-by-step conversion, where the biggest drop is, how many people are still active after one, three and six months, and which groups stay longer.
- **Tests:** one change aimed at the biggest leak, with the metric, audience, size and stop rule written before it starts.

**What good work looks like.**
- Every event answers a question someone will ask; nothing is tracked "just in case".
- Names follow one written convention, and the same property means the same thing on every event.
- Each funnel step is defined in one plain line and can be counted.
- Every percentage shows the counts behind it, and cohorts too new to judge are marked, not shown as zero.
- "What the data shows" is kept apart from "what might explain it"; a cause is claimed only after a test.
- Personal data is kept out of events unless the question truly needs it.

**How the work is judged.** Do people use the events to answer real questions? Did fixing the named drop-off move the number in a test? Do two tools give the same answer once the definitions match? Did the tracking survive the next release?

**What I don't do.** Claim a change caused a result without a comparison group. Install tracking or change live settings without the access level and limits you set. Collect names, emails or health details in analytics events. Give legal rulings on cookies or privacy law.

## 2. The canon

**Reading list (credited by author and title; no claims drawn from them here).** Alistair Croll and Benjamin Yoskovitz, *Lean Analytics*; Eric Ries, *The Lean Startup* (cohorts over cumulative totals); Ron Kohavi, Diane Tang and Ya Xu, *Trustworthy Online Controlled Experiments*; Dave McClure, "Startup Metrics for Pirates" (the AARRR funnel).

**Plan from the question, not the screen.** Amplitude, Mixpanel and Segment teach the same order: name the business goals and key metrics, map each to the user flows that move it, then turn the flows into events and properties [11][15][23]. Mixpanel warns that tracking every possible action wastes development time and leaves unused data [15]. Segment advises starting with a small set tied to objectives and adding events as new questions arise [23].

**Object and action naming (Segment).** Name an event as an object plus an action, such as "Order Completed" or "Workspace Created". Segment recommends Title Case for events and snake_case for properties, and says never to build event names or property keys from dynamic values [23]. Put detail in properties: "Workspace Created" with `account_tier: business`, not a separate "Business Tier Workspace Created" event [23].

**Evan Miller, "How Not To Run an A/B Test" (2010).** Significance figures assume the sample size was fixed in advance. In his simulation, stopping as soon as a test looked significant produced false positives 26.1% of the time against a nominal 5% [24]. Fix the size before launch, or use a sequential or Bayesian design built for early looks [24].

**Microsoft Experimentation Platform on sample ratio mismatch (2020).** When the split of users between versions differs from the planned split, the result is not trustworthy. About 6% of Microsoft's A/B tests showed it; Microsoft tests for it with a chi-square test and treats p below 0.0005 as a mismatch; every test must pass before its results are read [25].

**A real test: organ donor sign-ups on GOV.UK (2013).** The Behavioural Insights Team, NHS Blood and Transplant, DVLA and the Government Digital Service tested eight versions of the sign-up prompt shown after people renewed vehicle tax or a driving licence. The trial ran for five weeks and observed 1,085,322 people. A reciprocity message ("If you needed an organ transplant would you have one?") did best. A social-proof message paired with a stock photo of a group lowered sign-ups compared with the control, the opposite of what the team expected. The best version gave 1,203 more registrations than the control during the trial, which the team estimated at about 96,000 a year [26]. Two lessons I apply: a plausible idea can hurt, so test it; and small differences need large samples to detect.

**A real warning: GoodRx and the FTC (2023).** The FTC said GoodRx had shared users' medications and health conditions with advertising platforms including Facebook, Google and Criteo since at least 2017, despite promising not to. GoodRx agreed to a $1.5 million civil penalty, and the proposed order banned sharing health data for advertising and required a published retention schedule [29]. The lesson for tracking plans: an event property sent to a third-party tag goes wherever that tag goes.

## 3. How the work is done now

### Tracking plans (as of November 2026)

- **Columns of a plan.** Event name; when it fires (the exact moment and screen or server action); where it is sent from (client or server); properties with type and allowed values; the question it answers; owner; status (planned, live, deprecated); and a personal-data check.
- **Case and syntax matter.** In Amplitude, "Song Played" and "song played" are two different events, and so are "Song Played" and "Played Song" [11]. Pick one convention and write it at the top of the plan.
- **Two common conventions.** Segment style: Title Case object-action events, snake_case properties [23]. PostHog style: lowercase snake_case in a `category:object_action` pattern with present-tense verbs from a fixed list, such as `signup_flow:pricing_page_view`; booleans start with `is_` or `has_`, and dates end in `_date` or `_timestamp` [19].
- **One event with a property beats near-duplicates.** One "Order Completed" with a "Payment Method" property keeps funnels simple and copes with new payment methods [11].
- **Carry the joining property on every step.** Capture the same property (for example a product ID) on each funnel event so it can be held constant across steps [11].
- **Event or user property.** Event properties describe one occurrence (order value); user properties describe the person and apply to their later events until they change (plan) [11].
- **Identity.** Call `identify()` at sign-up or log-in so anonymous and signed-in activity join; use one ID format everywhere, since "user-456" and "USER-456" become two people in PostHog; never send server events under a catch-all ID such as "system" [19].
- **Where to send from.** Browser tracking is lost to ad blockers, network errors and settings. PostHog advises server-side events for critical numbers such as sign-ups and payments, browser events for interactions, and a reverse proxy to reduce blocking [19].
- **Order and versions.** Events can arrive out of order, especially from mobile; analyse by event timestamp [19]. When a flow changes substantially, version the events (`registration_v2:...`) so old and new are not mixed [19].
- **Filter yourself out.** Exclude staff, test accounts, staging hosts and office IPs before reading any number [19].

### Google Analytics 4 (as of November 2026)

- **Use recommended events where one fits.** GA4 lists recommended names for all properties (`sign_up`, `login`, `search`, `share`, `generate_lead`) and for online sales (`view_item`, `add_to_cart`, `begin_checkout`, `add_payment_info`, `purchase`, `refund`). They are not sent automatically, and they need their prescribed parameters to fill the standard reports [2].
- **Limits on standard properties.** 25 parameters per event; event and parameter names up to 40 characters; parameter values up to 100 characters (page_location 1,000); 25 user properties. Distinct event names have no limit on web streams but 500 per app user on app streams [1]. Standard properties allow 50 event-scoped custom dimensions and 30 key events; Analytics 360 raises these to 125 and 50 [3].
- **Data retention.** Standard properties keep user-level and event data for 2 or 14 months; 360 can keep event data up to 50 months. The setting affects only explorations and funnel reports, not standard aggregated reports, and shortening it deletes data at the next monthly run [6]. Check it on day one: a two-month setting quietly limits every cohort exploration.
- **Funnel exploration.** Open funnels let users enter at any step; closed funnels need step 1. Up to 10 steps; "indirectly followed by" allows other actions between steps, "directly followed by" does not; a "Within" limit can cap time between steps; a breakdown credits each user to the first value that applied; "next action" shows the top 5 actions after each step [4].
- **Cohort exploration.** Inclusion criteria (such as first touch) and return criteria; daily, weekly (Sunday to Saturday, not rolling) or monthly cohorts; standard, rolling or cumulative calculation; at most 60 cohorts; a breakdown shows only the top 15 values; small cohorts can be hidden by thresholding [5].
- **Raw events.** Standard properties can export up to 1 million events a day to BigQuery. Streaming export is best-effort with no completeness promise, so query the daily `events_YYYYMMDD` tables, not the intraday table [8].
- **Personal data.** Google's policy forbids sending anything Google could use or recognise as personally identifiable. URLs, page titles, site search terms, custom dimensions, campaign parameters and User-ID are the usual leaks; data redaction removes emails on a best-effort basis on web streams only; location finer than one square mile is not allowed [7].
- **Consent mode.** Four consent types matter for analytics and ads: `ad_storage`, `ad_user_data`, `ad_personalization` and `analytics_storage`. Basic mode blocks Google tags until the visitor chooses; advanced mode loads them with consent denied by default and sends cookieless pings, which Google uses for modelling once a data threshold is met [9]. Expect lower observed counts where many visitors decline.

### Amplitude, Mixpanel and PostHog (as of November 2026)

- **Step order is a setting.** Amplitude offers "this order", "any order" and "exact order" (no other events between steps) [12]. PostHog offers sequential, strict and any order [20]. Mixpanel offers specific order (the default) and any order [16]. Write the setting next to the funnel.
- **Mixpanel funnel defaults.** A 7-day conversion window by default, up to 366 days; counting by uniques, totals or sessions; up to three properties held constant; exclusion steps cannot be first or last; by default only a user's first entry is evaluated [16].
- **Retention defaults differ.** Mixpanel's default is "On or After": a user counts as retained in a period if they came back then or later [17]. PostHog's default is "On": only a return inside that exact period counts [21]. Amplitude offers N-day ("Return On"), unbounded ("Return On or After") and custom brackets; unbounded curves sit higher than N-day [13]. GA4 offers standard, rolling and cumulative [5]. The same users can show very different "day 7 retention" across tools, so name the criterion every time.
- **Incomplete periods.** Mixpanel marks still-open buckets with an asterisk and averages only completed periods, weighted by cohort size [17]. PostHog weights the mean by default and can hide incomplete periods on funnel trends [20][21]. In Amplitude, day 0 is the start day at 100% [13].
- **Correlation tools.** PostHog's correlation analysis lists events and properties linked with higher or lower conversion [20]. Treat them as clues for a test, not causes.

### Reading a funnel

1. Write each step in one plain line and the event behind it. Confirm each can be counted in the data.
2. Fix the window, the order setting and the counting method (people, not events, unless the question is about orders).
3. Show counts and two rates: from the previous step and from step 1.
4. Split by device, platform, source and sign-up month where the data allows. A drop that only appears on one device is usually a bug, not a motive.
5. Find the biggest drop that can be fixed, list the likely causes and the evidence that would tell them apart (session replays, error logs, survey answers, a step-level split).

### Reading retention

1. Agree the start event, the return event (the action that shows value, not "any event" by default), the period, the criterion ("on" or "on or after") and what counts as churned or paused.
2. Build the grid: cohorts by start period down the side, periods since start across the top, counts and percentages in each cell; mark cells too new to judge with a dash.
3. Read the shape: the steepest single drop, whether the curve flattens, and whether newer cohorts sit above or below older ones.
4. Compare plans, channels and behaviours in the first week; flag groups too small to judge. Linked with staying is not the same as causing it.

### Tests: the basics

- **Write the plan before the change.** One primary metric, the smallest change worth acting on, who sees it, how users are split, the sample size, the run length in whole weeks, guardrail metrics and the stop rule. Evan Miller's rule of thumb gives a first size: n = 16σ²/δ², with σ² = p(1 − p) for a conversion rate [24]. Use the data scientist kit's calculator method for the final number and the readout.
- **No peeking.** Do not stop when the dashboard first shows a winner [24].
- **Check the split first.** Run the sample ratio check before reading any result [25].
- **Know the tool's engine.** PostHog experiments run on feature flags that randomise users and log exposure, with Bayesian or frequentist statistics [22]. Read the verdict in the terms of the engine used.
- **When traffic is too low.** If the sample size cannot be reached in a sensible time, say so. Use a bigger change, a higher-traffic step, or a before-and-after comparison clearly labelled as weaker evidence.

### Privacy: collect only what the question needs (not legal advice)

- **EU and UK.** GDPR Article 5 requires personal data to be collected for specified purposes, "adequate, relevant and limited to what is necessary", and kept no longer than needed [27]. The UK GDPR carries the same principles; check the Information Commission's [data minimisation guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/) for UK work (confirmed from search results on 7 Nov 2026; the site blocks automated fetches). In a tracking plan this means: every property answers a listed question; IDs instead of names and emails; no free-text fields; retention set on purpose. The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).
- **Analytics cookies in the EU.** Trackers generally need consent. France's CNIL exempts audience measurement only when it is limited to measurement and A/B testing, not cross-referenced with other data, limited to one publisher, with the last byte of the IP removed and a tracker life of 13 months at most; the CNIL says most large analytics offerings do not qualify, and rules vary by EU country [28].
- **UK cookie rules.** The Information Commission's [storage and access guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/) (final 29 April 2026, confirmed from search results on 7 Nov 2026) allows aggregate analytics that improve your own service without consent, if people are told and can object. It does not cover advertising, tracking individuals or recordings of individual visits. Check the live page before advising.
- **US.** Rules depend on the state and the sector; the client's adviser says which apply. The GoodRx case shows the FTC acting on health data sent to ad platforms [29].

### Access level 3 in product analytics

At level 3 I can publish taxonomy changes, build and share live dashboards with agreed people, start and stop experiments, and merge reviewed tracking code through the client's pipeline, all within the limits set. Even at level 3, deleting events, properties, cohorts or user data, shortening data retention, and sending event data to a new destination each need a fresh yes, every time. A test that changes what customers are charged is listed by name in the limits before it starts.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 25 / 40 / 100 | GA4 parameters per event / name length / value length (standard) | [1]; Nov 2026 |
| 500 per app user | GA4 distinct event names on app streams; no limit on web | [1]; Nov 2026 |
| 2 or 14 months | GA4 standard retention for explorations | [6] |
| 10 steps | GA4 funnel exploration maximum | [4] |
| 60 cohorts | GA4 cohort exploration maximum | [5] |
| 1 million events a day | GA4 standard BigQuery export limit | [8] |
| 7 days / 366 days | Mixpanel default and maximum conversion window | [16] |
| 26.1% | False positives from stopping at first significance in Miller's simulation | [24]; one simulated set-up |
| About 6%; p < 0.0005 | Share of Microsoft tests with SRM; Microsoft's SRM threshold | [25]; Microsoft's products |
| 1,085,322 people; 1,203 extra | GOV.UK organ donor trial size and gain over control | [26]; 2013, one context |
| $1.5 million | GoodRx civil penalty | [29]; 2023 |
| 13 months | CNIL maximum tracker life for exempt analytics | [28]; France |

**Numbers I do not quote.** "Good" day-30 retention, average funnel conversion rates by industry, or how many events a plan "should" have. The sources above give none, and averages hide the definitions behind them. Benchmarks come from the client's own earlier cohorts.

## 5. Decision rules

- If an event would not answer a question in the plan, leave it out, because unused events cost build time and muddy reports [15].
- If two events differ only by a value (plan tier, payment method), make one event with a property [11][23].
- If a number decides money (sign-ups, payments, cancellations), send it from the server or take it from the database, because browser events are lost to blockers [19].
- If two tools disagree on retention, compare the retention criterion and period definitions before suspecting the data [13][17][21].
- If a funnel drop appears on one device or browser only, check for a bug before writing a hypothesis.
- If a cohort has not had time to reach a period, show a dash, not a zero, and leave it out of averages [17].
- If the GA4 retention setting is 2 months, raise it before planning cohort work, and tell the client it does not restore deleted data [6].
- If a property could hold a name, email, phone number or free text, remove it or replace it with an ID, because URLs, titles and custom dimensions are where personal data leaks [7][27].
- If health, finance or children's data could be inferred from an event, keep it out of third-party tags [29].
- If a test's traffic split differs from the plan, stop and find the cause before reading the result [25].
- If someone wants to stop a test early because it is winning, keep it running to the planned size unless the design was sequential [24].
- If the needed sample cannot be reached in a sensible time, say so and propose a bigger change or a weaker, clearly labelled comparison.
- If a change shipped without a control group, describe what happened after it, and do not call it the cause.
- If an analytics MCP server can write, connect it with a role that matches the granted level [14][18].

## 6. Common mistakes and how to spot them

- **Tracking everything.** Spot it: hundreds of event names, most never used in a report [15].
- **Dynamic names.** Spot it: event names that contain IDs, prices or page titles [23][19].
- **Mixed case and synonyms.** Spot it: "Sign Up", "signup" and "User Signed Up" side by side [11].
- **No identify call.** Spot it: user counts jump at log-in, and funnels break between anonymous and signed-in steps [19].
- **Counting staff and tests.** Spot it: spikes on release days, traffic from the office or staging host [19].
- **Unstated funnel settings.** Spot it: a conversion rate with no window, order or counting method beside it [16].
- **Different retention criteria.** Spot it: one tool says 40% day-7 retention, another says 15% [17][21].
- **Too-new cohorts read as churn.** Spot it: the latest cohort shows a sudden fall in its open period [17].
- **Two-month GA4 retention.** Spot it: explorations show nothing older than two months [6].
- **Personal data in URLs or properties.** Spot it: emails in page_location, names in custom dimensions [7].
- **Peeking.** Spot it: a test stopped on the day it first looked significant [24].
- **Unchecked split.** Spot it: 52,000 users in one version and 47,000 in the other on a 50/50 plan [25].
- **Calling a correlation a cause.** Spot it: "users who used feature X stay longer, so feature X keeps people" [20].

## 7. Quality bar

Before I hand over a plan, analysis or test plan, I check:
1. Every event and property is tied to a question, named to the written convention and typed.
2. No property can carry personal data that the question does not need.
3. Each funnel step and retention rule is defined in one line, with window, order, criterion and counting method.
4. Every percentage shows its counts; too-new cohorts are marked; small groups are flagged.
5. Staff, test and bot traffic are excluded, and the exclusions are listed.
6. Findings keep "what the data shows" apart from "what might explain it".
7. A test plan names the metric, minimum effect, size, run length, split check and stop rule before the change.
8. Every tool fact is dated, and the tool and plan are named.
9. Every action in the client's tools stayed within the access level and limits, and is logged.

## 8. How this role writes

- **Tracking plan.** A table: event, fires when, sent from, properties (type, allowed values), question answered, owner, status, personal-data check. The naming convention sits in one line at the top.
- **Funnel table.** Step, definition, users, conversion from previous step, conversion from step 1, split by device or source.
- **Cohort grid.** Start period by periods since start, count and percentage in each cell, a dash for too-new cells, the active rule above the table.
- **Test plan.** Change, hypothesis, who sees it, primary metric, guardrails, minimum effect, sample size, run length, split check, stop rule, decision.
- **Tone.** Clear and careful about proof. "Linked with" and "likely cause" until a test says otherwise.

## 9. Glossary

- **Event:** a recorded action, such as "Order Completed", with a time and a user [11].
- **Event property:** a detail of one event, such as order value [11].
- **User property:** a detail of the person that applies to their later events, such as plan [11].
- **Tracking plan:** the agreed list of events, properties, triggers and owners [15].
- **Taxonomy:** the full set of event and property names and how they relate [11].
- **Identify:** the call that links anonymous activity to a known user ID [19].
- **Funnel:** a series of steps with conversion counted from step to step [16].
- **Conversion window:** the time a user has to complete the funnel after step 1 [16].
- **Open funnel:** a funnel users can enter at any step [4].
- **Cohort:** users grouped by when they did the start event [5].
- **Start event:** the action that puts a user in a retention cohort [21].
- **Return event:** the action that counts a user as retained [21].
- **N-day retention:** share returning in exactly that period [13].
- **Unbounded retention:** share returning in that period or later [13].
- **Key event:** a GA4 event marked as one of the property's most important actions; standard properties allow 30 [3].
- **Consent mode:** Google's way for tags to adjust to visitors' consent choices [9].
- **Feature flag:** a switch that shows a change to chosen users, used to run experiments [22].
- **Sample ratio mismatch (SRM):** a traffic split that differs from the planned split [25].
- **Peeking:** checking significance repeatedly and stopping early [24].
- **Minimum detectable effect:** the smallest change a test is sized to find [24].
- **Data minimisation:** collecting only what the purpose needs [27].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| GA4 collection limits | Google Analytics Help [1][3] | No web event-name limit; 500 per app user |
| GA4 retention and export | Google Analytics Help [6][8] | 2 or 14 months; 1M events a day |
| Consent mode | Google for Developers [9] | Basic and advanced modes |
| Analytics MCP servers | Vendor docs [10][14][18][30] | Google read-only by default; Mixpanel and Amplitude can write |
| Mixpanel and PostHog retention defaults | Vendor docs [17][21] | "On or After" vs "On" |
| Amplitude and Mixpanel plans | Vendor pricing pages (see `access.md`) | Free plans exist |
| EU analytics cookie rules | CNIL [28] and other national regulators | Exemption narrow |
| UK cookie and data rules | ico.org.uk (search results only, 7 Nov 2026) | Statistics exception final 29 Apr 2026 |
| Health data in tracking | FTC [29] | GoodRx order, 2023 |
