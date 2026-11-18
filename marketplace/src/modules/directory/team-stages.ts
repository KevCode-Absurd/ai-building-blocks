// The e-commerce team in the order a store's work happens: research the market, source the product, build the store,
// make the creative, buy ads, grow without ads, sell on more channels, keep customers, run the numbers, and the agency
// seats. /e-commerce shows the specialists stage by stage and lets a visitor filter by stage; GET
// /api/agents?vertical=ecommerce returns these stages with the ids of the live agents in each. Every e-commerce agent
// sits in exactly one stage (test/ecom-team-search.test.ts), so a new agent must be added here.

export interface TeamStage { id: string; label: string; summary: string; agents: readonly string[] }

export const ECOMMERCE_STAGES: readonly TeamStage[] = [
  { id: "lead", label: "Leads", summary: "They plan the work and hand each part to the right specialist.", agents: [
    "margaret-job-orchestrator", "jared-performance-marketing", "kemal-creative-director", "imogen-retention",
    "thanh-product-sourcing-lead", "malcolm-ecommerce-growth", "barnaby-wild-bets"] },
  { id: "research", label: "Research the market", summary: "Is the market growing, who buys, what to sell next.", agents: [
    "shannon-market-research", "revathi-product-research", "sipho-product-hunter", "funmilayo-customer-research", "duncan-category-trends", "sabelo-product-portfolio"] },
  { id: "source", label: "Source and make the product", summary: "Suppliers, BOM and cost, negotiation, quality, freight, packaging and stock.", agents: [
    "tunde-supplier-search", "zhenyu-sourcing", "wenhao-procurement", "douglas-should-cost", "akosua-cost-forecast",
    "maxine-tech-packs", "phuong-quality-control", "sheila-inbound-freight", "omar-inventory-planning", "alistair-packaging"] },
  { id: "store", label: "Build the store", summary: "Brand, stores, speed, pages, photos, offers and tests.", agents: [
    "philippa-brand", "facundo-store-setup", "arjun-page-speed", "nico-ecommerce-speed", "vera-woocommerce-speed", "annabel-landing-pages", "georgia-product-copy",
    "aurelio-product-photos", "juliet-merchandising", "brendan-offers", "gretchen-store-testing", "larissa-store-ux", "yaroslav-shopify-dev"] },
  { id: "creative", label: "Make the ads", summary: "Creative strategy, ad graphics, video and ad copy.", agents: [
    "tendai-ad-creative", "howard-copy-chief", "ayaka-ad-design", "devon-video-ugc", "kofi-ad-copy", "cody-video-editor", "tanvi-listing-images"] },
  { id: "ads", label: "Buy ads", summary: "Consumer channels, Reddit and LinkedIn commerce acquisition, checked against business outcomes.", agents: [
    "lindsey-meta-media-buyer", "dustin-ad-deployment", "raymond-google-ads", "zara-tiktok-ads", "kelsey-snapchat-ads", "junaid-amazon-ads", "marnie-pinterest-ads", "nadiya-reddit-ads", "esmee-b2b-commerce-ads"] },
  { id: "organic", label: "Grow without ads", summary: "Creators, social, SEO and AI search.", agents: [
    "pilar-creators", "ritika-influencer-outreach", "tomas-social-community", "stuart-store-seo", "rustam-ai-answers", "margot-pr"] },
  { id: "channels", label: "Sell on more channels", summary: "Amazon, TikTok Shop, marketplaces, chat, wholesale and India.", agents: [
    "garrett-amazon", "ploy-tiktok-shop", "rohan-chat-sales", "mei-wholesale-sales", "sudhir-marketplaces", "ishita-india-commerce"] },
  { id: "retention", label: "Keep customers", summary: "Email, SMS, reviews, support and the experience after the sale.", agents: [
    "morag-email-sms", "lucia-email-copy", "latoya-post-purchase", "darlene-support-lead", "corinne-reviews"] },
  { id: "numbers", label: "Run the numbers and operations", summary: "Profit, cash, tracking, fulfilment, rules and security.", agents: [
    "radek-unit-economics", "hemant-store-finance", "marivic-fulfilment", "ilona-bot-security", "emre-tracking", "callum-reporting", "meenakshi-compliance", "gurdeep-shipping-returns"] },
  { id: "agency", label: "For agencies", summary: "Client accounts, new business and the creative production line.", agents: [
    "fiona-account-manager", "clayton-new-business", "lerato-creative-producer"] },
];

/** The stage each knowledge module's work belongs to, for a shelf item (a skill, say) that no agent carries. */
export const ECOMMERCE_MODULE_STAGES: Readonly<Record<string, string>> = {
  PRD: "research", AVT: "research", WLD: "research", COG: "source", BRD: "store", SET: "store", LPG: "store", SPD: "store",
  CRO: "store", OFF: "store", MCR: "creative", ADC: "ads", GAD: "ads", ORG: "organic", SEO: "organic", AEO: "organic",
  AMZ: "channels", EML: "retention", CXP: "retention", MEA: "numbers", FIN: "numbers", OPS: "numbers", SEC: "numbers",
};

/** The stages with the live agents of the team in each, in team order, empty stages left out. */
export function teamStages(team: readonly { id: string }[]): { id: string; label: string; summary: string; ids: string[] }[] {
  const live = new Set(team.map(p => p.id));
  return ECOMMERCE_STAGES
    .map(s => ({ id: s.id, label: s.label, summary: s.summary, ids: s.agents.filter(id => live.has(id)) }))
    .filter(s => s.ids.length > 0);
}
