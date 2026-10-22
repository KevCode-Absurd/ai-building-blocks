// What each block needs before it starts and what comes after it, worked out from the inputs and outputs of every
// block, so each skill, prompt and workflow says:
//   - the steps before it, in order, each with a link to the block that does it and what to have ready,
//   - which files of the brand brain to read for this task,
//   - how to check for each thing (a coding assistant with file access: look for the file; a chat: ask for it) and what to do without it,
//   - the tools that do the job best, and the next steps, with links.
// Used by tools/add-needs.mjs (the "Before you start" and "After this" sections in each SKILL.md) and by
// site/scripts/build-index.mjs (the same chain on each block page and in workflow packs).

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

/** The inputs a block takes from outside: its own inputs, and for a workflow anything a step needs that no earlier step makes. */
function outsideInputs(b, bySlug) {
  const own = b.inputs ?? [];
  if (!b.steps?.length) return own;
  const made = new Set();
  const extra = [];
  for (const s of b.steps) {
    const step = bySlug[s.uses];
    if (!step) continue;
    for (const p of step.inputs ?? []) if (!made.has(p.type)) extra.push({ type: p.type, required: false });
    for (const o of step.outputs ?? []) made.add(o.type);
  }
  const seen = new Set(own.map((p) => p.type));
  return [...own, ...extra.filter((p) => !seen.has(p.type) && (seen.add(p.type), true))];
}

/**
 * What a block needs, as { needed, helps }: each item { key, label, what, parts, required, maker?: { slug, name, url } }.
 * Things the block makes itself are left out, and the brand brain's parts are merged into one item.
 */
