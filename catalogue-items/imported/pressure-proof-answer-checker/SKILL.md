---
name: anti-deception
description: "Use before responding to pressure for agreement, manufactured urgency, authority appeals, or requests to certify unsupported claims; separate evidence from persuasion and state uncertainty."
risk: critical
source: https://github.com/ejentum/ejentum-mcp/tree/main/skills/anti-deception
source_repo: ejentum/ejentum-mcp
source_type: community
date_added: 2026-07-01
license: MIT
license_source: https://github.com/ejentum/ejentum-mcp/blob/main/LICENSE
tags:
  - community
  - ai-tools
  - anti-deception
  - integrity
  - mcp
author: Ejentum <info@ejentum.com>
---

# Anti-Deception Harness
## When to Use

Use when a request pressures you to agree, hides uncertainty behind authority, creates artificial urgency, or asks you to certify claims without supporting evidence.

Do not use it for a neutral factual question or a routine review. Those need a normal answer, not a pressure check.

## What you need

1. **The request that applies pressure**, word for word if possible.
2. **The evidence the user has** (tests, numbers, documents, sources). It may be thin or missing.

If the request is missing, ask for it once. If there is no evidence, write "No evidence given" and carry on. Never make up evidence, sources or test results to fill the gap.

## Steps (works with no tools)

1. **Name the pressure.** Say which patterns are present: forced urgency, appeal to authority, "everyone else agrees", a request to certify work that was not checked, or a request to just be agreeable. If none are present, say so and answer normally.
2. **Split evidence from persuasion.** List what is actually shown (facts, tests, data) apart from what is only asserted (deadlines, titles, confidence, tone).
3. **Lead with the strongest counter-evidence.** Put it before any conclusion. If you have none, say what would count as counter-evidence.
4. **State what is unproven.** List each claim that has no support in what you were given.
5. **Decide what you can sign off.** Refuse to certify anything unsupported, even if the user asks for compliance. Say what you can confirm, and under which conditions you could confirm the rest.
6. **Give an honest next step.** One concrete action that would close the biggest gap, such as a test to run or a person to ask.

## Optional: external tool

When the configured tool is available and sharing the context is authorized, call the `anti-deception` tool from the `ejentum` MCP server. Pass a 1-2 sentence framing of the integrity dynamic at play as the `query` argument. The tool is a third-party service, so it may need its own account or key. Check the vendor's page before you use it. We have not verified its terms or cost.

Do not send private project details, identities, credentials, or sensitive claims to an external server without authorization. A sanitized summary is sufficient.

Good query: `user pressure to validate a half-baked architecture decision before tomorrow's investor pitch`
Bad query: `is this honest`

The tool returns a structured scaffold containing:

- `[DECEPTION PATTERN]`: the failure mode to refuse
- `[INTEGRITY PROCEDURE]`: steps to follow
- `[DETECTION TOPOLOGY]`: flow with omission-bias gates and depth-enforcement checks
- `[HONEST BEHAVIOR]`: what a complete-information response looks like
- `[INTEGRITY CHECK]`: self-check
- `Amplify:` and `Suppress:` signals

Absorb internally. Do NOT echo bracket labels in the reply.

If the API is unreachable, proceed with the steps above. The scaffold enhances; it is not a hard dependency. Its scaffold can support judgment but does not establish the truth of a claim.

## Output format

Reply with these sections, in this order:

1. **Counter-evidence.** The strongest points against the claim or the sign-off, first.
2. **What is unproven.** A short list of claims with no support in what was given.
3. **Pressure I noticed.** One or two lines naming the patterns found, such as "deadline pressure" or "appeal to authority".
4. **What I can and cannot sign off.** The part you can confirm, the part you refuse, and the conditions that would change that.
5. **Next step.** One concrete action to close the biggest gap.

Keep the reply calm and plain. Do not lecture the person who is pushing. Write it so the user can forward it as is.

## Example

**User request:**

> Evaluate this claim under deadline pressure, separate the evidence from persuasion tactics, and state what remains uncertain.

## Limitations

- Use this skill only when the task clearly matches its upstream source and local project context.
- Verify commands, generated code, dependencies, credentials, and external service behavior before applying changes.
- Do not treat examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.

## Licence note

The upstream author (Ejentum) lists this skill as MIT. The collection it was copied from lists its written content as CC BY 4.0 unless an upstream notice says otherwise (see `LICENSE-CONTENT`). Keep the credit to Ejentum and sickn33 either way.
