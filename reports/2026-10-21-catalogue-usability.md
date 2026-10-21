# Catalogue clarity and usability changes, 21 October 2026

## What changed

- The library shows 16 cards and adds 16 only when Show more is clicked. Its first page covers writing, planning, customer research, marketing and software work. A builder link sits next to Show more.
- Search has one goal heading and a different, practical placeholder. Earlier names remain searchable after editorial renames.
- Anchor correction runs once and is cancelled by scrolling, touch or keyboard input. It no longer follows page resizes and pulls a visitor back to the library.
- Card descriptions use readable body text. Card actions stay legible during hover, and long category labels wrap.
- The source-content entry is called Create skills from content.
- Minds put the portrait next to the name, remove lifespan dates from the list, make the profile card clickable, and keep Seat on council as a separate action. Council selections are saved locally while profiles are explored. Hover and focus have a subtle animated background with a reduced-motion alternative.
- A prominent advisory council explanation describes complementary viewpoints, dissent, the final brief and the download/run steps. The guide also explains using minds within a workflow.
- Tools have search and topics for ads, customers, profit and cash, and people and AI.
- The builder and Apps page connect downloaded workflows to the app starter pack, using Mercatura as the example. The app guide distinguishes the saved study tour from a running app with live connections.

## Copy review

Every one of the 4,345 published entries has a row in [catalogue-copy-review.json](catalogue-copy-review.json), including its source path and SHA-256. The editorial layer rewrites titles, card descriptions or introductions where they needed clarification, while preserving source instructions and stable slugs.

Examples:

| Earlier name | Clearer job name |
| --- | --- |
| Landing page 30-point checker | Landing page audit |
| Website brand brain builder | Brand profile builder |
| Ad claim proof gap finder | Ad claims checker |
| Ad opening line batch writer | Ad hook writer |
| Weekly meeting actions keeper | Weekly meeting action tracker |

The passes use the library's Page copywriter, Sales copy editor, Anti-AI-slop copy editor and Plain writing guidance. Specific technical names are retained where they identify the tool or method the reader needs. Edited copy is kept in a separate build-time layer so importing or regenerating a skill does not erase the edits.

This is a copy, source-structure and application review. It does not establish that all skills improve model output. The existing Tested badges still require actual golden-set evaluation. The guide now tells readers to try a small real task and check the promised deliverable before adopting a skill for recurring work.

## Software path

Download a workflow and the app starter pack. Give both to a coding AI. The first app can take an uploaded file, run the chosen skills on its server and show saved results. Then add durable job states, approval gates, retries and the one supported data connection the job needs. The existing starter stages explain this progression.

The Mercatura tour uses its saved Grüns study data; its customer research is labelled simulated. It does not run new jobs or connect to visitors' accounts.

Validation results and screenshots are recorded below after the final production check.

## Final validation, 22 October 2026

- Complete browser suite: 138 passed (desktop and mobile). After the narrow-phone header correction, all seven affected usability cases passed again.
- Production layouts: checked at 320, 393, 768 and 1440 pixels, including a 320-pixel header with saved context and a kit. The phone kit popover is a bounded bottom panel. There is no page overflow or uncaught script error in these checks.
- Server/library unit checks: 16 passed. Page lint: 1,714 clean, zero issues. All 4,345 published entries have complete assets and no dependency on withheld skills.
- Copy review: 4,345 screened, 573 edited entries, 476 titles, 74 summaries and 116 introductions; zero validation issues. Source instructions are unchanged.
- Security rescan: the same 4,349 folders, 25,664 files and 338 pattern candidates as the reviewed baseline; no new findings or structural issues. The two direct quarantines and their two dependents remain withheld. This is static review, not a guarantee that arbitrary source code or future remote dependencies are safe to execute.
- Updated fflate, Vite, Playwright, sharp, yaml and Wrangler; the final npm advisory audit reports zero known vulnerabilities. The saved report is dependency-audit.json.
- Actual Cloudflare Pages Functions compile. Both D1 migrations apply locally. Nine local API/route checks pass, covering persistence, owner authorization, moderation authorization, private/public boundaries, read-only sharing, link rotation, shared deep links and real 404 status.
- The emulator caught and verified a fix for the old shared-space wildcard rewrite. It now uses a dedicated noindex shell; all 766 redirect rules parse without the old loop warning.
- TypeScript, production build and prerender pass. The deployable output has 18,547 files, including the 2,230-file saved Mercatura tour, below the 19,000-file build buffer. Only API paths invoke Functions. SEO validation has 4,518 unique titles, no unlinked catalogue pages and six non-blocking title-length warnings.

The initial library render is limited to 16 cards instead of automatically growing to 120. Card hover no longer starts repeated decoding timers. Large page bundles remain separate. These changes reduce initial rendering and background animation work; no field speed or model-output improvement is claimed.

Screenshots: [Library](usability-final/library-1440.png), [phone home](usability-final/home-393.png), [advisory council](usability-final/minds-1440.png), [phone council](usability-final/minds-393.png). Machine-readable final checks are in cloudflare-launch-readiness.json, cloudflare-local-api-check.json and production-browser-check.json.

## Integration boundary

Prepared the [Cloudflare launch handoff](../docs/CLOUDFLARE-LAUNCH-2026-10-22.md), bindings template, route restriction and repeatable local preflight scripts. Live account configuration, remote D1, secrets, DNS and deployment remain pending for the agreed integration session. No plan was purchased. Verify a Pages preview before associating the domain.
