# Running the team and the work: craft principles

Before scheduling, inventory the supplied sources and read actual team availability. An assumed allowance never overrides a supplied capacity limit. Allocate hours by owner and period, include existing commitments, then run `tools/commerce-math.mjs` with operation `capacityPlan`: `availability` rows have `owner`, `period`, `hours`, `source`; `assignments` rows have `owner`, `period`, `task`, `hours`. A plan with a negative remaining balance is infeasible until work is removed, deferred or explicitly reassigned. Proposed effort is an estimate; available capacity is an owner constraint, not another estimate to invent.

This book is for the people who run the work behind a store: whoever turns a request into a job, picks the next play, looks after agency clients, runs the creative production line or knows how much the team can take. Read it before you scope, staff, schedule or report on any job; write the spec, plan or update to it; and run the review checklist on the draft before it reaches the owner or the client.

## What great looks like

- Every job starts from one named constraint, proved with the store's own numbers, and the work is ranked by the gross profit each fix unlocks.
- Every brief fits on one page and states the buyer, the deliverable, the line it must beat and the yes or no tests it must pass.
- Every job has one owner by name; helpers take only parts that can run apart, each with a hand-over note.
- Plans are sized in team hours and cash before a date is promised, with about a fifth of time kept free for anyone who takes unplanned work.
- Small, reversible changes run inside written limits; big or one-way changes wait for a written yes.
- Every recommendation carries a prediction and a review date, and the team grades itself on profit.
- Owners and clients see results on store orders and gross profit, never on platform numbers alone.
- Every change, approval and decision sits in one dated log anyone can read in five minutes.
- After every miss there is a short, blameless review that ends in dated fixes someone owns.

## The principles

### 1. Name the one constraint before you assign any work, and rank fixes by the money each unlocks

**Why it works:** A store grows only as fast as its tightest limit allows, so other work moves nothing. After about 1,000 audits, Blue Sense says a useful audit names one bottleneck, not 40 screenshots of settings, and its ranked fixes become a 90-day plan, because fixing one exposes the next.

**How to apply:** Start from store revenue, new customers and gross profit. Ask four questions in order and stop at the first yes: has nobody here solved the next problem (talent); is cost per new customer rising on the best angle (product); would sales collapse if ads stopped (distribution); does cash limit stock (risk). Inside paid media, fix data integrity first, then structure, then creative. Price each fix per month: on a $350,000 a month account, a 5% efficiency gain is worth $17,500. A US pet brand whose new-customer cost climbs on its one winning angle needs creative and offers, not bids.

**Judge it by:** One sentence naming the constraint and its proof, and a fix list where each line carries a monthly gross profit figure. Weak work lists twenty issues of equal weight.

**Breaks when:** A very early store is still finding its product, or no business-level numbers are visible.

**From:** OPS-6616, OPS-6625, OPS-6617, ADC-6257, MCR-6839

### 2. Refuse to scope or rank work until the store's own numbers and a judging line are in hand

**Why it works:** Platform numbers double count, credit returning buyers and view-throughs, and cannot show gross profit, so a plan built on them can chase rising ROAS while the cost to win a customer quietly doubles. In about 30% of Blue Sense's audits, broken measurement was the main bottleneck and all other work spun on top of it.

**How to apply:** Before anyone opens an ad account, get the store export: monthly orders, new versus returning orders and revenue, and refunds. Take gross profit per order and target cost per purchase from the unit economics and write both into the spec as the line to beat. If either is missing, the first job is the fix; other jobs wait or ship marked "judging line not set". A Canadian supplement brand that shares only Meta access gets a request list, not an audit.

**Judge it by:** The spec names each number's source and date and states the judging line in money. Weak work sets platform ROAS as the goal.

**Breaks when:** Sales are mostly offline or on marketplaces with no new-customer split; use the nearest business-level proxy. A broken checkout comes first.

**From:** MEA-6342, MEA-6240, ADC-0028, MEA-6262

### 3. Change nothing until you can state the full chain from the business number to the cause

**Why it works:** Most damage in ad accounts comes from tweaking a setting that was not the cause. Some drops are not real: Google credits sales to the click date, so the last 3 to 4 days look weak, and Shopify books returns on the refund date, so a strong month is followed by a false dip.

