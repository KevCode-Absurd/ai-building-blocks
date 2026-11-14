# Work method

**The owner comes first:** if a rule in this pack would make the work worse for this owner's stated goal and data, follow the owner and say why in one line.

Follow `tools/quality/QUALITY-ENGINE-v3.md`; task and brand come first.

**Ask or start:** run the readiness check in `tools/quality/INTAKE.md`: a specific brief starts; a gap that would change the work gets questions first.

**One-shot jobs** (nobody can reply: a test or an API call): decide every open point with the assumption a top practitioner would pick, and finish. Deliver every piece the owner asked for; never drop or water one down to stay safe. At most three assumption lines, only where they change what to do. Never ask for confirmation, a yes, a sign-off or a choice inside the deliverable; no "To confirm" list. A sign-off that law or a platform needs is one line next to its item. **Fast path:** when the brief carries the data and nothing in it is buyer-facing, skip site capture, the taste brief and knowledge reading; read the quality engine's rules and steps 2 to 4 and 8, the matched card and one job skill. Buyer-facing work (ads, copy, emails, pages) never skips the brand brain: build or check it first (`tools/quality/FOUNDATION.md`).

## 0. Frame: the spec sheet

Read `context/brand-file/worked.md` if any, then write `context/spec.md`, one screen:

- **The job:** who must do what after seeing this.
- **Deliverables:** exact count and format, in the client's words, and each explicit ask with where it is met.
- **Signal pass:** the three strongest signals in the owner's data (a winner hidden in an average, an under-used asset, a timing constraint). For each: its number, what it means for the decision, and where the deliverable acts on it. A priority the owner names takes a top slot unless the data clearly says otherwise; then say why in one line.
- **Expert and playbook:** who would own this, and their standard approach in 3 lines; the owner's data overrides it.
- **Depth:** light, standard, full or team (`tools/quality/ROUTING.md`).
- **Assumptions**, one line each. **Mode:** `patch` (default), `extend` or `new`. **Brand file slice:** none, facts, voice, look or full.
- **Rubric:** `node tools/make-rubric.mjs` writes `context/rubric.md` from `context/intake.md`.

## 1. Ground: foundation first, then only what the job needs

Follow `tools/quality/FOUNDATION.md`: gather what the client has, fall back to public sources, and build or check the two layers (foundation and data) before you make anything. For buyer-facing work this is the first thing you do, before any analysis or copy: `node tools/brand-brain.mjs build --from <the folder with their material>`, then write the files it starts, then `node tools/brand-brain.mjs gate --for <kind>` must pass. Capture what the signals and the decision depend on, and no more (`context/README.md`), including the buyer's real setting. Re-check on the day facts that change: prices, offers, stock, ownership, lawsuits.

Unless the slice is none, run `node tools/brand-file.mjs status --for <kind>` and do only what it lists. To capture:

1. Run `node tools/capture-brand-dna.mjs <url>`.
2. Or paste `tools/brand-dna-snippet.js` into the site's console; save the result as `context/brand-dna.json`.
3. Or ask for the URL, screenshots and brand guide.

Save the slice as `context/facts.md`. Use no fact without a source and date. **Look in your own pack first:** `node tools/prepare-job.mjs <brief>`, then `node tools/ask-knowledge.mjs "<question>"` or `knowledge-map.md`; use only what it returns, with sources.

**Can the buyer act today?** Confirm the thing sold is live, in stock, at the stated price and link. If not, build for the option that works and say so in your first line.

## 2. Taste and tools

For buyer-facing work, note the brand codes, 2 admired references, 1 to avoid and named AI defaults in `context/taste-brief.md`.

Your `toolbox.md` lists what to use when; pick at your own discretion and open only what you pick.

## 3. Diverge: real candidates, and someone else chooses

First check the proven levers in the job skill against the live asset. At full depth, make about 3 candidates of the part that decides the outcome, as real work, not descriptions. One is the expert's standard playbook done excellently; clever ones must beat it. They differ on at least two of: promise, proof, structure, buyer moment, offer, visual world. Also write a plain one-pass answer from the brief alone: the yardstick.

A fresh reviewer who has not seen your reasoning (else label the pass SAME-CONTEXT) checks how fully each draft acts on each signal, picks a base and names grafts. If none passes, make one more round only. `node tools/blind-review.mjs` runs both orders; a pick counts only when both agree.

## 4. Build: the craft floor

- **New framing of true facts, never new facts.**
- **Facts and proposals differ.** Facts carry a source. Recommendations are complete and decided. Keep explicitly requested template fields; otherwise no blanks or placeholders.
- **Decide.** One recommendation, which may combine complementary moves; a runner-up only when the options truly exclude each other. Never a menu. Plans add one labelled bolder move (quality engine rule 4); customer copy never carries one.
- **Act fully.** If the deliverable keeps anything a signal says to cut, say why in one line with the number.
- **Be specific:** real names, prices, steps; relative days unless the brief gives dates. Project from the owner's own numbers, with working and a range, labelled as a projection; never in what a buyer reads, and never an invented result.
- **Fit the persona's real moment** in every time, place, unit and channel (quality engine step 4).
- **Match the voice by ear:** 5 real brand lines beside 5 of yours.
- **Length follows use:** stay within the owner's limit, counted the way the owner counts; without one, the family profile in `tools/quality/profiles.json`. A ceiling is never a target. No sections about method or assumptions.
- **Finish the format.** Ads: every platform field, character counts checked with `node tools/quality/copy-check.cjs`, safe areas, landing URL. Emails: subject, preview, one ask, links, exit rule. Plans: totals that add up, steps with owners and relative days. Pages: one action, proof, mobile, load.

## 5. Check: the client's-eye review

A fresh reviewer (as in step 3) gets only the client's brief, the finished deliverable and `context/facts.md`, and answers:

1. Each signal and each rubric line: met fully, partly or not at all.
2. Each claim a buyer or the client will read (prices, counts, ratings, policies, names, delivery times, quotes, product properties): sourced or not.
3. The weakest piece.
4. What is left for the owner to do: questions, sign-offs, choices, placeholders.
5. What can be cut.

Remove each unsourced claim, or rewrite it to what the source says. Never flag or footnote it. Fix 1, 3 and 4, cut 5, checked with outside evidence, not rereading; two repair rounds at most. Run `node tools/check-handover.mjs <deliverable> <plain answer> --profile <family>` and fix every hit. Then run the v3 reading, proof and render checks. Last, a fresh reader chooses between anonymous final and plain; lower clarity vetoes the final.

**Gates.** Answers 1 and 2, the brand brain gate for buyer-facing work (`brand-brain.mjs gate`), the creative-set check for a set of static ads (`check-creative-set.mjs`), the buyer-can-act check, access, the finished format, the hand-over check and the job skill's own gates are pass or fail. No craft score makes up for a failure.

**Craft.** "Does the job" (for the buyer or the decision) weighs most, 30 of 100. "Own material" weighs 10: proof or ideas a generic answer would lack. `context/rubric.md` scores the same craft lines after the owner's own.

## 6. Hand over, and learn

- The native work comes first; its first screen holds the decision, the numbers the owner asked for by name, every piece of bad news, and the first move this week.
- Nothing internal reaches the client: no working notes, signal maps, ledgers or monitoring lines in what the customer reads. Supporting detail goes in an appendix inside the deliverable, only if needed.

After the work, in your own message, give the rubric scorecard (`make-rubric.mjs check`). Keep working notes in `DECISIONS.md`. Record client feedback with `node tools/brand-file.mjs learn`. Add shared lessons to "Rules I learned" in playbook.md: scoped, naming what won and failed.
