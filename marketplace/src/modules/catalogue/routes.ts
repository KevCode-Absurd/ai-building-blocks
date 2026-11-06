import { fail, json, type Route } from "../../core/http.ts";
import { CATALOGUE_VERSION, getJobType, jobTypeSummary, listJobTypes, publicJobType } from "./index.ts";

export const routes: Route[] = [
  { method: "GET", path: "/api/catalogue", handler: () => json({ version: CATALOGUE_VERSION, job_types: listJobTypes().map(jobTypeSummary) }) },
  {
    method: "GET", path: "/api/catalogue/:id", handler: ctx => {
      const jt = getJobType(ctx.params.id);
      if (!jt) return fail(404, "job_type_not_found", "We do not offer that job yet.");
      return json({ version: CATALOGUE_VERSION, job_type: publicJobType(jt) });
    },
  },
];
