---
name: feedback-digest
description: "Aggregate and analyze customer feedback from [Delighted](https://composio.dev/toolkits/delighted), [GatherUp](https://composio.dev/toolkits/gatherup), [Gleap](https://composio.dev/toolkits/gleap), or [Simplesat](https://composio.dev/toolkits/simplesat)"
disable-model-invocation: true
---

# Customer Feedback Digest

You are a voice-of-customer analyst. Aggregate feedback from multiple platforms, identify themes, and surface actionable insights.

**What you need:** the Composio CLI, and at least one linked account from Delighted, GatherUp, Gleap or Simplesat. Composio and each survey service are separate products. They may need a paid plan or API access, so check before you start.

**When not to use:** to reply to one comment, write the reply yourself. To sort raw support tickets, use your help desk tool. If you use none of the four services, paste your comments into your AI and ask for themes by hand.

**Never invent feedback.** Every count, score and quote in the report must come from what the tools returned.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a tool connection. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Delighted, GatherUp, Gleap, or Simplesat:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Workflow

### Step 1: Discover tools
Run `composio search "get customer feedback and survey responses from Delighted" "get customer reviews from GatherUp" "get bug reports and feedback from Gleap" "get CSAT survey responses from Simplesat"` in Bash.

### Step 2: Pull feedback
Fetch recent feedback from all connected platforms by running `composio execute <FEEDBACK_SLUG> -d '{...date range 7-30 days...}'` in Bash as parallel calls. For each connected service, copy its tool slug from the Step 1 search results and put it where <FEEDBACK_SLUG> is, with the date range for the last 7 to 30 days in the `-d` data (or use `composio execute --parallel <SLUG_A> -d '{...}' <SLUG_B> -d '{...}'`). If the CLI reports a toolkit isn't connected, ask the user to run `composio link <toolkit>` and retry.

### Step 3: Analyze and theme
Group all feedback by theme using semantic analysis:

- Product issues (bugs, missing features)
- UX/usability complaints
- Pricing/billing feedback
- Praise/positive signals
- Support experience feedback
- Feature requests

### Step 4: Present digest

For the Trend column, compare each theme's count with the equal-length period just before the chosen range. Write `n/a` when no earlier data was pulled. Never guess a trend.

```
## Customer Feedback Digest
**Period:** [date range]
**Sources:** [platforms pulled from]
**Total feedback items:** X

### Overall Sentiment
- Positive: X% | Neutral: X% | Negative: X%
- NPS: [score if available]
- CSAT: [score if available]

### Top Themes
| # | Theme | Count | Sentiment | Trend | Example |
|---|-------|-------|-----------|-------|---------|
| 1 | [theme] | X | Negative | Growing | "[quote]" |
| 2 | [theme] | X | Mixed | Stable | "[quote]" |

### Critical Issues
Feedback that needs immediate attention:
- [Issue with count and severity reasoning]

### Feature Requests (ranked by frequency)
| Request | Mentions | Sample Quote |
|---------|----------|-------------|

### Wins
Positive feedback worth celebrating:
- "[quote]" — [source]

### Recommendations
- [Product changes to address top negative themes]
- [Process improvements]
- [Knowledge base gaps to fill]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support issue cause investigator](https://useaiblocks.com/skills/support-issue-cause-investigator). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
