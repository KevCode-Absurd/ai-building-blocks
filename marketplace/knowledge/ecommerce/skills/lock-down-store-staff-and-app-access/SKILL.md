---
name: lock-down-store-staff-and-app-access
description: "An access map of who and what can get into the store, ad accounts, email and SMS, payments, domain and analytics, with each person, agency and app cut to the least access their job needs, two-step login on every account, two owners on every critical tool, and an offboarding checklist that removes a leaver everywhere in one sitting. Reads each tool's own user and app lists, flags unknown users, shared logins, unused apps and over-broad permissions, and sets a monthly review. Use for a new store, after a staff member or agency leaves, after a suspicious login, or when nobody can say who has admin rights."
---

# Lock down staff and app access

**You get:** an access map (one row per person or app per tool) with current and target access, a change list to approve, a two-step login and recovery record, an offboarding checklist covering every tool, and a monthly review sheet.

## When to use

- A store is new and access is being handed out for the first time.
- A staff member, freelancer or agency has just left or is about to.
- There was a suspicious login, a phishing email, or a change nobody owns.
- Many apps are installed and nobody knows what each can read or change.
- One person holds the only admin login to a critical tool.

## Not for

- Meta business portfolio backup admins and a backup ad account: use `meta-account-backup-and-access-plan`.
- Fraud rules for orders: use `stop-fake-orders-and-card-testing`.
- Removing apps that slow the store: use `remove-app-bloat`.
- Connecting tools for AI reading with read-only keys: use `ad-and-store-data-connections`.

## What you need

Required, from the owner (screenshots or exports, level 1 read):

1. **Shopify:** Settings, Users (staff, collaborators, roles) and Settings, Apps (installed apps with their access).
2. **Ad accounts:** Meta business portfolio people and partners; Google Ads access and security; TikTok if used.
3. **Email and SMS tool** users and roles; WhatsApp business provider users.
4. **Payment gateway, domain registrar, Google Analytics, Search Console, Merchant Center, courier or 3PL portal, accounting** user lists.
5. **Team list:** each person's job, employer (staff, freelancer, agency) and end date if known.

Optional: login history where tools show it, the store's password manager list of shared accounts (names only, never passwords).

Reading is level 1. Removing users, changing roles and uninstalling apps are live changes: the client approves the change list, then either makes the changes or has the agent make them at level 3 within the approved list. Never ask for or handle passwords, recovery codes or keys; if one is pasted, do not use or repeat it, and tell the owner to change it.

## Before you start: the gates

1. **The owner holds the owner login** of every critical tool (store, payments, domain, ad accounts, email). Fail: fix this first; an agency or ex-staff member owning the domain or store is the highest risk.
2. **Two-step login is possible** on every tool. Shopify Payments requires it for the owner [SET-0005]. Fail: list the tool and plan to replace or isolate it.
3. **Someone owns the review.** The client names who runs the monthly review. Fail: the map goes stale within a quarter.

## Steps

### 1. Build the map

One row per person or app per tool: name, employer, job, tool, current role or permissions, last active date, two-step on (yes, no, unknown), and whether the login is shared. Mark unknown people in red.

### 2. Set the target access per job

Least access: each person gets the lowest role that lets them do their job, in each tool.

- **Shopify:** staff get roles with only needed permissions (orders and customers for support; products for catalogue; no payment or staff settings for anyone but owners). Agencies and freelancers use collaborator accounts, which need the store's 4-digit request code and their own two-step login; grant only what the work needs [SEC-6202].
- **Ad accounts:** advertiser or analyst roles for buyers and analysts; admin only for the owner and one backup. Stores spending heavily on Meta also keep a backup ad account [ADC-0038]. Agencies get partner access through their own business account, not personal logins.
- **Email and SMS:** campaign builders do not need account or billing settings; exporting the list should be limited to owners.
- **Payments, domain, accounting:** owners only, plus the accountant on accounting.

### 3. Remove and fix

