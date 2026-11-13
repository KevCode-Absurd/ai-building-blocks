---
name: write-product-launch-email-sequence
description: "A product launch email sequence written in full from teaser to last call: two teasers, a waitlist and VIP early-access email, the public launch email, a proof email, a questions email and last-call emails, each with subject lines, preview, body, send time and the segment it goes to. Waitlist and VIP customers get first access without deeper discounts, the rest of the engaged list follows, and buyers leave the sequence at once. Stock counts, pre-order dates, early tester quotes and the launch deadline are checked as true before any line uses them. Use two to four weeks before a new product, collection or limited batch goes live."
---

# Product launch email sequence

**You get:** a launch sequence of seven to nine emails written in full (teasers, waitlist and VIP early access, launch, proof, questions, last call), each with two subject lines, preview, body, button, send date and time and target segment, plus a segment map and a stock and claims sheet, ready to load as drafts for the client to approve.

## When to use

- A new product, flavour, colour or collection goes live in two to four weeks.
- A limited batch or pre-order window has a real end.
- The store has a waitlist or back-in-stock list for the product.
- Past launches were one "it's here" email that the list ignored.

## Not for

- Designing the launch offer and checking its margin: use `design-launch-offer`.
- Launch ads (teaser, reveal, proof, last chance) across paid social: use `product-launch-creative-kit`, and match its dates.
- One email for a restock or new arrival without a launch window: use `write-promo-campaign-email`.
- Who counts as a VIP and what perks they get: use `vip-customer-program`.

## What you need

Required (read access, level 1):

1. **Launch facts**: product name, price, launch date and time with time zone, launch offer and its end, units available (or pre-order terms and ship date).
2. **Segments**: waitlist or back-in-stock sign-ups for this product, the VIP segment definition, the 90-day engaged segment, active subscribers.
3. **Why it exists**: the problem it solves, what changed from the old version, and the founder or maker's notes.
4. **Proof that exists**: early tester feedback with permission, lab or material facts, photos or video of the real product.
5. **Questions**: what buyers will ask (size, ingredients, compatibility, delivery), from support history on similar products.
6. **Brand voice**: five real lines.

Optional: past launch reports (recipients, click rate, orders, unsubscribes), the ad calendar from `product-launch-creative-kit`.

If units or ship date are not confirmed, write the sequence with those lines marked for sign-off and do not schedule. Drafts need draft access (level 2); scheduling needs the client's yes.

## Before you start: the gates

1. **Launch offer and gross profit.** Any launch price or gift is costed in `design-launch-offer`. Fail: launch at full price with value, not discount.
2. **Stock or pre-order truth.** "Limited", "first batch" or counts only with confirmed units. Pre-orders need a set-up that supports them and a stated ship date [OPS-6282]; for US buyers, a late shipment needs a delay notice offering wait or refund [CXP-6160].
3. **A real deadline.** "Last call" only if something truly ends: launch price, gift, batch or pre-order window. No end means no last-call emails.
4. **Proof rules.** Early testers who got free product are disclosed [CXP-6303]; no made-up or AI-generated reviewers [MCR-6045].
5. **Subscribers.** Active subscribers get the news as an add-on option or a subscriber perk, never a public deal that tempts them to cancel [EML-0001].

## Steps

### 1. Map segments and their access

| Segment | Access | Emails |
|---|---|---|
| Waitlist for this product | First: 24 hours before public (practitioner default) | All |
| VIP customers | Same early window, early access as the perk, not a deeper discount | All except teaser 1 |
| Engaged 90 days | Public launch | Teasers, launch, proof, questions, last call |
| Active subscribers | Add-to-next-order option | Launch and last call only |
| Unengaged | Excluded | None |

Anyone who buys the product leaves the sequence at once and moves to `write-post-purchase-emails`.

### 2. Set the calendar

Moderate cadence by default. One practitioner runs about ten new emails over a launch, resends to non-openers and three closing emails on the final day [EML-0010]; use that pace only for an engaged list with low unsubscribes, and resend to engaged non-clickers rather than non-openers, since privacy features make opens unreliable [EML-0013].

| Email | When | Segment | Job |
|---|---|---|---|
| Teaser 1 | Launch minus 10 to 14 days | Waitlist, engaged | The problem, a hint of the answer |
| Teaser 2 | Launch minus 4 to 5 days | Waitlist, VIP, engaged | What it is, the date, join the early list |
| Early access | Launch minus 1 day | Waitlist, VIP | It is open for you now |
| Launch | Launch day morning | Engaged, subscribers | It is here, what it does, price |
| Proof | Launch plus 2 days | Non-buyers | Real early feedback, close-up detail |
| Questions | Launch plus 4 days | Non-buyers | Answer the top five questions |
| Last call 1 | Final day morning | Non-buyers | What ends, when |
| Last call 2 | Final hours | Non-buyers clicked in sequence | Plain text, short |

