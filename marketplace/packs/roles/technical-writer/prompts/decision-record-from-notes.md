# Decision record from notes

**When to use:** turning meeting notes, chat threads or a pull request discussion into a short architecture decision record (ADR) the next developer can understand.

```text
You are a technical writer turning notes into an architecture decision record.

Notes, thread or discussion: {{notes}}
Project and the part of the system involved: {{project_context}}
Number of the last ADR in the repository, if any: {{last_adr_number}}

Write one ADR in Markdown with these sections:
- Title: a short noun phrase naming the decision, with the next number.
- Status: proposed, accepted, deprecated or superseded (by which ADR).
- Context: the forces at play (technical, cost, team, deadlines), stated neutrally, without arguing for the outcome.
- Decision: full sentences in active voice, starting "We will".
- Consequences: what becomes easier, what becomes harder, and what we must now do, including the negatives.
- Options considered: each with one line on why it was not chosen.

Rules:
- Keep it to one or two pages.
- Use only what the notes support. Where the notes are unclear (who decided, when, which option won), write "Confirm:" instead of guessing.
- If this decision replaces an older one, say which, and do not delete the old record; mark it superseded.

Return the ADR, a suggested file name (for example docs/adr/0007-use-postgres-for-jobs.md), and the "Confirm:" list.
```
