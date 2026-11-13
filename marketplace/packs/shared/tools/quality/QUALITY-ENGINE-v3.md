# The Quality Engine (v3.4)

Goal: finished work the reader would choose over one plain attempt. The task, requested format and brand come first. Truth, access and action permissions always apply. All files below are under tools/quality/; client memory stays in context/brand-file/ in the client's own project.

## Rules

1. **Facts versus proposals.** Source and date facts. Recheck changing prices, offers, terms and product availability. Never invent actual results. State necessary proposals plainly; put sign-offs once in a short To confirm box outside publishable copy.
2. **Deliver the requested artifact.** An email is the email; a fill-in update is the update with named fields. Advice about writing it is not the deliverable. Preserve fields explicitly requested for templates or per-customer macros. Otherwise no blanks, internal notes, method talk or unfinished markers.
3. **Length follows use.** Match the family aim, ceiling, shape and reading time in profiles.json. The ceiling is not a target. The brief can ask for more. Direct customer copy stays no longer than plain unless the request requires it. A short, dense draft still loses.
4. **Standard playbook first.** Use the assigned expert and already equipped toolbox; do not search the library at job time. Clever additions must earn their place. Do not change a product package, offer, audience or experimental variable beyond the ask.
5. **Blind evidence decides changes.** Automated checks are diagnostics, not proof of clarity or factual truth. A fresh reviewer must make the final clarity choice; same-context critique is labelled honestly. Customer use and business results are separate from AI preference.

## 1. Frame the actual job

Write context/spec.md: reader, use, channel, hard constraints, success measure and time span, and what done means. Name the actual deliverable, counts, fields and acceptance tests. Inspect existing work before replacing it; patch by default unless new work is requested.

Read INTAKE.md and ROUTING.md. Interactive use asks at most three costly unknowns, together, with defaults. One-shot use states reasonable assumptions and proceeds. Choose light, standard, full or team, with the deciding signal. Stakes add a claims check, not drafts or length.

Match cards/INDEX.md and read the card; use cards/_any.md if none fits. Apply the must-haves that fit the asked scope: one reply is not a macro set, one first-touch email is not a sequence (annex.quality_engine.scope_note says which apply). Read its profile, the assigned lead's soul.md and, above light depth, playbook.md and selected skills. Write the expert's standard approach in three lines. Choose consumer, business or specialist reading level. Read only relevant scoped lessons.

## 2. Ground what the decision needs

Take the smallest useful client-memory slice; annex.brand_context names it. A reply, a first-touch email, a memo or a brief rests on the request's facts and sourced public facts, plus real voice lines for customer copy. It needs no site capture, screenshots or taste brief. Fill missing facts from primary sources, with dates. Recheck time-sensitive facts and actual link destinations. Compute numbers in code on one stated basis. If something cannot be verified, omit the claim or make its uncertainty clear outside customer copy.

For decisions, verify the core design before drafting: one question, a valid comparison, a denominator, and a useful time horizon. A price-only test keeps packaging fixed. Separate early signals from mature outcomes; do not turn an immediate decision into an unasked multi-year program.

## 3. Make real alternatives at the right depth

Every depth has an expert draft and a fresh plain request-only draft. Read plain before editing: use its correct, useful native content as the starting base. Improve it with the equipped expert's judgment, factual corrections and structure. Do not rewrite a strong piece merely to sound expert. Full adds a distinct creative alternative. Team integrates specialist parts under one lead. Light and standard have no third draft. Candidates are actual work.

Keep a private coverage ledger: requested result, useful action or evidence in plain, where it survives in the final, and a reason for any removal. Preserve the actor, condition and concrete next step; research prompts that capture examples and consequences; decision authority, unknown ownership and repeatable records; and reproduction details a receiving owner needs. Include these only where the job uses them. Replace vague shortcuts such as "check next steps" with the applicable action. Improve layout before cutting useful substance.

**Expert edge.** Before editing, list up to three edge items: what this expert adds that the plain draft lacks. Count only items specific to this client and checkable: a current fact from the client's material or a primary source that changes the work; a card must-have that plain misses; a card failure mode that plain commits; or a ready-to-use piece the reader would otherwise build (the filled table, the exact string, the decision rule, the merge field). General advice, extra caveats and longer explanations are not edge items. Build each one into the native piece within the family aim. A strong plain draft still gets its edge items; the expert's job is to add what only an expert would, not to restyle.

At full and team depth, use CHECKER-v3.md on the anonymous drafts with a fresh reader, else label the review SAME-CONTEXT. At light and standard depth, check the drafts yourself against the card and build; the one fresh reader comes at step 8 and also runs the checker's gates. Either way, check the requested artifact, card must-haves, claims and core decision before polishing. Pick the clearest usable base and name only indispensable grafts.

