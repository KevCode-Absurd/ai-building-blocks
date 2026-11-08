// The quality contract is shared with the library Worker, not reimplemented here.
declare module '*execution-quality.mjs' {
  export function buildExecutionPlan(options?: { request?: string; job?: string; card?: any; tier?: string; host?: any }): any;
  export function executionQualityMethod(): string;
  export function validateProductionQuality(options?: { document?: any; card?: any; team?: any; plan?: any;require_trace?:boolean;catalogue?:any }): { ok: boolean; errors: { path: string; message: string }[]; assurance: string };
}
declare module '*jobs/contracts.mjs' {
  export function validateJobDocument(schema: string, document: unknown, context?: any): { ok: boolean; errors: {path: string; message: string}[]; warnings: {path: string; message: string}[] };
}

declare module '*native-execution.mjs' {
  export const NATIVE_CAPABILITIES:readonly string[];
  export function preflightNativeExecution(options?:{plan?:any;tools?:any[];allow_paid?:boolean;now?:number}):{schema:string;status:string;errors:{path:string;message:string;code:string}[];selected:any[];required:string[];model_calls:number;assurance:string;verification_limit:string};
}
