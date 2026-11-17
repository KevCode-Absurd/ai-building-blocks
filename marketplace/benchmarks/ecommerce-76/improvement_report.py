"""Readable local implementation inventory with observed benchmark progress."""
import argparse
from collections import Counter
from datetime import datetime, timezone
from html import escape
import json
from pathlib import Path

def report(repo, run, destination):
    repo, run, destination = Path(repo).resolve(), Path(run).resolve(), Path(destination).resolve()
    catalogue = json.loads((repo / 'marketplace/benchmarks/ecommerce-76/implementation-20.json').read_text(encoding='utf-8'))
    dispatch = json.loads((run / 'dispatch.json').read_text(encoding='utf-8'))
    complete = {row['agent_id'] for row in dispatch if row.get('completion')}
    grades = {}
    for path in sorted((run / 'grades').glob('*.json')):
        rows = json.loads(path.read_text(encoding='utf-8'))
        for row in rows if isinstance(rows, list) else [rows]:
            grades[row['agent_id']] = row
    counts = Counter(grades[aid]['verdict'] if aid in grades else 'NOT_GRADED' for aid in complete)
    latest = {}
    rerun_complete = 0
    for rerun in sorted(run.parent.glob('benchmark-76-round*')):
        if rerun == run or not (rerun / 'dispatch.json').exists():
            continue
        done = {r['agent_id'] for r in json.loads((rerun / 'dispatch.json').read_text(encoding='utf-8')) if r.get('completion')}
        rerun_complete += len(done)
        for path in sorted((rerun / 'grades').glob('*.json')):
            value = json.loads(path.read_text(encoding='utf-8'))
            for row in value if isinstance(value, list) else [value]:
                if row['agent_id'] in done:
                    latest[row['agent_id']] = (row['verdict'], rerun)
    baseline = run.parent / 'benchmark-host-baseline'
    baseline_done = sum(bool(r.get('completion')) for r in json.loads((baseline / 'dispatch.json').read_text(encoding='utf-8'))) if (baseline / 'dispatch.json').exists() else 0
    def link(path, label):
        return f'<a href="{escape(Path(path).as_uri(), quote=True)}">{escape(label)}</a>'
    cards = []
    for row in catalogue['items']:
        code = repo / 'marketplace' / row['implementation']
        test = repo / 'marketplace' / row['validation']
        cards.append(f'''<article><span class="number">{row['id']:02d}</span><div><h2>{escape(row['title'])}</h2>
<p>{escape(row['change'])}</p><p class="limit">{escape(row['evidence_and_limit'])}</p>
<nav>{link(code,'Implementation')} {link(test,'Validation')}</nav></div></article>''')
    failures = []
    for aid in sorted(complete):
        row = grades.get(aid, {})
        for issue in row.get('issues', []):
            status, folder = latest.get(aid, ('NO COMPLETED GRADED RERUN', None))
            receipt = link(folder / 'cases' / aid / 'output' / 'answer.md', status.replace('_', ' ')) if folder else escape(status)
            failures.append(f'<li><b>{escape(aid)}</b>: {escape(issue["finding"])}<br><span class="limit">{escape(issue.get("fix", ""))}</span><br>Latest rerun: {receipt}</li>')
    principles = ''.join(f'<li><a href="{escape(p["source"],quote=True)}">{escape(p["source"].split("/")[2])}</a>: {escape(p["application"])}</li>' for p in catalogue['principles'])
    pending = ''.join(f'<li>{escape(x)}</li>' for x in catalogue['remaining'])
    breakdown = ' · '.join(f'{count} {name.lower().replace("_", " ")}' for name,count in sorted(counts.items()))
    latest_counts = Counter(latest.get(aid, (grades.get(aid, {}).get('verdict', 'NOT_GRADED'), None))[0] for aid in complete)
    latest_breakdown = ' · '.join(f'{count} {name.lower().replace("_", " ")}' for name,count in sorted(latest_counts.items()))
    html = f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>20 improvements to ecommerce agents</title><style>
