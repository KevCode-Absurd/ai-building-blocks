// Research, offer, finance and operations fixtures: E23 Graza market research, E24 Wild One product research,
// E25 Taylor Stitch Black Friday offer, E26 Taylor Stitch unit economics, E27 Sleepy Owl COD,
// E28 Wild One supplier and landed cost, E32 Graza reorder, E33 Wild One shipping threshold.
import { csv, md, round, sum, fact, check, rng, weeks } from "./lib.mjs";

// ---------------------------------------------------------------- E23 Graza, market research (3 signals)
export function E23() {
  const T = "E23", B = "Graza";
  const months = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"];
  const lines = { "Squeeze oils (Drizzle, Sizzle)": [1.62, 1.60, 1.58, 1.61, 1.63, 1.62], "Frizzle (high heat)": [0.21, 0.24, 0.28, 0.33, 0.38, 0.44], "Glass bottles and refill cans": [0.30, 0.31, 0.30, 0.31, 0.32, 0.32], "Mayo and aioli": [0.08, 0.10, 0.12, 0.14, 0.16, 0.19], "Olive oil chips": [0.06, 0.06, 0.05, 0.05, 0.05, 0.05] };
  const rows = [];
  for (const [line, v] of Object.entries(lines)) months.forEach((m, i) => rows.push({ month: m, product_line: line, net_sales_usd_millions: v[i] }));
  csv(T, "net sales by product line, all channels", B, "Monthly net sales across own site, Amazon and retail, USD millions.", rows);
  fact(T, "mayo_growth", "0.08 to 0.19 in 6 months"); fact(T, "frizzle_growth", "0.21 to 0.44");
  csv(T, "repeat rate by first product", B, "Share of first-time buyers who order again within 90 days (own site).", [
    { first_product: "Drizzle or Sizzle", repeat_within_90_days: "34%" }, { first_product: "Frizzle", repeat_within_90_days: "38%" },
    { first_product: "Mayo or aioli", repeat_within_90_days: "41%" }, { first_product: "Olive oil chips", repeat_within_90_days: "12%" },
  ]);
  csv(T, "search interest index, us", B, "Search interest index for the US, 100 = the peak month in the window. Built for this test.", [
    { term: "olive oil shot", "2026-01": 100, "2026-04": 46, "2026-07": 31, "2026-10": 29 },
    { term: "high heat cooking oil", "2026-01": 52, "2026-04": 61, "2026-07": 74, "2026-10": 88 },
    { term: "olive oil spray", "2026-01": 70, "2026-04": 74, "2026-07": 79, "2026-10": 83 },
    { term: "olive oil mayo", "2026-01": 38, "2026-04": 49, "2026-07": 63, "2026-10": 71 },
    { term: "extra virgin olive oil", "2026-01": 92, "2026-04": 90, "2026-07": 88, "2026-10": 91 },
  ]);
  csv(T, "what customers ask for", B, "Requests in reviews, support tickets and the post-purchase survey, last 6 months.", [
    { request: "A spray or mister format", mentions: 140 }, { request: "Bigger refill sizes", mentions: 96 },
    { request: "More sauces like the mayo (dressings, aioli flavours)", mentions: 88 }, { request: "Avocado oil", mentions: 41 }, { request: "Olive oil shots", mentions: 6 },
  ]);
  csv(T, "competitor shelf prices", B, "Shelf prices in US grocery, Nov 2026, for this test.", [
    { item: "Olive oil spray, 5 to 7 oz, leading brands", price_range_usd: "6 to 9" }, { item: "Avocado oil mayo, 12 oz", price_range_usd: "8 to 11" },
    { item: "High heat blended oil, 750 mL", price_range_usd: "9 to 15" },
  ]);
  md(T, "owner notes", B, `
# Owner notes (test data)

- Cash for a new line in 2027: up to $1.2M including first inventory.
- Our co-packers can do bottles, cans and jars. A spray needs a new filler and a bag-on-valve can supplier.
- The owner's words: "Where is the market going and what should we move into next? Be honest if the answer is boring."
`);
}

