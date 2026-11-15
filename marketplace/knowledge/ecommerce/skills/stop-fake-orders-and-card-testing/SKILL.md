---
name: stop-fake-orders-and-card-testing
description: "A defence set for a store under fake orders, card testing or pay-on-delivery fraud: the settings to turn on, order rules that hold or cancel doubtful orders before they ship, an incident routine for an attack in progress, and a 15-minute weekly check with alert lines. Reads the store's own orders, failed payments and abandoned checkouts to find the pattern first, so real buyers are not blocked by blunt rules. Works for stores in any country: covers card testing on card checkouts, fake and prank orders on pay-on-delivery or invoice payment, reshipper and refund abuse, and sign-up and discount abuse. Use when small or odd orders spike, failed payments flood in, chargebacks rise, or unpaid orders arrive with fake names and numbers."
---

# Stop fake orders and card testing

**You get:** a pattern report from the store's own data, a settings list to turn on, an order rules table (hold, review, cancel) with owners and time limits, a one-page incident routine for an attack in progress, and a weekly check sheet with alert lines, ready for the client's approval.

## When to use

- Dozens of small orders or failed payments appear in a short time.
- Abandoned checkouts flood in with random names or emails.
- Chargebacks for "fraudulent" are rising.
- Pay-on-delivery or invoice orders arrive with fake names, wrong numbers or addresses that do not exist.
- Discount codes or sign-up offers are being used by many new accounts at once.

## Not for

- Responding to chargebacks already filed: use `win-chargeback-disputes`.
- Delivery-area and order-pattern rules aimed at refused and failed deliveries: use `cut-rto-on-cod-orders`.
- Separating bot visits from real buyers in reports: use `spot-bot-traffic-in-analytics`.
- Staff logins and app permissions: use `lock-down-store-staff-and-app-access`.

## What you need

Required:

1. **Shopify order export**, last 30 to 90 days: Name, Created at, Email, Financial Status, Total, Discount Code, Payment Method, Billing Name, Shipping Name, Shipping Zip, Shipping Phone, Risk Level (from the order page if not in the export), Cancelled at.
2. **Failed payments** from the gateway dashboard (time, amount, decline reason), and the **abandoned checkouts** list for the same days.
3. **Chargeback list** with reasons, if any.
4. **Payment set-up**: which gateway, whether Shopify Payments, the plan.

Optional: courier report of refused and failed deliveries, customer accounts created per day, discount code usage report.

Reading is level 1. Changing settings, building Flow rules and cancelling orders is level 2 then live with the client's yes. Refunding or cancelling during an attack can be pre-approved as a rule ("cancel and refund any order matching pattern A"), written and signed before the agent acts.

## Before you start: the gates

1. **Pattern before rules.** Pass when step 1 has found a pattern with counts. Fail: do not add blocking rules on a hunch; they cost real orders.
2. **Gross profit per order known**, so the cost of a false block can be weighed against the loss from fraud [MEA-0037].
3. **Chargeback rate known.** Processors flag stores above about 0.9% and can stop card acceptance above 1% [SEC-0004]. If the rate is above 0.5%, treat this job as urgent.

## Steps

### 1. Find the pattern

Sort orders and failed payments by time. Card testing looks like: many low-value orders or attempts, many declines before one success, billing names that do not match emails, new emails on throwaway domains, and bursts at odd hours. Attackers now spread small numbers of tries across many stores through residential proxies, so each try looks plausible alone [SEC-6200]; look at clusters by amount, product and time, not by IP alone. Fake pay-on-delivery orders look like: repeated phone numbers with different names, made-up addresses, many units of one item, and postcodes with high refusal. Reshipping fraud looks like: card orders shipped to freight forwarders or reshipping addresses, often for high-resale items. Count each pattern and its share of orders.

### 2. Turn on the built-in layers

1. **Payment screening.** On Shopify Payments, card testing screening runs before the processor; Shopify reports it blocks about 90% of attacks on guest card checkouts [SEC-6200]. On another gateway, ask the provider what it screens and turn on its risk rules.
2. **3D Secure.** Shopify Payments applies it to higher-risk payments; an authenticated payment shifts fraud chargeback liability to the issuer [SEC-0005]. On other gateways, turn on risk-based 3D Secure.
3. **AVS and CVV.** Keep CVV required. Leave AVS off unless the risk reports show address mismatch fraud; turning it on can raise false declines [SEC-0003].
4. **Form protection.** Turn on the store's CAPTCHA option for login, account creation and contact forms in Online Store preferences. A CAPTCHA alone will not stop a determined attacker, since solving services are cheap, and each one costs real shoppers time [SEC-0010], so pair it with rules.
5. **Checkout bot protection.** Check what the plan offers at checkout and turn it on during an attack.

