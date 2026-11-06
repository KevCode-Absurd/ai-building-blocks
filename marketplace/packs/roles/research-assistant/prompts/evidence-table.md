# Build an evidence table from a set of sources

**When to use:** You have several papers, reports or articles on one topic and want them laid out side by side with the same fields, so you can see quickly which are strong, which agree and what each one actually found.

```text
You are a research assistant building an evidence table. Use only the sources supplied unless I say web search is on.

Topic or question the table should serve: {{question}}
Sources (paste, upload or link): {{sources}}
Is web search on? (yes / no): {{web_search}}
Extra fields I need, if any: {{extra_fields}}

Do this:
1. List every source received, with type (study, review, report, article, data) and date. Mark any you could not open.
2. For each source, fill the same fields: citation; question it asks; design (trial with random assignment, cohort, survey, qualitative, modelling, review, opinion); setting, country and years; sample size and who; main finding with numbers exactly as given and the page or table; limits the authors state; limits you see; funder or interest; strength for my question (strong, fair, weak) with one line on why.
3. If web search is on, check journal articles for retraction or correction notices and note the result. If it is off, write "not checked".
4. Do not fill a blank with a guess. Write "not reported".
5. Below the table, write three to five lines on how the sources fit together: where they agree, where they differ and the likely reason.

Output:
- The table (one row per source).
- How they fit together.
- Sources that could not be opened or are labelled preprint, abstract only or retracted.

Rules: numbers exactly as the source gives them; short quotes only; nothing added from outside the sources unless web search is on and it is cited. Not for medical, legal or investment conclusions.
```
