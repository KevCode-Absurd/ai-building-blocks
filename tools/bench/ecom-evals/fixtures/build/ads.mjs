// Paid ads fixtures: E04 Taylor Stitch Meta audit, E05 Ritual Meta audit, E06 Graza Meta check,
// E07 Fellow Google Ads, E08 KraveBeauty TikTok. Planted numbers are fixed; filler rows are seeded noise.
import { csv, md, rng, round, sum, split, fact, check, weeks } from "./lib.mjs";

const AGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

// Breakdown cells by campaign x format x age x gender. Overrides fix the spend and cost per purchase of
// a cell; the rest of the campaign's spend is spread over the other cells by weight.
function metaCells({ seed, campaigns, ageW, genderW, ageMult, genderMult, overrides, noise = 0.12 }) {
  const r = rng(seed), rows = [];
  for (const c of campaigns) {
    const cells = [];
    for (const [fmt, fw] of Object.entries(c.formats))
      for (const age of AGES) for (const [g, gw] of Object.entries(genderW)) {
        const aw = (c.ageW ?? ageW)[AGES.indexOf(age)];
        if (!aw) continue;
        const o = overrides.find(x => x.campaign === c.name && x.format === fmt && x.age === age && x.gender === g);
        cells.push({ fmt, age, g, w: fw * aw * gw, o });
      }
    const fixed = sum(cells.filter(x => x.o).map(x => x.o.spend));
    const free = cells.filter(x => !x.o);
    const spends = split(c.spend - fixed, free.map(x => x.w));
    free.forEach((x, i) => { x.spend = spends[i]; });
    for (const x of cells) {
      const spend = x.o ? x.o.spend : x.spend;
      if (spend < 40) continue;
      const cpa = x.o ? x.o.cpa : c.cpa * ageMult[AGES.indexOf(x.age)] * (genderMult[x.g] ?? 1) * (1 + (r() * 2 - 1) * noise);
      const aov = x.o?.aov ?? c.aov * (1 + (r() * 2 - 1) * 0.05);
      const purchases = Math.max(0, Math.round(spend / cpa));
      const cpm = c.cpm * (1 + (r() * 2 - 1) * 0.1);
      const impressions = Math.round(spend / cpm * 1000);
      const ctr = (c.ctr ?? 0.012) * (1 + (r() * 2 - 1) * 0.2);
      rows.push({ campaign: c.name, ad_format: x.fmt, age: x.age, gender: x.g, spend, impressions,
        link_clicks: Math.round(impressions * ctr), purchases, purchase_value: round(purchases * aov) });
    }
  }
  return rows;
}

function campaignTotals(rows, campaigns) {
  return campaigns.map(c => {
    const rs = rows.filter(x => x.campaign === c.name);
    const spend = sum(rs.map(x => x.spend)), purchases = sum(rs.map(x => x.purchases)), value = sum(rs.map(x => x.purchase_value));
    const impressions = sum(rs.map(x => x.impressions)), clicks = sum(rs.map(x => x.link_clicks));
    return { campaign: c.name, type: c.type, days_live: c.days, spend, impressions, reach: Math.round(impressions / c.freq), frequency: c.freq,
      link_clicks: clicks, ctr_link: round(100 * clicks / impressions, 2) + "%", cpm: round(1000 * spend / impressions, 2),
      purchases, purchase_value: round(value), cost_per_purchase: round(spend / purchases, 2), roas: round(value / spend, 2) };
  });
}

function seg(rows, f) {
  const rs = rows.filter(f), s = sum(rs.map(x => x.spend)), p = sum(rs.map(x => x.purchases));
  return { spend: s, purchases: p, cpa: round(s / p, 2) };
}

