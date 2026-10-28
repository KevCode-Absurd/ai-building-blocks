---
name: apify-brand-reputation-monitoring
description: "Scrape reviews, ratings, and brand mentions from multiple platforms using Apify Actors."
risk: critical
source: community
date_added: "2026-09-04"
---

# Brand Reputation Monitoring

Scrape reviews, ratings, and brand mentions from multiple platforms using Apify Actors.

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

## When to Use
- You need to monitor reviews, ratings, or brand mentions across social, travel, or map platforms.
- The task is to select and run an Apify Actor for brand sentiment or reputation tracking.
- You need exported monitoring results and a summary of reputation signals.

## Before you run it (AI Blocks notes)

This skill collects public reviews and comments. Only use it where the site's terms allow it, and stop if they do not. Collect only what the question needs, set a result cap, and keep the saved file private. Reviews and comments can contain personal details. In your summary, quote the text only and leave out names and handles.

Apify charges for runs. Before you run, tell the user which Actor you chose for each site and ask them to check its price on its Apify page. Do not collect from Facebook, Instagram or TikTok personal profiles. Use business pages, public posts and public comments only, and ask the user before including anything else. Keep customer names out of what you share. Never show the token in chat or in saved logs. The token lives in `.env` only, and the run script reads it from there. Never use a tool or command that puts the token on the command line, such as `mcpc`, because other programs on a shared machine can see it. Read the Actor's input fields on its public Apify page, which needs no token.

Before the first run, ask the user to confirm, for each site, that they have checked the site's terms and collecting public reviews is allowed. Do not run an Actor for a site until they say yes.

The run script is at `reference/scripts/run_actor.js` inside this skill folder. Run the commands below from that skill folder.

If an input is missing (brand, sites, page links, cap), ask once, then mark `MISSING: <what>` and stop. Never invent reviews, ratings or counts. If you cannot run commands, say so, and offer to read reviews the user pastes, marked as a small sample.

In Step 5, work out every figure from the saved file, not from memory. Give the summary in this order: records found per site and the file location, average rating per site where the data has a rating, the most common praise and complaints with counts and short example quotes, the key fields in the file, the limits of the sample, and next steps such as filtering or a sentiment check.

## Prerequisites
Check these before you run anything:

- `.env` file with `APIFY_TOKEN`
- Node.js 20.6+ (for native `--env-file` support)

## Workflow

Copy this checklist and track progress:

```
Task Progress:
- [ ] Step 1: Determine data source (select Actor)
- [ ] Step 2: Read the Actor's input fields on its public page
- [ ] Step 3: Ask user preferences (format, filename)
- [ ] Step 4: Run the monitoring script
- [ ] Step 5: Summarize results
```

### Step 1: Determine Data Source

Select the appropriate Actor based on user needs:

| User Need | Actor ID | Best For |
|-----------|----------|----------|
| Google Maps reviews | `compass/crawler-google-places` | Business reviews, ratings |
| Google Maps review export | `compass/Google-Maps-Reviews-Scraper` | Dedicated review scraping |
| Booking.com hotels | `voyager/booking-scraper` | Hotel data, scores |
| Booking.com reviews | `voyager/booking-reviews-scraper` | Detailed hotel reviews |
| TripAdvisor reviews | `maxcopell/tripadvisor-reviews` | Attraction/restaurant reviews |
| Facebook reviews | `apify/facebook-reviews-scraper` | Page reviews |
| Facebook comments | `apify/facebook-comments-scraper` | Post comment monitoring |
| Facebook page metrics | `apify/facebook-pages-scraper` | Page ratings overview |
| Facebook reactions | `apify/facebook-likes-scraper` | Reaction type analysis |
| Instagram comments | `apify/instagram-comment-scraper` | Comment sentiment |
| Instagram hashtags | `apify/instagram-hashtag-scraper` | Brand hashtag monitoring |
| Instagram search | `apify/instagram-search-scraper` | Brand mention discovery |
| Instagram tagged posts | `apify/instagram-tagged-scraper` | Brand tag tracking |
| Instagram export | `apify/export-instagram-comments-posts` | Bulk comment export |
| Instagram comprehensive | `apify/instagram-scraper` | Full Instagram monitoring |
| Instagram API | `apify/instagram-api-scraper` | API-based monitoring |
| YouTube comments | `streamers/youtube-comments-scraper` | Video comment sentiment |
| TikTok comments | `clockworks/tiktok-comments-scraper` | TikTok sentiment |

### Step 2: Read the Actor's Inputs

Read the Actor's input fields. Open the Actor's public page on apify.com (for example `apify.com/compass/crawler-google-places`) and copy its README, input fields and price per run. No token is needed for that. Do not fetch the details with a command that puts the token on the command line.

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
2. **Number of results**: Default to 100 per site. Ask the user before going higher, because larger runs cost more and collect more personal data.

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
- Number of reviews/mentions found
- File location and name
- Key fields available
- Suggested next steps (sentiment analysis, filtering)

## Error Handling

`APIFY_TOKEN not found` - Ask user to create `.env` with `APIFY_TOKEN=your_token`
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
- The [Review insight finder](https://useaiblocks.com/skills/review-insight-finder). It takes the customer words.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
