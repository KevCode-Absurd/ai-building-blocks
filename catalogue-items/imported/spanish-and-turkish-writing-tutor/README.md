# language-tutor

A Claude skill that runs a persistent language-learning workspace: it diagnoses your level, teaches one high-yield structure per session, corrects everything you produce, and logs every error to a tagged ledger that drives what it teaches next.

**The core loop is language-agnostic. Everything language-specific lives in a pack.** Swap the pack, get a different language — no changes to the skill itself.

Currently shipping: **Turkish**, **Spanish**.

## Install

```bash
git clone https://github.com/<you>/language-tutor
cp -r language-tutor ~/.claude/skills/
```

Then, in an empty directory you want to use as your workspace:

```
Use the language-tutor skill. I'm learning Turkish, currently around A2,
and I need B2 for a university exam in six weeks.
```

It runs a diagnostic, bands you per skill, tells you what's realistically achievable in your timeframe, and starts teaching. It asks before writing anything to your directory.

For a one-off — a paragraph you want corrected, a question about two forms — just ask. You get the correction and the tags, no workspace, no diagnostic.

## What it produces

Two files on day one — `PROFILE.md` and `MISTAKES.md`. The rest appear only when
something actually needs them:

```
PROFILE.md   per-skill bands, target, honest ceiling
MISTAKES.md  the tagged error ledger
MISSION.md   when the "why" outgrows one line
CURRICULUM.md / NOTES.md / RESOURCES.md   on first real use
daily/       session logs
reference/   printable cheat sheets you'll actually reuse
VOCAB/       spaced-repetition deck
exams/       past papers, generated mocks, graded attempts
```

The ledger is the engine. Errors are tagged with a taxonomy specific to your language — Turkish tracks `[NOMIN]` and `[VOWEL-HARM]`, Spanish tracks `[SUBJ-TRIGGER]` and `[PRET/IMPF]` — so ten rows sharing a tag point at one missing rule rather than ten unrelated slips. Every session opens by re-testing open rows.

## Why packs

The loop generalizes. Almost nothing else does.

|  | Turkish | Spanish |
|---|---|---|
| Error locus | suffix selection & order | tense/mood selection |
| A2→B1 unlock | `-DIK/-AcAK` nominalization | preterite vs imperfect |
| Primary drill | sentence-combining | minimal-pair choice |
| Extra concern | — | dialect variety gating |
| Agent reliability | medium | high |

A generic tutor would never derive that Turkish's plateau is a *subordination* problem while Spanish's is an *aspect* problem, or that French would need dictation as its primary drill because most of its errors are silent. That judgement is curricular expertise, and it belongs in a pack written by someone who knows the language.

## Example: cold run

Not a user session — a **test**. A fresh agent, an empty directory, and only the skill's
own files; the maintainer docs were stripped so nothing could leak the intended answer.
The input was one paragraph plus `"TÖMER in three weeks, need B2"`.

It corrected the paragraph, then produced this:

> **Realistic ceiling, honestly:** three weeks from a solid A2+/B1- to a genuine,
> all-four-skills B2 is unlikely. Three weeks to a *plausible* B2 in **writing and
> reading** is achievable, because your mechanics are already sound and the remaining gap
> is a small number of high-frequency structures. Speaking is the risk, and it's the one I
> can help with least. I'd rather tell you that now than in week three.

That is the behavior worth judging the skill on. Four things it did that a generic tutor
prompt reliably doesn't:

- **Refused to band what it couldn't see.** Writing, grammar and vocabulary got bands.
  Reading, listening and speaking were marked *unknown* — "I can't estimate these from a
  paragraph, and I can't hear you at all."
- **Gave an unwelcome answer to a paying question.** The learner asked for B2 in three
  weeks. It said no, then said which half was achievable.
- **Hedged an exam claim instead of asserting it.** It surfaced the 50% per-skill floor,
  qualified it with *"if your exam follows the TYS shape"*, and asked which university's
  TÖMER — because the formats differ and it didn't know which one applied.
- **Offered the workspace without creating it.** It named the two files it wanted to
  write, said why, and stopped. The directory was still empty when the turn ended.

It also flagged its own unreliability up front, unprompted, because the Turkish pack is
marked `confidence: medium`:

> My corrections are usually right and occasionally confidently wrong. Push back on
> anything that surprises you.

The same test run against a bare *"is this sentence right?"* — no deadline, no exam, no
target — corrected the sentence, offered the ledger in one line, and wrote **zero files**.

One caveat about what this shows: the skill was handed to the agent already invoked, so
this exercises behavior, not triggering. Whether the description fires on its own is
measured separately, and is the weaker of the two.

## Limitations — read these

- **It cannot hear you.** Pronunciation, stress, and fluency are outside a text agent's reach. Speaking practice routes to a voice interface; transcripts are partial evidence. For tone languages this is severe.
- **It cannot produce audio.** Listening comes from real sources; the skill scaffolds comprehension around them.
- **Accuracy varies by language.** Each pack declares a `confidence` field. High-resource languages are reliable; mid-resource ones are occasionally confidently wrong; low-resource ones need verification before you trust a correction.
- **It amplifies its own mistakes.** A wrong correction enters the ledger and then gets deliberately drilled back into you by spaced review. Challenge surprising corrections. This is the failure mode to take seriously.
- **Adherence beats optimization.** Sessions are built to work at 20 minutes because a short session you keep beats an ideal one you abandon. Ask for a smaller commitment than you think you want.

## Contributing a pack

Copy `references/packs/TEMPLATE.md`, fill all seven sections, follow `references/PACK-FORMAT.md`. Set `verified: false` unless a proficient speaker has reviewed the grammar spine — a wrong acquisition order degrades every session downstream without ever looking wrong.

Packs wanted: French, German, Japanese, Arabic, Mandarin, Portuguese, Russian. French and Japanese are the most valuable next, because they stress the format hardest — French because its errors are inaudible, Japanese because its script is a workload of its own.

If a language doesn't fit the seven sections, that's a format bug. Open an issue rather than special-casing the core.

## License

MIT
