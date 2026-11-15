---
name: answer-pages-for-buyer-questions
description: "A set of answer pages for the specific questions buyers ask search and AI assistants before they buy (fit, sizing, compatibility, use, care, safety, delivery to a place, which model for which need), each written to be quoted: the question as the heading, a direct answer of one or two sentences, a facts table with units, short sections that each make sense alone, sources for every number, a link to the product that fits, and a refresh date. Questions come from the store's tickets, reviews, site search, Search Console and the sub-searches assistants run. Pages live in a help or guides subfolder, render without JavaScript and are checked against advertising claim rules. Use when buyers keep asking the same detailed questions, when assistants answer them with rivals' pages, or after an AI visibility baseline."
---

# Answer pages for buyer questions

**You get:** a question bank grouped into page topics and ranked by profit, plus 5 to 10 answer pages written in full (title, direct answer, facts table, sections, sources, product links, refresh date), with a claims file, ready for the client to approve and publish.

## When to use

- Support answers the same detailed questions every week (fit, compatibility, care, safety).
- An AI visibility baseline shows assistants answering buyer questions with rivals' or forum pages.
- Search Console shows question queries ("can you", "how long", "which size") with impressions and no good page.
- A product needs explaining before buyers trust it (new material, new use).

## Not for

- Short FAQ blocks on product pages or the help page: use `write-faq-from-tickets-and-reviews`.
- Sales-led blog posts (this versus that, best for, buying guides): use `write-seo-blog-posts-that-sell`.
- Size and fit guides as a page set: use `write-size-fit-and-how-to-use-guides` when the job is only sizing.
- Policy pages: use `write-store-policy-pages`.

## What you need

Required (read access, level 1):

1. **Buyer questions**: support tickets, chats, WhatsApp messages, reviews, returns reasons, site search terms (last 90 days or more).
2. **Search Console Queries** export filtered to question words (how, can, which, does, is, why, what size).
3. **Product facts** with sources: spec sheets, test results, supplier certificates, `product-claims-profile`.
4. **Gross profit per order** for the products each question leads to.

Optional: the AI visibility baseline from `get-recommended-by-ai-assistants`, People also ask results, a named expert or staff member who can review answers.

Drafting pages needs draft access (level 2); the client approves and publishes.

## Before you start: the gates

1. **Questions are real.** Pass when each question has a count from tickets, reviews, search or a logged assistant sub-search. Invented questions are dropped.
2. **Answers can be sourced.** Every number and claim has a source the store holds. In the US objective claims need a reasonable basis before publishing [MCR-6022]; in the UK and EU, claims must be backed by evidence held before they are made. Health, skin and safety answers go through `product-claims-profile`; anything medical points to a professional.
3. **Profit link.** The products each page leads to have gross profit per order known [MEA-0037]; pages leading only to loss-making products wait.
4. **Readable without JavaScript.** The help or blog template shows text in the HTML; content loaded later by apps is invisible to most AI crawlers [AEO-0002].

## Steps

### 1. Build the question bank

Collect questions in buyers' own words with a count and source each. Add the sub-searches an assistant runs when asked a category question; reuse that wording [AEO-0016]. Chat prompts are longer and more specific than typed searches, so narrow questions ("does it fit a 2019 model", "safe for a 6-month-old") are worth answering [AEO-0031]. AI Overviews show most on question searches [AEO-0019], so these are where the store is quoted or skipped.

### 2. Group into pages

One page per topic that a buyer would read in one sitting: "Will it fit my car: compatibility by model", "How to wash merino", "Delivery times to every region we ship to". Each page holds 5 to 12 related questions. Do not make one thin page per question; many near-empty pages built to catch similar searches are doorway pages [SEO-6461].

Rank pages by: question count x gross profit per order of the linked products. Write the top 5 to 10.

### 3. Place them in a subfolder

Use the store's own domain in a subfolder (/pages/help/... or /blogs/guides/...), not a separate help subdomain, so the pages share the store's strength [AEO-0031].

### 4. Write each page to be quoted

Structure:

- **Title and H1:** the main question in buyer words.
- **Direct answer first:** 2 to 4 sentences that answer it fully, then a short summary or table [AEO-0030].
- **Facts table:** the numbers that decide the answer, with units (sizes, temperatures, compatible models, delivery days by region).
- **Each H2 a question,** followed by a self-contained answer of about 20 to 25 words, then detail; link any number to its source [AEO-0023]. Each section must make sense if quoted alone: name the product, do not write "it" or "as above".
- **Link to the product** that fits each answer, where it helps (not in every paragraph).
- **"When to ask us"**: cases the page does not cover, with the support route.
- **Last checked date** at the top.

Length follows the question; cited pages are not longer on average [AEO-0009]. Most pages land between 500 and 1,200 words.

Three rules that make answers easy to lift:

- **No links inside the short answer.** Keep the 20 to 25 word answer clean (up to about 50 words when the question needs it); put links in the detail below it.
- **Name the store's own method.** If the store has its own rule, test or fit method, give it the brand's name ("the [brand] two-finger fit test") and use the same name on product pages, social posts and emails, so assistants repeat it as the store's idea rather than a generic tip.
- **Vague-claim sweep.** Before handing over, swap every "many customers", "most people" or "lasts for ages" for the store's real number with its source. Anything with no number or source either goes softer or onto the "still needs a source" list in the output.

