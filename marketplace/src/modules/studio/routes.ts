// API routes for the studio module. Paths and owners are listed in ARCHITECTURE.md.
// Every /api/studio/* route is for an approved expert's own agents only: anyone else's agent is a 404.
// The three ops routes (live, retire, unretire) are for the AI Blocks team and work on any agent.
import { json, int, str, type Ctx, type Route } from "../../core/http.ts";
import { requireApprovedExpert, requireOps } from "../../core/access.ts";
import type { Env } from "../../env.ts";
import {
  addExample, addMark, answerInterview, buildVersion, createStudioAgent, decideSuggestion, draftPlaybook, getStudio, getVersion,
  listMyAgents, makeMarkupDraft, publishVersion, removeExample, removeMark, runTestBench, saveEdit, savePlaybook, setAgentLive, setAgentStatus, unretireAgent,
} from "./service.ts";
import { importPackRoute } from "./import.ts";

type Body = Record<string, unknown>;

async function expert(ctx: Ctx) {
  const a = await requireApprovedExpert(ctx);
  return { expertId: a.expert.id, actor: a.user.id, expertName: a.expert.display_name, account: a };
}

const optionalVersion = (v: unknown) => (v === undefined || v === null || v === "" ? undefined : int(v, "version", { min: 1, max: 100000 }));

