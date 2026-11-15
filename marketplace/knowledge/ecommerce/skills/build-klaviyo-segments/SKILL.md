---
name: build-klaviyo-segments
description: "The fourteen email and SMS segments a store actually uses, each with its purpose, the exact Klaviyo condition lines to build it, the expected size check, and where it is used (campaign audience, exclusion, flow filter). Covers engaged windows that ignore Apple privacy opens, sunset, buyers by order count, active subscribers to exclude from sales, high intent, at risk, discount-only buyers and do-not-market, with a free path in Shopify Email and notes for phone-only buyers and failed deliveries. Use when taking over an account with dozens of unused segments, before planning campaigns, or when every send goes to the whole list."
---

# Email segments that matter

**You get:** a segment sheet of fourteen segments, each with its purpose, the Klaviyo definition written line by line, a size check against the list, where it is used, and a naming convention, plus a cleanup list of old segments to retire.

## When to use

- The account has dozens of segments and nobody knows which are used.
- Campaigns go to the whole list, including people who have not opened in a year.
- Before `plan-monthly-email-calendar`, which assigns a segment to every send.
- After `email-account-health-audit` flags weak engagement or missing exclusions.

## Not for

- Scoring customers on recency, frequency and gross profit: use `rfm-customer-segments` (this skill turns its groups into Klaviyo segments in step 4).
- Choosing who is a VIP and their perks: use `vip-customer-program`.
- Fixing domain authentication and deliverability: use `email-account-health-audit`.
- Flow design: use `email-sms-flow-plan`.

## What you need

Required (read access, level 1):

1. **Klaviyo account access** through an official connector, or screenshots and CSV exports of current segments, lists and their sizes.
2. **The store's median days between first and second order** (from `cohort-repeat-and-ltv-analysis` or `rfm-customer-segments`); call it G.
3. **Integration check**: Shopify (or the store platform) synced, with Placed Order, Ordered Product, Started Checkout, Added to Cart and Viewed Product metrics present.

Optional: subscription app integration, returns or helpdesk integration, RFM sheet, SMS consent counts.

If G is unknown, use 60 days for fast-repeat products and 120 days for the rest, and mark it "replace with store gap". Creating segments needs draft access (level 2). Segments are not sends; using them in a send needs the client's yes.

## Before you start: the gates

1. **Events flowing.** Pass when Placed Order counts in Klaviyo match Shopify orders within a few percent for the last 30 days. Fail: fix the integration first; every segment below depends on it.
2. **Inbox health.** If the 90-day engaged segment opens under 30 to 35%, sending discipline matters more than new segments [EML-0059]; build the engaged and sunset segments first.
3. **Consent fields.** "Can receive email marketing" and "can receive SMS marketing" must reflect real consent. Never mark imported contacts as consented without a record.

## Steps

### 1. Name everything one way

Format: `[Type] Purpose, window`. Types: ENG (engagement), BUY (purchase), EXC (exclusion), INT (intent), SMS. Example: "ENG Engaged, 90 days". Retire any segment not used in a send or flow in 90 days; export its definition first.

### 2. Build the engagement segments

Apple's privacy feature records opens that never happened, so count only real opens and clicks. Count as engaged: a real open or non-bot click within the window, or sign-up or site visit recently [EML-0011].

| Segment | Klaviyo definition | Use |
|---|---|---|
| ENG Engaged, 30 days | Can receive email marketing AND (Opened Email at least once in last 30 days, excluding Apple privacy opens, OR Clicked Email at least once in last 30 days OR Active on Site at least once in last 30 days OR Added to list in last 14 days) | Warm-up and first sends after a pause |
| ENG Engaged, 90 days | Same with 90 days | Main campaign audience |
| ENG Engaged, 180 days | Same with 180 days | Big moments only |
| ENG Sunset | Received Email at least 6 times in last 120 days AND zero opens (excluding privacy) AND zero clicks AND not Active on Site in last 120 days AND Placed Order zero times in last 120 days | Sunset flow, then suppress [EML-0042] |

Send campaigns broad to the engaged base about 80% of the time, keep at least half the list engaged, and re-warm dormant contacts in slices of about 10% added to normal sends [EML-0052]. If opens are poor, send only to the 14-day engaged group until opens recover, then widen [EML-0021].

### 3. Build the purchase segments

Split by new, returning and loyal first; for most stores the main job is turning first orders into second ones [EML-0053].

| Segment | Klaviyo definition | Use |
|---|---|---|
| BUY Never purchased | Can receive email marketing AND Placed Order zero times over all time | Education, social proof, welcome offer reminders |
| BUY One-time buyers | Placed Order equals 1 time over all time | Second-order campaigns |
| BUY Repeat buyers | Placed Order at least 2 times over all time AND Placed Order at least once in last 2 x G days | New products, bundles |
| BUY At risk | Placed Order at least once over all time AND zero times in last 2 x G days | Win-back campaigns (`win-back-lapsed-customers`) |
| BUY VIP | Properties: vip equals true (tag set by `vip-customer-program`), or RFM group equals Champions | Early access |
| BUY Discount-only buyers | Placed Order at least once AND Placed Order where Discount Codes is not set, zero times | Lower or no offers; discount-led buyers repeat less [CXP-0016] |

