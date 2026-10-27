---
name: zapier-make-patterns
description: No-code automation democratizes workflow building. Zapier and Make
  (formerly Integromat) let non-developers automate business processes without
  writing code. But no-code doesn't mean no-complexity - these platforms have
  their own patterns, pitfalls, and breaking points.
risk: critical
source: vibeship-spawner-skills (Apache 2.0)
date_added: 2026-02-27
---

# Zapier & Make Patterns

No-code automation democratizes workflow building. Zapier and Make (formerly
Integromat) let non-developers automate business processes without writing
code. But no-code doesn't mean no-complexity - these platforms have their
own patterns, pitfalls, and breaking points.

This skill covers when to use which platform, how to build reliable
automations, and when to graduate to code-based solutions. Key insight:
Zapier optimizes for simplicity and integrations (the author's app count was 7000+; check Zapier's own list), Make
optimizes for power and cost-efficiency (visual branching, operations-based
pricing).

Critical distinction: No-code works until it doesn't. Know the limits.

## How to plan (added by AI Blocks)

1. Get the task in plain words: the apps, how often it runs, how much data moves, and the budget. If you already have a sketched automation flow, use its trigger and steps as the task.
2. Pick the tool. Zapier suits a simple flow and the widest list of apps. Make suits branching and lower cost per step. Say why, using the task's own details.
3. Set the trigger: the one event that starts the flow.
4. Add filters so unwanted runs stop early.
5. List the actions in order, with the fields each one needs. Give every step a clear name.
6. Say how to test on real sample data before turning it on, and what to watch in the first runs.
7. Say when to move to code: high volume, complex logic or slow steps.

Return every plan under these headings, in this order: Tool choice, Trigger and filters, Actions in order, Tests and first runs, Switch-to-code check.

App counts and pricing change over time. Tell the person to check the vendor's pricing page before they decide, and never state a price you have not been given.

## Detailed Guide

The detailed guide ([references/detailed-guide.md](references/detailed-guide.md)) holds the full patterns and the sharp edges. A plan-only run needs only the "How to plan" steps above. Before you tell someone how to build a flow with branching, error handling, loops, batches, schedules or logins, read the matching sections of the guide (Conditional Branching, Error Handling, Batch Processing, Scheduled Automation, Sharp Edges) and follow its safety and validation notes.

## Zapier Example
"""
Zap Name: "Gmail New Email → Todoist Task"

TRIGGER: Gmail - New Email
  - From: specific-sender@example.com
  - Has attachment: yes

ACTION: Todoist - Create Task
  - Project: Inbox
  - Content: {{Email Subject}}
  - Description: From: {{Email From}}
  - Due date: Tomorrow
"""

## Make Example
"""
Scenario: "Gmail to Todoist"

[Gmail: Watch Emails] → [Todoist: Create a Task]

Gmail Module:
  - Folder: INBOX
  - From: specific-sender@example.com

Todoist Module:
  - Project ID: (select from dropdown)
  - Content: {{1.subject}}
  - Due String: tomorrow
"""

### Best Practices:
- Use descriptive Zap/Scenario names
- Test with real sample data
- Use filters to prevent unwanted runs

### Multi-Step Sequential Pattern

Chain of actions executed in order

**When to use**: Multi-app workflows, data enrichment pipelines

# MULTI-STEP SEQUENTIAL:

"""
[Trigger] → [Action 1] → [Action 2] → [Action 3]
Each step's output available to subsequent steps
"""

## When to Use
- User mentions or implies: zapier
- User mentions or implies: make
- User mentions or implies: integromat
- User mentions or implies: zap
- User mentions or implies: scenario
- User mentions or implies: no-code automation
- User mentions or implies: trigger action
- User mentions or implies: workflow automation
- User mentions or implies: connect apps
- User mentions or implies: automate

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

## Licence note

The header above gives the source as Apache 2.0 (vibeship-spawner-skills). The collection this copy came from lists its written content as CC BY 4.0 (see `LICENSE-CONTENT`). We share this copy under CC BY 4.0. Keep the credit to the author and sickn33.
