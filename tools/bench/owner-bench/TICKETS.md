# Tickets: top 10 giant leaps

These tickets carry out `PRD-TOP10.md` in this folder. They are split into five groups, A to E. Each group owns its files outright, so five implementers can work at once without touching the same file. Group F (bench) starts with F1 at once and runs the post-test after A to E merge.

All paths are under `ai-building-blocks-rag/` unless marked otherwise. Run `npm test` in `marketplace/` locally before you hand over; there is no CI. Work on your own branch or worktree per group.

## Shared words (use them the same way in every group)

- **One-shot job:** the owner gave everything in the brief and cannot answer questions.
- **Signal pass:** the three strongest signals in the owner's data, each with its number, what it means for the decision, and where the deliverable acts on it.
- **Act fully:** if the deliverable keeps anything a signal says to cut, it says why in one line with the number.
- **Assumption line:** one line, only where it changes what to do; at most three in a deliverable; never a request for the owner's yes.
- **Bolder move:** one labelled idea beyond the standard playbook, sized in the owner's unit, with its first step and its risk, inside the length budget.
- **Owner's limit:** the word limit in the brief, counted the way the owner counts it (every word, tables included).

## Rules for every ticket

- Write general principles. Never put a bench brand, number, persona name or owner-note answer into a pack or skill file.
- Keep traced maths, profit-based decisions, decision rules and dated plans. No edit may weaken "show the working".
- Leave safety, consent, claims and live-action approval rules intact. Only their leakage into plan content changes.
- Plain English, grade 8 to 9, no em dashes.

## File ownership

| Group | Implementer | Files it owns (no other group edits these) |
|---|---|---|
| A. Method spine | 1 | `marketplace/packs/shared/WORK-METHOD.md`, `marketplace/packs/shared/AGENTS.md`, `marketplace/packs/shared/train/AGENTS.md`, `marketplace/packs/shared/tools/quality/QUALITY-ENGINE-v3.md`, `.../quality/INTAKE.md`, `.../quality/ROUTING.md`, `marketplace/src/modules/runner/output-policy.ts`, the inline `"WORK-METHOD.md"` outline in `marketplace/src/modules/packs/build.ts` (about lines 398 to 406 only), `marketplace/test/method-core.test.ts`, `marketplace/test/packs-grounded.test.ts`, `marketplace/test/output-policy.test.ts` |
| B. Reader and editor rules | 2 | `.../quality/CHECKER-v3.md`, `.../quality/CLARITY.md`, `.../quality/VOICE.md`, `.../quality/lessons-general.md`, `.../quality/profiles.json`, `.../quality/PROFILES.md`, `.../quality/cards/_any.md`, `marketplace/packs/shared/tools/blind-review.mjs`, new `marketplace/test/blind-review-owner.test.ts` |
| C. Mechanical checks | 3 | `.../quality/leakcheck.cjs`, `.../quality/wordcount.cjs`, `.../quality/qe-check.cjs`, `marketplace/packs/shared/tools/check-handover.mjs`, `marketplace/test/check-handover.test.ts`, `marketplace/test/quality-engine-v31.test.ts`, new `marketplace/test/owner-finish-checks.test.ts` |
| D. Family cards and general role skills | 4 | `.../quality/cards/` files: `lifecycle-email.md`, `outbound-sales.md`, `pricing.md`, `experiment-design.md`, `social-calendar.md`, `onboarding-flow.md`, `investor-update.md`, `job-description.md`, `paid-social-ads.md`, `creative-brief.md`; `marketplace/packs/roles/pricing-strategist/skills/{price-recommendation,price-test-and-readout,tiers-and-packaging}/SKILL.md`; `marketplace/packs/roles/email-marketing-specialist/skills/lifecycle-flow-builder/SKILL.md`; `marketplace/packs/roles/sdr/skills/cold-email-sequence/SKILL.md`; `marketplace/packs/roles/conversion-copywriter/skills/sales-email-sequence/SKILL.md`; the three role skills with a "To confirm" section (`communications-coordinator/skills/newsletter-and-notices`, `compliance-specialist/skills/regulation-to-checklist`, `data-quality-analyst/skills/data-dictionary-and-glossary`) |
| E. E-commerce knowledge | 5 | `marketplace/knowledge/ecommerce/vertical.json`, `marketplace/knowledge/ecommerce/skills/*/SKILL.md`, `marketplace/knowledge/ecommerce/cards/CRO.json`, `catalogue-items/ecommerce/store-test-readiness-checker/SKILL.md`, `marketplace/test/knowledge.test.ts` |
| F. Bench | any, after its group | new files under `tools/bench/owner-bench/scripts/`, `tools/bench/owner-bench/heldout/`, and post-test output folders in `tools/bench/owner-bench/` |

