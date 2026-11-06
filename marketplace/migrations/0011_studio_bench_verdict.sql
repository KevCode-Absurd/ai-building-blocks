-- Studio test bench: how each bench draft did against the plain-AI draft for the same brief. Owner: studio module.
-- Written by runTestBench after both drafts exist. evaluation.compareWithBaseline judges the pair twice with the
-- order swapped, with a judge from a different provider than the agent's writer, and keeps its own 'baseline' score row.
-- verdict JSON:
--   {"status":"done","winner":"agent"|"baseline"|"tie","reasons":"...","judge_model":"openai:gpt-6.1-sol","avoided_provider":"anthropic","at":"..."}
--   {"status":"skipped","code":"daily_limit"|"judge_failed","at":"..."}   the bench result stands; it was not compared
-- NULL for failed runs and for rows written before this column existed.
ALTER TABLE studio_tests ADD COLUMN verdict TEXT CHECK (verdict IS NULL OR json_valid(verdict));
