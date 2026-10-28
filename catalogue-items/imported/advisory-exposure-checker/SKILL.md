---
name: cyber-audit
description: "Run read-only exposure checks for security advisories and write a structured local audit report."
category: security
risk: safe
source: community
source_repo: davidondrej/skills
source_type: community
date_added: "2026-07-07"
author: davidondrej
tags: [security, audit, read-only]
tools: [claude, codex]
license: "MIT"
license_source: "https://github.com/davidondrej/skills/blob/main/LICENSE"
disable-model-invocation: true
---

> **AI Blocks note (licence):** this copy is shared under CC BY 4.0, as the LICENSE-CONTENT file in this folder says. The `license:` line in the front matter above is the original author's own label (MIT). The LICENSE-CONTENT file governs here. Keep the credit to the author.

# cyber-audit

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
<!-- /needs -->

## When to Use

- Use when the user asks whether their machine or projects are affected by a CVE, breach, or package advisory.
- Use when a read-only local security exposure report is appropriate.

## Hard rules

- **Read-only.** No installs, removes, upgrades, restarts, network calls, or file modifications outside `~/Documents/security-audits/`.
- **No `sudo`.** Never.
- **Never copy secrets into the report.** When you search config or shell files, print only the file path and the variable name. Never print the matched value, because it may be an API key or token. If a command would print a value, cut it off or list file names only.
- **One report per invocation.** Always end by writing the `.md` file (even if the verdict is "Not affected" — the audit trail matters).
- If a check requires a state-changing command, **skip it and note "not checked (would require state change)"** in the table. Do not run it.

## Workflow

0. **Ask first.** Ask which operating system the user has (macOS, Linux or Windows) and which folders to check. Say that Windows gets no ready checks.
1. **Identify scope.** Extract from the advisory: package/binary name, affected versions, platform (macOS / Linux / Windows), attack vector (supply chain / RCE / local / network).
2. **Run checks in parallel** (Bash tool, multiple calls in one message). Pick relevant checks for the advisory type — don't run all of them.
3. **Build the table** as you go. Each row = one check + concrete result (version number, path, "None", "N/A").
4. **Write the report** to `~/Documents/security-audits/YYYY-MM-DD-<short-kebab-slug>.md`. Use today's date from the environment header.
5. **Tell the user** the verdict in one line + path to the report.

## Check menu (pick what's relevant)

In the commands below, replace `<FOLDERS>` with the folders the user named. If they named none, ask. Do not search the whole home folder unless the user agrees. The other checks read fixed system places (installed tools, startup items, shell settings, extensions), as written.

The commands below are written for macOS (Homebrew paths, LaunchAgents, `lsof`). On Linux, swap in the matching paths and tools. On Windows there are no ready checks here, so mark each one "not checked (no ready check for this system)" in the table.

```bash
# --- Node / npm ecosystem (supply-chain advisories) ---
which npm pnpm yarn; npm root -g; pnpm root -g 2>/dev/null
ls /opt/homebrew/lib/node_modules                                  # global npm
find <FOLDERS> -maxdepth 8 -type d -name "<pkg>" 2>/dev/null \
  | grep -v -E "(Library/Caches|\.Trash)"                          # installed copies
find <FOLDERS> -maxdepth 8 -type f \
  \( -name "package.json" -o -name "package-lock.json" \
     -o -name "pnpm-lock.yaml" -o -name "yarn.lock" \) 2>/dev/null \
  | xargs grep -l "<pkg>" 2>/dev/null                              # direct + transitive

# --- Python ecosystem ---
which python3 pip pipx uv
pip list 2>/dev/null | grep -i "<pkg>"
find <FOLDERS> -maxdepth 6 \( -name "requirements*.txt" -o -name "pyproject.toml" \
  -o -name "poetry.lock" -o -name "uv.lock" \) 2>/dev/null | xargs grep -l "<pkg>" 2>/dev/null

# --- Homebrew / system binaries ---
brew list --versions <formula> 2>/dev/null
which <binary>; <binary> --version 2>/dev/null

# --- Running processes / listeners (for RCE / network CVEs) ---
pgrep -lf "<binary>"
lsof -iTCP -sTCP:LISTEN -P -n 2>/dev/null | grep "<port>"

# --- LaunchAgents / LaunchDaemons (persistence / autostart) ---
ls ~/Library/LaunchAgents /Library/LaunchAgents /Library/LaunchDaemons 2>/dev/null \
  | grep -i "<vendor>"

# --- Env vars that change exposure (e.g. OLLAMA_HOST, listening addr) ---
launchctl getenv <VAR> >/dev/null && echo "<VAR> is set (value hidden)"
grep -rl "<VAR>" ~/.zshrc ~/.zprofile ~/.config 2>/dev/null   # file paths only, never the matched line

# --- VS Code / browser extensions (for IDE-targeted advisories) ---
ls ~/.vscode/extensions 2>/dev/null | grep -i "<ext>"
```

If the advisory mentions an ecosystem not above (Rust cargo, Go modules, Ruby gems, Docker images, etc.), apply the same pattern: global install path + manifest grep + running processes.

## Report template

File: `~/Documents/security-audits/YYYY-MM-DD-<short-kebab-slug>.md`

```markdown
# <Subject> — Audit

**Date:** YYYY-MM-DD
**Host:** <the user's computer and operating system>

## <CVEs | Advisory> in scope

- **<ID or source> "<Name>"** — <one-line description>. <Affected versions or scope>.

## Audit results

| Check | Result |
|---|---|
| <Check 1> | <Result> |
| <Check 2> | <Result> |

## Verdict

**<Not affected. | Affected. | Partially affected.>**

- <Rationale bullet 1>
- <Rationale bullet 2>

## Action taken

None — diagnostic only, no files modified, no <packages installed/removed | services started/stopped | firewall rules changed>.

## Follow-ups

- <Actionable item, or "None" if truly nothing>
```

Match the tone of the two existing reports in `~/Documents/security-audits/` — terse, factual, bulleted, no hedging.

## Verdict wording

- **Not affected.** — package/binary absent, or installed but patched, or not running and not exposed.
- **Affected.** — vulnerable version present *and* reachable by the attack vector.
- **Partially affected.** — present but mitigated (e.g. binary installed but service not running, or listener bound to loopback only). Spell out the mitigation in the bullets.

## When to break the read-only rule

Never on your own. If the verdict is "Affected", list the remediation command in **Follow-ups** and stop. The user runs it.

## Reference

Two existing reports in `~/Documents/security-audits/` show the expected style:
- `baseline-audit.md` (long-form baseline audit — different format, do not mimic)
- `YYYY-MM-DD-example-advisory.md` and any newer `YYYY-MM-DD-*.md` files (this is the format to match)

## Limitations

- Adapted from `davidondrej/skills`; verify local paths, tools, credentials, and agent features before acting.
- For commands, remote access, scheduling, browser automation, or file-changing workflows, get explicit user approval and confirm the target environment first.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Project secrets and package risk review](https://useaiblocks.com/skills/weekly-dependency-and-security-sweep).
- The [Prompt injection defender](https://useaiblocks.com/skills/prompt-injection-defender). It takes the security report.
- The [GitHub Actions security reviewer](https://useaiblocks.com/skills/github-actions-attack-finder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
