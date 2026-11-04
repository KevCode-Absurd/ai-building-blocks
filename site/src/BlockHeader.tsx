import type {ReactNode} from 'react';
import {type Block,type Page,cap,kindInfo,taskOf,paidService} from './lib/data';
import {Link,libraryReturnTo} from './lib/router';
import {capSentences} from './lib/item-actions';
import ShareButton from './ShareButton';
import './block-opening.css';

/** The public opening stays mounted while the task controls and references load. */
export default function BlockHeader({b,p,portrait,labels}:{b:Block;p:Page|null;portrait?:ReactNode;labels?:ReactNode}) {
 const kind=kindInfo(b),task=taskOf(b),isMind=b.type==='mind',tested=b.tested?.result==='pass';
 return <header className="wrap bp-hero" data-testid="block-opening">
  <div className="bp-top"><Link to={libraryReturnTo()} className="back"><span aria-hidden="true">←</span> Back to results</Link><ShareButton title={p?.headline||b.name} /></div>
  {portrait}
  <p className="bp-kicker"><span className="kind">{kind.name}</span><Link to={`/?job=${task.id}#library`}>{task.name}</Link></p>
  <h1 className="bp-h1">{p?.headline||b.name}</h1>
  {isMind&&b.identity&&<p className="bp-identity" data-testid="mind-identity">{b.identity}</p>}
  {/* One to three sentences, so the main action below stays near the top on a phone. */}
  <p className="bp-sub">{capSentences(p?.subhead||b.summary,3)}</p>
  <p className="bp-badges" data-testid="bp-badges">
   <span>{cap(b.level)}</span>
   {tested&&<span className="is-tested" data-testid="tested" title="Checked for harmful or hidden instructions">Safety checked</span>}
   {b.origin==='imported'&&b.source?.by&&<span>From {b.source.by}</span>}
   {p?.added&&<span data-testid="updated">Updated {new Date(`${p.added}T00:00:00Z`).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'})}</span>}
  </p>
  {labels}
  {b.warnings?.includes('scrapes')&&<p className="bp-warn" data-testid="scrapes-note" role="note"><b>This skill scrapes websites.</b> It collects data from web pages. Before you run it, check each site's terms, follow its robots.txt and go slowly so you don't overload it. Don't collect people's personal details.</p>}
  {paidService(b)&&<p className="bp-warn" data-testid="paid-note" role="note"><b>You need a paid {paidService(b)} account.</b> This skill sends its work to {paidService(b)}, so it only runs once you add your own key. Check their prices before you start.</p>}
 </header>;
}
