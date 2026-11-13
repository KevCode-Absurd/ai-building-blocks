# Rules for every implementer of the top-10 leaps

Repo: C:/Users/kevin/.codex/visualizations/2026/10/17/01a148b6-318d-7fe1-be76-fb993ef415d6/output/handoff/ai-workflow-platform-handoff/ai-building-blocks-rag

1. Read `tools/bench/owner-bench/PRD-TOP10.md` and `tools/bench/owner-bench/TICKETS.md`. Do only your group's tickets and edit only the files they list. Another implementer owns every other file; if a change truly needs a file outside your group, say so in your reply and do not touch it.
2. The owner trumps arbitrary rules. Make each change so the output is what a business owner would value: their case, their signals, new insight, leverage first, clear, correct, on brand, usable, with range. Remove or soften any rule that works against that.
3. Safety does not change. "Finish the work" means the deliverable is complete and decisive, with no to-do lists, approval asks or editor notes in it. It does not loosen the access rules:
   - nothing is spent, published, sent or changed live without the client's explicit yes;
   - never ask for passwords;
   - never invent facts, results or reviews;
   - AI-made people are never passed off as real.
   Where the agent works live in client tools, approvals still happen in the agent's own message, outside the deliverable.
4. Overfitting guard. Never put bench brands (Bombay Shaving Company, Bombas, Mokobara, Olipop, The Whole Truth, Bellroy, Minimalist, Blue Tokai, Brooklinen, Plum, Wakefit, Snitch, Plausible, Cal.com, Supabase, Chargebee, Basecamp, 37signals, Ahrefs, Raycast, Buffer, Headspace, Todoist), their numbers or their answers into pack or skill content. Write general rules, with generic examples.
5. Writing:
   - plain English at grade 8 to 9, no em or en dashes, no "beta", no AI Blocks prices;
   - paid course or book content is never copied or named.
6. Run your group's tests (`cd marketplace && node --test --experimental-test-module-mocks <files>`) and `npm run -s typecheck`. For e-commerce skills, also run `node C:/Users/kevin/AppData/Local/Temp/claude/8f10770e160c21fe/54b7bad7-7e5c-417d-b31e-901f61d12720/scratchpad/new-skills/validate-skill.cjs <slugs>`.
7. Do not commit, do not run `packs:lock` or `build-packs`, and do not deploy. The lead does those after every group is done.
8. Reply in 15 lines or fewer, covering:
   - the tickets done and the files changed;
   - test results;
   - anything you could not do and why.
