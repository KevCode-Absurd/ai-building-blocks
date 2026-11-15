// Email and retention fixtures: E13 KraveBeauty Klaviyo audit, E14 Graza Black Friday emails,
// E15 Ritual retention flows.
import { csv, md, round, fact, check } from "./lib.mjs";

const pct = (a, b) => round(100 * a / b, 1) + "%";

// ---------------------------------------------------------------- E13 KraveBeauty, email audit (4+ signals)
export function E13() {
  const T = "E13", B = "KraveBeauty";
  const flows = [
    ["Welcome", 1, "10% code in email 1", 9200, 5610, 285, 690, 22080],
    ["Abandoned checkout", 3, "15% code in email 1", 6100, 3900, 610, 980, 26460],
    ["Browse abandonment", 1, "none", 4100, 2420, 131, 82, 2540],
    ["Post-purchase thank you and how to use", 2, "none", 5600, 3640, 336, 140, 4480],
    ["Win-back (120 days no order)", 1, "30% code", 3800, 1710, 76, 61, 1590],
  ].map(([flow, emails, offer, recipients, opens, clicks, orders, revenue]) => ({ flow, emails_in_flow: emails, offer, recipients, open_rate: pct(opens, recipients), click_rate: pct(clicks, recipients), placed_orders: orders, revenue, revenue_per_recipient: round(revenue / recipients, 2) }));
  csv(T, "klaviyo flows, last 60 days", B, "Klaviyo flow performance, 16 Sep to 14 Nov 2026, USD. There is no replenishment flow.", flows);
  csv(T, "abandoned checkout code use", B, "Shopify discount report for the abandoned checkout code, last 60 days.", [
    { metric: "Abandoned checkout flow orders", value: 980 },
    { metric: "Of those, orders using the 15% flow code", value: 402 },
    { metric: "Share of flow orders placed within 2 hours of the first email (before email 2)", value: "61%" },
    { metric: "Discount given through the flow code", value: "$1,870" },
  ]);
  const camp = [
    ["2026-09-18", "New: Mochi Berrier Moisture Cream", "Engaged 90 days", 41000, 23400, 1310, 310, 9300, 38, 0.05],
    ["2026-09-25", "Routine reset: 3 steps", "Engaged 90 days", 41500, 23900, 1120, 240, 7010, 41, 0.06],
    ["2026-10-02", "20% off everything", "Bought Oat So Simple 200 mL refill, 40 to 50 days ago", 2100, 1340, 160, 126, 3020, 6, 0.04],
    ["2026-10-02", "Your Oat So Simple is running low (no discount)", "Bought Oat So Simple 200 mL refill, 40 to 50 days ago", 2050, 1390, 520, 390, 13260, 3, 0.02],
    ["2026-10-09", "Why we only make a few products", "Engaged 90 days", 42000, 24800, 900, 150, 4300, 52, 0.07],
    ["2026-10-16", "Beet The Sun restock", "Engaged 90 days", 42300, 24600, 1480, 360, 7560, 36, 0.05],
    ["2026-10-23", "Founder note: slow down", "Engaged 90 days", 42600, 25100, 1020, 200, 5800, 44, 0.06],
    ["2026-10-30", "24 Carrot Retinal is here", "Engaged 90 days", 43000, 24900, 1640, 410, 12300, 40, 0.06],
    ["2026-11-06", "Early holiday sets", "All subscribers (includes 180 days unengaged)", 118000, 68400, 1890, 470, 16900, 410, 0.38],
    ["2026-11-12", "Holiday sets: last call for shipping", "All subscribers (includes 180 days unengaged)", 119000, 69000, 1700, 420, 15100, 450, 0.41],
  ].map(([date, name, segment, recipients, opens, clicks, orders, revenue, unsubs, gmailSpam]) => ({ send_date: date, campaign: name, segment, recipients, open_rate: pct(opens, recipients), click_rate: pct(clicks, recipients), placed_orders: orders, revenue, revenue_per_recipient: round(revenue / recipients, 2), unsubscribes: unsubs, gmail_spam_complaint_rate: gmailSpam + "%" }));
  csv(T, "klaviyo campaigns, last 60 days", B, "Klaviyo campaign export, USD. Open rates include Apple Mail Privacy Protection opens. Gmail spam rate from Google Postmaster Tools.", camp);
  fact(T, "refill_reminder_conv", round(390 / 2050 * 100, 1)); fact(T, "refill_discount_conv", round(126 / 2100 * 100, 1));
  csv(T, "list growth by source, last 60 days", B, "New email subscribers by source.", [
    { source: "Pop-up, 10% off first order", new_subscribers: 3500, share: "38%" },
    { source: "Checkout opt-in", new_subscribers: 4050, share: "44%" },
    { source: "Skin quiz", new_subscribers: 1650, share: "18%" },
  ]);
  csv(T, "product usage", B, "How long each size lasts at the directed use, from the brand's product team.", [
    { product: "Oat So Simple Water Cream 80 mL", lasts_days: 40 },
    { product: "Oat So Simple Water Cream 200 mL refill", lasts_days: 100 },
    { product: "Great Barrier Relief 45 mL", lasts_days: 60 },
    { product: "Matcha Hemp Hydrating Cleanser 120 mL", lasts_days: 60 },
    { product: "Beet The Sun SPF 40 50 mL", lasts_days: 30 },
  ]);
}

