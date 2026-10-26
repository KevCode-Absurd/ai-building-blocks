// Homepage-only postprocess. Run after Vite/prerender so every other route is untouched.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import{patchHomeInitialShell,deferHomeEnhancement,deferHomeSupport}from'../../tools/lib/home-initial-shell.mjs';
import{patchHomeFlow}from'../../tools/lib/home-flow-shell.mjs';
import{patchHomePaintEnhancement}from'../../tools/lib/home-paint-enhancement.mjs';
import{prioritizeHomeText}from'../../tools/lib/home-load-priority.mjs';
const dist=path.resolve(process.env.HOME_SHELL_DIST??'dist'),file=path.join(dist,'index.html'),html=await fs.readFile(file,'utf8'),cssHref=html.match(/<link\b(?=[^>]*rel="stylesheet")[^>]*href="(\/assets\/[A-Za-z0-9_.-]+\.css)"/)?.[1];assert(cssHref,'Expected exact compiled homepage stylesheet');const css=await fs.readFile(path.join(dist,cssHref.slice(1)),'utf8');const supportCss=await fs.readFile(path.join(dist,'support-chat.css'),'utf8');const temp=file+'.'+process.pid+'.tmp';await fs.writeFile(temp,prioritizeHomeText(patchHomePaintEnhancement(patchHomeFlow(deferHomeSupport(deferHomeEnhancement(patchHomeInitialShell(html,{css,cssHref})),{supportCss})))));await fs.unlink(file);await fs.rename(temp,file);console.log('Homepage: initial header/hero and critical CSS; all other routes unchanged.');

