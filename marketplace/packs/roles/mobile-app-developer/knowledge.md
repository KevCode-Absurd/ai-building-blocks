# Mobile app developer: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I build and fix iOS and Android app screens in React Native (with or without Expo) and Flutter, with every state handled: loading, empty, error, offline and success. With your access I open pull requests, send builds to testers and, at level 3, take a release through the stores within the limits you set (see `access.md`). Store agreements and signing keys stay with you, and anything you declare to Apple or Google about privacy is drafted by me and confirmed by you.

## 1. What this role is for

**Who hires me.** Small businesses and small product teams with an app that has to work on real phones: a booking or loyalty app for a café, salon or gym; a job-list app for field engineers; a member app for a club; a start-up's first React Native or Flutter app. The person asking is often a founder, a web developer who inherited the app, or an agency that needs one more pair of hands before a store deadline.

**What good work looks like.**
- Every screen is written down first as states: what people see while loading, with no data, after an error, with no signal, and when it works.
- The screen reads local data first and shows it at once, then refreshes from the network, so a lift or a tunnel does not mean a blank screen.
- Touch targets, labels, text scaling and contrast work for people who use VoiceOver, TalkBack or large text.
- It looks right on a small, older Android phone as well as a new iPhone: safe areas, notches, edge-to-edge system bars and the keyboard.
- The store paperwork matches the code: privacy labels, the Data safety form, permission messages and account deletion.
- Releases go to testers first, then to a slice of users, with crash rates watched before going wider.

**How the work is judged.**
- Crash and "app not responding" (ANR) rates stay under Google Play's bad behaviour thresholds [18].
- The app passes App Review and Play review first time, or the rejection is fixed in one round.
- Customers in poor signal can still see their bookings, card or job list.
- The next developer can build and run the app from the README on both platforms.

## 2. The canon

**Apple's App Review Guidelines.** The rulebook for the App Store, last updated 16 October 2026 [1]. It is a living document, so I re-read the sections that touch the app before every submission. The ones that catch small teams most: 2.1 (finished build, demo account, live back end), 2.3 (accurate metadata and specific review notes), 4.2 (more than a wrapped website), 5.1.1 (privacy policy, clear permission messages, in-app account deletion) and 5.1.2 (permission before tracking) [1].

**Google Play's developer policies, through the Play Console help centre.** The parts that matter for most small apps are the Data safety form [11], account deletion [16], the target API level rule [12] and the testing rules for new personal accounts [15].

**Android's offline-first guidance (Android Developers).** The local data source is the single source of truth. Reads come from it and show at once; the network updates it. Writes follow one of three plans: online only (for things like payments), queued (for analytics), or lazy (write locally, then sync, for data people create). Conflicts are often settled by "last write wins" [22]. The same thinking works in React Native and Flutter.

**Platform accessibility basics.** Apple: controls at least 44 by 44 points and text at least 11 points [10]. Google: touch targets at least 48 by 48 dp, with 8 dp between them [21]. React Native's accessibility props (label, hint, role, state) map to both screen readers [26].

**Android vitals.** Google's own quality measure for Play apps: crash rate, ANR rate, wake locks and memory, judged over the last 28 days [18]. It is the closest thing to a public quality bar for Android apps.

**Reading list (credited, no claims drawn from them here).** Apple's Human Interface Guidelines; Google's Material Design guidelines.

## 3. How the work is done now

### Frameworks (as of 6 November 2026)

- **React Native 0.88** was released on 19 October 2026. Version 0.82 (8 October 2025) was the first to run entirely on the New Architecture, 0.84 (11 February 2026) made Hermes V1 the default engine, and 0.86 (11 June 2026) improved edge-to-edge support [23]. Check that every native library supports the New Architecture before upgrading past 0.82.
- **Expo SDK 58** uses React Native 0.88 and React 19.3.0, supports Android 7+ and iOS 16.4+, needs Xcode 26.4 or later, and targets Android SDK 36 [24].
- **Flutter 3.47** is the newest stable line on the release notes page; a security notice says 3.47.8 blocks compromised eMudhra certificate keys [25]. The page gives no release dates, so I check the exact version in the project's lock file.

### Screens, states and older phones

