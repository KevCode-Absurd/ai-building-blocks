# Build a screen and get it to testers

**Trigger:** A client needs a new app screen, or an existing screen crashes, hangs or breaks on older phones. Usually two to ten days of elapsed time, depending on review.

## Steps

1. **Agree access (level 1 until answered).** Ask which level the client grants for each tool: code host, App Store Connect, Play Console, Expo, crash reporting. Connect only through official connectors, MCP servers or each tool's own sign-in. Record the "Access I have" list.
2. **Write the states (level 1).** Use the `screen-states-table` prompt with the client's description and sample data. *Approval: the client confirms the states, the text and what happens offline.*
3. **Check the project (level 1).** Read the lock file, navigation and data layer. Note the framework version and anything that blocks the work (an old SDK, a library without New Architecture support); if an upgrade is needed first, use the `framework-upgrade-plan` prompt and agree it with the client.
4. **Build on a branch (level 2).** Follow the `mobile-screen-build` skill: data plan, component tree, platform basics, tests for each state.
5. **Accessibility pass (level 2).** Run the `mobile-accessibility-pass` skill on the new screen before review, not after.
6. **Run on both platforms.** iOS Simulator and Android Emulator, a small Android screen, largest text, network off. Record results.
7. **Open the pull request (level 2).** State table, code, tests, screenshots per state, run steps and names to confirm. *Approval: a named reviewer on the client's team approves.*
8. **Merge (level 3, if granted).** Merge only after review and green checks, within the client's limits. Otherwise the client merges.
9. **Send a test build (level 2).** Upload to TestFlight internal testing and Play internal testing (or Expo internal distribution). Send testers a short "what to try" list.
10. **Collect feedback and fix.** Triage tester reports and crashes with the `crash-report-triage` prompt; fix on the same branch or a follow-up.
11. **Hand over.** What changed, how to run it, known limits, and anything that needs store paperwork (new permission, new SDK) for the next release.

## Outputs

- "Access I have" list
- Confirmed state table
- Pull request with code, tests and run steps
- Accessibility findings and fixes
- Internal test builds and a tester checklist
- Hand-over note listing store paperwork the next release needs

## Needs the client's approval

The access level for each tool; the state table and offline behaviour; any framework upgrade; every pull request (a named reviewer); merging, unless level 3 covers it. Internal test tracks are not public, but adding external testers, submitting for review or releasing follow the `store-release-with-staged-rollout` workflow and need level 3 and the client's yes. The client can lower the access level at any time.
