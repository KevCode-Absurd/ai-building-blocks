"""Build a local, human-first annotation sheet from actual benchmark outputs.

No model calls or automatic labels. AI suggestions stay hidden until a reviewer
saves their own judgment. Exported annotations are separate from machine grades.
"""
import argparse, hashlib, json, pathlib, random, re

def build(root):
    dispatch=json.loads((root/'dispatch.json').read_text(encoding='utf-8'))
    grades={}
    for p in (root/'grades').glob('*.json'):
        g=json.loads(p.read_text(encoding='utf-8'))
        for row in g if isinstance(g,list) else [g]:grades[row['agent_id']]=row
    tracepath=root/'traces/manifest.json'
    traces={x['agent_id']:x for x in json.loads(tracepath.read_text(encoding='utf-8'))} if tracepath.exists() else {}
    rows=[]
    for run in dispatch:
        if not run.get('completion'):continue
        aid=run['agent_id'];case=root/'cases'/aid;out=case/'output'
        manifest=json.loads((root/'manifests'/(aid+'.json')).read_text(encoding='utf-8'))
        answer=out/'answer.md'
        if not answer.exists():continue
        files=[p for p in out.iterdir() if p.is_file() and p.suffix in {'.html','.csv','.json','.md','.svg','.png','.pdf'}]
        answer_bytes=answer.read_bytes()
        encoding_warning=None
        try:answer_text=answer_bytes.decode('utf-8')
        except UnicodeDecodeError:
            answer_text=answer_bytes.decode('utf-8',errors='replace')
            encoding_warning='Invalid UTF-8 in the original answer; replacement characters are shown. Inspect the unchanged native file.'
        # Keep the original answer as a linked artifact; remove only printed link destinations
        # from the reading pane so machine-local paths do not bury the substance on phones.
        display=re.sub(r'\[([^\]]+)\]\((?:<[^>]+>|[^)]+)\)',r'\1',answer_text)
        if encoding_warning:display=encoding_warning+'\n\n'+display
        rows.append({'id':aid,'request':manifest['task']['request'],'answer':display,
          'encoding_warning':encoding_warning,
          'answer_sha256':hashlib.sha256(answer.read_bytes()).hexdigest(),'pack_sha256':manifest['zip_sha256'],
          'trace_sha256':traces.get(aid,{}).get('export_sha256'),
          'trace':traces.get(aid,{}).get('trace'),
          'files':[{'path':str(p.relative_to(root)).replace('\\','/'),'name':p.name} for p in sorted(files)],
          'sources':[{'path':str(p.relative_to(root)).replace('\\','/'),'name':p.name} for p in sorted((case/'evidence').glob('*.json'))],
          'ai_review':grades.get(aid,{'verdict':'NOT_GRADED'})})
    random.Random(329).shuffle(rows)
    data=json.dumps(rows,ensure_ascii=False).replace('<','\\u003c').replace('&','\\u0026')
    page=PAGE.replace('__DATA__',data).replace('__COUNT__',str(len(rows)))
    (root/'human-review.html').write_text(page,encoding='utf-8')
    return len(rows)

