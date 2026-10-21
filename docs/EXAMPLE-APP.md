# The example app

/apps shows one finished app: Mercatura, the app we built from these skills, with its Grüns study data. Grüns' customer research in it is simulated; the scripts, ads and pages are what the app made from it. People open it in a new tab and click through it as if it were live. Nothing runs: there's no server behind it.

## Where it lives

The source files live in `example-app-site/example-app/`. The production build copies that folder to `dist/example-app/`, and `/apps` opens `/example-app/` on the same origin. The Vite development and preview servers serve the same saved folder. This replaced the separate `example.useaiblocks.com` address on 21 October 2026 after that address failed to resolve.

The tour has 2,230 files, about 179 MB in total; its largest file is about 5.6 MB. Its files count toward the main deployment's capacity guard. The combined build is expected to be 18,547 files, below the configured 19,000-file buffer. The build refuses to ship without the example's index page, so it cannot silently publish a broken tour link.

The main `robots.txt` excludes `/example-app/`, every saved page has a noindex tag, and the tour stays out of the sitemap. Its bar links back to `/apps` and the starter pack on this site. The old standalone `example-app-site` project layout can still be used if the example is deliberately moved to a separate deployment later, but it is not required now.

It's a saved copy of the real app (the Creative Engine repo), not a mock-up. Each screen is the HTML the app sent, with the app's own scripts, so tabs, menus and filters work. The tour keeps every main screen and a few of each kind of detail page (scripts, references, guides, lessons), so it stays small.

The open-source app people install is the separate `mercatura-client-starter` repo. The starter pack (`app-starter/`) is how to build your own.

## What's stopped, and how

`tools/example-app/tour.js` runs first on every saved page.

- **Reads** (pictures, data the screen asks for) go to the saved files. Ones asked for with a query string (`?w=320`), or with no file extension (`/api/avatar-library`), are in `_q/`, listed in `_q/index.json`. A screen opened with a query (`/production?job=job_018`) is a saved page in `_q/` too: the tour opens it and puts the address back.
- **Data a panel loads as it opens** (a job's drawer, for example) comes from a Next.js server action. The crawl saved each one's answer in `_a/`, keyed by the action and what it sent, and the tour plays it back.
- **Anything that would make, change or send something** (any other POST, server action or form) is stopped. If someone has just clicked, a note says "Nothing is made, changed or saved here."
- **Moving between screens:** the app asks its server for the next screen, gets no answer, and loads the saved page instead.
- **A small bar** says it's an example app and links back to AI Blocks.

A screen that wasn't saved shows `example-app/404.html`.

## Making it again

Do this when the app changes. It needs a copy of the Creative Engine repo and its data folders (`assets`, `references`, `avatar-studio`, `cro`, `sprints`, `library-learning`, and the database). Never run it in the original folder.

1. **Copy the app.** Clone the repo into a scratch folder and copy in the data folders. Keep the path short (Windows: `subst Q: <folder>`), or the image library can't open the pictures.
2. **Build it under the base path.** In the copy's `next.config.ts`, set `basePath: "/example-app"`. Then run `pnpm install --frozen-lockfile` and `LLM_MODE=mock pnpm next build`.
3. **Start it with no keys.** Run `LLM_MODE=mock pnpm next start -p 3300`. There's no `.env` in the copy, so nothing can call a paid service.
4. **Save the screens.** Run `node tools/example-app/snapshot.mjs --base http://localhost:3300/example-app --out <raw folder>`. Set how many of each detail page to keep in `CAPS`. To re-save a few screens into the same folder, add `--start /a,/b --follow 0`. In Git Bash, put `MSYS_NO_PATHCONV=1` in front, or `/a` becomes a Windows path.
5. **Finish it.** Run `node tools/example-app/finish.mjs --raw <raw folder> --out example-app-site`. This adds the tour script and bar, points links and pictures at the saved files, and makes big pictures smaller.
6. **Take the screenshots for /apps.** With the site's dev server running, run `node tools/example-app/shots.mjs`.
7. **Check it.** Run `node tools/check-masking.mjs`; no client words may appear. Then run `npx playwright test e2e/apps.spec.ts` from `site/`.

The dev server serves `/example-app/...` from `example-app-site/` the way Cloudflare Pages does (`vite.config.ts`, `exampleApp()`): `/x` is `x.html`, a folder is its `index.html`, and anything else is the tour's 404 page.

## Rules

- Only study and test brands (Grüns, Nourish Plus, Kiln & Clay) are in the app's database, and the tour opens on Grüns. Kevin said on 2026-10-19 that this tour doesn't need masking. Client data never goes in it, and `check-masking.mjs` scans every saved file for client words.
- It's marked `noindex` and left out of the sitemap.
- Third-party reference ads appear as a sample (a few detail pages), as they do in the app's library.
