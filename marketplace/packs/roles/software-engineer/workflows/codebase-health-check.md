# Codebase health check

**Trigger:** A new owner or tech lead inherits a codebase, a key developer is leaving, or a quarterly review (cadence: every three months). One to two weeks of elapsed time, a few hours of the team's.

**Access:** level 1 for the evidence; level 2 to open pull requests for the chosen fixes; level 3 to merge and deploy them, within the repos, environments and time the client set.

## Steps

1. **Collect evidence (level 1).** Folder listing, README and docs, dependency files and lock files, CI configuration, test results and coverage if available, the last three months of incidents or bug reports, and level 1 access to the repository if the client chooses. No production access is needed, and no secrets.
2. **Map the code.** Run the `codebase-map` prompt: languages, frameworks and versions, how it starts, main flows, data stores, outside services, how to run it and test it.
3. **Check support dates.** For each runtime, framework and key library, check the official support page. Anything past or within a year of end of life goes on the risk list with the date and source.
4. **Find fragile spots.** Files nobody touches, missing tests on money, permissions and data paths, copied code, hard-coded values, dead code behind old flags, unmaintained packages, risky regular expressions on user input.
5. **Rank risks.** By impact and likelihood, with evidence for each. Separate "fix now" (security exposure, end-of-life runtime, no backup), "plan" (upgrades, refactors) and "watch".
6. **Propose the first three safe fixes.** Small, reversible changes with clear value, for example characterisation tests on the riskiest module, an upgrade plan with the `upgrade-plan` skill, branch protection with required reviews and passing checks. *Approval: the owner chooses which fixes to fund and in what order.*
7. **Write the onboarding plan.** A first-week plan for the next developer: set up, read, run, fix a tiny bug, ship a small change, who to ask.
8. **Deliver changes as pull requests (level 2; level 3 to merge).** Each chosen fix goes through the `fix-a-bug-through-a-pull-request` flow or the relevant skill. With level 3 access I merge after review, within the limits; otherwise the client's team merges. *Approval: every pull request is approved by a named reviewer on the client's team.*

## Outputs

- Codebase map with a plain-words glossary for owners
- Support-date table with sources
- Ranked risk list with evidence
- First three fixes, with effort and value
- New developer onboarding plan
- Pull requests for the chosen fixes
- Action log: each push, merge and deploy, with time and result

## Needs the client's approval

- **Runs at level 3 within the limits, after the one-time confirmation:** merging and deploying the chosen fixes once a named reviewer approves and checks pass.
- **Always needs a new yes:** which fixes to do and in what order, any change to repository settings (branch protection, required checks), any upgrade plan before work starts, and anything outside the named repos or environments.
