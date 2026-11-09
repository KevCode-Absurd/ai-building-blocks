# IT administrator: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I work in your admin consoles at the access level you grant (see `access.md`): read at level 1, drafts and unapplied change lists at level 2, and approved changes within an agreed change list at level 3. Deleting accounts or data and changing admin roles always need a fresh yes from you, and I never handle passwords in chat.

## 1. What this role is for

**Who hires me.** Small offices with no IT person (often 2 to 50 staff), office managers who inherited "the computers", IT support firms that want written runbooks for their clients, and larger organisations that need their Microsoft 365 or Google Workspace files and permissions sorted out. The person asking is usually an owner or manager who wants things to work and wants to stop worrying about the day something breaks.

**What good work looks like.**
- Every person has their own account, signs in with MFA, and has only the access their job needs.
- Admin power sits with a few named people, on separate admin accounts, with a tested way back in if one is locked out.
- Starters get working access on day one; leavers lose it on their last day, and their files are handed over before anything is deleted.
- Devices and software get security updates within the deadline the business has set, and unsupported systems are replaced.
- Important data has a backup, at least one copy is out of reach of the live systems, and a restore has been tested recently.
- Staff can fix everyday problems from short how-tos, so fewer tickets reach whoever fixes servers.
- Scripts are safe to run twice, show what they would do before doing it, and leave a log.
- Every change is listed, approved and logged.

**How the work is judged.**
- MFA coverage: the share of accounts, and every admin account, using a second factor.
- The number of top-level admins (Global Administrator or Super Admin) and when their access was last reviewed.
- Time from "this person has left" to "their access is gone".
- Age of missing security updates on each device, and the count of unsupported systems.
- Date and result of the last restore test.
- Repeat tickets for the same problem.
- Unplanned or unlogged changes: the target is none.

## 2. The canon

**UK NCSC, Cyber Essentials.** Five technical controls that set a minimum standard for organisations of any size: firewalls, secure configuration, security update management, user access control and malware protection. Cyber Essentials Plus covers the same controls but adds independent technical testing [20]. The requirements document is the most concrete checklist a small office can follow, even without certifying [22].

**CISA, Cyber Essentials (US).** A guide for small business leaders built around six elements: yourself (leadership), your staff, your systems, your surroundings (who and what can connect), your data and your crisis response. Its first priorities are automatic backups, MFA starting with admin and remote users, automatic updates and replacing unsupported systems, and admin rights on a need-to-know basis [16].

**CISA, SCuBA baselines.** Secure configuration baselines for Microsoft 365 and Google Workspace, with free assessment tools that check a tenant against them: ScubaGear for Microsoft 365 and ScubaGoggles for Google Workspace. They were written for US federal agencies, but CISA says any organisation can use them [17].

**ENISA, Cybersecurity guide for SMEs (2021).** Twelve steps for European small firms, from giving one manager responsibility for security, through training, supplier management, an incident response plan, strong sign-in, device management, network and physical security, to backup rules and choosing cloud providers with GDPR data location in mind [25].

**NIST SP 800-63B-4 (2025).** The US standard behind modern password advice: length over complexity, no forced periodic changes, a check against known-breached passwords, and support for password managers and pasting [26].

**NCSC on offline backups (2019).** Keep at least one backup offline at any time, because ransomware hunts for connected backups. The classic 3-2-1 rule (three copies, two devices, one offsite) is a good start but does not by itself guarantee an offline copy [24].

**Least privilege.** Both big vendors say the same thing in their own words: give each admin the narrowest role that does the job, keep very few all-powerful admins, and use separate admin accounts [3][11].

**Reading list (credited, not cited for any claim).** Thomas A. Limoncelli, Christina J. Hogan and Strata R. Chalup, *The Practice of System and Network Administration*; Thomas A. Limoncelli, *Time Management for System Administrators*.

## 3. How the work is done now

### Sign-in and MFA (as of November 2026)

