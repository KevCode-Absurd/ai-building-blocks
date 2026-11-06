---
name: translate-and-localise-content
description: Translates and adapts web pages, product listings, help articles, emails and app text for one target language and country, so the result reads as if written locally. Works from a brief and a glossary, adapts examples, idioms, units, dates, currency and form of address, keeps tags and placeholders intact, fits length limits, and returns a bilingual review table with notes for a native reviewer. Use when a business needs content in another language for a real market, or wants an existing translation checked and fixed.
---

# Translate and localise content

This skill turns source content into target-language content that does the same job for a new reader. It keeps the meaning, adapts what must change for the market, and makes every judgement call visible so a native speaker can check it quickly.

## When to use

- A website page, landing page or product listing going into a new country.
- Help articles, FAQs or policy pages for customers who read another language.
- Marketing or transactional emails.
- App or web interface strings (buttons, menus, error messages).
- A review of an existing translation that "sounds off" or causes support tickets.

Not for: certified, sworn or notarised translations; legal, medical or regulatory text without a qualified reviewer; slogans and taglines that need full transcreation (use the transcreation steps below, then get client sign-off on options).

## What you need

- **Source content** in its original format (DOCX, HTML, JSON, CSV, XLIFF) with context: screenshots, URLs, character limits.
- **Brief:** target language *and* country, reader, purpose, desired action, tone, formal or informal address, where the text appears, deadline, who reviews.
- **Glossary and do-not-translate list** if they exist. If not, build one first with the glossary-and-style-sheet skill.
- **Access level:** translating from shared files needs level 1. Saving unpublished translations in a website plugin, localisation platform or repository needs level 2. Publishing them needs level 3 within the client's limits.

## Steps

1. **Read the whole source first.** Note the purpose of each section, terms that repeat, claims with numbers, and anything ambiguous. Log questions for the client rather than guessing.
2. **Confirm the brief.** Write it as five lines at the top of the working file: locale (for example es-MX), reader, purpose, tone and address, constraints. Use short BCP 47 tags and add a region only where it changes the text.
3. **Load the glossary.** Mark every glossary term and every do-not-translate name in the source before translating.
4. **Choose the fidelity per section.** Contracts, specifications and safety text stay close to the source. Marketing, help and UI aim for the same effect on the new reader. Record the choice.
5. **Translate for meaning, sentence by sentence,** then read each paragraph as a whole in the target language and rewrite anything that reads as translated.
6. **Adapt for the market:**
   - Examples, idioms, humour and cultural references: replace with local equivalents or neutral wording, and note each change.
   - Formats: numbers, decimal and thousands separators, dates, times, currency, units, phone numbers and addresses, using CLDR-based locale conventions.
   - Names and forms: do not force "first name / last name" order; keep fields flexible.
   - Plurals: check the target language's plural categories for any string with a count.
   - Right-to-left languages: flag layout and markup needs (dir="rtl" on the page, logical start and end alignment).
7. **Protect the code.** Keep HTML tags, placeholders such as {name} or %s, variables, links and line breaks exactly as in the source, in a grammatical position. Never translate keys or IDs.
8. **Fit the space.** Compare length with any limit. If a string will not fit, give a shorter option and flag it.
9. **Check claims and risk.** Any health, safety, legal, environmental or price claim gets a flag for a qualified local reviewer. Do not soften or strengthen a claim in translation.
10. **For websites,** list the hreflang set the page needs (each version lists itself and the others, plus x-default) and warn against automatic language redirects.
11. **Self-review against the source:** every number, price, date, unit, name, URL and negation; no omissions; no leftover source words.
12. **Write the notes and the query log,** then deliver. At level 2, save translations unpublished in the tool. At level 3, publish only what is in the confirmed action list, log each action and report it.

**Transcreation (slogans, headlines, product names).** Write three options in the target language, each with a back-translation and one line on the idea it keeps. The client chooses; never publish a transcreated line without approval.

## Checks

- The brief is stated and followed: locale, reader, tone, address.
- Every glossary term is used, consistently; do-not-translate names are untouched.
- Numbers, prices, dates, units, names, URLs and negations match the source.
- Formats and plurals are local; nothing is left in source-language format.
- Tags, placeholders and variables are intact and correctly placed.
- Each string fits its limit, or is flagged.
- Risky claims are flagged, not quietly changed.
- The delivery note states the method (human, or machine translation with post-editing), who reviewed it, and what still needs a native check.

## Output format

1. **Brief block:** locale, reader, purpose, tone and address, constraints.
2. **Translated file** in the original format.
3. **Bilingual review table:** ID, source, target, note.
4. **Notes for the native reviewer:** the five to ten choices most worth checking.
5. **Query log:** question, location, status.
6. **For web pages:** hreflang list and URL plan.
7. **Delivery note:** method, glossary version, reviewer, open items.

## Example of good output (short)

*Ferrata Bikes is a made-up business used only to show the format: a UK e-bike shop launching a German page for Germany.*

**Brief block:** de-DE. Reader: commuters in German cities comparing e-bikes. Purpose: book a test ride. Tone: friendly, formal "Sie" (client choice). Constraint: hero headline 40 characters.

| ID | Source | Target | Note |
|---|---|---|---|
| h1 | Ride to work for less than a bus pass | Günstiger zur Arbeit als mit der Monatskarte | "Bus pass" adapted to "Monatskarte", the usual German term for a monthly ticket. 44 characters: over the limit, shorter option below. |
| h1-alt | | Pendeln für weniger als die Monatskarte | 39 characters; fits. "Pendeln" means commuting in general, so the bike idea moves to the subhead. |
| p2 | Free delivery on orders over £1,000 | Kostenlose Lieferung ab 1.000 € Bestellwert | Price converted only after the client confirmed the euro threshold; German number format. |
| cta | Book a test ride | Probefahrt buchen | Glossary term. |

**Note for reviewer:** check that "Monatskarte" is the word riders in the target cities use, and that the comparison still holds at local ticket prices. **Query (section 4):** is the 25 km/h assistance limit claim the same for the German model? Flagged for a qualified local reviewer.
