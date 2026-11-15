---
name: write-promo-campaign-email
description: "One promotional campaign email written in full (three subject lines, preview text, headline, body, button, offer terms block and footer) plus a matching text version for SMS or a WhatsApp marketing template, all carrying the exact same offer, end date and exclusions. Checks the offer's gross profit, stock and any 'was' price before writing, picks the segment and send time, and runs a claims, spam and law check (CAN-SPAM in the US, UK and EU consent rules, Gmail sender rules and local ad rules). Use for a single sale, offer, restock, bundle or new-arrival email, when the offer is decided and needs to be sold clearly and honestly."
---

# Promotional campaign email

**You get:** one campaign email written in full (three subject lines, preview, headline, body, button, offer terms block) and one text version (SMS under 160 characters, or a WhatsApp marketing template), with the segment, send time and a check table, ready to load as a draft for the client to approve.

## When to use

- A one-day offer, a weekend sale email, a bundle or gift-with-purchase email.
- A restock or back-in-stock announcement for a best seller.
- A new-arrival email with a launch price.
- An offer email exists but its terms in the email, banner and checkout do not match.

## Not for

- A multi-day sale with early access and final hours: use `write-sale-countdown-emails`.
- A launch from teaser to last call: use `write-product-launch-email-sequence`.
- Deciding how deep a discount can go: use `how-deep-can-we-discount` or `offer-bundle-threshold-design` first.
- An email with no offer that teaches or entertains: use `write-value-newsletter-email`.

## What you need

Required (read access, level 1):

1. **Offer brief**: offer, products or collections included, exclusions, start and end date and time with time zone, code or automatic discount, one use per customer or not, stacking rules.
2. **Gross profit after the offer** per order, from `how-deep-can-we-discount`, `store-meta-math` or `build-sku-profit-sheet`.
3. **Stock** for each featured product (Shopify inventory export: Handle, Variant SKU, Available) and expected sales for the offer window.
4. **Price history** for any "was" or compare-at price: the dates and prices the product actually sold at.
5. **Recent send history**: last 8 weeks of campaigns with segment, recipients, click rate, placed order rate, revenue per recipient and unsubscribe rate.
6. **Assets**: product images, the sale banner if one exists (`design-sale-banners-and-hero`), five brand voice lines.

Optional: reviews for the featured products, the reason for the sale in the owner's words.

Drafts need draft access (level 2). Scheduling or sending needs the client's yes, every time.

## Before you start: the gates

1. **Gross profit after the offer.** Pass when above zero per order at the offer price. Fail: stop and send back to `how-deep-can-we-discount`. A 30% discount can triple the return on ad spend needed to break even [OFF-0065].
2. **Stock.** Featured items cover the expected sales. If not, feature fewer items or cap the offer and say the cap.
3. **Reference price.** A "was" price only if the item was openly sold at it, in good faith, for a reasonable recent time [OFF-6145]. Fail: drop the "was" price and show the saving another true way.
4. **Inbox health.** Engaged campaign opens under 30 to 35% point to placement trouble [EML-0059]; send this to the engaged segment only and flag `email-account-health-audit`.
5. **Subscription buyers.** If the store sells subscriptions, active subscribers are excluded or get a better subscriber-only offer, or they cancel to buy the public deal [OFF-0043] [EML-0001].

## Steps

### 1. Write the offer in one sentence

"[Offer] on [what], [who can use it], until [date, time, zone]." Every later line must agree with this sentence word for word on numbers. Show the bigger number, money saved or percent off [OFF-0017]. "Up to" only when items really reach the top figure.

### 2. Find the true reason

A sale with a real reason reads as honest and gives a reason to act now: season change, restock, anniversary, end of a line, a cultural moment the brand owns [EML-0055]. Use the owner's reason. If there is none, do not invent one; say plainly what the offer is.

### 3. Pick segment and send time

- Segment: engaged in the last 90 days by default; widen only if inbox health is good.
- Frequency check: campaigns per week by revenue band: about 2 to 3 under 50k a month, 3 to 4 above, 4 to 5 above 200k, and add sends only while opens hold [EML-0041]. If this email pushes the store past its band this week, replace a lower-value send rather than adding one.
- Send time: the store's best hour from send history; if unknown, test two hours on a 50/50 split.

### 4. Write the email

Structure, top to bottom:

1. **Headline above the fold**: the offer and the end, in under 10 words. Button right under it.
2. **Why now**: the true reason, one or two lines.
3. **What to buy**: one to three products, each with name, offer price, and one line on why it is worth it. On mobile, one product per row, or a 2 by 2 grid at most.
4. **Proof**: one review that answers the main doubt about the lead product [EML-0033].
5. **Button again**.
6. **Offer terms block**: code or automatic, dates and time zone, exclusions, one per customer, stacking, returns on sale items. Same numbers as step 1.

Body copy under about 120 words plus the terms block (practitioner default, test it). One ask, one main destination. Open with the offer or a promise, not pain [LPG-0045]. Cut AI tells such as "it's not X, it's Y" [MCR-0016].

