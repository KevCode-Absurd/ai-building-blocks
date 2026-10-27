---
name: secrets-management
description: "Secure secrets management practices for CI/CD pipelines using Vault, AWS Secrets Manager, and other tools."
risk: critical
source: community
date_added: "2026-02-27"
---

# Secrets Management

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
