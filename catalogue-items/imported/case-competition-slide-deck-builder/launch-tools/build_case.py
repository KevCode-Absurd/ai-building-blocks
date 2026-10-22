"""Reviewed adapter: preserve upstream layouts; replace placeholders with editable charts.

Uses Calvinkub/super_subagent_skill_Hackathon (MIT), imported source unchanged.
Unknown slide types and missing chart data are rejected before producing a file.
"""
import importlib.util
import json
import sys
from pathlib import Path
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION, XL_TICK_LABEL_POSITION
from pptx.util import Inches, Pt

ROOT=Path(__file__).resolve().parents[2]
module_path=Path(__file__).resolve().parents[1]/'scripts/build_pptx.py'
if not module_path.exists():module_path=ROOT/'catalogue-items/imported/case-competition-slide-deck-builder/scripts/build_pptx.py'
spec=importlib.util.spec_from_file_location('upstream_case',module_path)
mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)

def build(data, output):
    allowed={'title','executive_summary','context','approach','analysis','financials','roadmap','recommendation','risks','appendix_divider','appendix'}
    for i,s in enumerate(data['slides']):
        if s.get('type') not in allowed:raise ValueError(f'Unknown slide type at {i}')
        if s['type'] in ('analysis','financials') or s.get('chart_note'):
            chart=s.get('chart')
            if not chart or not chart.get('categories') or not chart.get('series'):raise ValueError(f'Missing chart data at {i}')
            for series in chart['series']:
                if len(series['values']) != len(chart['categories']):raise ValueError(f'Chart length mismatch at {i}')
    builder=mod.DeckBuilder(data)
    prs=builder.build()
    for page,(slide,s) in enumerate(zip(prs.slides,data['slides']),1):
        for shape in slide.shapes:
            if shape.has_text_frame and shape.left==mod.Emu(mod.EMU_W-Inches(1.2)) and shape.top==mod.Emu(mod.EMU_H-Inches(.45)):
                shape.text_frame.paragraphs[0].runs[0].text=str(page)
        if not s.get('chart'):continue
        # Upstream placeholder is exactly the left chart rectangle plus its note.
        for shape in list(slide.shapes):
            if shape.top == Inches(2) and shape.left == mod.MARGIN and shape.width == Inches(7.3):
                shape._element.getparent().remove(shape._element)
            elif shape.has_text_frame and shape.text in (s.get('chart_note'),'[ chart ]'):
                shape._element.getparent().remove(shape._element)
        cd=CategoryChartData();cd.categories=s['chart']['categories']
        for series in s['chart']['series']:cd.add_series(series['name'],series['values'])
        chart=slide.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED,mod.MARGIN,Inches(2),Inches(7.3),Inches(4.6),cd).chart
        # python-pptx emits signed axis IDs; some OOXML importers parse uint32.
        # Positive IDs preserve the references and work in both PowerPoint and artifact-tool.
        for node in chart._chartSpace.iter():
            if node.tag.rsplit('}',1)[-1] in ('axId','crossAx') and node.get('val'):
                node.set('val',str(abs(int(node.get('val')))))
        chart.has_legend=False
        chart.category_axis.tick_labels.font.size=Pt(11)
        chart.category_axis.tick_label_position=XL_TICK_LABEL_POSITION.LOW
        chart.value_axis.tick_labels.font.size=Pt(10)
        plot=chart.plots[0];plot.has_data_labels=True
        plot.data_labels.position=XL_LABEL_POSITION.OUTSIDE_END;plot.data_labels.font.size=Pt(11)
        plot.series[0].format.fill.solid();plot.series[0].format.fill.fore_color.rgb=builder.primary
        plot.series[0].invert_if_negative=False
    if len(prs.slides) != len(data['slides']):raise ValueError('Slide count mismatch')
    prs.save(output)
    print(f'Wrote {output}: {len(prs.slides)} slides; four editable charts')

if __name__=='__main__':build(json.loads(Path(sys.argv[1]).read_text(encoding='utf-8')),sys.argv[2])
