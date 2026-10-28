---
name: ad-library-teardown
description: Use when the user wants to analyze active ads from Meta/Facebook, Google, or LinkedIn ad libraries; tear down a competitor's messaging; extract hooks, offers, CTAs, video transcripts, landing page claims, and test ideas from public ads.
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

# Ad Library Teardown

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Competitors** (yours): the brands buyers compare you with.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, competitors. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

Analyze public ads to understand a competitor's messaging, offers, creative strategy, and testing angles. The output should be a practical teardown marketers can use to write better ads or decide what to test.

## When to Use

Use this skill when the user asks to:

- analyze a competitor's active ads
- search Meta/Facebook, Google, or LinkedIn ad libraries
- extract ad hooks, CTAs, claims, offers, and landing page angles
- compare ad messaging across competitors
- summarize video ad transcripts
- generate ad test ideas from competitor ads

## Data Sources

| Ad library | Search/list endpoint | Detail endpoint | Transcript endpoint |
|---|---|---|---|
| Meta/Facebook | `/v1/facebook/adLibrary/search/ads`, `/v1/facebook/adLibrary/company/ads`, `/v1/facebook/adLibrary/search/companies` | `/v1/facebook/adLibrary/ad` | `/v1/facebook/adLibrary/ad/transcript` |
| Google | `/v1/google/adLibrary/advertisers/search`, `/v1/google/company/ads` | `/v1/google/ad` | n/a |
| LinkedIn | `/v1/linkedin/ads/search` | `/v1/linkedin/ad` | n/a |

## Workflow

1. **Find the advertiser**
   - Use company search endpoints when the user provides only a brand name.
   - Use domain/advertiser/page IDs when available.

2. **Fetch active ads**
   - Prefer active ads unless the user asks for historical analysis.
   - Capture platform, advertiser/page, ad ID, start date, creative type, text, headline, CTA, destination URL, and source URL.

3. **Fetch details for representative ads**
   - Enrich the ads with detail endpoints.
   - For video Meta ads, fetch transcripts when available.

4. **Cluster messaging**
   Group ads by:
   - pain point
   - persona
   - offer
   - proof/social proof
   - feature/benefit
   - objection handled
   - comparison/alternative angle
   - urgency/discount

5. **Extract swipeable elements**
   - hooks
   - headlines
   - primary text patterns
   - CTAs
   - claims
   - offers
   - visual/creative concepts

6. **Recommend tests**
   Suggest tests based on repeated patterns and gaps, not random ideas.

## Output Format

```markdown
# Ad Library Teardown: {brand}

## Summary
- Ads analyzed: {count}
- Platforms: Meta / Google / LinkedIn
- Main positioning:
- Strongest repeated offer:

## Messaging Angles
| Angle | Evidence | Example ads | Notes |
|---|---|---|---|

## Hooks and Headlines Swipe File
- "..."
- "..."

## Offers and CTAs
| Offer | CTA | Platform | Example |
|---|---|---|---|

## Video Transcript Notes
- [Ad](url): summary, hook, best quote

## What They Appear to Be Testing
1. ...
2. ...

## Recommended Tests for Us
1. ...
2. ...
3. ...

## Sources
- [Ad](url)
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Competitor video script adapter](https://useaiblocks.com/skills/competitor-video-ad-script). It takes the ad breakdowns.
- The [Competitor-inspired video script writer](https://useaiblocks.com/skills/competitor-idea-video-script). It takes the ad breakdowns.
- The [Competitor ad theme and gap mapper](https://useaiblocks.com/skills/competitor-ad-theme-and-gap-mapper). It takes the ad breakdowns.
- The [Competitor saturation checker](https://useaiblocks.com/skills/competitor-saturation-checker). It takes the ad breakdowns.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Common Pitfalls

- Do not claim an ad is winning just because it is active. Say it is active or repeated; performance is not public unless the endpoint returns it.
- Do not ignore repeated ads. Repetition is often a useful signal.
- Do not invent spend, conversion rate, or targeting unless public data includes it.
- Do not skip video transcripts when the user asks for hooks or messaging from video ads.
