---
name: audience-research
description: Use when the user wants to evaluate a creator, influencer, or brand audience using public profile signals, TikTok audience demographics, follower/following data, comments, geography, language, and content fit. Helps judge sponsorship and market fit.
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

# Audience Research

## Overview

Evaluate whether a creator or social account reaches the right audience. This skill combines available public profile metrics, TikTok audience demographics, regional signals, follower/following data when available, comments, language, and content topics.

## What you need

- **The creator**: a name or profile link. If it is missing, ask once.
- **Your target market**: the country, language and kind of buyer you sell to. If it is missing, ask once. Do not guess it.
- **The sponsorship goal**: sales, sign-ups, reach or something else. If it is missing, ask once.
- **Budget range** (optional): used only to say whether the deal looks sensible.
- **A ScrapeCreators API key** in `SCRAPECREATORS_API_KEY`. ScrapeCreators is a paid service that reads public social profiles. Check its current price before you run this.
- **A way to run commands.** The live data route needs Bash and web requests, as in Claude Code.

**No key or no code?** Work from public pages and anything the user pastes: the profile text, follower numbers, about 20 recent comments, the link-in-bio page, a media kit. Say at the top that no live data was pulled, and set Confidence to Low unless the pasted material is strong.

Only use public data. Do not list the names or profiles of people who commented. Remind the user that each platform's rules limit what data they may collect and keep.

## When to Use

Use this skill when the user asks to:

- check if a creator's audience fits a market
- compare audience fit across creators
- find US-heavy, country-specific, or niche-specific creators
- evaluate sponsorship/influencer opportunities
- understand who appears to engage with an account

Not for: a creator with no public profile data (ask them for their own analytics or media kit), or the followers of the user's own brand (use the audience profile analyst).

## Useful Sources

- `/v1/tiktok/user/audience`
- `/v1/tiktok/profile/region`
- profile endpoints across platforms
- follower/following endpoints where available
- comments on recent posts
- link-in-bio pages and creator shops for niche signals

## Workflow

1. Pull profile and available audience/demographic data.
2. Pull recent content and comments if audience intent matters.
3. Extract region, language, niche, product/category, and community signals.
4. Score audience fit against the user's target market. Base High, Medium or Low on the evidence found: the share of the audience in the target country when a platform shows it, the language of comments, and how well the topics match the product. Say in one line how you decided.
5. Label confidence based on the strength of public data.
6. List what is still unknown, so the user knows what to ask the creator for.

If a source returns nothing or an error, say so in the Evidence table. Never fill the gap with a guess.

## Output Format

```markdown
# Audience Research: {creator}

## Fit Summary
- Target market:
- Fit score: High/Medium/Low
- How I scored it: (one line)
- Confidence: High/Medium/Low

## Evidence
| Signal | Evidence | Source |
|---|---|---|

## Audience Notes
- Geography:
- Language:
- Niche/content fit:
- Comment quality:

## Sponsorship Recommendation
- Good fit / Maybe / Poor fit
- Why:

## Still Unknown
- (what the public data could not show, and what to ask the creator for)
```

## Common Pitfalls

- Do not infer exact demographics from vibes. Use available evidence and label assumptions.
- Do not overpromise audience details for platforms that do not expose them publicly.
- Do not ignore mismatch between creator location and audience location.
- Do not trust follower counts alone. Check that comments look real and match the target language.