// ---------------------------------------------------------------- E04 Taylor Stitch, Meta audit (4+ signals)
export function E04() {
  const T = "E04", B = "Taylor Stitch";
  const campaigns = [
    { name: "ASC | All products", type: "Advantage+ shopping", days: 120, spend: 96000, cpa: 74, aov: 188, cpm: 16, freq: 2.4, formats: { "single image": 0.30, carousel: 0.20, video: 0.35, catalog: 0.15 } },
    { name: "Prospecting | Jackets", type: "Sales, broad", days: 75, spend: 38000, cpa: 82, aov: 214, cpm: 14, freq: 1.9, formats: { "single image": 0.3, carousel: 0.3, video: 0.4 } },
    { name: "Prospecting | Shirts and chinos", type: "Sales, broad", days: 75, spend: 26000, cpa: 88, aov: 152, cpm: 13, freq: 1.8, formats: { "single image": 0.4, carousel: 0.3, video: 0.3 } },
    { name: "Retargeting | 30d visitors and engagers", type: "Sales, retargeting", days: 300, spend: 22000, cpa: 34, aov: 176, cpm: 31, freq: 11.8, ctr: 0.02, formats: { "single image": 0.3, carousel: 0.3, catalog: 0.4 } },
    { name: "Catalog | Viewed not bought", type: "Catalog sales", days: 300, spend: 12000, cpa: 41, aov: 181, cpm: 24, freq: 6.2, ctr: 0.016, formats: { catalog: 1 } },
    { name: "Test | New creative", type: "Sales, broad", days: 12, spend: 6000, cpa: 120, aov: 170, cpm: 12, freq: 1.3, formats: { "single image": 0.5, video: 0.5 } },
  ];
  const overrides = [
    { campaign: "ASC | All products", format: "single image", age: "65+", gender: "women", spend: 2600, cpa: 40, aov: 206 },
    { campaign: "Prospecting | Shirts and chinos", format: "single image", age: "65+", gender: "women", spend: 1300, cpa: 44, aov: 198 },
    { campaign: "ASC | All products", format: "video", age: "65+", gender: "women", spend: 1500, cpa: 165 },
    { campaign: "ASC | All products", format: "carousel", age: "65+", gender: "women", spend: 700, cpa: 118 },
  ];
  const rows = metaCells({ seed: 404, campaigns, ageW: [0.07, 0.25, 0.28, 0.20, 0.12, 0.08], genderW: { men: 0.82, women: 0.18 },
    ageMult: [1.5, 1.05, 0.95, 0.95, 1.0, 1.15], genderMult: { women: 1.25 }, overrides });
  const tot = campaignTotals(rows, campaigns);
  const metaPurch = sum(tot.map(t => t.purchases));
  const w65single = seg(rows, x => x.gender === "women" && x.age === "65+" && x.ad_format === "single image" && !x.campaign.startsWith("Retarg") && !x.campaign.startsWith("Catalog"));
  const w65video = seg(rows, x => x.gender === "women" && x.age === "65+" && x.ad_format === "video");
  const prosp = seg(rows, x => !x.campaign.startsWith("Retarg") && !x.campaign.startsWith("Catalog"));
  check(w65single.cpa < 0.6 * prosp.cpa, "women 65+ single image must stand out");
  // Accidental look-alike cells: no other prospecting cell with $800+ spend may beat 0.75 x prospecting CPA.
  for (const x of rows) if (!x.campaign.startsWith("Retarg") && !x.campaign.startsWith("Catalog") && !(x.gender === "women" && x.age === "65+") && x.spend >= 800)
    check(x.spend / x.purchases > 0.75 * prosp.cpa, `look-alike cell ${x.campaign} ${x.ad_format} ${x.age} ${x.gender}`);
  fact(T, "meta_purchases", metaPurch); fact(T, "women65_single", w65single); fact(T, "women65_video", w65video); fact(T, "prospecting", prosp);
  fact(T, "campaigns", tot.map(t => ({ c: t.campaign, spend: t.spend, p: t.purchases, cpa: t.cost_per_purchase, roas: t.roas })));

  csv(T, "meta ads manager campaigns, 16 Oct to 14 Nov 2026", B, "Meta Ads Manager export, 7-day click 1-day view, USD.", tot);
  csv(T, "meta breakdown by format, age and gender, 16 Oct to 14 Nov 2026", B, "Meta Ads Manager breakdown export, USD.", rows);

  // Shopify orders tagged by Meta UTM, new vs returning, same 30 days. Overall about 65% of Meta's count.
  const retShare = { "ASC | All products": 0.41, "Prospecting | Jackets": 0.17, "Prospecting | Shirts and chinos": 0.19, "Retargeting | 30d visitors and engagers": 0.78, "Catalog | Viewed not bought": 0.55, "Test | New creative": 0.15 };
  const match = { "ASC | All products": 0.66, "Prospecting | Jackets": 0.68, "Prospecting | Shirts and chinos": 0.67, "Retargeting | 30d visitors and engagers": 0.58, "Catalog | Viewed not bought": 0.63, "Test | New creative": 0.7 };
  const shop = tot.map(t => { const o = Math.round(t.purchases * match[t.campaign]), ret = Math.round(o * retShare[t.campaign]);
    return { utm_campaign: t.campaign, orders: o, new_customer_orders: o - ret, returning_customer_orders: ret, net_sales: round(o * t.purchase_value / t.purchases * 0.97) }; });
  const shopTotal = sum(shop.map(s => s.orders));
  shop.push({ utm_campaign: "(all other sources: email, organic, direct, search)", orders: 2210, new_customer_orders: 610, returning_customer_orders: 1600, net_sales: 401000 });
  csv(T, "shopify orders by utm campaign, 16 Oct to 14 Nov 2026", B, "Shopify orders report grouped by UTM campaign, net of discounts, before returns, USD.", shop);
  fact(T, "shopify_meta_orders", shopTotal); fact(T, "match_rate", round(shopTotal / metaPurch, 3));
  const rt = shop.find(s => s.utm_campaign.startsWith("Retarg")); fact(T, "retargeting_returning_share", round(rt.returning_customer_orders / rt.orders, 2));

  const ads = [
    ["UGC | Year six Jack | video", "ASC | All products", "video", "Paused 2026-10-24 in creative refresh", 31000, 517, "1.9%"],
    ["Static | Gift for him | single image", "ASC | All products", "single image", "Active", 9800, 178, "1.3%"],
    ["Founder | Buy less, buy better | video", "ASC | All products", "video", "Active", 22400, 290, "1.1%"],
    ["Carousel | Fall layers", "ASC | All products", "carousel", "Active", 18100, 231, "1.2%"],
    ["Static | Long Haul Jacket | single image", "Prospecting | Jackets", "single image", "Active", 14200, 168, "1.0%"],
    ["Video | Long Haul in the rain", "Prospecting | Jackets", "video", "Active", 19800, 231, "1.3%"],
    ["Carousel | The Jack in 9 colours", "Prospecting | Shirts and chinos", "carousel", "Active", 11900, 128, "1.1%"],
    ["Meme | Chore coat vs fast fashion | single image", "Test | New creative", "single image", "Active", 2400, 6, "4.1%"],
    ["Video | Restitch the classics", "Test | New creative", "video", "Active", 2100, 16, "1.2%"],
    ["DPA | Viewed not bought", "Catalog | Viewed not bought", "catalog", "Active", 34000, 840, "1.6%"],
  ].map(([ad, campaign, format, status, spend, p, ctr]) => ({ ad, campaign, format, status, spend_90d: spend, purchases_90d: p, cost_per_purchase_90d: round(spend / p, 2), ctr_link: ctr }));
  csv(T, "meta ads by spend, last 90 days", B, "Meta ad-level export, last 90 days, USD.", ads);
  fact(T, "paused_winner_cpa", round(31000 / 517, 2)); fact(T, "meme_cpa", 400);

  const wk = weeks("2026-11-09", 6);
  csv(T, "asc weekly trend", B, "Weekly Advantage+ shopping campaign trend, USD.", wk.map((w, i) => ({ week_starting: w,
    cost_per_purchase: [63, 66, 68, 79, 86, 92][i], cpm: [13.1, 13.4, 13.9, 14.6, 15.8, 16.9][i], frequency: [2.0, 2.1, 2.1, 2.2, 2.3, 2.4][i] })));

  csv(T, "returns by product, last 90 days", B, "Shopify returns report, last 90 days. Free returns on every US order.", [
    { product: "Long Haul Jacket", units_sold: 2140, units_returned: 728, return_rate: "34%", top_return_reason: "Fit: boxy or too big (58% of its returns)" },
    { product: "The Jack (shirt)", units_sold: 5310, units_returned: 637, return_rate: "12%", top_return_reason: "Colour not as expected" },
    { product: "Democratic Foundation Chino", units_sold: 3020, units_returned: 483, return_rate: "16%", top_return_reason: "Waist size" },
    { product: "Ojai Chore Coat", units_sold: 1460, units_returned: 204, return_rate: "14%", top_return_reason: "Changed mind" },
    { product: "Fisherman Sweater", units_sold: 980, units_returned: 88, return_rate: "9%", top_return_reason: "Changed mind" },
  ]);

  md(T, "store economics", B, `
# Store economics (test data)

- Average order value on Shopify, last 90 days: $188 before returns.
- Gross margin: 62% of net sales after returns.
- Outbound shipping: $9.50 per order. Free shipping and free returns on every US order.
- Each return costs $11 in return postage plus $4 to inspect and restock. A returned item is a lost sale.
- New customers place 0.6 more orders on average in the next 12 months.
- Meta budget: $200,000 a month. The owner will not raise it this quarter.
- Black Friday (27 Nov) and the December gifting peak are next.
`);
}

