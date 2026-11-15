---
name: write-welcome-series
description: "A welcome email series of four to six emails written in full, with two subject lines and a preview per email, the timing, the exit rules and the offer logic: whether to give a sign-up offer at all, how big, in money or percent, and when it really expires, checked against gross profit per order first. Each email has one job (deliver, story, proof, doubts, deadline) built from the store's real reviews, policies and founder facts, with a no-discount version, market notes for payment options and WhatsApp, and US, UK and EU email law checks. Use when a store has no welcome flow, a generic one copied from a template, or a sign-up offer nobody has costed."
---

# Welcome email series

**You get:** four to six welcome emails written in full (two subject lines, preview text, body, button and P.S. each), a timing and exit sheet, and a one-page offer decision with its gross profit check, ready to load as drafts in the email platform for the client to approve.

## When to use

- The store collects emails but has no welcome flow, or a three-email default nobody wrote.
- The pop-up promises a discount and nobody has checked what it costs per order.
- Welcome emails talk about the brand but never answer why a first-time buyer hesitates.
- The store is adding SMS or WhatsApp sign-ups and the email series must match the same offer.

## Not for

- Deciding which flows to build and in what order: use `email-sms-flow-plan`.
- Pop-up design, timing and sign-up offer testing on the site: use `grow-email-and-sms-list-with-popups`.
- The welcome texts and WhatsApp messages themselves: use `write-sms-and-whatsapp-messages`.
- Polishing against years of send history: use `email-copy-from-store-history` after this series runs.

## What you need

Required (read access, level 1):

1. **The current sign-up promise**: pop-up wording, offer, code type (one shared code or unique codes), and any end date. A screenshot is enough.
2. **Gross profit per order** and average order value, from `store-meta-math` or `build-sku-profit-sheet`.
3. **Best sellers by first orders**: from the Shopify order export (Name, Created at, Customer Id, Lineitem name, Lineitem quantity, Subtotal, Discount Code), the top five products bought in first orders over the last 90 days.
4. **Reviews export** (CSV from the reviews app) and the **top ten support questions** from the helpdesk or WhatsApp chats.
5. **Policies as published**: shipping times and costs, returns, guarantee, payment options.
6. **Founder facts**: why the store started, in the founder's words, with anything provable marked.
7. **Brand voice**: five real lines from the site or past emails that the owner likes.

Optional: the current welcome flow report (recipients, click rate, placed order rate, revenue per recipient, unsubscribe rate), a post-purchase survey with "what almost stopped you" answers.

If reviews are thin (under about 20), use support questions and the product page for doubts, and write proof from policies and guarantees, not invented praise. Building drafts in the platform needs draft access (level 2); switching the flow on needs the client's yes.

## Before you start: the gates

1. **Gross profit per order.** Pass when known. Fail: write the no-discount version only and say so on page one.
2. **Inbox health.** If campaigns to engaged subscribers open under 30 to 35%, fix placement first with `email-account-health-audit` [EML-0059].
3. **Consent.** Email sign-ups came through a form with clear wording. SMS and WhatsApp need their own opt-in; never copy email subscribers into a text list.
4. **Facts on the day.** Products named are in stock at the stated price; policies quoted match the live pages.
5. **Approver.** One person signs off claims, offer terms and founder lines.

## Steps

### 1. Decide the offer logic first

Write one line: offer type, size, who gets it, how it expires. Then check it.

