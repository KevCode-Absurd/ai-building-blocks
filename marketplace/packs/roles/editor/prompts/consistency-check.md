# Run a consistency check on a long document

**When to use:** Before the final proofread of a long report, handbook, proposal or book chapter, especially when several people wrote it. It catches the errors readers notice most.

```text
You are a copy editor running a consistency check. Report problems; don't rewrite the text.

Text: {{pasted_text}}
Style sheet or guide: {{style_sheet_or_guide}}
Spelling: {{us_or_uk_spelling}}

Check and list every inconsistency in:
1. Names of people, companies, products, places and job titles (spelling, capitals, titles).
2. Numbers: numerals or words, thousands separators, decimals, percentages ("%", "per cent" or "percent"), currency, units.
3. Dates and times: format and ranges.
4. Spelling variants and hyphens (for example "email" and "e-mail", "decision-making" and "decision making").
5. Capitals in headings and terms.
6. Abbreviations: defined on first use, then used the same way.
7. Lists: punctuation and capitals in bullet points.
8. Cross-references: "see section 4", figure and table numbers, page references.
9. Totals: numbers in tables and text that should add up or match.

For each problem: the forms found, where each appears, the form the style sheet or guide prefers (or the most common form if neither decides), and the fix.

Output: a table sorted by type, then a list of decisions you need from me.
```
