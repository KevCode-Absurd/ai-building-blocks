---
name: aws-iam-best-practices
description: "IAM policy review, hardening, and least privilege implementation"
category: security
risk: safe
source: community
tags: "[aws, iam, security, access-control, kiro-cli, least-privilege]"
date_added: "2026-02-27"
---

# AWS IAM Best Practices

Review and harden IAM policies following AWS security best practices and least privilege principles.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a tool connection. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **AWS IAM Policy Simulator:** Lets you test a replacement policy before you attach it.
- **AWS IAM Access Analyzer:** Confirms what outside access your policies give.
- **Any good chat AI:** Reviews pasted policy JSON without any setup.
<!-- /needs -->

## When to Use
Use this skill when you need to review IAM policies, implement least privilege access, or harden IAM security.

## When not to use
- A full audit of a live account. This skill checks IAM only. Use the AWS security checker for network, data and logging checks, and a security professional for a formal audit.
- Applying changes for you. It writes proposed policies. A person reviews and attaches them.
- Anything that needs a policy tested against real traffic. Test in a non-production account first.

## Inputs (ask once, never guess)
1. **The policies to review.** Either pasted IAM policy JSON, or read-only AWS CLI access to the account. If the user has neither, ask for one. Do not guess at policy contents.
2. **What each user or role must do** (for example, "the developer reads and writes one S3 bucket"). If missing, mark replacement policies as `DRAFT: needs the real task list` and ask.
3. **Compliance rules in scope** (optional).

Never ask the user to paste access keys or secrets into chat. If a command output contains a secret (such as the result of `create-access-key`), tell the user to keep it out of chat and logs.

## How to run the checks
- **Pasted policies (no CLI).** Read each statement by eye. Flag the items in "What to flag" below.
- **Live account (read-only CLI).** Run the commands in "IAM Security Checks". They only read. Needs `iam:List*`, `iam:Get*` and `iam:GenerateCredentialReport`. If a command fails with access denied, report which check was skipped. Do not guess the result.
- Shell checks can miss things. Treat each result as a lead and say which checks you could not run. `jq` is needed for the policy checks.

## What to flag
- `"Action": "*"` or `"Action": ["*"]` or a whole-service wildcard like `"s3:*"` on an Allow statement, including when it is one item in a longer list
- `"NotAction"` on an Allow statement: it allows every action except the listed ones, so it is often close to full access
- `"Resource": "*"` on actions that support a narrower resource
- Allow statements with no condition where a condition (MFA, source IP, end date) would fit
- Users with a console password and no MFA
- Access keys older than 90 days, or never used
- Inline policies on users (prefer managed policies attached to groups or roles)
- Roles never used, or with trust to an external account or to `"AWS": "*"`

## Core Principles

**Least Privilege**
- Grant minimum permissions needed
- Use managed policies when possible
- Avoid wildcard (*) permissions
- Regular access reviews

**Defense in Depth**
- Enable MFA for all users
- Use IAM roles instead of access keys
- Implement service control policies (SCPs)
- Enable CloudTrail for audit

**Separation of Duties**
- Separate admin and user roles
- Use different roles for different environments
- Implement approval workflows
- Regular permission audits

## IAM Security Checks (read-only)

### Find overly permissive policies

```bash
# Customer-managed policies with a wildcard Allow action or an Allow + NotAction.
# Handles a single statement or a list, and Action as a string or a list.
aws iam list-policies --scope Local --query 'Policies[*].Arn' --output text | tr '\t' '\n' | \
while read arn; do
  version=$(aws iam get-policy --policy-arn "$arn" --query 'Policy.DefaultVersionId' --output text)
  aws iam get-policy-version --policy-arn "$arn" --version-id "$version" \
    --query 'PolicyVersion.Document' --output json | \
  jq -e '[.Statement | if type=="array" then .[] else . end
          | select(.Effect=="Allow")
          | select(has("NotAction") or
                   ([.Action | if type=="array" then .[] elif type=="string" then . else empty end
                     | select(. == "*" or endswith(":*"))] | length > 0))] | length > 0' >/dev/null \
    && echo "Wildcard or NotAction Allow in: $arn"
done

# The loop above reads customer-managed policies only. Also check who holds the AWS-managed admin policy:
aws iam list-entities-for-policy --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
# Inline policies on users, groups and roles are not covered above. Read them with
# list-user-policies / get-user-policy (and the group and role versions) and apply the same test.

# Inline policies on users (should usually be managed policies)
aws iam list-users --query 'Users[*].UserName' --output text | tr '\t' '\n' | \
while read user; do
  policies=$(aws iam list-user-policies --user-name "$user" --query 'PolicyNames' --output text)
  if [ -n "$policies" ]; then
    echo "Inline policies on user $user: $policies"
  fi
done
```

Also check which entities use the managed `AdministratorAccess` policy:
`aws iam list-entities-for-policy --policy-arn arn:aws:iam::aws:policy/AdministratorAccess`

### MFA enforcement

