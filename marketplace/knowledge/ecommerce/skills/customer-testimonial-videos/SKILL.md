---
name: customer-testimonial-videos
description: "A system to collect real customer videos with written consent and turn them into ads: who to ask and when, the ask messages for email, WhatsApp and a box insert, a thank-you that never depends on what the customer says, a plain-language release form, a phone recording guide, eight non-leading questions, and an edit template that cuts each video into a 20 to 40 second ad without changing what the customer meant. Adds the on-screen disclosure, matches each testimonial to one buying objection, and keeps a rights log with expiry and removal on request. Follows the FTC endorsement guides and fake review rule in the US and consent and messaging rules in India. Use when the store has happy buyers but no video proof, or creator ads feel staged."
---

# Customer testimonial videos

**You get:** a working testimonial system: an ask list of customers, three ready ask messages (email, WhatsApp, box insert), a release form, a one-page recording guide, eight interview questions, an edit template that turns each video into a 20 to 40 second ad, and a rights log, ready for the client to approve and start sending.

## When to use

- The store has satisfied buyers and good reviews but no video proof.
- Creator ads feel staged and the account needs real voices.
- A long-running testimonial ad is tiring and needs fresh faces.
- The product page needs video reviews.

## Not for

- Ads made from written review screenshots: use `review-screenshot-ads`.
- Reposting videos customers already posted publicly: use `repost-customer-content-with-rights`.
- Getting more written reviews: use `build-review-collection-system`.
- Paid creators who are not customers: use `influencer-contract-and-usage-rights`.

## What you need

Required:

1. **Shopify order export** (Name, Email, Phone, Created at, Fulfilled at, Lineitem name, Accepts Marketing, Accepts SMS Marketing) for the last 90 to 180 days.
2. **Reviews export** (rating, text, product, date, reviewer email) from the review app.
3. **Approved claims list** (`product-claims-profile`) to check what customers say against what the ad can show.
4. **The thank-you offer** the client approves (store credit, a free product or a gift card), its cost and how it is delivered.
5. **Messaging consent status** for email, SMS and WhatsApp per customer.
6. **Gross profit per order** from `store-meta-math`.

Optional: support tickets with praise, repeat-purchase data, and the post-purchase email flow (`write-post-purchase-emails`).

Access: read only to pick customers. Sending ask messages is messaging customers: the client approves the list and the message before anything is sent.

## Before you start: the gates

1. **Money.** Gross profit per order is known from delivered costs [MEA-0037]. The thank-you cost per video counts as production cost against the ads it makes.
2. **Consent to contact.** Only customers who agreed to marketing on that channel get the ask. In India, WhatsApp needs opt-in and an approved business template; in the US, texts need prior consent (`sms-and-whatsapp-compliance-setup`). Fail: use email or an insert card only.
3. **Thank-you never depends on sentiment.** Every customer who sends an honest video gets it, whatever they say and whether or not it is used. Paying only for positive testimonials is banned in the US [MCR-6045].
4. **Release before use.** No video is edited into an ad until the signed release is back.
5. **No minors** on camera, and no health conditions disclosed beyond what the customer chooses to share.

## Steps

### 1. Pick who to ask

From the reviews and orders, list customers who:

- left a 4 or 5 star review that names a specific result or moment;
- bought again, or bought a second product;
- received the order long enough ago for the result to show (a gadget after a week, skincare after several weeks; set this per product);
- cover different buyer types (age, use, place), so testimonials answer different worries.

Tag each with the objection their story answers (price, does it work, fit, quality, delivery). Aim for one testimonial per main objection [LPG-0053].

### 2. Write the ask

Personal, short and specific. Each message says: what we would love (a 2 to 3 minute phone video answering a few questions), how it will be used (ads and the product page on Facebook, Instagram, YouTube and the site, with their first name), the thank-you and that they get it for any honest video, the deadline, and that saying no is fine.

- **Email (US and India):** subject line naming their product; plain text; one link to the upload page and release form.
- **WhatsApp (India, opted-in only):** an approved template, then a human reply. Automated WhatsApp journeys drew far higher click rates than broadcasts across Indian brands [EML-0048]; send it as part of the post-delivery journey rather than a blast.
- **Box insert:** a card with a short line and a QR code to the same page, for every future order.

### 3. Write the release form

Plain words, in the customer's language: name, email, product, what we may use (video, voice, first name, city if they agree), where (named platforms, ads and site), for how long (a set term, such as 2 years), that we may edit for length but not change meaning, that they may ask us to stop using it and we will remove it from new ads within a set number of days, whether they received anything in return, signature and date. Ask a lawyer to review the template once.

