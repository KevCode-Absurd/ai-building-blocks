import {lazy,Suspense,useEffect,useState} from 'react';
import {type Catalogue,type Page,loadPage} from './lib/data';
import {StartupReady} from './StartupReady';
import BlockHeader from './BlockHeader';

type Props={c:Catalogue|null;slug:string;toast:(message:string)=>void;toBuilder:(slugs:string[],asNew?:string)=>void;initialPage?:Page|null;onPageLoaded?:(page:Page|null)=>void;standalone?:boolean};
function Pending(){return <div className="wrap block-opening-pending"><p className="small" role="status">Opening the task controls…</p></div>;}
// Begin the body download while the selected item data is arriving. The complete
// header is independent of that chunk and is not replaced when it resolves.
const Body=lazy(async()=>{const {default:BlockPage}=await import('./BlockPage');return {default:(props:Props)=>props.c?<BlockPage {...props} c={props.c} embedded={!props.standalone}/>:<Pending/>};});
export default function BlockRoute(props:Props){
 const [page,setPage]=useState<Page|null|undefined>(undefined);
 useEffect(()=>{let active=true;if(!props.c)return;void loadPage(props.slug).then(p=>{if(active)setPage(p);}).catch(()=>{if(active)setPage(null);});return()=>{active=false;};},[props.c,props.slug]);
 const b=props.c?.bySlug[props.slug];
 if(props.c&&!b)return <Suspense fallback={<Pending/>}><Body {...props} standalone/></Suspense>;
 if(!b||page===undefined)return <Suspense fallback={<Pending/>}><Body {...props} c={null}/></Suspense>;
 return <main className="bp" data-testid="block-page" data-slug={b.slug}>
  <BlockHeader b={b} p={page}/><StartupReady/>
  <Suspense fallback={<Pending/>}><Body {...props} initialPage={page} onPageLoaded={setPage}/></Suspense>
 </main>;
}
