-- =============================================================================
-- Conversion Tracking Audit Queries
--
-- Run these against your analytics warehouse (Supabase, BigQuery, Snowflake, etc)
-- to surface tracking gaps that human-eyeball auditing will miss.
--
-- Table assumptions:
--   pixel_events       (event_id, event_name, event_time, value, currency, user_id)
--   capi_events        (event_id, event_name, event_time, value, currency, user_id,
--                       has_email, has_phone, has_fbp, has_fbc, has_external_id)
--   shopify_orders     (order_id, customer_id, created_at, email, phone, total)
--   meta_attribution   (event_id, matched, match_quality, attribution_window)
--
-- Adapt names to your schema.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Query 1: Pixel-only Purchase events (no matching CAPI)
-- Finds purchases that fired the pixel but never sent a server event.
-- These are the highest-risk gap: every one is lost attribution.
-- -----------------------------------------------------------------------------
SELECT
  p.event_id,
  p.event_time,
  p.value,
  p.currency
FROM pixel_events p
LEFT JOIN capi_events c ON p.event_id = c.event_id AND c.event_name = 'Purchase'
WHERE p.event_name = 'Purchase'
  AND p.event_time >= NOW() - INTERVAL '7 days'
  AND c.event_id IS NULL
ORDER BY p.event_time DESC;


-- -----------------------------------------------------------------------------
-- Query 2: CAPI-only Purchase events (no matching pixel)
-- Finds purchases that sent server events but never fired the pixel.
-- Usually indicates pixel blocking (ad blocker, iOS ITP, Safari).
-- The CAPI event is doing the heavy lifting. Healthy if <30% of total.
-- -----------------------------------------------------------------------------
SELECT
  c.event_id,
  c.event_time,
  c.value,
  c.currency
FROM capi_events c
LEFT JOIN pixel_events p ON c.event_id = p.event_id AND p.event_name = 'Purchase'
WHERE c.event_name = 'Purchase'
  AND c.event_time >= NOW() - INTERVAL '7 days'
  AND p.event_id IS NULL
ORDER BY c.event_time DESC;


-- -----------------------------------------------------------------------------
-- Query 3: Dedup rate calculation (daily)
-- Calculates the deduplication rate for Purchase events over the last 30 days.
-- Target: >=90% every day. Drops below 70% are critical.
-- -----------------------------------------------------------------------------
WITH daily_events AS (
  SELECT
    DATE(event_time) AS day,
    COUNT(DISTINCT event_id) AS capi_total,
    COUNT(DISTINCT CASE WHEN p.event_id IS NOT NULL THEN c.event_id END) AS matched
  FROM capi_events c
  LEFT JOIN pixel_events p ON c.event_id = p.event_id
  WHERE c.event_name = 'Purchase'
    AND c.event_time >= NOW() - INTERVAL '30 days'
  GROUP BY 1
)
SELECT
  day,
  capi_total,
  matched,
  ROUND(matched::numeric / NULLIF(capi_total, 0) * 100, 1) AS dedup_rate_pct
FROM daily_events
ORDER BY day DESC;


-- -----------------------------------------------------------------------------
-- Query 4: EMQ parameter coverage audit
-- Calculates what percent of Purchase CAPI events include each identity parameter.
-- Use this to target the lowest-coverage parameter first.
-- -----------------------------------------------------------------------------
SELECT
  COUNT(*) AS total_events,
  ROUND(100.0 * SUM(CASE WHEN has_email THEN 1 ELSE 0 END) / COUNT(*), 1) AS email_pct,
  ROUND(100.0 * SUM(CASE WHEN has_phone THEN 1 ELSE 0 END) / COUNT(*), 1) AS phone_pct,
  ROUND(100.0 * SUM(CASE WHEN has_fbp THEN 1 ELSE 0 END) / COUNT(*), 1) AS fbp_pct,
  ROUND(100.0 * SUM(CASE WHEN has_fbc THEN 1 ELSE 0 END) / COUNT(*), 1) AS fbc_pct,
  ROUND(100.0 * SUM(CASE WHEN has_external_id THEN 1 ELSE 0 END) / COUNT(*), 1) AS external_id_pct
FROM capi_events
WHERE event_name = 'Purchase'
  AND event_time >= NOW() - INTERVAL '7 days';


-- -----------------------------------------------------------------------------
-- Query 5: CAPI lag detection
-- Flags CAPI events that arrived more than 5 minutes after the pixel event.
-- High lag breaks deduplication because Meta's matching window is tight.
-- -----------------------------------------------------------------------------
SELECT
  DATE(p.event_time) AS day,
  COUNT(*) AS events,
  ROUND(AVG(EXTRACT(EPOCH FROM (c.event_time - p.event_time))), 1) AS avg_lag_seconds,
  ROUND(
    percentile_cont(0.95) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (c.event_time - p.event_time))),
    1
  ) AS p95_lag_seconds,
  SUM(CASE
    WHEN EXTRACT(EPOCH FROM (c.event_time - p.event_time)) > 300 THEN 1 ELSE 0
  END) AS events_over_5min
