// Prepare a job: turn a whole brief into the few library cards an expert would want in front of them, in one call.
//
// Agents told to "look it up once per signal" ran about two lookups a job (owner bench, round 2, 13 Nov 2026), so the
// lookup is one tool that does the reading for them, cheaply: no model, no network, under a second on 900 cards.
// Design, from Stanford CS329Z lecture 3 (RAG) and lecture 6 (context engineering):
// - Query planning: the brief is split into what it asks for (each request sentence) and what its data says (the
//   standout rows of every table and the lines that rank or share something), each its own query, plus the whole
//   brief as one long query. Rankings fuse by reciprocal rank (multi-query retrieval).
// - Metadata filters: market, Amazon marketplace and store platform are read from the brief, and a card written for
//   another market or marketplace never comes back (CardIndex.fits, on the card's own facets).
// - Doc-side expansion: each card is indexed with the questions it answers ("Asked as"), so a brief in an owner's
//   words meets a card in an expert's words (doc2query, done once when the card was written).
// - Stated facts: each two-column table row and each prose sentence with a number or a belief is its own small query,
//   and what the store says it does not do ("we do not send texts") is cut from the search text.
// - Rerank: a boost when the card's "holds when" shares the brief's words, and when several queries agree.
// - Diversity: near-duplicate cards are dropped (maximal marginal relevance, by word overlap), so the digest has range.
// - Retrieve wide, grade narrow: the tool keeps a shortlist of about 40 (its best 15 first, the rest as short lines)
//   and asks the owner's own AI to grade it against the store and keep 10 to 15 (CRAG-style grading; the model that
//   reads the cards is the smart reranker, and it already sits in the loop). `--keep` writes the kept cards back.
// - Gaps: a request or signal no card covers well is listed as a gap, with one rewrite round in expert words, then
//   decide it from the brief, never from memory.
// - Budget: the digest is a ranked list of claims with when each holds and fails, about 2,000 words with the
//   shortlist, because accuracy saturates after 10 to 20 documents and what sits in the middle gets lost.
import { KnowledgeIndex, MIN_COVERAGE, tokens } from "../packs/retrieve.ts";

export interface PrepCard {
  id: string;
  module: string;
  claim: string;
  text: string;
  holds: string;
  fails: string;
  asks: string;
  tier: number;
  scope: string;
  markets: string[];
  amazon: string[];
  mode: string;
  platforms: string[];
}

export interface BriefFacts { market?: string; amazon?: string; platform?: string; cod: boolean; subscription: boolean; channels: string[] }
export interface PrepQuery { kind: "ask" | "signal" | "fact" | "brief"; text: string; weight: number }
export interface PrepPick { card: PrepCard; score: number; via: string[] }
/** `picks` are the tool's own best k; `shortlist` is the wider pool (picks first) the owner's AI grades. */
export interface Prepared { facts: BriefFacts; queries: PrepQuery[]; picks: PrepPick[]; shortlist: PrepPick[]; gaps: string[]; graded?: boolean }

/**
 * Ranking settings, tuned on the odd-numbered briefs of test/fixtures/ecommerce-jobs-golden.json and checked on the
 * even ones (scripts/eval-prepare.mjs --split). Changing one: run the eval, keep it only if the even half holds.
 * 15 Nov 2026, odd / even must@15: the 14 Nov settings 0.42 / 0.34; stated-fact queries at 0.5 lifted it to 0.45 /
 * 0.43, 30 passages a query and 12 fact lines to 0.46 / 0.47, no module prior to 0.52 / 0.49 (the regex guess of the
 * requested module was often wrong), a stronger "holds when" boost to 0.53 / 0.49; the negation cut then traded 0.02
 * on the odd half for wrong cards 3 down to 1. Tried and left off: the feedback round (expand), stronger tier priors,
 * a higher floor, other query weights, a 50-card pool.
 */
export const PREP = {
  /** Query weights in the fusion. */
  askWeight: 1, signalWeight: 0.8, factWeight: 0.5, briefWeight: 0.5,
  /** Most stated-fact queries per brief. */
  factLines: 12,
  /** Passages each query pass contributes, and the weight of the second pass inside the requested modules. */
  depth: 30, routedWeight: 0.7,
  /** Rank fusion constant: score = weight / (rrf + rank). */
  rrf: 10,
  /** Prior for a card in a module the request names, and for one outside it (1 and 1: off). */
  inModule: 1, offModule: 1,
  /** Boost when the card's "holds when" shares the brief's words (overlap times holds, at most holdsCap). */
  holds: 4, holdsCap: 0.6,
  /** Bonus per extra query that found the card. */
  agree: 0.1,
  /** Source tier prior: 1 platform docs, 2 large-sample research, 3 named practitioner, 4 opinion. */
  tier: { 1: 1.05, 2: 1.02, 3: 1, 4: 0.98 } as Record<number, number>,
  /** Score kept by a card whose claim is written for a situation the brief does not describe, and by one whose "holds when" only names it. */
  situation: 0.15, situationHolds: 0.15,
  /** Word overlap above which a card repeats a picked one. */
  duplicate: 0.45,
  /** Cards under this share of the best score are not worth a reader's time. */
  floor: 0.05,
  /** Size of the shortlist the owner's AI grades. */
  pool: 40,
  /** Feedback round: how many of the best cards search again with their own claim, and at what weight (0: off). */
  expand: 0, expandWeight: 0.3,
};

