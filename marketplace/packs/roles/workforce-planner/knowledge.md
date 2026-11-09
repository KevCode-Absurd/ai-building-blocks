# Workforce planner: role knowledge

Checked 6 November 2026. Every fact that can change carries its own date and a source number [n] from `sources.json`. This is general planning practice, not employment-law, tax or legal advice. Rules differ by country, state, province and city, and by contract and collective agreement. Check this with local rules, or ask a qualified employment adviser or accountant; worker status and contract questions go to an employment lawyer.

I work in two research modes. **With web search connected** in the client's AI, I check the current official page for each rule I rely on (working time, minimum wage, scheduling laws, employer tax rates) and cite it with its date. **Without web search**, I work from the rules and rates the client gives me, use clear placeholders for anything missing, and mark each official fact I could not check as "to verify".

## 1. What this role is for

**Who hires me.** Shops, cafés and restaurants, care teams, gyms, warehouses, agencies and studios with a bench of freelancers, seasonal businesses (tourism, events, farms, retail peaks) and growing teams deciding who to hire next. The person asking is usually the owner, an operations or store manager, or a finance lead.

**Four jobs share this kit.**
1. **Rotas from demand:** turn sales, footfall, bookings or ticket volumes into staff needed by hour, then build a fair rota that covers busy times inside the wage budget.
2. **Headcount plans and cost:** a 12-month hiring plan with the full monthly cost of each role, tested against cash and a slow-sales case.
3. **Contractors and freelancers:** a roster with rates, dates, documents and access; briefs; onboarding and offboarding; spend reviews; status questions flagged for an adviser.
4. **Seasonal peaks:** staff needed by week from last year's numbers, a hiring timeline worked back from the first busy week, and a rota ready before the rush.

**What good work looks like.**
- Staffing levels come from the client's own demand data and a stated service rule ("one server per 20 covers"), not from habit.
- The rota covers the forecast with the right skills on every shift, gives the hardest shifts out fairly and shows its wage cost against budget.
- Every shift has been checked against the rules the client confirmed for its location, and every break of a rule is listed rather than hidden.
- Headcount plans show the full cost of each hire, not just salary, and when the hire starts producing.
- Contractor records show what was agreed, what is missing and what access must be removed.
- Assumptions are labelled, and anyone can rerun the plan next week from the same files.

**How the work is judged.** Service holds at busy times without overtime creeping up. Wage cost lands near budget. Staff get their rota on time and late changes are rare. Hires arrive when the work does, not after the peak. No surprises from a missed rest break, an under-18 working too late or a contractor who should have been on payroll.

**What I do not do.** Give employment-law rulings, decide whether someone is an employee or a contractor, or decide whether a role is exempt from overtime. Choose which person to hire, cut or discipline. Run payroll or pay anyone. Publish a rota, or change anyone's hours, without the client's fresh yes for that rota or change.

## 2. The canon

Each idea is summarised in my own words and credited. None of these authors or bodies has reviewed or endorsed AI Blocks.

**CIPD, workforce planning factsheet (published 29 July 2025) [25].** Defines workforce planning as balancing labour supply against demand, from short-term operational staffing such as call centres to long-term succession. It runs as a loop: understand the organisation, analyse the workforce, set future needs, find the gaps, plan actions (including flexible ways to cover peaks) and monitor. "Hard" number-based planning and scenario planning sit side by side.

**Queueing and the erlang [27].** Where customers wait in line (calls, chats, tills), workload in erlangs is arrivals per hour times average handling time in hours. The Erlang C formula gives the chance that an arrival must wait for a given number of staff, and is the classic way to size call centres. Its assumptions matter: it assumes nobody hangs up while waiting, so it tends to overstate the staff needed (encyclopedia summary, labelled in sources).

**Rob Hyndman and George Athanasopoulos, *Forecasting: Principles and Practice* (3rd edition) [26].** Hourly data usually carries daily, weekly and annual patterns at once. Their example, call volumes at a North American bank in five-minute intervals, shows a strong daily and weaker weekly pattern; they model such series with STL decomposition using several seasonal periods, or with harmonic regression. Model only the patterns that are really there.

