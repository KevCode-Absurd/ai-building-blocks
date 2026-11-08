export function visualDelivery(artifacts:Array<{slot_id:string;sha256:string;maker_seat:string}>,options?:{reviewer?:string;renderer?:string}): {
  schema:string;renderer:string;receipt:string;reviewer_id:string;references:string[];
  items:Array<{slot_id:string;sha256:string;maker_id:string;status:string;reference_comparison:string;spec_comparison:string;checks:Array<{id:string;status:string;receipt:string;observed:string}>;compared_with:string[];observed_differences:Array<{axis:string;observation:string}>}>;
};
