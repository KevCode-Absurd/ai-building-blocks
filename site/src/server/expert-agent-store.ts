// A dedicated private store: expert records are never disguised as workflow/buyer memory.
export type ExpertRecord = { scope:string;record_id:string;version:number;kind:'profile'|'agent'|'capture';title:string;digest:string;contents:string;request_key:string;created:string };
export type ExpertRequest = {scope:string;request_key:string;request_digest:string;receipt:string;created:string};
export type ExpertStore = {
 get(scope:string,id:string,version?:number):Promise<ExpertRecord|null>;
 list(scope:string,kind:ExpertRecord['kind']):Promise<ExpertRecord[]>;
 request(scope:string,key:string):Promise<ExpertRequest|null>;
 /** All writes and the idempotency receipt commit together, or none do. */
 commit(request:ExpertRequest,records:ExpertRecord[]):Promise<boolean>;
 /** Delete exact record history; dependent private records must be removed first. */
 erase(scope:string,id:string,expected:number,digest:string):Promise<boolean>;
};
type Statement={bind(...values:unknown[]):Statement;first<T>():Promise<T|null>;all<T>():Promise<{results:T[]}>;run():Promise<{meta?:{changes?:number}}>};
export type ExpertDB={prepare(sql:string):Statement;batch(statements:Statement[]):Promise<unknown[]>};
export function d1ExpertStore(db:ExpertDB):ExpertStore {
 return {
  get:(scope,id,version)=>db.prepare(`SELECT * FROM expert_agent_versions WHERE scope=? AND record_id=?${version===undefined?' ORDER BY version DESC LIMIT 1':' AND version=?'}`).bind(scope,id,...(version===undefined?[]:[version])).first<ExpertRecord>(),
  async list(scope,kind){return (await db.prepare('SELECT v.* FROM expert_agent_versions v JOIN (SELECT record_id,MAX(version) latest FROM expert_agent_versions WHERE scope=? AND kind=? GROUP BY record_id) h ON h.record_id=v.record_id AND h.latest=v.version WHERE v.scope=? ORDER BY v.created DESC,v.record_id LIMIT 500').bind(scope,kind,scope).all<ExpertRecord>()).results;},
  request:(scope,key)=>db.prepare('SELECT * FROM expert_agent_requests WHERE scope=? AND request_key=?').bind(scope,key).first<ExpertRequest>(),
  async commit(r,records){
   if(!records.length||records.length>2||records.some(v=>v.scope!==r.scope||v.request_key!==r.request_key)||new Set(records.map(v=>v.record_id)).size!==records.length)throw Error('Invalid expert transaction.');
   try{await db.batch([
    db.prepare('INSERT INTO expert_agent_requests(scope,request_key,request_digest,receipt,created) VALUES(?,?,?,?,?)').bind(r.scope,r.request_key,r.request_digest,r.receipt,r.created),
    ...records.map(v=>db.prepare('INSERT INTO expert_agent_versions(scope,record_id,version,kind,title,digest,contents,request_key,created) VALUES(?,?,?,?,?,?,?,?,?)').bind(v.scope,v.record_id,v.version,v.kind,v.title,v.digest,v.contents,v.request_key,v.created))
   ]);return true;}catch(error){if(/expert_revision_conflict|expert_kind_conflict|UNIQUE constraint failed/i.test(String(error)))return false;throw error;}
  },
  async erase(scope,id,expected,digest){const result=await db.prepare('WITH target AS MATERIALIZED (SELECT record_id FROM expert_agent_versions WHERE scope=? AND record_id=? AND version=? AND digest=? AND version=(SELECT MAX(version) FROM expert_agent_versions WHERE scope=? AND record_id=?)) DELETE FROM expert_agent_versions WHERE scope=? AND record_id IN (SELECT record_id FROM target)').bind(scope,id,expected,digest,scope,id,scope).run();return (result.meta?.changes??0)>0;}
 };
}
export function memoryExpertStore():ExpertStore {
 const records:ExpertRecord[]=[],requests:ExpertRequest[]=[],deleted=new Set<string>();const marker=(scope:string,id:string)=>JSON.stringify([scope,id]);const clone=<T>(v:T)=>structuredClone(v);
 return {
  async get(scope,id,version){return clone(records.filter(r=>r.scope===scope&&r.record_id===id&&(version===undefined||r.version===version)).at(-1)??null);},
  async list(scope,kind){const latest=new Map<string,ExpertRecord>();for(const r of records)if(r.scope===scope&&r.kind===kind)latest.set(r.record_id,r);return [...latest.values()].sort((a,b)=>b.created.localeCompare(a.created)||a.record_id.localeCompare(b.record_id)).map(clone);},
  async request(scope,key){return clone(requests.find(r=>r.scope===scope&&r.request_key===key)??null);},
  async commit(r,rows){
   if(!rows.length||rows.length>2||rows.some(v=>v.scope!==r.scope||v.request_key!==r.request_key)||new Set(rows.map(v=>v.record_id)).size!==rows.length)throw Error('Invalid expert transaction.');
   if(requests.some(x=>x.scope===r.scope&&x.request_key===r.request_key))return false;
   if(rows.some(row=>deleted.has(marker(row.scope,row.record_id))))throw Error('expert_record_deleted');
   const own=records.filter(x=>x.scope===r.scope);let size=own.reduce((n,v)=>n+new TextEncoder().encode(v.contents).length,0),count=new Set(own.map(x=>x.record_id)).size;
   for(const row of rows){const prior=own.filter(x=>x.record_id===row.record_id).at(-1);if(row.version!==(prior?.version??0)+1||prior&&prior.kind!==row.kind)return false;
    const data=JSON.parse(row.contents),parentKind=row.kind==='agent'?'profile':row.kind==='capture'?'agent':null,parentId=row.kind==='agent'?data.profile_id:data.agent_id;
    if(parentKind&&![...own,...rows].some(parent=>parent.scope===row.scope&&parent.kind===parentKind&&parent.record_id===parentKind+':'+parentId))throw Error('expert_parent_unavailable');
    size+=new TextEncoder().encode(row.contents).length;if(!prior)count++;
    if(row.version>1000||row.version<1||size>20000000||count>500||new TextEncoder().encode(row.contents).length>600000)throw Error('expert_storage_limit');
   }
   requests.push(clone(r));records.push(...rows.map(clone));return true;
  },
  async erase(scope,id,expected,digest){
   const found=records.filter(r=>r.scope===scope&&r.record_id===id),last=found.at(-1);if(!last||last.version!==expected||last.digest!==digest)return false;
   if(records.some(r=>{if(r.scope!==scope||r.record_id===id)return false;const data=JSON.parse(r.contents);return last.kind==='profile'&&r.kind==='agent'&&'profile:'+data.profile_id===id||last.kind==='agent'&&r.kind==='capture'&&'agent:'+data.agent_id===id;}))throw Error('expert_record_in_use');
   deleted.add(marker(scope,id));for(const row of found){const request=requests.find(r=>r.scope===scope&&r.request_key===row.request_key);if(request)request.receipt=JSON.stringify({deleted:true});}
   for(let i=records.length-1;i>=0;i--)if(records[i].scope===scope&&records[i].record_id===id)records.splice(i,1);return true;
  }
 };
}
