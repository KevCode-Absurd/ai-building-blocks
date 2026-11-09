# Facilities and maintenance coordinator: what the role knows

Checked 6 November 2026. Sources are numbered [n] and listed in sources.md with the date each was checked. This kit covers keeping equipment, vehicles and buildings working in small businesses: the asset register, planned preventive maintenance, daily check sheets, work orders, contractors, the compliance calendar and repair-or-replace reviews. Health and safety documents, risk assessments and audits are covered in the QHSE manager kit (`https://agents.useaiblocks.com/packs/roles/qhse-manager/knowledge.md`); customer-facing trade jobs and quotes in the field service coordinator kit (`https://agents.useaiblocks.com/packs/roles/field-service-coordinator/knowledge.md`); general SOP writing in the operations manager kit (`https://agents.useaiblocks.com/packs/roles/operations-manager/knowledge.md`). This kit links to them instead of repeating them.

This is maintenance coordination, not safety sign-off or legal advice. A competent person, engineer, inspector or the equipment maker decides whether something is safe, what an inspection finds and what the law requires. Rules differ by country and US state: check this with local rules.

## 1. What this role is for

**Who hires a facilities and maintenance coordinator.** Trades and delivery businesses with 5 to 50 vehicles; gyms, kitchens and small factories with a room full of kit; property and maintenance teams looking after a few buildings; clinics and offices whose owner is tired of chasing the boiler engineer. Usually there is no maintenance department, just a manager with a spreadsheet, a pile of service invoices and a phone full of contractors.

**The work in this kit.**
- An asset and vehicle register: every asset with an ID, location, age, hours or mileage, service interval, last and next service, warranty and owner.
- A planned preventive maintenance (PPM) calendar from the makers' intervals and the competent person's schemes, spread so no week is overloaded.
- Daily check sheets that take two minutes and get done, with what a fail looks like and who to tell.
- A work order form and log: fault, priority, assigned to, fixed date, downtime and cost.
- Contractor jobs: scope, risk information, access, approval and sign-off of the work done.
- A compliance calendar: legionella checks, fire safety checks, gas, electrical, lifting, vehicles and asbestos dates, with the competent person for each.
- Repair-or-replace reviews from repair, running and downtime costs.

**What good work looks like.** Every asset has an ID and a next-due date. Planned work is done on time and logged. Daily checks are filled in and failures reach the right person the same day. No statutory or competent-person date is missed. Breakdowns fall, and the ones that happen are fixed faster because parts, contractors and access are known. The owner sees cost and downtime per asset.

**How the work is judged.** PPM completed on time, overdue compliance items (target: none), breakdowns and repeat faults per asset, downtime, work order response and fix times, cost per asset, check sheet completion, and contractor jobs closed with evidence.

**What this role never does here.** Declare a vehicle, machine, gas appliance, water system or building safe; sign off an inspection; set a legal interval; return to service an asset a competent person took out of service; or give repair instructions beyond the maker's manual. Order contractor work above the agreed cap, sign contracts, or pay invoices without a fresh yes.

## 2. The canon

**Planned preventive maintenance (HSE).** HSE describes maintenance as preventing problems, correcting faults and keeping equipment working, and says a planned programme makes equipment more reliable, cuts breakdowns and finds faults early. It points to the maker's instructions as the guide, especially for safety-critical parts, and asks that work be scheduled into downtime where possible [1]. Where a machine has a maintenance log, the law expects it kept up to date [1].

**Intervals fixed to the calendar, or floating from the last job.** MaintainX names the two scheduling choices clearly: fixed intervals keep each job on its original date whatever happened before, which suits maker, warranty or legal schedules; floating intervals count from when the last job was finished [2]. Time and meter triggers can run together, with whichever comes first winning [2]. The rule of thumb that follows: legal and warranty dates are fixed; wear-based servicing can float.

**Risk-based frequency, not habit.** HSE says annual portable appliance testing is not a legal requirement: the duty is to maintain equipment to prevent danger, and checks should match the equipment and where it is used [20]. The same thinking applies across the register: frequency follows risk, the maker and the competent person, not "once a year because we always have".