- **Cost per redeemed order** = discount value + any extra shipping given away. Gross profit after offer = gross profit per order minus that cost. If it goes below zero on the median first order, the offer fails.
- **Size.** Offers under 10% rarely move sign-ups or orders [EML-0047]. One brand found 10% to 20% lifted results a lot but 20% to 30% added nothing [EML-0058]; another saw no change from 15% to 10% [OFF-0061]. Practitioner default: the smallest offer at or above 10% that passes the profit check; test one step up only if the list is large enough.
- **Money or percent.** Above about 100 in order value, a fixed amount usually reads bigger than the same percent; below it, percent wins [OFF-0026]. Show whichever number is larger [OFF-0017].
- **Long-term check.** At many brands, buyers won on deep discounts repeat less [CXP-0016]. If the store's repeat rate by discount code is known, a code whose buyers repeat clearly less gets a smaller offer or a gift instead.
- **Expiry.** Only a deadline the platform enforces: unique codes that expire, or a code with a set end date. If codes never expire, the series says nothing about a deadline.

Recommend one offer and name the runner-up in one line.

### 2. List the four doubts

From reviews, support questions and survey answers, list what stops a first order: price, fit or size, does it work, shipping time or cost, returns, trust in a new store. Rank by how often each appears. Pick the top four. Each later email answers one.

### 3. Set the count and timing

Default five emails; use six only for products over about three times the average category price or with a long explanation. Most welcome revenue comes in the first 72 hours, so front-load [EML-0060].

| Email | Send | Job |
|---|---|---|
| 1 | On sign-up | Deliver the offer and the store in one screen |
| 1b (optional) | About 8 hours later | Short plain-text note from a person [EML-0060] |
| 2 | Day 1 | Why the store exists (founder facts) |
| 3 | Day 2 | Proof: reviews that each answer one doubt |
| 4 | Day 4 | Doubts: shipping, returns, sizing, payment |
| 5 | Day 6 | Deadline, plain text, 24 hours before expiry [EML-0045] |

Exit on Placed Order for every email after email 1. Existing customers who join the list skip the offer emails and get emails 2 and 3 only. If the person enters a cart or checkout flow, pause the welcome emails until that flow ends.

### 4. Write each email

Rules for every email: one job, one button, one main link, read at grade 8 or below, the store's voice checked against the five real lines.

- **Email 1, deliver.** Subject states the offer plainly. First line: the code or value and how to use it. Then what the store sells in one sentence, one best seller with its price, and the button. No story yet.
- **Email 2, story.** Founder facts only: the problem they hit, what they made, one specific detail. No claims the founder cannot show. If the store has no founder story, use "how we make it" with real sourcing facts.
- **Email 3, proof.** Two or three reviews, each picked because it answers one of the four doubts, not generic praise [EML-0033] [LPG-0053]. Quote exactly, first name and date, with the review app as source. A star average only if the app shows it.
- **Email 4, doubts.** Answer the top shipping, returns and sizing questions in the store's real terms, copied from the live policy. Say clearly which payment options are available (pay later, local methods, pay on delivery where offered) and any fee.
- **Email 5, deadline.** Plain text from a named person. The exact expiry date and time with time zone, what the code covers, and what happens after. If there is no real expiry, this email becomes "the one product most people start with" instead.
- **Every email after email 1:** repeat the code or value in one line near the top, with its expiry, so a reader who skipped email 1 can still use it. Keep email 1's body under about 100 words with the offer, code and button in the first screen, because many readers only see the top of an email (practitioner view, test it).

Write two subjects per email: one plain, one curiosity or benefit. Preview text adds what the subject leaves out. Open with the offer, proof or a promise, not the category's shared pain [LPG-0045]. Cut AI tells such as "it's not X, it's Y" [MCR-0016].

### 5. Write the no-discount version

Swap the offer for something that costs less: a best-seller guide, the free shipping threshold explained, or a low-cost gift listed for sale on the site. Keep emails 2 to 4 as they are. This is the version used when gate 1 fails, and the control in any test.

### 6. Market notes

