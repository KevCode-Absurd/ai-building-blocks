---
name: unity-mechanic-build
description: Builds one game mechanic in Unity C# (player movement, jumps, dashes, pick-ups, menus, simple game rules) from a feel brief - parts list first, tuning numbers in a ScriptableObject, input read in Update and physics applied in FixedUpdate, small components that talk through events, edge cases (pause, respawn, scene reload, fast objects), Editor setup steps, Edit Mode and Play Mode tests and a play test checklist. Checks every API against the project's Unity version and input setup. Opens a pull request at access level 2; merges only at level 3 within the client's limits. Use it for a new mechanic, a mechanic that feels wrong, or a prototype script that needs to become production code.
---

# Unity mechanic build

## When to use

- A studio needs one mechanic built: a jump with coyote time, a dash, a grapple, a pick-up, a pause menu, a health and damage rule.
- A mechanic works but feels different on fast and slow machines.
- A prototype script has to become something designers can tune and other code can trust.

For general code review and pull request habits, see the `software-engineer` kit's `code-review` skill.

## What you need

1. Unity version (from `ProjectSettings/ProjectVersion.txt`) and render pipeline.
2. Input setup: Input System package, legacy Input Manager, or both. Name the actions if they exist.
3. The feel in numbers if the client has them (speed, jump height, timings), or a reference game or video.
4. 2D or 3D, Rigidbody or CharacterController, and the existing scripts the mechanic touches.
5. Target platforms and frame rates.
6. Access: level 1 to read. Level 2 to push a branch and open a pull request. Level 3, within the client's limits, to merge after review and tests pass.

## Steps

### 1. Pin down the feel

Write the mechanic as numbers and rules: "Jump reaches 3 units high; 0.1 s coyote time after leaving a ledge; a press up to 0.1 s before landing still jumps; release early for a short hop." If the brief gives no numbers, pick starting values, say so, and show where to tune them.

### 2. List the parts

Before code: which GameObjects, which components, which data. One job per MonoBehaviour: a `PlayerInput` reader, a `PlayerMotor` that moves the body, a `GroundCheck`, a `JumpTuning` asset. Decide which events connect them (C# events or UnityEvents) so no script reaches into another's fields.

### 3. Put tuning in data

Create a ScriptableObject for numbers designers will change, with `[CreateAssetMenu]`, units in the field names or tooltips, and sensible ranges. Many prefabs can share one asset. Don't store runtime state (current health, save data) in it: in a built game, changes to ScriptableObject assets are not saved.

### 4. Split input and physics by timing

- Read input in `Update`, which runs every frame. Store a press (with a timestamp or a countdown) so it isn't lost.
- Apply forces and velocity in `FixedUpdate`, which runs before each physics step, at the fixed timestep. A frame can have zero, one or several fixed steps.
- Use `Time.deltaTime` for per-frame work and `Time.fixedDeltaTime` for per-step work.
- With the Input System, use actions (`WasPressedThisFrame`, `IsPressed`, `ReadValue`), not `Input.GetAxis`. Callbacks like `OnMouseDown` need the legacy Input Manager, which Unity no longer recommends.
- Cameras that follow the player update in `LateUpdate`.

### 5. Handle the edge cases

- **Pause.** With `Time.timeScale` at 0, `FixedUpdate` stops; make sure buffered inputs don't fire on unpause.
- **Respawn and scene reload.** Reset timers and velocity; unsubscribe events in `OnDisable` or `OnDestroy`.
- **Fast objects.** Turn on continuous collision detection for the few that need it; it costs more than discrete.
- **Jitter.** If the camera follows a Rigidbody and it jitters, set Interpolate on that body. With interpolation on, teleport with the Rigidbody API or call `Physics.SyncTransforms` after moving the transform.
- **Missing references.** Validate required fields in `Awake` or `OnValidate` and log a clear error naming the object.
- **Order.** Don't rely on the order of `Update` across objects; use Script Execution Order or one coordinating script if it matters.
- **No searching per frame.** Cache components in `Awake`; no `GameObject.Find` in `Update`.

### 6. Write the tests

- Edit Mode tests for pure logic: pull the rule (coyote timer, damage maths) into a plain C# class and test it without the scene.
- One Play Mode test for the key behaviour: spawn the player, simulate input or call the motor, step frames, assert the result.
- Put tests in their own assembly definitions and say how to run them in the Test Runner window.

### 7. Write the Editor setup steps

Numbered, click by click: which prefab gets which component, which layer and tag, which fields to drag in, which input actions to bind, and which tuning asset to create.

### 8. Self-check

- Every API exists in the stated Unity version (for example `Rigidbody2D.linearVelocity` in Unity 6, `velocity` in older versions).
- No legacy input calls if the project uses only the Input System.
- File names match class names.
- Feel numbers are exposed, not hard-coded.
- No allocation or `Find` in per-frame code paths.

### 9. Act at the right level

- Level 2: push a branch and open a pull request with the scripts, tests, setup steps and play test checklist.
- Level 3, within the client's limits and after review and tests pass: merge.
- Never change package versions, Player Settings or the render pipeline without listing the change for the client first.

## Checks

- Physics in `FixedUpdate`, input in `Update`, camera in `LateUpdate`.
- Plays the same at 30, 60 and 144 frames per second (cap the frame rate in a test build to check).
- Pause, respawn and reload don't break it.
- Tests pass in Edit Mode and Play Mode.
- A designer can change every feel number without code.

## Output format

1. Feel spec: numbers and rules, with starting values marked.
2. Parts list.
3. Scripts in full, one file per class, with the Unity version and packages stated.
4. Tuning table: field, starting value, unit, effect, where it lives.
5. Tests and how to run them.
6. Editor setup steps.
7. Play test checklist.
8. Pull request description (level 2) and anything that needs the client's yes.

## Example of good output (short)

*Illustrative structure, not a real business: a game studio making a 2D platformer in Unity 6 with the Input System. Copy the shape, never the content: every fact comes from the client's own context.*

```csharp
[CreateAssetMenu(menuName = "Tuning/Jump")]
public class JumpTuning : ScriptableObject
{
    [Tooltip("Units per second at take-off")] public float jumpVelocity = 12f;
    [Tooltip("Seconds after leaving a ledge")] public float coyoteTime = 0.1f;
    [Tooltip("Seconds a press is remembered")] public float bufferTime = 0.1f;
}

// In PlayerJump.cs
void Update()
{
    if (jumpAction.WasPressedThisFrame()) bufferTimer = tuning.bufferTime;
}

void FixedUpdate()
{
    coyoteTimer = groundCheck.IsGrounded ? tuning.coyoteTime : coyoteTimer - Time.fixedDeltaTime;
    bufferTimer -= Time.fixedDeltaTime;
    if (bufferTimer > 0f && coyoteTimer > 0f)
    {
        body.linearVelocity = new Vector2(body.linearVelocity.x, tuning.jumpVelocity);
        bufferTimer = 0f;
        coyoteTimer = 0f;
        Jumped?.Invoke();
    }
}
```

> **Play test:** cap at 30 and 144 fps; jump height within a hair of the same; walk off a ledge and press jump just after: it jumps; press just before landing: it jumps on landing; pause mid-air and unpause: no extra jump.
