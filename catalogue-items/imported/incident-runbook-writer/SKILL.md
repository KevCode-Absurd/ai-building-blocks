---
name: incident-runbook-templates
description: "Adaptable templates for incident response runbooks covering detection, triage, mitigation, resolution, and communication."
risk: critical
source: community
date_added: "2026-02-27"
---
# Incident Runbook Templates

Adaptable templates for incident response runbooks covering detection, triage, mitigation, resolution, and communication.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase, a plan. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Do not use this skill when

- The task is unrelated to incident runbook templates
- You need a different domain or tool outside this scope

## Instructions

- Clarify goals, constraints, and required inputs.
- Apply relevant best practices and validate outcomes.
- Provide actionable steps and verification.

## Use this skill when

- Creating incident response procedures
- Building service-specific runbooks
- Establishing escalation paths
- Documenting recovery procedures
- Responding to active incidents
- Onboarding on-call engineers

## Core Concepts

### 1. Incident Severity Levels

| Severity | Impact | Response Time | Example |
|----------|--------|---------------|---------|
| **SEV1** | Complete outage, data loss | 15 min | Production down |
| **SEV2** | Major degradation | 30 min | Critical feature broken |
| **SEV3** | Minor impact | 2 hours | Non-critical bug |
| **SEV4** | Minimal impact | Next business day | Cosmetic issue |

**Before you start:** name who has authority to approve changes during an incident (the service owner or incident commander). Write that name into the runbook. No change command below should run without that person's approval.

### 2. Runbook Structure

```
1. Overview & Impact
2. Detection & Alerts
3. Initial Triage
4. Mitigation Steps
5. Root Cause Investigation
6. Resolution Procedures
7. Verification & Rollback
8. Communication Templates
9. Escalation Matrix
```

## Runbook prerequisites

Bind service, namespace, cluster context, database, owners, approved incident authority, evidence sources and rollback revision before adapting these templates. Thresholds, financial amounts, impact percentages and resolution messages are illustrative, never observed incident facts. The endpoints, environment variables and script paths in these templates (the feature-flag API, `STRIPE_CIRCUIT_BREAKER_ENABLED`, `RATE_LIMIT_ENABLED`) are placeholders, and no smoke test or rollback script is included. They do not exist in your stack by default. Write "your tested smoke test (not included)" and "your tested rollback (not included)" where a step needs one. Replace each with your own tested equivalent, or remove the step. Read-only triage comes first; mutations require an approved service-specific response. Verify actual smoke/rollback scripts in the target project before using them. No script is bundled or implied by this template.

## Runbook Templates

**Every command in these templates is a placeholder** for a payments service on Kubernetes. Do not run any of them as written. Replace each with your own tested equivalent, and get the service owner's approval before any command that changes anything. Read-only checks come first.

### Template 1: Service Outage Runbook

````markdown
# [Service Name] Outage Runbook

## Overview
**Service**: Payment Processing Service
**Owner**: Platform Team
**Slack**: #payments-incidents
**PagerDuty**: payments-oncall

## Impact Assessment
- [ ] Which customers are affected?
- [ ] What percentage of traffic is impacted?
- [ ] Are there financial implications?
- [ ] What's the blast radius?

## Detection
### Alerts
- `payment_error_rate > 5%` (PagerDuty)
- `payment_latency_p99 > 2s` (Slack)
- `payment_success_rate < 95%` (PagerDuty)

