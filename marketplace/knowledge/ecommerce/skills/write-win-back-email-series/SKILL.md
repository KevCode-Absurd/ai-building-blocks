---
name: write-win-back-email-series
description: "Three to four win-back emails written in full for past buyers who have not reordered, with subject lines, preview, body, timing from the store's own reorder gap, the offer ladder (no offer, then help, then the smallest offer that passes the gross profit check, then the last call), and the sunset step that stops marketing email to people who never respond. Separates buyers who had a bad experience (returns, complaints, low ratings) into a fix-first note, splits repeat-use and one-time products, and adds a text and market notes. Use when first-time buyers rarely return, when the win-back flow is one generic coupon, or before cleaning the list."
---

# Win-back email series

**You get:** a win-back series of three to four emails written in full (two subject lines, preview, body, button each), a fix-first note for unhappy buyers, the offer ladder with its gross profit check, timing from the store's own reorder gap, and the sunset step with its suppression rule, ready to load as drafts for the client to approve.

## When to use

- Most first-time buyers never place a second order.
- The win-back flow is one "we miss you, here's 20% off" email.
- Repeat products (refills, food, skincare, pet) have buyers past their usual reorder time.
- The list is due a clean and the store wants one honest last attempt before suppressing.

## Not for

- Deciding who counts as lapsed, what each group should be offered and where to stop trying: use `win-back-lapsed-customers` first; this skill writes its emails.
- The path from first to second order inside the first 30 days: use `write-post-purchase-emails` and `post-purchase-repeat-sequence`.
- Cancelled subscribers: use `email-sms-flow-plan`, step 6, for subscription win-back logic.
- Fixing inbox placement before a re-engagement push: use `email-account-health-audit`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, 12 to 24 months: Name, Created at, Customer Id or Email, Lineitem name, Lineitem sku, Subtotal, Discount Code, Refunded Amount.
2. **Median days between first and second order**, overall and for the top products, from `post-purchase-repeat-sequence` or worked from the export.
3. **Unhappy-buyer signals**: returns and refunds, support tickets, 1 and 2-star reviews, matched to customers.
4. **Gross profit per order** from `store-meta-math`.
5. **What changed since they bought**: new products, sizes, formula or fit fixes, faster delivery, a new guarantee.
6. **Engagement data**: last click, last site visit and emails received in the last 120 days, per profile.

Optional: the lapsed groups and offers from `win-back-lapsed-customers`, SMS opt-ins, reasons from a past "why did you stop" survey.

If no second orders exist yet (a young store), time the series from product use cycles and mark it "to recheck at 90 days". Drafts need draft access (level 2); switching on and any suppression need the client's yes.

## Before you start: the gates

1. **Experience before message.** If more than about 20% of the lapsed group had a ticket, a return or a 1-star review, the problem is the experience, not the email; fix it and send those buyers a personal recovery note, not a promo [EML-0050].
2. **Gross profit per order.** Needed for any offer. Fail: the ladder stops at help and news, no money off.
3. **Consent.** Only people still subscribed to email (and texts for opted-in numbers). Unsubscribed buyers are not contacted.
4. **Inbox health.** A send to long-silent profiles can spike unsubscribes once before settling [EML-0032]; check the domain is healthy first.

## Steps

### 1. Set the start from the store's own gap

Default start: twice the median days between orders for the product the person bought [EML-0019]. For repeat-use products, test an earlier start: win-backs 30 to 45 days after the last purchase converted about 2.3 times better than at 90 days or more in one platform's benchmark [EML-0050]. For one-time or durable products (furniture, a jacket), there is no reorder gap: start around 90 days with complementary products or new uses instead of "time to restock" (practitioner default, test it).

Two refinements. First, judge each person by their own rhythm where the tool allows: someone who orders every 200 days should not get a code at day 120 [EML-6397]. If the email tool predicts an expected date of next order, start about 5 days after that date passes, once per person [EML-6326], and give customers with high predicted value a better offer that still clears the gross profit check. Second, issue a unique code per person with a real expiry instead of one shared code: it feels personal, cannot leak to coupon sites, and makes each redemption countable.

### 2. Split the audience

| Group | Who | Series |
|---|---|---|
| Unhappy | Return, refund, complaint ticket or 1 to 2-star review | Fix-first note only |
| Repeat-use lapsed | Bought a used-up product, past the gap | Emails 1 to 4 |
| One-time lapsed | Bought a durable product | Emails 1 to 4, complementary angle |
| Past VIPs | High 12-month gross profit before lapsing | Service and early access before any discount |

Anyone who orders exits at once.

### 3. Build the offer ladder

Escalating incentives beat a flat discount in one platform's data [EML-0050]. Ladder by default:

1. **Email 1, no offer:** what is new or what changed.
2. **Email 2, help:** the reason they may have stopped, answered (fit, taste, usage, delivery).
3. **Email 3, the smallest offer that passes:** free shipping first if shipping cost is a known reason, else the smallest percent or money off at or above 10% that keeps gross profit per order above zero. Real expiry, enforced by the platform.
4. **Email 4, last call and sunset:** the email-3 offer ends; ask whether they want to keep hearing from the store.

Check each rung: gross profit per order after the offer, and whether buyers won back on codes repeat less, as discount-led buyers often have worse lifetime value [CXP-0016].

### 4. Write the emails

Rules for all: one job, one button, grade 8 reading level, no guilt ("We miss you!" alone says nothing).

