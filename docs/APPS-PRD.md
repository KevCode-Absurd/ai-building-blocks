# PRD · Apps on AI Blocks

**Status:** approved to build, 19 Oct 2026. Kevin asked for an Apps section, two example apps in Mercatura's look, and a starter pack that turns skills and workflows into a real app. This PRD covers what ships now and what comes later. `docs/PRD.md` still covers the library and the builder.

> **Changed later on 19 Oct 2026:** the hand-drawn tours below were replaced by one finished example app, a saved copy of the real Mercatura app with its Grüns study data, at `/example-app/`. See `docs/EXAMPLE-APP.md`. The starter pack and the open-source app are unchanged. The sections on tours are kept as history.

## 1 · Why

AI Blocks is a ladder. People start with one prompt and climb as far as their job needs:

| Rung | What it is | Where it lives on the site |
|---|---|---|
| 1 Prompt | One message, one result | Library → Prompts |
| 2 Skill | Instructions your AI follows every time | Library → Skills |
| 3 Routine | A skill or workflow that runs on a schedule or a trigger | Workflows that say when to run |
| 4 Workflow | Several skills in order, each handing work to the next | Library → Workflows, the builder |
| 5 Agent | An AI that picks its next step and uses tools on its own | How it works; not in the library yet |
| 6 App | A screen your team signs in to, with saved work, roles and a button for each job | **Apps (new)** |

Until now the site stopped at rung 4. Apps close the gap: they show what a finished app looks like, and how to build one.

**An app doesn't need an agent.** Both example apps run plain code plus single AI calls. Agents are an optional rung, added only when a job needs the AI to decide its own next step.

## 2 · Who it's for

| Person | What they want | What Apps gives them |
|---|---|---|
| An owner or marketer who already uses our skills | "My team should use this without learning AI" | A look at a finished app, and the steps to get there |
| A builder who uses Claude Code | "Turn my workflow into an app with sign-in and teams" | The starter pack: one prompt that interviews them, then builds in small stages |
| An agency | "One place for every client's ads, pages and articles" | The three Mercatura apps, and the combined app, open source, as a starting point |

## 3 · What ships now

1. **Branding: AI Blocks at useaiblocks.com.** Header wordmark, titles, footer, share tags, canonical links, `robots.txt` and `sitemap.xml`. Downloads (handoff packs, mini tools) carry the name and address.
2. **Apps in the header and footer**, at `/apps`.
3. **`/apps`, the Apps page.** The six-rung ladder, the example apps (one client app, three standalone Mercatura apps, one combined app), the starter pack.
4. **`/apps/mercatura-ads`, an example app as a walkthrough.** Built from a real client's ad dashboard. Every name, product, person and number is replaced (§5). Visitors click through its screens. Nothing runs.
5. **Mercatura's open-source starter, split into three standalone apps** (Kevin, 19 Oct: each one is an end application on its own), each a walkthrough:
   - `/apps/mercatura-creative-studio`: brand brain to scripts, image ads and videos, with approval at every step.
   - `/apps/mercatura-landing-pages`: a page that keeps the ad's promise, with two versions side by side and a Shopify export.
   - `/apps/mercatura-seo`: a growth plan, audits and articles that answer what buyers search for.
   - `/apps/mercatura`: **the combined app.** How the three share one brand brain, one set of personas and offers, and one sign-in. This is the repo people install. It shows how to build a combined app from standalone ones.
6. **`/apps/starter-pack`, the app starter pack.** A download for Claude Code (or any coding AI) that turns a person's skills and workflows into an app:
   - it asks questions first, then writes a one-page brief, then builds one stage at a time;
   - it stops after each stage so the person can try it;
   - it covers sign-in, teams and roles (multiplayer), saved work, connections, spend caps and going live;
   - agents are an optional stage, not a default.
7. **How it works** gains the routine rung, and its App section points to the Apps page.

**Not now:** running apps on the site, accounts, hosting apps for people, app submissions from users, paid templates.

## 4 · Each walkthrough page

