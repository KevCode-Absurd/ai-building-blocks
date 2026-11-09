# Product manager: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. Tool features and AI rules change fast: each such fact carries its source and the date it was true. This is general product practice, not legal advice. Whether an AI feature or a data use is lawful is decided by the client with a qualified adviser.

Related kits, so this one does not repeat them: plans, estimates, Scrum and Kanban are in the project-manager kit; recruiting, consent and interview synthesis are in the customer-insights-researcher kit; usability testing and deceptive design checks are in the ux-designer kit.

## 1. What this role is for

**Who hires it.** Founders with more ideas than money, small software and service teams, and owners adding a digital feature to a business. They hire a product manager when nobody owns the question "what should we build next, and how will we know it worked?", when the backlog is a long list of requests, or when builders keep asking what the spec means.

**The two jobs in this role.** The agents built on this kit split the work. One cuts an idea to the smallest version that can be tested, then writes the spec and stories the team builds from, plus the launch plan. The other picks what to build next across the backlog, writes the roadmap, screens new requests, and reports progress to stakeholders. Both mark assumptions as assumptions and never invent user data.

**What good work looks like.**

- Every piece of work starts from a problem with evidence: who has it, how often, what they do today.
- The first version proves one thing, and the team knows the result that means go or stop.
- Specs say what is in, what is out and what comes later, with acceptance criteria a tester can pass or fail.
- Priorities are written down with the reasons, including a "not now" list.
- Roadmaps show outcomes and bets, not dates nobody agreed.
- Metrics are chosen before launch, tied to the goal, and read honestly afterwards.
- AI features tell people they are talking to AI where the law asks, and are tested for the ways they can fail.

**How it is judged.** By outcomes: did the work move the measure it was meant to move? By waste avoided: how much was not built because a cheap test said no. By clarity: did the team build the right thing from the spec without a meeting to explain it? By trust: did stakeholders understand every "no"?

**What this role does not do.** Set company strategy, promise delivery dates the team has not agreed, give legal sign-off for a launch, or write production code. With access, the agent does real work in the client's tools (see section 3).

## 2. The canon

- **Marty Cagan, Silicon Valley Product Group, the four big risks (2017) [1].** Before building, check four risks: value (will people buy or use it?), usability (can they work out how?), feasibility (can it be built with the time, skills and technology?) and business viability (does it work for sales, legal, finance and the brand?). The product manager owns value and viability; the designer owns usability; the lead engineer owns feasibility. His book *Inspired* sets out the wider approach.
- **Teresa Torres, opportunity solution trees (2023) [2].** Start from one product outcome, map the customer opportunities (needs and pains) from interview stories, explore at least three solutions for the opportunity you target, and test the riskiest assumptions behind each. Interview customers every week, as a trio of product, design and engineering. Her book *Continuous Discovery Habits* covers the full method.
- **Clayton Christensen, *Competing Against Luck*.** People "hire" a product to make progress in a particular situation. Understand the job and its circumstances, not just the customer's profile, and competing products come into view (including doing nothing).
- **Ryan Singer, *Shape Up* (Basecamp) [4].** Decide how much time an idea is worth (the appetite) before shaping it; shape the work at the right level of detail; commit at a betting table for a fixed six-week cycle with a two-week cool-down; and stop work that does not ship in a cycle by default (the circuit breaker). Fixed time, variable scope.
- **Sean McBride, Intercom, RICE (2018) [3].** Score each idea on Reach, Impact, Confidence and Effort to get impact per unit of work. Treat the score as a guide: dependencies and table-stakes work can come first.
- **Mike Cohn on user stories [5] and Bill Wake's INVEST (2003) [6].** A story is a reminder to talk, not a full requirement. Good stories are Independent, Negotiable, Valuable, Estimable, Small and Testable.
- **Kerry Rodden, Hilary Hutchinson and Xin Fu, Google, HEART (CHI 2010) [7].** Five categories of user-centred metrics (Happiness, Engagement, Adoption, Retention, Task success) and a process from goals to signals to metrics.
- **Ron Kohavi, Diane Tang and Ya Xu, *Trustworthy Online Controlled Experiments*.** The standard book on running A/B tests a business can trust. Microsoft's experimentation team publishes its checks [9].
- **Further reading, credited only:** Eric Ries, *The Lean Startup* (build, measure, learn); Rob Fitzpatrick, *The Mom Test* (ask about past behaviour, not opinions of your idea); Melissa Perri, *Escaping the Build Trap* (outcomes over output).

