import pathlib,tempfile,unittest
from record_results import completion_receipt
class CompletionReceiptTests(unittest.TestCase):
 def test_later_repair_does_not_erase_first_observed_hash(self):
  with tempfile.TemporaryDirectory() as d:
   root=pathlib.Path(d);first={'answer.md':{'sha256':'old','bytes':3}}
   self.assertEqual(completion_receipt(root,'case',first),[])
   changed={'answer.md':{'sha256':'new','bytes':3},'extra.json':{'sha256':'x','bytes':1}}
   self.assertEqual(completion_receipt(root,'case',changed),['answer.md','extra.json'])
   self.assertEqual(completion_receipt(root,'case',{}),['answer.md'])
   self.assertIn('old',(root/'completion-receipts/case.json').read_text())
if __name__=='__main__':unittest.main()