| Part | What it shows |
|---|---|
| Hero | What the app gets you, in one line; an "Example data" badge where it applies |
| The tour | A framed screen in Mercatura's look, a list of screens beside it, and Next / Back. Each screen says what it's for and what you can do there. |
| Has agents? | A plain yes or no, and why |
| How it was built, step by step | The ladder this app climbed, from "by hand" to "team app" |
| Built from these blocks | Library blocks that do the same jobs, so people can start small |
| What it runs on | The stack, in plain words |
| Next | The starter pack |

Screens are drawn with HTML and CSS, not screenshots, so they stay sharp, follow light and dark mode, and hold no private pixels.

## 5 · Masking rules for the client app

The ad dashboard was built for a real client. Its walkthrough must not let anyone identify that client.

- No client name, product names, people, store address, account IDs, city names or campaign names.
- No real numbers. Every number comes from Sprout (`knowledge/example-businesses/sprout/`), our example business, or is made up and labelled.
- Competitors are "Rival A", "Rival B", "Rival C".
- The app is shown as **Mercatura Ads**, in Mercatura's look (warm paper, one blue, DM Serif and DM Sans), not the client's look.
- The page says: "Example data. Sprout is our example business. The numbers are made up to show the screens."
- `tools/check-masking.mjs` fails the build if a blocked word appears in the app pages. It stores the blocked words as SHA-256 hashes, so the list itself never names the client.

## 5b · Standalone apps and combined apps

A standalone app does one end job and works alone. A combined app puts several standalone apps behind one sign-in and lets them share data. Mercatura shows both:

| Shared once | Used by |
|---|---|
| Brand brain (facts, voice, claims) | Creative Studio, Landing Pages, SEO |
| Personas, offers, customer insights | All three |
| Sign-in, workspaces, roles, spend caps | All three |
| Reference library | Creative Studio, Landing Pages |

The starter pack teaches the same order: build one standalone app first, then a second, then combine them by moving what they share into one place.

## 6 · The starter pack

Files live in `app-starter/` in this repo. The site zips them in the browser, the same way it builds handoff packs, so the download always matches the repo.

```
app-starter/
  README.md                 three lines: what it is, how to start
  START-HERE.md             the prompt to paste into Claude Code
  CLAUDE.md                 build rules that keep the app small
  QUESTIONS.md              the interview, asked before any code
  stages/                   one file per stage, each with "done means"
    1-one-screen.md         one skill becomes one screen
    2-save-the-work.md      a database, history, approvals
    3-run-the-workflow.md   several skills in order, as jobs
    4-sign-in.md            accounts and sessions
    5-teams-and-roles.md    workspaces, roles, sharing: multiplayer
    6-connect-your-data.md  read-only connections, a refresh button, routines
    7-agents-optional.md    when an agent earns its place, and the guard rails
    8-go-live.md            hosting, secrets, backups, spend caps, billing later
    9-combine-apps.md       standalone apps behind one sign-in, sharing one store
  templates/
    APP-BRIEF.md            the one-page brief Claude fills in
    DATA-MODEL.md           tables, who can see each row
    LAUNCH-CHECKLIST.md     security and release checks
```

Rules the pack enforces:
- Questions first, at most 10, with suggested answers. No code before the brief is approved.
- One stage at a time. Each ends with a short demo script and tests.
- Mock mode and zero spend caps until the person says otherwise.
- No secrets in the repo. Ask before any paid service.
- Skills stay as plain `SKILL.md` files the app reads, so improving a skill improves the app.

## 7 · Done means

- Lint, reading level and type checks pass; the build passes; e2e tests cover the Apps page, every tour, the starter pack download and the masking check.
- No page of the app walkthrough names the client (masking check passes).
- Pushed to `main`.

## 8 · Later

- A live demo of Mercatura Ads on Sprout data.
- More example apps, one per board (software, services).
- "Submit your app": people share apps built with the starter pack.
- Hosted starter: one click to deploy the starter with sign-in already set up.
