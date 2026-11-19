#!/usr/bin/env node
// teardown-collect.mjs: collect public evidence about a D2C brand's marketing into one cited bundle.
//
//   node tools/teardown-collect.mjs <store-url> [--out dir] [--ads file.json]... [--country US]
//                                   [--max-pages 8] [--no-wayback] [--no-reviews] [--quiet]
//   node tools/teardown-collect.mjs ads <evidence-dir> <ads.json>...   add Ad Library exports to a bundle
//   node tools/teardown-collect.mjs help
//
// Plain Node 18+, no packages. Reads public pages only: the storefront, its public catalogue
// endpoints, robots.txt, sitemaps, llms.txt, Google Tag Manager containers it loads, the Wayback
// Machine and a public review page. It never logs in, submits a form, adds to cart or buys.
// Ad Library data comes in through --ads: the export of a Meta Ad Library connector search, the
// official Ad Library API, or a hand-made list. Every item becomes evidence E1..En with its URL
// and time; what could not be seen becomes an unknown with a link to check it by hand.
//
// Writes <out>/evidence.json (full bundle) and <out>/evidence.md (a compact index to read first).
// Inspired by REM, Reverse Engineer Marketing (MIT, github.com/dansugc/reverse-engineer-marketing),
// rebuilt for D2C stores: catalogue, price ladder, offer architecture, retention stack, Shopify apps.

import fs from "node:fs";
import path from "node:path";

const VERSION = "1.0.0";
const SCHEMA = "d2c-teardown-evidence/1";
// An honest user agent: the tool says what it is. Sites that refuse it are recorded as unknowns, never worked around.
const BOT = "AIBlocksTeardown";
const UA = `Mozilla/5.0 (compatible; ${BOT}/1.0; public marketing research; +https://agents.useaiblocks.com)`;
const DAY = 86400000;

