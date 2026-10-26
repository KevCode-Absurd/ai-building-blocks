---
name: mobile-design
description: "(Mobile-First · Touch-First · Platform-Respectful)"
risk: critical
source: community
date_added: "2026-02-27"
---
# Mobile Design System

**(Mobile-First · Touch-First · Platform-Respectful)**

> **Philosophy:** Touch-first. Battery-conscious. Platform-respectful. Offline-capable.
> **Core Law:** Mobile is NOT a small desktop.
> **Operating Rule:** Think constraints first, aesthetics second.

This skill exists to **prevent desktop-thinking, AI-defaults, and unsafe assumptions** when designing or building mobile applications.

---

## 1. Mobile Feasibility & Risk Index (MFRI)

Before designing or implementing **any mobile feature or screen**, assess feasibility.

### MFRI Dimensions (score each 0–5, whole numbers)

Two dimensions are good when high. Three are risks, bad when high. Give a short reason for every score.

| Dimension                       | Question                                                                    | 0 means                  | 5 means                         |
| ------------------------------- | --------------------------------------------------------------------------- | ------------------------ | ------------------------------- |
| **Platform Clarity** (+)        | Is the target platform (iOS / Android / both) explicitly defined?           | Not stated               | Platform and framework stated   |
| **Accessibility Readiness** (+) | Are motor, visual and cognitive needs known and planned for in this screen? | Not considered           | Needs known and covered         |
| **Interaction Complexity** (−)  | How complex are gestures, flows, or navigation?                             | One tap, one screen      | Many gestures, deep navigation  |
| **Performance Risk** (−)        | Does this involve lists, animations, heavy state, or media?                 | Static content           | Long lists, animation and media |
| **Offline Dependence** (−)      | Does the feature break or degrade without network?                          | Works fully offline      | Useless without network         |

### Score Formula

```
MFRI = (Platform Clarity + Accessibility Readiness)
       − (Interaction Complexity + Performance Risk + Offline Dependence)
```

**Range:** `-15 → +10` (best case 5 + 5 − 0 − 0 − 0 = 10, worst case 0 + 0 − 5 − 5 − 5 = −15)

If the user did not state a dimension, do not guess a flattering number. Score Platform Clarity 0 when the platform is not stated, and tell the user which unknowns kept the score down.

### Interpretation

| MFRI     | Meaning   | Required Action                       |
| -------- | --------- | ------------------------------------- |
| **6–10** | Safe      | Proceed normally                      |
| **3–5**  | Moderate  | Add performance + UX validation       |
| **0–2**  | Risky     | Simplify interactions or architecture |
| **< 0**  | Dangerous | Redesign before implementation        |

---

## 1b. When NOT to use

- Web or desktop layouts. This skill is for phone apps only.
- The platform and framework are fixed and the user only wants a code review of finished code. Use a code review instead.
- Watch, TV or car apps. Say the skill does not cover them and stop.
- Server or API work with no screen. This skill covers what the phone user sees and feels.

## 1c. What to return

Return these sections in this order. Keep each short.

```
Screen: <what the screen is and what the user does>
Platform and framework: <iOS | Android | both, framework, or MISSING>
MFRI: <score> (<Safe | Moderate | Risky | Dangerous>)
| Dimension | Score 0-5 | Reason |
Layout: <top to bottom, with thumb zone, touch sizes and where the main action sits>
Platform notes: <what differs on iOS and on Android for this screen>
Offline and loading states: <what shows with no signal, while loading, and after an error>
Changes to make: <only if MFRI is below 3: what to simplify first>
Open questions: <anything you assumed or could not know>
```

## 2. Mandatory Thinking Before Any Work

### ⛔ STOP: Ask Before Assuming (Required)

If **any of the following are not explicitly stated**, you MUST ask before proceeding:

| Aspect     | Question                                   | Why                                      |
| ---------- | ------------------------------------------ | ---------------------------------------- |
| Platform   | iOS, Android, or both?                     | Affects navigation, gestures, typography |
| Framework  | React Native, Flutter, or native?          | Determines performance and patterns      |
| Navigation | Tabs, stack, drawer?                       | Core UX architecture                     |
| Offline    | Must it work offline?                      | Data & sync strategy                     |
| Devices    | Phone only or tablet too?                  | Layout & density rules                   |
| Audience   | Consumer, enterprise, accessibility needs? | Touch & readability                      |

Ask all open questions in one message. If the user cannot answer one, state your assumption, mark it ASSUMED in the output, and score the affected MFRI dimension as if the answer were unknown. Never default to your favorite stack or pattern.

---

## 3. Mandatory Reference Reading (Enforced)

### Universal (Always Read First)

| File                          | Purpose                            | Status            |
| ----------------------------- | ---------------------------------- | ----------------- |
| **mobile-design-thinking.md** | Anti-memorization, context-forcing | 🔴 REQUIRED FIRST |
| **touch-psychology.md**       | Fitts’ Law, thumb zones, gestures  | 🔴 REQUIRED       |
| **mobile-performance.md**     | 60fps, memory, battery             | 🔴 REQUIRED       |
| **mobile-backend.md**         | Offline sync, push, APIs           | 🔴 REQUIRED       |
| **mobile-testing.md**         | Device & E2E testing               | 🔴 REQUIRED       |
| **mobile-debugging.md**       | Native vs JS debugging             | 🔴 REQUIRED       |

