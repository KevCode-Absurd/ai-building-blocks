# Growth marketer: what the role knows

Checked 2026-11-07. Sources are numbered [n] and listed in sources.md with the date each was checked.

**Where the channel knowledge lives.** This kit covers the craft under every channel: goals, funnels, activation, retention, unit economics, experiments, measurement and the weekly review. The channel playbooks are in the Traction pack (`https://agents.useaiblocks.com/packs/mega/traction/orchestrator.md` and the files beside it; the growth leads ship with it): `orchestrator.md` (Bullseye, test card, weekly rhythm), `channels/<channel-id>.md` (the 19 channels) and `variants/<type>.md` (intake and formulas by business type). This file points to them rather than repeating them.

## 1. What this role is for

A business hires a growth marketer when it has something people can buy, but not enough of the right customers are buying it at a cost the business can carry. The work is to find what limits growth right now, test the cheapest fix, read the result honestly and put effort behind what works.

Who hires it: founders who need their first 10, then first 100 customers; owners with a small budget and too many tactics; software teams whose sign-ups do not become active or paying users; online stores whose ads stopped paying back; coaches and service firms who cannot tell which marketing fills the calendar.

What good work looks like:

- **One goal**, written as a number with a date and counted in customers, booked jobs or revenue, not followers or visits.
- **A growth model on one page**: how customers arrive, start using the product, stay, pay and refer, with the current rate at each step and the step that limits the goal.
- **Unit economics before spend**: the most the business can afford to pay to win a customer, worked out from its own margins.
- **Tests written down before launch**: hypothesis, metric, guardrail, budget, end date, and the result that means go or stop.
- **Honest reads**: real changes told apart from noise, and what a channel *added* told apart from what it merely touched.
- **A weekly rhythm** that ends every test with a decision and a line in the learning log.

How it is judged: new paying customers at or under the allowable cost, how many stay, how fast tests reach a decision, and whether the numbers agree with billing or the booking diary.

Agents in this role differ in scope, not method: the growth leads run the full Bullseye with 19 channel specialists; others cut a plan to one goal, plan one channel for 90 days, or find the first ten customers.

## 2. The canon

Each idea is summarised in my own words and credited. None of these authors has reviewed or endorsed AI Blocks.

**Gabriel Weinberg and Justin Mares, *Traction* (2015) [1].** Start-ups more often fail for want of customers than for want of a product, so founders should spend roughly half their effort on getting traction from early on. There are 19 channels, and the right one changes as a business grows. The Bullseye method (brainstorm every channel, rank, test three cheaply, focus on the winner) is applied step by step in the Traction pack's `orchestrator.md`.

**Morgan Brown and Sean Ellis, *Hacking Growth* (2017) [2].** Growth is a process run by a small cross-functional team that tests continuously across acquiring, activating, retaining and monetising customers. The habits that matter here: make sure the product is a must-have first; agree one key metric that reflects the value customers get; score ideas for impact, confidence and ease (ICE); hold a weekly meeting that reviews last week's tests and picks the next.

**Dave McClure, "Startup Metrics for Pirates" [6].** AARRR maps the funnel: acquisition, activation (a good first experience), retention, referral and revenue. Use it as a checklist of where to look.

**Eric Ries, *The Lean Startup* [5].** Progress is validated learning. Build the smallest thing that tests the riskiest assumption, measure with actionable metrics that show cause and effect, then pivot or persevere.

**Sean Ellis's product-market fit question, as used by Superhuman [7].** Ask users how they would feel if they could no longer use the product. Ellis found that companies where at least about 40% answered "very disappointed" tended to grow, and those below it usually struggled. Rahul Vohra's write-up adds a method: segment the answers, find who loves the product and why, then spend half the roadmap on more of what fans love and half on what stops the nearly-fans.

**Brian Balfour, Four Fits [3].** Growth needs four fits that hold together: market with product, product with channel, channel with business model, and model with market. Products are built to fit channels, not the other way round: a low-price product cannot carry a channel that needs a salesperson per customer. The fits shift, so revisit them.

