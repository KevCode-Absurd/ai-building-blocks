---
name: product-demand-research
description: Use when the user wants to validate a product idea, find pain points, mine demand signals, discover objections, or gather voice-of-customer language from Reddit, social posts, video transcripts, and comments. Produces evidence-backed product research.
allowed-tools: Bash, Read, Write, WebFetch

version: 1.0.0
author: ScrapeCreators
license: MIT
homepage: https://scrapecreators.com
repository: https://github.com/ScrapeCreators/social-media-research-skills
metadata:
  openclaw:
    requires:
      env:
        - SCRAPECREATORS_API_KEY
    primaryEnv: SCRAPECREATORS_API_KEY
    homepage: https://scrapecreators.com
    tags:
      - social-media
      - research
      - scrapecreators
---

# Product Demand Research

## Overview

Use public social data to understand whether people actually complain about, ask for, buy, hack around, or recommend solutions in a product category. The output should help founders and marketers decide what to build, position, or test.

## When to Use

Use this skill when the user asks to:

- validate a startup or product idea
- find pain points in a niche
- mine Reddit/TikTok/YouTube comments for product ideas
- find buyer language and objections
- understand alternatives people use today
- create messaging from demand evidence

## Signals to Extract

- repeated complaints
- "I wish" / "is there a tool" / "how do I" phrases
- workarounds and spreadsheets/manual processes
- comparison and alternative mentions
- buying intent
- objections to existing solutions
- exact words people use for the problem

## Workflow

1. Turn the idea into search queries and synonyms.
2. Search Reddit and relevant social platforms.
3. Pull comments/transcripts for promising posts/videos.
4. Cluster pains, triggers, alternatives, and desired outcomes.
5. Score demand by frequency, intensity, recency, and willingness-to-pay hints.
6. Produce messaging and product implications.

## Output Format

```markdown
# Product Demand Research: {idea/category}

## Verdict
- Demand signal: Strong/Medium/Weak
- Confidence: High/Medium/Low
- Why:

## Pain Points
| Pain | Evidence | Exact language | Source |
|---|---|---|---|

## Existing Alternatives / Workarounds
- ...

## Objections and Barriers
- ...

## Messaging Angles
- "..."

## Product Ideas / Tests
1. ...
2. ...
```

## Verdict Rules

Use these defaults for the Demand signal, and say in the report that they are this catalogue's own cut-offs, not a standard. **Strong:** the same pain appears in at least 10 distinct posts or videos from at least 3 separate sources, with buying or switching language in at least 3 of them. **Medium:** 5 to 9 distinct posts, or only 2 sources. **Weak:** fewer than 5 posts or a single source. Count each post once, even if it is quoted again. Set Confidence to Low whenever the posts are older than 12 months or come from one source.

## Platform Terms and Limits

This skill collects public posts and comments through a paid third-party API. Each platform (Reddit, TikTok, YouTube) has its own terms of service and rate limits. Tell the user to check them first, collect only what those terms allow, stay inside the rate limits, and never store personal details about the people who wrote the posts.

## Common Pitfalls

- Do not claim market validation from a handful of comments.
- Do not ignore negative evidence or existing alternatives.
- Do not paraphrase away the best customer language.
