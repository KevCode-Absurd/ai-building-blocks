# Generate-Ad Cost Matrix

Shared reference. Use to estimate generation budgets and pick the cheapest capable model.

---

## Generation Models

| Model | Cost/image | Resolution | When to Use |
|-------|-----------|-----------|-------------|
| Gemini 3.1 Flash (Nano Banana 2) | $0.036 | 1K | Default. Fast. Photorealistic. |
| Gemini 2.5 Flash | $0.039 | 1K | Fallback when 3.1 rate-limited. |
| Gemini 3 Pro (1K) | $0.036 | 1K | Same cost, use for complex compositions. |
| Gemini 3 Pro (4K) | $0.060 | 4K | Print/OOH only. Not needed for feed. |

## Edit Models (Auto-Routed)

| Edit Intent | Triggers On | Routed To | Cost |
|-------------|-------------|-----------|------|
| Text | text, font, spelling, headline, slogan, quote, word | REVE Fast Edit | $0.01 |
| Style | background, color, lighting, mood, remove, add, change scene | Gemini 2.5 Flash | $0.039 |

**REVE is 74% cheaper for text-only edits. Route automatically.**

## Cost Scenarios

| Scenario | Images | Edits | Total |
|----------|--------|-------|-------|
| 3 variations, no edits | 3 | 0 | $0.11 |
| 3 variations + 2 text edits each | 3 | 6 REVE | $0.17 |
| 3 variations + 2 style edits each | 3 | 6 Gemini | $0.35 |
| Full creative round: 6 variations + 3 edits + 2 ratios | 11 | 3 | $0.49 |
| Weekly production: 20 concepts x 3 variations | 60 | ~40 edits | $2.56 |

## Budget Planning

| Monthly Output | Cost | Designer Equivalent @ $80/hr |
|----------------|------|------------------------------|
| 60 images/mo | $2.50 | 5 hours (~$400) |
| 200 images/mo | $8 | 15 hours (~$1,200) |
| 500 images/mo | $20 | 35 hours (~$2,800) |
| 1,000 images/mo | $40 | 60 hours (~$4,800) |

AI image generation is ~100-150x cheaper per unit vs designer time. Use designer for taste, polish, and human-specific shots. Use AI for volume and iteration.

## Rate Limits (as of April 2026)

- Gemini 3.1 Flash: ~2 RPM per key, ~15 RPM on paid tier
- Gemini 2.5 Flash: ~10 RPM on paid tier
- REVE: ~30 RPM

If generation fails with rate-limit error, fallback chain:
1. Retry Gemini 3.1 Flash after 30 seconds
2. Failover to Gemini 2.5 Flash
3. If both fail, queue the job

## Cost Control Rules

1. Default to 3 variations, not 6. Ship the winner, then iterate.
2. Always edit before regenerating. An edit is cheaper than a new image.
3. Never generate at 4K unless the output is going to print. Feed doesn't need it.
4. Cache the brand DNA. Re-scraping on every generation wastes money.
5. Kill failed generations early. Don't auto-retry more than twice.
