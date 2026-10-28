---
name: creator-profile-teardown
description: Use when the user wants to analyze a creator, influencer, founder, or brand social account and understand positioning, content pillars, outlier posts, hooks, format choices, audience reaction, and what can be copied or tested.
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

# Creator Profile Teardown

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

Create a practical teardown of a creator or brand account. Explain what the account is about, why the content appears to work, what patterns repeat, and what the user should copy, adapt, or avoid.

## When to Use

Use this skill when the user asks to:

- analyze a creator or brand profile
- explain why an account is growing or performing
- create a swipe file from one creator
- identify content pillars, hooks, CTAs, and formats
- learn what to copy from a competitor or creator

## Workflow

1. Pull profile metadata and public links.
2. Pull recent posts and identify outliers.
3. Fetch transcripts/comments for the best examples if needed.
4. Identify positioning, promise, niche, audience, and recurring topics.
5. Extract hooks, formats, series, CTAs, and visual patterns.
6. Summarize lessons and recommended tests.

## Output Format

```markdown
# Creator Profile Teardown: {creator}

## Positioning
- Who they serve:
- Promise:
- Personality/voice:

## Content Pillars
| Pillar | Evidence | Example posts |
|---|---|---|

## Outlier Posts
| Post | Metric | Lift/why it matters | Pattern |
|---|---:|---|---|

## Hooks and Formats to Steal
- ...

## What Not to Copy
- ...

## Tests for Us
1. ...
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Ad library teardown writer](https://useaiblocks.com/skills/ad-library-teardown-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Common Pitfalls

- Do not reduce the teardown to a profile summary. Find repeatable mechanics.
- Do not copy personal details or private information.
- Do not assume causation from performance. Say what the evidence suggests.
