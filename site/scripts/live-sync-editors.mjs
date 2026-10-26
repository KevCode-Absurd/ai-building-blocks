// Precise editor integration applied only inside this release's private source snapshot.
// Shared UI files remain under the UI team's ownership until their release is verified.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
export async function patchLiveSyncEditors(source) {
  const hashes = {}, sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  async function edit(file, transform) {
    const target = path.join(source, 'site/src', file), bytes = await fs.readFile(target);
    let text = bytes.toString().replace(/\r\n/g, '\n');
    const replace = (before, after) => { assert.equal(text.split(before).length, 2, 'Sync integration anchor: '+file+' '+before.slice(0, 70)); text = text.replace(before, after); };
    transform(replace);
    await fs.writeFile(target, text); hashes['site/src/'+file] = { before: sha(bytes), after: sha(text) };
  }
  await edit('Builder.tsx', replace => {
    replace('import { type Flow,', 'import { BEFORE_LIBRARY_SYNC, REMOTE_LIBRARY_UPDATE } from "./lib/library-storage";\nimport { type Flow,');
    replace('const sameFlow = (a: Flow, b: Flow) => shape(a) === shape(b);', `const sameFlow = (a: Flow, b: Flow) => shape(a) === shape(b);
const syncShape = (f: Flow) => ({ ...f, updated: 0, customMinds: f.customMinds ?? [], customSkills: f.customSkills ?? [], governingSkills: f.governingSkills ?? [], nodes: f.nodes.map(node => ({ ...node, bindings: node.bindings ?? [] })) });
const sameSyncedFlow = (a: Flow, b: Flow) => sameSavedValue(syncShape(a), syncShape(b));`);
    replace('import { BEFORE_LIBRARY_SYNC, REMOTE_LIBRARY_UPDATE }', 'import { sameSavedValue } from "./lib/merge-library";\nimport { BEFORE_LIBRARY_SYNC, REMOTE_LIBRARY_UPDATE }');
    replace('const load = (f: Flow) => { const g = fromFlow(f); setFlowId(f.id); setName(f.name); setEnds(endsOf(f)); setNodes(g.nodes); setEdges(g.edges); setInspect(null); refit(); };', 'const load = (f: Flow, keepSelection = false) => { const g = fromFlow(f); setFlowId(f.id); setName(f.name); setEnds(endsOf(f)); setNodes(g.nodes); setEdges(g.edges); if (!keepSelection) setInspect(null); refit(); };');
    replace('  useEffect(() => { onFlowChange?.(flow); }, [flow, onFlowChange]);', `  const remoteApplying = useRef(false), flowRef = useRef(flow); flowRef.current = flow;
  useEffect(() => { if (!remoteApplying.current && (!initialFlow || !sameSyncedFlow(initialFlow, flow))) onFlowChange?.(flow); }, [flow, onFlowChange]);`);
    replace('const pending = useRef<Flow | null>(null);', `const pending = useRef<Flow | null>(null);
  useEffect(() => {
    if (initialFlow && !sameSyncedFlow(initialFlow, flowRef.current)) { remoteApplying.current = true; pending.current = null; load(initialFlow, initialFlow.id === flowRef.current.id); }
  }, [initialFlow]);`);
    replace('    pending.current = flow;\n    const t = setTimeout(() => { flows.keep(flow); pending.current = null; }, 350);', `    if (remoteApplying.current) { remoteApplying.current = false; pending.current = null; return; }
    if (initialFlow && sameSyncedFlow(initialFlow, flow) || !initialFlow && flows.draft() && sameSyncedFlow(flows.draft()!, flow)) { pending.current = null; return; }
    pending.current = flow;
    const t = setTimeout(() => { if (pending.current === flow) { flows.keep(flow); pending.current = null; } }, 350);`);
    replace('    window.addEventListener("pagehide", flush);\n    return () => { window.removeEventListener("pagehide", flush); flush(); };', `    const received = (event: Event) => {
      if (!(event as CustomEvent<string[]>).detail.includes("abb:v1") || initialFlow || shareCode) return;
      const next = flows.draft();
      if (next && !sameSyncedFlow(next, flowRef.current)) { remoteApplying.current = true; pending.current = null; load(next, next.id === flowRef.current.id); }
    };
    window.addEventListener("pagehide", flush); window.addEventListener(BEFORE_LIBRARY_SYNC, flush); window.addEventListener(REMOTE_LIBRARY_UPDATE, received);
    return () => { window.removeEventListener("pagehide", flush); window.removeEventListener(BEFORE_LIBRARY_SYNC, flush); window.removeEventListener(REMOTE_LIBRARY_UPDATE, received); flush(); };`);
  });
  await edit('Business.tsx', replace => {
    replace('import { useEffect, useState }', 'import { useEffect, useRef, useState }');
    replace('import { Drawer }', 'import { BEFORE_LIBRARY_SYNC, REMOTE_LIBRARY_UPDATE } from "./lib/library-storage";\nimport { Drawer }');
    replace('  // Saved as you type, a moment after you stop.\n  useEffect(() => { const t = setTimeout(() => setBusiness(form), 250); return () => clearTimeout(t); }, [form]);', `  const pending = useRef<Business | null>(null), remoteApplying = useRef(false);
  useEffect(() => {
    if (remoteApplying.current) { remoteApplying.current = false; pending.current = null; return; }
    pending.current = form;
    const timer = setTimeout(() => { if (pending.current === form) { setBusiness(form); pending.current = null; } }, 250);
    return () => clearTimeout(timer);
  }, [form]);
  useEffect(() => {
    const flush = () => { if (pending.current) { setBusiness(pending.current); pending.current = null; } };
    const received = (event: Event) => { if ((event as CustomEvent<string[]>).detail.includes("abb:business")) { remoteApplying.current = true; pending.current = null; setForm(getBusiness()); } };
    window.addEventListener(BEFORE_LIBRARY_SYNC, flush); window.addEventListener(REMOTE_LIBRARY_UPDATE, received);
    return () => { window.removeEventListener(BEFORE_LIBRARY_SYNC, flush); window.removeEventListener(REMOTE_LIBRARY_UPDATE, received); flush(); };
  }, []);`);
  });
  await edit('MindsPage.tsx', replace => {
    replace('import { libraryStorage }', 'import { REMOTE_LIBRARY_UPDATE, libraryStorage }');
    replace('useMemo, useState }', 'useMemo, useRef, useState }');
    replace('  useEffect(() => { try { libraryStorage.setItem("aib-council-draft", JSON.stringify(seated)); } catch { /* private mode */ } }, [seated]);', `  const remoteApplying = useRef(true);
  useEffect(() => { if (remoteApplying.current) { remoteApplying.current = false; return; } try { libraryStorage.setItem("aib-council-draft", JSON.stringify(seated)); } catch {} }, [seated]);
  useEffect(() => {
    const received = (event: Event) => {
      if (!(event as CustomEvent<string[]>).detail.includes("aib-council-draft")) return;
      try { const saved: unknown = JSON.parse(libraryStorage.getItem("aib-council-draft") ?? "[]"); if (Array.isArray(saved)) { remoteApplying.current = true; setSeated([...new Set(saved.filter((slug): slug is string => typeof slug === "string" && !!c.bySlug[slug] && c.bySlug[slug].type === "mind"))].slice(0, MAX)); } } catch {}
    };
    window.addEventListener(REMOTE_LIBRARY_UPDATE, received); return () => window.removeEventListener(REMOTE_LIBRARY_UPDATE, received);
  }, [c]);`);
  });
  await edit('ComposePage.tsx', replace => {
    replace('import { libraryStorage }', 'import { REMOTE_LIBRARY_UPDATE, libraryStorage }');
    replace('  const requestRef = useRef(0);', '  const requestRef = useRef(0);\n  const remoteApplying = useRef(false), lastPersisted = useRef<string | null>(null);\n  const editing = useRef({ busy, result, goal }); editing.current = { busy, result, goal };');
    const before = '    try { const saved = JSON.parse(libraryStorage.getItem("abb:composer") ?? "null"); if (saved?.format === "ai-blocks-composition/1") { const custom';
    replace(before, before.replace('{ const custom', '{ remoteApplying.current = true; const custom'));
    replace('  useEffect(() => { if (result) try { libraryStorage.setItem("abb:composer", JSON.stringify(envelope())); } catch { /* storage can be unavailable */ } }, [result, goal, context, choices, customSkills, graphFlow]);', `  useEffect(() => { if (result) try {
    const raw = JSON.stringify(envelope());
    if (remoteApplying.current) { remoteApplying.current = false; lastPersisted.current = raw; return; }
    if (raw !== lastPersisted.current) { libraryStorage.setItem("abb:composer", raw); lastPersisted.current = raw; }
  } catch { /* storage can be unavailable */ } }, [result, goal, context, choices, customSkills, graphFlow]);
  useEffect(() => {
    const received = (event: Event) => {
      if (!(event as CustomEvent<string[]>).detail.includes("abb:composer")) return;
      if (editing.current.busy || !editing.current.result && editing.current.goal.trim()) return;
      try {
        const saved = JSON.parse(libraryStorage.getItem("abb:composer") ?? "null");
        if (saved?.format === "ai-blocks-composition/1") {
          const custom = validateCustomSkills(saved.customSkills), plan = finalize(withCustomSkills(baseCatalogue, custom), saved.plan, saved.plan.source);
          const restoredFlow = typeof saved.flowCode === "string" ? unpackFlow(baseCatalogue, saved.flowCode) : null;
          if (saved.flowCode !== undefined && !restoredFlow) throw Error();
          remoteApplying.current = true; setPreparedZip(null); setCustomSkills(custom); setGoal(saved.goal.slice(0, LIMITS.request)); setChoices(validateChoices(saved.choices ?? {})); setContext(saved.context ?? ""); setResult({ plan, model: saved.model || "free", cost: saved.cost || 0, latencyMs: saved.latencyMs || 0 }); setGraphFlow(restoredFlow); setRestored(true); setReview(true);
        } else if (!saved) { remoteApplying.current = false; lastPersisted.current = null; setResult(null); setGraphFlow(null); setPreparedZip(null); }
      } catch { setError("The updated workflow could not be opened. Your saved account copy is intact."); }
    };
    window.addEventListener(REMOTE_LIBRARY_UPDATE, received); return () => window.removeEventListener(REMOTE_LIBRARY_UPDATE, received);
  }, [baseCatalogue]);`);
  });
  return hashes;
}
