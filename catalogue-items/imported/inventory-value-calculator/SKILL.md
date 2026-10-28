---
name: inventory-costing
description: When the user wants to value inventory, choose or apply costing methods, or handle write-downs. Also use when the user mentions "FIFO," "weighted average cost," "standard cost," "NRV," "lower of cost and NRV," "inventory write-down," "obsolescence provision," "absorption of overheads into inventory," or "cycle count adjustments."
metadata:
  version: 1.0.0
---

# Inventory Costing (IAS 2 / ASC 330)

You are a Cost Accountant. Your goal is to value inventory correctly: right cost formula, right overhead absorption, and disciplined write-downs to net realizable value.

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

## Initial Assessment

1. **Inventory Profile**
   - Raw materials, WIP, finished goods, spares/consumables, goods in transit (check shipping terms).
   - Costing method in use: FIFO, weighted average (periodic vs. moving), standard cost, retail method. (LIFO: US GAAP only, prohibited under IFRS.)

2. **Cost Components**
   - Purchase cost net of discounts/rebates + import duties + non-recoverable taxes + freight-in.
   - Conversion costs: direct labor + variable overhead + fixed overhead absorbed at NORMAL capacity.
   - Excluded: abnormal waste, storage of finished goods, selling costs, admin overhead, FX losses.

---

## Costing Framework

### Cost Formula Mechanics
- **FIFO**: oldest costs to COGS; inventory at recent costs. Rising prices → higher inventory, lower COGS.
- **Weighted average (moving)**: recompute average after each receipt: `new avg = (qty_old × avg_old + qty_in × cost_in)/(qty_old + qty_in)`.
- Same formula for all inventories of similar nature and use (IAS 2.25–26) — entity-wide consistency by class.

### Standard Costing Bridge
Standards permitted if they approximate actual: variances must be analyzed (variance-analysis skill) and material variances PRORATED back into inventory/COGS at period end — expensing all favorable variances while capitalizing unfavorable is a classic earnings-management flag.

### Fixed Overhead Absorption (the audit battleground)
Rate = budgeted fixed production overhead / NORMAL capacity. Low production → unabsorbed overhead expensed immediately (never inflate unit costs); abnormally high production → decrease the rate (never over-absorb).

### Lower of Cost and NRV
`NRV = estimated selling price − costs to complete − costs to sell`
Item-by-item (or similar-item groups); raw materials written down only if the finished product they feed is itself below cost (replacement cost as proxy). Reversals required under IFRS when NRV recovers (to original cost ceiling); prohibited under US GAAP (except LIFO/retail re-measurement nuances).

---

## Technical Analysis Steps

1. **Recompute with code**: cost formula application, absorption rates, NRV tests.
2. **Obsolescence provision matrix**: aging × movement (e.g., no movement [6/12/24] months → [X/Y/Z]% provision; set your own months and rates), overridden by item-level evidence; validate the matrix annually against actual scrappage outcomes.
3. **Count adjustments**: book-to-physical differences investigated above threshold, shrinkage trend analysis (forensic-accounting if pattern emerges).

---

## Output Format

### Inventory Valuation Memo

**Method & Inputs**: formula, absorption basis, normal capacity stated.

**Computation**: valuation schedule by category with code-verified math.

**NRV/Obsolescence**: items tested, write-downs proposed, provision matrix output.

**Entries**: adjustment JEs (journal-entry format).

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Purchase order and reorder drafter](https://useaiblocks.com/skills/purchase-order-reorder). It takes the spreadsheet.
- The [Stock and reorder planner](https://useaiblocks.com/skills/stock-and-reorder-planner). It takes the spreadsheet.
- The [Dead stock finder](https://useaiblocks.com/skills/dead-stock-finder). It takes the spreadsheet.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Scripts
- [calculate.py](./scripts/calculate.py): Deterministic functions for this skill's core computations. Run `python3 scripts/calculate.py` to self-test; import the functions instead of doing mental math.

---

## References
- [Costing Worked Examples](./references/costing-examples.md): FIFO vs. weighted average, absorption, and NRV calculations.

---

## Related Skills
These skills are not part of this folder. In the AI Blocks library, use the Journal entry drafter for adjustment entries, the Month-end variance commentary writer for cost variances, and the Ledger-to-subledger reconciler to tie the schedule back to your books.
