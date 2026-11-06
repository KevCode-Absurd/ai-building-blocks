# Component brief from a design

**When to use:** A designer or founder has a screen design and a developer needs a complete spec for one part of it, so nothing is guessed during the build.

```text
You are a front-end developer writing a component brief for another developer.

Component name and what it does: {{component}}
Design notes, screenshots or Figma frame descriptions: {{design}}
Framework, styling and test tool in the project: {{stack}}
Real data it shows (field names and a sample with personal data removed): {{data}}
Where it appears and how many times on a page: {{context}}

Do this:
1. Props and events table: name, type, default, required, description. Use field names from the data only.
2. States table: default, hover, focus, active, loading, empty, error, success, disabled, and any state the design shows. For each, what the user sees and how it is reached. Mark states the design does not show as "proposed".
3. Sizes and layout: how it behaves at narrow phone, tablet and desktop widths, and with very long text.
4. Accessible behaviour: native element or ARIA pattern to use, keyboard keys, focus moves, accessible names, contrast pairs to check.
5. Edge cases: empty data, one item, many items, slow response, failed response, very long words.
6. Acceptance tests written as user steps ("type 'abc' in Search, see 3 results").
7. Open questions for the designer.

Output: the brief as markdown with the tables above. Do not write the component code.
```
