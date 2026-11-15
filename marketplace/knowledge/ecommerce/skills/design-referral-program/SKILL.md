---
name: design-referral-program
description: "A customer referral program sized from the store's own acquisition cost and margins: the reward for the friend and the referrer (money off, credit, product or a rising ladder), when the reward is paid, the rules and terms, fraud checks for self-referrals, coupon-site leaks and refunded orders, the moments to ask (after a good delivery, a high survey score or a photo review), and the messages for email, thank-you page, SMS and WhatsApp share. Includes disclosure rules for rewarded posts and a test that compares referred buyers with paid ones on gross profit. Tool-neutral with a free path. Use when the store wants a refer-a-friend program or an existing one costs more than paid ads."
---

# Referral program design

**You get:** a one-page referral design (reward for both sides, payout timing, rules), a fraud checklist, an ask calendar with the trigger for each ask, five message outlines with exact wording, the terms text, and a tracker that compares referred buyers with paid ones.

## When to use

- The owner wants a refer-a-friend program.
- Buyers already recommend the store (post-purchase survey answers name friends and family).
- An existing program has rising rewards paid and few real new customers.
- Paid acquisition costs are high and the store wants a cheaper source of new buyers.

## Not for

- Points for repeat orders: use `design-loyalty-program`.
- Paid creator or affiliate deals: use `track-creator-sales`.
- Building a buyer community: use `build-whatsapp-or-facebook-community`.
- Writing the full post-purchase emails: use `write-post-purchase-emails`; this skill sets the referral step.

## What you need

Required (read access, level 1):

1. **Gross profit per first order** and 90 or 180-day gross profit per new customer, from `store-meta-math` and `cohort-repeat-and-ltv-analysis`.
2. **Current cost per new customer** from paid channels, and the target the store uses.
3. **Shopify order export**: Name, Created at, Customer Id, Discount Code, Total, Refunded Amount, Payment Method, Shipping Address.
4. **Post-purchase survey answers**, if any, for the share naming friends or family.
5. **Consent counts** for email, SMS and WhatsApp.

Optional: an existing program's data (referral links, shares, referred orders, rewards paid), review ratings by product.

Setting up the program needs draft access (level 2); launching it, and paying any reward above the rules, needs the client's yes.

## Before you start: the gates

1. **Product earns word of mouth.** If return rate is high or reviews average under about 4 stars, fix the product first; a reward cannot make people recommend what disappointed them (practitioner default, test it).
2. **Reward fits acquisition cost.** Total reward cost per referred new customer must sit below the store's allowed cost per new customer, set from time-bound lifetime gross profit with refunds deducted [MEA-0020]. Computed in step 2.
3. **Disclosure.** In the US, a referrer who posts a link publicly for a reward should say they get something, and the store should tell referrers this and check [CXP-6303]. In the UK, the ASA and CAP Code expect the same. Put it in the terms and the share text.
4. **Messaging consent.** Referral asks by SMS and WhatsApp go only to buyers who opted in. The store never messages the friend directly from a phone number the referrer typed in; the referrer shares the link themselves.

## Steps

### 1. Check the natural rate

Count the share of new buyers who say a friend, family or "someone I know" sent them, from the post-purchase survey. If the survey names channels in about the same share as spend, the survey is a fair guide [MEA-0045]. A store with 10% or more word of mouth has something to amplify; under 3% means the program will mostly pay people who would have come anyway or will need a strong reward (practitioner default, test it).

### 2. Size the reward

Allowed reward cost per referred new customer = allowed cost per new customer x a safety share, practitioner default 50 to 70%, test it.

Split it:

- **Friend:** an offer on the first order that makes them act (money off or a free add-on). At higher order values a fixed amount usually beats the same percentage [EML-0047].
- **Referrer:** store credit or product after the friend's order passes the return window. Product and access rewards draw real fans; cash rewards draw fraud [ORG-0030].

Count the full cost: the friend's discount, the referrer's reward at landed cost, and app fees. Watch the friend offer's effect on repeat: buyers won on deep discounts often repeat less [CXP-0016]. Prefer a free gift or add-on over a deep percentage.

A rising ladder (refer 3, get a product; refer 5, get a bigger one) fits launches and drops with real buzz [ORG-0030]; for steady stores, one simple reward per referral is easier to run.

### 3. Write the rules

- Friend must be a new customer (no past orders on email, phone or address).
- Reward to referrer only after the friend's order is delivered, paid (including pay-on-delivery orders) and past the return window.
- One friend reward per person and household; no stacking with sale codes.
- Cap rewards per referrer per month (practitioner default: 10, test it).
- Rewards are store credit or product, no cash value.
- Store may cancel rewards gained by fraud.

### 4. Set the fraud checks

Before each reward is paid, check: same email pattern, phone, shipping address or payment card as the referrer; friend order refunded or undelivered; many referrals in a short burst; the referral code appearing on coupon sites (search the code each month); orders cancelled after the reward. Hold flagged rewards for review. Any referrer with three flags in 90 days is removed (practitioner default, test it).

