---
name: run-nps-and-csat-surveys
description: "Two short surveys set up and read for the store: a recommend (NPS) survey sent after delivery and real use, and a satisfaction (CSAT) question after each closed support ticket, with the exact questions, timing per product, channels (email, SMS, WhatsApp in India), how to calculate and read the scores without being fooled by small samples, and a close-the-loop routine that has a person contact every unhappy buyer within two business days. Feeds promoters to reviews and referrals and detractor reasons to the monthly insights report. Use when the store has no measure of how buyers feel, scores exist but nobody acts on them, or before building loyalty or referral programs."
---

# NPS and satisfaction surveys

**You get:** two ready surveys (post-delivery recommend survey and post-ticket satisfaction question) with exact wording and timing, the scoring and reading rules, a close-the-loop routine with reply templates for unhappy buyers, and a monthly score sheet.

## When to use

- The store has no regular measure of how buyers feel after delivery or after support.
- Scores are collected but nobody calls back unhappy buyers.
- The owner is about to build a loyalty or referral program and needs to know who would recommend the store.
- Repeat rate fell and the store needs to know whether the product, delivery or service is the cause.

## Not for

- Asking how buyers heard about the store: use `post-purchase-how-did-you-hear-survey`.
- Collecting product reviews: use `build-review-collection-system`.
- Turning all feedback into a monthly fix list: use `turn-support-tickets-into-insights`; this skill feeds it.
- Handling a buyer who is already angry: use `handle-angry-customer-escalations`.

## What you need

Required (read access, level 1):

1. **Shopify order export**: Name, Created at, Fulfilled at, Customer Id, Lineitem sku, Payment Method, consent fields.
2. **Delivery dates** from the carrier or tracking app.
3. **Helpdesk export**: ticket id, closed date, agent, reason tag, customer email or phone.
4. **Product use facts**: days until the product shows a result or gets real use.
5. **Consent counts** for email, SMS and WhatsApp.

Optional: past survey results, review ratings, repeat rate by product.

Setting up surveys needs draft access (level 2) in the email, SMS, helpdesk or survey tool; sending them to buyers needs the client's yes. A free path exists: a short form tool linked from email and the helpdesk's built-in satisfaction rating.

## Before you start: the gates

1. **Someone will act.** Name the person who contacts unhappy buyers and their weekly time. Fail: do not send the survey; asking and then ignoring a complaint makes things worse.
2. **Consent and channel rules.** Surveys by SMS or WhatsApp go only to buyers who opted in to that channel; WhatsApp needs an approved template.
3. **Not a review gate.** The recommend survey must not decide who gets a review request. All buyers get the same review ask; promoters can get a referral ask instead (see step 6).
4. **Enough volume.** Under about 100 responses a month, read scores quarterly, not monthly (practitioner default, test it).

## Steps

### 1. Write the recommend survey

Two questions, nothing more:

1. "How likely are you to recommend [store] to a friend? (0 to 10)"
2. "What is the main reason for your score?" (open text)

Optional third, only for 0 to 6 scores: "May we contact you to make this right?" (yes or no).

Net Promoter Score is the share of promoters (9 to 10) minus the share of detractors (0 to 6); passives (7 to 8) count in the total only [CXP-6305]. Embed the 0 to 10 scale in the email so one tap answers question one.

### 2. Time it after real use

Send once per order, after delivery and after the product has had time to work, using the same days to real use as the review plan: quick-use items 5 to 7 days after delivery, results products when results show (practitioner defaults, test them). Send the survey before the review ask, in a separate message, so the two never mix. Skip buyers with an open ticket, a return in progress or a refused COD delivery; they go straight to support.

### 3. Add the satisfaction question to support

When a ticket closes, send one question: "How did we do? (Good, Okay, Bad)" or a 1 to 5 rating, with an optional comment. CSAT = share of good (or 4 and 5) answers. Read it per agent and per reason tag, since effort, not delight, drives loyalty in service [CXP-0009]. Add a second question for low scores only: "Was your problem solved?" (yes or no). Solved-but-unhappy and unsolved need different fixes.

