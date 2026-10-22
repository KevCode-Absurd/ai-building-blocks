"""Reproducible, explicitly synthetic launch fixtures. No network or credentials."""
import csv
import importlib.util
import json
import random
import statistics
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = Path(sys.argv[1]).resolve()
for folder in ('inputs', 'artifacts', 'qa'):
    (OUT / folder).mkdir(parents=True, exist_ok=True)

def save(name, obj):
    (OUT / 'inputs' / name).write_text(json.dumps(obj, indent=2, ensure_ascii=False), encoding='utf-8')

SOURCE = 'Illustrative figures only; inputs/operations.json; USD thousands unless stated.'
ops = dict(label='SYNTHETIC launch fixture; no real business', revenue=1200, baseline_cost=960,
           annual_gross_saving=90, annual_run_cost=30, upfront_investment=75,
           annual_net_saving=60, baseline_profit=240, steady_profit=300,
           payback_years=1.25, three_year_net_benefit=105,
           cost_categories=['Intake', 'Fulfilment', 'Support'], costs=[120,660,180],
           savings=[30,35,25], risks=['Adoption', 'Quality', 'Costs'])
assert sum(ops['costs']) == ops['baseline_cost']
assert sum(ops['savings']) == ops['annual_gross_saving']
assert ops['annual_gross_saving'] - ops['annual_run_cost'] == ops['annual_net_saving']
assert ops['upfront_investment'] / ops['annual_net_saving'] == ops['payback_years']
assert 3 * ops['annual_net_saving'] - ops['upfront_investment'] == ops['three_year_net_benefit']
save('operations.json', ops)

def slide(archetype, title, **kw):
    return dict(archetype=archetype, actionTitle=title, notes=SOURCE, **kw)

story = dict(meta=dict(title='Operations pilot | SYNTHETIC SAMPLE', mode='business', style='corporate-bright',
    author='Launch QA', audience='Workers and small businesses', governingThought='Approve a gated pilot before committing the full rollout.'), slides=[
    slide('cover','A measured pilot can improve operating profit.',kicker='SYNTHETIC SAMPLE',body=['A reproducible operations proposal | 22 October 2026']),
    slide('section','Start with the operating baseline.',kicker='SYNTHETIC SAMPLE'),
    slide('data','Three workflows account for $960k in annual costs.',visual=dict(type='chart',chartType='bar',data=[dict(name='Annual cost ($k)',labels=ops['cost_categories'],values=ops['costs'])]),body=['Revenue is $1.20m in this sample.','Operating profit is $240k.','Cost includes all three workflows.'],citations=[SOURCE]),
    slide('comparison','A gated pilot gives us a reversible first step.',columns=[dict(heading='Approve the pilot',points=['Test one workflow for six weeks.','Measure cost, errors and adoption.','Release rollout funds only after review.']),dict(heading='Commit the full rollout',points=['Spend before observing team adoption.','Expose all workflows at once.','Make course correction more expensive.'])]),
    slide('data','Net annual savings could add $60k to profit.',visual=dict(type='chart',chartType='bar',data=[dict(name='Annual savings ($k)',labels=['Gross savings','Run cost','Net savings'],values=[90,30,60])]),body=['$90k gross savings less $30k run cost.','$75k initial investment is separate.','Steady profit rises to $300k.'],citations=[SOURCE]),
    slide('content','Payback takes 15 months after steady savings begin.',body=['$75k investment divided by $60k annual net savings.','Three-year net benefit is $105k before tax and discounting.','A six-week pilot delay is excluded from simple payback.','Use actual pilot results to rebuild the forecast.']),
    slide('two-column','Guardrails turn the assumptions into a decision.',columns=[dict(heading='Go criteria',points=['At least 80% team adoption.','No increase in workflow error rate.','Run cost stays within $30k a year.']),dict(heading='Stop criteria',points=['Pause if error rate rises.','Rework if adoption misses 80%.','Recalculate if savings fall below $60k.'])]),
    slide('summary','Approve a six-week pilot with a funding gate.',body=['Assign an operations owner.','Measure baseline cost and errors.','Review adoption and unit savings after six weeks.','Approve rollout only after the review.'])])
save('presentation.json', story)

