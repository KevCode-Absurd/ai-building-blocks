"""Record artifact receipts after desktop sub-agent runs; never invent execution.

Each completion must be paired with its real collaboration agent identifier and
completion message in dispatch.json. Quality verdicts are separately reviewed.
"""
import argparse, hashlib, json, pathlib, datetime

def completion_receipt(root, aid, files):
    """Keep the first observed completed-output hashes; never backdate evidence."""
    directory=root/'completion-receipts';directory.mkdir(exist_ok=True)
    receipt=directory/(aid+'.json')
    if not receipt.exists():
        receipt.write_text(json.dumps({'agent_id':aid,'snapshot_observed_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'output_files':files,'scope':'First hash snapshot taken by record_results, not necessarily first generation time. Full original artifacts are not copied by this receipt.'},indent=2)+'\n',encoding='utf-8')
    original=json.loads(receipt.read_text(encoding='utf-8'))['output_files']
    return [p for p in sorted(set(original)|set(files)) if original.get(p)!=files.get(p)]

def main():
    p=argparse.ArgumentParser();p.add_argument('--root',required=True);args=p.parse_args()
    root=pathlib.Path(args.root).resolve()
    dispatch=json.loads((root/'dispatch.json').read_text(encoding='utf-8')) if (root/'dispatch.json').exists() else []
    runs={x['agent_id']:x for x in dispatch}
    manifests={p.stem:json.loads(p.read_text(encoding='utf-8')) for p in (root/'manifests').glob('*.json')}
    grades={}
    trace_path=root/'traces'/'manifest.json'
    traces={x['agent_id']:x for x in json.loads(trace_path.read_text(encoding='utf-8'))} if trace_path.exists() else {}
    if (root/'grades').exists():
        for p in (root/'grades').glob('*.json'):
            value=json.loads(p.read_text(encoding='utf-8'))
            for row in value if isinstance(value,list) else [value]:grades[row['agent_id']]=row
    rows=[]
    for aid,manifest in manifests.items():
        case=root/'cases'/aid;out=case/'output'
        files={str(p.relative_to(out)).replace('\\','/'):{'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size} for p in out.rglob('*') if p.is_file()}
        run=runs.get(aid,{})
        changes=[rel for rel,sha in manifest['files'].items() if not rel.startswith('context/') and (not (case/rel).is_file() or hashlib.sha256((case/rel).read_bytes()).hexdigest()!=sha)] if run else None
        row={'agent_id':aid,'execution':'COMPLETED' if run.get('completion') and files else 'RUNNING' if run else 'NOT_RUN','host':'Codex desktop collaboration sub-agent','model':'Inherited host model; no override requested','subscription':'Current authenticated host; no API-key model runner','isolated_context':True,'dispatch':run,'pack_sha256':manifest['zip_sha256'],'fixture_hashes':{k:v for k,v in manifest['files'].items() if k.startswith('evidence/')},'output_files':files,'protected_input_mutations':changes,'grade':grades.get(aid,{'verdict':'NOT_GRADED'}),'tool_trace':'Native collaboration transcript; execution.json is generator-reported when present, not an independently attested trace.'}
        if aid in traces:
            row['observable_trace']=traces[aid]
            row['model']=traces[aid]['models_observed']
        row['isolated_context']=run.get('context')=='fresh, fork_turns=none' if run else None
        row['arm']=manifest.get('arm','specialist-pack')
        row['changes_since_completion_snapshot']=completion_receipt(root,aid,files) if row['execution']=='COMPLETED' else None
        row['human_validation']='NOT_PERFORMED'
        rows.append(row)
    counts={}
    for row in rows:
        key=row['grade']['verdict'];counts[key]=counts.get(key,0)+1
    result={'generated_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'agents':len(rows),'completed':sum(r['execution']=='COMPLETED' for r in rows),'verdicts':counts,'rows':rows}
    (root/'results.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k!='rows'}))

if __name__=='__main__':main()
