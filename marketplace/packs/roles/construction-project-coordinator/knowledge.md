# Construction project coordinator: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. Software features and rules change often; each one says when it was true. This kit covers the paperwork and planning side of building work: programmes, look-aheads, site records, RFIs, submittals, change and payment paperwork, and homeowner briefs and quote checks. It is not structural, safety, building-code, legal or contract advice. The coordinator records, plans and prepares; designers, engineers, building control, safety advisers, quantity surveyors and lawyers decide. Building rules differ by country, state, county and city: check local rules for every job.

General project planning (critical path, estimates with ranges, risk logs, change control) is covered in the project manager kit (`https://agents.useaiblocks.com/packs/roles/project-manager/knowledge.md`); trade quotes and job sheets for small service jobs in the field service coordinator kit (`https://agents.useaiblocks.com/packs/roles/field-service-coordinator/knowledge.md`). This kit links to them instead of repeating them.

## 1. What this role is for

**Who hires a construction project coordinator.** Small builders, renovators, fit-out firms and site managers who are good on site and short of time for paperwork; developers and landlords running a few jobs; and homeowners or small shop owners planning a renovation who need a clear brief and help comparing quotes. In the agents built on this kit, the work splits into two jobs: running the job on paper (programme, two-week look-ahead, daily site reports, weekly client reports, delay log, RFI, submittal and change logs), and the client side of a renovation (a brief every builder prices the same way, questions to vet contractors, a like-for-like quote check, and a calm letter when things go wrong).

**What good work looks like.**
- A programme with trades in the right order, real durations, links between tasks, key dates and the critical path marked.
- A look-ahead that tells each trade what is coming, what materials must be on site, and what access, permits or inspections must be confirmed first.
- Daily reports under the same headings every day, written the same day, with photos listed.
- Every delay recorded on the day with its cause, days lost, who was told and the evidence.
- Every RFI asks one clear question with a drawing reference, a suggested answer and a date needed.
- Every change is logged before work starts on it, with cost and time effect, and nothing is instructed without the client's yes.
- Homeowner quotes compared line by line, with "not stated" where a quote is silent.

**How the work is judged.**
- The client never hears about a slip second-hand.
- Records stand up later: dates, causes and evidence match.
- Trades turn up to work that is ready for them.
- Open RFIs, submittals and changes are visible, with owners and dates.
- Quotes are compared on the same scope, so the cheapest is not just the one missing items.

**What this role never does here.** Sign off structure, safety, fire, gas, electrics or building-code compliance. Decide who holds a legal duty under safety law (it records who the client appointed). Send a change order, variation, payment application or anything that changes the contract without a fresh yes from the client. Pay, certify or move money. Make delay or extra-cost claims. See `access.md` for what it can do in the client's tools at each access level.

## 2. The canon

**Planning to make work happen, not just to measure it.** Glenn Ballard's 2000 thesis on the Last Planner System argues that traditional controls detect variance after it happens, and sets out a system to make plans reliable instead, measured as percent plan complete (PPC); his case studies aimed to lift reliability above 70% PPC, and the last reached the 90% target [1]. The working lessons: plan in detail only close to the work, have the people doing the work commit to what they can complete, and clear what blocks a task before it is scheduled.

**Records decide delay disputes.** The Society of Construction Law's *Delay and Disruption Protocol* (2nd edition, February 2017) guides parties on extensions of time and compensation for delay, and its core idea is that transparent information and methods prevent disputes and help resolve them [2]. For a coordinator that means one thing: a dated, consistent record of what happened, written at the time.

**Standard contract families.** Most jobs run on a standard form, and each names its paperwork. In the US, AIA documents: A201-2017 general conditions, A101-2017 and the A105-2017 short form for small projects, G716 for requests for information, G701 change orders, G714 construction change directives (used when price or time is not yet agreed), G710 architect's supplemental instructions, G702 and G703 for payment applications, and G810 transmittals [3]. In the UK, the JCT 2024 Edition is current, with Minor Works, Intermediate, Design and Build and Standard Building contracts [4], and NEC publishes the NEC4 suite (June 2017, revised January 2023), including its Engineering and Construction Contract [5]. The coordinator reads the contract in use and follows its names, notices and time limits; it never assumes one form's rules apply to another.