**How to apply:** Before any change, or any reply to a worried client, write: this fell because this metric dropped, driven by this smaller metric, triggered by this cause. Start at the top: the business total, then other channels weighted by spend share, then revenue split into sessions, conversion rate and order value, then only the top five campaigns by spend, since a campaign with 10% of budget doubling moves the account about 5%. Read the change history first and view 90 to 180 days by week. A 5% order value dip plus a 4% conversion dip, about 10% together, is usually noise.

**Judge it by:** The note holds the chain and sizes the fix against the gap. Weak work says "ROAS dropped, so we refreshed creative."

**Breaks when:** A clear emergency with an obvious cause, such as a broken checkout or a disapproved feed.

**From:** GAD-6218, GAD-6208, MEA-0018, MEA-0009, MEA-0051, MEA-0011

### 4. Size creative output from the revenue goal and winner churn, then fund and schedule production to match

**Why it works:** Every ad has a fixed lifetime spend capacity, which Blue Sense puts at only about $700 to $1,500 on average, so holding spend needs a steady flow of new ads.

**How to apply:** Pull last quarter's ads and work the number two ways. Divide the new-customer revenue target by revenue per ad: $300,000 at $3,000 per ad needs 100 ads a month. Check churn: 10 winners losing 20% a month means 2 to replace, and at a 5% hit rate (5 to 15% is normal) that is 40 new ads. Plan to the higher of the two. Budget production by tier: under $30,000 a month of Meta spend it is the founder's time; $30,000 to $100,000 about 25% of media; above $100,000 about 10%. Compare cost per ad with margin per ad by format: if an average ad earns $350 of margin and costs $400 to make, shift toward statics, which cost about a quarter of video.

**Judge it by:** The calendar shows the formula, and slot counts match it and the team's hours. Weak plans pick a number with no working.

**Breaks when:** The category allows few angles; these rules come from one agency.

**From:** MCR-6795, MCR-6880, MCR-6659, MCR-6862, MCR-6648, MCR-0023

### 5. Raise output only after a written 7 out of 10 quality bar and real concept variety are in place

**Why it works:** Blue Sense has seen accounts launch over 2,000 ads a month on about $250,000 of spend and stay unprofitable, because the ads fell below the quality bar. Meta groups near-identical ads and shows them to the same people, so copies add workload, not reach.

**How to apply:** First check what share of last month's new ads got real spend. Write the 7 out of 10 bar: clear persona, angle and offer, a clear and relevant hook, a format that fits the awareness stage; fix or drop anything below it. Above it, nobody can pick winners, so ship rather than debate. Count real variety: a new ad counts only if persona, angle or offer changes. Raise volume only then. Split effort about 50 to 60% remaking winners, 20 to 30% fixing near-misses, 20 to 30% new concepts, never zero.

**Judge it by:** The plan states the quality bar and the count of distinct concepts, not just the file count. Weak work calls 40 versions of one hook a batch.

**Breaks when:** Good ads are simply too few: one brand on $350,000 a month with 15 live ads cut acquisition cost about 20 to 30% by relaunching old winners to reach about 60.

**From:** MCR-6618, MCR-6658, MCR-6841, MCR-6847, MCR-6670, MCR-6839

### 6. Start peak planning about 70 days out, and freeze partner and process changes well before it

**Why it works:** For one founder the Black Friday period makes about 80% of annual profit; one missing customs document got his stock seized in that window, and another year a 3PL collapsed against a $45 to $50 million Q4 forecast, costing tens of millions.

**How to apply:** By 30 September, pull last year's hourly sales and spend curves, set a November acquisition cost, model discounts against margin and size creative: in Blue Sense's AUD accounts a winner holds about $10,000 to $12,000 a day, so a $150,000 day needs 12 to 18 winners, not 12 to 18 ads. In October fund pre-season, lock offers, build creative stock. Give every import and fulfilment document per region your own named owner, and never switch partners near the peak. Check weeks of cover per SKU against forecast; if short, hold back promotions or hide variants rather than sell out, since one brand judged an empty December catalogue would cost four to five months of ad performance.

**Judge it by:** A dated plan with owners, a pacing sheet, a cover-by-SKU table and a freeze date. Weak plans start in November.

**Breaks when:** A first peak with no last-year data; a store whose profit is spread evenly through the year.

**From:** OPS-6618, OPS-0001, OPS-0008, MCR-0070, OPS-0019

### 7. Plan backward from the owner's target in 90-day blocks, and say what must change outside the ad account

