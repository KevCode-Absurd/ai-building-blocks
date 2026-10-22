"""Run the complete upstream strict audit against our exact English rendering.
No checks or warnings are disabled. Only the canonical renderer is the adapter.
"""
import importlib.util
import json
import sys
import types
from dataclasses import asdict
from pathlib import Path
from render_equity import PACKAGE,render

def audit_paths(content_path,valuation_path,report_path,output=None):
    canonical=types.ModuleType('render_report')
    canonical.render_report=lambda content,valuation,template:render(content,valuation)
    sys.modules['render_report']=canonical
    path=PACKAGE/'scripts/validate_report.py'
    spec=importlib.util.spec_from_file_location('upstream_audit',path)
    mod=importlib.util.module_from_spec(spec);sys.modules[spec.name]=mod;spec.loader.exec_module(mod)
    content=json.loads(content_path.read_text(encoding='utf-8'))
    valuation=json.loads(valuation_path.read_text(encoding='utf-8'))
    text=report_path.read_text(encoding='utf-8')
    issues,fmt=mod.audit_report(text,'.html',False,content['meta']['as_of'],False,False,content,valuation)
    errors=[asdict(x) for x in issues if x.severity=='error']
    warnings=[asdict(x) for x in issues if x.severity=='warning']
    failed=bool(errors or any(x['blocking'] for x in warnings))
    report=dict(status='fail' if failed else ('pass_with_manual_review_warnings' if warnings else 'pass'),strict=True,canonical_renderer='tools/content-e2e/render_equity.py',errors=errors,warnings=warnings)
    if output:output.write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
    print(json.dumps(report,indent=2,ensure_ascii=False))
    return int(failed)
if __name__=='__main__':
    if len(sys.argv)==2:
        root=Path(sys.argv[1]).resolve()
        sys.exit(audit_paths(root/'inputs/equity-content.json',root/'artifacts/valuation-result.json',root/'artifacts/equity-research.html',root/'qa/equity-validation.json'))
    import argparse
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('report',type=Path);p.add_argument('--source-json',type=Path,required=True);p.add_argument('--valuation-json',type=Path,required=True)
    args=p.parse_args();sys.exit(audit_paths(args.source_json,args.valuation_json,args.report))
