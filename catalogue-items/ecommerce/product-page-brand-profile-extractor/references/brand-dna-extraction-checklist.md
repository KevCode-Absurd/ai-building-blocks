# Brand DNA Extraction Checklist

Use this to validate a brand-dna profile before handing it downstream.

---

## Required Fields (skill fails without these)

- [ ] Product name
- [ ] Price
- [ ] Description (at least 50 words)
- [ ] Hero image URL
- [ ] At least 3 features
- [ ] At least 3 of 10 marketing intelligence elements
- [ ] 6-color palette with real hex codes
- [ ] Visual vocabulary (all 8 sub-fields)
- [ ] Top 3 recommended themes with reasoning

## Quality Checks

- [ ] Testimonials are real (copied from page, not invented)
- [ ] Hex codes are real (extracted from image, not guessed)
- [ ] Brand positioning is a sentence, not a single word
- [ ] USPs are specific, not generic ("high quality" fails)
- [ ] Emotional triggers are feelings, not features
- [ ] Recommended themes explain why, not just list

## Red Flags

- [ ] "Premium quality" as a USP → not specific, reject
- [ ] No testimonials but page has reviews → extraction failed, rerun
- [ ] Hex codes all feel wrong → likely pulled from wrong image, rerun
- [ ] 10 emotional triggers → too many, narrow to 3-5
- [ ] "All 9 themes recommended" → rank forcing rejected, pick 3

## Gaps to Flag

If missing, mark explicitly in the profile:
- No testimonials = "brand has weak social proof asset"
- No authority markers = "brand has no third-party credibility signals"
- No USPs = "brand has undifferentiated positioning"
- Weak objections handling = "brand's sales page doesn't address skepticism"

These are brand problems, not extraction failures. Surface them to the client.

## Handoff Signal

Profile is ready for downstream use when:
1. All required fields populated
2. All quality checks pass
3. Red flags addressed
4. Gaps flagged (if present)

Downstream skills that consume brand DNA:
- `/generate-ad` (needs color palette + visual vocabulary)
- `/layout-templates` (needs theme recommendation)
- `/ad-design-levers` (needs brand positioning)
- `/ad-copy` (needs USPs + testimonials + objections)
- `/creative-brief` (needs the full profile)
