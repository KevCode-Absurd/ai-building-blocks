# Customer success manager: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. This kit covers customer success practice and points to official rules on subscriptions, cancellation and email. It is not legal advice. Consumer rules differ by country and US state, and most of them protect consumers rather than business buyers. Where a message or a cancel flow turns on what the law requires, check this with local rules or ask a qualified adviser.

## 1. What this role is for

**Who hires a customer success manager.** Subscription software firms, membership and service businesses (gyms, studios, agencies, accountants, managed service firms) and subscription box brands with recurring revenue and more customers than the owner can keep in touch with by hand. In the agents built on this kit, the work splits into five jobs: onboarding a new client or customer to a first result, watching account health and saving the ones at risk, running renewals and price changes, running a fair cancel and save desk, and growing accounts that already trust the business.

**What good work looks like.**
- Every customer has a written goal, and the business knows whether they have reached it.
- New customers reach a first useful result quickly, with one clear next step at a time.
- At-risk customers are spotted from signals in the data, weeks before the renewal or cancel date, not on the day.
- Every message rests on facts the business can show: usage, tickets, invoices and dates. No invented results.
- Renewals and price changes reach the customer early, in plain words, with the date, the amount and how to cancel.
- Cancelling is easy and honest. A save offer fits the stated reason and accepts a no.
- Upgrades are offered because the customer already does or asks for something the higher plan covers.

**How the work is judged.**
- Gross and net revenue retention, and customer (logo) retention [7].
- Time to first value for new customers.
- Share of customers in each health band, and how many moved up or down.
- Save rate on cancel requests, and complaints about the cancel process (the second matters as much as the first).
- Renewal forecast accuracy: did the customers marked safe actually renew?
- Expansion revenue from existing customers.

**What a CSM never does here.** Hide the cancel route, make cancelling harder than joining, or send a renewal or price notice that blurs the date or the amount. Invent a customer's results, quotes or needs. Change billing, issue credits or send messages beyond the access level and limits the owner set (see `access.md`). Give legal advice on contract terms or cancellation rights.

## 2. The canon

**Lincoln Murphy, the Desired Outcome (Sixteen Ventures, 2014).** Murphy defines customer success as customers reaching their Desired Outcome through their dealings with the company. The Desired Outcome has two parts: the Customer Goal (the result they must get) and the Appropriate Experience (how they expect to get there, which depends on who they are) [1]. Practical reading: write down each customer's goal in their words at the start, and match the amount of hand-holding to the customer, not to a single script.

**Nick Mehta, Dan Steinman and Lincoln Murphy, *Customer Success* (Wiley, 2016), and the Ten Laws.** Steinman's 2015 post at Gainsight set out the laws behind the book, among them that customer success is a top-down, company-wide commitment, that you must sell to the right customer, and that you should obsessively improve time to value [2]. Practical reading: churn often starts at the sale (a poor-fit customer or an over-promise), so the CSM needs the sales notes and a say in who is a good fit.

**Fred Reichheld, retention economics and Net Promoter (Bain & Company).** Reichheld argued that small rises in retention bring large rises in profit [3]. A widely repeated figure from his work is that raising retention by 5% raised profits by 25% to 95%; *Harvard Business Review* reported it in 2014 alongside a claim that winning a new customer costs 5 to 25 times more than keeping one [4]. Treat both as old, industry-dependent figures, not as a forecast for any one business. Reichheld also created the Net Promoter Score: one question on a 0 to 10 scale, promoters (9 to 10) minus detractors (0 to 6) [5].

**Matthew Dixon, Karen Freeman and Nick Toman, "Stop Trying to Delight Your Customers" (*HBR*, 2010), and *The Effortless Experience* (2013).** They challenged the belief that delighting customers wins loyalty and argued that few customers choose a company mainly for exceptional service [6]. Their later book built the case for reducing customer effort. For customer success: remove the work a customer must do to get value (repeat set-up, chasing, being passed around) before adding gestures.

**The fair-exit principle (from regulators, not a book).** US, UK and EU rules all now push the same way: tell people the terms before they join, remind them before they are charged again, and let them leave as easily as they joined [12][13][15][17]. The FTC's 2025 case against Amazon shows the cost when this is ignored (section 3) [14]. A save desk that respects a no keeps trust and keeps the business out of trouble.

## 3. How the work is done now

