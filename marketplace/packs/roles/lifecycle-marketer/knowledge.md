# Retention and lifecycle marketer: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. Texting rules, platform features and benchmarks change often; each fact says when it was true. This is general guidance, not legal advice. Where a send, a consent form or a cancel flow turns on what the law requires, the client checks with a qualified adviser.

**What this kit leaves to other kits.** The email marketing specialist kit covers mailbox provider sender rules, SPF, DKIM and DMARC, deliverability recovery, HTML email builds, and its own US, UK and EU email consent table. Its `lifecycle-flow-builder` skill writes welcome, nurture, post-purchase, win-back and sunset emails. The customer success manager kit covers subscription cancellation law in more depth, including EU rules. Load those kits when a job turns on them. This kit adds what sits on top: repeat-purchase maths, timing from order data, SMS, subscriptions, honest cancel and pause paths, loyalty perks and measuring what retention work really adds.

## 1. What this role is for

A business hires a retention and lifecycle marketer when it is paying to win customers who buy once and never come back. The job is to get the second order, then the habit: the reorder that arrives when the product runs out, the subscription people keep because it suits them, and the win-back that brings lapsed buyers back without training everyone to wait for a discount.

**Who hires it.** Online shops selling things people use up (coffee, tea, pet food, skincare, supplements, cleaning products); subscription box and "subscribe and save" brands; shops with a big list of one-time buyers; and any store whose email and text programme is a stream of sale blasts.

**The work.**

- **Read the data:** repeat purchase rate, days from first to second order, retention by monthly cohort, and where subscribers drop out.
- **Time the messages:** reorder reminders timed to how long the product lasts; win-back timed to each customer's usual gap.
- **Run SMS beside email:** who has agreed to texts, what earns a text, how often, at what hours, and how people stop.
- **Design subscriptions:** the offer, the margin after the discount repeats every month, the first-box experience, and pause, skip and cancel paths that are easy and honest.
- **Loyalty perks:** only where they pay for themselves, and tested.
- **Measure what is added:** revenue that would not have happened without the message, not just revenue that happened after it.

**What good work looks like.**

- Every texted number and emailed address has a consent record the client can show.
- Every flow has a trigger, a wait, a goal and a stop rule, and stops the moment someone buys.
- Discounts are rare, approved and margin-checked, and never presented with fake deadlines.
- Cancelling is as clear as joining; save offers fit the reason and accept a no.
- Results are read against a holdout group or a before-and-after cohort, not from platform-attributed revenue alone.

**How it is judged.** Share of first-time buyers who order again, and how fast; subscriber retention at months 1, 2, 3 and 6; revenue per recipient for flows; opt-out and complaint rates; margin after discounts; and complaints about cancelling.

**Access.** This agent reads data at level 1, builds flows switched off and campaigns unsent at level 2, and switches on flows or sends approved messages only with level 3 access, within the client's limits (see `access.md`). Texts cannot be called back, so every level 3 send list names the segment, the count and the send time.

## 2. The canon

**Frederick Reichheld, Bain & Company.** Reichheld's work made retention a profit question. In a 2001 Bain brief he argued that building loyal relationships with the best customers is a firm's biggest chance to contain costs, and that small gains in retention produce large profit gains [22]. His book *The Loyalty Effect* (1996) is the longer case. The working lesson: before buying more new customers, find out how many of the last ones came back, and why not.

**Peter Fader, Bruce Hardie and Ka Lok Lee, "Counting Your Customers the Easy Way" (*Marketing Science*, 2005) [23].** The BG/NBD model predicts future buying from past buying, for use in lifetime value work, and the authors show it can be fitted in a spreadsheet [23]. Fader's book *Customer Centricity* (2012) is the follow-on reading for managers. The working lesson for a small shop: "lapsed" depends on each customer's own rhythm. Someone who bought monthly and has gone quiet for three months is a different case from someone who buys twice a year.

**Byron Sharp, *How Brands Grow* (Oxford University Press, 2010) [24].** From the Ehrenberg-Bass Institute, a book of evidence-based laws about buying and brand performance [24]. A retention marketer reads it as a check: loyalty schemes and perks can feel like growth while changing little. Test a perk against a holdout before scaling it.

**Robbie Kellman Baxter, *The Membership Economy* (2015).** Background reading on subscription and membership businesses, worth having to hand when designing a subscription offer and its first-box experience.

**Holdout testing.** The method behind honest retention reporting: keep a random group out of a message or a whole programme and compare what each group does. Klaviyo's global holdout groups exist for this [21]; smaller shops do it by hand.

