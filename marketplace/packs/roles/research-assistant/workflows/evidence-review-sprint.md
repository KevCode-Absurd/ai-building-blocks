# Evidence review sprint

**Trigger:** A question with a decision behind it ("Should we offer a four-day week?", "Is this ingredient claim safe to make?", "What do studies say about loyalty schemes for cafes?"). Typical length is three to ten working days, set by how many sources there are and whether web search is on. Ends with a cited answer, an evidence table and the gaps.

**Access:** Ask at the start which level the client grants for each tool (documents, notes, reference manager) and write it down as "Access I have". Until they answer, work at level 1 (read). Ask whether web search is on; if it is off, the sprint works only from what the client supplies. Log every action: what, where, when, result.

## Steps

1. **Frame (day 1).** Write the question in parts (who, what, compared with what, which outcome), the decision it feeds, inclusion rules and the deadline. *Approval: the client confirms the question and rules.*
2. **Gather (days 1 to 3).** With web search on, run the `literature-search-and-review` skill, steps 2 and 4: search, snowball, screen and keep a search log. With it off, list every supplied source and what seems to be missing. *Level 1. Level 2: add found items to a "to check" collection in the client's reference manager.*
3. **Read and record (days 2 to 6).** Use the `evidence-table` prompt for every kept source. For the most important two or three, run the `paper-summary-and-evidence-strength` skill. *Level 1.*
4. **Check references (days 3 to 6).** Run the `citation-and-reference-check` skill on every source relied on: exists, matches, not retracted. *Level 1.*
5. **Resolve disagreements (days 4 to 7).** Use the `conflicting-findings-explainer` prompt where sources clash. *Level 1.*
6. **Synthesise (days 5 to 8).** Finish the `literature-search-and-review` skill: themes, overall answer with confidence, gaps. *Level 2: save the draft review and table in the client's documents, marked "DRAFT".*
7. **Short answer (days 6 to 9).** Use the `cited-answer-from-sources` prompt for a one to two page version for decision makers. *Level 2.*
8. **Hand-off (final day).** Deliver the review, the short answer, the evidence table, the search log and the reference file. *Level 3, within agreed limits: file them in the shared knowledge base or library the client names. Approval: the client approves before anything is shared beyond the team.*

## Outputs

- Question, rules and decision sentence
- Search log or list of supplied sources
- Evidence table
- Summaries of key studies
- Literature review with themes, answer, confidence and gaps
- One to two page cited answer
- Clean reference list (and RIS or BibTeX file if wanted)
- Action log of everything done in the client's tools

## Needs the client's approval

The question and inclusion rules; anything filed or shared beyond the client's team; any conclusion touching health, law or money, which goes to a qualified professional before anyone acts on it.