- **Email 1, news.** Subject names the change. Body: what is new since their last order, tied to what they bought ("The refill pouch you asked for is here"). Product block from their purchase history.
- **Email 2, help.** Answer the most common stop reason for their product, from reviews and tickets: a usage tip, a different size, a fit guide, a slower or faster refill plan. A reply invitation to a real person. Optional plain-text founder version from `write-founder-plain-text-email`.
- **Email 3, offer.** The exact offer, what it covers, the end date and time with time zone. One product they are most likely to reorder.
- **Email 4, last call and choice.** Two lines on the offer ending, then: "Want to keep getting our emails?" with a "Yes, keep me" button that records a click, and the plain line that if they do nothing, the store will stop sending marketing email.

Two subjects per email. Preview text adds what the subject leaves out.

### 5. Write the fix-first note

Plain text from a named person: names the problem they had (from the ticket or return reason), says what changed, and offers a direct fix (replacement, exchange, a call), with no sales link. Send once. If they reply or click, a person follows up; they do not enter the promo ladder for 60 days (practitioner default).

### 6. Set the sunset step

Profiles that clicked nothing, visited nothing and bought nothing through the series, and received at least about six emails in the last 120 days, move to suppression from marketing email [EML-0042]. Opens do not count as engagement, as privacy features inflate them [EML-0011]. Suppression is a list health win, not a failure. Texts are judged separately: someone engaged on SMS stays on SMS.

### 7. Text and market notes

- **Text:** one SMS at the email-3 offer for SMS opt-ins, at twice the average days between orders [EML-0029], under 160 characters with no emoji, written with `write-sms-and-whatsapp-messages`.
- **WhatsApp markets:** where buyers opted in to WhatsApp, send the win-back as a triggered marketing template, not a blast, since triggered journeys out-click broadcasts by a wide margin; buyers who paid on delivery get the payment and delivery facts; any SMS follows the country's sender and template rules.
- **UK and EU:** win-back emails go to past buyers under consent or the UK soft opt-in only; the sunset step also keeps the list clean for data rules.
- **US:** postal address, ad identification and unsubscribe in every promo email [EML-6341].

### 8. Plan the read

Measure reactivation rate and gross profit per reactivated buyer over 60 days, not attributed revenue. The first test: start timing (store gap versus 30 to 45 days for repeat products), offer fixed. Flows need about 1,000 recipients per variant [EML-0061].

## Checks before you hand it over

- Start timing comes from the store's own reorder gap per product type.
- Unhappy buyers get the fix-first note only.
- No offer before email 3; the email-3 offer passes the gross profit check and has an enforced expiry.
- Email 4 gives a clear keep-me choice and states what happens if they do nothing.
- Sunset rule uses clicks, site activity and orders, not opens, and names the received-email minimum.
- Past VIPs get service before discount.
- Nothing switched on or suppressed without the client's yes.

## Output

1. **One-screen summary:** groups and sizes, start timing, the offer ladder with gross profit per rung, the sunset rule, the first test.
2. **Flow sheet:** Group, Email, Delay, Job, Offer, Exit, Subject A, Subject B, Preview.
3. **Each email in full:**

```
Group: [...]   Email [n]: [news / help / offer / last call]
Send: [days after last order]   Exit: Placed Order
Subject A / B: [...] / [...]   Preview: [...]
Body: [first line tied to their purchase]
[2 to 6 lines]
Button: [...] -> [URL]
Offer (email 3 to 4): [what], ends [date, time, zone]
Sources: [what-changed note / review id / ticket tag]
```

4. **Fix-first note** in full.
5. **Offer ladder table:** Rung, Offer, Cost per redeemed order, Gross profit after offer.
6. **Sunset rule:** Condition, Window, Action, Owner.

## Common mistakes

- **A fixed 90-day start for everything.** Step 1 uses the store's gap per product.
- **Coupons to people who had a bad experience.** Gate 1 and step 5 send a fix first.
- **The big discount first.** Step 3 escalates.
- **Counting opens as engagement.** Step 6 uses clicks and site activity.
- **Never stopping.** Step 6 suppresses non-responders.

## Sources

- EML-6397: trigger from each customer's own rhythm, not a fixed day.
- EML-6326: the email tool's predicted next order date as a trigger.
- CXP-0016: discount-acquired buyers often have worse lifetime value.
- EML-0011: engaged definitions exclude privacy opens.
- EML-0019: win-back starts at twice the purchase interval.
- EML-0029: SMS win-back timing.
- EML-0032: one-time unsubscribe spike on dormant lists.
- EML-0042: unengaged definition and suppression.
- EML-0050: win-back timing, escalating offers, experience audit.
- EML-0061: flow test size.
- EML-6341: US commercial email rules (proposed).

What makes this skill ours: unhappy buyers are pulled out and sent a fix, not a coupon; the start date comes from the store's own reorder gap per product; offers escalate only to the smallest rung that keeps gross profit above zero; and the series ends in an honest keep-me choice and a sunset rule based on clicks and site activity, not inflated opens.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Automated WhatsApp journeys out-clicked broadcasts about four to one across Indian brands [EML-0048], so send the win-back as a triggered marketing template to opted-in buyers, not a blast. COD buyers get the COD and delivery facts; DLT template rules apply to SMS.
- EML-0048: WhatsApp journeys versus broadcasts in India.
