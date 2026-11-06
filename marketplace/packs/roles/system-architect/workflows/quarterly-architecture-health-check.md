# Quarterly architecture health check

**Cadence:** Every three months, and after any major incident. About two hours of the tech lead's time plus exports.

**Access:** Set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand the work to your team. Until you choose, I work at level 1.

## Steps

1. **Collect the evidence (level 1).** The team shares, or I read through the agreed access: the last three months of the cloud cost export, a list of services and data stores, recent incident summaries, SLO results, DORA-style delivery numbers if tracked (lead time, deployment frequency, change fail rate, recovery time, rework rate), and the ADR folder. No secrets or keys.
2. **Refresh the diagrams.** Compare the current resources and repo with the container diagram. Update it with the `c4-diagrams-from-description` prompt (level 2: as a pull request). Every drift is a finding.
3. **Check SLOs.** For each SLO: met or missed, error budget left, and what used it up. If an SLO is always met with a wide margin, ask whether it is the right target.
4. **Run the review.** Use the `architecture-review` skill, focused on what changed this quarter: new services, new integrations, incidents and cost growth.
5. **Cost pass.** Run the `cloud-cost-review` prompt on the export. Check for idle resources and untagged spend. At level 2, draft the tagging rules and budget alerts; at level 3, switch on the agreed ones within your limits. Deleting idle resources always needs a new yes.
6. **Security pass.** Re-run the `threat-model` skill for any new trust boundary. Check the design against the current OWASP Top 10 headings. Ask the team to confirm dependency and access reviews happened.
7. **ADR hygiene.** List decisions made this quarter without an ADR, and ADRs whose revisit trigger has fired. Draft the missing records with the `architecture-decision-record` skill (level 2: as a pull request).
8. **Report.** One page: three things that got better, three risks to act on, cost trend, SLO status, and proposed ADRs. *Approval: tech lead and owner choose which actions to take.* At level 3, I then carry out the chosen actions that sit inside the limits, such as merging the approved pull requests and creating the agreed tickets.
9. **Refresh facts.** Re-check the "What changes fast" table in `knowledge.md` against the official pages for the client's cloud and note anything that affects them.

## Outputs

- Updated context and container diagrams
- SLO and error budget summary
- Findings table, ranked
- Cost findings with evidence
- Draft ADRs
- One-page report for the owner
- Action log of anything done in the tools (what, where, when, result)

## Needs the client's approval

**Runs at level 3 within your limits, after one confirmation.** Before the first live action of the quarter, I show the list (merge approved diagram and ADR pull requests, switch on agreed tags and budget alerts, create the agreed tickets, apply approved changes in the named environments) with its limits: which accounts, repositories and environments, the cost cap, and until when. After your yes, I do these and log each one.

**Always needs a new yes.** Every recommended change before it is chosen, any new SLO, any spending change above the cap, any ADR decision, deleting resources or data, production changes not on the list, and identity or security settings.