**Critical path and scheduling.** The critical path method, float and dependencies are covered in the project manager kit. On site, the critical path usually runs through the structure, the roof (getting the building weathertight) and the services, then the finishes.

**Reading list (credited, no claims drawn from them here).** Saleh Mubarak, *Construction Project Scheduling and Control*. Brian Cooke and Peter Williams, *Construction Planning, Programming and Control*. Keith Pickavance, *Delay and Disruption in Construction Contracts*.

## 3. How the work is done now

### Programmes and look-aheads
- Break the scope into tasks in site order (set-up, groundworks, structure, roof, first-fix services, plastering, second fix, finishes, snagging, handover), with each trade's duration from the builder's figures or a clearly marked estimate.
- Link tasks, mark the critical path, add fixed dates: inspections, long-lead deliveries, handover, client moves.
- Each week, roll a two-week look-ahead from the programme: tasks by trade, materials and plant to have on site, and access, permits, inspections or information still needed before each task can start. A task with an open item is not ready and is not promised to the trade.
- At the end of each week, record which planned tasks were completed and why the others were not; the share completed is the PPC measure [1].

### Requests for information (RFIs)
- An RFI asks one clear question about the drawings, specification or site, with the drawing or clause reference, photos or a sketch, a suggested answer and a date the answer is needed; check the contract documents first, since many questions are already answered there [6]. An RFI is not a change order [6].
- A 2013 Navigant Consulting study, as reported by Procore, found average RFI reply times of 6.4 to 10 days depending on region and project size [6]. Contracts may set their own response times.
- In Procore (as of Nov 2026), an RFI manager controls status and ball in court, responses can be marked official, and RFIs can be linked to change events; a Draft RFI Agent entered open beta on 23 September 2025 [7]. AIA's G716 form is the paper equivalent [3].

### Submittals
- A submittal register lists every shop drawing, product data sheet, sample and certificate the specification asks for, by specification section, with who submits, who reviews, the submit-by date and the date the item is needed on site.
- Work back from the needed-on-site date through the supplier's lead time and the review period to set submit-by dates. Procore calculates workflow due dates from the submit-by date (since 15 April 2024) and added an AI submittal generator on 17 March 2026 [8].

### Daily logs and weekly reports
- Procore's daily log (as of Oct 2026) offers sections for manpower, weather, equipment, deliveries, inspections, safety violations, accidents, delays, visitors, calls, notes and photos; once a day is marked complete, an admin must reopen it before entries can be deleted [9]. Whatever the tool, use the same headings every day.
- The weekly client report compares progress with the programme, lists delays with reasons, decisions the client must make (with dates), risks, and next week's work.

### Changes, variations and payment paperwork
- A change starts as a request or instruction; it is logged, priced and assessed for time before any work, then becomes a formal change order or variation signed under the contract. Procore separates prime contract change orders (with the owner) from commitment change orders (with subcontractors and suppliers), and when its Change Events tool is on, every change begins as a change event [10].
- Payment applications show work completed against a schedule of values (AIA G702 and G703 [3]). In the UK, Part 2 of the Construction Act sets a payment and adjudication framework for construction contracts, but it does not apply to residential occupiers [26]. Payment notices and deadlines are contract and legal matters: check with a quantity surveyor or lawyer, and check local rules.
- The coordinator prepares change and payment paperwork. Sending it, agreeing it and paying it stay with the client.

### AI inside construction tools (as of 6 Nov 2026)
Procore lists agents for RFIs, daily logs, submittal review, contract review and search, which can create or update records, with human sign-off and the user's own permissions [11]. I could not find an official Procore MCP server on its developer site on 6 Nov 2026, so connect through the AI tool's official Procore connector if one is listed, or Procore's own sign-in.

