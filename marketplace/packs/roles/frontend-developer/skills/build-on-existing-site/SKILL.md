---
name: build-on-existing-site
description: "Builds a landing page or new page on a business's existing website instead of a fresh template. Captures the live site (fonts, colour shares, buttons, radius, nav, footer, section order, voice lines, dated facts) with tools/capture-brand-dna.mjs, chooses patch, extend or new, picks the structure from the site's own pattern, the traffic source and the visitor's awareness, builds on the captured shell, then checks fidelity and launchability with tools/check-brand-fidelity.mjs. Use whenever the client already has a site and wants a page, a redesign of one page, or a campaign page."
---

# Build on the existing site

A model left alone builds its own average page: centred hero, three cards, testimonials, FAQ, system fonts. The client's real site is the cure. This skill makes the page start from what the site already is, so it looks like the same business on day one and only changes what the job needs.

## When to use

- A new landing or campaign page for a business that has a website.
- A rebuild of one existing page (pricing, booking, a service page).
- A one-page site for a brand that has packaging, social posts or print but no site yet (mode `new`: capture those instead).

Not for: whole-site redesigns or a new brand identity; those need a brand brief first.

## What you need

**Access:** level 1 to open and capture the live site and read any code you are given. Level 2 to put the page on a branch, staging copy or unpublished page. Level 3 to publish it, within the limits the client set, after the check in step 7.

- The site address and the page to change or match.
- The one action, the traffic source and what it promised, and how much visitors already know.
- Any copy or facts the client wants used. Everything else comes from the captured site.
- Node 18+ with Playwright for the scripts, or a browser tool for the snippet, or the client's screenshots and CSS.

## Steps

1. **Capture.** Run `node tools/capture-brand-dna.mjs <site> <page-to-change> <closest-similar-page>`. It writes `context/brand-dna.json`, screenshots at 1440 and 390 px and a short `context/brand-dna.md`. No Node? Paste `tools/brand-dna-snippet.js` into the browser console on each page and save the JSON. No code at all? Ask for full-page screenshots at both widths and the theme's CSS, and mark every value you estimate.
2. **Read the capture before deciding anything.** Write five lines: the fonts per role, the colours and their share of the page (an accent at 2% stays near 2%), button and radius style, how the nav and footer are built, and the section order of the closest page. Copy 5 to 10 voice lines and every live fact (price, offer, delivery, guarantee, review count) with its capture date.
3. **Choose the mode.** `patch` when the page exists (default): a ranked list of edits to it. `extend` when it is a new page inside the site: reuse the shell and components. `new` only when there is no site or the client asks for a fresh look. Say which and why.
4. **Choose the structure from the context, not a template.**

   | Signal | What it decides |
   |---|---|
   | The site's closest existing page | The starting section order and components. Change only what the job needs. |
   | Traffic source | Ad: repeat the ad's promise and offer in the first screen. Search: answer the question first. Email or warm list: offer and action early. Social on phones: visual proof first, short copy. |
   | Awareness | Ready to buy: offer, price, action. Comparing: the difference with proof. Knows the problem: the result and how it works. Never heard of us: the problem in their words, or a content page instead. |
   | Category conventions | Keep what buyers use to decide (menus, timetables, plan tables, galleries, booking widgets); break one only on purpose. |
   | Real proof on hand | Put it beside the doubt it answers. A section with no real content is cut, not filled. |

   Write the order with one line of reasoning per section. If two orders are both defensible, give both as change-sets and say which you would test first.
5. **Build on the shell.** Copy the captured nav and footer markup (or the theme's header and footer includes) as they are. Load the same font files the site loads. Set CSS custom properties from the capture: colours in their roles, radius, button style, spacing rhythm. Reuse existing components before writing new ones. Use the client's own words and facts; no lorem ipsum.
6. **Avoid the defaults** in `tools/ai-default-patterns.md` unless the plan chooses one on purpose: the hero-cards-steps-testimonials-FAQ order, gradients, pill buttons on a square brand, emoji icons, glass cards, empty "trusted by" rows, stock heroes, fade-up on every block, cream "premium" backgrounds, a dropped nav or footer.
7. **Check, with fresh eyes.** Run `node tools/check-brand-fidelity.mjs --brand context/brand-dna.json --page <your page>` (or its manual checklist). It checks fonts, palette shares, buttons, nav and footer, placeholders, facts, the 390 px width and the primary action, and saves side-by-side screenshots. Then review those screenshots in a separate pass (a new chat or another seat), not in the same breath as the build. Fix, check again, and stop after two or three loops with what still fails.
8. **Hand back** with a short decision record: mode, structure and why, what changed from the live site on purpose, the check results, and what to test next.

## Checks

- `context/brand-dna.json` exists and every design choice cites it or a named reference.
- Nav and footer match the live site unless the plan changes them on purpose.
- The brand's fonts load; no system font replaced them.
- No fillable placeholder is left; any real gap is listed.
- Works at 390 px and 1440 px, by keyboard, and the primary action works end to end.
- The fidelity check passed, or each failure is listed with the reason.

## Output format

1. **Capture summary:** the five lines from step 2, the voice lines and dated facts.
2. **Mode and structure:** the choice and one line per section on why.
3. **The page:** full files (or the theme template and section files), with the shell reused.
4. **Fidelity and launch check:** each check PASS, FAIL or WARN with evidence, and the screenshot paths.
5. **Decision record:** what changed on purpose, the strongest alternative and what to test next.