`...` means `marketplace/packs/shared/tools`. Inside a group, tickets touch the same files, so do them in order.

---

## Group A. Method spine (implementer 1)

### A1. One-shot finish mode: no homework in the deliverable

- **Leaps:** 1.
- **Files:**
  - `marketplace/packs/shared/WORK-METHOD.md` (lines 51 and 77);
  - `.../quality/QUALITY-ENGINE-v3.md` (rule 1, step 9);
  - `.../quality/INTAKE.md` ("One-shot use");
  - `marketplace/packs/shared/AGENTS.md` (access levels);
  - `marketplace/src/modules/runner/output-policy.ts` (`READINESS_RULE`);
  - `marketplace/test/method-core.test.ts` (line 42 pins the "To confirm" wording);
  - `marketplace/test/output-policy.test.ts`.
- **Acceptance criteria:**
  - WORK-METHOD.md has a short "One-shot jobs" rule: decide every open point with the assumption a top practitioner would pick, write at most three assumption lines, and never ask for confirmation, a yes, a sign-off or a choice inside the deliverable.
  - No sentence in A's files tells the agent to add a "To confirm" list or box.
  - Where law or a platform needs a sign-off (for example permission to quote a customer), it is one line next to the item it affects.
  - AGENTS.md says approval rules govern live actions in the client's tools and never appear as approval requests inside a plan or copy.
  - `READINESS_RULE` keeps blocked handoffs for missing native artifacts or tools. For missing facts in a one-shot job, it says to state the assumption and finish.
  - Updated tests pass. `grep -n "To confirm"` over A's files returns only the new negative wording.
- **Depends on:** none.

### A2. Signal pass and the one-shot fast path

- **Leaps:** 2.
- **Files:** `WORK-METHOD.md` (steps 0, 1 and 3), `QUALITY-ENGINE-v3.md` (steps 1 to 3), `ROUTING.md`, the inline outline in `marketplace/src/modules/packs/build.ts`.
- **Acceptance criteria:**
  - Step 0 replaces "5 to 7 acceptance tests" with the signal pass (shared words). It keeps one line each on the deliverable's count and format.
  - Two rules are written out:
    - complementary levers go into the same recommendation;
    - "act fully" as defined above.
  - The fast path: for a one-shot job whose brief carries the data, skip site capture, brand DNA, the taste brief and library reading, and read the card plus one skill.
  - Required reading for a one-shot job (AGENTS.md, WORK-METHOD.md, the QUALITY-ENGINE-v3.md sections it points to, one card, one skill) totals under 6,000 visible words in a rebuilt pricing-strategist pack. Today it is about 13,560.
  - The build.ts outline matches the new step 0. `marketplace/test/packs-grounded.test.ts` is updated and passes.
- **Depends on:** A1 (same files).

### A3. Override the arbitrary core rules

- **Leaps:** 3, 4.
- **Files:** `WORK-METHOD.md` (lines 52 and 53, and a new first paragraph), `marketplace/packs/shared/train/AGENTS.md` (line 51), `QUALITY-ENGINE-v3.md` (rule 4, "Expert edge", step 2).
- **Acceptance criteria:**
  - "Decide" reads: one recommendation, which may combine complementary moves; name a runner-up only when the options truly exclude each other.
  - Projections from the owner's own numbers are encouraged, with working and a range, and labelled as projections. Only invented results stay banned.
  - Owner-override clause at the top of WORK-METHOD.md: "If a rule in this pack would make the work worse for this owner's stated goal and data, follow the owner and say why in one line."
  - Rule 4 becomes "the owner's data first; the standard playbook is the default when the data says nothing new".
  - Tests pass.