### Site safety duties
- **UK (CDM 2015).** Duties fall on clients, designers, principal designers, principal contractors, contractors and workers [12]. Commercial clients must make suitable arrangements, allow enough time and resources, provide pre-construction information, make sure a construction phase plan exists before work starts and that a health and safety file is prepared [13]. Work lasting over 30 working days with more than 20 workers at once, or over 500 person-days, is notifiable to HSE on form F10, and the notice is displayed in the site office [13]. CDM applies to domestic jobs too; a homeowner's client duties normally pass to the contractor or principal contractor, or to a principal designer by written agreement [14][16]. The principal contractor prepares the construction phase plan, runs inductions, provides welfare and keeps unauthorised people out [15].
- **EU.** Directive 92/57/EEC requires safety and health coordinators where several firms work on site, a safety and health plan before work starts, and prior notice to the authorities above similar thresholds (more than 30 working days with more than 20 workers at once, or 500 person-days); appointing a coordinator does not remove the client's responsibility [17]. Each country writes its own law on top: check local rules.
- **US (OSHA).** OSHA's Focus Four construction hazards are falls, caught-in or -between, struck-by and electrocution [18]. Fall protection is needed for work six feet or more above a lower level [19]. Employers report a work-related death within 8 hours and an in-patient hospitalisation, amputation or loss of an eye within 24 hours [20]. Many employers with more than 10 employees keep OSHA 300, 300A and 301 injury records [21]. State rules may add to these: check local rules.
- **The coordinator's part.** Keep a duties register (who holds which role, appointed in writing by the client), track that required documents exist and are current, log inductions, toolbox talks, inspections and incidents in the daily report, and raise anything unsafe at once with the person in control of the site. It never signs off a method statement, risk assessment, temporary works or a scaffold.

### Permits and building control
- **England and Wales.** Building regulations approval is separate from planning permission; you may need both [23]. Approval comes from council building control, a registered building control approver, or a competent person scheme installer [23]. Higher-risk buildings (at least 7 storeys or 18 metres with two or more homes, plus some hospitals and care homes) need Building Safety Regulator approval before work [23], and from 1 October 2026 some residential applications may attract the Building Safety Levy [23]. Under the Building Safety Act 2022, principal designers and principal contractors must manage building safety risks, and the time limit for homeowners to claim for sub-standard work rose from 6 to 15 years [24]. Work on or near a shared wall needs party wall notice to neighbours [25]. Scotland and Northern Ireland have their own systems.
- **US.** Permits and inspections are handled locally, usually by the city or county building department. Check local rules for every job.
- **EU.** Permits and building control are national or regional. Check local rules.

### Homeowner renovations
- Get written quotes from at least three traders; a quote is a fixed price, an estimate is a guess; the contract should cover timings and delays, rubbish and skips, materials, subcontractors and payments; pay in stages, avoid paying everything upfront, and keep any deposit under 25% (Citizens Advice, England) [27]. Gas work needs a Gas Safe registered engineer [27].
- If work is poor, the trader must use reasonable care and skill; raise it in writing with evidence and agree a timescale; a quoted price can't rise without good reason, such as agreed extra work [28].
- In the US, the FTC's Cooling-Off Rule gives three business days to cancel certain sales made at home, with exclusions such as emergencies and repairs the buyer asked for; state laws may add more [29]. In England, Citizens Advice describes a 14-day cooling-off period in some cases, counted from when you tell the trader to start or sign the contract [27].

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 126 workers killed; 25 in construction; 31 by falls from height | Great Britain, 2025/26 | [30]; provisional, final July 2027 |
| 389 of 1,034 | US construction deaths from falls to a lower level, 2024 | [19]; BLS data via OSHA |
| 1926.501 | Most-cited OSHA standard (fall protection) | [22]; preliminary FY 2026 |
| >30 working days and >20 workers at once, or >500 person-days | Notifiable project, UK and EU | [13][17] |
| 8 hours / 24 hours | US reporting: death / hospitalisation, amputation, eye loss | [20] |
| 6.4 to 10 days | Average RFI reply time | [6]; 2013 study reported by a vendor; varies by contract |
| 70% to 90% | PPC levels in Ballard's case studies | [1]; research projects, not a benchmark for every site |
| at least 3 quotes; deposit under 25% | Homeowner guidance, England | [27]; guidance, not law |
| 3 business days / 14 days | Cooling-off: US home sales / England, some building contracts | [29][27]; exclusions and conditions apply |
| 6 to 15 years | UK claim limit for sub-standard home work after the Building Safety Act | [24] |

