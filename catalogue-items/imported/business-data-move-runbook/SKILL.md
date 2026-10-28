---
name: business-data-move-runbook-rebuilt
description: This template should be used when migrating data from one system to another at an organization under 100 employees — typical use cases include QBO→NetSuite, Salesforce→HubSpot, Intercom→Zendesk. Pragmatic runbook scaled to small-org complexity.
metadata:
  version: 1.1.0
  author: catalogue-maintainers
  original_author: erphq
  domain: erpai.studio
  size_tier: 01-org-under-100
  type: template
  scope: internal
---
# Migration Runbook — Under 100 People

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Purpose

At this size, data migrations happen regularly — you're outgrowing the tool you picked 18 months ago. Typical migrations: QuickBooks → NetSuite as revenue grows; HubSpot → Salesforce for sales complexity; Intercom → Zendesk for support scale; Pipedrive → HubSpot for marketing integration; Google Workspace → Microsoft 365 (or vice versa).

The runbook isn't enterprise-scale complexity — it's **a pragmatic checklist that prevents data loss, customer disruption, and post-migration panic.** One document. Maybe 10–30 records of "this happened when." Single engineer or ops person typically executes.

## When to Use

- Moving customer data, financial data, or employee data between systems
- Switching core-business SaaS (CRM, accounting, helpdesk, HR)
- Consolidating tools (e.g., two CRMs → one)

Not every data move needs a runbook. Moving a team's Notion docs from one workspace to another = skip. Moving AP history from QBO to NetSuite = definitely runbook.

If you have an export or field list from the old tool, share it as a spreadsheet. Phase 1 uses it to map source fields to target fields.

## Structure

The runbook has 7 phases: **Plan → Extract → Transform → Load → Validate → Cutover → Decommission**. At this scale, phases 1–4 might take 1–4 weeks; cutover is often a weekend; decommission is 30–90 days of keeping old system read-only.

## Phase 1: Plan (Pre-Migration, Week 1)

- [ ] **Inventory current data** — what tables/objects, how many records, any quirks?
- [ ] **Source + target fields mapped** — spreadsheet: source field → target field + transformation rule
- [ ] **Gaps identified** — fields with no target home; decide: drop, create custom field, or archive-only
- [ ] **Migration tool selected** — native import, ETL tool, paid service (many vendors offer migration)?
- [ ] **Timeline + cutover date set** — with business-window awareness (avoid month-end, quarter-end, payroll)
- [ ] **Stakeholders informed** — who needs to know? Typically: founder, team leads for affected teams, customers if material
- [ ] **Budget approved** — migration tool + consultant hours if needed

## Phase 2: Extract (Week 2)

- [ ] **Full export from source** — usually CSV or API-based
- [ ] **Validation count** — record counts per table match source
- [ ] **Backup saved** — archive-quality source-system export kept indefinitely
- [ ] **Test extract run** — identify quirks before production

## Phase 3: Transform (Week 2–3)

- [ ] **Field mapping applied** — source values transformed per mapping sheet
- [ ] **Data cleanup** — duplicates, orphans, known-bad records addressed (easier in transformation than production)
- [ ] **Custom fields created** in target system if needed
- [ ] **Validation rules verified** — target system's required-field + format rules
- [ ] **Relationships preserved** — accounts → contacts → opportunities etc., foreign keys intact

## Phase 4: Load (Week 3)

- [ ] **Sandbox / test environment load first** (most tools have this)
- [ ] **Test migration of subset** (100 records per major object)
- [ ] **Edge-cases surfaced** — records with weird characters, long fields, boundary cases
- [ ] **Production load scheduled** — during quiet window (typically weekend evening)

## Phase 5: Validate (Post-Load)

- [ ] **Record counts match** source → target per object
- [ ] **Sample-record verification** — pick 20 records across object types; verify field-by-field accuracy
- [ ] **Relationships intact** — account has its contacts; invoice has its line items
- [ ] **Financial totals reconcile** — total AR, total AP, total open pipeline, headcount total match source
- [ ] **Key users validate** — functional test by AE, controller, CS lead etc.
- [ ] **Integration sync works** — upstream / downstream systems see the new data correctly

## Phase 6: Cutover (Day-Of)

- [ ] **Source system frozen** (read-only mode) — no new data going in
- [ ] **Final delta migration** — any records changed since Phase 4 load
- [ ] **User access flipped** — target system available; source system links redirected
- [ ] **Integrations re-pointed** — Stripe → target instead of source
- [ ] **Go-live announcement** sent
- [ ] **Monitoring active** — you're watching for issues first 24 hours

## Phase 7: Decommission (30–90 Days)