### Platform-Specific (Conditional)

| Platform       | File                |
| -------------- | ------------------- |
| iOS            | platform-ios.md     |
| Android        | platform-android.md |
| Cross-platform | BOTH above          |

> ❌ If you haven’t read the platform file, you are not allowed to design UI.
> If you cannot open these files (for example, you only have this one file in a chat), say so at the top of your answer and rely on the rules in this file alone. Do not pretend to have read them.

---

## 4. AI Mobile Anti-Patterns (Hard Bans)

### 🚫 Performance Sins (Non-Negotiable)

| ❌ Never                   | Why                  | ✅ Always                                |
| ------------------------- | -------------------- | --------------------------------------- |
| ScrollView for long lists | Memory explosion     | FlatList / FlashList / ListView.builder |
| Inline renderItem         | Re-renders all rows  | useCallback + memo                      |
| Index as key              | Reorder bugs         | Stable ID                               |
| JS-thread animations      | Jank                 | Native driver / GPU                     |
| console.log in prod       | JS thread block      | Strip logs                              |
| No memoization            | Battery + perf drain | React.memo / const widgets              |

---

### 🚫 Touch & UX Sins

| ❌ Never               | Why                  | ✅ Always          |
| --------------------- | -------------------- | ----------------- |
| Touch <44–48px        | Miss taps            | Min touch target  |
| Gesture-only action   | Excludes users       | Button fallback   |
| No loading state      | Feels broken         | Explicit feedback |
| No error recovery     | Dead end             | Retry + message   |
| Ignore platform norms | Muscle memory broken | iOS ≠ Android     |

---

### 🚫 Security Sins

| ❌ Never                | Why                | ✅ Always               |
| ---------------------- | ------------------ | ---------------------- |
| Tokens in AsyncStorage | Easily stolen      | SecureStore / Keychain |
| Hardcoded secrets      | Reverse engineered | Env + secure storage   |
| No SSL pinning         | MITM risk          | Cert pinning           |
| Log sensitive data     | PII leakage        | Never log secrets      |

---

## 5. Platform Unification vs Divergence Matrix

```
UNIFY                          DIVERGE
──────────────────────────     ─────────────────────────
Business logic                Navigation behavior
Data models                    Gestures
API contracts                  Icons
Validation                     Typography
Error semantics                Pickers / dialogs
```

### Platform Defaults

| Element   | iOS          | Android        |
| --------- | ------------ | -------------- |
| Font      | SF Pro       | Roboto         |
| Min touch | 44pt         | 48dp           |
| Back      | Edge swipe   | System back    |
| Sheets    | Bottom sheet | Dialog / sheet |
| Icons     | SF Symbols   | Material Icons |

---

## 6. Mobile UX Psychology (Non-Optional)

### Fitts’ Law (Touch Reality)

* Finger ≠ cursor
* Accuracy is low
* Reach matters more than precision

**Rules:**

* Primary CTAs live in **thumb zone**
* Destructive actions pushed away
* No hover assumptions

---

## 7. Performance Doctrine

### React Native (Required Pattern)

```ts
const Row = React.memo(({ item }) => (
  <View><Text>{item.title}</Text></View>
));

const renderItem = useCallback(
  ({ item }) => <Row item={item} />,
  []
);

<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(i) => i.id}
  getItemLayout={(_, i) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * i,
    index: i,
  })}
/>
```

### Flutter (Required Pattern)

```dart
class Item extends StatelessWidget {
  const Item({super.key});

  @override
  Widget build(BuildContext context) {
    return const Text('Static');
  }
}
```

* `const` everywhere possible
* Targeted rebuilds only

---

## 8. Mandatory Mobile Checkpoint

Before writing **any code**, you must complete this:

```
🧠 MOBILE CHECKPOINT

Platform:     ___________
Framework:    ___________
Files Read:   ___________

3 Principles I Will Apply:
1.
2.
3.

Anti-Patterns I Will Avoid:
1.
2.
```

❌ Cannot complete → go back and read.

---

## 9. Framework Decision Tree (Canonical)

```
Need OTA + web team → React Native + Expo
High-perf UI → Flutter
iOS only → SwiftUI
Android only → Compose
```

No debate without justification.

---

## 10. Release Readiness Checklist

### Before Shipping

* [ ] Touch targets ≥ 44–48px
* [ ] Offline handled
* [ ] Secure storage used
* [ ] Lists optimized
* [ ] Logs stripped
* [ ] Tested on low-end devices
* [ ] Accessibility labels present
* [ ] MFRI ≥ 3

---

## 11. Related Skills

* **frontend-design** – Visual systems & components
* **frontend-dev-guidelines** – RN/TS architecture
* **backend-dev-guidelines** – Mobile-safe APIs
* **error-tracking** – Crash & performance telemetry

---

> **Final Law:**
> Mobile users are distracted, interrupted, and impatient—often using one hand on a bad network with low battery.
> **Design for that reality, or your app will fail quietly.**

---

## When to Use
- Designing or reviewing a phone-app screen or flow for iOS, Android or both
- Checking how risky a screen is before paying a developer to build it
- Making sure a screen still works with no signal, slow loading, large touch needs and thumb-only use

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
