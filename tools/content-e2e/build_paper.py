"""Execute scientific-writing IMRAD workflow on a reproducible synthetic experiment.
No invented observations, authors, affiliations, peer review or statistical significance.
"""
import json
import sys
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from reportlab.graphics.shapes import Drawing, String
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics import renderPDF
from reportlab.lib.colors import HexColor
from pdf2image import convert_from_bytes

root=Path(sys.argv[1]).resolve()
data=json.loads((root/'inputs/simulation-results.json').read_text())
s=data['summary']; a=s['FIFO']; b=s['SPT']
runtime=Path(sys.executable).parent.parent
manifest=runtime/'bin/override/native-executables.json'
if not manifest.exists():
    runtime=Path(sys.executable).parent.parent.parent
    manifest=runtime/'bin/override/native-executables.json'
# Bundled Windows runtime puts python.exe directly in dependencies/python.
runtime=Path(sys.executable).parent.parent
manifest=runtime/'bin/override/native-executables.json'
exe=(manifest.parent/json.loads(manifest.read_text())['pdftoppm']).resolve()

def png(drawing,name):
    image=convert_from_bytes(renderPDF.drawToString(drawing),dpi=170,poppler_path=str(exe.parent))[0]
    path=root/'inputs'/name;image.save(path);return path

draw=Drawing(560,210)
chart=VerticalBarChart();chart.x=55;chart.y=38;chart.width=465;chart.height=140
chart.data=[(a['mean_wait'],b['mean_wait'])];chart.categoryAxis.categoryNames=['FIFO','SPT']
chart.valueAxis.valueMin=0;chart.valueAxis.valueMax=320;chart.valueAxis.valueStep=80
chart.bars[0].fillColor=HexColor('#183b56');chart.barLabels.nudge=7
chart.barLabelFormat='%.1f';chart.barLabels.fontSize=10
chart.categoryAxis.labels.fontSize=11;chart.valueAxis.labels.fontSize=10
draw.add(chart);draw.add(String(12,192,'Mean waiting time (minutes); synthetic batch, n = 40',fontSize=11))
fig1=png(draw,'mean-wait.png')
draw=Drawing(560,210);chart=HorizontalLineChart();chart.x=55;chart.y=40;chart.width=465;chart.height=135
chart.data=[tuple(data['durations']),tuple(sorted(data['durations']))]
chart.categoryAxis.categoryNames=[str(i+1) if i in (0,9,19,29,39) else '' for i in range(40)]
chart.valueAxis.valueMin=0;chart.valueAxis.valueMax=32;chart.valueAxis.valueStep=8
chart.lines[0].strokeColor=HexColor('#9a6574');chart.lines[1].strokeColor=HexColor('#183b56')
chart.lines[0].strokeWidth=1;chart.lines[1].strokeWidth=2
draw.add(chart);draw.add(String(12,192,'Task duration (minutes) by service position; n = 40',fontSize=11))
draw.add(String(65,8,'Service position (1-40)     FIFO: mauve line     SPT: navy line',fontSize=10))
fig2=png(draw,'duration-order.png')

outline={
 'introduction':['Define FIFO and shortest processing time; verified Bishop teaching reference.','Question: effect on mean waiting time for one fully available batch.'],
 'methods':['One seeded batch; 40 independent integer durations, 2-30 minutes.','All released at zero, one nonpreemptive server, exact durations known.','Same durations under both policies; no inference to a population.'],
 'results':[f'Mean wait {a["mean_wait"]:.3f} vs {b["mean_wait"]:.3f}; reduction {s["reduction_pct"]:.2f}%.','Makespan equal: 571 minutes.'],
 'discussion':['Exchange argument explains mean result; no novelty claim.','Known-duration and simultaneous-arrival assumptions limit relevance; cite Azar et al.'],
 'sources':[{'id':1,'url':'https://nob.cs.ucdavis.edu/classes/ecs150-2022-02/handouts/sched1.html','verified':'2026-10-22','basis':'Definitions and worked scheduling example'}, {'id':2,'url':'https://arxiv.org/abs/2103.05604','verified':'2026-10-22','basis':'Authors, title, date and abstract; duration uncertainty limitation'}]}
(root/'inputs/paper-outline-and-sources.json').write_text(json.dumps(outline,indent=2))

