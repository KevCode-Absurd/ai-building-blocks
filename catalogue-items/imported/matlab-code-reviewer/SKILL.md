---
name: matlab-review-code
description: Review MATLAB code for quality, performance, maintainability, and adherence to MathWorks coding standards. Uses check_matlab_code and matlab_coding_guidelines. Use when reviewing code, checking style, finding code smells, assessing quality, or preparing code for handoff or publication.
license: https://www.mathworks.com/content/dam/mathworks/license/pmrl/license.md
metadata:
  author: MathWorks
  version: "1.1"
---

# Code Review

Systematically review MATLAB code for quality, correctness, performance, and adherence to MathWorks coding conventions using static analysis and manual inspection patterns.

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

- User asks to review, audit, or improve code quality
- User wants to check adherence to MathWorks coding standards
- Preparing code for handoff, publication, or open-source release
- After a significant implementation — verify before committing
- User reports "code smells" or asks for cleanup suggestions

## When NOT to Use

- User wants to debug a runtime error — use `matlab-debug-code` instead
- User wants to optimize performance — use performance profiling skills
- User wants to generate tests — use `matlab-write-tests` instead

## Workflow

1. **Run static analysis** — Use `check_matlab_code` MCP tool on all target files
2. **Load coding standards** — Read the `matlab_coding_guidelines` MCP resource
3. **Check naming** — Verify functions, classes, variables, and files follow conventions
4. **Review function signatures** — Arguments blocks, input/output counts, name-value patterns
5. **Assess structure** — Function length, nesting depth, complexity
6. **Check patterns** — Vectorization, preallocation, modern API usage
7. **Summarize** — Report findings by severity: errors > warnings > suggestions

## Step 1: Static Analysis

Use the `check_matlab_code` MCP tool on each file. Then inspect results programmatically:

```matlab
info = checkcode("src/computeArea.m", "-struct");
for k = 1:numel(info)
    fprintf('Line %d (col %d-%d): %s\n', ...
        info(k).line, info(k).column(1), info(k).column(end), info(k).message);
end
```

For directory-wide analysis (R2022b+):

```matlab
issues = codeIssues("src");
disp(issues.Issues);
```

## Step 2: Load Coding Standards

Read the `matlab_coding_guidelines` MCP resource to get the authoritative MathWorks coding standards. Use these as the baseline for all naming, formatting, and structural checks.

## Review Checklist

### Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Functions | lowerCamelCase, verb phrase | `computeArea`, `loadData` |
| Classes | PascalCase | `SensorReader`, `DataProcessor` |
| Variables | lowerCamelCase, descriptive | `sampleRate` not `sr` |
| Constants | UPPER_SNAKE or `Constant` property | `MAX_ITERATIONS` |
| Test files | `t` prefix | `tComputeArea.m` |
| App files | PascalCase | `DashboardApp.m` |
| File = function | File name matches primary function | `computeArea.m` → `function computeArea` |

### Function Quality

| Check | Standard | Severity |
|-------|----------|----------|
| Input count | Max 6 positional inputs | Warning |
| Output count | Max 4 outputs | Warning |
| Validation | `arguments` block present | Warning (Error for public-facing functions, see High-Severity Flags) |
| Name-value args | `options.Name` pattern (not `varargin`) | Suggestion |
| Length | Flag if >50 lines | Suggestion |
| Nesting | Flag if >3 levels deep | Warning |
| `end` keyword | All functions terminated with `end` | Warning |
| Help text | H1 line present for public functions | Suggestion |

### Code Patterns

| Check | Modern | Legacy (flag it) |
|-------|--------|-------------------|
| Multi-panel figures | `tiledlayout`/`nexttile` | `subplot` |
| Date/time | `datetime` | `datenum`/`datestr` |
| Strings | `string` type | char arrays for text |
| Vectorization | `.*`, `./`, logical indexing | Loops over elements |
| Preallocation | `zeros(n,1)` before loop | Growing arrays in loops |
| Data containers | `table`/`timetable` | Raw matrices for named data |
| Dynamic eval | Direct function calls | `eval`, `evalin`, `assignin` |

### High-Severity Flags

These should always be reported as errors:

- Use of `eval`, `assignin`, or `evalin` — security and maintainability risk
- Growing arrays inside loops without preallocation — performance
- Shadowing built-in functions — `sum = 5` shadows `sum()`
- Missing `arguments` block in public-facing functions
- Hardcoded file paths with backslashes

### What checkcode Misses

`check_matlab_code` does NOT catch all issues. After running static analysis, **always scan the source code** for these common problems that require visual inspection:

- **`subplot` usage** — not flagged by checkcode, but should use `tiledlayout`/`nexttile`
- **Shadowed builtin variables** — `sum = 0` shadows `sum()`, checkcode may not flag it
- **Deep nesting** (>3 levels) — checkcode does not measure nesting depth
- **Hardcoded backslash paths** — checkcode flags unused variables but not path style
- **Magic numbers** — unlabeled constants in code (e.g., `if length(x) > 10`)
- **Missing H1 help text** — checkcode does not require help text

Do not skip Steps 3-6 of the workflow just because checkcode returns few results.

## Patterns

### Complexity Assessment

```matlab
function complexity = assessComplexity(filePath)
%assessComplexity Estimate cyclomatic complexity of a MATLAB function.

    arguments
        filePath (1,1) string {mustBeFile}
    end

    code = fileread(filePath);
    branchKeywords = ["if " "elseif " "case " "while " "for " "catch "];
    complexity = 1;
    for kw = branchKeywords
        complexity = complexity + numel(strfind(code, kw));
    end
end
```

### Check Toolbox Dependencies

```matlab
[files, products] = matlab.codetools.requiredFilesAndProducts('src/myFunction.m');
fprintf('Required products:\n');
for k = 1:numel(products)
    fprintf('  %s (ID: %d)\n', products(k).Name, products(k).ProductNumber);
end
```

### Review Report Format

Present findings in this format:

```
## Code Review: computeArea.m

### Static Analysis (checkcode)
- 2 warnings, 0 errors

### Naming ✓
- [x] Function: lowerCamelCase
- [x] Variables: descriptive
- [x] File name matches function

### Structure
- [x] arguments block present
- [x] Function under 50 lines
- [ ] ⚠ Nesting depth reaches 4 levels (line 32)

### Patterns
- [x] Vectorized
- [x] Modern graphics API
- [ ] ⚠ Uses datenum (line 18) — migrate to datetime

### Suggestions
1. Extract nested logic at line 32 into a local function
2. Replace datenum with datetime for date handling
```

## Conventions

- Always run `check_matlab_code` as the first step — it catches issues automatically
- Load `matlab_coding_guidelines` for the authoritative standard
- Report findings by severity: errors (must fix) > warnings (should fix) > suggestions (nice to have)
- Flag any use of `eval`, `assignin`, or `evalin` as high-severity
- Check `requiredFilesAndProducts` to verify toolbox dependencies are documented
- Verify every public function has an H1 help text line
- Use `codeIssues` for directory-wide analysis (R2022b+)
- Do not suggest changes that alter behavior — review is read-only assessment
- For deprecated API migration details, use the `matlab-modernize-code` skill

----

Copyright 2026 The MathWorks, Inc.

----

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Web accessibility checker](https://useaiblocks.com/skills/accessibility-checker). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
