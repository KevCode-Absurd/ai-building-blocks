---
name: journal-entry
description: Prepare journal entries with proper debits, credits, and supporting detail. Use when booking month-end accruals (AP, payroll, prepaid), recording depreciation or amortization, posting revenue recognition or deferred revenue adjustments, or documenting an entry for audit review.
argument-hint: "<entry type> [period]"
---

# Journal Entry Preparation

> Catalogue note (added by AI Blocks): CONNECTORS.md is not in this copy. The `/je` command is a shortcut from the original author's tool. In a plain chat, type your request in words instead, such as "AP accrual for 2024-12". Connecting an accounting system is optional and may need setup or a paid plan. This skill works without it, when you paste your numbers.

**Important**: This command assists with journal entry workflows but does not provide financial advice. All entries should be reviewed by qualified financial professionals before posting.

Prepare journal entries with proper debits, credits, supporting detail, and review documentation.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

**Makes it better (optional):**
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a spreadsheet, a tool connection. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Usage

```
/je <type> <period>
```

### Arguments

- `type` — The journal entry type. One of:
  - `ap-accrual` — Accounts payable accruals for goods/services received but not yet invoiced
  - `fixed-assets` — Depreciation and amortization entries for fixed assets and intangibles
  - `prepaid` — Amortization of prepaid expenses (insurance, software, rent, etc.)
  - `payroll` — Payroll accruals including salaries, benefits, taxes, and bonus accruals
  - `revenue` — Revenue recognition entries including deferred revenue adjustments
- `period` — The accounting period (e.g., `2024-12`, `2024-Q4`, `2024`)

## Workflow

### 1. Gather Source Data

If your accounting system or data warehouse is connected to this tool:
- Pull the trial balance for the specified period
- Pull subledger detail for the relevant accounts
- Pull prior period entries of the same type for reference
- Identify the current GL balances for affected accounts

If no data source is connected:
> Ask the user to paste the trial balance data or upload a spreadsheet. (Pulling it automatically needs a connected accounting system, which is optional.)

Prompt the user to provide:
- Trial balance or GL balances for affected accounts
- Subledger detail or supporting schedules
- Prior period entries for reference (optional)

### 2. Calculate the Entry

Based on the JE type:

**AP Accrual:**
- Identify goods/services received but not invoiced by period end
- Calculate accrual amounts from PO receipts, contracts, or estimates. Use the received but not yet invoiced amount, for example [RECEIVED VALUE] minus [AMOUNT ALREADY INVOICED]
- Debit: Expense accounts (or asset accounts for capitalizable items)
- Credit: Accrued liabilities

**Fixed Assets:**
- Pull the fixed asset register or depreciation schedule
- Calculate period depreciation by asset class and method (straight-line, declining balance, units of production). For straight-line, the formula is (cost minus salvage value) divided by useful life in periods, for example [COST], [SALVAGE VALUE] and [LIFE IN MONTHS]
- Debit: Depreciation expense (by department/cost center)
- Credit: Accumulated depreciation

**Prepaid:**
- Pull the prepaid amortization schedule
- Calculate the period amortization for each prepaid item. For straight-line, the formula is the prepaid amount divided by the number of periods it covers, for example [PREPAID AMOUNT] divided by [NUMBER OF MONTHS]
- Debit: Expense accounts (by type — insurance, software, rent, etc.)
- Credit: Prepaid expense accounts

**Payroll:**
- Calculate accrued salaries for days worked but not yet paid. The formula is the pay for one working day times the unpaid days, for example [DAILY PAY] times [UNPAID DAYS]
- Calculate accrued benefits (health, retirement contributions, PTO)
- Calculate employer payroll tax accruals
- Calculate bonus accruals (if applicable, based on plan terms)
- Debit: Salary expense, benefits expense, payroll tax expense
- Credit: Accrued payroll, accrued benefits, accrued payroll taxes

**Revenue:**
- Review contracts and performance obligations
- Calculate revenue to recognize based on delivery/performance. For straight-line over the contract term, the formula is total contract value divided by the months in the term, for example [CONTRACT VALUE] divided by [MONTHS]
- Adjust deferred revenue balances
- Debit: Deferred revenue (or accounts receivable)
- Credit: Revenue accounts (by stream/category)

### 3. Generate the Journal Entry

Present the entry in standard format:

```
Journal Entry: [Type] — [Period]
Prepared by: [User]
Date: [Period end date]

| Line | Account Code | Account Name | Debit | Credit | Department | Memo |
|------|-------------|--------------|-------|--------|------------|------|
| 1    | XXXX        | [Name]       | X,XXX |        | [Dept]     | [Detail] |
| 2    | XXXX        | [Name]       |       | X,XXX  | [Dept]     | [Detail] |
|      |             | **Total**    | X,XXX | X,XXX  |            |      |

Supporting Detail:
- [Calculation basis and assumptions]
- [Reference to supporting schedule or documentation]

Reversal: [Yes/No — if yes, specify reversal date]
```

### 4. Review Checklist

Before finalizing, verify:

- [ ] Debits equal credits
- [ ] Correct accounting period
- [ ] Account codes are valid and map to the right GL accounts
- [ ] Amounts are calculated correctly with supporting detail
- [ ] Memo/description is clear and specific enough for audit
- [ ] Department/cost center coding is correct
- [ ] Entry is consistent with prior period treatment
- [ ] Reversal flag is set appropriately (accruals should auto-reverse)
- [ ] Supporting documentation is referenced or attached
- [ ] Entry is within the user's approval authority
- [ ] No unusual or out-of-pattern amounts that need investigation

### 5. Output

Provide:
1. The formatted journal entry
2. Supporting calculations
3. Comparison to prior period entry of the same type (if available)
4. Any items flagged for review or follow-up
5. Instructions for posting (manual entry or upload format for the user's ERP)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Accrual schedule drafter](https://useaiblocks.com/skills/accrual-schedule-drafter). It takes the spreadsheet.
- The [Intercompany balance matcher](https://useaiblocks.com/skills/intercompany-balance-matcher). It takes the spreadsheet.
- The [Financial statement preparer](https://useaiblocks.com/skills/financial-statement-preparer). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
