---
name: tenant-security-baseline
description: Checks a small organisation's Microsoft 365 or Google Workspace tenant against vendor guidance, UK Cyber Essentials v3.3, CISA's SCuBA baselines and ENISA's SME steps, then writes a ranked change list covering MFA, admin roles, old sign-in protocols, sharing, updates and recovery. At level 3 it applies only the items on the agreed change list. Use it when taking over an office's IT, before a Cyber Essentials assessment, after a suspicious sign-in, or once a year.
---

# Tenant security baseline

## When to use

- You take over IT for an office and want to know where it stands.
- The business is preparing for Cyber Essentials or a client security questionnaire.
- Someone's account was misused, or an alert came in, and you want to close the obvious gaps.
- The yearly check, or after a big change such as a merger or a move to a new plan.

## What you need

1. Which platform: Microsoft 365, Google Workspace, or both, and the plan names.
2. A user export with roles, licences and MFA or 2SV status. No passwords.
3. The list of admins and what each one does.
4. Either a ScubaGear or ScubaGoggles report, or screenshots of the security and sharing settings.
5. A device list with OS versions, if devices are managed.
6. Any rules the business must follow (Cyber Essentials, a client contract, health or payment data).

**Access:** level 1 to read settings and reports; level 2 to write the change list and set up report-only policies where the plan supports them; level 3 to apply items on the agreed change list. Removing anyone's admin role, deleting accounts, and turning off MFA or security defaults always need a fresh yes.

## Steps

### 1. Write down access and scope

Record the tenant, the access level for each tool, the users or groups in scope and the end date. Until the client answers, stay at level 1.

### 2. Check sign-in

- **Microsoft 365 without Entra ID P1:** are security defaults on? They require MFA registration for everyone, MFA on every sign-in for admin roles, and block old sign-in protocols and device code flow.
- **Microsoft 365 with P1 or P2:** if security defaults are off, do Conditional Access policies give at least the same protection (MFA for all users, MFA for admins, legacy sign-in blocked)?
- **Google Workspace:** is 2SV enforced for everyone, or at least admins and key users? What is the new-user enrolment period?
- **Coverage:** list every account not enrolled in MFA or 2SV. Each one is a finding.
- **Method strength:** do admins use security keys or passkeys? SMS is far better than nothing but not the most secure option.
- **Passwords:** is there a forced-change policy with no sign of compromise? NIST says remove it. Does the policy meet one of the Cyber Essentials options (MFA, 12+ characters, or 8+ with a deny list)?

### 3. Check admin roles

- Count Global Administrators or Super Admins. Aim for a small number of named people, with at least two able to get in.
- Are admin accounts separate from daily accounts, with no email or browsing on them?
- Is anyone an admin who only needs a narrower role (Helpdesk, User Management, Billing)?
- Microsoft: are there emergency access accounts, and do they use a passkey or certificate for MFA?
- Google: are recovery phone and email set for admins, are backup codes stored safely, and does someone know the account and DNS details needed for super admin recovery?
- Are partner or IT-firm admin accounts still needed?

### 4. Check old protocols and app access

- Is anything still using IMAP, POP3 or basic SMTP sign-in (scanners, line-of-business apps)? List each one with its replacement before blocking.
- Which third-party apps have been granted access to mail or files? Flag any that no one recognises.

### 5. Check email and sharing

- Google: pre-delivery scanning and extra malware and link checks on; SPF set; external calendar sharing free/busy only; link sharing off by default for new files; warnings when sharing outside the company.
- Microsoft: who can share outside the organisation from SharePoint and OneDrive, and is guest access reviewed?
- Both: is there a list of who owns each shared drive or site?

### 6. Check devices and updates

- Any unsupported operating system (Windows 10 reached end of support on 14 October 2025)?
- Are automatic updates on? Are critical and high-risk updates installed within 14 days?
- Are devices encrypted, with a PIN or password and a lock after repeated failures?
- Can company data be wiped from a lost phone or laptop?

### 7. Check recovery

- Is there a backup of mail and files beyond the platform's recycle bin (30 days in Microsoft 365, 20 days in Google Workspace for deleted users)?
- Is at least one copy offline or locked away from normal accounts? When was the last restore test?

### 8. Rank and write the change list

Rank each finding by how likely it is to be used against the business and how bad the result would be. Put lock-out risks first in the order of work: add a second admin before tightening sign-in. For each item write the action, the reason with its source, the effect on staff, and how to undo it.

### 9. Apply (level 3 only)

Show the change list and limits, get a yes, then apply in the agreed order. After each change, check it worked (sign in as a test user, read the report again) and log it. Stop if more than one person reports they cannot sign in.

## Checks

- At least two people can still sign in as top-level admin after every change.
- Every finding has a source: vendor guidance, Cyber Essentials v3.3, CISA or ENISA.
- Staff were told before MFA enforcement, with a date and a how-to.
- Items needing a fresh yes are marked and were not applied without it.
- No password, backup code or recovery code appears in the report.
- The report says what was checked and what was not, and never calls the tenant "secure".

## Output format

1. Scope, access levels and date
2. Scorecard: MFA coverage, number of top-level admins, legacy protocols, unsupported devices, last restore test
3. Findings table: ID, area, finding, evidence, risk, source
4. Change list: ID, action, reason, staff impact, undo, access level, needs fresh yes (Y/N)
5. Staff message for any change they will notice
6. Change log (after level 3 work)
7. Next review date

## Example of good output (short)

*Illustrative structure, not a real business: a dental studio, 18 staff, Microsoft 365 Business Standard. Copy the shape, never the content: every fact comes from the client's own context.*

| ID | Action | Reason | Staff impact | Undo | Level | Fresh yes |
|---|---|---|---|---|---|---|
| C1 | Add a second named Global Administrator (practice manager) on a separate admin account with a passkey | Only one person can sign in as top-level admin; Microsoft advises emergency access and few, named admins | None | Remove role | 3 | Y (admin role change) |
| C2 | Turn on security defaults on Monday 9am after the staff email on Thursday | 6 of 18 accounts have no MFA; old protocols open | Everyone registers the Authenticator app at next sign-in | Turn off (fresh yes) | 3 | N |
| C3 | Move the reception scanner from basic SMTP sign-in to a supported send method first | Security defaults will block it | Scanner offline for 15 minutes | Revert setting | 3 | N |
| C4 | Replace the two Windows 10 PCs at the front desk | Out of support since 14 Oct 2025 | New PCs | n/a | Owner decision | Y (purchase) |
