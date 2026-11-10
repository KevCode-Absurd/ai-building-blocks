// Intake questions chosen for the job, not for a family group. Deterministic and model-free.
// A question earns its place only if the answer cannot be read from the client's site or files.
// Every question states the default used when the client says "you decide" or skips it.
// A question the request already answers is dropped, so nobody is asked twice.

const q = (id, question, fallback, answered) => Object.freeze({ id, question, default: fallback, ...(answered ? { answered } : {}) });

const PLATFORM = '(?:meta|facebook|instagram|tiktok|google|youtube|pinterest|linkedin|snapchat|reddit)';
const TRAFFIC_NAMED = new RegExp(`\\b${PLATFORM}\\b[^.]{0,40}\\b(?:ads?|traffic|campaigns?|clicks)\\b|\\b(?:ads?|paid|email|newsletter|search|organic|seo|social|influencer|qr)\\s+(?:traffic|visitors|clicks)\\b|\\btraffic from\\b`, 'i');
const ACTION_NAMED = /\b(?:to|should|can|must)\s+(?:buy|book|sign[ -]?up|subscribe|pre-?order|enquire|join|download|donate|register|add to (?:cart|basket))\b|\b(?:sign[ -]?up|booking|checkout|waitlist|lead[ -]?gen|pre-?order)\s+(?:page|form|flow)\b/i;
const OFFER_NAMED = /\b\d{1,2}\s?% off\b|\b(?:discount|sale|offer|bundle|free shipping|free trial|coupon|promo code|bogo|launch price)\b/i;
const AUDIENCE_NAMED = /\b(?:retarget\w*|remarket\w*|cold (?:audience|traffic)|warm (?:audience|traffic)|lookalikes?|past (?:buyers|customers)|new (?:customers|buyers)|prospecting)\b|\b(?:ads?|creatives?)\s+(?:for|aimed at|targeting)\s+(?:people|women|men|parents|runners|founders|owners|students|teams)\b/i;
const PLACEMENT_NAMED = /\b(?:9:16|4:5|1:1|16:9|stories|reels?|feed|shorts|in-?stream|carousels?|search ads?|display)\b/i;
const TRIED_NAMED = /\b(?:already (?:ran|run|tried|tested)|we(?:'ve| have) (?:tried|tested|run)|best[ -]performing|worked best|flopped|fatigued?|winning ads?)\b/i;
const TRIGGER_NAMED = /\b(?:welcome|abandon\w*|win-?back|post-?purchase|lapsed|onboarding|re-?engage\w*|birthday)\b/i;
const METRIC_NAMED = /\b(?:conversion rate|cvr|bounce rate|roas|cpa|cac|ctr|aov|add-to-cart rate|open rate|click rate|churn|retention)\b/i;
const ACCESS_NAMED = /\b(?:analytics|ga4|search console|ads manager|ad account|heatmaps?|recordings|export|csv|spreadsheet|dashboard)\b/i;
const DEADLINE_NAMED = /\b(?:by|before|within)\s+(?:the\s+)?(?:end of\s+)?(?:next\s+|this\s+)?(?:monday|tuesday|wednesday|thursday|friday|week|month|quarter|year|q[1-4]|january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}\s+(?:days|weeks|months))\b/i;
const STACK_NAMED = /\b(?:shopify|wordpress|webflow|next\.?js|react|vue|svelte|python|node|typescript|javascript|php|rails|django|sql|postgres|supabase|cloudflare|aws|github|repo)\b/i;

/** Up to five candidates per kind, in the order they matter. The first four the request has not answered are asked. */
const QUESTIONS = Object.freeze({
  web_page: [
    q('traffic_source', 'Where will visitors come from: ads (on which platform), email, search or your own site?', 'Paid social ads, seen on a phone by people new to the brand.', TRAFFIC_NAMED),
    q('one_action', 'What is the one thing a visitor should do on this page: buy, sign up, book or enquire?', 'The main action your site already uses for this product.', ACTION_NAMED),
    q('proof', 'What proof can the page use, and where does each one live: reviews, ratings, numbers, press or guarantees?', 'Only proof already published on your site, each with its source.'),
    q('offer', 'Is there an offer to lead with (discount, bundle, free shipping, trial), and when does it end?', 'No special offer: the live price and delivery terms from your site.', OFFER_NAMED),
    q('keep', 'What must stay as it is: menu, footer, checkout, wording or claims?', 'Your menu, footer, fonts and colours stay as they are.'),
  ],
  ad_creative: [
    q('offer', 'What is the offer in these ads: a price, a discount, a bundle or none? Any end date?', 'No discount: the live price with the strongest true benefit.', OFFER_NAMED),
    q('audience', 'Who are the ads for: new buyers, past visitors or past customers? Describe the buyer in one line.', 'New buyers who have not heard of the brand.', AUDIENCE_NAMED),
    q('placements', 'Where will they run, and in which sizes: feed (4:5 or 1:1), stories and reels (9:16), or elsewhere?', 'Meta feed at 4:5 and stories at 9:16, as still images.', PLACEMENT_NAMED),
    q('tried', 'What have you already run, and which ads worked or flopped (with numbers if you have them)?', 'Nothing known: every angle counts as untested, so the concepts spread wide.', TRIED_NAMED),
  ],
  email: [
    q('list_trigger', 'Who gets these emails, and what sets them off: a sign-up, a first order, a lapsed customer or a send to the whole list?', 'New subscribers, starting right after they sign up.', TRIGGER_NAMED),
    q('offer_rules', 'What may the emails offer, and what is off limits: discount codes, free shipping, how often you discount?', 'No new discount: only offers already live on your site.', OFFER_NAMED),
    q('reader_action', 'What should a reader do after each email: buy, browse, reply or leave a review?', 'Click through to the product or collection the email shows.'),
    q('sender', 'Which email tool sends them, and are they from the brand or a named person?', 'From the brand, as plain text and HTML you can paste into any email tool.', /\b(?:klaviyo|mailchimp|shopify email|omnisend|brevo|convertkit|hubspot|activecampaign|beehiiv|substack)\b/i),
  ],
  copy: [
    q('where_used', 'Where will this copy appear, and how long should it be?', 'The same place and length as the copy it replaces.'),
    q('reader_action', 'Who reads it, and what should they do next?', 'A first-time visitor who should take your site\'s main action.'),
    q('proof', 'What proof can it use: reviews, numbers, press or guarantees?', 'Only proof already published on your site, each with its source.'),
    q('never_say', 'Are there words, claims or topics to avoid?', 'No claim beyond what your site already says.'),
  ],
  audit: [
    q('goal_metric', 'Which number should this audit help move, and what is it today?', 'The rate at which visitors take the main action. With no figure, fixes are ranked by likely effect.', METRIC_NAMED),
    q('access', 'What can be looked at: only the live page or account view, or also analytics, ad data, heatmaps or recordings (read only)?', 'Only what is public, checked on a phone and a desktop.', ACCESS_NAMED),
    q('changed', 'What changed lately: traffic, price, offer, design or tracking?', 'Nothing known has changed.'),
    q('use', 'What will you do with the result, and by when: fix it yourself, brief a developer or decide on a rebuild?', 'A ranked fix list you can hand to whoever edits it.', DEADLINE_NAMED),
  ],
  analysis: [
    q('decision', 'What decision does this analysis feed, and by when?', 'What to do next about the question in the request.', DEADLINE_NAMED),
    q('data', 'Which data can be used, and for which dates?', 'Only the files or exports shared in this chat.', ACCESS_NAMED),
    q('normal', 'What is a normal value for the main number?', 'Unknown: the earliest period in the data is the baseline.'),
    q('changed', 'What changed around the time the numbers moved: spend, price, offer, tracking or season?', 'Nothing known has changed.'),
  ],
  strategy: [
    q('goal', 'What result, by when, would make this worth doing?', 'The goal as written in the request, within 90 days.', DEADLINE_NAMED),
    q('resources', 'What budget, people and time can go into it?', 'The team and budget you have now: no new hires and no extra spend.'),
    q('fixed', 'What is fixed and cannot change: price, channels, brand or markets?', 'Nothing is fixed beyond the facts on your site.'),
    q('tried', 'What have you tried already, and how did it go?', 'Nothing known: no option is ruled out.'),
  ],
  code: [
    q('system', 'Where does this live: which repo, platform, language and version?', 'The stack already used in the files you shared.', STACK_NAMED),
    q('done', 'How will you check that it works?', 'The existing tests pass, and the new behaviour is shown working once.'),
    q('keep', 'What must not change or break?', 'Public behaviour and stored data stay as they are.'),
    q('run', 'Should the change only be written, or also run or deployed?', 'Written and tested locally. You deploy.'),
  ],
  ops_doc: [
    q('reader', 'Who will follow this, and what do they already know?', 'A new team member in their first week.'),
    q('today', 'How is it done today, and where does it go wrong?', 'There is no written process yet, so this is the first version.'),
    q('tools', 'Which tools does the process use?', 'The tools named in the request, and no others.'),
    q('owner', 'Who owns the process and signs off changes?', 'The person who asked for it.'),
  ],
  other: [
    q('result', 'What do you want to have at the end, and in what format?', 'One finished piece in the format the request names.'),
    q('use', 'Who will use it, and for what?', 'You, to act on it yourself.'),
    q('keep', 'What must it not do or change?', 'Nothing beyond what the request asks for.'),
  ],
});
// A plan is asked the same things as a strategy.
const KIND_ALIAS = Object.freeze({ plan: 'strategy' });
// When a caller knows only the rubric family, use its most common kind.
const KIND_BY_FAMILY = Object.freeze({ web_page: 'web_page', ad_creative: 'ad_creative', copy_email: 'copy', audit_analysis: 'audit', strategy_plan: 'strategy', code_ops_other: 'other' });

export const MAX_INTAKE_QUESTIONS = 4;
export const INTAKE_KINDS = Object.freeze(Object.keys(QUESTIONS));
/** How to put the questions to the client. One message, never a form per question. */
export const INTAKE_ASK = 'Ask these in one short message. Each has a default: if the client skips one or says "you decide", use its default and say so in one line.';
/** The brief from grounding.mjs still lists its own TASTE questions. Until it is built from intakeQuestions, the reply
 *  that carries both says which set to ask. Drop this note once the brief no longer has a TASTE line. */
export const INTAKE_NOTE = `${INTAKE_ASK} Ask these instead of any TASTE questions in the brief.`;

/**
 * The questions to ask before this job starts.
 * @param {{ deliverableKind?: string, family?: string, request?: string }} [job]
 * @returns {{ id: string, question: string, default: string }[]} at most four, in the order to ask them
 */
export function intakeQuestions({ deliverableKind, family, request = '' } = {}) {
  const named = KIND_ALIAS[deliverableKind] ?? deliverableKind;
  const kind = Object.hasOwn(QUESTIONS, named) ? named : KIND_BY_FAMILY[family] ?? 'other';
  const words = String(request ?? '');
  return QUESTIONS[kind].filter(row => !(row.answered && row.answered.test(words))).slice(0, MAX_INTAKE_QUESTIONS).map(row => ({ id: row.id, question: row.question, default: row.default }));
}