If Klaviyo's RFM report is available (500 or more buyers, 180 days of orders, some 3-order customers), add one segment per RFM group with "Current RFM group equals [group]" and set the recency cutoffs to the store's gap [EML-6325]. Predicted fields such as expected date of next order need the same data floor [EML-6326].

### 4. Build the intent and channel segments

| Segment | Klaviyo definition | Use |
|---|---|---|
| INT High intent | (Started Checkout at least once in last 14 days OR Added to Cart at least twice in last 14 days) AND Placed Order zero times in last 14 days | Product-focused campaigns, not discounts |
| SMS Engaged | Can receive SMS marketing AND (Clicked SMS at least once in last 90 days OR Placed Order at least once in last 90 days) | SMS campaigns; drop people who received 15 or more texts and never clicked [EML-0030] |

### 5. Build the exclusions

| Segment | Klaviyo definition | Use |
|---|---|---|
| EXC Active subscribers | Subscription status equals active (from the subscription app integration) | Exclude from sitewide sales; campaigns can trigger cancels [EML-0001] |
| EXC Do not market | Open support ticket tag, return in progress, chargeback, or 2 or more refused or failed-delivery tags | Exclude from all marketing |

Add both exclusions to every campaign by default. Hard bounces are suppressed at once; soft bounces after about four [EML-0042].

### 6. Check sizes

Write each segment's size and its share of the list. Sanity checks:

- Engaged 30 is smaller than 90, which is smaller than 180.
- Never purchased plus One-time plus all repeat buyers roughly equals all profiles who can receive email.
- Sunset should not exceed the profiles outside Engaged 180.
- Any segment under 500 profiles is used for flows or small personal sends only, never for split tests.

### 7. Free path and market notes

- **Shopify Email or other tools:** Shopify customer segments support number of orders, amount spent, last order date, email subscription status and tags; build the purchase segments and exclusions there. Engagement windows need the email tool's own open and click data.
- **Phone-first buyers:** in many markets (much of Latin America, Asia, Africa and Southern Europe) buyers give only a phone. Build parallel WhatsApp or SMS segments keyed on phone, with WhatsApp opt-in as a property. Tag customers who refused delivery from the courier report and keep them in Do not market for promotions.
- **UK and EU:** marketing consent is per channel under GDPR and the e-privacy rules; build email and SMS consent as separate properties.

## Checks before you hand it over

- Placed Order counts match Shopify within a few percent.
- Engaged segments exclude Apple privacy opens.
- The sunset rule has a received-count floor and a day count.
- Purchase windows use the store's gap, or are marked "replace with store gap".
- Active subscribers and Do not market are excluded from every campaign.
- Size checks pass and are written down.
- Old segments to retire are listed with definitions saved.
- No send was made without a client yes.

## Output

1. **One-screen summary:** the fourteen segments with sizes, the default campaign audience and exclusions, and the old segments to retire.
2. **Segment sheet** (`segments.csv`): Name, Type, Purpose, Definition (line by line), Size, Share of list, Used in (campaigns, flows, exclusions), Owner, Last checked.
3. **Retire list:** Name, Size, Last used, Saved definition.

## Common mistakes

- **Counting privacy opens as engaged.** Step 2 excludes them.
- **Sending to the whole list.** Step 2 sets Engaged 90 as the default.
- **Fixed 90 or 180-day buyer windows.** Step 3 uses the store's gap.
- **Sale emails to active subscribers.** Step 5 excludes them by default.
- **Splitting the list into tiny segments.** Step 6 keeps segments under 500 out of tests.
- **Segments nobody uses.** Step 1 retires them.

## Sources

- EML-0011: what counts as engaged; sunset after 180 days.
- EML-0042: unengaged definition and bounce rules.
- EML-0052: send broad, keep half engaged, re-warm in slices.
- EML-0021: repair reputation with 14-day engagers first.
- EML-0059: inbox floor for engaged sends.
- EML-0053: split by new, returning, loyal.
- EML-0001: exclude active subscribers from sales.
- EML-0030: drop SMS non-clickers after 15 texts.
- CXP-0016: discount-acquired buyers repeat less.
- EML-6325, EML-6326: Klaviyo RFM and predictions, with data floors.

What makes this skill ours: buyer windows come from the store's own reorder gap; engagement ignores Apple privacy opens; active subscribers, open complaints and buyers who keep refusing delivery are excluded from every campaign by default; and each segment carries a size check so tiny segments never feed a split test.

## Selling in India

- Many COD buyers have only a phone; key segments on phone with WhatsApp opt-in.
- Tag RTO customers from the courier report and keep them in Do not market.
