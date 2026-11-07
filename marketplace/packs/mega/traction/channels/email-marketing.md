# Email marketing

Channel 9 of 19. Book chapter it updates: Email marketing. Checked 2026-11-06.

Gabriel Weinberg and Justin Mares, *Traction* (Portfolio, 2015) [1], treated email as a channel in its own right, used both to win customers and to keep them. This file restates that in our own words and updates it for 2026. The authors have not reviewed or endorsed this kit. Consent rules below are general information, not legal advice: check them with a qualified adviser for your country and sector.

## 1. What this channel is now

Email reaches people who asked to hear from you, on a list you own. It rarely finds strangers on its own; it turns visitors into buyers and buyers into repeat buyers, and it is the capture step behind content, search and referrals. Since the book, inbox providers have started enforcing sender rules, and consent law still differs by region.

**Sender rules (as of 6 November 2026)**
- **Gmail.** Since 1 February 2024 every sender needs SPF or DKIM, valid DNS, TLS and a spam rate below 0.3% in Postmaster Tools. Bulk senders (more than 5,000 messages a day to Gmail) also need SPF and DKIM, DMARC (a "none" policy is enough), a From domain that aligns, and one-click unsubscribe plus a visible unsubscribe link on marketing mail. Google advises staying below 0.1% [2]. From November 2025 Gmail stepped up enforcement with temporary and permanent rejections; bulk status never expires, and Google recommends acting on unsubscribes within 48 hours [3].
- **Yahoo.** The same core rules since February 2024; bulk senders must honour unsubscribes within two days. Yahoo also advises against bought lists and pre-checked boxes [4].
- **Microsoft.** Domains sending 5,000 or more messages to Outlook.com, Hotmail and Live addresses must pass SPF, DKIM and DMARC; mail that fails is rejected with error 550 5.7.515 [5].
- **Apple.** Mail Privacy Protection loads content in the background when mail arrives, so senders cannot tell whether or when a message was opened [6]. Judge email on clicks, replies and sales.

**Consent law**
- **US (CAN-SPAM).** No prior consent is needed for commercial email, but headers must be accurate, subject lines honest, the message identified as an ad, a postal address included, and opt-outs honoured within 10 business days [7].
- **UK (PECR).** Individuals, including sole traders and some partnerships, need to have consented, or you must meet every condition of the "soft opt-in": details gathered in a sale or negotiation, marketing only your own similar products, and an opt-out offered at collection and in every message. Corporate addresses need no consent but must be able to opt out [8].
- **EU (ePrivacy and GDPR).** Marketing email needs express opt-in, such as ticking a box, unless there is an existing customer relationship, and should be flagged as advertising [9].

## 2. When it works and when it doesn't

It works when you can give people a reason to sign up (a useful guide, a newsletter worth reading, early access), when buying takes several touches or repeats, and when you can send on a steady rhythm.

It doesn't work as a first channel with no list and no traffic: email cannot create demand from nothing, so test a channel that brings people first. Bought or scraped lists break UK and EU consent rules and inbox providers' advice [4][8][9].

## 3. Cheap tests

Set go and stop lines with the client first. Benchmarks below are vendor figures with caveats; replace them with the client's own baseline once it exists. Spam-rate lines are Google's published limits.

**Test 1: Sign-up offer on your busiest page.** Offer one useful guide, checklist or template tied to what you sell, with an unticked consent box where UK or EU rules need consent.
- Cost: a free email plan; one to two days.
- Time: two to four weeks.
- Go: the page's sign-up rate beats your site-wide rate, and the new subscribers produce at least one sale or booked call within 30 days.
- Stop: no lift in sign-up rate after two weeks of normal traffic, even after one change to the offer.

**Test 2: Welcome sequence.** Three to five automated emails over the first two weeks: what to expect, your most useful content, proof, then one offer.
- Cost: a free plan; one to two days of writing.
- Time: four weeks.
- Go: click rate at or above Klaviyo's 2026 flow median of 5.58% [10], with spam complaints below 0.1% [2].
- Stop: complaints at 0.3% or more, Gmail's limit [2], or clicks below Klaviyo's campaign median of 1.69% after two rewrites [10].

**Test 3: One plain email to people who know you.** A short plain-text note from a real person to customers and opted-in leads, offering one specific thing (an open slot, a restock, a case study) and inviting replies.
- Cost: under an hour.
- Time: seven days.
- Go: replies and sales cover the time spent, with a click rate at or above 1.69% [10].
- Stop: complaints at or above 0.1% [2], a sign of a consent or relevance problem.

## 4. The numbers to watch

- **Net list growth** = new subscribers − unsubscribes − bounces and complaints, per week.
- **Click rate** = unique clicks ÷ delivered emails.
- **Spam complaint rate** = complaints ÷ delivered; for Gmail, read it in Postmaster Tools [2].
- **Unsubscribe rate** = unsubscribes ÷ delivered.
- **Subscriber-to-customer rate** = subscribers who buy within 90 days ÷ subscribers who joined that month.
- **Revenue per subscriber** = email-attributed revenue ÷ average list size, per month.
- **Opens:** a rough signal only [6].

## 5. Tools

