# Spaces

Each person gets their own space at `/space` for their skills, prompts, workflows, kits and agents. They share it with one private link. Any item can be made public, and public items show on `/people` ("From people"), marked as not checked by us.

## How it works

- **No accounts yet.** "Make my space" creates a space and returns two secrets.
  - **The owner key** opens the space to change it. The browser keeps it (`abb:space-key`), and the server stores only its SHA-256 hash. "Copy my private link" gives `/space#key=…`, which opens the space on another device. The key sits after `#`, so it never reaches a server log.
  - **The share token** is in the link `/s/<token>`. Anyone with it sees the whole space, private items too, but can't change anything. They can save copies to their own space. "Make a new link" replaces the token, and the old link stops working.
- **Items** are skills, prompts, agents (text, up to 100,000 characters), workflows (the builder's steps and links) and kits (block names).
  - People add them by pasting, by dropping a `SKILL.md` or text file, or with a zip; each `SKILL.md` in a zip becomes its own item.
  - They can also bring in the kits and workflows saved in their browser, or press "Save to my space" in the builder or in My kits.
- **Visibility.** Items start private: seen only through the space's link. Public items are also listed on `/people`. The team can take a public item down with the team token (`DELETE /api/spaces/public/<id>`).
- **Limits.** 300 items per space, and 10 new spaces per visitor per day. Visitors are told apart by a salted hash of their address.

The code: `src/server/spaces.ts` (one handler for live and dev), `functions/api/spaces/[[path]].ts` (Cloudflare), `src/lib/space.ts` (browser), `src/space/SpacePage.tsx` (pages). Tests: `test/spaces.test.mjs` and `e2e/spaces.spec.ts`.

## On the dev server

`npm run dev` keeps spaces in memory, so they're gone when it stops. The team token there is `dev-team-token`.

## Switching it on for the live site (not done yet)

The site isn't deployed yet. Until these steps are done, `/space` says spaces aren't switched on.

1. Create the database. Run `npx wrangler d1 create ai-blocks`. Comments can use the same database.
2. Apply the tables. Run `npx wrangler d1 migrations apply ai-blocks --remote` from `site/`. This applies `migrations/0002_spaces.sql` (and `0001_comments.sql`).
3. Bind it. In the Pages project, go to Settings, then Functions, then D1 bindings, and add `SPACES` pointing at `ai-blocks`.
4. Add two secrets: `SPACES_SALT` (any long random text) and `SPACES_TEAM_TOKEN` (for taking public items down).

## Later

- **Sign-in and teams.** Invite people by email, with roles: who can add, change or only read. The share link stays for read-only sharing.
- **Testing public items** before they show on "From people", the same way our own blocks are tested.
- **Running a workflow from the space,** so team members put in their inputs and get their own outputs.
