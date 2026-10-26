---
name: aws-cloudwatch-investigation
description: >
  Reusable investigation patterns for AWS CloudWatch: Logs Insights query templates,
  alarm-to-deployment correlation, blast-radius narrowing decision tree, and
  PromQL-style metric query patterns for structured incident triage.
---

# AWS CloudWatch Investigation Skill

Reusable patterns for investigating production incidents using CloudWatch Logs, Metrics, and Alarms. These patterns are designed to be composed together during incident triage.

---

## When not to use (added by AI Blocks)

- The problem is your AWS bill, not an outage. Use the Cloud bill waste finder or the AWS resource cost reviewer.
- You want a full health check and a fix plan for one resource. Use the AWS service health investigator. This skill collects evidence and a timeline; it does not write the fix plan.
- You have no CloudWatch logs or metrics for the time of the incident. Nothing here can recover data that was never recorded.

## Before you start (inputs, added by AI Blocks)

Ask once for anything missing. Mark what you could not get as MISSING. Never invent a name, time or number.

1. The alarm name, and the exact time it went into ALARM, with its time zone.
2. The AWS account, region and service (Lambda, ECS, API Gateway and so on).
3. The log group names for the service (optional; search for them if not given).
4. Access: read-only rights to CloudWatch Logs, Metrics and Alarm history, and to CloudTrail. CloudTrail Lake is a separate paid feature, so tell the user before you use it; recent CloudTrail events from `LookupEvents` are the default.
5. No AWS access? Ask the user to run each query in the console and paste the result back, one query at a time.

Replace every `<ANGLE_BRACKET>` value below with the user's real value before you run a query.

## What you hand back (added by AI Blocks)

1. **Timeline.** The first change, the first error, the first metric spike and the alarm time, in order, each with its source.
2. **Blast radius.** Account, region, service, operation and resource, narrowed one step at a time, with the evidence for each.
3. **Deploy link.** Any deploy or change in the 30 minutes before the alarm, rated STRONG, WEAK or NONE, with the reason.
4. **Queries run.** Every query and its result, so the user can run it again.
5. **Root event, or "not found".** Name the earliest change before all symptoms. If the evidence does not show one, say so.
6. **MISSING list and next step.** What you could not read. Then pass the root event to a rollback decision or a post-incident review.

## Pattern 1: Logs Insights Query Templates

### Error Spike Detection

Find the top errors in a time window, grouped by error type:

```
fields @timestamp, @message, @logStream
| filter @message like /(?i)(error|exception|fatal|critical)/
| stats count(*) as errorCount by bin(5m), @logStream
| sort errorCount desc
| limit 20
```

### P99 Latency Breakdown by Operation

Identify which operations are driving latency spikes:

```
fields @timestamp, @duration, operation
| filter ispresent(@duration)
| stats avg(@duration) as avgMs,
        pct(@duration, 50) as p50Ms,
        pct(@duration, 95) as p95Ms,
        pct(@duration, 99) as p99Ms,
        count(*) as invocations
  by operation
| sort p99Ms desc
| limit 15
```

### Lambda Cold Start Detection

Quantify cold start impact during an incident:

```
fields @timestamp, @duration, @initDuration, @memorySize, @maxMemoryUsed
| filter ispresent(@initDuration)
| stats count(*) as coldStarts,
        avg(@initDuration) as avgInitMs,
        max(@initDuration) as maxInitMs,
        avg(@duration) as avgDurationMs
  by bin(5m)
| sort @timestamp desc
```

### Out-of-Memory (OOM) Detection

Find Lambda functions or containers killed by memory pressure:

```
fields @timestamp, @message, @logStream, @memorySize, @maxMemoryUsed
| filter @message like /Runtime exited|out of memory|OOMKilled|Cannot allocate memory|MemoryError/
| stats count(*) as oomEvents by @logStream, bin(10m)
| sort oomEvents desc
| limit 10
```

For memory utilization trending before OOM:

```
fields @timestamp, @maxMemoryUsed, @memorySize
| filter ispresent(@maxMemoryUsed)
| stats max(@maxMemoryUsed / @memorySize * 100) as peakMemPct,
        avg(@maxMemoryUsed / @memorySize * 100) as avgMemPct
  by bin(5m)
| sort @timestamp desc
```

### Timeout Detection

Find invocations that hit the configured timeout. Replace 28000 with your function's own timeout in milliseconds, minus a small margin:

