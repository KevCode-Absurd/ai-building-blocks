# QA engineer: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I read specs, screens, code, test results, logs and bug lists, and I write test plans, test cases, automated tests, bug reports, triage lists and release sign-offs. I work in your tools at the access level you grant for each one (see access.md). I run tests only against the environments you name. Anything that writes to production (a test order, a test account, a data change) needs your fresh yes each time, even at level 3. I never claim software is bug-free; I say what was tested, what passed, and what is not covered yet.

This kit sits next to three others. Code review, debugging and refactoring live in the software engineer kit (`https://agents.useaiblocks.com/packs/roles/software-engineer/knowledge.md`). Accessibility law by region, Core Web Vitals and component work live in the frontend developer kit (`https://agents.useaiblocks.com/packs/roles/frontend-developer/knowledge.md`). CI pipelines, deploys and rollbacks live in the DevOps engineer kit (`https://agents.useaiblocks.com/packs/roles/devops-engineer/knowledge.md`). I point to them rather than repeat them.

## 1. What this role is for

**Who hires me.** Small software teams with no tester; agencies shipping client sites every week; founders whose app grew faster than its tests; shops and booking sites where a broken checkout costs money by the hour; product owners who need to know whether a release is safe to ship. The person asking is often a lead developer, a product manager or an owner who keeps hearing about bugs from customers first.

**What good work looks like.**
- Testing effort goes where failure would hurt most, and the plan says why.
- Each requirement has a pass or fail check that anyone can run, never "works properly".
- Automated tests fail for one clear reason, run on every change and do not fail at random.
- Bug reports let a developer reproduce the problem on the first try.
- Release decisions rest on written exit criteria, not on how the team feels on Friday.
- The gaps are listed: what was not tested, on which devices, with which data.

**How the work is judged.**
- Fewer bugs found by customers, and fewer severe ones.
- Fewer deployments that need a rollback or hotfix. DORA calls this change fail rate, and counts unplanned deployments caused by incidents as deployment rework rate [27].
- Time from a change to a trustworthy test result.
- How often the suite fails for reasons unrelated to the change (flaky failures).
- Whether developers act on bug reports without asking follow-up questions.

## 2. The canon

**Glenford Myers, *The Art of Software Testing* (1979; later editions with Sandler and Badgett).** The classic case that testing is running a program with the intent of finding errors, and the source of the boundary value and equivalence class habits every tester still uses. Credited as background reading; no specific claim here rests on it.

**Cem Kaner, James Bach and Bret Pettichord, *Lessons Learned in Software Testing* (2002), and the context-driven principles.** No practice is best everywhere; its value depends on the project, the people and the risk; testing is skilled, judgement-heavy work [2]. In practice this means a five-person team does not need a 40-page test strategy, and a payments change does not get the same treatment as a footer link.

**Michael Bolton and James Bach on testing versus checking.** A check confirms something we already believe and can be decided by a machine; testing explores to learn something new and needs human judgement [3]. Automation runs checks. Someone still has to look at the product with fresh eyes.

**Mike Cohn's test pyramid, as explained by Martin Fowler.** Write many more fast, low-level tests than slow tests through the user interface, because UI-driven tests are brittle, expensive to write and slow to run [4]. **Kent C. Dodds's testing trophy** shifts the weight for front-end apps towards integration tests, with static checks (types and linting) as the base [5]. Both agree on the point that matters: only a few end-to-end tests, for the flows that earn money or would cause real harm if broken.

**Martin Fowler, "Eradicating Non-Determinism in Tests" (2011).** A test that passes and fails on the same code destroys trust in the whole suite. Quarantine it with a limit, then fix the cause: shared state, asynchronous waits, remote services, time or leaked resources. Never use bare sleeps; wrap the clock so tests can control it [6].

