"""Execute real, isolated Codex turns through ChatGPT login, never API-key auth.

Uses the installed Codex executable and its documented exec surface. Raw event
traces, prompt/pack digests, usage, timings and output file hashes are retained.
No LLM answers are synthesized by this runner; only actual completed turns count.
"""
import argparse, concurrent.futures, datetime, hashlib, json, os, pathlib, shutil, subprocess, time

def dump(p,obj):
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(obj,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')

def clean_env():
    # Authentication remains in Codex's existing ChatGPT login store. Do not read,
    # print, copy or change that store. Force ChatGPT mode in the CLI as well.
    return {k:v for k,v in os.environ.items() if not k.upper().endswith(('API_KEY','API_TOKEN')) and k.upper() not in ('OPENAI_BASE_URL','OPENAI_API_BASE','AZURE_OPENAI_ENDPOINT')}

def run_one(root, aid, timeout):
    case=root/'cases'/aid; receipts=root/'receipts'; logs=root/'traces'
    receipts.mkdir(exist_ok=True);logs.mkdir(exist_ok=True)
    receipt=receipts/f'{aid}.json'
    if receipt.exists():
        return {'agent_id':aid,'status':'SKIPPED_EXISTING_RECEIPT'}
    prompt=(case/'request.txt').read_text(encoding='utf-8')
    command=[shutil.which('codex'),'--search','exec','--ignore-user-config','--ephemeral','--skip-git-repo-check','--sandbox','workspace-write','--json','-c','forced_login_method="chatgpt"','--cd',str(case),'--output-last-message',str(case/'output'/'final-response.md'),'-']
    started=datetime.datetime.now(datetime.timezone.utc).isoformat();t=time.monotonic()
    status='ERROR'; code=None; err=None
    with (logs/f'{aid}.jsonl').open('w',encoding='utf-8') as out, (logs/f'{aid}.stderr.txt').open('w',encoding='utf-8') as stderr:
        try:
            proc=subprocess.Popen(command,stdin=subprocess.PIPE,stdout=out,stderr=stderr,text=True,encoding='utf-8',env=clean_env(),cwd=case)
            try:
                proc.communicate(prompt,timeout=timeout);code=proc.returncode
            except subprocess.TimeoutExpired:
                # Kill only this spawned process tree; never match by broad process name.
                if os.name=='nt': subprocess.run(['taskkill','/PID',str(proc.pid),'/T','/F'],capture_output=True)
                else: proc.kill()
                proc.communicate();status='TIMEOUT';err=f'No completed turn within {timeout}s'
        except Exception as exc:err=str(exc)
    events=[]
    for line in (logs/f'{aid}.jsonl').read_text(encoding='utf-8').splitlines():
        try:events.append(json.loads(line))
        except json.JSONDecodeError:pass
    turns=[e for e in events if e.get('type')=='turn.completed']
    items=[e.get('item',{}) for e in events if e.get('type')=='item.completed']
    files={str(p.relative_to(case/'output')).replace('\\','/'): {'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size} for p in (case/'output').rglob('*') if p.is_file()}
    if code==0 and turns and files:status='COMPLETED_OUTPUT'
    elif status!='TIMEOUT':status='EXECUTION_ERROR'
    manifest=json.loads((root/'manifests'/f'{aid}.json').read_text(encoding='utf-8'))
    mutations=[]
    for rel,sha in manifest['files'].items():
        p=case/rel
        if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest()!=sha:mutations.append(rel)
    row={'agent_id':aid,'status':status,'started_utc':started,'elapsed_seconds':round(time.monotonic()-t,2),'returncode':code,'error':err,'authentication':'ChatGPT; forced_login_method=chatgpt; API-key environment removed','model':'Installed Codex default; exact model ID not emitted by exec JSON stream','host_version':subprocess.run([shutil.which('codex'),'--version'],capture_output=True,text=True,env=clean_env()).stdout.strip(),'pack_sha256':manifest['zip_sha256'],'prompt_sha256':manifest['files']['request.txt'],'thread_ids':[e.get('thread_id') for e in events if e.get('type')=='thread.started'],'usage':turns[-1].get('usage') if turns else None,'tools_actually_called':[{'type':i.get('type'),'command':i.get('command'),'status':i.get('status'),'exit_code':i.get('exit_code')} for i in items if i.get('type')!='agent_message'],'output_files':files,'input_mutations':mutations,'protected_input_mutations':[x for x in mutations if not x.startswith('context/')],'quality_status':'NOT_GRADED'}
    dump(receipt,row)
    print(json.dumps({'agent_id':aid,'status':status,'seconds':row['elapsed_seconds'],'files':len(files)},ensure_ascii=False),flush=True)
    return row

def main():
    p=argparse.ArgumentParser();p.add_argument('--root',required=True);p.add_argument('--workers',type=int,default=3);p.add_argument('--timeout',type=int,default=900);p.add_argument('--only');args=p.parse_args()
    if not 1<=args.workers<=4:raise SystemExit('Use 1-4 concurrent subscription sessions')
    root=pathlib.Path(args.root).resolve()
    auth=subprocess.run([shutil.which('codex'),'login','status'],capture_output=True,text=True,env=clean_env())
    if auth.returncode or 'Logged in using ChatGPT' not in auth.stdout+auth.stderr:raise SystemExit('Refusing execution: active ChatGPT login not verified; no API fallback')
    ids=[x['agent_id'] for x in json.loads((root/'prepared.json').read_text(encoding='utf-8'))]
    if args.only:
        wanted=set(args.only.split(','));ids=[x for x in ids if x in wanted]
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as ex:
        results=list(ex.map(lambda aid:run_one(root,aid,args.timeout),ids))
    dump(root/'run-summary.json',{'requested':len(ids),'rows':results,'note':'Completion is execution status, not an output-quality pass. Grade actual artifacts independently.'})

if __name__=='__main__':main()
