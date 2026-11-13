# Tickets: round 2 (11 e-commerce leaps, 5 general fixes)

These tickets carry out `PRD-NEXT15.md` in this folder. Leap codes E1 to E11 and fix codes G1 to G5 refer to its sections 5 and 6.

There are seven implementer groups and one bench lead:
- five e-commerce groups (EA to EE);
- two general groups (GA, GB);
- the bench lead (F).

Each group owns its files outright, so all seven can work at once. No file appears in two groups. Where a group needs another group's new file, the ticket names the file and the dependency; it never edits that file.

All paths are under `ai-building-blocks-rag/`. NEW marks a file that does not exist yet. Every other path below was checked to exist on 13 November 2026. Read `IMPLEMENTER-RULES.md` first; it still applies (do your group only, no commit, no `packs:lock`, no `build-packs`, no deploy, reply in 15 lines or fewer).

## Shared words (use them the same way everywhere)

- **Brand brain:** a working file, never shipped. It holds the brand's voice lines and banned words from the brief, the reading level, each persona with their own phrases, and every segment the data ranks, each with its number.
- **Signal-to-asset map:** a working table. Each data signal, the named asset in the deliverable that acts on it, and where that asset sits (bullets, line by the button, first email, ad set, test).
- **Working trace:** `context/trace.md`. For each retrieval query: the question, the card ids used, and the call each supports. Never shipped.
- **Numbers ledger:** `context/numbers.json`. Each figure with inputs, formula, unit, period, money basis (revenue, gross profit or contribution) and source (a brief line or a card id).
- **Copy job:** a brief whose deliverable is customer-facing words: ads, scripts, emails, messages, page copy.
- **Relative time:** Day 1, Week 2, "the Monday after launch". A calendar date only when the brief gives one.
- **Bolder move (new meaning):** optional. Only in a plan or strategy, only when it beats the plan, inside the plan's length, never in a copy job, and never when the owner asks for one plan or one recommendation.

## Rules for every ticket

- Write general rules with generic examples. Never put a bench brand, held-out brand, number, persona name or owner-note answer into a pack, skill, card or rule. The held-out brands are SUGAR Cosmetics, Rothy's, Lounge Underwear, Babbel, Splitwise and Podia.
- Do not edit a held-out job's skills:
  - `set-reorder-points-and-safety-stock`, `forecast-demand-per-sku`, `plan-fba-inventory`;
  - every `google-*` skill and `write-pmax-and-shopping-asset-text`;
  - `cut-where-is-my-order-tickets`, `set-up-returns-and-exchanges`, `write-post-purchase-emails`, `returns-and-rto-cost-analysis`;
  - `set-up-affiliate-program`;
  - the cancel-flow, help-docs and affiliate role skills.
- Keep traced maths, decision rules and profit-based calls. The working moves to the ledger or an appendix; it never disappears.
- Safety stays exactly as it is: no spend, send or publish without the client's yes; no invented facts, results or reviews; no passwords; disclosures move to better places, never weaker.
- Plain English at grade 8 to 9, no em or en dashes.
- Tests: `cd marketplace && node --test --experimental-test-module-mocks <files>` and `npm run -s typecheck`. For e-commerce skills also run `node C:/Users/kevin/AppData/Local/Temp/claude/8f10770e160c21fe/54b7bad7-7e5c-417d-b31e-901f61d12720/scratchpad/new-skills/validate-skill.cjs <slugs>`. Every group also runs `node tools/bench/owner-bench/scripts/bench-leak-guard.cjs` before hand-over.

## File ownership

`ks/` means `marketplace/knowledge/ecommerce/skills/` (each entry is `<slug>/SKILL.md`). `q/` means `marketplace/packs/shared/tools/quality/`.

