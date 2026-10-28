---
name: gemini-deep-research
description: "Run autonomous multi-step research with Google's Gemini Deep Research Agent: kick off a query, poll progress, and collect a cited report for market analysis or literature reviews."
category: research
risk: critical
source: https://github.com/sanjay3290/ai-skills/tree/main/skills/deep-research
source_repo: sanjay3290/ai-skills
source_type: community
date_added: "2026-07-09"
author: sanjay3290
tags: [research, gemini, google, reports]
tools: [claude, cursor, gemini]
license: "Apache-2.0"
license_source: "https://github.com/sanjay3290/ai-skills/blob/main/LICENSE"
---

# Gemini Deep Research Skill

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

- Use when a question needs autonomous multi-step research with cited sources (market analysis, literature reviews, competitive scans)
- Use when you want to start a Gemini Deep Research run, poll its progress, and collect the final report
- Use when a quick web search is not enough and a structured, source-grounded report is required

Run autonomous research tasks that plan, search, read, and synthesize information into comprehensive reports.

## Requirements

- Python 3.8+
- httpx: `pip install -r requirements.txt`
- GEMINI_API_KEY environment variable

## Setup

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Set the environment variable:
   ```bash
   export GEMINI_API_KEY=your-api-key-here
   ```
   Or create a `.env` file in the skill directory.

## Safety Gate

Before starting a research job, show the user the exact query, the fact that it will be sent
to Google's Gemini service, the expected cost range, and the output destination. Start a job
only after explicit approval. Do not include private workspace material, credentials, personal
data, or confidential customer information in a query.

## Usage

### Start a research task
```bash
python3 scripts/research.py --query "Research the history of Kubernetes"
```

### With structured output format
```bash
python3 scripts/research.py --query "Compare Python web frameworks" \
  --format "1. Executive Summary\n2. Comparison Table\n3. Recommendations"
```

### Stream progress in real-time
```bash
python3 scripts/research.py --query "Analyze EV battery market" --stream
```

### Start without waiting
```bash
python3 scripts/research.py --query "Research topic" --no-wait
```

### Check status of running research
```bash
python3 scripts/research.py --status <interaction_id>
```

### Wait for completion
```bash
python3 scripts/research.py --wait <interaction_id>
```

### Continue from previous research
```bash
python3 scripts/research.py --query "Elaborate on point 2" --continue <interaction_id>
```

### List recent research
```bash
python3 scripts/research.py --list
```

## Output Formats

- **Default**: Human-readable markdown report
- **JSON** (`--json`): Structured data for programmatic use
- **Raw** (`--raw`): Unprocessed API response

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Research project runner](https://useaiblocks.com/skills/research-project-runner). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Cost & Time

| Metric | Value |
|--------|-------|
| Time | 2-10 minutes per task |
| Cost | $2-5 per task (the author's estimate, from an unstated date; check Google's current Gemini API prices before approving a run) |
| Token usage | ~250k-900k input, ~60k-80k output |

## Best Use Cases

- Market analysis and competitive landscaping
- Technical literature reviews
- Due diligence research
- Historical research and timelines
- Comparative analysis (frameworks, products, technologies)

## Workflow

1. User requests research → Run `--query "..."`
2. Inform user of estimated time (2-10 minutes)
3. Monitor with `--stream` or poll with `--status`
4. Return formatted results
5. Use `--continue` for follow-up questions

## Exit Codes

- **0**: Success
- **1**: Error (API error, config issue, timeout)
- **130**: Cancelled by user (Ctrl+C)

## Limitations

- Each research job is a paid, third-party API request; costs and availability can change, and
  the listed estimate is not a spending authorization.
- Reports may contain incomplete, stale, or incorrect citations. Verify consequential claims
  against primary sources.
- This skill cannot guarantee that a prompt is safe to disclose; redact proprietary or personal
  material before requesting user approval.
- An API key must remain local and must never be committed, printed, or sent in a query.

Changed by AI Blocks (2026-10-28): gave it a plain name and added Before you start and After this sections that link to other AI Blocks steps.
