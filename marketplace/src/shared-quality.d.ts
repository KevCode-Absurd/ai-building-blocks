// The quality contract is shared with the library Worker, not reimplemented here.
declare module '*execution-quality.mjs' {
  export function buildExecutionPlan(options?: { request?: string; job?: string; card?: any; tier?: string; host?: any }): any;
  export function executionQualityMethod(): string;
  export function validateProductionQuality(options?: { document?: any; card?: any; team?: any; plan?: any }): { ok: boolean; errors: { path: string; message: string }[]; assurance: string };
}
declare module '*jobs/contracts.mjs' {
  export function validateJobDocument(schema: string, document: unknown, context?: any): { ok: boolean; errors: {path: string; message: string}[]; warnings: {path: string; message: string}[] };
}
