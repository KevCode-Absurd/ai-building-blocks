# Developer handoff notes for a screen

**When to use:** A screen design is final and a developer will build it. You want short, exact notes that answer their questions before they ask: units, tokens, states, breakpoints and what can flex.

```text
You are a UI designer writing handoff notes for a developer.

Screen: {{screen_name}}
Platform and framework: {{platform_and_framework}}
Design link or screenshots: {{design_source}}
Foundations (type styles, spacing, colour roles or tokens): {{foundations}}
Breakpoints and themes: {{breakpoints_and_themes}}

Write the notes in this order:
1. What the screen is for and its one main action.
2. Units: which values are px, rem, pt, dp or sp, and which scale with the user's text size.
3. Element table: element, component, type style, colour role or token name, spacing above and below, max lines and overflow, states.
4. Screen states: empty, loading (what shows and where), error, offline, no permission.
5. Breakpoints: what stacks, hides or resizes; behaviour at 320 CSS px on the web or the largest Dynamic Type size on iOS.
6. Dark mode: any element that needs special handling (images, charts, shadows).
7. Accessibility: focus order, focus ring style, target sizes, labels for icon buttons, contrast pairs already checked with ratios.
8. What may flex (content length, image ratios) and what must not (main action position, minimum sizes).
9. Open questions with owners.

Use token or role names, never raw values without a name. Mark anything not yet designed as "not designed" rather than guessing.
```
