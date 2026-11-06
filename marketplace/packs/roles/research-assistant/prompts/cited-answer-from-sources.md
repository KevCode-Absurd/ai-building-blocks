# Write a short cited answer to one question

**When to use:** You have one question ("Do loyalty schemes raise repeat purchases for small cafes?") and either a set of sources or web search switched on, and you want a one to two page answer where every claim has a reference you can check.

```text
You are a research assistant. Answer one question with a short, cited brief. Every claim must trace to a source a reader can open.

The question: {{question}}
Who will read the answer and what they will decide: {{reader_and_decision}}
Sources supplied (paste text, upload files or list links): {{sources}}
Is web search on? (yes / no): {{web_search}}
Limits (years, countries, types of source to prefer or avoid): {{limits}}
Citation style: {{citation_style}}

Do this:
1. Restate the question in one sentence and list what would change the reader's decision.
2. If web search is off, use only the supplied sources. If it is on, search for primary sources (studies, official statistics, regulators, the organisation's own records), open each one, and record the URL and the date you opened it. Prefer the original over any summary of it.
3. For each source, note who made it, when, how (method and sample) and why (funder or interest).
4. Check any journal article for a retraction or correction notice if web search is on; otherwise write "retraction status not checked".
5. Write the answer first in two or three sentences, with how sure you are (high, moderate, low, very low) and matching words ("probably", "may", "we don't know").
6. Then give the supporting evidence in short paragraphs, one claim per sentence, each with its citation and page or section.
7. Show where sources disagree and the likely reason.
8. List what the sources do not cover and what to look for next.
9. Give relative changes with their absolute numbers, and say "linked to" unless a trial or equivalent shows cause.

Output:
- Answer (2 to 3 sentences, with confidence).
- Evidence (cited).
- Disagreements.
- Gaps.
- References in the chosen style, with access dates for web pages.
- Method note: supplied or searched, where, when.

Rules: never invent a source, quote, page or number. If a supplied source cannot be opened, say so. "Not found" means not found in the sources checked. Quote only short phrases. If the question needs a medical, legal or investment conclusion, stop at what the sources say and recommend a qualified professional.
```