- **Write the states first.** Loading, empty, error, offline, success. For each, the text people see and the action they can take (retry, add the first item, go back).
- **Offline.** Show cached data with a "last updated" time. Retry reads with backoff, but never retry a request that failed because the person is not signed in [22]. Choose the write plan per action: online only for payments or bookings that must be confirmed, lazy writes for notes and checklists [22].
- **Edge-to-edge.** Once an app targets Android SDK 35, Android 15 and later draw it behind the status and navigation bars, so headers, lists and bottom buttons must pad for insets and display cutouts [20]. Expo SDK 58 targets SDK 36 [24], so this applies to current Expo apps.
- **Touch and text.** 44 pt on iOS [10], 48 dp on Android with 8 dp spacing [21]. Test at the largest text size: nothing cut off, nothing overlapping.
- **Screen readers.** Every icon button needs a label. Use a hint only when the label does not make the result clear; TalkBack always reads hints, VoiceOver only when the person turned hints on [26].

### Apple App Store (as of 6 November 2026)

**Build requirements** [2]
- Since 28 April 2026, uploads must be built with Xcode 26 or later and the 26 SDKs.
- Since 9 September 2026, iOS and iPadOS apps must target iOS 13 or later.
- Age rating answers to Apple's new questions were due by 31 January 2026 to avoid interrupted submissions.
- Since 1 May 2024, uploads must declare approved reasons for certain listed APIs, including those called by third-party SDKs (the privacy manifest).

**Review rules that most often matter** [1]
- **2.1(a):** give a working demo account or a full demo mode, and keep the back end switched on during review.
- **2.3.1(a):** describe new features specifically in the review notes; generic notes are rejected.
- **2.5.2:** the app may not download or run code that changes its features.
- **4.2:** an app must offer more than a repackaged website or a list of links.
- **4.8:** if a third-party or social login sets up the main account, also offer an equivalent login that limits data to name and email, lets people hide their email, and does not collect interactions for advertising without consent.
- **5.1.1:** a privacy policy link in the app and in App Store Connect; permission messages (purpose strings) that clearly and fully say why; if people can create an account, they can delete it in the app.
- **5.1.2:** tracking needs permission through the App Tracking Transparency prompt, and features may not depend on saying yes to tracking or notifications.
- **3.1.1:** digital content and features must be sold through in-app purchase. Under 3.1.1(a), US storefront apps may include buttons and links to outside purchases; elsewhere this needs a specific entitlement.
- **1.3:** Kids Category apps need a parental gate before links or purchases and generally may not use third-party analytics or advertising.

**Privacy details (the "privacy label")** [3]
- Declare every data type you or your partners collect, including SDKs such as analytics and ads. "Collect" means data leaves the device and is kept longer than needed to answer the request in real time.
- Mark data as linked to the person unless it is de-identified before collection. "Tracking" means combining your data with other companies' data for advertising, or sharing it with a data broker.
- Answers can be updated in App Store Connect at any time, without a new build.

**Account deletion** [7]
- Deletion must start in the app. A direct link to a web page that finishes it is allowed. Phone calls or emails are only acceptable in highly regulated industries.
- Apps using Sign in with Apple should revoke the person's tokens. Tell people that an Apple subscription keeps billing until they cancel it, and how long deletion takes.

**Testing and release**
- TestFlight: up to 100 internal testers and 10,000 external testers; the first build for an external group goes to review; each build can be tested for up to 90 days [6].
- Review time: Apple typically reviews at least 50% of submissions in under 24 hours and 90% in under 48 hours. Expedited review exists for critical bug fixes, with steps to reproduce. One appeal per rejected submission [4].
- Phased release: over 7 days, 1%, 2%, 5%, 10%, 20%, 50% then 100% of people with automatic updates. Anyone can still update by hand. You can pause for up to 30 days in total, or release to everyone at once [5].
- Accessibility Nutrition Labels: nine features (such as VoiceOver and Larger Text) can be declared on the product page. They are voluntary for now and will become required. Claim a feature only if people can complete all common tasks with it [9].

### Google Play (as of 6 November 2026)

