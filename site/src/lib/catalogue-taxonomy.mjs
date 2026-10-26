// Shared library vocabulary. Item text is data, never executable classification rules.
/** The jobs people hire a block for. Every block is filed under one. */
export const TASKS = [
  { id: "study-and-practice", name: "Study and check your understanding" },
  { id: "find-a-job", name: "Prepare job applications" },
  { id: "write-ad-copy", name: "Write ad copy" },
  { id: "make-image-ads", name: "Make image ads" },
  { id: "make-video-ads", name: "Make video ads" },
  { id: "plan-ad-tests", name: "Plan what ads to test" },
  { id: "check-ads", name: "Check ads before they go live" },
  { id: "read-ad-results", name: "Read your ad results" },
  { id: "audit-landing-page", name: "Audit a landing page" },
  { id: "write-landing-page", name: "Write and build a landing page" },
  { id: "product-photos", name: "Make product photos" },
  { id: "understand-customers", name: "Understand your customers" },
  { id: "brand-file", name: "Set up your brand file" },
  { id: "study-competitors", name: "Study competitor ads" },
  { id: "make-offer", name: "Make an offer people want" },
  { id: "grow-social", name: "Grow on social" },
  { id: "set-up-ai", name: "Set up AI to work for you" },
  { id: "think-with-minds", name: "Talk it through with great minds" },
  { id: "test-an-idea", name: "Test an idea before you build it" },
  { id: "plan-strategy", name: "Plan your strategy" },
  { id: "build-product", name: "Build a product people want" },
  { id: "build-software", name: "Build and ship software" },
  { id: "sell-and-negotiate", name: "Sell and negotiate" },
  { id: "lead-people", name: "Lead and manage people" },
  { id: "speak-and-persuade", name: "Speak and persuade" },
  { id: "write-and-tell-stories", name: "Write and tell stories" },
  { id: "design-work", name: "Design things people love" },
  { id: "think-and-decide", name: "Think it through and decide" },
  { id: "money-and-investing", name: "Research investments and business value" },
  { id: "manage-accounting", name: "Reconcile accounts and close the books" },
  { id: "plan-budgets-and-cash", name: "Plan budgets, costs and cash flow" },
  { id: "manage-tax", name: "Prepare tax calculations and reviews" },
  { id: "raise-funding", name: "Plan funding and ownership" },
  { id: "manage-personal-finances", name: "Plan personal spending and savings" },
  { id: "analyse-data", name: "Analyse data and explain the results" },
  { id: "manage-projects", name: "Plan projects and team capacity" },
  { id: "manage-it", name: "Manage IT services and recovery" },
  { id: "engineer-systems", name: "Design and test physical systems" },
  { id: "work-with-files", name: "Make documents, sheets and slides" },
  { id: "build-websites", name: "Build websites and web apps" },
  { id: "test-and-fix-code", name: "Test and fix code" },
  { id: "ship-and-host", name: "Ship and host your app" },
  { id: "secure-code", name: "Keep your code secure" },
  { id: "connect-tools", name: "Connect AI to your tools" },
  { id: "make-skills", name: "Make your own skills" },
  { id: "make-images", name: "Make images and art" },
  { id: "organise-work", name: "Run meetings, notes and plans" },
  { id: "work-with-audio", name: "Turn speech into text and back" },
  { id: "run-your-store", name: "Run your online store" },
  { id: "get-found-in-search", name: "Get found in search and AI answers" },
  { id: "write-emails", name: "Write emails that get read" },
  { id: "set-prices", name: "Set your prices" },
  { id: "help-customers", name: "Help your customers" },
  { id: "hire-people", name: "Hire and look after your people" },
  { id: "check-contracts", name: "Check contracts and rules" },
  { id: "track-numbers", name: "Track your numbers" },
  { id: "document-work", name: "Write down how work gets done" },
  { id: "research-topics", name: "Research a topic properly" },
  { id: "teach-and-train", name: "Teach and train people" },
  { id: "plan-supply-chain", name: "Plan stock, shipping and suppliers" },
  { id: "find-products", name: "Find products worth selling" },
  { id: "set-up-store", name: "Set up your online store" },
  { id: "speed-up-store", name: "Make your store load fast" },
  { id: "test-store-changes", name: "Test changes to your store" },
  { id: "run-google-ads", name: "Run Google Ads" },
  { id: "launch-and-scale-ads", name: "Launch and scale Meta and TikTok ads" },
  { id: "keep-customers", name: "Keep customers coming back" },
  { id: "sell-on-amazon", name: "Sell on Amazon" },
  { id: "protect-your-store", name: "Keep your store safe" },
];
const TASK_BY_ID = new Map(TASKS.map((t) => [t.id, t]));
/** Primary use case plus reviewed secondary use cases, including minds. */
export const taskIdsOf = (b) => [...new Set([b.task, ...(b.tasks ?? [])].filter(Boolean))];
export const taskOf = (b) => TASK_BY_ID.get(b.task) ?? TASKS[0];

