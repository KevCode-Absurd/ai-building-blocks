---
name: meta-account-backup-and-access-plan
description: "An access and backup plan for a store's Meta business portfolio so one lost login, hacked profile or restricted ad account does not stop sales. Maps who owns every asset (ad accounts, Pages, Instagram, dataset, catalog, domain), moves ownership to the store's own business, sets at least two trusted admins with two-factor login required for everyone, gives agencies partner access instead of admin, sets up a ready backup ad account and Page with the dataset shared and payment methods in place, and writes a recovery runbook for each failure. Never used to get around a restriction. Use when taking over an account, after a scare, before a peak season, or when one person holds all the keys."
---

# Meta account backup and access plan

**You get:** an asset ownership map, a people and roles table with the target state, a list of changes in order for the client to make or approve, a ready backup set (ad account, Page, shared dataset, payment), and a one-page recovery runbook for the five common failures.

## When to use

- One person (often the founder or a freelancer) is the only admin.
- An agency or old freelancer owns the ad account, Page or pixel.
- A login was lost, a profile hacked, or an ad account restricted, and the store wants it never to stop sales again.
- Before a peak season, when a day without ads costs the most.

## Not for

- Store, email and app access beyond Meta: use `lock-down-store-staff-and-app-access`.
- An ad or account already rejected or restricted: use `fix-rejected-ads-and-account-restrictions` first, then this plan.
- Connecting data for AI tools and reports: use `ad-and-store-data-connections`.
- Pixel and Conversions API set-up: use `store-meta-capi`.

## What you need

Required (all from Business settings in Meta Business Suite; screenshots are fine):

1. **People**: every person, their role (full control or partial), and whether two-factor login is on.
2. **Partners**: every business with access, and to which assets.
3. **Assets**: ad accounts, Pages, Instagram accounts, datasets (pixels), catalogs, domains, and the owning business for each.
4. **Business info**: verification status and the two-factor setting.
5. **Payment methods** on each ad account (type and last four digits only, never full numbers).
6. **Store side**: which business and dataset the Shopify Facebook and Instagram app (or other integration) is connected to.

If any list is missing, ask for a screenshot of that Business settings page. Never ask for a password, code or full card number; if one is pasted, do not use or repeat it and tell the client to change it. This plan works at read level (level 1). Adding people, changing roles, moving assets and adding payment methods are done by the client, or by you at level 2 or 3 only with a yes for each change. Payment methods and payouts stay with the client.

## Before you start: the gates

1. **Owner present.** Pass when the business owner (or a person they name in writing) is available to approve and make admin changes. Fail: stop; access changes made without the owner can lock them out.
2. **No dodging.** Pass when the plan is for continuity, not for running ads a restriction has blocked. A restricted asset cannot be used to advertise [ADC-6082]; using backups to get around a restriction risks every asset.
3. **Business is the store's.** Pass when the business portfolio belongs to the store's own legal entity. Fail: step 2 starts with creating or claiming the store's own business.
4. **No active hack.** Pass when no unknown people, partners, payment methods or ads appear. Fail: secure first (step 3), then plan.

## Steps

### 1. Map ownership

Table every asset: name, ID, owning business, who has access through which route (person or partner). The target: the store's own business owns every ad account, Page, Instagram account, dataset, catalog and the store domain, and agencies get partner access. Any asset owned by an agency or a person's separate business is the first risk to fix: ask the owner to request ownership or release, and if an ad account cannot be moved, create a new one in the store's business and plan the move with `consolidate-fragmented-meta-account`.

### 2. Set people and roles

| Who | Role | Why |
|---|---|---|
| Owner | Full control (admin) | Final say on everything |
| Second trusted person (co-owner, senior employee, family member the owner trusts) | Full control | A business must always keep at least one admin [SEC-6084]; two means one lost login does not lock the store out (practitioner default) |
| Staff who run ads | Partial access, assigned to the ad accounts they need | Least access |
| Agency or freelancer | Partner access from their own business | They leave without taking anything |
| Apps and API tools | A system user with only the permissions needed | No personal login inside tools |

Remove anyone who left, and any partner no longer working with the store. Freelancers never get full control.

### 3. Lock logins

- Set the business two-factor setting to required for everyone [SEC-6084]. Each person uses an authenticator app or a passkey rather than text messages (practitioner default).
- Each admin stores their recovery codes offline.
- Each admin's personal profile uses a real name and a working email and phone; a disabled personal profile takes its access with it.
- Complete business verification if the status is not verified [SEC-6084].

