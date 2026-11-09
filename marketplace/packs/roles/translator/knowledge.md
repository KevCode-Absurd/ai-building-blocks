# Translator: what the role knows

Checked 2026-11-06. Sources are numbered [n] and listed in sources.md with the date each was checked.

## 1. What this role is for

A small business hires a translator when it wants to sell, support or teach in a language it does not write well. The usual jobs: a website or shop going into a new country, product listings for a marketplace abroad, help articles for customers who write in another language, emails and app text, and subtitles for videos, courses and podcasts.

The job is not to swap words. It is to produce text that does the same job for a new reader as the original did for the first one: a page that sells, a help article that gets the problem fixed, a subtitle that can be read before it disappears. Microsoft's style guide draws the line clearly: translation changes the language, while localization adapts content to the language, culture and expectations of one market, and is done by people who know that market [4]. W3C lists what localization can touch beyond words: number, date and time formats, currency, sorting, symbols and colours, images or phrases that could be misread, and legal requirements [6].

What good work looks like:

- It starts with a brief: who reads it, in which country, for what purpose, in what tone, and where the text will appear.
- Terms are decided before translating, in a glossary, and used the same way every time.
- Meaning, tone and intent survive. Prices, numbers, names, dates and negations are exactly right.
- Formats follow the target locale: numbers, dates, currency, addresses, names, plural forms, text direction.
- It fits where it lives: buttons, subtitles, layouts and character limits.
- Every choice a reviewer might question is noted, so a native speaker can check it fast.

How it is judged: a native reader in the target market does not notice it was translated; there are no errors in the parts that cost money or cause harm (prices, safety, legal terms, medical words); terms are consistent across pages; and the text works in its real setting.

**What this kit does not do.** It does not produce certified, sworn or notarised translations, and it gives no legal, medical, immigration or regulatory rulings. Section 3 says where to get a certified translation in the US, UK and EU.

## 2. The canon

Each idea is summarised in my own words and credited.

**Eugene A. Nida, *Toward a Science of Translating* (1964) [1].** Nida separated two aims. *Formal equivalence* keeps close to the source's words and structure. *Dynamic equivalence* aims for the same effect on the new reader that the original had on its first readers, even if words and structure change. Most business text (marketing, help, UI) needs the second; contracts and specifications often lean toward the first. The habit to keep: decide which kind of fidelity this text needs before you start.

**Katharina Reiss and Hans Vermeer's Skopos theory, as explained by Christiane Nord, *Translating as a Purposeful Activity* (1997) [2].** The purpose of the translated text (its *skopos*) decides the method. The same source can be translated differently for a legal filing, a product page or a voiceover. Nord's practical gift is the *translation brief*: who the new reader is, what the text is for, when and where it will be read, and what medium carries it. She also stresses loyalty to both the client and the original author, so changes made for the new market are open, not hidden.

**Lawrence Venuti, *The Translator's Invisibility* (1995) [3].** Venuti named two pulls. *Domestication* makes the text read as if written locally, smoothing away foreign traces. *Foreignisation* keeps some strangeness so the reader knows the text comes from elsewhere. He argued that the fluent, domesticated style hides the translator's choices. For business work, domestication is usually the goal, but some things should stay foreign on purpose: brand names, product names, a founder's story set in a real place.

**Microsoft's localization style guides [4][5].** Microsoft publishes free style guides for about 100 languages and variants, covering tone, grammar choices, terminology habits and local data formats [5]. They are a sound starting point for a client with no style sheet of their own, especially for software and help content. Its English guidance on writing for a global audience also shows how to write source text that translates well [4].

**W3C Internationalization [6][7][11][12].** The W3C's articles are the plain reference for the web side of the craft: what localization and internationalization mean [6], how language tags work [7], how names vary around the world [11] and how right-to-left text is marked up [12].

**MQM, Multidimensional Quality Metrics [20].** MQM gives translators and buyers a shared way to log errors by type (accuracy, fluency, terminology, style and more) and by severity, then turn them into a score that supports accept, revise or reject decisions. The MQM Council states it is aligned with ISO 5060 [20].

