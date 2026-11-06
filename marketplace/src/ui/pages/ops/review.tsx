// /ops/review: blind tests against plain AI (overall, by agent, by job type), the reviewers' queue, and check pass rates.
import { Badge, Card, Loaded, Page, Table, useLoad } from "../../components.tsx";
import { api } from "../../lib/api.ts";
import { Link } from "../../lib/router.tsx";
import type { PassRateView, ReviewReport, WinRateView } from "../../../modules/ops/types.ts";
import { Bar, OpsNav, hoursText, pct } from "./shared.tsx";

function Tile(props: { label: string; value: string; note: string; progress?: number; met?: boolean; empty?: boolean; target?: string }) {
  return (
    <div class="ops-tile">
      <span class="ops-tile-label">{props.label}</span>
      <span class={`ops-tile-value${props.empty ? " ops-tile-empty" : ""}`}>{props.value}</span>
      {props.progress !== undefined && <Bar value={props.progress} met={props.met} label={`${props.label}: ${props.value}${props.target ? `, target ${props.target}` : ""}`} />}
      {props.target && <span class="ops-tile-target">Target {props.target} {props.met && <Badge tone="good">Met</Badge>}</span>}
      <span class="ops-meta">{props.note}</span>
    </div>
  );
}

/** "62% (8 of 13)", or a plain "No ... yet" when nothing has been counted. */
function passText(r: PassRateView | null | undefined, none = "No checks yet"): string {
  if (!r || !r.checks) return none;
  return `${pct(r.rate)} (${r.passed} of ${r.checks})`;
}

function winText(r: WinRateView): string {
  if (r.winRate === null) return r.tests ? "Only ties so far" : "No tests yet";
  return pct(r.winRate);
}

const hoursAgo = (iso: string | null) => (iso ? Math.max(0, (Date.now() - Date.parse(iso)) / 3_600_000) : null);

function OpsReview() {
  const state = useLoad(() => api<ReviewReport>("/api/ops/review"), []);
  return (
    <Page title="Quality" intro="How agent drafts do against plain AI, and how often drafts pass our checks." wide>
      <OpsNav />
      <Loaded state={state}>
        {r => {
          const o = r.overall;
          const wait = hoursAgo(r.queue.oldestOpenAt);
          const met = o.winRate !== null && o.winRate >= r.target;
          return (
            <div class="stack ops-stack">
              <div class="ops-gate">
                <Tile label="Agent wins against plain AI" value={winText(o)} empty={o.winRate === null} target={pct(r.target)}
                  progress={o.winRate === null ? 0 : o.winRate / r.target} met={met}
                  note={`From ${o.tests} finished blind ${o.tests === 1 ? "test" : "tests"}. Ties do not count.`} />
                <Tile label="Finished blind tests" value={String(r.queue.closed)}
                  note={`${r.queue.judgments} ${r.queue.judgments === 1 ? "pick" : "picks"} from ${r.queue.reviewers} ${r.queue.reviewers === 1 ? "reviewer" : "reviewers"} so far.`} />
                <Tile label="Waiting for reviewers" value={String(r.queue.open)}
                  note={r.queue.open
                    ? `${r.queue.stillNeeded} more ${r.queue.stillNeeded === 1 ? "pick is" : "picks are"} needed. The oldest has waited ${hoursText(wait)}.`
                    : "No pairs are waiting right now."} />
                <Tile label="Passed every check" value={r.checks.drafts ? pct(r.checks.allRate) : "No checks yet"} empty={!r.checks.drafts}
                  note={`${r.checks.allPassed} of ${r.checks.drafts} job ${r.checks.drafts === 1 ? "draft" : "drafts"} passed both the checklist and the policy check.`} />
              </div>

              <Card title="Blind tests">
                <p>Reviewers see two drafts for the same brief, with no labels. One is from an agent and one is from plain AI. They pick the better one, or say the two are about the same.</p>
                <p class="muted small">A test is finished once enough reviewers have picked (3 by default). The win rate counts only finished tests with a clear winner. {r.queue.open > 0 && <Link href="/review">Open the review page</Link>}</p>
                <dl class="ops-secondary">
                  <div><dt>Agent won</dt><dd>{o.agentWins}</dd></div>
                  <div><dt>Plain AI won</dt><dd>{o.baselineWins}</dd></div>
                  <div><dt>About the same</dt><dd>{o.ties}</dd></div>
                  <div><dt>Picks on finished tests</dt><dd>{o.judgments}</dd></div>
                  <div><dt>Picks on open tests</dt><dd>{r.queue.openJudgments}</dd></div>
                  <div><dt>AI judge agrees with reviewers</dt><dd>{r.agreement.tests ? `${pct(r.agreement.rate)} of ${r.agreement.tests}` : "No data yet"}</dd></div>
                </dl>
                <p class="muted small">Before a pair goes to reviewers, an AI judge also picks a winner. The last number shows how often it picks the same winner as the reviewers.</p>
              </Card>

              <Card title="By agent">
                <Table empty="No finished blind tests yet." head={["Agent", "Tests", "Agent won", "Plain AI won", "Same", "Win rate"]} rows={r.byAgent.map(a => [
                  <><strong>{a.label}</strong><div class="ops-meta"><code>{a.agent_id}</code></div></>,
                  String(a.tests), String(a.agentWins), String(a.baselineWins), String(a.ties),
                  a.winRate !== null && a.winRate >= r.target ? <Badge tone="good">{winText(a)}</Badge> : winText(a),
                ])} />
              </Card>

              <Card title="By job type">
                <Table empty="No tests or checks yet." head={["Job type", "Blind tests", "Win rate", "Checklist passed", "Policy check passed"]} rows={r.byJobType.map(j => [
                  <strong>{j.label}</strong>, String(j.tests), winText(j), passText(j.rubric), passText(j.policy),
                ])} />
              </Card>

              <Card title="Checks on job drafts">
                <p>Every job draft gets two checks before a person sees it. The checklist check is an AI from a different company than the writer. It scores the draft against the job's checklist and must quote the draft. The policy check looks for things a buyer must never get: made-up reviews or claims, promised results, leftover placeholders, contact details that are not in the brief, and personal medical, legal or money advice.</p>
                <dl class="ops-secondary">
                  <div><dt>Checklist passed</dt><dd>{passText(r.checks.rubric)}</dd></div>
                  <div><dt>Average checklist score</dt><dd>{r.checks.rubric.averageScore === null ? "No data yet" : pct(r.checks.rubric.averageScore)}</dd></div>
                  <div><dt>Policy check passed</dt><dd>{passText(r.checks.policy)}</dd></div>
                  <div><dt>Passed both</dt><dd>{r.checks.drafts ? `${pct(r.checks.allRate)} (${r.checks.allPassed} of ${r.checks.drafts})` : "No checks yet"}</dd></div>
                </dl>
                <p class="muted small">These count job drafts only, including reruns. Test bench drafts in the studio are not counted.</p>
              </Card>
            </div>
          );
        }}
      </Loaded>
    </Page>
  );
}

export { OpsReview };
