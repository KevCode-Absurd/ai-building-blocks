---
name: agent-tutor-review
version: 3
description: Spaced-repetition review sessions and retention tracking for subjects learned with the agent-tutor skill. Recall-first practice over lesson notes, adaptive FSRS-style interval scheduling (uncapped by default), honest retention verdicts, and a mixed mini-quiz per session. Use when the user wants to revise or practice old topics, check what they remember, or when the dashboard shows notes up for review.
license: MIT
---

# Agent Tutor — Review

Understanding decays. This skill runs recall-first review sessions and keeps the retention schedule honest.

**Vault root:** `OBSIDIAN_VAULT` env var, else `learning/` in the current workspace. All content under `<vault>/Learning/`.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## The schedule

Every lesson note carries a `review:` block in its frontmatter with the note's memory state:

```yaml
review:
  interval: 6      # current interval in days
  ease: 2.5        # multiplier applied on a solid recall
  due: 2026-08-28  # next review date
```

Scheduling is **FSRS-inspired and adaptive** — no fixed ladder and no ceiling. After each review, compute the next state:

| Verdict | Interval | Ease |
|---|---|---|
| **Solid** | `round(interval × ease)` | `+0.05`, up to `max_ease` |
| **Shaky but recoverable** | `round(interval × 1.2)` | `−0.2`, down to `min_ease` |
| **Gone** | reset to the initial interval | `−0.5`, down to `min_ease`; flag for re-study |

Defaults — overridable per learner with an optional `review_policy:` block in the learner profile:

```yaml
review_policy:
  scheduler: fsrs-inspired
  initial_interval: 1   # days after first learning / after a lapse
  ease: 2.5             # starting multiplier
  min_ease: 1.3
  max_ease: 3.5
  max_interval: null    # null = unbounded; set e.g. 365 to cap growth
  fuzz: true            # ±5% jitter on computed due dates so notes don't pile up on one day
```

Notes are never "done": a long interval just means the topic comes up rarely. Legacy notes whose `review:` field is a plain list (`[+1d, +3d, +7d]`) still work — take the last entry as the current interval with default ease, and migrate them to the block format at this review.

## Running a review session

1. Read the review queue from the dashboard:
   - **Markdown mode** (default): read `Learning/Dashboard.md` → **Up for review** section (notes whose next review date has passed).
   - **Html mode** (`output_format.dashboard: html` in the learner profile): read the `agent-tutor-state` JSON island at the top of `Learning/Dashboard.html`'s `<body>` — its `due_notes[]` entries (note, due date, interval) are the queue. Map each entry back to its actual note file under `Learning/<Subject>/notes/` (island labels are display names); the thin `Dashboard.md` hub is a signpost — never parse it. No `Dashboard.html` yet → the fallback below applies.
   - If the dashboard looks stale in either mode, scan `Learning/<Subject>/notes/*/` frontmatter directly — note `review:` frontmatter is always the scheduling authority.
2. **Recall first, always.** For each note: ask the user to explain the topic from memory *before* showing anything. ("Explain closures to me as if I'd never heard of them.")
3. Judge the recall against the note's key takeaways, then apply the schedule table:
   - **Solid** → apply the solid row.
   - **Shaky but recoverable** → show the key takeaways, have them re-explain; apply the shaky row only if the second attempt is clean, otherwise treat as gone.
   - **Gone** → mark for re-study: re-open the lesson, re-teach the gaps, apply the gone row (reset to the initial interval).
4. **Interleave**: mix topics from different phases/subjects in one session — interleaving is the point, don't review one phase in isolation.
5. End with a **mixed mini-quiz** (5–8 questions spanning everything reviewed today).
   - If an interactive quiz tool is available (e.g. pi's `quiz`), use it.
   - Otherwise run a chat quiz: one question at a time, wait for the answer, explain why the right option is right, track the score, report pass/fail vs 70% at the end.
6. Update each note's `review:` frontmatter, the Dashboard review queue, and append a session log entry (type `review`) to `Learning/<Subject>/logs/YYYY-MM-DD.md` with per-topic retention verdicts.

## Honesty rules

- Judge recall against the note's key takeaways, not against "close enough".
- Tell the user their actual retention state — "you've forgotten X entirely" is useful information.
- If more than half of a subject's notes fail review, say it plainly and propose a re-teach plan rather than patching holes.

## Dashboard maintenance

Keep the **Up for review** section current: one bullet per due note, sorted by due date:

```
- [[notes/03-closures]] — +7d interval, due 2026-08-24
```

Remove bullets after the review is logged. This list is what the tutor reads at session start, so it must be true.

**Html mode** (`output_format.dashboard: html` in the learner profile): the queue lives in `Dashboard.html` — the **Up for review** section and the `due_notes[]` of the island read in step 1. Update it at the end of the session by regenerating the html dashboard whole — a fresh island, overview and subject focus pages together, plus the thin `Dashboard.md` hub's counters, exactly the update-the-Dashboard moment every session ends with; never hand-patch the html.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Personal study planner](https://useaiblocks.com/skills/personal-study-notebook).
- The [Study review scheduler](https://useaiblocks.com/skills/study-review-scheduler). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
