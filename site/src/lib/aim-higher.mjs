// Aim higher: three short questions after someone types a request, and the better prompt their own AI gets.
// The ideas come from Felix Rieseberg's article on being more ambitious with AI (the Ambition planner skill),
// with the question style of the Intent interviewer: a guess-able example, and better, not bigger.
// Pure text, no model calls: the rewrite happens in the person's own AI.

export const AIM_SKILL = { slug: 'ambition-planner', path: '/skills/ambition-planner', name: 'Ambition planner' };

export const AIM_QUESTIONS = [
  { id: 'next', ask: 'What should happen after this is done?', example: 'More bookings this month, fewer refund emails, a decision by Friday', label: 'What should happen after' },
  { id: 'proof', ask: 'How will you know it worked, other than your AI saying so?', example: '5 replies from 50 emails within 2 weeks', label: 'How we will know it worked' },
  { id: 'not', ask: 'What should it not do or include?', example: 'No discounts, no new tools, keep it to one page', label: 'Leave out' },
];
export const AIM_MAX = 300;

const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, AIM_MAX);

/** The answered questions as short labelled lines, ready to add to a request or a plan's context. Empty when nothing is answered. */
export function aimHigherText(answers = {}) {
  return AIM_QUESTIONS.map(q => [q.label, clean(answers[q.id])]).filter(([, a]) => a).map(([label, a]) => `${label}: ${a}`).join('\n');
}

/** True when at least one question has an answer. */
export const hasAim = (answers = {}) => AIM_QUESTIONS.some(q => clean(answers[q.id]));

/** A better prompt for any chat AI: the request, the answers, and the aim-higher steps in plain words. */
export function aimHigherPrompt(request, answers = {}) {
  const words = String(request ?? '').trim().replace(/\n{3,}/g, '\n\n') || '(say what you need in your own words)';
  const given = aimHigherText(answers);
  return [
    'Here is what I need:',
    '',
    `"${words}"`,
    ...(given ? ['', given] : []),
    '',
    'Before you start, aim higher. Make it better, not bigger:',
    `1. Say in one line what I want to happen after this is done. ${clean(answers.next) ? 'Use my answer above.' : 'Give me your best guess so I can say yes or correct it.'}`,
    '2. Say what a top expert in this field would do here that I did not ask for, what raw material they would start from (the real export, numbers or files, not a summary) and which methods they would use. Then do it that way.',
    `3. End with a check, other than you or me, that shows it worked, and what counts as a pass.${clean(answers.proof) ? ' Start from my answer above.' : ''}`,
    '4. Ask me your questions in one batch, each with your best guess. If you need data or access you do not have, say what is missing and what it would unlock. Never make it up.',
    '5. Do not add extra deliverables. Ask before anything that costs money, goes live or cannot be undone.',
  ].join('\n');
}
