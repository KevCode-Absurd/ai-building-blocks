# Office IT set-up or clean-up

**Trigger:** A new office opens, an office moves, a business switches to Microsoft 365 or Google Workspace, or a new owner or manager takes over IT that grew without a plan. Usually two to six weeks.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool. Until you choose, I work at level 1.

## Steps

1. **Intake (level 1).** Staff count now and in a year, rooms and hybrid pattern, current devices and accounts, key apps, the date that matters, budget limits and who approves spending. Ask which access level applies to each tool and write it under "Access I have".
2. **Plan.** Run the `office-it-plan` prompt for needs, account plan, security basics, register columns, backups and order of work. *Approval: the owner signs off the plan and budget before anything is bought or changed.*
3. **Baseline the tenant.** Run the `tenant-security-baseline` skill. For a brand-new tenant, the change list is the target settings; for an old one, it is the gap list. *Approval: the owner agrees the change list and its limits.*
4. **Admins first (fresh yes).** Set up at least two named admins on separate admin accounts with strong MFA (and Microsoft's emergency access accounts where used) before tightening sign-in. Every admin role change needs a fresh yes.
5. **Sign-in and accounts (level 3 within the list).** Tell staff the date and send the how-to; turn on security defaults or 2SV enforcement; create or tidy accounts and groups by role with the `starters-and-leavers` skill.
6. **Files and sharing.** Run the `file-and-permission-structure` prompt. At level 2, draft the structure and migration plan; at level 3, create the agreed sites or shared drives and groups and move files in the agreed order, with a pilot group first. Deleting old shares needs a fresh yes after the move is checked.
7. **Devices.** Build the register with the `device-and-licence-register` prompt; enrol devices in management, turn on updates and encryption for named groups (level 3). Replace or isolate unsupported devices; purchases need the owner's yes.
8. **Backups.** Run the `backup-and-restore-plan` skill and complete one restore test before calling the job done.
9. **Help.** Write the first five staff how-tos with the `staff-how-to-and-troubleshooting-tree` prompt and agree how staff raise a ticket.
10. **Scripts.** Automate any repeat chore found on the way with the `safe-admin-script` skill, dry run first.
11. **Handover.** Give the owner the runbook, register, change log and a list of open items; book the first monthly health check.

## Outputs

- Signed-off IT plan and budget sheet (prices collected by the client)
- Change list and change log
- Admin and access map by role
- File structure and migration record
- Device and licence register
- Backup plan with the first restore test evidence
- Staff how-tos and the help process
- Runbook for whoever looks after IT next

## Needs the client's approval

**Runs at level 3 within the agreed change list, after one confirmation.** Account creation and group changes, MFA enforcement on the announced date, sharing settings, device policies for named groups, file moves in the agreed order, backup jobs and test restores to a separate location, and publishing the agreed how-tos.

**Always needs a fresh yes.** Any admin role change; deleting accounts, mailboxes, old file shares or backups; wiping devices; turning off MFA or backups; buying equipment or services; and anything outside the agreed list.
