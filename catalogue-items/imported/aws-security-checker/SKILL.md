---
name: aws-security-audit
description: "Comprehensive AWS security posture assessment using AWS CLI and security best practices"
category: security
risk: safe
source: community
tags: "[aws, security, audit, compliance, kiro-cli, security-assessment]"
date_added: "2026-02-27"
---

# AWS Security Audit

Perform a security check of an AWS environment to find vulnerabilities and misconfigurations. All commands below only read.

## When to Use
Use this skill when you need to check AWS security posture, find vulnerabilities, or prepare for a compliance review.

## When not to use
- A formal audit, a compliance sign-off or a penetration test. This is a first-pass check by reading settings. It does not test attacks, and it does not replace AWS Security Hub, a licensed auditor or a security professional.
- Only IAM policy review. Use the AWS access policy reviewer for that.
- Cost, speed or design questions. Use the AWS workload practice reviewer.

## Inputs (ask once, never guess)
1. **AWS CLI access with read-only permissions** (for example the `SecurityAudit` and `ViewOnlyAccess` managed policies). Never ask for access keys in chat. If the AI cannot run commands, ask the user to run the commands and paste the output, with account IDs and names they do not want shared removed.
2. **Region or regions to check.** EC2, RDS, KMS and many other services are per region. If not given, ask. If the user does not answer, check only the default region and say so in the report. IAM and S3 listing are global.
3. **Compliance framework in scope** (optional): CIS, PCI-DSS or HIPAA.

If a command fails with access denied, record the check as `NOT RUN (access denied)`. Never report a clean result for a check that did not run.

## Audit Categories

**Identity & Access Management**
- Overly permissive IAM policies
- Unused IAM users and roles
- MFA enforcement gaps
- Root account usage
- Access key rotation

**Network Security**
- Open security groups (0.0.0.0/0 and ::/0)
- Public S3 buckets
- VPC flow logs disabled
- Network ACL misconfigurations

**Data Protection**
- Unencrypted EBS volumes
- Unencrypted RDS instances
- S3 bucket encryption disabled
- Public database snapshots
- KMS key rotation disabled

**Logging & Monitoring**
- CloudTrail disabled
- CloudWatch alarms missing
- S3 access logging disabled
- Config recording disabled

## Security Audit Commands
Each command is a lead. Read the output, and say which checks you ran and which you skipped.

### IAM Security Checks

```bash
# Credential report: generate it, then read it. Columns are found by header name.
aws iam generate-credential-report >/dev/null
aws iam get-credential-report --query Content --output text | base64 --decode > credential-report.csv

# Users with a console password and no MFA
awk -F, 'NR==1{for(i=1;i<=NF;i++)c[$i]=i; next}
         $c["password_enabled"]=="true" && $c["mfa_active"]=="false" {print $1}' credential-report.csv

# Root account: MFA status and whether it has access keys (both should be safe)
awk -F, 'NR==1{for(i=1;i<=NF;i++)c[$i]=i; next}
         $1=="<root_account>" {print "root mfa_active=" $c["mfa_active"], "key1=" $c["access_key_1_active"], "key2=" $c["access_key_2_active"]}' credential-report.csv
aws iam get-account-summary --query 'SummaryMap.AccountAccessKeysPresent'

# Users with no password use or key use for 90 days or more (read the dates, then decide)
awk -F, 'NR==1{for(i=1;i<=NF;i++)c[$i]=i; next}
         {print $1, "password_last_used=" $c["password_last_used"], "key1_last_used=" $c["access_key_1_last_used_date"]}' credential-report.csv

# Access keys: when each was last rotated
awk -F, 'NR==1{for(i=1;i<=NF;i++)c[$i]=i; next}
         $c["access_key_1_active"]=="true" {print $1, "key1_last_rotated=" $c["access_key_1_last_rotated"]}' credential-report.csv

# Who has the AdministratorAccess managed policy
aws iam list-entities-for-policy --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

### Network Security Checks

```bash
# Security groups open to the world (IPv4 and IPv6). Run once per region with --region.
aws ec2 describe-security-groups \
  --query 'SecurityGroups[?IpPermissions[?IpRanges[?CidrIp==`0.0.0.0/0`] || Ipv6Ranges[?CidrIpv6==`::/0`]]].[GroupId,GroupName]' \
  --output table

