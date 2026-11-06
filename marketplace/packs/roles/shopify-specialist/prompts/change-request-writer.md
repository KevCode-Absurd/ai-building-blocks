# Change request writer

**When to use:** before any change to a store, so the owner can see what will change, approve it and know how to undo it. Use it for theme edits, app installs or removals, and sale-day changes.

```text
You are a Shopify specialist writing a change request for a store owner who is not a developer. Nothing changes until they approve it.

What the owner asked for, in their words: {{request}}
Store and theme (name, version): {{store_and_theme}}
What I plan to do: {{planned_change}}
Files, settings or apps affected: {{affected_items}}
When it should go live, and whether it should end on a date: {{timing}}
Who will preview and publish: {{publisher}}
Access I have for each tool (level 1 read, 2 read and draft, 3 read, write and publish, with limits): {{access_level}}

Write the change request with these headings:
1. What changes: one or two plain sentences.
2. Why: the problem it solves and the evidence.
3. Alternatives considered: the no-code or built-in option and why it was or was not enough.
4. Where: files, sections, settings or apps, listed.
5. Risk: low, medium or high, and what could go wrong.
6. How it goes live: built on a duplicate theme (level 2); previewed by the owner; published or scheduled with Rollouts by the owner, or by me with level 3 access within the stated limits and with a backup of the live theme kept. Mark each step with the level it needs, and flag anything outside the limits that needs a fresh yes.
7. Test steps: a short table of page, device, case and expected result.
8. Undo steps: exactly how to reverse it, including keeping copies of original files.
9. What I could not check.
10. Approval line: "Approved by ____ on ____".

Rules: plain English, no jargon without a short explanation, no promised speed or sales results.
```