- **Depends on:** A2.

### A4. The owner's first screen, persona reality and length

- **Leaps:** 6, 8, 9.
- **Files:** `WORK-METHOD.md` (step 4 "Be specific" and "Length follows use", step 6), `QUALITY-ENGINE-v3.md` (rule 3, step 4).
- **Acceptance criteria:**
  - The first screen holds the decision, the numbers the owner asked for by name, every piece of bad news, and the first move this week.
  - Persona check: each time, place, unit and channel choice is checked against where the persona actually is. When a data rule and the persona's moment conflict, follow the persona and say so in one line.
  - Length: aim at about 85% of the owner's limit, counted as the owner counts. Never add sections about method, assumptions or how the work was made to fill space.
- **Depends on:** A3.

### A5. One bolder move (range)

- **Leaps:** 10.
- **Files:** `QUALITY-ENGINE-v3.md` (rule 4, step 3), `ROUTING.md` (light and standard depths).
- **Acceptance criteria:**
  - Every plan, strategy or recommendation carries one labelled bolder move (shared words).
  - Light and standard depths still make no third draft, but the expert draft must include the bolder move.
  - Creative sets differ on at least two of angle, format, persona and hook source.
- **Depends on:** A3.

---

## Group B. Reader and editor rules (implementer 2)

### B1. The fresh reader judges as the owner

- **Leaps:** 5.
- **Files:** `marketplace/packs/shared/tools/blind-review.mjs`, `.../quality/CHECKER-v3.md`, new `marketplace/test/blind-review-owner.test.ts`.
- **Acceptance criteria:**
  - The usage text says `--brief` takes the owner's original brief, never `context/spec.md`.
  - `sheet()` asks the nine owner questions from `tools/bench/rubrics/OWNER-RUBRIC.md` in plain words, plus three checks:
    - which signals in the data each draft acts on fully, partly or not at all;
    - what is left for the owner to do (questions, sign-offs, alternates, placeholders);
    - which rule was followed against the owner's interest.
  - The verdict line asks which draft the owner would rather pay for. The existing `VERDICT:` and `GRAFT:` format and the two-order tally stay unchanged.
  - CHECKER-v3.md replaces the draft-pool weights (usefulness 25%, clarity 20% and so on) with the nine owner dimensions.
  - The new test checks the sheet text and that `verdictOf` still parses.
  - Replay check: on the 8 lost or tied pre-test pairs, run with the owner brief, the sheet's three checks surface the mistake judges cited most in at least 6 of 8. Record the result in the PR.
- **Depends on:** none.

### B2. Length aims in the family profiles

- **Leaps:** 6.
- **Files:** `.../quality/profiles.json`, `.../quality/PROFILES.md`.
- **Acceptance criteria:**
  - Every family `ceiling` is 1.1 or less.
  - The `_any` shape no longer ends with "one short To confirm box".
  - PROFILES.md says the owner's limit wins over any family ratio, with about 85% as the aim.
  - `marketplace/test/quality-engine-v3.test.ts` still passes. It checks only that the file exists; do not edit it.
- **Depends on:** none.

### B3. Customer words, not evidence

- **Leaps:** 7, 1.
- **Files:** `.../quality/VOICE.md`, `.../quality/CLARITY.md`.
- **Acceptance criteria:**
  - VOICE.md writer rules:
    - hooks and headlines come from the persona's own lines when the brief gives them;
    - proof appears as a customer's words or one plain claim;
    - counts such as "N of our reviewers say" stay out of customer copy unless the count is the claim (a rating with its review total);
    - internal analytics (correlations, conversion rates, cohort tables) never appear in customer- or candidate-facing text.
  - CLARITY.md section 7 drops "Open items go in one short To confirm box" and says to decide open items with an assumption line. Section 1 points to the first-screen rule.
- **Depends on:** none.

### B4. Lessons and the generic card

