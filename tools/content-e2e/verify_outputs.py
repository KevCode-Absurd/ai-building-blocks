"""Independent arithmetic, artifact structure, portability and failure-path checks."""
import copy
import csv
import hashlib
import importlib.util
import json
import math
import re
import subprocess
import sys
import zipfile
from pathlib import Path
from pptx import Presentation
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[2];OUT=Path(sys.argv[1]).resolve()
checks=[]
def check(name,condition,detail=None):
    checks.append(dict(name=name,passed=bool(condition),detail=detail))
    if not condition:raise AssertionError(name+': '+str(detail))
def load(p):return json.loads(p.read_text(encoding='utf-8'))
def close(a,b):return math.isclose(a,b,rel_tol=1e-8,abs_tol=1e-8)
def run(args,cwd=None,expect=0):
    result=subprocess.run([sys.executable,'-B',*map(str,args)],cwd=cwd,text=True,capture_output=True,encoding='utf-8',timeout=60)
    check('package command '+Path(args[0]).name,result.returncode==expect,dict(exit_code=result.returncode,stdout=result.stdout[-1600:],stderr=result.stderr[-800:]))
    return result

for name,n,charts in [('presentation',8,2),('case-competition',10,4)]:
    prs=Presentation(OUT/f'artifacts/{name}.pptx')
    check(name+' slide count',len(prs.slides)==n)
    check(name+' editable chart count',sum(sh.has_chart for s in prs.slides for sh in s.shapes)==charts)
    bad=[]
    for i,s in enumerate(prs.slides,1):
        for sh in s.shapes:
            if sh.left < -20 or sh.top < -20 or sh.left+sh.width > prs.slide_width+100 or sh.top+sh.height > prs.slide_height+100:bad.append((i,sh.name))
            if sh.has_text_frame:check(name+f' slide {i} no unresolved chart placeholder','[ chart ]' not in sh.text and 'Replaced by editable chart' not in sh.text)
    check(name+' slide bounds',not bad,bad)
    check(name+' PDF count',len(PdfReader(OUT/f'artifacts/{name}.pdf').pages)==n)
case=Presentation(OUT/'artifacts/case-competition.pptx')
values=[list(sh.chart.series[0].values) for s in case.slides for sh in s.shapes if sh.has_chart]
check('case chart values match cash-flow model',values==[[120,660,180],[90,30,60],[30,60,90],[-75,-15,45,105]])
for n in [3,5]:
    text=' '.join(sh.text for sh in Presentation(OUT/'artifacts/presentation.pptx').slides[n-1].shapes if sh.has_text_frame)
    check(f'presentation slide {n} visible sources','Source: Illustrative figures' in text)
paper=PdfReader(OUT/'artifacts/research-paper.pdf')
check('research paper page count',len(paper.pages)==4)
paper_text=' '.join(p.extract_text() for p in paper.pages)
for token in ['Abstract','Introduction','Methods','Results','Discussion','References','291.600','180.525','38.09%','571','Bishop','Azar']:
    check('paper retained content '+token,token in paper_text)
rows=list(csv.DictReader((OUT/'inputs/task-schedules.csv').open(encoding='utf-8')))
for policy in ['FIFO','SPT']:
    chosen=[r for r in rows if r['policy']==policy]
    check(policy+' conserves tasks',sorted(int(r['task']) for r in chosen)==list(range(1,41)))
    total=0
    for r in chosen:
        check(policy+' waiting recurrence',int(r['wait'])==total)
        total+=int(r['duration'])
    expected=291.6 if policy=='FIFO' else 180.525
    check(policy+' independent mean',close(sum(float(r['wait']) for r in chosen)/40,expected))
    check(policy+' independent makespan',total==571)

v=load(OUT/'artifacts/valuation-result.json');d=v['results']['dcf'];sc=v['results']['scenarios']
check('DCF perpetuity EV',close(d['enterprise_value'],15/.1))
check('DCF equity bridge',close(d['equity_value'],15/.1+20-30))
check('DCF per share',close(d['per_share_value'],14))
check('attractive price',close(v['results']['margin_of_safety']['attractive_price'],11.2))
check('high-conviction price',close(v['results']['margin_of_safety']['high_conviction_price'],9.1))
for i,r in enumerate([.09,.10,.11]):
    for j,g in enumerate([-.01,0,.01]):
        explicit=sum(15/(1+r)**t for t in range(1,6))
        terminal=15*(1+g)/(r-g)/(1+r)**5
        check(f'independent sensitivity {r}/{g}',close(d['sensitivity']['values'][i][j],(explicit+terminal+20-30)/10))
for name,end in [('bear',8),('base',14),('bull',20)]:
    actual=sc['scenarios'][name]
    check(name+' independent IRR',close(actual['irr'],(end/12)**.2-1))
    check(name+' independent holding return',close(actual['expected_return'],end/12-1))
check('probability-weighted exit',close(sc['probability_weighted_ending_value'],.2*8+.6*14+.2*20))
check('weighted cash-flow IRR',close(sc['probability_weighted_irr'],(14/12)**.2-1))
check('equity strict audit',not load(OUT/'qa/equity-validation.json')['errors'] and not any(w['blocking'] for w in load(OUT/'qa/equity-validation.json')['warnings']))
check('equity PDF 16 pages',len(PdfReader(OUT/'artifacts/equity-research.pdf').pages)==16)
for pdf in (OUT/'artifacts').glob('*.pdf'):
    for n,page in enumerate(PdfReader(pdf).pages,1):
        text=page.extract_text()
        check(f'{pdf.name} page {n} content',len(text.strip())>35)
        check(f'{pdf.name} page {n} no unresolved placeholders',not re.search(r'\b(?:TBD|TODO|XXX)\b|\[ chart \]|\ufffd',text))

