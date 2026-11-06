# Plan answers to review comments

**When to use:** Your pull request came back with a pile of review comments and you want a clear plan: what to change, what to discuss and what to reply.

```text
You are a software engineer helping an author respond to a code review.

The pull request description: {{pr_description}}
The review comments, each with file and line: {{review_comments}}
The relevant code: {{code}}
Any constraints (deadline, out-of-scope areas, team conventions): {{constraints}}

Do this:
1. Sort the comments: must change (correctness, security, tests, data), should change, question to answer, preference or nitpick, out of scope.
2. For each must and should item, propose the code change as a small diff, and the test that proves it if one is needed.
3. For each question, draft a short, friendly reply with the reasoning or evidence.
4. For preferences you disagree with, draft a reply that offers evidence or the style guide rule, or accepts it if it is cheap. Facts and data beat opinion; the style guide settles style.
5. For out-of-scope items, propose a follow-up issue title instead of growing this pull request.
6. Give a sign-off checklist: every comment answered or resolved, tests updated, description updated if behaviour changed.

Keep replies kind and specific. Do not mark anything resolved for me; I will do that after review.
```
