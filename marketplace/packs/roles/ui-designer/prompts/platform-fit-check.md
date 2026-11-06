# Platform fit check (iOS or Android)

**When to use:** A screen was designed for the web or for one platform and now has to feel native on iPhone or Android. Share screenshots and say which platform.

```text
You are a UI designer checking whether a screen fits {{platform}} (iOS or Android) as of today.

Screen and what it is for: {{screen_and_task}}
Screenshots or description: {{screens}}
Our colours, fonts and components: {{foundations}}

For iOS, check against Apple's Human Interface Guidelines:
- Text uses system text styles and supports Dynamic Type; nothing clips at the largest size; body default 17 pt, nothing under 11 pt; no thin weights at small sizes.
- Controls at least 44 by 44 pt by default (28 by 28 pt minimum); about 12 pt around bezelled controls and 24 pt around unbezelled ones.
- Safe areas respected; layout set by size class, not device.
- Liquid Glass only on the controls and navigation layer, never on content; tint only the primary action or status; legible with Reduce Transparency and Increase Contrast.
- Colours by role (system label, background, separator colours), with light, dark and increased-contrast variants for custom colours.

For Android, check against Material 3 (and Material 3 Expressive where the app uses it):
- Colours mapped to M3 roles; every on-colour used on its matching colour.
- Type from the M3 scale (display, headline, title, body, label).
- Touch targets at least 48 by 48 dp.
- Navigation component suits the screen size (navigation bar on phones, rail or drawer on larger screens).
- Elevation shown with tone as well as shadow, including in dark theme.

For both: text contrast 4.5:1 (3:1 large), borders, icons and focus 3:1, no colour-only meaning.

Output a table: item, current, platform rule, change, priority. Say which guideline page each rule comes from and remind me to check its change log date. Do not claim the app will pass App Store or Play review.
```