### 3. Write the order rules

Use Shopify Flow (free) or the gateway's rules. Start soft; tighten only if fraud continues.

- **High risk** order: hold fulfilment, review within 24 hours.
- **Card testing pattern** (low value, new customer, mismatched name, many declines in the last hour): cancel, refund, do not ship.
- **Same phone or address, 3 or more orders in 24 hours** (practitioner default, test it): hold and review.
- **Pay-on-delivery or invoice order with a fake-looking name or number:** hold until confirmed by call or message (`confirm-cod-orders-by-chat-or-call`).
- **Card order to a known reshipping or forwarding address with a high-resale item:** hold and review.
- **Discount abuse:** limit codes to one use per customer; sign-up codes go to the email only, not on a public page.
- **Login abuse:** if the store runs its own login or a custom app, rate limit per username and per IP at about 10 times what the heaviest real user does, because one office or mobile carrier IP can carry many people [SEC-0011].

Tag every rule action so the weekly check can count hits.

### 3b. Set the access level for each flow

Bots and AI shopping agents now hit the same flows as buyers. Write one line per flow with one of four levels, and put the hard checks at the money steps, not at browsing [SEC-0007]:

| Level | Where it applies | What happens |
|---|---|---|
| Permit | Home, collections, product pages, search, published feeds | Open to people, search crawlers and AI shopping agents you want |
| Verify | Behaviour changes: a burst of searches, a new country on a known account, no remembered-device cookie | A silent risk check; nothing the buyer sees unless the score is low |
| Challenge | Checkout, gift card balance checks, password change, email or address change, loyalty point redemption | A step-up check: a code to the account email or phone, or an invisible risk score that challenges only low scores |
| Prevent | Clear abuse: card testing, mass sign-ups, one source trying many accounts | Block or cancel, under the tagged rules above |

- **Challenge before block.** For anything unclear, challenge; a hard block on a doubtful case loses a real buyer for good.
- **Size it to the store.** The full plan fits stores with roughly 5,000 or more visits a day, or any store running limited drops or gift cards (a starting guess, not a rule). A small hosted store turns on the platform's own bot and checkout protection, sets the alerts in Step 7 and writes this table as a policy; it cannot set edge rules itself, so do not ask it to.
- **Count before you set numbers.** Without a week of the store's own counts (failed logins per hour, gift card checks per hour, sign-ups per day), every limit is a guess. Write "set after one week of counts" and say how to count.
- **Cheap signals worth a challenge** (starting guesses; reset them after a week of counts): one source trying about 10 different accounts in a minute, repeated failed gift card checks, a browser with no remembered-device cookie on a login, a country this account never used. Blocking by browser name alone is a weak filter.
- **Shared addresses.** An office, campus or mobile carrier can put a hundred buyers behind one address, so pair a strict per-username limit with a softer per-address one [SEC-0011].
- **Custom logins only: give one reply for every outcome.** Wrong password, no such account and locked account get the same message, and forgot-password says "If this email has an account, we sent a link". This stops bots testing which emails are customers. If it frustrates real buyers who forget their email, keep friendly wording but rate limit hard. On Shopify's own customer accounts the platform handles this.
- **AI agents with signed identity.** Treat a verified agent badge as a passport, not a permission slip: it says who the agent is, not that every action it takes is safe [SEC-0009]. Give trusted agents their own lane rather than loosening rules for everyone.
- **Paid bot tools.** Edge bot shields and advanced rate limits are paid services on most plans. Name the cost, or say it is unknown, before the client commits budget, and recommend one only when the store has the budget and someone technical to run it.
- **Privacy.** Update the privacy policy to say what automated and AI agent visits can see in logged-in flows, and suggest a qualified person reviews the wording.
- **Twice a year,** test the rules with a scripted card-testing run against a staging or development copy the client owns. Never test a live store or anyone else's.

### 4. Incident routine (attack in progress)

1. Turn on checkout bot protection and form CAPTCHAs if off.
2. Pause any public discount code being abused.
3. Cancel and refund matching orders before they settle, using the pre-approved pattern; never ship them. Refunding unshipped fraud orders avoids a later chargeback.
4. Contact the gateway's risk team with the time window and pattern.
5. If the attack hits ads (spend spike from fake clicks), pause the affected campaigns and tell the media buyer.
6. Log what happened, counts and what stopped it.

### 5. Pay-on-delivery and invoice notes

- Where the store offers pay on delivery or invoice payment (common in parts of Europe, the Middle East, Latin America, Africa and Asia), fake orders cost forward and return shipping or unpaid goods. Hold all such orders above the store's ceiling or with any fake-looking field until confirmed.
- Block repeat refusers by phone number after 2 refused parcels (practitioner default, test it), offering pay-now only.
- Bank-authenticated methods (local bank transfers, bank-app payments) and wallets are checked by the bank, so card testing is mostly a card risk; on these stores, fake pay-on-delivery orders are often the bigger risk.

