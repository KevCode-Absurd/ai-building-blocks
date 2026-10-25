# Video Editing Pipeline Diagram

End-to-end flow. Every box is an agent or a gate.

---

## Flow

```
┌─────────────────────────────┐
│  1. Slack Upload            │  User drops raw MP4 + context
│     (channel intake)        │  (platform, duration, caption style)
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  2. Video Analyzer          │  Gemini vision + transcription
│     (transcript, scenes,    │  Word-level timestamps
│      framing, energy)       │  Silence/filler detection
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  3. Scene Classifier        │  Tag scenes: Hook / Setup /
│     (role per scene)        │  Proof / Payoff / B-roll gap
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  4. Edit Plan Builder       │  Compose cut list +
│     (cut list, captions,    │  caption style +
│      b-roll, music)         │  b-roll slot assignments +
│                             │  music bed + beat-sync
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  5. ⛔ APPROVAL GATE        │  Slack thread
│     Human approves plan     │  ✅ / ✏️ / ❌
│                             │  No render without approval
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  6a. Scene Designer         │  Art-direct b-roll
│      (b-roll prompts)       │  prompts for Veo
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  6b. Veo Generator          │  Produce b-roll clips
│      (b-roll clips)         │  (only if library doesn't fill)
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  7. Caption Writer          │  Style captions
│     (word-by-word / phrase) │  to chosen format
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  8. Video Producer          │  Remotion render
│     (Remotion render)       │  Platform-specific specs
│                             │  Burned-in captions
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  9. QA Reviewer             │  Duration, hook, audio,
│     (pass/fail checks)      │  captions, safe zones,
│                             │  color, music mix
└──────────────┬──────────────┘
               │
           PASS│     FAIL
               │      │
               │      └──► Back to step 6 with notes
               ▼
┌─────────────────────────────┐
│  10. Cost Tracker           │  Per-job aggregation
│      (budget check)         │  Alert if >$2.00
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  11. Publish or Hand Off    │  Scheduler queue
│      (Slack thread deliver) │  or direct publish
└─────────────────────────────┘
```

---

## Where Humans Enter

| Stage | Human Role |
|-------|-----------|
| 1. Intake | Uploads + context |
| 5. Approval Gate | Approves/edits plan |
| 9. QA Fail | Reviews fix notes |
| 11. Publish | Final OK on scheduled post |

Only 4 human touchpoints. Everything else is agent-driven.

---

## Failure Modes & Recovery

| Failure | Where | Recovery |
|---------|-------|----------|
| Transcription garbled | Step 2 | Retry with higher-quality model; flag for human review if still garbled |
| Scene classifier over-cuts | Step 3 | Human adjusts in plan stage |
| B-roll generation timeout | Step 6b | Fall back to library; note gap in plan |
| Remotion render crash | Step 8 | Retry 2x; escalate to human if persistent |
| QA fail (audio clipping) | Step 9 | Auto-normalize and re-render |
| QA fail (caption illegibility) | Step 9 | Back to step 7 with size bump |
| Cost ceiling breach | Step 10 | Alert human before publish |

---

## Timing

| Stage | Typical Duration |
|-------|------------------|
| Intake | <30s |
| Analyze | 30-60s |
| Classify + plan | 30-60s |
| Approval wait | Human-paced |
| Produce | 2-4 min |
| QA | 30s |
| Publish queue | <10s |

End-to-end: 5-10 minutes of agent work + human approval time.