/** The kinds of work, named by what gets done: the first way into the library.
 *  Each one groups a few jobs; a job can sit under more than one. */
export const FUNCTIONS = [
  { id: "learner", name: "Study and practise", line: "Learning paths, papers and checks on what you understand", tasks: ["study-and-practice"] },
  { id: "job-seeker", name: "Prepare a job application", line: "Your real experience, matched to a role", tasks: ["find-a-job"] },
  { id: "copywriter", name: "Write copy that sells", line: "Ads, landing pages and offers", tasks: ["write-ad-copy", "write-landing-page", "make-offer", "write-emails"] },
  { id: "media-buyer", name: "Run Meta ads", line: "Plan tests, get ads approved, read the results", tasks: ["plan-ad-tests", "launch-and-scale-ads", "check-ads", "read-ad-results", "study-competitors"] },
  { id: "google-ads", name: "Run Google Ads", line: "Shopping, Performance Max, Search and your product feed", tasks: ["run-google-ads"] },
  { id: "retention", name: "Keep customers buying", line: "Email, text messages, subscriptions and what happens after the order", tasks: ["keep-customers", "write-emails"] },
  { id: "ads", name: "Create ads", line: "Image ads and video ads, each with its own skills", tasks: ["make-image-ads", "make-video-ads"] },
  { id: "photos", name: "Make product photos", line: "Photos for your product pages", tasks: ["product-photos"] },
  { id: "cro", name: "Turn visitors into buyers", line: "Check your landing pages and fix what loses sales", tasks: ["audit-landing-page", "write-landing-page", "test-store-changes", "speed-up-store"] },
  { id: "strategist", name: "Know your market", line: "Your customers, your brand and your rivals", tasks: ["understand-customers", "brand-file", "study-competitors", "make-offer"] },
  { id: "social", name: "Grow on social", line: "Posts that build an audience", tasks: ["grow-social"] },
  { id: "founder", name: "Set up AI for your work", line: "Your brand file and AI, set up once for every job", tasks: ["set-up-ai", "brand-file"] },
  { id: "minds", name: "Think with great minds", line: "Borrow one mind's thinking, or seat a council", tasks: ["think-with-minds"] },
  { id: "validator", name: "Test your idea", line: "Talk to customers before you build", tasks: ["test-an-idea", "understand-customers"] },
  { id: "strategy", name: "Plan your strategy", line: "Where to play and how to win", tasks: ["plan-strategy", "set-prices"] },
  { id: "product", name: "Build a product", line: "Product discovery, requirements and what to build next", tasks: ["build-product"] },
  { id: "seller", name: "Sell more", line: "Sell, negotiate and win people over", tasks: ["sell-and-negotiate", "speak-and-persuade"] },
  { id: "leader", name: "Lead people", line: "Run a team, a meeting or a company", tasks: ["lead-people", "speak-and-persuade"] },
  { id: "writer", name: "Write and tell stories", line: "Books, essays, scripts and talks", tasks: ["write-and-tell-stories"] },
  { id: "maker", name: "Design things", line: "Products, brands and pages people love", tasks: ["design-work", "make-images"] },
  { id: "thinker", name: "Think it through", line: "Hard problems, big decisions, new ideas", tasks: ["think-and-decide"] },
  { id: "developer", name: "Build and code", line: "Websites, apps and the code behind them", tasks: ["build-software", "build-websites", "test-and-fix-code", "ship-and-host", "secure-code"] },
  { id: "files", name: "Work with files", line: "Documents, sheets, slides and PDFs", tasks: ["work-with-files"] },
  { id: "connector", name: "Connect your tools", line: "Plug AI into the apps you use, or make your own skills", tasks: ["connect-tools", "make-skills", "set-up-ai"] },
  { id: "office", name: "Run your work", line: "Meetings, notes, plans and audio", tasks: ["organise-work", "work-with-audio", "document-work"] },
  { id: "store", name: "Run your store", line: "Orders, stock, prices and payouts", tasks: ["set-up-store", "run-your-store", "set-prices", "sell-on-amazon", "protect-your-store"] },
  { id: "search", name: "Get found", line: "Search, AI answers and listings", tasks: ["get-found-in-search"] },
  { id: "support", name: "Help your customers", line: "Replies, help pages and problems sorted fast", tasks: ["help-customers", "write-emails"] },
  { id: "people", name: "Hire and look after people", line: "Job posts, interviews, pay and reviews", tasks: ["hire-people", "lead-people"] },
  { id: "legal", name: "Check contracts and rules", line: "Contracts, NDAs and compliance, checked before a lawyer", tasks: ["check-contracts"] },
  { id: "analyst", name: "Analyse data and metrics", line: "Reports, dashboards, experiments and data", tasks: ["track-numbers", "read-ad-results", "analyse-data"] },
  { id: "accounting", name: "Accounting and bookkeeping", line: "Reconciliations, financial statements and the month-end close", tasks: ["manage-accounting"] },
  { id: "finance", name: "Financial planning and costs", line: "Budgets, forecasts, cash flow and prices", tasks: ["plan-budgets-and-cash", "set-prices"] },
  { id: "investing", name: "Investment research and valuation", line: "Business value, investment evidence and risks", tasks: ["money-and-investing"] },
  { id: "tax", name: "Tax preparation and review", line: "Tax calculations, records and review questions", tasks: ["manage-tax"] },
  { id: "funding", name: "Funding and ownership", line: "Funding rounds, loans, ownership and investor terms", tasks: ["raise-funding"] },
  { id: "personal-finance", name: "Personal money planning", line: "Household budgets, debt, savings and retirement", tasks: ["manage-personal-finances"] },
  { id: "projects", name: "Project planning and delivery", line: "Scope, schedules, handovers and team capacity", tasks: ["manage-projects"] },
  { id: "it", name: "IT services and recovery", line: "Troubleshooting, service management and restore rehearsals", tasks: ["manage-it", "connect-tools", "ship-and-host"] },
  { id: "security", name: "Security and privacy", line: "Code, systems, store safety and security reviews", tasks: ["secure-code", "protect-your-store"] },
  { id: "engineer", name: "Physical systems engineering", line: "Electronics, antennas, circuit boards and system models", tasks: ["engineer-systems"] },
  { id: "researcher", name: "Research anything", line: "Sources found, read, checked and written up", tasks: ["research-topics"] },
  { id: "teacher", name: "Teach and train", line: "Lessons, courses, quizzes and feedback", tasks: ["teach-and-train"] },
  { id: "supply", name: "Run your supply chain", line: "Stock, suppliers, shipping and routes", tasks: ["find-products", "plan-supply-chain", "run-your-store"] },
];

