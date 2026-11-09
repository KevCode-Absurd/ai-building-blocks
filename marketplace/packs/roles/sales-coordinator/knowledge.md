# Sales coordinator: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. This is general sales practice, not legal advice. Pricing, cancellation, travel and property rules differ by country. Where a step turns on the law, I point to the official page and say when to ask a lawyer or a trade body. I never say whether a contract, quote or listing is lawful.

## 1. What this role is for

**Who hires a sales coordinator.** Businesses where buyers ask first and book later, and where the details decide the sale: event venues and hotels selling private rooms, wedding suppliers (photographers, florists, caterers, planners), creative studios, independent travel agents, estate agents and letting agents, and business-to-business order desks at wholesalers, distributors and makers. Most have one to five people selling, and the same people also answer the phone, chase signatures and pass work to the team that delivers.

The agents built on this kit split the work six ways: venue enquiries and event proposals; wedding supplier replies, packages and timelines; studio enquiries, quotes and client prep guides; travel itineraries and quote notes; property listings and buyer follow-ups; and the order desk path from quote to dispatch. All of them share three jobs: answer enquiries well, send quotes the client can stand behind, and hand a confirmed sale to the people who deliver it, with the CRM kept true along the way.

**What good work looks like.**
- Every enquiry gets a reply that answers the question asked, gives one or two facts that matter, asks one or two qualifying questions and offers one next step.
- Quotes and proposals use only the client's rate card, show the full price the buyer will pay, state what is included and excluded, say how long the price holds and mark terms for the client to confirm.
- Holds, options and quotes have dates, and someone acts before each date passes.
- When a sale is confirmed, the delivery team gets a handoff it can work from without coming back with questions.
- The CRM matches reality: one record per person and company, every open deal with a next step and a date, every lost deal with a reason.

**How the work is judged.**
- Time from enquiry to first useful reply, by channel and hour.
- Enquiry-to-booking (or quote-to-order) rate, by enquiry type.
- Quotes re-issued because of an error: the target is none.
- Holds converted or released on time, never left to lapse unnoticed.
- Questions back from operations after a handoff.
- CRM health: duplicates, open deals with no next step, stale stages, missing lost reasons.

**What this role never does.** Set prices, discounts or contract terms; promise dates, stock or availability it has not checked; invent reviews, testimonials or urgency; describe a home by the kind of person who should live there; or give a legal reading of terms. It also does not send a binding quote or contract without a fresh yes for that send (section 5).

## 2. The canon

**Atul Gawande, *The Checklist Manifesto* (2009).** Gawande argues that skilled people still miss simple steps under pressure, and that short checklists at set pause points catch them. For a coordinator, the pause points are the moment before a quote goes out and the moment a sale passes to the delivery team. The checklist should be short, name only the steps people tend to skip, and be used by the person doing the work.

**Matthew Dixon, Nick Toman and Rick DeLisi, *The Effortless Experience* (2013).** The book's case is that customers stay loyal when doing business is easy, more than when they are delighted. Its practical habit is answering the question the customer has not asked yet. In a quote note, that means saying what happens next, what the buyer needs to send, and what the deposit secures, before they have to ask.

**Danny Meyer, *Setting the Table* (2006).** Meyer separates service (getting the technical delivery right) from hospitality (how the exchange makes the guest feel). Venue and wedding enquiries need both: the facts must be right, and the reply should show the writer read the message.

**David Maister, Charles Green and Robert Galford, *The Trusted Advisor* (2000).** Their trust model weighs credibility, reliability and closeness against self-interest. Coordinators build reliability through small promises kept: replying when they said they would, sending the quote by the date given, releasing a hold on time.

**Blair Enns, *The Win Without Pitching Manifesto* (2010).** Written for creative firms. Enns argues against giving away free ideas to win work, and for diagnosing before prescribing. A studio coordinator applies it by asking about the job before quoting and by offering clear options rather than a free mock-up.

**DAMA International, *DAMA-DMBOK: Data Management Body of Knowledge* (2nd edition, 2017).** The standard reference for data quality work. Its quality dimensions (is a record accurate, complete, consistent, current, valid and unique?) give a CRM sweep its checklist.

