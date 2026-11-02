// What a good engagement covers for each golden request, written from how practitioners do the job.
// Never shown to the host that records a run. Patterns are case-insensitive regular expressions.
//   metric      direction the brief's metric should have, or null when the deliverable has no number
//   kinds       stage kinds the plan needs
//   roles       one pattern per kind of expert the job needs, matched against stage owner, support and reviewer ids
//   research    what the expert approach should cover (approach, steps and pitfalls)
//   guardrails, limits, unknowns   what the brief should carry from the owner's answers
//   checks      what the stage checks should test
//   live        true: something goes live (needs a live capability); false: nothing should; null: either
//   deliverable what the finished work is (brief deliverable and production or execution outputs)
//   before      [a, b]: every stage of kind b depends, directly or not, on a stage of kind a
//   max_gates   owner stops (review, approve, approve_each_action) the job reasonably needs; default 6
const CORE = ['evidence', 'diagnosis', 'options', 'decision', 'production', 'measurement', 'learning'];

export const EXPECT = {
  'ecom-cart-abandonment': {
    metric: 'increase', kinds: [...CORE, 'integrity', 'execution'],
    roles: ['cro|checkout|landing|page|conversion|store-test', 'email|lifecycle|abandon|retention|klaviyo|nurture'],
    research: ['checkout', 'shipping (cost|fee|threshold)|unexpected (cost|fee)|extra cost', 'mobile', 'abandon\\w* (cart )?(email|flow|series)|recover', 'payment|guest checkout|account'],
    guardrails: ['margin|average order'], limits: ['999|free shipping'], unknowns: ['payment'],
    checks: ['funnel|step|drop', 'tracking|event|analytics'], live: true, deliverable: ['checkout|email|flow|page'], before: [['evidence', 'diagnosis']],
  },
  'ecom-returns-high': {
    metric: 'decrease', kinds: CORE,
    roles: ['return|review|customer', 'product|page|size|photo|copy'],
    research: ['size (chart|guide)|fit', 'return reason', 'product (page|photo|description)|photo|description', 'review'],
    guardrails: ['conversion|sales|order'], limits: ['free return|policy|february'], unknowns: ['reason|blank'],
    checks: ['reason|categor|tag', 'size'], live: null, deliverable: ['size|page|form|chart'], before: [['evidence', 'diagnosis']],
  },
  'ecom-product-launch': {
    metric: 'reach', kinds: ['context', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['launch|product|position|offer|copy', 'email|lifecycle|social|instagram|ad|meta|creative'],
    research: ['pre-?launch|waitlist|pre-?order|pre-?sell|teaser', 'launch (day|week|sequence|plan)|sequence', 'review', 'amazon|listing', 'sampl|influencer|creator|ugc'],
    guardrails: ['margin|budget|stock|inventory'], limits: ['5,?000|budget', 'health claim|claim'], unknowns: ['amazon|listing|approv'],
    checks: ['claim', 'budget|spend|cost'], live: true, deliverable: ['email|ad|listing|page|launch'],
  },
  'ecom-peak-sale-ready': {
    metric: 'reach', kinds: ['evidence', 'integrity', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['peak|sale|store|shopify', 'speed|performance|slow', 'stock|inventory|reorder|supply', 'support|customer'],
    research: ['inventory|stock', 'speed|load|performance|traffic', 'support|customer service', 'offer|discount|bundle', 'email|sms|early access|vip'],
    guardrails: ['margin|18'], limits: ['25'], unknowns: [],
    checks: ['load|speed|page|performance', 'stock|inventory', 'margin|discount'], live: true, deliverable: ['offer|email|ad|page|stock|plan'], before: [['evidence', 'options']],
  },
  'ecom-amazon-rank-drop': {
    metric: 'increase', kinds: ['evidence', 'diagnosis', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['amazon'],
    research: ['keyword|search term|index', 'image|main image|click-?through|ctr', 'review|rating', 'sponsored|ppc|advertis', 'conversion|unit session|buy box|stock'],
    guardrails: ['120|ad spend|acos|tacos'], limits: ['120'], unknowns: [],
    checks: ['rank|position|keyword', 'image|ctr|click', 'session|conversion'], live: null, deliverable: ['listing|image|keyword|campaign'], before: [['evidence', 'diagnosis']],
  },

  'saas-early-churn': {
    metric: 'decrease', kinds: [...CORE, 'execution'],
    roles: ['customer-success|onboarding|retention|churn|customer', 'analyt|data|product'],
    research: ['cohort', 'onboarding|activation|aha|time to value', 'cancel\\w* (reason|survey|flow)|exit survey', 'health score|usage|engagement', 'integration'],
    guardrails: ['support|satisfaction|revenue|nps|expansion|upgrade|new|acquisition'], limits: ['pric'], unknowns: ['integration'],
    checks: ['cohort|month', 'reconcil|stripe|match'], live: true, deliverable: ['onboarding|email|message|survey'], before: [['evidence', 'diagnosis']],
  },
  'saas-trial-conversion': {
    metric: 'increase', kinds: [...CORE, 'integrity', 'execution'],
    roles: ['onboarding|growth|product|lifecycle|email|saas|trial', 'analyt|tracking|data'],
    research: ['activation|aha|onboarding', 'trial (length|email)|lifecycle|nurture|email', 'paywall|pricing page|upgrade', 'usage|product.qualified|pql|engaged'],
    guardrails: ['sign-?up|volume|10'], limits: [], unknowns: ['count|definition|how .* counted|measured'],
    checks: ['definition|count|tracking|event', 'cohort|trial'], live: true, deliverable: ['onboarding|email|paywall|trial'], before: [['integrity', 'diagnosis']],
  },
  'saas-pricing-review': {
    metric: 'increase', kinds: ['evidence', 'options', 'decision', 'production', 'measurement', 'learning'],
    roles: ['pric'],
    research: ['willingness to pay|van westendorp|survey|interview', 'value metric|per (user|seat|project)', 'tier|packag|good.?better.?best', 'grandfather|existing customer|migration', 'competitor|benchmark'],
    guardrails: ['churn|2\\.5'], limits: ['12 months|existing customer|grandfather'], unknowns: [],
    checks: ['survey|sample|respon', 'churn|revenue|arpa'], live: null, deliverable: ['pric|tier|page|plan'],
  },
  'saas-organic-signups': {
    metric: 'increase', kinds: ['evidence', 'integrity', 'diagnosis', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['seo|search|content|blog|organic|traffic'],
    research: ['keyword', 'search intent|intent', 'technical|crawl|index', 'internal link|topic cluster|pillar|hub', 'conversion|sign-?up|cta'],
    guardrails: ['claim|compliance|quality'], limits: ['link|writer|part-time|budget'], unknowns: [],
    checks: ['search console|ranking|impression|index', 'claim|fact|source'], live: true, deliverable: ['article|post|content|page|brief'],
  },
  'saas-security-questionnaire': {
    metric: null, kinds: ['evidence', 'production', 'decision', 'learning'],
    roles: ['security|compliance|questionnaire|vendor-security', 'sales|deal|account|proposal'],
    research: ['soc ?2|iso ?27001', 'questionnaire|caiq|sig\\b|hecvat', 'evidence|policy|control', 'roadmap|bridge letter|compensating|gap', 'answer library|knowledge base|trust (center|page)|reuse'],
    guardrails: ['accura|true|claim|honest|overstat'], limits: ['claim|cannot claim|do not have'], unknowns: ['roadmap|accept|soc'],
    checks: ['evidence|source|policy', 'claim|accura|honest|true'], live: null, deliverable: ['answer|questionnaire|response'],
  },

  'local-dental-new-patients': {
    metric: 'increase', kinds: ['evidence', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['local|seo|google|review|search', 'health|compliance|legal'],
    research: ['google business profile|gbp|google maps|map pack', 'review', 'local seo|citation|nap|local search', 'booking|call|enquir|phone', 'gdc|asa|cap code|advertising (rule|standard)|regulat'],
    guardrails: ['rule|regulat|compliance|consent|privacy|patient data'], limits: ['1,?500|budget', 'before-and-after|consent|patient data|rule'], unknowns: ['profit|treatment'],
    checks: ['rule|compliance|claim|regulat', 'track|source|call|booking'], live: null, deliverable: ['profile|page|ad|review|campaign'],
  },
  'local-plumber-lead-cost': {
    metric: 'decrease', kinds: [...CORE, 'integrity', 'execution'],
    roles: ['google|ppc|paid|search|ads', 'track|call|conversion|data'],
    research: ['local services ads|lsa', 'call tracking|call record|offline conversion|import', 'negative keyword|search term', 'service area|location|geo', 'booked|job|crm'],
    guardrails: ['booked job|volume|lead'], limits: ['service area'], unknowns: [],
    checks: ['booked|job|housecall', 'call|track|conversion'], live: true, deliverable: ['campaign|keyword|track|ad'], before: [['integrity', 'diagnosis']],
  },
  'local-restaurant-reviews': {
    metric: 'increase', kinds: ['evidence', 'diagnosis', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['review|reputation|customer|hospitality|restaurant|guest|support'],
    research: ['respond|reply|response', 'root cause|operation|service|kitchen|staff', 'google|tripadvisor|yelp|platform', 'incentiv|policy|guideline|fake', 'ask(ing)? (for )?review|request review|happy guest'],
    guardrails: ['incentiv|never offer|honest|policy'], limits: ['incentiv|exchange|never offer'], unknowns: ['menu'],
    checks: ['theme|categor|tag|complaint', 'tone|policy|reply|incentiv'], live: true, deliverable: ['reply|replies|response|plan|training|process'], before: [['evidence', 'diagnosis']],
  },
  'local-salon-no-shows': {
    metric: 'decrease', kinds: ['evidence', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['appointment|no-show|booking|customer|client|salon|service'],
    research: ['deposit|card on file|prepay', 'reminder|sms|text|confirm', 'cancellation policy|policy|fee', 'waitlist|overbook|fill', 'regular|loyal|exempt|repeat'],
    guardrails: ['regular|client|loyal|retention|booking'], limits: [], unknowns: [],
    checks: ['no-show|rate|baseline', 'regular|client|complaint'], live: true, deliverable: ['policy|reminder|message|setting'],
  },
  'local-gym-memberships': {
    metric: 'increase', kinds: ['evidence', 'diagnosis', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['local|social|growth|offer|ad|meta|marketing|community', 'retention|churn|customer|member|feedback|survey'],
    research: ['retention|churn|cancel', 'referral|bring a friend', 'trial|intro|class pass|free week|offer', 'local|community|partner', 'survey|exit|ask'],
    guardrails: ['no lock-?in|contract|cancel|churn|retention'], limits: ['2,?000|budget', 'lock-?in|contract'], unknowns: ['cancel|why'],
    checks: ['net|join|cancel|member', 'budget|spend|cost'], live: true, deliverable: ['ad|offer|campaign|email|survey|referral'],
  },

  'content-youtube-growth': {
    metric: 'increase', kinds: ['evidence', 'diagnosis', 'options', 'decision', 'production', 'measurement', 'learning'],
    roles: ['youtube|video|thumbnail|content|creator|title'],
    research: ['click.?through|ctr|thumbnail', 'title', 'retention|watch time|view duration|hook|intro', 'topic|niche|search|browse|suggested', 'shorts'],
    guardrails: ['clickbait|mislead|honest|trust'], limits: ['clickbait|mislead|one video|week'], unknowns: [],
    checks: ['ctr|click', 'retention|duration|view'], live: null, deliverable: ['thumbnail|title|video|script|hook'], before: [['evidence', 'diagnosis']],
  },
  'content-newsletter-revenue': {
    metric: 'reach', kinds: ['evidence', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['newsletter|email|sponsor|monet|offer|pric|revenue|creator'],
    research: ['sponsor|advertis', 'paid (tier|subscription)|premium|subscription', 'rate card|cpm|price', 'audience|reader survey|survey', 'disclos|ftc|trust'],
    guardrails: ['unsubscribe|open rate|trust|disclos'], limits: ['disclos|would not use|promote'], unknowns: ['premium|pay'],
    checks: ['disclos|sponsor', 'open|unsubscribe|revenue'], live: null, deliverable: ['rate card|media kit|offer|tier|pitch|page'],
  },
  'content-podcast-launch': {
    metric: 'reach', kinds: ['context', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['podcast|audio|content|launch|video|creator', 'edit|audio|production|record'],
    research: ['format|solo|interview|guest', 'record|audio|microphone|edit', 'launch with|trailer|multiple episodes|batch', 'distribution|rss|apple|spotify|host', 'call to action|cta|convert|lead'],
    guardrails: ['budget|200|1,?500|time'], limits: ['1,?500|200|budget'], unknowns: ['format|interview|solo'],
    checks: ['audio|quality|loudness|level', 'cta|call|link|calendly'], live: true, deliverable: ['episode|trailer|show|cover|feed'],
  },
  'content-course-launch': {
    metric: 'reach', kinds: ['evidence', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['course|lesson|teach|curriculum|learning|training', 'launch|price|offer|email|copy|sales'],
    research: ['validat|pre-?sell|waitlist|demand|interview', 'curriculum|outcome|module|lesson', 'platform|teachable|kajabi|thinkific|podia', 'launch (email|sequence|webinar)|webinar|email sequence|cart', 'pric'],
    guardrails: ['income|claim|promise|refund'], limits: ['1,?000|budget', 'income|promise'], unknowns: [],
    checks: ['claim|income|promise', 'lesson|module|outcome'], live: true, deliverable: ['course|lesson|page|email|sales page'],
  },
  'content-instagram-engagement': {
    metric: 'increase', kinds: ['evidence', 'diagnosis', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['brand|style|visual|design', 'social|instagram|content|community'],
    research: ['content pillar|theme|pillar', 'brand (guide|style)|visual|style guide|grid', 'reel|video|format', 'calendar|schedule|consisten|cadence', 'engagement rate|insight|reach'],
    guardrails: ['brand|consisten|follower|reach'], limits: ['influencer'], unknowns: [],
    checks: ['brand|style|colour|color', 'engagement|reach|insight'], live: true, deliverable: ['guide|calendar|template|post|reel'], before: [['evidence', 'diagnosis']],
  },

  'fin-month-end-close': {
    metric: 'decrease', kinds: ['evidence', 'diagnosis', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['close|bookkeep|controller|accountant|account|finance'],
    research: ['reconcil', 'close (checklist|calendar|schedule)|checklist', 'accrual', 'bank (feed|rule)|automat|rule', 'variance|flux|review'],
    guardrails: ['error|accura|board|quality'], limits: ['approv|post|ledger'], unknowns: [],
    checks: ['reconcil|tie|balance|match', 'approv|review'], live: null, deliverable: ['checklist|calendar|process|template|rule'], before: [['evidence', 'diagnosis']], max_gates: 7,
  },
  'fin-cash-crunch': {
    metric: 'reach', kinds: ['evidence', 'diagnosis', 'options', 'decision', 'production', 'measurement', 'learning'],
    roles: ['cash|finance|fpa|cfo|controller|financial|working-capital'],
    research: ['cash conversion cycle|working capital', 'receivable|dso|collect', 'inventory|stock|dio', 'payable|dpo|supplier terms|payment terms', '13.week|cash (flow )?forecast'],
    guardrails: ['customer|retail|relationship'], limits: ['customer|retail'], unknowns: ['late|pay'],
    checks: ['reconcil|bank|tie|match', 'forecast|actual'], live: null, deliverable: ['forecast|plan|model|policy'], before: [['evidence', 'diagnosis']],
  },
  'fin-overdue-invoices': {
    metric: 'decrease', kinds: ['evidence', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['invoice|receivable|collect|late|accounts|billing|finance'],
    research: ['payment terms|terms', 'reminder|dunning|sequence|follow.?up', 'late fee|early payment|deposit|direct debit|autopay|card', 'aging|aged', 'tone|relationship'],
    guardrails: ['client|relationship|retention'], limits: ['approv'], unknowns: [],
    checks: ['aging|overdue|tie|reconcil', 'tone|approv|client'], live: true, deliverable: ['reminder|email|sequence|terms|policy'],
  },
  'fin-budget-vs-actual': {
    metric: null, kinds: ['evidence', 'integrity', 'production', 'learning'],
    roles: ['budget|fpa|finance|report|financial|bookkeep|controller'],
    research: ['variance', 'chart of accounts|categor|mapping|map', 'forecast|rolling|reforecast', 'threshold|material|explain', 'one.?page|dashboard|summary'],
    guardrails: [], limits: [], unknowns: ['chart of accounts|categor|match'],
    checks: ['tie|reconcil|match|total', 'variance|explain'], live: false, deliverable: ['report|dashboard|sheet|template'],
  },
  'fin-vendor-spend': {
    metric: 'decrease', kinds: ['evidence', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['subscription|vendor|procurement|spend|bill|finance|saas|cost'],
    research: ['inventory|audit|list of (tools|vendors)', 'usage|seat|licen|login', 'renewal|contract|notice', 'negotiat|discount', 'duplicate|overlap|consolidat'],
    guardrails: ['client|break|access|team'], limits: ['team lead|confirm|approv|client'], unknowns: ['renewal|contract'],
    checks: ['owner|team lead|confirm', 'client|depend|usage'], live: null, deliverable: ['list|plan|register|cancel|renewal calendar'],
  },

  'eng-slow-web-app': {
    metric: 'decrease', kinds: ['evidence', 'diagnosis', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['performance|slow|sre|database|backend|frontend|engineer'],
    research: ['profil|trace|apm|flame', 'database|query|index|n\\+1', 'p95|percentile|latency', 'regression|bisect|release|deploy|diff', 'cache|caching'],
    guardrails: ['downtime|error|correct'], limits: ['downtime|approv'], unknowns: [],
    checks: ['p95|latency|baseline|benchmark|measure', 'test|regression|error'], live: true, deliverable: ['fix|pull request|change|index|query'], before: [['evidence', 'diagnosis']],
  },
  'eng-ci-slow-flaky': {
    metric: 'decrease', kinds: ['evidence', 'diagnosis', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['ci|devops|platform|test|pipeline|build|engineer'],
    research: ['flaky|quarantine|retry', 'cache|caching', 'parallel|shard|split|matrix', 'test (selection|impact)|affected|changed', 'duration|metric|track|history'],
    guardrails: ['coverage|required check|weaken'], limits: ['coverage|required check|review|pull request'], unknowns: [],
    checks: ['coverage', 'duration|minute|median|failure rate|flak'], live: null, deliverable: ['pull request|workflow|pipeline|config'], before: [['evidence', 'diagnosis']],
  },
  'eng-leaked-api-key': {
    metric: null, kinds: ['evidence', 'decision', 'execution', 'learning'],
    roles: ['secret|security|incident|credential'],
    research: ['rotat|revok', 'audit log|cloudtrail|log|blast radius|usage', 'secret scanning|gitleaks|trufflehog|scan', 'history|rewrite|filter-repo|bfg|cache', 'notif|disclos|report'],
    guardrails: ['downtime|outage|break|service'], limits: ['approv'], unknowns: ['used|abuse'],
    checks: ['rotat|revok|invalid', 'log|cloudtrail|activity|usage'], live: true, deliverable: ['rotat|incident|report|scan|hook'], max_gates: 7,
  },
  'eng-mysql-to-postgres': {
    metric: null, kinds: ['evidence', 'options', 'decision', 'production', 'execution', 'learning'],
    roles: ['database|migration|postgres|data|sql'],
    research: ['schema|type (mapping|conversion)|data type', 'replicat|cdc|dms|change data capture|dual.?write', 'cutover|rollback|fallback', 'row count|checksum|validat|verify', 'stored procedure|procedure|function'],
    guardrails: ['data loss|downtime|5 minutes'], limits: ['5 minutes|downtime|notice|approv'], unknowns: ['stored procedure|procedure'],
    checks: ['row count|checksum|compar|validat', 'rollback|fallback|rehears'], live: true, deliverable: ['migration|cutover|runbook|schema'], max_gates: 7,
  },
  'eng-android-crashes': {
    metric: 'increase', kinds: ['evidence', 'diagnosis', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
    roles: ['mobile|android|app|release|crash|qa|kotlin'],
    research: ['crashlytics|crash report|stack trace|anr', 'device|os version|android version|model', 'staged rollout|phased|percentage', 'reproduc|test', 'review|rating|respond'],
    guardrails: ['ios|regression|checkout|rating'], limits: ['staged|approv|mobile lead'], unknowns: [],
    checks: ['crash-?free|crash rate|stack', 'test|reproduc|device'], live: true, deliverable: ['fix|release|build|pull request'], before: [['evidence', 'diagnosis']],
  },
};
