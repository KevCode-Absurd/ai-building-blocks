// Model-free routing. The host confirms the family and depth against the brief.
import { QUALITY_PROFILES } from './quality-profiles.mjs';

export const QUALITY_ENGINE_VERSION = '3.3';
const BASE = 'https://agents.useaiblocks.com/tools/quality/';
// Checked in order, specific before general: every card in cards/INDEX.md is reachable. The words follow INDEX.md and
// the plain names people use in briefs ("going viral", "ticket types", "interview scorecard").
const matches = [
  ['claims-review', /claims? (?:review|audit|check)|regulatory claims|(?:fda|ftc|asa)\b[^.]{0,40}\b(?:risk|claims?)|claims? substantiation|marketing compliance/i],
  ['crisis-response', /crisis|holding statement|press (?:reply|statement|inquiry|enquiry)|statement (?:we'?ll |to )?send|\breporter\b|going viral|public apology|recall notice|breach notice|outage update/i],
  ['review-replies', /review repl|repl(?:y|ies|ying) to (?:a |the |this |that |our )?(?:\w+ )?reviews?|respon(?:d|se|ses|ding) to (?:a |the |this |that )?(?:\w+ )?reviews?|\b(?:g2|trustpilot|yelp|app store|google) reviews?\b|negative review|angry customer|public reply/i],
  ['support-macros', /support macros?|\bmacros?\b|canned (?:responses?|replies)|saved replies|reply templates|help ?desk|customer support repl|ticket types?|chat scripts?/i],
  ['notification-copy', /push notifications?|\bpush (?:messages?|copy|lines?|alerts?)|in-app (?:messages?|copy|banners?|prompts?)|\bsms\b|text messages?|microcopy|\bui (?:copy|strings?|text|handoff)|(?:error|button|empty.state|tooltip) (?:copy|text|strings?|messages?)|streak reminders?/i],
  ['product-announcement', /release notes|changelog|product announcement|launch announcement|feature announcement|press release|news release|launch (?:email|post|blog)/i],
  ['launch-plan', /launch plan|go-to-market|\bgtm\b|rollout plan|launch calendar|release plan/i],
  ['experiment-design', /pric(?:e|ing) test|experiment|a\/b test|split test|holdout|test(?:ing)? the price|\bpilot\b/i],
  ['pricing', /pricing(?! pages?)|price (?:change|increase|rise|point|recommendation)|menu price|rais(?:e|ing) (?:the |our )?(?:\w+ ){0,3}price|rate card|discount rules|good.better.best/i],
  ['competitor-analysis', /competitor|competitive|battlecard|\bswot\b|market landscape/i],
  ['job-description', /job (?:description|post(?:ing)?|ad|advert|listing)|(?:hiring|interview) scorecard|role description|vacancy/i],
  ['creator-brief', /creator brief|influencer brief|ugc brief|brief (?:we send )?(?:to|for) (?:the |our )?(?:\w+ )?(?:creators|influencers)|creator campaign|ambassador brief|gifting brief/i],
  ['outbound-sales', /outbound|cold (?:e-?mails?|outreach|call)|sales (?:e-?mails?|sequence|cadence)|prospecting/i],
  ['partnership-pitch', /partnership (?:pitch|proposal)|partner proposal|co-marketing|reseller|referral pitch|channel partner|alliance proposal/i],
  ['sales-pitch', /sales (?:deck|pitch|presentation|proposal)|sell sheet|one-pager|one.page pitch|buyer pitch|retail pitch|line review|pitch (?:to|for) (?:a |the )?(?:\w+ )?buyer/i],
  ['onboarding-flow', /onboarding (?:flow|emails?|sequence|journey|checklist)|first-run|activation flow|getting.started journey/i],
  ['lifecycle-email', /welcome|win.?back|e-?mail (?:series|sequence|flow)|lifecycle|re-?engagement|abandoned cart|post-purchase|reorder|retention e-?mails?/i],
  ['landing-page', /landing page|web ?page|website|sales page|product page|signup page|sign-up page|waitlist page/i],
  ['webinar-script', /webinar|talk track|workshop script|live session|virtual event/i],
  ['help-docs', /help[- ]?(?:cent(?:er|re)|guide|doc|article)|knowledge base|\bfaqs?\b|how.to guide|user guide|getting started guide|troubleshooting (?:article|guide)/i],
  ['research-design', /survey|research (?:design|plan)|diary study|interview guide|usability (?:test|study)|discovery plan|study protocol|focus group|facilitator guide/i],
  ['investor-update', /(?:leadership|investor|board|shareholder|stakeholder|founder|lender) (?:update|report|letter)|quarterly (?:update|letter)|monthly update/i],
  ['social-calendar', /social (?:media )?(?:calendar|plan)|content calendar|posting schedule|post schedule/i],
  ['seo-article', /blog post|\bseo\b|\barticle\b|pillar page|long-form guide/i],
  ['paid-social-ads', /\bads?\b|ad campaign|paid social|ad concepts?|ad copy|ad creative/i],
];

// People often open with who they are ("I run marketing at Grüns.") or the situation, and ask afterwards. Read as the
// job, "run" in "I run marketing" sent ad requests to a store agent. The ask is the first sentence that asks for
// something, through to the end; a bare "Write them." keeps the sentence before it.
const ASK_START = /^\s*(?:(?:please|now|so|then|next|also),?\s+)?(?:write|draft|build|create|make|design|prepare|compare|review|audit|plan|put together|develop|synthesi[sz]e|analy[sz]e|help|give|produce|turn|use|summari[sz]e|translate|rewrite|fix|set up|generate|outline|map out|list|suggest|recommend|propose|find|research|test|check|decide|estimate|calculate|explain|edit|improve|update|tell|show|deliver|assess|evaluate|diagnose|identify|rank|code|name|come up with|develop|turn)\b/i;
const ASK_ANYWHERE = /\b(?:i|we)(?:'d| would)? (?:need|want|like) (?!to know\b)|\b(?:need|want|would like|'d like)\s+(?:a|an|the|to|some|you|our|my|help|\d+)\b|\bhelp me\b|\b(?:can|could|would) you\b|\bplease\b/i;
const SENTENCES = /(?<=[.!?])\s+(?=[A-Z'"‘“(])|\n+/;
export function askOf(request = '') {
  const text = String(request ?? '').trim();
  const sentences = text.split(SENTENCES).filter(s => s.trim());
  let at = sentences.findIndex(s => ASK_START.test(s) || ASK_ANYWHERE.test(s));
  if (at <= 0) return text;
  if ((sentences[at].match(/[a-z0-9]+/gi) ?? []).length < 10) at -= 1;
  return sentences.slice(at).join(' ');
}

/** The quality card for a request: the first card whose words appear in the ask (else the whole request), else the
 *  deliverable kind's card, else _any. */
export function qualityFamily(request = '', kind = 'other') {
  const text = String(request), ask = askOf(text);
  const fallback = { web_page: 'landing-page', ad_creative: 'paid-social-ads', email: 'lifecycle-email' };
  const match = value => matches.find(([, pattern]) => pattern.test(value))?.[0];
  return match(ask) ?? (ask === text ? undefined : match(text)) ?? fallback[kind] ?? '_any';
}

/** A page with ads or emails: separate writing disciplines own separate deliverables, so no single card leads. */
export const isMixedRequest = request => /(?:page|website).*(?:and|plus|,).*(?:ads|e-?mails?)|(?:ads|e-?mails?).*(?:and|plus|,).*(?:page|website)/i.test(String(request));

export function qualityEngineContext(request = '', kind = 'other') {
  const text = String(request);
  const family = qualityFamily(text, kind);
  const profile = QUALITY_PROFILES[family] ?? QUALITY_PROFILES._any;
  // A reviewer's discipline never creates a second writing role.
  const mixed = isMixedRequest(text);
  const light = /reply|short email|push notification|support macro|social post/i.test(text) && !/plan|series|guide|policy|analysis/i.test(text);
  const full = /(?:distinct|alternative|different|three|3) (?:concepts|directions|structures)/i.test(text);
  const depth = mixed ? 'team' : light ? 'light' : full ? 'full' : 'standard';
  return {
    version: QUALITY_ENGINE_VERSION, family, depth, status: 'SUGGESTED_CONFIRM_AGAINST_BRIEF',
    depth_reason: mixed ? 'Different writing disciplines own separate deliverables.' : light ? 'A short piece in one voice.' : full ? 'The request rewards distinct concepts.' : 'One expert owns the working deliverable.',
    profile, intake: { question_limit: 3, rule: 'Ask once for costly unknowns only; use captured facts and the supplied defaults for the rest.' }, method_url: BASE + 'QUALITY-ENGINE-v3.md', checker_url: BASE + 'CHECKER-v3.md',
    card_url: BASE + 'cards/' + family + '.md', profiles_url: BASE + 'profiles.json',
    routing_url: BASE + 'ROUTING.md',
    drafts: depth === 'full' ? ['expert', 'plain', 'creative'] : depth === 'team' ? ['specialist parts integrated by lead', 'plain'] : ['expert', 'plain'],
    checks: ['family must-haves', 'core design choice', 'clarity and reading level', 'dated claim sources', 'arithmetic and working links', 'visual inspection when applicable', 'hand-over leaks', 'fresh anonymous final choice with a native-piece clarity floor'],
    tool_urls: Object.fromEntries(['wordcount', 'readability', 'proof', 'render', 'leakcheck', 'check-format'].map(name => [name, BASE + name + '.cjs'])),
    precedence: 'Task and brand first. This method governs draft depth and family length; existing truth, access and delivery gates still apply. No library search at job time. A same-context review is never independent.',
    length: 'The family ceiling is a cap, never a target. The brief can ask for more. Keep directly used customer copy no longer than the plain version.',
    learning: 'Only opted-in feedback proposes scoped changes. No feedback is stored by this response. Blind evaluation decides method changes.',
    final_choice: { fresh_context: true, clarity_below_plain: 'VETO', material_usefulness_below_plain: 'VETO', edit_base: 'Correct useful content of the fresh plain draft; preserve action and evidence coverage while improving structure.', expert_edge: 'Before editing, list up to 3 edge items specific to this client: a current fact that changes the work, a card must-have plain misses, a card failure plain commits, or a ready-to-use piece the reader would otherwise build. Build them in within the family aim. General advice and caveats are not edge items.', tie: 'EXPERT_IF_VERIFIED_EDGE: on equal clarity and usefulness, choose the candidate whose edge items the fresh reader confirms; ship plain unchanged only when none survives.', requested_artifact_first: true, requested_template_fields: 'PRESERVE', no_fresh_reader: 'Plain base plus its verified edge items and necessary repairs; disclose SAME-CONTEXT.' },
    assurance: 'Guidance and host-reported checks do not prove semantic quality, independent review, customer acceptance or business results.',
  };
}
