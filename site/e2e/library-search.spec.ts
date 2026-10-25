import { test, expect } from "@playwright/test";
import { build } from "esbuild";
import { buildLibrarySearchIndex } from "../src/lib/library-search-core";
import { serializeLibrarySearch } from "../scripts/build-library-search.mjs";
const sourceHash = "a".repeat(64);
const full = buildLibrarySearchIndex([{ slug: "title", title: "Copperfinch" }, { slug: "deep", title: "Another task", body: "Copperfinch appears deep in the method." }], sourceHash);
async function fixture(page: import("@playwright/test").Page, respond: (route: import("@playwright/test").Route) => Promise<void>) {
  const bundle = await build({ stdin: { resolveDir: process.cwd(), loader: "tsx", contents: `
    import {createElement,useState} from 'react'; import {createRoot} from 'react-dom/client';
    import {useLibrarySearch} from './src/lib/library-search';
    const c={sourceHash:'${sourceHash}',blocks:[{slug:'title',name:'Copperfinch',headline:'Copperfinch',summary:'A title match',type:'skill',category:'general',task:'writing',job:'ops'},{slug:'deep',name:'Another task',headline:'Another task',summary:'Other description',type:'skill',category:'general',task:'writing',job:'ops'}]};
    function App(){const[q,setQ]=useState('');const s=useLibrarySearch(c,q);return createElement('main',null,
      createElement('input',{'aria-label':'Search',value:q,onChange:e=>setQ(e.target.value)}),
      s.loading&&createElement('p',{role:'status'},'Checking full instructions'),
      s.error&&createElement('p',{role:'alert'},s.error),
      s.error&&createElement('button',{onClick:s.retry},'Retry'),
      createElement('ol',null,...[...s.hits].sort((a,b)=>b[1].score-a[1].score).map(([slug,hit])=>createElement('li',{key:slug},slug+':'+hit.field))),
      createElement('p',null,s.complete?'Full search ready':'Metadata only'));}
    createRoot(document.getElementById('root')).render(createElement(App));
  ` }, alias: { react: "preact/compat", "react-dom/client": "preact/compat/client" }, bundle: true, write: false, format: "iife", platform: "browser" });
  await page.route("https://search.test/**", async route => {
    if (new URL(route.request().url()).pathname.startsWith("/data/library-search")) return respond(route);
    await route.fulfill({ contentType: "text/html", body: '<!doctype html><div id="root"></div>' });
  });
  await page.goto("https://search.test/"); await page.addScriptTag({ content: bundle.outputFiles[0].text });
}
test("full search stays lazy, keeps metadata results, then adds deep matches with one public request", async ({ page }) => {
  let requests = 0, release!: () => void; const held = new Promise<void>(resolve => { release = resolve; });
  const urls: string[] = [];
  await fixture(page, async route => { requests++; urls.push(route.request().url()); await held; await route.fulfill({ json: full }); });
  await expect(page.getByRole("textbox")).toBeVisible(); expect(requests).toBe(0);
  await page.getByRole("textbox").fill("Copperfinch");
  await expect(page.getByRole("listitem")).toHaveText(["title:title"]);
  await expect(page.getByRole("status")).toBeVisible();
  release();
  await expect(page.getByRole("listitem")).toHaveText(["title:title", "deep:body"]);
  await page.getByRole("textbox").fill("another"); await expect(page.getByRole("listitem")).toHaveText(["deep:title"]);
  expect(requests).toBe(1); expect(urls).toEqual(["https://search.test/data/library-search.json"]);
});
test("query chunks reject corrupt bytes, retry safely and never send entered search text", async ({ page }) => {
  const files = serializeLibrarySearch(full); let chunkRequests = 0; const urls: string[] = [];
  await fixture(page, async route => {
    urls.push(route.request().url()); const file = new URL(route.request().url()).pathname.slice(1);
    if (file !== "data/library-search.json") chunkRequests++;
    await route.fulfill({ contentType: "application/json", body: file !== "data/library-search.json" && chunkRequests === 1 ? "[]" : files[file] });
  });
  await page.getByRole("textbox").fill("Copperfinch");
  await expect(page.getByRole("alert")).toContainText("Some results may be missing");
  await expect(page.getByRole("listitem")).toHaveText(["title:title"]);
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByRole("listitem")).toHaveText(["title:title", "deep:body"]);
  await expect(page.getByRole("alert")).toHaveCount(0); expect(chunkRequests).toBe(2);
  await page.getByRole("textbox").fill("private customer details");
  await expect(page.getByRole("listitem")).toHaveCount(0);
  expect(urls.every(url => !url.includes("?") && !url.includes("Copperfinch") && !url.includes("private"))).toBe(true);
});
test("wrong catalogue identity leaves metadata available and a retry recovers", async ({ page }) => {
  let requests = 0;
  await fixture(page, async route => { requests++; await route.fulfill({ json: requests === 1 ? { ...full, sourceHash: "b".repeat(64) } : full }); });
  await page.getByRole("textbox").fill("Copperfinch");
  await expect(page.getByRole("alert")).toContainText("names and descriptions");
  await expect(page.getByRole("listitem")).toHaveText(["title:title"]);
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByRole("listitem")).toHaveText(["title:title", "deep:body"]);
  await expect(page.getByRole("alert")).toHaveCount(0); expect(requests).toBe(2);
});
