---
name: upgrade-plan
description: Plans a framework, language or library upgrade (Laravel, Symfony, Django, Rails, Express, Next.js, React, Vue, Angular, or PHP, Python and Node.js versions) from the dependency file and code samples, finding the path through intermediate versions, the blocking packages, the breaking changes tied to your files, and an ordered plan of small reversible steps with tests, checks and rollbacks, sized small, medium or large. Use it when an app is several majors behind, a host or runtime is reaching end of life, or a library is unmaintained.
---

# Upgrade plan

## When to use

- An app is two or more major versions behind its framework.
- A runtime is near or past end of life (for example Node.js 20 ended on 30 April 2026; PHP 8.2 security support ends on 31 December 2026).
- A host is dropping an old PHP, Python or Node.js version.
- A key library is unmaintained and needs replacing.
- A team with few tests still needs to move.

Not for fixed dates, zero-downtime promises or rewrites in a new language. Doing the upgrade itself is separate work, one pull request per step, at level 2 or 3.

## What you need

1. The dependency files: `composer.json` and `composer.lock`, `package.json` and the lock file, `requirements.txt` or `pyproject.toml`, `Gemfile.lock`.
2. Current and target versions, and any deadline (host notice, end-of-life date).
3. Code samples from the riskiest areas: authentication, payments, data access, anything with framework internals.
4. Current test coverage and CI setup.
5. How the app is deployed and rolled back.

**Access:** level 1 to read dependency files, CI and support pages; level 2 to open each step as a pull request; level 3 to merge and deploy each step, within your limits.

## Steps

### 1. Inventory

Table every direct dependency: current version, latest version, the version that supports the target, and whether it is maintained. Mark blockers: packages with no release for the target.

### 2. Confirm support dates

Check the official release or support page for the runtime and framework (Node.js release schedule, Python devguide, php.net supported versions, the framework's own support policy). Write each date with "confirm on the official page" if it is not in the brief. Version facts change; do not rely on memory.

### 3. Find the path

Plan through each major version in turn, not one jump. Note which runtime version each framework version needs; sometimes the runtime must move first, sometimes the framework.

### 4. List breaking changes that matter

For each step, read the official upgrade guide and changelog. Tie each breaking change to your files where the samples show it. For the rest, give a search term to find affected code (a removed function name, a renamed config key). Mention automated tools where they exist (for example Rector for PHP, pyupgrade for Python, codemods for JavaScript frameworks) and say they need review.

### 5. Order the work

1. Add tests on the risky paths (characterisation tests if the code has none).
2. Clear deprecation warnings on the current version.
3. Update tooling: linters, test runner, build tools.
4. Replace or fork blocking packages.
5. Move one major version at a time; each step is one pull request (level 2) and one deploy (level 3, or the team's).
6. Remove compatibility shims once the move is done.

For long upgrades, consider running both versions side by side in CI (a version matrix) or in the app ("dual booting") so feature work can continue; GitHub did this for its Rails 3.2 to 5.2 upgrade.

### 6. Make every step reversible

Each step has a check (tests, build, smoke test on staging) and a rollback (revert the commit, redeploy the previous build, switch the runtime back). Database migrations need a tested backup and a down migration or a restore plan.

### 7. Size and risk

Size each step small, medium or large. Name the top risks (for example "authentication package has no release for the target; may need replacing") and how to reduce each.

### 8. Show before-and-after code

For each pasted sample affected by a breaking change, show the old and new code with a one-line reason.

## Checks before handing over

- Every dependency from the file is in the inventory.
- Steps are in order and each moves one major version at most.
- Each step has a check and a rollback, and there is a way back before production.
- Every version and date fact not in the brief is marked "confirm on the official page".
- No promised dates, durations or zero downtime.
- Automated tools are suggested with a review step, never as a blind run.
- The plan is proposed as pull requests for the team to review and merge.

## Output format

1. Summary: current state, target, path, top three risks.
2. Dependency inventory with blockers.
3. Support dates with sources to confirm.
4. Breaking changes per step, tied to files or search terms.
5. Ordered steps: change, check, rollback, size.
6. Before-and-after code for the samples.
7. Risks and how to reduce them.

## Example of good output (short)

*Made-up business for illustration: "Pennant Removals", a booking app on Laravel 10 and PHP 8.1.*

> **Summary.** Laravel 10 and PHP 8.1 are both past end of life. Target: Laravel 13 on PHP 8.4. Path: PHP 8.2, then Laravel 11, PHP 8.3, Laravel 12, Laravel 13, PHP 8.4. Top risks: an unmaintained PDF package with no Laravel 11 release; no tests on the quote calculator; a custom auth guard using framework internals.
>
> | Step | Change | Check | Rollback | Size |
> |---|---|---|---|---|
> | 1 | Characterisation tests for the quote calculator | Tests pass on current code | n/a | M |
> | 2 | PHP 8.1 to 8.2 on staging; fix dynamic property deprecations | Full test run, smoke test bookings | Switch PHP back in host panel | S |
> | 3 | Replace the PDF package | Generated quotes match old ones byte-for-byte or visually | Revert pull request | M |
> | 4 | Laravel 10 to 11 | Tests, booking smoke test | Revert and redeploy previous build | L |
>
> **Confirm on the official pages:** Laravel's support table and php.net supported versions.
