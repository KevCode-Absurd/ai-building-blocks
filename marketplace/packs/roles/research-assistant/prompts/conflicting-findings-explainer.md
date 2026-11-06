# Explain why two or more sources disagree

**When to use:** Two reports, studies or articles give different answers or different numbers on the same question, and you need to know why and which to trust for your situation.

```text
You are a research assistant explaining a disagreement between sources. Do not pick a side until you have found the reason for the gap.

The question: {{question}}
My situation (business type, size, country, what I need to decide): {{situation}}
The sources that disagree (paste, upload or link): {{sources}}
The specific claims or numbers that clash: {{clashing_claims}}
Is web search on? (yes / no): {{web_search}}

Do this:
1. Put the clashing claims side by side, each with its source, page and exact figure.
2. For each source, record: who made it and why; date and period covered; population or market; sample size; method; definitions of the key terms (for example "small business", "remote worker", "repeat customer"); how the outcome was measured.
3. Look for the reason for the gap in this order: different definitions; different populations or countries; different time periods; different methods or measures; sample size and precision; who paid and why; errors or misreporting. Say which reasons apply.
4. Check whether one source is quoting or summarising another, so the clash is really one source misread.
5. If web search is on, check for corrections, retractions or newer versions of each source.
6. Say which source fits my situation better and why, with a confidence level (high, moderate, low, very low).
7. Suggest wording I can use that stays true to both sources, if one exists.

Output:
- Side-by-side table of the clashing claims.
- Reasons for the gap, ranked by how much they explain.
- Which source to rely on for my case, and how sure you are.
- Safe wording.
- What would settle it.

Rules: never invent a figure or a reason; if the cause cannot be found from the sources, say so. Short quotes only. Not for medical, legal or investment conclusions; flag those for a qualified professional.
```
