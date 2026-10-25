# Hire Harry Roberts: how he'd work for you

These original exercises apply the documented CSS and performance distinctions to ordinary front-end work.

## What to hire him for

- **Fix a selector that reaches too far:** Compare its intended role with the unrelated content it actually styles.
- **Move a component safely:** Identify ancestor assumptions and separate intentional context from accidental dependence.
- **Stop an override escalation:** Explain the specificity conflict before adding another forceful declaration.
- **Review heading styles:** Preserve meaningful structure while choosing visual treatments for the design's actual roles.
- **Decide what to reuse:** Distinguish shared knowledge from declarations that happen to match today.
- **Set a performance safeguard:** Establish a representative baseline, threshold and response rule.
- **Assign performance responsibilities:** Connect development, release checks and live observation to named actions.
- **Prepare a front-end case study:** Explain an inherited problem, the bounded repair and evidence that it helped.

## How he'd take on your problem

1. **State the intended scope:** Name the component, change or experience the work should protect. For a selector, write what it means to target; for a budget, write which regression it should reveal.
2. **Reveal the actual reach:** Add the moved component, unrelated content or representative poor measurement that exposes the current assumption. Keep enough context to reproduce the failure rather than an artificially clean success.
3. **Separate independent decisions:** Distinguish meaning from appearance, shared reasons from matching text and targets from safeguards. Identify which relationship the present implementation has unnecessarily tied together.
4. **Choose a bounded correction:** Reduce the accidental dependency or establish a justified threshold. Avoid a broad migration unless the concrete problem requires it. Record why the chosen boundary fits.
5. **Check the relevant lifecycle:** Verify locally, examine combined changes and identify what live observation must still reveal. Assign the next response so the result does not become another unowned report.
6. **Leave the rationale beside the artifact:** Return the example, dependency map or budget note with its purpose, limits and review responsibility. Another maintainer should know what can change independently.

## First questions he'd help ask

- What was this selector intended to style?
- What else does it match when the page grows?
- Where must this component be able to move?
- Which surrounding relationship is actually intentional?
- Are these repeated values governed by the same reason to change?
- Did the heading level come from meaning or appearance?
- Is this number a target or a safeguard?
- Does the baseline represent the experience we want to protect?
- Who acts when the measurement crosses the boundary?

## Jobs, one by one

### Adding a second header list breaks its appearance

A broad rule styles every list in the page header as the main navigation. Add a second list representing genuinely different content and compare the selector's reach with the intended role. Write the intention in one sentence before proposing a class or scope change.

Create a reduced example containing both lists. Narrow the selector to express the navigation role, then check the original and new content together. Avoid compensating for the unrelated list with another exception unless that exception has a real independent purpose.

Return the annotated example, the targeted change and a note explaining the original mismatch. This gives the next maintainer a reason for the boundary. The pushback is against using the document's present shape as a substitute for naming what the rule is actually about.

### A reusable alert changes when moved into a sidebar

Place the alert in its original location and the required new one. Trace ancestor rules that affect it. Separate layout relationships the sidebar legitimately controls from the alert's own treatment. A component can be portable without ignoring every aspect of its context.

Choose a limited refactor that removes accidental assumptions. Check both locations and an awkward content case. If the proposed solution merely adds a stronger selector in the sidebar, explain why that leaves the underlying coupling unresolved.

The output is a dependency map, a small before-and-after example and a documented boundary between the component and its container. If a wider migration is needed, show the evidence that justifies its scope rather than presenting a naming convention as sufficient reason to rewrite everything.

### Developers choose heading tags to obtain the right font size

A dashboard uses a larger heading level where a smaller visual title was needed. Describe the meaningful sections independently of appearance. Then list the visual roles, such as page title or compact panel title. Compare the two maps to find where styling has distorted the structural choice.

Build one example that preserves the intended meaning while applying an appropriate visual treatment. Check the surrounding content, not just the isolated heading. Keep the recommendation specific to the application's needs rather than imposing the same pattern on every document-like page.

Return the two maps, the revised example and a clear rule for future contributions. The work resolves a local conflict between semantics and styling. It does not certify the whole interface's accessibility or remove the need for broader testing.

### A performance budget passes despite a substantial regression

The team selected a single extreme historical measurement as its threshold. Inspect the underlying distribution and conditions. Identify a representative poor result appropriate to the metric and population, keeping anomalies visible rather than silently deleting inconvenient data.

Separate the current regression boundary from the desired improvement target. Document what should happen when the safeguard is crossed and who investigates. If measurement conditions change, revisit the rationale explicitly. Do not simply raise the limit to restore a green chart.

Return a budget note with baseline, interpretation, response and review rule. Add a separate target if the current experience still needs substantial improvement. The safeguard prevents slipping; the target guides progress. Both matter, and reporting should make their different roles clear.

### Performance work disappears after the audit

A team receives a useful report but has no ongoing process for preserving the gains. Map one concrete activity during development, one check when changes are combined and one observation of actual usage. Name the person who receives each result and the action expected from them.

Trace a hypothetical live regression through that map. It should become a reproducible local investigation and a corrected change, rather than remain a red point on a dashboard. Keep the setup small enough for the actual team to maintain.

Return the responsibility map and a handover example. For a developer's career portfolio, document one such repair with intention, evidence and limits. For a volunteer site, keep the same rationale beside the code so the next maintainer can continue without inheriting unexplained conventions.

## What to use another mind for

Use specialist accessibility review for broader interface assessment and current browser evidence for compatibility. Bring in a deeper systems investigator when the bottleneck lies beyond the front end. This playbook prepares clear scope and ownership for that work.

## What you'll get back

Expect an intention statement, a revealing example, a bounded correction and a rationale another maintainer can follow. Performance work also includes a representative baseline and a named response, so measurement leads to action.
