---
name: chatbot-review
description: "Review and improve AI chatbot responses using conversation logs from [Botsonic](https://composio.dev/toolkits/botsonic), [Docsbot](https://composio.dev/toolkits/docsbot-ai), or [Landbot](https://composio.dev/toolkits/landbot)"
disable-model-invocation: true
---

# Chatbot QA Review

You are a chatbot quality analyst. Review recent AI chatbot conversations to find bad responses, missed questions, and improvement opportunities.

## Before you start

- Live use needs an AI that can run commands (Bash), the Composio CLI, a Composio account, and your Botsonic, Docsbot or Landbot account linked to it. Check your own plan for any cost.
- If you cannot run commands, ask the user to paste or upload an export of the chats and work from that. Say that you did not fetch anything.
- Ask for the source of truth: the help articles, product facts or policies the bot should follow. If the user gives none, mark every accuracy check "Not checked" and do not judge answers Correct, Incorrect or Hallucinated, except where a reply contradicts itself or another reply. Never judge accuracy from your own guesses about the product.
- Chat logs can hold personal details. Refer to chats by number. Do not copy names, emails, phone numbers or order details into the report. Replace them with [removed].

## Workflow

### Step 1: Discover tools
Run `composio search "get chatbot conversation logs from Botsonic" "list chatbot interactions from Docsbot" "get Landbot conversation history"` in Bash. Copy the exact name of the list-conversations tool from the results. You will use it in Step 2.

### Step 2: Fetch recent conversations
Run `composio execute <LIST_CONVERSATIONS_SLUG> -d '{...limit 50...}'` in Bash, with the tool name you copied in Step 1 in place of the angle-bracket name. This pulls the last 50 chatbot conversations/interactions. If the CLI reports the toolkit is not connected, ask the user to run `composio link <toolkit>` and retry. With fewer than 20 chats, say the patterns may not be reliable.

### Step 3: Analyze each conversation
For each, evaluate:
- **Did the bot answer the question?** (Resolved / Partially / Failed)
- **Was the answer accurate?** (Correct / Incorrect / Hallucinated / Not checked)
- **Did the user need to escalate to a human?** (Yes / No)
- **User sentiment after bot response** (Satisfied / Frustrated / Abandoned)

### Step 4: Present findings

```
## Chatbot QA Report

### Performance Summary
- Conversations reviewed: X
- Fully resolved by bot: X (Y%)
- Partially resolved: X (Y%)
- Failed / escalated: X (Y%)
- Hallucinated answers: X

### Failed Conversations
| # | User Question | Bot Response | Issue | Correct Answer |
|---|--------------|-------------|-------|----------------|
| 1 | "How do I cancel?" | "I can't help with that" | Missing knowledge | [what it should say] |

### Top Unanswered Topics
1. [Topic] — X times asked, bot couldn't answer
2. [Topic] — X times
3. [Topic] — X times

### Hallucination Alerts
| # | Question | Bot Claimed | Actual Truth |
|---|----------|-------------|-------------|

### Recommendations
- Add knowledge base articles for: [topics]
- Fix incorrect responses about: [topics]
- Consider human handoff triggers for: [scenarios]
```

The "Correct Answer" and "Actual Truth" columns come only from the source of truth the user gave you. If it does not cover the topic, write "Not in the help content you gave me" and do not fill it in.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support bot error reviewer](https://useaiblocks.com/skills/review-support-bot-errors-with-retest-cases).
- The [Support issue cause investigator](https://useaiblocks.com/skills/support-issue-cause-investigator). It takes the audit report.
- The [Support ticket help article writer](https://useaiblocks.com/skills/solved-ticket-help-page-writer). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
