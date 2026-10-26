---
name: aws-cost-optimizer
description: "Comprehensive AWS cost analysis and optimization recommendations using AWS CLI and Cost Explorer"
risk: safe
source: community
date_added: "2026-02-27"
---

# AWS Cost Optimizer

Analyze AWS spending patterns, identify waste, and provide actionable cost reduction strategies. Based on the aws-cost-optimizer skill by sickn33 (CC-BY-4.0). Edited by AI Blocks to add inputs, a fixed output, and sign-off rules.

## When to Use This Skill

Use this skill when you need to analyze AWS spending, identify cost optimization opportunities, or reduce cloud waste.

Do not use it for a one-off look at this month's total (the AWS Billing console shows that faster), for another cloud (this skill is AWS only), or to change a live production system without a test environment.

## Before you start (inputs)

Ask once for anything missing. Never guess a value.

1. **Access.** AWS CLI signed in with read-only rights. A read-only policy is enough, such as the AWS managed policy `ReadOnlyAccess` or a narrower one your admin makes. Do not use admin keys for this.
2. **Time period.** Default to the last 3 months. Ask if the user wants a different span.
3. **Leave-alone list (optional).** Tags, accounts or resource IDs not to touch or flag.
4. **No CLI access?** Ask the user to export the Cost Explorer table (by service and by month) as CSV and any resource lists, and work from those. Mark every resource-level finding "from export, not checked live".

**Cost warning.** Cost Explorer API requests (`aws ce ...`) are billed per request. Run as few as you need, group by service first, and tell the user before you run more than a handful. Check the current price on the AWS Cost Explorer pricing page.

**Dates.** The commands below use `START` and `END` as placeholders in `YYYY-MM-DD`. Work out the dates yourself from today's date and write them in. Do not use `date -d`, which fails on macOS and Windows. Use `--start-time` and `--end-time` in UTC ISO format the same way.

## Core Capabilities

**Cost Analysis**
- Parse AWS Cost Explorer data for trends and anomalies
- Break down costs by service, region, and resource tags
- Identify month-over-month spending increases

**Resource Optimization**
- Detect idle EC2 instances (low CPU utilization)
- Find unattached EBS volumes and old snapshots
- Identify unused Elastic IPs
- Locate underutilized RDS instances
- Find old S3 objects eligible for lifecycle policies

**Savings Recommendations**
- Suggest Reserved Instance/Savings Plans opportunities
- Recommend instance rightsizing based on CloudWatch metrics
- Identify resources in expensive regions
- Calculate potential savings with specific actions

## AWS CLI Commands

All commands below only read. Run them one group at a time and show the user what you ran.

### Get Cost and Usage
```bash
# Cost by service for the period (replace START and END)
aws ce get-cost-and-usage \
  --time-period Start=START,End=END \
  --granularity MONTHLY \
  --metrics UnblendedCost \
  --group-by Type=DIMENSION,Key=SERVICE

# Daily costs for the current month (replace MONTH_START and TODAY)
aws ce get-cost-and-usage \
  --time-period Start=MONTH_START,End=TODAY \
  --granularity DAILY \
  --metrics UnblendedCost
```

### Find Unused Resources
```bash
# Unattached EBS volumes
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query 'Volumes[*].[VolumeId,Size,VolumeType,CreateTime]' \
  --output table

# Unused Elastic IPs
aws ec2 describe-addresses \
  --query 'Addresses[?AssociationId==null].[PublicIp,AllocationId]' \
  --output table

# Idle EC2 instances (requires CloudWatch). Replace the instance ID and the two times.
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=INSTANCE_ID \
  --start-time START_TIME \
  --end-time END_TIME \
  --period 86400 \
  --statistics Average

# EBS snapshots you own. Filter for those older than 90 days yourself from StartTime.
aws ec2 describe-snapshots \
  --owner-ids self \
  --query 'Snapshots[*].[SnapshotId,StartTime,VolumeSize]' \
  --output table
```

### Rightsizing Analysis
```bash
# List EC2 instances with their types
aws ec2 describe-instances \
  --query 'Reservations[*].Instances[*].[InstanceId,InstanceType,State.Name,Tags[?Key==`Name`].Value|[0]]' \
  --output table

# Get RDS instance utilization (replace the database name and the two times)
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name CPUUtilization \
  --dimensions Name=DBInstanceIdentifier,Value=DB_NAME \
  --start-time START_TIME \
  --end-time END_TIME \
  --period 86400 \
  --statistics Average,Maximum
```

