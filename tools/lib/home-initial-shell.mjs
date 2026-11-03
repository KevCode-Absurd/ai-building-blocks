import assert from 'node:assert/strict';

// Preserve complete selected compiled rules, including their original media
// contexts. No declarations or values are invented for the shared UI.
export function homeCriticalCss(css) {
  const keep=/^(?::root|\*|html\b|body\b|a$|button,|:focus-visible|\.wrap\b|\.h1\b|\.lede\b|\.btn\b|\.btn-|\.icon-btn\b|\.header\b|\.header-in\b|\.brand\b|\.hero\b|\.hero-in\b|\.hero-actions\b|\.site-|\.small\b|\.skip-link\b)/;
  function selected(input) {
    let result='',start=0;
    while(start<input.length){
      const open=input.indexOf('{',start);if(open<0)break;
      const head=input.slice(start,open).trim();let depth=1,end=open+1,quote='';
      for(;end<input.length&&depth;end++){
        const ch=input[end];if(quote){if(ch==='\\')end++;else if(ch===quote)quote='';}
        else if(ch==='"'||ch==="'")quote=ch;else if(ch==='{')depth++;else if(ch==='}')depth--;
      }
      assert.equal(depth,0,'Unbalanced compiled CSS');
      const body=input.slice(open+1,end-1);
      if(/^@(?:media|supports|layer)\b/.test(head)){const nested=selected(body);if(nested)result+=head+'{'+nested+'}';}
      else if(keep.test(head))result+=head+'{'+body+'}';
      start=end;
    }
    return result;
  }
  const out=selected(css);assert(out.includes('.site-menu-trigger{'));assert(out.includes('.hero .lede{'));assert(/@media\s*\(max-width:520px\)/.test(out));assert(out.length<12000);return out;
}

