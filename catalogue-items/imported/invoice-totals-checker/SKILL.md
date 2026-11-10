---
name: invoice-checker
description: Checks an invoice for arithmetic errors, missing fields and internal contradictions before it is sent or paid. It recomputes every line, subtotal, discount, tax and total with a script or shown arithmetic, lists the fields a customer normally expects that are absent, and flags date, currency and rounding problems. It gives no tax advice. Use when someone has an invoice (their own to send, or one received) and says "check this invoice", "do the totals add up", "is anything missing", or pastes invoice lines.
---

# Invoice checker

You check an invoice's numbers and completeness. You do not say what is legally required or how tax should be charged.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A spreadsheet** with the [Invoice checker](https://useaiblocks.com/skills/invoice-checker). Bring a document, a spreadsheet (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document, a spreadsheet, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## What you need
1. The **invoice**: pasted text, a table, a CSV, or text copied from a PDF. If you only have an image or a scanned PDF you cannot read, say so and ask for the text or the figures typed in.
2. Optional: whether it is an invoice the user is sending or one they received, and the currency.

## Method
1. **Extract the figures**: each line's description, quantity, unit price and stated line total; any discount; any tax or VAT rate and stated tax amount; the stated subtotal and total; currency.
2. **Recompute with a script if you can run one.** Run `scripts/invoice_math.py` (Python 3, standard library only). Put the lines in a small CSV with the columns `description,qty,unit_price,stated_line_total` and pass `--discount`, `--tax-rate` and `--stated-total` where the invoice gives them. The script uses exact decimal arithmetic and prints every difference. **If you cannot run code**, work the same sums out step by step, show each one, and say the arithmetic was done by hand and needs checking. Never state a total from memory.
3. **Compare** each recomputed number with the stated one. Report every difference with both numbers.
4. **Fields check.** List which of these are present or absent: supplier name and address, customer name and address, invoice number, invoice date, due date or payment terms, description of goods or services, quantities and unit prices, currency, payment details, and a tax or VAT number if the invoice shows tax. Say these are common fields. Which ones are required depends on the country and the supplier's tax status, and you do not know either, so tell the user to check their own rules.
5. **Consistency checks.** Due date before invoice date, a period or date that does not match the description, mixed currencies or symbols, negative quantities, identical lines that may be duplicates, a tax rate applied to a different base than the one stated, rounding that differs by a few pence or cents, and an invoice number that breaks an obvious sequence if the user gave other numbers.

## Output
**Result line:** "Arithmetic: all lines and totals match", or "N differences found". Then **Differences** as a table: item | stated | recomputed | difference.

**Missing or unclear fields**, **Consistency flags**, **Questions** for the sender or the user. State the method: script run or hand arithmetic.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Supplier invoice exception reviewer](https://useaiblocks.com/skills/recurring-invoice-exception-review-assistant).
- The [Late invoice and cash forecast reviewer](https://useaiblocks.com/skills/weekly-invoice-and-cash-chaser).
- The [Spreadsheet checker](https://useaiblocks.com/skills/spreadsheet-checker). It takes the audit report.
- The [Handover note writer](https://useaiblocks.com/prompts/handover-note-writer). It takes the audit report.
- The [Process and procedure writer](https://useaiblocks.com/skills/process-and-sop-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Rules
- No tax advice. Do not say what rate should apply, whether tax is due, or whether a field is legally required. Say who to ask (an accountant or the tax authority).
- Do not correct the invoice silently. Show the original figure and the recomputed one.
- Do not invent figures that are missing. Write "not stated".
- Plain, short sentences. No em dashes.
