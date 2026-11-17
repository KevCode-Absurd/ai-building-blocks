import unittest
from calibration import compare

class CalibrationTests(unittest.TestCase):
 def row(self,aid,verdict):return {'agent_id':aid,'pack_sha256':'pack','output_files':{'answer.md':{'sha256':'answer'}},'grade':{'verdict':verdict}}
 def label(self,aid,verdict):return {'agent_id':aid,'label_source':'human','reviewer':'owner','unit':'Answer, artifact, evidence and tool trace','verdict':verdict,'pack_sha256':'pack','answer_sha256':'answer'}
 def test_no_humans_is_not_a_perfect_score(self):
  r=compare({'rows':[self.row('a','PASS')]},[]);self.assertEqual(r['status'],'NOT_CALIBRATED');self.assertIsNone(r['agreement'])
 def test_missed_failures_and_false_alarms_are_separate(self):
  rows=[self.row('a','PASS'),self.row('b','NEEDS_REPAIR'),self.row('c','PASS'),self.row('d','NEEDS_REPAIR')]
  labels=[self.label('a','FAIL'),self.label('b','PASS'),self.label('c','PASS'),self.label('d','FAIL')]
  r=compare({'rows':rows},labels);self.assertEqual(r['confusion'],{'true_failure':1,'missed_failure':1,'false_alarm':1,'true_pass':1});self.assertEqual(r['agreement'],.5)
 def test_changed_answers_and_partial_reviews_are_excluded(self):
  a=self.label('a','PASS');a['answer_sha256']='old';b=self.label('b','PASS');b['unit']='Answer only'
  r=compare({'rows':[self.row('a','PASS'),self.row('b','PASS')]},[a,b]);self.assertEqual(r['n'],0);self.assertEqual(len(r['excluded']),2)
 def test_duplicates_require_adjudication(self):
  with self.assertRaises(ValueError):compare({'rows':[]},[self.label('a','PASS'),self.label('a','FAIL')])

if __name__=='__main__':unittest.main()
