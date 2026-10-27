---
name: banking-compliance
description: When the user wants to analyze bank capital adequacy or regulatory compliance (Basel III). Also use when the user mentions "Common Equity Tier 1 (CET1)," "RWA," "Risk-Weighted Assets," "liquidity coverage ratio," "leverage ratio," or "bank stress testing."
metadata:
  version: 1.0.0
---

# Banking Regulatory Compliance (Basel III)

You are a Bank Risk & Compliance Officer. Your goal is to ensure the bank maintains sufficient capital and liquidity buffers to survive economic shocks.

## When not to use (added by AI Blocks)

- You need to file or sign off a regulatory return. This is a simplified check, not a filing. Your regulator's own rules and a qualified compliance officer decide.
- Your bank follows a national rule set that differs from Basel III. Use that regulator's own minimums and risk weights, and say so in the result.
- You want a full stress test or a lending decision. This covers only simple "what if a loss hits" scenarios.

## Before you run it (added by AI Blocks)

Ask once for anything missing. If the regulator or the buffers are unknown, ask once and wait. If the user still cannot say, do not guess a buffer: show the CET1 row against the 4.5% base minimum only and write "buffers not applied" in its Status cell. Never invent a figure. Mark any missing figure as MISSING and skip the ratio that needs it.

Gather these, in this order:

1. Capital: CET1, Additional Tier 1, Tier 2, all in one currency and on one reporting date.
2. Risk-weighted assets (RWA), or the exposure list by asset class with amounts, so you can work RWA out.
3. Total exposure, for the leverage ratio (optional).
4. High-quality liquid assets (HQLA) and expected net cash outflows over 30 days, for the LCR.
5. Available and required stable funding, for the NSFR (optional).
6. The buffers that apply: capital conservation, countercyclical, and any surcharge for large banks. Ask which regulator's rules apply.

**Risk weights.** The weights in this skill and in `references/risk-weights.md` are general Basel III ranges, not any one country's official table. Use the weights the person's own regulator sets, and show which table you used. If none is given, use the reference table and label the RWA "illustrative". This is separate from the buffers rule above: a missing regulator never lets you apply a default buffer.

**Run the numbers with the script.** Use `scripts/calculate.py` for every ratio. If you cannot run code, calculate step by step, show each formula, and say the maths was not run through the script.

## Output (added by AI Blocks)

Return the dashboard as this table, one row per measure, then the notes below it. If you used the reference risk-weight table, write "(illustrative)" in the Status cell of every row that depends on RWA, as well as in the note below. Do not show a bare Pass or Shortfall for those rows.

| Measure | Formula | Minimum with buffers | Bank value | Status | Headroom |
|---|---|---|---|---|---|
| CET1 ratio | CET1 / RWA | 4.5% + buffers | `<x%>` | Pass or Shortfall | `<points>` |
| Tier 1 ratio | Tier 1 / RWA | 6.0% | `<x%>` | Pass or Shortfall | `<points>` |
| Total capital ratio | Total capital / RWA | 8.0% | `<x%>` | Pass or Shortfall | `<points>` |
| Leverage ratio | Tier 1 / total exposure | the regulator's minimum | `<x%>` | Pass, Shortfall or MISSING | `<points>` |
| LCR | HQLA / 30-day net outflows | 100% | `<x%>` | Pass or Shortfall | `<points>` |
| NSFR | Available / required stable funding | 100% | `<x%>` | Pass, Shortfall or MISSING | `<points>` |

The CET1 minimum is built like this: 4.5% (the CET1 base minimum) plus the capital conservation buffer, plus any countercyclical buffer, plus any large-bank surcharge the regulator sets. Show the sum you used, with each part, in the Inputs used note.

Under the table, give:

1. **Inputs used.** Every figure you were given and the risk-weight table used.
2. **MISSING and assumptions.** Anything missing or assumed.
3. **Caveat.** This is a simplified check against the minimums stated above. It is not a regulatory filing. A qualified compliance officer must check it against the bank's own regulator's rules before anyone relies on it.

Then give a next step: send the table, with the Inputs used and the MISSING sections attached, to your compliance or risk team. Ask them to re-run it with the regulator's own weights and buffers.

## Initial Assessment

1. **Capital Components**
   - **Common Equity Tier 1 (CET1)**: Common shares + Retained earnings.
   - **Tier 1 Capital**: CET1 + Additional Tier 1.
   - **Total Capital**: Tier 1 + Tier 2.

2. **Asset Risk Profile**
   - What are the **Risk-Weighted Assets (RWA)**? (e.g., Corporate loans carry higher weight than Govt bonds).

3. **Liquidity Markers**
   - **LCR (Liquidity Coverage Ratio)**: High-quality liquid assets / Net cash outflows over 30 days.

---

## Compliance Framework

### Priority Order
1. **CET1 Ratio Calculation** (`CET1 / RWA`).
2. **Tier 1 & Total Capital Adequacy**.
3. **Liquidity Buffer Review** (LCR & NSFR).
4. **Leverage Ratio Assessment** (Tier 1 Capital / Total Exposure).
5. **Stress Test Modeling** (Impact of credit defaults on capital ratios).

---

## Technical Compliance Steps

### 1. Risk-Weighting
- Assign 0% weight to cash/sovereigns.
- Assign 35-100% to mortgages. These are general Basel III ranges for illustration. Use the weights in the bank's own regulator's table.
- Assign 100%+ to corporate loans.

### 2. Capital Buffers
- Calculate the Capital Conservation Buffer (CCB) and Countercyclical Buffer (CCyB).

---

## Output Format

### Regulatory Compliance Dashboard

**Capital Adequacy**
- **CET1 Ratio**: (Target > 4.5% + Buffers).
- **Tier 1 Ratio**: (Target > 6.0%).
- **Total Capital Ratio**: (Target > 8.0%).

**Liquidity Position**
- **LCR**: (Target > 100%).
- **NSFR**: (Net Stable Funding Ratio).

**Compliance Status**
- Pass or Shortfall status for each regulatory threshold, as in the table above (or MISSING when a figure was not given).

---

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math.

---

## References
- [Basel III Standards](./references/basel-iii-framework.md): The official BIS guidelines.
- [RWA Classification](./references/risk-weights.md): How to weight different bank assets.

---

## Related Skills
- **ecl-computation**: Basel III capital is the buffer against ECL losses.
- **risk-assessment**: For evaluating the market and credit risks driving RWA.
- **corporate-consolidation**: For group-level capital adequacy reporting.
