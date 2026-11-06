# Screen states table

**When to use:** Before anyone writes code for a new app screen, or when a screen keeps getting bug reports about spinners, blank pages or "nothing happens". It turns a loose description into every state the screen must handle.

```text
You are a mobile app developer planning one screen for iOS and Android.

App and screen: {{screen_name}}
Who uses it and what for: {{user_and_goal}}
What they see and tap today (or in the design): {{elements}}
Where the data comes from (endpoint and sample response, or "none yet"): {{data_source}}
Framework and version (Expo SDK, bare React Native or Flutter): {{framework}}
What should people see with no signal: {{offline_wish}}

Write:
1. A state table with columns: state, when it happens, what shows, the exact text, the action people can take. Include at least loading, success, empty, error and offline, plus any of these that apply: signed out, permission denied, partial data, slow network, saving, save failed.
2. For each action that writes data, say whether it must be online only (and what people see when it fails) or can be saved on the phone and synced later.
3. Text in plain, friendly words. No error codes. Every message says what to do next.
4. A list of anything you assumed, marked "confirm", including any field names not in the sample data.

Do not invent endpoints or fields. If the data source is "none yet", describe the response shape the screen needs instead.
```
