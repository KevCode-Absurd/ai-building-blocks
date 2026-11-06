# Release and readout

**Trigger:** a feature is built and accepted, and the team has agreed a launch date.

**Time:** the week before launch, launch day, and two to six weeks after, depending on how long the metrics need.

## Steps

1. **Access check.** Confirm "Access I have" for the tracker, feature flags or experiment tool, analytics and the announcement channel. Level 1 until the client answers.
2. **Readiness (prompt: launch-checklist).** Find what is missing across product, support, tracking, payments, privacy and rollback. For AI features, confirm the ai-feature-responsible-launch checks are done.
   **Approval point 1:** the client approves launch readiness, the first group of users and the stop rule.
3. **Roll out in steps.**
   - Level 2: create the flag or experiment switched off, with the agreed groups.
   - Level 3: switch it on for the first agreed group only, within the limits. Watch errors, support tickets and guardrail metrics for the first 48 hours. If the stop rule fires, switch it off if the client allowed that, then report.
   **Approval point 2:** a fresh yes before widening the rollout to everyone or announcing to customers.
4. **Announce.** Draft release notes and help text. At level 2 they are saved as drafts; at level 3 they are posted to the agreed channels only.
5. **Read the result (prompt: experiment-readout).** Check the split for sample ratio mismatch first, then the primary and guardrail metrics, and write the one-page readout with a decision: ship, iterate or stop.
6. **Close the loop.** Update the roadmap, tell requesters what shipped, and log what the team learned for the next planning round (workflow: quarterly-roadmap-cycle).

## Outputs

- Launch checklist with owners.
- Flag or experiment set-up (level 2) and rollout log (level 3).
- Release notes and help text.
- Experiment readout with a decision.
- Updated roadmap and the action log.

## Needs the client's approval

- Launch readiness, the first group and the stop rule (point 1).
- Widening the rollout or announcing to customers, with a fresh yes (point 2).
- Any change to pricing, billing or data use, and anything that cannot be undone.
