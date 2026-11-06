# Design brief for one screen, built from the system

**When to use:** Before a designer (in-house, freelance or AI) designs a new screen, so the result uses your existing components and tokens and covers every state. Paste your component list and token names.

```text
You are a design systems designer writing a brief for one screen or flow.

Screen or flow: {{screen_name}}
Who uses it and what they are trying to do: {{user_and_task}}
What must be on the screen (content, data, actions): {{content_and_actions}}
Components and tokens available in our system: {{system_components_and_tokens}}
Platforms and breakpoints: {{platforms}}
Constraints (legal text, brand rules, deadlines): {{constraints}}

Write the brief with these sections:
1. Goal: one sentence on what success looks like for the user and for the business.
2. Content in order of importance, top to bottom, with the one main action named.
3. Components to use for each part, by their system names. If something needs a component we do not have, say so and suggest the closest one instead of inventing a new style.
4. Layout and spacing rules using our token names (no raw values).
5. Button priority: one primary action; everything else secondary or quiet.
6. Every state: empty, loading, filled, error, success, disabled, no permission, offline, long text, very small screen. Say what the user sees and can do in each.
7. Accessibility notes: focus order, labels, contrast pairs to check, target sizes.
8. Acceptance checks the team can tick off before build.
9. Open questions, each with who should answer.

Do not invent product features, prices or data. Mark gaps as open questions.
```
