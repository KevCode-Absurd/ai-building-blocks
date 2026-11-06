# Lifecycle message launch

**Trigger:** A new app with no messaging plan, users going quiet in the first week, or a jump in people turning notifications off. Cadence: build once, then review the numbers every week for the first month and monthly after that.

## Steps

1. **Confirm access and limits.** Which messaging tool, which audiences, the frequency cap, quiet hours, and until when. Until the client answers, work at level 1. Write down "Access I have".
2. **Read the current state (level 1).** Opt-in rate by platform, current messages and their opens, actions and opt-outs, and return rates after day 1, 7 and 30 from the client's analytics. Use the `growth-marketer` kit's funnel method if return data is thin.
3. **Check consent and permissions.** Is there in-app marketing consent and an in-app opt-out (needed for promotional push on iOS)? What Android target SDK does the app use? If consent is missing, list it as a developer task before any promotional message.
4. **Plan the permission moment.** Run the `notification-permission-screen` prompt. *Approval: the client approves the screen; the developer builds it.*
5. **Build the message map (level 2).** Run the `push-and-in-app-messages` skill: moments, map, copy, caps and stop rules. Save every campaign as a draft in the tool.
6. **Test sends (level 2).** Send each message to a test device or internal segment. Check the deep link, the cut-off on a small phone, and the time zone.
7. **Agree the action list.** Which campaigns go live, to which audiences, with which caps, and the opt-out level that pauses a campaign. *Approval: the client says yes to the action list before the first live send.*
8. **Go live (level 3).** Turn on the approved campaigns within the limits. Log each with time and audience size.
9. **Watch.** Weekly at first: delivered, opened, goal action, opt-outs and disables, uninstalls if the tool shows them. If opt-outs pass the agreed level, pause that campaign at once and report.
10. **Add the re-engagement series.** After two weeks of data, use the `re-engagement-series` prompt for quiet users. *Approval: a new audience needs the client's fresh yes.*
11. **Report and tune.** Monthly: what each message did, what to cut, what to test next.

## Outputs

- Current state summary with dates
- Permission screen copy and moment
- Message map, copy with character counts, in-app message specs
- Test send checklist
- Action list, action log and monthly report

## Needs the client's approval

The access level and limits for the messaging tool; the permission screen; the action list before the first live send; any new audience, country or campaign type (fresh yes each time); any promotional message to people without confirmed consent (not sent until consent exists). Pausing a campaign whose opt-outs pass the agreed level is a safety step I take at once and then report. The client can lower the access level at any time.
