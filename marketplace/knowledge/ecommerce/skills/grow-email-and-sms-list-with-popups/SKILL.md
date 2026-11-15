---
name: grow-email-and-sms-list-with-popups
description: "A sign-up popup plan that grows the email and SMS (or WhatsApp) list without giving away margin or slowing the site: the offer chosen by gross profit per new subscriber, the trigger and page rules for desktop and mobile, a two-step form (email, then phone), every line of copy with the consent wording, a speed check before and after, and a form test sized to traffic. Covers unique codes, subscription stores, phone-first forms and WhatsApp opt-in where buyers prefer chat, SMS sender registration where a country needs it, and consent rules in the US, UK, EU and Canada. Use when the sign-up rate is low, when the popup fires on load and covers the page, or before changing the welcome offer."
---

# Grow the email and SMS list with popups

**You get:** a ready-to-build popup spec (offer, triggers, page rules, both form steps with every line of copy and consent text, success screen), the offer cost per subscriber in gross profit, a before-and-after speed check, and a test plan sized to the store's traffic.

## When to use

- Popup sign-up is under 3% of visitors, or nobody knows the number.
- The popup fires the moment the page loads and covers the product on phones.
- The welcome offer is a 10% code chosen years ago and nobody has checked what it costs.
- The store wants to collect phone numbers for SMS or WhatsApp.

## Not for

- The welcome emails after sign-up: use `write-welcome-series`.
- The full set of automated flows: use `email-sms-flow-plan`.
- SMS and WhatsApp consent records and sender registration in detail: use `sms-and-whatsapp-compliance-setup`.
- General site speed work: use `shopify-speed-audit-and-fix-list`.

## What you need

Required (read access, level 1):

1. **Current form report** from the email tool, last 90 days: views, submits, submit rate per form and step, device split.
2. **Welcome flow results**: share of sign-ups who place an order within 30 days, and the code redemption rate.
3. **Gross profit per first order** and the store's average order value (`build-sku-profit-sheet`).
4. **Sessions by device and landing page**, from Shopify Analytics or GA4.

Optional: current mobile speed scores (PageSpeed Insights, free), list of installed apps that load scripts, subscription offer if the store sells one.

If the welcome results are missing, plan the offer cost from the redemption rate of any past code. Building the form needs draft access (level 2); publishing it needs the client's yes.

## Before you start: the gates

1. **Offer cost known.** Pass when gross profit per first order is known. Fail: use a non-discount offer (early access, a guide, free shipping on first order only if shipping cost is known) until it is.
2. **Consent set up.** SMS needs recorded consent with disclosure; WhatsApp needs an opt-in that names the business [EML-6320]. In the UK and EU, marketing email and SMS need opt-in consent with an unticked box; Canada's anti-spam law needs express consent too. Some countries need the SMS sender name and templates registered before any send; check your SMS provider's rules for each country. Fail: collect email only for now.
3. **Speed budget.** Stores with fewer third-party services score far better on mobile [SPD-0001]. If the form tool adds a new script, another must go or the form must load late.
4. **Code leakage.** Single shared codes end up on coupon sites. Pass when the tool can issue unique, single-use codes.

## Steps

### 1. Choose the offer by gross profit per subscriber

Cost per subscriber = share who buy within 30 days x (discount value per order) plus any gift cost. Value per subscriber = share who buy x gross profit per first order after the discount. The offer must leave value above cost.

- **Size:** sign-up incentives under 10% rarely work [EML-0047]. One well-known apparel brand's welcome test found moving from 10% to 20% off gave a large lift, while 20% to 30% added nothing [EML-0058]. Test the step up, then stop where gains flatten.
- **Money or percent:** above about 100 order value a money-off amount tends to win; below it, percent reads bigger [OFF-0026].
- **Framing:** the same 10% shown as a hidden "mystery" reward roughly doubled opt-in in one case [OFF-0036]; a "credit" framing beat "free gift" on a high-order-value store [OFF-0028].
- **Subscription stores:** make the popup offer the subscription offer, or a 10% one-time code will undercut it [OFF-0037].
- **No discount option:** early access, a buying guide, or a quiz result, for brands that do not discount.

### 2. Set triggers and page rules

| Setting | Rule |
|---|---|
| Desktop trigger | Whichever comes first: about 6 seconds, 60% scroll, or exit intent [EML-0040] |
| Mobile trigger | Not in the first 3 to 5 seconds [LPG-0022]; 6 to 10 seconds or 50% scroll, as a bottom sheet or teaser tab that leaves the product visible [EML-0026] |
| Never show on | Cart, checkout, account, policy pages, and to existing subscribers or customers |
| Frequency | Once per visitor per 14 days after a close (practitioner default, test it) |
| Close button | Clear and easy to tap on phones |

Google's page experience guidance asks whether pages avoid intrusive interstitials, so on mobile, keep the popup from covering the main content on first entry from search. A teaser tab that opens the form on tap is the safe default for search traffic.

### 3. Build the two steps

