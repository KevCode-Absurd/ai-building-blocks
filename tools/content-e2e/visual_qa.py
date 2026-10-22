"""Rasterize delivered PDFs and create readable four-up contact sheets for inspection."""
import json
import re
import sys
from pathlib import Path
from PIL import Image,ImageDraw
from pdf2image import convert_from_path
from pypdf import PdfReader

root=Path(sys.argv[1]).resolve()
runtime=Path(sys.executable).parent.parent
manifest=runtime/'bin/override/native-executables.json'
poppler=(manifest.parent/json.loads(manifest.read_text())['pdftoppm']).resolve().parent
for pdf in (root/'artifacts').glob('*.pdf'):
    folder=root/'qa'/pdf.stem;folder.mkdir(exist_ok=True)
    images=convert_from_path(str(pdf),dpi=125,poppler_path=str(poppler))
    for n,image in enumerate(images,1):image.save(folder/f'page-{n}.png')
    print(f'{pdf.name}: {len(images)} pages; {len(PdfReader(pdf).pages)} PDF pages')
for folder in (root/'qa').iterdir():
    if not folder.is_dir():continue
    candidates=list(folder.glob('page-*.png')) or list(folder.glob('*.png'))
    pdf=root/'artifacts'/f'{folder.name}.pdf'
    if pdf.exists():
        count=len(PdfReader(pdf).pages)
        candidates=[p for p in candidates if int(re.search(r'(\d+)\.[^.]+$',p.name)[1])<=count]
    images=sorted(candidates,key=lambda p:int(re.search(r'(\d+)\.[^.]+$',p.name)[1]))
    for start in range(0,len(images),4):
        batch=images[start:start+4]
        thumbs=[]
        for path in batch:
            im=Image.open(path).convert('RGB');im.thumbnail((1000,1150))
            panel=Image.new('RGB',(1020,im.height+42),'#e5e7eb');panel.paste(im,((1020-im.width)//2,32))
            ImageDraw.Draw(panel).text((12,8),folder.name+' / '+path.stem,fill='black');thumbs.append(panel)
        height=max(x.height for x in thumbs)
        sheet=Image.new('RGB',(2040,height*((len(batch)+1)//2)),'#e5e7eb')
        for i,im in enumerate(thumbs):sheet.paste(im,((i%2)*1020,(i//2)*height))
        sheet.save(root/'qa'/f'{folder.name}-{start+1}-{start+len(batch)}.jpg',quality=90)
