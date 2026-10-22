"""English compatibility adapter for the MIT equity renderer.

The imported package is unchanged. This reviewed derived module widens only the
language enum; all content, source, hash and valuation checks still run upstream.
"""
import copy
import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
PACKAGE=Path(__file__).resolve().parents[1]
if not (PACKAGE/'scripts/render_report.py').exists():PACKAGE=ROOT/'catalogue-items/imported/equity-research-valuation-report-builder'
LABELS={
 'Thesis Matrix 是详细论证的唯一权威位置。':'The thesis matrix contains the detailed arguments.',
 '估值、隐含预期与回报':'Valuation, Implied Expectations and Returns','估值与隐含预期':'Valuation and Implied Expectations',
 '投资 Thesis 与反证':'Investment Thesis and Bear Case','行业与需求':'Industry and Demand',
 '商业模式与护城河':'Business Model and Moats','财务质量':'Financial Quality','管理层与资本配置':'Management and Capital Allocation',
 '趋势与拐点':'Trends and Inflections','风险收益与可监测性':'Risk, Return and Monitoring',
 '总分：':'Total score: ','已评分权重覆盖率：':'Scored weight coverage: ',
 '研究范围与证据':'Research Scope and Evidence','证据覆盖':'Evidence Coverage','冲突与缺口':'Conflicts and Gaps',
 '商业模式与行业需求':'Business Model and Industry Demand','价值创造':'Value Creation','行业阶段':'Industry Stage',
 '竞争与护城河':'Competition and Moats','最强反证':'Strongest Counter-evidence','MD&amp;A、管理层与资本配置':'MD&amp;A, Management and Capital Allocation',
 '财务质量、口径与趋势':'Financial Quality, Definitions and Trends','估值与市场隐含预期':'Valuation and Market Expectations',
 '投资 Thesis 与最强 Bear Case':'Investment Thesis and Strongest Bear Case','风险、催化剂与 Thesis Breakers':'Risks, Catalysts and Thesis Breakers',
 '投资评分卡':'Investment Scorecard','监控与决策闭环':'Decision and Monitoring Loop','结论与待验证事项':'Conclusion and Validation',
 '公司质量':'Company Quality','股票价值':'Stock Value','执行摘要':'Executive Summary','来源':'Sources',
 '指标变化直接回链 Thesis、估值与下一项研究行动。':'Metric changes link to the thesis, valuation and next research action.',
 '待验证事项：':'Validation items: ','。Action 是研究框架含义，不是个性化交易指令。':'. This sample is a research exercise, not a personalized trading instruction.',
 '研究截止：':'Research cutoff: ','。本报告为研究框架输出，不构成个性化投资建议。':'. Synthetic workflow sample; not an actual security analysis.',
 '报告导航':'Report navigation','核心判断':'Summary','证据':'Evidence','商业与行业':'Business','财务':'Financials','估值':'Valuation','监控':'Monitoring',
 '投资研究':'Equity Research','（':' (','）':') ','｜':' | ','；':'; ','。':'.',
}

def render(content,valuation):
    path=PACKAGE/'scripts/render_report.py'
    spec=importlib.util.spec_from_file_location('equity_base_renderer',path)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    validate_content=module._validate_content
    def english_content(value):
        if isinstance(value,dict) and isinstance(value.get('meta'),dict) and value['meta'].get('language')=='en':
            candidate=copy.deepcopy(value);candidate['meta']['language']='zh-CN'
            checked=validate_content(candidate);checked['meta']['language']='en'
            return checked
        return validate_content(value)
    module._validate_content=english_content
    template=(PACKAGE/'assets/report-template.html').read_text(encoding='utf-8')
    html=module.render_report(content,valuation,template)
    if content['meta']['language']=='en':
        for old,new in sorted(LABELS.items(),key=lambda x:-len(x[0])):html=html.replace(old,new)
        html=html.replace('lang="zh-CN"','lang="en"')
        leftovers=sorted(set(re.findall(r'[^<>\n]*[\u4e00-\u9fff][^<>\n]*',html)))
        if leftovers:raise ValueError('Untranslated output labels: '+repr(leftovers))
    # Print each major section deliberately; prevent card/table clipping and orphan headings.
    # Browser table scroll remains available on mobile; PDF is landscape for wide matrices.
    css='''<style data-launch-adapter="english-print-v1">
    .card,.metric,.verdict,.hero>div { min-width:0; overflow-wrap:anywhere; }
    .scenario-body dl { display:block; }
    .scenario-body dt { margin-top:9px; font-weight:700; }
    .scenario-body dd { margin:2px 0 0; min-width:0; overflow-wrap:anywhere; }
    @media print {
      @page { size:A4 landscape; margin:12mm; }
      .masthead { break-after:page; }
      .masthead .shell,footer .shell { width:auto; margin:0; padding:0 18px; }
      .topline { flex-wrap:wrap; }
      .asof { font-size:10px; white-space:normal; }
      main>section { break-before:page; margin:0 0 10px; }
      main>.section-lead { display:none; }
      h2,h3,.subsection-head { break-after:avoid; }
      .card,.metric,.evidence-item,.scenario,.source-item,.note { break-inside:avoid; }
      .hero,.grid-2 { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .grid-3 { grid-template-columns:repeat(3,minmax(0,1fr)); }
      .evidence-grid { grid-template-columns:repeat(5,minmax(0,1fr)); }
      .metric-row { grid-template-columns:repeat(4,minmax(0,1fr)); }
      .table-wrap { overflow:visible; border-radius:0; }
      table { width:100%; table-layout:fixed; font-size:9px; }
      th,td { white-space:normal; overflow-wrap:anywhere; font-size:11px; }
      th { font-size:10px; }
      .scenario { overflow:visible; }
      .scenario-head { padding:10px; }
      .scenario-price { font-size:25px; }
      .scenario-body { padding:10px; }
      .scenario-body dt { margin-top:4px; font-size:9px; }
      .scenario-body dd { font-size:10px; line-height:1.35; }
      .summary-strip { grid-template-columns:repeat(4,minmax(0,1fr)); padding:12px; gap:12px; break-inside:avoid; }
      .summary-strip strong { font-size:18px; }
      #scenarios { break-before:page; }
      section h2 { font-size:21px; }
      .card p,.section-lead { font-size:11px; }
    }</style>'''
    html=html.replace('</head>',css+'</head>')
    return html

if __name__=='__main__':
    if len(sys.argv)==2:
        root=Path(sys.argv[1]).resolve()
        content_path=root/'inputs/equity-content.json';valuation_path=root/'artifacts/valuation-result.json';output=root/'artifacts/equity-research.html'
    else:
        import argparse
        parser=argparse.ArgumentParser(description=__doc__)
        parser.add_argument('content',type=Path);parser.add_argument('--valuation',type=Path,required=True);parser.add_argument('--output',type=Path,required=True)
        args=parser.parse_args();content_path=args.content;valuation_path=args.valuation;output=args.output
    content=json.loads(content_path.read_text(encoding='utf-8'))
    valuation=json.loads(valuation_path.read_text(encoding='utf-8'))
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(render(content,valuation),encoding='utf-8')
    print('Rendered English report with upstream input validation and source hashes.')
