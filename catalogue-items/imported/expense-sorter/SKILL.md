---
name: expense-categorization
description: Classify expenses by category, department, and tax deductibility from transaction data. Use when the user requests expense categorization or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: community
  version: "1.0"
---

# Expense Categorization

Automatically classify business expenses into accounting categories, assign department cost centers, and flag tax-deductible items from raw transaction data. This skill processes credit card statements, bank feeds, and expense reports to produce clean, categorized output suitable for bookkeeping, tax preparation, and spend analytics.

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

## Workflow

1. **Receive Expense Data**
   Accept transaction data as CSV, bank statement text, or structured records. Required fields: date, amount, and description or merchant name. Optional fields: card last four digits, employee name, department, receipt notes. Normalize date formats and currency to a consistent standard.

2. **Parse Description and Merchant**
   Extract the merchant name from the transaction descriptor, stripping out authorization codes, location suffixes, and card network prefixes. Map common merchant name variations to canonical names (e.g., "AMZN MKTP US" → "Amazon", "GOOGLE *GSUITE" → "Google Workspace"). Use the merchant category code (MCC) when available as a secondary signal.

3. **Classify Expense Category**
   Assign each transaction to a primary category based on merchant identity, MCC, description keywords, and amount patterns. Standard categories: Travel & Lodging, Meals & Entertainment, Software & SaaS, Office Supplies, Professional Services, Advertising, Utilities, Insurance, Shipping & Postage, Equipment, Training & Education, Miscellaneous.

4. **Assign Department and Cost Center**
   Route each expense to the appropriate department based on the cardholder, project codes in the description, or pre-configured rules. Apply default department assignments for known merchants (e.g., AWS charges → Engineering, HubSpot → Marketing).

5. **Flag Tax-Deductible Items**
   Mark expenses that qualify for tax deduction based on category and business purpose. Apply IRS rules for meals (50% deductible for business meals, 100% for company events), home office, vehicle mileage, and professional development. Flag items that need substantiation — receipts, business purpose memo, or attendee lists.
   Every tax flag is a first pass, not a ruling. Say so in the output. Tell the user to check each flag against the current rules for the tax year, and to ask an accountant about larger items such as equipment or Section 179 claims. Show "Yes (100%)" or "Section 179 eligible" as "Likely deductible (check)" or "Possible Section 179 (accountant to confirm)".

6. **Generate Categorized Summary**
   Output a categorized transaction list with totals by category, department, and tax status. Highlight any transactions that couldn't be confidently categorized (confidence < 80%) for manual review. The confidence figure is the AI's own rough estimate from how clear the merchant name and description are. It is not a measured accuracy, so tell the user to check the low-confidence list first and to spot-check some of the rest.

## Usage

Provide transaction data in any tabular format. Specify any custom category mappings, department rules, or tax jurisdiction if not US federal.

**Example prompt:**
> Categorize these November credit card transactions for our 15-person startup. We have Engineering, Marketing, and Operations departments. Flag tax-deductible items. Here's the CSV: [paste transactions]

## Examples

### Example 1: Monthly Credit Card Categorization

**Input (CSV):**
```csv
date,amount,description,cardholder
2024-11-02,249.00,GITHUB TEAM PLAN,Sarah Chen
2024-11-03,1450.00,UNITED AIRLINES 0167823,Mike Torres
2024-11-03,189.50,MARRIOTT HOTEL CHI,Mike Torres
2024-11-05,42.67,UBER TRIP FKJE83,Mike Torres
2024-11-08,156.00,GOOGLE ADS 8834721,Lisa Park
2024-11-12,89.99,ZOOM VIDEO COMMS,Sarah Chen
2024-11-14,67.32,DOORDASH DASHER TIP,Operations
2024-11-18,4200.00,DELL TECHNOLOGIES,Sarah Chen
2024-11-22,350.00,COURSERA BUSINESS,Mike Torres
2024-11-25,23.45,STAPLES #1284,Operations
```

**Output:**

| Date       | Amount    | Merchant         | Category              | Department  | Tax Deductible (first pass) | Notes                         |
|------------|-----------|------------------|-----------------------|-------------|----------------|-------------------------------|
| 2024-11-02 | $249.00   | GitHub           | Software & SaaS       | Engineering | Likely deductible (check) |                               |
| 2024-11-03 | $1,450.00 | United Airlines  | Travel & Lodging      | Engineering | Likely deductible (check) | Business travel               |
| 2024-11-03 | $189.50   | Marriott         | Travel & Lodging      | Engineering | Likely deductible (check) | Business travel               |
| 2024-11-05 | $42.67    | Uber             | Travel & Lodging      | Engineering | Likely deductible (check) | Ground transport              |
| 2024-11-08 | $156.00   | Google Ads       | Advertising           | Marketing   | Likely deductible (check) |                               |
| 2024-11-12 | $89.99    | Zoom             | Software & SaaS       | Engineering | Likely deductible (check) |                               |
| 2024-11-14 | $67.32    | DoorDash         | Meals & Entertainment | Operations  | Likely deductible, 50% limit (check)| Needs business purpose memo   |
| 2024-11-18 | $4,200.00 | Dell             | Equipment             | Engineering | Possibly depreciable (check) | Possible Section 179; ask your accountant          |
| 2024-11-22 | $350.00   | Coursera         | Training & Education  | Engineering | Likely deductible (check) |                               |
| 2024-11-25 | $23.45    | Staples          | Office Supplies       | Operations  | Likely deductible (check) |                               |

