---
name: social-listening-brief
description: Use when the user wants a social listening report about what people are saying about a brand, person, product, topic, category, or niche across public social platforms. Produces cited themes, sentiment caveats, notable posts, and recommended actions.
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

# Social Listening Brief

## Overview

Research what people are saying publicly across social platforms. This is useful for brand monitoring, category research, product feedback, reputation checks, and understanding recent conversations.

## Before you start

- This skill needs a ScrapeCreators API key set as `SCRAPECREATORS_API_KEY`. ScrapeCreators is a paid service and every search is billed. Ask the user to set a spending cap before the first run. If the key is missing, stop and ask for it.
- It scrapes public posts. Platform terms may forbid that. Ask the user to confirm they have checked them.
- Only search for what the user asked about. Never invent posts, quotes, counts or links.

## When not to use

- Real-time monitoring or alerts: use a paid social listening tool.
- Private groups, closed accounts or direct messages: this cannot reach them. Ask the group owner or run a survey.
- A hard count of opinions: run a customer survey, because this brief is a sample.

## When to Use

Use this skill when the user asks:

- what are people saying about X?
- monitor this brand/topic/category
- find complaints or praise about a product
- summarize recent social discussion
- compare sentiment across Reddit, TikTok, YouTube, LinkedIn, Instagram, or Threads

## Useful Sources

- Reddit search, subreddit search, posts, comments
- TikTok search top/keyword/hashtag and comments
- YouTube search, transcripts, comments
- Instagram reels search and hashtag search
- LinkedIn post search
- Threads search
- Google search when platform search is not enough

## Workflow

1. Define topic, aliases, competitor names, and date window.
2. Search two or three relevant sources, not every source blindly. Pick by topic: for consumer products and lifestyle, start with Reddit, TikTok and Instagram; for B2B software, services and work topics, start with Reddit, LinkedIn and YouTube; for short breaking talk, add Threads; for how-to and reviews, add YouTube comments. Add Google search only when platform search returns little. Say which sources you chose and why.
3. Keep URLs, dates, platform, engagement metrics, and exact quotes.
4. Cluster conversations into themes.
5. Separate positive, negative, neutral, and mixed signals.
6. Highlight representative examples and action items.

## Output Format

```markdown
# Social Listening Brief: {topic}

## Executive Summary
- Main takeaway:
- Conversation volume: Low/Medium/High
- Sentiment: Positive/Neutral/Negative/Mixed
- Confidence: High/Medium/Low

## Top Themes
| Theme | Sentiment | Evidence | Representative quote/source |
|---|---|---|---|

## Notable Posts
- [source](url) — why it matters

## Risks / Opportunities
- ...

## Recommended Actions
1. ...
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Social video transcript analyst](https://useaiblocks.com/skills/social-video-transcript-analyst). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Common Pitfalls

- Scraping public posts may break a platform's terms. Check them before you run it.
- Do not name private people in a brief you share. Anonymise usernames, or quote the text without the name.
- The ScrapeCreators key is a paid service. Set a spending cap before the first run.

- Do not pretend this is exhaustive social monitoring. It is public-data research.
- Do not average sentiment across very different communities without caveats.
- Do not use engagement as a proxy for truth.
