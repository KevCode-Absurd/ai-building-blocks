# CLAUDE.md — language-tutor

Context for maintaining this repo. **This file is about maintaining the project. `SKILL.md` is the product** — it's what runs when a learner invokes the skill. Don't confuse the two: instructions for the tutor go in `SKILL.md`, instructions for whoever builds the tutor go here.

---

## What this is

A Claude skill that runs a persistent language-learning workspace: diagnose the learner, teach one high-yield structure per session, correct everything they produce, log every error to a tagged ledger, and use that ledger to drive what comes next.

The bet: **the teaching loop is universal; the teaching content is not.** So the loop lives in `SKILL.md` and everything language-specific lives in a swappable pack.

## Where it came from

June 2026. The maintainer (Turkish prep year, self-assessed A2+) had a TÖMER proficiency exam a few weeks out and needed B2. Rather than study conventionally, he wanted an AI-run system. The original ask included an exam-factory idea: feed in past papers, spawn subagents to generate mocks, spawn more to grade them, and write every mistake to a `MISTAKES.md`.

That got built as a one-off sprint repo (`turkish-c1/`): a dated curriculum, subagent prompts for daily tutoring / exam generation / grading, and the error ledger. A real diagnostic ran — 150 words of unaided Turkish, corrected and banded per skill, then a first lesson on `-DIK/-AcAK` nominalization.

**What actually happened: he used it for about one day, and didn't pass the exam.** By his own account the system worked and he didn't run it. That's the single most important input into this repo's design, and the reason for several decisions below.

The architecture was then lifted from the `teach` skill (a general stateful teaching workspace: mission-grounded lessons, durable reference documents, reusable assets, spacing and retrieval practice, zone of proximal development). `teach` supplied the workspace model; the sprint repo supplied the error ledger, per-skill banding, and exam machinery that `teach` has no concept of. This repo is the merge, generalized across languages.

Built 18 August 2026.

## What the June run taught us

These are design inputs, not anecdotes. Don't undo them without a reason better than tidiness.

1. **Adherence is the failure mode, not correction accuracy.** The original plan demanded 4–6 hours a day. Nobody sustains that, and the system produced zero value on day two. Hence: 20-minute minimum sessions, expandable; the first two blocks are the ones designed to survive a cut.
2. **Lapses are normal and must be a supported state.** A system that assumes daily use greets a returning learner with a stale schedule and an accusatory backlog, which is how abandonment becomes permanent. Hence §6 of `SKILL.md`, the re-entry session: open with a win, top-5 errors only, re-teach the last structure, no new material, rescale the plan honestly.
3. **The ledger amplifies errors.** Spaced review deliberately re-drills whatever was logged, so a wrong correction gets trained *in*. This is the system's most serious risk and is stated in `SKILL.md` §10, the README, and every pack's section 7.
4. **Real curricular judgement is the actual product.** "Turkish plateaus at A2 because learners can't subordinate, and `-DIK/-AcAK` is the unlock" is the kind of claim that changes outcomes and that a generic prompt will never produce. Packs exist to hold claims like that.
5. **Hunting for source materials is procrastination-shaped.** Days went into chasing past papers. The skill now starts teaching immediately and treats sourcing as ongoing (`RESOURCES.md`), never as a prerequisite.

## The one architectural rule

**No language-specific facts in `SKILL.md`.** Not one example, not one suffix, not one exam name outside the trigger description.

If a language seems to need a change to the core, that's a signal the *pack format* is missing a field. Add the field to `PACK-FORMAT.md`; don't special-case the core. This rule is what keeps a tenth pack from requiring a rewrite.

## File map

```
SKILL.md                      core loop. Language-agnostic. Keep under ~150 lines.
README.md                     GitHub front door. Limitations section is load-bearing.
CLAUDE.md                     this file.
references/PACK-FORMAT.md     the seven-section contract packs must satisfy.
references/packs/turkish.md   reference implementation (agglutinative).
references/packs/spanish.md   second typology (fusional). Validates the contract.
references/packs/TEMPLATE.md  contributor starting point.
```

The learner's `PROFILE.md` and `MISTAKES.md` formats are **inlined as fenced blocks in
`SKILL.md` §2**, not shipped as files. Nothing in this repo is ever copied into a
learner's workspace — the agent writes every workspace file from a spec. Adding a
`*.template.md` back is a regression.

A pack's seven sections: metadata · error taxonomy · grammar spine · drill types · exam profiles · input sources · known failure modes.

## Design decisions, and why

