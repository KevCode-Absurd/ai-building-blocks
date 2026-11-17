import copy
import json
import pathlib
import tempfile
import unittest
from unittest.mock import patch
from release_gate import digest, file_digest, inspect, output_files


class ReleaseGateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = pathlib.Path(self.temp.name)

    def write(self, name, value):
        target = self.root / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(value), encoding='utf8')

    def read(self, name):
        return json.loads((self.root / name).read_text())

    def fixture(self, count=2):
        ids = [f'agent-{i}' for i in range(count)]
        self.write('suite.json', {'tasks': [{'agent_id': a} for a in ids]})
        candidate = {'source_revision': 'a' * 40, 'source_snapshot_sha256': 'b' * 64,
                     'suite_sha256': file_digest(self.root / 'suite.json'),
                     'pack_sha256': {}, 'manifest_sha256': {}}
        dispatch, rows = [], []
        for aid in ids:
            case = self.root / 'cases' / aid
            (case / 'output').mkdir(parents=True)
            (case / 'request.txt').write_text('Make a concrete deliverable', encoding='utf8')
            (case / 'output' / 'answer.md').write_text('Actual generated artifact', encoding='utf8')
            pack = 'c' * 64
            manifest = {'agent_id': aid, 'zip_sha256': pack, 'files': {'request.txt': file_digest(case / 'request.txt')}}
            self.write(f'manifests/{aid}.json', manifest)
            candidate['pack_sha256'][aid] = pack
            candidate['manifest_sha256'][aid] = file_digest(self.root / f'manifests/{aid}.json')
            run = {'agent_id': aid, 'collaboration_task': '/root/generate-' + aid,
                   'dispatch_observed_utc': '2026-11-17T10:00:00Z', 'completion_observed_utc': '2026-11-17T10:01:00Z',
                   'completion': 'Observed native completed final message'}
            dispatch.append(run)
            files = output_files(case)
            self.write(f'completion-receipts/{aid}.json', {'agent_id': aid, 'snapshot_observed_utc': '2026-11-17T10:01:01Z', 'output_files': files})
            grade = {'agent_id': aid, 'verdict': 'PASS', 'reviewer': 'Independent artifact reviewer',
                     'evidence': ['Read actual answer and checked source data'], 'reviewed_utc': '2026-11-17T10:02:00Z',
                     'generator_task': run['collaboration_task'], 'reviewer_task': '/root/reviewer', 'output_digest': digest(files)}
            rows.append({'agent_id': aid, 'execution': 'COMPLETED', 'dispatch': run,
                         'grade': grade, 'protected_input_mutations': [], 'changes_since_completion_snapshot': [],
                         'pack_sha256': pack, 'output_files': files})
        self.write('release-candidate.json', candidate)
        self.write('dispatch.json', dispatch)
        self.write('results.json', {'rows': rows})
        return rows

    def check(self, count=2):
        return inspect(self.root, required_count=count)

    def test_exact_76_complete_reviewed_outputs_pass_without_authorizing_deployment(self):
        self.fixture(76)
        result = inspect(self.root)
        self.assertEqual(result['status'], 'PASS', result)
        self.assertFalse(result['deployment_authorized'])

    def test_default_cannot_certify_partial_suite(self):
        self.fixture()
        self.assertEqual(inspect(self.root)['status'], 'BLOCKED')

    def test_duplicate_rows_do_not_replace_a_missing_member(self):
        rows = self.fixture()
        self.write('results.json', {'rows': [rows[0], rows[0]]})
        self.assertEqual(self.check()['status'], 'BLOCKED')

    def test_mixed_candidate_and_unbound_manifest_are_blocked(self):
        rows = self.fixture()
        rows[0]['pack_sha256'] = 'd' * 64
        self.write('results.json', {'rows': rows})
        self.assertIn('Pack differs', ' '.join(self.check()['errors']))
        rows[0]['pack_sha256'] = 'c' * 64
        self.write('results.json', {'rows': rows})
        manifest = self.read('manifests/agent-0.json')
        manifest['files'] = {}
        self.write('manifests/agent-0.json', manifest)
        self.assertIn('Manifest changed', ' '.join(self.check()['errors']))

    def test_changed_outputs_cannot_pass_even_if_result_and_grade_are_rewritten(self):
        rows = self.fixture()
        case = self.root / 'cases/agent-0'
        (case / 'output/answer.md').write_text('Repaired after completion', encoding='utf8')
        files = output_files(case)
        rows[0]['output_files'] = files
        rows[0]['grade']['output_digest'] = digest(files)
        self.write('results.json', {'rows': rows})
        self.assertIn('First completion snapshot', ' '.join(self.check()['errors']))

    def test_changed_protected_input_is_read_from_disk_not_self_reported(self):
        self.fixture()
        (self.root / 'cases/agent-0/request.txt').write_text('Easier task', encoding='utf8')
        self.assertIn('Frozen input changed', ' '.join(self.check()['errors']))

    def test_missing_limited_or_self_reviewed_outputs_block(self):
        original = self.fixture()
        for mutate in [lambda row: row.pop('grade'),
                       lambda row: row['grade'].update(verdict='LIMITED_CAPABILITY'),
                       lambda row: row['grade'].update(reviewer_task=row['grade']['generator_task']),
                       lambda row: row['grade'].pop('generator_task'),
                       lambda row: row['grade'].update(generator_task='/root/another-generator'),
                       lambda row: row['grade'].update(evidence=[])]:
            with self.subTest(mutate=mutate):
                rows = copy.deepcopy(original)
                mutate(rows[0])
                self.write('results.json', {'rows': rows})
                self.assertEqual(self.check()['status'], 'BLOCKED')

    def test_dispatch_and_completion_receipts_are_required_and_bound(self):
        rows = self.fixture()
        original = copy.deepcopy(rows)
        rows[0]['dispatch']['collaboration_task'] = '/root/fake'
        self.write('results.json', {'rows': rows})
        self.assertIn('dispatch receipt differs', ' '.join(self.check()['errors']))
        self.write('results.json', {'rows': original})
        (self.root / 'completion-receipts/agent-0.json').unlink()
        self.assertEqual(self.check()['status'], 'BLOCKED')

    def test_stale_or_unzoned_review_timestamp_cannot_certify_new_run(self):
        original = self.fixture()
        for when in ['2026-11-16T10:00:00Z', '2026-11-17T10:02:00', True]:
            rows = copy.deepcopy(original)
            rows[0]['grade']['reviewed_utc'] = when
            self.write('results.json', {'rows': rows})
            self.assertEqual(self.check()['status'], 'BLOCKED')

    def test_reparse_point_detection_blocks_evidence_even_without_host_symlink_privilege(self):
        self.fixture()
        with patch('release_gate.linked', side_effect=lambda p: p.name == 'answer.md'):
            self.assertIn('symlink or junction', ' '.join(self.check()['errors']))

    def test_candidate_must_bind_all_manifests_and_suite_bytes(self):
        self.fixture()
        candidate = self.read('release-candidate.json')
        del candidate['manifest_sha256']['agent-0']
        self.write('release-candidate.json', candidate)
        self.assertEqual(self.check()['status'], 'BLOCKED')
        (self.root / 'suite.json').write_text('{"tasks": []}', encoding='utf8')
        self.assertEqual(self.check()['status'], 'BLOCKED')

    def test_unsafe_agent_and_manifest_paths_block_without_reading_outside(self):
        rows = self.fixture()
        rows[0]['agent_id'] = '../outside'
        self.write('results.json', {'rows': rows})
        self.assertIn('Invalid result', ' '.join(self.check()['errors']))
        rows[0]['agent_id'] = 'agent-0'
        self.write('results.json', {'rows': rows})
        manifest = self.read('manifests/agent-0.json')
        manifest['files']['../outside'] = 'e' * 64
        self.write('manifests/agent-0.json', manifest)
        candidate = self.read('release-candidate.json')
        candidate['manifest_sha256']['agent-0'] = file_digest(self.root / 'manifests/agent-0.json')
        self.write('release-candidate.json', candidate)
        self.assertIn('Unsafe relative path', ' '.join(self.check()['errors']))

    def test_duplicate_json_keys_and_malformed_roots_fail_closed(self):
        self.fixture()
        (self.root / 'results.json').write_text('{"rows":[],"rows":[]}', encoding='utf8')
        self.assertIn('Duplicate JSON key', ' '.join(self.check()['errors']))
        self.write('results.json', [])
        self.assertEqual(self.check()['status'], 'BLOCKED')

    def test_symlink_outputs_cannot_be_frozen_as_regular_evidence(self):
        self.fixture()
        outside = self.root / 'outside.txt'
        outside.write_text('outside', encoding='utf8')
        try:
            (self.root / 'cases/agent-0/output/linked.txt').symlink_to(outside)
        except OSError as error:
            self.skipTest(f'Host cannot create symlinks: {error}')
        self.assertIn('symlink or junction', ' '.join(self.check()['errors']))


if __name__ == '__main__':
    unittest.main()
