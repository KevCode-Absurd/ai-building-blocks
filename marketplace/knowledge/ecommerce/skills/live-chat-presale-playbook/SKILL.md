---
name: live-chat-presale-playbook
description: "A playbook for running a store's site chat so it sells: where the chat button sits on each page type, which buyer signals earn a proactive invite and which never do, the three questions that find what the buyer needs, how to recommend one product with one reason and one proof, when a bot answers and when a person takes over, staffing and reply targets by hour, and a way to check the chat lifts gross profit instead of just collecting chats. Tool-neutral with a free path. Use when a store adds or rethinks live chat, when chat is busy but few chats turn into orders, or when a bot frustrates buyers."
---

# Live chat pre-sale playbook

**You get:** a one-page chat operating plan plus its working parts: a page-by-page trigger table, the opening lines, a 3-question discovery script, a recommendation formula with examples, a bot and hand-off rule card, a staffing grid by hour, and a 4-week test sheet that reads gross profit per session with chat on and off.

## When to use

- The store is adding site chat and wants it to sell, not just answer tracking questions.
- Chat gets plenty of conversations but few turn into orders.
- A pop-up chat window opens on every page and may be hurting conversion.
- A bot answers first and buyers complain they cannot reach a person.

## Not for

- Writing the reply library: use `write-chat-sales-scripts`.
- Loading FAQs into the bot: use `train-support-chatbot-on-store-faqs`.
- One inbox, tags and response targets across all channels: use `set-up-helpdesk-and-response-times`.
- Phone or video consultations for expensive products: use `high-ticket-consult-call-script`.

## What you need

Required:

1. **Traffic by page type** for the last 30 days (GA4 or Shopify Analytics: sessions, add-to-cart rate and conversion for home, collection, product, cart).
2. **Chat transcripts**, last 200, with page URL where the chat started and whether an order followed.
3. **Chat tool** in use, or the choice. Free path: Shopify's own inbox chat or a free widget; paid helpdesks work the same way.
4. **Team hours** and who answers.
5. **Gross profit per order**, by product if possible.

Optional: session recordings, heatmaps, post-purchase survey answers.

Access: reading analytics and transcripts is level 1. Changing chat settings and triggers on the live site is level 2 in a draft or test setting first; switching them on for all visitors needs the client's yes.

## Before you start: the gates

1. **Gross profit per order known.** Pass: the test in step 8 reads gross profit per session. Fail: read orders per session and say so.
2. **Coverage.** Pass: a person covers the hours the chat says it is live. Fail: show "Leave a message, we reply by [time]" outside covered hours.
3. **Speed budget.** Chat widgets load scripts. Pass: mobile load time on product pages does not get worse after adding it (check with PageSpeed Insights before and after). Fail: load the widget after page load or on click only.
4. **Bot honesty.** Automated chats must offer a route to a person and should say they are automated [CRO-6361] [ORG-6365]. Fail: no bot until fixed.

## Steps

### 1. Place the button by page type

| Page | Button | Proactive invite |
|---|---|---|
| Home, blog | Small icon, bottom corner | Never |
| Collection | Small icon | Never |
| Product page | Icon plus a text link near the size or variant picker: "Not sure which one? Ask us" | Only on signals in step 2 |
| Cart | Icon | Only on signals in step 2 |
| Checkout | None, or the store's normal help link | Never |

On mobile the icon must not cover the add-to-cart button or sticky bar.

### 2. Invite only on signals

Pop-ups in the first seconds interrupt people who do not yet know what the store sells; well-timed triggers do better [LPG-0009]. Allowed triggers (practitioner defaults, test them):

- 45 seconds or more on a product page with no add to cart.
- Second visit to the same product page in a session.
- Size guide or delivery checker opened.
- Cart above the store's high-value line for 60 seconds.

One proactive invite per session at most. Never trigger on the first page view.

### 3. Open with a useful line

The invite names the likely doubt on that page, not "How can I help?":

- Product page: "Choosing between sizes? Tell me your usual size and I'll tell you how this one fits."
- Cart: "Want me to check delivery time to your pincode before you check out?"

### 4. Find the need in three questions

Ask one at a time, and stop as soon as you can recommend:

1. **Who or what is it for?** ("For you or a gift?" "Which room?")
2. **What matters most?** (fit, result, delivery date, budget)
3. **What have you tried or what rules it out?** (allergies, space, an earlier product that failed)

Write down the buyer's own words; they go into the recommendation.

### 5. Recommend one thing