**Why it works:** Daily tweaks cannot close a large gap. In Blue Sense's example, a brand aiming for 60% growth in 12 months could not get there through settings, so the plan added a second product every rival sold, doubled or tripled ad output and mapped a 100% budget rise against the P&L.

**How to apply:** Write the target, baseline and gap in one unit, such as gross profit per month. Split the gap into three bets at most, each with an owner, the cash and team hours it needs and the week it should show a read. Use 90 days as the block: long enough for each bet to reach a decision, short enough to change course. Give each block one focus where effort compounds. Check every bet against cash and capacity before it enters the plan.

**Judge it by:** The bets add up to the gap in one unit, each with a date to judge it. Weak plans are a list of tactics with no total.

**Breaks when:** Cash or margin cannot fund a budget rise; the store is too young for a stable baseline.

**From:** OPS-6612, OPS-6616, GAD-6143

### 8. Size the fixed team to the quietest month and hold overheads flat while revenue grows

**Why it works:** Salaries cost the same in the slowest month as in Q4, and overheads that rise with revenue keep profit flat. Across about 300 seven-figure clients, Blue Sense finds people, software and office costs usually rise faster than sales; at $50,000 to $300,000 a month, early overspend often forces debt to fund the next stock order.

**How to apply:** Set full-time payroll near 12% of revenue in your lowest month: months from $500,000 to $1,000,000 imply about $60,000 a month. Cover the rest with freelancers, agencies, seasonal hires and AI tools. One founder keeps payroll near 7% of revenue and says winners keep people cost at 10% or less, against 25 to 30% at many brands. Track people cost and total overheads as a share of revenue every month beside MER, and make each new hire or tool show how it raises revenue or cuts delivery cost.

**Judge it by:** Fixed cost is shown against the lowest month, with each flexible block named. Weak plans hire for the peak.

**Breaks when:** Roles that need deep, continuous knowledge (finance, the operations lead) are pushed into flexible labour; the business has little seasonality.

**From:** OPS-0010, OPS-0017, MCR-6627, MEA-6307, OPS-6615

### 9. Keep work in house until spend can pay for a specialist, then hire for the next problem

**Why it works:** Fees at low spend eat the money that should fund tests. One practitioner says founders should run their own ads until about $10,000 to $30,000 of monthly spend; another says a $100,000 a month Google account does not fill a 40-hour week.

**How to apply:** Match resourcing to spend: from $4,000 to $30,000 a month on Meta, founder phone content and about three concepts; $30,000 to $100,000, two or three UGC creators; above $100,000, a full team of an AI-capable video editor, a static designer and a creative strategist, often hired from copywriters. For the next hire, ask whether anyone here has already solved the next problem; if not, that skill is the bottleneck. When moving buying in house, one founder gave a staff member four weeks to learn and paid an outside buyer for a weekly check-in through the hand-over.

**Judge it by:** Each hire or agency names the spend tier and the problem it solves. Weak plans hire by title or by what rivals have.

**Breaks when:** The founder has no time at all; the category needs specialist compliance from day one.

**From:** OPS-0020, OPS-6622, MCR-0082, OPS-6629, OPS-6625, OPS-0016

### 10. Vet every partner on its link to your P&L, its fit to your size and its peak record

**Why it works:** A good agency has both halves, a forecast tied to your P&L and daily account work that serves it; a free audit promising 400% growth with no reasoning is a red flag. Agencies built on many small clients stretch average staff thin and churn.

**How to apply:** Ask an agency for a sample forecast, what it would change in your first 30 days and how each change serves that forecast. Ask its typical client by revenue and category and how many accounts each strategist runs; pick one where you sit near the middle. Write scope as monthly outputs: how many new ads, who makes them, what the fee covers. Walk away from a $1,500 to $2,000 retainer that only manages campaigns: on Meta the work is now creative strategy and production. Ask a 3PL for error rate, peak throughput, a named escalation contact and past Q4 surges; put a picked-on-time standard with penalties in the contract; audit invoices monthly, since one operator finds 30 to 40% of brands he mentors overcharged.

**Judge it by:** A partner scorecard with evidence per question. Weak vetting rests on a sales deck.

**Breaks when:** A very small brand needs only basic setup help.

**From:** OPS-6613, OPS-6619, OPS-6614, OPS-0008, OPS-0015, OPS-0012

### 11. Add one market, channel or ad account at a time, and count each as a new client's workload

