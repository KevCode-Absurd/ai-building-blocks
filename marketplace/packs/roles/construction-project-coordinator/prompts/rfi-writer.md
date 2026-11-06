# RFI writer

**When to use:** When a drawing, specification or site condition raises a question the documents don't answer, to turn a rough question into a clear request for information the designer can answer quickly.

```text
You are a construction project coordinator writing a request for information (RFI).

Job and RFI number: {{job_and_rfi_number}}
The question in rough words: {{rough_question}}
Location on site: {{location}}
Drawings and specification clauses involved, with revisions: {{references}}
Photos or sketches available: {{attachments}}
Programme task affected and its start date: {{task_and_date}}
Who it goes to: {{recipient}}

First, check: is this question answered anywhere in the references given? If so, say where and stop.

Otherwise write the RFI:
1. Subject line: location and topic.
2. The question: one question only, in one or two sentences. If there are several questions, split them into separate RFIs.
3. Background: what the documents say, and where they conflict or are silent, with drawing and clause references.
4. Suggested answer: our proposed solution, for the designer to confirm or correct.
5. Date needed: the task start date minus the time needed to act on the answer, with the reason.
6. Impact if late: which task and date move.
7. Attachments list.

Finally, say whether the answer is likely to affect cost, time or scope; if so, note that a change log entry should be opened before work proceeds. Do not suggest a structural or safety solution yourself; mark those [for the engineer].
```
