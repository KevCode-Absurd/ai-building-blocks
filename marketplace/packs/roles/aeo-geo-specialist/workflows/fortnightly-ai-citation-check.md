# Fortnightly AI citation check

**Cadence:** every two weeks, on the same weekday, after a baseline from the **ai-answer-visibility-audit** skill. AI answers and platform reports change quickly, but run-to-run noise is large, so act on trends across two or more checks, not on one.

**Goal:** spot real changes in how often AI answers mention, cite and describe the brand, catch new errors early, and keep the fix list current.

## Steps

1. **Run the frozen prompt set** (level 1; tools: the AI engines in clean, logged-out sessions from the agreed location, or a tracker such as Profound, Peec AI, Otterly.AI, Semrush AI Visibility Toolkit or Ahrefs Brand Radar). Use the same prompts, engines, modes and run counts as the baseline. For a fortnightly check, a priority subset of 15 to 25 prompts with at least three runs each is enough; run the full set monthly.

2. **Code the answers** with the **ai-answer-coder** prompt, or export the tracker's rows in the same columns.

3. **Pull platform data** (level 1) for the same two weeks:
   - Google Search Console Generative AI performance report: impressions by page (impressions only).
   - Bing Webmaster Tools AI Performance: citations, cited pages and grounding queries.
   - GA4: AI Assistant channel sessions and key events; Organic Search for comparison; `utm_source=chatgpt.com` sessions.
   - Server logs (if available): requests from OAI-SearchBot, PerplexityBot, Claude-SearchBot and the user-fetch agents, with status codes.

4. **Compare with the last two checks.** Flag only changes bigger than normal noise: a rule of thumb is a move of more than about 10 percentage points on 30 or more runs, or the same direction across two checks. Note new cited domains, domains that dropped out, new rivals, and new or fixed factual errors.

5. **Check for causes.** Google or Bing announcements, a new model in AI Mode or AI Overviews, changes on the client's site, new third-party coverage, crawler or CDN changes. Re-run the **ai-crawler-access-review** skill if citations fell on one engine only.

6. **Update the fix list.**
   - New factual error: trace and fix with the **brand-facts-and-entity-audit** skill.
   - Content gap: brief or rewrite with the **citation-ready-page-rewrite** skill.
   - New influential third-party source: add it to the earned source outreach list.

7. **Send a short note** (format below).

## Outputs

A note of no more than one page:
- Mention and citation shares by engine with run counts, against the last two checks.
- Platform numbers: Google AI impressions, Bing citations, AI Assistant sessions and key events.
- What changed beyond noise, and the likely cause.
- New errors found and fixed.
- The next three actions.

## What needs the client's approval

At level 3, after the client confirms the action list and limits once, I do these within them and log each one: fix wrong facts on the pages listed, publish agreed page rewrites, and send correction requests to the agreed directories and sites.

Always a new yes:

- Changes to robots.txt or CDN bot rules that the client hasn't listed, and any change to the Search Console generative AI setting.
- New pages or removals.
- Outreach to publishers, review sites or journalists in the client's name.
- Corrections requested from anyone not on the agreed list.

Running prompts, reading reports and drafting fixes need no approval and only level 1; at level 2 I save the fixes as drafts in the client's tools.
