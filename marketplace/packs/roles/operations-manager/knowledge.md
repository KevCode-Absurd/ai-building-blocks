# Operations manager: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. Tool features change often; each one says when it was true. This kit covers how small businesses run their daily work. It is not legal, health and safety, food safety or franchise law advice. Where a law or a regulator decides the answer, I point to the official source and say who to ask.

## 1. What this role is for

**Who hires an operations manager.** Owners of businesses with a handful to a few dozen staff, where the business still runs on the owner's memory. The signs: the same mistakes repeat, new staff learn by watching whoever is free, nobody knows who owns a task, orders or jobs pile up at one step, the owner works more hours without more output, and a second site or a franchise is on the table. In the agents built on this kit, the work splits into six jobs: weekly operations reviews, written SOPs and guides, process maps that find waste, finding the bottleneck that caps output, turning an owner-run business into roles and systems, and operations manuals that let a second site run like the first.

**What good work looks like.**
- Every recurring task has one owner, a backup, a written way of doing it and a check that proves it was done.
- The owner can take a week off and the business still runs.
- Problems are traced to a cause the team can change, not blamed on a person.
- The weekly review ends with a short list of fixes, each with an owner, a date and a way to tell whether it worked.
- Documents are short, current and actually used on the shop floor, in the van or at the till.
- A new site opens from a manual and a checklist, not from the founder flying in for a month.

**How the work is judged.**
- Output and lead time: more finished work, delivered faster, with the same people.
- Fewer repeat errors, complaints and redos.
- Owner hours freed each week.
- How quickly a new starter can do a task alone.
- Whether fixes stick: the same problem does not return a month later.

**What this role does not do here.** Sign off on safety-critical, clinical, food safety or engineering procedures; that needs a qualified person or the regulator's own guidance. Decide pay, hiring, discipline or employment terms (an HR or legal matter). Write franchise agreements or disclosure documents (a franchise lawyer's job). Make live changes in the client's tools beyond the access level and limits the client set (see `access.md`).

## 2. The canon

**Taiichi Ohno and the Toyota Production System.** Toyota built its system on removing waste so it can deliver quickly, cheaply and well. Its two pillars are jidoka (stop the line when something is wrong, so defects are not passed on) and just-in-time (make only what is needed, when it is needed, in the amount needed). Continuous improvement, kaizen, attacks three enemies: muda (waste), mura (unevenness) and muri (overburden) [1]. Ohno's book, *Toyota Production System* (English edition 1988), is the source most practitioners cite.

**The five whys.** Ask why a problem happened, then why that happened, until you reach a cause you can remove. The Lean Enterprise Institute stresses that five is a rule of thumb, not a quota, and that fixing only the visible failure lets the problem come back [2].

**Standardized work.** Toyota-style standard work fixes the pace needed to meet demand (takt time), the order of steps and the stock needed between steps. Its main job is to be the baseline that improvement is measured against [3]. An SOP without a baseline cannot be improved; it can only be rewritten.

**Value-stream mapping (Mike Rother and John Shook, *Learning to See*, 1998).** Draw how work and information really flow today, from order to delivery, then draw the flow you want, and close the gap step by step [4]. In a service business the "material" is a job, a ticket or a client file.

**Plan, do, check, act.** A repeating cycle for change: plan a change, try it, check results against the target, then standardise it or start again. It grew from Walter Shewhart's work and W. Edwards Deming's teaching in Japan in the 1950s; Deming preferred "study" to "check" (PDSA) [5].

**Eliyahu M. Goldratt and Jeff Cox, *The Goal* (1984).** Every system has one constraint that limits its output. The five focusing steps: identify the constraint, exploit it (get the most from it with what you have), subordinate everything else to it, add capacity to it only after the first steps, then go back to the start before inertia makes an old rule the new limit [6]. An hour lost at the constraint is an hour lost for the whole business.

**Little's Law (John Little, 1961).** Over time, the average amount of work in progress equals the rate work finishes multiplied by the average time each item spends in the system. The practical point: if throughput stays the same, more work in progress means longer waits. Cutting the pile shortens the wait.

**The Kanban Method (David J. Anderson; Kanban University).** Make the work visible, limit work in progress, manage flow, make the rules explicit, hold regular feedback meetings and improve by small experiments. Its starting rule is to begin with what you do now [7].

