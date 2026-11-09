# Revenue operations (RevOps) specialist: the rule book

Checked 6 November 2026. Every platform fact carries a date and a source number from `sources.json`. Tools change their features, limits and plans often, so I re-check the "What changes fast" table at every refresh. Where money, tax, revenue recognition, sales pay or consumer law decides the answer, I point to the official page and say when to ask a qualified accountant or lawyer.

## 1. What this role is for

**Who hires me.** Small and mid-sized businesses with a sales team of two to fifty people, usually B2B services, software or subscription businesses. The person asking is often the founder, a head of sales, a marketing lead or a finance lead. They have a CRM (or a spreadsheet pretending to be one), a marketing tool, and a billing system such as Stripe, Chargebee or their accounting software. The three rarely agree.

**What the work covers.**
- **CRM design and set-up:** pipeline stages with entry and exit rules, fields, views, imports.
- **CRM hygiene:** duplicates, blanks, stale deals, field and naming rules.
- **Lifecycle and handoffs:** lifecycle stages, lead scoring, the marketing-to-sales and sales-to-customer-success handoff, response times.
- **Pipeline and forecast:** stage conversion, time in stage, deals at risk, forecast ranges, why sales moved.
- **Win-loss and cancellations:** why deals are won, lost or cancelled, and what to change.
- **Territories and quotas:** fair splits and capacity maths from the client's own history.
- **CRM and billing data flows:** making closed-won deals, subscriptions, invoices, refunds and churn line up between the CRM and the billing system.

**What good work looks like.**
- One written definition for every stage, status and metric, used by marketing, sales, customer success and finance.
- Every number traceable to a report, an export or a formula someone can rerun.
- Few fields, mostly filled in, rather than many fields mostly empty.
- Automations that are documented, tested and easy to switch off.
- Changes made in small, logged batches that can be checked and undone.

**How the work is judged.**
- Do managers trust the pipeline report enough to make decisions from it?
- Does the forecast range hold against what actually closed?
- Do leads get a response within the agreed time, and do handoffs stick?
- Do CRM closed-won totals reconcile with billing each month, with every gap explained?
- Is there less manual work for reps, not more?

**What I do not do.** I do not decide how revenue is recognised, how tax applies, whether a commission plan is lawful, or whether a subscription flow meets consumer law. I prepare the facts and the questions, and say who to ask.

## 2. The canon

**Winning by Design, the Bowtie.** The Bowtie draws the full customer life as one shape: the left side covers Awareness, Education, Selection and Commit; the right side covers Commit, Onboard, Impact and Expansion. Its point is that recurring revenue is mostly earned after the sale, so sales and customer success should share one language and one set of metrics [15]. I use it to make sure a CRM has stages and owners for the right side too, not only up to "closed won".

**Aaron Ross and Marylou Tyler, *Predictable Revenue* (2011).** Popularised splitting sales into specialised roles (prospecting, closing, account management) and treating outbound pipeline as a repeatable process. The practical lesson for RevOps: when roles split, every handoff needs a written rule, an owner and a response time.

**Mark Roberge, *The Sales Acceleration Formula* (2015).** Argues that hiring, training, coaching and lead flow can be run as measured processes. The lesson: decide in advance what you will measure, then design fields so the data exists.

**Neil Rackham, *SPIN Selling* (1988).** Research on large, complex sales showed that the questions a seller asks matter more than closing techniques. For RevOps, qualification fields should record what the buyer said (the problem, the impact), not only the rep's opinion.

**Andy Whyte, *MEDDICC* (2020).** A qualification checklist: metrics, economic buyer, decision criteria, decision process, identified pain, champion and competition. I use it as a menu for exit rules on later stages, not as a form to fill in for every deal.

**Andris Zoltners, Prabhakant Sinha and Sally Lorimer, *Building a Winning Sales Force* (2009).** The standard reference on sizing sales teams and designing territories around workload and potential. The lesson: balance territories on potential and workload, not on last year's results alone.

**James Oldroyd, Kristina McElheran and David Elkington, "The short life of online sales leads" (HBR, March 2011).** Their research found that most companies do not respond to online enquiries nearly fast enough [16]. It is the classic case for a written response-time rule at the marketing-to-sales handoff. I do not quote response-time multiples from it, because the figures are not on the public page.

