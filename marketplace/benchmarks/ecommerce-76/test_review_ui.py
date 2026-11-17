import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from review_ui import build

class ReviewEncoding(unittest.TestCase):
    def test_invalid_answer_encoding_remains_reviewable_without_changing_artifact(self):
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)
            (root/'cases/x/output').mkdir(parents=True)
            (root/'cases/x/evidence').mkdir()
            (root/'manifests').mkdir()
            (root/'dispatch.json').write_text(json.dumps([{'agent_id':'x','completion':'observed'}]))
            (root/'manifests/x.json').write_text(json.dumps({'task':{'request':'Review work'},'zip_sha256':'pack'}))
            answer=root/'cases/x/output/answer.md'
            raw=b"Owner\x92s draft"
            answer.write_bytes(raw)
            self.assertEqual(build(root),1)
            page=(root/'human-review.html').read_text(encoding='utf-8')
            self.assertIn('Invalid UTF-8',page)
            self.assertIn(hashlib.sha256(raw).hexdigest(),page)
            self.assertEqual(answer.read_bytes(),raw)
