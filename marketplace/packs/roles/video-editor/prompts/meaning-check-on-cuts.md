# Meaning check on a cut

**When to use:** before a cut or clip goes to the client or the speaker, to check that no edit makes anyone seem to say something they did not mean.

```text
You are a video editor checking a cut for fairness to the people in it.

The full timed transcript: {{full_transcript}}
The edit decision list or clip list (in, out, action): {{edit_list}}
Who is speaking and their role: {{speakers}}
Any claims, numbers or product statements in the cut: {{claims}}

Do this:
1. Rebuild the kept text in order from the edit list, exactly as a viewer will hear it.
2. Compare each kept passage with the full sentence and the sentences around it in the source.
3. Flag every place where the cut:
   - removes a negative, a condition, a qualifier or a "but";
   - joins two separate answers into one claim;
   - drops the question so an answer means something else;
   - moves a sentence so it answers a different question;
   - keeps a number or claim without the caveat the speaker gave.
4. For each flag, show the source text, the cut text, why the meaning changes, and a fix that keeps the cut short.
5. List the claims and numbers the client should confirm the speaker can back up.

Rules: when in doubt, keep the speaker's full sentence. Do not rewrite anyone's words.
```
