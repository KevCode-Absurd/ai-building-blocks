// get_execution_plan tells an AI where to go next. A piece of work goes to one agent; only a goal goes to start_outcome.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {executionPlan} from '../src/modules/directory/execution.ts';

test('the execution plan sends a piece of work to one agent and only a bare goal to start_outcome', () => {
  const steps = executionPlan('Build a landing page for our store').resources.next_steps;
  assert.equal(steps.length, 4);
  assert.match(steps[0], /^A piece of work \(a page, ads, emails, an audit, a plan, code\): load one agent here with load_agent/);
  assert.match(steps[0], /It carries its own toolbox, so nothing needs searching\./);
  assert.match(steps[1], /^Work that mixes kinds .*start_job on the library MCP\. It names one lead and a maker for each kind\./);
  assert.match(steps[2], /^A business goal with no deliverable named yet .*start_outcome/);
  // start_outcome is never the first step for a deliverable, and nothing says to search the library first.
  assert.doesNotMatch(steps[0] + steps[1], /start_outcome/);
  assert.doesNotMatch(steps.join(' '), /front door|get_approaches|propose_team|search_library|brand brain/);
  const plan = executionPlan('Build a landing page for our store');
  assert.ok(plan.retrieval.steps.some((step: string) => /nothing searches the library during the job/.test(step)));
});
