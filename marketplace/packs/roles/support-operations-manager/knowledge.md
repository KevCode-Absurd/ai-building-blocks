# Customer support operations manager: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. This kit covers how a support team is set up and run. Answering customers, returns, refunds and consumer law sit in the `customer-support-specialist` kit; bot design and AI disclosure detail sit in the `chatbot-specialist` kit. This kit points to them instead of repeating them. Nothing here is legal or employment advice; where a rota, a complaint or a data request turns on the law, check this with local rules or ask a qualified adviser.

## 1. What this role is for

**Who hires a support operations manager.** Teams of three to fifty people answering customers by email, chat, phone and social, who have outgrown a shared inbox or a help desk nobody set up properly. Online shops, software firms, IT and facilities contractors, clinics and agencies. The agents built on this kit split the work into six jobs:
- **Help desk set-up:** queues, tags, views, routing rules and a triage guide, each queue with a named owner.
- **Service levels:** response and resolution targets by channel and priority, and the service level schedule a business gives its own clients.
- **Staffing:** people needed by hour from ticket volume, then a rota with breaks, cover and handovers.
- **Quality:** a scorecard, a fair sample of graded tickets, coaching notes and reviewer calibration.
- **Escalations and complaints:** levels, triggers, owners and hand-off notes, plus careful replies to serious complaints.
- **Insight:** weekly KPI packs and monthly voice-of-customer reports that send fixes to product, operations and marketing.
- **Training:** a two-week plan, role-plays and a go-live sign-off for new staff.

**What good work looks like.**
- Every ticket has an owner; nothing sits in a queue nobody watches.
- Targets come from the team's real volume and staffing, not wishes, and each one says how it is measured.
- Every number on a report has a one-line definition, so it means the same thing every week.
- Quality scores do not depend on who did the review.
- The top three reasons customers contact the business reach the people who can remove them.
- Changes to live routing, automations or bots are listed, tested and logged before they go live.

**How the work is judged.** Share of tickets meeting each target, backlog age, repeat contacts, quality score trends, how many contact reasons were fixed at source, cost per ticket where the client gives the figures, and whether customers and staff can tell what happens next.

**What this role does not do.** Decide pay, discipline or dismissal from quality scores. Give employment-law or working-time rulings for a rota. Admit legal liability in a complaint. Promise targets the staffing cannot meet.

## 2. The canon

**Knowledge-Centered Service (KCS v6), Consortium for Service Innovation.** Knowledge is captured while a ticket is solved, structured, reused and improved each time it is used (the Solve Loop: capture, structure, reuse, improve, with the habits "search early, search often" and "flag it or fix it"). A second loop keeps the whole base healthy: content health, process integration, performance assessment, and leadership and communication [1]. For this role, KCS is the reason macros and help pages are owned and reviewed, not written once.

**Queueing and the Erlang C model (A. K. Erlang, 1917).** Erlang C estimates how many agents are needed for a given contact rate, handling time and wait-time target. Zendesk recommends it for hourly voice staffing, and warns that it is only a guide: it ignores breaks, shifts and other duties [8]. For low-volume workstreams, Zendesk notes Erlang C may suggest slightly more staff than needed [9]. The lessons that hold for every channel: staffing must follow volume by hour, and small teams need more slack per contact than large ones.

**Service level management (ITIL 4, AXELOS).** Agree targets the customer can understand, measure them the same way every time, and review them when the service changes. Credited here for the habit, not for any figure.

**Customer effort.** The research by Matthew Dixon, Karen Freeman and Nick Toman (*Harvard Business Review*, 2010) and the book *The Effortless Experience* (2013) underpin the rule that repeat contacts, transfers and repeating one's story are what drive disloyalty. The `customer-support-specialist` kit summarises it with sources.

**Reading list (credited, no figures taken from them).** Brad Cleveland, *Call Center Management on Fast Forward*; Ger Koole, *Call Center Optimization*; A. Parasuraman, Valarie Zeithaml and Leonard Berry on SERVQUAL (1988), the five dimensions of service quality; ISO 10002, guidelines for complaint handling.

## 3. How the work is done now

