# Owner rubric for the e-commerce eval suite

This is how the owner grades an answer. There are seven grades, in the owner's order of importance. Each is scored 1 to 10. On top of them sit the task's own job checks (from `TASKS.json`, scored by the checker), reproducibility across 3 runs, and round over round improvement.

The judge sees: the owner's question, the task's outcome, the principle sets that apply, the inputs the arm had, and the answer or answers. The judge never sees which arm made an answer, word counts, file names, the job checks or the answer key.

<!-- grades:start -->
## The seven grades

Rubric version 2026-11-16.

For each grade, work in this order:
1. Answer its yes/no sub-checks. Each is "yes", "no" or "n/a" (n/a only when the check cannot apply to this answer).
2. Write a short critique, 2 to 4 sentences, that quotes the exact lines you judged.
3. Then score the grade 1 to 10, using the anchors.

The sub-checks anchor the score:
- If every sub-check that applies is "yes", the grade is usually 7 or more.
- A "no" on a sub-check marked (must pass) caps the grade at 3, because the anchors already put that fault at 1 to 3.
- Mark a grade "unknown" only if the answer gives you nothing to judge it on.

### 1. On brand: design, voice and the target persona (most important)
Does it sound like this brand, look like this brand, and speak to the persona the task targets? Use the Org context in the inputs. For an internal deliverable (an audit or plan), judge whether its recommendations, examples and any copy fit this brand and its buyers.
- **b1_voice:** follows the brand's voice rules, with no banned words or tone breaks.
- **b2_look:** any colours, type or visual direction match the Org context (n/a if the answer has none).
- **b3_persona:** speaks to the persona the task targets, in that buyer's own words.
- **b4_no_cannot_say:** makes no claim the Org context says the brand cannot make (must pass).
- **9 to 10:** Reads as if the brand's own best writer and designer made it. Uses the voice rules, real palette and type, and the persona's own words. Nothing a customer would find off.
- **7 to 8:** Clearly on brand with small slips (a generic line, a missed persona phrase).
- **4 to 6:** Generic but not wrong. Could be any brand in the category.
- **1 to 3:** Off brand: wrong tone, banned words, wrong colours or claims, or speaks to the wrong buyer.

### 2. Follows the best principles of the job's domain
Does it apply what a senior practitioner in this discipline would apply? The task lists the principle sets (for example media buying, direct-response copy, visual design, CRO). Our principle books (`R/marketplace/knowledge/ecommerce/principles/`) are one anchor, but judge by sound domain practice from any good source.
- **p1_method:** uses the method a senior practitioner in this discipline would use (the right unit of analysis, true numbers before platform numbers, ranked by money).
- **p2_core_applied:** applies at least one core principle of the discipline in substance, not just by name (proof, ranking, test logic, hierarchy).
- **p3_no_basic_break:** breaks no basic practice of the discipline.
- Copy: awareness level, one big idea, mechanism, proof, objections handled, a clear offer and ask, real psychological levers.
- Creative: one message, clear hierarchy, contrast, product visible, legible on a phone, built from what already won.
- Audits and plans: a senior practitioner's method (right unit of analysis, true numbers before platform numbers, ranked by money, tests sized to reach a read).
- **9 to 10:** A senior practitioner would sign it. Principles applied, not name-dropped.
- **7 to 8:** Sound method with one gap.
- **4 to 6:** Some principles, missing a core one (no proof, no ranking, no test logic).
- **1 to 3:** Breaks basic practice (scales on CTR, copy with no ask, a design that cannot be read on a phone).

### 3. Logically sound
Does the reasoning hold, and does each recommendation follow from the evidence?
- **l1_follows:** the main recommendation follows from the evidence the answer shows.
- **l2_no_contradiction:** the answer never contradicts itself or acts against its own findings.
- **l3_tradeoff_named:** it names the main trade-off or risk of what it recommends.
- **9 to 10:** Every step follows; trade-offs and risks are named; no contradictions.
- **7 to 8:** Sound, with a small leap.
- **4 to 6:** Some conclusions do not follow, or it contradicts itself once.
- **1 to 3:** The main recommendation does not follow from the evidence, or the answer acts against its own findings.