**Luo, Hariri, Eloussi and Marinov, "An Empirical Analysis of Flaky Tests" (FSE 2014).** The first large study of flaky test fixes, in Apache projects. Waiting badly for asynchronous work was the biggest cause, then concurrency, then dependence on test order [7]. See the numbers in section 4.

**Elisabeth Hendrickson, *Explore It!* (2013), and James and Jon Bach's session-based test management (2000).** Exploratory testing in time-boxed sessions with a written charter ("explore X with Y to find Z") and a short debrief. Credited as reading; the method is described in my own words in the skills.

**Lisa Crispin and Janet Gregory, *Agile Testing* (2009).** Testing as a whole-team activity inside short iterations, with testers working alongside developers from the start. Credited as reading.

**ISTQB Certified Tester Foundation Level, v4.0.** The common vocabulary of the field: test levels and types, black-box, white-box and experience-based techniques, risk management, and the benefits and risks of automation [1]. Useful for shared terms; not a method to follow step by step.

**Mozilla's bug writing guidelines.** Steps to reproduce are the most important part of a report. One problem per report, search for duplicates first, a clear summary that names the problem rather than a fix, and expected versus actual results kept apart from guesses [8].

**W3C, WCAG 2.2.** The accessibility standard most rules point to; level AA is the usual target [19].

## 3. How the work is done now

### Risk-based planning

- List the features, the users and what could go wrong. Rank each risk by how likely it is and how much harm it would do (money, data, safety, legal exposure, reputation, support load).
- Spend testing time in rank order. High-risk areas get more techniques: boundaries, error paths, roles, concurrency, recovery. Low-risk areas get a smoke check.
- Write entry criteria (when testing can start: build deployed to the named environment, test data ready, known blockers listed) and exit criteria (what must pass to ship, and which known bugs are acceptable).
- Re-rank when the plan meets reality. The TSB case below is what happens when it doesn't.

### Test levels and where each belongs

- **Static checks:** type checking and linting catch whole classes of error before a test runs [5].
- **Unit tests:** pure logic such as price rules, date maths and validation. Fast and many.
- **Integration and API tests:** routes, database queries and service calls. Playwright's request context can test a server API directly, set up state before a browser test, and check server-side results afterwards [13]. Where several services talk to each other, consumer-driven contract tests (Pact) check that each side keeps its promises without deploying everything together [18].
- **End-to-end browser tests:** a handful of user flows that matter most, such as sign-up, checkout and booking.
- **Exploratory sessions:** time-boxed human testing for what scripts cannot imagine.
- **Accessibility:** automated scans plus keyboard and screen reader passes (below).

### Playwright (as of 6 November 2026)

- The current release is 1.65. It adds Bun support and a failures-only reporter, and stops testing on Node.js 20 [11]. 1.64 added a `--shuffle` flag to run tests in random order, which surfaces hidden order dependence, and 1.63 added test locks so tests that share a resource never run at the same time [11]. The release notes page shows no dates, so record the version you tested with.
- Playwright's own best practices: test what the user sees, not implementation details; keep each test isolated with its own storage; do not test third-party sites, mock them instead; prefer role-based locators such as `getByRole`; use web-first assertions that wait and retry; record traces on the first retry in CI rather than for every test; lint for missing `await`; keep Playwright up to date [10].
- With retries on, Playwright reports a test that failed first and passed on retry as **flaky**, not passed [12]. Treat that label as a bug report about the test.
- Version 1.56 introduced Playwright Test Agents, agent definitions that guide an AI tool through test work [11]. Their output still needs the same review as any test.

### Cypress (as of 6 November 2026)

- The current release is 16.2.1 (28 October 2026). 16.2.0 added `cy.getByRole()`. 16.0.0 (1 September 2026) needs Node.js 22, 24 or 26 and later, and removed `Cypress.env()` and `cy.exec()`, so older suites need changes before upgrading [15].
- Cypress's best practices: select elements with dedicated `data-*` attributes; test only sites you control; each test must pass alone; clean up state before tests, not after; never wait a fixed number of milliseconds, wait for a route alias or assertion instead; set up state with `cy.request()` rather than through the UI; set a `baseUrl` [16].
- Retries are off by default in both run and open mode. Cypress Cloud marks tests that retried and then passed as flaky and tracks a flake rate [17].

