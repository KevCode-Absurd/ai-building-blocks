# Design a new system or major change

**Trigger:** A new product, service, integration or major change (new data store, tenancy model, migration) is about to be built. Usually one to three weeks of elapsed time, a few hours of the team's.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand the files to your team. Until you choose, I work at level 1.

## Steps

1. **Agree the goals.** Run the `quality-attribute-scenarios` prompt with the owner and tech lead. *Approval: owner agrees the ranked top three scenarios and the hosting budget.*
2. **Draw the context.** Use the `c4-diagrams-from-description` prompt for the system context diagram. The team corrects it.
3. **Explore structure.** If the team is unsure about service boundaries, run the `monolith-or-services` prompt. If it is a SaaS product, run the `multi-tenancy-model` prompt.
4. **Write the design doc.** Use the `system-design-doc` skill: container diagram, key flows as sequence diagrams, options and trade-offs, data, failure handling, security, operations, cost, rollout.
5. **Record decisions.** For each hard-to-reverse choice, use the `architecture-decision-record` skill. Status starts as "proposed". *Approval: the deciders named in each ADR accept or reject it.*
6. **Threat model.** Use the `threat-model` skill on every flow that crosses a trust boundary. Add mitigations to the design.
7. **Cost check.** Estimate monthly cost by line item from the provider's current pricing pages, with the date checked. If it breaks the budget, go back to step 4. *Approval: owner accepts the estimate.*
8. **Review.** Walk the doc with the team against the quality bar in `knowledge.md`. Update ADR statuses to "accepted".
9. **Hand over (level 2 in the repository).** At level 2, open a pull request that puts the doc and ADRs in the repo (for example `docs/design/` and `docs/adr/`), plus draft tickets for the build. At level 1, I hand the files to the team. List open questions with owners and dates.
10. **Optional: first build steps (level 3).** If the team grants level 3, I merge the approved docs pull request and apply the approved starter infrastructure in the named non-production environment, under the cost cap, and log each action.

## Outputs

- Ranked quality scenarios
- Design doc with C4 context and container diagrams and key flows in Mermaid
- ADRs for each major decision
- Threat model with ranked mitigations
- Monthly cost estimate with sources and dates
- Open questions list
- Action log of anything done in the repository, cloud or ticket tools (what, where, when, result)

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Before the first live action, I show the list (merge the approved docs pull request, create the agreed tickets, apply the approved starter infrastructure) with its limits: which repositories, projects and environments, the cost cap, and until when. After your yes, I do these and log each one.

**Always needs a new yes.** Quality goals and budget, every ADR decision, the cost estimate, any change to production systems or production data, deleting resources, identity and security settings not on the list, and spending above the cap.
