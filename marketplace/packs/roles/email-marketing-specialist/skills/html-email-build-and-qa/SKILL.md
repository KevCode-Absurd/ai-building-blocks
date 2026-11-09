---
name: html-email-build-and-qa
description: Builds and checks HTML email templates that render in Gmail, classic and new Outlook, Apple Mail and Yahoo, on phones and in dark mode, and work with screen readers. Uses table layouts with inline styles, live text, buttons built from code, alt text and a plain-text part, adds the client's platform merge tags and editable regions, and returns a test checklist. Use when a business needs a reusable template, a set of transactional templates, or a fix for an email that breaks in some inboxes.
---

# HTML email build and QA

Email HTML is not web HTML. Each inbox strips or ignores different code, and classic Outlook for Windows supports the least. A good template uses simple, proven structures, degrades gracefully, and is easy for the client to edit without breaking. This skill builds one and lists exactly what to test. It cannot send test emails, so the client runs the tests.

## When to use

- A new campaign or newsletter template in the client's brand.
- A set of transactional templates (order confirmation, shipping, booking, password reset, receipt) in one shared style.
- An email that looks broken in Outlook, Gmail on Android, or dark mode.
- An accessibility pass on existing templates.

## What you need

- **Copy and images:** final or sample copy, image files or their sizes, and the logo (SVG and PNG).
- **Brand:** colours (with hex codes), fonts and fallbacks, button style.
- **Platform:** the email tool (for example Klaviyo, Mailchimp, HubSpot, Kit) and whether templates are uploaded as code or built in a drag-and-drop editor with custom code blocks.
- **Audience inbox mix:** the platform's report of opens or clicks by email client, if it has one, to weight testing. Treat open-based client data as rough, because Apple Mail Privacy Protection preloads images.
- **Footer facts:** legal business name, postal address, unsubscribe and preference links as merge tags.

**Access:** level 1 to read your current templates; level 2 to save the template in your platform as a draft and send tests to your internal addresses; level 3 to replace a live template on the approved list.

## Steps

1. **Plan the blocks.** Preheader, header (logo), hero (headline, short text, button), content blocks (text, image and text, product grid of two at most on phones), call to action, footer. One column on phones. Keep the main action within the first screen on a phone.
2. **Check every feature before using it.** Look up any CSS or HTML feature on Can I email, especially for classic Outlook for Windows, Gmail apps and Outlook.com. If support is patchy, plan a fallback that still reads well.
3. **Build the structure.** Tables for layout (`role="presentation"` on layout tables so screen readers skip them), a fixed maximum width centred, inline styles on every element, and a small style block for media queries and dark mode where supported. Avoid relying on background images, web fonts or positioned elements for anything essential.
4. **Build buttons from code.** A table cell or link with padding and a background colour, not an image, so the button shows with images off. Make tap targets large enough for a thumb.
5. **Write live text.** Headlines and body as real text. Images only for pictures, each with alt text that says what matters ("Red waterproof jacket, front view"); decorative images get empty alt text.
6. **Handle dark mode.** Use a logo with a transparent background and an outline or version that shows on dark backgrounds; avoid pure black text on pure white images that will invert badly; test that brand colours keep enough contrast when inverted.
7. **Accessibility.** Set the language attribute; logical reading order; colour contrast that meets WCAG AA for body text; font size readable on phones; link text that says where it goes; no meaning carried by colour alone.
8. **Keep it lean.** Remove unused code and comments, compress images, and keep total HTML small, because Gmail clips long messages behind a "view entire message" link and the unsubscribe link may end up hidden.
9. **Add platform tags.** Merge tags for name and fallback ("Hi there" if no first name), editable regions named clearly for the client, the platform's unsubscribe and preference tags, and the postal address. Do not remove or hide the unsubscribe link.
10. **Write the plain-text part.** The same message in readable text with the main link written out.
11. **Write the test checklist.** Inboxes and views to check, every link, images off, dark mode, phone and desktop, and what to look for in each.

## Checks

- The email reads and makes sense with images turned off.
- The main action is a code button and appears in the first phone screen.
- Every image has suitable alt text; layout tables are marked as presentation.
- Contrast and font sizes are readable; nothing depends on colour alone.
- Footer has sender identity, postal address and a working unsubscribe tag.
- Merge tags have fallbacks; editable regions are labelled.
- No features used that Can I email shows as unsupported in a major client without a fallback.
- A plain-text part is included.
- The handoff says clearly what was not tested. At level 2 or 3 the agent sends the tests to internal addresses; otherwise the client runs them.

## Output format

1. **Block plan** with notes on what each block is for.
2. **The HTML file**, commented only where the client needs to edit.
3. **Plain-text version.**
4. **Editing guide:** which regions to change, image sizes, character guidance for headlines and buttons.
5. **Test checklist** as a table: client or view, what to check, pass or fail column for the client.
6. **Known limits** (for example, rounded corners will be square in classic Outlook).

## Example of good output (short)

*Illustrative structure, not a real business: a pottery studio sending a monthly class newsletter through Mailchimp. Copy the shape, never the content: every fact comes from the client's own context.*

**Button (extract)**

```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
  <tr>
    <td style="background-color:#2F5D50;border-radius:6px;">
      <a href="*|CLASS_URL|*" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:22px;color:#FFFFFF;text-decoration:none;font-weight:bold;">Book a Saturday class</a>
    </td>
  </tr>
</table>
```

**Test checklist (extract)**

| View | What to check | Pass? |
|---|---|---|
| Classic Outlook for Windows | Button shows as a solid block with readable text (square corners are fine) | |
| Gmail app, Android, dark mode | Logo visible; body text readable; button colour still has contrast | |
| Any client, images off | Headline, class dates and button all still readable | |
| Phone, any client | Button in the first screen; text at least as large as the client's body text | |

**Known limits:** rounded corners do not show in classic Outlook; the class photo is decorative, so its alt text is empty and the class name is in live text beside it.