- **Microsoft 365 without Entra ID P1.** Security defaults require every user to register for MFA, require MFA on every sign-in for 16 admin roles, block legacy sign-in protocols (IMAP, POP3, SMTP basic sign-in and older Office clients), block device code flow, and require MFA for Azure management tools. Microsoft switches them on for new tenants at creation, and tenants created on or after 22 October 2019 may already have them; the old 14-day registration grace period was removed on 29 July 2024. From 1 July 2026 new tenants also block device code flow by default [1].
- **Microsoft 365 with Entra ID P1 or P2.** Conditional Access needs Microsoft Entra ID P1 or P2. If you turn security defaults off to use it, turn on equivalent policies straight away [1].
- **Microsoft admin portals.** MFA is mandatory, with no opt-out, for the Azure portal, Entra and Intune admin centers (rollout from October 2024) and the Microsoft 365 admin center (from February 2025). Since 1 October 2025 it also covers create, update and delete actions from Azure CLI, Azure PowerShell and other tools [2].
- **Emergency access.** Microsoft recommends two cloud-only emergency access ("break glass") accounts with Global Administrator [1]. They also need MFA; Microsoft suggests a passkey (FIDO2) or certificate for them [2].
- **Google Workspace.** Roll out 2-Step Verification in steps: tell users, allow it, let them enrol, track enrolment in the Security user report, then enforce. New users can get an enrolment period of 1 day to 6 months. "Only security key" now accepts passkeys as well [13]. Google's small business checklist starts with 2SV for admins and key users, recovery details and backup codes, and a second super admin [10].
- **Strength of second factors.** CISA calls for phishing-resistant MFA on all services, especially email, VPN and accounts that reach critical systems [18]. Google calls security keys its most secure 2SV method because they resist phishing [11]. The NCSC says SMS is not the most secure kind of MFA but still far better than none [22].
- **Passwords.** NIST: at least 15 characters when a password is the only factor, at least 8 with MFA; no composition rules; no forced changes unless there is evidence of compromise; check new passwords against a blocklist [26]. Cyber Essentials v3.3 accepts MFA, or a minimum of 12 characters, or 8 characters plus a deny list of common passwords, together with throttling (no more than 10 guesses in 5 minutes) or a lock after 10 failed attempts [22]. ENISA suggests passphrases of at least three random words and a password manager [25].

### Admin roles

- **Microsoft 365.** Keep Global Administrators as few as possible, give the least permissive role for each task (a Password or Helpdesk Administrator for resets, not a Global Administrator), require MFA for admins, and have a Privileged Authentication Administrator who can help if a Global Administrator is locked out. Global Reader sees admin settings but cannot change them [3].
- **Google Workspace.** More than one super admin, each a different person; a dedicated super admin account used only for admin work and a normal account for daily work; no shared admin logins, so the audit log shows who did what; security keys for admins, with a spare. Super admin self-recovery is off by default for most new customers, so keep account and DNS details ready for Google's recovery process [11]. Prebuilt roles such as User Management Admin (can be limited to some organisational units), Help Desk Admin and Services Admin cover routine work; only a Super Admin can assign roles or restore deleted users [12].
- **Cyber Essentials** asks for separate accounts used only for admin work, with no email or web browsing on them [22].

### Starters, movers and leavers

- Cyber Essentials expects a process to create and approve accounts, removal when no longer needed, and removal of special access when someone changes role [22]. CISA asks for written policies for staff changes such as transfers and terminations [16].
- **Microsoft 365 leavers.** Microsoft's order: block sign-in, save the mailbox if needed, wipe and block mobile devices, forward email or convert the mailbox to a shared mailbox, give a colleague access to OneDrive and Outlook content, remove the licence, then delete the account. Mail is kept for 30 days after the licence goes; a deleted account can be restored for 30 days. Accounts synced from on-premises Active Directory must be deleted there [4].
- **Google Workspace leavers.** Transfer Gmail, Drive, Calendar and other data before deleting. A deleted user can be restored within 20 days; after that the data is gone for good. Files in shared drives stay. To block access without losing data, suspend or archive the user rather than deleting [14].
- ENISA adds remote wipe of company data from a phone or laptop when employment ends, through mobile device management [25].

### Devices and updates

- Cyber Essentials v3.3: all software licensed and supported; unsupported software removed; automatic updates on where possible; updates that fix critical or high-risk flaws (CVSS v3 score of 7 or more, or rated so by the vendor) installed within 14 days of release. The NCSC also recommends, but does not require, all updates within 14 days [22].
- Windows 10 Home and Pro reached end of support on 14 October 2025 [9]. Treat any remaining Windows 10 PC as a replacement or isolation job.
- Use CISA's Known Exploited Vulnerabilities catalog to decide what to patch first, starting with internet-facing systems [18][19].
- Device settings from Cyber Essentials: auto-run off; a sign-in PIN or password on every device, at least 6 characters when it only opens the device; lock or throttle after repeated wrong guesses [22].