const arrow='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const sun='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
const moon='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
function mark(){return ["..###..", ".#+# +#.".replace(" ",""), "#+# +#+#".replace(" ",""), "##+#+##", "#+# +#+#".replace(" ",""), ".#+# +#.".replace(" ",""), "..###.."].map((row,y)=>[...row].map((c,x)=>c==='.'?'':`<rect x="${x*3.4+.3}" y="${y*3.4+.3}" width="2.9" height="2.9" fill="currentColor"${c==='+'?' opacity="0.32"':''}/>`).join('')).join('');}
// Same Bayer-mask formula as the frozen pixel.ts installDither(), restricted to
// the one hero mask required before that module executes.
function heroMask(){let b=[[0]];while(b.length<4){const k=b.length;b=Array.from({length:k*2},(_,y)=>Array.from({length:k*2},(_,x)=>4*b[y%k][x%k]+[0,2,3,1][(y>=k?2:0)+(x>=k?1:0)]));}let d='';for(let y=0;y<32;y++)for(let x=0;x<4;x++)if(b[y%4][x%4]<((y+.5)/32)*16)d+=`M${x} ${y}h1v1h-1z`;return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="4" height="32" viewBox="0 0 4 32" shape-rendering="crispEdges"><path d="${d}"/></svg>`)}")`;}
function link(href,text,extra=''){return `<a href="${href}"${extra}>${text}</a>`;}
function shell(){return `<div id="app-loader" data-home-shell>
<a class="skip-link" href="#home-shell-main">Skip to content</a>
<header class="header site-header"><div class="wrap header-in"><a href="/" class="brand" aria-label="AI Blocks, home"><svg viewBox="0 0 24 24" aria-hidden="true" class="logo" data-testid="logo">${mark()}</svg>AI Blocks</a><div class="site-menu"><button type="button" class="btn btn-line site-menu-trigger" aria-expanded="false" aria-controls="home-shell-menu" data-testid="menu-btn">Menu<span aria-hidden="true">+</span></button><nav id="home-shell-menu" class="site-menu-links" aria-label="Sections" hidden>
<section class="site-menu-account" aria-label="My account">${link('/account?view=settings','My Account',' class="site-menu-account-link"')}<p class="small">Opening your account…</p>${link('/account','My work',' data-testid="open-saved-work"')}<p class="small" role="status">Checking your account…</p></section>
<section aria-label="Start a task">${link('/#library','Find a task',' aria-current="page"')}${link('/#build','Workflow Builder')}${link('/compose','Plan a job',' data-testid="nav-compose"')}<div class="site-menu-types" aria-label="Task formats">${[['prompt','Prompts'],['skill','Skills'],['workflow','Workflows'],['agent','Agents']].map(([kind,label])=>link('/?kind='+kind+'#library',label)).join('')}</div></section>
<section aria-label="Explore">${[['/community','Community skills & workflows'],['/publish','Submit your skill or workflow'],['/minds','Minds'],['/tools','Browser tools'],['/apps','Apps'],['/ai-tools','AI tools'],['/tools/growth-channel-planner','Growth planner'],['/from-a-source','Create skills from content'],['/space','Team space']].map(([href,text])=>link(href,text.replace('&','&amp;'))).join('')}<button type="button" data-home-business>Business details</button></section>
<div class="site-menu-appearance"><span>Appearance</span><button class="icon-btn" aria-label="Switch to light mode" title="Switch to light mode" data-testid="theme-toggle">${sun}</button></div>
<section aria-label="Help">${[['/how-it-works','How to use AI Blocks'],['/api-and-mcp','API & MCP'],['/api-and-mcp#api','Documentation'],['/support','Help & contact']].map(([href,text])=>link(href,text.replace('&','&amp;'))).join('')}</section></nav></div></div></header>
<main id="home-shell-main" tabindex="-1"><section class="hero"><div class="wrap hero-in"><h1 class="h1">Get your ads, emails and plans done with AI</h1><p class="lede typed" data-done="true">Type what you need done. Then copy free instructions into the chatbot you use. Or hire a specialist for the whole task.</p><form class="hero-goal" action="/#library" method="get" role="search"><input name="q" type="search" aria-label="What do you want to get done?" placeholder="What do you want to get done?" autocomplete="off" maxlength="300" data-testid="hero-goal"><button type="submit" class="btn btn-primary">Find help ${arrow}</button></form><div class="hero-actions">${link('/roles','Hire an AI specialist '+arrow,' class="btn btn-line" data-testid="hero-hire"')}${link('/compose','Plan a job '+arrow,' class="btn btn-line" data-testid="hero-build-workflow"')}</div><p class="hero-connect small" data-testid="hero-connect"><a href="/api-and-mcp">Connect your AI once</a>. Then it pulls any skill or workflow it needs, when it needs it.</p></div></section></main>
<div class="boot-recovery"><p>This is taking longer than expected.</p><a href="">Try again</a><a href="/jobs">Browse the library</a></div></div>`;}

