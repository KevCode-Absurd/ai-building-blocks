---
name: alt-text-and-media-descriptions
description: Writes text alternatives that give screen reader users the same information as everyone else. Covers alt text for product photos, blog and social images, logos, icons and images of text; long descriptions for charts, maps and infographics; captions and transcript notes; and audio description scripts timed to gaps in speech. Decides each image's job in its place (decorative, functional, informative, image of text, complex) with W3C's decision tree, works from the image itself only when the AI tool can see it and otherwise from the client's descriptions, and returns a table with character counts and flags. Use it for a batch of images, a report or PDF with charts, or a video that needs description.
---

# Alt text and media descriptions

## When to use

- A shop, blog or social feed has images with missing, file-name or keyword-stuffed alt text.
- A report, PDF or slide deck has charts, maps or infographics.
- A video carries meaning in its visuals (on-screen text, demonstrations, charts) that the soundtrack does not say.
- An audit flagged missing text alternatives, captions or audio description.

## What you need

1. The images, if the AI tool can view them, or a short description of each: what is in the shot and anything that matters (colour, text in the image, action).
2. Where each image appears and what that page or post is for. The same photo needs different words in different places.
3. For charts: the underlying data or a table, and the one point the chart makes.
4. For video: the transcript with timestamps, and the moments where important visuals appear.
5. The house term list (product names, colour names), so things are named the same way every time.

**Access:** level 1 to read pages, images and media; level 2 to save alt text and captions as drafts in the website platform or video host; level 3 to publish them on the pages and videos you name.

**Two modes.** If the client's AI can see the image, I describe from it and flag anything I am unsure of (a brand, a person's identity, small text). If it cannot, I work only from the client's descriptions and leave a row blank and flagged rather than guess. Either way, a person who knows the page checks the result in context before it goes live.

## Steps

### 1. Decide each image's job, in order

Use the W3C alt decision tree:
1. **Contains text?** If the same text is on the page, the image is decorative (empty alt). If the text has a function (an icon), describe the function. If the text appears nowhere else, put the text in the alt.
2. **Inside a link or button?** Say where it goes or what it does ("Search", "[Business] home"), not what it looks like.
3. **Adds meaning?** A simple photo or graphic gets a short description of that meaning. A chart or complex graphic gets short alt text plus the full information elsewhere on the page.
4. **Purely decorative?** Empty alt (`alt=""`), so screen readers skip it.
5. **Unclear?** Ask the client what the image is for.

### 2. Write informative alt text

- Start with the subject. Never "image of" or "picture of"; screen readers already say "image".
- Say what matters for this page. On a product page: the product, its colour, pattern and the detail the shopper is paying for. On a team page: the person's name and role if the caption does not say it.
- Keep it short: usually one sentence that is easy to hear in one go, with longer detail in the page text. Show the character count so the client can compare.
- No keyword stuffing. Search engines read alt text, but it is written for people.
- Do not describe a person's race, disability, age or body unless it matters to the page and the person would agree.

### 3. Write complex image descriptions

- Short alt: chart type, topic and the main point ("Bar chart: complaints fell each quarter in 2026, from 410 to 220.")
- Long description, on the page or linked next to the image: the axes and units, every data point or a table of them, the trend, and any notes or sources. A data table is often the best long description.
- For maps: what the map is for (a route, coverage area, locations) and the information a visitor needs in text, such as addresses.

### 4. Captions and transcripts

- Captions carry speech and important non-speech sound ("[door slams]", "[upbeat music]"), with speaker names when it is not clear who is talking.
- Check auto-captions word by word, especially names, numbers and product terms.
- Provide a transcript. A descriptive transcript also includes key visual information, which people who are Deaf and blind need.

### 5. Audio description scripts

- Find the gaps in speech from the timestamps.
- Describe only what the viewer needs and cannot get from the soundtrack: on-screen text, actions, charts, who has entered.
- Write in the present tense, short and neutral: "Maya opens the app. On screen: 'Order confirmed'."
- If the gaps are too short, recommend an extended description version, or adding the information to the narration in the next edit.

### 6. Check and deliver

Read every alt text aloud at an even pace. Check the term list. Count characters. Mark rows that need the client's check. At level 2 or 3, save or publish in the platform, then log each image updated.

## Checks

- One row for every image in the brief, with its job named.
- Decorative images have empty alt, not a missing attribute.
- Functional images describe the action or destination.
- Nothing is described that the image or brief does not show.
- Charts have their data in text somewhere on the page.
- Names and terms match the term list.
- Captions include non-speech sounds and speaker changes.
- Audio description lines fit their gaps.

## Output format

1. Image table: file or location, job (decorative, functional, informative, text, complex), alt text, character count, notes and flags.
2. Long descriptions under their own headings, with data tables.
3. Captions notes and transcript corrections, if media was in scope.
4. Audio description script: start time, end time, line.
5. Please check: rows where I was unsure or the brief was thin.

## Example of good output (short)

*Illustrative structure, not a real business: a shop that sells woollen blankets online. Copy the shape, never the content: every fact comes from the client's own context.*

> | File | Job | Alt text | Chars | Notes |
> |---|---|---|---|---|
> | moss-throw-sofa.jpg | Informative (product page) | Moss green herringbone throw folded over a grey sofa arm, with a knotted fringe | 80 | Fringe named because the copy sells it |
> | moss-throw-detail.jpg | Informative | Close-up of the herringbone weave and fringe knots | 50 | |
> | wave-divider.svg | Decorative | (empty) | 0 | Pattern line between sections |
> | logo-header.svg | Functional (link) | [Business] home | 20 | Says where the link goes |
> | sales-chart.png | Complex | Line chart: monthly orders, January to October 2026, peaking in October | 70 | Long description below; data table supplied by client |
>
> **Please check:** the photo "studio-team.jpg" was described as "three people at a loom". I have not named them; tell me if the caption names them.
