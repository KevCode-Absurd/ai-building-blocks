# Work method: the Grounded Job Protocol

A model left alone falls back to its average output, so every business gets the same page, the same ad and the same plan. This method stops that. Ground the work in the client's real business, brief the taste, explore real alternatives, build inside what exists, then have the work checked by a fresh pass.

Run all seven steps for anything bigger than a quick answer. A quick answer (a fact, a definition, a one-line fix) skips to the reply, but its facts still need a source.

## 0. Frame: write the job card

Write `context/job-card.md` in five lines:

- **Client and outcome:** who they are and the result they want.
- **Deliverable kind:** one of web_page, ad_creative, copy, email, audit, analysis, strategy, plan, code, ops_doc or other.
- **Success measure:** how the client will judge it.
- **Mode:** `patch` improves the existing asset, and is the default whenever one exists. `extend` adds a new page or asset inside the existing system. `new` is only for a new brand or when nothing exists, or when the client says so.
- **Access:** the level and limits for each tool you will touch (AGENTS.md, "Access levels").

## 1. Ground: capture the real thing before you make anything

What to capture for each kind of work, and where each file goes, is in `context/README.md`. For audits and analysis, grounding means pulling the real account or data, not reading about it.

Three ways to capture a website, in order:

1. Run `node tools/capture-brand-dna.mjs <url>` where Node and Playwright are available. It writes `context/brand-dna.json` and `context/screenshots/`.
2. Paste `tools/brand-dna-snippet.js` into any browser tool or the devtools console on the live site, and save what it prints as `context/brand-dna.json`.
3. Ask the client for the URL, screenshots of the key pages (phone and desktop) and their CSS or brand guide, and write `context/brand-dna.json` from those.

Also note 2 or 3 competitors or references: the ones the client names, or ones you find and name.

**The gate.** Production does not start until the context file for this kind of work exists. Every design and copy choice cites a captured fact or a named reference ("Headline font: Söhne 600, from brand-dna.json"). If a fact cannot be captured, ask for it. Never fall back to a template in silence.

## 2. Taste: write the taste brief

Write `context/taste-brief.md` with four parts:

- **Brand codes to keep:** type, colour and its proportions, imagery, pacing and voice, each citing the capture.
- **Category conventions:** which to keep and which to break, and why.
- **References:** 2 the client admires, and 1 to avoid looking like.
- **Defaults to avoid:** name the ones from `tools/ai-default-patterns.md` that this job could slip into.

Spend your questions here, not on format: their position, price point and occasion, what must never change, and the brands they admire and avoid. Format choices (length, layout, file type) are silent defaults you state in one line.

## 3. Diverge: explore on substance

Make 2 or 3 directions, or for audits and analysis 2 or 3 competing hypotheses. They must differ on named axes:

- mechanism or promise;
- proof;
- structure;
- visual world or art direction;
- offer.

Each direction names the reference it learns from and how it departs from the category default. Reject any direction that differs only in colour, crop, wording or style label. In patch mode, each direction is a change-set to the live asset: a ranked list of specific edits, each with its evidence. Choose one, or let the client choose, and record why.

## 4. Build: inside the client's system

- For web work, build on the captured shell. Keep the existing nav, footer, fonts, colour proportions and component styles unless the plan changes them on purpose.
- Use the client's real copy and facts. No lorem ipsum, and no placeholder that the capture could have filled.
- For code, deliver runnable files the client can drop in.

## 5. Check: a separate pass, against the client

Check in a fresh context or another seat, or at least as a separate step after the build. Never grade the work in the same breath as making it.

**Gates.** Pass or fail; a high craft score never makes up for a failed gate.

- Every fact traces to a source in `context/` or one you name.
- No invented numbers.
- Access was respected.
- No placeholder is left that the capture could have filled.
- Web pages also: the existing nav and footer are kept unless changed on purpose, the brand fonts load, the page works at 390 px and 1440 px, the primary action works, and `tools/check-brand-fidelity.mjs` (or its checklist) passes.

**Craft.** Score each criterion out of its weight. Every family tests specificity (could a competitor publish this unchanged?), fidelity (is it recognisably this brand?), distinctiveness (does it avoid the named defaults?) and whether it does the job. A job type's own craft rubric, when its skill has one, replaces this table.

| Family | Weights |
|---|---|
| web_page | Job and conversion logic 20, Brand fidelity 25, Launchability 20, Specificity 15, Distinctiveness vs defaults 10, Clarity 10 |
| ad_creative | Strategic idea 20, Range across named axes 20, Brand fidelity 15, Hook and thumb-stop 15, Specificity 15, Platform fit 15 |
| copy / email | Voice fidelity 25, Specificity 20, Job done 20, Proof and claims grounded 15, Distinctiveness 10, Clarity 10 |
| audit / analysis | Diagnosis specific to this account or data 25, Evidence quality 20, Prioritised actions with expected impact 20, Correctness 20, Clarity 15 |
| strategy / plan | Grounded in this business 25, Options considered with trade-offs 20, Decision quality 20, Actionability 20, Clarity 15 |
| code / ops_doc / other | Job done 30, Correctness 25, Fits existing system 20, Clarity 15, Specificity 10 |

Then compare the work with the best reference: what does the reference do that this does not? Refine once, then deliver.

## 6. Record and learn

Write `DECISIONS.md` next to the deliverable: what you considered, what you chose and why, the strongest dissent, and what to test next.

When a lesson would help with every client, propose it for "Rules I learned" in playbook.md, typed as one of `decision_rule`, `taste_reference`, `never_do`, `exemplar` or `check`. A lesson about one client stays in that client's `context/`. It never becomes a general rule, so one client's taste does not flatten the next.