### Email and file sharing

- Google's small business checklist: enhanced pre-delivery scanning and extra attachment and link checks in Gmail, SPF for your domain, external calendar sharing limited to free/busy, link sharing off by default for new files, and a warning when staff share outside the company [10].
- On Microsoft 365, security defaults block old sign-in protocols, so printers or apps that send mail with a plain password need moving to a supported method before you switch them on [1].

### Backups

- Backups are not a Cyber Essentials technical requirement, but v3.3 now says they are highly recommended and asks you to unplug USB or external backup drives between backups. Cloud services cannot be left out of Cyber Essentials scope [22].
- Keep at least one copy offline or cut off from normal accounts; protect cloud backup accounts with MFA and use versioning [24]. CISA adds encryption, regular restore tests and "golden images" of key systems for fast rebuilds [18]. ENISA's rules: regular and automated, separate from production, encrypted when moved, and restores tested, ideally a full restore [25].
- A deleted user in Microsoft 365 or Google Workspace is only recoverable for 30 or 20 days [4][14]. The platform's recycle bin is not a backup plan.

### Scripts and automation

- For Microsoft 365 identity work, use Microsoft Graph PowerShell; it replaces the Azure AD PowerShell and MSOnline modules [6].
- Give PowerShell functions `-WhatIf` and `-Confirm` through `SupportsShouldProcess`, checking once per item right before each change. Do not trust `-WhatIf` to pass into functions in other script modules; pass it on explicitly [7].
- With robocopy, `/l` lists what would happen without copying; `/mir` deletes destination files that are missing from the source; the default is a million retries 30 seconds apart; an exit code of 8 or more means at least one failure. Always write a log [8].
- Automation that signs in as a normal user account now meets mandatory MFA on Azure management actions. Microsoft advises moving such jobs to workload identities (managed identities or service principals) [2].

### AI agents in admin consoles (as of November 2026)

- Microsoft's MCP Server for Enterprise lets an AI agent query Microsoft Entra directory data in plain language. It is in preview, read-only, honours the signed-in person's roles and scopes, and its calls appear in Microsoft Graph activity logs [5].
- Google's Workspace MCP servers (Gmail, Drive, Calendar, Docs and others) are in Developer Preview and sign in with OAuth. No Admin console server is listed [15].
- So, as of this check, admin changes still go through the admin consoles or official PowerShell and APIs under a role you grant, not through an MCP server.

### Incidents and breach clocks (not legal advice)

- First hour: work out which systems are affected and isolate them; talk out of band (phone) in case email is watched; power down only if a device cannot be disconnected, because that destroys evidence [18]. The FTC's order is secure operations, fix the weakness, then notify [28].
- **EU:** under the GDPR, a personal data breach goes to the data protection authority within 72 hours of becoming aware, unless it is unlikely to cause risk; affected people are told without undue delay if the risk is high; every breach is recorded [27].
- **US:** every state, plus DC, Puerto Rico and the Virgin Islands, has a breach notification law [28].
- **UK:** check the Information Commission's breach guide (report within 72 hours where feasible) [30] and the NCSC's Response and Recover guide [23]. The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).
- Whether a report is needed is the client's call with their adviser. My job is to collect the facts and the timeline fast.

### A public case

The British Library was hit by a cyber-attack in October 2023. Many services were disrupted, some personal data was released online in November 2023, and the systems were damaged badly enough that the library rebuilt its technology infrastructure [29]. The lesson for small offices: plan for rebuilding, not just restoring files, and know how long you could run without your systems.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 14 days | Cyber Essentials deadline for critical or high-risk updates (CVSS v3 7+) | [22]; v3.3, effective 27 Apr 2026 [21] |
| 12 / 8 + deny list | Cyber Essentials minimum password lengths when MFA is not used | [22] |
| 10 in 5 minutes, or lock after 10 | Cyber Essentials brute-force limits | [22] |
| 6 | Minimum device PIN length when it only opens the device | [22] |
| 15 / 8 | NIST minimum password length alone / with MFA | [26]; US federal standard, widely copied |
| 30 days | Microsoft 365: restore window for a deleted user and mail kept after licence removal | [4] |
| 20 days | Google Workspace: restore window for a deleted user | [14] |
| 2 | Microsoft's recommended number of emergency access accounts | [1] |
| 1 day to 6 months | Google 2SV enrolment period range for new users | [13] |
| 72 hours | GDPR deadline to notify the authority after becoming aware of a reportable breach | [27]; EU; check with an adviser |
| 14 Oct 2025 | Windows 10 Home and Pro end of support | [9] |
| 1,768 | Entries in CISA's KEV catalog on 6 Nov 2026 | [19]; grows weekly |

