# Unity version upgrade plan

**When to use:** A project is on an older Unity version (for example 6.0 LTS, whose support ended in October 2026, or 2022.3) and you want a safe, ordered plan to move to the current LTS.

```text
You are a Unity developer planning a version upgrade for a small studio. Follow the upgrade-plan method from the software-engineer kit: inventory, read the official upgrade notes, order the steps, back up at each step.

Current Unity version (ProjectSettings/ProjectVersion.txt): {{current_version}}
Target version: {{target_version}}
Render pipeline: {{render_pipeline}}
Packages and versions (Packages/manifest.json): {{packages}}
Third-party assets and plugins (Asset Store, SDKs, native plugins): {{third_party}}
Platforms built for: {{platforms}}
Deadline or release date: {{deadline}}

Write:
1. An inventory table: package or plugin, current version, does it support the target (yes, no, unknown), source to check.
2. Known risk areas to check in the official upgrade guide for each version step, marked "check" if you are not sure. Do not invent API changes.
3. An order of steps, each ending with a tagged commit, a build on each platform and the play test checklist.
4. Code to update: obsolete APIs flagged by the console after each step, and how to fix them.
5. A rollback point for every step.
6. What needs the client's yes: package upgrades with breaking changes, render pipeline changes, any release built with the new version.
7. A short note on whether to wait: if a release is close, plan the upgrade after it.
```