### Routing, queues and tags (as of Nov 2026)
- **Zendesk omnichannel routing** sends email, messaging and calls to agents by status and capacity. Work goes to the agent with the most spare capacity, or round robin. Custom queues are checked before the standard queue. Growth plans add ordering by soonest SLA breach; Professional adds skills, priority ordering, custom queues and up to 5 custom statuses; Enterprise allows up to 100 custom statuses. A skills timeout can let tickets overflow to agents without the skill [2].
- **AI classification.** Zendesk's intelligent triage tags tickets with topic, sentiment, language and custom entities when a ticket arrives with a public comment. Classifications appear on Suite and Support Professional plans and above; using them in triggers to route or prioritise needs the Copilot add-on [3].
- **Tag design.** Each tag answers one question (reason, product, or channel), never two. A short reason list that agents actually use beats a long one nobody applies. AI topics help, but the business still owns the list.

### Service levels in the tool
- **Zendesk SLA policies** set targets on the system Priority field (Low, Normal, High, Urgent). If Priority is blank, no SLA applies, and custom fields named "priority" cannot carry targets. Metrics: first reply time, next reply time, periodic and pausable updates, requester wait time, agent work time and total resolution time. Zendesk advises choosing one resolution metric and placing the most restrictive policies at the top. SLA policies need Suite Growth or Support Professional and above [4].
- **Freshdesk SLA policies** apply the first policy whose conditions match, so urgent and VIP policies go at the top. First response time counts an agent's reply; automation "send reply" actions do not count. Targets are set per priority in business or calendar hours. Multiple policies and breach escalations need the Pro plan or above (modified 20 Aug 2026) [5].
- **What counts as a reply.** In Zendesk, first reply time stops at the first public agent comment; requester wait time counts time in New, Open and On-hold [14]. An internal note does not stop the clock.

### Automations and safe change
- **Triggers and automations.** In Zendesk, triggers run immediately when a ticket is created or updated; automations are time-based and run hourly on tickets that are not closed. Each automation needs a nullifying condition or it can fire in a loop. Limits: 500 active automations, each firing on up to 1,000 tickets an hour. The standard automation closes tickets 96 hours after they are solved (updated 30 Oct 2026) [6].
- **Test before live.** A Zendesk sandbox copies settings, triggers, automations, macros and up to 10,000 tickets, and changes there do not touch production. Support Enterprise includes one sandbox; Professional and Suite Growth and above can buy one. Changes must be recreated by hand in production, and user emails become @example.com [7]. Without a sandbox, build the rule switched off, test on a test ticket, then switch it on.

### Staffing to volume
- **Inputs:** contacts per hour, average handling time including wrap-up, the target share answered within a maximum wait, and the maximum wait. Zendesk's worked example: 30 calls an hour, 300 seconds handling, 90% answered within the wait limit, giving six agents for that hour [8].
- **Forecasting:** use up to two years of history where it exists, set a cut-off after a big change, exclude outliers such as outages, and add a manual adjustment for known events such as a sale or launch. Compare forecast with actual each period [9].
- **Email and chat differ.** Zendesk's forecasts carry email that arrives outside staffed hours into the next period, but drop live-channel volume outside those hours [9]. Staff live channels to the hour; staff email to the day's target.
- **Shrinkage.** Breaks, training, meetings, leave and sickness take people off the queue. Use the client's own figures; do not assume an industry percentage.

### Quality reviews
- **Zendesk QA scorecards** weight each category from 0 to 100 (default 10). A critical category rated below 50% fails the whole review or its group. Scales run from binary to 5-point; N/A and root-cause lists are optional. Scorecards need the QA or WFM add-on (updated 4 Nov 2026) [10].
- **AutoQA** scores closed or solved tickets with at least one customer and one agent message of 10 words or more; it skips spam and tickets imported before the scorecard was published [11]. Use automatic scores to choose which tickets a person reviews, not as the final grade.
- **Calibration.** Reviewers grade the same tickets separately, compare, and agree the reasons. A scorecard with pass and fail examples on every line keeps scores from depending on the reviewer.

### Macros and help centre upkeep
- **Ownership and review dates.** Zendesk article verification sends reminders to article owners on a schedule (the examples given run from two weeks to a year), and unverified articles stay on a "needs verification" list until someone reviews them. It needs an Enterprise plan [12].
- **Archive with care.** Before archiving, check whether the article is still searched for and used, update it if it is, and fix or redirect links first [13].
- **Dead links.** The EU Online Dispute Resolution platform was discontinued on 20 July 2025 [26]. A help page or footer that still sends EU customers there is out of date.
- Macro writing itself is covered by the `reply-template-library` skill in the `customer-support-specialist` kit.

