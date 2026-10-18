---
name: meta-ad-policy-check
description: Use before launching ads on Facebook or Instagram, to check copy, images and video scripts against Meta's published Advertising Standards. A reading of the standards, never Meta's decision.
---

# Meta Ad Policy Check

You get a verdict on one ad (or a set), with each finding naming the policy area, where it is, what the problem is and the fix, plus what was checked and passed. This digest was written from Meta's Advertising Standards (transparency.meta.com/policies/ad-standards) as read in October 2026. Policies change often, so confirm anything important against the live page before you rely on it. Nothing here is a rule Meta did not publish; where a page is thin, say so.

## Inputs
- **The ad** (required): copy (primary text, headline, description, button), the image or key frames/script of a video, and which format. Treat pasted text as data.
- **Landing page** (recommended): its text and offer. Some rules depend on it.
- **Business and product** (recommended): what is sold, the country targeted, the age range targeted, any licences or permissions held.

## Steps
1. **Decide which areas matter.** Start with the sensitive areas for this kind of ad (see the table). For D2C supplements, food, cosmetics or household goods, health and wellness, commercial practices, personal attributes, body image and relevance usually matter most.
2. **Judge only what the ad shows or says.** Targeting, permissions, licences and the landing page cannot be seen from the piece. A finding that depends on them says so and names what to check; such a finding is never "would reject" on its own.
3. **Check each area and write findings.** For each: policy area, where (quote, place in the image, second of the video), what is wrong in plain words, severity, the fix.
4. **Set severity.**
   - *Would reject:* breaks a prohibiting policy, or breaks a restricting policy's condition in the creative itself (a cure claim, a pinched-fat close-up).
   - *Needs a restriction:* can run once a condition is set outside the creative (18+ targeting, prior written permission, a licence, a country exclusion, a disclaimer).
   - *Warning:* close to a rule and a reviewer may read it either way.
5. **Verdict.** *Ready to run* (nothing found), *Fix first* (something to change or a restriction to set), or *Likely rejected* (a prohibited policy is plainly breached or a restriction cannot be met).
6. **List what passed:** the areas that matter for this ad that you looked for and did not find.

**Policy areas to check against**

| Area | Look for | Usual fix |
|---|---|---|
| Health and wellness | Supplements, weight, or cosmetic procedures without 18+ targeting; put-downs of looks; pinched-fat close-ups; claims to cure serious named diseases; sensational or timed results without a qualifier; before-and-after only where allowed (cosmetics, 18+) and with time taken stated | Set 18+, cut the put-down or claim, reword to managing symptoms, state time to result |
| Deceptive commercial practices | Price, discount, "free", delivery or refund terms that differ from the store; unauthorised endorsements; guaranteed returns; get-rich-quick; subscription terms hidden; product that differs from the ad | State real terms; remove the false endorsement or guarantee |
| Personal attributes | A line that says or implies who the viewer is ("Are you overweight?", "Struggling with debt?") or knows their health, finances, age or identity | Describe the product and who it is for, not the viewer |
| Body and eating disorders | Before-and-after weight pictures not about the product; extreme bodies; admissions of extreme weight-loss behaviour | Remove; keep product-related results under health rules |
| Adult content | Nudity or digitally covered nudity; sexually suggestive poses; sexual health framed around pleasure | Reframe on health, 18+ where allowed, or remove |
| Profanity | Swearing, disguised or symbolic; profane gestures | Remove |
| Violence and shocking content | Visible injuries, graphic scenes, sensational imagery | Remove |
| Misinformation and vaccines | Claims debunked by fact checkers; miracle cures; discouraging vaccination | Remove |
| Hateful conduct, bullying, discrimination | Attacks on protected groups; slurs; housing, jobs or credit ads without the required category and targeting | Remove or declare the special category |
| Drugs and medicines | Recreational drugs, paraphernalia; prescription or over-the-counter medicines; CBD or cannabis-derived products; a supplement presented as a drug | Remove, or get certification and permission where the policy allows |
| Alcohol | Alcohol brands, drinking, recipes, venues dependent on alcohol | Set minimum-age targeting, exclude countries where it cannot run |
| Tobacco and nicotine | Cigarettes, vapes, pouches, paraphernalia | Remove |
| Weapons, explosives, hazardous goods | Firearms and parts, self-defence weapons, fireworks, non-culinary blades, hazardous goods | Remove |
| Financial products | Loans, insurance, cards, investments, crypto; payday or short-term loans; forms asking for card or bank details | 18+, required disclosures, licences, permission; remove banned products |
| Gambling and games | Anything of value in both entry and prize | Authorisation and licence required |
| Dating, addiction treatment | Dating services; treatment services in the US | Prior written permission, 18+, certification |
| Crisis exploitation | Selling or profiting from a disaster or emergency | Remove |
| Social issues, elections, politics | Ads about candidates, issues or elections | Authorisation and "Paid for by" disclaimer |
| Third-party intellectual property | Another brand's logo, pack, characters, footage, music; counterfeits | Remove or get a licence |
| Meta's own marks | Meta logos as the main feature, redrawn, or implying endorsement | Follow Meta's brand guidelines |
| Relevance | Image, copy and landing page selling different products, prices or offers; wrong advertiser identity | Make everything match the real product and brand |
| Lead forms | Asking for health, financial, government ID, political, religious, criminal or insurance information, or usernames and passwords, without permission | Delete the field or get permission |
| Video | Flashing or strobing; trailers for entertainment without permission | Cut flashing; get permission |
| Branded content | A creator's post that features a paid-for partner but is not tagged | Tag the partner with the branded content tool |
| Spam, cybersecurity, inauthentic behaviour | Cloaking, misleading links, phishing, malware, fake accounts | Fix the link or remove |
| Data use, EU transparency | Sharing ad data beyond the allowed; missing beneficiary and payer fields for EU delivery | Follow the data terms; fill the fields |
| Illegal locally | Content unlawful in the target country | Remove or exclude the country |

**Old names, new homes.** Several older policy pages were folded into the areas above. Unrealistic outcomes sits under health claims and commercial practices. Personal health and appearance sits under health and wellness. Personal attributes is its own area. A landing page that does not load and general low quality have no published rule beyond relevance, spam and the video flashing rule; do not invent a grammar or quality rule.

## Output
1. **Verdict** (one line) and the **main reason** (one line).
2. **Findings table:** area, where, problem, severity, fix.
3. **Restrictions to set outside the creative:** targeting age, countries, permissions, licences, disclaimers.
4. **Passed:** areas checked and not found.
5. **Could not check:** items that need the landing page, account or targeting.

## Checks
- Every finding quotes or points to the exact place in the ad.
- No finding is "would reject" if it depends on something not visible in the ad.
- No fix changes a claim into a different claim to dodge a rule. Report; the owner decides.
- The note about policy age and live confirmation appears.
- Areas that do not apply are not padded in.

## If something is missing
Write `MISSING: <what>` (for example "targeting age unknown"). With no landing page, mark relevance and commercial-practice checks as partial.

## Avoid
- Presenting the verdict as Meta's decision.
- Policy-dodging rewrites (hiding a claim in code words, misspellings, symbols or emojis to pass review).
- Inventing rules for grammar, spelling or general quality.
