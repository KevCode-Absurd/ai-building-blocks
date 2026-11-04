// The business boards (/industries/<slug>): one page per kind of business, laid out as that business's journey in
// 8 stages, from planning to money. This file holds what a person writes (names, stage labels, page words) and the
// rules that put catalogue items, specialists and mini tools on each board. scripts/lib/board-map.mjs applies the
// rules; catalogue-items/boards.yaml holds the hand-checked fixes (items to add or take off a board).
//
// Two ways onto a board:
// - Made for it: the item's words say this kind of business (`words`), or its task only makes sense here (`tasks`).
//   These show first, and the item's own page links back with "For: <board>".
// - Useful to any business: the item's task is a general business job (email, ads, accounts). These fill a stage
//   when few made-for items exist, ranked by how close their words are to the board (`near`).
//
// Rules for the words: grade 8 or lower, plain and true. The only example business is Sprout.

export const BOARDS_PATH = "/industries";

/** The 8 stages every board shares. Each board gives them its own label and line. */
export const STAGES = [
  { id: "plan", name: "Plan" },
  { id: "build", name: "Build" },
  { id: "found", name: "Get found" },
  { id: "market", name: "Market" },
  { id: "sell", name: "Sell" },
  { id: "deliver", name: "Deliver" },
  { id: "keep", name: "Keep customers" },
  { id: "money", name: "Money and team" },
];

/** Where an item's task puts it on the journey. Tasks not listed are not business work and go on no board. */
export const TASK_STAGE = {
  "plan-strategy": "plan", "test-an-idea": "plan", "research-topics": "plan", "study-competitors": "plan",
  "understand-customers": "plan", "make-offer": "plan", "set-prices": "plan", "find-products": "plan", "think-and-decide": "plan",
  "brand-file": "plan",
  "build-websites": "build", "build-software": "build", "build-product": "build", "set-up-store": "build", "design-work": "build",
  "test-and-fix-code": "build", "secure-code": "build", "ship-and-host": "build", "connect-tools": "build", "set-up-ai": "build",
  "make-skills": "build", "speed-up-store": "build",
  "get-found-in-search": "found", "sell-on-amazon": "found",
  "grow-social": "market", "make-video-ads": "market", "make-image-ads": "market", "write-ad-copy": "market", "run-google-ads": "market",
  "plan-ad-tests": "market", "check-ads": "market", "launch-and-scale-ads": "market", "read-ad-results": "market", "write-emails": "market",
  "write-and-tell-stories": "market", "make-images": "market", "product-photos": "market", "work-with-audio": "market",
  "write-landing-page": "sell", "audit-landing-page": "sell", "sell-and-negotiate": "sell", "test-store-changes": "sell", "speak-and-persuade": "sell",
  "run-your-store": "deliver", "plan-supply-chain": "deliver", "organise-work": "deliver", "manage-projects": "deliver", "document-work": "deliver",
  "work-with-files": "deliver", "protect-your-store": "deliver", "manage-it": "deliver", "teach-and-train": "deliver",
  "keep-customers": "keep", "help-customers": "keep",
  "plan-budgets-and-cash": "money", "manage-accounting": "money", "manage-tax": "money", "track-numbers": "money", "analyse-data": "money",
  "raise-funding": "money", "hire-people": "money", "lead-people": "money", "check-contracts": "money", "money-and-investing": "money",
};

/** Tasks whose items only fit some boards: they fill only these boards as "also useful", never the rest.
 *  Which board they are made for comes from each board's `tasks` and the item's words. */