### 4. Backed by sound sources
Does every important claim or insight rest on the owner's data or a sound source? A sound source is credible, checkable, dated, relevant and on point. It can be our library or anyone's. Not everything must be unique, but there must be something grounded that plain AI would not give. Mark each unbacked, stale, weak or off-point source you find, and every number that does not trace to the inputs.
- **k1_numbers_trace:** every number that drives a decision traces to the inputs, or is shown as worked from them.
- **k2_nothing_invented:** nothing invented: no made-up facts, figures, reviews, quotes or certifications (must pass).
- **k3_sources_sound:** any outside source it leans on is credible, current and on point (n/a if it uses none).
- **9 to 10:** All key claims trace to the inputs or to named, sound, current sources; numbers recompute; nothing invented.
- **7 to 8:** Well backed, one or two loose claims.
- **4 to 6:** Several claims stated as fact without support, or a number that does not trace.
- **1 to 3:** Invented facts, figures, reviews or certifications, or a decision built on a wrong number.

### 5. Serves the task's outcome (first, second and third order)
Score against the outcome written for this task, not a generic "more revenue". Will it get the store the first-order effect, and does it set up the second and third? Does it answer what the owner asked?
- **o1_answers_ask:** answers exactly what the owner asked, not a nearby question.
- **o2_first_order:** would move the first-order outcome written for this task.
- **o3_second_order:** sets up the second-order outcome too.
- **9 to 10:** Delivers the first-order outcome and sets up the second and third; answers exactly what was asked.
- **7 to 8:** Delivers the first-order outcome; later effects partly covered.
- **4 to 6:** Useful but would not move the outcome much, or answers a nearby question.
- **1 to 3:** Would not move sales or cost, or works against the outcome.

### 6. Understandable, interpretable, actionable (the main bar)
Can the owner understand it, see why, and act on it today? Grade 8 to 9 reading level, short sentences, the first screen gives the answer, scannable, usable as is (no placeholders, no notes to self).
- **a1_first_screen:** the first screen gives the answer.
- **a2_no_placeholders:** usable as is, with no placeholders, notes to self or homework for the owner.
- **a3_plain_words:** plain words and short sentences, with jargon explained or left out.
- **a4_act_today:** the owner could act on it today without asking a follow-up question.
- **9 to 10:** The first screen answers the question; the why is clear; the owner can act today without edits.
- **7 to 8:** Clear and usable with light edits.
- **4 to 6:** The answer is there but buried, dense, or needs rework.
- **1 to 3:** Hard to follow, jargon-heavy, unfinished, or not usable.

### 7. Unique insight beyond the norm (rewarded when present)
Outside-the-box thinking from first principles and depth beyond the standard playbook. A standard-playbook answer can still pass the other grades but scores lower here.
- **i1_non_obvious:** names a non-obvious finding from the data. Quote it in the critique.
- **i2_turned_into_move:** turns that finding into a specific move or test.
- **9 to 10:** Finds something non-obvious in the data and turns it into a move. Anchor for ads and email tasks: digging the breakdown to find that one segment buys through one format (for example, women 65+ buying through single-image ads), then proposing to test that format with a message tuned to them.
- **7 to 8:** At least one sharp, specific idea most specialists would miss.
- **4 to 6:** Competent standard playbook.
- **1 to 3:** Generic advice that any template would give.

## Owner score
The owner score is a weighted mean of the seven grades: on brand 20%, principles 15%, logic 15%, backed 15%, outcome 15%, actionable 12%, insight 8%. Grades marked unknown are dropped and the weights are rescaled.
<!-- grades:end -->

## Pass line and the must-pass gate

