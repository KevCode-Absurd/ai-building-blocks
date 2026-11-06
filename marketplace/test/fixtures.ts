// Fixture job types and a persona for module tests. Real content lives in src/modules/*/data.
import type { JobType, Persona } from "../src/core/types.ts";

export const LANDING_PAGE: JobType = {
  id: "landing-page-copy",
  title: "Landing page copy",
  summary: "Copy for one landing page that turns visitors into sign-ups or sales.",
  area: "marketing",
  deliverable: "Headline, subhead, 3 to 5 sections, proof points, FAQ and calls to action, ready to paste into your page builder.",
  format: "markdown",
  turnaround_hours: 24,
  spec_fields: [
    { id: "product", label: "What are you selling?", type: "longtext", required: true, max: 2000 },
    { id: "audience", label: "Who is it for?", type: "text", required: true, max: 300 },
    { id: "goal", label: "What should visitors do?", type: "choice", required: true, options: ["Sign up", "Buy", "Book a call", "Join a waitlist"] },
    { id: "proof", label: "Proof you can use", type: "list", required: false, help: "Numbers, reviews, logos or awards we may quote.", max: 10 },
    { id: "sections", label: "Number of sections", type: "number", required: false, max: 12 },
  ],
  rubric: [
    { id: "clear_offer", text: "A first-time visitor understands what is offered and for whom within the first screen.", weight: 5, pass_rule: "Headline and subhead together name the product category, the audience and the main benefit.", critical: true, source: "template" },
    { id: "one_action", text: "Every section leads to the one action the buyer chose.", weight: 4, pass_rule: "There is one primary call to action, repeated at least twice, matching the goal field.", critical: false, source: "template" },
    { id: "proof_used", text: "Claims are backed by the proof the buyer gave, and nothing is invented.", weight: 5, pass_rule: "No number, review, customer name or award appears that is not in the brief.", critical: true, source: "template" },
    { id: "objections", text: "The main objections of this audience are answered.", weight: 3, pass_rule: "At least three likely objections are answered in sections or the FAQ.", critical: false, source: "template" },
    { id: "plain_words", text: "Plain, specific words; no filler or buzzwords.", weight: 3, pass_rule: "No sentence over 25 words in headlines or buttons; no phrases like 'unlock', 'revolutionize' or 'seamless'.", critical: false, source: "template" },
  ],
  price: { base_usd: 149, min_usd: 99, max_usd: 399, size: { field: "sections", unit: "section", included: 5, per_unit_usd: 25 }, rush_multiplier: 1.5 },
  baseline_prompt: "You are a skilled conversion copywriter. Write landing page copy for the product described below. Include a headline, subhead, 3 to 5 sections, proof points, an FAQ and calls to action that match the stated goal. Use only facts given in the brief.",
  not_for: ["Fake reviews or invented testimonials", "Claims about health, money or legal outcomes the buyer cannot prove"],
  sample_briefs: [
    { id: "pub_1", visibility: "public", text: "We sell a $29/month scheduling app for dog groomers. Most are one-person shops booking by text message. We want them to start a free trial." },
    { id: "pub_2", visibility: "public", text: "Bookkeeping service for Shopify stores doing $20k to $200k a month. Flat fee from $300 a month. Goal: book a 20-minute call." },
    { id: "hid_1", visibility: "hidden", text: "A refillable deodorant brand selling direct. 4.7 stars from 2,100 reviews. We want first-time buyers to order the starter kit." },
    { id: "hid_2", visibility: "hidden", text: "Waitlist page for a bilingual (English/Spanish) tutoring app for parents of 8 to 12 year olds, launching in March." },
  ],
  keywords: ["landing page", "sales page", "website copy", "homepage copy", "conversion"],
  demand_sources: [{ note: "Fixture for tests only.", url: "https://example.com/fixture" }],
};

export const BLOG_POST: JobType = {
  ...LANDING_PAGE,
  id: "seo-blog-post",
  title: "SEO blog post",
  summary: "One search-friendly article that answers what your buyers are searching for.",
  area: "content",
  deliverable: "A 1,200 to 2,000 word article with title, meta description, headings and internal link suggestions.",
  spec_fields: [
    { id: "topic", label: "Topic or keyword", type: "text", required: true, max: 200 },
    { id: "audience", label: "Who reads it?", type: "text", required: true, max: 300 },
    { id: "words", label: "Length in words", type: "number", required: false, max: 4000 },
  ],
  price: { base_usd: 129, min_usd: 89, max_usd: 349, size: { field: "words", unit: "word", included: 1500, per_unit_usd: 0.06 }, rush_multiplier: 1.5 },
  keywords: ["blog post", "article", "seo article", "content"],
};

export const FIXTURE_JOB_TYPES: JobType[] = [LANDING_PAGE, BLOG_POST];

export const NOVA: Persona = {
  id: "nova-seo",
  kind: "house",
  name: "Nova",
  title: "SEO strategist",
  tagline: "Gets your pages found by the people already searching for you.",
  area: "marketing",
  status: "live",
  sort: 10,
  profile: {
    bio: "I find what your buyers type into Google and turn it into pages that rank. I start from your business goal, not from keyword volume.",
    outcomes: [
      { id: "blog_post", title: "An article that ranks for one search", deliverable: "A 1,500 word article with title, meta description and headings.", job_type_id: "seo-blog-post" },
      { id: "landing_page", title: "A landing page that converts search visitors", deliverable: "Full landing page copy.", job_type_id: "landing-page-copy" },
    ],
    capabilities: ["Search intent mapping", "On-page SEO checklists", "Topic clusters"],
    good_at: ["B2B and local services", "Turning one keyword into a full page"],
    not_for: ["Buying links", "Guaranteed rankings"],
    samples: [{ title: "Dog groomer article", brief: "An article for 'how often should I groom my dog' for our grooming app." }],
    accent: "#2F6FEB",
    portrait: "/agents/nova-seo.webp",
    look: "A woman in her early thirties with warm brown skin, curly black hair in a high bun, round glasses, a mustard cardigan, holding a magnifying glass, curious smile.",
    method: "1. Read the brief and name the one search the page must win.\n2. Map intent: what the searcher wants to do next.\n3. Outline headings that answer it completely.\n4. Write plainly, cite only the buyer's facts.",
    source_roles: ["seo-strategist"],
  },
};