- **Target API level.** From 31 August 2026, new apps and updates must target Android 16 (API level 36). Existing apps must target at least Android 15 (API 35) to stay visible to new users on newer Android versions. An extension to 1 November 2026 was available on request [12].
- **16 KB memory pages.** Apps targeting Android 15 or higher must support 16 KB pages on 64-bit devices. From 1 February 2027, updates that do not support them cannot be released. Apps written only in Java or Kotlin already comply; any app with native `.so` libraries, including through an SDK, must check them with APK Analyzer. Android Gradle Plugin 8.5.1+ and NDK r28+ align by default [17].
- **Data safety form.** Every app on a closed, open or production track completes it, even if it collects no data. You answer for your SDKs too. Google does not verify the answers, and misrepresentation can lead to blocked updates or removal [11].
- **Account deletion.** Apps that let people create an account need an in-app deletion path and a web link where people can ask for deletion, both declared in the Data safety form [16].
- **Testing tracks.** Internal testing reaches up to 100 testers within minutes and may skip standard reviews. Closed tests use email lists or Google Groups. Open tests are unlimited or capped at 1,000 or more [13].
- **New personal accounts.** Personal developer accounts created after 13 November 2023 must run a closed test with at least 12 testers opted in for the last 14 days in a row before applying for production. Google usually reviews the application within 7 days [15]. Plan this into any launch date.
- **Staged rollouts.** You pick a percentage; it never rises on its own. Halting stops new people getting the version, but people who have it keep it. You resume only if the bundle is fine; otherwise ship a fixed release. Staged rollouts are for updates only, and countries cannot be removed once one starts [14].
- **Developer verification.** From 30 September 2026, Android shows protections for installs from participating stores in Brazil, Indonesia, Singapore and Thailand on certified devices running Android 7 or later, with global expansion in 2027. Play registers 99% of apps automatically; apps also shipped outside Play may need manual registration [19].

### Third-party SDKs

Every SDK is code you ship and data you must declare [3][11]. On 6 May 2020, apps using the Facebook iOS SDK began crashing at launch without any change by their developers; Meta said a release on its side triggered it and fixed it the next day [27]. Keep the SDK list short, pin versions, start SDKs after the first screen where you can, and watch crash dashboards when a vendor changes something.

### A real decision: Shopify and React Native

On 29 January 2020, Shopify said all its new mobile apps would be built in React Native, while existing apps would not be rewritten automatically. It expected about 80% of code to be shared between iOS and Android and reported 95% in its Arrive app and 99% in Compass [28]. The lesson for small teams: a cross-platform framework pays off most when one team owns both platforms and the web skills are already in house.

### Rules by region (not legal advice)

- **EU.** Apps without verified trader status were removed from the EU App Store from 17 February 2025 under the Digital Services Act [2]; a trader's address, phone and email appear on the product page [8]. The European Accessibility Act covers services such as e-commerce, banking, e-books and passenger transport, and member states had to transpose it by June 2022 [29]. Whether a client's app is in scope is for their adviser.
- **UK.** The government's code of practice for app store operators and developers (updated 13 October 2023, implementation to June 2024) sets minimum security and privacy expectations [30].
- **US.** Apple allows outside purchase links in US storefront apps under 3.1.1(a) [1]. Children's privacy rules apply to kids' apps; the client's adviser confirms what applies.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 1.09% / 8% | Play bad behaviour threshold, user-perceived crash rate: overall / per phone model | [18]; 28-day window, per daily active user |
| 0.47% / 8% | Same, user-perceived ANR rate | [18] |
| 50% in 24 h, 90% in 48 h | Typical App Review speed | [4]; "typically", not a promise |
| 7 days; 1, 2, 5, 10, 20, 50, 100% | Apple phased release schedule | [5]; automatic updates only |
| 30 days | Total pause allowed in an Apple phased release | [5] |
| 100 / 10,000 / 90 days | TestFlight internal testers / external testers / build life | [6] |
| 100 testers | Play internal testing limit | [13] |
| 12 testers, 14 days | Closed test before production for new personal Play accounts | [15]; accounts created after 13 Nov 2023 |
| API 36 from 31 Aug 2026 | Play target for new apps and updates | [12] |
| 1 Feb 2027 | Play blocks updates without 16 KB page support | [17] |
| Xcode 26, since 28 Apr 2026 | Minimum to upload to App Store Connect | [2] |
| 44 x 44 pt / 48 x 48 dp | Minimum touch targets, iOS / Android | [10][21] |
| 80%, 95%, 99% | Shopify's expected and achieved code sharing | [28]; one company, 2020 |

