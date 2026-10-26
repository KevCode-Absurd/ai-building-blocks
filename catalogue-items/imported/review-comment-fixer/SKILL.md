---
name: gh-address-comments
description: Help address review/issue comments on the open GitHub PR for the current branch using gh CLI; verify gh auth first and prompt the user to authenticate if not logged in.
metadata:
  short-description: Address comments in a GitHub PR review
---

# PR Comment Handler

Guide to find the open PR for the current branch and address its comments with gh CLI.

## Before you start

- You need the GitHub command line (`gh`), signed in, and Python 3 to run the fetch script. Run `gh auth status` to check. If you are not signed in, ask the user to run `gh auth login` themselves. Never ask for their password or token.
- The `gh` sign-in must be able to read pull requests on the repo. This skill only reads comments from GitHub. It does not post anything. If your tool asks to run `gh` with extra network access or outside its sandbox, tell the user what you will run and why, and wait for their yes. Do not turn on elevated access without it.
- The current branch must have an open pull request. If it does not, say so and stop.

## 1) Inspect comments needing attention
- Run scripts/fetch_comments.py. It prints every conversation comment, review and inline review thread on the PR. Inline threads show whether they are resolved or outdated.

## 2) Ask the user for clarification
- Number all the review threads and comments. For each, give the file and line (when there is one), the reviewer's request in one sentence, and a short summary of what a fix would take.
- Mark threads that are already resolved or outdated, and comments that need no code change (for example thanks, questions or approvals).
- Ask the user which numbered comments should be addressed. Do not change code before they answer.

## 3) If user chooses comments
- Apply fixes for the selected comments only. Do not touch other comments.
- If a comment is unclear or two comments conflict, ask the user instead of choosing.
- Then run the project's tests, if the user can give you the command or you can see it in the repo, and report the result. If you cannot run them, say so and tell the user to run them.
- Report which numbers were fixed, which files changed, and which were skipped and why. Do not post replies or resolve threads on GitHub unless the user asks.

Notes:
- If gh hits auth/rate issues mid-run, prompt the user to re-authenticate with `gh auth login`, then retry.
