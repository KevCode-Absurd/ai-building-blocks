"""Export observable benchmark actions from this task's native session logs.

An allowlist excludes reasoning, system/developer instructions, account metadata,
and unrelated chats. This is an observable action trace, not a reasoning dump.
Original logs remain untouched; embedded image bytes become hash references.
"""
import argparse, hashlib, json, pathlib

CALLS = {'function_call', 'function_call_output', 'custom_tool_call', 'custom_tool_call_output'}

def public_content(value):
    if isinstance(value, list): return [public_content(x) for x in value]
    if isinstance(value, dict):
        if value.get('type') in {'image', 'input_image', 'output_image'}:
            blob=json.dumps(value,sort_keys=True).encode()
            return {'type':'image_reference','sha256':hashlib.sha256(blob).hexdigest(),
                    'note':'Embedded bytes omitted. Inspect the original host trace or generated image artifact.'}
        return {k:public_content(v) for k,v in value.items() if k!='internal_chat_message_metadata_passthrough'}
    return value

def observable(record):
    p=record.get('payload',{});kind=record.get('type')
    if kind=='response_item':
        typ=p.get('type')
        if typ in CALLS:
            allowed=('type','call_id','name','arguments','input','output','status')
        elif typ=='message' and p.get('role') in {'user','assistant'} and p.get('channel')!='analysis':
            allowed=('type','role','content','phase','channel')
        elif typ=='agent_message':
            allowed=('type','author','recipient','content')
        else:return None
        return {'timestamp':record.get('timestamp'),'event':'observable_action',
                'payload':public_content({k:p[k] for k in allowed if k in p})}
    if kind=='turn_context':
        return {'timestamp':record.get('timestamp'),'event':'model_context',
                'payload':{k:p[k] for k in ('model','effort','approval_policy') if k in p}}
    if kind=='event_msg' and p.get('type') in {'task_started','task_complete','task_aborted'}:
        return {'timestamp':record.get('timestamp'),'event':'lifecycle',
                'payload':{k:p[k] for k in ('type','started_at','completed_at','duration_ms') if k in p}}
    return None

def export(root, sessions, parent):
    dispatch=json.loads((root/'dispatch.json').read_text(encoding='utf-8'))
    # Accept only exact observer-recorded agent paths, beneath this parent chat.
    paths={}
    for row in dispatch: paths.setdefault(row['collaboration_task'],[]).append(row['agent_id'])
    out=root/'traces';out.mkdir(exist_ok=True);receipts=[]
    for source in sorted(sessions.glob('*.jsonl')):
        with source.open(encoding='utf-8') as f:
            try:meta=json.loads(next(f)).get('payload',{})
            except (StopIteration,ValueError):continue
            src=meta.get('source',{})
            spawn=src.get('subagent',{}).get('thread_spawn',{}) if isinstance(src,dict) else {}
            agent_path=spawn.get('agent_path')
            if spawn.get('parent_thread_id')!=parent or agent_path not in paths:continue
            events=[];malformed=0
            for line in f:
                try:row=observable(json.loads(line))
                except ValueError:malformed+=1;continue
                if row:events.append(row)
        for aid in paths[agent_path]:
            dest=out/(aid+'.jsonl')
            dest.write_text(''.join(json.dumps(e,ensure_ascii=False)+'\n' for e in events),encoding='utf-8')
            models=sorted({e['payload']['model'] for e in events if e['event']=='model_context' and e['payload'].get('model')})
            receipts.append({'agent_id':aid,'collaboration_agent':agent_path,'trace':str(dest.relative_to(root)),
              'observable_events':len(events),'models_observed':models,'source_log':str(source),
              'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),
              'export_sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'malformed_lines':malformed,
              'observed_complete':any(e['event']=='lifecycle' and e['payload'].get('type')=='task_complete' for e in events),
              'shared_batch_cases':paths[agent_path],
              'trace_scope':'shared_batch' if len(paths[agent_path])>1 else 'single_case',
              'scope':'Native tool calls/results, visible messages and lifecycle; reasoning, system/developer instructions and account metadata excluded. Embedded images referenced by hash.'})
    (out/'manifest.json').write_text(json.dumps(receipts,indent=2)+'\n',encoding='utf-8')
    return receipts

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--root',required=True);p.add_argument('--sessions',required=True);p.add_argument('--parent',required=True);a=p.parse_args()
    r=export(pathlib.Path(a.root).resolve(),pathlib.Path(a.sessions).resolve(),a.parent)
    print(json.dumps({'traces':len(r),'observed_complete':sum(x['observed_complete'] for x in r)}))
