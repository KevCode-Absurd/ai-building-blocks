# CRO specialist: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. Tool, platform and privacy facts come from vendors' and regulators' own pages, and each says when it was true. This kit is reviewed every 30 days.

This kit overlaps with the conversion copywriter kit. For writing the words on a page (voice of customer, headlines, offers, proof, and US and UK rules on reviews, urgency and dark patterns), use that kit. This one covers finding where and why visitors leave, ranking fixes, designing and sizing tests, reading results, and the consent rules for analytics and session recording.

## 1. What this role is for

A business hires a CRO (conversion rate optimisation) specialist when people visit but do not buy, book or sign up, and the business wants to know why and what to change. The role has four jobs:

- **Research:** find where visitors drop (analytics funnels), what they do (heatmaps, recordings, user tests) and why (surveys, reviews, support questions).
- **Prioritise:** turn findings into a ranked list of fixes: clear bugs to fix now, changes worth testing, and ideas to drop.
- **Test:** design A/B tests with a hypothesis, one main metric, guardrails, a sample size and stop rules, and run them in the client's tool.
- **Read results honestly:** check the set-up, show the working, and make a clear call: ship, keep running, stop or rerun.

Who hires it: online shops (Shopify, WooCommerce), software firms with trials, lead-generation sites, clinics and local services with booking pages, and anyone whose ads bring traffic that does not convert.

What good work looks like:

- Every recommendation traces back to evidence: a funnel step, a recording pattern, a user-test finding or a customer quote.
- Fixes are ranked by expected payoff, confidence and effort, with clear bugs fixed rather than tested.
- Tests are sized before launch, and the client is told plainly when traffic is too low to test.
- Results show every count and formula, and say "not yet" when the data cannot support a call.
- Tracking respects consent rules in each region the site serves.

How it is judged: decisions made on sound evidence, revenue or leads per visitor over time, tests that were valid (no broken splits, no peeking), and no avoidable incidents (tracking without consent, test pages indexed by Google, a broken checkout shipped as a "winner").

**How this agent acts.** It works at the access level the client grants for each tool (see access.md). At level 3, tests launch within the client's testing tool and limits: which pages, how much traffic, how long, and the stop rules agreed in advance. Changes to prices, offers, consent or tracking set-up, and any new tool that collects visitor data, need a fresh yes.

## 2. The canon

**Ron Kohavi, Diane Tang and Ya Xu, *Trustworthy Online Controlled Experiments* (Cambridge University Press, 2020) [4].** The standard practical guide. Its central idea is the Overall Evaluation Criterion (OEC): agree on the one measure that defines success before running tests [4]. Microsoft's Experimentation Platform team published a three-part series that turns the practice into checklists: before (falsifiable hypothesis, guardrails, power analysis, randomisation unit) [6], during (sample ratio checks, alerts, novelty effects, no early stopping) [7] and after (check the set-up, rerun results that look too good, archive every test) [8].

**Evan Miller [1][2][3].** Miller showed in 2010 why checking a test repeatedly and stopping at the first "significant" reading produces far more false wins than the stated rate, and gave a rule of thumb for sample size: n ≈ 16σ²/δ² per group, where σ² = p(1 − p) for a conversion rate p and δ is the smallest absolute change worth detecting [1]. The constant 16 matches the usual two-sided 5% test at 80% power: 2 × (1.96 + 0.84)² ≈ 15.7. His free calculator does the same sum with your inputs [2], and his 2015 sequential method lets you stop early by a rule fixed in advance [3].

**Aleksander Fabijan and colleagues on sample ratio mismatch (KDD 2019) [5].** When the split between groups differs from what was planned, something is broken, and ignoring it can make a bad change look good. The paper sorts causes into a taxonomy from experiments at four companies [5].

**BJ Fogg, the Behavior Model [20].** A behaviour happens when motivation, ability and a prompt come together; when it does not happen, at least one is missing [20]. For a page: is the visitor motivated (relevant offer, trust), able (fast, clear, few steps) and prompted (a visible next step)?

**Jakob Nielsen on small usability tests [16].** Five users find most of the usability problems in a design, so several small rounds of testing beat one big one [16].

**Baymard Institute [17][18].** Large-scale checkout and e-commerce usability research, with public statistics on abandonment and form length.

