# Steam beta to release

**Trigger:** A first Steam launch, or an update big enough to need a public beta. Cadence: start at least several weeks before the release date, because Steam needs a Coming Soon page live for two weeks and review lead time of about 7 business days.

## Steps

1. **Confirm access and limits.** Which Steam app, which branches I may set live, which store page edits I may publish, and until when. Until the client answers, work at level 1. Write down "Access I have".
2. **Readiness (level 1).** Run the `game-release-readiness` skill: timeline, store page and build checks, Content Survey draft, age rating drafts, paid item check.
3. **Declarations (level 2).** Draft the Content Survey (including generative AI use) and rating answers, and use the `paid-items-and-ratings-check` prompt if the game sells anything. *Approval: the client confirms every survey and rating answer, and the odds shown; fresh yes every time.*
4. **Store page.** Draft the text; the client approves it and submits it for review. *Approval: submitting for review and posting Coming Soon need the client's fresh yes.*
5. **Build account.** The client sets up a dedicated build account with only the Edit App Metadata and Publish App Changes To Steam permissions, in CI or on their machine. No passwords or Steam Guard codes in chat.
6. **Test branch (level 2).** Upload the build with SteamPipe and set it live on a password-protected branch for the team. Run the play test checklist and check saves and Steam Cloud.
7. **Public beta (level 3).** After the client's yes on the action list, set the build live on the public beta branch. Watch crash reports, player reports and Steam Cloud logs.
8. **Fix loop.** Bugs go through the `game-bug-diagnosis` skill and the `mechanic-from-brief-to-merged-pr` workflow; each fixed build goes to the test branch first, then the beta.
9. **Build review.** The client submits the release build for review at least 7 business days before release. *Approval: fresh yes for the submission.*
10. **Release.** The client sets the build live on the default branch in App Admin and presses release, with the last good build ID written down for a fallback. *Approval: fresh yes every time; I prepare the checklist at level 2.*
11. **Watch and report.** First days: crash rate by build, reviews, refunds mentioned by players, cloud save issues. Stop and ask if a crash spike or policy warning appears.

## Outputs

- Release timeline with owners
- Store page draft and checklist results
- Content Survey and rating answer drafts, marked "you confirm"
- Paid item check and fix list
- Branch plan with build IDs
- Action log and launch report

## Needs the client's approval

The access level and limits for Steamworks and the code host; every Content Survey, rating and odds answer (fresh yes each time); store page review submission and Coming Soon; the action list before public beta builds; the build review submission; setting the default branch live and pressing release (fresh yes each time); prices, discounts and paid item contents; deleting builds or branches. The client can lower the access level at any time.
