import type {Block,Plan} from './data.ts';
type Choice={slug:string;name:string;url:string;note:string};
/** Present the existing page recommendations. No new ranking, chain planning or catalogue scan. */
export function skillNeighbours(slug:string,plan:Plan|undefined,known:Record<string,Block>){
  const unique=(rows:Choice[])=>{
    const seen=new Set<string>(),choices:Choice[]=[];
    for(const row of rows){
      if(row.slug===slug||!Object.hasOwn(known,row.slug)||seen.has(row.slug))continue;
      seen.add(row.slug);choices.push(row);if(choices.length===3)break;
    }
    return choices;
  };
  const before=plan?.chain?.length?plan.chain.map(row=>({slug:row.slug,name:row.name,url:row.url,note:row.label})):[...(plan?.needed??[]),...(plan?.helps??[])].filter(row=>row.maker).map(row=>({slug:row.maker!.slug,name:row.maker!.name,url:row.maker!.url,note:`Prepare ${row.label.replace(/^Your /,'your ')}${row.required?'':' (optional)'}.`}));
  return{before:unique(before),after:unique((plan?.next??[]).map(row=>({slug:row.slug,name:row.name,url:row.url,note:row.takes?.length?`Use it if you have the ${row.takes.join(' and ')}.`:row.label})))};
}
