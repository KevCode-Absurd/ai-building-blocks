// Separate entry point for an isolated preview database/domain. Production configuration stays unchanged.
import production from './worker.ts';
import { handleExpertAgentMcp } from './server/expert-agent-mcp.ts';

export default {
 async fetch(request:Request,env:Parameters<typeof production.fetch>[1]&{EXPERT_AGENTS_ENABLED?:string}){
  const expert=await handleExpertAgentMcp(request,env);
  return expert??production.fetch(request,env);
 }
};