| Group | Leaps | Files it owns (no other group edits these) |
|---|---|---|
| **EA. Knowledge reach** (e-commerce, implementer 1) | E3 | `marketplace/src/modules/knowledge/bundle.ts`; `marketplace/src/modules/packs/build.ts`; `marketplace/scripts/build-packs.mjs`; NEW `q/trace-check.cjs`; `marketplace/test/knowledge.test.ts`; `marketplace/test/packs-retrieve.test.ts`; `marketplace/test/packs.test.ts`; NEW `marketplace/test/ecom-knowledge-reach.test.ts`; NEW `marketplace/test/trace-check.test.ts` |
| **EB. House rules, numbers, offers and growth** (e-commerce, implementer 2) | E1, E2, E4, E5, E6 (house rules), E10 | `marketplace/knowledge/ecommerce/vertical.json`; NEW `q/numbers.cjs`; NEW `marketplace/test/numbers-ledger.test.ts`; NEW `marketplace/test/ecom-house-rules.test.ts`; `ks/offer-bundle-threshold-design`, `ks/how-deep-can-we-discount`, `ks/store-90-day-growth-plan`, `ks/prioritize-growth-backlog`, `ks/full-funnel-30-day-plan`; `marketplace/knowledge/ecommerce/cards/OFF.json` |
| **EC. Media buying and store tests** (e-commerce, implementer 3) | E7, E11, plus E1, E4, E6 in its skills | `ks/store-meta-budget`, `ks/launch-tiktok-ads-first-campaign`, `ks/meta-ads-for-cod-stores`, `ks/set-ad-budget-from-profit-target`, `ks/cross-channel-budget-reallocation`, `ks/daily-ad-account-review`; `ks/design-store-ab-test`, `ks/read-store-ab-test-result`; `marketplace/knowledge/ecommerce/cards/CRO.json`, `marketplace/knowledge/ecommerce/cards/ADC.json`, `marketplace/knowledge/ecommerce/cards/MEA.json`; `catalogue-items/ecommerce/store-test-readiness-checker/SKILL.md` |
| **ED. Creative** (e-commerce, implementer 4) | E8, E2, plus E1, E4, E6 in its skills | `ks/store-meta-concepts`, `ks/write-tiktok-ad-scripts`, `ks/creator-video-script`, `ks/plan-ugc-shoot-at-home`, `ks/tiktok-spark-ads-with-creators`, `ks/ad-copy-test-sets`, `ks/write-review-based-ad-copy`, `ks/mine-ad-angles-from-reviews`; `q/cards/paid-social-ads.md`, `q/cards/creative-brief.md`, `q/cards/creator-brief.md`; `marketplace/knowledge/ecommerce/cards/MCR.json` |
| **EE. Pages, retention and chat** (e-commerce, implementer 5) | E9, E2, plus E1, E4, E6 in its skills | `ks/write-product-page-copy`, `ks/diagnose-low-add-to-cart-products`, `ks/write-welcome-series`, `ks/win-back-lapsed-customers`, `ks/write-win-back-email-series`, `ks/email-sms-flow-plan`, `ks/confirm-cod-orders-by-chat-or-call`, `ks/set-up-whatsapp-sales-chat`, `ks/cut-rto-on-cod-orders`; `q/cards/product-description.md`, `q/cards/lifecycle-email.md`; `marketplace/knowledge/ecommerce/cards/EML.json` |
| **GA. Method retune** (general, implementer 6) | G1, G2, G3 | `marketplace/packs/shared/WORK-METHOD.md`; `marketplace/packs/shared/AGENTS.md`; `marketplace/packs/shared/train/AGENTS.md`; `q/QUALITY-ENGINE-v3.md`, `q/ROUTING.md`, `q/INTAKE.md`, `q/CHECKER-v3.md`, `q/CLARITY.md`, `q/VOICE.md`, `q/lessons-general.md`, `q/profiles.json`, `q/PROFILES.md`, `q/cards/_any.md`; `marketplace/packs/shared/tools/blind-review.mjs`; `marketplace/test/method-core.test.ts`, `marketplace/test/packs-grounded.test.ts`, `marketplace/test/blind-review-owner.test.ts` |
| **GB. General cards, role skills and checks** (general, implementer 7) | G4, G5, G1 (thresholds) | `q/cards/` `outbound-sales.md`, `job-description.md`, `onboarding-flow.md`, `launch-plan.md`, `competitor-analysis.md`, `investor-update.md`, `social-calendar.md`; `marketplace/packs/roles/sdr/skills/cold-email-sequence/SKILL.md`, `marketplace/packs/roles/recruiter/skills/job-post-and-outreach/SKILL.md`, `marketplace/packs/roles/recruiter/skills/evidence-based-screening/SKILL.md`, `marketplace/packs/roles/email-marketing-specialist/skills/lifecycle-flow-builder/SKILL.md`, `marketplace/packs/roles/product-marketing-manager/skills/product-launch-plan/SKILL.md`, `marketplace/packs/roles/market-research-analyst/skills/competitor-research/SKILL.md`, `marketplace/packs/roles/sales-enablement-specialist/skills/sales-playbook-builder/SKILL.md`; `q/leakcheck.cjs`, `q/wordcount.cjs`, `q/qe-check.cjs`; `marketplace/packs/shared/tools/check-handover.mjs`; `marketplace/test/check-handover.test.ts`, `marketplace/test/owner-finish-checks.test.ts`, `marketplace/test/quality-engine-v31.test.ts` |
| **F. Bench lead** | rerun | `tools/bench/owner-bench/scripts/bench-leak-guard.cjs`; NEW `tools/bench/owner-bench/JOB-PACKS.json`; NEW `tools/bench/owner-bench/scripts/ship-rate.cjs`; NEW rerun folders `out-*-r2/`, `judge-*-r2/`; NEW `RESULTS-R2.md` |

Cross-group dependencies (by file name only, never by editing):
- EA ships `q/numbers.cjs` (written by EB) and `q/trace-check.cjs` in the shared-tool manifest of `build.ts`.
- GB's `qe-check.cjs` calls `numbers.cjs` (EB) and `trace-check.cjs` (EA) when their inputs exist.
- EC, ED and EE point their skills at the house rules EB writes, by rule title.

