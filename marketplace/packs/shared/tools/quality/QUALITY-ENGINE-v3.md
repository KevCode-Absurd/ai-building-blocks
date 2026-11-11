# The Quality Engine (v3)

Goal: for any request, a result the person would choose over one plain attempt by the same model. Blind tests showed that clarity comes from short, plain sentences, not fewer words; the right depth beats more drafts; and each kind of job has its own must-haves and length.

Engine files named below sit in tools/quality/. Company memory stays in the client project under context/brand-file/. The task and brand requirements take precedence over general style. A reviewer without a fresh context is recorded as SAME-CONTEXT, never independent.

## Rules that hold at every step

1. **Facts vs proposals.** Facts are sourced and current; re-check anything time-sensitive (prices, offers, stock, locations, deal status, legal disputes, deadlines) live before use. Proposals (offers, owners, dates, budgets, numbers you recommend) are stated plainly and completely. Items that need sign-off are listed once in the "To confirm" box, not stamped inline. Mark a figure "estimate" or "proposed" only where a reader could take it for a fact. A finished deliverable never contains blanks, placeholders, bracket slots ("[Your name]"), [INTERNAL], TBD or UNKNOWN.
2. **No internal notes.** No file names, workflow words, review tags, "checked live" stamps or notes to self. Open items and assumptions go in one short "To confirm" box at the end, outside any text meant to be published or sent; skip the box when nothing is open.
3. **Length by family profile.** Its `ceiling` (times the plain draft's words) is a cap, never a target; pass it only when the brief asks for more. Its `aim` is the typical winning ratio, reached only with parts the reader will use. The piece the reader uses directly (an ad, email, buyer page, public reply) stays no longer than the plain draft's version; kits, tables and scripts follow under labels. "One page" means one printed page, about 450 words. A short, dense draft still loses.
4. **Standard playbook first.** One draft is always what a top practitioner would normally do, done excellently. Clever moves that add risk lose.
5. **The benchmark is the referee.** Changes ship only if they win the blind benchmark.

## Steps

Light depth uses the checker's quick check in step 4 and runs step 7 only when the piece has figures or links. Step 8 runs only for visual pieces. Every other step runs at every depth.

### 1. Intake and frame → contract.md
- **Company memory:** facts.md, market.md, preferences.md, lessons.md, and voice.md if present.
- **Intake (INTAKE.md):** write the six lines: reader, use, channel, constraints, success measure over the real time span, done. One-shot use: never ask; pick the assumption a top practitioner would pick and build on it fully. Interactive use: at most three questions, each with a default.
- **Depth (ROUTING.md):** record one depth (light, standard, full, team) and the deciding signal. When torn, take the lower depth. Stakes add a claims gate to the check, never drafts or length. A reviewer (legal, claims, finance) checks; never writes.
- **Family card:** match the request by family name or alias in cards/INDEX.md and read that card (cards/_any.md if none fits). Copy its must-haves and failure modes into the contract, leaving out any that do not apply to this request.
- **Profile:** the same family in profiles.json (explained in PROFILES.md): aim, ceiling, shape, reader minutes. Where card and profile differ on length, the profile wins.
- **Expert:** use the lead assigned to this job and its already equipped soul.md, playbook.md, skills.md and toolbox.md. Pick its tools at your discretion. For mixed work use the assigned helpers; do not search the library at job time.
- **General lessons:** at standard depth and above, read the lessons-general.md entries that match this job.
- **Playbook:** that expert's standard approach in 3-5 lines.
- **Audience level** for the reading check: consumer, business or specialist.

### 2. Ground → research.md
Fill the missing facts. Re-check every time-sensitive fact live, with source and date. Compute every number in code with its base shown.

### 3. Drafts by depth
- **Expert draft (all depths):** written as the named expert from the card, playbook and profile shape; meets each must-have, avoids each failure mode.
- **Plain draft (all depths):** the request alone, no engine material. It is the yardstick for length, density and the final pick.
- **Creative draft (full only):** a real alternative concept or structure that could beat the playbook.
- **Team (team only):** specialists write the parts needing different experts; a lead integrates them into one voice and one length budget. A solo playbook draft and the plain draft still compete.
- Light and standard: no third draft. At light depth each piece stays no longer than the plain draft's version.

### 4. Check
Run CHECKER-v3.md on all drafts, blind. It returns a ranking, the base draft and a merge plan. Light depth uses its quick check. At standard depth and above, it confirms the core design choice (metric and time span, audience, the main charge answered) before polish.

### 5. Base and merge
Follow the CLARITY.md base rule: build on the clearest draft that can take the others' extra substance, grafting each part in as its own short sentence, bullet or table row. Otherwise start from the best draft and graft the strongest parts of the others, including the plain draft. Apply rules 1 and 3.

### 6. Clarity edit
- Follow CLARITY.md: answer in the first two sentences; one idea per sentence; plain words; headings and tables by length; no method talk; shared lines said once.
- Shape and length: the profile's shape and reader minutes, at about 230 words a minute. Measure: `node tools/quality/wordcount.cjs <final> <plain>`
- Reading level: `node tools/quality/readability.cjs <final> --audience <consumer|business|specialist>`. Fix exit 1 and meet the editor targets. Run it on the plain draft too: the final's long-sentence share and parentheses rate must not exceed the plain draft's.
- Voice (VOICE.md) for customer-facing copy: the brand's channel voice, no generic AI phrases or no-go words, read aloud. For internal work, clarity beats house style.

### 7. Proof (PROOF.md)
`node tools/quality/proof.cjs <final> --sources <research.md> <company memory files>`
Add `--allow-external` only when the page is meant to load outside scripts or styles. Fix every FAIL; confirm, fix or label every WARN. Prove what the tool cannot: run code, recalculate spreadsheets, open key links. Re-run until 0 FAIL.

### 8. Visual review (VISUAL.md)
For anything people look at (pages, emails with layout, decks, image ads): `node tools/quality/render.cjs <file.html> <out-prefix>`. Read every slice, phone first, as a senior designer seeing it cold. Fix, render and look again until the checklist passes on both sizes.

### 9. Hand-over check
`node tools/quality/leakcheck.cjs <final>`. Fix every hit. Re-run the reading check if fixes changed the prose.

### 10. Final pick against the plain draft
Blind pairwise by CHECKER-v3.md: final and plain draft as unlabelled X and Y, order randomised. "Which would the reader use?" If the plain draft wins with no fact errors, give it the clarity edit, proof and hand-over check, and ship it instead.

### 11. Lessons
Write one only when this job showed a concrete error or win it would have changed; otherwise skip. Lessons are scoped (this company, or this kind of job), two-sided (what won and what to avoid) and short. No lesson may push outputs longer, shorter or more defensive than the reader needs. Company lessons go in company/<slug>/lessons.md, general ones in lessons-general.md, length and shape lessons in the family profile, depth lessons in ROUTING.md.

## How the method learns over time (OUTCOME-SIGNALS.md)
Opted-in users say whether they used the result as is, edited it, or threw it away, and later whether it worked. Counted by family, depth and engine version, these signals propose new defaults and lesson candidates; the blind benchmark decides.