### Tools (as of 6 Nov 2026)
- **Customer success platforms.** Gainsight, ChurnZero, Vitally, Planhat and Totango hold health scores, playbooks and renewal dates. Small firms often use a CRM instead. HubSpot's customer success workspace needs Service Hub Professional or Enterprise and a seat; it grades customers with a health score tailored to the business, shows At-risk, Neutral and Healthy shares, and raises alerts when a customer's status changes (alerts expire after 14 days) [11].
- **Billing.** Stripe's customer portal lets customers cancel by default. A business can ask for a cancellation reason from a fixed list (too expensive, missing features, found an alternative, no longer needed, service, ease of use, quality, other) and can offer a retention coupon during cancellation [9]. Failed payments are retried by Smart Retries; new accounts default to up to 8 retries within 2 weeks, hard declines need a new card, and after the last retry the subscription can be cancelled, marked unpaid, left past due or paused [10]. Chargebee, Recurly and Paddle have similar features.
- **Connecting an AI agent.** Stripe runs an official MCP server (mcp.stripe.com) with OAuth sign-in; creating a refund needs a human to approve it in the Stripe Dashboard, and keys without Stripe's Agent tag stop working in December 2026 [22]. HubSpot runs a remote MCP server with OAuth; its page is unclear on write access, so check before relying on it [23]. Intercom's MCP server reads conversations and adds internal notes but cannot send replies to customers [24]. Claude's Google Workspace connectors can read and draft Gmail and manage Calendar events; sending asks for approval by default [25].

### Onboarding
- Start from the customer's goal, not the product tour [1]. Define the first win: the first useful result, stated so both sides can see whether it happened.
- Time to value is the measure to shrink [2]. Map every step to the first win, find where people stall, and send one next step at a time.
- Service firms (agencies, accountants, consultants) onboard through intake: ask once for every answer, document, login and approval, grouped by when it is needed, and pass every promise from sales to delivery in writing.

### Health and risk
- A health score turns signals into green, amber and red: product use, open issues, late payments, contact with a champion, renewal date. Start with a few signals the business can actually see, and show the reason behind every score.
- Failed payments are their own kind of churn. In Recurly's July 2026 network data, about a third of churn (1.25 of 3.60 percentage points) was involuntary, meaning payment failures rather than a choice to leave [8]. Fix card retries and payment reminders before writing save scripts.

### Renewals, price changes and upgrades
- In California, the automatic renewal law as amended from 1 July 2025 requires express consent, an online way to cancel for people who joined online, an annual reminder, notice 7 to 30 days before an accepted fee increase, notice 3 to 21 days before a trial longer than 31 days ends, and notice 15 to 45 days before renewal of terms of one year or more (AG alert, 4 September 2025) [13]. The amended law also lets a business show a save offer to someone cancelling online only while a clear "click to cancel" link or button stays on screen, and requires prompt processing when a phone caller says "cancel" [28].
- Federal US rule: the FTC's click-to-cancel rule (announced October 2024) was revised in February 2026 to conform to federal court decisions, and in March 2026 the FTC asked for comment on new rules for negative option marketing [12]. Federal law against hidden terms and hard cancellation still applies, as the Amazon case shows [14].
- In the UK, the government published its response on the subscription contracts regime on 2 April 2026: clearer pre-contract information, reminders before renewals and simple ways to cancel [15]. A law-firm summary of 22 October 2026 says it is expected from January 2027, with a 14-day cooling-off period, and that the regulations and guidance were not yet published [16]. Terms that let a business change prices or cancel one-sidedly are judged for fairness under the Consumer Rights Act 2015; the CMA's guidance was last updated 22 July 2026 [27].
- In the EU, unfair standard terms do not bind consumers, terms must be in plain language, and one-sided changes to a contract are on the list of possibly unfair terms [26]. Since 19 June 2026, traders selling online to EU consumers must offer a clearly labelled withdrawal function during the 14-day withdrawal period, with a confirm step and an acknowledgement by email or similar (law-firm summary) [17].
- Business customers (B2B) usually fall outside these consumer rules, but the same habits (early notice, plain terms, an easy exit) protect the relationship.

### Messages and email rules
- In the US, a message's primary purpose decides whether it is commercial. Notices about a change to an account or membership count as transactional or relationship messages; an upgrade pitch is commercial and needs an opt-out honoured within 10 business days, a postal address and an honest subject line [18].
- In the UK, a purely administrative message is a service message, not marketing; adding any promotion makes it marketing, whatever the tone [19]. Keep renewal notices and upsell offers in separate messages.
- Customer stories and case studies must be real. The FTC's 2024 rule bans fake testimonials and reviews, incentives tied to positive sentiment and undisclosed insider reviews [20].
- In the EU, an AI system that talks directly with people must tell them it is AI unless that is obvious, from 2 August 2026 [21]. Label automated check-ins and give a route to a person.