**Standards to know by name.** iso.org blocks automated reading, so these are named only, without detail: ISO 17100 (requirements for translation services), ISO 18587 (post-editing of machine translation output), ISO 5060 (evaluation of translation output), ISO 20771 (legal translation), and the code standards used in locale work: ISO 639 (languages), ISO 3166 (countries), ISO 4217 (currencies) and ISO 8601 (dates and times). An agency certified to ISO 17100 or ISO 18587 can show its certificate; ask for it rather than assume.

**Further reading (no claims drawn from these).** Mona Baker, *In Other Words: A Coursebook on Translation* (Routledge, 1992, with later editions). Peter Newmark, *A Textbook of Translation* (1988).

## 3. How the work is done now

**The brief comes first.** Following Nord [2], every job starts with: source text and file format; target language *and* country (Spanish for Mexico is not Spanish for Spain); the reader; the purpose and the action the reader should take; tone and form of address (formal or informal "you" where the language has both); where the text appears and any length limits; terms that must not be translated; the risk level; and who will review it.

**Pick the method by risk.** In 2026 the realistic options are:

1. *Machine translation (MT) only*, for gist: reading a supplier email, triaging tickets. Never for anything published or binding.
2. *MT plus post-editing*, for high-volume, lower-risk text such as help articles, product attributes and internal docs, with a glossary loaded into the engine.
3. *Human translation plus review*, for pages that sell, anything public under the brand, and anything with safety, health, money or legal weight.
4. *Transcreation*, for slogans, ads, names and humour, where the idea is rewritten for the market and the client approves options with back-translations.
5. *Certified, sworn or notarised translation*, for official documents. That is outside this kit (see below).

**Glossary and style sheet before translation.** The glossary lists source terms, the approved target term, part of speech, a note on use, and a "do not translate" flag for brand and product names. The style sheet sets form of address, locale variant, number and date formats, quotation marks and tone. Engines can enforce the glossary: DeepL glossaries are built from TSV or CSV term pairs and newer v3 glossaries can hold several language pairs [16]; Google Cloud Translation accepts TSV, CSV or TMX glossaries, matches case-sensitively by default, and only its Translation LLM model applies glossaries with context [17]. Google warns that glossaries are not versioned, so keep the source file as the master [17].

**Translation memory (TM).** A TM stores each translated segment with its source so repeats and near-repeats are reused. Crowdin, for example, separates a *Perfect* match (same text and context), a *100%* match (same text, different context) and *fuzzy* matches below 100%, and its auto-translation from TM uses only 100% and Perfect matches [18]. TMX is the common exchange format for memories [17][18], and XLIFF 2.1 (an OASIS Standard since February 2018) carries content between translation tools [19]. Treat a 100% match as a suggestion: the same sentence can need a different translation in a new context.

**Machine translation and LLMs, as of late 2025.** The WMT25 shared task, the main yearly public comparison, evaluated 60 systems across 30 language pairs [21]. Its best system (Gemini 2.5 Pro) was in the top cluster for 14 of 16 human-evaluated pairs, and human reference translations reached the winning cluster in only 6 of 15 pairs. The same report says top systems still struggle with non-standard input, domain terminology and gender agreement, that a very low-resource language (Maasai) was largely unusable, and that automatic scores were biased, so human evaluation should remain the final judge [21]. It also notes its human references were not post-edited to the standard of sworn or published translation [21]. The practical reading: modern MT is often fluent and frequently good, which makes its errors harder to spot, not rarer.

**Post-editing.** Post-editing means a translator corrects MT output against the source. Two levels are common in practice. *Light* post-editing fixes meaning errors, omissions and anything offensive or unsafe, and accepts plain style; use it for internal or short-lived text. *Full* post-editing brings the text to the standard of a human translation, including terminology, style and locale conventions; use it for anything published. ISO 18587 is the standard for this work (named only). Always check numbers, names, units, negations ("do not"), product terms and anything the engine may have left in the source language.

