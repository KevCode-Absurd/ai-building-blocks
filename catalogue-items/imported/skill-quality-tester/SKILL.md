---
name: "skill-tester"
description: "Validate, test, and score the quality of skills within the claude-skills ecosystem. Comprehensive meta-skill: structure validation, Python script testing (syntax + imports + runtime + output format), multi-dimensional quality scoring with letter grades and tier classification (BASIC/STANDARD/POWERFUL). Use when auditing existing skills for tier promotion, setting up pre-commit hooks for skill quality, or integrating skill QA into CI. Not for authoring new skills: its tier minimums suit older skills."
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Skill files** (yours): a skill's folder: its SKILL.md and any files it needs.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **Skill files** with the [Skill writer](https://useaiblocks.com/skills/skill-writer). Bring your question, skill files (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for skill files. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Supporting material availability

This catalog copy does not include these files:

- `scripts/audit_skills.py`

Do not say you read or ran them. Do those steps by hand, or ask the user for the original file.

# Skill Tester

**Tier**: POWERFUL · **Category**: Engineering Quality Assurance · **Dependencies**: None (Python stdlib only)

Meta-skill that validates, tests, and scores skills in this repository. Four tools, run from the **repo root** with full paths:

1. **`scripts/skill_validator.py`** — structure + documentation compliance
2. **`scripts/script_tester.py`** — Python script syntax/imports/runtime/output testing
3. **`scripts/quality_scorer.py`** — multi-dimensional scoring with letter grade
4. **`scripts/security_scorer.py`** — security posture scoring (also available via `quality_scorer.py --include-security`)

> **Scope note:** this skill's tier line-count minimums measure *legacy* skills. For authoring *new* skills, `engineering/write-a-skill` (SKILL.md under ~100 lines, Matt Pocock doctrine) is the binding standard — do not pad a new skill to satisfy a tier minimum here.

## Quick Start (exact, runnable from repo root)

> **Safety warning:** `script_tester.py` runs the skill's own Python scripts. Run it only on a throwaway copy of a skill you trust, or inside a container. Never run it in CI on code from an untrusted pull request.

```bash
# 1. Validate structure (exit non-zero on failure — usable as a gate)
python3 engineering/skills/skill-tester/scripts/skill_validator.py engineering/skills/your-skill --json

# 2. Test the skill's Python scripts (30s default timeout per script), on a throwaway copy only
cp -r engineering/skills/your-skill /tmp/your-skill-copy
python3 engineering/skills/skill-tester/scripts/script_tester.py /tmp/your-skill-copy --json

# 3. Score quality (fail CI below threshold with --minimum-score)
python3 engineering/skills/skill-tester/scripts/quality_scorer.py engineering/skills/your-skill --json --detailed --minimum-score 75
```

Consume the JSON: validator emits `overall_score`, `compliance_level`, per-check `checks{}`; scorer emits `overall_score`, `letter_grade`, `tier_recommendation`, `dimensions`, and an `improvement_roadmap` — work the roadmap top-down, then re-run until the target score is met.

This catalogue copy does not include `scripts/audit_skills.py`. To check many skills, loop over the skill folders and run the three commands above on each one.

## What Each Tool Checks

### skill_validator.py
- SKILL.md frontmatter parsing, required sections, minimum line counts per tier (`--tier BASIC|STANDARD|POWERFUL`)
- Required structure: SKILL.md, README.md, scripts/, references/, assets/, expected_outputs/
- Python scripts: argparse present, stdlib-only imports

### script_tester.py
- AST-based syntax validation; import analysis (flags external dependencies)
- Controlled execution with timeout protection (`--timeout`, default 30s)
- `--help` functionality verification; sample-data runs compared against expected_outputs/

### quality_scorer.py
Four dimensions, 25% each: **Documentation** (depth, examples, references), **Code Quality** (complexity, error handling, output consistency), **Completeness** (required dirs, sample data, expected outputs), **Usability** (help text, example clarity). Outputs 0-100 + A-F grade + tier recommendation.

## Tier Classification

| Tier | SKILL.md | Scripts | CLI surface |
|---|---|---|---|
| BASIC | ≥ 100 lines | 1 (100-300 LOC) | basic argparse |
| STANDARD | ≥ 200 lines | 1-2 (300-500 LOC) | subcommands, JSON + text output |
| POWERFUL | ≥ 300 lines | 2-3 (500-800 LOC) | multiple modes, CI integration |

(Advisory for legacy skills; new skills follow write-a-skill — see scope note above.)

## CI Integration

```yaml
# GitHub Actions: gate changed skills
- name: "validate-changed-skills"
  run: |
    # Structure and score checks only. These read files and do not run the skill's code.
    changed_skills=$(git diff --name-only origin/main...HEAD | grep '/SKILL.md$' | xargs -n1 dirname | sort -u)
    for skill in $changed_skills; do
      python3 engineering/skills/skill-tester/scripts/skill_validator.py "$skill" --json
      python3 engineering/skills/skill-tester/scripts/quality_scorer.py "$skill" --minimum-score 75
    done
```

Do not run `script_tester.py` in pull-request CI, because it executes contributed code. Run it by hand on a throwaway copy after you have read the scripts, or in a separate job that runs only on your own trusted branches.

Pre-commit hook: run the validator on the staged skill directory and block the commit on non-zero exit.

## Verification Loop

A skill "passes" when, in one run from repo root:

1. `skill_validator.py <skill> --json` exits 0,
2. `script_tester.py <skill>` reports all scripts passing, and
3. `quality_scorer.py <skill> --minimum-score <target>` exits 0.

If any step fails, apply the top `improvement_roadmap` item and re-run all three — never report a partial pass.

## Troubleshooting

- **Timeout errors** → raise `--timeout` or optimize the script under test
- **Import failures** → external deps detected; stdlib-only is the repo policy
- **Tier misclassification** → check line counts/LOC against the tier table; remember the write-a-skill exception for new skills

References: `references/` holds the structure specification, tier requirements matrix, and scoring rubric the tools implement.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [AI skill library reviewer](https://useaiblocks.com/skills/monthly-skill-library-keeper).
- The [Skill trigger auditor](https://useaiblocks.com/skills/skill-trigger-auditor).
- The [Skill portability checker](https://useaiblocks.com/skills/skill-portability-checker).
- The [Prompt and skill improvement tester](https://useaiblocks.com/skills/prompt-and-skill-tuner).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