**Michael E. Gerber, *The E-Myth Revisited* (1995).** Most small businesses are run by a technician doing the work, not by someone building the business. Gerber's answer is to design the business as if it were the prototype for many copies: an org chart of roles before people, and systems that let ordinary people get consistent results.

**Atul Gawande, *The Checklist Manifesto* (2009).** Gawande separates errors of ignorance (we do not know enough) from errors of ineptitude (we know but fail to apply it), and argues that complex work now fails mostly from the second kind. Short checklists help even experts [8]. The World Health Organization says its Surgical Safety Checklist has been shown to cut complications and deaths by over 30 percent [9].

**Andy Grove, *High Output Management* (1983).** A manager's output is the output of the team they run. Grove paired indicators so that pushing one number up does not hide damage to another, for example speed paired with error rate.

**Process notation.** BPMN 2.0.2 (Object Management Group, January 2014) is the standard flowchart notation for business processes [10]. Most small firms do not need full BPMN; a swimlane map (one lane per role) borrows its core shapes.

**ISO 9001.** The quality management standard behind most certified firms. Its 2026 edition was published on 16 September 2026, replacing the 2015 edition, with a three-year transition for certified organisations. Certification bodies summarise the changes as more weight on quality culture and leadership, and on opportunities as well as risks; ISO's own page blocks automated reading, so check iso.org for the text [11].

## 3. How the work is done now

### Writing it down (as of 6 Nov 2026)
- **Capture first, write second.** Teams record a real run of a task (screen recording, phone photos, a walk-through call) and turn it into steps. Scribe's free Basic plan captures web processes through Chrome and Edge extensions and turns them into how-to guides; desktop capture, branding and exports are on paid plans [28].
- **Training libraries.** Trainual (paid; no free plan listed) holds SOPs, roles and quizzes, and lists an MCP server for custom AI agents on higher-tier plans [29]. Process Street (paid after a free trial) runs checklists as tracked workflows.
- **Wikis.** Most small teams keep SOPs in Notion, Confluence, Google Docs or SharePoint. The format matters less than one owner and a review date per document.
- **AI drafting.** An AI can turn a transcript into a clean draft SOP in minutes. The risk is invented steps, tools or checks. Every draft is checked by the person who does the task before it is published.

### Connecting AI to the client's tools (as of 6 Nov 2026)
- **Notion MCP** lets AI assistants search the workspace, create and edit pages and manage databases; workspace admins can manage which MCP clients connect [21].
- **Asana's MCP server** (V2) connects with OAuth and can create and manage tasks and projects; the older beta endpoint is deprecated, and admins on some plans can allow or block clients [22].
- **Atlassian's Rovo MCP server** covers Jira, Confluence and other Atlassian apps, signs in with OAuth 2.1, follows the user's existing permissions and draws on the organisation's Rovo credits [23].
- **monday.com's MCP integration** is in beta and runs locally with the client's own API token; it can create items and boards and update statuses, dates and owners [24].
- **Miro's MCP server** works on all Miro plans, signs in with OAuth 2.1, respects board permissions and can read boards and generate diagrams [25].
- **Zapier MCP** gives an AI tool actions in over 9,000 apps; each call uses two tasks from the Zapier plan's quota, and the owner chooses which apps and actions the agent may use [26].
- **Claude's Google Workspace connectors** read and act in Gmail, Calendar and Drive; by default every action needs the user's approval, and on Team and Enterprise plans an owner must switch them on [27].
- Access is granted per tool at one of three levels: read; read and draft; read, write and publish within the client's limits. Until the client says otherwise, I work at level 1.

### Health and safety procedures differ by region
- **UK.** Employers must assess risks; with 5 or more employees they must record the significant findings. HSE adds that controlling the risk in practice matters more than paperwork [12].
- **US.** OSHA's Recommended Practices for Safety and Health Programs are written for small and medium businesses and rest on seven core elements, from management leadership and worker participation to hazard control and training [13]. Specific OSHA standards can require written programmes; check the standard that applies.
- **EU.** The 1989 Framework Directive requires employers to evaluate all risks, consult and train workers and plan for emergencies; national laws add detail [14].
- An operations manager writes the SOP around the controls a competent person has set. They do not decide what is safe.

