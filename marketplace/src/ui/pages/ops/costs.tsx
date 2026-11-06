// /ops/costs: model spend by day, by purpose and by job, and today against the daily limit.
import { Card, Loaded, Notice, Page, Table, useLoad } from "../../components.tsx";
import { api } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import type { CostReport } from "../../../modules/ops/types.ts";
import { Bar, OpsNav, STATUS_WORDS, pct, usd } from "./shared.tsx";

function OpsCosts() {
  const state = useLoad(() => api<CostReport>("/api/ops/costs"), []);
  return (
    <Page title="Model costs" intro="What AI model calls cost, for the last 30 days." wide>
      <OpsNav />
      <Loaded state={state}>
        {c => {
          const top = Math.max(...c.days.map(d => d.usd), 0.000001);
          const nearLimit = c.today.share >= 0.8;
          return (
            <div class="stack ops-stack">
              <Card title="Today">
                <p class="ops-big">{usd(c.today.usd)} <span class="muted">of {usd(c.today.cap_usd)} daily limit</span></p>
                <Bar value={c.today.share} label={`${pct(c.today.share)} of the daily limit`} />
                <p class="ops-meta">{c.today.calls} model calls today ({c.today.day}, UTC).</p>
                {nearLimit && <Notice tone="warn">Today's spend is at {pct(c.today.share)} of the limit. At the limit, new AI work waits until tomorrow (UTC).</Notice>}
              </Card>
              <Card title="By day">
                <Table empty="No model calls in the last 30 days." head={["Day", "Spend", "", "Calls", "Failed calls"]} rows={c.days.map(d => [
                  d.day, usd(d.usd), <div class="ops-spark"><Bar value={d.usd / top} label={usd(d.usd)} /></div>, String(d.calls), d.failed ? <span class="field-error">{d.failed}</span> : "0",
                ])} />
              </Card>
              <Card title="By purpose">
                <Table empty="Nothing yet." head={["Used for", "Spend", "Calls", "Tokens in", "Tokens out"]} rows={c.purposes.map(p => [
                  <code>{p.purpose}</code>, usd(p.usd), String(p.calls), p.input_tokens.toLocaleString(), p.output_tokens.toLocaleString(),
                ])} />
              </Card>
              <Card title="Costliest jobs">
                <Table empty="No job spend yet." head={["Job", "Status", "Spend", "Calls"]} rows={c.jobs.map(j => [
                  <Link href={`/ops/jobs/${j.job_id}`}>{j.title}</Link>, j.status ? STATUS_WORDS[j.status as keyof typeof STATUS_WORDS] ?? j.status : "", usd(j.usd), String(j.calls),
                ])} />
              </Card>
              <p class="muted small">From {c.since}. Days are in UTC.</p>
            </div>
          );
        }}
      </Loaded>
    </Page>
  );
}

export { OpsCosts };