// ---------- small helpers ----------
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, dflt) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : dflt; };
const optAll = (name) => args.flatMap((a, i) => (a === `--${name}` && args[i + 1] ? [args[i + 1]] : []));
const quiet = flag("quiet");
const log = (...m) => { if (!quiet) console.error(...m); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uniq = (a) => [...new Set(a)];
const round = (n, d = 2) => (Number.isFinite(n) ? Math.round(n * 10 ** d) / 10 ** d : null);
const median = (a) => { const s = a.filter(Number.isFinite).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const quantile = (a, q) => { const s = a.filter(Number.isFinite).sort((x, y) => x - y); if (!s.length) return null; const p = (s.length - 1) * q, lo = Math.floor(p), hi = Math.ceil(p); return s[lo] + (s[hi] - s[lo]) * (p - lo); };
const decode = (s = "") => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&#x27;|&apos;/g, "'").replace(/&nbsp;|&#160;/g, " ").replace(/&rsquo;|&#8217;/g, "’").replace(/&lsquo;|&#8216;/g, "‘").replace(/&ldquo;|&#8220;/g, "“").replace(/&rdquo;|&#8221;/g, "”").replace(/&ndash;|&#8211;/g, "–").replace(/&mdash;|&#8212;/g, "—").replace(/&hellip;|&#8230;/g, "…").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const strip = (html = "") => decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<noscript[\s\S]*?<\/noscript>/gi, " ").replace(/<svg[\s\S]*?<\/svg>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const attr = (tag, name) => { const m = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i").exec(tag); return m ? decode(m[2] ?? m[3] ?? m[4] ?? "") : null; };
const meta = (html, key) => { for (const m of html.matchAll(/<meta\b[^>]*>/gi)) { const t = m[0]; if ((attr(t, "name") || attr(t, "property") || "").toLowerCase() === key.toLowerCase()) return attr(t, "content"); } return null; };
const abs = (u, base) => { try { return new URL(u, base).href; } catch { return null; } };
const clip = (s, n = 160) => (s && s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
const daysBetween = (a, b) => Math.round((b - a) / DAY);
const isoDay = (t) => new Date(t).toISOString().slice(0, 10);
const money = (n, cur) => (n == null ? null : `${cur ? cur + " " : ""}${n.toFixed(2)}`);

let requestCount = 0;
const MAX_REQUESTS = Number(opt("max-requests", 90));
// robots.txt is followed for the store's own host: a disallowed path is skipped and becomes an unknown.
const ROBOTS = new Map(); // host -> [{ allow, pattern }]
const SKIPPED = [];
function robotsRules(text) {
  const groups = []; let cur = null; let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim(); if (!line) continue;
    const i = line.indexOf(":"); if (i < 0) continue; const k = line.slice(0, i).trim().toLowerCase(); const v = line.slice(i + 1).trim();
    if (k === "user-agent") { if (!cur || !lastWasAgent) { cur = { agents: [], rules: [] }; groups.push(cur); } cur.agents.push(v.toLowerCase()); lastWasAgent = true; continue; }
    lastWasAgent = false;
    if ((k === "allow" || k === "disallow") && cur && v) cur.rules.push({ allow: k === "allow", pattern: v });
  }
  const mine = groups.filter((g) => g.agents.some((a) => a !== "*" && BOT.toLowerCase().includes(a)));
  return (mine.length ? mine : groups.filter((g) => g.agents.includes("*"))).flatMap((g) => g.rules);
}
function robotsAllows(url) {
  let u; try { u = new URL(url); } catch { return true; }
  const rules = ROBOTS.get(u.host); if (!rules) return true;
  const p = u.pathname + u.search; let best = null;
  for (const r of rules) {
    const re = new RegExp("^" + r.pattern.replace(/[.+?^{}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\$$/, "$"));
    if (re.test(p) && (!best || r.pattern.length > best.pattern.length || (r.pattern.length === best.pattern.length && r.allow))) best = r;
  }
  return !best || best.allow;
}
async function get(url, { accept = "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8", timeout = 20000, tries = 2 } = {}) {
  if (requestCount >= MAX_REQUESTS) return { ok: false, status: 0, url, text: "", error: "request budget reached" };
  if (!robotsAllows(url)) { SKIPPED.push(url); return { ok: false, status: 0, url, text: "", error: "robots.txt asks automated readers not to fetch this path" }; }
  for (let attempt = 1; attempt <= tries; attempt++) {
    requestCount++;
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), timeout);
    try {
      const res = await fetch(url, { headers: { "user-agent": UA, accept, "accept-language": "en-US,en;q=0.9" }, redirect: "follow", signal: ctl.signal });
      const text = await res.text();
      clearTimeout(timer);
      if (res.status === 429 && attempt < tries) { await sleep(2500); continue; }
      return { ok: res.ok, status: res.status, url: res.url || url, text, headers: Object.fromEntries(res.headers) };
    } catch (e) {
      clearTimeout(timer);
      if (attempt >= tries) return { ok: false, status: 0, url, text: "", error: String(e.name === "AbortError" ? "timeout" : e.message || e) };
      await sleep(800);
    }
  }
}
const getJson = async (url, o) => { const r = await get(url, { accept: "application/json", ...o }); if (!r.ok) return { ...r, json: null }; try { return { ...r, json: JSON.parse(r.text) }; } catch { return { ...r, ok: false, json: null, error: "not JSON" }; } };

// ---------- evidence store ----------
function makeStore(target) {
  const evidence = []; const unknowns = [];
  return {
    evidence, unknowns,
    add(area, label, { url = null, kind = "observation", data = null, note = null, id: forced = null } = {}) {
      const id = forced || `E${Math.max(0, ...evidence.map((e) => Number(e.id.slice(1)) || 0)) + 1}`;
      evidence.push({ id, kind, area, label, url, observed_at: new Date().toISOString(), data, ...(note ? { note } : {}) });
      return id;
    },
    unknown(area, what, why, check_url = null) { unknowns.push({ area, what, why, check_url }); },
    target,
  };
}

// ---------- signatures: what a script, pixel or app on the store implies ----------
// category drives the scorecard; implies is the plain reading of the signal.
const SIG = [
  // ad pixels
  ["meta_pixel", "Meta Pixel", "ads_pixel", "Buys or has bought Meta ads", [/connect\.facebook\.net\/[^"']*fbevents\.js/i, /fbq\(\s*['"]init['"]/, /"facebook_pixel_id"|facebookPixelId|meta-pixel|shopify-facebook/i], /fbq\(\s*['"]init['"]\s*,\s*['"](\d{8,20})['"]/g],
  ["tiktok_pixel", "TikTok Pixel", "ads_pixel", "Buys or has bought TikTok ads", [/analytics\.tiktok\.com/i, /ttq\.load\(/], /ttq\.load\(\s*['"]([A-Z0-9]{10,30})['"]/g],
  ["google_ads", "Google Ads tag", "ads_pixel", "Buys or has bought Google Search, Shopping or Performance Max", [/\bAW-\d{9,11}\b/, /googleadservices\.com\/pagead\/conversion/i], /\b(AW-\d{9,11})\b/g],
  ["pinterest_tag", "Pinterest Tag", "ads_pixel", "Buys or has bought Pinterest ads", [/s\.pinimg\.com\/ct\/core\.js/i, /pintrk\(\s*['"]load['"]/], /pintrk\(\s*['"]load['"]\s*,\s*['"](\d{8,16})['"]/g],
  ["snap_pixel", "Snap Pixel", "ads_pixel", "Buys or has bought Snapchat ads", [/sc-static\.net\/scevent\.min\.js/i, /snaptr\(\s*['"]init['"]/]],
  ["reddit_pixel", "Reddit Pixel", "ads_pixel", "Buys or has bought Reddit ads", [/redditstatic\.com\/ads\/pixel\.js/i, /rdt\(\s*['"]init['"]/]],
  ["x_pixel", "X Pixel", "ads_pixel", "Buys or has bought X ads", [/static\.ads-twitter\.com\/uwt\.js/i, /twq\(\s*['"](config|init)['"]/]],
  ["applovin_pixel", "AppLovin Axon pixel", "ads_pixel", "Tests AppLovin's web ads (a newer D2C prospecting channel)", [/applovin\.com\/[^"']*pixel|axon\.ai|aplvn/i]],
  ["bing_uet", "Microsoft Ads UET", "ads_pixel", "Buys or has bought Microsoft (Bing) ads", [/bat\.bing\.com\/bat\.js/i]],
  ["criteo", "Criteo", "ads_pixel", "Retargeting through Criteo", [/static\.criteo\.net|dynamic\.criteo\.com/i]],
  ["taboola", "Taboola", "ads_pixel", "Native ads (advertorial-style traffic)", [/cdn\.taboola\.com/i]],
  ["outbrain", "Outbrain", "ads_pixel", "Native ads (advertorial-style traffic)", [/amplify\.outbrain\.com|outbrain\.js/i]],
  ["podscribe", "Podscribe", "attribution", "Measures podcast ads", [/podscribe/i]],
  ["tvscientific", "tvScientific / CTV pixel", "ads_pixel", "Buys streaming TV (CTV) ads", [/tvscientific|tvsquared|mountain\.com|mntn/i]],
  // Shopify web pixels (the app sandbox): read from each app's escaped configuration in the page.
  ["tiktok_webpixel", "TikTok Pixel (Shopify app)", "ads_pixel", "Buys or has bought TikTok ads", [/pixelCode\W{1,8}[A-Z0-9]{18,22}\b/, /apiClientId\W{1,3}4383523\b/], /pixelCode\W{1,8}([A-Z0-9]{18,22})\b/g],
  ["google_webpixel", "Google & YouTube app (Google Ads, GA4)", "ads_pixel", "Google tag through Shopify; AW- ids mean Google Ads conversions", [/apiClientId\W{1,3}1780363\b/, /google_tag_ids/], /\b(AW-\d{9,11})\b/g],
  ["snap_webpixel", "Snap Pixel (Shopify app)", "ads_pixel", "Buys or has bought Snapchat ads", [/apiClientId\W{1,3}2556259\b/]],
  ["pinterest_webpixel", "Pinterest Tag (Shopify app)", "ads_pixel", "Buys or has bought Pinterest ads", [/tagID\W{1,8}26\d{11}\b/, /apiClientId\W{1,3}3009811\b/], /tagID\W{1,8}(26\d{11})\b/g],
  ["x_webpixel", "X Pixel (Shopify app)", "ads_pixel", "Buys or has bought X ads", [/eventPixelId\w*\W{1,8}tw-[a-z0-9]{5}-/i]],
  ["applovin_webpixel", "AppLovin Axon pixel", "ads_pixel", "Tests AppLovin web ads, a newer D2C prospecting channel", [/Axon Pixel/i]],
  ["superfiliate_webpixel", "Superfiliate", "affiliate", "Creator, affiliate and referral landing pages", [/apiClientId\W{1,3}4862993\b/, /superfiliate\.com/i], /micrositeDomain\W{1,8}([a-z0-9.\-]+)/gi],
  ["klaviyo_webpixel", "Klaviyo (Shopify app)", "email_sms", "Email (and maybe SMS) through Klaviyo", [/apiClientId\W{1,3}123074\b/]],
  ["shareasale_webpixel", "ShareASale / Awin", "affiliate", "Affiliate network (coupon, review and content sites)", [/apiClientId\W{1,3}(2887701|4929191)\b/, /originalNetwork\W{1,8}sas/]],
  ["everflow", "Everflow", "affiliate", "Partner and affiliate tracking (often paid media partners)", [/everflow|networkId\W{1,8}\d+\W{1,8}advertiserId|trackingDomainUrl/i]],
  ["rokt", "Rokt", "upsell", "Offers on the thank-you page: extra revenue per order or a paid acquisition channel", [/rokt/i]],
  ["euka", "Euka", "creator", "Automates TikTok Shop creator outreach (affiliate creators at scale)", [/euka\.ai/i]],
  ["refunnel", "Refunnel", "ugc", "Collects creator and customer content for ads", [/refunnel/i]],
  ["mparticle", "mParticle", "attribution", "Customer data platform (a large, data-heavy team)", [/mparticle/i]],
  ["nofraud", "NoFraud", "payments", null, [/nofraud/i]],
  // tag managers and analytics
  ["gtm", "Google Tag Manager", "tag_manager", null, [/googletagmanager\.com\/gtm\.js/i, /\bGTM-[A-Z0-9]{4,9}\b/], /\b(GTM-[A-Z0-9]{4,9})\b/g],
  ["ga4", "Google Analytics 4", "analytics", null, [/gtag\(\s*['"]config['"]\s*,\s*['"]G-/, /googletagmanager\.com\/gtag\/js\?id=G-/i], /\b(G-[A-Z0-9]{6,12})\b/g],
  ["segment", "Segment", "tag_manager", null, [/cdn\.segment\.com/i]],
  ["clarity", "Microsoft Clarity", "analytics", "Watches session recordings", [/clarity\.ms\/tag/i]],
  ["hotjar", "Hotjar", "analytics", "Watches session recordings and heatmaps", [/static\.hotjar\.com/i]],
  ["heatmap", "Heatmap.com", "analytics", "Revenue heatmaps on the store", [/heatmap\.com|heatmapcore/i]],
  // attribution
  ["triple_whale", "Triple Whale", "attribution", "Measures ad return with first-party attribution (a serious paid buyer)", [/triplewhale|triplepixel|tw-pixel/i]],
  ["northbeam", "Northbeam", "attribution", "Multi-touch attribution (usually a large paid budget)", [/northbeam/i]],
  ["elevar", "Elevar", "attribution", "Server-side tracking for ad platforms", [/elevar/i]],
  ["polar", "Polar Analytics", "attribution", "Attribution and BI for Shopify", [/polaranalytics|polar-pixel/i]],
  ["rockerbox", "Rockerbox", "attribution", "Multi-touch attribution", [/rockerbox/i]],
  ["littledata", "Littledata", "attribution", "Server-side analytics for Shopify", [/littledata/i]],
  // email and SMS
  ["klaviyo", "Klaviyo", "email_sms", "Email (and maybe SMS) through Klaviyo", [/klaviyo\.com\/onsite|static\.klaviyo\.com|klaviyo_subscribe|_learnq/i], /company_id=([A-Za-z0-9]{6})/g],
  ["attentive", "Attentive", "email_sms", "SMS marketing at scale", [/attn\.tv|attentivemobile/i]],
  ["postscript", "Postscript", "email_sms", "SMS marketing for Shopify", [/postscript\.io|sdk\.postscript/i]],
  ["omnisend", "Omnisend", "email_sms", "Email and SMS through Omnisend", [/omnisnippet|omnisend/i]],
  ["mailchimp", "Mailchimp", "email_sms", "Email through Mailchimp", [/chimpstatic\.com|list-manage\.com/i]],
  ["emarsys", "Emarsys / SAP", "email_sms", "Enterprise email", [/emarsys/i]],
  ["braze", "Braze", "email_sms", "Lifecycle messaging through Braze", [/braze\.com|appboy/i]],
  ["justuno", "Justuno", "popup", "Pop-ups and email capture", [/justuno/i]],
  ["privy", "Privy", "popup", "Pop-ups and email capture", [/privy\.com|widget\.privy/i]],
  ["wunderkind", "Wunderkind", "popup", "Identity-based email and SMS triggers", [/wunderkind|bounceexchange|bx-cdn/i]],
  ["retention_com", "Retention.com", "email_sms", "Identifies anonymous visitors to email them", [/retention\.com|reemail/i]],
  // subscriptions
  ["recharge", "Recharge", "subscription", "Subscribe and save", [/rechargecdn|rechargeapps|recharge-subscriptions|ReCharge/]],
  ["skio", "Skio", "subscription", "Subscribe and save", [/skio\.com|skio-plan|skio/i]],
  ["loop_subs", "Loop Subscriptions", "subscription", "Subscribe and save", [/loopsubscriptions|loop-subscriptions/i]],
  ["stay_ai", "Stay AI", "subscription", "Subscribe and save", [/stay\.ai|retextion/i]],
  ["ordergroove", "Ordergroove", "subscription", "Subscribe and save", [/ordergroove/i]],
  ["smartrr", "Smartrr", "subscription", "Subscribe and save", [/smartrr/i]],
  ["appstle", "Appstle", "subscription", "Subscribe and save", [/appstle/i]],
  // reviews and UGC
  ["okendo", "Okendo", "reviews", "Reviews and UGC", [/okendo/i]],
  ["yotpo", "Yotpo", "reviews", "Reviews (and maybe loyalty or SMS)", [/yotpo/i]],
  ["junip", "Junip", "reviews", "Reviews and UGC", [/junip/i]],
  ["judgeme", "Judge.me", "reviews", "Reviews", [/judge\.me|judgeme/i]],
  ["loox", "Loox", "reviews", "Photo reviews", [/loox\.io|loox/i]],
  ["stamped", "Stamped", "reviews", "Reviews and loyalty", [/stamped\.io/i]],
  ["bazaarvoice", "Bazaarvoice", "reviews", "Reviews syndicated to retailers", [/bazaarvoice/i]],
  ["powerreviews", "PowerReviews", "reviews", "Reviews syndicated to retailers", [/powerreviews/i]],
  ["trustpilot_widget", "Trustpilot widget", "reviews", "Shows Trustpilot rating", [/widget\.trustpilot\.com/i]],
  ["foursixty", "Foursixty / Later", "ugc", "Shoppable Instagram or UGC gallery", [/foursixty/i]],
  ["archive", "Archive", "ugc", "Collects creator and customer content", [/archive\.com\/|archive-ugc/i]],
  ["videowise", "Videowise / Tolstoy / Firework", "ugc", "Shoppable video on the store", [/videowise|tolstoy|fireworktv|firework\.com/i]],
  // loyalty and referral
  ["smile", "Smile.io", "loyalty", "Points and referral program", [/smile\.io|smile-ui/i]],
  ["loyaltylion", "LoyaltyLion", "loyalty", "Points and loyalty program", [/loyaltylion/i]],
  ["rise_ai", "Rise.ai", "loyalty", "Store credit and gift cards", [/rise\.ai|rise-ai/i]],
  ["friendbuy", "Friendbuy", "referral", "Refer-a-friend program", [/friendbuy/i]],
  ["talkable", "Talkable", "referral", "Refer-a-friend program", [/talkable/i]],
  ["mention_me", "Mention Me", "referral", "Refer-a-friend program", [/mention-me|mentionme/i]],
  // affiliates and creators
  ["impact", "impact.com", "affiliate", "Affiliate and partner program", [/impact\.com|impactradius|irclickid|utt\.impactcdn/i]],
  ["refersion", "Refersion", "affiliate", "Affiliate and creator program", [/refersion/i]],
  ["shareasale", "ShareASale / Awin", "affiliate", "Affiliate network", [/shareasale|awin1|dwin1/i]],
  ["social_snowball", "Social Snowball", "affiliate", "Turns customers into affiliates", [/socialsnowball|social-snowball/i]],
  ["superfiliate", "Superfiliate", "affiliate", "Creator and referral landing pages", [/superfiliate/i]],
  ["grin", "GRIN", "creator", "Creator (influencer) program", [/grin\.co|grin-sdk/i]],
  ["aspire", "Aspire", "creator", "Creator (influencer) program", [/aspireiq|aspire\.io/i]],
  ["shopmy", "ShopMy", "creator", "Creator storefronts and gifting", [/shopmy/i]],
  ["ltk", "LTK (rewardStyle)", "creator", "Creator commerce links", [/rewardstyle|liketoknow|shopltk/i]],
  ["upfluence", "Upfluence", "creator", "Creator program", [/upfluence/i]],
  // CRO, upsell, search, quiz
  ["rebuy", "Rebuy", "upsell", "Personalized upsells and cart offers", [/rebuyengine|rebuy\.app|rebuy-/i]],
  ["reconvert", "ReConvert", "upsell", "Post-purchase upsells", [/reconvert/i]],
  ["aftersell", "AfterSell / Zipify OCU", "upsell", "Post-purchase one-click upsells", [/aftersell|zipify/i]],
  ["upcart", "UpCart / Monster cart", "upsell", "Slide cart with upsells and progress bar", [/upcart|monster-cart|cartdrawer/i]],
  ["intelligems", "Intelligems", "testing", "Price and shipping A/B tests", [/intelligems/i]],
  ["shoplift", "Shoplift", "testing", "Storefront A/B tests", [/shoplift/i]],
  ["vwo", "VWO", "testing", "A/B tests the store", [/visualwebsiteoptimizer|vwo_code/i]],
  ["optimizely", "Optimizely", "testing", "A/B tests the store", [/optimizely/i]],
  ["convert", "Convert", "testing", "A/B tests the store", [/cdn-\d\.convertexperiments/i]],
  ["octane", "Octane AI", "quiz", "Product-finder quiz that captures emails", [/octaneai|octane-ai/i]],
  ["typeform", "Typeform", "quiz", "Quiz or survey", [/typeform/i]],
  ["searchspring", "Searchspring", "search", "Merchandised site search", [/searchspring/i]],
  ["klevu", "Klevu", "search", "AI site search", [/klevu/i]],
  ["algolia", "Algolia", "search", "Site search", [/algolia/i]],
  ["boost", "Boost Commerce", "search", "Filters and search", [/boostcommerce|bc-sf-filter/i]],
  ["nosto", "Nosto", "search", "Personalization", [/nosto/i]],
  // post-purchase, support, returns, shipping
  ["fairing", "Fairing (post-purchase survey)", "survey", "Asks buyers 'how did you hear about us?' (attribution)", [/fairing|enquirelabs/i]],
  ["knocommerce", "KnoCommerce", "survey", "Post-purchase attribution survey", [/knocommerce/i]],
  ["gorgias", "Gorgias", "support", "Support desk with sales chat", [/gorgias/i]],
  ["zendesk", "Zendesk", "support", "Support desk", [/zdassets|zendesk/i]],
  ["intercom", "Intercom", "support", "Chat support", [/intercom/i]],
  ["loop_returns", "Loop Returns", "returns", "Exchange-first returns", [/loopreturns/i]],
  ["narvar", "Narvar", "returns", "Branded tracking and returns", [/narvar/i]],
  ["aftership", "AfterShip", "returns", "Branded tracking", [/aftership/i]],
  ["route", "Route", "returns", "Shipping protection add-on", [/route\.com|routeapp|route-widget/i]],
  ["corso", "Corso / Navidium", "returns", "Shipping protection add-on", [/corso|navidium/i]],
  ["global_e", "Global-e", "international", "Cross-border checkout", [/global-e|globale/i]],
  // payments and BNPL
  ["shop_pay", "Shop Pay", "payments", "Fast checkout for Shopify buyers", [/shop-pay|shopPay|shop_pay/i]],
  ["shop_pay_installments", "Shop Pay Installments", "bnpl", "Pay later at checkout", [/shopify-payment-terms|installments/i]],
  ["afterpay", "Afterpay / Clearpay", "bnpl", "Pay later", [/afterpay|clearpay/i]],
  ["klarna", "Klarna", "bnpl", "Pay later", [/klarna/i]],
  ["affirm", "Affirm", "bnpl", "Pay over time (higher prices)", [/affirm\.com|affirm-/i]],
  ["catch", "Catch / Sezzle / Zip", "bnpl", "Pay later", [/sezzle|quadpay|zip\.co/i]],
  // marketplaces and retail locators
  ["amazon_buy", "Buy with Prime", "marketplace", "Lets shoppers check out with Amazon Prime", [/buywithprime|buy-with-prime/i]],
  ["store_locator", "Store locator", "retail", "Sells in physical retail", [/storemapper|stockist\.co|storerocket|locally\.com|destini|storepoint/i]],
  // consent
  ["onetrust", "OneTrust", "consent", null, [/onetrust|cookielaw/i]],
  ["pandectes", "Consent banner", "consent", null, [/pandectes|cookiebot|consentmo|termly/i]],
];
const ALIAS = { tiktok_pixel: "tiktok_webpixel", google_ads: "google_webpixel", snap_pixel: "snap_webpixel", pinterest_tag: "pinterest_webpixel", x_pixel: "x_webpixel", applovin_pixel: "applovin_webpixel", superfiliate: "superfiliate_webpixel", klaviyo: "klaviyo_webpixel", shareasale: "shareasale_webpixel" };
const SIG_BY_ID = Object.fromEntries(SIG.map(([id, name, cat, implies]) => [id, { id, name, cat, implies }]));
function scanSignatures(text, found, where) {
  for (const [id, , , , pats, idPat] of SIG) {
    if (!pats.some((p) => p.test(text))) continue;
    const f = found.get(id) || { id, where: new Set(), ids: new Set() };
    f.where.add(where);
    if (idPat) for (const m of text.matchAll(idPat)) if (m[1]) f.ids.add(m[1]);
    found.set(id, f);
  }
}

// ---------- page parsing ----------
function parseJsonLd(html) {
  const out = [];
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { const j = JSON.parse(m[1].trim()); const list = Array.isArray(j) ? j : j["@graph"] ? j["@graph"] : [j]; out.push(...list); } catch { /* malformed block */ }
  }
  return out;
}
const typeIs = (o, t) => [].concat(o?.["@type"] || []).some((x) => String(x).toLowerCase() === t.toLowerCase());

function socialLinks(html, base) {
  const map = { instagram: /instagram\.com\/(?!p\/|reel\/|explore)([A-Za-z0-9_.]+)/i, tiktok: /tiktok\.com\/@([A-Za-z0-9_.]+)/i, facebook: /facebook\.com\/(?!sharer|share|dialog|tr\b|plugins)([A-Za-z0-9_.\-]+)/i, youtube: /youtube\.com\/(@[A-Za-z0-9_.\-]+|c\/[^"'?/]+|channel\/[^"'?/]+|user\/[^"'?/]+)/i, pinterest: /pinterest\.[a-z.]+\/(?!pin\/)([A-Za-z0-9_]+)/i, x: /(?:twitter|x)\.com\/(?!intent|share|home)([A-Za-z0-9_]+)/i, linkedin: /linkedin\.com\/company\/([^"'?/]+)/i, threads: /threads\.(?:net|com)\/@([A-Za-z0-9_.]+)/i, snapchat: /snapchat\.com\/add\/([A-Za-z0-9_.\-]+)/i, reddit: /reddit\.com\/r\/([A-Za-z0-9_]+)/i };
  const out = {};
  for (const m of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const href = decode(m[1]);
    for (const [k, re] of Object.entries(map)) { if (out[k]) continue; const mm = re.exec(href); if (mm) out[k] = abs(href, base); }
  }
  return out;
}

function headerNav(html) {
  const header = /<header\b[\s\S]*?<\/header>/i.exec(html)?.[0] || /<nav\b[\s\S]*?<\/nav>/i.exec(html)?.[0] || "";
  return uniq([...header.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => strip(m[1])).filter((t) => t && t.length > 1 && t.length < 40 && !/^(skip|close|menu|search|cart|account|log ?in|sign ?in|\d+)$/i.test(t))).slice(0, 30);
}

function announcement(html) {
  const out = [];
  for (const m of html.matchAll(/<(div|section|aside|p|a|span)\b[^>]*(?:class|id)=["'][^"']*(announcement|promo-bar|top-bar|topbar|ticker|marquee|header-banner|notification-bar)[^"']*["'][^>]*>([\s\S]{0,2500}?)<\/\1>/gi)) {
    const t = strip(m[3]); if (t && t.length > 4 && t.length < 300) out.push(t);
  }
  return uniq(out).slice(0, 6);
}

function ctas(html) {
  const out = [];
  for (const m of html.matchAll(/<(a|button)\b([^>]*)>([\s\S]{0,400}?)<\/\1>/gi)) {
    const cls = attr(`<x ${m[2]}>`, "class") || "";
    if (!/btn|button|cta/i.test(cls)) continue;
    const t = strip(m[3]); if (t && t.length > 1 && t.length < 45 && !/^(close|menu|search|cart|×|x|prev|next|previous)$/i.test(t)) out.push(t);
  }
  const counts = {}; for (const t of out) counts[t] = (counts[t] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([text, n]) => ({ text, n }));
}

// Offer and proof phrases in visible text. Each hit keeps the exact phrase with context.
const OFFER_PATTERNS = [
  ["free_shipping", /free (?:standard |us |uk |ground |express )?(?:shipping|delivery)[^.!|•\n]{0,40}/gi],
  ["percent_off", /\b(?:up to |save |get |take |extra )?\d{1,2}% off[^.!|•\n]{0,40}/gi],
  ["amount_off", /[$£€₹]\s?\d{1,4}(?:\.\d{2})? off[^.!|•\n]{0,40}/gi],
  ["subscribe_save", /subscribe (?:&|and) save[^.!|•\n]{0,40}|save \d{1,2}%[^.!|•\n]{0,20}subscri[^.!|•\n]{0,30}/gi],
  ["guarantee", /\d{2,3}[- ]day[^.!|•\n]{0,30}(?:guarantee|returns?|trial)|money[- ]back guarantee|satisfaction guarantee|lifetime (?:warranty|guarantee)/gi],
  ["bundle", /bundle (?:&|and) save|build (?:a|your) (?:own )?(?:bundle|box|kit|set)|buy (?:\d|one|two) get[^.!|•\n]{0,30}|bogo/gi],
  ["gift", /free gift[^.!|•\n]{0,40}|gift with purchase/gi],
  ["social_proof", /(?:over |more than )?[\d.,]+\s?(?:k|m|million|thousand)?\+?\s(?:5[- ]star |five[- ]star |verified )?(?:reviews|customers|happy customers|sold|orders|bottles sold|members)\b/gi],
  ["press", /as (?:seen|featured) (?:in|on)/gi],
  ["urgency", /only \d+ left|selling fast|low stock|sold out soon|limited (?:time|edition|stock|run)|ends (?:tonight|soon|today|sunday|midnight)|while supplies last/gi],
  ["clinical", /clinically (?:proven|tested|studied)|dermatologist[- ](?:tested|approved|recommended)|third[- ]party tested|lab[- ]tested|backed by science|nsf certified/gi],
  ["values", /\b(?:b[- ]corp|carbon[- ]neutral|cruelty[- ]free|vegan|plastic[- ]free|organic|non[- ]gmo|sustainab\w+|recycl\w+|1% for the planet)\b/gi],
  ["quiz", /take (?:the|our) quiz|find your (?:match|shade|routine|fit|formula)/gi],
  ["first_order", /(?:first|1st) order|welcome offer|join (?:the )?(?:list|club|newsletter)[^.!|•\n]{0,40}|sign up (?:for|and)[^.!|•\n]{0,40}/gi],
  ["financing", /pay in 4|4 interest[- ]free (?:payments|installments)|as low as [$£€][\d.]+\/mo/gi],
];
function offerPhrases(text) {
  const out = {};
  for (const [k, re] of OFFER_PATTERNS) { const hits = uniq([...text.matchAll(re)].map((m) => m[0].replace(/\s+/g, " ").trim())).slice(0, 6); if (hits.length) out[k] = hits; }
  return out;
}
function freeShippingThreshold(text) {
  const m = /free (?:standard |us |uk |ground )?(?:shipping|delivery)[^.!|•\n]{0,30}?(?:over|on orders (?:over|of|above)|above|orders \+|on \$|when you spend)\s*([$£€₹]\s?\d{1,4}(?:[.,]\d{2})?)/i.exec(text) || /([$£€₹]\s?\d{1,4}(?:[.,]\d{2})?)\+?\s*(?:for|to get|and get|unlocks?)? free (?:shipping|delivery)/i.exec(text);
  return m ? m[1].replace(/\s/g, "") : null;
}

function platformOf(html, headers = {}) {
  const p = { name: "unknown" };
  if (/cdn\.shopify\.com|Shopify\.shop|shopify-features|myshopify\.com/i.test(html) || headers["x-shopid"] || headers["x-shopify-stage"]) {
    p.name = "Shopify";
    p.theme = (/Shopify\.theme\s*=\s*\{[^}]*?"name"\s*:\s*"([^"]+)"/.exec(html) || /"theme_name"\s*:\s*"([^"]+)"/.exec(html) || [])[1] || null;
    p.theme_store_id = (/"theme_store_id"\s*:\s*(\d+|null)/.exec(html) || [])[1] || null;
    p.myshopify = (/Shopify\.shop\s*=\s*"([^"]+)"/.exec(html) || /([a-z0-9-]+\.myshopify\.com)/.exec(html) || [])[1] || null;
    p.currency = (/Shopify\.currency\s*=\s*\{"active":"([A-Z]{3})"/.exec(html) || [])[1] || null;
    p.country = (/Shopify\.country\s*=\s*"([A-Z]{2})"/.exec(html) || [])[1] || null;
    p.headless = /__NEXT_DATA__|hydrogen|oxygen/i.test(html) && !/Shopify\.theme/.test(html);
  } else if (/__NEXT_DATA__|_next\/static/.test(html)) p.name = "Custom Next.js (headless)";
  else if (/demandware|salesforce commerce/i.test(html)) p.name = "Salesforce Commerce Cloud";
  else if (/bigcommerce/i.test(html)) p.name = "BigCommerce";
  else if (/woocommerce|wp-content/i.test(html)) p.name = "WooCommerce / WordPress";
  else if (/mage\/|magento/i.test(html)) p.name = "Magento / Adobe Commerce";
  else if (/wix\.com|wixstatic/i.test(html)) p.name = "Wix";
  else if (/squarespace/i.test(html)) p.name = "Squarespace";
  return p;
}

// ---------- brand look (for an on-brand report) ----------
function hexToRgb(h) { h = h.replace("#", ""); if (h.length === 3) h = [...h].map((c) => c + c).join(""); if (!/^[0-9a-f]{6}$/i.test(h)) return null; return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
const rgbToHex = ([r, g, b]) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
function hsl([r, g, b]) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; const d = mx - mn; const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)); return { s, l }; }
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
function brandLook(html, css, base) {
  const all = html + "\n" + css;
  const counts = new Map();
  const bump = (rgb, w = 1) => { if (!rgb) return; const hx = rgbToHex(rgb); counts.set(hx, (counts.get(hx) || 0) + w); };
  for (const m of all.matchAll(/#([0-9a-f]{6}|[0-9a-f]{3})\b(?![0-9a-f])/gi)) bump(hexToRgb(m[1]));
  for (const m of all.matchAll(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/gi)) bump([+m[1], +m[2], +m[3]]);
  // Shopify themes store colours as "R,G,B" or "R G B" custom properties.
  for (const m of all.matchAll(/--color-[\w-]+\s*:\s*(\d{1,3})\s*,?\s+(\d{1,3})\s*,?\s+(\d{1,3})\s*[;}]/gi)) bump([+m[1], +m[2], +m[3]], 3);
  const themeColor = meta(html, "theme-color");
  const ranked = [...counts.entries()].map(([hex, n]) => ({ hex, n, rgb: hexToRgb(hex), ...hsl(hexToRgb(hex)) })).sort((a, b) => b.n - a.n);
  const lights = ranked.filter((c) => c.l > 0.88), darks = ranked.filter((c) => c.l < 0.22);
  const accents = [];
  for (const c of ranked.filter((c) => c.s > 0.22 && c.l > 0.15 && c.l < 0.85)) { if (accents.every((a) => dist(a.rgb, c.rgb) > 60)) accents.push(c); if (accents.length >= 5) break; }
  // Prefer a tinted light (cream, blush) over pure white when the brand uses one often.
  const tinted = lights.find((c) => c.hex !== "#ffffff" && c.n >= Math.max(3, (lights[0]?.n || 0) * 0.25));
  const fams = new Map();
  for (const m of all.matchAll(/font-family\s*:\s*([^;}{]+)/gi)) {
    const first = m[1].split(",")[0].trim().replace(/^["']|["']$/g, "").replace(/\\/g, "");
    if (!first || /^(var\(|inherit|initial|unset|-apple-system|system-ui|ui-\w+|blinkmacsystemfont|segoe ui|roboto$|sans-serif|serif|monospace|arial|helvetica|times|georgia|courier|icons?|fontawesome|font awesome|swiper|slick|star|judgeme|yotpo|okendo|klaviyo|inter var)/i.test(first) || /icon|glyph|awesome/i.test(first)) continue;
    fams.set(first, (fams.get(first) || 0) + 1);
  }
  const faces = [];
  for (const m of all.matchAll(/@font-face\s*\{([^}]+)\}/gi)) {
    const fam = /font-family\s*:\s*["']?([^;"']+)/i.exec(m[1])?.[1]?.trim(); const src = /url\(\s*["']?([^"')]+\.woff2[^"')]*)["']?\s*\)/i.exec(m[1])?.[1];
    const weight = /font-weight\s*:\s*([^;]+)/i.exec(m[1])?.[1]?.trim() || "400"; const style = /font-style\s*:\s*([^;]+)/i.exec(m[1])?.[1]?.trim() || "normal";
    if (fam && src && !/icon|awesome|glyph|star|swiper|slick/i.test(fam)) faces.push({ family: fam, weight, style, src: abs(src.replace(/\\/g, ""), base) });
  }
  const googleFonts = uniq([...html.matchAll(/fonts\.googleapis\.com\/css2?\?family=([^"'&]+)/gi)].flatMap((m) => decodeURIComponent(m[1]).split("|").map((f) => f.split(":")[0].replace(/\+/g, " "))));
  // Role fonts first: theme variables (Shopify themes declare --font-body-family and --font-heading-family), then the
  // body and h1 rules. Frequency alone picks a collab or promo face that appears in many rules.
  const firstFam = (v) => (v || "").split(",")[0].trim().replace(/^["']|["']$/g, "").replace(/\\/g, "") || null;
  const cleanFam = (f) => (f && !/^(var\(|inherit|initial|unset|-apple-system|system-ui|ui-\w+|sans-serif|serif|monospace)/i.test(f) ? f : null);
  const bodyVar = cleanFam(firstFam(/--font-(?:body|base|text|primary)(?:-family)?\s*:\s*([^;}{]+)/i.exec(all)?.[1]));
  const headVar = cleanFam(firstFam(/--font-(?:heading|header|display|title|secondary)(?:-family)?\s*:\s*([^;}{]+)/i.exec(all)?.[1]));
  const bodyRule = cleanFam(firstFam(/(?:^|[}\s,])body\s*(?:,[^{]*)?\{[^}]*?font-family\s*:\s*([^;}]+)/i.exec(all)?.[1]));
  const headRule = cleanFam(firstFam(/(?:^|[}\s,])h1\s*(?:,[^{]*)?\{[^}]*?font-family\s*:\s*([^;}]+)/i.exec(all)?.[1]));
  const heading = headVar || headRule || null, bodyFace = bodyVar || bodyRule || null;
  const families = uniq([heading, bodyFace, ...[...fams.entries()].sort((a, b) => b[1] - a[1]).map(([f]) => f)].filter(Boolean));
  const faceFamilies = uniq(faces.map((f) => f.family));
  return {
    background: tinted?.hex || lights[0]?.hex || "#ffffff",
    text: darks[0]?.hex || "#111111",
    accents: accents.map((c) => c.hex),
    theme_color: themeColor,
    palette_counts: ranked.slice(0, 16).map(({ hex, n }) => ({ hex, n })),
    fonts: { heading: heading || families[0] || null, body: bodyFace || null, families: uniq([...families, ...faceFamilies]).slice(0, 6), google: googleFonts.slice(0, 4), faces: faces.slice(0, 8) },
  };
}

async function loadRobots(origin) {
  const host = new URL(origin).host; if (ROBOTS.has(host)) return;
  const r = await get(`${origin}/robots.txt`, { accept: "text/plain,*/*", tries: 1 });
  ROBOTS.set(host, r.ok && !/<html/i.test(r.text.slice(0, 200)) ? robotsRules(r.text) : []);
}

// ---------- collectors ----------
async function collectHome(S, origin, ctx) {
  const r = await get(origin + "/");
  if (!r.ok) { S.unknown("site", "Homepage", `Could not load the homepage (${r.status || r.error}). The store may refuse automated readers; read it yourself in a browser and paste what you need, or work from screenshots the owner shares. Do not try to get around the block.`, origin); return null; }
  const html = r.text; ctx.homeHtml = html; ctx.finalUrl = r.url;
  const ld = parseJsonLd(html); ctx.ld = ld;
  const org = ld.find((o) => typeIs(o, "Organization") || typeIs(o, "Corporation") || typeIs(o, "Brand") || typeIs(o, "OnlineStore"));
  const plat = platformOf(html, r.headers); ctx.platform = plat;
  const title = strip(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] || "");
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1])).filter(Boolean).slice(0, 4);
  const h2s = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => strip(m[1])).filter((t) => t && t.length < 120).slice(0, 14);
  const desc = meta(html, "description") || meta(html, "og:description");
  ctx.brandName = org?.name || meta(html, "og:site_name") || title.split(/[|–—-]/).pop().trim() || ctx.host;
  ctx.homeText = strip(html);
  ctx.ids.home = S.add("site", "Homepage pitch: title, description and headings", { url: r.url, data: { title, meta_description: desc, h1: h1s, h2: h2s, og_title: meta(html, "og:title"), lang: attr(/<html\b[^>]*>/i.exec(html)?.[0] || "", "lang") } });
  S.add("site", "Store platform and theme", { url: r.url, data: plat });
  const hreflang = uniq([...html.matchAll(/<link\b[^>]*hreflang=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1])).filter((h) => h !== "x-default");
  if (hreflang.length) S.add("site", "International versions (hreflang)", { url: r.url, data: { locales: hreflang } });
  const nav = headerNav(html); if (nav.length) S.add("site", "Main menu labels", { url: r.url, data: { labels: nav } });
  const ann = announcement(html); if (ann.length) ctx.ids.announcement = S.add("offer", "Announcement bar text", { url: r.url, data: { text: ann } });
  const c = ctas(html); if (c.length) S.add("site", "Button and call-to-action labels on the homepage", { url: r.url, data: { ctas: c } });
  const offers = offerPhrases(ctx.homeText); const fs_ = freeShippingThreshold(ctx.homeText + " " + ann.join(" "));
  if (Object.keys(offers).length || fs_) ctx.ids.homeOffers = S.add("offer", "Offer, proof and urgency phrases on the homepage", { url: r.url, data: { free_shipping_threshold: fs_, ...offers } });
  ctx.freeShipping = fs_;
  const socials = socialLinks(html, r.url); ctx.socials = socials;
  if (org?.sameAs) for (const s of [].concat(org.sameAs)) { for (const k of ["instagram", "tiktok", "facebook", "youtube", "pinterest", "linkedin"]) if (!socials[k] && s.includes(k)) socials[k] = s; }
  if (Object.keys(socials).length) ctx.ids.socials = S.add("social", "Social profiles linked from the store", { url: r.url, data: socials });
  // brand look
  const cssLinks = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)].map((m) => abs(attr(m[0], "href"), r.url)).filter(Boolean);
  const inlineCss = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
  let css = inlineCss;
  const pick = cssLinks.filter((u) => /theme|base|main|app|style|global/i.test(u) && !/fonts\.googleapis/.test(u)).slice(0, 2);
  for (const u of pick) { const cr = await get(u, { accept: "text/css,*/*;q=0.1" }); if (cr.ok) css += "\n" + cr.text.slice(0, 900000); }
  const look = brandLook(html, css, r.url);
  // The brand's logo lives in the header, usually inside the link home. Press, payment and award logos elsewhere on the
  // page also say "logo", so look in the header first and skip anything named after someone else.
  const notOurs = /forbes|vogue|times|nyt|wsj|today|oprah|allure|elle|glamour|cosmo|gq|wired|cnn|bbc|buzzfeed|people|instyle|byrdie|refinery|bustle|insider|good ?housekeeping|tiktok|instagram|facebook|youtube|pinterest|twitter|visa|mastercard|amex|paypal|klarna|afterpay|apple ?pay|google ?pay|shop ?pay|press|as-seen|featured|award|badge|trustpilot|cert|b-?corp|leaping|usda|nsf|gmp|vegan/i;
  const headerHtml = /<header\b[\s\S]*?<\/header>/i.exec(html)?.[0] || html.slice(0, 60000);
  // Links home, anywhere on the page; one labelled "home", "logo" or with the brand's name wins over a menu tile.
  const hrefOf = (a) => attr(`<a ${a}>`, "href") || "";
  const homeLinks = [...html.matchAll(/<a\b([^>]*href=["'](?:\/|https?:\/\/[^"'/]+\/?)["'][^>]*)>([\s\S]{0,60000}?)<\/a>/gi)].map((m) => ({ attrs: m[1], inner: m[2] })).filter((l) => /<img\b|<svg\b/i.test(l.inner) && (!/^https?:\/\//.test(hrefOf(l.attrs)) || hrefOf(l.attrs).includes(ctx.host)));
  const brandKey4 = fold(ctx.brandName || "").slice(0, 4);
  const labelled = homeLinks.find((l) => /aria-label=["'][^"']*home|logo|header__heading|site-header/i.test(l.attrs) || (brandKey4 && fold(attr(`<a ${l.attrs}>`, "aria-label") || "").includes(brandKey4)));
  const homeLink = (labelled || homeLinks.find((l) => headerHtml.includes(l.inner)))?.inner;
  const imgOk = (t) => t && !notOurs.test((attr(t, "src") || "") + " " + (attr(t, "alt") || "") + " " + (attr(t, "class") || ""));
  const homeImg = homeLink && /<img\b[^>]*>/i.exec(homeLink)?.[0];
  const logoTag = (imgOk(homeImg) && homeImg) || [...headerHtml.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]).find((t) => /logo/i.test((attr(t, "class") || "") + (attr(t, "alt") || "") + (attr(t, "src") || "")) && imgOk(t)) || [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]).find((t) => /logo/i.test((attr(t, "class") || "") + (attr(t, "alt") || "")) && imgOk(t) && new RegExp(fold(ctx.brandName || "").slice(0, 5) || "logo", "i").test(fold((attr(t, "alt") || "") + (attr(t, "src") || ""))));
  const homeSvg = homeLink && !homeImg ? /<svg[\s\S]*?<\/svg>/i.exec(homeLink)?.[0] : null;
  const logoSvg = homeSvg || /<a\b[^>]*class=["'][^"']*(?:logo|header__heading-link|site-header__logo)[^"']*["'][^>]*>\s*(<svg[\s\S]*?<\/svg>)/i.exec(headerHtml)?.[1] || /<(?:div|span|h1)\b[^>]*class=["'][^"']*logo[^"']*["'][^>]*>\s*(?:<a\b[^>]*>)?\s*(<svg[\s\S]*?<\/svg>)/i.exec(headerHtml)?.[1];
  const logo = {
    img: logoTag && !(homeSvg && logoSvg === homeSvg) ? abs((attr(logoTag, "src") || attr(logoTag, "data-src") || "").split(" ")[0], r.url) : null,
    svg: logoSvg && logoSvg.length < 60000 ? logoSvg : null,
    jsonld: typeof org?.logo === "string" ? org.logo : org?.logo?.url || null,
    og_image: abs(meta(html, "og:image") || "", r.url),
    icon: abs(attr([...html.matchAll(/<link\b[^>]*rel=["'][^"']*(?:apple-touch-icon|icon)[^"']*["'][^>]*>/gi)].map((m) => m[0]).pop() || "", "href") || "", r.url),
  };
  ctx.brand = { name: ctx.brandName, logo, ...look };
  ctx.ids.brand = S.add("brand", "Brand look: logo, colours and fonts read from the storefront code", { url: r.url, kind: "derivation", data: ctx.brand, note: "Read from HTML and CSS; check against a screenshot before relying on it." });
  // tags
  ctx.found = new Map(); scanSignatures(html, ctx.found, "homepage");
  const gtmIds = uniq([...html.matchAll(/\b(GTM-[A-Z0-9]{4,9})\b/g)].map((m) => m[1])).slice(0, 3);
  for (const g of gtmIds) { const gr = await get(`https://www.googletagmanager.com/gtm.js?id=${g}`, { accept: "*/*" }); if (gr.ok) scanSignatures(gr.text, ctx.found, `GTM ${g}`); }
  // Shopify web pixels are configured in a JSON blob; app ids there reveal pixels that load late.
  const webPixels = /webPixelsConfigList\s*[:=]\s*(\[[\s\S]*?\])\s*[,;}]\s*(?:\n|initData|"|var)/.exec(html)?.[1];
  if (webPixels) scanSignatures(webPixels, ctx.found, "Shopify web pixels");
  return html;
}

async function collectCatalogue(S, origin, ctx) {
  const maxPages = Number(opt("max-pages", 8));
  const products = [];
  let firstUrl = null;
  for (let page = 1; page <= maxPages; page++) {
    const u = `${origin}/products.json?limit=250&page=${page}`; firstUrl ||= u;
    const r = await getJson(u);
    if (!r.ok || !Array.isArray(r.json?.products)) { if (page === 1) { S.unknown("catalogue", "Full product catalogue", `The public catalogue endpoint did not answer (${r.status || r.error}). On a non-Shopify store, read the collection pages instead.`, origin + "/collections/all"); return; } break; }
    products.push(...r.json.products);
    if (r.json.products.length < 250) break;
    await sleep(300);
  }
  if (!products.length) return;
  ctx.products = products;
  const cur = ctx.platform?.currency || null;
  const rows = products.map((p) => {
    const vs = p.variants || []; const prices = vs.map((v) => parseFloat(v.price)).filter(Number.isFinite);
    const cmp = vs.map((v) => [parseFloat(v.price), parseFloat(v.compare_at_price)]).filter(([a, b]) => Number.isFinite(b) && b > a);
    // compare_at belongs to the cheapest variant, so "price" and "compare_at" always describe the same item.
    const cheapest = vs.filter((v) => Number.isFinite(parseFloat(v.price))).sort((a, b) => parseFloat(a.price) - parseFloat(b.price))[0];
    const cheapCmp = cheapest && parseFloat(cheapest.compare_at_price) > parseFloat(cheapest.price) ? parseFloat(cheapest.compare_at_price) : null;
    return {
      title: p.title, handle: p.handle, type: p.product_type || "", vendor: p.vendor || "", tags: Array.isArray(p.tags) ? p.tags : String(p.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
      price: prices.length ? Math.min(...prices) : null, price_max: prices.length ? Math.max(...prices) : null,
      compare_at: cheapCmp, discount: cmp.length ? Math.max(...cmp.map(([a, b]) => 1 - a / b)) : 0,
      variants: vs.length, available: vs.some((v) => v.available !== false), images: (p.images || []).length, image: p.images?.[0]?.src || null,
      published_at: p.published_at || p.created_at, created_at: p.created_at, updated_at: p.updated_at,
    };
  });
  ctx.rows = rows;
  const sellable = rows.filter((r) => r.price > 0 && !/gift ?card|e-?gift|shipping protection|route|insurance|donation|sample|free gift/i.test(r.title + " " + r.type));
  const prices = sellable.map((r) => r.price);
  const onSale = sellable.filter((r) => r.discount > 0.01);
  const now = Date.now();
  const pub = rows.map((r) => Date.parse(r.published_at)).filter(Number.isFinite);
  const within = (d) => pub.filter((t) => now - t <= d * DAY).length;
  const byMonth = {}; for (const t of pub) { if (now - t > 548 * DAY) continue; const k = isoDay(t).slice(0, 7); byMonth[k] = (byMonth[k] || 0) + 1; }
  const months = []; for (let i = 17; i >= 0; i--) { const d = new Date(); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() - i); const k = d.toISOString().slice(0, 7); months.push({ month: k, launches: byMonth[k] || 0 }); }
  const typeCounts = {}; for (const r of sellable) { const k = r.type || "(no type)"; typeCounts[k] = (typeCounts[k] || 0) + 1; }
  const tagCounts = {}; for (const r of rows) for (const t of r.tags) tagCounts[t] = (tagCounts[t] || 0) + 1;
  const vendors = {}; for (const r of rows) vendors[r.vendor] = (vendors[r.vendor] || 0) + 1;
  // Price ladder: fixed tiers around the median so very different catalogues read the same way.
  const lo = quantile(prices, 0), hi = quantile(prices, 1);
  const edges = niceEdges(lo, hi);
  const ladder = edges.slice(0, -1).map((e, i) => ({ from: e, to: edges[i + 1], products: sellable.filter((r) => r.price >= e && (i === edges.length - 2 ? r.price <= edges[i + 1] : r.price < edges[i + 1])).length }));
  const bundles = sellable.filter((r) => /\b(bundle|set|kit|duo|trio|pack|box|collection|starter|routine|value|system)\b/i.test(r.title));
  const limited = sellable.filter((r) => /\b(limited|holiday|edition|collab|seasonal|exclusive|drop)\b|\s[x×]\s/i.test(r.title + " " + r.tags.join(" ")));
  const hiddenTag = /^(hidden|hide|hidden[-_ ]product|no-?index|nosearch|offer|lp|landing|upsell|gwp|free[-_ ]?gift|bundle[-_ ]only|subscri\w*[-_ ]only|ad[-_ ]only|exclusive|partner|vip|promo)$/i;
  const hiddenHandle = /(subscri\w*|sub|bundle|ad|offer|member)[-_]only|[-_]only[-_]\d+$|(^|[-_])(lp|landing|offer|upsell|gwp|exclusive|partner|vip|special|promo|fb|tt|ig|meta|tiktok|influencer|affiliate)([-_]|$)|[-_]\d{2,3}[-_]?off([-_]|$)|[-_]v\d+$/i;
  const hidden = rows.filter((r) => r.tags.some((t) => hiddenTag.test(t)) || hiddenHandle.test(r.handle));
  const merch = rows.filter((r) => /\b(tote|hat|cap|tee|t-shirt|hoodie|sweatshirt|sticker|mug|merch|apron|socks)\b/i.test(r.title) && !/apparel|clothing|tee/i.test(ctx.brandName || ""));
  ctx.ids.catalogue = S.add("catalogue", "Catalogue size, price ladder and discounting (all public products)", {
    url: firstUrl, kind: "derivation",
    data: {
      products: rows.length, sellable_products: sellable.length, variants: rows.reduce((a, r) => a + r.variants, 0), avg_variants: round(rows.reduce((a, r) => a + r.variants, 0) / rows.length, 1), currency: cur,
      price: { min: round(lo), p25: round(quantile(prices, 0.25)), median: round(median(prices)), p75: round(quantile(prices, 0.75)), max: round(hi) },
      ladder, on_sale_share: round(onSale.length / Math.max(1, sellable.length), 3), median_discount_on_sale: round(median(onSale.map((r) => r.discount)), 3), max_discount: round(Math.max(0, ...onSale.map((r) => r.discount)), 3),
      out_of_stock_share: round(sellable.filter((r) => !r.available).length / Math.max(1, sellable.length), 3),
      avg_images_per_product: round(rows.reduce((a, r) => a + r.images, 0) / rows.length, 1),
      product_types: Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([type, n]) => ({ type, n })),
      vendors: Object.entries(vendors).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([vendor, n]) => ({ vendor, n })),
      top_tags: Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([tag, n]) => ({ tag, n })),
      bundles: { n: bundles.length, examples: bundles.slice(0, 8).map((r) => ({ title: r.title, price: r.price, compare_at: r.compare_at })) },
      limited_or_collab: { n: limited.length, examples: limited.slice(0, 8).map((r) => r.title) },
      merch: { n: merch.length, examples: merch.slice(0, 6).map((r) => r.title) },
      hidden_or_offer_only: { n: hidden.length, products: hidden.slice(0, 40).map((r) => ({ title: r.title, handle: r.handle, price: r.price, compare_at: r.compare_at, tags: r.tags.slice(0, 6) })), note: "Products tagged hidden, upsell, landing or gift, or with handles like subscribe-only, lp- or -offer, are often ad-only offers, subscription entry offers, bundle parts or post-purchase upsells." },
    },
    note: maxPagesNote(rows.length, maxPages),
  });
  ctx.ids.productList = S.add("catalogue", "Every public product: price, compare-at, type, tags and publish date", {
    url: firstUrl, data: { currency: cur, products: rows.map((r) => ({ title: r.title, handle: r.handle, type: r.type, price: r.price, price_max: r.price_max, compare_at: r.compare_at, variants: r.variants, available: r.available, published: (r.published_at || "").slice(0, 10), tags: r.tags.slice(0, 8) })) },
    note: "Price is the cheapest variant; compare_at is that same variant's compare-at price.",
  });
  ctx.ids.launches = S.add("catalogue", "Product launch cadence (publish dates of current products)", {
    url: firstUrl, kind: "derivation",
    data: { last_30_days: within(30), last_90_days: within(90), last_365_days: within(365), by_month: months, newest: [...rows].sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at)).slice(0, 10).map((r) => ({ title: r.title, published: (r.published_at || "").slice(0, 10), price: r.price, type: r.type })) },
    note: "Publish dates of products still in the catalogue; deleted products are not counted and republished products look new.",
  });
  const collections = await getJson(`${origin}/collections.json?limit=250`);
  if (collections.ok && Array.isArray(collections.json?.collections)) {
    const cols = collections.json.collections.map((c) => ({ title: c.title, handle: c.handle, products: c.products_count ?? null, updated: (c.updated_at || "").slice(0, 10) }));
    ctx.collections = cols;
    S.add("catalogue", "Collections (how the store groups products)", { url: `${origin}/collections.json`, data: { n: cols.length, collections: cols.slice(0, 120) } });
  }
}
function maxPagesNote(n, maxPages) { return n >= maxPages * 250 ? `Stopped at ${maxPages} pages (${n} products); the catalogue may be larger.` : null; }
function niceEdges(lo, hi) {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [0, 1];
  if (hi - lo < 1) return [Math.floor(lo), Math.ceil(hi) + 1];
  const span = hi - lo; const raw = span / 6; const mag = 10 ** Math.floor(Math.log10(raw)); const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= 7) || 10 * mag;
  const start = Math.floor(lo / step) * step; const edges = []; for (let e = start; e <= hi + step; e += step) { edges.push(round(e)); if (e > hi) break; }
  return edges;
}

async function collectBestSellers(S, origin, ctx) {
  if (!ctx.platform || ctx.platform.name !== "Shopify") return;
  const tries = [`${origin}/collections/all?sort_by=best-selling`, ...((ctx.collections || []).filter((c) => /best[- ]?sell|bestsell|most[- ]loved|top[- ]sell|favou?rites/i.test(c.handle + c.title)).slice(0, 1).map((c) => `${origin}/collections/${c.handle}`))];
  for (const u of tries) {
    const r = await get(u); if (!r.ok) continue;
    const handles = uniq([...r.text.matchAll(/href=["'](?:https?:\/\/[^"']+)?(?:\/collections\/[^/"']+)?\/products\/([a-z0-9][a-z0-9\-_%]*)/gi)].map((m) => m[1].toLowerCase()));
    const known = new Map((ctx.rows || []).map((x) => [x.handle, x]));
    const list = handles.filter((h) => known.size === 0 || known.has(h)).slice(0, 12);
    if (list.length < 3) continue;
    ctx.bestSellers = list.map((h) => known.get(h) || { handle: h, title: h });
    ctx.ids.bestSellers = S.add("bestsellers", u.includes("sort_by=best-selling") ? "Best sellers: the store's own 'best selling' sort of all products" : "Best sellers: the store's best-seller collection", {
      url: r.url, data: { ranked: ctx.bestSellers.map((x, i) => ({ rank: i + 1, title: x.title, handle: x.handle, price: x.price ?? null, compare_at: x.compare_at ?? null, type: x.type ?? null, image: x.image ?? null })) },
      note: "Shopify ranks this sort by units sold; a theme can pin products, so treat the order as strong, not exact.",
    });
    return;
  }
  const known = new Map((ctx.rows || []).map((x) => [x.handle, x]));
  const featured = uniq([...(ctx.homeHtml || "").matchAll(/href=["'](?:https?:\/\/[^"']+)?(?:\/collections\/[^/"']+)?\/products\/([a-z0-9][a-z0-9\-_%]*)/gi)].map((m) => m[1].toLowerCase())).filter((h) => known.has(h)).slice(0, 12);
  if (featured.length) {
    ctx.featured = featured.map((h) => known.get(h));
    ctx.ids.featured = S.add("bestsellers", "Products the homepage pushes, in page order", { url: ctx.finalUrl, data: { ranked: ctx.featured.map((x, i) => ({ position: i + 1, title: x.title, handle: x.handle, price: x.price, compare_at: x.compare_at, type: x.type, image: x.image })) }, note: "Homepage placement shows what the brand pushes, which is usually but not always what sells most." });
  }
  S.unknown("bestsellers", "Best-selling products", "No readable best-seller list (the best-selling sort is often disallowed in robots.txt or loaded by script). Homepage placement is used instead where found.", `${origin}/collections/all?sort_by=best-selling`);
}

async function collectPdps(S, origin, ctx) {
  const merchish = /\b(tote|hat|cap|tee|t-shirt|hoodie|sweatshirt|sticker|mug|merch|apron|socks|gift ?card)\b/i;
  const picks = (ctx.bestSellers?.length ? ctx.bestSellers : ctx.featured?.length ? ctx.featured : (ctx.rows || [])).filter((r) => r.price > 0 && !merchish.test(r.title)).slice(0, 3);
  for (const p of picks) {
    const u = `${origin}/products/${p.handle}`;
    const r = await get(u); if (!r.ok) continue;
    const html = r.text; const text = strip(html);
    scanSignatures(html, ctx.found, `product page ${p.handle}`);
    const ld = parseJsonLd(html); const prod = ld.find((o) => typeIs(o, "Product")) || {};
    const agg = prod.aggregateRating || ld.find((o) => typeIs(o, "AggregateRating"));
    const reviewsText = /([\d,.]+k?)\+?\s*(?:verified |5-star |five-star )?reviews/i.exec(text)?.[1] || null;
    const js = await getJson(`${origin}/products/${p.handle}.js`);
    const spg = js.json?.selling_plan_groups || [];
    const plans = spg.flatMap((g) => (g.selling_plans || []).map((sp) => ({ name: sp.name, adjustment: sp.price_adjustments?.[0] ? `${sp.price_adjustments[0].value_type}:${sp.price_adjustments[0].value}` : null })));
    const sections = {
      guarantee: /guarantee|risk[- ]free|money back|\d{2,3}[- ]day/i.test(text), faq: /frequently asked|\bfaqs?\b/i.test(text), comparison: /\bvs\.?\b|compared to|the others|other brands|them\b.*\bus\b/i.test(text),
      ingredients_or_specs: /ingredients|what'?s inside|materials|specs|specifications|nutrition/i.test(text), how_to_use: /how to use|how it works|directions/i.test(text),
      press: /as (?:seen|featured) in/i.test(text), ugc_or_video: /<video\b|tolstoy|videowise|foursixty|ugc/i.test(html), quantity_breaks: /buy (?:2|two|3|three)|bundle (?:&|and) save|save \d+% (?:when|on) (?:you buy|2|3)|\b\d+[- ]pack\b/i.test(text),
      bnpl: /afterpay|klarna|affirm|shop ?pay installments|pay in 4|sezzle/i.test(text), urgency: /only \d+ left|selling fast|low stock|limited/i.test(text), free_shipping_note: /free (?:shipping|delivery)/i.test(text),
    };
    const id = S.add("pdp", `Product page anatomy: ${p.title}`, {
      url: r.url,
      data: { title: p.title, price: js.json ? js.json.price / 100 : p.price, compare_at: js.json?.compare_at_price ? js.json.compare_at_price / 100 : p.compare_at, rating: agg ? { value: agg.ratingValue ?? null, count: agg.reviewCount ?? agg.ratingCount ?? null } : null, reviews_text: reviewsText, subscription_plans: plans.slice(0, 6), requires_subscription: !!js.json?.requires_selling_plan, sections, offers: offerPhrases(text), variants: js.json?.variants?.length ?? p.variants ?? null, h2: [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => strip(m[1])).filter((t) => t && t.length < 90).slice(0, 12) },
    });
    (ctx.ids.pdps ||= []).push(id);
    if (plans.length) ctx.subscriptionSeen = id;
    await sleep(250);
  }
}

async function collectRobotsSitemaps(S, origin, ctx) {
  const robots = await get(`${origin}/robots.txt`, { accept: "text/plain,*/*" });
  const bots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider", "meta-externalagent", "Amazonbot"];
  const sitemaps = [];
  if (robots.ok) {
    const groups = []; let cur = null;
    for (const line of robots.text.split(/\r?\n/)) {
      const [k, ...rest] = line.split(":"); const v = rest.join(":").trim(); const key = k.trim().toLowerCase();
      if (key === "user-agent") { if (!cur || cur.rules.length) { cur = { agents: [], rules: [] }; groups.push(cur); } cur.agents.push(v); }
      else if ((key === "disallow" || key === "allow") && cur) cur.rules.push([key, v]);
      else if (key === "sitemap") sitemaps.push(v);
    }
    const stance = {};
    for (const b of bots) {
      const g = groups.find((g) => g.agents.some((a) => a.toLowerCase() === b.toLowerCase()));
      stance[b] = g ? (g.rules.some(([k, v]) => k === "disallow" && v === "/") ? "blocked" : "named, not fully blocked") : "not named (falls under *)";
    }
    ctx.ids.robots = S.add("ai_search", "AI crawler rules in robots.txt", { url: `${origin}/robots.txt`, data: stance });
  } else S.unknown("ai_search", "robots.txt", `Not readable (${robots.status || robots.error}).`, `${origin}/robots.txt`);
  const llms = await get(`${origin}/llms.txt`, { accept: "text/plain,*/*" });
  ctx.ids.llms = S.add("ai_search", "llms.txt (a file that guides AI assistants)", { url: `${origin}/llms.txt`, data: { present: llms.ok && !/<html/i.test(llms.text.slice(0, 300)), status: llms.status, first_lines: llms.ok && !/<html/i.test(llms.text.slice(0, 300)) ? llms.text.split("\n").slice(0, 8) : [] } });
  // Sitemaps
  const root = sitemaps[0] || `${origin}/sitemap.xml`;
  const sm = await get(root, { accept: "application/xml,text/xml,*/*" });
  if (!sm.ok) { S.unknown("seo", "Sitemap", `Not readable (${sm.status || sm.error}).`, root); return; }
  const locs = (x) => [...x.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/gi)].map((m) => ({ loc: decode(m[1].trim()), lastmod: m[2] || null }));
  const children = [...sm.text.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/gi)].map((m) => decode(m[1].trim()));
  const kinds = {}; const urls = [];
  if (children.length) {
    for (const c of children) { const k = /sitemap_([a-z]+)/i.exec(c)?.[1] || /\/([a-z-]+)[-_]?sitemap/i.exec(c)?.[1] || "other"; (kinds[k] ||= { files: 0, urls: 0, fetched: 0 }).files++; }
    const want = children.filter((c) => !/sitemap_products_\d+.*from=\d+.*to=\d+/.test(c) || /sitemap_products_1\b/.test(c)).slice(0, 10);
    for (const c of want) {
      const r = await get(c, { accept: "application/xml,text/xml,*/*" }); if (!r.ok) continue;
      const k = /sitemap_([a-z]+)/i.exec(c)?.[1] || /\/([a-z-]+)[-_]?sitemap/i.exec(c)?.[1] || "other";
      const l = locs(r.text); kinds[k].urls += l.length; kinds[k].fetched++; urls.push(...l.map((x) => ({ ...x, kind: k })));
    }
  } else urls.push(...locs(sm.text).map((x) => ({ ...x, kind: "urls" })));
  const now = Date.now();
  const paths = urls.map((u) => { try { return { ...u, path: new URL(u.loc).pathname }; } catch { return null; } }).filter(Boolean);
  const blogs = paths.filter((u) => /\/blogs?\/[^/]+\/[^/]+/.test(u.path) || /\/(journal|articles?|learn|stories)\/[^/]+/.test(u.path));
  const fresh = (list, d) => list.filter((u) => u.lastmod && now - Date.parse(u.lastmod) <= d * DAY).length;
  const blogNames = {}; for (const b of blogs) { const n = /\/blogs\/([^/]+)/.exec(b.path)?.[1] || b.path.split("/")[1]; blogNames[n] = (blogNames[n] || 0) + 1; }
  const pages = paths.filter((u) => /^\/pages\//.test(u.path)).map((u) => u.path);
  const flag_ = (re) => uniq([...pages, ...paths.map((u) => u.path)].filter((p) => re.test(p))).slice(0, 10);
  const pageSignals = {
    comparison: flag_(/-vs-|\/vs\/|compare|alternative|versus/i), quiz: flag_(/quiz|find-your|finder|match/i), stockists: flag_(/stockist|store-locator|find-us|where-to-buy|retail|locations/i), wholesale: flag_(/wholesale|b2b|trade|bulk/i),
    affiliate_creator: flag_(/affiliate|ambassador|creator|influencer|partner|collective/i), loyalty_referral: flag_(/reward|loyalty|refer|vip|club|perks/i), subscription: flag_(/subscri|auto-?ship|membership/i), science: flag_(/science|clinical|stud(y|ies)|research|ingredients/i),
    reviews: flag_(/reviews|testimonials/i), sustainability: flag_(/sustainab|impact|planet|mission|giving/i), gifting: flag_(/gift|corporate/i), landing_like: flag_(/^\/pages\/(lp|landing|offer|special|try|get|go|promo|deal|sale|ad|fb|ig|tt)[-/]/i),
  };
  ctx.ids.sitemap = S.add("seo", "Sitemap shape: what the store publishes", {
    url: root, kind: "derivation",
    data: { sitemap_files: children.length || 1, by_kind: kinds, urls_read: paths.length, pages_n: pages.length, blog_posts_read: blogs.length, blogs: Object.entries(blogNames).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([blog, n]) => ({ blog, n })), blog_posts_updated_90d: fresh(blogs, 90), blog_posts_updated_365d: fresh(blogs, 365), page_signals: pageSignals },
    note: children.length > 10 ? "Only the first 10 sitemap files were read." : null,
  });
  ctx.pageSignals = pageSignals;
  const recentPosts = blogs.filter((b) => b.lastmod).sort((a, b) => Date.parse(b.lastmod) - Date.parse(a.lastmod)).slice(0, 8).map((b) => ({ path: b.path, lastmod: b.lastmod.slice(0, 10) }));
  if (recentPosts.length) S.add("seo", "Most recently updated blog posts", { url: root, data: { posts: recentPosts } });
  ctx.landingLike = pageSignals.landing_like;
}

async function collectWayback(S, origin, ctx) {
  if (flag("no-wayback")) return;
  const host = new URL(origin).host;
  const cdx = await getJson(`https://web.archive.org/cdx/search/cdx?url=${host}&output=json&fl=timestamp,statuscode&filter=statuscode:200&collapse=timestamp:6&limit=400`, { timeout: 30000 });
  if (!cdx.ok || !Array.isArray(cdx.json) || cdx.json.length < 2) { S.unknown("history", "Homepage history", "The Wayback Machine did not answer.", `https://web.archive.org/web/*/${host}`); return; }
  const stamps = cdx.json.slice(1).map((r) => r[0]);
  const first = stamps[0]; const now = Date.now();
  const nearest = (yearsAgo) => { const target = now - yearsAgo * 365 * DAY; let best = null; for (const s of stamps) { const t = Date.parse(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`); if (!best || Math.abs(t - target) < Math.abs(best.t - target)) best = { s, t }; } return best?.s; };
  const picks = uniq([first, nearest(3), nearest(2), nearest(1), nearest(0.5)].filter(Boolean)).sort();
  const snaps = [];
  for (const s of picks) {
    const r = await get(`https://web.archive.org/web/${s}id_/${origin}/`, { timeout: 30000, tries: 1 }); if (!r.ok) continue;
    const t = strip(r.text);
    snaps.push({ date: `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`, title: strip(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(r.text)?.[1] || ""), description: meta(r.text, "description"), h1: [...r.text.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1])).filter(Boolean).slice(0, 2), announcement: announcement(r.text).slice(0, 2), offers: Object.fromEntries(Object.entries(offerPhrases(t)).filter(([k]) => ["free_shipping", "percent_off", "subscribe_save", "guarantee", "bundle", "social_proof"].includes(k)).map(([k, v]) => [k, v.slice(0, 2)])), url: `https://web.archive.org/web/${s}/${origin}/` });
    await sleep(400);
  }
  if (snaps.length) ctx.ids.history = S.add("history", "Homepage pitch over time (Wayback Machine snapshots)", { url: `https://web.archive.org/web/*/${host}`, data: { first_capture: `${first.slice(0, 4)}-${first.slice(4, 6)}-${first.slice(6, 8)}`, captures_monthly: stamps.length, snapshots: snaps } });
}

async function collectReviews(S, origin, ctx) {
  if (flag("no-reviews")) return;
  const host = new URL(origin).host.replace(/^www\./, "");
  const u = `https://www.trustpilot.com/review/${host}`;
  const r = await get(u, { tries: 1 });
  if (!r.ok) { S.unknown("reviews", "Off-site reviews (Trustpilot)", `No readable Trustpilot page (${r.status || r.error}).`, u); return; }
  const ld = parseJsonLd(r.text); const node = ld.find((o) => o.aggregateRating) || ld.find((o) => typeIs(o, "AggregateRating"));
  const agg = node?.aggregateRating || node;
  const score = /TrustScore\s*([\d.]+)/i.exec(strip(r.text))?.[1];
  if (agg || score) ctx.ids.trustpilot = S.add("reviews", "Trustpilot rating", { url: u, data: { rating: agg?.ratingValue ?? score ?? null, reviews: agg?.reviewCount ?? null } });
}

// ---------- Google: Ads Transparency Center, autocomplete, PageSpeed ----------
const REGION = { US: 2840, GB: 2826, UK: 2826, CA: 2124, AU: 2036, IN: 2356, DE: 2276, FR: 2250, NL: 2528, IE: 2372, NZ: 2554, AE: 2784, SG: 2702, ES: 2724, IT: 2380 };
async function collectGoogleAds(S, origin, ctx) {
  if (flag("no-google")) return;
  const country = (opt("country", ctx.platform?.country || "US") || "US").toUpperCase(); const region = REGION[country] || 2840;
  const domain = ctx.host;
  const all = []; let token = null; let totals = null; let googleStatus = null;
  for (let page = 0; page < 3; page++) {
    const req = { 2: 100, 3: { 12: { 1: domain, 2: true } }, 7: { 1: 1, 2: 30, 3: region }, ...(token ? { 4: token } : {}) };
    if (requestCount >= MAX_REQUESTS) break; requestCount++;
    let j = null;
    for (let attempt = 0; attempt < 3 && !j; attempt++) {
      try { const r = await fetch("https://adstransparency.google.com/anji/_/rpc/SearchService/SearchCreatives?authuser=", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", "user-agent": UA }, body: new URLSearchParams({ "f.req": JSON.stringify(req) }), signal: AbortSignal.timeout(20000) }); googleStatus = r.status; if (r.ok) j = await r.json(); else if (r.status === 429) await sleep(8000 * (attempt + 1)); else break; } catch (e) { googleStatus = e.name || "error"; }
    }
    if (!j) break;
    totals ||= { low: Number(j["4"]) || null, high: Number(j["5"]) || null };
    all.push(...(j["1"] || [])); token = j["2"]; if (!token) break;
    await sleep(500);
  }
  const link = `https://adstransparency.google.com/?region=${country}&domain=${domain}`;
  if (!all.length) { S.unknown("ads_google", "Google ads (Search, Shopping, YouTube, Display)", `Google's Ads Transparency Center returned no creatives for ${domain} in ${country} over the last 30 days${googleStatus && googleStatus !== 200 ? ` (it answered ${googleStatus}; 429 means try again later)` : ""}. Check by hand before saying they do not run Google ads.`, link); return; }
  const now = Date.now(); const fmt = { 1: "text", 2: "image", 3: "video" };
  const imgOf = (c) => (/https:\/\/tpc\.googlesyndication\.com\/[^"\\\s<>]+/.exec(JSON.stringify(c["3"] || {}))?.[0] || null);
  const cr = all.map((c) => ({ image: imgOf(c), advertiser: c["12"], advertiser_id: c["1"], creative: c["2"], format: fmt[c["4"]] || String(c["4"]), first: Number(c["6"]?.["1"]) * 1000, last: Number(c["7"]?.["1"]) * 1000, days_shown: c["13"] ?? null, url: `https://adstransparency.google.com/advertiser/${c["1"]}/creative/${c["2"]}?region=${country}` }));
  const byAdv = {}; for (const c of cr) byAdv[c.advertiser] = (byAdv[c.advertiser] || 0) + 1;
  const byFmt = {}; for (const c of cr) byFmt[c.format] = (byFmt[c.format] || 0) + 1;
  const main = Object.entries(byAdv).sort((a, b) => b[1] - a[1])[0][0];
  const firstSeen = Math.min(...cr.filter((c) => c.advertiser === main).map((c) => c.first).filter(Number.isFinite));
  const longest = [...cr].filter((c) => c.advertiser === main).sort((a, b) => (b.days_shown || 0) - (a.days_shown || 0)).slice(0, 8);
  const fresh = cr.filter((c) => now - c.first <= 30 * DAY).length;
  ctx.googleAds = { n: cr.length, totals, main, others: Object.keys(byAdv).length - 1 };
  ctx.ids.googleAds = S.add("ads_google", `Google ads shown in ${country} in the last 30 days (Ads Transparency Center)`, { id: ctx.reuse?.googleAds || null,
    url: link, kind: "derivation",
    data: { region: country, creatives_read: cr.length, google_total_estimate: totals, formats_in_sample: byFmt, advertisers: Object.entries(byAdv).sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n })), main_advertiser: main, oldest_first_shown_in_sample: Number.isFinite(firstSeen) ? isoDay(firstSeen) : null, new_creatives_first_shown_last_30_days: fresh, creatives_to_show: uniq([...longest.slice(0, 6), ...[...cr].filter((c) => c.advertiser === main).sort((a, b) => b.first - a.first).slice(0, 6)]).filter((c) => c.image).slice(0, 10).map((c) => ({ format: c.format, image: c.image, first_shown: isoDay(c.first), last_shown: isoDay(c.last), days_shown: c.days_shown, url: c.url })), longest_shown: longest.map((c) => ({ format: c.format, image: c.image, first_shown: isoDay(c.first), last_shown: isoDay(c.last), days_shown: c.days_shown, url: c.url })) },
    note: "Text ads are search ads; image and video include Shopping, Display, YouTube, Demand Gen and Performance Max. Other advertiser names pointing at the domain are usually affiliates, resellers or agencies. Keywords, spend and results are not public.",
  });
}

async function collectAutocomplete(S, origin, ctx) {
  if (flag("no-google")) return;
  const brand = (ctx.brandName || ctx.host.split(".")[0]).replace(/[|–—].*$/, "").trim().toLowerCase();
  const seeds = [`${brand} `, `${brand} vs`, `${brand} review`, `is ${brand}`, `${brand} discount`, `${brand} alternative`, `${brand} near me`, `${brand} amazon`];
  const out = {};
  for (const q of seeds) { const r = await getJson(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=${(ctx.platform?.country || "US").toLowerCase()}&q=${encodeURIComponent(q)}`, { tries: 1, timeout: 10000 }); if (r.ok && Array.isArray(r.json?.[1])) out[q.trim()] = r.json[1].slice(0, 10); await sleep(200); }
  if (!Object.keys(out).length) return;
  // Google may correct a brand to a common word ("gruns near me" becomes "guns near me"): keep only suggestions that name the brand.
  const bf = fold(brand); for (const k of Object.keys(out)) out[k] = out[k].filter((x) => fold(x).includes(bf.slice(0, Math.max(4, bf.length - 1))));
  const flat = uniq(Object.values(out).flat());
  const themes = { comparisons: flat.filter((s) => /\bvs\.?\b|versus|alternative|better than|like /i.test(s)), trust: flat.filter((s) => /review|legit|scam|worth|safe|side effects|complaint|lawsuit/i.test(s)), deals: flat.filter((s) => /discount|code|coupon|promo|sale|deal|black friday/i.test(s)), where_to_buy: flat.filter((s) => /near me|amazon|target|walmart|costco|whole foods|sephora|ulta|store|buy/i.test(s)), product: flat.filter((s) => !/\bvs\b|review|legit|scam|discount|code|coupon|promo|near me|amazon|target|walmart|costco/i.test(s)) };
  ctx.ids.autocomplete = S.add("search_demand", "What people type into Google with the brand name (autocomplete)", { url: `https://www.google.com/search?q=${encodeURIComponent(brand)}`, data: { by_seed: out, themes }, note: "Autocomplete reflects common searches, not volume. Retail names here are where shoppers look for the brand." });
}

async function collectPageSpeed(S, origin, ctx) {
  const key = process.env.PAGESPEED_API_KEY || opt("pagespeed-key", null);
  const target = ctx.bestSellers?.[0] ? `${origin}/products/${ctx.bestSellers[0].handle}` : origin + "/";
  const check = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(target)}`;
  if (!key && !flag("pagespeed")) { S.unknown("speed", "Mobile speed of the best seller's product page", "Not measured (PageSpeed Insights needs a free API key for repeat runs: set PAGESPEED_API_KEY or pass --pagespeed).", check); return; }
  const r = await getJson(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(target)}&strategy=mobile&category=performance${key ? `&key=${key}` : ""}`, { timeout: 90000, tries: 1 });
  if (!r.ok) { S.unknown("speed", "Mobile speed of the best seller's product page", `PageSpeed Insights did not answer (${r.status || r.error}).`, check); return; }
  const m = r.json.loadingExperience?.metrics || {}; const lh = r.json.lighthouseResult;
  const field = Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { p75: v.percentile, category: v.category }]));
  ctx.ids.speed = S.add("speed", "Mobile speed of the best seller's product page (PageSpeed Insights)", { url: check, data: { url: target, field_data_scope: r.json.loadingExperience?.id === target ? "this URL" : "origin or none", field, lab_score: lh?.categories?.performance?.score ?? null, lab_lcp_ms: lh?.audits?.["largest-contentful-paint"]?.numericValue ?? null, lab_tbt_ms: lh?.audits?.["total-blocking-time"]?.numericValue ?? null }, note: "Field data is real Chrome users (p75, 28 days); lab data is one simulated run." });
}

async function collectYouTube(S, origin, ctx) {
  const yt = ctx.socials?.youtube; if (!yt) return;
  const r = await get(yt); if (!r.ok) return;
  const cid = /"(?:channelId|externalId)"\s*:\s*"(UC[\w-]{22})"/.exec(r.text)?.[1] || /channel\/(UC[\w-]{22})/.exec(r.text)?.[1];
  const subs = /"subscriberCountText"\s*:\s*\{[^}]*?"simpleText"\s*:\s*"([^"]+)"/.exec(r.text)?.[1] || /([\d.,]+[KM]?) subscribers/.exec(strip(r.text))?.[1] || null;
  if (!cid) return;
  const feed = await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${cid}`, { accept: "application/xml,*/*" }); if (!feed.ok) return;
  const vids = [...feed.text.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => ({ title: decode(/<title>([^<]*)<\/title>/.exec(m[1])?.[1] || ""), published: /<published>([^<]+)/.exec(m[1])?.[1]?.slice(0, 10), views: Number(/views="(\d+)"/.exec(m[1])?.[1] ?? NaN), url: /<link rel="alternate" href="([^"]+)"/.exec(m[1])?.[1] }));
  if (!vids.length) return;
  const ts = vids.map((v) => Date.parse(v.published)).filter(Number.isFinite).sort((a, b) => b - a);
  const span = ts.length > 1 ? (ts[0] - ts[ts.length - 1]) / DAY : null;
  ctx.ids.youtube = S.add("social", "YouTube channel: latest uploads and views (public feed)", { url: yt, data: { subscribers: subs, uploads_in_feed: vids.length, days_since_last_upload: ts.length ? daysBetween(ts[0], Date.now()) : null, uploads_per_week: span ? round(vids.length / (span / 7), 2) : null, median_views: median(vids.map((v) => v.views)), top_by_views: [...vids].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5), latest: vids.slice(0, 5) }, note: "The public feed holds the latest 15 uploads, Shorts included." });
}

// ---------- lanes: which of your agents needs which evidence ----------
// Each lane names the AI Blocks e-commerce agents who act on it and what they need from a teardown.
export const LANES = [
  { lane: "Meta ads", agents: ["lindsey-meta-media-buyer", "dustin-ad-deployment"], keys: ["adsSummary", "adsWinners", "adsNew", "adsAngles", "stack"], needs: "Volume and launch rate, the long-running winners, landing pages and offers, creator or partner pages running ads, and the pixels and attribution they buy with." },
  { lane: "Creative strategy and production", agents: ["tendai-ad-creative", "kemal-creative-director", "devon-video-ugc", "ayaka-ad-design", "cody-video-editor", "kofi-ad-copy", "howard-copy-chief"], keys: ["adsWinners", "adsAngles", "adsNew", "googleAds", "homeOffers", "pdps"], needs: "The angles, hooks, formats and proof that keep running, what they test now, and the claims and offers behind them." },
  { lane: "Google and YouTube ads", agents: ["raymond-google-ads"], keys: ["googleAds", "autocomplete", "stack", "youtube"], needs: "Google creative volume and formats, who else bids on the brand, what people search with the brand name, and the Google tags installed." },
  { lane: "TikTok, Pinterest, Snapchat and Reddit", agents: ["zara-tiktok-ads", "ploy-tiktok-shop", "marnie-pinterest-ads", "kelsey-snapchat-ads", "nadiya-reddit-ads"], keys: ["stack", "socials", "autocomplete"], needs: "Which pixels and TikTok Shop creator tools are installed, linked accounts, and where demand shows up." },
  { lane: "Offers, pricing and merchandising", agents: ["brendan-offers", "juliet-merchandising", "sabelo-product-portfolio", "radek-unit-economics"], keys: ["catalogue", "bestSellers", "featured", "homeOffers", "announcement", "pdps", "history"], needs: "The price ladder, discount depth, bundles, subscription terms, free-shipping threshold, hero products and how offers changed over time." },
  { lane: "Landing pages, product pages and CRO", agents: ["annabel-landing-pages", "georgia-product-copy", "gretchen-store-testing", "larissa-store-ux", "aurelio-product-photos"], keys: ["pdps", "sitemap", "homeOffers", "stack", "speed", "adsAngles"], needs: "Product page anatomy, ad landing pages, testing and upsell tools, proof blocks and page speed." },
  { lane: "Retention: email, SMS, subscription, loyalty", agents: ["imogen-retention", "morag-email-sms", "lucia-email-copy", "latoya-post-purchase"], keys: ["stack", "pdps", "homeOffers", "sitemap"], needs: "The email and SMS stack, capture offers, subscription plans and discounts, loyalty and referral programs, post-purchase offers." },
  { lane: "Creators, affiliates and social", agents: ["pilar-creators", "ritika-influencer-outreach", "tomas-social-community"], keys: ["stack", "sitemap", "socials", "youtube", "adsSummary"], needs: "Affiliate and creator tools, ambassador pages, creator microsites, partner pages running ads, social accounts and their output." },
  { lane: "SEO and AI search", agents: ["stuart-store-seo", "rustam-ai-answers"], keys: ["sitemap", "robots", "llms", "autocomplete", "catalogue"], needs: "Site shape, blog output, comparison and quiz pages, AI crawler rules, llms.txt and the questions shoppers ask about the brand." },
  { lane: "Reviews and social proof", agents: ["corinne-reviews"], keys: ["pdps", "trustpilot", "stack", "homeOffers"], needs: "Review counts and ratings on hero products, review apps, off-site ratings and the proof claims used in ads and pages." },
  { lane: "Tracking and attribution", agents: ["emre-tracking"], keys: ["stack"], needs: "Attribution tools, server-side tracking, post-purchase surveys and the pixel set." },
  { lane: "Brand, positioning and PR", agents: ["philippa-brand", "margot-pr"], keys: ["home", "history", "brand", "homeOffers"], needs: "How the pitch is worded now and how it changed, the look, press and values claims." },
  { lane: "Product, category and launches", agents: ["revathi-product-research", "duncan-category-trends", "shannon-market-research"], keys: ["catalogue", "launches", "bestSellers", "featured", "autocomplete"], needs: "What sells, how often they launch, limited editions and collabs, and the product searches around the brand." },
  { lane: "Marketplaces and retail", agents: ["garrett-amazon", "sudhir-marketplaces", "mei-wholesale-sales"], keys: ["sitemap", "stack", "autocomplete"], needs: "Retail stockists, Amazon signals, wholesale pages and where shoppers look to buy." },
];

// ---------- ads (Ad Library exports) ----------
function normaliseAds(raw) {
  let j = raw;
  if (typeof j === "string") { try { j = JSON.parse(j); } catch { return []; } }
  if (j && typeof j.results === "string") { try { j = JSON.parse(j.results); } catch { /* keep */ } }
  const list = Array.isArray(j) ? j : j?.ads || j?.data || j?.results || j?.searchResults || [];
  return list.map((a) => {
    const t = (v) => (v == null ? null : typeof v === "number" ? (v < 1e12 ? v * 1000 : v) : Date.parse(v));
    const bodies = [].concat(a.ad_creative_bodies || a.body || a.snapshot?.body?.text || a.ad_creative_body || []).filter(Boolean).map(String);
    const titles = [].concat(a.ad_creative_link_titles || a.ad_creative_link_title || a.title || a.snapshot?.title || []).filter(Boolean).map(String);
    const links = [].concat(a.ad_creative_link_urls || a.link_url || a.snapshot?.link_url || a.landing_page || []).filter(Boolean).map(String);
    return {
      id: String(a.id || a.ad_archive_id || a.adArchiveID || ""), page_id: String(a.page_id || a.pageID || a.snapshot?.page_id || ""), page_name: a.page_name || a.pageName || a.snapshot?.page_name || null,
      start: t(a.ad_delivery_start_time || a.start_date || a.startDate || a.start || a.ad_creation_time), stop: t(a.ad_delivery_stop_time || a.end_date || a.endDate || a.stop) || null,
      active: a.is_active ?? a.isActive ?? (a.ad_delivery_stop_time || a.end_date ? false : null), platforms: [].concat(a.publisher_platforms || a.publisherPlatform || []), bodies, titles, links,
      descriptions: [].concat(a.ad_creative_link_descriptions || a.ad_creative_link_description || []).filter(Boolean), cta: a.cta_text || a.snapshot?.cta_text || null, format: a.display_format || a.snapshot?.display_format || a.format || null,
      variants: a.collation_count || a.collationCount || null, snapshot: a.ad_snapshot_url || (a.id ? `https://www.facebook.com/ads/library/?id=${a.id}` : null), country: a.country || null, estimated_total: j?.estimated_total_count ?? null,
    };
  }).filter((a) => a.id);
}
// Each export may be the raw connector result, or { "query": {...the call's arguments...}, "response": <raw result> }.
// The query tells live from stopped ads and a brand-page count from a keyword count; without it the file name is used
// ("...-active.json", "...-inactive.json", "...-page-....json"), and anything still unclear stays unclear.
function readAdExport(f) {
  let raw = JSON.parse(fs.readFileSync(f, "utf8"));
  let query = raw?.query || raw?._query || null; const wrapperEstimate = raw?.estimated_total_count ?? null; if (raw && raw.response !== undefined) raw = raw.response;
  const name = path.basename(f).toLowerCase();
  const status = (query?.ad_active_status || (/inactive/.test(name) ? "INACTIVE" : /(^|[-_.])active/.test(name) ? "ACTIVE" : /(^|[-_.])all/.test(name) ? "ALL" : "")).toUpperCase() || null;
  const byPage = query ? Array.isArray(query.page_ids) && query.page_ids.length > 0 : /page/.test(name) ? true : null;
  const terms = query ? query.search_terms || null : null;
  let j = raw; if (typeof j === "string") { try { j = JSON.parse(j); } catch { /* keep */ } } if (j && typeof j.results === "string") { try { j = JSON.parse(j.results); } catch { /* keep */ } }
  return { ads: normaliseAds(raw), query, status, byPage, terms, estimated: j?.estimated_total_count ?? wrapperEstimate };
}
const fold = (s = "") => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
function addAds(S, files, ctx) {
  const all = new Map(); const sourcesUsed = []; const estimates = [];
  for (const f of files) {
    let ex; try { ex = readAdExport(f); } catch (e) { S.unknown("ads_meta", `Ad export ${path.basename(f)}`, `Could not read: ${e.message}`); continue; }
    sourcesUsed.push({ file: path.basename(f), ads: ex.ads.length, status: ex.status, by_page: ex.byPage, search_terms: ex.terms, estimated_total: ex.estimated, query: ex.query });
    for (const a of ex.ads) {
      const prev = all.get(a.id) || {};
      const active = a.active === false || ex.status === "INACTIVE" ? false : ex.status === "ACTIVE" || prev.active === true ? true : a.active ?? prev.active ?? null;
      all.set(a.id, { ...prev, ...a, active });
    }
    estimates.push(ex);
  }
  const ads0 = [...all.values()];
  if (!ads0.length) return;
  const now = Date.now();
  const pageCount = {}; for (const a of ads0) { const k = a.page_id || a.page_name; pageCount[k] = (pageCount[k] || 0) + 1; }
  const nameOf = Object.fromEntries(ads0.map((a) => [a.page_id || a.page_name, a.page_name || a.page_id]));
  // The brand's page: --page <id>, else a page whose name matches the brand, else the most frequent page.
  const want = fold(ctx.brandName || ctx.host.split(".")[0]);
  const brandKey = opt("page", null) || Object.keys(pageCount).find((k) => fold(nameOf[k]) === want) || Object.keys(pageCount).find((k) => fold(nameOf[k]).includes(want) || want.includes(fold(nameOf[k]))) || Object.entries(pageCount).sort((a, b) => b[1] - a[1])[0][0];
  const ads = ads0.filter((a) => (a.page_id || a.page_name) === brandKey);
  const others = ads0.filter((a) => (a.page_id || a.page_name) !== brandKey);
  // Live count: the estimate of a page-filtered ACTIVE pull with no search words, all ads on the brand page.
  const pageOnly = estimates.filter((e) => e.byPage === true && e.status === "ACTIVE" && !e.terms && e.ads.every((a) => (a.page_id || a.page_name) === brandKey));
  const estimated = pageOnly.length ? Math.max(...pageOnly.map((e) => e.estimated || 0)) : null;
  const pages = Object.fromEntries(Object.entries(pageCount).map(([k, n]) => [nameOf[k], n]));
  const brandPage = nameOf[brandKey];
  const active = ads.filter((a) => a.active === true && !a.stop);
  const running = active.filter((a) => a.start).map((a) => ({ ...a, days: daysBetween(a.start, now) })).sort((a, b) => b.days - a.days);
  const launched = (d) => ads.filter((a) => a.start && now - a.start <= d * DAY).length;
  const titleCounts = {}; for (const a of ads) for (const t of uniq(a.titles)) titleCounts[t] = (titleCounts[t] || 0) + 1;
  const hookCounts = {}; for (const a of ads) for (const b of uniq(a.bodies)) { const h = b.split(/\n|(?<=[.!?])\s/)[0].trim().slice(0, 140); if (h) hookCounts[h] = (hookCounts[h] || 0) + 1; }
  const linkInfo = {}; const utms = {};
  for (const a of ads) for (const l of a.links) { try { const u = new URL(l); const k = u.host + u.pathname; linkInfo[k] = (linkInfo[k] || 0) + 1; for (const [p, v] of u.searchParams) if (/^utm_/.test(p)) (utms[p] ||= {})[v] = ((utms[p] ||= {})[v] || 0) + 1; } catch { /* not a URL */ } }
  const byWeek = {}; for (const a of ads) { if (!a.start || now - a.start > 182 * DAY) continue; const d = new Date(a.start); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); const k = isoDay(d); byWeek[k] = (byWeek[k] || 0) + 1; }
  const platforms = {}; for (const a of ads) for (const p of a.platforms) platforms[p] = (platforms[p] || 0) + 1;
  const formats = {}; for (const a of ads) if (a.format) formats[a.format] = (formats[a.format] || 0) + 1;
  const otherPages = Object.entries(pages).filter(([k]) => k !== brandPage);
  const stopped = ads.filter((a) => a.active === false || a.stop);
  ctx.ads = { n: ads.length, active: active.length, estimated };
  ctx.ids.adsSummary = S.add("ads_meta", `Meta ads on the ${brandPage} page: live count, launch rate and sample (Ad Library)`, { id: ctx.reuse?.adsSummary || null,
    url: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&view_all_page_id=${ads[0]?.page_id || ""}&search_type=page`, kind: "derivation",
    data: { brand_page: brandPage, brand_page_id: ads[0]?.page_id || null, library_live_ads_estimate: estimated, live_estimate_basis: estimated != null ? "largest estimate from an ACTIVE pull filtered to the brand page with no search words" : "no page-filtered ACTIVE pull with its query saved, so no live total is claimed; see sources", ads_in_sample: ads.length, live_in_sample: active.length, stopped_in_sample: stopped.length, status_unknown_in_sample: ads.length - active.length - stopped.length, launched_last_7_days: launched(7), launched_last_30_days: launched(30), launched_last_90_days: launched(90), platforms, formats, launches_by_week: Object.entries(byWeek).sort().map(([week, n]) => ({ week, n })), other_pages_in_keyword_results: otherPages.map(([page, n]) => ({ page, n, headlines: uniq(others.filter((o) => (o.page_name || o.page_id) === page).flatMap((o) => o.titles)).slice(0, 4), started: uniq(others.filter((o) => (o.page_name || o.page_id) === page && o.start).map((o) => isoDay(o.start))).sort().slice(0, 1)[0] || null })), sources: sourcesUsed },
    note: "Launch counts and run lengths use the brand page's ads only. Counts are from the sample, not the whole library. Other pages matched the search words: they may be creators or partners running ads for the brand, or unrelated advertisers who only name it. Check each before calling it a partner.",
  });
  if (stopped.length) S.add("ads_meta", "Recently stopped Meta ads in the sample (what they turned off)", { url: stopped[0].snapshot, data: { ads: stopped.slice(0, 15).map((a) => ({ id: a.id, started: a.start ? isoDay(a.start) : null, stopped: a.stop ? isoDay(a.stop) : null, title: a.titles[0] || null, snapshot: a.snapshot })) } });
  if (running.length) ctx.ids.adsWinners = S.add("ads_meta", "Longest-running active Meta ads (the likely winners)", { id: ctx.reuse?.adsWinners || null,
    url: running[0].snapshot, data: { ads: running.slice(0, 12).map((a) => ({ id: a.id, page: a.page_name, started: isoDay(a.start), days_running: a.days, title: a.titles[0] || null, hook: (a.bodies[0] || "").slice(0, 220) || null, cta: a.cta, format: a.format, link: a.links[0] || null, variants: a.variants, snapshot: a.snapshot })) },
    note: "Advertisers rarely keep paying for losing ads, so long runs are the strongest public sign of a winner. A sample sorted by newest may miss older ads.",
  });
  const freshAds = ads.filter((a) => a.start && now - a.start <= 30 * DAY).sort((a, b) => b.start - a.start);
  if (freshAds.length) ctx.ids.adsNew = S.add("ads_meta", "Newest Meta ads (what they are testing now)", { id: ctx.reuse?.adsNew || null, url: freshAds[0].snapshot, data: { ads: freshAds.slice(0, 12).map((a) => ({ id: a.id, page: a.page_name, started: isoDay(a.start), title: a.titles[0] || null, hook: (a.bodies[0] || "").slice(0, 220) || null, link: a.links[0] || null, snapshot: a.snapshot })) } });
  const repeated = Object.entries(titleCounts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([text, n]) => ({ text, ads: n }));
  const hooks = Object.entries(hookCounts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([text, n]) => ({ text, ads: n }));
  if (repeated.length || hooks.length) ctx.ids.adsAngles = S.add("ads_meta", "Meta ad headlines and opening lines, by how many ads use them", { id: ctx.reuse?.adsAngles || null, url: null, kind: "derivation", data: { headlines: repeated, opening_lines: hooks, landing_pages: Object.entries(linkInfo).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([page, n]) => ({ page, ads: n })), utm_values: utms } });
}

// ---------- scorecard ----------
function scorecard(S, ctx) {
  const f = ctx.found || new Map(); const has = (id) => f.has(id) || f.has(ALIAS[id]); const ev = (id) => (has(id) ? ctx.ids.stack : null);
  const rows = [];
  const row = (channel, status, strength, saw, evidence, check) => rows.push({ channel, status, strength, saw, evidence: evidence.filter(Boolean), check: check || null });
  const brand = encodeURIComponent(ctx.brandName || ctx.host);
  const metaAds = ctx.ads;
  if (metaAds) row("Paid Meta (Facebook, Instagram)", "seen", metaAds.active >= 40 || (metaAds.estimated || 0) >= 100 ? 3 : metaAds.active >= 10 ? 2 : metaAds.active > 0 ? 1 : 0, `${metaAds.estimated != null ? `about ${metaAds.estimated} live ads on the brand page; ` : ""}${metaAds.active} live in a sample of ${metaAds.n}`, [ctx.ids.adsSummary, ctx.ids.adsWinners]);
  else row("Paid Meta (Facebook, Instagram)", has("meta_pixel") ? "pixel only" : "unknown", has("meta_pixel") ? 1 : 0, has("meta_pixel") ? "Meta Pixel installed; Ad Library not yet read" : "No Ad Library data yet", [ev("meta_pixel")], `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=${brand}&search_type=keyword_unordered`);
  row("Paid TikTok", has("tiktok_pixel") ? "pixel only" : "unknown", has("tiktok_pixel") ? 1 : 0, has("tiktok_pixel") ? "TikTok Pixel installed" : "No pixel seen; no public TikTok ad library outside the EU", [ev("tiktok_pixel")], `https://library.tiktok.com/ads?region=all&adv_name=${brand}`);
  const ga = ctx.googleAds;
  if (ga) row("Paid Google (Search, Shopping, YouTube, PMax)", "seen", (ga.totals?.low || ga.n) >= 1000 ? 3 : (ga.totals?.low || ga.n) >= 100 ? 2 : 1, `${ga.totals?.low ? `about ${ga.totals.low}${ga.totals.high && ga.totals.high !== ga.totals.low ? `-${ga.totals.high}` : ""}` : ga.n} creatives shown in 30 days${ga.others ? `; ${ga.others} other advertisers point ads at the domain` : ""}`, [ctx.ids.googleAds, ev("google_ads")]);
  else row("Paid Google (Search, Shopping, YouTube, PMax)", has("google_ads") ? "pixel only" : "unknown", has("google_ads") ? 1 : 0, has("google_ads") ? "Google Ads tag installed; no creatives read" : "No Google Ads tag or creatives seen", [ev("google_ads")], `https://adstransparency.google.com/?domain=${ctx.host}`);
  const otherPaid = ["pinterest_tag", "snap_pixel", "reddit_pixel", "x_pixel", "applovin_pixel", "bing_uet", "criteo", "taboola", "outbrain", "tvscientific", "podscribe"].filter(has);
  row("Other paid (Pinterest, Snap, AppLovin, CTV, native, podcast)", otherPaid.length ? "pixel only" : "unknown", Math.min(2, otherPaid.length), otherPaid.length ? otherPaid.map((i) => (SIG_BY_ID[i] || SIG_BY_ID[ALIAS[i]]).name).join(", ") : "No other ad pixels seen", [otherPaid.length ? ctx.ids.stack : null]);
  const attr_ = ["triple_whale", "northbeam", "elevar", "polar", "rockerbox", "littledata", "fairing", "knocommerce", "mparticle"].filter(has);
  row("Measurement and attribution", attr_.length ? "seen" : "unknown", Math.min(3, attr_.length + (has("gtm") ? 0 : 0)), attr_.length ? attr_.map((i) => (SIG_BY_ID[i] || SIG_BY_ID[ALIAS[i]]).name).join(", ") : "No attribution tool seen (often server-side)", [attr_.length ? ctx.ids.stack : null]);
  const email = ["klaviyo", "attentive", "postscript", "omnisend", "mailchimp", "emarsys", "braze", "wunderkind", "retention_com", "justuno", "privy"].filter(has);
  row("Email and SMS", email.length ? "seen" : "unknown", email.some((i) => ["attentive", "postscript"].includes(i)) && email.includes("klaviyo") ? 3 : email.length ? 2 : 0, email.length ? email.map((i) => (SIG_BY_ID[i] || SIG_BY_ID[ALIAS[i]]).name).join(", ") : "No email tool seen (often server-side)", [email.length ? ctx.ids.stack : null, ctx.ids.homeOffers], `https://milled.com/search?q=${brand}`);
  const subs = ["recharge", "skio", "loop_subs", "stay_ai", "ordergroove", "smartrr", "appstle"].filter(has);
  row("Subscription", subs.length || ctx.subscriptionSeen ? "seen" : "unknown", ctx.subscriptionSeen ? 3 : subs.length ? 2 : 0, [subs.map((i) => (SIG_BY_ID[i] || SIG_BY_ID[ALIAS[i]]).name).join(", "), ctx.subscriptionSeen ? "selling plans on a best seller" : ""].filter(Boolean).join("; ") || "No subscription app or selling plan seen", [subs.length ? ctx.ids.stack : null, ctx.subscriptionSeen]);
  const loy = ["smile", "loyaltylion", "rise_ai", "friendbuy", "talkable", "mention_me"].filter(has); const loyPages = ctx.pageSignals?.loyalty_referral?.length;
  row("Loyalty and referral", loy.length || loyPages ? "seen" : "unknown", loy.length ? 2 : loyPages ? 1 : 0, [loy.map((i) => (SIG_BY_ID[i] || SIG_BY_ID[ALIAS[i]]).name).join(", "), loyPages ? `${loyPages} loyalty or referral pages` : ""].filter(Boolean).join("; ") || "Nothing seen", [loy.length ? ctx.ids.stack : null, loyPages ? ctx.ids.sitemap : null]);
  const cre = ["impact", "refersion", "shareasale", "social_snowball", "superfiliate", "everflow", "grin", "aspire", "shopmy", "ltk", "upfluence", "euka"].filter(has); const crePages = ctx.pageSignals?.affiliate_creator?.length;
  const otherPages = (ctx.evidenceAdsOtherPages || 0);
  row("Creators and affiliates", cre.length || crePages ? "seen" : "unknown", Math.min(3, cre.length + (crePages ? 1 : 0)), [cre.map((i) => (SIG_BY_ID[i] || SIG_BY_ID[ALIAS[i]]).name).join(", "), crePages ? `${crePages} creator or affiliate pages` : ""].filter(Boolean).join("; ") || "Nothing seen on the site", [cre.length ? ctx.ids.stack : null, crePages ? ctx.ids.sitemap : null]);
  const rev = ["okendo", "yotpo", "junip", "judgeme", "loox", "stamped", "bazaarvoice", "powerreviews", "trustpilot_widget"].filter(has); const ugc = ["foursixty", "archive", "videowise", "refunnel"].filter(has);
  row("Reviews and UGC on site", rev.length ? "seen" : "unknown", rev.length && ugc.length ? 3 : rev.length ? 2 : 0, [...rev, ...ugc].map((i) => (SIG_BY_ID[i] || SIG_BY_ID[ALIAS[i]]).name).join(", ") || "No review app seen", [rev.length || ugc.length ? ctx.ids.stack : null, ...(ctx.ids.pdps || []).slice(0, 1), ctx.ids.trustpilot]);
  const cro = ["rebuy", "reconvert", "aftersell", "upcart", "rokt", "intelligems", "shoplift", "vwo", "optimizely", "convert", "octane", "typeform", "searchspring", "klevu", "nosto"].filter(has);
  row("CRO, upsells and testing", cro.length ? "seen" : "unknown", Math.min(3, cro.length), cro.map((i) => (SIG_BY_ID[i] || SIG_BY_ID[ALIAS[i]]).name).join(", ") || "Nothing seen", [cro.length ? ctx.ids.stack : null]);
  const sm = S.evidence.find((e) => e.id === ctx.ids.sitemap)?.data;
  if (sm) row("SEO and content", "seen", sm.blog_posts_updated_90d >= 12 ? 3 : sm.blog_posts_updated_90d >= 4 ? 2 : sm.blog_posts_read >= 20 ? 1 : 0, `${sm.urls_read} URLs read; ${sm.blog_posts_read} blog posts, ${sm.blog_posts_updated_90d} updated in 90 days; ${sm.page_signals.comparison.length} comparison pages`, [ctx.ids.sitemap]);
  const ai = S.evidence.find((e) => e.id === ctx.ids.robots)?.data; const llms = S.evidence.find((e) => e.id === ctx.ids.llms)?.data;
  if (ai) { const blocked = Object.entries(ai).filter(([, v]) => v === "blocked").map(([k]) => k); row("AI search (ChatGPT, Perplexity, Gemini)", "seen", llms?.present ? 2 : blocked.length ? 0 : 1, `${llms?.present ? "llms.txt published; " : "no llms.txt; "}${blocked.length ? `blocks ${blocked.join(", ")}` : "no AI crawler blocked"}`, [ctx.ids.robots, ctx.ids.llms]); }
  const retail = has("store_locator") || ctx.pageSignals?.stockists?.length; const amazon = has("amazon_buy");
  row("Marketplaces and retail", retail || amazon ? "seen" : "unknown", (retail ? 1 : 0) + (amazon ? 1 : 0), [retail ? "store locator or stockist pages" : "", amazon ? "Buy with Prime on site" : ""].filter(Boolean).join("; ") || "Not checked on Amazon or in stores", [retail ? ctx.ids.sitemap : null, amazon ? ctx.ids.stack : null], `https://www.amazon.com/s?k=${brand}`);
  const soc = Object.keys(ctx.socials || {});
  const ytd = S.evidence.find((e) => e.id === ctx.ids.youtube)?.data;
  row("Organic social", soc.length ? "accounts found" : "unknown", ytd && ytd.uploads_per_week >= 1 ? 1 : 0, soc.length ? `Linked: ${soc.join(", ")}.${ytd ? ` YouTube: ${ytd.uploads_per_week ?? "?"} uploads a week, median ${ytd.median_views ?? "?"} views.` : ""} Instagram and TikTok reach not read.` : "No social links found", [ctx.ids.socials, ctx.ids.youtube], ctx.socials?.tiktok || ctx.socials?.instagram || null);
  const ac = S.evidence.find((e) => e.id === ctx.ids.autocomplete)?.data;
  if (ac) row("Search demand around the brand", "seen", Math.min(3, (ac.themes.product.length >= 6 ? 1 : 0) + (ac.themes.where_to_buy.length ? 1 : 0) + (ac.themes.comparisons.length ? 1 : 0)), `${ac.themes.product.length} product searches, ${ac.themes.comparisons.length} comparisons, ${ac.themes.where_to_buy.length} where-to-buy, ${ac.themes.deals.length} deal searches`, [ctx.ids.autocomplete]);
  return rows;
}

function unknownsForGaps(S, ctx) {
  const brand = encodeURIComponent(ctx.brandName || ctx.host);
  if (!ctx.ads) S.unknown("ads_meta", "Meta ads (live creatives, run length, launch rate)", "No Ad Library export was supplied. Search the Ad Library by the brand's page and save the result as JSON, then run: teardown-collect.mjs ads <dir> <file>.", `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=${brand}&search_type=keyword_unordered`);
  S.unknown("ads_tiktok", "TikTok ads", "TikTok has no global public ad library; its library covers ads shown in the EU. Top Ads in Creative Center shows category winners.", `https://library.tiktok.com/ads?region=all&adv_name=${brand}`);
  S.unknown("ads_google_detail", "Google ad keywords, copy and spend", "The Ads Transparency Center shows creatives, formats and dates, not keywords, spend or results. Open the longest-shown creatives to read their copy.", `https://adstransparency.google.com/?domain=${ctx.host}`);
  S.unknown("email", "Email and SMS flows (welcome series, cadence, offers)", "Sent emails are not on the site. Public archives (Milled) or a test inbox show them. Never sign up with a real customer's details.", `https://milled.com/search?q=${brand}`);
  S.unknown("social", "Organic social reach and cadence", "Follower counts, posting rhythm and top posts need the platform pages or a social data tool.", ctx.socials?.tiktok || ctx.socials?.instagram || `https://www.tiktok.com/search?q=${brand}`);
  S.unknown("marketplaces", "Amazon and retail presence", "Not checked automatically: search Amazon for the brand and look for an official storefront, Best Seller Rank and review count.", `https://www.amazon.com/s?k=${brand}`);
  S.unknown("traffic", "Traffic size and channel mix", "Traffic estimates come from panel tools (Similarweb, Semrush) and are estimates.", `https://www.similarweb.com/website/${ctx.host}/`);
  S.unknown("demand", "Search demand for the brand over time", "Google Trends shows relative brand search interest, a proxy for brand growth.", `https://trends.google.com/trends/explore?date=today%205-y&q=${brand}`);
  S.unknown("revenue", "Revenue, margins and ad spend", "Private. Never estimate them as fact; use proxies (active ads, launch rate, review growth) and label any estimate.", null);
}

const agentName = (id) => id.split("-")[0].replace(/^./, (c) => c.toUpperCase());
function lanes(ids) { return LANES.map((l) => ({ lane: l.lane, agents: l.agents, names: l.agents.map(agentName), needs: l.needs, evidence: uniq(l.keys.flatMap((k) => [].concat(ids[k] || []))) })); }

// ---------- index for the agent ----------
function indexMarkdown(bundle) {
  const L = [];
  L.push(`# Evidence: ${bundle.brand?.name || bundle.target.host}`, "", `Collected ${bundle.collected_at.slice(0, 16).replace("T", " ")} UTC by teardown-collect ${bundle.tool_version}. ${bundle.evidence.length} evidence items, ${bundle.unknowns.length} unknowns. Cite items as [E#]. Full data: evidence.json.`, "");
  L.push("## Channel scorecard (deterministic)", "", "| Channel | Status | Strength 0-3 | What was seen | Evidence |", "|---|---|---|---|---|");
  for (const r of bundle.scorecard) L.push(`| ${r.channel} | ${r.status} | ${r.strength} | ${r.saw.replace(/\|/g, "/")} | ${r.evidence.join(", ") || "none"} |`);
  L.push("", "## Evidence items", "");
  for (const e of bundle.evidence) {
    L.push(`### ${e.id} · ${e.label}`, `${e.kind} · ${e.area}${e.url ? ` · ${e.url}` : ""}${e.note ? `\nNote: ${e.note}` : ""}`);
    if (e.area === "brand") { L.push("```json", JSON.stringify({ name: e.data.name, background: e.data.background, text: e.data.text, accents: e.data.accents, fonts: e.data.fonts.families, logo: e.data.logo.img || e.data.logo.jsonld }, null, 0), "```", ""); continue; }
    const s = JSON.stringify(e.data, null, 0); L.push("```json", s.length > 2400 ? s.slice(0, 2400) + " …(truncated; see evidence.json)" : s, "```", "");
  }
  L.push("## Evidence by agent lane (who acts on what)", "", "| Lane | Agents | Evidence | What they need |", "|---|---|---|---|");
  for (const l of bundle.lanes || []) L.push(`| ${l.lane} | ${l.agents.map((a) => `${agentName(a)} (${a})`).join(", ")} | ${l.evidence.join(", ") || "none yet"} | ${l.needs} |`);
  L.push("");
  L.push("## Unknowns (not seen: never write them as 'not doing it')", "");
  for (const u of bundle.unknowns) L.push(`- **${u.what}** (${u.area}): ${u.why}${u.check_url ? ` Check: ${u.check_url}` : ""}`);
  return L.join("\n") + "\n";
}

// ---------- main ----------
async function collect(input) {
  let origin; try { const u = new URL(/^https?:\/\//.test(input) ? input : `https://${input}`); origin = u.origin; } catch { throw new Error(`Not a URL: ${input}`); }
  const host = new URL(origin).host; const out = opt("out", path.join("teardowns", `${host.replace(/^www\./, "")}-${isoDay(Date.now())}`));
  const S = makeStore({ input, origin, host }); const ctx = { host: host.replace(/^www\./, ""), ids: {} };
  log(`teardown-collect ${VERSION}: ${origin}`);
  log("· robots.txt"); await loadRobots(origin);
  log("· homepage, brand look and tags"); await collectHome(S, origin, ctx);
  if (ctx.finalUrl && new URL(ctx.finalUrl).host !== new URL(origin).host) await loadRobots(new URL(ctx.finalUrl).origin);
  if (ctx.finalUrl) { const fo = new URL(ctx.finalUrl).origin; if (fo !== origin) { log(`  (redirected to ${fo})`); origin = fo; } }
  log("· catalogue"); await collectCatalogue(S, origin, ctx);
  log("· best sellers"); await collectBestSellers(S, origin, ctx);
  log("· product pages"); await collectPdps(S, origin, ctx);
  if (ctx.found?.size) {
    const stack = [...ctx.found.values()].map((f) => ({ ...SIG_BY_ID[f.id], ids: [...f.ids].slice(0, 4), seen_on: [...f.where] }));
    const byCat = {}; for (const s of stack) { const n = s.name.replace(/ \(Shopify app\)$/, ""); (byCat[s.cat] ||= []); if (!byCat[s.cat].includes(n)) byCat[s.cat].push(n); }
    ctx.ids.stack = S.add("stack", "Marketing stack: pixels, apps and tools found in the store's code", { url: ctx.finalUrl, data: { by_category: byCat, tools: stack }, note: "A tag proves the tool is installed (intent or past use), not current spend. Server-side tools are invisible here." });
  }
  log("· robots, llms.txt, sitemaps"); await collectRobotsSitemaps(S, origin, ctx);
  log("· Google ads, autocomplete, speed"); await collectGoogleAds(S, origin, ctx); await collectAutocomplete(S, origin, ctx); await collectPageSpeed(S, origin, ctx);
  log("· YouTube"); await collectYouTube(S, origin, ctx);
  log("· homepage history"); await collectWayback(S, origin, ctx);
  log("· off-site reviews"); await collectReviews(S, origin, ctx);
  const adFiles = optAll("ads"); if (adFiles.length) { log("· ad library exports"); addAds(S, adFiles, ctx); }
  unknownsForGaps(S, ctx);
  if (SKIPPED.length) S.unknown("site", "Pages the store asks automated readers to skip", `robots.txt disallows ${SKIPPED.length} path(s) this tool would have read, so they were skipped: ${uniq(SKIPPED.map((u) => { try { const x = new URL(u); return x.pathname + x.search; } catch { return u; } })).slice(0, 6).join(", ")}. Read them yourself in a browser if you need them.`, SKIPPED[0]);
  const bundle = { schema: SCHEMA, tool_version: VERSION, collected_at: new Date().toISOString(), target: { input, origin, host: ctx.host }, brand: ctx.brand || { name: ctx.brandName || ctx.host }, requests: requestCount, evidence: S.evidence, unknowns: S.unknowns, ids: ctx.ids, scorecard: scorecard(S, ctx) };
  bundle.lanes = lanes(ctx.ids);
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "evidence.json"), JSON.stringify(bundle, null, 1));
  fs.writeFileSync(path.join(out, "evidence.md"), indexMarkdown(bundle));
  log(`done: ${S.evidence.length} evidence items, ${S.unknowns.length} unknowns, ${requestCount} requests → ${out}`);
  console.log(JSON.stringify({ out, evidence: S.evidence.length, unknowns: S.unknowns.length, brand: bundle.brand.name, platform: ctx.platform?.name || "unknown", products: ctx.rows?.length || 0 }));
}

async function addAdsToBundle(dir, files) {
  const p = path.join(dir, "evidence.json"); const bundle = JSON.parse(fs.readFileSync(p, "utf8"));
  // Re-running replaces the ads evidence in place: the summary, winners, newest and angles keep their ids, so a
  // report that already cites them stays valid. New kinds of ad evidence get the next free id.
  const S = makeStore(bundle.target); S.evidence.push(...bundle.evidence.filter((e) => e.area !== "ads_meta")); S.unknowns.push(...bundle.unknowns.filter((u) => u.area !== "ads_meta"));
  const reuse = Object.fromEntries(["adsSummary", "adsWinners", "adsNew", "adsAngles"].map((k) => [k, bundle.ids?.[k] || null]));
  for (const k of Object.keys(reuse)) if (bundle.ids) delete bundle.ids[k];
  const ctx = { host: bundle.target.host, brandName: bundle.brand?.name, ids: bundle.ids || {}, reuse, socials: bundle.evidence.find((e) => e.id === bundle.ids?.socials)?.data || {} };
  // Rebuild the scorecard inputs from the stored stack and sitemap.
  const stack = bundle.evidence.find((e) => e.id === bundle.ids?.stack); ctx.found = new Map((stack?.data?.tools || []).map((t) => [t.id, { id: t.id, where: new Set(t.seen_on), ids: new Set(t.ids) }]));
  ctx.pageSignals = bundle.evidence.find((e) => e.id === bundle.ids?.sitemap)?.data?.page_signals; ctx.subscriptionSeen = bundle.evidence.find((e) => e.area === "pdp" && e.data?.subscription_plans?.length)?.id;
  addAds(S, files, ctx);
  const g = bundle.evidence.find((e) => e.id === bundle.ids?.googleAds)?.data; if (g) ctx.googleAds = { n: g.creatives_read, totals: g.google_total_estimate, others: g.advertisers.length - 1 };
  S.evidence.sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
  bundle.evidence = S.evidence; bundle.unknowns = S.unknowns; bundle.ids = ctx.ids; bundle.scorecard = scorecard(S, ctx); bundle.lanes = lanes(ctx.ids); bundle.updated_at = new Date().toISOString();
  fs.writeFileSync(p, JSON.stringify(bundle, null, 1)); fs.writeFileSync(path.join(dir, "evidence.md"), indexMarkdown(bundle));
  console.log(JSON.stringify({ out: dir, evidence: S.evidence.length, ads: ctx.ads || null }));
}

const HELP = `teardown-collect ${VERSION}: public evidence about a D2C brand's marketing, cited as E1..En.

  node tools/teardown-collect.mjs <store-url> [--out dir] [--ads export.json]... [--max-pages 8] [--no-wayback] [--no-reviews]
  node tools/teardown-collect.mjs ads <evidence-dir> <export.json>...
  node tools/teardown-collect.mjs note <evidence-dir> --area ads_google --label "what you saw" --url <link> [--data '{"ads":2000}'] [--key googleSeen]

Reads: storefront HTML, public catalogue (Shopify /products.json, /collections.json, product .js), the best-selling sort,
three product pages, pixels and apps (including Google Tag Manager containers), robots.txt, llms.txt, sitemaps,
Wayback Machine snapshots and the public Trustpilot page. Never logs in, submits forms, adds to cart or buys.
Ad Library data: pass the JSON your Meta Ad Library tool returned (any of: {results:"<json>"}, {ads:[...]}, [...]).
Writes evidence.json and evidence.md (read evidence.md first). Then write report.md and run teardown-report.mjs.`;

async function googleRefresh(dir) {
  const p = path.join(dir, "evidence.json"); const bundle = JSON.parse(fs.readFileSync(p, "utf8"));
  const S = makeStore(bundle.target); S.evidence.push(...bundle.evidence.filter((e) => e.area !== "ads_google")); S.unknowns.push(...bundle.unknowns.filter((u) => u.area !== "ads_google"));
  const ctx = { host: bundle.target.host, brandName: bundle.brand?.name, ids: bundle.ids || {}, reuse: { googleAds: bundle.ids?.googleAds || null }, platform: bundle.evidence.find((e) => e.id === bundle.ids?.home)?.data ? { country: null } : null };
  delete ctx.ids.googleAds;
  await collectGoogleAds(S, bundle.target.origin, ctx);
  S.evidence.sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
  bundle.evidence = S.evidence; bundle.unknowns = S.unknowns; bundle.ids = ctx.ids; bundle.updated_at = new Date().toISOString();
  const keep = bundle.scorecard; try { const g = S.evidence.find((e) => e.id === ctx.ids.googleAds)?.data; if (g) { const row = keep.find((r) => /Paid Google/.test(r.channel)); if (row) Object.assign(row, { status: "seen", strength: (g.google_total_estimate?.low || g.creatives_read) >= 1000 ? 3 : (g.google_total_estimate?.low || g.creatives_read) >= 100 ? 2 : 1, saw: `about ${g.google_total_estimate?.low ?? g.creatives_read} creatives shown in 30 days; ${g.advertisers.length - 1} other advertisers point ads at the domain`, evidence: [ctx.ids.googleAds] }); } } catch { /* keep the old row */ }
  bundle.lanes = lanes(ctx.ids);
  fs.writeFileSync(p, JSON.stringify(bundle, null, 1)); fs.writeFileSync(path.join(dir, "evidence.md"), indexMarkdown(bundle));
  console.log(JSON.stringify({ out: dir, google: ctx.googleAds || null, id: ctx.ids.googleAds || null }));
}

// note: add one thing you read by hand in a browser (a count on Google's Ads Transparency Center, a TikTok Creative
// Center page, an email from Milled). It is stored as an observation made by a person, with its link, so the report can cite it.
function addNote(dir) {
  const p = path.join(dir, "evidence.json"); const bundle = JSON.parse(fs.readFileSync(p, "utf8"));
  const area = opt("area", "other"); const label = opt("label", null); const url = opt("url", null);
  if (!label || !url) throw new Error('note needs --label "what you saw" and --url <where you saw it>');
  let data = {}; const raw = opt("data", null); if (raw) { try { data = JSON.parse(raw); } catch { throw new Error("--data must be JSON"); } }
  const S = makeStore(bundle.target); S.evidence.push(...bundle.evidence);
  const key = opt("key", null); const id = S.add(area, label, { url, kind: "observation (read by hand in a browser)", data, note: opt("note", null), id: key ? bundle.ids?.[key] || null : null });
  if (key && bundle.ids?.[key]) bundle.evidence = bundle.evidence.filter((e) => e.id !== id);
  bundle.evidence = [...bundle.evidence.filter((e) => e.id !== id), S.evidence.find((e) => e.id === id)];
  if (key) (bundle.ids ||= {})[key] = id;
  // A hand count of Google ads fills the Google row of the scorecard.
  if (area === "ads_google" && Number.isFinite(+data.ads)) { const row = (bundle.scorecard || []).find((r) => /Paid Google/.test(r.channel)); if (row) Object.assign(row, { status: "seen", strength: +data.ads >= 1000 ? 3 : +data.ads >= 100 ? 2 : 1, saw: `about ${data.ads_label || data.ads} Google ads on record (${data.region || "all regions"}, ${data.period || "any time"}), read by hand`, evidence: [id] }); bundle.unknowns = bundle.unknowns.filter((u) => u.area !== "ads_google"); }
  bundle.updated_at = new Date().toISOString();
  fs.writeFileSync(p, JSON.stringify(bundle, null, 1)); fs.writeFileSync(path.join(dir, "evidence.md"), indexMarkdown(bundle));
  console.log(JSON.stringify({ added: id, key }));
}

const cmd = args[0];
if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") console.log(HELP);
else if (cmd === "note") { try { addNote(args[1]); } catch (e) { console.error(e.message); process.exit(1); } }
else if (cmd === "google") googleRefresh(args[1]).catch((e) => { console.error(e.message); process.exit(1); });
else if (cmd === "ads") addAdsToBundle(args[1], args.slice(2).filter((a) => !a.startsWith("--"))).catch((e) => { console.error(e.message); process.exit(1); });
else collect(cmd).catch((e) => { console.error(e.stack || e.message); process.exit(1); });
