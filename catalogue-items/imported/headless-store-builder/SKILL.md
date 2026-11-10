---
name: headless-hydrogen
description: Build a TypeScript Shopify storefront from a pinned Hydrogen React Router starter, check it locally, and provide store-connection and Oxygen deployment steps. Use for a custom storefront that needs more control than a Shopify theme.
license: MIT
compatibility: Node.js 22.12 or later in the 22 release line, or Node.js 24; project files and a terminal for build checks. A real store is needed only to connect and launch.
metadata:
  author: shopify-agent-skills
  version: "1.1-ai-blocks"
  shopify-api-version: "2026-10"
---

# Build a Shopify storefront from a pinned starter

Get home, product, collection, search and cart pages in one TypeScript project. Start with clearly labelled fictional data. Connect a real store only when its owner is ready.

**AI Blocks adaptation, checked 28 October 2026:** This replaces the old Remix fragments with Shopify's React Router template at commit `8e5ea1124ffcabdb901b3a374e374f4908897190`. The bundled starter pins Hydrogen `2026.10.2`, React Router `7.15.1`, React `19.2.7` and the rest of the packages. A lockfile pins their dependencies. Keep the original import licence and the Shopify template licence with the files.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## What to ask for

- The design brief: who shops here, the pages needed, supplied brand assets and the changes wanted.
- A new project folder, or read access to an existing project to assess a migration. The starter never overwrites an existing folder.
- Demo or real-store mode. Demo mode needs no account or token. For a real store, ask for its domain and the owner's intended environment. The owner keeps credentials outside chat.
- Node.js 22.12 or later in the 22 release line, or Node.js 24, and a terminal. The recorded local check used Node.js 24 on Windows.

If you have no file or terminal access, explain the file plan and commands for the owner to run. Mark checks **Not run** until you receive their actual results. Do not claim you created, built, connected or deployed a storefront.

## 1. Create the pinned project

Read `scripts/create-project.mjs` before running it. From the downloaded skill folder, run this with a new folder path:

```bash
node scripts/create-project.mjs <new-project-folder>
```

The script fetches the exact Shopify template commit. It keeps the upstream licences, applies the pinned package file and lockfile, adds a visible demo-data label, and creates `.env` with `MOCK_SHOP=1`. It does not run a package installer, log in, link a store or deploy.