### Food businesses
- **UK.** The Food Standards Agency's Safer food, better business packs help small caterers and retailers in England and Wales meet food hygiene rules, with a daily diary of checks; Northern Ireland has its own guidance [15].
- **US.** The FDA Food Code is a model that state and local regulators adopt; the 2026 edition is the latest full edition (FDA page current as of 22 Oct 2026) [16]. The local health department's adopted version is what applies.
- **EU.** Regulation (EC) 852/2004 sets hygiene rules for every food business operator and has applied since 1 January 2006, with some flexibility for small establishments [17].

### Franchising and multi-site manuals
- **US.** The FTC Franchise Rule (16 CFR Parts 436 and 437) requires a disclosure document with 23 items [18]. It must reach a prospective franchisee at least 14 calendar days before they sign or pay, and Item 11 asks for the table of contents of the operating manual franchisees receive [19]. So the manual's structure becomes part of a legal document: agree it early and keep it current.
- **Elsewhere.** Disclosure and franchise rules differ by country. The operations manager writes the manual; a franchise lawyer in each country handles agreements and disclosure.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| over 30% | Fall in surgical complications and deaths credited to the WHO checklist | [9]; surgery, not small business; shows what short checklists can do in complex work |
| 5 or more | UK employees at which risk assessment findings must be recorded | [12]; UK only |
| 14 calendar days | US minimum gap between giving the franchise disclosure document and signing or payment | [19]; US Franchise Rule |
| 23 | Items in the US franchise disclosure document | [18] |
| 3 years | Transition for ISO 9001:2026 certificates | [11]; certification body summary |
| 2 tasks | Zapier quota used by each Zapier MCP call | [26]; as of 6 Nov 2026 |
| $105,770 | US median pay for general and operations managers, May 2025 | [20]; US only, all industries and sizes |
| 5% | Projected US job growth for general and operations managers, 2025-35 | [20] |

**Numbers I do not quote.** "Documented processes save X hours a week", "Y% of small businesses have no SOPs" and similar vendor survey figures without a named method, sample and date. For the client's own numbers, I use their counts and label any guess as a guess.

## 5. Decision rules

- If a problem keeps coming back, ask why until you reach a cause the team can change, and fix that cause, not the symptom [2].
- If output is too low, find the step where work queues before adding people or hours anywhere else [6].
- If you have found the constraint, protect its time and feed it good work before buying more capacity [6].
- If lead times are long and work piles up, limit work in progress before pushing people to work faster [7].
- If a task is done by more than one person or by a new starter, write it down; if only one expert does it rarely, start with a handover note and a recorded run.
- If an SOP step can hurt someone, damage food safety or break a regulation, mark it for sign-off by a qualified person and link the official guidance [12][13][14][15].
- If the team ignores an SOP, watch the task done and rewrite the SOP to match reality before blaming the team.
- If a fix is proposed, run it as a small, dated trial with a measure and a stop rule, then standardise or drop it [5].
- If a number is pushed up, pair it with a guard number so the gain does not hide new damage (speed with errors, sales with refunds).
- If a second site or franchise is planned, write the operations manual from the best-run site first, then test it on someone who has never worked there.
- If a franchise is planned in the US, agree the manual's table of contents early, since it goes into the disclosure document [19].
- If the client grants access, ask which level for each tool, work at level 1 until they answer, and at level 3 confirm the list of actions once before the first live change [21][22][23].

## 6. Common mistakes and how to spot each

- **SOPs written from memory.** Spot it: steps nobody recognises, missing exceptions. Fix: watch or record a real run first.
- **One giant manual nobody opens.** Spot it: a 90-page PDF last edited two years ago. Fix: one task per SOP, a one-page checklist for daily use and an index.
- **No owner, no review date.** Spot it: three versions of the same SOP in different folders. Fix: owner and next review date at the top of every document.
- **Fixing symptoms.** Spot it: the same complaint in three weekly reviews. Fix: root-cause questions and a trial [2].
- **Optimising a step that is not the bottleneck.** Spot it: one team is faster but total output is flat. Fix: map the queues and find the constraint [6].
- **Too much work started.** Spot it: everything is "in progress", nothing is finished, lead times keep growing [7].
- **Blaming people for process faults.** Spot it: reviews that name individuals, not steps.
- **Weekly reviews with no follow-through.** Spot it: action lists that roll over unchanged. Fix: fewer actions, each with an owner, a date and a measure.
- **Copying another firm's checklist.** Spot it: items that do not fit the work. Checklists must be built from the team's own failure points [8].
- **Automating a broken process.** Spot it: a new tool that moves the mess faster. Fix: simplify first, then automate.
- **Safety by template.** Spot it: a downloaded risk assessment with someone else's hazards. Fix: assess your own site and follow official guidance [12].

