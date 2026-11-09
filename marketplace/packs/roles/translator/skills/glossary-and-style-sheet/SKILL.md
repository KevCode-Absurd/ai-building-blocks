---
name: glossary-and-style-sheet
description: Builds a bilingual glossary, a do-not-translate list and a one-page style sheet for one target locale, then prepares them for use in translation engines (DeepL, Google Cloud Translation) and translation memory tools (TMX, CSV, TSV). Covers form of address, locale variant, number, date and currency formats, and how the glossary and translation memory are kept up to date. Use before a first translation into a new language, when terms are inconsistent across pages, or when a business starts using machine translation and wants it to follow its own terms.
---

# Glossary and style sheet

Consistent terms are what make a translated product feel cared for. This skill decides the terms and the style rules once, in a form that people and machines can both follow, and sets up the translation memory so approved work is reused.

## When to use

- Before the first translation into a new language or country.
- When the same feature, button or product has several names across a site.
- When a business starts using machine translation and the output ignores its terms.
- When several translators or freelancers work on one product.
- At each refresh, to add new product terms and retire old ones.

## What you need

- **Source terms:** product and feature names, UI labels, category names, recurring phrases, from the site, app strings, help centre and top support tickets.
- **Existing translations,** if any, including ones the client dislikes.
- **Target locale** (language and country) and the client's choice of tone and form of address.
- **The tools in use:** engine (DeepL, Google Cloud Translation), localisation platform, website plugin, translation memory files.
- **A native reviewer** to approve the final list.
- **Access level:** building the files needs level 1. Uploading a glossary or memory to the client's engine or platform as a new, unused version needs level 2. Switching live projects to the new glossary needs level 3 within the client's limits.

## Steps

1. **Harvest candidate terms.** Pull nouns and noun phrases that repeat, every UI label, product and plan names, and terms customers use in tickets. Keep each term's context (a sentence or screenshot).
2. **Sort into three groups:**
   - *Do not translate:* brand, product and feature names that stay in the source form, trademarks, code names.
   - *Translate one way only:* core terms with one approved target term.
   - *Context-dependent:* terms with two meanings (for example "order" as a purchase and as a sequence). Split them into separate entries with a note.
3. **Research each target term.** Check what the target market already says: competitor sites in that country, the platform's own localised UI (for example the target-language version of Shopify or Google), and Microsoft's free localization style guide for that language. Prefer the term users search for over a literal coinage.
4. **Write the glossary table:** source term, target term, part of speech, definition or context, note (gender, plural, forbidden alternatives), status (proposed, approved), owner, date.
5. **Write the style sheet (one page):**
   - Locale and variant (es-MX, fr-CA, pt-BR, zh-Hans) and spelling rules.
   - Form of address (tu or vous, du or Sie, tú or usted) and when it changes.
   - Tone in three adjectives with a do and a don't each.
   - Numbers, decimals, dates, times, currency and units, following CLDR locale conventions.
   - Punctuation: quotation marks, spaces before colons where the language uses them.
   - Gender-inclusive language: the client's choice, applied consistently.
   - UI rules: verb form for buttons, capitalisation, length limits.
   - What to do with English loanwords the market already uses.
6. **Review with a native speaker.** Mark entries approved only after review. Log disagreements and the decision.
7. **Prepare machine-ready files:**
   - DeepL: tab- or comma-separated term pairs, one per line; duplicate source terms are rejected. Newer v3 glossaries can hold several language pairs.
   - Google Cloud Translation: a unidirectional TSV, CSV or TMX file for one language pair, or an equivalent-term-set CSV with a header row of language codes. Matching is case-sensitive by default, and only the Translation LLM model applies glossary terms with context. Keep the master file: the service does not version glossaries.
   - Keep entries short (usually fewer than five words) and avoid stopwords; engines ignore or mishandle long entries.
8. **Set up the translation memory.** Export approved past translations as TMX. In the platform, decide whether only approved translations enter the memory, and treat 100% matches as suggestions that still get a read in context.
9. **Hand over and schedule upkeep.** One owner, a change log, and a review at each release or each month.

## Checks

- Every term has context, a status and an owner.
- No source term has two approved targets without a context note.
- Do-not-translate names are listed exactly as they appear, including capitals.
- Style sheet covers address, variant, formats, punctuation and UI rules.
- Machine files load without errors and match the approved list.
- A test translation of three real paragraphs uses the glossary terms correctly.
- The master glossary file is stored where the client controls it.

## Output format

1. **Glossary** (table, plus CSV or TSV for engines, plus TMX if needed).
2. **Do-not-translate list.**
3. **Style sheet** (one page).
4. **Test result:** three paragraphs translated with and without the glossary, differences marked.
5. **Upkeep plan:** owner, cadence, change log template.

## Example of good output (short)

*Illustrative structure, not a real business: a restaurant booking app adding French for France. Copy the shape, never the content: every fact comes from the client's own context.*

| Source | Target (fr-FR) | Part of speech | Context and note | Status |
|---|---|---|---|---|
| [Brand] | [Brand] | name | Brand. Do not translate. | approved |
| booking | réservation | noun, feminine | A table booking. The client chose the French word over the English loanword. | approved |
| party size | nombre de couverts | noun phrase | Restaurant term for number of diners. | approved |
| order (purchase) | commande | noun, feminine | Food ordered at the table. | approved |
| order (sequence) | ordre | noun, masculine | Sort order in lists. Separate entry to stop engine confusion. | approved |

**Style sheet extract:** fr-FR; address with "vous"; buttons use the infinitive ("Réserver une table"); non-breaking space before ":", "?" and "!"; dates as 06/11/2026; times as 19:30 (the client chose this over "19 h 30"); prices as 24,50 €.
