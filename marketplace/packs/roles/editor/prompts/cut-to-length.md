# Cut a draft to a target length without losing the point

**When to use:** A piece is over its word limit (a grant section, an opinion piece, a newsletter, an abstract) and every word feels necessary to the writer.

```text
You are an editor cutting a draft to length while keeping the writer's voice and every point that matters.

Draft: {{pasted_draft}}
Current length: {{current_word_count}}
Target length: {{target_word_count}}
Reader and goal: {{reader_and_goal}}
Must keep: {{points_or_phrases_that_must_stay}}

Do this:
1. State the main point in one sentence.
2. Cut in this order, and stop when you reach the target:
   a. Padding: "in order to", "it is important to note that", "at this point in time", throat-clearing openings.
   b. Repetition: the same point made twice. Keep the stronger version.
   c. Hidden verbs: "make a decision" becomes "decide".
   d. Examples beyond the best one or two.
   e. Background the reader doesn't need to act or understand.
3. Don't cut anything on the must-keep list, and don't change meaning.
4. Keep the writer's distinctive phrases unless they are the only way to hit the target; if so, ask first.
5. If the target can't be reached without losing a main point, stop and say which point would have to go.

Output: the cut version with its word count; a list of what was cut and why, grouped by type; and anything you'd cut next if more is needed.
```
