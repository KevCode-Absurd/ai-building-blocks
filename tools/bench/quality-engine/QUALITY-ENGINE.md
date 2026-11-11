# The Quality Engine (v2)

Goal: for any request, a result the person would choose over one plain attempt by the same model. v1 was more accurate but lost on clarity, usefulness and judgment. v2 keeps the facts discipline and fixes those.

## The ten rules
1. **Score like the reader.** The checker judges as the person who asked and as a top practitioner in the field, using CHECKER.md (calibrated against outside judges). Final picks are pairwise: "which would you use?".
2. **Facts vs proposals.** Facts must be sourced and current: re-check anything time-sensitive (deals, prices, stock, store counts, lawsuits) on the live web before use. Proposals (offers, commitments, owners, timelines, numbers you recommend) are given boldly and completely, labelled "Proposal: confirm before use" where sign-off is needed. A finished deliverable never contains blanks, placeholders, [INTERNAL], TBD or UNKNOWN in the body.
3. **Standard playbook first.** One draft is always the approach a top practitioner would normally take, done excellently. Creative angles must beat it to win. Avoid clever moves that create new risk (for example repeating the attacker's framing, or an untested metric).
4. **Field expert.** Each job names the expert who would own it (e.g. crisis communications lead, growth lead, retail account manager, regulatory counsel, lifecycle marketer). Makers and checker work as that expert. Use the matching agent pack from the expert index when one exists: read its soul.md and use its know-how.
5. **Length follows the reader's need (v2.1: with a ceiling).** Answer the core ask head-on in the opening lines. Then the working parts the reader will actually use (scripts, owners, timelines, decision tables, templates). Measure length in code against the plain draft: aim for at most 1.3x its words, never above 1.6x unless the request itself asks for more. "One page" means one printed page (about 450 words). Extra material goes in a short appendix only if the reader will use it, and it counts toward the ceiling. Cut repeated rationale, long sourcing notes (keep a compact source list), alternatives the reader did not ask for, and anything that explains the method.
6. **Edit for the reader, then leak-check.** Final pass: plain words, the decision first, scannable structure, consistent voice. Nothing internal: no file names (facts.md, research.md), no workflow words, no notes to self. Open questions go in one short "To confirm" box at the end. Run the leak-check tool and fix every hit.
7. **Merge, don't just pick.** Start from the best draft and graft the strongest parts of the others, including the plain draft.
8. **Spend effort where it helps.**
   - light: playbook draft + plain draft, then check, merge, edit. For short, voice-led or persuasive outputs (ads, replies, briefs, pitches, emails) unless stakes are high.
   - full: playbook draft + one creative or alternative-method draft + plain draft. For analysis, plans, pages, reviews, anything accuracy-heavy or high-stakes.
   - team: when the task clearly needs two or more different experts in separate parts (e.g. comms + legal, analysis + creative). Specialists write parts, a lead integrates; a playbook solo draft and the plain draft also compete.
9. **Lessons that prove themselves.** Lessons are scoped (this company, or this kind of task), two-sided (what won as well as what to avoid), and short. No rule that pushes outputs shorter or more defensive than the reader needs. A lesson is kept only if it names a concrete error or win it would have changed.
10. **The benchmark is the referee.** Changes ship only if they win the blind benchmark (several brands, common and held-out tasks, mixed judge models, judge groups reported separately).

## Steps
0. Company memory: company/<slug>/facts.md, market.md, preferences.md, lessons.md.
1. FRAME → contract.md: reader and use; the fixed core criteria (usefulness 25, clarity 20, judgment 20) plus 3-5 request-specific criteria (35 total); failure modes; facts needed; the expert; the standard playbook in 3-5 lines; depth (light/full/team); shape (summary + kit); assumptions (state them, the person is not available).
2. GROUND → research.md: missing facts plus a freshness re-check of every time-sensitive fact, with sources and dates.
3. MAKE: drafts per depth (rule 8). Plain draft from the request alone.
4. CHECK: CHECKER.md on all drafts, blind. Returns a ranking, the base draft and a merge plan.
5. MERGE → merged draft from the base plus grafts, applying rules 2 and 5.
6. EDIT → final, applying rule 6 and the leak-check tool.
7. GATE: blind pairwise, final vs plain draft, by CHECKER.md. If the plain draft wins, it is edited (rule 6) and shipped instead.
8. RECORD: lessons per rule 9.
