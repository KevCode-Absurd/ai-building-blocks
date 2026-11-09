---
name: business-profile-audit
description: Audits a Google Business Profile against Google's own guidelines (name, address or service areas, categories, hours, phone, website link, photos, services, posts and reviews), compares it with three nearby rivals, ranks the fixes by risk and impact, and writes the corrected profile text. Marks which fixes the owner makes, which need level 2 (drafted for approval) and which can be made at level 3 by a manager within limits. Use when a local business starts work with you, when calls from the profile drop, after a suspension scare, or before switching on Local Services Ads.
---

# Business Profile audit

The map listing is often a local firm's busiest shop window, and the most common problems are self-inflicted: a stuffed name, the wrong category, a visible home address, stale hours. This skill checks the profile against Google's rules first, then against nearby rivals, and turns the findings into a short, safe fix list.

Access levels for this skill: the audit needs only level 1 (screenshots, the public listing, a performance download). Business Profile has no read-only role and most edits go live after Google's review, so level 2 means drafting the changes in a document for the owner to approve and enter. Level 3 means a manager seat and making the agreed edits within the limits written in "Access I have". Changes to the name, address, primary category or phone number always need a fresh yes, because they can trigger re-verification.

## When to use

- First week with a new local client.
- Calls, direction requests or website clicks from the profile have dropped.
- The owner has had a suspension or a verification problem.
- Before Local Services Ads, a website rebuild or a move.

## What you need

- **Access I have:** level and limits, written down. Until the owner answers, level 1.
- Screenshots of the profile on a phone (Search and Maps), or a manager seat if granted.
- The real-world business name exactly as on signs and stationery.
- Services, prices or ranges, areas served, opening hours including holidays, and whether customers visit the premises.
- The last 6 to 12 months of performance data (download from the profile) [calls, directions, website clicks, bookings].
- Three nearby businesses customers compare you with.
- Any proof the owner can claim (licences, insurance, guarantees), so nothing is invented.

## Steps

1. **Eligibility and identity.** Confirm the business meets Google's eligibility (a place customers visit, or travel to customers) and is not a virtual office or mailing address. Check the name matches the real-world name with nothing added: no towns, services, taglines or phone numbers.
2. **Location model.** Storefront, service-area or hybrid? Service-area businesses that do not receive customers should hide the address and list service areas by town or postcode, at most 20 and within about two hours' drive. Hybrids may show both.
3. **Categories and services.** The primary category is what the business mainly *is*. Remove categories that are really services. Then list services with plain descriptions and prices or ranges where the owner agrees.
4. **Contact details.** Local phone number under the business's control; website link to the most relevant page, tagged with UTM parameters (source google, medium organic, campaign gbp); booking link if bookings are taken; text or WhatsApp options where the profile offers them.
5. **Hours.** Regular hours match the door and phone; holiday and special hours set for the next three months.
6. **Description.** Plain words: what you do, where, for whom, how fast, how you price. No promotional claims the owner cannot back.
7. **Photos.** Real work, the team, the premises or vans, before-and-after where relevant. Note gaps for a photo checklist.
8. **Posts.** Is anything posted in the last month? Plan a simple rhythm: one update or offer every week or two, offers with dates and terms, no phone numbers in the post text.
9. **Reviews.** Count, rating, monthly rate over the last six months, share replied to, and how specific the replies are. Hand any gaps to the review-request-and-reply-system skill.
10. **Rival comparison.** For the three rivals: primary category, review count and rating, photos, posts, services listed. Note where the client is behind and where the rival is breaking rules (do not copy those).
11. **Feature check.** Q&A may no longer appear on many profiles and its API was retired in November 2025; chat ended in July 2024. Do not plan work around features that are gone.
12. **If the profile is suspended.** Do not create a new profile for the same business. Fix what breaks the guidelines, then appeal once through Google's appeals tool with documents whose name and address match the profile, such as a business registration, licence or utility bill (Google's appeals help page, checked 2026-11-07: https://support.google.com/business/answer/4569145). Set the owner's expectations: Google emails the decision and gives no timeline.
13. **Rank the fixes.** First, anything that breaks the guidelines (risk). Then relevance fixes (category, services, description). Then completeness (photos, hours, posts). Then reviews.
14. **Write the fix list** with the access level each fix needs, and draft the corrected text.

## Checks

- Every finding names the guideline or help page it rests on.
- Name, address, category and phone changes are flagged as needing a fresh yes, and are not made while verification is pending.
- Nothing in the drafted text (licences, warranties, "best", years trading) is invented.
- Rival findings are facts from public listings, with the date checked.
- The UTM-tagged link is lowercase and uses the agreed naming.
- The action log records every edit made at level 3.

## Output format

1. **Snapshot:** the profile today in five lines, with the date.
2. **Rule check table:** item, current, rule, fix, risk (high, medium, low), access level.
3. **Rival comparison table.**
4. **Draft text:** description, services list, the first four posts.
5. **Fix order:** numbered, owner or agent, level, approval needed.
6. **What to watch:** the profile metrics to compare in 30 days.

## Example of good output (short)

*Illustrative structure, not a real business: a two-van plumbing firm. Copy the shape, never the content: every fact comes from the client's own context.*

**Snapshot (checked 3 Nov):** name "[Business] Bristol 24hr Emergency Plumber"; primary category "Plumber" plus seven service-type categories; owner's home address visible; no holiday hours; 41 reviews, 4.6 average, 9 replied to; last post in March.

| Item | Current | Rule | Fix | Risk | Level |
|---|---|---|---|---|---|
| Name | Town and service words added | Real-world name only | "[Business]" | High | Fresh yes, then owner or L3 |
| Address | Home address shown | Hide address if customers are not served there | Hide; set 12 postcode areas | High | Fresh yes, then owner or L3 |
| Categories | 8, mostly services | Few, specific, what the business is | Keep "Plumber"; move the rest to Services | Medium | L3 within limits, or owner |
| Hours | No holiday hours | Accurate hours, including special hours | Add Christmas and New Year hours | Medium | L3 within limits, or owner |
| Website link | Home page, untagged | Track profile visits | Boiler service page, tagged | Low | L3 within limits, or owner |

**Rivals:** the two firms above the client in the map pack show 120 and 86 reviews, both reply to most reviews, and both post monthly. One also has a stuffed name; we do not copy it.

**Fix order:** 1. Name and address (owner approves; fix before anything else). 2. Categories and services. 3. Holiday hours. 4. Tagged website link. 5. Review routine (review-request-and-reply-system skill). 6. Weekly post rhythm.

**What to watch:** calls and direction requests per week for the next 30 days against the previous 30, allowing for the season.