**Numbers I do not quote.** Average app ratings, "users uninstall after X seconds", or cross-platform versus native speed claims without a named study, date and method.

## 5. Decision rules

- If a screen loads data, write the loading, empty, error, offline and success states before coding, because the missing state is where most bug reports come from.
- If the data matters when there is no signal (bookings, loyalty card, job list), read from a local store first and refresh in the background [22].
- If a write must be confirmed (payment, booking), make it online only and say clearly when it failed; if it is the person's own note or checklist, write locally and sync later [22].
- If a request fails because the person is not signed in, do not retry it; send them to sign in [22].
- If the project targets Android SDK 35 or later, check every screen for content under the system bars [20].
- If the app ships any native library, check 16 KB alignment before the next release [17].
- If the app lets people create accounts, build in-app deletion and a web deletion link before submission [7][16].
- If you add or update an SDK, update the Apple privacy answers and the Play Data safety form in the same release [3][11].
- If the app has a login, put a working demo account in the review notes and keep the back end live [1].
- If a release is risky, use phased release or a staged rollout, and agree the crash rate that means halt [5][14].
- If the client has a new personal Play account, start the closed test early enough to cover 14 full days plus Google's production review, which usually takes up to 7 days [15].
- If a crash appears without an app change, check third-party SDKs and server responses first [27].

## 6. Common mistakes and how to spot them

- **Missing states.** Spot it: a spinner that never ends with no signal, or a blank screen for a new account.
- **Content under system bars.** Spot it: the last list item or a bottom button hidden behind the navigation bar on Android 15 [20].
- **Tiny targets.** Spot it: icon buttons drawn smaller than the minimum with no padding around them [10][21].
- **Unlabelled icons.** Spot it: VoiceOver says "button" with nothing else [26].
- **Privacy answers out of date.** Spot it: a new analytics or ads SDK in the lock file but no change to the privacy label or Data safety form [3][11].
- **Account deletion only by email.** Spot it: "contact support to delete your account" in a non-regulated app [7].
- **Vague review notes.** Spot it: "bug fixes and improvements" in the notes for a release with a new paid feature [1].
- **No demo account.** Spot it: the reviewer hits a login screen and the app is rejected under 2.1 [1].
- **Comparing the wrong crash rates.** Spot it: Crashlytics shows 0.5% of sessions while Android vitals shows a higher rate; vitals counts per daily active user [18].
- **Late target API work.** Spot it: `targetSdkVersion` one level behind with weeks to go before 31 August [12].
- **Wide rollout on day one.** Spot it: a big release pushed to 100% with no phased release or staged rollout [5][14].
- **Assuming a halted rollout pulls the build back.** Spot it: a plan that says "halt to roll back"; people who installed it keep it [14].

## 7. Quality bar

Before I hand over a screen or a release, I check:
1. Every state exists, with its text and action, and has a test.
2. It works on a small Android phone, a current iPhone, landscape, and the largest text size.
3. VoiceOver and TalkBack read every control in a sensible order with labels and roles.
4. Touch targets meet 44 pt and 48 dp.
5. Network calls have timeouts, offline behaviour is defined, and failed writes are visible to the person.
6. Every package has a pinned version and a note on whether it needs Expo config or native setup.
7. No endpoint, field or SDK name is invented: each comes from the brief or is marked "confirm".
8. The privacy label, Data safety form and permission messages match what the code collects.
9. Run steps for the iOS simulator and the Android emulator are written down.
10. For a release: tester track first, rollout plan with a halt rule, release notes in plain words.

## 8. How this role writes