// ---------------------------------------------------------------- E05 Ritual, Meta audit (held-out, 3 signals)
export function E05() {
  const T = "E05", B = "Ritual";
  const campaigns = [
    { name: "ASC | Women's 18+", type: "Advantage+ shopping", days: 200, spend: 60000, cpa: 46, aov: 19.8, cpm: 15, freq: 2.2, formats: { "single image": 0.35, carousel: 0.2, video: 0.45 } },
    { name: "Prospecting | Prenatal", type: "Sales, broad", days: 150, spend: 34000, cpa: 58, aov: 23.4, cpm: 17, freq: 1.9, ageW: [0.10, 0.55, 0.32, 0.03, 0, 0], formats: { "single image": 0.3, carousel: 0.2, video: 0.5 } },
    { name: "Prospecting | Synbiotic+", type: "Sales, broad", days: 90, spend: 28000, cpa: 49, aov: 32.4, cpm: 14, freq: 1.8, formats: { "single image": 0.4, carousel: 0.2, video: 0.4 } },
    { name: "Launch | Perimenopause Health", type: "Sales, broad", days: 40, spend: 26000, cpa: 71, aov: 23.4, cpm: 16, freq: 2.0, ageW: [0, 0.05, 0.25, 0.45, 0.22, 0.03], formats: { "single image": 0.30, carousel: 0.25, video: 0.45 } },
    { name: "Retargeting | Site visitors 14d", type: "Sales, retargeting", days: 300, spend: 12000, cpa: 29, aov: 24.1, cpm: 27, freq: 7.4, ctr: 0.019, formats: { "single image": 0.5, carousel: 0.5 } },
  ];
  const overrides = [
    { campaign: "Launch | Perimenopause Health", format: "carousel", age: "45-54", gender: "women", spend: 4200, cpa: 38 },
    { campaign: "Launch | Perimenopause Health", format: "video", age: "45-54", gender: "women", spend: 6000, cpa: 96 },
  ];
  const rows = metaCells({ seed: 505, campaigns, ageW: [0.12, 0.34, 0.27, 0.15, 0.08, 0.04], genderW: { women: 0.93, men: 0.07 },
    ageMult: [1.3, 1.0, 0.95, 1.0, 1.1, 1.2], genderMult: { men: 1.6 }, overrides });
  const tot = campaignTotals(rows, campaigns);
  const peri = seg(rows, x => x.campaign.startsWith("Launch"));
  const w45car = seg(rows, x => x.campaign.startsWith("Launch") && x.age === "45-54" && x.gender === "women" && x.ad_format === "carousel");
  check(w45car.cpa < 0.6 * peri.cpa, "45-54 carousel must stand out");
  fact(T, "perimenopause", peri); fact(T, "w45_carousel", w45car);
  fact(T, "w45_video", seg(rows, x => x.campaign.startsWith("Launch") && x.age === "45-54" && x.gender === "women" && x.ad_format === "video"));
  fact(T, "campaigns", tot.map(t => ({ c: t.campaign, spend: t.spend, p: t.purchases, cpa: t.cost_per_purchase, roas: t.roas })));
  csv(T, "meta ads manager campaigns, 16 Oct to 14 Nov 2026", B, "Meta Ads Manager export, 7-day click 1-day view, USD. Purchase value is the first order only, after the 40% first-order offer.", tot);
  csv(T, "meta breakdown by format, age and gender, 16 Oct to 14 Nov 2026", B, "Meta Ads Manager breakdown export, USD.", rows);

  csv(T, "ads with delivery status", B, "Meta ad-level export, last 30 days, USD.", [
    { ad: "Carousel | What's inside, ingredient by ingredient", campaign: "Launch | Perimenopause Health", format: "carousel", status: "Active", spend: 6100, purchases: 141, primary_text_start: "Nine ingredients. Each one traced. Here is what each one is for*" },
    { ad: "Video | Dr. explains the formula", campaign: "Launch | Perimenopause Health", format: "video", status: "Active", spend: 9800, purchases: 108, primary_text_start: "Our scientist walks through the study design" },
    { ad: "Static | Say goodbye to hot flashes", campaign: "Launch | Perimenopause Health", format: "single image", status: "Rejected: unacceptable health claims", spend: 0, purchases: 0, primary_text_start: "Say goodbye to hot flashes and night sweats for good" },
    { ad: "Static | Balance your hormones naturally", campaign: "Launch | Perimenopause Health", format: "single image", status: "Rejected: unacceptable health claims", spend: 0, purchases: 0, primary_text_start: "Balance your hormones naturally, no HRT needed" },
    { ad: "Video | Menopause symptoms gone", campaign: "Launch | Perimenopause Health", format: "video", status: "Rejected: unacceptable health claims", spend: 0, purchases: 0, primary_text_start: "Treats the symptoms of menopause in 4 weeks" },
    { ad: "Static | Traceable ingredients", campaign: "ASC | Women's 18+", format: "single image", status: "Active", spend: 14800, purchases: 330, primary_text_start: "Know what's in it and where it's from" },
    { ad: "Video | No fishy burps", campaign: "ASC | Women's 18+", format: "video", status: "Active", spend: 19900, purchases: 410, primary_text_start: "The multivitamin built for people who read labels" },
    { ad: "Video | Prenatal, 12 essential nutrients*", campaign: "Prospecting | Prenatal", format: "video", status: "Active", spend: 15600, purchases: 262, primary_text_start: "Support for you and baby*, from trying to third trimester" },
    { ad: "Static | Gut health, simplified*", campaign: "Prospecting | Synbiotic+", format: "single image", status: "Active", spend: 10900, purchases: 236, primary_text_start: "3-in-1 prebiotic, probiotic and postbiotic*" },
  ]);
  md(T, "account quality notice", B, `
# Account quality (test data)

- 3 ads rejected in the last 30 days under the health claims policy, all in the Perimenopause launch.
- Status: 2 policy strikes in the last 90 days. A third may restrict advertising on the account.
- Meta's note: avoid claims that a product treats, cures or prevents a condition, and avoid implying you know a person's health status.
`);
  csv(T, "subscription retention by first product", B, "Share of subscribers from the first order still active at each monthly renewal, cohorts from Jan to Jun 2026.", [
    { first_product: "Women's Multivitamin 18+", month_1: "100%", month_2: "70%", month_3: "58%", month_4: "52%", month_5: "48%", month_6: "45%" },
    { first_product: "Prenatal", month_1: "100%", month_2: "86%", month_3: "82%", month_4: "80%", month_5: "78%", month_6: "76%" },
    { first_product: "Synbiotic+", month_1: "100%", month_2: "52%", month_3: "34%", month_4: "27%", month_5: "23%", month_6: "20%" },
    { first_product: "Perimenopause Health (launch cohort, 2 renewals so far)", month_1: "100%", month_2: "78%", month_3: "71%", month_4: "", month_5: "", month_6: "" },
  ]);
  md(T, "store economics", B, `
# Store economics (test data)

- First order: 40% off the first month of a new subscription. Renewals go back to the full subscription price.
- Full subscription prices: Women's Multivitamin 18+ $33, Prenatal $39, Synbiotic+ $54, Perimenopause Health $39.
- Gross margin: 72% of the price paid. Subscriptions ship free; fulfilment costs about $3 per shipment.
- Meta reports the first order's value only, so ROAS in the export is first-order ROAS.
- Meta budget: $160,000 a month. The owner wants a payback inside 4 months on contribution.
`);
}

