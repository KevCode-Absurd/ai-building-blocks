---
name: bot-knowledge-base-build
description: Turns a business's policies, help pages, product facts and solved tickets into a bot-ready knowledge base - one-topic entries with the question, customer phrasings, a short approved answer, detail, source and date, owner and a hand-over rule - plus a clash and gap list and an upkeep plan. Use it when setting up a support bot, custom GPT, Claude Project, Gem or help-desk AI agent, or when a bot keeps giving wrong or outdated answers.
---

# Bot knowledge base build

## When to use

- A support bot, help-desk AI agent or internal assistant is being set up and needs something to answer from.
- An existing bot gives wrong, outdated or invented answers.
- Policies or prices changed and the bot must catch up.
- Long policy pages need turning into answers a bot can retrieve.

## What you need

1. Every source document with its date and owner: policies, help pages, price lists, product sheets, internal how-tos.
2. A sample of 30 to 100 recent customer questions or solved tickets, with names, emails and order numbers removed.
3. Who decides when two documents disagree.
4. The tool the bot runs on (help desk, custom GPT, Claude Project, Gem, Copilot Studio) and the format it takes (help articles, markdown files, CSV or JSON).
5. Topics that must always go to a person.

Access: level 1 to read sources and transcripts; level 2 to save draft entries or articles unpublished; level 3 to publish them to the live bot.

## Steps

### 1. Inventory the sources

List each document with owner, date, and what it covers. Mark anything older than the last policy or price change as "check". Agree which source wins on a clash, or ask the owner to decide.

### 2. List the real questions

Group the customer questions by topic and count them. Start with the most common. Keep customers' own words; they become phrasings.

### 3. Decide the size strategy

If all approved knowledge is small (Anthropic suggests under about 200,000 tokens, roughly 500 pages), it can go into the instructions or project knowledge whole. Larger sets need retrieval, and entries must then stand alone.

### 4. Write one entry per question

Each entry:
- **Title** written as the question ("Can I return a sale item?").
- **Short answer** first, one or two sentences, with numbers and conditions exactly as in the source.
- **Detail** below, only if needed.
- **Phrasings:** three to five ways customers ask it, in their words, including typos you saw.
- **Hand-over rule:** when the bot must pass to a person (amount over a limit, damaged goods, angry customer, anything medical, legal or financial).
- **Source and date** last true; **owner**; **tags**.

Keep each entry on one topic and short enough to retrieve cleanly, about 100 to 300 words. Name the product, plan and region inside the entry, because a retrieved chunk arrives without its neighbours.

### 5. Rewrite for standing alone

No "see above", "as mentioned" or "this plan". Spell out terms. Keep numbers and conditions exactly as the source says; never round a policy.

### 6. List clashes, duplicates and gaps

- **Clashes:** two sources giving different answers. Both go to the owner; do not pick a winner.
- **Duplicates:** merge into one entry.
- **Gaps:** common questions with no approved answer. Write "not covered: hand over" until the owner supplies an answer. Never fill a gap with a plausible guess.

### 7. Deliver in the tool's format

Markdown files (one per topic, clear file names), help-centre articles, or a CSV or JSON file with fields such as id, title, phrasings, answer, detail, handover_rule, source, updated, owner, tags. Validate CSV and JSON before handing over. At level 2, save as drafts; at level 3, publish within the agreed limits and log each entry published.

### 8. Write the upkeep plan

Owner per topic, review date, and a trigger list: what to update when a price, policy, product or opening hours change. New questions from tickets each month become new entries for approval.

## Checks

- Every fact in every entry traces to a named source and date.
- No entry answers something the sources do not support.
- Each entry covers one topic and stands alone.
- Every clash went to the owner; none was settled silently.
- Every entry has a hand-over rule, even if it is "none".
- No personal data from tickets appears in entries.
- CSV and JSON files parse.

## Output format

1. Source inventory with owners and dates
2. Question list with counts
3. Knowledge entries (in the tool's format)
4. Clash, duplicate and gap list
5. Upkeep plan: owners, review dates, change triggers
6. Publish log (level 3 only)

## Example of good output

*Made-up business, for illustration only: "Fernhill Garden Supplies", an online shop.*

> **Title:** Can I return plants? *(draft until the clash below is settled)*
> **Short answer:** Live plants can be returned within 14 days of delivery if they arrive damaged or dead. Send a photo within 48 hours of delivery and we will refund or replace them.
> **Phrasings:** "my plant arrived dead", "refund for plants", "can i send back a tree", "plant damaged in post"
> **Hand-over rule:** Orders over £150, or any customer who is upset or mentions a complaint, go to a person.
> **Source:** Returns policy v4, section 3, dated 2 Sep 2026. **Owner:** Customer service lead. **Tags:** returns, plants, damage.
>
> **Clash for owner:** Returns policy v4 says 14 days; the plant care page says 30 days. Which is right?
