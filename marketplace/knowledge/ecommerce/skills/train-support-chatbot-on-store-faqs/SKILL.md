---
name: train-support-chatbot-on-store-faqs
description: "The knowledge pack to load into a store's support chatbot or AI assistant: the questions it may answer, each with an approved answer, a source and an owner; the order lookups it may do; the things it must never do (refunds, medical or legal advice, promises outside policy, posing as a person); and the handoff rule that passes a chat to a person with the context attached. Built from the store's real tickets and chats, tested on 50 past conversations before launch, with WhatsApp and site chat rules and language notes. Tool-neutral. Use when the store adds a bot to site chat or WhatsApp, or an existing bot gives wrong or risky answers."
---

# Train a support chatbot

**You get:** a bot knowledge pack (approved question and answer set, order-lookup rules, a never-do list and the handoff rule with its message), a 50-conversation test sheet with pass or fail per answer, and a weekly review sheet, ready to load into any chatbot tool.

## When to use

- The store is adding a bot or AI assistant to site chat or WhatsApp.
- An existing bot gives wrong answers, invents policies or traps buyers in loops.
- The support team spends most of its time on repeated simple questions.
- Policies changed and the bot still quotes old ones.

## Not for

- Setting up the inbox the bot hands off to: use `set-up-helpdesk-and-response-times` first.
- Pre-sale selling scripts for chat: use `write-chat-sales-scripts` or `live-chat-presale-playbook`.
- Setting up WhatsApp for sales: use `set-up-whatsapp-sales-chat`.
- The public FAQ page: use `write-faq-from-tickets-and-reviews`; this skill reuses its answers.

## What you need

Required (read access, level 1):

1. **Ticket and chat export, last 90 days**, with reason tags and the first message of each conversation.
2. **Live policies** and the store's FAQ.
3. **Product facts**: sizes, materials, ingredients, use instructions, compatibility, from the product pages and spec sheets.
4. **The bot tool** chosen and what it can connect to (order lookup by email or order number, helpdesk handoff, languages).
5. **Handoff hours**: when a person is available on each channel.

Optional: existing macros, CSAT on bot chats, on-site search terms.

Loading the pack into the bot needs draft access (level 2). Turning the bot on for buyers needs the client's yes, after the test in step 7 passes.

## Before you start: the gates

1. **Human path exists.** A person must be reachable from every bot conversation. On WhatsApp this is a policy rule: automation is allowed but needs prompt, clear and direct escalation paths [CXP-6302]. Fail: do not launch.
2. **Disclosure.** The bot says it is an automated assistant in its first message and if asked. It never claims to be a person, never uses a fake human name and photo as if real.
3. **Answers are sourced.** Every answer in the pack quotes a live policy or product page. No source, no answer.
4. **Data safety.** The bot never asks for card numbers, bank or wallet PINs, one-time codes or passwords, and shows order details only after matching order number with email or phone.
5. **Regulated topics.** Medical, legal, financial and safety questions go to a person or to the official label text, never to a generated answer.

## Steps

### 1. Find what the bot should handle

From the ticket export, list reasons by volume. A reason is a bot candidate when the answer is the same for everyone or comes from a single lookup: order status, shipping times, return window, how to start a return, sizing chart, product use, store hours, discount code rules. Order status alone is often 30 to 50% of tickets [CXP-0012], so a lookup that answers it well is worth the most.

Not bot work: damaged items needing judgement, refunds, angry buyers, anything with a safety word.

### 2. Write the question set

For each bot reason, collect five to ten real ways buyers ask it (copy their wording, including slang, mixed languages and spelling mistakes). Then write one approved answer:

- Two to four short sentences, the answer first.
- Facts exactly as in the policy page; link to that page.
- A next step ("Track it here", "Start a return here").
- No promises the policy does not make.

An official, consistent brand-facts FAQ also helps AI assistants outside the store repeat the right facts [AEO-0011]; use the same wording in both.

### 3. Set the order lookups

Define what the bot may look up and say: order status, tracking link, expected date, items. What it may change: nothing, or only address before dispatch if the tool and the client allow it. Every change and every refund stays with a person.

### 4. Write the never-do list

The bot never:

- Issues or promises refunds, credits, replacements or exceptions.
- Gives medical, legal or safety advice, or says a product treats or cures anything.
- Invents a policy, delivery date, stock level or discount.
- Argues with a buyer or repeats the same answer more than twice.
- Collects payment details or passwords.
- Pretends to be human.

### 5. Write the handoff rule

Hand off to a person when any of these happens:

