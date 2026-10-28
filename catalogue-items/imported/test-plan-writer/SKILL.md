---
name: testing-strategy
description: Design test strategies and test plans. Trigger with "how should we test", "test strategy for", "write tests for", "test plan", "what tests do we need", or when the user needs help with testing approaches, coverage, or test architecture.
---

# Testing Strategy

Design effective testing strategies balancing coverage, speed, and maintenance. The result is a written test plan, not test code.

**Do not use when:** the user has a single script or one-off task (a few manual checks are enough), already has a plan and wants the tests written (write them, using the plan), or has failing tests to fix (fix the failures first).

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase, your question. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Any good chat AI:** This skill is advice from what you describe, so no code access is needed.
- **Claude Code:** It can read your repo and list the tests you already have, so the gaps are real.
<!-- /needs -->

## What you need

Ask once, in one message, for anything missing. Do not invent details to fill gaps.

1. What is being built or inherited, in a few lines: who uses it and what it must never get wrong.
2. The parts: for example API, front end, data jobs, infrastructure. Languages and test tools already in use.
3. Existing tests: what exists and roughly how long they take to run (optional).
4. Limits: team size, time, and a release date (optional).

## Testing Pyramid

```
        /  E2E  \         Few, slow, high confidence
       / Integration \     Some, medium speed
      /    Unit Tests  \   Many, fast, focused
```

## Strategy by Component Type

- **API endpoints**: Unit tests for business logic, integration tests for HTTP layer, contract tests for consumers
- **Data pipelines**: Input validation, transformation correctness, idempotency tests
- **Frontend**: Component tests, interaction tests, visual regression, accessibility
- **Infrastructure**: Smoke tests, chaos engineering, load tests

## What to Cover

Focus on: business-critical paths, error handling, edge cases, security boundaries, data integrity.

Skip: trivial getters/setters, framework code, one-off scripts.

## Steps

1. **Restate the system.** Write two or three lines: what it does, its parts, and the failures that would hurt most. Check this against the user's words.
2. **List the risks.** Name the 5 to 8 things that most need a test: money moving, personal data, login, data loss, the busiest paths.
3. **Plan by component.** For each part, choose test types from the strategy above and say how many of each to expect. Keep the pyramid shape: many unit, some integration, few end to end.
4. **Write sample cases.** For each risk, give two or three concrete test cases in plain words (input and expected result).
5. **Set coverage targets.** Give a target per part and say why. Never present a target as a rule that fits every project.
6. **Find the gaps.** If existing tests were given, compare them to the plan and list what is missing and what is not worth keeping.
7. **Say what not to test.** Name what you chose to skip, and why.
8. **Order the work.** Put the plan in a sensible order: the riskiest paths first, then the rest, fitted to the time and team limits.

## Output

Produce a test plan with these sections, in this order:

1. **System summary:** two or three lines.
2. **Top risks:** a short ranked list.
3. **Plan by component:** a table with columns component, test types, what to cover, rough count, coverage target.
4. **Sample test cases:** a table with columns risk, test type, input, expected result.
5. **Gaps in current tests:** missing tests and tests to drop. Write "No existing tests given" if none were shared.
6. **Not testing:** what is skipped and why.
7. **Order of work:** numbered list.
8. **Next steps:** who writes first, and which tool to use to check the tests really catch breakage.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## If something is missing

- No description of the system: ask. Do not write a generic plan.
- No existing tests given: say so and skip the gaps section.
- No time or team limits: plan for the full pyramid and mark the first three steps as the minimum.
- Never state coverage numbers as facts about the user's code. They are targets.
