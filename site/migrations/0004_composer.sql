-- Reserve per-job cost atomically before provider calls. Deploy with the COMPOSER D1 binding.
CREATE TABLE IF NOT EXISTS composer_jobs (
  id TEXT PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  day TEXT NOT NULL,
  ip TEXT NOT NULL,
  charge REAL NOT NULL CHECK (charge >= 0),
  status TEXT NOT NULL,
  result TEXT
);
CREATE INDEX IF NOT EXISTS composer_day ON composer_jobs(day);
CREATE INDEX IF NOT EXISTS composer_ip_day ON composer_jobs(ip, day);
