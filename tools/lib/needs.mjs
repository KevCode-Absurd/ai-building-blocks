// What each block needs before it starts and what comes after it, worked out from the inputs and outputs of every
// block, so each skill, prompt and workflow says:
//   - the steps before it, in order, each with a link to the block that does it and what to have ready,
//   - which files of the brand brain to read for this task,
//   - how to check for each thing (a coding assistant with file access: look for the file; a chat: ask for it) and what to do without it,
//   - the tools that do the job best, and the next steps, with links.
// Used by tools/add-needs.mjs (the "Before you start" and "After this" sections in each SKILL.md) and by
// site/scripts/build-index.mjs (the same chain on each block page and in workflow packs).

import { GENERIC_PORTS, familiesOf, nextSteps, sameFamily, subjectSimilarity, subjectWords, workflowPredecessors } from "../../site/src/lib/next-steps.mjs";

export const SITE = "https://useaiblocks.com";
export const BRAND_BRAIN = "website-brand-brain-builder";

/**
 * Each input, in plain words. `maker` is the block that makes it, when we have one; `part` says which part of the
 * brand brain holds it. Inputs not listed here use their type description and count as the person's own material.
 */
const BRAIN = { label: "Brand brain", what: "your facts, products, buyers, claims and voice, in one folder of eight files", maker: BRAND_BRAIN };
export const INPUTS = {
  brand_brain: BRAIN,
  product_data: { ...BRAIN, part: "products" },
  persona: { ...BRAIN, part: "buyers" },
  offer: { label: "Your offer", what: "what you sell and the real terms: price, trial, guarantee, delivery", maker: "hidden-offer-finder" },
  brief: { label: "A buyer brief", what: "who it's for, how much they already know, and what will move them", maker: "buyer-brief-writer" },
  angle_library: { label: "Buying reasons", what: "why people buy, in their own words, ranked by how many said it", maker: "customer-buying-reasons-finder" },
  ad_copy: { label: "Ad copy", what: "the headline and text of the ad", maker: "fact-based-ad-copy-writer" },
  script: { label: "A video ad script", what: "the script, beat by beat, with on-screen text", maker: "quote-video-ad-script" },
  avatar_sheet: { label: "A character sheet", what: "pictures that keep one person looking the same in every shot", maker: "avatar-storyboard-planner" },
  shot_list: { label: "A shot list", what: "the video broken into shots, with timing and on-screen text", maker: "video-ad-shot-list-maker" },
  truth_sheet: { label: "A product truth sheet", what: "what the product really looks like, read from photos, so pictures stay accurate", maker: "product-image-spec-writer" },
  gallery_plan: { label: "A gallery plan", what: "the planned pictures of a product page, one job each", maker: "product-page-gallery-planner" },
  design_direction: { label: "A design direction", what: "the page's type, colours and layout rules", maker: "landing-page-design-planner" },
  ad_breakdowns: { label: "Ad breakdowns", what: "what each reference ad does: opening, angle, format, offer and proof", maker: "competitor-ad-gap-finder" },
  shortlist: { label: "A shortlist", what: "the best few picked from a bigger set, with reasons", maker: "competitor-ad-swipe-file-builder" },
  lessons_register: { label: "Your lessons", what: "what past ads taught you: what worked, what failed and why", maker: "ai-image-fix-rules" },
  copy_draft: { label: "A draft", what: "the ad, page, email or script you want checked or improved" },
  voc_reviews: { label: "Customer words", what: "reviews, testimonials, support tickets, survey answers or call transcripts. Export them or paste them in" },
  product_photos: { label: "Product photos", what: "clear photos of the real product, from more than one angle. Attach them" },
  performance_sheet: { label: "Your results", what: "an export from Meta Ads Manager, Google Ads or your store, for set dates" },
  landing_page: { label: "Your page", what: "the landing page's link, or its text and a screenshot" },
  web_page: { label: "Your website", what: "the link to your site or the page" },
  reference_set: { label: "Reference ads", what: "ads you like and want to learn from, as screenshots or links" },
  competitor_set: { label: "Competitors", what: "the brands buyers compare you with" },
  static_ads: { label: "Your image ads", what: "the image ads, attached as pictures" },
  video_ads: { label: "Your video ads", what: "the video ads, attached or linked" },
  footage: { label: "Video clips", what: "the clips you want to edit" },
  approved_image: { label: "An approved picture", what: "the picture you've chosen to use" },
  feedback_notes: { label: "Your notes", what: "what to keep, change or drop" },
  question: { label: "Your question", what: "the decision or problem, and what a good outcome looks like" },
  mind_view: { label: "Views from great minds", what: "each mind's answer from the steps before this one, or their skill files from the minds library" },
  // Specific hand-offs added 2026-10-27 (catalogue-items/_types.yaml), so pages say "Your API spec", not "Api spec".
  idea: { label: "Your idea", what: "the product, app, business or project idea, in a line or a short paragraph" },
  customer_needs: { label: "Customer needs", what: "the problems customers want solved, ranked, each with their own words" },
  business_plan: { label: "Your business plan", what: "the idea, customers, market, how it makes money and the key numbers" },
  story_outline: { label: "A story outline", what: "the premise, the characters and the scenes in order" },
  job_description: { label: "The job description", what: "the role's title, team, duties and level, as a job post or plain notes" },
  resume: { label: "Your resume", what: "your resume or CV, pasted or attached" },
  lesson_plan: { label: "Your lesson plan", what: "the lesson or class task, the age group, the subject and the aims" },
  contract: { label: "The contract", what: "the full agreement or terms, with dates and any changes" },
  policy: { label: "The policy", what: "the written policy or rules, with the date they start" },
  incident_record: { label: "The incident record", what: "the timeline of the outage, what it affected and who did what" },
  lead_list: { label: "Your lead list", what: "your leads or open deals, exported from your CRM or a sheet" },
  customer_list: { label: "Your customer list", what: "a customer or order export with dates, amounts and what they bought" },
  deal_terms: { label: "The deal terms", what: "the price, payment terms, discounts, fees and dates of the deal" },
  financial_statements: { label: "Financial statements", what: "the income statement, balance sheet and cash flow statement, for the periods you have" },
  keyword_list: { label: "A keyword list", what: "the search keywords, with what each searcher wants and, if known, volume and difficulty" },
  search_query_report: { label: "A search query report", what: "an export from Google Search Console or the Google Ads search terms report, for set dates" },
  page_speed_report: { label: "A page speed report", what: "a PageSpeed Insights or Lighthouse result for the pages to check" },
  product_spec: { label: "The product spec", what: "what to build and how to tell it's done: a requirements doc or user stories" },
  api_spec: { label: "Your API spec", what: "the API's endpoints, data shapes, sign-in method and errors, such as an OpenAPI file" },
  data_model: { label: "The data model", what: "the database tables or collections, their fields and how they link" },
  design_tokens: { label: "Design tokens", what: "the colours, type sizes and spacing, as CSS or JSON" },
  automation_workflow: { label: "The automation", what: "the n8n, Zapier or Make workflow, exported or described step by step" },
  prompt: { label: "Your prompt", what: "the full prompt or instructions you give the AI" },
  eval_set: { label: "A test set", what: "test cases for the AI, each with the answer that counts as a pass" },
  dataset: { label: "Your data", what: "the data files, with their format and where they came from" },
  signal_data: { label: "Signal data", what: "the recorded signal or time series, with its sample rate" },
  map_data: { label: "Map data", what: "the map files, such as GeoJSON or a shapefile, with their coordinate system" },
  training_data: { label: "Training data", what: "the examples to train the model on, with how they are split" },
  ai_model: { label: "The AI model", what: "the trained model file, such as a checkpoint or ONNX file" },
  video_link: { label: "A video link", what: "the link to the video, playlist, channel or post" },
  me_file: { label: "Your me.md", what: "who you are, your work, projects, voice and preferences, with dates" },
};
/** The same hand-offs in plain words, for jobs outside the maker's line of work (their usual words are about ads). */
const PLAIN = {
  brief: { label: "A brief", what: "what the work is for, who it's for and what a good result looks like" },
  lessons_register: { label: "Your lessons", what: "what past attempts taught you: what worked, what failed and why" },
  script: { label: "A script", what: "the script, part by part" },
};
/**
 * The areas whose work reads the brand brain's products and buyers parts: marketing, pictures, selling, writing and
 * strategy (positioning and prices sit under leadership), plus the store jobs that write product pages and set prices.
 * Elsewhere (stock, supply, finance) product data is a product list.
 */