- **Leaps:** 1, 2, 10.
- **Files:** `.../quality/lessons-general.md`, `.../quality/cards/_any.md`.
- **Acceptance criteria:**
  - Lesson 1 no longer lists the "To confirm" box as a winning pattern.
  - Lesson 2 becomes "owner's data first, playbook as default".
  - Two new lessons, each with "Won" and "Avoid":
    - act fully on the signal (the half-measure is the loss);
    - finish one-shot work (no homework).
  - The `_any.md` SHAPE has no "To confirm" box and gains the bolder-move line.
- **Depends on:** none.

---

## Group C. Mechanical checks (implementer 3)

### C1. Homework and leftover detector

- **Leaps:** 1, 3.
- **Files:** `.../quality/leakcheck.cjs`, `marketplace/packs/shared/tools/check-handover.mjs`, `marketplace/test/quality-engine-v31.test.ts`, `marketplace/test/check-handover.test.ts`, new `marketplace/test/owner-finish-checks.test.ts`.
- **Acceptance criteria:**
  - New hits for:
    - a heading or bold label "To confirm", "Open questions" or "Questions for you";
    - "your yes", "sign-off", "sign off", "please confirm", "before anything goes live";
    - "(test:" inside a line that starts with Subject, Headline or Preview;
    - a "Runner-up:" label;
    - editor stage notes, meaning a sentence about "the copy", "this draft" or "this email" that addresses the writer, not the reader.
  - `--requested-template` and a new `--options-requested` flag let alternates pass when the brief asks for them.
  - On the frozen pre-test outputs in `tools/bench/owner-bench/out-*-pre/`:
    - at least 18 of the 19 agent outputs with a "To confirm" section are flagged;
    - J01 "Your yes", the G10 "(test:" lines and G10 "The copy never mentions" are flagged;
    - no more than 3 plain outputs are flagged in total.
  - Fixtures for these cases live in the new test.
- **Depends on:** none.

### C2. Word count against the owner's limit

- **Leaps:** 6.
- **Files:** `.../quality/wordcount.cjs`, `.../quality/qe-check.cjs`, `marketplace/test/owner-finish-checks.test.ts`.
- **Acceptance criteria:**
  - `wordcount.cjs --raw` counts whitespace-separated tokens like `wc -w`. `--limit N` prints the share of the limit.
  - `qe-check.cjs --limit N` warns at 85% and fails above 95% on the raw count. The default visible-word behaviour is unchanged.
  - On the frozen pre-test outputs it fails the 15 agent outputs over the raw limit (G08 agent: 1,060 raw words against 1,000) and passes the plain outputs that are under the limit.
- **Depends on:** C1 (same test file).

### C3. Evidence-stack warning for customer copy

- **Leaps:** 7.
- **Files:** `.../quality/leakcheck.cjs`, `marketplace/test/owner-finish-checks.test.ts`.
- **Acceptance criteria:**
  - A warning (not a failure) for "N of (our) M reviewers/reviews/customers say/mention" and for correlation figures in quoted or customer-facing copy.
  - It flags the J06 and J03 agent outputs.
  - It does not flag "4.5 stars from 20,000+ reviews".
- **Depends on:** C2.

---

## Group D. Family cards and general role skills (implementer 4)

### D1. One final subject line

- **Leaps:** 3, 1.
- **Files:**
  - `.../quality/cards/lifecycle-email.md` (must-have 2);
  - `.../quality/cards/outbound-sales.md` (must-have 4 and SHAPE);
  - `marketplace/packs/roles/email-marketing-specialist/skills/lifecycle-flow-builder/SKILL.md` (step 4);
  - `marketplace/packs/roles/sdr/skills/cold-email-sequence/SKILL.md`;
  - `marketplace/packs/roles/conversion-copywriter/skills/sales-email-sequence/SKILL.md`.
- **Acceptance criteria:**
  - Each email gets one final subject line by default.
  - When the brief asks for options, they are labelled options outside the subject field, each within the brief's character limit.
  - No file asks for alternates by default.
- **Depends on:** none.

### D2. Pricing: bundle levers, test on the right people