Suggested start order: EB first writes the house-rule titles in its first hour and posts them, so EC, ED and EE can cite them by name. Everything else runs in parallel.

---

## Group EA. Knowledge reach (E3)

### EA1. Every e-commerce agent can search the whole library

- **Files:** `marketplace/src/modules/knowledge/bundle.ts` (`personaVerticalFiles`, `verticalKnowledgeSection`), `marketplace/scripts/build-packs.mjs` (only if the size report needs it), `marketplace/test/knowledge.test.ts`, NEW `marketplace/test/ecom-knowledge-reach.test.ts`.
- **Edits:**
  - In `personaVerticalFiles`, an e-commerce agent carries every module file that has public cards (today `codes` keeps only `persona.modules.slice(0, 4)`, or the constraint modules for a lead). Keep them `shared: true` so each is served once.
  - The baseline file then holds no duplicates (the "others" filter already skips carried modules).
  - Measure the largest e-commerce zip after the change. If it passes 2.5 MB, switch to plan B: carry the agent's own modules in full plus a NEW generated `knowledge/ecommerce/card-index.md` with one line per public card (id, claim, holds when, the number, source tier, module) for the rest. Point the knowledge section at the connector's `ask_vertical_knowledge` for full text.
  - `verticalKnowledgeSection`: replace "Each card is one claim ..." guidance with the required step. Before drafting, run `node tools/ask-knowledge.mjs` once per data signal and once per major decision. Write each query, the card ids used and the call each supports in `context/trace.md`. Never cite card ids in the deliverable. Run `node tools/quality/trace-check.cjs` before hand-over.
  - Licence: only public cards from public sources ship. Keep the `c.public && open.has(c.source)` filter. Add a test that a non-public card never appears in any carried file.
- **Acceptance:**
  - In a rebuilt zara-tiktok-ads pack, `node tools/ask-knowledge.mjs "free shipping threshold for bundles"` returns passages from OFF, a module it did not carry before.
  - No card appears twice in one pack.
  - Every e-commerce zip is 2.5 MB or less; record the largest size in the reply.
  - `scripts/eval-retrieval.mjs` Hit@5 on the golden set does not fall.
- **Tests:** `test/knowledge.test.ts`, `test/packs-retrieve.test.ts`, NEW `test/ecom-knowledge-reach.test.ts`; then `node scripts/eval-retrieval.mjs`.
- **Depends on:** none.

### EA2. The trace check

- **Files:** NEW `q/trace-check.cjs`, NEW `marketplace/test/trace-check.test.ts`, `marketplace/src/modules/packs/build.ts` (shared-tool manifest, near the `quality/leakcheck.cjs` entry, about line 130).
- **Edits:**
  - `node tools/quality/trace-check.cjs context/trace.md --spec context/spec.md [--pack .]` fails when:
    - the trace is missing;
    - it has fewer queries than the signal pass's signals plus the decisions named in the spec;
    - it cites a card id that is not in the pack's knowledge files;
    - the deliverable (optional `--final`) contains a card id.
  - It prints one short report in the style of `leakcheck.cjs`.
  - Add `quality/trace-check.cjs` and `quality/numbers.cjs` to the shared-tool manifest in `build.ts`, with plain purposes. `numbers.cjs` is written by EB; if it is not merged yet, add the entry behind an exists check in the build.
- **Acceptance:** fixtures for a passing trace, a short trace, an unknown id and a leaked id.
- **Tests:** NEW `test/trace-check.test.ts`, `test/packs.test.ts`.
- **Depends on:** EA1 (the step text names this tool).

### EA3. Any store job gets the store kit

- **Files:** `marketplace/src/modules/knowledge/bundle.ts`, `marketplace/src/modules/packs/build.ts` (the generated AGENTS.md lines, about lines 355 to 470), `marketplace/scripts/build-packs.mjs`, NEW `marketplace/test/ecom-knowledge-reach.test.ts`.
- **Edits:**
  - At build, list the roles of the 45 e-commerce personas (`src/modules/directory/data/personas-ecommerce.json`, read only).
  - A non-e-commerce persona whose role is on that list carries the store kit. The kit is the house rules section of the toolkit, the compact card index from EA1 plan B (generate it in this case even under plan A), and one line in its knowledge section saying when to use it: the business sells physical goods online.
  - Every other pack gets one generated AGENTS.md line: if the brief is for a store, use the connector's `ask_vertical_knowledge` with vertical `ecommerce` and follow its house rules.
  - Do not edit persona data files.
- **Acceptance:**
  - A rebuilt candice-email-marketing pack (role email-marketing-specialist, shared with an e-commerce persona) carries the store kit.
  - A rebuilt ankit-help-docs pack carries only the one AGENTS.md line.
  - Total dist size growth is reported in the reply.
