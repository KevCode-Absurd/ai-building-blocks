---
name: apify-trend-analysis
description: Discover and track emerging trends across Google Trends, Instagram, Facebook, YouTube, and TikTok to inform content strategy.
risk: critical
source: community
date_added: "2026-09-04"
---

# Trend Analysis

Discover and track emerging trends using Apify Actors to extract data from multiple platforms.

## Before you start (added by AI Blocks)

- **What you need from the user.** A topic or niche and the platforms to scan. If either is missing, ask once. Do not guess a topic. If the user names no platform, suggest Google Trends plus one social site and ask them to confirm.
- **This needs code running.** The steps below run a Node.js script and the `mcpc` tool, and read `APIFY_TOKEN` from a `.env` file. If you cannot run code, say so. Offer a no-tools fallback: ask the user to open Google Trends themselves, compare the topic over the last 12 months, and paste the numbers or a screenshot description. Then summarise only what they paste.
- **Cost.** Apify runs can use paid credits. Before step 4, tell the user which Actor you will run and ask for a small result count for the first run. Never raise the count without asking.
- **Platform rules.** Scraping Instagram, Facebook, TikTok and YouTube may go against those sites' terms of service. This skill reads public pages only. Remind the user once to check the terms before they use the data. Never ask for a login or a private account.
- **Never ask the user to paste the Apify token into the chat.** It lives in the `.env` file.
- **Skip the Facebook groups and Marketplace scrapers** unless the user confirms the data is public and allowed by the platform's terms. Group content can be private to its members.
- **Ask for a spend limit.** Before the first run, ask how much Apify credit the user will allow, and stop when it is reached.
- **Script path.** In the commands below, `${CLAUDE_PLUGIN_ROOT}` is the folder that holds this skill. The script is `reference/scripts/run_actor.js` inside it. If the variable is empty, use that relative path.
- **Do not invent trends.** A trend needs a change over time. Report only what the returned data shows. If a run returns one snapshot with no earlier period to compare, say "this shows what is popular now, not what is rising" and suggest a second run next month. Quote counts exactly as returned. If a run fails or returns nothing, say so and stop.
- **Why the front matter says `risk: critical`.** The skill uses an API token, can spend money on Apify, and reads other sites' data. Take care with each of those.


## Prerequisites
(No need to check it upfront)

- `.env` file with `APIFY_TOKEN`
- Node.js 20.6+ (for native `--env-file` support)
- `mcpc` CLI tool: `npm install -g @apify/mcpc`

## Workflow

Copy this checklist and track progress:

```
Task Progress:
- [ ] Step 1: Identify trend type (select Actor)
- [ ] Step 2: Fetch Actor schema via mcpc
- [ ] Step 3: Ask user preferences (format, filename)
- [ ] Step 4: Run the analysis script
- [ ] Step 5: Summarize findings
```

### Step 1: Identify Trend Type

Select the appropriate Actor based on research needs:

| User Need | Actor ID | Best For |
|-----------|----------|----------|
| Search trends | `apify/google-trends-scraper` | Google Trends data |
| Hashtag tracking | `apify/instagram-hashtag-scraper` | Hashtag content |
| Hashtag metrics | `apify/instagram-hashtag-stats` | Performance stats |
| Visual trends | `apify/instagram-post-scraper` | Post analysis |
| Trending discovery | `apify/instagram-search-scraper` | Search trends |
| Comprehensive tracking | `apify/instagram-scraper` | Full data |
| API-based trends | `apify/instagram-api-scraper` | API access |
| Engagement trends | `apify/export-instagram-comments-posts` | Comment tracking |
| Product trends | `apify/facebook-marketplace-scraper` | Marketplace data |
| Visual analysis | `apify/facebook-photos-scraper` | Photo trends |
| Community trends | `apify/facebook-groups-scraper` | Group monitoring |
| YouTube Shorts | `streamers/youtube-shorts-scraper` | Short-form trends |
| YouTube hashtags | `streamers/youtube-video-scraper-by-hashtag` | Hashtag videos |
| TikTok hashtags | `clockworks/tiktok-hashtag-scraper` | Hashtag content |
| Trending sounds | `clockworks/tiktok-sound-scraper` | Audio trends |
| TikTok ads | `clockworks/tiktok-ads-scraper` | Ad trends |
| Discover page | `clockworks/tiktok-discover-scraper` | Discover trends |
| Explore trends | `clockworks/tiktok-explore-scraper` | Explore content |
| Trending content | `clockworks/tiktok-trends-scraper` | Viral content |

### Step 2: Fetch Actor Schema

Fetch the Actor's input schema and details dynamically using mcpc:

```bash
export $(grep APIFY_TOKEN .env | xargs) && mcpc --json mcp.apify.com --header "Authorization: Bearer $APIFY_TOKEN" tools-call fetch-actor-details actor:="ACTOR_ID" | jq -r ".content"
```

Replace `ACTOR_ID` with the selected Actor (e.g., `apify/google-trends-scraper`).

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
2. **Number of results**: Based on character of use case

### Step 4: Run the Script

**Quick answer (display in chat, no file):**
```bash
node --env-file=.env ${CLAUDE_PLUGIN_ROOT}/reference/scripts/run_actor.js \
  --actor "ACTOR_ID" \
  --input 'JSON_INPUT'
```

**CSV:**
```bash
node --env-file=.env ${CLAUDE_PLUGIN_ROOT}/reference/scripts/run_actor.js \
  --actor "ACTOR_ID" \
  --input 'JSON_INPUT' \
  --output YYYY-MM-DD_OUTPUT_FILE.csv \
  --format csv
```

**JSON:**
```bash
node --env-file=.env ${CLAUDE_PLUGIN_ROOT}/reference/scripts/run_actor.js \
  --actor "ACTOR_ID" \
  --input 'JSON_INPUT' \
  --output YYYY-MM-DD_OUTPUT_FILE.json \
  --format json
```

### Step 5: Summarize Findings

After completion, report:
- Number of results found
- File location and name
- Key trend insights
- Suggested next steps (deeper analysis, content opportunities)

### Output format

Give the final answer in this shape:

```
Trend scan: <topic>, <date>
Sites scanned: <list>   Results found: <number>   File: <name and location, or "chat only">

Rising on <site>
- <hashtag, search, sound or video>: <what the data shows>

Not clear yet
- <anything the data was too thin to call>

Next steps
- <a content or product angle to test, and a tool or skill that pairs with it>
```


## Error Handling

`APIFY_TOKEN not found` - Ask user to create `.env` with `APIFY_TOKEN=your_token`
`mcpc not found` - Ask user to install `npm install -g @apify/mcpc`
`Actor not found` - Check Actor ID spelling
`Run FAILED` - Ask user to check Apify console link in error output
`Timeout` - Reduce input size or increase `--timeout`


## When to Use
Use this skill when the user wants to know what is rising in a topic on Google Trends, Instagram, Facebook, YouTube or TikTok. Do not use it for live breaking news, private account data, or a forecast of the user's own sales.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