FROM pixel_events p
INNER JOIN capi_events c ON p.event_id = c.event_id
WHERE p.event_name = 'Purchase'
  AND p.event_time >= NOW() - INTERVAL '14 days'
GROUP BY 1
ORDER BY 1 DESC;


-- -----------------------------------------------------------------------------
-- Query 6: Order-to-tracked-event reconciliation
-- Compares Shopify's purchase ledger to Meta's tracked event ledger.
-- Any order with no pixel AND no CAPI event is fully invisible to Meta.
-- This is the ultimate truth check.
-- -----------------------------------------------------------------------------
SELECT
  o.order_id,
  o.created_at,
  o.total,
  CASE WHEN p.event_id IS NOT NULL THEN 'yes' ELSE 'no' END AS pixel_fired,
  CASE WHEN c.event_id IS NOT NULL THEN 'yes' ELSE 'no' END AS capi_fired
FROM shopify_orders o
LEFT JOIN pixel_events p ON p.event_id = o.order_id::text AND p.event_name = 'Purchase'
LEFT JOIN capi_events c ON c.event_id = o.order_id::text AND c.event_name = 'Purchase'
WHERE o.created_at >= NOW() - INTERVAL '7 days'
  AND (p.event_id IS NULL OR c.event_id IS NULL)
ORDER BY o.created_at DESC;


-- -----------------------------------------------------------------------------
-- Query 7: Attribution match quality distribution
-- Bucketizes matched CAPI events by EMQ-like score if your warehouse stores it.
-- Helps spot sudden drops in match quality (correlates with fbc/fbp breaks).
-- -----------------------------------------------------------------------------
SELECT
  DATE(event_time) AS day,
  CASE
    WHEN match_quality >= 8.0 THEN 'healthy (8.0+)'
    WHEN match_quality >= 6.0 THEN 'degraded (6.0-7.9)'
    ELSE 'failing (<6.0)'
  END AS emq_bucket,
  COUNT(*) AS events
FROM meta_attribution
WHERE event_time >= NOW() - INTERVAL '30 days'
GROUP BY 1, 2
ORDER BY 1 DESC, 2;


-- -----------------------------------------------------------------------------
-- Query 8: Events missing critical identity fields
-- Per-event breakdown of which Purchase events are missing each EMQ field.
-- Useful for targeting which integration step broke and when.
-- -----------------------------------------------------------------------------
SELECT
  DATE(event_time) AS day,
  SUM(CASE WHEN NOT has_email THEN 1 ELSE 0 END) AS missing_email,
  SUM(CASE WHEN NOT has_phone THEN 1 ELSE 0 END) AS missing_phone,
  SUM(CASE WHEN NOT has_fbp THEN 1 ELSE 0 END) AS missing_fbp,
  SUM(CASE WHEN NOT has_fbc THEN 1 ELSE 0 END) AS missing_fbc,
  SUM(CASE WHEN NOT has_external_id THEN 1 ELSE 0 END) AS missing_external_id,
  COUNT(*) AS total
FROM capi_events
WHERE event_name = 'Purchase'
  AND event_time >= NOW() - INTERVAL '14 days'
GROUP BY 1
ORDER BY 1 DESC;


-- -----------------------------------------------------------------------------
-- Query 9: Duplicate event_ids
-- Same event_id sent twice from CAPI. Sometimes indicates a retry loop that
-- is inflating attribution or, worse, a coding bug generating non-unique IDs.
-- -----------------------------------------------------------------------------
SELECT
  event_id,
  COUNT(*) AS occurrences,
  MIN(event_time) AS first_seen,
  MAX(event_time) AS last_seen
FROM capi_events
WHERE event_name = 'Purchase'
  AND event_time >= NOW() - INTERVAL '7 days'
GROUP BY event_id
HAVING COUNT(*) > 1
ORDER BY occurrences DESC
LIMIT 50;


-- -----------------------------------------------------------------------------
-- Query 10: Tracked vs reported revenue reconciliation
-- Compares Shopify revenue to tracked-event revenue. Gap over 10% is a
-- symptom of tracking loss or dedup failure.
-- -----------------------------------------------------------------------------
SELECT
  DATE(created_at) AS day,
  SUM(o.total) AS shopify_revenue,
  COALESCE(SUM(c.value), 0) AS capi_revenue,
  ROUND(
    (SUM(o.total) - COALESCE(SUM(c.value), 0)) / NULLIF(SUM(o.total), 0) * 100,
    1
  ) AS revenue_gap_pct
FROM shopify_orders o
LEFT JOIN capi_events c ON c.event_id = o.order_id::text AND c.event_name = 'Purchase'
WHERE o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1 DESC;
