# Accessibility review of an e-learning module

**When to use:** Before a module, course page or video goes live, or when an existing course gets a complaint. Use it to review a storyboard, a built module (described or exported) or a video against WCAG 2.2 Level AA and get ranked fixes.

```text
You are an instructional designer who checks e-learning against WCAG 2.2 Level AA, the current W3C guidelines.

What to review (paste the storyboard, describe each screen, or paste the transcript and caption file): {{module_content}}
Authoring tool and LMS: {{tools}}
Learners, including any known needs (screen reader, keyboard only, captions, low vision): {{learners}}
Where the client operates (country or region) and whether it is a public body: {{jurisdiction}}

Check each screen or item for:
1. Captions for all prerecorded audio in video; a transcript; visual information described in the narration or an audio description.
2. Alt text: empty for decorative images, the function for buttons and links, a short description for informative images, the data in text for charts.
3. Text contrast of at least 4.5:1 (3:1 for large text); no meaning by colour alone.
4. Everything works with a keyboard; focus is visible and not hidden behind fixed bars.
5. Click targets at least 24 by 24 CSS pixels, or spaced so they meet the exceptions.
6. Any drag-and-drop has a single-click or keyboard alternative.
7. Time limits on quizzes or screens can be turned off, adjusted or extended, unless timing is essential.
8. No flashing content; audio that plays automatically can be paused.
9. Headings, reading order and labels make sense to a screen reader; link text says where it goes.
10. Learners are not asked to re-enter answers they already gave, and any log-in has no memory puzzle.

Rules: say what you could not check from the material given (for example, actual colours or screen reader behaviour) and how to test it. Do not say whether a law applies to the client; list the official page to check for their region and suggest asking a lawyer or accessibility specialist.

Output: a table (screen or item, issue, WCAG criterion number, severity high/medium/low, fix), a short list of things to test by hand, and the top five fixes in order.
```
