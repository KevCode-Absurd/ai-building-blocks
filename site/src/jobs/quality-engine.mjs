// Model-free routing. The host confirms the family and depth against the brief.
import { QUALITY_PROFILES } from './quality-profiles.mjs';

export const QUALITY_ENGINE_VERSION = '3';
const BASE = 'https://agents.useaiblocks.com/tools/quality/';
const matches = [
  ['claims-review', /claims? (?:review|audit)|regulatory claims/i],
  ['crisis-response', /crisis|press reply|holding statement/i],
  ['review-replies', /review repl|angry customer|public reply/i],
  ['support-macros', /support macros?|customer support repl/i],
  ['pricing', /pricing|price (?:test|change)|menu price/i],
  ['experiment-design', /experiment|a\/b test/i],
  ['competitor-analysis', /competitor|competitive analysis/i],
  ['job-description', /job description|hiring scorecard/i],
  ['landing-page', /landing page|web page|website/i],
  ['lifecycle-email', /welcome|win.back|email series|lifecycle/i],
  ['outbound-sales', /outbound|cold email|sales email/i],
  ['creator-brief', /creator brief|influencer brief/i],
  ['paid-social-ads', /\bads?\b|ad campaign|paid social/i],
  ['product-announcement', /release notes|product announcement/i],
  ['help-docs', /help guide|help doc|how.to guide/i],
  ['webinar-script', /webinar/i],
  ['research-design', /survey|research design/i],
  ['investor-update', /leadership update|investor update/i],
  ['partnership-pitch', /partnership pitch|retail pitch/i],
];

export function qualityEngineContext(request = '', kind = 'other') {
  const text = String(request);
  const fallback = { web_page: 'landing-page', ad_creative: 'paid-social-ads', email: 'lifecycle-email' };
  const family = matches.find(([, pattern]) => pattern.test(text))?.[0] ?? fallback[kind] ?? '_any';
  const profile = QUALITY_PROFILES[family] ?? QUALITY_PROFILES._any;
  // A reviewer's discipline never creates a second writing role.
  const mixed = /(?:page|website).*(?:and|plus).*(?:ads|emails)|(?:ads|emails).*(?:and|plus).*(?:page|website)/i.test(text);
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
    checks: ['family must-haves', 'core design choice', 'clarity and reading level', 'dated claim sources', 'arithmetic and working links', 'visual inspection when applicable', 'hand-over leaks', 'blind final versus plain pick'],
    tool_urls: Object.fromEntries(['wordcount', 'readability', 'proof', 'render', 'leakcheck'].map(name => [name, BASE + name + '.cjs'])),
    precedence: 'Task and brand first. This method governs draft depth and family length; existing truth, access and delivery gates still apply. No library search at job time. A same-context review is never independent.',
    length: 'The family ceiling is a cap, never a target. The brief can ask for more. Keep directly used customer copy no longer than the plain version.',
    learning: 'Only opted-in feedback proposes scoped changes. No feedback is stored by this response. Blind evaluation decides method changes.',
    assurance: 'Guidance and host-reported checks do not prove semantic quality, independent review, customer acceptance or business results.',
  };
}