const BRAIN_AREAS = ["marketing", "design", "sales", "writing", "leadership"];
const BRAIN_TASKS = new Set(["set-up-store", "run-your-store", "set-prices", "sell-on-amazon"]);
const brainWork = (task) => BRAIN_TASKS.has(task) || BRAIN_AREAS.some((a) => familiesOf(task).has(a));

/** Which brand brain files a task reads (from the brand file builder's "which file for which task" and its slices). */
const BRAIN_FILES = {
  writing: { files: ["00-start-here.md", "offers.md", "customers.md", "proof-and-claims.md", "voice-and-look.md"], note: "the chosen offer's facts, approved claims with their conditions, buyer quotes and voice lines" },
  picture: { files: ["00-start-here.md", "voice-and-look.md", "offers.md", "proof-and-claims.md"], note: "how the product looks, the colours, fonts and photo style, and the exact words allowed on the picture. Leave out review quotes and research notes" },
  planning: { files: ["00-start-here.md", "customers.md", "offers.md", "proof-and-claims.md", "market.md"], note: "the buyers, the main promise and approved claims only" },
  results: { files: ["00-start-here.md", "log.md", "offers.md", "customers.md"], note: "what changed and when, the offers that ran, and who buys" },
  rivals: { files: ["00-start-here.md", "market.md", "business.md", "customers.md"], note: "the options buyers weigh, the competitor table and the open ground" },
  checking: { files: ["00-start-here.md", "proof-and-claims.md", "offers.md", "voice-and-look.md"], note: "the claims list with each claim's status, the offer terms word for word, and the voice rules" },
};
const VIDEO_OUT = new Set(["video_prompt", "video_ads"]);
const IMAGE_OUT = new Set(["image_prompt", "avatar_sheet", "static_ads", "photo_set", "pdp_images", "upscaled_image"]);
function brainUse(b) {
  if (b.task === "read-ad-results" || b.task === "plan-ad-tests") return BRAIN_FILES.results;
  if (b.task === "study-competitors") return BRAIN_FILES.rivals;
  if (b.task === "check-ads" || b.task === "audit-landing-page" || b.role === "check") return BRAIN_FILES.checking;
  const outs = (b.outputs ?? []).map((o) => o.type);
  if (outs.some((t) => VIDEO_OUT.has(t) || IMAGE_OUT.has(t)) || b.task === "product-photos") return BRAIN_FILES.picture;
  if (b.role === "compress" || b.role === "source" || b.task === "understand-customers") return BRAIN_FILES.planning;
  return BRAIN_FILES.writing;
}

