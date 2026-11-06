# Tracking plan to live events

**Trigger:** A launch, a redesign of sign-up or checkout, a move to a new analytics tool, or an event list nobody trusts. Usually one to two weeks from questions to checked events, depending on the release cycle.

## Steps

1. **Agree access (level 1 first).** Ask which level the client grants in each tool (analytics, code repository, tracking sheet) and write the "Access I have" list. Read the current event list, settings and reports.
2. **Collect the questions.** Five to ten questions for the next quarter, each with the metric and flow behind it. Confirm the action that shows a customer got value.
3. **Clean the old list.** Run the `clean-up-event-names` prompt on the current events. Mark candidates to retire and every rename that would break a report.
4. **Write the plan (level 2).** Use the `event-tracking-plan` skill: convention, events, typed properties, where each fires, identity rules, filters, QA steps. Write it in a copy of the tracking sheet or as planned events in the tool.
5. **Privacy check.** Run the `privacy-check-on-a-tracking-plan` prompt. Remove or replace flagged properties; list questions for the client's adviser.
6. **Check tool settings.** In GA4, data retention (2 or 14 months on standard properties), recommended event names and parameter limits; in other tools, the project's region and who can see what.
7. **Build (level 2).** Open pull requests with the tracking code, one per flow, each with its plan rows. The client's developers or I (if granted) write the code; the client's reviewer approves it.
8. **Release (level 3, or the client's team).** Merge reviewed pull requests through the client's pipeline and publish the taxonomy, within the limits set. *Approval: the client confirms the action list and limits before the first live change.*
9. **QA after release.** Run the `tracking-qa-after-release` prompt with the tool's debug or live view and a volume comparison against a trusted source. Fix and repeat until each event passes.
10. **Retire old events.** Renames and deletions of live events go to the owner as a separate list. *Approval: each deletion of an event, property or data needs a fresh yes, every time.*
11. **Log and hand over.** The final plan with version and date, the QA results, every action taken in the client's tools, and the dashboards that need updating.

## Outputs

- Tracking plan (versioned) with convention, events, properties, identity and filter rules
- Mapping from old to new event names
- Privacy check notes and questions for the adviser
- Pull requests or merged changes, with QA results per event
- Action log

## Needs the client's approval

The access level for each tool; the list of questions; every live release at level 3 (action list and limits confirmed first); each rename or deletion of a live event or property; any change to data retention; and any new destination for event data, such as a new ad platform tag.
