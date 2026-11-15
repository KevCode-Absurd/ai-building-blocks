---
name: chat-sales-daily-report
description: "A one-page daily report for chat sales across WhatsApp, Instagram DMs and site chat: chats by source, first reply time against target, chats that hit the 24-hour window unanswered, orders and gross profit from chat, conversion, prepaid versus pay-on-delivery share and order confirmation, lost reasons from chat labels, messaging cost, and the three things to fix tomorrow, each tied to the number that triggered it. Includes how to count a chat order honestly (tagged links and draft orders, not guesswork), minimum sample rules so one bad day does not drive changes, and a sheet layout a person can fill in 15 minutes. Use when a store sells through chat and the owner cannot see whether it is working day to day."
---

# Chat sales daily report

**You get:** a daily chat sales report (one screen: 10 numbers, 3 fixes for tomorrow) and the sheet behind it with a data tab, a lost-reasons tab and a 7-day trend, filled in about 15 minutes from the inbox labels and Shopify orders.

## When to use

- The store sells through WhatsApp, Instagram DMs or site chat and has no daily numbers.
- The owner hears "chat is busy" but cannot see orders or profit from it.
- Response times slip at certain hours and nobody notices until buyers complain.
- A new chat agent or tool started and the owner wants to see the effect.

## Not for

- The weekly store-wide numbers: use `build-weekly-kpi-dashboard`.
- Support team targets, tags and routing: use `set-up-helpdesk-and-response-times`.
- Monthly themes from tickets for product and ads: use `turn-support-tickets-into-insights`.
- Setting up chat labels in the first place: use `set-up-whatsapp-sales-chat`.

## What you need

Required:

1. **Inbox data for the day**: new conversations by channel, first reply times, labels (the pipeline labels from `set-up-whatsapp-sales-chat`). From the helpdesk report, the WhatsApp provider's dashboard, or a manual count of labels in the WhatsApp Business app.
2. **Shopify orders for the day** with Tags, Note, Source, Landing site or UTM fields, Payment Method, Total, Line items.
3. **Gross profit per order** or per SKU on delivered costs [MEA-0037].
4. **Messaging cost** for the day from the provider's billing or rate card.

Optional: staff hours by person, ad spend on click-to-WhatsApp or click-to-Direct ads, order confirmation log for pay-on-delivery orders from `confirm-cod-orders-by-chat-or-call`.

Access: read only (level 1) across inbox, orders and billing. The report changes nothing; fixes it suggests go to the owner for a yes.

## Before you start: the gates

