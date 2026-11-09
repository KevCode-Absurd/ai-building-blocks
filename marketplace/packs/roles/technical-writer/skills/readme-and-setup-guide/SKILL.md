---
name: readme-and-setup-guide
description: Writes a README and a setup guide that a new developer can follow on day one, built only from the project's code, scripts and config. Lists every fact the material supports (commands, versions, environment variables, ports, folders), marks gaps as [to confirm], writes numbered steps with exact commands and expected output, adds troubleshooting from known issues, and tests the steps on a clean setup. Use when a project only one person can run, before a handover to another developer or agency, or when the current README is out of date.
---

# README and setup guide

A good README answers four questions in the first screen: what is this, why would I use it, how do I start, and where do I get help. A good setup guide then gets a stranger from a clean machine to a running project without phoning anyone. This skill writes both from the evidence in the repository, not from memory.

## When to use

- A project only its original developer knows how to run.
- A freelancer or agency handing a project to the client or another team.
- A README that describes an older version of the project.
- An internal tool that new staff struggle to install.

Not for: API references generated from an OpenAPI file (use api-reference-and-quickstart), customer help articles, or documenting systems the client does not have the right to share.

## What you need

- **The repository** or the relevant files: package and lock files, build scripts, Dockerfiles, CI config, .env.example, Makefile, existing docs and issues.
- **Who reads it** and what they must be able to do afterwards: run it, change it, deploy it or hand it on.
- **A clean setup to test on:** a fresh clone on a new machine, a container, or a cloud dev environment.
- **A person** who can answer questions about anything the files do not show.
- **Access level:** reading the repository needs level 1. Opening a pull request with the README and guide needs level 2. Merging it needs level 3 within the client's limits.

## Steps

1. **Name the reader and the goal.** One line: "A developer who knows Node.js but not this project, who must run it locally and deploy to staging."
2. **Harvest the facts.** From the files, list: language and runtime versions, package manager, install commands, every environment variable (from .env.example or config code) with what it does, ports, database and migrations, test commands, build and deploy commands, folder layout. Only these facts go into the docs.
3. **List the gaps.** Anything the steps need but the files do not show (a deploy step, a secret's source, a seed command) gets a [to confirm] marker and goes on the question list. Never invent a command or flag.
4. **Write the README** in this order, with sentence-case headings that work as a table of contents:
   - Name and one-sentence description; who it is for.
   - Status (active, maintenance, archived) and supported versions.
   - Quick start: the shortest path to a running project, in five steps or fewer if the project allows it.
   - Links to the full setup guide, configuration reference, contributing guide, licence and support.
   - Maintainers and how to get help.
   Keep it short; GitHub truncates READMEs over 500 KiB, so long material belongs in separate pages.
5. **Write the setup guide** as numbered steps, one action each:
   - Prerequisites with exact versions and how to check them.
   - Each command in a code block, followed by what the reader should see.
   - Configuration: a table of environment variables (name, required, example placeholder value, description). Never real secrets.
   - Run, test, build and deploy sections, each with its own steps.
6. **Add troubleshooting** from known issues, CI failures and old tickets: symptom, cause, fix.
7. **Add the decision trail** if useful: link existing architecture decision records, or list decisions worth recording (use the decision-record-from-notes prompt).
8. **Test on a clean setup.** Follow every step exactly as written. Record what failed and fix the docs (or flag the code problem). Do not mark the guide done until someone has completed it from scratch.
9. **Self-check:** every command and name exists in the material; no secrets or personal data; headings scan as a table of contents; sentences short, active and in present tense.
10. **Deliver.** At level 2, open a pull request with the README, guide and question list. At level 3, merge after approval in the repositories named, log the action and report it.

## Checks

- First screen of the README answers what, why, how to start, and where to get help.
- Every command, variable and path appears in the material, or carries [to confirm].
- Each step has one action and an expected result.
- Environment variables are all listed with placeholders, never real values.
- The guide was followed end to end on a clean setup, with the result recorded.
- Troubleshooting covers the known failure points.
- Links work and point inside the repository where possible.

## Output format

1. **README.md.**
2. **docs/setup.md** (or the client's docs path).
3. **Configuration reference** table.
4. **Question list** of [to confirm] items with who can answer.
5. **Test record:** setup used, date, steps passed, steps failed and fixes.

## Example of good output (short)

*Illustrative structure, not a real business: a small invoicing web app built with Node.js and PostgreSQL. Copy the shape, never the content: every fact comes from the client's own context.*

```markdown
# [Product]

[Product] creates and sends invoices for small service firms. This repository holds the web app and its API.

## Quick start

1. Install Node.js 20 and PostgreSQL 16. Check with `node --version` and `psql --version`.
2. Copy the example settings: `cp .env.example .env`
3. Install packages: `npm ci`
4. Create the database and tables: `npm run db:setup`
5. Start the app: `npm run dev`

   You should see `Listening on http://localhost:3000`.

## Configuration

| Variable | Required | Example | What it does |
|---|---|---|---|
| DATABASE_URL | Yes | postgres://user:pass@localhost:5432/[product] | Database connection |
| MAIL_API_KEY | For sending email | (your test key) | Key for the email service [to confirm: which provider?] |
```

**Question list:** "npm run deploy" calls a script that is not in the repository. Who deploys, and how? (Ask: the original developer.)
