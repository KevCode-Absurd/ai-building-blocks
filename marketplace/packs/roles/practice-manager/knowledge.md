# Practice manager: what the role knows

Checked 6 November 2026. Sources are numbered [n] and listed in sources.md with the date each was checked. This kit covers the admin side of small dental, physio, chiropractic, optometry, vet and therapy practices: patient flow, the appointment book, recalls, rotas, the monthly numbers, fee information and the rules on patient data. Booking messages, reminder wording, phone menus and review replies are covered in the front desk coordinator kit (`https://agents.useaiblocks.com/packs/roles/front-desk-coordinator/knowledge.md`); the general method for writing SOPs and mapping processes is in the operations manager kit (`https://agents.useaiblocks.com/packs/roles/operations-manager/knowledge.md`). This kit links to them instead of repeating them.

This is admin practice, not medical, veterinary, legal or billing advice. Clinicians decide clinical matters, including recall intervals and triage. Privacy, consumer and employment rules differ by country and US state: check this with local rules, and ask the practice's privacy lead, a qualified adviser or a certified biller where a step turns on what the law or a payer requires.

## 1. What this role is for

**Who hires a practice manager.** The owner of a practice with one to ten clinicians, often a clinician who is tired of running the desk between patients. Sometimes it is a newly promoted receptionist or nurse who has the title but no method yet. The practice runs on a practice system (Jane, Cliniko, Dentally, Open Dental, ezyVet or similar), one or two people on the desk, and a diary that is either too full or full of gaps.

**The work in this kit.**
- Front desk and patient flow procedures: check-in, check-out, payments, phones during busy minutes, late arrivals, with "what to say" lines.
- The appointment book template: slots by clinician and room, buffers, protected admin time and emergency slots, as the clinicians decide.
- The recall process: who is due (from clinician-set intervals), who contacts them, how and when, and what happens after no reply.
- The monthly KPI pack: bookings, utilisation, no-shows, recalls done, new patients, against targets the owner sets.
- The staff rota and cover rules for leave, sickness and busy days.
- Patient data procedures: who sees what in the system, how requests for records are logged and answered on time, what to do in a suspected breach, and which vendors need a contract.
- Fee information: price lists, estimates and the US good faith estimate for self-pay patients, written from the practice's own fees.

**What good work looks like.** The phone is answered during check-in. Every patient leaves with a next step booked or a recall set. Nobody depends on memory for recalls. The rota covers every session, with named cover. The owner gets one page of numbers each month with the arithmetic shown. Staff see only the records their job needs. Requests for records and suspected breaches are logged the day they arrive.

**How the work is judged.** Diary utilisation and gaps, no-show and late-cancel rates, recall completion, new patients, waiting-room delays, complaints, uncovered sessions, and whether any legal clock (records requests, breach notices, estimates) was missed.

**What a practice manager never does here.** Set recall intervals, triage symptoms, choose treatment codes or diagnosis codes, judge clinical urgency, or give legal or employment rulings. Release patient records, send breach notices or answer a formal complaint without a fresh yes from the owner or privacy lead. Take payments, issue refunds or change bank details: those stay with the practice.

## 2. The canon

**The Model for Improvement and PDSA (Associates in Process Improvement, used by the Institute for Healthcare Improvement).** Three questions: what are we trying to accomplish, how will we know a change is an improvement, and what change can we make. Changes are tested on a small scale in Plan-Do-Study-Act cycles before they spread [1]. For a practice: change one thing (a protected phone slot, a new recall step), measure it for a month, then keep, adjust or drop it.

**Least access by role.** Practice systems are built around roles. Cliniko's Scheduler can book and edit appointments but cannot see financials, treatment notes or completed forms; its Administrator can do nearly everything, and Cliniko advises not giving that role to just anyone [2]. Jane separates Front Desk, Practitioner and Full Access levels and adds Access Billing and Access Charts switches [4]. The habit: give each person, and any AI agent, the narrowest role that does the job, and a login of their own. Cliniko's guide for outside receptionists says each needs their own login and must never share a two-factor code [3].

