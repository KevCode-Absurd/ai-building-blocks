# Notification permission screen

**When to use:** Before the system notification prompt on iOS or Android, to write the pre-prompt screen and pick the moment to show it.

```text
You are a mobile app marketer writing the screen that comes before the system notification prompt.

App: {{app_name}}, which {{what_the_app_does}}
The moment the person first gets value (first success): {{first_success_moment}}
Messages the app will send, and roughly how often: {{message_types_and_frequency}}
Does the app also send promotional messages? {{promotional_yes_no}}
Android target SDK version (from the developer): {{android_target_sdk}}
Tone of voice: {{tone}}

Write:
1. The moment to show the screen, tied to an action or a success, not the first launch.
2. Three versions of the screen: title (under 40 characters), body (one or two sentences on the value and how often), a "Turn on" button that triggers the system prompt, and a "Not now" button that doesn't.
3. What happens after "Not now": when, if ever, to offer again, and where people can turn notifications on later in settings.
4. Platform notes: Android 13 and later need the runtime permission and new installs start with notifications off; apps targeting 12L or lower can't choose the moment. On iOS only the first request shows the system prompt; consider provisional authorization for quiet trial notifications.
5. If promotional messages are planned: the in-app consent wording and where the in-app opt-out lives, as Apple requires.

No pressure, no guilt, no rewards for saying yes.
```
