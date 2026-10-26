---
name: qdrant-search-quality
description: "Diagnoses and improves Qdrant search relevance. Use when someone reports 'search results are bad', 'wrong results', 'low precision', 'low recall', 'irrelevant matches', 'missing expected results', or asks 'how to improve search quality?', 'which embedding model?', 'should I use hybrid search?', 'should I use reranking?'. Also use when search quality degrades after quantization, model change, or data growth."
allowed-tools:
  - Read
  - Grep
  - Glob
---

# Qdrant Search Quality

First determine whether the problem is the embedding model, Qdrant configuration, or the query strategy. Most quality issues come from the model or data, not from Qdrant itself. If search quality is low, inspect how chunks are being passed to Qdrant before tuning any parameters. Splitting mid-sentence can hurt quality a lot.

- Start by testing with exact search to isolate the problem [Search API](https://search.qdrant.tech/md/documentation/search/search/?s=search-api)

## What you need

Ask once for anything not given:

- A few failing searches (3 to 10), each with the result you expected and the result you got (scores if you have them).
- The embedding model name, and how documents were split into chunks.
- Collection settings, Qdrant version and any filters in use (optional).

Open the linked file for the stage you are on. If you cannot open it, work from this file and say so.

## What you hand back

1. Your case: model, chunking, version, filters (use `MISSING` for anything not given).
2. Likely causes, ranked, each with why it fits, one test, and what each test result means.
3. Fixes in order, with what each costs.
4. Quality check: a before and after measure on the person's own failing searches, for example whether the expected result appears in the top results. Use the recall target in the diagnosis file only if a baseline exists.
5. Avoid: the "What NOT to Do" items that apply.
6. Next: the first test to run.

## If something is missing

Write `MISSING: <what>`. Never invent search results, scores or recall numbers. With no failing searches, help write a small test set of searches and expected answers before suggesting any change.


## Diagnosis and Tuning

Isolate the source of quality issues, tune HNSW parameters, and choose the right embedding model. [Diagnosis and Tuning](diagnosis/SKILL.md)


## Search Strategies

Hybrid search, reranking, relevance feedback, and exploration APIs for improving result quality. [Search Strategies](search-strategies/SKILL.md)