- **Tests:** NEW `test/ecom-knowledge-reach.test.ts`, `test/packs.test.ts`, `test/directory-packs.test.ts` (run, do not edit).
- **Depends on:** EA1.

---

## Group EB. House rules, numbers, offers and growth (E1, E2, E4, E5, E6, E10)

### EB1. New and rewritten house rules

- **Files:** `marketplace/knowledge/ecommerce/vertical.json` (`house_rules`), NEW `marketplace/test/ecom-house-rules.test.ts`.
- **Edits:** the toolkit renders house rules in order, so put the job spine first. Each rule starts with a short title sentence, as today.
  1. **Brand brain first.** (E1) As in shared words. Check every customer-facing line against it.
  2. **Map every signal to an asset.** (E1) Past winner gets a relaunch; best segment gets its own creative, message or ad set; the top return or complaint reason is answered in the bullets and the line by the button; every chat or return topic above about 10% gets a fix or a test. A signal with no asset is a gap to close.
  3. **Look it up before you decide.** (E3) One `ask-knowledge` query per signal and per major decision, logged in the working trace; card ids never in the deliverable.
  4. **Ship what was asked, in full.** (E2) A copy job ships copy. No test budgets, cell plans, measurement sections, rights or contract terms, fallbacks or bolder moves unless the brief asks; at most one line on what to watch. Every customer message is final for every branch, names the product or answer, and uses only merge fields the brief's tools support, each with a fallback.
  5. **Write for a busy owner.** (E4) Each decision in two plain lines (what, and why with one number); at most one table per decision, five columns or fewer, no formulas in the body; the brand's reading level; no jargon the brief does not use; stay within the owner's limit and stop when done.
  6. **Only the brief's facts run the business.** (E6) Numbers, dates, windows, age ranges, delays and product specs come from the brief or a card cited in the trace. Relative time unless the brief gives dates. Quote product facts; never interpolate them.
  7. **One basis per number.** (E5) Run `node tools/quality/numbers.cjs`. Savings valued at margin, not order value; stock split into on hand, held, inbound and sellable before cover is worked out; one period and one money basis per table; verdict labels match their numbers.
  - Then the existing rules 1 to 11 (renumbered), with these edits:
    - Rule 3 "Show the after": the forecast goes through the numbers ledger with at most one assumed input, named in the line.
    - Rule 5: applies only when the brief asks for a test.
    - Rule 9: keep as it is.
    - Rule 11: "The plan uses the whole budget. Proven winners are funded from the start where tracking works. A reserve is at most 15% and has a release rule on store numbers the account will hit within the period."
- **Acceptance:**
  - The toolkit in a rebuilt e-commerce pack shows the seven new rules first.
  - Total house-rule text stays under 900 words.
  - The new test asserts each rule title and that no rule names a bench or held-out brand.
- **Tests:** NEW `test/ecom-house-rules.test.ts`, `test/knowledge.test.ts` (run, do not edit).
- **Depends on:** none. Post the seven rule titles to the other e-commerce groups in your first hour.

### EB2. The numbers ledger tool

- **Files:** NEW `q/numbers.cjs`, NEW `marketplace/test/numbers-ledger.test.ts`.
- **Edits:**
  - `node tools/quality/numbers.cjs context/numbers.json --final <deliverable> [--brief <brief>]`.
  - Ledger entries: `{ id, value | formula, inputs, unit, period, basis, source, label? }`. The tool computes every formula in plain JavaScript (no eval of free text; a small arithmetic parser over named inputs).
  - It reports:
    - FAIL: a total that does not match its rows.
    - FAIL: a `label` that contradicts its number (Cut with spend above zero; Hold with a change; Scale with a cut).
    - FAIL: two periods or two money bases in one markdown table.
    - WARN: a figure in the deliverable found in neither the ledger nor the brief (with rounding tolerance and lakh or comma formats).
    - WARN: a saving or "kept" figure whose basis is revenue.
  - No dependencies, Node 18, same report style as `leakcheck.cjs`.
- **Acceptance:** run on the frozen post-test agent outputs with hand-made ledgers for J01, J08 and J10. It flags the J01 Cut label, the J08 reachable-buyer slip and the J10 mixed bases. It raises no FAIL on the J07 plain output with a ledger built from that output's own figures. Keep these fixtures in the test with generic numbers and no brand names.
- **Tests:** NEW `test/numbers-ledger.test.ts`.
- **Depends on:** none. EA ships it; GB's `qe-check.cjs` calls it.

### EB3. Offers and growth plans lead with the proven winner

- **Files:** `ks/offer-bundle-threshold-design`, `ks/how-deep-can-we-discount`, `ks/store-90-day-growth-plan`, `ks/prioritize-growth-backlog`, `ks/full-funnel-30-day-plan`, `marketplace/knowledge/ecommerce/cards/OFF.json`.
- **Edits:**
  - Steps:
    - the proven winner (the best-selling pair, the threshold that works) leads unchanged, and any change to it is a test, not the plan;
    - one call per decision, with a point estimate and its range in one line;
    - rank moves by money per unit of effort, first-week action first;
    - at most one assumed input per projection, named;
    - each move names who does it;
    - run `numbers.cjs` before hand-over.
  - Remove outside "yardstick" or "practitioner benchmark" sizing unless it is a card cited in the trace.
  - Date fields become relative days.
  - Each skill's Output section follows house rule 5 (two lines per decision, one table each).
  - OFF.json: only edit card text where a card states a rule these steps now contradict; keep ids, sources and public flags.
