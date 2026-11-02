// Playbook registry. Matching is lexical retrieval guidance; the host AI judges what the owner means.
import { validatePlaybook } from '../playbook-contract.mjs';
import generic from './generic-outcome.mjs';
import cpa from './reduce-paid-acquisition-cost.mjs';

export const PLAYBOOKS = [cpa, generic].map(p => Object.freeze(validatePlaybook(p)));
export const FALLBACK_PLAYBOOK = PLAYBOOKS.find(p => p.fallback);
for (const q of FALLBACK_PLAYBOOK.questions) for (const o of q.options) if (o.playbook && !PLAYBOOKS.some(p => p.id === o.playbook && !p.fallback)) throw Error(`Route option ${o.value} points at a missing playbook.`);

export function getPlaybook(id) {
  const p = PLAYBOOKS.find(p => p.id === id);
  if (!p) throw Error('Unknown outcome playbook. Call list_outcome_playbooks.');
  return p;
}

const words = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]+/g, ' ');
/** Rank specific playbooks by signal hits; the generic playbook is always the last candidate. */
export function matchPlaybooks(request = '') {
  const said = ` ${words(request).replace(/\s+/g, ' ')} `;
  const ranked = PLAYBOOKS.filter(p => !p.fallback).map(p => {
    const hits = p.signals.filter(s => said.includes(` ${words(s).trim()} `));
    return { id: p.id, name: p.name, outcome: p.outcome, score: hits.reduce((n, s) => n + s.split(' ').length, 0), matched: hits };
  }).filter(m => m.score > 0).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return [...ranked, { id: FALLBACK_PLAYBOOK.id, name: FALLBACK_PLAYBOOK.name, outcome: FALLBACK_PLAYBOOK.outcome, score: 0, matched: [] }];
}
