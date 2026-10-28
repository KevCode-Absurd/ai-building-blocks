---
name: codebase-audit-pre-push
description: "Deep audit before GitHub push: takes junk files out of git (with your yes), finds dead code, security holes, and optimization issues. Checks every file line-by-line for production readiness."
category: development
risk: safe
source: community
date_added: "2026-03-05"
---

# Pre-Push Codebase Audit

As a senior engineer, you're doing the final review before pushing this code to GitHub. Check everything carefully and fix problems as you find them.  

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

## When to Use This Skill  

- User requests "audit the codebase" or "review before push"  
- Before making the first push to GitHub  
- Before making a repository public  
- Pre-production deployment review  
- User asks to "clean up the code" or "optimize everything"  

## Your Job  

Review the entire codebase file by file. Read the code carefully. Fix small, safe issues right away. Don't just note problems—make the necessary changes. Deleting files and removing secrets need the user's yes first (see step 1).

**Before you start:** ask the user to commit or back up the project first, so every change can be undone. Do not begin until they say it is done.  

## Audit Process  

### 1. Clean Up Junk Files  

Start by looking for files that shouldn't be on GitHub:  

A file name alone never proves a file is junk. The aim is to keep these files out of GitHub, which usually means taking them out of git and adding them to `.gitignore`, not deleting them from the user's disk.

**Before you propose any file, check three things:**
- **Is it tracked?** Run `git ls-files <path>`. Untracked files only need a `.gitignore` line; leave them on disk.
- **Does anything use it?** Search the code, build files and config for the path (for example `go.mod` with a committed `vendor/` folder, a `composer.json`, a Dockerfile, a deploy script, or a build that reads `build/`). If anything refers to it, keep it and say why.
- **Could it be someone's work?** Backups, notes, scratch files and editor settings may be the only copy of something. Never remove these; ask the user what to do with each.

**Group A: generated files you can rebuild.** Propose taking these out of git (`git rm -r --cached <path>`, which keeps the local copy) and adding them to `.gitignore`. List them and get the user's yes first:
- OS files: `.DS_Store`, `Thumbs.db`, `desktop.ini`
- Logs: `*.log`, `npm-debug.log*`, `yarn-error.log*`
- Temp files: `*.tmp`, `*.temp`, `*.swp`
- Build output: `dist/`, `build/`, `.next/`, `out/`, `.cache/` (only if a build step recreates it)
- Installed dependencies: `node_modules/`, `__pycache__/`, `*.pyc`
- Test artifacts: `coverage/`, `.nyc_output/`, `test-results/`

**Group B: files that may be needed or may be the user's own work.** Do not delete or untrack these. List each one with what you found (tracked or not, and anything that refers to it) and ask the user to choose: keep it, move it out of the project, or untrack it:
- Vendored code: `vendor/` (some projects commit it on purpose, and the build needs it)
- IDE files: `.idea/`, `.vscode/`, `*.iml`, `.project` (teams often share some of these settings)
- Backup files: `*.bak`, `*_old.*`, `*_backup.*`, `*_copy.*`
- Notes and scratch files: `TODO.txt`, `NOTES.txt`, `scratch.*`, `test123.*`

Only delete a file from disk if the user asks for that file to be deleted.

**Critical - Check for secrets:**  
- `.env` files (should never be committed)  
- Files containing: `password`, `api_key`, `token`, `secret`, `private_key`  
- `*.pem`, `*.key`, `*.cert`, `credentials.json`, `serviceAccountKey.json`  

If you find secrets in the code, mark it as a CRITICAL BLOCKER. With the user's yes, remove a tracked `.env` from git without deleting the local file (`git rm --cached .env`, then add it to `.gitignore`). Tell the user to rotate (replace) any key that was ever committed, because it stays in git history.  

### 2. Fix .gitignore  

Check if the `.gitignore` file exists and is thorough. If it’s missing or not complete, add the Group A patterns above, and any Group B patterns the user chose to untrack. Ensure that `.env.example` exists with keys but no values.

### 3. Audit Every Source File  

Look through each code file and check:  

**Dead Code (remove only after you check nothing uses it):**
- Commented-out code blocks (list large blocks for the user instead of deleting them)
- Unused imports/requires
- Unused variables (declared but never used)
- Unused functions: first search for exports, other packages, tests, config, reflection or names built at run time. If you are not sure, list it instead of removing it
- Unreachable code (after `return`, inside `if (false)`)
- Duplicate logic (same code in multiple places—combine)

**Code Quality (fix issues as you go):**  
- Vague names: `data`, `info`, `temp`, `thing` → rename to be descriptive  
- Magic numbers: `if (status === 3)` → extract to named constant  
- Debug statements: remove `console.log`, `print()`, `debugger`  
- TODO/FIXME comments: resolve the small ones; list the rest for the user rather than deleting them
- TypeScript `any`: add proper types or explain why `any` is used  
- Use `===` instead of `==` in JavaScript  
- Functions longer than 50 lines: consider splitting  
- Nested code greater than 3 levels: refactor with early returns  

