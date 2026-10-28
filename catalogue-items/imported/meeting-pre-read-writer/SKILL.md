---
name: notion-meeting-intelligence
description: Prepare meeting materials with Notion context and Codex research; use when gathering context, drafting agendas/pre-reads, and tailoring materials to attendees.
metadata:
  short-description: Prep meetings with Notion context and tailored agendas
---

# Meeting Intelligence

Before you start: this skill uses Codex CLI and a Notion login (see step 0). Either may need a paid account or plan, so check yours first.

Prep meetings by pulling Notion context, tailoring agendas/pre-reads, and enriching with Codex research.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Your question** (yours): the decision or problem, and what a good outcome looks like.

**Makes it better (optional):**
- **Meeting notes** (yours): an agenda, notes or decisions from a meeting.
- **A plan** (yours): a dated plan: what to do, in what order, with a decision rule for each step.
- **A document** (yours): a finished document, such as a Word file, a PDF or a page of notes.

**Recommended steps before this one** (optional; do each once, then reuse what it makes):
1. **A plan** with the [Meeting agenda and cost planner](https://useaiblocks.com/skills/meeting-agenda-and-cost-planner). Bring your question, meeting notes (optional), a brief (optional).
2. This one.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for your question, meeting notes, a plan. They can attach files, paste the details, or share a file path your assistant can read. Offer the linked skills above when they help prepare that material. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Quick start
Tool names such as `Notion:notion-search` are the Notion connection's own tools (search, fetch, create page, update page). They only work after the connection in step 0 is set up.

1) Confirm meeting goal, attendees, date/time, and decisions needed.
2) Gather context: search with `Notion:notion-search`, then fetch with `Notion:notion-fetch` (prior notes, specs, OKRs, decisions).
3) Pick the right template via `reference/template-selection-guide.md` (status, decision, planning, retro, 1:1, brainstorming).
4) Draft agenda/pre-read in Notion with `Notion:notion-create-pages`, embedding source links and owner/timeboxes.
5) Enrich with Codex research (industry insights, benchmarks, risks) and update the page with `Notion:notion-update-page` as plans change.

## Workflow
### 0) If any MCP call fails because Notion MCP is not connected, pause and set it up:
1. Add the Notion MCP:
   - `codex mcp add notion --url https://mcp.notion.com/mcp`
2. Enable remote MCP client:
   - Set `[features].rmcp_client = true` in `config.toml` **or** run `codex --enable rmcp_client`
3. Log in with OAuth:
   - `codex mcp login notion`

After successful login, the user will have to restart codex. You should finish your answer and tell them so when they try again they can continue with Step 1.

### 1) Gather inputs
- Ask for objective, desired outcomes/decisions, attendees, duration, date/time, and prior materials.
- Search Notion for relevant docs, past notes, specs, and action items (`Notion:notion-search`), then fetch key pages (`Notion:notion-fetch`).
- If a research document from an earlier step is in the chat, use it as background and link it in the pre-read.
- Capture blockers/risks and open questions up front.

### 2) Choose format
- Status/update → status template.
- Decision/approval → decision template.
- Planning (sprint/project) → planning template.
- Retro/feedback → retrospective template.
- 1:1 → one-on-one template.
- Ideation → brainstorming template.
- Use `reference/template-selection-guide.md` to confirm.

### 3) Build the agenda/pre-read
- Start from the chosen template in `reference/` and adapt sections. Put them in this order: context and goals, agenda (each item with an owner and a time box), decisions needed, risks and open questions, research with sources, next steps.
- Include links to pulled Notion pages and any required pre-reading.
- Assign owners for each agenda item; call out timeboxes and expected outputs.

### 4) Enrich with research
- Add concise Codex research where helpful: market/industry facts, benchmarks, risks, best practices. "Codex research" means searching the web for sources and opening each one. If your AI cannot browse, skip this step and say so in the pre-read.
- Keep claims cited with source links; separate fact from opinion.
- Cite only a URL you actually opened in this session. Drop any figure you cannot link to a source you checked. Never write a number or quote from memory.

### 5) Finalize and share
- Add next steps and owners for follow-ups.
- If tasks arise, create/link tasks in the relevant Notion database.
- Update the page via `Notion:notion-update-page` when details change; keep a brief changelog if multiple edits.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Meeting agenda and cost planner](https://useaiblocks.com/skills/meeting-agenda-and-cost-planner). It takes the meeting notes.
- The [Meeting minutes and action tracker](https://useaiblocks.com/skills/weekly-meeting-actions-keeper). It takes the meeting notes.
- The [Notion wiki writer](https://useaiblocks.com/skills/notion-wiki-writer). It takes the meeting notes.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## References and examples
- `reference/` — template picker and meeting templates (e.g., `template-selection-guide.md`, `status-update-template.md`, `decision-meeting-template.md`, `sprint-planning-template.md`, `one-on-one-template.md`, `retrospective-template.md`, `brainstorming-template.md`).
- `examples/` — end-to-end meeting preps (e.g., `executive-review.md`, `project-decision.md`, `sprint-planning.md`, `customer-meeting.md`).
