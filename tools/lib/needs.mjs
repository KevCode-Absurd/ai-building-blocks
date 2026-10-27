// What each block needs before it starts and what comes after it, worked out from the inputs and outputs of every
// block, so each skill, prompt and workflow says:
//   - the steps before it, in order, each with a link to the block that does it and what to have ready,
//   - which files of the brand brain to read for this task,
//   - how to check for each thing (a coding assistant with file access: look for the file; a chat: ask for it) and what to do without it,
//   - the tools that do the job best, and the next steps, with links.
// Used by tools/add-needs.mjs (the "Before you start" and "After this" sections in each SKILL.md) and by
// site/scripts/build-index.mjs (the same chain on each block page and in workflow packs).

import { GENERIC_PORTS, familiesOf, nextSteps, sameFamily, subjectSimilarity, workflowPredecessors } from "../../site/src/lib/next-steps.mjs";

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
/** "A video ad script" or "Your offer" as it reads after "the": "video ad script", "offer". */
const bare = (s) => lower(s).replace(/^(a|an|your) /, "");

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
      if (!hands.length || (hands.every((t) => GENERIC_PORTS.has(t)) && subjectSimilarity(b, x, all) < 0.05)) continue;
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

export function nextOf(b, all, max = 5, override) {
  const outs = new Set((b.outputs ?? []).map((o) => o.type));
  if (outs.has("brand_brain")) { outs.add("product_data"); outs.add("persona"); } // its products and buyers parts
  // Results no block takes by name still go somewhere: opening lines are ad copy, a theme is a page, and so on.
  for (const t of [...outs]) if (LIKE[t]) outs.add(LIKE[t]);
  // What it takes is what this block made, so a brief is "the brief", not a buyer brief.
  const link = (x) => ({ job: x.task, label: NEXT_JOB[x.task] ?? x.name, ...ref(x), takes: [...new Set((x.inputs ?? []).filter((p) => outs.has(p.type)).map((p) => bare((PLAIN[p.type] ?? INPUTS[p.type])?.label ?? p.type.replace(/_/g, " "))))] });
  // A reviewed per-item list (page.yaml or item.yaml `next:`), then the chosen lists below, beat the worked-out paths.
  const chosen = Array.isArray(override) ? override : NEXT_CHOSEN[b.slug];
  if (chosen) return chosen.map((slug) => all.find((x) => x.slug === slug)).filter((x) => x && x.slug !== b.slug).slice(0, Math.max(max, chosen.length)).map(link);
  if (!outs.size) return [];
  // Reviewed workflows, specific hand-offs and the same subject decide (site/src/lib/next-steps.mjs). A check comes
  // first after something people will see; a generic report or brief only links within the same job and subject.
  return nextSteps(b, all, { max, outs: [...outs], startHere: START_HERE }).map(({ x }) => link(x));
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
      const uses = s.uses.length ? ` It uses your ${s.uses.map(lower).join(" and ")}.` : "";
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
    ...plan.next.map((x) => {
      const t = takes(x);
      const tail = t ? ` It takes the ${t}.` : "";
      // The job's phrase only says something when the link moves to another job, and "Set up AI" holds unrelated set-ups.
      const named = x.label === x.name || x.job === plan.job || x.job === "set-up-ai";
      return named ? `- The [${x.name}](${x.url}).${tail}` : `- **${x.label}** with the [${x.name}](${x.url}).${tail}`;
    }),
    "If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.",
  ].join(nl);
}
