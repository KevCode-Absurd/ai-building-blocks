const HEAD_START='<!-- AI_BLOCKS_PRERENDER_HEAD_START -->';
const HEAD_END='<!-- AI_BLOCKS_PRERENDER_HEAD_END -->';
const BODY_START='<!-- AI_BLOCKS_PRERENDER_BODY_START -->';
const BODY_END='<!-- AI_BLOCKS_PRERENDER_BODY_END -->';
const MARKERS=[HEAD_START,HEAD_END,BODY_START,BODY_END];
function removeOwnedBlock(html,start,end){
  const first=html.indexOf(start),last=html.indexOf(end);
  if(first<0||last<first||html.indexOf(start,first+start.length)>=0||html.indexOf(end,last+end.length)>=0)throw Error('Incomplete or repeated prerender markers; run a fresh Vite build');
  return html.slice(0,first)+html.slice(last+end.length);
}
/** Recover only the exact compiled shell. Never use homepage feed links or postprocessed loaders as page defaults. */
export function readPrerenderShell(html){
  if(/<(?:link|script)\b[^>]*\bdata-home-(?:entry|full-css)\b/i.test(html))throw Error('Homepage postprocessing is complete; run a fresh Vite build before rendering again');
  if(MARKERS.some(marker=>html.includes(marker))){
    const clean=removeOwnedBlock(removeOwnedBlock(html,HEAD_START,HEAD_END),BODY_START,BODY_END);
    if(/<(?:main|div)\b[^>]*\bdata-prerendered\b/i.test(clean))throw Error('Unexpected rendered content outside the owned body');
    return clean;
  }
  if(/<(?:main|div)\b[^>]*\bdata-prerendered\b/i.test(html))throw Error('Legacy rendered homepage has no pristine-shell markers; run a fresh Vite build');
  return html;
}
/** Comments have no display effect and are ignored by the content fingerprint. */
export function injectPrerender(shell,head,body){
  if(MARKERS.some(marker=>shell.includes(marker)||head.includes(marker)||body.includes(marker)))throw Error('Prerender content collides with reserved markers');
  if(shell.split('</head>').length!==2||shell.split('<div id="root"></div>').length!==2)throw Error('Expected one compiled head and empty app root');
  return shell.replace('</head>',()=>`${HEAD_START}${head}\n  ${HEAD_END}</head>`)
    .replace('<div id="root"></div>',()=>`<div id="root">${BODY_START}${body}${BODY_END}</div>`);
}
