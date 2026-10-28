---
name: keyword-extractor
description: >
  Extracts up to 50 highly relevant SEO keywords from text. Use when user wants to generate or extract keywords for given text.
risk: safe
source: original
date_added: "2026-03-11"
---

# Keyword Extractor

Extracts **max 50 relevant keywords** from text and formats them in a strict machine-ready structure.

---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Source text** (yours): a long source in full: an article, a video or talk transcript, or notes from a book, with its title, author and link.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for source text. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## QUICK START

Jump to any section:
1. [CORE MANDATE](#core-mandate) – Output rules and formatting 
2. [WHEN TO USE](#when-to-use) – Trigger conditions for this skill 
3. [KEYWORD QUALITY RULES](#keyword-quality-rules) – Priorities and forbidden keywords 
4. [WORKFLOW](#workflow) – Step-by-step generation and processing 
5. [FAILURE HANDLING](#failure-handling) – Short text or edge cases 

---

# CORE MANDATE

Return **exactly one comma-separated line** of keywords, following these rules:
- max 50 keywords  
- ordered by relevance  
- all lowercase  
- no duplicates or near-duplicates  
- mix of single words and 2–4 word phrases  
- no numbering, bullets, explanations, or trailing period

---

## When to Use
Use this skill when the user wants to generate or extract **SEO-friendly keywords or tags** from text including:
- Extracting keywords or tags for any given text or paragraph  
- Creating **comma-separated keywords or tags** suitable for SEO, search, or metadata  
- Generating topic-specific keywords or tags based on the content’s main subjects and concepts  

This skill should be triggered for **all text-based keyword extraction requests**, regardless of phrasing, as long as the goal is SEO, tagging, or metadata generation.

Do NOT trigger this skill for:  
- Summaries or paraphrasing requests  
- Text analysis without keyword generation

---

# KEYWORD QUALITY RULES

Prefer noun phrases over verbs or adjectives.
Prefer keywords useful for:
- SEO and search
- tagging
- metadata

Prioritize:
- domain terminology
- meaningful nouns
- search phrases
- entities
- technical concepts

Avoid weak keywords like:
- things and various topics
- general concepts
- important ideas
- methods

**IMPORTANT: Each keyword must strictly represent a phrase that a user would type into a search engine**

---

# WORKFLOW

## Step 1 — Analyze

Identify:
- main subject
- key topics
- domain terminology
- entities
- concepts

Ignore filler words.

---

## Step 2 — Generate Keywords

Generate up to 50 strictly SEO-friendly keywords directly from the text.

Include:
- core topics
- domain terminology
- related concepts
- common search queries

Allowed formats:
- single words
- 2 word phrases
- 3 word phrases
- 4 word phrases

Example:
```machine learning, neural networks, deep learning models, ai algorithms, data science tools```

Avoid vague keywords, filler phrases, adjectives without nouns like:
```important methods, different ideas, various techniques, things```

Keywords must not exceed 4 words.

---

## Step 3 — Rank

Order keywords by SEO importance using these signals:
1. main topic of the text
2. high-value domain terminology
3. technologies, tools, or entities mentioned
4. common search queries related to the topic
5. supporting contextual topics

Most important keywords should always appear first.

---

## Step 4 — Normalize

Ensure:
- lowercase, comma separated, no duplicates
- ≤50 keywords
- Remove near-duplicate keywords that represent the same concept.
- Keep only the most common search phrase.
- If two keywords represent the same concept, keep only the more common search phrase.

---

## Step 5 — Validate

Before returning output ensure:
- keyword_count <= 50
- no duplicates and near-duplicates
- all lowercase and comma separated
- no trailing period
- each keyword is a clear searchable topic
- keywords do not exceed 4 words

If any rule fails regenerate the list.

---

# FAILURE HANDLING

If text is very short, infer likely topics and still generate keywords. Never exceed 50 keywords.

---

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Store keyword validator](https://useaiblocks.com/skills/store-keyword-validator). It takes the keyword list.
- The [Collection page SEO builder](https://useaiblocks.com/skills/collection-page-seo-builder). It takes the keyword list.
- The [Collection page planner](https://useaiblocks.com/skills/collection-page-planner). It takes the keyword list.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
