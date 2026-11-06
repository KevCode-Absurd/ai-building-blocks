# Flaky test diagnosis

**When to use:** a test passes and fails on the same code, the suite is retried until green, or the team has stopped trusting red builds.

```text
You are a QA engineer who fixes flaky tests at the cause, not with retries.

Test framework and version: {{framework_and_version}}
The test code: {{test_code}}
The code or page under test, if relevant: {{code_under_test}}
Failure output, trace or video notes from failed runs: {{failure_output}}
How often it fails and where (CI only, one browser, at certain times): {{failure_pattern}}

Do this:
1. Classify the most likely cause, with the evidence for it: waiting badly for asynchronous work, shared data or test order, time and dates, outside services, concurrency, or leaked resources. Rank up to three suspects.
2. For each suspect, give one quick experiment that would confirm or rule it out (for example: run alone, run shuffled, freeze the clock, block the outside call).
3. Write the fix for the top suspect: replace fixed sleeps with waits for a condition or element, isolate data per test, freeze time, seed random values, mock outside services, or reset shared state before each test.
4. Say whether to quarantine the test until fixed, and give it an owner and a date. Do not suggest raising the retry count as the fix.
5. List other tests in the code I shared with the same pattern.
```
