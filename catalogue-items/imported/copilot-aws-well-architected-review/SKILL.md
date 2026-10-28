---
name: aws-well-architected-review
description: 'Perform an AWS Well-Architected Framework review of the current workload IaC and architecture, generating findings and GitHub issues for improvements.'
---

# AWS Well-Architected Review

This workflow performs a structured AWS Well-Architected Framework (WAF) review against your workload's IaC files and deployed infrastructure. It identifies risks across all 6 WAF pillars and creates GitHub issues to track remediation.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

**Makes it better (optional):**
- **A plan** (yours): the goals, steps, constraints and dates for this work.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A plan** with the [AWS resource cost reviewer](https://useaiblocks.com/skills/copilot-aws-cost-optimize). Bring a codebase.
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, a plan. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Prerequisites
- AWS CLI configured and authenticated, using a read-only AWS role or profile (for example the AWS ReadOnlyAccess or SecurityAudit policy). Do not use an admin role.
- IaC files present in the repository (Terraform, CloudFormation, CDK, or SAM)
- GitHub MCP server configured and authenticated, with a token limited to writing issues on the one named repository. Do not use a token with wider rights.

## Workflow Steps

### Step 1: Load Well-Architected Framework Reference
Fetch current AWS WAF best practices:
- `https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html`
- Pillar-specific lenses relevant to the workload type (Serverless, SaaS, etc.)

### Step 2: Discover IaC & Architecture
Scan the repository for IaC files:
- Terraform: `**/*.tf`
- CloudFormation/SAM: `**/*.yaml`, `**/*.json` (CFn templates)
- CDK: `lib/**/*.ts`, `bin/**/*.ts`, `cdk.json`

Identify key AWS services in use (compute, data, networking, security, observability) and generate a Mermaid architecture diagram.

### Step 3: Pillar-by-Pillar Review

Check each item below against the files or CLI output it names. If you cannot verify an item from what you can see, mark it "not checked". Never mark it as passed.

#### Pillar 1: Operational Excellence
- [ ] All infrastructure defined as IaC (no manual console changes)
- [ ] Consistent tagging strategy applied across all resources
- [ ] CloudWatch alarms defined for key metrics
- [ ] Automated deployment pipeline present (no manual deployments)
- [ ] CloudTrail enabled for audit logging
- [ ] Runbooks or operational documentation present

#### Pillar 2: Security
- [ ] IAM roles use least-privilege policies (no `*` actions without justification)
- [ ] No hardcoded credentials in IaC or code
- [ ] Secrets managed via Secrets Manager or SSM Parameter Store
- [ ] S3 buckets have public access blocked and server-side encryption enabled
- [ ] Sensitive resources placed in private subnets
- [ ] Security groups restrict inbound to minimum required ports/CIDRs
- [ ] KMS encryption enabled for sensitive data stores (RDS, EBS, S3, SQS, DynamoDB)
- [ ] SSL/TLS enforced on all endpoints (`enforceSSL: true`)
- [ ] GuardDuty enabled (`aws guardduty list-detectors`)
- [ ] AWS WAF configured on public-facing APIs and CloudFront distributions
- [ ] MFA delete enabled on critical S3 buckets

#### Pillar 3: Reliability
- [ ] Multi-AZ deployments for production databases (RDS Multi-AZ, DynamoDB Global Tables)
- [ ] Auto Scaling configured with appropriate policies for EC2/ECS
- [ ] S3 versioning and lifecycle policies configured
- [ ] RDS automated backups enabled with appropriate retention period
- [ ] DynamoDB Point-in-Time Recovery (PITR) enabled
- [ ] Dead Letter Queues (DLQ) configured for Lambda, SQS, SNS
- [ ] Route 53 health checks configured for DNS failover
- [ ] Lambda reserved concurrency set to prevent noisy-neighbor throttling

#### Pillar 4: Performance Efficiency
- [ ] Right-sized instance types (Lambda memory, EC2 type, RDS class)
- [ ] Graviton/ARM instances used where available (Lambda `arm64`, EC2 Graviton)
- [ ] Caching implemented (ElastiCache, DAX, CloudFront, API Gateway caching)
- [ ] CloudFront used for global static content delivery
- [ ] Aurora Serverless or DynamoDB On-Demand for variable load patterns
- [ ] Lambda Provisioned Concurrency for latency-critical synchronous paths

#### Pillar 5: Cost Optimization
- [ ] EC2 Reserved Instances or Savings Plans for steady-state workloads
- [ ] S3 lifecycle policies moving data to cheaper storage tiers
- [ ] Lambda `arm64` architecture adopted (20% cost reduction)
- [ ] VPC Endpoints for S3/DynamoDB to avoid NAT Gateway charges
- [ ] gp2 EBS volumes migrated to gp3 (same performance, 20% cheaper)
- [ ] Development/test environments have auto-shutdown schedules
- [ ] AWS Budgets and Cost Anomaly Detection configured
- [ ] Unattached EBS volumes and idle EC2 instances identified

#### Pillar 6: Sustainability
- [ ] Graviton/ARM instances selected where available
- [ ] Serverless/managed services preferred over always-on EC2
- [ ] S3 lifecycle policies reduce unnecessary long-term data storage
- [ ] Auto Scaling configured to avoid over-provisioning
- [ ] Region selection considers AWS renewable energy commitments

### Step 4: Risk Classification
For each finding, classify:
- **High Risk**: Security vulnerability, single point of failure, no backup/recovery
- **Medium Risk**: Suboptimal reliability, cost inefficiency, performance concern
- **Low Risk**: Best practice deviation, minor optimization opportunity

### Step 5: User Confirmation

```
🏗️ AWS Well-Architected Review Summary

📊 Review Results:
• IaC Files Analyzed: X
• AWS Services Identified: Y
• Total Findings: Z
  • High Risk: A (immediate action required)
  • Medium Risk: B (should address soon)
  • Low Risk: C (nice to have)

🔴 Top High Risk Findings:
1. [Pillar]: [Finding] — [Why it matters]
2. [Pillar]: [Finding] — [Why it matters]

💡 This will create Z individual GitHub issues + 1 EPIC issue.

❓ Proceed with creating GitHub issues? (y/n)
```

### Step 6: Create Individual Finding Issues
Label with "well-architected" and the pillar name (e.g., "security", "reliability").

**Title**: `[WAF-<PILLAR>] [Brief Finding] — [Risk Level]`

**Body**:
````markdown
## 🏗️ Well-Architected Finding: [Brief Title]

**Pillar**: [Name] | **Risk Level**: [High/Medium/Low] | **Effort**: [Low/Medium/High]

### 📋 Description
[Clear explanation of the finding and why it matters]

### 🔧 Remediation

**IaC Fix** (preferred):
```hcl
# Terraform example
resource "aws_s3_bucket_server_side_encryption_configuration" "example" {
  bucket = aws_s3_bucket.example.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}
```

**AWS CLI fallback**:
```bash
aws s3api put-bucket-encryption --bucket <name> \
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"aws:kms"}}]}'
```

### 📚 AWS Reference
- [WAF Best Practice Link]
- [AWS Documentation Link]

### ✅ Validation
- [ ] Change implemented in IaC and deployed
- [ ] AWS Config rule passes (if applicable)
- [ ] Security Hub finding resolved (if applicable)

**Well-Architected Question**: [WAF question this maps to]
````

### Step 7: Create EPIC Tracking Issue
Label with "well-architected" and "epic".

**Title**: `[EPIC] AWS Well-Architected Review — X findings across 6 pillars`

**Body**: Executive summary with pillar breakdown table (finding counts by pillar and risk level), Mermaid architecture diagram, prioritized checklist linking all individual issues (High → Medium → Low), and success criteria:
- All High-risk findings resolved
- Medium findings have accepted mitigation plans
- No regression in existing CloudWatch alarms or Config rules

## Error Handling
- **No IaC Files Found**: Limit review to live resource discovery via AWS CLI and note the gap
- **Insufficient AWS Permissions**: List required read-only permissions for the review
- **GitHub Creation Failure**: Output all findings as formatted markdown to console

## Success Criteria
- ✅ All 6 WAF pillars reviewed against IaC and live infrastructure
- ✅ All findings classified by risk level and pillar
- ✅ Actionable remediation steps with IaC examples for each finding
- ✅ GitHub issues created for team tracking
- ✅ Architecture diagram generated for EPIC context
- ✅ AWS documentation references included

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Azure architecture reviewer](https://useaiblocks.com/skills/copilot-azure-well-architected-review). It takes the plan.
- The [Service rollout and rollback planner](https://useaiblocks.com/skills/copilot-devops-rollout-plan). It takes the plan.
- The [Azure resource cost reviewer](https://useaiblocks.com/skills/copilot-az-cost-optimize). It takes the plan.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