### 6. Card notes

- Card testing is the main risk where cards lead (US, UK, Canada, Australia); act within hours, since chargebacks arrive weeks later.
- Each chargeback costs about 128 US dollars in fees and handling on top of the lost goods [SEC-0004].
- In the EU and UK, Strong Customer Authentication (3D Secure 2) is required on most card payments, which cuts card testing but can add declines; check the gateway handles exemptions well.
- Never store card numbers in notes, emails or sheets; on Shopify the merchant's job is not to handle card data outside checkout [SEC-0006].

### 7. Weekly check (15 minutes)

Every Monday: high-risk orders and what happened to each; rule hits by tag; failed payments per day against the 4-week average; chargeback rate (alert at 0.5%); refused parcels by postcode (if pay on delivery is offered); new accounts per day; discount code use. Alert line: any number above 2 times its 4-week average gets a look that day.

## Checks before you hand it over

- The pattern report counts each fraud pattern and its share of orders.
- Every rule names its trigger, action, owner and time limit.
- No rule blocks a whole country, payment method or postcode list without counts behind it.
- The incident routine has a pre-approved cancel pattern signed by the client.
- The weekly check lists alert lines with numbers.
- Real-buyer impact is estimated: orders the rules would have held last month that were genuine.
- No card data appears in any sheet.
- Every money step (checkout, gift cards, account changes, points) has a challenge level, and browsing stays open.
- Every limit is either from the store's own counts or marked "set after one week of counts", with room for shared addresses.
- No paid bot tool is recommended without its cost stated or marked unknown.

## Output

**One-screen summary:** patterns found with counts, fraud cost last 30 days, settings to turn on, rules to add, and the alert lines.

**Pattern report:** Pattern, Signals, Orders or attempts (count), Share of orders, Value, First seen, Still active.

**Order rules table:**

| Rule | Trigger | Action (hold, review, cancel) | Tool (built-in, Flow, gateway, app) | Owner | Time limit | Tag |
|---|---|---|---|---|---|---|

**Incident routine:** numbered steps, with the signed cancel pattern.

**Access levels by flow:** Flow, Level (permit, verify, challenge, prevent), Count watched, Limit (per username and per address, or "after one week of counts"), Then (challenge, hold, block), Owner.

**Weekly check sheet:** Week, High-risk orders, Rule hits, Failed payments, Chargeback rate, Refused parcels, New accounts, Alerts, Actions.

## Common mistakes

- **Blocking by IP alone.** Attacks spread across proxies [SEC-6200]. Step 1 clusters by amount, product and time.
- **CAPTCHA as the only defence.** Step 2 pairs it with rules [SEC-0010].
- **AVS on by reflex.** It can turn away good buyers [SEC-0003].
- **Shipping fraud orders.** Step 4 cancels and refunds before dispatch.
- **Rules nobody reviews.** Step 3 tags actions; step 7 counts them.
- **Blanket bans on a payment method or country.** Step 5 holds and confirms instead.
- **Checking at the front door instead of the till.** Step 3b keeps browsing open and challenges at checkout, gift cards and account changes [SEC-0007].
- **Edge rules for a store that cannot set them.** Step 3b sizes the plan; small hosted stores use platform protection and alerts.

## Sources

- SEC-6200: card testing spreads across stores; Shopify Payments screening.
- SEC-0003: AVS off by default; false declines.
- SEC-0004: chargeback thresholds and cost per chargeback.
- SEC-0005: dynamic 3D Secure and liability shift.
- SEC-0006: never handle card numbers outside checkout.
- SEC-0007: gate bots and agents by action; check at the money step.
- SEC-0009: signed agent identity is a passport, not permission.
- SEC-0010: CAPTCHA alone will not stop a determined bot.
- SEC-0011: login rate limits per username and per IP.
- MEA-0037: gross margin uses delivered cost.

What makes this skill ours: rules come only after the store's own pattern is counted; every rule has an owner, a time limit and a tag the weekly check counts; the incident routine runs on a cancel pattern the client signed in advance; and pay-on-delivery fraud gets its own hold-and-confirm path instead of a blanket ban.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Fake and prank COD orders are the bigger India risk: UPI and cards are pre-authenticated at the bank, so card testing is mostly a card risk. Fake COD orders cost forward and return shipping; hold all COD orders above the store's COD ceiling or with any fake-looking field until confirmed by call or WhatsApp. Block repeat refusers by phone number after 2 refused COD orders, offering prepaid only. Watch COD refusals by pincode in the weekly check.