/** The broad areas above the groups (docs/MINDS-PRD.md §3). A group can sit in more than one; a mind sits in its own areas. */
export const AREAS = [
  { id: "learning-careers", name: "Learning and careers", fns: ["learner", "job-seeker"] },
  { id: "marketing", name: "Marketing", fns: ["copywriter", "media-buyer", "google-ads", "ads", "cro", "retention", "strategist", "social", "search"] },
  { id: "design", name: "Design", fns: ["ads", "photos", "maker", "product"] },
  { id: "business", name: "Business", fns: ["strategist", "founder", "validator", "strategy", "product", "minds", "files", "office", "store", "support", "legal", "analyst", "supply"] },
  { id: "sales", name: "Sales", fns: ["seller", "validator", "support"] },
  { id: "leadership", name: "Leadership", fns: ["leader", "strategy", "people"] },
  { id: "writing", name: "Writing", fns: ["copywriter", "writer"] },
  { id: "arts", name: "Arts", fns: ["writer", "maker"] },
  { id: "coding", name: "Coding", fns: ["product", "developer", "connector"] },
  { id: "science", name: "Science and research", fns: ["researcher"] },
  { id: "teaching", name: "Education and training", fns: ["teacher", "learner"] },
  { id: "thinking", name: "Thinking", fns: ["thinker", "minds"] },
  { id: "finance", name: "Finance and accounting", fns: ["accounting", "finance", "investing", "tax", "funding", "personal-finance"] },
  { id: "operations", name: "Operations", fns: ["office", "files", "projects", "supply", "store"] },
  { id: "people", name: "HR and recruiting", fns: ["people"] },
  { id: "legal", name: "Legal and compliance", fns: ["legal"] },
  { id: "data", name: "Data and analytics", fns: ["analyst"] },
  { id: "product", name: "Product management", fns: ["product", "validator"] },
  { id: "support", name: "Customer support", fns: ["support"] },
  { id: "supply-chain", name: "Supply chain and procurement", fns: ["supply"] },
  { id: "it", name: "IT and infrastructure", fns: ["it", "connector"] },
  { id: "security", name: "Security and privacy", fns: ["security"] },
  { id: "engineering", name: "Engineering", fns: ["engineer"] },
];
export const QUICK_JOB_IDS = ["coding", "marketing", "design", "writing", "business", "finance", "sales", "operations"];
// Worked out once per job, not once per block per keystroke: the library asks these for every block, many times a second.
/** @type {Map<string, string[]>} */
const AREAS_BY_TASK = new Map();
export const areasOf = (b) => {
  const tasks = b.type === "mind" ? (b.tasks ?? []) : taskIdsOf(b);
  const derived = tasks.flatMap(task => {
    let result = AREAS_BY_TASK.get(task);
    if (!result) AREAS_BY_TASK.set(task, (result = AREAS.filter(a => a.fns.some(id => FUNCTIONS.find(fn => fn.id === id)?.tasks.includes(task))).map(a => a.id)));
    return result;
  });
  return [...new Set([...(b.type === "mind" ? [b.area, ...(b.also ?? [])] : []), ...(b.jobFunctions ?? []), ...derived].filter(Boolean))];
};
/** Old links to the two functions that became "Create ads". */
/** @type {Record<string, string>} */
export const FUNCTION_MOVED = { designer: "ads", video: "ads" };
/** Image or video: the two kinds of ad a block can make. Every ad-making block makes one, never both. */
export const formatOf = (b) => (b.task === "make-image-ads" ? "image" : b.task === "make-video-ads" ? "video" : null);
const VIDEO_OUT = new Set(["video_prompt", "video_ads"]);
const IMAGE_OUT = new Set(["image_prompt", "avatar_sheet", "static_ads", "photo_set", "pdp_images", "upscaled_image"]);
/** What a block needs a picture or video tool for, since Claude writes prompts but can't draw.
 *  Same rule as tools/add-making-it.mjs, which adds the matching note to the SKILL.md. */