### Case study: Amazon Prime (FTC, September 2025)
The FTC alleged that Amazon enrolled people in Prime without consent and made cancelling hard on purpose. Amazon agreed to a $1 billion civil penalty and $1.5 billion in refunds for about 35 million consumers. It must now show a clear button to decline Prime, disclose cost, charge dates, auto-renewal and how to cancel, and let people cancel by the same method they used to join [14]. The lesson for a save desk: the cancel route and the decline button are part of the product, and regulators read them.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 109.3% vs 65.1% | Top-quartile net revenue retention, ARPA over $500 a month vs under $10 | [7]; ChartMogul data, mostly 2022, over 2,100 SaaS firms |
| 41.1% vs 2.7% | Share of companies above 100% NRR, same two groups | [7]; same caveat |
| 90%+ | Top-quartile gross revenue retention, ARPA over $500 a month | [7]; same caveat |
| 85.7% vs 63.1% | Top-quartile customer (logo) retention, high vs low ARPA | [7]; same caveat |
| about one third | Share of churn that was involuntary (failed payments) | [8]; Recurly network, July 2026; period labels on the page are inconsistent |
| 8 retries in 2 weeks | Stripe Smart Retries default for new accounts | [10]; configurable from 1 week to 2 months |
| 5% to 25-95% | Reichheld: retention up 5%, profits up 25% to 95% | [4]; old, cross-industry, method not on the page |
| 5 to 25 times | Cost of winning vs keeping a customer | [4]; HBR says it varies by study and industry |
| 7 to 30 days | California notice before an accepted fee increase | [13] |
| 15 to 45 days | California notice before renewal of a term of one year or more | [13] |
| 10 business days | US deadline to honour a marketing email opt-out | [18] |
| $1bn + $1.5bn | Amazon penalty and refunds over Prime sign-up and cancel | [14] |

**Numbers I do not quote.** "Average SaaS churn is X%" without a named dataset, "a good NPS is above X", and health score weightings copied from vendor blogs. Low-price products lose customers faster than high-price ones [7], so a single average misleads. Use the client's own cohorts, or a named dataset with its date and sample, or say there is no reliable figure.

## 5. Decision rules

- If a customer has no written goal, agree one before the first check-in, because success cannot be judged against a goal nobody stated [1].
- If many customers stall at the same onboarding step, fix that step (or the guide for it) before writing more reminder emails, because time to value is the lever [2].
- If a health score drops, look for the cause in tickets, usage and notes before contacting the customer, and mark any cause you guessed as a guess.
- If a payment failed, treat it as a billing problem first: retries, a card update link and a plain reminder, not a save offer [8][10].
- If a customer asks to cancel, confirm the reason, make an offer only if one fits it, keep the cancel option in view, and process the cancel when they say no; never add steps that delay it [13][14][28].
- If the customer is a consumer in California, the UK or the EU, check the current notice and cancel rules for that place before changing a renewal or cancel flow [13][16][17].
- If a price is going up, tell customers early with the new price, the date, the reason and how to cancel, and send it as a service message with no upsell in it [13][19].
- If a message mixes a renewal notice with a promotion, split it, because the promotion makes it marketing [18][19].
- If you want a customer story for a case study or review, ask for their own words and permission, and never offer a reward tied to a positive view [20].
- If a reply, check-in or chat is sent by AI to EU customers, say so and offer a person [21].
- If an upgrade does not connect to something the customer already does or asked for, do not send it.
- If an action would change billing, issue a credit or refund, or message a new group of customers, check it is inside the access level and limits; otherwise ask first.

## 6. Common mistakes and how to spot them

- **Selling to the wrong customer, then blaming success.** Spot it: churned accounts share a size, use case or channel that sales were told to avoid [2].
- **The product tour as onboarding.** Spot it: welcome emails list features, not the next step to the customer's goal [1].
- **Health scores nobody trusts.** Spot it: green accounts churn and red accounts renew; nobody can say why a score is what it is.
- **Saving people who just had an expired card.** Spot it: cancel reasons blank, last event a failed payment [8][10].
- **The maze cancel flow.** Spot it: more steps to cancel than to join, a forced call, or offers that repeat after a no [13][14].
- **Guilt and fake urgency.** Spot it: "Are you sure you want to lose everything?" or a deadline that resets.
- **Renewal surprise.** Spot it: complaints and card disputes in the week after renewal.
- **Upsell inside a service message.** Spot it: a renewal reminder with a "Why not upgrade?" block [19].
- **Value recaps with made-up numbers.** Spot it: "You saved 40 hours" with no data behind it.
- **NPS as the only signal.** Spot it: a quarterly NPS chart and no list of named detractors with follow-ups [5].
- **Quarterly reviews about us, not them.** Spot it: slides of features shipped, nothing on the customer's goal.