Check the region of every command. Run it once per region the Cost Explorer table shows spend in.

## Optimization Workflow

1. **Baseline Assessment**
   - Pull 3-6 months of cost data
   - Identify top 5 spending services
   - Calculate growth rate

2. **Quick Wins (list only)**
   - Unattached EBS volumes
   - Unused Elastic IPs
   - Idle EC2 instances
   - Old snapshots
   For each one, list it with the evidence and a suggested action. **Do not stop, release or delete anything.** The user decides and runs any change themselves after the sign-off step.

3. **Strategic Optimization**
   - Analyze Reserved Instance coverage
   - Review instance types vs. workload
   - Implement S3 lifecycle policies
   - Consider Spot instances for non-critical workloads

4. **Ongoing Monitoring**
   - Set up AWS Budgets with alerts
   - Enable Cost Anomaly Detection
   - Tag resources for cost allocation
   - Monthly cost review meetings

## Sign-off before any change

Before you write a command that stops, terminates, releases or deletes anything, show the list of exact resource IDs and ask the user to confirm each one in writing ("yes, delete vol-..."). Use `--dry-run` when the command has it. Remind the user to take a snapshot or backup first. Never combine many deletions into one script. If the user has not confirmed, give the read-only list and stop.

## Output

Return, in this order:

1. **Spend summary.** Top 5 services by cost, the growth rate, and any month that jumped.
2. **Findings table**, sorted by estimated monthly saving, highest first. One row per resource or group:

| Resource ID | Type | Region | Why flagged | Est. monthly saving | Suggested action | Confidence |
|---|---|---|---|---|---|---|

   Confidence is High (measured in your data), Medium (measured over a short window) or Low (a rule of thumb). Mark any saving you could not measure "unknown". Do not invent a price.
3. **Commitment options.** Where a Savings Plan or Reserved Instance might pay off, with the usage it is based on and the points the user must check.
4. **Right-sizing list.** Instances that look too large, with the CPU figures you read.
5. **Not checked.** Regions, accounts, services or tags you could not read, so the user knows what the list does not cover.
6. **Next step.** The first three fixes to do, and a reminder to set up an AWS Budget alert.

## Cost Optimization Checklist

- [ ] Enable AWS Cost Explorer
- [ ] Set up cost allocation tags
- [ ] Create AWS Budget with alerts
- [ ] Review and delete unused resources (after sign-off)
- [ ] Analyze Reserved Instance opportunities
- [ ] Implement S3 Intelligent-Tiering
- [ ] Review data transfer costs
- [ ] Optimize Lambda memory allocation
- [ ] Use CloudWatch Logs retention policies
- [ ] Consider multi-region cost differences

## Example Prompts

**Analysis**
- "Show me AWS costs for the last 3 months broken down by service"
- "What are my top 10 most expensive resources?"
- "Compare this month's spending to last month"

**Optimization**
- "Find all unattached EBS volumes and calculate savings"
- "Identify EC2 instances with <5% CPU utilization"
- "Suggest Reserved Instance purchases based on usage"
- "Calculate savings from deleting snapshots older than 90 days"

**Implementation (only after sign-off)**
- "Write a script that lists the unattached volumes I approved, with a dry run first"
- "Set up a budget alert for the amount I name"
- "Generate a cost optimization report for leadership"

## Best Practices

- Always test in non-production first
- Verify resources are truly unused before deletion
- Document all cost optimization actions
- Calculate ROI for optimization efforts
- Automate recurring optimization tasks
- Use AWS Trusted Advisor recommendations
- Enable AWS Cost Anomaly Detection

## Safety Notes

- **Risk Level: Low** - Read-only analysis is safe
- **Deletion Actions: Medium Risk** - Always verify before deleting resources
- **Production Changes: High Risk** - Test rightsizing in dev/staging first
- Maintain backups before any deletion
- Use `--dry-run` flag when available

## Additional Resources

- [AWS Cost Optimization Best Practices](https://aws.amazon.com/pricing/cost-optimization/)
- [AWS Well-Architected Framework - Cost Optimization](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html)
- [AWS Cost Explorer API](https://docs.aws.amazon.com/cost-management/latest/APIReference/Welcome.html)

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
