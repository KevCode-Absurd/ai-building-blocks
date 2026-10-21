# Cloudflare launch handoff — 22 October 2026

The code is prepared for integration. No production deployment, DNS change, remote database creation or paid subscription was performed during preparation. The local readiness report is `reports/cloudflare-launch-readiness.json`; it describes built assets, not account readiness.

## Configure the Pages project

Connect `KevCode-Absurd/ai-building-blocks` to Cloudflare Pages. Select `main`, root directory `site`, build command `npm run build`, output `dist`, and Node 22 (also recorded in `site/.nvmrc`). Keep `CF_PLAN` unset for the free capacity guard. Set `PAGES_WRANGLER_MAJOR_VERSION=4` if the account's Pages build requires Wrangler selection.

The saved Mercatura tour is bundled at `/example-app/`. A separate example subdomain is unnecessary. The combined build fits the Pages Free file limit; a $5 Workers subscription is not needed merely to serve these files. Evaluate dynamic usage against the account's quotas after launch.

## Prepare D1 and secrets

From `site/`, authenticate Wrangler to the intended Cloudflare account. Inspect existing databases first; reuse the intended database rather than creating a duplicate. For a new setup:

```sh
npx wrangler d1 create ai-blocks
```

Copy `wrangler.example.jsonc` to ignored `wrangler.jsonc`. Replace both placeholder database IDs with the returned ID. The `COMMENTS` and `SPACES` bindings point to the same `ai-blocks` database. Keep the migrations directory as `migrations`.

```sh
npx wrangler d1 migrations apply COMMENTS --remote
```

Confirm both `0001_comments.sql` and `0002_spaces.sql` are applied. Do not reset an existing database. In Pages settings, bind `COMMENTS` and `SPACES` to that database for the target environment. Preview may use a separate database, with the same migrations, to keep test content out of production.

Add four separate random server-side secrets through Pages settings: `COMMENTS_SALT`, `COMMENTS_TEAM_TOKEN`, `SPACES_SALT`, and `SPACES_TEAM_TOKEN`. Store them in the team's password manager. Do not put them in Git, browser variables, screenshots or a `VITE_` variable. Keep salts stable after launch. Team tokens authorize moderation.

If using Wrangler configuration as the project's source of truth, configure matching environment bindings there; avoid contradictory dashboard/config values. The checked-in example has placeholders and is deliberately not the active account configuration.

## Verify a preview before the domain

Create a preview deployment through Pages and verify its build log includes Functions compilation and the capacity check. Plain static-file upload is insufficient for this app's API routes.

- Open `/`, `/how-it-works`, `/minds`, `/tools`, a skill page, and a deep link directly. Confirm the home library has 16 cards and Show more adds 16.
- Build a short workflow and open its downloaded ZIP. Check `HANDOFF.md`, source skill folders and workflow data. Saved browser context should reach the pack.
- Open `/apps` and its same-origin Mercatura tour. Confirm the saved-example notice and back link. The tour does not run new AI work.
- Post a test comment and reply; reload and confirm persistence. Verify team-only deletion refuses an unauthenticated request.
- Make a test space, save an item, reload, and open its share link in another browser. Sharing must be read-only. Rotate the link and confirm the old one stops working. Check a private item does not appear on `/people`.
- Check desktop and phone widths, keyboard navigation, console errors and unknown-page 404 status. Remove preview test content before reusing a production database.

Only after preview checks pass, associate the intended custom domain in the Pages project and follow Cloudflare's DNS instructions. Verify TLS, root and deep links, API persistence and the tour on the final domain. The repository's canonical search URL is `https://useaiblocks.com`; change the canonical source if a different final domain is chosen. Do not submit an unverified domain to search engines.

## Local preflight and rollback

```sh
npm --prefix site ci
npm --prefix site run build
npm --prefix site run test:unit
npm --prefix site run test:e2e
node tools/check-cloudflare-ready.mjs
```

Browser tests use development memory stores. Preparation also exercises the actual Pages Functions with a migrated local D1 database; neither replaces the preview checks above.

Record the deployed commit and successful preview URL. If a deployment fails, keep the domain on the prior working deployment and use Pages' rollback controls. A code rollback does not undo D1 writes or migrations; back up/export existing production data before future schema changes. The two current migrations create the required tables without deleting data.

References: [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/), [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/), [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/), [Pages limits](https://developers.cloudflare.com/pages/platform/limits/), [rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/).
