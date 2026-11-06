# Automate one task, from intake to live

**Trigger:** The client names a repeat task to automate, or picks one from the `automation-candidates-scorer` prompt.

## Steps

1. **Agree access (level 1 until answered).** Ask which level the client grants in each app: 1 read, 2 read and draft, 3 read, write and publish. Connect only through official connectors, MCP servers or the app's own sign-in. Record the "Access I have" list.
2. **Map the task today (level 1).** Read the apps, sample records and any existing automations. Write the process as it is done now, and remove steps that add nothing.
3. **Write the spec (level 1).** Use the `automation-build-spec` skill: trigger, steps, field map, dedupe key, failure alerts, approvals, usage estimate, test plan. *Approval: the client confirms the spec, especially approval steps and who gets alerts.*
4. **Write any code or webhook handling (level 1).** Use the `code-step-writer` prompt for code steps and the `webhook-intake-check` prompt for webhooks.
5. **Build it switched off (level 2).** Build in the client's tool with the trigger off or the scenario inactive. Connections use the tool's own credential store.
6. **Test (level 2).** Run the test plan with sample data. Record results. Run the `automation-review-and-fix` skill's review checklist as if someone else built it.
7. **Confirm the go-live list.** Use the `go-live-action-list` prompt. *Approval: the client signs off the action list and limits (apps, actions, volumes, who can be contacted, end or review date).*
8. **Go live (level 3).** Switch it on within the limits. Run alongside the manual process for the agreed period; compare results daily at first.
9. **Hand over.** A one-page note: what it does, where the log is, who gets alerts, how to switch it off, how to undo. Log every action taken.

## Outputs

- "Access I have" list
- Build spec with field map and test plan
- Code steps and webhook design, if needed
- The automation, built and tested
- Signed-off go-live action list
- Run log and handover note

## Needs the client's approval

The access level in each app; the spec; any human approval steps and alert contacts; the go-live action list and limits before the first live run; anything outside those limits afterwards (new apps or accounts, more volume, new recipients, deleting or overwriting data, anything that cannot be undone). The client can lower the access level at any time.
