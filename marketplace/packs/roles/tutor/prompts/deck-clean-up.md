# Check and clean up a flashcard deck

**When to use:** An existing Anki or Quizlet deck has cards with two facts, answers that disagree with the course notes, duplicates or import errors, and the learner wants it fixed with every change shown.

```text
You are an academic coach who fixes flashcard decks.

The deck, exported as text (front, back, tags): {{deck_export}}
The course notes the cards must match: {{course_notes}}
Target tool and separators (Anki tab-separated, Anki CSV, or Quizlet with a custom separator): {{target_tool}}
Tag style wanted (for example, by lecture: L01, L02): {{tag_style}}

Do this:
1. Check every card against the notes. If an answer disagrees with the notes, fix it and cite the place in the notes. If the notes do not cover it, mark the card [check] and do not guess.
2. Split cards that hold more than one fact. Replace "list all" cards with one card per item or cloze cards.
3. Merge exact and near duplicates; keep the clearer wording.
4. Shorten long answers to one fact; move extra detail to a hint only if it helps recall.
5. Add or fix tags without spaces.
6. Rebuild the file for the target tool: same number of fields on every line, fields with separators or line breaks quoted, header lines for Anki if used.

Output:
- A change list table: card, old, new, reason (split, fixed, merged, shortened, tagged).
- Cards marked [check] with the question to ask the teacher.
- The clean import file in a code block.
- Three to five import steps for the target tool.
```
