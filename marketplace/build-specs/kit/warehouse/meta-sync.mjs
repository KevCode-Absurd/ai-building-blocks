// meta-sync.mjs: the daily Meta data pipeline. Plain code, no model, read-only token.
// Pulls ad-level daily insights for the last N days (default 7, because Meta's numbers keep moving
// for a few days) and writes one JSON-lines file per day to warehouse/data/meta_ads_daily/<date>.jsonl,
// replacing that day's file each time, so re-running is always safe.
//
//   META_READ_TOKEN=... META_API_VERSION=vNN.0 node warehouse/meta-sync.mjs --check
//   META_READ_TOKEN=... META_API_VERSION=vNN.0 node warehouse/meta-sync.mjs --days 7
//
// The token comes from the environment only (your host's secret store). It is never printed or written.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.AGENT_ROOT || path.resolve(HERE, "..");
const OUT = path.join(ROOT, "warehouse", "data", "meta_ads_daily");

export const FIELDS = [
  "date_start", "account_id", "account_currency", "campaign_id", "campaign_name", "adset_id", "adset_name", "ad_id", "ad_name",
  "spend", "impressions", "reach", "frequency", "clicks", "inline_link_clicks", "cpm", "ctr",
  "actions", "action_values", "video_play_actions", "video_thruplay_watched_actions",
  "video_p25_watched_actions", "video_p50_watched_actions", "video_p75_watched_actions", "video_p100_watched_actions",
];

const num = v => (v === undefined || v === null || v === "" ? 0 : Number(v));
const pick = (list, ...types) => { for (const t of types) { const hit = (list ?? []).find(a => a.action_type === t); if (hit) return num(hit.value); } return 0; };
// The job tag in an ad name ties the ad back to its creative job, for example "Spring hook A [job-0007]".
export const jobTag = name => (/\[(job-\d{4,})\]/.exec(String(name ?? "")) ?? [])[1] ?? null;

// One Meta insights row in, one flat warehouse row out.
export function flatten(r, pulledAt) {
  const purchases = pick(r.actions, "omni_purchase", "purchase", "offsite_conversion.fb_pixel_purchase");
  const value = pick(r.action_values, "omni_purchase", "purchase", "offsite_conversion.fb_pixel_purchase");
  return {
    date: r.date_start, account_id: r.account_id, currency: r.account_currency ?? null,
    campaign_id: r.campaign_id, campaign_name: r.campaign_name, adset_id: r.adset_id, adset_name: r.adset_name,
    ad_id: r.ad_id, ad_name: r.ad_name, job_id: jobTag(r.ad_name) ?? jobTag(r.adset_name) ?? jobTag(r.campaign_name),
    spend: num(r.spend), impressions: num(r.impressions), reach: num(r.reach), frequency: num(r.frequency),
    clicks: num(r.clicks), link_clicks: num(r.inline_link_clicks), purchases, purchase_value: value,
    add_to_cart: pick(r.actions, "omni_add_to_cart", "add_to_cart", "offsite_conversion.fb_pixel_add_to_cart"),
    video_3s_views: pick(r.actions, "video_view"), video_plays: pick(r.video_play_actions, "video_view"),
    thruplays: pick(r.video_thruplay_watched_actions, "video_view"),
    video_p25: pick(r.video_p25_watched_actions, "video_view"), video_p50: pick(r.video_p50_watched_actions, "video_view"),
    video_p75: pick(r.video_p75_watched_actions, "video_view"), video_p100: pick(r.video_p100_watched_actions, "video_view"),
    attribution: "account default (unified attribution setting)", pulled_at: pulledAt,
  };
}

async function getAll(url, fetchImpl) {
  const rows = [];
  for (let next = url, pages = 0; next && pages < 200; pages++) {
    const res = await fetchImpl(next);
    const body = await res.json();
    if (!res.ok || body.error) throw new Error(`Meta said: ${body.error?.message ?? res.status}`); // never echo the URL, it holds the token
    rows.push(...(body.data ?? []));
    next = body.paging?.next ?? null;
  }
  return rows;
}

export async function sync({ token, version, accounts, days = 7, today = new Date(), fetchImpl = fetch, write = true }) {
  const until = new Date(today.getTime() - 24 * 60 * 60 * 1000), since = new Date(until.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  const range = JSON.stringify({ since: since.toISOString().slice(0, 10), until: until.toISOString().slice(0, 10) });
  const pulledAt = new Date().toISOString(), byDay = {};
  for (const acct of accounts) {
    const q = new URLSearchParams({ level: "ad", time_increment: "1", time_range: range, fields: FIELDS.join(","), use_unified_attribution_setting: "true", limit: "500", access_token: token });
    for (const r of await getAll(`https://graph.facebook.com/${version}/${acct}/insights?${q}`, fetchImpl)) (byDay[r.date_start] ??= []).push(flatten(r, pulledAt));
  }
  if (write) {
    fs.mkdirSync(OUT, { recursive: true });
    for (const [day, rows] of Object.entries(byDay)) fs.writeFileSync(path.join(OUT, `${day}.jsonl`), rows.map(r => JSON.stringify(r)).join("\n") + "\n");
  }
  return byDay;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const token = process.env.META_READ_TOKEN, version = process.env.META_API_VERSION;
  if (!token || !version) { console.log("Set META_READ_TOKEN (from your host's secret store) and META_API_VERSION (the newest version in Meta's changelog)."); process.exit(2); }
  const limits = JSON.parse(fs.readFileSync(path.join(ROOT, "context", "limits.json"), "utf8"));
  const accounts = limits.ad_accounts ?? [];
  if (process.argv.includes("--check")) {
    const q = new URLSearchParams({ fields: "name,account_id,currency,timezone_name", access_token: token });
    const rows = await getAll(`https://graph.facebook.com/${version}/me/adaccounts?${q}`, fetch);
    console.log(rows.map(a => `${a.name}  act_${a.account_id}  ${a.currency}  ${a.timezone_name}${accounts.includes(`act_${a.account_id}`) ? "  (in limits.json)" : ""}`).join("\n") || "The token can see no ad accounts. Assign the ad account to the system user.");
  } else {
    const i = process.argv.indexOf("--days"), days = i > 0 ? Number(process.argv[i + 1]) : 7;
    const byDay = await sync({ token, version, accounts, days });
    console.log(`Wrote ${Object.keys(byDay).length} days, ${Object.values(byDay).reduce((t, r) => t + r.length, 0)} rows, to warehouse/data/meta_ads_daily/.`);
  }
}
