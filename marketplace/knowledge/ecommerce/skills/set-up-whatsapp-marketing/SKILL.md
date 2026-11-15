---
name: set-up-whatsapp-marketing
description: "A WhatsApp Business Platform marketing setup a store can run safely: the account and number checklist, opt-in points with exact wording, a starter set of templates sorted into utility and marketing so none are miscategorised, the product catalog link, journeys before broadcasts, and broadcast rules (who, how often, size against the messaging limit) that protect the number's quality rating. Every step is costed at Meta's per-message rates. Provider-neutral and global, with notes on markets where WhatsApp leads (much of Europe, Latin America, the Middle East and Asia), markets where SMS and email lead (US, Canada), consent rules such as GDPR, order confirmation for risky orders, and peak-season broadcasts. Use when a store starts WhatsApp marketing, moves from the WhatsApp Business app to the API, or after a number was restricted."
---

# WhatsApp marketing setup

**You get:** a setup checklist for the account and number, the opt-in wording for each capture point, a starter template set (category, purpose, variables, button) ready to submit, the catalog link steps, a journey list, written broadcast rules with a size and cost sheet, and a weekly quality check.

## When to use

- The store wants to market on WhatsApp and has only the free WhatsApp Business app.
- Broadcasts went out to everyone with a phone number and blocks are rising.
- A number was restricted or templates were paused and the store needs rules that keep it safe.
- The store sells where buyers read WhatsApp more than email (for example Brazil, Mexico, Spain, Italy, Germany, the Netherlands, the Gulf states, Indonesia and much of Africa).

## Not for

- Running sales chats, quick replies and working hours: use `set-up-whatsapp-sales-chat`.
- Writing the template and broadcast messages in full: use `write-sms-and-whatsapp-messages`.
- Consent records and SMS sender registration across channels: use `sms-and-whatsapp-compliance-setup`.
- Abandoned-cart recovery by chat: use `recover-carts-by-chat`.

## What you need

Required:

1. **Meta Business portfolio** owned by the store (not an agency), with an admin who can complete business verification. The client signs in; never ask for passwords.
2. **A phone number** for the API: a new number, or the current WhatsApp Business app number if the chosen provider supports using it on both (check this; otherwise the number leaves the app).
3. **Provider choice:** Meta's Cloud API directly (free to access, needs developer setup) or a solution provider with a dashboard (monthly fee). List the store's needs: Shopify triggers, order confirmation for risky or pay-on-delivery orders, broadcasts, shared inbox, the languages your buyers use.
4. **Customer phone list with opt-in records**: where and when each person opted in to WhatsApp.
5. **Gross profit per order** and the current message rates for the store's market from Meta's pricing page.

Optional: Shopify order export (for journey volumes), refused and failed delivery rate by payment method, the Facebook and Instagram sales channel catalog.

If opt-in records are missing, nobody on the old list gets marketing templates until they opt in again. Setup needs draft access (level 2) in Business settings; going live, submitting templates and every broadcast need the client's yes.

## Before you start: the gates

1. **Opt-in.** Pass when every marketing recipient opted in on a form that names the store and says they will get messages from it [EML-6320], and the record meets your market's consent rules (GDPR and the ePrivacy rules in the EU and UK, TCPA and state laws in the US, CASL in Canada). Fail: send only utility messages tied to their orders, and start collecting opt-in.
2. **Cost.** Meta charges per delivered template message by category and market [EML-6322]. Pass when each journey's expected gross profit exceeds its message cost.
3. **Someone answers.** Replies come back. Automated replies are allowed, but there must be a clear path to a person [CXP-6302]. Name who answers and when.
4. **Stop requests.** Every request to stop, on or off WhatsApp, must be honoured [EML-6320]. Pass when the provider or a person removes opt-outs the same day.

## Steps

### 1. Set up the account

1. Complete business verification in the Meta Business portfolio. It also lifts the messaging limit from 250 to 2,000 unique people a day once Meta approves [EML-6321].
2. Create the WhatsApp Business Account and add the number.
3. Set the display name to the store's brand name exactly as on the website; Meta reviews it.
4. Fill the profile: logo, short description, website, support email, hours.
5. Turn on two-step verification for the number; the PIN stays with the client.

### 2. Place the opt-in points

| Capture point | Wording (adapt to brand voice) | Default |
|---|---|---|
| Checkout | "Get order updates and offers from [store] on WhatsApp" | Unticked |
| Popup phone step | "Send me offers and news from [store] on WhatsApp. Stop any time." | Unticked |
| Order confirmation message | Button: "Yes, send me offers too" | Opt-in only on tap |
| Click-to-WhatsApp ad chat | Ask in chat; record the reply | Opt-in only on yes |
| Order confirmation page | Link "Get updates on WhatsApp" | Opt-in on click |

Store each opt-in with: phone, time, capture point, wording version. Order updates (utility) need the buyer to have given the number for that order; marketing needs the opt-in above.

### 3. Build the starter template set

Templates are reviewed by Meta and fall into marketing, utility or authentication. A utility message must be about a specific order and contain no offer; add a credit or discount and it becomes marketing, and repeated miscategorising can restrict utility templates [OPS-6286].

| Template | Category | Purpose | Variables | Button |
|---|---|---|---|---|
| Order confirmed | Utility | Confirms the order, items, total | Name, order number, total | Track order |
| Order confirm (risky or pay-on-delivery orders) | Utility | Ask to confirm or cancel the order before dispatch | Order number, total | Confirm, Cancel |
| Shipped | Utility | Tracking link | Order number, courier, link | Track |
| Delivered | Utility | Delivered, how-to-use link | Product | How to use |
| Pay-now nudge (where pay on delivery is offered) | Marketing | Small saving to pay online before dispatch | Order number, saving | Pay now |
| Abandoned checkout | Marketing | Return to checkout | Product, link | Complete order |
| Reorder reminder | Marketing | Running low, reorder link | Product, days | Reorder |
| New launch or restock | Marketing | Broadcast for opted-in, engaged buyers | Product, link | Shop now |
| Win-back | Marketing | Return after lapse | Product, offer, end date | Shop now |

