---
name: mobile-accessibility-pass
description: Checks and fixes one React Native or Flutter app screen for people who use VoiceOver, TalkBack, large text, Voice Control or reduced motion - labels, roles and states, reading and focus order, 44 pt and 48 dp touch targets, text scaling without clipping, contrast, and announcements for changes - then writes a VoiceOver and TalkBack test script and draft answers for Apple's Accessibility Nutrition Labels that claim only what was tested. Fixes go in a pull request at access level 2. Use it before a release, after a complaint, or when a client wants to declare accessibility support on the App Store.
---

# Mobile accessibility pass

## When to use

- A screen is about to ship and nobody has tried it with a screen reader.
- A customer complained they cannot use the app with large text or VoiceOver.
- The client wants to fill in Apple's Accessibility Nutrition Labels, which are voluntary now and will become required.
- The client sells in the EU and wants to know where the app stands before talking to an adviser about the European Accessibility Act.

## What you need

1. The screen code and its components, and the framework version.
2. Screenshots or a screen recording, at normal and largest text size, if available.
3. The brand colours used for text and backgrounds.
4. The common tasks people do on this screen (book, pay, check a card).
5. Access: level 1 to read. Level 2 to push fixes on a branch and open a pull request.

## Steps

### 1. List the common tasks

Write each task as steps a person takes. Apple's labels only count a feature as supported if people can complete all common tasks with it, so this list is the test plan.

### 2. Check labels, roles and states

For every control:
- **Label:** what it is, in a few words. Icon-only buttons always need one. Don't repeat the role ("Delete", not "Delete button").
- **Role:** button, link, header, checkbox, switch, adjustable, image.
- **State:** selected, checked, disabled, expanded, busy.
- **Hint:** only when the result is not obvious. TalkBack always reads hints, while VoiceOver reads them only if the person turned hints on, so never put needed information in a hint.

React Native: `accessibilityLabel` or `aria-label`, `accessibilityRole` or `role`, `accessibilityState` or the `aria-*` state props. Flutter: `Semantics` with `label`, `button`, `header`, `selected`, `enabled`; `tooltip` on icon buttons; `ExcludeSemantics` for decoration.

### 3. Check grouping and reading order

- Group a card's parts into one element when they make sense together ("Thursday 10:00, Haircut with Sam, confirmed").
- Hide decorative images and duplicate text from screen readers.
- Reading order follows the visual order: header, main content, actions.
- After navigation or a modal opening, focus lands somewhere sensible, and a modal stops screen readers reaching what is behind it (`aria-modal` on iOS, or the Flutter route's semantics).

### 4. Check touch targets

At least 44 by 44 points on iOS and 48 by 48 dp on Android, with about 8 dp between targets on Android. Fix with padding or hit slop rather than bigger icons. Flutter's widget tests can check this with `meetsGuideline(androidTapTargetGuideline)` and `iOSTapTargetGuideline`.

### 5. Check text scaling

- Turn on the largest text size on both platforms (and iOS accessibility sizes).
- Nothing is cut off, truncated mid-word or overlapping. Rows grow taller; horizontal rows wrap or stack.
- Don't turn off font scaling to protect a layout. Fix the layout.

### 6. Check contrast and colour

- Text at least 11 points on iOS. Body text contrast at a level the client's standard asks for; WCAG uses 4.5 to 1 for normal text.
- Status is never shown by colour alone: add an icon or text ("Confirmed", "Cancelled").

### 7. Check changes and motion

- Announce results that appear without a screen change: "Added to basket", "3 new jobs". Use live regions on Android and an announcement on iOS.
- Respect reduced motion: replace large movements with fades or nothing.
- Errors on forms are announced and linked to the field.

### 8. Test with real screen readers

Run the script below with VoiceOver on an iPhone or the simulator's accessibility inspector, and TalkBack on an Android phone or emulator. Note each step: pass, fail, what was read out.

### 9. Fix and open a pull request (level 2)

One commit per kind of fix (labels, targets, scaling), tests updated to query by label and role, and before-and-after notes.

### 10. Draft the Accessibility Nutrition Label answers

For each of Apple's nine features (VoiceOver, Voice Control, Larger Text, Dark Interface, Differentiate Without Color Alone, Sufficient Contrast, Reduced Motion, Captions, Audio Descriptions), mark: supported for all common tasks, not yet, or not applicable, with the evidence. The client confirms the answers; at level 3 I enter them only after that yes.

## Checks

- Every interactive element has a label and a role, and tests find it by them.
- Every common task was completed with VoiceOver and with TalkBack, end to end.
- Largest text size shows no clipped or overlapping text.
- Touch targets meet 44 pt and 48 dp.
- No information is carried by colour alone or only in a hint.
- Draft label answers claim only what was tested.

## Output format

1. Task list.
2. Findings table: element, problem, who it affects, fix, platform.
3. Code changes in full, with tests.
4. Screen reader test script with results.
5. Draft Accessibility Nutrition Label answers with evidence, marked "draft: you confirm".

## Example of good output (short)

*Made-up business for illustration: "Northfield Bike Hire", booking screen in Flutter.*

> | Element | Problem | Affects | Fix |
> |---|---|---|---|
> | Back arrow | Read as "button" only | VoiceOver, TalkBack | `tooltip: 'Back'` on the `IconButton` |
> | Time slots | 32 dp tall | Everyone, motor impairments | Min height 48 dp, 8 dp gap |
> | "Fully booked" | Shown only in grey | Colour blind users | Add "Fully booked" text and lock icon |
> | Price row | Clipped at largest text | Larger Text | Let the row wrap |
>
> **TalkBack script, task "book a bike for Saturday":** swipe to "Saturday 14 June, date picker" (pass); double tap, swipe to "10:00, available" (pass); double tap "Book, button" (pass); hear "Booking confirmed" (failed before fix: nothing announced; passes now).
>
> **Draft label answers:** VoiceOver: supported (all 3 tasks passed). Larger Text: supported after fixes. Captions: not applicable (no video). You confirm before anything is entered.