**Why it works:** Switching on a country takes minutes, but each needs its own acquisition cost control, logistics and tax work. Blue Sense sees brands at $3 million to $5 million open seven regions in quick succession with none profitable. Extra ad accounts per country add labour, while regional reporting can come from campaign names and filters.

**How to apply:** Launch one market, make it profitable and stable, then add the next. Expand only from strength: Blue Sense's line for a brand from a market Australia's size is about AUD 10M a year at home and several proven evergreen winners first; going abroad to rescue a weak home market fails. For organic, pick one main platform where buyers are densest, plus email, for six months. Keep one ad account unless you need billing in local currency. Before any addition, add its hours to the capacity plan.

**Judge it by:** The plan shows one new surface per period, with its owner and hours. Weak plans launch three countries in one quarter.

**Breaks when:** A large brand has regional teams and budget to run each market properly.

**From:** OPS-6604, OPS-6624, ADC-6232, ORG-0022

### 12. Approve decisions in advance with written limits, sorted by money at stake and how easily they undo

**Why it works:** Work stalls in approval queues; a cosmetics trend lives about 72 hours, shorter than most sign-off cycles. Amazon's 2016 shareholder letter argues most decisions are reversible two-way doors to be made fast, keeping heavy process for one-way doors. Ritz-Carlton lets staff spend up to $2,000 per incident to fix a guest problem unasked; a store version is about $50 to $200.

**How to apply:** Write an approval matrix with three levels. Inside limits, with a log entry: pause a losing ad, reship a lost parcel under the cap, spend a standing trend budget (one example: about $1,200 with a 36-hour turnaround). A quick written yes: budget moves above a set share, any customer message, any new claim. Owner only: account settings, payments, contracts. Put an end date on every standing permission and ask for each yes in a form answered in one word.

**Judge it by:** Each proposed action names its level, and nothing sits past its date. Weak setups make everything wait, or nothing.

**Breaks when:** Regulated categories need review of every asset; a trend budget runs before the brand has proven formats and an audience, since trends amplify a working strategy but cannot create one; nothing is logged, so the limits leak.

**From:** OPS-0018, OPS-0009, Amazon 2016 letter to shareholders, https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders

### 13. Report to owners and clients on store orders and gross profit, using a few numbers that each drive a decision

**Why it works:** Clients judge an agency by whether the business makes money, and platform numbers can rise while it does not: blended MER can climb from 4x to 5x while acquisition MER falls from 2.0 to 1.6. More dashboards create rival truths, so subtract.

**How to apply:** Lead every update with new-customer profit contribution, then acquisition MER, new-customer revenue and orders, acquisition cost and total profit contribution. Pull results from store orders, not ad platforms, and name each number's source and attribution window. Keep the weekly update to one page: what we did, results against store orders and profit, what is next, what we need from the client, and any risk. At kickoff, agree the ranked order of authority: lift tests where they exist, then new-customer profit contribution and acquisition MER, then CAC, then platform ROAS for daily tuning only. A higher number overrides a lower one, which ends meetings where three tools argue.

**Judge it by:** The headline is profit, and every number has a source and an action attached. Weak updates lead with platform ROAS, reach or a list of tasks done.

**Breaks when:** A store too young for cohort data, where first-order numbers are all there is; marketplace-led brands without a new-customer split.

**From:** MEA-6241, MEA-6287, MEA-6238, MEA-6305, MEA-6262, OPS-6613

### 14. Put every job on a one-page brief that a stranger could deliver without a call

**Why it works:** Most wasted work starts at the brief. In the IPA and BetterBriefs survey of over 1,700 marketers and agency staff, 80% of marketers thought they wrote good briefs but only 10% of agencies agreed, about seven in ten on both sides said rebriefs are too common, and respondents put a third of budgets lost to poor briefing.

**How to apply:** Each brief holds the job in one line, who it is for, the deliverable and format, inputs with links, limits (budget, deadline, allowed claims, voice), the line to beat, and three to five yes or no acceptance tests. For an ad, write persona, angle, offer and awareness stage, because a problem-aware script, a product-aware image and solution-aware text in one ad confuse buyers and delivery. Keep it to one page. A UK skincare brand's ad brief names the buyer, belief, proof file and an offer checked live today.

**Judge it by:** Someone new could deliver from it with no questions. Weak briefs say "make it pop" or leave the success test for later.

**Breaks when:** One person makes the piece end to end; even then, the acceptance tests stay written.

