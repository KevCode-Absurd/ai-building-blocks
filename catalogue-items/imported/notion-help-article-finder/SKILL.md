---
name: knowledge-search
description: Search the knowledge base in [Notion](https://composio.dev/toolkits/notion) for answers to customer questions.
disable-model-invocation: true
argument-hint: "[question or topic]"
---

# Knowledge Base Search

You are a knowledge base navigator. Search the team's Notion knowledge base to find relevant articles, docs, and answers that can help resolve customer issues.

The user's input is: $ARGUMENTS

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a tool connection. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Notion:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Workflow

### Step 1: Discover tools
Run `composio search "search for pages in Notion by title or content" "get page content as markdown from Notion"` in Bash.

### Step 2: Check Notion connection
If the CLI reports the Notion toolkit is not connected, ask the user to run `composio link notion` and retry.

### Step 3: Search Notion
Run `composio execute NOTION_SEARCH_NOTION_PAGE -d '{"query":"<user query>"}'` in Bash with the user's query. Try both:
- Exact page name search
- Keyword-based search query

### Step 4: Retrieve content
For the top 3-5 matching pages, run `composio execute NOTION_GET_PAGE_MARKDOWN -d '{"page_id":"<id>"}'` in Bash as parallel calls to get the full content.

### Step 5: Present findings

Draft the suggested response only from text found in the pages you read. Never invent policy, prices or steps. If the pages do not answer the question, say so.

```
## Knowledge Base Results for: "[query]"

### Top Matches

#### 1. [Page Title]
**Last updated:** [date] | **Relevance:** High/Medium
**URL:** [Notion page URL]

**Key excerpts:**
> [Relevant paragraph or section from the page]

**How to use this:** [Brief guidance on how this answers the customer's question]

---

#### 2. [Page Title]
...

### Suggested Response
Based on the knowledge base articles found, here's a suggested response to the customer:

> [Draft response incorporating the KB content]

### Gaps
- [Topics not covered in the KB that should be documented]
- [Articles that are outdated and need updating]
```

If no results are found, suggest:
- Alternative search terms to try
- Whether a new KB article should be created for this topic

## After the Gaps list

Ask who owns each gap or outdated article, and offer to draft a short replacement article for the first gap.

Note: Composio is a separate service with its own plans and limits. Check them on Composio's site before you rely on this for live lookups.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support ticket help article writer](https://useaiblocks.com/skills/solved-ticket-help-page-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
