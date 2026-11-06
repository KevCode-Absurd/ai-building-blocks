# Outbound campaign, from profile to held meetings

**Trigger:** The client wants more meetings with new buyers, a new segment or country is being opened, or the pipeline review shows too few early-stage deals. Runs as a campaign of four to eight weeks per segment, then repeats.

**Access:** At the start, ask which level the client grants for the CRM, the engagement tool, the mailbox, the calendar and the dialer, and record it under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits. Without that level, the step's output comes back as drafts and files for the client to use. LinkedIn messages are always sent by the client from their own seat.

## Steps

1. **Profile and score.** Run `icp-and-lead-scoring` on the client's won, lost and churned deals, then on the target list. [L2] Save the score as draft fields. *Approval: client confirms the profile, the red flags and the tier cut-offs.*
2. **Check the list's history.** Record where every list came from. Remove opt-outs, existing customers and open deals. Mark UK sole traders and partnerships, and EU countries with stricter business email rules. *Approval: client confirms the list may be used, after checking local rules.*
3. **Rules check.** Run the `outreach-rules-check` prompt for every channel and country in the campaign. *Approval: client signs off the checklist; anything unclear goes to their lawyer.*
4. **Research the A tier.** Run `account-research-brief` in batch mode for the top accounts, so each has a true reason to contact. [L2] Save the briefs to the accounts.
5. **Write the messages.** Run `cold-email-sequence` for the segment, the `personalised-first-lines` prompt for the A tier, and `call-script-and-booking` for the calling part. Run the `reply-handling-scripts` prompt for common answers. [L2] Build the sequence and call lists, paused. *Approval: client approves every template, script and the sending plan.*
6. **Sender set-up.** Confirm SPF, DKIM and DMARC on the sending domain, one-click unsubscribe where needed, and a shared suppression list across tools. *Approval: client's IT or domain owner confirms.*
7. **Confirm the live action list.** [L3] Show the list of actions and limits: segment, mailbox and domain, templates, new contacts a day, call lists, calendar, countries, dates. *Approval: the client's yes to the list.*
8. **Run.** [L3] Enrol approved contacts, start the sequence, start screened call lists for the human callers, send booking links, book and confirm meetings, and log every touch. The client sends LinkedIn messages from their own seat. At lower levels the client sends and books from their own tools.
9. **Watch daily.** Bounces, spam complaints, replies, opt-outs and meetings booked. [L3] Pause the sequence at once if complaints or bounces jump, a reply raises a legal point, or a platform warning appears, and tell the client.
10. **Hand off.** For each booked meeting, run the `meeting-handoff-note` prompt. [L3] Send the confirmation and reminder; rebook no-shows once.
11. **Review weekly.** Positive replies per hundred contacted by segment and message, meetings held, the closer's view of each meeting. Change one thing per round. *Approval: changes outside the confirmed limits need a fresh yes.*
12. **Close the campaign.** Stop the sequence, remove anyone who opted out from every tool, share the action log, rescore the list with the new results, and write three lessons for the next segment.

## Outputs

- Profile, scoring sheet and scored list
- List history record and rules checklist
- Account briefs for the A tier
- Email sequence, first lines, LinkedIn set, call script, voicemails, booking messages, reply scripts
- Hand-off notes for every meeting
- Weekly report and a campaign summary with lessons
- Action log of every live change

## Needs the client's approval

The profile and tiers, use of each list, the rules checklist, every template and script, the sender set-up, the level 3 action list and limits, and any change outside them: a new list, country, template, mailbox, more volume, or deleting or merging records. Check this with local rules before contacting a new country.
