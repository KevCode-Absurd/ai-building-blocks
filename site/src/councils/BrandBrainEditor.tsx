import type {CouncilDraft} from './council-model';
type Brain=CouncilDraft['brand_brain'];
export default function BrandBrainEditor({brain,change,attach,attached}:{brain:Brain;change:(value:Brain)=>void;attach:(file:File)=>void;attached:boolean}){
 return <details className="council-brain" open><summary>Required first: your brand or project brain <span>{brain.status==='NEEDS_BUILD'?'Build or load it first':'Context file linked'}</span></summary>
  <p>The coordinator must read an existing brain, or build and verify one, before staffing and production. Keep the real business context with every handoff.</p>
  <label className="council-field">Business or project<input aria-label="Brain business" value={brain.business} maxLength={300} placeholder="The business or project this context describes" onChange={e=>change({...brain,business:e.currentTarget.value})}/></label>
  <label className="council-field">Context brain<select aria-label="Brain status" value={brain.status} onChange={e=>change({...brain,status:e.currentTarget.value as Brain['status'],read_by_coordinator:false})}><option value="NEEDS_BUILD">Build and verify a brain first</option><option value="AVAILABLE">Reuse an existing brain</option><option value="BUILT">A verified brain was built for this job</option></select></label>
  {brain.status!=='NEEDS_BUILD'&&<><label className="council-field">Brain file or index path<input aria-label="Brain path" value={brain.path} maxLength={240} placeholder="brand-brain/INDEX.md" onChange={e=>change({...brain,path:e.currentTarget.value,read_by_coordinator:false})}/></label>
  <label className="council-field">Exact file hash<input aria-label="Brain SHA-256" className="council-brain-hash" value={brain.sha256} maxLength={64} placeholder="Add a file to calculate its SHA-256" onChange={e=>change({...brain,sha256:e.currentTarget.value,read_by_coordinator:false})}/></label>
  <label className="council-brain-read"><input type="checkbox" checked={brain.read_by_coordinator} onChange={e=>change({...brain,read_by_coordinator:e.currentTarget.checked})}/> My coordinator has read this exact brain version.</label></>}
  <label className="council-file-button">+ Add an existing brain file<input aria-label="Add brain file" type="file" accept=".md,.txt,.json,.yaml,.yml,.pdf" onChange={e=>{const file=e.currentTarget.files?.[0];if(file)attach(file);e.currentTarget.value='';}}/></label>
  <p className="council-brain-note">Files stay in this page session and are included only in your downloaded pack. {attached?'Your selected file is ready for the pack.':'For a folder-based brain, give your AI access to the index and every linked file.'}</p>
 </details>;
}
