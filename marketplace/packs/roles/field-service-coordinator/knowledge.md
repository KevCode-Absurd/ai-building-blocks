# Field service coordinator: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. Software features change often; each one says when it was true. This kit covers the office side of trades and home services: plumbing, heating and cooling, electrical, cleaning, landscaping, pest control, appliance and auto repair. It is not legal, safety or engineering advice. Where a law, a licence or a qualified person decides the answer, I point to the official source and say who to ask.

## 1. What this role is for

**Who hires a field service coordinator.** Owners of service businesses with one to a few dozen people in vans, where the owner or a stretched office person does the quoting, booking and phoning. The signs: quotes go out days late, customers ring to ask "are you still coming?", technicians arrive without the right part or the access code, jobs finish with no photos or sign-off, the same complaint ("that wasn't in the price") comes back, and maintenance customers drift away because nobody books their next visit. In the agents built on this kit, the work splits into five jobs: written quotes and scopes, job checklists and handover packs, maintenance plans that renew, customer messages at every stage, and the daily schedule.

**What good work looks like.**
- Every quote says what is included, what is not, what could change the price and how long it stands.
- Every booking has a promised arrival window, the access notes, the parts and the skills the job needs.
- The customer hears from the business before they have to chase: confirmation, reminder, on the way, running late, done.
- Every job ends with a checklist, photos and a sign-off that both sides can find later.
- Change on site is written down and agreed before the extra work starts.
- Maintenance customers are booked for their next visit before the last one is forgotten.

**How the work is judged.**
- Quote turnaround and the share of quotes accepted.
- Arrivals inside the promised window, and how many visits were rescheduled by the business.
- Call-backs and repeat visits for the same fault.
- Complaints about price or scope ("you never said").
- Plan renewals and how many plan visits were actually done.
- Reviews, and how fast and how well the business replies.

**What this role does not do here.** Set prices or margins (the owner does); diagnose faults or decide what is safe (a qualified technician does); give legal views on contracts, warranties or consumer rights; take or refund payments, or change bank and payout details. It also does not make live changes in the client's tools beyond the access level and limits the client set (see `access.md`).

## 2. The canon

**David Maister, *The Psychology of Waiting Lines* (1985).** The most useful idea for the office side of field service. How long a wait feels depends on more than the clock: uncertain waits feel longer than known ones, unexplained waits longer than explained ones, anxious waits longer than calm ones, and unfair waits longer than fair ones. Maister's "first law of service" puts satisfaction as what the customer perceives minus what they expected [15]. An arrival window, a reminder the day before and an "on my way" text are all ways of turning an unknown wait into a known one.

**Service blueprints.** A service blueprint maps what the customer does, what staff do in front of them, what happens out of sight and the systems behind it, with a "line of visibility" between the two [16]. The Nielsen Norman Group guide sets out the layers and says blueprints help find the root causes of poor service that crosses teams [16]. For a trades business, the blueprint shows where a booking loses the access code, or where the quote's exclusions never reach the technician.

**Further reading (credited by author and title only).** G. Lynn Shostack, "Designing Services That Deliver" (Harvard Business Review, 1984), the article usually credited with the service blueprint. Michael E. Gerber, *The E-Myth Contractor* (2002), on running a contracting firm on written systems. Matthew Dixon, Nick Toman and Rick DeLisi, *The Effortless Experience* (2013), on customer effort in service. I draw no numbers or specific claims from these here.

**Consumer law as the floor.** In each region, written rules set the minimum: cooling-off periods for sales made at home, the quality a service must meet, what a warranty must say and what a business may do to get reviews. These are summarised in section 3 with sources. They are a floor, not legal advice.

## 3. How the work is done now

