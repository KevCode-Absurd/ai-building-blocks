# Free workflow accounts

Kevin's decision, 22 October 2026: keep the product free. Require login for AI
workflow generation, measure use and costs, and review monetization around 5,000
and 10,000 completed AI generations. These milestones do not change access or
start billing. No pricing tiers, checkout or subscription integration is included.

## Existing Clerk application

Use **AI Blocks**, `app_3L2Q3RkQnbjquiEQz5YhiWV8Orz`. Do not create another application.
The repository was linked through the Clerk CLI. Development keys were pulled to
ignored `site/.env.local` without displaying them. The CLI selected Vite variable
`VITE_CLERK_PUBLISHABLE_KEY`; the local backend maps that public value to
`CLERK_PUBLISHABLE_KEY`. `CLERK_SECRET_KEY` remains server-only.

The project uses Preact with React compatibility, Vite and a standalone Workers
backend. It uses Clerk's JavaScript SDK and backend SDK rather than Next.js or
React Router middleware. Sign-in and sign-up redirect to Clerk's hosted Account
Portal and return to `/compose`; sessionStorage retains the unfinished request
for that return. The user must click Create my workflow after returning.

The Clerk SDK loads only when AI composition is selected. Public browsing, browser
assembly, editing, importing and downloads do not depend on Clerk loading.

## Enforcement and accounting

- `POST /api/compose` verifies a Clerk session on the server before loading the
  catalogue or making a provider call. Only active session tokens from this Clerk
  application's issuer and the request's allowed origin are accepted. The existing
  Cloudflare hostname, burst-limit and Turnstile checks remain in force.
- Missing Clerk configuration disables AI availability and fails closed.
- Each new `composer_jobs` row stores the verified Clerk `user_id`. Client-supplied
  account IDs are ignored. The migration preserves historical anonymous rows.
- Idempotency keys are scoped to the verified account. Retrying the same request
  after changing networks returns its existing result without another model call.
- Each account has ten attempted generations per UTC day. Failed and pending
  attempts count. The existing ten-attempt IP limit, burst limits and global daily
  dollar cap also remain. Creating accounts or changing IPs cannot bypass the
  global reservation ledger. The global cap is unchanged.
- `GET /api/auth` returns public configuration only. `GET /api/auth?usage` requires
  a session and returns only that account's successful count and daily attempts.
  It does not expose prompts, provider keys, other accounts or internal costs.
- Customer work drafts remain browser-local. Login does not add cross-device
  workflow history or change existing owner-key spaces and sharing behavior.

## Usage review

Run `tools/composer-usage.sql` against the intended D1 environment for an operator
summary. It returns aggregate counts only. Successful generations are rows with
`status = 'done'`; failures, pending reservations and historical anonymous jobs
are reported separately. The cost ledger includes reservations whose provider
billing outcome is unknown, so it is an estimate rather than a paid invoice.
There is no automatic paywall, notification schedule or periodic report.

The saved 22 October benchmark estimates the current GPT-6.1 Sol composition at
$0.0301553 per attempt. At that observed average, 1,000 is about $30.16; 5,000 is
$150.78; 10,000 is $301.55. Haiku and Luna had cheaper measured runs. See
`reports/2026-10-22-workflow-fresh20.json`; this is historical usage evidence,
not a price guarantee. Hosting, authentication, retries and execution of the
downloaded workflow are separate. No model was changed for this integration.

## Local verification

From `site/`, use `npm.cmd run dev` on Windows PowerShell. The auth-focused preview
uses port 5194 through `playwright.auth.config.ts` without regenerating catalogue
assets. `npm.cmd run test:unit` includes signed JWT tests and SQLite migration,
account isolation, concurrency and idempotency checks. Run
`npx.cmd playwright test --config playwright.auth.config.ts` for browser checks;
its account fixtures mock the browser SDK, and AI calls are mocked.

Real customer sign-in is a separate manual check. Have the owner sign in through
the preview; do not create test users in the existing Clerk application without
their approval. CLI account login is not customer application login.

## Production rollout

Clerk doctor confirmed the selected application's development instance is
available, and reported that its production instance is not yet configured.
The development configuration is not a production deployment.

1. In the owner's terminal, run `npx.cmd -y clerk@latest deploy` against this linked
   application to configure production for `useaiblocks.com`. Complete Clerk's
   domain, DNS and sign-in-provider setup. Do not enable billing or organizations.
2. Configure the intended staging and production environments separately. Set
   `CLERK_PUBLISHABLE_KEY` as a runtime variable. Store `CLERK_SECRET_KEY` as a
   Cloudflare Worker secret. An optional `CLERK_JWT_KEY` PEM public key supports
   networkless verification. Never put a secret in a `VITE_` variable, Git, a URL
   or a command argument.
3. Back up the database, then apply `0005_composer_accounts.sql` after `0004` to the
   separate staging database. Test migration, actual sign-in and a bounded AI
   request before applying the same migration to production.
4. Build and deploy the reviewed revision following the existing Cloudflare launch
   guide. Use explicit `wrangler.production.jsonc` for production. Existing ignored
   deployment configurations were not overwritten by this integration.
5. Verify signed-out rejection, signed-in generation, logout, expired sessions,
   account usage, attempt limits and duplicate requests on the deployed domain.
   Preserve the global budget. Rollbacks must use an application revision compatible
   with the new schema; the added nullable column may remain in place.

No production DNS, database, Worker secrets or deployment has been changed by the
local Clerk integration. Before a broad public launch, also finish the existing
job-result retention work described in the composer launch documentation.