- **Step 1, email:** one field. Headline under 10 words [EML-0020]. Optional yes or no first click ("Want 15% off your first order?") as a small commitment step [EML-0065].
- **Step 2, phone:** ask right after email submit, with the same offer: "Finish signing up with text to unlock your code", not a smaller extra SMS discount [EML-0027] [EML-0038]. Skip button visible.
- **Success screen:** show the code (or say it is in the inbox), and one link to bestsellers.

### 4. Write the consent text

- **US SMS:** put the disclosure above the phone submit button; consent can never be a condition of purchase, and US carriers require double opt-in for cart abandonment texts [EML-6327]. Use the SMS provider's required disclosure (brand name, message frequency, rates may apply, reply STOP to opt out, HELP for help, links to terms and privacy).
- **Chat-first markets:** where buyers live on WhatsApp (much of Latin America, Europe, the Middle East and Asia), phone first is often better than email (practitioner default, test it). Add a separate unticked box: "Send me offers and updates from [store] on WhatsApp." Send SMS promotions only through sender names and templates registered where the country requires it.
- **Email:** say what they will get and how often in one line; link the privacy policy.

### 5. Check speed before and after

Run PageSpeed Insights (free) on the home page and top product page on mobile before and after the form goes live. Load the form script after the main content; remove any old popup app and search the theme for its leftover code [SPD-0009]. Watch layout shift: an injected bar or teaser can push content down [SPD-0007]. If the mobile score drops by more than a few points, fix the loading before testing anything else.

### 6. Test one thing at a time

Each form variant needs about 3,000 to 5,000 impressions over 15 days [EML-0061]. Test in this order: offer size or framing, trigger timing, then copy. Judge on subscribers who buy within 30 days per 1,000 visitors, not sign-up rate alone; a richer offer can raise sign-ups and lower profit. Stores under about 3,000 popup views a fortnight should ship the spec and track before and after instead of testing.

### 7. Set the targets

Most sign-up forms capture 1 to 3% of visitors; well-set forms aim for 8 to 12% [EML-0065] [EML-0040]. Set the store's target as its current rate plus a realistic step, and track: sign-up rate by device, phone capture rate on step 2, 30-day buyer rate of new subscribers, code redemption, and unsubscribes in the first 30 days. SMS sign-ups can buy fast, so treat the popup as part of acquisition, owned with paid media [EML-0034].

## Checks before you hand it over

- The offer cost per subscriber is below value per subscriber, in gross profit.
- Codes are unique and single-use.
- Mobile trigger waits at least 3 to 5 seconds and leaves the product visible.
- The form never shows on cart, checkout or to existing subscribers.
- Consent text sits above the phone button, with nothing pre-ticked.
- SMS sender registration is done where the country requires it; WhatsApp opt-in names the store.
- Mobile speed checked before and after, with old popup code removed.
- The test plan matches the store's traffic.
- Nothing was published without a client yes.

## Output

1. **One-screen summary:** the offer, the expected sign-up rate range, cost and value per subscriber in gross profit, the speed result, and the first test.
2. **Popup spec:** Setting, Desktop, Mobile, for triggers, pages, frequency and style.
3. **Copy sheet:** Step, Headline, Body, Button, Skip text, Consent text, Success text.
4. **Offer model:** Offer, Expected buyer share, Discount cost per subscriber, Gross profit per subscriber, Net.
5. **Speed log:** Page, Device, Score before, Score after, Script removed or added.
6. **Test plan:** Variant, What changes, Impressions needed, Days, Decision metric.

## Common mistakes

- **Popup on page load on phones.** Step 2 waits and keeps the product visible.
- **A 10% code nobody priced.** Step 1 prices it in gross profit.
- **An extra SMS-only discount.** Step 3 uses the same offer for both steps.
- **Pre-ticked consent or consent tied to purchase.** Step 4 forbids both.
- **One more script on a slow store.** Step 5 removes old code first.
- **Judging on sign-up rate.** Step 6 judges on buyers per 1,000 visitors.

## Sources

- EML-0020, EML-0026, EML-0027, EML-0038, EML-0040, EML-0065: popup triggers, steps and rates.
- LPG-0022: no popups in the first 3 to 5 seconds.
- EML-0047, EML-0058, OFF-0026, OFF-0028, OFF-0036, OFF-0037: offer size and framing.
- EML-0061: form test size.
- EML-0034: SMS sign-ups as acquisition.
- EML-6320, EML-6327: WhatsApp opt-in, SMS consent.
- SPD-0001, SPD-0007, SPD-0009: scripts, layout shift and leftover app code.

What makes this skill ours: the offer is chosen by gross profit per subscriber rather than sign-up rate; mobile triggers protect both the product view and search ranking; speed is measured before and after with old popup code removed; and chat-first markets get a phone-first form with a WhatsApp opt-in and a sender registration check.

## Selling in India

- SMS needs a DLT-registered header and templates before any send [EML-6324].
- Phone first is often better than email for Indian shoppers (practitioner default, test it), with a separate unticked WhatsApp opt-in box.

Source: EML-6324 (India DLT registration for SMS).