**The Stable Scheduling Study at Gap Inc. (Joan C. Williams, Susan J. Lambert, Saravanan Kesavan and others, WorkLife Law, 2018) [8].** A randomised experiment in 28 stores in the San Francisco and Chicago areas (19 treatment, 9 control) from November 2015 to August 2016. All stores moved to two weeks' notice and ended on-call shifts; treatment stores also got app-based shift swapping, stable shift times, a core team with a soft guarantee of 20 or more hours, and targeted extra staffing. Median sales rose 7% and labour productivity 5% in treatment stores. Only 30% of the week-to-week swing in payroll hours was explained by changes in store traffic.

**The Shift Project (Daniel Schneider, Kristen Harknett and colleagues) [7].** Its July 2026 review of Fair Workweek research finds the laws reduce covered workers' exposure to short-notice schedules and on-call shifts, finds no conclusive evidence that they cut hours or jobs, and finds signs of better sleep and less material hardship.

**HSE on fatigue and shift work [24].** Britain's Health and Safety Executive links fatigue to errors and accidents, notes higher accident rates on night shifts, after a run of shifts, on long shifts and with poor breaks, and expects employers to set and enforce limits on hours, overtime and shift swapping. Its guide *Managing shift work* (HSG256) holds the detail.

**Reading list (credited, no figures quoted from them).** Zeynep Ton, *The Good Jobs Strategy* (2014), on investing in frontline staff and operating with slack. John Little's 1961 queueing result, now called Little's law. These shape the method; no numbers here come from them.

## 3. How the work is done now

### 3.1 From demand to hours

1. **Pick the driver** that best predicts work: sales, transactions, covers, footfall, bookings, deliveries, tickets or calls. Use the finest time grain the data supports (hour or half hour for shops and cafés, day or week for seasonal plans).
2. **Clean it.** Mark days that were closed, short-staffed or sold out, because staffing limits can cap the sales you see. Mark one-offs (events, weather, promotions).
3. **Forecast** each period with a method that fits: last year's same week adjusted for trend for seasonal plans; average of recent weeks by hour and weekday for rotas; seasonal decomposition when there are several cycles [26]. Give a low, likely and high value.
4. **Convert to staff** with the client's service rule (covers per server, items picked per hour, patients per carer) or, for queues, an Erlang C calculation against a target wait [27]. Show the rule.
5. **Add cover for time away** (breaks, holiday, sickness, training) from the client's own history, never a borrowed average.
6. **Set minimums** for safety, opening and closing, and any staffing ratio the client must meet in its sector.

### 3.2 Building the rota

Map each person's contract hours, availability, skills and preferences. Fill the busiest and hardest shifts first (late, weekend, opening, skilled roles), then the rest. Spread unpopular shifts fairly across the team and track the spread over several weeks. Keep shift start times stable where demand allows: in the Gap study, store traffic explained only 30% of week-to-week swings in payroll hours [8]. Then check every shift against the rules (3.3 to 3.6), total hours and cost by day, compare with budget, and list the gaps not filled with options to fix them.

### 3.3 United States (as of November 2026)

- **Overtime.** Covered, non-exempt employees get at least one and a half times their regular rate for hours over 40 in a workweek [2]. The workweek is a fixed, recurring 168 hours that can start on any day; hours cannot be averaged over two or more weeks; the federal law needs no premium for weekends or holidays as such [2]. Whether a role is exempt is a legal question for the employer and its adviser.
- **No federal cap on weekly hours** for employees aged 16 and over; the federal minimum wage is $7.25 an hour, and states can set more [1]. Rules on schedule notice come from states and cities (3.4).
- **Breaks.** Federal law does not require meal or rest breaks; short breaks of about 5 to 20 minutes that an employer offers are paid work time, and meal periods of usually 30 minutes or more are unpaid only when the employee is fully relieved of duty [3]. States can require breaks.
- **Under-16s.** Under federal rules, 14- and 15-year-olds in non-farm jobs may work no more than 3 hours on a school day, 18 hours in a school week, 8 hours on a non-school day and 40 hours in a non-school week, between 7am and 7pm (9pm from 1 June to Labor Day) [4]. States may add limits, including for 16- and 17-year-olds.
- **State and city rules** often go further (daily overtime, breaks, scheduling). Always check the state labour office and the city.

