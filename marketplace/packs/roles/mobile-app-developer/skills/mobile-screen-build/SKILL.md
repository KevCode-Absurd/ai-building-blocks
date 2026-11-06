---
name: mobile-screen-build
description: Builds one iOS and Android app screen in React Native (Expo or bare) or Flutter from a plain description and sample data, with every state written first (loading, empty, error, offline, success), local data shown before the network answers, safe areas and edge-to-edge insets, keyboard handling, 44 pt and 48 dp touch targets, screen reader labels, tests for each state and run steps for both simulators. Works on a branch and opens a pull request at access level 2; merging only at level 3 within the client's limits. Use it for a new screen, or to rebuild a screen that crashes, hangs on a spinner or breaks on older phones.
---

# Mobile screen build

## When to use

- A new screen is needed: a booking list, a loyalty card, a job details page, a form.
- An existing screen hangs on a spinner, shows a blank page for new accounts, hides content under the system bars, or breaks with large text.
- The client is moving a screen from a web view to native React Native or Flutter.

## What you need

1. The screen in plain words: who uses it, what they see, what they tap, what they type, and what happens next.
2. The framework and versions from the lock file: Expo SDK or bare React Native, or Flutter. Navigation library (React Navigation, Expo Router, go_router) and any state tool.
3. The data: an endpoint and a sample response with personal data replaced, or permission to use a clearly marked sample file.
4. The oldest Android version and smallest phone the client supports.
5. What people should see with no signal.
6. Access: level 1 to read the code. Level 2 to push a branch and open a pull request. Merging needs level 3 and the client's limits.

## Steps

### 1. List what people see and do

Write one line per element: text, image, button, input. Mark which elements depend on data and which are always there. Note every tap target and what it does.

### 2. Write the state table before any code

| State | When | What shows | Text | Action |
|---|---|---|---|---|
| Loading | First open, no cache | Skeleton rows | none | none |
| Success | Data arrived | The list | | Pull to refresh |
| Empty | Data arrived, zero items | Short message and illustration | Says what to do first | Primary button |
| Error | Server error | Message and retry | Plain words, no codes | Retry |
| Offline | No network | Cached data with "last updated" time, or message | | Retry when back online |

Add states the screen needs: partial data, signed out, permission denied, slow network.

### 3. Decide the data plan

- Read from a local store first and show it at once; refresh from the network and update the store. Android's offline-first guidance makes the local store the single source of truth for reads.
- Pick a write plan per action: online only for payments and confirmed bookings (show a clear failure), lazy writes for notes and checklists (save locally, sync later), queued writes for analytics.
- Timeouts on every request. Retry network failures with backoff and a limit. Do not retry a request that failed because the person is not signed in.

### 4. Sketch the component tree

Write the screen as nested components in text, with props. Keep data loading in a hook (React Native) or a controller or provider (Flutter), not inside list rows.

### 5. Build with platform basics

- **Safe areas and edge-to-edge.** Apps targeting Android SDK 35 or later draw behind the system bars on Android 15 and later. Pad headers, lists and bottom buttons for insets and cutouts. In React Native use the safe area context; in Flutter use `SafeArea` or `MediaQuery` padding.
- **Lists.** Virtualised lists (`FlatList` or `FlashList`, `ListView.builder`) with stable keys, never array indexes.
- **Keyboard.** Forms scroll so the focused field and the submit button stay visible. Set the right keyboard type and return key.
- **Touch targets.** At least 44 by 44 points on iOS and 48 by 48 dp on Android, with space between them. Use hit slop or padding instead of bigger icons.
- **Text.** Use the platform's scalable text. Test at the largest size: nothing cut off or overlapping.
- **Labels.** Every icon button has a label and role. Add a hint only when the label does not say what happens.

### 6. Handle sample data honestly

If the brief gives no endpoint, put sample data in a clearly named file, and write down the response shape the screen expects. Do not invent field names that look real.

### 7. Write tests

- React Native: Jest with React Native Testing Library. Flutter: widget tests.
- One test per state, plus the main tap flow. Query by label or role, which also checks accessibility.
- Mock the network at the boundary, including a timeout and an offline case.

### 8. Run it on both platforms

Run on the iOS Simulator and the Android Emulator, on a small Android screen, in landscape, with the largest text and with the network off. Note what you saw. If my AI tool cannot run commands, give the exact commands and what success looks like.

### 9. Open the pull request (level 2)

The pull request holds the code, tests, state table, screenshots per state if available, run steps and a "names to confirm" list for any endpoint or field not in the brief.

## Checks

- Every state in the table exists in code and has a test.
- No content sits under the status bar, navigation bar or home indicator.
- Every package has a pinned version and a note: works in Expo Go, needs a development build, or needs native setup.
- No real customer data in sample files or screenshots.
- Failed writes are visible to the person, never silent.
- Run steps work from a clean clone.

## Output format

1. State table.
2. Component tree in text.
3. Code files in full, in the order the screen uses them.
4. Sample data file, marked as sample, and the expected response shape.
5. Tests.
6. Run steps for iOS and Android, and what to check with the network off and large text.
7. Names to confirm.

## Example of good output (short)

*Made-up business for illustration: "Kettle & Crumb Bakery", loyalty card screen in Expo, sample data only.*

> | State | What shows | Text | Action |
> |---|---|---|---|
> | Loading | Card outline, 8 grey stamp circles | none | none |
> | Success | Stamps filled, QR code, last 5 visits | "3 more stamps to a free loaf" | Pull to refresh |
> | Empty | 8 empty stamps, QR code | "Show this code at the till to get your first stamp" | none |
> | Offline | Last saved card, banner | "You're offline. Card last updated 09:14" | Retry |
> | Error | Last saved card, banner | "We couldn't refresh your card" | Retry |
>
> **Names to confirm:** `GET /me/visits` and the `stampsEarned` field are from the brief; `lastVisitAt` is my guess, marked in `sample-visits.json`.
>
> **Run:** `npx expo start`, press `i` for the iOS Simulator and `a` for the Android Emulator. Then turn on airplane mode and reopen the screen: the card should still show, with the offline banner.
