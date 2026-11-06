---
name: claim-and-source-check
description: Fact-checks a draft (article, deck, investor one-pager, about page, report) claim by claim. Lists every checkable claim, finds the passage that backs it in the supplied sources or, when web search is on, in sources found and opened live, and gives each a status (supported, partly supported, not found, contradicted) with a short quote and location. Traces claims upstream to the original, rates each source, checks numbers for consistency, rewrites over-strong claims, and ends with fix now, cannot verify and safe to publish. Use before publishing or deciding on anything that states facts, numbers, rankings or quotes.
---

# Claim and source check

## When to use

- A draft is about to be published, sent to investors or customers, or used for a decision, and it states facts, numbers, rankings, "first" or "only" claims, quotes or cause and effect.
- Someone hands over a claim with no source ("studies show...") and wants to know if it holds.
- A document and its sources may have drifted apart after several edits.

Not for legal, medical or financial verification: when a claim is about health, law, money or a named person's conduct, I report what the sources say and the client asks a qualified professional before publishing.

## What you need

1. The draft (text, file or link).
2. The sources behind it, if any: reports, papers, data, links, interview notes.
3. Whether web search is on. If it is off, I check only against what is supplied.
4. The reader and the stakes: a social post, a press release, an investor deck, a regulated product page.

Access: level 1 (read) to read the draft and sources and return the check. Level 2 to leave comments and suggested edits in the client's document. Level 3, within the limits the client sets (which documents, which kinds of fix), to accept the agreed fixes in the live document; a correction that names a person or company as wrong needs a fresh yes every time. I log every action.

## Steps

### 1. Extract the claims

Read the whole draft once. Then list every checkable claim in a numbered table: numbers and percentages, dates, names and titles, rankings and superlatives, quotes, cause-and-effect statements, and claims about what a study or law says. Opinions and forecasts are labelled as such and not checked. Split compound sentences: "Founded in 1998, we are now the UK's largest" is two claims.

### 2. Find each claim's source

- **Supplied mode:** search the supplied material for the passage that supports the claim. Note document, page, section, table or timestamp.
- **Live mode (web search on):** run SIFT. Stop and ask whether the source is known. Investigate who is behind it. Find better coverage of the claim. Trace it to the original context. Read the original, not a summary of it. Record the URL and the date opened.
- For pages that may have changed, look for an archived capture and cite the version used. Captures are not complete and new ones take hours to appear.

### 3. Give each claim a status

| Status | Meaning |
|---|---|
| Supported | The source says this, in this scope and time frame |
| Partly supported | The source says something narrower, older, smaller or with a different population |
| Not found | No passage in the sources checked says this. In supplied mode: "not found in what you supplied" |
| Contradicted | A source says something different; give both figures |

Quote the passage briefly (a phrase or one sentence) and give its location.

### 4. Check numbers across the document

Same figure everywhere? Same units, currency and year? Percentages that should add to 100 do? Relative changes have their baseline? A fall from 4% to 3% is a 25% relative drop but 1 point absolute; say both.

### 5. Rate the sources

For each source: how recent, how direct (original data, or someone's summary), who made it and why, and whether it has a retraction or correction notice if it is a journal article. Note sponsors and conflicts of interest.

### 6. Rewrite what is too strong

For each partly supported or over-strong claim, write a version the sources can carry. Match the verb to the evidence: "causes" only with a trial or equivalent; otherwise "is linked to". "Proves" almost never.

### 7. Sort the results

End with three lists: **Fix now** (contradicted, or partly supported in a way that misleads), **Cannot verify** (not found; remove, soften or find a source), and **Safe to publish**.

## Checks

- Every claim in the draft is in the table; none skipped because it "sounds right".
- Every status has a location; every web source has a URL and access date.
- No claim was marked supported from a summary when the original was available.
- AI-generated references were opened in a database, not trusted.
- Numbers are consistent across the document.
- Rewrites stay within what the sources say.
- Nothing gives a legal, medical or financial verdict; those claims are flagged for a qualified professional.

## Output format

1. One-paragraph summary: how many claims, how many in each status, the biggest risk.
2. Claim table: number, claim, status, source and location, short quote, note.
3. Suggested rewrites.
4. Source ratings.
5. Fix now / Cannot verify / Safe to publish.
6. Method note: supplied or live, what was searched, when.

## Example of good output

Made-up business for illustration: Fernhill Water Filters, a one-page investor summary checked against three supplied reports.

> **Summary.** 14 claims checked against the three reports you supplied (web search off). 8 supported, 3 partly supported, 2 not found, 1 contradicted. Biggest risk: claim 6 doubles the market growth rate.
>
> | # | Claim | Status | Source | Note |
> |---|---|---|---|---|
> | 4 | "Used by 1,200 households" | Supported | Ops report, p. 3, table 1 | "1,214 active subscriptions" at 30 Sept 2026 |
> | 6 | "Market growing 12% a year" | Contradicted | Sector report, p. 9 | Report gives 6% a year, 2024 to 2026 |
> | 9 | "Removes 99% of microplastics" | Partly supported | Lab note, p. 2 | Lab tested one particle size, one filter; say "in one lab test of particles above 20 microns" |
> | 12 | "The UK's first refillable filter" | Not found | none | Remove, or supply proof |
>
> **Fix now:** 6, 9. **Cannot verify:** 12, 13. **Safe:** the rest.
