-- Web pages a run step's model cited when it searched the web (core/models.ts webSearch). Owner: runner module.
-- sources: JSON [{ "url", "title" }], or NULL when the step did not search. Kept so a run that resumes after a
-- restart still lists every cited page in the draft's "Sources from web search" section.
ALTER TABLE run_steps ADD COLUMN sources TEXT;
