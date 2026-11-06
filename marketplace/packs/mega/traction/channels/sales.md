# Sales: founder-led and outbound

Channel 13 of 19. Book chapter it updates: Sales. Checked 2026-11-06.

Gabriel Weinberg and Justin Mares, *Traction* (Portfolio, 2015) [1], count sales as one of the traction channels to test like any other. This file restates the idea in our own words and updates it for 2026. The authors have not reviewed or endorsed this kit. Nothing here is legal advice; check outreach rules with a qualified adviser where you sell.

## 1. What this channel is now

Sales means one-to-one conversations that win a customer. Early on it is **founder-led**: the founder finds, calls and closes the first customers, and learns the pitch by doing it. **Outbound** means contacting people who have not asked to hear from you, by email, LinkedIn, phone or in person. Paul Graham's 2013 essay describes the Stripe founders setting up Stripe on a prospect's laptop on the spot, which YC called "Collison installation" [2].

The rules in force as of November 2026:

- **Gmail and Yahoo.** Since February 2024 every sender to Gmail needs SPF or DKIM and a spam rate in Postmaster Tools below 0.3%; Google recommends staying below 0.1% [3]. Senders of 5,000 or more messages a day need SPF, DKIM and DMARC, and one-click unsubscribe on marketing mail [3]. All mail from the same primary domain counts toward that 5,000, and since November 2025 Gmail has been rejecting more non-compliant mail [4]. Yahoo sets the same 0.3% line and expects unsubscribes honoured within two days [5].
- **US.** CAN-SPAM covers business-to-business email with no exception: honest headers and subject lines, a clear ad notice, a valid postal address, and opt-outs honoured within 10 business days. The FTC lists penalties of up to $53,088 per violating email [6].
- **UK.** Under PECR you may email companies, LLPs and public bodies without prior consent, but you must identify yourself and give a valid opt-out address. Sole traders and some partnerships count as individuals and need consent or a soft opt-in; if unsure, treat the address as an individual's. UK GDPR still applies to a named person's details. Marketing calls must be screened against both TPS and CTPS [7]. The Data (Use and Access) Act 2025 aligned PECR fines with data protection fines [8], for breaches from 5 February 2026 [9].
- **EU.** Rules differ by country. France's CNIL allows B2B email without prior consent if it relates to the recipient's job, with a simple, free way to object [10]. Germany's unfair competition law treats email advertising without prior express consent as an unreasonable nuisance, with no B2B exception [11].
- **LinkedIn** bans bots and extensions that scrape or automate activity, including sending messages and adding contacts, and may restrict accounts that use them [12].

## 2. When it works and when it doesn't

It works when each customer is worth a conversation, when buyers can be named (a role at a type of company, a kind of local business), when the problem is urgent, and when the founder can learn from every call.

It doesn't work for low-priced consumer products sold to strangers, for buyers you cannot name, or where the law blocks unsolicited contact (most consumer email in the UK and EU, and most email advertising in Germany).

## 3. Cheap tests

Set the go and stop numbers before each test, from the client's own figures: meetings needed = customers wanted ÷ (show rate × win rate). These are formulas, not industry averages.

**Test 1: Warm-network sprint.** List everyone who fits the buyer profile or knows someone who does. Ask each for one conversation or one introduction.
- Cost: no cash; two days.
- Time: one week.
- Go: at least one conversation with a real buyer who describes the problem unprompted.
- Stop: zero introductions after asking the whole list.

**Test 2: Thirty founder-written emails.** Pick 30 named, relevant contacts where the rules above allow it. Write each one by hand, send from a normal mailbox with an opt-out line, and follow up once.
- Cost: no cash; two days of research and writing.
- Time: two weeks.
- Go: enough meetings booked to stay on pace for the meetings-needed number.
- Stop: zero positive replies after one follow-up, or any spam complaint. Change the list or message before sending more.

**Test 3: Ten discovery calls with one script.** Same questions every time, recorded only with permission. Score each call on pain, budget, timing and decision-maker.
- Cost: no cash; ten short calls.
- Time: two weeks.
- Go: the same pain comes up in more than half the calls, and at least one prospect asks about price or next steps.
- Stop: no shared pain across the calls.

## 4. The numbers to watch

- Bounce rate = bounces ÷ sent.
- Spam complaint rate = complaints ÷ delivered (Gmail line 0.3%, aim below 0.1% [3]).
- Positive reply rate = interested replies ÷ delivered.
- Meeting rate = meetings booked ÷ people contacted.
- Show rate = meetings held ÷ meetings booked.
- Win rate = deals won ÷ qualified opportunities.
- Sales cycle = average days from first contact to signed deal.
- Sales CAC = (founder or rep time cost + tools + data) ÷ new customers.
- CAC payback in months = sales CAC ÷ (monthly revenue per customer × gross margin).

## 5. Tools

- HubSpot CRM (free tools; paid Sales Hub), Attio (free plan; paid) or Pipedrive (paid; free trial).
- Apollo (free plan; paid) or LinkedIn Sales Navigator (paid) for finding contacts. Check how the data was collected before you use it in the UK or EU.
- Your own Google Workspace or Microsoft 365 mailbox (paid). Sequencing tools such as lemlist or Instantly (paid) only once volume justifies them.
- Google Postmaster Tools (free) and MXToolbox (free checks; paid monitoring) for deliverability.
- Calendly or Cal.com (free plans; paid) for booking.
- Fathom (free plan; paid) for call notes, with the other side's consent.
- Access: the lead's brief sets a level per tool. Level 1 reads the CRM and the sending setup; level 2 drafts emails and CRM tasks, unsent; level 3 sends from the client's own mailbox within the client's caps, such as a daily limit, and every action is logged. LinkedIn stays manual at every level, because LinkedIn bans automated messages [12].