doc=Document();sec=doc.sections[0]
sec.page_height=Inches(11.7);sec.page_width=Inches(8.3)
sec.top_margin=sec.bottom_margin=Inches(.7);sec.left_margin=sec.right_margin=Inches(.8)
for style in ['Normal','Title','Subtitle','Heading 1','Heading 2','Caption']:
    doc.styles[style].font.name='Calibri';doc.styles[style].font.color.rgb=RGBColor(0,0,0)
doc.styles['Normal'].font.size=Pt(11)
doc.styles['Normal'].paragraph_format.space_after=Pt(8)
doc.styles['Normal'].paragraph_format.line_spacing=1.08
doc.styles['Title'].font.size=Pt(23)
doc.styles['Heading 1'].font.size=Pt(16)
doc.styles['Heading 2'].font.size=Pt(12)
doc.styles['Caption'].font.size=Pt(9)
header=sec.header.paragraphs[0];header.text='SYNTHETIC SIMULATION | Launch workflow sample | 22 October 2026'
header.style='Caption'
footer=sec.footer.paragraphs[0];footer.text='AI-assisted sample manuscript | Not peer reviewed | Page '
field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');footer._p.append(field)
footer.style='Caption'
def p(text):doc.add_paragraph(text)
def h(text):doc.add_heading(text,1)
def page():doc.add_page_break()
doc.add_paragraph('Waiting time under two scheduling rules: a reproducible synthetic batch',style='Title')
p('Sample computational manuscript | Prepared for artifact workflow QA | 22 October 2026')
h('Abstract')
p(f'We compared first-in, first-out (FIFO) and shortest processing time (SPT) scheduling in a deterministic synthetic batch. Forty task durations were generated once from a seeded discrete uniform distribution and reused under both policies. A single server processed all tasks without interruption; every task was available at time zero. Mean waiting time was {a["mean_wait"]:.3f} minutes under FIFO and {b["mean_wait"]:.3f} minutes under SPT, a {s["reduction_pct"]:.2f}% reduction for this batch. Both schedules finished after {a["makespan"]} minutes. These results illustrate the effect of service order on average delay when durations are known. They do not estimate an effect for a real organization or establish performance under uncertain durations, later arrivals or service priorities.')
h('Introduction')
p('Scheduling order changes how long work waits for a shared resource. FIFO preserves the input order, whereas SPT serves the shortest available task first. Bishop [1] gives definitions and worked examples of arrival-order and shortest-job policies. Those examples provide teaching context; the data in this manuscript were independently generated and do not reproduce that source.')
p('This experiment asks how the two rules differ in average waiting time for one fixed batch. Its purpose is to make a writing workflow auditable from inputs through calculations, figures and references. It is a demonstration of a familiar scheduling mechanism, with no claim of a new algorithm or empirical discovery. We distinguish average delay from total processing capacity because a shorter mean wait need not make the last task finish earlier.')
page();h('Methods')
p('We used Python random.Random with seed 20261022 to draw 40 integer service durations independently and uniformly from 2 through 30 minutes, inclusive. The generated vector is retained in simulation-results.json, so reproduction does not depend solely on a pseudorandom implementation. Every task had release time zero, no due date and equal weight. There were no setup times, interruptions, failures or parallel servers. The service durations were known exactly before scheduling.')
p('FIFO processed task identifiers 1 through 40. SPT sorted by duration, breaking ties by the original identifier. For each task, waiting time equalled the sum of all earlier service durations. Completion time equalled waiting time plus its own duration. We calculated the arithmetic mean and maximum wait, mean completion time and makespan. The percentage reduction was 100 multiplied by one minus the ratio of SPT mean wait to FIFO mean wait. We applied no hypothesis test or confidence interval: this was one deliberately constructed batch, rather than a sampled estimate of a real-world population effect.')
p('The two policy runs used exactly the same task vector. Integrity assertions checked task conservation, equal total service time, nonnegative waits and SPT mean wait no greater than FIFO mean wait. The companion task-schedules.csv contains one row per policy and task, including duration, wait and completion. The reproduction script is tools/content-e2e/build_samples.py.')
doc.add_picture(str(fig2),width=Inches(6.6))
doc.add_paragraph('Figure 1. Service duration by service position. Sorting moves short tasks earlier; the same 40 synthetic durations appear in each schedule. The x-axis is service order, not task identity. Source: retained simulation vector.',style='Caption')
p('No human participants, private records or third-party company data were used. The experiment required no clinical, animal or human-subject approval. This statement describes the sample, rather than asserting an institutional ethics determination.')
page();h('Results')
p(f'Total service time was {a["makespan"]} minutes under both policies. Mean waiting time fell by {a["mean_wait"]-b["mean_wait"]:.3f} minutes, from {a["mean_wait"]:.3f} to {b["mean_wait"]:.3f} minutes. Mean completion time fell by the same absolute amount because each task retained its service duration. Table 1 reports unrounded means to three decimal places; Figure 2 displays the mean-wait comparison.')
doc.add_paragraph('Table 1. Descriptive results for the same synthetic batch (n = 40 tasks). All time values are minutes.',style='Caption')
t=doc.add_table(rows=1,cols=3);t.style='Table Grid'
for c,v in zip(t.rows[0].cells,['Metric (minutes)','FIFO','SPT']):c.text=v
for label,key in [('Mean wait','mean_wait'),('Maximum wait','max_wait'),('Mean completion','mean_completion'),('Makespan','makespan')]:
    row=t.add_row().cells
    for c,v in zip(row,[label,f'{a[key]:.3f}',f'{b[key]:.3f}']):c.text=v