## 3. How the work is done now

### Tools of the trade (as of November 2026)

- **Client platforms for small service firms.** HoneyBook combines lead forms, a pipeline from inquiry to project, proposals, contracts and invoices with online payment, a scheduler, automations and AI email drafts. It markets to photographers, venues, planners and real estate professionals in the US, Canada, the UK and Australia [1].
- **Venue software.** Tripleseat captures and routes event inquiries and handles proposals, contracts, banquet event orders (BEOs), payments and floor plans; the vendor says more than 20,000 venues use it [2].
- **General CRMs.** HubSpot, Salesforce, Zoho CRM and Pipedrive hold contacts, deals, quotes and tasks for firms with a broader pipeline.
- **Accounting tools for estimates.** QuickBooks lets even its Free plan track estimate status and turn an estimate into an invoice [10]; Xero includes quotes on all its plans [11].

### AI agents in the inbox and CRM

- Salesforce reports that nine in ten sales teams use AI agents or expect to within two years, with agents used from planning to quoting [5]. It is a vendor survey page with no stated sample.
- Official connectors let an agent do the work inside the tools. Claude's Gmail connector can draft, send and reply, and by default asks for approval before each send; on Team and Enterprise plans the owner decides whether members may skip that [3]. HubSpot's remote MCP server lists read and write access to contacts, companies, deals, quotes, line items, orders and logged activity, though its FAQ also mentions read-only access, so check the scopes when connecting [4].
- Under this kit, the client grants an access level per tool (see `access.md`). At level 3 the agent sends approved replies, books tours and calls, updates deals and logs everything within the client's limits.

### Enquiry to booking

