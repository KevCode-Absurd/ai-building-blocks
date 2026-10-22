-- Keep historical anonymous jobs; all new AI jobs are owned by a verified account.
ALTER TABLE composer_jobs ADD COLUMN user_id TEXT;
CREATE INDEX IF NOT EXISTS composer_user_day ON composer_jobs(user_id, day);