export const LIMITED_TASKS = {
  "set-up-store": ["ecommerce"], "speed-up-store": ["ecommerce"], "test-store-changes": ["ecommerce"], "run-your-store": ["ecommerce"],
  "protect-your-store": ["ecommerce", "amazon-sellers"], "find-products": ["ecommerce", "amazon-sellers", "wholesale-and-brands"],
  "product-photos": ["ecommerce", "amazon-sellers", "wholesale-and-brands", "digital-products"],
  "plan-supply-chain": ["ecommerce", "amazon-sellers", "wholesale-and-brands"], "sell-on-amazon": ["amazon-sellers"],
  "build-software": ["saas", "apps", "ai-automation"], "test-and-fix-code": ["saas", "apps", "ai-automation"],
  "secure-code": ["saas", "apps", "ai-automation"], "ship-and-host": ["saas", "apps", "ai-automation"], "build-product": ["saas", "apps"],
  "set-up-ai": ["ai-automation"], "make-skills": ["ai-automation"], "connect-tools": ["ai-automation", "saas"],
  "teach-and-train": ["courses-and-coaching"], "raise-funding": ["saas", "apps"], "money-and-investing": [],
  // Research items are mostly academic or technical: they go on a board only when their words name it.
  "research-topics": [],
};

/** Words in an item's name that move it to another stage than its task gives (only for tasks that mix stages). */
export const STAGE_HINTS = [
  ["keep", /\b(churn|retention|retain|win-?back|loyalty|repeat (buyers?|customers?|purchase)|renewals?|cancell?ations?|review requests?|referrals?|nps)\b/],
  ["found", /\b(seo|keywords?|search rank|ranking|aso|app store optimi[sz]|listing optimi[sz]|google business profile|local search|backlinks?|ai search|search visibility)\b/],
  ["sell", /\b(landing page|sales page|checkout|conversion|proposals?|demo|closing|objections?|pricing page|paywall|upsell|cross-sell|quotes?)\b/],
  ["market", /\b(ads?|ppc|campaigns?|newsletter|influencers?|ugc|outreach|launch plan|promo(tion)?s?)\b/],
  ["deliver", /\b(inventory|stock|reorder|shipping|fulfil+ment|fba|3pl|warehouse|logistics|freight|returns|onboarding|support tickets?|uptime|incidents?|releases?|crash(es)?|schedul\w*|bookings?|appointments?|lessons?|curriculum)\b/],
  ["money", /\b(invoices?|cash ?flow|budgets?|accounting|bookkeeping|tax|payroll|profit|margins?|fees|fundrais\w*|investors?|pitch deck|contracts?|hiring|hire)\b/],
];
export const MIXED_TASKS = new Set(["plan-strategy", "research-topics", "think-and-decide", "organise-work", "document-work", "work-with-files",
  "understand-customers", "study-competitors", "sell-on-amazon", "run-your-store", "set-up-store", "connect-tools", "set-up-ai", "make-skills",
  "build-product", "track-numbers", "analyse-data", "test-an-idea", "make-offer", "brand-file"]);

/** Items that are not for an owner's business work: developer copilots for one product, investing and academic items. */
export const NOT_FOR_OWNERS = /^copilot-|invest|portfolio|stock-pick|thesis|dissertation|academic|manuscript|peer-review|grant-proposal|microbiome|genom|clinical-trial/;

const w = (s) => new RegExp(`\\b(${s})\\b`, "i");

