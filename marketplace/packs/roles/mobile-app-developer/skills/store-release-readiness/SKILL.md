---
name: store-release-readiness
description: Gets an iOS and Android app version ready for the App Store and Google Play - checks build rules (Xcode and SDK minimums, Play target API level, 16 KB page support), drafts Apple privacy label and Play Data safety answers from the SDK and data inventory, checks permission messages and in-app account deletion, writes App Review notes with a demo account plan, and plans testing tracks plus a phased release or staged rollout with a halt rule. Uploads to internal test tracks at access level 2; external testing, submission and rollout steps only at level 3 within the client's limits; privacy, Data safety and age rating answers need the client's fresh yes every time. Use it before a first launch, a big update or a store deadline.
---

# Store release readiness

## When to use

- First submission of a new app to either store.
- A big update: new SDK, new login, new payments, new permissions.
- A store deadline is coming (a target API level date, a new Xcode minimum).
- A rejection came back and the client wants the next submission to pass.

## What you need

1. The release branch or build, and the lock files.
2. The list of SDKs (analytics, crash reporting, ads, payments, maps, chat) and what each sends off the phone.
3. What the app collects itself: account fields, location, photos, contacts, health, payments.
4. Current store answers: App Privacy, Data safety, age rating, and any past rejection messages.
5. The Play account type and creation date, and the launch date the client wants.
6. Access: level 1 to read. Level 2 to upload to internal test tracks and draft text. Level 3, within the client's limits, to send to external testers, submit and run the rollout.

## Steps

### 1. Check the build rules (as of 6 November 2026)

- **Apple:** built with Xcode 26 or later and the 26 SDKs (since 28 April 2026); iOS and iPadOS apps target iOS 13 or later (since 9 September 2026); privacy manifest reasons for listed APIs, including in SDKs.
- **Google Play:** new apps and updates target Android 16, API level 36 (since 31 August 2026). If the app or any SDK ships native `.so` libraries, check 16 KB page alignment with APK Analyzer; from 1 February 2027 updates without it can't be released.
- Note the exact versions found and anything that needs an upgrade first.

### 2. Build the data inventory

One row per data type: what it is, who collects it (app or which SDK), whether it leaves the phone, whether it is linked to the person, purpose, required or optional, shared with whom, retention. Read each SDK's own privacy documentation; on Play, the SDK Index lists guidance for many SDKs.

### 3. Draft the Apple privacy label

From the inventory: data types collected, linked or not linked, used for tracking or not. "Tracking" means combining your app's data with other companies' data for advertising, or sharing with a data broker. If any tracking happens, the App Tracking Transparency prompt is needed before it starts, and no feature may depend on the answer.

### 4. Draft the Play Data safety answers

Collected and shared data types, purposes, required or optional, encryption in transit, and how people request deletion. Every app on a closed, open or production track needs the form, even if it collects nothing. Google does not check answers before publishing, and wrong answers can lead to blocked updates or removal.

### 5. Check permissions and their messages

- Request each permission only when the feature needs it, after a short in-app explanation.
- iOS purpose strings say clearly and fully why ("We use your location to show the nearest shop"). Remove permissions the app no longer uses.
- The app works, in a reduced way, if the person says no.

### 6. Check account deletion

If people can create an account: deletion starts inside the app (a direct link to a web page that finishes it is fine on iOS); Play also needs a web link where people can request deletion, entered in the Data safety form. Sign in with Apple tokens are revoked. People are told subscriptions bill until they cancel, and how long deletion takes.

### 7. Check the App Review risks

Go through the guidelines that catch small apps: working demo account and live back end (2.1); review notes that describe new features specifically (2.3.1); not just a website in a wrapper (4.2); an equivalent login option if a social login sets up the account (4.8); in-app purchase for digital content, with the US storefront link exception (3.1.1); Kids Category rules if relevant (1.3).

### 8. Write the review notes and release notes

- **Review notes:** what's new, where to find it, demo account details entered in App Store Connect's App Review Information by the client (never in chat), and anything that needs special hardware or a QR code.
- **Release notes ("What's New"):** one line per change in the user's words.

### 9. Plan testing and rollout

- **iOS:** TestFlight internal (up to 100), then external (up to 10,000; the first build goes to review). Phased release over 7 days, which can be paused for up to 30 days in total.
- **Android:** internal testing (up to 100 testers, within minutes), closed test, then production with a staged rollout. New personal accounts created after 13 November 2023 need 12 testers opted in for 14 days in a row before applying for production, and the review usually takes up to 7 days.
- **Halt rule, agreed in advance:** for example, halt if the crash-free rate of the new version falls below the previous version's for a full day, or if a payment or login error appears. Halting stops new installs; people who have the version keep it, so the real fix is a new build.

### 10. Act at the right level

- Level 2: upload builds to internal tracks; enter draft text where the console allows drafts.
- Level 3, after the client's yes on the action list: external testers, submit, start the rollout, raise percentages by the plan, halt if the halt rule fires (then report).
- Fresh yes every time, even at level 3: privacy, Data safety, age rating and trader answers; prices; removing from sale; releasing to everyone ahead of plan.

## Checks

- Build versions meet both stores' current minimums.
- Every SDK in the lock file appears in the data inventory.
- Privacy label and Data safety drafts match the inventory, and both are marked "draft: you confirm".
- Account deletion works end to end on a test account.
- Review notes are specific; the demo account works and the back end will stay on.
- The rollout plan names who watches, what they watch and the halt rule.

## Output format

1. Build rules table: rule, required, found, action.
2. Data inventory table.
3. Draft Apple privacy answers and draft Play Data safety answers.
4. Permission and deletion check results.
5. Review notes and release notes.
6. Test and rollout plan with dates, owners and halt rule.
7. Action list for the client's yes (level 3).

## Example of good output (short)

*Illustrative structure, not a real business: a plumbing firm, engineer job app in Flutter. Copy the shape, never the content: every fact comes from the client's own context.*

> | Rule | Required | Found | Action |
> |---|---|---|---|
> | Play target API | 36 | 35 | Raise `targetSdkVersion`, retest edge-to-edge |
> | 16 KB pages | Needed from 1 Feb 2027 | 2 unaligned `.so` in a PDF SDK | Update SDK to its 16 KB build |
> | Xcode | 26+ | 26.1 | None |
>
> | Data | Collected by | Linked | Purpose | Required |
> |---|---|---|---|---|
> | Precise location | App | Yes | Route to job | Optional |
> | Crash logs | Crashlytics | No | Diagnostics | Required |
>
> **Halt rule:** halt the Android rollout if Android vitals show the new version's crash rate above the last version's for 24 hours, or any report of jobs not saving. Owner: Dana (ops), checks at 09:00 and 16:00.