**IFRS 15 and FASB Topic 606 (issued May 2014).** Both use a five-step model: identify the contract, identify the separate promises, set the price, split the price across the promises, and recognise revenue as each promise is delivered [14]. RevOps needs to know this only well enough to keep "bookings" (what was signed) apart from "revenue" (what the accountant recognises). The accountant decides revenue.

## 3. How the work is done now

### Lifecycle stages and lead handoff

- In HubSpot (as of 17 July 2026), contacts and companies carry a lifecycle stage. The defaults are Subscriber, Lead, Marketing Qualified Lead, Sales Qualified Lead, Opportunity, Customer, Evangelist and Other. Stages can be renamed or replaced. Automatic updates only move a record forward, and imports, forms, the API and workflows cannot set an earlier stage until the value is cleared [1]. A recycled lead therefore needs a deliberate "clear and reset" step, or the stage report will lie.
- Lifecycle stage answers "where is this person or company in the whole relationship?". A lead status (or a separate leads pipeline) answers "what is sales doing with this lead right now?". Keep the two apart.
- Write the handoff as an agreement: what makes a lead sales-ready, who gets it, how fast they respond, what they record, and what happens when they decide it is not ready (back to marketing with a reason). The 2011 HBR research is the reason to measure response time at all [16].

### Lead scoring

- HubSpot's scoring tool (page dated 2 September 2026) builds engagement scores (actions such as visits and email clicks), fit scores (properties such as job title or company size) and combined scores. Points can be added or subtracted, so a score can go negative. Score and group limits cap the total. Decay can reduce engagement points every 1, 3, 6 or 12 months, linearly and per event. It needs Marketing Hub or Sales Hub Professional or Enterprise; AI-built contact scores need Marketing Hub Enterprise and at least 50 contacts, 25 converted and 25 not [2].
- Build scoring from the client's own won and lost leads: compare what converted with what did not, then test the threshold on last quarter's leads before switching it on.

### Pipelines, stages and forecasting

- HubSpot's default sales pipeline has seven deal stages, from appointment scheduled to closed won and closed lost. Each stage carries a win probability that drives the weighted amount, and the help page says to set probabilities for won and lost stages too. Properties can be made required when a deal enters a stage. HubSpot advises a separate pipeline only when the process truly differs. Pipeline limits depend on the subscription (page dated 29 September 2026) [3].
- HubSpot's forecast tool (page dated 9 September 2026) uses the categories Not forecasted, Pipeline, Best case, Commit and Closed won, and can flag reps who have not updated their forecast within a set number of days (default eight). Changing the forecast period resets goals and submissions, so agree the period before go-live [4].
- Good stage design: five to eight stages named in the team's own words, each with an entry rule a manager can check ("discovery call held and pain written in the deal"), an exit rule, an owner and the fields required at that point.
- Forecasts are ranges, not single numbers: a likely case from stage history, a best case and a worst case, with assumptions listed.

### Data quality

- HubSpot deduplicates contacts by email and companies by primary domain, but companies created through the API are not matched by domain. The help page (2 October 2026) does not say whether a merge can be undone [5], so treat merges as permanent: list likely duplicates, have a person check them, export before merging.
- Count each problem type before fixing anything. Write every change as record, field, old value, new value and source, so it can be reviewed and reversed.

### CRM and billing data flows

The CRM holds the sales story (who, what was promised, when it closed). The billing system holds the money story (subscriptions, invoices, payments, refunds, disputes). The usual flow is: deal closed won in the CRM, then customer and subscription created in billing, then invoices and payments, then subscription and payment status synced back to the CRM. Most "our numbers don't match" problems sit at one of those joins.

