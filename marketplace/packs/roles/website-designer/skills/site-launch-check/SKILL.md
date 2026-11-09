---
name: site-launch-check
description: Checks a Squarespace, Wix, Webflow or Framer site before it goes live or after a big change - domain and DNS plan, forms, page titles and descriptions, phone layout, WCAG 2.2 basics (contrast, alt text, labels, tap targets, keyboard), a Core Web Vitals baseline, cookie consent by visitor region (EU, UK, US), analytics and the 404 page. Returns a go or fix list with an owner and "how to verify" for each item, and a launch-day action list. Use before launch, a domain move or a redesign.
---

# Site launch check

Launches go wrong in small, boring ways: a form that emails nobody, a domain move that kills email, a banner that blocks nothing, a page titled "Home" in search results. This skill finds them before visitors do.

Access levels for this skill: the check needs level 1 (read: the preview or live site, settings screenshots). Fixes on unpublished pages or a staging version need level 2. Publishing fixes and turning off the site password need level 3, within the client's limits. DNS changes and domain connections always need a fresh yes, and buying a domain or plan stays with the client.

## When to use

- A new site before the password or "coming soon" page comes off.
- A domain move to a new builder.
- A redesign or new template on a live site.

## What you need

- **Access I have**: the level and limits per tool, written down. Until then, level 1.
- A preview link (a shared site password is fine; it is not an account login) or screenshots of every page on a phone and a desktop.
- The page list and main action per page.
- Where visitors live (US, UK, EU or elsewhere).
- A list of tags and scripts on the site: analytics, ads, chat, booking, maps, videos.
- A screenshot of the current DNS records if a domain is moving, and who hosts email.

## Steps

1. **Walk every page on a phone, then a desktop.** Does the main action show on the first screen? Any overlapping text, cut-off images, tiny buttons or menus that don't open? Note anything you could not see as "not checked".
2. **Forms.** Submit each form with a test entry. Does a confirmation show, does the email arrive at the right address, is the spam check on, and does the form say what happens to the data (link to the privacy notice)?
3. **Search basics.** Every page has a unique title and a one or two sentence description; URLs are readable; there is one clear heading per page; the 404 page helps people find their way. Google ignores the meta keywords tag, so don't spend time on it.
4. **Accessibility basics (WCAG 2.2 AA).** Text contrast 4.5:1 (3:1 for large text); buttons and form borders 3:1; alt text on meaningful images and empty alt on decorative ones; visible labels on every form field; link and button text that makes sense alone; tap targets at least 24 by 24 CSS pixels or well spaced; keyboard Tab reaches the menu, buttons and form fields in order, with a visible focus outline that isn't hidden by a sticky header; page language set. Run WAVE or the builder's checker, then check by hand, because automated tools find only some problems.
5. **Speed baseline.** Run PageSpeed Insights on the home page and one inner page. Record field Core Web Vitals if there is enough traffic (good: LCP 2.5 s, INP 200 ms, CLS 0.1 at the 75th percentile) and the lab results otherwise. Check the top image of each page is right-sized and not lazy-loaded, and no autoplay video or slider sits in the first screen without reason.
6. **Cookies and consent.** Open the site in a private window and list cookies set before any click. For EU and UK visitors: non-essential cookies must wait for consent; reject must be as easy to find as accept, on the first layer; no pre-ticked boxes; a link or icon lets visitors change their mind. Ask what every "essential" cookie does. On Squarespace, turn on the setting that restricts non-essential cookies until visitors accept, and remember it does not block every third-party cookie. For California, if the business meets a CCPA threshold and sells or shares data, a "Do Not Sell or Share My Personal Information" link is needed and Global Privacy Control must be honoured. Flag points for the client's adviser; don't rule on the law.
7. **Analytics.** After consent, check that a page view arrives in the client's analytics tool. Make sure the site's own visits by staff don't swamp small numbers.
8. **Domain and DNS plan.** Write the exact records to add or change from the builder's help page, and list the records to keep, especially MX records for email. Save a copy of the current records. Expect up to 24 to 48 hours. Applying the change needs a fresh yes, even at level 3.
9. **Legal pages and contact.** Privacy notice, cookie notice where needed, terms if selling, contact details and an accessibility contact. Point the client to their adviser for the wording.
10. **Rank and assign.** For each issue: page, problem, severity (blocks the main action, loses some visitors, cosmetic), owner, the access level the fix needs and how to verify.
11. **Launch (level 3, or the client).** Show the action list: fixes to publish, the password page to remove, and the DNS change if approved separately. Get one yes, act, re-check the live site and log each action. Stop on any error or warning.

## Checks

- Every page walked on a phone and a desktop; gaps listed as "not checked".
- Every form tested end to end.
- No legal ruling given; regional points phrased for the client's adviser.
- DNS plan lists records to keep and has a saved copy of the old ones.
- Every fix has an owner and a "how to verify".
- All actions within "Access I have" and logged.

## Output format

1. **Verdict**: go, go after fixes, or not ready, with the reason in one line.
2. **Fix list**: table of page, issue, severity, owner, level needed, how to verify.
3. **DNS plan** (if a domain moves): records to add, change and keep.
4. **Launch-day action list** and **after-launch checks** (forms, analytics, speed in two weeks).
5. **Not checked.**

## Example of good output (short)

*Illustrative structure, not a real business: a two-room physiotherapy clinic in England launching on Wix. Copy the shape, never the content: every fact comes from the client's own context.*

**Verdict:** go after fixes. One issue blocks bookings; one risks email.

| Page | Issue | Severity | Owner | Level | How to verify |
|---|---|---|---|---|---|
| Contact | Form sends to an old staff address | Blocks enquiries | Me | 3 | Test entry arrives at the front desk inbox |
| All | Analytics cookie set before consent | Consent risk | Me | 3 | Private window shows no analytics cookie before "Accept" |
| Home | White text on a pale photo, contrast 2.1:1 | Hard to read | Me | 2 then 3 | Contrast checker reads 4.5:1 or more |
| Domain | Plan to replace A records only; MX records for email kept | Email risk if wrong | Client approves, then me | Fresh yes | Email still arrives after the change |

**Not checked:** the booking tool's own pages and its cookies.