Keep marketing templates short, with one link and one button. Never put an offer inside a utility template.

The order confirmation and pay-now nudge pay only if the refused or failed deliveries they prevent cost more than the messages and the saving offered; work it out with `store-meta-math` (practitioner default, test it).

### 4. Link the catalog

Connect the store's product catalog in Commerce Manager (the Facebook and Instagram sales channel on Shopify syncs it), then link it to the WhatsApp Business Account. This enables product and multi-product messages in chats and journeys. Check that prices and stock in the catalog match the store before any broadcast links to it.

### 5. Turn on journeys before broadcasts

Automated journeys tied to a trigger clicked at about 11% against about 2.6% for broadcasts across one market's brands [EML-0048]. Build in this order: order updates and order confirmation, abandoned checkout, reorder reminder, loyalty or points expiry (one brand used 60-day expiring coins with reminders [CXP-0019]), then win-back. Each journey is a hand-off from `email-sms-flow-plan` timing.

### 6. Write the broadcast rules

1. **Who:** opted-in buyers who ordered, clicked or replied in the last 90 days. Never the full phone list.
2. **How often:** two to four marketing broadcasts a month per person (practitioner default, test it). Each must carry something real: launch, restock, sale with a true end date.
3. **How many:** each day's unique recipients outside the service window must fit the current messaging limit, which is shared by every number in the portfolio [EML-6321]. Split large sends over days.
4. **When:** daytime local hours in each buyer's time zone; no night sends. Plan the peak seasons (Black Friday and Cyber Monday, the winter holidays, local festivals such as Ramadan and Eid, Lunar New Year or Carnival) in advance, since the limit and quality rating cap how many people a big send can reach.
5. **Stop:** an opt-out reply in any words removes the person from marketing the same day.
6. **Cost check:** recipients x marketing rate per message, against expected orders x gross profit per order.

### 7. Watch quality weekly

Check in WhatsApp Manager: phone number quality rating, messaging limit, template statuses, block and report counts. If quality drops to medium or low, pause broadcasts, cut the audience to the last 30 days of engaged buyers, and review the template copy. Scaling the limit needs high quality across all numbers and templates [EML-6321].

### 8. Market notes

- **Where SMS and email lead (US, Canada, and to a lesser degree the UK and Australia):** WhatsApp reaches fewer shoppers. Use it for buyers who choose it at checkout and for click-to-WhatsApp ad chats; keep the same opt-in and stop rules, and local consent law (TCPA, CASL) still applies.
- **Where WhatsApp leads:** it can be the main retention channel; give it its own journeys and budget line.
- **Rates:** Meta prices messages by the recipient's country code, so a store selling across countries costs each market separately.
- **Languages:** submit each template in the languages your buyers use; each language version is reviewed on its own.

## Checks before you hand it over

- Business verified, display name matches the brand, two-step PIN held by the client.
- Every opt-in point names the store and is unticked by default.
- No utility template carries an offer.
- Each journey and broadcast passes the cost check at current rates.
- Broadcasts go only to opted-in buyers engaged in the last 90 days, within the limit.
- A named person answers replies, with a path to a human.
- Opt-outs are removed the same day.
- Nothing was submitted, switched on or sent without a client yes.

## Output

1. **One-screen summary:** setup status, opt-in count, journeys to switch on first, broadcast rules, monthly message cost estimate.
2. **Setup checklist:** Step, Owner, Status, Date.
3. **Opt-in register fields:** Phone, Time, Capture point, Wording version, Status.
4. **Template sheet:** Name, Category, Language, Purpose, Body outline, Variables, Button, Status.
5. **Cost sheet:** Journey or broadcast, Monthly messages, Rate, Cost, Expected orders, Gross profit, Net.
6. **Weekly quality log:** Week, Quality rating, Limit, Blocks, Paused templates, Action.

## Common mistakes

- **Broadcasting to every phone number on file.** Gate 1 and step 6 send only to opted-in, engaged buyers.
- **Offers inside order updates.** Step 3 keeps utility templates offer-free.
- **Broadcasts before journeys.** Step 5 builds journeys first.
- **Ignoring the daily limit.** Step 6 splits large sends.
- **An agency-owned business portfolio.** The store owns the portfolio and number.
- **No one answering replies.** Gate 3 names the person.

## Sources

- EML-6320: WhatsApp opt-in requirements.
- EML-6321: messaging limits and quality.
- EML-6322: per-message pricing by category.
- OPS-6286: utility versus marketing templates.
- CXP-6302: automated replies need a path to a person.
- EML-0048: journeys beat broadcasts on clicks (one market's brand data).
- CXP-0019: expiring loyalty coins with reminders.

What makes this skill ours: journeys go live before any broadcast; every template is sorted so no offer hides in a utility message; each journey and broadcast is costed at the current per-message rate against gross profit; and the order confirmation and pay-now nudge are tied to the store's real cost of refused and failed deliveries.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. India is a main WhatsApp market: buyers read it more than email. The COD confirm template (utility) and the prepaid nudge (marketing) pay only if the RTO they prevent costs more than the messages and the saving. The journey click data [EML-0048] and the expiring coins example [CXP-0019] come from Indian brands. Plan festival broadcasts (Diwali, Raksha Bandhan) inside the messaging limit.
