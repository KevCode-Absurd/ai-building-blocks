// Local stdio preview: the user's AI supplies inference. No hosted worker, private storage or model client.
import fs from 'node:fs';
import path from 'node:path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, ListResourceTemplatesRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { PublicCatalogueService, PublicApiError } from '../src/server/public-catalogue.ts';
import { createPreviewCatalogueSession } from './preview-catalogue-session.mjs';
import { PUBLIC_MCP_TOOLS } from '../src/server/public-mcp.ts';
import { createScopeMcpService, scopeMcpTools } from '../src/intake/request-scope-mcp.mjs';
import { callOutcomeTool, catalogueResolver, outcomeMcpTools, OUTCOME_INSTRUCTIONS } from '../src/outcomes/outcome-mcp.mjs';

const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || !['--catalogue-dir', '--catalogue-origin'].includes(args[0]))) throw Error('Use --catalogue-dir PATH or --catalogue-origin HTTPS_ORIGIN.');
const root = args[0] === '--catalogue-dir' ? fs.realpathSync(args[1]) : null;
const origin = new URL(args[0] === '--catalogue-origin' ? args[1] : 'https://useaiblocks.com');
if (origin.protocol !== 'https:' || origin.username || origin.password || origin.search || origin.hash || origin.pathname !== '/') throw Error('Use a bare HTTPS catalogue origin without credentials.');
const read = async asset => {
  if (!asset.startsWith('/') || asset.startsWith('//') || asset.split('/').some(s => s === '..' || s === '.') || new URL(asset, origin).origin !== origin.origin) throw Error('Invalid public asset path.');
  if (!root) return fetch(new URL(asset, origin), { method: 'GET', redirect: 'error', signal: AbortSignal.timeout(15000) });
  try {
    const file = fs.realpathSync(path.join(root, asset.slice(1)));
    if (!file.startsWith(root + path.sep)) throw Error('Asset outside catalogue directory.');
    return new Response(fs.readFileSync(file));
  } catch { return new Response('Public asset unavailable', { status: 404 }); }
};
const catalogueSession = createPreviewCatalogueSession(() => new PublicCatalogueService(read, origin.origin));
// Direct base-specialist loading is available alongside optional scoped planning.
const publicTools = PUBLIC_MCP_TOOLS.filter(t => !['prepare_specialist_team', ...scopeMcpTools.map(t => t.name)].includes(t.name));
// Outcome plans are composed by the host; submitted plans are checked against the live catalogue.
const tools = [...outcomeMcpTools, ...scopeMcpTools, ...publicTools];
const server = new Server({ name: 'ai-blocks-scoping-preview', version: '0.4.0' }, {
  capabilities: { tools: {}, resources: {} },
  instructions: OUTCOME_INSTRUCTIONS + ' ' + 'Deliver useful checked work in the host AI with local files by default. Recommendations are selectable work for our next orchestrator; use prepare_recommendation_handoff after a user choice. For a base specialist, use prepare_specialist with role_id only; the host asks missing task/output/context questions. For task-based discovery, use find_specialist, explain candidates and let the user accept or change the team. Scoping tools remain optional for tasks that need diagnosis; they are not prerequisites for downloading or loading a base role. Reuse relevant supplied facts and ask only unanswered questions. For specific tasks, prepare a direct scoped brief. For broad symptoms, reuse/build relevant project or business context, ask which permitted exports/read connections are available, map the relevant pipeline and subprocesses, separate supported findings from hypotheses, and prioritize diagnostic tests before fixes. The host AI performs analysis; this service only validates and prepares. Preserve source/date gaps and causal uncertainty. Call prepare_scoped_specialist_work, show the original request versus refined scope and priorities, then route ready work through route_scoped_specialist_work. Read complete candidate remits and methods before selecting them. Bind the ordered plan with prepare_scoped_specialist_team, show it, incorporate comments and get the exact plan reviewed. Real tools, permissions, accepted producer artifacts and required checks still govern execution. Scope approval is not plan approval. Keep private data out of routing_task. This local preview does not call a model, execute work, verify business conclusions, persist private records, publish or hire agents. Public catalogue assets are read with GET; private scope data stays in this local process.'
});
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
server.setRequestHandler(CallToolRequestSchema, async request => {
  if (!tools.some(t => t.name === request.params.name)) return { isError: true, content: [{ type: 'text', text: 'Unknown preview tool.' }] };
  if (outcomeMcpTools.some(t => t.name === request.params.name)) {
    try {
      const result = await catalogueSession.run(catalogue => callOutcomeTool(request.params.name, request.params.arguments ?? {}, { resolve: catalogueResolver(catalogue) }));
      return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
    } catch (error) { return { isError: true, content: [{ type: 'text', text: `${error.message} Nothing was executed or saved.` }] }; }
  }
  try {
    const result = await catalogueSession.run(catalogue => (scopeMcpTools.some(t => t.name === request.params.name) ? createScopeMcpService(catalogue) : catalogue).callTool(request.params.name, request.params.arguments ?? {}));
    return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
  } catch (error) {
    const detail = error instanceof PublicApiError ? `[${error.code}] ${error.message} ` : '';
    return { isError: true, content: [{ type: 'text', text: detail + 'Preparation failed. Check required scope fields, evidence/reference states, dependencies, exact digest and current catalogue availability. No work was executed or saved.' }] };
  }
});
server.setRequestHandler(ListResourcesRequestSchema, async () => ({ resources: [{ uri: 'aiblocks://roles', name: 'roles', mimeType: 'application/json' }] }));
server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({ resourceTemplates: [{ uriTemplate: 'aiblocks://roles/{id}', name: 'specialist role', mimeType: 'application/json' }] }));
server.setRequestHandler(ReadResourceRequestSchema, async request => catalogueSession.run(catalogue => catalogue.readResource(request.params.uri)));
await server.connect(new StdioServerTransport());