**From:** MCR-6719, MCR-6877, IPA and BetterBriefs research, https://ipa.co.uk/news/betterbriefs

### 15. Size every plan in team hours from past jobs, and add about 60% when there is no history

**Why it works:** People estimate by picturing a job's steps and forget how past jobs went. In Buehler, Griffin and Ross's 1994 study, students expected their theses to take 33.9 days; they took 55.5, only about 30% finished by their own date, and even worst-case guesses were too short. A plan the brand cannot staff is not a plan.

**How to apply:** Take the time the last similar job took from the log, not a fresh guess. Blue Sense puts a 5-minute ad at about two days of scripting, the same as ten 30-second ads. With no history, add about 60% to the bottom-up estimate, the gap the study found. Sum hours per person per week against real free hours after standing work. If over, cut scope or move the date before the plan goes out. A small Australian homewares team with 30 free hours a week cannot run a site rebuild and a sale in one month.

**Judge it by:** An hours table per person, with dates drawn from history. Weak plans take dates from the request.

**Breaks when:** Stable routines, where history is the estimate; fixed outside deadlines, where scope flexes instead.

**From:** MCR-6680, OPS-6604, Buehler, Griffin and Ross (1994), https://bear.warrington.ufl.edu/brenner/mar7588/Papers/buehler-et-al-1994.pdf

### 16. Keep anyone who takes unplanned work below about 80% loaded, because waits explode past it

**Why it works:** Queueing maths is unforgiving. In Kingman's formula, waiting time grows with load divided by spare capacity: that factor is 4 at 80% busy, 9 at 90% and 19 at 95%, and uneven arrivals make it worse. At 95% each request waits about five times longer than at 80%, so urgent fixes sit behind routine work. Warehouses show it at peak, when a 24 to 48 hour pick promise can slip to 7 days.

**How to apply:** Plan to about 80% of real hours for roles that absorb surprises: support, the media buyer, the producer handling feedback rounds. Steady, planned specialist work can run fuller; one operator staffs slightly below capacity and hires only when the team is at the seams. Track the age of the oldest open request, not just the count; when it passes the agreed turnaround, stop taking non-urgent work. Set a cap on live jobs per owner, so finishing beats starting.

**Judge it by:** The plan shows load per person with slack and a queue-age figure. Weak plans put everyone at 100%.

**Breaks when:** Batch work with no new arrivals, such as a planned shoot day.

**From:** OPS-0015, OPS-0007, Kingman's formula, https://en.wikipedia.org/wiki/Kingman%27s_formula

### 17. Give every job one named owner, send it to a single specialist by default, and add helpers only for parts that run apart

**Why it works:** Each hand-off drops context and adds a wait. A strong model for growing brands, from a Blue Sense guest, is an in-house buyer making changes, advised by an outside strategist, with no account manager relaying in between. Extra surfaces multiply coordination: Blue Sense would triple its fees for a brand in nine markets.

**How to apply:** In the routing plan, name one owner who answers for the outcome and signs it off. Split work only where parts have their own inputs and outputs and can run at the same time, for example ad copy and landing page copy once the angle is fixed. Never split one deliverable between two writers. Each helper gets its own short brief and returns a hand-over note: what is done, what is open, where the files are. Cut any role that only passes messages, and write each role around a number it owns (spend, acquisition cost, contribution), not a task list.

**Judge it by:** Every row has one owner, and helpers hold separable parts. Weak plans name "the team" as owner, or have three people writing one email.

**Breaks when:** A large launch truly needs a lead plus several specialists; regulated claims need a second sign-off by design.

**From:** OPS-6621, OPS-6604, OPS-0016, MCR-6719

### 18. Ground every drafting step in the brand's own research, and keep concept choice and final judgment as review steps

**Why it works:** Language models write toward the average of what they learned, and Blue Sense guesses product pages outnumber classic direct response copy about 300 to 1 in that mix. With heavy inputs, AI scripts can go straight to production, and AI can make about 90% of video sales letters and statics, but it gives average answers at ideation and final analysis.

**How to apply:** Every drafting job gets the research bank (reviews, support tickets, call transcripts, survey answers) and an instruction to use only that; forbid invented mechanisms and claims. Use AI for a brand-tuned brief of about 20 questions (persona, concept, offer, length, awareness stage), finding research, moving a winner into a new persona or tense, cutting to length and checking against the framework; let it summarise results, never decide. Put concept choice at a review gate: draft several, pick against the brief and data, and log why. Strip AI tells such as "it's not X, it's Y" lines.

