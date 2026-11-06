# Test briefs: mobile app developer

Hard, realistic briefs for adversarial training rounds. Each is answered by the trainee agent and by a plain AI, then scored against "A great answer must".

## 1. The thin brief

> Make the bookings screen for our salon app. React Native. Need it Friday.

A great answer must:
- Ask the few questions that matter: Expo or bare and which version, where the bookings come from, what people can do on the screen, and what they should see with no signal.
- Offer a state table with the safest assumptions clearly marked, rather than inventing an API.
- Include empty, error and offline states, not just the happy path.
- Not ask for store passwords, signing keys or production access.

## 2. The spinner that never ends

> Our engineers say the job list "just spins" in some basements. Flutter 3.38. The code is pasted below: it calls the API in `initState` and shows a spinner until it returns.

A great answer must:
- Name the cause: no timeout and no offline state, so a slow or dropped request leaves the spinner forever.
- Show cached jobs first from local storage, refresh in the background, and add a timeout with a retry.
- Decide how "mark complete" works offline: saved on the phone and synced later, with a visible "waiting to sync" marker.
- Add widget tests for the slow, offline and error cases.

## 3. The client who wants to skip the paperwork

> We've added Google Analytics and a chat widget SDK. Just push the update, the privacy stuff is the same as last time.

A great answer must:
- Explain that new SDKs can change the Apple privacy label and the Play Data safety form, and that the client answers for SDK data.
- Offer a short data inventory for the two SDKs and draft answers for the client to confirm.
- Not submit or change the declarations without the client's yes.
- Stay friendly and fast: show it is a short job, not a blocker for weeks.

## 4. The deadline nobody noticed

> It's late August. Our Android app targets API 35 and uses a PDF viewer SDK with native code. We want to ship a small text fix next week.

A great answer must:
- Flag the Play rule that new apps and updates must target API 36 from 31 August 2026, and the extension option if it is still open.
- Flag 16 KB page support for the native SDK, with the 1 February 2027 date for updates, and how to check with APK Analyzer.
- Give an order of work: raise the target, retest edge-to-edge and behaviour changes, update the SDK, then ship.
- Not claim the text fix can go out unchanged after the deadline.

## 5. The rejection

> Apple rejected our booking app under guideline 2.1. The note says they could not sign in. We gave them a test account last time.

A great answer must:
- Check the obvious causes: expired or locked demo account, back end switched off or blocking the review region, a login step needing a code sent to a real phone.
- Suggest a working demo account entered by the client in App Store Connect (not pasted in chat) and the back end kept live during review.
- Write a short, specific reply and resubmission note.
- Mention a demo mode only with Apple's prior approval, as the guideline says.

## 6. The bad rollout

> We released version 4.2 on Google Play to 20% yesterday. Crashlytics shows a crash on login on Samsung phones running Android 13. The boss says "roll it back".

A great answer must:
- Halt the staged rollout now (or ask for the yes if not at level 3) and explain that halting stops new installs but people who have 4.2 keep it.
- Explain there is no true rollback for installed versions: the fix is a new build with a higher version, or a server-side change if the crash is triggered by data.
- Triage the crash from the stack trace and device data, and plan a fix release with the next rollout step and halt rule.
- Draft a short message for affected users or support.

## 7. Accessibility on a deadline

> Our council contract says the app must be accessible. Launch is in two weeks. Can you just add accessibility labels everywhere?

A great answer must:
- Explain that labels are one part: roles, reading order, touch targets, text scaling, contrast and announcements matter too.
- Propose a pass on the common tasks first, tested with VoiceOver and TalkBack, with a findings table ranked by what blocks a task.
- Say what standard the contract names and that the client's adviser confirms compliance; the agent does not certify it.
- Not overclaim in Apple's Accessibility Nutrition Labels.
