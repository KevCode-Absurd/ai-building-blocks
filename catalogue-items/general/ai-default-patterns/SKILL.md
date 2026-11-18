---
name: ai-default-patterns
description: "Use when you brief, make or review a page, ad, email or plan and want it to look and read like this business rather than like every AI output. Names the model's default looks, layouts and phrases (patterns.json, 38 patterns with ids), says why each reads as default and when it is fine on purpose, shows how to list the ones to avoid in a taste brief, and how a critic checks for them against the brand capture."
---

# AI default patterns

With nothing else deciding, a model writes the average answer for the category: Inter, a purple gradient, three rounded cards, "Unlock seamless comfort". Banning one default does not fix it, because the model moves to the next most likely choice (ban Inter and it reaches for Space Grotesk). Two things work together:

1. **Ground first.** Give the model the client's real system (fonts, colour shares, buttons, section order, voice) from [Org context capture](https://useaiblocks.com/skills/brand-dna-capture). Then the "typical" answer becomes the brand's answer.
2. **Name the defaults.** List the specific defaults this job is at risk of, and have a separate critic look for them against the brand, not against taste.

This skill is the shared list for step 2. It is used in TASTE and CHECK of the [Grounded job protocol](https://useaiblocks.com/skills/grounded-job-protocol).

<!-- needs: written by tools/add-needs.mjs from the blocks' inputs. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**Makes it better (optional):**
- **A draft** (yours): the ad, page, email or script you want checked or improved.
- **Your website** (yours): the link to your site or the page.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a draft, your website. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.

**Tools that do this best:**
- **Any chat AI:** Reads the list and your brand summary and writes the habits to avoid.
- **A second chat or AI seat:** Checks the finished work without having made it.
<!-- /needs -->

## The list

- `patterns.json`: the data. Each pattern has `id`, `family` (web, copy, ads, audits, strategy), `description`, `why` (why it reads as default), `fine_when` and `check`.
- `patterns.md`: the same list to read.

A pattern is not a sin. It is a choice the model makes when nobody else made one. It survives only if its `fine_when` is true: the brand already does it (it is in `brand-dna.json`), or a recorded decision chose it.

## Use 1: name the defaults in the taste brief

In `context/taste-brief.md`, under **Defaults to avoid**:

1. Take the patterns in this job's family (a landing page: `web` and `copy`; an ad batch: `ads` and `copy`; an audit: `audits`).
2. Drop any the brand already uses. Check the capture: if the brand's buttons are pills, `web-pill-buttons` does not apply. Say so.
3. Keep the 5 to 8 this job is most at risk of, by id, each with one line tying it to this brand.
4. For each, write what to do instead, citing the capture.

Template for the current brand (fill from its approved capture; these are instructions, not observed brand facts):

```
Defaults to avoid
- web-font-swap: retain the captured font families for each text role and verify that they load.
- web-sentence-case-buttons: retain the captured button case, radius, spacing and fill.
- web-accent-promoted: preserve each accent's measured role and area share.
- web-cream-premium: keep the captured page and panel surfaces unless a change is approved.
- web-thin-merchandising: preserve the product-grid and photography density relevant to the page.
- web-dropped-chrome: retain the working navigation, cart and footer.
- copy-any-competitor: use verified product and policy evidence instead of generic premium language.
```

Example for Allbirds (allbirds.com, captured 9 Nov 2026), where one default is the brand's own choice:

```
- web-pill-buttons: does not apply. Allbirds' buttons are pills; keep them.
- web-font-swap: Geograph for headings, body, buttons and nav (UPPERCASE, 12 px, weight 500).
- web-stock-hero: use Allbirds' own product and lifestyle photography; images cover about 60% of the home page.
```

## Use 2: the critic's check

The critic is a fresh context or another seat. It did not build the work. Give it the deliverable, `brand-dna.md` and `patterns.md`. Not the build notes.

For each pattern in the family:

1. **Present?** Look for it, using the pattern's `check` line. For pages, the [Brand fidelity check](https://useaiblocks.com/skills/brand-fidelity-check) report already measures fonts, colour shares, buttons, chrome and placeholders.
2. **Fine on purpose?** Only if the brand capture shows it, or `DECISIONS.md` records the choice and why.
3. **Report** each hit as: `id`, where it is (section, screen size, line), the evidence, and the fix that uses the brand's own system.

A deliverable with an unexplained default fails the "Distinctiveness vs defaults" part of the craft score. Three or more unexplained hits in the `web` family send it back to BUILD.

## Keep the list honest

- Add a pattern only when the same choice shows up across unrelated brands, a blind test catches it, or a buyer reports it. Give it an id, all five fields and the evidence.
- Remove or narrow a pattern when it keeps firing on brands that really do it.
- Never use the list as a style guide for a new brand. It says what to question, not what to choose.

## What you hand back

- For a brief: the **Defaults to avoid** list, 5 to 8 ids, each with its brand-specific instead.
- For a review: the hits, each with id, place, evidence and fix, plus the patterns checked and not found.
- `CHECKS MISSED`: patterns that could not be checked (for example, no capture to compare with), or "none".

<!-- next: written by tools/add-needs.mjs from the blocks' outputs. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Colour contrast checker](https://useaiblocks.com/skills/colour-contrast-checker). It takes the design direction.
- The [Brand identity system planner](https://useaiblocks.com/skills/identity-system-planner). It takes the design direction.
- The [Logo strength tester](https://useaiblocks.com/skills/logo-strength-tester). It takes the design direction.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