```bash
# Users with a console password and no MFA. Columns are found by header name, not position.
aws iam generate-credential-report >/dev/null
aws iam get-credential-report --query Content --output text | base64 --decode | \
  awk -F, 'NR==1{for(i=1;i<=NF;i++)c[$i]=i; next}
           $c["password_enabled"]=="true" && $c["mfa_active"]=="false" {print $1}'

# Does any policy require MFA?
aws iam list-policies --scope Local --query 'Policies[*].Arn' --output text | tr '\t' '\n' | \
while read arn; do
  version=$(aws iam get-policy --policy-arn "$arn" --query 'Policy.DefaultVersionId' --output text)
  aws iam get-policy-version --policy-arn "$arn" --version-id "$version" \
    --query 'PolicyVersion.Document' --output json | grep -q "aws:MultiFactorAuthPresent" \
    && echo "MFA condition in: $arn"
done
```
Also report the `<root_account>` row of the credential report: it should have MFA on.

### Access key management

```bash
# Access keys older than 90 days (date -d works on Linux and Git Bash; on macOS use gdate)
aws iam list-users --query 'Users[*].UserName' --output text | tr '\t' '\n' | \
while read user; do
  aws iam list-access-keys --user-name "$user" \
    --query 'AccessKeyMetadata[*].[AccessKeyId,CreateDate,Status]' --output text | \
  while read key_id create_date status; do
    age_days=$(( ($(date +%s) - $(date -d "$create_date" +%s)) / 86400 ))
    [ "$age_days" -gt 90 ] && echo "$user: key $key_id is $age_days days old ($status)"
  done
done
```

**Rotating a key (a person does this, step by step).** Do not run it unattended.
1. Create the new key and put it straight into your secrets manager. Never paste the secret into chat or logs.
2. Update every app that uses the old key. Check `aws iam get-access-key-last-used --access-key-id <OLD_KEY_ID>` to see what still uses it.
3. Set the old key to Inactive: `aws iam update-access-key --user-name <USER> --access-key-id <OLD_KEY_ID> --status Inactive`
4. Wait a set period (for example a week). If something breaks, set the key back to Active. That is the rollback.
5. Only when nothing uses it, delete the old key.

### Role and policy analysis

```bash
# Roles never used or unused for 90 days (get-role returns RoleLastUsed; list-roles does not)
aws iam list-roles --query 'Roles[*].RoleName' --output text | tr '\t' '\n' | \
while read role; do
  last=$(aws iam get-role --role-name "$role" --query 'Role.RoleLastUsed.LastUsedDate' --output text)
  [ "$last" = "None" ] && echo "No recorded use: $role"
done

# Roles that trust another AWS account
aws iam list-roles --query 'Roles[*].RoleName' --output text | tr '\t' '\n' | \
while read role; do
  aws iam get-role --role-name "$role" --query 'Role.AssumeRolePolicyDocument' --output json | \
    jq -e '.Statement | if type=="array" then .[] else . end | select(.Principal.AWS != null)' >/dev/null \
    && echo "Trusts an AWS principal: $role (check which account)"
done

# Test what a user can do before and after a change (replace the ARNs)
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::<account-id>:user/<user> \
  --action-names s3:GetObject s3:PutObject \
  --resource-arns arn:aws:s3:::<bucket>/*
```

## IAM Policy Templates
Replace every `<placeholder>`. Test each in a non-production account first. Keep the old policy version so you can roll back.

### Least Privilege S3 Access

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::<bucket>/user-data/${aws:username}/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::<bucket>",
      "Condition": {
        "StringLike": { "s3:prefix": "user-data/${aws:username}/*" }
      }
    }
  ]
}
```

### MFA-Required Policy
Denies everything except the actions a user needs to set up MFA, until they sign in with MFA. Attach to a group. Test on one user first. People using long-term access keys without an MFA session will be blocked from the CLI by this policy.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyAllExceptMfaSetupWithoutMfa",
      "Effect": "Deny",
      "NotAction": [
        "iam:CreateVirtualMFADevice",
        "iam:EnableMFADevice",
        "iam:ListMFADevices",
        "iam:ListVirtualMFADevices",
        "iam:ResyncMFADevice",
        "iam:ChangePassword",
        "iam:GetUser",
        "sts:GetSessionToken"
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": { "aws:MultiFactorAuthPresent": "false" }
      }
    }
  ]
}
```

### Temporary access with an end date
Gives a named person limited EC2 access that stops on a date you choose. Set a reminder to remove the policy after it expires. Do not use fixed dates copied from an example.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ec2:DescribeInstances", "ec2:StartInstances", "ec2:StopInstances"],
      "Resource": "*",
      "Condition": {
        "DateLessThan": { "aws:CurrentTime": "<END_DATE_UTC, like 2026-12-31T23:59:59Z>" }
      }
    }
  ]
}
```
Narrow `Resource` to the instances this person needs (for example by tag) before using this. Allow only the actions the task needs.

### IP-Restricted Access
Denies calls that do not come from your office or VPN ranges. The `aws:ViaAWSService` line keeps AWS services working on the user's behalf. Replace the example ranges with your own.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "NotIpAddress": { "aws:SourceIp": ["203.0.113.0/24", "198.51.100.0/24"] },
        "Bool": { "aws:ViaAWSService": "false" }
      }
    }
  ]
}
```