- **Acceptance:** `validate-skill.cjs` passes for all five slugs; `grep -n "practitioner yardstick\|start date" ks/<slug>/SKILL.md` returns nothing for these five.
- **Tests:** `validate-skill.cjs offer-bundle-threshold-design how-deep-can-we-discount store-90-day-growth-plan prioritize-growth-backlog full-funnel-30-day-plan`; `test/knowledge.test.ts` (run).
- **Depends on:** EB1 (rule titles), EB2 (tool name).

---

## Group EC. Media buying and store tests (E7, E11)

### EC1. The media-buying audit spine

- **Files:** `ks/store-meta-budget`, `ks/launch-tiktok-ads-first-campaign`, `ks/meta-ads-for-cod-stores`, `ks/set-ad-budget-from-profit-target`, `ks/cross-channel-budget-reallocation`, `ks/daily-ad-account-review`, `marketplace/knowledge/ecommerce/cards/ADC.json`, `marketplace/knowledge/ecommerce/cards/MEA.json`.
- **Edits:** each skill's Steps follow this spine in order, one short section each:
  1. **Tracking:** the store-vs-platform gap the brief gives, per ad set where given; never a "midpoint"; judge on store numbers.
  2. **What worked before:** past winners, paused ones included; relaunch first with fresh cuts.
  3. **Audiences:** from the brand brain's best segments; no age or interest floor the data does not support.
  4. **Formats and messaging:** weighted to the proven style, with enough new creative in that style to feed the budget.
  5. **Budget:** the whole budget is planned. Winners are funded from the start where tracking works. A reserve is at most 15% with a release rule on store numbers the account will hit in the period. No zero-spend setup days unless tracking is missing, and then only the days the fix needs.
  6. **Verdicts:** Cut means zero, Trim means lower, Hold means the same, Scale means higher; the label matches the number in every table and note.
  7. **Rules:** one cut or scale rule per ad set, in one line, read on store numbers, never on platform-reported cost alone.
- Also in these skills:
  - "Start date" becomes "start day".
  - Tests and holdouts appear only when the brief asks or tracking cannot answer the question.
  - Outputs follow house rule 5.
  - ADC.json and MEA.json: edit only card text that contradicts the spine; keep ids, sources and public flags.
- **Acceptance:**
  - `validate-skill.cjs` passes for all six.
  - Each skill's Steps show the seven spine headings in order.
  - No skill tells the agent to hold a reserve above 15%.
- **Tests:** `validate-skill.cjs store-meta-budget launch-tiktok-ads-first-campaign meta-ads-for-cod-stores set-ad-budget-from-profit-target cross-channel-budget-reallocation daily-ad-account-review`; `test/knowledge.test.ts` (run).
- **Depends on:** EB1 rule titles.

### EC2. A store test for every big objection

- **Files:** `ks/design-store-ab-test`, `ks/read-store-ab-test-result`, `marketplace/knowledge/ecommerce/cards/CRO.json`, `catalogue-items/ecommerce/store-test-readiness-checker/SKILL.md`.
- **Edits:**
  - Every objection above about 10% of chats or returns gets a test or a direct fix in the plan.
  - Expected lift and smallest detectable effect are two separate numbers, named as such.
  - A lift measured at an earlier funnel step reaches orders only through that step's pass-through rate from the data.
  - One baseline per traffic scope.
  - Schedules in relative weeks; the "Run time | weeks, start date, end date" field (design-store-ab-test, about line 130) becomes "Run time | weeks, start week".
  - Keep round 1's per-test scope and metric rules.
- **Acceptance:** `validate-skill.cjs` passes; the checker's SKILL.md still validates in the catalogue build (`node scripts/build-packs.mjs` is not run; instead run `npm run -s typecheck` and `test/knowledge.test.ts`).
- **Tests:** `validate-skill.cjs design-store-ab-test read-store-ab-test-result`; `test/knowledge.test.ts` (run).
- **Depends on:** EB1 rule titles.

---

## Group ED. Creative (E8, E2)

### ED1. The concept matrix

