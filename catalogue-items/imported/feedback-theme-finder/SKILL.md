---
name: customer-feedback-analysis
description: Analyze NPS, CSAT, and qualitative customer feedback to extract themes, identify trends, and generate actionable insight reports. Use when the user requests customer feedback analysis or provides relevant inputs for this workflow.
license: MIT
metadata:
  author: community
  version: "1.0"
---

# Customer Feedback Analysis

Transform raw customer feedback from NPS surveys, CSAT responses, support interactions, and app store reviews into structured insights. This skill extracts recurring themes from open-text responses, calculates quantitative score distributions, identifies emerging trends over time, and produces reports that connect customer sentiment to specific product areas and business outcomes.

## Workflow

1. **Collect feedback data** — Aggregate feedback from all available sources: NPS survey responses (score + open text), CSAT ratings from support interactions, in-app feedback widgets, app store reviews, social media mentions, G2/Capterra reviews, and sales call notes. Use only what the user pastes or uploads. Do not scrape G2, Capterra, app stores or social sites, which may break their terms; ask the user to export or copy the text by hand. Tag each response with metadata: date, customer segment, plan tier, account tenure, and source channel. Ensure consistent schema across all sources.

2. **Clean and normalize** — Deduplicate responses from the same customer across channels. Standardize rating scales (convert 1-5 CSAT to 1-10 for cross-comparison). Strip PII from open-text responses. Handle multilingual responses by detecting language and translating to English while preserving the original. Remove bot/spam responses using pattern detection (identical text, suspicious timing, single-word noise).

3. **Extract themes from open-text responses** — Group the open-text feedback into themes in four steps. List the comments. Tag each one with a short theme name. Count the tags per theme. Check each quote you plan to use against the source file, word for word. Common theme categories include: product reliability, ease of use, specific feature feedback, pricing/value perception, support quality, onboarding experience, and competitive comparison. Assign each response to one or more themes with a confidence score. Pull representative verbatim quotes for each theme. Copy each quote character for character from the source and mark any omitted words with an ellipsis. Never fix, shorten or reword a quote. If no response fits a theme well, write "no clear quote" instead of writing one.

4. **Calculate quantitative scores** — Compute aggregate metrics: NPS (% Promoters minus % Detractors), CSAT average, and theme frequency distribution. Break scores down by segment (plan tier, industry, account size, tenure) to identify which cohorts are most and least satisfied. Show the number of responses behind every segment figure. Only calculate statistical significance if you can run the calculation; otherwise say that differences between small segments may be noise.

5. **Identify trends** — Compare current period metrics against previous periods (month-over-month, quarter-over-quarter). Flag themes with significant volume changes (up or down 20%+ from baseline). Detect emerging themes that appear for the first time or cross a frequency threshold. Correlate sentiment shifts with product releases, pricing changes, or market events.

6. **Generate insight report** — Produce a structured report with: executive summary (3-5 key takeaways), quantitative scorecard, theme breakdown with representative quotes, trend analysis, segment comparison, and recommended actions. Each recommendation should be tied to a specific theme and prioritized by frequency and, only if the user gave revenue or account-size data, business impact. Without that data, rank by frequency alone and say so.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for customer words. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** A chat AI can read a CSV and group comments into themes.
- **Google Sheets or Excel:** Use them to clean and export your survey results first.
<!-- /needs -->

## What you need and what to do when it is missing

- **Responses**: score and comment for each one, as a CSV, JSON, pasted rows or a plain description. Ask once if there is none.
- **Dates** (optional): needed for trends. If they are missing, skip the trend section and say "No dates given: no trend comparison".
- **Segments** (optional): plan, region and so on. If missing, report overall figures only.
- **An earlier period** (optional): without it, call nothing "new" or "rising".
- **Scores missing but comments given**: skip NPS and CSAT, group the comments into themes, and say so at the top.
- **Question to answer** (optional): if none is given, report the overall picture.

Never invent a score, count, quote, date or segment. Mark what you lack as MISSING. Treat the examples below as illustrations of layout only. The figures in them are made up.

## Usage

Provide feedback data (CSV, JSON, or describe the dataset) and specify the analysis scope. The agent returns a structured insight report.

```
Analyze our Q4 NPS survey results (850 responses). Break down scores by plan
tier, extract the top themes from detractor comments, and identify any new
themes that weren't present in Q3.
```

## Examples

