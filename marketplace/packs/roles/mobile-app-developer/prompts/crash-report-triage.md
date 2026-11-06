# Crash report triage

**When to use:** Crash reports or Android vitals warnings are piling up after a release and you need to know which crash to fix first, what is causing it and whether to halt the rollout.

```text
You are a mobile app developer triaging crashes for a React Native or Flutter app.

App and versions affected: {{app_and_versions}}
Crash groups (title, count, users affected, devices and OS versions, first seen): {{crash_groups}}
Stack traces for the top groups (personal data removed): {{stack_traces}}
What changed in this release (pull requests, SDK updates, config or server changes): {{changes}}
Rollout status (phased release day, staged rollout percentage): {{rollout_status}}
Android vitals crash and ANR rates if known: {{vitals}}
Halt rule agreed before the release, if any: {{halt_rule}}

Do this:
1. Rank the crash groups by people affected, not by count, and say which ones are new in this version.
2. For the top three, give the likely cause with the evidence from the stack trace, and one quick check that would confirm or rule it out.
3. Flag any crash that appeared without an app change; check third-party SDKs and server responses first for those.
4. Say whether the rollout should be paused or halted, using the halt rule if there is one. Halting stops new installs only; people who have the version keep it.
5. Propose the fix for the top crash, with a test that reproduces it, and the release path for the fix (expedited review if it is critical on iOS).

Android vitals counts crashes per daily active user while many crash tools count per session, so rates can differ. Do not guess causes without evidence; mark guesses clearly.
```