- **Leaps:** 3, 4.
- **Files:** `.../quality/cards/pricing.md` and `marketplace/packs/roles/pricing-strategist/skills/{price-recommendation,price-test-and-readout,tiers-and-packaging}/SKILL.md`.
- **Acceptance criteria:**
  - Test audience rule: test on the people the change is for. New-buyers-only applies to price rises. An opt-in plan or offer aimed at existing customers is tested on them against a control group.
  - The recommendation may combine billing, packaging and price moves that serve the same goal.
  - Card must-haves 1 and 2 (cost floor, rival prices) apply only when the brief gives costs or rivals or asks for a price level.
  - The test reads the owner's goal metric within the owner's time window.
  - Skill gates and checks are updated to match.
- **Depends on:** none.

### D3. Measures that prove the owner's goal

- **Leaps:** 4, 2.
- **Files:** `.../quality/cards/experiment-design.md`, `social-calendar.md`, `onboarding-flow.md`.
- **Acceptance criteria:**
  - experiment-design:
    - each test in a plan has its own scope, primary metric, guardrail, split, run time and smallest detectable effect;
    - traffic is limited to the visitors who see the change;
    - the primary metric sits at the funnel step the change moves, with orders or profit as the guardrail when the primary is earlier.
  - social-calendar: the success target is projected from the owner's own per-theme or per-format numbers, with the working, never just "above the old average".
  - onboarding-flow: each message serves a behaviour the data ties to retention. A step the data shows is weak is dropped, not softened.
- **Depends on:** none.

### D4. First screen, persona and range in document and creative cards

- **Leaps:** 8, 9, 10, 7.
- **Files:** `.../quality/cards/investor-update.md`, `job-description.md`, `paid-social-ads.md`, `creative-brief.md`, and the three role skills with a "To confirm" section (see file ownership).
- **Acceptance criteria:**
  - investor-update: the first screen carries the numbers the owner asked for by name, every piece of bad news and the asks.
  - job-description:
    - working hours are given in the candidate's local time zones;
    - the hard parts of the job come near the top;
    - no internal analytics appear in the public post.
  - paid-social-ads and creative-brief:
    - hooks come from the persona's own lines;
    - concepts differ on at least two of angle, format, persona and hook source;
    - one bolder concept is included.
  - In the three role skills, the "To confirm" output section becomes assumption lines.
- **Depends on:** none.

---

## Group E. E-commerce knowledge (implementer 5)

Before editing, confirm in `marketplace/src/modules/knowledge/bundle.ts` whether each e-commerce skill is generated from `catalogue-items/ecommerce/<id>/` or edited in `marketplace/knowledge/ecommerce/skills/`, and edit the true source. If a source sits in `catalogue-items/ecommerce/` and is not listed in the ownership table, it belongs to Group E.

### E1. House rules

- **Leaps:** 1, 4, 7.
- **Files:** `marketplace/knowledge/ecommerce/vertical.json` (`house_rules`), `marketplace/test/knowledge.test.ts`.
- **Acceptance criteria:**
  - Rule 9: "Publishable means finished" no longer asks for a "To confirm" list. Unknown facts become assumption lines, or the claim is left out.
  - Rule 8: variants lead with their own angle in the customers' words. Counts appear only when the count is the claim.
  - New rule: scope each test to the visitors the change touches and read it at the funnel step it moves.
  - New rule: a spend plan adds up to the owner's budget for the period, and any held amount has a release rule the account can meet within that period.
  - `toolkit.md` in a rebuilt e-commerce pack shows the new rules. Tests pass.
- **Depends on:** none.

### E2. Sweep "To confirm" and runner-up sections in e-commerce skills

- **Leaps:** 1, 3.
- **Files:** `marketplace/knowledge/ecommerce/skills/*/SKILL.md` (66 files with "To confirm"; 53 mention a runner-up).
- **Acceptance criteria:**
  - Every "To confirm" output section becomes an "Assumptions" item: assumption lines only, and only those that change what to do.
  - Legally required sign-offs stay as one line next to the item.
  - Runner-up lines stay only where the options truly exclude each other (one supplier, one name, one gateway). Elsewhere they are removed or turned into "combine with".
  - The PR lists every changed file.
  - `grep -l "To confirm" marketplace/knowledge/ecommerce/skills/*/SKILL.md` returns 0.
- **Depends on:** none.

### E3. Store test design fits each test

