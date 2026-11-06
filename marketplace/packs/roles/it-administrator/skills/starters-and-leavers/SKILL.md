---
name: starters-and-leavers
description: Builds and runs the IT side of joiners, movers and leavers in Microsoft 365 or Google Workspace, following each vendor's own order of steps. Starters get the right groups, licences, MFA and devices on day one; movers lose old access; leavers are blocked first, their mail and files handed over, and accounts deleted last and only with a fresh yes. Use it when someone joins, changes role or leaves, or to write the office's standing checklist.
---

# Starters, movers and leavers

## When to use

- HR or a manager says someone is joining, changing role or leaving.
- The office has no written checklist, or licences are still billed for people who left.
- After an incident where a former employee still had access.

## What you need

1. Platform (Microsoft 365, Google Workspace) and the other apps staff use (accounting, CRM, chat, password manager).
2. For a starter: name, role, start date, manager, which groups or teams, which devices.
3. For a mover: old role, new role, date.
4. For a leaver: last working day, whether it is friendly or urgent, who takes over mail and files, company devices they hold, and any instruction to keep data (for example a legal hold).
5. The group or role map: which groups give which access.

**Access:** level 1 to read users, groups and devices; level 2 to prepare the checklist and the draft account; level 3 to create accounts, assign groups and licences, block sign-in and set up handover within the agreed list. Deleting an account, mailbox or files, wiping a device, and giving or removing any admin role always need a fresh yes, even at level 3. I never set, see or send a password.

## Steps

### Starters

1. **Confirm the request.** Check it came from the manager or HR through the agreed channel, not an email that only claims to.
2. **Create the account** with the naming pattern, in the right group or organisational unit, and assign the licence.
3. **Give access through groups mapped to roles**, never directly to the person. Check the role map; no admin roles.
4. **Sign-in set-up.** Use the platform's own first sign-in flow so the person sets their own password and registers MFA or 2SV on day one. If a temporary password is needed, your admin gives it to the person directly, by phone or in person, never through chat or a ticket.
5. **Devices.** Enrol the laptop and phone in device management, check encryption and updates, and record them in the device register with the owner.
6. **Other apps.** List each one, who adds the user, and tick it off.
7. **Day-one check.** The person signs in, gets an MFA prompt, opens their shared drive, and sends a test email.

### Movers

1. List the groups and app access the old role had and the new role needs.
2. Add the new access, then remove access the new role does not need on the agreed date. Cyber Essentials expects special access to be removed when someone changes role.
3. Hand over anything they owned in the old role (shared drives, distribution lists).

### Leavers

Follow the vendor's order. Block first; delete last.

**Microsoft 365** (Microsoft's own sequence):
1. Block sign-in and sign the person out of all sessions.
2. Save the mailbox content if needed.
3. Wipe company data from their mobile devices and block them (fresh yes for the wipe).
4. Forward email to the person taking over, or convert the mailbox to a shared mailbox.
5. Give the person taking over access to OneDrive and Outlook content.
6. Remove the licence. Mail is kept for 30 days after this, then deleted.
7. Delete the account only after the handover is confirmed (fresh yes). It can be restored for 30 days. If accounts sync from on-premises Active Directory, delete it there instead.

**Google Workspace:**
1. Suspend the user so they cannot sign in, and check which third-party apps they had connected.
2. Transfer Drive files, Calendar and other data to the person taking over. Files in shared drives stay where they are.
3. Decide: keep the account suspended, archive it to keep the data at lower licence cost, or delete it.
4. Delete only after the transfer is confirmed (fresh yes). A deleted user can be restored within 20 days; after that the data is unrecoverable.

**For both:**
- Remove the person from other apps, shared password vault collections and any shared accounts. Change any shared password they knew, using the password manager, never chat.
- Collect devices; wipe and reissue them (fresh yes for the wipe).
- If they were an admin, remove the role (fresh yes) and check at least two admins remain.
- Record the date and time access was removed.

**Urgent leavers.** If the departure is hostile or sudden, block sign-in and sessions at the agreed time, before the person is told where possible, then carry on with the handover. Agree that timing with the manager in advance.

## Checks

- The request came from an authorised person through the agreed channel.
- Access is given by group, never directly; no one gets admin roles through a starter checklist.
- Every leaver's sign-in was blocked by the agreed time, and the time is logged.
- Handover was confirmed before any deletion, and deletion had a fresh yes.
- At least two top-level admins remain after any leaver who was an admin.
- No password, MFA code or recovery code appears in the checklist, ticket or chat.
- The licence count matches active staff.

## Output format

1. The checklist: step, system, owner, due, done (with time), notes
2. For level 3 work: the change log (what, where, when, result)
3. Open items needing a fresh yes, listed separately
4. A one-line confirmation for HR: "Access removed at 17:05 on 14 Nov; mail forwarded to J. Ortega until 14 Dec."

## Example of good output (short)

*Made-up business: Northgate Joinery, 12 staff, Google Workspace and Xero.*

| # | Step | System | Owner | Due | Done |
|---|---|---|---|---|---|
| 1 | Suspend Sam Patel's account at 17:00 | Google Admin | Agent (level 3) | Fri 14 Nov 17:00 | 17:02 |
| 2 | Remove from Xero and the "Workshop" vault collection | Xero, Bitwarden | Office manager | Fri 17:30 | 17:20 |
| 3 | Change the van tracker shared password in the vault | Bitwarden | Office manager | Fri 17:30 | 17:25 |
| 4 | Transfer Drive files and Calendar to Lena Ortiz | Google Admin | Agent (level 3) | Mon 17 Nov | |
| 5 | Wipe and reissue laptop NJ-07 | Endpoint management | Agent | Mon 17 Nov | Needs fresh yes |
| 6 | Delete account after Lena confirms files | Google Admin | Agent | After 24 Nov | Needs fresh yes |
