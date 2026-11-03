// One page per industry (/industries/<slug>) and the list page (/industries). This file holds only what a person
// writes: the page words, the jobs owners in that industry bring, and the search words that find matching catalogue
// items. scripts/lib/trust-pages.mjs picks the real specialists, skills, workflows and mini tools at build time from
// the catalogue (search for each job's query, rankSpecialists for each job), and fails the build when a pick or a
// mini tool here no longer exists.
//
// Rules for the words: grade 8 or lower, plain, true, unique to the page. The only example business is Sprout (our
// real brand with its name changed). Never use the made-up businesses from the planner tests (outcomes/evals).
//
// job:        what the owner would say, as a heading
// why:        one line on what the items help with
// query:      words that find the right skills, prompts and workflows (catalogue words, not owner words)
// specialist: words that find the right specialist role
// request:    what "Start this job" hands to the job page, in an owner's words

export const INDUSTRIES_PATH = "/industries";

// The start-a-job page (/get-it-done, Stream J1). "Start this job" links there when the page is in the build, and to
// FALLBACK_JOB_PATH otherwise. param: a query field that fills in the job, once that page reads one (null: link only).
export const START_JOB = { path: "/get-it-done", param: null };
export const FALLBACK_JOB_PATH = "/compose";

export const INDUSTRIES = [
  {
    slug: "ecommerce", eval: "ecommerce", name: "Online stores", short: "online store",
    title: "AI for online stores and ecommerce brands",
    documentTitle: "AI for online stores: skills, specialists, tools | AI Blocks",
    desc: "Free AI help for online store owners: fix checkout drop-off, write product pages, plan stock, cut returns and test ads. Real skills, specialists and tools.",
    intro: [
      "Running a store on Shopify, Amazon or your own site means a long list of small jobs. Product pages, ads, emails, stock and returns all need doing every week.",
      "Pick the job below. Each one links to skills and workflows your AI can follow, specialists you can hire in your AI, and free calculators for the money side.",
    ],
    example: "We try our product photo skills on Sprout, our example brand. Sprout is a real gummy vitamin shop with its name changed.",
    jobs: [
      { job: "Get more people to finish checkout", why: "Find where shoppers drop off and win back the ones who leave a full cart.", query: "abandoned cart checkout", must: "cart|checkout", specialist: "checkout conversion abandoned cart email", request: "Lots of shoppers add to cart on my store but do not buy. Help me get more of them to finish checkout." },
      { job: "Write product pages that sell", why: "Turn product facts and reviews into pages that answer what buyers ask.", query: "product page copywriter", must: "product", specialist: "product page copywriting ecommerce", request: "Help me rewrite my product pages so more visitors buy." },
      { job: "Make ads that bring sales", why: "Plan, write and check Meta and Google ads before you spend money.", query: "meta ads image ad", must: "\\bads?\\b", specialist: "meta facebook ads media buyer", request: "Help me make better ads for my online store." },
      { job: "Cut returns", why: "Find the main reasons people send things back and fix the pages behind them.", query: "product returns reasons", must: "return", specialist: "returns refunds customer support ecommerce", request: "Too many orders come back as returns. Help me find out why and cut them." },
      { job: "Plan stock so you never run out", why: "Work out when to reorder and how much stock to hold.", query: "inventory reorder stock", must: "stock|reorder|inventory|demand", role: "stock", specialist: "inventory stock planning operations", request: "Help me plan stock and reorders so I stop running out of best sellers." },
      { job: "Turn reviews into better pages and ads", why: "Use what customers already say to write lines buyers believe.", query: "customer review ad copy", must: "\\breviews?\\b(?!er)|customer quote", role: "\\breview\\b", specialist: "customer reviews research copywriting", request: "Help me use my customer reviews to improve my product pages and ads." },
    ],
    tools: ["order-margin", "free-shipping-threshold", "returns-cost-calculator", "reorder-point", "discount-calculator", "marketplace-unit-margin"],
  },
  {
    slug: "saas", eval: "saas", name: "Software companies (SaaS)", short: "software company",
    title: "AI for SaaS and subscription software companies",
    documentTitle: "AI for SaaS companies: churn, trials, pricing | AI Blocks",
    desc: "Free AI help for SaaS founders: keep customers from cancelling, turn trials into paying users, set prices and win sign-ups from Google.",
    intro: [
      "A small software company lives on a few numbers: sign-ups, trials that turn into paying customers, and customers who stay.",
      "The jobs below cover those numbers. Each links to skills, workflows and specialists your AI can use, plus calculators for revenue and pricing.",
    ],
    jobs: [
      { job: "Stop customers cancelling in the first months", why: "Find why new customers leave and fix the first weeks of use.", query: "customer churn retention", must: "churn|retention|cancel", specialist: "customer retention churn success", request: "Too many customers cancel in their first three months. Help me keep more of them." },
      { job: "Turn free trials into paying customers", why: "Improve the first steps in your app and the emails that get trial users to pay.", query: "free trial conversion onboarding", must: "free|trial|customer onboarding|product onboarding|first-use", role: "onboarding", specialist: "product onboarding trial conversion", request: "Free trial sign-ups are fine but few become paying customers. Help me fix that." },
      { job: "Set the right price", why: "Compare plans, test a price change and explain it to customers.", query: "saas pricing plans", must: "pric", specialist: "pricing strategy saas", request: "I think we charge too little. Help me work out how to price." },
      { job: "Get more sign-ups from Google", why: "Plan pages and articles people search for, and fix what stops Google reading your site.", query: "keyword research blog seo", must: "keyword|blog|seo|search topic", specialist: "seo organic search content", request: "We need more sign-ups from Google. Our blog gets almost no traffic." },
      { job: "Answer a buyer's security questions", why: "Draft honest answers from your real policies so a big deal does not stall.", query: "security questionnaire", must: "security|compliance|questionnaire", specialist: "security compliance questionnaire", request: "A prospect sent us a long security questionnaire. Help me answer it well." },
      { job: "Track your monthly numbers", why: "Build a simple weekly or monthly view of revenue, churn and new customers.", query: "saas metrics dashboard", must: "metric|kpi|dashboard", role: "metrics|dashboard", specialist: "saas metrics revenue analytics", request: "Help me set up a simple monthly report of our SaaS numbers." },
    ],
    tools: ["subscription-revenue-forecast", "subscriber-lifetime-value", "three-tier-pricing", "customer-payback", "cash-runway", "page-test-calculator"],
  },
  {
    slug: "local-services", eval: "local-services", name: "Local services", short: "local business",
    title: "AI for local businesses: dentists, plumbers, salons and more",
    documentTitle: "AI for local businesses: dentists, salons, gyms | AI Blocks",
    desc: "Free AI help for dentists, plumbers, salons, restaurants and gyms: get found on Google Maps, earn more reviews, cut no-shows and lower your cost per lead.",
    intro: [
      "Dentists, plumbers, salons, restaurants and gyms share the same worries. People need to find you nearby, trust your reviews, book, and turn up.",
      "Pick the job that matters most this month. Each one links to skills your AI can follow, specialists you can hire in your AI, and simple calculators.",
    ],
    jobs: [
      { job: "Show up on Google Maps", why: "Fill in your Google Business Profile and local pages so nearby people find you.", query: "local search listing google business profile", must: "local|listing|maps|visibility", specialist: "local seo google business profile", request: "Help my local business show up higher on Google Maps." },
      { job: "Get more good reviews and reply well", why: "Ask happy customers for reviews and answer bad ones calmly.", query: "review replies", must: "\\breviews?\\b(?!er)", specialist: "reviews reputation customer service", request: "We got some bad reviews and bookings are down. Help me get more good reviews and reply well." },
      { job: "Cut no-shows", why: "Set up reminders and a fair policy so fewer people miss bookings.", query: "appointment no-show reminders", must: "appointment|no-show|clinic booking|booking page", role: "no-show|booking", specialist: "appointment booking customer communication", request: "Clients keep not turning up to their appointments. Help me cut no-shows." },
      { job: "Pay less for each lead from ads", why: "Check your Google Ads search terms and stop paying for the wrong clicks.", query: "google ads search terms", must: "google ads|search.term|search campaign", specialist: "google ads search campaigns leads", request: "I pay too much for each lead from Google Ads. Help me lower it." },
      { job: "Fill quiet days with an offer", why: "Plan a simple offer by email or text and check it still makes money.", query: "promotion offer", must: "promotion|offer", role: "sale|campaign", specialist: "email marketing promotions local", request: "Help me plan an offer to fill our quiet days without losing money." },
      { job: "Write clear service pages", why: "Explain each service, price range and area you cover in plain words.", query: "website page copy", must: "copy|page writer|message", role: "website", specialist: "website copywriting service pages", request: "Help me rewrite my website's service pages so more visitors book." },
    ],
    tools: ["ad-budget-planner", "customer-payback", "discount-calculator", "price-increase-calculator", "hourly-rate", "event-break-even"],
  },
  {
    slug: "content-creators", eval: "content", name: "Content creators", short: "creator",
    title: "AI for content creators, YouTubers and newsletter writers",
    documentTitle: "AI for creators: YouTube, podcasts, newsletters | AI Blocks",
    desc: "Free AI help for creators: grow a YouTube channel, earn from a newsletter, launch a podcast or course and price brand deals. Real skills and calculators.",
    intro: [
      "Creators wear every hat. You plan, film or write, edit, post, answer comments and try to earn from it all.",
      "These jobs cover the parts that take the most time. Each links to skills and workflows your AI can follow, specialists you can hire, and calculators for deals and launches.",
    ],
    jobs: [
      { job: "Grow a YouTube channel", why: "Plan videos, titles and thumbnails people click, and learn from your own numbers.", query: "youtube video titles", must: "youtube", specialist: "youtube channel growth video", request: "My YouTube channel has stopped growing. Help me get it moving again." },
      { job: "Make money from a newsletter", why: "Add sponsors or a paid tier without losing readers.", query: "newsletter sponsorship", must: "newsletter|sponsor|publication|creator", specialist: "newsletter growth monetization email", request: "I have a newsletter and want it to start making money." },
      { job: "Launch a podcast", why: "Plan the show, the first episodes and how people will find it.", query: "podcast episode", must: "podcast", role: "podcast", specialist: "podcast production launch", request: "I want to start a podcast. Help me plan and launch it." },
      { job: "Turn what you know into a course", why: "Shape the lessons, the sales page and the launch.", query: "mini course builder", must: "course", specialist: "online course creation launch", request: "I want to turn my skills into an online course that sells." },
      { job: "Plan posts you can keep up", why: "Build a content calendar and reuse each idea across channels.", query: "content calendar social media", must: "social|calendar|post", specialist: "social media content planning", request: "Our social posts look messy and engagement keeps falling. Help me plan better posts." },
      { job: "Price a brand deal", why: "Work out a fair fee and what a sponsor gets for it.", query: "creator sponsorship partnership", must: "creator partnership|sponsor|creator audience|creator content", specialist: "creator partnerships sponsorship", request: "A brand wants to sponsor my content. Help me price the deal." },
    ],
    tools: ["creator-deal-calculator", "email-list-value", "launch-revenue-planner", "content-cost-per-piece", "email-frequency-planner", "reading-time"],
  },
  {
    slug: "finance", eval: "finance-ops", name: "Finance and bookkeeping", short: "finance team",
    title: "AI for small business finance and bookkeeping",
    documentTitle: "AI for bookkeeping and small business finance | AI Blocks",
    desc: "Free AI help for bookkeepers and small finance teams: close the month faster, chase late invoices, forecast cash and cut vendor costs.",
    intro: [
      "Small finance teams and bookkeepers repeat the same work every month: reconcile, close, chase, report, and explain where the money went.",
      "The jobs below link to skills and workflows your AI can follow with your own exports, specialists you can hire in your AI, and calculators for cash and payments. Your AI does the work; you check the numbers.",
    ],
    jobs: [
      { job: "Close the month faster", why: "Make a close checklist and do the routine steps in the same order each month.", query: "month end close", must: "month-end|close", specialist: "accounting month end close", request: "Our month-end close takes too long. Help me get it done in fewer days." },
      { job: "Get paid on time", why: "Sort invoices by how late they are and send polite, firm reminders.", query: "overdue invoices reminders", must: "overdue|late|unpaid|payment reminder|invoice", role: "overdue|invoice", specialist: "accounts receivable collections", request: "Customers pay us late. Help me get more invoices paid on time." },
      { job: "See your cash coming", why: "Forecast cash week by week so a short month is no surprise.", query: "cash flow forecast", must: "cash", role: "cash flow|cash forecast", specialist: "cash flow forecasting finance", request: "We keep running short of cash even though we make a profit. Help me see it coming." },
      { job: "Compare budget with what you spent", why: "Build a simple monthly budget versus actual report.", query: "budget vs actual variance", must: "variance|budget, forecast|statement and budget", specialist: "budgeting variance reporting", request: "Help me build a simple monthly budget versus actual report." },
      { job: "Cut software and supplier costs", why: "List every subscription and supplier and find what you can drop safely.", query: "vendor spend subscriptions", must: "vendor|supplier|subscription (renewal|usage|terms)|spend", specialist: "procurement vendor spend", request: "Our software and supplier costs have grown too much. Help me cut them safely." },
      { job: "Match the bank to your books", why: "Reconcile bank lines with your ledger and list what does not match.", query: "bank reconciliation", must: "bank|ledger", specialist: "bookkeeping bank reconciliation", request: "Help me reconcile our bank statements with our books." },
    ],
    tools: ["cash-runway", "early-payment-discount", "invoice-payment-fees", "supplier-quote-comparer", "hire-or-freelance", "loan-payment"],
  },
  {
    slug: "engineering", eval: "engineering", name: "Software teams", short: "software team",
    title: "AI for small software and engineering teams",
    documentTitle: "AI for software teams: speed, tests and security | AI Blocks",
    desc: "Free AI help for small software teams: find why an app got slow, fix flaky tests, handle a leaked key, move a database and fix crashes. Real skills to use.",
    intro: [
      "Small software teams fix problems while they ship new work. A slow page, a flaky test or a leaked key can take a whole week.",
      "Each job below links to skills and workflows your coding AI can follow in your own code, specialists you can hire in your AI, and small browser tools for data and text.",
    ],
    jobs: [
      { job: "Find why the app got slow", why: "Measure first, find the cause, then fix the biggest slowdown.", query: "web performance slow", must: "performance|speed", specialist: "web performance engineering", request: "Our web app got slow after the last few releases. Help me find out why and fix it." },
      { job: "Fix slow and flaky tests", why: "Find the tests that fail at random and speed up your build.", query: "flaky tests", must: "test", role: "test", specialist: "ci testing build pipeline", request: "Our CI is slow and fails at random. Help me fix it." },
      { job: "Deal with a leaked key", why: "Rotate the key, check what it touched and stop it happening again.", query: "leaked secret key", must: "secret|credential|key", specialist: "security incident response secrets", request: "We think an API key leaked. Help me deal with it safely." },
      { job: "Move to a new database", why: "Plan a move with a test run and a way back if it goes wrong.", query: "database migration", must: "migration|database", role: "migration", specialist: "database migration engineering", request: "We need to move to a new database without downtime. Help me plan it." },
      { job: "Fix app crashes", why: "Group crash reports, find the cause and check the fix.", query: "app crash debugging", must: "\bbugs?\b|crash|error|code debugger", role: "\\bbug", specialist: "mobile app crash debugging", request: "Our app keeps crashing and ratings have dropped. Help me fix it." },
      { job: "Review code before it ships", why: "Check pull requests for bugs, risks and missing tests.", query: "code review pull request", must: "pull request|code review", specialist: "code review software engineering", request: "Help me set up a careful code review for our pull requests." },
    ],
    tools: ["json-formatter", "csv-to-json", "issue-git-traceability-checker", "json-lines-validator", "url-query-inspector", "ai-run-cost"],
  },
];
