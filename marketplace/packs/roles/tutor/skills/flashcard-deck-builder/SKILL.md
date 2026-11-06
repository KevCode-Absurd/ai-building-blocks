---
name: flashcard-deck-builder
description: Builds one-fact flashcard decks from a learner's own notes, slides or word lists (question and answer, cloze and reverse vocabulary cards), tagged by chapter or unit, as a file that imports first time into Anki (UTF-8 text or CSV with header lines) or pastes into Quizlet, with import steps. Also checks and cleans an existing deck against the learner's notes and lists every change. Use it before exams heavy in facts, terms, formulas or vocabulary. Adds no facts that are not in the material. Places files in a shared folder only with level 3 access.
---

# Flashcard deck builder

## When to use

- A learner faces an exam with many terms, definitions, dates, formulas, steps or words.
- A language learner has a long word list.
- An existing deck is messy: cards with two facts, wrong answers, duplicates, broken imports.
- A teacher wants a deck for a class from their own unit notes.

Do not use it to copy a paid course, a textbook or real exam questions into cards.

## Access needed

- **Level 1 (read):** the notes or an exported deck to check.
- **Level 2 (read and draft):** save the import file and the change list in the learner's folder.
- **Level 3 (read, write and publish):** place finished deck files in the shared folder or class space named in the limits. The learner or teacher imports them into Anki or Quizlet. Log every action.

## What you need

1. The material: notes, slides, a chapter summary or a word list.
2. The target tool: Anki or Quizlet, and the device if relevant.
3. How the learner wants tags: by chapter, lecture or unit.
4. For language decks: both directions or one, and example sentences wanted or not.
5. For a clean-up: the deck export and the notes to check it against.

## Steps

### 1. List what is worth learning

Read all the material. List the facts: terms, definitions, dates, formulas, steps, words. Skip what the learner already knows well, if they say so. Facts that need understanding first get a short explanation card before any recall card: do not learn what you do not understand.

### 2. Pick the card type for each fact

- **Definition:** term on the front, meaning on the back.
- **Question and answer:** a direct question with one short answer.
- **Cloze:** a key sentence with one word or phrase hidden, so the fact is recalled in context. In Anki, cloze text uses the format `{{c1::hidden text}}`.
- **Reverse (vocabulary):** word to meaning and meaning to word, as two cards.
- **Lists and steps:** never "name all five". Split into one card per item, or a cloze card per step with the others visible.

### 3. Write one fact per card

- Answers short: a word, a number or one sentence.
- Make the question specific enough to have one right answer.
- Fight interference: where two facts look alike, add a word to the question that tells them apart.
- Add a hint or example only when it helps recall.
- Keep the source (lecture 5, slide 12) where the learner can check it: in the tag, in the Back Extra field of a cloze card, or in an extra field if their note type has one.

### 4. Check each card against the material

If a fact is unclear or differs between two parts of the notes, mark the card [check] instead of guessing.

### 5. Tag

Tags from the course structure, without spaces (`L05`, `Unit3_Verbs`, `Ch2`).

### 6. Build the file

**For Anki:**
- Plain text, UTF-8, one card per line.
- Header lines at the top, for example:

```
#separator:Tab
#html:false
#notetype:Basic
#deck:Anatomy::Hand and wrist
#tags column:3
```

- Same number of fields on every line. If you use commas or semicolons as separators, wrap any field containing the separator or a line break in double quotes, and double any quote mark inside it.
- Cloze cards go in a separate file with the Cloze note type.
- The first field decides duplicates, so keep fronts unique.

**For Quizlet:**
- Term and definition separated by a tab, comma or dash; rows separated by a new line or semicolon. Pick separators that do not appear in the text.
- Import works on the Quizlet website, not the app.

### 7. Read the file once more

Empty fields, duplicates, stray separators, tags with spaces, cards over one fact.

### 8. Write import steps

Three to five steps for the chosen tool, matching the separators used.

### 9. For a clean-up

Split multi-fact cards, fix answers that disagree with the notes, merge duplicates, add tags. List every change: card, old, new, why.

## Checks

- Every card holds one fact found in the material, or is marked [check].
- No "list all" cards.
- Field counts match on every line; separators and quoting are right for the tool.
- Tags have no spaces.
- The import steps match the file.
- At level 3, files went only to the named folder, and the log is updated.

## Output format

1. Card count by type and tag
2. The import file (in a code block) or a download, with header lines for Anki
3. Separate cloze file if needed
4. Cards marked [check], with the question for the teacher
5. Import steps
6. For a clean-up: the change list

## Example of good output (short)

*Made-up learner for illustration: a first-year physiotherapy student revising the bones of the wrist from lecture 5.*

```
#separator:Tab
#html:false
#notetype:Basic
#deck:Anatomy::Wrist
#tags column:3
Which carpal bone sits at the base of the thumb?	Trapezium	L05 L05_slide08
Which carpal bone is the most often fractured, according to the lecture?	Scaphoid	L05 L05_slide11
How many carpal bones are in each wrist?	Eight	L05 L05_slide06
```

Cloze file:

```
#separator:Tab
#html:false
#notetype:Cloze
#deck:Anatomy::Wrist
#tags column:3
The {{c1::hamate}} has a hook-shaped process on its palm side.	Lecture 5, slide 9	L05
```

> **Import into Anki (desktop):** File, Import, choose the file, check that the note type and deck match, then Import. Do the cloze file second.
>
> **[check]:** your notes call it "hamate hook" on slide 9 and "hamulus" on slide 14. Which term does your exam use?
