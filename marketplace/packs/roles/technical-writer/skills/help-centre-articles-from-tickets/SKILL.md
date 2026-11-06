---
name: help-centre-articles-from-tickets
description: Turns support tickets, emails and policy text into help centre articles and FAQ pages that answer the questions customers keep asking. Groups and counts repeat questions, titles each article in the customer's words, puts the answer first, writes numbered steps with exact button names and expected results, adds a common mistake and a way to reach a person, and checks each page against policy. Also reviews an existing help centre for missing, stale or confusing pages. Use when ticket volume is high on the same topics, when launching a help centre, or for a monthly help centre review.
---

# Help centre articles from tickets

The best help centre is written by the customers' own questions. This skill finds the questions that cost the most support time, answers them in pages people can find and follow, and keeps those pages true as the product and policies change.

## When to use

- The same questions arrive by ticket, chat or email every week.
- A new product or help centre needs its first set of articles.
- A shipping, returns or booking policy needs rewriting in plain words.
- A monthly review of which pages are missing, out of date or confusing.

Not for: legal terms written from scratch (a qualified adviser writes those; this skill makes them readable and flags clashes), or developer docs (use readme-and-setup-guide or api-reference-and-quickstart).

## What you need

- **Tickets:** an export of the last one to three months, with customer names and contact details removed.
- **Product access or current screenshots,** and the exact names of buttons, menus and plans.
- **Policy text** for shipping, returns, billing, bookings or privacy, as approved by the business.
- **The current help centre** (export or links) and its search terms, if available.
- **An owner** who answers [confirm] questions and signs off.
- **Access level:** reading tickets and articles needs level 1. Creating draft articles in the help desk needs level 2. Publishing or updating live articles needs level 3 within the client's limits.

## Steps

1. **Group the questions.** Read the tickets and group those that ask the same thing in different words. Count each group. Note the customers' exact phrases.
2. **Rank by cost.** Order groups by volume, then by how long they take to resolve, then by risk (money, data, safety). Start at the top.
3. **Check what exists.** For each group, is there an article? Is it findable by the customers' words? Is it correct today? Mark: missing, stale, confusing, or fine.
4. **Title in the customer's words.** "Why was I charged twice?" not "Billing reconciliation overview". Start titles with the words people scan for.
5. **Answer first.** The first two sentences give the answer or the goal. Then:
   - Numbered steps, one action each, with the product's exact labels in bold, where before what.
   - What the customer should see after the key steps.
   - One common mistake and how to fix it.
   - What to do if it still does not work, and how to reach a person.
6. **One article, one question.** If an article answers three questions, split it and link them.
7. **Policy and FAQ pages.** Rewrite each rule in plain words with a worked example ("If you return a jacket on day 20, you get a full refund"). Check every answer against the approved policy; list any rule that is unclear or contradicts another, for the owner to resolve. Do not change a rule's meaning.
8. **Make it accessible and findable.** Descriptive headings, alt text that carries the meaning of each screenshot, descriptive links, short sentences, terms explained the first time.
9. **Test as a new user.** Follow each article on a fresh account or with fresh eyes. Fix anything that assumes knowledge the reader lacks.
10. **Link the loop.** Following Knowledge-Centered Service practice, ask the support team to link tickets to the article that solved them and flag articles that were wrong; feed those flags into the next review.
11. **Deliver or publish.** At level 2, create drafts in the help desk. At level 3, publish or update only the articles in the confirmed action list, log each action, and report it.

## Checks

- Each article answers one question, named in the customer's words.
- The answer or goal appears in the first two sentences.
- Every button, menu and plan name matches the live product.
- Steps have one action each, with expected results.
- Policy answers match the approved policy word for word in meaning; clashes are listed, not resolved by guesswork.
- Screenshots have alt text; no customer data appears in them.
- Each article ends with a next step and a way to reach a person.

## Output format

1. **Question map:** group, example phrases, ticket count, current article, status.
2. **Articles,** in the help desk's format or Markdown, each with title, summary, steps, result, common mistake, next step.
3. **FAQ page** grouped by topic, if asked.
4. **Gaps for owners:** unclear or clashing rules, product issues that docs cannot fix.
5. **Review list:** the top five pages to fix next month.

## Example of good output (short)

*Pinewick Candles is a made-up business used only to show the format: an online candle shop with 140 tickets last month.*

**Question map (extract):**

| Group | Customer phrases | Tickets | Article | Status |
|---|---|---|---|---|
| Change delivery address | "wrong address", "moved house" | 31 | None | Missing |
| Candle tunnelling | "burns down the middle" | 22 | "Candle care" | Confusing |

**Article draft:**

> **How do I change my delivery address after ordering?**
>
> You can change the address until your order is packed, usually within a few hours of ordering [confirm: packing time]. After that, contact us and we will try to redirect it.
>
> 1. Open the email with the subject **Your Pinewick order** and select **View order**.
> 2. Select **Edit delivery address**.
> 3. Enter the new address and select **Save**.
>
> You will get an email confirming the new address. If **Edit delivery address** is missing, your order is already packed: reply to your order email and we will help.
