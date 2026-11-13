---
name: set-up-whatsapp-sales-chat
description: "A working WhatsApp sales channel for a store: the right account type (free Business app or the API through a provider), a business profile, a catalog of the products worth selling in chat, greeting and away messages, quick replies, a label set that doubles as a sales pipeline, working hours with a reply target, trackable entry points from the site, Instagram and ads, and a 10-chat test before go-live. Built around WhatsApp's own opt-in, 24-hour window and human handoff rules, with India notes for COD, UPI and GST-inclusive prices. Use when a store is opening WhatsApp for sales, moving from a founder's personal phone to a business setup, or adding click-to-WhatsApp ads."
---

# WhatsApp sales chat setup

**You get:** a set-up WhatsApp sales channel ready for its first chats: account type chosen with the reason, profile filled, a catalog of 10 to 30 products, greeting and away messages, 15 to 25 quick replies loaded, 11 pipeline labels, hours and a reply target, tracked entry links for each source, and a signed-off 10-chat test sheet.

## When to use

- The store wants to sell through WhatsApp and has no business setup yet.
- Chats run on the founder's personal phone and orders get lost.
- The store is about to run click-to-WhatsApp ads and needs the chat side ready first.
- Two or more people now answer chats and nobody knows who replied to whom.

## Not for

- Broadcasts, marketing templates and opt-in growth: use `set-up-whatsapp-marketing`.
- Consent records, DLT, TCPA and quiet hours across SMS and WhatsApp: use `sms-and-whatsapp-compliance-setup`.
- Writing the replies themselves: use `write-chat-sales-scripts` (this skill loads them as quick replies).
- One shared inbox for email, site chat, WhatsApp and social: use `set-up-helpdesk-and-response-times`.

## What you need

Required:

1. **A phone number** the business controls that is not the founder's personal WhatsApp. A number already on personal WhatsApp has to be moved off it first; check WhatsApp's help page for the current steps.
2. **Product list** with title, price, a 2-line description, main image and product URL (Shopify product export: Handle, Title, Variant Price, Image Src).
3. **Gross profit per product**, from `build-sku-profit-sheet`. Missing: build it first or pick catalog items by units sold and mark the choice "provisional".
4. **Chat volume estimate**: chats a day now (count the last 7 days on the current phone or inbox), and who will answer, with their hours.
5. **Policies**: shipping areas and times, COD rules, returns, payment methods.

Optional: last 100 chats exported (WhatsApp lets you export a chat as a text file), Instagram handle, ad plans, regional languages the team can answer in.

Access: read access to the store (level 1). Creating the profile, catalog and messages is draft work (level 2) the client can see before anyone messages buyers. Switching on greeting messages, publishing the catalog and linking the number on the site happen only after the client says yes. The client signs in to WhatsApp and Meta themselves; never ask for codes or passwords.

## Before you start: the gates

1. **Gross profit per order known.** Pass: the catalog and the reply target are set from it. Fail: build it in `build-sku-profit-sheet` first, or go ahead with a "provisional" catalog and review it in 2 weeks.
2. **Product allowed on WhatsApp.** WhatsApp bans commerce in illegal goods and in listed regulated categories, some allowed only in some countries and only on the API [EML-6320]. Fail: do not build a catalog; use chat for support only and tell the client why.
3. **Someone can answer.** Pass: a named person covers the stated hours. Fail: set hours to what is covered, and say so in the greeting. A sales channel nobody answers costs more trust than it earns [CXP-0009].
4. **Consent plan.** A buyer who messages first can be answered; later marketing needs a recorded opt-in, and every stop request must be honoured, on or off WhatsApp [EML-6320]. Fail: no marketing sends until `sms-and-whatsapp-compliance-setup` is done.

## Steps

### 1. Choose the account type

| Situation | Choose |
|---|---|
| Under about 40 sales chats a day, one or two people answering, no automation needed | Free WhatsApp Business app |
| More chats, three or more people answering at once, order alerts from Shopify, templates after 24 hours, or a bot | WhatsApp Business Platform (API) through a provider |

The 40-chat line is a practitioner default; test it against how long buyers wait. The API costs money per message by category, and since 1 October 2026 non-template service replies are charged beyond 1,000 a month per number [EML-6322]. Cost the API from the store's chat count and the provider's rate card before choosing it. Free path: start on the app and move later; labels and quick replies are rebuilt in the new tool.

### 2. Fill the business profile

Display name matching the store name, category, short description (what you sell, where you deliver, COD yes or no), website, email, hours, and address or "online only". Every fact in the profile must match the site's policy pages.

### 3. Build the catalog

- Choose 10 to 30 products, not the whole store: the products buyers ask about most in chat (count them in the chat export) ranked by gross profit per order, plus one entry product under the store's median price.
- Each item: title as on the site, price as charged at checkout, 2-line description in buyer words, main image, product URL with a UTM tag (`utm_source=whatsapp&utm_medium=chat&utm_campaign=catalog`).
- Where Meta's commerce tools can sync from Shopify, sync instead of typing, so prices and stock stay in step. Manual path: a weekly check of catalog prices against the site.
- Remove or hide anything out of stock. A price in chat that differs from checkout is a broken promise.

### 4. Write the greeting and away messages

Greeting (first message from a new contact): who they are talking to, hours, how fast a person replies, and one question to start ("What are you shopping for today?"). If replies come from automation, say so and give a way to reach a person; WhatsApp requires a clear path to a human for automated replies [CRO-6361].

