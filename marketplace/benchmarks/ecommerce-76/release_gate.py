"""Require a complete, frozen, independently reviewed output run before release.

Evidence bookkeeping, not a quality judge or identity/permission authority.
Missing dependencies remain LIMITED_CAPABILITY, never passes.
"""
import argparse
import datetime
import hashlib
import json
import os
import pathlib
import re


HASH = re.compile(r"[0-9a-f]{64}\Z")
AGENT = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*\Z")


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def file_digest(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def linked(path):
    stat = path.lstat()
    return path.is_symlink() or bool(getattr(stat, 'st_file_attributes', 0) & 0x400)


def validate_relative(relative):
    require(isinstance(relative, str) and relative and ':' not in relative and '\\' not in relative
            and '\x00' not in relative and all(p not in ('', '.', '..') for p in relative.split('/')),
            'Unsafe relative path')


def safe_path(root, relative):
    validate_relative(relative)
    target = root
    for part in relative.split('/'):
        target = target / part
        require(not linked(target), 'Linked paths are not frozen evidence: ' + relative)
    require(target.resolve().is_relative_to(root.resolve()), 'Path escapes evidence root')
    return target


def timestamp(value):
    require(isinstance(value, str), 'Receipt timestamp missing or invalid')
    parsed = datetime.datetime.fromisoformat(value.replace('Z', '+00:00'))
    require(parsed.utcoffset() is not None, 'Receipt timestamp must include timezone')
    return parsed


def unique_object(pairs):
    value = {}
    for key, item in pairs:
        require(key not in value, 'Duplicate JSON key: ' + key)
        value[key] = item
    return value


def output_files(case):
    root = safe_path(case, 'output')
    files = {}
    for directory, directories, names in os.walk(root, followlinks=False):
        for name in directories + names:
            p = pathlib.Path(directory) / name
            require(not linked(p), 'Output contains a symlink or junction')
        for name in sorted(names):
            p = pathlib.Path(directory) / name
            require(p.is_file(), 'Output contains a nonregular file')
            files[p.relative_to(root).as_posix()] = {'sha256': file_digest(p), 'bytes': p.stat().st_size}
    return files


def inspect(root, required_count=76):
    root = pathlib.Path(root).resolve()
    def read(name):
        path = safe_path(root, name)
        require(path.is_file() and path.stat().st_size <= 64_000_000, 'Invalid or oversized evidence JSON')
        return json.loads(path.read_text(encoding='utf-8-sig'), object_pairs_hook=unique_object)
    errors = []
    try:
        suite, candidate, results = read('suite.json'), read('release-candidate.json'), read('results.json')
        require(isinstance(suite, dict) and isinstance(candidate, dict) and isinstance(results, dict), 'Evidence roots must be objects')
        tasks = suite.get('tasks')
        require(isinstance(tasks, list) and all(isinstance(t, dict) for t in tasks), 'Suite tasks must be objects')
        ids = [t.get('agent_id') for t in tasks]
        require(all(isinstance(a, str) and AGENT.fullmatch(a) for a in ids), 'Invalid suite agent identifier')
        require(len(ids) == required_count and len(set(ids)) == required_count, f'Expected exactly {required_count} distinct suite agents')
        require(candidate.get('suite_sha256') == file_digest(root / 'suite.json'), 'Suite changed after candidate freeze')
        require(isinstance(candidate.get('source_revision'), str) and candidate['source_revision'].strip(), 'Candidate source revision missing')
        require(isinstance(candidate.get('source_snapshot_sha256'), str) and HASH.fullmatch(candidate['source_snapshot_sha256']), 'Candidate source snapshot missing or invalid')
        for mapping in ('pack_sha256', 'manifest_sha256'):
            require(isinstance(candidate.get(mapping), dict) and set(candidate[mapping]) == set(ids)
                    and all(isinstance(v, str) and HASH.fullmatch(v) for v in candidate[mapping].values()),
                    'Candidate ' + mapping + ' must bind every suite member exactly once')
        rows = results.get('rows')
        require(isinstance(rows, list) and all(isinstance(r, dict) for r in rows), 'Results rows must be objects')
        row_ids = [r.get('agent_id') for r in rows]
        require(all(isinstance(a, str) and AGENT.fullmatch(a) for a in row_ids), 'Invalid result agent identifier')
        require(len(row_ids) == len(ids) and len(set(row_ids)) == len(ids) and set(row_ids) == set(ids), 'Result membership differs from frozen suite')
        dispatch = read('dispatch.json')
        require(isinstance(dispatch, list) and all(isinstance(d, dict) for d in dispatch), 'Dispatch ledger must contain objects')
        dispatch_ids = [d.get('agent_id') for d in dispatch]
        require(all(isinstance(a, str) and AGENT.fullmatch(a) for a in dispatch_ids)
                and len(dispatch_ids) == len(ids) and len(set(dispatch_ids)) == len(ids) and set(dispatch_ids) == set(ids), 'Dispatch membership differs from frozen suite')
        dispatched = {d['agent_id']: d for d in dispatch}
    except (OSError, ValueError, TypeError, KeyError) as error:
        return {'status': 'BLOCKED', 'errors': [str(error)], 'deployment_authorized': False}
    for row in rows:
        aid = row['agent_id']
        def fail(message):
            errors.append(f'{aid}: {message}')
        try:
            run = dispatched[aid]
            require(row.get('dispatch') == run and row.get('execution') == 'COMPLETED'
                    and isinstance(run.get('completion'), str) and run['completion'].strip()
                    and run.get('completion_observed_utc'), 'Actual host completion missing or dispatch receipt differs')
            generator = run.get('collaboration_task')
            grade = row.get('grade')
            require(isinstance(grade, dict), 'Review missing')
            require(grade.get('agent_id') == aid and grade.get('verdict') == 'PASS', 'Output verdict is not PASS for this agent')
            require(isinstance(grade.get('reviewer'), str) and grade['reviewer'].strip()
                    and isinstance(grade.get('evidence'), list) and grade['evidence']
                    and all(isinstance(e, str) and e.strip() for e in grade['evidence'])
                    and grade.get('reviewed_utc'), 'Artifact review evidence missing')
            require(isinstance(generator, str) and generator.strip() and grade.get('generator_task') == generator
                    and isinstance(grade.get('reviewer_task'), str) and grade['reviewer_task'].strip()
                    and grade['reviewer_task'] != generator, 'Separate generator/reviewer identity missing or mismatched')
            completed_at = timestamp(run.get('completion_observed_utc'))
            require(timestamp(run.get('dispatch_observed_utc')) <= completed_at <= timestamp(grade.get('reviewed_utc')),
                    'Review or completion predates the observed run')
            require(row.get('protected_input_mutations') == [] and row.get('changes_since_completion_snapshot') == [], 'Input/output integrity not clean')
            require(candidate['pack_sha256'][aid] == row.get('pack_sha256'), 'Pack differs from frozen release candidate')
            case = safe_path(root, 'cases/' + aid)
            files = output_files(case)
            require(files and 'answer.md' in files and files['answer.md']['bytes'] > 0, 'Actual user-facing output missing')
            require(files == row.get('output_files') and grade.get('output_digest') == digest(files), 'Current outputs do not match reviewed artifact hashes')
            completion = read('completion-receipts/' + aid + '.json')
            require(isinstance(completion, dict) and completion.get('agent_id') == aid and completion.get('snapshot_observed_utc')
                    and completion.get('output_files') == files, 'First completion snapshot missing or outputs changed')
            require(timestamp(completion['snapshot_observed_utc']) >= completed_at, 'Completion snapshot predates the observed completion')
            manifest_path = safe_path(root, 'manifests/' + aid + '.json')
            require(candidate['manifest_sha256'][aid] == file_digest(manifest_path), 'Manifest changed after candidate freeze')
            manifest = read('manifests/' + aid + '.json')
            require(isinstance(manifest, dict) and manifest.get('agent_id') == aid
                    and manifest.get('zip_sha256') == row['pack_sha256'], 'Manifest agent/pack digest mismatch')
            inputs = manifest.get('files')
            require(isinstance(inputs, dict) and inputs and all(isinstance(v, str) and HASH.fullmatch(v) for v in inputs.values()), 'Manifest inputs missing or invalid')
            for rel, expected in inputs.items():
                validate_relative(rel)
                if rel.startswith('context/'):
                    continue  # Explicit mutable working context; initial manifest itself stays frozen.
                target = safe_path(case, rel)
                require(target.is_file() and file_digest(target) == expected, 'Frozen input changed: ' + rel)
        except (OSError, ValueError, TypeError, KeyError) as error:
            fail(str(error))
    return {'status': 'PASS' if not errors else 'BLOCKED', 'agents': len(ids), 'errors': errors,
            'deployment_authorized': False,
            'assurance': 'Deterministic integrity/review-completeness check. Does not judge quality, authenticate reviewers, or grant deployment authority.'}


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--root', required=True)
    a = p.parse_args()
    result = inspect(pathlib.Path(a.root).resolve())
    print(json.dumps(result, indent=2))
    raise SystemExit(0 if result['status'] == 'PASS' else 1)
