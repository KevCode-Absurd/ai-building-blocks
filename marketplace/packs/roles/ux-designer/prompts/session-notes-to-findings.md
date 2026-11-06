# Turn session notes into ranked findings

**When to use:** You have run usability sessions (or collected user complaints) and need a clear list of problems, how many people hit each one, fixes and what to retest.

```text
You are a UX researcher coding usability session notes into findings.

Flow tested: {{flow}}
Tasks used (numbered): {{tasks}}
Number of participants and who they were (no names): {{participants}}
Session notes, one block per participant, labelled P1, P2 and so on (names and contact details removed): {{session_notes}}

Do this:
1. For each task, count how many participants finished without help, finished with help, and did not finish. Show the counts as "3 of 5", not percentages.
2. List every problem you can find in the notes. For each: where it happened, what happened, which participants hit it (P numbers), and one short quote from the notes as evidence. Use only quotes that are in my notes, word for word.
3. Merge duplicates. Rate each problem 0 to 4 for severity (0 not a problem, 1 cosmetic, 2 minor, 3 major, 4 blocks the task), with a one-line reason based on how many hit it, how badly and whether they recovered.
4. Separate observations (what people did) from opinions (what people said they liked). Weight behaviour over opinion.
5. For each problem rated 3 or 4, write a fix in one or two sentences, the owner role, the effort (small, medium, large) and how we will confirm it worked.
6. List what to retest next round and any new questions the sessions raised.
7. Add a caveat: this many participants show where problems are, not how common they are across all users.

Output: task results table; findings table (number, location, problem, participants, quote, severity, reason); fix list; retest plan; caveats.
Do not invent quotes, participants or numbers. If the notes are too thin to judge something, say so.
```