## 7. Quality bar

Before I hand anything over, I check:
1. Does every step start with a verb, name the role that does it and say how you know it is done?
2. Did someone who does the task confirm the steps, or are unconfirmed steps marked "Needs answer"?
3. Does every recurring task, fix and action have one owner, one date and one measure?
4. Is every number from the client's own data, or labelled as a guess?
5. Are exceptions covered: what to do when the step fails, the system is down or the person is away?
6. Are safety, food, legal and franchise points marked for a qualified person, with the official link?
7. Could a new starter follow it on day one without asking the owner?
8. Does each document have an owner, a version, a date and a next review date?
9. Did every live change stay within the access level and limits, and is it logged?

## 8. How this role writes

- **SOPs.** Title, purpose in one line, owner, trigger (when to do it), what you need first, numbered steps (one action each, starting with a verb), what you should see after risky steps, quality check, common mistakes, what to do if a step fails, version and review date.
- **Checklists.** One page, read-do or do-confirm, only the steps people skip or get wrong, a pause point and a signature line where it matters [8].
- **Process maps.** A numbered list plus a simple swimlane: one lane per role, waits and hand-offs marked, each step with a time if known [10].
- **Weekly ops review.** One page: numbers against last week, what worked, what slipped and why, three or fewer actions with owners and dates, and a watch list.
- **Operations manual chapters.** Purpose, standard, steps, pass and fail examples, checks, common mistakes, places for photos.
- **Tone.** Plain words, short sentences, no jargon unless it is defined. Written for the person doing the task, not the owner.

## 9. Glossary

- **SOP (standard operating procedure)**: the written, agreed way to do one recurring task.
- **Checklist**: a short list of the steps people most often miss, used while or after doing the task.
- **Constraint (bottleneck)**: the one step that limits how much the whole business can finish.
- **Throughput**: how many items the business finishes in a period.
- **Lead time**: how long one item takes from start (or order) to finished.
- **Work in progress (WIP)**: items started but not finished.
- **Takt time**: the pace of output needed to meet customer demand [3].
- **Kaizen**: small, continuous improvements made by the people doing the work [1].
- **Muda, mura, muri**: waste, unevenness and overburden [1].
- **Five whys**: asking why repeatedly to reach a root cause [2].
- **Value-stream map**: a map of how work and information flow from order to delivery [4].
- **Swimlane map**: a process map with one lane per role, showing hand-offs.
- **PDCA / PDSA**: plan, do, check (or study), act: the cycle for testing a change [5].
- **Buffer**: a small, deliberate queue in front of the constraint so it never runs dry.
- **RACI**: a chart of who is Responsible, Accountable, Consulted and Informed for each task.
- **Org chart of roles**: positions the business needs, drawn before deciding who fills them.
- **Role agreement**: the results a role owns, its standards and the systems it uses.
- **Operations manual**: the full set of standards and procedures for running a site.
- **FDD (Franchise Disclosure Document)**: the US disclosure a franchisor must give before a sale [18].
- **Access levels**: read; read and draft; read, write and publish within the client's limits.

## 10. What changes fast

| Fact | Where to re-check |
|---|---|
| ISO 9001:2026 transition dates | iso.org, or the client's certification body [11] |
| MCP servers and connectors: endpoints, plans, permissions | Notion [21], Asana [22], Atlassian [23], monday.com [24], Miro [25], Zapier [26], Claude Help Center [27] |
| Documentation tool plans and AI features | Scribe [28], Trainual [29] and other vendors' pricing pages |
| FDA Food Code edition and state adoption | FDA Food Code page [16] |
| UK food safety packs | FSA on GOV.UK [15] |
| Health and safety guidance | HSE [12], OSHA [13], EU-OSHA [14] |
| US Franchise Rule changes | FTC rule page [18] |
| Pay and job outlook | BLS Occupational Outlook Handbook [20] |
