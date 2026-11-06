---
name: citation-ready-page-rewrite
description: Rewrites an existing page so AI answer engines and people can find, understand and quote it. Puts a direct answer first under question-style headings, makes each passage self-contained, adds specific dated facts with sources, named expertise and original data, moves key facts out of images, PDFs and tabs into HTML text, and checks structured data against visible content. Avoids tactics Google calls myths or spam, such as chunking for its own sake or a page per query variation. Use when a page ranks or is relevant but is rarely cited in AI answers, or when a visibility audit finds a content gap.
---

# Citation-ready page rewrite

AI answers are built from passages. A page gets quoted when one of its passages answers a sub-question clearly, specifically and credibly, and when the page offers something the other sources do not. This skill rewrites a page toward that, without writing for robots: the same changes make the page better for readers.

## When to use

- A page ranks in search, or covers a topic buyers ask AI about, but is rarely cited.
- The ai-answer-visibility-audit skill found a content gap.
- A key commercial page (pricing, comparison, service, product) is vague or hides its facts.

Not for: creating dozens of new pages for every wording of a question. Google treats that as scaled content abuse.

## What you need

**Access:** level 1 to read the page and its data. Level 2 to save the rewrite as a draft in your CMS. Level 3 to publish it, within the pages you listed, once you have confirmed every claim.

1. **The page URL** and its current text (paste or export).
2. **The questions it should answer:** from the visibility audit prompt set, Search Console queries for the page, "People also ask", sales and support questions.
3. **What the engines say now:** two or three AI answers to those questions, with the sources they cite.
4. **The client's proof:** their own data, prices, test results, case examples, certifications and the names and credentials of experts who can be quoted.
5. **Rules:** brand voice, legal or regulated claims limits.

## Steps

### 1. Map questions to passages
List the 5 to 12 questions the page should answer. For each, note whether the page answers it now, where, and how well. Mark the questions the cited competitor pages answer better and why (a number, a table, a named expert, a clearer definition).

### 2. Write the lead answer
Under the H1, write a direct answer to the page's main question in one or two sentences, then a sentence on who it is for or when it applies. Include the specific fact a buyer needs (a price range, a time, a limit) with its date.

### 3. Restructure around the questions
- Turn vague headings ("Our approach") into the question a reader asks ("How long does a boiler service take?").
- Start each section with its answer, then the detail, conditions and exceptions.
- Make each passage stand on its own: name the subject instead of "it" or "this", and repeat the key term once where needed. Microsoft's guidance warns against long walls of text that blur several ideas together.
- Use a table for comparisons and specifications, and a numbered list for steps.
- Keep paragraphs to one idea.

### 4. Add evidence and originality
These were the strongest changes in the GEO study (Aggarwal et al., 2024), and they match Google's advice to add original value:
- **Statistics:** specific numbers with a date and a source. Prefer the client's own data.
- **Citations:** link primary sources (official guidance, standards, original research).
- **Quotations:** short, attributed comments from a named expert with stated credentials.
- **First-hand detail:** what the client saw, tested or measured; photos they took.
Never invent a number, quote or credential. If proof is missing, mark the gap for the client to fill.

### 5. Make facts readable by machines and people
- Move facts from images, PDFs, sliders and closed tabs into visible HTML text.
- Show "last checked" dates on prices and facts that change.
- Keep the brand name, product names and key facts identical to the brand's About page and profiles.
- Add or check structured data that matches visible content (for example Product, Service, LocalBusiness, Article with author, Organization on the About page). Google says no special schema is needed for its AI features, so do this for clarity and rich results, not as a trick.

### 6. Link the page into the site
Add links (level 3 within the agreed pages, or as a change list) from related pages with descriptive anchors, and from the page to the deeper pages that support its claims.

### 7. Check against the myths and spam rules
- No hidden text, keyword stuffing, or text aimed at AI that people cannot see.
- No fake reviews, testimonials or experts.
- No splitting into many thin pages.
- No llms.txt or "AI file" sold as the fix.

### 8. Plan the measurement
Record the before state: citation share for the page's questions from the visibility audit, Search Console clicks and Generative AI report impressions for the page, and Bing AI Performance citations. Re-measure after the page is re-crawled and indexed (usually two to six weeks), using the same prompts and run counts.

## Checks before you ship

- The first two sentences answer the main question with a specific, dated fact.
- Every section opens with its answer and makes sense on its own.
- Every number has a source and a date; every quote has a named, real person who approved it.
- Key facts are in HTML text and match the brand's other profiles.
- Structured data describes only visible content.
- The client has approved all claims, especially in regulated topics.

## Output format

1. Question map: question | answered now? | where | gap | fix.
2. The rewritten page in Markdown, with new or changed passages marked.
3. Evidence list: claim | source or owner | status (have, need).
4. Structured data notes.
5. Measurement plan with the baseline.

## Example of good output (made for this kit, not a real client)

> **Before (opening):** We are a family-run team with years of experience providing quality boiler services across the region.
>
> **After (opening):** A standard annual gas boiler service from us takes 45 to 60 minutes and costs £89 including VAT (prices checked 2026-11-01). It suits most combi and system boilers under 15 years old; older or LPG boilers are quoted separately.
>
> **Before (heading):** Why choose us
>
> **After (heading and answer):** What does a boiler service include? This is followed by a nine-step checklist table, each step with what the engineer checks and why, and a short quote from the lead engineer, with her registration number shown in her bio.
>
> **Evidence gaps for the client:** the number of services completed in 2025 (needs the client's records); permission to quote the engineer.