const pathOf = (b) => (b.type === "mind" ? "minds" : b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflows" : b.type === "prompt" ? "prompts" : "skills");
export const urlOf = (b) => `${SITE}/${pathOf(b)}/${b.slug}`;
const ref = (b) => ({ slug: b.slug, name: b.name, url: urlOf(b) });
const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
/** "A video ad script", "Your offer" or "The deal terms" as it reads after "the" or "your": "video ad script", "offer", "deal terms". */
const bare = (s) => lower(s).replace(/^(a|an|your|the) /, "");

/**
 * Topic fit, for links whose only hand-off is a loose one (a report, a plan, a document, a spreadsheet): nearly every
 * block takes or makes one, and one job holds very different work (a five whys session and a partner screener are both
 * "Lead the team"; a direct mail review and a store SEO plan both hand over a report), so a shared loose hand-off, or
 * the same job, says nothing on its own. The two must also share a topic word in their names, aliases or summaries:
 * a word only a few jobs use ("currency", "deck", "interview", "invoice"), not one every kind of work uses ("score",
 * "fix", "cost", "customer"). In the same job one shared topic word is enough; across jobs it must be in both names,
 * or two must be shared.
 */
const TOPIC_JOBS = 20; // a word used by items in this many jobs or more is not a topic
/** Everyday words that spread over fewer jobs but still say nothing about the subject. */
const PLAIN_WORDS = new Set(("remain remaining likely total fail failure cause before after first last next start end turn keep keeps find finds "
  + "help helps need needs want wants right wrong good best better bad set sets run runs show shows add adds change changes point points line lines "
  + "part parts kind kinds way ways thing things time times day days week weeks month months year years people person team owner owners "
  + "detail details note notes idea ideas option options choice choices answer answers question questions fact facts number numbers figure figures "
  + "result results report reports summary draft drafts document documents file files page pages sheet sheets table tables list lists template "
  + "score scores fix fixes rule rules cost costs risk risks gap gaps issue issues problem problems case cases test tests check checks review "
  + "reviews plan plans guide guides brief briefs workflow skill skills prompt prompts agent agents tool tools task tasks "
  // Role and timing words in agent names ("GIS QA engineer", "quarterly keeper") say who or when, not what about.
  + "engineer engineers developer developers specialist specialists expert experts manager managers analyst analysts strategist "
  + "consultant consultants designer designers assistant assistants coordinator architect lead daily weekly monthly quarterly yearly "
  // What kind of tool it is, not what it is about ("generator" in a report code generator and an audio plugin generator).
  + "finder auditor drafter tracker coach picker tester mapper fixer researcher sorter modeler modeller reader investigator runner "
  + "scorer reporter updater helper collector rewriter explainer converter generator organizer organiser cleaner tuner estimator "
  + "screener ranker trainer simulator chooser copywriter preparer advisor matcher migrator troubleshooter spotter tracer producer "
  + "analyzer analyser splitter reconciler connector extractor profiler keeper editor editors "
  // Word parts and loose verbs left by hyphens and stems ("pre-launch", "pre-read"; "act" from "actions").
  + "pre post non sub act action actions self full high low top small big long quick fast easy").split(" ").map((w) => subjectWords(w)[0]).filter(Boolean));
const TOPICS = new WeakMap();
function topics(all) {
  let t = TOPICS.get(all);
  if (t) return t;
  const words = new Map(), names = new Map(), jobs = new Map(), follows = new Set();
  for (const b of all) {
    if (b.type === "mind") continue;
    const alias = (b.aliases ?? []).join(" ");
    words.set(b.slug, subjectWords(`${b.name} ${alias} ${b.summary ?? ""}`));
    names.set(b.slug, new Set(subjectWords(`${b.name} ${alias}`)));
    for (const w of words.get(b.slug)) { let s = jobs.get(w); if (!s) jobs.set(w, (s = new Set())); s.add(b.task); }
    // Reviewed evidence: a workflow runs one straight after the other, or one is built on ("uses") the other.
    const steps = (b.steps ?? []).map((s) => (typeof s === "string" ? s : Array.isArray(s) ? s[0] : s.uses));
    steps.forEach((s, i) => { if (steps[i + 1] && steps[i + 1] !== s) follows.add(`${s}>${steps[i + 1]}`); });
    for (const u of b.uses ?? []) if (u !== b.slug) follows.add(`${u}>${b.slug}`);
  }
  const topical = (w) => (jobs.get(w)?.size ?? 0) < TOPIC_JOBS && !PLAIN_WORDS.has(w) && !/^\d+$/.test(w);
  t = { words, names, topical, follows };
  TOPICS.set(all, t);
  return t;
}
/** The topic words two blocks share (see TOPIC_JOBS). */
export function sharedTopics(a, b, all) {
  const { words, topical } = topics(all), other = new Set(words.get(b.slug) ?? []);
  return (words.get(a.slug) ?? []).filter((w) => other.has(w) && topical(w));
}
/** Whether two blocks are about the same subject: in the same job one shared topic word; across jobs one in both names, or two. */
export function sameTopic(a, b, all) {
  const shared = sharedTopics(a, b, all), { names } = topics(all);
  return shared.length >= (a.task === b.task ? 1 : 2) || shared.some((w) => names.get(a.slug)?.has(w) && names.get(b.slug)?.has(w));
}
/** Whether a block is a general tool for its job: no topic word in its name ("Plan failure reviewer", "Action item tracker"). */
export function generalTool(b, all) {
  const { names, topical } = topics(all);
  return ![...(names.get(b.slug) ?? [])].some(topical);
}
/** Subject closeness (site/src/lib/next-steps.mjs subjectSimilarity) at which a same-job fallback counts as near. */
const FALLBACK_NEAR = 0.1;
/** Whether a reviewed workflow runs `to` straight after `from`, or `to` is built on ("uses") `from`. */
const reviewedAfter = (from, to, all) => topics(all).follows.has(`${from.slug}>${to.slug}`);
/**
 * Whether `to` fits after `from` (`made`: the types `from` hands over; `alike`: types they stand in for): a reviewed
 * workflow or build-on links them, or `to` takes something `from` makes and that is either a specific thing (a job
 * description, a slide deck, deal terms) or a loose one (a report, a plan, a stand-in) on the same topic (sameTopic).
 * A block that takes nothing from this one (another tool for the same job) is not a next step.
 */
export function fitsAfter(from, to, all, made, alike = new Set()) {
  if (reviewedAfter(from, to, all)) return true;
  const inputs = to.inputs ?? [];
  if (inputs.some((p) => made.has(p.type) && !GENERIC_PORTS.has(p.type))) return true;
  return inputs.some((p) => made.has(p.type) || alike.has(p.type)) && sameTopic(from, to, all);
}

/**
 * The inputs a block takes from outside: its own inputs, and for a workflow anything specific a step needs that no
 * earlier step makes. A step's generic input (a brief, a plan, a report) is the hand-off between steps, not an extra.
 */
function outsideInputs(b, bySlug) {
  const own = b.inputs ?? [];
  if (!b.steps?.length) return own;
  const made = new Set();
  const extra = [];
  for (const s of b.steps) {
    const step = bySlug[s.uses];
    if (!step) continue;
    for (const p of step.inputs ?? []) if (!made.has(p.type) && !GENERIC_PORTS.has(p.type)) extra.push({ type: p.type, required: false, step: true });
    for (const o of step.outputs ?? []) made.add(o.type);
  }
  const seen = new Set(own.map((p) => p.type));
  return [...own, ...extra.filter((p) => !seen.has(p.type) && (seen.add(p.type), true))];
}

/**
 * An input as it reads for a block in job `task`. A hand-off named for one line of work is only that thing, made by
 * our named maker, inside that line of work: a finance check's brief is not a buyer brief, a decision log's lessons
 * are not ad lessons, and a stock sheet's product data is not the brand brain. Outside it: plain words, no maker.
 * Asking for the brand brain by name counts anywhere.
 */
function inputInfo(type, task, bySlug, describe) {
  const info = INPUTS[type] ?? describe(type);
  const home = info.maker && bySlug[info.maker];
  if (!home || type === "brand_brain" || (info.part ? brainWork(task) : sameFamily(task, home.task))) return info;
  return PLAIN[type] ?? (info.part || GENERIC_PORTS.has(type) ? describe(type) : { label: info.label, what: info.what });
}

/**
 * What a block needs, as { needed, helps }: each item { key, label, what, parts, required, maker?: { slug, name, url } }.
 * Things the block makes itself are left out, and the brand brain's parts are merged into one item.
 */
export function needsOf(b, bySlug, describe = (t) => ({ label: t, what: t })) {
  const byKey = new Map();
  for (const p of outsideInputs(b, bySlug)) {
    // A transformation may take and return the same type (notes, drafts, tables).
    // outsideInputs already tracks what earlier workflow steps have made; a
    // later output must not erase material needed to start the job.
    const info = inputInfo(p.type, b.task, bySlug, describe);
    // One step reading the brand brain (a plain-English editor keeping the voice) is no reason to ask for it outside brand work.
    if (p.step && info.maker === BRAND_BRAIN && !brainWork(b.task)) continue;
    if (info.maker === b.slug) continue; // a block never needs what it makes (the brand file builder needs no brand brain)
    if (info.maker && b.steps?.some((st) => st.uses === info.maker)) continue; // a workflow whose own step makes it
    const maker = info.maker && bySlug[info.maker] ? bySlug[info.maker] : null;
    const key = maker ? maker.slug : p.type;
    const item = byKey.get(key) ?? { key, label: info.label, what: info.what, parts: [], required: false, maker: maker ? ref(maker) : undefined };
    if (info.part && !item.parts.includes(info.part)) item.parts.push(info.part);
    item.required ||= !!p.required;
    byKey.set(key, item);
  }
  const all = [...byKey.values()].sort((x, y) => (y.key === BRAND_BRAIN) - (x.key === BRAND_BRAIN) || y.required - x.required);
  return { needed: all.filter((i) => i.required), helps: all.filter((i) => !i.required) };
}

/**
 * The steps before this block, in the order to do them: each block that makes something it needs, after the blocks
 * those need in turn. Each step says what the person brings to it. Only steps for things this block needs, plus the
 * brand brain whenever any step reads it.
 */
export function chainOf(b, bySlug, describe, { before, all } = {}) {
  const order = [];
  // A reviewed per-item list (page.yaml or item.yaml `before:`) replaces the worked-out chain.
  if (Array.isArray(before)) return before.map((slug) => bySlug[slug]).filter((x) => x && x.slug !== b.slug).map((x) => {
    const own = needsOf(x, bySlug, describe);
    return { ...ref(x), label: x.name, bring: [...own.needed, ...own.helps].filter((i) => !i.maker).map((i) => `${lower(i.label)}${i.required ? "" : " (optional)"}`), uses: [...own.needed, ...own.helps].filter((i) => i.maker).map((i) => i.label) };
  });
  const seen = new Set([b.slug, ...(b.steps ?? []).map((st) => st.uses)]); // a workflow's own steps aren't steps before it
  // What's needed brings its own steps before it; an optional extra is one step (its own needs show as "It uses").
  const visit = (block, depth, onlyNeeded) => {
    const { needed, helps } = needsOf(block, bySlug, describe);
    for (const i of [...needed, ...(onlyNeeded ? [] : helps)]) {
      if (!i.maker || seen.has(i.maker.slug) || depth > 3) continue;
      seen.add(i.maker.slug);
      const maker = bySlug[i.maker.slug];
      if (i.required) visit(maker, depth + 1, true);
      const own = needsOf(maker, bySlug, describe);
      order.push({ ...i.maker, label: i.label, bring: [...own.needed, ...own.helps].filter((x) => !x.maker).map((x) => `${lower(x.label)}${x.required ? "" : " (optional)"}`), uses: [...own.needed, ...own.helps].filter((x) => x.maker).map((x) => x.label) });
    }
  };
  visit(b, 0, false);
  // Reviewed workflows show what usually comes first: a block that ran straight before this one, does the same line of
  // work and hands over something it reads. Used when the inputs alone name no maker.
  if (all && order.length < 2) {
    const reads = new Set((b.inputs ?? []).map((p) => p.type));
    for (const { x } of workflowPredecessors(b, all)) {
      if (order.length >= 2) break;
      if (seen.has(x.slug) || x.type === "mind" || x.category === "orchestrator" || !sameFamily(b.task, x.task)) continue;
      const hands = (x.outputs ?? []).map((o) => o.type).filter((t) => reads.has(t));
      // A loose hand-off (a report, a plan) only counts between blocks on the same topic (sameTopic).
      if (!hands.length || (hands.every((t) => GENERIC_PORTS.has(t)) && !sameTopic(x, b, all))) continue;
      seen.add(x.slug);
      const own = needsOf(x, bySlug, describe), info = inputInfo(hands[0], b.task, bySlug, describe);
      order.push({ ...ref(x), label: info.label, bring: [...own.needed, ...own.helps].filter((i) => !i.maker).map((i) => `${lower(i.label)}${i.required ? "" : " (optional)"}`), uses: [...own.needed, ...own.helps].filter((i) => i.maker).map((i) => i.label) });
    }
  }
  return order.sort((x, y) => (y.slug === BRAND_BRAIN) - (x.slug === BRAND_BRAIN));
}

/** The jobs, as the site shows them (docs/PAGE-FORMAT.md), phrased as a next step. */
export const NEXT_JOB = {
  "check-ads": "Check it before it goes live",
  "write-ad-copy": "Write the ad copy",
  "make-image-ads": "Make image ads",
  "make-video-ads": "Make video ads",
  "plan-ad-tests": "Plan what to test",
  "read-ad-results": "Read your ad results",
  "audit-landing-page": "Check the landing page",
  "write-landing-page": "Write the landing page",
  "product-photos": "Make product photos",
  "understand-customers": "Understand your buyers",
  "brand-file": "Fill the gaps in your brand brain",
  "study-competitors": "Study competitor ads",
  "make-offer": "Make an offer people want",
  "grow-social": "Grow on social",
  "set-up-ai": "Set up AI to work for you",
  "think-with-minds": "Talk it through with great minds",
  "test-an-idea": "Test the idea with real people",
  "plan-strategy": "Plan your strategy",
  "build-product": "Shape the product",
  "build-software": "Build it",
  "sell-and-negotiate": "Sell it",
  "lead-people": "Lead the team",
  "speak-and-persuade": "Say it to the room",
  "write-and-tell-stories": "Tell it as a story",
  "design-work": "Design it",
  "think-and-decide": "Decide what to do",
  "money-and-investing": "Check the money",
};
/** Families of jobs now come from the site taxonomy (site/src/lib/next-steps.mjs: familiesOf). */
const START_HERE = ["fact-based-ad-copy-writer", "website-brand-brain-builder", "customer-buying-reasons-finder", "brand-voice-editor", "landing-page-30-point-checker", "quote-video-ad-script", "meta-ads-compliance-checker", "buyer-brief-writer", "hidden-offer-finder"];

/**
 * The paths from here: blocks that take what this block makes, one per job, best fit first. After something is made,
 * the check comes first (ad copy, then the Meta ads check). Each: { job, label, slug, name, url, takes }.
 */
const LIKE = { hooks: "ad_copy", objection_map: "angle_library", photo_set: "product_photos", upscaled_image: "approved_image", edit_plan: "video_ads", theme_files: "landing_page", brand_guide: "brand_brain" };

/** Blocks that open many paths get a chosen list: the brand brain feeds almost everything. */
const NEXT_CHOSEN = {
  "website-brand-brain-builder": ["customer-buying-reasons-finder", "fact-based-ad-copy-writer", "quote-video-ad-script", "hidden-offer-finder", "ad-matched-landing-page-writer", "founder-interview-planner"],
  "rough-notes-to-minutes-writer": ["weekly-meeting-actions-keeper", "board-minutes-drafter"],
};

/** The brand brain's parts as a hand-off: a buyer profile builder hands over a buyer profile, not the whole brand brain. */
const PART_LABEL = { persona: "buyer profile", product_data: "product facts" };
/** A hand-off as "Takes the …" names it. What it takes is what this block made, so a brief is "the brief", not a buyer brief. */
export const handoffLabel = (type) => PART_LABEL[type] ?? bare((PLAIN[type] ?? INPUTS[type])?.label ?? type.replace(/_/g, " "));

/**
 * How many links the fallback gives when nothing fits: one, as a suggestion, not a padded list. It is the best link in
 * the same job that takes something this one makes and is close in subject (FALLBACK_NEAR) or a general tool for that
 * job (generalTool); with no such hand-off, a close sibling. Never a tool for some other subject (a MATLAB audio plugin
 * after a Google Ads report script): then the page suggests nothing.
 */
const FALLBACK_LINKS = 1;
export function nextOf(b, all, max = 5, override) {
  const outs = new Set((b.outputs ?? []).map((o) => o.type));
  if (outs.has("brand_brain")) { outs.add("product_data"); outs.add("persona"); } // its products and buyers parts
  // Results no block takes by name still go somewhere: opening lines can stand in for ad copy, a theme for a page, and
  // so on. A stand-in helps pick the paths, but "Takes the …" only names what this block really makes.
  const alike = [...outs].map((t) => LIKE[t]).filter((t) => t && !outs.has(t));
  const link = (x, takes = (x.inputs ?? []).filter((p) => outs.has(p.type)).map((p) => p.type)) => ({ job: x.task, label: NEXT_JOB[x.task] ?? x.name, ...ref(x), takes: [...new Set(takes.map(handoffLabel))] });
  // A reviewed per-item list (page.yaml or item.yaml `next:`), then the chosen lists below, beat the worked-out paths.
  const chosen = Array.isArray(override) ? override : NEXT_CHOSEN[b.slug];
  if (chosen) return chosen.map((slug) => all.find((x) => x.slug === slug)).filter((x) => x && x.slug !== b.slug).slice(0, Math.max(max, chosen.length)).map((x) => link(x));
  if (!outs.size) return [];
  // Reviewed workflows, specific hand-offs and the same subject decide (site/src/lib/next-steps.mjs). A check comes
  // first after something people will see; a generic report or brief only links within the same job and subject.
  // Its hand-offs come strongest first (a specific thing the next block needs, then a generic one).
  // Only blocks that fit this one's job are suggested (fitsAfter): a workflow or build-on link, a specific hand-off, or
  // a loose hand-off on the same topic. Only when nothing fits, one fallback within the same job (FALLBACK_LINKS).
  const made = new Set(outs), options = { max, outs: [...outs], alike, startHere: START_HERE };
  const takes = (x) => (x.inputs ?? []).some((p) => made.has(p.type) || alike.includes(p.type));
  let found = nextSteps(b, all, { ...options, exclude: (x) => !fitsAfter(b, x, all, made, new Set(alike)) });
  const fallback = (ok) => nextSteps(b, all, { ...options, max: Math.min(max, FALLBACK_LINKS), exclude: (x) => x.task !== b.task || !ok(x) });
  if (!found.length) found = fallback((x) => takes(x) && (generalTool(x, all) || subjectSimilarity(b, x, all) >= FALLBACK_NEAR));
  // With no hand-off at all, a close sibling: another tool for the same thing (an Amazon keyword picker after a listing draft).
  if (!found.length) found = fallback((x) => subjectSimilarity(b, x, all) >= FALLBACK_NEAR);
  return found.map(({ x, takes }) => link(x, takes));
}

/** Everything the page and the SKILL.md show: the needs, the chain before, the brand brain files and the next steps. */
export function planOf(b, bySlug, all, describe, links = b.links ?? {}) {
  const { needed, helps } = needsOf(b, bySlug, describe);
  const usesBrain = [...needed, ...helps].some((i) => i.key === BRAND_BRAIN);
  return { job: b.task, needed, helps, chain: chainOf(b, bySlug, describe, { before: links.before, all }), brain: usesBrain ? brainUse(b) : null, next: nextOf(b, all, 5, links.next) };
}

const itemLine = (i) => {
  const part = i.parts.length && i.key === BRAND_BRAIN ? ` (its ${i.parts.join(" and ")} part)` : "";
  return i.maker ? `- **${i.label}**${part}, made by the [${i.maker.name}](${i.maker.url}): ${i.what}.` : `- **${i.label}** (yours): ${i.what}.`;
};

/** The "Before you start" section for a SKILL.md. `tools` is page.yaml's works_best_with.tools. */
export function beforeSection(plan, tools = [], nl = "\n") {
  const { needed, helps, chain, brain } = plan;
  const items = [...needed, ...helps];
  if (!items.length && !tools.length) return null;
  const out = ["## Before you start", "Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.", ""];
  if (needed.length) out.push("**What you need** (use your own material or the linked skill):", ...needed.map(itemLine), "");
  if (helps.length) out.push("**Makes it better (optional):**", ...helps.map(itemLine), "");
  if (chain.length) {
    out.push("**Recommended steps before this one** (optional; do each once, then reuse what it makes):");
    chain.forEach((s, n) => {
      const bring = s.bring.length ? ` Bring ${s.bring.join(", ")}.` : "";
      // Labels start "A", "Your" or "The" ("A buyer brief", "Your offer"); after "your" they read "buyer brief", "offer".
      const uses = s.uses.length ? ` It uses your ${s.uses.map(bare).join(" and ")}.` : "";
      out.push(`${n + 1}. **${s.label}** with the [${s.name}](${s.url}).${bring}${uses}`);
    });
    out.push(`${chain.length + 1}. This one.`, "");
  }
  if (brain) out.push(`**From the brand brain, read:** ${brain.files.map((f) => `\`${f}\``).join(", ")}. Take ${brain.note}. Source notes and rejected ideas never go into the result.`, "");
  out.push("How to start:");
  out.push(brain
    ? "1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too: a brand brain is a folder with `00-start-here.md` in it (often `brand-brain/`). If it's there, read that file and the files above. Look for the other things by name."
    : "1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.");
  const ask = items.slice(0, 3).map((i) => (i.key === BRAND_BRAIN ? "your brand brain" : lower(i.label)));
  out.push(ask.length
    ? `2. **Check what's missing.** Look for ${ask.join(", ")}. They can attach files, paste the details, or share a file path your assistant can read.${items.some((i) => i.maker) || chain.length ? " Offer the linked skills above when they help prepare that material." : ""} Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.`
    : "2. **Check the setup.** Use the tools listed below when the task needs them. If a tool is unavailable, say what you can do with the details provided. Do not claim you used it.");
  out.push("3. **Do the job.** Follow the method with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once and merge steps that give the same thing. In CHECKS MISSED, list checks that failed or could not run. If every required check ran and passed, write “none”.");
  if (tools.length) out.push("", "**Tools that do this best:**", ...tools.map((t) => `- **${t.name}:** ${t.why}`));
  return out.join(nl);
}

/** The "After this" section: the AI asks what's next, with the paths from here as links. */
export function afterSection(plan, nl = "\n") {
  if (!plan.next.length) return null;
  const takes = (x) => [...new Set(x.takes)].join(" and ");
  return [
    "## After this",
    "When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:",
    // A job with no "next" label falls back to the skill's own name; then just name the skill once.
    // A reviewed next-step list can name a skill whose inputs match nothing this one makes; then leave out "It takes the ."
    ...plan.next.map((x, n) => {
      const t = takes(x);
      const tail = t ? ` It takes the ${t}.` : "";
      // The job's phrase only says something when the link moves to another job, and "Set up AI" holds unrelated set-ups.
      // Said once: two checks in a row read "Check it before it goes live" over the first only.
      const named = x.label === x.name || x.job === plan.job || x.job === "set-up-ai" || plan.next.slice(0, n).some((y) => y.job === x.job);
      return named ? `- The [${x.name}](${x.url}).${tail}` : `- **${x.label}** with the [${x.name}](${x.url}).${tail}`;
    }),
    "If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.",
  ].join(nl);
}
