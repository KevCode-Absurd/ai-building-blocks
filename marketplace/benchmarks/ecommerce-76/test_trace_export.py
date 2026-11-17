import json,pathlib,tempfile,unittest
from export_traces import export,observable

class TraceTests(unittest.TestCase):
 def test_private_and_reasoning_records_are_excluded(self):
  for typ,payload in [('session_meta',{'creator_user_id':'private'}),('response_item',{'type':'reasoning','summary':'private'}),('response_item',{'type':'message','role':'developer','content':'private'}),('response_item',{'type':'message','role':'assistant','channel':'analysis','content':'private'}),('event_msg',{'type':'item_completed','item':{'reasoning':'private'}})]:
   self.assertIsNone(observable({'type':typ,'payload':payload}))
  row=observable({'type':'turn_context','payload':{'model':'observed-model','account':'private','summary':'private'}})
  self.assertEqual(row['payload'],{'model':'observed-model'})
 def test_tool_results_retain_text_but_not_embedded_image_bytes(self):
  row=observable({'type':'response_item','payload':{'type':'custom_tool_call_output','call_id':'c','output':[{'type':'text','text':'tool failed'},{'type':'image','data':'private-binary'}]}})
  self.assertEqual(row['payload']['output'][0]['text'],'tool failed')
  self.assertEqual(row['payload']['output'][1]['type'],'image_reference')
  self.assertNotIn('private-binary',json.dumps(row))
 def test_export_requires_both_parent_and_exact_dispatched_agent(self):
  with tempfile.TemporaryDirectory() as d:
   root=pathlib.Path(d);sessions=root/'logs';sessions.mkdir()
   (root/'dispatch.json').write_text(json.dumps([{'agent_id':'case','collaboration_task':'/root/bench_x'}]))
   for name,parent,agent in [('mine','p','/root/bench_x'),('other_parent','q','/root/bench_x'),('other_agent','p','/root/not_dispatched')]:
    meta={'type':'session_meta','payload':{'source':{'subagent':{'thread_spawn':{'parent_thread_id':parent,'agent_path':agent}}}}}
    message={'type':'response_item','payload':{'type':'message','role':'assistant','content':[{'type':'output_text','text':name}]}}
    (sessions/(name+'.jsonl')).write_text(json.dumps(meta)+'\n'+json.dumps(message)+'\n')
   rows=export(root,sessions,'p');self.assertEqual(len(rows),1)
   trace=(root/'traces/case.jsonl').read_text();self.assertIn('mine',trace);self.assertNotIn('other_',trace)

class BatchTraceTests(unittest.TestCase):
 def test_shared_batch_keeps_every_case_and_labels_scope(self):
  with tempfile.TemporaryDirectory() as d:
   root=pathlib.Path(d);sessions=root/'logs';sessions.mkdir()
   (root/'dispatch.json').write_text(json.dumps([{'agent_id':a,'collaboration_task':'/root/batch'} for a in ['one','two']]))
   meta={'type':'session_meta','payload':{'source':{'subagent':{'thread_spawn':{'parent_thread_id':'p','agent_path':'/root/batch'}}}}}
   (sessions/'batch.jsonl').write_text(json.dumps(meta)+'\n'+json.dumps({'type':'turn_context','payload':{'model':'test'}})+'\n')
   rows=export(root,sessions,'p')
   self.assertEqual([r['agent_id'] for r in rows],['one','two'])
   self.assertTrue(all(r['trace_scope']=='shared_batch' for r in rows))
   self.assertEqual(rows[0]['shared_batch_cases'],['one','two'])

if __name__=='__main__':unittest.main()