### 4. Read the scores honestly

- Report the response count beside every score; small samples swing.
- Compare the store with itself over time and by segment (product, first or repeat order, channel, region), never with other brands' published scores.
- Read the comments. A 6 and a 0 count the same in the score, so the reasons tell you more than the number. Weight the loudest ends: the top few percent of fans and the most unhappy buyers carry most of the useful detail [AVT-0021].
- Group reasons into product, delivery, service, price and other. Check that response rates are similar across segments; if unhappy buyers stop answering, the score looks better than reality.

### 5. Close the loop with every unhappy buyer

Within two business days, a person contacts each detractor who left a reason or said yes to contact, and each "Bad" support rating. The routine:

1. Read their order and ticket history first.
2. Reply personally, by name, referring to what they wrote.
3. Fix what can be fixed within support caps; hand bigger cases to `handle-angry-customer-escalations`.
4. Log the reason, action and outcome.

Template: "Hi [name], I am [first name] from [store]. You said [their reason in their words]. I am sorry that happened. I have [action taken]. If anything else is not right, reply here and I will sort it."

Do not offer anything in exchange for a higher score or a review.

### 6. Use promoters well

Promoters (9 to 10) get a thank-you and a referral ask through `design-referral-program`. Their comments, with permission, are good material for pages, but only as real quotes with consent; never edit them into claims. Use their reasons to find what to protect.

### 7. Feed the monthly report

Each month, pass the reason groups, counts, quotes and the close-the-loop log to `turn-support-tickets-into-insights`. Pair scores with a near-miss question from checkout surveys when the store runs one; a post-purchase "what almost stopped you" question gives pre-sale doubts that NPS does not [CRO-0018] [LPG-0042].

### 8. India and US notes

- **India:** WhatsApp surveys often get more answers than email; keep the question in the buyer's language where the store supports it, with numbers 0 to 10 as quick-reply options where the template allows. COD buyers who refused delivery get no survey; they go to the RTO review. Call detractors when they prefer calls.
- **US:** keep survey emails transactional in tone with no sales offer, so they stay a service message. Honour opt-outs across channels.

## Checks before you hand it over

- Recommend survey has two questions (three for detractors) and nothing more.
- Survey timing follows real product use and skips buyers with open problems.
- The survey does not decide who gets a review request.
- Every score is reported with its response count.
- A named person contacts each detractor and "Bad" rating within two business days.
- No reward is tied to a score or a review.
- Reasons flow monthly into the insights report.

## Output

**One-screen summary:** NPS and CSAT this period with response counts, the top three detractor reasons, and how many unhappy buyers were contacted and helped.

**Survey set:** Survey, Trigger, Delay, Channel, Question text, Answer format, Template category (WhatsApp).

**Close-the-loop log:** Date, Customer, Score, Reason (their words), Owner, Contacted on, Action, Outcome.

**Monthly score sheet:** Month, Responses, Promoters %, Passives %, Detractors %, NPS, CSAT, CSAT by agent, Reason groups count, Response rate by segment.

## Common mistakes

- **Surveying without a callback plan.** Gate 1 names the owner first.
- **Using NPS to gate reviews.** Gate 3 and step 2 keep them separate.
- **Reading the number, not the reasons.** Step 4 reads comments.
- **Comparing with other brands.** Step 4 compares the store with itself.
- **Surveying before the product has worked.** Step 2 times it to real use.
- **Rewards for scores.** Step 5 forbids them.

## Sources

- AVT-0021: weight the most loyal and most unhappy.
- CRO-0018: ask what made them buy and what almost stopped them.
- CXP-0009: low effort drives loyalty in service.
- CXP-6305: NPS question, bands and formula.
- LPG-0042: post-purchase near-miss survey completion.

What makes this skill ours: surveys are timed to when each product has done its job; no survey is sent without a named person to call back unhappy buyers; NPS never gates reviews; and scores are read against the store's own past with response counts shown, with WhatsApp surveys and COD exclusions for India.