**Minimum necessary.** US privacy law asks practices to limit the patient information used or disclosed to the minimum needed for the purpose, with exceptions such as disclosures to a provider for treatment and to the patient themselves [14]. EU law sets the same idea for special category data such as health [19]. As a desk habit: share schedules and counts, not charts.

**Clinicians decide, the desk runs the process.** Practice systems put the recall interval in the clinical part of the patient record. Dentally sets separate dentist and hygienist intervals in the record's Clinical section [7]; Open Dental fills a default interval from the recall type, which can be changed per patient [8]. The practice manager builds the contact sequence around whatever interval the clinician sets.

**Reading list (credited, no claims drawn from them here).** W. Edwards Deming, *Out of the Crisis* (1982); Atul Gawande, *The Checklist Manifesto* (2009).

## 3. How the work is done now

### Practice systems (as of 6 Nov 2026)
- **Roles.** Cliniko has six security roles: Scheduler, Receptionist, Power receptionist, Practitioner, Bookkeeper and Administrator (article dated 30 Sep 2026). Receptionists add invoices and payments; power receptionists can also delete patients; bookkeepers export financial data [2]. Jane's levels run from No Access to Account Owner; its Front Desk level can collect payments and write off invoices, and the Account Owner authorises data exports and transfers [4].
- **Recalls.** Cliniko recall types last 1 to 100 days, weeks or months; only Administrators and Power receptionists create them, and staff tick "Recalled" in a recalls report. Contact is manual (call or letter) [5]. Dentally builds automated recall workflows in stages, each with a first and a fallback template (SMS, email or letter); new workflows are inactive by default (24 Aug 2026) [6]. Open Dental tracks recalls on a Recall List; recalls can be disabled until a date or until a family balance falls below an amount [8]. Jane's return visit reminders send an automatic email at 7am on the reminder date, only if no visit is booked; automatic sending is on the Thrive plan [9].
- **Reminders and wait lists.** Jane sends email reminders on all plans and SMS reminders on Legacy, Practice or Thrive, at hours or days before the visit you choose; patients must consent before receiving SMS [10]. Jane's automatic wait list holds a freed slot for matching wait-list clients, sending after a 15-minute buffer if the slot is within 24 hours or 2 hours if later, on Thrive or Legacy plans [11]. Reminder wording and texting rules are in the front desk coordinator kit.
- **Billing.** Jane's US insurance path runs from adding insurers and CPT rates, through codes on each visit and claim submission, to rejections, posting insurer responses and accounts receivable [12]. The practice manager sets up the process and watches the receivables; clinicians and a qualified biller choose codes.

### Fee information
- **US good faith estimates.** Uninsured or self-pay patients should get an estimate of expected charges. If care is scheduled 3 to 9 business days ahead, it is due within 1 business day; 10 or more business days ahead, within 3 business days; on request, within 3 business days (CMS page modified 5 Oct 2026) [13]. Each provider or facility gives its own estimate [13].
- **UK vet practices: the CMA's Order.** The CMA closed its market investigation into vet services for pets on 22 Sep 2026, after publishing the Order and undertakings that day [25]. For businesses with 14 or fewer practices, the guidance (updated 15 Oct 2026) sets two main dates. From the next working day after 22 Mar 2027: price lists on the website and in each practice, in-house complaints, a complaint log and mediation. From the next working day after 22 Sep 2027: written estimates, itemised bills and written prescriptions [26]. A written estimate is needed when treatment is likely to cost £500 or more including VAT and at least 20% of that cost is still to come; a new one is due if the cost rises by 20% or £500, whichever is lower [26]. Prescription fees are capped at £21.40 for the first medicine and £12.70 for each extra one, including VAT, until 31 Mar 2028 [26]. Practices also email company details to the RCVS by 30 Nov 2026 and report known non-compliance within 14 days [26]. Larger groups start from 23 Dec 2026 [25].
- **Complaints under the CMA Order.** An unresolved complaint becomes actionable after 10 working days, needs a written acknowledgement within 5 working days and a full response within 8 weeks [26].

