// Shared artifact comparisons. Records remain host reports, not semantic proof.
const list=value=>Array.isArray(value)?value:[];
const text=value=>typeof value==='string'&&!!value.trim();
const types=seat=>new Set([seat?.seat_type,...list(seat?.seat_types)]);
export const CONCEPT_AXES=Object.freeze(['audience','promise','proof','composition','visual_world']);
export const isControlledVariantRequest=request=>/\b(?:controlled variants?|single[ -]variable|one[ -]variable)\b|\b(?:vary|change|test)\s+(?:the\s+)?(?:headlines?|colou?rs?|cta|cropping|crops?)\s+only\b/i.test(request??'');
export const isRasterPath=value=>typeof value==='string'&&/\.(?:png|jpe?g|webp|avif|gif)$/i.test(value);
export function requiresRasterProduction(request='',job=''){
  const words=typeof request==='string'?request:'';
  const rendering=/\b(?:render|photograph|photoshoot|generate\s+(?:(?:the|an?|actual|final)\s+|\d+\s+)*images?|(?:create|produce|make)\s+(?:(?:the|actual|final)\s+|\d+\s+)*images|final[ -]images?|finished[ -]images?)\b/i.test(words);
  const supporting=/^\s*(?:please\s+)?(?:write|draft|audit|review|plan)\b/i.test(words)||/\b(?:create|make|produce|prepare)\s+(?:(?:the|an?)\s+|\d+\s+)*(?:copy|headlines?|captions?|scripts?|concepts?|briefs?|plans?)\b/i.test(words)||/\b(?:image[ -]?ads?|static[ -]?(?:ads?|creatives?)|ad[ -]?(?:creatives?|images?)|ads?|creatives?)\s+(?:copy|copywriting|headlines?|captions?|scripts?|concepts?|briefs?|plans?|audit|review)\b/i.test(words);
  const mixedImages=/\b(?:and|plus)\s+(?:(?:create|make|produce)\s+)?(?:(?:the|an?)\s+|\d+\s+)*(?:static\s+)?(?:image[ -]?ads?|static[ -]?ads?|images)\b/i.test(words);
  if(supporting&&!rendering&&!mixedImages)return false;
  if(/\b(?:svg|vector)\b/i.test(words)&&!/\b(?:ads?|raster|png|jpe?g)\b/i.test(words))return false;
  if(/\b(?:landing[ -]?pages?|website|web[ -]?app)\b/i.test(words)&&!rendering&&!/\b(?:ads?|creatives?)\b/i.test(words))return false;
  if(/\b(?:video|audio|podcast)\b/i.test(words)&&!(/\b(?:static|image|raster|png|jpe?g)\b/i.test(words)))return false;
  return job==='make-image-ads'||job==='make-images'||rendering||/\b(?:images?|image[ -]?ads?|static[ -]?(?:ads?|creatives?)|ad[ -]?images?|creatives?|ads?)\b/i.test(words);
}

export function validateImageDiversity({artifacts=[],review,team={},request='',focused=false}={}){
  const errors=[],add=(path,message)=>errors.push({path,message}),images=list(artifacts).filter(artifact=>artifact?.modality==='image');
  if(images.length<2||focused||isControlledVariantRequest(request))return {ok:true,errors};
  if(new Set(images.map(artifact=>artifact.sha256)).size!==images.length)add('document.artifacts.sha256','The varied image batch contains identical artifact hashes. Duplicate bytes cannot demonstrate distinct creatives.');
  const reviewer=list(team.seats).find(seat=>seat?.seat_id===review?.by_seat);
  if(!review||!text(review.receipt)||!reviewer||types(reviewer).has('maker'))add('document.diversity_review','A non-maker must inspect the actual image batch and record current-hash comparisons; planned format labels do not demonstrate output variety.');
  else {
    const rows=list(review.items);
    if(rows.length!==images.length||new Set(rows.map(row=>row?.slot_id)).size!==images.length)add('document.diversity_review.items','Compare every actual image output exactly once.');
    for(const artifact of images){
      const row=rows.find(item=>item?.slot_id===artifact.slot_id),comparisons=list(row?.compared_with);
      if(!row||row.sha256!==artifact.sha256||!comparisons.length||comparisons.some(id=>id===artifact.slot_id||!images.some(other=>other.slot_id===id))){add('document.diversity_review.items',`Record current SHA-256 and other real output IDs for ${artifact.slot_id}.`);continue;}
      const observed=list(row.observed_differences).filter(difference=>CONCEPT_AXES.includes(difference?.axis)&&text(difference.observation));
      if(new Set(observed.map(difference=>difference.axis)).size<2||!observed.some(difference=>['promise','proof','composition'].includes(difference.axis)))add('document.diversity_review.items',`Describe at least two observed substantive differences for ${artifact.slot_id}, including promise, proof or composition, not only a new style name.`);
    }
  }
  return {ok:errors.length===0,errors};
}
