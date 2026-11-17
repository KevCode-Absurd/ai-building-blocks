import pathlib,tempfile,unittest,json,subprocess,sys
from record_results import completion_receipt
class CompletionReceiptTests(unittest.TestCase):
 def test_repeated_completion_preserves_the_first_observation(self):
  with tempfile.TemporaryDirectory() as d:
   script=pathlib.Path(__file__).with_name('dispatch.py');root=pathlib.Path(d)
   def run(*args):subprocess.run([sys.executable,str(script),'--root',d,*args],check=True,capture_output=True)
   run('--start','case:/root/generator');run('--complete','case','--completion-note','First observed completion')
   first=(root/'dispatch.json').read_bytes()
   run('--complete','case','--completion-note','Repeated notification')
   self.assertEqual((root/'dispatch.json').read_bytes(),first)
   self.assertEqual(json.loads(first)[0]['completion'],'First observed completion')
 def test_later_repair_does_not_erase_first_observed_hash(self):
  with tempfile.TemporaryDirectory() as d:
   root=pathlib.Path(d);first={'answer.md':{'sha256':'old','bytes':3}}
   self.assertEqual(completion_receipt(root,'case',first),[])
   changed={'answer.md':{'sha256':'new','bytes':3},'extra.json':{'sha256':'x','bytes':1}}
   self.assertEqual(completion_receipt(root,'case',changed),['answer.md','extra.json'])
   self.assertEqual(completion_receipt(root,'case',{}),['answer.md'])
   self.assertIn('old',(root/'completion-receipts/case.json').read_text())
if __name__=='__main__':unittest.main()
