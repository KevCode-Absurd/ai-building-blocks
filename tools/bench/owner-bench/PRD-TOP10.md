# PRD: the top 10 giant leaps for owner-judged quality

Date: 13 November 2026. Owner: AI Blocks quality programme. Tickets: `TICKETS.md` in this folder.

## 1. Goal

Make every AI Blocks agent the work a business owner would rather pay for than plain Opus, on both e-commerce and general jobs, judged the way the owner judges: on brand, built for my persona, new insight, gaps in my thinking, highest leverage first, clear, correct, usable and with real range.

We improve only what an owner values. Where a rule in our own packs pushes the work away from what the owner wants, the rule goes, however tidy it looks.

## 2. The pre-test

**Set-up.** 22 jobs (12 e-commerce, 10 general), each with a brief and private owner notes. Two arms per job: the agent arm ran with its built pack (`scratchpad/bench/packs-v2/<id>/` for e-commerce, `scratchpad/bench/v3/packs/<id>/` for general); the plain arm was plain Opus as a senior specialist with only the brief. Both followed the same `RULES-DELIVERABLE.md`. Twenty blind judges (5 Claude, 5 OpenAI, 5 DeepSeek, 5 Gemini) compared each pair as the owner, with the owner notes, using `tools/bench/rubrics/OWNER-RUBRIC.md` plus `ECOMMERCE-RUBRIC.md` or `GENERAL-JOB-CHECKS.md`.

### Results

| Suite | Agent wins | Plain wins | Agent share of decided |
|---|---|---|---|
| E-commerce | 186 | 49 | 79.1% |
| General | 111 | 88 | 55.8% |

Per job, agent to plain:

| E-commerce | | General | |
|---|---|---|---|
| J01 Meta budget | 11 to 7 (close) | G01 SEO plan | 17 to 3 |
| J02 TikTok launch | 20 to 0 | G02 Landing page | 16 to 4 |
| J03 Meta ad concepts | 18 to 2 | G03 Investor update | 10 to 10 (tie) |
| J04 UGC scripts | 14 to 6 | G04 Cold email sequence | 10 to 10 (tie) |
| J05 Meta ad copy | 18 to 2 | G05 Job post and scorecard | 10 to 10 (tie) |
| J06 Product page | 13 to 7 | G06 Competitor analysis | 17 to 3 |
| J07 Welcome series | 20 to 0 | G07 Launch plan | 16 to 4 |
| J08 Win-back | 14 to 5 | G08 Pricing | 4 to 16 (lost) |
| J09 90-day plan | 17 to 3 | G09 Content plan | 8 to 11 (lost) |
| J10 Bundles and shipping | 15 to 3 | G10 Onboarding emails | 3 to 17 (lost) |
| J11 Mattress test plan | 7 to 13 (lost) | | |
| J12 WhatsApp COD | 19 to 1 | | |

Average scores, agent vs plain:

| Dimension | General agent | General plain | E-com agent | E-com plain |
|---|---|---|---|---|
| Fit to my case | 8.81 | **9.01** | **9.15** | 8.59 |
| New insight | 8.29 | **8.43** | **8.73** | 8.04 |
| Priorities | 8.49 | **8.57** | **8.94** | 8.22 |
| Reasoning | 8.51 | 8.50 | **8.99** | 7.98 |
| Correct | **8.72** | 8.44 | **8.83** | 8.22 |
| Clear | 8.74 | 8.69 | 8.58 | **8.74** |
| Voice | 8.69 | 8.71 | 8.46 | 8.42 |
| Range | 7.77 | 7.79 | 8.04 | 7.84 |
| Ready to use | **8.46** | 8.10 | **8.62** | 8.17 |
| Overall | 8.34 | 8.32 | **8.76** | 8.04 |

By judge family on general jobs: Claude 35 to 15, OpenAI 28 to 22, DeepSeek 27 to 22, Gemini 21 to 29. Gemini judges most often praised the plain arm for voice and for "acting like an owner".

## 3. Why agents lose or only tie

