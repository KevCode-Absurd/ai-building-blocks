# Layout Template Library

ASCII blueprints for all 9 themes at 1:1 square. Portrait (9:16) and landscape (16:9) use same zones, proportionally stretched.

---

## 1. URGENCY

```
+------------------------------------------+
|       BOLD HEADLINE (25%)                |
|       "LAST CHANCE: 30% OFF"             |
+------------------------------------------+
|                                          |
|          PRODUCT SHOT (20%)              |
|                                          |
+------------------------------------------+
|  COUNTDOWN / URGENCY GRAPHIC (15%)       |
+------------------------------------------+
|          CTA BUTTON (10%)                |
+------------------------------------------+
```

## 2. LIFESTYLE

```
+------------------------------------------+
|                                          |
|                                          |
|      HERO LIFESTYLE IMAGE (65%)          |
|      (product integrated, not hero)      |
|                                          |
|                                          |
+------------------------------------------+
|   "for the morning people" (15%)         |
+------------------------------------------+
|   CTA subtle (5%)                        |
+------------------------------------------+
```

## 3. SOCIAL PROOF

```
+------------------------------------------+
|  CUSTOMER PHOTO   |   "TESTIMONIAL       |
|     (30%)         |    QUOTE"            |
|                   |       (40%)          |
+-------------------+----------------------+
|   STAR RATING + ATTRIBUTION (10%)        |
+------------------------------------------+
|  PRODUCT (15%)    |  CTA (5%)            |
+------------------------------------------+
```

## 4. PROBLEM/SOLUTION

```
+----------------------+----+---------------+
|                      |    |               |
|   PROBLEM SIDE       | VS |  SOLUTION     |
|   (muted, grey)      |(5%)|  (vibrant)    |
|      (45%)           |    |     (45%)     |
|                      |    |               |
+----------------------+----+---------------+
|   PRODUCT + CTA (5%)                      |
+-------------------------------------------+
```

## 5. FEATURES/BENEFITS

```
+------------------------------------------+
|   HEADLINE (10%)                         |
+------------------------------------------+
| CALLOUT 1 |              | CALLOUT 2     |
|   (15%)   |              |    (15%)      |
|           |   PRODUCT    |               |
|           |   (40%)      |               |
| CALLOUT 3 |              | CALLOUT 4     |
|   (15%)   |              |    (15%)      |
+------------------------------------------+
|           CTA (5%)                       |
+------------------------------------------+
```

## 6. US VS THEM

```
+------------------------+--+----------------+
|      THEM              |VS|      US        |
|  (competitor, muted)   |  | (brand, vivid) |
|      (40%)             |  |      (40%)     |
|  - Feature X ✗         |  |  - Feature X ✓ |
|  - Feature Y ✗         |  |  - Feature Y ✓ |
|  - Feature Z ✗         |  |  - Feature Z ✓ |
|                        |  |                |
+------------------------+--+----------------+
|            CTA (10%)                       |
+--------------------------------------------+
```

## 7. FOMO

```
+------------------------------------------+
|   "12,400 WOMEN SWITCHED THIS MONTH"     |
|             (headline, 15%)              |
+------------------------------------------+
|                                          |
|      SOCIAL CONTEXT / CROWD (50%)        |
|      (notifications, counters,           |
|       trending badges)                   |
+------------------------------------------+
|  PRODUCT (15%)    |  "SELLING FAST" (10%)|
+------------------------------------------+
|            CTA (10%)                     |
+------------------------------------------+
```

## 8. EDUCATIONAL

```
+------------------------------------------+
|  HEADLINE: "How [product] works" (15%)   |
+------------------------------------------+
|                      |                   |
|     PRODUCT          |   1. Step one     |
|     (45%)            |   2. Step two     |
|                      |   3. Step three   |
|                      |   4. Step four    |
|                      |     (35%)         |
+----------------------+-------------------+
|            CTA (5%)                      |
+------------------------------------------+
```

## 9. ASPIRATIONAL

```
+------------------------------------------+
|                                          |
|                                          |
|                                          |
|      PRODUCT HERO (65%)                  |
|      (generous negative space)           |
|                                          |
|                                          |
|                                          |
+------------------------------------------+
|   "an elevated morning." (15%)           |
+------------------------------------------+
|                CTA (5%)                  |
+------------------------------------------+
```

---

## Cross-Ratio Notes

- 9:16 Portrait: stack zones vertically, preserve % of total canvas
- 16:9 Landscape: lay zones horizontally, preserve % of total canvas
- Some themes break at some ratios: Problem/Solution split-screen doesn't work at 9:16 without compromising clarity. Stack vertically instead ("before" top, "after" bottom).

## Common Failures

1. **Exceeding 30% text coverage** → Meta suppresses distribution. Cap hard.
2. **CTA too small to tap on mobile** → Keep CTA button minimum 88x44 px at 1x
3. **Product hidden in Social Proof** → Even at 15% zone, product must be identifiable
4. **No breathing room in Aspirational** → Negative space is 30-40% of canvas, not decorative
5. **Split at wrong axis in Problem/Solution** → Horizontal is default, vertical only if narrow canvas
