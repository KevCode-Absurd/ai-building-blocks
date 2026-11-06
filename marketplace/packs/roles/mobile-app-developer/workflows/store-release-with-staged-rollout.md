# Store release with a staged rollout

**Trigger:** A tested app version is ready for the App Store and Google Play: a first launch, a big update or a store deadline. Cadence: every release. For a first launch on a new personal Play account, allow for a 14-day closed test plus Google's production review, which usually takes up to 7 days; later releases take a few days.

## Steps

1. **Confirm access and limits.** Which apps, which tracks, which countries, how far the rollout may go and until when. Until the client answers, work at level 1. Record the "Access I have" list.
2. **Readiness check (level 1).** Run the `store-release-readiness` skill: build rules, data inventory, permissions, account deletion, App Review risks.
3. **Draft the declarations (level 2).** Use the `privacy-answers-draft` prompt for the Apple privacy label and Play Data safety form, and the `permission-messages` prompt if permissions changed. *Approval: the client confirms every declaration change; this needs a fresh yes every time, even at level 3.*
4. **Write the notes (level 2).** Review notes with a working demo account (entered by the client in App Store Connect) and release notes in the user's words.
5. **Test tracks (level 2).** Upload to TestFlight internal testing and Play internal testing. For a new personal Play account, start the closed test with at least 12 testers now; it needs 14 days in a row before applying for production.
6. **Agree the rollout plan and halt rule.** Apple phased release over 7 days; Play staged rollout steps; who watches crash rates, ANRs and reviews, how often; the halt rule. *Approval: the client says yes to the action list before the first live step.*
7. **External testing and submission (level 3).** External TestFlight group, closed test on Play, then submit for review on both stores.
8. **Answer review (level 2 or 3).** If rejected, read the guideline cited, fix, and reply or resubmit; appeal only with specific reasons. *Approval: the client agrees any appeal.*
9. **Release (level 3).** Start the phased release and the staged rollout at the agreed first step. Raise percentages only by the plan. If the halt rule fires, pause or halt at once, then report.
10. **Watch.** Crash-free rate and Android vitals per version, ANRs, login and payment errors, store reviews. Use the `crash-report-triage` prompt for any spike.
11. **Finish.** Release to all users at the end of the plan. Release to everyone early only with a fresh yes.
12. **Log and hand over.** Every action with time and result, final rates, open issues, and what to watch next release.

## Outputs

- Readiness check and build rules table
- Data inventory with draft privacy label and Data safety answers
- Review notes and release notes
- Rollout plan with halt rule, owners and dates
- Action log and post-release report

## Needs the client's approval

The access level and limits for each store; every privacy label, Data safety, age rating, export compliance and trader answer (fresh yes each time); the rollout plan and halt rule before the first live action; any appeal; releasing to all users ahead of plan; prices, new countries, removing the app from sale or deleting builds (fresh yes each time). Store agreements are signed by the client's Apple Account Holder, and payout details stay with the client. The client can lower the access level at any time.