**Permission.** Seth Godin's *Permission Marketing* and the consent standards are covered in the email marketing specialist kit. They apply to texts with more force, because a text reaches a phone in a pocket.

## 3. How the work is done now

### The retention stack (as of Nov 2026)

- **Store platform:** orders and customers, the raw data for every cohort.
- **Email and SMS platform:** flows, campaigns, segments, consent fields. Klaviyo is common for Shopify stores; others work the same way.
- **Subscription app:** plans, billing, the customer portal. In Shopify Subscriptions, customers can pause, skip or cancel from the Subscriptions tab of their customer account, and the app emails each customer 3 days before every recurring charge (as of Nov 2026) [28].
- **Reporting:** platform dashboards for sends, plus a spreadsheet for cohorts, because platform-attributed revenue overstates impact (see below).

### Flows do the steady work

Klaviyo's 2026 benchmarks, from over 183,000 of its customers, show flows ahead of campaigns on clicks in both email and SMS, and say flows produce about 41% of email revenue from 5.3% of sends [18][19]. The pattern matches the shape of the job: a message timed to something the customer just did beats a broadcast. Writing the emails themselves is covered by the email kit's `lifecycle-flow-builder`; this kit decides which flows, when, and on which channel.

The order to build them in, for most shops: welcome (first order), cart and browse follow-up, post-purchase (use it well, then the second order), reorder or replenishment, win-back, sunset. Each one gets one goal and a stop rule.

### Timing from the data

- **Second order:** measure the days from first to second order for customers who did reorder, by product. Send the reorder nudge before the typical gap, not after it.
- **Replenishment:** if a bag or tub lasts a known time, time the reminder to arrive a few days before it runs out, adjusted for delivery time.
- **Lapse:** set "lapsed" per product or per customer rhythm, not one number for the whole shop.
- **Cohorts:** group customers by the month of their first order and track what share orders again in each later month. A change that works shows up as a lifted curve in later cohorts.

### Measuring what retention work adds

- **Attribution is not impact.** Klaviyo's default is last-touch attribution with 5-day windows for email opens, email clicks and SMS clicks (as of March 2026), so an order placed within five days of an open is credited to the email even if the customer was going to buy anyway [20].
- **Holdouts show the real lift.** Klaviyo's global holdout groups withhold marketing from a set share of profiles and report the lift; Klaviyo suggests about 5% for about 3 months, and the feature needs at least 400,000 profiles (as of Nov 2026) [21]. Smaller shops build their own: keep a random group out of one flow and compare second-order rates.
- **Revenue per recipient** (attributed revenue divided by delivered messages) is the usual way to compare flows, and it carries the same attribution caveat.

### Consent for email and texts by region (general guidance, not legal advice)

Email consent is not text consent; each needs its own clear yes [5][8]. For email, in short: the US is opt-out under CAN-SPAM, with every commercial email offering a way to stop that is honoured within 10 business days [1]; the UK needs permission for marketing email, with the soft opt-in for existing customers [11][12]; the EU needs prior opt-in, with an exception for a company's own customers and similar products [14]. The email marketing specialist kit has the full email table. The FTC's CAN-SPAM guide says nothing about texts [1]; texts fall under the TCPA and carrier rules.

| | United States | United Kingdom | European Union |
|---|---|---|---|
| Main rules | TCPA rules in 47 CFR 64.1200 [2]; carrier rules; some state laws | PECR, plus UK GDPR [11][12] | National ePrivacy laws, plus GDPR [14][15] |
| Consent for marketing texts | Prior express written consent for automated marketing texts: a signed (e-signature allowed) agreement naming the number, with a clear disclosure, and not a condition of purchase [2] | Permission needed [11]; existing customers can get texts about similar goods and services under the soft opt-in; charities have their own soft opt-in since the Data (Use and Access) Act 2025 [12] | Prior opt-in; consent must be freely given, specific, informed and unambiguous; silence and pre-ticked boxes do not count [15]. France, for example, allows the customer exception only for similar products after a real sale; creating an account is not enough [16] |
| Stopping | Any reasonable way counts, including STOP, QUIT, END, REVOKE, OPT OUT, CANCEL and UNSUBSCRIBE; no single required method; honour within 10 business days; one confirmation text with no marketing, presumed fine if sent within five minutes [2][3]. Klaviyo dates these rules from 11 April 2025 [4] | Every text must offer a way to opt out, such as replying STOP [11] | People can object at any time and the business must stop [14]; local-language keywords as well as STOP (for example HILFE and STOPP in German) [17] |
| Sender identity | Identify the business in messages [5][10] | Say who you are [11]; a branded sender ID cannot receive replies, so it needs an unsubscribe link [13] | Each message must show who sent it [16] |
| Hours | No telephone solicitations before 8 a.m. or after 9 p.m. recipient local time [2]; some states are stricter [5] | Not fixed in the sources checked; use a cautious window | Varies; France is stricter (8 a.m. to 10 p.m., no Sundays or public holidays, enforced by carriers, per Klaviyo) [17] |
| Frequency | Florida, Oklahoma, Oregon and Maryland limit promotional texts to 3 per person per rolling 24 hours (Klaviyo, Jan 2026) [6] | No figure in the sources checked | No figure in the sources checked |

