// What a quality card's job needs where it differs from its deliverable kind's defaults. Deterministic and model-free.
//
// Why: the kind defaults are written for the common case of each kind. An "email" was an email series, so a one-off
// support reply was asked who joins the list, told to show a product in every email, to add merge tags and an exit
// rule, and to capture the brand's colours, fonts and screenshots, name competitors and write a taste brief. A creative
// brief listing its channels was read as email work and as a team job. The card names the actual deliverable, so the
// card decides these where it knows better:
//   kinds/kind   the deliverable kinds that fit; a guessed kind outside them becomes `kind`
//   context      how much brand context: 'facts' (the request's facts plus sourced public facts) or 'voice' (also
//                5 to 10 real lines in the channel). No card here needs the look capture, screenshots or a taste brief.
//   fresh        new work for this moment, so the mode is new unless the request asks to change something existing
//   light        a short piece in one voice: light depth
//   document     a document about other channels (a brief, a memo, a plan): channel words in it are not separate
//                deliverables, so it is one lead's job, not a team's
//   questions    up to three intake questions; one the request already answers is dropped
//   tests        suggested acceptance tests (type job, ready, truth, clear)
//   complete     the format-complete list, replacing the kind's
//   levers       proven levers to mark; [] when the kind's levers (subject line, unsubscribe...) do not apply
//   job_test     replaces the rubric's first criterion test
//   candidates   what the expert's alternatives are, replacing the kind's family reference
//   scope_note   which card must-haves apply at the asked scope
// A variant whose `when` matches the ask overrides its card's defaults.

const q = (id, question, fallback, answered) => Object.freeze({ id, question, default: fallback, ...(answered ? { answered } : {}) });
const t = (type, test) => Object.freeze({ type, test });

const SUPPORT_REPLY = Object.freeze({
  kinds: ['email', 'copy'], kind: 'email', context: 'facts', fresh: true, light: true, levers: [],
  questions: [
    q('case_facts', 'What do we know about this customer\'s order or account that the reply should use (dates, items, what was already tried)?', 'Only what the customer\'s message and your note say; nothing else is assumed.', /\b(?:order|box|shipment|parcel|account|bought|subscri\w+|ticket|booking|reservation|charge)\b/i),
    q('allowed', 'What may the reply offer or promise (refund, replacement, credit, an exception), and who approves anything beyond policy?', 'Only what the policy in your note allows; anything beyond it goes to a lead.', /\b(?:policy|refund|replace\w*|reship\w*|credit|exception|we (?:can|will|offer))\b/i),
    q('sender', 'Who signs it, and in which channel: email, chat or the help desk?', 'Signed by you, by first name, as an email.', /\b(?:e-?mail|chat|signed? (?:by|as|off)|from me|my reply)\b/i),
  ],
  tests: [
    t('job', 'Does the first line answer what the customer actually asked, in their terms?'),
    t('job', 'Does it say exactly what happens next, who does it and when, within the stated policy?'),
    t('ready', 'Can it be sent as it stands: no blanks except fields the help desk fills, within the length asked?'),
    t('truth', 'Does every promise, time frame and policy match the policy given, with no health, legal or safety claim beyond it?'),
    t('clear', 'After one read, does the customer know what to do, or that nothing is needed?'),
  ],
  complete: ['the customer\'s own issue named in line one', 'the answer or decision before any explanation', 'one next step with who acts and when', 'no promise beyond the given policy', 'within the length asked', 'a sign-off from a named person'],
  job_test: 'The customer gets a direct answer and one next step the policy allows. Every acceptance test on the spec sheet passes.',
  candidates: 'Two openings for the reply (its first two lines), each written in full.',
  scope_note: 'One reply to one customer: card must-haves 3 to 5 apply; 1 and 2 (the case list and do-not-use rules) are for a macro set.',
});

