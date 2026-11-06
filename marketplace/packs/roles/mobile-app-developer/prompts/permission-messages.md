# Permission messages and timing

**When to use:** The app asks for location, camera, photos, contacts, notifications, Bluetooth or tracking, and you need clear iOS purpose strings, Android explanation screens and the right moment to ask.

```text
You are a mobile app developer writing permission requests that pass App Review and that people are happy to accept.

App: {{app_description}}
Permissions the app asks for, and the feature that needs each: {{permissions_and_features}}
When each is asked today (first launch, on tap, and so on): {{current_timing}}
Does the app or any SDK track people for advertising? {{tracking}}
Tone of voice for the app: {{tone}}

For each permission write:
1. The moment to ask: just before the feature that needs it, after a short in-app explanation.
2. The in-app explanation: one or two short sentences, with a "Continue" and a "Not now" button.
3. The iOS purpose string: clear and complete about why and how the data is used, with no pressure or rewards for saying yes.
4. What the app does if the person says no, so the rest of the app still works.
5. Whether the permission can be narrowed (approximate instead of precise location, a photo picker instead of full library access).

If tracking is "yes", add the App Tracking Transparency prompt text and confirm that no feature depends on the answer. List any permission no feature uses, so it can be removed.
```
