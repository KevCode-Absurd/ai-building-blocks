"""Inspect bundled tar archives without extraction, imports, package installation or code execution."""
from pathlib import Path, PurePosixPath
import tarfile, hashlib, json, re

results=[]
for archive in sorted(Path('catalogue-items').rglob('*.tar.gz')):
    entries=[]; problems=[]; candidates=[]; total=0
    with tarfile.open(archive, 'r:gz') as bundle:
        for member in bundle:
            name=member.name; parts=PurePosixPath(name).parts
            if name.startswith(('/', '\\')) or '..' in parts or '\\' in name or member.issym() or member.islnk() or member.isdev():
                problems.append({'name':name,'issue':'unsafe archive member'})
                continue
            if not member.isfile(): continue
            total+=member.size
            if member.size>25_000_000 or total>100_000_000: raise ValueError('Archive scan size cap exceeded')
            data=bundle.extractfile(member).read()
            entries.append({'name':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
            if re.search(r'\.(exe|dll|msi|pkl|pickle|wasm|jar)$',name,re.I): problems.append({'name':name,'issue':'executable member'})
            text=data.decode('utf-8',errors='replace')
            patterns=[('remote-shell',r'curl[^\n|]{0,250}\|\s*(?:ba)?sh'),('encoded-execution',r'(?:eval|exec)\s*\(\s*(?:atob|base64\.)'),('instruction-override',r'ignore (?:all )?(?:previous|system) instructions')]
            for rule,pattern in patterns:
                for match in re.finditer(pattern,text,re.I): candidates.append({'name':name,'line':text[:match.start()].count('\n')+1,'rule':rule})
    results.append({'archive':archive.as_posix(),'bytes':total,'members':len(entries),'problems':problems,'candidates':candidates,'entries':entries})
Path('reports/archive-audit.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
print(f'{len(results)} archives; {sum(x["members"] for x in results)} files; {sum(len(x["problems"]) for x in results)} structural risks; {sum(len(x["candidates"]) for x in results)} pattern candidates')
if any(x['problems'] for x in results): raise SystemExit(1)
