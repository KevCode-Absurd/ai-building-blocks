---
name: write-faq-from-tickets-and-reviews
description: "Writes the store's FAQ from what buyers really ask: support tickets, chats, WhatsApp messages, reviews and on-site search, counted and grouped, then answered in short plain answers that match live policy, and placed where each question comes up (product page, cart, collection, help page, order emails). Each answer has a source and an owner, and the set is checked so the text is visible to answer engines. Use when the same questions keep reaching support, when buyers leave product pages to ask something, or when the help page was written from guesses."
---

# FAQ built from real questions

**You get:** a counted question list, 15 to 40 written answers, and a placement map that puts each answer on the page or message where the question comes up (product, collection, cart, help centre, order emails), with the source and owner of every answer, ready for the client to approve and load.

## When to use

- Support answers the same 10 questions every week.
- Buyers ask about sizing, delivery, COD or ingredients in chat before buying.
- The help page was written at launch and does not match current policy.
- Reviews show buyers were surprised by something the page never said.

## Not for

- Ready replies for agents to send: `build-support-macros-from-top-tickets`.
- A monthly report of ticket themes for product and ads teams: `turn-support-tickets-into-insights`.
- Loading answers into a chatbot: `train-support-chatbot-on-store-faqs` (it can take this FAQ as input).
- Long pages written to rank for buyer questions in search and AI tools: `answer-pages-for-buyer-questions`.
- Order-status questions as a system problem: `cut-where-is-my-order-tickets`.

## What you need

Required (read access, level 1):

1. **Support export, last 90 days**: ticket or chat ID, date, channel (email, chat, WhatsApp, Instagram), subject, first customer message, tags. From the helpdesk (Gorgias, Zendesk, Freshdesk) or, with no helpdesk, a copy of inbox and WhatsApp Business chats.
2. **Reviews export**: rating, body, date, product.
3. **Live policy pages**: shipping, returns, refunds, warranty, payment and COD.
4. **Product facts** for the products most asked about.

Optional: Shopify search terms, post-purchase survey answers ("what almost stopped you"), on-page survey answers, sales chat transcripts.

Remove names, phone numbers, emails, addresses and order numbers before analysis; quote questions without personal data. If tickets are under about 100, add reviews and searches and mark the counts as low. Publishing FAQ blocks needs draft access (level 2) in the theme or help app, and the client's yes to go live.

## Before you start: the gates

1. **Policy is settled.** Each shipping, returns, refund and COD answer must match a live policy page. If two sources disagree (policy page versus what agents say), stop that answer and ask the client which is true.
2. **Answers can be owned.** Each answer has an owner who updates it when the fact changes (ops for delivery, product for ingredients). No owner: mark it and ask.
3. **Rules that apply.** Health, safety and ingredient answers stay inside the store's claims sheet (`product-claims-profile`). US delivery answers need a reasonable basis in dispatch data [CXP-6160].

## Steps