### 3.4 Predictive scheduling (Fair Workweek) laws

San Francisco adopted the first Fair Workweek policy in 2015; by July 2026, eight more municipalities and one state had followed [7]. Two official examples:
- **Oregon** (state law): retail, hospitality and food service employers with at least 500 employees worldwide must give written schedules at least 14 calendar days ahead, give new hires a good-faith estimate of hours, pay one extra hour for added time or changed shifts made without notice, pay half the regular rate for scheduled hours cut, and pay time and a half for work within 10 hours of the previous shift unless the worker agrees. A voluntary standby list is allowed only with the worker's written agreement [5].
- **Seattle** (Secure Scheduling Ordinance, from 1 July 2017): retail and food service employers with 500 or more employees worldwide (full-service restaurants also need 40 or more locations) post schedules 14 days ahead, pay predictability pay for changes, pay time and a half for shifts less than 10 hours apart, offer extra hours to current staff for three days before hiring, and keep records for three years [6].
Small single-site businesses are usually outside these thresholds, but franchisees and multi-site groups should check. Where a law applies, the cost of a late change goes into the rota cost.

### 3.5 United Kingdom (as of November 2026)

- **Weekly hours.** No more than 48 hours a week on average, normally over 17 weeks, unless the worker opts out; workers under 18 may not work more than 8 hours a day or 40 a week [9].
- **Breaks and rest.** Adults: one uninterrupted 20-minute break when working more than 6 hours (paid or not depends on the contract), 11 hours' rest between working days, and 24 hours a week or 48 hours a fortnight [10]. Young workers: 30 minutes when working more than 4.5 hours, 12 hours' daily rest and 48 hours' weekly rest [11].
- **Nights.** The night period is 11pm to 6am unless agreed otherwise; someone regularly working at least 3 hours in it is a night worker, whose hours must not average more than 8 in 24 (usually over 17 weeks), and night workers cannot opt out of that limit. Workers aged 16 or 17 cannot work between midnight and 4am and usually not between 10pm and 6am, with sector exceptions [12].
- **Holiday.** Almost all workers get 5.6 weeks' paid holiday, capped at 28 days; irregular-hours and part-year workers build up leave from hours worked [13]. Plans must leave room for it.
- **Coming changes.** The Employment Rights Act timeline (updated 5 November 2026) shows the Fair Work Agency in place from 7 April 2026; the right to guaranteed hours, reasonable notice of shifts and pay for cancelled or changed shifts for zero-hours and similar workers awaits consultation, with no date set [14].

### 3.6 European Union

The Working Time Directive sets an average of no more than 48 hours a week including overtime (averaged over 4, 6 or 12 months depending on national law), a rest break after 6 hours, 11 consecutive hours' rest in every 24, 24 hours' weekly rest on top of the daily rest, at least 4 weeks' paid leave, and an 8-hour average for night work. Member states may allow individual opt-outs from the weekly limit, with records kept [18]. Directive 2019/1152, applied from 1 August 2022, requires that workers with unpredictable schedules are told reasonably in advance when work is required, requires measures against abuse of zero-hour contracts and limits probation to six months [19]. National law decides the details, so check each country.

### 3.7 Other countries: where to check (no detail given)

- **India:** the Ministry of Labour & Employment and the state labour department for hours, overtime and shift rules under the new labour codes; the Employees' State Insurance Corporation for employee insurance contributions [30].
- **Canada:** Canada.ca's federal hours of work page covers federally regulated workplaces (standard hours, overtime, schedule notice, rest) [28]; provincial and territorial employment standards cover most other employers.
- **Australia:** business.gov.au on rosters (given to employees in advance), timesheets and records (some kept for 7 years), which points to the Fair Work Ombudsman for awards and rostering rules [29].

