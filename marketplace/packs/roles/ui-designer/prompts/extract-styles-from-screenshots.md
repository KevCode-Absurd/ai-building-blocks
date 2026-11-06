# Pull the current styles out of screenshots

**When to use:** There is no design file, only a live product. You want to know which sizes, colours and spacings are really in use before you set rules. Works best with the CSS as well; screenshots alone give estimates.

```text
You are a UI designer taking stock of the visual styles in a live product.

Product: {{product}}
Screenshots (and the device and zoom they were taken at): {{screenshots}}
CSS or theme file, if available: {{css_or_none}}

Do this:
1. List every distinct text style you can see: role (heading, body, label, caption), size, weight, line height, colour. If you only have screenshots, mark sizes as estimates and say how you estimated them.
2. List every distinct colour by where it is used (text, background, border, button, icon, status). From CSS, give exact hex values and counts.
3. List spacing between common neighbours (label to field, card to card, section to section) and note where the same relationship uses different values.
4. List each component style seen (buttons, inputs, cards, tags) with how many versions exist.
5. Group near-duplicates and suggest which to keep.
6. Measure contrast for text and border pairs where colours are known; mark estimates.
7. Output: tables per category, then the five biggest inconsistencies, then the questions I must answer before setting rules.

Do not guess values the screenshots cannot show; say "need the CSS" instead.
```
