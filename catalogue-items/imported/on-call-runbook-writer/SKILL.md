---
name: runbook-creation
description: Create operational runbooks and standard operating procedures. Document
  troubleshooting guides and recovery procedures. Use when documenting operational
  knowledge.
category: security
risk: safe
source: https://github.com/BagelHole/DevOps-Security-Agent-Skills
source_repo: BagelHole/DevOps-Security-Agent-Skills
source_type: community
date_added: '2026-09-20'
license: MIT
license_source: https://github.com/BagelHole/DevOps-Security-Agent-Skills/blob/main/LICENSE
compatibility: Checklist and framework guidance; no privileged tooling required. Apply
  controls through your own change process.
metadata:
  author: devops-skills
  version: '1.0'
---

# Runbook Creation

Create effective operational runbooks, standard operating procedures, and
troubleshooting guides that any on-call engineer can follow under pressure.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Runbook Template — Full Structure

````markdown
# Runbook: [Service / Process Name]

**Owner:** [Team or individual]
**Last Reviewed:** YYYY-MM-DD
**Version:** X.Y
**Severity if unavailable:** SEV[1-4]

---

## Overview

Brief description of the service, why this runbook exists, and when to
use it.

## Prerequisites

- [ ] Required access / IAM role: [details]
- [ ] Tools installed: [kubectl, aws-cli, psql, etc.]
- [ ] VPN connected to [environment]
- [ ] Communication channel open: [Slack #channel]

## Procedure

### Step 1 — [Action Name]

[Explanation of what this step does and why.]

```bash
# command here
```

**Expected output:** [describe what success looks like]

### Step 2 — [Action Name]

```bash
# command here
```

**Expected output:** [description]

*(Continue with numbered steps...)*

## Verification

How to confirm the procedure succeeded:

- [ ] [Check 1 — e.g., health endpoint returns 200]
- [ ] [Check 2 — e.g., no errors in logs for 5 minutes]
- [ ] [Check 3 — e.g., metrics return to baseline]

## Rollback

If the procedure fails or causes unexpected issues:

### Rollback Step 1
```bash
# rollback command
```

### Rollback Step 2
```bash
# rollback command
```

## Troubleshooting

| Symptom | Likely Cause | Resolution |
|---------|-------------|------------|
| [symptom 1] | [cause] | [fix] |
| [symptom 2] | [cause] | [fix] |

## Escalation

If unresolved after [X] minutes:
- **Primary:** @[team-lead] — [phone/Slack]
- **Secondary:** @[manager] — [phone/Slack]

## Related Runbooks

- [Link to related runbook 1]
- [Link to related runbook 2]

## Change Log

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | [Name] | Initial version |
````

> **Warning: sample only.** The commands below scale deployments to zero, fence the old primary, promote a replica and change DNS. They can cause downtime or data loss. Never skip the fencing step: promoting while the old primary can still take writes splits your data. Hosts, IDs and phone numbers are placeholders. Run any step like this in staging first, and have a second person confirm before a production run.

## Overview

Failover the primary PostgreSQL instance to the synchronous replica when
the primary is unreachable or degraded. This runbook covers both planned
(maintenance) and unplanned (emergency) failover.

## Prerequisites

- [ ] DBA or SRE-level access to primary and replica hosts
- [ ] `psql` client installed (v14+)
- [ ] VPN connected to production network
- [ ] Slack channel #db-ops open
- [ ] Confirm replica is in sync: replication lag < 1 MB

## Procedure

### Step 1 — Verify Replica Health

```bash
psql -h replica.db.internal -U dba -d postgres -c \
  "SELECT pg_is_in_recovery(), pg_last_wal_replay_lsn();"
```

**Expected output:** `pg_is_in_recovery = t`, LSN advancing.

### Step 2 — Stop Application Writes

```bash
kubectl scale deployment api-server --replicas=0 -n production
kubectl scale deployment worker --replicas=0 -n production
```

**Expected output:** Deployments scaled to 0 pods.

### Step 3 — Confirm Write Quiesce and Catch-up

Planned failover only (skip the primary queries if it is unreachable):

```bash
psql -h primary.db.internal -U dba -d postgres -c \
  "SELECT count(*) FROM pg_stat_activity WHERE state = 'active' AND query !~ 'pg_stat';"
psql -h primary.db.internal -U dba -d postgres -c "SELECT pg_current_wal_lsn();"
psql -h replica.db.internal -U dba -d postgres -c "SELECT pg_last_wal_replay_lsn();"
```

**Expected output:** Count = 0 (no active queries), and the replica's replay LSN equals the primary's current LSN. If the primary is unreachable, record the replica's last replay LSN in the incident log: writes after it may be lost.

### Step 3b — Fence the Old Primary (required before promoting)

Two writable primaries cause split brain: both take writes and the data splits. Before you promote, make sure the old primary cannot accept writes or come back as a primary.

Planned failover: stop PostgreSQL on the old primary and stop it starting again on boot.

```bash
ssh primary.db.internal 'sudo systemctl stop postgresql && sudo systemctl disable postgresql'
pg_isready -h primary.db.internal
```

**Expected output:** `pg_isready` reports `no response`.

Unplanned failover (primary unreachable): "unreachable from here" does not mean "down". Fence it with a method that does not need the host to answer: power it off from the cloud console or out-of-band management, or cut it off from clients and replicas with a network or security-group change. Record who fenced it and how.

**Do not continue to Step 4 until fencing is confirmed by a second person.** Never restart the old primary as a primary later. Rebuild it as a replica (for example with `pg_rewind` or a fresh base backup) after the incident.

### Step 4 — Promote Replica

```bash
psql -h replica.db.internal -U dba -d postgres -c "SELECT pg_promote();"
```

Wait up to 30 seconds, then confirm:

```bash
psql -h replica.db.internal -U dba -d postgres -c "SELECT pg_is_in_recovery();"
```

**Expected output:** `pg_is_in_recovery = f` (no longer a replica).

### Step 5 — Update DNS

```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890 \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "db.internal.example.com",
        "Type": "CNAME",
        "TTL": 60,
        "ResourceRecords": [{"Value": "replica.db.internal"}]
      }
    }]
  }'
```

### Step 6 — Restart Application

```bash
kubectl scale deployment api-server --replicas=6 -n production
kubectl scale deployment worker --replicas=4 -n production
```

## Verification

- [ ] `psql -h db.internal.example.com -c "SELECT 1;"` returns successfully
- [ ] Application logs show successful DB connections (no errors for 5 min)
- [ ] Transaction throughput returns to baseline on Grafana dashboard
- [ ] No replication-lag alerts firing

## Rollback

If the promoted replica has issues, restore from the most recent backup. Note that this builds a new database from a snapshot. It does not undo the failover, and writes made since the snapshot are lost, so decide this with the DBA lead first:

```bash
# Restore latest automated snapshot (RDS example)
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier prod-db-restored \
  --db-snapshot-identifier prod-db-latest-snapshot
```

## Escalation

If unresolved after 15 minutes:
- **Primary:** @dba-lead — +1-555-0101
- **Secondary:** @platform-oncall — +1-555-0102
````

## Automation Scripts for Common Operations

### Service Health Check

```bash
#!/usr/bin/env bash
# health-check.sh — Check health of critical services
set -euo pipefail

SERVICES=(
  "https://api.example.com/healthz"
  "https://app.example.com/healthz"
  "https://admin.example.com/healthz"
)

EXIT_CODE=0

for url in "${SERVICES[@]}"; do
  HTTP_CODE=$(curl -so /dev/null -w '%{http_code}' --max-time 5 "$url" 2>/dev/null || echo "000")
  if [ "$HTTP_CODE" -eq 200 ]; then
    printf "  OK    %s\n" "$url"
  else
    printf "  FAIL  %s (HTTP %s)\n" "$url" "$HTTP_CODE"
    EXIT_CODE=1
  fi
done

exit $EXIT_CODE
```

### Log Collection for Incident Investigation

```bash
#!/usr/bin/env bash
# collect-logs.sh — Gather logs from multiple sources for incident review
set -euo pipefail

INCIDENT_ID="${1:?Usage: collect-logs.sh <incident-id>}"
OUTDIR="/tmp/incident-${INCIDENT_ID}"
mkdir -p "$OUTDIR"

echo "Collecting logs for incident $INCIDENT_ID..."

# Kubernetes pod logs (last 30 min)
kubectl logs -l app=api-server -n production --since=30m \
  > "${OUTDIR}/api-server-pods.log" 2>&1

# CloudWatch Logs (last 30 min)
aws logs filter-log-events \
  --log-group-name /ecs/production/api \
  --start-time "$(date -d '30 minutes ago' +%s)000" \
  --output text > "${OUTDIR}/cloudwatch-api.log" 2>&1

# Database slow query log
psql -h db.internal -U dba -d postgres -c \
  "SELECT * FROM pg_stat_activity WHERE state != 'idle' ORDER BY query_start;" \
  > "${OUTDIR}/db-active-queries.log" 2>&1

# System resource snapshot
kubectl top pods -n production > "${OUTDIR}/pod-resources.log" 2>&1

echo "Logs saved to $OUTDIR"
tar czf "${OUTDIR}.tar.gz" -C /tmp "incident-${INCIDENT_ID}"
echo "Archive: ${OUTDIR}.tar.gz"
```

### Certificate Expiry Check

```bash
#!/usr/bin/env bash
# cert-check.sh — Warn if TLS certificates expire within 30 days
set -euo pipefail

DOMAINS=(
  "api.example.com"
  "app.example.com"
  "admin.example.com"
)

WARN_DAYS=30
TODAY=$(date +%s)
EXIT_CODE=0

for domain in "${DOMAINS[@]}"; do
  EXPIRY=$(echo | openssl s_client -servername "$domain" -connect "${domain}:443" 2>/dev/null \
    | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
  EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || echo 0)
  DAYS_LEFT=$(( (EXPIRY_EPOCH - TODAY) / 86400 ))

  if [ "$DAYS_LEFT" -lt "$WARN_DAYS" ]; then
    printf "  WARN  %s expires in %d days (%s)\n" "$domain" "$DAYS_LEFT" "$EXPIRY"
    EXIT_CODE=1
  else
    printf "  OK    %s — %d days remaining\n" "$domain" "$DAYS_LEFT"
  fi
done

exit $EXIT_CODE
```

### Disk Space Cleanup

> **Warning: destructive.** This script deletes logs, temp files and unused Docker data. It runs as a dry run unless you pass `--apply`. Before applying, check the lists it prints against this host's retention policy (audit, security or legal logs may have to be kept), confirm the logs were already shipped to central storage, and check that no stopped container is needed for an investigation. Test it on a staging host and have a second person confirm before you run it on production. Never add `--volumes`.

```bash
#!/usr/bin/env bash
# disk-cleanup.sh — Free disk space on a host. Dry run unless --apply is given.
set -euo pipefail

# Set these from THIS host's retention policy. There are no defaults on purpose.
JOURNAL_KEEP="${JOURNAL_KEEP:?Set JOURNAL_KEEP from the retention policy, for example 7d}"
LOG_KEEP_DAYS="${LOG_KEEP_DAYS:?Set LOG_KEEP_DAYS from the retention policy}"
TMP_KEEP_DAYS="${TMP_KEEP_DAYS:?Set TMP_KEEP_DAYS for this host}"
APPLY=false
if [ "${1:-}" = "--apply" ]; then APPLY=true; fi

echo "=== Disk Usage Before ==="
df -h /

echo "=== Rotated logs in /var/log older than ${LOG_KEEP_DAYS} days ==="
find /var/log -name "*.gz" -mtime +"$LOG_KEEP_DAYS" -print
echo "=== Files in /tmp older than ${TMP_KEEP_DAYS} days ==="
find /tmp -xdev -type f -mtime +"$TMP_KEEP_DAYS" -print
echo "=== Journal size now ==="
journalctl --disk-usage
echo "=== Docker: prune removes stopped containers, unused networks, dangling images and build cache ==="
docker system df
docker ps -a --filter status=exited

if [ "$APPLY" != true ]; then
  echo "Dry run only. Nothing was deleted. Check the lists above, then rerun with --apply."
  exit 0
fi

journalctl --vacuum-time="$JOURNAL_KEEP"
docker system prune -f   # never add --volumes here
find /var/log -name "*.gz" -mtime +"$LOG_KEEP_DAYS" -delete
find /tmp -xdev -type f -mtime +"$TMP_KEEP_DAYS" -delete

echo "=== Disk Usage After ==="
df -h /
```

## Runbook Review Checklist

Use this checklist every time a runbook is created or updated.

```yaml
content_review:
  - [ ] Title clearly identifies the service and operation
  - [ ] Overview explains WHEN and WHY to use this runbook
  - [ ] Prerequisites list all required access, tools, and setup
  - [ ] Every step has a concrete command (no vague instructions)
  - [ ] Expected output is documented for each step
  - [ ] Verification section confirms success with specific checks
  - [ ] Rollback section exists and has been tested
  - [ ] Every delete or cleanup step shows what it will remove first (dry run) and checks it against this target's retention and backup rules
  - [ ] Every failover step fences the old primary before promoting the new one, and says how to rebuild the old one
  - [ ] Escalation contacts are current (names, phones, Slack handles)
  - [ ] Troubleshooting table covers the top 3-5 known failure modes

usability_review:
  - [ ] A new team member can follow the runbook without tribal knowledge
  - [ ] Steps are numbered and sequential (no branching without clear labels)
  - [ ] Commands can be copy-pasted (no placeholder values without explanation)
  - [ ] Time estimates included for long-running steps
  - [ ] No jargon or acronyms used without definition

maintenance_review:
  - [ ] Owner and last-reviewed date are set
  - [ ] Version number incremented
  - [ ] Change log entry added
  - [ ] Related runbooks section is up to date
  - [ ] Links to dashboards and docs are valid (not broken)
```

## Runbook Testing Procedures

```yaml
testing_strategy:
  dry_run:
    frequency: "Every time a runbook is created or substantially edited"
    method: "Walk through each step in a staging environment"
    goal: "Verify commands work and output matches documentation"

  peer_review:
    frequency: "Every edit"
    method: "Another engineer follows the runbook in staging without help"
    goal: "Confirm the runbook is self-contained and unambiguous"

  scheduled_validation:
    frequency: "Quarterly"
    method: "SRE team picks 5 runbooks at random, executes in staging"
    goal: "Catch runbooks that have drifted from production reality"

  incident_triggered:
    trigger: "Any time a runbook is used in a real incident"
    method: "Post-mortem includes runbook accuracy assessment"
    goal: "Capture improvements while the experience is fresh"

  automation_testing:
    method: "CI pipeline validates bash scripts with shellcheck and dry-run"
    example: |
      # .github/workflows/runbook-lint.yml
      name: Lint Runbook Scripts
      on: [pull_request]
      jobs:
        shellcheck:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v4
            - name: ShellCheck
              run: |
                find runbooks/ -name "*.sh" -exec shellcheck {} +
```



## When to Use

- Creating or updating operational runbooks, SOPs, on-call procedures, or incident recovery guides.

## Limitations

- Runbooks must be validated in staging; examples use placeholder hostnames and account IDs.
- Docs-only import: upstream template files are not bundled.

### Example

```markdown
Draft a SEV2 database failover runbook with prerequisites, verification, and rollback.
```

> Adapted from [BagelHole/DevOps-Security-Agent-Skills](https://github.com/BagelHole/DevOps-Security-Agent-Skills) (MIT); frontmatter, When to Use/Limitations, and safety boundaries added for upstream compliance. Docs-only import: helper scripts and templates not bundled.

## Licence note

The header above says MIT (BagelHole/DevOps-Security-Agent-Skills). The collection this copy came from lists its written content as CC BY 4.0 (see `LICENSE-CONTENT`). We share this copy under CC BY 4.0. Keep the credit to the author and sickn33.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Incident postmortem writer](https://useaiblocks.com/skills/incident-postmortem-writer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