// ---------------------------------------------------------------- E14 Graza, Black Friday emails (3 signals)
export function E14() {
  const T = "E14", B = "Graza";
  csv(T, "email segments", B, "Klaviyo segment sizes on 14 Nov 2026.", [
    { segment: "Active subscribers (subscribe and save, already up to 19% off)", profiles: 18400 },
    { segment: "Repeat buyers, 2+ orders, not subscribed", profiles: 26100 },
    { segment: "  of which aged 45+ (from the post-purchase survey)", profiles: 9800 },
    { segment: "One-time buyers", profiles: 41200 },
    { segment: "Refill can buyers (bought a refill can in the last 6 months)", profiles: 7300 },
    { segment: "Subscribers who never bought", profiles: 64500 },
  ]);
  csv(T, "past email tests", B, "Klaviyo A/B tests from 2026, USD revenue per recipient.", [
    { test: "Founders' plain-text note vs designed email", month: "Jun 2026", segment: "Repeat buyers aged 45+", plain_text_rpr: 1.92, designed_rpr: 0.88, result: "plain text won" },
    { test: "Founders' plain-text note vs designed email", month: "Jun 2026", segment: "Repeat buyers under 45", plain_text_rpr: 0.71, designed_rpr: 0.79, result: "no clear winner" },
    { test: "Founders' plain-text note vs designed email", month: "Jun 2026", segment: "Subscribers who never bought", plain_text_rpr: 0.21, designed_rpr: 0.47, result: "designed won" },
    { test: "20% code vs no code (holdout)", month: "Black Friday 2025", segment: "Refill can buyers", plain_text_rpr: "", designed_rpr: "", result: "Order rate 9.1% with code, 8.8% without" },
    { test: "20% code vs no code (holdout)", month: "Black Friday 2025", segment: "One-time buyers", plain_text_rpr: "", designed_rpr: "", result: "Order rate 6.4% with code, 2.9% without" },
  ]);
  md(T, "owner black friday plan", B, `
# Black Friday plan from the owner (test data)

- Dates: Thursday 27 Nov to Monday 1 Dec 2026.
- Offer: 20% off sitewide with code BF20, sent by email only (the code is not on the site banner).
- Three emails: a tease on 25 Nov, the launch on 27 Nov, and a last call on 1 Dec.
- Hero products: "Drizzle" and "Sizzle" squeeze bottles, The Trio, refill cans, and the mayo.
- Margin note: subscriptions already save up to 19%. A subscriber who also uses BF20 on a one-time order pays less than our cost on some items.
- The owner's words: "Make them sound like us, not like every other Black Friday email."
`);
  fact(T, "plain_vs_designed_45plus", "1.92 vs 0.88");
}

