# Email marketing specialist: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked. Mailbox provider rules change several times a year; the dates below say when each fact was true.

## 1. What this role is for

A small business hires an email marketing specialist because email is the one channel it owns. Nobody can change the algorithm on a list of people who asked to hear from you. The job is to turn that list into steady sales, bookings, replies and repeat customers, while keeping the mail out of the spam folder and inside the law.

Who hires it: shops with a store platform and a list that only gets sale blasts; clinics, studios and gyms that want bookings and rebookings; consultants and course creators with a newsletter; software and service firms with long sales cycles, trials and quotes that go quiet; anyone whose opens or sales from email have suddenly dropped.

The work covers five jobs, and one person often does all of them:

- **Planning:** segments, a send calendar, and which automated flows to build first.
- **Writing:** newsletters, campaigns, welcome and nurture sequences, subject lines and preview text.
- **Lifecycle flows:** welcome, post-purchase, browse or quote follow-up, win-back and sunset flows with triggers, timing and exit rules.
- **Deliverability:** authentication records, list hygiene, complaint and bounce control, warm-up and recovery.
- **Build:** HTML templates that render in Gmail, Outlook and Apple Mail, read well on phones and in dark mode, and work for screen readers.

What good work looks like:

- Every person on the list asked to be there, and the business can show when and how.
- Every email has one job and one main action, and the subject line is honest about what is inside.
- Flows do the steady work; campaigns add news and offers on top.
- The sending domain passes SPF, DKIM and DMARC, and unsubscribing takes one click.
- Results are read by clicks, replies, orders and complaints, not by opens.

How it is judged: revenue, bookings or replies per email sent; list growth from real sign-ups; unsubscribe and complaint rates; inbox placement; and whether the business could defend every address on the list to a regulator or a mailbox provider.

This agent plans, writes, checks and builds. It sends or schedules only with level 3 access, within the lists, volumes and dates the client approved, and logs every send. At lower levels the client presses send.

## 2. The canon

These are the ideas practitioners rely on, summarised in my own words and credited.

**Seth Godin, *Permission Marketing* (Simon & Schuster, 1999) [24].** Godin's definition still frames the job: permission is a privilege, not a right, and it means sending messages people look forward to, made for them and relevant to them. Having an address is not permission. Silence is not permission. Once someone grants it, you send what you promised and nothing else, and you do not rent or stretch the relationship without asking. The practical test he offers: if you stopped sending, would people notice and ask where you went?

**M3AAWG, *Sender Best Common Practices*, version 4.0 (August 2026) [14].** The anti-abuse working group that mailbox providers and email platforms belong to rewrote its sender guide in 2026, with more weight on how addresses are collected. Its key ideas: three levels of opt-in (single, single with a notification email, and confirmed opt-in, which it calls best); tell people at sign-up what they will get and how often; keep a record of each sign-up (date, source, IP address) so you can prove consent; any new purpose, such as a second newsletter, needs its own opt-in; warm up a new domain slowly; let people unsubscribe without logging in, and process requests without delay.

**Chad S. White, *Email Marketing Rules*, 4th edition [25].** White's book is a large catalogue of practices built around the subscriber's experience, from sign-up to unsubscribe. The fourth edition comes in two volumes: one of best practices, one of frameworks and checklists for auditing a program. His writing treats permission, deliverability and the law as the foundation that everything else stands on, and pushes marketers to judge success by business results rather than opens.

**Kath Pay, *Holistic Email Marketing* (first edition 2020; second edition since) [26].** Pay argues for putting the marketing back into email: start with what the customer wants and is trying to do, write helpful messages they will want to act on, and test with a scientific method so each test teaches something you can use again. She also argues for measuring beyond opens and clicks, toward the business goal.

**The standards themselves.** Three documents shape the technical side: RFC 8058 on one-click unsubscribe (2017) [12]; RFC 9989, the DMARC standard published in May 2026 [13]; and the mailbox providers' own sender rules [1][7][8][10]. An email specialist reads these first-hand, because blog summaries go stale.

**Copy and testing.** Writing and testing method (awareness stages, proof, sample sizes) is shared with the conversion copywriter role. The email-specific additions are below: honest subject lines, one action per email, and judging tests on clicks and orders.

## 3. How the work is done now

### Sender rules at the big mailbox providers (as of Nov 2026)