### AI in support
- **Company claims, not benchmarks.** Klarna said in February 2024 that its AI assistant handled 2.3 million chats in its first month, about two-thirds of its service chats, with resolution time down from 11 minutes to under 2, and that customers could still choose a live agent [20].
- **What an "AI resolution" means.** Intercom counts a Fin resolution when the customer confirms the answer helped (confirmed) or leaves without asking for more help (assumed). It is not counted if the customer asks for a person or follows up (as of 23 Sep 2026) [16]. Report confirmed and assumed resolutions separately; an assumed resolution is not proof the problem was solved.
- **Bots in the help desk.** Freshdesk's Email AI Agent drafts replies from approved knowledge, resolves or escalates, has handover rules (for example after a set number of turns or on frustration), an optional mandatory disclaimer footer on every AI reply, and preview and bulk evaluation modes that do not touch live tickets (modified 9 Jul 2026) [19].
- **Connecting an AI agent to the help desk (as of Nov 2026).**
  - Intercom's MCP server (US and EU workspaces; not yet AU) can search and read conversations, contacts and companies, add internal notes, and create or update help articles. It cannot send customer-visible replies, and no listed tool changes tags or assignment [17].
  - Freshdesk's MCP server became generally available on 10 Sep 2026. It can read, create and update tickets, reply, add notes and work with solution articles. It authenticates with an API key only, and each plan carries action limits [18]. The client adds the key in the AI tool's connector settings themselves; it is never pasted into chat.

### Telling customers it is AI
- **EU.** From 2 August 2026, AI systems that talk directly with people must be designed so people know they are dealing with AI, unless it is obvious; the notice must be clear and given at the latest at the first interaction [21]. The Commission reads the "obvious" exception narrowly, gives no grace period for chatbot disclosure, and lists fines up to EUR 15 million or 3% of worldwide turnover (Q&A updated 24 Jul 2026) [22]. Who counts as the "provider" is a legal question; the `chatbot-specialist` kit covers it.
- **UK.** The CMA says a business is responsible for what its AI agent does as it would be for an employee, even if a third party built it. Label the agent where knowing it is AI could affect a customer's decisions, and do not let customers think a real person is providing the service; keep a human in the loop; test before launch and monitor after. Breaches can mean fines up to 10% of worldwide turnover (updated 30 Oct 2026) [23].
- **US.** For state bot-disclosure laws, see the `chatbot-specialist` kit.
- **In practice:** label the bot, give a route to a person, keep the bot inside approved help text, and review a sample of its conversations every week.

### Complaints with formal deadlines
- **UK financial services.** Firms under the Financial Ombudsman Service must send a final response within 8 weeks for most complaints, or 15 days for payment services, e-money and fraud or scam complaints, or a holding response saying why not. The final response must tell the customer they have 6 months to refer it to the ombudsman and include the ombudsman's leaflet [24].
- **Public league tables.** Ofcom publishes UK telecoms complaints by provider each quarter; in Q2 2026, for example, BT, EE, TalkTalk and Vodafone drew the most broadband complaints and Plusnet, Sky and Virgin Media the fewest (updated 26 Oct 2026) [25]. In regulated sectors, complaint handling is a reputational number, not just an internal one.
- Formal complaint replies need a fresh yes from the client every time, whatever the access level.

### Deleting tickets and customer data
- In Zendesk, deleted tickets sit in a Deleted tickets view for 30 days, then are permanently deleted automatically; permanent deletion cannot be undone and removes attachments [27]. Many teams close tickets with automations instead of deleting them [27].
- Under GDPR, a request to see or delete personal data gets a reply within one month, extendable by two months for complex requests with notice; erasure applies in set cases, with limited grounds to refuse [28]. Keep personal data only as long as needed, with written retention periods by purpose and a deletion procedure [29].
- Deleting tickets, contacts or customer data needs a fresh yes every time, even at level 3. Data requests go to the client the day they arrive.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 78.3 / 100 | UK Customer Satisfaction Index, July 2026 | [30]; 59,500 responses, 277 organisations; sector scores differ |
| 6 agents | Zendesk's Erlang C example: 30 calls/hour, 300 s handling, 90% within the wait limit | [8]; an example, not a norm |
| 500 / 1,000 | Zendesk active automations / tickets per automation per hour | [6]; product limits, Oct 2026 |
| 96 hours | Zendesk standard close after solved | [6] |
| 30 days | Zendesk deleted tickets recoverable before permanent deletion | [27] |
| 2 Aug 2026 | EU AI Act Article 50 applies | [21][22] |
| EUR 15m or 3% | Maximum Article 50 fine | [22] |
| 10% | Maximum CMA consumer-law fine, worldwide turnover | [23] |
| 8 weeks / 15 days | UK FOS final response deadlines | [24]; regulated financial firms only |
| 1 month | GDPR reply to access or erasure requests | [28] |
| 2.3 million / two-thirds | Klarna AI chats, first month | [20]; company claim, Feb 2024 |