Method: we read all 868 judge feedback rows (`feedback.jsonl`: strength, mistake, what would make it a 10) and all 434 reasons, unblinded with `key.json`, then read both outputs and the owner notes for G08, G10, G09, G03, G04, G05, J11 and J01. Theme counts below come from keyword matching on the mistake and "make it a 10" fields, so treat them as close, not exact. Per-job counts were checked by hand.

### 3.1 What judges cite most against the agent (both suites)

| Theme | Agent | Plain | Where it bites |
|---|---|---|---|
| Left homework: "To confirm" lists, sign-off asks, open questions | 68 | 19 | 19 of 22 agent outputs end with a "To confirm" list; 2 of 22 plain outputs do |
| Too long or padded | 66 | 25 | Agents land at 98 to 100% of the cap in visible words, and over the cap by raw word count in 15 of 22 jobs (plain: 3 of 22) |
| Voice and customer words | 58 | 28 | Review counts and internal stats pasted into customer copy; persona phrases unused |
| One rule applied everywhere (blanket test design, rule over reality) | 21 | 1 | J11, G09, G04 |
| Owner's priority buried below the first screen | 18 | 6 | G03, G05, J01 |
| A strong lever dismissed or demoted | 15 | 0 | G08 |
| Asks to "commit", "finish", "resolve" in the make-it-a-10 field | 59 | 26 | Every suite |

What agents already do better, and must keep:

| Strength | Agent | Plain |
|---|---|---|
| Judges cite a maths or arithmetic error | 59 | 109 |
| Judges cite an invented or unsupported claim | 23 | 48 |
| Strength praises traced, checkable maths | 143 | 85 |
| Strength praises decision rules, gates, stop rules | 112 | 53 |
| Strength praises a dated plan | 53 | 19 |

### 3.2 The lost and tied jobs, one by one

- **G08 Pricing (4 to 16).** Both arms found the right fix: a flat plan for the leaking 8+ channel group. The agent wrote "Runner-up: offer yearly billing again after signup." and argued it down; 16 of 20 judges named this the mistake, because yearly payers churn 0.9% against 4.0%. Its test ran on "Logged-out visitors only", which cannot show the churn drop the board needs (11 judges). Plain folded the yearly offer into the one recommendation and tested on the at-risk customers with a control group. Cause in the pack: WORK-METHOD's "One recommendation, the runner-up in a line" turned a complementary lever into a rejected alternative, and the pricing skills' gate "New buyers only ... leaves existing customers alone" forced the wrong test audience.
- **G10 Onboarding emails (3 to 17).** All 20 judges cited email 5, "Share one list with one person", sent to everyone although the agent itself quoted sharing's weak 34% retention. Nine flagged subject lines like "Get it out of your head (test: Start with five things)", which break the 45-character rule and are not paste-ready. A stray editor's note, "The copy never mentions the quiet days.", shipped in the copy. Plain kept all five slots on the two retention habits and gated a Pro email to engaged users. Cause in the pack: the lifecycle-email card's "two subject options for key sends" and the email skill's "Write two subject lines per email"; and a softening habit: the agent saw the signal and half-acted on it.
- **G09 Content plan (8 to 11).** The plan was sound, but the success bar was "Above 143, about 3,440 in total", the old average, when the new mix projects about 6,580 installs (15 judges). A school-pickup post went out at 20:30 because evenings save better (7 judges). Four judges flagged "nothing needs review" as too loose. Plain projected the target from the owner's own theme data and tested the pickup post in the afternoon. Cause in the pack: "Working figures ... never as a revenue forecast" and "Never invent actual results" read as "don't project"; and a data rule applied over the persona's real moment.
- **G03 Investor update (10 to 10).** Accurate and candid, but runway was missing from the top three numbers (13 judges) and Customer A's $2.6M loss sat fourth, after the AI-builder section (10 judges). It ended "Assumptions to confirm before sending", which reads as homework (6).
- **G04 Cold email (10 to 10).** Strong copy, but "Load all ~1,900 Controllers and Heads of Finance", with a weaker opener for those with no pricing trigger (16 judges), against the pilot's clear signal. It also stretched the proof into "60 fewer days in close" (6). Plain held untriggered contacts on a watch list.
- **G05 Job post (10 to 10).** The agent caught all three signals, then left a "To confirm" list for an owner who cannot be asked (10 judges), stated hours only in UTC with no Asia-Pacific local times (7), ran long (7), and put internal correlation figures into the public post (2).
- **J11 Mattress test plan (7 to 13).** Found the in-app checkout bug and sized it correctly. Then: "Every test runs 4 full weeks on all traffic, split 50/50", orders per session as the main metric for every test, a 10% lift for each (17 judges). Plain scoped mobile changes to mobile, used add-to-cart for the hero image test and sized each test on its own. Cause in the pack: the store-testing skill's "Primary: orders divided by visitors" plus the order-volume band rule ("The rule is one per band").
- **J01 Meta budget (11 to 7).** Won on Shopify-adjusted profit, but held back a ₹1,82,000 reserve gated at a cost the account was unlikely to hit (14 judges) and ended with "Your yes on the budget changes ... before anything goes live" (10 judges). Cause in the pack: the access-level rules for live actions leaked into the deliverable, plus the "To confirm" habit.

