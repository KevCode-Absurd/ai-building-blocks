# Personal minds and task councils

Create profiles in **Compose → My minds** or **Minds → My minds**. Give a mind a name and purpose, describe its writing voice and working principles, list things to avoid, and paste writing samples. Two or three representative examples with specific style notes are a useful starting point. Run a small task with the downloaded profile, compare the result with those examples, then edit the profile.

Profiles are saved in this browser. Export a mind JSON file as a backup or to import on another device. Markdown and text uploads become samples to review and describe before saving; exported mind JSON preserves the full structured profile. PDF and Word files are not accepted. A standalone Markdown download gives an AI assistant the profile instructions.

Open a workflow task to find **Minds for this task**. Select one mind or up to six for a council. Two recommendations use source attribution first, then matching subject areas; a general reasoning perspective is used if no subject match is available. Personal minds are available as separate choices. The first selected mind sets the final writing voice.

The workflow ZIP includes every assigned mind's instructions under `skills/`, reimportable personal profiles under `minds/`, and a `TASK-COUNCIL.md` protocol when needed. Both `HANDOFF.md` and the task's skill name its council. Council members give separate initial views, challenge conflicting assumptions once, and produce one checked deliverable with unresolved dissent. The pack prepares instructions; council execution happens in the user's AI runner. A single runner can simulate the discussion; separate agents require runner support and the user's authorization.

Assignments and profiles survive local saves, editable workflow JSON, shared workflow links and task reordering. Legacy single-mind workflows continue to open. Only assigned personal profiles are included in a workflow pack or link; unrelated samples stay local. Sharing or downloading a workflow exposes its assigned profiles to anyone who receives it. Existing imported workflows keep their embedded profile snapshot.

The profile limits are twelve minds, with bounded fields and eight thousand characters of samples per profile. Import validation checks identifiers, lengths, types and collisions. Uploaded text is never installed or rendered as HTML. Writing examples are quoted as style references and do not supply factual evidence or authorize actions. Browser storage can be cleared; keep exported backups.

Validation: `site/test/custom-minds.test.mjs` and `site/e2e/custom-minds.spec.ts` cover profile validation, imports, excluded unrelated samples, complete downloads, a fresh browser importing an exported workflow, mobile selection and task reordering. Compose fixture tests cover the existing workflow packs and authentication UI; the independent voice tests cover Whisper.
