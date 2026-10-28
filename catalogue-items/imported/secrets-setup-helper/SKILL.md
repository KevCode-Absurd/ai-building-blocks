---
name: secrets-management
description: "Secure secrets management practices for CI/CD pipelines using Vault, AWS Secrets Manager, and other tools."
risk: critical
source: community
date_added: "2026-02-27"
---

# Secrets Management

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to Use

Design or repair secret retrieval, CI credentials, workload identity, access policies and rotation for an authorized system.

## Inputs

Gather these first. Never paste or display the secret values themselves:

- The names of the secrets, and who owns each one.
- What uses each secret (the job, service or script that reads it).
- Which environment each one is in (development, staging, production).
- The store or CI system you use (for example Vault, a cloud secret manager or GitHub Actions).
- How the job proves who it is to the store.
- How and when each secret is rotated, and how you recover if rotation fails.

Inspect configuration without displaying values.

## Procedure

1. Choose the existing supported backend. Rule: use the store your cloud or CI system already provides (a cloud secret manager or the host's protected secret store). Choose Vault only if your team already runs it. Keep environment boundaries and minimum privileges explicit. (Write down which store each secret lives in and who can read it.)
2. For Vault, read `references/vault-setup.md`. Development mode and root tokens are not production configuration.
3. For GitHub Actions, read `references/github-secrets.md`. Keep pull-request validation separate from privileged jobs. Supply values to the consuming process, never interpolate them into generated shell source or print them for debugging.
4. Prefer short-lived workload identity when the backend supports it. That means the job gets a temporary pass from its platform instead of a stored key. Check who issued the pass (issuer), who it is for (audience), which job and environment it is limited to, and that other jobs are denied, before enabling retrieval.
5. Rotate through prepare, consumer switch, verification and old-credential revocation. Use the backend's supported rotation protocol; retries must not leave the database and secret store on different credentials.
6. Inspect logs, error paths, artifacts and crash reports with synthetic secret markers (fake values that look like secrets, so you can search for them). Record metadata such as operation, principal and outcome rather than values.

## Example

A deployment needs a database credential. The trusted job retrieves it through the configured identity and passes it only to the migration process. Test missing access and an expired identity in staging. Verify no credential appears in output, and that a failed rotation leaves a recoverable working state.

## Output

Give the user these five sections, in this order, with no secret values in any of them:

1. Retrieval and access design: how each job gets its secret, which identity it uses, and what is kept apart by environment.
2. Rotation sequence: prepare, switch the consumer, verify, revoke the old credential, with a way to roll back.
3. Leak checks: where to look in logs, errors, artifacts and crash reports, using fake secret markers.
4. Test list: allowed access, denied access, missing credentials and failed rotation, to run in staging.
5. Limits and risks: places secrets can still linger, and what to review.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Exposed secrets finder](https://useaiblocks.com/skills/exposed-secrets-finder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Verification

- Authorized retrieval succeeds; a different workload or environment is denied.
- Missing credentials fail closed without exposing values.
- Rotation and rollback are exercised with synthetic data.
- Logs and artifacts contain no secret markers, including on failure.
- Exposed credentials are revoked or rotated; merely deleting their log entry is insufficient.

## Limitations

Masking cannot make logging secrets safe. Secret data can persist in infrastructure state, subprocess environments or backups; review those boundaries explicitly. Do not alter real credentials or deploy secret infrastructure without authorization.

## Sources

- [GitHub secure workflow guidance](https://docs.github.com/en/actions/reference/security/secure-use)
- [Vault production hardening](https://developer.hashicorp.com/vault/docs/concepts/production-hardening)