Formula: **product + one reason in their words + one proof + the link + one question.**

> "For a gift for your mother who has sensitive skin, I'd go with [product]: it's fragrance-free, which you said matters. A verified buyer wrote '[short quote on sensitive skin]'. Here it is: [link]. Shall I check delivery by Friday?"

The proof is a real, verified review that answers that doubt [LPG-0005]. Give a runner-up only if they ask. When the quantity depends on use, size the pick to their situation (one person or a family, small or large room).

### 6. Bot and hand-off rules

The bot handles only facts with one answer: delivery time, returns window, order tracking, store hours. A person takes over when:

- the buyer asks for a person, or types the same question twice;
- the bot fails to answer twice;
- the question is about fit for their body, a medical or safety concern, a custom order or a complaint;
- the cart is above the high-value line.

The hand-off message says who will reply and when. High-effort service turns buyers away far more than delight wins them [CXP-0009], so the shortest route to a correct answer wins.

### 7. Staff by hour

Count chats by hour of day from the transcripts. Staff the hours that hold most pre-sale chats; higher-priced products bring many more questions per order [OPS-0006]. Reply targets in covered hours (practitioner defaults): first reply within 1 minute on site chat; full answer within 5. Outside hours, collect an email or WhatsApp number with the buyer's permission and reply by a stated time.

### 8. Prove it pays

Chatters are already keen, so "chat conversion" overstates what chat adds. Test instead:

- **Enough traffic** (300 or more orders a month): run chat triggers on for half of visitors and off for the other half for 4 weeks, judged on gross profit per session. Under that, alternate weeks on and off and treat the result as directional [CRO-0011].
- Check the click-map: if the chat icon draws a tiny share of clicks on a page and few orders, remove it from that page [LPG-0043].
- Ask "Did you chat with us before buying?" in the post-purchase survey.

### India and US notes

- **India:** many buyers prefer WhatsApp to site chat. Offer "Chat on WhatsApp" as a second button using the store's tracked link from `set-up-whatsapp-sales-chat`. Delivery-by-pincode and COD questions lead pre-sale chats; keep a pincode checker handy.
- **US:** buyers expect instant answers on shipping cut-offs and returns; state the returns window in days. If chats are recorded or used to train tools, say so in the privacy policy.

## Checks before you hand it over

- No proactive invite fires on the first page view or on checkout.
- Mobile chat never covers add to cart.
- Every invite line names a specific doubt.
- The recommendation formula is used in all example replies, with real reviews.
- Bot rules list exactly what the bot answers, and the hand-off triggers.
- Staffing matches the hours shown in the widget.
- The test plan reads gross profit per session, not chat conversion.
- Page speed checked before and after the widget.

## Output

1. **One-screen summary:** where chat shows, the triggers, staffed hours, reply targets, and the test start date.
2. **Trigger table:** Page type, Button, Trigger, Delay, Invite line, Mobile rule.
3. **Discovery and recommendation card:** 3 questions, formula, 3 filled examples for the store's top products.
4. **Bot and hand-off card:** Bot answers, Hand-off trigger, Hand-off message, Owner.
5. **Staffing grid:** Hour, Chats (avg), Person on, Target first reply.
6. **Test sheet:** Week, Chat on or off, Sessions, Orders, Gross profit, Gross profit per session, Notes.

## Common mistakes

- **Chat window that pops on arrival.** Step 2 invites only on signals.
- **"How can I help?"** Step 3 names the doubt.
- **Five product suggestions.** Step 5 recommends one with a reason and a proof.
- **Bots that loop.** Step 6 hands off after two misses or on request.
- **"Chat converts 5 times better."** Step 8 compares chat on versus off.
- **A widget that slows the product page.** Gate 3 checks speed.

## Sources

- LPG-0009: avoid early pop-ups; trigger on exit, scroll or add to cart.
- LPG-0005: reviews chosen to answer the buyer's exact objection.
- CRO-6361: human path required for WhatsApp automation.
- ORG-6365: automated chats should disclose they are automated.
- CXP-0009: cut effort before adding delight.
- OPS-0006: contact load rises with order value.
- CRO-0011: test approach by monthly orders.
- LPG-0043: prune page elements with tiny click share.

What makes this skill ours: chat invites fire only on buying signals and never on checkout; every recommendation carries the buyer's own words and a real review; the bot is fenced to one-answer facts with hand-off triggers; and chat is judged on gross profit per session with chat on versus off, not on chat conversion.
