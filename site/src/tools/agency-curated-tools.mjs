// Selected deterministic utilities, implemented locally from reviewed task gaps.
import { AGENCY_BUSINESS_TOOLS } from './agency-business-tools.mjs';
import { AGENCY_RESEARCH_TOOLS } from './agency-research-tools.mjs';
import { AGENCY_TECHNICAL_TOOLS } from './agency-technical-tools.mjs';
const revision='b37b5bb33b78f2c1d6567d98e25ca818e3259219';
const extraSources={
 'coordinate-csv-checker':['gis/gis-qa-engineer.md','gis/gis-spatial-data-engineer.md'],
 'frame-budget-checker':['game-development/unity/unity-architect.md','spatial-computing/macos-spatial-metal-engineer.md'],
};
export const AGENCY_CURATED_TOOLS=[...AGENCY_BUSINESS_TOOLS,...AGENCY_RESEARCH_TOOLS,...AGENCY_TECHNICAL_TOOLS].map(tool=>{
 const sources=tool.sources??(tool.source?[tool.source]:(extraSources[tool.slug]??[]).map(path=>({repo:'msitarzewski/agency-agents',commit:revision,path,author:'Agency Agents contributors',licence:'MIT',url:`https://github.com/msitarzewski/agency-agents/blob/${revision}/${path}`})));
 const credits=sources.map(s=>`${s.author??s.by??'Agency Agents contributors'} (${s.licence??'MIT'}): ${s.url??`https://github.com/msitarzewski/agency-agents/blob/${revision}/${s.path}`}`).join(' ');
 return {...tool,sources,help:tool.help+' Method credit: '+credits+' This utility is an original local implementation of the selected task.'};
});