- **Packs are markdown, not YAML/JSON.** The spine and failure modes are prose judgements; forcing them into a schema would strip exactly the nuance that makes a pack worth having. Only the metadata block is structured.
- **Taxonomies are diagnostic, not descriptive.** `[SUBJ-TRIGGER]` (didn't recognize a context requiring subjunctive) beats `[VERB-ERROR]`, because ten rows sharing a diagnostic tag point to one lesson. 10–18 tags: fewer is mush, more is inconsistently applied.
- **Drill type follows typology.** Agglutinative languages fail at morpheme selection and ordering → sentence-combining. Fusional languages fail at selection among paradigms → minimal-pair choice with justification. Analytic languages fail at word order and particles → reordering. Deep-orthography languages hide errors in silence → dictation as *primary*, not supplementary. A pack that inherits another language's drills is broken.
- **`[SLIP]` is core, not pack.** It's the one tag `SKILL.md` names, and it doesn't break the no-language-facts rule because it carries no language content — it's the explicit absence of a diagnosis, plus the escalation rule that turns three recurrences into a real tag. Packs are forbidden from shipping their own `[MISC]`, which would compete with it.

  Worth recording *how* it arrived, because it's the invariant doing its job. A cold test threw up a Turkish sentence (*Ben ... gittik*) with no home in `turkish.md`'s 18 tags, and the obvious move was to add `[AGREE]` to the pack. That would have been wrong twice over: Turkish agreement is largely optional (see the `[REGISTER]` row), so the tag would have manufactured false positives, and *every* pack will eventually meet an error its taxonomy misses. A pack-level gap that recurs across every pack is a core-level omission. This is the same rule as "if a language seems to need a change to the core, the pack format is missing a field," run in the other direction: the fix belonged one level up, not in the pack that happened to surface it.
- **`confidence` is a safety field.** It governs hedging and how hard the agent grounds in real sources. It is not a marketing field. Turkish is `medium` deliberately.
- **`verified: false` by default.** A wrong acquisition order degrades every downstream session without ever looking wrong. Only a proficient speaker's review of section 3 flips it.
- **Per-skill minimums are called out in exam profiles** because they change strategy categorically: with a floor, no skill can be sacrificed to buy points elsewhere. TYS has a 50% floor; DELE requires passing both blocks independently.
- **Specs, not templates.** Formats live as fenced blocks inside the doc that uses them. A shipped template is a file the installer has to have, a path that can break, and a second place the format can drift out of sync. The `teach` skill this repo descends from ships zero copyable artifacts for the same reason. Packs are the deliberate exception: they carry curricular judgement the agent cannot regenerate, which is the entire reason this isn't just `teach` pointed at a language.
- **The workspace is built lazily, and only with consent.** Nine files before a word is learned reads as presumptuous, buries the two that matter, and asks for commitment at the exact moment the learner has the least. `PROFILE.md` and `MISTAKES.md` on day one; everything else when something actually needs it. Same reasoning as the 20-minute session: lower the cost of starting.
- **One-off requests get a lightweight path.** The trigger description is aggressive by design, so it fires on "is this sentence right?" too. Answering that with a diagnostic and a file tree is how a skill gets uninstalled. Correct it, tag it, offer the workspace once, drop it if declined.
- **The mode tiebreak is asymmetric, because the two errors don't cost the same.** Four signals force the ongoing path: a deadline, a target band, a named exam, a self-assessed level. Any one, and the offer is made even alongside text to correct. Over-offering costs a single declined sentence — the consent step in §2 means nothing is written until the learner says yes, so a wrong guess toward "ongoing" is very nearly free. Under-offering costs the whole system: someone arrives with a named exam and a deadline, which is precisely the case this was built for, and leaves with a paragraph fix and no ledger. That's the June failure re-run at the point of first contact. A symmetric tiebreak treats a cheap error and an expensive one as equivalent, so the rule is biased toward the offer and only falls through to one-off when all four signals are absent.
- **The limitations are advertised, not buried.** Can't hear, can't produce audio, varies by language, amplifies its own errors. Honesty here is also the credibility signal that this was used rather than merely generated.

## Adding a pack

1. Copy `references/packs/TEMPLATE.md` → `references/packs/<language>.md`.
2. Fill metadata first. `typology`, `script`, and `tone` determine most of what follows.
3. **Section 3 (spine) is the real work.** Research it against real curricula and graded series — not parametric knowledge. Band it, and mark the ★ unlocks at each band transition with a one-line reason. If you can't say why a structure is an unlock, it probably isn't one.
4. Choose drill types from the error locus, not from an existing pack.
5. Exam profiles: verify against official sites; formats get revised. Mark anything unverified.
6. Section 7 (failure modes) should be specific and unflattering. Test the agent on the language and write down what it actually got wrong — this section is worth more than the rest combined for learner safety.
7. Keep `verified: false` until a speaker reviews the spine.
8. Add the language to the README table and the "currently shipping" line.

**Priority order for new packs:** French, then Japanese. French stresses the format hardest — its errors are largely inaudible (`é/er/ez`, plural `s/nt`, participle agreement are homophones), so dictation must be the primary drill and a learner who only speaks never discovers their errors. Japanese forces the `script_module` path (kanji as a workload of its own) and a non-CEFR framework (JLPT, which tests no production at all — no writing, no speaking). If both fit without touching `SKILL.md`, the contract is sound.

## Invariants

Breaking any of these is a regression:

- No language facts in `SKILL.md`. `[SLIP]` is not a counterexample: it names the absence of a diagnosis and contains no language content.
- `[SLIP]` stays excluded from pattern-analysis tallies, and stays escalating on the third recurrence. Without the escalation it's a silent drain that hides taxonomy gaps; without the exclusion it pollutes the tallies the ledger exists to produce.
- Every pack has all seven sections; metadata includes `confidence` and `verified`.
- The three non-negotiables in `SKILL.md` §4 (log every error, open with retrieval, ground the content) stay non-negotiable.
- The limitations section survives every README rewrite.
- Sessions stay viable at 20 minutes.
- Re-entry mode stays. It's the fix for the observed failure.
- No copyable templates ship. Learner-file formats stay inlined in `SKILL.md`.
- The workspace stays lazy: `PROFILE.md` and `MISTAKES.md` on day one, the rest on first use, and nothing at all without the learner's confirmation.
- The one-off path stays. A single correction must never trigger a scaffold or a diagnostic.

## Testing

There's no test suite; validation is running it cold.

- Install to `~/.claude/skills/`, create an empty scratch workspace, and run a session from zero for a language you can judge.
- Check: does the skill trigger without being named? Does the right pack load? Does it band per skill honestly? Does it write `MISTAKES.md`? Does the drill type match the pack rather than defaulting to fill-in-the-blank?
- Then simulate a lapse — set the last session date back a week and confirm re-entry mode fires instead of a normal session.
- Check the one-off path separately: in an empty directory, paste three sentences of bad Turkish and ask only "is this right?" It should correct, tag, offer a workspace once, and write **nothing**.
- Check consent and laziness: accept the workspace and confirm exactly `PROFILE.md` and `MISTAKES.md` exist afterward — no `daily/`, no `exams/`, no `VOCAB/`.
- `skill-creator` (Claude Code only) can generate trigger evals and tune the description. Worth doing before publishing; the description is the whole triggering mechanism and skills tend to under-trigger.

  **It has two different eval formats, and the docs point at the wrong one.** `references/schemas.md` documents `evals.json` — the *behavioral* format (prompt + `expectations`), for grading what a skill does once it's already running. Trigger evaluation is a separate thing: `run_eval.py --eval-set` wants queries labelled by whether the skill should fire at all. Read `run_eval.py`'s own argument parser and eval-set loading code before writing the file; following `schemas.md` produces a set that is silently the wrong shape. Triggering is the only surface the cold tests can't cover, since a cold test hands the skill over already invoked.

**Predicted first breakages:** the diagnostic may ask for more unaided writing than a
true beginner can produce; lazy creation means later sessions must tolerate every
combination of missing files, so the failure mode moves from "heavy scaffold" to "assumes
a file that was never written" — grep `SKILL.md` for a filename before adding a step that
reads one. Mode triage is a judgement call and will misfire in both directions: watch for
one-off corrections that silently accrete a workspace, and for a stated deadline that
gets answered with a bare correction.

*(The original prediction — that the nine-file scaffold was too heavy — was confirmed and
fixed. Left here because it's the pattern: cost-of-starting is where this system fails.)*

## Open work

- French and Japanese packs.
- Verify the Turkish spine with a native speaker, especially the `-DIK` vs `-mA` claim in section 7 — that's the most likely place for a confident error.
- Spanish pack is entirely unreviewed by a speaker.
- A real transcript in the README (diagnostic → banding → tagged correction) would do more for adoption than any amount of prose.
- Consider a `bootstrap` path that drafts a pack via research for unsupported languages, always `verified: false`.
- The reference-sheet layer (`reference/*.html` + shared stylesheet) is specified in `SKILL.md` §8 but has no shipped assets yet — a default stylesheet would make outputs consistent.

## Working with the maintainer

- Name better alternatives upfront rather than debugging the named approach first, then mentioning them after it fails.
- He directs development through AI rather than writing code by hand; explanations of *why* a change matters are more useful than the diff alone.
- Design arguments are welcome and expected — push back when a decision looks wrong rather than implementing it silently.
- Watch for building-instead-of-doing. This repo exists because a study system got built and then not used; the same pull applies to the repo itself. Shipping two solid packs beats polishing six.

*(This file is committed publicly. The June origin story stays — it makes the design legible. Identifying details were trimmed before the first push; keep it that way.)*