### 5. Choose the ask moments

Ask at a high point, not at random:

| Moment | Trigger | Channel |
|---|---|---|
| Thank-you page | Order placed | On page, a share link with the friend offer |
| After delivery and first use | Days set from product use, after the review ask | Email |
| High survey score | 9 or 10 on the recommend question | Email or WhatsApp |
| Photo or 4 to 5 star review posted | Review submitted | Thank-you message |
| Second order | Placed Order count = 2 | Order confirmation line |

Asking promoters and reviewers to refer is fine; this is not a review ask, so it does not gate reviews. Never ask a buyer with an open ticket or a return in progress.

### 6. Write the messages

1. **Thank-you page:** "Give [friend offer] to a friend, get [reward] when they order. Share your link: [link]."
2. **After first use email:** subject "Know someone who would like [product]?"; one line on what the friend gets, one on what they get, one button.
3. **Promoter message:** "Thanks for the 10. If a friend would like [product], your link gives them [offer]: [link]."
4. **Reward earned:** "Your friend's order arrived. [Reward] is in your account and works until [date]."
5. **Share text** the referrer sends, with a disclosure line: "I get [reward] if you use my link, and you get [offer]."

Keep SMS under 160 characters with no emoji. Where buyers use WhatsApp: a WhatsApp share button with prefilled text in each language your buyers use.

### 7. Measure on gross profit, not sign-ups

Track monthly: links shared, referred first orders, referred share of new customers, reward cost, flagged and held rewards, and 90-day gross profit per referred customer versus per paid-ad customer, refunds deducted. The program stays only if cost per referred new customer is below the paid cost and referred customers' 90-day gross profit is at least equal. Watch the friends-and-family share in the post-purchase survey too; it should rise if word of mouth grows [CXP-0022].

### 8. Notes by market

- **Where WhatsApp leads:** in much of Europe, Latin America and Asia, WhatsApp sharing drives most referrals; build the link to open in WhatsApp. Pay-on-delivery friend orders count only after delivery and payment; undelivered orders never earn a reward. Store credit is clearer than "cashback", which buyers may expect as money.
- **US and UK:** state the disclosure line in terms and share text [CXP-6303]; keep rewards as credit with clear terms and expiry.

## Checks before you hand it over

- Reward cost per referred customer is below the allowed cost per new customer.
- Referrer reward pays only after delivery, payment and the return window.
- Fraud checks cover self-referral, address, card, coupon sites, refunds and undelivered orders.
- Every ask moment has a trigger and excludes buyers with open problems.
- Share text and terms include the reward disclosure.
- The store never messages a friend's number directly.
- Success is judged on 90-day gross profit against paid customers.
- Launch waits for the client's yes.

## Output

**One-screen summary:** natural word-of-mouth share, recommended rewards, cost per referred customer versus paid, and the launch ask moments.

**Program design:** Rule, Setting, Why.

**Reward cost sheet:** Friend offer, Friend offer cost, Referrer reward, Reward landed cost, App fee per referral, Total cost per referred customer, Allowed cost per new customer, Margin of safety.

**Fraud checklist:** Check, How, Action when flagged.

**Message set:** Message, Trigger, Channel, Text, Character count.

**Tracker:** Month, Links shared, Referred orders, Share of new customers, Reward cost, Held rewards, 90-day gross profit per referred vs paid customer.

## Common mistakes

- **Paying the referrer at order time.** Step 3 waits for delivery and the return window.
- **Cash rewards.** They draw fraud [ORG-0030]; step 2 uses credit or product.
- **Deep friend discounts.** They can bring weaker repeat buyers [CXP-0016].
- **Counting sign-ups as success.** Step 7 judges gross profit against paid customers.
- **Codes leaking to coupon sites.** Step 4 checks monthly.
- **Undisclosed rewarded posts.** Gate 3 and the share text disclose.

## Sources

- CXP-0016: discount-won buyers often repeat less.
- CXP-0022: track friends-and-family share in the survey.
- EML-0047: fixed amounts beat percentages at higher order values.
- CXP-6303: rewarded recommendations need disclosure and monitoring.
- MEA-0020: allowed acquisition cost from lifetime gross profit.
- MEA-0045: post-purchase survey shares as a channel check.
- ORG-0030: product rewards and rising ladders beat cash.

What makes this skill ours: the reward is capped by the store's own allowed cost per new customer; referrers are paid only after delivery, payment and the return window, so pay-on-delivery orders and refunds cannot be gamed; asks fire at real high points; and the program is kept only if referred buyers beat paid ones on 90-day gross profit.

## Selling in India

- WhatsApp sharing drives most referrals; add a share button with prefilled text in English and the store's top regional language.
- COD friend orders count only after delivery and payment; RTO orders never earn a reward.
- Store credit is clearer than "cashback", which Indian buyers may expect as money.