### 4. Build the backup set

- **Backup ad account** in the same verified business, with the store's dataset shared to it and a payment method in place. Below about 250,000 a month of spend, keep it ready with the current winning campaign duplicated and paused. Above that, practitioners keep about 10% of spend live on it [ADC-0038].
- **Second Page** connected to the business. It also helps when heavy launches hit the per-Page ad limit [ADC-0045].
- **Dataset**: owned by the business, shared to both ad accounts, with the Conversions API integration connected under the business, not a person.
- **Catalog**: owned by the business and shared to the backup account if catalog ads run.
- **Payment**: two payment methods on the main account and one on the backup, added by the client. A payment failure can pause every campaign at once.
- **Domain**: the store domain verified in the business.

Know the limit: a backup ad account inside the same business does not help if the whole business is restricted. That case is handled by appeal (`fix-rejected-ads-and-account-restrictions`), not by new businesses.

### 5. Write the recovery runbook

| Failure | First 30 minutes | Then |
|---|---|---|
| Admin lost login | Second admin confirms access still works; nothing else changes | Owner recovers through Meta's account recovery; re-add if needed |
| Profile hacked | Second admin removes the hacked profile from the business, checks people, partners, payment methods and recent ads | Owner secures the profile, turns on two-factor, rejoins |
| Ad account restricted | Check Account Quality; read the policy | Appeal through `fix-rejected-ads-and-account-restrictions`; switch to the backup account only if the restriction is not about the ads or business themselves |
| Page restricted | Check Account Quality | Run ads from the second Page only after the cause is understood and fixed |
| Payment failed | Client adds or updates a payment method | Check campaigns resumed |

Each row names the person responsible and their backup.

### 6. Review on a schedule

Quarterly (and the week a person or agency leaves): re-run steps 1 to 3 and update the map. Before each peak season, check the backup account's payment method and dataset sharing.

### 7. Market notes

- **Every market:** bank rules on recurring card charges (for example strong customer authentication in the UK and EU) can block ad account charges and cause sudden payment failures; keep a second method or prepaid funds ready, set up by the client. If an outside agency runs ads, it gets partner access from its own business, never the owner's personal login.
- **US:** keep a company card rather than a staff member's personal card on the ad account, so ads do not stop when that person leaves.

## Checks before you hand it over

- Every asset is owned by the store's own business, or has a dated plan to get there.
- At least two trusted people have full control; no freelancer does.
- Agencies have partner access only; leavers are removed.
- Two-factor login is required for everyone in the business.
- A backup ad account and second Page exist with the dataset shared and a payment method.
- The runbook names a person and a backup for each failure.
- Nothing in the plan uses backups to run ads a restriction blocked.
- Every change was made or approved by the client; no password or code was requested.

## Output

**Summary (one screen):** the biggest single point of failure today, the target state, the changes in order with who makes each, and the yes needed.

**Asset map:** Asset type, Name, ID, Owning business, Access route (person or partner), Target owner, Action.

**People table:** Person or business, Current role, Two-factor on, Target role, Action.

**Change list:** Order, Change, Who makes it, Approved (date), Done (date).

**Recovery runbook:** the step 5 table with names filled in.

## Common mistakes

- **One admin.** Step 2 adds a second trusted one [SEC-6084].
- **The agency owns the ad account.** Step 1 moves ownership to the store.
- **Freelancers with full control.** Step 2 gives partner or partial access.
- **A backup account with no payment method or dataset.** Step 4 makes it ready to run.
- **Backups used to dodge a restriction.** Gate 2 forbids it [ADC-6082].
- **A plan written once.** Step 6 reviews it quarterly.

## Sources

- ADC-0038: a backup ad account at high spend.
- ADC-0045: per-Page ad limits and extra Pages.
- ADC-6082: restricted assets cannot advertise; appeals in Account Quality (proposed card).
- SEC-6084: two-factor setting, verification status and the one-admin minimum (proposed card).

What makes this skill ours: the plan starts from who owns each asset, not who can log in; agencies get partner access so they can leave without taking the ad account; the backup set is ready to run with dataset and payment in place; and it draws a hard line between continuity and dodging a restriction.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. RBI's e-mandate rules can block recurring card charges, a common cause of sudden ad account payment failures; keep a second method or prepaid funds ready, set up by the client.
