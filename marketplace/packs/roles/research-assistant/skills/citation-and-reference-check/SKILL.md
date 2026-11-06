---
name: citation-and-reference-check
description: Checks and formats a reference list so every citation is real, correct and says what the text claims. Resolves each DOI or link, matches author, title, year, journal, volume and pages against the record, flags made-up or garbled references (common in AI-written drafts), checks retraction and correction notices through Crossref, spots hijacked journals, confirms each in-text citation supports its sentence, and formats the list in APA, Chicago, Harvard, Vancouver or a house style. Also checks quotes are short, exact and credited. Use before submitting or publishing a report, white paper, grant bid, article or deck with references, and on any reference list an AI tool produced.
---

# Citation and reference check

## When to use

- A report, white paper, grant bid, article or deck has a reference list and is about to go out.
- An AI tool wrote or "found" references and nobody has opened them yet.
- A reference list needs converting to a different style.
- Quotes in a document need checking against the original.

## What you need

1. The document with its in-text citations and reference list.
2. The cited sources, if the client has them (PDFs, links).
3. The style required (APA, Chicago, Harvard, Vancouver, MLA or a publisher's own guide).
4. Whether web search is on. With it off, I can check format and internal consistency, and check claims against supplied PDFs, but I cannot confirm that unsupplied references exist; those are marked "not verified".

Access: level 1 (read) to check. Level 2 to return a corrected reference list and comments in the client's document or a cleaned RIS or BibTeX file for their reference manager. Level 3, within the client's limits, to edit the live document's references or update items in a shared reference library; deleting library items needs a fresh yes every time.

## Steps

### 1. Inventory

Number every in-text citation and every reference-list entry. Pair them. List citations with no entry, entries never cited, and duplicates.

### 2. Confirm each reference exists

- If it has a DOI, resolve it through doi.org and compare the landing page with the entry.
- If not, search Crossref, PubMed, Google Scholar or the publisher's site for the exact title in quotes.
- Compare every field: authors (spelling and order), year, title, journal or publisher, volume, issue, pages, DOI. In a 2023 test of AI-written reviews, the most common errors in real references were volume, issue, pages and year.
- If nothing matches, mark it **not found**. Do not "repair" it by picking a similar paper; ask the client where it came from.
- Never ask an AI tool to confirm its own references; check them in a database.

### 3. Check status

- Search Crossref (or the journal page) for retractions, corrections and expressions of concern. A retracted paper must not be cited as support; it can be cited only as an example of a retraction.
- For unfamiliar journals, check the hijacked journal list and the Think. Check. Submit. checklist.
- Mark preprints and check for a later peer-reviewed version.
- For web pages, check the link works; if it changed, cite an archived capture with its date.

### 4. Check support

For each in-text citation, open the source and find the passage that supports the sentence. Mark: supports, partly supports (narrower, older or different population), or does not support. Watch for citations that support a nearby claim but not the one they are attached to, and for secondary citing (citing a review for a finding that belongs to a study it cites; prefer the original, or write "cited in").

### 5. Check quotes

Each quote must match the original word for word, with the page. Keep quotes short and credited, and put the author's other ideas in your own words. In the US there is no word count that is always fair use; in the UK, quotation needs sufficient acknowledgement and fair dealing depends on the facts. Long extracts, figures and tables for commercial use need the publisher's permission or a qualified adviser's view.

### 6. Format

Apply the required style consistently: author names, capitalisation of titles, italics, DOI as a link, access dates for web pages where the style asks for them. A reference manager (Zotero, Mendeley, EndNote, Paperpile) can switch between thousands of CSL styles; I return a clean RIS or BibTeX file if the client uses one. For AI-generated text, follow the style guide's current rule for citing or disclosing AI tools, and the publisher's policy.

## Checks

- Every in-text citation has an entry and every entry is cited.
- Every reference was confirmed in a record, or marked not found or not verified.
- Every field matches the record.
- Retraction and correction status checked.
- Every citation supports its sentence.
- Every quote is exact, short, credited and has a page.
- Style applied consistently.

## Output format

1. Summary: number of references, how many confirmed, corrected, not found, retracted, not supporting.
2. Problem table: reference, problem, evidence, fix.
3. Corrected reference list in the required style.
4. Sentences to rewrite where a citation does not support the claim.
5. Optional: RIS or BibTeX file.

## Example of good output

Made-up business for illustration: Tidewell Housing Trust, a 22-reference policy brief partly drafted with an AI tool, Chicago author-date style.

> **Summary.** 22 references: 15 confirmed and correct, 4 confirmed with errors (fixed), 2 not found, 1 retracted.
>
> | Ref | Problem | Evidence | Fix |
> |---|---|---|---|
> | 7 | Wrong year and volume | DOI record shows 2019, vol. 34; entry says 2021, vol. 36 | Corrected |
> | 11 | Not found | No match in Crossref, PubMed or Google Scholar for the title or authors | Remove, or tell me where it came from |
> | 15 | Retracted | Crossref shows a retraction notice dated March 2024 | Remove as support; the sentence needs another source |
> | 18 | Does not support the sentence | Source reports rents in Leeds only; the brief says "across England" | Rewrite: "in Leeds, rents rose..." |
>
> Corrected list follows in Chicago author-date style.