1. **Chat orders can be counted.** Pass: chat orders carry a tag, a draft-order source, a chat UTM (`utm_medium=chat` or `dm`) or an agent code. Fail: set this up first (one day's work); until then report chats and replies only, and say orders are not yet countable.
2. **Labels are used.** Pass: at least 80% of yesterday's chats carry a pipeline label (practitioner default). Fail: report the label rate first; lost reasons cannot be read without labels.
3. **Gross profit per order known.** Pass: the report shows gross profit. Fail: show revenue and mark it "revenue only".
4. **Same day, same clock.** Inbox and orders use the same time zone and cut-off. Fail: fix before comparing days.

## Steps

### 1. Count chats by source

New pre-sale conversations by channel (WhatsApp, Instagram, site chat, Messenger) and by entry point (product page button, ad, bio link) using the prefilled texts and keywords from setup. Leave out existing-order support chats and count them separately: if "where is my order" and other support chats crowd the sales inbox, sales replies slow down [CXP-0012].

### 2. Measure speed

- Median first reply time in staffed hours, and the share within target (for example 15 minutes on WhatsApp, 1 minute on site chat).
- Chats where the 24-hour window closed before a full answer: on WhatsApp, after that only paid templates to opted-in buyers are possible [EML-6322]. Report the count; each one is a lost free conversation.
- For chats from click-to-WhatsApp ads, the share answered inside 24 hours, since that opens the free window of up to 7 days [EML-6363].

### 3. Count orders and profit from chat

Orders attributed to chat by tag, draft order, UTM or agent code. Do not count an order just because the buyer once chatted. Report: orders, revenue, gross profit, chat conversion (orders divided by pre-sale chats), average order value, and prepaid versus pay-on-delivery share where the store offers pay on delivery.

Pay-on-delivery orders (cash on delivery, offered as a payment option in some markets) show as unpaid in Shopify until cash is collected [SET-6186], so report them as placed and confirmed, not paid, and accrue the expected failed-delivery and return loss at the store's rate rather than waiting weeks for parcels to come back [MEA-0028].

### 4. Read the lost reasons

Count chats labelled Lost: price, Lost: delivery, Lost: no reply, Lost: other. Read 5 transcripts from the biggest reason and write the pattern in one line ("delivery to tier-3 pincodes quoted 7 to 9 days").

### 5. Work out the day's chat contribution

Chat contribution = gross profit from chat orders minus messaging cost minus chat staff cost for the day (minus ad spend on chat ads, if any). Keep fixed costs out of the daily number; spreading rent and salaries of other teams across days makes good days look bad [MEA-0030].

### 6. Find the cause before the fix

When chat revenue moves, split it: chats x conversion x average order value [MEA-0009]. Name which part moved. A drop in chats is a traffic or ad problem; a drop in conversion is a reply, stock or price problem; a drop in order value is an offer problem.

### 7. Pick three fixes for tomorrow

Each fix names the number that triggered it, the owner and the change. Rules:

- Act on a lost reason only when it holds at least 20 chats over the last 7 days (practitioner default), not on one day.
- Speed fixes come first: staff the slow hours, clear unanswered chats before windows close.
- Script fixes go to `write-chat-sales-scripts`; price pattern fixes to `handle-price-objections-in-chat`; delivery promises to the fulfilment owner.

Example fixes:

| Trigger | Fix | Owner |
|---|---|---|
| 31% of chats after 8 pm waited over an hour | Move one person's shift to 12 to 9 pm | Owner |
| 14 chats closed window unanswered | Clear the queue at 6 pm daily | Chat lead |
| Lost: delivery 22 of last 60 chats | Add postcode delivery dates to the `/delivery` reply | Chat lead |

### 8. Keep a 7-day trend

Under the day, show the last 7 days for chats, median reply time, conversion, gross profit and contribution. Judge on the 7-day line, not one day.

### Notes by market

- **Where pay on delivery is common:** report its share, confirmation rate and prepaid conversion after confirmation. If the team answers in more than one language, report chats by language. Where WhatsApp is the main chat app (much of Europe, Latin America, the Middle East and Asia), it is usually the largest source.
- **US, Canada, UK and Australia:** site chat, Instagram and SMS replies are often larger than WhatsApp; split SMS replies out if the store texts buyers.

## Checks before you hand it over

- Chat orders are counted only by tag, draft order, UTM or agent code.
- Support chats are counted apart from sales chats.
- Window-closed-unanswered chats are reported.
- Gross profit and contribution use delivered costs and leave fixed costs out.
- Pay-on-delivery orders are shown as placed and confirmed, with expected losses accrued.
- Each of the 3 fixes names its trigger number and owner.
- Lost-reason fixes rest on at least 20 chats over 7 days.

## Output

1. **One-screen daily report:**

| Line | Today | 7-day average |
|---|---|---|
| Pre-sale chats (by channel) | | |
| Median first reply (staffed hours) | | |
| Share within target | | |
| Windows closed unanswered | | |
| Chat orders | | |
| Chat conversion | | |
| Gross profit from chat | | |
| Prepaid share / pay-on-delivery confirmed | | |
| Messaging and staff cost | | |
| Chat contribution | | |

Then: top lost reason with its one-line pattern, and the 3 fixes (Trigger, Fix, Owner, Due).

2. **Data tab:** Date, Channel, Entry point, Chats, Support chats, Median reply, Within target, Windows closed, Orders, Revenue, Gross profit, Prepaid, Pay on delivery, Pay on delivery confirmed, Messaging cost, Staff cost, Contribution.
3. **Lost reasons tab:** Date, Reason, Count, Pattern, Example chat link.
4. **Trend chart:** 7 days of chats, conversion and contribution.

## Common mistakes

- **Counting every order from anyone who ever chatted.** Step 3 counts tagged orders only.
- **Support chats mixed into sales numbers.** Step 1 separates them.
- **Revenue as the headline.** Step 5 reports contribution.
- **Changing scripts after one bad day.** Step 7 needs 20 chats over 7 days.
- **Pay-on-delivery orders counted as cash.** Step 3 shows them as placed and confirmed.
- **Fixes with no owner.** Step 7 names one for each.

## Sources

- MEA-0037: delivered gross margin.
- MEA-0030: daily contribution margin without fixed costs.
- MEA-0009: revenue as traffic x conversion x order value.
- MEA-0028: accrue expected returns.
- CXP-0012: "where is my order" contacts and their share of tickets.
- SET-6186: Shopify pay-on-delivery (cash on delivery) orders unpaid until marked paid.
- EML-6322: WhatsApp 24-hour window.
- EML-6363: free window after click-to-WhatsApp ads.

What makes this skill ours: it counts only chat orders that can be proven, reports chats lost to a closed WhatsApp window, shows contribution after messaging and staff cost instead of revenue, splits any change into chats, conversion and order value before naming a fix, and refuses to act on lost reasons from fewer than 20 chats.

## Selling in India

- COD is often a large share of chat orders in India. Report COD share, the confirmation rate from `confirm-cod-orders-by-chat-or-call` and how many buyers switch to prepaid after confirming.
- Accrue the expected RTO loss on COD orders on the day they are placed.
- WhatsApp is usually the largest chat source. If the team answers in Hindi, Hinglish or a regional language, report chats by language.