**The competent person.** Legionella control needs an appointed "responsible person" under the Approved Code of Practice L8 [11]; asbestos needs a competent responsible person to run the management plan [28]; maintenance work is done only by people with the right information, instruction and training [1]. The coordinator's job is to know who that person is for each risk and make sure their dates and findings are in the calendar.

**Using contractors (HSE INDG368).** HSE's brief guide for businesses that use contractors: identify the job, select a contractor who can do it safely, assess the risks together, share information on site risks and emergency procedures, cooperate, consult your own staff, manage and supervise, and review afterwards. Its message is not to assume competence but to check it [26]. The leaflet dates from 2012 and still cites CDM 2007; CDM 2015 now applies [27].

**Reading list (credited, no claims drawn from them here).** F. Stanley Nowlan and Howard F. Heap, *Reliability-Centered Maintenance* (1978); John Moubray, *Reliability-centred Maintenance* (second edition, 1997); Seiichi Nakajima, *Introduction to TPM* (1988).

## 3. How the work is done now

### Maintenance software (as of 6 Nov 2026)
Most small teams move from spreadsheets to a computerised maintenance management system (CMMS) or a fleet tool.
- **MaintainX.** Maintenance plans generate preventive work orders on calendar, meter or combined triggers, on fixed or floating intervals, and can nest tasks (monthly checks plus extra quarterly or annual tasks) in one plan [2]. Requester users, and anyone with a request portal link or QR code, can report faults; administrators approve requests into work orders [3]. Default roles are Requester, Full User, Administrator and Operator, with custom roles on some plans [4].
- **UpKeep.** PM triggers can be time-based, meter-based, condition-based or hybrid; calendar options include every N days, weeks or months, set weekdays and positions in the month; work orders can be created a set time before they are due (article dated 17 Nov 2025) [5].
- **Fleetio.** Vehicle service reminders use time, a primary meter and an optional second meter, due on whichever comes first, with "Due Soon" thresholds that trigger notifications; a reminder resolves when its task is recorded on a completed work order or service entry [6].

What this means in practice: the software sends the reminders, but someone still has to set the intervals from the maker and the competent person, keep the register true, and chase what is overdue. That is this role.

### Legionella and water systems
- **UK.** Employers and those in control of premises, including landlords, must identify and assess legionella risk, manage it, prevent or control it, and keep records, under health and safety law and the L8 Approved Code of Practice (page updated 25 Nov 2024) [7]. Water between 20 and 45°C, stagnation, deposits such as scale and biofilm, and sprays create risk [8]. L8 (fourth edition, 2013) gives ACOP status to the risk assessment, the responsible person, the control scheme and its review [11].
- **Hot and cold water checks (HSG274 Part 2).** Calorifier flow temperature stays at 60°C or above and the return not below 50°C; hot outlets reach at least 50°C within one minute (55°C in healthcare premises); cold outlets fall below 20°C within two minutes; far sentinel points on circulating loops are monitored monthly; little-used outlets are flushed weekly or as the risk assessment says [12]. These checks come from the site's own risk assessment and written scheme; HSG274 is the technical guidance behind them.
- **Testing.** Open systems such as cooling towers are tested at least quarterly; hot and cold water systems usually are not tested for legionella unless the control regime is in doubt, and samples go to a UKAS-accredited laboratory [9]. For homes, HSE says temperature checks are the reliable method and no "legionella test certificate" is required [10].
- **The Barrow case.** In August 2002 a legionella outbreak linked to a council-owned arts and leisure building in Barrow-in-Furness killed 7 people and made 180 ill (HSE page updated 4 Aug 2026) [13]. It is the standard reminder of why the checks and the responsible person matter.
- **US.** CDC's toolkit (dated 15 Mar 2024) describes legionella water management programs as an industry standard for many US buildings and includes a worksheet to decide whether a building needs one [14].
- **EU.** The Drinking Water Directive (EU) 2020/2184 sets a legionella value below 1,000 CFU per litre, asks member states to focus monitoring on priority premises such as hospitals and other large buildings, and requires the first risk assessment of domestic distribution systems by 12 Jan 2029 [15]. National rules carry the detail; check them.

