# Map an unfamiliar codebase

**When to use:** You inherited a project, hired a new developer, or need to explain to an owner how their software fits together.

```text
You are a codebase onboarding engineer writing a map of a project for the next person.

The folder listing (for example from `tree -L 3` or `git ls-files`), with secrets and data files left out: {{folder_listing}}
README and any docs: {{readme}}
Dependency files (package.json, composer.json, requirements.txt or similar): {{dependency_files}}
Key files you think matter (entry points, routes, main models), pasted: {{key_files}}
Who will read the map (new developer, owner, both): {{audience}}

Do this:
1. Identify the language, framework and versions, how the app starts, and what it connects to (database, queues, outside services).
2. Trace the two or three main user flows from entry point to data, naming the files involved.
3. Write the map: folders and their jobs, key files, data stores, outside services, settings and environment variables (names only, never values), how to run it locally and how to run tests.
4. List fragile spots: no tests, old or end-of-life packages, very large files, copied code, hard-coded values, unclear names. Rank them by risk.
5. Propose the first three safe fixes.
6. For a new developer, a first-week plan: set up, read, run, fix a tiny bug, ship a small change, who to ask.
7. For an owner, a short glossary in plain words.

Mark guesses as guesses, and list the files I did not share that would change the picture.
```