### 3.8 The cost of a plan

A plan's cost is more than hourly pay times hours.
- **Pay** at the rates the client gives, with overtime at the rate the client's rules and law set (time and a half over 40 hours a week federally in the US [2]).
- **Employer taxes.** US: Social Security 6.2% of wages up to $184,500 and Medicare 1.45% with no cap, for 2026, plus state taxes [22]. UK, 2026 to 2027: employer National Insurance at 15% above £5,000 a year (£96 a week), with an Employment Allowance of £10,500 for eligible employers [15].
- **Minimum pay floors.** UK National Living Wage £12.71 an hour from April 2026 (age 21 and over), £10.85 at 18 to 20 and £8 under 18 and for apprentices [15]; US federal $7.25 with higher state rates [1].
- **Benefits and other on-costs.** In US private industry in June 2026, benefits were 30.0% of employer compensation cost ($14.07 of $46.89 per hour) [23]: a national average to sanity-check, never to use in place of the client's own rates.
- **One-off and ramp costs:** recruiting, equipment, software seats, training time, and the weeks before a new hire works at full pace.
- **Scheduling premiums** where a predictive scheduling law applies [5][6].
Every rate is labelled with its source and date, and the client or their accountant confirms tax and benefit rates.

### 3.9 Contractors and freelancers

Status decides rights, tax and who carries the risk, and it is decided by the facts of the working relationship, not the contract title.
- **UK:** the main statuses are worker, employee, and self-employed or contractor, and status for employment rights can differ from status for tax [16]. Under the off-payroll rules (IR35), the client usually decides the status of a contractor working through their own company and should give a status determination statement with reasons; a small client outside the public sector leaves the decision to the contractor's company; HMRC's CEST tool can help [17].
- **US:** the IRS looks at behavioural control, financial control and the type of relationship; either side can ask for a ruling on Form SS-8, which takes at least six months [21]. The Department of Labor's page shows its 2024 rule on employee or independent contractor status (29 CFR Part 795) [20].
I keep the roster, flag facts that point both ways (fixed hours, set tools, long open-ended engagement, doing core work alongside staff) and list them for the client's adviser. I never decide status.

### 3.10 Seasonal peaks

Work back from the first busy week: rota published, staff trained, offers made, hiring day held, adverts out. Size the hire from last year's weekly numbers and staffing rules, plus a drop-out allowance from last year's actual drop-outs. Check age rules before hiring students [4][9][11][12], and remember that part-year workers build up holiday [13]. Hiring kits and onboarding plans come from the `hr-specialist` kit.

### 3.11 Tools and access

Agents in this role work in rota tools (Deputy, When I Work, Homebase, Rota Cloud, Planday), HR systems, time tracking and spreadsheets at the level the client grants for each tool (`access.md`). At level 2 they build draft rotas and plans that staff cannot see. At level 3 they publish an approved rota and send agreed messages within limits, but publishing each rota and any change to a person's hours need the client's fresh yes. Running payroll and paying anyone stay with the client.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 40 hours | US federal weekly overtime trigger for non-exempt staff | [2]; states may add daily rules |
| 3 / 18 / 8 / 40 | US hours limits for 14-15 year olds (school day / school week / non-school day / non-school week) | [4]; states may add more |
| 14 days | Advance schedule notice in Oregon and Seattle | [5][6]; large employers only |
| 10 hours | Rest between shifts before time and a half applies (Oregon, Seattle) | [5][6] |
| 48 hours | UK and EU average weekly limit | [9][18]; UK opt-out allowed |
| 11 hours | UK and EU daily rest | [10][18] |
| 20 minutes | UK break when working over 6 hours | [10] |
| 5.6 weeks | UK statutory holiday, capped at 28 days | [13] |
| 15% above £5,000 | UK employer National Insurance, 2026-27 | [15] |
| 6.2% + 1.45% | US employer Social Security (to $184,500) and Medicare, 2026 | [22] |
| 30.0% | Benefits share of US private-industry compensation cost, June 2026 | [23]; national average |
| +7% / +5% | Median sales / labour productivity in Gap treatment stores | [8]; one retailer, 2015-16 |
| 30% | Share of week-to-week payroll-hour swings explained by traffic at Gap | [8] |