**Numbers I do not quote.** A universal "80% in 20 seconds" service level, "average first reply time" by industry from vendor blogs, a standard shrinkage percentage, and "agents should handle X tickets a day". These depend on the client's channels, products and customers. Use the client's own history, or say there is no reliable figure.

## 5. Decision rules

- If a target is asked for, set it from the last four or more weeks of the client's own volume and handling time and check it against the rota before writing it down, because a target the team cannot meet teaches everyone to ignore targets [8][9].
- If a ticket has no priority in Zendesk, fix the triage step first, because SLA policies ignore tickets with a blank Priority field [4].
- If SLA policies overlap, order them most restrictive first, because both Zendesk and Freshdesk apply policies in order [4][5].
- If the team uses internal notes to "respond", stop counting them as replies; only a public reply stops first reply time [14].
- If first reply and resolution times look contradictory, check the date filters, because Zendesk reports them on different ticket sets (created versus solved) [15].
- If a new routing rule, trigger or automation is needed, build it in a sandbox or switched off, test it on test tickets, and add it to the change list before it goes live [6][7].
- If an automation has no nullifying condition, do not switch it on [6].
- If live chat or phone opening hours run past the staffed hours, either staff those hours or show customers when the channel is closed, because live contacts cannot wait for the next shift the way email can [9].
- If AutoQA is available, use it to pick tickets for human review; keep the human grade as the one that counts [11].
- If two reviewers' scores on the same ticket differ, calibrate on that ticket before grading more [10].
- If an article is unverified past its review date, the owner reviews it or it is archived after checking its use and links [12][13].
- If a bot answers customers in the EU, label it from the first message and give a route to a person [21][22]; in the UK, make sure customers are not led to think it is a person [23].
- If an AI agent's resolution rate is reported, split confirmed from assumed resolutions [16].
- If a complaint comes from a regulated financial customer in the UK, log the date received and run the 8-week or 15-day clock [24].
- If anyone asks to delete tickets or customer data, stop and get a fresh yes, because permanent deletion cannot be undone [27][28].
- If a quality score could be used for pay or discipline, say that the review is for coaching and the decision stays with the client.

## 6. Common mistakes and how to spot them

- **Targets from wishes.** Spot it: a one-hour reply target with no hourly volume data behind it.
- **Tags that answer two questions.** Spot it: tags like "refund-shoes" alongside "refund" and "shoes".
- **Queues without owners.** Spot it: a view with tickets older than the target and no named person.
- **Blank priorities.** Spot it: tickets with no SLA badge in Zendesk [4].
- **Untested automations.** Spot it: a ticket updated over and over by the same rule, or a flood of identical emails to customers [6].
- **Notes counted as replies.** Spot it: "first reply" times that look fast while customers say nobody answered [14].
- **Comparing different ticket sets.** Spot it: first reply time higher than full resolution time on the same dashboard [15].
- **QA by mood.** Spot it: one reviewer averages much lower than another on similar tickets [10].
- **AI resolution counted as success.** Spot it: a high resolution rate alongside rising repeat contacts [16].
- **Unlabelled bot.** Spot it: a bot with a human first name and no notice that it is automated [21][23].
- **Stale help pages.** Spot it: articles quoting an old policy or linking to a closed service [12][26].
- **Deleting instead of closing.** Spot it: "clean-up" requests to bulk delete old tickets [27].
- **Coaching notes used as evidence.** Spot it: QA reports forwarded to HR for a pay decision.

## 7. Quality bar

Before I hand over any set-up, report or change, I check:
1. Every number comes from the client's data or a cited source, with the period stated.
2. Every queue, target and article has a named owner.
3. Targets match staffing by hour; anything too tight is flagged with two honest options.
4. Every rule uses a feature the client's plan has, or says plainly that it does not [2][4][5][10].
5. Every live change was on the agreed change list, tested first and logged.
6. Every metric has a one-line definition, including what counts as a reply and which date it is filtered on [14][15].
7. Bots are labelled, with a route to a person [21][23].
8. Nothing touches pay, discipline, employment law or legal liability; deletions and formal complaint replies waited for a fresh yes.

## 8. How this role writes

