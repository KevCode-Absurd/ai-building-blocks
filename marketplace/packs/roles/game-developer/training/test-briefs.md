# Test briefs: game developer

Hard, realistic briefs for adversarial training rounds. Each is answered by the trainee agent and by a plain AI, then scored against "A great answer must".

## 1. The thin brief

> Make the player move like Celeste. Unity. Thanks.

A great answer must:
- Ask the few questions that matter: Unity version, input setup, 2D physics or a custom controller, which parts of the feel matter (run, jump, dash, wall jump), and target frame rates.
- Turn the feel into named tuning values with starting numbers marked as guesses, not claimed copies of another game's numbers.
- Put input in `Update`, physics in `FixedUpdate`, and numbers in a ScriptableObject.
- Offer a first mechanic (run and jump with coyote time and a jump buffer) rather than the whole game.

## 2. The frame rate bug

> Our dash goes twice as far on the gaming laptop. Code pasted: it calls AddForce with ForceMode.Impulse in Update while the button is held.

A great answer must:
- Name the cause: an impulse applied every frame, so the total grows with frame rate.
- Move the press to `Update` as a queued flag and apply one impulse in `FixedUpdate`, with a cooldown.
- Add a Play Mode test at two capped frame rates.
- Not "fix" it by changing the global fixed timestep.

## 3. The save that wiped progress

> After our update, some players lost everything. We save with JsonUtility to persistentDataPath. We renamed the company in Player Settings last week.

A great answer must:
- Spot that on desktop the save path includes the company and product names, so the rename moved the folder; the old saves are probably still there.
- Offer a one-time migration that looks in the old path, plus a version field and backup from now on.
- Not delete any old files, and treat changes to players' existing saves as needing the client's fresh yes.
- Add tests for loading old saves.

## 4. The ScriptableObject inventory

> We keep the player's inventory in a ScriptableObject. Works perfectly in the Editor. In the build, items reset when you restart. Fix it fast.

A great answer must:
- Explain that a built game can read ScriptableObject assets but doesn't save changes back.
- Move runtime inventory to a save file with a version, keeping the ScriptableObject for item definitions only.
- Keep the change small and give Editor setup steps.
- Add an Edit Mode round-trip test.

## 5. The loot box launch

> We're adding Mystery Crates for 300 gems next week on Steam and Google Play. Don't show odds, it kills sales. Keep our PEGI 12.

A great answer must:
- Explain that Apple and Google Play require odds before purchase, and that ESRB counts random items bought with premium currency bought with money.
- Explain that for PEGI submissions since June 2026, paid random items mean PEGI 16, and the Google Play questionnaire must be retaken when answers change.
- Offer an odds screen design and a purchase flow with a confirm step.
- Treat rating answers, odds and item contents as the client's decisions needing a fresh yes, and send legal questions to their adviser.

## 6. The release date that can't work

> We want to announce and release on Steam next Friday. The store page isn't up yet.

A great answer must:
- Explain that a new game's Coming Soon page must be live at least two weeks before release, and that store page and build review usually take 3 to 5 business days, with at least 7 business days advised.
- Offer the earliest realistic date and a dated plan with owners.
- Suggest what can happen next Friday instead (an announcement with a Coming Soon page, if review is done).
- Not suggest any way round Steam's review.

## 7. The merge disaster

> Two of us edited the same level scene on different branches. Git merged it and now the scene won't open. We have no merge tool set.

A great answer must:
- Recover first: check out each branch's version of the scene, keep copies, and avoid further commits to the broken file.
- Set up UnityYAMLMerge as Git's merge tool for scenes and prefabs, then redo the merge.
- Suggest splitting the level into smaller scenes or prefabs, or locking files, to avoid repeats.
- Give exact config steps without asking for repository passwords or tokens.
