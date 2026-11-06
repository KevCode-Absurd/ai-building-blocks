# Project manager: what the role knows

Checked 6 November 2026. Facts that can change carry a date and a source number from `sources.json`. Tool features change often; each one says when it was true. This kit covers planning and running projects for small businesses and agencies. It is not legal, contract or accessibility law advice, and estimates are not promises. Where a law or a contract decides the answer, I point to the official source and say who to ask.

## 1. What this role is for

**Who hires a project manager.** Owners, founders, agency heads and managers with a one-off piece of work that is bigger than a task: a website redesign, a software build, a launch, an office move, an event, a new system, a client project with a fixed fee. They hire a project manager when the goal is fuzzy, the deadline is real, several people must hand work to each other, or past projects ran late and over budget. In the agents built on this kit, the work splits into four jobs: plans with owners, dates and risks; software scope breakdowns and estimates with ranges; agency scopes, change requests, capacity and client updates; and website redesigns with a content inventory and a safe move to the new site.

**What good work looks like.**
- The goal, the finish line, the deadline and the limits (money, people, tools) fit in two sentences everyone agrees with.
- Every piece of work has one owner, a date, and the work it depends on.
- Estimates are ranges with stated assumptions, not single numbers that become promises.
- Risks are written down early, each with a warning sign and a first response.
- Changes to scope are noticed, priced and agreed before work starts on them.
- Status updates tell non-experts what is done, what is next, what is blocked and what they must decide.
- The project ends with a short, honest review that changes how the next one runs.

**How the work is judged.**
- Delivered what was agreed, by the date agreed, within the budget agreed, or the client knew early and chose the trade-off.
- No surprises: bad news arrived as soon as it was known.
- Stakeholders understood every update without a call to explain it.
- For agencies: margin protected, because extra work was priced, not absorbed.

**What this role does not do here.** Promise fixed prices or dates it cannot check. Write contract terms or give legal advice on scope disputes. Sign off construction or safety schedules that need a licensed planner. Make live changes in the client's tools beyond the access level and limits the client set (see `access.md`).

## 2. The canon

**PMI, *A Guide to the Project Management Body of Knowledge* (PMBOK Guide), Eighth Edition (November 2025).** PMI's reference guide. The Eighth Edition pairs a short set of principles with performance domains such as governance, scope, schedule, finance, stakeholders, resources and risk, and brings defined processes back after the Seventh Edition's principle-based approach [1]. PMI's site blocks automated reading, so I check the guide itself for exact wording.

**PRINCE2 (a method that began in UK government).** A project must keep a business reason to exist, checked at each stage; roles are defined; work is managed in stages; managers act within agreed tolerances and escalate only when they are breached. "Manage by exception" is the idea most small teams can borrow.

**Critical path and PERT (late 1950s).** The critical path method, from work at DuPont, finds the longest chain of dependent tasks, which sets the earliest finish. PERT, from the US Navy's Polaris programme, uses three estimates per task (optimistic, most likely, pessimistic) and weights the most likely four times: (O + 4M + P) / 6.

**The Agile Manifesto (2001).** Four value statements: people and interactions over process and tools, working results over heavy documents, working with the customer over contract negotiation, and responding to change over following a plan. The items on the right still matter; the left matters more [2].

**The Scrum Guide (Ken Schwaber and Jeff Sutherland, 2020).** Three accountabilities (Product Owner, Scrum Master, Developers), five events with the Sprint as the container, three artifacts each with a commitment (Product Goal, Sprint Goal, Definition of Done). Sprints are one month or less. The guide does not mention story points or velocity; teams add those themselves [3].

**The Kanban Method.** Visualise the work, limit work in progress, manage flow, make the rules explicit and improve by small experiments [4]. Useful for agencies and support teams where work arrives continuously rather than in projects.

**Ryan Singer, *Shape Up* (Basecamp).** Instead of estimating how long something will take, decide how much time it is worth (the appetite), shape the work to fit, and commit for a fixed cycle. Basecamp works in six-week cycles followed by a two-week cool-down, and work that does not ship in a cycle is cancelled by default rather than extended [5]. The book is free to read online.

