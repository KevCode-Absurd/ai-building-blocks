---
name: developer-onboarding
description: "Get developers to \"Hello World\" fast with optimized quickstarts, tutorials, and sample apps."
risk: critical
source: https://github.com/jonathimer/devmarketing-skills/tree/main/skills/developer-onboarding
source_repo: jonathimer/devmarketing-skills
source_type: community
date_added: 2026-07-01
license: MIT
license_source: https://github.com/jonathimer/devmarketing-skills/blob/main/LICENSE
---

# Developer Onboarding

Get a new developer from sign-up to a first working result as fast as you can, then lead them to deeper use of your product.

## Detailed Guide

Read [the detailed guide](references/detailed-guide.md) before executing this skill. For focused work, load the relevant sections; for end-to-end work, read the guide completely. The guide's time bands, benchmarks, funnel numbers and named-company examples are the original author's rules of thumb, not checked data. Never state them as facts.

## When to Use

- You are launching an API, SDK or developer tool and need a first-run guide.
- Your current quickstart takes many steps before anything works.
- You want a sample app that new developers can copy and run.
- Developers read your docs but do not come back after day one.

## When Not to Use

- You need to find out why developers drop off before a first call: use the Developer onboarding improver.
- You need reference docs for every endpoint: use the Developer docs writer.
- You need a setup wizard inside your product: use the First-run wizard designer.
- You are not sure how your product works yet. This skill cannot write a guide for something it has not been told about.

## Inputs

Ask once for anything missing. If the person cannot answer, mark it MISSING in the output and carry on. Never invent commands, package names, endpoints, keys, versions or output.

1. What the product is and what a developer does with it.
2. The language or framework the developers use.
3. How sign-up and API keys work today (self-serve, approval, sandbox or test mode).
4. The real install command, a real example request and the real response, if the person has them. Without them, write steps with `<PLACEHOLDER>` values and flag them.
5. Optional: the current quickstart or docs, and what developers get stuck on.

## Output

Return these sections, in this order. Keep the whole answer under about 1,200 words, and keep code short.

1. **First value moment**: one sentence on what the developer sees when it works (a response with real data, a live URL, a test charge). Tied to this product.
2. **Quickstart**: a title with the goal, a "what you will build" line, prerequisites with a check command where one exists, then 3 to 5 numbered steps (install, set the key, make the first request, see the result), the expected output, and "next steps" with two links to write.
3. **Tutorial outline**: 3 to 5 sections for the second session, each with a goal and what the reader builds. It must lead on to deeper features.
4. **Sample app plan**: a minimal example (one file), a starter template and, if worth it, a production template. For each: purpose, files, how long to run it. Say which to build first.
5. **Patterns to avoid**: 3 to 5 items from the list below that this product is most at risk of, each with the fix.
6. **Missing**: every input marked MISSING and every placeholder the person must fill in.

## Rules

- Mark every code block "not run: check before you publish". You cannot run the code.
- Put prerequisites before step 1, not inside a later step.
- Show the language the developers use first. Give other install commands as one-line alternatives.
- Put the copy-paste working example before any background. Move theory to "next steps".
- Write error messages that say what is wrong and how to fix it.

## Patterns to borrow

These are the original author's picks from developer tools they admire. We have not checked them for any company.

- Test keys visible right after sign-up.
- A first task that works with no setup beyond one install.
- A live result, such as a preview URL, within seconds.
- Language-specific code samples.
- Error messages that say how to fix the problem.
- A progress list that shows how far the reader is.

## Patterns to avoid

- Multi-step wizards that cannot be skipped.
- "Complete your profile" blocking access to code.
- A quickstart that needs a search to find.
- A quickstart that assumes too much setup.
- Error messages without guidance.

## Limitations

- Use this skill only when the task clearly matches its upstream source and local project context.
- Verify commands, generated code, dependencies, credentials, and external service behavior before applying changes.
- Do not treat examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.