export function patchHomeInitialShell(html,{css,cssHref,introFont,introCodepoints,introText}){
  assert(html.includes('<link rel="canonical" href="https://useaiblocks.com/"'));assert(!html.includes('data-home-shell'));
  const tag='<link rel="stylesheet" crossorigin href="'+cssHref+'">';assert.equal(html.split(tag).length,2);
  const critical=homeCriticalCss(css);
  const initialShell=shell();
  const intro=initialShell.match(/<p class="lede typed" data-done="true">([^<]+)<\/p>/)?.[1];
  assert(intro && introFont instanceof Uint8Array && introFont.length<10000,'Expected the verified small intro font');
  assert.equal(intro,introText,'Keep the initial and interactive introductions equal');
  assert(Array.isArray(introCodepoints) && [...intro].every(char=>introCodepoints.includes(char.codePointAt(0))),'Rebuild the intro font after changing its copy');
  const introCss=`@font-face{font-family:"AI Blocks Intro Mono";font-style:normal;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,${Buffer.from(introFont).toString('base64')}) format("woff2")}html .hero .lede{font-family:"AI Blocks Intro Mono",var(--mono)}`;
  let next=html.replace(tag,tag.replace('>',' media="print" data-home-full-css>')+'<noscript>'+tag+'</noscript>');
  const start=next.indexOf('    <!-- APP_LOADER_START -->'),end=next.indexOf('    <!-- APP_LOADER_END -->');assert(start>=0&&end>start);
  next=next.slice(0,start)+'    <!-- APP_LOADER_START -->\n'+initialShell+'\n<script>updateShellTheme();</script>\n'+next.slice(end);
  const readyStart=next.indexOf('document.addEventListener("abb:ready", function () {'),readyEnd=next.indexOf('      }, { once: true });',readyStart);assert(readyStart>=0&&readyEnd>readyStart);
  let original=next.slice(readyStart+'document.addEventListener("abb:ready", function () {'.length,readyEnd);
  original=original.replace('        document.documentElement.dataset.boot = "ready";',`        const shell=document.getElementById("app-loader"), active=document.activeElement;
        const focused=shell?.contains(active)?active:null;
        const opened=shell?.querySelector('[data-testid="menu-btn"]')?.getAttribute("aria-expanded")==="true";
        const hero=shell?.querySelector('.hero-in'), heroHost=document.querySelector('#root [data-home-hero-host]');
        // Move only at the existing app-and-CSS readiness gate: no blank frame,
        // new text node or duplicate introduction during the handoff.
        if(hero&&heroHost)heroHost.appendChild(hero);
        document.documentElement.dataset.boot = "ready";`);
  original=original.replace('        setTimeout(function () { document.getElementById("app-loader")?.remove(); }, 200);',`        queueMicrotask(function(){
          const root=document.getElementById("root"), trigger=root?.querySelector('[data-testid="menu-btn"]');
          if(trigger&&(trigger.getAttribute("aria-expanded")==="true")!==opened)trigger.click();
          requestAnimationFrame(function(){
            if(homeIntent==="library"){
              const focusSearch=function(){const input=root?.querySelector('[data-testid="library-search"]');if(input&&!input.disabled){input.focus({preventScroll:true});return true;}return false;};
              if(!focusSearch()){const observer=new MutationObserver(function(){if(focusSearch())observer.disconnect();});observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:["disabled"]});setTimeout(()=>observer.disconnect(),12000);}
            }else if(homeIntent==="build")root?.querySelector('[data-testid="hero-build-workflow"]')?.focus({preventScroll:true});
            else if(focused){const test=focused.getAttribute("data-testid"),href=focused.getAttribute("href");const target=focused.id==="home-shell-main"||href==="#home-shell-main"?root?.querySelector("#main-content"):test?root?.querySelector('[data-testid="'+test+'"]'):[...root.querySelectorAll('a[href]')].find(a=>a.getAttribute("href")===href);target?.focus({preventScroll:true});}
            if(homeBusiness)window.dispatchEvent(new Event("abb:business-open"));
          });
        });
        setTimeout(function () { document.getElementById("app-loader")?.remove(); }, 200);`);
  const boot=`let homeAppReady=false,homeCssReady=false,homeRevealed=false,homeIntent="",homeBusiness=false;
      function revealHome(){if(!homeAppReady||!homeCssReady||homeRevealed||bootStyleFailed)return;homeRevealed=true;${original}}
      document.addEventListener("abb:ready",function(){homeAppReady=true;revealHome();},{once:true});
      document.addEventListener("load",function(event){const link=event.target;if(link instanceof HTMLLinkElement&&link.hasAttribute("data-home-full-css")){link.media="all";homeCssReady=true;revealHome();}},true);
      document.addEventListener("click",function(event){
        const shell=document.getElementById("app-loader"),target=event.target instanceof Element?event.target:null;if(!shell||!target||!shell.contains(target))return;
        const trigger=shell.querySelector('[data-testid="menu-btn"]'),menu=shell.querySelector("#home-shell-menu");
        if(target.closest('[data-testid="menu-btn"]')){const open=trigger.getAttribute("aria-expanded")!=="true";trigger.setAttribute("aria-expanded",String(open));trigger.innerHTML=(open?"Close menu":"Menu")+'<span aria-hidden="true">'+(open?"−":"+")+"</span>";menu.hidden=!open;if(open)menu.querySelector("a[href]")?.focus();}
        else if(target.closest('[data-testid="theme-toggle"]')){
          const direct=function(){const value=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=value;try{localStorage.setItem("abb:theme",value);}catch{};updateShellTheme();};
          const root=document.getElementById("root"),liveTrigger=root?.querySelector('[data-testid="menu-btn"]');
          if(homeAppReady&&liveTrigger){
            if(liveTrigger.getAttribute("aria-expanded")==="false")liveTrigger.click();
            queueMicrotask(function(){const live=root.querySelector('[data-testid="theme-toggle"]');if(live){live.click();updateShellTheme();}else direct();});
          }else direct();
        }
        else if(target.closest("[data-home-business]")){homeBusiness=true;target.closest("button").textContent="Opening business details…";}
        const intent=target.closest("a[href]");if(intent){const href=intent.getAttribute("href");if(href==="/#library"||href==="/#build")homeIntent=href.slice(2);}
      });
      document.addEventListener("keydown",function(event){if(event.key!=="Escape")return;const shell=document.getElementById("app-loader"),trigger=shell?.querySelector('[data-testid="menu-btn"]');if(trigger?.getAttribute("aria-expanded")==="true"){trigger.setAttribute("aria-expanded","false");trigger.innerHTML='Menu<span aria-hidden="true">+</span>';shell.querySelector("#home-shell-menu").hidden=true;trigger.focus();}});
      function updateShellTheme(){const button=document.querySelector('#app-loader [data-testid="theme-toggle"]');if(!button)return;const dark=document.documentElement.dataset.theme==="dark",label="Switch to "+(dark?"light":"dark")+" mode";button.setAttribute("aria-label",label);button.title=label;button.innerHTML=dark?${JSON.stringify(sun)}:${JSON.stringify(moon)};}
      document.addEventListener("DOMContentLoaded",updateShellTheme,{once:true});`;
  next=next.slice(0,readyStart)+boot+next.slice(readyEnd+'      }, { once: true });'.length);
  const rules=`<style data-home-critical-css>${critical}\nhtml[data-boot] #app-loader{display:block;place-items:normal;padding:0;text-align:initial;font:400 16px/1.6 var(--sans);overflow-y:auto;background:var(--bg);color:var(--text);--dither-y:${heroMask()}}html[data-theme="dark"][data-boot] #app-loader{background:var(--bg);color:var(--text)}#home-shell-menu[hidden]{display:none}.boot-recovery{padding:24px}</style>`;
  // Start decoding the already-inline font before body parsing. Do not wait,
  // block rendering or hide the readable introduction if font loading fails.
  const introStyle=`<style data-home-intro-font>${introCss}</style><script data-home-intro-font-decode>try{document.fonts?.load('400 13px "AI Blocks Intro Mono"').catch(()=>{});}catch{}</script>`;
  next=next.replace('<!-- APP_BOOT_END -->','<!-- APP_BOOT_END -->\n'+rules+'\n'+introStyle);
  assert(next.includes('media="print" data-home-full-css'));assert(next.includes('data-home-shell'));return next;
}

