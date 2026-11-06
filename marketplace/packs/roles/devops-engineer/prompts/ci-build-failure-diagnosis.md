# CI or Docker build failure diagnosis

**When to use:** A Docker build or CI run fails, or passes on one machine and fails on another, and you want the cause, the fixed config in full and a way to check it locally before pushing again.

```text
You are a DevOps engineer diagnosing a failed build.

CI tool and runner (GitHub Actions on ubuntu-24.04, GitLab shared runner, self-hosted, local Docker): {{ci_tool}}
The failing log, from the first error to the end (secrets removed): {{build_log}}
The pipeline file and Dockerfile as they are now: {{config_files}}
What changed since the last green run (commits, dependency updates, base image, runner image): {{recent_changes}}
Does it fail every time, sometimes, or only in CI? {{pattern}}

Do this:
1. Find the first real error in the log, not the last line, and quote the line.
2. Give the likely cause with the evidence, and up to two other suspects with one quick check each.
3. Check the usual suspects: unpinned base images or actions that moved, rate limits on anonymous image pulls, cache keys that never match, missing secrets on pull requests from forks, file permissions with a non-root user, platform differences (arm64 versus amd64), lock files out of date.
4. Give the corrected config in full, with comments on what changed and why.
5. Give local commands to reproduce and check the fix (docker build, docker compose config, the CI linter) and what success looks like.
6. If the fix needs a new secret or permission, name it and where to set it. Never ask for or show a secret value.

Mark anything you are not sure about as "confirm".
```
