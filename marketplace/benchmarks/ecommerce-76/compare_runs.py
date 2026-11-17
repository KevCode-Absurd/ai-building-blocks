"""Matched artifact comparison. No automatic preference or superiority score."""
import argparse
import hashlib
import json
from datetime import datetime, timezone
from html import escape
from pathlib import Path


def compare(pack_root, host_root):
    pack_root, host_root = Path(pack_root).resolve(), Path(host_root).resolve()
    def results(root):
        p = root / 'results.json'
        return {r['agent_id']: r for r in json.loads(p.read_text(encoding='utf-8'))['rows']} if p.exists() else {}
    pack_results, host_results = results(pack_root), results(host_root)
    notes_file = host_root / 'comparison-notes.json'
    notes = json.loads(notes_file.read_text(encoding='utf-8')) if notes_file.exists() else {}
    rows = []
    for file in sorted((host_root / 'manifests').glob('*.json')):
        host = json.loads(file.read_text(encoding='utf-8'))
        aid = host['agent_id']
        pack = json.loads((pack_root / 'manifests' / file.name).read_text(encoding='utf-8'))
        evidence = lambda m: {k: v for k, v in m['files'].items() if k.startswith('evidence/')}
        request = (pack_root / 'cases' / aid / 'request.txt').read_text(encoding='utf-8')
        matched = request[request.index('USER REQUEST:'):]
        pr, hr = pack_results.get(aid, {}), host_results.get(aid, {})
        pm, hm = pr.get('model'), hr.get('model')
        rows.append(dict(agent_id=aid,
                         evidence_hashes_match=evidence(pack) == evidence(host),
                         request_hash_matches=hashlib.sha256(matched.encode()).hexdigest() == host['matched_request_sha256'],
                         pack_execution=pr.get('execution', 'NOT_RECORDED'),
                         host_execution=hr.get('execution', 'NOT_RECORDED'),
                         pack_first_verdict=pr.get('grade', {}).get('verdict', 'NOT_GRADED'),
                         host_verdict=hr.get('grade', {}).get('verdict', 'NOT_GRADED'),
                         observed_pack_model=pm, observed_host_model=hm,
                         same_observed_model=pm == hm if isinstance(pm, list) and isinstance(hm, list) else None,
                         protected_inputs_unchanged=pr.get('protected_input_mutations') == [] and hr.get('protected_input_mutations') == [],
                         pack_fresh_context=pr.get('isolated_context'), host_fresh_context=hr.get('isolated_context'),
                         observations=notes.get(aid, [])))
    report = dict(generated_utc=datetime.now(timezone.utc).isoformat(), rows=rows,
                  conclusion='No general superiority established. These are matched development examples, not a calibrated, blinded or statistically replicated comparison.',
                  limitations=['Seven selected domains, one host-only attempt each; same host tools and installed skills remain available.',
                               'Pack first attempts used development versions; targeted repair outputs are separate from this comparison.',
                               'Root AI reviewed both arms with identities visible; no human preference labels or business outcomes.',
                               'No Claude Code, independent designer or cross-model arm. Length, self-scores and number of artifacts are not quality proxies.'])
    (host_root / 'comparison.json').write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    def link(root, aid):
        return (root / 'cases' / aid / 'output' / 'answer.md').as_uri()
    cards = []
    for r in rows:
        ok = all(r[k] for k in ['evidence_hashes_match', 'request_hash_matches', 'same_observed_model', 'protected_inputs_unchanged', 'pack_fresh_context', 'host_fresh_context'])
        observations = ''.join('<li>' + escape(note) + '</li>' for note in r['observations']) or '<li>Independent artifact comparison pending.</li>'
        cards.append(f'''<article><h2>{escape(r['agent_id'])}</h2><p>Matched-input/context checks: <b>{'PASS' if ok else 'INCOMPLETE OR MISMATCH — inspect JSON'}</b></p>
<p><a href="{link(pack_root, r['agent_id'])}">Pack first output</a>: {escape(r['pack_first_verdict'])} · <a href="{link(host_root, r['agent_id'])}">Host-only output</a>: {escape(r['host_verdict'])}</p><ul>{observations}</ul></article>''')
    html = f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Matched ecommerce output comparison</title>
<style>*{{box-sizing:border-box}}body{{margin:0;background:#f6f7f8;color:#182a35;font:17px/1.6 system-ui}}main{{max-width:1000px;padding:32px 20px;margin:auto;overflow-wrap:anywhere}}h1{{font-size:40px;line-height:1.15}}h2{{font-size:22px}}article{{background:white;border:1px solid #d9e1e6;border-radius:10px;padding:24px;margin:18px 0}}a{{color:#195a74}}li{{margin:10px 0}}.lead{{font-size:21px}}footer{{font-size:14px}}</style>
<main><h1>Seven matched host-only comparisons</h1><p class="lead">{escape(report['conclusion'])}</p>
<p>The same user request and synthetic evidence were supplied to a fresh host agent without the specialist pack. The pack arm received its additional instructions, tools and knowledge. Verdicts concern delivered scope and objective errors; PASS is not a preference vote.</p>
{''.join(cards)}<h2>Limits</h2><ul>{''.join('<li>'+escape(x)+'</li>' for x in report['limitations'])}</ul><footer>Generated {report['generated_utc']} · <a href="comparison.json">Machine evidence</a></footer></main></html>'''
    (host_root / 'comparison.html').write_text(html, encoding='utf-8')
    return dict(cases=len(rows), completed=sum(r['host_execution'] == 'COMPLETED' for r in rows), matched=sum(r['evidence_hashes_match'] and r['request_hash_matches'] for r in rows))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--pack', required=True)
    parser.add_argument('--host', required=True)
    args = parser.parse_args()
    print(json.dumps(compare(args.pack, args.host)))