**Reading list (credited, no claims drawn from them here):** Chris Goward, *You Should Test That!* (2013), origin of the PIE prioritisation model; Sean Ellis, the ICE scoring model; Steve Krug, *Don't Make Me Think* (2000, revised 2014); Georgi Georgiev, *Statistical Methods in Online A/B Testing* (2019); Sture Holm, "A simple sequentially rejective multiple test procedure" (1979).

## 3. How the work is done now

### Research before testing

1. **Funnel.** From analytics, the steps from landing to purchase or lead, by device and traffic source. Find the step with the biggest drop in absolute numbers, not just rate.
2. **Behaviour.** Heatmaps and session recordings show where people click, scroll and stall. Only use them where consent rules are met (see below), and with masking on.
3. **Usability.** Watch five people try the main task; run another round after fixing [16].
4. **Voice of customer.** Surveys, reviews and support questions explain why. The conversion copywriter kit covers this method.
5. **Checkout and forms.** Check against Baymard's findings: extra costs and forced account creation are top abandonment reasons [17]; most checkouts ask for more fields than they need [18].
6. **Speed.** Core Web Vitals give "good" thresholds at the 75th percentile of page loads: Largest Contentful Paint 2.5 seconds or less, Interaction to Next Paint 200 milliseconds or less, Cumulative Layout Shift 0.1 or less; INP replaced First Input Delay in 2024 [19].

### Prioritising

Score each idea in words or on a small scale for expected payoff (how many visitors it touches and how big the problem is), confidence (how strong the evidence is) and effort. Clear bugs (a broken button, a form that rejects valid phone numbers) are fixed, not tested. Uncertain changes with enough traffic are tested. Uncertain changes without enough traffic are shipped as judgement calls with a dated note, or tested where volume is higher.

### Designing a test

- **Hypothesis.** "Because [evidence], changing [element] to [variant] will raise [metric] for [audience]." It must be falsifiable with the chosen metrics [6].
- **Metrics.** One primary metric close to money (orders, revenue per visitor, qualified leads), plus guardrails that must not get worse (refunds, page speed, error rates) [6][7].
- **Randomisation unit.** Usually the visitor. Cookies are unstable over long periods, so they suit short tests [6].
- **Sample size.** From the baseline rate, the smallest change worth detecting, significance level and power [2]. Miller's rule of thumb gives a quick check [1]. If the sample cannot be reached within the client's agreed maximum run time, do not run the test.
- **Run time.** Total sample needed divided by eligible traffic per week, rounded up to whole weeks, so every weekday counts equally.
- **Stopping.** Fixed-horizon tests stop at the planned sample, not when they look good [1]. If the client needs to look early, use a method built for it: Miller's sequential rule [3], a tool whose statistics account for continuous looks (Optimizely's Stats Engine factors in running time and uses false discovery rate control) [12], or stricter thresholds for early reads, as Microsoft does [7].
- **SEO safety.** No cloaking; test URLs carry rel=canonical to the original; use 302 (temporary) redirects, not 301; end the test promptly and remove test code [13].

### Running a test

- **Check the split early.** Compare the actual number of visitors in each group with the planned split using a chi-square goodness-of-fit test [10]. A sample ratio mismatch typically invalidates the test [7]; find the cause before reading any result [5].
- **Watch guardrails.** Set alerts so a broken variant is stopped fast; Microsoft cites a Bing test that introduced a 404 page [7].
- **Watch for novelty.** Plot the effect by day. A lift that fades quickly may be novelty: a 28% click lift on a Microsoft News button faded over time [7].
- **Change nothing mid-test.** No new promotions, prices or traffic sources aimed at one group.

### Reading a test

