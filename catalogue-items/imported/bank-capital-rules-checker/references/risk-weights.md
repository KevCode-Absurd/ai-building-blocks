# Basel III Standardized Risk Weights (Credit Risk)

## Common Exposure Classes (Standardized Approach, Basel III final)
| Exposure | Risk Weight |
|---|---|
| Sovereigns AAA to AA- | 0% |
| Sovereigns A+ to A- | 20% |
| Sovereigns BBB+ to BBB- | 50% |
| Sovereigns BB+ to B- | 100% |
| Sovereigns below B- | 150% |
| Sovereigns unrated | 100% |
| Own sovereign, domestic currency, funded in that currency | Lower weight (often 0%) only where the national regulator uses this option (CRE20.8) |
| Banks (external rating A) | 30% base, 20% short-term (CRE20 table 6) |
| Corporates AAA to AA- | 20% |
| Corporates A | 50% |
| Corporates BBB | 75% |
| Corporates BB+ to BB- | 100% |
| Corporates below BB- | 150% |
| Corporates unrated | 100% (85% if SME under some regimes) |
| Regulatory retail (qualifying) | 75% |
| Residential mortgage | 20%–70% by LTV band |
| Commercial real estate | 60%–110% by LTV/repayment dependence |
| Defaulted exposures | 100%–150% |
| Equity | 250%–400% |

Sovereign, bank and corporate rows checked against the Basel Framework standard CRE20 (sovereign table CRE20.7 and option CRE20.8, bank table 6, corporate table 10) (https://www.bis.org/basel_framework/chapter/CRE/20.htm). A sovereign exposure gets 0% only if it is rated AAA to AA-, or if it is the bank's own sovereign in domestic currency, funded in that currency, and the regulator allows the lower weight.

National regulators (e.g., CBN) adapt these — always check the local prudential guideline; CBN applies its own weights for FGN securities and state government exposures.

## Capital Ratios
- `CET1 ratio = CET1 / RWA ≥ 4.5%` (+ capital conservation buffer 2.5% + D-SIB/G-SIB surcharges + countercyclical buffer).
- Tier 1 ≥ 6%, Total capital ≥ 8%. CBN minimum CAR: 10% (national), 15% (international authorization).

## Off-Balance Sheet
`Credit equivalent = Notional × CCF` — direct credit substitutes 100%, performance bonds 50%, self-liquidating trade LCs 20%, unconditionally cancellable commitments 10%.

## Other RWA Components
- Operational risk: Standardized Measurement Approach (BI component × marginal coefficients × ILM).
- Market risk: FRTB standardized sensitivities-based method.
- Output floor: aggregate IRB RWA ≥ 72.5% of standardized.