**Locale formats.** Use BCP 47 language tags and keep them short; add a script or region only when it matters, as in zh-Hans, es-419 or en-GB [7]. CLDR, the Unicode project whose locale data is used by modern operating systems, browsers and programming languages, supplies formats for dates, numbers, currency and units, sorting rules and plural rules; CLDR 49 was released on 2026-10-22 [8]. The same number, 123456.789, prints as 123.456,789 in German and 1,23,456.789 in Indian English, and yen amounts carry no decimal places [10]. Plural forms differ: English has two categories (one, other), Polish and Russian have four, Arabic six, and Japanese one [9], so a string like "{count} items" may need several translations. Names vary too: many cultures put the family name first, some people have no family name, and labels like "first name" confuse them [11]. For Arabic, Hebrew and Persian pages, set `dir="rtl"` on the html element rather than in CSS, use logical start and end layout values, and let user text detect its own direction [12].

**Websites and search.** Google reads the language of a page from its visible text, not from code attributes, and advises one language per page and no automatic redirects based on a visitor's assumed language; give people links to switch instead [14]. Tell Google about each language version with hreflang (HTML tags, HTTP headers or the sitemap), make every version list itself and all the others, add an x-default fallback, and use ISO 639-1 language codes with optional ISO 3166-1 alpha-2 region codes; Google does not support es-419 here, and "UK" is not a valid region code (use GB) [13]. Mass machine translation of scraped content to create pages that give users little value counts as scaled content abuse under Google's spam policies [15].

**Subtitles.** Subtitles are timed text read against the clock. Netflix's English guide, a widely used public reference, caps a line at 42 characters and reading speed at 20 characters per second for adult programmes and 17 for children's [29]; its general requirements allow two lines at most and an event duration between five-sixths of a second and seven seconds [30]. Translated subtitles must be condensed, not just translated: a faithful line that cannot be read in time has failed.

**Quality checks.** Run an MQM-style error log on a sample: each error gets a type (accuracy, fluency, terminology, style, locale convention) and a severity [20]. Pair it with a native reviewer in the target market for anything public. For short, high-stakes text (a claim, a warning, a tagline), a back-translation into the source language helps a client who cannot read the target check the meaning.

**Labelling AI-made translations.**

- *EU.* The AI Act's transparency obligations in Article 50 apply from 2 August 2026, and the Commission published guidelines on 20 July 2026, updated on 5 November 2026 [22]. According to the MQM Council's summary (not the official text), the final guidelines treat machine translation like editing for the provider's marking duty, while text published to inform the public on matters of public interest needs a visible label unless it went through human review with someone holding editorial responsibility, and each translated version needs its own review [23]. Check the Commission guidelines themselves before advising a client [22].
- *Platforms.* Amazon KDP requires authors to disclose AI-generated translations when publishing, even if edited afterwards; AI-assisted work (your own translation, checked with AI) need not be disclosed [24].
- *US and UK.* I found no general AI-translation labelling rule to cite. Check the rules of each platform and sector the client publishes in.

**Certified translation: where to get one.** This kit does not provide it. Send the client to a professional, and tell them to ask the receiving authority first what it accepts.

- *US:* USCIS, for example, requires a complete English translation that the translator has certified as complete and accurate, plus the translator's certification of competence [25]. Use a professional translator who will sign that statement; the American Translators Association is the national professional body.
- *UK:* there is no sworn or court-appointed translator system. GOV.UK asks the translator to confirm in writing that it is a true and accurate translation, with the date, full name and contact details [26]. CIOL advises using a qualified translator or company affiliated to CIOL, ITI or the Association of Translation Companies, and points to their public registers [27].
- *EU:* for public documents covered by EU rules (such as birth or marriage records), ask the issuing country for a multilingual standard form, which can replace a translation; a certified translation may be requested only exceptionally [28]. Other rules differ by country: use the register or sworn-translator list that the receiving authority names.

## 4. Benchmarks and numbers

Use these to set expectations, never as targets. Each has a source, a date and a caveat.

- **MT quality (WMT25, published November 2025) [21].** 60 systems, 30 language pairs, human evaluation on half. The top system was in the winning cluster for 14 of 16 evaluated pairs and on par with or better than the human translation in 10 of them. Human references were in the winning cluster in only 6 of 15 pairs. *Caveats:* general-domain test sets, not your product; annotators' preferences may play a part, as the authors note; the human references were not prepared to sworn or published standards; and results move every year.
- **Subtitle limits (Netflix English, guide changelog to 19 December 2025) [29][30].** 42 characters per line, two lines, 20 characters per second for adults and 17 for children, events from five-sixths of a second to seven seconds. *Caveat:* one distributor's rules; broadcasters and platforms set their own.
- **Engine glossary limits [16][17].** DeepL: 10 MiB per glossary, 1024 bytes per entry, up to 1000 glossaries per account. Google Cloud Translation: about 10 MB of input per glossary, terms under 1024 bytes. *Caveat:* plan tiers set lower limits; check the client's plan.
- **Translation memory files (Crowdin) [18].** TMX, XLSX or CSV up to 200 MB per upload; automatic reuse only for 100% and Perfect matches.

