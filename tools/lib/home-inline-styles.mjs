import assert from 'node:assert/strict';
/** Homepage-only experiment: identical complete styles before first paint; optional cache warming stays in its original cascade slot. */
export function inlineHomeStyles(html,{href,css}){
 assert(html.includes('<link rel="canonical" href="https://useaiblocks.com/"'));assert(!html.includes('data-home-inline-css'));assert(!/<\/style/i.test(css));assert(!/url\(/.test(css),'Review URL bases before inlining stylesheet');
 const tag='<link rel="stylesheet" crossorigin href="'+href+'">';assert.equal(html.split(tag).length,2);
 const listener=String.raw`<script data-home-css-loader>(()=>{function loaded(event){const link=event.target;if(link instanceof HTMLLinkElement&&link.hasAttribute("data-home-css-warm")){link.media="all";document.removeEventListener("load",loaded,true);}}document.addEventListener("load",loaded,true);})();</script>`;
 let next=html.replace(tag,'<style data-home-inline-css>\n'+css+'\n</style>\n'+listener+'\n'+tag.replace('>',' media="print" data-home-css-warm>'));
 const guard='event.target instanceof HTMLLinkElement && event.target.rel === "stylesheet"';assert.equal(next.split(guard).length,2);next=next.replace(guard,guard+' && !event.target.hasAttribute("data-home-css-warm")');assert.equal(next.slice(next.indexOf('</head>')),html.slice(html.indexOf('</head>')));return next;
}