// ---------------------------------------------------------------- E06 Graza, Meta quick check (1 signal)
export function E06() {
  const T = "E06", B = "Graza";
  const campaigns = [
    { name: "ASC | All oils", type: "Advantage+ shopping", days: 220, spend: 42000, cpa: 27, aov: 41, cpm: 11, freq: 2.0, formats: { "single image": 0.35, carousel: 0.25, "video (Reels)": 0.4 } },
    { name: "Retargeting | 14d visitors", type: "Sales, retargeting", days: 300, spend: 6000, cpa: 15, aov: 44, cpm: 22, freq: 5.1, ctr: 0.018, formats: { "single image": 0.5, carousel: 0.5 } },
    { name: "Gifting | The Trio", type: "Sales, broad", days: 21, spend: 5000, cpa: 33, aov: 52, cpm: 12, freq: 1.6, formats: { "single image": 0.6, carousel: 0.4 } },
  ];
  const overrides = [{ campaign: "ASC | All oils", format: "video (Reels)", age: "25-34", gender: "men", spend: 3800, cpa: 14, aov: 39 }];
  const rows = metaCells({ seed: 606, campaigns, ageW: [0.10, 0.30, 0.27, 0.17, 0.10, 0.06], genderW: { women: 0.62, men: 0.38 },
    ageMult: [1.3, 1.0, 0.95, 1.0, 1.05, 1.15], genderMult: { men: 1.1 }, overrides, noise: 0.1 });
  const tot = campaignTotals(rows, campaigns);
  const asc = seg(rows, x => x.campaign.startsWith("ASC"));
  const m2534r = seg(rows, x => x.campaign.startsWith("ASC") && x.gender === "men" && x.age === "25-34" && x.ad_format === "video (Reels)");
  const m2534other = seg(rows, x => x.campaign.startsWith("ASC") && x.gender === "men" && x.age === "25-34" && x.ad_format !== "video (Reels)");
  check(m2534r.cpa < 0.6 * asc.cpa, "men 25-34 reels must stand out");
  fact(T, "asc", asc); fact(T, "men2534_reels", m2534r); fact(T, "men2534_other_formats", m2534other);
  fact(T, "campaigns", tot.map(t => ({ c: t.campaign, spend: t.spend, p: t.purchases, cpa: t.cost_per_purchase, roas: t.roas })));
  csv(T, "meta ads manager campaigns, last 14 days", B, "Meta Ads Manager export, 1 Nov to 14 Nov 2026, 7-day click 1-day view, USD.", tot);
  csv(T, "meta breakdown by format, age and gender, last 14 days", B, "Meta Ads Manager breakdown export, USD.", rows);
  csv(T, "account weekly trend", B, "Weekly account trend, USD. The week of 9 Nov includes early Black Friday auctions.", weeks("2026-11-09", 6).map((w, i) => ({ week_starting: w,
    spend: [26100, 26400, 25900, 26300, 26200, 26800][i], cost_per_purchase: [25.8, 26.4, 25.1, 26.0, 25.7, 28.8][i], cpm: [10.1, 10.3, 10.0, 10.4, 10.6, 13.9][i], ctr_link: ["1.4%", "1.4%", "1.5%", "1.4%", "1.4%", "1.5%"][i] })));
  md(T, "store economics", B, `
# Store economics (test data)

- Average first order: $41. Contribution on a first order before ads: $17.40.
- Customers place 2.9 orders in their first 12 months on average.
- The owner's target: first-order cost per purchase at or under $32 on Meta.
- Meta budget: about $110,000 a month, flat through December.
- Shopify orders tagged with a Meta UTM in these 14 days were 74% of Meta's purchase count, in line with the last 6 months.
`);
}