### 3.3 The patterns behind them

1. **Homework instead of decisions.** A "To confirm" list is required by `WORK-METHOD.md`, `QUALITY-ENGINE-v3.md`, `INTAKE.md`, `CLARITY.md`, `lessons-general.md`, `profiles.json`, `cards/_any.md`, the e-commerce house rules and 66 e-commerce skills. In a one-shot job with an owner who cannot answer, every item reads as work handed back.
2. **Signals seen but half-acted on.** In G10, G04, G08 and G05 the agent quoted the very number that should have decided the call, then kept a softened version of the weak option or demoted the strong one. Plain committed.
3. **Rules over the owner.** Several pack rules are sound defaults but became arbitrary when applied without looking at the owner's goal: runner-up lines, two subject options, new-buyers-only price tests, one primary metric per order band, "never forecast", access-level approvals inside a plan.
4. **Process crowds out the owner.** For G08 the agent was pointed at about 13,560 words of method (AGENTS, WORK-METHOD, quality engine, routing, intake, checker, clarity, voice, lessons, card, skill, toolbox, playbook) to answer a 501-word brief. The internal fresh reviewer checks the agent's own `context/spec.md` acceptance tests, not the owner's brief, so it inherits the agent's blind spots.
5. **Writing to the ceiling.** Agents treat the owner's word limit as a target and spend the extra words on method-shaped sections (assumptions, to confirm, how every test runs).
6. **Evidence-stacking in customer copy.** "142 of our 400 reviewers say it's much thinner" and "290 of our reviews mention quiet, smooth wheels" read like reports, not the brand. The proof rules meant for the working were applied to the copy.
7. **Little range.** Range is the lowest dimension in both suites (7.77 and 8.04). The method says "Standard playbook first" and gives light and standard jobs no creative alternative, so most deliverables carry no idea the owner would not have had.

### 3.4 Arbitrary rules found

| Rule (where) | What it did | Override |
|---|---|---|
| "One recommendation, the runner-up in a line" (`packs/shared/WORK-METHOD.md` l.52, `packs/shared/train/AGENTS.md` l.51) | G08: demoted the yearly lever the data most clearly supports | One recommendation may combine complementary moves; a runner-up only for true either/or choices |
| "sign-offs go once in a short To confirm list" and its copies (see pattern 1) | 19 of 22 outputs end with homework | In one-shot work, decide and state the assumption in one line where it matters; no confirmation lists |
| "two subject options for key sends" (`cards/lifecycle-email.md`), "Write two subject lines per email" (`email-marketing-specialist/skills/lifecycle-flow-builder`), similar in `sdr/cold-email-sequence`, `conversion-copywriter/sales-email-sequence`, `cards/outbound-sales.md` | G10: "(test: ...)" inside subject fields | One final line; alternates only when the brief asks, labelled outside the field |
| "New buyers only ... leaves existing customers alone" (`pricing-strategist` skills: price-recommendation, price-test-and-readout, tiers-and-packaging) and "A price-only test keeps the package fixed" (`cards/pricing.md`) | G08: tested on new visitors, so the churn effect is never measured | Test on the people the change is for; new-buyers-only applies to price rises |
| "Primary: orders divided by visitors" and the one-metric-per-order-band rule (`knowledge/ecommerce/skills/design-store-ab-test`, `catalogue-items/ecommerce/store-test-readiness-checker`, `knowledge/ecommerce/cards/CRO.json`) | J11: one blanket design for five different tests | Primary metric at the funnel step the change moves; traffic scoped to who sees it; orders as guardrail |
| "Working figures ... never as a revenue forecast" (`WORK-METHOD.md` l.53) | G09: success bar set at the old average | Projections from the owner's own numbers are welcome, with working and a range; only invented results are banned |
| Access-level "get a yes before the first live action" (`packs/shared/AGENTS.md`) and `READINESS_RULE` in `src/modules/runner/output-policy.ts` | J01: "Your yes ... before anything goes live" inside the plan | Approval rules govern live actions, never the content of a plan |
| "Standard playbook first ... clever additions must earn their place" (`QUALITY-ENGINE-v3.md` rule 4, `CHECKER-v3.md`, `lessons-general.md` lesson 2) | Low insight and range on general jobs | The owner's data first; the playbook is the default when the data says nothing new; one labelled bolder move per plan |

