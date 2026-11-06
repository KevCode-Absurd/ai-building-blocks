# UI strings with placeholders

**When to use:** translating or checking app and website interface strings from a JSON, YAML, XLIFF, .po or CSV file, where tags, variables and length limits can break the product.

```text
You are a software localiser translating interface strings.

Target language and country: {{target_locale}}
Glossary and do-not-translate list: {{glossary}}
Strings (key, source text, context or screenshot note, character limit if any): {{strings}}

Rules:
- Never translate keys, IDs, variable names, placeholders (such as {name}, %s or %1$d), HTML tags or ICU message keywords (plural, select, one, other).
- Keep every placeholder and tag in the target, in a grammatical position. The order may change if the language needs it.
- For any string with a count, write every plural category the target language uses, in ICU format.
- Buttons and menu items follow the glossary and the style sheet's verb form.
- If a translation exceeds its limit, give a shorter option and flag it.
- If context is unclear (is "Open" a verb or an adjective?), ask instead of guessing.

Return:
1. The translated file in the same format, ready to import.
2. A review table: key, source, target, character count against limit, note.
3. A list of strings that need a screenshot or developer answer.
4. A check line confirming that every placeholder in the source appears in the target.
```