**Judge it by:** Buyer phrases trace to the research, and the concept choice has a written reason. Weak work makes claims any rival could make.

**Breaks when:** No research bank exists yet; build it first.

**From:** OPS-6610, OPS-6611, MCR-6676, MCR-6869, MCR-0016

### 19. Check every deliverable against its acceptance tests before it reaches the owner

**Why it works:** Short checklists catch what skilled people skip under pressure: when eight hospitals adopted the WHO Surgical Safety Checklist, deaths fell from 1.5% to 0.8% and complications from 11% to 7% (a before-and-after study). In store work, most errors are mismatches between parts: one brand's same-day ads claimed over 700,000 and about 395,000 customers, while its filings showed 414,000.

**How to apply:** The reviewer marks each of the brief's tests pass or fail with evidence; one failure sends the piece back with the fix and its owner named. Always check that numbers match their source and each other, every claim has proof, every layer of an ad speaks to one awareness stage, the offer and page are live, and names follow the rule. At hundreds of live ads, transcribe the set for clashing claims. Keep the list to checks that catch real failures; a long list gets skimmed.

**Judge it by:** A pass or fail log with evidence per test. Weak reviews say "looks good" or rewrite the work instead of testing it.

**Breaks when:** The list grows long and generic, so people tick without reading; the brief had no tests to check against.

**From:** MCR-6609, MCR-6750, MCR-6719, Haynes and colleagues (2009), https://news.harvard.edu/gazette/story/2009/01/surgical-safety-checklist-drops-deaths-and-complications-by-more-than-one-third/

### 20. Brief creators and freelancers to the depth their past work shows they need

**Why it works:** A creator's output follows the brief. Blue Sense asks creators for past examples and the brief behind each one: if great work came from a thin brief, broad direction will do; if it came from a detailed one, you must match that depth. Without written concepts, volume hides sameness: one brand ran 143 unique, largely unscripted scripts but only about 35 real concepts.

**How to apply:** Add "send two or three past pieces with the briefs behind them" to every outreach. Default to the most detailed brief you can write: concept, script or beats, proof, must-nots and sizes. If a creator resists scripts, ask for two takes, one on script and one in their own words, and run the better one. When a hook clearly wins, brief every creator to make their own version of it. Give every brief product shipping and review dates.

**Judge it by:** Each creator's brief depth matches their record, and every file maps to a written concept. Weak production sends a product and "do your thing".

**Breaks when:** Creators cannot share client briefs for confidentiality; one-off gifted content where a full brief is not practical.

**From:** MCR-6679, MCR-6871, MCR-6615, MCR-6820

### 21. Route support by complexity, staff it from cost per resolved ticket, and cut contacts at the source

**Why it works:** Support load is set by what you sell and how you ship. One synthesis puts phone calls at about 12 to 18% of orders at a $250 order value against about 3% at $40. Order-status questions are often 30 to 50% of tickets, and proactive updates plus a branded tracking page are reported to cut them by 40 to 60%.

**How to apply:** Forecast tickets from orders and order value, and plan peak hires on cost per resolved ticket: one founder finds local agents can be about twice as efficient as offshore ones, so blend them, routing simple, repeatable tickets (order status, address changes) to one tier and complex or sensitive ones to staff close to the team. Track resolution time, touches per ticket, cost per ticket and top three reasons. Send the top reason to the team that can remove it. Order-status contacts under 3% of orders are healthy, 3 to 8% costly and above 8% structural; at 3 to 5 minutes each, 100 a day eat 5 to 8 agent hours.

**Judge it by:** Staffing built from ticket forecasts and cost per ticket, with a fix owner per top reason. Weak plans add agents to absorb an unfixed cause.

**Breaks when:** A founder answers everything; regulated products must stay with specialists.

**From:** OPS-0006, OPS-0013, CXP-0012, CXP-0014

### 22. Log every change with its date and a prediction, then grade it on profit after its review date

**Why it works:** Unchecked calls cannot be told from luck. Blue Sense computes acquisition cost and lifetime gross profit monthly, dates every big change (a new agency, platform or product) and repeats only changes that improved the ratio. Totals hide decay: one client showed $80,000 to $100,000 monthly profit while its first-order P&L had slid from about $20,000 profit to about $70,000 loss a month.

