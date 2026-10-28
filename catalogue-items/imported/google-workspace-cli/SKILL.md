---
name: "google-workspace-cli"
description: "Google Workspace administration via the gws CLI (github.com/googleworkspace/cli). Install, authenticate, and automate Gmail, Drive, Sheets, Calendar, Docs, Chat, and Tasks. Run security audits and use local recipe templates and persona bundles. Use for Google Workspace admin, gws CLI setup, Gmail automation, Drive management, or Calendar scheduling."
---

# Google Workspace CLI

Expert guidance and automation for Google Workspace administration using the open-source `gws` CLI ([github.com/googleworkspace/cli](https://github.com/googleworkspace/cli), Apache-2.0). The CLI builds its command surface dynamically from Google's Discovery Service, so it covers every supported Workspace API plus `+`-prefixed helper commands. This skill adds local Python tools (doctor, auth guide, recipe catalog, security audit, output analyzer).

> **Licence:** the `gws` tool is a separate project under Apache-2.0. The text and scripts in this skill are MIT, as set out in the LICENSE file here.

> **Verify before scripting:** `gws` generates commands at runtime from Google's API discovery documents, and the CLI is pre-v1.0. Always confirm a command's exact surface with `gws --help`, `gws <service> --help`, or `gws schema <service>.<resource>.<method>` before putting it in automation. The commands in this skill were not run against a specific release, so no version number is given as checked. Commands in this skill marked *(verify)* are illustrative of the `gws <service> <resource> <method>` pattern and must be checked against your installed version.


**Source check by AI Blocks, 28 Oct 2026:** The [project README](https://github.com/googleworkspace/cli) documents auth login -s, auth export --unmasked, schema, --params, --json, --dry-run and --page-all. It says this is not an officially supported Google product. This was a documentation check; no sign-in or Workspace API call was run. Keep the installed-version help checks below, because generated commands can change.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude Code or Codex:** They can install gws, run the commands and read the results on your own computer.
- **Chat AI without commands:** It can write the commands for you to run yourself, then explain what comes back.
<!-- /needs -->

## When not to use this skill

- For one small edit or a single email, use Google's own app. It is faster than setting up a tool.
- For admin changes without Workspace admin rights, ask an admin. Those commands will fail.
- For Microsoft 365, use the Microsoft 365 admin helper.
- To plan an automation without running anything, use the No-code automation planner.

## Inputs to gather first

- What the person wants done, in plain words, and in which service (Gmail, Drive, Sheets, Calendar, Docs, Chat or Tasks).
- Which account type they use (personal Google account or Workspace) and whether they have a Workspace admin role.
- The people, files or sheets involved.
- Whether a Google Cloud project and an OAuth client exist. The first sign-in needs both. The tool is free, but this setup takes time in the Google Cloud Console.

## Rules for running commands (read first)

This skill acts on real Gmail, Drive, Calendar and admin data. Follow these rules every time.

1. **Ask what the job is, once.** If the person has not said which service, which files, people or sheets, or what outcome, ask. Do not guess.
2. **Read first, change later.** Start with a read-only command (a list or a search) and show the result. Only then move to a change.
3. **Confirm before any change.** Before anything that sends an email, shares or unshares a file, moves, archives or deletes items, edits a Sheet or calendar, or changes an admin setting: show the exact command, say how many items it will touch, run it with `--dry-run` if the command supports it, and wait for a clear yes. To find out whether a command supports `--dry-run`, run `<command> --help`. If it does not, first run a read-only command that lists exactly the items the change would touch, show that list, and ask for the yes. A yes to one command is not a yes to the next.
4. **Never run a command that still has a <FLAGS FROM --help> marker in it.** Where this skill shows that marker, run `<command> --help` first, then write the full command from what the help says. Commands marked *(verify)* get the same treatment: run `gws schema <service>.<resource>.<method>` or `--help` first.
5. **Smallest permissions.** Sign in with only the services the job needs (for example `-s drive`), not everything.
6. **Admin work needs admin rights.** If a command fails for lack of rights, say so and stop. Do not try to work around it.
7. **No tools, no run.** If you cannot run commands in this chat, write the commands for the person to run and ask them to paste the result back. Do not invent results.

---

## Quick Start

### Check Installation

```bash
# Verify gws is installed and authenticated
python3 scripts/gws_doctor.py
```

### Send an Email (a change: read first, then confirm)

This sends real email. Under rules 2 and 3 above, start with a read-only command such as the unread summary (`gws gmail +triage`, check `--help` for the exact name), show the exact command below, check `gws gmail +send --help` for a dry-run option, and wait for a clear yes before running it.

```bash
gws gmail +send --to "team@company.com" \
  --subject "Weekly Update" --body "<MESSAGE TEXT>"
```

### List Drive Files

```bash
gws drive files list --params '{"pageSize": 20}' | python3 scripts/output_analyzer.py --select "name,mimeType,modifiedTime" --format table
```

---

## Installation

### npm (recommended; requires Node.js 18+)

```bash
npm install -g @googleworkspace/cli
gws --version
```

### Homebrew (macOS/Linux)

```bash
brew install googleworkspace-cli
```

### Cargo (from source)

```bash
cargo install --git https://github.com/googleworkspace/cli --locked
gws --version
```

### Pre-built Binaries

Download from [github.com/googleworkspace/cli/releases](https://github.com/googleworkspace/cli/releases) for macOS, Linux, or Windows. Nix users: `nix run github:googleworkspace/cli`.

### Verify Installation

```bash
python3 scripts/gws_doctor.py
# Checks: PATH, version, auth status, service connectivity
```

---

## Authentication

### OAuth Setup (Interactive)

```bash
# Step 1: Create Google Cloud project and OAuth credentials
python3 scripts/auth_setup_guide.py --guide oauth

# Step 2: Run interactive auth setup (uses gcloud if available)
gws auth setup

# Step 3: Log in, requesting only the scopes you need
gws auth login -s drive,gmail,sheets
```

### Environment Variables

```bash
# Generate .env template
python3 scripts/auth_setup_guide.py --generate-env
```

| Variable | Purpose |
|----------|---------|
| `GOOGLE_WORKSPACE_CLI_CLIENT_ID` | OAuth client ID |
| `GOOGLE_WORKSPACE_CLI_CLIENT_SECRET` | OAuth client secret |
| `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE` | Path to exported credentials JSON |
| `GOOGLE_WORKSPACE_CLI_TOKEN` | Pre-obtained OAuth token |
| `GOOGLE_WORKSPACE_CLI_CONFIG_DIR` | Override default config location |
| `GOOGLE_WORKSPACE_CLI_LOG` | Enable debug logging |

### Validate Authentication

```bash
python3 scripts/auth_setup_guide.py --validate --json
# Tests each service endpoint
```

## Headless sign-in (only for machines that cannot open a browser)

This is not the default. Use it only when the machine cannot open a browser to sign in. Ask the user before you write any credentials file. Never save it in a shared drive, a synced folder, a git repository, an email or a chat.

> **Caution:** `gws auth export --unmasked` writes your secrets to a plain file. Use it only for a headless machine that cannot sign in itself. Keep the file private, keep it out of any shared folder or git, and delete it when the job is done. On your own computer, sign in with `gws auth login` so no secrets sit in a file you made.

```bash
# Generate setup instructions
python3 scripts/auth_setup_guide.py --guide service-account

# Export credentials from an interactive machine, then point the CLI at them
gws auth export --unmasked > credentials.json
export GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE=/path/to/credentials.json

# When the job is done, delete the file
rm credentials.json
```

---

## Workflow 1: Gmail Automation

**Goal:** Automate email operations — send, search, label, and filter management.

### Send, Reply, Forward (helper commands)

```bash
# Send a new email
gws gmail +send --to "client@example.com" \
  --subject "Proposal" --body "<MESSAGE TEXT>"

# Reply to a message (auto-threading); check exact flags with: gws gmail +reply --help
gws gmail +reply <FLAGS FROM --help>

# Forward a message; check exact flags with: gws gmail +forward --help
gws gmail +forward <FLAGS FROM --help>

# Unread inbox summary
gws gmail +triage
```

### Search and Inspect (discovery commands)

Discovery commands follow `gws <service> <resource> <method>` and take request
parameters as JSON via `--params` (query/path params) and `--json` (request body).
Inspect any method's exact schema first:

```bash
# What does messages.list accept? (verify)
gws schema gmail.users.messages.list

# Search emails (verify against the schema above)
gws gmail users messages list --params '{"userId": "me", "q": "from:client@example.com after:2025/01/01"}' \
  | python3 scripts/output_analyzer.py --count

# List labels (verify)
gws gmail users labels list --params '{"userId": "me"}'
```

### Bulk Operations

Use `--dry-run` first, and `--page-all` to paginate (one JSON line per page):

```bash
# Preview, then archive read emails older than 30 days (verify method schema first)
gws gmail users messages list --params '{"userId": "me", "q": "is:read older_than:30d"}' --page-all \
  | python3 scripts/output_analyzer.py --select "id" --format json
# Then feed ids to gmail users messages modify (see: gws schema gmail.users.messages.modify)
```

---

## Workflow 2: Drive & Sheets

**Goal:** Manage files, create spreadsheets, configure sharing, and export data.

### File Operations

```bash
# List files
gws drive files list --params '{"pageSize": 50}' \
  | python3 scripts/output_analyzer.py --select "name,mimeType,size" --format table

# Upload a file (helper)
gws drive +upload ./report.pdf --name "Q1 Report"

# Create a Google Sheet
gws sheets spreadsheets create --json '{"properties": {"title": "Budget 2026"}}'

# Download/export — inspect the method first (verify)
gws schema drive.files.export
```

### Sharing (verify schemas first)

```bash
# Inspect the permissions API surface
gws schema drive.permissions.create

# Share with user (verify against schema)
gws drive permissions create --params '{"fileId": "<FILE_ID>"}' \
  --json '{"type": "user", "role": "writer", "emailAddress": "colleague@company.com"}'

# List who has access (verify)
gws drive permissions list --params '{"fileId": "<FILE_ID>"}'
```

### Sheets Data

```bash
# Read values (helper); check exact flags with: gws sheets +read --help
gws sheets +read <FLAGS FROM --help>

# Append a row (helper); check exact flags with: gws sheets +append --help
gws sheets +append <FLAGS FROM --help>

# Or use discovery methods (verify):
gws schema sheets.spreadsheets.values.update
gws sheets spreadsheets values get --params '{"spreadsheetId": "<SHEET_ID>", "range": "Sheet1!A1:D10"}'
```

---

## Workflow 3: Calendar & Meetings

**Goal:** Schedule events, find available times, and generate standup reports.

### Event Management

```bash
# Create an event (helper); check exact flags with: gws calendar +insert --help
gws calendar +insert <FLAGS FROM --help>

# Upcoming events (helper, timezone-aware)
gws calendar +agenda

# Or via discovery (verify):
gws schema calendar.events.insert
gws calendar events list --params '{"calendarId": "primary", "maxResults": 10}'
```

### Find Available Time

```bash
# Free/busy via the Calendar API (verify schema first)
gws schema calendar.freebusy.query
gws calendar freebusy query --json '{"timeMin": "<START TIME>", "timeMax": "<END TIME>", "items": [{"id": "alice@co.com"}]}'
```

### Standup Report (workflow helpers)

```bash
# Today's meetings + tasks
gws workflow +standup-report \
  | python3 scripts/output_analyzer.py --format table

# Next meeting prep; check exact flags with: gws workflow +meeting-prep --help
gws workflow +meeting-prep
```

---

## Workflow 4: Security Audit

**Goal:** Audit Google Workspace security configuration and generate remediation commands.

### Run Full Audit

```bash
# Full audit across all services
python3 scripts/workspace_audit.py --json

# Audit specific services
python3 scripts/workspace_audit.py --services gmail,drive,calendar

# Demo mode (no gws required)
python3 scripts/workspace_audit.py --demo
```

### Audit Checks

| Area | Check | Risk |
|------|-------|------|
| Drive | External sharing enabled | Data exfiltration |
| Gmail | Auto-forwarding rules | Data exfiltration |
| Gmail | DMARC/SPF/DKIM records | Email spoofing |
| Calendar | Default sharing visibility | Information leak |
| OAuth | Third-party app grants | Unauthorized access |
| Admin | Super admin count | Privilege escalation |
| Admin | 2-Step verification enforcement | Account takeover |

### Review and Remediate

```bash
# Review findings
python3 scripts/workspace_audit.py --json | python3 scripts/output_analyzer.py \
  --filter "status=FAIL" --select "area,check,remediation"

# Execute remediation (example: check current Drive settings first; verify)
gws drive about get --params '{"fields": "*"}'
# Follow remediation commands from audit output (verify each against gws --help)
```

Before any fix runs, show each remediation command with its exact target and the number of items or settings it changes, and wait for a yes under rule 3. Run fixes one at a time, never as a batch from the audit output.

---

## Python Tools

| Script | Purpose | Usage |
|--------|---------|-------|
| `gws_doctor.py` | Pre-flight diagnostics | `python3 scripts/gws_doctor.py [--json] [--services gmail,drive]` |
| `auth_setup_guide.py` | Guided auth setup | `python3 scripts/auth_setup_guide.py --guide oauth` |
| `gws_recipe_runner.py` | Recipe catalog & runner | `python3 scripts/gws_recipe_runner.py --list [--persona pm]` |
| `workspace_audit.py` | Security/config audit | `python3 scripts/workspace_audit.py [--json] [--demo]` |
| `output_analyzer.py` | JSON/NDJSON analysis | `gws ... --json \| python3 scripts/output_analyzer.py --count` |

All scripts are stdlib-only, support `--json` output, and include demo mode with embedded sample data.

---

## Best Practices

### Security

1. Use OAuth with minimal scopes — request only what each workflow needs
2. Store tokens in the system keyring, never in plain text files
3. Rotate service account keys every 90 days
4. Audit third-party OAuth app grants quarterly
5. Use `--dry-run` before bulk destructive operations

### Automation

1. All `gws` output is structured JSON — pipe it through `output_analyzer.py` for filtering and aggregation
2. Use `gws workflow +*` helpers for multi-step operations instead of chaining raw commands
3. Use the local recipe catalog (`gws_recipe_runner.py`) as command templates, then verify each against `gws --help`
4. `--page-all` emits one JSON line per page (NDJSON) for streaming large result sets
5. Use `--dry-run` to preview any request before executing it

### Performance

1. Request only needed fields via the API's `fields` parameter in `--params` (reduces payload size)
2. Use `pageSize` in `--params` to cap results when browsing
3. Use `--page-all` only when you need complete datasets; tune with `--page-limit` / `--page-delay`
4. Prefer `+` helpers (single optimized calls) over hand-chained API calls
5. Cache frequently accessed data (e.g., label IDs, folder IDs) in variables

---

## Limitations

| Constraint | Impact |
|------------|--------|
| OAuth tokens expire after 1 hour | Re-auth needed for long-running scripts |
| API rate limits (per-user, per-service) | Bulk operations may hit 429 errors |
| Scope requirements vary by service | Must request correct scopes during auth |
| Pre-v1.0 CLI status | Breaking changes possible between releases |
| Google Cloud project required | Free, but requires setup in Cloud Console |
| Admin API needs admin privileges | Some audit checks require Workspace Admin role |

### Required Scopes by Service

```bash
# List scopes for specific services
python3 scripts/auth_setup_guide.py --scopes gmail,drive,calendar,sheets
```

| Service | Key Scopes |
|---------|-----------|
| Gmail | `gmail.modify`, `gmail.send`, `gmail.labels` |
| Drive | `drive.file`, `drive.metadata.readonly` |
| Sheets | `spreadsheets` |
| Calendar | `calendar`, `calendar.events` |
| Admin | `admin.directory.user.readonly`, `admin.directory.group` |
| Tasks | `tasks` |

## Output format

Present every job like this. Leave out a block that does not apply.

```
Job: <what was asked>
Checks done: <gws installed, signed in, command options checked>

| <name> | <type> | <modified> | <link> |
(one row per result; the columns depend on the job)

Changes made: <none, or each change with the count of items>
Next step: <one suggestion>
```

For the security audit, list each check as PASS, FAIL or NOT CHECKED, with the fix for each FAIL. Run the fixes only under rule 3.

## Next steps

Finish with one suggestion that fits the job, such as: save the commands as a script for a repeat job, export a list to a Google Sheet, or run the security audit. Use `scripts/gws_recipe_runner.py --list` to find a ready-made recipe.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [AWS resource inventory reader](https://useaiblocks.com/skills/aws-resource-inventory-reader). It takes the tool connection.
- The [MCP server sign-in builder](https://useaiblocks.com/skills/mcp-server-sign-in-builder). It takes the tool connection.
- The [n8n failure handler](https://useaiblocks.com/skills/n8n-failure-handler). It takes the tool connection.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
