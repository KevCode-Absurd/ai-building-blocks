---
name: write-chat-sales-scripts
description: "A set of 15 to 25 ready chat replies for the questions buyers ask before they buy, counted from the store's own chat history, each written to answer the question with a checked fact, recommend one product or variant that fits what the buyer said, and ask for the order with one clear next step. Each reply has a short and a full version, a clarifying-question version, one real review that answers the same doubt, the source of every fact, and a rule for when to hand the chat to a person. Works for WhatsApp, Instagram, site chat and Messenger, with India notes for COD, delivery by pincode and regional languages. Use when chat replies are slow, inconsistent or answer without ever asking for the order."
---

# Chat sales scripts

**You get:** a reply library of 15 to 25 pre-purchase questions, ranked by how often buyers ask them, each with a short reply, a full reply, a clarifying question, a proof line, the fact source and the hand-off rule, ready to load as quick replies or saved replies.

## When to use

- Chat volume is growing and every team member answers the same question differently.
- Replies answer the question but never suggest a product or ask for the order.
- A new person or an AI assistant is about to answer sales chats and needs approved wording.
- The store opened WhatsApp or Instagram sales through `set-up-whatsapp-sales-chat` and needs quick replies.

## Not for

- Price pushback ("too expensive", "cheaper elsewhere"): use `handle-price-objections-in-chat`.
- Suggesting add-ons and bundles: use `upsell-and-cross-sell-in-chat`.
- Replies about existing orders, returns and complaints: use `build-support-macros-from-top-tickets`.
- Loading answers into a bot: use `train-support-chatbot-on-store-faqs` after this skill.

## What you need

Required:

1. **Chat history**: the last 200 to 300 pre-purchase chats, from WhatsApp chat export (text file per chat), the Instagram inbox, the helpdesk export or site chat transcripts. Fewer than 100: add support tickets, product page questions and reviews, and mark the ranking "thin".
2. **Product pages and specs** for the products asked about.
3. **Policy pages**: shipping times and areas, COD, returns, warranty, payment methods.
4. **Reviews export** (CSV with rating, text, date, product, verified flag).
5. **Approved claims list**, or `product-claims-profile` output if it exists.
6. **Gross profit per product**, so recommendations lean to products that earn.

Optional: post-purchase survey answers, brand voice notes, regional language needs.

Access: read only (level 1) to write the library. Loading quick replies into a live account is level 2 and needs the client's yes; no buyer gets a new script until the client approves the library.

## Before you start: the gates

1. **Facts are sourced.** Every number, time, ingredient, material and promise in a reply links to a page or document dated within 90 days. Fail: leave that reply out and name the missing fact in one line.
2. **Claims are allowed.** Health, safety, results and comparison claims need proof the store can show on demand; in India the ASCI Code requires it [ADC-6146]. Fail: rewrite to what the proof says.
3. **Gross profit per product known.** Pass: step 4 recommends from it. Fail: recommend by fit only and mark it.
4. **Someone owns hand-offs.** A named person takes chats the scripts must not answer. Fail: hand-off rule says "email us" with a stated reply time.

## Steps

### 1. Count the questions

Read each chat and tag the buyer's first real question into one type: fit or size; will it work for me; ingredients, material or safety; delivery time, area or cost; COD and payment; returns and warranty; price or discount; comparison with another product; gift; stock or restock; how to use. Count each type and keep the buyer's exact words for the top examples. The "what almost stopped you" answers from a post-purchase survey are the best second source [CRO-0018].

Keep the types that cover most chats, usually 15 to 25. Price types go to `handle-price-objections-in-chat`.

### 2. Build the fact sheet

For each type, write the one fact the reply depends on, with source and date: "Delivery to metro pincodes 2 to 4 days (shipping policy, checked 13 Nov)". Where the answer differs by product or pincode, write the lookup rule, not one number.

### 3. Write each reply in three moves

Every reply does three things, in this order:

1. **Answer** in one or two lines with the fact. No warm-up.
2. **Recommend** one product or variant that fits what the buyer said, with one reason in their words. Where quantity depends on use, tie the choice to their situation (one person or a family, small room or large) [OFF-0018].
3. **Ask** one question that moves to the order: "Shall I send the link for size M?" or "Want me to check delivery to your pincode?"

Rules:

- Keep a short version under about 40 words and a full version under about 80 (practitioner default for phone screens, test it).
- One question per message. Two questions get one answer.
- Write a clarifying version for when the buyer has not said enough: one question that gets the missing fact ("Is it for oily or dry skin?").
- When the store has a gross profit split between two fitting products, recommend the one that earns more only if it fits the buyer equally well. Fit wins.

