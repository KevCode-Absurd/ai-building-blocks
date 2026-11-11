# The Quality Engine (v3.1)

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

Match cards/INDEX.md and read the card; use cards/_any.md if none fits. Read its profile, the assigned lead's soul.md and, above light depth, playbook.md and selected skills. Write the expert's standard approach in three lines. Choose consumer, business or specialist reading level. Read only relevant scoped lessons.

## 2. Ground what the decision needs

Take the smallest useful client-memory slice. Fill missing facts from primary sources, with dates. Recheck time-sensitive facts and actual link destinations. Compute numbers in code on one stated basis. If something cannot be verified, omit the claim or make its uncertainty clear outside customer copy.

For decisions, verify the core design before drafting: one question, a valid comparison, a denominator, and a useful time horizon. A price-only test keeps packaging fixed. Separate early signals from mature outcomes; do not turn an immediate decision into an unasked multi-year program.

## 3. Make real alternatives at the right depth

Every depth has an expert draft and a plain request-only draft. Full adds a distinct creative alternative. Team uses specialists only for parts needing different expertise, with one lead integrating them. Light and standard have no creative third draft. Candidates are actual work, never descriptions.

Use CHECKER-v3.md on anonymous drafts. A fresh reader is preferred; otherwise label the internal review SAME-CONTEXT. Check the requested artifact, card must-haves, claims and core decision before polishing. Pick the clearest usable base and name only indispensable grafts.

## 4. Build the native piece first

Put the requested copy, page, checklist, template or decision first. Add setup notes only if needed to use it; keep them separate and avoid repeating the argument. No default preamble for self-explanatory short copy. Do not add contracts, fee proposals, packages or options just to look complete.

For support macros, use available order-system merge fields instead of asking the customer to repeat known details. Request only missing essentials. Never ask for a photo of an absent item. Policy wording, permitted actions and exception routes must be correct.

## 5. Edit for reading effort and channel

Follow CLARITY.md and VOICE.md: answer promptly, one idea per sentence, ordinary words, useful headings and narrow tables. Keep technical detail where the reader uses it; don't compress it into codes or slash stacks. Preserve necessary operating detail without surrounding the native piece with a manual.

For customer-facing copy, compare channel-matched brand examples and write original lines in that voice. A push, support reply and leadership update need different registers. Generic cheerful filler is not brand voice. Check short copy aloud, then measure it.

## 6. Run mechanical checks on the actual files

- `node tools/quality/wordcount.cjs <final> <plain>`
- `node tools/quality/readability.cjs <final> --audience <consumer|business|specialist>`
- `node tools/quality/proof.cjs <final> --sources <research> <memory>`
- `node tools/quality/check-format.cjs <final> --contract <output-contract.json>`
- `node tools/quality/leakcheck.cjs <final>`

The output contract comes from the brief, not the draft: required counts, headings, links and verified field limits. The format checker binds its report to both file hashes. Check Markdown header/delimiter/data widths; every requested row and field must survive rendering. Fix every failure; resolve warnings honestly. Offline proof does not check live destinations.

Use --requested-template only when the request explicitly requires input fields. It accepts those fields, not internal notes, TODO, UNKNOWN or invented actuals. Do not claim that a template's future filled values were checked. Finish the hand-over check with the matched family profile.

## 7. Look at visual work

For pages, layout emails, decks and image ads, render and inspect phone first, then desktop. `node tools/quality/render.cjs <page.html> <prefix>` captures both; the host may set PW_CHANNEL to an installed browser. Read every slice, tables and expanded states. Check clipping, hierarchy, legibility, links and keyboard access. Repair and look again.

## 8. Fresh final choice with a clarity floor

Give a fresh reader only the original request and anonymous final/plain candidates in shuffled order, plus actual renders. Exclude origins, writer rationale and earlier outside verdicts. They check factual and requested-format gates, then the effort needed to read and use the native piece.

Lower clarity vetoes a candidate even if its weighted total is higher. Choose the clearer usable work; break a clarity tie on usefulness. If neither is usable, make one narrow repair round and obtain a fresh check. Freeze the selected artifact unchanged. A later edit needs a new check.

Without a fresh reader, use plain as the base plus only necessary verified fact or requirement repairs. Label SAME-CONTEXT; do not claim an independent gate or validated improvement.

## 9. Hand over and learn narrowly

Deliver the actual files and an honest verification receipt. Keep working notes and rejected drafts private. A To confirm box contains only unresolved decisions needed before use.

Record a lesson only for a concrete error or win: its scope, what worked and what to avoid. Keep client corrections in that client's project. OUTCOME-SIGNALS.md describes opted-in local feedback; it adds no server endpoint. Test proposed method changes on fresh blind cases before promotion. No AI score establishes customer acceptance or business lift.