- **Leaps:** 3, 4.
- **Files:** `marketplace/knowledge/ecommerce/skills/design-store-ab-test/SKILL.md`, `marketplace/knowledge/ecommerce/cards/CRO.json` (the order-band and metric entries), `catalogue-items/ecommerce/store-test-readiness-checker/SKILL.md`.
- **Acceptance criteria:**
  - The primary metric is chosen per test from the funnel step the change moves.
  - Traffic is scoped to the device, browser or source the change affects.
  - The order-band guidance is a default with reasons, not "the rule is one per band".
  - A plan of several tests gives each its own split, run time and detectable effect. One shared "how every test runs" block is allowed only for truly common settings, such as the stop rules.
- **Depends on:** E2 (same skill folder).

### E4. Customer copy skills use customer words

- **Leaps:** 7, 9.
- **Files:** `marketplace/knowledge/ecommerce/skills/write-review-based-ad-copy/SKILL.md`, `write-product-page-copy/SKILL.md`, `ad-copy-test-sets/SKILL.md`.
- **Acceptance criteria:**
  - Proof appears as a customer's words or one plain claim.
  - "N reviewers say" lines move to the summary for the owner, never the copy.
  - Hooks use the persona's own phrases when the brief gives them.
  - The proof-first templates keep a real review count only as a single claim line.
- **Depends on:** E2.

---

## Group F. Bench

### F1. Bench scripts (start now, in parallel)

- **Files:** new `tools/bench/owner-bench/scripts/themes.cjs`, `signal-hits.mjs`, `limits.cjs`.
- **Acceptance criteria:**
  - `themes.cjs <judge-dir>` prints agent vs plain counts for the PRD themes (homework, length, voice, blanket, buried, dismissed lever, maths, invented) from `feedback.jsonl`, unblinded with `key.json`. On the pre-test folders it reproduces the PRD numbers within 10%.
  - `signal-hits.mjs` sends each output with its brief and owner notes to one judge model and records each owner-note signal as fully, partly or missed. It writes `signal-hits.json`.
  - `limits.cjs` prints raw and visible word counts against each brief's limit.
- **Depends on:** none.

### F2. Held-out briefs (start now; must finish before any A to E merge)

- **Files:** new `tools/bench/owner-bench/heldout/` (three general and three e-commerce briefs with owner notes, written to `BRIEF-SPEC-V3.md`).
- **Acceptance criteria:**
  - Written by someone not implementing A to E.
  - Run once with today's packs against plain on the same panel. Results are stored before any pack change merges.
- **Depends on:** none.

### F3. Leak guard

- **Files:** new `tools/bench/owner-bench/scripts/bench-leak-guard.cjs`.
- **Acceptance criteria:**
  - Fails if any of the 22 bench brand names, persona names or owner-note figures appear in `marketplace/packs/` or `marketplace/knowledge/` beyond the matches found today.
  - Run on every A to E branch before merge.
- **Depends on:** none.

### F4. Rebuild and post-test

- **Files:** new `tools/bench/owner-bench/out-ecom-post/`, `out-gen-post/`, `judge-ecom-post/`, `judge-gen-post/`, `POST-TEST.md`.
- **Acceptance criteria:**
  - Packs are rebuilt from the merged sources.
  - The agent arm runs per `ARMS.md` and `RULES-DELIVERABLE.md`, unchanged. The plain arm reuses the frozen pre-test outputs, plus a fresh plain run on 4 jobs to measure noise.
  - The same 20-judge panel runs through `tools/bench/owner-judge.mjs`.
  - `POST-TEST.md` reports every target in PRD section 7, the theme counts (F1), signal hits (F1), limits (F1), the held-out result and the ship decision.
- **Depends on:** A1 to A5, B1 to B4, C1 to C3, D1 to D4, E1 to E4, F1, F2, F3.

---

## Order at a glance

| Week slot | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| Start | A1 | B1, B2, B3, B4 (any order) | C1 | D1, D2, D3, D4 (any order) | E1, E2 | F1, F2, F3 |
| Then | A2, A3 | | C2, C3 | | E3, E4 | |
| Then | A4, A5 | | | | | |
| Last | | | | | | F4 |
