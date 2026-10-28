---
name: break-trace
description: Root-cause a reconciliation break to its source transaction or posting — follow the audit trail from the break row back to the originating entry on each side and state what differs and why. Use after gl-recon has classified a break.
---

# Root-cause a break

Given a single break row (key, GL values, subledger values, bucket, likely cause), trace it to source and produce a root-cause statement.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Trace path

1. **Pull the GL side** — from the GL system of record, fetch the journal entry or posting that produced this GL line: entry id, posting date, source system, batch id, preparer.
2. **Pull the subledger side** — from the subledger, fetch the matching transaction: trade id, trade/settle dates, counterparty, source feed, FX rate used.

   If no system is connected, ask the user for the GL extract and the subledger extract. Do not invent entry ids or trade ids to fill the gap — an untraceable break is worse than an unstarted trace.
3. **Diff the attributes** — line up posting date, FX rate/date, account mapping, quantity sign, amount sign. The differing attribute is usually the cause.

## Cause → statement

Write the root cause as a single sentence in the form **"⟨side⟩ ⟨did what⟩ because ⟨reason⟩"**, e.g.:

- "GL posted on settle date (T+2) while subledger posted on trade date — timing break, will clear on 2026-05-07."
- "Subledger used WM/R 4pm rate; GL used Bloomberg close — FX break of 12 bps on the base amount."
- "Security ABC123 maps to GL account 11420 in the mapping table but the subledger fed 11410 — mapping break, raise to reference-data."
- "Subledger posted the trade twice (trade ids 88412 and 88419 are duplicates) — duplicate post, suppress 88419."

## Output

For each traced break, return:

```json
{
  "key": "...",
  "root_cause": "one sentence as above",
  "owner": "ops | reference-data | accounting | upstream-system",
  "expected_clear_date": "YYYY-MM-DD or null",
  "action": "monitor | adjust | raise-ticket | suppress"
}
```

Only the resolver writes adjustments — this skill diagnoses, it does not post.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [P&L and balance sheet writer](https://useaiblocks.com/skills/p-l-and-balance-sheet-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
