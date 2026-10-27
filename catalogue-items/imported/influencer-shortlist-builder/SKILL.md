---
name: apify-influencer-discovery
description: Find and evaluate influencers for brand partnerships, verify authenticity, and track collaboration performance across Instagram, Facebook, YouTube, and TikTok.
risk: critical
source: community
date_added: "2026-09-04"
---

# Influencer Discovery

Discover and analyze influencers across multiple platforms using Apify Actors.

## When to Use
- You need to discover creators or influencers for outreach, partnerships, or campaign planning.
- The task is to evaluate authenticity, engagement, niche fit, or audience signals across social platforms.
- You need Apify-based extraction plus a shortlist or summary of suitable influencer candidates.

## Before you run it

- This skill collects public data from social platforms by running third-party Apify Actors. Apify is a paid service with an account and a token. Tell the user to check Apify's current pricing and free allowance, and never state a price yourself.
- Scraping must follow each platform's terms of service and the user's local privacy law. The data names real people. Collect only public profile metrics, keep the list for outreach planning, and do not collect private data or contact details beyond what each creator publishes.
- Keep the collected creator data only for this campaign and delete it afterwards. Take contact details only from the creator's own published profile.
- Never ask the user to paste their Apify token into the chat. It belongs in a local `.env` file.
- If the user cannot run code or has no Apify account, use the no-tools route: ask them to paste the public numbers for each creator (followers, average likes and comments on recent posts, niche, link). Then do Step 5 on those numbers. Say clearly that the data is theirs, not collected by you.
- Ask once for the niche, the target platforms and what a good fit looks like. Mark any answer you do not get as MISSING. Do not guess.

## Prerequisites
(No need to check it upfront)

- `.env` file with `APIFY_TOKEN`
- Node.js 20.6+ (for native `--env-file` support)
- `mcpc` CLI tool: `npm install -g @apify/mcpc`

## Workflow

Copy this checklist and track progress:

```
Task Progress:
- [ ] Step 1: Determine discovery source (select Actor)
- [ ] Step 2: Fetch Actor schema via mcpc
- [ ] Step 3: Ask user preferences (format, filename)
- [ ] Step 4: Run the discovery script
- [ ] Step 5: Summarize results
```

### Step 1: Determine Discovery Source

Select the appropriate Actor based on user needs:

| User Need | Actor ID | Best For |
|-----------|----------|----------|
| Influencer profiles | `apify/instagram-profile-scraper` | Profile metrics, bio, follower counts |
| Find by hashtag | `apify/instagram-hashtag-scraper` | Discover influencers using specific hashtags |
| Reel engagement | `apify/instagram-reel-scraper` | Analyze reel performance and engagement |
| Discovery by niche | `apify/instagram-search-scraper` | Search for influencers by keyword/niche |
| Brand mentions | `apify/instagram-tagged-scraper` | Track who tags brands/products |
| Comprehensive data | `apify/instagram-scraper` | Full profile, posts, comments analysis |
| API-based discovery | `apify/instagram-api-scraper` | Fast API-based data extraction |
| Engagement analysis | `apify/export-instagram-comments-posts` | Export comments for sentiment analysis |
| Facebook content | `apify/facebook-posts-scraper` | Analyze Facebook post performance |
| Micro-influencers | `apify/facebook-groups-scraper` | Find influencers in niche groups |
| Influential pages | `apify/facebook-search-scraper` | Search for influential pages |
| YouTube creators | `streamers/youtube-channel-scraper` | Channel metrics and subscriber data |
| TikTok influencers | `clockworks/tiktok-scraper` | Comprehensive TikTok data extraction |
| TikTok (free) | `clockworks/free-tiktok-scraper` | Free TikTok data extractor |
| Live streamers | `clockworks/tiktok-live-scraper` | Discover live streaming influencers |

### Step 2: Fetch Actor Schema

Fetch the Actor's input schema and details dynamically using mcpc:

```bash
export $(grep APIFY_TOKEN .env | xargs) && mcpc --json mcp.apify.com --header "Authorization: Bearer $APIFY_TOKEN" tools-call fetch-actor-details actor:="ACTOR_ID" | jq -r ".content"
```

The command above puts the token in the command line, which can end up in shell history. Prefer a method where `mcpc` reads the token from an environment variable or a config file, so it never appears in the command text. If that is not possible, run it in a private terminal, then clear the shell history for that session. Never print the token or paste it into the chat. Run the scripts from the skill folder so `reference/scripts/run_actor.js` resolves.

Replace `ACTOR_ID` with the selected Actor (e.g., `apify/instagram-profile-scraper`).

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

### Step 5: Summarize Results

After completion, report:
- Number of influencers found
- File location and name
- Key metrics available (followers, engagement rate, etc.)
- Suggested next steps (filtering, outreach, deeper analysis)

Then rank the creators. Use only fields that came back from the data:

- **Engagement rate** = average likes plus comments on recent posts, divided by followers. Show the sums so the user can check. If a field is missing, write MISSING.
- **Authenticity flags** are warnings, not verdicts. Flag a creator when likes are very low next to followers, when comments are mostly short or repeated, or when followers jump with no matching engagement. Say "worth checking by hand" and never say "fake".
- **Fit** = how closely the creator's bio, hashtags and recent posts match the niche and the fit description the user gave.

Return a table, ranked best first, then a short note on the top three:

| Rank | Creator | Platform | Followers | Engagement rate | Flags | Fit note | Link |

You cannot see a creator's real audience (country, age, buyers). Say so, and suggest asking each creator for their own audience stats before any deal.

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
