---
name: "dependency-auditor"
description: "Audit and manage dependencies across multi-language projects. Identifies vulnerabilities, license conflicts, transitive dependency risks, and safe-upgrade paths. Use when auditing third-party packages before release, investigating a CVE, planning a major version bump, or running a license-compliance review. Examples: 'audit our npm dependencies', 'do we have GPL contamination', 'plan the upgrade to React 19'."
---

# Dependency Auditor

> **Skill Type:** POWERFUL · **Category:** Engineering · **Domain:** Dependency Management & Security

Offline, deterministic dependency auditing across 8+ package ecosystems. The three scripts are pattern-matchers over manifests/lockfiles — they do **not** call live advisory APIs; pair their findings with `npm audit` / `pip-audit` / `cargo audit` for current CVE coverage.

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

## Quick Start

```bash
# 1. Scan for vulnerabilities (built-in offline CVE pattern set; exit non-zero on high severity)
python3 scripts/dep_scanner.py /path/to/project --format json --fail-on-high -o scan.json

# 2. Check license compliance and conflicts
python3 scripts/license_checker.py /path/to/project --policy strict --format json -o licenses.json

# 3. Plan upgrades from the scanner's inventory
python3 scripts/upgrade_planner.py scan.json --risk-threshold medium --timeline 90 --format json -o plan.json
```

Consume the outputs: `scan.json` findings drive which packages to pin/patch now; `licenses.json` conflicts go to the user as a legal-risk list; `plan.json` orders upgrades by risk with rollback notes. `--quick-scan` skips transitive deps; `--security-only` limits the plan to security fixes.

**Verification loop:** after applying upgrades, re-run step 1 and assert 0 high-severity findings before closing the audit.

## Supported Ecosystems

| Language | Manifests parsed |
|---|---|
| JavaScript/Node | package.json, package-lock.json, yarn.lock |
| Python | requirements.txt, pyproject.toml, Pipfile.lock, poetry.lock |
| Go | go.mod, go.sum |
| Rust | Cargo.toml, Cargo.lock |
| Ruby | Gemfile, Gemfile.lock |
| Java | pom.xml, gradle.lockfile |
| PHP | composer.json, composer.lock |
| C#/.NET | packages.config, project.assets.json |

## License Classification

- **Permissive**: MIT, Apache 2.0, BSD (2/3-clause), ISC
- **Copyleft (strong)**: GPL v2/v3, AGPL v3 — flags contamination risk in permissive projects
- **Copyleft (weak)**: LGPL v2.1/v3, MPL 2.0
- **Proprietary / Dual / Unknown** — unknown licenses are surfaced for manual review

The checker analyzes license inheritance through dependency chains and emits conflict pairs with remediation suggestions.

## Upgrade Risk Matrix

| Risk | Update type | Handling |
|---|---|---|
| Low | Patch, security fixes | Apply immediately |
| Medium | Minor with new features | Batch into scheduled update |
| High | Major version, API changes | Dedicated migration task + tests |
| Critical | Known breaking changes | Planned migration with rollback procedure |

Prioritization: security patches > bug fixes > feature updates > major rewrites; deprecated features get immediate attention.

## Scripts (accurate capability claims)

- **`scripts/dep_scanner.py`** — multi-format parser; built-in offline vulnerability pattern set (~16 CVE patterns — a smoke layer, not a replacement for live advisories); transitive resolution from lockfiles; JSON + text output.
- **`scripts/license_checker.py`** — license detection from package metadata; compatibility matrix across 20+ license types; `--policy permissive|strict`; conflict detection with remediation.
- **`scripts/upgrade_planner.py`** — semver-based breaking-change prediction; risk-ordered migration plan with testing checklist and timeline estimation.

Sample fixtures: `test-project/` and `test-inventory.json` in this folder; expected shapes in `expected_outputs/`.

## CI Integration

```bash
# Security gate in CI
python3 scripts/dep_scanner.py . --format json --fail-on-high
python3 scripts/license_checker.py . --policy strict --format json
```

## Best Practices

1. **Prioritize security**: address high/critical findings immediately; license compliance before functionality.
2. **Gradual updates**: incremental upgrades with thorough testing; feature flags for risky bumps.
3. **Cadence**: security scans per commit; license audits monthly; full audit quarterly.
4. **False positives**: whitelist with documentation; contact maintainers for license ambiguity.

See [README.md](README.md) for detailed usage and `references/` for the vulnerability/license knowledge bases.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Project secrets and package risk review](https://useaiblocks.com/skills/weekly-dependency-and-security-sweep).
- The [Prompt injection defender](https://useaiblocks.com/skills/prompt-injection-defender). It takes the security report.
- The [AI agent attack tester](https://useaiblocks.com/skills/ai-agent-attack-tester). It takes the security report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