### 4. Send the recording guide

One page: film vertically, face a window, quiet room, phone at arm's length, product in hand for part of it, answer in your own words, no script, it is fine to mention anything you did not like, and upload through the link (not chat apps, which compress video).

### 5. Ask eight open questions

1. What was going on before you bought it?
2. What had you tried before?
3. Why did you pick this one?
4. What did you think when it arrived?
5. How do you use it, day to day?
6. What changed, if anything? Be as specific as you like.
7. Anything you did not like, or wish was different?
8. Who would you tell about it, and what would you say?

No leading questions ("How much did it change your life?").

### 6. Edit each video into an ad

| Beat | Seconds | Content |
|---|---|---|
| Hook | 0 to 3 | The customer's most specific line, with their face or the product in frame [ORG-0017] |
| Before | 3 to 10 | Their problem in their words |
| Turn | 10 to 20 | Why they chose it, first use |
| Result | 20 to 30 | What changed, their exact words; b-roll of their use if they filmed it |
| Close | 30 to 40 | Their honest verdict, product name and where to buy on screen |

Rules: cut for length only. Never join words from different answers into a sentence they did not say; visible jump cuts are fine. Add a short text headline so muted viewers get the point [LPG-0049]. Put the disclosure on screen early, such as "Real customer. Received store credit for sharing.", and keep it readable [MCR-6060]. If a customer's result is better than most buyers get, show what buyers generally get [MCR-6025]. Check every claim they make against the approved list; drop lines that make claims the store cannot back, even if true for them.

### 7. Mine and refresh

Watch every video for new angles and words the brand never used; real customer content can reveal winning angles worth rebuilding as statics too [MCR-0035]. When a testimonial ad tires, new openers from a different customer can revive it better than recutting the same footage [MCR-0047].

### 8. Keep the rights log

Track every video from ask to expiry, and act on removal requests within the promised days.

### 9. Market notes

- **India:** ask in the customer's language; Hindi and regional-language testimonials are strong proof for buyers in those regions. Cash-on-delivery buyers often worry whether the product is real; testimonials showing delivery and first use answer that.
- **US:** the FTC bans testimonials that misrepresent the speaker's experience [MCR-6045], and incentives must be disclosed [MCR-6025].

## Checks before you hand it over

- Every customer on the ask list consented to marketing on the channel used.
- The thank-you is the same for any honest video, positive or not.
- A signed release exists for every video edited into an ad.
- No edit joins words into a sentence the customer did not say.
- Disclosure is on screen early in every ad.
- Each claim in each ad is on the approved list.
- Each testimonial is tagged to the objection it answers.
- The rights log has term, expiry and removal promise for every video.

## Output

**One-screen summary:** customers asked, videos received, releases signed, ads made, objections covered and still missing, thank-you cost per video.

**Ask list:** Customer, Product, Review line, Objection it answers, Channel and consent, Send date, Status.

**Messages:** email (subject, preview, body), WhatsApp template and follow-up, insert card text.

**Release form fields:** as listed in step 3.

**Edit sheet per video:** Customer, Hook line and time, Before, Turn, Result, Close, Headline text, Disclosure text, Claims checked (Y or N), Objection tag.

**Rights log:** Customer, Video file, Release date, Platforms, Term, Expiry, Incentive given, Removal requested, Removed on.

## Common mistakes

- **Paying only for good reviews.** Gate 3 pays for any honest video.
- **Using a video before the release.** Gate 4 blocks it.
- **Frankenbiting.** Step 6 cuts for length, never joins words.
- **Leading questions.** Step 5 keeps them open.
- **One kind of customer.** Step 1 covers different buyer types and objections.
- **WhatsApp blasts without opt-in.** Gate 2 and step 2 use consented, journey-based messages.

## Sources

- EML-0048: automated WhatsApp journeys beat broadcasts in India.
- LPG-0049: video reviews need a text headline for muted viewers.
- LPG-0053: each testimonial answers one buying objection.
- MCR-0035: real customer content reveals unused angles.
- MCR-0047: new hooks from a different person revive a tired testimonial.
- MCR-6060: disclosures on screen and spoken, early.
- MCR-6025: disclose incentives; show generally expected results.
- MCR-6045: testimonials must not misrepresent experience; no paying for positive sentiment.
- MEA-0037: gross margin uses delivered cost.
- ORG-0017: first frame shows the topic.

What makes this skill ours: the thank-you is fixed before any video arrives so it can never depend on what the customer says; every testimonial is tagged to the buying objection it answers; edits cut for length but never join words; and the ask runs through consented post-delivery journeys, including WhatsApp templates in India.
