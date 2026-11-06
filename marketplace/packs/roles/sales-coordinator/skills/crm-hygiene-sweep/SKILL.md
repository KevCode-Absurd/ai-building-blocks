---
name: crm-hygiene-sweep
description: Runs a weekly or monthly check of a small sales CRM and returns a fix list - duplicate people and companies, open deals with no next step or date, deals stuck in a stage, lost deals with no reason, holds and quotes past their dates, missing required fields and old enquiries kept longer than the client's retention rule. Also sets up rules that stop the mess coming back. Use it when the pipeline report cannot be trusted, follow-ups are missed, or before a busy season. Fixes fields and stages with level 3 access; merges and deletions always get a fresh yes.
---

# CRM hygiene sweep

## When to use

- The pipeline report shows deals nobody is working on, or totals nobody believes.
- The same buyer appears in two or three records, and replies go to the wrong one.
- Follow-ups are missed because deals have no next step or date.
- The client cannot say why enquiries do not book, because lost reasons are blank.
- Before a busy season, a price change or a move to a new CRM.

## Access needed

- **Level 1 (read):** a CRM export or read access to contacts, companies, deals, stages, activity dates and properties.
- **Level 2 (read and draft):** create views, lists and tasks; propose fixes as a list for the client to approve.
- **Level 3 (read, write and publish):** fill in missing fields from the thread, set next steps and dates, move deals to the right stage, close dead deals with a reason, within the confirmed limits. Log every change.
- **Fresh yes every time:** merging records (it overwrites data), deleting records, bulk changes over the agreed size, and changing pipeline or property settings.

## What you need

1. The CRM name and an export (or access) of contacts, companies and deals with stage, owner, amount, close date, last activity and next activity date.
2. The client's stages and what each one means in plain words.
3. The fields that must be filled at each stage (for example event date and guest count before "Proposal sent").
4. The client's rules: when a quiet deal counts as stale, how long holds and quotes last, how long old enquiries are kept.
5. Who owns which deals.

## Steps

### 1. Write down what each stage means

One line per stage: what must be true for a deal to sit there and what moves it on. If two stages mean the same thing, suggest merging them; if a stage has no clear exit, suggest one. In HubSpot, a separate pipeline only makes sense when the steps really differ, and Won and Lost stages are needed for reporting.

### 2. Find duplicates

Look for the same email, phone number, surname plus event date, or company domain across records. Note where they came from (form, import, integration, manual entry), because the source tells you how to stop new ones. In HubSpot, contacts match on email and companies on domain, but imports without a unique identifier and companies created through the API can slip through. List suspected duplicates with which record to keep and why. Do not merge without a fresh yes.

### 3. Find deals with no next step

Every open deal needs a next step and a date. List those without one, with the last activity and a suggested next step from the thread.

### 4. Find stale and expired deals

Using the client's own rule for "stale", list deals with no activity, holds past their end date, quotes past their expiry and close dates in the past. For each: chase, re-quote, release or close as lost with a reason.

### 5. Find missing fields

Check the required fields for each stage. Fill what the thread shows (at level 3) and list the rest for the owner.

### 6. Check lost reasons

Count lost deals with no reason. Suggest a short fixed list of reasons (date taken, price, chose another supplier, no reply, outside our area, budget too low) so the client can learn from them.

### 7. Check retention

Using the client's retention rule, list old enquiries and contacts due for review. Personal data should be accurate and kept no longer than needed, with set times to review or erase it. Deletion needs a fresh yes, and the client decides the rule (check this with the client's own data protection adviser).

### 8. Stop it coming back

Suggest two or three rules: required fields at key stages, a unique-value property for a reference number, a weekly "no next step" view, an import checklist with a unique identifier.

### 9. Report

A one-page summary with counts, the top fixes and what needs the client's yes.

## Checks

- Each finding names the records, the problem and the suggested fix.
- Merges and deletions are proposals only, awaiting a fresh yes.
- Changes at level 3 stayed within the confirmed limits and are logged with before and after values.
- Stage definitions are in the client's words and agreed before deals are moved.
- No record was changed on a guess; uncertain fixes are listed for the owner.

## Output format

1. Summary: counts by problem type and the three fixes that matter most
2. Duplicates list: records, likely source, which to keep, why
3. No next step / stale / expired list with suggested actions
4. Missing fields list
5. Lost reasons: count missing and suggested reason list
6. Retention review list
7. Rules to stop it coming back
8. Needs your yes: merges, deletions, setting changes

## Example of good output (short)

*Made-up business for illustration: Saltmarsh Travel, a three-person agency with 412 open deals in its CRM.*

> **Summary (sweep of 6 Nov 2026)**
> - 37 suspected duplicate contacts; 29 came from the September brochure-request import, which had no email column mapped.
> - 118 open deals with no next step; 64 of them have had no activity since July.
> - 22 quotes past their expiry date still marked "Quote sent".
> - 81% of lost deals have no reason.
>
> **Top three fixes**
> 1. Close or chase the 64 quiet deals: I have drafted a short check-in for each owner to approve, then close the rest as "No reply".
> 2. Re-quote or close the 22 expired quotes; supplier prices have changed since.
> 3. Make "Travel dates" and "Party size" required before "Quote sent".
>
> **Needs your yes:** merge 37 duplicates (list attached, keeping the record with the most recent booking); change the import template to require email.
