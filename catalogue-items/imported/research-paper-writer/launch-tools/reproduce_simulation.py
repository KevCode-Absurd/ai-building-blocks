"""Reproduce only the retained, labelled 40-task synthetic scheduling example."""
import csv
import json
import random
import statistics
import sys
from pathlib import Path

source=json.loads((Path(__file__).parent/'simulation-results.json').read_text(encoding='utf-8'))
rng=random.Random(source['seed']);durations=[rng.randint(2,30) for _ in range(source['n'])]
assert durations==source['durations']
out=Path(sys.argv[1] if len(sys.argv)>1 else 'sample-run');out.mkdir(parents=True,exist_ok=True)
rows=[];summary={}
for name,order in [('FIFO',range(40)),('SPT',sorted(range(40),key=lambda i:(durations[i],i)))]:
    elapsed=0;batch=[]
    for i in order:
        row=dict(policy=name,task=i+1,duration=durations[i],wait=elapsed,completion=elapsed+durations[i]);batch.append(row);elapsed+=durations[i]
    summary[name]=dict(mean_wait=statistics.mean(r['wait'] for r in batch),max_wait=max(r['wait'] for r in batch),mean_completion=statistics.mean(r['completion'] for r in batch),makespan=elapsed)
    assert summary[name]==source['summary'][name]
    rows.extend(batch)
with (out/'task-schedules.csv').open('w',newline='',encoding='utf-8') as f:
    writer=csv.DictWriter(f,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
(out/'results.json').write_text(json.dumps(dict(synthetic=True,seed=source['seed'],summary=summary),indent=2),encoding='utf-8')
print(json.dumps(summary,indent=2))
