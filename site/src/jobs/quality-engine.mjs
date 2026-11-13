// Model-free routing. The host confirms the family and depth against the brief.
import { QUALITY_PROFILES } from './quality-profiles.mjs';
import { cardShape, jobShape, shortWordLimit } from './card-shapes.mjs';

export const QUALITY_ENGINE_VERSION = '3.4';
const BASE = 'https://agents.useaiblocks.com/tools/quality/';
// Checked in order, specific before general: every card in cards/INDEX.md is reachable. The words follow INDEX.md and
// the plain names people use in briefs ("going viral", "ticket types", "interview scorecard").
// 13 Nov 2026: a press pitch to a reporter went to the crisis card, a status-page update and an RFP answer matched no
// card, and an all-hands policy announcement got the help-docs card. The cards added that day come before the general
// ones that used to catch them; a pitch about a crisis is still crisis work.
const PITCH_TARGET = String.raw`(?:journalists?|reporters?|editors?|writers?|producers?|columnists?|correspondents?|bloggers?|the press|press|media|outlets?|publications?|newsletters?|podcast hosts?|hosts?)`;
const matches = [
  ['claims-review', /claims? (?:review|audit|check)|regulatory claims|(?:fda|ftc|asa)\b[^.]{0,40}\b(?:risk|claims?)|claims? substantiation|marketing compliance/i],
  ['press-pitch', new RegExp(String.raw`^(?![\s\S]*\b(?:crisis|recall|breach|outage|going viral|apolog\w*|holding statement|backlash|lawsuit|scandal)\b)[\s\S]*(?:\b(?:press|media|story|feature|exclusive|podcast guest) pitch(?:es)?\b|\bpitch(?:ing)?(?: (?:e-?mails?|notes?|letters?|messages?))?(?:, [^,.;]{1,40},)? (?:to|for) (?:a |an |the |our |some |these |\d+ |two |three |five )?(?:[\w'’-]+ ){0,3}${PITCH_TARGET}\b|\bpitch (?:(?:me|us|our [\w-]+|[\w-]+) )?(?:as an? (?:guest|expert|source) )?(?:to|for|on) (?:a |the |\d+ |two |three |five )?(?:[\w-]+ ){0,2}podcasts?\b|\b${PITCH_TARGET} pitch(?:es)?\b|\b(?:media|press|journalist) outreach\b|\bpitch (?:(?:a|the|our|this) )?(?:story|feature|exclusive)\b)`, 'i')],
  ['crisis-response', /crisis|holding statement|press (?:reply|statement|inquiry|enquiry)|statement (?:we'?ll |to )?send|\breporter\b|going viral|public apology|recall notice|breach notice|outage update|status[- ]page|incident (?:update|statement|notice|message|comms|communications?|e-?mail|post|summary)|(?:outage|downtime|disruption|service) (?:updates?|notices?|messages?|statements?|e-?mails?|posts?|alerts?)|(?:update|notice|message|statement|post|e-?mail|note) (?:\w+ ){0,3}(?:on|about|for) (?:the |an? |our |this |today'?s |yesterday'?s |last night'?s |this morning'?s )?(?:[\w-]+ ){0,2}(?:outage|incident|downtime|disruption)\b|degraded (?:performance|service)/i],
  ['internal-announcement', /all[- ]hands (?:announcement|e-?mail|note|message|post|memo|update|script)|announc\w* (?:[\w-]+ ){0,6}(?:at|in|to|for|with) (?:the |our |all |tomorrow'?s |this week'?s |next week'?s |friday'?s |monday'?s )?(?:all[- ]hands|all[- ]staff|whole company|company|staff|employees|team meeting|town ?hall)\b|internal (?:announcements?|memos?|comms|communications?)|(?:company[- ]wide|all[- ]staff|staff|employee|org[- ]wide|team[- ]wide) (?:announcements?|memos?|notes?|e-?mails?|messages?|posts?|updates?|comms)|(?:announcement|memo|note|e-?mail|message|post) to (?:all |the whole |our |the )?(?:staff|employees|company|team|everyone)\b|town ?hall (?:announcement|e-?mail|note|script)|announc\w* (?:[\w-]+ ){0,4}(?:reorg|re-?organi[sz]ation|restructur\w*|layoffs?|new (?:ceo|cto|cfo|leader|head|benefits?|office))|(?:reorg|re-?organi[sz]ation|change|policy change) (?:announcements?|notices?|e-?mails?|memos?)|leadership memos?/i],
  ['review-replies', /review repl|repl(?:y|ies|ying) to (?:a |the |this |that |our )?(?:\w+ )?reviews?|respon(?:d|se|ses|ding) to (?:a |the |this |that )?(?:\w+ )?reviews?|\b(?:g2|trustpilot|yelp|app store|google) reviews?\b|negative review|angry customer|public reply/i],
  ['rfp-response', /\brf[piq]s?\b|requests? for (?:proposals?|information|quotes?|quotations?)|invitations? to tender|(?:a|the|this|their|our|council'?s|public|government|city|state) tenders?\b|\btender (?:responses?|submissions?|documents?|questions?|packs?)|bid (?:responses?|submissions?|documents?)|security questionnaires?|vendor (?:security |risk )?questionnaires?|due diligence questionnaires?|\bddqs?\b|procurement questionnaires?/i],
  ['sop', /\bsops?\b|standard operating procedures?|operating procedures?|step[- ]by[- ]step (?:procedures?|process|instructions?)|(?:write|draft|document|create|build|prepare|make) (?:the |a |an |our |my )?(?:[\w-]+ ){0,4}(?:procedures?|runbooks?)\b|\brunbooks?\b|work instructions?|process (?:docs?|documents?|documentation|guides?|manuals?)|operations manual/i],
  ['support-macros', /(?:customer|subscriber|guest|member|shopper|client|buyer|user) (?:who )?(?:emailed|e-mailed|wrote in|wrote to us|messaged|complained)|(?:e-?mail|ticket|chat) repl(?:y|ies) to (?:a |an |the |this |her |his |their )?(?:customer|subscriber|guest|member|shopper|complaint)|write (?:my|our|a|the) (?:e-?mail )?reply|support macros?|\bmacros?\b|canned (?:responses?|replies)|saved replies|reply templates|help ?desk|customer support repl|ticket types?|chat scripts?/i],
  ['notification-copy', /push notifications?|\bpush (?:messages?|copy|lines?|alerts?)|in-app (?:messages?|copy|banners?|prompts?)|\bsms\b|text messages?|microcopy|\bui (?:copy|strings?|text|handoff)|(?:error|button|empty.state|tooltip) (?:copy|text|strings?|messages?)|streak reminders?/i],
  // A brief for translators; translating push or UI strings themselves stays notification copy, above.
  ['localisation-brief', /locali[sz]ation (?:briefs?|plans?|guides?|style guides?|kits?|handoffs?|notes|checklists?|requirements)|(?:translation|translator|transcreation) (?:briefs?|guides?|style guides?|kits?|instructions|notes|handoffs?)|\btranscreation\b|brief (?:\w+ ){0,2}(?:for|to) (?:the |our |an? )?(?:\w+ )?(?:translators?|translation (?:agency|team|vendor|partner)|locali[sz]ation (?:agency|team|vendor|partner))|glossary (?:handoff|for (?:the |our )?translators?)|locale guides?/i],
  // The policy itself: rules people or agents apply. A guide, reply or memo about a policy keeps its own card.
  ['policy-doc', /(?:write|draft|create|prepare|rewrite|put together|set out|define) (?:the |a |an |our |my |new |clear )?(?:(?!(?:for|to|on|about|of|with|under|in|that|which|and)\b)[\w-]+ ){0,4}(?:polic(?:y|ies)|decision rules|approval rules|guardrails)\b(?! (?:pages?|announcements?|changes?|sections?|faqs?|summary|e-?mails?|notices?))|\b(?:hr|people|workplace|internal|company|staff|operating|approval|acceptable use) polic(?:y|ies)\b(?! (?:pages?|announcements?|changes?|faqs?|e-?mails?|notices?))|(?:employee|staff) handbook|handbook (?:sections?|policy|chapters?)|code of conduct|(?:decision|approval|escalation) rules (?:for|that) (?:our |the )?(?:\w+ )?(?:agents?|staff|team|reps?)|(?:agent|staff) (?:rules|guidelines)|\b(?:exception|escalation|approval|goodwill|refund|returns?) polic(?:y|ies) (?:that |which )?(?:agents?|staff|they|reps?|(?:the |our )?team) (?:can|should|must|will) (?:apply|use|follow)\b|guardrails for (?:\w+ )?agents?|rules of engagement/i],
  ['audio-ad-script', /(?:radio|podcast|audio|streaming audio|spotify|host[- ]read|pre[- ]roll|mid[- ]roll|sponsor(?:ship)?) (?:ad )?(?:ads?|spots?|scripts?|reads?|commercials?)\b|\bhost[- ]read\b|\bradio spots?\b|\b(?:sponsor|ad) reads?\b|\baudio ads?\b/i],
  ['product-announcement', /release notes|changelog|product announcement|launch announcement|feature announcement|press release|news release|launch (?:email|post|blog)/i],
  ['launch-plan', /launch plan|go-to-market|\bgtm\b|rollout plan|launch calendar|release plan/i],
  // FAQs for a pricing or plans page are help content, not pricing work or a page build.
  ['help-docs', /\bfaqs?\b[^.]{0,40}\b(?:pricing|plans?|billing|checkout|product) pages?\b|\b(?:pricing|plans?|billing) (?:page )?faqs?\b/i],
  ['experiment-design', /pric(?:e|ing) test|experiment|a\/b test|split test|holdout|test(?:ing)? the price|\bpilot\b/i],
  ['pricing', /pricing(?! pages?)|price (?:change|increase|rise|point|recommendation)|menu price|rais(?:e|ing) (?:the |our )?(?:\w+ ){0,3}price|rate card|discount rules|good.better.best/i],
  ['competitor-analysis', /competitor|competitive|battlecard|\bswot\b|market landscape/i],
  ['job-description', /job (?:description|post(?:ing)?|ad|advert|listing)|(?:hiring|candidate|job|final|structured|panel|behaviou?ral|on-?site)(?: [\w-]+)? interview(?! (?:with|of) (?:customers?|users?|guests?|buyers?))|interview (?:kit|loop)|interview (?:guide|questions|plan)[^.]{0,40}\b(?:hir(?:e|ing)|candidates?|role|position|vacancy)\b|\bhir(?:e|ing)\b[^.]{0,60}interview (?:guide|questions|plan)|(?:hiring|interview) scorecard|role description|vacancy/i],
  // After hiring: a weighted scorecard for candidates is interview work, one for vendors is a buying decision.
  ['vendor-scorecard', /\b(?:vendor|supplier|provider|tool|software|platform|saas|crm|erp|agency|bid) (?:scorecards?|comparisons?|evaluations?|selection|shortlists?|assessments?|scoring|matri(?:x|ces))\b|\b(?:compare|comparing|evaluate|evaluating|score|scoring|rank|ranking|choose between|pick between) (?:the |our |these |those |\d+ |two |three |four |five |six )?(?:[\w-]+ ){0,3}(?:vendors|suppliers|providers|quotes|bids|tenders)\b|\bcomparison of (?:the |our |these )?(?:[\w-]+ ){0,3}(?:vendors|suppliers|providers|quotes|bids)\b|\b(?:weighted|evaluation|decision|selection) (?:scorecard|scoring matrix|matrix)\b|\bscorecard (?:to|for) (?:compar\w+|choos\w+|pick\w*|select\w*|evaluat\w+)\b|\bsoftware selection\b/i],
  ['creator-brief', /creator brief|influencer brief|ugc brief|brief (?:we send )?(?:to|for) (?:the |our )?(?:\w+ )?(?:creators|influencers)|creator campaign|ambassador brief|gifting brief/i],
  ['creative-brief', /creative brief|agency brief|campaign brief|design brief|brief (?:for|to) (?:our |the |an? )?(?:creative |ad |design )?agency/i],
  ['outbound-sales', /outbound|first[- ]touch|introductory e-?mail|(?:met|meeting) (?:\w+ ){0,5}at (?:a |the |last month's )?(?:trade ?show|conference|expo)|cold (?:e-?mails?|outreach|call)|sales (?:e-?mails?|sequence|cadence)|prospecting/i],
  ['partnership-pitch', /partnership (?:pitch|proposal)|partner proposal|co-marketing|reseller|referral pitch|channel partner|alliance proposal/i],
  ['sales-pitch', /sales (?:deck|pitch|presentation|proposal)|sell sheet|one-pager|one.page pitch|buyer pitch|retail pitch|line review|pitch (?:to|for) (?:a |the )?(?:\w+ )?buyer/i],
  // The words that describe one product; a whole product page build stays landing-page work below.
  ['product-description', /\bproduct (?:detail )?(?:page )?descriptions?\b|\bproduct detail pages?\b|\bpdps?\b|\bproduct (?:listing )?copy\b|\b(?:amazon|etsy|ebay|walmart|marketplace|product|item) listings?\b(?! (?:fees?|ads?|ranking))|\bitem descriptions?\b|\bcatalogue copy\b|\bcatalog copy\b|\bproduct (?:titles?|bullets?)\b/i],
  ['onboarding-flow',/onboarding (?:flow|emails?|sequence|journey|checklist)|first-run|activation flow|getting.started journey/i],
  ['lifecycle-email', /welcome|win.?back|e-?mail (?:series|sequence|flow)|lifecycle|re-?engagement|abandoned cart|post-purchase|reorder|retention e-?mails?/i],
  ['landing-page', /landing page|web ?page|website|sales page|product page|signup page|sign-up page|waitlist page/i],
  ['webinar-script', /webinar|talk track|workshop script|live session|virtual event/i],
  ['help-docs', /help[- ]?(?:cent(?:er|re)|guide|doc|article)|knowledge base|\bfaqs?\b|how.to guide|user guide|getting started guide|troubleshooting (?:article|guide)/i],
  ['research-design', /survey|research (?:design|plan)|diary study|interview guide|usability (?:test|study)|discovery plan|study protocol|focus group|facilitator guide/i],
  ['investor-update', /(?:leadership|investor|board|shareholder|stakeholder|founder|lender) (?:update|report|letter)|quarterly (?:update|letter)|monthly update|\bupdate (?:for|to) (?:our |the |all |my )?(?:investors|board|shareholders|stakeholders|lenders)\b/i],
  ['analysis-memo', /(?:analysis|decision|recommendation|options|strategy|finance|board) (?:memo|paper|note)|business case|root.cause analysis|churn analysis|unit economics|memo (?:on|about) (?:why|whether|how)/i],
  ['social-calendar', /social (?:media )?(?:calendar|plan)|content calendar|posting schedule|post schedule/i],
  ['seo-article', /blog post|\bseo\b|\barticle\b|pillar page|long-form guide/i],
  ['paid-social-ads', /\bads?\b|ad campaign|paid social|ad concepts?|ad copy|ad creative/i],
];

// People often open with who they are ("I run marketing at Grüns.") or the situation, and ask afterwards. Read as the
// job, "run" in "I run marketing" sent ad requests to a store agent. The ask is the first sentence that asks for
// something, through to the end; a bare "Write them." keeps the sentence before it.
// The sentence that names the deliverable: the first that asks, plus the one before it when a short ask leans on it.
export function askHead(ask = '') {
  const sentences = String(ask).split(SENTENCES).filter(s => s.trim());
  const at = sentences.findIndex(s => ASK_START.test(s) || ASK_ANYWHERE.test(s));
  return sentences.slice(0, Math.max(at, 0) + 1).join(' ');
}
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

/** The quality card for a request: the first card whose words appear in the sentence that names the deliverable, else
 *  in the rest of the ask, else in the whole request, else the deliverable kind's card, else _any. "Write an analysis
 *  memo ... Cover ... an experiment to test each" is an analysis memo, not an experiment design. */
export function qualityFamily(request = '', kind = 'other') {
  const text = String(request), ask = askOf(text);
  const fallback = { web_page: 'landing-page', ad_creative: 'paid-social-ads', email: 'lifecycle-email' };
  const match = value => matches.find(([, pattern]) => pattern.test(value))?.[0];
  return match(askHead(ask)) ?? match(ask) ?? (ask === text ? undefined : match(text)) ?? fallback[kind] ?? '_any';
}

/** A page with ads or emails: separate writing disciplines own separate deliverables, so no single card leads. */
// A web page counts, not "a one-page brief" or "her account page"; an email counts, not "she emailed us".
const WEB_PAGE = String.raw`(?:\b(?:landing|web|home|sales|product|signup|sign-up|pricing|lead|squeeze)[ -]?pages?\b|\bwebsites?\b|(?<!\b(?:one|two|single|half|account|settings|profile|status|order|\d+)[ -])\bpages?\b)`;
const ADS_OR_EMAILS = String.raw`(?:\bads?\b|\be-?mails?\b(?! (?:us|me|them|her|him)\b))`;
const MIXED = new RegExp(`${WEB_PAGE}.*(?:and|plus|,).*${ADS_OR_EMAILS}|${ADS_OR_EMAILS}.*(?:and|plus|,).*${WEB_PAGE}`, 'i');
export const isMixedRequest = request => MIXED.test(String(request));

// Words that add a separate deliverable to a document ("a creative brief, plus 3 Meta ads"), rather than list its subject
// ("Channels: a landing page, Meta ads and email").
const WORK_NOUN = String.raw`(?:ads?|adverts?|creatives?|e-?mails?|newsletters?|pages?|websites?|sites?|posts?|videos?|scripts?|images?|banners?|decks?)`;
const EXTRA_WORK = new RegExp(String.raw`\b(?:plus|as well as|along with|together with|and also|in addition to)\b[^.;:]{0,60}?\b${WORK_NOUN}\b|\b(?:and|also|then)\s+(?:also\s+)?(?:write|make|build|design|create|draft|produce)\b`, 'i');
/** A brief, memo or plan whose channels are its subject: one document for one lead, not mixed work. The router and the
 *  quality depth both use this, so a document kept single is never given team depth. */
export function documentAboutChannels(request = '', family = qualityFamily(request)) {
  const ask = askOf(String(request ?? ''));
  return Boolean(cardShape(family, ask)?.document) && !EXTRA_WORK.test(ask);
}

// The head asks for a plan, series, guide or policy itself, not a reply that mentions one.
const ASKS_FOR_DOCUMENT = /\b(?:write|draft|create|build|make|prepare|produce|need|want|rewrite|update)\s+(?:(?:a|an|the|our|my|new|up)\s+)?(?:[\w'-]+\s+){0,3}?(?:plans?|series|sequences?|guides?|polic(?:y|ies)|playbooks?|analysis|macros|sop)\b/i;

/** kind: the job's deliverable kind. A card's shape applies only to the kinds it names; with no kind it applies. */
export function qualityEngineContext(request = '', kind) {
  const text = String(request);
  const family = qualityFamily(text, kind ?? 'other');
  const profile = QUALITY_PROFILES[family] ?? QUALITY_PROFILES._any;
  // A reviewer's discipline never creates a second writing role. A document about several channels is one lead's job.
  const mixed = isMixedRequest(text) && !documentAboutChannels(text, family);
  // Light is decided on the ask, not the whole request: "assume our policy is ..." in a later sentence does not make a
  // 180-word reply a policy document. The card, a short word limit or the old short-piece words make it light. A card
  // that is light (a reply, a first-touch email) stays light when the reply mentions a policy or a refund; only a head
  // that asks for a plan, series, guide or policy itself is not light.
  const ask = askOf(text), head = askHead(ask), shape = jobShape(family, ask, kind);
  // An audit or analysis is never a short piece in one voice, even of "reply rates".
  const light = shape?.light ? !ASKS_FOR_DOCUMENT.test(head)
    : kind !== 'audit' && kind !== 'analysis' && (/reply|short email|push notification|support macro|social post/i.test(head) || shortWordLimit(ask))
      && !/\b(?:plans?|series|sequences?|guides?|policy|policies|playbooks?|analysis|macros|sop)\b/i.test(head);
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
    // One command runs every applicable text check and prints one short report; the scripts it calls sit beside it.
    tool_urls: { 'qe-check': BASE + 'qe-check.cjs', base: BASE, files: ['qe-check.cjs', 'wordcount.cjs', 'readability.cjs', 'proof.cjs', 'leakcheck.cjs', 'check-format.cjs', 'render.cjs', 'check-logo-contrast.cjs'] },
    check_command: 'node tools/quality/qe-check.cjs <final> --plain <plain> --audience <consumer|business|specialist> [--sources <facts files>] [--max-words <n> | --contract <contract.json>]',
    precedence: 'Task and brand first. This method governs draft depth and family length; existing truth, access and delivery gates still apply. No library search at job time. A same-context review is never independent.',
    length: 'The family ceiling is a cap, never a target. The brief can ask for more. Keep directly used customer copy no longer than the plain version.',
    learning: 'Only opted-in feedback proposes scoped changes. No feedback is stored by this response. Blind evaluation decides method changes.',
    ...(shape?.scope_note ? { scope_note: shape.scope_note } : {}),
    reviewers: depth === 'light' || depth === 'standard' ? 'One fresh final reader does the checker gates and the final choice.' : 'A fresh checker on the drafts, then a fresh final reader.',
    final_choice: { fresh_context: true, clarity_below_plain: 'VETO', material_usefulness_below_plain: 'VETO', edit_base: 'Correct useful content of the fresh plain draft; preserve action and evidence coverage while improving structure.', expert_edge: 'Before editing, list up to 3 edge items specific to this client: a current fact that changes the work, a card must-have plain misses, a card failure plain commits, or a ready-to-use piece the reader would otherwise build. Build them in within the family aim. General advice and caveats are not edge items.', tie: 'EXPERT_IF_VERIFIED_EDGE: on equal clarity and usefulness, choose the candidate whose edge items the fresh reader confirms; ship plain unchanged only when none survives.', requested_artifact_first: true, requested_template_fields: 'PRESERVE', no_fresh_reader: 'Plain base plus its verified edge items and necessary repairs; disclose SAME-CONTEXT.' },
    assurance: 'Guidance and host-reported checks do not prove semantic quality, independent review, customer acceptance or business results.',
  };
}
