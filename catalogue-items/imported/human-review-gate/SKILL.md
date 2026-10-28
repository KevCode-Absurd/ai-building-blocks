---
name: human-gate
description: "Runs the human-verification lane of an agent loop, and proves review happened before work is called done. Builds a single-file HTML review page, collects batched feedback as a structured artifact instead of chat prose, and runs a gate that refuses to close while a BLOCKER is open, the reviewer is unnamed, or nobody has reviewed at all. Use when a plan, spec, RFC, report, landing page, migration, or any irreversible action needs human sign-off before shipping, or on requests such as 'get sign-off', 'have someone check this', 'hold until reviewed', 'needs approval first'. NOT for making AI text sound human (use content-humanizer or behuman). NOT for reviewing code diffs (use md-review or code-reviewer)."
license: MIT
metadata:
  version: 1.0.0
  author: Alireza Rezvani
  category: engineering
  updated: 2026-08-09
---

# Human Gate

You are the part of the loop that refuses to let an agent mark its own homework.
Machine verification answers *"do the checks pass?"* — `engineering/agent-harness` does that.
This answers what no script can: **has a person looked at this, and are their objections
resolved?** Feedback becomes a machine-parseable artifact rather than a message — anchored,
severity-graded, countable — and a gate either passes or names what is still open.
**Before starting**, gather these four things: which artifact (`.md`/`.html`), who the named reviewer is (a
person, not "the team" — G3 enforces it), whether the work is reversible, and whether a human
is available now. Read `human-gate-context.md` first if it exists.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

**Makes it better (optional):**
- **A code change** (yours): a change to the code, with what it fixes and how it was checked.
- **A test report** (yours): what was tested, what passed, what failed and why.
- **A security report** (yours): the risks found in the code, ranked, each with a fix.
- **Your notes** (yours): what to keep, change or drop.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A test report** with the [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). Bring a code change, a codebase, a test report (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a document, a code change, a test report. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## The loop

```sh
# Set S to the scripts folder inside this skill folder, wherever you installed it.
# engineering/human-gate/... is the source repo's layout.
S=engineering/human-gate/skills/human-gate/scripts

python3 $S/human_gate.py open plan.md --launch   # build page, start round N → END YOUR TURN
python3 $S/human_gate.py status plan.md          # non-blocking: 0 clear·2 blocked·3 collect·4 none
python3 $S/human_gate.py collect plan.md --output json   # batch.v1 — apply every item
python3 $S/human_gate.py close plan.md           # exit 2 = NOT done
```

`human_gate.py --sample` runs the whole loop, refusals included, in ~1s. It drives
`review_page_builder.py` (Markdown/HTML → single-file anchored page that makes no network
request of its own and sanitizes reviewed HTML — `on*`, `javascript:`, `iframe` dropped) and
`feedback_parser.py` (sidecar → `batch.v1`, quotes checked against raw *and* rendered text).

## The sidecar

Feedback lands in `<artifact>.review.md`. The page exports it; anyone can also write it by hand
in any editor — which keeps this working over SSH and in CI. Worked example and JSON contract
are in `assets/`.

```markdown
<!-- human-gate:v1 target=plan.md round=1 -->
reviewer: reza

## BLOCKER b2
> We expect a 40% lift in activation.
No source, and it drives the whole plan. Cite it or cut it.
```

Severities **BLOCKER / MAJOR / MINOR / NIT** (matching `markdown-html/md-review`, from Google's
code-review guidance), plus **NOTE**, **APPROVE**, and **EDIT** — a replacement the reviewer
already wrote, as `- before:` / `+ after:` lines.

## Gate rules

| | Refuses to close when | | |
|---|---|---|---|
| **G1** | no round collected | **G4** | sidecar changed after the last collect |
| **G2** | a BLOCKER or MAJOR is open | **G5** | round cap exhausted → **escalate**, never pass |
| **G3** | no named reviewer | **G6** | waiver used without a recorded reason |
| **G7** | the round carries unresolved integrity problems — a mistyped severity silently downgrades to NIT, so a real blocker can be lost to a typo | | |

Overrides must be explicit — `close plan.md --waive "<reason>"` — but **G1 is never waivable**:
a waiver accepts objections a reviewer raised; it cannot stand in for review happening.

## Hard rules

1. **Never report done while `close` exits 2.** Say what is open instead.
2. **Never invent a reviewer name** to satisfy G3. No reviewer *is* the finding.
3. **Never paraphrase an EDIT's `after`** — verbatim, or a human was silently overruled. Apply
   it to whatever *generates* the artifact too, or it dies on the next build.
4. **Never block-poll for a human.** Hand over the path and end the turn; `open` detects a
   headless host. Rounds are capped and exhaustion escalates.
5. **Never auto-fetch and run unpinned code.** The richer editor at `petergyang/human-review`
   is opt-in, asked-first, and always pinned (`npx -y human-review@0.6.0`) — unpinned `npx -y`
   runs whatever was published most recently. Its `poll` blocks and it rewrites HTML in place,
   so wrap both. It changes the editor, never the gate. See `audit/human-review-2026-08/`.
6. **Never treat the review page as source of truth.** It is a viewing surface.

## Forcing questions
One at a time when scope is fuzzy: **Who, by name, signs off?** · **What would make them reject
it outright?** (name it before reading — Klein's pre-mortem) · **Is this reversible?** (if not,
require explicit APPROVE, not merely no blockers) · **The artifact or its generator?** (both) ·
**How many rounds is this worth?** · **Is a human available now?** (if not, hand over and stop).
Two consecutive NIT-only rounds means it is done — say so rather than opening a third.

## Related skills
**`engineering/agent-harness`** — machine verification; this is the human lane it lacks.
**`markdown-html/md-review`** — renders a code review *to* HTML, one-way; use when the agent
reviews, human-gate when a person does. **`engineering/grill-me`** — interrogates a plan before
an artifact exists. **`content-humanizer`**/**`behuman`** — human *voice*, not approval.

Reasoning lives in `references/` — human-in-the-loop canon, feedback batching, loop discipline.
Conceptual derivation of the batched-review pattern from
[`petergyang/human-review`](https://github.com/petergyang/human-review) (MIT © 2026 Peter Yang);
no upstream code is used — stdlib Python, no server, non-blocking, plus a gate upstream lacks.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Pull request review tracker](https://useaiblocks.com/skills/pull-request-reviewer).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
