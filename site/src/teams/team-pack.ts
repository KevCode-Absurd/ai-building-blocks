import {prepareTeamPlan} from './team-contract.mjs';
import {createRoleFlow} from '../roles/role-runtime';
import type {RoleProfile} from '../roles/role-types';
export async function downloadTeamPack(plan: any,approvedDigest?:string) {
 const prepared=await prepareTeamPlan(plan,{approved_digest:approvedDigest});
 const [{loadCatalogue},{buildHandoffZip},{download},{zipSync,unzipSync,strToU8}]=await Promise.all([import('../lib/data'),import('../lib/handoff'),import('../lib/download'),import('fflate')]);
 const catalogue=await loadCatalogue(),files:Record<string,Uint8Array>={};
 for(const [name,content]of Object.entries(prepared.files))files['team/'+name]=strToU8(content as string);
 for(const stage of prepared.plan.stages){
  const response=await fetch('/data/roles/'+stage.role_id+'.json');if(!response.ok)throw Error('The selected specialist could not load. Try again.');
  const role=await response.json() as RoleProfile;
  for(const method of stage.methods)if(!role.resources.some(r=>r.slug===method.slug&&r.revision===method.revision_sha256))throw Error('A method changed. Review the current team plan before downloading.');
  const goal=`${prepared.plan.goal}\n\nStage: ${stage.name}. ${stage.why}`;if(goal.length>3000)throw Error('Shorten the goal or stage notes before downloading the complete team.');
  const brief={goal,context:`Business/project: ${prepared.plan.business_id}. Read the reviewed team/plan.json and relevant context before this stage. Inputs: ${JSON.stringify(stage.inputs)}. Context: ${JSON.stringify(prepared.plan.context)}. Do not infer that files exist from their paths.`,tools:'Verify the tools and action scopes in the reviewed team plan. A downloaded pack does not connect services or execute actions.',training:'Reuse current scoped business preferences and checked feedback. Preserve the team plan, handoff contracts, source revisions and review gates.',me:'',deliverables:stage.outputs.map((o:any)=>`${o.name}: ${o.path} (${o.format})`),resources:role.resources.map(r=>r.slug)};
  if(brief.context.length>8000)throw Error('Shorten context references before downloading.');
  const flow=createRoleFlow(catalogue,role,brief,'team-'+stage.id),result=await buildHandoffZip(catalogue,flow);
  if('error'in result)throw Error(result.error);
  for(const [name,bytes]of Object.entries(unzipSync(new Uint8Array(await result.blob.arrayBuffer()))))files['stages/'+stage.id+'/'+name]=bytes;
 }
 files['START_HERE.md']=strToU8('# Your specialist team\n\nRead team/PRD.md, team/plan.json and team/approval.json. Each stage folder contains the complete worker, methods, references and licences. The host coordinator checks current context, exact plan approval, real tools and accepted handoffs before executing. Nothing has run merely because this pack exists. Keep task artifacts, checks and feedback in your authorized business project. No credentials or account permissions transfer with this pack.\n');
 const bytes=zipSync(files,{level:6});download(new Blob([bytes as BlobPart],{type:'application/zip'}),prepared.plan.id+'-team.zip');
 return {entries:Object.keys(files).length,stages:prepared.plan.stages.length};
}
