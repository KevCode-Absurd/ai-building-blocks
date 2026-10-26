---
name: terraform-skill
description: "Terraform infrastructure as code best practices"
risk: safe
source: "https://github.com/antonbabenko/terraform-skill"
date_added: "2026-02-27"
---
# Terraform Skill for Claude

Comprehensive Terraform and OpenTofu guidance covering testing, modules, CI/CD, and production patterns. Based on terraform-best-practices.com and enterprise experience.

## Detailed Guide

Read [the detailed guide](references/detailed-guide.md) before executing this skill. It retains the complete procedure and reference material. Treat its safety, prerequisites, and validation requirements as mandatory. For focused work, load the relevant sections; for end-to-end work, read the guide completely.

## When to Use This Skill

**Activate this skill when:**
- Creating new Terraform or OpenTofu configurations or modules
- Setting up testing infrastructure for IaC code
- Deciding between testing approaches (validate, plan, frameworks)
- Structuring multi-environment deployments
- Implementing CI/CD for infrastructure-as-code
- Reviewing or refactoring existing Terraform/OpenTofu projects
- Choosing between module patterns or state management approaches

**Don't use this skill for:**
- Basic Terraform/OpenTofu syntax questions (Claude knows this)
- Provider-specific API reference (link to docs instead)
- Cloud platform questions unrelated to Terraform/OpenTofu

## What to ask for first

Before you write anything, make sure you have these. If one is missing, ask once. If it is still missing, write MISSING next to it and carry on with a clearly labelled assumption. Never invent a provider, version or account detail.

1. What the user needs built, in plain words (required).
2. Cloud provider, and Terraform or OpenTofu (required).
3. How many environments, such as dev, staging and prod (required for layout).
4. Terraform or OpenTofu version. It decides the testing options below (optional; if unknown, assume nothing newer than 1.5 and say so).
5. Existing .tf files (optional; if given, review them before proposing changes).

## Steps

1. Read the detailed guide (references/detailed-guide.md) in full for end-to-end work, or the relevant sections for a focused question. Only that guide is bundled. If this skill names another guide that is not available, say so and use the detailed guide instead.
2. Propose the folder layout first: environments apart from modules, with examples. Wait for the user to accept it, or note that you went ahead on stated assumptions.
3. Write the modules. Use count only for on and off switches. Use for_each when items can be added or removed.
4. Choose a testing level from the decision matrix in the detailed guide. Say why it fits the user's version and risk.
5. Write the CI steps in order: validate, test, plan, apply. Production apply needs a human approval.
6. List what you did not do or could not check, such as scanners that were not run.

## Output

Return these sections in this order:

- **Assumptions and MISSING items**: one line each.
- **Folder layout**: a file tree.
- **Code**: each module and environment file, with a short note on why it is built that way.
- **Testing plan**: the chosen level, the commands, and what each one catches.
- **CI steps**: a pipeline file for the user's CI tool, or a plain list if the tool is unknown.
- **Structure and state notes**: naming, version pinning, state handling.
- **Next step**: tell the user to run terraform validate and terraform plan, read the plan, and apply only through the pipeline.

## Guard rails

- Never run terraform apply, or tell the user to, before they have reviewed a plan.
- Do not claim a scanner or test passed unless you ran it and saw the result. In a plain chat, give the command and say it has not been run.
- Do not put secrets in variables or code. Point to a secrets manager.

## Count vs For_Each: When to Use Each

### Quick Decision Guide

| Scenario | Use | Why |
|----------|-----|-----|
| Boolean condition (create or don't) | `count = condition ? 1 : 0` | Simple on/off toggle |
| Simple numeric replication | `count = 3` | Fixed number of identical resources |
| Items may be reordered/removed | `for_each = toset(list)` | Stable resource addresses |
| Reference by key | `for_each = map` | Named access to resources |
| Multiple named resources | `for_each` | Better maintainability |

### Common Patterns

**Boolean conditions:**
```hcl
# ✅ GOOD - Boolean condition
resource "aws_nat_gateway" "this" {
  count = var.create_nat_gateway ? 1 : 0
  # ...
}
```

**Stable addressing with for_each:**
```hcl
# ✅ GOOD - Removing "us-east-1b" only affects that subnet
resource "aws_subnet" "private" {
  for_each = toset(var.availability_zones)

  availability_zone = each.key
  # ...
}

# ❌ BAD - Removing middle AZ recreates all subsequent subnets
resource "aws_subnet" "private" {
  count = length(var.availability_zones)

  availability_zone = var.availability_zones[count.index]
  # ...
}
```

**For migration guides and detailed examples, see:** Code Patterns: Count vs For_Each

## Security & Compliance

### Essential Security Checks

```bash
# Static security scanning
trivy config .
checkov -d .
```

### Common Issues to Avoid

❌ **Don't:**
- Store secrets in variables
- Use default VPC
- Skip encryption
- Open security groups to 0.0.0.0/0

✅ **Do:**
- Use AWS Secrets Manager / Parameter Store
- Create dedicated VPCs
- Enable encryption at rest
- Use least-privilege security groups

**For detailed security guidance, see:**
- **Security & Compliance Guide** - Trivy/Checkov integration, secrets management, state file security, compliance testing

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
