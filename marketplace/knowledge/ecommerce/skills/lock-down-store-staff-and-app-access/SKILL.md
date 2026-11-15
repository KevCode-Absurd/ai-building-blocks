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

Rank the second step, strongest first, and record which one each admin uses:

1. **Passkey or security key:** tied to the real site, so a fake login page cannot catch it.
2. **Authenticator app code:** good, but a convincing fake page can still collect the code.
3. **Push approval:** people approve prompts they did not start when they get many in a row.
4. **Text message code:** weakest; a SIM swap or forwarded number hands it over.

Admin, staff, domain registrar, email and ad accounts need step 1 or 2. Text-message-only on an admin login is a high-risk gap. Passkey support depends on the tool and plan, so check before promising it.

**Recovery is the weak door.** An email reset link gives full access to whoever reads that inbox, so the inbox that receives resets for the store, domain and ad accounts gets the strongest second step of all. Each admin keeps backup codes or a second key in their own password manager.

**Password rules to write down** (one page, plain words, for staff and any custom login): at least 8 characters, long ones (64 or more, spaces allowed) accepted and never cut short; no forced symbols, no change every 90 days, no password history rules, because people just add a number to the end; change a password only when exposure is suspected; allow pasting so password managers work. Suggest four random words or a password-manager password. Tell the owner to check staff and customer emails against a breach list (for example Have I Been Pwned, which the owner runs, not the agent) and force resets for matches; list this as not run until they do it.

**Ask again before risky changes.** Where the tool allows it, require the password or second step again before changing the account email, password, payout or bank details, adding a staff user or creating an API key. This limits the damage from a stolen session or an unlocked laptop.

**Customers:** on stores with their own customer login, ask for a second step only on a new device, a new country or a flagged address. Asking every customer every time slows checkout and costs orders.

### 5. App permissions

For each installed app: what it can read and change (shown in its access details), what job it does, who installed it, last used. Remove apps with no job. Question any app with write access to orders, customers or themes that its job does not need. Private or custom apps: the owner keeps their keys; rotate keys when a developer leaves. Data from customers and orders must never be copied to spreadsheets or emails with card details; on Shopify the merchant's job is never storing card numbers outside checkout [SEC-0006].

### 6. Login protection for custom systems

If the store runs a custom app, headless front end or its own customer login, rate limit per username and per IP at about 10 times what the heaviest real user does, so one office or mobile carrier IP is not locked out [SEC-0011].

On these custom builds, also check with the developer: passwords stored with a slow, salted password hash (bcrypt-type), never plain text, and the hash library does not silently cut long passwords; login request bodies never written to log files, since that stores passwords in plain text; a random session ID kept on the server and deleted at logout or password change, so a stolen cookie stops working. On Shopify's hosted accounts and checkout these are the platform's job; mark them "platform owns" and skip them.

Do not copy old "security" features that do not help: a secret picture shown at login, on-screen keyboards, hint questions with a few possible answers, or a short maximum password length.

### 7. Offboarding checklist

Run the same day someone leaves, in this order: payment gateway and domain (if they had any access), Shopify staff or collaborator, ad accounts and business portfolio, email and SMS, WhatsApp provider, analytics and Search Console, courier, accounting, shared drives, password manager vault, then rotate any key or shared code they knew. Tick each line with time and who did it.

### 8. Market notes

- Everywhere: the WhatsApp business provider, SMS sender and courier portals often sit with a freelancer; move ownership to the store. Tax portal access (sales tax, VAT or goods and services tax) stays with the owner and accountant only.
- US: payment and sales tax portals, and any SMS sender registration, stay with the owner.
- UK and EU: the VAT account (HMRC or the EU One Stop Shop) and any marketplace seller account stay with the owner; staff with access to customer data are covered by GDPR, so remove leavers the same day.

### 9. Monthly review

First Monday: new users and apps since last month, users inactive 60 days (practitioner default), two-step coverage, owner and backup still correct, apps unused. Changes go on the change list for approval.

## Checks before you hand it over

- Every critical tool has two owners with two-step login on.
- No unknown user and no shared login remains, or each is on the approved change list.
- Every agency or freelancer uses a collaborator or partner route, not a personal login.
- Every app has a job, an installer and an access note.
- The offboarding checklist covers every tool on the map.
- No password, recovery code or key appears in any file.
- Every admin's second step is recorded by type, and no admin is on text message only without a dated fix.
- The inbox that receives password resets has the strongest second step.
- The one-page password and second-step policy is written, and the breach-list check is marked done or not run.

## Output

**One-screen summary:** tools mapped, people and apps with access, red flags (unknown users, shared logins, single owners, no two-step), and the change list count.

**Access map:**

| Tool | Person or app | Employer | Job | Current access | Target access | Two-step on | Shared login | Last active | Action |
|---|---|---|---|---|---|---|---|---|---|

**Change list for approval:** #, Tool, Change, Reason, Approved by, Done by and date.

**Sign-in gaps, ranked:** Gap, Account type, Severity (critical: no second step on admin, email, registrar or ad accounts, shared admin login, passwords stored or logged in plain text; high: text-message-only on admin, email-only recovery on admin, no re-ask before risky changes; medium: forced rotation or symbol rules, paste blocked, no breach check where cards or subscriptions are saved; low: wording), Fix, Owner.

**Password and second-step policy:** one page: password rules, second step by account type, recovery, risky changes, when customers get a second step.

**Offboarding checklist:** Tool, Action, Done (time), By.

**Monthly review sheet:** Month, New users, New apps, Inactive users removed, Two-step coverage, Owner and backup check, Notes.

## Common mistakes

- **The agency owns the domain or store.** Gate 1 moves ownership first.
- **Everyone is admin.** Step 2 sets roles by job.
- **Shared logins.** Step 3 replaces them with named accounts.
- **Single owner.** Step 3 adds a backup on every critical tool.
- **Offboarding one tool at a time over weeks.** Step 7 does all tools the same day.
- **Collaborators kept after the project.** Step 9 removes them monthly.
- **Text message codes on the owner login.** Step 4 ranks second steps and moves admins to a passkey or app.
- **Forcing password changes every quarter.** Step 4 changes them only when exposure is suspected.
- **Forgetting the reset inbox.** Step 4 treats recovery email as the weakest door.

## Sources

- SEC-6202: collaborator request code, two-step login, least permissions, permanent removal.
- SET-0005: Shopify Payments requires two-step login.
- SEC-0006: never store card numbers outside checkout.
- SEC-0011: login rate limits per username and per IP.
- ADC-0038: backup ad account at high Meta spend.

What makes this skill ours: every tool the store depends on sits in one map, not just Shopify; access is set by job, with two owners and two-step login on every critical tool; the offboarding checklist runs across all tools in one sitting; and the agent never touches a password, code or key.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. The GST portal stays with the owner and accountant only. WhatsApp provider and courier aggregator accounts often sit with a freelancer; move ownership to the store.