def cs(kind,title,**kw): return dict(type=kind,title=title,source=SOURCE,**kw)
case = dict(meta=dict(case='SYNTHETIC SAMPLE: Operations redesign',team='Launch QA | Illustrative figures',date='22 October 2026'),slides=[
    cs('title','Pilot one workflow before funding the rollout.',subtitle='SYNTHETIC CASE | Sample data, no real client | 22 October 2026'),
    cs('executive_summary','A gated rollout can add $60k of annual profit.',recommendation='Approve a six-week pilot, then release rollout funding if the guardrails pass.',reasons=['The $960k cost base gives us three measurable levers.','Net savings of $60k support a 15-month simple payback.','Adoption, quality and cost gates limit execution risk.'],impact='$105k three-year net benefit after $75k upfront investment; before tax and discounting.'),
    cs('context','The decision is how to reduce cost without hurting quality.',body='A fictional service business earns $1.20m revenue and spends $960k each year. The team must decide whether to redesign intake, fulfilment and support. We assume unchanged revenue and steady demand. All figures are illustrative.',bullets=['Baseline operating profit: $240k.','Constraint: maintain workflow quality.','Decision owner: operations lead.']),
    cs('analysis','Fulfilment accounts for 69% of the cost base.',chart=dict(categories=ops['cost_categories'],series=[dict(name='Annual cost ($k)',values=ops['costs'])]),bullets=['$660k / $960k = 68.75%.','Intake costs $120k; support costs $180k.','Cost concentration guides investigation, not an automatic cut.']),
    cs('financials','The savings bridge produces $60k of recurring benefit.',chart=dict(categories=['Gross saving','Run cost','Net saving'],series=[dict(name='Annual amount ($k)',values=[90,30,60])]),bullets=['Gross saving: $30k intake + $35k fulfilment + $25k support.','Recurring run cost: $30k.','Upfront investment: $75k.','Payback: $75k / $60k = 1.25 years.']),
    cs('analysis','The downside case still needs a pilot decision gate.',chart=dict(categories=['Downside','Base','Upside'],series=[dict(name='Annual net saving ($k)',values=[30,60,90])]),bullets=['Scenarios vary gross savings by $30k.','Run cost stays fixed at $30k.','Simple payback ranges from 30 to 10 months.','No probabilities are assigned to these scenarios.']),
    cs('roadmap','Six weeks of evidence should precede the funding decision.',phases=[dict(label='Weeks 1-2 | Baseline',text='Owner: operations lead. Record cost per case, error rate and adoption.'),dict(label='Weeks 3-5 | Pilot',text='Owner: workflow manager. Trial one team; review metrics weekly.'),dict(label='Week 6 | Gate',text='Owner: sponsor. Review >=80% adoption, stable errors and verified savings.')]),
    cs('risks','Three explicit stop rules protect service quality.',risks=[dict(risk='Team adoption falls below 80%.',mitigation='Extend training and hold rollout funding.'),dict(risk='Errors exceed the measured baseline.',mitigation='Pause the trial and review failed cases.'),dict(risk='Run cost exceeds $30k a year.',mitigation='Reprice the plan and recalculate payback.')]),
    cs('appendix','The cash-flow bridge is transparent and reproducible.',chart_note='Replaced by editable chart',chart=dict(categories=['Initial','Year 1','Year 2','Year 3'],series=[dict(name='Cumulative cash benefit ($k)',values=[-75,-15,45,105])]),bullets=['Annual cash benefit: $60k.','Initial cash outlay: $75k.','Year 3 total: 3 x $60k - $75k = $105k.','Excludes tax, discounting and pilot timing.']),
    cs('appendix','The panel can challenge each decision assumption.',bullets=['Why not cut fulfilment first? Cost concentration alone does not prove avoidable cost.','What if savings are half the base case? Simple payback extends to 30 months.','What if revenue changes? Rebuild the contribution and working-capital model.','What releases funding? Verified savings, >=80% adoption and stable quality.'])])
save('case-deck.json', case)

# A paired, deterministic simulation: same forty task durations under both policies.
rng=random.Random(20261022)
durations=[rng.randint(2,30) for _ in range(40)]
def schedule(order):
    elapsed=0; rows=[]
    for task in order:
        rows.append(dict(task=task+1,duration=durations[task],wait=elapsed,completion=elapsed+durations[task]))
        elapsed += durations[task]
    return rows
fifo=schedule(range(40)); spt=schedule(sorted(range(40),key=lambda i:(durations[i],i)))
for rows in (fifo,spt):
    assert sorted(x['task'] for x in rows)==list(range(1,41))
    assert all(x['wait']>=0 and x['completion']==x['wait']+x['duration'] for x in rows)
stats={name:dict(mean_wait=statistics.mean(x['wait'] for x in rows),max_wait=max(x['wait'] for x in rows),mean_completion=statistics.mean(x['completion'] for x in rows),makespan=max(x['completion'] for x in rows)) for name,rows in [('FIFO',fifo),('SPT',spt)]}
stats['reduction_pct']=100*(1-stats['SPT']['mean_wait']/stats['FIFO']['mean_wait'])
assert stats['SPT']['mean_wait'] <= stats['FIFO']['mean_wait']
assert stats['FIFO']['makespan'] == stats['SPT']['makespan'] == sum(durations)
save('simulation-results.json',dict(seed=20261022,n=40,durations=durations,summary=stats,synthetic=True))
with (OUT/'inputs/task-schedules.csv').open('w',newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,fieldnames=['policy','task','duration','wait','completion']);w.writeheader()
    for policy,rows in [('FIFO',fifo),('SPT',spt)]:
        for row in rows:w.writerow(dict(policy=policy,**row))

print(json.dumps(dict(output=str(OUT),operations=ops,simulation=stats),indent=2))
