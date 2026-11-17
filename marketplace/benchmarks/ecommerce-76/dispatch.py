"""Observer ledger for actual collaboration dispatch/completion events."""
import argparse, datetime, json, pathlib
p=argparse.ArgumentParser();p.add_argument('--root',required=True);p.add_argument('--start',nargs='*',default=[]);p.add_argument('--complete',nargs='*',default=[]);p.add_argument('--context',default='fresh, fork_turns=none');p.add_argument('--completion-note',default='Root observed the native collaboration completed final message; inspect artifact files and execution note for delivered scope.');a=p.parse_args()
root=pathlib.Path(a.root).resolve();path=root/'dispatch.json'
rows=json.loads(path.read_text(encoding='utf-8')) if path.exists() else []
by={x['agent_id']:x for x in rows};now=datetime.datetime.now(datetime.timezone.utc).isoformat()
for pair in a.start:
    aid,task=pair.split(':',1)
    if aid in by:raise SystemExit(f'Already dispatched: {aid}')
    by[aid]={'agent_id':aid,'collaboration_task':task,'dispatch_observed_utc':now,'context':a.context,'completion':None}
for aid in a.complete:
    if aid not in by:raise SystemExit(f'Not dispatched: {aid}')
    by[aid]['completion']=a.completion_note
    by[aid]['completion_observed_utc']=now
path.write_text(json.dumps(list(by.values()),indent=2)+'\n',encoding='utf-8')
print(json.dumps({'dispatched':len(by),'completed':sum(bool(x.get('completion')) for x in by.values())}))