- Google Postmaster Tools: free. Gmail spam rate and compliance status.
- Klaviyo: free plan for small lists; paid plans. Built for online shops.
- Kit: free plan; paid plans, with a referral system on its top plan.
- MailerLite and beehiiv: free plans; paid plans.
- Google Analytics 4: free. Tag email links with UTM parameters.
- Access: the lead's brief sets a level per tool. Level 1 reads reports and settings; level 2 builds forms, flows and campaigns in the email platform, switched off; level 3 switches flows on and sends to the agreed segments within the client's caps, and every action is logged. List imports and DNS changes always need a new yes.

## 6. Common mistakes

- Bought, rented or scraped lists [4][8].
- Pre-ticked consent boxes [4][9].
- Sending without SPF, DKIM and DMARC, then wondering why Gmail or Outlook rejects mail [3][5].
- Judging subject lines by open rates [6].
- Hiding promotions in receipts; a mixed message counts as commercial if its subject line promotes or the transaction part does not come first [7].
- Slow unsubscribes [3][4][7].
- Mailing an old, cold list after months of silence.

## 7. By business type

### General
Put a sign-up box on every page and at checkout or booking, then run the welcome sequence in Test 2. Send at least one genuinely useful email a month so the list stays warm. Your list is where readers from content, search and referral tests land, so set it up before those tests start. Check which consent rule applies in each country you sell to, and set up SPF, DKIM and DMARC on day one.

### SaaS
Trigger onboarding emails from what users do or fail to do: first project created, teammate invited, trial ending. Account and onboarding messages are usually transactional under CAN-SPAM, while promotions need its full rules [7]. In the UK you may email corporate addresses without consent if they can opt out, but sole traders count as individuals [8]. Measure activation and trial-to-paid rate for users who got each email against those who did not, not clicks alone.

### Ecommerce
Automate flows before campaigns: welcome, abandoned checkout, post-purchase and win-back. In Klaviyo's 2026 figures across more than 183,000 brands, flows drew a 5.58% click rate against 1.69% for campaigns [10]. Past buyers in the UK can get emails about similar products under the soft opt-in if the checkout offered an opt-out [8]; the EU has a similar customer exception [9]. Leave the consent box unticked for everyone else. Measure revenue per subscriber and repeat-purchase rate.

### Local
Collect emails at booking with a clear, unticked opt-in. Appointment reminders and rebooking prompts do most of the work; add seasonal offers to fill quiet weeks. Keep each email short and local: a slot that opened, a new service, a tip for the season. Measure rebookings and filled slots from email. Every few months, remove people who have not clicked, replied or booked in a long while, so people who no longer want your mail are not left to report it as spam.

### Coaching
For a solo expert the newsletter is often the main asset: weekly, useful and easy to reply to. James Clear's weekly newsletter goes to more than 3 million subscribers, by his own count [12]. Tie your sign-up offer to your paid work, treat replies as buying signals, and invite readers to calls or cohorts. Write as yourself, from your own address, and keep the same send day so readers expect you. Measure booked calls per 100 new subscribers.

## 8. Real examples

- **Product Hunt.** In November 2013 Ryan Hoover tested demand with a collaborative email list on Linkydink, inviting a couple of dozen people. It soon reached a couple of hundred subscribers, became a website, and by January 2015 the list had passed 43,000 [11].
- **James Clear.** He has written at jamesclear.com since 2012, with more than 250 articles, and sends a weekly newsletter to more than 3 million subscribers, according to his site in November 2026 [12].

## 9. Sources

1. *Traction: How Any Startup Can Achieve Explosive Customer Growth*, Gabriel Weinberg and Justin Mares. Penguin (Portfolio Penguin). https://www.penguin.co.uk/books/289806/traction/9780241242537.html (checked 2026-11-06)
2. Email sender guidelines. Google Workspace Admin Help. https://support.google.com/a/answer/81126 (checked 2026-11-06)
3. Email sender guidelines FAQ. Google Workspace Admin Help. https://support.google.com/a/answer/14229414 (checked 2026-11-06)
4. Sender Best Practices. Yahoo Sender Hub. https://senders.yahooinc.com/best-practices/ (checked 2026-11-06)
5. Fix NDR error "550 5.7.515" in Outlook.com. Microsoft Support. https://support.microsoft.com/en-us/outlook/fix-ndr-error-550-5-7-515-in-outlook-com (checked 2026-11-06)
6. Protect email privacy in Mail on Mac. Apple Support. https://support.apple.com/guide/mail/protect-email-privacy-mlhlp1205/mac (checked 2026-11-06)
7. CAN-SPAM Act: A Compliance Guide for Business. US Federal Trade Commission. https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business (checked 2026-11-06)
8. Electronic mail marketing (Guide to PECR). UK Information Commission (ICO). https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/ (checked 2026-11-06, confirmed by search result; the page blocks automated fetches)
9. Promoting a business online while respecting your customers. Your Europe, European Union, last checked by the EU 12 Jul 2026. https://europa.eu/youreurope/business/running-business/digitalising/promoting-business-online/index_en.htm (checked 2026-11-06)
10. Email marketing benchmarks 2026. Klaviyo. https://www.klaviyo.com/products/email-marketing/benchmarks (checked 2026-11-06)
11. Product Hunt is Everywhere: This is How It Got There. First Round Review, 27 Jan 2015. https://review.firstround.com/product-hunt-is-everywhere-this-is-how-it-got-there/ (checked 2026-11-06)
12. About James Clear. jamesclear.com. https://jamesclear.com/about (checked 2026-11-06)