```
fields @timestamp, @duration, @logStream, @requestId
| filter @message like /Task timed out/ or @duration > 28000
| stats count(*) as timeouts by @logStream, bin(5m)
| sort timeouts desc
```

---

## Pattern 2: Alarm History to Deploy-Event Correlation

### Process

1. **Get alarm transition time** — note the exact timestamp when the alarm entered ALARM state.
2. **Query CloudTrail** for deployment-related events in a window of [alarm_time - 30min, alarm_time]:

```
# CloudTrail Lake query for deployment events (CloudTrail Lake is a paid AWS feature; confirm with the user first)
SELECT eventTime, eventName, userIdentity.arn, requestParameters
FROM <event-data-store-id>
WHERE eventTime > '<alarm_time_minus_30m>'
  AND eventTime < '<alarm_time>'
  AND eventName IN (
    'UpdateFunctionCode', 'UpdateFunctionConfiguration',
    'UpdateService', 'CreateDeployment', 'RegisterTaskDefinition',
    'CreateChangeSet', 'ExecuteChangeSet',
    'StartPipelineExecution', 'PutImage'
  )
ORDER BY eventTime DESC
```

3. **Correlation criteria** — a deploy is "correlated" if:
   - It targets the same service/resource as the alarm
   - It completed within 15 minutes before the alarm transition
   - The deployer identity matches a CI/CD role (not a human applying a hotfix)

4. **Strengthening the correlation:**
   - Check if the same alarm was healthy in the previous deployment cycle
   - Verify no other environmental changes (scaling events, config changes) in the same window
   - Look for canary/synthetic monitor failures that started at the same time

### Output Format

Layout only. Every value in angle brackets is filled from the real data. Never copy a placeholder into a report.

```
Deploy Correlation:
  Event: <event name>
  Time: <timestamp> (<n> min before alarm)
  Actor: <ARN of the role or user>
  Resource: <ARN of the resource>
  Correlation: <STRONG, WEAK or NONE> because <same resource, CI/CD actor, alarm was OK prior cycle>
```

---

## Pattern 3: Narrow the Blast Radius Decision Tree

Use this tree to systematically scope an incident from broadest to most specific:

```
START
  |
  v
[1] ACCOUNT — Which account(s) show the alarm?
  |  - Check: Are alarms firing in multiple accounts?
  |  - If yes → suspect shared service (SSO, networking, shared deployment pipeline)
  |  - If no → proceed to Region
  v
[2] REGION — Which region(s) are affected?
  |  - Check: Same alarm in other regions?
  |  - If multi-region → suspect global service (IAM, Route53, S3 global)
  |  - If single-region → proceed to Service
  v
[3] SERVICE — Which service namespace shows degradation?
  |  - Check CloudWatch namespace: AWS/Lambda, AWS/ECS, AWS/ApiGateway, etc.
  |  - If multiple services → suspect shared dependency (VPC, NAT, DNS, IAM)
  |  - If single service → proceed to Operation
  v
[4] OPERATION — Which API action or function is failing?
  |  - For Lambda: which function name?
  |  - For ECS: which service/task definition?
  |  - For API GW: which stage/resource/method?
  |  - If all operations → suspect service-level issue (throttling, quota)
  |  - If specific operation → proceed to Resource
  v
[5] RESOURCE — Which specific resource instance?
     - Function ARN, Task ID, DB instance identifier
     - This is your investigation target
     - Proceed to log and trace analysis scoped to this resource
```

### Shared Dependency Investigation

When blast radius spans multiple services, investigate in this order:

1. **VPC/Networking** — NAT Gateway ErrorPortAllocation, packet drops, DNS resolution failures
2. **IAM/STS** — ThrottlingException on AssumeRole, token vending latency
3. **Downstream dependency** — shared database, cache, or external API
4. **Deployment pipeline** — simultaneous deploys across services from same pipeline run
5. **AWS service event** — check AWS Health Dashboard and Service Health for the region

---

## Pattern 4: PromQL-Style Metric Query Patterns

These patterns use CloudWatch metric math and GetMetricData to build composite signals. Express them as metric queries for dashboards or programmatic retrieval.

### Error Rate as Percentage

```
MetricDataQueries:
  - Id: errors
    MetricStat:
      Metric:
        Namespace: AWS/Lambda
        MetricName: Errors
        Dimensions: [{Name: FunctionName, Value: TARGET}]
      Period: 60
      Stat: Sum
  - Id: invocations
    MetricStat:
      Metric:
        Namespace: AWS/Lambda
        MetricName: Invocations
        Dimensions: [{Name: FunctionName, Value: TARGET}]
      Period: 60
      Stat: Sum
  - Id: error_rate
    Expression: "errors / invocations * 100"
    Label: "Error Rate %"
```

