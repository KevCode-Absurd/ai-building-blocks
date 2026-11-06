# Security checks in CI

**Trigger:** A repository has no automatic security checks, a scanner or customer found issues that a check would have caught, or a secret leaked. One-off set-up of about half a day, then the checks run on every pull request.

## Steps

1. **Agree access and limits (level 1).** Ask which access level the client grants for the code host and CI, and which repositories are in scope. Write them under "Access I have". Confirm the client owns the repositories.
2. **See what exists (level 1).** Current CI workflow files, branch protection, whether GitHub secret scanning, push protection, Dependabot alerts and code scanning are on, and the plan (private organisation repositories need GitHub Secret Protection or Code Security for some features).
3. **Baseline scan on a copy (level 1).** Run the dependency audit (`npm audit`, `pip-audit` in a throwaway environment, or OSV-Scanner), a secret scan of the full history with redacted output (Gitleaks), and static analysis where the language is supported (CodeQL or Semgrep). Existing findings go to the `vulnerability-triage-and-patch-order` and `leaked-secret-response` skills before the checks become blocking, or every pull request will fail on old problems.
4. **Write the checks (level 2).** In a pull request:
   - dependency audit on every pull request, failing on High and Critical (for example `npm audit --audit-level=high`) or on any `pip-audit` finding, with a documented way to accept a known, mitigated finding;
   - secret scan with redacted output on every pull request, plus a pre-commit hook for developers;
   - static analysis on pull requests to the main branch;
   - pinned versions for the CI actions themselves.
   *Approval: a named reviewer on the client's team.*
5. **Run in warning mode first (level 2).** Let the checks report without blocking for an agreed period, tune out false positives with recorded reasons, and confirm run times are acceptable.
6. **Turn on code host settings (level 3).** Within the agreed limits: secret scanning, push protection, Dependabot alerts and security updates, and code scanning default setup. *Approval: a fresh yes for the settings list.*
7. **Make the checks required (level 3).** Add them as required status checks on the protected main branch. *Approval: a fresh yes, because this changes how every developer merges.*
8. **Hand over.** A short page for developers: what each check does, what to do when it fails, how to request an exception, and who reviews push protection bypasses.
9. **Report.** What was turned on, baseline findings and where they went, the action log, and the date of the first monthly sweep.

## Outputs

- Baseline findings, routed to triage and secret response
- CI workflow pull request with dependency, secret and static checks
- Pre-commit hook configuration
- Code host security settings list (applied or waiting for approval)
- Developer guide for failures and exceptions
- Action log

## Needs the client's approval

The access level and limits; the CI pull request (a named reviewer); turning on code host security settings (a fresh yes); making checks required on protected branches (a fresh yes); any change to who can bypass push protection. No secrets are handled in chat at any point. The client can lower the access level at any time.
