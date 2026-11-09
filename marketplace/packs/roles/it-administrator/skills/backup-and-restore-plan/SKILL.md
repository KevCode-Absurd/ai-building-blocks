---
name: backup-and-restore-plan
description: Plans a small office's backups and proves they work. Lists what data matters and where it lives, sets how much data and downtime the business can lose, designs copies with at least one offline or locked-away copy, and writes and runs a restore test with an evidence log. Based on NCSC, CISA and ENISA backup guidance. Use it when setting up backups, after a scare, when nobody knows if restores work, or every quarter for the restore test.
---

# Backup and restore plan

## When to use

- The office has no backup plan, or "it's in the cloud" is the whole plan.
- Nobody can say when a file was last restored from backup.
- After ransomware news, a lost laptop, or a deleted folder.
- Every quarter, for the restore test.

## What you need

1. A list of systems and data: Microsoft 365 or Google Workspace mail and files, accounting, line-of-business apps, file server or NAS, laptops, website.
2. For each: who owns it, how bad it would be to lose a day of changes, and how long the business can run without it.
3. The current backup set-up: tool, schedule, where copies go, who can delete them, and the last restore test.
4. Budget limits for any new storage or service (prices come from the vendor's page on the day).

**Access:** level 1 to read job history and settings; level 2 to draft the plan and the test; level 3 to add agreed data to existing jobs and run test restores to a separate location. Deleting backups, shortening how long they are kept, turning a job off, or restoring over live data always need a fresh yes.

## Steps

### 1. List what matters

For each system, write:
- what data it holds and where;
- the owner;
- **how much data you can afford to lose** (for example "one working day of invoices") — this sets how often to back up;
- **how long you can be without it** (for example "half a day for email, two days for the archive") — this sets how fast a restore must be.

Ask the owner for these, in their words. Do not invent targets.

### 2. Check what the platform does and does not cover

- Deleted users can be restored for only 30 days in Microsoft 365 and 20 days in Google Workspace. Recycle bins and version history help with small mistakes but are not a separate copy.
- Ask: if the account itself were taken over and someone deleted everything, where would the copy come from?

### 3. Design the copies

- Keep at least one copy that ransomware on your network or a stolen admin account cannot reach: an unplugged drive, or a cloud backup with separate sign-in, MFA, versioning and no delete rights for normal accounts (NCSC).
- Keep copies in more than one place. The 3-2-1 rule (three copies, two devices, one offsite) is a good start but does not on its own ensure an offline copy.
- Encrypt backups, especially any that travel (CISA, ENISA).
- Automate the schedule. A backup that depends on someone remembering will stop.
- If you use a USB or external drive, unplug it between backups (Cyber Essentials v3.3).
- For key machines, keep a "golden image" or a written rebuild guide so you can rebuild, not only restore files (CISA).
- Limit who can change or delete backups to named people with MFA.

### 4. Write the restore test

For each system, choose one realistic test:
- restore a named file or folder from last week to a separate test location;
- restore a mailbox item for a test user;
- for a key machine, rebuild it from the image on spare hardware or a test machine, once a year.

Write what "pass" means before you start: the right version, opens correctly, within the time the owner set.

### 5. Run the test (level 3, or your admin)

- Restore to a separate location, never over live data without a fresh yes.
- Time it. Record what was restored, from which date, how long it took, and whether it opened.
- If it fails, stop and record why; that is the most useful result a test can give.

### 6. Report and fix

Compare each result with the owner's targets. List gaps with an owner and a date. Book the next test.

## Checks

- Every important system has an owner, a data-loss limit and a downtime limit in the owner's words.
- At least one copy is offline or locked away from normal admin accounts.
- Backup accounts have MFA and only named people can delete.
- A restore was actually performed, timed and recorded, not just a "job succeeded" message read.
- No test restored over live data.
- No passwords or encryption keys appear in the plan; the plan says where they are kept and who holds them.
- For personal data in the EU or UK, the plan notes where backups are stored, because location matters under data protection rules.

## Output format

1. System table: system, data, owner, data-loss limit, downtime limit, current backup, gap
2. Backup design: copies, locations, schedule, offline copy, who can delete
3. Restore test plan: system, test, pass rule, who, when
4. Evidence log: date, system, what was restored, from which date, time taken, result, notes
5. Gaps and fixes with owners and dates
6. Next test date

## Example of good output (short)

*Illustrative structure, not a real business: an accountancy firm, 9 staff, Google Workspace and a NAS. Copy the shape, never the content: every fact comes from the client's own context.*

| System | Owner | Data-loss limit | Downtime limit | Last restore test | Result | Gap |
|---|---|---|---|---|---|---|
| Client files (Shared drives) | Partner | 1 working day | 1 day | 3 Nov 2026: folder "2026 VAT" restored to test drive in 22 min | Pass | Backup service admin has no MFA |
| NAS archive | Office manager | 1 week | 3 days | Never | Not tested | USB copy always plugged in; no offline copy |
| Email | Each user | 1 day | Half a day | 3 Nov 2026: one message restored for test user | Pass | None |

Fixes: turn on MFA for the backup service admin (office manager, by 10 Nov); rotate two USB drives weekly, one kept off site (office manager, from 14 Nov); first NAS restore test on 21 Nov.
