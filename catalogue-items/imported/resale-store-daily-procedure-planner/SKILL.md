---
name: nonprofit-retail-store-operations
description: "Runs resale-store floor procedures: point-of-sale/inventory systems, cash handling and reconciliation, loss prevention/shrinkage control, opening/closing procedures. Use for 'set up our POS,' 'design a daily cash reconciliation process,' 'reduce shrinkage.' Org-wide control policy lives in nonprofit-financial-controls; this implements it on the floor."
license: MIT
metadata:
  supervision: "review"
  supervision_note: "Cash handling, reconciliation and loss prevention are financial controls."
  date_added: "2026-09-07"
  date_added_source: "git:1860ed47a83901ff5e6d45abc4a2ef05be8fd4cd"
---

# Nonprofit Retail Store Operations

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a document, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **A chat AI that can read your files:** The skill works from records and drafts you provide. Research tasks also need current, checked public sources.
<!-- /needs -->

## When to Use This Skill

Use this skill to build or fix the day-to-day operating procedures of a resale storefront: point-of-
sale (POS) and inventory system selection/configuration, daily cash handling and till reconciliation,
loss prevention and shrinkage control, and opening/closing checklists. Typical triggers: "our till
never balances," "we need a POS system for the thrift store," "shrinkage is climbing, what's our loss-
prevention plan," "write an opening/closing checklist for store staff," "reconcile daily cash across
multiple registers."

**Boundary:** this skill is the retail-floor procedure layer — how controls are executed at the
register and on the floor day to day. Org-wide internal control *policy design* (approval thresholds,
segregation of duties, board-adopted financial policy, audit prep) belongs to your group's approved financial rules, which are not part of this item. This skill implements those policies at store level and should reference, not redesign, the
org's approval-threshold table. Ask the user to paste those rules. Pricing strategy and merchandising are covered by the Resale store pricing and layout planner. Online marketplace operations are covered by the Donated goods online resale planner. Staffing and scheduling of the people running these procedures is not covered here: ask your store lead.

## Core Framework: The Store Operations Triangle

Every resale store's floor operation rests on three interlocking systems, each with its own named
failure mode if under-built:

1. **POS/inventory system** — the transaction and stock-tracking backbone; weak systems produce
   unreliable sales and shrinkage data that makes every other control (cash reconciliation, loss
   prevention) impossible to verify.
2. **Cash handling and reconciliation** — the daily till-count, deposit, and reconciliation cycle
   that turns register activity into verifiable, bank-matched revenue.
3. **Loss prevention** — the combination of physical, procedural, and data controls that keep
   shrinkage (inventory or cash loss from theft, error, or breakage) within an acceptable, tracked
   range.

A resale store is unusually exposed on all three relative to ordinary retail: donated inventory has
no invoice trail to check receipts against, item-level pricing is often set at the register rather
than pre-ticketed with barcodes, and high volunteer-to-staff ratios raise both training and
accountability challenges. Build procedures assuming these conditions, not a standard retail template.

## Standard Terminology

- **Shrinkage / shrink rate**: inventory value lost to theft, damage, spoilage, or administrative
  error, typically expressed as a % of retail sales; track it monthly and investigate any month-over-
  month jump immediately rather than averaging it away.
- **Till float**: the fixed starting cash amount in a register drawer at open, counted back to the
  same amount at close before the day's sales are deposited.
- **Over/short report**: the daily reconciliation output showing the difference between expected
  cash (float + recorded sales) and actual counted cash per register/cashier.
- **Dual-count verification**: two people independently counting and initialing a cash drawer at
  open/close/deposit — the single highest-leverage cash control for a thrift store's small-team
  reality.
- **Sweep**: periodically removing excess cash from the register to a locked drop safe during the
  business day, so the working till never accumulates more than a set cap exposed at the counter.

## Step-by-Step: Building Store Operations Procedures