# Public S3 buckets: check Block Public Access, the bucket policy status and the ACL
aws s3api list-buckets --query 'Buckets[*].Name' --output text | tr '\t' '\n' | \
while read bucket; do
  pab=$(aws s3api get-public-access-block --bucket "$bucket" 2>&1)
  pol=$(aws s3api get-bucket-policy-status --bucket "$bucket" --query 'PolicyStatus.IsPublic' --output text 2>&1)
  acl=$(aws s3api get-bucket-acl --bucket "$bucket" 2>&1)
  echo "$bucket | policy public: $pol"
  echo "$pab" | grep -q "NoSuchPublicAccessBlockConfiguration" && echo "  no Block Public Access set: $bucket"
  echo "$acl" | grep -q "AllUsers" && echo "  PUBLIC ACL: $bucket"
done

# VPC Flow Logs status
aws ec2 describe-vpcs --query 'Vpcs[*].VpcId' --output text | tr '\t' '\n' | \
while read vpc; do
  flow_logs=$(aws ec2 describe-flow-logs --filter "Name=resource-id,Values=$vpc" --query 'FlowLogs[*].FlowLogId' --output text)
  [ -z "$flow_logs" ] && echo "No flow logs: $vpc"
done

# RDS instances that are publicly accessible
aws rds describe-db-instances --query 'DBInstances[?PubliclyAccessible==`true`].[DBInstanceIdentifier]' --output table
```

### Data Protection Checks

```bash
# Unencrypted EBS volumes
aws ec2 describe-volumes --query 'Volumes[?Encrypted==`false`].[VolumeId,Size,State]' --output table

# RDS instances without encryption
aws rds describe-db-instances --query 'DBInstances[?StorageEncrypted==`false`].[DBInstanceIdentifier]' --output table

# S3 buckets with no default encryption
aws s3api list-buckets --query 'Buckets[*].Name' --output text | tr '\t' '\n' | \
while read bucket; do
  aws s3api get-bucket-encryption --bucket "$bucket" 2>&1 | grep -q "ServerSideEncryptionConfigurationNotFoundError" \
    && echo "No default encryption: $bucket"
done

# Public manual RDS snapshots
aws rds describe-db-snapshots --snapshot-type manual --query 'DBSnapshots[*].DBSnapshotIdentifier' --output text | tr '\t' '\n' | \
while read snapshot; do
  attrs=$(aws rds describe-db-snapshot-attributes --db-snapshot-identifier "$snapshot" \
    --query 'DBSnapshotAttributesResult.DBSnapshotAttributes[?AttributeName==`restore`].AttributeValues' --output text)
  echo "$attrs" | grep -qw "all" && echo "PUBLIC SNAPSHOT: $snapshot"
done

# KMS key rotation for customer-managed keys (AWS-managed keys return an error here; ignore those)
aws kms list-keys --query 'Keys[*].KeyId' --output text | tr '\t' '\n' | \
while read key; do
  rotation=$(aws kms get-key-rotation-status --key-id "$key" --query 'KeyRotationEnabled' --output text 2>/dev/null)
  [ "$rotation" = "False" ] && echo "Rotation disabled: $key"
done
```

### Logging & Monitoring Checks

```bash
# CloudTrail: list trails, then check each one is logging
aws cloudtrail describe-trails --query 'trailList[*].[Name,IsMultiRegionTrail,LogFileValidationEnabled]' --output table
aws cloudtrail describe-trails --query 'trailList[*].Name' --output text | tr '\t' '\n' | \
while read trail; do
  echo "$trail logging: $(aws cloudtrail get-trail-status --name "$trail" --query 'IsLogging' --output text)"
done
# If describe-trails returns nothing, CloudTrail is not set up in this region: report as Critical.

# AWS Config recorder
aws configservice describe-configuration-recorders --query 'ConfigurationRecorders[*].[name,roleARN]' --output table

# S3 buckets without access logging
aws s3api list-buckets --query 'Buckets[*].Name' --output text | tr '\t' '\n' | \
while read bucket; do
  aws s3api get-bucket-logging --bucket "$bucket" 2>&1 | grep -q "LoggingEnabled" || echo "No access logging: $bucket"
done
```

## One-run script (optional)
Prints counts for a quick look. It changes nothing. Add `--region <region>` to the regional calls.

```bash
#!/bin/bash
echo "=== AWS Security Audit Report ==="
echo "Generated: $(date)"

