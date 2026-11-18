# Headless and custom store speed fixes

A working, reversible store-speed change supported by paired measurements and buying-flow checks, or an explicit decision to keep the baseline when the candidate fails. Publishing stays within existing exact authority.

**Starts from:** A slow mobile shopping journey, a deployment regression, a platform update or a customer complaint backed by a URL and available source.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Ground the platform and the job | Nico (nico-ecommerce-speed) | intake.md, source-map.json | scope | no | read |
| 2 | Record the baseline and test protocol | Nico (nico-ecommerce-speed) | protocol.json, baseline/, diagnosis.md | scope | no | read |
| 3 | Build one reversible candidate | Nico (nico-ecommerce-speed) | candidate.patch, candidate-revision.json, rollback.md | scope | no | draft |
| 4 | Compare speed and buying behavior | Nico (nico-ecommerce-speed) | observations.json, raw-runs/, commerce-checks.md, comparison.md | measurement, commerce | no | draft |
| 5 | Verify authority and release the tested revision | Nico (nico-ecommerce-speed) | release-record.md, production-verification.md | release, commerce | yes, the plan | publish |
| 6 | Check real shoppers and keep the learning | Nico (nico-ecommerce-speed) | field-followup.md, memory-episode.md | field | no | read |

## Stage by stage

### 1. Ground the platform and the job

Identify the actual frontend, commerce backend, framework/version, hosting, CDN, SSR and hydration boundaries. Preserve personalized cache boundaries, currency, stock and consent; route Liquid-only theme changes to Arjun. Read approved brand context and scoped memory. Use existing access without asking again; name missing dependencies while continuing useful local work.

- **Needs:** context/org-context/; context/MEMORY.md; context/goals.json; target URLs, source revision and existing access scope
- **Makes:** intake.md, source-map.json
- **Checks:** scope (The target, stack, brand constraints, source/revision identity, missing inputs and existing authority are explicit; unrelated platforms are routed to the right specialist.)
- **Done when:** The source map matches URLs, assets and versions; the platform owner and permitted draft/release scope are explicit.

### 2. Record the baseline and test protocol

Use role-scoped official sources and field data with dates. Inspect LCP, response and resource timing, CPU and layout evidence before choosing a cause. Capture a trace if load completes far before first paint. Predeclare a practical threshold; preserve failed runs and uncertainty.

- **Needs:** intake.md; source-map.json; relevant official platform docs; available CrUX/RUM and local Lighthouse
- **Makes:** protocol.json, baseline/, diagnosis.md
- **Checks:** scope (The target, stack, brand constraints, source/revision identity, missing inputs and existing authority are explicit; unrelated platforms are routed to the right specialist.)
- **Done when:** The protocol defines metrics, limits, paired order, browser/device/network/CPU/cache conditions and commerce checks before a candidate is measured.

### 3. Build one reversible candidate

Create the smallest justified patch on a branch or restorable staging copy. Preserve visible product content and buyer state. Record changed bytes and dependencies, restore steps and why this targets the measured cause. Never change browser flags or release thresholds to make a failing patch pass.

- **Needs:** protocol.json; diagnosis.md; source-map.json; approved draft workspace
- **Makes:** candidate.patch, candidate-revision.json, rollback.md
- **Checks:** scope (The target, stack, brand constraints, source/revision identity, missing inputs and existing authority are explicit; unrelated platforms are routed to the right specialist.)
- **Done when:** The patch applies to the named revision, backup/restore is practical and unrelated content or platform settings remain unchanged.

### 4. Compare speed and buying behavior

Run at least five paired baseline/candidate comparisons in alternating order under the predeclared conditions. Keep all raw reports and errors. Test affected navigation, search, product variants, prices, stock, cart persistence, consent and checkout entry with isolated sessions. Use only an authorized non-charging test checkout path. A suspected compositor stall remains inconclusive unless independent evidence resolves it.

- **Needs:** candidate.patch; protocol.json; installed specialist pack tools/performance-review.mjs; authorized commerce test environment
- **Makes:** observations.json, raw-runs/, commerce-checks.md, comparison.md
- **Checks:** measurement (The installed specialist pack tool reviews at least five alternating complete pairs with identical environments, raw evidence and functional PASS. Only IMPROVED_LAB supports a lab win; it never certifies release or sales uplift.); commerce (Evidence verifies affected shopping actions, isolated customer state, accessibility and consent on the exact candidate; no charged orders or shared private cache responses were used.)
- **Done when:** The comparison states measured improvement, regression or inconclusive; missing or failed functionality prevents a release recommendation.

### 5. Verify authority and release the tested revision

Review the exact patch, measurements and rollback together. Reuse already granted release authority; request only genuinely missing scope. If the candidate loses or evidence is inconclusive, retain the baseline and record why. For an authorized passing candidate, deploy the tested revision and verify its live bytes and buying journey.

- **Needs:** comparison.md; commerce-checks.md; rollback.md; existing authorization for the exact release
- **Makes:** release-record.md, production-verification.md
- **Checks:** release (The tested artifact matches the proposed release, existing exact permission is recorded, rollback is ready and no failed or inconclusive result is described as a proven improvement.); commerce (Evidence verifies affected shopping actions, isolated customer state, accessibility and consent on the exact candidate; no charged orders or shared private cache responses were used.)
- **Goes live:** Deploy only the checked revision through the existing authorized repository/hosting or WordPress deployment connection; keep the rollback artifact available.
- **Done when:** A passing authorized revision is verified live, or the baseline is explicitly retained with the failed evidence and next step.

### 6. Check real shoppers and keep the learning

Recheck comparable field windows when available, reporting page versus origin scope and traffic-mix changes. Preserve customer complaints and recurring friction. Save this stack/revision-specific episode and failed candidates; promote only corroborated findings to a dated playbook. Arrange recurring checks only when requested.

- **Needs:** release-record.md; production-verification.md; dated CrUX/RUM and permitted commercial data
- **Makes:** field-followup.md, memory-episode.md
- **Checks:** field (Field sources and dates are linked, missing URL data is explicit, changed traffic mix is considered and lab changes are not presented as causal revenue uplift.)
- **Done when:** The record distinguishes lab results, field observations and hypotheses, and retains unresolved customer problems rather than hiding them behind a score.

## Where you step in

- **Verify authority and release the tested revision:** approve the exact plan of live changes

## How we judge it

- Declare the primary lab metric, minimum useful improvement and regression limits before any comparison.
- Field p75 LCP, INP and CLS retain URL/origin scope and observation windows; lab TBT is not INP.
- Cart, session, checkout, content, accessibility, consent and analytics checks remain release guardrails.
