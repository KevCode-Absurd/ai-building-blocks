export function workContext(artifacts?:Array<{sha256:string}>,mode?:'CREATE'|'IMPROVE'|'ASSESS'): {
  schema:string;mode:string;sources:Array<{id:string;ref:string;sha256:string;observed_at:string;role:string;currentness:string;freshness_basis:string;observations:string[];receipt:string}>;
  preserve:Array<{rule:string;source_id:string}>;
  changes:Array<{problem:string;source_ids:string[];proposed_change:string;expected_effect:string;verification:string}>;
  comparison:{method:string;pass_condition:string;unmeasured:string[];results?:Array<{criterion:string;baseline_observation:string;result_observation:string;status:string;receipt:string;artifact_sha256:string}>};
};
