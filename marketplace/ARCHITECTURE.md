# AI Blocks Agents: architecture and build contract

The marketplace at **agents.useaiblocks.com**: buyers hire named AI agents (personas such as "Nova, SEO strategist"),
get a fixed quote, and receive checked, finished work. Experts apply, build their own agents in the studio, and
see how their agents perform. Payments are **on hold**: prices are quoted and recorded, nothing is charged.

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
| experts | `src/modules/experts/*`, `src/ui/pages/experts/*`, `migrations/0008_*.sql`, `test/experts*.test.ts` | applications, agreement, review, expert dashboard, expert personas |
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
| directory | `GET /api/agents?area=&q=`, `GET /api/agents/:id` |
| intake | `POST /api/requests`, `GET /api/requests/:id`, `POST /api/requests/:id/answers`, `POST /api/requests/:id/quote`, `POST /api/requests/:id/confirm` |
| delivery | `GET /api/jobs`, `GET /api/jobs/:id`, `POST /api/jobs/:id/accept`, `POST /api/jobs/:id/revise`, `POST /api/jobs/:id/reject`, `GET /api/notifications` |
| evaluation | `GET /api/review/blind/next`, `POST /api/review/blind/:id`, `GET /api/review/stats` |
| ops | `GET /api/ops/jobs`, `GET /api/ops/jobs/:id`, `POST /api/ops/jobs/:id/{release,rerun,cancel,assign,note,resolve}`, `GET /api/ops/gate`, `GET/POST /api/ops/beta-codes`, `GET/POST /api/ops/staff`, `POST /api/ops/seed`, `GET /api/ops/agents`, `GET /api/ops/costs` |
| studio | `/api/studio/*` (expert), `POST /api/studio/agents/:id/live`, `POST /api/studio/agents/:id/retire` (ops) |
| experts | `POST /api/experts/apply`, `GET /api/experts/me`, `GET /api/experts/me/dashboard`, `GET /api/experts/agreement`, `GET /api/experts` (ops), `POST /api/experts/:id/review` (ops) |
| mcp | `POST /mcp`, `GET /.well-known/oauth-authorization-server`, `GET /.well-known/oauth-protected-resource`, `POST /oauth/register`, `GET /oauth/authorize`, `POST /oauth/token`, `POST /api/oauth/approve` |

## UI map

| Owner | Pages |
|---|---|
| core | `/` home, `/invite` |
| directory | `/agents`, `/agents/:id` (public) |
| intake | `/new`, `/requests/:id` (buyer) |
| delivery | `/jobs`, `/jobs/:id` (buyer) |
| evaluation | `/review` (reviewer) |
| ops | `/ops`, `/ops/jobs/:id`, `/ops/agents`, `/ops/experts`, `/ops/beta`, `/ops/costs` (ops) |
| studio | `/studio`, `/studio/agents/:id` (expert) |
| experts | `/experts/apply` (signed-in), `/expert` (signed-in: status, then dashboard once approved) |
| mcp | `/connect` (public), `/oauth/consent` (signed-in) |

Header links (`nav`): Agents, New job, My jobs (signed in), Review (reviewers), Studio (experts), Ops (ops);
account menu: Expert dashboard, Connect your AI, Apply as an expert.