### Fire safety
- **UK (England and Wales).** The "responsible person" includes employers, owners, landlords, occupiers and facilities or building managers; where there are several, they must cooperate [16]. They carry out and regularly review a fire risk assessment, keep a written record, and appoint a competent person if they lack the expertise [17]. Alarms and emergency lighting are checked regularly, faults recorded, escape routes and fire exits kept clear, and at least one fire drill held a year [18]. Scotland and Northern Ireland have their own rules [16].
- **US.** Portable fire extinguishers are visually inspected monthly and get an annual maintenance check, with the date recorded and kept for one year after the last entry or the life of the shell, whichever is shorter [19].
- **EU and elsewhere.** National fire rules apply; check this with local rules.

### Work equipment, isolation and gas
- **Isolation.** HSE asks that machines are stopped, isolated and locked off before maintenance, stored energy released and hot parts cooled; high-risk work may need a permit-to-work [1]. In the US, the lockout/tagout standard requires written energy control procedures, an inspection of each procedure at least annually, and contractors and host employers to share their lockout procedures [21].
- **Forklifts (US).** Powered industrial trucks are examined before use at least daily (after each shift if used round the clock); a truck with a safety defect stays out of service until repaired [22].
- **EU.** The work equipment directive 2009/104/EC requires adequate maintenance, inspections by competent persons after installation and periodically, and records of the results [23].
- **Gas (UK).** In workplaces such as shops, restaurants, schools and hospitals, only a Gas Safe registered engineer may install, maintain or repair gas appliances and pipework, and the employer must check the registration; appliances, pipework and flues are maintained in line with the maker's instructions [30].

### Vehicles
- **UK.** DVSA's guide says at least one walkaround check should be done in every 24 hours a vehicle is in service, defects written up and anything unroadworthy fixed before use; "nil" defect reports are good practice. Safety inspections are typically every 4 to 13 weeks, set by age, load and use, and records are kept at least 15 months. Vans outside operator licensing should still have a suitable maintenance regime (guide updated 28 Apr 2025) [24].
- **US.** Under 49 CFR 396.11, drivers of commercial motor vehicles report defects at the end of each day's work on each vehicle; no report is needed if no defect is found; the carrier repairs and certifies before the vehicle runs again and keeps reports for three months [25]. Read via Cornell LII because the FMCSA page blocked automated reading.

### Contractors
- **Selection and control.** Ask about how they manage the work, subcontractors, recent safety record, written policy and risk assessments (required only with five or more employees), qualifications and Employers' Liability insurance; agree risks before work starts; decide who supervises and how work stops if there is a concern [26].
- **Construction work.** Under CDM 2015, commercial clients make arrangements for the project, appoint a principal designer and principal contractor where more than one contractor is involved, and give pre-construction information; a project is notifiable when it lasts over 30 working days with more than 20 workers at once, or exceeds 500 person-days (page updated 12 Jan 2026) [27].
- **Asbestos.** In non-domestic premises, the dutyholder keeps a register of asbestos-containing materials, a management plan reviewed at least every 12 months, and gives the information to anyone who may disturb them, including maintenance workers [28].
- **US multi-employer sites.** OSHA's policy can cite the employer that created, exposed, corrected or controlled a hazard; a controlling employer must take reasonable care to prevent and detect violations by contractors, with inspections matched to their track record [29].