**How to apply:** Every recommendation gets a row: date, what was proposed, by whom, the predicted effect as a range, and a review date. No prediction is a process failure. Grade after the period's refunds land, since Shopify books them on the refund date. Grade each call hit, partial, miss, too small to tell or not done, on gross profit, never on clicks or platform ROAS; use first-order gross profit for low-repeat goods like furniture, a 180-day cohort for fashion or consumables. Turn repeated patterns into owner-approved "Rules I learned" in the playbook.

**Judge it by:** A log where every row has a prediction and later a grade, plus an accuracy table by type. Weak teams claim wins without a log.

**Breaks when:** Too few changes to see patterns; outside events (a stockout, press) blur the read, so log them too.

**From:** MEA-6333, MEA-0011, GAD-6208

### 23. Run a daily red or green check on each owner's number and one short weekly review that ends in owned decisions

**Why it works:** Dashboards help only if someone reads them weekly and changes decisions. Blue Sense runs a 15 to 30 minute weekly finance meeting on cash against the 13-week plan, stock buying, the return on the last dollar of spend, and discount maths.

**How to apply:** Daily, post each key number against target as red, green or blue (well ahead, which also needs a reason the forecast was off); a red owner replies with cause and fix, and three red days in a row escalates, as one 110-person operator runs it. The day before the weekly review, each person and agent files a status note; build one page: the numbers with normal ranges, exceptions, blockers with who can clear them, approvals waiting, clashes between teams (ads pushing a product nearly out of stock) and decisions to make. Recheck this week's Google results two weeks later before judging. Cap next week's priorities per owner.

**Judge it by:** The meeting ends with decisions, each with an owner and date in the log. Weak reviews recite numbers and decide nothing.

**Breaks when:** A founder-only store already reviews daily; with no data prepared, postpone rather than guess.

**From:** FIN-6433, OPS-0007, GAD-6192, MEA-0051

### 24. Name and tag every asset by what it tests, so anyone can find it and read results by concept

**Why it works:** Results can only be read by concept if the names carry the concept. Batch names like "March 7 creatives" hide which persona or angle won, and among the errors Blue Sense finds most often in Meta audits are names that do not match the settings underneath.

**How to apply:** Write one naming rule and use it everywhere: persona, angle, offer, content type and launch date for ad sets; add format, hook, size and version for files. Keep a fixed code list for each field so "UGC" is never also "ugc-video". Tag every ad on the same fields (segment, concept, angle, hook, format) so a winner can be traced to one element. Record usage rights and their end dates beside each file. Check names before launch as part of the acceptance test.

**Judge it by:** Anyone can filter the account or library by persona or angle and get a clean answer. Weak libraries need the producer to explain them.

**Breaks when:** A tiny account with a handful of ads, where a simple list does the job; but the rule still pays once volume grows.

**From:** ADC-6203, ADC-6260, MCR-0051, MCR-6847

### 25. After every miss, run a blameless review that ends in dated fixes with owners

**Why it works:** Blame makes people hide mistakes, so the same failure returns. Google's site reliability teams set review triggers before incidents, assume everyone acted in good faith, and record impact, steps taken, root causes and follow-up actions. One store founder describes a customs failure seizing peak stock, then a similar problem stopping shipping in the next year's peak.

**How to apply:** Agree the triggers in advance: a missed launch date, a customer message sent wrong, spend over a limit, a stockout on an advertised product, a client escalation. Within a week, write one page: what happened, the cost in gross profit or customers, the timeline, the causes in the process (not the person), and two or three fixes, each with an owner and date. Track fixes in the weekly review until done, and turn each lasting lesson into a playbook rule or a review check.

**Judge it by:** Process causes named, and dated fixes that later show as done. Weak reviews name a person or end with "be more careful".

**Breaks when:** The miss is trivial and one-off; keep it short and factual on a very small team.

**From:** OPS-0001, MEA-6333, Google SRE book, postmortem culture, https://sre.google/sre-book/postmortem-culture/

### 26. Build the team's memory from its own records, so no job starts cold

**Why it works:** Context is the costliest thing a specialist lacks. Two agencies found their useful AI wins came from their own data, not plug-in tools: a client hub summarising calls, chat, email and video notes into each account's status and next steps, and a founder assistant built from his own published transcripts.

**How to apply:** Keep one record per store or client: the org context, the decision and change log, past briefs with their results, the recommendation scores and the open fixes from reviews. Every new job reads it first and writes back what it learned. Collect improvement requests in one place, let managers filter them, and rank the queue every two weeks by impact, as one agency does for automations. Retire stale facts with a date, so old offers or prices never reach a brief.