## 6. Common mistakes

- **Bought, unchecked lists.** They bounce, draw complaints and may be unlawful to use in the UK and EU.
- **Automating LinkedIn** against its rules [12].
- **Assuming a subdomain is a fresh start.** Gmail counts all mail from the same primary domain [4].
- **No opt-out line**, or opt-outs not honoured in time [5][6].
- **Treating sole traders as companies** in the UK [7].
- **Pitching in the first line.** Lead with the buyer's problem and one question.
- **Handing sales off too early.** The founder should close the first customers and write down what worked.
- **Not recording lost deals.** Note why each one was lost; that list is the next product plan.

## 7. By business type

### General

The founder sells the first customers personally. Start with the warm network and past customers, then a short list of named prospects where the rules allow outreach. Use one simple script, record what buyers say in their own words, and track every conversation in a CRM from day one, even a free one. Once the same objections repeat, write answers to them and test those answers in the next calls. Hire help only when the founder's calendar, not the pitch, is the limit.

### SaaS

Founder-led sales comes before any sales hire. Book demos with named roles at companies that fit, and set the product up during the call, as Stripe's founders did [2]. Measure meetings to trial, trial to paid, and how many new customers are still active after the first month. For self-serve products, use sales to help larger accounts that sign up on their own. Outbound email must meet the sender rules above: authenticate the domain, keep volume low, and watch complaints [3][4].

### Ecommerce

Sales rarely wins direct shoppers, and cold email to consumers usually needs consent in the UK and EU [7][10][11]. Sales works for the business side of a store: stockists and independent retailers, corporate gifting, events, hotels and offices. Send a short note with a sample offer to named buyers, then follow up by phone where calls are allowed. Track samples sent, meetings, first orders and reorders; reorders show the product sells through.

### Local

Most local sales happen by phone, in person or through quick quotes. Answer enquiries fast, follow up every quote, and ask for the booking. For business customers (offices, landlords, restaurants), walk in or call during quiet hours. In the UK, screen marketing calls against TPS and CTPS first [7]. Door-to-door selling has its own local rules, so check them first and respect "no cold callers" signs. Track quotes sent, quotes won and days to reply.

### Coaching

For coaches and solo experts, the sale is the discovery call. Fill the calendar from the warm network, past clients and referrals, and use personal LinkedIn messages written by hand, never automated [12]. Run every call the same way: their goal, what they have tried, the cost of waiting, then a clear offer or a polite no. Avoid pressure tactics and fake deadlines. Track booked calls, show rate, close rate and the reasons people say no.

## 8. Real examples

- **Stripe.** Paul Graham's July 2013 essay says the Collison brothers, when someone agreed to try Stripe, asked for their laptop and set it up there and then [2].
- **Airbnb.** The same essay says Airbnb's founders went door to door in New York, recruiting hosts and helping them improve their listings [2].

## 9. Sources

1. *Traction: How Any Startup Can Achieve Explosive Customer Growth*, Gabriel Weinberg and Justin Mares. Penguin (Portfolio Penguin). https://www.penguin.co.uk/books/289806/traction/9780241242537.html (checked 2026-11-06)
2. Do Things That Don't Scale, Paul Graham, July 2013. paulgraham.com. https://paulgraham.com/ds.html (checked 2026-11-06)
3. Email sender guidelines. Google Workspace Admin Help. https://support.google.com/a/answer/81126 (checked 2026-11-06)
4. Email sender guidelines FAQ. Google Workspace Admin Help. https://support.google.com/a/answer/14229414 (checked 2026-11-06)
5. Sender Best Practices. Yahoo Sender Hub. https://senders.yahooinc.com/best-practices/ (checked 2026-11-06)
6. CAN-SPAM Act: A Compliance Guide for Business. US Federal Trade Commission. https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business (checked 2026-11-06)
7. Business-to-business marketing. Information Commissioner's Office (UK). https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/ (checked 2026-11-06, confirmed by search; the site blocks automated fetches)
8. Data (Use and Access) Act factsheet: ICO. GOV.UK, 27 Jun 2025. https://www.gov.uk/government/publications/data-use-and-access-act-2025-factsheets/data-use-and-access-act-factsheet-ico (checked 2026-11-06)
9. The Data (Use and Access) Act 2025 (Commencement No. 6 and Transitional and Saving Provisions) Regulations 2026. legislation.gov.uk. https://www.legislation.gov.uk/uksi/2026/82/made (checked 2026-11-06, confirmed by search; the page did not load for our fetcher)
10. La prospection commerciale par courrier électronique. CNIL (France), 10 Jun 2026. https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique (checked 2026-11-06)
11. Gesetz gegen den unlauteren Wettbewerb (UWG), section 7. Bundesministerium der Justiz, gesetze-im-internet.de. https://www.gesetze-im-internet.de/uwg_2004/__7.html (checked 2026-11-06)
12. Prohibited software and extensions. LinkedIn Help. https://www.linkedin.com/help/linkedin/answer/a1341387 (checked 2026-11-06)
