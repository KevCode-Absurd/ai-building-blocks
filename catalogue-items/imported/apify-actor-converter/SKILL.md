---
name: apify-actorization
description: "Actorization converts existing software into reusable serverless applications compatible with the Apify platform. Actors are programs packaged as Docker images that accept well-defined JSON input, perform an action, and optionally produce structured JSON output."
risk: critical
source: community
date_added: "2026-09-04"
---

# Apify Actorization

Actorization converts existing software into reusable serverless applications compatible with the Apify platform. Actors are programs packaged as Docker images that accept well-defined JSON input, perform an action, and optionally produce structured JSON output.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code:** It can read your whole project and run the Apify command line tool for you.
- **Any AI that runs code and files:** The skill needs to run apify run and apify push, which a plain chat window cannot do.
<!-- /needs -->

## Quick Start

1. Run `apify init` in project root
2. Wrap code with SDK lifecycle (see language-specific section below)
3. Configure `.actor/input_schema.json`
4. Test with `apify run --input '{"key": "value"}'`
5. Deploy with `apify push`

## When to Use This Skill

- Converting an existing project to run on Apify platform
- Adding Apify SDK integration to a project
- Wrapping a CLI tool or script as an Actor
- Migrating a Crawlee project to Apify

## Inputs to Gather First

Before you change anything, make sure you have these. If one is missing, ask once. Do not guess.

- The project folder, or the script to convert.
- What the code reads in (web links, file paths, settings) and what it gives back (rows, files, messages).
- A small sample input that should work, for the Step 7 test.
- Confirmation that the person has an Apify account. Apify is a paid service, so tell them to check current plans on apify.com before Step 8.

This skill needs a coding AI that can read the project and run shell commands (`apify init`, `apify run`, `apify push`). In a plain chat window with no tools, give the code changes as text and list the commands for the person to run.

Never ask the person to paste a token into the chat.

## Prerequisites

Verify `apify` CLI is installed:

```bash
apify --help
```

If not installed:

```bash
brew install apify-cli

# Or: npm install -g apify-cli
# Or install from an official release package that your OS package manager verifies
```

Verify CLI is logged in:

```bash
apify info  # Should return your username
```

If not logged in, check if `APIFY_TOKEN` environment variable is defined. If not, ask the user to generate one at https://console.apify.com/settings/integrations, add it to their shell or secret manager without putting the literal token in command history, then run:

```bash
apify login
```

## Actorization Checklist

Copy this checklist to track progress:

- [ ] Step 1: Analyze project (language, entry point, inputs, outputs)
- [ ] Step 2: Run `apify init` to create Actor structure
- [ ] Step 3: Apply language-specific SDK integration
- [ ] Step 4: Configure `.actor/input_schema.json`
- [ ] Step 5: Configure `.actor/output_schema.json` (if applicable)
- [ ] Step 6: Update `.actor/actor.json` metadata
- [ ] Step 7: Test locally with `apify run`
- [ ] Step 8: Deploy with `apify push`

## Step 1: Analyze the Project

Before making changes, understand the project:

1. **Identify the language** - JavaScript/TypeScript, Python, or other
2. **Find the entry point** - The main file that starts execution
3. **Identify inputs** - Command-line arguments, environment variables, config files
4. **Identify outputs** - Files, console output, API responses
5. **Check for state** - Does it need to persist data between runs?

## Step 2: Initialize Actor Structure

Run in the project root:

```bash
apify init
```

This creates:
- `.actor/actor.json` - Actor configuration and metadata
- `.actor/input_schema.json` - Input definition for the Apify Console
- `Dockerfile` (if not present) - Container image definition

## Step 3: Apply Language-Specific Changes

Choose based on your project's language:

- **JavaScript/TypeScript**: See [js-ts-actorization.md](references/js-ts-actorization.md)
- **Python**: See [python-actorization.md](references/python-actorization.md)
- **Other Languages (CLI-based)**: See [cli-actorization.md](references/cli-actorization.md)

