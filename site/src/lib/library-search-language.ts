/** Query language only: the words people type for a topic, mapped to the words the catalogue uses for it.
 *  Nothing here tags documents or changes the shipped index; a rule only lets a typed word be met by catalogue
 *  words instead (at a discount, so an exact word still wins). Rules are about words and topics, never about
 *  particular items or whole sentences. */

/** Single words used interchangeably for one topic. Typing any member also finds the others. */
const SYNONYM_GROUPS: string[][] = [
  ["ad", "ads", "advert", "adverts", "advertisement", "advertisements"],
  ["competitor", "competitors", "rival", "rivals"],
  ["supplier", "suppliers", "vendor", "vendors"],
  ["refund", "refunds", "return", "returns"],
  ["invoice", "invoices", "bill", "bills"],
  ["bookkeeping", "accounting"],
  ["hiring", "recruiting", "recruitment"],
  ["employee", "employees", "staff"],
  ["picture", "pictures", "photo", "photos", "image", "images"],
  ["contract", "contracts", "agreement", "agreements"],
  ["bug", "bugs", "error", "errors"],
  ["survey", "surveys", "questionnaire", "questionnaires"],
  ["headline", "headlines", "title", "titles"],
  ["checkout", "cart"],
  ["compliance", "policy"],
  ["rejected", "disapproved"],
  ["meeting", "meetings", "call", "calls"],
  ["slide", "slides", "deck", "presentation", "powerpoint"],
  ["spreadsheet", "spreadsheets", "excel", "workbook", "sheet"],
  ["inventory", "stock"],
  ["loyalty", "rewards"],
  ["salary", "pay", "wage", "wages"],
  ["forecast", "projection", "projections"],
  ["video", "videos", "clip", "clips"],
  ["analyse", "analyze", "analysis", "analytics"],
];

