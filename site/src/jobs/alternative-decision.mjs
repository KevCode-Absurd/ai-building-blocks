// Concise decision evidence, not hidden reasoning or an objective quality grade.
import {checkSchema} from '../outcomes/schema-check.mjs';
const list=value=>Array.isArray(value)?value:[];
const text=value=>typeof value==='string'&&value.trim().length>0;
export const ALTERNATIVE_DECISION_SCHEMA_ID='ai-blocks-alternative-decision/1';
const str=maxLength=>({type:'string',minLength:1,maxLength}),obj=(properties,required=Object.keys(properties))=>({type:'object',properties,required,additionalProperties:false}),rows=(items,maxItems=100)=>({type:'array',items,maxItems});
export const ALTERNATIVE_DECISION_SCHEMA={
  $schema:'https://json-schema.org/draft/2020-12/schema',$id:'https://useaiblocks.com/api/v1/schemas/ai-blocks-alternative-decision/1.json',title:ALTERNATIVE_DECISION_SCHEMA_ID,
  ...obj({schema:{const:ALTERNATIVE_DECISION_SCHEMA_ID},comparisons:rows(obj({route_id:str(120),proposal_sha256:{type:'string',pattern:'^[a-f0-9]{64}$'},strength:str(2000),tradeoff:str(2000),wins_if:str(2000),test:str(2000),criteria:rows(obj({id:str(120),status:{enum:['SUPPORTED','UNSUPPORTED','UNKNOWN']},basis:str(2000)}))}),5),chosen:rows(str(120),5),reason:str(4000),dissent:str(4000),retained_alternatives:rows(obj({route_id:str(120),wins_if:str(2000),next_test:str(2000)}),5),synthesis:str(4000),components:rows(obj({route_id:str(120),keep:str(2000),compatibility:str(2000)}),20)},['schema','comparisons','chosen','reason','retained_alternatives'])
};

/** Compare every frozen route against the same accepted criteria. UNKNOWN is
 * valid uncertainty; a blocking required criterion cannot be averaged away. */