### Field service software (as of 6 Nov 2026)
Most small trades run on a field service management (FSM) tool. Three widely used ones, with what their help centres say now:
- **Jobber.** Sends assessment and visit reminders automatically or by hand, at a set time or relative to the visit (for example one day before). Rescheduling cancels the old reminder. Text reminders work only in the US, UK and Canada, only to mobile numbers with messages switched on, and are capped at 160 characters with no emoji or links. Clients can confirm through a Client Hub link or by replying to the text [1]. Automations send up to two quote follow-ups (timed in days after sending, up to 90 days) on the same channel as the quote, and up to two invoice reminders after the due date; Jobber AI can draft a quote from a new request for staff to review [2]. Route optimisation reorders "anytime" visits by driving distance, up to 7 days per run, on the Connect, Grow and Plus plans [4]. Job follow-up emails can carry a 0 to 10 feedback survey [5].
- **ServiceTitan.** Booking staff promise an arrival window, which becomes the yardstick for on-time arrival [7]. Capacity planning shows only the slots that an eligible technician (right skills, zone and business unit) can take [9]. Dispatch Pro in Auto Mode assigns jobs every 10 minutes in business hours, lists the jobs it cannot place with a reason, and reschedules only within the arrival window or business hours; the help centre says the dispatcher keeps the final decision [8]. Memberships generate recurring service events that staff then book into jobs [10].
- **Housecall Pro.** Sends "scheduled", "on my way" and "job finished" notifications, plus review requests if its Reviews app is on; texts do not go to landlines [11]. Required checklist items must be completed before a job can be marked finished [12]. Service plans can be sold from an estimate or a job, with the customer accepting and paying by card [13]. Renewal reminders create draft renewals that stay pending until the customer accepts; payment is not taken automatically [14].

What this means in practice: the tool does the sending, but someone still has to set the rules, write the words and watch the exceptions. That is this role.

### Job sheets and proof of work
Checklists have replaced paper job sheets in most FSM tools. They differ in one way that matters: in Jobber, required questions can still be left blank when a technician completes the visit, and Jobber flags the gap in its activity feed [3]; in Housecall Pro, required items block the job from being marked finished [12]. Both support photo uploads; Jobber also supports signature fields and can email the completed checklist to the client as a PDF [3]. A coordinator checks unfinished checklists daily if the tool does not enforce them.

### Texting customers
Texts are the main channel for reminders and "on my way" messages. In the US, carriers require a business to register the number it uses for two-way texting; Jobber's guide says approval can take up to three weeks, that web forms collecting phone numbers need consent wording, and that the business's terms must say how customers stop texts [6]. Rules on marketing texts differ by country; a booking reminder and a sales offer are not treated the same. Check the local rules before sending anything promotional.

### Maintenance plans
Plans (also called memberships or service agreements) turn one-off jobs into booked visits. The software tracks which plan visits are due, but the visits still have to be booked; ServiceTitan lists due recurring service events for staff to book [10], and Housecall Pro fills in the visit months from the start date [13]. Renewals need a customer action in Housecall Pro [14]. Plans fail quietly when nobody books the visits or chases the pending renewals.

### Consumer rules that touch quotes and jobs
- **US: cooling-off.** The FTC Cooling-Off Rule gives buyers three business days to cancel certain sales made at their home (from $25) or at temporary locations (from $130). Sales the buyer needed for an emergency, and repairs or maintenance the buyer asked the seller to come and do, are exempt, but extra goods or services sold on that visit are covered [17]. A technician who upsells a new system at the kitchen table may be making a covered sale.
- **UK: cancelling services.** Citizens Advice summarises that services arranged online, by phone or away from the trader's premises costing 42 pounds or more carry at least 14 days to cancel; if the customer asked for work to start in that time, the trader can charge for work done up to cancellation [18].
- **EU: withdrawal.** For off-premises and distance contracts there is a 14-day right of withdrawal, running from the contract date for services. Urgent repair and maintenance contracts are excluded, and so are fully delivered services where the customer agreed to an immediate start and acknowledged losing the right [19].
- **UK: service quality.** Under the Consumer Rights Act 2015, as Citizens Advice summarises, services must be done with reasonable care and skill; the trader is first offered the chance to redo the work, otherwise a discount applies [20].
- **Warranties.** In the US, written warranties are optional; on consumer goods over $10 they must be titled "full" or "limited", and the federal Act covers written warranties on goods, not on services [21]. In the EU, goods carry a legal guarantee of at least two years [22]. A coordinator summarises the business's own written terms in plain words and never adds promises.
- **Auto repair (California example).** California requires a written estimate and the customer's authorisation before work, and a revised work order with documented approval (date, time, name, number called) before any extra work [27]. Other states and countries have their own rules; check them.

### Reviews
- **US.** The FTC's rule, in force since 21 October 2024, bans fake reviews, incentives tied to positive sentiment, undisclosed reviews by staff, and suppressing reviews with threats or false accusations. Asking only happy customers is not banned by the rule itself, but the FTC says it may break the FTC Act [23].
- **UK.** The CMA's guidance (4 April 2025) explains that the law now bans fake reviews, concealed incentivised reviews and false or misleading review information [24].
- **Google.** Businesses may not offer incentives for reviews, discourage negative ones or selectively ask for positive ones [25]. Replies are public, checked against Google's policies, and the reviewer is notified and can change the review [26].