## 4. Build the native piece first

Put the requested copy, page, checklist, template or decision first. Add setup notes only if needed to use it; keep them separate and avoid repeating the argument. No default preamble for self-explanatory short copy. Do not add contracts, fee proposals, packages or options just to look complete.

For support macros, use available order-system merge fields instead of asking the customer to repeat known details. Request only missing essentials. Never ask for a photo of an absent item. Policy wording, permitted actions and exception routes must be correct.

## 5. Edit for reading effort and channel

Follow CLARITY.md and VOICE.md: answer promptly, one idea per sentence, ordinary words, useful headings and narrow tables. Keep technical detail where the reader uses it; don't compress it into codes or slash stacks. Preserve necessary operating detail without surrounding the native piece with a manual.

For customer-facing copy, compare channel-matched brand examples and write original lines in that voice. A push, support reply and leadership update need different registers. Generic cheerful filler is not brand voice. Check short copy aloud, then measure it.

## 6. Run mechanical checks on the actual files

One command runs them all and prints one short report:

- `node tools/quality/qe-check.cjs <final> --plain <plain> --audience <consumer|business|specialist> --sources <facts files> --max-words <n>` (or `--contract <output-contract.json>`)

It runs these, which also work alone:

- `node tools/quality/wordcount.cjs <final> <plain>`
- `node tools/quality/readability.cjs <final> --audience <consumer|business|specialist>`
- `node tools/quality/proof.cjs <final> --sources <research> <memory>`
- `node tools/quality/check-format.cjs <final> --contract <output-contract.json>`
- `node tools/quality/leakcheck.cjs <final>`

The output contract comes from the brief, not the draft. Require exact headings, column names or URLs only when the brief specifies those exact strings. Keep semantic requirements in a separate manual checklist; do not turn your own design choices into acceptance rules. The format checker binds its report to both file hashes. Check table widths and requested fields. Fix truth, format and leak failures; use readability targets as diagnostics without deleting needed operating detail. Offline proof does not check live destinations.

Use --requested-template only when the request explicitly requires input fields. It accepts those fields, not internal notes, TODO, UNKNOWN or invented actuals. Do not claim that a template's future filled values were checked. Finish the hand-over check with the matched family profile.

## 7. Look at visual work

For pages, layout emails, decks and image ads, render and inspect phone first, then desktop. `node tools/quality/render.cjs <page.html> <prefix>` captures both; the host may set PW_CHANNEL to an installed browser. Read every slice, tables and expanded states. Check clipping, hierarchy, legibility, links and keyboard access. Where an image ad carries a logo or wordmark, run `node tools/quality/check-logo-contrast.cjs <ad.png> --box x,y,w,h` on the box where it sits; below 3:1, switch to the light or dark logo version or move it to a calmer area. Native and creator-style ads may rightly carry no logo. Repair and look again.

## 8. Fresh final choice with a clarity floor

Give a fresh reader only the original request and anonymous final/plain candidates in shuffled order, plus actual renders and the facts the work rests on. Exclude origins, writer rationale and earlier outside verdicts. They check the checker's gates (requested artifact, truth, core decision, working format, useful coverage) and each acceptance test, mark every claim sourced or not, then judge the effort needed to read and use the native piece. At light and standard depth this is the only fresh pass.

"Usable" means the receiver can perform the job without reconstructing a missing action, condition, evidence field or handoff detail. Compare useful coverage as well as stated requirements. Lower clarity or a material usefulness regression vetoes a candidate even if its weighted score is higher. Choose the clearer fully useful work; break a clarity tie on usefulness. When clarity and usefulness also tie, choose the candidate whose verified edge items the reader confirms as correct and useful, unless it runs past the family aim. Ship the plain draft unchanged only when no edge item survives that check. If one is clearer but loses useful substance, make one narrow repair to restore that substance in the clearer layout, then obtain a fresh check. If neither is usable, use the same bounded repair round. Freeze the selected artifact unchanged. A later edit needs a new check.

Without a fresh reader, use plain as the base plus its verified edge items and necessary fact or requirement repairs. Label SAME-CONTEXT; do not claim an independent gate or validated improvement.

## 9. Hand over and learn narrowly

Deliver the actual files and an honest verification receipt. Keep working notes and rejected drafts private. A To confirm box contains only unresolved decisions needed before use.

Record a lesson only for a concrete error or win: its scope, what worked and what to avoid. Keep client corrections in that client's project. OUTCOME-SIGNALS.md describes opted-in local feedback; it adds no server endpoint. Test proposed method changes on fresh blind cases before promotion. No AI score establishes customer acceptance or business lift.
