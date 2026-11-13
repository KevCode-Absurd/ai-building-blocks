---
name: sell-in-instagram-dms
description: "Comment-to-DM and DM reply flows that turn Instagram interest into orders within Instagram's own messaging rules: a keyword per post, the one private reply each comment allows (written to do the whole job alone), follow-ups only after the buyer answers, story-reply and price-question flows, the hand-off to a person, tracked links per post, and a weekly sheet of DMs, clicks, orders and gross profit per post. Tool-neutral, with a manual path. India notes for COD, UPI links and regional languages; US notes for disclosure. Use when posts get comments like 'price?' or 'link?' that never turn into sales, or before turning on DM automation."
---

# Sell in Instagram DMs

**You get:** a DM sales kit: a keyword plan for the next 8 posts, a first-DM template per post type, reply flows for price, size, delivery and story replies, a hand-off card, tracked links, and a weekly sheet reading orders and gross profit per post.

## When to use

- Posts and reels get "price?", "link?" or "how to order?" comments that go nowhere.
- The store wants to swap "link in bio" for "comment a word and we'll DM you".
- DMs pile up in Requests unanswered.
- Click-to-Instagram Direct ads are planned and the DM side needs to be ready.

## Not for

- Rules for hate, complaints and moderation in comments: use `comment-and-dm-reply-rules`.
- Planning the posts themselves: use `plan-30-day-instagram-calendar`.
- Creator partnership ads: use `run-creator-partnership-ads`.
- WhatsApp as the sales chat: use `set-up-whatsapp-sales-chat`.

## What you need

Required:

1. **Instagram professional account** (business or creator) and who has inbox access.
2. **Last 30 days of comments and DMs** (read in the app or a connected inbox): the questions asked and how many got answers.
3. **Products to sell in DMs**, with price as charged at checkout, product URL and stock.
4. **Gross profit per product**, from `build-sku-profit-sheet`.
5. **Automation choice**: a comment-to-DM tool built on Meta's official API, or manual replies. Free path: manual replies from the app with saved replies.

Optional: past post performance, ad plans, chat scripts from `write-chat-sales-scripts`.

Access: reading the inbox is level 1. Building automations in draft is level 2. Switching any automation on, and every post that asks for a keyword, needs the client's yes. The client connects tools through Meta's own sign-in; never ask for the Instagram password.

## Before you start: the gates

1. **Platform rules.** Through Meta's API, a business cannot start a DM; it may only reply to someone who wrote first [ORG-6365]. A comment allows one private reply, sent within 7 days, and more messages only after the person answers [ORG-6364]. Fail: any plan to DM followers or commenters more than once without a reply is cut.
2. **Price is public.** Pass: the post or first DM shows the real price. "DM for price" hides it and loses buyers who won't ask (practitioner default). Fail: add the price.
3. **Gross profit per product known.** Pass: posts are ranked by gross profit per post in step 8. Fail: rank by orders and say so.
4. **Claims and disclosure.** Product claims need proof [ADC-6146]; bots say they are automated [ORG-6365]. Fail: rewrite.

## Steps

### 1. Pick the posts and keywords

Use a keyword on posts that show one product or one clear offer, not on pure entertainment posts. One practitioner keeps organic posts all give and lets ads carry the ask [ORG-0003]; a fair middle path is a keyword on a minority of posts (practitioner default, test it). One keyword per post, short and unique to it (for example `KURTA`, `SPF`), so the DM and the sales sheet know which post sold. Replacing "link in bio" with a comment keyword gets the link straight into the inbox and shows who opened and clicked [ORG-0021].

### 2. Write the first DM to do the whole job

The private reply is one message until the buyer answers [ORG-6364], so it must carry everything:

> Hi [first name]! Here's the [product] from the post: [link with UTM]. It's Rs [price], [one key fact: delivers in 3 to 5 days / COD available / sizes S to XXL]. Which size do you usually wear? I'll tell you how it fits.

Rules: the link, the price, one fact that removes the commonest doubt, and one question. If a bot sends it, add "(auto reply: a person will answer your next message)".

Reply publicly to the comment too, briefly ("Sent you the details!"), so others see it works.

### 3. Follow up only after a reply