# Package the same files the site includes, then execute only from those extracted downloads.
slugs=['storyboard-to-powerpoint-deck-builder','case-competition-slide-deck-builder','research-paper-writer','equity-research-valuation-report-builder']
packages=OUT/'package-check';packages.mkdir(exist_ok=True)
package_manifest=[]
for slug in slugs:
    source=ROOT/'catalogue-items/imported'/slug;zip_path=packages/(slug+'.zip')
    files=[]
    with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
        for p in sorted(source.rglob('*')):
            if not p.is_file():continue
            rel=p.relative_to(source)
            if any(x.startswith('.') or x in ('__pycache__','node_modules') for x in rel.parts) or rel.parts[0] in ('item.yaml','page.yaml','boards','tests'):continue
            z.write(p,str(Path(slug)/rel));files.append(str(rel))
    with zipfile.ZipFile(zip_path) as z:z.extractall(packages/'extracted')
    target=packages/'extracted'/slug
    text=(target/'SKILL.md').read_text(encoding='utf-8')
    check(slug+' helper route','launch-tools/USAGE.md' in text)
    check(slug+' upstream instructions retained',(target/'SKILL.upstream.md').is_file())
    package_manifest.append(dict(slug=slug,files=len(files),sha256=hashlib.sha256(zip_path.read_bytes()).hexdigest()))
case_pkg=packages/'extracted'/slugs[1]
downloaded_presentation=packages/'presentation.pptx'
check('extracted presentation generated',downloaded_presentation.is_file())
downloaded=Presentation(downloaded_presentation);reviewed=Presentation(OUT/'artifacts/presentation.pptx')
def signature(prs):
    return [[(sh.left,sh.top,sh.width,sh.height,sh.text if sh.has_text_frame else '',list(sh.chart.series[0].values) if sh.has_chart else None) for sh in slide.shapes] for slide in prs.slides]
check('extracted presentation matches reviewed slide content and geometry',signature(downloaded)==signature(reviewed))
case_out=packages/'case.pptx'
run([case_pkg/'launch-tools/build_case.py',case_pkg/'launch-tools/sample.json',case_out],cwd=packages)
check('extracted case chart values',[list(sh.chart.series[0].values) for s in Presentation(case_out).slides for sh in s.shapes if sh.has_chart]==values)
bad=load(case_pkg/'launch-tools/sample.json');bad['slides'][3].pop('chart');(packages/'bad-case.json').write_text(json.dumps(bad),encoding='utf-8')
run([case_pkg/'launch-tools/build_case.py',packages/'bad-case.json',packages/'must-not-exist.pptx'],expect=1)
check('bad case produces no artifact',not (packages/'must-not-exist.pptx').exists())
paper_pkg=packages/'extracted'/slugs[2]
run([paper_pkg/'launch-tools/reproduce_simulation.py',packages/'simulation'])
equity_pkg=packages/'extracted'/slugs[3]
run([equity_pkg/'scripts/valuation_model.py',equity_pkg/'launch-tools/sample-valuation.json','--output',packages/'valuation.json'])
run([equity_pkg/'launch-tools/render_equity.py',equity_pkg/'launch-tools/sample-content.json','--valuation',packages/'valuation.json','--output',packages/'report.html'])
check('extracted report byte-identical to reviewed HTML',(packages/'report.html').read_bytes()==(OUT/'artifacts/equity-research.html').read_bytes())
run([equity_pkg/'launch-tools/validate_equity.py',packages/'report.html','--source-json',equity_pkg/'launch-tools/sample-content.json','--valuation-json',packages/'valuation.json'])
(packages/'tampered.html').write_text((packages/'report.html').read_text(encoding='utf-8').replace('USD 14','USD 99',1),encoding='utf-8')
run([equity_pkg/'launch-tools/validate_equity.py',packages/'tampered.html','--source-json',equity_pkg/'launch-tools/sample-content.json','--valuation-json',packages/'valuation.json'],expect=1)
for src in (equity_pkg/'launch-tools/sources').glob('*.json'):check(src.name+' synthetic exhibit',load(src)['label'].startswith('SYNTHETIC'))

# Historical import manifest stays immutable; map retained entrypoints explicitly.
baseline=load(ROOT/'reports/audience-import-verification.json');preserved=[]
for entry in baseline['entries']:
    for record in entry['files']:
        path=ROOT/'catalogue-items/imported'/entry['slug']/record['file']
        if entry['slug'] in slugs and record['file']=='SKILL.md':path=path.with_name('SKILL.upstream.md')
        check('preserved upstream '+entry['slug']+'/'+record['file'],hashlib.sha256(path.read_bytes()).hexdigest()==record['sha256'])
        preserved.append(str(path.relative_to(ROOT)))
manifest={str(p.relative_to(OUT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((OUT/'artifacts').rglob('*')) if p.is_file()}
result=dict(status='pass',checked_on='2026-10-22',checks=len(checks),failures=[],packages=package_manifest,preserved_upstream_files=len(preserved),artifact_sha256=manifest,details=checks)
(OUT/'qa/checks.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
(ROOT/'reports/content-e2e-checks.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps({k:v for k,v in result.items() if k not in ('details','artifact_sha256')},indent=2))
