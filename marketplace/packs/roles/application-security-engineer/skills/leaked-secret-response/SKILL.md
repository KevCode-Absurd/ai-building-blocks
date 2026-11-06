---
name: leaked-secret-response
description: Handles API keys, tokens, passwords or private keys found in code, repository history, front-end bundles, logs, tickets or chat - without ever seeing or repeating the value. Ranks each secret by exposure and power, has the client revoke and rotate it in the provider's own console first (removing it from code or history does not stop it being used), moves the code to read from a secret store, checks provider and audit logs for misuse, decides on history clean-up, and adds prevention (GitHub push protection, secret scanning, a Gitleaks pre-commit hook and CI scan with redacted output). Reads at access level 1; opens the code and CI changes as a pull request at level 2; turns on push protection and merges at level 3 with a fresh yes for each production change. Use when a scanner or a person finds a secret, or before making a repository public.
---

# Leaked secret response

## When to use

- GitHub secret scanning, Gitleaks or a colleague found a key in the code or its history.
- A key sits in front-end code, a mobile app, a Dockerfile, a log or a support ticket.
- Someone pasted a secret into a chat, an issue or a document.
- Before a private repository is made public or shared with a contractor.

## What you need

1. Where each secret was found (file, line, commit, ticket), its type (for example a payment provider key, a database password, an email service key) and which provider issued it. **Never the value.** If a value was pasted into chat, treat it as leaked and add it to the list.
2. Whether the repository or location is public, and since when.
3. Who can revoke and rotate each secret at the provider, and where new secrets should live (a cloud secret manager, the host's encrypted settings).
4. Which services use each secret, so rotation does not cause an outage.
5. Access: level 1 to read alerts and scan a copy with redacted output. Level 2 to change code and CI in a pull request. Level 3 to turn on push protection and merge within limits, each production change with a fresh yes. The client always does the revoking and rotating.

## Steps

### 1. List and rank

One row per secret: type, provider, location, public or private, first exposed (commit date), what it can do (read-only, write, payments, admin), still active (provider's validity check or the client confirms). Rank: public and powerful first.

### 2. Revoke and rotate first

The client revokes each secret in the provider's console and creates a replacement. Revocation is the most important step; deleting the secret from code, pushing a new commit or even deleting the repository does not stop someone who already copied it. If a service depends on the secret, create the new one, switch the service, then revoke the old one, in a short planned window. The new value goes straight into the secret store, never through chat or a ticket.

### 3. Move the code to the secret store

At level 2, change the code to read the secret at runtime from the secret store or the host's encrypted settings, with a clear startup error if it is missing. No secrets in Docker `ENV` or `ARG`. Environment variables are a last resort, because they can appear in logs and crash dumps. For front-end code, move the call to the server: anything shipped to a browser or a phone is public.

### 4. Check for misuse

The client (or I, with read access) checks the provider's logs for use of the old secret since it was exposed: unusual addresses, times or volumes, new resources, changed settings, money moved. Also check the code host's audit log. Anything suspicious becomes an incident for the client's incident process.

### 5. Decide on history clean-up

Rewriting history removes the value from the repository, but forces everyone to re-clone and does not undo exposure. Once the secret is revoked, clean-up is optional and worth it mainly for public repositories or secrets that cannot be revoked. GitHub links a guide for removing sensitive data; follow it if the client chooses to.

### 6. Prevent the next one

- **GitHub:** turn on secret scanning and push protection. Repository-level push protection is off by default and, for private organisation repositories, needs GitHub Secret Protection; user-level push protection protects pushes to public repositories by default. Bypasses are logged; review them.
- **Pre-commit and CI:** a Gitleaks pre-commit hook and a CI scan with `--redact`, so output never shows secrets. Gitleaks' maintainer says the project is now feature complete and development is moving to Betterleaks; check which to use at set-up.
- **Habits:** `.env` in `.gitignore`, an example file with placeholder values, separate keys per environment, least privilege per key, and rotation on a schedule.

### 7. Record

An incident note: what leaked (type, never value), where, exposure window, when revoked, logs checked and result, code changed, prevention added.

## Checks

- No secret value appears anywhere in my output, even partly.
- Every secret has a revocation date or a reason it is still pending.
- The code reads secrets from a store, with a startup check.
- Logs for each secret were checked for the exposure window.
- Push protection and a CI scan are on, or a pull request is open for them.
- Production changes had a fresh yes and a rollback.

## Output format

1. Ranked secrets table (type, provider, location, exposure, power, status).
2. Rotation plan with order, owner and window.
3. Code and CI changes (pull request links or diffs).
4. Log review results.
5. History clean-up decision.
6. Incident note.

## Example of good output (short)

*Made-up business for illustration: "Saltmarsh Outfitters", Node app on a private GitHub repository.*

> | # | Type | Location | Exposed since | Power | Status |
> |---|---|---|---|---|---|
> | 1 | Payment provider secret key | `server/config.js:12`, commit from 14 March | 14 March, private repo, 3 contractors | Payments and refunds | **Revoke today** (you, in the provider console) |
> | 2 | Email service key | `client/src/api.js:4` | Public: shipped in the browser bundle | Send email as you | **Revoke today**; move the call to the server |
> | 3 | Old database password | `docker-compose.yml`, history only | Private | Database read and write | Password changed in March; confirm the old one fails |
>
> Values are not shown. Pull request #88 moves both keys to your host's encrypted settings and adds a Gitleaks CI step with redacted output. Turning on push protection needs your yes.