PAGE='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ecommerce output review</title>
<style>*{box-sizing:border-box}body{margin:0;background:#f5f3ee;color:#172f42;font:16px/1.5 Arial}header{padding:20px 28px;background:#172f42;color:white}main{padding:24px;max-width:1500px;margin:auto}.grid{display:grid;grid-template-columns:minmax(0,2fr) minmax(320px,1fr);gap:24px}section{background:white;padding:20px;border:1px solid #d4d6d6;border-radius:8px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.6 Arial}label{display:block;margin:12px 0 4px}input,select,textarea,button{font:inherit;padding:9px;max-width:100%}input,textarea{width:100%}textarea{min-height:100px}button{cursor:pointer;border:1px solid #172f42;background:#172f42;color:white;border-radius:4px;margin:8px 8px 8px 0}button.secondary{background:white;color:#172f42}a{color:#125e86}li{margin:5px 0}.muted{color:#59656c;font-size:14px}#status{font-weight:bold}.nav{display:flex;gap:12px;align-items:center;flex-wrap:wrap}#ai{background:#fff4d8;padding:12px}details{margin-top:14px}h1{font-size:26px;margin:0}h2{font-size:20px}@media(max-width:900px){.grid{grid-template-columns:1fr}main{padding:12px}}</style>
<header><h1>Review actual ecommerce outputs</h1><p>__COUNT__ completed cases · provisional AI assessments · no human calibration yet</p></header><main>
<p>Read the request, deliverable, evidence and observable trace. Record the first concrete failure and any other independent failures. Do not treat an absent capability or a failed checker as proof of poor reasoning. Review the native artifact when appearance or functionality matters. All merchant fixtures are synthetic.</p>
<div class="nav"><label for="case">Case</label><select id="case"></select><button id="prev" class="secondary">Previous</button><button id="next" class="secondary">Next</button><span id="status" role="status"></span></div>
<div class="grid"><section><h2 id="title"></h2><h3>Request</h3><p id="request"></p><h3>Delivered answer</h3><pre id="answer"></pre><details><summary>Native deliverables</summary><ul id="files"></ul></details><details><summary>Supplied evidence and observable trace</summary><ul id="sources"></ul></details></section>
<section><h2>Your independent judgment</h2><p class="muted">No suggested label is preselected. Start with your own notes; AI review is hidden. Saving is local to this browser. Export the JSON to retain or share your labels.</p>
<label for="reviewer">Reviewer name or stable ID</label><input id="reviewer" autocomplete="off">
<label for="unit">What did you inspect?</label><select id="unit"><option value="">Choose reviewed scope</option><option>Answer only</option><option>Answer and native artifact</option><option>Answer, artifact, evidence and tool trace</option></select>
<label for="verdict">Does it complete the feasible request correctly?</label><select id="verdict"><option value="">Choose a judgment</option><option value="PASS">Pass</option><option value="FAIL">Fail</option><option value="NOT_EVALUABLE">Not evaluable</option></select>
<label for="notes">Open notes / exact evidence</label><textarea id="notes" placeholder="What would make this less useful to a real user? Cite an artifact passage or trace event."></textarea>
<label for="first">First observed failure, if any</label><textarea id="first"></textarea>
<label for="category">Failure category, if useful</label><input id="category" placeholder="Use your wording; do not force a predefined rubric.">
<button id="save">Save human judgment</button><button id="export" class="secondary">Export annotations</button>
<details id="suggestions"><summary>Compare the provisional AI review after saving</summary><pre id="ai">Save your independent judgment first.</pre></details>
<p class="muted">A pass is scoped to what you inspected. It is not a deployment approval, human-designer comparison or measured business impact. One trial per role does not estimate reliability.</p></section></div></main>
<script>const rows=__DATA__;const $=id=>document.getElementById(id);const key='ecommerce-human-review-v1:'+location.pathname;let labels={};try{labels=JSON.parse(localStorage.getItem(key)||'{}')}catch{}let index=0;
function links(id,items){$(id).replaceChildren();for(const x of items){const li=document.createElement('li'),a=document.createElement('a');a.textContent=x.name;a.href=x.path;a.target='_blank';a.rel='noopener';li.append(a);$(id).append(li)}}
function render(){const r=rows[index];if(!r){$('status').textContent='No completed outputs yet';return}$('case').value=String(index);$('title').textContent=r.id;$('request').textContent=r.request;$('answer').textContent=r.answer;links('files',r.files);links('sources',[...r.sources,...(r.trace?[{path:r.trace,name:'Observable tool trace'}]:[])]);const l=labels[r.id]||{};for(const id of ['reviewer','unit','verdict','notes','first','category'])$(id).value=l[id]||'';$('suggestions').open=false;$('ai').textContent=l.verdict?JSON.stringify(r.ai_review,null,2):'Save your independent judgment first.';$('status').textContent=Object.keys(labels).length+' / '+rows.length+' human reviews saved';}
rows.forEach((r,i)=>{const o=document.createElement('option');o.value=i;o.textContent=r.id;$('case').append(o)});$('case').onchange=()=>{index=Number($('case').value);render()};$('prev').onclick=()=>{index=Math.max(0,index-1);render()};$('next').onclick=()=>{index=Math.min(rows.length-1,index+1);render()};
$('save').onclick=()=>{if(!rows[index])return;const l={};for(const id of ['reviewer','unit','verdict','notes','first','category'])l[id]=$(id).value.trim();if(!l.reviewer||!l.unit||!l.verdict||!l.notes){$('status').textContent='Add reviewer, inspected scope, judgment and evidence notes.';return}const r=rows[index];labels[r.id]={...l,agent_id:r.id,label_source:'human',reviewed_utc:new Date().toISOString(),answer_sha256:r.answer_sha256,pack_sha256:r.pack_sha256,trace_sha256:r.trace_sha256};try{localStorage.setItem(key,JSON.stringify(labels))}catch{$('status').textContent='Browser storage unavailable; export labels before closing.';return}render()};
$('suggestions').ontoggle=()=>{if($('suggestions').open&&!labels[rows[index]?.id]){$('suggestions').open=false;$('status').textContent='Save your independent judgment before viewing AI suggestions.'}};
$('export').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({schema:'ecommerce-human-annotations/1',annotations:Object.values(labels)},null,2)],{type:'application/json'}));a.download='human-annotations.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};render();</script></html>'''

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--root',required=True);a=p.parse_args()
    print(json.dumps({'completed_cases_in_review_sheet':build(pathlib.Path(a.root).resolve())}))