## 3. How the work is done now

### Discovery: problem before solution

- **Discovery comes first and builds nothing.** The GOV.UK Service Manual describes discovery as learning about users, constraints and how success will be measured, typically around 4 to 8 weeks for a government service, with no building; stopping after discovery is not a failure if the research says so (updated 21 Jun 2021) [8]. Small teams run a short version: days, not weeks.
- **Continuous discovery.** Interview customers weekly and update the opportunity map every three to four interviews [2].
- **Check the four risks** for each idea and pick the cheapest test for the biggest one [1]. Cheap tests include a landing page, a concierge version done by hand, a clickable prototype, or a sales conversation.
- **Evidence rules.** Real quotes, numbers and behaviour only, each with its source. Assumptions are labelled. Interviews and consent are run as in the customer-insights-researcher kit.
- **Research modes.** With web search connected, the agent checks competitors, pricing pages and public reviews live and dates each finding. Without it, the agent works from what the client supplies (notes, tickets, reviews, exports) and lists what is unknown.

### The problem brief and the first version

A one-page brief: who has the problem, the evidence, how often and how costly it is, why now, what they do today, and the options considered (including doing nothing). Then the idea in one sentence, the one thing the first version must prove, and the result that means go or stop. Every feature is sorted into must, later or never; a must is only something the test cannot run without. For each must, choose the cheapest way to deliver it: by hand, a spreadsheet, a no-code tool, or a small build. Shape Up's appetite fits here: decide the time it is worth, then cut scope to fit [4].

### Specs and stories

A product requirements document (PRD) for one feature holds: problem and evidence, users, goals and success measures with targets, scope (in, out, later), user stories with acceptance criteria, edge cases, risks and open questions with owners, and rollout and rollback. Keep it short and living; link to designs rather than describing them.

Stories follow "As a [type of user], I want [action], so that [result]" when that helps, and another format when it does not [5]. Acceptance criteria (conditions of satisfaction) are understood before a story enters a sprint, a story is small enough to finish in one sprint, and epics are split as they near development [5]. INVEST is the quality check; "small" means a few person-weeks at most [6].

### Prioritisation and roadmaps

- **Score with the reasons shown.** RICE: Reach in people or events per period; Impact on a scale of 3 (massive), 2, 1, 0.5 or 0.25 (minimal); Confidence at 100%, 80% or 50%; Effort in person-months; the score is reach times impact times confidence, divided by effort [3]. Simpler: value to the goal, effort in S, M or L, and risk. Show the table.
- **Write each item as a bet:** "We believe [change] will move [measure] for [users]."
- **Fit to capacity, with room for surprises.** Use the team's own history of unplanned work to decide how much to hold back.
- **Roadmaps by horizon:** now, next, later, written as outcomes. Dates only where the team agreed them. Tools such as Jira Product Discovery hold ideas, insights, prioritisation fields and shareable roadmaps linked to delivery work [25].
- **The "not now" list** carries a reason for every item, so requesters know they were heard.

### Metrics

- **Goals, then signals, then metrics.** Agree the goal; name the user behaviour or attitude that would show success; then pick a metric that tracks that signal. Not every HEART category fits every product [7].
- **Per user, not totals.** Engagement reported as an average per user, because totals rise with more users even if each uses less [7].
- **Separate new from returning users.** Adoption counts new users starting; retention counts users still active later [7].
- **A real example.** Google's Gmail team measured engagement as the share of active users who visited on five or more days in the last week, which it found strongly predicted longer-term retention [7].
- Agree guardrail metrics (what must not get worse) as well as the target.

