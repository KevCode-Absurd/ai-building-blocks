// Homepage-only postprocess. Run after Vite/prerender so every other route is untouched.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import{patchHomeInitialShell,deferHomeEnhancement,deferHomeSupport}from'../../tools/lib/home-initial-shell.mjs';
import{patchHomeFlow}from'../../tools/lib/home-flow-shell.mjs';
import{patchHomePaintEnhancement}from'../../tools/lib/home-paint-enhancement.mjs';
import{prioritizeHomeText}from'../../tools/lib/home-load-priority.mjs';
import{createHash}from'node:crypto';
const introFont=await fs.readFile(new URL('../public/fonts/ai-blocks-intro-sans.woff2',import.meta.url));
const introProof=JSON.parse(await fs.readFile(new URL('./font-assets/ai-blocks-intro-sans.json',import.meta.url),'utf8'));
const originalFont=await fs.readFile(new URL('../public/fonts/space-grotesk.woff2',import.meta.url));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
assert(introProof.sha256===sha(introFont)&&introProof.bytes===introFont.length&&introProof.source_sha256===sha(originalFont),'Rebuild and review the intro font after changing either font file');
assert(introProof.weight===400&&introProof.glyphs_and_metrics_identical&&introProof.original_font_retained,'Verified original glyphs and metrics required');
const clientIntro=(await fs.readFile(new URL('../src/HomePage.tsx',import.meta.url),'utf8')).match(/<p className="lede typed" data-done="true">([^<]+)<\/p>/)?.[1];
assert(clientIntro&&[...clientIntro].every(ch=>introProof.codepoints.includes(ch.codePointAt(0))),'Every character of the introduction must be in the intro font. Rebuild the font (site/scripts/font-assets/README-intro-font.md) after adding a new character');
const dist=path.resolve(process.env.HOME_SHELL_DIST??'dist'),file=path.join(dist,'index.html'),html=await fs.readFile(file,'utf8'),cssHref=html.match(/<link\b(?=[^>]*rel="stylesheet")[^>]*href="(\/assets\/[A-Za-z0-9_.-]+\.css)"/)?.[1];assert(cssHref,'Expected exact compiled homepage stylesheet');const css=await fs.readFile(path.join(dist,cssHref.slice(1)),'utf8');const supportCss=await fs.readFile(path.join(dist,'support-chat.css'),'utf8');const temp=file+'.'+process.pid+'.tmp';await fs.writeFile(temp,prioritizeHomeText(patchHomePaintEnhancement(patchHomeFlow(deferHomeSupport(deferHomeEnhancement(patchHomeInitialShell(html,{css,cssHref,introFont,introCodepoints:introProof.codepoints,introText:clientIntro})),{supportCss})))));await fs.unlink(file);await fs.rename(temp,file);console.log('Homepage: initial header/hero, verified intro font and critical CSS; all other routes unchanged.');