doc.add_picture(str(fig1),width=Inches(6.6))
doc.add_paragraph('Figure 2. Mean waiting time in the generated batch. Bars begin at zero and display minutes; labels round to one decimal place. The batch-specific reduction is 38.09%. Source: task-schedules.csv.',style='Caption')
p('The maximum waiting times were 565 minutes for FIFO and 542 minutes for SPT. These maxima refer to whichever task waited longest under each policy; they are not a matched task-level improvement. The last completion time remained 571 minutes, so the average-wait benefit did not increase server capacity.')
page();h('Discussion')
p('The result follows from the ordering mechanism. If two adjacent tasks have durations a greater than b and share a preceding workload W, serving a first creates combined completion time 2W + 2a + b. Reversing them creates 2W + 2b + a, which is smaller by a - b. Repeatedly removing such inversions produces ascending duration order. With all release times zero and equal weights, this also minimizes the sum of waiting times because the total service time is fixed. This argument explains the demonstration without treating a single synthetic run as statistical evidence.')
p('Exact processing-time knowledge is a strong assumption. Azar, Leonardi and Touitou [2] study flow-time scheduling with uncertain processing times, framing predicted duration as a separate problem. Our simulation does not evaluate their algorithms or their performance guarantees. It uses known durations solely to make each step checkable. Later arrivals, duration-estimation error, urgent tasks and fairness constraints would require a different design.')
p('Only one seed and one batch size were evaluated. We did not measure deadline adherence, satisfaction, scheduling overhead or task-specific disadvantage. A practical follow-up would retain task identifiers, vary arrival patterns and estimation error, and compare average delay alongside tail delay and service guarantees. The reported 38.09% reduction should therefore remain attached to this input vector.')
h('Conclusion')
p('For this synthetic batch, SPT reduced mean waiting time while leaving makespan unchanged. The retained inputs, schedules and calculation script make that narrow result reproducible. No conclusion about a real team or a generally expected percentage improvement follows from this sample.')
h('Availability and disclosures')
p('Data: inputs/simulation-results.json and inputs/task-schedules.csv. Method: build_samples.py with seed 20261022. This AI-assisted manuscript was prepared as a launch test; it has no external funding, named institutional affiliation or peer-review claim. All figures were calculated from the retained synthetic data.')
h('References')
p('[1] M. Bishop. Process Scheduling Algorithms. UC Davis, ECS 150 teaching handout, version 17 April 2022. https://nob.cs.ucdavis.edu/classes/ecs150-2022-02/handouts/sched1.html. Accessed 22 October 2026.')
p('[2] Y. Azar, S. Leonardi and N. Touitou. Flow Time Scheduling with Uncertain Processing Time. arXiv:2103.05604, 2021. https://doi.org/10.48550/arXiv.2103.05604. Title, authors and abstract verified 22 October 2026.')
doc.save(root/'artifacts/research-paper.docx')
print('Created research-paper.docx with four planned pages, two figures and one table.')