- **Files:** `ks/store-meta-concepts`, `ks/write-tiktok-ad-scripts`, `ks/creator-video-script`, `ks/plan-ugc-shoot-at-home`, `ks/tiktok-spark-ads-with-creators`, `ks/mine-ad-angles-from-reviews`, `q/cards/paid-social-ads.md`, `q/cards/creative-brief.md`, `q/cards/creator-brief.md`, `marketplace/knowledge/ecommerce/cards/MCR.json`.
- **Edits:**
  - Before writing, build a concept matrix (working table): one row per concept with segment (from the brand brain), angle, format, hook source (a customer phrase) and first frame. Rules:
    - at least three formats;
    - no concept in a style the owner called tired or flat;
    - at least half the new creative in the proven style, with enough creators or variants to feed the budget;
    - one concept for each top segment, including the best-performing one;
    - the top review theme leads at least one headline or hook.
  - Disclosure: on-screen and in the caption from the first second; a spoken disclosure at a natural beat after the hook, never inside the payoff or the taste or try moment.
  - Read every spoken line aloud in the creator's voice before hand-over.
  - Cards:
    - paid-social-ads.md SHAPE drops "first test" and the labelled bolder concept; it keeps "concepts differ on at least two of angle, format, persona and hook source".
    - creative-brief.md and creator-brief.md gain the matrix and the disclosure placement.
    - "DONE MEANS" in paid-social-ads.md becomes: a designer could build every ad without asking, and each concept answers a named segment or signal.
  - MCR.json: edit only card text that contradicts these rules.
- **Acceptance:** `validate-skill.cjs` passes for all six slugs; no card in ED's files asks for a bolder concept or a test plan by default.
- **Tests:** `validate-skill.cjs store-meta-concepts write-tiktok-ad-scripts creator-video-script plan-ugc-shoot-at-home tiktok-spark-ads-with-creators mine-ad-angles-from-reviews`; `test/packs-grounded.test.ts` and `test/quality-engine-v3.test.ts` (run only; GA owns `packs-grounded.test.ts`, so report any failure caused by card text to GA rather than editing it).
- **Depends on:** EB1 rule titles.

### ED2. Copy jobs ship copy

- **Files:** `ks/ad-copy-test-sets`, `ks/write-review-based-ad-copy`, `ks/store-meta-concepts`, `ks/creator-video-script`.
- **Edits:**
  - `ad-copy-test-sets` "Size the read bar to the budget" (about line 118) and the `store-meta-concepts` test plan table (about line 139): use them only when the brief asks for a test or a budget. Otherwise the copy set ends with one line on what to watch.
  - `creator-video-script`: rights, usage and disclosure terms are one line each, outside the scripts.
  - Headlines and descriptions keep their real platform limits.
  - Output sections follow house rule 5.
- **Acceptance:** a dry run of each skill on a copy-only brief gives no budget, cell or test section.
- **Tests:** `validate-skill.cjs ad-copy-test-sets write-review-based-ad-copy`.
- **Depends on:** ED1 (same files).

---

## Group EE. Pages, retention and chat (E9, E2)

### EE1. Segment truth in every customer message

- **Files:** `ks/write-welcome-series`, `ks/win-back-lapsed-customers`, `ks/write-win-back-email-series`, `ks/email-sms-flow-plan`, `ks/confirm-cod-orders-by-chat-or-call`, `ks/set-up-whatsapp-sales-chat`, `ks/cut-rto-on-cod-orders`, `q/cards/lifecycle-email.md`, `marketplace/knowledge/ecommerce/cards/EML.json`.
- **Edits:**
  - Add a segment truth check step (working table): each message against each segment that receives it. It asks:
    - Is every line true for that segment (usage, availability, payment method, offer)?
    - Does the message reach the segment where the problem lives?
    - Does it give the answer (the named product, the tip) rather than send people to a tool?
  - Offers are valued at margin; a deep offer to the coldest group goes out only with a holdout.
  - Flows are measured against the current flow, not against no messages.
  - Any work the plan adds (calls, shifts, replies) names who does it and in which hours.
  - Templates use only supported merge fields, each with a fallback.
  - Send schedules use relative days.
  - lifecycle-email.md must-haves gain the segment truth check.
  - EML.json: edit only card text that contradicts these rules.
- **Acceptance:** `validate-skill.cjs` passes for all seven; each skill's Checks section has the three segment-truth questions.
- **Tests:** `validate-skill.cjs write-welcome-series win-back-lapsed-customers write-win-back-email-series email-sms-flow-plan confirm-cod-orders-by-chat-or-call set-up-whatsapp-sales-chat cut-rto-on-cod-orders`.
- **Depends on:** EB1 rule titles.

### EE2. Product pages answer the top objection where buyers decide

- **Files:** `ks/write-product-page-copy`, `ks/diagnose-low-add-to-cart-products`, `q/cards/product-description.md`.
- **Edits:**
  - The top return or complaint reason is answered in the bullets and in the line by the add-to-cart button, with its number where it helps.
  - Product facts are quoted from the brief, never interpolated.
  - `write-product-page-copy` step 12 ("Hand over a watch metric and a fallback") becomes one optional line, outside the page copy, and no fallback recommendation.
  - product-description.md must-haves gain the placement rule.
- **Acceptance:** `validate-skill.cjs` passes; no measurement section by default.
- **Tests:** `validate-skill.cjs write-product-page-copy diagnose-low-add-to-cart-products`.
- **Depends on:** EB1 rule titles.

