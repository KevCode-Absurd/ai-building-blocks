---
name: osterwalder-canvas-architect
description: "Iterative consultant agent for building and validating logically consistent 9-block Business Model Canvases."
category: business-strategy
risk: safe
source: self
source_type: self
date_added: "2026-04-17"
author: justmiroslav
tags: [business-model, osterwalder, strategy, bmc]
tools: [claude, cursor, gemini]
---

# Osterwalder Business Model Canvas Architect

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your idea** (yours): the product, app, business or project idea, in a line or a short paragraph.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your idea. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview
A specialized architectural tool for designing and auditing business models using Alexander Osterwalder’s 9-block framework. It focuses on the internal logical "lock" between value propositions, customer segments, and cost structures.

## When to Use This Skill
- Use when designing a new business architecture from scratch.
- Use to audit an existing business for revenue-cost alignment and value delivery gaps.
- Use when a pivot is required and the core business logic needs re-validation.

## How It Works
### Step 1: Core Value Proposition & Customer Lock
The agent iteratively defines the Value Proposition and Customer Segments to ensure they are logically aligned.
### Step 2: Structural Design
The agent builds out the Channels, Relationships, Key Activities, Resources, and Partners.
### Step 3: Financial & Consistency Check
Final validation to ensure every activity is accounted for in the Cost Structure and revenue streams align with customer segments.

## When Not to Use This Skill
- You need proof that people will pay: talk to customers first, or use `business-idea-killer`.
- You need a profit and loss forecast or a legal structure: ask an accountant or a lawyer.

## What next
Test the riskiest block with real customers. Use `market-size-estimator` to size the market, and move any cost numbers into a spreadsheet.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Second location readiness checker](https://useaiblocks.com/skills/second-location-check). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Examples

### Example 1: Subscription-based SaaS (Runnable)
"Draft a Business Model Canvas for an AI-powered agri-tech platform that provides soil analysis for large-scale farmers on a subscription basis. Focus on how the Key Resources (IoT/AI) drive the Cost Structure."

### Example 2: Premium Retail Pivot
"Analyze the consistency of a direct-to-consumer organic dairy brand. Ensure the 'Premium Identity' value proposition aligns with the high-touch marketing activities and cost structure."

## Best Practices
- ✅ Prioritize the Value Proposition / Customer Segment lock before filling other blocks.
- ✅ Ensure every "Key Activity" has a corresponding entry in the "Cost Structure".
- ❌ Avoid filling all 9 blocks in one turn; use an iterative approach to maintain logical depth.

## Limitations
- **Advisory Only**: This tool facilitates structural drafting but does not validate market demand or the actual financial viability of the model.
- **Execution-Blind**: The consistency check is purely logical and cannot predict operational execution bottlenecks.
- **Out-of-Scope**: This skill does not provide detailed financial forecasting (P&L) or specific legal entity structuring.