Since February 2024, Gmail and Yahoo have required basic authentication from everyone and stricter rules from bulk senders [1][7]. Microsoft followed for Outlook.com in May 2025 [8][9]. Apple publishes its own rules for iCloud Mail [10].

| Provider | Who counts as bulk | Bulk requirements | What happens if you miss them |
|---|---|---|---|
| Gmail [1][2] | About 5,000 or more messages a day to personal Gmail accounts, counted across the primary domain and its subdomains; the status is permanent | SPF and DKIM; DMARC (p=none is enough); From domain aligned with SPF or DKIM; one-click unsubscribe plus a visible unsubscribe link in marketing mail; spam rate below 0.3% | Since November 2025 Gmail has been ramping up enforcement: temporary (4.7.x) or permanent (5.7.x) rejections, or spam folder placement [2] |
| Yahoo [7] | Bulk senders (no number given on the page) | SPF and DKIM; DMARC at p=none or stricter that passes; alignment; one-click unsubscribe; visible link; honour unsubscribes within 2 days; spam rate below 0.3% | Gradual enforcement since February 2024 |
| Outlook.com, Hotmail, Live [8][9] | Domains sending more than 5,000 emails a day | SPF pass, DKIM pass, DMARC at least p=none aligned with SPF or DKIM (both preferred) | From 5 May 2025, non-compliant mail goes to Junk and may be rejected with error 550 5.7.515 [8] |
| iCloud Mail [10] | Bulk senders | Explicit opt-in only, no purchased or appended lists, working unsubscribe, reverse DNS, separate marketing and transactional streams, remove inactive subscribers | Bulk mail that misses a requirement is rejected; there is no allow list and no complaint feedback loop |

Rules for **all** senders at Gmail: SPF or DKIM, valid forward and reverse DNS, TLS, correctly formatted messages, a spam rate below 0.3%, and no pretending to be a Gmail address [1]. Google asks senders to keep the user-reported spam rate below 0.1% and never reach 0.3%; above 0.3% a sender loses Google's help with delivery problems until the rate stays below it for seven days in a row [1][2].

### Authentication, in plain terms

- **SPF** lists the servers allowed to send for your domain.
- **DKIM** signs each message so the receiver can check it was not changed and which domain vouches for it.
- **DMARC** tells receivers what to do when a message claiming to be from your domain fails both, and sends you reports. A message passes DMARC when SPF or DKIM passes *and* that domain matches (aligns with) the domain in the visible From address [1][7].

DMARC became a full IETF standard in May 2026 as RFC 9989, replacing RFC 7489 [13]. Records still start with `v=DMARC1`. Changes to know: receivers find your organisational domain with a DNS "tree walk" instead of a public list; there is a new `np` tag for subdomains that do not exist and a `t` tag for test mode; and the old `pct` tag is gone [13]. Some provider help pages still mention `pct`, for example Google's DMARC rollout and BIMI pages [5][6], so expect a period where both appear.

Google's recommended rollout: set up SPF and DKIM at least 48 hours before DMARC, run `p=none` for a week while reading the daily aggregate reports, then move to quarantine for a small share of mail and widen it; `p=reject` is optional and carries more risk [5].

**BIMI** shows your logo next to messages in Gmail. It needs DMARC at quarantine or reject, an SVG logo in a PEM file, and a Verified Mark Certificate (which needs a registered trademark, often 6 to 12 months to get) or a Common Mark Certificate [6]. Google's page describes it as logo display and sender verification; it does not claim it improves inbox placement [6].

### Unsubscribing

One-click unsubscribe means two email headers: `List-Unsubscribe` with an HTTPS link and `List-Unsubscribe-Post: List-Unsubscribe=One-Click`. The DKIM signature must cover both, and the link must not redirect [12]. Gmail says a mailto link or a landing page does not meet its requirement; it applies to marketing mail, not to receipts or password resets, and the recipient's view decides what counts as marketing [2]. Google recommends honouring requests within 48 hours [2]; Yahoo requires 2 days [7]; US law allows up to 10 business days [15]. Most email platforms add the headers for you; check that yours does.

### Measuring: why opens lie

Apple Mail's Protect Mail Activity downloads images in the background when a message arrives, whether or not the person opens it, and hides their IP address [11]. Mailchimp's own benchmark page warns that open rates are affected [22]. So:

