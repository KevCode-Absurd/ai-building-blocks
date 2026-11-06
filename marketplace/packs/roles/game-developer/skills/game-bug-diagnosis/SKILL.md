---
name: game-bug-diagnosis
description: Finds and fixes physics, input and timing bugs in Unity games (and reads Godot and Unreal equivalents) - reproduce at named frame rates, classify the symptom (frame-rate dependent, order dependent, physics settings, input timing, state not reset), rank likely causes with one quick check each, prove the cause before changing code, make the smallest fix, and add a test that would have caught it. Covers jumps that vary with frame rate, lost inputs, jitter, tunnelling, sometimes-null references at scene load and pause bugs. Opens a pull request with the fix at access level 2; merges only at level 3 within the client's limits. Use it when a bug report says 'sometimes', 'on some machines' or 'feels off'.
---

# Game bug diagnosis

## When to use

- "The jump is higher on my PC than on the Switch dev kit."
- "Sometimes the jump doesn't fire."
- "The player shakes when the camera follows."
- "Bullets go through walls."
- "Null reference, but only sometimes, when the level loads."
- "After pausing, the player dashes on its own."

The general method (prove the cause before fixing, smallest change, test that fails first) is in the `software-engineer` kit's `bug-diagnosis-and-fix` skill. This skill adds the game-specific causes and checks.

## What you need

1. Unity version, input setup, physics settings (fixed timestep, interpolation and collision detection on the objects involved).
2. The scripts involved and a screenshot of their Inspector values.
3. Reproduction steps, a short video, and the frame rate or hardware where it happens.
4. The Player log or Editor console text around the error.
5. What changed recently: Unity upgrade, package update, new script.
6. Access: level 1 to read. Level 2 to push a branch and open a pull request. Level 3, within the client's limits, to merge after review and tests pass.

## Steps

### 1. Reproduce on purpose

- Cap the frame rate (`Application.targetFrameRate` with vSync off) at a low and a high value and try both.
- Try at different fixed timesteps only to diagnose, not as the fix.
- Try pause and unpause, respawn and scene reload.
- Write the reproduction as numbered steps that fail every time, or say how often it fails.

### 2. Classify the symptom

| Symptom | Usual causes | Quick check |
|---|---|---|
| Changes with frame rate | Physics in `Update`; missing or doubled `deltaTime`; force applied every frame | Search for `AddForce`, `velocity` or `MovePosition` in `Update` |
| Input sometimes ignored | Press read in `FixedUpdate`, which can skip frames | Search for input reads in `FixedUpdate`; log frames with no fixed step |
| Jitter on a followed object | Physics slower than frame rate; camera in `Update`; no interpolation | Turn on Interpolate on the body; move the camera to `LateUpdate` |
| Passing through colliders | Discrete collision detection on a fast object; thin colliders | Set continuous detection on that object and retest |
| Teleport snaps back | Moving the transform of an interpolated body | Use the Rigidbody API or `Physics.SyncTransforms` |
| Null only at load | Order of `Awake` or `Start` across objects assumed | Log the order; check for cross-object reads in `Awake` |
| Bugs after pause | Buffered input or timers kept while `Time.timeScale` is 0 | Log timers before and after pause |
| Double events after reload | Events subscribed and never unsubscribed | Check `OnEnable` / `OnDisable` pairs; count handlers |
| Works in Editor, not in build | ScriptableObject edited at runtime; Editor-only code; missing scene in build list | Check for runtime writes to assets and `#if UNITY_EDITOR` |

### 3. Rank suspects and check each

List two to four likely causes, most likely first, each with one check that proves or rules it out without changing behaviour: a log line, a breakpoint, a Profiler capture, a frame rate cap. Run the checks before editing anything.

### 4. Make the smallest fix

- Move physics to `FixedUpdate` and store inputs from `Update`.
- Scale by the right delta, once.
- Turn on interpolation or continuous detection only on the objects that need it; both have costs.
- Replace order assumptions with explicit setup: initialise own fields in `Awake`, read others in `Start`, or set Script Execution Order.
- Clear timers and buffers on pause, respawn and reload; unsubscribe events.
- Don't change the global fixed timestep as a fix unless the client agrees to the CPU cost.

### 5. Prove it

- Add a test that fails before the fix and passes after: an Edit Mode test for a pure rule, or a Play Mode test that steps frames.
- Re-run the reproduction at low and high frame rates.
- Check nothing else changed in feel: the tuning numbers stay the same.

### 6. Godot and Unreal notes

- **Godot:** physics-body movement in `_physics_process` (60 per second by default), not `_process`; multiply by `delta`.
- **Unreal:** check the actor's tick group (pre-physics, during, post-physics) and tick prerequisites before blaming the physics engine.

### 7. Act at the right level

- Level 2: open a pull request with the cause, evidence, fix, test and reproduction steps.
- Level 3, within the client's limits and after review and tests pass: merge.
- Hotfix builds to players follow the release rules: a Steam default branch or store release needs the client's fresh yes.

## Checks

- The cause is proven by evidence, not just plausible.
- The fix is the smallest change that removes the cause.
- A test fails without the fix and passes with it.
- Behaviour checked at a low and a high frame rate.
- No new allocations or `Find` calls in per-frame code.

## Output format

1. Symptom and reproduction steps.
2. Classification and ranked suspects, each with its check and result.
3. Cause, with the evidence (log lines, Profiler capture, video timestamps).
4. Fix as a diff or whole files.
5. Test and how to run it.
6. Pull request description and anything needing the client's yes.

## Example of good output (short)

*Made-up studio for illustration: "Copperkite", 3D runner, Unity 6.3 LTS.*

> **Symptom:** dash distance is about twice as long at 144 fps as at 60 fps.
> **Suspects:** (1) `AddForce(dashForce, ForceMode.Impulse)` called in `Update` while the dash button is held: check by logging calls per second at 60 and 144 fps. (2) Drag set per frame: check the Inspector and `Update`.
> **Evidence:** at 144 fps the log shows 144 impulse calls per second during a 0.2 s dash; at 60 fps, 60.
> **Cause:** the impulse is applied every frame while held, so its total grows with frame rate.
> **Fix:** read `dashAction.WasPressedThisFrame()` in `Update`, set `dashQueued = true`; in `FixedUpdate`, apply one impulse when queued and start a cooldown.
> **Test:** Play Mode test presses dash, steps 0.5 s at two capped frame rates and asserts the distance matches within a small tolerance.