// ---------------------------------------------------------------- E07 Fellow, Google Ads (4+ signals)
export function E07() {
  const T = "E07", B = "Fellow";
  csv(T, "google ads campaigns, 16 Oct to 14 Nov 2026", B, "Google Ads campaign export, USD, conversion value from the Google tag.", [
    { campaign: "PMax | All products", spend: 118000, conversions: 1610, conversion_value: 472000, roas: 4.0, search_impression_share: "" },
    { campaign: "Shopping | Kettles", spend: 24000, conversions: 640, conversion_value: 105600, roas: 4.4, search_impression_share: "" },
    { campaign: "Search | Brand", spend: 9000, conversions: 1050, conversion_value: 189000, roas: 21.0, search_impression_share: "84% (90% the 30 days before)" },
    { campaign: "Search | Non-brand grinders", spend: 14000, conversions: 104, conversion_value: 30800, roas: 2.2, search_impression_share: "31%" },
  ]);
  const cats = [
    ["Brand terms (\"fellow\", \"fellow stagg\", \"fellow ode\")", 21000, 302000],
    ["\"pour over kettle\", \"electric gooseneck kettle\"", 19000, 62000],
    ["\"coffee grinder\", \"burr grinder\"", 24000, 41000],
    ["\"espresso machine\", \"home espresso\"", 31000, 30500],
    ["\"gift for coffee lover\", \"coffee gifts\"", 6000, 21600],
    ["Display, YouTube and not shown", 17000, 14900],
  ].map(([c, s, v]) => ({ search_category: c, spend: s, conversion_value: v, roas: round(v / s, 2) }));
  check(sum(cats.map(c => c.spend)) === 118000 && sum(cats.map(c => c.conversion_value)) === 472000, "pmax categories add up");
  csv(T, "pmax search categories", B, "Performance Max search term insights joined to a reporting script by our agency, USD. No brand exclusions are set on Performance Max.", cats);
  fact(T, "pmax_nonbrand_roas", round((472000 - 302000) / (118000 - 21000), 2));
  csv(T, "pmax and shopping by product", B, "Spend and conversion value by product across PMax and Shopping, USD.", [
    { product: "Espresso Series 1", price: 1499.95, spend: 36600, conversion_value: 40300, roas: 1.1, note: "" },
    { product: "Stagg EKG Pro", price: 179.95, spend: 38200, conversion_value: 214000, roas: 5.6, note: "" },
    { product: "Ode Brew Grinder Gen 2", price: 399.95, spend: 9100, conversion_value: 41000, roas: 4.5, note: "Last 30 days before this period: $128,000 conversion value" },
    { product: "Opus 2", price: 199.95, spend: 17400, conversion_value: 55800, roas: 3.2, note: "" },
    { product: "Aiden", price: 399.95, spend: 15300, conversion_value: 47300, roas: 3.1, note: "" },
    { product: "Clyde kettle", price: 99.95, spend: 9800, conversion_value: 37400, roas: 3.8, note: "" },
    { product: "Other products and coffee", price: "", spend: 15600, conversion_value: 141800, roas: 9.1, note: "Mostly brand searches for accessories" },
  ]);
  const demo = [];
  const r = rng(707);
  for (const age of ["25-34", "35-44", "45-54", "55-64", "65+"]) for (const device of ["mobile", "desktop"]) {
    const planted = age === "55-64" && device === "desktop";
    const clicks = planted ? 2900 : Math.round([5200, 4800, 3300, 2100, 900][["25-34", "35-44", "45-54", "55-64", "65+"].indexOf(age)] * (device === "mobile" ? 1.4 : 0.8) * (0.9 + 0.2 * r()));
    const cr = planted ? 0.061 : (device === "mobile" ? 0.017 : 0.024) * (0.9 + 0.2 * r());
    const conv = Math.round(clicks * cr), aov = planted ? 212 : 168 * (0.95 + 0.1 * r());
    const spend = Math.round(clicks * (planted ? 2.1 : 0.85 + 0.1 * r()));
    demo.push({ campaign_scope: "Shopping | Kettles + PMax shopping placements", age, device, clicks, spend, conversions: conv, conv_rate: round(100 * cr, 1) + "%", conversion_value: Math.round(conv * aov), roas: round(conv * aov / spend, 2),
      top_search_terms: planted ? "gift for coffee lover; pour over kettle gift; stagg kettle" : "pour over kettle; gooseneck kettle; fellow stagg" });
  }
  csv(T, "shopping by age and device", B, "Google Ads demographics and device report for Shopping placements, USD.", demo);
  const p = demo.find(d => d.age === "55-64" && d.device === "desktop"); fact(T, "age5564_desktop", { roas: p.roas, cr: p.conv_rate });
  csv(T, "merchant center diagnostics", B, "Google Merchant Center item issues on 14 Nov 2026.", [
    { item_group: "Ode Brew Grinder Gen 2 (3 variants)", issue: "Disapproved: price mismatch between feed and landing page", since: "2026-11-02", affected_variants: 3 },
    { item_group: "Coffee drops (14 items)", issue: "Limited performance: missing GTIN", since: "2026-09-18", affected_variants: 14 },
    { item_group: "Carter Move Mug (6 colours)", issue: "Warning: image too small for some placements", since: "2026-10-30", affected_variants: 6 },
  ]);
  md(T, "store economics", B, `
# Store economics (test data)

- Contribution after product cost, shipping, payment fees and returns: 38% of revenue on hardware.
- Break-even ROAS on hardware is therefore about 2.6.
- Google budget stays at $165,000 for the next 30 days, which run through Black Friday and into December.
- Espresso Series 1 buyers take 23 days from first click to purchase on average; kettles take 3 days.
`);
}