1. **Pull and clean.** Combine tickets, chats and reviews into one sheet. Keep only messages that contain a question or a surprise ("I didn't know it was so small").
2. **Code each question.** Tag by stage: before buying (fit, use, ingredients, delivery time, COD, price), during checkout (payment failed, coupon, address), after buying (where is my order, return, how to use). Merge duplicates into one plain question in buyer words. Paste the exact wording of 2 to 3 examples per group; do not let a tool paraphrase them [AVT-0007].
3. **Count and rank.** Count each group. Questions before buying rank first, because each one may be a lost sale. Order-status questions are a separate pile: if they exceed about 3% of orders, the fix is tracking and proactive messages, not FAQ text [CXP-0012]; hand them to `cut-where-is-my-order-tickets`.
4. **Add the near-miss questions.** From any "what almost stopped you" survey answers, add the top reasons as questions [LPG-0042] [CRO-0018]. Add page-level gaps: quick backs from product pages and dead clicks on price or shipping text often mean missing information [CRO-0023].
5. **Write each answer.** Lead with the direct answer in the first sentence, about 20 to 25 words, so it stands alone if quoted [AEO-0023]. Then one or two sentences of detail or the exception. Use numbers and dates, not "fast" or "soon". Link to the full policy where a policy governs. No sales pitch in answers; if the honest answer is "this is not for you", say so and point to the right product.
6. **Decide the placement.** For each question choose where it is asked: product page (fit, use, ingredients, what is in the box), collection page (how to choose), cart or checkout area (payment, COD, delivery date, returns), help centre (everything, grouped by stage), order confirmation and shipping emails (how to use, when it arrives). Put a question in two places at most. Answer obscure product questions (compatibility, edge uses) in a help centre on the main domain, not a subdomain, since chat users ask longer, specific questions [AEO-0031].
7. **Make it readable by machines too.** FAQ text must be in the page HTML, not loaded by a script after the page opens, or many AI crawlers will not see it; check by reloading with JavaScript turned off [AEO-0002]. Do not add FAQ blocks for search snippets: Google stopped showing FAQ rich results from May 2026 [SEO-6160]. A plain official FAQ about the brand also helps assistants repeat the right facts [AEO-0011].
8. **India and US notes.** India: answer COD availability and fees, prepaid offers, pincode serviceability, delivery days by zone, open-box or return pickup rules, GST invoice access, and UPI refunds in plain words; offer Hindi or regional versions of the top 5 answers if tickets arrive in those languages. US: answer delivery timing with dates the store meets, and say how delays are handled.
9. **Set the refresh.** Each answer gets a review date (90 days by default, practitioner default) and is rechecked whenever a policy, product or courier changes.

## Checks before you hand it over

- Every question traces to at least one real ticket, chat, review or search, with a count.
- No personal data appears anywhere in the deliverable.
- Every policy answer matches the live policy page; conflicts are listed, not guessed.
- Each answer opens with a direct answer under about 25 words.
- Each question has one or two placements, chosen by where it is asked.
- FAQ text renders without JavaScript.
- Every answer has an owner and a review date.

## Output

**Summary (one screen):** questions analysed and sources, top 10 questions by count and stage, the three page fixes that should cut the most tickets, policy conflicts found, and what was sent to other skills.

**Question register:**

| ID | Question (buyer words) | Stage | Count | Example source IDs | Placement 1 | Placement 2 | Owner | Review date |
|---|---|---|---|---|---|---|---|---|

**Answer set:**

| ID | Question | Direct answer (first sentence) | Detail | Policy link | Language versions |
|---|---|---|---|---|---|

**Placement map:** page or message, block position, questions shown there, in order.

**To confirm:** policy conflicts, missing owners, claims needing sign-off.

## Common mistakes

- **Writing questions the founder wishes buyers asked.** Step 1 and step 3 use counted real questions.
- **One long FAQ page nobody finds.** Step 6 places answers where the doubt happens.
- **Answers that drift from policy.** Gate 1 checks each one against the live page.
- **Vague answers.** Step 5 demands numbers, dates and a direct first sentence.
- **FAQ loaded by an app script.** Step 7 tests with JavaScript off.
- **Treating order-status floods as an FAQ problem.** Step 3 routes them to tracking fixes.

## Sources

- CXP-6160: US ship-time claims need a reasonable basis.
- AVT-0007: keep buyers' exact words.
- CXP-0012: order-status contact rates and when they are structural.
- LPG-0042, CRO-0018: near-miss surveys feed copy.
- CRO-0023: quick backs and dead clicks signal missing information.
- AEO-0023: question heading with a 20 to 25 word direct answer.
- AEO-0031: help centre on the main domain for long-tail questions.
- AEO-0002: script-loaded FAQ is invisible to many AI crawlers.
- SEO-6160: FAQ rich results removed from Google Search in 2026.
- AEO-0011: an official brand FAQ helps assistants repeat correct facts.

What makes this skill ours: every question is counted from the store's own tickets, chats and reviews; each answer is placed where the doubt arises rather than on one page; policy conflicts are surfaced instead of guessed; and answers are written to be both read by buyers and quoted by answer engines, now that FAQ snippets are gone.
