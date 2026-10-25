# Sample output: `/video-editing`

Source: 3-minute raw talking-head recording. Target: 45-second Instagram Reel. Redacted.

---

## Edit Plan (Approved)

**Total duration:** 45s
**Platform:** Instagram Reel (1080x1920)
**Caption style:** Word-by-word burn-in
**Music:** "Slow Build to Peak" bed, -14 dB under dialogue

### Scene-by-Scene

| # | In | Out | Dur | Action | Caption | B-roll | Music |
|---|----|----|-----|--------|---------|--------|-------|
| 1 | 0:00 | 0:03 | 3s | Hook: "Stop running ads." | Word-by-word, bold | Direct to camera | Beat drop |
| 2 | 0:03 | 0:10 | 7s | Setup: Why 90% of ad budgets waste money | Phrase | Cut to dashboard screenshot | Sustain |
| 3 | 0:10 | 0:17 | 7s | Problem evidence: 62% CTR decay example | Phrase | Chart overlay | Sustain |
| 4 | 0:17 | 0:27 | 10s | Solution: Andromeda diversity framework | Word-by-word | Cut to 4-quadrant diagram | Build |
| 5 | 0:27 | 0:35 | 8s | Proof: Northwind Skincare case study number | Phrase | Before/after metric card | Peak |
| 6 | 0:35 | 0:42 | 7s | Payoff: What to do Monday | Word-by-word | Back to camera | Sustain |
| 7 | 0:42 | 0:45 | 3s | End card: CTA + logo | Static overlay | Logo bug animation | Tail |

[ANNOTATION: Every scene has a reason. Cut 1:15 of filler from source to hit 0:45.]

---

## B-roll Generated

2 clips via Veo, 3 pulled from library:
- Scene 2: Dashboard screenshot (library)
- Scene 3: Chart overlay animated (Veo-generated, 7s, cost $0.21)
- Scene 4: 4-quadrant diagram (Veo-generated, 10s, cost $0.31)
- Scene 5: Before/after metric card (Remotion-rendered from data, $0.00)

---

## QA Report

| Check | Status |
|-------|--------|
| Duration within ±1s | PASS (45.2s) |
| Hook delivers in first 2s | PASS |
| Captions legible at mobile thumbnail | PASS |
| No audio clipping | PASS (peak -2.1 dB) |
| No silent gaps >500ms | PASS |
| End card shows CTA 2+ seconds | PASS (2.8s) |
| Safe zones respected | PASS |
| Music under dialogue | PASS (-14 dB bed, -6 dB peaks) |
| Color consistent across cuts | PASS |

**Verdict:** PASS. Ready to publish.

---

## Cost Breakdown

| Line | Cost |
|------|------|
| Transcription | $0.02 |
| Scene analysis | $0.05 |
| Veo b-roll x 2 | $0.52 |
| Remotion render | $0.00 |
| **Total** | **$0.59** |

Under $2.00 budget ceiling. No alert.

---

## Delivery

- Final MP4: `vitareds-ad-stop-running-ads-45s.mp4`
- Published: Queued for 9am EST Wednesday via scheduler
- Cover: Generated via `/reel-cover` (title: "Stop Running Ads. Do This Instead.", accent: STOP)
- Caption copy + hashtags: Delivered in Slack thread

[ANNOTATION: Pipeline ends when the asset is queued and the cover is linked. No loose ends.]
