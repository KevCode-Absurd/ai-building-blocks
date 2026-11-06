---
name: game-release-readiness
description: Gets a small studio's game ready to release on Steam (and points mobile releases to the mobile app developer kit) - a dated timeline counted back from launch (Coming Soon at least two weeks, review lead time), store page and build checks against Steam's review rules, a Content Survey draft including generative AI use, age rating drafts for IARC storefronts, PEGI and ESRB, paid random item checks (odds shown before purchase, PEGI 16 since June 2026), and a branch plan from test branch to public beta to default. Drafts at access level 2; public beta builds and approved store edits at level 3 within the client's limits; review submissions, the default branch, the release button, prices and every rating or survey answer need a fresh yes. Use it 6 to 10 weeks before a launch or a big update.
---

# Game release readiness

## When to use

- A first Steam release is planned, with or without a demo or Early Access.
- A big update adds paid items, online play or new content that could change ratings.
- The game is going to consoles or Google Play and needs IARC ratings.
- A Steam review came back with problems.

For App Store and Google Play builds, privacy forms and staged releases, use the `mobile-app-developer` kit's `store-release-readiness` skill alongside this one.

## What you need

1. The planned release date and platforms.
2. The current build and its supported operating systems, controllers and languages.
3. The store page draft: capsule art, screenshots, trailer, description, features listed.
4. A content list: violence, language, fear, gambling themes, sex, drugs, user chat, location sharing, web access.
5. What the game sells, if anything, and whether any of it is random (chests, card packs, gacha), including items bought with premium currency.
6. How generative AI was used for content that ships, and whether any content is generated while the game runs.
7. Access: level 1 to read. Level 2 to draft and to upload builds to a password-protected test branch. Level 3, within the client's limits, to set builds live on public beta branches and publish approved store page edits.

## Steps

### 1. Build the timeline (Steam, as of 6 November 2026)

Count back from the release date:
- Release day: the client presses release (fresh yes).
- At least two weeks before: the Coming Soon page must be live.
- At least 7 business days before the page should go live: submit the store page for review (typically 3 to 5 business days).
- Build review: also typically 3 to 5 business days; plan at least 7 business days before release.
- Before both reviews: the Content Survey is complete.
- If the client is new to Steam: the Steam Direct fee is paid during onboarding, by a user with Admin permission.

Add buffer for a rejection round. Put every date in a table with an owner.

### 2. Check the store page

- Screenshots show gameplay only: no concept art, pre-rendered stills or marketing text.
- Capsule images show a readable title or logo.
- Only features and content available at launch are listed.
- The description is complete and doesn't link to other sites.
- Early Access questions are all answered, if relevant.

### 3. Check the build

- It starts on every operating system listed on the store page.
- Every feature listed (controller support, Steam Cloud, achievements, languages) works in this build, or comes off the page until it does.
- In-game purchases on Steam use Steam Wallet, with no links to other stores.
- Save files survive an update (see the `versioned-save-system` skill) and Steam Cloud is tested with developer-only access first.

### 4. Draft the Content Survey

- General content answers (they generate regional ratings shown on the store page).
- Mature content disclosure, including content in the build that players can't reach.
- Generative AI: content made with AI during development, and content generated while the game runs, with the guardrails that stop illegal output.
- If the client already holds official ratings, list them for the Ratings section.
- Mark the draft "you confirm": locked answers change only through Steam Support.

### 5. Draft the age rating answers

- **IARC** (Google Play, Microsoft, Nintendo, PlayStation, Epic, Meta Horizon and others; not Steam or Apple): one questionnaire produces regional ratings. On Google Play, every app needs one, and the questionnaire must be retaken when content or features change the answers.
- **PEGI:** expect the label from the content list, and since June 2026: paid random items mean PEGI 16 (PEGI 18 for social casino); time-limited offers mean PEGI 12 (PEGI 7 if parental controls have spending off by default); rewards that punish players for not returning in time mean PEGI 12; unrestricted communication means PEGI 18.
- **ESRB:** expect the category and interactive elements, including In-Game Purchases (Includes Random Items) when random items are bought with real money or with premium currency bought with real money.
- Write each answer with the evidence from the build ("Players can chat by text with anyone in the lobby: yes, unfiltered").

### 6. Check paid random items

- The odds of each item type are shown before purchase, close to the buy button (Apple and Google Play both require this; do it on every platform).
- Premium currency can only be used in this game.
- Purchase buttons can't be pressed by accident: confirm step, no buy button where a play or close button usually sits, clear prices. The FTC's 2022 Epic Games case is the warning.
- For the UK and EU, note the official positions (UK: industry-led protections, including no purchases by under-18s without a parent or guardian enabling them; EU Parliament: protect minors from purchase prompts) and send legal questions to the client's adviser.

### 7. Plan the branches

1. Upload builds with a dedicated build account (Edit App Metadata and Publish App Changes To Steam permissions only), set up by the client.
2. Set live on a password-protected test branch for the team (level 2).
3. Public beta branch for players who opt in (level 3 within limits).
4. Default branch, which every player gets: set by hand in App Admin, with the client's fresh yes. Releasing a build on a released game needs a phone number or the Steam Mobile App on the account, and there is a 3-day wait after security changes.
5. Keep the last good build ID written down, so the client can set it live again if the new one breaks.

### 8. Act at the right level

- Level 2: drafts, build uploads, test branch.
- Level 3, after the client's yes on the action list: public beta branches, approved store page edits and announcements.
- Fresh yes every time: submitting for review, Coming Soon, the default branch, the release button, prices and discounts, survey and rating answers, odds and paid item contents.

## Checks

- Every date in the timeline has an owner and a buffer.
- Nothing on the store page that the build doesn't do.
- Survey and rating drafts match the content list and the build, and are marked "you confirm".
- Odds are shown before every random purchase.
- The default branch plan names who presses it and the build ID to fall back to.

## Output format

1. Timeline table: date, step, owner, status.
2. Store page and build checklist with findings.
3. Content Survey draft.
4. Age rating drafts (IARC, expected PEGI and ESRB) with evidence.
5. Paid item check with screenshots needed.
6. Branch plan and action list for the client's yes.

## Example of good output (short)

*Made-up studio for illustration: "Hollow Ember", a co-op dungeon game, Steam, launch Friday 12 March.*

> | Date | Step | Owner |
> |---|---|---|
> | Mon 25 Jan | Content Survey complete; store page submitted | Sam (studio), drafts by me |
> | Fri 12 Feb | Coming Soon page live (four weeks before launch) | Sam |
> | Mon 22 Feb | Release build submitted for review | Me (upload), Sam (submit) |
> | Fri 12 Mar | Default branch set live; release pressed | Sam |
>
> **Paid items:** "Ember Chest" sold for gems; gems are bought with money, so this is a paid random item. Odds screen missing: add it before the chest's buy button. Expect PEGI 16 for a submission after June 2026, and ESRB In-Game Purchases (Includes Random Items).
