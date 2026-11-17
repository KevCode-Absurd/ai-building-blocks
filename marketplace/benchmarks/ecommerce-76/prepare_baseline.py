"""Freeze a small matched host-only comparison; never copy specialist instructions or outputs."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil

SELECTED = ['margaret-job-orchestrator', 'radek-unit-economics', 'imogen-retention',
            'annabel-landing-pages', 'gretchen-store-testing', 'tendai-ad-creative', 'philippa-brand']

def prepare(source, destination):
    source, destination = Path(source).resolve(), Path(destination).resolve()
    if destination.exists():
        raise ValueError('Refusing to overwrite a comparison run')
    destination.mkdir(parents=True)
    (destination / 'manifests').mkdir()
    for aid in SELECTED:
        original = source / 'cases' / aid
        original_manifest = json.loads((source / 'manifests' / f'{aid}.json').read_text(encoding='utf-8'))
        case = destination / 'cases' / aid
        case.mkdir(parents=True)
        shutil.copytree(original / 'evidence', case / 'evidence')
        for file in (case / 'evidence').rglob('*'):
            if file.is_file():
                relative = file.relative_to(case).as_posix()
                assert hashlib.sha256(file.read_bytes()).hexdigest() == original_manifest['files'][relative], relative
        original_request = (original / 'request.txt').read_text(encoding='utf-8')
        matched = original_request[original_request.index('USER REQUEST:'):]
        wrapper = ('Complete the user task below using the available host tools. No specialist pack is supplied. '
                   'Do not inspect the parent repository, sibling cases, other agent outputs or graders. '
                   'Do not modify supplied evidence. You may keep working notes in context/.\n\n')
        (case / 'request.txt').write_text(wrapper + matched, encoding='utf-8')
        (case / 'output').mkdir()
        (case / 'context').mkdir()
        files = {f.relative_to(case).as_posix(): hashlib.sha256(f.read_bytes()).hexdigest()
                 for f in case.rglob('*') if f.is_file()}
        manifest = dict(agent_id=aid, arm='host-only', zip_sha256=None, files=files,
                        task=original_manifest['task'], matched_request_sha256=hashlib.sha256(matched.encode()).hexdigest(),
                        paired_pack_manifest=str(source / 'manifests' / f'{aid}.json'))
        (destination / 'manifests' / f'{aid}.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    protocol = dict(status='PREPARED_NOT_RUN', cases=SELECTED, selection='Seven domains selected before observing host-only outputs; development sample, not held out.',
                    matched='Identical user request, supplied material, execution constraints and evidence bytes. Host-only wrapper omits specialist instructions. Same desktop host tools and fresh context.',
                    treatment='Pack arm additionally receives downloaded specialist knowledge, instructions, tools and starter context. Host-only arm receives none of those.',
                    limits=['One trial per task, same host model only if native traces confirm identity.', 'No blinded human labels; root AI comparisons remain provisional.', 'Not a Claude Code comparison or evidence of universal superiority.', 'Compare final artifacts and concrete error categories; do not infer quality from self-scores.'])
    (destination / 'protocol.json').write_text(json.dumps(protocol, indent=2), encoding='utf-8')
    return len(SELECTED)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', required=True)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    print(json.dumps({'prepared': prepare(args.source, args.out)}))
