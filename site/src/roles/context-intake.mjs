// Shared by the portable worker, copied launch brief and public API/MCP preparation.
export const CONTEXT_METHOD = 'website-brand-brain-builder';
export const BRAND_BRAIN_FILES = ['00-start-here.md','business.md','offers.md','customers.md','proof-and-claims.md','voice-and-look.md','market.md','log.md'];
// Each area builds the context its work depends on. Only brand-dependent work needs a brand brain.
export const CONTEXT_KINDS = {
 brand:{method:CONTEXT_METHOD,label:'brand brain',files:BRAND_BRAIN_FILES,
  ask:'existing brand brain or brief, brand/asset folder, website and relevant ad-library or reference links',
  build:'reuse a suitable existing folder or read the context method and its required references to build/update brand-brain/ with its eight files',
  focus:'For copy or media: read offers, claims, customer evidence and voice; verify exact product, current offer, attribution and real assets. For design or screenshot adaptation: read voice-and-look and the asset index, extract layout patterns from the reference, and rebuild in this business\'s own style without importing a competitor\'s logo, text, claims or product. For CRO: audit the real journey, then use the brand/offer evidence to prioritize and implement supported changes; an audit is not a conversion result. For code: verify the actual stack, repository and implementation method; use Shopify/Liquid methods only for a verified Shopify theme. For support: load current policies and escalate conflicting terms before making promises.'},
 project:{method:'agent-context-setter',label:'project context',files:['AGENTS.md or the project\'s existing rules file','work/file-map.md'],
  ask:'the repository or project folder, its stack and versions, how to run and test it, its coding rules and the exact change wanted',
  build:'read the existing rules file, README, package or build files and tests; if no rules file exists, use the context method to write a short one with a focused file map',
  focus:'Verify the actual stack, versions, run and test commands from the files, not from memory. Use platform-specific methods (for example Shopify/Liquid) only for a verified matching project. Record the files read and the commands that work.'},
 data:{method:'metric-definition-writer',label:'data definitions',files:['metrics/definitions.yaml','work/data-sources.md'],
  ask:'the data sources or exports, their date ranges and grain, the metric definitions already in use and the decision the analysis supports',
  build:'list each source with its period, grain and owner; use the context method to write down any metric whose definition is unclear before calculating it',
  focus:'Check row counts, date ranges, missing values, duplicates and definition changes before analysis. Keep raw sources unchanged and record every transformation.'},
 research:{method:'paper-repo-notes',label:'research notes',files:['research/question.md','research/sources.md'],
  ask:'the exact question and scope, the sources or notes you already have, the standard of evidence needed and what is invented or out of scope',
  build:'sort the supplied papers, notes and sources into claims, methods and evidence with the context method',
  focus:'Separate established findings, open debates and unknowns. Keep every source with its author, date and how strong it is. Never invent citations, quotes or page numbers.'},
 product:{method:'product-context-builder',label:'product context',files:['product-context.md','work/evidence.md'],
  ask:'what the product does, who it is for, current goals and constraints, and the user evidence available (research, tickets, analytics)',
  build:'reuse an existing product brief or use the context method to write a reviewed product context file from supplied facts',
  focus:'Separate user evidence from opinions and requests. Record goals, constraints, owners and decisions already made so they are not reopened by accident.'},
 personal:{method:'me-md-builder',label:'me.md',files:['me.md','work/context-check.md'],
  ask:'your role and goals, working preferences, current constraints and the files or records relevant to this job',
  build:'reuse the relevant slice of an existing me.md or use the context method to make one from supplied answers',
  focus:'Use only the parts of me.md that matter for this job. Keep personal and business records private and minimal. Check dates, names and figures against the supplied records.'},
};
const SECURITY_CODE=/engineer|code|app-|appsec|application-security|threat|pentest|penetration|devsecops|vulnerab|secure-|cloud|infrastructure|blockchain|smart-contract|incident|soc-|malware/;
// Data roles split into quantitative analysis and evidence research; the two need different context.
const QUANT=/statistic|data-|analy[sz]|metric|sql|dashboard|forecast|survey|experiment|a-b-|ab-test|numbers|spreadsheet|excel|model|bi-|gis-/;
export const practiceOf=(area,lead='',task='')=>area==='data'&&!QUANT.test(lead)&&!['analyse-data','track-numbers'].includes(task)?'research':area;
export function contextKindFor(area,lead='',task='') {
 if(practiceOf(area,lead,task)==='research')return 'research';
 if(['marketing','sales','commerce','support','design'].includes(area))return 'brand';
 if(area==='engineering')return 'project';
 if(area==='security')return SECURITY_CODE.test(lead)?'project':'personal';
 if(area==='data')return 'data';
 if(area==='product')return 'product';
 return 'personal';
}
export const CONTEXT_METHODS=[...new Set(Object.values(CONTEXT_KINDS).map(k=>k.method))];
export function contextIntakeContract(kind='brand') {
 const k=CONTEXT_KINDS[kind]??CONTEXT_KINDS.brand;
 return {
  state:'REVIEW_REQUIRED',assessed_by:'execution-host',service_verified:false,kind:CONTEXT_KINDS[kind]?kind:'brand',
  requirement:k.method===CONTEXT_METHOD?'Inspect relevant context before strategy or production. Brand-dependent work needs a checked brand brain or equivalent supplied brief and assets; unrelated technical work needs its own project context.':`Inspect relevant context before strategy or production. This role's work depends on its ${k.label}, not on brand research.`,
  method:k.method,files:k.files,
  discovery:'Read supplied facts, authorized me.md and the named business/project folder first. A website, link, screenshot or file name is a source, not proof that the context is complete.',
  missing:`Ask one concise batch for missing essentials: ${k.ask}. Reuse answers already supplied. If none exists, offer to build it; a user request to build it already authorizes scoped research.`,
  gate:`Read the complete context method before using it. Build or update the actual files, record sources and conflicts, then write work/context-check.md. Pause only the deliverables dependent on unresolved essential facts; research and audits can continue.${k.method===CONTEXT_METHOD?' Never mark a brand claim approved from a sales page alone.':''}`,
  reuse:`Save in the user-authorized project, index it in CONTEXT.md and log durable changes with their date${k.method===CONTEXT_METHOD?' in brand-brain/log.md':''}. Re-read the relevant current slice for every dependent task. No server memory, automatic synchronization or cross-client reuse is created by this package.`
 };
}
export function contextIntakeInstructions(kind='brand') {
 const c=contextIntakeContract(kind),k=CONTEXT_KINDS[c.kind];
 return `## Context before strategy and production\n\n${c.requirement}\n\n1. ${c.discovery}\n2. ${c.missing}\n3. If ${k.label} is needed, ${k.build}: skills/${k.method}/SKILL.md. Files: ${k.files.join(', ')}. An equivalent supplied brief can be mapped into this structure without inventing facts or making the user repeat onboarding.\n4. ${c.gate} Record scope, files actually read, source dates, confirmed/inferred/disputed/unknown facts, missing material, available tools and READY_FOR_SCOPED_WORK or NEEDS_INPUT. Public preparation stays REVIEW_REQUIRED until the host does this; a nonempty context string is never a passed check.\n5. ${c.reuse}\n\n${k.focus} Other roles gather the domain context their task needs; a database bug does not require a marketing research project.`;
}
