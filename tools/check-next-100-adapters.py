"""Run retained synthetic native-file fixtures for the two small adapter fixes."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import sys
from pptx import Presentation

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'runs/next-100-adapter-checks'
OUT.mkdir(parents=True, exist_ok=True)
CASE = ROOT / 'catalogue-items/imported/case-competition-slide-deck-builder'
EQUITY = ROOT / 'catalogue-items/imported/equity-research-valuation-report-builder'
spec = importlib.util.spec_from_file_location('case_adapter_check', CASE/'launch-tools/build_case.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
sample = json.loads((CASE/'launch-tools/sample.json').read_text(encoding='utf-8'))
checks = []
for target in [0, 1, 4]:
    chosen = []
    count = 0
    for slide in sample['slides']:
        if slide.get('chart'):
            if count >= target:
                continue
            count += 1
        chosen.append(slide)
    assert count == target, 'Retained synthetic sample does not have requested chart count'
    data = {**sample, 'slides': chosen}
    dest = OUT/f'case-{target}-charts.pptx'
    stream = io.StringIO()
    with contextlib.redirect_stdout(stream):
        module.build(data, dest)
    actual = Presentation(dest)
    native = sum(1 for slide in actual.slides for shape in slide.shapes if shape.has_chart)
    assert native == target
    assert f'; {native} editable charts' in stream.getvalue()
    checks.append({'check': 'case chart count', 'expected': target, 'actual': native, 'file': str(dest), 'status': 'pass'})

def run(args):
    result = subprocess.run([sys.executable, '-X', 'utf8', *map(str,args)], cwd=EQUITY, capture_output=True, text=True, encoding='utf-8')
    assert result.returncode == 0, result.stdout + result.stderr
    return result.stdout

valuation = OUT/'valuation.json'
report = OUT/'equity-report.html'
run(['scripts/valuation_model.py', 'launch-tools/sample-valuation.json', '--output', valuation])
run(['launch-tools/render_equity.py', 'launch-tools/sample-content.json', '--valuation', valuation, '--output', report])
validation = run(['launch-tools/validate_equity.py', report, '--source-json', 'launch-tools/sample-content.json', '--valuation-json', valuation])
html = report.read_text(encoding='utf-8')
assert 'This report is a research framework output, not personalized investment advice.' in html
assert 'Action describes a research framework assessment, not a personalized trading instruction.' in html
assert 'Synthetic workflow sample; not an actual security analysis.' not in html
checks.append({'check': 'equity faithful English disclaimer and strict deterministic validation', 'file': str(report), 'validator': json.loads(validation), 'status': 'pass'})
result = {'status': 'pass', 'scope': 'Actual native synthetic fixture execution, reopened PPTX native chart counts and strict equity HTML re-render validation. No real investment conclusion or new visual-layout signoff is claimed.', 'checks': checks}
(ROOT/'reports/next-100-adapter-checks.json').write_text(json.dumps(result, indent=2)+'\n', encoding='utf-8')
print(json.dumps({'status': 'pass', 'checks': len(checks)}))
