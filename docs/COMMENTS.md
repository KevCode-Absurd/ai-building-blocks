# Questions and comments

Every skill, prompt and workflow page has a **Questions** tab on the side. Anyone can ask a question or say how a skill went, without an account. Each comment belongs to one skill and stays on that skill's page. When a skill is renamed, its old comments still show, because the page also asks for comments under its old names (`catalogue-items/renamed.json`).

## How it works

- `site/src/server/comments.ts` holds the rules: plain text only, up to 2,000 characters, one level of replies, a hidden field that catches bots, and at most 5 posts per 10 minutes (30 a day) from one visitor. Visitors are told apart by a salted hash of their address; the address itself is never stored.
- On the live site, `site/functions/api/comments.ts` runs it as a Cloudflare Pages Function, and the comments are kept in a Cloudflare D1 database.
- On the dev server (`npm run dev`), the same code runs with a memory store that empties when the server stops. The team key there is `dev-team-token`.
- Tests: `npm --prefix site run test:unit` for the rules, and the Playwright tests post, reply and answer in the browser.

## Switch it on for useaiblocks.com (once, after the Pages launch)

1. Make the database: `npx wrangler d1 create ai-blocks-comments`
2. Make the table: `npx wrangler d1 migrations apply ai-blocks-comments --remote` (run inside `site/`; it reads `site/migrations/`).
3. In the Cloudflare dashboard, open the Pages project, then **Settings → Bindings**, and add a D1 binding named `COMMENTS` that points to `ai-blocks-comments`.
4. Under **Settings → Variables and secrets**, add two secrets:
   - `COMMENTS_TEAM_TOKEN`: a long random string. It lets you post answers marked "Answer from us" and remove comments.
   - `COMMENTS_SALT`: another long random string, used for the visitor hash.
5. Deploy again. Until the binding exists, the panel says comments aren't switched on yet, and nothing breaks.

## Answer questions as the team

Open any skill page, click **Questions**, then **Team sign-in** at the bottom of the panel, and paste the team token. Your browser remembers it. Replies you post are marked "Answer from us", and every comment gets a **Remove** link. Click **Posting as the team** and clear the box to sign out.