### Connecting AI to maintenance tools (as of 6 Nov 2026)
I found no official MCP server for MaintainX, UpKeep or Fleetio on the help pages I opened. So an agent works through the tool's own sign-in with its own user and a narrow role [4], through an automation tool, or through exports. Access is granted per tool at one of three levels: read; read and draft; read, write and publish within the client's limits. Until the client says otherwise, I work at level 1.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 20 to 45°C | Water temperature range that creates legionella risk | [8] |
| 60°C / 50°C | Calorifier flow and return temperatures | [12]; HSG274 Part 2, 2024 edition |
| 50°C in 1 min (55°C healthcare) | Hot sentinel outlet target | [12] |
| Below 20°C in 2 min | Cold sentinel outlet target | [12] |
| Monthly / weekly | Sentinel loop monitoring / flushing little-used outlets | [12]; or as the risk assessment says |
| Quarterly | Legionella testing of open systems such as cooling towers | [9] |
| Under 1,000 CFU/l | EU legionella value for drinking water | [15] |
| 7 deaths, 180 ill | Barrow-in-Furness outbreak, 2002 | [13] |
| 1 a year | Minimum UK fire drills | [18] |
| Monthly / annual | US extinguisher visual check / maintenance | [19] |
| Daily | US forklift examination before use | [22] |
| Annual | US review of each lockout procedure | [21] |
| Every 24 hours | UK walkaround check while a vehicle is in service | [24] |
| 4 to 13 weeks | Typical UK safety inspection interval for goods and passenger vehicles | [24]; set per fleet |
| 15 months / 3 months | UK inspection record retention / US driver report retention | [24][25] |
| 12 months | Asbestos management plan review, at least | [28] |
| 30 days and 20 workers, or 500 person-days | CDM 2015 notification threshold | [27] |

**Numbers I do not quote.** "Preventive maintenance saves X%", "reactive repairs cost three to five times more", "world-class PM compliance is Y%" or "average mean time between failures" from vendor blogs. Savings depend on the assets and how they are used. Use the client's own work order and cost history, or a named study with its date and setting.

## 5. Decision rules

- If an asset has no ID, give it one before anything else, because work orders, checks and costs all hang on it.
- If a service interval is missing, mark it [confirm with maker] instead of guessing, because a wrong interval gives false comfort.
- If a date is set by law, warranty or a competent person's scheme, use a fixed interval; if it follows wear, a floating or meter interval may suit [2].
- If time and meter both matter (vehicles, compressors), use whichever comes first [2][6].
- If a daily check fails on a safety item, take the asset out of use under the client's rule and tell the named person the same day; only a competent person returns it to service [22][24].
- If a check sheet takes longer than a few minutes, cut it to the items that matter, because long sheets get ticked without looking.
- If a fault repeats on the same asset, review repair or replace with downtime included.
- If a contractor is new, check competence, insurance and how they will manage the work before the first job [26].
- If the work touches building fabric in a pre-2000 or unknown building, check the asbestos register first and give it to the contractor [28].
- If the job is construction work with more than one contractor, check the CDM client duties before it starts [27].
- If equipment will be worked on, confirm isolation and any permit-to-work with the competent person [1][21].
- If gas appliances need work, use a Gas Safe registered engineer and check the registration [30].
- If a water system has a legionella risk assessment, put its checks into the calendar exactly as written, with the responsible person named [7][11][12].
- If a contractor order would exceed the agreed cap, stop and ask before raising it.

## 6. Common mistakes and how to spot them

- **A register nobody trusts.** Spot it: assets with no ID, duplicates, "unknown" in location or last-service columns.
- **Intervals from habit.** Spot it: everything "annual", no maker or competent person named as the source [20].
- **Calendars that pile up.** Spot it: twelve services due in the first week of January and nothing in February.
- **Floating dates on legal checks.** Spot it: a statutory examination drifting later every year because it counts from the last late job [2].
- **Ticked but not checked.** Spot it: check sheets completed in seconds, identical every day, no failures ever recorded.
- **Failures with nowhere to go.** Spot it: "brakes spongy" written on a sheet and no work order raised.
- **Returned to service without sign-off.** Spot it: an asset marked out of use and back in use the same hour with no repair record.
- **Contractors briefed at the door.** Spot it: no asbestos information, isolation plan or emergency procedure given before work [26][28].
- **Cost without downtime.** Spot it: repair-or-replace sums that ignore days off the road.
- **Legionella checks with no scheme behind them.** Spot it: temperatures logged with no targets, sentinels or responsible person [7][12].

## 7. Quality bar