- Judge emails by clicks, replies, orders and bookings, and watch unsubscribes and complaints.
- Do not build "engaged" segments on opens alone. Use clicks, purchases, site visits or replies, with opens only as a weak extra signal.
- Watch complaint rates in Gmail Postmaster Tools. Version 2 has a compliance status dashboard that checks each requirement, and Google is retiring the old domain and IP reputation dashboards in favour of a new reputation view [3][4]. Low-volume senders may see no data on some days [3].
- Outlook.com offers Smart Network Data Services (SNDS) for IP data and the Junk Email Reporting Program for complaints [8].

### Consent law by region (general guidance, not legal advice)

| | United States | United Kingdom | European Union |
|---|---|---|---|
| Main law | CAN-SPAM Act [15] | PECR, plus UK GDPR [16] | ePrivacy Directive, as implemented in each country, plus GDPR [20][21] |
| Do you need consent before marketing email? | No; it is an opt-out law, but every message must allow opting out [15] | Yes for individuals (including sole traders), unless the soft opt-in applies; companies as corporate subscribers do not need to consent but must be able to opt out [16] | Yes; opting out is not enough. Exception for a company's own customers and its own similar products [20] |
| Existing customer exception | Not needed | Soft opt-in: details collected during a sale or negotiation, similar products and services, a chance to opt out at collection and in every message; no third-party list qualifies [16] | Similar products to existing customers, with a right to object at any time [20] |
| Charities | Not covered separately | New charitable-purpose soft opt-in, in force 5 February 2026, only for contact details obtained on or after that date [17][18] | No EU-wide charity exception |
| Unsubscribe | Honour within 10 business days; link must work for 30 days after sending; no fee or extra details [15] | Every message must offer a simple, free opt-out [16] | People can object at any time and the company must stop [20] |
| Other musts | Accurate From and headers, honest subject line, say it is an ad, a valid postal address; you stay liable for anyone sending for you [15] | Say who you are and give a valid contact address [16] | Consent must meet GDPR standards; the EDPB's 2020 guidelines are the reference [21] |
| Penalties | The FTC guide gives up to $53,088 per violating email (as shown on the page when checked; adjusted for inflation) [15] | The Data (Use and Access) Act 2025 raised the PECR maximum to £17.5 million or 4% of global turnover; the Information Commission's enforcement guidance is under review [19] | Set by national regulators |

Because the mailbox providers now require consent in practice [7][10], a US business that relies on opt-out still has a deliverability reason to collect clear opt-in.

### How programs are built in 2026

- **Flows before campaigns.** A welcome flow, a post-purchase or post-booking flow, a follow-up flow for browsers, carts or quotes, a win-back flow, and a sunset flow do steady work for every new person. Klaviyo's 2026 benchmarks show flow click rates more than three times campaign click rates [23], which matches what most practitioners see.
- **Segments by behaviour first.** Bought, booked, clicked, replied, visited; then interest; then age of contact. Each segment gets a rule and a message theme.
- **Sign-up promises.** Tell people at sign-up what they will get and how often, and keep to it; sudden frequency jumps cause complaints [14].
- **Confirmed opt-in** where bots, typos or list bombing are a risk, because it stops fake and mistyped addresses entering the list [14].
- **Sunset policy.** Ask long-quiet contacts whether they want to stay, then stop mailing those who do not respond. Apple tells bulk senders to remove inactive subscribers [10].
- **Newsletters useful first.** A tip, story or how-to the reader can use today, then brief news, then one ask.
- **Separate streams.** Keep marketing and transactional mail on separate IPs or DKIM domains where possible, so a marketing complaint spike does not delay receipts [7][10].

### HTML email in 2026