**Frederick P. Brooks Jr., *The Mythical Man-Month* (1975).** Adding people to a late software project tends to make it later, because new people need training and every added person adds communication paths.

**Daniel Kahneman and Amos Tversky, the planning fallacy (1979).** People plan from the best case of their own project and ignore how similar projects actually went. The fix is to start from the outside view: how long and how much did projects like this one take?

**Bent Flyvbjerg.** His "iron law" of big projects: over budget, over time, over and over again [11]. His team's study of 5,392 IT projects found cost overruns follow a fat-tailed distribution, with a small number of extreme overruns that averages hide [12]. His remedy, reference class forecasting, puts the outside view into practice. With Dan Gardner, in *How Big Things Get Done* (2023), he argues for slow, careful planning followed by fast delivery.

**Eliyahu M. Goldratt, *Critical Chain* (1997).** People pad each task and then use the padding (starting late, or letting work fill the time, the effect C. Northcote Parkinson described in 1955). Goldratt's answer is to strip padding from tasks and hold one shared buffer at the end of the project.

**Steve McConnell, *Software Estimation* (2006).** Keep three things apart: the estimate (what it will likely take), the target (what the business wants) and the commitment (what the team promises). Early estimates are far less certain than later ones, and the range narrows only as decisions are made.

**Gary Klein, the pre-mortem.** Before starting, imagine the project has failed and ask everyone to write down why. It surfaces risks people would not raise in a normal planning meeting.

**Public-sector guides worth borrowing from.** The US GAO's schedule guide sets out ten best practices for reliable schedules, including schedule risk analysis [6]. Its cost guide runs from purpose and scope through a work breakdown structure, ground rules and assumptions, risk and sensitivity analysis, documentation and updating with actual costs [7]. In the UK, GovS 002 (version 2.1, 17 September 2025) sets the standard for government projects and makes governance roles mandatory [8], and the GOV.UK Service Manual splits delivery into discovery, alpha, beta, live and retirement [9].

## 3. How the work is done now

### Methods (as of 6 Nov 2026)
- Most small teams run hybrid projects: a dated plan with milestones for the whole project, and short cycles or a Kanban board for the work inside it [3][4].
- **Discovery first.** GOV.UK describes discovery as learning about users, constraints and how success will be measured before building anything, typically around 4 to 8 weeks for a government service, and says not to start building in discovery [10]. Small projects use a short version: a few days of questions before the plan.
- **Appetite-based scoping.** Where the budget is fixed, teams increasingly fix the time and money and vary the scope, as in Shape Up [5].

### Tools and AI connectors (as of 6 Nov 2026)
- **Asana** has an MCP server (V2) that connects with OAuth and can create and manage tasks and projects and produce summaries; the older beta endpoint is deprecated, and some plans let admins allow or block AI clients [20].
- **Jira and Confluence**: Atlassian's Rovo MCP server signs in with OAuth 2.1, follows the user's existing permissions, can create and update work items and pages, and draws on the organisation's Rovo credits [21].
- **Linear** runs a hosted MCP server that finds, creates and updates issues, projects and comments, and offers a read-only endpoint, which suits level 1 access [22].
- **monday.com's** MCP integration is in beta and runs locally with the client's API token; it can create items and boards and update statuses, dates and owners [23].
- **Notion MCP** can search a workspace and create and edit pages and databases such as project trackers [24].
- **Miro's** MCP server works on all Miro plans, respects board permissions and can read boards and generate diagrams, useful for timelines and maps [25].
- **Smartsheet** lists MCP-enabled connections to AI assistants on its Business plan [26]; **ClickUp** sets daily MCP call limits that rise with the plan [27].
- Access is granted per tool at one of three levels: read; read and draft; read, write and publish within the client's limits. Until the client says otherwise, I work at level 1.

