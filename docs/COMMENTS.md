# Questions and comments

Every skill, prompt and workflow page has a **Questions** tab on the side. Anyone can ask a question or say how a skill went, without an account. Each comment belongs to one skill and stays on that skill's page. When a skill is renamed, its old comments still show, because the page also asks for comments under its old names (`catalogue-items/renamed.json`).

## How it works

- `site/src/server/comments.ts` holds the rules: plain text only, up to 2,000 characters, one level of replies, a hidden field that catches bots, and at most 5 posts per 10 minutes (30 a day) from one visitor. Visitors are told apart by a salted hash of their address; the address itself is never stored.
- On the live site, `site/functions/api/comments.ts` runs it as a Cloudflare Pages Function, and the comments are kept in a Cloudflare D1 database.
- On the dev server (`npm run dev`), the same code runs with a memory store that empties when the server stops. The team key there is `dev-team-token`.
- Tests: `npm --prefix site run test:unit` for the rules, and the Playwright tests post, reply and answer in the browser.

## Switch it on

Follow [the Cloudflare launch handoff](CLOUDFLARE-LAUNCH-2026-10-22.md). Both COMMENTS and SPACES can share the migrated ai-blocks D1 database. The handoff covers bindings, separate server-side secrets, preview checks and deployment.

## Answer questions as the team

Open any skill page, click **Questions**, then **Team sign-in** at the bottom of the panel, and paste the team token. Your browser remembers it. Replies you post are marked "Answer from us", and every comment gets a **Remove** link. Click **Posting as the team** and clear the box to sign out.
