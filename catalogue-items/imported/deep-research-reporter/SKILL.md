---
name: deep-research
description: Conduct in-depth, multi-step research on a given topic by decomposing queries, finding diverse sources, cross-referencing findings, and synthesizing a comprehensive report. Use when the user requests deep research or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: awesome-ai-agent-skills
  version: 1.0.0
---

# Deep Research

This skill enables an AI agent to perform rigorous, multi-step research on complex topics. Rather than returning a single search result, the agent decomposes the research question into sub-queries, gathers information from diverse source types (academic papers, industry reports, official documentation, news articles, and expert commentary), cross-references findings for consistency, and synthesizes everything into a structured, citation-backed report. The result is a thorough analysis that surfaces nuance, identifies conflicting viewpoints, and highlights knowledge gaps.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude, ChatGPT or Gemini with web search on:** It needs live search to find and open real sources.
- **A built-in deep research mode, if your AI has one:** It can run longer and read more sources. Still open the links yourself.
<!-- /needs -->

## What to ask for first

1. The research topic or question (required).
2. Focus areas, depth, length and preferred source types (optional; if missing, choose sensible defaults and say what you chose).
3. Whether you have live web access. If you do not, say so at the top of the report. Then write only from what you already know, label every claim "unchecked, from memory", and give no citation you cannot open. Never make up a source, link, date, author or figure.

## Workflow

1. **Decompose the Research Query:** Break the user's high-level question into 3-6 targeted sub-queries that cover distinct facets of the topic. Each sub-query should address a specific angle such as historical context, current state, key players, technical details, or future outlook. This ensures broad coverage rather than shallow retrieval from a single search.

2. **Identify and Gather Sources:** Open each page you plan to cite. If you cannot open it and confirm it says what you claim, drop it. For each sub-query, search across multiple source categories: academic databases, official documentation, reputable news outlets, industry analyst reports, and community forums. Aim for at least 2-3 sources per sub-query. Record the URL, publication date, author, and a relevance score for each source to enable later prioritization. If a detail such as the date or author is not on the page, write "not stated".

3. **Extract and Organize Key Findings:** Read each source and extract the core claims, data points, statistics, and expert opinions. Organize findings into a structured outline grouped by theme or sub-query. Tag each finding with its source for traceability.

4. **Cross-Reference and Validate:** Compare findings across sources to identify consensus, contradictions, and gaps. Flag any claims that appear in only one source or that conflict with the majority of evidence. Note the recency and authority of each source when resolving disagreements.

5. **Synthesize the Report:** Combine validated findings into a coherent narrative. Structure the report with an executive summary, detailed sections for each theme, a discussion of limitations and open questions, and a full reference list. Use clear headings and bullet points for readability.

6. **Review and Refine:** Re-read the report for logical flow, unsupported claims, and missing context. Remove any claim that has no source you opened. Verify that all citations are accurate and that the executive summary faithfully reflects the detailed findings. Offer the user suggestions for further research if gaps remain.

## Output

Return the report in this order:

- **Sub-question plan**: the three to six sub-questions.
- **Executive summary**: the main findings in one short section.
- **Sections by theme**: findings with each claim tagged to its source.
- **Conflicts, gaps and limits**: disputed claims, single-source claims, what you could not find, and the date you researched.
- **Source list**: link, author, date and use for each source.
- **Next step**: two or three follow-up questions, and a reminder to open the key links before acting on the report.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Research evidence report writer](https://useaiblocks.com/skills/cited-research-assistant).
- The [Unsupported claim spotter](https://useaiblocks.com/skills/unsupported-claim-spotter). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Usage

Provide the agent with a research topic and, optionally, specific sub-questions, desired depth level, or preferred source types. The agent will follow the full workflow and return a structured report.

```
Research the current state of WebAssembly adoption in 2025.

Focus areas:
- Browser and server-side runtime support
- Major companies and projects using WebAssembly in production
- Performance benchmarks compared to native code
- Toolchain maturity (languages, compilers, debugging)
- Key limitations and open challenges
```

## Examples

These examples show the shape of the work only. The names and numbers in angle brackets are placeholders. Never copy them into a real report. Every real figure and source must come from a page you opened.

### Example 1: A technology briefing

**User Request:**
> Conduct deep research on the state of <technology> this year: adoption, tools, performance and outlook.

**Query Decomposition:**
| Sub-Query | Angle |
|---|---|
| "<technology> browser and platform support" | Support |
| "<technology> production use by companies" | Adoption |
| "<technology> performance compared with the usual alternative" | Performance data |
| "<technology> tools and languages" | Tool maturity |
| "<technology> limits and open problems" | Open challenges |

**Report shape:**
> **Executive Summary:** <two to four sentences covering the main findings, each tied to a source below>
>
> **Disputed:** <a claim where two sources disagree, with both sides and their evidence>
>
> **Single source only:** <a claim that only one source supports>

### Example 2: Competitive scan before a launch

**User Request:**
> Research the competitive landscape for <product type> ahead of our launch.

**Query Decomposition:**
| Sub-Query | Angle |
|---|---|
| "<product type> market overview" | Market landscape |
| "<competitor> features and pricing" | Competitor deep-dive |
| "<product type> customer reviews and satisfaction" | User sentiment |
| "<product type> complaints and gaps" | Weaknesses and gaps |

**Report shape:**
> **Market Overview:** <the tiers or groups of competitors found, each with a source>
>
> **Gap Identified:** <a need no competitor meets, with the sources that suggest it, marked as an opinion if it is your reading>

## Best Practices

- **Diversify source types.** Never rely on a single category of source. Mix primary sources (official docs, data sets) with secondary analysis (blog posts, analyst reports) to get a balanced view.
- **Record provenance for every claim.** Attach the source URL, author, and date to each extracted finding so the final report can be audited and citations verified.
- **Prefer recent sources but include seminal works.** Prioritize sources published within the last 1-2 years, but include foundational papers or documents that define the field.
- **Quantify when possible.** Replace vague claims like "widely adopted" with specific numbers from a source, such as "used by <number> of surveyed teams (<source>)", to make the report more actionable. Never write a number you did not read in a source.
- **Surface disagreements explicitly.** When sources conflict, present both sides with their evidence rather than silently choosing one. This builds trust and lets the reader decide.
- **Set a scope boundary early.** Clearly define what is in-scope and out-of-scope for the research to avoid unbounded rabbit holes and keep the report focused.

## Edge Cases

- **Rapidly evolving topics:** If the research subject changes weekly (e.g., active policy debates, breaking security vulnerabilities), note the knowledge cutoff date prominently and recommend the user verify findings before acting on them.
- **Limited or paywalled sources:** When key sources are behind paywalls or restricted access, note the gap, cite the abstract or summary where available, and suggest the user obtain full access for verification.
- **Contradictory high-authority sources:** If two equally credible sources directly contradict each other, present both claims side by side, describe the methodology of each, and label the finding as "disputed" rather than forcing a verdict.
- **Emerging topics with sparse literature:** For very new technologies or concepts, acknowledge the limited evidence base, lean on primary sources (release notes, RFCs, official announcements), and clearly separate established facts from speculation.
- **Multilingual or region-specific research:** When the topic spans geographies, note which regions the sources cover and flag if findings may not generalize globally.
