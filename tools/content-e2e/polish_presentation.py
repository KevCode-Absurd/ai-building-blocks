"""Add visible provenance and chart units omitted by the upstream renderer."""
import json
import sys
from pathlib import Path
from pptx import Presentation
from pptx.util import Inches,Pt
from pptx.dml.color import RGBColor

if len(sys.argv)==2:
    root=Path(sys.argv[1]).resolve();story_path=root/'inputs/presentation.json';path=root/'artifacts/presentation.pptx';output=path
elif len(sys.argv)==4:
    story_path,path,output=map(Path,sys.argv[1:])
else:sys.exit('Usage: finalize_pptx.py storyboard.json input.pptx output.pptx')
story=json.loads(story_path.read_text(encoding='utf-8'))
if story['meta']['style']!='corporate-bright':raise ValueError('This layout adapter is checked for corporate-bright only; inspect other styles separately.')
prs=Presentation(path)
for slide,spec in zip(prs.slides,story['slides']):
    if not spec.get('citations'):continue
    # Reserve a source line above the master footer; chart axes stay above it.
    for shape in slide.shapes:
        if shape.has_chart:
            shape.height=Inches(4.15)
            shape.chart.has_title=True
            tf=shape.chart.chart_title.text_frame
            tf.text=spec['visual']['data'][0]['name']
            for p in tf.paragraphs:
                for r in p.runs:r.font.size=Pt(13)
    box=slide.shapes.add_textbox(Inches(.8),Inches(6.83),Inches(11.7),Inches(.22))
    tf=box.text_frame;tf.margin_left=tf.margin_top=tf.margin_bottom=0
    tf.text='Source: '+'; '.join(spec['citations'])
    for p in tf.paragraphs:
        for r in p.runs:r.font.size=Pt(8.5);r.font.color.rgb=RGBColor.from_string('546579')
assert len(prs.slides)==len(story['slides'])
prs.save(output)
print('Added visible source lines and chart unit titles.')
