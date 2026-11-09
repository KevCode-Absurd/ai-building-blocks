---
name: store-lockdown-and-card-testing
description: Locks down a small online store and cuts fake orders. Checks staff logins and two-step sign-in, owner recovery, staff permissions, installed apps and scripts, payment page set-up against the PCI DSS SAQ A script-attack criterion, and fraud settings; reads order and payment patterns for card testing and account takeover; writes a yes-or-no checklist, an app keep-or-cut list, fraud rules and a first-hour card-testing response for Shopify, WooCommerce or Stripe. Use it for a store security review, a spike in small failed payments or odd orders, before peak season, or quarterly. Applies agreed settings and order holds only with level 3 access; refunds above the client's limit, app removal, staff account deletion and payout changes need a fresh yes or stay with the client.
---

# Store lockdown and card testing

## When to use

- A store owner wants a security check of their Shopify, WooCommerce or Stripe set-up.
- A burst of tiny orders, many declined payments or orders with odd names and emails appears.
- Chargebacks are rising.
- Before peak season, or as the quarterly store review.

Do not use it to give legal or insurance advice, to promise that fraud will stop, or to test the store's checkout with real or stolen card numbers. Testing uses the payment provider's own test mode, if at all.

## Access needed

- **Level 1 (read):** staff list and permissions, app list with install dates, order and payment exports, fraud analysis results, Radar reviews and dispute list.
- **Level 2 (read and draft):** checklist, app list, Radar rules and Shopify Flow automations created but switched off.
- **Level 3 (read, write and publish):** within the agreed list, turn on agreed fraud settings, Flow rules and Radar rules; adjust staff permissions; hold or cancel orders matching the agreed rules. Refunds above the client's limit, removing apps, deleting staff accounts and changing payout or bank details need a fresh yes or stay with the client.

## What you need

1. Platform and plan (Shopify plan, WooCommerce with which payment plugin, Stripe Checkout or a custom form).
2. Staff list with what each person does.
3. Installed apps and scripts with install dates.
4. Order and payment export for normal weeks and for the odd period.
5. How the checkout takes card details: hosted page, embedded form (iframe) or a custom integration.
6. Chargeback and dispute counts for recent months.

## Steps

### 1. Logins first

- Every person has their own staff account; no shared admin login.
- Two-step sign-in on every account. On Shopify, staff use an authenticator app or security key; SMS cannot be set up as a new method, and owners cannot force it for staff except on Shopify Plus, so check each account.
- The owner account has recovery details current and is used only for owner tasks.
- Former staff and agencies removed (deleting an account needs a fresh yes; removing permissions can be done at level 3 within the list).

### 2. Staff permissions

Give each person only what their job needs. Flag anyone who can change payment settings, install apps, edit the theme or export customers without needing to.

### 3. Apps and scripts

For each app: what it can access (orders, customers, theme, checkout), when last updated, whether it is still used, and who installed it. Mark keep, limit or cut, with the reason. Scripts on the storefront and payment pages get the same check.

### 4. Payment page set-up

Hosted or redirect checkout keeps card data off the store's pages. If the store embeds a provider's payment form and uses PCI DSS SAQ A, confirm with the provider how the site meets the script-attack criterion in place since 1 April 2025 (script controls such as requirements 6.4.3 and 11.6.1, or the provider's written confirmation). Keep secret keys out of theme code and pages.

### 5. Read the patterns

Card testing signs: a spike in failed or blocked payments, many small orders or card saves, nonsense names and emails, one IP or device pattern, many cards on one account. Account takeover signs: password reset bursts, new shipping addresses on old accounts, orders to freight forwarders. Compare with a normal week.

### 6. Write fraud rules

Rules by risk level, in plain words first, then in the platform's terms:
- Shopify: review the fraud analysis recommendation before fulfilment; manual capture for high-risk orders; Shopify Flow to tag and hold orders that match the pattern; AVS and CVV filters and the Fraud Control app where available.
- Stripe: Radar rules for velocity (cards per customer, customers per IP) if the plan supports them; CAPTCHA; login or session checks before payment; rate limits.
- WooCommerce: the payment plugin's fraud settings and the provider's tools; work with the developer for code-level limits.
Set a chargeback watch line using the client's own numbers.

### 7. First-hour response to card testing

1. Hold fulfilment of suspect orders.
2. Turn on or tighten checkout protections the provider offers (level 3 within the list).
3. Cancel high-risk orders before fulfilment; refund fraudulent payments as the provider advises to avoid disputes, within the client's refund limit or with their yes.
4. Do not retry failed payments from the attack.
5. Save the export of the attack window.
6. Tell the payment provider if it continues, and log every action.

### 8. Staff rules and review

One page: own login, two-step sign-in, no sharing codes, check before refunding to a different card, report odd orders. Set a quarterly review: staff list, apps, fraud settings, chargebacks.

## Checks

- Every staff account is personal and has two-step sign-in.
- No one has permissions their job does not need.
- Each app has a keep, limit or cut decision with a reason.
- Payment page set-up is confirmed with the provider for SAQ A, if relevant.
- Fraud rules are written in plain words and tested on past orders before going live.
- Refunds, app removal, account deletion and payout changes are flagged for a fresh yes or the client.
- No card numbers, passwords or keys appear in any output.

## Output format

1. **Store checklist** grouped by logins, staff access, apps, payments and orders, each a yes-or-no check.
2. **App keep, limit or cut list.**
3. **Fraud rules** in plain words and platform terms, with which are live and which are drafts.
4. **Card-testing first-hour card** for staff.
5. **Change log** of anything done at level 3.
6. **Quarterly review date.**

## Example

*Illustrative structure, not a real business: an online candle shop. Copy the shape, never the content: every fact comes from the client's own context.*

**Pattern read:** Between 02:10 and 03:05, 84 orders of a single tea light, 79 declined, 5 paid, 61 different names, emails like "qwx81@...", all from three IP ranges. Normal night: 0 to 2 orders. This is card testing.

**First hour (done with your yes at 07:30, logged):**
- Held fulfilment on the 5 paid orders.
- Turned on the agreed Flow rule: tag and hold orders under the lowest product price when more than the threshold you chose (3 an hour) arrive from one IP.
- Recommend refunding the 5 paid orders (total below your refund limit, so I can do it at level 3 if you confirm the list).

**Checklist extract:**
- Every staff member has their own login: **No** (packing staff share one; create two staff accounts with order-only access).
- Two-step sign-in on all accounts: **No** (2 of 4; send the set-up guide today).
- Apps not used in 90 days: 3 (review-request app, old upsell app, abandoned-cart app) — **cut list ready, needs your yes**.
