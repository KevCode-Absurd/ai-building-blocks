import {test} from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import {randomUUID} from 'node:crypto';
import {TOOLS, EXAMPLES} from '../../mini-tools/index.mjs';
import {buildPython} from '../../mini-tools/skill.mjs';
import {checkPython, findPython} from '../../mini-tools/check.mjs';

const tool=TOOLS[0], examples=EXAMPLES[tool.slug], code=buildPython(tool);

test('missing Python executable fails with its launch diagnostic, never a formatting exception',()=>{
  const missing=path.join(os.tmpdir(),'missing-mini-python-'+randomUUID());
  const result=checkPython(tool,examples,code,missing);
  assert.equal(result.skipped,false);
  assert.equal(result.problems.length,1);
  assert.match(result.problems[0],/the code failed:.*ENOENT/);
});

const python=findPython();
test('the plain Python run remains a failed check when JSON examples pass', {skip:!python},()=>{
  const failPlain='import sys\nif "--json" not in sys.argv:\n    raise RuntimeError("synthetic plain-run failure")\n'+code;
  const result=checkPython(tool,examples,failPlain,python);
  assert.equal(result.skipped,false);
  assert.equal(result.problems.length,1);
  assert.match(result.problems[0],/printing the working failed: exit 1;.*synthetic plain-run failure/);
});