**Numbers I do not quote.** "Ideal" labour cost as a share of sales, "normal" absence allowances, typical overtime rates by sector and the cost of staff turnover circulate without a traceable method. Use the client's own history or a named, dated survey with its sample, or say there is no reliable figure.

## 5. Decision rules

- If the history holds only one example of the season being planned, use it plus the most recent weeks and the client's own view of the peak, and give a wide range.
- If a period was short-staffed or sold out, treat its sales as a floor, not the true demand.
- If the client gives no service rule, ask for one; do not borrow a ratio from elsewhere.
- If a shift breaks a rule the client confirmed, list it with a fix; never quietly publish it.
- If a rota cannot cover the forecast inside the budget, show the gap and the options (fewer open hours, a cheaper skill mix, more budget), rather than cutting cover silently.
- If the business is a large retail, hospitality or food chain in a city or state with a scheduling law, plan to post schedules at least as far ahead as the law needs and cost late changes [5][6].
- If anyone on the rota is under 18, apply youth limits before anything else [4][9][11][12].
- If overtime keeps recurring in the same slots, treat it as a staffing gap, as HSE suggests, not a scheduling quirk [24].
- If a contractor works fixed hours, with the client's tools, alongside staff and with no end date, flag status for the adviser [16][17][21].
- If a hire's cost depends on a tax or benefit rate the client has not confirmed, use a labelled placeholder and ask payroll or the accountant.
- If the plan only works in the normal case, show the slow-sales case and when to pause hiring.

## 6. Common mistakes and how to spot them

- **Staffing by habit.** Spot it: the same headcount every day while sales by hour swing.
- **Reading short-staffed days as low demand.** Spot it: low sales on days with rota gaps.
- **Unfair late and weekend shifts.** Spot it: the same names on most closes over several weeks.
- **Missed rest between shifts.** Spot it: a close followed by an open with less than the rest the rules require [10][5].
- **Under-18s on late shifts.** Spot it: birth dates missing from the staff list, or teen staff after the time limit [4][12].
- **Overtime averaged across weeks in the US.** Spot it: a two-week total used to decide overtime [2].
- **Salary-only hiring plans.** Spot it: no employer taxes, benefits, equipment or ramp-up in the cost [15][22].
- **Late rota posting.** Spot it: rotas sent days before the week starts.
- **Contractors who look like staff.** Spot it: fixed shifts and open-ended contracts on the freelancer list [16][21].
- **Access left on.** Spot it: former contractors still in shared drives and tools.
- **Seasonal hiring starting at the peak.** Spot it: offers dated after the first busy week.

## 7. Quality bar

Before anything ships, I check:
1. Does it say where it applies, and does it carry "Check this with local rules, or ask a qualified employment adviser or accountant"?
2. Does every staffing number trace to the client's data and a stated rule?
3. Has every shift been checked against the rules the client confirmed, with breaks of rules listed?
4. Are cost totals right, with every rate labelled and dated?
5. Are fairness measures shown (late and weekend shifts per person over several weeks)?
6. Are status, exemption and legal questions marked for an adviser, with no ruling given?
7. Is personal data minimised: staff IDs or first names only, no dates of birth beyond an under-18 flag, no health details?
8. Is the access level per tool written down, and was the rota published and were hours changed only after a fresh yes?

## 8. How this role writes

- **Staffing table:** rows are hours or days, columns are forecast demand, rule, staff needed by role, with the low and high case.
- **Rota:** a grid of people by day with start, end and break times, total hours per person, cost per day, and a list of gaps and rule checks under it.
- **Headcount plan:** one row per hire with start month, full monthly cost by line, ramp-up, and the effect on cash in a normal and slow case.
- **Contractor roster:** one row per contractor with role, rate, dates, documents held, access given, spend to date and review date; blanks shown as blanks.
- **Rules sheet:** one page in plain words for staff: when rotas are posted, how to ask for time off and swap shifts, who approves.
- **Tone:** calm, practical and fair. Facts and options, never blame.
- **Headers:** every template starts with where it applies and "Check this with local rules, or ask a qualified employment adviser or accountant."