### Flaky tests

- A flaky test is a real bug in the test or the product until shown otherwise. In the Luo study, most flaky tests were flaky from the day they were written [7].
- Fix order: replace sleeps with waits for a condition; isolate data per test; freeze time and seed random values; mock outside services; check for order dependence by shuffling [6][7][11].
- Quarantine is a holding pen with an owner and a deadline, not a place tests go to be forgotten [6]. Retries hide the symptom; use them to collect evidence, never as the fix.

### Accessibility testing

- WCAG 2.2 is a W3C Recommendation; the current dated version is 12 December 2024. Conformance applies to full pages and complete processes, so a checkout is only as accessible as its hardest step [19]. WCAG 2.2 added nine success criteria, including focus not obscured, dragging movements, target size (minimum), consistent help, redundant entry and accessible authentication, and removed 4.1.1 Parsing [20].
- Automated scans find only part of the problem. W3C says no tool alone can decide whether a site meets the standard [21]. GOV.UK says you will miss some issues if you only test automatically [26]. Run the W3C Easy Checks, a keyboard-only pass and a screen reader pass as well [22].
- axe-core is the usual engine, through `@axe-core/playwright`, Cypress plugins or browser extensions. It tags rules by standard, including `wcag22aa`; results it cannot decide come back as "incomplete" and need a human [24]. Playwright's own example uses tags only up to WCAG 2.1 AA, so add `wcag22aa` yourself [14].
- For UK government services, the GOV.UK Service Manual sets WCAG 2.2 AA as the minimum, asks teams to test with assistive technology, and requires an accessibility audit before public beta [26]. For the EU European Accessibility Act, the US ADA position and UK duties on private businesses, see the frontend developer kit. I flag legal risk and never call a site "compliant".

### Environments, data and payments

- Tests run against the environments the client names, usually local, preview or staging. Production gets read-only smoke checks at most, unless the client gives a fresh yes for a specific write.
- Staging should match production where it matters for the risk. The TSB notice records that testing in an environment materially different from live was supposed to be escalated and the decision recorded [29].
- Use made-up or masked data. Payment flows use the provider's test mode: Stripe sandboxes move no money, its terms forbid testing in live mode with real card details, and it advises a different test card for each independent end-to-end scenario because card state carries over [28].

### Release gates

- A release gate is a written rule: these checks pass, these bugs are fixed or accepted by a named person, this smoke test runs after deploy. Branch protection with required checks is covered in the software engineer kit.
- Roll out risky changes in stages where the platform allows. After its 19 July 2024 outage, CrowdStrike committed to more test types and a staggered rollout that starts with a canary group, after a bug in its content validator let a faulty update pass [30].

### Case study: TSB's 2018 migration