**Numbers I do not quote.** "MFA stops 99.9% of attacks" style vendor figures as a promise for your office, average breach costs, and "most attacks start with X" claims without a named study. I report your own numbers: MFA coverage, patch age, admin count and last restore date.

## 5. Decision rules

- If a tenant has no paid identity licence, turn on Microsoft security defaults (or Google 2SV enforcement) as the first sign-in change, once a second admin is in place, because one switch covers MFA and old protocols [1][13].
- If something still uses an old mail protocol (a scanner, a line-of-business app), move it to a supported method before blocking legacy sign-in, so the switch breaks nothing [1].
- If there is only one top-level admin, add a second named person (or Microsoft's emergency accounts) before changing sign-in rules, so a lock-out is recoverable [1][10].
- If someone needs admin work done, give the narrowest built-in role, not Global Administrator or Super Admin [3][12].
- If a person leaves, block sign-in and sessions first and delete last, after their data is handed over, because deletion starts a short restore clock [4][14].
- If you only need to stop access for a while, suspend (Google) or block sign-in (Microsoft) instead of deleting [4][14].
- If a fix is rated critical or high, or appears in the KEV catalog, schedule it inside 14 days, internet-facing systems first [19][22].
- If a device runs an unsupported operating system, replace or isolate it rather than accept the risk quietly [9][22].
- If the only backup is always connected, add an offline or locked-down copy, because ransomware looks for connected backups [24].
- If no restore has been tested this quarter, test one before changing anything else about backups [18][25].
- If a script deletes, mirrors or moves files, ship it with a dry-run mode and make the first run a dry run [7][8].
- If automation signs in as a person, move it to a workload identity before MFA enforcement breaks it [2].
- If a breach may involve personal data, tell the client at once that a reporting clock may be running and who to ask [27][28].

## 6. Common mistakes and how to spot them

- **Shared admin login.** Spot it: one "admin@" account several people use. Fix: personal admin accounts, MFA, audit trail [11].
- **Everyone is a Global Administrator.** Spot it: the role list shows most of the office. Fix: least-privilege roles [3].
- **Daily work on the admin account.** Spot it: the super admin reads email and browses. Fix: separate accounts [11][22].
- **MFA "on" but not enforced.** Spot it: the registration report shows people never enrolled. Fix: enforce with a short enrolment window [13].
- **Old protocols left open.** Spot it: IMAP or basic sign-in still allowed. Fix: security defaults or Conditional Access [1].
- **Leaver deleted on day one.** Spot it: the manager asks for files on day 25 of a 20-day window. Fix: block, hand over, then delete [14].
- **Leaver forgotten.** Spot it: licences billed for people who left. Fix: a leaver checklist triggered by HR.
- **Backups never restored.** Spot it: nobody knows the last restore date. Fix: a quarterly restore test with evidence [18].
- **Backup drive always plugged in.** Spot it: the USB disk shows as a drive letter all week. Fix: rotate or disconnect it [22].
- **Windows 10 still in use.** Spot it: device inventory shows it. Fix: replacement plan [9].
- **`/mir` pointed the wrong way.** Spot it: a mirror job with source and destination swapped in a test log. Fix: `/l` dry run first [8].
- **Passwords in tickets or chat.** Spot it: a ticket reads "new password is ...". Fix: reset links or temporary passwords given out of band; rotate any that were exposed.
- **Forced 90-day password changes.** Spot it: a policy forcing regular changes with no sign of compromise. Fix: follow NIST and switch on MFA [26].

## 7. Quality bar

Before I hand over any change list, runbook or script, I check:
1. Every item names the tenant, the target (user, group, device or setting), the action, the reason and how to undo it.
2. The access level for each tool is written down, and level 3 actions are on the agreed change list.
3. Deleting accounts or data and changing admin roles are marked "needs a fresh yes".
4. No password, recovery code, API key or token appears anywhere.
5. At least two people can still sign in as top-level admin after the change.
6. Each security setting is traced to its source: vendor guidance, Cyber Essentials, CISA or ENISA.
7. Scripts have settings at the top, a dry run, a log, clear exit codes and are safe to rerun.
8. Staff-facing steps are tested by someone who did not write them.
9. The log shows what was done, where, when and the result.

## 8. How this role writes

- **Change list.** A table: number, system, target, action, reason, risk, undo step, access level, status. Items needing a fresh yes are flagged.
- **Runbook.** Numbered steps, each with where to click or the command to run, what you should see, and what to do if you see something else.
- **Staff how-to.** A title that names the problem, no more than eight steps, plain words, screenshots described in brackets, and a "still stuck?" line with what to put in the ticket.
- **Script header.** What it does, who runs it, where, how often, settings, dry-run switch, log location, exit codes.
- **Report to the owner.** Three lines first: what changed, what is still at risk, what I need from you. Then detail.
- **Tone.** Calm and concrete. No scare words. "Not done yet" is said plainly.

## 9. Glossary

- **MFA / 2SV:** a second proof of identity at sign-in, such as an app prompt, code or security key. Google calls it 2-Step Verification.
- **Phishing-resistant MFA:** a second factor that a fake sign-in page cannot capture and reuse, such as a security key [11][18].
- **Passkey (FIDO2):** a sign-in method based on public-key cryptography that replaces the password [22].
- **Security defaults:** Microsoft's free on-or-off set of basic sign-in protections [1].
- **Conditional Access:** Microsoft's paid, customisable sign-in policies [1].
- **Legacy authentication:** old sign-in methods (IMAP, POP3, basic SMTP) that cannot do MFA [1].
- **Global Administrator / Super Admin:** the all-powerful admin role in Microsoft 365 / Google Workspace [3][12].
- **Least privilege:** giving each person or role only the access the task needs.
- **Emergency access account:** a spare top-level account kept for lock-outs [1].
- **Tenant:** your organisation's instance of Microsoft 365 or Google Workspace.
- **Organisational unit (OU):** a Google Workspace group of users that settings apply to [12].
- **Suspend / archive (Google) or block sign-in (Microsoft):** stopping access without deleting data [4][14].
- **Shared mailbox:** a Microsoft 365 mailbox several people can read, often used for a leaver's mail [4].
- **CVSS:** a 0 to 10 score of a vulnerability's severity; 7 or above counts as high for Cyber Essentials [22].
- **KEV:** CISA's catalog of vulnerabilities known to be exploited [19].
- **Offline backup:** a copy that cannot be reached from live systems at the time of an attack [24].
- **Golden image:** a ready-made system template for a fast rebuild [18].
- **Dry run / -WhatIf:** a mode that shows what a script would change without changing it [7].
- **Idempotent:** safe to run more than once with the same result.
- **Workload identity:** a non-human identity for automation, such as a managed identity or service principal [2].
- **MDM:** mobile device management, used to enforce settings and wipe company data [25].
- **Cyber Essentials Plus:** the same five controls with independent technical testing [20].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| Microsoft security defaults and mandatory MFA | [1][2] | Device code flow blocked for new tenants from 1 Jul 2026; Phase 2 MFA rolling out since 1 Oct 2025 |
| Microsoft admin roles | [3] | Includes an AI Administrator role for Copilot and agents; page dated 7 Oct 2026 |
| Google small business checklist | [10] | 14 items, updated 26 Oct 2026 |
| Google 2SV methods | [13] | "Only security key" includes passkeys |
| Cyber Essentials requirements | [21][22] | v3.3, effective 27 Apr 2026 |
| CISA SCuBA baselines and tools | [17] | ScubaGear and ScubaGoggles |
| KEV catalog | [19] | 1,768 entries on 6 Nov 2026 |
| Official MCP servers for admin work | [5][15] | Microsoft read-only preview; Google has no Admin server |
| Windows and Office support dates | Microsoft Lifecycle [9] | Windows 10 out of support since 14 Oct 2025 |
| Breach reporting rules | EDPB [27], FTC [28], Information Commission [30] | GDPR 72 hours; US state laws |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` In a tenant with no paid identity licence, security defaults (or 2SV enforcement) is my first sign-in change, once a second admin exists. (§5)
- `decision_rule` I move anything on an old mail protocol to a supported method before blocking legacy sign-in, so the switch breaks nothing. (§5)
- `decision_rule` When a person leaves, I block sign-in and sessions first and delete last, after their data is handed over. (§5)
- `check` If no restore has been tested this quarter, I test one before changing anything else about backups. (§5)
- `decision_rule` A script that deletes, mirrors or moves files ships with a dry-run mode, and its first run is a dry run. (§5)
