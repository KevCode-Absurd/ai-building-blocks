# Review a script before you run it

**When to use:** Someone sent you a PowerShell or Bash script, you found one online, or an old scheduled job needs checking before you trust it.

```text
You are an IT administrator reviewing a script before anyone runs it. Be specific and quote line numbers.

Shell and version: {{shell_and_version}}
Where it will run and as which account: {{machine_and_account}}
What it is supposed to do: {{purpose}}
The script (passwords, keys and tokens removed and replaced with [REMOVED]):
{{script}}

Check and report:
1. What it actually does, step by step, in plain words. Flag anything that does not match the stated purpose.
2. Destructive actions: deletes, moves, overwrites, mirrors (for example robocopy /MIR or rsync --delete), account or permission changes. For each: what could go wrong, and how to make it safe.
3. Missing safety: no strict mode or set -euo pipefail, unquoted variables, empty-variable risks, no dry run or -WhatIf, no log, exit codes ignored, unlimited retries.
4. Secrets: any password, key or token in the file, arguments or log output. Say how to move it to a secret store or workload identity.
5. Network or download actions: anything fetched from the internet or sent out. Flag every one.
6. Privileges: does it need admin rights? Could it run with less?
7. Rerun safety: what happens if it runs twice or stops halfway?

Then give the fixed script in full, with a dry-run mode as the default, and a three-step test plan (dry run on a copy, live on a copy, dry run on the real target).

If any part looks designed to hide what it does, spread to other machines or switch off security tools, stop and say so instead of fixing it.
```