- Each enquiry type (wedding, corporate event, shoot, trip, viewing, trade account) gets a first reply written in advance and approved by the client: answer the question, one relevant fact, one or two qualifying questions, one next step such as a call or tour slot.
- Availability is checked before a date is offered. If the calendar or booking system is not connected, the reply says the date will be confirmed and by when.
- Holds and options carry an end date in the CRM, a reminder before it, and a rule for what happens at the end (release, extend once with the client's OK, or convert on deposit).

### CRM hygiene

- **How duplicates appear.** HubSpot (as of 2 October 2026) matches contacts by email and companies by primary domain; imports without a unique identifier create new records, and companies created through the API are not matched by domain. Up to ten custom properties per object can be set to require unique values [6]. So duplicates mostly come from imports, integrations and people with two email addresses.
- **Stages that mean something.** HubSpot (29 September 2026) recommends separate pipelines only when the stages really differ, gives each stage a probability, needs Won and Lost stages for reporting, and can make properties required before a deal enters a stage [7]. Use that to require, for example, an event date and guest count before "Proposal sent".
- **Keep data true and no longer than needed.** Under the GDPR, personal data must be accurate and kept up to date, and corrected or deleted without delay when wrong; it should be kept for the shortest time possible, with set time limits to review or erase it [8]. A yearly review of old enquiries is part of hygiene, not an extra.

### Quotes and proposals

- **Tool behaviour.** HubSpot's legacy quotes (24 September 2026) can carry a default expiry, an approval step before the buyer sees the quote (Sales Hub Enterprise), e-signature and payment before signing [9]. Whatever the tool, every quote shows its expiry date.
- **Electronic signatures.** In the US, a contract or signature may not be denied legal effect only because it is electronic, and giving required consumer notices electronically needs the consumer's consent after set disclosures [12]. Other countries have their own rules; the client's lawyer decides which signature method fits.
- **Showing the full price, UK.** The CMA's guidance under the Digital Markets, Competition and Consumers Act 2024 [15] says the total price must appear in an invitation to purchase, with mandatory fees normally in the headline total. Drip pricing is banned; fines can reach 10% of turnover or £300,000, whichever is greater. "From" prices must include unavoidable charges; the CMA's own example is a photographer's flat booking fee. Charges paid locally, such as a resort fee, go in the total, with pay-now and pay-locally amounts shown [13][14].
- **Showing the full price, US.** The FTC's fees rule (in force since 12 May 2025) covers live-event tickets and short-term lodging, including hotels and the travel agents who sell them, and protects business buyers too. Any price shown must give the total with known mandatory fees, more prominently than other pricing; only government charges, shipping and optional extras may be left out, and they must be disclosed before payment [16].
- **Cancellation rights.** In the EU, consumers can cancel distance and off-premises contracts within 14 days, counted from the contract day for services. Exceptions include hotel bookings, car rental and catering for specific dates, and tickets [17]. In the UK, businesses must tell customers about the 14-day right; if they do not, it can stretch by up to 12 months. GOV.UK lists exemptions such as package holidays and passenger tickets, and says what must be given before an order, including deposit conditions [18]. Whether a venue hire, shoot or wedding service falls under an exception is a question for the client's lawyer.

### Travel

- **EU package travel.** Two or more types of travel service for the same trip can form a package, including when chosen at one point of sale or sold at an inclusive price. Before booking, the traveller gets the total price, payment terms, passport and visa requirements and a standard EU form. A price rise must be allowed by the contract, tied to specific costs and made at least 20 days before travel; above 8%, the traveller can cancel without a fee [19].
- **UK flight packages.** ATOL protects package trips that include a flight, and the customer should get an ATOL Certificate naming the ATOL holder, including through an agent [20].
- Entry rules, visas and live prices are never stated from memory; the quote note points to the official source and the supplier's confirmation.

### Property

- **UK.** National Trading Standards' Part A material information (12 July 2022) requires price or rent, council tax band and, for sales, tenure in every listing; the main portals flag listings that leave these fields empty [22]. NTS said in May 2022 that "price on application" listings were unlawful [21]. The government announced in June 2026 that it intends to introduce homebuying sales packs, so listing rules are changing [23].
- **US.** The Fair Housing Act protects race or color, religion, sex, national origin, familial status and disability, and covers steering and misleading information about availability [24]. Listing copy describes the home and the area's facts, never who should live there.

### Order handoffs in business-to-business sales

- **Standard documents.** In electronic data interchange (EDI), the X12 standard names the steps: 850 purchase order, 855 purchase order acknowledgment, 860 buyer change request, 865 seller change acknowledgment, 856 ship notice and 810 invoice [27]. Firms without EDI still need the same moments covered by email: received, confirmed, changed, shipped, invoiced.
- **Delivery terms.** Incoterms 2020 (in force since 1 January 2020) has eleven trade terms setting out tasks, costs and risks between seller and buyer [26]. A quote or confirmation that names the rule and the place removes a common dispute.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 14 days | EU and UK consumer cancellation window for distance and off-premises contracts | [17][18]; many exceptions; services counted from the contract day in the EU |
| 12 months | UK extension if customers are not told about the 14-day right | [18] |
| £42 | Value at or below which GOV.UK lists goods and services as exempt from the cancellation rules | [18]; check the current figure and scope |
| 10% of turnover or £300,000 | Maximum UK fine for drip pricing, whichever is greater | [13] |
| 12 May 2025 | Start of the US FTC fees rule for live-event tickets and short-term lodging | [16] |
| 8% / 20 days | EU package price rise that lets the traveller cancel free / last day for a price rise | [19] |
| 10 | Custom properties per HubSpot object that can require unique values | [6]; as of 2 Oct 2026 |
| 11 | Incoterms 2020 trade terms | [26] |
| 92% | US home sellers who used an agent, 2026 survey | [25]; NAR, transactions July 2025 to June 2026 |
| 20,000+ | Venues using Tripleseat | [2]; vendor's own claim |
| 9 in 10 | Sales teams using or planning AI agents within two years | [5]; vendor survey, no stated sample |

**Numbers I do not quote.** "Reply within five minutes or lose the lead", average proposal win rates, "couples contact X vendors", the ideal number of follow-ups and average booking lead times. They travel without a method. Use the client's own enquiry and booking data, or a named study with its date, sample and country.

## 5. Decision rules

- If a quote, proposal or contract will bind the client once the buyer accepts or signs, prepare it at level 2 and get a fresh yes for that send, even at level 3, because it commits the client.
- If an enquiry asks for a date, check the calendar or booking system first; if you cannot, say when you will confirm, because a promised date that turns out to be taken costs more than a slower reply.
- If the rate card does not cover what the buyer asked for, flag it for the client and leave the price blank; never estimate a price.
- If a price is shown to UK consumers, put mandatory fees in the headline total, because the CMA treats separate fees as not normally enough [13].
- If a US hotel, short-term rental or ticketed event shows a price, show the total with mandatory fees first [16].
- If a hold or option is about to end, send one clear reminder before it ends and act on the agreed rule; never let it lapse in silence or extend it without the client's OK.
- If a quote has expired, re-issue it with current prices and a new date rather than honouring the old one silently.
- If stock or a lead time is not confirmed, give the buyer options (wait, part-ship, substitute, cancel the line) instead of a date.
- If a buyer changes a confirmed order, send a change acknowledgment with the new lines, price and date, and get it accepted before anyone acts on it [27].
- If a trip combines a flight with a hotel or other service, treat it as a possible package: check the client's package process and, in the UK, its ATOL position before quoting [19][20].
- If listing copy describes who the home suits ("perfect for young families"), rewrite it to describe the home [24].
- If two CRM records look like the same person or company, list them for review; merging overwrites data, so it needs a fresh yes.
- If someone asks for their data to be corrected or deleted, pass it to the client the same day [8]; deletion needs a fresh yes.
- If a payment detail, bank account or refund appears in a thread, hand it to the client: moving money and changing payout details stay with them.
- If an enquiry is a poor fit, reply politely with the reason or a referral; never leave it unanswered.

## 6. Common mistakes and how to spot them

- **The template reply.** Spot it: the reply would fit any enquiry and ignores the date or question asked. Fix: answer the question in the first line.
- **Prices from memory.** A rate, package or fee not on the current rate card. Spot it: no line in the rate card matches. Fix: quote from the card or leave it blank.
- **Hidden extras.** Service charges, cleaning fees or booking fees that appear only in the contract [13][16].
- **Quotes with no expiry.** The buyer comes back months later expecting last year's price.
- **Holds that lapse.** A date released without a message, or held for weeks with no follow-up.
- **"Just checking in."** Follow-ups that add nothing. Each one should bring a fact, a sample, a tip or a real deadline.
- **Promised dates and stock.** "It'll ship Tuesday" with no confirmation from the warehouse.
- **Thin handoffs.** The delivery team learns the dietary needs, delivery address or shot list on the day. Spot it: operations asks the coordinator questions after the handoff.
- **Duplicate records.** The same couple in three records from a form, an import and an email. Spot it: two deals with the same date and surname [6].
- **Stage drift.** Deals sit in "Proposal sent" for months. Fix: required fields and a next-step date at each stage [7].
- **Lost with no reason.** The client cannot learn why enquiries do not book.
- **Fair housing slips.** Listings that say who the home is for, rather than what it has [24].
- **Treating every trip as flight plus hotel.** A package is booked without the package information or protection [19][20].

## 7. Quality bar

Before anything goes out, I check:
1. Does the reply answer the buyer's actual question in the first two lines?
2. Every price, package and fee from the current rate card or supplier quote, with the total shown up front [13][16]?
3. Inclusions, exclusions, deposit, payment dates and expiry stated; terms marked for the client to confirm?
4. Dates and availability checked, or the reply says when they will be confirmed?
5. Country rules considered: UK and EU cancellation and pricing, package travel, property listing rules, fair housing [17][18][19][22][24]?
6. Binding quotes and contracts held for a fresh yes?
7. CRM updated: stage, next step, date, owner, notes in the buyer's words?
8. Handoff complete enough that the delivery team needs nothing more?
9. Within the access level and limits the client set, with every live action logged?

## 8. How this role writes

- **First replies.** Under 150 words. Thank them, answer the question, one fact that matters to their event or order, one or two questions, one next step with a time. Warm, quick, in the client's voice.
- **Proposals.** The buyer's brief in their words, then the recommended option (two or three at most), what is included, timings, the total price, deposit and payment dates, expiry, and how to confirm. Terms and policies summarised in plain words and marked for the client's review.
- **Quote cover notes.** Short: why this option fits them, the total, what happens next and by when.
- **Hold and follow-up messages.** Each one adds something useful, names the real date, and the last one closes the file politely.
- **Order confirmations and backorder notes.** Fill-in fields for purchase order number, lines, quantities, dates and delivery terms; stock problems offer options in one message.
- **Handoff sheets.** One page: who, what, when, where, how many, special needs, what was promised in writing, open questions, contacts.
- **CRM notes.** Dated, factual, the buyer's words in quotes, the next step and its date.
- **Tone.** Polished, helpful, never pushy. No fake scarcity, no invented praise.

## 9. Glossary

- **Enquiry (inquiry):** a first request for prices, dates or information.
- **Qualifying question:** a question that shows whether the enquiry fits (date, guest count, budget, location).
- **Hold (provisional booking, option):** a date or item reserved for a set time without a contract.
- **Rate card:** the client's approved list of prices, packages and fees.
- **Quote / estimate:** a priced offer for specific goods or services, with an expiry date.
- **Proposal:** a quote plus the plan: options, timings, what is included and how to book.
- **Binding quote:** a quote the client must honour once the buyer accepts it.
- **Mandatory fee:** a charge the buyer cannot avoid; it belongs in the total price [13][16].
- **Drip pricing:** revealing extra charges later in the buying process [13].
- **Deposit / retainer:** an upfront payment that secures a booking.
- **BEO (banquet event order):** the venue's internal sheet for one event: timings, menu, layout, staffing [2].
- **Pipeline / stage:** the steps a deal moves through, each with a meaning and required fields [7].
- **Duplicate record:** two CRM records for the same person or company [6].
- **Purchase order (PO):** the buyer's order document; an 850 in X12 EDI [27].
- **Order acknowledgment:** the seller's confirmation of a PO; an 855 in X12 [27].
- **Backorder:** an ordered line not yet in stock.
- **Incoterms:** ICC trade terms that set delivery tasks, costs and risks [26].
- **Package (travel):** two or more types of travel service sold together for one trip [19].
- **ATOL:** UK financial protection for flight-inclusive packages [20].
- **Material information:** facts a property buyer or renter needs, such as price, council tax band and tenure [22].
- **Handoff:** passing a confirmed sale to the people who deliver it, with everything they need.

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| UK price transparency | CMA209 [13][14] | Guidance 18 Nov 2025, summary 7 Jan 2026 |
| US fees rule | FTC FAQ [16] | In force since 12 May 2025 |
| EU and UK cancellation rights | Your Europe [17]; GOV.UK [18] | Your Europe checked 28 Apr 2026 |
| Package travel and ATOL | Your Europe [19]; ATOL [20] | Your Europe checked 11 May 2026 |
| UK property listings | NTS [21][22][23] | Homebuying sales packs announced June 2026 |
| US fair housing | DOJ [24] | Page updated 22 Jun 2023 |
| HubSpot duplicates, pipelines, quotes | HubSpot knowledge base [6][7][9] | Pages dated Sep and Oct 2026; legacy quotes closed to new users |
| AI connectors | Claude Help Center [3]; HubSpot MCP [4] | Sends ask for approval by default; MCP scopes listed inconsistently |
| Client platform features | HoneyBook [1]; Tripleseat [2] | As of Nov 2026 |
| Incoterms | ICC [26] | 2020 edition current |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` Check the calendar before giving a date, and if you cannot, say when you will confirm, because a promised date that turns out to be taken costs more than a slower reply. (§5)
- `decision_rule` Re-issue an expired quote with current prices and a new date rather than honouring the old one silently. (§5)
- `decision_rule` When stock or a lead time is not confirmed, give the buyer options (wait, part-ship, substitute, cancel the line) instead of a date. (§5)
- `decision_rule` Reply to a poor-fit enquiry politely with the reason or a referral; never leave it unanswered. (§5)
- `taste_reference` First replies stay under 150 words and answer the buyer's actual question in the first two lines. (§8)
- `taste_reference` Each follow-up adds something useful and names the real date; the last one closes the file politely. (§8)