echo "## IAM"
aws iam generate-credential-report >/dev/null
aws iam get-credential-report --query Content --output text | base64 --decode | \
  awk -F, 'NR==1{for(i=1;i<=NF;i++)c[$i]=i; next} $c["password_enabled"]=="true" && $c["mfa_active"]=="false" {print "  no MFA: " $1}'
echo "Root account access keys present (0 is good): $(aws iam get-account-summary --query 'SummaryMap.AccountAccessKeysPresent' --output text)"

echo "## Network"
echo "Security groups open to 0.0.0.0/0: $(aws ec2 describe-security-groups --query 'SecurityGroups[?IpPermissions[?IpRanges[?CidrIp==`0.0.0.0/0`]]].GroupId' --output text | wc -w)"

echo "## Data protection"
echo "Unencrypted EBS volumes: $(aws ec2 describe-volumes --query 'Volumes[?Encrypted==`false`].VolumeId' --output text | wc -w)"
echo "Unencrypted RDS instances: $(aws rds describe-db-instances --query 'DBInstances[?StorageEncrypted==`false`].DBInstanceIdentifier' --output text | wc -w)"

echo "## Logging"
aws cloudtrail describe-trails --query 'trailList[*].[Name,IsMultiRegionTrail]' --output table
echo "=== End of report ==="
```
(`wc -w` counts the IDs on one line. `wc -l` would give 1 for any result.)

## Severity tally (replaces a numeric score)
Do not compute a single security score. A score hides which gap matters. Instead, finish with a count by severity, such as "2 Critical, 3 High, 4 Medium, 1 check not run". Say that the counts show what this check found, and that a clean result for the checks run does not mean the account is secure.

## Compliance Mapping (starting points only)
Name the area a finding relates to. Give a control number only if you are sure of it for the current version of the framework, and tell the user to confirm it. Do not claim the account meets or fails a framework.

**CIS AWS Foundations Benchmark**: root account use, IAM policies and MFA, logging (CloudTrail, Config, VPC Flow Logs), monitoring and alerting

**PCI-DSS**: network security controls, secure configurations, access control and MFA, logging and monitoring

**HIPAA**: access controls (IAM), audit controls (CloudTrail), encryption (EBS, RDS, S3), transmission security (TLS)

## Remediation Priorities (suggested order)

**Critical (fix first)**
- Root account access keys
- Public RDS snapshots
- Security groups open to 0.0.0.0/0 on sensitive ports (SSH, RDP, databases)
- CloudTrail disabled

**High (fix within about a week)**
- Users without MFA
- Unencrypted data at rest
- Missing VPC Flow Logs
- Overly permissive IAM policies

**Medium (fix within about a month)**
- Old access keys (more than 90 days)
- Missing S3 access logging
- Unused IAM users
- KMS key rotation disabled

These timeframes are a common starting rule, not a standard. The user should set their own. Every fix command goes to the user to review and run. Do not run fixes yourself.

## Output Format
Return in this order.

1. **Scope.** Account (masked), regions checked, checks run, checks not run and why.
2. **Findings, ranked.**

   | # | Severity | Finding | Resource | Evidence (command and what it returned) | Fix | Framework area |
   |---|----------|---------|----------|------------------------------------------|-----|----------------|

   Fix is one specific command or console step the user can review. For a finding you could not confirm, write `UNCONFIRMED` and say how to confirm.
3. **Severity tally.** Counts only, with the clean-result caveat above.
4. **Fix order.** The top five actions, in order, with the effort for each (minutes, hours, days).
5. **Next steps.** What to re-run after fixes, and what this check could not see (for example application code, data inside buckets, and other accounts).

## Example Prompts

- "Run a security check on my AWS account"
- "Check for IAM security issues"
- "Find all unencrypted resources"
- "Make a security compliance summary"

## Best Practices

- Run the check regularly, for example every month
- Automate with Lambda/EventBridge once you trust the commands
- Export results to S3 for trending
- Track remediation progress
- Document exceptions with a business reason

## Additional Resources

- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
- [CIS AWS Foundations Benchmark](https://www.cisecurity.org/benchmark/amazon_web_services)
- [AWS Security Hub](https://aws.amazon.com/security-hub/)

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