const FIRST_TOUCH = Object.freeze({
  kinds: ['email', 'copy'], kind: 'email', context: 'facts', fresh: true, light: true, levers: [],
  questions: [
    q('prospect', 'Who exactly is it to, and what do you know about them (role, company, how you met)?', 'The person the request describes; nothing else is assumed about them.', /\b(?:owner|buyer|head of|vp|director|manager|founder|cfo|ceo|controller|met (?:\w+ ){0,4}at|trade ?show|conference|expo)\b/i),
    q('ask', 'What is the one ask: a call, a reply, a sample or a meeting, and how long?', 'A 15-minute call, with two times offered.', /\b(?:\d{1,2}[- ]minute|call|meeting|demo|samples?|a reply)\b/i),
    q('proof', 'Which proof may it use (a customer, a number, a result), each public or approved?', 'One public, sourced fact about your company; no customer names or results unless you give them.', /\b(?:case stud(?:y|ies)|proof|results?|customers? (?:like|such as))\b/i),
  ],
  tests: [
    t('job', 'Does the first line give this person a true reason the email is for them?'),
    t('job', 'Is there one low-effort ask they can say yes to in a sentence?'),
    t('ready', 'Can it be sent today: subject line(s), placeholders only where the request asks, within the length?'),
    t('truth', 'Is every claim about the company or the prospect sourced, with nothing the request rules out?'),
    t('clear', 'Can the reader tell who wrote, why and what is asked within the first three lines?'),
  ],
  complete: ['a subject line, and an alternate if asked', 'why them, in the first line', 'at most one sourced proof point', 'one low-effort ask', 'placeholders only where the request asks', 'within the length asked'],
  job_test: 'The named prospect gets a true reason to reply and one easy ask. Every acceptance test on the spec sheet passes.',
  candidates: 'Three subject line and opening pairs, each written in full.',
  scope_note: 'One first-touch email: card must-haves 1, 2 and 4 apply; 3 and 5 (the follow-up cadence, reply scripts and test plan) only if asked.',
});

// A short status-page or incident update: what is affected, what to do and the next update time, in a few lines.
const STATUS_UPDATE = Object.freeze({
  light: true,
  questions: [
    q('impact', 'What is affected right now (which product, region or feature), since when, and is there a workaround?', 'Only what your request states; anything else is said as still being investigated.', /\b(?:affected|errors?|down|unavailable|slow|degraded|failing|since|region|checkout|login|api|workaround)\b/i),
    q('stage', 'Which stage is this: investigating, identified, monitoring or resolved?', 'Investigating, unless your request says the cause is found or the fix is out.', /\b(?:investigating|identified|monitoring|resolved|fixed|root cause|still)\b/i),
    q('next', 'When will the next update be posted?', 'Within 30 minutes, or sooner if anything changes.', /\b(?:next update|within \d+|every \d+|by \d)/i),
  ],
  tests: [
    t('job', 'Do the first two lines say what is affected and what people should do now?'),
    t('job', 'Does it name the stage and give a specific time for the next update?'),
    t('ready', 'Can it be posted as it stands on the status page, in a few short lines?'),
    t('truth', 'Is every statement confirmed, with no guessed cause, fix time or blame?'),
    t('clear', 'Would a customer who reads only the title know whether they are affected?'),
  ],
  complete: ['a title that names what is affected', 'the stage (investigating, identified, monitoring, resolved)', 'who and what is affected, since when', 'a workaround, if there is one', 'the next update time'],
  job_test: 'A customer knows within two lines whether they are affected, what to do and when the next update comes. Every acceptance test on the spec sheet passes.',
  scope_note: 'One status-page update: card must-haves on what happened, who is affected and the next update apply; the full response pack and spokesperson plan are not asked.',
});