// ---------------------------------------------------------------- E24 Wild One, product research (held-out, 2 signals)
export function E24() {
  const T = "E24", B = "Wild One";
  csv(T, "site search terms with no matching product, last 90 days", B, "On-site searches that returned no product.", [
    { term: "car seat / car harness / seatbelt", searches: 2100 }, { term: "raincoat / dog jacket", searches: 1600 },
    { term: "cat backpack", searches: 700 }, { term: "dog bed", searches: 650 }, { term: "gps tag", searches: 400 },
  ]);
  csv(T, "support ticket themes, last 90 days", B, "Support tickets asking for a product we do not sell.", [
    { theme: "Can I use the harness in the car? Do you sell a car restraint?", tickets: 310, note: "Mostly Travel Carrier and harness owners" },
    { theme: "Do you make a raincoat?", tickets: 120, note: "" }, { theme: "Matching cat items", tickets: 95, note: "" },
  ]);
  csv(T, "attach rates", B, "Share of orders that include a second item, last 90 days.", [
    { first_item: "Cat Harness & Leash", adds_cat_tunnel: "38%", adds_breakaway_collar: "21%" },
    { first_item: "Travel Carrier", adds_harness: "29%", adds_waterproof_leash: "17%" },
    { first_item: "Cushioned Dog Harness", adds_leash: "44%", adds_poop_bag_carrier: "19%" },
  ]);
  csv(T, "candidate products", B, "Candidate products with supplier quotes, landed cost per unit and MOQ, for this test.", [
    { candidate: "Car safety harness (crash-test claim needs third-party testing)", landed_cost_usd: 14.2, target_price_usd: 58, moq_units: 3000, testing_cost_usd: 18000, lead_time_days: 120 },
    { candidate: "Dog raincoat (6 sizes x 4 colours)", landed_cost_usd: 9.8, target_price_usd: 48, moq_units: 6000, testing_cost_usd: 0, lead_time_days: 90 },
    { candidate: "Cat travel backpack", landed_cost_usd: 16.5, target_price_usd: 85, moq_units: 1500, testing_cost_usd: 0, lead_time_days: 100 },
    { candidate: "Cat scratcher and toy set", landed_cost_usd: 6.1, target_price_usd: 34, moq_units: 2000, testing_cost_usd: 0, lead_time_days: 75 },
  ]);
  csv(T, "returns by category", B, "Return rates by category, last 12 months.", [
    { category: "Harnesses", return_rate: "11%", top_reason: "Size" }, { category: "Apparel collab (sizes)", return_rate: "27%", top_reason: "Size" },
    { category: "Leashes and collars", return_rate: "4%", top_reason: "Colour" }, { category: "Cat line", return_rate: "6%", top_reason: "Size" },
  ]);
  md(T, "owner notes", B, `
# Owner notes (test data)

- Cash for a new product's first order: $60,000 at most, including any testing.
- Our customer survey's top request is a raincoat (31% of 2,400 answers).
- The owner's words: "Which product should we add next? I want one answer, not five."
`);
}

// ---------------------------------------------------------------- E25 Taylor Stitch, Black Friday offer (2 signals)
export function E25() {
  const T = "E25", B = "Taylor Stitch";
  csv(T, "black friday week 2025 results", B, "Results for Black Friday week 2025 (no sitewide discount), USD.", [
    { tactic: "Common Club double credit (10% back instead of 5%)", members_reached: 64000, revenue: 1180000, vs_normal_week: "+38%", cost: "credit issued $118,000, about 31% redeemed by March" },
    { tactic: "Last Call (final sale on old season, up to 40% off)", members_reached: "all", revenue: 640000, vs_normal_week: "+210% on Last Call items", cost: "markdown on stock older than 2 seasons" },
    { tactic: "Full-price new arrivals", members_reached: "all", revenue: 910000, vs_normal_week: "+6%", cost: "" },
  ]);
  csv(T, "aged inventory, nov 2026", B, "Units on hand by season age.", [
    { season_age: "Current season", units: 61000, cost_value_usd: 2440000 },
    { season_age: "1 season old", units: 18500, cost_value_usd: 650000 },
    { season_age: "2+ seasons old", units: 9200, cost_value_usd: 290000 },
  ]);
  csv(T, "full price sell-through after last call", B, "Full-price weekly sales of current-season items in the 4 weeks after Last Call 2025, index 100 = the 4 weeks before.", [
    { week: "Week 1 after", full_price_index: 98 }, { week: "Week 2 after", full_price_index: 101 }, { week: "Week 3 after", full_price_index: 99 }, { week: "Week 4 after", full_price_index: 103 },
  ]);
  md(T, "owner notes", B, `
# Owner notes (test data)

- Gross margin at full price: 62%. A 25% sitewide discount takes it to about 49% before returns.
- A competitor is running 40% off sitewide this year and our team is nervous.
- 3% of email replies last month asked "when is your sale?".
- The owner's words: "Should we do a Black Friday sale this year? We never discount. What should we do instead, exactly?"
`);
}

