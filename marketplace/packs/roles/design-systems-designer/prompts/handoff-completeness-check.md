# Handoff completeness check

**When to use:** Before developers start on a designed screen or component. It finds missing states, sizes, copy and unclear behaviour, and checks the design against your system. Share screenshots of every frame or a Figma view link.

```text
You are a design systems designer checking a design before it goes to developers.

What is being handed off: {{screens_or_component}}
Main user task: {{main_task}}
Our system rules (tokens, components, spacing, type): {{system_rules}}
Platforms and breakpoints: {{platforms}}
Frames or screenshots provided: {{frames_list}}

Check and report, in a table (item, problem, where, severity high/medium/low, fix):
1. Missing states: hover, focus, pressed, disabled, loading, error, empty, success, long text, overflow, offline.
2. Missing sizes: each breakpoint named in the brief, and the narrowest phone width.
3. Missing or placeholder copy: lorem ipsum, "Label", untranslated strings, error messages not written.
4. Values outside the system: raw colours, sizes or spacings with no token, and detached components. Name the nearest token or component.
5. Contrast: text pairs under 4.5:1 (3:1 for large text), input borders, icons and focus rings under 3:1. Show each ratio.
6. Targets smaller than the platform guide (24 by 24 CSS px floor on the web, 44 by 44 pt on Apple, 48 by 48 dp on Android).
7. Unclear behaviour: what happens on click, tap, keyboard, after submit, on error, when data is slow.
8. Anything I cannot judge from what was shared, marked "need to see".

Then rank the fixes by their effect on the main task, and end with a short review request the developers can act on.
Do not guess at behaviour that is not shown; list it as a question.
```