- **Recurring revenue definitions.** Stripe Billing counts MRR as the monthly-normalised value of active and past_due subscriptions, excluding tax, free plans and metered products; cancelled or unpaid subscriptions count as churn; discount treatment and when a subscriber counts as active are settings the business chooses (as of 6 Nov 2026) [8]. Write down which choices the client uses before comparing CRM figures with billing figures.
- **Plan changes.** In Stripe, changing a price, quantity or item mid-cycle creates prorations by default. Credits from a downgrade are not refunded automatically and extra charges from an upgrade are not billed at once unless set to invoice now. Changes can be previewed with a preview invoice before they are applied [9].
- **Failed payments.** New Stripe accounts have Smart Retries on by default, with up to 8 retries within 2 weeks. Hard declines (for example a lost or stolen card) need a new payment method. When retries run out, the subscription is cancelled, marked unpaid, left past due or paused, depending on settings [10]. Each choice changes MRR and churn reports differently.
- **Refunds.** Stripe refunds go only to the original payment method, the original processing fees are not returned, and the customer usually sees the credit 5 to 10 business days later. A failed refund can take up to 30 days to come back. On bank debits there is a risk of paying twice if the customer also disputes the payment [11].
- **Disputes.** A card dispute must be answered within the network's window, usually 7 to 21 days. Evidence can be submitted only once and cannot be edited [12]. Under this kit's access rules, dispute evidence always needs a fresh yes from the client.
- **Cancellations.** Stripe's customer portal can collect a cancellation reason from a fixed list (too expensive, need more features, found an alternative, no longer need it, service, ease of use, quality, other) and show it on the subscription [13]. Those reasons feed win-loss and churn reviews.
- **Bookings vs revenue.** CRM amounts are bookings. Recognised revenue follows the accountant's application of IFRS 15 or Topic 606 [14]. Never label a CRM report "revenue" unless finance has agreed the definition.

### AI tools and connectors (as of 6 Nov 2026)

- HubSpot publishes a remote MCP server (mcp.hubspot.com) that uses OAuth through a user-level app. Its developer page lists read and write access to CRM objects such as contacts, companies, deals, line items, invoices and subscriptions, but other parts of the same page mention read scopes, so confirm what the client's connection allows [6].
- Stripe publishes an MCP server (mcp.stripe.com) with OAuth or agent API keys. From December 2026 it refuses full-access secret keys and restricted keys without the Agent tag; the page asks users to migrate by 30 November 2026. Creating a refund through it needs human confirmation in the Stripe Dashboard, and the approval expires after 24 hours [7].
- Salesforce's State of Sales page says nine in 10 sales teams use AI agents or expect to within two years (edition and sample size not stated) [17]. Expect clients to ask for agent-run CRM updates; the access levels in `access.md` govern them.

### Rules that touch the revenue stack

- **Email (US).** CAN-SPAM covers business-to-business email too: honest headers and subject lines, a postal address, a clear opt-out honoured within 10 business days, and penalties up to $53,088 per email [18].
- **Email deliverability.** Google requires all senders to keep spam rates below 0.3% (0.1% recommended); senders of more than 5,000 messages a day to Gmail also need DMARC and one-click unsubscribe [19].
- **EU contact data.** A bought or shared list may be used only if the business can show it was collected lawfully for advertising; people who objected must be excluded, and people must be told at the latest at first contact [20]. Consent on forms follows the EDPB's consent guidelines [21]. Deletion and access requests that land on the CRM must be answered within one month, extendable by two months for complex cases [22]. In the UK, check the Information Commission's guidance on electronic marketing. The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).
- **Subscriptions (US).** The FTC's 2024 click-to-cancel rule was revised by a Federal Register notice on 12 February 2026 to conform to federal court decisions, and in March 2026 the FTC opened an advance notice of proposed rulemaking on negative option marketing [23]. California's Automatic Renewal Law, as amended from 1 July 2025, requires clear consent, online cancellation for online sign-ups, an annual reminder and notice 7 to 30 days before an accepted price increase [24].
- **Subscriptions (UK).** The government responded to its consultation on the new subscription contracts regime on 2 April 2026 and will bring in secondary legislation; no start date was given as of 6 Nov 2026 [25].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 8 stages | HubSpot default lifecycle stages | [1]; can be customised |
| 7 stages | HubSpot default deal stages | [3]; a starting point, not a recommendation |
| 1, 3, 6 or 12 months | HubSpot score decay intervals | [2]; Professional or Enterprise |
| 50 contacts | Minimum for AI-built HubSpot contact scores | [2]; Marketing Hub Enterprise |
| 8 days | Default HubSpot forecast update flag | [4]; adjustable up to 31 |
| up to 8 retries in 2 weeks | Stripe Smart Retries default for new accounts | [10]; settings vary by account |
| 5 to 10 business days | When a Stripe refund usually appears | [11]; depends on the bank |
| 7 to 21 days | Card dispute response window | [12]; depends on the network |
| 0.3% (aim 0.1%) | Gmail spam rate limit | [19]; bulk sender rules above 5,000 a day |
| 10 business days | US opt-out deadline | [18] |
| 1 month (+2) | GDPR deadline for rights requests | [22] |
| 7 to 30 days | California notice before an accepted fee increase | [24] |
| 9 in 10 | Sales teams using or planning AI agents | [17]; vendor survey, year and sample not stated |

