// Plain words for a specialist page: one verb (Hire) for the title, the menu and the card button, a heading that
// keeps acronyms and product names as written, and short meanings for the trade terms the opening uses.
// Pure functions with no imports, shared by the build, the prerendered pages and the app.

export const ROLE_VERB = 'Hire';
// Words that stay capitalised when they open a role name: products, platforms, languages and places.
// (Acronyms such as SEO, CRO or RNA and words with an inner capital such as TikTok stay as written anyway.)
const PROPER = new Set(('Amazon Android Angular Apple Arabic Azure Baidu Bilibili Bing Blender China Chinese Claude Django Docker Douyin Drupal Dutch English Etsy Excel Feishu Filament Jira Kuaishou Oracle Qdrant Vercel Weibo Xiaohongshu Zhihu '
 + 'Facebook Figma Flutter French German Git GitHub Godot Google Hindi Instagram Italian Japanese Java JavaScript Klaviyo '
 + 'Korean Kotlin Kubernetes Laravel LinkedIn Linux Mac Mandarin Meta Microsoft Next Notion Pinterest Portuguese Python '
 + 'React Reddit Roblox Ruby Russian Rust Salesforce Shopify Slack Solidity Spanish Stripe Swift Terraform TikTok Turkish '
 + 'Twitter Unity Unreal Vue WhatsApp Windows WooCommerce WordPress Xero YouTube Zapier').split(' '));

/** The role name as it reads inside a sentence: "Executive assistant" -> "executive assistant", "SEO specialist" stays. */
export function sentenceName(name) {
 const [first = '', ...rest] = String(name ?? '').trim().split(/\s+/);
 // "Executive", "Follow-up" and "Welcome," lower; "SEO", "TikTok", "API-to-MCP", "Shopify" and "90-day" stay.
 const word = first.replace(/[,:;.!?]+$/, '');
 const lower = /^[A-Z][a-z]*(?:-[a-z0-9]+)*$/.test(word) && word.length > 1 && !PROPER.has(word.split('-')[0]);
 return [lower ? first[0].toLowerCase() + first.slice(1) : first, ...rest].join(' ');
}

/** An input written as an order ("State the facts") cannot follow "Give it" or "It works from". */
export const startsWithOrder = (s) => /^(state|attach|share|give|describe|list|provide|paste|add|tell|upload|include|confirm|name|enter|choose|pick|write|send|bring|use|set|define|identify|specify)\b/i.test(String(s ?? '').trim());

/** The heading on a role page, and the start of its title: "Hire an AI SEO specialist". */
export function roleHeading(name) {
 const phrase = sentenceName(name);
 return /^AI\b/.test(phrase) ? `${ROLE_VERB} an ${phrase}` : `${ROLE_VERB} an AI ${phrase}`;
}

// Trade terms a newcomer may not know, each explained in a few plain words.
export const ROLE_TERMS = {
 'A/B test': 'two versions shown to different people to see which works better',
 AOV: 'average order value, what a customer spends per order',
 API: 'a way for one piece of software to talk to another',
 B2B: 'selling to other businesses',
 B2C: 'selling to the public',
 CAC: 'what it costs to win one new customer',
 CMS: 'the tool you use to edit your website',
 CPA: 'what you pay in ads for each sale or sign-up',
 CPC: 'what you pay for each click on an ad',
 CPM: 'what you pay for a thousand ad views',
 CRM: 'the system where you keep your customer records',
 CRO: 'getting more of your visitors to buy',
 CTA: 'the button or line that asks people to act',
 CTR: 'the share of people who click after they see it',
 GA4: 'Google Analytics, the tool that counts your site visits',
 GDPR: 'the European law on personal data',
 ICP: 'your ideal customer',
 KPI: 'the main number that shows if the work is working',
 LTV: 'what one customer spends with you over time',
 MRR: 'the money that comes in every month from subscriptions',
 NPS: 'a score for how likely customers are to recommend you',
 OKR: 'a goal with a few numbers that show progress',
 PPC: 'ads you pay for each time someone clicks',
 QA: 'checking the work for mistakes before it goes out',
 ROAS: 'sales earned for each unit of money spent on ads',
 ROI: 'what you get back for what you put in',
 SaaS: 'software people pay for by subscription',
 SEO: 'getting your pages found in search results',
 SERP: 'the page of search results',
 SKU: 'one product, or one size or colour of it, that you stock',
 SQL: 'the language used to ask a database for data',
 UGC: 'videos and photos that look made by customers',
 UI: 'the screens and buttons people use',
 UX: 'how easy something is to use',
};
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const TERM_RE = new RegExp(`(?<![A-Za-z0-9/])(${Object.keys(ROLE_TERMS).sort((a, b) => b.length - a.length).map(escape).join('|')})s?(?![A-Za-z0-9/])`, 'g');

/** The terms the given texts use, in order of first use, each once, with what it means. */
export function termsIn(texts) {
 const found = new Map();
 for (const text of texts) for (const m of String(text ?? '').matchAll(TERM_RE)) if (!found.has(m[1])) found.set(m[1], ROLE_TERMS[m[1]]);
 return [...found].map(([term, meaning]) => ({ term, meaning }));
}

// The opening of every role page, the same in the prerendered page and in the app: what you give, what you get,
// a short example and the trade terms it uses. Built from the role's own fields; `opening` holds the plain picks.
const cap = (s) => String(s ?? '').replace(/^./, (c) => c.toUpperCase());
/**
 * @param {{name:string,summary:string,inputs?:string[],deliverables?:string[],opening?:{give?:string[],get?:string[]},workedExample?:{situation?:string,task?:string,outputs?:{name:string,contains:string}[]}}} role
 * @returns {{heading:string,summary:string,give:string[],get:string[],example:{situation:string,task:string,outputs:{name:string,contains:string}[]}|null,terms:{term:string,meaning:string}[]}}
 */
export function roleOpening(role) {
 const o = role.opening ?? {};
 const give = (o.give?.length ? o.give : (role.inputs ?? []).slice(0, 3)).map(cap);
 const get = (o.get?.length ? o.get : (role.deliverables ?? []).slice(0, 4)).map(cap);
 const x = role.workedExample ?? {};
 const example = x.task ? { situation: x.situation ?? '', task: x.task, outputs: (x.outputs ?? []).slice(0, 3) } : null;
 const heading = roleHeading(role.name);
 const terms = termsIn([heading, role.summary, ...give, ...get, example?.situation, example?.task, ...(example?.outputs ?? []).map((out) => `${out.name} ${out.contains}`)]);
 return { heading, summary: role.summary, give, get, example, terms };
}