- **Build sheets.** Tables: queue, owner, what lands there, target, view. Routing rules numbered in the order they run.
- **Target tables.** Channel by priority, with first reply, update and resolution targets, the hours covered, how each is measured and who covers a miss.
- **Rotas.** Staff needed by hour, then the rota, with the maths shown underneath so the client can check it.
- **Scorecards.** Each line with its weight, whether it is critical, and a pass and a fail example.
- **Coaching notes.** Two strengths and two habits to fix, each with a quoted line from a real ticket, written kindly.
- **Escalation playbooks.** Levels, triggers, owners, response times, and a hand-off note template; a flowchart where it helps.
- **KPI packs and reports.** A five-line summary first, then the detail; every number defined; thin themes marked as thin.
- **Change lists.** One row per change: what, where, why, test result, live date, how to undo.
- Short sentences, lists for anything over two items, and a "what to do on day one" close.

## 9. Glossary

- **Access level:** how much the agent may do in a tool: read; read and draft; or read, write and publish within the client's limits.
- **Queue:** a place tickets wait for a group or person, with an owner.
- **View:** a saved list of tickets matching conditions, used by agents and leads.
- **Routing:** rules that decide which queue or agent gets a ticket [2].
- **Skills-based routing:** sending tickets only to agents with the needed skill, such as a language [2].
- **Tag:** a label answering one question about a ticket, such as its reason.
- **Trigger:** a rule that runs when a ticket is created or updated [6].
- **Automation:** a time-based rule that runs on a schedule [6].
- **Nullifying condition:** the part of an automation that stops it firing again on the same ticket [6].
- **Sandbox:** a copy of the help desk for testing changes [7].
- **SLA policy:** targets for reply, update and resolution times set by priority [4][5].
- **First reply time:** time from ticket creation to the first public agent reply [14].
- **Requester wait time:** time a ticket spends waiting on the support team [14].
- **Erlang C:** a queueing formula that estimates agents needed for a contact rate and wait target [8].
- **Handling time:** time an agent spends on a contact, including wrap-up [8].
- **Shrinkage:** paid time when staff are not available for the queue, such as breaks, training and leave.
- **Scorecard:** the weighted criteria used to grade a support conversation [10].
- **Critical category:** a scorecard line that fails the review on its own [10].
- **Calibration:** reviewers grading the same tickets and agreeing the scores.
- **KCS:** Knowledge-Centered Service, capturing and improving knowledge while solving tickets [1].
- **Article verification:** a scheduled owner review of a help article [12].
- **Assumed resolution:** an AI conversation counted as resolved because the customer left [16].
- **Escalation:** moving a case to a higher level or specialist with a hand-off note.
- **Final response:** the formal last reply to a complaint in a regulated sector [24].
- **Voice of customer:** themes from tickets, reviews and surveys, counted by unique customers.

## 10. What changes fast

Re-check at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Help desk plan features (routing, SLA, sandbox, QA) | Zendesk [2][4][7][10], Freshdesk [5] help centres | As above, Oct to Nov 2026 |
| AI classification and add-ons | Zendesk intelligent triage [3] | Workflows need Copilot add-on |
| MCP servers for help desks | Intercom [17], Freshdesk [18] | Intercom: notes and articles, no replies; Freshdesk: GA 10 Sep 2026, API key only |
| AI resolution definitions | Intercom [16] | Confirmed and assumed, Sep 2026 |
| AI disclosure rules | AI Act Article 50 [21], Commission Q&A [22], CMA [23] | Applies 2 Aug 2026; CMA guidance updated 30 Oct 2026 |
| Complaint deadlines | Financial Ombudsman [24] | 8 weeks; 15 days for payments |
| Complaint league tables | Ofcom [25] | Q2 2026 published 26 Oct 2026 |
| Satisfaction index | UKCSI [30] | 78.3, July 2026 |
| Data rights | EDPB SME guide [28][29] | One month to reply |
| Help desk deletion rules | Zendesk [27] | 30 days, then permanent |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` Set a target from the last four or more weeks of the client's own volume and handling time, checked against the rota, because a target the team cannot meet teaches everyone to ignore targets. (§5)
- `decision_rule` When live chat or phone hours run past the staffed hours, staff those hours or show customers when the channel is closed. (§5)
- `decision_rule` Use AutoQA to pick tickets for human review, and keep the human grade as the one that counts. (§5)
- `decision_rule` When two reviewers score the same ticket differently, calibrate on that ticket before grading more. (§5)
- `taste_reference` Coaching notes give two strengths and two habits to fix, each with a quoted line from a real ticket, written kindly. (§8)
- `taste_reference` KPI packs open with a five-line summary, and thin themes are marked as thin. (§8)
