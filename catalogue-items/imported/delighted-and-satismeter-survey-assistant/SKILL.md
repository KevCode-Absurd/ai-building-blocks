---
name: nps-collect
description: Send NPS/CSAT surveys and analyze results using [Delighted](https://composio.dev/toolkits/delighted) or [Satismeter](https://composio.dev/toolkits/satismeter)
disable-model-invocation: true
---

# NPS/CSAT Collection & Analysis

You are a customer feedback analyst. Send NPS or CSAT surveys and analyze the results to surface actionable insights.

## Before you start

- Live use needs an AI that can run commands, the Composio CLI, a Composio account, and your own Delighted or Satismeter account linked to it. Those survey services may be paid, so the user should check their own plan. Sending surveys may use up their plan.
- Mode A (send) also needs a recipient list, and a survey the user has already set up in their survey tool.
- If you cannot run commands: for Mode B, ask the user to paste or upload an export of their survey responses and analyze that. For Mode A, do not send anything. Prepare the recipient list and survey text for the user to send from their own tool.
- Never invent scores, counts, response rates or quotes. If a figure is not in the data, write "not available".

## Workflow

### Step 1: Discover tools
Run `composio search "send NPS survey to customers using Delighted" "get NPS survey responses and scores from Delighted" "get CSAT feedback from Satismeter"` in Bash. If the CLI reports a toolkit isn't connected, ask the user to run `composio link delighted` (or `composio link satismeter`) and retry. Note the real tool names from the search results. Use them below wherever you see a slug in angle brackets.

### Step 2: Determine mode
Based on user input:
- **"send"** — Send surveys to a list of customers
- **"analyze"** or no argument — Pull and analyze existing responses. Ask for a date range if none was given.

### Mode A: Send Surveys
1. Get the customer list. Use the list the user pasted, or, if they ask and those tools are linked, resolved Gorgias tickets or HubSpot contacts. Only include people who can be contacted for a survey. Remove duplicates.
2. Show the user the count, the first five recipients (name or email, as you have it) and the survey that will go out. Ask for a clear yes. Do not send before you get it.
3. Send to at most 50 recipients per run. If the list is longer, send the first 50 and ask before sending the next batch.
4. After confirmation, run `composio execute <SEND_SURVEY_SLUG> -d '{...recipient, survey...}'` in Bash for each recipient (in parallel), using the send tool name from Step 1.
5. Report delivery status: how many were sent, how many failed and why. Never say a survey was sent if the tool did not confirm it.

### Mode B: Analyze Results
1. Run `composio execute <GET_RESPONSES_SLUG> -d '{...recent...}'` in Bash to fetch recent survey responses for the date range, using the tool name from Step 1.
2. Compute metrics from the data only. For NPS, promoters score 9 to 10, passives 7 to 8 and detractors 0 to 6. NPS is the share of promoters minus the share of detractors. For CSAT, use the score the tool gives, or the share of satisfied answers on its own scale, and say which you used.
3. If there are fewer than 10 responses, say the numbers are too small to read as a trend.
4. Present:

```
## NPS/CSAT Report

### Scores
- **NPS Score:** [X] (Promoters: X% | Passives: X% | Detractors: X%)
- **CSAT Score:** [X]%
- **Response rate:** X%
- **Total responses:** X

### Trend
| Period | NPS | CSAT | Responses |
|--------|-----|------|-----------|

### Detractor Analysis
Top reasons for low scores:
1. [Theme] — X mentions — "[sample quote]"
2. [Theme] — X mentions — "[sample quote]"

### Promoter Highlights
What customers love:
1. [Theme] — X mentions — "[sample quote]"

### Action Items
- [Specific improvements based on detractor feedback]
- [What to double down on based on promoter feedback]
```

Quotes must be word for word from the responses. The skill sends nothing in Mode B and changes no accounts.
