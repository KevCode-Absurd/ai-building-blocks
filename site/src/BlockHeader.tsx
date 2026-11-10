import type {ReactNode} from 'react';
import {type Block,type Page,kindInfo,taskOf,paidService} from './lib/data';
import {Link,libraryReturnTo} from './lib/router';
import {capSentences} from './lib/item-actions';
import {levelLabel} from './lib/item-brief.mjs';
import {formatOfKind} from './lib/formats.mjs';
import {isStaticPage} from './lib/site-nav.mjs';
import ShareButton from './ShareButton';
import {BOARD_NAMES,boardHref} from './trust-pages/board-names.mjs';
import './block-opening.css';

/** The public opening stays mounted while the task controls and references load. */
export default function BlockHeader({b,p,portrait,labels}:{b:Block;p:Page|null;portrait?:ReactNode;labels?:ReactNode}) {
 const kind=kindInfo(b),task=taskOf(b),isMind=b.type==='mind',tested=b.tested?.result==='pass';
 const format=formatOfKind(kind.id),level=levelLabel(b.level);
 // "Back to results" only makes sense after a search or filter. Visitors from Google or a shared link see "All tasks".
 const returnTo=libraryReturnTo(),fromSearch=/[?&](q|kind|job|area|task|fn|audience|starred)=[^&#]/.test(returnTo);
 return <header className="wrap bp-hero" data-testid="block-opening">
  <div className="bp-top"><Link to={fromSearch?returnTo:'/#library'} className="back" data-testid="bp-back"><span aria-hidden="true">←</span> {fromSearch?'Back to results':'All tasks'}</Link><ShareButton title={p?.headline||b.name} /></div>
  {portrait}
  {/* The format label, then the trail: every item says what it is and links up to every item of its format and its
      job. The format pages are plain pages (lib/site-nav.mjs), so that link is a normal page load. */}
  <div className="bp-kicker">
   <span className="kind" data-testid="format-label">{kind.name}</span>
   <nav className="crumbs" aria-label="Breadcrumb">
    {isStaticPage(format.path)?<a href={format.path} data-testid="format-link">{format.plural}</a>:<Link to={format.path} data-testid="format-link">{format.plural}</Link>}
    <span aria-hidden="true">›</span>
    <Link to={`/?job=${task.id}#library`}>{task.name}</Link>
   </nav>
  </div>
  <h1 className="bp-h1">{p?.headline||b.name}</h1>
  {isMind&&b.identity&&<p className="bp-identity" data-testid="mind-identity">{b.identity}</p>}
  {/* One to three sentences, so the main action below stays near the top on a phone. */}
  <p className="bp-sub">{capSentences(p?.subhead||b.summary,3)}</p>
  <p className="bp-badges" data-testid="bp-badges">
   {level&&<span>{level}</span>}
   {tested&&<span className="is-tested" data-testid="tested" title="Checked for harmful or hidden instructions">Safety checked</span>}
   {b.origin==='imported'&&b.source?.by&&<span>From {b.source.by}</span>}
   {p?.added&&<span data-testid="updated">Updated {new Date(`${p.added}T00:00:00Z`).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'})}</span>}
  </p>
  {!!p?.boards?.length&&<p className="bp-for" data-testid="bp-for"><span>For</span>{p.boards.filter(s=>Object.hasOwn(BOARD_NAMES,s)).map(s=><Link key={s} to={boardHref(s)}>{(BOARD_NAMES as Record<string,string>)[s]}</Link>)}</p>}
  {labels}
  {b.warnings?.includes('scrapes')&&<p className="bp-warn" data-testid="scrapes-note" role="note"><b>This {format.noun} scrapes websites.</b> It collects data from web pages. Before you run it, check each site's terms, follow its robots.txt and go slowly so you don't overload it. Don't collect people's personal details.</p>}
  {paidService(b)&&<p className="bp-warn" data-testid="paid-note" role="note"><b>You need a paid {paidService(b)} account.</b> This {format.noun} sends its work to {paidService(b)}, so it only runs once you add your own key. Check their prices before you start.</p>}
 </header>;
}