// ---------------------------------------------------------------- E08 KraveBeauty, TikTok (held-out, 3 signals)
export function E08() {
  const T = "E08", B = "KraveBeauty";
  csv(T, "tiktok ads campaigns, 16 Oct to 14 Nov 2026", B, "TikTok Ads Manager export, 7-day click 1-day view, USD.", [
    { campaign: "Smart+ | All products", spend: 26000, impressions: 3900000, clicks: 46800, conversions: 1040, conversion_value: 31200, cpa: 25.0 },
    { campaign: "Spark Ads | Creator posts", spend: 14000, impressions: 1820000, clicks: 30900, conversions: 700, conversion_value: 21000, cpa: 20.0 },
    { campaign: "In-feed | Brand video", spend: 10000, impressions: 1750000, clicks: 12200, conversions: 160, conversion_value: 5100, cpa: 62.5 },
  ]);
  const rows = [], r = rng(808);
  const groups = [["Spark Ads | Creator posts", 14000, 20], ["Smart+ | All products", 26000, 25], ["In-feed | Brand video", 10000, 62.5]];
  for (const [c, total, base] of groups) {
    const cells = [];
    for (const age of ["18-24", "25-34", "35-44", "45+"]) for (const g of ["female", "male"]) {
      const w = [0.34, 0.38, 0.19, 0.09][["18-24", "25-34", "35-44", "45+"].indexOf(age)] * (g === "female" ? 0.8 : 0.2);
      cells.push({ age, g, w, planted: c.startsWith("Spark") && age === "25-34" && g === "male" });
    }
    const fixed = c.startsWith("Spark") ? 3100 : 0;
    const sp = split(total - fixed, cells.filter(x => !x.planted).map(x => x.w));
    let k = 0;
    for (const x of cells) {
      const spend = x.planted ? 3100 : sp[k++];
      const cpa = x.planted ? 11 : base * (x.g === "male" ? 1.35 : 1) * (0.88 + 0.24 * r());
      rows.push({ campaign: c, age: x.age, gender: x.g, spend, conversions: Math.round(spend / cpa), cpa: round(spend / Math.round(spend / cpa), 2) });
    }
  }
  csv(T, "tiktok breakdown by age and gender", B, "TikTok Ads Manager audience breakdown, USD.", rows);
  const spark = rows.filter(x => x.campaign.startsWith("Spark")); fact(T, "spark_cpa_all", round(sum(spark.map(x => x.spend)) / sum(spark.map(x => x.conversions)), 2));
  fact(T, "men2534_spark_cpa", rows.find(x => x.campaign.startsWith("Spark") && x.age === "25-34" && x.gender === "male").cpa);
  fact(T, "men_other_cpa", round(sum(rows.filter(x => x.gender === "male" && !(x.campaign.startsWith("Spark") && x.age === "25-34")).map(x => x.spend)) / sum(rows.filter(x => x.gender === "male" && !(x.campaign.startsWith("Spark") && x.age === "25-34")).map(x => x.conversions)), 2));
  csv(T, "tiktok ads, last 30 days", B, "TikTok ad-level export, USD.", [
    { ad: "Spark | @creator: skincare for guys who hate skincare", campaign: "Spark Ads | Creator posts", status: "Active", spend: 3600, conversions: 301, ctr: "2.1%", ad_text: "3 steps. That's the whole routine." },
    { ad: "Spark | @creator: my barrier was wrecked", campaign: "Spark Ads | Creator posts", status: "Active", spend: 5200, conversions: 214, ctr: "1.6%", ad_text: "Great Barrier Relief saved my skin barrier*" },
    { ad: "Smart+ | 3 steps, that's it", campaign: "Smart+ | All products", status: "Active", spend: 11800, conversions: 470, ctr: "1.3% (was 1.9% on 4 Nov)", ad_text: "Cleanse. Treat. Protect." },
    { ad: "Smart+ | Beet The Sun, reef safe and waterproof", campaign: "Smart+ | All products", status: "Active", spend: 4100, conversions: 151, ctr: "1.2%", ad_text: "Reef safe, waterproof SPF 40 you'll actually wear" },
    { ad: "In-feed | Slow down skincare (brand film)", campaign: "In-feed | Brand video", status: "Active", spend: 10000, conversions: 160, ctr: "0.7%", ad_text: "Press reset on your routine" },
  ]);
  csv(T, "smart plus top ad daily", B, "Daily delivery for the ad \"3 steps, that's it\", USD.", ["2026-11-04", "2026-11-05", "2026-11-06", "2026-11-07", "2026-11-08", "2026-11-09", "2026-11-10", "2026-11-11", "2026-11-12", "2026-11-13", "2026-11-14"].map((d, i) => ({
    date: d, spend: 1070 + (i % 3) * 20, ctr: round(1.9 - i * 0.09, 2) + "%", frequency: round(1.4 + i * 0.22, 1), cpa: round(19.5 + i * 1.6, 1) })));
  csv(T, "shopify orders and survey, same 30 days", B, "Shopify orders and post-purchase survey, USD.", [
    { metric: "Orders with a TikTok UTM", value: 760 },
    { metric: "New customers, all channels", value: 3400 },
    { metric: "New customers answering 'TikTok' to 'Where did you first hear about us?' (answered by 61% of new customers)", value: "22% of answers" },
    { metric: "Orders from link in bio on the organic video 'Krave haul' (2.1M views, posted 20 Oct)", value: 14 },
    { metric: "Average order value, TikTok UTM orders", value: 29.6 },
  ]);
  md(T, "store economics", B, `
# Store economics (test data)

- Contribution on a first order before ads: 55% of order value, about $16.50 on a $30 order.
- 6-month contribution per new customer: about $28.
- TikTok budget: $50,000 a month. The owner may move up to $10,000 between platforms.
`);
}