The tax column is a first pass using US federal rules, not a ruling. The names, amounts and dates in this example are made up.

**Summary:**
| Category              | Total     | % of Spend |
|-----------------------|-----------|------------|
| Equipment             | $4,200.00 | 61.5%      |
| Travel & Lodging      | $1,682.17 | 24.6%      |
| Training & Education  | $350.00   | 5.1%       |
| Software & SaaS       | $338.99   | 5.0%       |
| Advertising           | $156.00   | 2.3%       |
| Meals & Entertainment | $67.32    | 1.0%       |
| Office Supplies       | $23.45    | 0.3%       |
| **Total**             | **$6,817.93** | **100%** |

### Example 2: Flagging Misclassified Expenses

*Illustration only. Every name, amount and date below is invented, and the impact figures are not real results.*

**Input:** Review existing categorizations for accuracy.

**Output — Correction Report:**

| Date       | Amount  | Merchant       | Current Category | Corrected Category     | Reason                                                  |
|------------|---------|----------------|------------------|------------------------|---------------------------------------------------------|
| 2024-11-07 | $320.00 | WeWork         | Office Supplies  | Rent & Facilities      | Co-working space is rent, not supplies                  |
| 2024-11-10 | $85.00  | Blue Apron     | Office Supplies  | Meals & Entertainment  | Meal delivery service miscoded                          |
| 2024-11-16 | $599.00 | Adobe Creative | Training         | Software & SaaS        | Creative Cloud is a software subscription, not training |
| 2024-11-29 | $175.00 | Lyft Business  | Miscellaneous    | Travel & Lodging       | Business ground transportation should be under travel   |

**Impact:** Reclassifying these 4 transactions shifts $1,179.00 across categories, affecting department budgets and tax deduction calculations. The Adobe correction reduces the Training & Education deduction by $599 and increases the Software & SaaS deduction by the same amount.

## Best Practices

- Build and maintain a merchant-to-category mapping dictionary. Start with the 50 most common merchants in your transaction history and expand over time.
- Set a confidence threshold (recommended: 80%) below which transactions are routed for human review rather than auto-categorized.
- Review categorization accuracy monthly — track precision and recall by category to identify systematic errors.
- Always separate personal and business expenses before categorization. Flag transactions from personal merchants (grocery stores, streaming services) for review.
- Apply consistent rules for edge cases like meals during travel (Travel vs. Meals) and document the policy.
- Keep tax deductibility rules current with the applicable tax year — IRS rules change frequently for categories like meals, entertainment, and vehicle expenses.

## Safety Boundaries

- Treat the output as analytical support, not individualized financial, tax, investment, or accounting advice.
- Preserve source data and expose assumptions, formulas, units, and reconciliation checks so a reviewer can reproduce the result.
- Do not initiate payments, transactions, journal entries, filings, or account changes without explicit user authorization.
- Require a qualified professional to review material decisions, regulated filings, or conclusions based on incomplete data.

## Edge Cases

- **Split transactions:** A single purchase at a warehouse store may include both office supplies and snacks. If the receipt is available, split into separate line items with distinct categories.
- **Foreign currency transactions:** Categorize based on the merchant and purpose, not the currency. Record both the original currency amount and the converted amount. Watch for duplicate entries from currency conversion fees.
- **Refunds and chargebacks:** Match refunds to the original transaction and apply the same category as a negative entry. Don't create a new "refund" category — it distorts spend analytics.
- **Recurring vs. one-time:** Identify recurring charges (same merchant, similar amount, monthly cadence) and flag any that stop unexpectedly or change amount by more than 10%.
- **Ambiguous merchants:** When a merchant name maps to multiple possible categories (e.g., Amazon could be office supplies, software, or equipment), use the amount and cardholder's department as tiebreakers. Do not use a fixed amount rule. Ask the user to set their own threshold for what counts as equipment rather than supplies (for example, from their accountant's capitalisation policy). If they have not set one, mark the line as uncertain for review. The tax category depends on the item bought, so it needs a receipt or an accountant check.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Expense report builder](https://useaiblocks.com/skills/expense-report-builder). It takes the spreadsheet.
- The [Bookkeeping expense matching checker](https://useaiblocks.com/workflows/prepare-expenses-for-your-bookkeeper). It takes the spreadsheet.
- The [Tax set-aside planner](https://useaiblocks.com/skills/tax-set-aside-planner). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
