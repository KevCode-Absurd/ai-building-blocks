// Validate current host-reported static-ad inspection, never certify aesthetic
// quality or execute the renderer. Keep renderer and independent-review receipts.
import {validateImageDiversity,isRasterPath} from './image-quality.mjs';

const text={type:'string',minLength:1,maxLength:2000}, hash={type:'string',pattern:'^[a-f0-9]{64}$'};
const status={enum:['PASS','FAIL','NOT_RUN','BLOCKED']};
export const VISUAL_DELIVERY_CHECKS=Object.freeze(['brand','product_fidelity','claims_copy','format']);
export const VISUAL_DELIVERY_SCHEMA={
  $schema:'https://json-schema.org/draft/2020-12/schema',$id:'https://useaiblocks.com/api/v1/schemas/ai-blocks-visual-delivery/1.json',title:'ai-blocks-visual-delivery/1',
  type:'object',additionalProperties:false,required:['schema','renderer','receipt','reviewer_id','references','items'],
  properties:{schema:{const:'ai-blocks-visual-delivery/1'},renderer:text,receipt:text,reviewer_id:text,references:{type:'array',minItems:1,maxItems:30,items:text},items:{type:'array',minItems:1,maxItems:1000,items:{
    type:'object',additionalProperties:false,required:['slot_id','sha256','maker_id','status','reference_comparison','spec_comparison','checks'],
    properties:{slot_id:text,sha256:hash,maker_id:text,status,reference_comparison:text,spec_comparison:text,
      checks:{type:'array',minItems:1,maxItems:20,items:{type:'object',additionalProperties:false,required:['id','status','receipt','observed'],properties:{id:{enum:[...VISUAL_DELIVERY_CHECKS]},status,receipt:text,observed:text}}},
      compared_with:{type:'array',maxItems:1000,items:text},observed_differences:{type:'array',maxItems:5,items:{type:'object',additionalProperties:false,required:['axis','observation'],properties:{axis:{enum:['audience','promise','proof','composition','visual_world']},observation:text}}},
    },
  }}},
};
const list=v=>Array.isArray(v)?v:[], present=v=>typeof v==='string'&&!!v.trim();

/** Schema validation belongs to the caller; observations remain host reports.
 * Exact hashes, coverage and maker/reviewer separation are checked here.
 */
export function validateVisualDelivery(report,{artifacts=[],request='',focused=false}={}){
  const errors=[],add=(path,message)=>errors.push({path,message});
  if(!report||typeof report!=='object'||Array.isArray(report)){add('visual_delivery','Provide actual static-ad renderer and independent inspection receipts, not just output paths or PASS assertions.');return {ok:false,errors,assurance:'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED'};}
  if(report.schema!=='ai-blocks-visual-delivery/1'||!present(report.renderer)||!present(report.receipt)||!present(report.reviewer_id)||!list(report.references).some(present))add('visual_delivery','Identify the renderer, its receipt, independent reviewer and actual source references.');
  const rows=list(report.items), expected=list(artifacts), makers=new Set(rows.map(row=>row?.maker_id));
  if(makers.has(report.reviewer_id))add('visual_delivery.reviewer_id','The reviewer must be separate from every producer in this batch.');
  if(!expected.length||rows.length!==expected.length||new Set(rows.map(row=>row?.slot_id)).size!==expected.length)add('visual_delivery.items','Inspect every current image output exactly once.');
  for(const artifact of expected){
    const row=rows.find(row=>row?.slot_id===artifact?.slot_id);
    if(!artifact||artifact.modality!=='image'||(artifact.path!==undefined&&!isRasterPath(artifact.path))||!/^[a-f0-9]{64}$/.test(artifact.sha256??'')||!row||row.sha256!==artifact.sha256||!present(row.maker_id)||(artifact.maker_seat!==undefined&&row.maker_id!==artifact.maker_seat)){add('visual_delivery.items',`Inspection for ${artifact?.slot_id??'(missing)'} must identify its actual maker and match the current raster image artifact SHA-256. A ZIP or text file is not a rendered image.`);continue;}
    if(row.status!=='PASS'||!present(row.reference_comparison)||!present(row.spec_comparison))add('visual_delivery.items',`Record passing reference and specification comparisons for ${artifact.slot_id}.`);
    for(const id of VISUAL_DELIVERY_CHECKS){const checks=list(row.checks).filter(check=>check?.id===id);if(!checks.length||checks.some(check=>check.status!=='PASS'||!present(check.receipt)||!present(check.observed)))add('visual_delivery.items',`${artifact.slot_id} needs an observed passing ${id} check and its receipt.`);}
  }
  const quality=validateImageDiversity({artifacts:expected,review:{by_seat:report.reviewer_id,receipt:report.receipt,items:rows},request,focused,team:{seats:[{seat_id:report.reviewer_id,seat_types:['judge']},...[...makers].map(id=>({seat_id:id,seat_types:['maker']}))]}});
  errors.push(...quality.errors);
  return {ok:errors.length===0,errors,assurance:'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED'};
}
