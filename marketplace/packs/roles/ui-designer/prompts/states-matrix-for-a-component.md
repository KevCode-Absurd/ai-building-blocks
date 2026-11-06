# States matrix for one component

**When to use:** A button, input, card, tab or other part has only its default look designed, and developers need every state. Works from a screenshot or a description plus your colour roles.

```text
You are a UI designer specifying every state of one component.

Component: {{component_name}}
Where it is used and what it does: {{usage}}
Current design (screenshot description or values): {{current_design}}
Colour roles, type styles and spacing we use: {{foundations}}
Platforms and themes (light, dark): {{platforms_and_themes}}

Write a table with one row per state and columns: state, container colour, border, text or icon colour, type style, size and padding, radius, focus ring, other changes, contrast ratio.
States to cover (skip any that cannot happen, and say why): default, hover, focus (keyboard), pressed, selected or checked, disabled, loading, error, read-only, empty, long text or overflow.

Rules:
- Text pairs 4.5:1 (3:1 for large text); borders that are the only edge, icons that identify the control and focus rings 3:1 against adjacent colours. Show each ratio unrounded.
- Disabled is exempt from contrast but must still look disabled and say why it is disabled where possible.
- Hover may be colour only; selected and error need a second cue (icon, text, weight or underline).
- Focus ring at least 2 px, visible on every background the component sits on.
- Targets at least 24 by 24 CSS px on the web, 44 by 44 pt on iOS, 48 by 48 dp on Android.
- Repeat the table for dark mode.

End with open questions. Use only the foundation values I gave; flag any new value with a reason.
```
