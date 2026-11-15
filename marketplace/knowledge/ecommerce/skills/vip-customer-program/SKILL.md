---
name: vip-customer-program
description: "A VIP program built from the store's own data: who qualifies (top customers by 12-month gross profit with at least two orders, high returners and fraud excluded), a ranked list of perks that cost little but feel big, each priced per VIP per year against a cap, how members are told and welcomed, an early warning when a VIP slows down, and a holdout to see if the program adds orders. Service fixes come before perks. Includes market notes on the VIP channel (WhatsApp, SMS, email), shipping and payment perks, and peak season early access. Use when a small group of customers earns a large share of profit, when the owner wants to reward best customers without discounting, or after RFM segments are built."
---

# VIP customer program

**You get:** a VIP list with the qualifying rule, a perk menu priced per VIP per year and capped against their gross profit, a welcome and keep-buying plan with messages per step, an at-risk alert rule, and a results sheet with a holdout.

## When to use

- A small group of customers clearly earns a large share of gross profit and gets the same emails as everyone else.
- The owner wants to thank top customers but does not want to train them to wait for discounts.
- `rfm-customer-segments` shows a solid Champions group.
- Top customers have started to slip and nobody noticed.

## Not for

- A points or tier program open to every customer: use `design-loyalty-program`.
- Turning one-time buyers into repeat buyers: use `post-purchase-repeat-sequence`.
- Rewards for referring friends: use `design-referral-program`.
- Win-back of VIPs who already lapsed: use `win-back-lapsed-customers` (Group A).

## What you need

Required (read access, level 1):

1. **Shopify order export**, at least 12 months, ideally 24: Name, Email, Phone, Created at, Financial Status, Subtotal, Discount Amount, Refunded Amount, Lineitem sku, Payment Method, Tags.
2. **Gross profit per order** from `build-sku-profit-sheet`.
3. **Returns, chargebacks and support tickets** per customer.
4. **Costs of candidate perks**: express shipping upgrade cost, sample cost, gift landed cost, staff time per call.

Optional: `rfm-customer-segments` sheet, post-purchase survey answers, reviews by customer, support tool tags.

If gross profit is missing, rank on net revenue after refunds and say so. Tagging VIPs in Shopify or the email tool needs draft access (level 2); sending to them and spending on perks needs the client's yes.

## Before you start: the gates

1. **Is VIP the constraint?** Under about 10 to 20 million a year, first-to-second order conversion usually limits growth more than VIP revenue does [EML-0053]. Pass when the repeat sequence already works, or when the top 10% clearly earn a large share of gross profit. Fail: keep the VIP plan light (welcome, early access) and spend effort on second orders first.
2. **Service effort.** High-effort service turns loyal customers away far more than delight wins them [CXP-0009]. If refunds are slow or tickets wait days, fix that first; a gift does not cover a bad return.
3. **Cash and capacity.** Name the yearly perk budget and who will run personal touches (notes, calls). No perk without an owner.

## Steps

### 1. Decide who qualifies

Rank customers by trailing 12-month gross profit after refunds, measured only on customers who have had at least 12 months to buy [MEA-0048]. VIP = top 10% (or top 5% if the list is large), with at least two delivered orders. Exclude:

- Return rate over twice the store's average.
- Chargebacks, fraud flags, or two or more refused or failed delivery parcels.
- Staff, friends and wholesale accounts.

If the store uses Klaviyo's RFM groups, Champions is a good starting list; check it against the gross profit rule [EML-6325].

Write down: their count, share of customers, share of 12-month gross profit, median days between orders, and average gross profit per VIP per year.

### 2. Set the perk budget

Perk cost per VIP per year should stay well under the gross profit each VIP earns. Practitioner default: cap at 5 to 10% of average annual gross profit per VIP, test it. Write the cap in money.

### 3. Rank the perks by cost and felt value

| Perk | Cost per VIP per year | Felt value | Notes |
|---|---|---|---|
| Early access to launches and sales (24 to 48 hours) | Near zero | High | Must have enough stock |
| Priority support line or named contact | Staff time | High | Only if replies are really faster |
| Free express shipping upgrade | Shipping difference x orders | High | Price it from the courier invoice |
| First look or sample of new products | Sample landed cost | High | Ask for honest feedback in return |
| Handwritten note from the founder | Minutes per note | High | Branded touches can cost under 0.50 USD per order [CXP-0008] |
| Price lock on a favourite product | Lost price rise | Medium | Grandfathering rewards loyalty without a discount [OFF-0063] |
| Product input panel or founder call | Staff time | High for some | Small group only |
| Birthday or anniversary gift | Gift landed cost | Medium | Announce it so it is expected |
| Fixed "wow budget" for surprise fixes | Set weekly | High | Used for VIPs with a problem or a milestone [CXP-0022] |

Pick three to five perks whose total cost per VIP per year fits the cap. Prefer access, service and recognition over discounts; discounts train the best customers to wait. Surprise gifts sent to everyone without warning rarely pay back; tell members what they get, and save surprises for at-risk VIPs [CXP-0006].

### 4. Tell them and welcome them

Announced status is what changes behaviour, so tell each VIP:

