---
name: machine-translation-post-editing
description: Decides whether machine translation suits a job, sets up the engine with the client's glossary, post-edits the output to an agreed level (light for internal gist, full for anything published), and checks a sample with an MQM-style error log before delivery. Flags the error types engines still make, such as wrong terms, dropped negations, mistranslated numbers and gender, and states the method honestly, including AI labelling duties for public-interest text in the EU. Use when a business has high volumes of help, product or internal text and wants to use machine translation without publishing its mistakes.
---

# Machine translation post-editing

Machine translation (MT) is now fluent enough that its errors hide in good-looking sentences. This skill decides when MT is the right tool, makes the engine follow the client's terms, corrects the output to the level the text needs, and proves the result with a measured check.

## When to use

- Large volumes of help articles, product attributes, reviews, internal documents or support replies.
- A client already runs MT (in a website plugin, a localisation platform or an AI assistant) and wants the output fixed and checked.
- Setting a policy for which content may use MT and how it is reviewed.

Not for: slogans, brand campaigns and humour (transcreation), legal, medical or official documents, or very low-resource languages where engines are weak. Public 2025 tests found top systems still unreliable on terminology, non-standard input and gender agreement, and one very low-resource language largely unusable.

## What you need

- **Source content** and its format.
- **Target locale,** the reader, and where the text will appear.
- **Glossary and style sheet** (build them with the glossary-and-style-sheet skill if missing).
- **Engine in use** and whether the client's plan supports glossaries and keeps data private. Check the engine's terms before sending confidential or personal text.
- **The level agreed:** light or full post-editing, and who signs off.
- **Access level:** running MT and post-editing from files needs level 1 (with the client running the engine) or level 2 (I run it, nothing goes live). Saving post-edited text unpublished in the client's tool is level 2. Publishing is level 3 within the client's limits.

## Steps

1. **Triage the content by risk.** For each content type, decide: MT only (internal gist), light post-editing (internal or short-lived), full post-editing plus native review (anything published), or human translation (high-risk or creative). Write the decision in a table the client approves.
2. **Prepare the source.** Fix typos, split very long sentences, expand unclear abbreviations, and protect tags and placeholders. Cleaner source gives cleaner output.
3. **Set up the engine.** Load the glossary in the engine's format and choose the right model and formality setting where the engine offers one. Record the engine, model and glossary version.
4. **Run a pilot** of about a page per content type. Read it against the source and note the error patterns before running the full batch.
5. **Post-edit at the agreed level:**
   - *Light:* fix meaning errors, omissions, additions, wrong numbers and names, offensive or unsafe output, and glossary terms. Accept plain style.
   - *Full:* everything in light, plus terminology, grammar, style sheet rules, locale formats, natural phrasing, and fit to layout. The result should read like a human translation.
6. **Hunt the known failure points** in every segment: negations ("do not", "never"), numbers and units, dates, product and brand names, words left untranslated, gender and formality shifts, invented content, and dropped sentences.
7. **Measure a sample.** Take a random sample (say, every tenth segment, or a fixed number per file) and log each error with a type (accuracy, fluency, terminology, style, locale convention) and a severity (minor, major, critical). Agree the pass threshold with the client before the job, in words or numbers they choose.
8. **Fix and feed back.** Correct the full file for patterns found in the sample. Add new terms to the glossary. Store approved segments in the translation memory.
9. **Label honestly.** The delivery note says MT plus post-editing, the level, the engine and who reviewed it. For public-interest text published in the EU, from 2 August 2026, the AI Act may require a visible label unless a named person reviews each language version and holds editorial responsibility; check the Commission's guidelines and the client's own legal advice. On Amazon KDP, AI-generated translations must be disclosed.
10. **Deliver or publish.** At level 2, save unpublished. At level 3, publish only what is in the confirmed action list, log each action and report it.

## Checks

- Every content type has an agreed method and level.
- The glossary was loaded, and a spot check shows the engine used it.
- No segment has a wrong number, name, negation or unit.
- No source-language words are left unless on the do-not-translate list.
- Sample error log is complete, with a verdict against the agreed threshold.
- Delivery note states method, engine, level and reviewer.
- Confidential or personal data went only to an engine the client approved.

## Output format

1. **Triage table:** content type, volume, method, level, reviewer.
2. **Engine set-up record:** engine, model, settings, glossary version, date.
3. **Post-edited files** in the original format.
4. **Error log:** segment ID, source, MT output, final, error type, severity.
5. **Quality summary:** sample size, error counts by type and severity, verdict, top patterns.
6. **Glossary additions** and translation memory update note.
7. **Delivery note,** including any labelling to consider.

## Example of good output (short)

*Kettle & Kiln is a made-up business used only to show the format: a UK pottery supplies shop putting 400 product descriptions into Spanish for Spain.*

**Triage:** product descriptions, full post-editing plus native review; customer reviews, MT only, shown with a "translated automatically" note the client chose to add; returns policy, human translation.

**Pilot error log (extract):**

| ID | Source | MT output | Final | Type | Severity |
|---|---|---|---|---|---|
| 112 | Not dishwasher safe | Apto para lavavajillas | No apto para lavavajillas | Accuracy (dropped negation) | Critical |
| 147 | Fires at cone 6 | Se dispara en el cono 6 | Cocción a cono 6 | Terminology | Major |
| 203 | 2 lb bag | Bolsa de 2 lb | Bolsa de 907 g (2 lb) | Locale convention (weight must match the real pack; client to confirm metric-first) | Major |

**Pattern found:** the engine dropped "not" in safety lines three times in 50 segments. Action: every segment with a negation is now checked by hand, and "Not dishwasher safe" is added to the translation memory as an approved segment.