**US carrier and platform rules (as of Nov 2026).**

- **Registration.** Anyone sending application-to-person texts over a US 10-digit long code must register a brand and a campaign (purpose, how people opt in, how they opt out and get help); unregistered traffic pays extra carrier fees [9].
- **Cart texts.** Carriers require double opt-in before cart reminder texts, one text per cart flow, sent within 48 hours, and sign-up wording that mentions cart reminders [7].
- **Platform policy.** Twilio requires consent per sender and per subject, proof of consent on request, "Reply STOP to unsubscribe" or similar in the first message, and sender identification in each message (policy updated 13 Apr 2026) [10].
- **Content.** CTIA, the wireless trade group, has no legal power but carriers can suspend senders who break its guidelines; sex, hate, alcohol, firearms and tobacco content is restricted [5].
- **Penalties.** Private TCPA suits seek $500 per violation, and courts can treble that for knowing or wilful breaches (Klaviyo's summary, Sep 2026) [5].
- **Open item.** The copy of 47 CFR 64.1200 I could read links an amendment published 26 Oct 2026 that I could not open [2]. Check the official eCFR text before relying on any detail above.

**UK and EU detail.** The ICO's PECR guidance and EUR-Lex block automated reading, so the UK and EU rows lean on GOV.UK, EU and CNIL pages plus Klaviyo's labelled summaries [11][12][13][16][17]. The email marketing specialist kit lists the ICO pages; read them first-hand before a UK launch.

### Subscriptions and cancel paths (general guidance, not legal advice)

- **US federal.** The FTC announced its click-to-cancel rule on 16 October 2024, revised it in February 2026 to conform to federal court decisions, and in March 2026 asked for comment on new negative option rules (docket FTC-2026-0265) [25]. Treat the federal position as unsettled and check the page at each refresh.
- **California.** Since 1 July 2025 the automatic renewal law requires express affirmative consent, online cancellation for people who joined online, a yearly reminder, notice 7 to 30 days before an accepted price change, and notice 3 to 21 days before a free or discounted trial longer than 31 days ends (Attorney General alert, 4 Sep 2025) [26].
- **UK.** The government published its response on the new subscription contracts regime on 2 April 2026: clearer pre-contract information, reminders before renewals and straightforward ways to cancel, with secondary legislation still to come and no start date on the page [27]. Separately, the CMA's guidance treats making people take onerous or disproportionate steps to use their rights as a sign of an aggressive practice, with a multi-click cancellation example [29].
- **EU.** See the customer success manager kit.

### Offers, urgency and discounts

- **Fake deadlines are banned outright in the UK.** Falsely saying a product is available only for a limited time is a banned practice under the DMCC Act; the CMA's examples include a countdown timer that resets, and it calls a "Be quick!" sales pop-up misleading when stock is high [29].
- **EU:** claiming an offer is limited in time when it is not is unfair; the EU's example is a 24-hour discount that came back a week later [30].
- **Margin first.** A subscription discount repeats every month; a win-back code goes to people who might have come back anyway. Check both against margin and a holdout.

### AI in the work

AI is useful for reading order exports, building cohorts, drafting message variants and checking a draft against consent and timing rules. It must not invent offers, stock levels, reviews or deadlines, and it does not decide who gets texted. Klaviyo publishes an MCP server for AI tools; connection details are in `access.md`.

## 4. Benchmarks and numbers

Use these to frame expectations, never as targets. The client's own cohorts are the real baseline.

- **Klaviyo SMS, 2026:** campaign click rate 5.6% (top 10%: 10.44%), flow click rate 9.65% (top 10%: 16.6%); order rate 0.27% for campaigns and 1.9% for flows [18]. *Caveats:* Klaviyo customers only, and the page's advice is aimed at online shops; no data period or metric definitions on the page.
- **Klaviyo email, 2026:** campaign click rate 1.69%, flow click rate 5.58%; flows about 41% of email revenue from 5.3% of sends [19]. *Caveat:* the page's industry order-rate table does not match its own "13 times higher" claim for flows, so I use its click rates only.
- **Attribution window:** 5 days by default for email opens, email clicks and SMS clicks in Klaviyo (Mar 2026) [20]. *Caveat:* a reporting setting, not a measure of impact.
- **Holdout size:** about 5% for about 3 months, per Klaviyo, for accounts with at least 400,000 profiles [21]. *Caveat:* a vendor default; smaller lists need a bigger share or a longer test to see a difference.
- **Legal and platform clocks:** text opt-outs within 10 business days in the US [2]; email opt-outs within 10 business days under CAN-SPAM [1]; Shopify Subscriptions reminder 3 days before each charge [28]; California notice windows of 7 to 30 days and 3 to 21 days [26]; 3 promotional texts per 24 hours in four US states [6]; 8 a.m. to 9 p.m. for US telephone solicitations [2].

I found no trustworthy published figure for a "good" repeat purchase rate or subscription churn rate across small shops. Compare the client's cohorts with their own earlier cohorts.

## 5. Decision rules

- If a phone number has no record of a clear yes to marketing texts, do not text it, because email consent is not text consent and US, UK and EU rules all expect consent for marketing texts [2][5][11][15].
- If the client wants to text a list from another brand, a lead seller or a contest partner, refuse, because consent cannot be shared across brands or bought [5][10].
- If a cart text is planned for US numbers, check double opt-in and the sign-up wording first, and send at most one text per cart within 48 hours, because carriers require it [7].
- If an opt-out arrives in any form (a reply other than STOP, an email, a call), remove text consent in the platform, not just the list, because any reasonable request counts [2][5].
- If a send would land outside 8 a.m. to 9 p.m. in the recipient's time zone, or the client texts people in stricter states or countries, move it, because hours are set by the recipient's location [2][5][17].
- If a customer in Florida, Oklahoma, Oregon or Maryland could get more than three promotional texts in 24 hours across campaigns and flows, add a frequency cap [6].
- If the reorder flow fires at one fixed day for every product, re-time it per product from the gap between first and second orders.
- If attributed revenue is the only evidence a flow works, set up a holdout before adding more discount to it [20][21].
- If a discount is proposed, work out the margin after it, after shipping, and (for subscriptions) after it repeats; if the client still wants it, get approval in writing.
- If a deadline, stock count or "last chance" is not true on the day it sends, cut it, because false urgency is banned in the UK and unfair in the EU [29][30].
- If a cancel flow has more steps than the sign-up, cut steps until it does not, because regulators treat hard cancelling as a warning sign [26][29].
- If a subscriber cancels, offer at most one save that fits the stated reason, keep the cancel option visible, and process the cancel on a no.
- If the client sells subscriptions to California consumers, the UK or the EU, check that place's current notice and cancel rules before changing renewals or price [26][27].
- If a loyalty perk is proposed, cost it per member and test it on a sample against a holdout before rolling it out.

## 6. Common mistakes, and how to spot them

- **Texting the email list.** Spot it: an SMS segment built from "everyone with a phone number" collected at checkout for delivery updates.
- **One consent box for two channels.** Spot it: a single "send me offers" checkbox on a form that adds both email and SMS [8].
- **Cart texts without double opt-in.** Spot it: a US cart text flow fed from a single opt-in form [7].
- **Ignoring opt-outs that are not STOP.** Spot it: replies like "please stop" or "remove me" sitting unread in the inbox [2][4].
- **Discount creep.** Spot it: every flow ends with a code, and repeat buyers wait for sales.
- **Flows that do not stop.** Spot it: "your cart is waiting" after the order arrived.
- **Crediting the flow with orders that would have happened.** Spot it: a report that sums attributed revenue across flows and calls it the programme's value [20].
- **One "lapsed" rule for every product.** Spot it: a 90-day win-back trigger on both a monthly coffee and a yearly gift box.
- **The maze cancel flow.** Spot it: a forced call, repeated offers after a no, or a cancel link hidden behind a support form [26][29].
- **Fake urgency.** Spot it: a countdown that resets, or "only 3 left" from a template [29].
- **Texting at 7 a.m. their time.** Spot it: a campaign scheduled in the shop's time zone for a list spread across time zones [2].

## 7. Quality bar: what an expert checks before handing over

1. Does every SMS and email segment have a consent basis the client can show, kept separate by channel [5][8]?
2. Are the opt-in wording, the first text and the help and stop replies set up, with the business named [7][10]?
3. Does every flow have a trigger, waits, one goal, a stop rule on purchase, and a frequency cap where needed [6]?
4. Are send times inside the recipient's allowed hours, including stricter states and countries [2][17]?
5. Is every offer, price, deadline and stock claim confirmed by the client and true on the send day [29][30]?
6. Is every discount margin-checked and approved, with subscription discounts checked over several months?
7. For subscriptions: are renewal reminders, price-change notices and the cancel path in line with the places the client sells to [26][27]?
8. Is there a measurement plan: the main metric, the guardrails (opt-outs, complaints, cancels) and a holdout or cohort comparison [21]?
9. Is the access level for each tool written down, with the level 3 send list and limits approved?
10. Could the client defend every message to a regulator, a carrier and an annoyed customer?

## 8. How this role writes

**Deliverables.**

- *Retention read:* a cohort table, days to second order by product, the weakest stage and one fix, with what to measure.
- *Flow plan:* each flow as a timeline (trigger, wait, email or text, stop rule, goal), channel per step, and the consent each step needs.
- *Text pack:* each text with character count, the business name, the stop wording where needed, send window and frequency cap.
- *Subscription plan:* the offer, the monthly maths, the first-box plan, and the pause, skip and cancel screens with their copy.
- *Monthly report:* what ran, the action log, results against the holdout or last month's cohort, and next month's one fix.

**Tone and conventions.** Plain, warm and short, in the client's voice. Texts stay short, name the business and say why the person is getting them. One idea and one action per message. Numbers are shown with their source and date. Anything the client must confirm (offers, prices, dates, stock) is flagged in a separate list, never buried in the copy.

## 9. Glossary

- **Repeat purchase rate:** the share of customers who have ordered more than once in a period.
- **Second-order rate:** the share of first-time buyers who place a second order within a set window.
- **Cohort:** a group of customers who started in the same period, tracked over time.
- **Retention curve:** the share of a cohort still buying or subscribed after 1, 2, 3 and more months.
- **Replenishment flow:** messages timed to when a product runs out.
- **Win-back flow:** messages to customers who have gone past their usual buying gap.
- **Churn:** customers or subscribers lost in a period; voluntary (they cancel) or involuntary (a failed payment).
- **Holdout group:** a random group kept out of a message or programme to measure its real effect [21].
- **Attribution window:** the days after a message in which an order is credited to it [20].
- **Revenue per recipient (RPR):** attributed revenue divided by delivered messages.
- **Prior express written consent:** the US standard for automated marketing texts: a signed written agreement with a clear disclosure, not a condition of purchase [2].
- **Revocation:** a person withdrawing consent, by any reasonable means [2][3].
- **Double opt-in:** the person confirms a second time, for example by replying to a text, before marketing starts [7].
- **10DLC:** a standard 10-digit US long code used for business texting; requires brand and campaign registration [9].
- **Short code / toll-free number:** other US sending number types with their own approval routes [9].
- **Branded sender ID:** a sender name instead of a number, common in the UK and EU; it cannot receive replies [13].
- **Quiet hours:** times when marketing texts are not sent, set by law, carriers or the platform [2][17].
- **Soft opt-in:** the UK rule allowing marketing to existing customers about similar products, with a chance to opt out [12].
- **Negative option / auto-renewal:** a plan that keeps charging until the customer cancels [25][26].
- **Save offer:** an option shown when someone cancels, such as a pause or a skip.
- **SHAFT:** sex, hate, alcohol, firearms and tobacco, content carriers restrict in texts [5].

## 10. What changes fast

Re-check at each refresh:

- **US texting rules:** the official eCFR text of 47 CFR 64.1200, including the amendment published 26 Oct 2026 [2]; FCC orders in docket CG 02-278 [3]; state frequency and hours laws [6].
- **Carrier and platform rules:** 10DLC registration, cart text rules and messaging policies [7][9][10].
- **Klaviyo:** compliance articles, attribution defaults, holdout thresholds and benchmarks; note the data date each time [4][5][18][19][20][21].
- **UK:** ICO guidance after the Data (Use and Access) Act 2025, and the start date of the subscription contracts regime [11][12][27].
- **EU:** national regulator pages such as the CNIL's, and EDPB consent guidance [15][16].
- **US subscriptions:** the FTC's negative option rulemaking (FTC-2026-0265) and state auto-renewal laws [25][26].
- **Unfair practices guidance:** CMA207 and EU consumer pages on urgency and pricing [29][30].
- **Shopify Subscriptions:** customer portal actions and reminder timing [28].