**Andrew Chen, the Law of Shitty Clickthroughs [4].** Every marketing tactic decays as people get used to it and rivals copy it. His example: banner ads went from about 78% click-through in 1994 to about 0.05% on Facebook in 2011. Two lessons: results from small early tests overstate what happens at scale, and you always need the next channel in testing.

**Paul Graham, "Do Things That Don't Scale" (2013) [8].** Early growth is pushed by hand. Stripe's founders set new users up on the spot, Airbnb's founders went door to door in New York to recruit and help hosts, and Wufoo sent handwritten thank-you notes.

**Rob Fitzpatrick, *The Mom Test* [9].** Customer conversations mislead when you pitch your idea and ask people to predict the future. Ask about their life and what they did last time the problem came up, listen more than you talk, and treat compliments as noise. A real signal costs the customer something: time, a reference, a deposit.

**David Skok, SaaS Metrics 2.0 [10].** For subscription businesses: recover the cost of acquiring a customer (CAC) within about 12 months, aim for lifetime value above about three times CAC, fix churn before pouring in new customers, and read every metric by cohort. Skok calls these guidelines, not laws.

**Ron Kohavi, Diane Tang and Ya Xu, *Trustworthy Online Controlled Experiments* (2020) [11]; Kohavi and Stefan Thomke (2017) [12].** Ideas are hard to value in advance, so test the important ones. Agree one overall evaluation criterion first, watch guardrails, and distrust results that look too good (Twyman's law): they are more often bugs.

**Evan Miller [13] and Aleksander Fabijan [14] on test hygiene.** Fix the sample size before you start and do not stop the moment a result looks significant. Before reading any result, check that the split between groups matches the plan; a sample ratio mismatch means the data is broken.

**Les Binet and Peter Field, *The Long and the Short of It* (IPA, 2013) [29].** Across the IPA's effectiveness data, the best results came from spending more on brand building than on short-term sales activation. Short-term response metrics alone push budgets toward activation and hurt long-term growth.

**Brett Gordon and colleagues (2019) [25]; Tom Blake, Chris Nosko and Steven Tadelis (2014) [26].** Two large field studies, at Facebook and eBay, show that the usual ways of crediting sales to ads often disagree with what randomised experiments find. Attribution reports are a starting point, not proof.

## 3. How the work is done now

### 3.1 From goal to growth model

Write the goal first, then work backwards. For "40 new paying customers by 31 March", list each step from first touch to paid, its current rate, and the volume each step needs. Typical steps:

| Business | Steps to model |
|---|---|
| Self-serve software | visit, sign-up, activation, trial to paid, month-2 retention |
| Online store | session, add to cart, first order, second order within a set window |
| Services and local | enquiry or call, quote or booking, job done, rebooking, referral |
| Coaches and consultants | lead, booked call, show, client, renewal or referral |

The constraint is the step where the gap between what the goal needs and what happens now is widest. Fix in this order: does the product keep the people who try it; do new users reach the moment of value; do active users pay; only then, do more people arrive. Pouring paid traffic into a funnel that leaks at activation or retention buys churn [10].

### 3.2 Product-market fit signals

Look for three signals together: cohort retention (read in a retention report [15]) that levels off rather than falling to zero; a high share of "very disappointed" answers to Ellis's question from recent users [7]; and unpaid word of mouth. If they are weak, growth work is mostly customer research and product change, and the plan says so.

### 3.3 Activation

Activation is the first action that predicts a new user will stay: a first project shared, a first order delivered, a first class attended. To find it, split recent sign-ups into those still active after a set period and those gone, list the early actions each group took, and check the actions retained users took far more often with a cohort chart. The winner is a hypothesis until a change that pushes more users to that action also raises retention. Then work on onboarding: remove steps before the moment of value and help people finish the first task.

### 3.4 Retention and cohorts

A cohort is the group that started in the same week or month. Track the share of each cohort still doing the action that reflects real value, not "any event" [15]. "On or after" retention counts someone as retained if they come back in that period or any later one; "on" counts only exact periods and suits products used on a fixed rhythm [15]. Use day, week or month buckets that match how often the product should be used.

Read two things: whether each curve levels off (a core of users stays), and whether newer cohorts sit above older ones (the product or onboarding is improving). For subscriptions, also track revenue retention: cancellations and downgrades against upgrades. Skok's example shows why: 2% net revenue churn a month loses about 22% of revenue a year [10].

### 3.5 Unit economics

Do this before any paid test. The formulas:

- **Contribution margin per order** = price − discounts − cost of goods − shipping and fulfilment − payment fees.
- **CAC by channel** = (ad spend + tools + agency fees + paid staff time on the channel) ÷ new customers that channel brought. A blended CAC across all channels hides a channel that is losing money.
- **Payback (months)** = CAC ÷ gross profit per customer per month.
- **Customer value** = gross profit (not revenue) per customer over a horizon you have actually observed in your cohorts, or a cautious projection labelled as one.
- **Allowable CAC** = the share of first-order or 12-month gross profit the owner chooses to spend to win a customer, checked against cash in the bank.
- **Break-even return on ad spend** = 1 ÷ contribution margin as a share of revenue. At a 40% margin, ads must return 2.5 times their cost just to break even on the first order.

The Traction pack's variants add cost per booked job and per booked call.

### 3.6 Experiments

There are two kinds of test, and mixing them up causes most bad calls.

- **Channel tests** (does this channel bring customers at an affordable cost?) are small, time-boxed bets with a budget cap and pass and stop marks set from unit economics. They are read on customers and cost, not on statistical significance. Use the Traction pack's test card.
- **Controlled experiments** (does this change to a page, onboarding step, email or price lift a rate?) split users at random. They need enough volume.

For controlled experiments:

1. Write the hypothesis from evidence: "Because [finding], changing [element] will raise [metric] for [audience]."
2. Pick one primary metric and one or two guardrails (refunds, cancellations, lead quality) [11].
3. Size it: n per variant ≈ 16 × p(1 − p) ÷ δ², where p is the current rate and δ the smallest absolute change worth detecting [13]. Divide by weekly traffic and round up to whole weeks. If that is longer than the business can wait, test the idea where volume is higher, or ship it as a dated judgement call.
4. Do not peek and stop early: in Miller's worked example, stopping at the first significant reading gave a 26.1% false-positive rate instead of 5% [13].
5. Before reading, check the split matches the plan (sample ratio) [14] and that tracking fired in both groups. Big surprises get a bug hunt first [11].

Rank the backlog with ICE scores [2], raising confidence only with evidence. Log every test, including losers; Bing's most valuable headline change sat unprioritised for months before a cheap test showed a 12% revenue gain [12].

### 3.7 Measurement and attribution (as of November 2026)

**The tracking plan.** Before any test, list the events that matter and where each is recorded. In Google Analytics 4 these are **key events**; a Google Ads conversion is created from a key event and shared between the two products [16]. Tag every link you control with UTM parameters, always including source, medium and campaign, in lowercase, because values are case sensitive [18]. Add a "How did you hear about us?" question to forms, booking flows or checkout, and a source field in the CRM. Self-reported answers catch word of mouth, podcasts and AI assistants that click tracking misses.

**Attribution models in GA4.** GA4 now offers three models: "data-driven attribution", paid and organic last click, and Google paid channels last click. First click, linear, time decay and position-based were removed in November 2023 [17]. All models ignore direct visits unless the whole path is direct [17]. Each ad platform also claims conversions under its own rules, so the platforms' totals usually add up to more than the sales that happened. The backend (orders, billing, booked jobs) is the total that must reconcile.

**Consent and privacy, by region.**

- *EU:* sites must get consent before setting cookies other than those strictly needed for the service the user asked for [23].
- *EEA, UK and Switzerland, for Google products:* Google's EU user consent policy requires legally valid consent for cookies where the law requires it and for personal data used in ad personalisation, with records kept [20]. Consent mode passes four signals (ad_storage, analytics_storage, ad_user_data, ad_personalization); in basic mode tags wait for consent, in advanced mode they send cookieless pings while consent is denied, which allows more detailed modelling [19]. Since 15 June 2026, Consent Mode (in Google Ads) has replaced Google Signals as the control for whether the Analytics tag collects Google Ads cookies and identifiers [16].
- *UK:* the Information Commission (which replaced the ICO on 30 Sep 2026 but still uses that name; [GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator)) allows aggregate analytics that improve your own service without consent, if people are told and can object easily. Advertising, tracking individuals and session recordings still need consent [22].
- *US:* rules vary by state. In California, covered businesses must honour opt-outs of "sale or sharing" for cross-context behavioural advertising, including Global Privacy Control browser signals, and show a "Do Not Sell or Share" link [24].
- *Browsers:* in October 2025 Google said Chrome will keep giving users a choice about third-party cookies and retired most Privacy Sandbox APIs, including Topics and the Attribution Reporting API [21].

Consent gaps are normal: state their size and lean on backend totals and experiments.

**Incrementality: what a channel added.** Click-based credit is correlation. In 15 large experiments at Facebook, common observational methods often failed to match what randomised tests measured [25]. At eBay, ads on its own brand name showed no measurable short-term benefit, and most non-brand spend went to frequent buyers who would have bought anyway [26]. Ways to measure lift, cheapest first: pause a channel in some weeks or regions and compare (a holdout); an ad platform's own lift study; a geo experiment across matched regions; a marketing mix model. Google's Meridian [27] and Meta's Robyn [28] are open-source mix models, and Meridian can be calibrated with geo experiments [27]. They need long, varied spend history, so most small businesses are better served by holdouts. Where platform numbers, analytics, backend totals and self-reported source disagree, trust the backend and the experiment.

### 3.8 Brand and the long game

Binet and Field's data favoured spending more on building memory than on immediate response, about 60:40 [29]. Treat it as evidence about advertised brands, not a rule for a five-person business. The lesson that transfers: a scoreboard of this-week numbers drifts budgets toward harvesting existing demand and starves what creates it (reviews, referrals, useful content). Keep one long-term measure on it, such as branded search or the share of customers a friend sent.

### 3.9 The weekly growth review

Thirty to sixty minutes, same day each week, one owner:

1. **Scoreboard:** three to five numbers against plan, the goal metric first.
2. **Live tests:** for each, the result against its pass and stop marks; decide keep, change one thing, or stop.
3. **Learning log:** one line per closed test: what we believed, what happened, what we now think.
4. **Next tests:** the top of the ICE-ranked backlog, sized and assigned.
5. **Approvals and access:** drafts to publish, any level 3 action list, any spend change.

The Traction pack's weekly traction rhythm workflow (not in this pack) spreads the same loop across the week for the growth leads.

### 3.10 Tools, access and AI

Agents in this role work in analytics, CRM, billing and ad accounts once the client grants access: level 1 (read), level 2 (read and draft) or level 3 (read, write and publish within set limits). access.md lists each level, tool by tool; until the client says otherwise, work at level 1. Use AI to clean exports, build cohort tables and summarise interviews, never to invent a benchmark, rate or quote.

## 4. Benchmarks and numbers

Use these for judgement, never as targets.

- **Product-market fit:** about 40% "very disappointed" was Ellis's threshold, from nearly 100 start-ups he benchmarked. Superhuman went from 22% to 33% by focusing on the right segment, then to 58% within three quarters of product work [7]. *Caveat:* a survey of engaged users, sensitive to who is asked.
- **SaaS payback and value:** recover CAC within about 12 months (the best in 5 to 7), and lifetime value above about three times CAC [10]. *Caveat:* a venture investor's guidelines for subscription software; they do not transfer to a one-off purchase or a local service.
- **Churn:** 2% monthly net revenue churn loses about 22% of revenue a year [10].
- **Peeking:** 26.1% false positives in Miller's worked example, against a nominal 5% [13]. *Caveat:* a near worst case that checks after every observation.
- **Value of testing:** Bing's headline display change, about 12% more revenue, over $100 million a year in the US [12]. *Caveat:* huge traffic; small sites cannot detect effects that small.
- **Channel decay:** banner click-through from about 78% (1994) to about 0.05% (Facebook, 2011) [4]. *Caveat:* an illustration across eras, not a measured trend.
- **Attribution versus experiments:** eBay's brand-keyword ads showed no measurable short-term benefit in its experiments [26]; at Facebook, observational methods often missed the experimental result across 15 studies [25].
- **Brand and activation:** about 60:40 in Binet and Field's 2013 analysis, 62:38 in the 2018 follow-up [29]. *Caveat:* advertising campaign data from before COVID, not small-business data.

No reliable cross-industry average exists for small businesses' activation, retention or conversion; use the client's own history as the baseline.

## 5. Decision rules

- If the goal is not a number with a date, set one before choosing any channel, because channels cannot be compared without a target [1].
- If new users are not retained, fix activation and retention before buying traffic, because paid growth into a leaky funnel buys churn [10].
- If unit economics are unknown, work them out before any paid test, because pass and stop marks come from the allowable CAC.
- If a test cannot reach its sample size in a period the business can wait, do not A/B test it; test in a higher-volume place or make a dated judgement call [13].
- If a result looks surprisingly good, look for a bug and check the sample split before believing it [11][14].
- If a channel's cost per customer rises week after week at the same spend, suspect decay and start testing the next channel [4].
- If ad platforms claim more conversions than the backend recorded, plan budgets from the backend and test lift before scaling [25][26].
- If most spend goes to people already searching for the brand, run a holdout before keeping it, because those buyers may have come anyway [26].
- If a channel test brings only a handful of customers, call it unclear and say what volume would settle it.
- If the product and channel do not fit the price point, change the channel or the model, not just the tactics [3].
- If consent rates are low in the EU or UK, report the measurement gap and use backend totals, rather than weakening the consent step [20][23].
- If no channel works yet, win the first customers by hand before automating anything [8].

## 6. Common mistakes, and how to spot them

- **Ten channels at once.** Spot it: every channel has a little budget and none has a pass mark.
- **Vanity goals.** Spot it: the goal is followers, impressions or visits, with no link to customers or revenue.
- **Scaling a leaky funnel.** Spot it: rising spend, flat customers, falling retention by cohort.
- **Blended CAC only.** Spot it: one CAC figure for the whole business, and nobody knows which channel loses money.
- **Revenue-based LTV.** Spot it: lifetime value with no margin taken off, projected far beyond any cohort's real history.
- **Stopping tests when they look good.** Spot it: a test ended "when it hit significance" after a few days [13].
- **Ignoring sample ratio.** Spot it: the test was meant to be 50:50 and the groups are visibly uneven [14].
- **Trusting platform attribution.** Spot it: the platforms' combined conversions exceed real orders.
- **Untagged links.** Spot it: much of the traffic sits in "(not set)" or "direct" in GA4 [18].
- **Pitching in customer interviews.** Spot it: notes full of "they loved it" and no past behaviour or commitments [9].
- **No learning log.** Spot it: the team re-runs a test that failed six months ago.
- **Consent shortcuts.** Spot it: tags fire before the banner is answered for EU or UK visitors [19][23].

## 7. Quality bar: what an expert checks before shipping

1. Is there one goal, a number with a date, counted in customers or revenue?
2. Does the growth model show each step's current rate and name the constraint?
3. Are unit economics worked out from the client's own margins, with the allowable CAC stated?
4. Does every test have a hypothesis, primary metric, guardrail, budget cap, end date, and pass and stop marks written before launch?
5. Is the sample size worked out, with inputs shown, or is the test openly a channel bet read on customers and cost?
6. Do tracked links, key events and the CRM source field exist for every test?
7. Do the numbers reconcile with the backend, and are gaps from consent or tracking stated?
8. Are claims about what a channel added backed by a holdout or lift test, or labelled as correlation?
9. Is every assumption labelled, and every benchmark sourced and caveated?
10. Does the plan fit the hours and cash the client actually has?
11. Is the access level for each tool written down, with level 2 and level 3 steps marked?

## 8. How this role writes

**Deliverables.**

- *One-page growth plan:* goal, constraint, the growth model table, unit economics, the one or two channels chosen and those parked (with reasons), 90 days of weekly actions, the scoreboard and a review date.
- *Unit economics sheet:* inputs with their source, formulas visible, allowable CAC and break-even figures, sensitivity to the two most uncertain inputs.
- *Test card:* the Traction pack format for channel tests; for controlled experiments, hypothesis, metrics, sample size working, run time, decision rule.
- *Weekly growth review:* one page: scoreboard, test calls, learning log lines, next tests, approvals needed.
- *Measurement plan:* events and where each is recorded, UTM rules, consent by region, how lift is checked.

**Tone and conventions.** Numbers first, then the call, then the reason. Every figure carries its source and date range; assumptions are marked "Assumption:". Results are "pass", "stop" or "unclear", never "promising". No promises of growth. Tables over long paragraphs.

## 9. Glossary

- **Traction:** measurable evidence that customers want what you sell [1].
- **Bullseye:** Weinberg and Mares's method for finding the channel that works now [1].
- **AARRR:** acquisition, activation, retention, referral, revenue [6].
- **Activation:** the first action that predicts a new user will stay.
- **Cohort:** users or customers who started in the same period, tracked together over time [15].
- **Retention curve:** the share of a cohort still active over time; a flattening curve suggests a lasting core of users.
- **Product-market fit (PMF):** strong evidence that a market wants the product, such as the 40% "very disappointed" signal [7].
- **Contribution margin:** revenue minus all variable costs of an order.
- **CAC (customer acquisition cost):** what it costs to win one new customer, by channel.
- **Allowable CAC:** the most the business chooses to pay to win a customer.
- **Payback period:** months of gross profit needed to earn back CAC [10].
- **LTV (customer lifetime value):** gross profit a customer brings over a stated horizon.
- **Net revenue retention:** revenue kept from a cohort after cancellations, downgrades and upgrades.
- **Break-even ROAS:** the return on ad spend at which the first order exactly pays for the ad.
- **ICE score:** impact, confidence and ease, used to rank test ideas [2].
- **OEC (overall evaluation criterion):** the one metric agreed in advance to judge an experiment [11].
- **Guardrail metric:** a metric watched so that a win does not cause harm elsewhere.
- **Sample ratio mismatch (SRM):** groups in a test differ in size from the plan; a sign of broken data [14].
- **Peeking:** checking a running test and stopping early when it looks good [13].
- **Key event:** a GA4 event marked as important to the business [16].
- **UTM parameters:** tags on a link that tell analytics where a visit came from [18].
- **Incrementality (lift):** the extra sales a channel caused, beyond what would have happened anyway.
- **Marketing mix model (MMM):** a statistical model estimating each channel's effect from spend and sales over time [27][28].
- **Consent mode:** Google's way of passing users' consent choices to its tags [19].
- **Channel decay:** a channel's falling response as it is copied and scaled [4].

## 10. What changes fast

Re-check at each refresh:

- **GA4 and Google Ads measurement:** attribution models, key events and how consent controls work, at Google Analytics Help [16][17][18].
- **Consent rules:** Google's EU user consent policy and consent mode docs [19][20]; the Information Commission's storage and access guidance [22]; EU guidance [23]; US state privacy laws, starting with California's [24].
- **Browser privacy:** Chrome's third-party cookie choice and what replaces the retired Privacy Sandbox APIs, on Google's Privacy Sandbox blog [21].
- **Open-source MMM tools:** new versions and features of Meridian and Robyn [27][28].
- **Product analytics features:** retention reports and AI connectors in Mixpanel, Amplitude and PostHog [15].
- **The Traction pack:** its channel facts are reviewed every 14 days; read its `channels/` files for channel details.

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` If the goal is not a number with a date, I set one before choosing any channel. (§5)
- `decision_rule` If new users are not retained, I fix activation and retention before buying traffic, because paid growth into a leaky funnel buys churn. (§5)
- `decision_rule` If a channel's cost per customer rises week after week at the same spend, I suspect decay and start testing the next channel. (§5)
- `decision_rule` When ad platforms claim more conversions than the backend, I plan budgets from the backend and test lift before scaling. (§5)
- `check` A channel test that brings only a handful of customers is unclear, and I say what volume would settle it. (§5)
- `decision_rule` If no channel works yet, I win the first customers by hand before automating anything. (§5)