*{{box-sizing:border-box}}article>div{{min-width:0}}main{{overflow-wrap:anywhere}}body{{margin:0;background:#f6f7f8;color:#182a35;font:17px/1.6 system-ui,sans-serif}}main{{max-width:1080px;margin:auto;padding:48px 28px}}h1{{font-size:clamp(36px,6vw,64px);line-height:1.08;max-width:900px;margin:16px 0 24px}}h2{{font-size:23px;line-height:1.25;margin:0 0 12px}}h3{{font-size:26px;margin-top:0}}p{{margin:10px 0}}.eyebrow{{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#486474}}.lead{{font-size:22px;max-width:850px}}.panel{{background:#173c3c;color:#fff;padding:26px;border-radius:12px;margin:30px 0}}.panel a{{color:#fff}}.limit{{font-size:15px;color:#4c606d}}.panel .limit{{color:#d0e2df}}article{{display:grid;grid-template-columns:60px 1fr;gap:18px;background:white;padding:28px;margin:14px 0;border:1px solid #dde4e8;border-radius:10px}}.number{{font-size:28px;font-weight:700;color:#276c65}}a{{color:#195a74;text-underline-offset:3px}}nav{{display:flex;gap:24px;flex-wrap:wrap;margin-top:14px;font-size:15px}}section{{margin:40px 0}}li{{margin:14px 0}}footer{{font-size:13px;border-top:1px solid #cbd5dc;padding-top:20px;color:#4c606d}}@media(max-width:600px){{main{{padding:28px 18px}}article{{grid-template-columns:38px 1fr;gap:8px;padding:20px 14px}}.lead{{font-size:19px}}.panel{{padding:20px}}}}
</style><main><div class="eyebrow">Implementation evidence · local branch · 17 November 2026</div>
<h1>20 improvements to the ecommerce agents</h1><p class="lead">The changes improve source access, preserve business memory, verify calculations and make execution failures visible. They are implemented locally; production deployment and industry superiority are not established.</p>
<div class="panel"><h2>{len(complete)} of 76 actual first-pass tasks completed</h2><p>First pass: {escape(breakdown)}</p><p>Latest reviewed result per agent: {escape(latest_breakdown)}</p><p class="limit">These counts come from observed desktop-agent completions and separate root AI reviews. {rerun_complete} targeted repair trials are recorded separately. Latest results combine different development versions; they are not a fresh all-agent release certification. Later catalogue and repair trials share batch context; early trials use fresh contexts. No human-calibrated judge, designer comparison or sales-lift study has run.</p><nav>{link(run/'human-review.html','Review actual outputs')} {link(run/'results.json','Execution evidence')} {link(destination.parent/'verification-summary.json','Build and evaluation receipt')}</nav></div>
{''.join(cards)}<section><h3>Failures found in real work</h3><ul>{''.join(failures) or '<li>No graded failures recorded yet.</li>'}</ul></section>
<section><h3>Engineering sources and applied principles</h3><ul>{principles}</ul></section>
<section><h3>Matched host comparison</h3><p>{baseline_done} of seven matched host-only tasks completed. These use the same user requests and evidence without the specialist pack. Installed host tools remain available. One trial per task and provisional AI reviews cannot establish general superiority. No Claude Code comparison has run.</p><nav>{link(baseline/'human-review.html','Review host-only outputs')} {link(baseline/'comparison.html','Read provisional comparison')}</nav></section>
<section><h3>Work still required</h3><ul>{pending}</ul></section>
<footer>Generated {datetime.now(timezone.utc).isoformat()}. Each implementation link points to actual local code. Input manifests, original failures and observable traces are retained. Proprietary source material is not published by this report.</footer></main></html>'''
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(html, encoding='utf-8')
    return dict(report=str(destination),completed=len(complete),verdicts=dict(counts))

if __name__ == '__main__':
    p=argparse.ArgumentParser(); p.add_argument('--repo',required=True);p.add_argument('--run',required=True);p.add_argument('--out',required=True)
    a=p.parse_args();print(json.dumps(report(a.repo,a.run,a.out)))