When the buyer answers, the conversation window opens: a person or the tool can reply freely, usually within 24 hours, and a person can use the 7-day human agent window for slower questions [ORG-6365]. Use the replies from `write-chat-sales-scripts`: answer, recommend one, ask for the order. No reply means no second message.

### 4. Handle the common DM types

| DM type | First move |
|---|---|
| "Price?" on a post | Price, link, one question (step 2) |
| Story reply ("love this") | Thank them, name the product, link, one question |
| "Is it available in my size or colour?" | Check stock, answer, link to that variant |
| Delivery or COD question | Answer with pincode check, link |
| "Can I order here?" | Send the product link or a checkout link (Shopify draft order); never take card details in DM |
| Complaint or order issue | Move to support, `comment-and-dm-reply-rules` |

### 5. Route ad-driven DMs

Click-to-Instagram Direct ads open a window of up to 7 days after the buyer's first message [ORG-6365]. Use a separate first message per ad so the sheet can count the source, and answer within the staffed hours.

### 6. Set the hand-off

A person takes over when the buyer asks for one, asks about fit for their body, wants a custom or bulk order, the order is above the store's high-value line, or the bot misses twice. Clear the Requests folder daily: requests left 30 days stop showing through the API [ORG-6365].

### 7. Track every post

Each DM link carries `utm_source=instagram&utm_medium=dm&utm_campaign=<keyword>` (see `set-up-utm-tracking-for-all-channels`). Lead-magnet reels with keyword DMs can keep bringing people in for months after posting [ORG-0028], so keep old keywords live while they still trigger.

### 8. Read it weekly

Per post: comments with the keyword, DMs sent, replies, link clicks, orders, revenue, gross profit, gross profit per post. Make more posts like the ones that earn gross profit, not the ones with the most comments. Gross profit uses delivered costs, not product cost alone [MEA-0037].

### India and US notes

- **India:** in-app checkout is not the norm, so links go to the store; offer a UPI payment link from the store's gateway for buyers who want to pay in chat. Say clearly if COD is open. Reply in the language the buyer wrote in when someone on the team can; Hinglish replies to Hinglish DMs.
- **US:** creators and staff who post about the products disclose the relationship; a bot that answers says so. Payment always happens on the store's checkout.

## Checks before you hand it over

- No flow sends a business-started DM or a second message before the buyer replies.
- Every first DM has link, price, one fact and one question.
- Every keyword maps to one post and one UTM campaign.
- Bot messages say they are automated and how to reach a person.
- Hand-off triggers and owner are named.
- No DM asks for card details, OTPs or PINs.
- The weekly sheet reads gross profit per post.

## Output

1. **One-screen summary:** posts with keywords, the first DM templates, staffed hours, and what the client must approve.
2. **Keyword plan:** Post date, Post type, Product, Keyword, First DM text, Link with UTM, Price, Live (yes or no).
3. **Reply flows:** DM type, First move, Script reference, Hand-off rule.
4. **Hand-off card:** Trigger, Who, Reply time, Message to buyer.
5. **Weekly sheet:** Post, Keyword, Comments, DMs sent, Replies, Clicks, Orders, Revenue, Gross profit, Gross profit per post, Action.

## Common mistakes

- **Two automatic DMs before the buyer answers.** Step 2 makes the first one complete; step 3 waits.
- **"DM for price".** Gate 2 puts the price in public.
- **One keyword on every post.** Step 1 makes it unique per post so sales are counted.
- **Selling in every post.** Step 1 keeps keywords to a minority of product posts.
- **Ranking posts by comments.** Step 8 ranks by gross profit.
- **Ignoring Requests.** Step 6 clears them daily.

## Sources

- ORG-6364: one private reply per comment within 7 days; follow-ups after a reply.
- ORG-6365: businesses cannot start DMs; 24-hour and 7-day windows; disclose automation.
- ORG-0021: comment-keyword DMs instead of link in bio.
- ORG-0028: keyword DM reels keep collecting leads for months.
- ORG-0003: organic posts as give, ads carry the ask.
- ADC-6146: India's ASCI Code on claims.
- MEA-0037: delivered gross margin.

What makes this skill ours: the single private reply is written to sell on its own because the platform allows no second message until the buyer answers; prices are public, not hidden behind DMs; each keyword is unique so every post's sales and gross profit can be counted; and automation is labelled, with a person behind it.
