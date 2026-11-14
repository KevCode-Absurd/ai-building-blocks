# AI Blocks Agents: architecture and build contract

The marketplace at **agents.useaiblocks.com**: named AI agents (personas such as "Nova, SEO strategist"), each a free
pack that runs in the visitor's **own AI**: downloaded, read through the public API, or loaded by their AI app through
the MCP connector (`load_agent`). Experts apply, build their own agents in the studio, and see how their agents
perform. Payments are **on hold**.

**Hosted jobs are off** (`HOSTED_JOBS` "off" in every environment, owner's decision of 6 Nov 2026): we do not run
agents on our model keys for visitors. The hosted flow below (intake, runner, evaluation, delivery) stays built and
tested, but only ops can start a job (`requireBuyer` and the MCP job tools check `Account.hostedJobs`), the job tools
are left out of the MCP tools list, connections only get `marketplace:read`, and the website sends "Hire" to the
agent's download and connect section (`/agents/:id#dir-pack`). "on" brings hosted hiring back on our keys, under the
spend caps. The studio still calls our models for approved experts.

One Cloudflare Worker (`src/worker.ts`) serves the API and the browser app (`dist/`, built by Vite from `src/ui`).
Database: D1 (`DB`), schema in `migrations/`. Durable runs: Cloudflare Workflows (`JOB_RUN`). Sign-in: Clerk,
shared with useaiblocks.com. Staging: agents-staging.useaiblocks.com. Production: agents.useaiblocks.com.

## Run it

```
cd marketplace
npm test                      # all tests (Node's test runner, real SQL on node:sqlite)
node --test test/intake*.test.ts   # one module's tests
npm run typecheck
npm run worker:dev            # build the UI, then wrangler dev on http://localhost:5290 (demo sign-in, fake models)
```

Before `worker:dev` the first time: `npx wrangler d1 migrations apply ai-blocks-agents-staging --local`.

## Module ownership

Each build agent owns one module. **Edit only the files you own.** Shared files are read-only; if you need a change
in one, put a workaround in your module and say so in your report.

| Module | Owns | Builds |
|---|---|---|
| core (shared, read-only) | `src/core/*` except as noted, `src/app.ts`, `src/worker.ts`, `src/env.ts`, `src/modules/index.ts`, `src/modules/fakes.ts`, `src/ui/app.tsx`, `src/ui/main.tsx`, `src/ui/lib/*`, `src/ui/components.tsx`, `src/ui/styles.css`, `src/ui/pages/index.ts`, `src/ui/pages/types.ts`, `src/ui/pages/core.tsx`, `migrations/0001_core.sql`, `test/helpers.ts`, `test/d1-shim.ts`, `test/fixtures.ts`, `test/core.test.ts`, `wrangler.jsonc`, `package.json` | users, orgs, roles, beta codes, events, job state machine |
| catalogue | `src/modules/catalogue/*` | the job menu (content writers fill `data/*.json`) |
| directory | `src/modules/directory/*` (data files are written by content writers), `src/ui/pages/directory/*`, `migrations/0010_*.sql`, `test/directory*.test.ts` | named agents: seeding, browse and profile pages, Hire button |
| intake | `src/modules/intake/*`, `src/ui/pages/intake/*`, `migrations/0002_*.sql`, `test/intake*.test.ts` | dispatcher: request, questions, rubric, quote, confirm |
| runner | `src/modules/runner/*`, **`src/core/models.ts` (live providers)**, `migrations/0003_*.sql`, `test/runner*.test.ts`, `test/models*.test.ts` | model router, house agent packages, job runs on Workflows |
| evaluation | `src/modules/evaluation/*`, `src/ui/pages/evaluation/*`, `migrations/0004_*.sql`, `test/evaluation*.test.ts` | rubric judge, policy checks, baseline comparison, blind tests, reviewer page |
| delivery | `src/modules/delivery/*`, **`src/core/email.ts` (sendEmail)**, `src/ui/pages/delivery/*`, `migrations/0005_*.sql`, `test/delivery*.test.ts` | release, buyer job pages, accept / revise / reject, auto-accept, email |
| ops | `src/modules/ops/*`, `src/ui/pages/ops/*`, `migrations/0006_*.sql`, `test/ops*.test.ts` | ops console, gate numbers, beta codes, staff, costs |
| studio | `src/modules/studio/*`, `src/ui/pages/studio/*`, `migrations/0007_*.sql`, `test/studio*.test.ts` | expert studio: interview, examples, markup, compile, test bench, publish, go live |
| experts | `src/modules/experts/*`, `src/ui/pages/experts/*`, `migrations/0008_*.sql`, `migrations/0020_expert_invites.sql`, `0021_expert_profiles.sql`, `0022_job_posts.sql`, `test/experts*.test.ts` | applications, agreement, review, expert dashboard, expert personas, founding invites, public profiles and share links, job posts |
| mcp | `src/modules/mcp/*`, `src/ui/pages/mcp/*`, `migrations/0009_*.sql`, `test/mcp*.test.ts` | MCP server + OAuth for buyers' own AI tools, connect page |

Payments are not built. `jobs.payment_status` stays `not_required`.

## Conventions

- TypeScript run directly by Node in tests: import with the `.ts`/`.tsx` extension, use `import type` for types, no
  `enum`, no constructor parameter properties, no decorators. Only `runner/workflow.ts` and `worker.ts` may import
  `cloudflare:workers`.
- **Service functions** (`service.ts`) are `export async function`. Other modules call them directly. Keep the
  signatures in the stubs; you may add optional fields and new functions.
- **Routes** (`routes.ts`) export `routes: Route[]` (`{ method, path, handler(ctx) }`) and `scheduled` (cron work,
  every 15 minutes). Return `json(data)`; throw `fail(status, code, message)` with a plain-words message a buyer
  understands. Read input with `await ctx.body()` and the `str`/`int`/`oneOf` helpers.
- **Access**: `account(ctx)`, `requireBuyer`, `requireOps`, `requireReviewer`, `requireApprovedExpert`,
  `jobForCaller` in `src/core/access.ts`. Never trust ids or roles from the request body.
- **Every state change writes an event** (`recordEvent` or `eventStatement` inside `db.batch`). Job status changes
  only through `transitionJob` (`src/core/jobs.ts`), which checks allowed moves and logs the event.
- **AI calls only through `callModel`** (`src/core/models.ts`) with a `purpose` like `"intake.classify"`. Ask for
  JSON with `json: true` and a schema; validate the result (zod) before using it. Judges pass `avoidProvider`.
  Register deterministic fakes for your purposes in `<module>/fakes.ts` so the local demo and staging
  (`MODEL_MODE=fake`) work end to end with believable output.
- **Web search** (`webSearch` on a text `callModel`): job steps and the baseline get it when `WEB_SEARCH_MAX_USES`
  is above 0 ("0" in every environment while hosted jobs are off). Only Anthropic runs searches (Google's grounding terms forbid changing or mixing grounded results);
  other providers run without it and flag dated facts. Searches are billed per search and count in every cap. Any
  text built from a reply with `sources` must show those sources: the runner appends "Sources from web search" to the
  draft and keeps each step's pages in `run_steps.sources` (migration 0019).
- **Messages to people only through `notify`** (`src/core/email.ts`).
- Ids: `newId("job")`; times: `nowIso()`; JSON columns: `JSON.stringify` / `parseJson`.
- **Migrations**: never edit `0001_core.sql`. Your module has a reserved number (table above): name it
  `00NN_<module>.sql`. New tables are fine; `ALTER TABLE ... ADD COLUMN` on core tables only if unavoidable, listed in
  your report.
- **Tests**: `node:test` + `assert/strict`, `testEnv()` from `test/helpers.ts` (fresh DB with all migrations, fake
  models, `t.api(method, path, { user, body })` with test sign-in, `t.makeOps`, `t.grantBeta`, `t.sql`). The catalogue
  is replaced by `test/fixtures.ts` job types (`landing-page-copy`, `seo-blog-post`) and the persona `NOVA`. If you
  need to isolate a neighbour module that is still a stub, use `mock.module` (`npm test` runs with
  `--experimental-test-module-mocks`) and import your module after mocking.
- **UI**: Preact with `preact/hooks` (React-style). Register pages in `src/ui/pages/<module>/index.tsx`
  (`pages: PageDef[]`, `nav: NavItem[]`, see `src/ui/pages/types.ts`). Use the components in
  `src/ui/components.tsx` (`Page`, `Card`, `Button`, `Field`, `Input`, `TextArea`, `Select`, `Badge`, `Notice`,
  `Table`, `Tabs`, `Markdown`, `useLoad`, `Loaded`) and `api()` / `money()` / `when()` from `src/ui/lib/api.ts`.
  Module CSS goes in `src/ui/pages/<module>/<module>.css` imported by your index.tsx, using the CSS variables in
  `styles.css` only, class names prefixed with your module (`.dir-card`, `.ops-board`). Must work at 360px wide and
  in dark mode.
- **Words**: every visible word follows `../.claude/skills/plain-writing/SKILL.md` (grade 8 to 9, plain, specific,
  no hype). Say what happens next. Error messages say what to do.
- Do not run `git commit`, do not install packages, do not deploy. Keep LF line endings.

## How a hire flows through the modules

While `HOSTED_JOBS` is off this is the ops-only test path; for everyone else a hire is the download, the API or
`load_agent` (see the top of this file).

1. **directory** `/agents/:id` shows a persona and its outcomes. "Hire Nova" links to
   `/new?persona=nova-seo&job=seo-blog-post` (or `/new` for "describe any job").
2. **intake** `POST /api/requests` (`startRequest` with `personaId`, `jobTypeId`, `text`) creates a `draft` job and
   brief. Without a job type it classifies the text (small tier). It extracts the spec and asks at most three questions
   for missing required fields. `POST /api/requests/:id/quote` writes the rubric (5 template criteria plus up to 3 from
   the buyer's goals) and the fixed price (job type band, size adjuster, rush), and moves the job to `quoted`.
   `POST /api/requests/:id/confirm` freezes the rubric, moves it to `confirmed`, and calls `runner.startJobRun`.
3. **runner** `startJobRun` pins the agent (`pickAgent(jobTypeId, personaId)`: the persona's live agent for that job
   type, else the best live agent, else the house agent), creates a `runs` row, moves the job to `running`, and starts
   the `JOB_RUN` workflow (inline via `ctx.waitUntil` style in tests and local). `executeRun` runs the package steps,
   writes a `drafts` row, moves to `checking`, and calls `evaluation.checkDraft`. On a fail it reruns once with the
   check's feedback. Then it moves the job to `in_review` (`RELEASE_REVIEW=required`, the beta default) and notifies
   ops, or calls `delivery.releaseDraft`. It also calls `evaluation.afterJobDraft` (baseline run + blind test).
4. **ops** `/ops/jobs/:id` shows the full record; "Release to buyer" calls `delivery.releaseDraft`; "Rerun" calls
   `runner.startJobRun({ kind: "rerun", feedback })`.
5. **delivery** `releaseDraft` moves the job to `delivered`, sets `auto_accept_at` (+5 days) and emails the buyer.
   The buyer's `/jobs/:id` shows the draft, the checklist and three actions: accept (rating, optional edits),
   ask for changes (reasons + failed checklist items, max 2) or reject. A revision calls
   `runner.startJobRun({ kind: "revision", feedback })`. The cron auto-accepts after 5 days.
6. **evaluation** reviewers pick between two unlabelled drafts at `/review`; win rates feed the ops gate panel.

## API map

| Owner | Endpoints |
|---|---|
| core | `GET /api/health`, `GET /api/config`, `GET /api/me`, `POST /api/beta/redeem` |
| catalogue | `GET /api/catalogue`, `GET /api/catalogue/:id` |
| directory | `GET /api/agents?area=&q=&role=`, `GET /api/agents/:id`, `GET /agents/:id/soul.md`. Cards carry `role: { id, name } \| null` and `mega: { variant, team_size } \| null`; the profile adds `team: [{ id, name, job }]` (mega agents, else `[]`). `?role=<id>` lists one job role (400 `unknown_role` for an id not in roles.json) and the list adds `role: { id, name, department, summary }`. `?q=` takes a plain request ("I need a landing page for my shop") or a few words; see "Search, the work line and the toolbox on a profile". Cards carry `does: { nature, label, things } | null`; the profile adds `does_not`, `tasks: [{ id, task, nature }]`, `brings: [{ type, label, one, items: [{ name, href, file }] }]` and, on each outcome, `how: { path, name } | null`. `GET /tools/:file` (a capture or check tool, see "Agent packs") and `GET /agents/:id/skills/:skill.txt` (one skill in one text file) read the built packs through `ASSETS`. |
| intake | `POST /api/requests`, `GET /api/requests/:id`, `POST /api/requests/:id/answers`, `POST /api/requests/:id/quote`, `POST /api/requests/:id/confirm` |
| delivery | `GET /api/jobs`, `GET /api/jobs/:id`, `POST /api/jobs/:id/accept`, `POST /api/jobs/:id/revise`, `POST /api/jobs/:id/reject`, `GET /api/notifications` |
| evaluation | `GET /api/review/blind/next`, `POST /api/review/blind/:id`, `GET /api/review/stats` |
| ops | `GET /api/ops/jobs`, `GET /api/ops/jobs/:id`, `POST /api/ops/jobs/:id/{release,rerun,cancel,assign,note,resolve}`, `GET /api/ops/gate`, `GET/POST /api/ops/beta-codes`, `GET/POST /api/ops/staff`, `POST /api/ops/seed`, `GET /api/ops/agents`, `GET /api/ops/costs` |
| studio | `/api/studio/*` (expert, including `POST /api/studio/import`), `POST /api/studio/agents/:id/live`, `POST /api/studio/agents/:id/retire` (ops) |
| experts | `POST /api/experts/apply` (optional `invite_token`), `GET /api/experts/me`, `GET /api/experts/me/dashboard`, `GET /api/experts/agreement`, `GET /api/experts` (ops), `POST /api/experts/:id/review` (ops). Invites: `GET /api/experts/invites/:token` (public; first visit marks it opened), `GET/POST /api/ops/invites`, `POST /api/ops/invites/:id/{revoke,email}` (ops). Profiles: `GET /api/expert-profiles/:slug` (public, 404 without a live agent), `GET/POST /api/experts/me/profile`, `GET /api/experts/me/checklist`, `POST /api/experts/me/agreement` (approved expert), `POST /api/share/agent-use` (public). Job posts: `POST/GET /api/job-posts` (signed in; your own), `GET/DELETE /api/job-posts/:id`, `POST /api/job-posts/:id/{pick,close}` (owner), `POST /api/job-posts/:id/replies` and `GET /api/experts/me/posts` (matching approved expert), `GET /api/ops/job-posts`, `POST /api/ops/job-posts/:id/hide` (ops). Outside /api: `GET /e/:slug` (share link, 302) |
| mcp | `POST /mcp`, `GET /.well-known/oauth-authorization-server`, `GET /.well-known/oauth-protected-resource`, `POST /oauth/register`, `GET /oauth/authorize`, `POST /oauth/token`, `POST /api/oauth/approve`. Tools `load_agent` (the core files `CORE_FILES` in `mcp/pack-files.ts`: AGENTS.md, WORK-METHOD.md, context/README.md, soul.md, personality.md, playbook.md, access.md, OUTPUT-POLICY.md, then the list of the rest; with `request`, also the skill or workflow it routes to in full and the matching knowledge.md sections, see "Routing a request") and `get_agent_file` (any path listed in the agent's files.json) read the built pack through the `ASSETS` binding (`mcp/pack-files.ts`); they run no model. The job tools (`hosted: true`) are listed only while `HOSTED_JOBS` is "on", and the server instructions switch with it (`mcpInstructions`). Tool `get_agent` returns `agent.pack: { agent_zip, train_zip, files, guide }` (absolute `APP_ORIGIN` URLs: `/packs/<id>.zip`, `/packs/<id>-train.zip`, `/packs/<id>/files.json`, `/guides/train-your-own-agent`), or `null` for an expert's agent, and names the downloads in its text. |

## Pages for search engines and AI crawlers

`src/pages.ts` sends every page of the website (wrangler.jsonc `run_worker_first` sends all paths to the Worker except
`/assets`, `/packs`, `/fonts` and portraits). Each page gets its own title, description, canonical address, robots tag,
social preview and structured data (SoftwareApplication and BreadcrumbList for agents, WebSite with search for the home
page). Public pages also get a plain version inside `#app` for crawlers that don't run scripts; the app replaces it
when it starts. An agent's profile carries its `/api/agents/:id` answer in `script#boot` (`peekBoot` in
`ui/lib/api.ts`), so the profile draws without a spinner; the home page carries its featured strip
(`/api/agents?featured=6`) the same way, so nothing shifts when the cards appear. Unknown addresses, agents and guides
are real 404s. `/robots.txt`, `/sitemap.xml` (pages, role pages, every live house agent) and `/llms.txt` are
generated. robots.txt blocks `/api/` except `/api/agents` and `/api/config`, which the public pages load while they
draw; every API answer says `x-robots-tag: noindex`. Only production (`APP_ENV` "production") is indexed; other
environments say noindex and disallow everything.

Search engines: Google reads `/sitemap.xml` through Search Console (property `sc-domain:useaiblocks.com`, submitted
7 Nov 2026). Bing, Yandex and the other IndexNow engines get every sitemap page in one request from
`node scripts/indexnow.mjs` after a production deploy that adds or renames pages. Its key file is
`public/<key>.txt`; the key is public by design, so it is committed.

## Agent order, the roster in memory, and going back

- Browse order (`directory/views.ts`): `/agents` with no search or role starts with `START_HERE`, 20 agents most
  businesses need first (one per job role, every area), then `browseOrder` mixes the rest: the most useful agent
  left whose area is not among the last 3 and whose role is not among the last 12. Searches keep relevance order and
  role pages keep `sort`. The home strip (`pickFeatured`) takes each area's `START_HERE` agent first.
- The roster in memory (`directory/service.ts`): each Worker instance reads every live persona from D1 once a minute
  and shares that read between requests; a failed read keeps the last good roster. Anything that writes the
  `personas` table calls `forgetPersonas(env)`. Reading the roster on every request overloaded D1 under crawls.
- Going back (`ui/lib/router.tsx`): each history entry keeps its scroll position and page state from
  `useHistoryState` (the browse page keeps how many cards are shown, 20 more per "View more agents"). Back and
  forward restore both on every page. `ui/lib/api.ts` keeps recent `/api/agents` answers for 3 minutes, so the page
  draws at full height at once. Change the address with `replaceAddress`, never `history.replaceState(null)`, or the
  entry forgets what it holds.

## Search, the work line and the toolbox on a profile

- **Search** (`directory/search.ts`; `service.ts` `searchPersonas` and `listPersonas` call it, so `GET /api/agents?q=`,
  the plain `/agents?q=` page and the MCP tool `list_agents` rank the same way). A request is cut to the words that
  carry it, each matched in any form (`stem`) and through a short list of stand-ins. Searched, strongest first:
  name, title and role name; role aliases; outcome titles and hints; tagline; the role's toolbox task names; the job
  types behind the outcomes; then bio, capabilities and deliverables, which add to a score but never make a match.
  "Not for" lines are never searched. An agent matches when it covers 60% of the request's weight (rare words weigh
  more; words after "for my" and the person in "hire a developer" weigh little). Each match is scaled by what the
  work is: when the thing itself is asked for and some agent makes it, a review of it counts about half, so makers
  come before auditors; "audit my landing page" turns that round. Agents within 5% of each other go in `sort` order.
- **The work line** (`directory/work.ts`, no imports, shared with the browser app). `workLine(outcomes, not_for)`
  reads each outcome's title as a made thing, a plan or a review and gives "Makes: ...", "Plans and briefs: ..." or
  "Reviews and advises: ..." with up to three things named, plus the agent's own "Not for" line when it says the
  agent does not make the finished thing. Cards and profiles show it under the title; `pages.ts` and `llms.txt`
  say the same. Nothing rewrites persona text.
- **The toolbox on a profile** (`directory/toolbox.ts`, `views.ts`). `scripts/role-toolbox.mjs` (run first by `npm
  run build`; `--check` exits 1 when stale) writes `directory/data/role-toolbox.json` from every role kit (its
  skills, prompts and workflows, named by each file's first heading) and its `toolbox.json` (tasks, library items,
  helper roles), naming library items from `catalogue-items/` and keying them by their page path on useaiblocks.com
  (the library site's `kindPath` rule; items with no page are listed under `unpaged` and never linked). The Worker
  imports that file; the browser app never does. The profile shows "What I can do" (the role's tasks, the agent's own
  first, `TASKS_SHOWN` before "Show all", grouped as made, planned or reviewed) and "What I bring" (counts are the
  list lengths). `outcomeSkill` picks the skill behind "See how I do this" by what the outcome is, not by its job
  type alone. A role with no `toolbox.json` shows its kit's own files and no task list.
  `test/directory-toolbox.test.ts` fails while the committed data file is stale: run `node scripts/role-toolbox.mjs`.

## UI map

| Owner | Pages |
|---|---|
| core | `/` home (with "What do you need done?", a search box that leads to `/agents?q=`), `/invite` |
| directory | `/agents` (`?role=<id>`: the role's name and summary as the heading, the area chips kept), `/agents/:id` (role link, "My channel team" for mega agents, "Use this agent in your own AI" and "What's inside"), `/agents/:id/files/<path…>` (file viewer), `/guides`, `/guides/:slug` (all public) |
| intake | `/new`, `/requests/:id` (buyer) |
| delivery | `/jobs`, `/jobs/:id` (buyer) |
| evaluation | `/review` (reviewer) |
| ops | `/ops`, `/ops/jobs/:id`, `/ops/agents`, `/ops/experts`, `/ops/beta`, `/ops/costs` (ops); `/ops/invites` and `/ops/job-posts` are drawn by the experts module |
| studio | `/studio` (with "Upload a trained pack"), `/studio/agents/:id` (expert) |
| experts | `/experts/apply` (signed-in; `?invite=<token>` fills it in from the invite), `/experts/invite/:token` (public, noindex), `/experts/:slug` (public profile, indexed), `/expert` (signed-in: status, then dashboard once approved: setup checklist, agents, jobs from businesses, public page and share link, agreement), `/job-posts`, `/job-posts/new`, `/job-posts/:id` (signed-in), `/ops/invites`, `/ops/job-posts` (ops) |
| mcp | `/connect` (public), `/oauth/consent` (signed-in) |

Header links (`nav`): Agents, Describe a job and My jobs (only with `me.hostedJobs`), Review (reviewers), Studio
(experts), Ops (ops); account menu: Expert dashboard, Connect your AI, Apply as an expert, Post a job for experts. Pages with `access: "buyer"`
show "Our agents work in your own AI" to anyone without `me.hostedJobs`. `/connect` also lists the public API. The footer's Agents column adds Guides (`/guides`).

## Expert invites, profiles and job posts

All in `src/modules/experts/` (`invites.ts`, `profiles.ts`, `posts.ts`); no model calls, no prices.

- **Founding invites** (migration 0020: `expert_invites`, `experts.invite_id`). Ops make an invite (name, optional
  email, areas, jobs, private note) and get `/experts/invite/<token>` (24 random bytes, URL-safe; it only opens the
  invite page and fills in the application). Email goes out only from "Send invite email" (`notify` with `toEmail`).
  Status is derived: revoked, else the expert's review (approved, rejected, paused), applied, opened (first call to
  `GET /api/experts/invites/:token`), created. An application with `invite_token` is tied to the invite in the same
  batch (one expert per invite), shows `invited`, and sorts first among waiting applications. Revoking works until
  someone applies.
- **Public profiles** (migration 0021: `expert_profiles`). A row per approved expert (made on approval, by the cron and
  on first use); `slug` comes from the name once and never changes (`apply`, `invite` and a few others are reserved).
  `/experts/<slug>` is public only while the expert is approved and has a live expert agent on a live persona, else a
  real 404. `pages.ts` gives it head tags (ProfilePage + Person, BreadcrumbList), crawler copy, boot data
  (`/api/expert-profiles/<slug>`) and a sitemap entry; robots.txt allows `/api/expert-profiles/` and blocks
  `/experts/apply`, `/experts/invite/`, `/e/` and `/job-posts`. Experts edit `headline` (140) and `bio` (40 to 800)
  from the dashboard; until then the application headline and persona bio stand in.
- **Share links and attribution.** `/e/<slug>` (handled in `app.ts`) and `?via=<slug>` on any page set the
  first-party cookie `aib_via=<slug>` (HttpOnly, SameSite=Lax, 90 days) when the browser has none: first touch wins.
  Each follow counts in `expert_profiles.link_visits` (not bots, not again for a browser that already holds that
  code). On a person's first sign-in here, `ensureAccount` sets `users.referred_by_expert` from the cookie (the only
  thing stored about a visitor; not copied into events). `POST /api/share/agent-use { agent }` adds to
  `link_downloads` when the cookie (or the account's referrer) is that agent's expert, once per agent per browser
  (`aib_via_used` cookie). Experts' agents have no download yet, so nothing calls it today; call it from the download
  buttons when expert packs ship. The dashboard shows visits, sign-ups (`COUNT(users)`) and downloads.
- **Setup checklist** (`onboardingChecklist`): agreement (current version accepted), profile (headline and bio saved),
  studio interview, past work, marked-up drafts, test bench (`expertStudioProgress` in studio/service.ts, any of the
  expert's agents), go live (a live agent), share (at least one visit). Nothing is ticked by hand.
- **Job posts** (migration 0022: `job_posts`, `job_post_replies`, `expert_post_digests`). A signed-in person posts
  title, plain-text brief (40 to 3000), area, optional job type and https website, and when they need it; no budget.
  Text that looks like a password or key is refused. Limits: 3 posts a day, 5 open. Approved experts whose areas or
  jobs match see open, visible posts (not who posted) and reply once (600 characters). Only the owner and ops see the
  replies, with each expert's profile link while it is public. Picking a reply closes the post and emails both sides
  the other's checked email (`notify`). The owner can close or delete (title, brief, website and reply notes are
  cleared at once); the cron clears every post's text when `expires_at` (60 days) passes and marks open ones expired,
  and sends each matching expert one digest of new posts at most every 24 hours. Ops can hide a post with a note the
  owner sees.

## Agent packs

Every agent is a person hired for a **job role** (`Persona.role`, one of `src/modules/directory/data/roles.json`).
Behind each one is a free download laid out like a GitHub repo, which anyone can load into their own AI. There are
two kinds. Both are under the AI Blocks Agent Pack Licence 1.0 (free to use and change, not to sell;
`pack.json` `"license": "LicenseRef-AI-Blocks-Pack-1.0"`; the text is `packs/shared/LICENSE.md`).

| Code | What it does |
|---|---|
| `src/modules/packs/zip.ts` | Zip writer and reader, no dependencies, Node 24 and Workers (CompressionStream `deflate-raw`, CRC-32, UTF-8 names, fixed dates). The reader is for untrusted uploads: caps on entries and unzipped bytes (checked before and while inflating), rejects encryption, zip64, absolute paths, `..`, backslashes and duplicate names (ignoring case). |
| `src/modules/packs/build.ts` | `buildPack({ persona, role, kit, jobTypes, templates, options })`: pure and deterministic (same inputs, same bytes and sha256). `packZip`, `filesIndex`, `validateRoleKit`, `fillTemplate`, fallback templates. |
| `src/modules/packs/format.ts` | `PACK_SCHEMA`, `PACK_LICENSE`, `TEMPLATE_MARKER`, the pack.json types and the upload schema. |
| `src/modules/directory/roles.ts` | Loads and validates `roles.json` (`{ id, name, department, summary, aliases }`); `checkRoleKitJson` checks a kit's role.json against it. |
| `scripts/build-packs.mjs` | Runs after `vite build` (`npm run build`), writes `dist/packs`. |
| `scripts/build-claude-plugins.mjs` | Runs after build-packs, writes `dist/packs/claude/`: the Claude Code plugin marketplace (`marketplace.json`) and one plugin zip per job role (`<role-id>.zip`). |
| `src/modules/studio/import.ts` | `POST /api/studio/import`: start a studio agent from a trained pack. |
| `scripts/check-pack-sources.mjs` | Checks every source URL in the role kits; first step of the knowledge refresh. |

**"Download this agent"**: `/packs/<agent-id>.zip`, folder `<agent-id>/`: `README.md`, `AGENTS.md` (entry point; it
sends every job through WORK-METHOD.md first and asks once, five questions at most, for what capture cannot tell),
`CLAUDE.md` (`@AGENTS.md`), `WORK-METHOD.md` (the Grounded Job Protocol: frame, ground, taste, diverge, build, check,
record, with the gates and craft weights; from `packs/shared/WORK-METHOD.md`, a required template), `context/README.md`
(`contextReadme` in build.ts: the `context/` folder layout, then what to capture for each family of the agent's job
types, from `CAPTURE` in `packs/families.ts`, then the tools; the client's files go in their own project, never in the
pack), `soul.md` (`soulMarkdown` in directory/soul.ts, also served at `/agents/<id>/soul.md`:
"# Name, title", then the training template's headings Who I am, How I think, What I care about, My habits, When we
disagree, Off the clock; a short "Who I am" from the bio when the persona has no soul yet), `personality.md` ("How I
talk" from the soul's voice, then `profile.style` under the template's headings when present; whose style wins in the
work is in OUTPUT-POLICY.md), `playbook.md` (what I deliver, what I need first per job: context, then details, the
method, which job skill holds each job's gates and craft, handoff, and "## Rules I learned" for typed lessons:
`decision_rule`, `taste_reference`, `never_do`, `exemplar`, `check`), `OUTPUT-POLICY.md`, `QUALITY-METHOD.md` (only
for hosts using the MCP job tools), `knowledge.md` (the role kit's knowledge, then "My specialty" from capabilities and
good_at; with no kit yet a plain "coming" note, and pack.json `knowledge.status` is `pending`), `access.md`,
`skills.md` (every SKILL.md in one file under `## <skill name>`, for chat apps that take one upload),
`skills/<slug>/SKILL.md` (the role's skills, plus one job skill per linked job type at `skills/<job-type-id>/`, Agent
Skills frontmatter `name` = folder and `description` up to 1,024 characters; when the role kit already has a skill
with the job type's name, the role skill keeps it and the job skill becomes `skills/<job-type-id>-job/`, with a build
note. A job skill has "Get this first" (the job type's `context_requirements`), then the spec fields, "How to run this
job" (the six WORK-METHOD.md steps as they apply to the job's family), "Gates: pass or fail" (`gates` plus the
critical rubric items) and "Craft: scored" (`craft_rubric`). When a role kit skill or workflow matches the job
(`bestRoute` in `packs/route.ts`, score 1.2 or more, or a kit skill named after the job type), the Build step points
to it for the craft, and the job skill is then the same for every agent in the role (`source: "role"`)),
`prompts/*.md`, `workflows/*.md`, `library.md` (links to `https://useaiblocks.com/skills/<slug>`; a "coming" note
while the role kit has no `library.json` rows), `sources.md` (a "coming" note while the role has no sources),
`tools/` (below), `LICENSE.md`, `CHANGELOG.md` and `pack.json` (`{ schema: "ai-blocks-agent-pack/1", kind, agent_id, name, title, role,
version, updated, source, license, job_types, knowledge: { status, updated, sources, review_every_days }, files: [{
path, bytes, sha256 }] }`; a trained pack may add `trained_by` and `based_on: { agent_id, version, source }`). The zip
(only the zip) also holds byte-identical copies of `skills/` in `.agents/skills/` (Codex, Cursor) and
`.claude/skills/` (Claude Code), after the pack's files; they are not in pack.json `files`, files.json or the viewer.
`library.md` and `sources.md` are in every pack of both kinds, because AGENTS.md and README.md name them.

**Tools** (`TOOL_FILES` in build.ts, files.json kind `tool`): `tools/capture-brand-dna.mjs` (captures a live site into
`context/brand-dna.json` and screenshots; Node and Playwright), `tools/brand-dna-snippet.js` (the same capture, pasted
into a browser console), `tools/check-brand-fidelity.mjs` (checks a built page against `context/brand-dna.json`),
`tools/ai-default-patterns.md` (the named AI defaults to avoid), `tools/compare-candidates.mjs` (candidates side by
side for an outside pick) and `tools/brand-file.mjs` (checks the living `context/brand-file/` folder with
`status --for <kind>`, so a job refreshes only the stale parts). The list in build.ts is the source of truth. Only agent packs carry them; the one-file text leaves
the scripts out. A train pack has no `tools/` (the studio import takes text files only). Wherever a pack lacks a tool,
`resolveToolRefs` rewrites each `tools/<file>` reference to `<origin>/tools/<file>`. `scripts/build-packs.mjs` takes the
tools from the library, `catalogue-items/general/{brand-dna-capture,brand-fidelity-check,ai-default-patterns,grounded-job-protocol}/`
at any depth (the defaults list there is `ai-default-patterns/patterns.md`, carried as `tools/ai-default-patterns.md`),
else from `packs/shared/tools/<file>`; a tool found in neither is left out with a note. `--tools=<dir>` reads them all
from one folder instead. The build prints where each tool came from.

**Toolbox** (`src/modules/packs/toolbox.ts`, `scripts/build-packs.mjs`). A role kit with a curated `toolbox.json`
(schema `ai-blocks-toolbox/1`: tasks, and per task the kit files and library items to use, each with a "when") gives
every agent in the role a `toolbox.md`, read right after AGENTS.md: the "when this, use that" list, kept under
`TOOLBOX_WORD_BUDGET` words. Each library item it names is read once from `catalogue-items/` and rendered once, so every
pack holds the same text under `toolbox/<type>/<slug>.md`, and the browsable copy is stored once at
`dist/packs/toolbox/<type>/<slug>.md` (with `dist/packs/toolbox-index.json`, library slug to the roles that carry it).
Nothing is searched at job time: the agent opens only the files it chose. A role with no `toolbox.json` gets a
`toolbox.md` that is the plain list of the pack's skills. The shared WORK-METHOD.md tells the agent to write
`context/spec.md` first and to check the brand file before capturing anything again.

**"Train your own"**: `/packs/<agent-id>-train.zip`, folder `<role-id>-agent/` (the title as a slug when the persona
has no role): the same base without the persona's soul, style, bio or portrait. `soul.md` and `personality.md` are
templates whose first line is `<!-- template: replace this file during training -->` (the builder adds it if a
template lacks it). The training `AGENTS.md`, `README.md` and `instructions.md` (the coach) come from
`packs/shared/train/`. `playbook.md` marks each section "Base method: make it yours" and ends with "## Rules I
learned". `training/interview.md` and `training/test-briefs.md` come from the role kit (fallback: generic questions,
and one public sample brief per job type, never a hidden one), `training/scorecard.md` from the rubrics,
`examples/README.md` from `packs/shared/train/examples-README.md`. It also starts with four empty logs the coach fills
in (`TRAIN_LOGS` in build.ts): `training/capture-log.md`, `training/improve/inbox.md`, `training/improve/graveyard.md`
and `training/decision-journal.md`. In this kind `{{name}}` and `{{title}}` are the agent
the pack starts from, and `{{bio}}` and `{{tagline}}` are the role's summary.

**Inputs.** Role kits live in `packs/roles/<role-id>/` (`role.json`, `knowledge.md`, `access.md`, `sources.json`,
`library.json`, `skills/`, `prompts/`, `workflows/`, `training/`). A kit counts once it has `role.json` and
`knowledge.md`. Its role.json id, name and department must match roles.json, and its skills' frontmatter must match
their folders, or the build stops. Kit files are copied as they are: their own `{{placeholders}}` are for the person
using the prompt and are never filled or rejected. Shared templates in `packs/shared/` may use only `{{name}}
{{title}} {{role_name}} {{tagline}} {{agent_id}} {{role_id}} {{department}} {{version}} {{updated}} {{bio}}
{{profile_url}} {{pack_url}} {{train_pack_url}} {{one_file_url}} {{guide_url}} {{studio_url}} {{mcp_url}} {{not_for_inline}}` and the blocks
`{{files_table}} {{skills_list}} {{prompts_list}} {{workflows_list}} {{outcomes_list}} {{not_for_list}}
{{intake_list}}`. Any other `{{...}}` fails the build, naming the template. A missing template falls back to a minimal
one in build.ts.

**Job type fields for the Grounded Job Protocol** (`catalogue/schema.ts`, optional in the schema; every job type in
`catalogue/data/` has them): `family` (one of `DELIVERABLE_FAMILIES` in `core/types.ts`: web_page, ad_creative, copy,
email, audit, analysis, strategy, plan, code, ops_doc, other), `context_requirements` (1 to 10 `{ id, label, required,
how }`, unique ids), `gates` (1 to 10 pass/fail checks), `craft_rubric` (3 to 10 `{ criterion, weight, test }`, weights
summing to 100) and `mode_default` (`patch`, `extend` or `new`). The builder reads them through `packs/families.ts`;
a missing field falls back by family (guessed from the title, then the deliverable, then the area): the family's
default context list, the non-critical rubric items plus the family's craft weights in WORK-METHOD.md, and mode
`patch` for web_page, copy and email.

**Versions.** `packs/versions.json` (committed) holds, for every pack (`"<id>"` and `"<id>-train"`), `{ hash, version,
updated }`. The hash (`packContentHash`) is sha256 over "path TAB sha256" lines of every file of the pack built with a
placeholder version, so pack.json and CHANGELOG.md count too without carrying a version. `npm run packs:lock`
(`build-packs.mjs --lock [--date=YYYY-MM-DD]`) keeps an entry while its hash is the same and gives a new or changed pack
the day's date. The build reads the lock and stops when it is stale ("Run npm run packs:lock, then commit
packs/versions.json"), so an unchanged pack is byte-identical from build to build and a deploy never re-uploads it.
After any change to personas, job types, roles, kits or templates: `npm run packs:lock`, then commit the lock.

**Build step.** `npm run build` = `node scripts/mega-team.mjs`, `node scripts/role-toolbox.mjs`, `vite build`, then `node scripts/build-packs.mjs` (also used by `worker:dev` and both
deploy scripts). `--only=id,id` builds a few. Static assets serve the packs; the Worker routes `/tools/<file>`
and `/agents/<id>/skills/<skill>.txt` read from them. Agent ids may not be `roles`, `claude`, `jobs`, `mega`, `tools` or
`index`.

**Claude Code plugins** (`scripts/build-claude-plugins.mjs`, last in `npm run build`). One plugin per job role, so people
install only the teams they want: every installed agent's description sits in context in every Claude Code session
(about 70 to 90 tokens an agent). Users run `/plugin marketplace add <origin>/packs/claude/marketplace.json`, then
`/plugin install <role-id>@ai-blocks`; agents show as `<role-id>:<agent-id>` under Custom agents. Each entry is an
`archive` source pinned with `sha256`, so no git repository is involved. A plugin zip holds `agents/<agent-id>.md`
(front matter plus the pack's AGENTS.md, with the pack folder named as `${CLAUDE_PLUGIN_ROOT}/packs/<agent-id>/`),
the agent's whole pack under `packs/<agent-id>/`, `.claude-plugin/plugin.json`, README.md and LICENSE.md. The agent
works in `ai-blocks/<agent-id>/` in the user's project and runs the pack's scripts from there, because the plugin
folder is replaced on update. The entry `version` (newest pack date plus the zip's hash, e.g. `2026.11.14-623ea5b0`)
changes only when a plugin's content does, which is what tells Claude Code an update is out; plugin.json has no
version of its own, so the two never disagree. Zips stay byte-identical while their packs are unchanged. Limits the
script enforces: 24 MiB a zip (Workers' 25 MiB asset limit) and 60,000 entries (no zip64). The profile's "Start in
your AI" block has a Claude Code tab for agents with a job role (`startGuides` in `ui/pages/directory/packs.ts`).
Check a build with `claude plugin validate dist/packs/claude/marketplace.json`.

**The pack linter** (`src/modules/packs/lint.ts`, `lintPack`) runs on every pack the build makes, agent and train, and
any finding fails the build. Rules: `missing_file` (a file names a pack file or folder path the pack does not hold;
lines in an "Optional" section or saying "not in this pack", `examples/`, and the training logs the coach creates are
exempt), `limit_conflict` (the builder's own files set one limit, such as the number of questions, to two numbers),
`repeated_paragraph` (a paragraph of 120 characters or more twice in what the agent reads) and `made_up_business`
(`MADE_UP_BUSINESSES`: Sprout but not Sprout Social, Harbourside Pottery, Tidewell). Findings are grouped by message
with the packs they hit. `node scripts/build-packs.mjs --lint=report` prints them all and goes on.

Public URLs (all under agents.useaiblocks.com):

| URL | What it is |
|---|---|
| `/packs/<id>.zip` | "Download this agent" (folder `<id>/` inside) |
| `/packs/<id>-train.zip` | "Train your own" (folder `<role-id>-agent/` inside) |
| `/packs/<id>.txt` | The whole agent in one plain text file for chat apps (`oneFileText` in `packs/build.ts`): a short header, then every file the agent reads, AGENTS.md first, each after a `===== FILE: <path> =====` line. README, CLAUDE.md, CHANGELOG, pack.json, QUALITY-METHOD.md, the tool scripts (linked at `/tools/<file>`) and each `skills/*/SKILL.md` (all in skills.md) are left out. `.txt` because every chat app takes it. Made from the agent pack, so it shares its version. |
| `/packs/<id>/<path>` | The agent's own files of its pack: README, AGENTS, CLAUDE, WORK-METHOD, context/README, soul, personality, playbook, knowledge, skills.md, LICENSE, CHANGELOG, pack.json (and access.md while the role has no kit) |
| `/packs/roles/<role-id>/<path>` | Each ready role kit once, its files as they stand (role.json, knowledge.md, access.md, sources.json, library.json, skills/, prompts/, workflows/, training/), plus `sources.md` and `library.md` as the packs carry them |
| `/packs/jobs/<skill-slug>/SKILL.md` | Each job skill once (`<job-type-id>`, or `<job-type-id>-job` when the role kit has a skill of that name). A job skill that points into a role kit is at `/packs/roles/<role-id>/skills/<skill-slug>/SKILL.md` instead. |
| `/packs/tools/<file>` | Each tool once (static copy) |
| `/tools/<file>` | The same tool through the Worker (`directory/routes.ts`), `text/markdown` or `text/javascript`. Only names in `TOOL_FILES`; 404 with the list for any other name, or while the tool is not built. Packs and the one-file text link here. |
| `/agents/<id>/skills/<skill>.txt` | One skill of a live agent with what the agent reads first, in one text file for chat apps (`skillOneFile` in `mcp/pack-files.ts`): the `load_agent` payload with that skill named instead of routed. 404 for an unknown agent or skill. |
| `/packs/mega/<kit>/<path>` | Each ready mega kit once, its files as they stand (kit.json, orchestrator.md, variants/, channels/, agents/<channel>.md, prompts/, workflows/, training/) |
| `/packs/<id>/files.json` | `{ schema: "ai-blocks-pack-files/1", agent_id, kind: "agent", role, version, updated, knowledge, zip: { url, bytes, version }, train_zip: { url, bytes, version }, one_file: { url, bytes, version }, files: [{ path, url, bytes, purpose, kind }] }`. `knowledge` = `{ status: "ready" | "pending", updated, sources, review_every_days }` (packs built before 7 Nov 2026 say just `"ready"` or `"pending"`; the UI reads both). `url` is where the file's text is served (under the agent, the role or the job); the UI always uses it. File `kind` = start, identity, work, knowledge, skill, prompt, workflow, training, tool, team, channel or about. List files in the order given. `routes` = `[{ path, kind: "job" \| "skill" \| "workflow", name, text }]`: every job skill (name: title and keywords; text: summary and deliverable), role kit skill (name and description) and role kit workflow (title and opening), what `load_agent` routes a request to (packs built before 9 Nov 2026 have none). |
| `/packs/index.json` | `{ schema: "ai-blocks-pack-index/1", count, packs: [{ id, name, title, role, version, updated, knowledge, files, files_url, agent_zip: { url, bytes, version }, train_zip: { url, bytes, version }, one_file: { url, bytes, version } }] }` |
| `/agents/<id>/soul.md` | The Worker's soul.md (same text as the pack's) |
| `/guides/<slug>` | A browser-app page (SPA fallback, no Worker route) that renders `src/ui/content/guides/<slug>.md`, bundled at build time with a Vite `?raw` import (`src/ui/pages/directory/guides.tsx`; a new guide is listed in `GUIDES` there). Slugs: `train-your-own-agent` (the packs' `{{guide_url}}`), `use-an-agent-pack`. `/guides` lists them. |

**Routing a request** (`load_agent` with `request`; `loadPayload` in `mcp/pack-files.ts`, `packs/route.ts`; no model).
The first payload is the core files, then the skill or workflow the request routes to, in full, then the knowledge.md
sections most relevant to the request and that skill, all within `MAX_LOAD_CHARS` (58,000 characters; knowledge at most
`MAX_KNOWLEDGE_CHARS`, 16,000). `bestRoute` scores the request's words against files.json `routes` (name words count
more than text words, words many candidates share count less, a whole multi-word name in the request adds 1) and needs
`MIN_ROUTE_SCORE` (0.6); a pack without `routes` is routed over its SKILL.md and workflow files by path and purpose.
`relevantSections` always ranks the decision rules, quality bar, common mistakes and specialty sections. The result
carries `routed`, `knowledge_sections` and `chars`; with no match the text says to follow WORK-METHOD.md and playbook.md.
Everything not returned whole stays listed for `get_agent_file`.

**In the browser app** (`src/ui/pages/directory/packs.ts` for data and pure helpers, `pack-parts.tsx`, `file.tsx`). A
profile reads `/packs/<id>/files.json` (and `/packs/index.json` only when files.json does not name the zips) and shows
"Start <name> in your AI" (`PackDownloads`): a tab per app (`startGuides` in packs.ts: ChatGPT, Claude, Gemini, Coding
apps, Connector; the choice is kept in localStorage `aib-start-app`), each with three steps: get the agent (the one
file for chat apps, the zip for coding apps, `/connect` for the connector), open it, and paste a first message that
needs no editing (the agent introduces itself and asks what the person needs). A one file over `LARGE_ONE_FILE` bytes
(the mega agents) goes in a Claude project, not a single chat. Below the tabs: the full folder, "Train your own" with
its size, "How training works", the licence line ("Free to use and change in Claude, ChatGPT, Gemini, Codex or Cursor. Not for
resale.", linking to LICENSE.md in the viewer), the knowledge line ("Role knowledge checked <d Mon yyyy> from <n>
sources", or "Role knowledge is being researched"; knowledge may be the string `ready`/`pending` or the object), then
"What's inside" (files grouped by kind, in files.json order). A missing pack (an expert's agent, or a local app before
`npm run build`; the SPA fallback answers missing files with HTML, which counts as missing) hides both, with a short
note for house agents. The viewer `/agents/<id>/files/<path…>` opens only a path files.json lists (relative, no `..`,
dot folders, backslashes or `%`), fetched from the file's `url` when it is a same-site `/packs/` address, else
`/packs/<id>/<path>`; markdown goes through marked and DOMPurify with media, forms and styles removed (nothing loads
from another site; links to other sites open in a new tab), a skill's frontmatter shows as a block, JSON is
pretty-printed in a `<pre>`.

**Mega agents** (`Persona.mega: { kit, variant }`, code in `src/modules/packs/mega.ts`). The kit is
`packs/mega/<kit>/` (kit.json with exactly 19 channels, orchestrator.md, variants/<variant>.md, channels/<id>.md,
agents/<id>.md with frontmatter name `<id>-specialist`, prompts/, workflows/, training/). On top of the normal files a
mega agent's pack has `traction-playbook.md` (orchestrator.md, then the agent's variant; in the training pack it is
marked as the base method), `channels/<id>.md` and `agents/<id>-specialist.md` for all 19 (files.json kinds `channel`
and `team`), and the kit's prompts, workflows and (training pack) training files next to the role kit's, a clashing
name getting the kit id as a prefix (`prompts/traction-<name>.md`); the kit's interview and briefs replace the generic
fallbacks when the role has none. AGENTS.md gets "My channel team" from `{{team_list}}` (empty for other agents; added
at the end while a template lacks it). The zip also copies the specialists to `.claude/agents/` (zip only). pack.json
and files.json carry `mega: { kit, variant }` and `team: [{ id, name, agent, description }]`; knowledge counts the kit
(latest date, all sources, shorter review cycle), and sources.md lists every Sources section of the orchestrator, the
variant and the 19 channels, grouped by file. A missing or incomplete kit (or a missing variant file) never fails the
build: the agent builds as a normal pack, with a note. On the site, `src/modules/directory/mega.ts` gives cards
`mega: { variant, team_size }` ("Leads a team of 19") and the profile `team: [{ id, name, job }]` ("My channel team",
credited to the Bullseye method from *Traction*), from `src/modules/directory/data/mega-traction.json`, which
`scripts/mega-team.mjs` writes from kit.json and each `agents/<id>.md` description (`job` falls back to the channel
name). `npm run build` runs it first; it keeps the file as it is while kit.json is missing. Seeded rows take `role`
and `mega` from the data files (the personas table has no columns for them).

**Import (studio).** `POST /api/studio/import?job_type_id=<id>[&examples_rights=1]`, approved experts only, body = the zip
(`application/zip` or `application/x-zip-compressed`, at most 2 MB). Checks: zip reader limits (300 entries, 1.5 MB
unzipped, 200 KB a file); a single top folder is removed; macOS and Windows junk files are skipped; only .md, .json,
.txt and .csv; UTF-8; `looksLikeSecret` on every file; pack.json schema with `kind: "train"`; `pack.json`, `soul.md`,
`personality.md`, `playbook.md` and `knowledge.md` present; soul.md and personality.md no longer start with the
template line; `job_type_id` listed in pack.json `job_types`. Then `createStudioAgent` (the same approved-job and
one-agent-per-job rules) and `savePlaybook` (playbook_source `expert`). Uploading again for the same job, when this
expert's agent for it came from a pack, updates that agent instead (a new playbook save and a new pack row, 200 with
`updated: true`); an agent built in the studio without a pack is never overwritten (409). The playbook is playbook.md, then "Rules I
learned", then a short "How I work and write" from soul.md and personality.md, then "What I know" (the expert's "My
know-how" first), within 20,000 characters: knowledge is trimmed first, then the voice part, then the playbook text;
the rules never (too many rules is a 413). Every upload is stored in **`studio_pack_imports`** (migration
`0017_studio_pack_imports.sql`: `id` PK, `agent_id` references agents (one row per upload, newest = current), `files`
JSON `[{ path, bytes, sha256, content }]`, `examples` the same shape for `examples/` only, `examples_rights` 0/1,
`sha256` and `bytes` of the zip, `created_at`) with a `studio.pack_imported` event (with `update`, `trained_by` and
`based_on`). Every sha256 is worked out on upload; the hashes in the uploaded pack.json are never trusted. `examples/`
is the expert's past work: private, for review and testing, never in a public download or file viewer. With
`examples_rights=1` (the expert confirms they own the examples or may use them, and that they are anonymised) each
`examples/*.md` with "## The brief" and "## What I delivered" also becomes a studio example through `addExample`
("Rights:" naming a client gives client_permission); others are skipped with a warning, and the same example is
never added twice. Skill copies in `.agents/skills/` and `.claude/skills/` are dropped when they match `skills/`.
Returns `{ agentId, agent, updated, playbookChars, trimmed, warnings, examplesAdded }` (201, or 200 for an update).

**Imported agents in the studio.** An import counts as done for the interview step (soul, personality, knowledge and
playbook replace it) and the markup step ("Rules I learned" replaces marked passages). `buildVersion` runs for an
agent with playbook_source `expert` that came from an import without studio examples or marks. The test bench
against plain AI (publishing needs a tested version) and ops review still apply in full.

**Knowledge refresh (every `review_every_days`, usually 14).** 1. `node scripts/check-pack-sources.mjs` fetches every
source URL (4 at a time, a timeout, a User-Agent naming AI Blocks, English Accept-Language, no redirects followed) and
writes `packs/sources-report.json`, sorting each into ok, same_page (trailing-slash or `hl=` redirects), moved, dead
(404/410), failed (often a site blocking automated checks: open it by hand) or error. 2. A research helper fixes or
replaces each dead or moved source (opening the page again to confirm it is the same content) and re-checks the facts
listed under "What changes fast" in the kit's knowledge.md, with new dates. 3. It bumps role.json `updated` and adds a
`changelog` line. 4. `npm run packs:lock` gives every agent in that role a new pack version, and the next build and
deploy ship it. Only roles whose `updated` plus `review_every_days`
has passed need steps 2 and 3, so most runs are the cheap check alone.
