---
name: video-editing
description: Full Slack-driven video editing pipeline. Upload, analyze, plan, approve, produce, QA, publish.
metadata:
  tags: video, editing, remotion, veo, slack, pipeline, qa, captions, scenes
---

# Video Editing Pipeline

You run a full video production pipeline: raw footage arrives in Slack, gets analyzed, planned, scene-classified, approved by a human, produced, QA'd, and published.

## How This Works

1. User uploads raw video(s) to a Slack channel
2. You analyze the video (Gemini vision + transcription)
3. You build an edit plan (cuts, captions, b-roll slots, music, pacing)
4. Human approves the plan in Slack
5. You produce the edit (Remotion + Veo for b-roll generation where needed)
6. You QA the output against the plan
7. You publish or hand off to scheduler

---

## STEP 1: Intake

User drops video in Slack. Required context:
- Target platform (Reel, TikTok, YouTube Short, LinkedIn)
- Target duration (15s, 30s, 60s, 90s)
- Creator voice (use-as-is, light edit, heavy structure)
- Caption style (word-by-word, phrase-by-phrase, none)
- Music vibe (energetic, chill, dramatic, none)

---

## STEP 2: Analyze

For each input video:
- Full transcript (word-level timestamps)
- Scene boundaries
- Speaker framing (tight, medium, wide)
- Energy curve per scene
- Silence/filler detection (ums, pauses, dead air)
- Visual interest scoring per 2-second window

---

## STEP 3: Edit Plan

Build a scene-by-scene plan:

| Scene | In | Out | Action | Caption | B-roll | Music |
|-------|-----|-----|--------|---------|--------|-------|
| 1 | 0:00 | 0:03 | Hook | Word-by-word | No | Energy up |
| 2 | 0:03 | 0:08 | Setup | Phrase | Cut to product shot | Sustain |
| 3 | 0:08 | 0:15 | Payoff | Word-by-word | No | Energy peak |
| ... | | | | | | |

Plan includes:
- Total duration
- Cut list (in/out timestamps)
- Caption timing and style
- B-roll slots (generated via Veo or selected from library)
- Music bed + beat-synced cut points
- End card (CTA, logo)

---

## STEP 4: Approval Gate

Post plan in Slack thread. Wait for:
- ✅ Approve as-is
- ✏️ Request changes (specific scene notes)
- ❌ Reject (start over)

Do not proceed to production without approval.

---

## STEP 5: Produce

Render via Remotion:
- Input: approved plan JSON
- Output: MP4, platform-specific specs (1080x1920 for Reels/Shorts, 1080x1080 for feed)
- Captions: burned-in, platform-safe zones respected
- B-roll: generated via Veo for missing footage, spliced at plan timestamps
- Music: beat-synced to cut points

---

## STEP 6: QA

Before delivery, check:
- [ ] Duration matches target ±1s
- [ ] Hook delivers in first 2s
- [ ] Captions legible at mobile size
- [ ] No audio clips >0 dB
- [ ] No silent gaps >500ms
- [ ] End card shows CTA for 2+ seconds
- [ ] Safe zones respected (top/bottom 240px clear of critical content)
- [ ] Music doesn't overpower dialogue (-12 dB typical)
- [ ] Color consistent across cuts

QA produces a pass/fail report. Fails trigger re-render with fixes.

---

## STEP 7: Publish or Hand Off

Options:
- Publish directly to platform (via scheduler integration)
- Drop final asset in Slack thread with caption copy + hashtags
- Push to content-engine for batch scheduling

---

## Agents in the Pipeline

| Agent | Role |
|-------|------|
| Video Analyzer | Transcription + scene detection |
| Scene Classifier | Tag scenes (hook, setup, payoff, b-roll gap) |
| Edit Plan Builder | Compose cut list + captions + b-roll slots |
| Scene Designer | Art-direct b-roll prompts for Veo |
| Veo Generator | Produce b-roll clips |
| Caption Writer | Style captions to chosen format |
| Video Producer | Remotion render |
| QA Reviewer | Pre-delivery checks |
| Cost Tracker | Per-job cost aggregation |

---

## Cost Model (per 30s edit)

| Line Item | Typical |
|-----------|---------|
| Transcription | $0.02 |
| Scene analysis | $0.05 |
| B-roll generation (2 clips via Veo) | $0.40 |
| Caption rendering | $0.00 |
| Remotion render | $0.00 (self-hosted) |
| **Total** | ~$0.47 |

Budget-safe ceiling per edit: $2.00. Alert if exceeded.

---

## Rules

1. Nothing renders without human approval on the plan.
2. Every scene has a reason (hook, setup, proof, payoff, CTA). If a scene doesn't earn its time, cut it.
3. Captions are burned-in, never relying on platform CC.
4. B-roll generation uses Veo only when library footage can't fill the slot.
5. QA gates the delivery. Fails block publish.
6. No em dashes in captions or end cards.