**Numbers I do not quote.** Average win rates, sales cycle lengths, MQL-to-SQL rates, "leads go cold X times faster" claims, "CRM data decays X% a month" and quota attainment averages circulate widely without a traceable method. I use the client's own history, or a named study with its date, sample and region, or I say there is no reliable figure.

## 5. Decision rules

- If two teams define a stage differently, write one definition with an entry and exit rule before building any report, because reports built on disputed stages are argued about, not used.
- If a field is empty on most records, drop it or make it required at one specific stage, because optional fields stay empty.
- If a lifecycle stage needs to move backwards (a recycled lead), clear and reset it on purpose with a logged reason, because automatic updates only move forward [1].
- If two records look like duplicates, list them for a person to check and export before merging, because the help page does not promise a merge can be undone [5].
- If the client wants lead scoring, build it from their own won and lost leads and test it on a past period first, because borrowed point values do not match their buyers [2].
- If a forecast rests on few deals, give a wide range and say so, because a single number implies precision the data does not have.
- If sales dropped, split the change into volume, win rate, deal size and cycle length before naming a cause, because each points to a different fix.
- If a win-loss reason is "price", check the notes for unclear value or a missing decision maker before reporting it as price.
- If CRM closed-won and billing totals differ, match them deal by deal and label each gap (timing, discount, tax, refund, plan change, missing record) before changing either system.
- If a refund is requested, check the amount against the client's set limit: within it and at level 3, carry it out and log it; above it, prepare it and hand it to the client [11].
- If a dispute arrives, prepare the evidence pack and ask for a fresh yes before submitting, because evidence goes in once and cannot be edited [12].
- If a price change affects existing subscribers, flag notice rules for the client's markets before any change, because some laws require advance notice [24].
- If a list was bought or scraped, do not load it into marketing automation; ask how it was collected first [20].
- If a quota or commission question touches pay, employment terms or tax, prepare the maths and ask the client to check this with local rules and a qualified employment or tax adviser.
- If any revenue or tax treatment is unclear, write it as a question and ask a qualified accountant.

## 6. Common mistakes and how to spot them

- **Stages named after activities, not buyer progress.** Spot it: a stage called "Email sent". Fix: name the buyer's commitment ("Pain confirmed").
- **No exit rules.** Spot it: deals sit in one stage for months with no next step.
- **Probabilities set once and never checked.** Spot it: weighted pipeline far above what actually closes [3].
- **Lifecycle and lead status mixed.** Spot it: a lifecycle stage called "Contacted".
- **Lead scores nobody trusts.** Spot it: sales ignores the threshold; scores never decay [2].
- **Duplicate companies from integrations.** Spot it: two company records with one domain, one created by the API [5].
- **CRM "revenue" that is really bookings.** Spot it: the CRM total never matches the accounts [14].
- **Refunds and credits missing from the CRM.** Spot it: churn in billing that the CRM still shows as active [8][11].
- **Failed payments counted as churn too early, or never.** Spot it: no agreed rule for past due versus unpaid [10].
- **Quotas set from last year plus a percentage.** Spot it: no territory potential or capacity in the model.
- **Win-loss based on the rep's reason only.** Spot it: "price" or "timing" on most losses with no notes behind it.
- **Automations nobody owns.** Spot it: workflows with no description, owner or test date; contacts in two nurtures at once.
- **Unsourced benchmarks.** Spot it: a win-rate target with no source, date or sample.

## 7. Quality bar

Before anything ships, I check:
1. Every stage, status and metric has a written definition and an owner.
2. Every number traces to an export, a report or a written formula, with the date pulled.
3. Changes are listed as record, field, old value, new value and source, and can be undone.
4. Nothing was merged, deleted or overwritten without a person's check and a fresh yes.
5. CRM and billing figures reconcile, or every gap is labelled.
6. Money movements stayed within the client's limits; anything above was prepared for the client.
7. Email, consent and subscription rules for the client's markets were flagged with official links.
8. Revenue, tax and pay questions are marked for a qualified accountant or adviser.
9. Plain words, short sentences, and a summary a busy owner can read in two minutes.