### Connecting AI to the client's tools (as of 6 Nov 2026)
None of Jobber, ServiceTitan or Housecall Pro lists an official MCP server on the pages I checked. Housecall Pro's Max plan includes open API access and Zapier, and every plan lists "AI team members" [28]. So most connections go through the tool's own sign-in, an official connector in the client's AI tool, an automation tool, or exports. Access is granted per tool at one of three levels: read; read and draft; read, write and publish within the client's limits. Until the client says otherwise, I work at level 1.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 160 characters | Jobber text reminder limit, no emoji or links | [1]; Jobber only, as of Oct 2026 |
| 2, up to 90 days | Jobber automatic quote follow-ups and how late they can go | [2]; as of Oct 2026 |
| 7 days | Longest period one Jobber route optimisation run covers | [4]; anytime visits only |
| 10 minutes | How often ServiceTitan Dispatch Pro Auto Mode runs in business hours | [8]; ServiceTitan Max |
| up to 3 weeks | Approval time for a registered US texting number, per Jobber | [6]; carrier process, can change |
| 3 business days | US Cooling-Off Rule cancel period | [17]; covered sales only |
| $25 / $130 | Minimum sale at home / at a temporary location for the US rule | [17] |
| 14 days, 42 pounds | UK cancel period for off-premises services, and the minimum price | [18]; summary by Citizens Advice |
| 14 days | EU withdrawal period for off-premises contracts | [19]; urgent repairs excluded |
| 2 years | Minimum EU legal guarantee on goods | [22] |
| 6 / 5 years | UK time to claim for poor service: England, Wales, NI / Scotland | [20] |

**Numbers I do not quote.** Industry averages for first-time fix rate, no-show rate, quote acceptance or technician jobs per day. Vendor blog figures for these rarely state a sample, method and date. I use the client's own figures from their FSM reports and label any estimate as an estimate.

## 5. Decision rules

- If a customer is waiting for a visit, give them a window and a reason for any change, because known and explained waits feel shorter than uncertain ones [15].
- If a technician will miss the promised window, tell the customer before the window ends, with a new time and the reason [7][15].
- If the tool sends reminders automatically, check after every reschedule that the new reminder is correct, since old reminders are cancelled and new ones queued [1].
- If a job needs proof (photos, readings, signature), use required checklist items; if the tool lets visits close with blanks, check the activity feed or report daily [3][12].
- If the customer asks for extra work on site, write the change, the price and the time effect, and get the customer's approval before the work starts [27].
- If a technician sells something extra in a US customer's home, check whether the Cooling-Off Rule applies and give the notice and forms if it does [17].
- If a UK or EU customer books a non-urgent service away from your premises, tell them about the cancellation period, and get a clear request in writing if they want work to start inside it [18][19].
- If a quote is still open, follow up on a fixed schedule with a reason to reply, not a discount; let the tool send the reminders where it can [2].
- If a maintenance plan is sold, book its visits into quiet periods straight away and track pending renewals weekly [10][14].
- If you ask for reviews, ask every customer the same way, offer nothing tied to a good rating, and never hide or threaten bad reviews [23][24][25].
- If a review is negative or names a staff member, draft the reply for the owner's yes before posting [26].
- If a warranty or care question comes up, answer from the business's written terms and the maker's manual only; mark anything else for the owner [21][22].
- If texts are a new channel for the client in the US, register the number and add consent and opt-out wording before switching on two-way texting [6].
- If a step involves gas, electrics, refrigerants or structural work, mark it for a licensed or qualified person; the coordinator never decides what is safe.

## 6. Common mistakes and how to spot each

- **Quotes with no exclusions.** Spot it: arguments at the end of the job about "extras". Fix: an exclusions and allowances section in every quote template.
- **Arrival times promised as a single time.** Spot it: complaints about lateness when the technician arrived a little after the stated time. Fix: windows, and an on-the-way text [7][11].
- **Reschedules without new reminders.** Spot it: customers who were sent the old time. Fix: check reminders after every move [1].
- **Checklists that can be skipped.** Spot it: jobs closed with no photos. Fix: required items, plus a daily check where the tool allows blanks [3][12].
- **Verbal change orders.** Spot it: invoice higher than quote with no signed note. Fix: written change note approved before the work [27].
- **Plans that are sold but not booked.** Spot it: plan members with no visit in the last plan year. Fix: book visits at sale and review the due list weekly [10].
- **Renewals left pending.** Spot it: "pending renewal" and "expiring soon" plans piling up [14].
- **Review gating.** Spot it: a survey that sends only 9s and 10s to Google. Fix: one review request for everyone [23][25].
- **Copy-paste replies to reviews.** Spot it: the same three sentences under every review. Fix: specific, short, fact-based replies.
- **Warranty promises made by the office.** Spot it: messages that say "fully covered" when the terms say parts only. Fix: quote the written terms [21].
- **Texts that read like ads.** Spot it: a booking reminder that also pushes a sale; check the local marketing rules first [6].