// ---------------------------------------------------------------- E26 Taylor Stitch, unit economics (held-out, 3 signals)
export function E26() {
  const T = "E26", B = "Taylor Stitch";
  const p = [
    ["The Jack (shirt)", 138, 0.36, 5310, 0.12, 0.30],
    ["Democratic Foundation Chino", 138, 0.37, 3020, 0.16, 0.45],
    ["Carnegie Pant", 178, 0.38, 2210, 0.31, 0.40],
    ["Long Haul Jacket", 208, 0.39, 2140, 0.20, 0.35],
    ["Fisherman Sweater", 258, 0.40, 980, 0.09, 0.30],
    ["Accessories (socks, hats, belts)", 38, 0.42, 4100, 0.05, 0.20],
  ].map(([product, price, cogs, units, ret, exch]) => ({ product, price_usd: price, product_cost_share_of_price: round(cogs * 100) + "%", units_sold_90d: units, return_rate: round(ret * 100) + "%", share_of_returns_that_are_exchanges: round(exch * 100) + "%" }));
  csv(T, "products, last 90 days", B, "Sales and returns by product, last 90 days.", p);
  csv(T, "order mix, last 90 days", B, "Orders by order value band.", [
    { order_value_band: "Under $60 (mostly accessories only)", orders: 2900, average_order_value: 41 },
    { order_value_band: "$60 to $150", orders: 6100, average_order_value: 128 },
    { order_value_band: "$150 to $300", orders: 5600, average_order_value: 214 },
    { order_value_band: "Over $300", orders: 1900, average_order_value: 410 },
  ]);
  md(T, "cost table", B, `
# Costs per order and per return (test data)

- Outbound shipping: $9.50 per order (any size). Free shipping and free returns on every US order, no minimum.
- Payment fees: 2.9% of order value plus $0.30.
- Pick and pack: $3.20 per order.
- A return: $11 return label plus $4 inspection and restock. 92% of returned items go back to stock at full value.
- An exchange: the return cost above, plus a second outbound shipment ($9.50) and a second pick and pack ($3.20).
- Reported gross margin: 63% of net sales.
- The owner's words: "What does an order actually make us after free shipping and free returns? Where are we losing money?"
`);
  // Worked numbers for the key: expected contribution per order line before marketing.
  // Kept: price x (1 - cost) minus ship, pick and fees. Refund return: those costs plus $15 and 8% of product cost written off.
  // Exchange: the sale stays, plus $15 return, $9.50 second shipment and $3.20 second pick.
  const contrib = (price, cogs, ret, exch) => {
    const base = price * (1 - cogs) - 9.5 - 3.2 - (price * 0.029 + 0.3);
    const refund = -(9.5 + 3.2 + (price * 0.029 + 0.3) + 15 + 0.08 * price * cogs);
    return round((1 - ret) * base + ret * exch * (base - 27.7) + ret * (1 - exch) * refund, 2);
  };
  fact(T, "contribution_per_order", { jack: contrib(138, 0.36, 0.12, 0.30), chino: contrib(138, 0.37, 0.16, 0.45), carnegie: contrib(178, 0.38, 0.31, 0.40),
    long_haul: contrib(208, 0.39, 0.20, 0.35), fisherman: contrib(258, 0.40, 0.09, 0.30), under60_accessories: contrib(41, 0.42, 0.05, 0.20) });
  fact(T, "carnegie_return_cost_vs_if_12pct", round(contrib(178, 0.38, 0.12, 0.40) - contrib(178, 0.38, 0.31, 0.40), 2));
}

