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

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A plan** with the [Qdrant embedding migration planner](https://useaiblocks.com/skills/copilot-qdrant-model-migration). Bring your question, a codebase (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase, a plan. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude or ChatGPT with web access:** They can open the linked Qdrant docs for exact search settings.
- **A short test set in a spreadsheet:** A list of searches with the right answers lets you measure each fix.
<!-- /needs -->

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

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Qdrant health monitoring planner](https://useaiblocks.com/skills/copilot-qdrant-monitoring). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If something is missing

Write `MISSING: <what>`. Never invent search results, scores or recall numbers. With no failing searches, help write a small test set of searches and expected answers before suggesting any change.


## Diagnosis and Tuning

Isolate the source of quality issues, tune HNSW parameters, and choose the right embedding model. [Diagnosis and Tuning](diagnosis/SKILL.md)


## Search Strategies

Hybrid search, reranking, relevance feedback, and exploration APIs for improving result quality. [Search Strategies](search-strategies/SKILL.md)