export function validateAlternativeDecision(report,{routes,card={},council,required=false}={}){
  const errors=[],add=(path,message)=>errors.push({path,message});
  if(!report&&!required)return {ok:true,errors,assurance:'NOT_PROVIDED'};
  if(report){const issues=checkSchema(ALTERNATIVE_DECISION_SCHEMA,report);if(issues.length)return {ok:false,errors:issues.map(issue=>({path:`alternative_decision${issue.path?'.'+issue.path:''}`,message:issue.message})),assurance:'HOST_REPORTED_DECISION_NOT_QUALITY_PROOF'};}
  if(report?.schema!==ALTERNATIVE_DECISION_SCHEMA_ID||!Array.isArray(report.comparisons)||!Array.isArray(report.retained_alternatives)){
    add('alternative_decision',`Supply ${ALTERNATIVE_DECISION_SCHEMA_ID} with comparisons and retained_alternatives.`);
    return {ok:false,errors,assurance:'HOST_REPORTED_DECISION_NOT_QUALITY_PROOF'};
  }
  const board=list(routes?.routes??routes),criteria=list(card.acceptance),seen=new Set();
  for(const [i,row]of report.comparisons.entries()){
    const at=`alternative_decision.comparisons[${i}]`,route=board.find(route=>route.route_id===row?.route_id);
    if(!route||seen.has(row.route_id))add(at,'Compare each actual frozen route exactly once.');
    seen.add(row?.route_id);
    if(row?.proposal_sha256!==route?.draft_receipt?.sha256)add(`${at}.proposal_sha256`,'Compare the frozen original proposal hash, not a renamed or revised draft.');
    if(!text(row?.strength)||!text(row?.tradeoff)||!text(row?.wins_if)||!text(row?.test))add(at,'State the specific strength, cost/tradeoff, condition where this route wins and a discriminating test.');
    const checked=new Set();
    for(const result of list(row?.criteria)){
      if(!criteria.some(c=>c.id===result?.id)||checked.has(result?.id)||!['SUPPORTED','UNSUPPORTED','UNKNOWN'].includes(result?.status)||!text(result?.basis))add(`${at}.criteria`,'Use each accepted criterion once with SUPPORTED, UNSUPPORTED or UNKNOWN and concise evidence or limitation.');
      checked.add(result?.id);
    }
    if(criteria.some(criterion=>!checked.has(criterion.id)))add(`${at}.criteria`,'Every route must be compared against the same complete acceptance criteria.');
  }
  if(board.some(route=>!seen.has(route.route_id)))add('alternative_decision.comparisons','Do not omit the least popular or inconvenient frozen route.');
  const chosen=list(report.chosen),selected=new Set(chosen);
  if(!chosen.length||selected.size!==chosen.length||chosen.some(id=>!board.some(route=>route.route_id===id))||!text(report.reason))add('alternative_decision.chosen','Choose actual route IDs with a concise reason; preserve the distinction between choice and proof.');
  for(const row of report.comparisons.filter(row=>selected.has(row.route_id)))if(list(row.criteria).some(result=>result.status==='UNSUPPORTED'&&criteria.find(c=>c.id===result.id)?.critical===true))add('alternative_decision.chosen','A known failure of a critical criterion blocks this route; a high rank cannot override it.');
  if(council){
    const councilChosen=list(council.decision?.chosen).map(label=>list(council.proposals).find(proposal=>proposal.label===label)?.ref);
    if(chosen.length!==councilChosen.length||chosen.some(id=>!councilChosen.includes(id)))add('alternative_decision.chosen','The matrix and council must select the same route IDs.');
    if(council.decision?.dissent&&(!text(report.dissent)||report.dissent!==council.decision.dissent.verbatim))add('alternative_decision.dissent','Retain the actual strongest dissent without rewriting it into agreement.');
  }
  const retained=new Set();
  for(const alt of report.retained_alternatives){
    if(!board.some(route=>route.route_id===alt?.route_id)||selected.has(alt?.route_id)||retained.has(alt?.route_id)||!text(alt?.wins_if)||!text(alt?.next_test))add('alternative_decision.retained_alternatives','Retain real unchosen routes once, with their winning conditions and next test.');
    retained.add(alt?.route_id);
  }
  if(board.length>chosen.length&&!report.retained_alternatives.length)add('alternative_decision.retained_alternatives','Preserve at least the strongest alternative and what would change the decision.');
  if(chosen.length>1&&(!text(report.synthesis)||!list(report.components).length||report.components.some(row=>!selected.has(row?.route_id)||!text(row?.keep)||!text(row?.compatibility))))add('alternative_decision.synthesis','A hybrid must name kept components and their compatibility; averaging incompatible proposals is not a synthesis.');
  if(chosen.length>1&&chosen.some(id=>!list(report.components).some(component=>component.route_id===id)))add('alternative_decision.components','Every selected route must contribute an identified compatible component; selecting all labels is not a synthesis.');
  return {ok:errors.length===0,errors,assurance:'HOST_REPORTED_DECISION_NOT_QUALITY_PROOF'};
}

export function alternativeDecisionInstructions(){
  return 'Before debate, freeze independent full proposals and compare substantive route differences rather than style labels. At the council decision attach alternative_decision (ai-blocks-alternative-decision/1): each route_id and frozen proposal_sha256, strength, tradeoff, wins_if, discriminating test and criteria [{id,status:SUPPORTED|UNSUPPORTED|UNKNOWN,basis}] covering the same accepted criteria. chosen contains actual route IDs and reason; match the council selection, retain its exact dissent, and preserve the strongest unchosen route with wins_if and next_test. Critical known failures block selection. UNKNOWN remains uncertainty rather than a fabricated score. If combining routes, explain synthesis and components [{route_id,keep,compatibility}]. This is a concise decision receipt, not proof of quality or a requirement to produce private chain-of-thought.';
}