No source I could check gives a trustworthy words-per-day rate, price per word or "MT saves X%" figure for small businesses. Use the client's own volumes and the quotes they receive.

## 5. Decision rules

- If the text is binding or official (contracts, court, immigration, medical records), stop and refer the client to a certified professional, because a non-certified translation may be refused and errors carry legal weight [25][26][27].
- If the target country is not named, ask before translating, because spelling, vocabulary, formality and formats change by country [7].
- If there is no glossary, build a short one first from the brand, product and UI terms, because inconsistent terms are the most visible sign of a careless translation.
- If text will be published under the brand, use human translation or full post-editing plus native review, because fluent MT errors are hard to spot [21].
- If the text is for internal gist only, MT alone is fine; say so in the delivery note.
- If a sentence contains a number, price, date, unit, name or negation, check it against the source by hand, because these are where small errors cost most.
- If the source is ambiguous, ask the client rather than guess, and log the question.
- If a slogan, pun or idiom does not work in the target language, offer two or three transcreated options with back-translations and let the client choose.
- If the page will appear in search, add hreflang with return links and an x-default, and do not auto-redirect by language [13][14].
- If the text goes into a UI, keep placeholders, tags and variables exactly as they are and flag any string that will not fit.
- If a count appears in a string, check the target language's plural categories before translating [9].
- If a subtitle cannot be read in time, condense the meaning rather than shrink the font or extend into the next shot [29][30].
- If the client is publishing public-interest text in the EU produced with AI, make sure a named person reviews each language version and takes editorial responsibility, or label it [22][23].
- If the client asks you to translate many pages automatically only for search traffic, warn them about Google's scaled content abuse policy [15].

## 6. Common mistakes, and how to spot them

- **Translating without a brief.** Spot it: the tone flips between formal and informal, or Spain Spanish appears on a Mexican site.
- **Literal translation.** Spot it: idioms translated word for word; sentences that are grammatical but no local would write.
- **Inconsistent terms.** Spot it: the same button or feature has two names across pages.
- **Unchanged formats.** Spot it: US dates (11/06/2026) on a European page, dollar signs on a euro price, imperial units for a metric market [10].
- **Broken placeholders and tags.** Spot it: "{name}" translated, HTML tags reordered, variables missing in the target string.
- **Plurals hard-coded for English.** Spot it: "1 items" or wrong word forms for counts in Polish or Russian [9].
- **Unreviewed MT published.** Spot it: no reviewer named in the delivery note; terms that ignore the glossary.
- **Hreflang errors.** Spot it: no return links, "en-UK" codes, missing x-default, language pages that redirect visitors automatically [13][14].
- **Subtitles too dense.** Spot it: three-line subtitles, or more than the reading-speed limit [29][30].
- **Names and addresses forced into English shapes.** Spot it: required "last name" fields, upper-cased names [11].
- **Over-promising.** Spot it: a delivery that claims "native quality" or "certified" when no native review or certification happened.

## 7. Quality bar: what an expert checks before shipping

1. Does the brief name the target country, reader, purpose, tone and form of address, and does the text follow it?
2. Is every glossary term used, and used the same way every time?
3. Do all numbers, prices, dates, units, names, URLs and negations match the source?
4. Are formats local: numbers, dates, currency, addresses, plurals, text direction [8][9][10][12]?
5. Are placeholders, tags and variables intact, and does each string fit its space?
6. Read aloud by itself, does it sound like a local wrote it, with no leftover source-language words?
7. Are risky items (claims, health, safety, legal terms) flagged for a qualified local reviewer?
8. For web pages: hreflang, one language per page, no auto-redirect [13][14]?
9. For subtitles: line length, line count, reading speed and timing within the agreed limits [29][30]?
10. Is the delivery note honest about method (MT, post-editing or human), who reviewed it, and what still needs a native check?