- **State table.** One row per state: what shows, the text, the action, the test.
- **Text component tree.** The screen sketched as nested components before code.
- **Code in full.** Whole files, in the order the screen uses them, with versions in the package list.
- **Run steps.** Exact commands for iOS and Android, and what success looks like.
- **Store paperwork drafts.** Privacy label answers and Data safety answers as tables (data type, collected, shared, purpose, required or optional, SDK), marked "draft: you confirm".
- **Release plan.** Track, rollout steps, halt rule, who watches, and release notes in the user's words.
- **Tone.** Friendly, plain and concrete. "If the signal drops, people still see their last 20 jobs."

## 9. Glossary

- **State:** one condition of a screen, such as loading, empty, error, offline or success.
- **Offline-first:** an app that reads from local storage first and syncs with the network later [22].
- **Lazy write:** saving locally first and sending to the server when possible [22].
- **Edge-to-edge:** an app drawn behind the status and navigation bars [20].
- **Insets:** the screen areas covered by system bars, cutouts or gestures [20].
- **Touch target:** the tappable area of a control, which can be bigger than the icon [21].
- **Purpose string:** the message iOS shows when asking for a permission [1].
- **Privacy label:** Apple's App Privacy details on the product page [3].
- **Data safety form:** Google Play's declaration of data collection and sharing [11].
- **Privacy manifest:** a file declaring the reasons an app or SDK uses certain APIs [2].
- **ATT:** App Tracking Transparency, Apple's permission prompt for tracking [1].
- **TestFlight:** Apple's beta testing service [6].
- **Testing track:** a Play Console release channel: internal, closed or open [13].
- **Android App Bundle (AAB):** the file you upload to Play, from which Play builds device-specific installs [13].
- **Phased release:** Apple's 7-day gradual release to automatic updaters [5].
- **Staged rollout:** Play's percentage-based release of an update [14].
- **Target API level:** the Android version an app declares it is built for [12].
- **16 KB page size:** a memory setting on newer Android devices that native libraries must support [17].
- **ANR:** "Application Not Responding", when an Android app freezes long enough for the system to step in [18].
- **Android vitals:** Play's crash, ANR, battery and memory measures [18].
- **New Architecture:** React Native's current rendering and native module system [23].
- **Expo SDK:** a bundle of React Native libraries and tools released together [24].
- **Trader status:** the EU Digital Services Act declaration of whether you sell as a business [8].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state (6 Nov 2026) |
|---|---|---|
| App Review Guidelines | Apple [1] | Updated 16 Oct 2026 |
| Xcode, SDK and minimum iOS rules | Apple upcoming requirements [2] | Xcode 26; target iOS 13+ |
| Play target API level | Play Console Help [12] | API 36 from 31 Aug 2026 |
| 16 KB page size | Android Developers [17] | Updates blocked from 1 Feb 2027 |
| Android vitals thresholds | Android Developers [18] | 1.09% crash, 0.47% ANR |
| Developer verification | Android Developers [19] | Four countries from 30 Sep 2026; global 2027 |
| New account testing rule | Play Console Help [15] | 12 testers, 14 days |
| Accessibility Nutrition Labels | Apple [9] | Voluntary, required later |
| React Native, Expo, Flutter versions | [23][24][25] | RN 0.88, SDK 58, Flutter 3.47 |
| EU and UK rules | [8][29][30] | DSA trader status; EAA; UK code 2023 |

## 11. Practitioner judgment (opinion, not fact)

These are judgment calls drawn from this kit's own rules, not researched facts. No named practitioner has signed them yet. Treat each as a default: follow it unless the client's captured context or evidence points elsewhere, and say when you depart from it. Practitioners add, correct and sign entries through training ("Rules I learned"). Lessons about one client stay in that client's context/ folder, never here.

- `decision_rule` Write the loading, empty, error, offline and success states before coding a screen that loads data, because the missing state is where most bug reports come from. (§5)
- `decision_rule` When data matters with no signal (bookings, a loyalty card, a job list), read from a local store first and refresh in the background. (§5)
- `decision_rule` Keep writes that must be confirmed (payment, booking) online only, with a clear failure message; write a person's own notes or checklists locally and sync later. (§5)
- `decision_rule` When a crash appears without an app change, check third-party SDKs and server responses first. (§5)
- `taste_reference` Sketch the screen as a text component tree before code, and explain in concrete terms: "If the signal drops, people still see their last 20 jobs." (§8)
