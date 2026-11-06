---
name: safe-admin-script
description: Writes, fixes or reviews PowerShell and Bash scripts for admin chores (backups, file clean-ups, log checks, bulk user tasks) so they are safe to run twice. Every script has settings at the top, a dry-run or -WhatIf mode, logging, clear exit codes, no stored passwords, and scheduling steps. Use it for any repeat chore done by hand, before running a script someone else wrote, or when a scheduled job fails silently.
---

# Safe admin script

## When to use

- Someone copies backups or tidies folders by hand every week.
- A bulk job is needed: add 30 users to a group, export licence data, find stale accounts.
- A script exists but nobody trusts it, or it failed and no one noticed.
- Before running any script from the internet or a colleague.

## What you need

1. The chore in plain words: what, how often, on which machine, who runs it.
2. Shell and version (PowerShell 7, Windows PowerShell 5.1, Bash on which Linux or macOS).
3. Real paths and names, with sensitive names swapped if needed.
4. What must never happen (for example "never delete anything in D:\Jobs").
5. Who should hear if it fails.

**Access:** level 1 to read existing scripts and logs; level 2 to write the script and test plan; level 3 to run the approved script on the named machines, dry run first, on the agreed schedule. A first live run that deletes, moves or overwrites data, or changes accounts in bulk, needs a fresh yes after you have seen the dry-run output.

## Steps

### 1. Write the steps in plain words first

List what the script will do, in order, and what it will not touch. Get the client to confirm before writing code.

### 2. Start with safety

**PowerShell:**
- `Set-StrictMode -Version Latest` and `$ErrorActionPreference = 'Stop'`.
- `[CmdletBinding(SupportsShouldProcess)]` so the script gets `-WhatIf` and `-Confirm`.
- Wrap each change in `if ($PSCmdlet.ShouldProcess($target, $action)) { ... }`, once per item, right before the change.
- When calling functions from other script modules, pass `-WhatIf:$WhatIfPreference` explicitly; Microsoft's own guidance warns it does not always carry through.
- Use `ConfirmImpact = 'High'` for destructive work so it prompts unless told not to.

**Bash:**
- `set -euo pipefail` at the top, so the script stops on errors, unset variables and failed pipes.
- Quote every variable: `"$src"`, never `$src`.
- A `DRY_RUN=1` default that prints each command instead of running it.
- Refuse to run if a key variable is empty, so `rm -rf "$dir/"` can never become `rm -rf /`.

### 3. Put settings at the top

Paths, how many days to keep, log location, who to alert, and the dry-run switch. Nothing else in the script should need editing.

### 4. Make it safe to rerun

- Skip work already done (file already copied, user already in group).
- Never delete without a keep rule or a backup.
- For robocopy: test with `/l` first; remember `/mir` deletes destination files that are missing from the source; set `/r` and `/w` low (the defaults are a million retries 30 seconds apart); treat exit codes of 8 or more as failure.
- For rsync: run with `--dry-run` first and check `--delete` behaviour.

### 5. Log and exit clearly

Log each action with a timestamp, what it did and the result. End with an exit code: 0 for success, non-zero for failure, so the scheduler and monitoring can tell.

### 6. No secrets in the script

- No passwords, keys or tokens in the file, the log or the command line.
- For Microsoft 365, use Microsoft Graph PowerShell with a workload identity (a managed identity or service principal) for unattended jobs; user accounts used for automation now meet mandatory MFA on Azure management actions.
- For other credentials, use the platform's secret store (Windows Credential Manager, a secrets manager) and say where the secret lives, not what it is.

### 7. Schedule it

Give the exact Task Scheduler steps, cron line or systemd timer, the account it runs as (least privilege), and how to read the log.

### 8. Test

1. Dry run on a copy or a test folder; read the output with the client.
2. Live run on the test location.
3. Dry run on the real target; client approves.
4. Live run on the real target (fresh yes if it deletes, moves or overwrites).

## Checks

- Every command exists in the stated shell and version.
- Paths come from the brief or are marked `[CHANGE ME]`.
- Dry run is the default or the first run.
- Rerunning causes no harm.
- No admin rights unless the brief says so; runs as a named least-privilege account.
- No passwords, keys or tokens anywhere.
- Failure produces a non-zero exit code and an alert.

## Output format

1. Plain-words steps (confirmed)
2. The full script, commented
3. How to run the dry run and what to look for
4. Scheduling steps
5. How to read the log and what each exit code means
6. Test plan with sign-off boxes

## Example of good output (short)

*Made-up business: Greywell Surveyors, Windows 11, PowerShell 7.*

```powershell
<#
Nightly copy of D:\Jobs to \\nas01\backup\jobs. Keeps 14 days of logs.
Run: .\Copy-Jobs.ps1 -WhatIf   (dry run)   |   .\Copy-Jobs.ps1   (live)
Exit codes: 0 ok, 1 copy failed, 2 settings problem.
#>
[CmdletBinding(SupportsShouldProcess)]
param()
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# --- Settings ---
$Source  = 'D:\Jobs'
$Dest    = '\\nas01\backup\jobs'
$LogDir  = 'C:\Logs\CopyJobs'
$KeepLogDays = 14

if (-not (Test-Path $Source)) { Write-Error "Source missing: $Source"; exit 2 }
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$Log = Join-Path $LogDir ("copy-{0:yyyyMMdd-HHmm}.log" -f (Get-Date))

if ($PSCmdlet.ShouldProcess($Dest, "Copy $Source (no deletes)")) {
    robocopy $Source $Dest /E /Z /R:2 /W:5 /NP "/LOG:$Log"
    if ($LASTEXITCODE -ge 8) { Write-Error "Robocopy failed ($LASTEXITCODE). See $Log"; exit 1 }
}

Get-ChildItem $LogDir -Filter 'copy-*.log' |
  Where-Object LastWriteTime -lt (Get-Date).AddDays(-$KeepLogDays) |
  ForEach-Object { if ($PSCmdlet.ShouldProcess($_.FullName, 'Delete old log')) { Remove-Item $_.FullName } }
exit 0
```

Note: this copies without `/MIR`, so nothing on the NAS is ever deleted. Ask before switching to a mirror.
