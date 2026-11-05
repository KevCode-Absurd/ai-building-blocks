import {useState} from 'react';
import {pathOf,type Block,type Catalogue,type Plan} from './lib/data';
import {skillNeighbours} from './lib/skill-neighbours';
import {Link} from './lib/router';
import {download} from './lib/download';
const local=(url:string)=>url.replace(/^https:\/\/useaiblocks\.com/,'');
const Arrow=()=><svg className="skill-neighbours-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>;

type Props={block:Block;plan?:Plan;c:Catalogue;onAdd:(slugs:string[])=>void};
export default function SkillNeighbours(props:Props){return <SkillChoices key={props.block.slug} {...props}/>;}

function SkillChoices({block,plan,c,onAdd}:Props){
  const {before,after}=skillNeighbours(block.slug,plan,c.bySlug);
  const all=[...new Map([...before.map(row=>c.bySlug[row.slug]),block,...after.map(row=>c.bySlug[row.slug])].map(row=>[row.slug,row])).values()];
  const [selected,setSelected]=useState<string[]>([block.slug]);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  // The downloader with checkboxes and an order is for the few who want several skills at once: closed until asked for.
  const [picking,setPicking]=useState(false);
  const chosen=selected.map(slug=>all.find(row=>row.slug===slug)).filter((row):row is Block=>!!row);
  const toggle=(slug:string)=>{
    setMessage('');setError('');
    setSelected(previous=>{
      if(previous.includes(slug))return previous.filter(value=>value!==slug);
      const rank=all.findIndex(row=>row.slug===slug);
      const at=previous.findIndex(value=>all.findIndex(row=>row.slug===value)>rank);
      return at<0?[...previous,slug]:[...previous.slice(0,at),slug,...previous.slice(at)];
    });
  };
  const move=(index:number,delta:number)=>{
    setMessage('');
    setSelected(previous=>{const next=[...previous];[next[index],next[index+delta]]=[next[index+delta],next[index]];return next;});
  };
  const get=async(rows:Block[])=>{
    setBusy(true);setError('');setMessage('Preparing your skill files…');
    try{
      const {buildSkillSelectionZip}=await import('./lib/skill-selection-download');
      download(await buildSkillSelectionZip(rows),`${block.slug}-skills.zip`);
      setMessage(`Downloaded ${rows.length} ${rows.length===1?'skill':'skills'} with a numbered reading order.`);
    }catch(e){setMessage('');setError(e instanceof Error?e.message:'Your download could not be prepared. Try again.');}
    finally{setBusy(false);}
  };
  const choice=(row:{slug:string;name:string;url:string;note:string})=><li key={row.slug}>
    <div className="skill-neighbours-choice">{picking&&<input type="checkbox" aria-label={`Select ${row.name}`} checked={selected.includes(row.slug)} disabled={busy} onChange={()=>toggle(row.slug)}/>}<Link to={local(row.url)}>{row.name}</Link></div>
    <p className="small">{row.note}</p>
  </li>;
  return <section className="bp-next skill-neighbours" id="next" aria-labelledby="next-h" data-testid="skill-neighbours">
    <h2 className="bp-h2" id="next-h">Before and after this skill</h2>
    <p className="bp-note">What to run before this skill, and what to run with its result.</p>
    <div className="skill-neighbours-grid">
      <div className="skill-neighbours-card" data-testid="skill-before"><h3>Before</h3>{before.length?<ul>{before.map(choice)}</ul>:<p className="small">Bring the material listed under Fill it in.</p>}</div>
      <Arrow/>
      <div className="skill-neighbours-card skill-neighbours-current"><h3>This skill</h3><div className="skill-neighbours-choice">{picking&&<input type="checkbox" aria-label={`Select ${block.name}`} checked={selected.includes(block.slug)} disabled={busy} onChange={()=>toggle(block.slug)}/>}<Link to={pathOf(block)}>{block.name}</Link></div><button className="btn btn-line btn-sm" type="button" onClick={()=>onAdd([block.slug])} data-testid="add-this-skill">Add this skill to builder</button><p className="small">Then choose Add before or Add after to add another step.</p></div>
      <Arrow/>
      <div className="skill-neighbours-card" data-testid="skill-after"><h3>After</h3>{after.length?<ul data-testid="next">{after.map(choice)}</ul>:<p className="small">Use the result on its own, or choose another skill in the builder.</p>}</div>
    </div>
    <button className="link-btn small skill-neighbours-pick" type="button" aria-expanded={picking} onClick={()=>setPicking(v=>!v)} data-testid="skill-neighbours-pick">{picking?'Hide the download choices':`Download these ${all.length} skills together`}</button>
    {picking&&<div className="skill-neighbours-selection" aria-busy={busy}>
      <h3>Your selected order ({chosen.length})</h3>
      <p className="small">Move selected skills up or down to set their reading order. The ZIP includes that order and supporting files.</p>
      {chosen.length?<ol className="skill-neighbours-order" data-testid="skill-selected-order">{chosen.map((row,index)=><li key={row.slug}>
        <Link to={pathOf(row)}>{row.name}</Link>
        <span className="skill-neighbours-move"><button className="btn btn-line btn-sm" type="button" aria-label={`Move ${row.name} up`} disabled={busy||index===0} onClick={()=>move(index,-1)}>↑</button><button className="btn btn-line btn-sm" type="button" aria-label={`Move ${row.name} down`} disabled={busy||index===chosen.length-1} onClick={()=>move(index,1)}>↓</button></span>
      </li>)}</ol>:<p className="small">Select at least one skill above to download your choices.</p>}
      <div className="skill-neighbours-actions"><button className="btn btn-primary btn-sm" type="button" disabled={busy||!chosen.length} onClick={()=>void get(chosen)}>Download selected ({chosen.length})</button><button className="btn btn-line btn-sm" type="button" disabled={busy} onClick={()=>void get(all)}>Download all ({all.length})</button></div>
      <p className="small">Download all includes the skills shown above in Before → This skill → After order.</p>
      <p className="small" role="status">{message}</p>
      {error&&<p className="small" role="alert">{error}</p>}
    </div>}
  </section>;
}
