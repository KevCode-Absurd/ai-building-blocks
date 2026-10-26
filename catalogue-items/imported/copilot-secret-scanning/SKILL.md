---
name: secret-scanning
description: 'Guide for configuring and managing GitHub secret scanning, push protection, custom patterns, and secret alert remediation. For pre-commit secret scanning in AI coding agents via the GitHub MCP Server, this skill references the Advanced Security plugin (`advanced-security@copilot-plugins`). Use this skill when enabling secret scanning, setting up push protection, defining custom patterns, triaging alerts, resolving blocked pushes, or when an agent needs to scan code for secrets before committing.'
---

# Secret Scanning

This skill provides procedural guidance for configuring GitHub secret scanning — detecting leaked credentials, preventing secret pushes, defining custom patterns, and managing alerts.

## When to Use This Skill

Use this skill when the request involves:

- Enabling or configuring secret scanning for a repository or organization
- Setting up push protection to block secrets before they reach the repository
- Defining custom secret patterns with regular expressions
- Resolving a blocked push from the command line
- Triaging, dismissing, or remediating secret scanning alerts
- Configuring delegated bypass for push protection
- Excluding directories from secret scanning via `secret_scanning.yml`
- Understanding alert types (user, partner, push protection)
- Enabling validity checks or extended metadata checks
- Scanning local code changes for secrets before committing (via MCP / AI coding agent) — see the **Pre-Commit Scanning via AI Coding Agents** section below for the recommended plugin

## What this skill does and does not do

This skill gives step-by-step guidance. It does **not** change GitHub settings. A person with the right access clicks each setting. The AI cannot turn anything on for you, unless it has a GitHub tool that you set up and approved. Never say a setting is on until the user confirms it, or you have read it from GitHub.

## When not to use

- A secret has already leaked in a public repo or in history. Rotate the credential first, today, and follow your incident process. The Incident Responder agent can help. Setting up scanning does not fix a leak that has already happened.
- You want to scan your own live website for exposed keys. Use the Exposed secrets finder.
- You want to tidy `.env` files and plan key rotation across a project. Use the Secrets hygiene checker.
- Your code is not on GitHub. These settings are GitHub features.

## Inputs (ask once, never guess)

Ask for these before the steps. If an answer is missing, write `MISSING` and say what it changes.

1. **Access.** Are you a repo admin, or an org owner? Org-wide settings need an org owner.
2. **Where the code lives.** Public repo, private repo owned by an organization, or user-owned. This decides what is free and what is paid (see Availability).
3. **GitHub plan.** Free, Team or Enterprise Cloud. Private and internal repos need GitHub Secret Protection, a paid add-on on Team and Enterprise Cloud. Check GitHub's own pricing page for the current cost. Do not quote a price.
4. **Copilot.** Do you have GitHub Copilot? AI-powered detection and Copilot pattern generation need it.
5. **The repo or organization name**, and any existing `.github/secret_scanning.yml` or custom pattern files (optional).
6. **Your goal:** turn it on, block pushes, add a custom pattern, or clean up alerts.

## How Secret Scanning Works

Secret scanning automatically detects exposed credentials across:

- Entire Git history on all branches
- Issue descriptions, comments, and titles (open and closed)
- Pull request titles, descriptions, and comments
- GitHub Discussions titles, descriptions, and comments
- Wikis and secret gists

### Availability

| Repository Type | Availability |
|---|---|
| Public repos | Automatic, free |
| Private/internal (org-owned) | Requires GitHub Secret Protection on Team/Enterprise Cloud |
| User-owned | Enterprise Cloud with Enterprise Managed Users |

## Core Workflow — Enable Secret Scanning

### Step 1: Enable Secret Protection

1. Navigate to repository **Settings** → **Advanced Security**
2. Click **Enable** next to "Secret Protection"
3. Confirm by clicking **Enable Secret Protection**

For organizations, use security configurations to enable at scale:
- Settings → Advanced Security → Global settings → Security configurations

### Step 2: Enable Push Protection