/** Fetch the unchanged application in parallel, then enhance the real public
 * header/hero after the browser has had a rendering opportunity. */
export function deferHomeEnhancement(html){
  assert(html.includes('<link rel="canonical" href="https://useaiblocks.com/"'));
  assert(html.includes('data-home-shell'),'The public initial screen must exist');
  assert(!html.includes('data-home-entry'),'Homepage enhancement order already applied');
  const scripts=[...html.matchAll(/<script\b(?=[^>]*type="module")(?=[^>]*src="([^\"]+)")[^>]*><\/script>/g)];
  assert.equal(scripts.length,1,'Expected exactly one external module entry');
  const [tag,entry]=scripts[0];assert(/^\/assets\/[a-zA-Z0-9_-]+\.js$/.test(entry));assert(tag.includes('crossorigin'));
  let next=html.replace(tag,'<link rel="modulepreload" crossorigin href="'+entry+'" data-home-entry>');
  const bootstrap=`<script type="module" data-home-enhancement>
      const entry=document.querySelector('link[rel="modulepreload"][data-home-entry]')?.href;
      if(!entry)bootError();
      else requestAnimationFrame(()=>requestAnimationFrame(()=>{import(entry).catch(()=>bootError());}));
    </script>`;
  assert.equal(next.split('</body>').length,2);next=next.replace('</body>',bootstrap+'\n  </body>');
  return next;
}