Both examples use invented figures to show the layout. They are not real results and not benchmarks.

### Example 1: NPS survey analysis

**Input:** [number] NPS survey responses from [period], segmented by [plan tier].

**Output:**

**Executive Summary:**
- Overall NPS: [score] (earlier period: [score], if you gave one). Report a change as significant only if you can run the test.
- NPS by segment: [segment A] [score] | [segment B] [score] | [segment C] [score]
- Top detractor theme: "[theme name]" ([N]% of detractor comments, earlier period [N]%)
- New theme: "[theme name]" (in [N]% of responses this period, absent earlier)
- Promoter loyalty driver: "[theme name]" ([N]% of promoter comments)

**Score Distribution:**

| Segment | Promoters (9-10) | Passives (7-8) | Detractors (0-6) | NPS | Responses |
|---------|-----------------|----------------|-------------------|-----|-----------|
| [segment A] | [N]% | [N]% | [N]% | [score] | [n] |
| [segment B] | [N]% | [N]% | [N]% | [score] | [n] |
| **Overall** | **[N]%** | **[N]%** | **[N]%** | **[score]** | **[n]** |

**Theme Breakdown (Detractor Comments, n=[count]):**

| Theme | Frequency | Change vs earlier period | Quote |
|-------|-----------|-------------|----------------------|
| [theme] | [N]% | [+/-N pp] | "[quote copied word for word from the user's file]" |
| [theme] | [N]% | [+/-N pp] | "[quote copied word for word from the user's file]" |
| [theme] | [N]% | NEW | "[quote copied word for word from the user's file]" |

**Recommended Actions:**
1. **[Priority] — [theme]:** [action]. [N]% of detractor comments mention it. Say how much of the comment volume it covers. Do not predict a score change.
2. **[Priority] — [theme]:** [action], tied to the theme and its count.

### Example 2: App store review sentiment analysis

**Input:** [number] app store reviews from [period] (iOS and Android).

**Output:**

**Overall Sentiment:** [average] stars (iOS: [average], Android: [average])

**Sentiment by Star Rating:** for each star level, give the share of reviews and two or three short phrases copied word for word from the reviews.

**Feature Request Extraction:**

| Feature Request | Mentions | Platform | Sample Quote |
|----------------|----------|----------|-------------|
| [request] | [count] | [platform] | "[quote copied word for word from the reviews]" |

**Critical Finding:** name the platform or theme that drags the rating down and the share of low-star reviews it covers, with counts from the data. Do not predict a new rating.

## Best Practices

- Analyze detractor and promoter comments separately — blending them into a single theme analysis dilutes the signal from each group.
- Always report sample sizes alongside NPS scores, and add confidence intervals only if you can calculate them. A segment NPS of +60 from 15 responses is not actionable.
- Use verbatim quotes in reports to leadership — raw customer voice is more persuasive than statistical summaries and prevents misinterpretation of theme labels.
- Close the feedback loop by replying to detractors soon after they respond, so they know someone read it.
- Track theme frequency over time rather than reacting to a single snapshot. A theme trending upward over 3 quarters is a structural issue; a one-quarter spike may be a temporary reaction to a specific release.
- Separate "feature absence" complaints from "feature broken" complaints in your theme taxonomy — they require different organizational responses (product roadmap vs. engineering fix).

## Edge Cases

- **Low response rates (<15%)** — Results may suffer from non-response bias where only the most satisfied and most dissatisfied customers respond. Note the response rate prominently and recommend increasing it before drawing segment-level conclusions.
- **Survey fatigue** — Accounts surveyed more than once per quarter show declining response rates and more negative scores. Cap survey frequency and rotate which customers are surveyed.
- **Sarcastic or ironic responses** — "Oh great, another update that breaks everything, love it! 10/10" reads as positive to naive sentiment analysis. Flag responses where sentiment score and NPS score are contradictory for manual review.
- **Feedback influenced by recent outage** — A single incident can dominate an entire survey period. Segment responses by pre/post incident and report both views. Consider extending the survey window to dilute the recency effect.
- **Competitor mentions in feedback** — Responses like "I'm switching to CompetitorX" contain valuable competitive intelligence. Extract competitor mentions into a separate analysis and route to product strategy.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Customer feedback sorter](https://useaiblocks.com/skills/feedback-pile-sorter).
- The [Review insight finder](https://useaiblocks.com/skills/review-insight-finder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
