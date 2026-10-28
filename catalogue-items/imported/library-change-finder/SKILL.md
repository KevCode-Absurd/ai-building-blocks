---
name: since-cutoff
description: "Find which APIs of a project's pinned Python dependencies changed after the model's training cutoff, where the code uses them, and write short AGENTS.md or CLAUDE.md notes."
category: development
risk: safe
source: https://github.com/MohammadHijjawi97/since-cutoff/tree/f2108c13c112dce0ca3597b5a2b79ca01afa7b80/skills/since-cutoff
source_repo: MohammadHijjawi97/since-cutoff
source_type: official
date_added: "2026-09-28"
author: Mohammad Hijjawi
tags: [python, dependencies, api-changes, knowledge-cutoff, agents-md, static-analysis]
tools: [claude, codex, cursor, gemini]
license: MIT
license_source: https://github.com/MohammadHijjawi97/since-cutoff/blob/f2108c13c112dce0ca3597b5a2b79ca01afa7b80/LICENSE
---

# since-cutoff: dependency API changes after the model's training cutoff

> **Licence and source note (added by AI Blocks):** this is an adapted copy of the upstream since-cutoff skill. The method is the upstream author's. AI Blocks added safety notes and pinned the tool to one release. The one licence for the written text of this copy is CC BY-4.0 (file `LICENSE-CONTENT`). The `license: MIT` line in the header above is the author's own declaration, and it covers their tool. Keep the credit to the author.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Overview

A coding model learns each library's API as it was at its training cutoff, but the project's lockfile keeps moving. This skill runs the since-cutoff CLI (MIT, PyPI `since-cutoff`, pinned here to release 0.4.1). For each pinned dependency, the CLI takes the latest release on or before the model's cutoff and compares that release's public API with the pinned release. The comparison is static (griffe), so no package code runs. It then reports the changed APIs that the project's code uses, with the files that use them. If the user agrees, it writes short notes into AGENTS.md or CLAUDE.md, each tagged with the evidence behind it (for example `[diff]`). `scan` makes no model calls and needs no API key. This adapts the [upstream skill](https://github.com/MohammadHijjawi97/since-cutoff/tree/f2108c13c112dce0ca3597b5a2b79ca01afa7b80/skills/since-cutoff) under its [MIT license](https://github.com/MohammadHijjawi97/since-cutoff/blob/f2108c13c112dce0ca3597b5a2b79ca01afa7b80/LICENSE).

## When to Use

- Use when the user asks whether you know the versions of their Python dependencies, or what changed since your training data.
- Use when code keeps failing on a renamed, moved or removed function, class or parameter of a pinned library.
- Use after a dependency upgrade, before writing code against the upgraded library.
- Do not use for projects that are not Python.

## How It Works

1. Work from the project root, the directory that has `pyproject.toml`, `requirements*.txt` or a lockfile (`uv.lock`, `poetry.lock`, `pdm.lock`, `pylock.toml`, `Pipfile.lock`).
2. Check the runner with `since-cutoff --version`. If it is missing or does not report 0.4.1, ask the user before running `uvx since-cutoff@0.4.1`, which downloads that release from PyPI the first time. Do not install anything else or change the user's environment.
3. Run the read-only scan and name the model you are: `uvx since-cutoff@0.4.1 scan --model <provider>:<model>` (for example `anthropic:claude-sonnet-4-5` or `openai:gpt-5.4`). Without `--model`, it reads the model from the coding agent's settings and prints where it found it. The scan reads the project's files, PyPI and models.dev. It sends none of the project's code anywhere.
4. Summarise the result for the user: the model and its cutoff, which dependencies changed, and which changed APIs the code uses, with the files that use them.
4b. If the scan reports MISSING items, such as no lockfile or no readable dependency list, tell the user which ones. Ask them to run `uv lock` or their tool's lock command to create a lockfile, or to pin versions in `requirements.txt`, then run the scan again.
5. Write notes only if the user asks for them. Run `uvx since-cutoff@0.4.1 sync --dry-run` and show the user the diff it prints. Run `uvx since-cutoff@0.4.1 sync --yes` only after they agree. It writes one marked block into AGENTS.md (or into CLAUDE.md if that is the file the project uses) and leaves the rest of the file unchanged. Run after later upgrades, it keeps the block in step with the lockfile. Exit code 4 means the block was edited by hand: tell the user, and pass `--force` only if they say so. `uvx since-cutoff@0.4.1 unapply` removes the block.
6. Treat the notes as reference facts about the versions the project pins, and check them when you write code that uses those libraries.
7. Optional: `since-cutoff run` measures which of the changes the model actually gets wrong. It sends prompts to the model provider the user picks (package names, versions, public API signatures and generated tasks, never the project's source code) and uses their credits or usage, so ask first.

## Examples

```bash
uvx since-cutoff@0.4.1 scan --model anthropic:claude-sonnet-4-5
```

Output on the project's sample app, abridged to one package:

```text
Your code uses 2 APIs that changed after claude-sonnet-4-5's training cutoff (2025-07-31)

anthropic 0.60.0 -> 1.8.0 (0.60.0 was the latest release at the cutoff; pyproject.toml pins 1.8.0)
  Messages.create: temperature, top_k and top_p were removed                          uses this API
    app/main.py   calls create
    Note: `Messages.create()` no longer accepts `temperature`, `top_k` or `top_p` as keyword
          arguments. If the API still needs them, pass them through its `extra_body` or
          `extra_query` argument. [diff]
```

## Limitations

- Python projects only.
- It compares the shape of the public API: names, signatures, parameters and deprecation markers. A change in behaviour behind an unchanged signature is invisible to it.
- The training cutoff only decides which changes to look at. It does not show what the model memorised; `run` measures that.
- It needs network access to PyPI, and to models.dev for model cutoffs. The first scan downloads the releases it compares. Results are cached locally.

## Security Notes

`scan` and `status` do not change project files: they write only to their own git-ignored `.since-cutoff/` folder and a local cache. `sync` writes one marked block to AGENTS.md or CLAUDE.md, and only after the user agrees. No package code and no model-written code is executed. Credentials are needed only for the optional `run`.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Python change test checker](https://useaiblocks.com/skills/change-test-prover). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
