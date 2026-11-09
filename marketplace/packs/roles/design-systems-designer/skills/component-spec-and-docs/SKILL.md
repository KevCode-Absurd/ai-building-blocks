---
name: component-spec-and-docs
description: Writes a full specification and documentation page for one system component - purpose, anatomy, properties and variants, every state, the exact tokens used, behaviour, keyboard and focus rules, content rules, do and don't - mapped to Figma component properties and to the code component's props. Use it when adding a component to a design system, when designers and developers disagree on how a part works, or before a handoff so nothing is guessed.
---

# Component spec and docs

## When to use

- A new component is being added to the system (or promoted from one team's product).
- The Figma component and the code component have drifted: different names, missing props or states.
- Developers keep asking how a part behaves in error, loading or long-text cases.
- The docs site has a picture of the component and nothing else.

Not for the visual polish of a single screen (see the UI designer kit) or for building the component in code (see the front-end developer kit).

## What you need

1. **The component:** a Figma link or screenshots of every version that exists, and the code if it exists (props, story files).
2. **The token set** the system uses, with names.
3. **Where it is used:** the tasks it supports, and any analytics on detaches or one-off copies.
4. **Platforms and framework:** web (which framework), iOS, Android.
5. **Evidence it is needed,** if it is new: the screens or teams that need it. A part that only one team needs stays local.
6. **Access I have:** the level per tool. Until the client answers, work at level 1.

## Steps

1. **State the purpose** in one sentence and when not to use it ("Use for one main action per view; for navigation use a link").
2. **Draw the anatomy.** Number each part (container, label, leading icon, trailing icon, helper text, counter) and say which are optional.
3. **Define properties.** List each property with its values and default, using the same names in Figma and code. Map Figma property types: variant (size, emphasis), boolean (show icon), instance swap (which icon, with preferred instances), text (label), slot (custom content area) where flexible content is needed. Avoid a variant for every combination; use booleans and swaps instead.
4. **List every state** in a table: default, hover, focus, pressed, selected, disabled, loading, error, read-only, plus content states such as empty, long text and overflow. For each state give the token for every visual part. Hover may differ by colour alone; focus needs a visible indicator with 3:1 contrast against adjacent colours; disabled is exempt from contrast but must still look disabled.
5. **Write the tokens table.** Part, property, token, light value, dark value. Only semantic tokens; if a needed token is missing, propose it rather than using a raw value.
6. **Write behaviour.** What happens on click, tap, Enter and Space; what is announced; how it resizes; truncation or wrapping; minimum target size (24 by 24 CSS pixels on the web as the floor; 44 by 44 points on Apple platforms; 48 by 48 dp on Android).
7. **Write accessibility rules.** Role, accessible name source, keyboard order, focus management, what screen readers announce in each state, and contrast pairs with ratios.
8. **Write content rules.** Label length, case, verbs first, what never goes in the label.
9. **Do and don't.** Three to five pairs, each with a reason.
10. **Code usage.** Props with types and defaults; one short example. If the client uses Code Connect, note the mapping from each Figma property to each prop so Dev Mode shows the real code.
11. **Open questions.** Anything not decided, with the owner.
12. **Deliver at the right level.** Level 1: the spec as a document. Level 2: build the component and its docs frame in a branch or "DRAFT" page in Figma; add a docs page or story on a branch and open a pull request; write an unpublished docs page. Level 3: after the client confirms the action list and limits, merge the branch, publish the library update with a change description, and publish the docs page; log each action.

## Checks

- Every property exists with the same name in Figma and code, or the gap is listed.
- Every state has tokens for every part, in every theme.
- Contrast ratios are written for text and non-text parts in every theme.
- Keyboard and screen reader behaviour is written, not assumed.
- No raw values; missing tokens are proposed.
- The component has a reason to exist in the system (evidence from more than one team, or a stated decision).
- Any level 2 or 3 action is logged.

## Output format

1. Name, status (proposed, beta, stable, deprecated), version.
2. Purpose and when not to use.
3. Anatomy (numbered list).
4. Properties table: property, values, default, Figma type, code prop.
5. States table: state, part, token, light, dark.
6. Behaviour.
7. Accessibility.
8. Content rules.
9. Do and don't.
10. Code usage and Code Connect mapping.
11. Open questions and action log.

## Example of good output (short)

*Illustrative structure, not a real business: a grocery delivery app. Access I have: level 1 (Figma view link, React props). Copy the shape, never the content: every fact comes from the client's own context.*

**Button.** Status: stable, v2.3. Purpose: start the one main action on a view. Not for navigation; use Link.

| Property | Values | Default | Figma type | Code prop |
|---|---|---|---|---|
| emphasis | primary, secondary, quiet | primary | Variant | `emphasis` |
| size | md, lg | md | Variant | `size` |
| icon | none, leading | none | Boolean + instance swap | `icon` |
| label | text | "Add to basket" | Text | `children` |

| State | Part | Token | Light | Dark |
|---|---|---|---|---|
| default | container | color.action.primary | #0E7C66 | #5FD3B5 |
| default | label | color.action.primary-text | #FFFFFF (5.13:1) | #0B1F1A (9.36:1) |
| focus | ring, 2 px outside | color.focus.ring | #1D4ED8 (6.70:1 on page) | #93C5FD |
| loading | label | hidden; spinner uses color.action.primary-text | | |

Gap: code has `loading`; Figma has no loading variant. Owner: system designer.