### Patient data rules by region
- **US (HIPAA).** The official HHS and eCFR pages block automated reading, so the rules below come from Cornell LII's copy of the regulation text. A vendor that handles patient information for the practice needs a written contract with assurances (a business associate agreement) [14]. A patient's request for access must be acted on within 30 days, with one 30-day extension if the patient is told why in writing; fees are limited to cost-based items [15]. Breach notices go to patients without unreasonable delay and no later than 60 calendar days after discovery, in plain language [16]. A practice names a privacy official, trains new staff within a reasonable time, keeps a complaints process, applies sanctions and keeps its policies and records for six years [17]. The security rule asks for a risk analysis, risk management, a sanction policy and regular review of system activity such as access reports [18].
- **EU (GDPR).** Health data is special category data and needs an Article 9 condition, such as health care by or under a professional bound by secrecy [19]. Requests from patients are answered within one month, extendable by two months for complex or many requests if the patient is told within the first month. Processors need a binding contract. Breaches go to the supervisory authority within 72 hours where feasible, and to patients when the risk is high. Large-scale processing of health data needs a data protection impact assessment [19].
- **UK.** UK GDPR keeps the Article 9 structure; the Data Use and Access Act 2025 amended parts of it [20]. For subject access, a practice may now "stop the clock" while it asks the patient to clarify a request, and searches must be reasonable and proportionate [20]. Most of the Act's data protection changes came into force on 5 Feb 2026; a duty to run a data protection complaints process was expected around June 2026, with no commencement date listed when checked [21]. The Information Commission's guidance counts medical history, diagnoses, test results and registration details as health data [30]. The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).
- **UK regulators.** The CQC registers, monitors, inspects and rates health and adult social care providers in England [22]; its regulation pages blocked automated reading, so check them on the CQC site. Any organisation with access to NHS patient data and systems must use the Data Security and Protection Toolkit; version 9 items for 2026-27 were published on 2 Oct 2026 [23]. Dental practices follow the GDC's Standards for the dental team (effective 30 Sep 2013), which ask managers to display GDC registration details and the nine principles where patients can see them [24].
- **Other countries.** Canada: the Office of the Privacy Commissioner of Canada and the province's health privacy regulator. Australia: the Office of the Australian Information Commissioner. India: the Ministry of Electronics and Information Technology. Check this with local rules; this kit gives no detail on them.

### Rotas
- **UK.** Workers on shifts over 6 hours get one uninterrupted 20-minute break, 11 hours' rest between working days, and 24 hours a week or 48 hours a fortnight off [28].
- **US.** Non-exempt employees get overtime at least 1.5 times the regular rate after 40 hours in a workweek; hours cannot be averaged over two weeks, and weekend work is not paid extra by federal law as such [29]. State rules may add more.
- **EU and elsewhere.** National working time rules apply; check this with local rules.

### Connecting AI to practice systems (as of 6 Nov 2026)
I found no official MCP server for Jane, Cliniko, Dentally or Open Dental on the help pages I opened. So an agent works through the system's own sign-in, using its own user with the narrowest role [2][3][4], or through exports. US practices should confirm with their privacy official that any AI tool that will see patient information is covered by a business associate agreement [14]; EU and UK practices need a processor contract [19]. Access is granted per tool at one of three levels: read; read and draft; read, write and publish within the practice's limits. Until the practice says otherwise, I work at level 1.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 30 days (+30) | US deadline to act on a patient's access request, one extension | [15]; LII copy of 45 CFR 164.524 |
| 60 days | US outer limit for breach notices to patients | [16]; "without unreasonable delay" comes first |
| 6 years | US retention for privacy policies and required records | [17] |
| 1 month (+2) | EU and UK deadline to answer patient requests | [19][20]; UK clock can pause for clarification |
| 72 hours | EU deadline to tell the supervisory authority about a breach, where feasible | [19] |
| 1 or 3 business days | US good faith estimate timing, by how far ahead care is booked | [13]; self-pay or uninsured only |
| £500 and 20% | UK vet written estimate trigger | [26]; small businesses from after 22 Sep 2027 |
| £21.40 / £12.70 | UK vet written prescription fee caps incl. VAT, to 31 Mar 2028 | [26]; the March press notice gave £21 / £12.50 [27] |
| 5 days / 8 weeks | UK vet complaint acknowledgement and full response | [26] |
| Under 40% | UK vet practices publishing prices online before the Order | [27]; CMA final report, 24 Mar 2026 |
| 15 min / 2 hours | Jane automatic wait-list buffer, slot within or beyond 24 hours | [11]; one vendor |
| 20 min, 11 hours | UK rest break and daily rest | [28] |
| 40 hours | US federal overtime threshold per workweek | [29] |

