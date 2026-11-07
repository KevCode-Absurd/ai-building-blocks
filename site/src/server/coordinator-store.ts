export type StoredRecord = {scope:string;record_id:string;version:number;business_id:string;kind:'workflow'|'memory'|'outcome'|'run';title:string;digest:string;contents:string;request_key:string;request_digest:string;created:string};
export type StoredShare = {id:string;scope:string;record_id:string;version:number;token_hash:string;public_contents:string;created:string;revoked:number};
export type DeletedRequest={deleted:true;request_digest:string};
export type CoordinatorStore = {
 list(scope:string,business:string,kind:StoredRecord['kind']):Promise<StoredRecord[]>;
 get(scope:string,id:string,version?:number):Promise<StoredRecord|null>;
 request(scope:string,key:string):Promise<StoredRecord|DeletedRequest|null>;
 put(record:StoredRecord):Promise<boolean>;
 addShare(share:StoredShare):Promise<boolean>;
 shared(hash:string):Promise<StoredShare|null>;
 revoke(scope:string,id:string):Promise<boolean>;
 suppressed(scope:string):Promise<string[]>;
 erase(scope:string,id:string,expected:number):Promise<boolean>;
 deletedCount?(scope:string):Promise<number>;
};
type Statement={bind(...values:unknown[]):Statement;first<T>():Promise<T|null>;all<T>():Promise<{results:T[]}>;run():Promise<{meta?:{changes?:number}}>};
export type CoordinatorDB={prepare(sql:string):Statement;batch(statements:Statement[]):Promise<{meta?:{changes?:number}}[]>};
export function d1CoordinatorStore(db:CoordinatorDB):CoordinatorStore {
 return {
  async deletedCount(scope){return (await db.prepare('SELECT COUNT(*) count FROM coordinator_deleted_records WHERE scope=?').bind(scope).first<{count:number}>())?.count??0;},
  async list(scope,business,kind){return(await db.prepare('SELECT v.* FROM coordinator_versions v JOIN (SELECT record_id,MAX(version) latest FROM coordinator_versions WHERE scope=? AND business_id=? AND kind=? GROUP BY record_id) h ON h.record_id=v.record_id AND h.latest=v.version WHERE v.scope=? ORDER BY v.created DESC LIMIT 500').bind(scope,business,kind,scope).all<StoredRecord>()).results;},
  get:(scope,id,version)=>db.prepare(`SELECT * FROM coordinator_versions WHERE scope=? AND record_id=?${version===undefined?' ORDER BY version DESC LIMIT 1':' AND version=?'}`).bind(scope,id,...(version===undefined?[]:[version])).first<StoredRecord>(),
  async request(scope,key){const live=await db.prepare('SELECT * FROM coordinator_versions WHERE scope=? AND request_key=?').bind(scope,key).first<StoredRecord>();if(live)return live;const erased=await db.prepare('SELECT request_digest FROM coordinator_deleted_requests WHERE scope=? AND request_key=?').bind(scope,key).first<{request_digest:string}>();return erased?{deleted:true,...erased}:null;},
  async put(r){try{const result=await db.prepare('INSERT INTO coordinator_versions(scope,record_id,version,business_id,kind,title,digest,contents,request_key,request_digest,created) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(r.scope,r.record_id,r.version,r.business_id,r.kind,r.title,r.digest,r.contents,r.request_key,r.request_digest,r.created).run();return result.meta?.changes===1;}catch(error){if(/coordinator_revision_conflict|coordinator_deleted_record|coordinator_decision_unavailable|coordinator_workflow_unavailable|UNIQUE constraint failed/i.test(String(error)))return false;throw error;}},
  async addShare(s){const r=await db.prepare('INSERT INTO coordinator_shares(id,scope,record_id,version,token_hash,public_contents,created,revoked) SELECT ?,?,?,?,?,?,?,0 WHERE EXISTS(SELECT 1 FROM coordinator_versions WHERE scope=? AND record_id=? AND version=?) AND NOT EXISTS(SELECT 1 FROM coordinator_deleted_records WHERE scope=? AND record_id=?)').bind(s.id,s.scope,s.record_id,s.version,s.token_hash,s.public_contents,s.created,s.scope,s.record_id,s.version,s.scope,s.record_id).run();return r.meta?.changes===1;},
  shared:hash=>db.prepare('SELECT * FROM coordinator_shares WHERE token_hash=? AND revoked=0').bind(hash).first<StoredShare>(),
  async revoke(scope,id){const r=await db.prepare('UPDATE coordinator_shares SET revoked=1 WHERE scope=? AND id=? AND revoked=0').bind(scope,id).run();return r.meta?.changes===1;}
  ,async suppressed(scope){return (await db.prepare('SELECT DISTINCT superseded_id FROM coordinator_supersessions WHERE scope=?').bind(scope).all<{superseded_id:string}>()).results.map(r=>r.superseded_id);}
  ,async erase(scope,id,expected){const guard='EXISTS(SELECT 1 FROM coordinator_versions WHERE scope=? AND record_id=? GROUP BY record_id HAVING MAX(version)=?)';const result=await db.batch([db.prepare(`UPDATE coordinator_shares SET revoked=1,public_contents='' WHERE scope=? AND record_id=? AND ${guard}`).bind(scope,id,scope,id,expected),db.prepare(`DELETE FROM coordinator_versions WHERE scope=? AND record_id=? AND ${guard}`).bind(scope,id,scope,id,expected)]);return (result[1].meta?.changes??0)>0;}
 };
}
export function memoryCoordinatorStore():CoordinatorStore {
 const records:StoredRecord[]=[],shares:StoredShare[]=[],suppressed=new Map<string,Set<string>>(),deleted=new Set<string>(),requests=new Map<string,DeletedRequest>();const marker=(scope:string,id:string)=>JSON.stringify([scope,id]);const clone=<T>(x:T)=>structuredClone(x);
 return {
  async deletedCount(scope){return [...deleted].filter(marker=>JSON.parse(marker)[0]===scope).length;},
  async list(scope,business,kind){const latest=new Map<string,StoredRecord>();for(const r of records)if(r.scope===scope&&r.business_id===business&&r.kind===kind)latest.set(r.record_id,r);return [...latest.values()].sort((a,b)=>b.created.localeCompare(a.created)).map(clone);},
  async get(scope,id,version){return clone(records.filter(r=>r.scope===scope&&r.record_id===id&&(version===undefined||r.version===version)).at(-1)??null);},
  async request(scope,key){return clone(records.find(r=>r.scope===scope&&r.request_key===key)??requests.get(marker(scope,key))??null);},
  async put(r){if(deleted.has(marker(r.scope,r.record_id))||requests.has(marker(r.scope,r.request_key)))return false;const own=records.filter(x=>x.scope===r.scope),prior=own.filter(x=>x.record_id===r.record_id).at(-1);if(r.version!==(prior?.version??0)+1||own.some(x=>x.request_key===r.request_key))return false;if(prior&&(prior.kind!==r.kind||prior.business_id!==r.business_id))throw Error('coordinator_scope_conflict');if(r.kind==='outcome'){const outcome=JSON.parse(r.contents);if(!records.some(d=>d.scope===r.scope&&d.record_id===outcome.decision_id&&d.version===outcome.decision_version&&d.business_id===r.business_id&&d.kind==='memory'&&JSON.parse(d.contents).kind==='decision'))return false;}if(r.kind==='run'){const run=JSON.parse(r.contents);if(run.workflow_id&&!records.some(d=>d.scope===r.scope&&d.record_id===run.workflow_id&&d.version===run.workflow_version&&d.business_id===r.business_id&&d.kind==='workflow'&&JSON.stringify(JSON.parse(d.contents).plan)===JSON.stringify(run.plan)))return false;}if(r.version>100||new TextEncoder().encode(own.map(x=>x.contents).join('')+r.contents).length>20000000||r.version===1&&new Set(own.map(x=>x.record_id)).size>=500)throw Error('coordinator_storage_limit');records.push(clone(r));const old=r.kind==='memory'?JSON.parse(r.contents).supersedes:null;if(old){if(!suppressed.has(r.scope))suppressed.set(r.scope,new Set());suppressed.get(r.scope)!.add(old);}return true;},
  async addShare(s){if(deleted.has(marker(s.scope,s.record_id))||!records.some(r=>r.scope===s.scope&&r.record_id===s.record_id&&r.version===s.version))return false;shares.push(clone(s));return true;},async shared(hash){return clone(shares.find(x=>x.token_hash===hash&&!x.revoked)??null);},async revoke(scope,id){const s=shares.find(x=>x.scope===scope&&x.id===id&&!x.revoked);if(!s)return false;s.revoked=1;return true;}
  ,async suppressed(scope){return [...(suppressed.get(scope)??[])];}
  ,async erase(scope,id,expected){const found=records.filter(r=>r.scope===scope&&r.record_id===id);if(found.at(-1)?.version!==expected)return false;if(records.some(r=>r.scope===scope&&(r.kind==='outcome'&&JSON.parse(r.contents).decision_id===id||r.kind==='run'&&JSON.parse(r.contents).workflow_id===id)))throw Error('coordinator_record_in_use');deleted.add(marker(scope,id));for(const r of found)requests.set(marker(scope,r.request_key),{deleted:true,request_digest:r.request_digest});for(let i=records.length-1;i>=0;i--)if(records[i].scope===scope&&records[i].record_id===id)records.splice(i,1);for(const s of shares)if(s.scope===scope&&s.record_id===id){s.revoked=1;s.public_contents='';}return true;}
 };
}