### Quick Reference

| Language | Install | Wrap Code |
|----------|---------|-----------|
| JS/TS | `npm install apify` | `await Actor.init()` ... `await Actor.exit()` |
| Python | `pip install apify` | `async with Actor:` |
| Other | Use CLI in wrapper script | `apify actor:get-input` / `apify actor:push-data` |

## Steps 4-6: Configure Schemas

See [schemas-and-output.md](references/schemas-and-output.md) for detailed configuration of:
- Input schema (`.actor/input_schema.json`)
- Output schema (`.actor/output_schema.json`)
- Actor configuration (`.actor/actor.json`)
- State management (request queues, key-value stores)

Validate schemas against `@apify/json_schemas` npm package.

## Step 7: Test Locally

Run the actor with inline input (for JS/TS and Python actors):

```bash
apify run --input '{"startUrl": "https://example.com", "maxItems": 10}'
```

Or use an input file:

```bash
apify run --input-file ./test-input.json
```

**Important:** Always use `apify run`, not `npm start` or `python main.py`. The CLI sets up the proper environment and storage.

## Step 8: Deploy

Stop and ask for a clear yes first. Pushing uploads the code to the person's Apify account.

```bash
apify push
```

This uploads and builds your actor on the Apify platform.

## Monetization (Optional)

After deploying, you can monetize your actor in the Apify Store. The recommended model is **Pay Per Event (PPE)**:

- Per result/item scraped
- Per page processed
- Per API call made

Configure PPE in the Apify Console under Actor > Monetization. Charge for events in your code with `await Actor.charge('result')`.

Other options: **Rental** (monthly subscription) or **Free** (open source).

## Pre-Deployment Checklist

- [ ] `.actor/actor.json` exists with correct name and description
- [ ] `.actor/actor.json` validates against `@apify/json_schemas` (`actor.schema.json`)
- [ ] `.actor/input_schema.json` defines all required inputs
- [ ] `.actor/input_schema.json` validates against `@apify/json_schemas` (`input.schema.json`)
- [ ] `.actor/output_schema.json` defines output structure (if applicable)
- [ ] `.actor/output_schema.json` validates against `@apify/json_schemas` (`output.schema.json`)
- [ ] `Dockerfile` is present and builds successfully
- [ ] `Actor.init()` / `Actor.exit()` wraps main code (JS/TS)
- [ ] `async with Actor:` wraps main code (Python)
- [ ] Inputs are read via `Actor.getInput()` / `Actor.get_input()`
- [ ] Outputs use `Actor.pushData()` or key-value store
- [ ] `apify run` executes successfully with test input
- [ ] `generatedBy` is set in actor.json meta section

## Apify MCP Tools

If MCP server is configured, use these tools for documentation:

- `search-apify-docs` - Search documentation
- `fetch-apify-docs` - Get full doc pages

Otherwise, the MCP Server url: `https://mcp.apify.com/?tools=docs`.

## Resources

- [Actorization Academy](https://docs.apify.com/academy/actorization) - Comprehensive guide
- [Apify SDK for JavaScript](https://docs.apify.com/sdk/js) - Full SDK reference
- [Apify SDK for Python](https://docs.apify.com/sdk/python) - Full SDK reference
- [Apify CLI Reference](https://docs.apify.com/cli) - CLI commands
- [Actor Specification](https://raw.githubusercontent.com/apify/actor-whitepaper/refs/heads/master/README.md) - Complete specification

## What You Hand Back

When the work is done, reply with:

1. Project check: language, starting file, what it takes in, what it gives back.
2. Files added or changed: one line per file saying what changed.
3. Local test: the `apify run` command and sample input you used, and whether the results look right.
4. Pre-deployment checklist: which items pass and which are open.
5. Next step: run `apify push`, then open the Actor in the Apify Console to test a run and set a schedule.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [RoadRunner traffic test scenario writer](https://useaiblocks.com/skills/driving-test-scenario-writer). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