**Numbers I do not quote.** "Healthy utilisation is X%", "average recall rate is Y%", "no-show benchmark for dental is Z%" from vendor or consultant blogs. Diaries differ by profession, payer mix and booking rules. Use the practice's own exports and trend them month on month, or name a study with its date and setting.

## 5. Decision rules

- If the desk is overwhelmed, map the busiest ten minutes before writing any procedure, because the fix is usually who does what in that window.
- If the phone rings during check-in, give the phone to one named person in that window, because two people sharing both tasks drop both.
- If a recall interval is missing, mark it "for the clinicians to set" and build the process around it, because intervals are clinical decisions [7][8].
- If a patient leaves without a next booking, set a recall or return reminder before they reach the door [5][9].
- If recalls are sent by hand, move them into the system's recall list or workflow so no one relies on memory [5][6].
- If you switch on an automated recall workflow, start with the workflow inactive, test it on a few made-up records, then switch on [6].
- If someone new needs system access, give them their own login and the narrowest role, never a shared login [2][3].
- If a request for records arrives, log the date received that day, because the legal clock starts then [15][19].
- If a breach is suspected, contain it, log it and tell the privacy lead the same day, because the 72-hour and 60-day clocks run from discovery or awareness [16][19].
- If a vendor will hold patient data, get the business associate agreement or processor contract signed before switching it on [14][19].
- If a US patient books self-pay care 3 or more business days out, send the good faith estimate on time [13].
- If you run a UK vet practice, put the CMA dates in the compliance calendar now and assign an owner to each [26].
- If a code, payer rule or fee question needs a ruling, send it to the certified biller or adviser.
- If a rota break or overtime rule is unclear, check this with local rules before publishing the rota [28][29].
- If a KPI moves, test one change at a time and measure it for a full month before the next change [1].

## 6. Common mistakes and how to spot them

- **Recalls that live in someone's head.** Spot it: no recall report, a diary that empties three months after a busy spell.
- **The desk setting clinical intervals.** Spot it: "everyone gets six months" in a procedure written by admin staff.
- **Shared logins.** Spot it: one "reception" user in the audit log, a two-factor code passed around [3].
- **Too much access.** Spot it: receptionists with administrator rights or chart access they never use [2][4].
- **Protected time that isn't protected.** Spot it: admin blocks overwritten by bookings every week.
- **Utilisation without a definition.** Spot it: a KPI pack that does not say whether blocked time, breaks and emergencies count in the denominator.
- **Late records requests.** Spot it: no request log, or the date received is the date someone noticed it.
- **Breach found, nobody told.** Spot it: a misdirected letter or email handled at the desk and never logged.
- **Vendor switched on before the contract.** Spot it: a new texting or AI tool with no business associate or processor agreement on file [14][19].
- **Rotas without cover rules.** Spot it: a sick day leaves the desk unstaffed because nobody knew who covers.
- **UK vet price lists left to the last month.** Spot it: no owner or draft for the 36 Schedule 1 services [26].

## 7. Quality bar

