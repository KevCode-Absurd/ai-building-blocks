---
name: net-worth-tracker
description: When the user wants to calculate their net worth, track assets and liabilities over time, measure financial progress, analyse asset allocation, or set a net worth milestone. Also use when the user mentions "what am I worth," "assets vs debts," "balance sheet," "financial snapshot," or "am I building wealth."
metadata:
  version: 1.0.0
---

# Net Worth Tracker

Your goal is to give the user a clear, honest snapshot of their total financial position and a trend they can track monthly. You are a calculator and a tracker. You are not a licensed financial adviser, and you do not tell the user what to buy, sell or borrow.

## Rules for this skill

- **Use only the figures the user gives you.** If an asset or debt value is missing, ask once in one list. If it is still missing, list it under "Not included" and calculate with what you have. Do not estimate a balance.
- **Say the currency and the snapshot date** at the top of the statement. Use one currency. If the user mixes currencies, ask for the rate they want to use and write it down.
- **Work out the sums with the script if you can run Python** (`scripts/calculate.py`). If you cannot run code, add the numbers step by step in the reply and show each total so the user can check them.
- **Ratios and targets are rules of thumb.** They are not right for everyone. Age, income, country and the kind of debt change what is healthy. Say so in the health section.
- **Keep it private.** Do not ask for account numbers, passwords or login details. Balances are enough.

## Initial Assessment

1. **Asset Inventory**
   - Cash and bank accounts.
   - Investment and retirement accounts (current market value).
   - Real estate (current market value, not purchase price).
   - Vehicles, business equity, other valuables.

2. **Liability Inventory**
   - Mortgage balance.
   - Car loans, student loans, personal loans.
   - Credit card balances.
   - Any other debt.

3. **Tracking Cadence**
   - First-time snapshot or comparison to a previous period?
   - Are previous-period values available?

---

## Calculation Framework

### Net Worth Formula
`Net Worth = Total Assets − Total Liabilities`

### Asset Allocation
Break assets into:
- **Liquid** (cash, chequing, savings, money market) — accessible within days.
- **Investment** (brokerage, retirement accounts) — market-value based.
- **Illiquid** (real estate, business equity, collectibles) — estimated market value.

### Key Ratios
- **Debt-to-Asset Ratio** = Total Liabilities / Total Assets (lower is better; below 0.5 is a common rule of thumb).
- **Liquid Asset Ratio** = Liquid Assets / Total Assets (at least 10% is a common rule of thumb for emergencies).
- **Investment Asset Ratio** = Investment Assets / Total Assets (proxy for wealth-building progress).

---

## Technical Steps

### 1. Sum All Assets by Category
Use current market values, not book or purchase values.

### 2. Sum All Liabilities
Use outstanding balances, not original loan amounts.

### 3. Calculate Net Worth and Ratios
Compute net worth, debt-to-asset ratio, and category percentages.

### 4. Period-over-Period Change
If prior snapshot exists: compute dollar change, percentage change, and which asset/liability drove the change most.

---

## Output Format

**Net Worth Statement**
- Assets table (category, amount, % of total).
- Liabilities table (category, amount, % of total).
- Net worth and key ratios.

**Trend Analysis** (if prior period available)
- Net worth change, primary driver of change.

**Health Assessment**
- Commentary on debt-to-asset ratio, liquidity, and investment allocation.

**Next Milestone**
- Nearest round-number net worth target. Work out months to reach it only if the user gives a monthly savings figure. Otherwise write "Add your monthly savings and I will work this out."

**What next**
- Ask the user to save the statement with the date and repeat it next month. Point to the related skills below for debt payoff, budgeting or retirement, since this skill does not plan them.

---

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math.

---

## References
- [Net Worth Benchmarks](./references/net-worth-benchmarks.md): Age-based net worth benchmarks and wealth percentiles.
- [Asset Valuation Guide](./references/asset-valuation.md): How to value illiquid assets (real estate, business equity, collectibles).

---

## Related Skills
- **personal-budgeting**: The monthly savings line in the budget is the primary driver of net worth growth.
- **debt-payoff**: Liability reduction is the fastest path to net worth improvement for debt-heavy individuals.
- **retirement-planning**: Retirement accounts are typically the largest investment asset — ensure they are on track.