export const CARD_SHAPES = Object.freeze({
  'press-pitch': Object.freeze({
    kinds: ['email', 'copy'], kind: 'email', context: 'facts', fresh: true, light: true, levers: [],
    questions: [
      q('story', 'What is the news, and why now: a launch date, new data, a trend or an event?', 'The news your request names, with its date; no hook is invented.', /\b(?:launch\w*|new|data|survey|report|study|announc\w*|series [a-z]|funding|opening|today|this week|next week|on \d)\b/i),
      q('reporter', 'Who is it to, and what have they covered lately?', 'A marked fill-in for the reporter and one recent piece of theirs; none is invented.', /\b(?:reporter|journalist|editor|writer|producer|columnist|host)s? (?:at|from|for|on)\b/i),
      q('offer', 'What can they have: an exclusive, an embargo (date and time), data, an interview, samples?', 'An interview with the spokesperson your request names, and no embargo unless you set one.', /\b(?:exclusive|embargo\w*|interview|samples?|first look|data|spokesperson|founder|ceo)\b/i),
    ],
    tests: [
      t('job', 'Does the subject line state the story, not the company?'),
      t('job', 'Do the first two sentences say what is new, why this outlet\'s readers care and why now?'),
      t('ready', 'Can it be sent today: one short email, a fill-in only where the reporter or their article is unknown?'),
      t('truth', 'Is every fact sourced, with no invented article, exclusive or embargo?'),
      t('clear', 'Could the reporter say yes or no after ten seconds, and is there one small ask?'),
    ],
    complete: ['a subject line that states the story', 'the angle and hook in the first two sentences', 'why this reporter, or a marked fill-in', 'what is offered and what is ready now', 'embargo terms only if there is one', 'one small ask and the contact'],
    job_test: 'A busy reporter can judge the story in ten seconds and reply to one small ask. Every acceptance test on the spec sheet passes.',
    candidates: 'Three subject line and opening pairs, each on a different angle, written in full.',
  }),
  'rfp-response': Object.freeze({
    kinds: ['ops_doc', 'copy'], kind: 'ops_doc', context: 'facts', fresh: true, levers: [],
    questions: [
      q('questions', 'Which questions or sections must be answered, with their numbers and any word or page limits?', 'The section your request names, keeping each question\'s number and wording.', /\b(?:section|question|questions|part|criteria|\d+ words|word limit|page limit)\b/i),
      q('sources', 'Which approved sources can the answers use: past answers, policies, certifications, product docs?', 'Only what your request and your public docs say; anything else is a fill-in for the owner to confirm.', /\b(?:soc ?2|iso ?27001|certif\w*|policy|policies|past answers?|approved|docs?|documentation)\b/i),
      q('scope', 'Which products, plans and regions does the offer cover, and what is not supported?', 'The product your request names on its standard plan; nothing planned is promised.', /\b(?:plan|tier|region|edition|product|not supported|roadmap)\b/i),
    ],
    tests: [
      t('job', 'Does each answer start with Yes, No, Partly or Planned in the buyer\'s terms, under the question\'s own number?'),
      t('job', 'Is each claim backed by a named certification, policy or document the buyer can ask for?'),
      t('ready', 'Can it be pasted into the buyer\'s form as it stands, within each limit, with fill-ins only for facts an owner must confirm?'),
      t('truth', 'Is nothing overclaimed: partial, planned or higher-plan features said as such?'),
      t('clear', 'Could an evaluator score each answer in one read?'),
    ],
    complete: ['each question\'s number and wording kept', 'the answer first: Yes, No, Partly or Planned', 'evidence named for each claim', 'scope limits stated', 'unsupported items said plainly', 'fill-ins named with their owner', 'the same numbers and names in every answer'],
    job_test: 'An evaluator can score every answer fast, and the company can stand behind each one after signing. Every acceptance test on the spec sheet passes.',
    candidates: 'Two versions of the hardest answer, each written in full.',
  }),
  sop: Object.freeze({ kinds: ['ops_doc'], kind: 'ops_doc' }),
  'product-description': Object.freeze({
    kinds: ['copy', 'web_page'], kind: 'copy', context: 'voice', fresh: true,
    questions: [
      q('specs', 'Where do the facts come from: a supplier sheet, the label or the product page? Any sizes, materials or care to include?', 'Only the facts in your request and on your live product page, each with its source; the rest are marked fill-ins.', /\b(?:made (?:of|from|with)|materials?|cotton|linen|wool|leather|acetate|steel|ingredients?|specs?|dimensions|size|sizes|weight|capacity|care)\b/i),
      q('where', 'Where will it appear (your store, Amazon, a marketplace), and any length or field limits?', 'Your own store: a title, a short paragraph and 3 to 6 bullets.', /\b(?:shopify|amazon|etsy|ebay|walmart|store|site|pdp|listing|\d+ words|bullets?|characters?)\b/i),
      q('shopper', 'Who buys it, and what do they most need to know before buying?', 'The shopper your request describes; their main question is what it does for them and how it fits.', /\b(?:for (?:runners|parents|kids|teams|students|commuters|people|anyone|women|men)|shoppers?|customers?|buyers?)\b/i),
    ],
    tests: [
      t('job', 'Does the first line say what the product does for this shopper, before any spec?'),
      t('job', 'Do the bullets answer the questions that stop a purchase or cause a return (fit, size, care, what is in the box)?'),
      t('ready', 'Can it be pasted into the listing as it stands, within its field limits?'),
      t('truth', 'Is every spec, material and claim taken from a named source, with nothing invented?'),
      t('clear', 'Can a shopper scan it in five seconds and know if it is right for them?'),
    ],
    complete: ['a title that names the product, its variant and its use', 'the lead benefit first', 'specs from the source only', 'fit, size and care where they apply', '3 to 6 bullets, one fact each', 'delivery, returns or warranty terms where they cut returns'],
    job_test: 'A shopper knows within seconds what it does for them and buys the right item first time. Every acceptance test on the spec sheet passes.',
    candidates: 'Two openings (title and first line), each on a different lead benefit, written in full.',
  }),
  'audio-ad-script': Object.freeze({ kinds: ['copy', 'ad_creative'], kind: 'copy' }),
  'internal-announcement': Object.freeze({
    kinds: ['copy', 'email', 'ops_doc'], kind: 'copy', context: 'facts', fresh: true, levers: [],
    questions: [
      q('change', 'What exactly changes, from what date, and who is affected (and who is not)?', 'The change and date in your request, for the people it names; anything not yet decided is said as not yet decided.', /\b(?:from|starting|on|by) (?:\d|january|february|march|april|may|june|july|august|september|october|november|december|monday|next|1st|the 1st)\b|\b(?:changes?|moves?|moving|replac\w*|new)\b/i),
      q('action', 'What must people do, by when, and what happens if they do nothing?', 'The steps your request names; if none, nothing is required and it says so.', /\b(?:must|need to|should|by (?:\w+ )?\d|deadline|sign up|complete|register|what to do)\b/i),
      q('owner', 'Who sends it, and where do people take questions?', 'Sent by the leader your request names; questions to a named owner or channel you confirm.', /\b(?:from (?:our |the )?(?:ceo|cto|cfo|coo|head|founder|vp|director)|signed|who to ask|questions to|channel|faq)\b/i),
    ],
    tests: [
      t('job', 'Do the first two sentences say what changes and when, with no warm-up?'),
      t('job', 'Does each affected group know what it must do, by when?'),
      t('ready', 'Can it be sent as it stands in the channel named, with a named owner for questions?'),
      t('truth', 'Is nothing promised or stated as decided that the request does not decide?'),
      t('clear', 'After one read, can any employee say what changes for them?'),
    ],
    complete: ['what changes, in the first two sentences', 'the start date and any key dates', 'who it affects and who it does not', 'the real reason, in one to three sentences', 'what to do, with dates', 'where to ask'],
    job_test: 'Every employee knows after one read what changes for them, when, and what to do. Every acceptance test on the spec sheet passes.',
    candidates: 'Two openings (subject line and first two sentences), each written in full.',
  }),
  'vendor-scorecard': Object.freeze({
    kinds: ['plan', 'analysis', 'strategy', 'ops_doc'], kind: 'plan', context: 'facts', fresh: true, document: true, levers: [],
    questions: [
      q('need', 'What is being bought, for whom, with what budget, and when must the choice be made?', 'The purchase your request names, decided this quarter; the budget as a marked fill-in if not given.', /\$\d|£\d|€\d|\b(?:budget|by (?:\w+ )?\d|deadline|this quarter|next month)\b/i),
      q('options', 'Which vendors are on the list, and what evidence is there for each (quotes, demos, references)?', 'The vendors your request names, scored only on their public facts and any quotes you give.', /\b(?:quotes?|demos?|references?|proposals?|bids?)\b|\b(?:two|three|four|five|\d) (?:[\w-]+ ){0,3}(?:vendors|suppliers|providers|tools|platforms|options)\b/i),
      q('musts', 'What is a deal-breaker (a certification, data location, delivery date), and which criteria matter most?', 'Deal-breakers listed apart from the weights; the weights set from what your request stresses.', /\b(?:must|deal-?breakers?|required|criteria|weight\w*|price|cost|lead time|support|security)\b/i),
    ],
    tests: [
      t('job', 'Are the criteria and weights fixed and explained, adding to 100, with deal-breakers apart?'),
      t('job', 'Does each score cite its evidence, with gaps marked not evidenced?'),
      t('ready', 'Could the buyer decide today: a weighted total, a recommendation, its risks and a next step with an owner and date?'),
      t('truth', 'Is every vendor fact from a quote, demo, reference or public source, with the maths recomputable?'),
      t('clear', 'Are the winner and the reason on the first screen?'),
    ],
    complete: ['the need, budget and decision date', 'criteria with weights adding to 100', 'deal-breakers apart from the weights', 'a score and its evidence per vendor per criterion', 'weighted totals and a sensitivity check', 'a recommendation with risks and a next step'],
    job_test: 'The buyer can make a fair, traceable choice today and defend it to finance. Every acceptance test on the spec sheet passes.',
    candidates: 'Two weightings of the criteria, each with its ranked result, so the reviewer sees whether the winner holds.',
  }),
  'policy-doc': Object.freeze({
    kinds: ['ops_doc'], kind: 'ops_doc', context: 'facts', fresh: true, levers: [],
    questions: [
      q('scope', 'Who does it apply to (teams, roles, places, AI agents), and what is out of scope?', 'The people your request names, in the places it names; anything else is out of scope.', /\b(?:staff|employees|agents?|managers?|everyone|contractors?|stores?|showrooms?|offices?|remote|warehouses?|drivers?)\b/i),
      q('limits', 'What limits and approvals apply: amounts, days or risk levels each role may decide alone?', 'Marked fill-ins for each amount and day count, for you to set; none is invented.', /\$\d|£\d|€\d|\b\d+ (?:days?|weeks?|months?|hours?)\b|\b(?:approv\w*|limit|up to|eligib\w*)\b/i),
      q('owner', 'Who owns the policy, and from what date does it apply?', 'Owned by your people team, effective from the date you confirm, reviewed yearly.', /\b(?:owner|owned by|effective|from \d|starting|review date|hr|people team)\b/i),
    ],
    tests: [
      t('job', 'Is each rule written as a condition and an action someone can apply the same way every time?'),
      t('job', 'Are limits, approvals and escalation stated with numbers or marked fill-ins, never "where appropriate"?'),
      t('ready', 'Could it be published as it stands: purpose, scope, rules, examples, owner and dates?'),
      t('truth', 'Is nothing stated as law, benefit or entitlement that the request or a cited source does not give?'),
      t('clear', 'Can a new starter, or an AI agent, find the rule for a common case in under a minute?'),
    ],
    complete: ['purpose and who it applies to', 'numbered if-then rules', 'limits and who approves above them', 'worked examples, including an edge case', 'when and how to escalate', 'owner, version, effective and review dates'],
    job_test: 'A person or an agent can apply each rule the same way every time and knows when to hand over. Every acceptance test on the spec sheet passes.',
    candidates: 'Two outlines of the rules (how they are grouped and ordered), each with one rule written in full.',
  }),
  'localisation-brief': Object.freeze({ kinds: ['ops_doc', 'plan', 'copy'], kind: 'ops_doc', document: true }),
  'support-macros': Object.freeze({
    kinds: ['ops_doc', 'copy', 'email', 'other'], kind: 'ops_doc', context: 'facts', fresh: true, levers: [],
    questions: [
      q('cases', 'Which ticket types come in most, and which rare ones are risky?', 'The cases your request lists, plus a refusal, a delay and an outage.', /\b(?:\d+|three|four|five|six|eight|ten) (?:most common |common |top )?(?:ticket|case|macro|issue)|ticket types?|most common\b/i),
      q('policy', 'Where is the written policy for refunds, returns and exceptions, and who approves anything outside it?', 'The policy published on your site, with its date; anything outside it goes to a lead.', /\b(?:policy|refund|return|warranty)\b/i),
      q('desk', 'Which help desk do agents use, and which merge fields does it have?', 'Plain fields such as {first_name} and {order_number} that you map to your help desk.', /\b(?:zendesk|gorgias|intercom|freshdesk|help ?scout|kustomer|salesforce|front|hubspot)\b/i),
    ],
    complete: ['when to use and when not to, for each macro', 'line one names the customer\'s problem', 'policy terms match the dated policy', 'merge fields match the help desk', 'an escalation route'],
    variants: [
      { when: /\b(?:staffing|coverage|schedul\w*|forecast\w*|capacity|headcount|rota)\b/i, none: true },
      { when: /\b(?:repl(?:y|ies)|respon(?:d|se)|answer|write back)\b/i, unless: /\bmacros?\b|templates?|canned|saved replies|ticket types|most common/i, ...SUPPORT_REPLY },
    ],
  }),
  'outbound-sales': Object.freeze({
    kinds: ['email', 'copy', 'plan'], kind: 'email', context: 'facts', fresh: true, levers: [],
    questions: FIRST_TOUCH.questions,
    complete: ['two subject lines per email', 'each touch adds something new', 'one ask per touch', 'a polite close-out touch', 'personalisation slots tied to real research'],
    variants: [{ when: /./, unless: /\b(?:sequence|cadence|series|touches|follow-?ups?|\d+[- ](?:step|email|touch))\b/i, ...FIRST_TOUCH }],
  }),
  'notification-copy': Object.freeze({
    kinds: ['copy'], kind: 'copy', context: 'voice', fresh: true, light: true, levers: [],
    questions: [
      q('moment', 'What sets each message off, and who gets it: a lapse, a streak, a cart, a reminder?', 'The moment the request names, for the readers it names.', /\b(?:lapsed|streak|inactive|haven'?t|reminder|abandon\w*|trigger|after (?:they|a|the)|when (?:they|a|the))\b/i),
      q('action', 'Where does tapping go: which screen or deep link?', 'The screen that finishes the action the message asks for.', /\b(?:deep ?link|tap\w*|opens?|screen|lesson|cart|checkout)\b/i),
      q('limits', 'Any limits: characters, words to avoid, how often per week, quiet hours?', 'Title under 40 characters, body under 110, no more than one a day.', /\b(?:characters?|under \d+|quiet hours|per (?:day|week)|frequency)\b/i),
    ],
    tests: [
      t('job', 'Does each message give the reader a true reason to act today?'),
      t('job', 'Do the messages differ in angle (progress, curiosity, social, utility), not just wording?'),
      t('ready', 'Can each be loaded as it stands: within the limits, with its trigger and tap target named?'),
      t('truth', 'Is every claim true today, with no guilt, fake urgency or invented numbers?'),
      t('clear', 'Is the point in the first 40 characters?'),
    ],
    complete: ['the asked count', 'title and body, or the exact string, per message', 'within the character limits', 'the trigger and the tap target', 'the one to send first, in one line'],
    job_test: 'Each message gives its reader a true reason to act and says what tapping does. Every acceptance test on the spec sheet passes.',
  }),
  'review-replies': Object.freeze({
    kinds: ['copy', 'email'], kind: 'copy', context: 'facts', fresh: true, light: true, levers: [],
    questions: [
      q('allowed', 'What may a public reply offer or say: an apology, a fix, a contact? Never a public refund?', 'An apology if you were at fault and a named contact; no public refund or offer.', /\b(?:refund|offer|contact|apolog\w*|don'?t|never)\b/i),
      q('signer', 'Who signs it, and where is it posted?', 'Signed by the team by first name, posted where the review is.', /\b(?:g2|trustpilot|yelp|app store|google|tripadvisor|signed?)\b/i),
    ],
    tests: [
      t('job', 'Does each reply name a specific detail the reviewer gave?'),
      t('job', 'Does it answer the complaint plainly and give one next step offline?'),
      t('ready', 'Can it be posted as it stands, within the platform\'s length?'),
      t('truth', 'Is every fact about the product or policy correct and public, with nothing private about the reviewer?'),
      t('clear', 'Would another reader see a fair, specific answer in one read?'),
    ],
    complete: ['a detail from the review in line one', 'one apology at most, only if at fault', 'one offline contact', 'nothing private or unapproved', 'within the platform length'],
    job_test: 'The reviewer, and everyone reading after them, sees a specific, fair answer and one way to get help. Every acceptance test on the spec sheet passes.',
  }),
  'crisis-response': Object.freeze({
    kinds: ['copy', 'email', 'plan', 'ops_doc'], kind: 'copy', context: 'facts', fresh: true, levers: [],
    questions: [
      q('facts', 'What is confirmed, what is not, and what is still unknown?', 'Only what your request states is treated as confirmed.', /\b(?:confirmed|we know|happened|affected|outage|incident|recall|breach|video|reporter|down|delay)\b/i),
      q('audience', 'Who must hear first, and through which channels?', 'Affected customers first, then staff, then the public, each in its own channel.', /\b(?:customers?|staff|press|reporter|public|regulators?|status page|e-?mail|social)\b/i),
      q('approver', 'Who approves it, and when is the next update due?', 'Your lead and legal approve it; the next update within 2 hours.', /\b(?:legal|approv\w*|next update|within \d+)\b/i),
    ],
    tests: [
      t('job', 'Does it say what happened, who is affected and what people should do now, from confirmed facts only?'),
      t('job', 'Does it give a specific time for the next update?'),
      t('ready', 'Can it go out as it stands on the named channel?'),
      t('truth', 'Is every statement confirmed, with unknowns said plainly and no guess at causes?'),
      t('clear', 'Would an affected person know what to do after one read?'),
    ],
    complete: ['what happened, in confirmed facts', 'who is affected', 'what to do now', 'what is still unknown', 'the next update time', 'one contact or spokesperson'],
    job_test: 'An affected person learns what happened, what to do now and when they will hear more, from confirmed facts only. Every acceptance test on the spec sheet passes.',
    variants: [{ when: /status[- ]page|incident update|outage update|\b(?:post|write|draft) (?:an? |the )?(?:quick |short )?update (?:\w+ ){0,3}(?:on|about|for) (?:the |an? |our |this |today'?s |this morning'?s )?(?:[\w-]+ ){0,2}(?:outage|incident|downtime)\b|degraded (?:performance|service)/i, unless: /\b(?:crisis|recall|breach|plan|playbook|pack|press|statement|post-?mortem|report)\b/i, ...STATUS_UPDATE }],
  }),
  'creative-brief': Object.freeze({
    kinds: ['plan', 'strategy', 'ops_doc'], kind: 'plan', context: 'facts', fresh: true, document: true, levers: [],
    questions: [
      q('objective', 'What must the campaign achieve, for whom, by when?', 'The objective and audience in your request, measured over the campaign window.', /\b(?:objective|goal|win back|target|audience|aimed at)\b/i),
      q('mandatories', 'What is fixed: budget, dates, channels, legal lines, brand rules?', 'The channels and dates in your request; brand rules from your site.', /\b(?:channels?|budget|timeline|deadline|mandator\w*|launch)\b/i),
      q('proof', 'Which reasons to believe can the agency use, and where does each come from?', 'Only facts published on your site, each with its source; placeholders where you will confirm.', /\b(?:reasons? to believe|rtbs?|proof)\b/i),
    ],
    tests: [
      t('job', 'Does it give the agency one single-minded message a team could work from?'),
      t('job', 'Does it name the audience\'s real tension or moment the work must meet?'),
      t('ready', 'Could the agency start without asking anything: deliverables with specs, dates and owners?'),
      t('truth', 'Is every reason to believe sourced, or a marked placeholder the request allows?'),
      t('clear', 'Does it fit the asked length, with the message findable in five seconds?'),
    ],
    complete: ['objective with a measure', 'audience and their tension', 'one single-minded message', 'reasons to believe with sources or placeholders', 'tone with one example line', 'mandatories', 'deliverables with specs', 'timeline with owners'],
    job_test: 'The agency can start work from it without a call: one message, one audience tension, specs and dates. Every acceptance test on the spec sheet passes.',
    scope_note: 'A brief for the agency, not the campaign: write no finished ads, emails or posts unless asked.',
  }),
  'analysis-memo': Object.freeze({
    kinds: ['analysis', 'strategy', 'plan'], kind: 'strategy', context: 'facts', fresh: true, document: true, levers: [],
    questions: [
      q('decision', 'What decision does this memo feed, who makes it and by when?', 'The decision the request names, for its asker, this quarter.', /\b(?:decide|decision|whether|recommend\w*|approve)\b/i),
      q('data', 'Which numbers can it use, and which are hypothetical for this exercise?', 'Only the numbers in your request, labelled as given, plus public facts with sources.', /\d%|\$\d|\b(?:data|numbers?|hypothetical|for this exercise|assume)\b/i),
      q('length', 'How long should it be, and who reads it?', 'One to two pages for the decision maker.', /\b(?:one|two|\d)[- ]pages?\b|\bunder \d+ words\b/i),
    ],
    tests: [
      t('job', 'Does it open with the recommendation and how sure it is?'),
      t('job', 'Does the evidence support it, with the main alternative ruled in or out?'),
      t('ready', 'Could the reader decide today, with owners, dates and a decision rule?'),
      t('truth', 'Can every figure be recomputed from the given or sourced numbers, with the working shown?'),
      t('clear', 'Are the answer and the next step on the first screen?'),
    ],
    complete: ['recommendation first', 'the numbers with their inputs and one worked example', 'what the data does and does not show', 'ranked options or hypotheses', 'risks with mitigations', 'decision rule, owners and dates'],
  }),
  'investor-update': Object.freeze({
    kinds: ['copy', 'email', 'ops_doc', 'plan', 'strategy', 'analysis', 'other'], kind: 'copy', context: 'facts', fresh: true, levers: [],
    questions: [
      q('numbers', 'Which numbers go in, for which period, and which are final?', 'Only the numbers you give, each labelled with its period.', /\$\d|\d%|\b(?:revenue|arr|mrr|burn|runway|cash|gmv|q[1-4]|quarter)\b/i),
      q('asks', 'What do you need from readers: intros, hires, decisions?', 'Up to three asks drawn from your request; none if it names none.', /\b(?:asks?|intros?|introductions?|help with|we need)\b/i),
      q('audience', 'Who reads it: investors, the board or the whole company?', 'Your investors, by email.', /\b(?:investors?|board|shareholders?|all-hands|whole company|leadership)\b/i),
    ],
    tests: [
      t('job', 'Do the first three lines give the headline result with a number and the top worry?'),
      t('job', 'Does every miss have its cause and its fix?'),
      t('ready', 'Can it be sent as it stands, with the key-numbers table filled from the given data?'),
      t('truth', 'Does every figure match the given data, with the maths recomputed and projections labelled?'),
      t('clear', 'Could a reader forward each ask in one sentence?'),
    ],
    complete: ['a summary with the headline number', 'a key-numbers table with change against last period', 'wins and misses with numbers', 'cause and fix for each miss', 'up to three specific asks', 'projections labelled as such'],
  }),
  'partnership-pitch': Object.freeze({
    kinds: ['email', 'copy', 'plan', 'strategy'], kind: 'email', context: 'facts', fresh: true, levers: [],
    questions: [
      q('partner', 'Who is the partner and the person, and what do you know about their customers?', 'The partner your request names, with facts from its public site.', /\b(?:partner(?:ship)? with|to (?:the )?(?:head|vp|director|founder|team) (?:of|at))\b/i),
      q('deal', 'What can you offer (revenue share, co-marketing, an integration), and what is off the table?', 'A small pilot with no money changing hands until it proves itself.', /\b(?:revenue share|commission|co-?market\w*|integration|pilot|referral fee)\b/i),
      q('ask', 'What first step do you want: a call, a pilot, an intro?', 'A 30-minute call to agree a pilot.', /\b(?:\d{1,2}[- ]minute|call|meeting|pilot|intro\w*)\b/i),
    ],
    tests: [
      t('job', 'Does the opening say why this partner and why now, from something true about their customers?'),
      t('job', 'Is the value to the partner concrete, with the working shown?'),
      t('ready', 'Is the first step small and specific: scope, owners and dates?'),
      t('truth', 'Is every fact about either company sourced, with no numbers promised beyond those given?'),
      t('clear', 'Could the partner say what is proposed in one sentence after one read?'),
    ],
    complete: ['why this partner, in the opening', 'the value to the partner, with the working', 'what each side gives', 'one small first step with a date', 'nothing promised beyond the request'],
  }),
  'job-description': Object.freeze({
    kinds: ['ops_doc', 'copy'], kind: 'ops_doc', context: 'facts', fresh: true, levers: [],
    questions: [
      q('role', 'What will this person own in the first year, and who do they report to?', 'The scope your request describes, reporting to you.', /\b(?:own|owns|report\w* to|responsib\w*|scope|first (?:year|90 days|six months))\b/i),
      q('pay', 'What pay range, location and working pattern can be published?', 'The range and location in your request; none is invented.', /\$\d|£\d|€\d|\b(?:salary|pay|range|remote|hybrid|on-?site|location|based in)\b/i),
      q('must', 'Which skills are must-haves, and which are nice to have?', 'Must-haves only for what the first year\'s work needs; the rest as nice to have.', /\b(?:must|required|nice to have|experience|years of)\b/i),
    ],
  }),
  // Documents about other channels: one lead, whatever channels they list.
  'creator-brief': Object.freeze({ document: true }),
  'launch-plan': Object.freeze({ document: true }),
  'social-calendar': Object.freeze({ document: true }),
  'research-design': Object.freeze({ document: true }),
  'experiment-design': Object.freeze({ document: true }),
});

/** The card's shape for this ask: its defaults with any matching variant laid over them, or null for a card with none. */
export function cardShape(card, ask = '') {
  const base = CARD_SHAPES[card];
  if (!base) return null;
  const text = String(ask ?? '');
  const variant = (base.variants ?? []).find(v => v.when.test(text) && !(v.unless && v.unless.test(text)));
  const { variants, ...rest } = base;
  if (!variant) return rest;
  if (variant.none) return null;
  const { when, unless, ...over } = variant;
  return { ...rest, ...over };
}

/** The card's own intake questions, minus those the request answers, at most `max`; null when the card has none. */
export function cardQuestions(shape, request = '', max = 3) {
  if (!shape?.questions) return null;
  const words = String(request ?? '');
  return shape.questions.filter(row => !(row.answered && row.answered.test(words))).slice(0, max).map(({ id, question, default: fallback }) => ({ id, question, default: fallback }));
}

/** A requested word limit small enough to make the piece short: "under 180 words", "no more than 150 words". */
export function shortWordLimit(text = '', max = 250) {
  const m = /\b(?:under|below|max(?:imum)?(?: of)?|no (?:more|longer) than|up to|at most|within|less than|fewer than)\s+(\d{2,4})\s+words\b/i.exec(String(text ?? ''));
  return m ? Number(m[1]) <= max : false;
}