## 4. The 10 giant leaps, ranked by expected gain

Ranking weighs how many verdicts each leap is likely to move across both suites, using the lost and tied jobs and the theme counts above. Several leaps touch the same jobs, so gains overlap.

### Leap 1. Finish the work: no homework in one-shot jobs

**Problem.** 19 of 22 agent outputs end with a "To confirm" list, assumptions to confirm, or a request for the owner's yes; plain does this twice. Judges cite unfinished homework 68 times against 19 for plain, and ask the agent to "commit" or "finish" 59 times against 26. Examples: J01 "Your yes on the budget changes ... before anything goes live" (10 judges: "asks for my sign-off when I said I'm not available"); G05 "To confirm: This hire covers 00:00 to 08:00 UTC ..." (10 judges); G03 "Assumptions to confirm before sending" (6). Same family: the G10 "(test: ...)" subject alternates and the stray editor's note.

**Change.**
- Add a one-shot mode to `marketplace/packs/shared/WORK-METHOD.md` (lines 51 and 77), `packs/shared/tools/quality/QUALITY-ENGINE-v3.md` (rule 1, step 9) and `INTAKE.md` ("One-shot use"): decide every open point with the assumption a top practitioner would pick; state at most three assumptions, one line each, where they change what to do; never ask for confirmation, a yes or a sign-off inside the deliverable.
- Keep approvals where they belong: `packs/shared/AGENTS.md` (access levels) and `READINESS_RULE` in `marketplace/src/modules/runner/output-policy.ts` govern live actions and missing native artifacts, not the content of a plan.
- Remove the "To confirm" pattern from `CLARITY.md`, `lessons-general.md`, `profiles.json` (`_any` shape), `cards/_any.md`, rule 9 of `knowledge/ecommerce/vertical.json`, the 66 e-commerce skills that end with a "To confirm" section, and 3 role skills.
- Make it mechanical: `leakcheck.cjs` and `check-handover.mjs` fail on a "To confirm" heading, "your yes", "sign-off", "(test: ...)" inside a field, and editor notes.

**Dimensions.** Ready to use, priorities, clear.

**How we will know.** 0 of 22 post-test agent outputs carry a confirmation list or approval ask. Homework mentions in judge feedback at or below plain. "Ready" lead over plain grows to at least 0.5 in both suites. J01 and G05 won by 12 or more of 20.

### Leap 2. Read the data like the owner: a signal pass, acted on fully

**Problem.** On general jobs plain scored higher on fit (9.01 vs 8.81), insight (8.43 vs 8.29) and priorities (8.57 vs 8.49). The agent usually saw the signal and then half-acted: G10 kept a sharing email it had just called weak (20 judges); G04 loaded all 1,900 contacts against the trigger signal (16); G08 demoted yearly billing (16); G03 put runway and Customer A below the fold (13 and 10). Meanwhile about 13,560 words of method sit between the agent and a 501-word brief, and the method's first step writes generic acceptance tests rather than reading the owner's numbers.