// ---------------------------------------------------------------- E15 Ritual, retention flows (held-out, 3 signals)
export function E15() {
  const T = "E15", B = "Ritual";
  csv(T, "cancellations by renewal", B, "Share of a cohort that cancels at each renewal, Jan to Jun 2026 cohorts, all products. Renewal 1 is the first full-price charge after the 40% first-order offer.", [
    { renewal: "Renewal 1 (first full price)", cancel_rate: "31%", note: "Peaks on the day the renewal reminder with the full price lands" },
    { renewal: "Renewal 2", cancel_rate: "11%", note: "" },
    { renewal: "Renewal 3", cancel_rate: "8%", note: "" },
    { renewal: "Renewal 4", cancel_rate: "7%", note: "" },
    { renewal: "Renewal 5", cancel_rate: "6%", note: "" },
  ]);
  csv(T, "cancel reasons, last 90 days", B, "Reasons picked in the cancel flow (one per cancel).", [
    { reason: "Too expensive", share: "38%" }, { reason: "Have too much, need a break", share: "21%" },
    { reason: "Not sure it's working", share: "17%" }, { reason: "Switching brands", share: "9%" },
    { reason: "Pregnancy ended or life stage changed", share: "8%" }, { reason: "Other", share: "7%" },
  ]);
  const saves = [
    ["Women's Multivitamin 18+", 2400, "20% off next 2 months", 0.23, "Skip a month", 0.14],
    ["Perimenopause Health", 900, "20% off next 2 months", 0.12, "Skip a month", 0.44],
    ["Synbiotic+", 1100, "20% off next 2 months", 0.19, "Skip a month", 0.16],
    ["Prenatal", 700, "20% off next 2 months", 0.09, "Skip a month", 0.11],
  ].map(([p, n, a, ar, b, br]) => ({ product: p, cancel_attempts: n, offer_a: a, saved_a: round(100 * ar) + "%", offer_b: b, saved_b: round(100 * br) + "%" }));
  csv(T, "cancel flow save test, sep to oct 2026", B, "50/50 split test of the save offer shown in the cancel flow, by product.", saves);
  fact(T, "peri_skip_vs_discount", "44% vs 12%"); fact(T, "w18_discount_vs_skip", "23% vs 14%");
  csv(T, "past win-back test", B, "Win-back email with 30% off, sent to subscribers who cancelled 60 to 180 days ago, with a 10% holdout, Aug 2026, USD.", [
    { group: "Got the 30% off email", people: 27000, reactivated_within_30_days: "4.6%", revenue: 25700, discount_cost: 10300 },
    { group: "Holdout (no email)", people: 3000, reactivated_within_30_days: "3.4%", revenue: 2380, discount_cost: 0 },
  ]);
  check(4.6 - 3.4 < 1.5, "win-back lift is small");
  fact(T, "winback_incremental_points", 1.2);
  csv(T, "current lifecycle flows", B, "Klaviyo flows that touch subscribers today.", [
    { flow: "Order confirmation", trigger: "Each charge", note: "Same template for first and renewal orders" },
    { flow: "Renewal reminder", trigger: "3 days before each renewal", note: "Shows the new full price; no reason to stay, no skip link" },
    { flow: "Cancel confirmation", trigger: "On cancel", note: "" },
    { flow: "Win-back", trigger: "60 days after cancel", note: "30% off, one email" },
  ]);
  md(T, "store economics", B, `
# Store economics (test data)

- First order: 40% off the first month of a new subscription; renewals at full price.
- Full subscription prices: Women's Multivitamin 18+ $33, Prenatal $39, Synbiotic+ $54, Perimenopause Health $39.
- Gross margin: 72% of the price paid. Fulfilment about $3 per shipment.
- Active subscribers: about 210,000.
- The owner's words: "Cut churn without training everyone to wait for a discount."
`);
}