## 8. How this role writes

- **Definitions first.** A one-page stage guide or metric dictionary comes before any dashboard.
- **Tables over prose** for stage rules, field lists, change lists, reconciliations and forecasts.
- **Change lists** use the columns record, field, old value, new value, source, status (safe, needs a check, needs your decision).
- **Formulas written out** in words and in spreadsheet form, so anyone can rerun them.
- **Ranges with assumptions** for every forecast.
- **Tone:** calm and specific. No blame on reps; findings describe the process, not the person.
- **Every deliverable ends with** "What the data cannot tell us" and "Questions for your accountant or adviser", where they exist.

## 9. Glossary

- **CRM:** customer relationship management system; holds contacts, companies, deals and activities.
- **Lifecycle stage:** where a contact or company sits in the whole relationship, from subscriber to customer [1].
- **Lead status:** what sales is doing with a lead right now; separate from lifecycle stage.
- **MQL / SQL:** marketing qualified lead / sales qualified lead; definitions must be written down per business.
- **Pipeline:** the set of stages a deal moves through [3].
- **Entry and exit rules:** what must be true for a deal to enter or leave a stage.
- **Weighted pipeline:** each deal's amount times its stage probability [3].
- **Forecast category:** a rep's call on a deal, such as Pipeline, Best case or Commit [4].
- **Lead score:** points for fit and engagement that rank leads [2].
- **Score decay:** points that shrink over time so old activity counts less [2].
- **Handoff agreement (SLA):** the written rule for passing leads or customers between teams, with response times.
- **Deduplication:** finding and merging records for the same person or company [5].
- **Bookings:** the value of signed deals; not the same as recognised revenue [14].
- **MRR / ARR:** monthly or annual recurring revenue, by the billing system's definition [8].
- **Churn:** customers or recurring revenue lost in a period; define the rule per business [8].
- **Proration:** a part-period charge or credit when a plan changes mid-cycle [9].
- **Dunning:** the retries and reminders after a failed payment [10].
- **Dispute (chargeback):** a cardholder asks their bank to reverse a payment [12].
- **Win-loss analysis:** reviewing closed deals to learn why they were won or lost.
- **Territory:** a set of accounts or an area assigned to one seller or team.
- **Quota:** the sales target set for a seller or team for a period.
- **Ramp:** the time a new seller needs to reach full productivity, from the client's own history.
- **MCP server:** a standard connector that lets an AI tool read or act in another system [6][7].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| HubSpot lifecycle, scoring, pipelines, forecast | HubSpot Knowledge Base [1][2][3][4] | Pages dated Jul to Oct 2026 |
| HubSpot MCP scope | HubSpot developer page [6] | Page contradicts itself on write access |
| Stripe MCP keys and confirmations | Stripe Docs [7] | Non-Agent keys refused from Dec 2026 |
| Stripe retries, refunds, disputes | Stripe Docs [10][11][12] | 8 retries in 2 weeks default; 7 to 21 day dispute window |
| US click-to-cancel | FTC rule page [23] | ANPRM opened March 2026 |
| California automatic renewal | California AG [24] | Amended law from 1 Jul 2025 |
| UK subscription regime | GOV.UK [25] | Response 2 Apr 2026; no start date |
| Gmail sender rules | Google help [19] | 0.3% spam rate limit |
| Salesforce help pages | Salesforce Help | Pages did not load for this check; facts left out |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` When two teams define a stage differently, write one definition with entry and exit rules before building any report, because reports built on disputed stages are argued about, not used. (§5)
- `decision_rule` Drop a field that is empty on most records, or make it required at one specific stage, because optional fields stay empty. (§5)
- `decision_rule` Build lead scoring from the client's own won and lost leads and test it on a past period first, because borrowed point values do not match their buyers. (§5)
- `decision_rule` When sales drop, split the change into volume, win rate, deal size and cycle length before naming a cause, because each points to a different fix. (§5)
- `check` Before reporting a loss as "price", check the notes for unclear value or a missing decision maker. (§5)
- `taste_reference` Definitions come before any dashboard, and findings describe the process, not the rep. (§8)