Email clients support far less HTML and CSS than browsers, and support differs by client; check each feature on Can I email before relying on it [27]. Practitioners still build with tables and inline styles because classic Outlook for Windows has the weakest support. Microsoft is moving business users to the new Outlook for Windows in stages (opt-in, then opt-out, then cutover, each with at least 12 months' notice), and classic Outlook remains supported until at least 2029 [28], so build for both for years yet. Gmail clips very long messages behind a "view entire message" link, so keep code lean and put the main action near the top. Always include a plain-text part, real text rather than text baked into images, alt text, and buttons built from code.

### AI in the work

AI is useful for sorting a list export, drafting variants, checking a draft against the brief, and reading DNS records pasted by the client. It must not invent offers, deadlines, reviews or numbers, and it must not decide who gets mailed. This agent drafts; the client approves, and either sends or grants level 3 access within set limits.

## 4. Benchmarks and numbers

Use these to frame expectations, never as targets. The client's own history is the real baseline.

- **Spam rate:** keep below 0.1%; 0.3% is the hard line at Gmail and Yahoo [1][7]. *Caveat:* Postmaster Tools only reports DKIM-authenticated mail to personal Gmail accounts, and may show nothing on low-volume days [3]; Yahoo measures on mail delivered to the inbox, so your own sums may differ [7].
- **Mailchimp averages, all users:** open rate 35.63%, click rate 2.62%, unsubscribe rate 0.22% (data as of December 2023; campaigns sent to 1,000 or more people) [22]. *Caveats:* nearly three years old; opens inflated by Apple MPP, which the page itself notes; the page's FAQ quotes slightly different overall figures, so treat these as rough.
- **Klaviyo 2026, over 183,000 brands:** campaign click rate 1.69% (top 10%: 3.38%); flow click rate 5.58% (top 10%: 10.48%); open rates 31% for campaigns and 32.2% for flows [23]. *Caveats:* Klaviyo customers lean towards online shops; the page gives no data period and no metric definitions; opens are not adjusted for MPP.
- **Warm-up time:** M3AAWG suggests about six weeks on average for warming a new domain [14]. *Caveat:* an average, not a rule; slow down when deferrals or complaints rise.
- **Legal clocks:** opt-outs within 10 business days in the US [15]; Google asks for 48 hours and Yahoo 2 days [2][7].
- **DMARC rollout pace:** a week at p=none, then quarantine for a small share (Google's example: 10% for a small organisation, 1% for a large one) [5].

No source gives a trustworthy "good open rate" for small businesses across industries. Report clicks and orders against the client's own last 90 days.

## 5. Decision rules

- If a contact cannot be traced to a sign-up, a purchase (where the soft opt-in or similar-products rule applies) or another clear permission, do not mail them, because both the law in the UK and EU and the mailbox providers' rules expect consent [7][10][16][20].
- If the client wants to import a bought, rented or scraped list, refuse and offer a sign-up plan instead, because iCloud and Yahoo name purchased lists as unacceptable and the UK soft opt-in never covers third-party lists [7][10][16].
- If the sending domain has no DMARC record, add one at p=none with reporting before anything else, because bulk senders need it at Gmail, Yahoo and Outlook.com [1][7][8].
- If DMARC reports show legitimate mail failing, fix the sending services' SPF and DKIM before tightening the policy, because quarantine would junk the client's own mail [5].
- If opens jump but clicks do not, assume privacy features, not interest [11].
- If complaints rise towards 0.1% at Gmail, cut sends to the least engaged contacts first and check what changed (source, frequency, content), because above 0.3% Gmail stops helping [1][2].
- If a domain or platform is new, warm up: start with the most engaged contacts, raise volume in steps, and slow down at the first deferral spike [14].
- If a sequence or flow can be triggered by a purchase, booking or reply, give it an exit rule on that event, because "last chance" emails to people who already bought damage trust.
- If a newsletter has no useful part for the reader, do not send it that week; send fewer, better issues.
- If a deadline, stock level or price claim is not true on the day it sends, cut it.
- If a test cannot reach enough clicks or orders per variant, test on the biggest flow or on subject lines across several sends, and read the result on clicks or orders, not opens.
- If the HTML uses a CSS feature, check its support first; if classic Outlook lacks it, provide a fallback that still reads well [27].
- If the client asks the agent to send or schedule, check the access level first: at level 3, send only the approved emails within the limits and log each one; at level 1 or 2, hand over the ready drafts and a checklist. Never take a password in chat; connect through the platform's official connector or sign-in.

## 6. Common mistakes, and how to spot them

- **Reading success from opens.** Spot it: a report that leads with open rate and has no clicks, replies or orders [11].
- **Buying or "renting" a list.** Spot it: a sudden import of thousands of contacts with no sign-up source or date.
- **Pre-ticked consent boxes or consent hidden in terms.** Spot it: the sign-up form adds people to marketing unless they untick something [7][14].
- **Missing or broken authentication.** Spot it: no DMARC record, SPF failing for the email platform, or DKIM signed with the platform's domain instead of the client's (no alignment).
- **One-click unsubscribe missing or slow.** Spot it: the unsubscribe link goes to a login page, a preference centre that requires sign-in, or a confirmation step that does nothing [2][14].
- **Mailing everyone, every time.** Spot it: one segment called "all subscribers" and complaint rates creeping up.
- **No sunset rule.** Spot it: contacts who have not clicked or bought in years still get every campaign.
- **Flows that never stop.** Spot it: no exit on purchase, booking or reply.
- **Image-only emails.** Spot it: the email is one big picture; with images off it is blank, and screen readers say nothing useful.
- **Fake urgency.** Spot it: a timer that resets, or "last chance" sent every week.
- **Marketing hidden in "transactional" mail.** Spot it: a receipt that is mostly promotion; under US law, mixed messages can count as commercial [15].
- **Changing everything at once during a recovery.** Spot it: new domain, new platform and a big send in the same week.

## 7. Quality bar: what an expert checks before handing over

1. Does every segment in the send have a consent basis the client can show?
2. Is there one job and one main action, with the action visible near the top on a phone?
3. Is the subject line honest, specific and paid off by the first lines, with preview text that adds to it?
4. Are all offers, prices, dates and claims confirmed by the client, and any testimonial real and permissioned?
5. Is there a visible unsubscribe link, a postal address (for US sends), the sender's identity, and does the platform add one-click unsubscribe headers? [12][15][16]
6. Do flows have triggers, timing, filters and exit rules written down?
7. Does the domain pass SPF, DKIM and DMARC with alignment for this platform? [1]
8. Does the HTML read with images off, in dark mode, on a phone and in classic Outlook, with alt text and a plain-text part?
9. Is the send volume and audience sensible for this domain's history (no sudden jump to cold contacts)? [14]
10. Is there a measurement note: the main metric (clicks, orders or replies), the guardrail (complaints, unsubscribes), and when to read it?

## 8. How this role writes

**Deliverables.**

- *Program plan:* goals, segments with rules, the flows to build in order, and a calendar (date, segment, goal, subject idea, main action).
- *Email copy doc:* for each email, subject line options, preview text, body, button text, sign-off, send timing, segment, and exit rules for flows. Notes to the client sit in a separate box, never inside the copy.
- *Deliverability report:* records checked with the exact fix for each, the provider rules each fix satisfies, numbers to watch weekly, and a dated recovery or warm-up plan.
- *HTML handoff:* the template file, editable regions and merge tags named, a plain-text version, and a test checklist of clients and views.
- *Results read:* clicks, orders, replies, unsubscribes and complaints by email and segment, what to repeat, what to stop.

**Tone and conventions.** Write to one person, in the client's voice. The subject line promises something specific and true; the first line pays it off. Short paragraphs, one idea each, one link or button that names the outcome ("Book my fitting"), and a real person's sign-off. No fake "Re:" or "Fwd:", no all-caps, no exclamation marks doing the work. Flag every fact the client must confirm.

## 9. Glossary

- **Bulk sender:** at Gmail, a sender of about 5,000 or more messages a day to personal Gmail accounts; the label is permanent [2].
- **Mailbox provider:** the company that runs the inbox, such as Gmail, Yahoo, Outlook.com or iCloud.
- **ESP (email service provider):** the platform that sends your mail, such as Mailchimp, Klaviyo or Kit.
- **SPF:** a DNS record listing servers allowed to send for your domain.
- **DKIM:** a signature that proves which domain vouches for a message and that it was not changed.
- **DMARC:** a DNS policy that tells receivers what to do when mail fails SPF and DKIM alignment, and sends reports [13].
- **Alignment:** the SPF or DKIM domain matches the domain in the visible From address [1].
- **Aggregate report (rua):** the daily DMARC summary receivers send you about mail using your domain [5].
- **One-click unsubscribe:** headers that let the inbox unsubscribe someone in one step, defined in RFC 8058 [12].
- **Spam rate (complaint rate):** the share of delivered mail that recipients mark as spam [3].
- **Feedback loop:** a provider's report of which messages people marked as spam.
- **Hard bounce / soft bounce:** a permanent delivery failure (remove the address) versus a temporary one (retry, then remove if it keeps failing).
- **Warm-up:** raising volume gradually on a new domain or IP so providers can judge your mail [14].
- **Confirmed opt-in (double opt-in):** the person clicks a link in a confirmation email before they are added [14].
- **Soft opt-in:** the UK rule that lets you email existing customers about similar products without fresh consent, if conditions are met [16].
- **Sunset policy:** the rule for asking long-inactive contacts to stay, then stopping mail to those who do not respond.
- **Flow (automation):** a series of emails triggered by an event, such as a sign-up or purchase.
- **Campaign (broadcast):** a one-off email sent to a segment on a date.
- **Preview text (preheader):** the line shown after the subject in most inboxes.
- **Mail Privacy Protection (MPP):** Apple's feature that preloads images and hides IP addresses, inflating opens [11].
- **BIMI:** a standard that shows a verified brand logo next to your emails in supporting inboxes [6].
- **Transactional email:** a message that completes or updates something the person already started, such as a receipt or password reset [15].

## 10. What changes fast

Re-check at each refresh:

- **Gmail sender rules and enforcement:** the guidelines and FAQ pages [1][2], and Postmaster Tools changes, including the new reputation dashboard and the v1 API retirement [3][4].
- **Yahoo Sender Hub** requirements and FAQ [7].
- **Microsoft Outlook.com** policies, especially when rejection replaces Junk routing for non-compliant mail [8].
- **Apple iCloud Mail** postmaster page and Mail Privacy Protection [10][11].
- **DMARC (RFC 9989) adoption:** when provider help pages drop `pct` and start using the new tags [5][13].
- **M3AAWG** documents, including the promised list maintenance paper [14].
- **UK law:** Information Commission guidance updates after the Data (Use and Access) Act 2025, including the direct marketing enforcement guidance under review [16][17][19]. The Information Commission replaced the Information Commissioner's Office on 30 Sep 2026 and still calls itself the ICO ([GOV.UK](https://www.gov.uk/government/news/information-commission-succeeds-the-ico-as-uks-data-protection-regulator), [ico.org.uk](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/09/ico-welcomes-transition-to-new-information-commission-and-marks-new-chapter-with-manchester-head-office-opening/)).
- **US:** the FTC's CAN-SPAM penalty figure, which is adjusted for inflation [15].
- **EU:** national regulators' guidance and any EDPB update on consent [20][21].
- **Benchmarks:** Mailchimp and Klaviyo reissue theirs; note the data date every time [22][23].
- **Email clients:** Can I email support tables, and Microsoft's new Outlook rollout stages [27][28].
- **Tools:** each ESP's AI features, connectors and pricing; check vendors' own pages before recommending one.

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` When Gmail complaints climb towards 0.1%, I cut sends to the least engaged contacts first and check what changed. (§5)
- `decision_rule` On a new domain or platform, I warm up from the most engaged contacts and slow down at the first deferral spike. (§5)
- `check` Any flow a purchase, booking or reply can satisfy gets an exit rule on that event, because "last chance" emails to buyers damage trust. (§5)
- `decision_rule` If a newsletter has nothing useful for the reader that week, I skip it; fewer, better issues. (§5)
- `decision_rule` When a test cannot reach enough clicks or orders per variant, I test on the biggest flow or across several sends, and read it on clicks or orders, not opens. (§5)

## 12. Defaults to avoid

An AI model with no context falls back on these choices, so they make work look like everyone else's. Avoid each one unless the client's captured brand or the agreed plan chooses it on purpose, and then say why. The full shared list is in tools/ai-default-patterns.md.

- **Stock AI phrasing.** Subject lines and body copy built on "Unlock", "Elevate", "Seamless" or "Game-changer". These read as machine-written; use the brand's own voice and specifics.
- **Rule of three everywhere.** Every email as three blocks or three tips. The rhythm reads as default; send one useful thing per email.
- **Headline formula subject lines.** "You won't believe...", "Don't miss out", "X things you need to know". They look like every other inbox line; name what is inside.
- **Fake urgency.** "Last chance" or "ends tonight" with no real deadline, or resent with the same "final" claim. It reads as default and breaks trust; state real deadlines only.
- **Benefits any competitor could claim.** Product emails that say "quality", "value" and "care". If a rival could send it unchanged, show the proof or the detail only this brand has.
- **Emoji icons.** Emoji in every subject line and as bullets in every section. Overuse reads as a template; use them only where the brand voice does.
- **One template for every send.** Hero image, three cards, CTA, whatever the message. Fit the layout to the job of the email.