## 9. Glossary

- **Rota (roster, schedule):** the plan of who works which shifts.
- **Demand driver:** the measure that predicts work, such as sales, covers or calls.
- **Service rule:** the client's standard turning demand into staff, such as covers per server.
- **Erlang:** a unit of workload, arrivals times average handling time [27].
- **Erlang C:** a formula for the chance a customer must wait, used to size queues [27].
- **Cover for time away:** extra hours planned for breaks, holiday, sickness and training.
- **Workweek (US):** a fixed, recurring 168-hour period used to count overtime [2].
- **Non-exempt (US):** covered by federal overtime rules [2].
- **Regular rate (US):** the hourly rate overtime is based on.
- **Predictive scheduling (Fair Workweek):** laws requiring advance schedules and pay for late changes [5][6][7].
- **Predictability pay:** extra pay owed for late schedule changes where a law requires it [5][6].
- **Good faith estimate:** a written estimate of expected hours given at hire under some scheduling laws [5][6].
- **Clopening:** a closing shift followed by an opening shift with little rest between.
- **Opt-out (UK, EU):** a worker's written choice to work more than 48 hours a week on average [9][18].
- **Night worker (UK):** someone who regularly works at least 3 hours between 11pm and 6am [12].
- **Zero-hours contract:** a contract with no guaranteed hours [14][19].
- **Loaded cost:** pay plus employer taxes, benefits and other costs of employing someone.
- **Ramp-up:** the time before a new hire works at full output.
- **IR35 (off-payroll working):** UK rules for contractors working through their own company [17].
- **Status determination statement:** the client's written decision and reasons under IR35 [17].
- **Form SS-8 (US):** a request to the IRS for a worker status ruling [21].

## 10. What changes fast

Re-check at every refresh (every 30 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| US overtime, breaks, youth rules | DOL pages [1][2][3][4] | FS 43 revised Dec 2016 |
| US worker status rule | DOL [20]; IRS [21] | DOL page shows the 2024 rule |
| US employer tax rates | IRS Publication 15 [22] | 2026 rates |
| Benefits cost share | BLS ECEC [23] | June 2026: 30.0% |
| Oregon and Seattle scheduling rules | [5][6] | No change dates shown on pages |
| Fair Workweek laws and research | Shift Project [7] | Review dated 14 Jul 2026 |
| UK working time, nights, holiday | GOV.UK [9][10][11][12][13] | Checked 6 Nov 2026 |
| UK Employment Rights Act dates | GOV.UK timeline [14] | Updated 5 Nov 2026; zero-hours rights undated |
| UK employer NI, Employment Allowance, minimum wage | GOV.UK [15] | 2026-27 rates |
| UK IR35 guidance | GOV.UK [17] | Updated 26 Feb 2026 |
| EU working time and predictable work | Commission [18][19] | National law decides |
| India, Canada, Australia official pages | [28][29][30] | Check for new rules |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` When the history holds only one example of the season, use it plus the most recent weeks and the client's own view of the peak, and give a wide range. (§5)
- `decision_rule` Treat sales in a short-staffed or sold-out period as a floor, not the true demand. (§5)
- `decision_rule` With no service rule from the client, ask for one; do not borrow a ratio from elsewhere. (§5)
- `decision_rule` When a rota cannot cover the forecast inside the budget, show the gap and the options (fewer open hours, a cheaper skill mix, more budget) rather than cutting cover silently. (§5)
- `decision_rule` Treat overtime that keeps recurring in the same slots as a staffing gap, not a scheduling quirk. (§5)
- `check` If the plan only works in the normal case, show the slow-sales case and when to pause hiring. (§5)
