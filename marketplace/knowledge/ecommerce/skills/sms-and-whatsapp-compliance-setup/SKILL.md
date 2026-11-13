---
name: sms-and-whatsapp-compliance-setup
description: "A compliance register and setup checklist for a store's SMS and WhatsApp marketing in India and the US: consent wording and the fields to record for each opt-in, sender registration (DLT entity, header and templates in India; toll-free verification, 10DLC or short code in the US), quiet hours, opt-out keywords and same-day removal, frequency disclosure, and a monthly audit. Built from TRAI's TCCCPR 2018, the US FCC rules under the TCPA, Meta's WhatsApp opt-in rules and Klaviyo's consent guide, with no legal rulings: it lists what to confirm with a lawyer. Use before the first SMS or WhatsApp marketing send, when moving SMS providers, or after a complaint or carrier block."
---

# SMS and WhatsApp compliance

**You get:** a compliance register per market and channel (consent wording, what is recorded, sender registration status, template status, quiet hours, opt-out handling, frequency disclosure), a setup checklist with owners and dates, and a monthly audit sheet, plus a short "confirm with a lawyer" list.

## When to use

- The store is about to send its first marketing SMS or WhatsApp message.
- The store is moving SMS or WhatsApp providers, or adding India or the US as a market.
- A customer complained, a carrier blocked messages, or DLT templates keep failing.
- Once a year, as a check that consent records still hold up.

## Not for

- Building WhatsApp templates, catalog and broadcast rules: use `set-up-whatsapp-marketing`.
- Popup design and offer: use `grow-email-and-sms-list-with-popups`.
- Writing message copy within length and template rules: use `write-sms-and-whatsapp-messages`.
- Legal advice: this skill lists general practice and official rules; a lawyer confirms the store's position.

## What you need

Required (read access, level 1):

1. **Markets** the store texts: India, the US (which states), others.
2. **Every place consent is collected**: popup, checkout, account page, chat, ads, in store. Screenshots of each with the wording as live today.
3. **Current subscriber export** from each tool with consent fields: phone, channel, consent time, source, wording or form ID, double opt-in status.
4. **Sender setup**: SMS provider, sending number type, India DLT entity ID, headers and template list if any.
5. **The store's SMS terms and privacy policy URLs.**

Optional: past complaints, carrier error reports, opt-out logs.

If the store cannot show where a subscriber's consent came from, that subscriber is treated as not consented for marketing. Editing forms and settings needs draft access (level 2); turning on sends needs the client's yes.

## Before you start: the gates

1. **Consent proof.** Pass when each marketing subscriber has a recorded time, source and wording. Fail: suppress them from marketing and run a re-permission ask by email.
2. **Sender registered.** India SMS: pass when the business entity, header and every template are registered on an operator's DLT platform [EML-6324]. US: pass when the sending number is verified or registered for its type. Fail: no marketing sends.
3. **Opt-out works end to end.** Pass when a test STOP reply removes the test number within the same day in every tool that can message it.
4. **Owner named.** One person owns the register and the monthly audit.

## Steps

### 1. Map every consent point

For each capture point, record: channel, market, wording shown, whether the box is pre-ticked (it must not be), and where the record lands. Consent for SMS can never be a condition of buying, and optional consent must not look required [EML-6327].

### 2. Write the consent wording

**US SMS** (disclosure above the phone submit button [EML-6327]). Include what the SMS provider requires; most ask for: the brand name, that messages are recurring automated marketing texts, message frequency (for example "up to 6 a month"), "Msg and data rates may apply", "Reply STOP to cancel, HELP for help", that consent is not a condition of purchase, and links to SMS terms and privacy.

**India SMS:** the consent wording names the store and the purpose. Under TRAI's rules, a consent template must state the purpose of consent and the sender, and commercial messages go only per registered consent or preferences [EML-6324].

**WhatsApp (any market):** the opt-in must name the business and say the person is opting in to its messages, and must follow local law [EML-6320].

### 3. Record each consent

Fields: phone (with country code), channel, market, consent time, capture point, wording version, IP or device if available, double opt-in time (US), and later: opt-out time and method. Keep records for as long as the store messages the person and a period after (confirm the period with a lawyer).

### 4. Register senders

**India SMS (DLT):**

1. Register the business as a principal entity on one operator's DLT portal (Jio, Airtel, Vi or BSNL); one registration works across operators.
2. Register the header (sender ID) the store will show.
3. Register every content template. Promotional templates are fixed text; transactional and service templates have a fixed part with variables such as order number and date [EML-6324]. Templates must match the sent text exactly, or messages fail.
4. Register the consent template.
5. Give the SMS provider the entity ID, header and template IDs.