export const routes: Route[] = [
  {
    method: "GET", path: "/api/studio/agents", handler: async ctx => {
      const a = await requireApprovedExpert(ctx);
      return json(await listMyAgents(ctx.env, a.expert));
    },
  },
  {
    method: "POST", path: "/api/studio/agents", handler: async ctx => {
      const a = await requireApprovedExpert(ctx);
      const body = await ctx.body<Body>();
      const jobTypeId = str(body.jobTypeId, "the job", { max: 80 });
      const name = typeof body.name === "string" && body.name.trim() ? body.name : undefined;
      return json({ agent: await createStudioAgent(ctx.env, { expert: a.expert, actor: a.user.id, jobTypeId, name }) }, 201);
    },
  },
  // Start an agent from a trained pack: body is the zip (application/zip, max 2 MB). See import.ts.
  { method: "POST", path: "/api/studio/import", handler: importPackRoute },
  {
    method: "GET", path: "/api/studio/agents/:id", handler: async ctx => {
      const e = await expert(ctx);
      return json(await getStudio(ctx.env, { expertId: e.expertId, agentId: ctx.params.id, benchVersion: optionalVersion(ctx.url.searchParams.get("version")) }));
    },
  },

  // Step 1: interview
  {
    method: "POST", path: "/api/studio/agents/:id/interview", handler: async ctx => {
      const e = await expert(ctx);
      const body = await ctx.body<Body>();
      const questionId = str(body.questionId, "the question", { max: 80 });
      return json({ interview: await answerInterview(ctx.env, { ...e, agentId: ctx.params.id, questionId, answer: body.answer, skip: body.skip === true }) });
    },
  },
  {
    method: "POST", path: "/api/studio/agents/:id/playbook/draft", handler: async ctx => {
      const e = await expert(ctx);
      return json({ interview: await draftPlaybook(ctx.env, { ...e, agentId: ctx.params.id }) });
    },
  },
  {
    method: "POST", path: "/api/studio/agents/:id/playbook", handler: async ctx => {
      const e = await expert(ctx);
      const body = await ctx.body<Body>();
      return json({ interview: await savePlaybook(ctx.env, { ...e, agentId: ctx.params.id, playbook: body.playbook }) });
    },
  },

  // Step 2: examples
  {
    method: "POST", path: "/api/studio/agents/:id/examples", handler: async ctx => {
      const e = await expert(ctx);
      return json({ examples: await addExample(ctx.env, { ...e, agentId: ctx.params.id, body: await ctx.body<Body>() }) }, 201);
    },
  },
  {
    method: "DELETE", path: "/api/studio/agents/:id/examples/:exampleId", handler: async ctx => {
      const e = await expert(ctx);
      return json({ examples: await removeExample(ctx.env, { ...e, agentId: ctx.params.id, exampleId: ctx.params.exampleId }) });
    },
  },

  // Step 3: mark up plain AI
  {
    method: "POST", path: "/api/studio/agents/:id/markup", handler: async ctx => {
      const e = await expert(ctx);
      const body = await ctx.body<Body>();
      const briefId = typeof body.briefId === "string" && body.briefId ? body.briefId : undefined;
      return json({ markup: await makeMarkupDraft(ctx.env, { ...e, agentId: ctx.params.id, briefId }) });
    },
  },
  {
    method: "POST", path: "/api/studio/agents/:id/marks", handler: async ctx => {
      const e = await expert(ctx);
      const body = await ctx.body<Body>();
      return json({ marks: await addMark(ctx.env, { ...e, agentId: ctx.params.id, passage: body.passage, reason: body.reason }) }, 201);
    },
  },
  {
    method: "DELETE", path: "/api/studio/agents/:id/marks/:markId", handler: async ctx => {
      const e = await expert(ctx);
      return json({ marks: await removeMark(ctx.env, { ...e, agentId: ctx.params.id, markId: ctx.params.markId }) });
    },
  },

  // Step 4: build
  {
    method: "POST", path: "/api/studio/agents/:id/build", handler: async ctx => {
      const e = await expert(ctx);
      const body = await ctx.body<Body>();
      return json({ build: await buildVersion(ctx.env, { ...e, agentId: ctx.params.id, changelog: body.changelog }) }, 201);
    },
  },
  {
    method: "GET", path: "/api/studio/agents/:id/versions/:version", handler: async ctx => {
      const e = await expert(ctx);
      return json(await getVersion(ctx.env, { expertId: e.expertId, agentId: ctx.params.id, version: int(ctx.params.version, "version", { min: 1 }) }));
    },
  },

  // Step 5: test bench
  {
    method: "POST", path: "/api/studio/agents/:id/test", handler: async ctx => {
      const e = await expert(ctx);
      const body = await ctx.body<Body>();
      return json({ bench: await runTestBench(ctx.env, { ...e, agentId: ctx.params.id, version: optionalVersion(body.version) }) });
    },
  },
  {
    method: "POST", path: "/api/studio/agents/:id/tests/:testId/edit", handler: async ctx => {
      const e = await expert(ctx);
      const body = await ctx.body<Body>();
      return json(await saveEdit(ctx.env, { ...e, agentId: ctx.params.id, testId: ctx.params.testId, edited: body.edited, reason: body.reason }), 201);
    },
  },
  {
    method: "POST", path: "/api/studio/agents/:id/suggestions/:suggestionId", handler: async ctx => {
      const e = await expert(ctx);
      const body = await ctx.body<Body>();
      return json({ suggestion: await decideSuggestion(ctx.env, { ...e, agentId: ctx.params.id, suggestionId: ctx.params.suggestionId, decision: body.decision, text: body.text }) });
    },
  },

  // Step 6: publish
  {
    method: "POST", path: "/api/studio/agents/:id/publish", handler: async ctx => {
      const e = await expert(ctx);
      const body = await ctx.body<Body>();
      return json({ agent: await publishVersion(ctx.env, { ...e, agentId: ctx.params.id, version: int(body.version, "version", { min: 1 }) }) });
    },
  },

  // Ops
  {
    method: "POST", path: "/api/studio/agents/:id/live", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<Body>();
      await setAgentLive(ctx.env, { agentId: ctx.params.id, version: int(body.version, "version", { min: 1 }), actor: a.user.id });
      return json({ ok: true });
    },
  },
  {
    method: "POST", path: "/api/studio/agents/:id/retire", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<Body>();
      await setAgentStatus(ctx.env, { agentId: ctx.params.id, status: "retired", actor: a.user.id, reason: str(body.reason, "a reason", { min: 3, max: 500 }) });
      return json({ ok: true });
    },
  },
  {
    method: "POST", path: "/api/studio/agents/:id/unretire", handler: async ctx => {
      const a = await requireOps(ctx);
      const body = await ctx.body<Body>();
      const reason = str(body.reason, "a note", { max: 500, optional: true });
      const res = await unretireAgent(ctx.env, { agentId: ctx.params.id, actor: a.user.id, reason });
      return json({ ok: true, ...res });
    },
  },
];

/** Work the 15-minute cron runs for this module. */
export const scheduled: ((env: Env) => Promise<void>)[] = [];
