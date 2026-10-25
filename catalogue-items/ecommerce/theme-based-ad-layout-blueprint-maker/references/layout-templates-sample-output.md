# Sample output: `/layout-templates`

Theme: Social Proof. Ratio: 1:1 Square. For VitaReds. Redacted.

---

## Layout Spec: Social Proof / Square / MOF

**Theme:** Social Proof
**Aspect ratio:** 1:1 (1080x1080)
**Product type:** Supplement / beverage powder
**Funnel position:** Middle (MOF) — validated, theme fits

---

## Primary Layout Blueprint

```
+------------------------------------------+
|  CUSTOMER PHOTO   |   "TESTIMONIAL       |
|     (30%)         |    QUOTE PULLED      |
|                   |    FROM REVIEW"      |
|                   |       (40%)          |
|                   |                      |
+-------------------+----------------------+
|   STAR RATING + ATTRIBUTION (10%)        |
+------------------------------------------+
|  PRODUCT SHOT (15%) |  CTA BUTTON (5%)   |
+------------------------------------------+
```

### Zone Allocations
| Zone | % of canvas | Purpose |
|------|-------------|---------|
| Customer photo | 30% | Faces drive trust |
| Testimonial text | 40% | Specific quote, not paraphrase |
| Attribution | 10% | Name, verified badge, rating |
| Product shot | 15% | Secondary to person |
| CTA | 5% | Small but high-contrast |

---

## Text Hierarchy Rules

| Element | Font weight | Case | Max words |
|---------|-------------|------|-----------|
| Pull quote | Regular or medium | Sentence case | 20 |
| Attribution | Medium | Sentence case | 6 |
| Rating | Bold | Numbers + icons | 2 ("4.7 ★") |
| Product name | Regular | Sentence case | 4 |
| CTA | Bold | Sentence case | 3 ("Try it today") |

Pull-quote gets the largest font. CTA the boldest. Attribution small but legible.

---

## CTA Rules

- Position: bottom-right corner
- Size: 5% of canvas area
- Color: brand accent (#D4A574 on cream)
- Contrast vs background: minimum 3:1 (currently 4.2:1, passes)
- Shape: rounded rectangle, not pill (signals trust over trend)

---

## Variations

### Variation 1: Single testimonial (standard)
- As blueprint above. 1 customer photo + 1 quote.
- Use when: you have one strong customer who represents the persona.

### Variation 2: Multi-proof grid (reversed)
- Customer zone becomes 3x2 grid of 6 photos (30% unchanged)
- Testimonial zone becomes shortened quote or "12,400 women switched"
- Use when: you don't have one killer customer, but you have volume.
- Sacrifices: depth of any single quote.

### Variation 3: In-use testimonial (minimal)
- Customer + product merged into one zone (45%)
- Quote stripped to 8-10 words
- Use when: you have an action shot of the customer using the product.
- Sacrifices: text clarity, but adds authenticity.

### Variation 4: Text-heavy (only if you have a great paragraph review)
- Testimonial zone grows to 55%
- Customer photo shrinks to 20%
- Use when: quote is genuinely compelling as prose (rare).
- Sacrifices: visual impact.

---

## Do / Don't

### Do
1. Use real customer photos. Stock kills trust.
2. Keep the quote under 20 words. Scrollers don't read paragraphs.
3. Show the star rating visually (stars > number) for scannability.

### Don't
1. Don't paraphrase the quote. Pull verbatim. Quotation marks prove authenticity.
2. Don't hide the product. Even at 15%, it must be clearly identifiable.
3. Don't use a generic headline like "Great product!" as the pull quote. Specific > general.

---

## Integration Notes

- Layout consumes output from `/ad-design-levers` for the 8 levers within each zone
- Layout feeds into `/generate-ad` as zone structure for AI generation
- Word count caps here match `/ad-copy` theme-specific limits. Don't exceed.
