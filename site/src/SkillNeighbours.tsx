import type {Block,Catalogue,Plan} from './lib/data';
import {skillNeighbours} from './lib/skill-neighbours';
import {Link} from './lib/router';
const local=(url:string)=>url.replace(/^https:\/\/useaiblocks\.com/,'');
const Arrow=()=><svg className="skill-neighbours-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>;

export default function SkillNeighbours({block,plan,c,onAdd}:{block:Block;plan?:Plan;c:Catalogue;onAdd:(slugs:string[])=>void}){
  const {before,after}=skillNeighbours(block.slug,plan,c.bySlug);
  return <section className="bp-next skill-neighbours" id="next" aria-labelledby="next-h" data-testid="skill-neighbours">
    <h2 className="bp-h2" id="next-h">Before and after this skill</h2>
    <p className="bp-note">Choose the steps you need. Bring your own material when you have it.</p>
    <div className="skill-neighbours-grid">
      <div className="skill-neighbours-card" data-testid="skill-before"><h3>Before</h3>{before.length?<ul>{before.map(row=><li key={row.slug}><Link to={local(row.url)}>{row.name}</Link><p className="small">{row.note}</p></li>)}</ul>:<p className="small">Bring the material listed under Fill it in.</p>}</div>
      <Arrow/>
      <div className="skill-neighbours-card skill-neighbours-current"><h3>This skill</h3><p><b>{block.name}</b></p><button className="btn btn-line btn-sm" type="button" onClick={()=>onAdd([block.slug])} data-testid="add-this-skill">Add this skill to builder</button><p className="small">Then choose Add before or Add after to add another step.</p></div>
      <Arrow/>
      <div className="skill-neighbours-card" data-testid="skill-after"><h3>After</h3>{after.length?<ul data-testid="next">{after.map(row=><li key={row.slug}><Link to={local(row.url)}>{row.name}</Link><p className="small">{row.note}</p></li>)}</ul>:<p className="small">Use the result on its own, or choose another skill in the builder.</p>}</div>
    </div>
  </section>;
}