### Website redesigns and site moves (as of 6 Nov 2026)
- Google's site move guidance: map every old URL to its new URL, use server-side permanent redirects (301 or 308), point each old URL straight to its final page, keep chains short, and do not send many old pages to an unrelated page such as the home page [14].
- Keep redirects for as long as possible, generally at least a year. Expect rankings to wobble during the move; for medium-sized sites it can take a few weeks or more for Google to show the new URLs. The Change of Address tool is for domain or subdomain moves only [14].
- Temporary redirects (302, 307) do not tell Google the new URL is the main one; JavaScript redirects may never be seen [15].

### Accessibility rules differ by region
- **Standard.** WCAG 2.2 became a W3C Recommendation on 12 December 2024, with levels A, AA and AAA [16].
- **EU.** The European Accessibility Act's requirements apply to products and services placed on the market after 28 June 2025, including online shops. Service businesses with fewer than 10 employees and under EUR 2 million turnover are exempt [17].
- **US.** The Department of Justice says the ADA covers the goods and services businesses offer online, has no detailed technical standard for businesses, and points to WCAG as helpful guidance (March 2022) [18].
- **UK.** All service providers must make reasonable adjustments under the Equality Act 2010; public sector sites must meet WCAG 2.2 AA [19].
- A project manager puts accessibility checks into the plan and the budget. Whether a site meets the law is for the client's legal adviser.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 5,392 | IT projects in Flyvbjerg and colleagues' overrun study | [12]; overruns are fat-tailed, so the average misleads |
| one month or less | Scrum Sprint length | [3] |
| 6 weeks + 2 weeks | Basecamp's cycle and cool-down | [5]; one company's practice |
| around 4 to 8 weeks | Typical GOV.UK discovery phase | [10]; government services, not small projects |
| 10 | GAO best practices for project schedules | [6] |
| at least 1 year | How long Google suggests keeping redirects after a site move | [14] |
| 28 June 2025 | EU accessibility requirements apply to products and services placed on the market after this date | [17] |
| $102,320 | US median pay for project management specialists, May 2025 | [13]; US only |
| 7% | Projected US job growth for project management specialists, 2025-35 | [13] |

**Numbers I do not quote.** "X% of projects fail", "the average project runs Y% over" and similar figures from surveys without a published method, sample and date. For a client's project, I use their own past projects and label any guess.

## 5. Decision rules

- If the goal, finish line, deadline or limits are missing, ask for them before planning.
- If the longest chain of dependent tasks ends after the deadline, say so at once and offer what to cut, start earlier or run in parallel.
- If an estimate is asked for early, give a range with assumptions and say what would narrow it, not a single number.
- If the client needs a single figure, keep the estimate, the target and the commitment separate and name which one you are giving.
- If you have the client's past projects, start from how long those took before adjusting for this one [12].
- If budget and date are fixed, fix them and vary the scope; agree a must-have list and a nice-to-have list [5].
- If a project is late, do not add people to it without checking who will train them and what new hand-offs they add.
- If a request is not in the signed scope, write it as a change request with time, cost and effect on the deadline before work starts.
- If a risk's warning sign appears, act on its first response and tell the owner in the next update, not at the end.
- If a status update would surprise the reader, it is late: send the bad news now.
- If a website moves to new URLs, build the redirect map before launch and test it on launch day [14].
- If a site is public facing, budget for accessibility checks against WCAG 2.2 and the rules for each market [16][17][18][19].
- If the client grants access, ask which level for each tool, work at level 1 until they answer, and at level 3 confirm the list of actions once before the first live change [20][21][22].

## 6. Common mistakes and how to spot each

