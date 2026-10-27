---
name: connect-code-to-supabase-builder-prompt
description: Get a coding brief to connect your app to Supabase, with scoped access, safe secrets and a read check.
---

# Connect Code to Supabase prompt

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [API endpoint development brief writer](https://useaiblocks.com/prompts/build-first-api-endpoint-builder-prompt).
- The [Redis BullMQ job queue code planner](https://useaiblocks.com/prompts/set-up-redis-bullmq-job-queue-builder-prompt).
- The [Meta Ads reporting app planner](https://useaiblocks.com/prompts/meta-ads-report-code-builder-prompt).
- The [Code change reviewer](https://useaiblocks.com/skills/code-change-reviewer). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.
<!-- /needs -->

## Before you run it
- This prompt needs a Supabase project, with the URL and the service role key in `.env.local`. Keep that file out of git. The service role key skips Row Level Security, so it stays on the server and never goes in browser code.
- It needs two tables in your Supabase project: `agent_jobs` and `agent_activity_log`. Any columns work, because the test only reads and counts rows. Create them in the Supabase dashboard (Table Editor or SQL editor). See https://supabase.com/docs/guides/database/tables.
- It needs two packages: `@supabase/supabase-js` and `tsx`. Install them with `npm install @supabase/supabase-js` and `npm install -D tsx`. Ask the user before you install.
- It reads data only. It does not change your database.

## Method



Copy this into Claude Code to wire up the database connection and run your first query from code.

---

```
I need to connect my code to Supabase. Do these things in order:

1. Create lib/supabase/admin.ts:
   - Import createClient from @supabase/supabase-js
   - Read SUPABASE_URL from process.env (fall back to NEXT_PUBLIC_SUPABASE_URL)
   - Read SUPABASE_SERVICE_ROLE_KEY from process.env (fall back to SUPABASE_SERVICE_KEY)
   - If either is missing, throw a clear error message saying which one is missing
   - Export the client as "supabaseAdmin"
   - Add a comment at the top: "Server-side only. Never import this in browser code."

2. Create scripts/test-db-connection.ts:
   - Import supabaseAdmin from lib/supabase/admin
   - Query the agent_jobs table: select all rows, limit 5
   - Print: "Connected to Supabase. Found X rows in agent_jobs."
   - If error, print the error message
   - Query agent_activity_log: count all rows
   - Print: "Activity log has X entries."

3. After creating both files, explain:
   - What "service role key" means and why it bypasses Row Level Security
   - Why we never use this client in browser code
   - What { data, error } destructuring means (the Supabase return pattern)

Keep the explanation simple. I'm a business owner learning to build.
```

---

## How to Test

```bash
npx tsx scripts/test-db-connection.ts
```

You should see:
```
Connected to Supabase. Found 0 rows in agent_jobs.
Activity log has 0 entries.
```

Zero rows is correct if you just set up the tables. The important thing is no errors.

## Common Errors

| Error | Fix |
|-------|-----|
| "SUPABASE_URL is not defined" | Check `.env.local` has `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` |
| "SUPABASE_SERVICE_ROLE_KEY is not defined" | Check `.env.local` has the service role key from Supabase dashboard |
| "relation agent_jobs does not exist" | The tables are not there yet. Create `agent_jobs` and `agent_activity_log` in the Supabase dashboard (Table Editor or SQL editor), then run the test again. |
| "Invalid API key" | Your service role key is wrong. Recopy from Supabase > Settings > API |

## Next Step

Once this works, every agent you build will use `supabaseAdmin` to read and write data. This is the foundation.


## Final check

Give the requested deliverables, evidence used, assumptions, missing inputs, and the smallest useful next step. Distinguish an idea, a calculation, a proposed action and a completed tool action.