## 8. How this role writes

**Deliverables.**

- *Translated file* in the original format (DOCX, HTML, JSON, XLIFF, SRT, VTT, CSV), structure untouched.
- *Bilingual review table:* segment ID, source, target, note. Native reviewers work fastest from this.
- *Glossary and style sheet:* term, approved translation, do-not-translate flag, notes; tone, form of address, formats.
- *Translator notes:* each choice that departs from the literal meaning, and why.
- *Query log:* questions for the client, with status.
- *QA report:* sample size, error counts by type and severity, verdict [20].
- *Delivery note:* method used, engine and glossary if MT was used, who reviewed, what still needs native or expert review.

**Tone and conventions.** Notes to the client are short and in the client's language. Every flag says what the risk is and what to do. Never claim certification, native perfection or legal accuracy that was not provided.

## 9. Glossary

- **Source and target:** the original text and language, and the translated text and language.
- **Locale:** a language plus a region and its conventions, such as fr-CA [7].
- **Localization (l10n):** adapting content to a market's language, culture and conventions [4][6].
- **Internationalization (i18n):** building content or software so it can be localized easily [6].
- **Transcreation:** recreating a message, slogan or idea for a market rather than translating it.
- **Translation brief:** the instructions that set purpose, reader, use and tone [2].
- **Skopos:** the purpose of the translated text, which decides the method [2].
- **Dynamic equivalence:** aiming for the same effect on the new reader [1].
- **Domestication and foreignisation:** making a text read as local, or keeping its foreign traces [3].
- **Glossary (termbase):** approved term pairs and notes used for consistency [16][17].
- **Do-not-translate (DNT) list:** names and terms that stay in the source form.
- **Translation memory (TM):** a database of past source and target segments [18].
- **Fuzzy match:** a TM match below 100% that needs editing [18].
- **TMX:** the common exchange format for translation memories [17][18].
- **XLIFF:** an XML format that carries translatable content between tools [19].
- **Machine translation (MT):** automatic translation by an engine or language model [21].
- **Post-editing:** a human correcting MT output, at a light or full level.
- **Back-translation:** translating the target back into the source to check meaning.
- **MQM:** a shared error typology and scoring method for translation quality [20].
- **hreflang:** the annotation that tells search engines which language version suits which user [13].
- **BCP 47 tag:** the standard language tag format, such as en-GB [7].
- **CLDR:** Unicode's shared data for locale formats and plural rules [8].
- **Plural categories:** the forms a language uses for counts, such as one, few, many and other [9].
- **Certified translation:** a translation with a signed statement of accuracy for official use; provided by professionals outside this kit [25][26][27].

## 10. What changes fast

Re-check at each refresh:

- **EU AI Act Article 50 guidelines** and the Code of Practice on AI-generated content: digital-strategy.ec.europa.eu [22]; compare any summary against the official page [23].
- **MT quality:** the yearly WMT findings on aclanthology.org [21], and engine release notes (DeepL, Google Cloud Translation) [16][17].
- **Engine features and limits:** glossary formats, contextual glossaries, plan limits [16][17].
- **CLDR releases** and plural or format changes: cldr.unicode.org [8].
- **Google Search guidance** on hreflang and spam: developers.google.com/search [13][14][15].
- **Platform rules** on AI disclosure, such as KDP [24].
- **Subtitle style guides** from the platforms the client delivers to [29][30].
- **Certified translation rules** at USCIS, GOV.UK, CIOL and Your Europe [25][26][27][28].

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` If there is no glossary, build a short one first from the brand, product and UI terms, because inconsistent terms are the most visible sign of a careless translation. (§5)
- `decision_rule` Use human translation or full post-editing plus native review for text published under the brand; for internal gist only, MT alone is fine, and say so. (§5)
- `decision_rule` When a slogan, pun or idiom does not work in the target language, offer two or three transcreated options with back-translations and let the client choose. (§5)
- `decision_rule` When a subtitle cannot be read in time, condense the meaning rather than shrink the font or run into the next shot. (§5)
- `check` Read aloud by itself, does it sound like a local wrote it, with no leftover source-language words? (§7)