### Dashboards
- [Payment Service Dashboard](https://grafana/d/payments)
- [Error Tracking](https://sentry.io/payments)
- [Dependency Status](https://status.stripe.com)

## Initial Triage (First 5 Minutes)

### 1. Assess Scope
```bash
# Check service health
kubectl get pods -n payments -l app=payment-service

# Check recent deployments
kubectl rollout history deployment/payment-service -n payments

# Check error rates
curl -s "http://prometheus:9090/api/v1/query?query=sum(rate(http_requests_total{status=~'5..'}[5m]))"
```

### 2. Quick Health Checks
- [ ] Can you reach the service? `curl -I https://api.company.com/payments/health`
- [ ] Database connectivity? Check connection pool metrics
- [ ] External dependencies? Check Stripe, bank API status
- [ ] Recent changes? Check deploy history

### 3. Initial Classification
| Symptom | Likely Cause | Go To Section |
|---------|--------------|---------------|
| All requests failing | Service down | Section 4.1 |
| High latency | Database/dependency | Section 4.2 |
| Partial failures | Code bug | Section 4.3 |
| Spike in errors | Traffic surge | Section 4.4 |

## Mitigation Procedures

### 4.1 Service Completely Down
```bash
# Step 1: Check pod status
kubectl get pods -n payments

# Step 2: If pods are crash-looping, check logs
kubectl logs -n payments -l app=payment-service --tail=100

# Step 3: Check recent deployments
kubectl rollout history deployment/payment-service -n payments

# Step 4: ROLLBACK if recent deploy is suspect (CHANGES THE SYSTEM: needs owner approval)
kubectl rollout undo deployment/payment-service -n payments

# Step 5: Scale up if resource constrained (CHANGES THE SYSTEM: needs owner approval)
kubectl scale deployment/payment-service -n payments --replicas=[NUMBER]

# Step 6: Verify recovery
kubectl rollout status deployment/payment-service -n payments
```

### 4.2 High Latency
```bash
# Step 1: Check database connections
kubectl exec -n payments deploy/payment-service -- \
  curl localhost:8080/metrics | grep db_pool

# Step 2: Check slow queries (if DB issue)
psql -h $DB_HOST -U $DB_USER -c "
  SELECT pid, now() - query_start AS duration, query
  FROM pg_stat_activity
  WHERE state = 'active' AND now() - query_start > interval '5 seconds'
  ORDER BY duration DESC;"

# Step 3: Kill long-running queries if needed
# No generic query termination: identify an exact authorized PID/database/owner,
# reconfirm it is not our connection, then use the approved database runbook.

# Step 4: Check external dependency latency
curl -w "@curl-format.txt" -o /dev/null -s https://api.stripe.com/v1/health

# Step 5: Enable circuit breaker if dependency is slow (CHANGES THE SYSTEM: needs owner approval)
kubectl set env deployment/payment-service \
  STRIPE_CIRCUIT_BREAKER_ENABLED=true -n payments
```

### 4.3 Partial Failures (Specific Errors)
```bash
# Step 1: Identify error pattern
kubectl logs -n payments -l app=payment-service --tail=500 | \
  grep -i error | sort | uniq -c | sort -rn | head -20

# Step 2: Check error tracking
# Go to Sentry: https://sentry.io/payments

# Step 3: If specific endpoint, enable feature flag to disable (CHANGES THE SYSTEM: needs owner approval; placeholder endpoint, use your own tested one)
curl -X POST https://api.company.com/internal/feature-flags \
  -d '{"flag": "DISABLE_PROBLEMATIC_FEATURE", "enabled": true}'

# Step 4: If data issue, check recent data changes
psql -h $DB_HOST -c "
  SELECT * FROM audit_log
  WHERE table_name = 'payment_methods'
  AND created_at > now() - interval '1 hour';"
```

### 4.4 Traffic Surge
```bash
# Step 1: Check current request rate
kubectl top pods -n payments

# Step 2: Scale horizontally (CHANGES THE SYSTEM: needs owner approval)
kubectl scale deployment/payment-service -n payments --replicas=[NUMBER]

# Step 3: Enable rate limiting (CHANGES THE SYSTEM: needs owner approval)
kubectl set env deployment/payment-service \
  RATE_LIMIT_ENABLED=true \
  RATE_LIMIT_RPS=[LIMIT] -n payments

# Step 4: If attack, block suspicious IPs at your approved edge or WAF
# Do not apply a broad NetworkPolicy to the whole payments namespace during an incident:
# it can cut real traffic. Block the suspicious ranges where your team normally does,
# with the incident commander's approval.
```

## Verification Steps
```bash
# Verify service is healthy
curl -s https://api.company.com/payments/health | jq

# Verify error rate is back to normal
curl -s "http://prometheus:9090/api/v1/query?query=sum(rate(http_requests_total{status=~'5..'}[5m]))" | jq '.data.result[0].value[1]'

# Verify latency is acceptable
curl -s "http://prometheus:9090/api/v1/query?query=histogram_quantile(0.99,sum(rate(http_request_duration_seconds_bucket[5m]))by(le))" | jq

# Smoke test critical flows
[YOUR TESTED SMOKE TEST: no script is included in this skill, supply and test your own]
```

## Rollback Procedures
```bash
# Rollback Kubernetes deployment (CHANGES THE SYSTEM: needs owner approval)
kubectl rollout undo deployment/payment-service -n payments

# Rollback database migration (if applicable)
[YOUR TESTED DB ROLLBACK STEP: no script is included in this skill, supply and test your own, with $MIGRATION_VERSION]

# Rollback feature flag (CHANGES THE SYSTEM: needs owner approval; placeholder endpoint)
curl -X POST https://api.company.com/internal/feature-flags \
  -d '{"flag": "NEW_PAYMENT_FLOW", "enabled": false}'
```

## Escalation Matrix

| Condition | Escalate To | Contact |
|-----------|-------------|---------|
| > 15 min unresolved SEV1 | Engineering Manager | @manager (Slack) |
| Data breach suspected | Security Team | #security-incidents |
| Financial impact > [your threshold] | Finance + Legal | @finance-oncall |
| Customer communication needed | Support Lead | @support-lead |

## Communication Templates

### Initial Notification (Internal)
```
🚨 INCIDENT: Payment Service Degradation

Severity: SEV2
Status: Investigating
Impact: [X%] of payment requests failing
Start Time: [TIME]
Incident Commander: [NAME]

Current Actions:
- Investigating root cause
- Scaling up service
- Monitoring dashboards

Updates in #payments-incidents
```

### Status Update
```
📊 UPDATE: Payment Service Incident

Status: Mitigating
Impact: Reduced to [X%] failure rate
Duration: [MINUTES] minutes

Actions Taken:
- [ACTION TAKEN, from your incident log]
- [ACTION TAKEN, from your incident log]

Next Steps:
- Continuing to monitor
- Root cause analysis in progress

ETA to Resolution: [ETA, only if the incident commander has given one]
```

### Resolution Notification
```
✅ RESOLVED: Payment Service Incident

Duration: [MINUTES] minutes
Impact: [N] affected transactions
Root Cause: [ROOT CAUSE, confirmed by the team]

Resolution:
- [WHAT FIXED IT]
- [RESULT, confirmed from your records]

Follow-up:
- Postmortem scheduled for [DATE]
- Bug fix in progress
```
````

### Template 2: Database Incident Runbook

````markdown
# Database Incident Runbook

## Quick Reference
| Issue | Command |
|-------|---------|
| Check connections | `SELECT count(*) FROM pg_stat_activity;` |
| Query recovery | Identify exact PID/database/owner and use the approved recovery runbook |
| Check replication lag | `SELECT extract(epoch from (now() - pg_last_xact_replay_timestamp()));` |
| Check locks | `SELECT * FROM pg_locks WHERE NOT granted;` |

## Connection Pool Exhaustion
```sql
-- Check current connections
SELECT datname, usename, state, count(*)
FROM pg_stat_activity
GROUP BY datname, usename, state
ORDER BY count(*) DESC;

-- Identify long-running connections
SELECT pid, usename, datname, state, query_start, query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;

-- Inventory scoped idle connections; this query performs no termination.
SELECT pid, datname, usename, state, state_change
FROM pg_stat_activity
WHERE datname = current_database() AND pid <> pg_backend_pid()
  AND state = 'idle' AND state_change < now() - interval '10 minutes';
-- Do not terminate connections in bulk. Reconfirm ownership, transaction impact
-- and a specific approved recovery step with the database owner.
```

## Replication Lag
```sql
-- Check lag on replica
SELECT
  CASE
    WHEN pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() THEN 0
    ELSE extract(epoch from now() - pg_last_xact_replay_timestamp())
  END AS lag_seconds;

-- If lag > 60s, consider:
-- 1. Check network between primary/replica
-- 2. Check replica disk I/O
-- 3. Consider failover if unrecoverable
```

## Disk Space Critical
```bash
# Check disk usage
df -h /var/lib/postgresql/data

# Find large tables
psql -c "SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;"

# VACUUM to reclaim space
# VACUUM FULL requires an exclusive lock and extra disk space;
# never use it as a generic disk emergency remedy. Escalate to the DBA.

# If disk is still critical: do not delete data on your own.
# The incident commander approves any deletion or disk resize,
# a verified backup or rollback must exist first, and the DBA runs it.
```
````

## Best Practices

### Do's
- **Keep runbooks updated** - Review after every incident
- **Test runbooks regularly** - Game days, chaos engineering
- **Include rollback steps** - Always have an escape hatch
- **Document assumptions** - What must be true for steps to work
- **Link to dashboards** - Quick access during stress

### Don'ts
- **Don't assume knowledge** - Write for 3 AM brain
- **Don't skip verification** - Confirm each step worked
- **Don't forget communication** - Keep stakeholders informed
- **Don't work alone** - Escalate early
- **Don't skip postmortems** - Learn from every incident

## Resources

- [Google SRE Book - Incident Management](https://sre.google/sre-book/managing-incidents/)
- [PagerDuty Incident Response](https://response.pagerduty.com/)
- [Atlassian Incident Management](https://www.atlassian.com/incident-management)

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Action item tracker](https://useaiblocks.com/skills/executive-action-register). It takes the document.
- The [Stakeholder update writer](https://useaiblocks.com/skills/stakeholder-update-writer). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