In the new project folder, run these commands in order. Stop at the first failure:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm run typecheck
npm run build
npm run dev
```

Keep the lockfile. Do not replace these versions with `latest`. If a download fails, the script leaves an incomplete marker and explains the failure. Do not build that incomplete folder or delete an existing project to retry.

The typecheck validates both the Storefront and Customer Account GraphQL schemas shipped with the pinned Hydrogen package. `scripts/check-graphql.mjs` uses relative schema paths to avoid a Windows path bug in the upstream CLI. It still fails on warnings; it does not skip query checks or fetch a different schema.

## 2. Use the project that was created

| Part | File |
|---|---|
| Page registration | `app/routes.ts` |
| Home | `app/routes/home.tsx` |
| Product | `app/routes/product.tsx` |
| Collection list and collection | `app/routes/collections.tsx`, `app/routes/collection.tsx` |
| Search and cart pages | `app/routes/search.tsx`, `app/routes/cart.tsx` |
| Request handling | The middleware in `app/root.tsx` |
| Storefront client | `app/lib/storefront.ts` |
| Cart handlers and state | `app/lib/cart-handlers.ts`, `app/lib/cart.ts` |
| Store settings | `app/lib/shop.ts` |
| Styles | `app/tokens.css`, `app/app.css` |

Hydrogen 2026-10 is a library composed into the app. This project owns its router, server entry and Vite build. Its middleware creates the request client and runs Shopify's handlers, including `/api/cart`. Route loaders use the typed client. Do not paste legacy `CartForm`, `context.cart`, `context.storefront.query()` or `@remix-run/react` fragments into this starter.

For an existing storefront, inspect its package file and routes first. Use the official migration guide for its starting version. Keep a copy of the old project and assess each migration step. The recorded checks here cover this starter, not an arbitrary migrated app or a JavaScript conversion.

## 3. Apply the supplied design

Make the requested page, style and component changes in the project. Use supplied copy, product facts and images. Do not invent real products, customers, sales figures, reviews, awards or performance results.

Keep the visible demo label while using mock.shop. Its products and checkout are fictional. A screenshot of that demo is not evidence that a real store, payment or order works. Use the normal cart handlers and session flow; do not build a custom form that collects customer passwords.

## 4. Check the changed project

Run `npm run typecheck` and `npm run build` after your changes. Then check the running app:

- Home and collection pages load and link to actual products.
- A product page handles variants and availability. A missing handle returns an appropriate not-found page.
- Adding, updating and removing a cart line works. The displayed price, currency and stock match the store data.
- Cart state persists for the visitor. Do not expose a private token in client code, HTML, browser requests or logs.
- Keyboard controls, small screens, loading and error states work.

Record actual commands, exit codes and failures. A build alone does not prove cart changes, checkout, customer sign-in, accessibility or speed. If a check could not run, say **Not run** and give the next check. Do not announce a launch-ready store with required checks still missing.

## 5. Connect a real store only in the owner's environment

Have the owner follow Shopify's current store-connection guide and review the target storefront. Keep private tokens and session secrets in the local `.env` or the host's secret settings, never in chat or source control. Do not ask the owner to paste them.

For the pinned React Router template, the documented connection commands are:

```bash
npx --no-install shopify hydrogen link
npx --no-install shopify hydrogen env pull
```

These steps require the owner's authorised store access. The owner handles any sign-in. They can write environment files, so review the target and local changes before running them. Do not run them merely to test the demo.

The template uses `PUBLIC_STORE_DOMAIN` and the server-only `PRIVATE_STOREFRONT_API_TOKEN`. `PUBLIC_STOREFRONT_ID` is optional and enables Shopify analytics. Remove `MOCK_SHOP=1` only when the real-store configuration is ready; confirm the app reads the intended store and the demo label disappears. Publish the intended products to the correct channel.

Customer accounts use Shopify's hosted OAuth flow. They need the matching client settings, `SHOP_ID`, a session secret and HTTPS. Follow the current customer-account guide. Do not claim that sign-in, consent, multiple markets, currencies or languages have been checked until you have tested the actual configuration. Local HTTPS setup can change certificate trust and callback settings; the owner must review those changes first.

## 6. Prepare deployment and hand back

Confirm the destination, environment values and any hosting or plan limits with the owner. This skill does not promise free hosting or a measured speed result. The pinned project's `npm run deploy` uses Shopify CLI to deploy `dist/client` and `dist/server` to Oxygen. Run it only when the owner has authorised that deployment and the required checks pass. Do not assume every Git push deploys; confirm the project's continuous-deployment setup.

Hand back the project path, changed files, package versions, actual check results and remaining **Not run** checks. Include the owner's connection and deployment steps. Keep secrets out of the reply. Record whether the app still uses mock data.

## Scope of the recorded starter check

On 28 October 2026, AI Blocks ran the pinned starter's typecheck, GraphQL checks, production build and 15 existing local mocked tests. Six local checks returned HTTP 200: home, collections, a demo product, a demo collection, cart and the cart API. The five HTML pages showed the fictional-data label. These checks used mock.shop with no real-store credentials. They did **not** test a real payment, order, customer OAuth login, deployment, cart-line changes, accessibility or a speed score. See `references/checked-build.json` for the exact scope. These checks do not alter the catalogue's separate tested record.

## Current primary references

- [Pinned Shopify template](https://github.com/Shopify/hydrogen/tree/8e5ea1124ffcabdb901b3a374e374f4908897190/templates/react-router)
- [Hydrogen migration](https://shopify.dev/docs/storefronts/hydrogen/migrate)
- [Template and store connection](https://shopify.dev/docs/storefronts/hydrogen/getting-started/deploy-a-template)
- [Customer accounts](https://shopify.dev/docs/storefronts/hydrogen/customer-accounts)
- [Deployment](https://shopify.dev/docs/storefronts/hydrogen/deployments)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Website launch day plan writer](https://useaiblocks.com/skills/site-go-live-runbook-writer). It takes the web app.
- The [Store website speed reviewer](https://useaiblocks.com/skills/speed-budget-and-sale-check).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