export function needsOf(b, bySlug, describe = (t) => ({ label: t, what: t })) {
  const madeHere = new Set((b.outputs ?? []).map((o) => o.type));
  const madeBySteps = new Set((b.steps ?? []).flatMap((s) => (bySlug[s.uses]?.outputs ?? []).map((o) => o.type)));
  const byKey = new Map();
  for (const p of outsideInputs(b, bySlug)) {
    if (madeHere.has(p.type) || madeBySteps.has(p.type)) continue;
    const info = INPUTS[p.type] ?? describe(p.type);
    if (info.maker === b.slug) continue; // a block never needs what it makes (the brand file builder needs no brand brain)
    if (b.steps?.some((st) => st.uses === info.maker)) continue; // a workflow whose own step makes it
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
export function chainOf(b, bySlug, describe) {
  const order = [];
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
/** Families of jobs (everything not listed is marketing), and the result types broad enough to feed any job. */
const FAMILY = {
  "test-an-idea": "business", "plan-strategy": "business", "build-product": "business", "money-and-investing": "business", "think-and-decide": "business",
  "lead-people": "people", "speak-and-persuade": "people", "sell-and-negotiate": "people",
  "write-and-tell-stories": "craft", "design-work": "craft", "build-software": "software",
};
const familyOf = (task) => FAMILY[task] ?? "marketing";
const BROAD = new Set(["audit_report", "plan", "brief", "question", "feedback_notes", "shortlist", "copy_draft"]);
const START_HERE = ["fact-based-ad-copy-writer", "website-brand-brain-builder", "customer-buying-reasons-finder", "brand-voice-editor", "landing-page-30-point-checker", "quote-video-ad-script", "meta-ads-compliance-checker", "buyer-brief-writer", "hidden-offer-finder"];

/**
 * The paths from here: blocks that take what this block makes, one per job, best fit first. After something is made,
 * the check comes first (ad copy, then the Meta ads check). Each: { job, label, slug, name, url, takes }.
 */
const LIKE = { hooks: "ad_copy", objection_map: "angle_library", photo_set: "product_photos", upscaled_image: "approved_image", edit_plan: "video_ads", theme_files: "landing_page", brand_guide: "brand_brain" };

/** Blocks that open many paths get a chosen list: the brand brain feeds almost everything. */
const NEXT_CHOSEN = {
  "website-brand-brain-builder": ["customer-buying-reasons-finder", "fact-based-ad-copy-writer", "quote-video-ad-script", "hidden-offer-finder", "ad-matched-landing-page-writer", "founder-interview-planner"],
};

export function nextOf(b, all, max = 5) {
  const outs = new Set((b.outputs ?? []).map((o) => o.type));
  if (!outs.size) return [];
  if (outs.has("brand_brain")) { outs.add("product_data"); outs.add("persona"); } // its products and buyers parts
  // Results no block takes by name still go somewhere: opening lines are ad copy, a theme is a page, and so on.
  for (const t of [...outs]) if (LIKE[t]) outs.add(LIKE[t]);
  if (NEXT_CHOSEN[b.slug]) {
    return NEXT_CHOSEN[b.slug].map((slug) => all.find((x) => x.slug === slug)).filter(Boolean)
      .map((x) => ({ job: x.task, label: NEXT_JOB[x.task] ?? x.name, ...ref(x), takes: [...new Set(x.inputs.filter((p) => outs.has(p.type)).map((p) => bare(INPUTS[p.type]?.label ?? p.type)))] }));
  }
  const fit = (x) => x.inputs.filter((p) => outs.has(p.type)).reduce((s, p) => s + (p.required ? 3 : 1), 0)
    + (START_HERE.includes(x.slug) ? 2 : 0) + (x.usedIn?.length ? 1 : 0) - (x.inputs.filter((p) => p.required && !outs.has(p.type)).length * 0.5)
    // A skill tested on a real business comes before a newer one for the same job.
    + (x.tested?.result === "pass" ? 3 : 0);
  // A check comes next only after something people will see: an ad, a script, a page.
  const creative = [...outs].some((t) => ["hooks", "ad_copy", "script", "static_ads", "video_ads", "landing_page", "copy_draft", "pdp_copy", "email_flow", "image_prompt", "video_prompt"].includes(t));
  // A report, a plan or a brief can feed almost anything. A match on one of those only counts within the same family
  // of jobs, so a product page audit doesn't lead to a hiring plan.
  const sameFamily = (x) => familyOf(b.task) === familyOf(x.task);
  const linked = (x) => x.inputs?.some((p) => outs.has(p.type) && (!BROAD.has(p.type) || sameFamily(x)));
  const best = new Map();
  for (const x of all) {
    if (x.slug === b.slug || x.category === "orchestrator" || x.twin === b.slug || !linked(x)) continue;
    if (!creative && (x.task === "check-ads" || x.task === "audit-landing-page")) continue;
    const score = fit(x);
    const job = x.task;
    if (!best.has(job) || best.get(job).score < score) best.set(job, { x, score });
  }
  return [...best.entries()]
    .sort(([ja, a], [jb, c]) => (creative ? (jb === "check-ads") - (ja === "check-ads") : 0) || (jb === b.task) - (ja === b.task) || c.score - a.score)
    .slice(0, max)
    .map(([job, { x }]) => ({ job, label: NEXT_JOB[job] ?? x.name, ...ref(x), takes: [...new Set(x.inputs.filter((p) => outs.has(p.type)).map((p) => bare(INPUTS[p.type]?.label ?? p.type.replace(/_/g, " "))))] }));
}

/** Everything the page and the SKILL.md show: the needs, the chain before, the brand brain files and the next steps. */
export function planOf(b, bySlug, all, describe) {
  const { needed, helps } = needsOf(b, bySlug, describe);
  const usesBrain = [...needed, ...helps].some((i) => i.key === BRAND_BRAIN);
  return { needed, helps, chain: chainOf(b, bySlug, describe), brain: usesBrain ? brainUse(b) : null, next: nextOf(b, all) };
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
  const out = ["## Before you start", "This skill runs on its own. What's below makes the result better, but none of it is required.", ""];
  if (needed.length) out.push("**Works best with** (or they can paste their own instead):", ...needed.map(itemLine), "");
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
  out.push(`2. **If something is missing, advise, don't block.** In one short message, say this skill works on its own and will be better with ${ask.join(", ")}. They can attach them, paste them, or say where they are (a file path if your assistant can read the project).${items.some((i) => i.maker) || chain.length ? " Name the recommended steps above as a suggestion, with their links." : ""} Then ask: "Add them, or shall I go ahead with what you've given me?" If their message already says to go ahead, skip this and start.`);
  out.push("3. **When they say go ahead,** do the whole job with what you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it. Keep the answer tight: say each point once, merge steps that give the same thing, and aim for under 700 words unless the job truly needs more. In CHECKS MISSED, name only the checks that failed, or write “none”.");
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
    ...plan.next.map((x) => (x.label === x.name ? `- The [${x.name}](${x.url}). It takes the ${takes(x)}.` : `- **${x.label}** with the [${x.name}](${x.url}). It takes the ${takes(x)}.`)),
    "If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.",
  ].join(nl);
}