1. **Welcome message** (email, plus WhatsApp or SMS if opted in, whichever buyers in that market use): a personal note, what they now get, how to reach the priority line.
2. **Physical touch** with their next order: the founder note, and the perk card.
3. **Personal letters work:** one retailer's tailored second-purchase letters doubled conversion against a control [CXP-0020]; a short handwritten line is the low-cost version.

Never show internal labels like "top 10% by profit" to the customer. Call it what the brand would call it.

### 5. Keep them buying

- **Content cadence:** normal sends plus one VIP-only message a month (early access, a first look, a behind-the-scenes note).
- **At-risk alert:** flag any VIP whose days since last order passes 1.5 times their own median gap. Within a week, send a personal check-in (not a code) and, where warranted, use the wow budget.
- **Service first:** fast refunds and exchanges protect repeat buying; instant refunds were linked to faster, more frequent repurchase in vendor data [CXP-0015].
- **Conversation:** in SMS or WhatsApp messages, end with a simple question and have a real person answer; customers who reply showed higher value in one data set [EML-0035].
- **Subscribers:** a VIP who subscribes gets a better subscriber-only offer during public sales, or may cancel to buy the public deal [OFF-0043].

### 6. Review membership each quarter

Rescore every quarter. Give a grace period of one quarter before removing anyone. Remove quietly, never with a "you lost your status" email. Do not take back perks already promised.

### 7. Measure with a holdout

Hold 10 to 20% of qualifying VIPs out of the announced perks for two quarters (they still get normal service). Compare orders per customer and gross profit per customer, after perk costs. With under about 200 VIPs, the holdout will not show a clear result; then track VIP retention (share still buying within 1.5 times their gap) quarter by quarter instead, and say the read is directional.

### 8. Channel and market notes

- **WhatsApp markets** (much of Europe, Latin America, Asia): WhatsApp is the VIP channel; a WhatsApp list for early access works well if opt-ins are recorded.
- **SMS markets** (US, Canada, UK, Australia): SMS early access for opted-in VIPs, within each market's consent rules; free express shipping is the most valued low-cost perk in many categories.
- **Payment and shipping perks:** waiving a payment option fee, free returns, or free express shipping costs little per VIP.
- **Peak season early access** (Black Friday, the holidays, local festivals) must be planned against stock.

## Checks before you hand it over

- VIPs are ranked on 12-month gross profit after refunds, with at least two orders.
- High returners, fraud flags, repeat parcel refusers and staff are excluded.
- Perk cost per VIP per year is priced and under the written cap.
- No perk is a standing discount code.
- Every perk has an owner and stock or staff to deliver it.
- The at-risk rule has a day count and a named action.
- A holdout or a stated directional measure is set.
- Nothing was sent or spent without a client yes.

## Output

1. **One-screen summary:** VIP count, their share of gross profit, the chosen perks with yearly cost, the cap, and the first three actions with owners and dates.
2. **VIP sheet** (`vip-members.csv`): Customer key, Orders 12m, Gross profit 12m, Return rate, Median gap, Days since last order, Status (active, at risk, grace), Holdout (yes or no), Channel ok.
3. **Perk table:** Perk, Cost per VIP per year, Total yearly cost, Owner, How delivered, Start date.
4. **Message plan:** Step, Trigger, Channel, Purpose, Owner.
5. **Quarterly results:** Quarter, VIPs, Retained, Orders per VIP, Gross profit per VIP after perks, Holdout comparison.

## Common mistakes

- **VIP by revenue or order count alone.** Step 1 uses gross profit after refunds.
- **Perks that are just discounts.** Step 3 favours access, service and recognition.
- **Silent perks.** Step 4 announces membership; surprises go to at-risk VIPs.
- **Delight on top of bad service.** Gate 2 fixes service first.
- **Nobody watching VIPs slip.** Step 5 sets the at-risk alert.
- **Promising what stock or staff cannot deliver.** Every perk has an owner.

## Sources

- EML-0053: first-to-second order is the usual constraint below 10 to 20 million.
- MEA-0048: rank by 12-month gross profit on customers old enough.
- EML-6325: Klaviyo RFM groups, Champions.
- CXP-0009: fix effort before adding delight.
- CXP-0008: cost of branded unboxing touches.
- OFF-0063: grandfathered prices reward loyalty.
- CXP-0022: a fixed weekly wow budget.
- CXP-0006: unannounced gifts rarely pay.
- CXP-0020: personal second-purchase letters doubled conversion.
- CXP-0015: instant refunds and repurchase.
- EML-0035: replies in SMS conversations and value.
- OFF-0043: subscriber-only offers during public sales.

What makes this skill ours: VIPs are chosen on 12-month gross profit with heavy returners and parcel refusers removed; every perk is priced per member per year against a written cap; service effort is fixed before any delight is added; and an at-risk alert on each VIP's own buying gap catches slippage before win-back is needed.

## Selling in India

- WhatsApp is the VIP channel.
- Waive the COD fee for VIPs, or give them prepaid-only express shipping.
- Exclude buyers with two or more refused COD parcels.
- Plan Diwali and Raksha Bandhan early access against stock.
