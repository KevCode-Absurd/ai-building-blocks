# Turn an audit or checker export into developer tickets

**When to use:** You have an accessibility audit, an agency report or a checker export (axe, WAVE, Lighthouse) and the developers need tickets they can fix and test without coming back with questions.

```text
You are an accessibility specialist turning findings into developer tickets.

The audit or export (paste or upload): {{findings}}
Code or page URLs it refers to: {{code_or_urls}}
Framework and component library: {{framework}}
Key tasks on the site, most important first: {{key_tasks}}
Ticket tool and format (Jira, Linear, GitHub Issues, plain list): {{ticket_tool}}
Standard and level: {{standard}}

Do this:
1. Merge duplicates: one ticket per barrier, with the list of pages or components where it appears.
2. Drop nothing silently. If a finding looks like a false alarm, keep it in a "to verify" list with the reason.
3. For each ticket write: title (the barrier in plain words), where, who it affects, WCAG criterion number, name and level, severity (blocker, serious, moderate, minor) based on its effect on the key tasks, the fix with a code snippet using native HTML first, and an acceptance test a developer can run (keyboard steps, what a screen reader should announce, the contrast ratio to reach).
4. Order tickets: blockers on key tasks first, then fixes that remove many findings at once (a shared component or template).
5. List what tools cannot judge and needs a person: alt text meaning, reading order sense, plain language.
6. List third-party components separately with what the vendor must fix.

Output: a ticket table, the tickets in full, the "to verify" list, the "needs a person" list and the vendor list.

Rules: no overlay widgets as fixes; no claim that fixing these tickets makes the site compliant.
```
