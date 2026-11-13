---
name: post-purchase-how-did-you-hear-survey
description: "A post-purchase 'how did you hear about us' survey set up for first-time buyers, with the exact question, answer list and follow-up, where it goes on Shopify's upgraded thank-you page or in a WhatsApp or email message for COD buyers, and a monthly reading sheet that sets survey answers beside ad spend, UTM data and platform-reported purchases to show what really drives new buyers. Includes sample-size rules, the channels surveys under-count, and a free path. Use when platforms all claim the same sales, before moving budget between channels, or to see word of mouth, creators and AI assistants that leave no click."
---

# How-did-you-hear-about-us survey

**You get:** a ready survey (question, answer options in the store's channels, one follow-up, placement and display rules), the set-up list for the client to approve, and a monthly reading sheet that compares each channel's share of survey answers with its share of spend and of platform-claimed purchases, with a verdict per channel.

## When to use

- Meta, Google and email together claim more sales than the store made.
- The owner wants to move budget between channels and needs a second view besides platform reports.
- Word of mouth, creators, podcasts, retail or AI assistants may be driving buyers but leave no click.
- The store is launching a channel that is hard to track (offline, creators, TV, out of home).

## Not for

- Delivery or support satisfaction scores: use `run-nps-and-csat-surveys`.
- Deep interviews about why people buy: hand to the customer research agent's interview skills.
- Weekly reconciliation of platform claims with store orders: use `blended-channel-profit-view`; it reads this survey.
- Proving a channel causes sales: use `measure-channel-lift-with-holdouts`.

## What you need

1. **Channels in use**: every paid, owned and earned channel the store runs, plus spend by channel for the last 3 months.
2. **Shopify plan and thank-you page state**: whether the store can add app blocks to the Thank you and Order status pages (all stores were moved to the upgraded pages after 26 August 2026 [MEA-6226]).
3. **Order volume**: first-time orders per month, and COD share (India).
4. **A survey tool**: any post-purchase survey app that writes answers against the order number. Free path: a one-question form linked from the order confirmation email or WhatsApp message with the order number filled in, answers kept in a sheet.
5. For reading: Shopify order export (Name, Created at, Email or Phone, Subtotal, Financial Status), ad spend by channel, platform-reported purchases on 7-day click.

Installing an app or editing the thank-you page is a live change (level 3) and needs the client's yes on the exact set-up list. Sending the survey by WhatsApp or email to buyers is a customer message: the client approves the message text and the audience before anything sends, and only to buyers who can lawfully receive it.

## Before you start: the gates

1. **Volume.** Pass when the store expects at least 100 first-time answers per reading window. Under that, read quarterly, or use the survey only for its open answers [MEA-0045].
2. **Joinable answers.** Pass when every answer carries the order number. Answers without it cannot be tied to new versus returning buyers or to order value.
3. **Gross profit per order known** before the reading turns into a budget call. Without it, report shares only.
4. **Privacy.** Ask nothing personal beyond the channel and a reason. No incentive that requires more data. Keep answers inside the store's tools.

## Steps

### 1. Write the question

Main question, single choice: "Where did you first hear about us?" "First" matters: it asks about discovery, which platforms cannot see, rather than the last thing clicked.

Optional follow-up, open text, one only: "What almost stopped you from buying today?" It surfaces objections in the buyer's own words for the page and ads team [CRO-0018] [LPG-0042]. Never add more than two questions; completion falls with every extra step (practitioner default).

### 2. Build the answer list

8 to 12 options from the channels the store really uses, in plain buyer words, not marketing words:

- Instagram, Facebook, YouTube, TikTok (each separate if the store runs them)
- Google search
- AI assistant (ChatGPT, Gemini, Perplexity or similar): AI mentions rarely carry a link, so this is the main way to see them [AEO-0010]
- Friend or family
- A creator or influencer (with an optional "who?" text box)
- Email or WhatsApp from us (for buyers who were subscribers before buying)
- Podcast, TV, news article
- Amazon or another marketplace, a shop or event
- Other (type it)

Shuffle the order for each buyer, keeping Other last, so no channel wins by sitting at the top. Do not offer "Don't remember" as a default; let the buyer skip instead.

### 3. Decide who sees it and where

- Show it to **first-time buyers only**, or tag every answer new or returning and read only new ones. Returning buyers answer "email" and blur the picture.
- **Prepaid orders:** the survey block on the Thank you page, under the order summary.
- **COD orders (India):** many buyers never wait on the thank-you page; send the question in the order confirmation WhatsApp message as tappable reply buttons or a short link, once, with the order number attached. One message, no reminder unless the client approves a reminder.
- **Marketplace and draft orders:** excluded.

### 4. Map answers to channels

Write a mapping table from each answer to the reporting channel used in GA4 and the KPI sheet (paid social, search, creators, WhatsApp, word of mouth, AI assistants, offline). "Instagram" can mean an ad, a creator or the brand's own posts; if paid social is a large share of spend, add a follow-up only for that answer: "Was it an ad, a creator, or our page?"

### 5. Set it up

Prepare the list for the client: tool or form, question, options, shuffle, audience rule, placement, WhatsApp or email text, where answers land. After the yes, place one test order of each type (prepaid and COD) and confirm the answer lands with the right order number.

### 6. Read it monthly

For new-customer answers only, per channel:

- **Survey share** = answers naming the channel / all answers (skips removed).
- **Spend share** = channel spend / total ad spend.
- **Claimed share** = platform-reported purchases on 7-day click / sum of all platforms' claims.
- **Survey CAC** = channel spend / (survey share x new customers that month).

Rule of thumb from a large brand: a channel's survey share should roughly match its spend share; a channel taking half the budget and far fewer answers is spending into a hole [MEA-0045]. Then compare survey CAC with the first-order gross profit to see which channels pay.

Adjust for known biases before any verdict:

- Surveys under-credit channels people do not remember: display, retargeting, branded search. Treat a low share there as "unknown", not "zero" [MEA-0045].
- Word of mouth grows slowly and is often caused by earlier spend; track its share over months as a health sign [CXP-0022].
- Any channel with under 30 answers in the window is not read alone (practitioner default); merge months.

### 7. Give a verdict per channel

One of: **confirmed** (survey share near or above spend share and survey CAC under first-order gross profit), **over-claimed** (platform claims far above survey share), **under-credited** (survey share well above spend share or claimed share: likely doing more than reports show), **unclear** (too few answers or a bias case). Verdicts guide where to test, not where to cut: hand any cut or scale over 20% of a channel's budget to `measure-channel-lift-with-holdouts` first (practitioner default).

### 8. Use the open answers

Group the "almost stopped me" answers into themes each month, top five with counts and three real quotes each, and send them to the page and ad teams. Quotes are used only with the buyer's words unchanged and no name.

## Checks before you hand it over

- The question asks where the buyer first heard, single choice, with shuffled options and Other last.
- Options match the store's real channels and include AI assistant and friend or family.
- Only first-time buyers are read; every answer carries the order number.
- COD buyers are reached by one approved message; nothing sent without the client's yes.
- The mapping table links every answer to a reporting channel.
- The monthly sheet shows survey share, spend share, claimed share and survey CAC.
- Channels under 30 answers are marked unclear.
- No answer is published or used in ads with a name.

## Output

**1. One-screen summary:** the question, options, placement, expected answers per month, and (after the first month) the verdict per channel with one line of evidence each.

**2. Set-up list for approval**

| # | Change | Where | Tool or free path | Access level | Approved |
|---|---|---|---|---|---|

**3. Mapping table:** Answer option, Reporting channel, Notes.

**4. Monthly reading sheet**

| Channel | Answers | Survey share | Spend | Spend share | Platform-claimed purchases | Claimed share | New customers implied | Survey CAC | First-order GP | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|

**5. Objection themes:** Theme, Count, Three quotes, Sent to.

## Common mistakes

- **Asking returning buyers.** They answer "email" and drown discovery; step 3 limits to first-time buyers.
- **Thank-you page only in a COD market.** COD buyers skip it; step 3 adds an approved WhatsApp question.
- **A fixed option order.** The top option wins; step 2 shuffles.
- **Reading low-volume months.** Step 6 merges until channels pass 30 answers.
- **Cutting retargeting because nobody named it.** Step 6 marks it unknown, not zero.
- **Treating the survey as proof.** It is memory, not cause; step 7 sends big moves to a holdout.

## Sources

- MEA-6226: Shopify moved stores to upgraded Thank you and Order status pages after 26 August 2026.
- MEA-0045: survey share should roughly match spend share; under-credits display and retargeting.
- AEO-0010: AI mentions rarely carry links; add AI assistant to the survey.
- CRO-0018: ask what almost stopped the purchase.
- LPG-0042: post-purchase survey on the thank-you page, high completion.
- CXP-0022: track word-of-mouth share over time.

What makes this skill ours: COD buyers are reached with one approved WhatsApp question instead of a thank-you page they never see; answers are read for first-time buyers only and turned into a survey CAC set against first-order gross profit; and each channel gets a verdict that sends big budget moves to a holdout test rather than straight to a cut.
