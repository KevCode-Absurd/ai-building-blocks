/** Bounded, reviewable purpose mappings. These infer a job, never generate an answer. */
import { TASKS } from './catalogue-taxonomy.mjs';
const CLASSIFIED_TASKS = new Set(TASKS.map(task => task.id));
export const SEARCH_INTENTS = [
  { id: "value-investing", label: "Value investing", patterns: [/\bvalue\s+invest(?:ing|ment|ments|or|ors)?\b/, /\b(?:margin of safety|intrinsic value|owner earnings)\b/] },
  { id: "business-valuation", label: "Business valuation", patterns: [/\b(?:business|company|equity|startup)\s+(?:valuation|value|worth)\b/, /\b(?:discounted cash flow|dcf model|valuation model|valuing a business)\b/] },
  { id: "personal-budget", label: "Personal budgeting and saving", patterns: [/\b(?:personal|household|home|family)\s+(?:money|budget|financ|spending|saving)/, /\b(?:pay off|paying off|repay)\b.{0,30}\b(?:my debt|credit card|personal loan)\b/] },
  { id: "cash-flow", label: "Cash flow and runway planning", patterns: [/\b(?:cash flow|cashflow|cash forecast|cash runway|startup runway|cash buffer|run(?:ning)? out of cash)\b/, /\b(?:forecast|plan|manage)\b.{0,45}\b(?:business cash|cash balance|working capital)\b/] },
  { id: "accounting-close", label: "Accounting and reconciliation", patterns: [/\b(?:bookkeeping|month.end close|financial close|accounting close|close the books|reconcile accounts|bank reconciliation|journal entr|account reconciliat)/] },
  { id: "invoice-review", label: "Invoice checking and reconciliation", patterns: [/\b(?:supplier invoices?|vendor bills?)\b/, /\binvoices?\b.{0,45}\b(?:review|check|match|errors?|mistakes?)\b/, /\b(?:review|check|match)\b.{0,45}\binvoices?\b/] },
  { id: "tax-review", label: "Tax preparation and review", patterns: [/\b(?:tax|taxes)\b.{0,35}\b(?:prepar|calculat|review|plan|return|filing|deferred)/, /\b(?:prepar|calculat|review|plan|deferred)\w*\b.{0,35}\btax\b/] },
  { id: "contract-review", label: "Contract and agreement review", patterns: [/\b(?:contract|agreement|nda|legal document)\b.{0,45}\b(?:review|check|risk|clauses|audit)\b/, /\b(?:review|check|audit)\b.{0,45}\b(?:contract|agreement|nda|legal document)\b/] },
  { id: "project-planning", label: "Project planning and delivery", patterns: [/\b(?:project management|project planning|project plan|team capacity|project scope|delivery schedule)\b/, /\b(?:plan|manage|scope)\b.{0,35}\b(?:project|team capacity|delivery date)\b/] },
  { id: "product-discovery", label: "Product discovery and validation", patterns: [/\b(?:product discovery|product validation|product management|product idea|validate a product|test a product idea)\b/] },
  { id: "user-experience", label: "User experience and usability", patterns: [/\b(?:ux|user experience|usability|user interface|ui design)\b/] },
  { id: "negotiation", label: "Negotiation", patterns: [/\b(?:negotiat\w*|bargaining|difficult conversation)\b/] },
  { id: "copywriting", label: "Copywriting", patterns: [/\b(?:copywriting|copywriter|sales copy|ad copy|persuasive copy)\b/] },
  { id: "data-visualisation", label: "Data visualisation", patterns: [/\b(?:data visuali[sz]ation|visuali[sz]e data|chart design|charts and graphs|data storytelling)\b/, /\b(?:csv|spreadsheet|dataset|data)\b.{0,50}\b(?:charts?|graphs?|visuali[sz])/] },
  { id: "cybersecurity", label: "Cybersecurity and account safety", patterns: [/\b(?:cybersecurity|cyber security|data breach|phishing|account safety|security incident|security review)\b/] },
  { id: "study-methods", label: "Learning and study methods", patterns: [/\b(?:study methods|study techniques|learning methods|learning techniques|retrieval practice|spaced repetition|active recall)\b/, /\b(?:remember|retain)\b.{0,40}\b(?:study|studied|learn|learning)\b/] },
  { id: "research-literature", label: "Research papers and literature reviews", patterns: [/\b(?:literature review|research synthesis|research papers?|scientific papers?|academic papers?|review the literature)\b/] },
  { id: "leadership", label: "Leadership and team management", patterns: [/\b(?:leadership|team management|managing people|manage a team|lead a team|team feedback)\b/] },
  { id: "customer-service", label: "Customer service", patterns: [/\b(?:customer service|customer support|support tickets?|customer complaints?|help desk)\b/] },
  { id: "mental-models", label: "Mental models and decision making", patterns: [/\b(?:mental models|decision making|cognitive bias|thinking models|inversion thinking)\b/] },
  { id: "answer-visibility", label: "AI answer visibility", patterns: [/\b(?:aeo|answer\s*engine\s*optimi[sz]ation|generative\s*engine\s*optimi[sz]ation|ai[ -]?search)\b/, /\b(?:ai|chatgpt|perplexity|claude|answer engine)\b.{0,60}\b(?:visibility|discoverab|brand mentions|brand recommendations)/, /\b(?:brand|business|company|website)\b.{0,90}\b(?:chatgpt|perplexity|ai answers)\b/, /\b(?:ai|chatgpt|perplexity|claude)\b.{0,70}\b(?:cite|citations?|references?)\b.{0,50}\b(?:brand|website|store|business|product page)\b/] },
  { id: "search-ranking", label: "Search engine visibility", patterns: [/\b(?:seo|search\s*engine\s*optimi[sz]ation|organic search|serp)\b/, /\b(?:rank|ranking|traffic|show up|found)\b.{0,50}\b(?:google|search engine)\b/, /\bgoogle\b.{0,50}\b(?:rank|ranking|traffic|visibility)\b/] },
  { id: "meeting-notes", label: "Meeting notes and actions", patterns: [/\b(?:meeting|call|session)\b.{0,60}\b(?:notes|minutes|transcript|actions|summary|summari[sz])/, /\b(?:notes|transcript|recording)\b.{0,60}\b(?:minutes|action items|follow[ -]?ups)\b/] },
  { id: "email-reply", label: "Email and message replies", patterns: [/\b(?:email|inbox|customer message)\b.{0,60}\b(?:reply|replies|respond|response|draft)\b/, /\b(?:reply|respond|answer)\b.{0,60}\b(?:email|customer|message|complaint)\b/, /\b(?:angry|unhappy|upset)\s+customer\b/] },
  { id: "code-debug", label: "Debugging and failing tests", patterns: [/\b(?:debug(?:ger|ging)?|test failure|failing tests|bug repair|stack trace)\b/, /\b(?:fix|repair|find|understand)\b.{0,70}\b(?:bugs?|errors?|crash(?:ing|es|ed)?|failing tests?)\b/, /\b(?:app|code|script|test)\b.{0,60}\b(?:broken|crash(?:ing|es|ed)?|failing|errors?)\b/, /\b(?:website|app|browser|code)\b.{0,70}\b(?:blank|white|black)\s+(?:screen|page)\b/] },
  { id: "content-repurpose", label: "Repurposing content", patterns: [/\b(?:repurpos|reus)[a-z]*\b.{0,60}\b(?:content|blog|video|podcast|post|article)\b/, /\b(?:content|blog|video|podcast|post|article)\b.{0,60}\b(?:repurpos|reus)[a-z]*\b/, /\b(?:blog|podcast|video|article|webinar)\b.{0,80}\b(?:social posts|short clips|linkedin posts|several posts|threads)\b/] },
  { id: "customer-research", label: "Learning from customer feedback", patterns: [/\b(?:customer research|voice of customer|review mining|feedback analysis)\b/, /\b(?:reviews|feedback|customer interviews)\b.{0,70}\b(?:pattern|theme|insight|complaint|learn|understand|want|need)/, /\b(?:patterns?|themes?|insights?|learn|understand)\b.{0,60}\b(?:reviews|customer feedback|customer interviews)\b/, /\b(?:learn|understand|find)\b.{0,50}\b(?:customers want|customers need|customer complaints)\b/] },
  { id: "landing-copy", label: "Landing and product page copy", patterns: [/\b(?:landing|product|sales)\s+page\b.{0,70}\b(?:copy|write|conversion|convert|persuad)/, /\b(?:write|improve|rewrite)\b.{0,70}\b(?:landing|product|sales)\s+page\b/] },
  { id: "ad-performance", label: "Advertising performance", patterns: [/\b(?:ad|ads|advertising|campaign)\b.{0,70}\b(?:performance|fatigue|spend|budget|roas|conversions|results|wasting)\b/, /\b(?:roas|ad fatigue|campaign audit|media buying)\b/, /\b(?:wasting|losing)\b.{0,35}\b(?:money|budget)\b.{0,35}\bads\b/] },
  { id: "ad-results-review", label: "Reviewing ad results and wasted spend", patterns: [/\b(?:ad spend analys|ad results analys|campaign performance review|ad performance review|winners and losers ad|read ad results|wasted ad spend)/, /\b(?:ads?|campaigns?|advertising)\b.{0,70}\b(?:wast[a-z]*|overspend|review|hardly sell|spend money)/, /\b(?:which|why)\b.{0,50}\b(?:ads|campaigns)\b/] },
  { id: "ad-spend-analysis", label: "Finding wasted advertising spend", patterns: [/\b(?:ad spend analys|advertising spend analys|wasted spend|wasted ad spend|ad budget audit|paid media audit)/, /\b(?:ads?|campaigns?)\b.{0,70}\b(?:wast[a-z]*|overspend|spend money|hardly sell|losing money)/] },
  { id: "customer-retention", label: "Repeat purchases and customer retention", patterns: [/\b(?:retention|churn|customer cohort|repeat.purchase|repeat rate|ltv|customer value)\b/, /\b(?:customers?|buyers?)\b.{0,80}\b(?:stop buying|not buying again|never buy again|first order|first purchase|leave|cancel)\b/] },
  { id: "weekly-plan", label: "Planning and prioritising work", patterns: [/\b(?:weekly plan|week plan|task priorit|prioriti[sz]ation|workload planning)/, /\b(?:plan|organi[sz]e|prioriti[sz]e)\b.{0,60}\b(?:week|tasks|workload|work)\b/] },
  { id: "onboarding", label: "Helping new people get started", patterns: [/\b(?:onboarding|induction|new hire|new employee|new starter)\b/, /\b(?:help|train|welcome)\b.{0,60}\b(?:new team member|new staff|new customer)\b/] },
  { id: "employee-onboarding", label: "New employee onboarding", patterns: [/\b(?:new hire|new employee|new starter|new teammate|new team member|new staff|employee onboarding|staff induction)\b/] },
  { id: "customer-onboarding", label: "New customer onboarding", patterns: [/\b(?:new customer|customer onboarding|first.use onboarding|new user onboarding)\b/] },
  { id: "interview-prep", label: "Preparing for a job interview", patterns: [/\b(?:job interview|interview prep|interview answers|interview coach)\b/, /\b(?:prepare|practice|rehearse)\b.{0,70}\binterview\b/, /\b(?:cv|resume)\b.{0,60}\binterview\b/] },
  { id: "budget-review", label: "Budget and spending review", patterns: [/\b(?:budget variance|budget versus actual|budget vs actual|over budget|overspend|expense track|spending review|budget review|budget actual)/, /\b(?:where|explain|track|review)\b.{0,70}\b(?:money went|spending|expenses)\b/] },
  { id: "document-summary", label: "Summarising documents", patterns: [/\b(?:summari[sz]e|summary|digest|key points)\b.{0,60}\b(?:document|report|pdf|article|paper)\b/, /\b(?:document|report|pdf|article|paper)\b.{0,60}\b(?:summary|summari[sz]e|key points|digest)\b/] },
  { id: "data-analysis", label: "Finding patterns in data", patterns: [/\b(?:data analysis|analy[sz]e data|spreadsheet analysis)\b/, /\b(?:spreadsheet|dataset|csv|sales data)\b.{0,65}\b(?:pattern|trend|insight|analy[sz]|understand)/, /\b(?:explain|understand|analy[sz]e)\b.{0,65}\b(?:spreadsheet|dataset|csv|sales data)\b/] },
  { id: "job-hiring", label: "Hiring and interviewing", patterns: [/\b(?:hiring|recruitment|candidate interview|job description|(?<!(?:customer|user|buyer|research|discovery|sales|podcast|guest) )interview questions)\b/, /\b(?:hire|recruit|interview)\b.{0,60}\b(?:candidate|employee|designer|developer|marketer|team member)\b/] },
  { id: "presentation", label: "Presentations and slide decks", patterns: [/\b(?:slide deck|presentation|pitch deck|slides)\b/, /\b(?:turn|make|create|build)\b.{0,60}\b(?:report into slides|investor pitch)\b/] },
] as const;
/** GEO alone is a query shorthand, never evidence about a document's purpose. */
export function geoAnswerAlias(normalized: string, document = false): boolean {
  if (!/\bgeo\b/.test(normalized)) return false;
  const explicit = /\bgeo\b.{0,45}\b(?:ai search|answer engines?|generative engines?)\b|\b(?:ai search|answer engines?|generative engines?)\b.{0,45}\bgeo\b/.test(normalized);
  return explicit || !document && (normalized.trim() === "geo" || /\b(?:seo|marketing|brand|website|search|visibility|optimization|optimisation)\b/.test(normalized));
}
export function searchIntents(text: string, document = false) {
  const normalized = text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[_-]/g, " ").replace(/\s+/g, " ");
  // A person's wording expands the query; it must never tag an unrelated document.
  const answerVisibilityQuery = !document && /\b(?:show up|be found|get found|appear|mentioned|cited|recommended)\b.{0,60}\b(?:ai answers?|ai search|chatgpt|perplexity|claude)\b/.test(normalized);
  return SEARCH_INTENTS.filter(intent => (intent.patterns.some(pattern => pattern.test(normalized)) || intent.id === "answer-visibility" && (answerVisibilityQuery || geoAnswerAlias(normalized, document))) && (intent.id !== "code-debug" || !/\b(?:crawl|indexing|search console|seo)\b/.test(normalized) || /\b(?:python|javascript|typescript|runtime|stack trace|failing tests|debugger|source code)\b/.test(normalized)) && (intent.id !== "interview-prep" || !/\b(?:customer|consumer|buyer|product research)\b/.test(normalized) || /\b(?:cv|resume|employment|job application)\b/.test(normalized)));
}
/** Employer hiring and buyer research do not imply applicant interview practice. */
export function searchIntentExclusions(task: string, also: string[] = []): string[] {
  const tasks = [task, ...also];
  const exclusions = task === "hire-people" || task === "understand-customers" ? ["interview-prep"] : [];
  // A customer complaint used as advertising research does not make an ad
  // writer a support agent. Enforce the same domain distinction for every item,
  // while retaining literal discovery of words in the complete instructions.
  const scopes: Record<string, string[]> = {
    'customer-service': ['help-customers', 'keep-customers', 'write-emails', 'organise-work', 'document-work', 'think-with-minds'],
    'personal-budget': ['manage-personal-finances', 'money-and-investing', 'think-with-minds'],
    'value-investing': ['money-and-investing', 'think-with-minds'],
    'business-valuation': ['money-and-investing', 'raise-funding', 'plan-budgets-and-cash', 'think-with-minds'],
    'accounting-close': ['manage-accounting', 'plan-budgets-and-cash', 'think-with-minds'],
    'tax-review': ['manage-tax', 'manage-accounting', 'money-and-investing', 'think-with-minds'],
    'contract-review': ['check-contracts', 'money-and-investing', 'raise-funding', 'think-with-minds'],
    'research-literature': ['research-topics', 'teach-and-train', 'study-and-practice', 'document-work', 'think-with-minds'],
  };
  // Unknown/absent metadata remains searchable; scope only applies to known
  // classifications rather than guessing a method's function from its words.
  if (CLASSIFIED_TASKS.has(task)) {
    for (const [intent, allowed] of Object.entries(scopes)) if (!tasks.some(id => allowed.includes(id))) exclusions.push(intent);
  }
  return exclusions;
}
