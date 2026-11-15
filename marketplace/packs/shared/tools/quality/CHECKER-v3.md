# Checker brief (v3.5)

At light and standard depth one fresh reader does all of this once, on the finished candidates: the gates, the owner's questions and checks, and the final choice.

Judge as the owner who wrote the brief and will live with the result, with a seasoned practitioner's eye. Read the owner's original brief and its data, never only your own spec, and the actual anonymous artifacts. A fresh checker did not write them and has not seen origins, writer rationale or previous outside verdicts. Otherwise label the review SAME-CONTEXT and do not certify an independent final gate. `node tools/blind-review.mjs prepare --brief <owner brief>` writes the sheet with the questions and checks below.

## Gates before scores

1. **Requested artifact.** The answer is the actual requested email, page, checklist, analysis or fill-in draft, with the right counts and fields. Writing instructions do not substitute for the artifact. Preserve input fields explicitly requested for templates or per-customer macros; never invent actual company results to fill them.
2. **Truth.** Verify material changing facts with dated primary sources. Match evidence to the exact claim and recompute arithmetic. A confident wrong price, policy or regulated claim is serious. An honest uncertainty is different from a proven error. Missing private facts do not justify invented actuals.
3. **Core decision.** Answer the actual question. Hold other factors fixed in a single-variable test. Match the metric, denominator, audience and time span to the decision the owner must make. Moves that serve the same goal belong in the one recommendation; do not add an unrequested package, offer, audience, contract or long program to seem sophisticated.
4. **Working format.** Run proof.cjs, check-format.cjs against a brief-derived contract, and leakcheck.cjs. Exact headings, headers and URLs are required only if the request names them; the writer's own design choices are not acceptance rules. Verify other semantic requirements manually. Use --requested-template only for intentionally requested fields. Check table widths, links and actual renders. A source hash proves correspondence, not semantic quality.
5. **Useful coverage.** Compare what the receiver can do with each artifact. A shorter piece fails this gate if it loses a needed actor, condition, next action, evidence prompt, repeatable field, decision authority or reproduction detail. These are task-dependent, not extra fields to add everywhere. Read the private coverage ledger during internal editing; the fresh final reader sees only the work and request.

Use cards/INDEX.md and the matching family card; mark each applicable must-have met or missed. A failure of truth, permission, requested format or an indispensable requirement is not averaged away by craft.

## Owner scores

Score each draft 1 to 10 on the owner's nine questions. A 10 is what the best specialist the owner could hire would hand them; a 5 is usable only after real rework.

| # | Dimension | The owner asks |
|---|---|---|
| 1 | Fit | Is it built on my numbers and my situation, acting on the signals in my data? |
| 2 | New insight | Does it show me something I did not know, or a gap in my thinking? |
| 3 | Priorities | Highest leverage and lowest effort first, a first step this week, and what to stop? |
| 4 | Reasoning | Does it say why each move fits my case, with no contradictions and risks named? |
| 5 | Correct | Does every number trace to my data with the working shown, nothing invented? |
| 6 | Clear | Can I read it fast and know what to do? |
| 7 | Voice | Customer copy in our voice and our customers' words; internal work pitched for its reader? |
| 8 | Range | Real options, with at least one good idea I would not have had? |
| 9 | Ready to use | Could I run it tomorrow with small tweaks, with no placeholders and no homework? |

The overall score is the owner's gut call, not an average: one serious fault (a wrong number that changes a decision, an invented fact, an off-brand customer line) can sink a draft. For light tasks, use the gates, the three checks and a quick preference rather than a full scorecard.

Then run three checks and quote the words that prove each:

1. **Signals.** The signals in the owner's data that change the decision, as many as the data holds, or none, each with its number. Mark each draft fully, partly or not at all on each. Partly means it quotes the signal but keeps what the signal says to cut, or plays down what it says to push.
2. **Left for the owner.** Questions, confirm lists, requests for a yes or sign-off, alternates to pick between, placeholders, notes to the writer. A permission the law needs, in one line next to its item, does not count.
3. **Rule over owner.** Any place a draft follows a stock rule or template where the owner's goal and data point the other way.

The owner's data comes first; the standard approach done well is the default when the data says nothing new. A bolder move counts for range when it is sized and its risk is named.

Pick the clearest usable base. Graft only a necessary fact, requirement or working part from another draft, as its own plain sentence, row or field. Do not graft every useful-looking appendix. If none is usable, allow one narrow repair round.

## Read clarity as a user would

Judge the native piece separately from setup notes. Does it answer promptly? Can the reader find and use the next action? Is the operating detail placed where needed rather than compressed into codes, slash stacks, dense tables or repeated disclaimers?

Readability, sentence length and the family ceiling are diagnostics, not proof. Run readability.cjs on both candidates with the correct audience, and wordcount.cjs against plain. The owner's word limit wins: stay within it. A ceiling is not a target. Neither longer nor shorter automatically wins.

For customer copy, check the actual channel against a few short public brand examples. Generic enthusiasm is not brand voice. Keep disclosures concise but correctly placed. For internal work, clarity beats a house style.

## Final anonymous choice

Check both candidates fully. The final is the draft the owner would rather pay for. Usable means ready for the owner's actual next action, not merely free of forbidden claims. A missed or half-acted signal, homework left for the owner, lower clarity or material usefulness loss vetoes a final, even if its other scores are higher. If both still tie, compare what each adds that the other lacks: a correct client-specific fact, a card must-have, an avoided card failure or a ready-to-use piece. Prefer the one whose additions you confirm as correct and useful, unless it runs past the owner's limit or the family aim; call it a tie only when neither adds anything you can confirm. If the clearer piece loses useful substance, request a narrow restoration in that clearer layout and a fresh check. Do not settle for a vague version or an unnecessarily dense one.

Return the owner scores, the three checks, usable/not usable with the failing gate, selected label, concrete reasons and indispensable repairs. If neither can ship, return repair-needed. Freeze a chosen artifact unchanged; any later edit requires checking the changed version again.

Without a fresh reader, plain is the base with its verified edge items and necessary fact or requirement repairs. Record the limitation honestly. AI preference scores are not customer acceptance, legal sign-off or measured business results.
