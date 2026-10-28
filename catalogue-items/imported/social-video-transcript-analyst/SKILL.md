---
name: transcript-intelligence
description: Use when the user wants to summarize, analyze, or repurpose transcripts from TikTok, Instagram, YouTube, Facebook, X/Twitter, LinkedIn, Rumble, or Reddit video posts. Extracts hooks, claims, quotes, content atoms, themes, and reusable scripts.
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

# Transcript Intelligence

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A video link** (yours): the link to the video, playlist, channel or post.

**Makes it better (optional):**
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a video link, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

Turn public video transcripts into useful research and content assets. This skill is for extracting signal from spoken social video: hooks, claims, stories, objections, examples, CTAs, and reusable content angles.

## When to Use

Use this skill when the user asks to:

- summarize a video, reel, short, TikTok, podcast clip, or social video
- analyze a creator's hooks or speaking style
- extract quotes, claims, examples, and CTAs from transcripts
- turn transcripts into social posts, scripts, newsletters, or content ideas
- compare what multiple creators say about a topic

## Transcript Sources

| Platform | Endpoint |
|---|---|
| TikTok | `/v1/tiktok/video/transcript` |
| Instagram | `/v2/instagram/media/transcript` |
| YouTube | `/v1/youtube/video/transcript`, `/v1/youtube/video` |
| Facebook | `/v1/facebook/post/transcript` |
| X/Twitter | `/v1/twitter/tweet/transcript` |
| LinkedIn | `/v1/linkedin/post/transcript` |
| Rumble | `/v1/rumble/video/transcript` |
| Reddit video | `/v1/reddit/post/transcript` |

If a detail endpoint already includes transcript text, use it. If transcript is unavailable, say so and fall back to title/caption/description only.

## Workflow

1. **Collect URLs or discover videos**
   - If URLs are provided, fetch each transcript directly.
   - If you have a social listening brief from an earlier step, take the video links from its notable posts.
   - If a creator/channel is provided, first fetch recent posts/videos, then choose relevant videos.

2. **Extract transcript text**
   - Preserve timestamps if provided.
   - Keep source URL with each transcript.
   - Do not hallucinate missing captions.

3. **Segment the transcript**
   Break into:
   - hook/opening
   - setup/context
   - main claim or lesson
   - evidence/examples
   - payoff
   - CTA

4. **Analyze the content**
   Extract:
   - exact hooks
   - claims and contrarian takes
   - stories
   - frameworks
   - objections addressed
   - emotional language
   - quotable lines
   - content atoms that stand alone

5. **Synthesize across multiple transcripts**
   - Cluster by topic and angle.
   - Count recurring themes.
   - Identify repeated hook formulas.
   - Flag the strongest examples with citations.

## Output Format

```markdown
# Transcript Intelligence Report

## TL;DR
- Main themes:
- Strongest hooks:
- Best reusable ideas:

## Transcript-by-Transcript Notes
### [Video title or URL](url)
- Hook: "..."
- Core idea: ...
- Best quote: "..."
- CTA: ...
- Content atoms:
  1. ...

## Patterns Across the Set
| Pattern | Evidence | Example URLs |
|---|---|---|

## Hooks Swipe File
- "..."
- "..."

## Repurposing Ideas
- LinkedIn post:
- X thread:
- Short-form script:
- Newsletter section:
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Source note summariser](https://useaiblocks.com/prompts/source-note-summariser). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Common Pitfalls

- Do not summarize from the title alone if the user asked for transcript analysis. Fetch transcripts first.
- Do not lose exact wording. Hooks and quotes are more valuable verbatim.
- Do not treat AI-generated transcript text as perfect. If wording seems garbled, mark it as approximate.
- Do not mix source attribution. Every quote should trace back to a URL.
