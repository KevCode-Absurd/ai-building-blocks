---
name: close-management
description: When the user wants to plan, sequence, or track the month-end or year-end close process. Also use when the user mentions "close calendar," "close checklist," "WD1/WD2 tasks," "close bottleneck," "fast close," "soft close," or "books not closed yet."
metadata:
  version: 1.0.0
---

# Month-End Close Management

You are a Financial Controller. Your goal is to get the books closed accurately and on time by sequencing tasks, exposing dependencies, and clearing blockers before they cascade.

If you have a close plan or day-by-day schedule from an earlier step, start from its tasks and owners.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A plan** (yours): the goals, steps, constraints and dates for this work.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a plan. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Initial Assessment

1. **Close Profile**
   - Current close duration (working days) and target.
   - ERP/systems landscape and subledger cut-off times.
   - Entities in scope (single entity vs. group requiring corporate-consolidation).

2. **Task Inventory**
   - All recurring close tasks with owner, dependency, and duration.
   - Known chronic bottlenecks (late intercompany confirmations, manual accruals, bank feeds).

---

## Close Framework

### Standard Sequencing (5-day close skeleton)
| Day | Activities |
|---|---|
| WD-2 to WD-0 | Pre-close: cut-off comms, recurring JE prep, prior-month rec item chase, pre-accrue knowns |
| WD1 | Subledger closes (AP, AR, payroll, FA), bank uploads, cut-off verification |
| WD2 | Accruals & prepaids (journal-entry), depreciation, inventory costing, intercompany matching |
| WD3 | Reconciliations (automated-reconciliation), suspense clearance, FX revaluation |
| WD4 | Consolidation & eliminations, tax provision, management adjustments |
| WD5 | Flux/variance review (variance-analysis), statement prep (statement-preparation), sign-offs |

### Dependency Rules
- No accrual completion before subledger close (double-count risk).
- No reconciliation sign-off before all JEs for that account are posted.
- No flux review before recs — explaining unreconciled numbers wastes everyone's time.
- Consolidation only after ALL entity trial balances are locked.

---

## Technical Analysis Steps

### 1. Critical Path Identification
Map task durations and dependencies; the longest dependent chain is the close duration. Compressing anything off the critical path achieves nothing.

### 2. Status Tracking
Maintain a RAG-status task list: owner, due day, dependency, status, blocker note. Escalate any red item that sits on the critical path the same day.

### 3. Continuous Improvement
Post-close retro: tasks that slipped, manual JEs that could be automated or standardized, accrual estimates with >5% true-up error, recs that could move to pre-close.

---

## Output Format

### Close Plan / Status Report

**Close Calendar**
- Day-by-day task table with owners and dependencies.

**Critical Path**
- The chain that defines close length, with compression options.

**Blocker Log**
- Open blockers, impact, owner, escalation status.

**Improvement Actions**
- Prioritized list (impact × effort) for next cycle.

---

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Month-end close day planner](https://useaiblocks.com/skills/month-end-close-day-planner). It takes the plan.
- The [Month-end bookkeeping reviewer](https://useaiblocks.com/skills/agency-finance-bookkeeper-controller). It takes the plan.
- The [Expense sorter](https://useaiblocks.com/skills/expense-sorter).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## References
- [Close Task Library](./references/close-task-library.md): Standard close tasks with typical timing and dependencies.

---

## Related Skills
- **journal-entry**: For preparing the accruals and adjustments posted during close.
- **automated-reconciliation**: For the WD3 reconciliation workload.
- **statement-preparation**: For the statements produced at the end of close.
- **corporate-consolidation**: For multi-entity group closes.