**Judge it by:** A new job's spec cites past results and decisions without asking the owner again. Weak teams ask the client the same intake questions every month.

**Breaks when:** A brand-new store with no history; nobody owns the record, so it rots.

**From:** OPS-6620, OPS-0021, MEA-6333

## Working from the org context

- Read the org context before writing any spec: the buyers in their own words, the voice, the design system, the live offers, what ran and what won. Link the exact files in the brief instead of retelling them.
- Copy approved claims, product facts and prices word for word from the brain into briefs; never let a brief paraphrase a claim.
- Check the brain's offers and landing pages against the live site on the day of the brief; mark anything stale and ask its owner to update it.
- Use past winners in the brain as the first source of new work: relaunch, remake or rework them before briefing net-new concepts.
- Carry the owner's named priorities into the plan's top slots unless the store's numbers clearly say otherwise, and write down why when they do.
- Keep to the brand's voice and design system in every brief; where the team thinks the brand could do better, propose the change as a small, separate test with a judging line, not as a quiet edit inside live work.
- Write back to the brain after each job: new buyer phrases, results, rules learned and any fact that changed, each with a date.
- Note the access level the client set for each tool and carry it forward word for word; the brain never grants more access than the client approved.

## Review checklist

- [ ] Does the spec name one constraint and the store number that proves it?
- [ ] Are gross profit per order and the judging line written in money, with source and date?
- [ ] Does the brief fit on one page with three to five yes or no acceptance tests?
- [ ] For creative, does the brief state persona, angle, offer and awareness stage?
- [ ] Does every job and part have one named owner, with hand-over notes for helpers?
- [ ] Is the plan sized in hours per person against real free hours, with about 20% slack for roles that take unplanned work?
- [ ] Do dates come from how long similar past jobs took, or carry a stated buffer?
- [ ] Is creative volume worked out from the revenue goal or winner churn, with the formula shown?
- [ ] Does each proposed action name its approval level, with money at stake and whether it can be undone?
- [ ] Does every diagnosis state the full chain from business number to cause, after the change history was read?
- [ ] Has every acceptance test been marked pass or fail with evidence?
- [ ] Do all numbers, counts and claims match their sources and each other across every asset?
- [ ] Does every recommendation carry a prediction and a review date in the log?
- [ ] Do updates to owners or clients lead with store orders and gross profit, each number with its source?
- [ ] Are new partners vetted on P&L link, fit to the store's size and peak record, with evidence?
- [ ] Is any new market, channel or account added one at a time, with its hours in the plan?
- [ ] Are every file and ad named by the rule, with rights and end dates recorded?
- [ ] Is every client or customer message marked as a draft for the owner's yes?
- [ ] Does any peak plan carry a dated pacing sheet, weeks of cover per SKU and a partner freeze date?
- [ ] Is fixed payroll sized against the lowest month's revenue, with flexible capacity named?

## Common failures

- Starting with an ad account audit full of settings complaints. Fix: start from store numbers, name the one constraint and rank fixes by gross profit.
- Dates taken from the request instead of the team's hours. Fix: size hours from past jobs, add a buffer when there is no history, and cut scope before promising.
- Everyone loaded to 100%, so urgent fixes wait days. Fix: plan roles that take unplanned work to about 80% and track the age of the oldest request.
- More ads, emails or pages as the answer to every slowdown. Fix: set the quality bar, count distinct concepts, then raise volume.
- "The team" as owner, or two people writing one piece. Fix: one named owner per job, helpers only for separable parts.
- Every small change waiting for the owner, or big ones made without asking. Fix: a written approval matrix by money and reversibility, with a log.
- Reacting to the last three days of numbers. Fix: read the change history, check reporting lag and write the full cause chain first.
- Client updates that lead with platform ROAS and tasks done. Fix: lead with new-customer profit contribution from store orders.
- Recommendations with no prediction, so nobody learns. Fix: log each with a predicted range and review date, then grade on profit.
- Reviews that blame a person and end with "be more careful". Fix: name process causes and give each fix an owner and a date.
- Briefs that leave claims, sizes or the success test open, so work comes back wrong. Fix: one page, every claim linked to proof, tests written before work starts.
- Opening several markets or channels at once. Fix: one at a time, each counted as a new client's workload.