**Logic Issues (critical):**  
- Missing null/undefined checks  
- Array operations on potentially empty arrays  
- Async functions that are not awaited  
- Promises without `.catch()` or try/catch  
- Possibilities for infinite loops  
- Missing `default` in switch statements  

### 4. Security Check (Zero Tolerance)  

**Secrets:** Search for hardcoded passwords, API keys, and tokens. They must be in environment variables.  

**Injection vulnerabilities:**  
- SQL: No string concatenation in queries—use parameterized queries only  
- Command injection: No `exec()` with user-provided input  
- Path traversal: No file paths from user input without validation  
- XSS: No `innerHTML` or `dangerouslySetInnerHTML` with user data  

**Auth/Authorization:**  
- Passwords hashed with bcrypt/argon2 (never MD5 or plain text)  
- Protected routes check for authentication  
- Authorization checks on the server side, not just in the UI  
- No IDOR: verify users own the resources they are accessing  

**Data exposure:**  
- API responses do not leak unnecessary information  
- Error messages do not expose stack traces or database details  
- Pagination is present on list endpoints  

**Dependencies:**  
- Run `npm audit` (or `pip-audit`, `bundle audit` or the equivalent for the language). If there is no package manager, say so and skip this check  
- Flag critically outdated or vulnerable packages  

### 5. Scalability Check  

**Database:**  
- N+1 queries: loops with database calls inside → use JOINs or batch queries  
- Missing indexes on WHERE/ORDER BY columns  
- Unbounded queries: add LIMIT or pagination  
- Avoid `SELECT *`: specify columns  

**API Design:**  
- Heavy operations (like email, reports, file processing) → move to a background queue  
- Rate limiting on public endpoints  
- Caching for data that is read frequently  
- Timeouts on external calls  

**Code:**  
- No global mutable state  
- Clean up event listeners (to avoid memory leaks)  
- Stream large files instead of loading them into memory  

### 6. Architecture Check  

**Organization:**  
- Clear folder structure  
- Files are in logical locations  
- No "misc" or "stuff" folders  

**Separation of concerns:**  
- UI layer: only responsible for rendering  
- Business logic: pure functions  
- Data layer: isolated database queries  
- No 500+ line "god files"  

**Reusability:**  
- Duplicate code → extract to shared utilities  
- Constants defined once and imported  
- Types/interfaces reused, not redefined  

### 7. Performance  

**Backend:**  
- Expensive operations do not block requests  
- Batch database calls when possible  
- Set cache headers correctly  

**Frontend (if applicable):**  
- Implement code splitting  
- Optimize images  
- Avoid massive dependencies for small utilities  
- Use lazy loading for heavy components  

### 8. Documentation  

**README.md must include:**  
- Description of what the project does  
- Instructions for installation and execution  
- Required environment variables  
- Guidance on running tests  

**Code comments:**  
- Explain WHY, not WHAT  
- Provide explanations for complex logic  
- Avoid comments that merely repeat the code  

### 9. Testing  

- Critical paths should have tests (auth, payments, core features)  
- No `test.only` or `fdescribe` should remain in the code  
- Avoid `test.skip` without an explanation  
- Tests should verify behavior, not implementation details  

### 10. Final Verification  

After making all changes, run the app. Ensure nothing is broken. Check that:  
- The app starts without errors  
- Main features work  
- Tests pass (if they exist)  
- No regressions have been introduced  

## Output Format  

After auditing, provide a report:  

```
CODEBASE AUDIT COMPLETE  

FILES TAKEN OUT OF GIT (kept on disk, added to .gitignore):
- node_modules/ (installed dependencies)
- .env (contained secrets; key rotation needed)

FILES FOR YOU TO DECIDE:
- old_backup.js (backup; nothing refers to it) → keep, move or untrack?

CODE CHANGES:  
[src/api/users.js]  
  ✂ Removed unused import: lodash  
  ✂ Removed dead function: formatOldWay()  
  🔧 Renamed 'data' → 'userData' for clarity  
  🛡 Added try/catch around API call (line 47)  

[src/db/queries.js]  
  ⚡ Fixed N+1 query: now uses JOIN instead of loop  

SECURITY ISSUES:  
🚨 CRITICAL: Hardcoded API key in config.js (line 12) → moved to .env  
⚠️ HIGH: SQL injection risk in search.js (line 34) → fixed with parameterized query  

SCALABILITY:  
⚡ Added pagination to /api/users endpoint  
⚡ Added index on users.email column  

FINAL STATUS:  
✅ CLEAN - Ready to push to GitHub  

Scores:  
Security: 9/10 (one minor header missing)  
Code Quality: 10/10  
Scalability: 9/10  
Overall: 9/10  
```  

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Vercel deployer](https://useaiblocks.com/skills/vercel-deployer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Key Principles  

- Read the code thoroughly, don't skim  
- Fix small, safe issues immediately. For untracking, deletions and secrets, ask first, and prefer untracking to deleting
- If uncertain about removing something, ask the user  
- Test after making changes  
- Be thorough but practical—focus on real problems  
- Security issues are blockers—nothing should ship with critical vulnerabilities  

## Related Skills  

- `@security-auditor` - Deeper security review  
- `@systematic-debugging` - Investigate specific issues  
- `@git-pushing` - Push code after audit

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
