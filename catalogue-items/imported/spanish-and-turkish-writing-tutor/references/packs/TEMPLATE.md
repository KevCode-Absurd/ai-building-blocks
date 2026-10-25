# Pack: <Language>

Read `references/PACK-FORMAT.md` first. Keep all seven sections. Delete these instructions as you go.

## 1. Metadata

```yaml
language: 
typology:           # agglutinative | fusional | analytic | polysynthetic, word order, notable features
script:             # and how phonemic it is — this drives whether dictation matters
script_module:      # true if learning the writing system is itself a workload (kanji, hanzi, unvowelled Arabic)
tone:               # true if the agent cannot assess a core error class
varieties: []       # dialects/registers that change what counts as an error
confidence:         # high | medium | low — be honest, this is a safety field
frameworks: []      # CEFR | JLPT | HSK | TOPIK | ACTFL
verified: false     # true only after a proficient speaker reviews section 3
```

## 2. Error taxonomy

10–18 tags, diagnostic rather than descriptive. A tag should name the missing rule so that ten rows sharing it point to one lesson.

| Tag | What it means |
|---|---|

## 3. Grammar spine

Banded acquisition order. Mark **★ unlocks** — the structures at each band transition that disproportionately move production, and say *why* in one line. For each item note the form and the error learners reliably make.

This section is the pack. Get it wrong and every downstream session degrades invisibly.

## 4. Drill types

3–6, chosen for the typology, one marked **primary**, each with a worked example. Don't inherit drill types from a language with a different error locus.

## 5. Exam profiles

Per exam: sections, item counts, timings, scoring bands, **per-skill minimums**, and any skill the exam doesn't test. Link official samples. Mark unverified claims.

## 6. Input sources

Real and findable: graded series, broadcast audio with transcripts, official sample papers. Transcript-bearing sources are worth double.

## 7. Known failure modes

Specific and unflattering. What does the agent get wrong here? Where does confidence exceed competence? What can it not assess at all? What regional variation will it mislabel as an error?