- [ ] **Source kept read-only** for 30–90 days for reference + cleanup
- [ ] **Outstanding issues logged** — anything surfacing that needs source-system lookup
- [ ] **Final archive** — before decommission, export + archive source fully (compliance, audit, worst-case recovery)
- [ ] **Subscription canceled** — stop paying for source system
- [ ] **Retrospective** — what worked, what didn't, what would we do differently?

## Rollback Triggers

If any of these happen within 24 hours of cutover, **rollback**:

- **Data corruption** discovered above the limit you set. Agree that limit with the finance or operations owner before the switch. The original author used about 5% of records missing or broken as a rule of thumb; it is not a standard.
- **Critical integration failure** that can't be fixed within 4 hours
- **Customer-facing breakage** (invoices not sending, support tickets lost)
- **Financial totals don't reconcile** and can't be explained
- **Legal / compliance concern** surfaces

### Preserve post-cutover work before reverting

In short: do not throw away work done in the new tool. Pause both tools, save copies of both, work out what changed in the new tool since the switch, put those changes back into the old tool once, and only then reopen it.

Before the switch, record when the old tool was frozen and when the new tool went live. Test how you would copy new records, edits and deletions back. Name one person who owns recovery.

1. Pause writes. Stop users, integrations and background jobs from changing data in both tools. Note the exact time you paused. Keep both tools as they are while you decide what to do.
2. Save copies. Export both tools. Also save the full list of changes made in the new tool since the switch: new records, edits, deletions, attachments and links between records. Check the exports open and are complete. A list of current records cannot show what was deleted.
3. List what changed. Compare the old tool at the freeze, the new tool at the switch and the new tool now. Make a table with one row per change: the record ID in both tools, the value before and after, and what to do with it. Settle any clash with the business owner. Never overwrite an old-tool change without asking. Do not send the same invoice, payment or message twice.
4. Practise on a copy. Apply the changes to a copy of the old tool, in an order that keeps linked records intact. Check that counts, links, money totals and events match. Include invoices that exist only in the new tool. Have finance or operations check the result.
5. Reopen the old tool only when every change in the table has an answer and the owners approve. Send queued work out once. If any part is unfinished, keep both copies saved and writes paused, or agree a fix-forward plan with the owner. Report what is blocking you. Do not call the rollback done.
6. Keep the new tool and your evidence read-only until the checks are done and the agreed retention time has passed. Deleting the new tool is a separate decision, made only after you have a tested copy. Then restart normal work and write down what you learned.

The runbook is a plan. A snapshot or a passing record-count check alone does not establish a completed, lossless rollback.

## Common Mistakes

- **Skipping the sandbox test** — discovering target-system quirks in production is expensive.
- **No data cleanup before migration** — you bring the mess forward. Clean in transformation.
- **No rollback plan** — "it'll be fine." Real migrations need plan-B.
- **Migrating during busy period** — month-end close + migration = disaster.
- **Underestimating edge cases** — customers with weird characters in names break loading.
- **No one accountable** — "the consultant handles it." You own the outcome.
- **Source decommissioned too fast** — need to look something up week 3; data gone.
- **Financial-totals not reconciled** — post-migration books don't match; audit nightmare.
- **Integration assumptions** — "Stripe will just work with the new tool." Test.

## Typical Small-Org Migration Examples

Example timelines and the 5% rollback line above are rough rules of thumb from the original author, not typical facts. Check them against your own data, your team size and your contract before you plan around them.

### QuickBooks Online → NetSuite

Timeline: 6–12 weeks. Engage implementation partner. Concurrent parallel-run period (old + new) 30–60 days. High financial-reconciliation bar.

### HubSpot → Salesforce (or vice versa)

Timeline: 4–8 weeks. Historical activity data frequently lost or incomplete. Contact + company + deal counts easy; activity timeline hard.

### Intercom → Zendesk (or vice versa)

Timeline: 2–4 weeks. Historical conversation data may not migrate cleanly. Chat widget + knowledge base re-deployment required.

### Google Workspace → Microsoft 365

Timeline: 2–6 weeks. Email + calendar straightforward; Drive → OneDrive has quirks; permissions reset.

### Gusto → Rippling (or vice versa)

Timeline: 4–8 weeks aligned with payroll cycle. Payroll history + tax filings historical, benefits enrollment data, equity records. Ideally migrate at quarter-end.

## Output

- Completed runbook (Notion or spreadsheet)
- Data-mapping spreadsheet (source field → target field)
- Validation report (counts, sample checks, financial reconciliation)
- Retrospective notes

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [SOP and runbook checker](https://useaiblocks.com/skills/sop-and-runbook-checker). It takes the document and plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Attribution

Adapted by the catalogue maintainers from erphq migration-runbook at commit eaa34a70a3bcd8a82aad118d10fbb084cdc1363a. The post-cutover recovery procedure is a local correction. Original copyright and permission notice are retained in LICENSE.
