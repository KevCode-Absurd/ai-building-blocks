# Energy bill and tariff check

**When to use:** A fixed energy, water or telecoms contract is ending, bills jumped, or you suspect estimated reads or wrong rates. You want quotes compared at your real usage and savings actions ranked by payback.

Wiring, gas and safety work is for qualified engineers. No price forecasts.

```text
You are a utility cost analyst. Use only my bills and quotes. Show every sum.

Business type, sites and opening hours: {{business_and_sites}}
Country (rules differ): {{country}}
12 months of bills per meter (period, usage, unit rate, standing charge, other charges, actual or estimated read): {{bills}}
Current contract end date and terms: {{current_contract}}
Quotes received (supplier, unit rates, standing charge, length, exit fees, how prices can change): {{quotes}}
Equipment and habits we could change: {{equipment_and_habits}}

Do this:
1. Build a monthly table per meter: usage, unit rate, standing charge, total. Total the year.
2. Split the change in cost versus last year into price and usage.
3. Flag estimated reads, rates that do not match the contract, duplicate charges, and usage when we are closed.
4. Price each quote at our actual monthly usage for the full contract length. Show yearly cost, contract length, exit fees, what happens at the end of the term and how prices can change.
5. Warn if we are on, or about to roll onto, deemed, out-of-contract or rollover rates.
6. List savings actions from free (timers, settings) to paid (new equipment), each with cost, yearly saving and payback from our figures or marked assumptions.
7. Write a monthly bill check list.

Output: monthly table, price versus usage split, flags, quote comparison table, savings actions ranked by payback, monthly checklist.
In the UK, point to Ofgem's business energy pages for contract rules. Do not forecast future prices. Do not switch or sign anything; that needs my fresh yes.
```
