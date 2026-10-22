-- Read-only operator report after migration 0005. No user IDs, prompts or results.
SELECT
  COUNT(*) AS attempted_generations,
  COALESCE(SUM(status = 'done'), 0) AS completed_generations,
  COALESCE(SUM(status = 'failed'), 0) AS failed_generations,
  COALESCE(SUM(status = 'pending'), 0) AS pending_reservations,
  COUNT(DISTINCT user_id) AS accounts_with_attempts,
  COALESCE(SUM(user_id IS NULL), 0) AS historical_anonymous_attempts,
  ROUND(COALESCE(SUM(charge), 0), 6) AS estimated_provider_cost_and_reservations_usd,
  CASE WHEN SUM(status = 'done') >= 10000 THEN 'Review at 10000 completed generations'
       WHEN SUM(status = 'done') >= 5000 THEN 'Review at 5000 completed generations'
       ELSE 'Free launch; measure use and cost' END AS review_milestone
FROM composer_jobs;
