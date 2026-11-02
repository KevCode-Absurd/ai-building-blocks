// Role version ledger: a role's version rises only when its own content changes.
const LABELS={remit:'scope, deliverables or inputs',expertise:'working rules',checks:'quality checks',example:'worked example'};
export function nextVersion(previous,parts,today) {
 if(previous&&previous.parts&&JSON.stringify(previous.parts)===JSON.stringify(parts))return previous;
 if(!previous)return {version:1,since:today,parts,changes:[{version:1,date:today,what:'First recorded version.'}]};
 const before=previous.parts??{},what=[];
 for(const key of Object.keys(LABELS))if(before[key]!==parts[key])what.push('Updated '+LABELS[key]+'.');
 const old=new Set((before.methods??[]).map(m=>m.split('@')[0])),now=new Set(parts.methods.map(m=>m.split('@')[0]));
 const added=[...now].filter(m=>!old.has(m)),removed=[...old].filter(m=>!now.has(m));
 if(added.length)what.push('Added methods: '+added.join(', ')+'.');
 if(removed.length)what.push('Removed methods: '+removed.join(', ')+'.');
 if(!added.length&&!removed.length&&JSON.stringify(before.methods)!==JSON.stringify(parts.methods))what.push('Source methods updated to new revisions.');
 const version=(previous.version??0)+1;
 return {version,since:today,parts,changes:[{version,date:today,what:what.join(' ')||'Content updated.'},...(previous.changes??[])].slice(0,10)};
}
