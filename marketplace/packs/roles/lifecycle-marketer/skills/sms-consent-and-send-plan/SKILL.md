---
name: sms-consent-and-send-plan
description: Sets up or checks a shop's text message programme. Checks the opt-in wording and consent records for the US (TCPA and carrier rules), UK (PECR) and EU (GDPR and national rules), writes the first text and the stop and help replies, sets quiet hours and frequency caps by recipient location, decides which flows and events earn a text, and writes each text with its character count. Use before a shop starts texting, before a sale with texts, or when opt-outs, complaints or carrier filtering rise. General guidance, not legal advice.
---

# SMS consent and send plan

A text lands on a phone in someone's pocket. That makes it the strongest retention channel and the easiest one to get wrong. This skill gets the consent right first, then decides what deserves a text, then writes it.

This is general guidance, not legal advice. For anything that turns on what the law requires, the client checks with a qualified adviser.

## When to use

- A shop is about to start texting customers, or switch SMS platforms.
- A sale, launch or cart flow will include texts.
- Opt-outs, complaints or carrier filtering have gone up.
- The client asks "how often can we text?"

## What you need

- **Where people opt in:** every form, pop-up, checkout box and keyword, with the exact wording and checkbox settings pasted or screenshotted.
- **Where consent is stored:** the platform's consent field, date, source and wording version for each number.
- **Countries and US states** the texted customers are in.
- **Platform and number type:** for example Klaviyo or Postscript; US 10-digit long code, toll-free or short code; UK or EU branded sender ID or number.
- **What the shop wants to text:** flows (welcome, cart, reorder, shipping) and campaigns (launches, sales), with dates.
- **Facts for the copy:** offers, prices, dates and stock, confirmed by the client.

**Access:** level 1 to read forms, consent fields and reports; level 2 to build texts and flows switched off and send tests to internal numbers; level 3 to switch on flows and send approved texts, within the limits and send list the client confirmed. Texts cannot be called back, so the level 3 send list names each text, segment, count and send time.

## Steps

1. **Map consent by channel.** Email consent is not text consent; each needs its own clear yes. List every opt-in point and mark for each: separate SMS checkbox or button (not pre-ticked), what people are told they will get, how often, that consent is not a condition of purchase, how to stop, and links to terms and privacy. Flag any single box that signs people up to both email and texts.
2. **Check by region.**
   - *US:* automated marketing texts need prior express written consent: a written agreement (e-signature allowed) naming the number, with a clear disclosure, not a condition of purchase. Carriers require double opt-in before cart reminder texts and wording that mentions cart reminders. The sender must register its brand and campaign for 10-digit long code texting.
   - *UK:* marketing texts need permission, except the soft opt-in for existing customers buying similar goods (with a chance to opt out at collection and in every text). Every text names the sender and offers a way to stop.
   - *EU:* prior opt-in that is freely given, specific, informed and unambiguous; pre-ticked boxes and silence do not count. National rules differ (France, for example, accepts the customer exception only after a real sale for similar products). Check the country's regulator page.
3. **Fix the records.** For each number, the platform should hold the date, the source (form name or keyword), the wording version shown and, for double opt-in, the confirmation. Numbers with no record do not get marketing texts until they opt in again.
4. **Set up the replies.** First text after opt-in: the business name, what they signed up for, roughly how often, that message and data rates may apply (US), and how to stop and get help. Make sure STOP and the other common words (QUIT, END, CANCEL, UNSUBSCRIBE, REVOKE, OPT OUT) remove consent, plus local words in each EU language you text in. Check that "please stop" or "remove me" sent as a reply, or an opt-out by email or phone, also removes consent within the legal window. One confirmation text after an opt-out, with no marketing.
5. **Set hours and caps in the platform.** Send only inside the recipient's local allowed hours (US federal rule: 8 a.m. to 9 p.m. for solicitations; some states and countries are stricter; France excludes Sundays and public holidays). Base the time zone on the recipient, not the shop. Add a cap so no one in Florida, Oklahoma, Oregon or Maryland gets more than three promotional texts in 24 hours across campaigns and flows.
6. **Decide what earns a text.** Use texts where timing matters to the customer: a cart they just left (US: once, within 48 hours, double opt-in only), a reorder just before they run out, a shipping update, a genuine launch or sale for people who asked for offers. Leave stories, guides and newsletters to email. Write down the planned number of texts per person per month and tell subscribers at sign-up.
7. **Write each text.** Business name first. One idea, one link. Count characters, because long texts split and cost more. No fake deadlines, no "only 3 left" unless true on the send day. The offer, price and date come from the client.
8. **Plan the test and the read.** Main metric (orders or reorders), guardrails (opt-out rate per send, complaints, carrier filtering), and a holdout for flows where the list is big enough.
9. **Write the level 3 send list** if the client grants it: each text, segment, count, send time in recipients' time zones, and the caps in force.

## Checks

- SMS consent is separate from email at every opt-in point, never pre-ticked, never required to buy.
- Every number texted has a stored consent record; numbers without one are excluded.
- The first text, stop and help replies, and local-language keywords are set up and tested on an internal number.
- Quiet hours and frequency caps are set in the platform by recipient location.
- US cart texts: double opt-in, one text, within 48 hours.
- Every text names the business and contains only facts the client confirmed.
- The client has been told this is general guidance and to check the law with a qualified adviser.

## Output format

1. **Consent map:** each opt-in point, what it says, pass or fix per region, and the rewritten wording.
2. **Records check:** what is stored per number and what is missing.
3. **Reply set-up:** first text, stop, help, confirmation, keywords.
4. **Hours and caps:** settings by region and where to set them.
5. **Text plan:** which flows and campaigns text, how often, and why.
6. **Text copy:** each text with character count and send window.
7. **Measures and the level 3 send list**, if granted.

## Example of good output (short)

*Illustrative structure, not a real business: a Shopify store selling dog treats, with customers in the US and UK. Copy the shape, never the content: every fact comes from the client's own context.*

**Consent map (checkout box):** "Send me offers by email and text" in one pre-ticked box. **Fix:** split into two unticked boxes. SMS wording: "Text me [Business] offers and reorder reminders, up to 6 a month. Consent isn't required to buy. Msg and data rates may apply. Reply STOP to stop, HELP for help. Terms and privacy: [links]." UK customers get the same box; the soft opt-in is not used for texts.

**First text (US):** "[Business]: you're in for treat reminders and offers, up to 6 msgs a month. Msg and data rates may apply. Reply HELP for help, STOP to stop." (130 characters plus the brand name)

**Hours and caps:** US: 10 a.m. to 8 p.m. recipient time, state-level hours on; cap of 3 promotional texts per 24 hours for all US numbers (simpler than per state). UK: 10 a.m. to 8 p.m., no Sundays.

**Text plan:** reorder text on day 24 for 1 kg bags; cart text once within 2 hours for double opt-in US subscribers only; launch texts for the two new flavours in March. No newsletter by text.

**Confirm:** bag life at typical feeding; launch dates; whether any code is offered.