Push protection blocks secrets during the push process — before they reach the repository.

1. Navigate to repository **Settings** → **Advanced Security**
2. Enable "Push protection" under Secret Protection

Push protection blocks secrets in:
- Command line pushes
- GitHub UI commits
- File uploads
- REST API requests
- REST API content creation endpoints

### Step 3: Configure Exclusions (Optional)

Create `.github/secret_scanning.yml` to auto-close alerts for specific directories:

```yaml
paths-ignore:
  - "docs/**"
  - "test/fixtures/**"
  - "**/*.example"
```

**Limits:**
- Maximum 1,000 entries in `paths-ignore`
- File must be under 1 MB
- Excluded paths also skip push protection checks

**Best practices:**
- Be as specific as possible with exclusion paths
- Add comments explaining why each path is excluded
- Review exclusions periodically — remove stale entries
- Inform the security team about exclusions

### Step 4: Enable Additional Features (Optional)

**Non-provider patterns** — detect private keys, connection strings, generic API keys:
- Settings → Advanced Security → enable "Scan for non-provider patterns"

**AI-powered generic secret detection** — uses Copilot to detect unstructured secrets like passwords:
- Settings → Advanced Security → enable "Use AI detection"

**Validity checks** — verify if detected secrets are still active:
- Settings → Advanced Security → enable "Validity checks"
- GitHub periodically tests detected credentials against provider APIs
- Status shown in alert: `active`, `inactive`, or `unknown`

**Extended metadata checks** — additional context about who owns a secret:
- Requires validity checks to be enabled first
- Helps prioritize remediation and identify responsible teams

## Core Workflow — Resolve Blocked Pushes

When push protection blocks a push from the command line:

### Option A: Remove the Secret

**If the secret is in the latest commit:**
```bash
# Remove the secret from the file
# Then amend the commit
git commit --amend --all
git push
```

**If the secret is in an earlier commit:**
```bash
# Find the earliest commit containing the secret
git log

# Start interactive rebase before that commit
git rebase -i <COMMIT-ID>~1

# Change 'pick' to 'edit' for the offending commit
# Remove the secret, then:
git add .
git commit --amend
git rebase --continue
git push
```

### Option B: Bypass Push Protection

1. Visit the URL returned in the push error message (as the same user)
2. Select a bypass reason:
   - **It's used in tests** — alert created and auto-closed
   - **It's a false positive** — alert created and auto-closed
   - **I'll fix it later** — open alert created. Warning: a real credential stays exposed until it is rotated. Pushing it does not make it safe. Rotate it the same day.
3. Click **Allow me to push this secret**
4. Re-push within 3 hours

### Option C: Request Bypass Privileges

If delegated bypass is enabled and you lack bypass privileges:
1. Visit the URL from the push error
2. Add a comment explaining why the secret is safe
3. Click **Submit request**
4. Wait for email notification of approval/denial
5. If approved, push the commit; if denied, remove the secret

> For detailed bypass and delegated bypass workflows, search `references/push-protection.md`.

## Custom Patterns

Define organization-specific secret patterns using regular expressions.

### Quick Setup

1. Settings → Advanced Security → Custom patterns → **New pattern**
2. Enter pattern name and regex for secret format
3. Add a sample test string
4. Click **Save and dry run** to test (up to 1,000 results)
5. Review results for false positives
6. Click **Publish pattern**
7. Optionally enable push protection for the pattern

### Scopes

Custom patterns can be defined at:
- **Repository level** — applies to that repo only
- **Organization level** — applies to all repos with secret scanning enabled
- **Enterprise level** — applies across all organizations

### Copilot-Assisted Pattern Generation

Use Copilot secret scanning to generate regex from a text description of the secret type, including optional example strings.

> For detailed custom pattern configuration, search `references/custom-patterns.md`.

## Alert Management

### Alert Types

| Type | Description | Visibility |
|---|---|---|
| **User alerts** | Secrets found in repository | Security tab |
| **Push protection alerts** | Secrets pushed via bypass | Security tab (filter: `bypassed: true`) |
| **Partner alerts** | Secrets reported to provider | Not shown in repo (provider-only) |