- **Any market:** prices in the store's currency as shown on site; say "pay on delivery available" only if it is on for every region or name the limit.
- **UK and EU:** the series goes only to people who gave consent at sign-up, and the form says what they will get.
- **WhatsApp:** a WhatsApp welcome goes only to WhatsApp opt-ins, through `write-sms-and-whatsapp-messages`.
- **US:** every email carries the postal address and a working unsubscribe; subjects must not mislead [EML-6341]. Gmail expects one-click unsubscribe and honest subjects; never a fake "Re:" [EML-6340].
- **Fake urgency** fails in every market: no "only today" unless it is true [ADC-6147].

### 7. Plan the one test

Test timing before content; delay changes often move orders more [EML-0023]. A flow test needs about 1,000 recipients per variant [EML-0061]; below that, ship and read monthly. Judge on placed order rate within 14 days of sign-up and gross profit per subscriber, never opens [EML-0013].

## Checks before you hand it over

- The offer passes the gross profit check on the median first order, or the series is the no-discount version.
- Every deadline in the copy is enforced by the platform.
- Each of emails 2 to 4 answers one named doubt from real reviews or tickets.
- Every review is quoted exactly with first name, date and source.
- Every policy line matches the live policy page today.
- Exit rules, existing-customer branch and cart-flow pause are written down.
- US footer and unsubscribe present; no misleading subject.
- Nothing switched on without the client's yes.

## Output

1. **One-screen summary:** the offer (type, size, expiry, gross profit after offer), the runner-up, the four doubts, the send timing and the test.
2. **Flow sheet:** Email, Delay from sign-up, Job, Doubt answered, Exit rule, Branch, Subject A, Subject B, Preview.
3. **Each email in full:**

```
Email [n]: [job]
Send: [delay]    Exit: Placed Order    Branch: [all / new only]
Subject A: [plain]                 ([characters])
Subject B: [benefit or curiosity]  ([characters])
Preview: [adds what the subject leaves out]
Body:
[first line: offer, proof or promise]
[2 to 6 short lines]
Button: [verb + outcome] -> [URL with UTM]
P.S. [one line, optional]
Sources: [review id / policy URL / founder note]
```

4. **Offer decision page:** Offer, Cost per redeemed order, Gross profit after offer, Expiry method, Runner-up.
5. **Assumptions:** one line each, at most three, only where an unknown changes what to do. Founder lines are only those the brief gives; claims are only those with proof on file.

## Common mistakes

- **Discount picked by habit.** Step 1 costs it and tests the size.
- **A deadline the code does not have.** Step 1 allows only enforced expiry.
- **Five emails saying "we love our product".** Step 2 gives each email a doubt to answer.
- **Generic five-star quotes.** Step 4 picks reviews that answer a doubt.
- **Welcome offers to people already in checkout.** Step 3 pauses the series.
- **Judging by opens.** Step 7 uses orders and gross profit.

## Sources

- EML-0013: opens inflated; judge on clicks and orders.
- EML-0023, EML-0061: test delays first; flow test sizes.
- EML-0033, LPG-0053: reviews that answer one objection each.
- EML-0045, EML-0060: front-loaded welcome timing and plain-text expiry note.
- EML-0047, EML-0058, OFF-0061: sign-up offer size.
- EML-0059: inbox health floor.
- EML-6340: Gmail sender rules (proposed).
- EML-6341: US CAN-SPAM rules (proposed).
- ADC-6147: false urgency is misleading (proposed).
- CXP-0016: discount-acquired buyers repeat less.
- LPG-0045: open with curiosity, proof or promise.
- MCR-0016: cut contrast lines that read as AI.
- OFF-0017, OFF-0026: money versus percent.

What makes this skill ours: the offer is costed against gross profit per order and checked against repeat behaviour by discount code before any copy is written; every deadline must be enforced by the platform; each email answers a doubt taken from the store's own reviews and tickets; and there is always a no-discount version that doubles as the test control.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Prices in rupees as shown on site. Say "COD available" only if it is on for all pincodes or name the limit, and say any COD fee in email 4. If the store offers a prepaid saving, mention it only when `cod-and-prepaid-checkout-for-india` shows it pays.
