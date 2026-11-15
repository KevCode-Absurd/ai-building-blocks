// Synthetic structural data. These fixtures are not real host recordings or quality evidence.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import {proposeTeam} from '../../../src/jobs/propose-team.mjs';
import {craftRubric,gatesFor,suggestDeliverableKind} from '../../../src/jobs/grounding.mjs';
const rows = JSON.parse(fs.readFileSync(new URL('./contracts.json', import.meta.url), 'utf8'));
const document = schema => structuredClone(rows.find(row => row.schema === schema).valid[0].document);
export function engineFixture({ tier = 'standard' } = {}) {
  const card = document('ai-blocks-job-card/1'), team = document('ai-blocks-team-plan/2'), routes = document('ai-blocks-routes/1'), spread = document('ai-blocks-spread/1');
  card.request_verbatim = 'Write 6 documents for business owners';
  card.dials.depth.value = tier;
  card.org_context={status:'AVAILABLE',business:'Synthetic contract-test project',path:'context/org-context/index.md',sha256:'a'.repeat(64),read_by_coordinator:true};
  card.context_sources=[{id:'org-context',kind:'files',ref:card.org_context.path}];
  const pins = [0, 1, 2].map(n => ({ slug: `method-${n}`, revision_sha256: 'a'.repeat(64) }));
  for (const seat of team.seats) { seat.toolbox = pins.map(p => ({ ...p })); if (seat.seat_type === 'maker') seat.families = ['family-0', 'family-1', 'family-2']; }
  if(tier==='quick'){team.seats=team.seats.filter(s=>['s1','s2','s3','s6'].includes(s.seat_id));team.seats.find(s=>s.seat_id==='s6').seat_types=['judge','fact_checker'];routes.routes=routes.routes.slice(0,2);}
  if(tier==='deep'){team.seats.push({...structuredClone(team.seats.find(s=>s.seat_id==='s6')),seat_id:'s8',role_id:'role-8',lens:'customer-review'});}
  const items = pins.map(p => ({ ...p, name: p.slug, summary: 'Synthetic method for a contract test', type: 'skill', role: 'make', job: 'write-documents' }));
  const roles = team.seats.map(s => ({ id: s.role_id, name: s.role_id, summary: 'Write documents for business owners', department: 'operations', seat_suitability: s.seat_types, families: s.families, lenses: [s.lens], core: pins, extended: pins, resources: pins.map(p => ({ slug: p.slug, revision: p.revision_sha256 })), deliverables: ['documents'] }));
  if(tier==='deep')for(const id of ['role-9','role-10'])roles.push({...structuredClone(roles.find(r=>r.id==='role-2')),id,name:id});
  const approaches = { schema: 'ai-blocks-approach-index/1', jobs: { 'write-documents': { output_shape_default: 'many_artifacts', default_volume: 6, families: pins.map((p, n) => ({ id: `family-${n}`, name: `Document kind ${n}`, what_it_looks_like: 'A distinct synthetic test format', when_it_wins: 'For contract tests', modality: ['text'], tools_needed: [], items: [p.slug], pickers: [], checks: [], tool_guides: [], lead_roles: [], personas: [], lenses: [] })), lenses: [] } } };
  const context = { roles: { roles }, items, manifest: { resources: Object.fromEntries(items.map(i => [i.slug, { revision_sha256: i.revision_sha256 }])) }, approaches, personas: [] };
  team.proposal_id=proposeTeam({task:card.request_verbatim,job:'write-documents',job_card:card,tier,host_capabilities:{parallel_agents:true,max_parallel:4,tools:['text'],models:['fixture-model']}},context).proposal_id;
  team.amendments=[{change:'Use the cross-schema test roster.',reason:'Exercise the same known seats across all fixture documents.'}];
  const council = document('ai-blocks-council/1');
  council.critiques.forEach(c => { c.by_seat = c.by_seat === 'c1' ? 's1' : 's7'; });
  council.ranking.ballots.forEach(b => { b.by_seat = 's1'; });
  council.decision.dissent.by_seat = 's7';
  council.red_team.forEach(r => { r.by_seat = 's4'; });
  council.proposals.push({ label: 'C', ref: 'r2', owner_seat: 's4', file: 'council/c.md', content: 'Audit source records before any new investment.' });
  for (const by_seat of ['s1', 's7']) council.critiques.push({ by_seat, on: 'C', strongest_point: 'Checks evidence first', flaw_quote: 'before any new investment', flaw: 'A full audit may delay a useful small test.', would_change_mind_if: 'The source records show a large error.' });
  council.ranking.ballots[0].order.push('C'); council.ranking.result.push('C');
  if(tier==='quick'){council.proposals=council.proposals.filter(p=>p.label!=='C');council.critiques=council.critiques.filter(c=>c.by_seat==='s1'&&c.on!=='C');council.ranking.ballots[0].order=['A','B'];council.ranking.result=['A','B'];council.red_team=[];council.decision.dissent.by_seat='s1';}
  if(tier==='deep')council.red_team.push({...council.red_team[0],pass:2});
  const proposal_contents = Object.fromEntries(council.proposals.map(proposal => [proposal.file, proposal.content]));
  // Variety on substance: each rival route pins its own method and learns from its own reference.
  routes.routes.forEach((route, n) => { route.methods = [{ ...pins[n % pins.length] }]; route.references = [`Synthetic contract-test reference ${n}`]; });
  for (const route of routes.routes) {
    const proposal = council.proposals.find(proposal => proposal.ref === route.route_id);
    route.draft_receipt = { context_id: `fixture-isolated-${route.owner_seat}`, path: proposal.file, sha256: createHash('sha256').update(proposal.content).digest('hex'), isolation: 'ISOLATED', saw_other_proposals: false };
  }
  const promises = ['Make an everyday ritual feel personal','Give a meaningful anniversary gift','Understand the construction before choosing','Wear a confident festive statement','Find a light piece for office days','Commission a piece around your story'];
  const proofs = ['Close view of the actual setting','Gift presentation and size comparison','Exploded construction with sourced labels','Verified materials beside the worn piece','Measured proportions and fit view','Documented custom design steps'];
  const compositions = ['Generous side-lit portrait with one focal object','Tactile tabletop still life with generous space','Asymmetric illustrated cutaway with precise callouts','Fashion spread with a strong silhouette','Quiet overhead flat lay with scale cue','Editorial sequential panels with material details'];
  for (const [index, slot] of spread.slots.entries()) slot.concept = { audience: 'Business owners in the synthetic contract test', promise: promises[index], proof: proofs[index], composition: compositions[index], visual_world: 'A consistent synthetic test brand' };
  const production = document('ai-blocks-production/1');
  production.artifacts = spread.slots.map((slot, n) => ({ slot_id: slot.slot_id, kind: card.deliverables[0].kind, path: `deliverables/output-${n}.md`, sha256: 'a'.repeat(64), maker_seat: slot.maker_seat, family: slot.family, modality: slot.modality, items: structuredClone(slot.items), producer_note: 'A source-backed recommendation. All six outputs are delivered.', claims: [], checks: [{ id: 'useful', status: 'PASS' }], budget: { used: 0, allowance: 0 } }));
  const review = document('ai-blocks-review/1');
  // Craft criteria and pass/fail gates for the job's deliverable kind (ops_doc for this request).
  const kind = suggestDeliverableKind(card.request_verbatim).kind;
  const craft_scores = Object.fromEntries(craftRubric(kind).map(c => [c.id, 9])), gates = gatesFor(kind).map(g => ({ id: g.id, status: 'PASS', evidence: 'Synthetic structural check.' }));
  review.items = production.artifacts.map(a => ({ ...structuredClone(review.items[0]), slot_id: a.slot_id, craft_scores, gates: structuredClone(gates) }));
  review.critical_checks = [{ id: 'complete', passed: true, quote: 'All six outputs are delivered.' }];
  const delivery = document('ai-blocks-job-delivery/1');
  delivery.coordinator_review={by_seat:'s1',job_match:true,rubric_checks:[{id:'complete',passed:true,notes:'All six outputs meet the request.'}],notes:'The delivered work solves the scoped job.'};
  if (!delivery.files.some(f => f.path === 'SPREAD.md')) delivery.files.push({ path: 'SPREAD.md', sha256: 'a'.repeat(64) });
  delivery.deliverables = production.artifacts.map(a => ({ slot_id: a.slot_id, path: a.path, sha256: a.sha256 }));
  const input = { request: card.request_verbatim, mode: 'team', dials: { depth: tier }, host_capabilities: { parallel_agents: true, max_parallel: 4, tools: ['text'], models: ['fixture-model'] } };
  return { provenance: 'SYNTHETIC_STRUCTURAL_FIXTURE', input, context, card, team, routes, spread, council, production, review, delivery, events: [{ event: 'scope', document: card }, { event: 'staff', document: team }, { event: 'diverge', document: { routes, spread, proposal_contents } }, { event: 'council', document: council }, { event: 'produce', document: production }, { event: 'review', document: review }, { event: 'deliver', document: delivery }, { event: 'feedback', document: { items: [{ slot_id: 'd0', action: 'keep' }] } }] };
}