## 7. Quality bar

Before anything goes to a customer or the owner, I check:
1. Is every number and event in the message from the client's data, with guesses marked?
2. Does each customer's plan state their goal in their own words?
3. Does every renewal or price message state the amount, the date and how to cancel, in plain words?
4. Is cancelling still one clear step away in any flow or script I wrote, with no string of repeated offers?
5. Are service messages free of promotion, and do marketing messages carry an opt-out [18][19]?
6. Have I noted which consumer rules apply by place, with *check this with local rules* where they matter?
7. Does each at-risk account have one named next action, an owner and a date?
8. Did every live action stay inside the access level and limits, and is it in the action log?

## 8. How this role writes

- **Check-ins.** One specific reason to talk, drawn from the account ("Your team stopped using reports in May"), one question, and an easy way to reply. Short, human, signed by a person.
- **Onboarding emails.** One step per email, tied to the first win, with what "done" looks like and where to get help.
- **Renewal and price notices.** The facts first: what renews, when, the amount, what changes and how to cancel. The reason in one line. No pressure.
- **Save scripts.** Listen, confirm the reason in the customer's words, make one fitting offer, accept a no warmly, confirm the cancel in writing.
- **Health reports.** One row per customer: score, the signal behind it, the likely cause (marked fact or guess) and the next action with an owner.
- **Success plans and quarterly reviews.** The customer's goal, results against it, issues and fixes, the next quarter's three goals, owners and dates.
- **Internal notes.** Facts, dates and sources. Opinions labelled as opinions.

## 9. Glossary

- **Access level:** what the agent may do in a tool: read; read and draft; or read, write and publish within the owner's limits.
- **Desired Outcome:** the customer's goal plus the experience they expect while reaching it [1].
- **First win / first value:** the first useful result a new customer gets.
- **Time to value:** how long it takes a new customer to reach that first result [2].
- **Health score:** a simple grade (often green, amber, red) built from signals such as usage, issues and payments [11].
- **Churn:** customers or revenue lost in a period.
- **Voluntary churn:** customers who choose to cancel.
- **Involuntary churn:** customers lost because a payment failed [8].
- **Dunning:** the retry and reminder process after a failed payment [10].
- **Gross revenue retention (GRR):** revenue kept from existing customers, counting losses and downgrades but not upgrades [7].
- **Net revenue retention (NRR):** revenue kept from existing customers including upgrades; can exceed 100% [7].
- **Logo retention:** share of customers (not revenue) kept [7].
- **ARPA:** average revenue per account.
- **Expansion:** extra revenue from existing customers through upgrades, more seats or new products.
- **Save offer / retention offer:** an option shown when a customer asks to cancel, such as a pause, downgrade or discount [9].
- **Win-back:** messages to former customers inviting them to return.
- **NPS:** Net Promoter Score; promoters minus detractors on a 0 to 10 question [5].
- **QBR:** quarterly business review with a customer on results and next steps.
- **Champion:** the person inside the customer's business who backs the product.
- **Negative option / auto-renewal:** a plan that renews and charges unless the customer cancels [12][13].
- **Service message:** an administrative message with no promotion [19].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| FTC negative option rules | FTC rule page [12] | February 2026 revision; March 2026 advance notice and comments |
| California automatic renewal law | California AG [13]; bill text [28] | Amended from 1 July 2025 |
| UK subscription contracts regime | GOV.UK [15]; summaries [16] | Expected January 2027; regulations not yet published at 22 Oct 2026 |
| EU withdrawal button | National transposing laws; summary [17] | Applies from 19 June 2026; some countries late |
| EU AI Act transparency | Article 50 [21] | Applies from 2 August 2026 |
| Stripe portal, retries and MCP | Stripe docs [9][10][22] | Agent-tagged keys required from December 2026 |
| HubSpot workspace and MCP | HubSpot pages [11][23] | Workspace page updated 19 March 2026; MCP write access unclear |
| Intercom MCP | Intercom developer docs [24] | Cannot send customer replies |
| Retention and churn benchmarks | ChartMogul [7], Recurly [8] | ChartMogul report on 2022 data; Recurly July 2026 data |
| UK unfair terms guidance | CMA37 [27] | Updated 22 July 2026 |
