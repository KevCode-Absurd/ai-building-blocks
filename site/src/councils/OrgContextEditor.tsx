import type {CouncilDraft} from './council-model';
type Brain=CouncilDraft['org_context'];
// The org context gate on a council (it was once called the brand brain). Saved drafts with the old field still load: see withOrgContext.
export default function OrgContextEditor({brain,change,attach,attached}:{brain:Brain;change:(value:Brain)=>void;attach:(file:File)=>void;attached:boolean}){
 return <details className="council-brain" open><summary>Required first: your org context <span>{brain.status==='NEEDS_BUILD'?'Build or load it first':'Org context linked'}</span></summary>
  <p>The coordinator must read an existing org context, or build and verify one, before staffing and production. It holds who the business is, its customers, voice, design, markets and the claims it can make. Keep it with every handoff.</p>
  <label className="council-field">Business or project<input aria-label="Org context business" value={brain.business} maxLength={300} placeholder="The business or project this org context describes" onChange={e=>change({...brain,business:e.currentTarget.value})}/></label>
  <label className="council-field">Org context<select aria-label="Org context status" value={brain.status} onChange={e=>change({...brain,status:e.currentTarget.value as Brain['status'],read_by_coordinator:false})}><option value="NEEDS_BUILD">Build and verify an org context first</option><option value="AVAILABLE">Reuse an existing org context</option><option value="BUILT">A verified org context was built for this job</option></select></label>
  {brain.status!=='NEEDS_BUILD'&&<><label className="council-field">Org context file or index path<input aria-label="Org context path" value={brain.path} maxLength={240} placeholder="context/org-context/index.md" onChange={e=>change({...brain,path:e.currentTarget.value,read_by_coordinator:false})}/></label>
  <label className="council-field">Exact file hash<input aria-label="Org context SHA-256" className="council-brain-hash" value={brain.sha256} maxLength={64} placeholder="Add a file to calculate its SHA-256" onChange={e=>change({...brain,sha256:e.currentTarget.value,read_by_coordinator:false})}/></label>
  <label className="council-brain-read"><input type="checkbox" checked={brain.read_by_coordinator} onChange={e=>change({...brain,read_by_coordinator:e.currentTarget.checked})}/> My coordinator has read this exact org context version.</label></>}
  <label className="council-file-button">+ Add an existing org context file<input aria-label="Add org context file" type="file" accept=".md,.txt,.json,.yaml,.yml,.pdf" onChange={e=>{const file=e.currentTarget.files?.[0];if(file)attach(file);e.currentTarget.value='';}}/></label>
  <p className="council-brain-note">Files stay in this page session and are included only in your downloaded pack. {attached?'Your selected file is ready for the pack.':'For an org context folder, give your AI access to index.md and every file it links.'}</p>
 </details>;
}
