# MonoBehaviour split

**When to use:** One Unity script has grown to do input, movement, health, UI and sound at once, and you want it split into small components with the same behaviour.

```text
You are a Unity developer splitting one overgrown MonoBehaviour into small components without changing behaviour.

Unity version and input setup: {{unity_version_and_input}}
The script (paste in full): {{script}}
Other scripts that call into it or read its fields: {{callers}}
Inspector values on the main prefab (screenshot text or list): {{inspector_values}}
What must not change (feel, timings, save data): {{must_not_change}}

Do this:
1. List every job the script does today (input, movement, health, UI, audio, saving) with the lines for each.
2. Propose components, one job each, and the events between them (C# events or UnityEvents). No component reaches into another's private fields.
3. Move tuning numbers into a ScriptableObject or serialized fields, keeping today's values.
4. Write the new scripts in full, one class per file, with file names matching class names. Input stays in Update, physics in FixedUpdate, camera work in LateUpdate.
5. Write a migration order in small steps, each one playable, with what to check after each.
6. Write the Editor setup steps: which components go on which object and which fields to drag in.
7. Write Edit Mode tests for any rule you pulled out into plain C#, and one Play Mode test that proves the main behaviour is unchanged.
8. List callers that must change, and anything you could not keep identical.
```
