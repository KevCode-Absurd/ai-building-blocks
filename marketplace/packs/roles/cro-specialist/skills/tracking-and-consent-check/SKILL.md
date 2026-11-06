---
name: tracking-and-consent-check
description: Checks that analytics, A/B testing and session-recording tools on a site respect consent in each region (EU GDPR and ePrivacy, UK, US CCPA) before they collect anything - lists every tag and tool, what fires before the banner is answered, Google Analytics consent mode settings, Microsoft Clarity consent and masking, cookie-wall and reject-button issues - and writes the fixes by region, without giving legal rulings. Use before adding a heatmap, recording or testing tool, before trusting analytics for a test, or when a client serves EU or UK visitors.
---

# Tracking and consent check

CRO depends on data, and data collected without valid consent is a legal risk and a measurement problem. This skill finds what each tool does before and after a visitor answers the consent banner, checks the settings that matter, and writes fixes by region. It is general guidance, not legal advice: the client should check the official guidance for each region or ask a qualified adviser.

## When to use

- Before installing a heatmap, session-recording or testing tool.
- When a site serves visitors in the EU or UK.
- Before a test whose results depend on analytics.
- When a vendor changes its consent rules (for example Microsoft Clarity's consent enforcement for the EEA, UK and Switzerland from 31 October 2025).

## What you need

**Access:** level 1 to read the site, tag manager, analytics and tool settings. Level 2 to write the fixes in a tag manager workspace or for the developer, unpublished. Changes to consent settings or to what fires before consent always need a fresh yes, even at level 3.

- The site URL and the regions its visitors come from.
- The consent banner or consent platform in use, and its settings.
- Tag manager access or a list of tags, and the analytics, testing and recording tools installed.
- The client's privacy notice.

## Steps

1. **List every tool.** Analytics, testing, heatmaps and recordings, chat, ads pixels. For each: who supplies it, what it does, and whether it stores or reads anything on the device.
2. **Check before-consent behaviour.** Load the site in a private window from each relevant region (or with region settings) and do not answer the banner. Note which requests and cookies appear. In the EU, the EDPB treats JavaScript that tells the browser to send information back as "gaining access" under Article 5(3) of the ePrivacy Directive, whether or not the information is personal data. Treat any such tool firing before consent as a finding, unless the client's adviser confirms an exemption.
3. **Check the banner.** Is rejecting as easy as accepting? Is content blocked until people accept (a cookie wall)? Are boxes pre-ticked? Is scrolling treated as consent? Can people withdraw as easily as they agreed? The EDPB's consent guidelines treat cookie walls, pre-ticked boxes and scrolling as invalid consent, and require easy withdrawal.
4. **Check Google Analytics consent mode.** Is it on? Basic mode (tags wait for consent) or advanced (tags load and send cookieless pings that Google uses for modelling)? Are defaults set by region? When analytics storage is denied, no analytics cookies should be set or read.
5. **Check Microsoft Clarity, if used.** Does the site pass a consent signal with the ConsentV2 API for EEA, UK and Swiss visitors? Without consent, Clarity runs with no cookies and a separate ID per page view. Masking mode: default "Balanced" masks numbers and email addresses; input boxes and drop-downs are masked in all modes; masked content is never uploaded; changes are not retroactive. Recommend strict masking on account, checkout and form pages.
6. **Check other recording and testing tools.** Ask each vendor how it handles consent and masking, and how it remembers which variant a visitor saw. Record the answer and the vendor's page.
7. **Check regional notes.** France: the CNIL allows audience measurement without consent only under strict conditions (publisher-only, anonymous statistics, no cross-site tracking), and does not mention recordings, heatmaps or A/B testing. UK: the Data (Use and Access) Act 2025 allows some low-risk uses without consent, in stages; confirm the ICO's current guidance. California: honour Global Privacy Control as an opt-out where the business is covered and the tool counts as selling or sharing; ask a qualified adviser.
8. **Write the fixes by region.** For each finding: what to change, where, who does it, and whether it needs a fresh yes.
9. **Note the effect on data.** If tools fire only after consent, results describe consenting visitors. Keep the banner unchanged during tests.
10. **Recheck after changes.** Repeat step 2 after the fixes go live.

## Checks

- Every tool is listed with its before-consent behaviour.
- Findings cite the official guidance they rest on.
- No legal rulings; the client is pointed to official guidance or a qualified adviser.
- No recommendation makes rejecting harder than accepting.
- Masking is checked before any recording is used.
- Consent changes are marked "fresh yes".

## Output format

1. **Summary:** the top three issues and their fixes.
2. **Tool table:** tool, purpose, fires before consent (yes or no), consent integration, masking, finding.
3. **Banner check:** reject, cookie wall, pre-ticked, scrolling, withdrawal.
4. **Fixes by region** with owner and approval.
5. **Effect on data** for tests and reports.
6. **Official guidance to read**, with links.

## Example of good output (short)

*Brightwell Dental is a made-up dental clinic with visitors from the UK and Ireland, used only to show the format.*

**Summary**
1. Clarity loads and records before the banner is answered, and no ConsentV2 signal is sent. Fix: load Clarity only after consent, or send the ConsentV2 signal from the banner.
2. Masking is "Relaxed" on the booking form page. Fix: set "Strict" for /book (inputs are masked anyway, but free-text notes appear on the confirmation page).
3. The banner has "Accept all" on the first screen and "Reject" only under "Settings". Fix: put "Reject all" next to "Accept all".

| Tool | Purpose | Fires before consent | Consent integration | Finding |
|---|---|---|---|---|
| Google Analytics 4 | Analytics | No (consent mode, basic) | Yes | OK |
| Microsoft Clarity | Recordings | Yes | No ConsentV2 call | Fix 1 |
| Booking widget | Bookings | Yes | Needed for the service | Ask vendor, note answer |

**Effect on data:** after the fixes, Clarity recordings and GA4 data cover consenting visitors only. The bookings test planned for next month will say so in its readout.

**Approval:** fixes 1 and 3 change consent behaviour, so they need the clinic's fresh yes before publishing.