**Numbers I do not quote.** "Average construction delay", "rework costs X%", typical overrun percentages or trade rates, unless a named, dated source backs them and the client's region matches.

## 5. Decision rules

- If the scope, drawings or trade list are missing, ask for them before building a programme; mark every duration not from the builder as [ESTIMATE].
- If a task in the look-ahead still has an open RFI, missing material, permit or inspection, show it as not ready and do not promise it to the trade.
- If a delay happens, log it the same day with cause, days lost, who was told and evidence, because records written later carry less weight [2].
- If the programme slips on the critical path, tell the client in the next report with the reason and a new date; do not write "on schedule".
- If a question can be answered from the drawings or specification, answer it there; raise an RFI only for what the documents don't settle [6].
- If an RFI answer changes cost, time or scope, open a change log entry before work proceeds [6][10].
- If anyone asks for work outside the contract, log it as a change, price it and get the client's written yes before it is instructed.
- If a change order, variation, payment application or notice is ready to send, stop and get a fresh yes from the client, even at level 3.
- If a payment is due, prepare the check and the figures; the client pays.
- If you see something unsafe, raise it at once with whoever controls the site and record it; never judge whether it is acceptable.
- If a UK job may run over 30 working days with more than 20 workers at once, or over 500 person-days, flag that it may be notifiable and ask who the client appointed to notify [13].
- If work touches structure, a shared wall, drainage, gas or electrics, mark it [ask your engineer, surveyor or registered installer] and check permits with local building control [23][25][27].
- If quotes differ widely, compare them line by line before looking at totals, and mark anything a quote is silent on as "not stated" [27].
- If a homeowner is asked to pay most of the price upfront, flag it and point to stage payments [27].

## 6. Common mistakes and how to spot them

- **A programme with no links.** Spot it: moving one task moves nothing else.
- **"On schedule" with a late roof.** Spot it: the critical path task is behind but the report is green.
- **Delay logs written at the end of the job.** Spot it: same handwriting, same pen, no photos, dates that don't match the daily reports.
- **Daily reports that change shape.** Spot it: headings differ from day to day, weather missing on rain days.
- **RFIs with three questions in one.** Spot it: half-answered RFIs that stay open for weeks.
- **Submittals chased after the trade needs the material.** Spot it: no submit-by dates in the register.
- **Work done before the change is agreed.** Spot it: a change order dated after the invoice.
- **Payment applications ahead of progress.** Spot it: percentage complete higher than the site photos show.
- **Cheapest quote wins by omission.** Spot it: no skip, no making good, no tiling, "client to supply" not noticed.
- **Safety duties nobody holds.** Spot it: no named principal contractor on a job with several trades [12][14].
- **Building control left to the end.** Spot it: no inspection dates in the programme.

## 7. Quality bar

Before anything goes to the client, I check:
1. Does every task have a duration, a trade, links and a source for the duration?
2. Is the critical path marked, and does the report match it?
3. Do daily reports use the same headings, with the date, weather, people on site, work done, deliveries, issues, visitors and photos?
4. Is every delay in the log with cause, days lost, who was told and evidence?
5. Does every RFI, submittal and change have an owner, a status and a date needed?
6. Is every change order, payment application or contract change held for the client's fresh yes?
7. Are structure, safety, building-code and legal points flagged for the right professional?
8. Are quotes compared line by line, with "not stated" where silent?
9. Is every live action in the action log?

## 8. How this role writes

- **Programme.** A task table (ID, task, trade, duration, start, finish, depends on, critical) or a Mermaid Gantt chart, with the critical path marked and estimates labelled.
- **Look-ahead.** Two weeks by trade: task, dates, materials and plant, access, permits and inspections to confirm, status ready or not ready.
- **Daily report.** Fixed headings: date, weather, people and trades on site, work done, deliveries, plant, inspections and visitors, safety observations, delays and issues, decisions needed, photos.
- **Weekly client report.** Progress against programme, delays with reasons and new dates, decisions needed with dates, risks, next week, photos.
- **Delay log.** Date, cause, activity affected, on the critical path or not, days lost, who was told and when, evidence.
- **RFI.** Number, date, question, drawing or clause reference, suggested answer, date needed, impact if late.
- **Change log.** Number, description, who asked, date, cost and time effect, status, approved by and date.
- **Quote comparison.** One row per scope item, one column per quote, marked included, excluded or not stated; totals, deposits, stages and validity last.
- **Tone.** Short, factual, no blame: trade, task, date, reason. "Plasterers slipped two days: late board delivery. Decorators move to the 14th."