Away message: when someone will reply, plus a link to the FAQ or catalog so the buyer can keep going.

### 5. Load the quick replies

Load 15 to 25 shortcuts from `write-chat-sales-scripts`. Name them so any team member can find them: `/size`, `/delivery`, `/cod`, `/returns`, `/pay`, `/link`, `/thanks`. Each one is checked against the live policy page on the day it is loaded.

### 6. Set the labels as a pipeline

Labels let the daily report count chats by stage. Use exactly these:

| Label | Meaning |
|---|---|
| New enquiry | First message, not yet answered |
| Needs info | Waiting on the buyer's answer |
| Link sent | Product, cart or payment link sent |
| Order: prepaid | Paid order placed |
| Order: COD | COD order placed |
| COD to confirm | COD order waiting for confirmation |
| Lost: price | Left over price |
| Lost: delivery | Left over delivery time, area or cost |
| Lost: no reply | Went quiet after our last message |
| Lost: other | Write the reason in the chat note |
| Support | An existing order issue, move to support |

### 7. Set hours and the reply target

Set hours to the covered hours only. Reply target in hours: first reply within 15 minutes (practitioner default, test it). Every chat must get a full answer while its 24-hour window is open; after it closes, only paid templates can be sent, and only with consent [EML-6322]. Plan staff from the 7-day chat count; higher-priced products bring many more questions per order [OPS-0006].

### 8. Create tracked entry points

Use WhatsApp's click-to-chat link (`https://wa.me/<number>?text=<prefilled text>`) with a different prefilled text per source, so the first message shows where the buyer came from:

| Source | Prefilled text |
|---|---|
| Product page button | "Hi, I have a question about [product]" |
| Site chat icon | "Hi, I need help choosing" |
| Instagram bio | "Hi, I came from Instagram" |
| Click-to-WhatsApp ad | Set in the ad; one per campaign |

Chats from click-to-WhatsApp ads get a free window of up to 7 days once the store replies inside 24 hours [EML-6363]; reply fast so it opens. In India, automated WhatsApp journeys have drawn far higher click rates than broadcasts in a large cross-brand data set [EML-0048], so chat entry points tied to buyer actions beat blasts.

### 9. Add consent capture

When a chat ends with an order, ask once: "Can we send you offers and new arrivals on WhatsApp? Reply YES." Record the answer, date and chat in the contact note or a sheet. No answer means no marketing.

### 10. Run the 10-chat test

From two other phones, run 10 test chats: in hours, after hours, a catalog order, a COD question, a delivery-area question, a stop request, a price question, a size question, a request for a person, and a payment link. Pass each line on the test sheet before asking the client to go live.

### India and US notes

- **India:** show prices including GST; say clearly if COD is open and any COD fee; send UPI payment links from the store's payment gateway, never personal UPI IDs. Load regional-language quick replies only if someone on the team reads that language. Never ask for card numbers, OTPs or UPI PINs in chat.
- **US:** WhatsApp is less used; add Messenger, Instagram and SMS entry points. Texting consent rules differ: send SMS work to `sms-and-whatsapp-compliance-setup`.

## Checks before you hand it over

- The number is a business number and not the founder's personal WhatsApp.
- Every catalog price matches checkout today, and no catalog item is out of stock.
- Greeting and away messages state hours and reply time, and offer a path to a person.
- All 11 labels exist and match the daily report.
- Each entry point has its own prefilled text or UTM.
- No marketing message is planned to anyone without a recorded opt-in.
- All 10 test chats pass.
- The client approved go-live in writing.

## Output

1. **One-screen summary:** account type and why, hours, reply target, catalog count, go-live date, and the 3 things the client must approve.
2. **Setup sheet:** Item, Setting, Value, Source checked, Date, Status (draft or live).
3. **Catalog sheet:** Product, Price incl. tax, Gross profit per order, Chat demand (count), Description, Image, URL with UTM, In stock.
4. **Message card:** greeting, away message, consent question, final wording.
5. **Entry point table:** Source, Link, Prefilled text, Where placed.
6. **Test sheet:** Test, Phone used, Expected, Result, Pass or fail, Fix.

## Common mistakes

- **Running sales on a personal phone.** Step 1 moves to a business number that a team can share.
- **Whole-store catalogs with stale prices.** Step 3 keeps 10 to 30 products checked weekly.
- **Bots with no way out.** Step 4 adds the human path WhatsApp requires.
- **Labels nobody uses.** Step 6 makes them the pipeline the daily report reads.
- **Paying for templates to answer old questions.** Step 7 answers inside the 24-hour window.
- **Treating an order phone number as consent.** Step 9 asks and records it.

## Sources

- EML-6320: WhatsApp contact needs opt-in; stop requests honoured; banned categories.
- CRO-6361: automation needs a clear human path; 24-hour window.
- EML-6322: per-message pricing, template categories, service message charges.
- EML-6363: free entry point window after click-to-WhatsApp ads.
- EML-0048: automated WhatsApp journeys beat broadcasts in India.
- OPS-0006: higher order values bring more contacts per order.
- CXP-0009: low-effort service builds loyalty; high effort breeds disloyalty.

What makes this skill ours: the catalog is chosen by chat demand and gross profit, not uploaded whole; labels are a sales pipeline the daily report can count; every entry point carries its own source; and the account choice is costed against WhatsApp's 2026 pricing rather than picked by habit.
