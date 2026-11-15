---
name: sms-and-whatsapp-compliance-setup
description: "A compliance register and setup checklist for a store's SMS and WhatsApp marketing in every market it texts (US, UK, EU, Canada, Australia and others): consent wording and the fields to record for each opt-in, sender registration (toll-free verification, 10DLC or short code in the US; sender ID and number rules elsewhere), quiet hours, opt-out keywords and same-day removal, frequency disclosure, and a monthly audit. Built from the US FCC rules under the TCPA, the UK and EU consent rules (PECR, GDPR and ePrivacy), Canada's CASL, Australia's Spam Act, Meta's WhatsApp opt-in rules and Klaviyo's consent guide, with no legal rulings: it lists what to confirm with a lawyer. Use before the first SMS or WhatsApp marketing send, when moving SMS providers, when adding a country, or after a complaint or carrier block."
---

# SMS and WhatsApp compliance

**You get:** a compliance register per market and channel (consent wording, what is recorded, sender registration status, template status, quiet hours, opt-out handling, frequency disclosure), a setup checklist with owners and dates, and a monthly audit sheet, plus a short "confirm with a lawyer" list.

## When to use

- The store is about to send its first marketing SMS or WhatsApp message.
- The store is moving SMS or WhatsApp providers, or adding a new country as a market.
- A customer complained, a carrier blocked messages, or sender or template registrations keep failing.
- Once a year, as a check that consent records still hold up.

## Not for

- Building WhatsApp templates, catalog and broadcast rules: use `set-up-whatsapp-marketing`.
- Popup design and offer: use `grow-email-and-sms-list-with-popups`.
- Writing message copy within length and template rules: use `write-sms-and-whatsapp-messages`.
- Legal advice: this skill lists general practice and official rules; a lawyer confirms the store's position.

## What you need

Required (read access, level 1):

1. **Markets** the store texts: the US (which states), the UK, EU countries, Canada, Australia, others.
2. **Every place consent is collected**: popup, checkout, account page, chat, ads, in store. Screenshots of each with the wording as live today.
3. **Current subscriber export** from each tool with consent fields: phone, channel, consent time, source, wording or form ID, double opt-in status.
4. **Sender setup**: SMS provider, sending number type per country (toll-free, 10DLC, short code, alphanumeric sender ID, long number), and any registration IDs.
5. **The store's SMS terms and privacy policy URLs.**

Optional: past complaints, carrier error reports, opt-out logs.

If the store cannot show where a subscriber's consent came from, that subscriber is treated as not consented for marketing. Editing forms and settings needs draft access (level 2); turning on sends needs the client's yes.

## Before you start: the gates

1. **Consent proof.** Pass when each marketing subscriber has a recorded time, source and wording. Fail: suppress them from marketing and run a re-permission ask by email.
2. **Sender registered.** Pass when the sending number or sender ID is verified or registered for its type in every country texted (for example US toll-free verification or 10DLC registration; sender ID registration where a country requires it). Fail: no marketing sends to that country.
3. **Opt-out works end to end.** Pass when a test STOP reply removes the test number within the same day in every tool that can message it.
4. **Owner named.** One person owns the register and the monthly audit.

## Steps

### 1. Map every consent point

For each capture point, record: channel, market, wording shown, whether the box is pre-ticked (it must not be), and where the record lands. Consent for SMS can never be a condition of buying, and optional consent must not look required [EML-6327]. In the UK and EU, consent must be freely given, specific and as easy to withdraw as to give.

### 2. Write the consent wording

**US SMS** (disclosure above the phone submit button [EML-6327]). Include what the SMS provider requires; most ask for: the brand name, that messages are recurring automated marketing texts, message frequency (for example "up to 6 a month"), "Msg and data rates may apply", "Reply STOP to cancel, HELP for help", that consent is not a condition of purchase, and links to SMS terms and privacy.

**UK and EU SMS:** a separate, unticked opt-in that names the store and the purpose (marketing texts), says how to stop, and links to the privacy notice. The UK's PECR rules allow a "soft opt-in" for existing customers buying similar products only if they were given a clear chance to refuse at the time and in every message; confirm with a lawyer before relying on it. EU rules vary by country.

**Canada SMS:** CASL needs express consent with the purpose, the store's name and contact details, and a statement that the person can withdraw at any time.

**Australia SMS:** the Spam Act needs consent, the store identified in every message, and a working unsubscribe.

**Other markets:** follow the local rule; the store's name, the purpose and how to stop are the common core everywhere.

**WhatsApp (any market):** the opt-in must name the business and say the person is opting in to its messages, and must follow local law [EML-6320].

### 3. Record each consent

Fields: phone (with country code), channel, market, consent time, capture point, wording version, IP or device if available, double opt-in time (where used), and later: opt-out time and method. Keep records for as long as the store messages the person and a period after (confirm the period with a lawyer). Under GDPR, the record is also the proof of the lawful basis, so keep it exportable.

### 4. Register senders

**US SMS:** the sending number type sets the process. Toll-free numbers need verification (business details, privacy policy, mobile terms), which typically takes 2 to 5 business days on Klaviyo; short codes need an application and approval that takes several weeks; 10DLC long codes need brand and campaign registration through the provider. Do not send until the number shows as active.

**Other countries:** check the provider's country guide for each market. Common patterns: an alphanumeric sender ID (the store's name) is allowed in the UK, much of the EU and Australia, but cannot receive replies, so the STOP route must be a number or link; some countries require sender ID or template pre-registration before any send; Canada treats long codes and short codes much like the US. Register before the first send.