- The buyer asks for a person, in any words ("agent", "human", "real person", "call me").
- The bot's answer did not help twice in a row, or the buyer repeats the question.
- Trigger words: damaged, broken, refund, wrong item, allergic, injury, chargeback, lawyer, police, consumer court, or swearing.
- The order lookup shows a problem (late beyond promise, failed delivery, refund pending over its due date).
- The question is outside the approved set.

Handoff message: "I am handing you to [team name]. They are here [hours]; you will get a reply by [time]. I have passed on your order number and question, so you will not need to repeat it." The bot attaches the transcript, order number and detected reason to the ticket. Low effort is the point; making buyers repeat themselves drives disloyalty [CXP-0009].

Out of hours, the bot says when a person will reply and gives the tracking page link; it does not pretend a person is coming sooner.

### 6. Set languages

Answer in the language the buyer writes in only where the pack has a checked translation; otherwise reply in the store's main language and offer a person. Cover each language that over about 10% of chats use (practitioner default, test it).

### 7. Test on 50 real conversations

Replay 50 past chats, chosen across the top reasons plus ten hard ones (angry, unclear, mixed questions). For each, mark: correct answer, correct handoff, wrong answer, invented fact, missed handoff. Launch passes when there are zero invented facts, zero missed handoffs on trigger words, and at least 90% correct answers on bot reasons (practitioner default, test it). Fix and retest until it passes.

### 8. Launch small and review weekly

Start on one channel or one part of the day. Each week, read 30 bot chats and the handoff tickets: wrong answers, new questions, loops, buyer complaints about the bot. Add or fix answers; any policy change updates the pack the same day. Judge the bot by tickets solved without a person and by the satisfaction of handed-off buyers, not by chats "deflected". A blended team can then focus people on complex tickets [OPS-0013].

### 9. Channel and claims notes

- **WhatsApp and messaging apps:** in many markets (much of Europe, Latin America, Asia) WhatsApp is the main chat; use only approved templates outside the 24-hour window, and keep the human path visible. Payment questions (which methods, can I pay later, refund to card or bank) are bot-safe only as policy answers; refund details always go to a person or a secure form.
- **Claims and bot disclosure:** keep product claims to the label and page text; health or safety questions go to a person. State the bot's nature plainly at the start of each chat; some places (for example California and the EU) have rules on telling people they are talking to a bot.

## Checks before you hand it over

- Every answer quotes a live policy or product page, with a link.
- The never-do list and handoff triggers are loaded and tested.
- The bot discloses it is automated and never poses as a person.
- A person is reachable from every channel the bot runs on.
- Order lookups require order number plus email or phone.
- Test: zero invented facts, zero missed trigger handoffs, 90% or more correct.
- The client approved the pack and the launch channel.

## Output

**One-screen summary:** reasons the bot will handle and their share of tickets, launch channel, test result and the review owner.

**Knowledge pack:** Reason, Example buyer questions, Approved answer, Link, Source page, Owner, Last checked.

**Lookup rules:** Data, May show, May change, Verification needed.

**Never-do list** and **handoff rule** with the handoff message per channel.

**Test sheet:** Conversation id, Reason, Bot reply, Result (correct, wrong, invented, missed handoff), Fix.

**Weekly review:** Week, Bot chats, Solved without a person, Handoffs, Wrong answers, New questions added.

## Common mistakes

- **Bots with no way out.** Gate 1 and step 5 make the human path a launch rule.
- **Generated answers about policy.** Step 2 loads only approved answers with sources.
- **Bots posing as people.** Gate 2 requires disclosure.
- **Measuring deflection.** Step 8 measures solved chats and handoff satisfaction.
- **Stale answers after a policy change.** Step 8 updates the pack the same day.

## Sources

- AEO-0011: an official brand-facts FAQ gets repeated by assistants.
- CXP-0009: low-effort service builds loyalty.
- CXP-0012: order status share of tickets.
- CXP-6302: WhatsApp automation needs escalation to a person.
- OPS-0013: route simple tickets one way and complex ones to people.

What makes this skill ours: the bot answers only from approved, sourced text and never invents policy; the handoff rule carries the context so buyers never repeat themselves; launch waits for a 50-chat test with zero invented facts; and WhatsApp escalation, language and payment question rules are built in.

## Selling in India

- WhatsApp is often the main chat.
- Cover Hindi plus the store's top regional language if over about 10% of chats use it. Collect Hinglish wording in step 2.
- COD questions (can I pay at door, UPI at delivery, refund to bank) are bot-safe only as policy answers. The bot never asks for UPI PINs or OTPs.