- Remove anyone with no job need, anyone who has left, and unknown users. Collaborator removal cannot be undone; the partner must re-request [SEC-6202], so confirm with the client first.
- Replace shared logins with named accounts. Shared logins make it impossible to know who did what.
- Rotate the Shopify collaborator request code after each project [SEC-6202].
- Two owners on every critical tool, both with two-step login, so one lost phone or one departure does not lock the store out.

### 4. Two-step login everywhere

Turn on two-step login for every person in every tool that supports it, preferring an authenticator app or passkey over SMS. On Shopify Plus the store can require a secure sign-in method for all users; on other plans, check each user. Record who has it on; recovery codes stay in each person's own password manager, never in shared files or chat.

### 5. App permissions

For each installed app: what it can read and change (shown in its access details), what job it does, who installed it, last used. Remove apps with no job. Question any app with write access to orders, customers or themes that its job does not need. Private or custom apps: the owner keeps their keys; rotate keys when a developer leaves. Data from customers and orders must never be copied to spreadsheets or emails with card details; on Shopify the merchant's job is never storing card numbers outside checkout [SEC-0006].

### 6. Login protection for custom systems

If the store runs a custom app, headless front end or its own customer login, rate limit per username and per IP at about 10 times what the heaviest real user does, so one office or mobile carrier IP is not locked out [SEC-0011].

### 7. Offboarding checklist

Run the same day someone leaves, in this order: payment gateway and domain (if they had any access), Shopify staff or collaborator, ad accounts and business portfolio, email and SMS, WhatsApp provider, analytics and Search Console, courier, accounting, shared drives, password manager vault, then rotate any key or shared code they knew. Tick each line with time and who did it.

### 8. India and US notes

- India: WhatsApp business provider and courier portals often sit with a freelancer; move ownership to the store. GST portal access stays with the owner and accountant only.
- US: payment and sales tax portals, and any SMS sender registration, stay with the owner.

### 9. Monthly review

First Monday: new users and apps since last month, users inactive 60 days (practitioner default), two-step coverage, owner and backup still correct, apps unused. Changes go on the change list for approval.

## Checks before you hand it over

- Every critical tool has two owners with two-step login on.
- No unknown user and no shared login remains, or each is on the approved change list.
- Every agency or freelancer uses a collaborator or partner route, not a personal login.
- Every app has a job, an installer and an access note.
- The offboarding checklist covers every tool on the map.
- No password, recovery code or key appears in any file.

## Output

**One-screen summary:** tools mapped, people and apps with access, red flags (unknown users, shared logins, single owners, no two-step), and the change list count.

**Access map:**

| Tool | Person or app | Employer | Job | Current access | Target access | Two-step on | Shared login | Last active | Action |
|---|---|---|---|---|---|---|---|---|---|

**Change list for approval:** #, Tool, Change, Reason, Approved by, Done by and date.

**Offboarding checklist:** Tool, Action, Done (time), By.

**Monthly review sheet:** Month, New users, New apps, Inactive users removed, Two-step coverage, Owner and backup check, Notes.

## Common mistakes

- **The agency owns the domain or store.** Gate 1 moves ownership first.
- **Everyone is admin.** Step 2 sets roles by job.
- **Shared logins.** Step 3 replaces them with named accounts.
- **Single owner.** Step 3 adds a backup on every critical tool.
- **Offboarding one tool at a time over weeks.** Step 7 does all tools the same day.
- **Collaborators kept after the project.** Step 9 removes them monthly.

## Sources

- SEC-6202: collaborator request code, two-step login, least permissions, permanent removal.
- SET-0005: Shopify Payments requires two-step login.
- SEC-0006: never store card numbers outside checkout.
- SEC-0011: login rate limits per username and per IP.
- ADC-0038: backup ad account at high Meta spend.

What makes this skill ours: every tool the store depends on sits in one map, not just Shopify; access is set by job, with two owners and two-step login on every critical tool; the offboarding checklist runs across all tools in one sitting; and the agent never touches a password, code or key.