**Change.**
- Replace the generic acceptance tests in step 0 of `WORK-METHOD.md` with a **signal pass**: the three strongest signals in the owner's data (the winner hiding in an average, the under-used asset, the constraint that shapes timing), each with its number, what it means for the decision, and the exact place the deliverable acts on it.
- Add two rules: complementary levers go into the same recommendation; if the deliverable keeps anything the signals say to cut, it says why in one line with the number.
- Add a one-shot fast path to `QUALITY-ENGINE-v3.md` steps 1 to 3 and `ROUTING.md`: when the brief carries the data and the owner cannot be asked, skip site capture, brand DNA and taste briefs, and read only the card and one skill.

**Dimensions.** Fit, new insight, priorities, reasoning.

**How we will know.** A signal-hit score (each owner note lists three signals; a judge pass marks each output fully, partly or missed) shows the agent at or above plain on every job and at 90% or more fully acted on. General fit, insight and priorities at or above plain.

### Leap 3. Override the arbitrary rules

**Problem.** The rules in section 3.4 directly caused the G08, G10 and J11 losses and weakened G09 and J01. Together those five jobs hold 64 plain votes.

**Change.**
- Rewrite each rule as in the table in section 3.4, in the files named there.
- Add an owner-override clause at the top of `WORK-METHOD.md`: "If a rule in this pack would make the work worse for this owner's stated goal and data, follow the owner and say why in one line."

**Dimensions.** Fit, priorities, reasoning, ready.

**How we will know.** In the post-test, no judge cites a dismissed complementary lever, subject alternates in fields, a test aimed at the wrong group, a blanket test design or a baseline-only target. G08, G10 and J11 each won by 12 or more of 20.

### Leap 4. Measure what the owner is buying

**Problem.** Targets and tests followed a template, not the decision. J11 sized every test the same way (17 judges). G08 tested on new visitors when the gain had to come from existing churners inside two quarters (11). G09 set success at the old average (15). Plain projected from the owner's own numbers and fitted each test to its job.

**Change.**
- `cards/experiment-design.md`: each test specified on its own, with traffic scoped to who sees the change, the primary metric at the funnel step the change moves, and orders or profit as the guardrail when the primary sits earlier.
- `knowledge/ecommerce/skills/design-store-ab-test/SKILL.md`, `catalogue-items/ecommerce/store-test-readiness-checker/SKILL.md` and `knowledge/ecommerce/cards/CRO.json`: the order-band metric becomes a default, not a rule.
- `cards/social-calendar.md` and `cards/onboarding-flow.md`: success targets are projected from the owner's per-theme or per-step numbers, with the working.
- `cards/pricing.md` and the pricing-strategist skills: tests aim at the group the change is for, read on the owner's goal metric and window.

**Dimensions.** Reasoning, correct, priorities, ready.

**How we will know.** Every test in a post-test plan has its own scope, metric, run time and detectable effect. Every success target shows a projection from the owner's numbers. "Blanket" and "weak target" mentions at or below plain.

### Leap 5. Check as the owner, not as the method

**Problem.** The internal fresh reviewer (`tools/blind-review.mjs`) is run with `--brief context/spec.md` and told to check "each acceptance test in the brief". It sees the agent's own framing, so it cannot catch a missed signal, a dismissed lever or a homework list. `CHECKER-v3.md` scores usefulness, clarity, judgment, accuracy and specificity, not the owner's nine dimensions. Nothing in the agent's own check would have flagged G10's sharing email or G08's runner-up.

**Change.**
- `packs/shared/tools/blind-review.mjs`: the sheet takes the owner's original brief and asks the nine owner questions plus three checks:
  - which signals in the data does each draft act on fully, partly or not at all;
  - what is left for the owner to do;
  - which rule was followed against the owner's interest.
- The verdict becomes "which would the owner rather pay for".
- `CHECKER-v3.md`: replace the draft-pool weights with the owner dimensions.
- `QUALITY-ENGINE-v3.md` step 8 and `WORK-METHOD.md` step 5: point at this sheet.

**Dimensions.** All nine, mainly fit, insight and ready.

**How we will know.** On a replay of the 8 lost and tied pre-test pairs, the new sheet picks the plain output (or flags the cited mistake) in at least 6 of 8. Post-test agent share rises in every judge family, Gemini included.

