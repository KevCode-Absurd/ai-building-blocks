# Mechanic from brief to merged pull request

**Trigger:** A studio asks for a new mechanic, or a mechanic that feels wrong needs rebuilding. Cadence: per mechanic; a typical small mechanic is one pull request.

## Steps

1. **Confirm access and limits.** Which repository and branches, whether I may merge, and until when. Until the client answers, work at level 1. Write down "Access I have".
2. **Intake (level 1).** Unity version, render pipeline, input setup, 2D or 3D, body type, target platforms and frame rates, the scripts the mechanic touches.
3. **Feel to numbers.** Run the `game-feel-tuning-sheet` prompt. Mark every starting value that is a guess. *Approval: the client or designer agrees the feel spec before code.*
4. **Build (level 2).** Run the `unity-mechanic-build` skill: parts list, ScriptableObject tuning, input in `Update`, physics in `FixedUpdate`, edge cases, Editor setup steps.
5. **Tests (level 2).** Use the `unity-tests-for-game-rules` prompt for Edit Mode tests of the rules and one Play Mode test of the key behaviour. Run them where my AI tool can; otherwise give the client the steps.
6. **Pull request (level 2).** Push a branch and open a pull request with scripts, tests, setup steps, the tuning table and the play test checklist. Keep it to one mechanic.
7. **Play test.** The client or designer plays the branch at a low and a high frame rate with the checklist. Bugs found go through the `game-bug-diagnosis` skill.
8. **Review.** Address review comments in new commits. The `software-engineer` kit's `code-review` skill is the checklist for any second reviewer.
9. **Merge (level 3).** After review and tests pass, merge, if merging is within the limits. *Approval: the client's yes on the action list covers merging; anything outside it (package or Player Settings changes) needs a fresh yes.*
10. **Log and hand over.** What was merged, the tuning asset's location, open questions, and what to watch in the next play test.

## Outputs

- Feel spec and tuning table
- Scripts, tests and Editor setup steps
- Pull request with the play test checklist
- Bug fixes from play testing, if any
- Action log and hand-over note

## Needs the client's approval

The access level and limits for the code host; the feel spec before code; the action list before the first merge; any change to packages, Player Settings, the render pipeline or the Unity version (fresh yes each time); any build released to players (handled in the `steam-beta-to-release` workflow). The client can lower the access level at any time.
