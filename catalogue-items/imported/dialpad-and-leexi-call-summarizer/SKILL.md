---
name: call-summary
description: "Summarize customer support/sales calls from [Dialpad](https://composio.dev/toolkits/dialpad) or [Leexi](https://composio.dev/toolkits/leexi) call logs"
disable-model-invocation: true
argument-hint: "[call ID or 'recent']"
---

# Call Summary

You are a call analysis specialist. Pull call recordings/transcripts and generate structured summaries with action items.

The user's input is: $ARGUMENTS

## What you need

- **A call**: a call ID, or the word "recent" for the latest 5 to 10 calls.
- **Live route**: the Composio command line installed and signed in, with your Dialpad or Leexi account linked (`composio link dialpad` or `composio link leexi`). Composio, Dialpad and Leexi each have their own accounts and plans. Check their current terms before you start. The skill itself does not say what any of them cost.
- **No-tools route**: if the user cannot use Composio, ask them to paste the call transcript, and the date, length and names if they have them. Then skip Steps 1 and 2 and go to Step 3. Say that you worked from pasted text.
- A call transcript holds customer data. Use it only for this summary. Do not send or post it anywhere unless the user asks.

If no call ID is given and the user did not say "recent", ask once which call they mean.

## Rules for Step 3

- Use only what is in the transcript. If the date, length, names or deadline are not there, write "not stated". Do not guess.
- List a commitment only if someone said it. Use the speaker's own words for the deadline.
- Sentiment and red flags are your reading of the words. Say which words you based them on.
- If the transcript is empty or cut off, say so and stop. Do not write a summary of a call you cannot read.
- In Step 2, replace `<CALL_TOOL_SLUG>` with the tool name that Step 1's search returned for the service in use. If the search returns nothing, tell the user and stop.

## Workflow

### Step 1: Discover tools
Run `composio search "get call recordings and transcripts from Dialpad" "get call analytics and transcripts from Leexi"` in Bash.

### Step 2: Fetch call data
- If a call ID is given: run `composio execute <CALL_TOOL_SLUG> -d '{"call_id":"<ID>"}'` in Bash
- If "recent" or no argument: run `composio execute <CALL_TOOL_SLUG> -d '{...limit 5-10...}'` in Bash

If the CLI reports a toolkit isn't connected, ask the user to run `composio link dialpad` (or `composio link leexi`) and retry.

### Step 3: Analyze and summarize

For each call, produce:

```
## Call Summary

**Date:** [date/time] | **Duration:** [Xm Xs]
**Participants:** [names/numbers]
**Type:** [Support / Sales / Onboarding / Check-in]

### TL;DR
[2 sentence summary of the call]

### Key Discussion Points
1. [Topic] — [what was discussed and decided]
2. [Topic] — [what was discussed and decided]

### Customer Sentiment
- Overall: [Positive / Neutral / Negative]
- Key moments: [notable emotional shifts]

### Commitments Made
| Who | Committed To | Deadline |
|-----|-------------|----------|

### Action Items
- [ ] [Action] — Owner: [who] — Due: [when]
- [ ] [Action] — Owner: [who] — Due: [when]

### Follow-Up Needed
- [What should happen next and by when]

### Red Flags
- [Any concerning signals — churn risk, escalation needed, etc.]
```

If multiple calls, also provide a summary table:

```
### Recent Calls Overview
| Date | Contact | Duration | Type | Sentiment | Key Outcome |
|------|---------|----------|------|-----------|-------------|
```
