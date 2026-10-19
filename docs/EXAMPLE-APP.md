# The example app

/apps shows one finished app: Mercatura, the app we built from these skills, with its Grüns study data. Grüns' customer research in it is simulated; the scripts, ads and pages are what the app made from it. People open it in a new tab at `/example-app/` and click through it as if it were live. Nothing runs: there's no server behind it.

It's a saved copy of the real app (the Creative Engine repo), not a mock-up. Each screen is the HTML the app sent, with the app's own scripts, so tabs, menus and filters work. The tour keeps every main screen and a few of each kind of detail page (scripts, references, guides, lessons), so it stays small.

The open-source app people install is the separate `mercatura-client-starter` repo. The starter pack (`app-starter/`) is how to build your own.

## What's stopped, and how

`tools/example-app/tour.js` runs first on every saved page.

- **Reads** (pictures, data the screen asks for) go to the saved files. Ones asked for with a query string (`?w=320`) are in `_q/`, listed in `_q/index.json`.
- **Anything that would make, change or send something** (a POST, a server action, a form) is stopped. A note says "Nothing is made, changed or saved here."
- **Moving between screens:** the app asks its server for the next screen, gets no answer, and loads the saved page instead.
- **A small bar** says it's an example app and links back to AI Blocks.

A screen that wasn't saved shows `example-app/404.html`.

## Making it again

Do this when the app changes. It needs a copy of the Creative Engine repo and its data folders (`assets`, `references`, `avatar-studio`, `cro`, `sprints`, `library-learning`, and the database). Never run it in the original folder.

1. **Copy the app.** Clone the repo into a scratch folder and copy in the data folders. Keep the path short (Windows: `subst Q: <folder>`), or the image library can't open the pictures.
2. **Build it under the base path.** In the copy's `next.config.ts`, set `basePath: "/example-app"`. Then run `pnpm install --frozen-lockfile` and `LLM_MODE=mock pnpm next build`.
3. **Start it with no keys.** Run `LLM_MODE=mock pnpm next start -p 3300`. There's no `.env` in the copy, so nothing can call a paid service.
4. **Save the screens.** Run `node tools/example-app/snapshot.mjs --base http://localhost:3300/example-app --out <raw folder>`. Set how many of each detail page to keep in `CAPS`.
5. **Finish it.** Run `node tools/example-app/finish.mjs --raw <raw folder> --out site/public`. This adds the tour script and bar, points links and pictures at the saved files, and makes big pictures smaller.
6. **Take the screenshots for /apps.** With the site's dev server running, run `node tools/example-app/shots.mjs`.
7. **Check it.** Run `node tools/check-masking.mjs`; no client words may appear. Then run `npx playwright test e2e/apps.spec.ts` from `site/`.

The dev server serves `/example-app/...` the way Cloudflare Pages does (`vite.config.ts`, `exampleApp()`): `/x` is `x.html`, a folder is its `index.html`, and anything else is the tour's 404 page.

## Rules

- Only study and test brands (Grüns, Nourish Plus, Kiln & Clay) are in the app's database, and the tour opens on Grüns. Kevin said on 2026-10-19 that this tour doesn't need masking. Client data never goes in it, and `check-masking.mjs` scans every saved file for client words.
- It's marked `noindex` and left out of the sitemap.
- Third-party reference ads appear as a sample (a few detail pages), as they do in the app's library.