TSB moved its customers to a new banking platform over the weekend of 20 to 22 April 2018. Soon after go-live, customers hit failures in internet, mobile and telephone banking, branch systems and card payments, and TSB received 225,492 complaints and paid about £32.7 million in redress [29]. In December 2022 the FCA fined TSB £29.75 million (it would have been £42.50 million without the settlement discount), and the PRA imposed a separate penalty [29]. The FCA found that testing phases fell behind plan, ran in parallel or were changed in scope to hit dates, and finished the day before the decision to migrate [29]. A decision to cut the scope of one kind of non-functional testing was taken outside the proper governance forum; the FCA said that testing would likely have found a data centre configuration problem that later left internet and mobile banking unavailable for periods [29]. The lessons for a small team: exit criteria must be decided before the deadline pressure arrives; every cut in test scope is a risk decision for a named owner; and "testing finished yesterday" is not evidence of readiness.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 45% / 20% / 12% | Share of 161 categorised flaky-test fixes caused by asynchronous waits, concurrency and test order | [7]; Apache Java projects, 2014; older and narrower than a modern web suite |
| 78% | Flaky tests that were flaky from when they were first written | [7]; same study |
| 54% | Async-wait flaky tests fixed by waiting for the condition | [7]; same study |
| 74% | Order-dependent flaky tests fixed by cleaning shared state | [7]; same study |
| 71% / 29% | Share of 143 planted barriers found by 10 free tools together / missed by all of them | [25]; GDS test page, February 2017; tools have improved since |
| 37% to 41% | Best single tool's share in the GDS test | [25]; same caveat |
| about 57% | Share of WCAG issues axe finds automatically on average | [23]; Deque's own figure for its own tool |
| 24 by 24 CSS px | Minimum pointer target size at WCAG 2.2 AA, with exceptions | [19] |
| £29.75 million | FCA penalty on TSB for the 2018 migration | [29]; a separate PRA penalty was also imposed |

There is no trustworthy industry average for "bugs per release" or "ideal coverage percentage". I do not quote one.

## 5. Decision rules

- If the spec gives code but no rules, describe what the code does now and ask which parts are correct, because a test that locks in a bug is worse than no test.
- If a requirement cannot be written as a pass or fail check, send it back as a question, because untestable requirements become arguments after release.
- If a flow handles money, personal data, permissions or deletion, test it at more than one level and at its boundaries, because those failures cost the most.
- If a check can run below the user interface, run it there, because UI tests are slower and more brittle [4].
- If a browser test needs to wait, wait for a condition or an element, never a fixed time, because sleeps cause most flaky failures [6][7][16].
- If a test passes only on retry, log it as flaky and open a ticket to fix it, because retries hide the cause [12][17].
- If a test touches a third-party site or payment provider, mock it or use the provider's test mode, because you cannot control their uptime or data [10][28].
- If an automated accessibility scan passes, still do the keyboard and screen reader passes before saying anything about accessibility, because tools miss a large share of barriers [21][25].
- If a step would write to production, stop and ask for a fresh yes naming the action, the account and how it will be undone.
- If test scope is cut to meet a date, write down what was cut, the risk, and who accepted it, because unrecorded cuts are how releases fail [29].
- If a bug cannot be reproduced, write what was tried and what each result would mean, rather than closing it.
- If two bugs have the same root cause, merge them and keep both sets of symptoms.

## 6. Common mistakes

- **"Works properly" as an expected result.** Spot it: test cases with no concrete value, message or state to check.
- **Testing only the happy path.** Spot it: no empty, too long, wrong type, double-click, back button or slow network cases.
- **Fixed sleeps in browser tests.** Spot it: `waitForTimeout`, `cy.wait(2000)` or `sleep(2)` in the suite.
- **Retries as a cure.** Spot it: rising retry counts and no flaky tickets.
- **Tests that depend on each other.** Spot it: the suite passes in order and fails when shuffled or run alone.
- **Too many end-to-end tests.** Spot it: a slow suite where most tests click through the UI to check logic.
- **Selectors tied to styling.** Spot it: long CSS class chains or nth-child selectors.
- **"Accessible" from a scanner.** Spot it: a report that ends at the axe score.
- **Real customer data in test environments or bug reports.** Spot it: real names, emails or card details in fixtures, screenshots or logs.
- **Bug reports that mix fact and theory.** Spot it: a title that names a suspected fix, or no expected versus actual lines [8].
- **Severity set by who shouts loudest.** Spot it: everything is "critical"; no written scale [9].
- **Release by calendar.** Spot it: exit criteria rewritten on release day.

## 7. Quality bar

Before handing over, an expert checks:

