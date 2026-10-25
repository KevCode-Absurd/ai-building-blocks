# Agent Knowledge Loading Guide

**How to load the Course 3 library into your own agent stack so your agents know what you know.**

This guide is for operators building their own AI agents. If you are using the Your Agency platform directly, skip this — the knowledge is already loaded.

---

## The two ways agents use knowledge

There are two patterns. Know which one you need before you start.

### Pattern 1 — Knowledge baked into the prompt

Put the relevant framework directly into the system prompt of the agent. Used when the knowledge is small (under ~2,000 tokens) and needed on every single call.

**Example:** Loading the TEEP framework into a buyer psychology agent. Always needed, always same content.

### Pattern 2 — Knowledge retrieved on demand (RAG)

Store the knowledge in a vector database or document store. Retrieve the most relevant chunks at query time. Used when the knowledge is large and varies per query.

**Example:** The 60-hook library. Too large to paste into every prompt. Retrieved based on which tactic / stage is relevant.

---

## Decision matrix — which pattern for which file?

| File | Tokens (est.) | Pattern | Why |
|---|---|---|---|
| `teep-framework-card.md` | ~1,500 | Baked in | Always relevant; small |
| `awareness-stage-copy-matrix.md` | ~2,500 | Baked in | Used on every copy task |
| `hook-library-60.md` | ~6,000 | RAG | Too large; retrieve by tactic |
| `50-copy-examples.md` | ~5,000 | RAG | Retrieve by framework / stage |
| `brand-dna-extraction-template.md` | ~1,800 | Baked in (per client) | Always relevant to that client |
| `5-photography-styles-reference.md` | ~2,000 | Baked in | Small, always useful |
| `theme-library-catalog.md` | ~3,000 | RAG or baked (borderline) | Depends on stack |
| `persona-stage-theme-matrix.md` | ~2,200 | Baked in | Reference chart |
| `ugc-script-templates.md` | ~4,000 | RAG | Retrieve template by format |
| `budget-allocation-scorecard.md` | ~1,500 | Baked in | Small scoring logic |
| `ab-test-design-worksheet.md` | ~2,500 | Baked in | Always applied |
| `monthly-report-template.md` | ~2,800 | Baked in | Always applied |
| `closer-playbook.md` | ~4,000 | RAG | Retrieve by objection type |
| `competitor-tracker-template.md` | ~1,500 | Baked in | Always used for competitor work |

Rule of thumb: under 2,500 tokens and always relevant → bake in. Over that, or variable relevance → RAG.

---

## Pattern 1 setup — baking into the system prompt

### Structure

```
[AGENT IDENTITY]
You are [AGENT NAME], the [ROLE] in the Your Agency stack.

[AGENT GOAL]
Your goal is to [ONE SENTENCE].

[KNOWLEDGE — THIS IS WHERE YOU PASTE]
### TEEP Framework
[paste teep-framework-card.md content]

### Awareness Stage Copy Matrix
[paste awareness-stage-copy-matrix.md content]

[TASK INSTRUCTIONS]
When the user asks you to [TASK], follow these steps:
1. [STEP]
2. [STEP]

[OUTPUT FORMAT]
Respond in the following format:
[FORMAT]

[GUARDRAILS]
- Never [X]
- Always [Y]
```

### Token budget

- System prompt: aim for under 8,000 tokens total.
- Leave 2,000 tokens for the user query + conversation history.
- If your knowledge is pushing the prompt over budget, move some of it to RAG.

### Tips

1. **Use markdown headings inside the prompt.** LLMs parse `## Section` better than `---- Section ----`.
2. **Don't paste the full markdown file verbatim.** Strip comments, remove "how to use this" sections that are for humans. Keep only the actual knowledge.
3. **Put the most critical knowledge last.** LLMs over-weight the end of the system prompt.

---

## Pattern 2 setup — RAG

### Step 1 — Chunk the knowledge

Split each markdown file into semantic chunks. Good chunk size: 400-800 tokens.

For the hook library, each chunk = one hook (hook text, tactic, stage, example).
For the copy examples, each chunk = one complete example.
For the closer playbook, each chunk = one objection or one call section.

### Step 2 — Embed the chunks

Use any embedding model. OpenAI's `text-embedding-3-small` is cheap and fine for this scale. Gemini and Cohere also work.

### Step 3 — Store