Before anything goes to the client, I check:
1. Every asset has an ID, a location and an owner.
2. Every interval names its source (maker, competent person, law) or is marked [confirm with maker].
3. Nothing I wrote says or implies an asset is safe.
4. Check sheets fit on one page, list what a fail looks like and say who to tell.
5. Work orders carry priority, downtime and cost, and close only with evidence of the work.
6. The compliance calendar names the competent person for each item.
7. Every contractor job has scope, risk information, access, approval and sign-off.
8. Every live change stayed inside the access level and limits, and is in the action log.

## 8. How this role writes

- **Registers.** A wide table: ID, asset, location, make and model, age, hours or mileage, interval and its source, last done, next due (with the formula written out), warranty, owner.
- **PPM calendars.** Weeks across, assets down, tasks in cells, with weekly workload totals.
- **Check sheets.** One page, tick boxes, a "fail looks like" column and a "tell" line. Commands, not sentences.
- **Work orders.** Fault, asset ID, reported by, date, priority, assigned to, parts, fixed date, downtime, cost, sign-off.
- **Contractor packs.** Scope, site risks, asbestos information, isolation and permits, access and times, contacts, what "done" means.
- **Repair or replace.** A side-by-side cost table over one to three years with every sum shown.
- **Tone.** Plain, steady and practical, like a foreman at the start of a shift.

## 9. Glossary

- **Access level:** what an agent may do in a tool: read; read and draft; or read, write and publish within limits.
- **Asset register:** the list of every asset with its ID and maintenance details.
- **Calorifier:** a hot water storage vessel [12].
- **CDM 2015:** the UK regulations on managing construction work, including client duties [27].
- **CMMS:** computerised maintenance management system, such as MaintainX or UpKeep [2][5].
- **Competent person:** someone with the training, skills and experience to do a task or judge safety for it.
- **Downtime:** time an asset cannot be used because of a fault or repair.
- **DVIR:** US driver vehicle inspection report [25].
- **Fixed interval:** a schedule that keeps original due dates regardless of when earlier work was done [2].
- **Floating interval:** a schedule that counts from when the last job was completed [2].
- **Isolation (lockout/tagout):** cutting off and locking energy sources before work [1][21].
- **L8:** HSE's Approved Code of Practice on legionella control [11].
- **Meter trigger:** a service due by hours, miles or cycles rather than date [2][6].
- **Permit-to-work:** a written authorisation for high-risk work with set controls [1].
- **PPM:** planned preventive maintenance [1].
- **Responsible person (legionella):** the person appointed to manage legionella control [11].
- **Responsible person (fire):** the person in control of premises with fire safety duties [16].
- **Sentinel outlet:** a tap chosen to represent the water system for temperature checks [12].
- **Walkaround check:** a driver's daily check of a vehicle before use [24].
- **Work order:** a record of a job from report to fix, with time and cost.
- **Work request:** a fault report from staff that becomes a work order once approved [3].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| CMMS and fleet features, plans, connectors | MaintainX [2][3][4], UpKeep [5], Fleetio [6] | No official MCP servers found |
| HSE legionella pages and HSG274 | HSE [7]-[12] | HSG274 second edition 2024 (Part 1 revised) |
| UK fire safety guidance | GOV.UK [16]-[18] | As stated above |
| CDM and asbestos pages | HSE [27][28] | CDM page updated 12 Jan 2026 |
| DVSA roadworthiness guide | GOV.UK [24] | Updated 28 Apr 2025 |
| US OSHA and FMCSA rules | OSHA [19][21][22][29]; LII copy [25] | FMCSA site blocked automated reading |
| EU drinking water risk assessments | EUR-Lex [15] and national rules | First assessment due by 12 Jan 2029 |
| CDC legionella toolkit | CDC [14] | Dated 15 Mar 2024 |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` An asset with no ID gets one before anything else, because work orders, checks and costs all hang on it. (§5)
- `decision_rule` Dates set by law, warranty or a competent person's scheme get a fixed interval; wear-driven work may suit a floating or meter interval. (§5)
- `decision_rule` When both time and meter matter, I schedule on whichever comes first. (§5)
- `decision_rule` If a check sheet takes longer than a few minutes, I cut it to the items that matter, because long sheets get ticked without looking. (§5)
- `decision_rule` When a fault repeats on the same asset, I review repair against replace with downtime included. (§5)
