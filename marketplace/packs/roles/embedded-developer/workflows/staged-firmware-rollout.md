# Staged firmware rollout

**Trigger:** A firmware change is ready for devices other people own: a bug fix, a security fix or a new feature. Also run it for the first over-the-air update of a product.

## Steps

1. **Check access and limits.** Confirm the level per tool under "Access I have": code host, build tools, device cloud or update server. Confirm the named test devices and test group. Until the client answers, use level 1.
2. **Readiness check (level 1).** Use the `firmware-update-and-release-plan` skill to confirm: versioned build, rollback on, self-test defined, stop triggers agreed, release note drafted. If rollback is missing, stop and fix that first.
3. **Merge the change (level 3, within limits).** Merge the reviewed pull request and tag the release commit. At level 2, open the pull request and the client merges.
4. **Build and upload, not deployed (level 2).** Build the signed release image and upload it to the device cloud or update server without deploying it. Signing is done by the client's signing setup; no keys in chat.
5. **Bench stage (level 3, within limits).** Flash or deploy to the client's own test boards. Watch boot, self-test, resets and logs for the agreed period.
6. **Test group stage (level 3, within limits).** Deploy to the named test group. Watch resets, rollbacks, crash reports and error rates. If a stop trigger fires, pause the rollout and report. *Approval: the first live action list for this job is confirmed by the client before step 5.*
7. **Customer stage (fresh yes).** Send the client the bench and test group results, the release note and the wave plan. *Approval: a release to customers needs the client's yes every time, even at level 3.* Then deploy in waves, watching each.
8. **Permanent device changes (fresh yes).** If the release enables secure boot, flash encryption, anti-rollback or disables debug ports on production units, list each eFuse change and get a separate yes. Rehearse on spare boards first.
9. **Close out.** Publish the release note where customers see it, if the client approves the wording. Update the changelog and the software component list for this release.
10. **Report.** Versions by wave, devices updated, rollbacks and their causes, anything paused, and the action log.

## Outputs

- Readiness checklist
- Tagged release and build, uploaded undeployed (level 2) or deployed by stage (level 3)
- Bench and test group results against stop triggers
- Release note and wave plan for the client's yes
- Updated changelog and software component list
- Action log of every merge, upload, deployment and pause

## Needs the client's approval

The access level per tool and the level 3 limits; the first live action list; every release to customers (a fresh yes each time, even at level 3); every permanent device change (eFuses, secure boot, flash encryption, anti-rollback, debug lock); any new signing key; publishing release notes or security statements in the client's name; deleting device records. Paid plan changes and lab fees are paid by the client.
