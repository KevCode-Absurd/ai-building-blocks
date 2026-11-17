"""Compare independently supplied human labels with provisional AI decisions.

Failure is the positive class. Unreviewed, stale, conflicting or unevaluable
examples never count as passes. This reports observations, not judge approval.
"""
import argparse,json,pathlib

def compare(results,annotations):
    runs={x['agent_id']:x for x in results['rows']};labels={};excluded=[]
    for label in annotations:
        aid=label.get('agent_id')
        if aid in labels:raise ValueError('Duplicate human label for '+str(aid)+'; adjudicate before calibration')
        labels[aid]=label
    counts={'true_failure':0,'missed_failure':0,'false_alarm':0,'true_pass':0}
    for aid,label in labels.items():
        row=runs.get(aid);reason=None
        if not row:reason='case not in this run'
        elif label.get('label_source')!='human' or not label.get('reviewer'):reason='not an identified human label'
        elif label.get('verdict') not in {'PASS','FAIL'}:reason='not evaluable'
        elif label.get('pack_sha256')!=row['pack_sha256'] or label.get('answer_sha256')!=row.get('output_files',{}).get('answer.md',{}).get('sha256'):reason='stale or missing artifact identity'
        elif label.get('unit')!='Answer, artifact, evidence and tool trace':reason='partial review scope; do not compare to whole-task decision'
        elif row['grade']['verdict'] not in {'PASS','NEEDS_REPAIR'}:reason='no comparable AI decision'
        if reason:excluded.append({'agent_id':aid,'reason':reason});continue
        human_fail=label['verdict']=='FAIL';ai_fail=row['grade']['verdict']=='NEEDS_REPAIR'
        counts['true_failure' if human_fail and ai_fail else 'missed_failure' if human_fail else 'false_alarm' if ai_fail else 'true_pass']+=1
    def rate(n,d):return n/d if d else None
    n=sum(counts.values());positive=counts['true_failure']+counts['missed_failure'];negative=counts['true_pass']+counts['false_alarm']
    return {'status':'NOT_CALIBRATED' if not n else 'OBSERVED_AGREEMENT_ONLY','n':n,'human_failures':positive,'human_passes':negative,'confusion':counts,
      'failure_recall':rate(counts['true_failure'],positive),'pass_specificity':rate(counts['true_pass'],negative),
      'failure_precision':rate(counts['true_failure'],counts['true_failure']+counts['false_alarm']),
      'agreement':rate(counts['true_failure']+counts['true_pass'],n),'excluded':excluded,
      'limitations':'No automatic readiness threshold. Validate the judge on independently held-out, representative human labels with both classes; current synthetic development examples do not establish production accuracy.'}

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--results',required=True);p.add_argument('--annotations',required=True);p.add_argument('--out',required=True);a=p.parse_args()
    doc=json.loads(pathlib.Path(a.annotations).read_text(encoding='utf-8'));result=compare(json.loads(pathlib.Path(a.results).read_text(encoding='utf-8')),doc['annotations'])
    pathlib.Path(a.out).write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps(result))