### 4. Add one proof line

For each reply, pick one real review that answers the same doubt, in the customer's words, with the reviewer's first name or initial and date [LPG-0005] [LPG-0053]. Use verified reviews only, never edit their meaning, and never write a review. If no review answers the doubt, use a policy (returns, warranty) instead.

### 5. Write the order step

Give the agent the exact closing actions:

- Product link with the variant selected and a UTM tag (`utm_medium=chat&utm_content=<agent>`).
- A cart or invoice link: in Shopify, a draft order sends the buyer a checkout link with the items already in it.
- On WhatsApp, the catalog item or cart.
- COD: the agent places nothing on the buyer's behalf without a clear yes and the buyer's address in their own words.

Never ask for card numbers, OTPs or UPI PINs in chat. Payment happens on the checkout or gateway page.

### 6. Plan the follow-up

If the buyer goes quiet after a link, send one nudge 3 to 4 hours later inside the same day, ending with a simple question [EML-0035]. On WhatsApp, free replies are only possible while the 24-hour window from the buyer's last message is open; after that, only paid templates to buyers who opted in [EML-6322]. Then stop and label the chat "Lost: no reply".

### 7. Set the hand-off rules

Hand the chat to a person, saying so, when the buyer asks for a person, asks a medical, legal or safety question, is angry, wants a custom or bulk order, or the cart is above the store's high-value line. Automated replies on WhatsApp must offer a clear path to a human [CRO-6361], and automated chats on Instagram should say they are automated [ORG-6365].

### 8. Languages and tone

Write in the brand's voice (read 5 real brand lines beside 5 of yours). For Hindi, Hinglish or a regional language, a native speaker writes or checks each reply; machine translation alone changes meaning in product facts.

### India and US notes

- **India:** delivery time by pincode, COD availability and fee, prices including GST, open-box delivery only if the courier offers it. A buyer who chats before a COD order is a good moment to mention prepaid options plainly, never as pressure.
- **US:** sales tax added at checkout, shipping cut-off times, returns window in days; texting replies to buyers who opted in by SMS follow `sms-and-whatsapp-compliance-setup`.

## Checks before you hand it over

- Every reply answers, recommends one thing and asks one question.
- Every fact has a source and a date within 90 days.
- No claim goes beyond the approved claims list.
- Every proof line is a real, verified review, unedited in meaning.
- Each reply has short, full and clarifying versions.
- Hand-off rules name the person or route and the reply time.
- No reply asks for card details, OTPs or PINs.

## Output

1. **One-screen summary:** the top 10 questions by count, the share of chats they cover, and the 3 replies most likely to lift orders.
2. **Reply library:** Rank, Question type, Buyer's words (example), Short reply, Full reply, Clarifying question, Recommend rule, Proof line (review, date), Order step, Fact source and date, Hand-off rule, Quick reply shortcut.
3. **Fact sheet:** Fact, Value or lookup rule, Source, Date checked, Owner.
4. **Left out:** each reply dropped for a missing fact, with that fact in one line.

Example row (fill with the store's facts):

| Field | Example |
|---|---|
| Question type | Will it fit me |
| Buyer's words | "I'm 5'4 and usually M, which size?" |
| Short reply | "At 5'4 most buyers who wear M take M in this fit; it's relaxed at the waist. Want the link for M?" |
| Proof line | A verified review on fit, first name and date |
| Hand-off | Between two sizes and wants measurements checked: to a person |

## Common mistakes

- **Answer, then silence.** Step 3 ends every reply with one question toward the order.
- **Replies built from guesses about what buyers ask.** Step 1 counts real chats.
- **Facts that drift.** Step 2 dates every fact and step 5 links to live pages.
- **Made-up or edited reviews.** Step 4 uses only verified reviews.
- **Chasing after the window closes.** Step 6 sends one nudge, then stops.
- **Bots that trap buyers.** Step 7 hands off with a stated route.

## Sources

- CRO-0018: ask buyers what almost stopped them.
- LPG-0005, LPG-0053: proof chosen to answer one objection each.
- OFF-0018: tie the size or quantity to the buyer's real use.
- EML-0035: end a message with a simple question to start a conversation.
- EML-6322: 24-hour window and template categories on WhatsApp.
- CRO-6361: human path for automated WhatsApp replies.
- ORG-6365: Instagram automated chats should say they are automated.
- ADC-6146: India's ASCI Code on substantiated claims.

What makes this skill ours: replies are ranked by the store's own chat counts, every one ends with an order step, each carries a dated fact source and a real review that answers the same doubt, and follow-ups are timed to WhatsApp's 24-hour window instead of paid templates.