### Alert Lists

- **Default alerts** — supported provider patterns and custom patterns
- **Generic alerts** — non-provider patterns and AI-detected secrets (limited to 5,000 per repo)

### Remediation Priority

1. **Rotate the credential immediately** — this is the critical action
2. Review the alert for context (location, commit, author)
3. Check validity status: `active` (urgent), `inactive` (lower priority), `unknown`
4. Remove from Git history if needed (time-intensive, often unnecessary after rotation). Removing a secret from history does not protect you. Anyone who cloned the repo, and any fork, may still have it. Only rotation does.

### Dismissing Alerts

Dismiss with a documented reason:
- **False positive** — detected string is not a real secret
- **Revoked** — credential has already been revoked
- **Used in tests** — secret is only in test code

> For detailed alert types, validity checks, and REST API, search `references/alerts-and-remediation.md`.

## Pre-Commit Scanning via AI Coding Agents

For scanning code changes for secrets inside an AI coding agent before committing, install the **Advanced Security plugin** which provides the `run_secret_scanning` MCP tool and a dedicated scanning skill.

**GitHub Copilot CLI:**
```bash
/plugin install advanced-security@copilot-plugins
```

**Visual Studio Code:**
- In Copilot Chat, open **Chat: Plugins** (or use `@agentPlugins`) and install the `advanced-security` plugin
- Then run `/secret-scanning` in Copilot Chat

See: [Advanced Security Plugin — Secret Scanning Skill](https://github.com/github/copilot-plugins/blob/main/plugins/advanced-security/skills/secret-scanning/SKILL.md)

> Announced in [Secret scanning in AI coding agents via the GitHub MCP Server](https://github.blog/changelog/2026-03-17-secret-scanning-in-ai-coding-agents-via-the-github-mcp-server/) (March 2026)

## Output Format

Deliver a **Secret Protection Plan** in this order.

1. **Your setup.** The answers to the inputs above, with `MISSING` where unknown. State what the plan assumes.
2. **What is free and what is paid for you.** For your repo type and plan, say what needs GitHub Secret Protection or Copilot. Say "check GitHub's current pricing" instead of quoting a price.
3. **Settings to turn on.** Numbered steps with the exact menu path, in order. Mark each `Do now`, `Optional` or `Needs an org owner`. Add one line each on what it does.
4. **Exclusions and custom patterns** (only if asked): the `secret_scanning.yml` file, or the custom pattern, with a test string and the dry run step.
5. **If a push is blocked:** the steps to take for your case (remove it, bypass with a reason, or request bypass).
6. **If an alert appears:** the response order. Rotate first, check the validity status, review where it was used, then dismiss with a reason or remove it from history.
7. **Dated rotation plan.** A table. Leave the owner and date blank for the user to fill in. Do not invent names or dates.

   | Secret or alert | Priority | Owner | Rotate by | Done? |
   |-----------------|----------|-------|-----------|-------|

8. **Check it worked.** Tell the user to open Settings, then Advanced Security, and confirm each setting shows as enabled. Never test with a real credential.
9. **Next steps.** The three actions to do this week.

## Reference Files

For detailed documentation, load the following reference files as needed:

- `references/push-protection.md` — Push protection mechanics, bypass workflow, delegated bypass, user push protection
  - Search patterns: `bypass`, `delegated`, `bypass request`, `command line`, `REST API`, `user push protection`
- `references/custom-patterns.md` — Custom pattern creation, regex syntax, dry runs, Copilot regex generation, scopes
  - Search patterns: `custom pattern`, `regex`, `dry run`, `publish`, `organization`, `enterprise`, `Copilot`
- `references/alerts-and-remediation.md` — Alert types, validity checks, extended metadata, generic alerts, secret removal, REST API
  - Search patterns: `user alert`, `partner alert`, `validity`, `metadata`, `generic`, `remediation`, `git history`, `REST API`