- **Pass line:** a grade of 7 or more means "the owner would accept this with light edits". For each grade, SCORE.md shows the share of runs at or above the line, next to the mean. Judges are checked against the owner on this line.
- **Sub-check rates:** SCORE.md shows how often each sub-check is "yes", per arm. This is where a fall in a grade gets explained.
- **Must-pass gate:** a run fails the gate if the judge answers "no" to k2 (something invented) or b4 (a claim the brand cannot make), or the checker marks a decoy as taken. Promotion needs the held-out must-pass rate not to fall. The owner score stays the headline.

## Can we trust the judges? (owner labels)

Judges are Claude, on the owner's plan. That is fine only once we have shown they agree with the owner. Kevin is the one expert whose call decides what "good" means.
- **Labels:** `scripts/review.mjs` builds a local review page from a round's tune answers. They are chosen at random, plus outliers, plus cases where the judge and the checker disagree. Kevin marks each grade pass or fail at the pass line, answers "would you act on this today", and writes a short note on the first thing that went wrong. Labels are never taken from held-out answers.
- **Splits:** each label is put in train (15%), dev (45%) or test (40%) by a fixed hash. Train labels may become few-shot examples in judge sheets. Dev is what we tune judges against. Test is run once, after tuning.
- **Agreement:** `scripts/agreement.mjs` reports two rates per grade, plus one for the checker:
  - catch rate: of the answers Kevin failed, the share the judge also failed;
  - pass rate: of the answers Kevin passed, the share the judge also passed.
  Both should reach 0.85 to 0.9. It also corrects each observed pass rate for judge error and gives a 95% interval. A grade that stays below target gets its own focused judge with less context (on brand and backed first).
- **Re-check** after any change to a judge sheet, the rubric version or the judge model. Add 10 to 20 fresh labels every few rounds.
- **Failure types:** Kevin's notes are grouped into counted failure types in `failure-taxonomy.md` under the round. The most common type picks the next round's one family of changes. New job checks come from observed failures, or from hard rules such as claims law and platform policy.

## Job checks (scored by the checker, not the judges)

Each task in `TASKS.json` has 3 to 6 job checks and known traps. The checker reads one answer, the task's checks and its key, blind to the arm, and marks:
- each check: pass, partial or fail, with a one-line reason;
- each key signal: found and acted on, found but not acted on, or missed;
- each decoy: avoided or taken;
- false signals: findings the answer presents as important that the key and inputs do not support.

A run **passes** the task when every check is pass, no decoy is taken, and there are no false signals presented as a main finding.

## Reproducibility and improvement

- Each arm runs each task 3 times in fresh contexts.
- **pass^3**: the share of tasks where all 3 runs pass. This is the bar for an owner who gets one run.
- **Worst of 3**: the lowest owner score of the 3 runs, per task. **Spread**: highest minus lowest.
- **Improvement**: `compare-rounds.mjs` compares rounds on tune and held-out separately. A change is promoted only if held-out does not fall.

## Forms

The exact sheets are built by `scripts/make-sheets.mjs` from the templates in `judge/`:
- `judge/PAIRWISE.md`: answer A vs answer B, both orders, each order to a fresh judge. A pick counts only when both orders agree; otherwise it is a tie.
- `judge/SINGLE.md`: one answer, the seven grades with reasons and the list of unbacked claims.
- `judge/IMAGES.md`: the image batch form for creative tasks.
- `judge/CHECKER.md`: the job-check form (the only form that sees a key).

## Image grades (creative tasks)

Each rendered image is scored 1 to 10 on: **on brand** (colours, fonts, logo), **design principles** (one message, hierarchy, contrast, readable on a phone), **persona fit** (would it stop the scroll for this buyer), **product faithful** (the real product, right shape, colour and parts), and **no obvious errors** (warped text, extra limbs, wrong logo, broken claims). The judge sees the images in a random order with neutral ids, never the arm.
