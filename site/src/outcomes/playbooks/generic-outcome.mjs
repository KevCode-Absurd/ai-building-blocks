// Fallback for any outcome without its own playbook. Stages name an area; the host routes each to specialists at run time.
const out = (id, name, format, path) => ({ id, name, format, path });
const check = (id, name, required = true) => ({ id, name, required });

export default {
  schema: 'ai-blocks-outcome-playbook/1', id: 'generic-outcome', version: 1, fallback: true,
  name: 'Get any outcome done',
  outcome: 'Pin down a vague problem into a measured outcome, then gather evidence, diagnose, choose, build, launch, measure and learn, with specialists chosen for each stage.',
  questions: [
    { id: 'route', ask: 'Which of these hurts most right now?', why: 'Picks the playbook. A specific playbook carries expert know-how the generic one lacks.', affects: ['diagnosis'], required: true, options: [
      { value: 'acquisition-cost', label: 'Getting customers costs more (ad costs, CPA, CAC, ROAS)', playbook: 'reduce-paid-acquisition-cost' },
      { value: 'revenue', label: 'Sales or revenue are down' },
      { value: 'conversion', label: 'Visitors don\'t buy or sign up' },
      { value: 'retention', label: 'Customers don\'t come back or they cancel' },
      { value: 'traffic', label: 'Fewer people find us (search, social)' },
      { value: 'costs', label: 'Costs or margins (not marketing)' },
      { value: 'operations', label: 'Something in operations, support or delivery' },
      { value: 'product', label: 'A product, feature or piece of software' },
      { value: 'other', label: 'Something else' },
    ] },
    { id: 'measure', ask: 'Which number shows the problem, what was it, what is it now, and since when?', why: 'Turns a feeling into a baseline we can check and steer by.', affects: ['evidence', 'diagnosis'], required: true },
    { id: 'goal', ask: 'What would "fixed" look like, and by when?', why: 'Becomes the target in the brief.', affects: ['options'], required: true },
    { id: 'limits', ask: 'What must not get worse, and what may we not change?', why: 'Sets guardrails and what needs your approval.', affects: ['options', 'decision', 'execution'], required: true },
    { id: 'connections', ask: 'Which tools, accounts, files or exports can your AI reach for this?', why: 'Decides whether we read the data ourselves or send you exact steps to get it.', affects: ['evidence'], required: true },
    { id: 'changes', ask: 'Did anything change around when this started?', why: 'Recent changes are the first suspects.', affects: ['diagnosis'], required: false },
  ],
  capabilities: [
    { id: 'source-read', access: 'read', why: 'Read the systems that hold the evidence.', examples: ['The relevant MCP connection', 'A CSV or file export'] },
    { id: 'make-draft', access: 'draft', why: 'Produce the deliverables as editable files.', examples: ['Local files', 'Documents', 'Code changes on a branch'] },
    { id: 'live-change', access: 'live', why: 'Apply approved changes to live systems.', examples: ['The relevant MCP write tools', 'A deploy'] },
  ],
  data: [
    { id: 'main-evidence', name: 'The data behind the number', why: 'Every finding rests on it.', fields: ['the metric over time', 'the splits that matter for this outcome'], routes: [{ kind: 'MCP', how: 'Read it with a connected tool.' }, { kind: 'CSV', how: 'Export it for both the period before and after the change.' }], required_for: ['evidence'], alternative: 'Owner-reported figures support a bounded first look only.' },
  ],
  stages: [
    { id: 'intake', kind: 'intake', name: 'Pin down the problem', goal: 'Turn the owner\'s words into a measured problem, a target and limits. Switch to a specific playbook when one fits. Writes BRIEF.md.', owner: { area: 'all' }, gate: 'none' },
    { id: 'context', kind: 'context', name: 'Load the right context', goal: 'Reuse or build the context this domain needs: a brand brain for marketing, repo context for code, the chart of accounts for finance.', owner: { area: 'all' }, depends_on: ['intake'], outputs: [out('context-check', 'Context check', 'markdown', 'context/CONTEXT-CHECK.md')], checks: [check('sources', 'Facts name their source and date')], gate: 'review' },
    { id: 'evidence', kind: 'evidence', name: 'Gather the evidence', goal: 'Collect the data for comparable periods into one working dataset.', owner: { area: 'data' }, data: ['main-evidence'], needs: ['source-read'], depends_on: ['intake'], outputs: [out('evidence', 'Evidence notes and dataset', 'markdown', 'evidence/EVIDENCE.md')], checks: [check('periods', 'Covers before and after'), check('totals', 'Totals match the source system')], gate: 'none' },
    { id: 'integrity', kind: 'integrity', name: 'Check the evidence can be trusted', goal: 'Check definitions, gaps, double counting and changes in how data was collected.', owner: { area: 'data' }, depends_on: ['evidence'], outputs: [out('integrity', 'Evidence check', 'markdown', 'integrity/INTEGRITY.md')], checks: [check('verdict', 'Ends with CHECKED, LIMITED or UNRELIABLE')], gate: 'review' },
    { id: 'diagnosis', kind: 'diagnosis', name: 'Find what is really going on', goal: 'Write hypotheses, test each against the evidence, and keep competing explanations.', owner: { area: 'all' }, depends_on: ['context', 'integrity'], outputs: [out('diagnosis', 'Diagnosis', 'markdown', 'diagnosis/DIAGNOSIS.md'), out('hypotheses', 'Hypothesis verdicts', 'json', 'diagnosis/hypotheses.json')], checks: [check('verdicts', 'Every hypothesis is SUPPORTED, REFUTED or UNKNOWN, with evidence'), check('alternatives', 'Main findings name a competing explanation')], gate: 'none' },
    { id: 'options', kind: 'options', name: 'Rank what to change', goal: 'Ranked recommendation cards, each tied to a finding, with effect, effort, confidence, risk and measurement.', owner: { area: 'all' }, depends_on: ['diagnosis'], outputs: [out('recommendations', 'Recommendation cards', 'markdown', 'options/RECOMMENDATIONS.md')], checks: [check('evidence', 'Every card cites its finding')], gate: 'review' },
    { id: 'decision', kind: 'decision', name: 'Owner chooses', goal: 'Owner picks card IDs; record reasons where the top card was passed over.', owner: { area: 'all' }, depends_on: ['options'], outputs: [out('decision', 'Chosen plan', 'markdown', 'decision/DECISION.md')], checks: [check('recorded', 'Choices are in decisions.jsonl')], gate: 'approve' },
    { id: 'production', kind: 'production', name: 'Build the chosen work', goal: 'Specialists for each chosen card produce real, checked deliverables.', owner: { area: 'all' }, needs: ['make-draft'], depends_on: ['decision', 'context'], outputs: [out('deliverables', 'Deliverables for review', 'markdown', 'production/DELIVERABLES.md')], checks: [check('checked', 'Each deliverable passed its specialist\'s checks'), check('traced', 'Each traces to a chosen card')], gate: 'review' },
    { id: 'execution', kind: 'execution', name: 'Put it live', goal: 'Apply approved changes, read back the live state, register each test first.', owner: { area: 'all' }, needs: ['live-change'], depends_on: ['production'], outputs: [out('receipt', 'Action receipt', 'markdown', 'execution/RECEIPT.md')], checks: [check('read-back', 'Every change was read back'), check('registered', 'Each test is in experiments.jsonl before it goes live')], gate: 'approve_each_action', optional_when: 'Nothing chosen needs a live change.' },
    { id: 'measurement', kind: 'measurement', name: 'Read the results honestly', goal: 'Compare against the registered metric and limits; verdict only with enough volume.', owner: { area: 'data' }, depends_on: ['execution'], outputs: [out('readout', 'Results readout', 'markdown', 'measurement/READOUT.md')], checks: [check('volume', 'Verdict only with enough volume; otherwise INCONCLUSIVE'), check('guardrails', 'Every guardrail checked')], gate: 'none' },
    { id: 'learning', kind: 'learning', name: 'Keep what we learned', goal: 'Close experiments, propose scoped rules, plan the next round.', owner: { area: 'all' }, depends_on: ['measurement'], outputs: [out('learnings', 'Learnings and next round', 'markdown', 'learning/LEARNINGS.md')], checks: [check('closed', 'Every experiment closed')], gate: 'review' },
  ],
  deliverable: { name: 'The chosen outcome work, built, launched where needed, and measured', done: ['Problem measured with a target and limits', 'Diagnosis with evidence', 'Owner-chosen plan with reasons', 'Deliverables built and checked', 'Live changes approved and read back', 'Results read honestly', 'Learnings saved'] },
};