### 5. Write three subject lines and a preview

- One plain offer subject ("20% off the linen range until Sunday").
- One reason or story subject.
- One product subject.

Each under about 45 characters (practitioner default for mobile). Preview text adds the end date or what is included. For more options, use `write-subject-lines-and-preview-text`.

### 6. Write the text version

- **SMS:** under 160 characters, no emoji, brand name first, offer, end, link, opt-out [EML-0024]. SMS campaigns about once a week at most, in late morning or late afternoon [EML-0025].

```
[Brand]: [offer] on [what] until [day, time]. Shop: [link] Reply STOP to opt out
```

- **US:** only to SMS opt-ins, 8 a.m. to 9 p.m. recipient time [EML-6345].
- **UK and EU:** texts go only to people who gave consent (or past buyers under the UK soft opt-in), with the sender named and a free way to opt out. Where buyers use WhatsApp, a WhatsApp marketing template is often the better channel; write it with `write-sms-and-whatsapp-messages`.

### 7. Run the checks

- **Numbers:** every price, percent, date and "up to" figure matches the offer sentence and the live store.
- **Urgency:** no "last chance" unless it is; no countdown that resets; no stock claims without stock data. Advertising rules in the US, UK, EU and other markets treat false urgency as misleading [ADC-6147].
- **Spam and law:** no misleading subject or fake "Re:", visible unsubscribe [EML-6340]; US postal address and ad identification [EML-6341]; no all-caps words or strings of exclamation marks; no link shorteners.
- **Mobile:** headline and button visible without scrolling on a phone; images have alt text.

### 8. Plan the read

Judge on placed orders, revenue per recipient and gross profit, plus unsubscribes and spam complaints, two days after send. A campaign split is done by hand 50/50 and judged on revenue [EML-0061]. Log the result for `email-copy-from-store-history`.

## Checks before you hand it over

- Gross profit after the offer is above zero and shown.
- The offer sentence, subject, headline, terms block and text version carry identical numbers and end time.
- Any "was" price has price history behind it, or is removed.
- Featured stock covers expected sales.
- Segment, send time and this week's send count are stated.
- Text version is under 160 characters (SMS) or within template limits, with opt-out where required.
- Law and spam checks passed for each market the store sends to.
- Nothing scheduled or sent without the client's yes.

## Output

1. **One-screen summary:** offer sentence, reason, segment and send time, gross profit after offer, recommended subject.
2. **The email in full:**

```
Segment: [engaged 90 days]   Send: [date, time, zone]
Subject 1 (recommended): [...]  ([characters])
Subject 2: [...]   Subject 3: [...]
Preview: [...]
Headline: [offer + end]          Button: [Shop the sale] -> [URL with UTM]
Why now: [...]
Products: [name / offer price / one line] x 1 to 3
Proof: "[exact review]" [first name, date, source]
Button: [...]
Offer terms: [code or automatic]; [dates, time, zone]; [exclusions]; [limits]
Footer: [postal address], [unsubscribe]
```

3. **Text version:** channel, exact text, character count, template id where the channel needs one (WhatsApp, or SMS where carriers require registered templates).
4. **Check table:** Line, Claim, Source, Status.

## Common mistakes

- **Terms that differ across email, banner and checkout.** Step 1 fixes one offer sentence.
- **"Was" prices nobody paid.** Gate 3 checks price history.
- **Selling the deal, not the product.** Step 4 gives each product its reason.
- **Extra sends on top of a full week.** Step 3 swaps instead of adds.
- **Subscribers cancelling for the public deal.** Gate 5 excludes or rewards them.

## Sources

- ADC-6147: false urgency is misleading (proposed).
- EML-0001, OFF-0043: protect active subscribers during sales.
- EML-0024, EML-0025: SMS length and campaign cadence.
- EML-0033: reviews that answer one doubt.
- EML-0041: campaigns per week by revenue band.
- EML-0055: a true reason to buy now.
- EML-0059: inbox health floor.
- EML-0061: campaign split judged on revenue.
- EML-6340, EML-6341: Gmail sender rules and CAN-SPAM (proposed).
- EML-6345: US text rules (proposed).
- LPG-0045, MCR-0016: opening line and AI tells.
- OFF-0017: show the bigger saving number.
- OFF-0065: discount and break-even.
- OFF-6145: genuine former prices (proposed).

What makes this skill ours: nothing is written until the offer clears gross profit, stock and price history; one offer sentence locks every number across email, terms and text; the email replaces a weaker send instead of piling on; and the text version follows the real US, UK and EU sending rules.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. The SMS must match a DLT-registered promotional template on a -P header, with a whitelisted full link [EML-6344]; register it days before. A WhatsApp marketing template is often the better channel. Indian advertising rules (ASCI) treat false urgency as misleading [ADC-6147].
- EML-6344: India SMS templates (proposed).
