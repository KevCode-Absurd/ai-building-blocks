# Monthly IT health check

**Cadence:** The first working week of each month, about an hour of the office manager's time plus exports. The restore test runs every third month. Also run it after any security incident.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand the work to you or your IT firm. Until you choose, I work at level 1.

## Steps

1. **Collect the evidence (level 1).** A user export with roles, licences and MFA or 2SV status; the admin role list; the device list with OS versions and last update date; backup job history; the ticket export for the month; the list of joiners and leavers from HR. No passwords or codes.
2. **Sign-in check.** List accounts without MFA or 2SV, and admin accounts using SMS only. Use the `tenant-security-baseline` skill's sign-in section. At level 3, enrol or enforce for the named users on the agreed list.
3. **Admin check.** Count top-level admins; confirm at least two named people can get in; flag any admin who no longer needs the role. Removing or adding an admin role always needs a fresh yes.
4. **Joiners and leavers.** Compare the HR list with active accounts and licences. Any leaver still able to sign in is the first fix: at level 3, block sign-in at once and log it, then follow the `starters-and-leavers` skill. Deleting the account needs a fresh yes.
5. **Updates.** List devices missing critical or high-risk updates older than 14 days, devices on unsupported systems, and any software on CISA's Known Exploited Vulnerabilities list that you run. At level 3, push the agreed updates to named groups; otherwise give the list to whoever patches.
6. **Backups.** Read job results for the month. Every third month, run a restore test with the `backup-and-restore-plan` skill (level 3: to a separate location only).
7. **Tickets.** Group the month's tickets by problem. For any problem seen three or more times, write or update a how-to with the `staff-how-to-and-troubleshooting-tree` prompt (level 2: draft; level 3: publish to the agreed help page).
8. **Register.** Update the device and licence register with the `device-and-licence-register` prompt; flag unused seats and renewals in the next 60 days.
9. **Report.** One page: three numbers first (MFA coverage, top-level admin count, devices out of date), then what was fixed, what is still open, and what needs a decision. *Approval: the owner picks which open items go on next month's change list.*
10. **Refresh facts.** Re-check the "What changes fast" table in `knowledge.md` against the official pages and note anything that affects this office.

## Outputs

- Scorecard: MFA coverage, admin count, leavers with access (target zero), devices out of date, last restore test
- Change log of anything done in the tools (what, where, when, result)
- Updated device and licence register
- New or updated staff how-tos
- One-page report for the owner with decisions needed

## Needs the client's approval

**Runs at level 3 within the agreed change list, after one confirmation.** Before the first live change of the month, I show the list (enrol named users in MFA, block sign-in for leavers on the HR list, push agreed updates to named device groups, run the quarterly test restore to a separate location, publish agreed how-tos) with its limits: which tenant, which users and groups, and until when. After your yes, I do these and log each one.

**Always needs a fresh yes.** Deleting any account, mailbox, file or backup; wiping a device; adding, removing or changing any admin role; turning off MFA, security defaults or a backup job; buying anything; and any change not on the agreed list.
