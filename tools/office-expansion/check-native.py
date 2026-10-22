import re,json,zipfile,xml.etree.ElementTree as ET,pathlib
p=pathlib.Path('tools/office-expansion/outputs/01a16276')
with zipfile.ZipFile(p/'office-monthly-example.xlsx') as z:
 x=[z.read(n) for n in z.namelist() if n.endswith('.xml')]; alltext=b''.join(x);assert b'R0001' in alltext
 assert len([n for n in z.namelist() if n.startswith('xl/tables/') and n.endswith('.xml')])==1
 assert b'dataValidation' in alltext and b'COUNTIFS' in alltext and b'SUMIFS' in alltext
with zipfile.ZipFile(p/'office-update-example.pptx') as z:
 names=z.namelist(); slides=[n for n in names if re.fullmatch(r'ppt/slides/slide[0-9]+\.xml',n)]; notes=[n for n in names if n.startswith('ppt/notesSlides/notesSlide') and n.endswith('.xml')]; charts=[n for n in names if '/charts/' in n and '/_rels/' not in n and n.endswith('.xml')]; embedded=[n for n in names if n.startswith('ppt/embeddings/') and n.endswith('.xlsx')]
 assert len(slides)==3 and len(notes)==3 and len(charts)==1 and len(embedded)==1
 chart=z.read(charts[0]);assert b'Jan 2026' in chart and b'Feb 2026' in chart
 ns={'c':'http://schemas.openxmlformats.org/drawingml/2006/chart'}
 series=ET.fromstring(chart).findall('.//c:ser',ns)
 values=[[float(v.text) for v in s.findall('./c:val//c:pt/c:v',ns)] for s in series]
 assert values==[[20.0,10.0],[12.0,3.0]], values
report={'status':'pass','xlsx':['text identifiers','table','validation','formulas'],'pptx':['3slides','3notes','native chart','embedded chart workbook','all chart series values match source population']}
(p/'native-package-checks.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