**Rewriting a page that already ranks.** When a guide, blog post or FAQ ranks in Google but is never named in AI answers, rewrite it in place rather than starting a new page: keep the URL, put the direct answer and summary at the top, turn H2s into buyer questions with stand-alone answers, add the facts table, and keep the page about the same length or shorter. Normal ranking still matters, since many assistants pull from top search results.

### 5. Truth and tone

- Answer honestly, including "no": "It does not fit the 2015 model" earns more trust and fewer returns than silence.
- Name rivals only with sourced, dated facts and a clear basis.
- Use the store's own measurements, photos and tests; mark which were done in-house.
- Write at grade 8: short sentences, everyday words.
- AI drafting is fine; a named staff member checks every fact before publishing.

### 6. Markup and set-up

- No special markup is needed for Google's AI features; the page must be indexed and snippet-eligible, and any markup must match visible text [AEO-6460].
- FAQ markup no longer earns FAQ rich results in Google [SEO-6160]; add it only if the theme does it cleanly and the questions are visible.
- SEO title under 60 characters, meta description under 155, handle with the question words.
- Link each page from the related product pages ("Will it fit?") and from the help hub; hand the links to `internal-linking-plan`.

### 7. Market notes

- **All markets:** answer delivery, payment, returns pickup and tax invoice questions by region where they differ; give delivery days per zone, state or country, not "3 to 7 days" for everywhere. Publish versions in the other languages your buyers use only where the store supports buyers in that language.
- **UK and EU:** answer duties and VAT questions for cross-border orders plainly (who pays, and whether the price includes them), and state the legal returns window.
- **US:** state shipping times by region if they differ; product safety answers for children's items refer to the certificate the store holds.

### 8. Publish, then keep fresh

After the client publishes, request indexing. Cited pages skew fresh, with most top-cited pages updated within a month [AEO-0021]. Set a refresh date on each page: practitioner default every 3 months, and at once when a product, price or policy changes. Re-run the related questions in assistants a month after publishing (hand to `track-ai-answer-visibility`).

## Checks before you hand it over

- Every question has a count and a source; no invented questions.
- Each page opens with a direct answer in 2 to 4 sentences.
- Every H2 is a question with a self-contained answer that names the product.
- Every number has a source in the claims file; health and safety answers passed the claims profile.
- Pages sit in a subfolder of the store's domain and render without JavaScript.
- No near-empty one-question pages.
- No links inside the short answers; no vague claim left without a number or a place on the "still needs a source" list.
- Each page has a last checked date and a refresh date.
- Nothing published without the client's yes.

## Output

1. **One-screen summary:** pages written, the questions they cover with counts, products they lead to, refresh dates.
2. **Question bank** (`buyer-questions.csv`): Question, Source, Count, Page topic, Product, Gross profit per order, Status.
3. **Page set:** for each page, the full copy:

| Field | Content |
|---|---|
| URL handle | |
| SEO title / meta description | |
| H1 | |
| Direct answer | |
| Facts table | |
| Question sections (H2 + answer + detail) | |
| Product links | |
| When to ask us | |
| Last checked / refresh date | |

4. **Claims file:** Claim, Source, Date checked, Reviewer.
5. **Still needs a source:** Claim, Page, What is needed (number, test, source), Owner. Plus the store's named methods and where each name is used.

## Common mistakes

- **Fluffy intros.** Step 4 puts the answer first.
- **Sections that only make sense in order.** Step 4 makes each one stand alone.
- **One page per question.** Step 2 groups related questions.
- **Unsourced numbers.** Gate 2 and the claims file.
- **Answers hidden in app widgets.** Gate 4 checks with JavaScript off.
- **Write once, never update.** Step 8 sets refresh dates.
- **Starting a new page when one already ranks.** Step 4 rewrites the ranking page in place and keeps its URL.

## Sources

- AEO-0002: app-loaded content is invisible to most AI crawlers.
- AEO-0009: length barely matters for citations; freshness does.
- AEO-0016: reuse assistant sub-search wording.
- AEO-0019: AI Overviews appear mostly on question searches.
- AEO-0021: cited pages are mostly refreshed within a month.
- AEO-0023: question headings with short direct answers and linked numbers.
- AEO-0030: direct answer first, tables, original data.
- AEO-0031: answer narrow questions in a subfolder help centre.
- AEO-6460: no special markup for Google's AI features.
- MCR-6022: US claims need a reasonable basis.
- MEA-0037: gross margin is delivered cost.
- SEO-6160: FAQ rich results removed from Google.
- SEO-6461: doorway pages.

What makes this skill ours: questions come only from counted buyer sources and logged assistant sub-searches; pages are ranked by the profit of the products they lead to; every section is written to stand alone when quoted, with sourced numbers and honest "no" answers; and delivery, payment and tax questions are answered by region.

## Selling in India

- Verifiable claims must be substantiated on demand [ADC-6146].
- Answer COD and GST invoice questions by state, and give delivery days per zone, not one range for the whole country.
