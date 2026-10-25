import { useEffect, useRef, useState } from 'react';
import { buildTaskPrompt, buildTaskWorkflow, taskInputSheet } from './lib/copyable-task.mjs';
import { buildHandoffZip, download } from './lib/handoff';
import type { Block, Catalogue } from './lib/data';
import type { Flow } from './lib/store';
import './copyable-task.css';

type Recipe = Parameters<typeof buildTaskPrompt>[0];
/** Adapters remain next to their skill; each source method keeps one catalogue listing. */
export default function CopyableTask({ c, b, recipe, skill, toast }: { c: Catalogue; b: Block; recipe: Recipe; skill: string | null; toast: (s:string)=>void }) {
  const [mode,setMode] = useState<'prompt'|'workflow'>('prompt');
  const [manual,setManual] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const active = useRef(true);
  useEffect(() => { active.current=true; return () => { active.current=false; }; }, []);
  const content = skill ? (mode==='prompt' ? buildTaskPrompt(recipe,skill) : buildTaskWorkflow(recipe,skill)) : '';
  const copy = async () => {
    if (!content) return;
    try { await navigator.clipboard.writeText(content); setManual(false); toast(`${mode==='prompt'?'Task prompt':'Workflow'} copied. Replace the input fields and send it in your AI.`); }
    catch { setManual(true); }
  };
  const pack = async () => {
    if (!skill || busy) return;
    setBusy(true); setError('');
    const flow: Flow = { id:`task-${b.slug}`,name:`${b.name} task workflow`,updated:0,goal:`Follow the ${b.name} method using my supplied inputs. Read framework/task-workflow.md and resolve its input fields first.`,nodes:[{id:'task',slug:b.slug,x:0,y:0,notes:'Read framework/task-workflow.md for this task and its stage handoffs. Preserve the complete skill method and all checkpoints.'}],edges:[] };
    try {
      const result = await buildHandoffZip(c,flow,{}, {'framework/task-prompt.md':buildTaskPrompt(recipe,skill),'framework/task-workflow.md':buildTaskWorkflow(recipe,skill),'framework/task-inputs.md':taskInputSheet(recipe),'README.md':'## Start this task\n\nFill the fields in framework/task-inputs.md, then ask your AI to follow framework/task-workflow.md together with HANDOFF.md. The complete method and supporting files are under skills/. A chat-only assistant can use the inline task prompt for text work; file or tool steps still require the stated capabilities. All execution checks begin unrun.\n'});
      if (!active.current) return;
      if ('error' in result) throw Error(result.error);
      download(result.blob,result.filename); toast('Task pack ready. Unzip it, fill the input fields and give the complete folder to your AI.');
    } catch(e) { if(active.current)setError(e instanceof Error?e.message:'The complete pack could not be prepared. Try again.'); }
    finally { if(active.current)setBusy(false); }
  };
  return <section id="copyable" className="task-copyable" data-testid="copyable-task">
    <h2 className="h3">Ready-to-use prompt and workflow</h2>
    <p>Copy a task prompt or an ordered workflow for this skill. Check its tool and data requirements, then fill the input fields in an allowed AI environment.</p>
    {recipe.localDataRules && <p className="small">This method includes local data handling rules. Copy the instructions, then read those rules before adding material. Keep restricted data in its approved environment.</p>}
    <label htmlFor="copyable-format">Choose what to copy</label>
    <select id="copyable-format" value={mode} onChange={e=>{setMode(e.currentTarget.value as 'prompt'|'workflow');setManual(false);}}><option value="prompt">Task prompt</option><option value="workflow">Step-by-step workflow</option></select>
    {(recipe.needsFiles || recipe.dependencies.length>0) && <p className="small">This skill uses supporting files or linked skills. Download the task pack and give its complete files to your AI before running those steps.</p>}
    <details><summary>Preview the complete request</summary><pre style={{whiteSpace:'pre-wrap',maxHeight:'28rem',overflow:'auto'}}>{content || 'Loading the complete instructions…'}</pre></details>
    <div className="bp-actions"><button className="btn btn-dark btn-sm" disabled={!content} onClick={()=>void copy()} data-testid="copy-task-adapter">Copy {mode==='prompt'?'task prompt':'workflow'}</button><button className="btn btn-line btn-sm" disabled={!skill || busy} onClick={()=>void pack()} data-testid="download-task-adapter">{busy?'Preparing task pack…':'Download task pack'}</button></div>
    {manual && <div className="task-copy-fallback"><p role="alert">Copy did not work. Select and copy the complete request below.</p><textarea readOnly rows={8} value={content} aria-label="Copy task request manually" onFocus={e=>e.currentTarget.select()} /></div>}
    {error && <p role="alert">{error}</p>}
    <p className="small">The pack includes the skill, its supporting files, input fields and workflow. Your AI performs the task; these files do not start a scheduled agent.</p>
  </section>;
}