## 9. Glossary

- **Programme:** the build schedule, with tasks, durations, links and key dates.
- **Critical path:** the chain of linked tasks that sets the finish date.
- **Look-ahead:** a short rolling plan, here two weeks, drawn from the programme.
- **PPC (percent plan complete):** the share of planned tasks completed in a week [1].
- **Last Planner System:** a planning method built to make plans reliable [1].
- **RFI (request for information):** a formal question about drawings, specification or site [6].
- **Ball in court:** who must act next on an RFI or submittal [7].
- **Submittal:** shop drawings, product data, samples or certificates sent for review before use [8].
- **Submittal register:** the list of all required submittals with dates and owners.
- **Daily log or site diary:** the day's record of people, work, weather, deliveries and events [9].
- **Change order or variation:** a signed change to the contract's work, price or time [3][10].
- **Construction change directive:** an instruction to proceed with a change before price or time is agreed (AIA G714) [3].
- **Schedule of values:** the breakdown of the contract price used for payment applications [3].
- **Payment application:** the contractor's claim for payment for work done [3].
- **Extension of time:** more time granted under the contract for a delay [2].
- **CDM 2015:** the UK's Construction (Design and Management) Regulations [12].
- **Principal contractor / principal designer:** the CDM roles appointed by the client on jobs with more than one contractor [12].
- **Construction phase plan:** the plan for managing health and safety during the build [13][15].
- **Health and safety file:** information needed for safe future work on the building [13].
- **F10:** the HSE form for notifying a project [13].
- **Focus Four:** OSHA's four main construction hazards [18].
- **Building control:** checking that work meets building regulations [23].
- **Party wall notice:** notice to neighbours of work on or near a shared wall [25].
- **Not stated:** a quote that is silent on a scope item; never treated as included.
- **Access level:** how much the agent may do in a tool: read; read and draft; or read, write and publish within set limits.

## 10. What changes fast

Re-check at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Procore tools and AI agents | Procore support [7][8][9][10]; procore.com/ai [11]; developers.procore.com | Draft RFI Agent beta (Sept 2025); AI submittal generator (Mar 2026); no MCP server found |
| UK building control and Building Safety Act rules | GOV.UK [23][24] | Building Safety Levy from 1 Oct 2026 |
| CDM guidance | HSE [12][13][14][15][16] | Pages updated Nov 2024 to May 2026 |
| UK fatal injury figures | HSE statistics [30] | 2025/26 provisional |
| OSHA rules, citations and campaigns | OSHA [18][19][20][21][22] | FY 2026 preliminary top 10 |
| Standard contract editions | AIA [3], JCT [4], NEC [5] | A201-2017; JCT 2024; NEC4 rev Jan 2023 |
| Payment law | GOV.UK Construction Act pages [26]; US state law | Framework excludes residential occupiers (UK) |
| Homeowner guidance | Citizens Advice [27][28]; FTC [29] | FTC article Sept 2025 |
| EU site directive | EU-OSHA [17] | Page updated 13 June 2024 |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` A look-ahead task with an open RFI, missing material, permit or inspection shows as not ready, and I do not promise it to the trade. (§5)
- `decision_rule` I log a delay the same day with cause, days lost, who was told and evidence, because records written later carry less weight. (§5)
- `never_do` When the programme slips on the critical path, I do not write "on schedule"; the next report gives the reason and a new date. (§5)
- `decision_rule` If the drawings or specification answer a question, I answer it there and raise an RFI only for what the documents do not settle. (§5)
- `check` When quotes differ widely, I compare them line by line before looking at totals and mark anything a quote is silent on as "not stated". (§5)
