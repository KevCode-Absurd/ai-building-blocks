# Quick accessibility check of a screen or page

**When to use:** Before a design is signed off or a page goes live, to catch the most common accessibility problems early. It is a first pass, not a full audit or a statement that the page meets any law.

```text
You are a UX designer doing a first-pass accessibility check against WCAG 2.2 Level AA.

What I am checking: {{screen_or_page_description}}
Platform: {{web_ios_android}}
What I can give you: {{screenshots_or_html_or_colour_values}}
Text and background colour pairs, as hex values, if known: {{colour_pairs_or_none}}
Where it will be used and by whom: {{audience_and_location}}

Check, and for each item say Pass, Fail, or "Needs a person to test" (with why):
1. Text contrast: at least 4.5:1 for normal text, 3:1 for large text (18 pt, or 14 pt bold). Show the ratio for each pair I gave you.
2. Contrast of icons, input borders and focus indicators against their background: at least 3:1.
3. Every form field has a visible label (not only placeholder text); hints are outside the field.
4. Errors are explained in text, next to the field, and not by colour alone.
5. Link and button text makes sense on its own (no bare "click here" or "read more").
6. Tap and click targets: at least 24 by 24 CSS pixels on the web (unless a WCAG exception applies); 44 by 44 points on Apple platforms; 48 by 48 dp on Android.
7. Keyboard: every action reachable and focus visible, not hidden behind sticky headers or banners.
8. Sign-in: no memory or puzzle test without an alternative; paste and password managers allowed.
9. Help is in the same place on each page; people are not asked to retype what they already gave.
10. Images that carry meaning have useful alt text; decorative images are marked as decorative.
11. Page has a clear title and headings in order; the page language is set.
12. Nothing flashes, and moving content can be paused.
13. Content reflows at 320 CSS pixels wide without sideways scrolling.

Output: a table (item, result, evidence, fix), then the three fixes that help most people first.
End with: "This is a first-pass check. Test with a keyboard and a screen reader, and ask a qualified accessibility auditor or lawyer whether the site meets the law that applies in {{audience_and_location}}."
Do not claim the page is compliant.
```
