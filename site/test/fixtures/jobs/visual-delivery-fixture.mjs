// Synthetic inspection records exercise contracts, not actual creative quality.
export function visualDelivery(artifacts,{reviewer='s6',renderer='imagegen'}={}){
  return {schema:'ai-blocks-visual-delivery/1',renderer,receipt:'receipts/generation.json',reviewer_id:reviewer,references:['brand/reference.png'],items:artifacts.map(artifact=>({
    slot_id:artifact.slot_id,sha256:artifact.sha256,maker_id:artifact.maker_seat,status:'PASS',reference_comparison:'Synthetic reference inspection of the current product and brand.',spec_comparison:'Synthetic inspection of the accepted copy and composition.',
    checks:['brand','product_fidelity','claims_copy','format'].map(id=>({id,status:'PASS',receipt:`receipts/${artifact.slot_id}-${id}.json`,observed:`Synthetic observed ${id} check on the current artifact.`})),
    compared_with:artifacts.filter(other=>other.slot_id!==artifact.slot_id).map(other=>other.slot_id),observed_differences:[{axis:'proof',observation:'Different evidence demonstration in this synthetic concept.'},{axis:'composition',observation:'Different visual hierarchy and product arrangement.'}],
  }))};
}
