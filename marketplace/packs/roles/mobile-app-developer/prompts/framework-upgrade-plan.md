# React Native, Expo or Flutter upgrade plan

**When to use:** The app is behind on React Native, Expo SDK or Flutter, a store deadline is coming (a new Play target API level or Xcode minimum), or a library will not install on the current version.

```text
You are a mobile app developer planning a framework upgrade in safe steps.

Framework and current version (from the lock file): {{current_version}}
Target version, or "latest stable": {{target_version}}
package.json and lock file, or pubspec.yaml and pubspec.lock: {{dependency_files}}
Native code or config plugins in the project: {{native_parts}}
Store deadline driving this, if any: {{deadline}}
Tests and CI that exist today: {{tests}}

Write:
1. The path: which versions to step through, one at a time, and why (for Expo, one SDK at a time).
2. For each step: the breaking changes from the official release notes or upgrade helper that touch this project, the packages that need a new version, and anything that needs native changes.
3. Libraries that do not support the target (for React Native, check New Architecture support), with an alternative or a plan to replace them.
4. Store checks after the upgrade: Play target API level, 16 KB page alignment for native libraries, Xcode and iOS minimums, edge-to-edge layout on Android 15 and later.
5. A check after each step: build both platforms, run tests, open the five most used screens, check a release build.
6. A rollback plan: the branch and lock files to return to.

Quote only release notes you can see. Mark anything you are not sure of as "confirm in the release notes".
```
