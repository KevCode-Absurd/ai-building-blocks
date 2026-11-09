---
name: reply-template-library
description: Builds a library of reply templates (macros, saved replies, canned responses) for the cases a support team answers most, each with fill-in fields, the policy line it relies on and a "do not use if" note, plus templates for hard cases (delays, errors, refusals, outages, apologies), live chat openers and closers, and a short tone guide with before-and-after examples. Use it when a team answers the same questions all day, replies are inconsistent, or templates sound robotic. Checks every template against the policy and lists what needs the owner's approval.
---

# Reply template library

## When to use

- The team answers the same ten to twenty questions every day.
- Different people give different answers to the same question.
- Existing templates sound cold, out of date or wrong.
- A help desk move (to Zendesk, Gorgias, Help Scout or Freshdesk) needs templates rebuilt.
- An AI agent or chatbot needs approved answers to stay inside.

Do not use it to change help desk settings, automations or AI auto-replies without the owner's say-so, or to write templates that pressure or mislead customers.

## Access needed

- **Level 1 (read):** tickets, tags, current macros and satisfaction scores.
- **Level 2 (read and draft):** create the new macros and chat scripts in the help desk as drafts or in a test group, not visible to the team's live list.
- **Level 3 (read, write and publish):** publish approved macros, retire old ones and update the ones that quote a changed policy line, within the confirmed limits. Changes to automations or bot answers need a fresh yes. Log every change.

## What you need

1. A ticket export for the last one to three months: subject, tags, first message, and the reply sent.
2. The current templates, if any, and the help desk used.
3. The written policies with dates.
4. Five replies the owner considers the best, and any brand voice notes.
5. The placeholders the help desk supports (for example, customer first name, order number, tracking link).

## Steps

### 1. Count the cases

Group tickets by question type. Count each group. Note the risky ones even if rare: safety, legal threats, data requests, payment errors, angry repeat contacts.

### 2. Pick the cases

Choose the top cases by volume, then add the high-risk ones. Stop when the next case is rare; a short library agents can scan beats a long one nobody searches.

### 3. Learn the tone

From the best replies, write a short tone guide: three or four voice traits, words to use, words to avoid, how the business apologises, how it says no. Tone shifts with the customer's mood; the voice does not.

### 4. Write each template

For each case:
- **Title** that matches how agents search (for example "Where is my order: in transit").
- **When to use** and **do not use if** (for example, do not use if the order is more than 10 days late, if the customer mentions damage, or if this is their third contact).
- **Fill-in fields** in brackets for everything the agent must check: [first name], [order number], [tracking link], [new date].
- **The reply:** answer first, next step, when they will hear back, sign-off.
- **Policy line:** the exact policy wording it relies on, with the policy's date.
- **Help desk actions:** tags, status or assignee to set, if the help desk supports it.

### 5. Write hard-case templates

Delays, mistakes the business made, refusals, outages and apologies. An apology names what went wrong, owns it once, says what happens now and when. A refusal gives the decision in the first two lines and any alternative the policy allows.

### 6. Write chat scripts

Short openers, wait messages ("I'm checking your order now; this takes about two minutes"), handoffs to a person with a summary so the customer does not repeat themselves, and closers. If a bot answers first, the opener says it is an automated assistant and how to reach a person.

### 7. Check every template

Against the policy (every promise, window and amount), against the tone guide, and for anything that could pressure or mislead: fake urgency, review requests only to happy customers, or rewards for good reviews. Templates that ask for reviews ask every customer the same way.

### 8. Set the upkeep rule

Each template has an owner and a review date. When the policy changes, every template quoting that line is updated (at level 3, I make those updates and log them). When agents edit a template often in the same way, update the template. New questions that keep coming back get a template; the owner sets how often counts as "keep coming back".

## Checks before handing over

- Every template has a title, when to use, do not use if, fill-in fields, reply and policy line.
- No promise goes beyond the policy; anything uncertain is listed for the owner.
- Every fill-in field is something the agent must check, not guess.
- Tone matches the guide; no blame, no jargon.
- Bot openers say they are automated and offer a person.
- Anything published went live only within the access level and limits, and is in the change log.
- No review request is selective or rewarded.
- Templates touching refunds, warranties or cancellations note: check this with local rules.

## Output format

1. Case count table (case, volume, risk)
2. Tone guide (traits, use and avoid words, before-and-after examples)
3. Template library (one block per template)
4. Hard-case templates
5. Chat scripts
6. Items needing the owner's approval
7. Upkeep rules

## Example of good output (short)

*Illustrative structure, not a real business: an online children's raincoat shop in Melbourne, Australia. Copy the shape, never the content: every fact comes from the client's own context.*

> **Where is my order: in transit**
> *Use when:* tracking shows the parcel moving and it is within the delivery estimate.
> *Do not use if:* the parcel is past the estimate, tracking has not changed for 5 days, or this is the customer's second contact.
>
> Hi [first name], thanks for checking in. Your order [order number] is on its way and should arrive by [estimated date]. You can follow it here: [tracking link]. If it hasn't arrived by then, reply to this email and we'll chase it with the courier for you. Warmly, [agent name] at [Business]
>
> *Policy line:* "Orders ship within 2 business days; delivery estimates are shown at checkout" (Shipping policy, updated 1 Sept 2026).
> *Help desk actions:* tag "wismo", status pending.
>
> **Tone, before and after**
> Before: "Per our policy, we are unable to process your request."
> After: "We can't take this one back, because it's been worn. Here's what we can do instead."