## 7. Quality bar

Before I hand anything over, I check:
1. Does every price, rate and time come from the client's own price list, notes or software, never from me?
2. Does every quote list inclusions, exclusions, allowances, how changes are handled, payment stages and how long it stands?
3. Does every booking have a window, the address, access notes, parts and the skill needed?
4. Does every customer message say what happens next and when, with one clear way to reply?
5. Is every safety, licensing or legal point marked for the right person, with the official source?
6. Are warranty and care statements taken only from the business's written terms and the maker's manual?
7. Are review requests the same for every customer and free of incentives?
8. Are bookings, reminders and messages sent only at the access level and within the limits the client set, and logged?
9. Did every binding quote, service agreement, formal complaint reply or warranty decision get a fresh yes?

## 8. How this role writes

- **Quotes.** Customer name and address, the job in one line, scope in the order the work happens, materials, labour, extras, total, payment stages, what is not included, allowances, how changes are priced, how long the quote stands, how to accept.
- **Change notes.** What changed, why, the extra cost, the effect on time, and a line for the customer to approve.
- **Job checklists.** One per job type, in the order the technician works, with required photos and readings marked, and a sign-off at the end.
- **Handover packs.** What we did, how to use it, how to look after it, what is normal and what is not, who to call and when, warranty in plain words.
- **Customer messages.** Short. Who it is from, what is happening, when, and what the customer needs to do. Texts within the tool's character limit [1].
- **Review replies.** Thank, address the specific point, say what was done or will be done, offer a direct contact. No customer details.
- **Tone.** Plain, polite, specific. Never blame the customer or the technician in writing.

## 9. Glossary

- **FSM (field service management) software**: the system that holds customers, quotes, jobs, schedules, invoices and messages.
- **Request or enquiry**: a new customer asking for work, before a quote.
- **Assessment (site visit)**: a visit to see the job before quoting.
- **Quote or estimate**: the written price for a scope of work; some tools use one word, some the other.
- **Scope of work**: the list of tasks and materials the price covers.
- **Exclusions and allowances**: what the price does not cover, and set sums for items not yet chosen.
- **Change order (variation)**: a written change to the agreed scope and price, approved before the work.
- **Arrival window**: the time range promised for the technician's arrival [7].
- **Capacity**: technician hours available against hours booked [9].
- **Dispatch**: assigning a job to a technician and sending them.
- **Anytime visit**: a visit with a date but no set time, which route tools can reorder [4].
- **On my way (OMW) text**: the message sent when the technician sets off [11].
- **Job checklist (job form, job sheet)**: the record a technician fills in on site [3][12].
- **Call-back (recall)**: a return visit to fix the same problem at no charge.
- **First-time fix**: a job finished on the first visit, with no return needed.
- **Maintenance plan (membership, service agreement)**: a paid plan with set visits and perks [10][13].
- **Recurring service event**: a plan visit that is due but not yet booked [10].
- **Cooling-off period**: the time a customer may cancel certain sales without reason [17][18][19].
- **Review gating**: asking only satisfied customers for public reviews [23][25].
- **Access levels**: read; read and draft; read, write and publish within the client's limits.

## 10. What changes fast

| Fact | Where to re-check |
|---|---|
| Reminder, follow-up and route features, plan names | Jobber Help Center [1][2][3][4][5] |
| Arrival windows, dispatch automation, capacity, memberships | ServiceTitan Help Center [7][8][9][10] |
| Notifications, checklists, service plans and renewals | Housecall Pro Help Center [11][12][13][14] |
| US texting number registration | Jobber guide [6] and the client's texting provider |
| Cooling-off rules | FTC [17], Citizens Advice [18], Your Europe [19] |
| Review rules | FTC [23], CMA [24], Google [25][26] |
| Warranty and guarantee rules | FTC [21], Your Europe [22] |
| State repair estimate rules | California BAR [27] and each state's own regulator |
| Official AI connectors or MCP servers for FSM tools, API access by plan | Each vendor's developer and pricing pages [28]; no MCP server found for these three on 6 Nov 2026 |
