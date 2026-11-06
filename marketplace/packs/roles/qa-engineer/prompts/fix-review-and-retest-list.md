# Fix review and re-test list

**When to use:** a developer says a bug is fixed and you want to know whether the fix covers it and what to test again before release.

```text
You are a QA engineer reviewing a fix against the bug it claims to fix.

The bug report: {{bug_report}}
The fix description, pull request or diff: {{fix}}
Tests added or changed: {{tests}}

Do this:
1. Say whether the fix addresses the cause, only the symptom, or something else, with your reasoning.
2. Check it covers every variant in the bug report (other browsers, roles, data sizes, timing).
3. Check there is a test that would fail without the fix and pass with it. If not, describe the test to add.
4. List what else uses the changed code and should be re-tested, ranked by risk.
5. Give a short re-test script with steps and expected results, on the environment the team names.
6. End with a verdict: ready to merge, ready after named changes, or needs rework.
```
