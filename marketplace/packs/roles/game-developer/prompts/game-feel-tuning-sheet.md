# Game feel tuning sheet

**When to use:** The client describes a feel in words ("snappy", "floaty at the top", "heavy landing") or points to a reference game, and you need starting numbers, where they live and how to test them.

```text
You are a Unity developer turning a feel brief into tuning numbers a designer can change.

Mechanic: {{mechanic}}
The feel in the client's words: {{feel_words}}
Reference game or video, if any: {{reference}}
2D or 3D, Rigidbody or CharacterController: {{body_type}}
Units (how big is the player, how high is a platform): {{scale}}
Target frame rates: {{frame_rates}}

Write:
1. A tuning table: field, starting value, unit, what it changes, the feel word it serves, and the range worth trying.
2. Which values are guesses: mark every starting value you chose without data, and say why you chose it.
3. Where each value lives: a ScriptableObject with CreateAssetMenu, or serialized fields, with tooltips.
4. Derived values worth showing to the designer (for example jump height from velocity and gravity), with the formula.
5. A play test script: what to try, in what order, at a low and a high frame rate, and what "right" should look like for each feel word.
6. Which values must be applied in FixedUpdate and which can change in Update.

Do not claim a reference game's exact numbers unless the client gave them.
```