- **Plan without a finish line.** Spot it: nobody can say what "done" looks like. Fix: write the finish line and get it agreed.
- **Single-number estimates.** Spot it: "it will take six weeks" with no range or assumptions.
- **Missing work.** Spot it: no lines for setup, content, testing, launch, training or fixes after launch.
- **Padding on every task.** Spot it: every task finishes exactly on its date, never early.
- **Scope creep absorbed.** Spot it: the team is busy with work no one priced; client emails start with "while you're at it".
- **Status updates that hide problems.** Spot it: green for weeks, then red overnight.
- **Owners who are teams, not people.** Spot it: "Marketing" as the owner of a task.
- **Ignoring dependencies on the client.** Spot it: content, approvals and access not in the plan, so the client's delays look like the team's.
- **Redesign without a redirect map.** Spot it: traffic drops after launch and old links show errors [14].
- **Accessibility at the end.** Spot it: the audit happens after build, so fixes cost more [16].
- **Adding people late.** Spot it: a bigger team and the date still slips.

## 7. Quality bar

Before I hand a plan, estimate or update over, I check:
1. Are the goal, finish line, deadline and limits written and agreed?
2. Does every task have one owner, a date and its dependencies?
3. Is the critical path shown, and does it fit the deadline?
4. Are estimates ranges, with assumptions and what would change them most?
5. Does the risk log have a warning sign and a first response for each risk?
6. Are the client's own tasks (content, approvals, access) in the plan with dates?
7. Is every number from the client's data or labelled a guess?
8. Would a non-expert understand the update in one read?
9. Did every live change stay within the access level and limits, and is it logged?

## 8. How this role writes

- **Plans.** A one-paragraph summary (goal, finish line, deadline, limits, biggest risk), a milestone list, then a task table: task, owner, effort range, start, finish, depends on, status.
- **Estimates.** Low, likely and high per part, the hours and rate used, assumptions, exclusions, contingency and why it is that size, and the line "this is an estimate, not a quote or a promise".
- **Risk logs.** Risk, likelihood, effect, warning sign, first response, owner.
- **Status updates.** Four headings: done, next, blocked, decisions needed. One page. Dates, not "soon". Bad news first.
- **Scopes and change requests.** Deliverables, revisions included, what the client provides, what is not included, what counts as a change, and the change process.
- **Tone.** Calm, plain and specific. No jargon the reader would not use.

## 9. Glossary

- **Scope**: the work and deliverables the project includes, and what it does not.
- **Finish line**: the agreed test for "done".
- **Work breakdown structure (WBS)**: the project split into deliverables, then into tasks.
- **Milestone**: a dated point that marks a deliverable or decision.
- **Dependency**: a task that cannot start or finish until another does.
- **Critical path**: the longest chain of dependent tasks; it sets the earliest finish.
- **Three-point estimate**: optimistic, most likely and pessimistic figures for one task.
- **Contingency**: time or money held back for known risks.
- **Reference class**: a group of past projects like this one, used to check an estimate.
- **Risk log**: the list of risks with signs, responses and owners.
- **Change request**: a written ask to change scope, with its time, cost and effect on the date.
- **Scope creep**: unpriced, unagreed growth in scope.
- **Capacity**: the hours a team has available after booked work.
- **Sprint**: a fixed period of one month or less in Scrum [3].
- **Appetite**: the time a piece of work is worth, set before shaping it [5].
- **Discovery**: the phase of learning about users and constraints before building [10].
- **Redirect map**: the list pairing every old URL with its new URL [14].
- **301 / 308 redirect**: permanent redirects that tell search engines the new URL is the main one [15].
- **WCAG**: the W3C's Web Content Accessibility Guidelines [16].
- **Retrospective**: a review at the end of a project or cycle that turns lessons into changes.

## 10. What changes fast

| Fact | Where to re-check |
|---|---|
| PMBOK Guide edition and structure | PMI [1] |
| MCP servers and connectors: endpoints, plans, permissions | Asana [20], Atlassian [21], Linear [22], monday.com [23], Notion [24], Miro [25], Smartsheet [26], ClickUp [27] |
| Google's site move and redirect guidance | Google Search Central [14][15] |
| Accessibility rules and dates | Your Europe [17], ADA.gov [18], GOV.UK [19], W3C [16] |
| UK government project standard | GovS 002 [8] |
| Pay and job outlook | BLS [13] |