### Leap 6. Write to 85% of the owner's limit

**Problem.** Agents use the whole allowance: visible words reach 98 to 100% of the cap in most jobs, and the raw count (every word, including tables, the way an owner's word processor counts) runs over the cap in 15 of 22 jobs against 3 for plain. Judges cite length or padding 66 times against 25. E-commerce clarity is the one dimension plain wins (8.74 vs 8.58).

**Change.**
- `WORK-METHOD.md` length line: aim at about 85% of the owner's limit, counted as the owner counts; spend no words on method-shaped sections.
- `profiles.json` and `PROFILES.md`: family ceilings at or below 1.1 times plain.
- `packs/shared/tools/quality/wordcount.cjs` and `qe-check.cjs`: add `--raw` and `--limit`; warn at 85%, fail above 95%.

**Dimensions.** Clear, ready.

**How we will know.** 0 of 22 post-test outputs over the limit by raw count. Length mentions at or below plain. E-commerce clarity at or above plain.

### Leap 7. Customer copy in the customer's words, not in evidence

**Problem.** Judges cite voice 48 times against the agent in e-commerce (22 for plain); voice and clarity deltas are negative on J01, J04, J06 and J09. Copy reads like a report: "142 of our 400 reviewers say ...", "290 of our reviews mention ...", correlation figures in a public job post (G05). Several judges asked for the persona's own lines as hooks (J01, J04).

**Change.**
- `packs/shared/tools/quality/VOICE.md`: hooks and headlines come from the persona's own lines where the brief gives them; proof appears as a customer's words or one plain claim; counts stay out of customer copy unless the count is the claim (a rating with its review total); internal analytics never appear in customer- or candidate-facing text.
- Rewrite rule 8 of `knowledge/ecommerce/vertical.json` to match.
- Update `knowledge/ecommerce/skills/write-review-based-ad-copy`, `write-product-page-copy` and `ad-copy-test-sets`.
- `leakcheck.cjs` warns on "N of our reviewers say".

**Dimensions.** Voice, clear, fit.

**How we will know.** E-commerce voice lead over plain of at least 0.3. Zero "N of our reviewers" lines in post-test customer copy. Voice mentions at or below plain.

### Leap 8. The owner's first screen

**Problem.** The owner's named priorities slip below the fold. G03: runway not in the top three (13 judges), Customer A fourth (10). J01: the relaunch of the best ad "is not made the clear first move". G05: the time-zone need was not stated in the candidate's terms. Judges cite buried priorities 18 times against 6.

**Change.**
- `WORK-METHOD.md` step 6 and `QUALITY-ENGINE-v3.md` step 4: the first screen holds the decision, the numbers the owner asked for by name, every piece of bad news, and the first move this week.
- `cards/investor-update.md`: the same as must-haves.
- `CLARITY.md` section 1: point at this rule.

**Dimensions.** Priorities, clear.

**How we will know.** G03 won by 12 or more of 20. Buried-priority mentions at or below plain.

### Leap 9. Persona reality check

**Problem.** Data rules were applied over the persona's real moment. G09 put a school-pickup post at 20:30 because evenings save better (7 judges); G05 gave hours only in UTC for an Asia-Pacific hire (7); J01 and J04 creative did not use the customers' own phrases.

**Change.**
- `WORK-METHOD.md` step 4: check every time, place, unit and channel choice against where the persona actually is, and when a data rule and the persona's moment conflict, follow the persona and say so in one line.
- `cards/job-description.md`: hours in the candidate's local time.
- `cards/paid-social-ads.md` and `cards/creative-brief.md`: the hook comes from the persona's words.

**Dimensions.** Voice, fit.

**How we will know.** No judge cites a timing, place or unit that ignores the persona. Persona mentions at or below plain.

### Leap 10. One idea the owner would not have had

**Problem.** Range is the lowest dimension in both suites (7.77 general, 8.04 e-commerce), and judges ask for "one genuinely unexpected concept" eight times in e-commerce agent feedback. `QUALITY-ENGINE-v3.md` rule 4 ("Standard playbook first ... clever additions must earn their place") and `ROUTING.md` ("Light and standard have no third draft") suppress it.

**Change.**
- `QUALITY-ENGINE-v3.md` rule 4 and step 3, and `ROUTING.md`: every plan or strategy carries one labelled bolder move, sized in the owner's unit, with its first step and the risk, inside the length budget.
- `cards/paid-social-ads.md` and `cards/creative-brief.md`: creative sets differ on at least two of angle, format, persona and hook source, with one bolder concept.

**Dimensions.** Range, new insight.

**How we will know.** Range at 8.3 or more in both suites and at least 0.3 above plain. "Fresh idea" requests in make-it-a-10 at or below plain.

## 5. Guardrails

- **Keep what wins.** Traced maths, profit-based decisions, decision rules and dated plans are the agents' edge (section 3.1). No change may remove the requirement to show working. In the post-test, "correct" must not fall by more than 0.1 in either suite.
- **No teaching to the test.** Pack changes must be general principles. No bench brand, number, persona name or owner-note answer may appear in any pack or skill file. A grep for the 22 bench brand names across `marketplace/packs` and `marketplace/knowledge` must return nothing new.
- **Safety stays.** Live-action approvals, consent, claims and legal rules are unchanged. Only their leakage into plan content changes.

## 6. Out of scope

- Video ads and video production work, including UGC video generation and editing (scripts for video, as in J04, stay in scope).
- Image generation and image-ad rendering.
- Runtime changes to the hosted pipeline beyond the readiness wording, new MCP tools, and the marketplace site.
- New verticals, new agents or new skills, beyond editing the ones named here.
- Judge prompt or rubric changes for the post-test: the yardstick stays fixed.

## 7. Success metric: the post-test

**Same yardstick.**
- The same 20-judge panel (same models, same owner lens), the same 22 briefs and owner notes, and the same rubrics.
- The same judge harness (`tools/bench/owner-judge.mjs`) with fresh blind ordering.
- The agent arm is re-run on packs rebuilt from the changed sources, following `ARMS.md` and `RULES-DELIVERABLE.md` unchanged.
- The plain arm reuses the frozen pre-test plain outputs, so the only thing that changes is the agent. A second plain run on four jobs measures noise.

**Targets.**

| Measure | Pre-test | Target |
|---|---|---|
| General agent share of decided verdicts | 55.8% | 70% or more |
| E-commerce agent share | 79.1% | 80% or more, never below 75% |
| Jobs lost or tied | 4 lost, 3 tied | none; every job 11 or more of 20 |
| G08, G10, J11 | 4, 3, 7 of 20 | 12 or more of 20 each |
| General fit, insight, priorities vs plain | below plain | at or above plain |
| Range, both suites | 7.77 and 8.04 | 8.3 or more |
| Correct | 8.72 and 8.83 | no drop over 0.1 |
| Outputs with a confirmation list or approval ask | 19 of 22 | 0 |
| Outputs over the owner's limit (raw count) | 15 of 22 | 0 |
| Homework and length mentions vs plain | 68 vs 19; 66 vs 25 | at or below plain |
| Owner-note signals acted on fully | not measured | 90% or more, and at or above plain |

**Overfitting check.** Six fresh briefs (three general, three e-commerce) with owner notes written by someone outside the implementation, before any pack change merges. They are run with the old and the new packs against plain on the same panel. The new packs must not lose more than one of the six.

**Ship rule.** Ship when the general and e-commerce share targets and the "no job lost" target are met, "correct" holds, and the held-out set passes. Otherwise ship only the tickets whose effect shows in the per-job results, and rerun.

## Appendix: data used

- Briefs, owner notes, outputs and judge files: `scratchpad/bench/v3/` (`ecom/`, `general/`, `out-ecom-pre/`, `out-gen-pre/`, `judge-ecom-pre/`, `judge-gen-pre/`); copies in this folder.
- Built packs read: `v3/packs/candice-email-marketing`, `osman-subscriptionpricing`, `achieng-content-strategy`, and `packs-v2/gretchen-store-testing`, each with AGENTS.md, WORK-METHOD.md, QUALITY-METHOD.md, OUTPUT-POLICY.md, toolbox.md, the quality engine files, cards and the job skill.
- Word counts: visible words from `tools/quality/wordcount.cjs`; raw words from `wc -w`.
