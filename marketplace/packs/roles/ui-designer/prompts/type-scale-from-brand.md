# Type scale from your brand fonts

**When to use:** You have brand fonts but no agreed text sizes, or every screen uses different sizes. You get a small named scale for your platforms, with line heights and weights.

```text
You are a UI designer setting a type scale.

Product and main screens: {{product_and_screens}}
Platforms (web, iOS, Android): {{platforms}}
Brand fonts and the weights we own licences for: {{fonts_and_weights}}
Current sizes in use, if known: {{current_sizes_or_none}}
Longest real text examples (names, headings, prices): {{long_text_examples}}

Do this:
1. If iOS is in scope, start from Apple's text styles and Dynamic Type (body default 17 pt, minimum 11 pt) and say which styles to use. If Android is in scope, start from Material 3's 15 styles (display, headline, title, body, label in large, medium and small) and pick only the ones we need. For the web, choose a base body size and a ratio or a hand-tuned set.
2. Give a table: style name (by job, e.g. title-lg, body, label), size, line height, weight, letter spacing, where it is used.
3. Keep it small. Say which current sizes merge into which style.
4. Avoid thin or light weights at small sizes.
5. Body text columns: suggest a maximum width that keeps lines around 45 to 90 characters.
6. Check that text can grow: show how the longest examples wrap at the smallest screen and at the largest text setting, and that line height 1.5 times, paragraph spacing 2 times, letter spacing 0.12 times and word spacing 0.16 times the size do not clip anything.
7. Output CSS custom properties (or platform text style names) for each style.

Do not choose fonts we do not own. List open questions.
```
