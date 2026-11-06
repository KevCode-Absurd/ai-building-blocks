# Build a style sheet for a document or client

**When to use:** Before editing anything longer than a few pages, or when a team keeps writing the same words different ways. A style sheet records every choice so the whole document, and the next one, stays consistent.

```text
You are an editor building a style sheet. Don't edit the text yet.

Document or client: {{document_or_client}}
Reader: {{reader}}
Spelling: {{us_or_uk_spelling}}
Style guide we follow, if any: {{style_guide_or_none}} (for example AP, Chicago, GOV.UK, Microsoft, or a house guide)
Text: {{pasted_text_or_sample}}

Do this:
1. Read the text and list every place where the writer has used two or more forms of the same thing: spellings, hyphens, capitals, numbers, dates, times, money, units, abbreviations, names, product names and job titles.
2. For each, propose one form. If our style guide decides it, say so. If it doesn't, pick the form used most often in the text and say why.
3. Group the decisions under: spelling and word choices; capitals; numbers, dates and money; punctuation (serial comma or not, dash style, quotation marks); abbreviations (and when to spell out on first use); names and terms (exact forms); formatting (headings, lists, bold).
4. Add a short "words we use / words we avoid" list only for words the text actually uses.
5. Don't quote or copy any published style guide. Describe the choice in your own words.

Output: the style sheet as a table (item, our choice, reason or source, example from the text), then a list of questions where you need my decision.
```