export const rendersOf = (b) =>
  b.outputs.some((o) => VIDEO_OUT.has(o.type)) ? "video" : b.outputs.some((o) => IMAGE_OUT.has(o.type)) ? "image" : null;
/** @type {Map<string, typeof FUNCTIONS>} */
const FNS_BY_TASK = new Map();
export const functionsOf = (b) => {
  const tasks = taskIdsOf(b), key = [...tasks].sort().join("|");
  let result = FNS_BY_TASK.get(key);
  if (!result) FNS_BY_TASK.set(key, (result = FUNCTIONS.filter(fn => fn.tasks.some(task => tasks.includes(task)))));
  return result;
};

// Derive menus from real membership. This includes the minds belonging to a
// function and secondary use cases that a broad specialty list would miss.
export function availableTasks(blocks, { area = "", fn = "" } = {}) {
  const ids = new Set(blocks.filter(b => (!area || areasOf(b).includes(area)) && (!fn || functionsOf(b).some(f => f.id === fn))).flatMap(taskIdsOf));
  return TASKS.filter(task => ids.has(task.id));
}
export function availableFunctions(blocks, area = "") {
  const ids = new Set(blocks.filter(b => !area || areasOf(b).includes(area)).flatMap(b => functionsOf(b).map(fn => fn.id)));
  return FUNCTIONS.filter(fn => ids.has(fn.id));
}
export function classificationText(b) {
  const tasks = taskIdsOf(b), areas = areasOf(b);
  return [...(b.topics ?? []), ...TASKS.filter(task => tasks.includes(task.id)).map(task => task.name), ...functionsOf(b).map(fn => fn.name), ...AREAS.filter(area => areas.includes(area.id)).map(area => area.name)].join(" ");
}