---

## Group GA. Method retune (G1, G2, G3)

### GA1. Retune the rules that regressed

- **Files:** `marketplace/packs/shared/WORK-METHOD.md` (lines 7, 50, 55), `q/QUALITY-ENGINE-v3.md` (rules 1, 3 and 4; steps 2 and 3), `q/ROUTING.md` (light and standard), `q/CHECKER-v3.md` (about line 41), `q/lessons-general.md`, `q/cards/_any.md` (SHAPE), `q/profiles.json`, `q/PROFILES.md`, `marketplace/packs/shared/train/AGENTS.md`, `marketplace/test/method-core.test.ts`, `marketplace/test/packs-grounded.test.ts`, `marketplace/test/blind-review-owner.test.ts`.
- **Edits:**
  - Bolder move: the new meaning in shared words, in every file that defines it.
  - "Combine complementary moves" only when the owner did not ask for one recommendation, written as one decision.
  - Remove the 85% aim everywhere. The new length line: stay within the owner's limit; stop when the job is done; no section the owner did not ask for; length is judged by clarity and by the owner's own limit, never by a ratio.
  - Keep "act fully" and the owner-override line at the top of WORK-METHOD.
  - Update the three tests that pin the old wording (`method-core.test.ts` line 46; `packs-grounded.test.ts` lines 165 to 171; `blind-review-owner.test.ts` lines 74 and 84).
- **Acceptance:** `grep -rn "85%" ` over GA's files returns nothing; `grep -rn "bolder" ` shows only the new optional rule.
- **Tests:** `test/method-core.test.ts`, `test/packs-grounded.test.ts`, `test/blind-review-owner.test.ts`, `test/quality-engine-v3.test.ts` (run).
- **Depends on:** none.

### GA2. Decide without inventing

- **Files:** `WORK-METHOD.md` (lines 7, 52, 56), `q/QUALITY-ENGINE-v3.md` (rule 1), `q/INTAKE.md`, `marketplace/packs/shared/AGENTS.md`.
- **Edits:**
  - One-shot jobs: decide what is yours to decide (the plan, the copy, the order). Never state the owner's own decisions or the business's operating facts as done.
  - When a fact is missing, write the plan so it works either way, or state one assumption line.
  - "Be specific: real names, prices, dates" becomes "real names and prices from the brief; relative days unless the brief gives dates".
  - "Plans: ... dated steps" becomes "steps in order, with owners and days relative to the start".
  - Numbers in a plan go through `numbers.cjs` when the pack has it.
- **Acceptance:** tests updated where they pin these lines.
- **Tests:** `test/method-core.test.ts`, `test/output-policy.test.ts` (run).
- **Depends on:** GA1 (same files).

### GA3. The strongest signal sets weights, order and asks

- **Files:** `WORK-METHOD.md` (steps 0 and 5), `q/QUALITY-ENGINE-v3.md` (steps 1 and 8), `q/CLARITY.md` (section 1), `q/VOICE.md`, `marketplace/packs/shared/tools/blind-review.mjs`, `marketplace/test/blind-review-owner.test.ts`.
- **Edits:**
  - Step 0 adds the asks list: every explicit ask in the brief and where the deliverable meets it.
  - The signal pass adds "what this signal sets": a weight, an order, an ask or a timing.
  - Step 5 and step 8 check both.
  - Ranking defaults to money per unit of effort, fastest money first unless a dependency blocks it; a ranked table follows its own stated rule.
  - VOICE.md: the persona's own phrase leads the hero or hook when the brief gives one.
  - `blind-review.mjs` sheet adds two questions: which explicit asks are missing, and which weight, order or ask cuts against a signal. Keep `VERDICT:`, `GRAFT:` and the two-order tally unchanged.
- **Acceptance:** replay the frozen post-test G05, G04, G06 and G01 agent outputs through the sheet text by hand; each new question surfaces the fault judges cited. Record this in the reply.
- **Tests:** `test/blind-review-owner.test.ts`, `test/method-core.test.ts`.
- **Depends on:** GA2 (same files).

---

## Group GB. General cards, role skills and checks (G4, G5, G1 thresholds)

### GB1. Write it in full, with one light ask

- **Files:** `q/cards/outbound-sales.md`, `job-description.md`, `onboarding-flow.md`, `launch-plan.md`, `competitor-analysis.md`, `investor-update.md`, `social-calendar.md`; the seven role skills in GB's row.
- **Edits:**
  - job-description card and recruiter skills:
    - the application exercise is written in full (the scenario, the facts, the question);
    - scorecard weights follow the predictor data the brief gives.
  - onboarding-flow card and lifecycle-flow-builder:
    - every branch is a full email;
    - a holdout gets the current series, not nothing.
  - outbound-sales card, cold-email-sequence and sales-playbook-builder:
    - one light ask per touch, the lightest the data supports;
    - no call request in the first touch unless the data shows calls convert;
    - timing runs from the trigger, not a calendar window.
  - launch-plan card and product-launch-plan:
    - standard safety gates (staged rollout, undo) are defaults, never a bolder move;
    - added work names who does it (support cover).
  - competitor-analysis card and competitor-research: moves ranked by money per unit of effort.
  - investor-update card: proposals marked as proposals, never stated as decided.
  - social-calendar card: a review call names what triggers review and flags anything close; when unsure, flag it.
