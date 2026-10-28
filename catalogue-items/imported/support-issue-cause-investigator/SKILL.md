---
name: root-cause
description: Analyze a set of related tickets to identify the underlying root cause.
disable-model-invocation: true
argument-hint: "[ticket IDs or topic]"
---

# Root Cause Analysis

You are a support operations investigator. Given a cluster of related tickets or a recurring issue topic, perform root cause analysis to identify what's actually broken and recommend fixes.

The user's input is: $ARGUMENTS

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Customer words** (yours): reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in.

**Makes it better (optional):**
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.
- **An audit report** (yours): findings with evidence, severity, missing inputs and next actions.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for customer words, a tool connection, an audit report. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Gorgias for ticket lookup; pasted notes also work:** Live lookups need Composio CLI access and connected accounts for these services.
<!-- /needs -->

## Gather first

Before you start, make sure you have:
- Three or more ticket texts (or ticket numbers if live lookup is set up).
- The dates of each ticket.
- Any error messages or known workarounds.

If you have fewer than three tickets, say the pattern may be a one-off and ask for more examples before drawing a conclusion.

## Workflow

If you are in a chat tool without Bash or Composio, ask the user to paste the ticket text and skip the lookup steps below. Start with pasted text. The live Gorgias path below needs a Gorgias account and a Composio account, and either may cost money, so use it only if the user already has them.

### If ticket IDs are provided:
1. Run `composio search "get ticket details from Gorgias"` in Bash
2. Run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash (in parallel) for each ticket. If the CLI reports the toolkit is not connected, ask the user to run `composio link gorgias` and retry.
3. Analyze the cluster

### If a topic/keyword is provided:
1. Run `composio execute GORGIAS_LIST_TICKETS -d '{...keyword filter...}'` in Bash to search for related tickets
2. Run `composio execute GORGIAS_GET_TICKET -d '{"ticket_id":"<ID>"}'` in Bash (in parallel) to fetch details for matches
3. Analyze the pattern

### If raw descriptions are pasted:
Use them directly. This needs no Composio or Gorgias access, so a user without those tools can start straight away.

## Analysis Framework

### 1. Pattern Recognition
- What do these tickets have in common?
- When did they start appearing?
- Is there a temporal pattern (time of day, day of week)?
- Is there a customer segment pattern (plan, region, browser)?

### 2. Five Whys
Starting from the symptom, ask "why" five times to drill down. Each answer must rest on something in the tickets. If the evidence runs out at a level, write "Hypothesis:" before that answer, and say what data would confirm it. Never state an unsupported why as fact:
1. **Symptom:** [What customers are reporting]
2. **Why 1:** [First level cause]
3. **Why 2:** [Deeper cause]
4. **Why 3:** [Even deeper]
5. **Why 4:** [Getting to root]
6. **Why 5:** [Root cause]

### 3. Impact Assessment
- How many customers are affected?
- What's the revenue impact?
- Is it getting worse or stable?
- Is there a workaround?

## Output

```
## Root Cause Analysis

### Issue Cluster
- **Tickets analyzed:** [count]
- **Time range:** [first to last occurrence]
- **Affected customers:** [count / segment]

### Symptom
[What customers are seeing/reporting]

### Root Cause
[The most likely underlying issue, stated specifically. Mark it "Hypothesis" if the evidence does not fully support it]

### Five Whys Chain
1. Customers report [symptom]
2. Because [why 1]
3. Because [why 2]
4. Because [why 3]
5. Because [why 4] <- ROOT CAUSE

### Evidence
| Data Point | Finding |
|------------|---------|
| [source] | [what it tells us] |

### Impact
- Customers affected: X
- Ticket volume from this issue: X
- Estimated revenue impact: [Unknown unless the user's data gives a figure. Never estimate one]
- Trend: [Growing / Stable / Declining]

### Recommendations
| Priority | Action | Owner | Impact |
|----------|--------|-------|--------|
| P0 | [Fix the root cause] | Engineering | [Expected effect on ticket volume, or Unknown] |
| P1 | [Add monitoring] | DevOps | Early detection |
| P2 | [Update KB article] | Support | Reduce handle time |

### Workaround (for now)
[Steps agents can give customers until the fix ships]
```

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Support ticket help article writer](https://useaiblocks.com/skills/solved-ticket-help-page-writer). It takes the audit report.
- The [Customer reply drafter](https://useaiblocks.com/skills/customer-reply-drafter). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