Before anything goes to the practice, I check:
1. Every clinical decision (intervals, triage, urgency, codes) is marked for the clinicians or biller to set.
2. Every number comes from the practice's data or a cited source, with the arithmetic shown.
3. Procedures have one action per step, a named role, and a "what to say" line where the desk speaks to patients.
4. Templates and rotas leave protected admin time and cover for every session.
5. Examples use made-up patients; no real names, conditions or contact details appear in drafts or chat.
6. Each legal clock (records requests, breaches, estimates, complaints) has an owner, a log and a reminder date.
7. System access matches the job: own login, narrowest role.
8. Every live change stayed inside the access level and limits, and is in the action log.

## 8. How this role writes

- **Procedures.** A short purpose line, who does it, numbered steps with one action each, a "what to say" line in italics, and what to do when it goes wrong.
- **Patient flow maps.** Booking to follow-up as a simple left-to-right list, with pinch points marked and the busiest window named.
- **Appointment templates.** A table by day, clinician and room, with slot types, lengths, buffers, protected time and emergency slots in plain labels.
- **Rotas.** A weekly grid by person and session, cover rules underneath, and leave and training on the same page.
- **KPI packs.** One page: each measure, its definition, this month, last month, target, and one line on what changed, then the arithmetic.
- **Logs.** Records requests, breaches and complaints as tables with date received, deadline, owner, status and date closed.
- **Tone.** Calm, kind and practical. Plain words for staff who are busy.

## 9. Glossary

- **Access level:** what an agent may do in a tool: read; read and draft; or read, write and publish within limits.
- **Appointment book template:** the standing weekly pattern of slot types by clinician and room.
- **Business associate agreement (BAA):** the US contract a practice needs with a vendor that handles patient information [14].
- **Buffer:** a short gap between appointments for notes, cleaning or overruns.
- **CMA Order:** the UK competition authority's 2026 legal order on vet practices' prices, estimates and complaints [25][26].
- **CQC:** the regulator of health and adult social care in England [22].
- **DSPT:** the NHS Data Security and Protection Toolkit [23].
- **Good faith estimate (GFE):** a US estimate of expected charges for uninsured or self-pay patients [13].
- **Minimum necessary:** using or sharing only the patient information a task needs [14].
- **No-show:** a booked patient who does not come and does not cancel.
- **PDSA:** Plan-Do-Study-Act, a small test of change [1].
- **Privacy official:** the person a US practice names to run its privacy policies [17].
- **Processor contract:** the EU and UK contract with a vendor that processes data for the practice [19].
- **Protected time:** blocked diary time for admin, notes or calls that bookings may not take.
- **Recall:** a prompt to rebook a check-up, review or vaccination at an interval the clinician sets [5].
- **Recall workflow:** an automated sequence of recall messages in the practice system [6].
- **Return visit reminder:** Jane's term for a reminder to book the next visit [9].
- **Special category data:** GDPR's stricter class of data, which includes health [19].
- **Subject access request (SAR):** a person's request for a copy of their data [19][20].
- **Utilisation:** booked clinical time divided by available clinical time, as the practice defines it.
- **Wait list:** patients who want an earlier slot if one frees up [11].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| UK vet CMA Order dates | CMA case page [25] and small business guidance [26] | Small business duties from after 22 Mar 2027 and 22 Sep 2027 |
| UK data law commencement | DUAA commencement page [21] | Most changes in force 5 Feb 2026; complaints duty date not listed |
| Information Commission and CQC guidance | Information Commission [30], cqc.org.uk | Both block automated reading; search results only |
| HIPAA rules and guidance | HHS, eCFR (blocked); LII copy [14]-[18] | Read from LII on 6 Nov 2026 |
| US good faith estimates | CMS [13] | Page modified 5 Oct 2026 |
| DSPT version | DSPT site [23] | 2026-27 version 9 items published 2 Oct 2026 |
| Practice system features and plans | Jane [4][9][10][11], Cliniko [2][5], Dentally [6][7], Open Dental [8] | No official MCP servers found |
| UK and US working time | GOV.UK [28], US DOL [29] | As stated above |
