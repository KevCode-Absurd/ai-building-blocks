---
name: apify-audience-analysis
description: Understand audience demographics, preferences, behavior patterns, and engagement quality across Facebook, Instagram, YouTube, and TikTok.
risk: critical
source: community
date_added: "2026-09-04"
---

# Audience Analysis

Analyze and understand your audience using Apify Actors to extract follower demographics, engagement patterns, and behavior data from multiple platforms.

## When to Use
- You need audience demographics, engagement patterns, or follower behavior from social platforms.
- The task is to choose and run Apify Actors for audience analysis across Facebook, Instagram, YouTube, or TikTok.
- You need structured extraction plus a summarized interpretation of audience findings.

## Before you run it (AI Blocks notes)

This skill collects public data about people who follow or comment on an account. Only use it on public accounts, and stop if the platform's terms forbid collecting that data. Collect only what the question needs, set a result cap, and keep the saved file private.

Report patterns across the group, such as common places, interests and how much of the engagement looks genuine. Never list named people or build a profile of one person in your summary. These Actors return public profile fields and comments, not verified age or gender. Label any demographic claim as inferred, and say how many records it rests on.

Apify charges for runs. Before you run, tell the user which Actor you chose and ask them to check its price on its Apify page. Never show the token in chat or in saved logs. The token lives in `.env` only, and the run script reads it from there. Do not run any command that puts the token on the command line, because other programs on a shared machine can see it. Read the Actor's input fields on its public Apify page instead, which needs no token.

Before every run, check that the platform's terms allow collecting this data, and check the privacy rules where you and the account's audience live (for example GDPR in the EU). Have a reason for collecting, collect only what you need, and set a date to delete the exported file. The Apify account needs credit before the run starts, or the run fails.

The run script is at `reference/scripts/run_actor.js` inside this skill folder. Run the commands below from that skill folder.

The exported file holds personal public data about followers. Keep it in a private folder, never share it, and tell the user to delete it once the analysis is done.

If an input is missing (account link, platform, cap), ask once, then mark `MISSING: <what>` and stop. Never invent audience data. If you cannot run commands, say so, and offer a rough read of a sample of public comments the user pastes, marked as low confidence.

In Step 5, give the summary in this order: the Actor used, the records collected and the file location, who the audience seems to be (labelled as inferred), what they engage with, whether the engagement looks genuine and the signs you used, the limits of the sample, and next steps.

## Prerequisites
Check these before you run anything:

- `.env` file with `APIFY_TOKEN`
- Node.js 20.6+ (for native `--env-file` support)
- An Apify account with credit

## Workflow

Copy this checklist and track progress:

```
Task Progress:
- [ ] Step 1: Identify audience analysis type (select Actor)
- [ ] Step 2: Read the Actor's input fields
- [ ] Step 3: Ask user preferences (format, filename)
- [ ] Step 4: Run the analysis script
- [ ] Step 5: Summarize findings
```

### Step 1: Identify Audience Analysis Type

Select the appropriate Actor based on analysis needs. AI Blocks note: the Actor IDs below come from the original skill. Before the first run, check that each one you pick still exists on apify.com and read its page for current inputs and price.

| User Need | Actor ID | Best For |
|-----------|----------|----------|
| Facebook followers (lists only, no demographics) | `apify/facebook-followers-following-scraper` | FB followers/following lists and profile fields |
| Facebook engagement behavior | `apify/facebook-likes-scraper` | FB post likes analysis |
| Facebook video audience | `apify/facebook-reels-scraper` | FB Reels viewers |
| Facebook comment analysis | `apify/facebook-comments-scraper` | FB post/video comments |
| Facebook content engagement | `apify/facebook-posts-scraper` | FB post engagement metrics |
| Instagram audience sizing | `apify/instagram-profile-scraper` | IG public profile fields |
| Instagram location-based | `apify/instagram-search-scraper` | IG geo-tagged audience |
| Instagram tagged network | `apify/instagram-tagged-scraper` | IG tag network analysis |
| Instagram comprehensive | `apify/instagram-scraper` | Full IG audience data |
| Instagram API-based | `apify/instagram-api-scraper` | IG API access |
| Instagram follower counts | `apify/instagram-followers-count-scraper` | IG follower tracking |
| Instagram comment export | `apify/export-instagram-comments-posts` | IG comment bulk export |
| Instagram comment analysis | `apify/instagram-comment-scraper` | IG comment sentiment |
| YouTube viewer feedback | `streamers/youtube-comments-scraper` | YT comment analysis |
| YouTube channel audience | `streamers/youtube-channel-scraper` | YT channel subscribers |
| TikTok followers (lists only, no demographics) | `clockworks/tiktok-followers-scraper` | TT follower lists and profile fields |
| TikTok profile analysis | `clockworks/tiktok-profile-scraper` | TT public profile fields |
| TikTok comment analysis | `clockworks/tiktok-comments-scraper` | TT comment engagement |

### Step 2: Fetch Actor Schema

Read the Actor's input fields. The safest way is to open the Actor's public page on apify.com and copy its README and input fields. No token is needed for that.

Use the page of the selected Actor (e.g., `apify/facebook-followers-following-scraper`) at apify.com/ACTOR_ID.

The page shows:
- Actor description and README
- Required and optional input parameters
- Output fields (if available)

### Step 3: Ask User Preferences

Before running, ask:
1. **Output format**:
   - **Quick answer** - Display the top 5 results in chat (no file saved)
   - **CSV** - Full export with all fields
   - **JSON** - Full export in JSON format
2. **Number of results**: Default to 100 per run. Ask the user before going higher, because larger runs cost more and collect more personal data.

### Step 4: Run the Script

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
- Number of audience members/profiles analyzed
- File location and name
- Key demographic insights (label each one as inferred and say how many records it rests on)
- Engagement read. Use this rough method and call it a heuristic, never proof of bought activity: compare likes and comments with follower count in the same sample, count how many commenters appear more than once, and note how many comments are only emojis or one generic word. Give the counts you used. Say "looks typical", "looks thin" or "looks odd", and never state a threshold as a rule. Never say or imply that a creator bought followers or likes. "Looks odd" only means the counts are worth checking by hand.
- Suggested next steps (deeper analysis, segmentation)

## Error Handling

`APIFY_TOKEN not found` - Ask user to create `.env` with `APIFY_TOKEN=your_token`
`Actor not found` - Check Actor ID spelling
`Run FAILED` - Ask user to check Apify console link in error output
`Timeout` - Reduce input size or increase `--timeout`

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