export const BOARDS = [
  {
    slug: "ecommerce", eval: "ecommerce", name: "Online stores", short: "online store",
    title: "AI for online stores and ecommerce brands",
    documentTitle: "AI for online stores: every stage of your store | AI Blocks",
    desc: "AI skills, specialists, workflows and free tools for online stores, laid out from picking products to repeat buyers. Shopify, WooCommerce or your own site.",
    intro: "Running a store on Shopify, WooCommerce or your own site means many small jobs every week. This board lays them out in order, from picking products to bringing buyers back.",
    words: w("shopify|woocommerce|bigcommerce|online stores?|online shops?|e-?commerce|dtc|d2c|direct-to-consumer|checkout|abandoned carts?|shopping carts?|product pages?|pdp|collection pages?|store owners?|shoppers|merchandis\\w*|skus?|order values?|free shipping|storefront"),
    tasks: ["set-up-store", "speed-up-store", "test-store-changes", "run-your-store", "protect-your-store", "find-products", "product-photos", "plan-supply-chain"],
    categories: ["ecommerce"],
    near: w("store|shop|product|customer|order|buyer|brand|cart|sales|email|ads?"),
    tools: ["order-margin", "free-shipping-threshold", "returns-cost-calculator", "reorder-point", "discount-calculator", "marketplace-unit-margin"],
    stages: {
      plan: ["Pick products and prices", "Check demand, competitors and margins before you buy stock."],
      build: ["Build the store", "Set up the store, make it fast and keep it working."],
      found: ["Get found in search", "Help Google and AI search show your products."],
      market: ["Ads, email and social", "Make ads, photos, emails and posts that bring buyers."],
      sell: ["Product pages and checkout", "Turn visits into orders with clear pages and an easy checkout."],
      deliver: ["Stock, shipping and returns", "Keep stock right, ship on time and handle returns."],
      keep: ["Reviews and repeat buyers", "Earn reviews, answer questions and bring buyers back."],
      money: ["Money, legal and team", "Know your margins and cash, stay legal and grow the team."],
    },
  },
  {
    slug: "amazon-sellers", name: "Amazon and marketplace sellers", short: "marketplace seller",
    title: "AI for Amazon and marketplace sellers",
    documentTitle: "AI for Amazon sellers: listings, ads, FBA | AI Blocks",
    desc: "AI skills, specialists and free tools for Amazon, Etsy, eBay, Walmart and TikTok Shop sellers: listings, marketplace ads, FBA, fees and account health.",
    intro: "Selling on Amazon, Etsy, eBay, Walmart or TikTok Shop has its own rules. Your listing is your shop, the search bar is your shop window, and fees decide your profit.",
    words: w("amazon|fba|asins?|seller central|marketplaces?|etsy|ebay|walmart|tiktok shop|buy box|a\\+ content|product listings?|amazon listings?"),
    tasks: ["sell-on-amazon", "protect-your-store"],
    near: w("listing|marketplace|product|seller|review|fee|stock|ads?|keyword|ranking"),
    tools: ["marketplace-unit-margin", "order-margin", "reorder-point", "discount-calculator", "returns-cost-calculator", "free-shipping-threshold"],
    stages: {
      plan: ["Find products and check fees", "Check demand, rivals and fees before you order stock."],
      build: ["Brand and store setup", "Set up your brand, store pages and the tools you need."],
      found: ["Listings and marketplace search", "Write listings that rank and that buyers trust."],
      market: ["Marketplace ads and photos", "Run marketplace ads and make photos that get the click."],
      sell: ["Win the sale", "Price well, answer doubts and turn views into orders."],
      deliver: ["FBA, stock and shipping", "Plan stock, ship to the warehouse and handle returns."],
      keep: ["Reviews and account health", "Earn honest reviews and keep your seller account safe."],
      money: ["Money, legal and team", "Track fees and profit per sale, stay legal and get help."],
    },
  },
  {
    slug: "saas", eval: "saas", name: "SaaS", short: "SaaS",
    title: "AI for SaaS and subscription software companies",
    documentTitle: "AI for SaaS companies: trials, churn, pricing | AI Blocks",
    desc: "AI skills, specialists and free tools for SaaS founders, from idea and pricing to trials, demos, churn and monthly revenue.",
    intro: "A software company that charges a monthly fee lives on a few numbers: sign-ups, trials that turn into paying customers, and customers who stay. This board follows that path.",
    words: w("saas|software as a service|churn|free trials?|trial users?|mrr|arr|product-led|plg|freemium|seats|b2b software|subscription software|feature requests?|changelog|release notes|customer success|net revenue retention|nrr|user activation|activation rate|onboarding flow|api docs?|web apps?|startups?|founders?|investors?|pitch deck"),
    tasks: ["build-software", "test-and-fix-code", "secure-code", "ship-and-host", "build-product", "raise-funding"],
    near: w("software|saas|product|users?|customers?|trial|subscription|code|app|api|growth|b2b"),
    tools: ["subscription-revenue-forecast", "subscriber-lifetime-value", "three-tier-pricing", "customer-payback", "cash-runway", "page-test-calculator"],
    stages: {
      plan: ["Idea, market and pricing", "Test the idea, size the market and choose your plans."],
      build: ["Build and ship the product", "Write, test, secure and ship the code."],
      found: ["SEO and content", "Win sign-ups from Google, AI search and useful articles."],
      market: ["Marketing and ads", "Reach buyers with ads, email, social and launches."],
      sell: ["Trials, demos and sales", "Turn visitors into trials and trials into paying customers."],
      deliver: ["Run the product", "Keep it up, answer support and plan each release."],
      keep: ["Onboarding and churn", "Help new users succeed and stop customers cancelling."],
      money: ["Revenue, funding and team", "Track monthly revenue, raise money if you need it and hire well."],
    },
  },
  {
    slug: "apps", name: "Apps", short: "app",
    title: "AI for mobile and consumer app makers",
    documentTitle: "AI for app makers: App Store, paywalls, users | AI Blocks",
    desc: "AI skills, specialists and free tools for iPhone, Android and consumer app makers: build, App Store search, paywalls, in-app purchases and retention.",
    intro: "An app lives or dies in the app stores. People find it in search, decide from the screenshots, try it once, and pay through a paywall or in-app purchase. This board follows that path.",
    words: w("mobile apps?|consumer apps?|ios|android|iphone|ipad|app store|play store|google play|aso|react native|swiftui|swift|kotlin|flutter|in-app|push notifications?|app onboarding|app reviews?|app ratings?|testflight|apk|mobile games?|paywalls?|app installs?"),
    tasks: [],
    near: w("app|mobile|users?|screen|design|code|install|subscription|retention|onboarding"),
    tools: ["subscriber-lifetime-value", "subscription-revenue-forecast", "customer-payback", "cash-runway", "page-test-calculator", "ad-budget-planner"],
    stages: {
      plan: ["Idea and money model", "Test the idea and choose how the app will make money."],
      build: ["Design, code and release", "Design the screens, write and test the code, and pass app review."],
      found: ["App store search (ASO)", "Rank in App Store and Google Play search, and win the tap."],
      market: ["Get installs", "Run install ads and posts that bring the right users."],
      sell: ["Paywalls and in-app purchases", "Price plans and build a paywall people understand."],
      deliver: ["Releases, crashes and support", "Ship updates, fix crashes and answer users."],
      keep: ["Retention and push", "Bring users back with onboarding, push and updates they want."],
      money: ["Revenue, funding and team", "Track revenue after store fees, raise money and hire well."],
    },
  },
  {
    slug: "courses-and-coaching", name: "Courses and coaching", short: "course or coaching",
    title: "AI for online courses, coaches and educators",
    documentTitle: "AI for courses and coaching: offers, launches | AI Blocks",
    desc: "AI skills, specialists and free tools for course creators, coaches and educators: shape the offer, build lessons, launch, sell and help students finish.",
    intro: "Courses and coaching sell what you know. The work runs from shaping the offer to teaching it well and helping each student or client get the result they came for.",
    words: w("courses?|cohorts?|coach(es|ing)?|lessons?(?! learned)|curriculum|students?|learners?|tutor\\w*|workshops?|webinars?|masterclass|e-?learning|lms|mentor\\w*|teach\\w*|training (program|course|session)s?|quiz(zes)?|educators?|classes"),
    tasks: ["teach-and-train"],
    near: w("course|coach|lesson|student|learn|teach|client|launch|email|offer|session"),
    tools: ["launch-revenue-planner", "email-list-value", "hourly-rate", "price-increase-calculator", "reading-time", "discount-calculator"],
    stages: {
      plan: ["Offer, audience and price", "Pick who it is for, what they get and what to charge."],
      build: ["Course and sales site", "Build the course space, the site and the tools behind it."],
      found: ["Get found", "Show up in Google, AI search and YouTube for what you teach."],
      market: ["Content, email and launches", "Grow a list and plan launches people look forward to."],
      sell: ["Sales pages and calls", "Write the sales page and run calls that help people decide."],
      deliver: ["Teach and coach", "Plan lessons, run sessions and give feedback that helps."],
      keep: ["Results and renewals", "Help students finish, collect stories and sell the next step."],
      money: ["Money, legal and team", "Track revenue, write fair terms and get help as you grow."],
    },
  },
  {
    slug: "content-creators", eval: "content", name: "Creators and media", short: "creator",
    title: "AI for creators, YouTubers, podcasters and newsletter writers",
    documentTitle: "AI for creators: YouTube, podcasts, newsletters | AI Blocks",
    desc: "AI skills, specialists and free tools for creators and media: plan content, grow on YouTube, TikTok and newsletters, and earn from sponsors and members.",
    intro: "Creators wear every hat. You plan, film or write, edit, post, answer comments and try to earn from it all. This board lays those jobs out in order.",
    words: w("youtube|youtubers?|tiktok|instagram|podcasts?|creators?|newsletters?|substack|influencers?|reels?|shorts|thumbnails?|subscribers|sponsors?|sponsorships?|patreon|followers|content calendar|blog posts?|twitch|vlogs?|video scripts?|audience growth|media kit|brand deals?|memberships?"),
    tasks: [],
    near: w("content|video|post|audience|social|story|write|channel|episode|brand"),
    tools: ["creator-deal-calculator", "email-list-value", "launch-revenue-planner", "content-cost-per-piece", "email-frequency-planner", "reading-time"],
    stages: {
      plan: ["Niche and content plan", "Pick your niche, study what works and plan your posts."],
      build: ["Site, brand and tools", "Set up your site, look and the tools that save you time."],
      found: ["Search and discovery", "Get found in YouTube, Google and AI search."],
      market: ["Grow your audience", "Post, promote and grow on each channel you use."],
      sell: ["Sponsors, products and members", "Price brand deals, sell products and grow paid members."],
      deliver: ["Make and publish", "Write, film, edit and publish on a schedule you can keep."],
      keep: ["Community and fans", "Answer comments, build community and keep fans coming back."],
      money: ["Money, legal and team", "Track income, sign fair deals and hire editors or help."],
    },
  },
  {
    slug: "agencies-and-freelancers", name: "Agencies, freelancers and consultants", short: "agency or freelance",
    title: "AI for agencies, freelancers and consultants",
    documentTitle: "AI for agencies, freelancers and consultants | AI Blocks",
    desc: "AI skills, specialists and free tools for agencies, freelancers and consultants: win clients, write proposals, deliver the work and keep retainers.",
    intro: "Agencies, freelancers and consultants sell their time and skill. The work runs from choosing a niche to winning the client, doing great work and keeping them on a retainer.",
    words: w("agency|agencies|freelanc\\w*|consultants?|consulting|consultancy|proposals?|retainers?|statements? of work|scope creep|client (work|reports?|briefs?|onboarding|proposals?|retention|portal|calls?|feedback|approvals?|deliverables?|accounts?)|for clients|your clients|rate cards?|billable|discovery calls?|case stud(y|ies)|white-?label"),
    tasks: [],
    near: w("client|proposal|service|project|report|brief|agency|deliver|pitch|retainer"),
    tools: ["hourly-rate", "hire-or-freelance", "price-increase-calculator", "early-payment-discount", "invoice-payment-fees", "cash-runway"],
    stages: {
      plan: ["Services, niche and price", "Pick what you offer, who for and how to price it."],
      build: ["Site and portfolio", "Build a site and portfolio that shows your best work."],
      found: ["Get found", "Show up when clients search for what you do."],
      market: ["Win attention", "Reach clients with outreach, content and referrals."],
      sell: ["Proposals and closing", "Run discovery calls, write proposals and close the deal."],
      deliver: ["Do the client work", "Plan, deliver and report on work clients are glad they paid for."],
      keep: ["Retainers and referrals", "Keep clients happy, renew retainers and earn referrals."],
      money: ["Invoices, contracts and team", "Write contracts, get paid on time and hire help."],
    },
  },
  {
    slug: "local-services", eval: "local-services", name: "Local businesses and shops", short: "local business",
    title: "AI for local businesses and shops: salons, clinics, restaurants and trades",
    documentTitle: "AI for local businesses, shops and restaurants | AI Blocks",
    desc: "AI skills and free tools for salons, clinics, restaurants, cafes, gyms, trades and shops. Get found nearby, earn reviews and fill your bookings.",
    intro: "Salons, clinics, restaurants, cafes, gyms, trades, shops and estate agents share the same worries. People need to find you nearby, trust your reviews, book and come back.",
    words: w("local (business|businesses|seo|search|customers|services?|shops?|ads)|google business profile|gbp|google maps|near me|foot traffic|walk-?ins?|appointments?|bookings?|salons?|restaurants?|cafes?|café|restaurant menus?|menu (items|prices|design)|clinics?|dental|dentists?|plumb\\w*|electricians?|tradespeople|home services|gyms?|fitness studios?|real estate|realtors?|estate agents?|property (managers?|management|listings?)|landlords?|hotels?|day spas?|retail (shops?|stores?)|shop owners?|brick-and-mortar|in-store|point of sale|yelp|neighbou?rhoods?|hospitality|catering|bakery|bakeries|barbers?|no-shows?|patients?|veterinar\\w*|franchise\\w*"),
    tasks: [],
    near: w("local|customer|booking|review|service|shop|area|staff|google|offer"),
    tools: ["ad-budget-planner", "customer-payback", "discount-calculator", "price-increase-calculator", "hourly-rate", "event-break-even"],
    stages: {
      plan: ["Services, prices and area", "Pick your services, prices and the area you serve."],
      build: ["Website and booking", "Build a clear site and an easy way to book or order."],
      found: ["Google Maps and local search", "Show up on Google Maps and when people search nearby."],
      market: ["Local ads and social", "Run local ads, posts and offers that fill quiet days."],
      sell: ["Turn calls into bookings", "Answer calls and messages fast and turn them into bookings."],
      deliver: ["Run the day", "Plan staff, stock and schedules so each day runs well."],
      keep: ["Reviews and regulars", "Earn good reviews, reply well and keep regulars coming back."],
      money: ["Money, legal and team", "Track cash, stay legal and hire and train staff."],
    },
  },
  {
    slug: "digital-products", name: "Digital products", short: "digital product",
    title: "AI for digital products: ebooks, templates and printables",
    documentTitle: "AI for digital products: ebooks, templates | AI Blocks",
    desc: "AI skills, specialists and free tools for selling ebooks, templates, printables, presets and Notion kits on Gumroad, Etsy or your own site.",
    intro: "Digital products sell like a store with no stock and no shipping. Ebooks, templates, printables and presets live or die on the idea, the sales page and the list you build.",
    words: w("ebooks?|e-books?|printables?|notion templates?|digital products?|digital downloads?|gumroad|lemon squeezy|lead magnets?|workbooks?|presets|info products?|templates? (shop|store|to sell)|sell (templates|printables)|stock (photos|assets)|planners? to sell|guides? to sell|self-publish\\w*|kindle"),
    tasks: [],
    near: w("product|ebook|template|download|sales page|email|list|buyer|launch|guide"),
    tools: ["launch-revenue-planner", "email-list-value", "discount-calculator", "price-increase-calculator", "reading-time", "creator-deal-calculator"],
    stages: {
      plan: ["Pick the product and price", "Find a product people want and set a fair price."],
      build: ["Make the product and shop", "Write or design the product and set up where it sells."],
      found: ["Search and marketplaces", "Get found in Google, Etsy, Gumroad and AI search."],
      market: ["Email, social and ads", "Grow your list and promote each launch."],
      sell: ["Sales pages and checkout", "Write a sales page that answers doubts and makes buying easy."],
      deliver: ["Delivery and updates", "Deliver files smoothly and keep the product up to date."],
      keep: ["Reviews and repeat buyers", "Collect reviews and sell the next product to happy buyers."],
      money: ["Money, legal and team", "Track sales and fees, protect your work and get help."],
    },
  },
  {
    slug: "ai-automation", name: "AI and automation businesses", short: "AI and automation",
    title: "AI for businesses that sell AI agents and automations",
    documentTitle: "AI for AI agencies: agents, automations, clients | AI Blocks",
    desc: "Skills, specialists and free tools for people who sell AI agents, chatbots and automations: pick a niche, build, test, hand over and keep clients.",
    intro: "You build AI agents, chatbots and automations for other businesses. The work runs from picking a niche and an offer to building, testing, handing over and supporting what you made.",
    words: w("ai agents?|agentic|automations?|automate\\w*|chatbots?|chat bots?|llms?|prompt engineering|prompt librar(y|ies)|system prompts?|n8n|zapier|make\\.com|ai (services?|agency|consult\\w*|workflows?|assistants?|receptionists?|voice|implementation|tools?|models?|skills?)|rag\\b|retrieval|mcp|voice agents?|evals?\\b|copilots?"),
    tasks: ["set-up-ai", "make-skills", "connect-tools"],
    near: w("ai|agent|automation|workflow|tool|client|prompt|api|data|model"),
    tools: ["ai-run-cost", "hourly-rate", "hire-or-freelance", "price-increase-calculator", "cash-runway", "json-formatter"],
    stages: {
      plan: ["Pick a niche and offer", "Choose who you build for, what you sell and what to charge."],
      build: ["Build agents and automations", "Build, connect and test agents, chatbots and automations."],
      found: ["Get found", "Show up when businesses search for AI help."],
      market: ["Content and outreach", "Show what you build and reach the businesses who need it."],
      sell: ["Demos, proposals and pricing", "Run demos, write proposals and price the work."],
      deliver: ["Set up, test and hand over", "Install it, check it works and hand it over with clear notes."],
      keep: ["Support and retainers", "Support clients, improve what you built and keep retainers."],
      money: ["Money, legal and team", "Track costs per run, write contracts and hire help."],
    },
  },
  {
    slug: "wholesale-and-brands", name: "Wholesale and product brands", short: "product brand",
    title: "AI for product brands, makers and wholesale sellers",
    documentTitle: "AI for product brands, makers and wholesale | AI Blocks",
    desc: "AI skills, specialists and free tools for makers, private label and wholesale brands: costs, factories, packaging, retail buyers and distributors.",
    intro: "Product brands make things and sell them to shops, distributors and buyers in bulk. The work runs from costs and factories to retail buyers, reorders and freight.",
    words: w("wholesale|wholesalers?|distributors?|distribution (partners?|deals?)|retailers?|retail buyers?|stockists?|trade shows?|line sheets?|private label|white label|manufactur\\w*|factor(y|ies)|suppliers?|sourcing|moqs?|minimum order|purchase orders?|b2b (sales|orders|buyers)|packaging|cogs|cost of goods|bill of materials|co-packers?|production runs?|landed costs?|incoterms|freight|customs|tariffs?|procurement|raw materials?|product brands?|supply chain"),
    tasks: ["plan-supply-chain"],
    near: w("product|supplier|cost|margin|buyer|order|stock|brand|retail|sales"),
    tools: ["order-margin", "supplier-quote-comparer", "reorder-point", "marketplace-unit-margin", "discount-calculator", "early-payment-discount"],
    stages: {
      plan: ["Products, costs and margins", "Cost each product and check the margin works for retailers too."],
      build: ["Product, packaging and catalogue", "Design the product, packaging and the catalogue buyers see."],
      found: ["Get found by buyers", "Show up when shops and distributors look for products like yours."],
      market: ["Trade marketing", "Reach buyers with samples, trade shows, ads and email."],
      sell: ["Retail buyers and distributors", "Pitch buyers, set terms and close wholesale deals."],
      deliver: ["Factories, freight and stock", "Work with factories, plan stock and ship on time."],
      keep: ["Reorders and accounts", "Help stockists sell through so they order again."],
      money: ["Money, legal and team", "Track cash, costs and contracts, and grow the team."],
    },
  },
];

/** Old /industries pages that are not boards any more but keep their address: they stay as they were (industries.mjs). */
export const KEPT_PAGES = ["finance", "engineering"];
