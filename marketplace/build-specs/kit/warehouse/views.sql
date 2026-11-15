-- views.sql: the warehouse views every agent reads. DuckDB reads the daily JSON-lines files directly,
-- so there is no server to run on your computer: duckdb warehouse/store.duckdb < warehouse/views.sql
-- Hosted setups load the same files into Postgres tables with the same names and columns.

CREATE OR REPLACE VIEW ads_daily AS
  SELECT * FROM read_json_auto('warehouse/data/meta_ads_daily/*.jsonl', union_by_name = true);

CREATE OR REPLACE VIEW shop_orders_daily AS
  SELECT * FROM read_json_auto('warehouse/data/shop_orders_daily/*.jsonl', union_by_name = true);

CREATE OR REPLACE VIEW creative_register AS
  SELECT * FROM read_json_auto('warehouse/data/creative_register.jsonl', union_by_name = true);

-- One row per creative job: what it was (from the register) and how it did (from Meta).
CREATE OR REPLACE VIEW creative_performance AS
  SELECT a.job_id, r.process, r.title, r.concept, r.angle, r.hook, r.format, r.length_s, r.persona, r.model,
         min(a.date) AS first_day, max(a.date) AS last_day, count(DISTINCT a.ad_id) AS ads,
         sum(a.spend) AS spend, sum(a.impressions) AS impressions, sum(a.link_clicks) AS link_clicks,
         sum(a.purchases) AS purchases, sum(a.purchase_value) AS revenue,
         sum(a.purchase_value) / nullif(sum(a.spend), 0) AS roas,
         sum(a.spend) / nullif(sum(a.purchases), 0) AS cost_per_purchase,
         sum(a.link_clicks) / nullif(sum(a.impressions), 0) AS link_ctr,
         sum(a.video_3s_views) / nullif(sum(a.impressions), 0) AS hook_rate,
         sum(a.thruplays) / nullif(sum(a.video_3s_views), 0) AS hold_rate
  FROM ads_daily a LEFT JOIN creative_register r USING (job_id)
  WHERE a.job_id IS NOT NULL
  GROUP BY ALL;

-- Blended view: all Meta spend against all shop revenue, day by day (MER = revenue / ad spend).
CREATE OR REPLACE VIEW daily_blended AS
  SELECT s.date, s.orders, s.revenue AS shop_revenue, coalesce(m.spend, 0) AS meta_spend, m.purchases AS meta_purchases,
         s.revenue / nullif(m.spend, 0) AS mer,
         m.purchases - s.orders AS meta_minus_shop_orders
  FROM shop_orders_daily s
  LEFT JOIN (SELECT date, sum(spend) AS spend, sum(purchases) AS purchases FROM ads_daily GROUP BY date) m USING (date);
