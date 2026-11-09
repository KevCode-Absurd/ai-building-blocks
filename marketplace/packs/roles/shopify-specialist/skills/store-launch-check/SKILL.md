---
name: store-launch-check
description: Checks a Shopify store before it goes live or before a big sale, walking the buyer path from home page to order confirmation on a phone, then policies, prices, test orders, tracking, speed, accessibility basics and regional price and cookie rules. Returns a pass or fix list ranked by sales at risk, plus a sale-day plan with a change freeze, scheduled theme changes and a named owner for every task. Use before launch, a migration, Black Friday or any planned traffic spike.
---

# Store launch check

Launch day and sale day fail in boring ways: a broken link, a policy that contradicts the FAQ, a discount that does not apply, a forgotten app that falls over at peak. This skill finds those before shoppers do.

Access levels for this skill: the check itself needs only level 1 (read: screenshots, a preview link, or a collaborator seat with view permissions). Fixes on an unpublished duplicate theme, draft pages and draft policies need level 2. Publishing fixes, scheduling sale changes with Rollouts and removing the password page need level 3, within the owner's limits. Payment settings and test mode stay with the owner, or need a separate yes each time.

## When to use

- A new store before the password page comes off.
- A store moving from another platform or a new theme.
- The weeks before Black Friday, a product drop, a TV mention or any planned traffic spike.

## What you need

- **Access I have**: the level and limits per tool, written down. Until then, level 1.
- **Store preview link** (the storefront password page is fine; that is a shared store password, not an account login) or screenshots of each page type on a phone.
- **Policies**: refund and returns, shipping, privacy, terms, contact details, as text.
- **Settings screenshots**: shipping zones and rates, taxes, markets, payment methods (no account numbers), notification emails.
- **App list** with what each app does, and any apps removed recently.
- **For a sale**: dates, offers and discount codes, stock levels for the hero products, who covers customer messages, who can publish changes.
- **Markets sold to**: US, UK, EU or elsewhere, because price, cookie and accessibility rules differ.

## Steps

1. **Walk the buyer path on a phone.** Home, menu, search, collection, product, cart, checkout start, order confirmation and the confirmation email. At each step note: does it load, is the next action obvious, is anything broken, missing or contradictory? Repeat the key steps on desktop.
2. **Product pages.** Do they answer the shopper's questions on the page: clear photos, size or fit help, materials, stock per option, delivery time and cost, returns summary? Does add to cart give clear feedback? Are variant names and prices right for a sold-out option?
3. **Prices and costs.** Is shipping cost or the threshold for free shipping shown before checkout? Unexpected extra costs are the top stated reason shoppers abandon checkout. For UK shoppers, headline prices must include unavoidable fees and taxes, and mandatory delivery charges must be clear up front. For EEA shoppers, any "was" price on a reduction must reflect the lowest price of the previous 30 days or more. Flag these for the owner to confirm with their adviser; do not rule on them.
4. **Policies and contact.** Are all policies present, linked in the footer and consistent with each other and the FAQ (returns window, who pays return shipping, delivery times)? Is there a real contact route? Some legal disclosures need a physical address, not a PO box.
5. **Checkout and payments (owner tests).** List the test orders the owner must place: one with Shopify Payments in test mode or the test gateway, one with a real card refunded straight away, one with each discount code, one to each shipping zone, one logged in and one as a guest. Payment settings and card details stay with the owner. Remind them that customers cannot place real orders while test mode is on, so turn it off before launch.
6. **Notifications.** Order confirmation, shipping confirmation and refund emails: right logo, sender name, reply address, and no template placeholder text.
7. **Tracking and consent.** After a test order, does the purchase show in Shopify Analytics and in any ad or analytics tool the owner relies on? For UK and EEA visitors, does the cookie banner appear, and do any third-party banner settings match Shopify's regions?
8. **Speed baseline.** Record the Web performance dashboard numbers (or PageSpeed Insights links for home, one collection, one product) before any sale changes, so later changes can be compared.
9. **Accessibility basics.** Text contrast, alt text on product images, labelled form fields, keyboard access to the menu and cart, no autoplaying video with sound. EU consumer e-commerce has had accessibility duties since 28 June 2025; point the owner to their national rules.
10. **Apps.** For each app: still needed, loading only where used, tested? Search the theme for leftovers of removed apps.
11. **For a sale, plan change control.** Set a freeze date for theme and app changes. Build the sale changes on a duplicate theme (level 2) and schedule them with Rollouts, with an end date so the store reverts on its own (level 3, or the owner). Test every discount code on the duplicate. Discounts above the owner's caps need a fresh yes. Confirm stock and back-order settings for hero products, support hours and saved replies, and who is on call.
12. **Rank the fixes.** For each issue: which step, severity (blocks orders, loses some orders, cosmetic), effort, owner, and the access level the fix needs. Order by sales at risk first, then effort.
13. **Go live (level 3, or the owner).** With level 3, show the action list (fixes to publish, password page removal, scheduled changes) and limits, get one yes, act, log each action and re-check the live pages. Stop on any error or warning.

## Checks

- Every step of the buyer path was walked on a phone, and anything not seen is listed as "not checked".
- Every fix has an owner and a "how to verify".
- The owner's own test orders are listed, including turning test mode off.
- No legal ruling given; regional points phrased as "check with your adviser".
- Sale plan has a freeze date, a scheduled publish and end date, and named people for the day.
- Every action stayed within "Access I have" and is logged.

## Output format

1. **Verdict**: go, go after fixes, or not ready, with the reason in one line.
2. **Fix list**: table of step, issue, severity, effort, owner, how to verify.
3. **Owner tests**: numbered test orders and checks I cannot do.
4. **Sale-day plan** (if relevant): timeline from freeze to after the sale, with owners.
5. **Not checked**: what I could not see.

## Example of good output (short)

*Illustrative structure, not a real business: a UK candle maker launching on Shopify and selling to the UK and Ireland. Copy the shape, never the content: every fact comes from the client's own context.*

**Verdict:** go after fixes. Two issues block or lose orders; the rest are small.

| Step | Issue | Severity | Effort | Owner | How to verify |
|---|---|---|---|---|---|
| Product | Delivery cost first appears at checkout | Loses orders | Low | Owner | "Free UK delivery over £35, otherwise £3.95" shows under the price on a phone |
| Policies | Returns page says 14 days, FAQ says 30 | Loses orders, trust | Low | Owner | Both say the same window |
| Product (Ireland) | "Was" price on gift sets: owner unsure it was the lowest price in the last 30 days | Check | Low | Owner and adviser | Compare-at price set from price history |
| Footer | Contact page has no address | Check | Low | Owner | Address shown if required |
| Apps | Snippet from a removed pop-up app still loads | Slows pages | Low | Me, on duplicate theme | App domain gone from page source |

**Owner tests:** 1. Order in Shopify Payments test mode with code WELCOME10. 2. Real card order, refunded at once. 3. Order shipped to Dublin. 4. Turn test mode off, then remove the password page.

**Not checked:** live checkout, payment settings, real email delivery.
