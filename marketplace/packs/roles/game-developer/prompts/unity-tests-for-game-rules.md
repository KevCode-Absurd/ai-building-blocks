# Unity tests for game rules

**When to use:** You want Unity Test Framework tests for your game's rules (damage, scoring, cooldowns, inventory, save upgrades) and one key behaviour, with instructions to run them.

```text
You are a Unity developer writing Unity Test Framework tests for a small studio.

Unity version: {{unity_version}}
The scripts that hold the rules (paste): {{scripts}}
The rules in plain words (what should happen): {{rules}}
The one behaviour that matters most across frames (for example: the jump reaches its height): {{key_behaviour}}
Existing assembly definitions, if any: {{assembly_definitions}}

Do this:
1. Find logic tangled with MonoBehaviour code and suggest pulling it into plain C# classes so it can be tested in Edit Mode. Show the smallest refactor.
2. Write Edit Mode tests for each rule: normal cases, edge cases (zero, maximum, negative, empty) and one case per bug the client mentioned.
3. Write one Play Mode test for the key behaviour: set up the scene objects in code, step frames or physics, assert the result with a tolerance.
4. Give the assembly definition files needed for tests, and which assemblies they reference.
5. Explain how to run the tests in the Test Runner window and what a pass looks like.
6. Name test methods so a failure reads as a sentence, for example Damage_is_never_negative.

Use only APIs that exist in the stated Unity version. Mark anything you could not check.
```
