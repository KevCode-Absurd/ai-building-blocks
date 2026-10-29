#!/usr/bin/env node
// Repeatable, sequential Lighthouse measurements of the real public site or local production preview.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const runtime = arg('--runtime');
if (!runtime) throw Error('Pass --runtime with the directory containing lighthouse and chrome-launcher.');
const require = createRequire(path.resolve(runtime, 'package.json'));
const {default: lighthouse} = await import(pathToFileURL(require.resolve('lighthouse')).href);
const {launch} = await import(pathToFileURL(require.resolve('chrome-launcher')).href);
const {default: desktop} = await import(pathToFileURL(require.resolve('lighthouse/core/config/desktop-config.js')).href);
const origin = arg('--origin') ?? 'https://useaiblocks.com';
if (!['https://useaiblocks.com', 'http://127.0.0.1:5191'].includes(origin)) throw Error('Use production or the local production preview.');
const routes = (arg('--routes') ?? '/,/jobs/make-video-ads,/skills/voice-and-tone-guide-writer,/compose').split(',');
const profiles = (arg('--profiles') ?? 'mobile,desktop').split(',');
const repeats = Number(arg('--repeats') ?? 3);
if (!Number.isInteger(repeats) || repeats < 1 || repeats > 5) throw Error('Use one to five repetitions.');
const out = path.resolve(arg('--out') ?? 'reports/speed'); await fs.mkdir(out, {recursive: true});
const report = {status: 'running', checkedOn: new Date().toISOString(), origin,
  scope: 'Cold Lighthouse mobile and desktop runs; standard simulated throttling. Lab LCP and CLS; TBT is not INP. Use measure-web-vitals.mjs for controlled interactions. Local preview lacks production edge caching and compression.', runs: []};
let chrome;
try {
  chrome = await launch({chromeFlags: ['--headless=new', '--disable-extensions', '--no-first-run'], logLevel: 'silent'});
  for (const profile of profiles) for (const route of routes) for (let repeat = 1; repeat <= repeats; repeat++) {
    const result = await lighthouse(origin + route, {port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance','accessibility','best-practices','seo']}, profile === 'desktop' ? desktop : undefined);
    if (!result?.lhr || result.lhr.runtimeError) throw Error(JSON.stringify(result?.lhr?.runtimeError ?? 'No report'));
    const r = result.lhr, key = `${profile}-${route === '/' ? 'home' : route.slice(1).replaceAll('/', '--')}-${repeat}`;
    await fs.writeFile(path.join(out, key + '.json'), JSON.stringify(r));
    const summary = {profile, route, repeat, lighthouseVersion: r.lighthouseVersion, fetchTime: r.fetchTime,
      scores: Object.fromEntries(Object.entries(r.categories).map(([key, value]) => [key, Math.round(value.score * 100)])),
      metrics: Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(key => [key, r.audits[key].numericValue])),
      warnings: r.runWarnings};
    report.runs.push(summary); console.log(JSON.stringify(summary));
    await fs.writeFile(path.join(out, 'summary.json'), JSON.stringify(report, null, 2) + '\n');
  }
  report.status = 'complete';
} finally { if (chrome) await chrome.kill(); await fs.writeFile(path.join(out, 'summary.json'), JSON.stringify(report, null, 2) + '\n'); }
