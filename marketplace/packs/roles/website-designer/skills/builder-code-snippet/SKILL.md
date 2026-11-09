---
name: builder-code-snippet
description: Writes small custom CSS or code-injection snippets for Squarespace, Wix, Webflow or Framer only when the builder's own settings can't do the job, and hands each one over complete - what it does, the plan it needs, exactly where to paste it, which pages it runs on, its cookie consent category, how to test it on a hidden page or staging, and how to undo it. Use for a small style fix, a third-party embed or tag, or structured data, never for features the builder doesn't support.
---

# Builder code snippet

Every snippet is a small debt: the builder won't support it, and the next template update may break it. So the first step is always to look for a setting that already does the job, and the last step is a note on how to remove it.

Access levels for this skill: writing the snippet needs level 1. Saving it switched off, or on a hidden test page or staging version, needs level 2. Turning it on for the live site needs level 3, within the client's limits. A tag that sends visitor data to a new third party needs the client's yes, because it changes what their privacy notice must say.

## When to use

- A style the builder's settings can't reach, such as one button colour on one page.
- Adding a third-party tool's script: chat, booking, analytics, an ad pixel, a form.
- Adding structured data or a verification tag.

Not for: rebuilding a feature the builder lacks (a members area, a custom checkout). Suggest a supported app or tool instead.

## What you need

- **Access I have**: the level and limits per tool, written down. Until then, level 1.
- Builder, version and plan. Squarespace code injection needs Core or a higher plan, and Squarespace support won't troubleshoot custom code. Wix custom code needs a published site with a connected domain. Webflow and Framer custom code sits in site or page settings.
- What should change, on which pages, with a screenshot.
- For third-party scripts: the vendor's own install instructions and what data the tool collects.

## Steps

1. **Look for a setting first.** Theme or site styles, block settings, the builder's integrations or apps. If one does the job, send the click path and stop.
2. **Pick the smallest place.** One page rather than the whole site; a code block or embed in one section rather than the site header. Squarespace has header, footer, lock page and order page areas; Wix places code in the head, body start or body end, on all or chosen pages, once per visit or on every page; Webflow places scripts in the head or before `</body>` for the site or one page; Framer adds scripts in Project Settings, on all or chosen pages.
3. **Write the snippet in full.** No "..." gaps. Add a first-line comment with the date, what it does and who added it. Use the builder's own class names only if they are stable; prefer adding your own class to an element where the builder allows it.
4. **Keep scripts light.** Load third-party scripts only on the pages that use them, use the vendor's async option, and never place them above the top image of a page if it can be avoided. Each script adds load time and a security dependency.
5. **Set the consent category.** Analytics, marketing and other non-essential tags must not run before consent for EU and UK visitors. Use the builder's code categories (Wix asks you to categorise code) or the consent tool's blocking method, and note the category in the handover.
6. **Test on a hidden page or staging (level 2).** Check the change on a phone and a desktop, check the editor still works, and check no new console errors. In Squarespace you can switch off scripts in the editor preview if a snippet breaks the editor.
7. **Turn it on (level 3).** Show the action list and limits, get a yes, add the snippet live, check the live page and log the action.
8. **Hand over.** Where it lives, what it does, how to undo it, and what to re-check after a template or builder update.

## Checks

- A built-in setting was checked first, and the reason it won't do is stated.
- The snippet is complete, commented and scoped to the fewest pages.
- The plan supports custom code, and the client knows the builder won't support it.
- Non-essential tags wait for consent.
- Undo steps are written and tested.
- No keys, passwords or tokens appear in the snippet; IDs that are public by design (such as an analytics measurement ID) are fine.

## Output format

For each snippet:
1. **What it does** in one sentence, and why a setting can't do it.
2. **Needs**: builder, plan and pages.
3. **Code**: complete, in a fenced block.
4. **Where to paste it**: the exact click path.
5. **Consent category**.
6. **Test**: steps and expected result.
7. **Undo**: steps.

## Example of good output (short)

*Illustrative structure, not a real business: a yoga studio on Squarespace 7.1, Core plan, that wants the "Book now" button on the Timetable page in its accent colour. Copy the shape, never the content: every fact comes from the client's own context.*

**What it does:** colours one button on one page. Site styles change every primary button, so a page-level snippet is smaller.

**Needs:** Squarespace Core or higher; Timetable page only.

```html
<!-- 2026-11-06: accent colour for the Book now button on Timetable only. Remove to undo. -->
<style>
  .sqs-block-button a[href="/book"] {
    background-color: #2F5D50;
    color: #FFFFFF;
  }
</style>
```

**Where to paste it:** the Timetable page settings > Advanced > Page Header Code Injection (this page only). Squarespace warns that code here can disappear if header transparency is turned off, so note that setting in the handover.

**Consent category:** none; it sets no cookies and sends no data.

**Test:** on a duplicate of the Timetable page, check the button colour on a phone and desktop, and that white text on #2F5D50 passes 4.5:1 contrast.

**Undo:** delete the snippet from Page Header Code Injection and save.