Keep order updates on service or transactional templates with no offer inside, and offers on promotional templates. WhatsApp is not covered by DLT.

**US SMS:** the sending number type sets the process. Toll-free numbers need verification (business details, privacy policy, mobile terms), which typically takes 2 to 5 business days on Klaviyo; short codes need an application and approval that takes several weeks; 10DLC long codes need brand and campaign registration through the provider. Do not send until the number shows as active.

### 5. Set quiet hours

- **US:** FCC rules bar telephone solicitation before 8 a.m. or after 9 p.m. at the recipient's local time [EML-6323]. Some states set narrower windows; set the tool's quiet hours by recipient time zone to the narrowest window among the states the store texts (practitioner default: 10 a.m. to 8 p.m. local, test it).
- **India:** customers can block commercial messages by time band and day through their operator [EML-6324]. Practitioner default: send marketing between 10 a.m. and 8 p.m. IST. Order updates may go at any hour they are needed.
- **WhatsApp:** daytime only for marketing broadcasts.

### 6. Handle opt-outs

- **Keywords:** STOP, UNSUBSCRIBE, CANCEL, END, QUIT, plus plain words like "no more" or "stop texting me". US rules let people revoke consent by any reasonable means, honoured within ten business days at most [EML-6323]; aim for the same day.
- **WhatsApp:** every request to stop, made on or off WhatsApp, must be honoured [EML-6320]. Add a "Stop offers" quick reply to marketing templates.
- **Sync:** an opt-out in one tool must reach every tool that can message the person (SMS provider, WhatsApp provider, helpdesk).
- **Confirmation:** one final message confirming the opt-out, then nothing.

### 7. Frequency and content rules

- Send no more than the frequency stated at sign-up.
- US cart abandonment texts need double opt-in [EML-6327]; Klaviyo limits abandonment texts to within 48 hours in the US [EML-0029].
- No offers in WhatsApp utility templates [OPS-6286] or Indian transactional templates.
- Identify the store in every marketing message.

### 8. Run a monthly audit

Sample 20 recent subscribers: each has a consent record with time, source and wording. Send a test STOP from a staff phone to each tool. Check DLT template failure rates, US number status, WhatsApp quality rating, complaint count and opt-out rate per send.

### 9. Confirm with a lawyer

List for the client: state rules for the US states texted, record retention period, whether existing customers' numbers collected at checkout cover marketing, and India's Digital Personal Data Protection rules as they apply to the store.

## Checks before you hand it over

- Every consent point is mapped, with wording and no pre-ticked boxes.
- Consent records hold time, source and wording; unproven subscribers are suppressed.
- India DLT entity, header, content and consent templates are registered, or no India SMS goes out.
- The US number type is verified or registered and active.
- Quiet hours are set per recipient time zone.
- A test STOP removes the number from every tool the same day.
- No offer sits in a utility or transactional template.
- The lawyer list is written; no legal ruling is given.

## Output

1. **One-screen summary:** status per market and channel (ready, blocked, fix needed), the three fixes to make first, and the lawyer list.
2. **Compliance register:** Market, Channel, Capture point, Wording version, Pre-ticked (no), Records kept, Sender registration, Template status, Quiet hours, Opt-out method, Frequency stated, Owner, Last checked.
3. **Setup checklist:** Step, Owner, Due, Status.
4. **Monthly audit sheet:** Month, Sample checked, Records missing, STOP test result, DLT failures, Number status, Complaints, Action.

## Common mistakes

- **Texting everyone who gave a number at checkout.** Gate 1 needs marketing consent proof.
- **Offers in order-update templates.** Step 7 keeps them out.
- **DLT template text drifting from what is sent.** Step 4 requires an exact match.
- **Sending before the US number is active.** Step 4 waits.
- **Opt-outs stuck in one tool.** Step 6 syncs every tool.
- **Treating this as legal advice.** Step 9 lists what a lawyer confirms.

## Sources

- EML-6324: India TCCCPR 2018 headers, templates, consent and preferences.
- EML-6323: US FCC consent, 8 a.m. to 9 p.m. window, revocation within 10 business days.
- EML-6327: SMS disclosure placement, no purchase condition, US double opt-in for abandonment.
- EML-6320: WhatsApp opt-in requirements.
- OPS-6286: no offers in WhatsApp utility templates.
- EML-0029: Klaviyo's 48-hour US abandonment text limit.

What makes this skill ours: one register covers India DLT, US sender registration and WhatsApp opt-in side by side; every subscriber without a consent record is suppressed rather than guessed; a monthly STOP test proves opt-outs reach every tool; and the skill names what a lawyer must confirm instead of giving rulings.