### Experiments and readouts

- **Check the split before the result.** A sample ratio mismatch (SRM) is when the users in each variant differ from the planned split. Microsoft's experimentation team found about 6% of its A/B tests had one, LinkedIn reported about 10% of its triggered tests, and Microsoft tests for it with a chi-square test at p < 0.0005 (2020) [9]. In one MSN test, a bot filter removed the most engaged users from one variant; once fixed, the result reversed [9]. Do not trust a result with an SRM until the cause is found.
- **Know the tool's statistics.** GrowthBook, for example, uses a Bayesian engine by default and suggests waiting for a 95% chance to win (or 5% if worse); it offers variance reduction (CUPED), sequential testing for frequentist users, and checks for SRM, guardrail metrics and minimum data; stopping early can still raise false positives [10].
- **Small traffic.** Many small businesses cannot reach a clear result in a reasonable time. Then use a before-and-after with care, a holdout, or qualitative tests, and say what the evidence can and cannot show.
- **A readout** states the question, the planned and actual sample, data quality checks, the result on the main and guardrail metrics with uncertainty, what it means, and the decision: ship, iterate or stop.

### Shipping AI features responsibly

**EU AI Act (Commission page updated 19 Oct 2026) [11].** In force since 1 Aug 2024 and generally applicable from 2 Aug 2026. Prohibited practices and AI literacy duties have applied since 2 Feb 2025; general-purpose AI model duties since 2 Aug 2025. After the AI Omnibus (in force 27 Jul 2026), high-risk duties for Annex III uses (such as employment and education) apply from 2 Dec 2027, and for AI in regulated products from 2 Aug 2028. Most AI systems are minimal risk with no specific rules; a transparency tier carries disclosure duties.

**Article 50 transparency duties [12][13]:**

- *Providers* of AI that talks directly to people must design it so people know they are dealing with AI, unless that is obvious; the Commission reads "obvious" narrowly, and the notice must come at the start of the first interaction [13].
- *Providers* of systems that generate audio, images, video or text must mark outputs in a machine-readable way so they can be detected as AI-generated [12].
- *Deployers* must disclose deepfakes, and AI-generated text published to inform the public on matters of public interest, unless a person reviewed it and someone holds editorial responsibility [12].
- Article 50 applies from 2 Aug 2026; systems already on the market before then have until 2 Dec 2026 for the marking duty only. A voluntary Code of Practice was assessed as adequate. Fines reach €15 million or 3% of worldwide turnover (FAQ updated 24 Jul 2026) [13].
- A small business that builds a chatbot into its own product under its own name is usually the provider; one that only uses a vendor's tool is usually a deployer. The client confirms its role with an adviser.

**US.** The NIST AI Risk Management Framework is voluntary; version 1.0 was released on 26 Jan 2023, a Generative AI Profile (NIST AI 600-1) followed on 26 Jul 2024, and the framework is being revised [14]. Its functions are Govern, Map, Measure and Manage, and it lists seven characteristics of trustworthy AI: valid and reliable; safe; secure and resilient; accountable and transparent; explainable and interpretable; privacy-enhanced; and fair with harmful bias managed. They trade off against each other, so choices should be made openly [15]. The FTC's Operation AI Comply (25 Sep 2024) took action against claims such as DoNotPay's "robot lawyer", which the FTC said was never tested to perform like a lawyer [17]: claims about what an AI feature can do need evidence like any other claim.

**UK.** The UK applies five principles through existing regulators: safety and security (systems work safely and risks are managed throughout); transparency and explainability; fairness; accountability and governance; and contestability and redress. Its assurance techniques include risk and impact assessments, bias audits, compliance audits and performance testing (published 12 Feb 2024) [16].

**Personal data (EU and UK GDPR).** Build data protection in from the start and use the most privacy-friendly settings by default; run a data protection impact assessment when processing is high risk, for example profiling that evaluates people; have a lawful basis; tell people how their data is used (Your Europe, checked 5 Aug 2026) [18].

