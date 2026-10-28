---
name: apify-content-analytics
description: Track engagement metrics, measure campaign ROI, and analyze content performance across Instagram, Facebook, YouTube, and TikTok.
risk: critical
source: community
date_added: "2026-09-04"
---

# Content Analytics

Track and analyze content performance using Apify Actors to extract engagement metrics from multiple platforms.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A video link** (yours): the link to the video, playlist, channel or post.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a video link. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use
- You need engagement, growth, or ROI metrics for posts, reels, videos, ads, or hashtags.
- The task is to use Apify Actors to collect cross-platform content performance data.
- You need exported analytics results and a concise interpretation of what content is performing best.

## Prerequisites
Check these before you start. Run the commands from this skill's folder so the script path resolves.

- `.env` file with `APIFY_TOKEN`
- Node.js 20.6+ (for native `--env-file` support)
- `mcpc` CLI tool: `npm install -g @apify/mcpc`
- `reference/scripts/run_actor.js` in this skill's folder. If it is missing, ask the user to reinstall the skill. Do not write your own runner.

## Before you scrape (ask the user first)

This skill collects public data from Instagram, Facebook, YouTube and TikTok by scraping. Scraping can break a platform's terms of service. It also runs on a paid Apify account: each run uses Apify credits, and the cost depends on the Actor, the number of results and the user's plan. Ask the user to confirm two things before any run:

1. They have read the platform's terms and accept the risk of scraping it.
2. They have checked their Apify plan and usage limit and are happy with the cost.

If they have not, stop. Do not run anything until they say yes. Use only public accounts, posts and hashtags.

## Workflow

Copy this checklist and track progress:

```
Task Progress:
- [ ] Step 1: Identify content analytics type (select Actor)
- [ ] Step 2: Fetch Actor schema via mcpc
- [ ] Step 3: Ask user preferences (format, filename)
- [ ] Step 4: Run the analytics script
- [ ] Step 5: Summarize findings
```

### Step 1: Identify Content Analytics Type

Select the appropriate Actor based on analytics needs:

| User Need | Actor ID | Best For |
|-----------|----------|----------|
| Post engagement metrics | `apify/instagram-post-scraper` | Post performance |
| Reel performance | `apify/instagram-reel-scraper` | Reel analytics |
| Follower growth tracking | `apify/instagram-followers-count-scraper` | Growth metrics |
| Comment engagement | `apify/instagram-comment-scraper` | Comment analysis |
| Hashtag performance | `apify/instagram-hashtag-scraper` | Branded hashtags |
| Mention tracking | `apify/instagram-tagged-scraper` | Tag tracking |
| Comprehensive metrics | `apify/instagram-scraper` | Full data |
| API-based analytics | `apify/instagram-api-scraper` | API access |
| Facebook post performance | `apify/facebook-posts-scraper` | Post metrics |
| Reaction analysis | `apify/facebook-likes-scraper` | Engagement types |
| Facebook Reels metrics | `apify/facebook-reels-scraper` | Reels performance |
| Ad performance tracking | `apify/facebook-ads-scraper` | Ad analytics |
| Facebook comment analysis | `apify/facebook-comments-scraper` | Comment engagement |
| Page performance audit | `apify/facebook-pages-scraper` | Page metrics |
| YouTube video metrics | `streamers/youtube-scraper` | Video performance |
| YouTube Shorts analytics | `streamers/youtube-shorts-scraper` | Shorts performance |
| TikTok content metrics | `clockworks/tiktok-scraper` | TikTok analytics |

### Step 2: Fetch Actor Schema

Fetch the Actor's input schema and details dynamically using mcpc:

```bash
export $(grep APIFY_TOKEN .env | xargs) && mcpc --json mcp.apify.com --header "Authorization: Bearer $APIFY_TOKEN" tools-call fetch-actor-details actor:="ACTOR_ID" | jq -r ".content"
```

Replace `ACTOR_ID` with the selected Actor (e.g., `apify/instagram-post-scraper`).

This returns:
- Actor description and README
- Required and optional input parameters
- Output fields (if available)

### Step 3: Ask User Preferences

Before running, ask:
1. **Output format**:
   - **Quick answer** - Display top few results in chat (no file saved)
   - **CSV** - Full export with all fields
   - **JSON** - Full export in JSON format
2. **Number of results**: Default to 20 posts unless the user asks for more. Start small to keep the cost low.

### Step 4: Run the Script

Build `JSON_INPUT` from the schema you fetched in Step 2. The field names differ by Actor, so never guess them. Use this fill-in shape, and replace each bracket with a field name from the schema and the user's own values:

- Posts, reels, videos or ads from an account or page: `{"[URL OR USERNAME FIELD]": ["[ACCOUNT OR PAGE URL]"], "[RESULT LIMIT FIELD]": [NUMBER OF POSTS]}`
- A hashtag: `{"[HASHTAG FIELD]": ["[HASHTAG WITHOUT #]"], "[RESULT LIMIT FIELD]": [NUMBER OF POSTS]}`
- Follower count only: `{"[USERNAME OR URL FIELD]": ["[ACCOUNT]"]}`

Start with a small result limit to keep the cost low.

**Quick answer (display in chat, no file):**
```bash
node --env-file=.env reference/scripts/run_actor.js \
  --actor "ACTOR_ID" \
  --input 'JSON_INPUT'
```

**CSV:**
```bash
node --env-file=.env reference/scripts/run_actor.js \
  --actor "ACTOR_ID" \
  --input 'JSON_INPUT' \
  --output YYYY-MM-DD_OUTPUT_FILE.csv \
  --format csv
```

**JSON:**
```bash
node --env-file=.env reference/scripts/run_actor.js \
  --actor "ACTOR_ID" \
  --input 'JSON_INPUT' \
  --output YYYY-MM-DD_OUTPUT_FILE.json \
  --format json
```

### Step 5: Summarize Findings

After completion, report:
- Number of content pieces analyzed
- File location and name
- Key performance insights
- Suggested next steps (deeper analysis, content optimization)

## Error Handling

`APIFY_TOKEN not found` - Ask user to create `.env` with `APIFY_TOKEN=your_token`
`mcpc not found` - Ask user to install `npm install -g @apify/mcpc`
`Actor not found` - Check Actor ID spelling
`Run FAILED` - Ask user to check Apify console link in error output
`Timeout` - Reduce input size or increase `--timeout`

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Social post calendar and draft writer](https://useaiblocks.com/skills/social-post-planner). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
