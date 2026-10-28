import {test} from 'node:test';
import assert from 'node:assert/strict';
import {gateSteps,runSteps,validateDeploymentConfig} from '../../tools/release.mjs';
const flags={PUBLIC_API_ENABLED:'true',MCP_OAUTH_ENABLED:'true',WORKFLOW_COMPOSER_ENABLED:'true'};
test('release stops on the first failed command and never reaches later work',async()=>{
 const ran=[];await assert.rejects(runSteps([['first'],['broken'],['never']],step=>{ran.push(step[0]);return {status:step[0]==='broken'?1:0};}),/Stopped at: broken/);assert.deepEqual(ran,['first','broken']);
});
test('an interrupted or unlaunchable release command also stops the sequence',async()=>{
 for(const result of [{status:null},{error:new Error('fixture')},undefined]){const ran=[];await assert.rejects(runSteps([['first'],['never']],step=>{ran.push(step[0]);return result;}));assert.deepEqual(ran,['first']);}
});
test('release order retains all old gates, including both indices and the generated check before units',()=>{
 assert.deepEqual(gateSteps.map(step=>step[0]),['Build minds','Index catalogue','Generate Before and After','Reindex catalogue','Check generated sections','Check source','Unit tests','Production build','SEO','Browser checks']);
 assert.ok(gateSteps.every(step=>!step[2].some(arg=>/lighthouse|--all|--baseline|deploy|screen-items/.test(arg))));
 assert.deepEqual(gateSteps.at(-1)[2],['playwright','test','--config','playwright.context.config.ts']);
});
test('deployment requires the actual API, OAuth and AI settings, ignoring comments',()=>{
 validateDeploymentConfig('// A valid JSONC comment\n'+JSON.stringify({vars:flags}),{pauseLatched:false});
 for(const name of Object.keys(flags))assert.throws(()=>validateDeploymentConfig('// "'+name+'": "true"\n'+JSON.stringify({vars:{...flags,[name]:'false'}}),null),/must stay enabled/);
 assert.throws(()=>validateDeploymentConfig('{bad',null),/invalid/);assert.throws(()=>validateDeploymentConfig(JSON.stringify({vars:{...flags,PUBLIC_API_ENABLED:true}}),null),/must stay enabled/);
});
test('a latched or malformed spending state cannot be resumed by deploying',()=>{
 const config=JSON.stringify({vars:flags});assert.throws(()=>validateDeploymentConfig(config,{pauseLatched:true}),/must not be resumed/);
 for(const state of [{},'unknown',{pauseLatched:'false'},[]])assert.throws(()=>validateDeploymentConfig(config,state),/unreadable/);
 validateDeploymentConfig(config,null);
});