/** Cards from the module files a pack carries (knowledge/<vertical>/<CODE>.md, written by cards.ts moduleMarkdown). */
export function cardsFromModuleMarkdown(code: string, md: string): PrepCard[] {
  const out: PrepCard[] = [];
  for (const block of md.replace(/\r\n?/g, "\n").split(/^## /m).slice(1)) {
    const claim = block.split("\n")[0].trim();
    const head = /^Card ([A-Z]{2,4}-\d{4})\. Tier (\d), (baseline|growth)(?:, (.*?))?\.$/m.exec(block);
    if (!head) continue;
    const facets = (head[4] ?? "").split("; ").map(s => s.trim()).filter(Boolean);
    const markets: string[] = [], amazon: string[] = [], platforms: string[] = [];
    let mode = "";
    for (const f of facets) {
      if (f.startsWith("market ")) markets.push(...f.slice(7).split(", "));
      else if (f.startsWith("Amazon ")) amazon.push(...f.slice(7).split(", "));
      else if (/^(dtc first|amazon first|new product|expansion|both)$/.test(f)) mode = f.replace(/ /g, "_");
      else platforms.push(...f.split(", "));
    }
    const field = (name: string) => new RegExp(`^\\*\\*${name}:\\*\\* (.*)$`, "m").exec(block)?.[1].trim() ?? "";
    const body = block.split("\n").slice(1).join("\n");
    const text = body.split(/\n\*\*(?:Holds when|Fails when|Numbers|Asked as|Source):\*\*/)[0].replace(/^Card .*$/m, "").trim();
    out.push({ id: head[1], module: code, claim, text, holds: field("Holds when"), fails: field("Fails when"), asks: field("Asked as"),
      tier: Number(head[2]), scope: head[3], markets, amazon, mode, platforms: platforms.map(p => p.toLowerCase()) });
  }
  return out;
}

const has = (re: RegExp, s: string) => re.test(s);

/** What the brief says about market, marketplace, platform and model. Unsure stays unset: a filter only acts on a clear fact. */
export function briefFacts(brief: string): BriefFacts {
  const india = has(/₹|\bINR\b|\bRs\.?\s?\d|\bIndia(n)?\b|\blakhs?\b|\bcrores?\b|\bpincodes?\b|Shiprocket|Delhivery|Razorpay|\bUPI\b|Flipkart|Meesho|Nykaa|Amazon\.in/i, brief);
  const us = has(/\$\s?\d|\bUSD\b|United States|\bU\.?S\.?A?\b(?!-)|\bAmerican\b|Amazon\.com\b/, brief);
  const uk = has(/£\s?\d|\bGBP\b|United Kingdom|\bUK\b|Amazon\.co\.uk/, brief);
  const eu = has(/€\s?\d|\bEUR\b|\bEU\b|Europe(an)?\b/, brief);
  const markets = [india && "IN", us && "US", uk && "UK", eu && "EU"].filter(Boolean) as string[];
  const market = markets.length === 1 ? markets[0] : undefined;
  const amazon = has(/\bAmazon\b/i, brief) ? (has(/Amazon\.in\b/i, brief) ? "IN" : has(/Amazon\.com\b/i, brief) ? "US" : market) : undefined;
  const platform = has(/WooCommerce/i, brief) ? "woocommerce" : has(/Shopify/i, brief) ? "shopify" : undefined;
  const channels = [["meta", /\b(Meta|Facebook|Instagram|Reels?)\b/i], ["tiktok", /TikTok/i], ["google", /\bGoogle\b|Performance Max|\bPMax\b|YouTube/i],
    ["email", /\bemails?\b|Klaviyo|newsletter/i], ["sms", /\bSMS\b|text message/i], ["whatsapp", /WhatsApp/i], ["amazon", /\bAmazon\b/i]]
    .filter(([, re]) => (re as RegExp).test(brief)).map(([c]) => c as string);
  return { market, amazon, platform, cod: has(/\bCOD\b|cash on delivery/i, brief), subscription: has(/subscri(be|ption)/i, brief), channels };
}

/** A request: a work verb leads, or "I/we want/need", "help me", "can you", or a real question (not a quoted one). */
const ASK = /^(?:please\s+)?(?:write|draft|create|build|plan|design|give|recommend|decide|fix|audit|set up|propose|suggest|prioriti[sz]e|rewrite|improve|find|choose|pick|tell|show|map|lay out|put together|make|turn|outline|forecast|allocate|split|cut|scale|launch|structure)\b|\b(?:i|we)(?:'d| would)?\s+(?:want|need|like)\b|\bhelp (?:me|us)\b|\b(?:can|could) you\b|^(?:how|what|which|should|where|when)\b[^"]*\?$|^(?:deliverable|the job|the ask|task|what i need)\b/i;
const NOT_ASK = /test inputs?|not the brand's|for this exercise/i;
const sentencesOf = (s: string) => s.replace(/\r\n?/g, "\n").split(/\n+|(?<=[.!?])\s+(?=[A-Z])/).map(x => x.replace(/^[-*#>\d.)\s]+/, "").trim()).filter(x => x.split(/\s+/).length >= 4);

/** The brief's requests: sentences that ask for work or a decision, at most five, longest first. */
export function briefAsks(brief: string): string[] {
  const prose = brief.split("\n").filter(l => !/^\s*\|/.test(l) && !/\S\s+\|\s+\S/.test(l)).join("\n");
  // A label before the request ("What the owner wants: "Write ...") is dropped so the verb leads.
  // A sentence that opens on a quote with no label is a customer speaking ("I want to see the EMI"), not a request.
  const asks: string[] = [];
  for (const s of sentencesOf(prose)) {
    // "I need Meta ad copy for cold audiences: 3 primary texts" is a request with a list, not a label.
    const lead = /^[^:"“”]{1,40}:\**\s*/.exec(s);
    // A label is dropped when it is no request itself, or when what follows it is the request ("What I need: Write ...").
    const rest = lead ? s.slice(lead[0].length).replace(/^["“]\s*/, "") : "";
    const label = lead && (!ASK.test(lead[0].replace(/[:*\s]+$/, "")) || ASK.test(rest)) ? lead : null;
    if (!label && /^["“”]/.test(s)) continue;
    if (label && /words|says?|said|quotes?|voice|tone|persona|customers?|reviews?|chat/i.test(label[0])) continue;
    const t = (label ? s.slice(label[0].length) : s).replace(/^["“]\s*/, "").replace(/["”]\s*$/, "");
    if (ASK.test(t) && !NOT_ASK.test(t)) asks.push(t);
  }
  return asks.sort((a, b) => b.length - a.length).slice(0, 5);
}

const num = (s: string) => { const m = /-?\d[\d,]*(?:\.\d+)?/.exec(s.replace(/[₹$£€]/g, "")); return m ? Number(m[0].replace(/,/g, "")) : NaN; };

/**
 * A table row named with what its first column holds ("45-54 age band", not a bare "45-54"), so the signal query
 * carries the words a card uses. A generic or repeated header adds nothing.
 */
function rowLabel(header: string, cell: string): string {
  const h = header.replace(/\*\*/g, "").trim();
  if (!/[a-z]{3}/i.test(h) || /^(item|metric|name|row|value|label|what)$/i.test(h)) return cell;
  const have = new Set(tokens(cell));
  return tokens(h).every(w => have.has(w)) ? cell : `${cell} ${h.toLowerCase()}`;
}

/**
 * The brief's data signals: in each table, the row that stands out in each number column (well above or below the
 * column's middle), said as "<row> <column> highest" or "lowest"; and prose lines that rank or share something
 * ("top return reason", "38% of chats").
 */
export function briefSignals(brief: string): string[] {
  const out: string[] = [];
  const lines = brief.replace(/\r\n?/g, "\n").split("\n");
  let table: string[][] = [];
  const flush = () => {
    // A funnel table (sessions, add to cart, checkout, orders): the row whose step rate falls far below the others.
    if (table.length >= 3 && table[0].filter(h => /session|visit|view|cart|checkout|order|purchase/i.test(h)).length >= 3) {
      const [header, ...rows] = table;
      for (let c = 2; c < header.length; c++) {
        const rates = rows.map(r => num(r[c] ?? "") / num(r[c - 1] ?? "")).map((v, i) => [v, i] as const).filter(([v]) => Number.isFinite(v) && v > 0);
        if (rates.length < 2) continue;
        const best = Math.max(...rates.map(([v]) => v));
        const [low, lowRow] = [...rates].sort((a, b) => a[0] - b[0])[0];
        if (low / best <= 0.6) out.push(`${rowLabel(header[0], rows[lowRow][0])}: ${header[c - 1]} to ${header[c]} rate lowest (fix the funnel step with the biggest drop, ${header[c - 1].toLowerCase()} to ${header[c].toLowerCase()})`);
      }
    }
    if (table.length >= 3) {
      const [header, ...rows] = table;
      for (let c = 1; c < header.length; c++) {
        const vals = rows.map(r => num(r[c] ?? "")).map((v, i) => [v, i] as const).filter(([v]) => Number.isFinite(v));
        if (vals.length < 3) continue;
        const sorted = [...vals].sort((a, b) => a[0] - b[0]);
        const mid = sorted[Math.floor(sorted.length / 2)][0];
        const [hi, hiRow] = sorted[sorted.length - 1], [lo, loRow] = sorted[0];
        const meaning = columnMeaning(header[c]);
        if (!meaning) continue;
        if (mid > 0 && hi / mid >= 1.25) out.push(`${rowLabel(header[0], rows[hiRow][0])}: ${header[c]} highest (${meaning.high})`);
        if (mid > 0 && lo / mid <= 0.75 && meaning.low) out.push(`${rowLabel(header[0], rows[loRow][0])}: ${header[c]} lowest (${meaning.low})`);
      }
    }
    table = [];
  };
  // A table row: cells split by pipes, with or without the outer pipes ("Why they bought | Share").
  const isRow = (l: string) => /^\s*\|.*\|\s*$/.test(l) || /\S\s+\|\s+\S/.test(l);
  for (const l of lines) {
    if (isRow(l)) {
      const cells = l.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim().replace(/\*\*/g, ""));
      if (!cells.every(c => /^:?-{2,}:?$/.test(c))) table.push(cells);
    } else flush();
  }
  flush();
  for (const l of lines.filter(l => !isRow(l))) {
    // A labelled list of shares ("Pre-sale chat topics: delivery 34%; firmness 19%"): its biggest item is the signal.
    const label = /^[\s*-]*([^:]{3,60}):\s*(.+)$/.exec(l);
    const items = label ? label[2].split(";").map(p => /^(.*?)[,\s]*(\d+(?:\.\d+)?)\s*%/.exec(p.trim())).filter((m): m is RegExpExecArray => !!m && m[1].trim().length >= 2)
      .map(m => [m[1].replace(/^[\s"“”]+|[\s,"“”]+$/g, ""), Number(m[2])] as const) : [];
    if (label && items.length >= 2) {
      const [top, share] = [...items].sort((a, b) => b[1] - a[1])[0];
      const meaning = columnMeaning(label[1]) ?? { high: "answer the biggest item first", low: "" };
      out.push(`${top}: ${share}% of ${label[1].replace(/\*\*/g, "").trim().toLowerCase()} (${meaning.high})`);
      continue;
    }
    for (const s of sentencesOf(l)) {
      if (/\b(top|most|biggest|main|best|worst|highest|lowest|leading|majority)\b(?!-)/i.test(s) && /\d+(\.\d+)?\s*(%|x\b|times\b)/i.test(s) && !ASK.test(s)
        && !/\bat most\b|\bwords?\b|\blength\b|\bdeadline\b|:$/i.test(s)) out.push(s);
    }
  }
  return [...new Set(out.map(s => s.replace(/\s+/g, " ").trim()))].slice(0, 8);
}

/**
 * What a standout number in a column means for the work, so the query says the decision, not just the row's name.
 * A column with no known meaning (prices, SKU counts) is not a signal.
 */
const COLUMN_MEANINGS: [RegExp, { high: string; low: string }][] = [
  [/roas|return on ad|\bmer\b/i, { high: "scale budget and creative toward the best return on ad spend segment", low: "cut or fix the worst return on ad spend segment" }],
  [/\bcpa\b|\bcac\b|cost per (purchase|acquisition|order|customer)/i, { high: "cut spend where cost per purchase is highest", low: "scale the segment with the lowest cost per purchase" }],
  [/conv|orders? after click|\bcvr\b|purchase rate|checkout rate/i, { high: "lead with the best converting product or page", low: "fix the page or offer with the lowest conversion rate" }],
  [/\bctr\b|click.?through|clicks|hook|thumb/i, { high: "relaunch the creative angle with the best click through rate", low: "creative fatigue weak hook low click through rate" }],
  [/return|refund|exchange/i, { high: "reduce returns by answering the top return reason on the product page", low: "" }],
  [/\brto\b|undelivered|cancel/i, { high: "reduce cash on delivery returns and cancellations", low: "" }],
  [/repeat|retention|reorder|\bltv\b|lifetime/i, { high: "build retention around the segment with the best repeat rate", low: "win back the segment with weak repeat purchase" }],
  [/question|chat|ticket|complaint|objection|reason/i, { high: "answer the top customer question or objection in the copy", low: "" }],
  [/margin|profit|contribution/i, { high: "push the highest margin product in offers and ads", low: "protect margin on the lowest margin product" }],
  [/open rate|click rate|unsub/i, { high: "email subject lines and timing that win opens", low: "fix email engagement and deliverability" }],
  [/share|% of|\bmix\b|customers|buyers|orders|revenue|sales|traffic|sessions|spend/i, { high: "write for the largest customer segment in its own words", low: "" }],
];
function columnMeaning(header: string): { high: string; low: string } | null {
  if (/price|\bmrp\b|cost of goods|\bsku\b|weight/i.test(header) && !/margin|profit/i.test(header)) return null;
  return COLUMN_MEANINGS.find(([re]) => re.test(header))?.[1] ?? null;
}

/**
 * The brief's stated facts about the store, each its own small query: the rows of a two-column table ("Average days
 * between orders | 34") and the prose sentences that carry a number or a belief ("Our only win-back email goes out at
 * 180 days", "The team thinks retention is improving"). An expert reads these line by line; one long query blurs them.
 */
export function briefFactLines(brief: string): string[] {
  const out: string[] = [];
  const lines = brief.replace(/\r\n?/g, "\n").split("\n");
  const isRow = (l: string) => /^\s*\|.*\|\s*$/.test(l) || /\S\s+\|\s+\S/.test(l);
  const cells = (l: string) => l.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim().replace(/\*\*/g, ""));
  for (let i = 0; i < lines.length; i++) {
    if (!isRow(lines[i])) continue;
    const table: string[][] = [];
    while (i < lines.length && isRow(lines[i])) { const c = cells(lines[i]); if (!c.every(x => /^:?-{2,}:?$/.test(x))) table.push(c); i++; }
    // A two-column table of labels and values: each row is a fact (the header row is not).
    // A label of numbers alone ("Under $35") says nothing to search on.
    if (table.length >= 2 && table.every(r => r.length === 2)) for (const [label, value] of table.slice(1)) if (tokens(label).filter(w => /^[a-z]/.test(w)).length >= 2) out.push(`${label}: ${value}`);
  }
  const prose = lines.filter(l => !isRow(l)).join("\n");
  for (const s of sentencesOf(prose)) {
    // A line that only introduces a table ("Last 30 days (7-day click):") is not a fact.
    if (ASK.test(s) || /^["“]/.test(s) || NOT_ASK.test(s) || /:\**$/.test(s)) continue;
    if (/\d/.test(s) || /\b(?:thinks?|believes?|assumes?|worried|afraid|we (?:do not|don't|never|only|always))\b/i.test(s)) out.push(s);
  }
  return [...new Set(out.map(s => s.replace(/\s+/g, " ").trim()))].slice(0, PREP.factLines);
}

/** The query plan: each request at full weight, each signal at 0.8, each stated fact lower, the whole brief lowest. */
export function planQueries(brief: string): PrepQuery[] {
  const asks = briefAsks(brief).map(text => ({ kind: "ask" as const, text, weight: PREP.askWeight }));
  const signals = briefSignals(brief).map(text => ({ kind: "signal" as const, text, weight: PREP.signalWeight }));
  const said = new Set([...asks, ...signals].map(q => q.text));
  // What the store says it does not do is no search term: "we do not send text messages" must not fetch SMS cards.
  const plain = withoutNegations(brief);
  const facts = PREP.factWeight > 0 ? briefFactLines(plain).filter(t => !said.has(t)).map(text => ({ kind: "fact" as const, text, weight: PREP.factWeight })) : [];
  return [...asks, ...signals, ...facts, { kind: "brief", text: plain.replace(/\s+/g, " ").slice(0, 2000), weight: PREP.briefWeight }];
}

/**
 * The brief without what the store says it does not do ("We do not sell on TikTok Shop", "we never run SMS"): the
 * clause is cut up to its full stop, semicolon or next "and". Used for the search text and the situation checks.
 */
export function withoutNegations(brief: string): string {
  return brief.replace(/\b(?:we|i|they)?\s*(?:do not|don't|does not|doesn't|did not|didn't|never|no longer|cannot|can't|are not|aren't)\s+(?:yet\s+|currently\s+|ever\s+)?(?:sell|use|send|run|offer|ship|have|accept|advertise|stock|list|do|take|want)\b.*?(?=\s+and\s|[.;\n]|$)/gi, " ");
}

/** The library modules each kind of request lives in. A card from a named module gets a modest boost, never a filter. */
const DELIVERABLE_MODULES: [RegExp, string[]][] = [
  [/\bemails?\b|welcome (series|flow)|newsletter|klaviyo|win.?back|abandon|post.?purchase|\bflows?\b|\bsms\b|whatsapp/i, ["EML", "CXP"]],
  [/\bads?\b|ad copy|headlines?|primary text|creatives?|concepts?|hooks?|\bugc\b|scripts?|creators?|influencers?|spark/i, ["ADC", "MCR", "AVT"]],
  [/budget|campaign|scal(e|ing)|\bbids?\b|\bmeta\b|facebook|tiktok ads|media (plan|buying)|\broas\b|advantage/i, ["MCR", "MEA", "ADC"]],
  [/google|shopping|performance max|\bpmax\b|search ads|youtube/i, ["GAD", "MEA"]],
  [/product page|\bpdp\b|landing page|advertorial|\bpages?\b|description|bullets/i, ["LPG", "CRO", "AVT"]],
  [/a\/b|split test|\btests?\b|experiment|conversion rate|\bcro\b/i, ["CRO", "MEA"]],
  [/offers?\b|discount|bundle|free shipping|threshold|pricing|\bprices?\b|\baov\b|upsell|subscription/i, ["OFF", "FIN"]],
  [/\bseo\b|organic search|collections?|\bblog\b|keywords?/i, ["SEO", "AEO"]],
  [/organic|social media|\breels\b|instagram posts|content calendar|tiktok (posts|videos)/i, ["ORG"]],
  [/amazon|listing|a\+ content|sponsored products/i, ["AMZ"]],
  [/\bcod\b|cash on delivery|\brto\b|shipping|courier|fulfil|inventory|\bstock\b|warehouse|\b3pl\b/i, ["OPS", "SET", "FIN"]],
  [/product research|new product|which product|winning product/i, ["PRD", "AVT"]],
  [/customer research|avatar|persona|reviews|survey/i, ["AVT"]],
  [/\bbrand (name|story|positioning)|positioning/i, ["BRD"]],
  [/margin|profit|cash flow|unit economics|forecast|p&l|break.?even/i, ["FIN", "MEA"]],
  [/page speed|load time|core web vitals|\blcp\b/i, ["SPD"]],
];
export function briefModules(asks: string[]): string[] {
  const text = asks.join(" ");
  return [...new Set(DELIVERABLE_MODULES.filter(([re]) => re.test(text)).flatMap(([, m]) => m))];
}

/** A card written for another market, Amazon marketplace or store platform never fits ("global" fits everywhere). */
export function fitsFacts(card: PrepCard, f: BriefFacts): boolean {
  const miss = (have: string[], want?: string) => !!want && have.length > 0 && !have.includes(want) && !have.includes("global");
  if (miss(card.markets, f.market)) return false;
  if (card.amazon.length && !f.channels.includes("amazon")) return false;
  if (miss(card.amazon, f.amazon)) return false;
  const stores: string[] = card.platforms.filter(p => p === "shopify" || p === "woocommerce");
  if (f.platform && stores.length && !stores.includes(f.platform)) return false;
  return true;
}

/**
 * Situations a card can be written for. When a card's claim or "holds when" names one and the brief never does (a
 * subscription card for a one-off store, a TikTok Shop card for a Meta-only brand), the card is pushed down, not
 * dropped: the brief may simply not say.
 */
const SITUATIONS: [RegExp, RegExp][] = [
  // Subscription products, not newsletter subscribers.
  [/subscriptions?\b|subscribe and save|recharge|\bskio\b|cancelled subscribers|active subscribers/i, /subscriptions?\b|subscribe and save|recurring (order|deliver)|replenish|renewal/i],
  [/tiktok shop|gmv max/i, /tiktok shop|gmv max/i],
  [/\bamazon\b|\bfba\b|seller central/i, /\bamazon\b/i],
  [/\bcod\b|cash on delivery|\brto\b/i, /\bcod\b|cash on delivery|\brto\b/i],
  [/black friday|\bbfcm\b|cyber monday/i, /black friday|\bbfcm\b|cyber monday|holiday sale|sale season/i],
  [/whatsapp/i, /whatsapp/i],
  [/\bsms\b|text messag/i, /\bsms\b|text messag|texts\b/i],
  [/wholesale|\bb2b\b|retailers?\b/i, /wholesale|\bb2b\b|retail/i],
  [/dropship/i, /dropship/i],
  // "New customers" or "new ad concepts" is not a new store: only a launch, a new brand or no sales yet counts.
  [/zero.to.one|pre.launch|brand.new (store|brand)|no sales yet/i, /\bnew (?:store|brand|shop|business)\b|\b(?:launch|launching|pre.?launch|first sales?|just started|no sales|zero.to.one)\b/i],
];
/** Markets a card names in its own words when it carries no market tag ("US SMS programmes"). */
const MARKET_WORDS: [string, RegExp][] = [["US", /\bUS\b|\bU\.S\.|United States|American\b/], ["IN", /\bIndia(n)?\b/], ["UK", /\bUK\b|United Kingdom|British\b/], ["EU", /\bEU\b|European\b/]];
/** Tuning only (scripts/eval-prepare.mjs): set any PREP field. */
export function tunePrep(o: Partial<typeof PREP>): void { Object.assign(PREP, o); }
export function situationPenalty(card: PrepCard, brief: string, market?: string): number {
  const missing = (said: string) => SITUATIONS.some(([c, b]) => c.test(said) && !b.test(brief));
  let p = missing(card.claim) ? PREP.situation : missing(card.holds) ? PREP.situationHolds : 1;
  if (market && !card.markets.length) {
    const named = MARKET_WORDS.filter(([, re]) => re.test(card.holds)).map(([m]) => m);
    if (named.length && !named.includes(market)) p *= PREP.situation;
  }
  return p;
}

const overlap = (a: Set<string>, b: Set<string>) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n / (a.size + b.size - n || 1); };

export class JobPrep {
  private cards: PrepCard[];
  private byPath = new Map<string, PrepCard>();
  private index: KnowledgeIndex;
  private words = new Map<string, Set<string>>();
  constructor(cards: PrepCard[]) {
    this.cards = cards;
    const files = cards.map(c => {
      const path = `knowledge/cards/${c.id}.md`;
      this.byPath.set(path, c);
      this.words.set(c.id, new Set(tokens(`${c.claim} ${c.text}`)));
      // The card line keeps each card one passage (retrieve.ts chunkMarkdown); its parts are still ranked apart.
      return { path, text: `# ${c.claim}\n\nCard ${c.id}. Tier ${c.tier}, ${c.scope}.\n\n${c.text}\n\nHolds when: ${c.holds}\n\nAsked as: ${c.asks}` };
    });
    this.index = new KnowledgeIndex(files);
  }

  prepare(brief: string, opts: { k?: number; pool?: number; facts?: Partial<BriefFacts> } = {}): Prepared {
    const k = Math.max(3, Math.min(25, opts.k ?? 15));
    const poolSize = Math.max(k, Math.min(60, opts.pool ?? PREP.pool));
    const plain = withoutNegations(brief);
    // Channels the store says it does not use are not its channels; market and platform come from the whole brief.
    const facts = { ...briefFacts(brief), channels: briefFacts(plain).channels, ...(opts.facts ?? {}) };
    const queries = planQueries(brief);
    const fused = new Map<string, { score: number; via: string[] }>();
    const gaps: string[] = [];
    const wantedModules = briefModules(queries.filter(q => q.kind === "ask").map(q => q.text));
    const routed = wantedModules.length ? this.cards.filter(c => wantedModules.includes(c.module)).map(c => `knowledge/cards/${c.id}.md`) : [];
    const adjust = (chunk: { path: string }, score: number) => {
      const card = this.byPath.get(chunk.path);
      return card && fitsFacts(card, facts) ? score * (PREP.tier[card.tier] ?? 1) : null;
    };
    const search = (q: PrepQuery, weight: number, via: boolean) => {
      // Each query searches the whole library, and again inside the requested modules (a wider, routed pool).
      const passes = [{ a: this.index.ask(q.text, { k: PREP.depth, max: PREP.depth, adjust }), w: 1 }];
      if (routed.length && q.kind !== "brief") passes.push({ a: this.index.ask(q.text, { k: PREP.depth, max: PREP.depth, adjust, paths: routed }), w: PREP.routedWeight });
      if ((q.kind === "ask" || q.kind === "signal") && (!passes[0].a.passages.length || passes[0].a.coverage < MIN_COVERAGE / 2)) gaps.push(q.text);
      for (const { a, w } of passes) a.passages.forEach((p, rank) => {
        const card = this.byPath.get(p.path);
        if (!card) return;
        const e = fused.get(card.id) ?? { score: 0, via: [] };
        e.score += (weight * w) / (PREP.rrf + rank + 1);
        if (via && q.kind !== "brief" && !e.via.includes(q.text)) e.via.push(q.text);
        fused.set(card.id, e);
      });
    };
    for (const q of queries) search(q, q.weight, true);
    // Rerank: when the card holds for a business like this one, and when several queries found it.
    const briefWords = new Set(tokens(plain));
    const wanted = new Set(wantedModules);
    const byId = new Map(this.cards.map(c => [c.id, c]));
    const rank = () => [...fused].map(([id, e]) => {
      const card = byId.get(id)!;
      const holds = card.holds ? overlap(new Set(tokens(card.holds)), briefWords) : 0;
      const prior = wanted.size ? (wanted.has(card.module) ? PREP.inModule : PREP.offModule) : 1;
      return { card, score: e.score * prior * situationPenalty(card, plain, facts.market) * (1 + Math.min(PREP.holdsCap, holds * PREP.holds)) * (1 + PREP.agree * Math.max(0, e.via.length - 1)), via: e.via };
    }).sort((a, b) => b.score - a.score || a.card.id.localeCompare(b.card.id));
    let ranked = rank();
    // Feedback from the best cards: their claims, in the library's own words, search once more at a low weight.
    if (PREP.expand > 0) {
      for (const r of ranked.slice(0, PREP.expand)) search({ kind: "brief", text: `${r.card.claim} ${r.card.holds}`, weight: PREP.expandWeight }, PREP.expandWeight, false);
      ranked = rank();
    }
    // Diversity: skip a card that says nearly what a picked card says. The first k are the tool's picks; the rest of
    // the shortlist is what the owner's AI may swap in when it grades.
    const shortlist: PrepPick[] = [];
    const top = ranked[0]?.score ?? 0;
    for (const r of ranked) {
      const w = this.words.get(r.card.id)!;
      if (shortlist.some(p => overlap(this.words.get(p.card.id)!, w) > PREP.duplicate)) continue;
      shortlist.push({ card: r.card, score: Math.round(r.score * 10000) / 10000, via: r.via });
      if (shortlist.length >= poolSize) break;
    }
    const cut = shortlist.findIndex(p => p.score < top * PREP.floor);
    const picks = shortlist.slice(0, Math.min(k, cut < 0 ? k : cut));
    // A request or signal is a gap when the library barely matches it, or when nothing it found made the digest.
    for (const q of queries) if ((q.kind === "ask" || q.kind === "signal") && !gaps.includes(q.text) && !picks.some(p => p.via.includes(q.text))) gaps.push(q.text);
    return { facts, queries, picks, shortlist, gaps };
  }

  /** One plain query, no plan, filters, rerank or diversity: the baseline an agent gets from a single lookup. */
  raw(question: string, k = 10): string[] {
    return this.index.ask(question, { k }).passages.map(p => this.byPath.get(p.path)?.id).filter((x): x is string => !!x);
  }
}

const clip = (s: string, n: number) => { const w = s.split(/\s+/); return w.length > n ? `${w.slice(0, n).join(" ")} ...` : s; };

/**
 * The grading step, said once where the agent reads it: the owner's own AI reads each short card line against the
 * store and keeps the few that fit. A word-matching tool cannot tell "fits this store" from "shares its words"; the
 * model the owner already uses can (a reranker on a shortlist, lecture 3), at about a thousand more words read.
 */
export const GRADE_STEP = [
  "## Grade these cards before drafting",
  "",
  "This list was found by matching words, so some cards near the top will not fit and some good ones sit lower down. Read every card below, in both lists, against this store and this job:",
  "",
  "- Keep a card when its \"holds when\" fits this store and it would change a call in this job.",
  "- Drop a card that is written for another kind of store, channel, market or stage, whose \"fails when\" matches this brief, or that repeats a card you kept.",
  "- Keep 10 to 15, best first. Write each kept id with a few words on the call it supports in `context/trace.md` (in a chat app, in your notes).",
  "- In a coding app, then run `node tools/prepare-job.mjs <brief> --keep ID,ID,...` with your ids, best first: it rewrites this file with only those cards, in full.",
].join("\n");

/** The kept cards after the owner's AI graded the shortlist, in its order: the digest then shows only these. */
export function keepPicks(p: Prepared, ids: string[], cards: PrepCard[]): { prepared: Prepared; unknown: string[] } {
  const byId = new Map(cards.map(c => [c.id, c]));
  const found = new Map(p.shortlist.map(x => [x.card.id, x]));
  const wanted = [...new Set(ids.map(s => s.trim().toUpperCase()).filter(Boolean))];
  const unknown = wanted.filter(id => !byId.has(id));
  const picks = wanted.filter(id => byId.has(id)).map(id => found.get(id) ?? { card: byId.get(id)!, score: 0, via: [] });
  const gaps = p.queries.filter(q => (q.kind === "ask" || q.kind === "signal") && !picks.some(x => x.via.includes(q.text))).map(q => q.text);
  return { prepared: { ...p, picks, shortlist: picks, gaps, graded: true }, unknown };
}

/** The digest an agent reads before drafting: facts used as filters, the ranked cards, the shortlist to grade, the gaps. */
export function preparedMarkdown(p: Prepared): string {
  const f = p.facts;
  const factLine = [f.market && `market ${f.market}`, f.amazon && `Amazon ${f.amazon}`, f.platform, f.cod && "cash on delivery", f.subscription && "subscription",
    f.channels.length && `channels: ${f.channels.join(", ")}`].filter(Boolean).join("; ") || "none clear; no filter applied";
  const asks = p.queries.filter(q => q.kind === "ask"), signals = p.queries.filter(q => q.kind === "signal");
  const more = p.graded ? [] : p.shortlist.slice(p.picks.length);
  return [
    "# Knowledge brief for this job",
    "",
    p.graded
      ? "Read before drafting. These are the library cards you kept when you graded the shortlist, best first. Use a card only where its \"holds when\" fits this business; check each \"fails when\" against the brief. Cite card ids in your notes, never in the deliverable."
      : "Read before drafting. These are the library cards that best match this brief, best first, then more candidates. Use a card only where its \"holds when\" fits this business; check each \"fails when\" against the brief. Cite card ids in your notes, never in the deliverable.",
    "",
    `**Facts read from the brief (used as filters):** ${factLine}.`,
    "",
    ...(asks.length ? ["**What the brief asks for:**", ...asks.map(q => `- ${q.text}`), ""] : []),
    ...(signals.length ? ["**Signals in the data:**", ...signals.map(q => `- ${q.text}`), ""] : []),
    ...(more.length ? [GRADE_STEP, ""] : []),
    p.graded ? "## Cards you kept" : "## Cards",
    "",
    // Kept cards come in full (the body and the whole holds and fails lines); before grading, short lines do.
    ...p.picks.flatMap((x, i) => [
      `${i + 1}. **${x.card.id}** ${x.card.claim} (tier ${x.card.tier}, ${x.card.scope})`,
      ...(p.graded && x.card.text ? [`   - ${x.card.text.replace(/\s*\n+\s*/g, " ")}`] : []),
      ...(x.card.holds ? [`   - Holds when: ${p.graded ? x.card.holds : clip(x.card.holds, 20)}`] : []),
      ...(x.card.fails ? [`   - Fails when: ${p.graded ? x.card.fails : clip(x.card.fails, 20)}`] : []),
      ...(x.via.length ? [`   - Found for: ${clip(x.via[0], 10)}`] : []),
    ]),
    "",
    ...(more.length ? [
      "## More candidates",
      "",
      "Shorter lines. Any of these can replace a card above when it fits this store better.",
      "",
      ...more.map((x, i) => `${p.picks.length + i + 1}. **${x.card.id}** ${clip(x.card.claim, 30)} (tier ${x.card.tier})${x.card.holds ? ` Holds when: ${clip(x.card.holds, 14)}` : ""}`),
      "",
    ] : []),
    "## Gaps",
    "",
    ...(p.gaps.length ? [
      ...p.gaps.map(g => `- No strong card for: ${clip(g, 25)}`),
      "",
      "For each gap, write the need again in an expert's words, two ways, and run `node tools/ask-knowledge.mjs \"<first way>\" \"<second way>\"` once. If nothing that comes back fits this store, decide it from the brief and the owner's data, never from memory, and say so in your notes.",
    ] : ["- None: every request and signal has a matching card."]),
    "",
    "For more on one card or one question: `node tools/ask-knowledge.mjs \"<question>\" --module <CODE>`.",
  ].join("\n");
}
