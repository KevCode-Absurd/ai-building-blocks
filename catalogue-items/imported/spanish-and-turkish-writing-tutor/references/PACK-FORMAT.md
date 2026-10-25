# Pack Format

A pack is one markdown file: `references/packs/<language>.md`. It supplies everything the core loop can't know. Seven sections, all required.

The core skill contains no language facts. If you find yourself wanting to edit `SKILL.md` to accommodate a language, that's a signal the pack format is missing something — raise it as an issue rather than special-casing the core.

---

## 1. Metadata

```yaml
language: Turkish
typology: agglutinative, SOV, vowel harmony
script: Latin, near-phonemic
script_module: false        # true if learning the writing system is itself a workload
tone: false                 # true if the agent literally cannot assess a core error class
varieties: [standard]       # dialects/registers that change what counts as an error
confidence: medium          # high | medium | low — the agent's grammatical reliability
frameworks: [CEFR]
verified: true              # has a proficient speaker checked the spine?
```

`confidence` is a safety field, not a boast. It governs how loudly the agent hedges and how hard it grounds in sources. `low` means the agent should verify before correcting.

## 2. Error taxonomy

The tags the ledger uses. Make them **diagnostic, not descriptive** — a tag should name the rule the learner is missing, so that ten rows sharing a tag point to one lesson. `[WRONG-ENDING]` is useless; `[AGREEMENT]` and `[SUFFIX-ORDER]` are not.

Aim for 10–18. Fewer and the analysis is mush, more and tagging becomes inconsistent.

**Do not define a catch-all tag.** `SKILL.md` §4 supplies `[SLIP]` for errors no tag fits, and gives it behaviour a pack can't: excluded from tallies, and escalating to a real tag on the third recurrence. A pack that ships its own `[MISC]` or `[OTHER]` competes with that and loses the escalation signal. If `[SLIP]` keeps catching the same thing in one language, that's the evidence this section is missing a row — add the row.

## 3. Grammar spine

The acquisition order, banded. This is the most valuable and most opinionated part of a pack — it is real curricular expertise and cannot be derived generically.

Mark the **unlocks**: the one or two structures at each band transition that disproportionately move production. Turkish's A2→B1 unlock is nominalization; Spanish's is the preterite/imperfect contrast. Teaching these early changes the trajectory; teaching them late wastes the sprint.

For each item: form, the error learners reliably make, and a one-line "why it's worth the time."

## 4. Drill types

Typology decides the exercise. Suffix-stacking drills are meaningless in an analytic language; tone drills are meaningless in Turkish. List 3–6 drill types with an example of each, and say which one is **primary** for this language.

Rough guide, not a rule:

| Typology | Error locus | Natural primary drill |
|---|---|---|
| Agglutinative | morpheme selection & order | sentence-combining, suffix-stack completion |
| Fusional | agreement, paradigm, mood | minimal-pair choice, paradigm completion |
| Analytic | word order, particles, classifiers | reordering, particle choice, classifier matching |
| Deep orthography | silent/inaudible distinctions | dictation |
| Non-Latin script | reading & production of the script | character SRS, transcription |

## 5. Exam profiles

One block per exam. Sections, item counts, timings, scoring bands, and — critically — **whether there's a per-skill minimum**, because a floor forbids trading one skill off against another. Note which skills the exam doesn't test at all; some major exams have no production component, which should reshape the whole plan.

Link to official sample materials. Mark anything you couldn't verify.

## 6. Input sources

Real, findable material: graded readers, broadcast audio with transcripts, textbook series, official sample papers. Prefer sources with transcripts, since those double as dictation material. This section is what keeps the agent from generating synthetic slop when real input exists.

## 7. Known failure modes

Be specific and unflattering. What does the agent get wrong in this language? Where does its confidence exceed its competence? What can it not assess at all? What regional variation will it mislabel as an error?

This section is the pack's most useful contribution to a learner's safety. Write it from observed mistakes, not speculation.

---

## Contributing a pack

Copy `packs/TEMPLATE.md`. Fill all seven sections. Set `verified: false` unless a proficient speaker has reviewed section 3 — the spine is where a plausible-looking error does the most damage, because a wrong acquisition order degrades every session downstream without ever looking wrong.

Good packs come from someone who has taught or seriously studied the language. Sections 3, 4, and 7 are where that shows.