1. **Select or configure a POS/inventory system** that supports category-level (not necessarily full
   SKU-level, given donated-goods volume) sales tracking, discount/markdown-tag entry, and a daily
   close-of-day sales report by category and payment type.
2. **Write opening procedures**: unlock/alarm sequence, till float count-in with dual verification,
   register/terminal power-on and system check, floor walk-through for safety, and a designated
   opener sign-off.
3. **Write closing procedures**: final sale cutoff, till count-out with dual verification against the
   POS close-of-day report, discrepancy documentation on any over/short, deposit prep, alarm/lock
   sequence, and a designated closer sign-off.
4. **Set the daily over/short threshold and escalation path**: define what dollar variance is normal
   register error ([YOUR APPROVED LIMIT], a placeholder: replace it with the group's approved variance limit before use) versus what triggers a manager review and, above a second
   threshold, a report up to whoever owns org-wide financial controls per your group's
   approved approval structure — this skill executes that org policy at store level rather than
   setting the threshold itself.
5. **Build the deposit and reconciliation cycle**: bank the counted deposit promptly (same or next
   business day), reconcile the bank-deposit slip against the POS close-of-day total, and route any
   variance to a second person for review, never the same person who counted the till.
6. **Design physical and procedural loss-prevention controls**: fitting-room item-count tags, staffed
   or camera-monitored blind spots, a no-cash-in-pockets policy for register staff, mandatory receipt
   for every transaction (also a fraud control — no receipt enables a "no-sale" cash skim), and a
   locked backroom/donation-holding area so unsorted or unpriced inventory isn't accessible to
   shoppers or unsupervised staff.
7. **Track and review shrinkage monthly** by comparing POS-recorded inventory movement against
   physical spot counts in high-value categories (electronics, boutique section); investigate any
   month with a shrink-rate jump before the next inventory cycle, not after.
8. **Run periodic unannounced till audits** and rotate which staff/volunteers are paired for
   dual-count duties, so no single pairing becomes a long-term blind spot.
9. **Document every procedure in a store operations manual** accessible to all shift staff and
   volunteers, and retrain to it whenever a POS system changes or a new loss-prevention control is
   added.

## Standard Deliverables

- POS/inventory system configuration checklist
- Opening/closing procedure checklists with sign-off lines
- Daily over/short report template and escalation thresholds
- Deposit reconciliation procedure
- Loss-prevention control checklist (physical + procedural)
- Monthly shrinkage report

## Common Failure Modes

- **Single-person till counts** with no dual verification, removing the only real-time check against
  cash skimming or simple counting error.
- **No receipt required for every sale**, which both frustrates customers on returns and opens a
  "no-sale" register fraud vector.
- **POS system used only for ringing sales, not tracked for shrinkage**, so inventory loss goes
  undetected until a full physical count reveals a large unexplained gap.
- **Deposits delayed or batched irregularly**, making bank reconciliation difficult and creating a
  window where cash sits unsecured on-site.
- **Store-level procedures invented ad hoc instead of tied to the org's approval-threshold policy**,
  creating a gap between what the group's approved financial rules say should happen and what actually
  happens at the register.
- **Unsorted/unpriced backstock accessible to the sales floor**, enabling both shrinkage and
  inconsistent off-book pricing by whoever reaches it first.

## Practitioner vs. Advisor Framing

- **As a store manager**, treat the over/short report as a daily habit, not a monthly audit artifact
  — same-day review of a variance is far more likely to identify a training gap or an actual loss
  than a variance discovered weeks later with no memory of that day's specifics.
- **As a consultant advising a resale store**, don't propose new policy thresholds from scratch —
  first confirm the org's board-adopted approval/threshold policy (ask the user to paste it)
  and design the store procedure to execute that policy; a floor-level fix that contradicts org policy
  creates an audit finding even if it "solves" the immediate operational complaint.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Process and procedure writer](https://useaiblocks.com/skills/process-and-sop-writer). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