// ---------------------------------------------------------------- E27 Sleepy Owl, COD and RTO (4+ signals, ishita)
export function E27() {
  const T = "E27", B = "Sleepy Owl Coffee";
  const tiers = [["Metro", 5200, 0.38, 0.14], ["Tier 2", 3100, 0.58, 0.26], ["Tier 3 and rural", 1900, 0.79, 0.41]];
  const rows = tiers.map(([tier, orders, codShare, rto]) => ({ pincode_tier: tier, orders, cod_share: round(codShare * 100) + "%", rto_rate_of_cod: round(rto * 100) + "%", cod_orders: Math.round(orders * codShare), rto_orders: Math.round(orders * codShare * rto) }));
  const allOrders = sum(rows.map(r => r.orders)), cod = sum(rows.map(r => r.cod_orders)), rto = sum(rows.map(r => r.rto_orders));
  fact(T, "cod_share", round(cod / allOrders, 3)); fact(T, "rto_of_cod", round(rto / cod, 3)); fact(T, "tier3_rto", 0.41);
  csv(T, "orders by payment and pincode tier, last 30 days", B, "Own-site orders by pincode tier, 16 Oct to 14 Nov 2026.", rows);
  csv(T, "rto reasons from courier", B, "RTO reasons as reported by the courier, last 30 days.", [
    { reason: "Customer not available", share: "60%" }, { reason: "Customer refused", share: "24%" }, { reason: "Address issue", share: "11%" }, { reason: "Other", share: "5%" },
  ]);
  csv(T, "whatsapp cod confirmation pilot", B, "One-week pilot, 3 to 9 Nov 2026: every COD order got a WhatsApp confirm-or-cancel message before dispatch.", [
    { group: "COD orders with confirmation", orders: 610, cancelled_before_dispatch: "9%", rto_rate_of_dispatched: "14%" },
    { group: "COD orders without (same week, other warehouse)", orders: 590, cancelled_before_dispatch: "0%", rto_rate_of_dispatched: "27%" },
  ]);
  csv(T, "prepaid nudge test", B, "Checkout test, Oct 2026: Rs 30 off for paying online, shown to half of COD-intending buyers.", [
    { group: "Saw Rs 30 prepaid offer", cod_intending_sessions: 4200, switched_to_prepaid: "31%", checkout_completion: "61%" },
    { group: "Control", cod_intending_sessions: 4150, switched_to_prepaid: "9%", checkout_completion: "63%" },
  ]);
  md(T, "economics", B, `
# Order economics (test data)

- Average order value on the site: Rs 780. Product cost: 34% of order value.
- Forward shipping: Rs 62 per order. COD fee from the courier: Rs 35 per COD order.
- An RTO costs Rs 120 in return shipping and handling, plus Rs 62 forward shipping already paid. Cold Brew Packs come back sellable; the rest of the order is written off 20% of the time.
- Quick commerce (Blinkit, Zepto, Instamart) already carries our range in the top 8 metros.
- The owner's words: "COD is killing us. Should we just stop COD?"
`);
}

// ---------------------------------------------------------------- E28 Wild One, supplier and landed cost (3 signals)
export function E28() {
  const T = "E28", B = "Wild One";
  csv(T, "supplier quotes, cushioned harness", B, "Quotes for 3,000 units of the Cushioned Dog Harness, Nov 2026, USD.", [
    { supplier: "Supplier A (Dongguan, China)", unit_price: 6.10, incoterm: "FOB Shenzhen", moq: 3000, lead_time_days: 45, payment_terms: "30% deposit, 70% before shipping" },
    { supplier: "Supplier B (Phnom Penh, Cambodia)", unit_price: 7.20, incoterm: "FOB Sihanoukville", moq: 2000, lead_time_days: 50, payment_terms: "30% deposit, 70% on bill of lading" },
    { supplier: "Supplier C (Ho Chi Minh City, Vietnam)", unit_price: 6.40, incoterm: "EXW factory", moq: 3000, lead_time_days: 75, payment_terms: "50% deposit, 50% before shipping" },
  ]);
  csv(T, "sample inspection results", B, "Third-party inspection of 20 pre-production samples per supplier.", [
    { supplier: "Supplier A", buckle_pull_test_fails: "3 of 20", stitching_defects: "1 of 20", colour_match: "pass" },
    { supplier: "Supplier B", buckle_pull_test_fails: "0 of 20", stitching_defects: "1 of 20", colour_match: "pass" },
    { supplier: "Supplier C", buckle_pull_test_fails: "0 of 20", stitching_defects: "0 of 20", colour_match: "minor drift on Lilac" },
  ]);
  md(T, "freight and duty for this test", B, `
# Freight and duty (test data: use these rates for this exercise, not as current law)

- Ocean freight to the New Jersey warehouse, per unit: China $0.38, Cambodia $0.46, Vietnam $0.41.
- Inland trucking from factory to port (only needed under EXW): $0.35 per unit for Supplier C.
- Duty for this harness for this test: 7.0% of the FOB value for all three origins, plus an extra 25% of FOB value for goods made in China.
- Customs brokerage and port fees: $0.12 per unit.
`);
  const landed = { A: 6.10 + 0.38 + 6.10 * 0.32 + 0.12, B: 7.20 + 0.46 + 7.20 * 0.07 + 0.12, C: 6.40 + 0.35 + 0.41 + (6.40 + 0.35) * 0.07 + 0.12 };
  for (const k of Object.keys(landed)) landed[k] = round(landed[k], 2);
  check(landed.B < landed.A, "Cambodia lands cheaper than China");
  fact(T, "landed", landed);
  csv(T, "stock and sales", B, "Cushioned Dog Harness stock and sales, 14 Nov 2026.", [
    { metric: "Units on hand", value: 6300 }, { metric: "Average units sold per day, last 60 days", value: 90 },
    { metric: "Days of cover", value: 70 }, { metric: "Spring demand (Mar to May) vs average", value: "+35%" },
  ]);
  md(T, "owner notes", B, `
# Owner notes (test data)

- Our harness returns are 11%, mostly size. A buckle failure would be a safety issue and a review problem.
- Cash for this order: up to $30,000.
- The owner's words: "I got 3 quotes for the harness. Which one do we go with?"
`);
}

