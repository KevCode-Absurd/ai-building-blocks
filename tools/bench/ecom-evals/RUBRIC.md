# Owner rubric for the e-commerce eval suite

This is how the owner grades an answer. There are seven grades, in the owner's order of importance. Each is scored 1 to 10. On top of them sit the task's own job checks (from `TASKS.json`, scored by the checker), reproducibility across 3 runs, and round over round improvement.

The judge sees: the owner's question, the task's outcome, the principle sets that apply, the inputs the arm had, and the answer or answers. The judge never sees which arm made an answer, word counts, file names, the job checks or the answer key.

<!-- grades:start -->
## The seven grades

Score each grade 1 to 10. Use the anchors. Mark "unknown" only if the answer gives you nothing to judge that grade on.

### 1. On brand: design, voice and the target persona (most important)
Does it sound like this brand, look like this brand, and speak to the persona the task targets? Use the Org context in the inputs. For an internal deliverable (an audit or plan), judge whether its recommendations, examples and any copy fit this brand and its buyers.
- **9 to 10:** Reads as if the brand's own best writer and designer made it. Uses the voice rules, real palette and type, and the persona's own words. Nothing a customer would find off.
- **7 to 8:** Clearly on brand with small slips (a generic line, a missed persona phrase).
- **4 to 6:** Generic but not wrong. Could be any brand in the category.
- **1 to 3:** Off brand: wrong tone, banned words, wrong colours or claims, or speaks to the wrong buyer.

### 2. Follows the best principles of the job's domain
Does it apply what a senior practitioner in this discipline would apply? The task lists the principle sets (for example media buying, direct-response copy, visual design, CRO). Our principle books (`R/marketplace/knowledge/ecommerce/principles/`) are one anchor, but judge by sound domain practice from any good source.
- Copy: awareness level, one big idea, mechanism, proof, objections handled, a clear offer and ask, real psychological levers.
- Creative: one message, clear hierarchy, contrast, product visible, legible on a phone, built from what already won.
- Audits and plans: a senior practitioner's method (right unit of analysis, true numbers before platform numbers, ranked by money, tests sized to reach a read).
- **9 to 10:** A senior practitioner would sign it. Principles applied, not name-dropped.
- **7 to 8:** Sound method with one gap.
- **4 to 6:** Some principles, missing a core one (no proof, no ranking, no test logic).
- **1 to 3:** Breaks basic practice (scales on CTR, copy with no ask, a design that cannot be read on a phone).

### 3. Logically sound
Does the reasoning hold, and does each recommendation follow from the evidence?
- **9 to 10:** Every step follows; trade-offs and risks are named; no contradictions.
- **7 to 8:** Sound, with a small leap.
- **4 to 6:** Some conclusions do not follow, or it contradicts itself once.
- **1 to 3:** The main recommendation does not follow from the evidence, or the answer acts against its own findings.

### 4. Backed by sound sources
Does every important claim or insight rest on the owner's data or a sound source? A sound source is credible, checkable, dated, relevant and on point. It can be our library or anyone's. Not everything must be unique, but there must be something grounded that plain AI would not give. Mark each unbacked, stale, weak or off-point source you find, and every number that does not trace to the inputs.
- **9 to 10:** All key claims trace to the inputs or to named, sound, current sources; numbers recompute; nothing invented.
- **7 to 8:** Well backed, one or two loose claims.
- **4 to 6:** Several claims stated as fact without support, or a number that does not trace.
- **1 to 3:** Invented facts, figures, reviews or certifications, or a decision built on a wrong number.

### 5. Serves the task's outcome (first, second and third order)
Score against the outcome written for this task, not a generic "more revenue". Will it get the store the first-order effect, and does it set up the second and third? Does it answer what the owner asked?
- **9 to 10:** Delivers the first-order outcome and sets up the second and third; answers exactly what was asked.
- **7 to 8:** Delivers the first-order outcome; later effects partly covered.
- **4 to 6:** Useful but would not move the outcome much, or answers a nearby question.
- **1 to 3:** Would not move sales or cost, or works against the outcome.

### 6. Understandable, interpretable, actionable (the main bar)
Can the owner understand it, see why, and act on it today? Grade 8 to 9 reading level, short sentences, the first screen gives the answer, scannable, usable as is (no placeholders, no notes to self).
- **9 to 10:** The first screen answers the question; the why is clear; the owner can act today without edits.
- **7 to 8:** Clear and usable with light edits.
- **4 to 6:** The answer is there but buried, dense, or needs rework.
- **1 to 3:** Hard to follow, jargon-heavy, unfinished, or not usable.

### 7. Unique insight beyond the norm (rewarded when present)
Outside-the-box thinking from first principles and depth beyond the standard playbook. A standard-playbook answer can still pass the other grades but scores lower here.
- **9 to 10:** Finds something non-obvious in the data and turns it into a move. Anchor for ads and email tasks: digging the breakdown to find that one segment buys through one format (for example, women 65+ buying through single-image ads), then proposing to test that format with a message tuned to them.
- **7 to 8:** At least one sharp, specific idea most specialists would miss.
- **4 to 6:** Competent standard playbook.
- **1 to 3:** Generic advice that any template would give.

## Owner score
The owner score is a weighted mean of the seven grades: on brand 20%, principles 15%, logic 15%, backed 15%, outcome 15%, actionable 12%, insight 8%. Grades marked unknown are dropped and the weights are rescaled.
<!-- grades:end -->

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