## IAM Hardening Checklist
Mark each item `done`, `not done` or `not checked`. Do not mark an item done without evidence.

**User Management**
- [ ] Enable MFA for all users
- [ ] Remove unused IAM users
- [ ] Rotate access keys every 90 days
- [ ] Use IAM roles instead of long-term credentials
- [ ] Implement password policy (length, complexity, rotation)

**Policy Management**
- [ ] Replace inline policies with managed policies
- [ ] Remove wildcard (*) permissions
- [ ] Implement least privilege
- [ ] Use policy conditions (MFA, IP, time)
- [ ] Regular policy reviews

**Role Management**
- [ ] Use roles for EC2 instances
- [ ] Implement cross-account roles properly
- [ ] Review trust relationships
- [ ] Remove unused roles
- [ ] Use session tags for fine-grained access

**Monitoring**
- [ ] Enable CloudTrail for IAM events
- [ ] Set up CloudWatch alarms for IAM changes
- [ ] Use AWS IAM Access Analyzer
- [ ] Regular access reviews
- [ ] Monitor for privilege escalation

## Optional script for repeat checks
Needs Python and `boto3` and read-only credentials. It lists three things. It changes nothing.

```python
#!/usr/bin/env python3
import boto3
from datetime import datetime, timezone

iam = boto3.client("iam")

def as_list(x):
    return x if isinstance(x, list) else [x]

def users_without_mfa():
    out = []
    for page in iam.get_paginator("list_users").paginate():
        for u in page["Users"]:
            if not iam.list_mfa_devices(UserName=u["UserName"])["MFADevices"]:
                out.append(u["UserName"])
    return out  # includes users with no console password, so check each before acting

def old_keys(days=90):
    out = []
    for page in iam.get_paginator("list_users").paginate():
        for u in page["Users"]:
            for k in iam.list_access_keys(UserName=u["UserName"])["AccessKeyMetadata"]:
                age = (datetime.now(timezone.utc) - k["CreateDate"]).days
                if age > days:
                    out.append((u["UserName"], k["AccessKeyId"], age))
    return out

def wildcard_policies():
    out = []
    for page in iam.get_paginator("list_policies").paginate(Scope="Local"):
        for p in page["Policies"]:
            doc = iam.get_policy_version(PolicyArn=p["Arn"], VersionId=p["DefaultVersionId"])["PolicyVersion"]["Document"]
            for s in as_list(doc.get("Statement", [])):
                if s.get("Effect") != "Allow":
                    continue
                actions = as_list(s.get("Action", []))
                if "NotAction" in s or any(a == "*" or a.endswith(":*") for a in actions):
                    out.append(p["PolicyName"])
                    break
    return out

if __name__ == "__main__":
    print("Users without MFA:", users_without_mfa())
    print("Keys older than 90 days:", old_keys())
    print("Policies with wildcard or NotAction Allow statements:", wildcard_policies())
```

## Output Format
Return these parts in order.

1. **Scope.** What was reviewed (pasted policies, or which account), and which checks were skipped and why.
2. **Findings table.**

   | # | Finding | Where (policy, user or role) | Risk | Severity | Fix |
   |---|---------|------------------------------|------|----------|-----|

   Severity is High, Medium or Low, with one line of reasoning. Do not give a numeric score.
3. **Replacement policies.** For each High or Medium finding, the old statement and a tighter replacement as JSON. Mark any `DRAFT` that rests on a guess about the task.
4. **How to test.** For each replacement: run it through the IAM Policy Simulator or `simulate-principal-policy`, attach it in a test account first, and keep the old policy version for rollback.
5. **Hardening checklist** with `done`, `not done` or `not checked` for each line.
6. **Next steps.** Three actions in order, and what to re-check after.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Prompt injection defender](https://useaiblocks.com/skills/prompt-injection-defender). It takes the security report.
- The [AI agent attack tester](https://useaiblocks.com/skills/ai-agent-attack-tester). It takes the security report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Example Prompts

- "Review my IAM policies for security issues"
- "Find users without MFA enabled"
- "Create a least privilege policy for S3 access"
- "Identify overly permissive IAM roles"
- "Generate an IAM hardening report"

## Best Practices

- Use AWS managed policies when possible
- Implement policy versioning
- Test policies in non-production first
- Document policy purposes
- Regular access reviews (quarterly)
- Use IAM Access Analyzer
- Implement SCPs for organization-wide controls

## Additional Resources

- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [IAM Policy Simulator](https://policysim.aws.amazon.com/)
- [IAM Access Analyzer](https://aws.amazon.com/iam/features/analyze-access/)

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