/** Same frozen widget rules as composerStartupCriticalCss: position and style
 * the closed launcher while the optional full widget stylesheet is arriving. */
export function homeSupportCriticalCss(supportCss){
  assert.equal(typeof supportCss,'string');const lines=supportCss.split(/\r?\n/);
  const prefixes=['#abb-support {','#abb-support *,','#abb-support [hidden]','#abb-support .abb-support-launcher {'];
  const selected=prefixes.map(prefix=>{const matches=lines.filter(line=>line.startsWith(prefix));assert.equal(matches.length,1,'Missing or ambiguous frozen support rule: '+prefix);return matches[0];});
  const mobile=supportCss.match(/@media \(max-width: 600px\) \{\r?\n(  #abb-support \{[^\r\n]+\})/);assert(mobile,'Frozen mobile support positioning rule missing.');
  return selected.join('\n')+'\n@media (max-width: 600px) {\n'+mobile[1]+'\n}\n';
}

/** The optional widget must not inject a blocking stylesheet before the real
 * public header/hero gets its first rendering opportunity. Widget code and URLs
 * remain the published ones; its iframe still opens only on user activation. */
export function deferHomeSupport(html,{supportCss}){
  assert(html.includes('<link rel="canonical" href="https://useaiblocks.com/"'));
  assert(html.includes('data-home-enhancement'));assert(!html.includes('data-home-support-critical'));
  const supportTag='<script defer src="/support-chat.js"></script>';assert.equal(html.split(supportTag).length,2);
  const initializer='else requestAnimationFrame(()=>requestAnimationFrame(()=>{import(entry).catch(()=>bootError());}));';assert.equal(html.split(initializer).length,2);
  const afterPaint=`else requestAnimationFrame(()=>requestAnimationFrame(()=>{
        let supportStarted=false,paintObserver;
        const startSupport=()=>{if(supportStarted)return;supportStarted=true;paintObserver?.disconnect();try{const support=document.createElement("script");support.src="/support-chat.js";support.async=true;support.setAttribute("data-home-support","");document.head.append(support);}catch{}};
        const fallbackSupport=()=>requestAnimationFrame(()=>requestAnimationFrame(startSupport));
        try{
          if(performance.getEntriesByName("first-contentful-paint").length)startSupport();
          else if(typeof PerformanceObserver==="function"&&PerformanceObserver.supportedEntryTypes?.includes("paint")){
            paintObserver=new PerformanceObserver(list=>{if(list.getEntries().some(item=>item.name==="first-contentful-paint"))startSupport();});
            paintObserver.observe({type:"paint",buffered:true});
          }else fallbackSupport();
        }catch{paintObserver?.disconnect();fallbackSupport();}
        import(entry).catch(()=>bootError());
      }));`;
  let next=html.replace(supportTag,'').replace(initializer,afterPaint);
  const fatalStyle='event.target instanceof HTMLLinkElement && event.target.rel === "stylesheet"';assert.equal(next.split(fatalStyle).length,2);
  next=next.replace(fatalStyle,fatalStyle+' && event.target.hasAttribute("data-home-full-css")');
  next=next.replace('</head>','<style data-home-support-critical>\n'+homeSupportCriticalCss(supportCss)+'</style>\n  </head>');
  return next;
}
