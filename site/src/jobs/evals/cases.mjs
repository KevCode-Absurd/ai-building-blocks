// Benchmark briefs, not claims about these businesses. Record public sources before a paid host run.
export const JOB_EVAL_VERSION = 1;
const cases = [
  ['patagonia-ad-set', 'Patagonia', 'make-image-ads', 'many_artifacts', 'Make 12 different ad concepts for Patagonia from the supplied public product source pack.', 'specific'],
  ['ikea-welcome-emails', 'IKEA', 'write-emails', 'many_artifacts', 'Write a welcome email series for IKEA. Help me decide what the series should include.', 'vague'],
  ['duolingo-practice-set', 'Duolingo', 'teach-and-learn', 'many_artifacts', 'Create 10 short beginner Spanish practice activities for a Duolingo study group, with answers and different activity types.', 'specific'],
  ['canva-cover-directions', 'Canva', 'design-work', 'many_artifacts', 'Design a spread of cover directions for a Canva workshop. Work out what would make it useful.', 'vague'],
  ['allbirds-product-pages', 'Allbirds', 'write-product-pages', 'many_artifacts', 'Draft six product-page modules for Allbirds from the supplied source pack, without inventing product claims.', 'clear'],
  ['mailchimp-sales-sequences', 'Mailchimp', 'write-sales-copy', 'many_artifacts', 'Write eight outreach sequence concepts for Mailchimp, with different buyer arguments and clear source limits.', 'clear'],
  ['lego-support-replies', 'LEGO', 'customer-support', 'many_artifacts', 'Draft 10 customer-support replies for the supplied LEGO service scenarios. Separate policy facts from things we must ask.', 'clear'],
  ['decathlon-store-checklists', 'Decathlon', 'run-operations', 'many_artifacts', 'Make a set of opening, closing and stock-check aids for a Decathlon store from the supplied procedure pack.', 'clear'],
  ['buffer-growth-choice', 'Buffer', 'plan-strategy', 'one_decision', 'Compare three growth routes for Buffer using the supplied public sources. Recommend one, with dissent and the evidence that would change the choice.', 'specific'],
  ['basecamp-positioning', 'Basecamp', 'plan-strategy', 'one_decision', 'Plan how Basecamp should explain its value. I need a useful decision from the supplied source pack.', 'vague'],
  ['ikea-supplier-choice', 'IKEA', 'choose-tools', 'one_decision', 'Compare three supplier-evaluation approaches for the supplied IKEA training scenario. Make the assumptions and trade-offs clear.', 'clear'],
  ['patagonia-hiring-choice', 'Patagonia', 'hire-and-manage', 'one_decision', 'Plan a fair interview process for the supplied Patagonia job description, and compare the strongest routes.', 'clear'],
  ['monzo-incident-review', 'Monzo', 'fix-problems', 'one_decision', 'Review the supplied public Monzo incident report. Compare three prevention routes, without claiming access to private systems.', 'clear'],
  ['allbirds-cash-scenario', 'Allbirds', 'plan-budgets-and-cash', 'one_decision', 'Compare the cash-planning options in the supplied Allbirds public-data training pack. Use the stated figures only and show the limits.', 'clear'],
  ['duolingo-learning-plan', 'Duolingo', 'teach-and-learn', 'one_decision', 'Plan a way to improve a learner study group using Duolingo. Help me turn this vague request into a useful plan.', 'vague'],
  ['buffer-content-audit', 'Buffer', 'review-content', 'one_decision', 'Audit the supplied Buffer article set and recommend a 30-day content plan. Cite each factual claim and keep at least two alternatives open.', 'clear'],
  ['canva-workshop-site', 'Canva', 'build-websites', 'system_build', 'Build a three-page Canva workshop site from the supplied source pack, with an accessible sign-up flow and no unsourced claims.', 'specific'],
  ['mailchimp-onboarding-flow', 'Mailchimp', 'build-workflows', 'system_build', 'Design a Mailchimp onboarding workflow with a dry-run path, explicit approval gates and a rollback plan.', 'specific'],
  ['monzo-data-pipeline', 'Monzo', 'build-data-systems', 'system_build', 'Design a pipeline for the supplied public Monzo training data. Compare architectures and keep personal data out of the example.', 'clear'],
  ['decathlon-knowledge-system', 'Decathlon', 'organise-knowledge', 'system_build', 'Build a useful knowledge system for a Decathlon workshop from the supplied public source pack. Work out the right scope.', 'vague'],
];
export const CASES = Object.freeze(cases.map(([id, business, job, output_shape, request, clarity]) => Object.freeze({
  id, business, job, output_shape, request, clarity, expected_mode: 'team',
  recording_brief: 'Use the same saved public source pack for every arm. Source business facts before the run. Do not invent claims, tool access or results. No production actions.',
})));
export const NEGATIVE_CONTROLS = Object.freeze([
  'wide-spread-90-percent-one-family', 'maker-as-judge', 'council-without-quotes', 'near-identical-routes',
  'six-scoping-questions', 'specific-skill-routed-to-team', 'skipped-phase', 'tampered-state',
]);