**Template rules:** where a country or provider requires registered message templates, keep order updates on transactional or service templates with no offer inside, and offers on promotional templates. Templates must match the sent text exactly, or messages fail.

### 5. Set quiet hours

- **US:** FCC rules bar telephone solicitation before 8 a.m. or after 9 p.m. at the recipient's local time [EML-6323]. Some states set narrower windows; set the tool's quiet hours by recipient time zone to the narrowest window among the states the store texts (practitioner default: 10 a.m. to 8 p.m. local, test it).
- **Other markets:** some countries set legal sending windows or ban marketing texts on Sundays and public holidays; check each one. Practitioner default everywhere: send marketing between 10 a.m. and 8 p.m. in the recipient's local time. Order updates may go at any hour they are needed.
- **WhatsApp:** daytime only for marketing broadcasts.

### 6. Handle opt-outs

- **Keywords:** STOP, UNSUBSCRIBE, CANCEL, END, QUIT, plus plain words like "no more" or "stop texting me", and the same words in the languages your buyers use. US rules let people revoke consent by any reasonable means, honoured within ten business days at most [EML-6323]; aim for the same day everywhere.
- **WhatsApp:** every request to stop, made on or off WhatsApp, must be honoured [EML-6320]. Add a "Stop offers" quick reply to marketing templates.
- **Sync:** an opt-out in one tool must reach every tool that can message the person (SMS provider, WhatsApp provider, helpdesk).
- **Confirmation:** one final message confirming the opt-out, then nothing.

### 7. Frequency and content rules

- Send no more than the frequency stated at sign-up.
- US cart abandonment texts need double opt-in [EML-6327]; Klaviyo limits abandonment texts to within 48 hours in the US [EML-0029].
- No offers in WhatsApp utility templates [OPS-6286] or in transactional SMS templates.
- Identify the store in every marketing message, with an opt-out in every message where the market requires it (UK, EU, Canada, Australia).

### 8. Run a monthly audit

Sample 20 recent subscribers: each has a consent record with time, source and wording. Send a test STOP from a staff phone to each tool. Check template failure rates, number and sender ID status per country, WhatsApp quality rating, complaint count and opt-out rate per send.

### 9. Confirm with a lawyer

List for the client: state rules for the US states texted, record retention period, whether existing customers' numbers collected at checkout cover marketing (soft opt-in in the UK, implied consent rules in Canada), and the data protection law of each market texted (GDPR in the EU, UK GDPR, state privacy laws in the US, PIPEDA in Canada, the Privacy Act in Australia).

## Checks before you hand it over

- Every consent point is mapped, with wording and no pre-ticked boxes.
- Consent records hold time, source and wording; unproven subscribers are suppressed.
- Every country texted has a registered or verified sender, or no SMS goes out there.
- The US number type is verified or registered and active.
- Quiet hours are set per recipient time zone.
- A test STOP removes the number from every tool the same day.
- No offer sits in a utility or transactional template.
- The lawyer list is written; no legal ruling is given.

## Output

1. **One-screen summary:** status per market and channel (ready, blocked, fix needed), the three fixes to make first, and the lawyer list.
2. **Compliance register:** Market, Channel, Capture point, Wording version, Pre-ticked (no), Records kept, Sender registration, Template status, Quiet hours, Opt-out method, Frequency stated, Owner, Last checked.
3. **Setup checklist:** Step, Owner, Due, Status.
4. **Monthly audit sheet:** Month, Sample checked, Records missing, STOP test result, Template failures, Number status, Complaints, Action.

## Common mistakes

- **Texting everyone who gave a number at checkout.** Gate 1 needs marketing consent proof.
- **Offers in order-update templates.** Step 7 keeps them out.
- **Registered template text drifting from what is sent.** Step 4 requires an exact match.
- **Sending before the number or sender ID is active.** Step 4 waits.
- **One country's rules used for all.** Step 2 writes wording per market.
- **Opt-outs stuck in one tool.** Step 6 syncs every tool.
- **Treating this as legal advice.** Step 9 lists what a lawyer confirms.

## Sources

- EML-6323: US FCC consent, 8 a.m. to 9 p.m. window, revocation within 10 business days.
- EML-6327: SMS disclosure placement, no purchase condition, US double opt-in for abandonment.
- EML-6320: WhatsApp opt-in requirements.
- OPS-6286: no offers in WhatsApp utility templates.
- EML-0029: Klaviyo's 48-hour US abandonment text limit.
- EML-6324: a national sender, template and consent registration scheme (see the last section).

What makes this skill ours: one register covers each market's sender registration and consent rules and WhatsApp opt-in side by side; every subscriber without a consent record is suppressed rather than guessed; a monthly STOP test proves opt-outs reach every tool; and the skill names what a lawyer must confirm instead of giving rulings.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. India SMS runs under TRAI's TCCCPR 2018 [EML-6324]: register the business as a principal entity on one operator's DLT portal (Jio, Airtel, Vi or BSNL), then the header (sender ID), every content template and the consent template, and give the provider the IDs. Promotional templates are fixed text; transactional and service templates have a fixed part with variables. The consent template must state the purpose and the sender. WhatsApp is not covered by DLT. Customers can block commercial messages by time band; practitioner default is 10 a.m. to 8 p.m. IST. Check DLT failure rates monthly, and ask the lawyer about the DPDP rules.
