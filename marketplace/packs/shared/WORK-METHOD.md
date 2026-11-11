# Work method

Would the client use this over a plain answer?

**Version 3:** follow `tools/quality/QUALITY-ENGINE-v3.md`: routing, cards, profiles, clarity, proof and visual checks. Task and brand come first; existing gates apply. No library search at job time.

## 0. Frame: the spec sheet

Read `context/brand-file/worked.md` first, if any: what this client kept and killed. Then write `context/spec.md`, one screen:

- **The job:** who must do what after seeing this.
- **Deliverables:** exact count and format, in the client's words.
- **Acceptance tests:** 5 to 7 questions the client would ask: two or more on the commercial job, one each on readiness, truth and clarity.
- **Expert and playbook:** who would own this, and their standard approach in 3 lines.
- **Depth:** light, standard, full or team, using `tools/quality/ROUTING.md`; stakes add a claims check, not more drafts.
- **Decisions and assumptions**, one line each. **Mode:** `patch` (default), `extend`, or `new` only when nothing exists. **Brand file slice:** none, facts, voice, look or full.

## 1. Ground: only what the job needs

Capture what the acceptance tests depend on, and no more (`context/README.md`), including the buyer's real setting. Re-check on the day facts that change: prices, offers, stock, ownership, lawsuits.

Unless the slice is none, run `node tools/brand-file.mjs status --for <kind>` and do only what it lists. To capture:

1. Run `node tools/capture-brand-dna.mjs <url>`.
2. Or paste `tools/brand-dna-snippet.js` into the site's console and save the result as `context/brand-dna.json`.
3. Or ask for the URL, screenshots and brand guide.

Save the slice as `context/facts.md`; read only that. Use no fact without a source and date, or from a RECHECK line.

**Can the buyer act today?** Confirm the thing sold is live, in stock, at the stated price and link. If not, build for the option that works and say so in your first line.

## 2. Taste and tools

For buyer-facing work, note the brand codes, 2 admired references, 1 to avoid and named AI defaults in `context/taste-brief.md`.

Your `toolbox.md` lists what to use when; pick at your own discretion and open only what you pick.

## 3. Diverge: real candidates, and someone else chooses

First check the proven levers in the job skill against the live asset.

At full depth, make about 3 candidates of the part that decides the outcome, as real work, not descriptions. Light and standard use an expert draft and the plain yardstick; full adds a creative draft; team uses specialist parts and a lead. One is the expert's standard playbook done excellently; clever ones must beat it. They differ on at least two of: promise, proof, structure, buyer moment, offer, visual world. Also write a plain one-pass answer from the brief alone: the yardstick.

Give the brief, spec and unlabelled drafts to a fresh reviewer who has not seen your reasoning (else label the pass SAME-CONTEXT). They check each acceptance test, pick a base and name what to graft. If none passes, make one more round only.

## 4. Build: the craft floor

- **New framing of true facts, never new facts.**
- **Facts and proposals differ.** Facts carry a source. Recommendations are complete; sign-offs go once in a short "To confirm" list outside publishable copy. Never blanks or placeholders.
- **Decide.** One recommendation, the runner-up in a line. Never a menu.
- **Be specific where the client will act:** real names, prices, dates, steps. Working figures only for planning numbers the client tunes; never in what a buyer reads, never as a revenue forecast.
- **Match the voice by ear:** 5 real brand lines beside 5 of yours.
- **Length follows use:** the family profile in `tools/quality/profiles.json` sets the aim, ceiling and shape. A ceiling is never a target. The brief can ask for more. Customer copy stays no longer than the plain draft; one page is about 450 words.
- **Finish the format.** Ads: every platform field, character counts, safe areas, landing URL. Emails: subject, preview, one ask, links, exit rule. Plans: totals that add up, dated steps, owners. Pages: one action, proof, mobile, load.

## 5. Check: the client's-eye review

A fresh reviewer (as in step 3) gets only the client's brief, the finished deliverable and `context/facts.md`, and answers:

1. Each acceptance test: pass or fail, with the line that proves it.
2. Each claim a buyer or the client will read (prices, counts, ratings, policies, names, delivery times, quotes, product properties): sourced or not.
3. The weakest piece, and why a buyer would skip it.
4. What the client must ask before using it.
5. What can be cut.

Remove each unsourced claim, or rewrite it to what the source says. Never flag or footnote it. Fix 1, 3 and 4, cut 5. Run `node tools/check-handover.mjs <deliverable> <plain answer> --profile <family>` and fix every hit. Run the v3 reading and proof checks; render visual work at phone and desktop sizes, inspect it, then repair. Last, the reviewer picks, unlabelled, between the deliverable and the plain answer; if the plain one wins, fix and hand over that.

**Gates.** Answers 1 and 2, the buyer-can-act check, access, the finished format, the hand-over check and the job skill's own gates are pass or fail. No craft score makes up for a failure.

**Craft.** "Does the job" (for the buyer or the decision) weighs most, 30 of 100. "Own material" weighs 10: an idea or proof from this business that a generic answer would lack.

## 6. Hand over, and learn

- The work comes first, opened by 3 to 5 lines: the decision, why, what to confirm.
- Nothing internal reaches the client. Supporting detail goes in an appendix inside the deliverable; open questions in one short "To confirm" list.
- Headings state the point; sentences are short; tables only compare.

Keep working notes in `DECISIONS.md`. Record client feedback with `node tools/brand-file.mjs learn`. Add shared lessons to "Rules I learned" in playbook.md: scoped, naming what won and failed. Opted-in outcome signals propose changes; blind evaluation decides.