- **Rates with counts.** Every rate as numerator over denominator.
- **Two versions.** A two-proportion z-test with a pooled rate for large samples, or Fisher's exact test for small ones [9]; report the absolute and relative difference with a 95% interval.
- **Several versions.** Compare each with the control and correct for multiple comparisons: Bonferroni divides the significance level by the number of comparisons [11]; Holm's step-down method (Holm, 1979) is a common alternative.
- **Segments.** Read as ideas for the next test, not results; Optimizely notes it applies no extra false-discovery control across segments, so segment hunting raises false wins [12].
- **Too good to be true.** Rerun or check tracking before believing a surprisingly large effect (Twyman's law) [8].
- **Money.** If the client gives a value per conversion, convert the lift and its interval into money per 1,000 visitors.
- **Archive.** Log every test, including losers and "no difference", so the business does not retest the same idea [8].

### Tools (as of Nov 2026)

Google Optimize ended on 30 September 2023; Google pointed users to third-party tools such as AB Tasty, Optimizely and VWO [14]. Shopify announced Rollouts in its Winter '26 Edition for scheduled theme changes and A/B tests inside the admin [15]; I found no help article to confirm plans or limits, so check in the store's admin. Optimizely's significance level is a setting, and it holds winners until minimum visitor and conversion counts are met [12]. Microsoft Clarity offers heatmaps and session recordings with a consent API and masking controls [26][27].

### Consent for analytics and session recording

This is general guidance, not legal advice. The client should check official guidance for each region or ask a qualified adviser.

**EU (GDPR and the ePrivacy Directive).** Article 5(3) of the ePrivacy Directive covers storing or reading information on a visitor's device, whether or not it is personal data [21]. The EDPB's guidelines (version 2.0, adopted 7 October 2024) say that JavaScript which tells the browser to send information back is "gaining access" under Article 5(3), and cover tracking pixels and unique identifiers too [21]. Analytics tags, testing scripts and session recorders usually run as JavaScript that sends information back, so treat them as needing consent unless the client's adviser confirms an exemption. Where consent is the basis, GDPR consent rules apply: a cookie wall that blocks content until people accept means consent is not freely given; scrolling or swiping is never consent; pre-ticked boxes are invalid; and withdrawing must be as easy as giving [22]. National regulators add detail. France's CNIL allows audience measurement without consent only under strict conditions: used only for the publisher, producing anonymous statistics, not combined with other data and not tracking people across sites; it recommends a cookie life of about 13 months and data kept no more than 25 months (page dated 4 July 2025) [23]. The CNIL page does not mention session replay, heatmaps or A/B testing [23].

**UK.** The Data (Use and Access) Act 2025 allows storage and access technologies without consent in certain low-risk situations; changes commence in stages between 2 and 12 months after Royal Assent on 19 June 2025 [24]. The Information Commission's final guidance (29 April 2026) says the statistics exception covers only aggregate statistics that improve your own service, with clear information and an easy way to object. It does not cover advertising or tracking individuals, and logs or recordings of individual visitors need consent [30]. So treat session recordings and heatmaps as needing consent in the UK, and check testing tools against that page. The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).

**US.** The California Consumer Privacy Act gives rights to know, delete and opt out of the sale or sharing of personal information, and a user-enabled global privacy control must be honoured as an opt-out by covered businesses [28]. Whether a given analytics or recording set-up counts as selling or sharing is a question for a qualified adviser.

**Tool settings.**

- *Google Analytics consent mode:* passes visitors' choices to Google tags. When analytics storage is denied, no analytics cookies are set or read. Basic mode blocks tags until consent; advanced mode loads tags and sends cookieless pings that Google uses to model missing data. Defaults can be set by region [25].
- *Microsoft Clarity:* from 31 October 2025, Clarity enforces consent signals for visits from the EEA, UK and Switzerland. Without consent it sets no cookies and gives each page view its own ID, so sessions are not joined up [26]. Masking defaults to "Balanced" (numbers and email addresses masked); input boxes and drop-downs are masked in every mode; masked content is never uploaded; masking changes are not retroactive [27].
- *Testing tools:* ask the vendor how it remembers which variant a visitor saw and how it works with your consent banner, and check this before launch.

**What consent does to your numbers.** If tags fire only for visitors who consent, test results describe consenting visitors. Say so in the readout, and keep the consent rate steady during a test (do not change the banner mid-test).

**Do not "optimise" consent with tricks.** Testing banner designs that hide the reject option or push acceptance runs against the EDPB's consent guidance [22], and the EU's Digital Services Act bans deceptive dark-pattern designs on online platforms [29]. For US and UK dark-pattern rules, see the conversion copywriter kit.

### AI in the work

AI is useful for sorting recordings notes, clustering survey answers, drafting hypotheses and running the sums in a readout. It must not invent numbers, benchmarks or results, must not claim to have watched recordings it has not seen, and must show every formula with the client's counts so a person can check it.

## 4. Benchmarks and numbers

Use these to frame expectations, never as targets.

- **Cart abandonment:** 70.22% average documented rate across 50 studies from 2006 to 2025 (Baymard, updated 28 October 2026) [17]. *Caveat:* an unweighted average of studies with different methods.
- **Why US shoppers abandon checkout** (Baymard, excluding "just browsing"): extra costs too high 40%, delivery too slow 20%, did not trust the site with card details 19%, forced to create an account 18%, checkout too long or complicated 17%, site errors or crashes 17% [17]. *Caveat:* sample size and survey year are not on the public page.
- **Checkout form fields:** the average checkout had 11.3 form fields in 2024, and most sites need only 8; 84% did not delay account creation [18]. *Caveat:* from Baymard's benchmark of large e-commerce sites; small shops may differ.
- **Usability test size:** five users find about 85% of usability problems in Nielsen's model (2000) [16]. *Caveat:* a model, for qualitative tests; quantitative studies need more people.
- **False wins from peeking:** in Miller's worked example, stopping at the first significant reading gave a 26.1% false-positive rate where 5% was intended [1].
- **Novelty:** a 28% click lift on a Microsoft News button faded over time [7]. *Caveat:* one example, shared to show the pattern.
- **Speed thresholds:** LCP 2.5 s, INP 200 ms, CLS 0.1 at the 75th percentile [19]. *Caveat:* thresholds, not averages.

No official or large published source gives a trustworthy "average conversion rate" across industries for small businesses. Use the client's own recent whole weeks as the baseline, long enough to cover normal ups and downs, split by device and traffic source.

## 5. Decision rules

- If something is clearly broken (a button, a form, a payment method, a page that errors), fix it now, because testing a bug wastes traffic.
- If the required sample cannot be reached within the client's agreed maximum run time, do not A/B test; ship the change as a dated judgement call and watch the trend, or test the idea where traffic is higher [1][2].
- If the actual split differs from the planned split by more than chance would explain, stop reading results and find the cause, because a sample ratio mismatch typically invalidates the test [5][7][10].
- If someone wants to stop a fixed-horizon test because it "hit significance", keep it running to the planned sample, because peeking inflates false wins [1]; use a sequential method next time if early looks matter [3][12].
- If a result looks too good, check tracking and rerun before shipping, because surprising effects are often errors (Twyman's law) [8].
- If the lift fades day by day, wait for it to settle before calling it, because it may be novelty [7].
- If more than two versions are compared with the control, correct for multiple comparisons [11].
- If a segment looks like a winner, treat it as the hypothesis for the next test, not a result [12].
- If a test uses separate URLs, add rel=canonical to the original, use a 302 redirect, and remove the test promptly when done [13].
- If a site serves visitors in the EU or UK, do not load analytics, testing or recording tools that read or store information on the device before consent, unless the client's adviser confirms an exemption [21][22][24].
- If a session-recording tool is turned on, check masking first and keep inputs masked [27].
- If the client asks to test banner designs that make "reject" harder, decline and offer to test clarity of wording with equal choices instead [22][29].
- If Fogg's three elements are not all present at the point of action, fix the missing one (motivation, ability or prompt) before testing small details [20].

## 6. Common mistakes, and how to spot them

- **Testing without research.** Spot it: test ideas such as "make the button green" with no finding behind them.
- **Underpowered tests.** Spot it: no sample size in the plan, or a run time of days on a low-traffic page [1][2].
- **Peeking and stopping early.** Spot it: "We stopped when it hit 95%" [1].
- **Ignoring a broken split.** Spot it: 52,000 visitors in one group and 48,000 in the other on a planned 50/50 split, and no one checked [5][7].
- **Many metrics, one winner picked after.** Spot it: the readout leads with whichever metric moved.
- **Segment fishing.** Spot it: "It lost overall but won on mobile in Germany on Tuesdays" [12].
- **Testing bugs.** Spot it: a test of a fix for a broken form.
- **Changing things mid-test.** Spot it: a sale launched halfway through.
- **Tracking before consent.** Spot it: analytics and recording requests in the browser before the banner is answered, for EU or UK visitors [21][26].
- **Recordings with personal data.** Spot it: names, emails or card numbers visible in replays [27].
- **SEO damage from tests.** Spot it: variant URLs in Google's index, or a 301 to a test page [13].
- **Copying other sites' winners.** Spot it: "Big brand X did it" as the reason.

## 7. Quality bar: what an expert checks before handing over

1. Does every recommendation cite its evidence (funnel step, recording pattern, user-test finding or quote)?
2. Are clear bugs separated from test ideas?
3. Does every test plan have a falsifiable hypothesis, one primary metric, guardrails, a sample size with inputs shown, a run time and stop rules?
4. Is the plan feasible at the client's traffic, and if not, does it say so plainly?
5. Is there a sample-ratio check in the plan and in the readout?
6. Does every rate show its counts, and every formula the client's numbers?
7. Are multiple comparisons corrected, and segments labelled as ideas?
8. Is the call stated first, with the two numbers that drive it?
9. Are consent and masking set correctly for each region before any tracking or recording goes live?
10. Is the test SEO-safe, and is every action at level 3 logged?

## 8. How this role writes

**Deliverables.**

- *Research report:* funnel table, top drop-offs, behaviour findings, user-test findings, and evidence for each.
- *Ranked fix list:* idea, evidence, payoff, confidence, effort, and fix-now, test or drop.
- *Test plan:* hypothesis, variant, primary metric, guardrails, randomisation unit, sample size working, run time, stop rules, SEO and consent checks, decision rule.
- *Readout:* the call first (ship, keep running, stop or rerun), then set-up checks, counts, rates, lift, interval, p-value, money per 1,000 visitors, novelty and segment notes, and what to test next.
- *Consent check:* tags and tools found, what fires before consent, settings by region, masking, and fixes.
- *Test log:* one line per test with date, hypothesis, result and lesson.

**Tone and conventions.** Plain words, numbers as numerals, every term explained once. Lead with the decision. Show the working in a box the client can skip. Say "not yet" or "we can't tell" when that is the honest answer. Never promise a lift.

## 9. Glossary

- **Conversion rate:** conversions divided by visitors (or sessions) in a period.
- **A/B test:** visitors randomly split between the current version (control) and a new one (variant).
- **OEC (Overall Evaluation Criterion):** the one agreed measure of success for tests [4].
- **Guardrail metric:** a measure that must not get worse, such as speed or refunds [6].
- **Minimum detectable effect (MDE):** the smallest change a test is sized to detect [2].
- **Significance level (alpha):** the chance of calling a difference when there is none [2].
- **Power:** the chance of detecting the MDE if it is real [2].
- **p-value:** how surprising the result would be if there were no real difference.
- **Confidence interval:** the range of differences consistent with the data.
- **Peeking:** checking a fixed-horizon test early and stopping when it looks good [1].
- **Sequential test:** a test designed to allow stopping early by a set rule [3].
- **False discovery rate:** the share of declared winners that are not real; some tools control it [12].
- **Sample ratio mismatch (SRM):** the groups' sizes differ from the planned split [5].
- **Chi-square goodness-of-fit:** the test used to check for SRM [10].
- **Bonferroni correction:** dividing alpha by the number of comparisons [11].
- **Novelty effect:** a short-lived lift because something is new [7].
- **Twyman's law:** a surprising result is more likely an error than a breakthrough [8].
- **A/A test:** both groups see the same thing, to check the set-up [6].
- **Core Web Vitals:** Google's loading, interactivity and stability measures [19].
- **Consent mode:** Google's way to pass visitors' consent choices to its tags [25].
- **Masking:** hiding page content from session recordings [27].
- **Cookie wall:** blocking content until a visitor accepts cookies [22].
- **Global Privacy Control (GPC):** a browser signal asking sites not to sell or share data [28].

## 10. What changes fast

Re-check at each refresh (every 30 days):

- **Testing tools:** Optimizely Stats Engine docs, Shopify Rollouts, VWO, Convert and other vendors' features, statistics methods and connectors [12][15].
- **Google:** Search Central testing guidance, consent mode, Core Web Vitals thresholds [13][19][25].
- **Microsoft Clarity:** consent enforcement and masking defaults [26][27].
- **EU:** EDPB guidance on Article 5(3) and consent, national regulators such as the CNIL, and any ePrivacy changes [21][22][23]; DSA dark-pattern enforcement [29].
- **UK:** commencement of the DUAA cookie changes and the Information Commission's storage and access guidance [24][30].
- **US:** CCPA regulations and state privacy laws [28].
- **Research:** Baymard's abandonment and checkout benchmarks [17][18]; Microsoft's experimentation publications [5][6][7][8].
