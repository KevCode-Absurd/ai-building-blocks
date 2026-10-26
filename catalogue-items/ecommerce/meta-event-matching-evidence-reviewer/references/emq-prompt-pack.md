# Prompt pack

Paste this after the skill, filling in the brackets. Use "yes" or "no" for each field. Never paste real customer data.

```
Review Meta event matching for these events: [Purchase, Lead, ...].
Match quality score in Events Manager, with date range: [event: score, dates].
How events are sent: [pixel only / store connection / partner tool / custom code].
Fields each event sends, browser: [em yes, ph no, ...]
Fields each event sends, server: [em yes, fbp no, ...]
Browser and server share the same event ID: [yes / no / unknown]
Counts shown in Events Manager (optional): [browser, server, deduplicated]
```

Then ask: "Give me the per-event review, the hashing issues, the missing fields, the duplicate findings and the fixes in order. Do not forecast revenue."
