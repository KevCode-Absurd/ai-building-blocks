---
name: expo-cicd-workflows
description: Helps understand and write EAS workflow YAML files for Expo projects. Use this skill when the user asks about CI/CD or workflows in an Expo or EAS context, mentions .eas/workflows/, or wants help with EAS build pipelines or deployment automation.
risk: critical
source: https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-cicd-workflows
source_repo: expo/skills
source_type: official
date_added: 2026-07-01
license: MIT
license_source: https://github.com/expo/skills/blob/main/LICENSE
---

# EAS Workflows Skill

> Added by AI Blocks. Licence: this skill follows the MIT licence in its original header and the included LICENSE file. Keep the source notices and author credits. We also retain the collection's LICENSE-CONTENT file.

## When to Use

Use this skill when you need helps understand and write EAS workflow YAML files for Expo projects. Use this skill when the user asks about CI/CD or workflows in an Expo or EAS context, mentions .eas/workflows/, or wants help with EAS build pipelines or deployment automation.


Help developers write and edit EAS CI/CD workflow YAML files.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code:** It can run the fetch and validate scripts and write to your project folder.
- **EAS from Expo:** It runs the workflow file, and its build service may have plan limits.
<!-- /needs -->

## What you need

Ask once for anything not given:

- What should happen and when: builds, tests, preview builds, store submission.
- The platforms: iOS, Android or both.
- The trigger: a push to a branch, a pull request, a tag or a manual run.
- An existing workflow file to edit (optional).

Needs Node, internet access and an Expo account. The helper scripts in `scripts/` download files and run on the person's machine, so run them in a throwaway copy of the project or a sandbox, and have the person read `scripts/fetch.js` and `scripts/validate.js` first. EAS builds can be limited or cost money on the person's Expo plan, so say so before they run it. If you cannot run code or reach the internet, still write the file, mark it `NOT VALIDATED`, and tell the person to run the validator themselves.

**Ask before anything costs money or goes live.** Writing the file changes nothing. The workflow can later start paid EAS builds or send a build to the App Store or Google Play. Before you write a job that submits to a store, or tell the user to run a paid build, show them the job list and wait for a clear yes. Never run a store submission against production store accounts yourself.

## What you hand back

1. The workflow file, with its path under `.eas/workflows/`.
2. The validation result: passed, errors fixed, or `NOT VALIDATED` with the reason.
3. One line per job: what it does and what it needs (credentials, secrets, accounts).
4. Before you run it: accounts, credentials and plan limits to check.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Expo update health checker](https://useaiblocks.com/skills/app-update-health-checker).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If something is missing

Write `MISSING: <what>` and ask once. Never guess job types, runner names or option values. Take them from the fetched schema only. If the request is not about Expo or EAS, say so and stop.

## Reference Documentation

Fetch these resources before generating or validating workflow files. First resolve this skill's directory, then use the fetch script in its `scripts/` directory. It is implemented using Node.js and caches responses using ETags for efficiency:

```bash
# Fetch resources
node <skill-dir>/scripts/fetch.js <url>
```

1. **JSON Schema** — https://api.expo.dev/v2/workflows/schema
   - It is NECESSARY to fetch this schema
   - Source of truth for validation
   - All job types and their required/optional parameters
   - Trigger types and configurations
   - Runner types, VM images, and all enums

2. **Syntax Documentation** — https://raw.githubusercontent.com/expo/expo/refs/heads/main/docs/pages/eas/workflows/syntax.mdx
   - Overview of workflow YAML syntax
   - Examples and English explanations
   - Expression syntax and contexts

3. **Pre-packaged Jobs** — https://raw.githubusercontent.com/expo/expo/refs/heads/main/docs/pages/eas/workflows/pre-packaged-jobs.mdx
   - Documentation for supported pre-packaged job types
   - Job-specific parameters and outputs

Do not rely on memorized values; these resources evolve as new features are added.

## Workflow File Location

Workflows live in `.eas/workflows/*.yml` (or `.yaml`).

## Top-Level Structure

A workflow file has these top-level keys:

- `name` — Display name for the workflow
- `on` — Triggers that start the workflow (at least one required)
- `jobs` — Job definitions (required)
- `defaults` — Shared defaults for all jobs
- `concurrency` — Control parallel workflow runs

Consult the schema for the full specification of each section.

## Expressions

Use `${{ }}` syntax for dynamic values. The schema defines available contexts:

- `github.*` — GitHub repository and event information
- `inputs.*` — Values from `workflow_dispatch` inputs
- `needs.*` — Outputs and status from dependent jobs
- `jobs.*` — Job outputs (alternative syntax)
- `steps.*` — Step outputs within custom jobs
- `workflow.*` — Workflow metadata

## Generating Workflows

When generating or editing workflows:

1. Fetch the schema to get current job types, parameters, and allowed values
2. Validate that required fields are present for each job type
3. Verify job references in `needs` and `after` exist in the workflow
4. Check that expressions reference valid contexts and outputs
5. Ensure `if` conditions respect the schema's length constraints

## Validation

After generating or editing a workflow file, validate it against the schema:

```sh
# Install dependencies if missing. AI Blocks pinned scripts/package.json to exact versions
# (ajv 8.17.1, ajv-formats 3.0.1, js-yaml 4.1.0). Ask the user to read scripts/fetch.js and
# scripts/validate.js first, because they download files and run on the user's machine
[ -d "<skill-dir>/scripts/node_modules" ] || npm install --prefix <skill-dir>/scripts --ignore-scripts

node <skill-dir>/scripts/validate.js <workflow.yml> [workflow2.yml ...]
```

The validator fetches the latest schema and checks the YAML structure. Fix any reported errors before considering the workflow complete.

## Answering Questions

When users ask about available options (job types, triggers, runner types, etc.), fetch the schema and derive the answer from it rather than relying on potentially outdated information.

## Limitations

- Use this skill only when the task clearly matches its upstream product or API scope.
- Verify commands, API behavior, pricing, quotas, credentials, and deployment effects against current official documentation before making changes.
- Do not treat generated examples as a substitute for environment-specific tests, security review, or user approval for destructive or costly actions.