// ---------------------------------------------------------------- E32 Graza, reorder (0 signals, 1 decoy)
export function E32() {
  const T = "E32", B = "Graza";
  const wk = weeks("2026-11-09", 12);
  const base = [1180, 1210, 1195, 1230, 1205, 1190, 1240, 1220, 1215, 2890, 1260, 1235];
  csv(T, "sizzle weekly unit sales, own site and amazon", B, "Sizzle 750 mL squeeze bottle, units per week. The week of 2 Nov had a creator video mention.", wk.map((w, i) => ({ week_starting: w, units: base[i] })));
  csv(T, "sizzle stock position", B, "Sizzle stock on 14 Nov 2026.", [
    { metric: "Units on hand (warehouse)", value: 7900 }, { metric: "Units on the way (arrives 21 Nov)", value: 0 },
    { metric: "Supplier lead time, order to warehouse", value: "30 days" }, { metric: "Safety stock policy", value: "2 weeks of average sales" },
    { metric: "Standard reorder quantity", value: "6,000 units (one container)" }, { metric: "Retail orders this month", value: "on plan" },
  ]);
  md(T, "owner notes", B, `
# Owner notes (test data)

- December is usually about 10% above the autumn average for Sizzle.
- The owner's words: "Should I reorder Sizzle now? Last week's spike scared me."
`);
  const avg = round(sum(base.filter((_, i) => i !== 9)) / 11);
  fact(T, "avg_weekly_excl_spike", avg); fact(T, "weeks_cover", round(7900 / avg, 1));
}

// ---------------------------------------------------------------- E33 Wild One, free shipping threshold (held-out, 0 signals)
export function E33() {
  const T = "E33", B = "Wild One";
  csv(T, "order value distribution, last 90 days", B, "US orders by order value band, last 90 days. Free standard shipping from $90.", [
    { order_value_band: "Under $50", orders: 3100 }, { order_value_band: "$50 to $89", orders: 5200 }, { order_value_band: "$90 to $104", orders: 6900 },
    { order_value_band: "$105 to $149", orders: 3600 }, { order_value_band: "$150 and over", orders: 1700 },
  ]);
  csv(T, "shipping metrics", B, "Shipping cost and checkout metrics, last 90 days.", [
    { metric: "Average order value", value: "$96" }, { metric: "Average cost to ship a free-shipping order", value: "$8.90" },
    { metric: "Contribution per free-shipping order after shipping", value: "$31.40" }, { metric: "Cart abandonment rate", value: "71%" },
    { metric: "Share of carts between $70 and $89 that add an item to reach $90", value: "38%" },
    { metric: "Most added item to reach the threshold", value: "Poop Bags ($9) and Waterproof Collar" },
  ]);
  md(T, "owner notes", B, `
# Owner notes (test data)

- A competitor moved to free shipping from $49 last month.
- The owner's words: "Is our free shipping threshold right? Should we drop it to match?"
`);
}