Any vector store works:
- Pinecone (managed, easy)
- pgvector on Postgres (if you're already on Supabase/Postgres)
- Weaviate (open source)
- Qdrant (open source, fast)

Store with metadata: `source_file`, `framework`, `stage`, `tactic` — whatever is useful for filtering.

### Step 4 — Retrieve at query time

```
User query → embed → top-k retrieve (k=3-5) → inject into prompt → LLM call
```

Simple template:

```
[SYSTEM PROMPT — core identity + small always-loaded knowledge]

RELEVANT KNOWLEDGE FROM LIBRARY:
[retrieved chunk 1]
[retrieved chunk 2]
[retrieved chunk 3]

USER QUERY:
[user message]
```

### Step 5 — Tune retrieval

- If the LLM cites wrong information, inspect which chunks were retrieved.
- Improve embeddings by enriching the chunk text with the framework name + tags.
- Use hybrid search (vector + keyword) for precise framework lookups.

---

## Pattern 3 (advanced) — Tool-based knowledge access

Give the agent a tool called `query_knowledge_library(query: string, filter: string)`. The agent calls the tool when it needs information. The tool returns relevant chunks.

Advantages:
- The agent explicitly decides when it needs knowledge (better reasoning transparency).
- You can log what was queried for each task (great for debugging).
- You can version the library without breaking agent prompts.

Frameworks that support this pattern: Anthropic tool use, OpenAI function calling, LangChain tools, Claude Agent SDK.

Recommended for production agent systems. Overkill for a single-operator setup.

---

## Loading knowledge per-client (multi-tenant pattern)

If you run the same agent for multiple clients, some knowledge is global and some is per-client.

| Knowledge type | Scope | Example |
|---|---|---|
| Framework knowledge | Global | TEEP, awareness stages, themes |
| Brand DNA | Per-client | Lumen Wellness brand DNA doc |
| Psychology brief | Per-client | Lumen Wellness's TEEP-filled brief |
| Competitor tracker | Per-client | Lumen Wellness's competitor sheet |
| Historical performance | Per-client | Lumen Wellness's last 90 days |

Pattern:

```
[SYSTEM PROMPT]
[GLOBAL KNOWLEDGE — always loaded]

CURRENT CLIENT: [CLIENT NAME]
### Client Brand DNA
[per-client brand DNA here]

### Client Psychology Brief
[per-client psychology brief here]

### Client Recent Performance
[per-client performance snapshot here]

[TASK INSTRUCTIONS]
```

Store per-client knowledge keyed by `client_id`. Load dynamically at the start of each session.

---

## Refresh and versioning

### When to refresh

- Framework knowledge: when you update the underlying framework (rarely).
- Brand DNA: monthly, or when the client runs a packaging / positioning refresh.
- Psychology brief: quarterly.
- Competitor tracker: weekly ingestion, monthly re-classification.
- Performance snapshot: daily or on-demand.

### Versioning the library

Store each file with:
- `version: vX.Y.Z`
- `updated_at: timestamp`
- `changelog: [array of changes]`

When the agent loads knowledge, log which version it loaded. If outputs degrade after a library update, you can roll back.

---

## Evaluating whether the knowledge is working

Signs it is working:
- The agent cites specific frameworks by name in its reasoning.
- Output quality is consistent across similar tasks.
- The agent applies stage-appropriate advice (e.g., it knows not to use Bold Claim on Unaware audiences).

Signs it is NOT working:
- Agent gives generic advice that doesn't reference any framework.
- Agent cites wrong framework (e.g., calls a PAS copy piece "Us vs Them").
- Agent ignores the stage or persona you specified.

If you see the failure signs:
1. Check whether the knowledge is actually being loaded (print the final prompt).
2. Check whether retrieval is returning relevant chunks.
3. Check the prompt structure — is the knowledge before or after the task instructions?

---

## Common mistakes

1. **Pasting the whole markdown file including the "how to use this" sections.** Strip the operator instructions; keep only the framework content.
2. **Loading knowledge the agent doesn't need.** Bigger prompts are not always better.
3. **Not telling the agent to USE the knowledge.** Include in task instructions: "Before responding, identify which framework applies and cite it."
4. **Loading conflicting knowledge.** If you bake in two frameworks that contradict (e.g., two different A/B test structures), the agent picks randomly.
5. **Forgetting to strip markdown artifacts.** Triple backticks inside the system prompt can confuse some models.
6. **Treating RAG as magic.** If retrieval returns irrelevant chunks, the agent can't save you. Chunk well, embed well, retrieve well.

---

## Minimum viable agent using this library

Want to ship your first agent fast? Here's the minimum:

**Agent: Copy Strategist**
**Knowledge loaded (baked in):**
- `awareness-stage-copy-matrix.md`
- `theme-library-catalog.md`
- Client's brand DNA (per-client)

**System prompt template:**

```
You are the Copy Strategist. Your job: take a product + persona + stage, and output 3 copy directions that match the right theme and framework for that stage.

[PASTE awareness-stage-copy-matrix.md]

[PASTE theme-library-catalog.md]

CURRENT CLIENT: [NAME]
[PASTE CLIENT BRAND DNA]

When the user gives you a product + persona + stage, follow these steps:
1. Identify the stage.
2. Identify 2-3 themes that fit the stage.
3. For each theme, write a 60-word ad copy example following the theme's copy spine and the client's voice DNA.
4. Output as 3 labeled directions.

VOICE:
- Use the client's voice DNA exactly.
- No em dashes.
- No agency jargon.
```

Load this into Claude, GPT-4, or Gemini. You have an agent.

From here, you expand: add more knowledge, add more agents, wire them together.

---

## Where to go from here

- If you want to build the full Sage pipeline (image generation + QA), see `05-Operations-and-Growth/49-Brand-DNA-Plus-Image-Pipeline/image-generation-architecture.md`.
- If you want to build a competitor scraping pipeline, see `04-Psychology-and-Strategy/46-Competitive-Intelligence-Build/competitor-research-architecture.md`.
- If you want to understand the full Your Agency architecture, see `docs/SYSTEM_GUIDE.md` in the Your Agency repo.

The library is a starting point. The real system is the one you build on top of it.