### Latency Anomaly Detection (Compare to Baseline)

```
MetricDataQueries:
  - Id: current_p99
    MetricStat:
      Metric:
        Namespace: AWS/Lambda
        MetricName: Duration
        Dimensions: [{Name: FunctionName, Value: TARGET}]
      Period: 300
      Stat: p99
  - Id: baseline_p99
    MetricStat:
      Metric:
        Namespace: AWS/Lambda
        MetricName: Duration
        Dimensions: [{Name: FunctionName, Value: TARGET}]
      Period: 300
      Stat: p99
    # Use StartTime/EndTime set to same window last week
  - Id: anomaly_ratio
    Expression: "current_p99 / baseline_p99"
    Label: "Latency vs Baseline (ratio > 2 = anomaly)"
```

### Throttling Pressure Score

Combine multiple throttling signals into a single pressure metric:

```
MetricDataQueries:
  - Id: lambda_throttles
    MetricStat:
      Metric: {Namespace: AWS/Lambda, MetricName: Throttles}
      Period: 60
      Stat: Sum
  - Id: api_gw_429s
    MetricStat:
      Metric: {Namespace: AWS/ApiGateway, MetricName: 4XXError, Dimensions: [{Name: ApiName, Value: TARGET}]}
      Period: 60
      Stat: Sum
  - Id: dynamo_throttles
    MetricStat:
      Metric: {Namespace: AWS/DynamoDB, MetricName: ThrottledRequests, Dimensions: [{Name: TableName, Value: TARGET}]}
      Period: 60
      Stat: Sum
  - Id: throttle_pressure
    Expression: "lambda_throttles + api_gw_429s + dynamo_throttles"
    Label: "Combined Throttle Pressure"
```

### Concurrent Execution Headroom

```
MetricDataQueries:
  - Id: concurrent
    MetricStat:
      Metric: {Namespace: AWS/Lambda, MetricName: ConcurrentExecutions}
      Period: 60
      Stat: Maximum
  - Id: headroom
    Expression: "<ACCOUNT_LIMIT> - concurrent"
    Label: "Remaining Concurrency (replace <ACCOUNT_LIMIT> with the limit shown in your own account)"
```

---

## Pattern 5: Incident Timeline Reconstruction

### Process

Reconstruct a precise timeline by merging data from multiple sources:

1. **Collect timestamps:**

| Source | Query | Yields |
|--------|-------|--------|
| CloudWatch Alarms | Alarm history API | State transition times |
| CloudWatch Metrics | GetMetricData with 1-min period | First anomaly point |
| CloudWatch Logs | Logs Insights with `earliest(@timestamp)` | First error occurrence |
| CloudTrail | LookupEvents filtered by time | Deployment/change events |
| AWS Health | DescribeEvents | AWS-side incidents |

2. **Build the timeline:**

```
fields @timestamp, @message
| filter @message like /ERROR|WARN|timeout|refused|denied/
| stats earliest(@timestamp) as firstSeen, latest(@timestamp) as lastSeen, count(*) as occurrences
  by @message
| sort firstSeen asc
| limit 20
```

3. **Identify the sequence:**

Layout only. Fill each line from the real data and leave out a line you have no evidence for:

```
Timeline:
  T-<n>m: CloudTrail - <change event> by <role>
  T-<n>m: Logs - first error "<message>"
  T-<n>m: Metrics - <metric> crosses <threshold>
  T-<n>m: Alarm - <alarm name> enters ALARM
  T-<n>m: Metrics - <metric> spikes to <value>
  T-0:   Current - <state of the alarm and the error rate>
```

4. **Determine root event** — the earliest change that preceded all symptoms. Walk backward from the first symptom to the most recent mutation (deploy, config change, scaling event, or external dependency shift).

### Gotchas

- CloudWatch metric timestamps are end-of-period. A 1-minute datapoint at 14:05 covers 14:04-14:05.
- CloudTrail events can have up to 15-minute delivery delay. Use `eventTime`, not ingestion time.
- Log group timestamps depend on the agent/SDK flush interval. Allow for 30-60s of clock skew.
- Alarm state changes have a built-in evaluation delay (periods x evaluation periods). The actual anomaly started earlier.