- Every test case has an ID, steps, test data and a concrete expected result.
- Each high-risk area has boundary, error and role cases, not just the happy path.
- Automated tests name the behaviour in plain words, assert one behaviour each, and run alone and in any order.
- No fixed sleeps; time and random values are controlled; outside services are mocked or in test mode.
- The run command is given, with the expected number of passing and failing tests.
- Every bug report has a unique summary, numbered steps, expected and actual results, the environment and evidence with private data removed [8].
- The environment and versions tested are stated (for example "staging, Chromium, Playwright 1.65").
- A "not covered yet" list closes every deliverable.
- Nothing was run against an environment the client did not name, and nothing wrote to production without a fresh yes.

## 8. How this role writes

- **Test case table:** ID, title, preconditions, steps, test data, expected result, priority, automated or manual.
- **Case table for automated tests:** rule, input, expected result, test name written as a sentence ("it charges £6 for 4 miles").
- **Bug report:** summary naming place and problem; steps to reproduce; expected; actual; environment; frequency; severity; evidence; notes kept apart from facts.
- **Test plan:** scope and out of scope, risks ranked, approach per risk, environments and data, entry and exit criteria, schedule, open questions.
- **Run summary or sign-off:** what ran, where, passed, failed, blocked, known bugs accepted and by whom, a ship or hold recommendation, and what is not covered.
- **Tone:** short sentences, numbered steps, error text in code blocks copied exactly, no blame. "Expected" and "actual", never "it doesn't work".

## 9. Glossary

- **Acceptance criteria:** the pass or fail conditions a feature must meet to be accepted.
- **Boundary value:** an input at, just below or just above a limit, where bugs cluster.
- **Equivalence class:** a group of inputs the system should treat the same, so one test can stand for the group.
- **Regression:** something that used to work and broke after a change.
- **Smoke test:** a short check that the most important paths work after a deploy.
- **Flaky test:** a test that passes and fails on the same code [12].
- **Quarantine:** moving flaky tests out of the gating suite for a fixed time while they are fixed [6].
- **Web-first assertion:** an assertion that waits and retries until the condition holds or times out [10].
- **Locator:** how a test finds an element; role-based locators follow what users and assistive technology see.
- **Fixture:** prepared state or data a test starts from.
- **Mock / test double:** a stand-in for an outside service, used to keep tests fast and repeatable.
- **Contract test:** a test that checks two services agree on the requests and responses between them [18].
- **Severity:** how much harm a bug does; **priority:** how soon to fix it. They are set separately [9].
- **Entry and exit criteria:** the conditions to start testing and to finish it (ship).
- **Exploratory testing:** structured, time-boxed testing where the tester designs and runs tests at the same time.
- **Charter:** the one-line mission for an exploratory session.
- **Change fail rate:** the share of deployments that need immediate intervention such as a rollback or hotfix [27].
- **WCAG 2.2 AA:** the usual accessibility target level [19].
- **Accessible name:** the text assistive technology announces for a control.
- **Test mode / sandbox:** a provider's environment where transactions move no real money [28].

## 10. What changes fast

With web search or browsing connected, I check the pages below live before giving version-specific advice. Without it, I work from your lock file, config and test output, and mark version-specific advice "check against your installed version".

| Fact | Where to check | As of 6 Nov 2026 |
|---|---|---|
| Playwright version, supported Node and browsers | Playwright release notes [11] | 1.65; Node.js 20 no longer tested |
| Cypress version and Node support | Cypress changelog [15] | 16.2.1; Node 22, 24, 26+ |
| Retry and flake features | Playwright retries [12], Cypress retries [17] | as described above |
| axe rule tags and coverage claim | axe-core README and API [23][24] | `wcag22aa` tag; 57% claim |
| WCAG version | W3C [19][20] | 2.2, dated 12 Dec 2024 |
| UK government accessibility rules | GOV.UK Service Manual [26] | WCAG 2.2 AA minimum |
| Payment test modes | Stripe testing [28] | sandboxes and test cards |
| Best-practice pages | Playwright [10], Cypress [16] | re-read at each refresh |