/** One-way: a typed word or tool name, mapped to the catalogue's words for the job it implies. */
const ONE_WAY: [RegExp, string][] = [
  // Selling and stores
  [/\b(?:shops?|webshop|online shop)\b/, "store"],
  [/\b(?:ecommerce|e commerce|ecom|dtc|d2c)\b/, "store online"],
  [/\bclients?\b/, "customer"],
  [/\bshoppers?\b/, "customer buyer"],
  [/\b(?:websites?|web sites?)\b/, "site"],
  [/\bsites?\b/, "website"],
  [/\b(?:revenue|turnover)\b/, "sales"],
  [/\bnew business\b/, "startup"],
  [/\bsales pages?\b/, "landing"],
  [/\bbrand marks?\b/, "logo"],
  [/\bsearch rank(?:ing)?s?\b/, "seo"],
  [/\brepeat customers?\b/, "retention repeat"],
  [/\b(?:cancellations?|cancel+ing)\b/, "churn"],
  [/\b(?:copywriting|copywriter)\b/, "copy"],
  [/\bcaptions?\b/, "post text"],
  [/\bscreening\b/, "interview"],
  [/\b(?:newsletters?|mailing list|email list)\b/, "email newsletter"],
  [/\b(?:affiliates?|influencers?)\b/, "affiliate creator partner"],
  [/\b(?:referrals?|refer a friend|word of mouth)\b/, "referral"],
  [/\b(?:discounts?|coupons?|promo codes?)\b/, "discount offer"],
  [/\bspam\b/, "deliverability inbox"],
  // Money
  [/\b(?:quickbooks|qbo|xero|freshbooks|sage accounting|wave accounting|zoho books)\b/, "bookkeeping accounting ledger"],
  [/\b(?:expenses?|outgoings)\b/, "expense spending cost"],
  [/\breceipts?\b/, "receipt expense"],
  [/\b(?:taxes|irs|hmrc|vat|gst)\b/, "tax"],
  [/\bpayroll\b/, "pay salary payroll"],
  [/\b(?:stripe|paypal|square|venmo)\b/, "payment payout"],
  // Office and software tools: the tool's name implies its job
  [/\b(?:pptx?|google slides|keynote)\b/, "slide deck presentation powerpoint"],
  [/\b(?:google sheets?|xlsx)\b/, "spreadsheet excel"],
  [/\b(?:word docs?|google docs?|docx)\b/, "document"],
  [/\b(?:notion|confluence|obsidian|coda)\b/, "wiki notes knowledge base"],
  [/\b(?:slack|microsoft teams|discord|whatsapp)\b/, "chat message team"],
  [/\b(?:trello|asana|jira|clickup)\b/, "project task board"],
  [/\b(?:zapier|make\.com|n8n|ifttt|power automate)\b/, "automation workflow no code"],
  [/\b(?:hubspot|salesforce|pipedrive|crm)\b/, "crm sales pipeline"],
  [/\b(?:mailchimp|klaviyo|convertkit|beehiiv|substack)\b/, "email newsletter"],
  [/\b(?:gmail|outlook)\b/, "email inbox"],
  [/\b(?:canva|figma)\b/, "design"],
  [/\b(?:wordpress|wix|squarespace|webflow)\b/, "website"],
  [/\b(?:zoom|google meet)\b/, "meeting call"],
  [/\b(?:calendly|calendar)\b/, "schedule calendar meeting"],
  [/\b(?:ga4|google analytics)\b/, "analytics ga4"],
  [/\b(?:chatgpt|chat gpt|gpt|openai|gemini|copilot|llms?|chatbots?)\b/, "ai"],
  [/\bcsv\b/, "spreadsheet data"],
  // Work and people
  [/\b(?:boss|bosses|execs?|executives?|leadership|stakeholders?)\b/, "executive manager leadership stakeholder"],
  [/\b(?:coworkers?|colleagues?|teammates?)\b/, "team employee"],
  [/\b(?:clash(?:es|ing)?|fights?|arguments?|conflicts?|disputes?)\b/, "conflict mediation"],
  [/\b(?:remote|wfh|work from home|hybrid)\b/, "remote hybrid"],
  [/\b(?:admin|paperwork|busywork|repetitive)\b/, "admin automate automation repetitive routine"],
  [/\b(?:procrastinat\w*|distract\w*|screen time)\b/, "focus habit distraction"],
  [/\b(?:prioriti[sz]\w*|priorities)\b/, "priority"],
  [/\b(?:sops?|standard operating procedures?|playbooks?|runbooks?)\b/, "process sop playbook"],
  [/\b(?:handbooks?|manuals?)\b/, "handbook policy"],
  [/\b(?:wiki|knowledge base|intranet)\b/, "wiki knowledge base"],
  [/\bokrs?\b/, "objective key result"],
  // Learning and writing
  [/\b(?:memori[sz]e|remember|retain|recall)\b/, "recall memory remember"],
  [/\b(?:pupils|classroom|kids)\b/, "lesson student classroom"],
  [/\b(?:homework|assignments?)\b/, "assignment"],
  [/\b(?:typos?|grammar|spelling)\b/, "proofread grammar"],
  [/\b(?:robotic|ai.sounding|ai.written)\b/, "slop human voice style"],
  [/\b(?:colou?rs?|palettes?)\b/, "colour palette"],
  [/\b(?:fonts?|typefaces?|typography)\b/, "font typography"],
  // Data and code
  [/\b(?:stats|statistics|figures)\b/, "number figure data metric"],
  [/\bpredict\w*\b/, "forecast prediction"],
  [/\b(?:duplicates?|dupes?|deduplicat\w*)\b/, "duplicate"],
  [/\b(?:outages?|downtime|uptime)\b/, "uptime outage downtime monitoring alert"],
  [/\b(?:hacked|hackers?|breach(?:ed)?)\b/, "security breach incident"],
  [/\bbackups?\b/, "backup recovery restore"],
  [/\b(?:scrap(?:e|ing)|web scraping)\b/, "extract scrape data"],
];

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+");
/** Synonym groups and one-way rules, as [pattern, words that may stand in] for the query parser. */
export const WORD_ALIASES: [RegExp, string][] = [
  ...SYNONYM_GROUPS.map(group => [new RegExp(`\\b(?:${group.map(escape).join("|")})\\b`), group.join(" ")] as [RegExp, string]),
  ...ONE_WAY,
];
