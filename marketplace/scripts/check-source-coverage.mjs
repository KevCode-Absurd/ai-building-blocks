// Reconcile source inventory with accepted cards. Presence is not retrieval or answer quality.
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export function auditSourceCoverage(sources,cards,held=[]) {
  if(!Array.isArray(sources)||!Array.isArray(cards)||!Array.isArray(held))throw new Error('Sources, cards and held entries must be arrays');
  const errors=[],bySource=new Map(),byCard=new Set(),counts=new Map(),publicCounts=new Map();
  for(const source of sources) {
    if(!source||typeof source.id!=='string'||!source.id) {errors.push('Source has no id');continue;}
    if(bySource.has(source.id))errors.push(`Duplicate source id: ${source.id}`);
    bySource.set(source.id,source);
    if(!Number.isInteger(source.cards)||source.cards<0)errors.push(`${source.id}: cards must be a non-negative integer`);
    if(source.public&&!['owned','public_reference'].includes(source.rights))errors.push(`${source.id}: public source has non-public rights`);
  }
  for(const card of cards) {
    if(!card||typeof card.id!=='string'||!card.id) {errors.push('Card has no id');continue;}
    if(byCard.has(card.id))errors.push(`Duplicate card id: ${card.id}`);
    byCard.add(card.id);
    const source=bySource.get(card.source);
    if(!source) {errors.push(`${card.id}: source not inventoried: ${card.source}`);continue;}
    counts.set(card.source,(counts.get(card.source)??0)+1);
    if(card.public&&source.public)publicCounts.set(card.source,(publicCounts.get(card.source)??0)+1);
    if(card.public&&!source.public)errors.push(`${card.id}: public card references non-public source ${card.source}`);
  }
  const rows=sources.filter(s=>s&&typeof s.id==='string').map(source=>{
    const accepted=counts.get(source.id)??0,eligible=publicCounts.get(source.id)??0;
    if(source.cards!==accepted)errors.push(`${source.id}: reported ${source.cards} cards, found ${accepted}`);
    return {id:source.id,file:source.file??null,rights:source.rights,public:source.public===true,
      accepted_cards:accepted,public_eligible_cards:eligible,
      held_cards:held.filter(h=>h?.card?.source===source.id).length,
      disposition:!accepted?'zero_accepted_cards':!eligible?'accepted_not_public':'public_cards_available',
      curation_note:source.why??''};
  });
  return {schema:'knowledge-source-coverage/1',status:errors.length?'FAIL':'PASS',errors,
    counts:{sources:bySource.size,accepted_cards:cards.length,public_eligible_cards:rows.reduce((n,s)=>n+s.public_eligible_cards,0),
      held_cards:held.length,zero_accepted_sources:rows.filter(s=>s.accepted_cards===0).length,
      accepted_nonpublic_sources:rows.filter(s=>s.disposition==='accepted_not_public').length},sources:rows,
    interpretation:'Inventory and source-to-card reconciliation only. Zero accepted cards is not a missing source; inspect its curation note. Held and non-public material are separate states. This does not prove current Drive content, semantic retrieval, source truth or answer quality.'};
}

export function readSourceCoverage(directory) {
  const read=name=>JSON.parse(readFileSync(path.join(directory,name),'utf8'));
  const cards=readdirSync(path.join(directory,'cards')).filter(f=>f.endsWith('.json')).sort().flatMap(f=>read(path.join('cards',f)));
  return auditSourceCoverage(read('sources.json'),cards,existsSync(path.join(directory,'_held.json'))?read('_held.json'):[]);
}

if(process.argv[1]&&path.resolve(process.argv[1]).toLowerCase()===fileURLToPath(import.meta.url).toLowerCase()) {
  const vertical=process.argv.find(a=>a.startsWith('--vertical='))?.slice('--vertical='.length)??'ecommerce';
  if(!/^[a-z0-9-]+$/.test(vertical)) {console.error('Invalid vertical id');process.exitCode=2;}
  else try {
    const result=readSourceCoverage(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../knowledge',vertical));
    console.log(JSON.stringify(process.argv.includes('--json')?result:{status:result.status,counts:result.counts,errors:result.errors,interpretation:result.interpretation},null,2));
    process.exitCode=result.errors.length?1:0;
  } catch(error) {console.error(error.message);process.exitCode=2;}
}