- **Acceptance:** no file in GB asks for a bolder move or a second subject line by default.
- **Tests:** `test/quality-engine-v3.test.ts` (run). Role skills have no validator; check each still has its front matter.
- **Depends on:** none.

### GB2. Trace-to-brief checks and length thresholds

- **Files:** `marketplace/packs/shared/tools/check-handover.mjs`, `q/leakcheck.cjs`, `q/wordcount.cjs`, `q/qe-check.cjs`, `marketplace/test/check-handover.test.ts`, `marketplace/test/owner-finish-checks.test.ts`, `marketplace/test/quality-engine-v31.test.ts`.
- **Edits:**
  - `--brief <file>` in `check-handover.mjs` and `leakcheck.cjs` flags:
    - calendar dates and weekday names not in the brief;
    - money and percentage figures in neither the brief nor `context/numbers.json` (WARN);
    - a "Bolder move" heading or bold label when the profile is a copy family;
    - describe-not-write phrases ("use a real", "pick one from", "take the quiz", "[X]", "₹X", "$X").
  - `wordcount.cjs` and `qe-check.cjs` drop the 85% warning; they fail only above the owner's limit (`--limit`), and keep `--fail-above` for owners who set a tighter one.
  - `qe-check.cjs` runs `numbers.cjs` when `context/numbers.json` exists and `trace-check.cjs` when `context/trace.md` exists, and adds their lines to its one report. If either file is missing from the pack, it skips that check with a note.
- **Acceptance:** on the frozen post-test outputs (`tools/bench/owner-bench/out-*-post/`) with their briefs:
  - flags the dates in J01, J08, J11, G03 and G04;
  - flags the G05 "a real ticket" description;
  - flags the bolder-move labels in the copy jobs J04, J07 and G02;
  - flags 3 or fewer plain outputs in `out-*-pre/*-plain.md`.
  - Fixtures in the tests use generic text.
- **Tests:** `test/check-handover.test.ts`, `test/owner-finish-checks.test.ts`, `test/quality-engine-v31.test.ts`.
- **Depends on:** none to build; the integration lines in `qe-check.cjs` need EB2 and EA2 merged to pass end to end.

---

## Group F. Bench lead

### F1. Record the job-to-pack map

- **Files:** NEW `tools/bench/owner-bench/JOB-PACKS.json`.
- **Edits:** the 28 rows of PRD section 11 (job, agent id, role, e-commerce kit, recorded or inferred), so reruns stop depending on a temp folder.
- **Depends on:** none.

### F2. Leak guard and ship-rate script

- **Files:** `tools/bench/owner-bench/scripts/bench-leak-guard.cjs`, NEW `tools/bench/owner-bench/scripts/ship-rate.cjs`.
- **Edits:**
  - Add the six held-out brands to `RULE_BRANDS`.
  - `ship-rate.cjs <judge-dir>` prints per judge family and arm: "as is", small tweaks, major rework, overall 10s, overall 9 or more, and the strict-judge (Claude, OpenAI, DeepSeek) totals from PRD section 1. On `judge-ecom-post` it must print strict "as is" 4 of 175 and strict tens 2.
- **Depends on:** none. Run the leak guard on every group's branch before merge.

### F3. Rebuild and rerun

- **Files:** NEW `out-ecom-r2/`, `out-gen-r2/`, `out-ho-r2/`, `judge-*-r2/`, `RESULTS-R2.md`.
- **Edits:**
  - Merge EA to EE and GA, GB.
  - Run `packs:lock` and `build-packs`, and take each pack from `marketplace/dist/packs/<id>/` per `JOB-PACKS.json`.
  - Run the agent arm per `ARMS.md` and `RULES-DELIVERABLE.md`; reuse the frozen plain outputs.
  - Run the same 20-judge panel.
  - Report every target in PRD section 1, the general guardrails, `themes.cjs`, `signal-hits.mjs`, `limits.cjs`, `ship-rate.cjs`, trace and ledger pass rates, and held-out.
- **Depends on:** all groups, F1, F2.

---

## Order at a glance

| Slot | EA | EB | EC | ED | EE | GA | GB | F |
|---|---|---|---|---|---|---|---|---|
| Start | EA1 | EB1 (post titles), EB2 | EC1 | ED1 | EE1 | GA1 | GB1, GB2 | F1, F2 |
| Then | EA2, EA3 | EB3 | EC2 | ED2 | EE2 | GA2, GA3 | | |
| Last | | | | | | | | F3 |