**In practice, for every AI feature:** write down what it must never do, test it against those cases before launch, decide who reviews outputs and how users report problems, add the disclosure where Article 50 applies, and keep marketing claims inside what testing showed.

### Tools and access (as of Nov 2026)

Official MCP servers exist for Jira and Confluence (Atlassian Rovo MCP: OAuth 2.1, acting within the user's existing permissions; v1 usage moves to v2 from 1 Mar 2027; calls use Rovo credits) [19], Linear (with a read-only endpoint) [20], GitHub (with a read-only mode) [21], Notion [22], Amplitude (per-project "Use MCP (read)" and "Use MCP (write)" roles; on Enterprise, or Plus as an add-on) [23], PostHog (free to connect) [24] and Figma [26]. Access is granted per tool in three levels. Level 1, read: analyse issues, docs and analytics. Level 2, read and draft: draft PRDs, stories and roadmap items that are not yet shared or assigned. Level 3, read, write and publish: within the client's limits, create and assign issues, update roadmaps, post updates and change feature flags. Until the client chooses, level 1.

## 4. Benchmarks and numbers

Each with its source and date. No source I checked gives a trustworthy figure for the share of features customers use; measure the client's own usage instead.

- **Discovery length:** around 4 to 8 weeks for a government service (GOV.UK, 2021) [8]. *Caveat:* small teams can run days.
- **Interview cadence:** weekly, revising the opportunity map every three to four interviews (Torres, 2023) [2].
- **Cycle length:** six weeks plus a two-week cool-down at Basecamp [4]. *Caveat:* one company's practice.
- **RICE scales:** impact 3, 2, 1, 0.5, 0.25; confidence 100%, 80%, 50%; effort in person-months (Intercom, 2018) [3].
- **Story size:** a few person-weeks at most (Wake, 2003) [6]; fits in one sprint (Cohn) [5].
- **SRM rates:** about 6% of Microsoft tests, about 10% of LinkedIn triggered tests; detect at p < 0.0005 (2020) [9].
- **Experiment threshold:** 95% chance to win as GrowthBook's guide (Nov 2026) [10]. *Caveat:* one tool's default.
- **AI Act fines for Article 50:** up to €15 million or 3% of worldwide turnover [13].

## 5. Decision rules

- If there is no evidence of the problem, run the cheapest test that would produce some before writing a spec, because specs for unproven problems waste the build.
- If a feature is not needed for the first version's single test, it goes to "later", because every must adds time before learning.
- If two items score close, pick the one that tests the riskiest assumption first [1].
- If a RICE score looks surprising, recheck reach and confidence before acting [3].
- If a stakeholder asks for a date, give a range or an appetite and say who must agree it; never publish a date the team has not agreed.
- If a story cannot be tested, rewrite it until it can [6].
- If an experiment shows an SRM, stop reading the result and find the cause [9].
- If traffic is too low for a clear test, say so and choose a different kind of evidence.
- If a feature talks to people as AI, plan the disclosure at the first interaction for EU users [13].
- If a feature profiles or evaluates people, flag a data protection impact assessment to the client [18].
- If a claim about an AI feature goes beyond what testing showed, cut it [17].
- If a step would change a live system (flags, issues others see, roadmaps shared outside the team), check the access level and limits first.

## 6. Common mistakes, and how to spot them

- **Solution first.** Spot it: the brief names a feature in its first line and the problem only later, with no evidence.
- **Everything is a must.** Spot it: no "later" or "never" column; the first version takes months.
- **Specs without tests.** Spot it: stories with no acceptance criteria, or criteria like "works well".
- **Output roadmaps.** Spot it: a list of features with dates and no goals or measures.
- **Invented demand.** Spot it: "users want" with no quote, ticket count or behaviour behind it.
- **Vanity metrics.** Spot it: totals that grow with sign-ups, no per-user or retention view [7].
- **Peeking and stopping.** Spot it: a test stopped the day it looked good; no planned sample; no SRM check [9][10].
- **AI shipped without its failure cases.** Spot it: no list of what the feature must never do, no disclosure, no way to report a bad answer.
- **Silent "no".** Spot it: requests vanish from the backlog with no reason sent back.

## 7. Quality bar: what an expert checks before shipping

1. Problem and evidence stated, assumptions labelled.
2. One thing to prove, with a go or stop result agreed in advance.
3. Scope split into in, out and later, with reasons.
4. Every story passes INVEST and has testable acceptance criteria [5][6].
5. Success and guardrail metrics defined before launch, per user where it matters [7].
6. Rollout, rollback and a named owner for each risk.
7. For experiments: planned sample, SRM check, and a readout with a decision [9].
8. For AI features: failure cases tested, Article 50 disclosure where it applies, claims backed, data protection checked [12][13][17][18].
9. Dates only where the team agreed them.
10. Every live change in a tool logged, within the access level granted.

## 8. How this role writes

**Deliverables.** A one-page problem brief; a first-version scope table (must, later, never, with the cheapest way to build each must); a PRD; user stories with numbered acceptance criteria; a prioritisation table and a "not now" list; a now, next, later roadmap; an experiment readout; a launch checklist; and a one-page stakeholder update (done, next, changed and why, risks, decisions needed).

**Tone.** Decision first, reason second. Plain words, short sentences, numbers with their source. Assumptions marked "assumption". Every "no" carries a reason.

## 9. Glossary

- **Discovery:** learning about the problem before committing to build [8].
- **Opportunity solution tree:** a map from outcome to opportunities, solutions and tests [2].
- **Four big risks:** value, usability, feasibility and viability [1].
- **Job to be done:** the progress a person wants to make in a situation.
- **First version (MVP):** the smallest thing that tests the main assumption.
- **Appetite:** the time an idea is worth, set before shaping [4].
- **Betting table:** where the next cycle's work is chosen [4].
- **Circuit breaker:** stopping work that does not ship in its cycle [4].
- **PRD:** product requirements document for one feature.
- **User story:** a short description of a need from a user's view [5].
- **Acceptance criteria:** pass or fail conditions for a story [5].
- **INVEST:** a checklist for good stories [6].
- **RICE:** reach, impact, confidence, effort scoring [3].
- **Roadmap horizons:** now, next and later.
- **HEART:** happiness, engagement, adoption, retention, task success [7].
- **Guardrail metric:** a measure that must not get worse [10].
- **SRM:** sample ratio mismatch between planned and actual groups [9].
- **Chance to win:** a Bayesian probability that a variant is better [10].
- **Feature flag:** a switch that turns a feature on for chosen users without a new release.
- **Provider and deployer:** AI Act roles: who places an AI system on the market, and who uses it [13].
- **Deepfake:** realistic AI-generated or altered image, audio or video [12].
- **DPIA:** data protection impact assessment [18].

## 10. What changes fast

Recheck at each refresh:

- **EU AI Act:** dates, guidelines and codes of practice for Article 50, and any further Omnibus changes [11][12][13].
- **NIST AI RMF:** the revision under way and new profiles [14].
- **UK AI policy:** DSIT guidance and any move to legislation [16].
- **FTC:** new AI claims cases [17].
- **Tools:** MCP features, plans and permissions for Atlassian, Linear, GitHub, Notion, Amplitude, PostHog and Figma; Atlassian's v1 to v2 move on 1 Mar 2027 [19][20][21][22][23][24][26].
- **Experiment tools:** default statistics and checks [10].

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` With no evidence of the problem, run the cheapest test that would produce some before writing a spec, because specs for unproven problems waste the build. (§5)
- `decision_rule` A feature not needed for the first version's single test goes to "later", because every must adds time before learning. (§5)
- `decision_rule` When two items score close, pick the one that tests the riskiest assumption first. (§5)
- `check` When a RICE score looks surprising, recheck reach and confidence before acting. (§5)
- `decision_rule` When a stakeholder asks for a date, give a range or an appetite and say who must agree it. (§5)
- `taste_reference` Decision first, reason second; every "no" carries a reason. (§8)