A cultural date the brand can own gives a launch a natural reason to buy now [EML-0055]; tie the date to one if it is true.

### 3. Write the teasers

- Teaser 1 opens on the problem in the buyer's words and one detail of the new product, without the full reveal. The button is "Join the early list" for non-waitlist readers.
- Teaser 2 names the product, shows one real photo, states the date and time, and says what early-list members get (first access, not a hidden discount unless the launch offer says so).

### 4. Write early access and launch

- **Early access:** "You asked to hear first. It is open now for you, 24 hours before everyone." The product, the price, units if limited and true, the button. Send at a time the waitlist is active.
- **Launch:** the headline names the product and the one thing it does. Three short facts, the price, the launch offer and its exact end if there is one, and the button. One practitioner saw an "introducing" email open at about half the usual rate [EML-0010]; lead with the benefit, not the word "introducing".

### 5. Write proof and questions

- **Proof:** early tester feedback quoted exactly with first name, plus the disclosure of free product if given. Close-up photos of the real product. No results claims beyond the approved claims list.
- **Questions:** the top five questions with short, factual answers from the spec sheet and policies (size, materials or ingredients, delivery dates, returns, how it differs from the old version).

### 6. Write last call

- **Last call 1:** what ends (launch price, gift, batch, pre-order window), the date and time with time zone, and the product in one line.
- **Last call 2:** plain text from a named person, three or four lines, to non-buyers who clicked during the sequence. If units are close to sold out, give the real count from the stock report that morning.
- After the end: the price changes, the gift ends, or the pre-order closes as stated. No extension unless announced as a new decision with its reason.

### 7. Texts and India notes

- One launch text on launch morning and one on the final day to SMS opt-ins; SMS is best kept for launches, sales and restocks [EML-0025]. Write them with `write-sms-and-whatsapp-messages`.
- **India:** WhatsApp marketing templates for waitlist members who opted in, submitted at least two days ahead; COD availability for the new product stated plainly; festival launch dates checked against courier cut-offs.
- **US:** pre-order ship dates need a reasonable basis; if the date slips, send the delay notice before the promised date [CXP-6160].

## Checks before you hand it over

- Each email has a segment, a send date and time, and an exit on purchase.
- Waitlist and VIP access is earlier, not cheaper, unless the costed launch offer says otherwise.
- Every count, ship date and deadline has a confirmed source; no last call without a real end.
- Early tester quotes are exact, permitted and disclosed if the product was free.
- Active subscribers are protected from a public deal.
- Dates match the ad calendar from `product-launch-creative-kit`.
- Nothing scheduled without the client's yes.

## Output

1. **One-screen summary:** launch date, segments and access, the calendar, the launch offer and its end, the stock or pre-order facts.
2. **Segment map:** Segment, Definition, Size, Access time, Emails received, Exit.
3. **Each email in full:**

```
Email: [Teaser 1 / ... / Last call 2]
Send: [date, time, zone]   Segment: [...]   Exit: bought the product
Subject A / B: [...] / [...]   Preview: [...]
Body: [first line]
[3 to 8 lines]
Button: [...] -> [URL with UTM]
Sources: [stock report date / tester permission / spec sheet]
```

4. **Stock and claims sheet:** Line, Claim, Source, Date checked.
5. **To confirm:** units, ship date, deadline wording, tester disclosures.

## Common mistakes

- **"Limited" with no limit.** Gate 2 needs confirmed units.
- **Last call that is not last.** Gate 3 and step 6 forbid planned extensions.
- **VIPs paid with deeper discounts.** Step 1 gives early access instead.
- **Buyers still getting launch emails.** Step 1 exits them at purchase.
- **Resends to "non-openers".** Step 2 uses non-clickers.
- **Tester quotes without disclosure.** Gate 4 requires it.

## Sources

- CXP-6303: disclose rewards to endorsers (proposed).
- EML-0001: protect active subscribers.
- EML-0010: launch cadence, resends and closing emails.
- EML-0013: opens are unreliable.
- EML-0025: SMS for launches, sales and restocks.
- EML-0055: own a cultural moment as a reason to buy now.
- MCR-6045: no fake or AI-generated reviewers (proposed).
- CXP-6160: US delay notice for late shipments (proposed).
- OPS-6282: Shopify pre-order set-up (proposed).

What makes this skill ours: waitlist and VIP customers get time, not deeper discounts; last-call emails exist only when something truly ends and nothing is quietly extended; stock counts, ship dates and tester quotes are checked on the day; and resends go to engaged non-clickers rather than unreliable non-openers.
